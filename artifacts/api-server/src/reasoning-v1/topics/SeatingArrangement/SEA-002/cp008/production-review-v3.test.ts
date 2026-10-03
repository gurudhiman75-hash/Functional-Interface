import assert from "node:assert/strict";

import { SEA002_CP008_PERMANENT_QL_IDS } from "./permanent/registry.ts";
import {
  SEA002_CP008_ENGLISH_REVIEW_SET_V3,
  SEA002_CP008_PRODUCTION_EDITORIAL_V3,
} from "./production-review-v3.ts";
import { independentlySolveSea002Cp008ProductionLearnerGraphV3 } from "./production-clue-solver-v3.ts";

assert.equal(SEA002_CP008_ENGLISH_REVIEW_SET_V3.length, 42);
assert.equal(SEA002_CP008_PRODUCTION_EDITORIAL_V3.discoveryConstraintSpineUsed, false);
assert.equal(SEA002_CP008_PRODUCTION_EDITORIAL_V3.learnerGraphIndependentlySolvable, true);
assert.equal(SEA002_CP008_PRODUCTION_EDITORIAL_V3.difficultyPolicy, "STRUCTURAL_DEDUCTION_DEPTH_NOT_LABEL_ONLY");
assert.equal(new Set(SEA002_CP008_ENGLISH_REVIEW_SET_V3.map((candidate) => candidate.fingerprint)).size, 42);

let solved = 0;
let directQueryChecks = 0;
let branchedGraphChecks = 0;
let noDiscoverySpineChecks = 0;
let difficultGraphChecks = 0;
let rawSolutions = 0;

function queryIsDirect(candidate: (typeof SEA002_CP008_ENGLISH_REVIEW_SET_V3)[number]): boolean {
  return candidate.clues.some((clue) => {
    if (candidate.query.kind === "OPPOSITE") {
      return clue.kind === "OPPOSITE"
        && ((clue.a === candidate.query.reference && clue.b === candidate.answer)
          || (clue.b === candidate.query.reference && clue.a === candidate.answer));
    }
    if (candidate.query.kind === "RELATIVE_METRIC") {
      return clue.kind === "RELATIVE_METRIC"
        && clue.reference === candidate.query.reference
        && clue.subject === candidate.answer
        && clue.direction === candidate.query.direction
        && clue.metres === candidate.query.metres;
    }
    return clue.kind === "RELATIVE"
      && clue.reference === candidate.query.reference
      && clue.subject === candidate.answer
      && clue.direction === candidate.query.direction
      && clue.steps === candidate.query.steps;
  });
}

for (const candidate of SEA002_CP008_ENGLISH_REVIEW_SET_V3) {
  const solvedGraph = independentlySolveSea002Cp008ProductionLearnerGraphV3({
    topology: candidate.topology,
    facingMode: candidate.facingMode,
    participantIds: candidate.participants.map((participant) => participant.id),
    clues: candidate.clues,
    query: candidate.query,
  });
  assert.equal(solvedGraph.rotationallyUniqueSolutionCount, 1, `${candidate.permanentQlId}/${candidate.variantIndex}: learner-facing clues are not uniquely solvable`);
  assert.deepEqual(solvedGraph.queryAnswers, [candidate.answer], `${candidate.permanentQlId}/${candidate.variantIndex}: learner-facing query answer drift`);
  assert.ok(solvedGraph.rawSolutionCount > 0, `${candidate.permanentQlId}/${candidate.variantIndex}: learner graph has no solution`);
  rawSolutions += solvedGraph.rawSolutionCount;
  solved += 1;

  assert.equal(queryIsDirect(candidate), false, `${candidate.permanentQlId}/${candidate.variantIndex}: asked relation is copied directly from a learner clue`);
  assert.equal(candidate.productionGraphProof.queryCopiedDirectlyFromClue, false);
  directQueryChecks += 1;

  assert.equal(candidate.productionGraphProof.usesDiscoveryConstraintSpine, false);
  assert.equal(candidate.productionGraphProof.source, "PRODUCTION_ONLY_NOT_DISCOVERY_SPINE");
  assert.doesNotMatch(candidate.stem, /constraint spine|discovery spine|prototype|seatIndex|structural fingerprint/iu);
  noDiscoverySpineChecks += 1;

  assert.ok(candidate.productionGraphProof.spatialGraphMaxDegree >= 3, `${candidate.permanentQlId}/${candidate.variantIndex}: spatial graph collapsed to a simple chain`);
  assert.ok(candidate.productionGraphProof.askedRelationGraphDepth >= 4, `${candidate.permanentQlId}/${candidate.variantIndex}: asked relation is too shallow`);
  branchedGraphChecks += 1;

  if (candidate.difficulty === "Easy") {
    assert.ok(candidate.productionGraphProof.immediateSpatialClueRatio <= 0.61);
  } else if (candidate.difficulty === "Medium") {
    assert.ok(candidate.productionGraphProof.immediateSpatialClueRatio <= 0.30);
  } else {
    assert.equal(candidate.productionGraphProof.immediateSpatialClueCount, 0, `${candidate.permanentQlId}: Hard graph must not be an immediate-neighbour chain`);
  }
  difficultGraphChecks += 1;

  assert.equal(candidate.options.length, 4);
  assert.equal(new Set(candidate.options).size, 4);
  assert.equal(candidate.options[candidate.correctOptionIndex], candidate.answer);
  assert.match(candidate.explanation, new RegExp(`\\b${candidate.answer}\\b`, "u"));
}

