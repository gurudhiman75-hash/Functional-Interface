import { generateStcV2EditorialQuestion } from "./editorial-v2-generator.ts";
import { STC_QL_IDS, type StcQlId } from "./types.ts";

export const STC_001_V2_QUESTION_STUDIO_PACKAGE_ID = "STC-001-V2-EDITORIAL-REVIEW" as const;
export const STC_001_V2_QUESTION_STUDIO_REVIEW_AUTHORITY = "STC-001-QUESTION-STUDIO-V2-EDITORIAL" as const;
export const STC_001_V2_QUESTION_STUDIO_REVIEW_STATUS = "STC_V2_EDITORIAL_REVIEW_ONLY" as const;

export type PreviewStc001V2QuestionStudioInput = Readonly<{
  qlId: StcQlId;
  locale: "en-IN";
  seed: number;
}>;

export const STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  packageId: STC_001_V2_QUESTION_STUDIO_PACKAGE_ID,
  chapterId: "STC-001" as const,
  subjectCode: "REAS-STC" as const,
  title: "Statement & Conclusion — V2 Editorial Review",
  version: "V2" as const,
  integrationAuthority: STC_001_V2_QUESTION_STUDIO_REVIEW_AUTHORITY,
  reviewStatus: STC_001_V2_QUESTION_STUDIO_REVIEW_STATUS,
  reopenReason: "PRODUCT_OWNER_REJECTED_V1_STEM_EXAM_REALNESS_AND_SURFACE_SAMENESS_2026_08_30" as const,
  supersedesForActiveReview: "STC-001-V1-FROZEN-REVIEW" as const,
  v1AuditSnapshotPreserved: true as const,
  permanentQlCount: 6 as const,
  permanentQlIds: STC_QL_IDS,
  editorialAuthorityCount: 48 as const,
  editorialAuthoritiesPerQl: 8 as const,
  requiredDistinctSurfaceArchetypesPerQl: 8 as const,
  answerClassTargetPerQl: Object.freeze({ ONLY_I: 2, ONLY_II: 2, BOTH: 2, NEITHER: 2 } as const),
  locales: Object.freeze(["en-IN"] as const),
  localizationStatus: "PENDING_AFTER_ENGLISH_EDITORIAL_APPROVAL" as const,
  presentationProfiles: Object.freeze(["FOUR_WAY"] as const),
  fiveWayEitherStatus: "V1_ONLY_PENDING_V2_EDITORIAL_REBUILD" as const,
  repeatedInstructionEmbeddedInStem: false as const,
  enabled: true as const,
  questionStudioVisible: true as const,
  questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
  reviewOnly: true as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  manualReleaseApprovalRequired: true as const,
});

export function previewStc001V2QuestionStudioReview(input: PreviewStc001V2QuestionStudioInput) {
  return Object.freeze({
    packageId: STC_001_V2_QUESTION_STUDIO_PACKAGE_ID,
    integrationAuthority: STC_001_V2_QUESTION_STUDIO_REVIEW_AUTHORITY,
    reviewStatus: STC_001_V2_QUESTION_STUDIO_REVIEW_STATUS,
    lifecycleStatus: "REVIEW_ONLY" as const,
    reviewOnly: true as const,
    localizationStatus: STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.localizationStatus,
    presentationProfile: "FOUR_WAY" as const,
    question: generateStcV2EditorialQuestion(input),
  });
}

export function assertStc001V2QuestionStudioPersistenceAllowed(): never {
  throw new Error(
    "STC-001 V2 is an English editorial review candidate only; Question Bank/test/mock/public delivery remains locked until explicit editorial, localization and release approvals.",
  );
}
