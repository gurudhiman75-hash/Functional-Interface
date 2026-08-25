import { createHash } from "node:crypto";

import { DSF_CP001_FREEZE_AUTHORITY } from "../DSF-CP-001/cp001-freeze-authority.ts";
import { DSF_CP003_EXAM_PROFILE_REVIEW_APPROVAL } from "../DSF-CP-003/exam-answer-profiles-approval-v1.ts";
import { DSF_CP004_QUESTION_BANK_ACCEPTANCE } from "../DSF-CP-004/question-bank-acceptance-v1.ts";
import { DSF_CP005_TEST_RELEASE } from "../DSF-CP-005/test-release-v1.ts";
import { DSF_CP006_MOCK_TEST_RELEASE } from "../DSF-CP-006/mock-test-release-v1.ts";
import { DSF_CP007_PRODUCTION_READINESS_FREEZE } from "../DSF-CP-007/production-readiness-freeze-v1.ts";
import {
  DSF_CP008_LOCALIZATION_AUTHORITY,
  DSF_CP008_LOCALIZATION_REVIEW_PACKAGE,
} from "../DSF-CP-008/localization-review-v1.ts";
import {
  DSF_CP009_LOCALIZATION_APPROVAL,
  DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,
  DSF_CP009_LOCALIZATION_RELEASE_PACKAGE,
} from "../DSF-CP-009/localization-approval-release-v1.ts";

export const DSF_CP010_CHECKPOINT_ID = "DSF-CP-010" as const;
export const DSF_CP010_MULTILINGUAL_PRODUCTION_FREEZE_AUTHORITY =
  "DSF_CP010_MULTILINGUAL_PRODUCTION_READINESS_FREEZE_V1" as const;
export const DSF_CP010_STATUS = "PRODUCTION_READY_MULTILINGUAL_FROZEN" as const;
export const DSF_CP010_CHAPTER_STATUS = "CLOSED_CURRENT_APPROVED_SCOPE" as const;
export const DSF_CP010_FREEZE_DATE = "2026-08-24" as const;

const FINGERPRINT_CONTRACT = Object.freeze({
  packageId: "DSF-001",
  qlIds: ["DSF-QL-001"],
  nextAvailableQlId: "DSF-QL-002",
  languages: ["en", "hi", "pa"],
  locales: ["en-IN", "hi-IN", "pa-IN"],
  domains: ["NUMBER_SYSTEM", "RATIO_PROPORTION", "PERCENTAGE", "ALGEBRA"],
  solveModeCount: 8,
  answerProfileCount: 5,
  canonicalSemanticClassCount: 5,
  supportedExamFamilies: ["BANKING", "SSC"],
  automaticStudentPublication: false,
  punjabSpecificAnswerProfileEnabled: false,
  threeStatementDataSufficiencyEnabled: false,
  reasoningWorldAdaptersEnabled: false,
});

export const DSF_CP010_FREEZE_FINGERPRINT = createHash("sha256")
  .update(JSON.stringify(FINGERPRINT_CONTRACT))
  .digest("hex");

export const DSF_CP010_MULTILINGUAL_PRODUCTION_FREEZE = Object.freeze({
  authorityId: DSF_CP010_MULTILINGUAL_PRODUCTION_FREEZE_AUTHORITY,
  checkpointId: DSF_CP010_CHECKPOINT_ID,
  status: DSF_CP010_STATUS,
  chapterStatus: DSF_CP010_CHAPTER_STATUS,
  frozenAt: DSF_CP010_FREEZE_DATE,
  packageId: "DSF-001" as const,
  learnerChapter: "Data Sufficiency" as const,
  freezeFingerprint: DSF_CP010_FREEZE_FINGERPRINT,
  permanentQlIds: ["DSF-QL-001"] as const,
  nextAvailableQlId: "DSF-QL-002" as const,

  pinnedAuthorities: {
    semanticSourceFreeze: DSF_CP001_FREEZE_AUTHORITY.authorityId,
    examProfileApproval: DSF_CP003_EXAM_PROFILE_REVIEW_APPROVAL.authorityId,
    questionBankAcceptance: DSF_CP004_QUESTION_BANK_ACCEPTANCE.authorityId,
    scoredTestRelease: DSF_CP005_TEST_RELEASE.authorityId,
    mockTestRelease: DSF_CP006_MOCK_TEST_RELEASE.authorityId,
    englishProductionFreeze: DSF_CP007_PRODUCTION_READINESS_FREEZE.authorityId,
    localizationParity: DSF_CP008_LOCALIZATION_AUTHORITY,
    localizationApprovalRelease: DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,
  },

  productionScope: {
    languages: ["en", "hi", "pa"] as const,
    locales: ["en-IN", "hi-IN", "pa-IN"] as const,
    supportedExamFamilies: ["BANKING", "SSC"] as const,
    productionDomains: [
      "NUMBER_SYSTEM",
      "RATIO_PROPORTION",
      "PERCENTAGE",
      "ALGEBRA",
    ] as const,
    solveModeCount: 8 as const,
    answerProfileCount: 5 as const,
    canonicalSemanticClassCount: 5 as const,
    localizationReviewLanguages: [] as const,
  },

  releaseLifecycle: {
    questionStudioDiscoverable: true as const,
    persistenceAllowed: true as const,
    manualGenerationApprovalRequired: true as const,
    questionBankStatus: "READY_FOR_STORAGE" as const,
    questionBankWritable: true as const,
    questionBankAcceptanceMode: "FULL_RELEASE" as const,
    manualQuestionPublicationRequired: true as const,
    testEligibility: "ELIGIBLE" as const,
    testEligible: true as const,
    publiclyPublishable: true as const,
    mockTestEligible: true as const,
    automaticStudentPublication: false as const,
  },

  studentDelivery: {
    mode: "CANONICAL_MANUAL_TEST_PUBLICATION" as const,
    generatedQuestionAutoPublish: false as const,
    questionMustBePublished: true as const,
    testMustPassCanonicalValidation: true as const,
    testMustPassQaOrReleaseLifecycle: true as const,
    studentSeriesRequiresLivePublishedTest: true as const,
    directDsfStudentEndpointAdded: false as const,
  },

  historicalBoundaries: {
    cp007RemainsEnglishOnlyHistoricalFreeze:
      DSF_CP007_PRODUCTION_READINESS_FREEZE.productionScope.language === "en",
    cp008RemainsReviewOnlyHistoricalCheckpoint:
      DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.humanLanguageReviewRequired === true &&
      DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.localizedQuestionBankWritable === false,
    cp009ApprovalPreserved:
      DSF_CP009_LOCALIZATION_APPROVAL.status === "PRODUCT_OWNER_APPROVED",
    oldCp008ItemsRetroactivelyUpgraded: false as const,
  },

  boundaries: {
    cp001SemanticRuntimeReopened: false as const,
    newPermanentQlAllocated: false as const,
    sscUnrepresentableClassRemappingAllowed: false as const,
    punjabSpecificAnswerProfileEnabled: false as const,
    threeStatementDataSufficiencyEnabled: false as const,
    reasoningWorldAdaptersEnabled: false as const,
    automaticStudentPublicationEnabled: false as const,
    manualSafetyGatesBypassed: false as const,
  },

  closure: {
    multilingualApprovedScopeExamReady: true as const,
    multilingualApprovedScopeProductionReady: true as const,
    multilingualApprovedScopeFrozen: true as const,
    chapterClosedForCurrentApprovedScope: true as const,
    futureExpansionRequiresNewCheckpoint: true as const,
    expansionCandidates: [
      "PUNJAB_OFFICIAL_ANSWER_PROFILE_EVIDENCE",
      "THREE_STATEMENT_DATA_SUFFICIENCY",
      "REASONING_WORLD_ADAPTERS",
    ] as const,
  },
});

