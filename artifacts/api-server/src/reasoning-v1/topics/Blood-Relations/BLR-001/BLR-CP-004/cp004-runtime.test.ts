import assert from "node:assert/strict";

import { buildBlrCp004Telemetry, generateBlrCp004FrozenBank } from "./cp004-bank";
import {
  BLR_CP004_FREEZE_VERSION,
  BLR_CP004_PERMANENT_CONTRACTS,
  BLR_CP004_RUNTIME_VERSION,
  type BlrCp004QlId,
} from "./cp004-model";
import {
  generateBlrCp004Question,
  generateBlrCp004QuestionGroup,
} from "./cp004-runtime";
import { verifyBlrCp004Question } from "./cp004-verifier";

const bank = generateBlrCp004FrozenBank();
const telemetry = buildBlrCp004Telemetry(bank);

assert.equal(BLR_CP004_RUNTIME_VERSION, "blr-cp004-permanent-runtime-v1");
assert.equal(BLR_CP004_FREEZE_VERSION, "BLR_CP004_ENGLISH_DISCOVERY_FREEZE_V1");
assert.equal(bank.length, 612);
assert.equal(telemetry.recordCount, 612);
assert.equal(telemetry.groupCount, 102);
assert.equal(telemetry.topologyCount, 9);
assert.equal(telemetry.prototypeCount, 13);
assert.equal(telemetry.authorityCount, 5);
assert.equal(telemetry.permanentQlCount, 5);
assert.equal(telemetry.uniqueQuestionSignatureCount, 612);
assert.equal(telemetry.questionSignatureUniquenessRatio, 1);
assert.equal(telemetry.nextAvailableChapterQlId, "BLR-QL-018");
assert.ok(telemetry.answerPositions.every((count) => count > 100));
assert.ok(Object.keys(telemetry.difficultyCounts).length >= 2);
assert.ok(telemetry.zeroAnswerCount > 0);

assert.deepEqual(
  BLR_CP004_PERMANENT_CONTRACTS.map((contract) => contract.qlId),
  ["BLR-QL-013", "BLR-QL-014", "BLR-QL-015", "BLR-QL-016", "BLR-QL-017"],
);
assert.deepEqual(
  BLR_CP004_PERMANENT_CONTRACTS.map((contract) => contract.solveAuthority),
  [
    "COUNT_MEMBERS_BY_FILTER",
    "COUNT_RELATIVES_OF_REFERENCE",
    "COUNT_RELATION_PAIRS",
    "COUNT_GENERATIONS",
    "SELECT_FAMILY_COMPOSITION_PROFILE",
  ],
);

for (const contract of BLR_CP004_PERMANENT_CONTRACTS) {
  assert.equal(contract.status, "ENGLISH_DISCOVERY_FROZEN");
  assert.equal(contract.reviewOnly, true);
  assert.equal(contract.publiclyPublishable, false);
  assert.equal(contract.questionStudioVisible, false);
  assert.equal(contract.questionBankEligible, false);
  assert.equal(contract.mockTestEligible, false);
  for (const prototypeId of contract.sourcePrototypeIds) {
    assert.ok((telemetry.prototypeCounts[prototypeId] ?? 0) > 0, `Missing ${prototypeId}.`);
  }
}

for (const question of bank) {
  const independent = verifyBlrCp004Question(question);
  if (question.answer.kind === "NUMBER") {
    assert.equal(independent.value, question.answer.value, question.itemId);
    assert.deepEqual(
      [...independent.memberIds].sort(),
      [...question.answer.countedMemberIds].sort(),
      question.itemId,
    );
    assert.deepEqual(
      [...independent.pairKeys].sort(),
      [...question.answer.countedPairKeys].sort(),
      question.itemId,
    );
  } else {
    assert.deepEqual(independent.value, question.answer.value, question.itemId);
  }
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
  assert.equal(question.metadata.ownerDirective, "APPROVED_CONTINUE_AND_FINISH_NEXT_CP");
  assert.equal(question.metadata.structuralSaturationApproved, true);
  assert.equal(question.metadata.finalDiscoveryFreezeApproved, true);
  assert.equal(question.metadata.independentVerifierAgreed, true);
}

const qlIds: readonly BlrCp004QlId[] = [
  "BLR-QL-013",
  "BLR-QL-014",
  "BLR-QL-015",
  "BLR-QL-016",
  "BLR-QL-017",
];
for (const qlId of qlIds) {
  for (const seed of [0, 1, 2, 17, 89, 377, -11]) {
    const first = generateBlrCp004Question(qlId, seed);
    const second = generateBlrCp004Question(qlId, seed);
    assert.deepEqual(first, second);
    assert.equal(first.qlId, qlId);
  }
}

for (const seed of [0, 1, 17, 63, 101, -3]) {
  const group = generateBlrCp004QuestionGroup(seed);
  assert.equal(group.questions.length, 6);
  assert.equal(group.permanentQlIds.length, 5);
  assert.equal(group.metadata.sharedPromptSolvedOnce, true);
  assert.equal(group.metadata.finalDiscoveryFreezeApproved, true);
  assert.ok(group.questions.every((question) => question.sharedPrompt === group.sharedPrompt));
}

console.log(
  JSON.stringify(
    {
      runtimeVersion: BLR_CP004_RUNTIME_VERSION,
      freezeVersion: BLR_CP004_FREEZE_VERSION,
      ...telemetry,
      permanentQlRange: "BLR-QL-013..BLR-QL-017",
      independentlyVerifiedQuestions: bank.length,
      verdict:
        "BLR-CP-004 COUNTS AND FAMILY COMPOSITION ARE DISCOVERY-FROZEN WITH FIVE PERMANENT REVIEW-ONLY QLS",
    },
    null,
    2,
  ),
);
