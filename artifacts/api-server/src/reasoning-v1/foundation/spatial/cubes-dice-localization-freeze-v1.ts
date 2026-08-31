import { CND_001_ENGLISH_FREEZE_AUTHORITY_V1 } from "./cubes-dice-english-freeze-v1";
import {
  CND_001_LOCALIZATION_AUTHORITY_V1,
  localizeCubesDicePermanentQuestionV1,
  type CubesDiceLocalizedLanguageV1,
  type CubesDiceLocalizedQuestionV1,
} from "./cubes-dice-localization-v1";
import { CND_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1 } from "./cubes-dice-localization-product-owner-approval-v1";
import {
  generateCubesDicePermanentEnglishQuestionV1,
  type CubesDicePermanentEnglishQuestionV1,
} from "./cubes-dice-permanent-english-runtime-v1";
import type { CubesDiceCp004TaskKindV1 } from "./cubes-dice-cp004-distractors-allocation-v1";

export type CubesDiceFrozenLocalizedQuestionV1 = Readonly<
  Omit<CubesDiceLocalizedQuestionV1, "localization"> & {
    localization: Readonly<{
      authorityId: typeof CND_001_LOCALIZATION_AUTHORITY_V1.authorityId;
      freezeAuthorityId: "CND-001-HI-PA-LOCALIZATION-FREEZE-V1";
      englishFreezeAuthorityId: typeof CND_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId;
      productOwnerApprovalAuthorityId: typeof CND_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.authorityId;
      sourceEnglishSeed: string;
      sourceEnglishStemVariantId: string;
      reviewOnly: false;
      frozen: true;
    }>;
  }
>;

export const CND_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1 = Object.freeze({
  authorityId: "CND-001-HI-PA-LOCALIZATION-FREEZE-V1" as const,
  chapterCode: "CND-001" as const,
  permanentQlIds: ["SPA-QL-043", "SPA-QL-044", "SPA-QL-045"] as const,
  localizationAuthorityId: CND_001_LOCALIZATION_AUTHORITY_V1.authorityId,
  englishFreezeAuthorityId: CND_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  productOwnerApprovalAuthorityId: CND_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.authorityId,
  status: "CND_001_HINDI_PUNJABI_V1_FROZEN" as const,
  exactReviewedLocalization: Object.freeze({
    headSha: CND_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.approvedExactHeadSha,
    workflowName: CND_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.approvedWorkflowName,
    workflowRunId: CND_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.approvedWorkflowRunId,
    artifactId: CND_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.approvedArtifactId,
    artifactDigest: CND_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.approvedArtifactDigest,
  }),
  frozenContract: Object.freeze({
    reviewedEnglishSeeds: 180,
    reviewedLocalizedQuestions: 360,
    reviewedPerQlPerLanguage: 60,
    supportedLanguages: ["en", "hi", "pa"] as const,
    hindiStemVariantCountPerQl: 6,
    punjabiStemVariantCountPerQl: 6,
    permanentQlCount: 3,
  }),
  invariants: Object.freeze({
    permanentQlId: true,
    chapterCode: true,
    taskKind: true,
    candidateId: true,
    difficulty: true,
    scene: true,
    solverEvidence: true,
    stimulusSvgs: true,
    renderer: true,
    options: true,
    correctIndex: true,
    answer: true,
    distractorEvidence: true,
    stemVariantId: true,
  }),
  governance: Object.freeze({
    localizationFrozen: true,
    seededQuestionStudioIntegrationAuthorized: true,
    standardQuestionStudioRegistrationAuthorized: false,
    persistenceAuthorized: false,
    questionBankWritesAuthorized: false,
    publicTestEligibilityAuthorized: false,
    automaticPublicationAuthorized: false,
    deploymentAuthorized: false,
  }),
  nextGate: "CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_V1" as const,
} as const);

if (!CND_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.approved || !CND_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.authorization.localizationFreezeAllowed) {
  throw new Error("CND-001 localization freeze lacks product-owner continuation approval.");
}
if (!CND_001_ENGLISH_FREEZE_AUTHORITY_V1.governance.englishFrozen) {
  throw new Error("CND-001 localization freeze requires frozen English runtime.");
}

function assertInvariant(label: string, localized: unknown, english: unknown): void {
  if (JSON.stringify(localized) !== JSON.stringify(english)) {
    throw new Error(`CND-001 localization freeze parity failure for ${label}.`);
  }
}

export function freezeCubesDiceLocalizedQuestionV1(input: Readonly<{
  seed: string;
  taskKind: CubesDiceCp004TaskKindV1;
  language: CubesDiceLocalizedLanguageV1;
}>): CubesDiceFrozenLocalizedQuestionV1 {
  const english: CubesDicePermanentEnglishQuestionV1 = generateCubesDicePermanentEnglishQuestionV1({
    seed: input.seed,
    taskKind: input.taskKind,
  });
  const localized = localizeCubesDicePermanentQuestionV1(input);

  assertInvariant("permanentQlId", localized.permanentQlId, english.permanentQlId);
  assertInvariant("chapterCode", localized.chapterCode, english.chapterCode);
  assertInvariant("taskKind", localized.taskKind, english.taskKind);
  assertInvariant("candidateId", localized.candidateId, english.candidateId);
  assertInvariant("difficulty", localized.difficulty, english.difficulty);
  assertInvariant("scene", localized.scene, english.scene);
  assertInvariant("solverEvidence", localized.solverEvidence, english.solverEvidence);
  assertInvariant("stimulusSvgs", localized.stimulusSvgs, english.stimulusSvgs);
  assertInvariant("renderer", localized.renderer, english.renderer);
  assertInvariant("options", localized.options, english.options);
  assertInvariant("correctIndex", localized.correctIndex, english.correctIndex);
  assertInvariant("answer", localized.answer, english.answer);
  assertInvariant("distractorEvidence", localized.distractorEvidence, english.distractorEvidence);
  assertInvariant("stemVariantId", localized.stemVariantId, english.stemVariantId);

  return Object.freeze({
    ...localized,
    localization: Object.freeze({
      authorityId: CND_001_LOCALIZATION_AUTHORITY_V1.authorityId,
      freezeAuthorityId: CND_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
      englishFreezeAuthorityId: CND_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
      productOwnerApprovalAuthorityId: CND_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.authorityId,
      sourceEnglishSeed: english.seed,
      sourceEnglishStemVariantId: english.stemVariantId,
      reviewOnly: false,
      frozen: true,
    }),
  });
}
