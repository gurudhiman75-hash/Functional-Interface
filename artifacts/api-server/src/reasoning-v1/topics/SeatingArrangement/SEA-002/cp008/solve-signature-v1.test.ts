import assert from "node:assert/strict";

import { SEA002_CP008_PROTOTYPE_IDS } from "./discovery-v1.ts";
import {
  SEA002_CP008_PROTOTYPE_TO_SIGNATURE,
  SEA002_CP008_PROVISIONAL_SOLVE_SIGNATURES,
  SEA002_CP008_WAVE01_COLLAPSE,
} from "./solve-signature-v1.ts";

assert.equal(Object.keys(SEA002_CP008_PROVISIONAL_SOLVE_SIGNATURES).length, 4);
assert.equal(Object.keys(SEA002_CP008_PROTOTYPE_TO_SIGNATURE).length, 5);
assert.ok(SEA002_CP008_PROTOTYPE_IDS.every((prototypeId) => SEA002_CP008_PROTOTYPE_TO_SIGNATURE[prototypeId]));
assert.equal(SEA002_CP008_PROTOTYPE_TO_SIGNATURE["SEA-CP008-PROT-001"], "SEA-CP008-SIG-A");
assert.equal(SEA002_CP008_PROTOTYPE_TO_SIGNATURE["SEA-CP008-PROT-002"], "SEA-CP008-SIG-A");
assert.notEqual(SEA002_CP008_PROTOTYPE_TO_SIGNATURE["SEA-CP008-PROT-003"], SEA002_CP008_PROTOTYPE_TO_SIGNATURE["SEA-CP008-PROT-004"]);
assert.equal(SEA002_CP008_PROTOTYPE_TO_SIGNATURE["SEA-CP008-PROT-005"], "SEA-CP008-SIG-D");
assert.equal(SEA002_CP008_WAVE01_COLLAPSE.temporaryPrototypeCount, 5);
assert.equal(SEA002_CP008_WAVE01_COLLAPSE.provisionalSolveSignatureCount, 4);
assert.equal(SEA002_CP008_WAVE01_COLLAPSE.confirmedMerge.into, "SEA-CP008-SIG-A");
assert.deepEqual(SEA002_CP008_WAVE01_COLLAPSE.confirmedMerge.prototypes, ["SEA-CP008-PROT-001", "SEA-CP008-PROT-002"]);
assert.equal(SEA002_CP008_WAVE01_COLLAPSE.unresolvedMergeQuestions.length, 2);
assert.equal(SEA002_CP008_WAVE01_COLLAPSE.permanentAuthorityCount, 0);
assert.equal(SEA002_CP008_WAVE01_COLLAPSE.permanentQlAllocated, false);
assert.equal(SEA002_CP008_WAVE01_COLLAPSE.nextFreeQlId, "SEA-QL-029");

console.log("PASS_SEA002_CP008_SOLVE_SIGNATURE_WAVE01_V1");
console.log("temporary prototypes", SEA002_CP008_WAVE01_COLLAPSE.temporaryPrototypeCount);
console.log("provisional solve signatures", SEA002_CP008_WAVE01_COLLAPSE.provisionalSolveSignatureCount);
console.log("confirmed collapse", "PROT-001 + PROT-002 -> SIG-A");
console.log("unresolved merge questions", SEA002_CP008_WAVE01_COLLAPSE.unresolvedMergeQuestions.length);
console.log("permanent authorities", 0);
console.log("next free QL", SEA002_CP008_WAVE01_COLLAPSE.nextFreeQlId, "NOT ALLOCATED");
