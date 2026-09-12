import {
  generateFigureFormationQuestionStudioV2,
  type FigureFormationQuestionStudioQuestionV2,
} from "./figure-formation-question-studio-v2";
import type { FigureFormationLanguageV1 } from "./figure-formation-question-studio-v1";
import type { FigureFormationPermanentQlIdV10 } from "./spatial-permanent-ql-allocation-v10";
import { FIGURE_FORMATION_REVIEW_AUTHORITY_V3 } from "./figure-formation-review-authority-v3";

const FORBIDDEN_STROKE_WIDTHS = /stroke-width="(?:1\.4|1\.45|1\.5|1\.55)"/g;

function normalizeExamStroke(svg: string): string {
  return svg.replace(FORBIDDEN_STROKE_WIDTHS, 'stroke-width="1.35"');
}

function reviewLifecycle() {
  return FIGURE_FORMATION_REVIEW_AUTHORITY_V3.lifecycle;
}

export function generateFigureFormationReviewQuestionV3(input: Readonly<{
  qlId: FigureFormationPermanentQlIdV10;
  seed: string;
  language?: FigureFormationLanguageV1;
}>) {
  const base = generateFigureFormationQuestionStudioV2(input) as FigureFormationQuestionStudioQuestionV2;
  const stimulusSvgs = Object.freeze(base.stimulusSvgs.map(normalizeExamStroke));
  const optionSvgs = Object.freeze(base.optionSvgs.map(normalizeExamStroke));
  return Object.freeze({
    ...base,
    version: "SPA-FFM-001-REVIEW-QUESTION-V3" as const,
    stimulusSvgs,
    optionSvgs,
    renderer: Object.freeze({
      ...base.renderer,
      reviewStrokeWidth: 1.35 as const,
      reviewBackground: "WHITE" as const,
    }),
    lifecycle: reviewLifecycle(),
    sourceFreezeAuthority: FIGURE_FORMATION_REVIEW_AUTHORITY_V3.authorityId,
    review: Object.freeze({
      authorityId: FIGURE_FORMATION_REVIEW_AUTHORITY_V3.authorityId,
      visualApprovalRequired: true as const,
      learnerContentFrozen: false as const,
      downstreamActivationAllowed: false as const,
    }),
  });
}

export type FigureFormationReviewQuestionV3 = ReturnType<typeof generateFigureFormationReviewQuestionV3>;
