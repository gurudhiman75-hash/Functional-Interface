import {
  TSD_CP003_HI_PA_APPROVED_SOURCE_HEAD,
  TSD_CP003_HI_PA_FREEZE_ID,
  TSD_CP003_HI_PA_FREEZE_STATUS,
} from "../cp003/localization/native-approved-freeze";
import { TSD_CP003_NEXT_PERMANENT_QL_ID } from "../cp003/ql-allocation";
import { TSD_CP004_DISCOVERY_AUTHORITIES } from "./discovery-registry";
import { TSD_CP004_CROSS_CHECKPOINT_OVERLAP_AUDIT, TSD_CP004_OVERLAP_COUNTS } from "./cross-checkpoint-overlap-audit";
import { TSD_CP004_FINAL_NEW_AUTHORITY_CANDIDATES, TSD_CP004_FINAL_OWNERSHIP_CANDIDATE_SUMMARY } from "./final-ownership-candidate";
import { TSD_CP004_NEXT_PERMANENT_QL_ID, TSD_CP004_PERMANENT_QL_ALLOCATIONS } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(TSD_CP003_NEXT_PERMANENT_QL_ID === "TSD-QL-048", "CP003 must hand off exactly at TSD-QL-048");
assert(TSD_CP004_DISCOVERY_AUTHORITIES.length === 33, "CP004 blueprint accounting must remain 33 candidates");
assert(TSD_CP004_CROSS_CHECKPOINT_OVERLAP_AUDIT.length === 33, "All 33 CP004 candidates must be audited");
assert(TSD_CP004_OVERLAP_COUNTS.newLearnerAuthorities === 10, "CP004 should retain 10 ordinary learner authorities");
assert(TSD_CP004_OVERLAP_COUNTS.mergedCoreModes === 11, "CP004 should merge 11 core projections into retained authorities");
assert(TSD_CP004_OVERLAP_COUNTS.cp004RepresentationModes === 2, "CP004 meeting/departure clock wrappers should remain representations");
assert(TSD_CP004_OVERLAP_COUNTS.newLearnerAuthorities + TSD_CP004_OVERLAP_COUNTS.mergedCoreModes + TSD_CP004_OVERLAP_COUNTS.cp004RepresentationModes === 23, "The 23 executable core modes must be fully accounted for");
assert(TSD_CP004_OVERLAP_COUNTS.heldAdvancedModes === 5, "Five advanced discovery modes must remain held");
assert(TSD_CP004_OVERLAP_COUNTS.heldRepresentationCandidates === 2, "Timeline and diagram must remain representation candidates");
assert(TSD_CP004_OVERLAP_COUNTS.internalQaModes === 3, "Three QA modes must remain internal");
assert(TSD_CP004_FINAL_NEW_AUTHORITY_CANDIDATES.length === 10, "Final ownership candidate must contain 10 learner authorities");
assert(TSD_CP004_FINAL_NEW_AUTHORITY_CANDIDATES.every((authority) => authority.examRepresentations.length >= 3), "Every retained authority must carry broad exam representation coverage");
assert(TSD_CP004_PERMANENT_QL_ALLOCATIONS.length === 10, "Ten CP004 learner authorities must receive permanent QLs");

const expectedQlIds = Array.from({ length: 10 }, (_, index) => `TSD-QL-${String(48 + index).padStart(3, "0")}`);
assert(JSON.stringify(TSD_CP004_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.permanentQlId)) === JSON.stringify(expectedQlIds), "CP004 QLs must be contiguous TSD-QL-048..057");
assert(new Set(TSD_CP004_PERMANENT_QL_ALLOCATIONS.flatMap((entry) => entry.underlyingSolveModes)).size === 21, "Exactly 21 core solve modes should map to new learner QLs; two clock wrappers remain representation-only");
assert(TSD_CP004_NEXT_PERMANENT_QL_ID === "TSD-QL-058", "Next chapter identity after CP004 core allocation must be TSD-QL-058");
assert(TSD_CP004_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.questionStudioEnabled === false, "Question Studio must remain disabled");
assert(TSD_CP004_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.questionBankStatus === "NOT_STORED", "Question Bank must remain locked");
assert(TSD_CP004_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.testEligibility === "INELIGIBLE", "Tests must remain disabled");
assert(TSD_CP004_FINAL_OWNERSHIP_CANDIDATE_SUMMARY.publiclyPublishable === false, "Public publication must remain disabled");
assert(TSD_CP003_HI_PA_FREEZE_STATUS === "APPROVED_NATIVE_FROZEN", "Inherited CP003 native freeze status changed");
assert(TSD_CP003_HI_PA_FREEZE_ID === "TSD-CP-003-HI-PA-v1-frozen", "Inherited CP003 freeze ID changed");
assert(TSD_CP003_HI_PA_APPROVED_SOURCE_HEAD === "49965e649a7f688c2dd9f3ca5a2c909dc0240423", "Inherited CP003 approved source head changed");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP004_AUTHORITY_CONSOLIDATION_AND_QL_ALLOCATION",
  discoveryCandidates: TSD_CP004_DISCOVERY_AUTHORITIES.length,
  executableCoreModes: 23,
  retainedLearnerAuthorities: TSD_CP004_OVERLAP_COUNTS.newLearnerAuthorities,
  mergedCoreModes: TSD_CP004_OVERLAP_COUNTS.mergedCoreModes,
  clockRepresentationExtensions: TSD_CP004_OVERLAP_COUNTS.cp004RepresentationModes,
  heldAdvancedModes: TSD_CP004_OVERLAP_COUNTS.heldAdvancedModes,
  heldTimelineDiagramRepresentations: TSD_CP004_OVERLAP_COUNTS.heldRepresentationCandidates,
  internalQaModes: TSD_CP004_OVERLAP_COUNTS.internalQaModes,
  permanentQlRange: "TSD-QL-048..TSD-QL-057",
  nextPermanentQl: TSD_CP004_NEXT_PERMANENT_QL_ID,
  cp003MultilingualFreeze: TSD_CP003_HI_PA_FREEZE_STATUS,
  cp003FreezeId: TSD_CP003_HI_PA_FREEZE_ID,
  cp003ApprovedSourceHead: TSD_CP003_HI_PA_APPROVED_SOURCE_HEAD,
  englishFreezeStatus: "UNFROZEN",
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
