import {
  TSD_FINAL_INTERNAL_AUTHORITIES,
  TSD_FINAL_LEARNER_AUTHORITIES,
} from "../final-authority-registry";
import {
  TSD_CP003_INTERNAL_AUTHORITIES,
  TSD_CP003_LEARNER_AUTHORITIES,
  TSD_CP003_SOURCE_CANDIDATES,
} from "./discovery-registry";
import {
  TSD_CP003_NEW_AUTHORITY_CANDIDATES,
  TSD_CP003_POST_OVERLAP_OWNERSHIP,
  TSD_CP003_PRIOR_REPRESENTATIONS,
  TSD_CP003_REJECTED_LEARNER_AUTHORITIES,
  TSD_POST_CP003_CANDIDATE_COUNTS,
} from "./post-overlap-authority-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(TSD_CP003_POST_OVERLAP_OWNERSHIP.length === 22, "Expected all 22 learner discovery authorities to receive post-overlap ownership");
assert(new Set(TSD_CP003_POST_OVERLAP_OWNERSHIP.map((entry) => entry.solveMode)).size === 22, "Duplicate post-overlap learner solve-mode ownership");

const newRows = TSD_CP003_POST_OVERLAP_OWNERSHIP.filter((entry) => entry.disposition === "NEW_CP003_AUTHORITY");
const mergedRows = TSD_CP003_POST_OVERLAP_OWNERSHIP.filter((entry) => entry.disposition === "MERGED_INTO_NEW_CP003_AUTHORITY");
const priorRows = TSD_CP003_POST_OVERLAP_OWNERSHIP.filter((entry) => entry.disposition === "PRIOR_CHECKPOINT_REPRESENTATION");
const rejectedRows = TSD_CP003_POST_OVERLAP_OWNERSHIP.filter((entry) => entry.disposition === "REJECTED_AS_STANDALONE_LEARNER_AUTHORITY");
assert(newRows.length === 10, `Expected 10 retained CP-003 authorities, received ${newRows.length}`);
assert(mergedRows.length === 2, `Expected 2 within-CP003 merges, received ${mergedRows.length}`);
assert(priorRows.length === 9, `Expected 9 prior-checkpoint representations, received ${priorRows.length}`);
assert(rejectedRows.length === 1, `Expected 1 rejected standalone learner authority, received ${rejectedRows.length}`);
assert(rejectedRows[0]?.solveMode === "scheduleBuffer", `Expected scheduleBuffer to be rejected, received ${rejectedRows[0]?.solveMode ?? "none"}`);
assert(TSD_CP003_REJECTED_LEARNER_AUTHORITIES.length === 1, "Rejected learner registry must contain exactly one authority");

assert(TSD_CP003_NEW_AUTHORITY_CANDIDATES.length === 10, "Post-overlap candidate registry must contain exactly 10 new learner authorities");
assert(new Set(TSD_CP003_NEW_AUTHORITY_CANDIDATES.map((entry) => entry.authorityKey)).size === 10, "Duplicate new CP-003 authority key");
assert(!TSD_CP003_NEW_AUTHORITY_CANDIDATES.some((entry) => entry.authorityKey === "scheduleBuffer"), "scheduleBuffer leaked into the CP-003 learner authority candidate registry");

const priorKeys = new Set(TSD_FINAL_LEARNER_AUTHORITIES.map((entry) => entry.authorityKey));
for (const candidate of TSD_CP003_NEW_AUTHORITY_CANDIDATES) {
  assert(!priorKeys.has(candidate.authorityKey), `${candidate.authorityKey}: new CP-003 authority collides with finalized CP-001/002 authority`);
  assert(candidate.permanentQlId === null, `${candidate.authorityKey}: permanent QL allocated before freeze review`);
  assert(candidate.englishFreezeStatus === "UNFROZEN", `${candidate.authorityKey}: English frozen before approval`);
  assert(candidate.underlyingSolveModes.length >= 1, `${candidate.authorityKey}: missing underlying solve modes`);
  assert(candidate.sourceCandidates.length >= 1, `${candidate.authorityKey}: missing source candidates`);
}

for (const representation of TSD_CP003_PRIOR_REPRESENTATIONS) {
  assert(priorKeys.has(representation.targetAuthority), `${representation.solveMode}: prior representation target ${representation.targetAuthority} does not exist`);
}

const expectedMerges = new Map<string, string>([
  ["distanceFromEarlyLatePair", "distanceFromSpeedTimeDifference"],
  ["startTimeShiftForSameArrival", "timeGainLossFromSpeedChange"],
]);
for (const [solveMode, target] of expectedMerges) {
  const ownership = TSD_CP003_POST_OVERLAP_OWNERSHIP.find((entry) => entry.solveMode === solveMode);
  assert(ownership?.disposition === "MERGED_INTO_NEW_CP003_AUTHORITY", `${solveMode}: expected within-CP003 merge`);
  assert(ownership.targetAuthority === target, `${solveMode}: expected merge target ${target}, received ${ownership.targetAuthority}`);
  const targetCandidate = TSD_CP003_NEW_AUTHORITY_CANDIDATES.find((entry) => entry.authorityKey === target);
  assert(targetCandidate?.underlyingSolveModes.includes(solveMode), `${solveMode}: target candidate does not own merged solve mode`);
}

