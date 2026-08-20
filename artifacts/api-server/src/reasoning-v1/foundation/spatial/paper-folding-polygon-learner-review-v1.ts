import {
  clipPolygonToFoldSideV1,
  type PfcFoldSideV1,
} from "./paper-folding-foundation-v1";
import type { PfcCutGeometryV2 } from "./paper-folding-foundation-v2";
import {
  pfcTriangleDiscoveryScenariosV1,
  solvePfcTriangleScenarioV1,
  type PfcTriangleMappedCutV1,
  type PfcTriangleScenarioV1,
} from "./paper-folding-polygon-discovery-v1";
import type { SpatialPoint } from "./types";

export const PFC_001_POLYGON_LEARNER_REVIEW_AUTHORITY_V1 = Object.freeze({
  authorityId: "PFC-001-POLYGON-TRIANGLE-LEARNER-REVIEW-V1" as const,
  sourceAuthority: "PFC-001-POLYGON-SUBSTRATE-SOURCE-SATURATION-V3" as const,
  foundationAuthority: "PFC-001-FOUNDATION-V3-POLYGON-SUBSTRATE" as const,
  discoveryAuthority: "PFC-001-TRIANGLE-SUBSTRATE-DISCOVERY-V1" as const,
  reviewQuestionCount: 12,
  forwardQuestionCount: 8,
  reverseQuestionCount: 4,
  sourceShape: "TRIANGLE" as const,
  stageSizingAuthority: "PACKET_FITTED_VIEWBOX_WITH_FIXED_STAGE_CARD" as const,
  status: "FOCUSED_POLYGON_GAP_REVIEW_NOT_FROZEN" as const,
  permanentQlAllocationAllowed: false,
  questionStudioAllowed: false,
} as const);

type OptionId = "A" | "B" | "C" | "D";

export interface PfcPolygonReviewOptionV1 {
  optionId: OptionId;
  svg: string;
  semantic: string;
}

export interface PfcPolygonReviewQuestionV1 {
  reviewId: string;
  task: "FORWARD_UNFOLD" | "REVERSE_INFERENCE";
  proposalId: "PFC-PROP-01" | "PFC-PROP-03" | "PFC-PROP-04" | "PFC-PROP-05";
  stem: string;
  stimulusSvg: string;
  options: PfcPolygonReviewOptionV1[];
  correctOptionId: OptionId;
  explanation: string;
  sourceScenarioId: string;
}

const TRIANGLE = [
  { x: 60, y: 98 - 52 * Math.sqrt(3) },
  { x: 112, y: 98 },
  { x: 8, y: 98 },
] as const;
const CENTROID = {
  x: (TRIANGLE[0].x + TRIANGLE[1].x + TRIANGLE[2].x) / 3,
  y: (TRIANGLE[0].y + TRIANGLE[1].y + TRIANGLE[2].y) / 3,
};
const LETTERS: OptionId[] = ["A", "B", "C", "D"];
const q = (value: number) => Math.round(value * 1000) / 1000;

