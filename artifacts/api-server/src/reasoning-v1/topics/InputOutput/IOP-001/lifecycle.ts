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
  maturity: "ENGLISH_REVIEW_CANDIDATE" as const,
  sourceFamilySaturation: "PASS_V1" as const,
  permanentQlCount: 8 as const,
  whitelistedSourceModeCount: 19 as const,
  englishAutomatedScaleProof: "PASS" as const,
  englishHumanAuditPack: "PASS" as const,
  englishArtifactAudit: "PASS" as const,
  englishFreeze: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
  hindiPunjabiStatus: "NOT_STARTED" as const,
});

export function assertIop001ActivationAllowed(): never {
  throw new Error("IOP-001 is an English review candidate only: English freeze, localization, Question Studio, Question Bank, tests and public delivery remain locked.");
}
