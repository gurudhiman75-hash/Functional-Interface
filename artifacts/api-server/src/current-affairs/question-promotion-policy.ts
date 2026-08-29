import { createHash } from "node:crypto";

export type PromotionQuestionPayload = {
  stem: string;
  explanation: string;
  options: string[];
  correctIndex: number;
};

export type PromotionLocalizationSnapshot = {
  languageCode: "hi" | "pa";
  status: string;
  generationItemId: string;
  sourceGenerationVersionId: string;
  updatedAt: string;
  payload: unknown;
};

export type CurrentAffairsQuestionPromotionInput = {
  releaseStatus: string;
  releaseApprovedAt: string;
  generationItemId: string;
  generationItemStatus: string;
  currentSourceGenerationVersionId: string;
  frozenSourceGenerationVersionId: string;
  sourcePayload: unknown;
  hindi: PromotionLocalizationSnapshot;
  punjabi: PromotionLocalizationSnapshot;
};

export type CurrentAffairsQuestionPromotionReadiness = {
  ready: boolean;
  blockers: string[];
  source: PromotionQuestionPayload | null;
  hindi: PromotionQuestionPayload | null;
  punjabi: PromotionQuestionPayload | null;
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function text(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function booleanValue(value: unknown): boolean | null {
  if (value === true || value === false) return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return null;
}

export function promotionQuestionPayload(value: unknown): PromotionQuestionPayload | null {
  const payload = record(value);
  const stem = text(payload.stem) || text(payload.text);
  const explanation = text(payload.explanation);
  const options = Array.isArray(payload.options)
    ? payload.options.map((option) => text(option)).filter(Boolean)
    : [];
  const correctIndex = Number(payload.correctIndex ?? payload.correct);
  if (!stem || !explanation || options.length < 2 || options.length > 8) return null;
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) return null;
  return { stem, explanation, options, correctIndex };
}

export function promotionPayloadHash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function sameOptionShape(source: PromotionQuestionPayload, target: PromotionQuestionPayload): boolean {
  return source.options.length === target.options.length
    && source.correctIndex === target.correctIndex;
}

function validLocalization(
  input: CurrentAffairsQuestionPromotionInput,
  localization: PromotionLocalizationSnapshot,
  expectedLanguage: "hi" | "pa",
  source: PromotionQuestionPayload | null,
  blockers: string[],
): PromotionQuestionPayload | null {
  if (localization.languageCode !== expectedLanguage) {
    blockers.push(`${expectedLanguage.toUpperCase()} localization language identity is invalid`);
  }
  if (!(localization.status === "ready" || localization.status === "manual")) {
    blockers.push(`${expectedLanguage.toUpperCase()} localization is not parity-ready`);
  }
  if (localization.generationItemId !== input.generationItemId
      || localization.sourceGenerationVersionId !== input.frozenSourceGenerationVersionId) {
    blockers.push(`${expectedLanguage.toUpperCase()} localization is not tied to the frozen release question version`);
  }
  const approvedAt = new Date(input.releaseApprovedAt).getTime();
  const updatedAt = new Date(localization.updatedAt).getTime();
  if (!Number.isFinite(approvedAt) || !Number.isFinite(updatedAt) || updatedAt > approvedAt) {
    blockers.push(`${expectedLanguage.toUpperCase()} localization changed after release approval`);
  }
  const payloadRecord = record(localization.payload);
  if (text(payloadRecord.language).toLowerCase() !== expectedLanguage) {
    blockers.push(`${expectedLanguage.toUpperCase()} localized payload has the wrong language code`);
  }
  const parsed = promotionQuestionPayload(localization.payload);
  if (!parsed) {
    blockers.push(`${expectedLanguage.toUpperCase()} localized payload is not a valid single-choice question`);
    return null;
  }
  if (source && !sameOptionShape(source, parsed)) {
    blockers.push(`${expectedLanguage.toUpperCase()} localization changed option count or correct-answer index`);
  }
  return parsed;
}

export function evaluateCurrentAffairsQuestionPromotionReadiness(
  input: CurrentAffairsQuestionPromotionInput,
): CurrentAffairsQuestionPromotionReadiness {
  const blockers: string[] = [];
  if (input.releaseStatus !== "approved") {
    blockers.push("Question promotion requires an active approved Current Affairs release");
  }
  if (input.generationItemStatus !== "approved") {
    blockers.push("The frozen English generation item must still be editorially approved");
  }
  if (input.currentSourceGenerationVersionId !== input.frozenSourceGenerationVersionId) {
    blockers.push("The English generation item changed after Current Affairs release approval");
  }

  const sourceRecord = record(input.sourcePayload);
  const generation = record(sourceRecord.generationContext);
  const acceptanceMode = text(generation.questionBankAcceptanceMode ?? sourceRecord.questionBankAcceptanceMode).toUpperCase();
  const publiclyPublishable = booleanValue(generation.publiclyPublishable ?? sourceRecord.publiclyPublishable);
  const automaticStudentPublication = booleanValue(
    generation.automaticStudentPublication ?? sourceRecord.automaticStudentPublication,
  );
  if (acceptanceMode !== "BANK_ONLY") {
    blockers.push("CP015 only promotes Current Affairs questions using the BANK_ONLY lifecycle");
  }
  if (publiclyPublishable !== false || automaticStudentPublication !== false) {
    blockers.push("CP015 source question must keep public and automatic student publication closed");
  }

  const source = promotionQuestionPayload(input.sourcePayload);
  if (!source) blockers.push("Frozen English release payload is not a valid single-choice question");
  const hindi = validLocalization(input, input.hindi, "hi", source, blockers);
  const punjabi = validLocalization(input, input.punjabi, "pa", source, blockers);

  return {
    ready: blockers.length === 0,
    blockers,
    source,
    hindi,
    punjabi,
  };
}
