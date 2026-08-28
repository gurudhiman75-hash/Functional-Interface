import {
  applyPfcFoldV1,
  pointInPolygonInclusiveV1,
  signedSideOfLineV1,
  solvePfcCutsV1,
  type PfcFoldV1,
  type PfcLayerFragmentV1,
} from "./paper-folding-foundation-v1";
import {
  pfcInnovationDiscoveryScenariosV1,
  type PfcInnovationScenarioV1,
} from "./paper-folding-innovation-discovery-v1";
import type { PfcNovelSubstrateProfileV1 } from "./paper-folding-content-innovation-envelope-v1";
import type { SpatialPoint } from "./types";

export const PFC_001_INNOVATION_LEARNER_REVIEW_AUTHORITY_V1 = Object.freeze({
  authorityId: "PFC-001-CONTROLLED-NOVEL-LEARNER-REVIEW-V1" as const,
  policyAuthority: "PFC-001-CONTENT-INNOVATION-ENVELOPE-V1" as const,
  discoveryAuthority: "PFC-001-CONTROLLED-NOVEL-DISCOVERY-V1" as const,
  provenance: "CONTROLLED_NOVEL" as const,
  reviewQuestionCount: 12,
  questionsPerDiscoveryCandidate: 2,
  substrateProfiles: ["REGULAR_PENTAGON", "REGULAR_OCTAGON", "SKEWED_CONVEX_POLYGON"] as const,
  stageSizingAuthority: "PACKET_FITTED_VIEWBOX_WITH_FIXED_STAGE_CARD" as const,
  distractorAuthority: "COHERENT_WHOLE_PATTERN_REASONING_ERRORS" as const,
  pyqAttributionAllowed: false,
  permanentQlAllocationAllowed: false,
  questionStudioAllowed: false,
  status: "CONTROLLED_NOVEL_FAMILY_HUMAN_REVIEW_REQUIRED" as const,
} as const);

type OptionId = "A" | "B" | "C" | "D";
const OPTION_IDS: OptionId[] = ["A", "B", "C", "D"];
const q = (value: number) => Math.round(value * 1000) / 1000;

export interface PfcInnovationLearnerOptionV1 {
  optionId: OptionId;
  svg: string;
  semantic: "FORGOT_TO_UNFOLD" | "WRONG_AXIS_MAPPING" | "WRONG_DEPTH_MAPPING" | "CORRECT_PATTERN";
}

export interface PfcInnovationLearnerQuestionV1 {
  reviewId: string;
  sourceCandidateId: string;
  provenance: "CONTROLLED_NOVEL";
  substrateProfile: PfcNovelSubstrateProfileV1;
  proposalId: PfcInnovationScenarioV1["candidate"]["proposalId"];
  foldCount: number;
  novelAxes: readonly string[];
  stem: string;
  stimulusSvg: string;
  options: PfcInnovationLearnerOptionV1[];
  correctOptionId: OptionId;
  explanation: string;
  cutCenter: SpatialPoint;
  unfoldedPositions: SpatialPoint[];
}

