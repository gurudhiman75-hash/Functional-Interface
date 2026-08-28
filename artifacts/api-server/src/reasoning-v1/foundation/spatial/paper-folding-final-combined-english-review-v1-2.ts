import {
  PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1_1,
  generatePfcTpfFinalCombinedEnglishReviewV1_1,
  renderPfcTpfFinalCombinedEnglishReviewHtmlV1_1,
} from "./paper-folding-final-combined-english-review-v1-1";
import {
  PFC_001_HEXAGON_LEARNER_REVIEW_AUTHORITY_V1_2,
  generatePfcHexagonLearnerReviewV1_2,
} from "./paper-folding-hexagon-learner-review-v1-2";
import {
  PFC_001_INNOVATION_LEARNER_REVIEW_AUTHORITY_V1_2,
  generatePfcInnovationLearnerReviewV1_2,
} from "./paper-folding-innovation-learner-review-v1-2";
import { PFC_001_OPTION_CLARITY_DEFECT_HOLD_V1 } from "./paper-folding-option-clarity-defect-hold-v1";
import type { PfcTpfFinalCombinedQuestionV1 } from "./paper-folding-final-combined-english-review-v1";

export const PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1_2 = Object.freeze({
  ...PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1_1,
  authorityId: "PFC-TPF-FINAL-COMBINED-ENGLISH-REVIEW-V1.2" as const,
  supersedesReviewCandidate: PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1_1.authorityId,
  optionClarityDefectHoldAuthority: PFC_001_OPTION_CLARITY_DEFECT_HOLD_V1.authorityId,
  hexagonReviewAuthority: PFC_001_HEXAGON_LEARNER_REVIEW_AUTHORITY_V1_2.authorityId,
  hexagonApprovalAuthority: null,
  controlledNovelReviewAuthority: PFC_001_INNOVATION_LEARNER_REVIEW_AUTHORITY_V1_2.authorityId,
  controlledNovelApprovalAuthority: null,
  remediationV1_2: [
    "CORE_RECT_DOUBLE_TRIANGLE_SPACING_ONLY_DISTRACTOR_REPLACED",
    "HEXAGON_SIX_SECTOR_RADIUS_ONLY_DISTRACTORS_REPLACED",
    "CONTROLLED_NOVEL_SCALE_ONLY_WRONG_DEPTH_REMOVED",
    "CONTROLLED_NOVEL_TRANSLATION_ONLY_WRONG_AXIS_REJECTED",
    "CONCEPTUAL_LAYER_COUNT_AXIS_TOPOLOGY_DISTRACTORS_REQUIRED",
    "CORRECT_OPTION_IDS_IMMUTABLE",
    "V1_1_BOUNDARY_CLEARANCE_RETAINED",
  ] as const,
  status: "FINAL_COMBINED_ENGLISH_V1_2_OPTION_CLARITY_HUMAN_REVIEW_REQUIRED" as const,
} as const);

const q = (value: number) => Math.round(value * 1000) / 1000;

function cutTriangle(cx: number, cy: number, direction: "UP" | "DOWN" | "LEFT" | "RIGHT", size = 4.5): string {
  let points: Array<[number, number]>;
  if (direction === "UP") points = [[cx, cy - size], [cx + size, cy + size], [cx - size, cy + size]];
  else if (direction === "DOWN") points = [[cx, cy + size], [cx + size, cy - size], [cx - size, cy - size]];
  else if (direction === "LEFT") points = [[cx - size, cy], [cx + size, cy - size], [cx + size, cy + size]];
  else points = [[cx + size, cy], [cx - size, cy - size], [cx - size, cy + size]];
  return `<polygon points="${points.map(([x, y]) => `${q(x)},${q(y)}`).join(" ")}" fill="none" data-cutout="transparent" stroke="#111" stroke-width="1.2" stroke-linejoin="round"/>`;
}

function rectDoubleTriangleWrongAxisSvg(): string {
  const marks = [
    cutTriangle(60, 13, "DOWN"),
    cutTriangle(106, 40, "LEFT"),
    cutTriangle(60, 67, "UP"),
    cutTriangle(14, 40, "RIGHT"),
  ].join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-9.6 -9.6 139.2 99.2" width="150" height="150" style="background:#fff" role="img" aria-label="Wrong-axis cross unfolding misconception"><rect x="0" y="0" width="120" height="80" fill="white" stroke="#111" stroke-width="1.4"/>${marks}</svg>`;
}

function remediateCoreSpacingOnlyChoice(question: PfcTpfFinalCombinedQuestionV1): PfcTpfFinalCombinedQuestionV1 {
  if (question.reviewId !== "PFC-TPF-REV-012") return question;
  if (question.correctOptionId !== "B") throw new Error("PFC-TPF-REV-012 correct answer drifted before V1.2 remediation.");
  return {
    ...question,
    options: question.options.map((option) => option.optionId === "C"
      ? { ...option, svg: rectDoubleTriangleWrongAxisSvg() }
      : option),
  };
}

export function generatePfcTpfFinalCombinedEnglishReviewV1_2(): PfcTpfFinalCombinedQuestionV1[] {
  const previous = generatePfcTpfFinalCombinedEnglishReviewV1_1();
  const retained = previous
    .filter((question) => question.surfaceId !== "HEXAGON_APPROVED" && question.surfaceId !== "CONTROLLED_NOVEL_APPROVED")
    .map(remediateCoreSpacingOnlyChoice);

  const hexagon = generatePfcHexagonLearnerReviewV1_2().map<PfcTpfFinalCombinedQuestionV1>((question) => ({
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

  const novel = generatePfcInnovationLearnerReviewV1_2().map<PfcTpfFinalCombinedQuestionV1>((question) => ({
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

  return [...retained, ...hexagon, ...novel];
}

export function renderPfcTpfFinalCombinedEnglishReviewHtmlV1_2(
  questions: readonly PfcTpfFinalCombinedQuestionV1[],
): string {
  return renderPfcTpfFinalCombinedEnglishReviewHtmlV1_1(questions)
    .replaceAll("PFC / TPF Final Combined English Review V1.1", "PFC / TPF Final Combined English Review V1.2")
    .replaceAll("PFC / TPF Final Combined English Learner Review V1.1", "PFC / TPF Final Combined English Learner Review V1.2")
    .replaceAll(PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1_1.authorityId, PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1_2.authorityId)
    .replace(
      "Part C — Approved regular-hexagon representation",
      "Part C — Option-clarity-remediated regular-hexagon representation",
    )
    .replace(
      "Part D — Boundary-clearance-remediated controlled-novel constructions",
      "Part D — Boundary + option-clarity-remediated controlled-novel constructions",
    )
    .replace(
      "This combines the remediated 48-question core with approved triangle and hexagon families plus the boundary-clearance-remediated controlled-novel V1.1 family.",
      "V1.2 keeps the solver-approved questions while replacing distractors that differed mainly by slight spacing, uniform scaling, or small translation. Wrong choices must now represent a different reasoning error.",
    );
}
