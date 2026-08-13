import assert from "node:assert/strict";
import { INE_CP007_PROTOTYPE_CONTRACTS } from "./contracts";
import { generateIneCp007Question } from "./generator";
import { validateIneCp007Question } from "./validator";

assert.equal(INE_CP007_PROTOTYPE_CONTRACTS.length, 4);
const positions = new Map<string, number[]>();
const relations = new Set<string>();
let generatedCount = 0;
for (const contract of INE_CP007_PROTOTYPE_CONTRACTS) {
  for (let seed = 0; seed < 20; seed += 1) {
    const question = generateIneCp007Question(contract.prototypeId, seed);
    assert.deepEqual(generateIneCp007Question(contract.prototypeId, seed), question);
    const validation = validateIneCp007Question(question);
    assert.equal(validation.valid, true, validation.errors.join(" "));
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((entry) => entry.value)).size, 4);
    assert.equal(question.options.filter((entry) => entry.isCorrect).length, 1);
    assert.equal(question.options[question.correctIndex]?.isCorrect, true);
    assert.ok(question.explanation.length >= 40 && question.explanation.length <= 300);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.questionStudioVisible, false);
    const counts = positions.get(contract.authorityId) ?? [0, 0, 0, 0];
    counts[question.correctIndex] += 1;
    positions.set(contract.authorityId, counts);
    relations.add(question.structuredScenario.targetRelation);
    generatedCount += 1;
  }
}
assert.equal(generatedCount, 80);
assert.equal(relations.size, 5);
for (const counts of positions.values()) assert.deepEqual(counts, [5, 5, 5, 5]);
console.log("INE-CP-007 map-recovery audit passed.", {
  generatedCount,
  authorityCount: INE_CP007_PROTOTYPE_CONTRACTS.length,
  relationCount: relations.size,
  positions: Object.fromEntries(positions),
});
