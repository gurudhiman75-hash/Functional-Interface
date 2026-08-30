import { generateStcQuestion } from "./chapter-generator.ts";
import { generateStcFiveWayQuestion } from "./five-way-profile.ts";
import { STC_QL_IDS, type StcLocale, type StcQlId } from "./types.ts";
import { STC_001_CHAPTER_FREEZE_V1 } from "./chapter-freeze-v1-manifest.ts";

export const STC_001_QUESTION_STUDIO_PACKAGE_ID = "STC-001-V1-FROZEN-REVIEW" as const;
export const STC_001_QUESTION_STUDIO_REVIEW_AUTHORITY = "STC-001-QUESTION-STUDIO-V1-FROZEN" as const;
export const STC_001_QUESTION_STUDIO_REVIEW_STATUS = "STC_V1_FROZEN_REVIEW_ONLY" as const;
export const STC_001_QUESTION_STUDIO_RELEASE_FREEZE = STC_001_CHAPTER_FREEZE_V1.freezeId;

export type StcQuestionStudioPresentationProfile = "FOUR_WAY" | "FIVE_WAY_EITHER";

export type PreviewStc001QuestionStudioInput = Readonly<{
  qlId: StcQlId;
  locale: StcLocale;
  seed: number;
  presentationProfile?: StcQuestionStudioPresentationProfile;
}>;

export const STC_001_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  packageId: STC_001_QUESTION_STUDIO_PACKAGE_ID,
  chapterId: "STC-001" as const,
  subjectCode: "REAS-STC" as const,
  title: "Statement & Conclusion",
  version: "V1" as const,
  integrationAuthority: STC_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
  reviewStatus: STC_001_QUESTION_STUDIO_REVIEW_STATUS,
  releaseFreezeStatus: STC_001_QUESTION_STUDIO_RELEASE_FREEZE,
  permanentQlCount: 6 as const,
  permanentQlIds: STC_QL_IDS,
  semanticAuthorityCount: 48 as const,
  semanticAuthoritiesPerQl: 8 as const,
  dedicatedFiveWayEitherAuthorityCount: 9 as const,
  locales: Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const),
  presentationProfiles: Object.freeze(["FOUR_WAY", "FIVE_WAY_EITHER"] as const),
  enabled: true as const,
  questionStudioVisible: true as const,
  questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
  reviewOnly: true as const,
  multilingualChapterFrozen: true as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  manualReleaseApprovalRequired: true as const,
});

export function previewStc001QuestionStudioReview(input: PreviewStc001QuestionStudioInput) {
  const presentationProfile = input.presentationProfile ?? "FOUR_WAY";
  const question = presentationProfile === "FIVE_WAY_EITHER"
    ? generateStcFiveWayQuestion({ qlId: input.qlId, locale: input.locale, seed: input.seed })
    : generateStcQuestion({ qlId: input.qlId, locale: input.locale, seed: input.seed });

  return Object.freeze({
    packageId: STC_001_QUESTION_STUDIO_PACKAGE_ID,
    freezeId: STC_001_QUESTION_STUDIO_RELEASE_FREEZE,
    integrationAuthority: STC_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    reviewStatus: STC_001_QUESTION_STUDIO_REVIEW_STATUS,
    lifecycleStatus: "REVIEW_ONLY" as const,
    reviewOnly: true as const,
    multilingualFrozen: true as const,
    presentationProfile,
    question,
  });
}

export function assertStc001QuestionStudioPersistenceAllowed(): never {
  throw new Error(
    "STC-001 V1 is frozen for Question Studio review only; Question Bank/test/mock/public delivery remains locked until a separate release approval.",
  );
}
