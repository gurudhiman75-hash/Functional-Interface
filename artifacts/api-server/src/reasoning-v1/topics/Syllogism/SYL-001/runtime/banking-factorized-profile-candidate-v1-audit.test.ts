import assert from "node:assert/strict";
import { buildSylBankingFactorizedProfileCandidateV1 } from "./banking-factorized-profile-candidate-v1";

const plan = buildSylBankingFactorizedProfileCandidateV1(733, 100);
assert.equal(plan.authority, "SYL_001_BANKING_FACTORIZED_PROFILE_CANDIDATE_V1");
assert.equal(plan.slots.length, 100);
assert.deepEqual(plan.dimensions, [
  "CONCLUSION_STRUCTURE",
  "CONCLUSION_SEMANTIC_FEATURE",
  "PREMISE_VOCABULARY_OVERLAY",
  "CONCLUSION_SET_RELATIONSHIP",
]);
assert.equal(plan.exactFactorWeightsFrozen, false);
assert.equal(plan.sourceFrequencyClaim, false);
assert.equal(plan.connectedToProductionPlanner, false);
assert.equal(plan.connectedToProductionGenerator, false);
assert.equal(plan.registrationPermitted, false);
assert.equal(plan.activationPermitted, false);

const either = plan.slots.filter((slot) => slot.sourceFamilyId === "BANK_EITHER_OR_COMPLEMENTARY");
assert.ok(either.length > 0);
assert.equal(either.every((slot) => slot.conclusionSetRelationship === "COMPLEMENTARY_EITHER_OR"), true);
assert.equal(either.every((slot) => slot.allowedPremiseOverlayFeatures.length === 0), true);

const special = plan.slots.filter((slot) => slot.sourceFamilyId === "BANK_ONLY_AND_ONLY_A_FEW");
assert.ok(special.length > 0);
assert.equal(special.every((slot) => slot.allowedPremiseOverlayFeatures.includes("ONLY")), true);
assert.equal(special.every((slot) => slot.allowedPremiseOverlayFeatures.includes("ONLY_A_FEW")), true);
assert.equal(special.every((slot) => slot.conclusionSetRelationship === "INDEPENDENT"), true);

const modal = plan.slots.filter((slot) => slot.sourceFamilyId === "BANK_POSSIBILITY_IN_CONCLUSION_SET");
assert.ok(modal.length > 0);
assert.equal(modal.every((slot) => slot.allowedConclusionSemanticFeatures.includes("ORDINARY_POSSIBILITY")), true);
assert.equal(modal.every((slot) => slot.allowedConclusionSemanticFeatures.includes("CAN_NEVER")), true);
assert.equal(modal.every((slot) => slot.conclusionStructure === "TWO_CONCLUSION"), true);

const advanced = plan.slots.filter((slot) => slot.sourceFamilyId === "BANK_THREE_CONCLUSION_ADVANCED");
assert.ok(advanced.length > 0);
assert.equal(advanced.every((slot) => slot.conclusionStructure === "THREE_CONCLUSION"), true);

assert.equal(plan.slots.every((slot) => slot.exactFeatureFrequencyClaim === false), true);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_FACTORIZED_PROFILE_CANDIDATE_V1",
  slots: plan.slots.length,
  exactFactorWeightsFrozen: false,
  productionConnected: false,
}, null, 2));
