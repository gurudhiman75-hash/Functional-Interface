import {
  PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1,
  generatePfcTpfSourceSaturatedEnglishReviewV1,
  renderPfcTpfSourceSaturatedEnglishReviewHtmlV1,
  type PfcTpfEnglishReviewQuestionV1,
} from "./paper-folding-source-saturated-english-review-v1";
import { pfcGapClosureScenariosWave2 } from "./paper-folding-source-saturated-discovery-v2";

export const PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_1 = Object.freeze({
  ...PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1,
  authorityId: "PFC-TPF-SOURCE-SATURATED-ENGLISH-REVIEW-V1.1" as const,
  supersedesReviewCandidate: PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1.authorityId,
  presentationRemediation: "OPEN_EDGE_NOTCH_MOUTH_IN_FINAL_FOLDED_STIMULUS" as const,
  status: "LEARNER_REVIEW_CANDIDATE_V1_1_NOT_FROZEN" as const,
} as const);

const q = (value: number) => Math.round(value * 1000) / 1000;

function patchOpenNotchMouth(question: PfcTpfEnglishReviewQuestionV1): PfcTpfEnglishReviewQuestionV1 {
  if (question.taskKind !== "MULTISHAPE_FORWARD") return question;
  const scenario = pfcGapClosureScenariosWave2().find((item) => item.scenarioId === question.sourceId);
  if (!scenario) return question;
  let stimulusSvg = question.stimulusSvg;
  for (const cut of scenario.cuts) {
    if (cut.kind !== "EDGE_NOTCH" || cut.vertices.length < 3) continue;
    const first = cut.vertices[0];
    const last = cut.vertices[cut.vertices.length - 1];
    const points = cut.vertices.map((point) => `${q(point.x)},${q(point.y)}`).join(" ");
    const polyline = `<polyline points="${points}" fill="white" stroke="#111" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
    const eraser = `<line x1="${q(first.x)}" y1="${q(first.y)}" x2="${q(last.x)}" y2="${q(last.y)}" stroke="white" stroke-width="5" stroke-linecap="round"/>`;
    if (!stimulusSvg.includes(polyline)) {
      throw new Error(`Expected folded-notch presentation fragment was not found for ${question.sourceId}.`);
    }
    stimulusSvg = stimulusSvg.replace(polyline, `${eraser}${polyline}`);
  }
  return { ...question, stimulusSvg };
}

export function generatePfcTpfSourceSaturatedEnglishReviewV1_1(): PfcTpfEnglishReviewQuestionV1[] {
  return generatePfcTpfSourceSaturatedEnglishReviewV1().map(patchOpenNotchMouth);
}

export function renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_1(
  questions: readonly PfcTpfEnglishReviewQuestionV1[],
): string {
  return renderPfcTpfSourceSaturatedEnglishReviewHtmlV1(questions)
    .replaceAll("PFC / TPF Source-Saturated English Learner Review V1", "PFC / TPF Source-Saturated English Learner Review V1.1")
    .replaceAll(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1.authorityId, PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_1.authorityId);
}
