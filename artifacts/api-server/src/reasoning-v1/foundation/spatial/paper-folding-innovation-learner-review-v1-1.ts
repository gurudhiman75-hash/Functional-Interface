import {
  applyPfcFoldV1,
  pointInPolygonInclusiveV1,
  signedSideOfLineV1,
  solvePfcCutsV1,
  type PfcLayerFragmentV1,
} from "./paper-folding-foundation-v1";
import {
  pfcInnovationDiscoveryScenariosV1,
  type PfcInnovationScenarioV1,
} from "./paper-folding-innovation-discovery-v1";
import {
  PFC_001_INNOVATION_LEARNER_REVIEW_AUTHORITY_V1,
  generatePfcInnovationLearnerReviewV1,
  renderPfcInnovationLearnerReviewHtmlV1,
  type PfcInnovationLearnerQuestionV1,
} from "./paper-folding-innovation-learner-review-v1";
import type { PfcNovelSubstrateProfileV1 } from "./paper-folding-content-innovation-envelope-v1";
import type { SpatialPoint } from "./types";

export const PFC_001_INNOVATION_LEARNER_REVIEW_AUTHORITY_V1_1 = Object.freeze({
  ...PFC_001_INNOVATION_LEARNER_REVIEW_AUTHORITY_V1,
  authorityId: "PFC-001-CONTROLLED-NOVEL-LEARNER-REVIEW-V1.1" as const,
  supersedesReviewCandidate: PFC_001_INNOVATION_LEARNER_REVIEW_AUTHORITY_V1.authorityId,
  boundaryClearanceRemediation: [
    "FULL_PUNCH_RADIUS_INCLUDED_IN_INTERIOR_CLEARANCE",
    "FOLDED_PACKET_BOUNDARY_CLEARANCE_REQUIRED_ON_EVERY_AFFECTED_LAYER",
    "UNFOLDED_SOURCE_BOUNDARY_CLEARANCE_REQUIRED_FOR_EVERY_MAPPED_MARK",
    "VISIBLE_STROKE_GAP_REQUIRED_AFTER_UNFOLDING",
    "CORRECT_OPTION_IDS_RETAINED",
    "QUESTION_SKILL_AND_PROVENANCE_RETAINED",
  ] as const,
  interiorPunchRadius: 2.2,
  minimumCenterToBoundaryClearance: 6,
  minimumVisibleGapAfterStrokes: 2,
  status: "CONTROLLED_NOVEL_BOUNDARY_CLEARANCE_HUMAN_REVIEW_REQUIRED" as const,
} as const);

const PUNCH_RADIUS = 2.2;
const MIN_CENTER_BOUNDARY_CLEARANCE = 6;
const PAPER_STROKE_HALF = 1.8 / 2;
const PUNCH_STROKE_HALF = 1.7 / 2;
const MIN_VISIBLE_GAP = 2;
const q = (value: number) => Math.round(value * 1000) / 1000;

type OptionSemantic = PfcInnovationLearnerQuestionV1["options"][number]["semantic"];

export interface PfcInnovationLearnerQuestionV1_1 extends PfcInnovationLearnerQuestionV1 {
  clearanceAudit: {
    foldedPacketCenterClearance: number;
    unfoldedSourceCenterClearance: number;
    unfoldedVisibleGap: number;
  };
}

function distancePointToSegment(point: SpatialPoint, a: SpatialPoint, b: SpatialPoint): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared <= 1e-12) return Math.hypot(point.x - a.x, point.y - a.y);
  const t = Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / lengthSquared));
  return Math.hypot(point.x - (a.x + t * dx), point.y - (a.y + t * dy));
}

function distanceToPolygonBoundary(point: SpatialPoint, polygon: readonly SpatialPoint[]): number {
  let minimum = Number.POSITIVE_INFINITY;
  for (let index = 0; index < polygon.length; index += 1) {
    minimum = Math.min(minimum, distancePointToSegment(point, polygon[index], polygon[(index + 1) % polygon.length]));
  }
  return minimum;
}

function rootFragments(boundary: readonly SpatialPoint[]): PfcLayerFragmentV1[] {
  return [{
    fragmentId: "NOVEL-V1-1-ROOT",
    sourceSheetRegionId: "NOVEL-V1-1-ROOT",
    polygon: boundary.map((point) => ({ ...point })),
    transformHistory: [],
  }];
}

function foldedFragments(scenario: PfcInnovationScenarioV1): PfcLayerFragmentV1[] {
  let fragments = rootFragments(scenario.boundary);
  for (const fold of scenario.folds) fragments = applyPfcFoldV1(fragments, fold);
  return fragments;
}

