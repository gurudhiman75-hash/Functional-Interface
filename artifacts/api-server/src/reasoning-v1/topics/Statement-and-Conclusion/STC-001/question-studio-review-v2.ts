import { generateStcV2EditorialQuestion } from "./editorial-v2-generator.ts";
import { generateStcV2FiveWayQuestion } from "./editorial-v2-five-way-profile.ts";
import { STC_QL_IDS, type StcLocale, type StcQlId } from "./types.ts";

export const STC_001_V2_QUESTION_STUDIO_PACKAGE_ID = "STC-001-V2-EDITORIAL-REVIEW" as const;
export const STC_001_V2_QUESTION_STUDIO_REVIEW_AUTHORITY = "STC-001-QUESTION-STUDIO-V2-TRILINGUAL" as const;
export const STC_001_V2_QUESTION_STUDIO_REVIEW_STATUS = "STC_V2_TRILINGUAL_REVIEW_ONLY" as const;

export type StcV2QuestionStudioPresentationProfile = "FOUR_WAY" | "FIVE_WAY_EITHER";

export type PreviewStc001V2QuestionStudioInput = Readonly<{
  qlId: StcQlId;
  locale: StcLocale;
  seed: number;
  presentationProfile?: StcV2QuestionStudioPresentationProfile;
}>;

export const STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  packageId: STC_001_V2_QUESTION_STUDIO_PACKAGE_ID,
  chapterId: "STC-001" as const,
  subjectCode: "REAS-STC" as const,
  title: "Statement & Conclusion — V2 Trilingual Review",
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
  locales: Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const),
  localizationStatus: "TRILINGUAL_REVIEW_READY" as const,
  localizedReviewSurfaceCount: 144 as const,
  localizationParityAuthority: "SCENARIO_ID_ANSWER_CLASS_INDEX_SURFACE_LOCK_V2" as const,
  presentationProfiles: Object.freeze(["FOUR_WAY", "FIVE_WAY_EITHER"] as const),
  dedicatedFiveWayEitherAuthorityCount: 8 as const,
  fiveWayEitherStatus: "V2_SOLVER_VALIDATED_REVIEW_READY" as const,
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
  const presentationProfile = input.presentationProfile ?? "FOUR_WAY";
  const question = presentationProfile === "FIVE_WAY_EITHER"
    ? generateStcV2FiveWayQuestion({ qlId: input.qlId, locale: input.locale, seed: input.seed })
    : generateStcV2EditorialQuestion({ qlId: input.qlId, locale: input.locale, seed: input.seed });

  return Object.freeze({
    packageId: STC_001_V2_QUESTION_STUDIO_PACKAGE_ID,
    integrationAuthority: STC_001_V2_QUESTION_STUDIO_REVIEW_AUTHORITY,
    reviewStatus: STC_001_V2_QUESTION_STUDIO_REVIEW_STATUS,
    lifecycleStatus: "REVIEW_ONLY" as const,
    reviewOnly: true as const,
    localizationStatus: STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.localizationStatus,
    presentationProfile,
    question,
  });
}

export function assertStc001V2QuestionStudioPersistenceAllowed(): never {
  throw new Error(
    "STC-001 V2 is trilingual Question Studio review-only; Question Bank/test/mock/public delivery remains locked until a separate explicit learner-release approval.",
  );
}
