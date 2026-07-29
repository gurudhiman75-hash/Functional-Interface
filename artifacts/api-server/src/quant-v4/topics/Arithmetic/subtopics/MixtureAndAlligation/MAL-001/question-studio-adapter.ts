import {
  MAL_CP001_PERMANENT_ALLOCATION,
  type MalCp001PermanentQlId,
} from "./foundation/cp001-permanent-allocation";
import {
  runMalCp001EnglishReleasePipeline,
  type MalCp001ReleasedQuestion,
} from "./foundation/cp001-release";

export const MAL_001_QUESTION_STUDIO_CP_IDS = ["MAL-CP-001"] as const;

export type Mal001QuestionStudioCpId =
  (typeof MAL_001_QUESTION_STUDIO_CP_IDS)[number];

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
    questionLanguageId?: MalCp001PermanentQlId | string;
    seed?: string;
  } = {},
): MalCp001ReleasedQuestion {
  if (!MAL_001_QUESTION_STUDIO_CP_IDS.includes(cpId)) {
    throw new Error(`Unknown canonical problem '${cpId}' for package MAL-001.`);
  }

  const language = input.language ?? "en";
  if (language !== "en") {
    throw new Error(
      `MAL-001 supports English generation only in Question Studio; received ${language}.`,
    );
  }

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