function esc(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function pts(points: readonly SpatialPoint[]): string {
  return points.map((point) => `${q(point.x)},${q(point.y)}`).join(" ");
}

function centroid(points: readonly SpatialPoint[]): SpatialPoint {
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
}

function fittedViewBox(points: readonly SpatialPoint[]): { viewBox: string; fillRatio: number } {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const span = Math.max(maxX - minX, maxY - minY, 1);
  const side = span * 1.30;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  return {
    viewBox: `${q(cx - side / 2)} ${q(cy - side / 2)} ${q(side)} ${q(side)}`,
    fillRatio: span / side,
  };
}

function paperSvg(body: string, label: string, fitPoints: readonly SpatialPoint[], width = 170, height = 150): string {
  const fitted = fittedViewBox(fitPoints);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${fitted.viewBox}" width="${width}" height="${height}" data-paper-fill="${fitted.fillRatio}" role="img" aria-label="${esc(label)}" style="background:#fff;display:block;max-width:100%;height:auto">${body}</svg>`;
}

function renderFragments(fragments: readonly PfcLayerFragmentV1[]): string {
  const stroke = fragments.length === 1 ? "#111" : "#777";
  return fragments.map((fragment) => `<polygon points="${pts(fragment.polygon)}" fill="white" stroke="${stroke}" stroke-width="1.55" stroke-linejoin="round"/>`).join("");
}

function renderSourceBoundary(boundary: readonly SpatialPoint[]): string {
  return `<polygon points="${pts(boundary)}" fill="white" stroke="#111" stroke-width="1.8" stroke-linejoin="round"/>`;
}

function renderHole(point: SpatialPoint, radius = 2.2): string {
  return `<circle cx="${q(point.x)}" cy="${q(point.y)}" r="${radius}" fill="none" data-cutout="transparent" stroke="#111" stroke-width="1.7"/>`;
}

function cross(ax: number, ay: number, bx: number, by: number): number {
  return ax * by - ay * bx;
}

function clippedCrease(line: PfcFoldV1["line"], fragments: readonly PfcLayerFragmentV1[]): [SpatialPoint, SpatialPoint] {
  const dx = line.b.x - line.a.x;
  const dy = line.b.y - line.a.y;
  const hits: SpatialPoint[] = [];
  for (const fragment of fragments) {
    const polygon = fragment.polygon;
    for (let index = 0; index < polygon.length; index += 1) {
      const a = polygon[index];
      const b = polygon[(index + 1) % polygon.length];
      const ex = b.x - a.x;
      const ey = b.y - a.y;
      const denominator = cross(dx, dy, ex, ey);
      if (Math.abs(denominator) < 1e-8) continue;
      const rx = a.x - line.a.x;
      const ry = a.y - line.a.y;
      const u = cross(rx, ry, dx, dy) / denominator;
      if (u < -1e-7 || u > 1 + 1e-7) continue;
      const t = cross(rx, ry, ex, ey) / denominator;
      const point = { x: line.a.x + t * dx, y: line.a.y + t * dy };
      if (!hits.some((hit) => Math.hypot(hit.x - point.x, hit.y - point.y) < 1e-5)) hits.push(point);
    }
  }
  if (hits.length < 2) throw new Error("Controlled-novel fold crease does not cross the visible packet twice.");
  const denominator = dx * dx + dy * dy;
  hits.sort((left, right) => (((left.x - line.a.x) * dx + (left.y - line.a.y) * dy) - ((right.x - line.a.x) * dx + (right.y - line.a.y) * dy)) / denominator);
  return [hits[0], hits[hits.length - 1]];
}

function foldArrow(crease: readonly [SpatialPoint, SpatialPoint], movingSide: "POSITIVE" | "NEGATIVE"): string {
  const [a, b] = crease;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy);
  const nx = -dy / length;
  const ny = dx / length;
  const sign = movingSide === "POSITIVE" ? 1 : -1;
  const midpoint = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const start = { x: midpoint.x + nx * 21 * sign, y: midpoint.y + ny * 21 * sign };
  const end = { x: midpoint.x - nx * 6.5 * sign, y: midpoint.y - ny * 6.5 * sign };
  const ux = (end.x - start.x) / Math.hypot(end.x - start.x, end.y - start.y);
  const uy = (end.y - start.y) / Math.hypot(end.x - start.x, end.y - start.y);
  const px = -uy, py = ux;
  const head = [
    end,
    { x: end.x - ux * 5.8 + px * 3.3, y: end.y - uy * 5.8 + py * 3.3 },
    { x: end.x - ux * 5.8 - px * 3.3, y: end.y - uy * 5.8 - py * 3.3 },
  ];
  return `<line x1="${q(start.x)}" y1="${q(start.y)}" x2="${q(end.x)}" y2="${q(end.y)}" stroke="#111" stroke-width="2.0"/><polygon points="${pts(head)}" fill="#111"/>`;
}

function rootFragments(boundary: readonly SpatialPoint[]): PfcLayerFragmentV1[] {
  return [{ fragmentId: "NOVEL-ROOT", sourceSheetRegionId: "NOVEL-ROOT", polygon: boundary.map((point) => ({ ...point })), transformHistory: [] }];
}

function allFragmentPoints(fragments: readonly PfcLayerFragmentV1[]): SpatialPoint[] {
  return fragments.flatMap((fragment) => fragment.polygon);
}

