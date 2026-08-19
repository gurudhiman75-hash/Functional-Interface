import { applyAffineTransform, reflectionAcrossLineTransform } from "./geometry";
import {
  applyPfcFoldV1,
  type PfcFoldV1,
  type PfcLayerFragmentV1,
} from "./paper-folding-foundation-v1";
import type {
  PfcCutGeometryV2,
  PfcSourceSheetV2,
} from "./paper-folding-foundation-v2";
import {
  pfcMultishapeDiscoveryScenariosWave1,
  solvePfcForwardScenarioWave1,
  solvePfcReverseInferenceWave1,
  type PfcForwardScenarioWave1,
  type PfcMappedCutWave1,
} from "./paper-folding-multishape-discovery-v1";
import {
  pfcGapClosureScenariosWave2,
  solvePfcForwardScenarioWave2,
  type PfcForwardSolutionWave2,
} from "./paper-folding-source-saturated-discovery-v2";
import {
  generatePfcExamQuestionV5,
  renderPfcExamOptionSvgV5,
  renderPfcExamStimulusSvgV5,
} from "./paper-folding-exam-standard-v5";
import {
  PFC_TPF_SOURCE_SATURATED_MERGE_SPLIT_QL_PROPOSAL_V1,
  PFC_TPF_SOURCE_SATURATED_SKILL_PROPOSALS_V1,
  type PfcTpfSkillProposalIdV1,
} from "./paper-folding-merge-split-ql-proposal-v1";
import {
  solveTransparentPatternFoldWave1,
  tpfDiscoveryScenariosWave1,
  type TpfPatternPrimitiveWave1,
  type TpfTransparentScenarioWave1,
} from "./transparent-pattern-folding-discovery-v1";
import {
  solveTransparentPatternFoldWave2,
  tpfDiscoveryScenariosWave2,
  type TpfPatternPrimitiveWave2,
  type TpfTransparentScenarioWave2,
} from "./transparent-pattern-folding-discovery-v2";
import type { SpatialPoint } from "./types";

export const PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1 = Object.freeze({
  authorityId: "PFC-TPF-SOURCE-SATURATED-ENGLISH-REVIEW-V1" as const,
  proposalAuthority: PFC_TPF_SOURCE_SATURATED_MERGE_SPLIT_QL_PROPOSAL_V1.authorityId,
  proposalCount: 6,
  questionsPerProposal: 8,
  reviewQuestionCount: 48,
  language: "en" as const,
  locale: "en-IN" as const,
  learnerSurface: "WHITE_EXAM_STYLE_SOURCE_SATURATED" as const,
  semanticRule: "CORRECT_ANSWERS_FROM_EXECUTABLE_SOLVERS_NOT_HAND_AUTHORED" as const,
  permanentQlIdsUsed: false,
  englishFreezeAllowed: false,
  localizationAllowed: false,
  questionStudioAllowed: false,
  automaticPublication: false,
  status: "LEARNER_REVIEW_CANDIDATE_NOT_FROZEN" as const,
} as const);

export type PfcTpfReviewTaskKindV1 =
  | "LEGACY_FORWARD"
  | "MULTISHAPE_FORWARD"
  | "REVERSE_INFERENCE"
  | "TRANSPARENT_SUPERPOSITION";

export interface PfcTpfReviewOptionV1 {
  optionId: "A" | "B" | "C" | "D";
  svg: string;
}

export interface PfcTpfEnglishReviewQuestionV1 {
  reviewQuestionId: string;
  proposalId: PfcTpfSkillProposalIdV1;
  proposalName: string;
  chapterCode: "PFC-001" | "TPF-001";
  taskKind: PfcTpfReviewTaskKindV1;
  sourceId: string;
  sourceShape: "SQUARE" | "RECTANGLE" | "CIRCLE" | "TRANSPARENT_SQUARE";
  stem: string;
  stimulusSvg: string;
  options: PfcTpfReviewOptionV1[];
  correctOptionId: "A" | "B" | "C" | "D";
  explanation: string;
  semanticFingerprint: string;
}

const OPTION_IDS = ["A", "B", "C", "D"] as const;
const EPSILON = 1e-7;
const q = (value: number) => Math.round(value * 1000) / 1000;
const pointKey = (point: SpatialPoint) => `${q(point.x)},${q(point.y)}`;
const esc = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function proposalName(proposalId: PfcTpfSkillProposalIdV1): string {
  const proposal = PFC_TPF_SOURCE_SATURATED_SKILL_PROPOSALS_V1.find((item) => item.proposalId === proposalId);
  if (!proposal) throw new Error(`Unknown PFC/TPF proposal ${proposalId}.`);
  return proposal.name;
}

function sourceCenter(sheet: PfcSourceSheetV2): SpatialPoint {
  if (sheet.shape === "CIRCLE") return { ...sheet.center };
  const width = sheet.shape === "SQUARE" ? sheet.size : sheet.width;
  const height = sheet.shape === "SQUARE" ? sheet.size : sheet.height;
  return { x: sheet.origin.x + width / 2, y: sheet.origin.y + height / 2 };
}

function sourceDisplayPolygon(sheet: PfcSourceSheetV2): SpatialPoint[] {
  if (sheet.shape === "CIRCLE") {
    return Array.from({ length: 96 }, (_, index) => {
      const angle = (Math.PI * 2 * index) / 96;
      return {
        x: sheet.center.x + Math.cos(angle) * sheet.radius,
        y: sheet.center.y + Math.sin(angle) * sheet.radius,
      };
    });
  }
  const width = sheet.shape === "SQUARE" ? sheet.size : sheet.width;
  const height = sheet.shape === "SQUARE" ? sheet.size : sheet.height;
  return [
    { ...sheet.origin },
    { x: sheet.origin.x + width, y: sheet.origin.y },
    { x: sheet.origin.x + width, y: sheet.origin.y + height },
    { x: sheet.origin.x, y: sheet.origin.y + height },
  ];
}

