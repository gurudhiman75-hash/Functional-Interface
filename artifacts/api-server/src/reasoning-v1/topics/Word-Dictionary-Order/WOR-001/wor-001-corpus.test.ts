import assert from "node:assert/strict";
import { WOR_WORD_FAMILIES } from "./datasets/word-registry";
import type { WorDifficulty } from "./foundation/types";
import { generateWor001Question } from "./runtime";

const allRecords = WOR_WORD_FAMILIES.flatMap((family) => family.words);
const normalized = allRecords.map((record) => record.normalized);

assert.equal(WOR_WORD_FAMILIES.length, 30, "WOR-001 corpus should contain 30 curated families in remediation V1.");
assert.equal(allRecords.length, 360, "WOR-001 corpus should contain 360 curated word records in remediation V1.");
assert.equal(new Set(normalized).size, normalized.length, "WOR-001 corpus contains repeated normalized words.");
assert.equal(new Set(allRecords.map((record) => record.id)).size, allRecords.length, "WOR-001 corpus contains repeated word IDs.");
assert.ok(allRecords.every((record) => record.editorialStatus === "PROVISIONAL_REVIEW"));
assert.ok(WOR_WORD_FAMILIES.every((family) => family.words.length === 12), "Every remediation family should have a 12-word reservoir.");

const familyCountByTier = Object.fromEntries(["EASY", "MEDIUM", "HARD"].map((difficulty) => [
  difficulty,
  WOR_WORD_FAMILIES.filter((family) => family.tier === difficulty).length,
]));
assert.deepEqual(familyCountByTier, { EASY: 8, MEDIUM: 10, HARD: 12 });

for (const difficulty of ["EASY", "MEDIUM", "HARD"] as const satisfies readonly WorDifficulty[]) {
  const expectedFamilies = new Set(WOR_WORD_FAMILIES.filter((family) => family.tier === difficulty).map((family) => family.id));
  const observedFamilies = new Set<string>();
  const visibleSets = new Set<string>();
  const wordExposure = new Map<string, number>();

  for (let seed = 0; seed < 300; seed += 1) {
    const question = generateWor001Question("WOR-PROT-001", 50000 + seed, "en-IN", difficulty);
    assert.equal(question.difficulty, difficulty);
    observedFamilies.add(question.metadata.sourceFamilyId);
    const visible = [...question.structuredPrompt.words].map((word) => word.toUpperCase()).sort();
    visibleSets.add(visible.join("|"));
    visible.forEach((word) => wordExposure.set(word, (wordExposure.get(word) ?? 0) + 1));
  }

  assert.deepEqual([...observedFamilies].sort(), [...expectedFamilies].sort(), `${difficulty} family reachability is incomplete.`);
  assert.ok(visibleSets.size >= 255, `${difficulty} prompt-set uniqueness is below 85% across the 300-seed corpus audit: ${visibleSets.size}`);

  const maximumExposure = Math.max(...wordExposure.values());
  const totalSelections = [...wordExposure.values()].reduce((sum, count) => sum + count, 0);
  assert.ok(maximumExposure / totalSelections < 0.08, `${difficulty} corpus is over-concentrated on a single word.`);
}

console.log("WOR-001 corpus saturation and diversity audit passed.", {
  familyCount: WOR_WORD_FAMILIES.length,
  wordCount: allRecords.length,
  familyCountByTier,
});