export function assertDsfCp010FreezeInvariant(): void {
  const freeze = DSF_CP010_MULTILINGUAL_PRODUCTION_FREEZE;
  if (DSF_CP001_FREEZE_AUTHORITY.status !== "FROZEN") {
    throw new Error("DSF CP-010 cannot freeze an unfrozen semantic source.");
  }
  if (DSF_CP009_LOCALIZATION_APPROVAL.status !== "PRODUCT_OWNER_APPROVED") {
    throw new Error("DSF CP-010 requires product-owner Hindi/Punjabi approval.");
  }
  if (DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.productionLanguages.join(",") !== "en,hi,pa") {
    throw new Error("DSF CP-010 requires English/Hindi/Punjabi production scope.");
  }
  if (DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.localizationReviewLanguages.length !== 0) {
    throw new Error("DSF CP-010 cannot freeze while localization review languages remain open.");
  }
  if (freeze.permanentQlIds.length !== 1 || freeze.permanentQlIds[0] !== "DSF-QL-001") {
    throw new Error("DSF CP-010 permanent QL identity changed.");
  }
  if (freeze.nextAvailableQlId !== "DSF-QL-002") {
    throw new Error("DSF CP-010 next QL identity changed.");
  }
  if (freeze.productionScope.solveModeCount !== 8 || freeze.productionScope.answerProfileCount !== 5) {
    throw new Error("DSF CP-010 production matrix dimensions changed.");
  }
  if (freeze.releaseLifecycle.automaticStudentPublication) {
    throw new Error("DSF CP-010 must not enable automatic student publication.");
  }
  if (!freeze.historicalBoundaries.cp007RemainsEnglishOnlyHistoricalFreeze) {
    throw new Error("DSF CP-007 historical English freeze was rewritten.");
  }
  if (!freeze.historicalBoundaries.cp008RemainsReviewOnlyHistoricalCheckpoint) {
    throw new Error("DSF CP-008 historical localization review boundary was rewritten.");
  }
  if (!freeze.historicalBoundaries.cp009ApprovalPreserved) {
    throw new Error("DSF CP-009 localization approval was lost.");
  }
  if (!/^[0-9a-f]{64}$/.test(freeze.freezeFingerprint)) {
    throw new Error("DSF CP-010 freeze fingerprint is invalid.");
  }
}

assertDsfCp010FreezeInvariant();

export const DSF_CP010_MULTILINGUAL_PRODUCTION_PACKAGE = Object.freeze({
  ...DSF_CP009_LOCALIZATION_RELEASE_PACKAGE,
  label: "Data Sufficiency · English/Hindi/Punjabi production · final frozen scope",
  productionReadinessFreezeCheckpointId: DSF_CP010_CHECKPOINT_ID,
  productionReadinessFreezeAuthority: DSF_CP010_MULTILINGUAL_PRODUCTION_FREEZE_AUTHORITY,
  productionReadinessFreezeStatus: DSF_CP010_STATUS,
  productionReadinessFreezeFingerprint: DSF_CP010_FREEZE_FINGERPRINT,
  chapterStatus: DSF_CP010_CHAPTER_STATUS,
  chapterClosedForCurrentApprovedScope: true as const,
  productionLanguages: ["en", "hi", "pa"] as const,
  localizationReviewLanguages: [] as const,
  automaticStudentPublication: false as const,
});
