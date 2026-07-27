import assert from "node:assert/strict";
import {
  ANA_CP009_CHANGING_VECTOR_FIXTURE,
  applyForwardVector,
  deriveForwardVector,
  describeModularArithmeticVector,
  enumerateAnchorCompatibleMetaRecurrences,
} from "./provisional-changing-vector-canonicalization";

const fixture = ANA_CP009_CHANGING_VECTOR_FIXTURE;

const vectors = fixture.inputClusters.map((input, index) =>
  deriveForwardVector(input, fixture.outputClusters[index]),
) as readonly [
  readonly [number, number, number],
  readonly [number, number, number],
  readonly [number, number, number],
];

assert.deepEqual(vectors, [
  [21, 23, 25],
  [17, 23, 3],
  [5, 23, 15],
]);

const descriptors = vectors.map(describeModularArithmeticVector);
assert.ok(descriptors.every((descriptor) => descriptor !== null));
assert.deepEqual(
  descriptors.map((descriptor) => descriptor && [descriptor.start, descriptor.step]),
  [[21, 2], [17, 6], [5, 18]],
);

assert.deepEqual(
  fixture.inputNumbers.map((number, index) => number * 2 === fixture.outputNumbers[index]),
  [true, true, true],
);

const candidates = enumerateAnchorCompatibleMetaRecurrences();
assert.equal(candidates.length, 6);
assert.deepEqual(
  candidates.map(({ multiplier, initialStartDecrement, middleStart, middleStep }) => ({
    multiplier,
    initialStartDecrement,
    middleStart,
    middleStep,
  })),
  [
    { multiplier: 3, initialStartDecrement: 4, middleStart: 17, middleStep: 6 },
    { multiplier: 3, initialStartDecrement: 17, middleStart: 4, middleStep: 6 },
    { multiplier: 10, initialStartDecrement: 18, middleStart: 3, middleStep: 20 },
    { multiplier: 16, initialStartDecrement: 4, middleStart: 17, middleStep: 6 },
    { multiplier: 23, initialStartDecrement: 5, middleStart: 16, middleStep: 20 },
    { multiplier: 23, initialStartDecrement: 18, middleStart: 3, middleStep: 20 },
  ],
);

const distinctTargetClusters = [...new Set(candidates.map((candidate) => candidate.targetCluster))].sort();
assert.deepEqual(distinctTargetClusters, ["AVI252", "BIH252", "NIV252", "OVU252"]);
assert.ok(distinctTargetClusters.includes(fixture.publishedAnswer));
assert.ok(distinctTargetClusters.length > 1);

const publishedOptionMatches = fixture.publishedOptions.filter((option) =>
  distinctTargetClusters.includes(option),
);
assert.deepEqual(publishedOptionMatches, [fixture.publishedAnswer]);

const publishedVector = vectors[1];
assert.equal(applyForwardVector(fixture.inputClusters[1], publishedVector), fixture.outputClusters[1]);
assert.equal(fixture.qlIds.length, 0);

console.log("ANA-CP-009 changing-vector canonicalization audit passed.", {
  anchorCompatibleRecurrences: candidates.length,
  distinctAnchorCompatibleTargets: distinctTargetClusters,
  publishedAnswer: fixture.publishedAnswer,
  publishedOptionMatches,
  verdict: "QUARANTINE_OPTION_DEPENDENT_META_RULE",
  permanentQlIdsAssigned: fixture.qlIds.length,
});