function sheetBounds(sheet: PfcSourceSheetV2) {
  if (sheet.shape === "CIRCLE") {
    return {
      minX: sheet.center.x - sheet.radius,
      minY: sheet.center.y - sheet.radius,
      maxX: sheet.center.x + sheet.radius,
      maxY: sheet.center.y + sheet.radius,
    };
  }
  const width = sheet.shape === "SQUARE" ? sheet.size : sheet.width;
  const height = sheet.shape === "SQUARE" ? sheet.size : sheet.height;
  return {
    minX: sheet.origin.x,
    minY: sheet.origin.y,
    maxX: sheet.origin.x + width,
    maxY: sheet.origin.y + height,
  };
}

function uniqueFragmentPolygons(fragments: readonly PfcLayerFragmentV1[]): SpatialPoint[][] {
  const unique = new Map<string, SpatialPoint[]>();
  for (const fragment of fragments) {
    const key = fragment.polygon.map(pointKey).join("|");
    if (!unique.has(key)) unique.set(key, fragment.polygon);
  }
  return [...unique.values()];
}

function polygonSvg(points: readonly SpatialPoint[], fill = "white", stroke = "#111", width = 1.2): string {
  return `<polygon points="${points.map((point) => `${q(point.x)},${q(point.y)}`).join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"/>`;
}

function cutSvg(cut: PfcCutGeometryV2): string {
  if (cut.kind === "CIRCLE_HOLE") {
    return `<circle cx="${q(cut.center.x)}" cy="${q(cut.center.y)}" r="${q(Math.max(1.8, cut.radius))}" fill="#111"/>`;
  }
  if (cut.kind === "SLIT") {
    return `<line x1="${q(cut.a.x)}" y1="${q(cut.a.y)}" x2="${q(cut.b.x)}" y2="${q(cut.b.y)}" stroke="#111" stroke-width="${q(Math.max(1.8, cut.width))}" stroke-linecap="round"/>`;
  }
  if (cut.kind === "EDGE_NOTCH") {
    return `<polyline points="${cut.vertices.map((point) => `${q(point.x)},${q(point.y)}`).join(" ")}" fill="white" stroke="#111" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return polygonSvg(cut.vertices, "#111", "#111", 1);
}

function foldArrowSvg(fold: PfcFoldV1): string {
  const dx = fold.line.b.x - fold.line.a.x;
  const dy = fold.line.b.y - fold.line.a.y;
  const length = Math.hypot(dx, dy);
  const nx = -dy / length;
  const ny = dx / length;
  const movingSign = fold.movingSide === "POSITIVE" ? 1 : -1;
  const midpoint = { x: (fold.line.a.x + fold.line.b.x) / 2, y: (fold.line.a.y + fold.line.b.y) / 2 };
  const start = { x: midpoint.x + nx * movingSign * 18, y: midpoint.y + ny * movingSign * 18 };
  const end = { x: midpoint.x - nx * movingSign * 18, y: midpoint.y - ny * movingSign * 18 };
  return `<line x1="${q(start.x)}" y1="${q(start.y)}" x2="${q(end.x)}" y2="${q(end.y)}" stroke="#111" stroke-width="1.8" marker-end="url(#arrow)"/>`;
}

function renderForwardStimulusV1(scenario: PfcForwardScenarioWave1, width = 700): string {
  let fragments: PfcLayerFragmentV1[] = [{
    fragmentId: "DISPLAY-ROOT",
    sourceSheetRegionId: "DISPLAY-ROOT",
    polygon: sourceDisplayPolygon(scenario.sourceSheet),
    transformHistory: [],
  }];
  const states: PfcLayerFragmentV1[][] = [];
  for (const fold of scenario.folds) {
    states.push(fragments);
    fragments = applyPfcFoldV1(fragments, fold);
  }
  const allPoints = [...states.flatMap((state) => state.flatMap((fragment) => fragment.polygon)), ...fragments.flatMap((fragment) => fragment.polygon)];
  const base = sheetBounds(scenario.sourceSheet);
  const minX = Math.min(base.minX, ...allPoints.map((point) => point.x)) - 8;
  const maxX = Math.max(base.maxX, ...allPoints.map((point) => point.x)) + 8;
  const minY = Math.min(base.minY, ...allPoints.map((point) => point.y)) - 12;
  const maxY = Math.max(base.maxY, ...allPoints.map((point) => point.y)) + 8;
  const viewW = maxX - minX;
  const viewH = maxY - minY;
  const panels: string[] = [];
  for (let index = 0; index < scenario.folds.length; index += 1) {
    const polygons = uniqueFragmentPolygons(states[index]).map((polygon) => polygonSvg(polygon)).join("");
    const fold = scenario.folds[index];
    panels.push(`<svg viewBox="${q(minX)} ${q(minY)} ${q(viewW)} ${q(viewH)}" width="150" height="150" role="img" aria-label="Fold ${index + 1}" style="background:#fff"><defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#111"/></marker></defs>${polygons}<line x1="${q(fold.line.a.x)}" y1="${q(fold.line.a.y)}" x2="${q(fold.line.b.x)}" y2="${q(fold.line.b.y)}" stroke="#555" stroke-width="1.1" stroke-dasharray="4 3"/>${foldArrowSvg(fold)}<text x="${q(minX + 4)}" y="${q(minY + 8)}" font-size="6" fill="#111">Fold ${index + 1}</text></svg>`);
  }
  const finalPolygons = uniqueFragmentPolygons(fragments).map((polygon) => polygonSvg(polygon, "#fafafa")).join("");
  panels.push(`<svg viewBox="${q(minX)} ${q(minY)} ${q(viewW)} ${q(viewH)}" width="150" height="150" role="img" aria-label="Folded paper with cut" style="background:#fff">${finalPolygons}${scenario.cuts.map(cutSvg).join("")}<text x="${q(minX + 4)}" y="${q(minY + 8)}" font-size="6" fill="#111">Cut / punch</text></svg>`);
  return `<div style="display:flex;align-items:center;gap:10px;overflow:auto;background:#fff;max-width:${width}px">${panels.map((panel, index) => `${index ? '<span style="font-size:22px">→</span>' : ''}${panel}`).join("")}</div>`;
}

