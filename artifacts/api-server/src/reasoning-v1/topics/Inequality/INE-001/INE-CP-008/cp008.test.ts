import assert from "node:assert/strict";
import { INE_CP008_PROTOTYPE_CONTRACTS } from "./contracts";
import { generateIneCp008Question } from "./generator";
import { validateIneCp008Question } from "./validator";

assert.equal(INE_CP008_PROTOTYPE_CONTRACTS.length, 4);
const positions = new Map<string, number[]>();
const entitySets = new Set<string>();
const topologies = new Set<string>();
let generatedCount = 0;
for (const contract of INE_CP008_PROTOTYPE_CONTRACTS) {
  for (let seed = 0; seed < 20; seed += 1) {
    const question = generateIneCp008Question(contract.prototypeId, seed);
    assert.deepEqual(
      generateIneCp008Question(contract.prototypeId, seed),
      question,
    );
    const validation = validateIneCp008Question(question);
    assert.equal(validation.valid, true, validation.errors.join(" "));
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((entry) => entry.value)).size, 4);
    assert.equal(question.options.filter((entry) => entry.isCorrect).length, 1);
    assert.equal(question.options[question.correctIndex]?.isCorrect, true);
    assert.ok(question.explanation.length >= 70);
    assert.ok(question.explanation.length <= 300);
    assert.doesNotMatch(
      question.explanation,
      /\b(?:endpoint|model|formally|solver|strict parts|strongest definite relation|carry|carries)\b/i,
    );
    assert.equal(question.permanentQlId, null);
    assert.equal(question.questionStudioVisible, false);
    const counts = positions.get(contract.authorityId) ?? [0, 0, 0, 0];
    counts[question.correctIndex] += 1;
    positions.set(contract.authorityId, counts);
    entitySets.add(
      Object.values(question.structuredScenario.entityNames).join("/"),
    );
    topologies.add(question.metadata.topologyId);
    generatedCount += 1;
  }
}
assert.equal(generatedCount, 80);
assert.equal(entitySets.size, 12);
assert.equal(topologies.size, 4);
for (const counts of positions.values()) assert.deepEqual(counts, [5, 5, 5, 5]);
console.log("INE-CP-008 advanced-synthesis audit passed.", {
  generatedCount,
  authorityCount: INE_CP008_PROTOTYPE_CONTRACTS.length,
  entitySetCount: entitySets.size,
  topologyCount: topologies.size,
  positions: Object.fromEntries(positions),
});
