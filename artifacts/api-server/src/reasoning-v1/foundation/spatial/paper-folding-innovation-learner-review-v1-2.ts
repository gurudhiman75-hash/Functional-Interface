import { pointInPolygonInclusiveV1 } from "./paper-folding-foundation-v1";
import { pfcInnovationDiscoveryScenariosV1 } from "./paper-folding-innovation-discovery-v1";
import {
  PFC_001_INNOVATION_LEARNER_REVIEW_AUTHORITY_V1_1,
  generatePfcInnovationLearnerReviewV1_1,
  renderPfcInnovationLearnerReviewHtmlV1_1,
  type PfcInnovationLearnerQuestionV1_1,
} from "./paper-folding-innovation-learner-review-v1-1";
import { PFC_001_OPTION_CLARITY_DEFECT_HOLD_V1 } from "./paper-folding-option-clarity-defect-hold-v1";
import type { SpatialPoint } from "./types";

export const PFC_001_INNOVATION_LEARNER_REVIEW_AUTHORITY_V1_2 = Object.freeze({
  ...PFC_001_INNOVATION_LEARNER_REVIEW_AUTHORITY_V1_1,
  authorityId: "PFC-001-CONTROLLED-NOVEL-LEARNER-REVIEW-V1.2" as const,
  supersedesReviewCandidate: PFC_001_INNOVATION_LEARNER_REVIEW_AUTHORITY_V1_1.authorityId,
  optionClarityDefectHoldAuthority: PFC_001_OPTION_CLARITY_DEFECT_HOLD_V1.authorityId,
  optionClarityRemediation: [
    "UNIFORM_SCALE_OF_CORRECT_PATTERN_REMOVED",
    "SMALL_TRANSLATION_COPY_REJECTED_FOR_WRONG_AXIS",
    "WRONG_LAYER_COUNT_REPLACES_WRONG_DEPTH_SCALE",
    "WRONG_AXIS_MUST_CHANGE_ORIENTATION_OR_TOPOLOGY",
    "CORRECT_OPTION_IDS_RETAINED",
    "BOUNDARY_CLEARANCE_V1_1_RETAINED",
  ] as const,
  status: "CONTROLLED_NOVEL_V1_2_OPTION_CLARITY_HUMAN_REVIEW_REQUIRED" as const,
} as const);

type OptionId = "A" | "B" | "C" | "D";
export type PfcInnovationOptionSemanticV1_2 =
  | "FORGOT_TO_UNFOLD"
  | "WRONG_AXIS_MAPPING"
  | "WRONG_LAYER_COUNT"
  | "CORRECT_PATTERN";

export interface PfcInnovationLearnerOptionV1_2 {
  optionId: OptionId;
  svg: string;
  semantic: PfcInnovationOptionSemanticV1_2;
}

export interface PfcInnovationLearnerQuestionV1_2 extends Omit<PfcInnovationLearnerQuestionV1_1, "options"> {
  options: PfcInnovationLearnerOptionV1_2[];
}

const PUNCH_RADIUS = 2.2;
const q = (value: number) => Math.round(value * 1000) / 1000;

function centroid(points: readonly SpatialPoint[]): SpatialPoint {
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
}

function sourceSpan(points: readonly SpatialPoint[]): number {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  return Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), 1);
}

function rotate(point: SpatialPoint, center: SpatialPoint, degrees: number): SpatialPoint {
  const radians = degrees * Math.PI / 180;
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return {
    x: q(center.x + dx * Math.cos(radians) - dy * Math.sin(radians)),
    y: q(center.y + dx * Math.sin(radians) + dy * Math.cos(radians)),
  };
}

function reflectVertical(point: SpatialPoint, center: SpatialPoint): SpatialPoint {
  return { x: q(2 * center.x - point.x), y: q(point.y) };
}

function reflectHorizontal(point: SpatialPoint, center: SpatialPoint): SpatialPoint {
  return { x: q(point.x), y: q(2 * center.y - point.y) };
}

function key(points: readonly SpatialPoint[]): string {
  return points.map((point) => `${q(point.x)},${q(point.y)}`).sort().join("|");
}

function rmsRadius(points: readonly SpatialPoint[], center: SpatialPoint): number {
  return Math.sqrt(points.reduce((sum, point) => sum + (point.x - center.x) ** 2 + (point.y - center.y) ** 2, 0) / points.length);
}

