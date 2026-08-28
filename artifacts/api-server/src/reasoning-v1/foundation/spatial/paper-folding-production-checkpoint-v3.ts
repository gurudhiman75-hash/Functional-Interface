import { PFC_TPF_FINAL_COMBINED_PRODUCT_OWNER_APPROVAL_V1 } from "./paper-folding-final-combined-product-owner-approval-v1";
import { SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4 } from "./spatial-permanent-ql-allocation-v4";
import { PFC_TPF_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V3 } from "./paper-folding-permanent-english-runtime-v3";

export const PFC_TPF_PRODUCTION_CHECKPOINT_V3 = Object.freeze({
  authorityId: "PFC-TPF-PRODUCTION-CHECKPOINT-V3" as const,
  approvedReviewAuthorityId: PFC_TPF_FINAL_COMBINED_PRODUCT_OWNER_APPROVAL_V1.approvedReviewAuthorityId,
  productOwnerApprovalAuthorityId: PFC_TPF_FINAL_COMBINED_PRODUCT_OWNER_APPROVAL_V1.authorityId,
  allocationAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4.authorityId,
  runtimeAuthorityId: PFC_TPF_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V3.authorityId,
  permanentQlRange: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4.allocatedRange,
  nextAvailablePermanentQlId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4.nextAvailablePermanentQlId,
  canonicalEnglishArchetypeCount: PFC_TPF_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V3.canonicalArchetypeCount,
  englishFreezeAllowed: false,
  localizationAllowed: false,
  questionStudioAllowed: false,
  reason: "DEDICATED_ALLOCATION_AND_RUNTIME_CI_MUST_PASS_ON_EXACT_HEAD_BEFORE_FREEZE" as const,
  nextGate: "PFC_TPF_ALLOCATION_V4_AND_RUNTIME_V3_EXACT_HEAD_CI" as const,
} as const);
