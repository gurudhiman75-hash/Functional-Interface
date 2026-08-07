import assert from "node:assert/strict";
import { normalizePhraseKey } from "../foundation/relations";
import { INE_CP005_PROTOTYPE_CONTRACTS } from "./contracts";
import { generateIneCp005Question } from "./generator";
import { validateIneCp005Question } from "./validator";

assert.equal(INE_CP005_PROTOTYPE_CONTRACTS.length, 4);
assert.equal(
  new Set(INE_CP005_PROTOTYPE_CONTRACTS.map((entry) => entry.prototypeId)).size,
  4,
);

const positionsByAuthority = new Map<string, number[]>();
const phraseKeys = new Set<string>();
const contexts = new Set<string>();
const topologies = new Set<string>();
const masks = new Set<string>();
const interpretRelations = new Set<string>();
const difficultyCounts = { EASY: 0, MEDIUM: 0, HARD: 0 };
let generatedCount = 0;
let maximumStatementCount = 0;

for (const contract of INE_CP005_PROTOTYPE_CONTRACTS) {
  for (let seed = 0; seed < 12; seed += 1) {
    const question = generateIneCp005Question(contract.prototypeId, seed);
    if (seed < 2)
      assert.deepEqual(
        generateIneCp005Question(contract.prototypeId, seed),
        question,
      );
    const validation = validateIneCp005Question(question);
    assert.equal(validation.valid, true, validation.errors.join(" "));
    assert.equal(question.checkpointId, "INE-CP-005");
    assert.equal(question.metadata.runtimeVersion, "ine-cp005-prototype-v1");
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((entry) => entry.value)).size, 4);
    assert.equal(question.options.filter((entry) => entry.isCorrect).length, 1);
    assert.equal(question.options[question.correctIndex]?.isCorrect, true);
    assert.equal(question.explanation.distractorAnalysis.length, 3);
    assert.ok(question.solutions.mock.length > 80);
    assert.ok(question.solutions.mock.length < 1100);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.questionStudioVisible, false);
    assert.match(question.recordId, /^INE-CP005-[0-9A-F]{8}$/);
    assert.match(question.metadata.contentHash, /^[0-9a-f]{8}$/);
    assert.deepEqual(
      question.metadata.sourceLedgerIds,
      contract.sourceLedgerIds,
    );
    difficultyCounts[question.difficulty] += 1;

    const positions = positionsByAuthority.get(contract.authorityId) ?? [
      0, 0, 0, 0,
    ];
    positions[question.correctIndex] += 1;
    positionsByAuthority.set(contract.authorityId, positions);
    question.structuredScenario.renderedStatements.forEach((entry) => {
      if (entry.phraseKey) {
        phraseKeys.add(entry.phraseKey);
        assert.equal(
          normalizePhraseKey(entry.phraseKey),
          entry.constraint.relation,
        );
      }
    });
    if (contract.taskKind === "SOLVE_MIXED_RELATION") {
      assert.ok(question.metadata.linguisticStatementCount >= 1);
      assert.ok(question.metadata.symbolicStatementCount >= 1);
    }
    if (contract.taskKind === "INTERPRET_RELATION")
      interpretRelations.add(
        question.options[question.correctIndex]!.semanticValue!,
      );
    if (contract.taskKind === "EVALUATE_CONCLUSIONS")
      masks.add(question.options[question.correctIndex]!.conclusionMask!);
    contexts.add(question.metadata.context);
    topologies.add(question.metadata.topologyId);
    maximumStatementCount = Math.max(
      maximumStatementCount,
      question.displayedStatements.length,
    );
    generatedCount += 1;
  }
}

assert.equal(generatedCount, 48);
assert.equal(phraseKeys.size, 8);
assert.equal(contexts.size, 8);
assert.ok(topologies.size >= 12);
assert.equal(masks.size, 4);
assert.equal(interpretRelations.size, 5);
assert.equal(maximumStatementCount, 4);
assert.deepEqual(difficultyCounts, { EASY: 14, MEDIUM: 22, HARD: 12 });
for (const positions of positionsByAuthority.values())
  assert.deepEqual(positions, [3, 3, 3, 3]);

console.log("INE-CP-005 linguistic-inequality audit passed.", {
  generatedCount,
  authorityCount: INE_CP005_PROTOTYPE_CONTRACTS.length,
  phraseKeyCount: phraseKeys.size,
  contextCount: contexts.size,
  topologyCount: topologies.size,
  positionsByAuthority: Object.fromEntries(positionsByAuthority),
  maximumStatementCount,
  difficultyCounts,
  permanentQlCount: 0,
});
