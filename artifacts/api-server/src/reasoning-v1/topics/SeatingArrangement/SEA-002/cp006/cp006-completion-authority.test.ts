import assert from "node:assert/strict";

import {
  SEA002_CP006_COMPLETION_AUTHORITY,
  SEA002_CP006_COMPLETION_AUTHORITY_ID,
} from "./cp006-completion-authority.ts";

assert.equal(SEA002_CP006_COMPLETION_AUTHORITY.authorityId, SEA002_CP006_COMPLETION_AUTHORITY_ID);
assert.equal(SEA002_CP006_COMPLETION_AUTHORITY.checkpointId, "SEA-CP-006");
assert.equal(SEA002_CP006_COMPLETION_AUTHORITY.status, "COMPLETE_FOR_QUESTION_STUDIO_AND_BANK_ACCEPTANCE");
assert.deepEqual(SEA002_CP006_COMPLETION_AUTHORITY.permanentQlIds, [
  "SEA-QL-021",
  "SEA-QL-022",
  "SEA-QL-023",
  "SEA-QL-024",
]);
assert.equal(SEA002_CP006_COMPLETION_AUTHORITY.nextPermanentQlId, "SEA-QL-025");
assert.equal(SEA002_CP006_COMPLETION_AUTHORITY.nextCheckpointId, "SEA-CP-007");
assert.equal(SEA002_CP006_COMPLETION_AUTHORITY.freezes.englishFrozen, true);
assert.equal(SEA002_CP006_COMPLETION_AUTHORITY.freezes.hindiPunjabiFrozen, true);
assert.equal(SEA002_CP006_COMPLETION_AUTHORITY.authoringLifecycle.questionStudioActive, true);
assert.equal(SEA002_CP006_COMPLETION_AUTHORITY.authoringLifecycle.questionBankAcceptanceActive, true);
assert.equal(SEA002_CP006_COMPLETION_AUTHORITY.authoringLifecycle.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(SEA002_CP006_COMPLETION_AUTHORITY.authoringLifecycle.manualApprovalRequired, true);
assert.equal(SEA002_CP006_COMPLETION_AUTHORITY.downstreamLifecycle.testEligible, false);
assert.equal(SEA002_CP006_COMPLETION_AUTHORITY.downstreamLifecycle.mockTestEligible, false);
assert.equal(SEA002_CP006_COMPLETION_AUTHORITY.downstreamLifecycle.productionStaging, false);
assert.equal(SEA002_CP006_COMPLETION_AUTHORITY.downstreamLifecycle.publiclyPublishable, false);
assert.equal(SEA002_CP006_COMPLETION_AUTHORITY.downstreamLifecycle.automaticStudentPublication, false);
assert.equal(SEA002_CP006_COMPLETION_AUTHORITY.closureRules.sourceGeneratorReopened, false);
assert.equal(SEA002_CP006_COMPLETION_AUTHORITY.closureRules.frozenContentRewritten, false);
assert.equal(SEA002_CP006_COMPLETION_AUTHORITY.closureRules.newPermanentQlAllocatedForAcceptance, false);

console.log("PASS_SEA002_CP006_COMPLETION_AUTHORITY_V1");
console.log("CP006 complete for Question Studio + BANK_ONLY acceptance");
console.log("next checkpoint SEA-CP-007");
console.log("next permanent QL SEA-QL-025");
console.log("test/mock/staging/public remain false");
