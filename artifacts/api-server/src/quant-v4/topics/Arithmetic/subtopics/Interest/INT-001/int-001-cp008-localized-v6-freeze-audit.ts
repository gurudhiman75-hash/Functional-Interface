import assert from "node:assert/strict";
import {
  generateIntCp008LocalizedReviewQuestion as generateApprovedV6,
} from "./cp008-instalment-localized-v6";
import {
  INT_CP008_LOCALIZED_APPROVED_REVIEW_ARTIFACT,
  INT_CP008_LOCALIZED_APPROVED_REVIEW_DIGEST,
  INT_CP008_LOCALIZED_APPROVED_REVIEW_HEAD,
  INT_CP008_LOCALIZED_APPROVED_REVIEW_JOB,
  INT_CP008_LOCALIZED_APPROVED_REVIEW_RUN,
  INT_CP008_LOCALIZED_APPROVED_REVIEW_VERSION,
  INT_CP008_LOCALIZED_FREEZE_AUTHORITY,
  INT_CP008_LOCALIZED_FREEZE_ID,
  INT_CP008_LOCALIZED_FREEZE_LIFECYCLE,
  generateIntCp008LocalizedFrozenQuestion as generateFrozen,
  type IntCp008LocalizedLocale,
} from "./cp008-instalment-localized-v6-frozen";
import { INT_CP008_QL_IDS } from "./cp008-instalment-runtime-v1-final";

const LOCALES = Object.freeze(["hi-IN", "pa-IN"] as const satisfies readonly IntCp008LocalizedLocale[]);

function stableJson(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}

function protectedLearnerPayload(q: any): unknown {
  return {
    id: q.id,
    runtimeVersion: q.runtimeVersion,
    englishVersion: q.englishVersion,
    checkpointId: q.checkpointId,
    qlId: q.qlId,
    locale: q.locale,
    seed: q.seed,
    mathematicalState: q.mathematicalState,
    answerSemantic: q.answerSemantic,
    presentation: q.presentation,
    options: q.options,
    correctIndex: q.correctIndex,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    sourceEnglishFreezeId: q.sourceEnglishFreezeId,
    sourceEnglishContentFrozen: q.sourceEnglishContentFrozen,
    permanentIdentityFrozen: q.permanentIdentityFrozen,
  };
}

assert.equal(INT_CP008_LOCALIZED_FREEZE_ID, "INT-CP-008-HI-PA-v6-frozen");
assert.equal(INT_CP008_LOCALIZED_FREEZE_AUTHORITY, "PRODUCT_OWNER_CONTINUE_INSTRUCTION_CP008_HI_PA_V6_2026_08_23");
assert.equal(INT_CP008_LOCALIZED_APPROVED_REVIEW_VERSION, "INT-CP-008-HI-PA-v6-final-language-review");
assert.equal(INT_CP008_LOCALIZED_APPROVED_REVIEW_HEAD, "dfc509819d696e1567b195e1dcdbb07ecfa34c89");
assert.equal(INT_CP008_LOCALIZED_APPROVED_REVIEW_RUN, 32356478704);
assert.equal(INT_CP008_LOCALIZED_APPROVED_REVIEW_JOB, 96386645819);
assert.equal(INT_CP008_LOCALIZED_APPROVED_REVIEW_ARTIFACT, 9401846686);
assert.equal(INT_CP008_LOCALIZED_APPROVED_REVIEW_DIGEST, "sha256:cf97694b3411f1b3af07c10fbc2990262926d6075ee80f0b00590639ff7e0152");
assert.deepEqual(INT_CP008_LOCALIZED_FREEZE_LIFECYCLE, {
  questionStudioActivationAuthorized: false,
  registrationAuthorized: false,
  questionBankStorageAuthorized: false,
  testDeliveryAuthorized: false,
  publicDeliveryAuthorized: false,
  mergeAuthorized: false,
});

let questions = 0;
let deterministicChecks = 0;
let learnerIdentityChecks = 0;
let approvalEvidenceChecks = 0;
let lifecycleChecks = 0;
let deepFreezeChecks = 0;
let qlIdentityChecks = 0;

