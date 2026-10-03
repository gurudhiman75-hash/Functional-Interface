import assert from "node:assert/strict";

import {
  generateSea002Cp008Alt12Caselet,
  SEA002_CP008_ALT12_CANONICAL_ROLE_COUNTS,
  SEA002_CP008_ALT12_PROTOTYPE_ID,
} from "./discovery-alt12-v1.ts";
import { independentlySolveSea002Cp008Alt12Caselet } from "./discovery-alt12-solver-v1.ts";

let caselets = 0;
let rawSolutions = 0;
let nonDirectQueries = 0;
let metricClueChecks = 0;
let sameSideChecks = 0;

assert.deepEqual(SEA002_CP008_ALT12_CANONICAL_ROLE_COUNTS, { corners: 4, sideSeats: 8, sameSidePairs: 4 });

for (let index = 0; index < 50; index += 1) {
  const seed = `cp008-alt12:${index}`;
  const first = generateSea002Cp008Alt12Caselet(seed);
  const second = generateSea002Cp008Alt12Caselet(seed);
  assert.deepEqual(second, first, `${index}: generation must be deterministic`);
  assert.equal(first.prototypeId, SEA002_CP008_ALT12_PROTOTYPE_ID);
  assert.equal(first.schema, "ALT12_CORNER_PLUS_TWO_SIDE");
  assert.equal(first.perimeterMetres, 60);
  assert.equal(first.seatSpacingMetres, 5);
  assert.equal(first.facingMode, "ALL_IN");
  assert.equal(first.participants.length, 12);
  assert.ok(first.participants.every((participant) => participant.facing === "IN"));
  assert.equal(first.structuralFingerprint.length, 64);

  const metricClues = first.clues.filter((clue) => clue.kind === "RELATIVE_METRIC");
  assert.equal(metricClues.length, 10);
  assert.ok(metricClues.every((clue) => clue.metres % 5 === 0));
  assert.ok(metricClues.some((clue) => clue.metres === 15));
  assert.ok(metricClues.some((clue) => clue.metres === 5));
  metricClueChecks += metricClues.length;

  const sameSide = first.clues.filter((clue) => clue.kind === "SAME_SIDE");
  assert.equal(sameSide.length, 4);
  sameSideChecks += sameSide.length;

  assert.equal(first.lifecycle.status, "DISCOVERY_ONLY");
  assert.equal(first.lifecycle.permanentQlAllocated, false);
  assert.equal(first.lifecycle.questionStudioRegistered, false);
  assert.equal(first.lifecycle.questionBankWritable, false);
  assert.equal(first.lifecycle.publiclyPublishable, false);

  const solved = independentlySolveSea002Cp008Alt12Caselet(first);
  assert.equal(solved.rawSolutionCount, 4, `${index}: expected four quarter-turn copies`);
  assert.equal(solved.quarterTurnUniqueSolutionCount, 1, `${index}: expected one arrangement modulo 90-degree rotation`);
  assert.deepEqual(solved.queryAnswers, [first.query.answer]);
  rawSolutions += solved.rawSolutionCount;

  const direct = first.clues.some((clue) => {
    if (first.query.kind === "OPPOSITE") {
      return clue.kind === "OPPOSITE"
        && ((clue.a === first.query.reference && clue.b === first.query.answer)
          || (clue.b === first.query.reference && clue.a === first.query.answer));
    }
    return clue.kind === "RELATIVE_METRIC"
      && clue.reference === first.query.reference
      && clue.subject === first.query.answer
      && clue.direction === first.query.direction
      && clue.metres === first.query.metres;
  });
  assert.equal(direct, false, `${index}: query must be non-direct`);
  nonDirectQueries += 1;
  caselets += 1;
}

assert.equal(caselets, 50);
assert.equal(rawSolutions, 200);
assert.equal(nonDirectQueries, 50);
assert.equal(metricClueChecks, 500);
assert.equal(sameSideChecks, 200);

console.log("PASS_SEA002_CP008_ALT12_DISCOVERY_V1");
console.log("prototype", SEA002_CP008_ALT12_PROTOTYPE_ID);
console.log("independently solved caselets", caselets);
console.log("raw quarter-turn solutions", rawSolutions);
console.log("quarter-turn unique caselets", caselets);
console.log("metric clue checks", metricClueChecks);
console.log("same-side checks", sameSideChecks);
console.log("non-direct query checks", nonDirectQueries);
console.log("permanent QL allocated", false);
