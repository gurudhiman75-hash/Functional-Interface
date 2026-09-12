import assert from "node:assert/strict";
import { generateIntCp007LocalizedReviewQuestion as generateV5 } from "./cp007-scheme-equivalence-localized-v5";
import {
  INT_CP007_LOCALIZED_APPROVED_REVIEW_ARTIFACT,
  INT_CP007_LOCALIZED_APPROVED_REVIEW_DIGEST,
  INT_CP007_LOCALIZED_APPROVED_REVIEW_HEAD,
  INT_CP007_LOCALIZED_APPROVED_REVIEW_RUN,
  INT_CP007_LOCALIZED_APPROVED_REVIEW_VERSION,
  INT_CP007_LOCALIZED_FREEZE_APPROVAL,
  INT_CP007_LOCALIZED_FREEZE_ID,
  generateIntCp007LocalizedFrozenQuestion,
} from "./cp007-scheme-equivalence-localized-v5-frozen";
import { INT_CP007_QL_IDS } from "./cp007-scheme-equivalence-runtime-v3-final";

const LOCALES = Object.freeze(["hi-IN", "pa-IN"] as const);
const BANNED_CI_DEFINITION = Object.freeze([
  "ब्याज हर वर्ष मूलधन में जुड़ता है",
  "ਵਿਆਜ ਹਰ ਸਾਲ ਮੂਲ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ",
]);

function stableJson(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}

function learnerPayload(q: any): unknown {
  return {
    id: q.id,
    runtimeVersion: q.runtimeVersion,
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
    sourceEnglishFreezeApproval: q.sourceEnglishFreezeApproval,
    permanentIdentityFrozen: q.permanentIdentityFrozen,
  };
}

function learnerText(q: any): string {
  return [
    q.presentation.markdown,
    q.presentation.prompt,
    ...q.options.map((option: any) => option.text),
    q.explanation.keyIdea,
    ...q.explanation.steps,
    q.explanation.finalAnswer,
    q.explanation.commonMistake,
  ].join("\n");
}

assert.equal(INT_CP007_LOCALIZED_APPROVED_REVIEW_VERSION, "INT-CP-007-HI-PA-v5-clean-ci-terminology-review");
assert.equal(INT_CP007_LOCALIZED_APPROVED_REVIEW_HEAD, "8d544bccc5aa1626ba3fb9408140b3491c41bb02");
assert.equal(INT_CP007_LOCALIZED_APPROVED_REVIEW_RUN, 32276219492);
assert.equal(INT_CP007_LOCALIZED_APPROVED_REVIEW_ARTIFACT, 9374241368);
assert.equal(INT_CP007_LOCALIZED_APPROVED_REVIEW_DIGEST, "sha256:712f6c7fda1c2d9707fd90b59221c0c9ff2f110ca7999b4396da4ced057da44b");
assert.equal(INT_CP007_LOCALIZED_FREEZE_APPROVAL, "PRODUCT_OWNER_APPROVED_CP007_HI_PA_V5_2026_08_20");
assert.equal(INT_CP007_LOCALIZED_FREEZE_ID, "INT-CP-007-HI-PA-v5-frozen");

let questions = 0;
let deterministicChecks = 0;
let payloadIdentityChecks = 0;
let terminologyChecks = 0;
let lifecycleChecks = 0;
let deepFreezeChecks = 0;

for (const qlId of INT_CP007_QL_IDS) {
  for (let i = 0; i < 200; i += 1) {
    const seed = `int-cp007-localized-v5-freeze-${qlId}-${i}`;
    for (const locale of LOCALES) {
      const review = generateV5(qlId, seed, locale) as any;
      const frozen = generateIntCp007LocalizedFrozenQuestion(qlId, seed, locale) as any;
      const replay = generateIntCp007LocalizedFrozenQuestion(qlId, seed, locale) as any;

      assert.equal(stableJson(frozen), stableJson(replay), `${qlId}/${seed}/${locale}: nondeterministic frozen replay`);
      deterministicChecks++;
      assert.equal(stableJson(learnerPayload(frozen)), stableJson(learnerPayload(review)), `${qlId}/${seed}/${locale}: learner payload changed at freeze`);
      payloadIdentityChecks++;

      const text = learnerText(frozen);
      for (const phrase of BANNED_CI_DEFINITION) {
        assert.ok(!text.includes(phrase), `${qlId}/${seed}/${locale}: removed CI definition clause returned`);
        terminologyChecks++;
      }
      if (locale === "pa-IN") {
        assert.ok(!text.includes("ਚੱਕਰਵੱਧੀ"), `${qlId}/${seed}: deprecated Punjabi CI term returned`);
        assert.ok(text.includes("ਮਿਸ਼ਰਤ ਵਿਆਜ") || !text.includes("ਵਿਆਜ"), `${qlId}/${seed}: Punjabi CI terminology drift`);
        terminologyChecks += 2;
      }

      assert.equal(review.learnerContentFrozen, false);
      assert.equal(frozen.learnerContentFrozen, true);
      assert.equal(frozen.localizedVersion, INT_CP007_LOCALIZED_FREEZE_ID);
      assert.equal(frozen.approvalStatus, INT_CP007_LOCALIZED_FREEZE_APPROVAL);
      assert.equal(frozen.editorialStatus, "MULTILINGUAL_FROZEN");
      assert.equal(frozen.allocationStatus, "INACTIVE_MULTILINGUAL_FROZEN");
      assert.equal(frozen.permanentIdentityFrozen, true);
      assert.equal(frozen.enabled, false);
      assert.equal(frozen.stagingStatus, "NOT_STAGED");
      assert.equal(frozen.registrationStatus, "NOT_REGISTERED");
      assert.equal(frozen.questionStudioDiscoverable, false);
      assert.equal(frozen.questionBankStatus, "NOT_STORED");
      assert.equal(frozen.testEligibility, "INELIGIBLE");
      assert.equal(frozen.publiclyPublishable, false);
      lifecycleChecks += 13;

      assert.ok(Object.isFrozen(frozen));
      assert.ok(Object.isFrozen(frozen.presentation));
      assert.ok(Object.isFrozen(frozen.options));
      assert.ok(Object.isFrozen(frozen.explanation));
      assert.ok(Object.isFrozen(frozen.explanation.steps));
      deepFreezeChecks += 5;
      questions++;
    }
  }
}

console.log(JSON.stringify({
  freezeId: INT_CP007_LOCALIZED_FREEZE_ID,
  approvalAuthority: INT_CP007_LOCALIZED_FREEZE_APPROVAL,
  approvedReviewVersion: INT_CP007_LOCALIZED_APPROVED_REVIEW_VERSION,
  approvedReviewHead: INT_CP007_LOCALIZED_APPROVED_REVIEW_HEAD,
  approvedReviewRun: INT_CP007_LOCALIZED_APPROVED_REVIEW_RUN,
  approvedReviewArtifact: INT_CP007_LOCALIZED_APPROVED_REVIEW_ARTIFACT,
  approvedReviewDigest: INT_CP007_LOCALIZED_APPROVED_REVIEW_DIGEST,
  qls: INT_CP007_QL_IDS.length,
  locales: LOCALES,
  questions,
  deterministicChecks,
  payloadIdentityChecks,
  terminologyChecks,
  lifecycleChecks,
  deepFreezeChecks,
  permanentIdentityFrozen: true,
  learnerContentFrozen: true,
  learnerDeliveryAuthorized: false,
}, null, 2));
console.log("PASS_INT_CP007_LOCALIZED_V5_FREEZE_AUDIT");
