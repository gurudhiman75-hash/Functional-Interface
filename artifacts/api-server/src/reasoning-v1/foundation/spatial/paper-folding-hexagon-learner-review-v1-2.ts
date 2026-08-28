import {
  pfcHexagonDiscoveryScenariosV1,
  solvePfcHexagonScenarioV1,
  type PfcHexMappedCutV1,
} from "./paper-folding-hexagon-discovery-v1";
import {
  PFC_001_HEXAGON_LEARNER_REVIEW_AUTHORITY_V1_1,
  generatePfcHexagonLearnerReviewV1_1,
  renderPfcHexagonLearnerReviewHtmlV1_1,
  type PfcHexagonReviewQuestionV1,
} from "./paper-folding-hexagon-learner-review-v1-1";
import { PFC_001_OPTION_CLARITY_DEFECT_HOLD_V1 } from "./paper-folding-option-clarity-defect-hold-v1";
import type { SpatialPoint } from "./types";

export const PFC_001_HEXAGON_LEARNER_REVIEW_AUTHORITY_V1_2 = Object.freeze({
  ...PFC_001_HEXAGON_LEARNER_REVIEW_AUTHORITY_V1_1,
  authorityId: "PFC-001-HEXAGON-LEARNER-REVIEW-V1.2" as const,
  supersedesReviewCandidate: PFC_001_HEXAGON_LEARNER_REVIEW_AUTHORITY_V1_1.authorityId,
  optionClarityDefectHoldAuthority: PFC_001_OPTION_CLARITY_DEFECT_HOLD_V1.authorityId,
  optionClarityRemediation: [
    "WRONG_RADIUS_SIX_SECTOR_PATTERN_REMOVED",
    "FOUR_LAYER_MISCOUNT_REPLACES_SCALE_ONLY_DISTRACTOR",
    "CORRECT_ANSWERS_IMMUTABLE",
    "V1_1_CLIPPED_CREASE_PRESENTATION_RETAINED",
  ] as const,
  status: "FOCUSED_HEXAGON_REVIEW_V1_2_OPTION_CLARITY_HUMAN_REVIEW_REQUIRED" as const,
} as const);

const CENTER: SpatialPoint = { x: 60, y: 60 };
const RADIUS = 48;
const q = (value: number) => Math.round(value * 1000) / 1000;
const HEXAGON: SpatialPoint[] = Array.from({ length: 6 }, (_, index) => {
  const angle = -Math.PI / 2 + index * Math.PI / 3;
  return { x: CENTER.x + RADIUS * Math.cos(angle), y: CENTER.y + RADIUS * Math.sin(angle) };
});

function pts(points: readonly SpatialPoint[]): string {
  return points.map((point) => `${q(point.x)},${q(point.y)}`).join(" ");
}

function renderCut(cut: PfcHexMappedCutV1): string {
  if (cut.kind === "CIRCLE_HOLE") {
    return `<circle cx="${q(cut.center.x)}" cy="${q(cut.center.y)}" r="${q(cut.radius)}" fill="none" data-cutout="transparent" stroke="#111" stroke-width="1.7"/>`;
  }
  if (cut.kind === "SLIT") {
    return `<line x1="${q(cut.a.x)}" y1="${q(cut.a.y)}" x2="${q(cut.b.x)}" y2="${q(cut.b.y)}" stroke="#111" stroke-width="2" stroke-linecap="round"/>`;
  }
  return `<polygon points="${pts(cut.vertices)}" fill="none" data-cutout="transparent" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/>`;
}

function patternSvg(marks: readonly PfcHexMappedCutV1[], label: string): string {
  const minX = Math.min(...HEXAGON.map((point) => point.x));
  const maxX = Math.max(...HEXAGON.map((point) => point.x));
  const minY = Math.min(...HEXAGON.map((point) => point.y));
  const maxY = Math.max(...HEXAGON.map((point) => point.y));
  const span = Math.max(maxX - minX, maxY - minY);
  const side = span * 1.30;
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  const viewBox = `${q(cx - side / 2)} ${q(cy - side / 2)} ${q(side)} ${q(side)}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="150" height="140" data-paper-fill="${span / side}" role="img" aria-label="${label}" style="background:#fff"><polygon points="${pts(HEXAGON)}" fill="white" stroke="#111" stroke-width="1.8" stroke-linejoin="round"/>${marks.map(renderCut).join("")}</svg>`;
}

export function generatePfcHexagonLearnerReviewV1_2(): PfcHexagonReviewQuestionV1[] {
  const scenarios = new Map(pfcHexagonDiscoveryScenariosV1().map((scenario) => [scenario.scenarioId, scenario]));
  return generatePfcHexagonLearnerReviewV1_1().map((question) => {
    if (question.family !== "HEXAGON_SIX_SECTOR_RADIAL") return question;
    const scenario = scenarios.get(question.sourceScenarioId);
    if (!scenario) throw new Error(`${question.reviewId} has no hexagon discovery scenario.`);
    const correctMarks = solvePfcHexagonScenarioV1(scenario).mappedCuts;
    if (correctMarks.length !== 6) throw new Error(`${question.reviewId} expected six mapped sector cuts.`);
    const wrongFour = [correctMarks[0], correctMarks[1], correctMarks[3], correctMarks[4]];
    return {
      ...question,
      options: question.options.map((option) => option.semantic === "WRONG_RADIUS_SIX_SECTOR_PATTERN"
        ? {
            ...option,
            semantic: "WRONG_FOUR_LAYER_PATTERN",
            svg: patternSvg(wrongFour, `Hexagonal four-layer misconception option ${option.optionId}`),
          }
        : option),
    };
  });
}

export function renderPfcHexagonLearnerReviewHtmlV1_2(questions: readonly PfcHexagonReviewQuestionV1[]): string {
  return renderPfcHexagonLearnerReviewHtmlV1_1(questions)
    .replaceAll("PFC-001 Hexagon Substrate Gap Review V1.1", "PFC-001 Hexagon Substrate Gap Review V1.2");
}
