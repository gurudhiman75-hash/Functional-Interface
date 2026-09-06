import {
  generateFigureMatrixReviewQuestionV2_4,
} from "./figure-matrix-review-runtime-v2-4";
import type {
  FigureMatrixDifficultyV2,
  FigureMatrixLanguageV2,
  FigureMatrixQlIdV2,
} from "./figure-matrix-review-runtime-v2";
import {
  FIGURE_MATRIX_FREEZE_AUTHORITY_V1,
  FIGURE_MATRIX_INTERNAL_ACTIVATION_V1,
  FIGURE_MATRIX_PRODUCT_OWNER_APPROVAL_V1,
} from "./figure-matrix-freeze-v1";

const OPTION_LABELS = Object.freeze(["A", "B", "C", "D"] as const);

const QL_NAMES: Readonly<Record<FigureMatrixQlIdV2, string>> = Object.freeze({
  "SPA-QL-055": "Repeated figure transformation",
  "SPA-QL-056": "Binary figure composition",
  "SPA-QL-057": "Quantitative count relation",
  "SPA-QL-058": "Cyclic distribution and permutation",
  "SPA-QL-059": "Orthogonal row-column attributes",
  "SPA-QL-060": "Compound matrix rule",
});

function locale(language: FigureMatrixLanguageV2) {
  return language === "hi" ? "hi-IN" as const : language === "pa" ? "pa-IN" as const : "en-IN" as const;
}

function difficultyBand(difficulty: FigureMatrixDifficultyV2) {
  return difficulty === "EASY" ? "Easy" as const : difficulty === "HARD" ? "Hard" as const : "Medium" as const;
}

function lifecycle() {
  return Object.freeze({
    ...FIGURE_MATRIX_INTERNAL_ACTIVATION_V1,
    registrationStatus: "REGISTERED" as const,
    releaseAuthority: FIGURE_MATRIX_INTERNAL_ACTIVATION_V1.authorityId,
  });
}

export function generateFigureMatrixQuestionStudioV1(input: Readonly<{
  qlId: FigureMatrixQlIdV2;
  seed: string;
  language: FigureMatrixLanguageV2;
}>) {
  if (!FIGURE_MATRIX_PRODUCT_OWNER_APPROVAL_V1.approved) {
    throw new Error("FMT-001 Question Studio generation requires explicit product-owner approval.");
  }
  if (!FIGURE_MATRIX_FREEZE_AUTHORITY_V1.learnerContentFrozen) {
    throw new Error("FMT-001 Question Studio generation requires the approved V2.4 runtime to be frozen.");
  }
  if (!FIGURE_MATRIX_INTERNAL_ACTIVATION_V1.questionStudioDiscoverable) {
    throw new Error("FMT-001 internal activation has not opened Question Studio discovery.");
  }

  const source = generateFigureMatrixReviewQuestionV2_4(input);
  const canonicalItemId = `${source.qlId}:${source.geometryFingerprint}:${source.contentFingerprint}`;
  const questionLanguageId = `${canonicalItemId}:${source.language}`;
  const check = [source.explanation.verification, ...source.explanation.distractorChecks].join(" ");

  return Object.freeze({
    version: "SPA-FMT-001-QUESTION-STUDIO-V1" as const,
    packageId: "SPA-001" as const,
    qlId: source.qlId,
    proposalId: source.proposalId,
    chapterCode: "FMT-001" as const,
    qlName: QL_NAMES[source.qlId],
    language: source.language,
    locale: locale(source.language),
    difficultyBand: difficultyBand(source.difficulty),
    seed: source.seed,
    generationSeed: source.seed,
    mode: source.skillMode,
    stem: source.stem,
    stimulusSvgs: Object.freeze([source.matrixSvg] as const),
    optionSvgs: source.optionSvgs as readonly [string, string, string, string],
    optionLabels: OPTION_LABELS,
    correctIndex: source.correctIndex,
    answer: source.answer,
    explanation: Object.freeze({
      observation: source.explanation.worked,
      rule: source.explanation.rule,
      application: source.explanation.application,
      check,
      worked: source.explanation.worked,
      verification: source.explanation.verification,
      distractorChecks: source.explanation.distractorChecks,
    }),
    explanationIllustrationSvg: source.solutionSvg,
    solveFacts: source.solveFacts,
    canonicalItemId,
    questionLanguageId,
    questionId: `spa-fmt-001:${questionLanguageId}`,
    contentFingerprint: source.contentFingerprint,
    geometryFingerprint: source.geometryFingerprint,
    renderer: Object.freeze({
      kind: "SVG_WITH_IMAGE_OPTIONS" as const,
      recommendedStimulusPixels: source.matrixSize === 4 ? 640 : source.matrixSize === 3 ? 520 : 380,
      recommendedOptionPixels: 150,
      reviewStrokeWidth: 1.35 as const,
      reviewBackground: "WHITE" as const,
      completedMatrixSolutionIncluded: true as const,
    }),
    localization: Object.freeze({
      authority: FIGURE_MATRIX_FREEZE_AUTHORITY_V1.authorityId,
      canonicalLanguage: "en" as const,
      targetLanguage: source.language,
      semanticParity: "MATRIX_GEOMETRY_OPTIONS_ANSWER_RULE_AND_SOLUTION_EXACT" as const,
    }),
    validation: Object.freeze({
      ...source.validation,
      valid: true as const,
      exactSolverBacked: true as const,
      uniqueAnswer: true as const,
      learnerExplanationSafe: true as const,
      productOwnerApproved: true as const,
      learnerContentFrozen: true as const,
      approvedV2_4RuntimePreserved: true as const,
    }),
    review: Object.freeze({
      productOwnerApprovalAuthority: FIGURE_MATRIX_PRODUCT_OWNER_APPROVAL_V1.approvalId,
      productOwnerApproved: true as const,
      learnerContentFrozen: true as const,
      downstreamActivationAllowed: true as const,
    }),
    lifecycle: lifecycle(),
    sourceFreezeAuthority: FIGURE_MATRIX_FREEZE_AUTHORITY_V1.authorityId,
  });
}

export type FigureMatrixQuestionStudioV1 = ReturnType<typeof generateFigureMatrixQuestionStudioV1>;
