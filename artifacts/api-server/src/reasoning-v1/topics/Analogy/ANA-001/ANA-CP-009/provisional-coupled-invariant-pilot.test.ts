import assert from "node:assert/strict";
import {
  candidateStepsForOutput,
  clusterTotal,
  enumerateCoupledInvariantCandidates,
} from "./provisional-coupled-invariant-pilot";

const sourceA = { letters: "SL", number: 23 };
const outputA = { letters: "RY", number: 11 };
const sourceB = { letters: "MB", number: 39 };
const outputB = { letters: "HS", number: 27 };
const target = { letters: "EW", number: 26 };

assert.equal(clusterTotal(sourceA), 54);
assert.equal(clusterTotal(outputA), 54);
assert.equal(clusterTotal(sourceB), 54);
assert.equal(clusterTotal(outputB), 54);
assert.equal(clusterTotal(target), 54);

assert.deepEqual(candidateStepsForOutput(sourceA, "RY11"), [1]);
assert.deepEqual(candidateStepsForOutput(sourceB, "HS27"), [5]);
assert.deepEqual(candidateStepsForOutput(target, "CK40"), [2]);

const candidates = enumerateCoupledInvariantCandidates(target);
assert.equal(candidates.length, 25);
assert.ok(candidates.some((candidate) => candidate.rendered === "CK40"));
assert.ok(candidates.some((candidate) => candidate.rendered === "BL40"));

const publishedOptions = ["BL40", "CK44", "CK40", "BL44"];
const matchingOptions = publishedOptions.filter((option) =>
  candidates.some((candidate) => candidate.rendered === option),
);

assert.deepEqual(
  matchingOptions,
  ["BL40", "CK40"],
  "The available invariant-plus-movement-gap explanation leaves two published options valid.",
);

const sourceSteps = [
  candidateStepsForOutput(sourceA, "RY11")[0],
  candidateStepsForOutput(sourceB, "HS27")[0],
];
assert.deepEqual(sourceSteps, [1, 5]);
assert.notEqual(
  sourceSteps[1] - sourceSteps[0],
  candidateStepsForOutput(target, "CK40")[0] - sourceSteps[1],
  "The selected backward step is not established by a simple arithmetic progression across pairs.",
);

console.log("ANA-CP-009 coupled-invariant ambiguity proof passed.", {
  sharedClusterTotal: 54,
  candidateOutputsForTarget: candidates.length,
  publishedOptionsAcceptedByTextRule: matchingOptions,
  sourceBackwardSteps: sourceSteps,
  claimedAnswerBackwardStep: 2,
  permanentQlIdsAssigned: 0,
});
