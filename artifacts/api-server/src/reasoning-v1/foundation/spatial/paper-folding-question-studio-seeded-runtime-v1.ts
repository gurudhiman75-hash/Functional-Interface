import {
  applyPfcFoldV1,
  pointInPolygonInclusiveV1,
  solvePfcCutsV1,
  type PfcCutV1,
  type PfcFoldV1,
  type PfcLayerFragmentV1,
  type PfcMappedCutV1,
} from "./paper-folding-foundation-v1";
import { generatePfcTpfPermanentEnglishQlV3 } from "./paper-folding-permanent-english-runtime-v3";
import { PFC_TPF_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2 } from "./paper-folding-localization-freeze-v2";
import type { PfcTpfPermanentQlIdV4 } from "./spatial-permanent-ql-allocation-v4";
import type { SpatialPoint } from "./types";
import {
  solveTransparentPatternFoldWave2,
  type TpfPatternPrimitiveWave2,
  type TpfTransparentScenarioWave2,
} from "./transparent-pattern-folding-discovery-v2";

export const PFC_TPF_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1 = Object.freeze({
  authorityId: "PFC-TPF-QUESTION-STUDIO-SEEDED-RUNTIME-V1" as const,
  localizationFreezeAuthorityId: PFC_TPF_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.authorityId,
  permanentQlRange: "SPA-QL-035..SPA-QL-040" as const,
  generationModel: "EXACT_SOLVER_SEEDED_PARAMETER_EXPANSION" as const,
  canonicalArchetypesAreGenerationCeiling: false,
  sourceBackedCoreEnabled: true,
  controlledNovelEnabled: true,
  experimentalStretchEnabled: false,
  status: "SEEDED_RUNTIME_IMPLEMENTED_OPERATOR_REVIEW_REQUIRED" as const,
  questionStudioDiscoverable: false,
  persistenceAllowed: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  automaticPublication: false,
} as const);

export type PfcTpfStudioLanguageV1 = "en" | "hi" | "pa";
export type PfcTpfStudioQlIdV1 = PfcTpfPermanentQlIdV4;
export type PfcTpfStudioProvenanceV1 = "SOURCE_BACKED_CORE" | "CONTROLLED_NOVEL";

export interface PfcTpfStudioExplanationV1 {
  observation: string;
  rule: string;
  application: string;
  check: string;
}

export interface PfcTpfStudioQuestionV1 {
  version: "PFC-TPF-QUESTION-STUDIO-QUESTION-V1";
  packageId: "SPA-001";
  qlId: PfcTpfStudioQlIdV1;
  proposalId: "PFC-PROP-01" | "PFC-PROP-02" | "PFC-PROP-03" | "PFC-PROP-04" | "PFC-PROP-05" | "TPF-PROP-01";
  chapterCode: "PFC-001" | "TPF-001";
  qlName: string;
  language: PfcTpfStudioLanguageV1;
  locale: "en-IN" | "hi-IN" | "pa-IN";
  difficultyBand: "Medium" | "Hard";
  seed: string;
  generationSeed: string;
  mode: string;
  provenance: PfcTpfStudioProvenanceV1;
  representation: string;
  stem: string;
  stimulusSvgs: string[];
  optionSvgs: string[];
  optionLabels: ["A", "B", "C", "D"];
  correctIndex: 0 | 1 | 2 | 3;
  answer: "A" | "B" | "C" | "D";
  explanation: PfcTpfStudioExplanationV1;
  questionId: string;
  canonicalItemId: string;
  canonicalAnchorId: string;
  questionLanguageId: string;
  contentFingerprint: string;
  renderer: {
    kind: "SVG";
    recommendedStimulusPixels: 620;
    recommendedOptionPixels: 150;
    mobileMinimumOptionPixels: 112;
  };
  localization: {
    authority: typeof PFC_TPF_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.authorityId;
    canonicalLanguage: "en";
    targetLanguage: PfcTpfStudioLanguageV1;
    semanticParity: "GEOMETRY_AND_ANSWER_EXACT";
    sourceFreezeAuthority: typeof PFC_TPF_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.authorityId;
  };
  validation: {
    valid: true;
    exactSolverBacked: true;
    uniqueAnswer: true;
    optionArtUnique: true;
    spacingOnlyDistractorsAllowed: false;
    falsePyqAttribution: false;
  };
  lifecycle: {
    reviewOnly: true;
    questionStudioDiscoverable: false;
    registrationStatus: "CANDIDATE_OPERATOR_REVIEW_REQUIRED";
    persistenceAllowed: false;
    questionBankStatus: "NOT_STORED";
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  };
}

interface BoundarySpec {
  representation: string;
  provenance: PfcTpfStudioProvenanceV1;
  boundary: SpatialPoint[];
}

interface PfcScenarioV1 extends BoundarySpec {
  folds: PfcFoldV1[];
  cuts: PfcCutV1[];
  mode: string;
}

interface DisplayMarkV1 {
  x: number;
  y: number;
  kind: "POINT_HOLE" | "BOUNDARY_NOTCH";
  contact: "INTERIOR" | "BOUNDARY";
}

const LETTERS = ["A", "B", "C", "D"] as const;
const QL_META = {
  "SPA-QL-035": { proposalId: "PFC-PROP-01", chapterCode: "PFC-001", name: "Axial and repeated-fold unfolding", difficulty: "Medium" },
  "SPA-QL-036": { proposalId: "PFC-PROP-02", chapterCode: "PFC-001", name: "Compound multi-axis and multi-fold unfolding", difficulty: "Hard" },
  "SPA-QL-037": { proposalId: "PFC-PROP-03", chapterCode: "PFC-001", name: "Diagonal and corner-fold unfolding", difficulty: "Medium" },
  "SPA-QL-038": { proposalId: "PFC-PROP-04", chapterCode: "PFC-001", name: "Multiple-cut and cut-topology unfolding", difficulty: "Hard" },
  "SPA-QL-039": { proposalId: "PFC-PROP-05", chapterCode: "PFC-001", name: "Reverse fold-and-punch inference", difficulty: "Hard" },
  "SPA-QL-040": { proposalId: "TPF-PROP-01", chapterCode: "TPF-001", name: "Single-fold transparent pattern superposition", difficulty: "Medium" },
} as const;

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function shortHash(value: string): string {
  return hash32(value).toString(16).padStart(8, "0");
}

function pick<T>(seed: string, key: string, values: readonly T[]): T {
  return values[hash32(`${seed}:${key}`) % values.length]!;
}

function fraction(seed: string, key: string, min: number, max: number): number {
  const unit = hash32(`${seed}:${key}`) / 0xffffffff;
  return min + (max - min) * unit;
}

function regularPolygon(sides: number, radius = 45, cx = 50, cy = 50, rotation = -Math.PI / 2): SpatialPoint[] {
  return Array.from({ length: sides }, (_, index) => {
    const angle = rotation + (index * 2 * Math.PI) / sides;
    return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
  });
}

