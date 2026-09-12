import {
  generateDotSituationReviewQuestionV1,
  type DotSituationDifficultyV1,
  type DotSituationLanguageV1,
} from "./dot-situation-review-runtime-v1";
import {
  DOT_SITUATION_FREEZE_AUTHORITY_V1,
  DOT_SITUATION_INTERNAL_ACTIVATION_V1,
  DOT_SITUATION_PRODUCT_OWNER_APPROVAL_V1,
} from "./dot-situation-freeze-v1";

const OPTION_LABELS = Object.freeze(["A", "B", "C", "D"] as const);

function locale(language: DotSituationLanguageV1) {
  return language === "hi" ? "hi-IN" as const : language === "pa" ? "pa-IN" as const : "en-IN" as const;
}

function difficultyBand(difficulty: DotSituationDifficultyV1) {
  return difficulty === "EASY" ? "Easy" as const : difficulty === "HARD" ? "Hard" as const : "Medium" as const;
}

function lifecycle() {
  return Object.freeze({
    ...DOT_SITUATION_INTERNAL_ACTIVATION_V1,
    registrationStatus: "REGISTERED" as const,
    releaseAuthority: DOT_SITUATION_INTERNAL_ACTIVATION_V1.authorityId,
  });
}

export function generateDotSituationQuestionStudioV1(input: Readonly<{
  qlId: "SPA-QL-054";
  seed: string;
  language: DotSituationLanguageV1;
}>) {
  if (!DOT_SITUATION_PRODUCT_OWNER_APPROVAL_V1.approved) {
    throw new Error("DOT-001 Question Studio generation requires explicit product-owner approval.");
  }
  if (!DOT_SITUATION_FREEZE_AUTHORITY_V1.learnerContentFrozen) {
    throw new Error("DOT-001 Question Studio generation requires the approved runtime to be frozen.");
  }
  if (!DOT_SITUATION_INTERNAL_ACTIVATION_V1.questionStudioDiscoverable) {
    throw new Error("DOT-001 internal activation has not opened Question Studio discovery.");
  }

  const source = generateDotSituationReviewQuestionV1(input);
  const canonicalItemId = `${source.qlId}:${source.geometryFingerprint}:${source.contentFingerprint}`;
  const questionLanguageId = `${canonicalItemId}:${source.language}`;

  return Object.freeze({
    version: "SPA-DOT-001-QUESTION-STUDIO-V1" as const,
    packageId: "SPA-001" as const,
    qlId: "SPA-QL-054" as const,
    proposalId: "DOT-PROP-01" as const,
    chapterCode: "DOT-001" as const,
    qlName: "Preserve complete dot-region membership across rearranged shapes" as const,
    language: source.language,
    locale: locale(source.language),
    difficultyBand: difficultyBand(source.difficulty),
    seed: source.seed,
    generationSeed: source.seed,
    mode: "MATCH_DOT_REGION_MEMBERSHIP_SIGNATURES" as const,
    stem: source.stem,
    stimulusSvgs: Object.freeze([source.stimulusSvg] as const),
    optionSvgs: source.optionSvgs as readonly [string, string, string, string],
    optionLabels: OPTION_LABELS,
    correctIndex: source.correctIndex,
    answer: source.answer,
    explanation: source.explanation,
    explanationIllustrationSvg: source.solutionSvg,
    solveFacts: source.solveFacts,
    canonicalItemId,
    questionLanguageId,
    questionId: `spa-dot-001:${questionLanguageId}`,
    contentFingerprint: source.contentFingerprint,
    geometryFingerprint: source.geometryFingerprint,
    renderer: Object.freeze({
      kind: "SVG_WITH_IMAGE_OPTIONS" as const,
      recommendedStimulusPixels: 220,
      recommendedOptionPixels: 180,
      reviewStrokeWidth: 1.35 as const,
      reviewBackground: "WHITE" as const,
      solutionIllustrationIncluded: true as const,
    }),
    localization: Object.freeze({
      authority: DOT_SITUATION_FREEZE_AUTHORITY_V1.authorityId,
      canonicalLanguage: "en" as const,
      targetLanguage: source.language,
      semanticParity: "GEOMETRY_OPTIONS_ANSWER_AND_MEMBERSHIP_SIGNATURES_EXACT" as const,
    }),
    validation: Object.freeze({
      ...source.validation,
      valid: true as const,
      exactSolverBacked: true as const,
      uniqueAnswer: true as const,
      learnerExplanationSafe: true as const,
      productOwnerApproved: true as const,
      learnerContentFrozen: true as const,
    }),
    review: Object.freeze({
      productOwnerApprovalAuthority: DOT_SITUATION_PRODUCT_OWNER_APPROVAL_V1.approvalId,
      productOwnerApproved: true as const,
      learnerContentFrozen: true as const,
      downstreamActivationAllowed: true as const,
    }),
    lifecycle: lifecycle(),
    sourceFreezeAuthority: DOT_SITUATION_FREEZE_AUTHORITY_V1.authorityId,
  });
}

export type DotSituationQuestionStudioV1 = ReturnType<typeof generateDotSituationQuestionStudioV1>;