for (const qlId of INT_CP008_QL_IDS) {
  for (let index = 0; index < 200; index += 1) {
    const seed = `int-cp008-hi-pa-v6-freeze:${qlId}:${index}`;
    for (const locale of LOCALES) {
      const approved = generateApprovedV6(qlId, seed, locale) as any;
      const frozen = generateFrozen(qlId, seed, locale) as any;
      const replay = generateFrozen(qlId, seed, locale) as any;

      assert.equal(frozen.qlId, qlId, `${qlId}/${seed}/${locale}: QL identity drift`);
      qlIdentityChecks += 1;

      assert.equal(
        stableJson(protectedLearnerPayload(frozen)),
        stableJson(protectedLearnerPayload(approved)),
        `${qlId}/${seed}/${locale}: learner payload changed at multilingual freeze`,
      );
      learnerIdentityChecks += 1;

      assert.equal(stableJson(replay), stableJson(frozen), `${qlId}/${seed}/${locale}: frozen replay is not deterministic`);
      deterministicChecks += 1;

      assert.equal(frozen.freezeAuthority, INT_CP008_LOCALIZED_FREEZE_AUTHORITY);
      assert.equal(frozen.approvedReviewVersion, INT_CP008_LOCALIZED_APPROVED_REVIEW_VERSION);
      assert.equal(frozen.approvedReviewHead, INT_CP008_LOCALIZED_APPROVED_REVIEW_HEAD);
      assert.equal(frozen.approvedReviewRun, INT_CP008_LOCALIZED_APPROVED_REVIEW_RUN);
      assert.equal(frozen.approvedReviewJob, INT_CP008_LOCALIZED_APPROVED_REVIEW_JOB);
      assert.equal(frozen.approvedReviewArtifact, INT_CP008_LOCALIZED_APPROVED_REVIEW_ARTIFACT);
      assert.equal(frozen.approvedReviewDigest, INT_CP008_LOCALIZED_APPROVED_REVIEW_DIGEST);
      assert.equal(frozen.freezeLifecycle.questionStudioActivationAuthorized, false);
      assert.equal(frozen.freezeLifecycle.registrationAuthorized, false);
      assert.equal(frozen.freezeLifecycle.questionBankStorageAuthorized, false);
      assert.equal(frozen.freezeLifecycle.testDeliveryAuthorized, false);
      assert.equal(frozen.freezeLifecycle.publicDeliveryAuthorized, false);
      assert.equal(frozen.freezeLifecycle.mergeAuthorized, false);
      approvalEvidenceChecks += 13;

      assert.equal(approved.learnerContentFrozen, false);
      assert.equal(frozen.localizedVersion, INT_CP008_LOCALIZED_FREEZE_ID);
      assert.equal(frozen.editorialStatus, "MULTILINGUAL_FROZEN");
      assert.equal(frozen.approvalStatus, "APPROVED_MULTILINGUAL_FROZEN");
      assert.equal(frozen.allocationStatus, "INACTIVE_MULTILINGUAL_FROZEN");
      assert.equal(frozen.permanentIdentityFrozen, true);
      assert.equal(frozen.sourceEnglishContentFrozen, true);
      assert.equal(frozen.learnerContentFrozen, true);
      assert.equal(frozen.enabled, false);
      assert.equal(frozen.stagingStatus, "NOT_STAGED");
      assert.equal(frozen.registrationStatus, "NOT_REGISTERED");
      assert.equal(frozen.questionStudioDiscoverable, false);
      assert.equal(frozen.questionBankStatus, "NOT_STORED");
      assert.equal(frozen.questionBankWritable, false);
      assert.equal(frozen.testEligibility, "INELIGIBLE");
      assert.equal(frozen.publiclyPublishable, false);
      lifecycleChecks += 15;

      assert.ok(Object.isFrozen(frozen));
      assert.ok(Object.isFrozen(frozen.presentation));
      assert.ok(Object.isFrozen(frozen.options));
      assert.ok(Object.isFrozen(frozen.explanation));
      assert.ok(Object.isFrozen(frozen.explanation.steps));
      assert.ok(Object.isFrozen(frozen.freezeLifecycle));
      deepFreezeChecks += 6;

      questions += 1;
    }
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
assert.equal(questions, 3600);
assert.equal(deterministicChecks, 3600);
assert.equal(learnerIdentityChecks, 3600);
assert.equal(qlIdentityChecks, 3600);

console.log(JSON.stringify({
  freezeId: INT_CP008_LOCALIZED_FREEZE_ID,
  freezeAuthority: INT_CP008_LOCALIZED_FREEZE_AUTHORITY,
  approvedReviewVersion: INT_CP008_LOCALIZED_APPROVED_REVIEW_VERSION,
  approvedReviewHead: INT_CP008_LOCALIZED_APPROVED_REVIEW_HEAD,
  approvedReviewRun: INT_CP008_LOCALIZED_APPROVED_REVIEW_RUN,
  approvedReviewJob: INT_CP008_LOCALIZED_APPROVED_REVIEW_JOB,
  approvedReviewArtifact: INT_CP008_LOCALIZED_APPROVED_REVIEW_ARTIFACT,
  approvedReviewDigest: INT_CP008_LOCALIZED_APPROVED_REVIEW_DIGEST,
  qls: INT_CP008_QL_IDS.length,
  locales: LOCALES,
  questions,
  deterministicChecks,
  learnerIdentityChecks,
  qlIdentityChecks,
  approvalEvidenceChecks,
  lifecycleChecks,
  deepFreezeChecks,
  permanentIdentityFrozen: true,
  sourceEnglishContentFrozen: true,
  learnerContentFrozen: true,
  learnerDeliveryAuthorized: false,
}, null, 2));
console.log("PASS_INT_CP008_LOCALIZED_V6_FREEZE_AUDIT");
