import type {
  MalCp003PermanentQlId,
  MalCp003ReleasedQuestion,
} from "./cp003-permanent-runtime";
import { runMalCp003EnglishEditorialV2Pipeline } from "./cp003-release-editorial-v2";

export const MAL_CP003_CHAPTER_CLOSURE_EDITORIAL_V3_ID =
  "MAL-CP003-EN-CHAPTER-CLOSURE-EDITORIAL-V3" as const;

const MAX_EXAM_RATIO_COMPONENT = 99;
const MAX_QUANTITY_FRACTION_DENOMINATOR = 12;

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

function normaliseOperationCount(value: string): string {
  return value.replace(/\b1 operations\b/giu, "1 operation");
}

function ratiosAreExamNatural(value: string): boolean {
  for (const match of value.matchAll(/\b(\d+)\s*:\s*(\d+)\b/gu)) {
    const left = Number(match[1]);
    const right = Number(match[2]);
    if (Math.max(left, right) > MAX_EXAM_RATIO_COMPONENT) return false;
    if (left > 0 && right > 0 && gcd(left, right) > 1) return false;
  }
  return true;
}

function quantitiesAreExamNatural(question: MalCp003ReleasedQuestion): boolean {
  const learnerChoices = [question.stem, ...question.options, question.answer].join(" ");
  for (const match of learnerChoices.matchAll(/\b\d+\s+(\d+)\/(\d+)\s+(?:kg|litres?)\b/gu)) {
    if (Number(match[2]) > MAX_QUANTITY_FRACTION_DENOMINATOR) return false;
  }
  return true;
}

function isExamNatural(question: MalCp003ReleasedQuestion): boolean {
  const learnerChoices = [question.stem, ...question.options, question.answer].join(" ");
  return ratiosAreExamNatural(learnerChoices) && quantitiesAreExamNatural(question);
}

function normaliseLearnerSurface(
  question: MalCp003ReleasedQuestion,
): MalCp003ReleasedQuestion {
  const options = question.options.map(normaliseOperationCount);
  const answer = normaliseOperationCount(question.answer);
  return {
    ...question,
    stem: normaliseOperationCount(question.stem),
    options,
    answer,
  };
}

export function runMalCp003EnglishEditorialV3Pipeline(input: {
  questionLanguageId: MalCp003PermanentQlId;
  seed?: string;
  language?: "en";
}): MalCp003ReleasedQuestion {
  const requestedSeed =
    input.seed ?? `mal-cp003-editorial-v3:${input.questionLanguageId}:default`;

  for (let attempt = 0; attempt < 240; attempt += 1) {
    const selectedSeed =
      attempt === 0 ? requestedSeed : `${requestedSeed}:exam-retry:${attempt}`;
    const question = normaliseLearnerSurface(
      runMalCp003EnglishEditorialV2Pipeline({
        ...input,
        seed: selectedSeed,
      }),
    );
    if (!isExamNatural(question)) continue;
    if (question.options[question.correctIndex] !== question.answer) continue;
    return {
      ...question,
      parameters: {
        ...question.parameters,
        editorialValueRevisionId: MAL_CP003_CHAPTER_CLOSURE_EDITORIAL_V3_ID,
        requestedSeed,
        selectedSeed,
        valueQualitySelectionAttempt: attempt,
      },
      validation: {
        ...question.validation,
        checks: [
          ...question.validation.checks,
          {
            name: "CHAPTER_CLOSURE_EXAM_REALISM_V3",
            passed: true,
            message: `Learner-visible ratios are reduced with components at most ${MAX_EXAM_RATIO_COMPONENT}; mixed quantity fractions use denominators at most ${MAX_QUANTITY_FRACTION_DENOMINATOR}; singular operation counts use singular grammar.`,
          },
        ],
      },
    };
  }

  throw new Error(
    `${input.questionLanguageId}: no CP003 V3 exam-realistic state survived.`,
  );
}
