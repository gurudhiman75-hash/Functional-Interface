import {
  ALG_PERMANENT_ALLOCATION,
  ALG_PERMANENT_QL_IDS,
  getAlgPermanentAllocation,
  type AlgPermanentQlId,
} from "./allocation";
import {
  generateAlgPermanentEnglishReviewV3,
} from "./english-review-v3-render";
import type { AlgPermanentEnglishReviewV3Item } from "./english-review-v3";

export const ALG_ENGLISH_V3_FREEZE_ID = "ALG-EN-v3-frozen" as const;

export const ALG_ENGLISH_V3_FREEZE_APPROVAL = Object.freeze({
  approvalAuthority: "EXPLICIT_PRODUCT_OWNER_ARTIFACT_APPROVAL" as const,
  approvalDate: "2026-08-20" as const,
  approvalEvidence: "ACTIVE_SESSION_USER_APPROVED_EXACT_V3_REVIEW_PACK" as const,
  approvalAuditCommentId: 5351598978 as const,
  approvedReviewAuthority: "ALG-EN-review-v3" as const,
  approvedSourceBranch: "feature/alg-001-phase0-foundation" as const,
  approvedSourceHead: "3f96872bdcce0d7ef768aeb9118ef4c878a100df" as const,
  permanentEnglishWorkflowRunId: 32327556264 as const,
  reviewedArtifactName: "algebra-permanent-english-review-v3-109q" as const,
  reviewedArtifactId: 9391935139 as const,
  reviewedArtifactDigest: "sha256:01030cfc44dbb514037c41e1597288f3d1ad1efad32b34901db5ee0363af5d86" as const,
  qlRange: "ALG-QL-001..ALG-QL-043" as const,
  qlCount: 43 as const,
  mappedVariantCount: 109 as const,
  stressSampleCount: 1308 as const,
  deterministicReviewSampleCount: 109 as const,
  editorialAuditSampleCount: 1417 as const,
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

export interface AlgPermanentEnglishV3FrozenItem extends Omit<
  AlgPermanentEnglishReviewV3Item,
  | "maturity"
  | "reviewStatus"
  | "englishImplementationFrozen"
  | "active"
  | "questionStudioDiscoverable"
> {
  readonly freezeId: typeof ALG_ENGLISH_V3_FREEZE_ID;
  readonly approvedSourceHead: typeof ALG_ENGLISH_V3_FREEZE_APPROVAL.approvedSourceHead;
  readonly allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_V3_IMPLEMENTATION";
  readonly permanentIdentityFrozen: true;
  readonly semanticContractFrozen: true;
  readonly learnerContentFrozen: true;
  readonly solverAuthorityFrozen: true;
  readonly maturity: "ENGLISH_IMPLEMENTATION_FROZEN";
  readonly reviewStatus: "APPROVED_ENGLISH_V3_FROZEN";
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

if (ALG_PERMANENT_QL_IDS.length !== ALG_ENGLISH_V3_FREEZE_APPROVAL.qlCount) {
  throw new Error("Algebra approved English V3 QL count changed after freeze authorization");
}
if (ALG_PERMANENT_QL_IDS[0] !== "ALG-QL-001" || ALG_PERMANENT_QL_IDS.at(-1) !== "ALG-QL-043") {
  throw new Error("Algebra approved English V3 QL range changed after freeze authorization");
}
if (ALG_PERMANENT_ALLOCATION.length !== ALG_ENGLISH_V3_FREEZE_APPROVAL.qlCount) {
  throw new Error("Algebra permanent allocation changed after English V3 freeze authorization");
}

export function generateAlgPermanentEnglishV3Frozen(
  qlId: AlgPermanentQlId,
  seed: number,
  requestedVariantIndex?: number,
): AlgPermanentEnglishV3FrozenItem {
  const allocation = getAlgPermanentAllocation(qlId);
  const reviewed = generateAlgPermanentEnglishReviewV3(qlId, seed, requestedVariantIndex);

  if (reviewed.englishImplementationFrozen || reviewed.active || reviewed.questionStudioDiscoverable) {
    throw new Error(`${qlId}: reviewed V3 source crossed its pre-freeze lifecycle boundary`);
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
    throw new Error(`${qlId}: permanent allocation lifecycle changed under English V3 freeze`);
  }

  return {
    ...reviewed,
    freezeId: ALG_ENGLISH_V3_FREEZE_ID,
    approvedSourceHead: ALG_ENGLISH_V3_FREEZE_APPROVAL.approvedSourceHead,
    allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_V3_IMPLEMENTATION",
    permanentIdentityFrozen: true,
    semanticContractFrozen: true,
    learnerContentFrozen: true,
    solverAuthorityFrozen: true,
    maturity: "ENGLISH_IMPLEMENTATION_FROZEN",
    reviewStatus: "APPROVED_ENGLISH_V3_FROZEN",
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

export function auditAlgEnglishV3Freeze() {
  return {
    freezeId: ALG_ENGLISH_V3_FREEZE_ID,
    reviewAuthority: ALG_ENGLISH_V3_FREEZE_APPROVAL.approvedReviewAuthority,
    qlCount: ALG_PERMANENT_ALLOCATION.length,
    firstQlId: ALG_PERMANENT_ALLOCATION[0]?.qlId,
    lastQlId: ALG_PERMANENT_ALLOCATION.at(-1)?.qlId,
    approvedSourceHead: ALG_ENGLISH_V3_FREEZE_APPROVAL.approvedSourceHead,
    workflowRunId: ALG_ENGLISH_V3_FREEZE_APPROVAL.permanentEnglishWorkflowRunId,
    artifactId: ALG_ENGLISH_V3_FREEZE_APPROVAL.reviewedArtifactId,
    artifactDigest: ALG_ENGLISH_V3_FREEZE_APPROVAL.reviewedArtifactDigest,
    englishFrozen: ALG_ENGLISH_V3_FREEZE_APPROVAL.englishImplementationFrozen,
    multilingualLocked: !ALG_ENGLISH_V3_FREEZE_APPROVAL.multilingualImplementationFrozen,
    downstreamLocked:
      !ALG_ENGLISH_V3_FREEZE_APPROVAL.active
      && !ALG_ENGLISH_V3_FREEZE_APPROVAL.questionStudioDiscoverable
      && ALG_ENGLISH_V3_FREEZE_APPROVAL.questionBankStatus === "NOT_STORED"
      && !ALG_ENGLISH_V3_FREEZE_APPROVAL.questionBankWritable
      && ALG_ENGLISH_V3_FREEZE_APPROVAL.testEligibility === "INELIGIBLE"
      && !ALG_ENGLISH_V3_FREEZE_APPROVAL.testEligible
      && !ALG_ENGLISH_V3_FREEZE_APPROVAL.publiclyPublishable,
  } as const;
}
