import { adaptRnkQuestionForBankingFiveOptions } from "./rnk-001-banking-five-option-adapter-v1";
import { localizeRnkCp001PermanentQuestionV4 } from "./RNK-CP-001/cp001-localization-review-v4";
import { localizeRnkCp002PermanentQuestionV2 } from "./RNK-CP-002/cp002-localization-review-v2";
import { localizeRnkCp003PermanentQuestionV4 } from "./RNK-CP-003/cp003-localization-review-v4";
import { localizeRnkCp004PermanentQuestionV6 } from "./RNK-CP-004/cp004-localization-review-v6";
import { localizeRnkCp005PermanentQuestionV3 } from "./RNK-CP-005/cp005-localization-review-v3";
import { localizeRnkCp006PermanentQuestionV1 } from "./RNK-CP-006/cp006-localization-review-v1";
import { localizeRnkCp007PermanentQuestionV2 } from "./RNK-CP-007/cp007-localization-review-v2";
import { localizeRnkCp007V2QuestionToV3 } from "./RNK-CP-007/cp007-localization-review-v3";
import { localizeRnkCp007V3QuestionToV4 } from "./RNK-CP-007/cp007-localization-review-v4";
import { buildRnkCp007PercentagePresentationBankV2 } from "./RNK-CP-007/cp007-percentage-presentation-adapter-v2";
import {
  RNK_001_QUESTION_STUDIO_DIFFICULTIES,
  RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE as RNK_001_ENGLISH_QUESTION_STUDIO_REVIEW_PACKAGE,
  listRnk001QuestionStudioQlIds,
  previewRnk001QuestionStudioReview as previewRnk001EnglishQuestionStudioReview,
  type PreviewRnk001QuestionStudioInput as PreviewRnk001EnglishQuestionStudioInput,
  type RnkQuestionStudioDifficulty as RnkQuestionStudioEnglishDifficulty,
  type RnkQuestionStudioExamProfileId as RnkQuestionStudioEnglishExamProfileId,
  type RnkQuestionStudioReviewQuestion as RnkQuestionStudioEnglishReviewQuestion,
} from "./question-studio-review-english-v1";

export { RNK_001_QUESTION_STUDIO_DIFFICULTIES, listRnk001QuestionStudioQlIds };
export type RnkQuestionStudioDifficulty = RnkQuestionStudioEnglishDifficulty;
export type RnkQuestionStudioExamProfileId = RnkQuestionStudioEnglishExamProfileId;

export const RNK_001_QUESTION_STUDIO_REVIEW_AUTHORITY =
  "RNK-001-QUESTION-STUDIO-MULTILINGUAL-REVIEW-V1" as const;
export const RNK_001_QUESTION_STUDIO_REVIEW_STATUS =
  "MULTILINGUAL_FROZEN_AUTHORITY_REVIEW_ONLY" as const;
export const RNK_001_QUESTION_STUDIO_RELEASE_FREEZE =
  "MULTILINGUAL_REVIEW_ENABLED_PRODUCT_DELIVERY_LOCKED" as const;

export const RNK_001_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export type RnkQuestionStudioLanguage = typeof RNK_001_QUESTION_STUDIO_LANGUAGES[number];
export type RnkQuestionStudioLocale = "en-IN" | "hi-IN" | "pa-IN";
type NativeLocale = Exclude<RnkQuestionStudioLocale, "en-IN">;
type AnyQuestion = Record<string, any>;

export const RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  ...RNK_001_ENGLISH_QUESTION_STUDIO_REVIEW_PACKAGE,
  supportedLanguages: RNK_001_QUESTION_STUDIO_LANGUAGES,
  runtimeMode: "RNK-001-FROZEN-MULTILINGUAL-AUTHORITY-REVIEW-V1" as const,
  reviewStatus: RNK_001_QUESTION_STUDIO_REVIEW_STATUS,
  integrationAuthority: RNK_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
  releaseFreezeStatus: RNK_001_QUESTION_STUDIO_RELEASE_FREEZE,
  englishOnlyUntilMultilingualConsolidation: false as const,
  percentageAdapterStatus: "V2_NATIVE_GRAMMAR_ACTIVE_REVIEW_ONLY" as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  manualApprovalRequired: true as const,
});

