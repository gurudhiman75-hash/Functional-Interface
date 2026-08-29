import {
  generateIopLocalizedReviewCaseletV1,
  type IopLocalizedCaselet,
  type IopLocalizedLocale,
} from "./localization-v1-final.ts";
import type { IopPermanentQlId } from "./permanent-authorities.ts";

export const IOP_001_LOCALIZATION_FREEZE_AUTHORITY = Object.freeze({
  packageId: "IOP-001" as const,
  chapterId: "REAS-INP" as const,
  status: "MULTILINGUAL_FROZEN" as const,
  humanLanguageApproval: "APPROVED_2026_08_18" as const,
  reviewedHead: "ce458cd44a777c762ae69c2c47a9aea71967ac44" as const,
  reviewedWorkflowRun: 32092688378 as const,
  reviewedArtifactId: 9308875668 as const,
  reviewedArchiveSha256: "9cf51849e20112f41abd8b04a3727b4bd7d28a6d5cb2cedd835512435a13b6c0" as const,
  reviewedHtmlSha256: "e90a73e7ae018290cf682952c586c8bf6649d040064391ff6e3ca9c352a60593" as const,
  reviewedJsonSha256: "eb250bfc5958b7fc9baf3a35e2ebac3e02122f37ab4cf7522c81405d4efaf3ab" as const,
  canonicalLocalizedLearnerContentSha256: "5636b216409fa487a3cbdd41f79bdc3606c411298b266b717d51aeba3fbf2213" as const,
  locales: ["hi-IN", "pa-IN"] as const,
  permanentQlCount: 8 as const,
  sourceModeCount: 19 as const,
  reviewCaseletCount: 76 as const,
  reviewQuestionCount: 304 as const,
  questionStyle: "EXAM_LIKE_SIMPLE_NATURAL" as const,
  explanationStyle: "SIMPLE_NATURAL_WORKED_SOLUTION" as const,
  machineObjectsTranslated: false as const,
  englishFreezePreserved: true as const,
  localizationFreeze: true as const,
  questionStudioIntegrationAllowed: true as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

export type IopFrozenLocalizedCaselet = Omit<IopLocalizedCaselet, "lifecycle"> & Readonly<{
  lifecycle: Readonly<{
    maturity: "MULTILINGUAL_FROZEN";
    englishFreeze: true;
    hindiPunjabiStatus: "FROZEN_V1";
    localizationFreeze: true;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>;
}>;

export function freezeIop001LocalizedCaselet(caselet: IopLocalizedCaselet): IopFrozenLocalizedCaselet {
  return {
    ...caselet,
    lifecycle: {
      maturity: "MULTILINGUAL_FROZEN",
      englishFreeze: true,
      hindiPunjabiStatus: "FROZEN_V1",
      localizationFreeze: true,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  };
}

export function generateIopFrozenLocalizedReviewCaselet(
  seed: string,
  qlId: IopPermanentQlId,
  sourceModeId: string,
  locale: IopLocalizedLocale,
): IopFrozenLocalizedCaselet {
  return freezeIop001LocalizedCaselet(generateIopLocalizedReviewCaseletV1(seed, qlId, sourceModeId, locale));
}
