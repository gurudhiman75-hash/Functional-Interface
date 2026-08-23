import {
  SEA002_CP006_QUESTION_BANK_ACCEPTANCE,
  SEA002_CP006_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
} from "./question-bank-acceptance.ts";
import {
  SEA002_CP006_ENGLISH_FREEZE,
  SEA002_CP006_LOCALIZATION_FREEZE,
  SEA002_CP006_PERMANENT_QL_IDS,
} from "./permanent/freeze.ts";

export const SEA002_CP006_COMPLETION_AUTHORITY_ID =
  "SEA002_CP006_AUTHORING_AND_BANK_COMPLETION_V1" as const;

export const SEA002_CP006_COMPLETION_AUTHORITY = Object.freeze({
  authorityId: SEA002_CP006_COMPLETION_AUTHORITY_ID,
  checkpointId: "SEA-CP-006" as const,
  status: "COMPLETE_FOR_QUESTION_STUDIO_AND_BANK_ACCEPTANCE" as const,
  permanentQlIds: SEA002_CP006_PERMANENT_QL_IDS,
  nextPermanentQlId: "SEA-QL-025" as const,
  nextCheckpointId: "SEA-CP-007" as const,
  freezes: Object.freeze({
    englishFingerprint: SEA002_CP006_ENGLISH_FREEZE.approvedReviewFingerprint,
    localizedFingerprint: SEA002_CP006_LOCALIZATION_FREEZE.approvedLocalizedReviewFingerprint,
    englishFrozen: true as const,
    hindiPunjabiFrozen: true as const,
  }),
  authoringLifecycle: Object.freeze({
    questionStudioActive: true as const,
    supportedLanguages: ["en", "hi", "pa"] as const,
    supportedDifficulties: ["Easy", "Medium", "Hard"] as const,
    questionBankAcceptanceActive: true as const,
    questionBankAcceptanceAuthority: SEA002_CP006_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
    questionBankAcceptanceMode: "BANK_ONLY" as const,
    manualApprovalRequired: true as const,
  }),
  downstreamLifecycle: SEA002_CP006_QUESTION_BANK_ACCEPTANCE.downstreamLifecycle,
  closureRules: Object.freeze({
    sourceGeneratorReopened: false as const,
    frozenContentRewritten: false as const,
    newPermanentQlAllocatedForAcceptance: false as const,
    testReleaseIncludedInCp006Completion: false as const,
    publicPublicationIncludedInCp006Completion: false as const,
  }),
});
