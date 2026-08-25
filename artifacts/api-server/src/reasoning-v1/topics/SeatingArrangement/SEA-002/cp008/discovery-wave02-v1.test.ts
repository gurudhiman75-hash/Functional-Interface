import assert from "node:assert/strict";

import {
  generateSea002Cp008Wave02Caselet,
  SEA002_CP008_WAVE02_PROTOTYPE_IDS,
} from "./discovery-wave02-v1.ts";
import { independentlySolveSea002Cp008Wave02Caselet } from "./discovery-wave02-solver-v1.ts";

let caselets = 0;
let rawSolutions = 0;
let nonDirectQueries = 0;
let mixedRoleFacingChecks = 0;

for (const prototypeId of SEA002_CP008_WAVE02_PROTOTYPE_IDS) {
  for (let index = 0; index < 30; index += 1) {
    const seed = `cp008-wave02:${prototypeId}:${index}`;
    const first = generateSea002Cp008Wave02Caselet(prototypeId, seed);
    const second = generateSea002Cp008Wave02Caselet(prototypeId, seed);
    assert.deepEqual(second, first);
    assert.equal(first.lifecycle.status, "DISCOVERY_ONLY");
    assert.equal(first.lifecycle.permanentQlAllocated, false);
    assert.equal(first.lifecycle.questionStudioRegistered, false);
    assert.equal(first.lifecycle.questionBankWritable, false);
    assert.equal(first.lifecycle.publiclyPublishable, false);

    const solved = independentlySolveSea002Cp008Wave02Caselet(first);
    assert.equal(solved.rawSolutionCount, 4, `${prototypeId}/${index}: expected four legitimate square rotations`);
    assert.equal(solved.rotationallyUniqueSolutionCount, 1, `${prototypeId}/${index}: must solve uniquely modulo rotation`);
    assert.deepEqual(solved.queryAnswers, [first.query.answer]);
    rawSolutions += solved.rawSolutionCount;

    const direct = first.clues.some((clue) => {
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
    assert.equal(direct, false);
    nonDirectQueries += 1;

    if (prototypeId === "SEA-CP008-PROT-006") assert.ok(first.participants.every((participant) => participant.facing === "IN"));
    if (prototypeId === "SEA-CP008-PROT-007") assert.ok(first.participants.every((participant) => participant.facing === "OUT"));
    if (prototypeId === "SEA-CP008-PROT-008") {
      const cornerFacings = new Set(first.participants.filter((participant) => participant.seatIndex % 2 === 0).map((participant) => participant.facing));
      const sideFacings = new Set(first.participants.filter((participant) => participant.seatIndex % 2 === 1).map((participant) => participant.facing));
      assert.deepEqual([...new Set(first.participants.map((participant) => participant.facing))].sort(), ["IN", "OUT"]);
      assert.equal(cornerFacings.size, 2, "mixed ALT8 must not collapse facing to corner role");
      assert.equal(sideFacings.size, 2, "mixed ALT8 must not collapse facing to side role");
      mixedRoleFacingChecks += 2;
    }
    caselets += 1;
  }
}

assert.equal(caselets, 90);
assert.equal(rawSolutions, 360);
assert.equal(nonDirectQueries, 90);
assert.equal(mixedRoleFacingChecks, 60);

console.log("PASS_SEA002_CP008_WAVE02_ALT8_DISCOVERY_V1");
console.log("temporary Wave02 prototypes", SEA002_CP008_WAVE02_PROTOTYPE_IDS.length);
console.log("independently solved caselets", caselets);
console.log("raw rotational solutions", rawSolutions);
console.log("rotationally unique caselets", caselets);
console.log("non-direct query checks", nonDirectQueries);
console.log("mixed role/facing independence checks", mixedRoleFacingChecks);
console.log("permanent QL allocated", false);
