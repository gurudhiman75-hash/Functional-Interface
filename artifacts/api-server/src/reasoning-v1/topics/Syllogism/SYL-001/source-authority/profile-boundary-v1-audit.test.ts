import assert from "node:assert/strict";
import { buildSylProfilePlanV4 } from "../runtime/profile-plan-v4";
import {
  SYL_PUNJAB_PROFILE_BOUNDARY_V1,
  SYL_SSC_PROFILE_BOUNDARY_V1,
} from "./profile-boundary-v1";

const ssc = buildSylProfilePlanV4("SSC", 991, 100);
const sscPractice = ssc.slots.filter((slot) => slot.readiness === "PRACTICE_ONLY");
assert.ok(sscPractice.length > 0);
assert.equal(
  sscPractice.every((slot) => SYL_SSC_PROFILE_BOUNDARY_V1.adaptedPracticeFamilies.includes(slot.familyId as "SSC_THREE_CONCLUSION_ADVANCED")),
  true,
);
assert.equal(SYL_SSC_PROFILE_BOUNDARY_V1.adaptedPracticeMockWeight, 0);
assert.equal(SYL_SSC_PROFILE_BOUNDARY_V1.directSscThreeConclusionSourceFrozen, false);

const sscMockEligible = ssc.slots.filter((slot) => slot.readiness === "ACTIVE_CANONICAL");
assert.equal(sscMockEligible.some((slot) => slot.familyId === "SSC_THREE_CONCLUSION_ADVANCED"), false);

const punjab = buildSylProfilePlanV4("PUNJAB_POLICE", 991, 100);
assert.equal(punjab.slots.length, 100);
assert.equal(
  punjab.slots.every((slot) =>
    SYL_PUNJAB_PROFILE_BOUNDARY_V1.supportedTaskFamilies.includes(
      slot.familyId as "PUNJAB_POLICE_TWO_CONCLUSION_FOUR_OPTION" | "PUNJAB_POLICE_THREE_CONCLUSION_FOUR_OPTION",
    )),
  true,
);
assert.equal(SYL_PUNJAB_PROFILE_BOUNDARY_V1.supportedExamFamily, "PUNJAB_POLICE_CONSTABLE");
assert.equal(SYL_PUNJAB_PROFILE_BOUNDARY_V1.statewidePunjabGeneralizationPermitted, false);
assert.equal(SYL_PUNJAB_PROFILE_BOUNDARY_V1.psssbGeneralizationPermitted, false);
assert.equal(SYL_PUNJAB_PROFILE_BOUNDARY_V1.patwariGeneralizationPermitted, false);
assert.equal(SYL_PUNJAB_PROFILE_BOUNDARY_V1.policeSiGeneralizationPermitted, false);
assert.equal(SYL_PUNJAB_PROFILE_BOUNDARY_V1.exactHistoricalFrequencyClaimPermitted, false);

console.log(JSON.stringify({
  status: "PASS_SYL_001_PROFILE_BOUNDARY_V1",
  sscPracticeSlots: sscPractice.length,
  sscMockEligibleSlots: sscMockEligible.length,
  punjabSlots: punjab.slots.length,
  statewidePunjabGeneralizationPermitted: false,
}, null, 2));
