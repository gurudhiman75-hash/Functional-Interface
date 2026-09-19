import { strict as assert } from "node:assert";

import {
  buildBlr001MultilingualReviewCorpora,
  BLR_001_MULTILINGUAL_REVIEW_PACK_VERSION,
} from "./multilingual-human-review-pack";
import { buildBlr001ApprovedMultilingualFrozenBundle } from "./multilingual-frozen-runtime";

const syntheticReceiptForGateTest = {
  reviewPackVersion: BLR_001_MULTILINGUAL_REVIEW_PACK_VERSION,
  reviewedPermanentQlRange: "BLR-QL-001..BLR-QL-030" as const,
  approvedBy: "PRODUCT_OWNER" as const,
  approvedAt: "2026-09-19",
  cp001ThroughCp005HindiPunjabiApproved: true as const,
  cp006EditorialV3TrilingualApproved: true as const,
};

assert.throws(
  () => buildBlr001ApprovedMultilingualFrozenBundle(undefined as any),
  /approval receipt missing|not approved/i,
);

const source = buildBlr001MultilingualReviewCorpora();
const frozen = buildBlr001ApprovedMultilingualFrozenBundle(
  syntheticReceiptForGateTest,
);

const pairs = [
  [source.cp001.hindi, frozen.cp001.hindi],
  [source.cp001.punjabi, frozen.cp001.punjabi],
  [source.cp002.hindi, frozen.cp002.hindi],
  [source.cp002.punjabi, frozen.cp002.punjabi],
  [source.cp003.hindi, frozen.cp003.hindi],
  [source.cp003.punjabi, frozen.cp003.punjabi],
  [source.cp004.hindi, frozen.cp004.hindi],
  [source.cp004.punjabi, frozen.cp004.punjabi],
  [source.cp005.hindi, frozen.cp005.hindi],
  [source.cp005.punjabi, frozen.cp005.punjabi],
  [source.cp006.english, frozen.cp006.english],
  [source.cp006.hindi, frozen.cp006.hindi],
  [source.cp006.punjabi, frozen.cp006.punjabi],
] as const;

let frozenCount = 0;
for (const [before, after] of pairs) {
  assert.equal(after.length, before.length);
  for (let index = 0; index < before.length; index += 1) {
    const sourceRecord = before[index] as any;
    const frozenRecord = after[index] as any;

    assert.equal(frozenRecord.qlId, sourceRecord.qlId);
    assert.equal(frozenRecord.correctIndex, sourceRecord.correctIndex);
    assert.deepEqual(frozenRecord.options, sourceRecord.options);
    assert.equal(frozenRecord.stem, sourceRecord.stem);
    assert.equal(frozenRecord.sharedPrompt ?? "", sourceRecord.sharedPrompt ?? "");
    assert.equal(frozenRecord.reviewOnly, true);
    assert.equal(frozenRecord.questionBankEligible, false);
    assert.equal(frozenRecord.mockTestEligible, false);
    assert.equal(frozenRecord.publiclyPublishable, false);
    assert.equal(frozenRecord.metadata.humanLanguageReviewRequired, false);
    assert.deepEqual(frozenRecord.metadata.activeEditorialBlockers, []);
    assert.equal(frozenRecord.metadata.productDeliveryUnlocked, false);
    assert.equal(frozenRecord.metadata.productionStagingApproved, false);
    assert.equal(frozenRecord.multilingualFreezeProof.semanticParityPreserved, true);
    assert.equal(frozenRecord.multilingualFreezeProof.questionBankWritable, false);
    assert.equal(frozenRecord.multilingualFreezeProof.testEligible, false);
    assert.equal(frozenRecord.multilingualFreezeProof.publiclyPublishable, false);
    frozenCount += 1;
  }
}

assert.equal(
  source.cp001.hindi[0]?.metadata.humanLanguageReviewRequired,
  true,
  "source review corpus must remain review-required",
);
assert.equal(
  source.cp006.english[0]?.metadata.humanLanguageReviewRequired,
  true,
  "CP006 V3 source candidate must remain review-required",
);

console.log(JSON.stringify({
  verdict: "BLR_001_MULTILINGUAL_FROZEN_RUNTIME_REQUIRES_APPROVAL",
  frozenCount,
  reviewPackVersion: BLR_001_MULTILINGUAL_REVIEW_PACK_VERSION,
  sourceCorpusUnchanged: true,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
