import assert from "node:assert/strict";

import { evaluateComplementaryPair } from "./complementary";
import { INE_CP004_PROTOTYPE_CONTRACTS } from "./contracts";
import { generateIneCp004Question } from "./generator";
import { validateIneCp004Question } from "./validator";

assert.equal(INE_CP004_PROTOTYPE_CONTRACTS.length, 4);
assert.equal(
  new Set(INE_CP004_PROTOTYPE_CONTRACTS.map((entry) => entry.prototypeId)).size,
  4,
);
assert.equal(
  new Set(INE_CP004_PROTOTYPE_CONTRACTS.map((entry) => entry.authorityId)).size,
  4,
);
assert.ok(
  INE_CP004_PROTOTYPE_CONTRACTS.every(
    (entry) =>
      entry.status === "PROTOTYPE" &&
      entry.permanentQlId === null &&
      entry.sourceLedgerIds.length > 0,
  ),
);

const positionsByAuthority = new Map<string, number[]>();
const pairStatuses = new Set<string>();
const topologies = new Set<string>();
const taskKinds = new Set<string>();
let reversedPairCount = 0;
let conditionalStrictEqualityCount = 0;
let universalStrictInclusiveCount = 0;
let generatedCount = 0;

for (const contract of INE_CP004_PROTOTYPE_CONTRACTS) {
  for (let seed = 0; seed < 12; seed += 1) {
    const question = generateIneCp004Question(contract.prototypeId, seed);
    if (seed < 2) {
      assert.deepEqual(
        generateIneCp004Question(contract.prototypeId, seed),
        question,
      );
    }
    const validation = validateIneCp004Question(question);
    assert.equal(validation.valid, true, validation.errors.join(" "));
    assert.equal(question.checkpointId, "INE-CP-004");
    assert.equal(question.authorityId, contract.authorityId);
    assert.equal(question.metadata.runtimeVersion, "ine-cp004-prototype-v1");
    assert.equal(question.metadata.deliveryProfile, contract.deliveryProfile);
    assert.deepEqual(
      question.metadata.sourceLedgerIds,
      contract.sourceLedgerIds,
    );
    assert.equal(question.permanentQlId, null);
    assert.equal(question.prototypeOnly, true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.questionStudioVisible, false);
    const expectedOptionCount =
      contract.taskKind === "CLASSIFY_PAIR"
        ? 3
        : contract.taskKind === "EVALUATE_TWO_CONCLUSIONS"
          ? 5
          : 4;
    assert.equal(question.options.length, expectedOptionCount);
    assert.equal(
      new Set(question.options.map((option) => option.value)).size,
      expectedOptionCount,
    );
    assert.equal(
      question.options.filter((option) => option.isCorrect).length,
      1,
    );
    assert.equal(question.options[question.correctIndex]?.isCorrect, true);
    assert.equal(
      question.explanation.distractorAnalysis.length,
      expectedOptionCount - 1,
    );
    assert.ok(question.solutions.mock.length > 100);
    assert.match(question.recordId, /^INE-CP004-[0-9A-F]{8}$/);
    assert.match(question.metadata.contentHash, /^[0-9a-f]{8}$/);
    assert.match(question.metadata.structuralFingerprint, /^[0-9a-f]{8}$/);

    const positions =
      positionsByAuthority.get(contract.authorityId) ??
      Array.from({ length: expectedOptionCount }, () => 0);
    positions[question.correctIndex] += 1;
    positionsByAuthority.set(contract.authorityId, positions);

    if (contract.taskKind === "CLASSIFY_PAIR") {
      pairStatuses.add(question.structuredScenario.expectedPairStatus!);
    }
    if (contract.taskKind === "EVALUATE_TWO_CONCLUSIONS") {
      assert.equal(
        question.options[question.correctIndex]!.twoConclusionMask,
        "EITHER_I_OR_II",
      );
    }
    if (contract.taskKind === "EVALUATE_THREE_CONCLUSIONS") {
      assert.equal(
        question.options[question.correctIndex]!.threeConclusionMask,
        "I_AND_EITHER_II_OR_III",
      );
    }

    const pairs =
      question.structuredScenario.taskKind === "SELECT_PAIR"
        ? question.structuredScenario.candidatePairs!
        : question.structuredScenario.conclusions.length >= 2
          ? [
              {
                first:
                  question.structuredScenario.conclusions[
                    question.structuredScenario.conclusions.length - 2
                  ]!,
                second:
                  question.structuredScenario.conclusions[
                    question.structuredScenario.conclusions.length - 1
                  ]!,
              },
            ]
          : [];
    for (const pair of pairs) {
      const evidence = evaluateComplementaryPair(
        question.structuredScenario.statements,
        pair,
      );
      assert.equal(evidence.sameCanonicalPair, true);
      if (evidence.validEitherOr) {
        const relations = [pair.first.relation, pair.second.relation];
        if (
          evidence.validAtomicRelations.length === 2 &&
          relations.includes("EQUAL_TO") &&
          relations.some(
            (relation) =>
              relation === "GREATER_THAN" || relation === "LESS_THAN",
          )
        ) {
          conditionalStrictEqualityCount += 1;
        }
        if (
          evidence.validAtomicRelations.length === 3 &&
          relations.some(
            (relation) =>
              relation === "GREATER_THAN" || relation === "LESS_THAN",
          ) &&
          relations.some(
            (relation) =>
              relation === "GREATER_THAN_OR_EQUAL" ||
              relation === "LESS_THAN_OR_EQUAL",
          )
        ) {
          universalStrictInclusiveCount += 1;
        }
      }
      if (
        pair.first.leftId === pair.second.rightId &&
        pair.first.rightId === pair.second.leftId
      ) {
        reversedPairCount += 1;
      }
    }

    const learnerText = JSON.stringify({
      stem: question.stem,
      statements: question.displayedStatements,
      conclusions: question.displayedConclusions,
      options: question.options.map((option) => option.value),
      solutions: question.solutions,
    });
    assert.ok(!/\bE[1-9]\b/.test(learnerText));
    assert.ok(!/\b(?:undefined|null|NaN)\b/.test(learnerText));

    topologies.add(question.metadata.topologyId);
    taskKinds.add(question.metadata.taskKind);
    generatedCount += 1;
  }
}

assert.equal(generatedCount, 48);
assert.equal(topologies.size, 8);
assert.equal(taskKinds.size, 4);
assert.deepEqual([...pairStatuses].sort(), [
  "NOT_EXCLUSIVE",
  "NOT_EXHAUSTIVE",
  "VALID_EITHER_OR",
]);
assert.ok(reversedPairCount > 0);
assert.ok(conditionalStrictEqualityCount > 0);
assert.ok(universalStrictInclusiveCount > 0);
for (const positions of positionsByAuthority.values()) {
  assert.ok(Math.max(...positions) - Math.min(...positions) <= 1);
}

console.log("INE-CP-004 complementary-reasoning audit passed.", {
  generatedCount,
  authorityCount: INE_CP004_PROTOTYPE_CONTRACTS.length,
  topologies: topologies.size,
  pairStatuses: [...pairStatuses].sort(),
  positionsByAuthority: Object.fromEntries(positionsByAuthority),
  reversedPairCount,
  conditionalStrictEqualityCount,
  universalStrictInclusiveCount,
  permanentQlCount: 0,
});