type ReviewMarkV1 =
  | { kind: "CIRCLE"; center: SpatialPoint; radius: number }
  | { kind: "POLYGON"; vertices: SpatialPoint[]; boundaryOpen?: boolean }
  | { kind: "SLIT"; a: SpatialPoint; b: SpatialPoint; width: number };

function mappedToMark(cut: PfcMappedCutWave1): ReviewMarkV1 {
  if (cut.kind === "CIRCLE_HOLE") return { kind: "CIRCLE", center: cut.center, radius: cut.radius };
  if (cut.kind === "SLIT") return { kind: "SLIT", a: cut.a, b: cut.b, width: cut.width };
  return { kind: "POLYGON", vertices: cut.vertices, boundaryOpen: cut.kind === "EDGE_NOTCH" };
}

function marksForWave2(solution: PfcForwardSolutionWave2): ReviewMarkV1[] {
  const nonNotches = solution.mappedCuts.filter((cut) => cut.kind !== "EDGE_NOTCH").map(mappedToMark);
  const notchMarks = solution.topologyComponents
    .filter((component) => (component.topology === "BOUNDARY_NOTCH" || component.topology === "INTERIOR_COALESCED_CUT") && component.vertices)
    .map<ReviewMarkV1>((component) => ({
      kind: "POLYGON",
      vertices: component.vertices!.map((point) => ({ ...point })),
      boundaryOpen: component.topology === "BOUNDARY_NOTCH",
    }));
  return [...nonNotches, ...notchMarks];
}

function markFingerprint(mark: ReviewMarkV1): string {
  if (mark.kind === "CIRCLE") return `C:${pointKey(mark.center)}:${q(mark.radius)}`;
  if (mark.kind === "SLIT") return `S:${[pointKey(mark.a), pointKey(mark.b)].sort().join("|")}:${q(mark.width)}`;
  return `P:${mark.boundaryOpen ? "B" : "I"}:${mark.vertices.map(pointKey).sort().join("|")}`;
}

function markSetFingerprint(marks: readonly ReviewMarkV1[]): string {
  return marks.map(markFingerprint).sort().join(";");
}

function transformMark(mark: ReviewMarkV1, fn: (point: SpatialPoint) => SpatialPoint): ReviewMarkV1 {
  if (mark.kind === "CIRCLE") return { ...mark, center: fn(mark.center) };
  if (mark.kind === "SLIT") return { ...mark, a: fn(mark.a), b: fn(mark.b) };
  return { ...mark, vertices: mark.vertices.map(fn) };
}

function wrongPositionMarks(sheet: PfcSourceSheetV2, marks: readonly ReviewMarkV1[]): ReviewMarkV1[] {
  const center = sourceCenter(sheet);
  return marks.map((mark, index) => transformMark(mark, (point) => {
    const factor = index % 2 === 0 ? 0.86 : 0.92;
    return { x: q(center.x + (point.x - center.x) * factor), y: q(center.y + (point.y - center.y) * factor) };
  }));
}

function extraMark(sheet: PfcSourceSheetV2): ReviewMarkV1 {
  const bounds = sheetBounds(sheet);
  return {
    kind: "CIRCLE",
    center: { x: q(bounds.minX + (bounds.maxX - bounds.minX) * 0.31), y: q(bounds.minY + (bounds.maxY - bounds.minY) * 0.68) },
    radius: 2.2,
  };
}

function renderSheetBoundary(sheet: PfcSourceSheetV2): string {
  if (sheet.shape === "CIRCLE") {
    return `<circle cx="${q(sheet.center.x)}" cy="${q(sheet.center.y)}" r="${q(sheet.radius)}" fill="white" stroke="#111" stroke-width="1.4"/>`;
  }
  const width = sheet.shape === "SQUARE" ? sheet.size : sheet.width;
  const height = sheet.shape === "SQUARE" ? sheet.size : sheet.height;
  return `<rect x="${q(sheet.origin.x)}" y="${q(sheet.origin.y)}" width="${q(width)}" height="${q(height)}" fill="white" stroke="#111" stroke-width="1.4"/>`;
}