function boundarySpec(seed: string, qlId: PfcTpfStudioQlIdV1): BoundarySpec {
  if (qlId === "SPA-QL-039" || qlId === "SPA-QL-040") {
    const rectangular = hash32(`${seed}:base-shape`) % 2 === 0;
    return rectangular
      ? { representation: "RECTANGLE", provenance: "SOURCE_BACKED_CORE", boundary: [{ x: 0, y: 0 }, { x: 120, y: 0 }, { x: 120, y: 80 }, { x: 0, y: 80 }] }
      : { representation: "SQUARE", provenance: "SOURCE_BACKED_CORE", boundary: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }] };
  }
  const controlledNovel = hash32(`${seed}:provenance`) % 10 >= 6;
  if (controlledNovel) {
    return hash32(`${seed}:novel-shape`) % 2 === 0
      ? { representation: "REGULAR_PENTAGON", provenance: "CONTROLLED_NOVEL", boundary: regularPolygon(5) }
      : { representation: "REGULAR_OCTAGON", provenance: "CONTROLLED_NOVEL", boundary: regularPolygon(8) };
  }
  const shape = pick(seed, "core-shape", ["SQUARE", "RECTANGLE", "TRIANGLE", "REGULAR_HEXAGON"] as const);
  if (shape === "RECTANGLE") return { representation: shape, provenance: "SOURCE_BACKED_CORE", boundary: [{ x: 0, y: 0 }, { x: 120, y: 0 }, { x: 120, y: 80 }, { x: 0, y: 80 }] };
  if (shape === "TRIANGLE") return { representation: shape, provenance: "SOURCE_BACKED_CORE", boundary: [{ x: 50, y: 5 }, { x: 95, y: 85 }, { x: 5, y: 85 }] };
  if (shape === "REGULAR_HEXAGON") return { representation: shape, provenance: "SOURCE_BACKED_CORE", boundary: regularPolygon(6) };
  return { representation: shape, provenance: "SOURCE_BACKED_CORE", boundary: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }] };
}

function bbox(points: readonly SpatialPoint[]) {
  return {
    minX: Math.min(...points.map((point) => point.x)),
    maxX: Math.max(...points.map((point) => point.x)),
    minY: Math.min(...points.map((point) => point.y)),
    maxY: Math.max(...points.map((point) => point.y)),
  };
}

function allFragmentPoints(fragments: readonly PfcLayerFragmentV1[]): SpatialPoint[] {
  return fragments.flatMap((fragment) => fragment.polygon);
}

function verticalFold(id: string, x: number, minY: number, maxY: number, movingSide: "POSITIVE" | "NEGATIVE"): PfcFoldV1 {
  return { foldId: id, kind: "VERTICAL", line: { a: { x, y: minY - 80 }, b: { x, y: maxY + 80 } }, movingSide };
}

function horizontalFold(id: string, y: number, minX: number, maxX: number, movingSide: "POSITIVE" | "NEGATIVE"): PfcFoldV1 {
  return { foldId: id, kind: "HORIZONTAL", line: { a: { x: minX - 80, y }, b: { x: maxX + 80, y } }, movingSide };
}

function distancePointToSegment(point: SpatialPoint, a: SpatialPoint, b: SpatialPoint): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const denominator = dx * dx + dy * dy;
  if (denominator <= 1e-9) return Math.hypot(point.x - a.x, point.y - a.y);
  const t = Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / denominator));
  return Math.hypot(point.x - (a.x + t * dx), point.y - (a.y + t * dy));
}

function distanceToBoundary(point: SpatialPoint, polygon: readonly SpatialPoint[]): number {
  return Math.min(...polygon.map((vertex, index) => distancePointToSegment(point, vertex, polygon[(index + 1) % polygon.length]!)));
}

function initialFragments(boundary: readonly SpatialPoint[]): PfcLayerFragmentV1[] {
  return [{ fragmentId: "SHEET-ROOT", sourceSheetRegionId: "SHEET-ROOT", polygon: boundary.map((point) => ({ ...point })), transformHistory: [] }];
}

function applyFolds(boundary: readonly SpatialPoint[], folds: readonly PfcFoldV1[]): PfcLayerFragmentV1[] {
  let fragments = initialFragments(boundary);
  for (const fold of folds) fragments = applyPfcFoldV1(fragments, fold);
  return fragments;
}

function safeInteriorCuts(boundary: readonly SpatialPoint[], folds: readonly PfcFoldV1[], count: number, seed: string): PfcCutV1[] {
  const fragments = applyFolds(boundary, folds);
  const bounds = bbox(allFragmentPoints(fragments));
  const candidates: Array<{ point: SpatialPoint; score: number }> = [];
  for (let ix = 1; ix < 24; ix += 1) {
    for (let iy = 1; iy < 24; iy += 1) {
      const point = {
        x: bounds.minX + ((bounds.maxX - bounds.minX) * ix) / 24,
        y: bounds.minY + ((bounds.maxY - bounds.minY) * iy) / 24,
      };
      const affected = fragments.filter((fragment) => pointInPolygonInclusiveV1(point, fragment.polygon));
      if (affected.length < 2) continue;
      if (affected.some((fragment) => distanceToBoundary(point, fragment.polygon) < 7.5)) continue;
      const trial: PfcCutV1 = { cutId: "TRIAL", kind: "POINT_HOLE", center: point, radius: 2.8 };
      try {
        const solved = solvePfcCutsV1(boundary, folds, [trial]);
        const mapped = solved.cuts[0]?.mappedCuts ?? [];
        if (mapped.length < 2) continue;
        if (mapped.some((mark) => mark.originalContact !== "INTERIOR" || distanceToBoundary(mark.originalCenter, boundary) < 7.5)) continue;
        candidates.push({ point, score: hash32(`${seed}:${point.x.toFixed(3)}:${point.y.toFixed(3)}`) });
      } catch {
        // Candidate rejected by exact solver.
      }
    }
  }
  candidates.sort((left, right) => left.score - right.score);
  const selected: SpatialPoint[] = [];
  for (const candidate of candidates) {
    if (selected.every((point) => Math.hypot(point.x - candidate.point.x, point.y - candidate.point.y) >= 11)) {
      selected.push(candidate.point);
      if (selected.length === count) break;
    }
  }
  if (selected.length !== count) throw new Error(`Unable to find ${count} safe interior cuts.`);
  return selected.map((center, index) => ({ cutId: `C${index + 1}`, kind: "POINT_HOLE", center, radius: 2.8 }));
}

function axialFolds(boundary: readonly SpatialPoint[], repeated: boolean): PfcFoldV1[] {
  const b = bbox(boundary);
  const midX = (b.minX + b.maxX) / 2;
  const first = verticalFold("F1", midX, b.minY, b.maxY, "POSITIVE");
  if (!repeated) return [first];
  const q3 = midX + (b.maxX - midX) / 2;
  return [first, verticalFold("F2", q3, b.minY, b.maxY, "NEGATIVE")];
}

function compoundFolds(boundary: readonly SpatialPoint[], depth: 2 | 3): PfcFoldV1[] {
  const b = bbox(boundary);
  const midX = (b.minX + b.maxX) / 2;
  const midY = (b.minY + b.maxY) / 2;
  const result: PfcFoldV1[] = [
    verticalFold("F1", midX, b.minY, b.maxY, "POSITIVE"),
    horizontalFold("F2", midY, b.minX, b.maxX, "POSITIVE"),
  ];
  if (depth === 3) result.push(verticalFold("F3", midX + (b.maxX - midX) / 2, b.minY, b.maxY, "NEGATIVE"));
  return result;
}

function diagonalOrCornerFold(boundary: readonly SpatialPoint[], corner: boolean): PfcFoldV1[] {
  const b = bbox(boundary);
  if (!corner) {
    return [{
      foldId: "F1",
      kind: "DIAGONAL",
      line: { a: { x: b.minX, y: b.minY }, b: { x: b.maxX, y: b.maxY } },
      movingSide: "POSITIVE",
    }];
  }
  return [{
    foldId: "F1",
    kind: "CORNER",
    line: {
      a: { x: b.minX + (b.maxX - b.minX) * 0.55, y: b.minY },
      b: { x: b.maxX, y: b.minY + (b.maxY - b.minY) * 0.45 },
    },
    movingSide: "NEGATIVE",
  }];
}

