import assert from "node:assert/strict";
import { WOR_WORD_FAMILIES } from "./datasets/word-registry";
import type { WorDifficulty } from "./foundation/types";
import { generateWor001Question } from "./runtime";

const allRecords = WOR_WORD_FAMILIES.flatMap((family) => family.words);
const normalized = allRecords.map((record) => record.normalized);

assert.equal(WOR_WORD_FAMILIES.length, 60, "WOR-001 expanded corpus must contain 60 curated families.");
assert.equal(allRecords.length, 720, "WOR-001 expanded corpus must contain 720 word records.");
assert.equal(new Set(normalized).size, normalized.length, "WOR-001 corpus contains repeated normalized words.");
assert.equal(new Set(allRecords.map((record) => record.id)).size, allRecords.length, "WOR-001 corpus contains repeated word IDs.");
assert.ok(allRecords.every((record) => record.editorialStatus === "PROVISIONAL_REVIEW"));
assert.ok(WOR_WORD_FAMILIES.every((family) => family.words.length === 12), "Every family must have a 12-word reservoir.");

const familyCountByTier = Object.fromEntries(["EASY", "MEDIUM", "HARD"].map((difficulty) => [
  difficulty,
  WOR_WORD_FAMILIES.filter((family) => family.tier === difficulty).length,
]));
assert.deepEqual(familyCountByTier, { EASY: 18, MEDIUM: 20, HARD: 22 });

let easyQuestionsWithSharedPrefix = 0;
let easyQuestions = 0;
for (const difficulty of ["EASY", "MEDIUM", "HARD"] as const satisfies readonly WorDifficulty[]) {
  const expectedFamilies = new Set(WOR_WORD_FAMILIES.filter((family) => family.tier === difficulty).map((family) => family.id));
  const observedFamilies = new Set<string>();
  const visibleSets = new Set<string>();
  const wordExposure = new Map<string, number>();

  for (let seed = 0; seed < 900; seed += 1) {
    const question = generateWor001Question("WOR-PROT-001", 50000 + seed, "en-IN", difficulty);
    assert.equal(question.difficulty, difficulty);
    observedFamilies.add(question.metadata.sourceFamilyId);
    const visible = [...question.structuredPrompt.words].map((word) => word.toUpperCase()).sort();
    visibleSets.add(visible.join("|"));
    visible.forEach((word) => wordExposure.set(word, (wordExposure.get(word) ?? 0) + 1));
    if (difficulty === "EASY") {
      easyQuestions += 1;
      if (question.metadata.comparisonTrace.some((trace) => trace.commonPrefixLength >= 1)) easyQuestionsWithSharedPrefix += 1;
    }
  }

  assert.deepEqual([...observedFamilies].sort(), [...expectedFamilies].sort(), `${difficulty} family reachability is incomplete.`);
  assert.ok(visibleSets.size >= 810, `${difficulty} prompt-set uniqueness is below 90% across the 900-seed audit: ${visibleSets.size}`);

  const maximumExposure = Math.max(...wordExposure.values());
  const totalSelections = [...wordExposure.values()].reduce((sum, count) => sum + count, 0);
  assert.ok(maximumExposure / totalSelections < 0.04, `${difficulty} corpus is over-concentrated on a single word.`);
}

const easySharedPrefixRate = easyQuestionsWithSharedPrefix / easyQuestions;
assert.ok(easySharedPrefixRate >= 0.18, `Expanded Easy pool is still too first-letter-trivial: ${(easySharedPrefixRate * 100).toFixed(1)}% shared-prefix questions.`);

console.log("WOR-001 expanded corpus saturation and diversity audit passed.", {
  familyCount: WOR_WORD_FAMILIES.length,
  wordCount: allRecords.length,
  familyCountByTier,
  easySharedPrefixRate: Number(easySharedPrefixRate.toFixed(3)),
});
