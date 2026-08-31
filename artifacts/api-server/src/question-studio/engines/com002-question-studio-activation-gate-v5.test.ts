import { strict as assert } from "node:assert";

import { COM002_V6_V5_OPERATIONAL_FREEZE } from "../../knowledge-v1/computer-awareness/com002-v6-v5-operational-freeze";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import { COM002_QUESTION_STUDIO_ACTIVATION_GATE_V5 } from "./com002-question-studio-activation-gate-v5";

const gate = COM002_QUESTION_STUDIO_ACTIVATION_GATE_V5;
const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;

assert.equal(gate.status, "ACTIVE_STANDARD_REVIEW_ONLY");
assert.equal(gate.operationalFreezeAuthorityId, COM002_V6_V5_OPERATIONAL_FREEZE.authorityId);
assert.equal(gate.contentAuthority.explicitHumanApprovalVerified, true);
assert.equal(gate.contentAuthority.machineFingerprintsPinned, true);
assert.equal(gate.contentAuthority.englishV6Frozen, true);
assert.equal(gate.contentAuthority.localizationV5Frozen, true);
assert.equal(gate.adapterVerification.conclusion, "SUCCESS");
assert.equal(gate.adapterVerification.workflowRunId, 33315623350);
assert.equal(gate.adapterVerification.workflowJobId, 99268418330);
assert.equal(gate.adapterVerification.auditedQuestions, 390);
assert.equal(gate.adapterVerification.standardLifecycleVerified, lifecycle.lifecycleId);

assert.equal(gate.activation.questionStudioDiscoverable, true);
assert.equal(gate.activation.questionStudioRegistrationAllowed, true);
assert.equal(gate.activation.reviewOnlySwitchAllowed, true);
assert.equal(gate.activation.reviewRunPersistenceAllowed, true);
assert.equal(gate.activation.canonicalQuestionPersistenceAllowed, false);
assert.equal(gate.activation.questionBankWritable, false);
assert.equal(gate.activation.testEligible, false);
assert.equal(gate.activation.mockTestEligible, false);
assert.equal(gate.activation.publiclyPublishable, false);
assert.equal(gate.activation.automaticStudentPublication, false);
assert.equal(gate.activation.productionReleaseAuthorized, false);

assert.equal(gate.contentAuthority.englishCombinedFingerprint, "d41ad6eab504f88f154a1e3487db730f188f754ba784f1d1e9f94ce4f9b118f6");
assert.equal(gate.contentAuthority.localizationCombinedFingerprint, "361d48f97a4982b58f589cd5ed003ed8ad1a91bd5f9bd2f4a6c1d3ecc7a4296c");

console.log("[COM002-QUESTION-STUDIO-ACTIVATION-GATE-V5] PASS reviewOnly=true persistence=true bank=false downstream=false");