function renderMarkSvg(mark: ReviewMarkV1): string {
  if (mark.kind === "CIRCLE") return `<circle cx="${q(mark.center.x)}" cy="${q(mark.center.y)}" r="${q(Math.max(1.8, mark.radius))}" fill="#111"/>`;
  if (mark.kind === "SLIT") return `<line x1="${q(mark.a.x)}" y1="${q(mark.a.y)}" x2="${q(mark.b.x)}" y2="${q(mark.b.y)}" stroke="#111" stroke-width="${q(Math.max(1.7, mark.width))}" stroke-linecap="round"/>`;
  if (!mark.boundaryOpen) return polygonSvg(mark.vertices, "#111", "#111", 1);
  const first = mark.vertices[0];
  const last = mark.vertices[mark.vertices.length - 1];
  return `<line x1="${q(first.x)}" y1="${q(first.y)}" x2="${q(last.x)}" y2="${q(last.y)}" stroke="white" stroke-width="5" stroke-linecap="round"/><polyline points="${mark.vertices.map((point) => `${q(point.x)},${q(point.y)}`).join(" ")}" fill="white" stroke="#111" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function renderAnswerPatternSvg(sheet: PfcSourceSheetV2, marks: readonly ReviewMarkV1[], width = 150): string {
  const bounds = sheetBounds(sheet);
  const pad = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) * 0.08;
  return `<svg viewBox="${q(bounds.minX - pad)} ${q(bounds.minY - pad)} ${q(bounds.maxX - bounds.minX + 2 * pad)} ${q(bounds.maxY - bounds.minY + 2 * pad)}" width="${width}" height="${width}" style="background:#fff" role="img">${renderSheetBoundary(sheet)}${marks.map(renderMarkSvg).join("")}</svg>`;
}

function rotateOptions<T>(correct: T, wrong: readonly T[], seed: number): { options: T[]; correctIndex: number } {
  const base = [correct, ...wrong.slice(0, 3)];
  if (base.length !== 4) throw new Error("Exactly four options are required.");
  const rotation = seed % 4;
  const options = [...base.slice(rotation), ...base.slice(0, rotation)];
  return { options, correctIndex: options.indexOf(correct) };
}

function multishapeForwardReview(
  proposalId: PfcTpfSkillProposalIdV1,
  scenario: PfcForwardScenarioWave1,
  ordinal: number,
  useWave2 = false,
): PfcTpfEnglishReviewQuestionV1 {
  const solution = useWave2 ? solvePfcForwardScenarioWave2(scenario) : solvePfcForwardScenarioWave1(scenario);
  const correctMarks = useWave2 ? marksForWave2(solution as PfcForwardSolutionWave2) : solution.mappedCuts.map(mappedToMark);
  if (correctMarks.length === 0) throw new Error(`${scenario.scenarioId} produced no answer marks.`);
  const incomplete = correctMarks.length > 1 ? correctMarks.slice(0, Math.max(1, Math.ceil(correctMarks.length / 2))) : wrongPositionMarks(scenario.sourceSheet, correctMarks);
  const shifted = wrongPositionMarks(scenario.sourceSheet, correctMarks);
  const extra = [...correctMarks, extraMark(scenario.sourceSheet)];
  const candidates = [incomplete, shifted, extra].filter((marks, index, all) => {
    const fp = markSetFingerprint(marks);
    return fp !== markSetFingerprint(correctMarks) && all.findIndex((other) => markSetFingerprint(other) === fp) === index;
  });
  while (candidates.length < 3) {
    const scale = 0.76 - candidates.length * 0.06;
    const center = sourceCenter(scenario.sourceSheet);
    candidates.push(correctMarks.map((mark) => transformMark(mark, (point) => ({
      x: q(center.x + (point.x - center.x) * scale),
      y: q(center.y + (point.y - center.y) * scale),
    }))));
  }
  const rotated = rotateOptions(correctMarks, candidates, ordinal);
  const correctOptionId = OPTION_IDS[rotated.correctIndex];
  const layerCounts = Object.values(solution.affectedLayersByCut);
  const shapeName = scenario.sourceSheet.shape === "CIRCLE" ? "circular" : scenario.sourceSheet.shape === "RECTANGLE" ? "rectangular" : "square";
  const topologyNote = useWave2 && (solution as PfcForwardSolutionWave2).topologyComponents.some((item) => item.topology === "INTERIOR_COALESCED_CUT")
    ? " The two cut edges that meet on the crease join into one interior cut when the fold is opened."
    : "";
  return {
    reviewQuestionId: `PFC-TPF-REV-${String(ordinal + 1).padStart(3, "0")}`,
    proposalId,
    proposalName: proposalName(proposalId),
    chapterCode: "PFC-001",
    taskKind: "MULTISHAPE_FORWARD",
    sourceId: scenario.scenarioId,
    sourceShape: scenario.sourceSheet.shape,
    stem: `A ${shapeName} paper is folded in the arrow direction and cut or punched as shown. Which option shows the paper after it is fully unfolded?`,
    stimulusSvg: renderForwardStimulusV1(scenario),
    options: rotated.options.map((marks, index) => ({ optionId: OPTION_IDS[index], svg: renderAnswerPatternSvg(scenario.sourceSheet, marks) })),
    correctOptionId,
    explanation: `The shown cut${scenario.cuts.length > 1 ? "s pass" : " passes"} through ${layerCounts.join(" and ")} layer${layerCounts.some((count) => count !== 1) ? "s" : ""}. Open the folds in reverse order and reflect each cut through the same creases.${topologyNote} Only option ${correctOptionId} preserves the complete physical pattern.`,
    semanticFingerprint: useWave2 ? (solution as PfcForwardSolutionWave2).coalescedFingerprint : solution.fingerprint,
  };
}

function legacyForwardReview(proposalId: PfcTpfSkillProposalIdV1, discoveryIndex: number, ordinal: number): PfcTpfEnglishReviewQuestionV1 {
  const question = generatePfcExamQuestionV5(discoveryIndex);
  return {
    reviewQuestionId: `PFC-TPF-REV-${String(ordinal + 1).padStart(3, "0")}`,
    proposalId,
    proposalName: proposalName(proposalId),
    chapterCode: "PFC-001",
    taskKind: "LEGACY_FORWARD",
    sourceId: question.questionId,
    sourceShape: "SQUARE",
    stem: "A square paper is folded in the arrow direction and cut or punched as shown. Which option shows the paper after it is fully unfolded?",
    stimulusSvg: renderPfcExamStimulusSvgV5(question, 680),
    options: question.options.map((option) => ({ optionId: option.optionId, svg: renderPfcExamOptionSvgV5(option, 150) })),
    correctOptionId: question.correctOptionId,
    explanation: question.explanation,
    semanticFingerprint: question.semanticFingerprint,
  };
}

function verticalFold(width: number, id: string, movingSide: "POSITIVE" | "NEGATIVE" = "POSITIVE"): PfcFoldV1 {
  return { foldId: id, kind: "VERTICAL", line: { a: { x: width / 2, y: -200 }, b: { x: width / 2, y: 300 } }, movingSide };
}
function horizontalFold(height: number, id: string, movingSide: "POSITIVE" | "NEGATIVE" = "POSITIVE"): PfcFoldV1 {
  return { foldId: id, kind: "HORIZONTAL", line: { a: { x: -200, y: height / 2 }, b: { x: 300, y: height / 2 } }, movingSide };
}
function reverseFoldAt(x: number, id: string, movingSide: "POSITIVE" | "NEGATIVE" = "POSITIVE"): PfcFoldV1 {
  return { foldId: id, kind: "VERTICAL", line: { a: { x, y: -200 }, b: { x, y: 300 } }, movingSide };
}
function reverseHorizontalAt(y: number, id: string, movingSide: "POSITIVE" | "NEGATIVE" = "POSITIVE"): PfcFoldV1 {
  return { foldId: id, kind: "HORIZONTAL", line: { a: { x: -200, y }, b: { x: 300, y } }, movingSide };
}

interface ReverseReviewCaseV1 {
  questionId: string;
  sheet: PfcSourceSheetV2;
  target: PfcForwardScenarioWave1;
  candidates: Array<{ candidateId: "A" | "B" | "C" | "D"; scenario: PfcForwardScenarioWave1 }>;
  correctCandidateId: "A" | "B" | "C" | "D";
}

function buildReverseCase(shape: "SQUARE" | "RECTANGLE", foldDepth: 1 | 2 | 3, variant: number): ReverseReviewCaseV1 {
  const width = shape === "SQUARE" ? 100 : 120;
  const height = shape === "SQUARE" ? 100 : 80;
  const sheet: PfcSourceSheetV2 = shape === "SQUARE"
    ? { sheetId: `REV-${shape}`, shape, origin: { x: 0, y: 0 }, size: width }
    : { sheetId: `REV-${shape}`, shape, origin: { x: 0, y: 0 }, width, height };
  const yTop = q(height * (0.22 + variant * 0.035));
  const targetX = foldDepth === 3 ? q(width * (0.84 + variant * 0.018)) : q(width * (0.70 + variant * 0.025));
  const targetY = foldDepth >= 2 ? Math.min(q(height * 0.34), yTop) : q(height * (0.28 + variant * 0.06));
  const targetFolds: PfcFoldV1[] = [verticalFold(width, "F1")];
  if (foldDepth >= 2) targetFolds.push(horizontalFold(height, "F2"));
  if (foldDepth >= 3) targetFolds.push(reverseFoldAt(width * 0.75, "F3"));
  const questionId = `PFC-REVIEW-REV-${shape}-D${foldDepth}-V${variant + 1}`;
  const target: PfcForwardScenarioWave1 = {
    scenarioId: `${questionId}-TARGET`,
    sourceSheet: sheet,
    folds: targetFolds,
    cuts: [{ cutId: "H1", kind: "CIRCLE_HOLE", center: { x: targetX, y: targetY }, radius: 2 }],
    sourceFamily: `REVERSE_TARGET_DEPTH_${foldDepth}`,
  };
  const wrongPosition: PfcForwardScenarioWave1 = {
    ...target,
    scenarioId: `${questionId}-WRONG-POSITION`,
    cuts: [{ cutId: "H1", kind: "CIRCLE_HOLE", center: { x: q(targetX - width * 0.055), y: q(targetY + height * 0.045) }, radius: 2 }],
    sourceFamily: "REVERSE_WRONG_PUNCH_POSITION",
  };
  const wrongSide: PfcForwardScenarioWave1 = foldDepth === 1
    ? {
        ...target,
        scenarioId: `${questionId}-WRONG-SIDE`,
        folds: [verticalFold(width, "F1", "NEGATIVE")],
        cuts: [{ cutId: "H1", kind: "CIRCLE_HOLE", center: { x: q(width * (0.24 + variant * 0.02)), y: q(targetY + height * 0.035) }, radius: 2 }],
        sourceFamily: "REVERSE_WRONG_FOLD_SIDE",
      }
    : {
        ...target,
        scenarioId: `${questionId}-WRONG-SIDE`,
        folds: [verticalFold(width, "F1"), horizontalFold(height, "F2", "NEGATIVE")],
        cuts: [{ cutId: "H1", kind: "CIRCLE_HOLE", center: { x: q(width * 0.72), y: q(height * 0.72) }, radius: 2 }],
        sourceFamily: "REVERSE_WRONG_SECOND_FOLD_SIDE",
      };
  const wrongDepth: PfcForwardScenarioWave1 = foldDepth === 3
    ? {
        ...target,
        scenarioId: `${questionId}-WRONG-DEPTH`,
        folds: [verticalFold(width, "F1"), horizontalFold(height, "F2"), reverseHorizontalAt(height * 0.25, "F3")],
        cuts: [{ cutId: "H1", kind: "CIRCLE_HOLE", center: { x: q(width * 0.72), y: q(height * 0.12) }, radius: 2 }],
        sourceFamily: "REVERSE_WRONG_THIRD_AXIS",
      }
    : {
        ...target,
        scenarioId: `${questionId}-WRONG-DEPTH`,
        folds: [verticalFold(width, "F1"), reverseFoldAt(width * 0.75, "F2")],
        cuts: [{ cutId: "H1", kind: "CIRCLE_HOLE", center: { x: q(width * 0.86), y: targetY }, radius: 2 }],
        sourceFamily: "REVERSE_WRONG_FOLD_COUNT",
      };
  const raw = [target, wrongPosition, wrongSide, wrongDepth];
  const rotation = (variant + foldDepth) % 4;
  const ordered = [...raw.slice(rotation), ...raw.slice(0, rotation)].map((scenario, index) => ({ candidateId: OPTION_IDS[index], scenario }));
  const targetSolution = solvePfcForwardScenarioWave1(target);
  const solved = solvePfcReverseInferenceWave1(targetSolution.fingerprint, ordered);
  return { questionId, sheet, target, candidates: ordered, correctCandidateId: solved.candidateId as "A" | "B" | "C" | "D" };
}

function reverseReviewQuestion(shape: "SQUARE" | "RECTANGLE", depth: 1 | 2 | 3, variant: number, ordinal: number): PfcTpfEnglishReviewQuestionV1 {
  const item = buildReverseCase(shape, depth, variant);
  const targetSolution = solvePfcForwardScenarioWave1(item.target);
  const targetMarks = targetSolution.mappedCuts.map(mappedToMark);
  return {
    reviewQuestionId: `PFC-TPF-REV-${String(ordinal + 1).padStart(3, "0")}`,
    proposalId: "PFC-PROP-05",
    proposalName: proposalName("PFC-PROP-05"),
    chapterCode: "PFC-001",
    taskKind: "REVERSE_INFERENCE",
    sourceId: item.questionId,
    sourceShape: shape,
    stem: "The fully opened punched paper is shown. Which option could have been the folding and punching process?",
    stimulusSvg: `<div style="display:flex;align-items:center;gap:14px;background:#fff"><div><div style="font-size:13px;margin-bottom:5px">Fully opened result</div>${renderAnswerPatternSvg(item.sheet, targetMarks, 185)}</div></div>`,
    options: item.candidates.map(({ candidateId, scenario }) => ({ optionId: candidateId, svg: renderForwardStimulusV1(scenario, 300) })),
    correctOptionId: item.correctCandidateId,
    explanation: `Test each option forward: perform its folds, make the shown punch, and unfold completely. Only option ${item.correctCandidateId} reproduces every hole in the given open pattern, so it is the unique valid process.`,
    semanticFingerprint: targetSolution.fingerprint,
  };
}

function tpfFoldArrow(fold: PfcFoldV1): string {
  return foldArrowSvg(fold);
}

function renderTpfPrimitive(primitive: TpfPatternPrimitiveWave2 | TpfPatternPrimitiveWave1): string {
  if (primitive.kind === "POINT_MARK") return `<circle cx="${q(primitive.point.x)}" cy="${q(primitive.point.y)}" r="2.1" fill="#111"/>`;
  if (primitive.kind === "SEGMENT") return `<line x1="${q(primitive.a.x)}" y1="${q(primitive.a.y)}" x2="${q(primitive.b.x)}" y2="${q(primitive.b.y)}" stroke="#111" stroke-width="1.7" stroke-linecap="round"/>`;
  if (primitive.kind === "POLYLINE") return `<polyline points="${primitive.points.map((point) => `${q(point.x)},${q(point.y)}`).join(" ")}" fill="none" stroke="#111" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>`;
  if (primitive.kind === "POLYGON_OUTLINE") return `<polygon points="${primitive.vertices.map((point) => `${q(point.x)},${q(point.y)}`).join(" ")}" fill="none" stroke="#111" stroke-width="1.7" stroke-linejoin="round"/>`;
  return `<circle cx="${q(primitive.center.x)}" cy="${q(primitive.center.y)}" r="${q(primitive.radius)}" fill="none" stroke="#111" stroke-width="1.7"/>`;
}

function renderTpfStimulus(scenario: TpfTransparentScenarioWave1 | TpfTransparentScenarioWave2): string {
  const fold = scenario.folds[0];
  return `<svg viewBox="-8 -8 116 116" width="220" height="220" style="background:#fff" role="img"><defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#111"/></marker></defs><rect x="0" y="0" width="100" height="100" fill="white" stroke="#111" stroke-width="1.5"/>${scenario.pattern.map((primitive) => renderTpfPrimitive(primitive as TpfPatternPrimitiveWave2)).join("")}<line x1="${q(fold.line.a.x)}" y1="${q(fold.line.a.y)}" x2="${q(fold.line.b.x)}" y2="${q(fold.line.b.y)}" stroke="#555" stroke-width="1.2" stroke-dasharray="4 3"/>${tpfFoldArrow(fold)}</svg>`;
}

