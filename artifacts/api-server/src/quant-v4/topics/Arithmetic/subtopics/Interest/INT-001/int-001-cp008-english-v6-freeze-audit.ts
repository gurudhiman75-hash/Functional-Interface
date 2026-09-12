import assert from "node:assert/strict";
import {
  generateIntCp008EnglishQuestion as generateApproved,
} from "./cp008-instalment-english-v6";
import {
  INT_CP008_ENGLISH_FREEZE_APPROVAL,
  INT_CP008_ENGLISH_FREEZE_ID,
  generateIntCp008EnglishFrozenQuestion as generateFrozen,
} from "./cp008-instalment-english-v6-frozen";
import { INT_CP008_QL_IDS } from "./cp008-instalment-runtime-v1-final";

function stableJson(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}

function learnerPayload(question: ReturnType<typeof generateApproved> | ReturnType<typeof generateFrozen>): unknown {
  const source = question as any;
  return {
    id: source.id,
    runtimeVersion: source.runtimeVersion,
    englishVersion: source.englishVersion,
    checkpointId: source.checkpointId,
    qlId: source.qlId,
    locale: source.locale,
    seed: source.seed,
    mathematicalState: source.mathematicalState,
    answerSemantic: source.answerSemantic,
    presentation: source.presentation,
    options: source.options,
    correctIndex: source.correctIndex,
    correctAnswer: source.correctAnswer,
    explanation: source.explanation,
    mathematicalFingerprint: source.mathematicalFingerprint,
  };
}

let questions = 0;
let learnerIdentityChecks = 0;
let deterministicChecks = 0;
let lifecycleChecks = 0;
let deepFreezeChecks = 0;
let approvalEvidenceChecks = 0;
let qlIdentityChecks = 0;

for (const qlId of INT_CP008_QL_IDS) {
  for (let index = 0; index < 200; index += 1) {
    const seed = `int-cp008-en-v6-freeze:${qlId}:${index}`;
    const approved = generateApproved(qlId, seed);
    const frozen = generateFrozen(qlId, seed);
    const replay = generateFrozen(qlId, seed);

    assert.equal(frozen.qlId, qlId, `${qlId}/${seed}: QL identity drift`);
    qlIdentityChecks += 1;

    assert.equal(
      stableJson(learnerPayload(frozen)),
      stableJson(learnerPayload(approved)),
      `${qlId}/${seed}: frozen learner payload drifted from approved English V6`,
    );
    learnerIdentityChecks += 1;

    assert.equal(stableJson(replay), stableJson(frozen), `${qlId}/${seed}: frozen replay is not deterministic`);
    deterministicChecks += 1;

    assert.equal(frozen.freezeId, INT_CP008_ENGLISH_FREEZE_ID);
    assert.equal(frozen.freezeApproval.authority, "PRODUCT_OWNER_APPROVED_CP008_ENGLISH_V6_2026_08_20");
    assert.equal(frozen.freezeApproval.approvedEnglishVersion, "INT-CP-008-EN-v6-final-review-candidate");
    assert.equal(frozen.freezeApproval.approvedReviewHead, "eeb6020c3605785f8d10d98650f5b0735f660835");
    assert.equal(frozen.freezeApproval.reviewWorkflowRun, 32339889054);
    assert.equal(frozen.freezeApproval.reviewWorkflowJob, 96336688857);
    assert.equal(frozen.freezeApproval.reviewArtifactId, 9395993328);
    assert.equal(frozen.freezeApproval.reviewArtifactDigest, "sha256:47febf3024cf0e9f450460c2e62ea6d249661b3e1af8ef0ec808f1310f7d4cba");
    assert.equal(frozen.freezeApproval.questionStudioActivationAuthorized, false);
    assert.equal(frozen.freezeApproval.registrationAuthorized, false);
    assert.equal(frozen.freezeApproval.questionBankStorageAuthorized, false);
    assert.equal(frozen.freezeApproval.testDeliveryAuthorized, false);
    assert.equal(frozen.freezeApproval.publicDeliveryAuthorized, false);
    assert.equal(frozen.freezeApproval.mergeAuthorized, false);
    approvalEvidenceChecks += 14;

    assert.equal(frozen.editorialStatus, "ENGLISH_FROZEN");
    assert.equal(frozen.approvalStatus, "APPROVED_ENGLISH_FROZEN");
    assert.equal(frozen.allocationStatus, "INACTIVE_ENGLISH_FROZEN");
    assert.equal(frozen.permanentIdentityFrozen, true);
    assert.equal(frozen.learnerContentFrozen, true);

    assert.equal(frozen.enabled, false);
    assert.equal(frozen.stagingStatus, "NOT_STAGED");
    assert.equal(frozen.registrationStatus, "NOT_REGISTERED");
    assert.equal(frozen.questionStudioDiscoverable, false);
    assert.equal(frozen.questionBankStatus, "NOT_STORED");
    assert.equal(frozen.questionBankWritable, false);
    assert.equal(frozen.testEligibility, "INELIGIBLE");
    assert.equal(frozen.publiclyPublishable, false);
    lifecycleChecks += 13;

    assert.ok(Object.isFrozen(frozen));
    assert.ok(Object.isFrozen(frozen.presentation));
    assert.ok(Object.isFrozen(frozen.options));
    assert.ok(Object.isFrozen(frozen.explanation));
    assert.ok(Object.isFrozen(frozen.explanation.steps));
    assert.ok(Object.isFrozen(frozen.freezeApproval));
    deepFreezeChecks += 6;
    questions += 1;
  }
}

