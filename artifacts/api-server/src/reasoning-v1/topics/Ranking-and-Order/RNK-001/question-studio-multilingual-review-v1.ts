import {
  previewRnk001QuestionStudioReview as previewEnglishRnk001QuestionStudioReview,
  listRnk001QuestionStudioQlIds,
  RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE as RNK_001_ENGLISH_REVIEW_PACKAGE,
  type PreviewRnk001QuestionStudioInput as EnglishPreviewInput,
  type RnkQuestionStudioDifficulty as EnglishDifficulty,
  type RnkQuestionStudioExamProfileId as EnglishExamProfileId,
  type RnkQuestionStudioReviewQuestion as EnglishReviewQuestion,
} from "./question-studio-english-review-v1";
import { localizeRnkCp001PermanentQuestionV4 } from "./RNK-CP-001/cp001-localization-review-v4";
import { localizeRnkCp002PermanentQuestionV2 } from "./RNK-CP-002/cp002-localization-review-v2";
import { localizeRnkCp003PermanentQuestionV4 } from "./RNK-CP-003/cp003-localization-review-v4";
import { localizeRnkCp004PermanentQuestionV6 } from "./RNK-CP-004/cp004-localization-review-v6";
import { localizeRnkCp005PermanentQuestionV3 } from "./RNK-CP-005/cp005-localization-review-v3";
import { localizeRnkCp006PermanentQuestionV1 } from "./RNK-CP-006/cp006-localization-review-v1";
import { localizeRnkCp007PermanentQuestionV2 } from "./RNK-CP-007/cp007-localization-review-v2";
import { localizeRnkCp007V2QuestionToV3 } from "./RNK-CP-007/cp007-localization-review-v3";
import { localizeRnkCp007V3QuestionToV4 } from "./RNK-CP-007/cp007-localization-review-v4";
import { adaptRnkQuestionForBankingFiveOptions } from "./rnk-001-banking-five-option-adapter-v1";
import { declutterRnkExplanation } from "./rnk-001-explanation-declutter-v1";
import { buildRnkNativeArrangementPresentationV1 } from "./rnk-001-native-arrangement-presentation-v1";

export const RNK_001_QUESTION_STUDIO_REVIEW_AUTHORITY =
  "RNK-001-QUESTION-STUDIO-MULTILINGUAL-REVIEW-V1" as const;
export const RNK_001_QUESTION_STUDIO_REVIEW_STATUS =
  "MULTILINGUAL_FROZEN_REVIEW_ONLY" as const;
export const RNK_001_QUESTION_STUDIO_RELEASE_FREEZE =
  "MULTILINGUAL_CONTENT_FROZEN_PRODUCT_DELIVERY_LOCKED" as const;

export const RNK_001_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export type RnkQuestionStudioLanguage = typeof RNK_001_QUESTION_STUDIO_LANGUAGES[number];
export type RnkQuestionStudioDifficulty = EnglishDifficulty;
export type RnkQuestionStudioExamProfileId = EnglishExamProfileId;

type AnyQuestion = Record<string, any>;

export type RnkQuestionStudioReviewQuestion = Omit<
  EnglishReviewQuestion,
  "language" | "locale" | "questionId" | "explanation" | "source"
> & {
  readonly language: RnkQuestionStudioLanguage;
  readonly locale: "en-IN" | "hi-IN" | "pa-IN";
  readonly questionId: string;
  readonly explanation: string;
  readonly source: AnyQuestion;
};

export interface PreviewRnk001QuestionStudioInput
  extends Omit<EnglishPreviewInput, "language"> {
  readonly language?: RnkQuestionStudioLanguage;
}

export const RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  ...RNK_001_ENGLISH_REVIEW_PACKAGE,
  supportedLanguages: RNK_001_QUESTION_STUDIO_LANGUAGES,
  runtimeMode: "RNK-001-FROZEN-MULTILINGUAL-REVIEW-V1" as const,
  reviewStatus: RNK_001_QUESTION_STUDIO_REVIEW_STATUS,
  integrationAuthority: RNK_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
  releaseFreezeStatus: RNK_001_QUESTION_STUDIO_RELEASE_FREEZE,
  questionStudioRegistrationStatus: "REGISTERED_MULTILINGUAL_REVIEW_ONLY" as const,
  englishOnlyUntilMultilingualConsolidation: false as const,
  multilingualContentFreeze: true as const,
  hindiContentApproved: true as const,
  punjabiContentApproved: true as const,
  percentageAdapterStatus: "V2_NATIVE_GRAMMAR_FROZEN_AVAILABLE" as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  manualApprovalRequired: true as const,
});

function qlNumber(qlId: string): number {
  const match = /^RNK-QL-(\d{3})$/u.exec(qlId);
  if (!match) throw new Error(`Invalid RNK QL id '${qlId}'.`);
  return Number(match[1]);
}