function nearestResidual(a: readonly SpatialPoint[], b: readonly SpatialPoint[]): number {
  const ca = centroid(a), cb = centroid(b);
  const ra = rmsRadius(a, ca), rb = rmsRadius(b, cb);
  if (ra <= 1e-9 || rb <= 1e-9) return Number.POSITIVE_INFINITY;
  const normalize = (point: SpatialPoint, center: SpatialPoint, radius: number) => ({
    x: (point.x - center.x) / radius,
    y: (point.y - center.y) / radius,
  });
  const aa = a.map((point) => normalize(point, ca, ra));
  const bb = b.map((point) => normalize(point, cb, rb));
  const directed = (left: readonly SpatialPoint[], right: readonly SpatialPoint[]) => left.map((point) =>
    Math.min(...right.map((other) => Math.hypot(point.x - other.x, point.y - other.y))),
  );
  const distances = [...directed(aa, bb), ...directed(bb, aa)];
  return Math.sqrt(distances.reduce((sum, value) => sum + value * value, 0) / distances.length);
}

function spacingOnlyCopy(
  boundary: readonly SpatialPoint[],
  candidate: readonly SpatialPoint[],
  correct: readonly SpatialPoint[],
): boolean {
  if (candidate.length !== correct.length || candidate.length < 2) return false;
  const span = sourceSpan(boundary);
  const cc = centroid(correct), cd = centroid(candidate);
  const centroidShift = Math.hypot(cc.x - cd.x, cc.y - cd.y) / span;
  const rc = rmsRadius(correct, cc), rd = rmsRadius(candidate, cd);
  const scaleRatio = Math.max(rc / Math.max(rd, 1e-9), rd / Math.max(rc, 1e-9));
  return centroidShift < 0.12 && scaleRatio < 2.3 && nearestResidual(candidate, correct) < 0.10;
}

function inside(boundary: readonly SpatialPoint[], points: readonly SpatialPoint[]): boolean {
  return points.every((point) => pointInPolygonInclusiveV1(point, boundary));
}

function profileBaseRotation(profile: string): number {
  if (profile === "REGULAR_PENTAGON") return 72;
  if (profile === "REGULAR_OCTAGON") return 45;
  return 90;
}

function wrongAxisPositions(boundary: readonly SpatialPoint[], profile: string, correct: readonly SpatialPoint[]): SpatialPoint[] {
  const center = centroid(boundary);
  const base = profileBaseRotation(profile);
  const wholeTransforms: Array<(point: SpatialPoint) => SpatialPoint> = [
    (point) => rotate(point, center, base),
    (point) => rotate(point, center, -base),
    (point) => reflectVertical(point, center),
    (point) => reflectHorizontal(point, center),
    (point) => rotate(point, center, 90),
    (point) => rotate(point, center, -90),
    (point) => rotate(point, center, 180),
  ];
  for (const transform of wholeTransforms) {
    const candidate = correct.map(transform);
    if (key(candidate) === key(correct) || !inside(boundary, candidate)) continue;
    if (!spacingOnlyCopy(boundary, candidate, correct)) return candidate;
  }

  for (let index = 0; index < correct.length; index += 1) {
    for (const transform of [(point: SpatialPoint) => reflectVertical(point, center), (point: SpatialPoint) => reflectHorizontal(point, center)]) {
      const candidate = correct.map((point, itemIndex) => itemIndex === index ? transform(point) : { ...point });
      if (key(candidate) === key(correct) || !inside(boundary, candidate)) continue;
      if (!spacingOnlyCopy(boundary, candidate, correct)) return candidate;
    }
  }
  throw new Error("Controlled-novel V1.2 could not create a visually distinct wrong-axis pattern.");
}