interface TpfAtomicDisplayV1 {
  primitives: TpfPatternPrimitiveWave1[];
  circles: Array<{ center: SpatialPoint; radius: number }>;
}

function tpfCorrectDisplay(scenario: TpfTransparentScenarioWave1 | TpfTransparentScenarioWave2): TpfAtomicDisplayV1 {
  if ("pattern" in scenario && scenario.pattern.some((primitive) => primitive.kind === "POLYLINE" || primitive.kind === "POLYGON_OUTLINE" || primitive.kind === "CIRCLE_OUTLINE")) {
    const solution = solveTransparentPatternFoldWave2(scenario as TpfTransparentScenarioWave2);
    return {
      primitives: solution.atomicPrimitives,
      circles: solution.circleOutlines.map((circle) => ({ center: circle.center, radius: circle.radius })),
    };
  }
  const solution = solveTransparentPatternFoldWave1(scenario as TpfTransparentScenarioWave1);
  return { primitives: solution.primitives, circles: [] };
}

function renderTpfAtomicDisplay(display: TpfAtomicDisplayV1, width = 150): string {
  return `<svg viewBox="-8 -8 116 116" width="${width}" height="${width}" style="background:#fff" role="img"><rect x="0" y="0" width="100" height="100" fill="white" stroke="#111" stroke-width="1.5"/>${display.primitives.map(renderTpfPrimitive).join("")}${display.circles.map((circle) => `<circle cx="${q(circle.center.x)}" cy="${q(circle.center.y)}" r="${q(circle.radius)}" fill="none" stroke="#111" stroke-width="1.7"/>`).join("")}</svg>`;
}

