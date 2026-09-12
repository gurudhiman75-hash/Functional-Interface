import assert from "node:assert/strict";

import {
  ARG_CP015_ANTI_GAMING_CUE_DEBIAS_AUTHORITY,
} from "./cp015-anti-gaming-cue-debias.ts";
import { generateArgCp015QuestionStudioBatch } from "./cp015-perceived-diversity-expansion.ts";
import { ARG_QL_IDS } from "./types.ts";

type Language = "en" | "hi" | "pa";
type Strength = "STRONG" | "WEAK";
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

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function hasCue(value: string, language: Language): boolean {
  if (language === "hi") {
    return /हमेशा|कभी नहीं|(?:^|\s)हर(?=\s)|(?:^|\s)सभी(?=\s)|पूरी तरह|गारंटी|असंभव|अपने[- ]आप|केवल तभी|निश्चित रूप से|ज़रूर कुछ छिपाने|जरूर कुछ छिपाने/.test(value);
  }
  if (language === "pa") {
    return /ਹਮੇਸ਼ਾ|ਹਮੇਸ਼ਾ|ਕਦੇ ਨਹੀਂ|(?:^|\s)ਹਰ(?=\s)|(?:^|\s)ਸਾਰੇ(?=\s)|(?:^|\s)ਸਾਰੀ(?=\s)|ਪੂਰੀ ਤਰ੍ਹਾਂ|ਗਾਰੰਟੀ|ਅਸੰਭਵ|ਆਪਣੇ ਆਪ|ਸਿਰਫ਼ (?:ਉਸ ਵੇਲੇ|ਤਦ)|ਜ਼ਰੂਰ|ਜ਼ਰੂਰ/.test(value);
  }
  return /\b(?:always|never|every|everyone|everything|completely|guarantee(?:s|d)?|impossible|automatically|inevitably|necessarily|only when)\b|under any circumstances|must have something to hide/i.test(value);
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
        seed: `ARG-CP015-ANTI-GAMING:${language}:${qlId}:${cell.examProfile ?? "CORE"}:${cell.difficulty}:${cellIndex}:${attempt}`,
        count: cell.count,
      });
      if (batch.questions.length === cell.count) return batch.questions as readonly Question[];
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes("could not resolve a unique question")) throw error;
    }
  }
  throw new Error(`${language}/${qlId}/${cell.examProfile ?? "CORE"}/${cell.difficulty}: anti-gaming sampler could not resolve a valid deterministic cell.`);
}

const counts = Object.fromEntries(LANGUAGES.map((language) => [language, {
  STRONG: { total: 0, cue: 0 },
  WEAK: { total: 0, cue: 0 },
  debiasedQuestions: 0,
}])) as Record<Language, {
  STRONG: { total: number; cue: number };
  WEAK: { total: number; cue: number };
  debiasedQuestions: number;
}>;

for (const language of LANGUAGES) {
  for (const qlId of ARG_QL_IDS) {
    for (let cellIndex = 0; cellIndex < CELLS.length; cellIndex += 1) {
      const cell = CELLS[cellIndex]!;
      const questions = sampleCell(language, qlId, cell, cellIndex);

      for (const question of questions) {
        const argumentsList = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
        const strengths = Array.isArray(question.argumentStrengths) ? question.argumentStrengths as readonly string[] : [];
        assert.equal(argumentsList.length, strengths.length, `${question.questionId}: arguments/strengths mismatch`);
        if (question.antiGamingCueDebiasAuthority === ARG_CP015_ANTI_GAMING_CUE_DEBIAS_AUTHORITY) {
          counts[language].debiasedQuestions += 1;
        }

        argumentsList.forEach((argument, index) => {
          const strength = text(strengths[index]).toUpperCase() as Strength;
          assert.ok(strength === "STRONG" || strength === "WEAK", `${question.questionId}: invalid argument strength`);
          counts[language][strength].total += 1;
          if (hasCue(argument, language)) counts[language][strength].cue += 1;
        });
      }
    }
  }
}

const metrics = Object.fromEntries(LANGUAGES.map((language) => {
  const strong = counts[language].STRONG;
  const weak = counts[language].WEAK;
  const strongRate = strong.total ? strong.cue / strong.total : 0;
  const weakRate = weak.total ? weak.cue / weak.total : 0;
  const gap = weakRate - strongRate;

  assert.ok(strong.total >= 70, `${language}: anti-gaming proof sampled too few strong arguments (${strong.total})`);
  assert.ok(weak.total >= 70, `${language}: anti-gaming proof sampled too few weak arguments (${weak.total})`);
  assert.ok(counts[language].debiasedQuestions >= 8, `${language}: anti-gaming layer did not activate across enough sampled questions`);
  assert.ok(strongRate <= 0.20, `${language}: strong-argument cue rate ${(strongRate * 100).toFixed(1)}% exceeds 20%`);
  assert.ok(weakRate <= 0.28, `${language}: weak-argument cue rate ${(weakRate * 100).toFixed(1)}% exceeds 28%`);
  assert.ok(gap <= 0.18, `${language}: weak-vs-strong lexical cue gap ${(gap * 100).toFixed(1)}pp exceeds 18pp`);

  return [language, {
    strong: `${strong.cue}/${strong.total}`,
    strongCueRate: Number((strongRate * 100).toFixed(1)),
    weak: `${weak.cue}/${weak.total}`,
    weakCueRate: Number((weakRate * 100).toFixed(1)),
    weakMinusStrongGapPoints: Number((gap * 100).toFixed(1)),
    debiasedQuestions: counts[language].debiasedQuestions,
  }];
}));

console.log(JSON.stringify({
  status: "PASS_ARG_CP015_ANTI_GAMING_CUE_DEBIAS",
  authority: ARG_CP015_ANTI_GAMING_CUE_DEBIAS_AUTHORITY,
  sampledLanguages: LANGUAGES,
  sampledQuestions: LANGUAGES.length * ARG_QL_IDS.length * 12,
  metrics,
}, null, 2));
