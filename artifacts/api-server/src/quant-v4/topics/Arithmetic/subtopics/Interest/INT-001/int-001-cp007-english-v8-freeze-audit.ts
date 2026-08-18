import assert from "node:assert/strict";
import {
  generateIntCp007EnglishQuestion as generateApproved,
} from "./cp007-scheme-equivalence-english-v8";
import {
  INT_CP007_ENGLISH_FREEZE_APPROVAL,
  INT_CP007_ENGLISH_FREEZE_ID,
  generateIntCp007EnglishFrozenQuestion as generateFrozen,
} from "./cp007-scheme-equivalence-english-v8-frozen";
import { INT_CP007_QL_IDS } from "./cp007-scheme-equivalence-runtime-v3-final";

function stableJson(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}

function approvedPayload(question: ReturnType<typeof generateFrozen>): unknown {
  const source = question as any;
  const { freezeId: _freezeId, freezeApproval: _freezeApproval, editorialStatus: _editorialStatus,
    approvalStatus: _approvalStatus, allocationStatus: _allocationStatus,
    permanentIdentityFrozen: _permanentIdentityFrozen, learnerContentFrozen: _learnerContentFrozen,
    ...rest } = source;
  return rest;
}

let questions = 0;
let identityChecks = 0;
let deterministicChecks = 0;
let lifecycleChecks = 0;
let deepFreezeChecks = 0;
let approvalEvidenceChecks = 0;

for (const qlId of INT_CP007_QL_IDS) {
  for (let index = 0; index < 200; index += 1) {
    const seed = `int-cp007-en-v8-freeze-${qlId}-${index}`;
    const approved = generateApproved(qlId, seed);
    const frozen = generateFrozen(qlId, seed);
    const replay = generateFrozen(qlId, seed);

    assert.equal(stableJson(approvedPayload(frozen)), stableJson(approved), `${qlId}/${seed}: frozen learner payload drifted from approved V8`);
    identityChecks += 1;
    assert.equal(stableJson(replay), stableJson(frozen), `${qlId}/${seed}: frozen replay is not deterministic`);
    deterministicChecks += 1;

    assert.equal(frozen.freezeId, INT_CP007_ENGLISH_FREEZE_ID);
    assert.equal(frozen.freezeApproval.authority, "PRODUCT_OWNER_APPROVED_CP007_ENGLISH_V8_2026_08_19");
    assert.equal(frozen.freezeApproval.approvedReviewHead, "c657dad54e2c8ecc5f7c451247bbf5db7114dc96");
    assert.equal(frozen.freezeApproval.reviewWorkflowRun, 32165510413);
    assert.equal(frozen.freezeApproval.reviewWorkflowJob, 95804042994);
    assert.equal(frozen.freezeApproval.reviewArtifactId, 9335310867);
    assert.equal(frozen.freezeApproval.reviewArtifactDigest, "sha256:07985fc95a8d3a3a3f1fee43c559fbbe33fdd4033e47af6697e69ed00f7ffe97");
    approvalEvidenceChecks += 7;

    assert.equal(frozen.enabled, false);
    assert.equal(frozen.stagingStatus, "NOT_STAGED");
    assert.equal(frozen.registrationStatus, "NOT_REGISTERED");
    assert.equal(frozen.questionStudioDiscoverable, false);
    assert.equal(frozen.questionBankStatus, "NOT_STORED");
    assert.equal(frozen.testEligibility, "INELIGIBLE");
    assert.equal(frozen.publiclyPublishable, false);
    lifecycleChecks += 7;

    assert.equal(frozen.permanentIdentityFrozen, true);
    assert.equal(frozen.learnerContentFrozen, true);
    assert.ok(Object.isFrozen(frozen));
    assert.ok(Object.isFrozen(frozen.presentation));
    assert.ok(Object.isFrozen(frozen.options));
    assert.ok(Object.isFrozen(frozen.explanation));
    assert.ok(Object.isFrozen(frozen.explanation.steps));
    assert.ok(Object.isFrozen(frozen.freezeApproval));
    deepFreezeChecks += 8;
    questions += 1;
  }
}

assert.equal(INT_CP007_ENGLISH_FREEZE_APPROVAL.approvedReviewHead, "c657dad54e2c8ecc5f7c451247bbf5db7114dc96");
assert.equal(INT_CP007_ENGLISH_FREEZE_APPROVAL.reviewWorkflowRun, 32165510413);
assert.equal(INT_CP007_ENGLISH_FREEZE_APPROVAL.reviewArtifactId, 9335310867);
assert.equal(INT_CP007_ENGLISH_FREEZE_APPROVAL.reviewArtifactDigest, "sha256:07985fc95a8d3a3a3f1fee43c559fbbe33fdd4033e47af6697e69ed00f7ffe97");
approvalEvidenceChecks += 4;

console.log(JSON.stringify({
  freezeId: INT_CP007_ENGLISH_FREEZE_ID,
  approvalAuthority: INT_CP007_ENGLISH_FREEZE_APPROVAL.authority,
  approvedReviewHead: INT_CP007_ENGLISH_FREEZE_APPROVAL.approvedReviewHead,
  reviewWorkflowRun: INT_CP007_ENGLISH_FREEZE_APPROVAL.reviewWorkflowRun,
  reviewArtifactId: INT_CP007_ENGLISH_FREEZE_APPROVAL.reviewArtifactId,
  reviewArtifactDigest: INT_CP007_ENGLISH_FREEZE_APPROVAL.reviewArtifactDigest,
  qls: INT_CP007_QL_IDS.length,
  questions,
  identityChecks,
  deterministicChecks,
  lifecycleChecks,
  deepFreezeChecks,
  approvalEvidenceChecks,
  learnerContentFrozen: true,
  learnerDeliveryAuthorized: false,
}, null, 2));
console.log("PASS_INT_CP007_ENGLISH_V8_FREEZE_AUDIT");
