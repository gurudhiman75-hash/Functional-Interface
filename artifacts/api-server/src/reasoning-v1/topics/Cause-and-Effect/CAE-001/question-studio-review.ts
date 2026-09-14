import { CAE_001_MANIFEST } from "./chapter-manifest.ts";
import { CAE_001_CAUSAL_WORLDS, CAE_001_PROJECTION_AUTHORITIES, CAE_001_SCENARIO_FAMILIES } from "./causal-world-authorities.ts";
import { CAE_001_SATURATION_WAVE1_FAMILIES, CAE_001_SATURATION_WAVE1_VARIANT_COUNT } from "./causal-world-saturation-wave1.ts";
import { CAE_001_SATURATION_WAVE2_FAMILIES, CAE_001_SATURATION_WAVE2_VARIANT_COUNT } from "./causal-world-saturation-wave2.ts";
import { CAE_001_SATURATION_WAVE4_FAMILIES, CAE_001_SATURATION_WAVE4_VARIANT_COUNT } from "./causal-world-saturation-wave4.ts";
import { CAE_COMBINATION_WORLDS } from "./cp003004-combination.ts";
import { CP005_COMPETING_SCENARIOS } from "./cp005-competing-explanations.ts";
import { CP007_FALSE_CAUSATION_WORLDS } from "./cp007-false-causation.ts";
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
  sourceProfileId?: CaeSourceProfileId;
}>;

const SATURATION_WAVE1_FAMILY_COUNT = CAE_001_SATURATION_WAVE1_FAMILIES.length;
const SATURATION_WAVE2_FAMILY_COUNT = CAE_001_SATURATION_WAVE2_FAMILIES.length;
const SATURATION_WAVE4_FAMILY_COUNT = CAE_001_SATURATION_WAVE4_FAMILIES.length;
const EFFECTIVE_CANONICAL_FAMILY_COUNT = CAE_001_SCENARIO_FAMILIES.length + SATURATION_WAVE1_FAMILY_COUNT + SATURATION_WAVE2_FAMILY_COUNT + SATURATION_WAVE4_FAMILY_COUNT;
const EFFECTIVE_CANONICAL_VARIANT_COUNT = CAE_001_CAUSAL_WORLDS.length + CAE_001_SATURATION_WAVE1_VARIANT_COUNT + CAE_001_SATURATION_WAVE2_VARIANT_COUNT + CAE_001_SATURATION_WAVE4_VARIANT_COUNT;

export const CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  packageId: CAE_001_QUESTION_STUDIO_PACKAGE_ID,
  chapterId: "CAE-001" as const,
  subjectCode: "REAS-CAE" as const,
  title: "Cause & Effect" as const,
  version: "V3" as const,
  integrationAuthority: CAE_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
  reviewStatus: "REVIEW_ONLY_GENERATIVE_CAUSAL_STATE_V3_ARCHITECTURE_CHECKPOINT" as const,
  /** Frozen V3 legacy counts remain stable; saturation is exposed separately. */
  qlAllocationStatus: "PROVISIONAL_PENDING_SOURCE_SATURATION" as const,
  contentFreezeStatus: CAE_001_MANIFEST.qlDiscovery.status,
  provisionalQlCount: CAE_001_MANIFEST.qlDiscovery.currentCandidateIds.length,
  provisionalQlIds: CAE_001_MANIFEST.qlDiscovery.currentCandidateIds,
  scenarioFamilyCount: CAE_001_SCENARIO_FAMILIES.length,
  canonicalScenarioVariantCount: CAE_001_CAUSAL_WORLDS.length,
  saturationWave1FamilyCount: SATURATION_WAVE1_FAMILY_COUNT,
  saturationWave1VariantCount: CAE_001_SATURATION_WAVE1_VARIANT_COUNT,
  saturationWave2FamilyCount: SATURATION_WAVE2_FAMILY_COUNT,
  saturationWave2VariantCount: CAE_001_SATURATION_WAVE2_VARIANT_COUNT,
  saturationWave4FamilyCount: SATURATION_WAVE4_FAMILY_COUNT,
  saturationWave4VariantCount: CAE_001_SATURATION_WAVE4_VARIANT_COUNT,
  effectiveScenarioFamilyCount: EFFECTIVE_CANONICAL_FAMILY_COUNT,
  effectiveCanonicalScenarioVariantCount: EFFECTIVE_CANONICAL_VARIANT_COUNT,
  saturationExpandedQlIds: ["CAE-QL-001", "CAE-QL-002", "CAE-QL-006", "CAE-QL-007", "CAE-QL-008"] as const,
  saturationWave4TargetQlIds: ["CAE-QL-002", "CAE-QL-007"] as const,
  saturationCandidateHeavyQlStatus: "GATED_PENDING_SCENARIO_SPECIFIC_DISTRACTOR_AUTHORITIES" as const,
  /** Reviewed authorities add combination/CP005/CP007 authored families beyond the canonical saturation pool. */
  reviewedScenarioFamilyCount: CAE_001_SCENARIO_FAMILIES.length + 4,
  reviewedCanonicalScenarioVariantCount: CAE_001_CAUSAL_WORLDS.length + CAE_COMBINATION_WORLDS.length + CP005_COMPETING_SCENARIOS.length + CP007_FALSE_CAUSATION_WORLDS.length,
  effectiveReviewedScenarioFamilyCount: EFFECTIVE_CANONICAL_FAMILY_COUNT + 4,
  effectiveReviewedCanonicalScenarioVariantCount: EFFECTIVE_CANONICAL_VARIANT_COUNT + CAE_COMBINATION_WORLDS.length + CP005_COMPETING_SCENARIOS.length + CP007_FALSE_CAUSATION_WORLDS.length,
  generationPlanCount: CAE_001_PROJECTION_AUTHORITIES.length,
  locales: CAE_001_MANIFEST.locales,
  sourceProfiles: CAE_SOURCE_PROFILE_IDS,
  reviewedQlOverrides: ["CAE-QL-003", "CAE-QL-004", "CAE-QL-005", "CAE-QL-006", "CAE-QL-007", "CAE-QL-008", "CAE-QL-009"] as const,
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
    ? generateCaeSourceProfileQuestion({ qlId: input.qlId, locale: input.locale, seed: input.seed, sourceProfileId: input.sourceProfileId })
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
  throw new Error("CAE-001 is available for Question Studio review only; question-bank, test, mock, and public delivery remain locked until editorial release approval.");
}
