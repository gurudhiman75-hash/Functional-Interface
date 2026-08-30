import { generateStcV22Question, STC_V22_SEMANTIC_SURFACE_CAPACITY_PER_QL, STC_V22_TEMPLATE_COUNT_PER_QL, STC_V22_VARIANTS_PER_TEMPLATE } from "./editorial-v2-2-generator.ts";
import { STC_QL_IDS, type StcLocale, type StcQlId } from "./types.ts";

export const STC_001_V22_QUESTION_STUDIO_PACKAGE_ID = "STC-001-V2-2-SATURATED-REVIEW" as const;
export const STC_001_V22_QUESTION_STUDIO_REVIEW_AUTHORITY = "STC-001-QUESTION-STUDIO-V2-2-VARIABLEIZED" as const;
export const STC_001_V22_QUESTION_STUDIO_REVIEW_STATUS = "STC_V2_2_TRILINGUAL_SATURATION_READY_REVIEW_ONLY" as const;

export type PreviewStc001V22QuestionStudioInput = Readonly<{
  qlId: StcQlId;
  locale: StcLocale;
  seed: number;
  presentationProfile?: "FOUR_WAY";
}>;

export const STC_001_V22_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  packageId: STC_001_V22_QUESTION_STUDIO_PACKAGE_ID,
  chapterId: "STC-001" as const,
  subjectCode: "REAS-STC" as const,
  title: "Statement & Conclusion — V2.2 Variableized Trilingual Review",
  version: "V2.2" as const,
  integrationAuthority: STC_001_V22_QUESTION_STUDIO_REVIEW_AUTHORITY,
  reviewStatus: STC_001_V22_QUESTION_STUDIO_REVIEW_STATUS,
  supersedesForActiveReview: "STC-001-V2-EDITORIAL-REVIEW" as const,
  v21AuditSnapshotPreserved: true as const,
  v1AuditSnapshotPreserved: true as const,
  permanentQlCount: 6 as const,
  permanentQlIds: STC_QL_IDS,
  templatesPerQl: STC_V22_TEMPLATE_COUNT_PER_QL,
  variantsPerTemplate: STC_V22_VARIANTS_PER_TEMPLATE,
  semanticSurfaceCapacityPerQl: STC_V22_SEMANTIC_SURFACE_CAPACITY_PER_QL,
  requiredDistinctSurfaceArchetypesPerQl: 8 as const,
  minimumDistinctQuestionsPerQlForGenerationReady: 1000 as const,
  saturationStatus: "READY_2048_UNIQUE_SEMANTIC_SURFACES_PER_QL" as const,
  currentGenerationReady: true as const,
  antiGamingScheduler: "STC_V2_2_BIJECTIVE_2048_SURFACE" as const,
  locales: Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const),
  localizationStatus: "TRILINGUAL_TEMPLATE_PARITY_READY" as const,
  presentationProfiles: Object.freeze(["FOUR_WAY"] as const),
  bankingFiveWayEitherStatus: "REMOVED_FROM_ACTIVE_NON_SYLLOGISTIC_STC" as const,
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

export function previewStc001V22QuestionStudioReview(input: PreviewStc001V22QuestionStudioInput) {
  if (input.presentationProfile && input.presentationProfile !== "FOUR_WAY") {
    throw new Error("STC-001 V2.2 exposes only the non-syllogistic FOUR_WAY profile.");
  }
  return Object.freeze({
    packageId: STC_001_V22_QUESTION_STUDIO_PACKAGE_ID,
    integrationAuthority: STC_001_V22_QUESTION_STUDIO_REVIEW_AUTHORITY,
    reviewStatus: STC_001_V22_QUESTION_STUDIO_REVIEW_STATUS,
    lifecycleStatus: "REVIEW_ONLY" as const,
    reviewOnly: true as const,
    generationReady: true as const,
    saturationStatus: STC_001_V22_QUESTION_STUDIO_REVIEW_PACKAGE.saturationStatus,
    localizationStatus: STC_001_V22_QUESTION_STUDIO_REVIEW_PACKAGE.localizationStatus,
    presentationProfile: "FOUR_WAY" as const,
    question: generateStcV22Question(input),
  });
}

export function assertStc001V22QuestionStudioPersistenceAllowed(): never {
  throw new Error(
    "STC-001 V2.2 is generation-ready inside Question Studio review, but Question Bank/test/mock/public delivery remains locked until separate explicit learner-release approval.",
  );
}