for (const qlId of SEA002_CP008_PERMANENT_QL_IDS) {
  const group = SEA002_CP008_ENGLISH_REVIEW_SET_V3.filter((candidate) => candidate.permanentQlId === qlId);
  assert.equal(group.length, 6);
  const easy = group.filter((candidate) => candidate.difficulty === "Easy");
  const medium = group.filter((candidate) => candidate.difficulty === "Medium");
  const hard = group.filter((candidate) => candidate.difficulty === "Hard");
  assert.equal(easy.length, 2);
  assert.equal(medium.length, 2);
  assert.equal(hard.length, 2);
  assert.ok(Math.max(...hard.map((candidate) => candidate.productionGraphProof.immediateSpatialClueRatio))
    < Math.min(...easy.map((candidate) => candidate.productionGraphProof.immediateSpatialClueRatio)), `${qlId}: Hard difficulty did not structurally move beyond Easy`);
  assert.ok(Math.min(...hard.map((candidate) => candidate.productionGraphProof.askedRelationGraphDepth))
    >= Math.min(...easy.map((candidate) => candidate.productionGraphProof.askedRelationGraphDepth)), `${qlId}: Hard asked-relation depth regressed below Easy`);
}

const ql031 = SEA002_CP008_ENGLISH_REVIEW_SET_V3.filter((candidate) => candidate.permanentQlId === "SEA-QL-031");
const ql033 = SEA002_CP008_ENGLISH_REVIEW_SET_V3.filter((candidate) => candidate.permanentQlId === "SEA-QL-033");
for (const group of [ql031, ql033]) {
  assert.ok(group.filter((candidate) => candidate.difficulty === "Easy").every((candidate) => candidate.productionGraphProof.facingInferenceDepth <= 2));
  assert.ok(group.filter((candidate) => candidate.difficulty === "Hard").every((candidate) => candidate.productionGraphProof.facingInferenceDepth >= 5));
}

const ql029 = SEA002_CP008_ENGLISH_REVIEW_SET_V3.filter((candidate) => candidate.permanentQlId === "SEA-QL-029");
assert.equal(ql029.filter((candidate) => candidate.topology === "ALT12_ROLE_DERIVED").length, 2);
assert.ok(ql029.filter((candidate) => candidate.topology === "ALT12_ROLE_DERIVED").every((candidate) => candidate.participants.length === 12));
const ql035 = SEA002_CP008_ENGLISH_REVIEW_SET_V3.filter((candidate) => candidate.permanentQlId === "SEA-QL-035");
assert.ok(ql035.every((candidate) => candidate.clues.some((clue) => clue.kind === "RELATIVE_METRIC")));
assert.ok(ql035.every((candidate) => /60 m/u.test(candidate.stem) && /5 m/u.test(candidate.stem)));

console.log("PASS_SEA002_CP008_PRODUCTION_REVIEW_V3");
console.log("canonical learner surfaces", SEA002_CP008_ENGLISH_REVIEW_SET_V3.length);
console.log("independently solved learner graphs", solved);
console.log("raw learner solutions", rawSolutions);
console.log("non-direct query checks", directQueryChecks);
console.log("branched graph checks", branchedGraphChecks);
console.log("no discovery-spine checks", noDiscoverySpineChecks);
console.log("difficulty graph checks", difficultGraphChecks);
console.log("12-seat role-derived production surfaces", ql029.filter((candidate) => candidate.topology === "ALT12_ROLE_DERIVED").length);
console.log("human approval", "PENDING");
console.log("Studio/Bank/public", false, false, false);
