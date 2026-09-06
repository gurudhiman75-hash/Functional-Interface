import type {
  QuantV4Difficulty,
  QuantV4GenerationRequest,
  QuantV4Language,
  QuantV4PackageId,
} from "../quant-v4/generation-engine";

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

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
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
): QuantV4GenerationRequest {
  const requestSnapshot = asRecord(source.requestSnapshot);
  const payload = asRecord(source.payload);
  const generationContext = asRecord(payload.generationContext);
  const packageId = asString(payload.packageId) || asString(requestSnapshot.packageId);
  const patternId = asString(payload.patternId) || asString(requestSnapshot.patternId);
  const canonicalProblemId =
    asString(payload.canonicalProblemId)
    || asString(asRecord(payload.metadata).canonicalProblemId)
    || asString(requestSnapshot.canonicalProblemId);
  const questionLanguageId =
    asString(payload.questionLanguageId)
    || asString(asRecord(payload.metadata).questionLanguageId);
  const difficulty =
    asString(payload.difficultyLabel)
    || asString(payload.difficulty)
    || asString(requestSnapshot.difficulty)
    || "Medium";
  const language =
    asString(payload.language)
    || asString(asRecord(payload.metadata).language)
    || asString(requestSnapshot.language)
    || "en";
  const preservedEngineId =
    asString(payload.engineId)
    || asString(generationContext.engineId)
    || asString(requestSnapshot.engineId);

  // This regeneration helper is the established Quant/Reasoning path. Frozen
  // knowledge-v1 content must never fall through it because doing so would
  // bypass source-controlled Computer authorities and create an ungoverned
  // mutation. Corrections belong in the canonical source followed by a fresh
  // review batch.
  if (preservedEngineId === "knowledge-v1") {
    throw new Error(
      "KNOWLEDGE_V1_REGENERATION_LOCKED: Computer Awareness is source-generator controlled; correct the canonical generator/localization source and create a new review batch.",
    );
  }

  return {
    packageId: packageId ? packageId as QuantV4PackageId : undefined,
    patternId: patternId || undefined,
    topic: asString(payload.topic) || asString(requestSnapshot.topic) || undefined,
    subtopic: asString(payload.subtopic) || asString(requestSnapshot.subtopic) || undefined,
    canonicalProblemId: canonicalProblemId || undefined,
    questionLanguageId: questionLanguageId || undefined,
    difficulty: difficulty as QuantV4Difficulty,
    language: language as QuantV4Language,
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
