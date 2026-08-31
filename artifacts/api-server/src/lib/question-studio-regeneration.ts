import type {
  QuestionStudioEngineId,
  QuestionStudioGenerationRequest,
} from "../question-studio/engine-types";

export type RegenerationSource = {
  itemId: string;
  status: string;
  acceptedQuestionId: string | null;
  currentVersionNumber: number;
  runCode: string;
  requestSnapshot: Record<string, unknown>;
  payload: Record<string, unknown>;
};

export type RegenerationEligibility =
  | { eligible: true }
  | { eligible: false; code: "ALREADY_CONVERTED" | "STATUS_NOT_REGENERATABLE"; message: string };

export type RegenerationGenerationRequest = QuestionStudioGenerationRequest & {
  cpId?: string;
  archetypeId?: string;
};

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function engineId(value: unknown): QuestionStudioEngineId | undefined {
  const raw = asString(value);
  if (raw === "quant-v4" || raw === "language-v1" || raw === "knowledge-v1") {
    return raw;
  }
  return undefined;
}

export function getRegenerationEligibility(
  status: string,
  acceptedQuestionId: string | null,
): RegenerationEligibility {
  if (acceptedQuestionId) {
    return {
      eligible: false,
      code: "ALREADY_CONVERTED",
      message: "The generated item is already in Question Bank.",
    };
  }

  if (!new Set(["unreviewed", "needs_fix", "rejected"]).has(status)) {
    return {
      eligible: false,
      code: "STATUS_NOT_REGENERATABLE",
      message: `Items in ${status || "unknown"} status cannot be regenerated.`,
    };
  }

  return { eligible: true };
}

export function buildRegenerationRequest(
  source: RegenerationSource,
  seed: string,
): RegenerationGenerationRequest {
  const requestSnapshot = asRecord(source.requestSnapshot);
  const payload = asRecord(source.payload);
  const generationContext = asRecord(payload.generationContext);
  const metadata = asRecord(payload.metadata);
  const reviewMetadata = asRecord(payload.questionStudioReview);

  const packageId = asString(payload.packageId) || asString(requestSnapshot.packageId);
  const patternId = asString(payload.patternId) || asString(requestSnapshot.patternId);
  const canonicalProblemId =
    asString(payload.canonicalProblemId)
    || asString(metadata.canonicalProblemId)
    || asString(requestSnapshot.canonicalProblemId);
  const questionLanguageId =
    asString(payload.questionLanguageId)
    || asString(metadata.questionLanguageId)
    || asString(requestSnapshot.questionLanguageId);
  const difficulty =
    asString(payload.difficultyLabel)
    || asString(payload.difficulty)
    || asString(requestSnapshot.difficulty)
    || "Medium";
  const language =
    asString(payload.language)
    || asString(metadata.language)
    || asString(generationContext.language)
    || asString(requestSnapshot.language)
    || "en";
  const preservedEngineId =
    engineId(payload.engineId)
    || engineId(generationContext.engineId)
    || engineId(requestSnapshot.engineId);
  const runtimeMode =
    asString(payload.runtimeMode)
    || asString(reviewMetadata.runtimeMode)
    || asString(generationContext.runtimeMode)
    || asString(requestSnapshot.runtimeMode);
  const cpId =
    asString(payload.cpId)
    || asString(metadata.cpId)
    || asString(requestSnapshot.cpId);

  // The existing regeneration endpoint is Quant/Reasoning-specific. Never
  // allow a knowledge-v1 item to fall through it: that would bypass the
  // frozen Computer content/localization authority. Fix the canonical source
  // and create a fresh review run instead.
  if (preservedEngineId === "knowledge-v1" || packageId === "COM-001" || packageId === "COM-002") {
    throw new Error(
      "KNOWLEDGE_V1_REGENERATION_LOCKED: Computer Awareness is source-generator controlled; correct the canonical generator/localization source and create a new review batch.",
    );
  }

  return {
    engineId: preservedEngineId,
    exam: asString(requestSnapshot.exam) || undefined,
    subject: asString(requestSnapshot.subject) || undefined,
    packageId: packageId || undefined,
    patternId: patternId || undefined,
    topic: asString(payload.topic) || asString(requestSnapshot.topic) || undefined,
    subtopic: asString(payload.subtopic) || asString(requestSnapshot.subtopic) || undefined,
    canonicalProblemId: canonicalProblemId || undefined,
    questionLanguageId: questionLanguageId || undefined,
    difficulty,
    language: language === "hi" || language === "pa" ? language : "en",
    runtimeMode: runtimeMode || undefined,
    cpId: cpId || undefined,
    seed,
    count: 1,
  };
}

export function buildRegenerationPayload(
  generatedQuestion: Record<string, unknown>,
  generationContext: unknown,
  source: RegenerationSource,
  reason: string,
  regeneratedAt: string,
): Record<string, unknown> {
  return {
    ...generatedQuestion,
    generationContext,
    validationResult: "pending",
    regeneration: {
      sourceVersionNumber: source.currentVersionNumber,
      sourceRunCode: source.runCode,
      reason,
      regeneratedAt,
    },
  };
}
