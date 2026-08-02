import assert from "node:assert/strict";

import { buildBlrCp005Telemetry, generateBlrCp005FrozenBank } from "./cp005-bank";
import { independentlyVerifyBlrCp005Question } from "./cp005-independent-verifier";
import {
  BLR_CP005_FREEZE_VERSION,
  BLR_CP005_OWNER_DIRECTIVE,
  BLR_CP005_PERMANENT_CONTRACTS,
  BLR_CP005_RUNTIME_VERSION,
  type BlrCp005QlId,
} from "./cp005-model";
import { generateBlrCp005Question, generateBlrCp005QuestionGroup } from "./cp005-runtime";

const bank = generateBlrCp005FrozenBank();
const telemetry = buildBlrCp005Telemetry(bank);

assert.equal(BLR_CP005_RUNTIME_VERSION, "blr-cp005-permanent-runtime-v1");
assert.equal(BLR_CP005_FREEZE_VERSION, "BLR_CP005_ENGLISH_DISCOVERY_FREEZE_V1");
assert.equal(BLR_CP005_OWNER_DIRECTIVE, "APPROVED_CONTINUE");
assert.equal(bank.length, 184);
assert.equal(telemetry.recordCount, 184);
assert.equal(telemetry.groupCount, 80);
assert.equal(telemetry.scenarioCount, 10);
assert.equal(telemetry.topologyCount, 10);
assert.equal(telemetry.prototypeCount, 23);
assert.equal(telemetry.authorityCount, 8);
assert.equal(telemetry.permanentQlCount, 8);
assert.deepEqual(telemetry.modelCountRange, [2, 3]);
assert.equal(telemetry.totalEnumeratedModels, 432);
assert.equal(telemetry.uniqueQuestionSignatureCount, 184);
assert.equal(telemetry.questionSignatureUniquenessRatio, 1);
assert.equal(telemetry.permanentQlRange, "BLR-QL-018..BLR-QL-025");
assert.equal(telemetry.nextAvailableChapterQlId, "BLR-QL-026");
assert.ok(telemetry.answerPositions.every((count) => count >= 30));
assert.ok((telemetry.difficultyCounts.EASY ?? 0) > 0);
assert.ok((telemetry.difficultyCounts.MEDIUM ?? 0) > 0);
assert.ok((telemetry.difficultyCounts.HARD ?? 0) > 0);

assert.deepEqual(
  BLR_CP005_PERMANENT_CONTRACTS.map((contract) => contract.qlId),
  ["BLR-QL-018", "BLR-QL-019", "BLR-QL-020", "BLR-QL-021", "BLR-QL-022", "BLR-QL-023", "BLR-QL-024", "BLR-QL-025"],
);
assert.deepEqual(
  BLR_CP005_PERMANENT_CONTRACTS.map((contract) => contract.solveAuthority),
  [
    "RESOLVE_INVARIANT_RELATION",
    "RESOLVE_RELATION_UNCERTAINTY",
    "SELECT_CLAIM_BY_MODEL_STATUS",
    "IDENTIFY_PERSON_BY_MODEL_STATUS",
    "RESOLVE_PERSON_IDENTITY_UNCERTAINTY",
    "DETERMINE_COUNT_BOUND",
    "SELECT_COUNT_BY_MODEL_STATUS",
    "RESOLVE_COUNT_DETERMINACY",
  ],
);

for (const contract of BLR_CP005_PERMANENT_CONTRACTS) {
  assert.equal(contract.status, "ENGLISH_DISCOVERY_FROZEN");
  assert.equal(contract.reviewOnly, true);
  assert.equal(contract.publiclyPublishable, false);
  assert.equal(contract.questionStudioVisible, false);
  assert.equal(contract.questionBankEligible, false);
  assert.equal(contract.mockTestEligible, false);
  for (const prototypeId of contract.sourcePrototypeIds) {
    assert.equal(telemetry.prototypeCounts[prototypeId], 8, `Missing or incomplete ${prototypeId}.`);
  }
}

for (const question of bank) {
  const independent = independentlyVerifyBlrCp005Question(question);
  assert.ok(independent.expectedSemanticKey.length > 0);
  assert.equal(question.explanation.familyTrees.length, question.modelSpace.modelCount);
  assert.equal(question.modelSpace.modelFingerprints.length, question.modelSpace.modelCount);
  assert.equal(new Set(question.modelSpace.modelFingerprints).size, question.modelSpace.modelCount);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.semanticKey)).size, 4);
  assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(question.options[question.correctIndex]?.isCorrect, true);
  assert.equal(question.prototypeOnly, false);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.questionStudioVisible, false);
  assert.equal(question.questionBankEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.metadata.approvedBy, "PROJECT_OWNER");
  assert.equal(question.metadata.ownerDirective, "APPROVED_CONTINUE");
  assert.equal(question.metadata.completeModelEnumeration, true);
  assert.equal(question.metadata.independentVerifierAgreed, true);
  assert.equal(question.metadata.uniqueAnswer, true);
  assert.equal(question.metadata.optionSemanticsUnique, true);
  for (const tree of question.explanation.familyTrees) {
    assert.equal(tree.kind, "blood-relation-family-tree");
    assert.ok(tree.nodes.length >= 2);
    assert.ok(tree.asciiFallback.includes("Assignment:"));
  }
}

const qlIds: readonly BlrCp005QlId[] = [
  "BLR-QL-018", "BLR-QL-019", "BLR-QL-020", "BLR-QL-021",
  "BLR-QL-022", "BLR-QL-023", "BLR-QL-024", "BLR-QL-025",
];
for (const qlId of qlIds) {
  for (const seed of [0, 1, 2, 17, 89, 377, -11]) {
    const first = generateBlrCp005Question(qlId, seed);
    const second = generateBlrCp005Question(qlId, seed);
    assert.deepEqual(first, second);
    assert.equal(first.qlId, qlId);
  }
}

for (const seed of [0, 1, 17, 63, 79, -3]) {
  const first = generateBlrCp005QuestionGroup(seed);
  const second = generateBlrCp005QuestionGroup(seed);
  assert.deepEqual(first, second);
  assert.ok(first.questions.length >= 1);
  assert.ok(first.questions.every((question) => question.groupKey === first.groupId));
  assert.ok(first.questions.every((question) => question.sharedPrompt === first.sharedPrompt));
  assert.ok(first.questions.every((question) => question.modelSpace.modelCount === first.modelCount));
  assert.equal(first.familyTrees.length, first.modelCount);
  assert.equal(first.metadata.sharedModelSpaceSolvedOnce, true);
  assert.equal(first.metadata.completeModelEnumeration, true);
}

console.log(JSON.stringify({
  runtimeVersion: BLR_CP005_RUNTIME_VERSION,
  freezeVersion: BLR_CP005_FREEZE_VERSION,
  ...telemetry,
  independentlyVerifiedQuestions: bank.length,
  verdict: "BLR-CP-005 DETERMINACY, POSSIBILITY AND UNCERTAINTY ARE DISCOVERY-FROZEN WITH EIGHT PERMANENT REVIEW-ONLY QLS",
}, null, 2));
