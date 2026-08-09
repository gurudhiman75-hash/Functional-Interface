import { strict as assert } from "node:assert";
import {
  BLR_CP007_ENGLISH_FREEZE_APPROVED_AT,
  BLR_CP007_ENGLISH_FREEZE_AUTHORITY,
  BLR_CP007_ENGLISH_FREEZE_REVIEW_NOTE,
  frozenLearnerCorpusIsUnchanged,
  generateBlrCp007EnglishFrozenBank,
} from "./cp007-english-frozen";

const bank = generateBlrCp007EnglishFrozenBank();
const qlCounts = Object.fromEntries(
  ["BLR-QL-031", "BLR-QL-032", "BLR-QL-033", "BLR-QL-034", "BLR-QL-035"].map((qlId) => [
    qlId,
    bank.filter((question) => question.qlId === qlId).length,
  ]),
);
const targetRelationCounts = bank.reduce<Record<string, number>>((counts, question) => {
  const relation = question.reviewProof.targetRelation;
  counts[relation] = (counts[relation] ?? 0) + 1;
  return counts;
}, {});
const counterpartPairs = [
  ["FATHER", "MOTHER"],
  ["SON", "DAUGHTER"],
  ["BROTHER", "SISTER"],
  ["HUSBAND", "WIFE"],
  ["GRANDFATHER", "GRANDMOTHER"],
  ["GRANDSON", "GRANDDAUGHTER"],
  ["UNCLE", "AUNT"],
  ["NEPHEW", "NIECE"],
  ["FATHER_IN_LAW", "MOTHER_IN_LAW"],
  ["SON_IN_LAW", "DAUGHTER_IN_LAW"],
  ["BROTHER_IN_LAW", "SISTER_IN_LAW"],
  ["PARENT", "CHILD"],
  ["GRANDPARENT", "GRANDCHILD"],
] as const;

assert.equal(bank.length, 168);
assert.deepEqual(qlCounts, {
  "BLR-QL-031": 48,
  "BLR-QL-032": 32,
  "BLR-QL-033": 24,
  "BLR-QL-034": 32,
  "BLR-QL-035": 32,
});
assert.equal(frozenLearnerCorpusIsUnchanged(), true, "English freeze must not alter learner-facing content");
assert.equal(new Set(bank.map((question) => question.itemId)).size, 168);
assert.equal(new Set(bank.map((question) => question.metadata.v4EditorialFingerprint)).size, 168);
assert.equal(Object.keys(targetRelationCounts).length, 27);

for (const [left, right] of counterpartPairs) {
  assert.equal(
    targetRelationCounts[left],
    targetRelationCounts[right],
    `${left}/${right} target coverage must remain balanced`,
  );
}

for (const question of bank) {
  assert.equal(question.reviewProof.reviewerNote, BLR_CP007_ENGLISH_FREEZE_REVIEW_NOTE);
  assert(!/pending|remains held|remediation candidate/i.test(question.reviewProof.reviewerNote));
  assert.deepEqual(question.metadata.activeEditorialBlockers, []);
  assert.deepEqual(question.v4ReviewProof.activeEditorialBlockers, []);
  assert.equal(question.metadata.englishFreezeStatus, BLR_CP007_ENGLISH_FREEZE_AUTHORITY);
  assert.equal(question.v4ReviewProof.humanReviewRequired, false);
  assert.deepEqual(question.englishFreezeProof, {
    authority: BLR_CP007_ENGLISH_FREEZE_AUTHORITY,
    approvedBy: "PRODUCT_OWNER",
    approvedAt: BLR_CP007_ENGLISH_FREEZE_APPROVED_AT,
    sourceAuthority: "BLR_CP007_ENGLISH_FREEZE_DECISION_CANDIDATE",
    learnerCorpusChanged: false,
    localisationUnlocked: true,
    productDeliveryUnlocked: false,
  });
  assert.equal(question.reviewOnly, true);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.questionStudioVisible, false);
  assert.equal(question.questionBankEligible, false);
  assert.equal(question.mockTestEligible, false);
}

console.log(JSON.stringify({
  recordCount: bank.length,
  qlCounts,
  targetRelationCount: Object.keys(targetRelationCounts).length,
  balancedCounterpartPairCount: counterpartPairs.length,
  learnerCorpusChanged: !frozenLearnerCorpusIsUnchanged(),
  englishFreezePendingCount: bank.filter((question) => question.metadata.activeEditorialBlockers.includes("ENGLISH_FREEZE_PENDING")).length,
  frozenCount: bank.filter((question) => question.metadata.englishFreezeStatus === BLR_CP007_ENGLISH_FREEZE_AUTHORITY).length,
  humanReviewRequiredCount: bank.filter((question) => question.v4ReviewProof.humanReviewRequired).length,
  localisationUnlockedCount: bank.filter((question) => question.englishFreezeProof.localisationUnlocked).length,
  productDeliveryEnabledCount: bank.filter((question) => question.publiclyPublishable || question.questionStudioVisible || question.questionBankEligible || question.mockTestEligible).length,
  verdict: "BLR_CP007_ENGLISH_FROZEN",
}, null, 2));