function reflectTpfDisplay(display: TpfAtomicDisplayV1, fold: PfcFoldV1): TpfAtomicDisplayV1 {
  const reflection = reflectionAcrossLineTransform(fold.line.a, fold.line.b);
  return {
    primitives: display.primitives.map((primitive) => primitive.kind === "POINT_MARK"
      ? { ...primitive, point: applyAffineTransform(primitive.point, reflection) }
      : { ...primitive, a: applyAffineTransform(primitive.a, reflection), b: applyAffineTransform(primitive.b, reflection) }),
    circles: display.circles.map((circle) => ({ ...circle, center: applyAffineTransform(circle.center, reflection) })),
  };
}

function shiftTpfDisplay(display: TpfAtomicDisplayV1, dx: number, dy: number): TpfAtomicDisplayV1 {
  const move = (point: SpatialPoint) => ({ x: q(Math.min(96, Math.max(4, point.x + dx))), y: q(Math.min(96, Math.max(4, point.y + dy))) });
  return {
    primitives: display.primitives.map((primitive) => primitive.kind === "POINT_MARK"
      ? { ...primitive, point: move(primitive.point) }
      : { ...primitive, a: move(primitive.a), b: move(primitive.b) }),
    circles: display.circles.map((circle) => ({ ...circle, center: move(circle.center) })),
  };
}

