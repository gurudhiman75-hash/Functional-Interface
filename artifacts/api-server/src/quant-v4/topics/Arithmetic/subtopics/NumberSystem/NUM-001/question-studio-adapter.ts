import {
  NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE,
  getNum001QuestionStudioQlIds,
  runNum001EnglishQuestionStudioRelease,
  type Num001QuestionStudioCpId,
  type Num001QuestionStudioDifficulty,
  type Num001QuestionStudioQlId,
} from "./editorial/number-system-question-studio-release";

export const NUM_001_QUESTION_STUDIO_CP_IDS =
  NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE.cpIds;

export const NUM_001_QUESTION_STUDIO_LANGUAGES = ["en"] as const;

export type {
  Num001QuestionStudioCpId,
  Num001QuestionStudioQlId,
};

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

export function runNum001QuestionStudioPipeline(
  cpId: Num001QuestionStudioCpId,
  input: {
    difficulty?: Num001QuestionStudioDifficulty;
    language?: "en";
    questionLanguageId?: Num001QuestionStudioQlId | string;
    seed?: string;
  } = {},
) {
  if (!NUM_001_QUESTION_STUDIO_CP_IDS.includes(cpId)) {
    throw new Error(`Unknown canonical problem '${cpId}' for package NUM-001.`);
  }

  const language = input.language ?? "en";
  if (language !== "en") {
    throw new Error(
      `NUM-001 supports English generation only in Question Studio; received ${language}.`,
    );
  }

  const qlIds = getNum001QuestionStudioQlIds(cpId);
  let questionLanguageId = input.questionLanguageId as
    | Num001QuestionStudioQlId
    | undefined;

  if (questionLanguageId) {
    if (!qlIds.includes(questionLanguageId)) {
      throw new Error(`${questionLanguageId} is not active for ${cpId}.`);
    }
  } else {
    const seed = input.seed ?? `num-001-question-studio:${cpId}`;
    questionLanguageId = qlIds[hash(seed) % qlIds.length]!;
  }

  return runNum001EnglishQuestionStudioRelease(cpId, {
    questionLanguageId,
    difficulty: input.difficulty,
    language: "en",
    seed: input.seed,
  });
}
