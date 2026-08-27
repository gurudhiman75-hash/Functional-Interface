import assert from "node:assert/strict";

import { COM002_QUESTION_STUDIO_ACTIVATION_GATE_V1 as gate } from "./com002-question-studio-activation-gate-v1";

assert.equal(gate.status, "BLOCKED_PENDING_EXPLICIT_ENGLISH_HUMAN_REVIEW");
assert.equal(gate.englishAuthority.explicitApprovalVerified, false);
assert.equal(gate.englishAuthority.operationallyValid, false);
assert.equal(gate.englishAuthority.frozen, false);
assert.equal(gate.localizationAuthority.frozen, false);
assert.equal(gate.localizationAuthority.fingerprintsPinned, false);
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
  "COM002_26_ENGLISH_REVIEW_SAMPLER_EXPLICITLY_APPROVED",
  "COM002_NEW_ENGLISH_FREEZE_AUTHORITY_BINDS_EXPLICIT_APPROVAL",
  "COM002_1040_LOCALIZATION_PARITY_EXECUTED_GREEN",
  "COM002_26_BILINGUAL_REVIEW_SAMPLER_ACCEPTED",
  "COM002_LOCALIZATION_FINGERPRINTS_PINNED",
  "COM002_LOCALIZATION_FREEZE_AUTHORITY_CREATED",
  "COM002_REVIEW_ONLY_ADAPTER_AUDITED",
]);
