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
assert(review.length === 153, `Final authority review must contain 153 approved-candidate records, received ${review.length}`);
assert(new Set(review.map((row) => row.questionLanguageId)).size === review.length, "Duplicate questionLanguageId after authority remap and pool expansion");
assert(review.every((row) => row.sourceQuestion.validation.valid), "An invalid source question entered the final authority review");
assert(review.every((row) => row.sourceQuestion.difficulty.status === "EDITORIALLY_CALIBRATED"), "An uncalibrated source question entered the final authority review");
assert(review.every((row) => row.permanentQlId === null), "A remapped review row has a premature permanent QL");
assert(review.every((row) => row.reviewStatus === "EDITORIAL_REVIEW_REQUIRED" && row.englishFreezeStatus === "UNFROZEN"), "The source review inventory was mutated instead of frozen through the approved wrapper");
assert(review.every((row) => !row.publiclyPublishable), "A remapped review row became publicly publishable");
assert(review.every((row) => row.sourceQuestion.lifecycle.questionBankStatus === "NOT_STORED"), "Question Bank storage was enabled in the source review inventory");
assert(review.every((row) => row.sourceQuestion.lifecycle.testEligibility === "INELIGIBLE"), "Test eligibility was enabled in the source review inventory");
assert(coverage.length === 38, "Coverage report must include all 38 learner authorities");
const missingCoverage = coverage.filter((entry) => entry.rowCount === 0).map((entry) => entry.authorityKey);
assert(missingCoverage.length === 0, `Final learner authorities with no mapped review row: ${missingCoverage.join(", ")}`);

const cp001Rows = review.filter((row) => row.finalCheckpointId === "TSD-CP-001").length;
const cp002Rows = review.filter((row) => row.finalCheckpointId === "TSD-CP-002").length;
assert(cp001Rows === 80 && cp002Rows === 73, `Final checkpoint distribution changed: ${cp001Rows}/${cp002Rows}`);
const correctPositions = [0, 1, 2, 3].map((position) => review.filter((row) => row.sourceQuestion.correctIndex === position).length);
assert(correctPositions.join(",") === "37,37,41,38", `Final answer-position distribution changed: ${correctPositions.join(",")}`);

const directDistance = coverage.find((entry) => entry.authorityKey === "distanceFromSpeedAndTime")!;
assert(directDistance.rowCount >= 6, "Direct-distance authority lost its original/effective-average coverage");
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
assert(distanceShare.rowCount >= 2, "Distance-share authority lost its distinct source states");
assert(timeShare.rowCount >= 3, "Time-share authority lost its original/supplemental states");
assert(timeShare.representations.includes("TIME_SHARE"), "Original time-share representation is missing");
assert(timeShare.representations.includes("TIME_SHARE_SUPPLEMENTAL_50_PERCENT"), "First supplemental time-share representation is missing");
assert(timeShare.representations.includes("TIME_SHARE_SUPPLEMENTAL_25_PERCENT"), "Second supplemental time-share representation is missing");

const distanceRatio = coverage.find((entry) => entry.authorityKey === "distanceRatioFromAverageAndSpeeds")!;
const timeRatio = coverage.find((entry) => entry.authorityKey === "timeRatioFromAverageAndSpeeds")!;
assert(distanceRatio.rowCount >= 2, "Distance-ratio authority lost its distinct source states");
assert(timeRatio.rowCount >= 3, "Time-ratio authority lost its original/supplemental states");
assert(timeRatio.representations.includes("TIME_RATIO_SUPPLEMENTAL_EQUAL"), "Equal-time supplemental ratio is missing");
assert(timeRatio.representations.includes("TIME_RATIO_SUPPLEMENTAL_ONE_TO_THREE"), "One-to-three supplemental ratio is missing");

const allocation = coverage.find((entry) => entry.authorityKey === "segmentAllocationFromTotalsAndSpeeds")!;
for (const representation of ["FIRST_DISTANCE", "SECOND_DISTANCE", "FIRST_TIME", "SECOND_TIME"] as const) {
  assert(allocation.representations.includes(representation), `Allocation representation ${representation} is missing`);
}
assert(allocation.rowCount >= 4, "Allocation authority lost one of its requested-quantity states");

console.log(JSON.stringify({
  status: "PASS",
  phase: "FINAL_AUTHORITY_OWNERSHIP_AND_APPROVED_CANDIDATE_COMPATIBILITY",
  sourceCandidatesOwnedExactlyOnce: sourceOwners.size,
  finalMathematicalAuthorities: TSD_FINAL_AUTHORITIES.length,
  finalLearnerAuthorities: TSD_FINAL_LEARNER_AUTHORITIES.length,
  finalInternalQaAuthorities: TSD_FINAL_INTERNAL_AUTHORITIES.length,
  finalReviewRows: review.length,
  finalCheckpointCounts: { cp001: cp001Rows, cp002: cp002Rows },
  correctPositions,
  missingLearnerAuthorityCoverage: 0,
  permanentQlIdsAssigned: 0,
  sourceEnglishFreezeStatus: "UNFROZEN",
  approvedFreezeImplementedByWrapper: true,
  questionBankStored: 0,
  testEligible: 0,
  publiclyPublishable: 0,
}, null, 2));
