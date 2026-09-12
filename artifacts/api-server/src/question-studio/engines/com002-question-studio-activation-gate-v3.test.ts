import assert from "node:assert/strict";

import { COM002_QUESTION_STUDIO_ACTIVATION_GATE_V3 } from "./com002-question-studio-activation-gate-v3";

const gate = COM002_QUESTION_STUDIO_ACTIVATION_GATE_V3;
assert.equal(gate.candidateChain.englishV5ExplicitApprovalVerified, true);
assert.equal(gate.candidateChain.englishV5CanonicalExecutionGreen, true);
assert.equal(gate.candidateChain.englishV5FingerprintsPinned, true);
assert.equal(gate.candidateChain.operationalEnglishV5FreezeExists, true);
assert.equal(gate.candidateChain.operationalEnglishV5FreezePostAuthorityCanonicalRevalidated, false);
assert.equal(gate.candidateChain.localizationV4Defined, true);
assert.equal(gate.candidateChain.localizationV4ExecutedGreen, false);
assert.equal(gate.candidateChain.localizationV4HumanReviewAccepted, false);
assert.equal(gate.candidateChain.localizationV4FingerprintsPinned, false);
assert.equal(gate.candidateChain.localizationV4FreezeExists, false);
assert.equal(gate.candidateChain.v5V4ReviewOnlyAdapterAudited, false);
for (const value of Object.values(gate.activation)) assert.equal(value, false);
assert.equal(gate.unlockRequirements.length, 6);
assert.equal(gate.alreadySatisfiedEvidence.length, 5);
console.log(`[COM002-ACTIVATION-GATE-V3] PASS blocked=true english=V5-frozen localization=V4-review-candidate`);
