import type {
  MalCp002PermanentQlId,
  MalCp002ReleasedQuestion,
} from "./cp002-permanent-runtime";
import { runMalCp002EnglishEditorialV2Pipeline } from "./cp002-editorial-v2";

export const MAL_CP002_CHAPTER_CLOSURE_RUNTIME_V4 =
  "MAL-CP002-EN-CHAPTER-CLOSURE-RUNTIME-V4" as const;

const MAX_EXAM_RATIO_COMPONENT = 99;
const MAX_EASY_INTEGER = 250;

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
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

function easyMagnitudeIsNatural(stem: string): boolean {
  for (const match of stem.matchAll(/\b\d+\b/gu)) {
    if (Number(match[0]) > MAX_EASY_INTEGER) return false;
  }
  return true;
}

function hasFractionalQuantity(stem: string): boolean {
  return /(?:\\frac\{\d+\}\{\d+\}|\b\d+\s+\d+\/\d+)\s*(?:\\,\\text\{(?:kg|litres?)\}|kg|litres?)/u.test(
    stem,
  );
}

function isExamNatural(question: MalCp002ReleasedQuestion): boolean {
  const learnerChoices = [question.stem, ...question.options, question.answer].join(" ");
  if (!ratiosAreExamNatural(learnerChoices)) return false;
  if (question.difficulty === "Easy") {
    if (!easyMagnitudeIsNatural(question.stem)) return false;
    if (hasFractionalQuantity(question.stem)) return false;
  }
  return true;
}

export function runMalCp002EnglishChapterClosureV4Pipeline(input: {
  questionLanguageId: MalCp002PermanentQlId;
  seed?: string;
  language?: "en";
}): MalCp002ReleasedQuestion {
  const requestedSeed =
    input.seed ?? `mal-cp002-chapter-closure-v4:${input.questionLanguageId}:default`;

  for (let attempt = 0; attempt < 240; attempt += 1) {
    const selectedSeed =
      attempt === 0 ? requestedSeed : `${requestedSeed}:exam-retry:${attempt}`;
    const question = runMalCp002EnglishEditorialV2Pipeline({
      ...input,
      seed: selectedSeed,
    });
    if (!isExamNatural(question)) continue;
    return question;
  }

  throw new Error(
    `${input.questionLanguageId}: no CP002 V4 exam-realistic state survived.`,
  );
}