export interface RnkQuestionStudioReviewQuestion extends Omit<
  RnkQuestionStudioEnglishReviewQuestion,
  "questionId" | "language" | "locale" | "source"
> {
  readonly questionId: string;
  readonly language: RnkQuestionStudioLanguage;
  readonly locale: RnkQuestionStudioLocale;
  readonly source: AnyQuestion;
}

export interface PreviewRnk001QuestionStudioInput extends Omit<
  PreviewRnk001EnglishQuestionStudioInput,
  "language"
> {
  readonly language?: RnkQuestionStudioLanguage;
}

function studioLocale(language: RnkQuestionStudioLanguage): RnkQuestionStudioLocale {
  if (language === "hi") return "hi-IN";
  if (language === "pa") return "pa-IN";
  return "en-IN";
}

function qlNumber(qlId: string): number {
  const match = /^RNK-QL-(\d{3})$/u.exec(qlId);
  if (!match) throw new Error(`Invalid RNK QL id '${qlId}'.`);
  return Number(match[1]);
}

function canonicalSource(question: RnkQuestionStudioEnglishReviewQuestion): AnyQuestion {
  const source = question.source as AnyQuestion;
  const delivery = source.bankingFiveOptionDelivery as AnyQuestion | undefined;
  if (!delivery) return source;
  const { bankingFiveOptionDelivery: _delivery, ...canonical } = source;
  const sourceOptionCount = Number(delivery.sourceOptionCount ?? 4);
  return {
    ...canonical,
    options: Array.isArray(source.options) ? source.options.slice(0, sourceOptionCount) : source.options,
  };
}

const percentageBanks = new Map<NativeLocale, readonly AnyQuestion[]>();
function percentageBank(locale: NativeLocale): readonly AnyQuestion[] {
  const cached = percentageBanks.get(locale);
  if (cached) return cached;
  const built = buildRnkCp007PercentagePresentationBankV2(locale) as readonly AnyQuestion[];
  percentageBanks.set(locale, built);
  return built;
}

function localizeCanonicalQuestion(raw: AnyQuestion, qlId: string, locale: NativeLocale): AnyQuestion {
  const number = qlNumber(qlId);
  if (number <= 9) return localizeRnkCp001PermanentQuestionV4(raw as any, locale) as unknown as AnyQuestion;
  if (number <= 17) return localizeRnkCp002PermanentQuestionV2(raw as any, locale) as unknown as AnyQuestion;
  if (number <= 26) return localizeRnkCp003PermanentQuestionV4(raw, locale) as unknown as AnyQuestion;
  if (number <= 35) return localizeRnkCp004PermanentQuestionV6(raw as any, locale) as AnyQuestion;
  if (number <= 38) return localizeRnkCp005PermanentQuestionV3(raw as any, locale) as unknown as AnyQuestion;
  if (number <= 41) return localizeRnkCp006PermanentQuestionV1(raw as any, locale) as unknown as AnyQuestion;

  const v2 = localizeRnkCp007PermanentQuestionV2(raw as any, locale);
  const v3 = localizeRnkCp007V2QuestionToV3(v2);
  const v4 = localizeRnkCp007V3QuestionToV4(v3) as unknown as AnyQuestion;
  const sourceFingerprint = String(raw.permanentRuntimeFingerprint ?? "");
  const percentage = percentageBank(locale).find((question) =>
    String(question.percentagePresentation?.sourcePermanentRuntimeFingerprint ?? "") === sourceFingerprint,
  );
  return percentage ?? v4;
}

