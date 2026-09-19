import { strict as assert } from "node:assert";
import { BLR_001_MULTILINGUAL_APPROVAL_RECEIPT } from "./multilingual-freeze-approval";
import { buildBlr001MultilingualReviewCorpora } from "./multilingual-human-review-pack";
import {
  BLR_001_MULTILINGUAL_FREEZE_AUTHORITIES,
  buildBlr001ApprovedMultilingualFrozenBundle,
  freezeBlr001ApprovedMultilingualRecord,
} from "./multilingual-frozen-runtime";

const source = buildBlr001MultilingualReviewCorpora();
const frozen = buildBlr001ApprovedMultilingualFrozenBundle();
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

let count = 0;
for (const [before, after] of pairs) {
  assert.equal(after.length, before.length);
  for (let i = 0; i < before.length; i += 1) {
    const a:any = before[i];
    const b:any = after[i];
    assert.equal(b.stem, a.stem);
    assert.equal(b.sharedPrompt ?? "", a.sharedPrompt ?? "");
    assert.deepEqual(b.options, a.options);
    assert.equal(b.correctIndex, a.correctIndex);
    assert.equal(b.reviewOnly, true);
    assert.equal(b.questionBankEligible, false);
    assert.equal(b.mockTestEligible, false);
    assert.equal(b.publiclyPublishable, false);
    assert.equal(b.metadata.humanLanguageReviewRequired, false);
    assert.deepEqual(b.metadata.activeEditorialBlockers, []);
    assert.equal(b.metadata.productDeliveryUnlocked, false);
    assert.equal(b.metadata.productionStagingApproved, false);
    assert.equal(b.multilingualFreezeProof.learnerCorpusChanged, false);
    assert.equal(b.multilingualFreezeProof.semanticParityPreserved, true);
    count += 1;
  }
}

const cp001 = freezeBlr001ApprovedMultilingualRecord(source.cp001.hindi[0] as any);
assert.equal(cp001.metadata.localizationAuthority, BLR_001_MULTILINGUAL_FREEZE_AUTHORITIES["BLR-CP-001"]);
const cp006 = freezeBlr001ApprovedMultilingualRecord(source.cp006.hindi[0] as any);
assert.equal(cp006.metadata.editorialAuthority, BLR_001_MULTILINGUAL_FREEZE_AUTHORITIES["BLR-CP-006"]);
assert.equal(cp006.metadata.editorialStatus, "TRILINGUAL_FROZEN");
assert.equal(cp006.multilingualFreezeProof.reviewArtifactDigest, BLR_001_MULTILINGUAL_APPROVAL_RECEIPT.reviewArtifactDigest);

console.log(JSON.stringify({
  verdict: "BLR_001_MULTILINGUAL_FROZEN_RUNTIME_PROVED",
  frozenRecordCount: count,
  learnerCorpusChanged: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