const learnerSourceCandidates = new Set(
  TSD_CP003_LEARNER_AUTHORITIES.flatMap((entry) => entry.sourceCandidates),
);
const acceptedLearnerSources = new Set([
  ...TSD_CP003_NEW_AUTHORITY_CANDIDATES.flatMap((entry) => entry.sourceCandidates),
  ...TSD_CP003_PRIOR_REPRESENTATIONS.flatMap((entry) => entry.sourceCandidates),
]);
const rejectedLearnerSources = new Set(TSD_CP003_REJECTED_LEARNER_AUTHORITIES.flatMap((entry) => entry.sourceCandidates));
assert(learnerSourceCandidates.size === 33, `Expected 33 learner source candidates, received ${learnerSourceCandidates.size}`);
assert(acceptedLearnerSources.size === 32, `Expected 32 accepted learner source candidates, received ${acceptedLearnerSources.size}`);
assert(rejectedLearnerSources.size === 1, `Expected one rejected learner source candidate, received ${rejectedLearnerSources.size}`);
assert(rejectedLearnerSources.has("findScheduleBuffer"), "findScheduleBuffer must remain recorded as rejected discovery evidence");
for (const source of acceptedLearnerSources) {
  assert(!rejectedLearnerSources.has(source), `${source}: source cannot be both accepted and rejected`);
}

const internalSources = new Set(TSD_CP003_INTERNAL_AUTHORITIES.flatMap((entry) => entry.sourceCandidates));
assert(internalSources.size === 2, `Expected two CP-003 internal QA source candidates, received ${internalSources.size}`);
const allDiscoverySources = new Set([...acceptedLearnerSources, ...rejectedLearnerSources, ...internalSources]);
assert(allDiscoverySources.size === TSD_CP003_SOURCE_CANDIDATES.length, "Not all 35 CP-003 discovery source candidates remain accounted for after consolidation");
for (const source of TSD_CP003_SOURCE_CANDIDATES) {
  assert(allDiscoverySources.has(source), `${source}: unaccounted for after consolidation`);
}

assert(TSD_POST_CP003_CANDIDATE_COUNTS.priorLearnerAuthorities === 38, `Expected 38 finalized prior learner authorities, received ${TSD_POST_CP003_CANDIDATE_COUNTS.priorLearnerAuthorities}`);
assert(TSD_POST_CP003_CANDIDATE_COUNTS.newCp003LearnerAuthorities === 10, "Expected 10 new CP-003 learner authorities");
assert(TSD_POST_CP003_CANDIDATE_COUNTS.totalLearnerAuthorities === 48, `Expected 48 learner authority candidates through CP-003, received ${TSD_POST_CP003_CANDIDATE_COUNTS.totalLearnerAuthorities}`);
assert(TSD_POST_CP003_CANDIDATE_COUNTS.rejectedCp003LearnerAuthorities === 1, "Expected one rejected CP-003 learner authority");
assert(TSD_POST_CP003_CANDIDATE_COUNTS.priorInternalAuthorities === TSD_FINAL_INTERNAL_AUTHORITIES.length, "Prior internal-authority count mismatch");
assert(TSD_POST_CP003_CANDIDATE_COUNTS.cp003InternalAuthorities === 2, "Expected two CP-003 internal QA authorities");
assert(TSD_POST_CP003_CANDIDATE_COUNTS.totalInternalAuthorities === 6, `Expected six internal authorities through CP-003, received ${TSD_POST_CP003_CANDIDATE_COUNTS.totalInternalAuthorities}`);
assert(TSD_POST_CP003_CANDIDATE_COUNTS.totalMathematicalAuthorities === 54, `Expected 54 accepted mathematical authority candidates through CP-003, received ${TSD_POST_CP003_CANDIDATE_COUNTS.totalMathematicalAuthorities}`);

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_POST_OVERLAP_AUTHORITY_BOUNDARY",
  originalLearnerDiscoveryAuthorities: TSD_CP003_LEARNER_AUTHORITIES.length,
  retainedNewCp003Authorities: newRows.length,
  mergedWithinCp003: mergedRows.length,
  absorbedAsPriorRepresentations: priorRows.length,
  rejectedStandaloneLearnerAuthorities: rejectedRows.length,
  acceptedLearnerSourceCandidates: acceptedLearnerSources.size,
  rejectedLearnerSourceCandidates: rejectedLearnerSources.size,
  internalSourceCandidates: internalSources.size,
  accountedDiscoverySourceCandidates: allDiscoverySources.size,
  learnerAuthorityCandidatesThroughCp003: TSD_POST_CP003_CANDIDATE_COUNTS.totalLearnerAuthorities,
  internalAuthorityCandidatesThroughCp003: TSD_POST_CP003_CANDIDATE_COUNTS.totalInternalAuthorities,
  acceptedMathematicalAuthorityCandidatesThroughCp003: TSD_POST_CP003_CANDIDATE_COUNTS.totalMathematicalAuthorities,
  permanentQlCount: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
