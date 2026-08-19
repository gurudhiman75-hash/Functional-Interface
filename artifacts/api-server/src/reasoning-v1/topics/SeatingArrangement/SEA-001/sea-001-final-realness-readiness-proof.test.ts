import { strict as assert } from "node:assert";

import { sea001FinalRealnessReadiness } from "./realness/final-readiness.ts";
import { assertSea001MultilingualFreezeKeepsDeliveryLocked } from "./localization/multilingual-freeze.ts";
import { assertSea001PermanentLayerStillInactive } from "./permanent/freeze.ts";

const readiness = sea001FinalRealnessReadiness();

assert.equal(readiness.technicalSourceSaturation, "GREEN");
assert.equal(readiness.technicalSourceEvidenceRecords, 13);
assert.equal(readiness.technicalSourceExamFamiliesCovered, 4);
assert.equal(readiness.technicalSourceCheckpointsCovered, 5);
assert(readiness.targetExamRealnessEvidenceRecords >= 17);
assert.equal(readiness.familyProductWeightFreezeReady, false);
assert.equal(readiness.machineArtifactThresholdFreezeReady, false);
assert.equal(readiness.dynamicMultilingualSpotReviewStatus, "PENDING");
assert.equal(readiness.weightingPolicy, "OBSERVED_COUNTS_ONLY_DO_NOT_CONVERT_TO_PRODUCT_PERCENTAGES_YET");
assert.equal(readiness.productActivationStillLocked, true);

assert(readiness.blockers.includes("SSC_REQUIRES_SEA002"));
assert(readiness.blockers.includes("BANKING_REQUIRES_SEA002_AND_SEA003"));
assert(readiness.blockers.includes("PUNJAB_SOURCE_BASE_TOO_NARROW"));
assert(readiness.blockers.includes("MACHINE_ARTIFACT_THRESHOLDS_NOT_PINNED"));
assert(readiness.blockers.includes("DYNAMIC_MULTILINGUAL_SPOT_REVIEW_PENDING"));
assert(!readiness.blockers.includes("TECHNICAL_SOURCE_AUDIT_NOT_GREEN"));

assertSea001PermanentLayerStillInactive();
assertSea001MultilingualFreezeKeepsDeliveryLocked();

console.log("PASS_SEA_001_FINAL_REALNESS_READINESS_BOUNDARY");
console.log(JSON.stringify(readiness));