function stimulusForScenario(scenario: PfcInnovationScenarioV1, cutCenter: SpatialPoint): string {
  let fragments = rootFragments(scenario.boundary);
  const stages: string[] = [];
  for (let index = 0; index < scenario.folds.length; index += 1) {
    const fold = scenario.folds[index];
    const crease = clippedCrease(fold.line, fragments);
    const material = allFragmentPoints(fragments);
    const panel = paperSvg(
      `${renderFragments(fragments)}<line x1="${q(crease[0].x)}" y1="${q(crease[0].y)}" x2="${q(crease[1].x)}" y2="${q(crease[1].y)}" data-crease-clipped="true" stroke="#555" stroke-width="1.3" stroke-dasharray="4 3"/>${foldArrow(crease, fold.movingSide)}`,
      `Controlled-novel fold ${index + 1}`,
      material,
    );
    stages.push(`<div class="stage"><div class="stage-label">Fold ${index + 1}</div>${panel}</div>`);
    fragments = applyPfcFoldV1(fragments, fold);
  }
  const finalMaterial = allFragmentPoints(fragments);
  const cutPanel = paperSvg(
    `${renderFragments(fragments)}${renderHole(cutCenter)}`,
    "Folded packet with punch",
    finalMaterial,
  );
  stages.push(`<div class="stage"><div class="stage-label">Cut / Punch</div>${cutPanel}</div>`);
  return `<div class="sequence">${stages.map((stage, index) => `${index > 0 ? '<div class="stage-arrow">→</div>' : ""}${stage}`).join("")}</div>`;
}

function foldedFragments(scenario: PfcInnovationScenarioV1): PfcLayerFragmentV1[] {
  let fragments = rootFragments(scenario.boundary);
  for (const fold of scenario.folds) fragments = applyPfcFoldV1(fragments, fold);
  return fragments;
}

function stableCutCandidates(scenario: PfcInnovationScenarioV1): Array<{ point: SpatialPoint; layers: number; creaseDistance: number }> {
  const fragments = foldedFragments(scenario);
  const all = allFragmentPoints(fragments);
  const minX = Math.floor(Math.min(...all.map((point) => point.x)));
  const maxX = Math.ceil(Math.max(...all.map((point) => point.x)));
  const minY = Math.floor(Math.min(...all.map((point) => point.y)));
  const maxY = Math.ceil(Math.max(...all.map((point) => point.y)));
  const probes = [
    { x: 0, y: 0 }, { x: 2.6, y: 0 }, { x: -2.6, y: 0 }, { x: 0, y: 2.6 }, { x: 0, y: -2.6 },
    { x: 1.8, y: 1.8 }, { x: 1.8, y: -1.8 }, { x: -1.8, y: 1.8 }, { x: -1.8, y: -1.8 },
  ];
  const candidates: Array<{ point: SpatialPoint; layers: number; creaseDistance: number }> = [];
  for (let y = minY + 3; y <= maxY - 3; y += 2) {
    for (let x = minX + 3; x <= maxX - 3; x += 2) {
      const point = { x, y };
      const layers = fragments.filter((fragment) => pointInPolygonInclusiveV1(point, fragment.polygon)).length;
      if (layers < 2) continue;
      const stable = probes.every((probe) => fragments.filter((fragment) => pointInPolygonInclusiveV1({ x: x + probe.x, y: y + probe.y }, fragment.polygon)).length >= layers);
      if (!stable) continue;
      const creaseDistance = Math.min(...scenario.folds.map((fold) => Math.abs(signedSideOfLineV1(point, fold.line))));
      if (creaseDistance < 4.5) continue;
      candidates.push({ point, layers, creaseDistance });
    }
  }
  return candidates.sort((left, right) => right.layers - left.layers || right.creaseDistance - left.creaseDistance);
}

function solveAtCut(scenario: PfcInnovationScenarioV1, cutCenter: SpatialPoint): { positions: SpatialPoint[]; fingerprint: string; layers: number } {
  const solution = solvePfcCutsV1(scenario.boundary, scenario.folds, [{
    cutId: `${scenario.candidate.candidateId}-REVIEW-CUT`,
    kind: "POINT_HOLE",
    center: cutCenter,
    radius: 2.2,
  }]);
  const cut = solution.cuts[0];
  return {
    positions: cut.mappedCuts.map((mapped) => ({ x: q(mapped.originalCenter.x), y: q(mapped.originalCenter.y) })),
    fingerprint: solution.unfoldedFingerprint,
    layers: cut.affectedLayerCount,
  };
}

