import {
  PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_4,
  generatePfcTpfSourceSaturatedEnglishReviewV1_5_4,
} from "./paper-folding-source-saturated-english-review-v1-5-4";
import {
  PFC_001_POLYGON_LEARNER_REVIEW_AUTHORITY_V1,
  generatePfcPolygonLearnerReviewV1,
} from "./paper-folding-polygon-learner-review-v1";
import {
  PFC_001_HEXAGON_LEARNER_REVIEW_AUTHORITY_V1_1,
  generatePfcHexagonLearnerReviewV1_1,
} from "./paper-folding-hexagon-learner-review-v1-1";
import {
  PFC_001_INNOVATION_LEARNER_REVIEW_AUTHORITY_V1,
  generatePfcInnovationLearnerReviewV1,
} from "./paper-folding-innovation-learner-review-v1";
import { PFC_001_TRIANGLE_PRODUCT_OWNER_APPROVAL_V1 } from "./paper-folding-triangle-product-owner-approval-v1";
import { PFC_001_HEXAGON_PRODUCT_OWNER_APPROVAL_V1 } from "./paper-folding-hexagon-product-owner-approval-v1";
import { PFC_001_CONTROLLED_NOVEL_PRODUCT_OWNER_APPROVAL_V1 } from "./paper-folding-controlled-novel-product-owner-approval-v1";

export const PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1 = Object.freeze({
  authorityId: "PFC-TPF-FINAL-COMBINED-ENGLISH-REVIEW-V1" as const,
  predecessorMainReviewAuthority: PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_4.authorityId,
  triangleReviewAuthority: PFC_001_POLYGON_LEARNER_REVIEW_AUTHORITY_V1.authorityId,
  triangleApprovalAuthority: PFC_001_TRIANGLE_PRODUCT_OWNER_APPROVAL_V1.authorityId,
  hexagonReviewAuthority: PFC_001_HEXAGON_LEARNER_REVIEW_AUTHORITY_V1_1.authorityId,
  hexagonApprovalAuthority: PFC_001_HEXAGON_PRODUCT_OWNER_APPROVAL_V1.authorityId,
  controlledNovelReviewAuthority: PFC_001_INNOVATION_LEARNER_REVIEW_AUTHORITY_V1.authorityId,
  controlledNovelApprovalAuthority: PFC_001_CONTROLLED_NOVEL_PRODUCT_OWNER_APPROVAL_V1.authorityId,
  reviewQuestionCount: 84,
  sourceBackedCoreQuestionCount: 72,
  controlledNovelQuestionCount: 12,
  transparentTpfQuestionCount: 8,
  auditSurfaceRule: "REVIEW_BREADTH_IS_NOT_PRODUCTION_SAMPLING_WEIGHT" as const,
  productionPolicy: "PYQ_COVERAGE_IS_THE_FLOOR_NOT_THE_CEILING" as const,
  correctAnswerAuthority: "INHERIT_APPROVED_SOLVER_DERIVED_ANSWERS_WITHOUT_REAUTHORING" as const,
  paperShapeCreatesStandaloneQl: false,
  permanentQlAllocationAllowed: false,
  englishFreezeAllowed: false,
  localizationAllowed: false,
  questionStudioAllowed: false,
  automaticPublication: false,
  status: "FINAL_COMBINED_ENGLISH_HUMAN_REVIEW_REQUIRED" as const,
} as const);

type OptionId = "A" | "B" | "C" | "D";
type SurfaceId = "CORE_MAIN" | "TRIANGLE_APPROVED" | "HEXAGON_APPROVED" | "CONTROLLED_NOVEL_APPROVED";
type Provenance = "SOURCE_BACKED_CORE" | "CONTROLLED_NOVEL";

export interface PfcTpfFinalCombinedOptionV1 {
  optionId: OptionId;
  svg: string;
}

export interface PfcTpfFinalCombinedQuestionV1 {
  reviewId: string;
  surfaceId: SurfaceId;
  provenance: Provenance;
  chapterCode: "PFC-001" | "TPF-001";
  proposalId: string;
  representation: string;
  sourceRef: string;
  stem: string;
  stimulusSvg: string;
  options: PfcTpfFinalCombinedOptionV1[];
  correctOptionId: OptionId;
  explanation: string;
}

