import { strict as assert } from "node:assert";
import {
  BLR_CP007_ENGLISH_FREEZE_REVIEW_NOTE,
  generateBlrCp007EnglishFreezeDecisionCandidateBank,
  learnerCorpusIsUnchanged,
} from "./cp007-english-freeze-decision-candidate";

const bank = generateBlrCp007EnglishFreezeDecisionCandidateBank();
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
assert.equal(learnerCorpusIsUnchanged(), true, "manual freeze preparation must not alter learner-facing content");
assert.equal(new Set(bank.map((question) => question.itemId)).size, 168);
assert.equal(new Set(bank.map((question) => question.metadata.v4EditorialFingerprint)).size, 168);
assert.equal(new Set(Object.keys(targetRelationCounts)).size, 27);

for (const [left, right] of counterpartPairs) {
  assert.equal(
    targetRelationCounts[left],
    targetRelationCounts[right],
    `${left}/${right} target coverage must remain balanced`,
  );
}

for (const question of bank) {
  assert.equal(question.reviewProof.reviewerNote, BLR_CP007_ENGLISH_FREEZE_REVIEW_NOTE);
  assert(!/remains held|approval remains pending|remediation candidate/i.test(question.reviewProof.reviewerNote));
  assert.deepEqual(question.metadata.activeEditorialBlockers, ["ENGLISH_FREEZE_PENDING"]);
  assert.deepEqual(question.v4ReviewProof.activeEditorialBlockers, ["ENGLISH_FREEZE_PENDING"]);
  assert.equal(question.v4ReviewProof.humanReviewRequired, true);
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
  staleReviewNoteCount: bank.filter((question) => /remains held|approval remains pending|remediation candidate/i.test(question.reviewProof.reviewerNote)).length,
  learnerCorpusChanged: !learnerCorpusIsUnchanged(),
  englishFreezePendingCount: bank.filter((question) => question.metadata.activeEditorialBlockers.includes("ENGLISH_FREEZE_PENDING")).length,
  productDeliveryEnabledCount: bank.filter((question) => question.publiclyPublishable || question.questionStudioVisible || question.questionBankEligible || question.mockTestEligible).length,
  verdict: "BLR_CP007_MANUAL_ENGLISH_FREEZE_DECISION_READY",
}, null, 2));
