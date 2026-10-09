import { TSD_CP007_AUTHORITY_OVERLAP_AUDIT, TSD_CP007_OVERLAP_COUNTS } from "./authority-overlap-audit";
import { TSD_CP007_DISCOVERY_AUTHORITY, TSD_CP007_DISCOVERY_CANDIDATES } from "./discovery-registry";
import {
  TSD_CP007_FINAL_NEW_AUTHORITY_CANDIDATES,
  TSD_CP007_FINAL_OWNERSHIP_CANDIDATE_SUMMARY,
} from "./final-ownership-candidate";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-007 ownership proof failed: ${message}`);
}

const originalModes = new Set(TSD_CP007_DISCOVERY_CANDIDATES);
const auditedModes = new Set(TSD_CP007_AUTHORITY_OVERLAP_AUDIT.map((entry) => entry.solveMode));
const retainedAuthorityKeys = new Set(TSD_CP007_FINAL_NEW_AUTHORITY_CANDIDATES.map((entry) => entry.authorityKey));

assert(originalModes.size === 33, `expected 33 unique discovery modes, found ${originalModes.size}`);
assert(auditedModes.size === originalModes.size, `expected all 33 discovery modes to be audited, found ${auditedModes.size}`);
for (const mode of originalModes) {
  assert(auditedModes.has(mode), `${mode} is missing from the overlap audit`);
}

const classifiedTotal =
  TSD_CP007_OVERLAP_COUNTS.newLearnerAuthorities +
  TSD_CP007_OVERLAP_COUNTS.mergedCoreModes +
  TSD_CP007_OVERLAP_COUNTS.heldCrossCheckpointModes +
  TSD_CP007_OVERLAP_COUNTS.heldRepresentationCandidates +
  TSD_CP007_OVERLAP_COUNTS.internalQaModes;
assert(classifiedTotal === 33, `classification partition must total 33, received ${classifiedTotal}`);
assert(TSD_CP007_OVERLAP_COUNTS.newLearnerAuthorities === 11, "expected 11 retained learner authorities");
assert(TSD_CP007_OVERLAP_COUNTS.mergedCoreModes === 12, "expected 12 merged core modes");
assert(TSD_CP007_OVERLAP_COUNTS.heldCrossCheckpointModes === 2, "expected 2 cross-checkpoint holds");
assert(TSD_CP007_OVERLAP_COUNTS.heldRepresentationCandidates === 4, "expected 4 representation holds");
assert(TSD_CP007_OVERLAP_COUNTS.internalQaModes === 4, "expected 4 internal QA modes");

assert(retainedAuthorityKeys.size === 11, `expected 11 unique retained authority keys, found ${retainedAuthorityKeys.size}`);
for (const entry of TSD_CP007_AUTHORITY_OVERLAP_AUDIT) {
  if (entry.decision === "MERGE_INTO_CP007_AUTHORITY") {
    assert(retainedAuthorityKeys.has(entry.targetAuthority), `${entry.solveMode} merges into non-retained authority ${entry.targetAuthority}`);
  }
}

const assignedCoreModes = new Set<string>();
for (const authority of TSD_CP007_FINAL_NEW_AUTHORITY_CANDIDATES) {
  assert(authority.checkpointId === "TSD-CP-007", `${authority.authorityKey} has wrong checkpoint ownership`);
  assert(authority.ownershipStatus === "FINAL_MERGE_SPLIT_CANDIDATE", `${authority.authorityKey} is prematurely frozen`);
  assert(authority.permanentQlId === null, `${authority.authorityKey} received a permanent QL before approval`);
  assert(authority.englishFreezeStatus === "UNFROZEN", `${authority.authorityKey} English content is prematurely frozen`);
  assert(authority.underlyingSolveModes.length >= 1, `${authority.authorityKey} owns no solve modes`);
  assert(authority.examRepresentations.length >= 3, `${authority.authorityKey} lacks exam-representation depth`);
  assert(authority.sourceSaturationRequirements.length >= 3, `${authority.authorityKey} lacks source-saturation requirements`);
  for (const mode of authority.underlyingSolveModes) {
    assert(!assignedCoreModes.has(mode), `${mode} is owned by more than one retained authority`);
    assignedCoreModes.add(mode);
  }
}
assert(assignedCoreModes.size === 23, `11 retained authorities should absorb 11 kept + 12 merged modes = 23, found ${assignedCoreModes.size}`);

assert(TSD_CP007_DISCOVERY_AUTHORITY.permanentQlCount === 0, "discovery registry must allocate zero permanent QLs");
assert(TSD_CP007_DISCOVERY_AUTHORITY.nextAvailableQl === "TSD-QL-084", "discovery registry next QL must remain TSD-QL-084");
assert(TSD_CP007_DISCOVERY_AUTHORITY.englishFreezeStatus === "UNFROZEN", "discovery registry must stay unfrozen");
assert(TSD_CP007_DISCOVERY_AUTHORITY.questionStudioEnabled === false, "Question Studio must remain disabled at this gate");
assert(TSD_CP007_DISCOVERY_AUTHORITY.questionBankStatus === "NOT_STORED", "CP007 must not be stored in the question bank at this gate");
assert(TSD_CP007_DISCOVERY_AUTHORITY.testEligibility === "INELIGIBLE", "CP007 must remain test-ineligible at this gate");
assert(TSD_CP007_DISCOVERY_AUTHORITY.publiclyPublishable === false, "CP007 must remain unpublished at this gate");

assert(TSD_CP007_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.permanentQlCount === 0, "final candidate summary must allocate zero QLs");
assert(TSD_CP007_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.nextPermanentQl === "TSD-QL-084", "final candidate summary must preserve TSD-QL-084 as next QL");
assert(TSD_CP007_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.englishFreezeStatus === "UNFROZEN", "final candidate summary must stay unfrozen");
assert(TSD_CP007_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.questionStudioEnabled === false, "final candidate summary must keep Question Studio disabled");
assert(TSD_CP007_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.questionBankStatus === "NOT_STORED", "final candidate summary must remain outside question bank");
assert(TSD_CP007_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.testEligibility === "INELIGIBLE", "final candidate summary must remain test-ineligible");
assert(TSD_CP007_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.publiclyPublishable === false, "final candidate summary must remain unpublished");
assert(
  TSD_CP007_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.nextGate === "PRODUCT_OWNER_REVIEW_OF_CP007_11_AUTHORITY_MERGE_SPLIT_BEFORE_QL_ALLOCATION",
  "next gate must remain product-owner merge/split review before QL allocation",
);

const requiredSemanticAuthorities = new Set([
  "fixedPointCrossingTime",
  "finiteFixedObjectCrossingTime",
  "fullOccupancyDuration",
  "trainCrossingEventTimeline",
]);
for (const authorityKey of requiredSemanticAuthorities) {
  assert(retainedAuthorityKeys.has(authorityKey), `semantic guard authority ${authorityKey} is missing`);
}

console.log("TSD-CP-007 OWNERSHIP/LIFECYCLE PROOF: PASS");
console.log(JSON.stringify({
  discoveryModes: originalModes.size,
  retainedLearnerAuthorities: retainedAuthorityKeys.size,
  absorbedCoreModes: assignedCoreModes.size,
  crossCheckpointHolds: TSD_CP007_OVERLAP_COUNTS.heldCrossCheckpointModes,
  representationHolds: TSD_CP007_OVERLAP_COUNTS.heldRepresentationCandidates,
  internalQaModes: TSD_CP007_OVERLAP_COUNTS.internalQaModes,
  permanentQlCount: TSD_CP007_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.permanentQlCount,
  nextQl: TSD_CP007_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.nextPermanentQl,
  questionStudioEnabled: TSD_CP007_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.questionStudioEnabled,
}, null, 2));
