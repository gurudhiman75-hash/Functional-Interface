import { strict as assert } from "node:assert";
import { auditCom002QuestionStudioActivationGateV6, COM002_QUESTION_STUDIO_ACTIVATION_GATE_V6 } from "./com002-question-studio-activation-gate-v6";

const audit = auditCom002QuestionStudioActivationGateV6();
assert.equal(audit.valid, true, audit.issues.join(","));
assert.equal(COM002_QUESTION_STUDIO_ACTIVATION_GATE_V6.status, "ACTIVE_STANDARD_BANK_ONLY");
assert.equal(COM002_QUESTION_STUDIO_ACTIVATION_GATE_V6.activation.questionBankWritable, true);
assert.equal(COM002_QUESTION_STUDIO_ACTIVATION_GATE_V6.activation.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(COM002_QUESTION_STUDIO_ACTIVATION_GATE_V6.activation.testEligible, false);
assert.equal(COM002_QUESTION_STUDIO_ACTIVATION_GATE_V6.activation.mockTestEligible, false);
assert.equal(COM002_QUESTION_STUDIO_ACTIVATION_GATE_V6.activation.publiclyPublishable, false);
assert.equal(COM002_QUESTION_STUDIO_ACTIVATION_GATE_V6.activation.productionReleaseAuthorized, false);
console.log("[COM002-ACTIVATION-GATE-V6] PASS BANK_ONLY=true downstream=false public=false");
