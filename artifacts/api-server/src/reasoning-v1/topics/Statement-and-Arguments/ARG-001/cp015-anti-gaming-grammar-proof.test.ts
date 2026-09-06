import assert from "node:assert/strict";

import { generateArgCp015QuestionStudioBatch } from "./cp015-perceived-diversity-expansion.ts";
import { ARG_QL_IDS } from "./types.ts";

type Language = "en" | "hi" | "pa";
type Question = Readonly<Record<string, any>>;
type Cell = Readonly<{
  profileMode: "core" | "real-paper";
  examProfile?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  count: number;
}>;

const LANGUAGES = Object.freeze(["en", "hi", "pa"] as const);
const CELLS: readonly Cell[] = Object.freeze([
  { profileMode: "core", difficulty: "Easy", count: 1 },
  { profileMode: "core", difficulty: "Medium", count: 1 },
  { profileMode: "core", difficulty: "Hard", count: 1 },
  { profileMode: "real-paper", examProfile: "SSC_RECENT_2X4", difficulty: "Easy", count: 1 },
  { profileMode: "real-paper", examProfile: "SSC_RECENT_2X4", difficulty: "Medium", count: 1 },
  { profileMode: "real-paper", examProfile: "BANKING_CLASSIC_2X5", difficulty: "Medium", count: 1 },
  { profileMode: "real-paper", examProfile: "BANKING_CLASSIC_2X5", difficulty: "Hard", count: 1 },
  { profileMode: "real-paper", examProfile: "BANKING_COMBO_3X5", difficulty: "Medium", count: 1 },
  { profileMode: "real-paper", examProfile: "BANKING_COMBO_3X5", difficulty: "Hard", count: 1 },
  { profileMode: "real-paper", examProfile: "BANKING_COMBO_4X5", difficulty: "Hard", count: 3 },
]);

const MALFORMED: Readonly<Record<Language, readonly RegExp[]>> = Object.freeze({
  en: Object.freeze([
    /\bmost\s+(?:ten|genuine|legitimate|employee)\b/i,
    /disappear largely/i,
    /in most [a-z-]+(?: [a-z-]+)* programme\b/i,
    /service needs should rarely affect the timings/i,
    /most [a-z-]+ programme\b/i,
    /\bcan rarely\b/i,
    /\bshould rarely\b/i,
    /\bmust apparently\b/i,
    /\bmost (?:citizen|visitor|part|people else)\b/i,
    /\bin most context\b/i,
    /\bwill readily become available\b/i,
    /\bwill work readily\b/i,
    /\bmost use of\b/i,
    /\bpermanently impractical\b/i,
    /\bwill predictably create permanent gridlock\b/i,
    /\bcan occur mainly when guilt is certain\b/i,
    /should be treated as sufficient to solve the queue problem/i,
    /will largely solve most related difficult/i,
    /\bis generally proof of fraud\b/i,
  ]),
  hi: Object.freeze([
    /अधिकांश दस दिन/,
    /अधिकांश [^।,.]+ कार्यक्रम में/,
    /अनजाने उल्लंघनों काफी हद तक समाप्त/,
    /अधिकांश कर्मचारी को/,
    /अवश्य देते हैं/,
  ]),
  pa: Object.freeze([
    /ਅਕਸਰਂ/,
    /ਸ਼ਾਇਦੀ/,
    /ਜ਼ਿਆਦਾਤਰ ਕਿਸੇ ਦੇ/,
    /ਜ਼ਿਆਦਾਤਰ [^।,.]+ ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ/,
    /ਲਾਜ਼ਮੀ ਦਿੰਦੇ ਹਨ/,
  ]),
});

function words(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function sampleCell(language: Language, qlId: string, cell: Cell, cellIndex: number): readonly Question[] {
  for (let attempt = 0; attempt < 256; attempt += 1) {
    try {
      const batch = generateArgCp015QuestionStudioBatch({
        profileMode: cell.profileMode,
        examProfile: cell.examProfile,
        qlId,
        language,
        difficulty: cell.difficulty,
        seed: `ARG-CP015-GRAMMAR:${language}:${qlId}:${cell.examProfile ?? "CORE"}:${cell.difficulty}:${cellIndex}:${attempt}`,
        count: cell.count,
      });
      if (batch.questions.length === cell.count) return batch.questions as readonly Question[];
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes("could not resolve a unique question")) throw error;
    }
  }
  throw new Error(`${language}/${qlId}/${cell.examProfile ?? "CORE"}/${cell.difficulty}: grammar sampler could not resolve a valid deterministic cell.`);
}

let sampledQuestions = 0;
let sampledArguments = 0;
let grammarPolishedQuestions = 0;

for (const language of LANGUAGES) {
  for (const qlId of ARG_QL_IDS) {
    for (let cellIndex = 0; cellIndex < CELLS.length; cellIndex += 1) {
      const cell = CELLS[cellIndex]!;
      const questions = sampleCell(language, qlId, cell, cellIndex);
      for (const question of questions) {
        sampledQuestions += 1;
        if (question.antiGamingGrammarPolishAuthority) grammarPolishedQuestions += 1;
        const argumentsList = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
        sampledArguments += argumentsList.length;

        for (const [argumentIndex, argument] of argumentsList.entries()) {
          for (const pattern of MALFORMED[language]) {
            assert.doesNotMatch(
              argument,
              pattern,
              `${question.questionId}/argument-${argumentIndex + 1}: malformed anti-gaming rewrite: ${argument}`,
            );
          }
          if (question.examProfile === "SSC_RECENT_2X4") {
            assert.ok(words(argument) <= 34, `${question.questionId}/argument-${argumentIndex + 1}: SSC argument exceeds 34 words after grammar polish`);
          }
        }
      }
    }
  }
}

assert.equal(sampledQuestions, 216);
assert.ok(sampledArguments >= 500, `Grammar proof sampled too few arguments: ${sampledArguments}`);
assert.ok(grammarPolishedQuestions >= 10, `Grammar polish activated on too few sampled questions: ${grammarPolishedQuestions}`);

console.log(JSON.stringify({
  status: "PASS_ARG_CP015_ANTI_GAMING_GRAMMAR",
  sampledQuestions,
  sampledArguments,
  grammarPolishedQuestions,
  languages: LANGUAGES,
}, null, 2));
