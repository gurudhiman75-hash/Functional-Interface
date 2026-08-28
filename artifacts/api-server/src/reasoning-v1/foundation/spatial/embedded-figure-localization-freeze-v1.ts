import { EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1 } from "./embedded-figure-english-freeze-v1";
import {
  EMBEDDED_FIGURE_LOCALIZATION_AUTHORITY_V1,
  localizeEmbeddedFigureQuestionV1,
  type EmbeddedFigureLocalizedLanguageV1,
  type EmbeddedFigureLocalizedQuestionV1,
} from "./embedded-figure-localization-v1";
import { EMBEDDED_FIGURE_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1 } from "./embedded-figure-localization-product-owner-approval-v1";
import type { EmbeddedFigurePermanentEnglishQuestionV1 } from "./embedded-figure-permanent-english-runtime-v1";

export type EmbeddedFigureFrozenLocalizedQuestionV1 = Readonly<
  Omit<EmbeddedFigureLocalizedQuestionV1, "localization"> & {
    localization: Readonly<{
      authorityId: typeof EMBEDDED_FIGURE_LOCALIZATION_AUTHORITY_V1.authorityId;
      freezeAuthorityId: "EMB-001-HI-PA-LOCALIZATION-FREEZE-V1";
      englishFreezeAuthorityId: typeof EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.authorityId;
      sourceEnglishContentFingerprint: string;
      sourceEnglishGeometryFingerprint: string;
      reviewOnly: false;
      frozen: true;
      activationBlockedUntilEnglishFreezeCiGreen: false;
    }>;
  }
>;

export const EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1 = Object.freeze({
  authorityId: "EMB-001-HI-PA-LOCALIZATION-FREEZE-V1" as const,
  chapterCode: "EMB-001" as const,
  proposalId: "EMB-PROP-01" as const,
  permanentQlId: "SPA-QL-041" as const,
  localizationAuthorityId: EMBEDDED_FIGURE_LOCALIZATION_AUTHORITY_V1.authorityId,
  englishFreezeAuthorityId: EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  productOwnerApprovalAuthorityId: EMBEDDED_FIGURE_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.authorityId,
  status: "EMB_001_HINDI_PUNJABI_V1_FROZEN" as const,
  exactReviewedLocalization: {
    headSha: EMBEDDED_FIGURE_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.approvedExactHeadSha,
    workflowName: EMBEDDED_FIGURE_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.approvedWorkflowName,
    workflowRunId: EMBEDDED_FIGURE_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.approvedWorkflowRunId,
    artifactId: EMBEDDED_FIGURE_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.approvedArtifactId,
    artifactDigest: EMBEDDED_FIGURE_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.approvedArtifactDigest,
    reviewFile: "spa-emb-001-localization-v1-review.html" as const,
  },
  frozenContract: {
    reviewedEnglishQuestions: 240,
    reviewedLocalizedQuestions: 480,
    reviewQuestions: 25,
    supportedLanguages: ["en", "hi", "pa"] as const,
    hindiStemVariantCount: 8,
    punjabiStemVariantCount: 8,
    seededGenerationCeiling: false,
  },
  invariants: {
    targetGraph: true,
    optionGraphs: true,
    diagrams: true,
    optionOrder: true,
    answer: true,
    permanentQlId: true,
    proposalId: true,
    chapterCode: true,
    equivalencePolicy: true,
    motifIdentity: true,
    difficulty: true,
    geometryFingerprint: true,
    canonicalContentFingerprint: true,
  },
  learnerReview: {
    hindiWording: "APPROVED_SIMPLE_STUDENT_FIRST" as const,
    punjabiWording: "APPROVED_SIMPLE_STUDENT_FIRST" as const,
    stemVariety: "EIGHT_DISTINCT_VARIANTS_PER_LANGUAGE" as const,
    explanationDiversity: "QUESTION_SPECIFIC_TRAP_AWARE" as const,
    learnerFacingEnglishLeakage: "NONE_OBSERVED_IN_REVIEW" as const,
  },
  governance: {
    localizationFrozen: true,
    seededQuestionStudioIntegrationAuthorized: true,
    questionStudioProductionReleaseAuthorized: false,
    persistenceAuthorized: false,
    questionBankWritesAuthorized: false,
    publicTestEligibilityAuthorized: false,
    automaticPublicationAuthorized: false,
    mergeAuthorized: false,
    deploymentAuthorized: false,
  },
  nextGate: "EMB_001_QUESTION_STUDIO_SEEDED_RUNTIME_V1" as const,
} as const);

if (!EMBEDDED_FIGURE_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.approved || !EMBEDDED_FIGURE_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.authorization.localizationFreezeAllowed) {
  throw new Error("EMB-001 localization freeze lacks product-owner approval.");
}

export function freezeEmbeddedFigureLocalizedQuestionV1(
  source: EmbeddedFigurePermanentEnglishQuestionV1,
  language: EmbeddedFigureLocalizedLanguageV1,
): EmbeddedFigureFrozenLocalizedQuestionV1 {
  const localized = localizeEmbeddedFigureQuestionV1(source, language);
  return Object.freeze({
    ...localized,
    localization: Object.freeze({
      authorityId: EMBEDDED_FIGURE_LOCALIZATION_AUTHORITY_V1.authorityId,
      freezeAuthorityId: EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
      englishFreezeAuthorityId: EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
      sourceEnglishContentFingerprint: source.contentFingerprint,
      sourceEnglishGeometryFingerprint: source.geometryFingerprint,
      reviewOnly: false,
      frozen: true,
      activationBlockedUntilEnglishFreezeCiGreen: false,
    }),
  });
}
