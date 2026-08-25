import {
  DSF_CP008_CHECKPOINT_ID,
  DSF_CP008_LOCALIZATION_AUTHORITY,
  DSF_CP008_LOCALIZATION_REVIEW_PACKAGE,
  generateDsfLocalizedExamProfileBatch,
  type DsfLocalizationInput,
  type DsfLocalizedExamProfileQuestion,
} from "../DSF-CP-008/localization-review-v1.ts";

export const DSF_CP009_CHECKPOINT_ID = "DSF-CP-009" as const;
export const DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY =
  "DSF_CP009_HI_PA_LOCALIZATION_APPROVAL_RELEASE_V1" as const;
export const DSF_CP009_APPROVAL_STATUS = "PRODUCT_OWNER_APPROVED" as const;
export const DSF_CP009_RELEASE_STATUS = "LOCALIZED_PRODUCTION_RELEASED" as const;
export const DSF_CP009_APPROVAL_DATE = "2026-08-24" as const;
export const DSF_CP009_REVIEW_PACK_ID = "DSF-CP008-HI-PA-REVIEW-62-2026-08-23" as const;

export const DSF_CP009_LOCALIZATION_APPROVAL = Object.freeze({
  checkpointId: DSF_CP009_CHECKPOINT_ID,
  authority: DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,
  status: DSF_CP009_APPROVAL_STATUS,
  releaseStatus: DSF_CP009_RELEASE_STATUS,
  approvedAt: DSF_CP009_APPROVAL_DATE,
  approvedLanguages: ["hi", "pa"] as const,
  approvedLocales: ["hi-IN", "pa-IN"] as const,
  reviewPackId: DSF_CP009_REVIEW_PACK_ID,
  reviewQuestionCount: 62 as const,
  hindiQuestionCount: 31 as const,
  punjabiQuestionCount: 31 as const,
  semanticParityAuthority: DSF_CP008_LOCALIZATION_AUTHORITY,
  sourceLocalizationCheckpointId: DSF_CP008_CHECKPOINT_ID,
  sourceReviewStatus: DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.localizationStatus,
  permanentQlIds: DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.permanentQlIds,
  nextAvailableQlId: DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.nextAvailableQlId,
  newPermanentQlAllocated: false as const,
  canonicalSemanticsReopened: false as const,
  answerProfileSemanticOrderRewritten: false as const,
  punjabSpecificAnswerProfileEnabled: false as const,
  automaticStudentPublicationEnabled: false as const,
});

export type DsfApprovedLocalizedExamProfileQuestion = Omit<
  DsfLocalizedExamProfileQuestion,
  "localization" | "lifecycle"
> & {
  readonly localizationApprovalCheckpointId: typeof DSF_CP009_CHECKPOINT_ID;
  readonly localizationApprovalAuthority: typeof DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY;
  readonly localizationApproval: typeof DSF_CP009_LOCALIZATION_APPROVAL;
  readonly localization: Omit<
    DsfLocalizedExamProfileQuestion["localization"],
    "status" | "humanLanguageReviewRequired" | "activeEditorialBlockers"
  > & {
    readonly status: typeof DSF_CP009_APPROVAL_STATUS;
    readonly humanLanguageReviewRequired: false;
    readonly activeEditorialBlockers: readonly [];
    readonly approvalCheckpointId: typeof DSF_CP009_CHECKPOINT_ID;
    readonly approvalAuthority: typeof DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY;
    readonly approvedAt: typeof DSF_CP009_APPROVAL_DATE;
    readonly reviewPackId: typeof DSF_CP009_REVIEW_PACK_ID;
  };
  readonly lifecycle: {
    readonly questionStudioDiscoverable: true;
    readonly persistenceAllowed: true;
    readonly reviewOnly: false;
    readonly questionBankStatus: "READY_FOR_STORAGE";
    readonly questionBankWritable: true;
    readonly questionBankAcceptanceMode: "FULL_RELEASE";
    readonly manualQuestionPublicationRequired: true;
    readonly testEligibility: "ELIGIBLE";
    readonly testEligible: true;
    readonly mockTestEligible: true;
    readonly publiclyPublishable: true;
    readonly manualApprovalRequired: true;
    readonly automaticStudentPublication: false;
  };
};