function forwardScenario(qlId: "SPA-QL-035" | "SPA-QL-036" | "SPA-QL-037" | "SPA-QL-038", seed: string): PfcScenarioV1 {
  if (qlId === "SPA-QL-038" && hash32(`${seed}:topology`) % 4 === 0) {
    const rectangular = hash32(`${seed}:notch-shape`) % 2 === 0;
    const spec: BoundarySpec = rectangular
      ? { representation: "RECTANGLE", provenance: "SOURCE_BACKED_CORE", boundary: [{ x: 0, y: 0 }, { x: 120, y: 0 }, { x: 120, y: 80 }, { x: 0, y: 80 }] }
      : { representation: "SQUARE", provenance: "SOURCE_BACKED_CORE", boundary: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }] };
    const b = bbox(spec.boundary);
    const folds = axialFolds(spec.boundary, false);
    const cut: PfcCutV1 = {
      cutId: "N1",
      kind: "BOUNDARY_NOTCH",
      center: { x: b.maxX, y: b.minY + (b.maxY - b.minY) * fraction(seed, "notch-y", 0.24, 0.76) },
      radius: 3.2,
    };
    const solved = solvePfcCutsV1(spec.boundary, folds, [cut]);
    if ((solved.cuts[0]?.mappedCuts ?? []).some((mark) => mark.originalContact !== "BOUNDARY")) throw new Error("Boundary notch lost boundary topology.");
    return { ...spec, folds, cuts: [cut], mode: "BOUNDARY_NOTCH_UNFOLD" };
  }
  const spec = boundarySpec(seed, qlId);
  if (qlId === "SPA-QL-035") {
    const repeated = hash32(`${seed}:repeated`) % 2 === 1;
    const folds = axialFolds(spec.boundary, repeated);
    return { ...spec, folds, cuts: safeInteriorCuts(spec.boundary, folds, 1, seed), mode: repeated ? "REPEATED_AXIAL_PUNCH" : "SINGLE_AXIAL_PUNCH" };
  }
  if (qlId === "SPA-QL-036") {
    const depth = hash32(`${seed}:depth`) % 2 === 0 ? 2 : 3;
    const folds = compoundFolds(spec.boundary, depth);
    return { ...spec, folds, cuts: safeInteriorCuts(spec.boundary, folds, 1, seed), mode: `COMPOUND_${depth}_FOLD_PUNCH` };
  }
  if (qlId === "SPA-QL-037") {
    const corner = hash32(`${seed}:corner`) % 2 === 1;
    const folds = diagonalOrCornerFold(spec.boundary, corner);
    return { ...spec, folds, cuts: safeInteriorCuts(spec.boundary, folds, 1, seed), mode: corner ? "CORNER_FOLD_PUNCH" : "DIAGONAL_FOLD_PUNCH" };
  }
  const folds = hash32(`${seed}:multi-fold`) % 2 === 0 ? axialFolds(spec.boundary, false) : compoundFolds(spec.boundary, 2);
  return { ...spec, folds, cuts: safeInteriorCuts(spec.boundary, folds, 2, seed), mode: "MULTIPLE_INTERIOR_CUTS" };
}

function marksFromSolution(solution: ReturnType<typeof solvePfcCutsV1>): DisplayMarkV1[] {
  return solution.cuts.flatMap((cut) => cut.mappedCuts.map((mark: PfcMappedCutV1) => ({
    x: mark.originalCenter.x,
    y: mark.originalCenter.y,
    kind: mark.kind,
    contact: mark.originalContact,
  })));
}

function centroid(boundary: readonly SpatialPoint[]): SpatialPoint {
  return {
    x: boundary.reduce((sum, point) => sum + point.x, 0) / boundary.length,
    y: boundary.reduce((sum, point) => sum + point.y, 0) / boundary.length,
  };
}

function extraMarks(boundary: readonly SpatialPoint[], template: DisplayMarkV1, existing: readonly DisplayMarkV1[], count: number): DisplayMarkV1[] {
  const result: DisplayMarkV1[] = [];
  const center = centroid(boundary);
  if (template.contact === "BOUNDARY") {
    const edgePoints = boundary.map((point, index) => {
      const next = boundary[(index + 1) % boundary.length]!;
      return { x: (point.x + next.x) / 2, y: (point.y + next.y) / 2 };
    });
    for (const point of edgePoints) {
      if ([...existing, ...result].every((other) => Math.hypot(other.x - point.x, other.y - point.y) > 8)) {
        result.push({ ...point, kind: template.kind, contact: "BOUNDARY" });
        if (result.length === count) break;
      }
    }
  } else {
    const interior = boundary.flatMap((vertex, index) => [0.25, 0.4].map((factor) => ({
      x: center.x + (vertex.x - center.x) * factor,
      y: center.y + (vertex.y - center.y) * factor + (index % 2 === 0 ? 1.3 : -1.3),
    })));
    for (const point of interior) {
      if (distanceToBoundary(point, boundary) < 7) continue;
      if ([...existing, ...result].every((other) => Math.hypot(other.x - point.x, other.y - point.y) > 8)) {
        result.push({ ...point, kind: template.kind, contact: "INTERIOR" });
        if (result.length === count) break;
      }
    }
  }
  if (result.length !== count) throw new Error("Unable to construct conceptually distinct distractor marks.");
  return result;
}

function conceptualDistractors(boundary: readonly SpatialPoint[], correct: readonly DisplayMarkV1[]): DisplayMarkV1[][] {
  if (!correct.length) throw new Error("Correct pattern has no marks.");
  const template = correct[0]!;
  const n = correct.length;
  const counts = [...new Set([Math.max(1, n - 1), n + 1, n + 2])];
  while (counts.length < 3) counts.push(counts[counts.length - 1]! + 1);
  return counts.slice(0, 3).map((targetCount) => {
    if (targetCount < n) return correct.slice(0, targetCount).map((mark) => ({ ...mark }));
    return [
      ...correct.map((mark) => ({ ...mark })),
      ...extraMarks(boundary, template, correct, targetCount - n),
    ];
  });
}

function polygonPoints(boundary: readonly SpatialPoint[]): string {
  return boundary.map((point) => `${point.x.toFixed(3)},${point.y.toFixed(3)}`).join(" ");
}

function renderMarks(marks: readonly DisplayMarkV1[]): string {
  return marks.map((mark) => mark.contact === "BOUNDARY"
    ? `<circle cx="${mark.x.toFixed(3)}" cy="${mark.y.toFixed(3)}" r="4.2" fill="white" data-cutout="transparent" stroke="#111" stroke-width="1.3"/>`
    : `<circle cx="${mark.x.toFixed(3)}" cy="${mark.y.toFixed(3)}" r="3.2" fill="none" data-cutout="transparent" stroke="#111" stroke-width="1.4"/>`).join("");
}

function renderUnfolded(boundary: readonly SpatialPoint[], marks: readonly DisplayMarkV1[], width = 150): string {
  const b = bbox(boundary);
  const margin = Math.max(b.maxX - b.minX, b.maxY - b.minY) * 0.12;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${b.minX - margin} ${b.minY - margin} ${b.maxX - b.minX + 2 * margin} ${b.maxY - b.minY + 2 * margin}" width="${width}" height="${width}" style="background:#fff" role="img"><polygon points="${polygonPoints(boundary)}" fill="white" stroke="#111" stroke-width="1.4"/>${renderMarks(marks)}</svg>`;
}

