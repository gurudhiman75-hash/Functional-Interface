import {
  PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_3,
  generatePfcTpfSourceSaturatedEnglishReviewV1_5_3,
  renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_5_3,
} from "./paper-folding-source-saturated-english-review-v1-5-3";
import type { PfcTpfEnglishReviewQuestionV1 } from "./paper-folding-source-saturated-english-review-v1";

export const PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_4 = Object.freeze({
  ...PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_3,
  authorityId: "PFC-TPF-SOURCE-SATURATED-ENGLISH-REVIEW-V1.5.4" as const,
  supersedesReviewCandidate: PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_3.authorityId,
  visualRemediationV1_5_4: [
    "Q46_NEAR_DUPLICATE_TRANSPARENT_OPTION_REMOVED",
    "VISIBLE_STROKE_OVERLAP_AUDIT",
    "COARSE_RASTER_OPTION_DISTANCE_GATE",
    "CORRECT_OPTION_IMMUTABLE",
  ] as const,
  status: "LEARNER_REVIEW_CANDIDATE_V1_5_4_NOT_FROZEN" as const,
} as const);

function pointOnlyTransparentOption(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 116 116" width="150" height="150" style="background:#fff" role="img"><rect x="0" y="0" width="100" height="100" fill="white" stroke="#111" stroke-width="1.5"/><circle cx="74" cy="70" r="2.1" fill="#111" stroke="none" stroke-width="0"/></svg>`;
}

function remediateQ46(question: PfcTpfEnglishReviewQuestionV1): PfcTpfEnglishReviewQuestionV1 {
  if (question.sourceId !== "TPF-W2-HORIZONTAL-CROSSING-POLYGON") return question;
  if (question.correctOptionId !== "D") throw new Error(`${question.reviewQuestionId} expected D as the retained correct option.`);
  return {
    ...question,
    options: question.options.map((option) => option.optionId === "A"
      ? { ...option, svg: pointOnlyTransparentOption() }
      : option),
  };
}

export function generatePfcTpfSourceSaturatedEnglishReviewV1_5_4(): PfcTpfEnglishReviewQuestionV1[] {
  return generatePfcTpfSourceSaturatedEnglishReviewV1_5_3().map(remediateQ46);
}

export function renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_5_4(
  questions: readonly PfcTpfEnglishReviewQuestionV1[],
): string {
  return renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_5_3(questions)
    .replaceAll("PFC / TPF Source-Saturated English Learner Review V1.5.3", "PFC / TPF Source-Saturated English Learner Review V1.5.4")
    .replaceAll(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_3.authorityId, PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_4.authorityId);
}
