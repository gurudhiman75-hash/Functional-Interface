import { TSD_CP008_QL099_SAME_DIRECTION_GUARDS } from "./localization-final";
import {
  TSD_CP008_QUESTION_STUDIO_CHECKPOINT_ID,
  TSD_CP008_QUESTION_STUDIO_DIFFICULTIES,
  TSD_CP008_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  TSD_CP008_QUESTION_STUDIO_LANGUAGES,
  TSD_CP008_QUESTION_STUDIO_PACKAGE_ID,
  TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE as BASE_PACKAGE,
  TSD_CP008_QUESTION_STUDIO_RUNTIME_MODE,
  previewTsdCp008QuestionStudioReview as previewBase,
  type TsdCp008QuestionStudioDifficulty,
  type TsdCp008QuestionStudioLanguage,
  type TsdCp008QuestionStudioQlId,
  type TsdCp008QuestionStudioReviewRequest,
} from "./question-studio-review-adapter";

export {
  TSD_CP008_QUESTION_STUDIO_CHECKPOINT_ID,
  TSD_CP008_QUESTION_STUDIO_DIFFICULTIES,
  TSD_CP008_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  TSD_CP008_QUESTION_STUDIO_LANGUAGES,
  TSD_CP008_QUESTION_STUDIO_PACKAGE_ID,
  TSD_CP008_QUESTION_STUDIO_RUNTIME_MODE,
};
export type {
  TsdCp008QuestionStudioDifficulty,
  TsdCp008QuestionStudioLanguage,
  TsdCp008QuestionStudioQlId,
  TsdCp008QuestionStudioReviewRequest,
};

type BasePreview = ReturnType<typeof previewBase>;
type BaseQuestion = BasePreview["questions"][number];

function hasFractionalKmhAnswer(question: BaseQuestion): boolean {
  const kmhUnit = /(?:km\/h|किमी\/घंटा|ਕਿਮੀ\/ਘੰਟਾ)/u.test(question.answer);
  return kmhUnit && /\d+\/\d+/.test(question.answer);
}

function applyCaseConditionalSemantics(question: BaseQuestion): BaseQuestion {
  if (question.qlId !== "TSD-QL-099") return question;
  if (question.language === "hi" && /एक ही दिशा में/.test(question.stem)) {
    return Object.freeze({ ...question, stem: `${TSD_CP008_QL099_SAME_DIRECTION_GUARDS.hi} ${question.stem}` });
  }
  if (question.language === "pa" && /ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ/.test(question.stem)) {
    return Object.freeze({ ...question, stem: `${TSD_CP008_QL099_SAME_DIRECTION_GUARDS.pa} ${question.stem}` });
  }
  return question;
}

function allFinalQuestions(request: Omit<TsdCp008QuestionStudioReviewRequest, "count">): readonly BaseQuestion[] {
  const probe = previewBase({ ...request, count: 1 });
  const full = previewBase({ ...request, count: probe.availableCombinationsUnderFilters });
  return Object.freeze(full.questions
    .filter((question) => !hasFractionalKmhAnswer(question))
    .map(applyCaseConditionalSemantics));
}

const ENGLISH_FINAL_CAPACITY = allFinalQuestions({ language: "en", seed: "cp008-final-capacity" }).length;
if (ENGLISH_FINAL_CAPACITY !== 277) {
  throw new Error(`TSD-CP-008 final Studio capacity changed: expected 277 per locale, got ${ENGLISH_FINAL_CAPACITY}`);
}

export const TSD_CP008_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE = 277 as const;
export const TSD_CP008_QUESTION_STUDIO_DETERMINISTIC_REVIEW_COMBINATIONS = 831 as const;

export const TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  ...BASE_PACKAGE,
  compatibleReviewCombinationsPerLocale: TSD_CP008_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE,
  deterministicReviewCombinations: TSD_CP008_QUESTION_STUDIO_DETERMINISTIC_REVIEW_COMBINATIONS,
  naturalnessPolicy: "INTEGER_PRESENTATION_FOR_KMH_INPUTS_AND_ANSWERS" as const,
  ql099SameDirectionSemanticPolicy: "CASE_CONDITIONAL_FIRST_TRAIN_FASTER_GUARD" as const,
});

export function previewTsdCp008QuestionStudioReview(request: TsdCp008QuestionStudioReviewRequest = {}) {
  const language = request.language ?? "en";
  const requestedCount = Math.max(1, Math.floor(request.count ?? 5));
  const finalQuestions = allFinalQuestions({
    language,
    qlId: request.qlId,
    familyId: request.familyId,
    difficulty: request.difficulty,
    seed: request.seed,
  });

  if (!finalQuestions.length) {
    throw new Error("No TSD-CP-008 frozen Question Studio combinations match the requested filters after final exam-naturalness gates.");
  }
  if (requestedCount > finalQuestions.length) {
    throw new Error(`Requested ${requestedCount} questions but only ${finalQuestions.length} unique final-compatible CP008 combinations exist for these filters.`);
  }

  return Object.freeze({
    package: TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE,
    request: Object.freeze({ ...request, language, count: requestedCount, seed: request.seed ?? "cp008-question-studio-review" }),
    availableCombinationsUnderFilters: finalQuestions.length,
    questions: Object.freeze(finalQuestions.slice(0, requestedCount)),
  });
}
