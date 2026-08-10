import { TSD_CP003_POST_OVERLAP_OWNERSHIP } from "./post-overlap-authority-registry";
import { generateCp003PostOverlapReviewRows } from "./post-overlap-review";
import {
  TSD_CP003_FINAL_NEW_AUTHORITY_CANDIDATES,
  TSD_CP003_FINAL_OWNERSHIP_CANDIDATE_SUMMARY,
} from "./final-ownership-candidate";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const candidates = TSD_CP003_FINAL_NEW_AUTHORITY_CANDIDATES;
assert(candidates.length === 10, `Expected 10 new CP-003 authority candidates, received ${candidates.length}`);
assert(new Set(candidates.map((candidate) => candidate.authorityKey)).size === 10, "Duplicate final CP-003 authority candidate");
assert(!candidates.some((candidate) => candidate.authorityKey === "scheduleBuffer"), "Rejected scheduleBuffer leaked into final ownership candidates");

const expectedUnderlyingModes: Readonly<Record<string, readonly string[]>> = Object.freeze({
  timeGainLossFromSpeedChange: ["timeGainLossFromSpeedChange", "startTimeShiftForSameArrival"],
  distanceFromSpeedTimeDifference: ["distanceFromSpeedTimeDifference", "distanceFromEarlyLatePair"],
  speedFromFixedRouteTimeDifference: ["speedFromFixedRouteTimeDifference"],
  usualSpeedFromEarlyLatePair: ["usualSpeedFromEarlyLatePair"],
  numberOfStopsFromOverallDelay: ["numberOfStopsFromOverallDelay"],
  delayFromRegularStops: ["delayFromRegularStops"],
  restTimeInRepeatedTravelRestCycle: ["restTimeInRepeatedTravelRestCycle"],
  totalTimeWithRegularStops: ["totalTimeWithRegularStops"],
  lostTimeDurationFromScheduleRecovery: ["lostTimeDurationFromScheduleRecovery"],
  arrivalShiftFromDepartureAndSpeedChanges: ["arrivalShiftFromDepartureAndSpeedChanges"],
});

for (const candidate of candidates) {
  const expected = expectedUnderlyingModes[candidate.authorityKey];
  assert(expected, `${candidate.authorityKey}: unexpected final CP-003 authority candidate`);
  assert(candidate.ownershipStatus === "FINAL_MERGE_SPLIT_CANDIDATE", `${candidate.authorityKey}: ownership candidate status changed`);
  assert(candidate.permanentQlId === null, `${candidate.authorityKey}: permanent QL allocated before final approval`);
  assert(candidate.englishFreezeStatus === "UNFROZEN", `${candidate.authorityKey}: English frozen before final approval`);
  assert(candidate.underlyingSolveModes.length === expected.length, `${candidate.authorityKey}: unexpected underlying solve-mode count`);
  assert(new Set(candidate.underlyingSolveModes).size === candidate.underlyingSolveModes.length, `${candidate.authorityKey}: duplicate underlying solve mode`);
  for (const mode of expected) assert(candidate.underlyingSolveModes.includes(mode), `${candidate.authorityKey}: expected underlying solve mode ${mode} missing`);
}

const ownershipCounts = {
  retained: TSD_CP003_POST_OVERLAP_OWNERSHIP.filter((entry) => entry.disposition === "NEW_CP003_AUTHORITY").length,
  merged: TSD_CP003_POST_OVERLAP_OWNERSHIP.filter((entry) => entry.disposition === "MERGED_INTO_NEW_CP003_AUTHORITY").length,
  prior: TSD_CP003_POST_OVERLAP_OWNERSHIP.filter((entry) => entry.disposition === "PRIOR_CHECKPOINT_REPRESENTATION").length,
  rejected: TSD_CP003_POST_OVERLAP_OWNERSHIP.filter((entry) => entry.disposition === "REJECTED_AS_STANDALONE_LEARNER_AUTHORITY").length,
};
assert(ownershipCounts.retained === 10, `Expected 10 retained discovery modes, received ${ownershipCounts.retained}`);
assert(ownershipCounts.merged === 2, `Expected 2 within-CP003 merged discovery modes, received ${ownershipCounts.merged}`);
assert(ownershipCounts.prior === 9, `Expected 9 prior-authority representation families, received ${ownershipCounts.prior}`);
assert(ownershipCounts.rejected === 1, `Expected 1 rejected learner family, received ${ownershipCounts.rejected}`);

const rows = generateCp003PostOverlapReviewRows(3);
const cp003OwnedRows = rows.filter((row) => row.authorityOwnerCheckpointId === "TSD-CP-003");
assert(cp003OwnedRows.length === 36, `Expected 36 accepted rows owned by new CP-003 authorities, received ${cp003OwnedRows.length}`);
assert(new Set(cp003OwnedRows.map((row) => row.authorityKey)).size === 10, "Accepted CP-003-owned rows do not cover all 10 final authority candidates");
for (const row of cp003OwnedRows) {
  assert(expectedUnderlyingModes[row.authorityKey]?.includes(row.solveMode), `${row.solveMode}: accepted row is not owned by its declared final authority candidate`);
  assert(row.difficulty.status === "EDITORIALLY_CALIBRATED", `${row.solveMode}: accepted final-candidate row lacks calibrated difficulty`);
  assert(row.validation.valid, `${row.solveMode}: invalid row entered final ownership candidate review`);
  assert(row.permanentQlId === null, `${row.solveMode}: QL allocated during candidate review`);
}

assert(TSD_CP003_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.newCp003LearnerAuthorities === 10, "Summary new-authority count mismatch");
assert(TSD_CP003_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.mergedDiscoveryModes === 2, "Summary merge count mismatch");
assert(TSD_CP003_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.approvedPriorRepresentationFamilies === 9, "Summary representation-family count mismatch");
assert(TSD_CP003_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.distinctPriorRepresentationTargets === 8, "Summary prior-target count mismatch");
assert(TSD_CP003_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.rejectedStandaloneLearnerAuthorities === 1, "Summary rejection count mismatch");
assert(TSD_CP003_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.permanentQlCount === 0, "Permanent QL count changed during candidate review");
assert(TSD_CP003_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.englishFreezeStatus === "UNFROZEN", "English frozen during candidate review");
assert(TSD_CP003_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.questionBankStatus === "NOT_STORED", "Question Bank storage enabled during candidate review");
assert(TSD_CP003_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.testEligibility === "INELIGIBLE", "Test eligibility enabled during candidate review");
assert(TSD_CP003_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.publiclyPublishable === false, "Public delivery enabled during candidate review");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_FINAL_OWNERSHIP_CANDIDATE",
  newCp003AuthorityCandidates: candidates.length,
  mergedDiscoveryModes: ownershipCounts.merged,
  approvedPriorRepresentationFamilies: ownershipCounts.prior,
  rejectedStandaloneLearnerAuthorities: ownershipCounts.rejected,
  cp003OwnedAcceptedRows: cp003OwnedRows.length,
  permanentQlCount: 0,
  englishFreezeStatus: "UNFROZEN",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));