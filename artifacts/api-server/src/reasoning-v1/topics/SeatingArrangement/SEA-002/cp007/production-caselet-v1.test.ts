import assert from "node:assert/strict";

import {
  generateSea002Cp007ProductionCaselet,
  independentlySolveSea002Cp007Caselet,
  type Sea002Cp007CandidateAuthorityKey,
} from "./production-caselet-v1.ts";

const AUTHORITIES = [
  "CP007-AUTH-01",
  "CP007-AUTH-02",
  "CP007-AUTH-03",
  "CP007-AUTH-04",
] as const satisfies readonly Sea002Cp007CandidateAuthorityKey[];

let generated = 0;
let uniqueSolutions = 0;
let identityChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let presentationChecks = 0;
const answerPositions = new Map<string, Set<number>>();
const widths = new Map<string, Set<number>>();
const clueKinds = new Set<string>();
const fingerprints = new Map<string, Set<string>>();

for (const authorityKey of AUTHORITIES) {
  answerPositions.set(authorityKey, new Set());
  widths.set(authorityKey, new Set());
  fingerprints.set(authorityKey, new Set());

  for (let index = 0; index < 48; index += 1) {
    const width = authorityKey === "CP007-AUTH-04"
      ? 4 + (index % 3)
      : 3 + (index % 4);
    const seed = `sea-cp007-production:${authorityKey}:${index}`;
    const caselet = generateSea002Cp007ProductionCaselet(seed, width, authorityKey);
    const replay = generateSea002Cp007ProductionCaselet(seed, width, authorityKey);
    generated += 1;
    assert.deepEqual(replay, caselet);

    const solved = independentlySolveSea002Cp007Caselet(caselet);
    assert.equal(solved.solutionCount, 1, `${caselet.caseletId} must have exactly one independently reconstructed state.`);
    uniqueSolutions += 1;
    const solution = solved.solutions[0]!;
    const hiddenTop = caselet.participants
      .filter((p) => p.seat.row === "TOP")
      .sort((a, b) => a.seat.position - b.seat.position)
      .map((p) => p.id);
    const hiddenBottom = caselet.participants
      .filter((p) => p.seat.row === "BOTTOM")
      .sort((a, b) => a.seat.position - b.seat.position)
      .map((p) => p.id);
    assert.deepEqual(solution.top, hiddenTop);
    assert.deepEqual(solution.bottom, hiddenBottom);
    for (const participant of caselet.participants) {
      assert.equal(solution.facings[participant.id], participant.facing);
      identityChecks += 1;
    }

    assert.equal(caselet.options.length, 4);
    assert.equal(new Set(caselet.options).size, 4);
    assert.equal(caselet.options[caselet.correctIndex], caselet.answer);
    assert.equal(caselet.options.filter((option) => option === caselet.answer).length, 1);
    optionChecks += 4;

    assert.equal(caselet.lifecycle.permanentQlAllocated, false);
    assert.equal(caselet.lifecycle.questionStudioDiscoverable, false);
    assert.equal(caselet.lifecycle.questionBankStatus, "NOT_STORED");
    assert.equal(caselet.lifecycle.questionBankWritable, false);
    assert.equal(caselet.lifecycle.testEligibility, "INELIGIBLE");
    assert.equal(caselet.lifecycle.publiclyPublishable, false);
    lifecycleChecks += 6;

    assert.ok(caselet.stem.includes("Some persons face north and some face south."));
    assert.equal(/\bcolumns?\b/i.test(`${caselet.stem} ${caselet.question} ${caselet.explanation}`), false);
    assert.equal(/solver|oracle|fingerprint|coordinate/i.test(`${caselet.stem} ${caselet.question} ${caselet.explanation}`), false);
    assert.ok(caselet.explanation.length >= 90);
    presentationChecks += 4;

    const withoutFacingAnchor = Object.freeze({
      ...caselet,
      clues: Object.freeze(caselet.clues.filter((clue) => clue.kind !== "FACING_ANCHOR")),
    });
    assert.notEqual(independentlySolveSea002Cp007Caselet(withoutFacingAnchor).solutionCount, 1);

    for (const clue of caselet.clues) clueKinds.add(clue.kind);
    answerPositions.get(authorityKey)!.add(caselet.correctIndex);
    widths.get(authorityKey)!.add(width);
    fingerprints.get(authorityKey)!.add(caselet.mathematicalFingerprint);
  }
}

for (const authorityKey of AUTHORITIES) {
  assert.deepEqual([...answerPositions.get(authorityKey)!].sort(), [0, 1, 2, 3]);
  assert.ok(fingerprints.get(authorityKey)!.size >= 40);
}
assert.deepEqual([...widths.get("CP007-AUTH-01")!].sort(), [3, 4, 5, 6]);
assert.deepEqual([...widths.get("CP007-AUTH-02")!].sort(), [3, 4, 5, 6]);
assert.deepEqual([...widths.get("CP007-AUTH-03")!].sort(), [3, 4, 5, 6]);
assert.deepEqual([...widths.get("CP007-AUTH-04")!].sort(), [4, 5, 6]);
assert.deepEqual([...clueKinds].sort(), ["DIAGONAL", "FACING_ANCHOR", "FACING_RELATION", "OPPOSITE", "SAME_ROW_OFFSET"]);

console.log("PASS_SEA002_CP007_PRODUCTION_CASELET_UNIQUENESS_V1");
console.log("candidate authorities", AUTHORITIES.length);
console.log("production caselets", generated);
console.log("independent unique solutions", uniqueSolutions);
console.log("hidden-state identity checks", identityChecks);
console.log("option checks", optionChecks);
console.log("lifecycle checks", lifecycleChecks);
console.log("presentation checks", presentationChecks);
console.log("clue kinds", [...clueKinds].sort().join(","));
console.log("permanent QLs allocated", 0);
console.log("next proposed range", "SEA-QL-025..SEA-QL-028");
