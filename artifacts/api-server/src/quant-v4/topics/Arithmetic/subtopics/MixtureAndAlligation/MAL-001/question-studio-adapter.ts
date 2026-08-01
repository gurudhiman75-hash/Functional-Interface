import {
  MAL_CP001_PERMANENT_ALLOCATION,
  type MalCp001PermanentQlId,
} from "./foundation/cp001-permanent-allocation";
import {
  runMalCp001EnglishReleasePipeline,
  type MalCp001ReleasedQuestion,
} from "./foundation/cp001-release";
import {
  MAL_CP002_PERMANENT_ALLOCATION,
  type MalCp002PermanentQlId,
} from "./foundation/cp002-permanent-runtime";
import {
  runMalCp002EnglishEditorialRemediationV2Pipeline,
  type MalCp002EditorialRemediationV2Question,
} from "./foundation/cp002-editorial-remediation-v2";

export const MAL_001_QUESTION_STUDIO_CP_IDS = [
  "MAL-CP-001",
  "MAL-CP-002",
] as const;

export type Mal001QuestionStudioCpId =
  (typeof MAL_001_QUESTION_STUDIO_CP_IDS)[number];

export type Mal001QuestionStudioQlId =
  | MalCp001PermanentQlId
  | MalCp002PermanentQlId;

export type Mal001QuestionStudioQuestion =
  | MalCp001ReleasedQuestion
  | MalCp002EditorialRemediationV2Question;

type Difficulty = "Easy" | "Medium" | "Hard";

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

export function runMal001QuestionStudioPipeline(
  cpId: Mal001QuestionStudioCpId,
  input: {
    difficulty?: Difficulty;
    language?: "en";
    questionLanguageId?: Mal001QuestionStudioQlId | string;
    seed?: string;
  } = {},
): Mal001QuestionStudioQuestion {
  if (!MAL_001_QUESTION_STUDIO_CP_IDS.includes(cpId)) {
    throw new Error(`Unknown canonical problem '${cpId}' for package MAL-001.`);
  }

  const language = input.language ?? "en";
  if (language !== "en") {
    throw new Error(
      `MAL-001 supports English generation only in Question Studio; received ${language}.`,
    );
  }

  if (cpId === "MAL-CP-001") {
    const entries = MAL_CP001_PERMANENT_ALLOCATION.filter(
      (entry) => !input.difficulty || entry.difficulty === input.difficulty,
    );
    if (entries.length === 0) {
      throw new Error(
        `No active MAL-CP-001 QLs match${
          input.difficulty ? ` difficulty ${input.difficulty}` : " the request"
        }.`,
      );
    }

    let questionLanguageId = input.questionLanguageId as
      | MalCp001PermanentQlId
      | undefined;
    if (questionLanguageId) {
      const explicit = entries.find((entry) => entry.qlId === questionLanguageId);
      if (!explicit) {
        throw new Error(
          `${questionLanguageId} is not active for MAL-CP-001${
            input.difficulty ? ` / ${input.difficulty}` : ""
          }.`,
        );
      }
    } else {
      const seed = input.seed ?? "mal-001-question-studio:MAL-CP-001";
      questionLanguageId = entries[hash(seed) % entries.length]!.qlId;
    }

    return runMalCp001EnglishReleasePipeline({
      questionLanguageId,
      seed: input.seed,
      language: "en",
    });
  }

  const entries = MAL_CP002_PERMANENT_ALLOCATION.filter(
    (entry) => !input.difficulty || entry.difficulty === input.difficulty,
  );
  if (entries.length === 0) {
    throw new Error(
      `No active MAL-CP-002 QLs match${
        input.difficulty ? ` difficulty ${input.difficulty}` : " the request"
      }.`,
    );
  }

  let questionLanguageId = input.questionLanguageId as
    | MalCp002PermanentQlId
    | undefined;
  if (questionLanguageId) {
    const explicit = entries.find((entry) => entry.qlId === questionLanguageId);
    if (!explicit) {
      throw new Error(
        `${questionLanguageId} is not active for MAL-CP-002${
          input.difficulty ? ` / ${input.difficulty}` : ""
        }.`,
      );
    }
  } else {
    const seed = input.seed ?? "mal-001-question-studio:MAL-CP-002";
    questionLanguageId = entries[hash(seed) % entries.length]!.qlId;
  }

  return runMalCp002EnglishEditorialRemediationV2Pipeline({
    questionLanguageId,
    seed: input.seed,
    language: "en",
  });
}
