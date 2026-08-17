import type {
  MalCp002PermanentQlId,
  MalCp002ReleasedQuestion,
} from "./cp002-permanent-runtime";
import { runMalCp002EnglishEditorialV2Pipeline } from "./cp002-editorial-v2";

export const MAL_CP002_CHAPTER_CLOSURE_RUNTIME_V3 =
  "MAL-CP002-EN-CHAPTER-CLOSURE-RUNTIME-V3" as const;

const MAX_EXAM_RATIO_COMPONENT = 500;

function ratioComponentsAreExamNatural(stem: string): boolean {
  for (const match of stem.matchAll(/\b(\d+)\s*:\s*(\d+)\b/gu)) {
    if (
      Math.max(Number(match[1]), Number(match[2])) >
      MAX_EXAM_RATIO_COMPONENT
    ) {
      return false;
    }
  }
  return true;
}

function isExamNatural(question: MalCp002ReleasedQuestion): boolean {
  if (!ratioComponentsAreExamNatural(question.stem)) return false;
  if (
    question.permanentQlId === "MAL-QL-026" &&
    /\\frac\{\d+\}\{\d+\}[^.!?]*(?:kg|litres?)/u.test(question.stem)
  ) {
    return false;
  }
  return true;
}

export function runMalCp002EnglishChapterClosureV3Pipeline(input: {
  questionLanguageId: MalCp002PermanentQlId;
  seed?: string;
  language?: "en";
}): MalCp002ReleasedQuestion {
  const requestedSeed =
    input.seed ?? `mal-cp002-chapter-closure-v3:${input.questionLanguageId}:default`;

  for (let attempt = 0; attempt < 80; attempt += 1) {
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
    `${input.questionLanguageId}: no exam-natural CP002 chapter-closure state survived.`,
  );
}
