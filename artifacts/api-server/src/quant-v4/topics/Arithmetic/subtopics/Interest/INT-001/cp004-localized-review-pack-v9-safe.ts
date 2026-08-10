import {
  INT_CP004_LOCALIZED_REVIEW_PACK_VERSION,
  INT_CP004_REVIEW_QUESTION_COUNT,
  INT_CP004_REVIEW_QUESTIONS_PER_QL,
  buildIntCp004LocalizedReviewPack,
  renderIntCp004LocalizedReviewMarkdown as renderBaseMarkdown,
  serializeIntCp004LocalizedReviewPack,
  sha256Text,
  type IntCp004LocalizedReviewPack,
} from "./cp004-localized-review-pack";
import { selectIntCp004ExamFriendlyFrozenSourceV9 } from "./cp004-exam-friendly-source-v9";
import { buildCp004LocalizedFormulaExplanationV9Safe } from "./cp004-localized-formula-explanations-v9-safe";
import type { IntCp004LocalizedLocale } from "./cp004-localization-types";

export {
  INT_CP004_LOCALIZED_REVIEW_PACK_VERSION,
  INT_CP004_REVIEW_QUESTION_COUNT,
  INT_CP004_REVIEW_QUESTIONS_PER_QL,
  serializeIntCp004LocalizedReviewPack,
  sha256Text,
};

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  }
  return Object.freeze(value);
}

export function buildIntCp004LocalizedReviewPackV9Safe(
  locale: IntCp004LocalizedLocale,
): IntCp004LocalizedReviewPack {
  const base = buildIntCp004LocalizedReviewPack(locale);
  const questions = base.questions.map((question) => {
    const source = selectIntCp004ExamFriendlyFrozenSourceV9(
      question.qlId,
      question.seed,
    );
    const explanation = buildCp004LocalizedFormulaExplanationV9Safe(
      source,
      locale,
      question.correctAnswer,
    );
    return {
      ...question,
      explanation,
    };
  });

  return deepFreeze({
    ...base,
    questions: Object.freeze(questions),
  });
}

function reviewFinalAnswer(locale: IntCp004LocalizedLocale, text: string): string {
  return locale === "hi-IN"
    ? text.replace(/^उत्तर:\s*/u, "")
    : text.replace(/^ਉੱਤਰ:\s*/u, "");
}

export function renderIntCp004LocalizedReviewMarkdown(
  pack: IntCp004LocalizedReviewPack,
): string {
  const renderPack = {
    ...pack,
    questions: pack.questions.map((question) => ({
      ...question,
      explanation: {
        ...question.explanation,
        finalAnswer: reviewFinalAnswer(pack.locale, question.explanation.finalAnswer),
      },
    })),
  } as IntCp004LocalizedReviewPack;
  return renderBaseMarkdown(renderPack);
}
