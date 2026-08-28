import {
  clipPolygonToFoldSideV1,
  type PfcFoldSideV1,
} from "./paper-folding-foundation-v1";
import {
  pfcHexagonDiscoveryScenariosV1,
  solvePfcHexagonScenarioV1,
  type PfcHexMappedCutV1,
  type PfcHexagonScenarioV1,
} from "./paper-folding-hexagon-discovery-v1";
import type { SpatialPoint } from "./types";

export const PFC_001_HEXAGON_LEARNER_REVIEW_AUTHORITY_V1 = Object.freeze({
  authorityId: "PFC-001-HEXAGON-LEARNER-REVIEW-V1" as const,
  sourceAuthority: "PFC-001-POLYGON-SUBSTRATE-SOURCE-SATURATION-V4" as const,
  foundationAuthority: "PFC-001-FOUNDATION-V4-HEXAGON-ACTIVATED" as const,
  discoveryAuthority: "PFC-001-HEXAGON-SUBSTRATE-DISCOVERY-V1" as const,
  sourceShape: "REGULAR_HEXAGON" as const,
  reviewQuestionCount: 12,
  forwardQuestionCount: 8,
  reverseQuestionCount: 4,
  stageSizingAuthority: "PACKET_FITTED_VIEWBOX_WITH_FIXED_STAGE_CARD" as const,
  optionAuthority: "CONCEPTUAL_DISTRACTORS_NO_COORDINATE_NUDGES" as const,
  status: "FOCUSED_HEXAGON_REVIEW_NOT_FROZEN" as const,
  permanentQlAllocationAllowed: false,
  questionStudioAllowed: false,
} as const);

type OptionId = "A" | "B" | "C" | "D";
const OPTION_IDS: OptionId[] = ["A", "B", "C", "D"];
const CENTER: SpatialPoint = { x: 60, y: 60 };
const RADIUS = 48;
const q = (value: number) => Math.round(value * 1000) / 1000;

const HEXAGON: SpatialPoint[] = Array.from({ length: 6 }, (_, index) => {
  const angle = -Math.PI / 2 + index * Math.PI / 3;
  return { x: CENTER.x + RADIUS * Math.cos(angle), y: CENTER.y + RADIUS * Math.sin(angle) };
});

export interface PfcHexagonReviewOptionV1 {
  optionId: OptionId;
  svg: string;
  semantic: string;
}

export interface PfcHexagonReviewQuestionV1 {
  reviewId: string;
  task: "FORWARD_UNFOLD" | "REVERSE_INFERENCE";
  family: "HEXAGON_SINGLE_AXIS" | "HEXAGON_SIX_SECTOR_RADIAL" | "MIXED_REVERSE";
  proposalId: "PFC-PROP-01" | "PFC-PROP-02" | "PFC-PROP-03" | "PFC-PROP-04" | "PFC-PROP-05";
  stem: string;
  stimulusSvg: string;
  options: PfcHexagonReviewOptionV1[];
  correctOptionId: OptionId;
  explanation: string;
  sourceScenarioId: string;
}