function renderFragments(fragments: readonly PfcLayerFragmentV1[]): string {
  return fragments.map((fragment) => `<polygon points="${polygonPoints(fragment.polygon)}" fill="white" fill-opacity="0.9" stroke="#555" stroke-width="1.1"/>`).join("");
}

function renderCutAtFolded(cut: PfcCutV1): string {
  return cut.kind === "BOUNDARY_NOTCH"
    ? `<circle cx="${cut.center.x.toFixed(3)}" cy="${cut.center.y.toFixed(3)}" r="4.2" fill="white" data-cutout="transparent" stroke="#111" stroke-width="1.4"/>`
    : `<circle cx="${cut.center.x.toFixed(3)}" cy="${cut.center.y.toFixed(3)}" r="3.2" fill="none" data-cutout="transparent" stroke="#111" stroke-width="1.5"/>`;
}

function renderForwardStimulus(scenario: PfcScenarioV1, panelSize = 145): string {
  let fragments = initialFragments(scenario.boundary);
  const panels: string[] = [];
  scenario.folds.forEach((fold, index) => {
    const points = allFragmentPoints(fragments);
    const b = bbox(points);
    const margin = Math.max(b.maxX - b.minX, b.maxY - b.minY) * 0.16;
    const clipId = `clip-${shortHash(`${scenario.mode}:${index}:${polygonPoints(points)}`)}`;
    const dx = fold.line.b.x - fold.line.a.x;
    const dy = fold.line.b.y - fold.line.a.y;
    const len = Math.max(1e-9, Math.hypot(dx, dy));
    const nx = -dy / len;
    const ny = dx / len;
    const mid = { x: (fold.line.a.x + fold.line.b.x) / 2, y: (fold.line.a.y + fold.line.b.y) / 2 };
    const sign = fold.movingSide === "POSITIVE" ? 1 : -1;
    const arrowStart = { x: mid.x + nx * sign * 20, y: mid.y + ny * sign * 20 };
    const markerId = `arr-${shortHash(`${scenario.mode}:${index}`)}`;
    panels.push(`<g transform="translate(${index * (panelSize + 12)},22)"><text x="${panelSize / 2}" y="-7" text-anchor="middle" font-family="Arial,sans-serif" font-size="12">Fold ${index + 1}</text><svg width="${panelSize}" height="${panelSize}" viewBox="${b.minX - margin} ${b.minY - margin} ${b.maxX - b.minX + 2 * margin} ${b.maxY - b.minY + 2 * margin}"><defs><clipPath id="${clipId}">${fragments.map((fragment) => `<polygon points="${polygonPoints(fragment.polygon)}"/>`).join("")}</clipPath><marker id="${markerId}" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="#111"/></marker></defs>${renderFragments(fragments)}<line x1="${fold.line.a.x}" y1="${fold.line.a.y}" x2="${fold.line.b.x}" y2="${fold.line.b.y}" stroke="#111" stroke-width="1.3" stroke-dasharray="4 3" clip-path="url(#${clipId})"/><line x1="${arrowStart.x}" y1="${arrowStart.y}" x2="${mid.x}" y2="${mid.y}" stroke="#111" stroke-width="1.4" marker-end="url(#${markerId})"/></svg></g>`);
    fragments = applyPfcFoldV1(fragments, fold);
  });
  const finalIndex = scenario.folds.length;
  const finalPoints = allFragmentPoints(fragments);
  const finalBox = bbox(finalPoints);
  const finalMargin = Math.max(finalBox.maxX - finalBox.minX, finalBox.maxY - finalBox.minY) * 0.16;
  panels.push(`<g transform="translate(${finalIndex * (panelSize + 12)},22)"><text x="${panelSize / 2}" y="-7" text-anchor="middle" font-family="Arial,sans-serif" font-size="12">Cut</text><svg width="${panelSize}" height="${panelSize}" viewBox="${finalBox.minX - finalMargin} ${finalBox.minY - finalMargin} ${finalBox.maxX - finalBox.minX + 2 * finalMargin} ${finalBox.maxY - finalBox.minY + 2 * finalMargin}">${renderFragments(fragments)}${scenario.cuts.map(renderCutAtFolded).join("")}</svg></g>`);
  const width = (scenario.folds.length + 1) * panelSize + scenario.folds.length * 12;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${panelSize + 30}" width="${width}" height="${panelSize + 30}" style="background:#fff" role="img">${panels.join("")}</svg>`;
}

function orderOptions(correctSvg: string, distractorSvgs: readonly string[], seed: string) {
  const correctIndex = (hash32(`${seed}:slot`) % 4) as 0 | 1 | 2 | 3;
  const options = [...distractorSvgs];
  options.splice(correctIndex, 0, correctSvg);
  return { options, correctIndex, answer: LETTERS[correctIndex] };
}

function shapeText(representation: string, language: PfcTpfStudioLanguageV1): string {
  const maps = {
    en: { SQUARE: "square", RECTANGLE: "rectangular", TRIANGLE: "triangular", REGULAR_HEXAGON: "hexagonal", REGULAR_PENTAGON: "pentagonal", REGULAR_OCTAGON: "octagonal" },
    hi: { SQUARE: "चौकोर", RECTANGLE: "आयताकार", TRIANGLE: "त्रिकोणाकार", REGULAR_HEXAGON: "षट्भुजाकार", REGULAR_PENTAGON: "पंचभुजाकार", REGULAR_OCTAGON: "अष्टभुजाकार" },
    pa: { SQUARE: "ਚੌਰਸ", RECTANGLE: "ਆਇਤਾਕਾਰ", TRIANGLE: "ਤਿਕੋਣੀ", REGULAR_HEXAGON: "ਛੇ-ਭੁਜੀ", REGULAR_PENTAGON: "ਪੰਜ-ਭੁਜੀ", REGULAR_OCTAGON: "ਅੱਠ-ਭੁਜੀ" },
  } as const;
  return (maps[language] as Record<string, string>)[representation] ?? (language === "en" ? "shown" : language === "hi" ? "दिखाए आकार वाले" : "ਦਿਖਾਏ ਆਕਾਰ ਵਾਲੇ");
}