function reviewCuts(scenario: PfcInnovationScenarioV1): Array<{ cutCenter: SpatialPoint; positions: SpatialPoint[] }> {
  const candidates = stableCutCandidates(scenario);
  if (candidates.length < 2) throw new Error(`${scenario.candidate.candidateId} has fewer than two review-safe cut regions.`);
  const selected: Array<{ cutCenter: SpatialPoint; positions: SpatialPoint[]; fingerprint: string }> = [];
  for (const candidate of candidates) {
    const solved = solveAtCut(scenario, candidate.point);
    if (solved.layers < 2 || solved.positions.length < 2) continue;
    if (selected.some((item) => item.fingerprint === solved.fingerprint)) continue;
    if (selected.some((item) => Math.hypot(item.cutCenter.x - candidate.point.x, item.cutCenter.y - candidate.point.y) < 9)) continue;
    selected.push({ cutCenter: candidate.point, positions: solved.positions, fingerprint: solved.fingerprint });
    if (selected.length === 2) break;
  }
  if (selected.length !== 2) throw new Error(`${scenario.candidate.candidateId} could not provide two distinct learner-review punches.`);
  return selected.map(({ cutCenter, positions }) => ({ cutCenter, positions }));
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

function key(pointsValue: readonly SpatialPoint[]): string {
  return pointsValue.map((point) => `${q(point.x)},${q(point.y)}`).sort().join("|");
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
  const fallback = correct.map((point) => scale(point, center, 0.72));
  if (key(fallback) === key(correct)) throw new Error(`${scenario.candidate.candidateId} cannot build a distinct wrong-axis option.`);
  return fallback;
}

function patternSvg(boundary: readonly SpatialPoint[], positions: readonly SpatialPoint[], label: string): string {
  return paperSvg(`${renderSourceBoundary(boundary)}${positions.map((point) => renderHole(point)).join("")}`, label, boundary, 150, 140);
}

function profileLabel(profile: PfcNovelSubstrateProfileV1): string {
  if (profile === "REGULAR_PENTAGON") return "regular pentagonal";
  if (profile === "REGULAR_OCTAGON") return "regular octagonal";
  if (profile === "SKEWED_CONVEX_POLYGON") return "skewed convex";
  return "convex polygonal";
}

function optionSet(scenario: PfcInnovationScenarioV1, positions: readonly SpatialPoint[], questionIndex: number): { options: PfcInnovationLearnerOptionV1[]; correct: OptionId } {
  const center = centroid(scenario.boundary);
  const variants: Array<{ semantic: PfcInnovationLearnerOptionV1["semantic"]; positions: SpatialPoint[] }> = [
    { semantic: "FORGOT_TO_UNFOLD", positions: [positions[0]] },
    { semantic: "WRONG_AXIS_MAPPING", positions: wrongAxisPositions(scenario, positions) },
    { semantic: "WRONG_DEPTH_MAPPING", positions: positions.map((point) => scale(point, center, 0.55)) },
    { semantic: "CORRECT_PATTERN", positions: [...positions] },
  ];
  const correctSlot = [1, 3, 0, 2, 2, 0, 3, 1, 1, 2, 0, 3][questionIndex];
  const correctVariant = variants.findIndex((variant) => variant.semantic === "CORRECT_PATTERN");
  const ordered = Array.from({ length: 4 }, (_, slot) => variants[(slot - correctSlot + correctVariant + 4) % 4]);
  const correctIndex = ordered.findIndex((variant) => variant.semantic === "CORRECT_PATTERN");
  return {
    options: ordered.map((variant, index) => ({
      optionId: OPTION_IDS[index],
      semantic: variant.semantic,
      svg: patternSvg(scenario.boundary, variant.positions, `Controlled-novel unfolded option ${OPTION_IDS[index]}`),
    })),
    correct: OPTION_IDS[correctIndex],
  };
}

function buildQuestion(scenario: PfcInnovationScenarioV1, cut: { cutCenter: SpatialPoint; positions: SpatialPoint[] }, questionIndex: number, variantIndex: number): PfcInnovationLearnerQuestionV1 {
  const choices = optionSet(scenario, cut.positions, questionIndex);
  const foldText = scenario.folds.length === 1 ? "along the shown line" : "in the two shown steps";
  return {
    reviewId: `PFC-INNOV-REV-${String(questionIndex + 1).padStart(2, "0")}`,
    sourceCandidateId: scenario.candidate.candidateId,
    provenance: "CONTROLLED_NOVEL",
    substrateProfile: scenario.substrateProfile,
    proposalId: scenario.candidate.proposalId,
    foldCount: scenario.folds.length,
    novelAxes: scenario.candidate.novelAxes,
    stem: `A ${profileLabel(scenario.substrateProfile)} sheet of paper is folded ${foldText} and punched as shown. Which option shows the paper after it is completely opened?`,
    stimulusSvg: stimulusForScenario(scenario, cut.cutCenter),
    options: choices.options,
    correctOptionId: choices.correct,
    explanation: `This is an original controlled-novel construction. Track the punched point through ${scenario.folds.length === 1 ? "the fold" : "both folds"}; each overlapping physical layer maps back to one position on the opened paper. The correct option is the complete solver-derived pattern, not a copied past-paper answer.`,
    cutCenter: cut.cutCenter,
    unfoldedPositions: cut.positions,
  };
}

export function generatePfcInnovationLearnerReviewV1(): PfcInnovationLearnerQuestionV1[] {
  const questions: PfcInnovationLearnerQuestionV1[] = [];
  let questionIndex = 0;
  for (const scenario of pfcInnovationDiscoveryScenariosV1()) {
    const cuts = reviewCuts(scenario);
    for (let variantIndex = 0; variantIndex < cuts.length; variantIndex += 1) {
      questions.push(buildQuestion(scenario, cuts[variantIndex], questionIndex, variantIndex));
      questionIndex += 1;
    }
  }
  return questions;
}

export function renderPfcInnovationLearnerReviewHtmlV1(questions: readonly PfcInnovationLearnerQuestionV1[]): string {
  const cards = questions.map((question) => `<article class="question-card" data-provenance="CONTROLLED_NOVEL">
    <div class="meta">${esc(question.reviewId)} · ${esc(question.sourceCandidateId)} · ${esc(question.substrateProfile)} · CONTROLLED NOVEL</div>
    <h2>${esc(profileLabel(question.substrateProfile))} paper · ${question.foldCount}-fold construction</h2>
    <p class="stem"><strong>Question:</strong> ${esc(question.stem)}</p>
    <div class="stimulus">${question.stimulusSvg}</div>
    <div class="options">${question.options.map((option) => `<div class="option"><div class="option-label">${option.optionId}</div><div class="option-art">${option.svg}</div></div>`).join("")}</div>
    <details><summary>Show answer and explanation</summary><p><strong>Answer:</strong> ${question.correctOptionId}</p><p>${esc(question.explanation)}</p></details>
  </article>`).join("\n");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PFC Controlled-Novel Learner Review V1</title><style>
    *{box-sizing:border-box}body{margin:0;background:#fff;color:#111;font-family:Arial,Helvetica,sans-serif;line-height:1.45}.wrap{max-width:1180px;margin:0 auto;padding:22px}.intro{border:1px solid #d8d8d8;border-radius:12px;padding:18px;margin-bottom:18px;background:#fff}.intro h1{margin:0 0 8px;font-size:26px}.intro p{margin:6px 0}.question-card{border:1px solid #d7d7d7;border-radius:12px;padding:18px;margin:0 0 20px;background:#fff;break-inside:avoid}.meta{font-size:12px;color:#555;letter-spacing:.02em}.question-card h2{font-size:19px;margin:6px 0 8px;text-transform:none}.stem{font-size:16px}.stimulus{overflow-x:auto;padding:8px 0}.sequence{display:flex;align-items:center;gap:10px;min-width:max-content}.stage{width:190px;flex:0 0 190px;text-align:center}.stage-label{font-size:12px;font-weight:700;margin-bottom:5px}.stage-arrow{font-size:25px;line-height:1}.options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:14px}.option{border:1px solid #cfcfcf;border-radius:9px;padding:8px;min-height:180px;background:#fff}.option-label{font-weight:700;margin-bottom:4px}.option-art{display:flex;justify-content:center;align-items:center;min-height:145px}details{margin-top:12px;border-top:1px solid #e5e5e5;padding-top:10px}summary{cursor:pointer;font-weight:700}@media(max-width:760px){.wrap{padding:12px}.options{grid-template-columns:repeat(2,minmax(0,1fr))}.question-card{padding:13px}}@media(max-width:430px){.options{grid-template-columns:1fr}}
  </style></head><body><main class="wrap"><section class="intro"><h1>PFC Controlled-Novel Learner Review V1</h1><p><strong>12 original solver-generated practice questions.</strong> Two questions are generated from each validated innovation candidate.</p><p>Coverage: regular pentagon, regular octagon, skewed convex paper, off-centre folds, oblique non-symmetry folds, and a two-fold pentagon construction.</p><p>These are deliberately new Examtree practice constructions. They are not presented as past-paper questions. The underlying learner skills remain within the existing PFC skill boundaries.</p></section>${cards}</main></body></html>`;
}
