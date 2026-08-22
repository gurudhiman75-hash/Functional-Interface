import {
  ALG_PERMANENT_ALLOCATION,
  ALG_PERMANENT_QL_IDS,
  getAlgPermanentAllocation,
  type AlgPermanentQlId,
} from "./allocation";
import {
  generateAlgPermanentEnglishCandidate,
  type AlgPermanentEnglishCandidateItem,
} from "./english-adapter";

export const ALG_ENGLISH_FREEZE_ID = "ALG-EN-v1-frozen" as const;

export const ALG_ENGLISH_FREEZE_APPROVAL = Object.freeze({
  approvalAuthority: "EXPLICIT_PRODUCT_OWNER_CONTINUATION_AUTHORISED" as const,
  approvalDate: "2026-08-19" as const,
  approvalEvidence: "ACTIVE_SESSION_USER_GO_AFTER_GREEN_FINAL_CI" as const,
  approvalAuditCommentId: 5336644520 as const,
  approvedSourceBranch: "feature/alg-001-phase0-foundation" as const,
  approvedSourceHead: "7d68e7abc86aa4ac85917b20e61bc3b7af76d0b2" as const,
  permanentAllocationWorkflowRunId: 32197939867 as const,
  permanentEnglishWorkflowRunId: 32197939749 as const,
  qlRange: "ALG-QL-001..ALG-QL-043" as const,
  qlCount: 43 as const,
  mappedVariantCount: 109 as const,
  editorialSampleCount: 1308 as const,
  language: "en" as const,
  locale: "en-IN" as const,
  permanentIdentityFrozen: true as const,
  semanticContractFrozen: true as const,
  learnerContentFrozen: true as const,
  solverAuthorityFrozen: true as const,
  englishImplementationFrozen: true as const,
  multilingualImplementationFrozen: false as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

export interface AlgPermanentEnglishFrozenItem extends Omit<
  AlgPermanentEnglishCandidateItem,
  "maturity" | "englishImplementationFrozen" | "active" | "questionStudioDiscoverable"
> {
  readonly freezeId: typeof ALG_ENGLISH_FREEZE_ID;
  readonly approvedSourceHead: typeof ALG_ENGLISH_FREEZE_APPROVAL.approvedSourceHead;
  readonly allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION";
  readonly permanentIdentityFrozen: true;
  readonly semanticContractFrozen: true;
  readonly learnerContentFrozen: true;
  readonly solverAuthorityFrozen: true;
  readonly maturity: "ENGLISH_IMPLEMENTATION_FROZEN";
  readonly reviewStatus: "APPROVED_ENGLISH_FROZEN";
  readonly englishImplementationFrozen: true;
  readonly multilingualImplementationFrozen: false;
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankStatus: "NOT_STORED";
  readonly questionBankWritable: false;
  readonly testEligibility: "INELIGIBLE";
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

if (ALG_PERMANENT_QL_IDS.length !== ALG_ENGLISH_FREEZE_APPROVAL.qlCount) {
  throw new Error("Algebra approved English QL count changed after freeze authorization");
}
if (ALG_PERMANENT_QL_IDS[0] !== "ALG-QL-001" || ALG_PERMANENT_QL_IDS.at(-1) !== "ALG-QL-043") {
  throw new Error("Algebra approved English QL range changed after freeze authorization");
}
if (ALG_PERMANENT_ALLOCATION.length !== ALG_ENGLISH_FREEZE_APPROVAL.qlCount) {
  throw new Error("Algebra permanent allocation changed after English freeze authorization");
}

export function generateAlgPermanentEnglishFrozen(
  qlId: AlgPermanentQlId,
  seed: number,
  requestedVariantIndex?: number,
): AlgPermanentEnglishFrozenItem {
  const allocation = getAlgPermanentAllocation(qlId);
  const candidate = generateAlgPermanentEnglishCandidate(qlId, seed, requestedVariantIndex);

  if (candidate.englishImplementationFrozen || candidate.active || candidate.questionStudioDiscoverable) {
    throw new Error(`${qlId}: source English candidate crossed its pre-freeze lifecycle boundary`);
  }
  if (
    !allocation.permanentIdentityFrozen
    || !allocation.semanticContractFrozen
    || allocation.englishImplementationFrozen
    || allocation.multilingualImplementationFrozen
    || allocation.active
    || allocation.questionStudioDiscoverable
    || allocation.questionBankStatus !== "NOT_STORED"
    || allocation.testEligibility !== "INELIGIBLE"
    || allocation.publiclyPublishable
  ) {
    throw new Error(`${qlId}: permanent allocation lifecycle changed under English freeze`);
  }

  return {
    ...candidate,
    freezeId: ALG_ENGLISH_FREEZE_ID,
    approvedSourceHead: ALG_ENGLISH_FREEZE_APPROVAL.approvedSourceHead,
    allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION",
    permanentIdentityFrozen: true,
    semanticContractFrozen: true,
    learnerContentFrozen: true,
    solverAuthorityFrozen: true,
    maturity: "ENGLISH_IMPLEMENTATION_FROZEN",
    reviewStatus: "APPROVED_ENGLISH_FROZEN",
    englishImplementationFrozen: true,
    multilingualImplementationFrozen: false,
    active: false,
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
    testEligibility: "INELIGIBLE",
    testEligible: false,
    publiclyPublishable: false,
  };
}

export function auditAlgEnglishFreeze() {
  return {
    freezeId: ALG_ENGLISH_FREEZE_ID,
    qlCount: ALG_PERMANENT_ALLOCATION.length,
    firstQlId: ALG_PERMANENT_ALLOCATION[0]?.qlId,
    lastQlId: ALG_PERMANENT_ALLOCATION.at(-1)?.qlId,
    approvedSourceHead: ALG_ENGLISH_FREEZE_APPROVAL.approvedSourceHead,
    englishFrozen: ALG_ENGLISH_FREEZE_APPROVAL.englishImplementationFrozen,
    multilingualLocked: !ALG_ENGLISH_FREEZE_APPROVAL.multilingualImplementationFrozen,
    downstreamLocked:
      !ALG_ENGLISH_FREEZE_APPROVAL.active
      && !ALG_ENGLISH_FREEZE_APPROVAL.questionStudioDiscoverable
      && ALG_ENGLISH_FREEZE_APPROVAL.questionBankStatus === "NOT_STORED"
      && !ALG_ENGLISH_FREEZE_APPROVAL.questionBankWritable
      && ALG_ENGLISH_FREEZE_APPROVAL.testEligibility === "INELIGIBLE"
      && !ALG_ENGLISH_FREEZE_APPROVAL.testEligible
      && !ALG_ENGLISH_FREEZE_APPROVAL.publiclyPublishable,
  } as const;
}