function esc(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export function generatePfcTpfFinalCombinedEnglishReviewV1(): PfcTpfFinalCombinedQuestionV1[] {
  const main = generatePfcTpfSourceSaturatedEnglishReviewV1_5_4().map<PfcTpfFinalCombinedQuestionV1>((question) => ({
    reviewId: question.reviewQuestionId,
    surfaceId: "CORE_MAIN",
    provenance: "SOURCE_BACKED_CORE",
    chapterCode: question.chapterCode,
    proposalId: question.proposalId,
    representation: question.sourceShape,
    sourceRef: question.sourceId,
    stem: question.stem,
    stimulusSvg: question.stimulusSvg,
    options: question.options.map((option) => ({ optionId: option.optionId, svg: option.svg })),
    correctOptionId: question.correctOptionId,
    explanation: question.explanation,
  }));

  const triangle = generatePfcPolygonLearnerReviewV1().map<PfcTpfFinalCombinedQuestionV1>((question) => ({
    reviewId: question.reviewId,
    surfaceId: "TRIANGLE_APPROVED",
    provenance: "SOURCE_BACKED_CORE",
    chapterCode: "PFC-001",
    proposalId: question.proposalId,
    representation: "TRIANGLE",
    sourceRef: question.sourceScenarioId,
    stem: question.stem,
    stimulusSvg: question.stimulusSvg,
    options: question.options.map((option) => ({ optionId: option.optionId, svg: option.svg })),
    correctOptionId: question.correctOptionId,
    explanation: question.explanation,
  }));

  const hexagon = generatePfcHexagonLearnerReviewV1_1().map<PfcTpfFinalCombinedQuestionV1>((question) => ({
    reviewId: question.reviewId,
    surfaceId: "HEXAGON_APPROVED",
    provenance: "SOURCE_BACKED_CORE",
    chapterCode: "PFC-001",
    proposalId: question.proposalId,
    representation: question.family === "HEXAGON_SIX_SECTOR_RADIAL" ? "REGULAR_HEXAGON_SIX_SECTOR" : "REGULAR_HEXAGON",
    sourceRef: question.sourceScenarioId,
    stem: question.stem,
    stimulusSvg: question.stimulusSvg,
    options: question.options.map((option) => ({ optionId: option.optionId, svg: option.svg })),
    correctOptionId: question.correctOptionId,
    explanation: question.explanation,
  }));

  const novel = generatePfcInnovationLearnerReviewV1().map<PfcTpfFinalCombinedQuestionV1>((question) => ({
    reviewId: question.reviewId,
    surfaceId: "CONTROLLED_NOVEL_APPROVED",
    provenance: "CONTROLLED_NOVEL",
    chapterCode: "PFC-001",
    proposalId: question.proposalId,
    representation: question.substrateProfile,
    sourceRef: question.sourceCandidateId,
    stem: question.stem,
    stimulusSvg: question.stimulusSvg,
    options: question.options.map((option) => ({ optionId: option.optionId, svg: option.svg })),
    correctOptionId: question.correctOptionId,
    explanation: question.explanation,
  }));

  return [...main, ...triangle, ...hexagon, ...novel];
}

const SURFACE_TITLES: Record<SurfaceId, string> = {
  CORE_MAIN: "Part A — Source-backed core: square, rectangle, circle and transparent folding",
  TRIANGLE_APPROVED: "Part B — Approved triangular source-paper representation",
  HEXAGON_APPROVED: "Part C — Approved regular-hexagon representation",
  CONTROLLED_NOVEL_APPROVED: "Part D — Approved controlled-novel constructions",
};

function renderQuestion(question: PfcTpfFinalCombinedQuestionV1): string {
  return `<article class="question-card" data-surface="${question.surfaceId}" data-provenance="${question.provenance}">
    <div class="meta">${esc(question.reviewId)} · ${esc(question.chapterCode)} · ${esc(question.proposalId)} · ${esc(question.representation)} · ${esc(question.provenance)}</div>
    <p class="stem"><strong>Question:</strong> ${esc(question.stem)}</p>
    <div class="stimulus">${question.stimulusSvg}</div>
    <div class="options">${question.options.map((option) => `<div class="option"><div class="option-label">${option.optionId}</div><div class="option-art">${option.svg}</div></div>`).join("")}</div>
    <details><summary>Show answer and explanation</summary><p><strong>Answer:</strong> ${question.correctOptionId}</p><p>${esc(question.explanation)}</p></details>
  </article>`;
}

export function renderPfcTpfFinalCombinedEnglishReviewHtmlV1(
  questions: readonly PfcTpfFinalCombinedQuestionV1[],
): string {
  const sections = (Object.keys(SURFACE_TITLES) as SurfaceId[]).map((surfaceId) => {
    const subset = questions.filter((question) => question.surfaceId === surfaceId);
    return `<section class="review-section" data-section="${surfaceId}"><div class="section-heading"><h2>${SURFACE_TITLES[surfaceId]}</h2><p>${subset.length} review questions</p></div>${subset.map(renderQuestion).join("\n")}</section>`;
  }).join("\n");

  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PFC / TPF Final Combined English Review V1</title><style>
    *{box-sizing:border-box}html,body{margin:0;background:#fff;color:#111}body{font-family:Arial,Helvetica,sans-serif;line-height:1.45}.wrap{max-width:1220px;margin:0 auto;padding:22px}.intro{border:1px solid #d6d6d6;border-radius:12px;padding:18px;margin-bottom:24px;background:#fff}.intro h1{font-size:26px;margin:0 0 8px}.intro p{margin:6px 0}.section-heading{border-bottom:2px solid #222;padding:12px 0 8px;margin:30px 0 4px}.section-heading h2{font-size:21px;margin:0 0 2px}.section-heading p{font-size:13px;color:#555;margin:0}.question-card{border-bottom:1px solid #bbb;padding:22px 0 28px;background:#fff;break-inside:avoid}.meta{font-size:12px;color:#555}.stem{font-size:16px;margin:8px 0 14px}.stimulus{background:#fff;overflow-x:auto;padding:4px 0}.sequence{display:flex;align-items:center;gap:10px;min-width:max-content}.stage,.fixed-stage{width:190px;flex:0 0 190px;text-align:center}.stage-label,.fixed-stage-label{font-size:12px;font-weight:700;margin-bottom:5px}.stage-arrow{font-size:25px;line-height:1;flex:0 0 auto}.stimulus-stage{display:flex;align-items:center;justify-content:flex-start;overflow-x:auto;background:#fff}.options{display:grid;grid-template-columns:repeat(4,minmax(155px,1fr));gap:16px;margin:18px 0 10px;background:#fff}.option{min-width:0;text-align:center;background:#fff}.option-label{font-weight:700;margin-bottom:5px}.option-art{min-height:150px;display:flex;align-items:center;justify-content:center;overflow:auto;background:#fff}.option-art .fixed-stage{width:160px;flex-basis:160px}details{margin-top:10px;padding-top:8px;border-top:1px solid #e5e5e5}summary{font-weight:700;cursor:pointer}@media(max-width:760px){.wrap{padding:12px}.options{grid-template-columns:repeat(2,minmax(145px,1fr));gap:12px}}@media(max-width:430px){.options{grid-template-columns:1fr}.question-card{padding:18px 0 22px}}
  </style></head><body><main class="wrap"><section class="intro"><h1>PFC / TPF Final Combined English Learner Review V1</h1><p><strong>84 solver-backed review questions.</strong> This combines the remediated 48-question core with the separately approved triangle, hexagon and controlled-novel families.</p><p><strong>Important:</strong> the 84-question audit distribution is for coverage review, not the eventual production sampling ratio. Question Studio will apply provenance-aware production weights later.</p><p>Controlled-novel questions are explicitly labelled and are not represented as PYQs. Paper shape remains a representation axis, not a separate QL.</p><p class="authority">Authority: ${PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1.authorityId}</p></section>${sections}</main></body></html>`;
}