assert.deepEqual(INT_CP008_QL_IDS, [
  "INT-QL-116",
  "INT-QL-117",
  "INT-QL-118",
  "INT-QL-119",
  "INT-QL-120",
  "INT-QL-121",
  "INT-QL-122",
  "INT-QL-123",
  "INT-QL-124",
]);
assert.equal(INT_CP008_ENGLISH_FREEZE_APPROVAL.approvedReviewHead, "eeb6020c3605785f8d10d98650f5b0735f660835");
assert.equal(INT_CP008_ENGLISH_FREEZE_APPROVAL.reviewWorkflowRun, 32339889054);
assert.equal(INT_CP008_ENGLISH_FREEZE_APPROVAL.reviewWorkflowJob, 96336688857);
assert.equal(INT_CP008_ENGLISH_FREEZE_APPROVAL.reviewArtifactId, 9395993328);
assert.equal(INT_CP008_ENGLISH_FREEZE_APPROVAL.reviewArtifactDigest, "sha256:47febf3024cf0e9f450460c2e62ea6d249661b3e1af8ef0ec808f1310f7d4cba");
approvalEvidenceChecks += 5;

assert.equal(questions, 1800);
assert.equal(learnerIdentityChecks, 1800);
assert.equal(deterministicChecks, 1800);
assert.equal(qlIdentityChecks, 1800);

console.log(JSON.stringify({
  freezeId: INT_CP008_ENGLISH_FREEZE_ID,
  approvalAuthority: INT_CP008_ENGLISH_FREEZE_APPROVAL.authority,
  approvedReviewHead: INT_CP008_ENGLISH_FREEZE_APPROVAL.approvedReviewHead,
  reviewWorkflowRun: INT_CP008_ENGLISH_FREEZE_APPROVAL.reviewWorkflowRun,
  reviewWorkflowJob: INT_CP008_ENGLISH_FREEZE_APPROVAL.reviewWorkflowJob,
  reviewArtifactId: INT_CP008_ENGLISH_FREEZE_APPROVAL.reviewArtifactId,
  reviewArtifactDigest: INT_CP008_ENGLISH_FREEZE_APPROVAL.reviewArtifactDigest,
  qls: INT_CP008_QL_IDS.length,
  questions,
  learnerIdentityChecks,
  deterministicChecks,
  qlIdentityChecks,
  lifecycleChecks,
  deepFreezeChecks,
  approvalEvidenceChecks,
  permanentIdentityFrozen: true,
  learnerContentFrozen: true,
  learnerDeliveryAuthorized: false,
}, null, 2));
console.log("PASS_INT_CP008_ENGLISH_V6_FREEZE_AUDIT");
