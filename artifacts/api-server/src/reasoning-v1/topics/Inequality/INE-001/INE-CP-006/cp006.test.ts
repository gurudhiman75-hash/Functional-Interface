import assert from "node:assert/strict";
import { INE_CP006_PROTOTYPE_CONTRACTS } from "./contracts";
import { generateIneCp006Question } from "./generator";
import { validateIneCp006Question } from "./validator";

assert.equal(INE_CP006_PROTOTYPE_CONTRACTS.length, 4);
assert.equal(
  new Set(INE_CP006_PROTOTYPE_CONTRACTS.map((entry) => entry.prototypeId)).size,
  4,
);

const positionsByAuthority = new Map<string, number[]>();
const symbolSets = new Set<string>();
const codeMapIds = new Set<string>();
const topologies = new Set<string>();
const decodeRelations = new Set<string>();
const encodeRelations = new Set<string>();
const masks = new Set<string>();
const difficultyCounts = { EASY: 0, MEDIUM: 0, HARD: 0 };
let generatedCount = 0;
let maximumStatementCount = 0;

for (const contract of INE_CP006_PROTOTYPE_CONTRACTS) {
  for (let seed = 0; seed < 12; seed += 1) {
    const question = generateIneCp006Question(contract.prototypeId, seed);
    if (seed < 2)
      assert.deepEqual(
        generateIneCp006Question(contract.prototypeId, seed),
        question,
      );
    const validation = validateIneCp006Question(question);
    assert.equal(validation.valid, true, validation.errors.join(" "));
    assert.equal(question.checkpointId, "INE-CP-006");
    assert.equal(question.metadata.runtimeVersion, "ine-cp006-prototype-v1");
    assert.equal(question.displayedCodeKey.length, 5);
    assert.equal(question.structuredScenario.keyEntries.length, 5);
    assert.equal(
      new Set(
        Object.values(question.structuredScenario.codeMap.symbolByRelation),
      ).size,
      5,
    );
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((entry) => entry.value)).size, 4);
    assert.equal(question.options.filter((entry) => entry.isCorrect).length, 1);
    assert.equal(question.options[question.correctIndex]?.isCorrect, true);
    assert.equal(question.explanation.distractorAnalysis.length, 3);
    assert.ok(question.solutions.mock.length > 80);
    assert.ok(question.solutions.mock.length < 1500);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.questionStudioVisible, false);
    assert.match(question.recordId, /^INE-CP006-[0-9A-F]{8}$/);
    assert.match(question.metadata.contentHash, /^[0-9a-f]{8}$/);
    assert.deepEqual(
      question.metadata.sourceLedgerIds,
      contract.sourceLedgerIds,
    );

    const positions = positionsByAuthority.get(contract.authorityId) ?? [
      0, 0, 0, 0,
    ];
    positions[question.correctIndex] += 1;
    positionsByAuthority.set(contract.authorityId, positions);
    symbolSets.add(question.metadata.symbolSetId);
    codeMapIds.add(question.structuredScenario.codeMap.mapId);
    topologies.add(question.metadata.topologyId);
    difficultyCounts[question.difficulty] += 1;
    if (contract.taskKind === "DECODE_RELATION")
      decodeRelations.add(
        question.options[question.correctIndex]!.semanticValue!,
      );
    if (contract.taskKind === "ENCODE_RELATION")
      encodeRelations.add(
        question.options[question.correctIndex]!.encodedRelation!,
      );
    if (contract.taskKind === "EVALUATE_CONCLUSIONS") {
      masks.add(question.options[question.correctIndex]!.conclusionMask!);
      assert.equal(
        new Set(
          question.structuredScenario.conclusions.map((entry) =>
            [entry.leftId, entry.rightId].sort().join(":"),
          ),
        ).size,
        2,
      );
    }
    maximumStatementCount = Math.max(
      maximumStatementCount,
      question.structuredScenario.statements.length,
    );
    generatedCount += 1;
  }
}

assert.equal(generatedCount, 48);
assert.equal(symbolSets.size, 4);
assert.equal(codeMapIds.size, 12);
assert.ok(topologies.size >= 12);
assert.equal(decodeRelations.size, 5);
assert.equal(encodeRelations.size, 5);
assert.equal(masks.size, 4);
assert.equal(maximumStatementCount, 4);
assert.ok(difficultyCounts.EASY >= 24);
assert.ok(difficultyCounts.MEDIUM > 0);
assert.ok(difficultyCounts.HARD > 0);
for (const positions of positionsByAuthority.values())
  assert.deepEqual(positions, [3, 3, 3, 3]);

console.log("INE-CP-006 fixed-map coded-inequality audit passed.", {
  generatedCount,
  authorityCount: INE_CP006_PROTOTYPE_CONTRACTS.length,
  symbolSetCount: symbolSets.size,
  codeMapCount: codeMapIds.size,
  topologyCount: topologies.size,
  positionsByAuthority: Object.fromEntries(positionsByAuthority),
  difficultyCounts,
  maximumStatementCount,
  permanentQlCount: 0,
});
