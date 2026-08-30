import { FCT_001_ENGLISH_FREEZE_AUTHORITY_V1 } from "./counting-figures-english-freeze-v1";
import {
  FCT_001_LOCALIZATION_AUTHORITY_V1,
  localizeCountingFiguresPermanentQuestionV1,
  type CountingFiguresLocalizedLanguageV1,
  type CountingFiguresLocalizedQuestionV1,
} from "./counting-figures-localization-v1";
import { FCT_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1 } from "./counting-figures-localization-product-owner-approval-v1";
import type { CountingFiguresPermanentEnglishQuestionV1 } from "./counting-figures-permanent-english-runtime-v1";

export type CountingFiguresFrozenLocalizedQuestionV1 = Readonly<
  Omit<CountingFiguresLocalizedQuestionV1, "localization"> & {
    localization: Readonly<{
      authorityId: typeof FCT_001_LOCALIZATION_AUTHORITY_V1.authorityId;
      freezeAuthorityId: "FCT-001-HI-PA-LOCALIZATION-FREEZE-V1";
      englishFreezeAuthorityId: typeof FCT_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId;
      sourceEnglishContentFingerprint: string;
      sourceEnglishGeometryFingerprint: string;
      reviewOnly: false;
      frozen: true;
    }>;
  }
>;

export const FCT_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1 = Object.freeze({
  authorityId: "FCT-001-HI-PA-LOCALIZATION-FREEZE-V1" as const,
  chapterCode: "FCT-001" as const,
  candidateId: "FCT-CAND-A-CLOSED-POLYGON-ENUMERATION" as const,
  permanentQlId: "SPA-QL-042" as const,
  localizationAuthorityId: FCT_001_LOCALIZATION_AUTHORITY_V1.authorityId,
  englishFreezeAuthorityId: FCT_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  productOwnerApprovalAuthorityId: FCT_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.authorityId,
  status: "FCT_001_HINDI_PUNJABI_V1_FROZEN" as const,
  exactReviewedLocalization: {
    headSha: FCT_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.approvedExactHeadSha,
    workflowName: FCT_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.approvedWorkflowName,
    workflowRunId: FCT_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.approvedWorkflowRunId,
    artifactId: FCT_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.approvedArtifactId,
    artifactDigest: FCT_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.approvedArtifactDigest,
    reviewFile: "spa-fct-001-localization-v1.html" as const,
  },
  frozenContract: {
    reviewedEnglishQuestions: 240,
    reviewedLocalizedQuestions: 480,
    reviewQuestions: 28,
    supportedLanguages: ["en", "hi", "pa"] as const,
    hindiStemVariantCount: 8,
    punjabiStemVariantCount: 8,
    motifFamilyCount: 11,
    targetShapeCount: 4,
  },
  invariants: {
    graph: true,
    diagram: true,
    targetShape: true,
    optionOrder: true,
    optionValues: true,
    correctCount: true,
    constructionExpectedCount: true,
    correctIndex: true,
    distractorEvidence: true,
    permanentQlId: true,
    candidateId: true,
    chapterCode: true,
    motifIdentity: true,
    structuralVariant: true,
    difficulty: true,
    geometryFingerprint: true,
    structuralFingerprint: true,
    canonicalContentFingerprint: true,
    stemVariant: true,
  },
  learnerReview: {
    hindiWording: "APPROVED_SIMPLE_STUDENT_FIRST" as const,
    punjabiWording: "APPROVED_SIMPLE_STUDENT_FIRST" as const,
    stemVariety: "EIGHT_DISTINCT_VARIANTS_PER_LANGUAGE" as const,
    explanationDiversity: "QUESTION_SPECIFIC_COUNT_AND_MISCONCEPTION_AWARE" as const,
    internalEnumLeakage: "NONE_OBSERVED_IN_REVIEW" as const,
    desktopReadability: "PASSED" as const,
    mobile390Readability: "PASSED" as const,
  },
  governance: {
    localizationFrozen: true,
    seededQuestionStudioIntegrationAuthorized: true,
    standardQuestionStudioRegistrationAuthorized: false,
    persistenceAuthorized: false,
    questionBankWritesAuthorized: false,
    publicTestEligibilityAuthorized: false,
    automaticPublicationAuthorized: false,
    mergeAuthorized: false,
    deploymentAuthorized: false,
  },
  nextGate: "FCT_001_QUESTION_STUDIO_SEEDED_RUNTIME_V1" as const,
} as const);

if (!FCT_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.approved || !FCT_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.authorization.localizationFreezeAllowed) {
  throw new Error("FCT-001 localization freeze lacks product-owner approval.");
}

export function freezeCountingFiguresLocalizedQuestionV1(
  source: CountingFiguresPermanentEnglishQuestionV1,
  language: CountingFiguresLocalizedLanguageV1,
): CountingFiguresFrozenLocalizedQuestionV1 {
  const localized = localizeCountingFiguresPermanentQuestionV1({
    seed: source.seed,
    targetShape: source.targetShape,
    language,
  });
  if (
    localized.contentFingerprint !== source.contentFingerprint ||
    localized.geometryFingerprint !== source.geometryFingerprint ||
    localized.correctCount !== source.correctCount ||
    localized.correctIndex !== source.correctIndex
  ) {
    throw new Error(`FCT-001 localization freeze parity failure for ${source.seed}/${language}.`);
  }
  return Object.freeze({
    ...localized,
    localization: Object.freeze({
      authorityId: FCT_001_LOCALIZATION_AUTHORITY_V1.authorityId,
      freezeAuthorityId: FCT_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
      englishFreezeAuthorityId: FCT_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
      sourceEnglishContentFingerprint: source.contentFingerprint,
      sourceEnglishGeometryFingerprint: source.geometryFingerprint,
      reviewOnly: false,
      frozen: true,
    }),
  });
}