function localizedQlName(qlId: PfcTpfStudioQlIdV1, language: PfcTpfStudioLanguageV1): string {
  if (language === "en") return QL_META[qlId].name;
  const hi: Record<PfcTpfStudioQlIdV1, string> = {
    "SPA-QL-035": "सीधे और बार-बार मोड़े कागज़ को खोलना",
    "SPA-QL-036": "कई दिशाओं और कई चरणों में मोड़े कागज़ को खोलना",
    "SPA-QL-037": "तिरछे और कोने से मोड़े कागज़ को खोलना",
    "SPA-QL-038": "कई कट और किनारे के कट वाला कागज़ खोलना",
    "SPA-QL-039": "खुले कागज़ से सही मोड़ और पंच पहचानना",
    "SPA-QL-040": "पारदर्शी कागज़ मोड़ने पर बनी संयुक्त आकृति",
  };
  const pa: Record<PfcTpfStudioQlIdV1, string> = {
    "SPA-QL-035": "ਸਿੱਧੇ ਅਤੇ ਵਾਰ-ਵਾਰ ਮੋੜੇ ਕਾਗਜ਼ ਨੂੰ ਖੋਲ੍ਹਣਾ",
    "SPA-QL-036": "ਕਈ ਦਿਸ਼ਾਵਾਂ ਅਤੇ ਕਈ ਪੜਾਵਾਂ ਵਿੱਚ ਮੋੜੇ ਕਾਗਜ਼ ਨੂੰ ਖੋਲ੍ਹਣਾ",
    "SPA-QL-037": "ਤਿਰਛੇ ਅਤੇ ਕੋਨੇ ਤੋਂ ਮੋੜੇ ਕਾਗਜ਼ ਨੂੰ ਖੋਲ੍ਹਣਾ",
    "SPA-QL-038": "ਕਈ ਕੱਟਾਂ ਅਤੇ ਕਿਨਾਰੇ ਵਾਲੇ ਕੱਟ ਨਾਲ ਕਾਗਜ਼ ਖੋਲ੍ਹਣਾ",
    "SPA-QL-039": "ਖੁੱਲ੍ਹੇ ਕਾਗਜ਼ ਤੋਂ ਸਹੀ ਮੋੜ ਅਤੇ ਪੰਚ ਪਛਾਣਨਾ",
    "SPA-QL-040": "ਪਾਰਦਰਸ਼ੀ ਕਾਗਜ਼ ਮੋੜਨ ਨਾਲ ਬਣੀ ਮਿਲੀ ਹੋਈ ਆਕ੍ਰਿਤੀ",
  };
  return language === "hi" ? hi[qlId] : pa[qlId];
}

function forwardText(qlId: PfcTpfStudioQlIdV1, representation: string, foldCount: number, answer: string, language: PfcTpfStudioLanguageV1): { stem: string; explanation: PfcTpfStudioExplanationV1 } {
  const shape = shapeText(representation, language);
  if (language === "hi") {
    return {
      stem: `${shape} कागज़ को चित्र के अनुसार मोड़कर काटा या छेदा गया है। पूरी तरह खोलने पर कौन-सा विकल्प सही है?`,
      explanation: {
        observation: `कागज़ ${foldCount} बार मोड़ा गया है। कट या छेद जिस परत से गुजरता है, खोलने पर उसी का सही प्रतिबिंब बनता है।`,
        rule: qlId === "SPA-QL-038" ? "हर कट को अलग खोलें। किनारे को छूने वाला कट खुलने पर भी संबंधित किनारे से जुड़ा रहता है।" : "सबसे आखिरी मोड़ पहले खोलें और हर मोड़ पर निशान को मोड़ रेखा के दूसरी तरफ समान दूरी पर रखें।",
        application: `चित्र में दिए मोड़ों को उलटे क्रम में खोलने पर विकल्प ${answer} वाली निशानों की बनावट मिलती है।`,
        check: `विकल्प ${answer} में निशानों की संख्या और उनकी जगह दोनों सही हैं।`,
      },
    };
  }
  if (language === "pa") {
    return {
      stem: `${shape} ਕਾਗਜ਼ ਨੂੰ ਚਿੱਤਰ ਅਨੁਸਾਰ ਮੋੜ ਕੇ ਕੱਟਿਆ ਜਾਂ ਛੇਦਿਆ ਗਿਆ ਹੈ। ਪੂਰੀ ਤਰ੍ਹਾਂ ਖੋਲ੍ਹਣ ਤੇ ਕਿਹੜਾ ਵਿਕਲਪ ਸਹੀ ਹੈ?`,
      explanation: {
        observation: `ਕਾਗਜ਼ ${foldCount} ਵਾਰ ਮੋੜਿਆ ਗਿਆ ਹੈ। ਕੱਟ ਜਾਂ ਛੇਦ ਜਿਹੜੀ ਪਰਤ ਵਿਚੋਂ ਲੰਘਦਾ ਹੈ, ਖੋਲ੍ਹਣ ਤੇ ਉਸ ਦੀ ਸਹੀ ਪਰਛਾਂਵ ਬਣਦੀ ਹੈ।`,
        rule: qlId === "SPA-QL-038" ? "ਹਰ ਕੱਟ ਨੂੰ ਵੱਖਰਾ ਖੋਲ੍ਹੋ। ਕਿਨਾਰੇ ਨੂੰ ਛੂਹਣ ਵਾਲਾ ਕੱਟ ਖੁੱਲ੍ਹਣ ਤੋਂ ਬਾਅਦ ਵੀ ਸੰਬੰਧਤ ਕਿਨਾਰੇ ਨਾਲ ਜੁੜਿਆ ਰਹਿੰਦਾ ਹੈ।" : "ਸਭ ਤੋਂ ਆਖਰੀ ਮੋੜ ਪਹਿਲਾਂ ਖੋਲ੍ਹੋ ਅਤੇ ਹਰ ਮੋੜ ਤੇ ਨਿਸ਼ਾਨ ਨੂੰ ਮੋੜ ਰੇਖਾ ਦੇ ਦੂਜੇ ਪਾਸੇ ਉੱਨੀ ਹੀ ਦੂਰੀ ਤੇ ਰੱਖੋ।",
        application: `ਚਿੱਤਰ ਵਾਲੇ ਮੋੜ ਉਲਟੇ ਕ੍ਰਮ ਵਿੱਚ ਖੋਲ੍ਹਣ ਤੇ ਵਿਕਲਪ ${answer} ਵਾਲੀ ਨਿਸ਼ਾਨਾਂ ਦੀ ਬਣਤਰ ਮਿਲਦੀ ਹੈ।`,
        check: `ਵਿਕਲਪ ${answer} ਵਿੱਚ ਨਿਸ਼ਾਨਾਂ ਦੀ ਗਿਣਤੀ ਅਤੇ ਥਾਂ ਦੋਵੇਂ ਸਹੀ ਹਨ।`,
      },
    };
  }
  return {
    stem: `The ${shape} paper is folded and cut or punched as shown. Which option is correct after it is fully unfolded?`,
    explanation: {
      observation: `The paper is folded ${foldCount} time${foldCount === 1 ? "" : "s"}. A cut passes through every folded layer that is present at its position.`,
      rule: qlId === "SPA-QL-038" ? "Unfold each cut separately. A cut made on the folded boundary must remain attached to the corresponding boundary after unfolding." : "Open the last fold first and reflect each mark across that fold line at the same distance.",
      application: `Undoing the shown folds produces exactly the mark pattern in option ${answer}.`,
      check: `Option ${answer} has both the correct number of marks and the correct positions.`,
    },
  };
}

function buildForwardQuestion(qlId: "SPA-QL-035" | "SPA-QL-036" | "SPA-QL-037" | "SPA-QL-038", seed: string, language: PfcTpfStudioLanguageV1) {
  const scenario = forwardScenario(qlId, seed);
  const solution = solvePfcCutsV1(scenario.boundary, scenario.folds, scenario.cuts);
  const correctMarks = marksFromSolution(solution);
  const distractorMarks = conceptualDistractors(scenario.boundary, correctMarks);
  const correctSvg = renderUnfolded(scenario.boundary, correctMarks);
  const distractorSvgs = distractorMarks.map((marks) => renderUnfolded(scenario.boundary, marks));
  const ordered = orderOptions(correctSvg, distractorSvgs, seed);
  const text = forwardText(qlId, scenario.representation, scenario.folds.length, ordered.answer, language);
  return {
    mode: scenario.mode,
    provenance: scenario.provenance,
    representation: scenario.representation,
    stem: text.stem,
    explanation: text.explanation,
    stimulusSvgs: [renderForwardStimulus(scenario)],
    optionSvgs: ordered.options,
    correctIndex: ordered.correctIndex,
    answer: ordered.answer,
    semanticFingerprint: solution.unfoldedFingerprint,
  };
}

