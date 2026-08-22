import {
  ALG_PERMANENT_ALLOCATION,
  ALG_PERMANENT_QL_IDS,
  getAlgPermanentAllocation,
  type AlgPermanentQlId,
} from "./allocation";
import {
  generateAlgPermanentMultilingualReviewV2HumanFinal,
} from "./multilingual-review-v2-human-final";
import type {
  AlgPermanentMultilingualReviewV2Item,
} from "./multilingual-review-v2";
import type { AlgReviewLocale } from "./multilingual-review-v1";

export const ALG_MULTILINGUAL_V2_FREEZE_ID = "ALG-ML-v2-frozen" as const;

export const ALG_MULTILINGUAL_V2_FREEZE_APPROVAL = Object.freeze({
  approvalAuthority: "EXPLICIT_PRODUCT_OWNER_ARTIFACT_APPROVAL" as const,
  approvalDate: "2026-08-21" as const,
  approvalEvidence: "ACTIVE_SESSION_USER_APPROVED_EXACT_HI_PA_V2_REVIEW_PACK" as const,
  approvalAuditCommentId: 5365961584 as const,
  approvedReviewAuthority: "ALG-ML-review-v2" as const,
  sourceEnglishFreeze: "ALG-EN-v3-frozen" as const,
  approvedSourceBranch: "feature/alg-001-phase0-foundation" as const,
  approvedSourceHead: "255c3dc156e0cbc9d8fc9b909552f7ef903db019" as const,
  multilingualReviewWorkflowRunId: 32444334325 as const,
  reviewedArtifactName: "algebra-permanent-multilingual-review-v2-109q" as const,
  reviewedArtifactId: 9433549545 as const,
  reviewedArtifactDigest: "sha256:e1043d03d6bb674a84c88d9a66033df0307eff9bd4a18b93d90819e3f5fb0fcb" as const,
  qlRange: "ALG-QL-001..ALG-QL-043" as const,
  qlCount: 43 as const,
  mappedVariantCount: 109 as const,
  locales: ["hi-IN", "pa-IN"] as const,
  localeCount: 2 as const,
  exhaustiveReviewSampleCount: 2616 as const,
  permanentIdentityFrozen: true as const,
  semanticContractFrozen: true as const,
  learnerContentFrozen: true as const,
  solverAuthorityFrozen: true as const,
  englishImplementationFrozen: true as const,
  multilingualImplementationFrozen: true as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

export interface AlgPermanentMultilingualV2FrozenItem extends Omit<
  AlgPermanentMultilingualReviewV2Item,
  "maturity" | "reviewStatus" | "multilingualImplementationFrozen"
> {
  readonly localizationFreezeId: typeof ALG_MULTILINGUAL_V2_FREEZE_ID;
  readonly approvedLocalizationSourceHead: typeof ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.approvedSourceHead;
  readonly localizedLearnerContentFrozen: true;
  readonly maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN";
  readonly reviewStatus: "APPROVED_HI_PA_V2_FROZEN";
  readonly multilingualImplementationFrozen: true;
}

if (ALG_PERMANENT_QL_IDS.length !== ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.qlCount) {
  throw new Error("Algebra approved multilingual V2 QL count changed after freeze authorization");
}
if (ALG_PERMANENT_QL_IDS[0] !== "ALG-QL-001" || ALG_PERMANENT_QL_IDS.at(-1) !== "ALG-QL-043") {
  throw new Error("Algebra approved multilingual V2 QL range changed after freeze authorization");
}
if (ALG_PERMANENT_ALLOCATION.length !== ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.qlCount) {
  throw new Error("Algebra permanent allocation changed after multilingual V2 freeze authorization");
}

export function generateAlgPermanentMultilingualV2Frozen(
  qlId: AlgPermanentQlId,
  seed: number,
  locale: AlgReviewLocale,
  requestedVariantIndex?: number,
): AlgPermanentMultilingualV2FrozenItem {
  const allocation = getAlgPermanentAllocation(qlId);
  const reviewed = generateAlgPermanentMultilingualReviewV2HumanFinal(
    qlId,
    seed,
    locale,
    requestedVariantIndex,
  );

  if (
    reviewed.multilingualImplementationFrozen
    || reviewed.active
    || reviewed.questionStudioDiscoverable
    || reviewed.questionBankStatus !== "NOT_STORED"
    || reviewed.questionBankWritable
    || reviewed.testEligibility !== "INELIGIBLE"
    || reviewed.testEligible
    || reviewed.publiclyPublishable
  ) {
    throw new Error(`${qlId}/${locale}: reviewed multilingual V2 source crossed its pre-freeze lifecycle boundary`);
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
    throw new Error(`${qlId}: permanent allocation lifecycle changed under multilingual V2 freeze`);
  }

  return Object.freeze({
    ...reviewed,
    localizationFreezeId: ALG_MULTILINGUAL_V2_FREEZE_ID,
    approvedLocalizationSourceHead: ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.approvedSourceHead,
    localizedLearnerContentFrozen: true,
    maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN",
    reviewStatus: "APPROVED_HI_PA_V2_FROZEN",
    multilingualImplementationFrozen: true,
  });
}

export function auditAlgMultilingualV2Freeze() {
  return {
    freezeId: ALG_MULTILINGUAL_V2_FREEZE_ID,
    reviewAuthority: ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.approvedReviewAuthority,
    sourceEnglishFreeze: ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.sourceEnglishFreeze,
    qlCount: ALG_PERMANENT_ALLOCATION.length,
    firstQlId: ALG_PERMANENT_ALLOCATION[0]?.qlId,
    lastQlId: ALG_PERMANENT_ALLOCATION.at(-1)?.qlId,
    locales: ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.locales,
    approvedSourceHead: ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.approvedSourceHead,
    workflowRunId: ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.multilingualReviewWorkflowRunId,
    artifactId: ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.reviewedArtifactId,
    artifactDigest: ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.reviewedArtifactDigest,
    englishFrozen: ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.englishImplementationFrozen,
    multilingualFrozen: ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.multilingualImplementationFrozen,
    downstreamLocked:
      !ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.active
      && !ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.questionStudioDiscoverable
      && ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.questionBankStatus === "NOT_STORED"
      && !ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.questionBankWritable
      && ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.testEligibility === "INELIGIBLE"
      && !ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.testEligible
      && !ALG_MULTILINGUAL_V2_FREEZE_APPROVAL.publiclyPublishable,
  } as const;
}