function wrongLayerPositions(boundary: readonly SpatialPoint[], correct: readonly SpatialPoint[]): SpatialPoint[] {
  if (correct.length >= 4) return correct.filter((_, index) => index % 2 === 0);
  if (correct.length >= 3) return correct.slice(0, correct.length - 1);

  const center = centroid(boundary);
  const midpoint = {
    x: (correct[0].x + correct[1].x) / 2,
    y: (correct[0].y + correct[1].y) / 2,
  };
  const dx = correct[1].x - correct[0].x;
  const dy = correct[1].y - correct[0].y;
  const length = Math.max(Math.hypot(dx, dy), 1);
  const perpendicular = { x: -dy / length, y: dx / length };
  const extras: SpatialPoint[] = [
    center,
    rotate(correct[0], center, 180),
    rotate(correct[1], center, 180),
    { x: q(midpoint.x + perpendicular.x * 14), y: q(midpoint.y + perpendicular.y * 14) },
    { x: q(midpoint.x - perpendicular.x * 14), y: q(midpoint.y - perpendicular.y * 14) },
  ];
  for (let radius = 12; radius <= 30; radius += 6) {
    for (let degrees = 0; degrees < 360; degrees += 45) {
      const radians = degrees * Math.PI / 180;
      extras.push({ x: q(center.x + Math.cos(radians) * radius), y: q(center.y + Math.sin(radians) * radius) });
    }
  }
  const extra = extras.find((point) =>
    pointInPolygonInclusiveV1(point, boundary)
    && correct.every((existing) => Math.hypot(existing.x - point.x, existing.y - point.y) >= 8),
  );
  if (!extra) throw new Error("Controlled-novel V1.2 could not place a distinct extra-layer misconception mark.");
  return [...correct, extra];
}

function pts(points: readonly SpatialPoint[]): string {
  return points.map((point) => `${q(point.x)},${q(point.y)}`).join(" ");
}

function fittedViewBox(points: readonly SpatialPoint[]): string {
  const xs = points.map((point) => point.x), ys = points.map((point) => point.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const span = Math.max(maxX - minX, maxY - minY, 1);
  const side = span * 1.30;
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  return `${q(cx - side / 2)} ${q(cy - side / 2)} ${q(side)} ${q(side)}`;
}

function patternSvg(boundary: readonly SpatialPoint[], positions: readonly SpatialPoint[], label: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${fittedViewBox(boundary)}" width="150" height="140" role="img" aria-label="${label}" style="background:#fff;display:block;max-width:100%;height:auto"><polygon points="${pts(boundary)}" fill="white" stroke="#111" stroke-width="1.8" stroke-linejoin="round"/>${positions.map((point) => `<circle cx="${q(point.x)}" cy="${q(point.y)}" r="${PUNCH_RADIUS}" fill="none" data-cutout="transparent" stroke="#111" stroke-width="1.7"/>`).join("")}</svg>`;
}

export function generatePfcInnovationLearnerReviewV1_2(): PfcInnovationLearnerQuestionV1_2[] {
  const questions = generatePfcInnovationLearnerReviewV1_1();
  const scenarios = new Map(pfcInnovationDiscoveryScenariosV1().map((scenario) => [scenario.candidate.candidateId, scenario]));

  return questions.map((question) => {
    const scenario = scenarios.get(question.sourceCandidateId);
    if (!scenario) throw new Error(`${question.reviewId} has no controlled-novel discovery scenario.`);
    const correct = question.unfoldedPositions;
    const semanticByWrongSlot: PfcInnovationOptionSemanticV1_2[] = [
      "FORGOT_TO_UNFOLD",
      "WRONG_AXIS_MAPPING",
      "WRONG_LAYER_COUNT",
    ];
    let wrongIndex = 0;
    const options = question.options.map<PfcInnovationLearnerOptionV1_2>((option) => {
      let semantic: PfcInnovationOptionSemanticV1_2;
      let positions: SpatialPoint[];
      if (option.optionId === question.correctOptionId) {
        semantic = "CORRECT_PATTERN";
        positions = [...correct];
      } else {
        semantic = semanticByWrongSlot[wrongIndex++];
        if (semantic === "FORGOT_TO_UNFOLD") positions = [correct[0]];
        else if (semantic === "WRONG_AXIS_MAPPING") positions = wrongAxisPositions(scenario.boundary, scenario.substrateProfile, correct);
        else positions = wrongLayerPositions(scenario.boundary, correct);
      }
      return {
        optionId: option.optionId,
        semantic,
        svg: patternSvg(scenario.boundary, positions, `Controlled-novel V1.2 unfolded option ${option.optionId}`),
      };
    });
    return { ...question, options };
  });
}

export function renderPfcInnovationLearnerReviewHtmlV1_2(
  questions: readonly PfcInnovationLearnerQuestionV1_2[],
): string {
  return renderPfcInnovationLearnerReviewHtmlV1_1(questions as unknown as PfcInnovationLearnerQuestionV1_1[])
    .replaceAll("PFC Controlled-Novel Learner Review V1.1", "PFC Controlled-Novel Learner Review V1.2")
    .replace(
      "V1.1 additionally guarantees",
      "V1.2 retains the V1.1 boundary guarantee and also removes spacing-only distractors. It guarantees",
    );
}
