import {
  PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1,
  generatePfcTpfFinalCombinedEnglishReviewV1,
  renderPfcTpfFinalCombinedEnglishReviewHtmlV1,
  type PfcTpfFinalCombinedQuestionV1,
} from "./paper-folding-final-combined-english-review-v1";
import {
  PFC_001_INNOVATION_LEARNER_REVIEW_AUTHORITY_V1_1,
  generatePfcInnovationLearnerReviewV1_1,
} from "./paper-folding-innovation-learner-review-v1-1";
import { PFC_001_BOUNDARY_CLEARANCE_DEFECT_HOLD_V1 } from "./paper-folding-boundary-clearance-defect-hold-v1";

export const PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1_1 = Object.freeze({
  ...PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1,
  authorityId: "PFC-TPF-FINAL-COMBINED-ENGLISH-REVIEW-V1.1" as const,
  supersedesReviewCandidate: PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1.authorityId,
  defectHoldAuthority: PFC_001_BOUNDARY_CLEARANCE_DEFECT_HOLD_V1.authorityId,
  controlledNovelReviewAuthority: PFC_001_INNOVATION_LEARNER_REVIEW_AUTHORITY_V1_1.authorityId,
  controlledNovelApprovalAuthority: null,
  remediationV1_1: [
    "CONTROLLED_NOVEL_INTERIOR_PUNCH_FULL_RADIUS_CLEARANCE",
    "FOLDED_PACKET_EDGE_CLEARANCE_ON_EVERY_AFFECTED_LAYER",
    "UNFOLDED_SOURCE_EDGE_CLEARANCE_ON_EVERY_MAPPED_MARK",
    "VISIBLE_STROKE_GAP_IN_CORRECT_OPTIONS",
    "OLD_CONTROLLED_NOVEL_APPROVAL_NOT_CARRIED_FORWARD",
    "CORE_TRIANGLE_HEXAGON_SURFACES_IMMUTABLE",
  ] as const,
  status: "FINAL_COMBINED_ENGLISH_V1_1_HUMAN_REVIEW_REQUIRED" as const,
} as const);

export function generatePfcTpfFinalCombinedEnglishReviewV1_1(): PfcTpfFinalCombinedQuestionV1[] {
  const retained = generatePfcTpfFinalCombinedEnglishReviewV1().filter((question) => question.surfaceId !== "CONTROLLED_NOVEL_APPROVED");
  const remediatedNovel = generatePfcInnovationLearnerReviewV1_1().map<PfcTpfFinalCombinedQuestionV1>((question) => ({
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
  return [...retained, ...remediatedNovel];
}

export function renderPfcTpfFinalCombinedEnglishReviewHtmlV1_1(
  questions: readonly PfcTpfFinalCombinedQuestionV1[],
): string {
  return renderPfcTpfFinalCombinedEnglishReviewHtmlV1(questions)
    .replaceAll("PFC / TPF Final Combined English Review V1", "PFC / TPF Final Combined English Review V1.1")
    .replaceAll("PFC / TPF Final Combined English Learner Review V1", "PFC / TPF Final Combined English Learner Review V1.1")
    .replaceAll(PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1.authorityId, PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1_1.authorityId)
    .replace(
      "This combines the remediated 48-question core with the separately approved triangle, hexagon and controlled-novel families.",
      "This combines the remediated 48-question core with approved triangle and hexagon families plus the boundary-clearance-remediated controlled-novel V1.1 family.",
    )
    .replace(
      "Part D — Approved controlled-novel constructions",
      "Part D — Boundary-clearance-remediated controlled-novel constructions",
    );
}
