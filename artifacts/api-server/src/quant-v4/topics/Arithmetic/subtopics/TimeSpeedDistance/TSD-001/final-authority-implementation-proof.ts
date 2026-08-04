import {
  TSD_CP001_SOURCE_CANDIDATES,
} from "./cp001/discovery-registry";
import {
  TSD_CP002_SOURCE_CANDIDATES,
} from "./cp002/discovery-registry";
import {
  finalAuthorityCoverage,
  generateFinalAuthorityReview,
} from "./final-authority-review";
import {
  TSD_FINAL_AUTHORITIES,
  TSD_FINAL_INTERNAL_AUTHORITIES,
  TSD_FINAL_LEARNER_AUTHORITIES,
} from "./final-authority-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(TSD_CP001_SOURCE_CANDIDATES.length === 32, "Unexpected CP-001 source-candidate count");
assert(TSD_CP002_SOURCE_CANDIDATES.length === 34, "Unexpected CP-002 source-candidate count");
assert(TSD_FINAL_AUTHORITIES.length === 42, "Final mathematical-authority count must be 42");
assert(TSD_FINAL_LEARNER_AUTHORITIES.length === 38, "Final learner-authority count must be 38");
assert(TSD_FINAL_INTERNAL_AUTHORITIES.length === 4, "Final internal-QA count must be 4");
assert(new Set(TSD_FINAL_AUTHORITIES.map((entry) => entry.authorityKey)).size === 42, "Duplicate final authority key");
assert(TSD_FINAL_AUTHORITIES.every((entry) => entry.permanentQlId === null), "Permanent QL assigned before final pool and review proof");

const sourceOwners = new Map<string, string[]>();
for (const authority of TSD_FINAL_AUTHORITIES) {
  assert(authority.implementationStatus === "OWNERSHIP_IMPLEMENTED_REVIEW_REMAP_ACTIVE", `${authority.authorityKey}: ownership adapter is not active`);
  assert(authority.sourceCandidates.length > 0, `${authority.authorityKey}: final authority has no source evidence`);
  for (const source of authority.sourceCandidates) {
    sourceOwners.set(source, [...(sourceOwners.get(source) ?? []), authority.authorityKey]);
  }
}
const expectedSources = new Set<string>([
  ...TSD_CP001_SOURCE_CANDIDATES,
  ...TSD_CP002_SOURCE_CANDIDATES,
]);
assert(expectedSources.size === 66, "Expected 66 unique source candidates across CP-001 and CP-002");
assert(sourceOwners.size === expectedSources.size, "Final registry does not own all 66 source candidates");
for (const source of expectedSources) {
  const owners = sourceOwners.get(source) ?? [];
  assert(owners.length === 1, `${source}: expected one final authority owner, received ${owners.join(", ") || "none"}`);
}

const review = generateFinalAuthorityReview();
const coverage = finalAuthorityCoverage(review);
assert(review.length === 111, "Final ownership adapter must preserve all 111 current review records");
assert(new Set(review.map((row) => row.questionLanguageId)).size === review.length, "Duplicate questionLanguageId after authority remap");
assert(review.every((row) => row.permanentQlId === null), "A remapped review row has a premature permanent QL");
assert(review.every((row) => row.reviewStatus === "EDITORIAL_REVIEW_REQUIRED" && row.englishFreezeStatus === "UNFROZEN"), "A remapped review row escaped the reopened lifecycle");
assert(review.every((row) => !row.publiclyPublishable), "A remapped review row became publicly publishable");
assert(coverage.length === 38, "Coverage report must include all 38 learner authorities");
assert(coverage.every((entry) => entry.rowCount > 0), "A final learner authority has no mapped review row");