function tpfDisplayFingerprint(display: TpfAtomicDisplayV1): string {
  const primitiveKeys = display.primitives.map((primitive) => primitive.kind === "POINT_MARK"
    ? `P:${pointKey(primitive.point)}`
    : `S:${[pointKey(primitive.a), pointKey(primitive.b)].sort().join("|")}`);
  const circleKeys = display.circles.map((circle) => `C:${pointKey(circle.center)}:${q(circle.radius)}`);
  return [...primitiveKeys, ...circleKeys].sort().join(";");
}

function tpfReviewQuestion(
  scenario: TpfTransparentScenarioWave1 | TpfTransparentScenarioWave2,
  ordinal: number,
): PfcTpfEnglishReviewQuestionV1 {
  const correct = tpfCorrectDisplay(scenario);
  const fold = scenario.folds[0];
  const reflectedAll = reflectTpfDisplay(correct, fold);
  const shifted = shiftTpfDisplay(correct, 7, -5);
  const partial: TpfAtomicDisplayV1 = {
    primitives: correct.primitives.slice(0, Math.max(1, Math.ceil(correct.primitives.length / 2))),
    circles: correct.circles.slice(0, correct.primitives.length === 0 ? 1 : 0),
  };
  const wrong = [reflectedAll, shifted, partial];
  const rotated = rotateOptions(correct, wrong, ordinal);
  const correctOptionId = OPTION_IDS[rotated.correctIndex];
  const semanticFingerprint = tpfDisplayFingerprint(correct);
  return {
    reviewQuestionId: `PFC-TPF-REV-${String(ordinal + 1).padStart(3, "0")}`,
    proposalId: "TPF-PROP-01",
    proposalName: proposalName("TPF-PROP-01"),
    chapterCode: "TPF-001",
    taskKind: "TRANSPARENT_SUPERPOSITION",
    sourceId: scenario.scenarioId,
    sourceShape: "TRANSPARENT_SQUARE",
    stem: "A transparent sheet carrying the shown pattern is folded along the dotted line in the arrow direction. Which option shows the resulting superimposed pattern?",
    stimulusSvg: renderTpfStimulus(scenario),
    options: rotated.options.map((display, index) => ({ optionId: OPTION_IDS[index], svg: renderTpfAtomicDisplay(display) })),
    correctOptionId,
    explanation: `Keep the stationary part where it is and reflect only the moving part across the fold line. The reflected lines then lie on top of the stationary pattern. Option ${correctOptionId} is the only one with that exact superposition.`,
    semanticFingerprint,
  };
}

function scenarioById(id: string): PfcForwardScenarioWave1 {
  const scenario = [...pfcMultishapeDiscoveryScenariosWave1(), ...pfcGapClosureScenariosWave2()].find((item) => item.scenarioId === id);
  if (!scenario) throw new Error(`Unknown source-saturated PFC scenario ${id}.`);
  return scenario;
}

function tpfScenarioById(id: string): TpfTransparentScenarioWave1 | TpfTransparentScenarioWave2 {
  const scenario = [...tpfDiscoveryScenariosWave1(), ...tpfDiscoveryScenariosWave2()].find((item) => item.scenarioId === id);
  if (!scenario) throw new Error(`Unknown source-saturated TPF scenario ${id}.`);
  return scenario;
}

