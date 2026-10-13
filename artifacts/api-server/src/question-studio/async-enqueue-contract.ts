// Pure, independently testable identity and request hashing for the opt-in
// durable Question Studio enqueue flow. No DB, network or task mutations.
import { createHash } from "node:crypto";
import type { UniversalStudioComputeInput } from "./universal-executor";

export type EnqueueIdentity = {
  actorFirebaseUid: string;
  idempotencyKey: string;
  identityUserId?: string | null;
};

export type CanonicalEnqueueInput = {
  identity: EnqueueIdentity;
  compute: UniversalStudioComputeInput;
};

export class EnqueueValidationError extends Error {
  readonly statusCode: number;
  readonly code: string;
  constructor(code: string, message: string, statusCode = 400) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(value).filter(([,v]) => v !== undefined)
        .sort(([a],[b]) => a.localeCompare(b))
        .map(([key,val]) => [key, stable(val)]),
    );
  }
  return value;
}

export function assertEnqueueIdentity(value: EnqueueIdentity) {
  if (typeof value?.actorFirebaseUid !== "string" ||
      !/^[a-zA-Z0-9:_-]{1,128}$/.test(value.actorFirebaseUid)) {
    throw new EnqueueValidationError("INVALID_ENQUEUE_ACTOR", "Authenticated admin identity required");
  }
  if (typeof value.idempotencyKey !== "string" ||
      !/^[a-zA-Z0-9:_-]{8,128}$/.test(value.idempotencyKey)) {
    throw new EnqueueValidationError("INVALID_IDEMPOTENCY_KEY", "A stable request idempotency key is required");
  }
  if (value.identityUserId != null &&
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.identityUserId)) {
    throw new EnqueueValidationError("INVALID_ENQUEUE_IDENTITY_ID", "Invalid administrator identity ID");
  }
}

export function canonicalEnqueueRequest(input: UniversalStudioComputeInput) {
  if (!input || typeof input !== "object") {
    throw new EnqueueValidationError("INVALID_ENQUEUE_COMPUTE_REQUEST", "Canonical generation request required");
  }
  const req=input.request;
  if (!req || typeof req !== "object") {
    throw new EnqueueValidationError("INVALID_ENQUEUE_COMPUTE_REQUEST", "Canonical generation request required");
  }
  // Only the known Question Studio request fields are persisted. Never accept
  // session tokens, raw authorization headers or arbitrary client fields.
  const request = {
    engineId: req.engineId, packageId: req.packageId, canonicalProblemId: req.canonicalProblemId,
    questionLanguageId: req.questionLanguageId, exam: req.exam, examProfile: req.examProfile,
    subject: req.subject, topic: req.topic, subtopic: req.subtopic, language: req.language,
    difficulty: req.difficulty, count: req.count, seed: req.seed, runtimeMode: req.runtimeMode,
    patternId: req.patternId,
  };
  return stable({
    request,
    count: input.count,
    selectedCpIds: input.selectedCpIds,
    examProfileId: input.examProfileId,
    difficultyPreset: input.difficultyPreset,
    difficultyDistribution: input.difficultyDistribution,
    forwardLegacyExamProfile: input.forwardLegacyExamProfile,
    difficultyFilterSupported: input.difficultyFilterSupported,
  }) as UniversalStudioComputeInput;
}

export function digestCanonicalEnqueueRequest(input: UniversalStudioComputeInput): string {
  return createHash("sha256").update(JSON.stringify(canonicalEnqueueRequest(input))).digest("hex");
}
