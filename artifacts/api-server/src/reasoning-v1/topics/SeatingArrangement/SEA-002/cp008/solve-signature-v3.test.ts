import assert from "node:assert/strict";

import {
  SEA002_CP008_WAVE03_AUTHORITY_DISCOVERY_STATUS,
  SEA002_CP008_WAVE03_DECISION,
  SEA002_CP008_WAVE03_SOLVE_SIGNATURES,
} from "./solve-signature-v3.ts";

assert.equal(Object.keys(SEA002_CP008_WAVE03_SOLVE_SIGNATURES).length, 7);
const sigG = SEA002_CP008_WAVE03_SOLVE_SIGNATURES["SEA-CP008-SIG-G"];
assert.deepEqual(sigG.prototypeIds, ["SEA-CP008-PROT-009"]);
assert.ok(sigG.operations.includes("SQUARE_SIDE_OCCUPANCY_PATTERN"));
assert.ok(sigG.operations.includes("HALF_TURN_SYMMETRY"));
assert.ok(sigG.operations.includes("SAME_SIDE_GROUP"));
assert.ok(sigG.operations.includes("OPPOSITE_SIDE_CORRESPONDENCE"));
assert.equal(SEA002_CP008_WAVE03_DECISION.decision, "KEEP_SEPARATE");
assert.deepEqual(SEA002_CP008_WAVE03_DECISION.comparison, ["SEA-CP008-SIG-B", "SEA-CP008-SIG-G"]);
assert.equal(SEA002_CP008_WAVE03_DECISION.reasons.length, 3);
assert.equal(SEA002_CP008_WAVE03_AUTHORITY_DISCOVERY_STATUS.implementedTemporaryPrototypeCount, 9);
assert.equal(SEA002_CP008_WAVE03_AUTHORITY_DISCOVERY_STATUS.provisionalSolveSignatureCount, 7);
assert.equal(SEA002_CP008_WAVE03_AUTHORITY_DISCOVERY_STATUS.variableSide6Signature, "SEA-CP008-SIG-G");
assert.equal(SEA002_CP008_WAVE03_AUTHORITY_DISCOVERY_STATUS.variableSide6OfficialSourceProven, true);
assert.equal(SEA002_CP008_WAVE03_AUTHORITY_DISCOVERY_STATUS.variableSide6IndependentUniquenessTarget, 40);
assert.equal(SEA002_CP008_WAVE03_AUTHORITY_DISCOVERY_STATUS.resolvedKeepSeparateFromSidePair8, true);
assert.equal(SEA002_CP008_WAVE03_AUTHORITY_DISCOVERY_STATUS.remainingUnresolvedFamilies.length, 2);
assert.equal(SEA002_CP008_WAVE03_AUTHORITY_DISCOVERY_STATUS.sourceSaturationClaimed, false);
assert.equal(SEA002_CP008_WAVE03_AUTHORITY_DISCOVERY_STATUS.permanentAuthorityCount, 0);
assert.equal(SEA002_CP008_WAVE03_AUTHORITY_DISCOVERY_STATUS.permanentQlAllocated, false);
assert.equal(SEA002_CP008_WAVE03_AUTHORITY_DISCOVERY_STATUS.nextFreeQlId, "SEA-QL-029");
assert.equal(SEA002_CP008_WAVE03_AUTHORITY_DISCOVERY_STATUS.questionStudioRegistered, false);
assert.equal(SEA002_CP008_WAVE03_AUTHORITY_DISCOVERY_STATUS.questionBankWritable, false);
assert.equal(SEA002_CP008_WAVE03_AUTHORITY_DISCOVERY_STATUS.testEligible, false);
assert.equal(SEA002_CP008_WAVE03_AUTHORITY_DISCOVERY_STATUS.mockTestEligible, false);
assert.equal(SEA002_CP008_WAVE03_AUTHORITY_DISCOVERY_STATUS.productionStaging, false);
assert.equal(SEA002_CP008_WAVE03_AUTHORITY_DISCOVERY_STATUS.publiclyPublishable, false);

console.log("PASS_SEA002_CP008_SOLVE_SIGNATURE_WAVE03_V3");
console.log("implemented temporary prototypes", 9);
console.log("provisional solve signatures", 7);
console.log("variable-side6 signature", "SEA-CP008-SIG-G");
console.log("SIDEPAIR8 comparison", "KEEP_SEPARATE");
console.log("remaining unresolved families", 2);
console.log("permanent QLs allocated", false);
