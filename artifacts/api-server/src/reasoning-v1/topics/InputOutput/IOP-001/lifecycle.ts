import type { IopLifecycle } from "./types.ts";

// Discovery engines intentionally keep this lifecycle so regression caselets
// cannot accidentally inherit later chapter-level product maturity.
export const IOP_001_LIFECYCLE: IopLifecycle = Object.freeze({
  maturity: "EXECUTABLE_DISCOVERY_PROOF",
  permanentQlCount: 0,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  hindiPunjabiStatus: "NOT_STARTED",
});

export const IOP_001_CHAPTER_LIFECYCLE = Object.freeze({
  packageId: "IOP-001" as const,
  chapterId: "REAS-INP" as const,
  maturity: "QUESTION_STUDIO_REVIEW_ONLY" as const,
  sourceFamilySaturation: "PASS_V1" as const,
  permanentQlCount: 8 as const,
  whitelistedSourceModeCount: 19 as const,
  englishAutomatedScaleProof: "PASS" as const,
  englishHumanAuditPack: "PASS" as const,
  englishArtifactAudit: "PASS" as const,
  englishHumanApproval: "APPROVED_2026_08_18" as const,
  englishFreeze: true as const,
  hindiPunjabiStatus: "FROZEN_V1" as const,
  hindiPunjabiHumanApproval: "APPROVED_2026_08_18" as const,
  localizationFreeze: true as const,
  questionStudioIntegrationAllowed: true as const,
  questionStudioDiscoverable: true as const,
  questionStudioGeneratable: true as const,
  questionStudioPersistenceAllowed: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

export function assertIop001QuestionStudioIntegrationAllowed(): true {
  return true;
}

export function assertIop001DeliveryActivationAllowed(): never {
  throw new Error("IOP-001 is multilingual-frozen and available in Question Studio review-only mode. Question Bank writes, test/mock eligibility and public delivery remain locked behind separate gates.");
}
