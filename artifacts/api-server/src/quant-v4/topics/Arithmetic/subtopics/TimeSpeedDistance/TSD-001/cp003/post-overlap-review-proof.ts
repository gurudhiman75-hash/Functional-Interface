import { generateCp003ReviewRows, stableCp003Stringify } from "./runtime";
import { generateCp003PostOverlapReviewRows } from "./post-overlap-review";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const rawRows = generateCp003ReviewRows(3);
const rows = generateCp003PostOverlapReviewRows(3);
assert(rows.length === 66, `Expected 66 post-overlap review rows, received ${rows.length}`);
assert(rawRows.length === rows.length, "Post-overlap remap changed review row count");

for (let index = 0; index < rows.length; index += 1) {
  const raw = rawRows[index];
  const mapped = rows[index];
  const rawLearnerProjection = {
    questionLanguageId: raw.questionLanguageId,
    solveMode: raw.solveMode,
    representation: raw.representation,
    stem: raw.stem,
    options: raw.options,
    answerText: raw.answerText,
    correctIndex: raw.correctIndex,
    explanation: raw.explanation,
    mathematicalFingerprint: raw.mathematicalFingerprint,
  };
  const mappedLearnerProjection = {
    questionLanguageId: mapped.questionLanguageId,
    solveMode: mapped.solveMode,
    representation: mapped.representation,
    stem: mapped.stem,
    options: mapped.options,
    answerText: mapped.answerText,
    correctIndex: mapped.correctIndex,
    explanation: mapped.explanation,
    mathematicalFingerprint: mapped.mathematicalFingerprint,
  };
  assert(stableCp003Stringify(rawLearnerProjection) === stableCp003Stringify(mappedLearnerProjection), `${raw.solveMode}: ownership remap changed learner-facing content`);
  assert(mapped.contentCheckpointId === "TSD-CP-003", `${raw.solveMode}: content checkpoint changed during remap`);
  assert(mapped.permanentQlId === null, `${raw.solveMode}: permanent QL allocated during post-overlap review`);
  assert(mapped.lifecycle.englishFreezeStatus === "UNFROZEN", `${raw.solveMode}: English frozen during post-overlap review`);
}

const authorityKeys = new Set(rows.map((row) => row.authorityKey));
assert(authorityKeys.size === 19, `Expected 19 authority targets represented by CP-003 content, received ${authorityKeys.size}`);

const newRows = rows.filter((row) => row.ownershipDisposition === "NEW_CP003_AUTHORITY");
const mergedRows = rows.filter((row) => row.ownershipDisposition === "MERGED_INTO_NEW_CP003_AUTHORITY");
const priorRows = rows.filter((row) => row.ownershipDisposition === "PRIOR_CHECKPOINT_REPRESENTATION");
assert(newRows.length === 33, `Expected 33 rows generated directly by 11 retained authorities, received ${newRows.length}`);
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
assert(newAuthorityTargets.size === 11, `Expected 11 new CP-003 owner targets, received ${newAuthorityTargets.size}`);
assert(priorAuthorityTargets.size === 8, `Expected 8 distinct prior-checkpoint owner targets, received ${priorAuthorityTargets.size}`);
assert(rows.filter((row) => row.authorityOwnerCheckpointId === "TSD-CP-001").length > 0, "No CP-001 representation extension rows found");
assert(rows.filter((row) => row.authorityOwnerCheckpointId === "TSD-CP-002").length > 0, "No CP-002 representation extension rows found");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_POST_OVERLAP_REVIEW_REMAP",
  reviewRows: rows.length,
  representedAuthorityTargets: authorityKeys.size,
  retainedAuthorityRows: newRows.length,
  withinCp003MergedRows: mergedRows.length,
  priorRepresentationRows: priorRows.length,
  newCp003AuthorityTargets: newAuthorityTargets.size,
  priorRepresentationFamilies: 9,
  distinctPriorAuthorityTargets: priorAuthorityTargets.size,
  learnerProjectionChangedRows: 0,
  permanentQlCount: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
