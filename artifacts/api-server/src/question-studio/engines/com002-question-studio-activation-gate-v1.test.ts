import assert from "node:assert/strict";

import { COM002_QUESTION_STUDIO_ACTIVATION_GATE_V1 as gate } from "./com002-question-studio-activation-gate-v1";

assert.equal(gate.status, "BLOCKED_PENDING_V3_ENGLISH_APPROVAL_AND_REBASED_LOCALIZATION");
assert.equal(gate.englishAuthority.historicalAuthorityOperationallyValid, false);
assert.equal(gate.englishAuthority.candidateGeneratorVersion, "COM-002-ENGLISH-GENERATOR-V3-CANDIDATE-1");
assert.equal(gate.englishAuthority.v3PackMaterialized, false);
assert.equal(gate.englishAuthority.explicitApprovalVerified, false);
assert.equal(gate.englishAuthority.operationallyValid, false);
assert.equal(gate.englishAuthority.frozen, false);
assert.equal(gate.localizationAuthority.requiresV3Rebase, true);
assert.equal(gate.localizationAuthority.frozen, false);
assert.equal(gate.localizationAuthority.fingerprintsPinnedAgainstApprovedV3, false);
assert.equal(gate.localizationAuthority.humanReviewAccepted, false);
assert.equal(gate.localizationAuthority.promotionAllowed, false);
assert.equal(gate.activation.questionStudioDiscoverable, false);
assert.equal(gate.activation.questionStudioRegistrationAllowed, false);
assert.equal(gate.activation.reviewOnlySwitchAllowed, false);
assert.equal(gate.activation.reviewRunPersistenceAllowed, false);
assert.equal(gate.activation.canonicalQuestionPersistenceAllowed, false);
assert.equal(gate.activation.questionBankWritable, false);
assert.equal(gate.activation.testEligible, false);
assert.equal(gate.activation.mockTestEligible, false);
assert.equal(gate.activation.publiclyPublishable, false);
assert.equal(gate.activation.automaticStudentPublication, false);
assert.equal(gate.activation.productionReleaseAuthorized, false);
assert.deepEqual(gate.unlockRequirements, [
  "COM002_V3_520_ENGLISH_AUDIT_EXECUTED_GREEN",
  "COM002_V3_26_ENGLISH_REVIEW_PACK_MATERIALIZED",
  "COM002_V3_26_ENGLISH_REVIEW_PACK_EXPLICITLY_APPROVED",
  "COM002_NEW_ENGLISH_FREEZE_AUTHORITY_BINDS_APPROVED_V3_PACK",
  "COM002_LOCALIZATION_V2_REBASED_TO_APPROVED_V3_AUTHORITY",
  "COM002_V2_LOCALIZATION_PARITY_EXECUTED_GREEN",
  "COM002_V2_BILINGUAL_REVIEW_SAMPLER_ACCEPTED",
  "COM002_V2_LOCALIZATION_FINGERPRINTS_PINNED",
  "COM002_V2_LOCALIZATION_FREEZE_AUTHORITY_CREATED",
  "COM002_REVIEW_ONLY_ADAPTER_AUDITED_AGAINST_NEW_AUTHORITIES",
]);

console.log("[COM002-QUESTION-STUDIO-ACTIVATION-GATE-V1] PASS blocked=true chain=V3");
