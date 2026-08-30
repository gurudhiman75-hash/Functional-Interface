import { generateStcV2EditorialQuestion } from "./editorial-v2-generator.ts";
import { STC_QL_IDS, type StcLocale, type StcQlId } from "./types.ts";

export const STC_001_V2_QUESTION_STUDIO_PACKAGE_ID = "STC-001-V2-EDITORIAL-REVIEW" as const;
export const STC_001_V2_QUESTION_STUDIO_REVIEW_AUTHORITY = "STC-001-QUESTION-STUDIO-V2-1-ANTIGAMING" as const;
export const STC_001_V2_QUESTION_STUDIO_REVIEW_STATUS = "STC_V2_1_TRILINGUAL_SATURATION_BLOCKED_REVIEW_ONLY" as const;

export type StcV2QuestionStudioPresentationProfile = "FOUR_WAY";

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
  title: "Statement & Conclusion — V2.1 Trilingual Review",
  version: "V2.1" as const,
  integrationAuthority: STC_001_V2_QUESTION_STUDIO_REVIEW_AUTHORITY,
  reviewStatus: STC_001_V2_QUESTION_STUDIO_REVIEW_STATUS,
  reopenReason: "FINAL_AUDIT_FOUND_POOL_SATURATION_AND_ANSWER_SEQUENCE_DEFECTS_2026_08_30" as const,
  supersedesForActiveReview: "STC-001-V2-EDITORIAL-REVIEW" as const,
  v1AuditSnapshotPreserved: true as const,
  permanentQlCount: 6 as const,
  permanentQlIds: STC_QL_IDS,
  editorialAuthorityCount: 48 as const,
  editorialAuthoritiesPerQl: 8 as const,
  requiredDistinctSurfaceArchetypesPerQl: 8 as const,
  canonicalAnswerClassTargetPerQl: Object.freeze({ ONLY_I: 2, ONLY_II: 2, BOTH: 2, NEITHER: 2 } as const),
  antiGamingScheduler: "STC_V2_1_NON_PERIODIC_16_SLOT" as const,
  conclusionOrderPresentationsPerAuthority: 2 as const,
  maximumDistinctCuratedPresentationsPerQlBeforeVariableization: 16 as const,
  locales: Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const),
  localizationStatus: "TRILINGUAL_REVIEW_READY" as const,
  localizationParityAuthority: "SCENARIO_ID_ANSWER_CLASS_INDEX_SURFACE_LOCK_V2_1" as const,
  presentationProfiles: Object.freeze(["FOUR_WAY"] as const),
  bankingFiveWayEitherStatus: "REMOVED_FROM_ACTIVE_NON_SYLLOGISTIC_STC" as const,
  archivedSolverValidatedFiveWayEitherAuthorityCount: 8 as const,
  bankingFiveWayBoundaryReason: "CURRENT_BANK_EXAM_EITHER_OR_IS_PRIMARILY_SYLLOGISM_OR_INEQUALITY_AND_IS_HANDLED_BY_SEPARATE_EXAMTREE_FAMILIES" as const,
  repeatedInstructionEmbeddedInStem: false as const,
  saturationStatus: "BLOCKED_NEEDS_VARIABLEIZED_SURFACE_ENGINE" as const,
  minimumDistinctQuestionsPerQlForGenerationReady: 1000 as const,
  currentGenerationReady: false as const,
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
  if (input.presentationProfile && input.presentationProfile !== "FOUR_WAY") {
    throw new Error("STC-001 V2.1 exposes only the non-syllogistic FOUR_WAY profile; Banking either/or belongs to separate syllogism/inequality families.");
  }

  return Object.freeze({
    packageId: STC_001_V2_QUESTION_STUDIO_PACKAGE_ID,
    integrationAuthority: STC_001_V2_QUESTION_STUDIO_REVIEW_AUTHORITY,
    reviewStatus: STC_001_V2_QUESTION_STUDIO_REVIEW_STATUS,
    lifecycleStatus: "REVIEW_ONLY" as const,
    reviewOnly: true as const,
    generationReady: false as const,
    saturationStatus: STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.saturationStatus,
    localizationStatus: STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.localizationStatus,
    presentationProfile: "FOUR_WAY" as const,
    question: generateStcV2EditorialQuestion(input),
  });
}

export function assertStc001V2QuestionStudioPersistenceAllowed(): never {
  throw new Error(
    "STC-001 V2.1 remains Question Studio review-only and is not saturation-ready; Question Bank/test/mock/public delivery remains locked until variableized generation saturation and separate explicit learner-release approval.",
  );
}