function optionText(option: unknown): string {
  if (typeof option === "object" && option !== null) {
    const record = option as Record<string, unknown>;
    return String(record.label ?? record.value ?? record.answer ?? record.answerKey ?? "");
  }
  return String(option);
}

function misconceptionId(option: unknown): string | null {
  if (typeof option !== "object" || option === null) return null;
  const value = (option as Record<string, unknown>).misconceptionId;
  return value == null ? null : String(value);
}

function explanationText(value: unknown): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return String(value ?? "");
  if (Array.isArray(value)) return value.map(String).join("\n");
  const record = value as Record<string, unknown>;
  const parts: string[] = [];
  for (const key of ["mentalPicture", "keyRule", "examSpeedShortcut", "conclusion"] as const) {
    if (typeof record[key] === "string") parts.push(String(record[key]));
  }
  for (const key of ["steps", "stepByStepSolution", "optionAnalysis"] as const) {
    if (Array.isArray(record[key])) parts.push(...(record[key] as unknown[]).map(String));
  }
  return parts.length ? parts.join("\n") : JSON.stringify(value);
}

function localizedReviewQuestion(
  english: RnkQuestionStudioEnglishReviewQuestion,
  language: Exclude<RnkQuestionStudioLanguage, "en">,
): RnkQuestionStudioReviewQuestion {
  const locale = studioLocale(language) as NativeLocale;
  const canonical = canonicalSource(english);
  const localized = localizeCanonicalQuestion(canonical, english.qlId, locale);
  const raw = english.examProfileId.startsWith("IBPS_")
    ? adaptRnkQuestionForBankingFiveOptions(localized, locale)
    : localized;
  const optionsRaw = raw.options as readonly unknown[];
  const options = optionsRaw.map(optionText);
  const correctIndex = Number.isInteger(raw.correctIndex) ? Number(raw.correctIndex) : Number(raw.answerIndex);
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
    throw new Error(`${english.qlId} produced an invalid localized correct option index.`);
  }
  const answer = options[correctIndex]!;
  const optionsDistinct = new Set(options).size === options.length;
  const exactlyOneCorrect = options.filter((option) => option === answer).length === 1;
  const stem = String(raw.stem ?? raw.instruction ?? "");
  return {
    ...english,
    questionId: `${english.questionId.replace(/:en$/u, "")}:${language}`,
    language,
    locale,
    stem,
    displayStem: stem,
    options,
    optionDetails: optionsRaw.map((option, index) => ({
      label: String.fromCharCode(65 + index),
      text: optionText(option),
      isCorrect: index === correctIndex,
      misconceptionId: misconceptionId(option),
    })),
    correctIndex,
    answer,
    explanation: explanationText(raw.explanation),
    optionCount: options.length,
    validation: {
      valid: optionsDistinct && exactlyOneCorrect && stem.length > 0,
      optionsDistinct,
      exactlyOneCorrect,
      frozenQl: true,
    },
    source: raw,
  };
}

export function previewRnk001QuestionStudioReview(input: PreviewRnk001QuestionStudioInput = {}) {
  const language = input.language ?? "en";
  if (!RNK_001_QUESTION_STUDIO_LANGUAGES.includes(language)) {
    throw new Error(`RNK-001 does not support Question Studio language '${String(language)}'.`);
  }
  const english = previewRnk001EnglishQuestionStudioReview({
    ...input,
    language: "en",
  } as PreviewRnk001EnglishQuestionStudioInput);
  const questions = language === "en"
    ? english.questions as readonly RnkQuestionStudioReviewQuestion[]
    : english.questions.map((question) => localizedReviewQuestion(question, language));
  return {
    questions,
    integrationAuthority: RNK_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    reviewOnly: true as const,
    examProfileId: english.examProfileId,
    releaseFreezeStatus: RNK_001_QUESTION_STUDIO_RELEASE_FREEZE,
  };
}
