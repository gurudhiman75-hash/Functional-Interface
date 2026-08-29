import {
  PFC_001_HEXAGON_LEARNER_REVIEW_AUTHORITY_V1,
  generatePfcHexagonLearnerReviewV1,
  renderPfcHexagonLearnerReviewHtmlV1,
  type PfcHexagonReviewQuestionV1,
} from "./paper-folding-hexagon-learner-review-v1";
import type { SpatialPoint } from "./types";

export const PFC_001_HEXAGON_LEARNER_REVIEW_AUTHORITY_V1_1 = Object.freeze({
  ...PFC_001_HEXAGON_LEARNER_REVIEW_AUTHORITY_V1,
  authorityId: "PFC-001-HEXAGON-LEARNER-REVIEW-V1.1" as const,
  supersedesReviewCandidate: PFC_001_HEXAGON_LEARNER_REVIEW_AUTHORITY_V1.authorityId,
  presentationRemediation: [
    "SINGLE_AXIS_CREASE_CLIPPED_TO_HEXAGON_BOUNDARY",
    "REVERSE_PROCESS_CREASES_CLIPPED_IDENTICALLY",
    "CORRECT_ANSWERS_AND_OPTION_PATTERNS_IMMUTABLE",
  ] as const,
  status: "FOCUSED_HEXAGON_REVIEW_V1_1_NOT_FROZEN" as const,
} as const);

const CENTER: SpatialPoint = { x: 60, y: 60 };
const RADIUS = 48;
const EPSILON = 1e-7;
const q = (value: number) => Math.round(value * 1000) / 1000;
const HEXAGON: SpatialPoint[] = Array.from({ length: 6 }, (_, index) => {
  const angle = -Math.PI / 2 + index * Math.PI / 3;
  return { x: CENTER.x + RADIUS * Math.cos(angle), y: CENTER.y + RADIUS * Math.sin(angle) };
});

function cross(a: SpatialPoint, b: SpatialPoint): number {
  return a.x * b.y - a.y * b.x;
}

function subtract(a: SpatialPoint, b: SpatialPoint): SpatialPoint {
  return { x: a.x - b.x, y: a.y - b.y };
}

function clippedLineEndpoints(a: SpatialPoint, b: SpatialPoint): [SpatialPoint, SpatialPoint] {
  const direction = subtract(b, a);
  const intersections: SpatialPoint[] = [];
  for (let index = 0; index < HEXAGON.length; index += 1) {
    const edgeA = HEXAGON[index];
    const edgeB = HEXAGON[(index + 1) % HEXAGON.length];
    const edge = subtract(edgeB, edgeA);
    const denominator = cross(direction, edge);
    if (Math.abs(denominator) <= EPSILON) continue;
    const offset = subtract(edgeA, a);
    const t = cross(offset, edge) / denominator;
    const u = cross(offset, direction) / denominator;
    if (u < -EPSILON || u > 1 + EPSILON) continue;
    const point = { x: q(a.x + direction.x * t), y: q(a.y + direction.y * t) };
    if (!intersections.some((item) => Math.hypot(item.x - point.x, item.y - point.y) <= 1e-4)) intersections.push(point);
  }
  if (intersections.length < 2) throw new Error("Hexagon crease line did not intersect the paper boundary twice.");
  let best: [SpatialPoint, SpatialPoint] = [intersections[0], intersections[1]];
  let bestDistance = 0;
  for (let left = 0; left < intersections.length; left += 1) {
    for (let right = left + 1; right < intersections.length; right += 1) {
      const distance = Math.hypot(intersections[left].x - intersections[right].x, intersections[left].y - intersections[right].y);
      if (distance > bestDistance) {
        bestDistance = distance;
        best = [intersections[left], intersections[right]];
      }
    }
  }
  return best;
}

function numberAttr(tag: string, name: string): number {
  const match = tag.match(new RegExp(`\\b${name}="(-?\\d+(?:\\.\\d+)?)"`));
  if (!match) throw new Error(`Missing ${name} on hexagon crease tag.`);
  return Number(match[1]);
}

function setAttr(tag: string, name: string, value: number): string {
  return tag.replace(new RegExp(`\\b${name}="[^"]+"`), `${name}="${q(value)}"`);
}

function clipCreases(markup: string): string {
  return markup.replace(/<line\b[^>]*stroke="#555"[^>]*stroke-dasharray="4 3"[^>]*\/>/g, (tag) => {
    const a = { x: numberAttr(tag, "x1"), y: numberAttr(tag, "y1") };
    const b = { x: numberAttr(tag, "x2"), y: numberAttr(tag, "y2") };
    const [clippedA, clippedB] = clippedLineEndpoints(a, b);
    return setAttr(setAttr(setAttr(setAttr(tag, "x1", clippedA.x), "y1", clippedA.y), "x2", clippedB.x), "y2", clippedB.y);
  });
}

export function generatePfcHexagonLearnerReviewV1_1(): PfcHexagonReviewQuestionV1[] {
  return generatePfcHexagonLearnerReviewV1().map((question) => ({
    ...question,
    stimulusSvg: clipCreases(question.stimulusSvg),
    options: question.options.map((option) => ({ ...option, svg: clipCreases(option.svg) })),
  }));
}

export function renderPfcHexagonLearnerReviewHtmlV1_1(questions: readonly PfcHexagonReviewQuestionV1[]): string {
  return renderPfcHexagonLearnerReviewHtmlV1(questions)
    .replaceAll("PFC-001 Hexagon Substrate Gap Review V1", "PFC-001 Hexagon Substrate Gap Review V1.1");
}
