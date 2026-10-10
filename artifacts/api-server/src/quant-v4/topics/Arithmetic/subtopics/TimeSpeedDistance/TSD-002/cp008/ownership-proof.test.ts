import { TSD_CP008_AUTHORITY_OVERLAP_AUDIT, TSD_CP008_OVERLAP_COUNTS } from "./authority-overlap-audit";
import { TSD_CP008_DISCOVERY_AUTHORITY, TSD_CP008_DISCOVERY_CANDIDATES } from "./discovery-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-008 ownership proof failed: ${message}`);
}

assert(TSD_CP008_DISCOVERY_AUTHORITY.checkpointId === "TSD-CP-008", "checkpoint identity changed");
assert(TSD_CP008_DISCOVERY_AUTHORITY.chapterId === "TSD-002", "chapter identity changed");
assert(TSD_CP008_DISCOVERY_CANDIDATES.length === 37, "expected 37 discovery candidates");
assert(TSD_CP008_AUTHORITY_OVERLAP_AUDIT.length === 37, "every discovery candidate needs one overlap decision");
assert(new Set(TSD_CP008_DISCOVERY_CANDIDATES).size === 37, "discovery candidates are not unique");
assert(new Set(TSD_CP008_AUTHORITY_OVERLAP_AUDIT.map((entry) => entry.solveMode)).size === 37, "overlap decisions are not unique");

const accounted = TSD_CP008_OVERLAP_COUNTS.newLearnerAuthorities
  + TSD_CP008_OVERLAP_COUNTS.mergedCoreModes
  + TSD_CP008_OVERLAP_COUNTS.heldCrossCheckpointModes
  + TSD_CP008_OVERLAP_COUNTS.heldRepresentationCandidates
  + TSD_CP008_OVERLAP_COUNTS.internalQaModes;
assert(accounted === 37, `overlap decisions account for ${accounted} candidates instead of 37`);
assert(TSD_CP008_OVERLAP_COUNTS.newLearnerAuthorities === 12, "provisional learner-authority count changed");
assert(TSD_CP008_OVERLAP_COUNTS.mergedCoreModes === 12, "merged-mode count changed");
assert(TSD_CP008_OVERLAP_COUNTS.heldCrossCheckpointModes === 2, "cross-checkpoint hold count changed");
assert(TSD_CP008_OVERLAP_COUNTS.heldRepresentationCandidates === 7, "representation hold count changed");
assert(TSD_CP008_OVERLAP_COUNTS.internalQaModes === 4, "internal-QA count changed");

for (const mode of ["findCrossingAfterOneTrainStops", "findCrossingAfterOneTrainChangesSpeed"] as const) {
  const entry = TSD_CP008_AUTHORITY_OVERLAP_AUDIT.find((candidate) => candidate.solveMode === mode);
  assert(entry?.decision === "HOLD_CROSS_CHECKPOINT_OVERLAP", `${mode}: expected CP012 hold`);
  assert(entry.targetAuthority === "TSD_CP012_VARIABLE_MULTI_STAGE_MOTION", `${mode}: expected CP012 target`);
}

assert(TSD_CP008_DISCOVERY_AUTHORITY.permanentQlCount === 0, "CP008 allocated permanent QLs before source/executable approval");
assert(TSD_CP008_DISCOVERY_AUTHORITY.nextAvailableQl === "TSD-QL-095", "next QL changed before allocation approval");
assert(TSD_CP008_DISCOVERY_AUTHORITY.englishFreezeStatus === "UNFROZEN", "English froze prematurely");
assert(!TSD_CP008_DISCOVERY_AUTHORITY.questionStudioEnabled, "Question Studio enabled prematurely");
assert(TSD_CP008_DISCOVERY_AUTHORITY.questionBankStatus === "NOT_STORED", "Question Bank opened prematurely");
assert(TSD_CP008_DISCOVERY_AUTHORITY.testEligibility === "INELIGIBLE", "test eligibility opened prematurely");
assert(!TSD_CP008_DISCOVERY_AUTHORITY.publiclyPublishable, "public publication opened prematurely");

console.log("TSD-CP-008 DISCOVERY OWNERSHIP PROOF: PASS");
console.log(JSON.stringify({
  discoveryCandidates: TSD_CP008_DISCOVERY_CANDIDATES.length,
  provisionalLearnerAuthorities: TSD_CP008_OVERLAP_COUNTS.newLearnerAuthorities,
  mergedCoreModes: TSD_CP008_OVERLAP_COUNTS.mergedCoreModes,
  crossCheckpointHolds: TSD_CP008_OVERLAP_COUNTS.heldCrossCheckpointModes,
  representationHolds: TSD_CP008_OVERLAP_COUNTS.heldRepresentationCandidates,
  internalQaModes: TSD_CP008_OVERLAP_COUNTS.internalQaModes,
  permanentQlCount: TSD_CP008_DISCOVERY_AUTHORITY.permanentQlCount,
  nextAvailableQl: TSD_CP008_DISCOVERY_AUTHORITY.nextAvailableQl,
  questionStudioEnabled: TSD_CP008_DISCOVERY_AUTHORITY.questionStudioEnabled,
}, null, 2));