function solveAtCut(
  scenario: PfcInnovationScenarioV1,
  cutCenter: SpatialPoint,
): { positions: SpatialPoint[]; fingerprint: string; layers: number } {
  const solution = solvePfcCutsV1(scenario.boundary, scenario.folds, [{
    cutId: `${scenario.candidate.candidateId}-V1-1-CUT`,
    kind: "POINT_HOLE",
    center: cutCenter,
    radius: PUNCH_RADIUS,
  }]);
  const cut = solution.cuts[0];
  return {
    positions: cut.mappedCuts.map((mapped) => ({ x: q(mapped.originalCenter.x), y: q(mapped.originalCenter.y) })),
    fingerprint: solution.unfoldedFingerprint,
    layers: cut.affectedLayerCount,
  };
}

interface SafeCandidate {
  point: SpatialPoint;
  positions: SpatialPoint[];
  fingerprint: string;
  layers: number;
  creaseDistance: number;
  packetClearance: number;
  sourceClearance: number;
}

function safeCutCandidates(scenario: PfcInnovationScenarioV1): SafeCandidate[] {
  const fragments = foldedFragments(scenario);
  const all = fragments.flatMap((fragment) => fragment.polygon);
  const minX = Math.floor(Math.min(...all.map((point) => point.x)));
  const maxX = Math.ceil(Math.max(...all.map((point) => point.x)));
  const minY = Math.floor(Math.min(...all.map((point) => point.y)));
  const maxY = Math.ceil(Math.max(...all.map((point) => point.y)));
  const candidates: SafeCandidate[] = [];

  for (let y = minY + 3; y <= maxY - 3; y += 1) {
    for (let x = minX + 3; x <= maxX - 3; x += 1) {
      const point = { x, y };
      const affected = fragments.filter((fragment) => pointInPolygonInclusiveV1(point, fragment.polygon));
      if (affected.length < 2) continue;

      const packetClearance = Math.min(...affected.map((fragment) => distanceToPolygonBoundary(point, fragment.polygon)));
      if (packetClearance + 1e-9 < MIN_CENTER_BOUNDARY_CLEARANCE) continue;

      const creaseDistance = Math.min(...scenario.folds.map((fold) => Math.abs(signedSideOfLineV1(point, fold.line))));
      if (creaseDistance < 4.5) continue;

      const solved = solveAtCut(scenario, point);
      if (solved.layers !== affected.length || solved.positions.length < 2) continue;
      const sourceClearance = Math.min(...solved.positions.map((mapped) => distanceToPolygonBoundary(mapped, scenario.boundary)));
      if (sourceClearance + 1e-9 < MIN_CENTER_BOUNDARY_CLEARANCE) continue;

      candidates.push({
        point,
        positions: solved.positions,
        fingerprint: solved.fingerprint,
        layers: solved.layers,
        creaseDistance,
        packetClearance,
        sourceClearance,
      });
    }
  }

  return candidates.sort((left, right) =>
    right.layers - left.layers
    || Math.min(right.packetClearance, right.sourceClearance) - Math.min(left.packetClearance, left.sourceClearance)
    || right.sourceClearance - left.sourceClearance
    || right.creaseDistance - left.creaseDistance,
  );
}

function reviewSafeCuts(scenario: PfcInnovationScenarioV1): SafeCandidate[] {
  const candidates = safeCutCandidates(scenario);
  const selected: SafeCandidate[] = [];
  for (const candidate of candidates) {
    if (selected.some((item) => item.fingerprint === candidate.fingerprint)) continue;
    if (selected.some((item) => Math.hypot(item.point.x - candidate.point.x, item.point.y - candidate.point.y) < 9)) continue;
    selected.push(candidate);
    if (selected.length === 2) break;
  }
  if (selected.length !== 2) {
    throw new Error(`${scenario.candidate.candidateId} cannot supply two punches with ${MIN_CENTER_BOUNDARY_CLEARANCE} unit boundary clearance.`);
  }
  return selected;
}

function setNumberAttr(tag: string, name: string, value: number): string {
  const expression = new RegExp(`\\b${name}="[^"]+"`);
  if (!expression.test(tag)) throw new Error(`Missing ${name} on controlled-novel punch tag.`);
  return tag.replace(expression, `${name}="${q(value)}"`);
}

function replaceFinalPunch(markup: string, point: SpatialPoint): string {
  const expression = /<circle\b[^>]*data-cutout="transparent"[^>]*\/>/g;
  const matches = [...markup.matchAll(expression)];
  const target = matches.at(-1);
  if (!target || target.index === undefined) throw new Error("Controlled-novel stimulus has no punch circle to relocate.");
  let tag = target[0];
  tag = setNumberAttr(tag, "cx", point.x);
  tag = setNumberAttr(tag, "cy", point.y);
  return `${markup.slice(0, target.index)}${tag}${markup.slice(target.index + target[0].length)}`;
}

function pts(points: readonly SpatialPoint[]): string {
  return points.map((point) => `${q(point.x)},${q(point.y)}`).join(" ");
}

function fittedViewBox(points: readonly SpatialPoint[]): string {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const span = Math.max(maxX - minX, maxY - minY, 1);
  const side = span * 1.30;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  return `${q(cx - side / 2)} ${q(cy - side / 2)} ${q(side)} ${q(side)}`;
}

