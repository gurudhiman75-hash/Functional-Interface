import {
  getAvg001QuestionEntries,
  type Avg001Language,
  type Avg001QuestionPackage,
} from "./index";
import { runAvg001EditorialV2Pipeline } from "./foundation/editorial-v2-release";
import { runAvg001LocalizedRelease } from "./foundation/localized-release";

export const AVG_001_QUESTION_STUDIO_CP_IDS = [
  "AVG-CP-001",
  "AVG-CP-002",
  "AVG-CP-003",
  "AVG-CP-004",
  "AVG-CP-005",
  "AVG-CP-006",
] as const;

export const AVG_001_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;

export type Avg001QuestionStudioCpId =
  (typeof AVG_001_QUESTION_STUDIO_CP_IDS)[number];

type Difficulty = "Easy" | "Medium" | "Hard";

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

export function runAvg001QuestionStudioPipeline(
  cpId: Avg001QuestionStudioCpId,
  input: {
    difficulty?: Difficulty;
    language?: Avg001Language;
    questionLanguageId?: string;
    seed?: string;
  } = {},
): Avg001QuestionPackage {
  const language = input.language ?? "en";
  if (!AVG_001_QUESTION_STUDIO_LANGUAGES.includes(language as "en" | "hi" | "pa")) {
    throw new Error(`AVG-001 does not support Question Studio language ${language}`);
  }

  const entries = getAvg001QuestionEntries().filter(
    (entry) =>
      entry.cpId === cpId &&
      (!input.difficulty || entry.difficulty === input.difficulty),
  );
  if (!entries.length) {
    throw new Error(`No active AVG-001 QLs match ${cpId}${input.difficulty ? ` / ${input.difficulty}` : ""}`);
  }

  let questionLanguageId = input.questionLanguageId;
  if (questionLanguageId) {
    const explicit = entries.find((entry) => entry.qlId === questionLanguageId);
    if (!explicit) {
      throw new Error(
        `${questionLanguageId} is not active for ${cpId}${input.difficulty ? ` / ${input.difficulty}` : ""}`,
      );
    }
  } else {
    const seed = input.seed ?? `avg-001-question-studio:${language}:${cpId}`;
    questionLanguageId = entries[hash(seed) % entries.length]!.qlId;
  }

  if (language === "en") {
    return runAvg001EditorialV2Pipeline({
      questionLanguageId,
      seed: input.seed,
      language,
    });
  }

  return runAvg001LocalizedRelease({
    questionLanguageId,
    seed: input.seed,
    language,
  });
}