function releaseLocalizedQuestion(
  question: DsfLocalizedExamProfileQuestion,
): DsfApprovedLocalizedExamProfileQuestion {
  return Object.freeze({
    ...question,
    localizationApprovalCheckpointId: DSF_CP009_CHECKPOINT_ID,
    localizationApprovalAuthority: DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,
    localizationApproval: DSF_CP009_LOCALIZATION_APPROVAL,
    localization: {
      ...question.localization,
      status: DSF_CP009_APPROVAL_STATUS,
      humanLanguageReviewRequired: false,
      activeEditorialBlockers: [],
      approvalCheckpointId: DSF_CP009_CHECKPOINT_ID,
      approvalAuthority: DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,
      approvedAt: DSF_CP009_APPROVAL_DATE,
      reviewPackId: DSF_CP009_REVIEW_PACK_ID,
    },
    lifecycle: {
      questionStudioDiscoverable: true,
      persistenceAllowed: true,
      reviewOnly: false,
      questionBankStatus: "READY_FOR_STORAGE",
      questionBankWritable: true,
      questionBankAcceptanceMode: "FULL_RELEASE",
      manualQuestionPublicationRequired: true,
      testEligibility: "ELIGIBLE",
      testEligible: true,
      mockTestEligible: true,
      publiclyPublishable: true,
      manualApprovalRequired: true,
      automaticStudentPublication: false,
    },
  });
}

export function generateDsfApprovedLocalizedExamProfileBatch(input: DsfLocalizationInput) {
  const source = generateDsfLocalizedExamProfileBatch(input);
  const questions = source.questions.map(releaseLocalizedQuestion);
  return Object.freeze({
    ...source,
    localizationApprovalCheckpointId: DSF_CP009_CHECKPOINT_ID,
    localizationApprovalAuthority: DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,
    localizationApproval: DSF_CP009_LOCALIZATION_APPROVAL,
    questions,
    reviewOnly: false as const,
    humanLanguageReviewRequired: false as const,
    questionBankWritable: true as const,
    questionBankAcceptanceMode: "FULL_RELEASE" as const,
    manualQuestionPublicationRequired: true as const,
    testEligibility: "ELIGIBLE" as const,
    testEligible: true as const,
    mockTestEligible: true as const,
    publiclyPublishable: true as const,
    automaticStudentPublication: false as const,
  });
}

export const DSF_CP009_LOCALIZATION_RELEASE_PACKAGE = Object.freeze({
  ...DSF_CP008_LOCALIZATION_REVIEW_PACKAGE,
  label: "Data Sufficiency · English/Hindi/Punjabi production release",
  localizationApprovalCheckpointId: DSF_CP009_CHECKPOINT_ID,
  localizationApprovalAuthority: DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,
  localizationApprovalStatus: DSF_CP009_APPROVAL_STATUS,
  localizationReleaseStatus: DSF_CP009_RELEASE_STATUS,
  localizationApprovalDate: DSF_CP009_APPROVAL_DATE,
  localizationReviewPackId: DSF_CP009_REVIEW_PACK_ID,
  productionLanguages: ["en", "hi", "pa"] as const,
  localizationReviewLanguages: [] as const,
  localizationStatus: DSF_CP009_APPROVAL_STATUS,
  humanLanguageReviewRequired: false as const,
  localizedQuestionBankWritable: true as const,
  localizedTestEligible: true as const,
  localizedMockTestEligible: true as const,
  localizedPubliclyPublishable: true as const,
  localizedAutomaticStudentPublication: false as const,
  localizationEditorialBlockers: [] as const,
  perLanguageLifecycle: {
    en: {
      status: "PRODUCTION_READY_FROZEN" as const,
      questionBankWritable: true as const,
      testEligible: true as const,
      mockTestEligible: true as const,
      publiclyPublishable: true as const,
      automaticStudentPublication: false as const,
    },
    hi: {
      status: "LOCALIZED_PRODUCTION_READY" as const,
      questionBankWritable: true as const,
      testEligible: true as const,
      mockTestEligible: true as const,
      publiclyPublishable: true as const,
      automaticStudentPublication: false as const,
    },
    pa: {
      status: "LOCALIZED_PRODUCTION_READY" as const,
      questionBankWritable: true as const,
      testEligible: true as const,
      mockTestEligible: true as const,
      publiclyPublishable: true as const,
      automaticStudentPublication: false as const,
    },
  },
});