function reverseScenarioFor(seed: string, boundary: readonly SpatialPoint[], folds: PfcFoldV1[], mode: string): PfcScenarioV1 {
  const spec = { representation: bbox(boundary).maxX - bbox(boundary).minX > bbox(boundary).maxY - bbox(boundary).minY ? "RECTANGLE" : "SQUARE", provenance: "SOURCE_BACKED_CORE" as const, boundary: boundary.map((point) => ({ ...point })) };
  return { ...spec, folds, cuts: safeInteriorCuts(boundary, folds, 1, `${seed}:${mode}`), mode };
}

function buildReverseQuestion(seed: string, language: PfcTpfStudioLanguageV1) {
  const spec = boundarySpec(seed, "SPA-QL-039");
  const targetDepth = hash32(`${seed}:target-depth`) % 2 === 0 ? 1 : 2;
  const targetFolds = targetDepth === 1 ? axialFolds(spec.boundary, false) : compoundFolds(spec.boundary, 2);
  const target = reverseScenarioFor(seed, spec.boundary, targetFolds, `TARGET_${targetDepth}_FOLD`);
  const targetSolution = solvePfcCutsV1(target.boundary, target.folds, target.cuts);
  const b = bbox(spec.boundary);
  const alternatives: PfcScenarioV1[] = targetDepth === 1
    ? [
        reverseScenarioFor(seed, spec.boundary, compoundFolds(spec.boundary, 2), "WRONG_EXTRA_FOLD"),
        reverseScenarioFor(seed, spec.boundary, diagonalOrCornerFold(spec.boundary, false), "WRONG_DIAGONAL_AXIS"),
        reverseScenarioFor(seed, spec.boundary, compoundFolds(spec.boundary, 3), "WRONG_THREE_FOLD_DEPTH"),
      ]
    : [
        reverseScenarioFor(seed, spec.boundary, axialFolds(spec.boundary, false), "WRONG_MISSING_FOLD"),
        reverseScenarioFor(seed, spec.boundary, [{ foldId: "F1", kind: "HORIZONTAL", line: { a: { x: b.minX - 80, y: (b.minY + b.maxY) / 2 }, b: { x: b.maxX + 80, y: (b.minY + b.maxY) / 2 } }, movingSide: "POSITIVE" }], "WRONG_HORIZONTAL_AXIS"),
        reverseScenarioFor(seed, spec.boundary, compoundFolds(spec.boundary, 3), "WRONG_THREE_FOLD_DEPTH"),
      ];
  const alternativeSolutions = alternatives.map((scenario) => solvePfcCutsV1(scenario.boundary, scenario.folds, scenario.cuts));
  if (alternativeSolutions.some((solution) => solution.unfoldedFingerprint === targetSolution.unfoldedFingerprint)) throw new Error("Reverse distractor accidentally matches the target unfolded pattern.");
  const ordered = orderOptions(renderForwardStimulus(target, 105), alternatives.map((scenario) => renderForwardStimulus(scenario, 105)), seed);
  const targetSvg = renderUnfolded(target.boundary, marksFromSolution(targetSolution), 240);
  const answer = ordered.answer;
  const text = language === "hi"
    ? {
        stem: "खुले हुए कागज़ की आकृति दी गई है। किस विकल्प में सही मोड़ और पंच प्रक्रिया है जिससे यही आकृति बनेगी?",
        explanation: { observation: "खुले कागज़ पर बने निशानों की संख्या और उनकी सममिति देखें।", rule: "हर विकल्प की मोड़-पंच प्रक्रिया को आगे की दिशा में सोचें और देखें कि खोलने पर वही लक्ष्य आकृति बनती है या नहीं।", application: `केवल विकल्प ${answer} की प्रक्रिया सभी लक्ष्य निशान सही जगह पर बनाती है।`, check: `विकल्प ${answer} में न तो कोई निशान कम है और न कोई अतिरिक्त निशान बनता है।` },
      }
    : language === "pa"
      ? {
          stem: "ਖੁੱਲ੍ਹੇ ਕਾਗਜ਼ ਦੀ ਆਕ੍ਰਿਤੀ ਦਿੱਤੀ ਗਈ ਹੈ। ਕਿਸ ਵਿਕਲਪ ਵਿੱਚ ਸਹੀ ਮੋੜ ਅਤੇ ਪੰਚ ਦੀ ਪ੍ਰਕਿਰਿਆ ਹੈ ਜਿਸ ਨਾਲ ਇਹੀ ਆਕ੍ਰਿਤੀ ਬਣੇਗੀ?",
          explanation: { observation: "ਖੁੱਲ੍ਹੇ ਕਾਗਜ਼ ਉੱਤੇ ਨਿਸ਼ਾਨਾਂ ਦੀ ਗਿਣਤੀ ਅਤੇ ਸਮਮਿਤੀ ਵੇਖੋ।", rule: "ਹਰ ਵਿਕਲਪ ਦੀ ਮੋੜ-ਪੰਚ ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਅੱਗੇ ਵੱਲ ਸੋਚੋ ਅਤੇ ਵੇਖੋ ਕਿ ਖੋਲ੍ਹਣ ਤੇ ਉਹੀ ਲਕਸ਼ ਆਕ੍ਰਿਤੀ ਬਣਦੀ ਹੈ ਜਾਂ ਨਹੀਂ।", application: `ਸਿਰਫ਼ ਵਿਕਲਪ ${answer} ਦੀ ਪ੍ਰਕਿਰਿਆ ਸਾਰੇ ਲਕਸ਼ ਨਿਸ਼ਾਨ ਸਹੀ ਥਾਂ ਬਣਾਉਂਦੀ ਹੈ।`, check: `ਵਿਕਲਪ ${answer} ਵਿੱਚ ਨਾ ਕੋਈ ਨਿਸ਼ਾਨ ਘੱਟ ਹੈ ਅਤੇ ਨਾ ਕੋਈ ਵਾਧੂ ਨਿਸ਼ਾਨ ਬਣਦਾ ਹੈ।` },
        }
      : {
          stem: "The unfolded paper pattern is shown. Which option gives the fold-and-punch process that produces exactly this pattern?",
          explanation: { observation: "Use the number and symmetry of the marks in the unfolded target as evidence.", rule: "Solve each candidate forward: apply its folds, make the punch, and unfold it completely.", application: `Only option ${answer} reproduces every target mark at the correct position.`, check: `Option ${answer} creates neither missing nor extra marks.`, },
        };
  return {
    mode: target.mode,
    provenance: "SOURCE_BACKED_CORE" as const,
    representation: target.representation,
    stem: text.stem,
    explanation: text.explanation,
    stimulusSvgs: [targetSvg],
    optionSvgs: ordered.options,
    correctIndex: ordered.correctIndex,
    answer,
    semanticFingerprint: targetSolution.unfoldedFingerprint,
  };
}

function tpfAtomicSegments(pattern: readonly TpfPatternPrimitiveWave2[]): Array<{ kind: "SEGMENT"; a: SpatialPoint; b: SpatialPoint }> {
  const result: Array<{ kind: "SEGMENT"; a: SpatialPoint; b: SpatialPoint }> = [];
  for (const primitive of pattern) {
    if (primitive.kind === "SEGMENT") result.push({ kind: "SEGMENT", a: primitive.a, b: primitive.b });
    else if (primitive.kind === "POLYLINE") {
      for (let index = 0; index < primitive.points.length - 1; index += 1) result.push({ kind: "SEGMENT", a: primitive.points[index]!, b: primitive.points[index + 1]! });
    } else if (primitive.kind === "POLYGON_OUTLINE") {
      for (let index = 0; index < primitive.vertices.length; index += 1) result.push({ kind: "SEGMENT", a: primitive.vertices[index]!, b: primitive.vertices[(index + 1) % primitive.vertices.length]! });
    }
  }
  return result;
}