function patternSvg(boundary: readonly SpatialPoint[], positions: readonly SpatialPoint[], label: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${fittedViewBox(boundary)}" width="150" height="140" role="img" aria-label="${label}" style="background:#fff;display:block;max-width:100%;height:auto"><polygon points="${pts(boundary)}" fill="white" stroke="#111" stroke-width="1.8" stroke-linejoin="round"/>${positions.map((point) => `<circle cx="${q(point.x)}" cy="${q(point.y)}" r="${PUNCH_RADIUS}" fill="none" data-cutout="transparent" stroke="#111" stroke-width="1.7"/>`).join("")}</svg>`;
}

function centroid(points: readonly SpatialPoint[]): SpatialPoint {
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
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

function scale(point: SpatialPoint, center: SpatialPoint, factor: number): SpatialPoint {
  return { x: q(center.x + (point.x - center.x) * factor), y: q(center.y + (point.y - center.y) * factor) };
}

function key(points: readonly SpatialPoint[]): string {
  return points.map((point) => `${q(point.x)},${q(point.y)}`).sort().join("|");
}

function profileRotation(profile: PfcNovelSubstrateProfileV1): number {
  if (profile === "REGULAR_PENTAGON") return 72;
  if (profile === "REGULAR_OCTAGON") return 45;
  if (profile === "SKEWED_CONVEX_POLYGON") return 180;
  return 90;
}

function wrongAxisPositions(scenario: PfcInnovationScenarioV1, correct: readonly SpatialPoint[]): SpatialPoint[] {
  const center = centroid(scenario.boundary);
  const base = profileRotation(scenario.substrateProfile);
  for (const angle of [base, base * 2, 180]) {
    const transformed = correct.map((point) => rotate(point, center, angle));
    if (key(transformed) !== key(correct) && transformed.every((point) => pointInPolygonInclusiveV1(point, scenario.boundary))) return transformed;
  }
  return correct.map((point) => scale(point, center, 0.72));
}

function positionsForSemantic(
  semantic: OptionSemantic,
  scenario: PfcInnovationScenarioV1,
  correct: readonly SpatialPoint[],
): SpatialPoint[] {
  const center = centroid(scenario.boundary);
  if (semantic === "FORGOT_TO_UNFOLD") return [correct[0]];
  if (semantic === "WRONG_AXIS_MAPPING") return wrongAxisPositions(scenario, correct);
  if (semantic === "WRONG_DEPTH_MAPPING") return correct.map((point) => scale(point, center, 0.55));
  return [...correct];
}

export function generatePfcInnovationLearnerReviewV1_1(): PfcInnovationLearnerQuestionV1_1[] {
  const baseQuestions = generatePfcInnovationLearnerReviewV1();
  const scenarios = pfcInnovationDiscoveryScenariosV1();
  if (baseQuestions.length !== scenarios.length * 2) throw new Error("Controlled-novel V1.1 expects exactly two review questions per discovery scenario.");

  return baseQuestions.map((question, index) => {
    const scenario = scenarios[Math.floor(index / 2)];
    if (question.sourceCandidateId !== scenario.candidate.candidateId) {
      throw new Error(`${question.reviewId} no longer aligns with discovery scenario order.`);
    }
    const safe = reviewSafeCuts(scenario)[index % 2];
    const unfoldedVisibleGap = safe.sourceClearance - PUNCH_RADIUS - PAPER_STROKE_HALF - PUNCH_STROKE_HALF;
    if (unfoldedVisibleGap + 1e-9 < MIN_VISIBLE_GAP) {
      throw new Error(`${question.reviewId} unfolded punch has only ${unfoldedVisibleGap.toFixed(3)} visible units of source-boundary gap.`);
    }

    return {
      ...question,
      stimulusSvg: replaceFinalPunch(question.stimulusSvg, safe.point),
      options: question.options.map((option) => ({
        ...option,
        svg: patternSvg(
          scenario.boundary,
          positionsForSemantic(option.semantic, scenario, safe.positions),
          `Controlled-novel V1.1 unfolded option ${option.optionId}`,
        ),
      })),
      cutCenter: safe.point,
      unfoldedPositions: safe.positions,
      clearanceAudit: {
        foldedPacketCenterClearance: q(safe.packetClearance),
        unfoldedSourceCenterClearance: q(safe.sourceClearance),
        unfoldedVisibleGap: q(unfoldedVisibleGap),
      },
    };
  });
}

export function renderPfcInnovationLearnerReviewHtmlV1_1(
  questions: readonly PfcInnovationLearnerQuestionV1_1[],
): string {
  return renderPfcInnovationLearnerReviewHtmlV1(questions)
    .replaceAll("PFC Controlled-Novel Learner Review V1", "PFC Controlled-Novel Learner Review V1.1")
    .replace(
      "These are deliberately new Examtree practice constructions.",
      "These are deliberately new Examtree practice constructions. V1.1 additionally guarantees that an interior punch remains visibly interior after every unfold.",
    );
}