const directDistance = coverage.find((entry) => entry.authorityKey === "distanceFromSpeedAndTime")!;
assert(directDistance.rowCount === 6, "Direct-distance authority must own its three original rows plus three effective-average rows");
assert(directDistance.representations.includes("OVERALL_AVERAGE_AS_EFFECTIVE_SPEED"), "QL-033 representation was not moved into direct distance");
assert(directDistance.legacyReviewQlIds.includes("TSD-QL-001") && directDistance.legacyReviewQlIds.includes("TSD-QL-033"), "Direct-distance legacy aliases are incomplete");
assert(!TSD_FINAL_AUTHORITIES.some((entry) => entry.authorityKey === "totalDistanceFromAverageAndTime"), "Story-only QL-033 authority still exists");

const referenceDistance = coverage.find((entry) => entry.authorityKey === "referenceTripDistanceAtChangedConditions")!;
assert(referenceDistance.representations.includes("REFERENCE_TRIP_SAME_SPEED"), "Reference-distance same-speed representation missing");
assert(referenceDistance.representations.includes("REFERENCE_TRIP_CHANGED_SPEED"), "Reference-distance changed-speed representation missing");
const referenceTime = coverage.find((entry) => entry.authorityKey === "referenceTripTimeAtChangedConditions")!;
assert(referenceTime.representations.includes("REFERENCE_TRIP_SAME_SPEED"), "Reference-time same-speed representation missing");
assert(referenceTime.representations.includes("REFERENCE_TRIP_CHANGED_SPEED_SAME_DISTANCE"), "Reference-time changed-speed/same-distance representation missing");
assert(referenceTime.representations.includes("REFERENCE_TRIP_CHANGED_SPEED"), "Reference-time combined changed-condition representation missing");

const distanceShare = coverage.find((entry) => entry.authorityKey === "unknownDistanceShareFromAverageSpeed")!;
const timeShare = coverage.find((entry) => entry.authorityKey === "unknownTimeShareFromAverageSpeed")!;
assert(distanceShare.rowCount === 2 && timeShare.rowCount === 1, "Current QL-029 rows were not split by equation as expected");
const distanceRatio = coverage.find((entry) => entry.authorityKey === "distanceRatioFromAverageAndSpeeds")!;
const timeRatio = coverage.find((entry) => entry.authorityKey === "timeRatioFromAverageAndSpeeds")!;
assert(distanceRatio.rowCount === 2 && timeRatio.rowCount === 1, "Current QL-035 rows were not split by equation as expected");

const allocation = coverage.find((entry) => entry.authorityKey === "segmentAllocationFromTotalsAndSpeeds")!;
assert(allocation.representations.includes("FIRST_DISTANCE"), "Allocation first-distance representation missing");
assert(allocation.representations.includes("FIRST_TIME"), "Allocation first-time representation missing");
assert(allocation.representations.includes("SECOND_DISTANCE"), "Allocation second-distance representation missing");
assert(!allocation.representations.includes("SECOND_TIME"), "Unexpected second-time representation; update documented gap set");

const documentedPoolGaps = Object.freeze([
  Object.freeze({ authorityKey: "unknownTimeShareFromAverageSpeed", gap: "Only one distinct review state; expand to multiple time-share cases." }),
  Object.freeze({ authorityKey: "timeRatioFromAverageAndSpeeds", gap: "Only one distinct review state; expand to multiple time-ratio cases." }),
  Object.freeze({ authorityKey: "segmentAllocationFromTotalsAndSpeeds", gap: "SECOND_TIME requested-quantity representation is absent." }),
]);

console.log(JSON.stringify({
  status: "PASS_WITH_DOCUMENTED_POOL_GAPS",
  phase: "FINAL_AUTHORITY_OWNERSHIP_IMPLEMENTATION",
  sourceCandidatesOwnedExactlyOnce: sourceOwners.size,
  finalMathematicalAuthorities: TSD_FINAL_AUTHORITIES.length,
  finalLearnerAuthorities: TSD_FINAL_LEARNER_AUTHORITIES.length,
  finalInternalQaAuthorities: TSD_FINAL_INTERNAL_AUTHORITIES.length,
  remappedReviewRows: review.length,
  permanentQlIdsAssigned: 0,
  documentedPoolGaps,
  englishFreezeStatus: "UNFROZEN",
  questionBankStored: 0,
  testEligible: 0,
  publiclyPublishable: 0,
}, null, 2));
