import type { MalCp004PermanentQlId } from "./cp004-permanent-runtime";
import type { MalCp004ProductReviewQuestion } from "./cp004-product-review-remediation-v3";
import { runMalCp004EnglishChapterClosureV8Pipeline } from "./cp004-chapter-closure-runtime-v8";

export const MAL_CP004_CHAPTER_CLOSURE_RUNTIME_V9 =
  "MAL-CP004-EN-CHAPTER-CLOSURE-RUNTIME-V9" as const;

const MAX_PERCENT_FRACTION_DENOMINATOR = 12;
const MAX_QUANTITY_FRACTION_DENOMINATOR = 16;

function hasEasyFractionalQuantity(stem: string): boolean {
  return /(?:\\frac\{\d+\}\{\d+\}|\b\d+\s+\d+\/\d+)\s*(?:\\,\\text\{(?:kg|litres?)\}|kg|litres?)/u.test(
    stem,
  );
}

function fractionsAreExamNatural(question: MalCp004ProductReviewQuestion): boolean {
  const learnerChoices = [question.stem, ...question.options, question.answer].join(" ");
  for (const match of learnerChoices.matchAll(/\b\d+\s+(\d+)\/(\d+)%/gu)) {
    if (Number(match[2]) > MAX_PERCENT_FRACTION_DENOMINATOR) return false;
  }
  for (const match of learnerChoices.matchAll(/\b\d+\s+(\d+)\/(\d+)\s+(?:kg|litres?)\b/gu)) {
    if (Number(match[2]) > MAX_QUANTITY_FRACTION_DENOMINATOR) return false;
  }
  if (question.difficulty === "Easy" && hasEasyFractionalQuantity(question.stem)) {
    return false;
  }
  return true;
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
      valueQualityRevisionId: MAL_CP004_CHAPTER_CLOSURE_RUNTIME_V9,
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
          name: "CHAPTER_CLOSURE_VALUE_QUALITY_V9",
          passed: true,
          message: `Mixed percentage fractions use denominators at most ${MAX_PERCENT_FRACTION_DENOMINATOR}; mixed quantity fractions use denominators at most ${MAX_QUANTITY_FRACTION_DENOMINATOR}; Easy stems avoid fractional quantities.`,
        },
      ],
    },
  };
}

export function runMalCp004EnglishChapterClosureV9Pipeline(input: {
  questionLanguageId: MalCp004PermanentQlId;
  seed?: string;
  language?: "en";
}): MalCp004ProductReviewQuestion {
  const requestedSeed =
    input.seed ?? `mal-cp004-chapter-closure-v9:${input.questionLanguageId}:default`;

  for (let attempt = 0; attempt < 160; attempt += 1) {
    const selectedSeed =
      attempt === 0 ? requestedSeed : `${requestedSeed}:exam-retry:${attempt}`;
    const candidate = runMalCp004EnglishChapterClosureV8Pipeline({
      ...input,
      seed: selectedSeed,
    });
    if (!fractionsAreExamNatural(candidate)) continue;
    return withClosureTrace(candidate, requestedSeed, selectedSeed, attempt);
  }

  throw new Error(
    `${input.questionLanguageId}: no CP004 V9 exam-realistic state survived.`,
  );
}