function esc(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function pts(points: readonly SpatialPoint[]): string {
  return points.map((p) => `${q(p.x)},${q(p.y)}`).join(" ");
}

function triangleBoundary(fill = "white"): string {
  return `<polygon points="${pts(TRIANGLE)}" fill="${fill}" stroke="#111" stroke-width="1.8" stroke-linejoin="round"/>`;
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

function paperSvg(
  body: string,
  label: string,
  width = 170,
  height = 150,
  fitPoints?: readonly SpatialPoint[],
): string {
  const viewBox = fitPoints?.length ? fittedViewBox(fitPoints) : "0 0 120 108";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${width}" height="${height}" role="img" aria-label="${esc(label)}" style="background:#fff">${body}</svg>`;
}

function renderCut(cut: PfcCutGeometryV2 | PfcTriangleMappedCutV1): string {
  if (cut.kind === "CIRCLE_HOLE") return `<circle cx="${q(cut.center.x)}" cy="${q(cut.center.y)}" r="${q(cut.radius)}" fill="none" data-cutout="transparent" stroke="#111" stroke-width="1.7"/>`;
  if (cut.kind === "SLIT") return `<line x1="${q(cut.a.x)}" y1="${q(cut.a.y)}" x2="${q(cut.b.x)}" y2="${q(cut.b.y)}" stroke="#111" stroke-width="2" stroke-linecap="round"/>`;
  return `<polygon points="${pts(cut.vertices)}" fill="none" data-cutout="transparent" stroke="#111" stroke-width="1.5" stroke-linejoin="round"/>`;
}

function rotatePoint(point: SpatialPoint, degrees: number): SpatialPoint {
  const radians = degrees * Math.PI / 180;
  const dx = point.x - CENTROID.x;
  const dy = point.y - CENTROID.y;
  return {
    x: q(CENTROID.x + dx * Math.cos(radians) - dy * Math.sin(radians)),
    y: q(CENTROID.y + dx * Math.sin(radians) + dy * Math.cos(radians)),
  };
}

function rotateMark(mark: PfcTriangleMappedCutV1, degrees: number): PfcTriangleMappedCutV1 {
  if (mark.kind === "CIRCLE_HOLE") return { ...mark, center: rotatePoint(mark.center, degrees) };
  if (mark.kind === "SLIT") return { ...mark, a: rotatePoint(mark.a, degrees), b: rotatePoint(mark.b, degrees) };
  return { ...mark, vertices: mark.vertices.map((point) => rotatePoint(point, degrees)) };
}

function patternSvg(marks: readonly PfcTriangleMappedCutV1[], label: string): string {
  return paperSvg(`${triangleBoundary()}${marks.map(renderCut).join("")}`, label, 150, 140);
}

function arrowForFold(scenario: PfcTriangleScenarioV1): string {
  const line = scenario.fold.line;
  const dx = line.b.x - line.a.x;
  const dy = line.b.y - line.a.y;
  const len = Math.hypot(dx, dy);
  const nx = -dy / len;
  const ny = dx / len;
  const projectionT = ((CENTROID.x - line.a.x) * dx + (CENTROID.y - line.a.y) * dy) / (len * len);
  const anchor = { x: line.a.x + projectionT * dx, y: line.a.y + projectionT * dy };
  const sign = scenario.fold.movingSide === "POSITIVE" ? 1 : -1;
  const start = { x: anchor.x + nx * 23 * sign, y: anchor.y + ny * 23 * sign };
  const end = { x: anchor.x - nx * 7 * sign, y: anchor.y - ny * 7 * sign };
  const ux = (end.x - start.x) / Math.hypot(end.x - start.x, end.y - start.y);
  const uy = (end.y - start.y) / Math.hypot(end.x - start.x, end.y - start.y);
  const px = -uy;
  const py = ux;
  const head = [
    end,
    { x: end.x - ux * 6 + px * 3.5, y: end.y - uy * 6 + py * 3.5 },
    { x: end.x - ux * 6 - px * 3.5, y: end.y - uy * 6 - py * 3.5 },
  ];
  return `<line x1="${q(start.x)}" y1="${q(start.y)}" x2="${q(end.x)}" y2="${q(end.y)}" stroke="#111" stroke-width="2.2"/><polygon points="${pts(head)}" fill="#111"/>`;
}

function foldStageSvg(scenario: PfcTriangleScenarioV1): string {
  const line = scenario.fold.line;
  return paperSvg(`${triangleBoundary()}<line x1="${q(line.a.x)}" y1="${q(line.a.y)}" x2="${q(line.b.x)}" y2="${q(line.b.y)}" stroke="#111" stroke-width="1.3" stroke-dasharray="4 3"/>${arrowForFold(scenario)}`, "Triangular paper fold");
}

function cutStageSvg(scenario: PfcTriangleScenarioV1): string {
  const stationary: PfcFoldSideV1 = scenario.fold.movingSide === "POSITIVE" ? "NEGATIVE" : "POSITIVE";
  const packet = clipPolygonToFoldSideV1(TRIANGLE, scenario.fold.line, stationary);
  return paperSvg(
    `<polygon points="${pts(packet)}" fill="white" stroke="#111" stroke-width="1.8" stroke-linejoin="round"/>${renderCut(scenario.cut)}`,
    "Folded triangular packet with cut",
    170,
    150,
    packet,
  );
}

function sequenceSvg(scenario: PfcTriangleScenarioV1): string {
  return `<div class="sequence"><div class="stage"><div class="stage-label">Fold</div>${foldStageSvg(scenario)}</div><div class="stage-arrow">→</div><div class="stage"><div class="stage-label">Cut / Punch</div>${cutStageSvg(scenario)}</div></div>`;
}

function makeForwardOptions(scenario: PfcTriangleScenarioV1, index: number): { options: PfcPolygonReviewOptionV1[]; correct: OptionId } {
  const solution = solvePfcTriangleScenarioV1(scenario);
  const correctMarks = solution.mappedCuts;
  const single = [correctMarks[0]];
  const wrongAxis = correctMarks.map((mark) => rotateMark(mark, 120));
  const falseFour = [...correctMarks, ...wrongAxis];
  const variants = [
    { semantic: "FORGOT_TO_UNFOLD", marks: single },
    { semantic: "CORRECT_TWO_LAYER_REFLECTION", marks: correctMarks },
    { semantic: "WRONG_SYMMETRY_AXIS", marks: wrongAxis },
    { semantic: "FALSE_FOUR_LAYER_PATTERN", marks: falseFour },
  ];
  const correctSlot = [1, 3, 0, 2, 1, 0, 3, 2][index];
  const ordered = Array.from({ length: 4 }, (_, slot) => variants[(slot - correctSlot + 1 + 4) % 4]);
  const correctIndex = ordered.findIndex((variant) => variant.semantic === "CORRECT_TWO_LAYER_REFLECTION");
  return {
    options: ordered.map((variant, optionIndex) => ({
      optionId: LETTERS[optionIndex],
      svg: patternSvg(variant.marks, `Triangular unfolded option ${LETTERS[optionIndex]}`),
      semantic: variant.semantic,
    })),
    correct: LETTERS[correctIndex],
  };
}

function forwardQuestion(scenario: PfcTriangleScenarioV1, index: number): PfcPolygonReviewQuestionV1 {
  const choice = makeForwardOptions(scenario, index);
  const cutLabel = scenario.cut.kind === "CIRCLE_HOLE" ? "punched" : scenario.cut.kind === "SLIT" ? "slit" : "cut";
  return {
    reviewId: `PFC-POLY-REV-${String(index + 1).padStart(2, "0")}`,
    task: "FORWARD_UNFOLD",
    proposalId: scenario.proposalId,
    stem: `A triangular sheet of paper is folded along the shown line and ${cutLabel}. Which option shows the paper after it is completely opened?`,
    stimulusSvg: sequenceSvg(scenario),
    options: choice.options,
    correctOptionId: choice.correct,
    explanation: "The cut lies in the overlap of the folded packet. Open the fold by reflecting the cut through the shown crease. The correct option preserves both the source-paper boundary and the reflected cut positions.",
    sourceScenarioId: scenario.scenarioId,
  };
}

function reverseOptionSvg(scenario: PfcTriangleScenarioV1): string {
  return `<div class="reverse-sequence"><div>${foldStageSvg(scenario)}</div><span>→</span><div>${cutStageSvg(scenario)}</div></div>`;
}

function reverseQuestion(target: PfcTriangleScenarioV1, candidates: readonly PfcTriangleScenarioV1[], index: number): PfcPolygonReviewQuestionV1 {
  const targetSolution = solvePfcTriangleScenarioV1(target);
  const shift = index % 4;
  const ordered = Array.from({ length: 4 }, (_, slot) => candidates[(slot + shift) % 4]);
  const correctIndex = ordered.findIndex((candidate) => candidate.scenarioId === target.scenarioId);
  return {
    reviewId: `PFC-POLY-REV-${String(index + 9).padStart(2, "0")}`,
    task: "REVERSE_INFERENCE",
    proposalId: "PFC-PROP-05",
    stem: "The unfolded triangular paper is shown below. Which folding-and-punching process could have produced this pattern?",
    stimulusSvg: `<div class="target-pattern">${patternSvg(targetSolution.mappedCuts, "Given unfolded triangular paper")}</div>`,
    options: ordered.map((candidate, optionIndex) => ({ optionId: LETTERS[optionIndex], svg: reverseOptionSvg(candidate), semantic: candidate.scenarioId })),
    correctOptionId: LETTERS[correctIndex],
    explanation: "Work backwards from the two holes. Their reflection relation identifies the crease, and the punch must lie inside the overlapping folded layers. Only one process satisfies both conditions.",
    sourceScenarioId: target.scenarioId,
  };
}

export function generatePfcPolygonLearnerReviewV1(): PfcPolygonReviewQuestionV1[] {
  const scenarios = pfcTriangleDiscoveryScenariosV1();
  const forward = scenarios.map(forwardQuestion);
  const holes = scenarios.filter((scenario) => scenario.cut.kind === "CIRCLE_HOLE").slice(0, 4);
  const reverse = holes.map((scenario, index) => reverseQuestion(scenario, holes, index));
  return [...forward, ...reverse];
}

export function renderPfcPolygonLearnerReviewHtmlV1(questions: readonly PfcPolygonReviewQuestionV1[]): string {
  const cards = questions.map((question) => `<article class="question-card">
    <div class="meta">${esc(question.reviewId)} · ${esc(question.proposalId)} · TRIANGLE</div>
    <h2>${question.task === "FORWARD_UNFOLD" ? "Triangular paper — unfold the cut" : "Triangular paper — reverse inference"}</h2>
    <p class="stem"><strong>Question:</strong> ${esc(question.stem)}</p>
    <div class="stimulus">${question.stimulusSvg}</div>
    <div class="options">${question.options.map((option) => `<div class="option"><div class="option-label">${option.optionId}</div><div class="option-art">${option.svg}</div></div>`).join("")}</div>
    <details><summary>Show answer and explanation</summary><p><strong>Answer:</strong> ${question.correctOptionId}</p><p>${esc(question.explanation)}</p></details>
  </article>`).join("\n");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PFC Polygon Gap Review V1</title><style>
  *{box-sizing:border-box} body{margin:0;background:#fff;color:#111;font-family:Arial,sans-serif}.wrap{max-width:1100px;margin:0 auto;padding:24px}.header{border-bottom:2px solid #111;padding-bottom:16px;margin-bottom:10px}.header h1{font-size:26px;margin:0 0 8px}.header p{margin:5px 0;line-height:1.45}.badge{display:inline-block;border:1px solid #111;padding:4px 8px;margin:4px 6px 4px 0;font-size:12px}.question-card{padding:26px 0 32px;border-bottom:1px solid #aaa;break-inside:avoid}.meta{font-size:12px;color:#555}.question-card h2{font-size:19px;margin:5px 0 7px}.stem{font-size:16px;line-height:1.5}.stimulus{overflow-x:auto;background:#fff;padding:8px 0}.sequence{display:flex;align-items:center;gap:14px;min-width:max-content}.stage{width:210px;flex:0 0 210px;text-align:center}.stage-label{font-weight:700;font-size:13px;margin-bottom:4px}.stage svg{width:190px;height:170px}.stage-arrow{font-size:24px}.options{display:grid;grid-template-columns:repeat(4,minmax(170px,1fr));gap:16px;margin-top:18px}.option{text-align:center;border:1px solid #bbb;padding:10px;background:#fff;min-height:190px}.option-label{font-weight:700;margin-bottom:4px}.option-art{overflow-x:auto}.option-art svg{max-width:100%;height:140px}.reverse-sequence{display:flex;align-items:center;gap:4px;min-width:300px}.reverse-sequence svg{width:125px!important;height:112px!important}.target-pattern{text-align:center}details{margin-top:16px;border-top:1px dashed #999;padding-top:10px}summary{cursor:pointer;font-weight:700}@media(max-width:760px){.wrap{padding:14px}.options{grid-template-columns:1fr 1fr}.stage{width:190px;flex-basis:190px}.stage svg{width:170px;height:155px}}@media(max-width:460px){.options{grid-template-columns:1fr}}
  </style></head><body><main class="wrap"><section class="header"><h1>PFC-001 Polygon Substrate Gap Review V1</h1><p>Focused review after source saturation proved that triangular original paper occurs in SSC MTS. This pack tests the polygon substrate itself before it is merged into the main source-saturated review.</p><div><span class="badge">12 questions</span><span class="badge">8 forward</span><span class="badge">4 reverse</span><span class="badge">Triangle source sheet</span><span class="badge">White exam-style surface</span></div><p><strong>Governance:</strong> review only; no permanent QL, localization or Question Studio registration.</p></section>${cards}</main></body></html>`;
}
