import assert from "node:assert/strict";

import {
  SEA002_CP008_WAVE02_AUTHORITY_DISCOVERY_STATUS,
  SEA002_CP008_WAVE02_MERGE_DECISIONS,
  SEA002_CP008_WAVE02_SOLVE_SIGNATURES,
} from "./solve-signature-v2.ts";

assert.equal(Object.keys(SEA002_CP008_WAVE02_SOLVE_SIGNATURES).length, 6);
assert.deepEqual(SEA002_CP008_WAVE02_SOLVE_SIGNATURES["SEA-CP008-SIG-E"].prototypeIds, ["SEA-CP008-PROT-006", "SEA-CP008-PROT-007"]);
assert.deepEqual(SEA002_CP008_WAVE02_SOLVE_SIGNATURES["SEA-CP008-SIG-F"].prototypeIds, ["SEA-CP008-PROT-008"]);
assert.ok(SEA002_CP008_WAVE02_SOLVE_SIGNATURES["SEA-CP008-SIG-E"].operations.includes("UNIFORM_FACING"));
assert.ok(SEA002_CP008_WAVE02_SOLVE_SIGNATURES["SEA-CP008-SIG-F"].operations.includes("MIXED_FACING_INFERENCE"));
assert.equal(SEA002_CP008_WAVE02_MERGE_DECISIONS.filter((entry) => entry.decision === "MERGE").length, 2);
assert.equal(SEA002_CP008_WAVE02_MERGE_DECISIONS.filter((entry) => entry.decision === "KEEP_SEPARATE").length, 4);
const sidePairDecision = SEA002_CP008_WAVE02_MERGE_DECISIONS.find((entry) => entry.members.includes("SEA-CP008-SIG-B" as never));
assert.equal(sidePairDecision?.decision, "KEEP_SEPARATE");
assert.equal(SEA002_CP008_WAVE02_AUTHORITY_DISCOVERY_STATUS.temporaryImplementedPrototypeCount, 8);
assert.equal(SEA002_CP008_WAVE02_AUTHORITY_DISCOVERY_STATUS.provisionalSolveSignatureCount, 6);
assert.equal(SEA002_CP008_WAVE02_AUTHORITY_DISCOVERY_STATUS.unresolvedFamilies.length, 3);
assert.equal(SEA002_CP008_WAVE02_AUTHORITY_DISCOVERY_STATUS.sourceSaturationClaimed, false);
assert.equal(SEA002_CP008_WAVE02_AUTHORITY_DISCOVERY_STATUS.permanentAuthorityCount, 0);
assert.equal(SEA002_CP008_WAVE02_AUTHORITY_DISCOVERY_STATUS.permanentQlAllocated, false);
assert.equal(SEA002_CP008_WAVE02_AUTHORITY_DISCOVERY_STATUS.nextFreeQlId, "SEA-QL-029");
assert.equal(SEA002_CP008_WAVE02_AUTHORITY_DISCOVERY_STATUS.questionStudioRegistered, false);
assert.equal(SEA002_CP008_WAVE02_AUTHORITY_DISCOVERY_STATUS.questionBankWritable, false);
assert.equal(SEA002_CP008_WAVE02_AUTHORITY_DISCOVERY_STATUS.publiclyPublishable, false);

console.log("PASS_SEA002_CP008_SOLVE_SIGNATURE_WAVE02_V2");
console.log("implemented temporary prototypes", SEA002_CP008_WAVE02_AUTHORITY_DISCOVERY_STATUS.temporaryImplementedPrototypeCount);
console.log("provisional solve signatures", SEA002_CP008_WAVE02_AUTHORITY_DISCOVERY_STATUS.provisionalSolveSignatureCount);
console.log("merge decisions", 2);
console.log("keep-separate decisions", 4);
console.log("unresolved families", SEA002_CP008_WAVE02_AUTHORITY_DISCOVERY_STATUS.unresolvedFamilies.length);
console.log("permanent QLs allocated", false);
