import {
  TSD_CP004_ENGLISH_APPROVED_SOURCE_HEAD,
  TSD_CP004_ENGLISH_FREEZE_ID,
  TSD_CP004_ENGLISH_FREEZE_STATUS,
} from "../cp004/english-approved-freeze";
import { TSD_CP005_AUTHORITY_OVERLAP_AUDIT, TSD_CP005_OVERLAP_COUNTS } from "./authority-overlap-audit";
import { TSD_CP005_DISCOVERY_CANDIDATES } from "./discovery-registry";
import {
  TSD_CP005_FINAL_NEW_AUTHORITY_CANDIDATES,
  TSD_CP005_FINAL_OWNERSHIP_CANDIDATE_SUMMARY,
  TSD_CP005_HELD_CROSS_CHECKPOINT_MODES,
  TSD_CP005_INTERNAL_QA_MODES,
} from "./final-ownership-candidate";
import { generateCp005AuditPool } from "./generator";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const audit = generateCp005AuditPool(12);

assert(TSD_CP005_AUTHORITY_OVERLAP_AUDIT.length === 31, "CP005 overlap audit must disposition all 31 discovery candidates");
assert(TSD_CP005_DISCOVERY_CANDIDATES.every((mode) => TSD_CP005_AUTHORITY_OVERLAP_AUDIT.some((entry) => entry.solveMode === mode)), "CP005 overlap audit omitted a discovery candidate");
assert(TSD_CP005_OVERLAP_COUNTS.newLearnerAuthorities === 13, "CP005 retained learner-authority count changed");
assert(TSD_CP005_OVERLAP_COUNTS.mergedCoreModes === 7, "CP005 merged-mode count changed");
assert(TSD_CP005_OVERLAP_COUNTS.heldCrossCheckpointModes === 6, "CP005 cross-checkpoint hold count changed");
assert(TSD_CP005_OVERLAP_COUNTS.heldRepresentationCandidates === 1, "CP005 representation hold count changed");
assert(TSD_CP005_OVERLAP_COUNTS.internalQaModes === 4, "CP005 internal-QA count changed");
assert(TSD_CP005_FINAL_NEW_AUTHORITY_CANDIDATES.length === 13, "CP005 final ownership candidate must contain 13 learner authorities");
assert(TSD_CP005_HELD_CROSS_CHECKPOINT_MODES.length === 6, "CP005 held cross-checkpoint set changed");
assert(TSD_CP005_INTERNAL_QA_MODES.length === 4, "CP005 internal-QA set changed");
assert(TSD_CP005_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.permanentQlCount === 0, "CP005 QLs allocated before approval");
assert(TSD_CP005_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.nextPermanentQl === "TSD-QL-058", "CP005 next QL boundary changed");

const retainedModes = new Set(TSD_CP005_FINAL_NEW_AUTHORITY_CANDIDATES.flatMap((entry) => entry.underlyingSolveModes));
for (const row of TSD_CP005_AUTHORITY_OVERLAP_AUDIT) {
  if (row.decision === "KEEP_AS_NEW_CP005_AUTHORITY" || row.decision === "MERGE_INTO_CP005_AUTHORITY") {
    assert(retainedModes.has(row.solveMode), `${row.solveMode}: retained/merged mode missing from learner-authority candidate`);
  } else {
    assert(!retainedModes.has(row.solveMode), `${row.solveMode}: held/internal mode leaked into learner-authority candidate`);
  }
}

for (const authority of TSD_CP005_FINAL_NEW_AUTHORITY_CANDIDATES) {
  assert(authority.examRepresentations.length >= 3, `${authority.authorityKey}: insufficient representation evidence`);
  assert(authority.permanentQlId === null, `${authority.authorityKey}: permanent QL assigned before approval`);
  assert(authority.englishFreezeStatus === "UNFROZEN", `${authority.authorityKey}: frozen before English review`);
  for (const mode of authority.underlyingSolveModes) {
    const rows = audit.filter((candidate) => candidate.solveMode === mode);
    assert(rows.length === 12, `${authority.authorityKey}/${mode}: expected 12 executable states`);
    assert(rows.every((candidate) => candidate.verification.valid), `${authority.authorityKey}/${mode}: executable state failed independent verification`);
  }
}

assert(TSD_CP004_ENGLISH_FREEZE_STATUS === "APPROVED_ENGLISH_FROZEN", "CP004 English freeze status changed during CP005 work");
assert(TSD_CP004_ENGLISH_FREEZE_ID === "TSD-CP-004-EN-v1-frozen", "CP004 English freeze ID changed during CP005 work");
assert(TSD_CP004_ENGLISH_APPROVED_SOURCE_HEAD === "99b65d54c87bfe456182bbcbad5963d30579952c", "CP004 approved content source changed during CP005 work");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP005_AUTHORITY_OVERLAP_AND_MERGE_SPLIT_CANDIDATE",
  sourceCandidates: TSD_CP005_DISCOVERY_CANDIDATES.length,
  newLearnerAuthorities: TSD_CP005_OVERLAP_COUNTS.newLearnerAuthorities,
  mergedCoreModes: TSD_CP005_OVERLAP_COUNTS.mergedCoreModes,
  heldCrossCheckpointModes: TSD_CP005_OVERLAP_COUNTS.heldCrossCheckpointModes,
  heldRepresentationCandidates: TSD_CP005_OVERLAP_COUNTS.heldRepresentationCandidates,
  internalQaModes: TSD_CP005_OVERLAP_COUNTS.internalQaModes,
  executableCasesRechecked: audit.length,
  permanentQlCount: 0,
  nextPermanentQl: "TSD-QL-058",
  cp004EnglishFreezeId: TSD_CP004_ENGLISH_FREEZE_ID,
  cp004ApprovedSourceHead: TSD_CP004_ENGLISH_APPROVED_SOURCE_HEAD,
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  nextGate: "PRODUCT_OWNER_REVIEW_OF_13_AUTHORITY_COUNT_AND_CONTENT_BEFORE_QL_ALLOCATION",
}, null, 2));
