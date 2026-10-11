import { TSD_CP006_AUTHORITY_OVERLAP_AUDIT, TSD_CP006_OVERLAP_COUNTS } from "./authority-overlap-audit";
import { TSD_CP006_DISCOVERY_CANDIDATES } from "./discovery-registry";
import { TSD_CP006_FINAL_NEW_AUTHORITY_CANDIDATES, TSD_CP006_FINAL_OWNERSHIP_CANDIDATE_SUMMARY } from "./final-ownership-candidate";
import { generateCp006AuditCases } from "./generator";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const audit = generateCp006AuditCases(12);
assert(audit.length === 408, `CP006 authority review expected 408 executable cases, received ${audit.length}`);
assert(audit.every((row) => row.verification.valid), "CP006 authority review encountered an invalid executable case");
assert(TSD_CP006_AUTHORITY_OVERLAP_AUDIT.length === 34, "CP006 authority review must classify all 34 discovery candidates");
assert(new Set(TSD_CP006_AUTHORITY_OVERLAP_AUDIT.map((row) => row.solveMode)).size === 34, "CP006 authority review contains duplicate solve-mode decisions");
assert(TSD_CP006_DISCOVERY_CANDIDATES.every((mode) => TSD_CP006_AUTHORITY_OVERLAP_AUDIT.some((row) => row.solveMode === mode)), "CP006 authority review lost a discovery mode");

assert(TSD_CP006_FINAL_NEW_AUTHORITY_CANDIDATES.length === 13, "CP006 merge-split candidate must retain exactly 13 learner authorities");
assert(new Set(TSD_CP006_FINAL_NEW_AUTHORITY_CANDIDATES.map((row) => row.authorityKey)).size === 13, "CP006 retained authority keys are not unique");
for (const authority of TSD_CP006_FINAL_NEW_AUTHORITY_CANDIDATES) {
  assert(authority.underlyingSolveModes.length >= 1, `${authority.authorityKey}: no executable solve mode attached`);
  assert(authority.examRepresentations.length >= 3, `${authority.authorityKey}: insufficient exam representations`);
  assert(authority.sourceSaturationRequirements.length >= 3, `${authority.authorityKey}: insufficient source-saturation requirements`);
  assert(authority.permanentQlId === null, `${authority.authorityKey}: permanent QL allocated before product-owner review`);
  assert(authority.englishFreezeStatus === "UNFROZEN", `${authority.authorityKey}: English frozen before authority approval`);
}

const retainedAndMergedModes = new Set(TSD_CP006_FINAL_NEW_AUTHORITY_CANDIDATES.flatMap((authority) => authority.underlyingSolveModes));
assert(retainedAndMergedModes.size === TSD_CP006_OVERLAP_COUNTS.newLearnerAuthorities + TSD_CP006_OVERLAP_COUNTS.mergedCoreModes, "CP006 retained/merged mode count does not match authority ownership");
for (const row of TSD_CP006_AUTHORITY_OVERLAP_AUDIT) {
  if (row.decision === "KEEP_AS_NEW_CP006_AUTHORITY" || row.decision === "MERGE_INTO_CP006_AUTHORITY") {
    assert(retainedAndMergedModes.has(row.solveMode), `${row.solveMode}: retained/merged mode missing from final authority candidate`);
  } else {
    assert(!retainedAndMergedModes.has(row.solveMode), `${row.solveMode}: held/QA mode leaked into a learner authority`);
  }
}

assert(TSD_CP006_OVERLAP_COUNTS.newLearnerAuthorities === 13, "CP006 retained authority count drifted");
assert(TSD_CP006_OVERLAP_COUNTS.mergedCoreModes === 11, "CP006 merged mode count drifted");
assert(TSD_CP006_OVERLAP_COUNTS.heldCrossCheckpointModes === 2, "CP006 cross-checkpoint hold count drifted");
assert(TSD_CP006_OVERLAP_COUNTS.heldAdvancedModes === 2, "CP006 advanced hold count drifted");
assert(TSD_CP006_OVERLAP_COUNTS.heldRepresentationCandidates === 3, "CP006 representation hold count drifted");
assert(TSD_CP006_OVERLAP_COUNTS.internalQaModes === 3, "CP006 QA mode count drifted");
assert(TSD_CP006_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.permanentQlCount === 0, "CP006 QLs were allocated before product-owner authority approval");
assert(TSD_CP006_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.nextPermanentQl === "TSD-QL-071", "CP006 next permanent QL boundary drifted");
assert(!TSD_CP006_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.questionStudioEnabled, "CP006 Studio enabled before authority approval");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP006_SOURCE_SATURATION_AND_MERGE_SPLIT_AUTHORITY_CANDIDATE",
  sourceCandidates: TSD_CP006_DISCOVERY_CANDIDATES.length,
  executableCasesRechecked: audit.length,
  proposedNewLearnerAuthorities: TSD_CP006_OVERLAP_COUNTS.newLearnerAuthorities,
  mergedCoreModes: TSD_CP006_OVERLAP_COUNTS.mergedCoreModes,
  heldCrossCheckpointModes: TSD_CP006_OVERLAP_COUNTS.heldCrossCheckpointModes,
  heldAdvancedModes: TSD_CP006_OVERLAP_COUNTS.heldAdvancedModes,
  heldRepresentationCandidates: TSD_CP006_OVERLAP_COUNTS.heldRepresentationCandidates,
  internalQaModes: TSD_CP006_OVERLAP_COUNTS.internalQaModes,
  proposedAuthorityKeys: TSD_CP006_FINAL_NEW_AUTHORITY_CANDIDATES.map((row) => row.authorityKey),
  permanentQlCount: 0,
  nextPermanentQl: "TSD-QL-071",
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  nextGate: TSD_CP006_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.nextGate,
}, null, 2));
