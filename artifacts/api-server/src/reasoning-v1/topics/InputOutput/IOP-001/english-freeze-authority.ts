import type { IopEnglishProductionCaselet } from "./english-production-types.ts";

export const IOP_001_ENGLISH_FREEZE_AUTHORITY = Object.freeze({
  packageId: "IOP-001" as const,
  chapterId: "REAS-INP" as const,
  status: "ENGLISH_FROZEN" as const,
  approvalStatus: "HUMAN_PRODUCT_OWNER_APPROVED" as const,
  approvalDate: "2026-08-18" as const,
  reviewedHead: "c0bde9aa516571e3adf71bbc99b83d2d2e7e8f3f" as const,
  reviewedWorkflowRunId: 32031090452 as const,
  reviewedArtifactId: 9288927949 as const,
  reviewedArtifactDigest: "sha256:a407a19e24aeeb343690799a3b73ebd1ef5fbf45d945b43840724cb241dc0211" as const,
  reviewedHtmlSha256: "a889a98086633330f0619eabd30a06067c79c52780599108591c8ed388657079" as const,
  reviewedJsonSha256: "94b5c9b31fb497c972fccba79f948e37db22d6e945a5311f0f7036e52f7fc936" as const,
  permanentQlCount: 8 as const,
  sourceModeCount: 19 as const,
  reviewCaseletCount: 38 as const,
  reviewQuestionCount: 152 as const,
  englishFreeze: true as const,
  learnerContentChangeAllowedWithoutNewApproval: false as const,
  hindiPunjabiMayStart: true as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

export function withIop001EnglishFrozenLifecycle(
  caselet: IopEnglishProductionCaselet,
): IopEnglishProductionCaselet {
  return {
    ...caselet,
    lifecycle: {
      maturity: "ENGLISH_FROZEN",
      permanentQlCount: 8,
      englishFreeze: true,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      hindiPunjabiStatus: "NOT_STARTED",
    },
  };
}

export function assertIop001EnglishFreezeAuthority(): void {
  if (!IOP_001_ENGLISH_FREEZE_AUTHORITY.englishFreeze) throw new Error("IOP-001 English freeze authority is not frozen");
  if (IOP_001_ENGLISH_FREEZE_AUTHORITY.approvalStatus !== "HUMAN_PRODUCT_OWNER_APPROVED") throw new Error("IOP-001 English freeze lacks explicit human approval");
  if (IOP_001_ENGLISH_FREEZE_AUTHORITY.permanentQlCount !== 8) throw new Error("IOP-001 frozen QL count drifted");
  if (IOP_001_ENGLISH_FREEZE_AUTHORITY.sourceModeCount !== 19) throw new Error("IOP-001 frozen source-mode count drifted");
  if (IOP_001_ENGLISH_FREEZE_AUTHORITY.reviewCaseletCount !== 38 || IOP_001_ENGLISH_FREEZE_AUTHORITY.reviewQuestionCount !== 152) {
    throw new Error("IOP-001 frozen human-review volume drifted");
  }
  if (IOP_001_ENGLISH_FREEZE_AUTHORITY.questionStudioDiscoverable
    || IOP_001_ENGLISH_FREEZE_AUTHORITY.questionBankWritable
    || IOP_001_ENGLISH_FREEZE_AUTHORITY.testEligible
    || IOP_001_ENGLISH_FREEZE_AUTHORITY.publiclyPublishable) {
    throw new Error("IOP-001 English approval leaked into product activation");
  }
}
