import assert from "node:assert/strict";

import { generateWor001Question } from "./runtime";
import {
  WOR_001_QUESTION_STUDIO_PRODUCTION_PROTOTYPES,
} from "./question-studio-production-authority";
import { WOR_001_QUESTION_STUDIO_CATALOG } from "./question-studio-review";
import type { WorDifficulty } from "./foundation/types";

const runtimeDifficulty: Record<string, WorDifficulty> = {
  Easy: "EASY",
  Medium: "MEDIUM",
  Hard: "HARD",
};

type Metrics = {
  count: number;
  scoreTotal: number;
  wordCountTotal: number;
  maxPrefixTotal: number;
  meanPrefixTotal: number;
  lateComparisonTotal: number;
  comparisonTotal: number;
  sharedPrefixQuestions: number;
};

function emptyMetrics(): Metrics {
  return {
    count: 0,
    scoreTotal: 0,
    wordCountTotal: 0,
    maxPrefixTotal: 0,
    meanPrefixTotal: 0,
    lateComparisonTotal: 0,
    comparisonTotal: 0,
    sharedPrefixQuestions: 0,
  };
}

function mean(total: number, count: number): number {
  return count ? total / count : 0;
}

const classicByBand: Record<WorDifficulty, Metrics> = {
  EASY: emptyMetrics(),
  MEDIUM: emptyMetrics(),
  HARD: emptyMetrics(),
};

const bankingByBand: Record<WorDifficulty, Metrics> = {
  EASY: emptyMetrics(),
  MEDIUM: emptyMetrics(),
  HARD: emptyMetrics(),
};

const bankingPlainTieCounts: Record<WorDifficulty, number[]> = {
  EASY: [],
  MEDIUM: [],
  HARD: [],
};

for (const prototype of WOR_001_QUESTION_STUDIO_PRODUCTION_PROTOTYPES) {
  const catalog = WOR_001_QUESTION_STUDIO_CATALOG.find((entry) => entry.prototypeId === prototype.prototypeId)!;
  for (const studioDifficulty of catalog.supportedDifficulties) {
    const difficulty = runtimeDifficulty[studioDifficulty]!;
    for (let index = 0; index < 120; index += 1) {
      const question = generateWor001Question(
        prototype.prototypeId,
        920000 + index,
        "en-IN",
        difficulty,
      );
      assert.equal(question.difficulty, difficulty);

      const target = prototype.checkpointId === "WOR-CP-005" ? bankingByBand[difficulty] : classicByBand[difficulty];
      const features = question.metadata.difficultyFeatures;
      target.count += 1;
      target.scoreTotal += features.score;
      target.wordCountTotal += features.wordCount;
      target.maxPrefixTotal += features.commonPrefixDepthMax;
      target.meanPrefixTotal += features.commonPrefixDepthMean;
      target.lateComparisonTotal += features.lateDecisionCount;
      target.comparisonTotal += question.metadata.comparisonTrace.length;
      if (question.metadata.comparisonTrace.some((trace) => trace.commonPrefixLength >= 1)) {
        target.sharedPrefixQuestions += 1;
      }

      if (prototype.prototypeId === "WOR-PROT-020") {
        const firstLetters = question.structuredPrompt.words.map((token) => token[0]!);
        bankingPlainTieCounts[difficulty].push(firstLetters.length - new Set(firstLetters).size);
      }
    }
  }
}

for (const band of ["EASY", "MEDIUM", "HARD"] as const) {
  assert.ok(classicByBand[band].count > 0, `Classic ${band} sample is empty`);
}

const classicMeanScore = (band: WorDifficulty) => mean(classicByBand[band].scoreTotal, classicByBand[band].count);
const classicMeanWords = (band: WorDifficulty) => mean(classicByBand[band].wordCountTotal, classicByBand[band].count);
const classicMeanMaxPrefix = (band: WorDifficulty) => mean(classicByBand[band].maxPrefixTotal, classicByBand[band].count);
const classicMeanPrefix = (band: WorDifficulty) => mean(classicByBand[band].meanPrefixTotal, classicByBand[band].count);
const classicLateRate = (band: WorDifficulty) => mean(classicByBand[band].lateComparisonTotal, classicByBand[band].comparisonTotal);
const classicSharedPrefixRate = (band: WorDifficulty) => mean(classicByBand[band].sharedPrefixQuestions, classicByBand[band].count);

