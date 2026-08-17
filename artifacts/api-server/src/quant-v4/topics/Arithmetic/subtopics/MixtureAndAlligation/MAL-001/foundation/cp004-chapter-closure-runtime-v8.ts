import type { MalCp004PermanentQlId } from "./cp004-permanent-runtime";
import type { MalCp004ProductReviewQuestion } from "./cp004-product-review-remediation-v3";
import { runMalCp004EnglishProductReviewV7Pipeline } from "./cp004-product-review-runtime-v7";

export const MAL_CP004_CHAPTER_CLOSURE_RUNTIME_V8 =
  "MAL-CP004-EN-CHAPTER-CLOSURE-RUNTIME-V8" as const;

const MAX_LEARNER_FRACTION_DENOMINATOR = 20;

function learnerFractionIsFriendly(text: string): boolean {
  for (const match of text.matchAll(/\b\d+\s+(\d+)\/(\d+)\b/gu)) {
    if (Number(match[2]) > MAX_LEARNER_FRACTION_DENOMINATOR) return false;
  }
  for (const match of text.matchAll(/(?<!\d)(\d+)\/(\d+)(?!\d)/gu)) {
    if (Number(match[2]) > MAX_LEARNER_FRACTION_DENOMINATOR) return false;
  }
  for (const match of text.matchAll(/\\frac\{(\d+)\}\{(\d+)\}/gu)) {
    if (Number(match[2]) > MAX_LEARNER_FRACTION_DENOMINATOR) return false;
  }
  return true;
}

function isExamNatural(question: MalCp004ProductReviewQuestion): boolean {
  return [question.stem, ...question.options, question.answer].every(
    learnerFractionIsFriendly,
  );
}

function withClosureTrace(
  question: MalCp004ProductReviewQuestion,
  requestedSeed: string,
  selectedSeed: string,
  attempt: number,
): MalCp004ProductReviewQuestion {
  return {
    ...question,
    parameters: {
      ...question.parameters,
      requestedSeed,
      selectedSeed,
      valueQualitySelectionAttempt: attempt,
    },
    traceability: {
      ...question.traceability,
      requestedSeed,
      selectedSeed,
    },
    validation: {
      ...question.validation,
      checks: [
        ...question.validation.checks,
        {
          name: "CHAPTER_CLOSURE_VALUE_QUALITY_V8",
          passed: true,
          message: `Learner-visible fractions use denominators no larger than ${MAX_LEARNER_FRACTION_DENOMINATOR}.`,
        },
      ],
    },
  };
}

export function runMalCp004EnglishChapterClosureV8Pipeline(input: {
  questionLanguageId: MalCp004PermanentQlId;
  seed?: string;
  language?: "en";
}): MalCp004ProductReviewQuestion {
  const requestedSeed =
    input.seed ?? `mal-cp004-chapter-closure-v8:${input.questionLanguageId}:default`;

  for (let attempt = 0; attempt < 80; attempt += 1) {
    const selectedSeed =
      attempt === 0 ? requestedSeed : `${requestedSeed}:exam-retry:${attempt}`;
    const candidate = runMalCp004EnglishProductReviewV7Pipeline({
      ...input,
      seed: selectedSeed,
    });
    if (!isExamNatural(candidate)) continue;
    const question = withClosureTrace(
      candidate,
      requestedSeed,
      selectedSeed,
      attempt,
    );
    if (
      question.options.length !== 4 ||
      new Set(question.options).size !== 4 ||
      question.options[question.correctIndex] !== question.answer
    ) {
      throw new Error(`${question.questionId}: CP004 V8 option package is invalid.`);
    }
    return question;
  }

  throw new Error(
    `${input.questionLanguageId}: no CP004 V8 state satisfied the chapter-closure value-quality limit.`,
  );
}
