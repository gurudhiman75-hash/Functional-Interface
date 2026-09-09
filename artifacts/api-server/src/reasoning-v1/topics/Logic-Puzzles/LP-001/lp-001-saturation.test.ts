import assert from "node:assert/strict";
import { generateCaseletBatch } from "./index.ts";

const caselets = generateCaseletBatch("lp-001-saturation", 500);
assert.equal(caselets.length, 500);
assert.equal(new Set(caselets.map((caselet) => caselet.scenarioProfileId)).size, 8);
assert.deepEqual(new Set(caselets.map((caselet) => caselet.difficultyBand)), new Set(["Medium", "Hard"]));
assert.deepEqual(new Set(caselets.flatMap((caselet) => caselet.clues.map((clue) => clue.kind))), new Set(["SAME_GROUP", "DIFFERENT_GROUPS", "NOT_IN_GROUP"]));
assert.ok(new Set(caselets.flatMap((caselet) => caselet.children.map((child) => child.stem))).size >= 8);
const qlPositionCounts = new Map<string, number[]>();
for (const caselet of caselets) for (const child of caselet.children) {
  const counts = qlPositionCounts.get(child.qlId) ?? [0, 0, 0, 0];
  counts[child.correctIndex] += 1;
  qlPositionCounts.set(child.qlId, counts);
}
for (const [qlId, counts] of qlPositionCounts) assert.deepEqual(counts, [125, 125, 125, 125], `${qlId} answer-slot balance failed`);
assert.equal(new Set(caselets.map((caselet) => caselet.children.map((child) => `${child.stem}|${child.answer}|${child.options.join(",")}`).join("\n"))).size, 500);
console.log("LP-001 saturation proof passed: 500 caselets, 8 profiles, 3 clue families, 2 difficulty bands, 2,000 balanced child questions.");