function esc(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function points(pointsValue: readonly SpatialPoint[]): string {
  return pointsValue.map((point) => `${q(point.x)},${q(point.y)}`).join(" ");
}

function fittedViewBox(fitPoints: readonly SpatialPoint[]): { viewBox: string; fillRatio: number } {
  const xs = fitPoints.map((point) => point.x);
  const ys = fitPoints.map((point) => point.y);
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
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${fitted.viewBox}" width="${width}" height="${height}" data-paper-fill="${fitted.fillRatio}" role="img" aria-label="${esc(label)}" style="background:#fff">${body}</svg>`;
}

function hexBoundary(fill = "white"): string {
  return `<polygon points="${points(HEXAGON)}" fill="${fill}" stroke="#111" stroke-width="1.8" stroke-linejoin="round"/>`;
}

function renderCut(cut: PfcHexMappedCutV1 | PfcHexagonScenarioV1["cut"]): string {
  if (cut.kind === "CIRCLE_HOLE") {
    return `<circle cx="${q(cut.center.x)}" cy="${q(cut.center.y)}" r="${q(cut.radius)}" fill="none" data-cutout="transparent" stroke="#111" stroke-width="1.7"/>`;
  }
  if (cut.kind === "SLIT") {
    return `<line x1="${q(cut.a.x)}" y1="${q(cut.a.y)}" x2="${q(cut.b.x)}" y2="${q(cut.b.y)}" stroke="#111" stroke-width="2" stroke-linecap="round"/>`;
  }
  if (cut.kind === "POLYGON_CUT") {
    return `<polygon points="${points(cut.vertices)}" fill="none" data-cutout="transparent" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/>`;
  }
  throw new Error(`Hexagon review does not render cut kind ${cut.kind}.`);
}

function rotatePoint(point: SpatialPoint, degrees: number): SpatialPoint {
  const radians = degrees * Math.PI / 180;
  const dx = point.x - CENTER.x;
  const dy = point.y - CENTER.y;
  return {
    x: q(CENTER.x + dx * Math.cos(radians) - dy * Math.sin(radians)),
    y: q(CENTER.y + dx * Math.sin(radians) + dy * Math.cos(radians)),
  };
}

function scalePoint(point: SpatialPoint, factor: number): SpatialPoint {
  return {
    x: q(CENTER.x + (point.x - CENTER.x) * factor),
    y: q(CENTER.y + (point.y - CENTER.y) * factor),
  };
}

function transformMark(mark: PfcHexMappedCutV1, fn: (point: SpatialPoint) => SpatialPoint): PfcHexMappedCutV1 {
  if (mark.kind === "CIRCLE_HOLE") return { ...mark, center: fn(mark.center) };
  if (mark.kind === "SLIT") return { ...mark, a: fn(mark.a), b: fn(mark.b) };
  return { ...mark, vertices: mark.vertices.map(fn) };
}

function patternSvg(marks: readonly PfcHexMappedCutV1[], label: string): string {
  return paperSvg(`${hexBoundary()}${marks.map(renderCut).join("")}`, label, HEXAGON, 150, 140);
}

function foldArrow(scenario: PfcHexagonScenarioV1): string {
  const fold = scenario.fold!;
  const dx = fold.line.b.x - fold.line.a.x;
  const dy = fold.line.b.y - fold.line.a.y;
  const length = Math.hypot(dx, dy);
  const nx = -dy / length;
  const ny = dx / length;
  const sign = fold.movingSide === "POSITIVE" ? 1 : -1;
  const start = { x: CENTER.x + nx * 27 * sign, y: CENTER.y + ny * 27 * sign };
  const end = { x: CENTER.x - nx * 8 * sign, y: CENTER.y - ny * 8 * sign };
  const ux = (end.x - start.x) / Math.hypot(end.x - start.x, end.y - start.y);
  const uy = (end.y - start.y) / Math.hypot(end.x - start.x, end.y - start.y);
  const px = -uy, py = ux;
  const head = [
    end,
    { x: end.x - ux * 6 + px * 3.4, y: end.y - uy * 6 + py * 3.4 },
    { x: end.x - ux * 6 - px * 3.4, y: end.y - uy * 6 - py * 3.4 },
  ];
  return `<line x1="${q(start.x)}" y1="${q(start.y)}" x2="${q(end.x)}" y2="${q(end.y)}" stroke="#111" stroke-width="2.1"/><polygon points="${points(head)}" fill="#111"/>`;
}

function singleAxisStimulus(scenario: PfcHexagonScenarioV1): string {
  if (!scenario.fold) throw new Error(`${scenario.scenarioId} lacks a fold.`);
  const fold = scenario.fold;
  const foldPanel = paperSvg(
    `${hexBoundary()}<line x1="${q(fold.line.a.x)}" y1="${q(fold.line.a.y)}" x2="${q(fold.line.b.x)}" y2="${q(fold.line.b.y)}" stroke="#555" stroke-width="1.3" stroke-dasharray="4 3"/>${foldArrow(scenario)}`,
    "Hexagonal paper fold",
    HEXAGON,
  );
  const stationary: PfcFoldSideV1 = fold.movingSide === "POSITIVE" ? "NEGATIVE" : "POSITIVE";
  const packet = clipPolygonToFoldSideV1(HEXAGON, fold.line, stationary);
  const cutPanel = paperSvg(
    `<polygon points="${points(packet)}" fill="white" stroke="#111" stroke-width="1.8" stroke-linejoin="round"/>${renderCut(scenario.cut)}`,
    "Folded hexagonal packet with cut",
    packet,
  );
  return `<div class="sequence"><div class="stage"><div class="stage-label">Fold</div>${foldPanel}</div><div class="stage-arrow">→</div><div class="stage"><div class="stage-label">Cut / Punch</div>${cutPanel}</div></div>`;
}

function rightSector(): SpatialPoint[] {
  return [CENTER, HEXAGON[1], HEXAGON[2]];
}

function sixSectorStimulus(scenario: PfcHexagonScenarioV1): string {
  const creases = HEXAGON.map((vertex) => `<line x1="${CENTER.x}" y1="${CENTER.y}" x2="${q(vertex.x)}" y2="${q(vertex.y)}" stroke="#666" stroke-width="1.05" stroke-dasharray="4 3"/>`).join("");
  const sourcePanel = paperSvg(`${hexBoundary()}${creases}`, "Hexagonal paper divided into six equal fold sectors", HEXAGON);
  const sector = rightSector();
  const packetPanel = paperSvg(
    `<polygon points="${points(sector)}" fill="white" stroke="#111" stroke-width="1.8" stroke-linejoin="round"/>${renderCut(scenario.cut)}`,
    "Six overlapping sectors with cut",
    sector,
  );
  return `<div class="sequence"><div class="stage"><div class="stage-label">Fold the 6 equal sectors together</div>${sourcePanel}</div><div class="stage-arrow">→</div><div class="stage"><div class="stage-label">Cut / Punch</div>${packetPanel}</div></div>`;
}

function processSvg(scenario: PfcHexagonScenarioV1): string {
  return scenario.family === "HEXAGON_SINGLE_AXIS" ? singleAxisStimulus(scenario) : sixSectorStimulus(scenario);
}

function forwardOptions(scenario: PfcHexagonScenarioV1, index: number): { options: PfcHexagonReviewOptionV1[]; correct: OptionId } {
  const correctMarks = solvePfcHexagonScenarioV1(scenario).mappedCuts;
  const variants = scenario.family === "HEXAGON_SINGLE_AXIS"
    ? [
        { semantic: "FORGOT_TO_UNFOLD", marks: [correctMarks[0]] },
        { semantic: "CORRECT_PATTERN", marks: correctMarks },
        { semantic: "WRONG_SYMMETRY_AXIS", marks: correctMarks.map((mark) => transformMark(mark, (point) => rotatePoint(point, 60))) },
        { semantic: "FALSE_SIX_SECTOR_PATTERN", marks: Array.from({ length: 6 }, (_, turn) => transformMark(correctMarks[0], (point) => rotatePoint(point, turn * 60))) },
      ]
    : [
        { semantic: "FORGOT_TO_UNFOLD", marks: [correctMarks[0]] },
        { semantic: "HALF_UNFOLDED_THREE_SECTORS", marks: [correctMarks[0], correctMarks[2], correctMarks[4]] },
        { semantic: "CORRECT_PATTERN", marks: correctMarks },
        { semantic: "WRONG_RADIUS_SIX_SECTOR_PATTERN", marks: correctMarks.map((mark) => transformMark(mark, (point) => scalePoint(point, 0.55))) },
      ];
  const correctSlot = [1, 3, 0, 2, 2, 0, 3, 1][index];
  const correctVariantIndex = variants.findIndex((variant) => variant.semantic === "CORRECT_PATTERN");
  const ordered = Array.from({ length: 4 }, (_, slot) => variants[(slot - correctSlot + correctVariantIndex + 4) % 4]);
  const correctIndex = ordered.findIndex((variant) => variant.semantic === "CORRECT_PATTERN");
  return {
    options: ordered.map((variant, optionIndex) => ({
      optionId: OPTION_IDS[optionIndex],
      svg: patternSvg(variant.marks, `Hexagonal unfolded option ${OPTION_IDS[optionIndex]}`),
      semantic: variant.semantic,
    })),
    correct: OPTION_IDS[correctIndex],
  };
}

function forwardQuestion(scenario: PfcHexagonScenarioV1, index: number): PfcHexagonReviewQuestionV1 {
  const choice = forwardOptions(scenario, index);
  const sixSector = scenario.family === "HEXAGON_SIX_SECTOR_RADIAL";
  return {
    reviewId: `PFC-HEX-REV-${String(index + 1).padStart(2, "0")}`,
    task: "FORWARD_UNFOLD",
    family: scenario.family,
    proposalId: scenario.proposalId,
    stem: sixSector
      ? "A regular hexagonal paper is folded so that its six equal sectors overlap, and a cut or punch is made as shown. Which option shows the paper after it is completely opened?"
      : "A regular hexagonal paper is folded along the shown line and cut or punched. Which option shows the paper after it is completely opened?",
    stimulusSvg: processSvg(scenario),
    options: choice.options,
    correctOptionId: choice.correct,
    explanation: sixSector
      ? "All six equal sectors overlap before the cut. Opening the paper carries the cut to the corresponding position in each 60° sector."
      : "Open the fold by reflecting the cut through the shown crease. Only the two overlapping layers receive the cut.",
    sourceScenarioId: scenario.scenarioId,
  };
}

function reverseQuestion(target: PfcHexagonScenarioV1, candidates: readonly PfcHexagonScenarioV1[], index: number): PfcHexagonReviewQuestionV1 {
  const targetSolution = solvePfcHexagonScenarioV1(target);
  const shift = index % 4;
  const ordered = Array.from({ length: 4 }, (_, slot) => candidates[(slot + shift) % 4]);
  const correctIndex = ordered.findIndex((candidate) => candidate.scenarioId === target.scenarioId);
  return {
    reviewId: `PFC-HEX-REV-${String(index + 9).padStart(2, "0")}`,
    task: "REVERSE_INFERENCE",
    family: "MIXED_REVERSE",
    proposalId: "PFC-PROP-05",
    stem: "The opened hexagonal paper is shown below. Which folding-and-punching process could have produced this pattern?",
    stimulusSvg: `<div class="target-pattern">${patternSvg(targetSolution.mappedCuts, "Given opened hexagonal paper")}</div>`,
    options: ordered.map((candidate, optionIndex) => ({
      optionId: OPTION_IDS[optionIndex],
      svg: processSvg(candidate),
      semantic: candidate.scenarioId,
    })),
    correctOptionId: OPTION_IDS[correctIndex],
    explanation: "Compare the symmetry and number of repeated marks in the opened paper. The crease or six-sector process must reproduce that exact pattern and no other option does.",
    sourceScenarioId: target.scenarioId,
  };
}

export function generatePfcHexagonLearnerReviewV1(): PfcHexagonReviewQuestionV1[] {
  const scenarios = pfcHexagonDiscoveryScenariosV1();
  const forward = scenarios.map(forwardQuestion);
  const reverseCandidates = [scenarios[0], scenarios[1], scenarios[4], scenarios[5]];
  const reverse = reverseCandidates.map((scenario, index) => reverseQuestion(scenario, reverseCandidates, index));
  return [...forward, ...reverse];
}

export function renderPfcHexagonLearnerReviewHtmlV1(questions: readonly PfcHexagonReviewQuestionV1[]): string {
  const cards = questions.map((question) => `<article class="question-card">
    <div class="meta">${esc(question.reviewId)} · ${esc(question.proposalId)} · REGULAR HEXAGON</div>
    <h2>${question.task === "FORWARD_UNFOLD" ? "Hexagonal paper — unfold the cut" : "Hexagonal paper — reverse inference"}</h2>
    <p class="stem"><strong>Question:</strong> ${esc(question.stem)}</p>
    <div class="stimulus">${question.stimulusSvg}</div>
    <div class="options">${question.options.map((option) => `<div class="option"><div class="option-label">${option.optionId}</div><div class="option-art">${option.svg}</div></div>`).join("")}</div>
    <details><summary>Show answer and explanation</summary><p><strong>Answer:</strong> ${question.correctOptionId}</p><p>${esc(question.explanation)}</p></details>
  </article>`).join("\n");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PFC Hexagon Gap Review V1</title><style>
  *{box-sizing:border-box}body{margin:0;background:#fff;color:#111;font-family:Arial,Helvetica,sans-serif;line-height:1.45}.wrap{max-width:1180px;margin:0 auto;padding:18px}.hero{border:1px solid #ddd;border-radius:12px;padding:16px;margin-bottom:18px}.hero h1{margin:0 0 8px;font-size:24px}.hero p{margin:6px 0}.question-card{border:1px solid #d8d8d8;border-radius:12px;padding:16px;margin:0 0 18px;background:#fff}.meta{font-size:12px;color:#555;margin-bottom:5px}.question-card h2{font-size:18px;margin:4px 0 10px}.stem{font-size:16px}.stimulus{overflow:auto;border:1px solid #eee;border-radius:10px;padding:12px;background:#fff}.sequence{display:flex;align-items:center;gap:12px;min-width:max-content;background:#fff}.stage{width:190px;flex:0 0 190px;text-align:center}.stage svg{display:block;margin:0 auto;width:170px;height:150px}.stage-label{font-size:12px;font-weight:700;min-height:34px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:4px}.stage-arrow{font-size:24px}.target-pattern{text-align:center}.options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:14px}.option{border:1px solid #ddd;border-radius:10px;min-height:190px;padding:10px;background:#fff}.option-label{font-weight:700;margin-bottom:5px}.option-art{overflow:auto;text-align:center;min-height:150px}.option-art>svg{width:150px;height:140px}.option-art .sequence{justify-content:flex-start}.option-art .stage{width:170px;flex-basis:170px}.option-art .stage svg{width:150px;height:132px}.option-art .stage-label{min-height:30px}details{margin-top:12px;border-top:1px solid #eee;padding-top:10px}summary{cursor:pointer;font-weight:700}@media(max-width:700px){.wrap{padding:10px}.options{grid-template-columns:1fr}.option{min-height:175px}.question-card{padding:12px}.hero h1{font-size:21px}}
  </style></head><body><main class="wrap"><section class="hero"><h1>PFC-001 Hexagon Substrate Gap Review V1</h1><p><strong>Scope:</strong> regular hexagonal source paper only. Triangle has already been approved separately.</p><p>12 questions: 8 forward + 4 reverse. Includes single-axis folds and the six-sector radial unfolding family. Review only; no permanent QL or Question Studio activation.</p></section>${cards}</main></body></html>`;
}
