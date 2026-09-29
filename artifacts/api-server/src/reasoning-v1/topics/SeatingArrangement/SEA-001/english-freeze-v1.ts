import { SEA_001_QLS } from "./ql-registry.ts";
import { SEA_001_ENGLISH_REVIEW_PACK_V1, buildSea001EnglishReviewPackV1 } from "./english-review-pack-v1.ts";

const frozenPack = buildSea001EnglishReviewPackV1();

export const SEA_001_ENGLISH_FREEZE_V1 = Object.freeze({
  authorityId: "SEA_001_ENGLISH_FREEZE_V1",
  packageId: "SEA-001",
  chapterId: "REAS-SEA",
  status: "ENGLISH_FROZEN",
  approvedOn: "2026-09-29",
  approvalBasis: "USER_EXPLICIT_APPROVAL_OF_324_ITEM_REVIEW_AUTHORITY",
  reviewAuthorityId: SEA_001_ENGLISH_REVIEW_PACK_V1.authorityId,
  reviewItemCount: frozenPack.length,
  blueprintAuthorityCount: new Set(frozenPack.map((item) => item.blueprintAuthorityId)).size,
  permanentQlCount: SEA_001_QLS.length,
  permanentQlRange: "SEA-QL-001..SEA-QL-009",
  solveInventoryStatus: "FROZEN",
  queryMixStatus: "FROZEN",
  englishFreezeStatus: "FROZEN",
  diagramPolicy: "EXPLANATION_ONLY",
  difficultyAuthority: "SEA_001_STRUCTURAL_DIFFICULTY_V1",
  localizationMayChangeSemanticState: false,
  localizationMayChangeCorrectIndex: false,
  localizationMayChangeQlOwnership: false,
  questionStudioRegistered: false,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
});

if (SEA_001_ENGLISH_FREEZE_V1.reviewItemCount !== 324) {
  throw new Error("SEA-001 English freeze review pack drift");
}
if (SEA_001_ENGLISH_FREEZE_V1.blueprintAuthorityCount !== 20) {
  throw new Error("SEA-001 English freeze blueprint coverage drift");
}
if (SEA_001_ENGLISH_FREEZE_V1.permanentQlCount !== 9) {
  throw new Error("SEA-001 English freeze QL count drift");
}
