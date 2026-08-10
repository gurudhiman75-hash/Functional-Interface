import { generateCp003PostOverlapReviewRows } from "./post-overlap-review";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const rows = generateCp003PostOverlapReviewRows(3);
assert(rows.length === 63, `Expected 63 accepted post-overlap review rows, received ${rows.length}`);
assert(!rows.some((row) => row.solveMode === "scheduleBuffer"), "Rejected scheduleBuffer rows leaked into the accepted CP-003 editorial review");
assert(!rows.some((row) => row.ownershipDisposition === "REJECTED_AS_STANDALONE_LEARNER_AUTHORITY"), "Rejected authority disposition leaked into accepted review rows");

for (const row of rows) {
  assert(row.validation.valid, `${row.solveMode}: invalid learner row in post-overlap review: ${row.validation.errors.join("; ")}`);
  assert(row.contentCheckpointId === "TSD-CP-003", `${row.solveMode}: content checkpoint changed during remap`);
  assert(row.permanentQlId === null, `${row.solveMode}: permanent QL allocated during post-overlap review`);
  assert(row.lifecycle.englishFreezeStatus === "UNFROZEN", `${row.solveMode}: English frozen during post-overlap review`);

  if (row.solveMode === "timeGainLossFromSpeedChange" && row.representation === "SLOWER_DELAY") {
    assert(!row.stem.includes("speed increases from"), `${row.questionLanguageId}: slower-speed stem falsely says speed increases`);
    assert(!row.stem.includes("time is saved"), `${row.questionLanguageId}: slower-speed stem falsely says time is saved`);
    assert(!row.stem.includes("reduction in journey time"), `${row.questionLanguageId}: slower-speed stem falsely asks for a reduction`);
    assert(!row.stem.includes("journey time decrease"), `${row.questionLanguageId}: slower-speed stem falsely asks for a decrease`);
  }

  if (row.solveMode === "startTimeShiftForSameArrival") {
    assert(!row.stem.includes("earlier or later"), `${row.questionLanguageId}: same-arrival stem leaves the shift direction ambiguous`);
    if (row.representation === "LATER_START_SAME_ARRIVAL") {
      assert(row.stem.toLowerCase().includes("later"), `${row.questionLanguageId}: faster same-arrival state must ask how much later to start`);
    }
    if (row.representation === "EARLIER_START_SAME_ARRIVAL") {
      assert(row.stem.toLowerCase().includes("earlier"), `${row.questionLanguageId}: slower same-arrival state must ask how much earlier to start`);
    }
  }

  if (row.solveMode === "arrivalShiftFromDepartureAndSpeedChanges") {
    assert(row.stem.toLowerCase().includes("magnitude"), `${row.questionLanguageId}: arrival-shift stem must explicitly ask for magnitude because the answer contract is unsigned duration`);
  }
}

const bySolveMode = new Map<string, typeof rows[number][]>();
for (const row of rows) {
  const group = bySolveMode.get(row.solveMode) ?? [];
  group.push(row);
  bySolveMode.set(row.solveMode, group);
}
assert(bySolveMode.size === 21, `Expected 21 accepted discovery solve modes, received ${bySolveMode.size}`);
for (const [solveMode, group] of bySolveMode) {
  assert(group.length === 3, `${solveMode}: expected three accepted review rows, received ${group.length}`);
  assert(new Set(group.map((row) => row.stem)).size === 3, `${solveMode}: review stems are not all distinct`);
  assert(new Set(group.map((row) => row.mathematicalFingerprint)).size === 3, `${solveMode}: mathematical fingerprints are not all distinct`);
  assert(new Set(group.map((row) => row.answerText)).size === 3, `${solveMode}: answers are not all distinct`);
}

const authorityKeys = new Set(rows.map((row) => row.authorityKey));
assert(authorityKeys.size === 18, `Expected 18 authority targets represented by accepted CP-003 content, received ${authorityKeys.size}`);

const newRows = rows.filter((row) => row.ownershipDisposition === "NEW_CP003_AUTHORITY");
const mergedRows = rows.filter((row) => row.ownershipDisposition === "MERGED_INTO_NEW_CP003_AUTHORITY");
const priorRows = rows.filter((row) => row.ownershipDisposition === "PRIOR_CHECKPOINT_REPRESENTATION");
assert(newRows.length === 30, `Expected 30 rows generated directly by 10 retained authorities, received ${newRows.length}`);
assert(mergedRows.length === 6, `Expected 6 rows from two merged discovery modes, received ${mergedRows.length}`);
assert(priorRows.length === 27, `Expected 27 prior-authority representation rows, received ${priorRows.length}`);

const targetCounts = new Map<string, number>();
for (const row of rows) targetCounts.set(row.authorityKey, (targetCounts.get(row.authorityKey) ?? 0) + 1);
assert(targetCounts.get("timeGainLossFromSpeedChange") === 6, "timeGainLossFromSpeedChange must own both native and same-arrival shift rows");
assert(targetCounts.get("distanceFromSpeedTimeDifference") === 6, "distanceFromSpeedTimeDifference must own both native and early/late distance rows");
assert(targetCounts.get("segmentAllocationFromTotalsAndSpeeds") === 6, "segmentAllocationFromTotalsAndSpeeds must own both change-point and walking/riding rows");
for (const [authorityKey, count] of targetCounts) {
  if (
    authorityKey === "timeGainLossFromSpeedChange"
    || authorityKey === "distanceFromSpeedTimeDifference"
    || authorityKey === "segmentAllocationFromTotalsAndSpeeds"
  ) continue;
  assert(count === 3, `${authorityKey}: expected three CP-003 review rows, received ${count}`);
}

const newAuthorityTargets = new Set(rows.filter((row) => row.authorityOwnerCheckpointId === "TSD-CP-003").map((row) => row.authorityKey));
const priorAuthorityTargets = new Set(rows.filter((row) => row.authorityOwnerCheckpointId !== "TSD-CP-003").map((row) => row.authorityKey));
assert(newAuthorityTargets.size === 10, `Expected 10 new CP-003 owner targets, received ${newAuthorityTargets.size}`);
assert(priorAuthorityTargets.size === 8, `Expected 8 distinct prior-checkpoint owner targets, received ${priorAuthorityTargets.size}`);
assert(rows.filter((row) => row.authorityOwnerCheckpointId === "TSD-CP-001").length > 0, "No CP-001 representation extension rows found");
assert(rows.filter((row) => row.authorityOwnerCheckpointId === "TSD-CP-002").length > 0, "No CP-002 representation extension rows found");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_POST_OVERLAP_REVIEW_REMAP",
  acceptedReviewRows: rows.length,
  acceptedDiscoverySolveModes: bySolveMode.size,
  representedAuthorityTargets: authorityKeys.size,
  retainedAuthorityRows: newRows.length,
  withinCp003MergedRows: mergedRows.length,
  priorRepresentationRows: priorRows.length,
  newCp003AuthorityTargets: newAuthorityTargets.size,
  priorRepresentationFamilies: 9,
  distinctPriorAuthorityTargets: priorAuthorityTargets.size,
  rejectedScheduleBufferRows: 3,
  answerDiversityPerAcceptedSolveMode: 3,
  contradictorySlowerSpeedStems: 0,
  ambiguousSameArrivalShiftStems: 0,
  unsignedArrivalShiftStemsWithoutMagnitude: 0,
  permanentQlCount: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