function renderTpfOption(atomic: readonly any[], circles: readonly { center: SpatialPoint; radius: number }[], fold: PfcFoldV1, width = 150): string {
  const foldLine = `<line x1="${fold.line.a.x}" y1="${fold.line.a.y}" x2="${fold.line.b.x}" y2="${fold.line.b.y}" stroke="#999" stroke-width="1" stroke-dasharray="4 3"/>`;
  const primitives = atomic.map((primitive: any) => primitive.kind === "POINT_MARK"
    ? `<circle cx="${primitive.point.x}" cy="${primitive.point.y}" r="2.8" fill="#111"/>`
    : `<line x1="${primitive.a.x}" y1="${primitive.a.y}" x2="${primitive.b.x}" y2="${primitive.b.y}" stroke="#111" stroke-width="1.6"/>`).join("");
  const circleSvg = circles.map((circle) => `<circle cx="${circle.center.x}" cy="${circle.center.y}" r="${circle.radius}" fill="none" stroke="#111" stroke-width="1.5"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 120 120" width="${width}" height="${width}" style="background:#fff"><rect x="0" y="0" width="100" height="100" fill="white" stroke="#111" stroke-width="1.3"/>${foldLine}${primitives}${circleSvg}</svg>`;
}

function buildTransparentQuestion(seed: string, language: PfcTpfStudioLanguageV1) {
  const vertical = hash32(`${seed}:axis`) % 2 === 0;
  const fold: PfcFoldV1 = vertical
    ? { foldId: "F1", kind: "VERTICAL", line: { a: { x: 50, y: -20 }, b: { x: 50, y: 120 } }, movingSide: "POSITIVE" }
    : { foldId: "F1", kind: "HORIZONTAL", line: { a: { x: -20, y: 50 }, b: { x: 120, y: 50 } }, movingSide: "POSITIVE" };
  const delta = fraction(seed, "pattern-delta", -4, 4);
  const triangle = vertical
    ? [{ x: 18 + delta, y: 24 }, { x: 38 + delta, y: 34 }, { x: 18 + delta, y: 46 }]
    : [{ x: 24, y: 62 + delta }, { x: 34, y: 82 + delta }, { x: 46, y: 62 + delta }];
  const circleCenter = vertical ? { x: 74, y: 70 + delta } : { x: 72 + delta, y: 26 };
  const pattern: TpfPatternPrimitiveWave2[] = [
    { primitiveId: "TRI", kind: "POLYGON_OUTLINE", vertices: triangle },
    { primitiveId: "C1", kind: "CIRCLE_OUTLINE", center: circleCenter, radius: 5 },
  ];
  const scenario: TpfTransparentScenarioWave2 = { scenarioId: `TPF-STUDIO-${shortHash(seed)}`, sheetSize: 100, folds: [fold], pattern, sourceFamily: "SEEDED_TRANSPARENT_TRIANGLE_CIRCLE" };
  const solution = solveTransparentPatternFoldWave2(scenario);
  const triangleSegments = tpfAtomicSegments(pattern);
  const correctSvg = renderTpfOption(solution.atomicPrimitives, solution.circleOutlines, fold);
  const reflectedOnly = renderTpfOption(solution.atomicPrimitives, [], fold);
  const stationaryOnly = renderTpfOption([], solution.circleOutlines, fold);
  const originalUnfolded = renderTpfOption(triangleSegments, [{ center: circleCenter, radius: 5 }], fold);
  const ordered = orderOptions(correctSvg, [reflectedOnly, stationaryOnly, originalUnfolded], seed);
  const answer = ordered.answer;
  const stem = language === "hi"
    ? "पारदर्शी कागज़ पर बनी आकृतियों को दिखाए अनुसार मोड़ा गया है। मोड़ने के बाद सही संयुक्त आकृति कौन-सी होगी?"
    : language === "pa"
      ? "ਪਾਰਦਰਸ਼ੀ ਕਾਗਜ਼ ਉੱਤੇ ਬਣੀਆਂ ਆਕ੍ਰਿਤੀਆਂ ਨੂੰ ਦਿਖਾਏ ਅਨੁਸਾਰ ਮੋੜਿਆ ਗਿਆ ਹੈ। ਮੋੜਨ ਤੋਂ ਬਾਅਦ ਸਹੀ ਮਿਲੀ ਹੋਈ ਆਕ੍ਰਿਤੀ ਕਿਹੜੀ ਹੋਵੇਗੀ?"
      : "The transparent sheet carrying the shown line art is folded as indicated. Which option shows the correct superimposed pattern after folding?";
  const explanation: PfcTpfStudioExplanationV1 = language === "hi"
    ? { observation: "पारदर्शी कागज़ में पहले से बनी रेखाएँ और आकृतियाँ दोनों परतों से दिखाई देती हैं।", rule: "मोड़े गए हिस्से की आकृति को मोड़ रेखा के पार सही प्रतिबिंबित जगह पर ले जाएँ; स्थिर हिस्से की आकृति वहीं रहती है।", application: `दोनों दिखाई देने वाली आकृतियों को साथ रखने पर विकल्प ${answer} बनता है।`, check: `विकल्प ${answer} में न कोई पुरानी आकृति गायब है और न कोई अतिरिक्त आकृति जोड़ी गई है।` }
    : language === "pa"
      ? { observation: "ਪਾਰਦਰਸ਼ੀ ਕਾਗਜ਼ ਉੱਤੇ ਪਹਿਲਾਂ ਤੋਂ ਬਣੀਆਂ ਰੇਖਾਵਾਂ ਅਤੇ ਆਕ੍ਰਿਤੀਆਂ ਦੋਵੇਂ ਪਰਤਾਂ ਵਿਚੋਂ ਦਿਖਦੀਆਂ ਹਨ।", rule: "ਮੋੜੇ ਹਿੱਸੇ ਦੀ ਆਕ੍ਰਿਤੀ ਨੂੰ ਮੋੜ ਰੇਖਾ ਪਾਰ ਉਸ ਦੀ ਸਹੀ ਪਰਛਾਂਵ ਵਾਲੀ ਥਾਂ ਤੇ ਲਿਜਾਓ; ਅਡੋਲ ਹਿੱਸੇ ਦੀ ਆਕ੍ਰਿਤੀ ਆਪਣੀ ਥਾਂ ਰਹਿੰਦੀ ਹੈ।", application: `ਦੋਵੇਂ ਦਿਖਣ ਵਾਲੀਆਂ ਆਕ੍ਰਿਤੀਆਂ ਇਕੱਠੀਆਂ ਕਰਨ ਤੇ ਵਿਕਲਪ ${answer} ਬਣਦਾ ਹੈ।`, check: `ਵਿਕਲਪ ${answer} ਵਿੱਚ ਨਾ ਕੋਈ ਪੁਰਾਣੀ ਆਕ੍ਰਿਤੀ ਗਾਇਬ ਹੈ ਅਤੇ ਨਾ ਕੋਈ ਵਾਧੂ ਆਕ੍ਰਿਤੀ ਜੋੜੀ ਗਈ ਹੈ।` }
      : { observation: "On a transparent sheet, the existing line art on both layers remains visible after folding.", rule: "Reflect only the moving-side pattern across the fold line and keep the stationary-side pattern where it is.", application: `Combining the two visible layers gives option ${answer}.`, check: `Option ${answer} has neither a missing original element nor an extra invented element.` };
  const stimulus = renderTpfOption(triangleSegments, [{ center: circleCenter, radius: 5 }], fold, 280);
  return {
    mode: vertical ? "TRANSPARENT_VERTICAL_SUPERPOSITION" : "TRANSPARENT_HORIZONTAL_SUPERPOSITION",
    provenance: "SOURCE_BACKED_CORE" as const,
    representation: "TRANSPARENT_SQUARE_LINE_ART",
    stem,
    explanation,
    stimulusSvgs: [stimulus],
    optionSvgs: ordered.options,
    correctIndex: ordered.correctIndex,
    answer,
    semanticFingerprint: solution.fingerprint,
  };
}

export function isPfcTpfStudioQlIdV1(qlId: string): qlId is PfcTpfStudioQlIdV1 {
  return ["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038", "SPA-QL-039", "SPA-QL-040"].includes(qlId);
}

export function generatePfcTpfStudioQuestionV1(input: { qlId: PfcTpfStudioQlIdV1; seed: string; language?: PfcTpfStudioLanguageV1 }): PfcTpfStudioQuestionV1 {
  if (!PFC_TPF_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.governance.seededQuestionStudioIntegrationAuthorized) throw new Error("Localization freeze does not authorize seeded PFC/TPF Studio integration.");
  const seed = String(input.seed ?? "").trim();
  if (!seed) throw new Error("PFC/TPF Question Studio requires an explicit deterministic seed.");
  const language = input.language ?? "en";
  let generated: ReturnType<typeof buildForwardQuestion> | ReturnType<typeof buildReverseQuestion> | ReturnType<typeof buildTransparentQuestion> | null = null;
  let generationSeed = seed;
  for (let attempt = 0; attempt < 120 && !generated; attempt += 1) {
    generationSeed = `${seed}:${input.qlId}:A${attempt}`;
    try {
      generated = input.qlId === "SPA-QL-039"
        ? buildReverseQuestion(generationSeed, language)
        : input.qlId === "SPA-QL-040"
          ? buildTransparentQuestion(generationSeed, language)
          : buildForwardQuestion(input.qlId, generationSeed, language);
    } catch {
      generated = null;
    }
  }
  if (!generated) throw new Error(`${input.qlId}/${seed}: unable to synthesize a validated PFC/TPF Studio item.`);
  if (generated.optionSvgs.length !== 4 || new Set(generated.optionSvgs).size !== 4) throw new Error("PFC/TPF Studio option art is not unique.");
  const meta = QL_META[input.qlId];
  const geometrySignature = JSON.stringify({ qlId: input.qlId, mode: generated.mode, provenance: generated.provenance, representation: generated.representation, stimulusSvgs: generated.stimulusSvgs, optionSvgs: generated.optionSvgs, correctIndex: generated.correctIndex, semanticFingerprint: generated.semanticFingerprint });
  const contentFingerprint = `pfc-tpf-${shortHash(geometrySignature)}`;
  const anchors = generatePfcTpfPermanentEnglishQlV3(input.qlId);
  const anchor = anchors[hash32(`${generationSeed}:canonical-anchor`) % anchors.length]!;
  const locale = language === "hi" ? "hi-IN" as const : language === "pa" ? "pa-IN" as const : "en-IN" as const;
  return {
    version: "PFC-TPF-QUESTION-STUDIO-QUESTION-V1",
    packageId: "SPA-001",
    qlId: input.qlId,
    proposalId: meta.proposalId,
    chapterCode: meta.chapterCode,
    qlName: localizedQlName(input.qlId, language),
    language,
    locale,
    difficultyBand: meta.difficulty,
    seed,
    generationSeed,
    mode: generated.mode,
    provenance: generated.provenance,
    representation: generated.representation,
    stem: generated.stem,
    stimulusSvgs: generated.stimulusSvgs,
    optionSvgs: generated.optionSvgs,
    optionLabels: ["A", "B", "C", "D"],
    correctIndex: generated.correctIndex,
    answer: generated.answer,
    explanation: generated.explanation,
    questionId: `${input.qlId}:${contentFingerprint}`,
    canonicalItemId: `${input.qlId}:${contentFingerprint}`,
    canonicalAnchorId: anchor.canonicalQuestionId,
    questionLanguageId: `${input.qlId}:${language.toUpperCase()}:${contentFingerprint}`,
    contentFingerprint,
    renderer: { kind: "SVG", recommendedStimulusPixels: 620, recommendedOptionPixels: 150, mobileMinimumOptionPixels: 112 },
    localization: { authority: PFC_TPF_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.authorityId, canonicalLanguage: "en", targetLanguage: language, semanticParity: "GEOMETRY_AND_ANSWER_EXACT", sourceFreezeAuthority: PFC_TPF_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.authorityId },
    validation: { valid: true, exactSolverBacked: true, uniqueAnswer: true, optionArtUnique: true, spacingOnlyDistractorsAllowed: false, falsePyqAttribution: false },
    lifecycle: { reviewOnly: true, questionStudioDiscoverable: false, registrationStatus: "CANDIDATE_OPERATOR_REVIEW_REQUIRED", persistenceAllowed: false, questionBankStatus: "NOT_STORED", questionBankWritable: false, testEligible: false, publiclyPublishable: false, automaticStudentPublication: false },
  };
}

export function generatePfcTpfStudioBatchV1(request: { seed: string; count?: number; qlId?: PfcTpfStudioQlIdV1; language?: PfcTpfStudioLanguageV1 }) {
  const seed = String(request.seed ?? "").trim();
  if (!seed) throw new Error("PFC/TPF Studio batch generation requires an explicit seed.");
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 6) || 6)));
  const language = request.language ?? "en";
  const qls = request.qlId ? [request.qlId] : (["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038", "SPA-QL-039", "SPA-QL-040"] as const);
  const orderedQls = [...qls].sort((left, right) => hash32(`${seed}:${left}:order`) - hash32(`${seed}:${right}:order`));
  const questions: PfcTpfStudioQuestionV1[] = [];
  const seen = new Set<string>();
  for (let index = 0; index < count; index += 1) {
    const qlId = orderedQls[index % orderedQls.length]!;
    let accepted: PfcTpfStudioQuestionV1 | null = null;
    for (let retry = 0; retry < 80 && !accepted; retry += 1) {
      const question = generatePfcTpfStudioQuestionV1({ qlId, seed: `${seed}:${index}:R${retry}`, language });
      if (seen.has(question.contentFingerprint)) continue;
      seen.add(question.contentFingerprint);
      accepted = question;
    }
    if (!accepted) throw new Error(`${qlId}: unable to produce a unique PFC/TPF Studio batch item at index ${index}.`);
    questions.push(accepted);
  }
  return {
    generationContext: {
      packageId: "SPA-001" as const,
      generationDomain: "reasoning-v1" as const,
      seed,
      count,
      language,
      runtimeAuthority: PFC_TPF_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.authorityId,
      questionStudioDiscoverable: false as const,
      registrationStatus: "CANDIDATE_OPERATOR_REVIEW_REQUIRED" as const,
      persistenceAllowed: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
      reviewOnly: true as const,
    },
    questions,
  } as const;
}