function localeFor(language: RnkQuestionStudioLanguage): "en-IN" | "hi-IN" | "pa-IN" {
  if (language === "hi") return "hi-IN";
  if (language === "pa") return "pa-IN";
  return "en-IN";
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

function canonicalSourceFromEnglish(question: EnglishReviewQuestion): AnyQuestion {
  const source = question.source as AnyQuestion;
  if (!source.bankingFiveOptionDelivery) return source;
  if (!Array.isArray(source.options) || source.options.length !== 5) {
    throw new Error(`${question.qlId} banking source is not a five-option delivery projection.`);
  }
  const canonical = {
    ...source,
    options: source.options.slice(0, 4),
  } as AnyQuestion;
  delete canonical.bankingFiveOptionDelivery;
  return canonical;
}

function localizeCanonicalQuestion(
  canonical: AnyQuestion,
  qlId: string,
  locale: "hi-IN" | "pa-IN",
): AnyQuestion {
  const number = qlNumber(qlId);
  if (number <= 9) return localizeRnkCp001PermanentQuestionV4(canonical as any, locale);
  if (number <= 17) return localizeRnkCp002PermanentQuestionV2(canonical as any, locale);
  if (number <= 26) return localizeRnkCp003PermanentQuestionV4(canonical, locale);
  if (number <= 35) return localizeRnkCp004PermanentQuestionV6(canonical, locale);
  if (number <= 38) return localizeRnkCp005PermanentQuestionV3(canonical, locale);
  if (number <= 41) return localizeRnkCp006PermanentQuestionV1(canonical as any, locale);
  const v2 = localizeRnkCp007PermanentQuestionV2(canonical as any, locale);
  const v3 = localizeRnkCp007V2QuestionToV3(v2);
  return localizeRnkCp007V3QuestionToV4(v3);
}

function localizedReviewQuestion(
  english: EnglishReviewQuestion,
  language: "hi" | "pa",
): RnkQuestionStudioReviewQuestion {
  const locale = localeFor(language) as "hi-IN" | "pa-IN";
  const canonical = canonicalSourceFromEnglish(english);
  const localizedAuthority = localizeCanonicalQuestion(canonical, english.qlId, locale);
  const delivered = english.examProfileId.startsWith("IBPS_")
    ? adaptRnkQuestionForBankingFiveOptions(localizedAuthority, locale)
    : localizedAuthority;
  const optionsRaw = delivered.options as readonly unknown[];
  const options = optionsRaw.map(optionText);
  const correctIndex = Number.isInteger(delivered.correctIndex)
    ? Number(delivered.correctIndex)
    : Number(delivered.answerIndex);
  if (correctIndex !== english.correctIndex) {
    throw new Error(`${english.qlId} ${language} changed frozen correct index ${english.correctIndex} -> ${correctIndex}.`);
  }
  if (correctIndex < 0 || correctIndex >= options.length) {
    throw new Error(`${english.qlId} ${language} produced invalid correct index ${correctIndex}.`);
  }
  const answer = options[correctIndex]!;
  const arrangement = buildRnkNativeArrangementPresentationV1({
    qlId: english.qlId,
    locale,
    canonicalQuestion: canonical,
    localizedQuestion: localizedAuthority,
    answer,
  });
  const explanation = arrangement ?? declutterRnkExplanation({
    explanation: localizedAuthority.explanation,
    qlId: english.qlId,
    locale,
    answer,
  });
  const stem = String(delivered.stem ?? delivered.instruction ?? "");
  const optionsDistinct = new Set(options).size === options.length;
  const exactlyOneCorrect = options.filter((option) => option === answer).length === 1;

  return {
    ...english,
    questionId: `RNK-001:${english.qlId}:${english.seed}:${language}`,
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
    explanation,
    optionCount: options.length,
    validation: {
      valid: optionsDistinct && exactlyOneCorrect && stem.length > 0,
      optionsDistinct,
      exactlyOneCorrect,
      frozenQl: true,
    },
    source: delivered,
  };
}

export function previewRnk001QuestionStudioReview(
  input: PreviewRnk001QuestionStudioInput = {},
) {
  const language = input.language ?? "en";
  if (!RNK_001_QUESTION_STUDIO_LANGUAGES.includes(language)) {
    throw new Error(`RNK-001 does not support Question Studio language '${String(language)}'.`);
  }

  const englishPreview = previewEnglishRnk001QuestionStudioReview({
    ...input,
    language: "en",
  });
  const questions: readonly RnkQuestionStudioReviewQuestion[] = language === "en"
    ? englishPreview.questions.map((question) => ({
        ...question,
        explanation: String(question.explanation),
        source: question.source as AnyQuestion,
      }))
    : englishPreview.questions.map((question) =>
        localizedReviewQuestion(question, language));

  return {
    questions,
    integrationAuthority: RNK_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    reviewOnly: true as const,
    examProfileId: englishPreview.examProfileId,
    releaseFreezeStatus: RNK_001_QUESTION_STUDIO_RELEASE_FREEZE,
    multilingualContentFreeze: true as const,
    productDeliveryLocked: true as const,
  };
}

export { listRnk001QuestionStudioQlIds };
