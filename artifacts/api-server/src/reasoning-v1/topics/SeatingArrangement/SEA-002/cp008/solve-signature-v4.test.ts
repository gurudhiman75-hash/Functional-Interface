import assert from "node:assert/strict";

import {
  SEA002_CP008_PERMANENT_ELIGIBLE_SIGNATURE_IDS,
  SEA002_CP008_WAVE04_AUTHORITY_STATUS,
  SEA002_CP008_WAVE04_FINAL_DECISIONS,
  SEA002_CP008_WAVE04_SOLVE_SIGNATURES,
} from "./solve-signature-v4.ts";

assert.equal(Object.keys(SEA002_CP008_WAVE04_SOLVE_SIGNATURES).length, 8);
assert.equal(SEA002_CP008_PERMANENT_ELIGIBLE_SIGNATURE_IDS.length, 7);
assert.equal(SEA002_CP008_PERMANENT_ELIGIBLE_SIGNATURE_IDS.includes("SEA-CP008-SIG-D" as never), false);
assert.deepEqual(SEA002_CP008_WAVE04_AUTHORITY_STATUS.unresolvedProductionFamilies, []);
assert.equal(SEA002_CP008_WAVE04_AUTHORITY_STATUS.productionSourceSaturationClaimed, true);
assert.equal(SEA002_CP008_WAVE04_AUTHORITY_STATUS.permanentEligibleSignatureCount, 7);
assert.equal(SEA002_CP008_WAVE04_AUTHORITY_STATUS.permanentQlAllocated, false);
assert.equal(SEA002_CP008_WAVE04_AUTHORITY_STATUS.nextFreeQlId, "SEA-QL-029");
assert.equal(SEA002_CP008_WAVE04_AUTHORITY_STATUS.sourceBackedRoleDerivedScaleVariantMergedInto, "SEA-CP008-SIG-A");

const sigA = SEA002_CP008_WAVE04_SOLVE_SIGNATURES["SEA-CP008-SIG-A"];
assert.deepEqual(sigA.prototypeIds, ["SEA-CP008-PROT-001", "SEA-CP008-PROT-002", "SEA-CP008-PROT-005"]);
assert.match(sigA.mergeRationale, /scale parameter/iu);

const sigH = SEA002_CP008_WAVE04_SOLVE_SIGNATURES["SEA-CP008-SIG-H"];
assert.ok(sigH.operations.includes("MULTIPLE_SIDE_SLOTS"));
assert.ok(sigH.operations.includes("SAME_SIDE_PAIRING"));
assert.ok(sigH.operations.includes("METRIC_PERIMETER_DISTANCE"));
assert.ok(sigH.operations.includes("SQUARE_OPPOSITE"));
assert.deepEqual(sigH.prototypeIds, ["SEA-CP008-PROT-011"]);

const decisions = SEA002_CP008_WAVE04_FINAL_DECISIONS.map((item) => item.decision);
assert.equal(decisions.filter((decision) => decision === "KEEP_SEPARATE").length, 2);
assert.equal(decisions.filter((decision) => decision === "MERGE_SCALE_VARIANT_INTO_SIG_A").length, 1);
assert.equal(decisions.filter((decision) => decision === "EXCLUDE_FROM_PERMANENT_SET_RETAIN_STRESS_ONLY").length, 1);
assert.deepEqual(SEA002_CP008_WAVE04_AUTHORITY_STATUS.stressOnlyFamilies, ["SEA-CP008-PROT-010"]);

console.log("PASS_SEA002_CP008_SOLVE_SIGNATURE_WAVE04_V4");
console.log("provisional signatures", Object.keys(SEA002_CP008_WAVE04_SOLVE_SIGNATURES).length);
console.log("permanent-eligible signatures", SEA002_CP008_PERMANENT_ELIGIBLE_SIGNATURE_IDS.length);
console.log("ALT12 role-derived merged into SIG-A", true);
console.log("unresolved production families", SEA002_CP008_WAVE04_AUTHORITY_STATUS.unresolvedProductionFamilies.length);
console.log("stress-only families", SEA002_CP008_WAVE04_AUTHORITY_STATUS.stressOnlyFamilies.length);
console.log("source saturation", SEA002_CP008_WAVE04_AUTHORITY_STATUS.productionSourceSaturationClaimed);
console.log("permanent QL allocated", SEA002_CP008_WAVE04_AUTHORITY_STATUS.permanentQlAllocated);
