import { CAE_001_MANIFEST } from "./chapter-manifest.ts";
import { CAE_001_CAUSAL_WORLDS, CAE_001_PROJECTION_AUTHORITIES, CAE_001_SCENARIO_FAMILIES } from "./causal-world-authorities.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import { CAE_SOURCE_PROFILE_IDS, generateCaeSourceProfileQuestion, type CaeSourceProfileId } from "./source-profiles.ts";
import type { CaeLocale, CaeQlId, CaeQuestionProfile } from "./types.ts";

export const CAE_001_QUESTION_STUDIO_PACKAGE_ID = "CAE-001-V1-REVIEW" as const;
export const CAE_001_QUESTION_STUDIO_REVIEW_AUTHORITY = "CAE-001-CAUSAL-GRAPH-REVIEW-V3" as const;

export type PreviewCae001QuestionStudioInput = Readonly<{
  qlId: CaeQlId;
  locale: CaeLocale;
  seed: number;
  questionProfile?: CaeQuestionProfile;
  /** Source-auditable exam renderer layered above the frozen causal-state engine. */
  sourceProfileId?: CaeSourceProfileId;
}>;

export const CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  packageId: CAE_001_QUESTION_STUDIO_PACKAGE_ID,
  chapterId: "CAE-001" as const,
  subjectCode: "REAS-CAE" as const,
  title: "Cause & Effect" as const,
  version: "V3" as const,
  integrationAuthority: CAE_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
  reviewStatus: "REVIEW_ONLY_GENERATIVE_CAUSAL_STATE_V3_ARCHITECTURE_CHECKPOINT" as const,
  qlAllocationStatus: CAE_001_MANIFEST.qlDiscovery.status,
  provisionalQlCount: CAE_001_MANIFEST.qlDiscovery.currentCandidateIds.length,
  provisionalQlIds: CAE_001_MANIFEST.qlDiscovery.currentCandidateIds,
  scenarioFamilyCount: CAE_001_SCENARIO_FAMILIES.length,
  canonicalScenarioVariantCount: CAE_001_CAUSAL_WORLDS.length,
  generationPlanCount: CAE_001_PROJECTION_AUTHORITIES.length,
  locales: CAE_001_MANIFEST.locales,
  sourceProfiles: CAE_SOURCE_PROFILE_IDS,
  reviewedQlOverrides: ["CAE-QL-007"] as const,
  enabled: true as const,
  questionStudioVisible: true as const,
  reviewOnly: true as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
});

export function previewCae001QuestionStudioReview(input: PreviewCae001QuestionStudioInput) {
  const question = input.sourceProfileId
    ? generateCaeSourceProfileQuestion({
        qlId: input.qlId,
        locale: input.locale,
        seed: input.seed,
        sourceProfileId: input.sourceProfileId,
      })
    : generateReviewedCaeQuestion(input);
  return Object.freeze({
    packageId: CAE_001_QUESTION_STUDIO_PACKAGE_ID,
    integrationAuthority: CAE_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    lifecycleStatus: "REVIEW_ONLY" as const,
    reviewOnly: true as const,
    question,
  });
}

export function assertCae001QuestionStudioPersistenceAllowed(): never {
  throw new Error(
    "CAE-001 is available for Question Studio review only; question-bank, test, mock, and public delivery remain locked until editorial release approval.",
  );
}
