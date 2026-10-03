import assert from "node:assert/strict";

import {
  generateSea002Cp008DiscoveryCaselet,
  SEA002_CP008_PROTOTYPE_IDS,
  sea002Cp008PrototypeConfig,
} from "./discovery-v1.ts";
import { independentlySolveSea002Cp008DiscoveryCaselet } from "./discovery-solver-v1.ts";

let caselets = 0;
let rawSolutions = 0;
let queryChecks = 0;
let lifecycleChecks = 0;
let nonDirectQueryChecks = 0;

for (const prototypeId of SEA002_CP008_PROTOTYPE_IDS) {
  for (let index = 0; index < 20; index += 1) {
    const seed = `cp008-discovery:${prototypeId}:${index}`;
    const first = generateSea002Cp008DiscoveryCaselet(prototypeId, seed);
    const second = generateSea002Cp008DiscoveryCaselet(prototypeId, seed);
    assert.deepEqual(second, first, `${prototypeId}: discovery generation must be deterministic`);
    assert.equal(first.lifecycle.status, "DISCOVERY_ONLY");
    assert.equal(first.lifecycle.permanentQlAllocated, false);
    assert.equal(first.lifecycle.questionStudioRegistered, false);
    assert.equal(first.lifecycle.questionBankWritable, false);
    assert.equal(first.lifecycle.publiclyPublishable, false);
    lifecycleChecks += 5;

    const solved = independentlySolveSea002Cp008DiscoveryCaselet(first);
    assert.equal(solved.rotationallyUniqueSolutionCount, 1, `${prototypeId}/${index}: square arrangement must be unique modulo 90-degree rotation`);
    assert.deepEqual(solved.queryAnswers, [first.query.answer], `${prototypeId}/${index}: independent query answer drift`);
    assert.equal(solved.rawSolutionCount, 4, `${prototypeId}/${index}: expected four 90-degree rotational copies`);
    rawSolutions += solved.rawSolutionCount;
    queryChecks += 1;

    const queryDirectlyPresent = first.clues.some((clue) => {
      if (first.query.kind === "OPPOSITE") {
        return clue.kind === "OPPOSITE"
          && ((clue.a === first.query.reference && clue.b === first.query.answer)
            || (clue.b === first.query.reference && clue.a === first.query.answer));
      }
      return clue.kind === "RELATIVE"
        && clue.reference === first.query.reference
        && clue.subject === first.query.answer
        && clue.steps === first.query.steps
        && clue.direction === first.query.direction;
    });
    assert.equal(queryDirectlyPresent, false, `${prototypeId}/${index}: discovery query must not be copied directly from a clue`);
    nonDirectQueryChecks += 1;
    assert.ok(first.structuralFingerprint.length === 64);
    caselets += 1;
  }
}

assert.equal(caselets, 100);
assert.equal(queryChecks, 100);
assert.equal(nonDirectQueryChecks, 100);
assert.equal(rawSolutions, 400);
assert.equal(lifecycleChecks, 500);

assert.deepEqual(sea002Cp008PrototypeConfig("SEA-CP008-PROT-001"), {
  schema: "ALT8_CORNERS_MIDDLES",
  facingMode: "CORNERS_IN_SIDES_OUT",
});
assert.deepEqual(sea002Cp008PrototypeConfig("SEA-CP008-PROT-002"), {
  schema: "ALT8_CORNERS_MIDDLES",
  facingMode: "CORNERS_OUT_SIDES_IN",
});
assert.deepEqual(sea002Cp008PrototypeConfig("SEA-CP008-PROT-003"), {
  schema: "SIDEPAIR8",
  facingMode: "ALL_IN",
});
assert.deepEqual(sea002Cp008PrototypeConfig("SEA-CP008-PROT-004"), {
  schema: "SIDEPAIR8",
  facingMode: "MIXED",
});
assert.deepEqual(sea002Cp008PrototypeConfig("SEA-CP008-PROT-005"), {
  schema: "ALT12_CORNER_PLUS_TWO_SIDE",
  facingMode: "CORNERS_IN_SIDES_OUT",
});

console.log("PASS_SEA002_CP008_WAVE01_DISCOVERY_V1");
console.log("temporary prototypes", SEA002_CP008_PROTOTYPE_IDS.length);
console.log("independently solved caselets", caselets);
console.log("raw rotational solutions", rawSolutions);
console.log("rotationally unique solutions", caselets);
console.log("non-direct query checks", nonDirectQueryChecks);
console.log("permanent QLs allocated", false);
console.log("Studio/Bank/public", false, false, false);