export function generatePfcTpfSourceSaturatedEnglishReviewV1(): PfcTpfEnglishReviewQuestionV1[] {
  const review: PfcTpfEnglishReviewQuestionV1[] = [];
  const addLegacy = (proposalId: PfcTpfSkillProposalIdV1, index: number) => review.push(legacyForwardReview(proposalId, index, review.length));
  const addForward = (proposalId: PfcTpfSkillProposalIdV1, scenarioId: string, wave2 = false) => review.push(multishapeForwardReview(proposalId, scenarioById(scenarioId), review.length, wave2));

  // PFC-PROP-01: axial/repeated; deliberately includes rectangle, circle and off-centre source geometry.
  addLegacy("PFC-PROP-01", 0);
  addLegacy("PFC-PROP-01", 240);
  addForward("PFC-PROP-01", "PFC-W1-RECT-V-HOLE");
  addForward("PFC-PROP-01", "PFC-W1-RECT-H-DIAMOND");
  addForward("PFC-PROP-01", "PFC-W1-CIRCLE-V-HOLE");
  addForward("PFC-PROP-01", "PFC-W1-CIRCLE-H-HOLE");
  addForward("PFC-PROP-01", "PFC-W1-RECT-OFFCENTER");
  addLegacy("PFC-PROP-01", 241);

  // PFC-PROP-02: compound and three-fold; includes analytic circle and 8-layer rectangle/square cases.
  addLegacy("PFC-PROP-02", 160);
  addLegacy("PFC-PROP-02", 480);
  addLegacy("PFC-PROP-02", 720);
  addForward("PFC-PROP-02", "PFC-W1-RECT-DOUBLE-TRIANGLE");
  addForward("PFC-PROP-02", "PFC-W1-CIRCLE-DOUBLE-TRIANGLE");
  addForward("PFC-PROP-02", "PFC-W2-SQUARE-THREE-FOLD-HOLE", true);
  addForward("PFC-PROP-02", "PFC-W2-RECT-THREE-FOLD-HOLE", true);
  addForward("PFC-PROP-02", "PFC-W2-RECT-THREE-FOLD-DIAMOND", true);

  // PFC-PROP-03: diagonal/corner overlap is a reasoning skill; orientation/position vary inside it.
  [320, 321, 322, 400, 401, 402, 403].forEach((index) => addLegacy("PFC-PROP-03", index));
  addForward("PFC-PROP-03", "PFC-W1-SQ-DIAGONAL");

  // PFC-PROP-04: multiple cuts and topology; deliberately exposes slit, mixed cuts and crease/outer notches.
  addLegacy("PFC-PROP-04", 80);
  addLegacy("PFC-PROP-04", 560);
  addForward("PFC-PROP-04", "PFC-W1-RECT-SLIT");
  addForward("PFC-PROP-04", "PFC-W1-RECT-MIXED");
  addForward("PFC-PROP-04", "PFC-W2-SQUARE-FOLD-EDGE-V-NOTCH", true);
  addForward("PFC-PROP-04", "PFC-W2-RECT-FOLD-EDGE-V-NOTCH", true);
  addForward("PFC-PROP-04", "PFC-W2-RECT-OUTER-V-NOTCH", true);
  addForward("PFC-PROP-04", "PFC-W2-RECT-THREE-FOLD-MIXED-CUTS", true);

  // PFC-PROP-05: reverse inference across shape and fold depth.
  const reverseSelections: Array<["SQUARE" | "RECTANGLE", 1 | 2 | 3, number]> = [
    ["SQUARE", 1, 0], ["SQUARE", 2, 0], ["SQUARE", 3, 0], ["SQUARE", 3, 1],
    ["RECTANGLE", 1, 0], ["RECTANGLE", 2, 0], ["RECTANGLE", 3, 0], ["RECTANGLE", 3, 1],
  ];
  reverseSelections.forEach(([shape, depth, variant]) => review.push(reverseReviewQuestion(shape, depth, variant, review.length)));

  // TPF-PROP-01: two simple source-proved cases plus all six richer Wave-2 line-art cases.
  [
    "TPF-W1-VERTICAL-POINT-PAIR",
    "TPF-W1-HORIZONTAL-POINT-PAIR",
    "TPF-W2-VERTICAL-TRIANGLE-CIRCLE",
    "TPF-W2-HORIZONTAL-TRIANGLE-CIRCLE",
    "TPF-W2-VERTICAL-CROSSING-POLYLINE",
    "TPF-W2-HORIZONTAL-CROSSING-POLYGON",
    "TPF-W2-VERTICAL-MULTI-SHAPE-LINE-ART",
    "TPF-W2-HORIZONTAL-MULTI-SHAPE-LINE-ART",
  ].forEach((id) => review.push(tpfReviewQuestion(tpfScenarioById(id), review.length)));

  return review;
}

export function renderPfcTpfSourceSaturatedEnglishReviewHtmlV1(
  questions: readonly PfcTpfEnglishReviewQuestionV1[],
): string {
  const cards = questions.map((question) => `<article style="border-top:1px solid #aaa;padding:24px 0 30px;background:#fff;break-inside:avoid"><div style="font-size:12px;color:#555">${esc(question.reviewQuestionId)} · ${esc(question.chapterCode)} · ${esc(question.proposalId)} · ${esc(question.sourceId)}</div><h2 style="font-size:18px;margin:5px 0 7px">${esc(question.proposalName)}</h2><p style="font-size:16px;line-height:1.45;margin:8px 0 14px"><strong>Question:</strong> ${esc(question.stem)}</p><div style="background:#fff;overflow:auto">${question.stimulusSvg}</div><div class="options" style="display:grid;grid-template-columns:repeat(4,minmax(150px,1fr));gap:18px;margin:20px 0 12px;background:#fff">${question.options.map((option) => `<div style="text-align:center;background:#fff"><div style="font-weight:700;margin-bottom:5px">${option.optionId}</div><div style="overflow:auto;background:#fff">${option.svg}</div></div>`).join("")}</div><p style="margin:10px 0 4px"><strong>Answer:</strong> ${question.correctOptionId}</p><p style="margin:4px 0;line-height:1.5"><strong>Explanation:</strong> ${esc(question.explanation)}</p></article>`).join("\n");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PFC / TPF Source-Saturated English Learner Review V1</title><style>html,body{background:#fff;color:#111}*{box-sizing:border-box}@media(max-width:760px){.options{grid-template-columns:repeat(2,minmax(140px,1fr))!important}}</style></head><body style="font-family:Arial,Helvetica,sans-serif;background:#fff;color:#111;max-width:1180px;margin:0 auto;padding:22px"><h1 style="font-size:25px;margin:0 0 8px">PFC / TPF Source-Saturated English Learner Review V1</h1><p style="line-height:1.5;margin:0 0 10px">48 deliberate learner-facing questions: 8 for each of the six source-saturated skill proposals. Correct answers come from executable semantic solvers. Square, rectangular and circular opaque papers, reverse fold/punch inference, and transparent single-fold superposition are all represented. This is review-only: no permanent QL allocation, freeze, localization or Question Studio registration is authorized.</p><p style="font-size:13px;color:#444;margin:0 0 18px">Authority: ${PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1.authorityId}</p>${cards}</body></html>`;
}
