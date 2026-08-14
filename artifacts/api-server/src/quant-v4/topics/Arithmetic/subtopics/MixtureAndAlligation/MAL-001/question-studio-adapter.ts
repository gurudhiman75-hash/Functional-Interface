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
  type MalCp002ReleasedQuestion,
} from "./foundation/cp002-permanent-runtime";
import { runMalCp002EnglishEditorialV2Pipeline } from "./foundation/cp002-editorial-v2";
import {
  MAL_CP003_PERMANENT_ALLOCATION,
  type MalCp003PermanentQlId,
  type MalCp003ReleasedQuestion,
} from "./foundation/cp003-permanent-runtime";
import { runMalCp003EnglishEditorialV2Pipeline } from "./foundation/cp003-release-editorial-v2";
import {
  MAL_CP004_PERMANENT_ALLOCATION,
  type MalCp004PermanentQlId,
} from "./foundation/cp004-permanent-runtime";
import type { MalCp004ProductReviewQuestion } from "./foundation/cp004-product-review-remediation-v3";
import { runMalCp004EnglishChapterClosureV8Pipeline } from "./foundation/cp004-chapter-closure-runtime-v8";
import type { MalCp005PermanentQlId } from "./foundation/cp005-permanent-allocation-v1";
import {
  MAL_CP005_RELEASE_ALLOCATION,
  runMalCp005EnglishReleasePipeline,
  type MalCp005ReleasedQuestion,
} from "./foundation/cp005-permanent-runtime-v1";

export const MAL_001_QUESTION_STUDIO_CP_IDS = [
  "MAL-CP-001",
  "MAL-CP-002",
  "MAL-CP-003",
  "MAL-CP-004",
  "MAL-CP-005",
] as const;

export type Mal001QuestionStudioCpId =
  (typeof MAL_001_QUESTION_STUDIO_CP_IDS)[number];

export type Mal001QuestionStudioQlId =
  | MalCp001PermanentQlId
  | MalCp002PermanentQlId
  | MalCp003PermanentQlId
  | MalCp004PermanentQlId
  | MalCp005PermanentQlId;

export type Mal001QuestionStudioQuestion =
  | MalCp001ReleasedQuestion
  | MalCp002ReleasedQuestion
  | MalCp003ReleasedQuestion
  | MalCp004ProductReviewQuestion
  | MalCp005ReleasedQuestion;

type Difficulty = "Easy" | "Medium" | "Hard";

type AllocationEntry = {
  qlId: Mal001QuestionStudioQlId;
  difficulty: Difficulty;
};

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function chooseQl<T extends AllocationEntry>(
  cpId: Mal001QuestionStudioCpId,
  allocations: readonly T[],
  input: {
    difficulty?: Difficulty;
    questionLanguageId?: Mal001QuestionStudioQlId | string;
    seed?: string;
  },
): T["qlId"] {
  const entries = allocations.filter(
    (entry) => !input.difficulty || entry.difficulty === input.difficulty,
  );
  if (entries.length === 0) {
    throw new Error(
      `No active ${cpId} QLs match${
        input.difficulty ? ` difficulty ${input.difficulty}` : " the request"
      }.`,
    );
  }
  if (input.questionLanguageId) {
    const explicit = entries.find(
      (entry) => entry.qlId === input.questionLanguageId,
    );
    if (!explicit) {
      throw new Error(
        `${input.questionLanguageId} is not active for ${cpId}${
          input.difficulty ? ` / ${input.difficulty}` : ""
        }.`,
      );
    }
    return explicit.qlId;
  }
  const seed = input.seed ?? `mal-001-question-studio:${cpId}`;
  return entries[hash(seed) % entries.length]!.qlId;
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
    const questionLanguageId = chooseQl(
      cpId,
      MAL_CP001_PERMANENT_ALLOCATION,
      input,
    ) as MalCp001PermanentQlId;
    return runMalCp001EnglishReleasePipeline({
      questionLanguageId,
      seed: input.seed,
      language: "en",
    });
  }

  if (cpId === "MAL-CP-002") {
    const questionLanguageId = chooseQl(
      cpId,
      MAL_CP002_PERMANENT_ALLOCATION,
      input,
    ) as MalCp002PermanentQlId;
    return runMalCp002EnglishEditorialV2Pipeline({
      questionLanguageId,
      seed: input.seed,
      language: "en",
    });
  }

  if (cpId === "MAL-CP-003") {
    const questionLanguageId = chooseQl(
      cpId,
      MAL_CP003_PERMANENT_ALLOCATION,
      input,
    ) as MalCp003PermanentQlId;
    return runMalCp003EnglishEditorialV2Pipeline({
      questionLanguageId,
      seed: input.seed,
      language: "en",
    });
  }

  if (cpId === "MAL-CP-004") {
    const questionLanguageId = chooseQl(
      cpId,
      MAL_CP004_PERMANENT_ALLOCATION,
      input,
    ) as MalCp004PermanentQlId;
    return runMalCp004EnglishChapterClosureV8Pipeline({
      questionLanguageId,
      seed: input.seed,
      language: "en",
    });
  }

  const questionLanguageId = chooseQl(
    cpId,
    MAL_CP005_RELEASE_ALLOCATION,
    input,
  ) as MalCp005PermanentQlId;
  return runMalCp005EnglishReleasePipeline({
    questionLanguageId,
    seed: input.seed,
    language: "en",
  });
}