assert.ok(classicMeanScore("MEDIUM") > classicMeanScore("EASY"), "Classic Medium mean difficulty score must exceed Easy.");
assert.ok(classicMeanScore("HARD") > classicMeanScore("MEDIUM"), "Classic Hard mean difficulty score must exceed Medium.");
assert.ok(classicMeanWords("MEDIUM") > classicMeanWords("EASY"), "Classic Medium should use more words on average than Easy.");
assert.ok(classicMeanWords("HARD") > classicMeanWords("MEDIUM"), "Classic Hard should use more words on average than Medium.");
assert.ok(classicMeanMaxPrefix("MEDIUM") > classicMeanMaxPrefix("EASY"), "Classic Medium max-prefix depth must exceed Easy.");
assert.ok(classicMeanMaxPrefix("HARD") > classicMeanMaxPrefix("MEDIUM"), "Classic Hard max-prefix depth must exceed Medium.");
assert.ok(classicMeanPrefix("MEDIUM") > classicMeanPrefix("EASY"), "Classic Medium mean prefix depth must exceed Easy.");
assert.ok(classicMeanPrefix("HARD") > classicMeanPrefix("MEDIUM"), "Classic Hard mean prefix depth must exceed Medium.");
assert.ok(classicLateRate("MEDIUM") > classicLateRate("EASY"), "Classic Medium late-decision rate must exceed Easy.");
assert.ok(classicLateRate("HARD") > classicLateRate("MEDIUM"), "Classic Hard late-decision rate must exceed Medium.");
assert.ok(classicSharedPrefixRate("EASY") >= 0.18, "Easy classic surface is too first-letter-trivial.");
assert.ok(classicSharedPrefixRate("HARD") > classicSharedPrefixRate("EASY"), "Hard classic surface must require shared-prefix comparison more often than Easy.");

for (const band of ["EASY", "MEDIUM", "HARD"] as const) {
  if (!bankingByBand[band].count) continue;
  assert.ok(mean(bankingByBand[band].scoreTotal, bankingByBand[band].count) > 0);
}
assert.ok(
  mean(bankingByBand.HARD.scoreTotal, bankingByBand.HARD.count)
    > mean(bankingByBand.MEDIUM.scoreTotal, bankingByBand.MEDIUM.count),
  "Banking Hard mean difficulty score must exceed Medium.",
);

assert.ok(bankingPlainTieCounts.EASY.length > 0 && bankingPlainTieCounts.MEDIUM.length > 0 && bankingPlainTieCounts.HARD.length > 0);
assert.ok(bankingPlainTieCounts.EASY.every((ties) => ties === 0), "WOR-PROT-020 Easy must remain first-letter separable.");
assert.ok(bankingPlainTieCounts.MEDIUM.every((ties) => ties >= 1), "WOR-PROT-020 Medium must contain at least one first-letter tie.");
assert.ok(bankingPlainTieCounts.HARD.every((ties) => ties === 4), "WOR-PROT-020 Hard must make all five groups share the first letter.");

console.log("WOR-001 deep audit Wave 3 difficulty realism passed.", {
  classic: Object.fromEntries((["EASY", "MEDIUM", "HARD"] as const).map((band) => [band, {
    sample: classicByBand[band].count,
    meanScore: Number(classicMeanScore(band).toFixed(3)),
    meanWords: Number(classicMeanWords(band).toFixed(3)),
    meanMaxPrefix: Number(classicMeanMaxPrefix(band).toFixed(3)),
    meanPrefix: Number(classicMeanPrefix(band).toFixed(3)),
    lateDecisionRate: Number(classicLateRate(band).toFixed(3)),
    sharedPrefixQuestionRate: Number(classicSharedPrefixRate(band).toFixed(3)),
  }])),
  banking: Object.fromEntries((["EASY", "MEDIUM", "HARD"] as const).map((band) => [band, {
    sample: bankingByBand[band].count,
    meanScore: Number(mean(bankingByBand[band].scoreTotal, bankingByBand[band].count).toFixed(3)),
  }])),
});
