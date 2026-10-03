import assert from "node:assert/strict";

import {
  generateSea002Cp008VariableSide6Caselet,
  SEA002_CP008_VARIABLE_SIDE6_CANONICAL_OCCUPANCY,
  SEA002_CP008_VARIABLE_SIDE6_PROTOTYPE_ID,
} from "./discovery-variable-side6-v1.ts";
import { independentlySolveSea002Cp008VariableSide6Caselet } from "./discovery-variable-side6-solver-v1.ts";

let caselets = 0;
let rawSolutions = 0;
let nonDirectQueries = 0;
let occupancyChecks = 0;
let lifecycleChecks = 0;

for (let index = 0; index < 40; index += 1) {
  const seed = `cp008-variable-side6:${index}`;
  const first = generateSea002Cp008VariableSide6Caselet(seed);
  const second = generateSea002Cp008VariableSide6Caselet(seed);
  assert.deepEqual(second, first, `${index}: generation must be deterministic`);
  assert.equal(first.prototypeId, SEA002_CP008_VARIABLE_SIDE6_PROTOTYPE_ID);
  assert.equal(first.topology, "VARIABLE_SIDE6");
  assert.equal(first.facingMode, "ALL_IN");
  assert.equal(first.participants.length, 6);
  assert.ok(first.participants.every((participant) => participant.facing === "IN"));
  assert.equal(first.structuralFingerprint.length, 64);

  const bySide = [0, 1, 2, 3].map((side) =>
    first.participants.filter((participant) => SEA002_CP008_VARIABLE_SIDE6_CANONICAL_OCCUPANCY[participant.seatIndex]!.side === side).length,
  );
  assert.deepEqual(bySide, [1, 2, 1, 2]);
  occupancyChecks += 4;

  assert.equal(first.lifecycle.status, "DISCOVERY_ONLY");
  assert.equal(first.lifecycle.permanentQlAllocated, false);
  assert.equal(first.lifecycle.questionStudioRegistered, false);
  assert.equal(first.lifecycle.questionBankWritable, false);
  assert.equal(first.lifecycle.publiclyPublishable, false);
  lifecycleChecks += 5;

  const solved = independentlySolveSea002Cp008VariableSide6Caselet(first);
  assert.equal(solved.rawSolutionCount, 2, `${index}: expected only two half-turn copies`);
  assert.equal(solved.halfTurnUniqueSolutionCount, 1, `${index}: expected one unique 1-2-1-2 arrangement modulo 180-degree rotation`);
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
  assert.equal(direct, false, `${index}: query must not be copied from a clue`);
  nonDirectQueries += 1;
  caselets += 1;
}

assert.equal(caselets, 40);
assert.equal(rawSolutions, 80);
assert.equal(nonDirectQueries, 40);
assert.equal(occupancyChecks, 160);
assert.equal(lifecycleChecks, 200);

console.log("PASS_SEA002_CP008_VARIABLE_SIDE6_DISCOVERY_V1");
console.log("prototype", SEA002_CP008_VARIABLE_SIDE6_PROTOTYPE_ID);
console.log("independently solved caselets", caselets);
console.log("raw half-turn solutions", rawSolutions);
console.log("half-turn unique caselets", caselets);
console.log("non-direct query checks", nonDirectQueries);
console.log("occupancy checks", occupancyChecks);
console.log("permanent QL allocated", false);
console.log("Studio/Bank/public", false, false, false);
