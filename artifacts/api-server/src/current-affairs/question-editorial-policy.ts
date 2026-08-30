export type QuestionEditorialLanguage = "hi" | "pa";

export type QuestionEditorialLocalizationSnapshot = {
  id?: string | null;
  languageCode: QuestionEditorialLanguage;
  status: string;
  generationItemId: string;
  sourceGenerationVersionId: string;
  payload: Record<string, unknown> | null;
};

export type CurrentAffairsQuestionEditorialInput = {
  generationItemId: string;
  generationItemStatus: string;
  currentSourceGenerationVersionId: string;
  sourcePayload: Record<string, unknown>;
  questionFamily: string;
  factValue: string;
  eventVerified: boolean;
  hasOpenConflict: boolean;
  acceptedQuestionId?: string | null;
  activePromotion: boolean;
  activeApprovedRelease: boolean;
  expectedHindiOptions?: string[];
  expectedPunjabiOptions?: string[];
  hindi?: QuestionEditorialLocalizationSnapshot | null;
  punjabi?: QuestionEditorialLocalizationSnapshot | null;
};

export type CurrentAffairsQuestionEditorialReadiness = {
  editable: boolean;
  approvable: boolean;
  blockers: string[];
  checks: {
    lifecycleUnlocked: boolean;
    eventVerified: boolean;
    conflictFree: boolean;
    englishBankOnly: boolean;
    englishAnswerValid: boolean;
    canonicalFactPreserved: boolean;
    hindiCurrent: boolean;
    punjabiCurrent: boolean;
    answerParity: boolean;
    optionSemanticParity: boolean;
  };
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function options(payload: Record<string, unknown>): string[] {
  return Array.isArray(payload.options)
    ? payload.options.map((item) => String(item ?? "").replace(/\s+/g, " ").trim()).filter(Boolean)
    : [];
}

function correctIndex(payload: Record<string, unknown>): number {
  const parsed = Number(payload.correctIndex);
  return Number.isInteger(parsed) ? parsed : -1;
}

function bankOnly(payload: Record<string, unknown>): boolean {
  const context = record(payload.generationContext);
  return context.questionBankAcceptanceMode === "BANK_ONLY"
    && context.publiclyPublishable === false
    && context.automaticStudentPublication === false;
}

function factPreserved(payload: Record<string, unknown>, factValue: string): boolean {
  const fact = factValue.replace(/\s+/g, " ").trim();
  if (!fact) return false;
  const composite = [
    String(payload.stem ?? payload.text ?? ""),
    String(payload.explanation ?? ""),
    ...options(payload),
  ].join(" ").replace(/\s+/g, " ");
  return composite.includes(fact);
}

function localizationCurrent(
  snapshot: QuestionEditorialLocalizationSnapshot | null | undefined,
  languageCode: QuestionEditorialLanguage,
  generationItemId: string,
  sourceGenerationVersionId: string,
): boolean {
  if (!snapshot) return false;
  return snapshot.languageCode === languageCode
    && ["ready", "manual"].includes(snapshot.status)
    && snapshot.generationItemId === generationItemId
    && snapshot.sourceGenerationVersionId === sourceGenerationVersionId
    && Boolean(snapshot.payload);
}

function localizationAnswerParity(
  sourcePayload: Record<string, unknown>,
  snapshot: QuestionEditorialLocalizationSnapshot | null | undefined,
): boolean {
  if (!snapshot?.payload) return false;
  const sourceOptions = options(sourcePayload);
  const localizedOptions = options(snapshot.payload);
  const sourceCorrectIndex = correctIndex(sourcePayload);
  return sourceCorrectIndex >= 0
    && sourceCorrectIndex < sourceOptions.length
    && sourceCorrectIndex === correctIndex(snapshot.payload)
    && localizedOptions.length === sourceOptions.length
    && bankOnly(snapshot.payload);
}

function exactOptions(actual: string[], expected: string[]): boolean {
  return actual.length === expected.length && actual.every((value, index) => value === expected[index]);
}

function semanticOptionParity(input: CurrentAffairsQuestionEditorialInput): boolean {
  if (!input.hindi?.payload || !input.punjabi?.payload) return false;
  const source = options(input.sourcePayload);
  const hindi = options(input.hindi.payload);
  const punjabi = options(input.punjabi.payload);
  if (input.questionFamily === "CA-QL-001") {
    return exactOptions(hindi, source) && exactOptions(punjabi, source);
  }
  if (input.questionFamily === "CA-QL-002") {
    const expectedHindi = input.expectedHindiOptions ?? [];
    const expectedPunjabi = input.expectedPunjabiOptions ?? [];
    return expectedHindi.length === source.length
      && expectedPunjabi.length === source.length
      && exactOptions(hindi, expectedHindi)
      && exactOptions(punjabi, expectedPunjabi);
  }
  return false;
}

export function evaluateCurrentAffairsQuestionEditorialReadiness(
  input: CurrentAffairsQuestionEditorialInput,
): CurrentAffairsQuestionEditorialReadiness {
  const blockers: string[] = [];
  const locked = Boolean(input.acceptedQuestionId) || input.activePromotion || input.activeApprovedRelease;
  const lifecycleUnlocked = !locked && ["unreviewed", "approved"].includes(input.generationItemStatus);
  if (!lifecycleUnlocked) {
    blockers.push("Question is locked by release/promotion state or is outside the editable review lifecycle");
  }

  const eventVerified = input.eventVerified;
  if (!eventVerified) blockers.push("Linked Current Affairs event must remain verified");

  const conflictFree = !input.hasOpenConflict;
  if (!conflictFree) blockers.push("Open factual conflicts must be resolved before question approval");

  const englishBankOnly = input.sourcePayload.language === "en" && bankOnly(input.sourcePayload);
  if (!englishBankOnly) blockers.push("English source question must remain BANK_ONLY and non-public");

  const sourceOptions = options(input.sourcePayload);
  const sourceCorrectIndex = correctIndex(input.sourcePayload);
  const englishAnswerValid = sourceOptions.length >= 2
    && sourceCorrectIndex >= 0
    && sourceCorrectIndex < sourceOptions.length
    && sourceOptions.every(Boolean);
  if (!englishAnswerValid) blockers.push("English source question has invalid options or correct index");

  const canonicalFactPreserved = factPreserved(input.sourcePayload, input.factValue);
  if (!canonicalFactPreserved) blockers.push("English question must preserve the linked canonical fact value");

  const hindiCurrent = localizationCurrent(
    input.hindi,
    "hi",
    input.generationItemId,
    input.currentSourceGenerationVersionId,
  );
  if (!hindiCurrent) blockers.push("Hindi question draft must be current and parity-ready");

  const punjabiCurrent = localizationCurrent(
    input.punjabi,
    "pa",
    input.generationItemId,
    input.currentSourceGenerationVersionId,
  );
  if (!punjabiCurrent) blockers.push("Punjabi question draft must be current and parity-ready");

  const answerParity = hindiCurrent
    && punjabiCurrent
    && localizationAnswerParity(input.sourcePayload, input.hindi)
    && localizationAnswerParity(input.sourcePayload, input.punjabi)
    && factPreserved(input.hindi!.payload!, input.factValue)
    && factPreserved(input.punjabi!.payload!, input.factValue);
  if (!answerParity) blockers.push("English, Hindi and Punjabi must preserve option count, correct index and canonical fact value");

  const optionSemanticParity = hindiCurrent && punjabiCurrent && semanticOptionParity(input);
  if (!optionSemanticParity) {
    blockers.push(input.questionFamily === "CA-QL-002"
      ? "Every localized event-title option must match the current approved event-title localization"
      : "Fact-recall option values must remain exactly canonical in every language");
  }

  const editable = lifecycleUnlocked && eventVerified && conflictFree && englishBankOnly;
  const approvable = editable
    && englishAnswerValid
    && canonicalFactPreserved
    && hindiCurrent
    && punjabiCurrent
    && answerParity
    && optionSemanticParity;

  return {
    editable,
    approvable,
    blockers,
    checks: {
      lifecycleUnlocked,
      eventVerified,
      conflictFree,
      englishBankOnly,
      englishAnswerValid,
      canonicalFactPreserved,
      hindiCurrent,
      punjabiCurrent,
      answerParity,
      optionSemanticParity,
    },
  };
}
