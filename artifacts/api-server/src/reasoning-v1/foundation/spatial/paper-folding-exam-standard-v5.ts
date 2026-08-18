import { applyAffineTransform } from "./geometry";
import {
  applyPfcFoldV1,
  clipPolygonToFoldSideV1,
  pointInPolygonInclusiveV1,
  pointOnPolygonBoundaryV1,
  type PfcFoldV1,
  type PfcLayerFragmentV1,
} from "./paper-folding-foundation-v1";
import {
  pfcDiscoveryOptionIsReadableV1,
  type PfcDiscoveryOptionV1,
  type PfcMisconceptionV1,
} from "./paper-folding-discovery-v1";
import {
  PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_2,
  generatePfcDiscoveryQuestionV4_2,
  type PfcDiscoveryQuestionV4_2,
} from "./paper-folding-visual-taxonomy-remediation-v4-2";
import type {
  PfcCutVisualKindV4,
  PfcVisualCutV4,
  PfcVisualImprintV4,
  PfcVisualOptionV4,
} from "./paper-folding-visual-taxonomy-remediation-v4";
import type { SpatialPoint } from "./types";

export const PFC_001_EXAM_STANDARD_AUTHORITY_V5 = Object.freeze({
  authorityId: "PFC-001-EXAM-STANDARD-V5" as const,
  chapterCode: "PFC-001" as const,
  semanticAuthority: PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_2.authorityId,
  coverageModeCount: 30,
  targetQuestions: 800,
  remediation: [
    "WHITE_EXAM_SURFACE",
    "PANEL_GEOMETRY_FIT_WITHOUT_OFF_CENTER_OVERLAP",
    "MOVING_SIDE_SHADE_BEHIND_PAPER_OUTLINE",
    "DASHED_CREASE_AND_DIRECTION_ARROW",
    "OPEN_MOUTH_V_NOTCH_WITH_BOUNDARY_ERASURE",
    "OPEN_MOUTH_ROUNDED_NOTCH_WITH_BOUNDARY_ERASURE",
    "ORIENTED_TRIANGLE_CUT_PROPAGATION",
    "ORIENTED_SLIT_PROPAGATION",
    "BLACK_EXAM_MARKS_FOR_INTERIOR_HOLES_AND_CUTS",
  ] as const,
  status: "EXAM_STANDARD_REVIEW_CANDIDATE" as const,
  questionStudioRegistered: false,
  automaticPublication: false,
} as const);

export interface PfcExamImprintV5 extends PfcVisualImprintV4 {
  visualDirection?: SpatialPoint;
}

export interface PfcExamOptionV5 extends Omit<PfcVisualOptionV4, "imprints"> {
  imprints: PfcExamImprintV5[];
}

export interface PfcExamQuestionV5 extends Omit<PfcDiscoveryQuestionV4_2, "options"> {
  options: PfcExamOptionV5[];
  examStandardAuthorityId: typeof PFC_001_EXAM_STANDARD_AUTHORITY_V5.authorityId;
}

const OPTION_IDS = ["A", "B", "C", "D"] as const;
const EPSILON = 1e-6;

function q(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function mapBack(point: SpatialPoint, fragment: PfcLayerFragmentV1): SpatialPoint {
  let mapped = { ...point };
  for (let index = fragment.transformHistory.length - 1; index >= 0; index -= 1) {
    mapped = applyAffineTransform(mapped, fragment.transformHistory[index]);
  }
  return mapped;
}

function directionProbe(visualKind: PfcCutVisualKindV4): SpatialPoint | null {
  if (visualKind === "TRIANGLE_CUT") return { x: 0, y: -1 };
  if (visualKind === "STRAIGHT_SLIT") return { x: 1, y: 0 };
  return null;
}

function mappedDirection(
  center: SpatialPoint,
  visualKind: PfcCutVisualKindV4,
  fragment: PfcLayerFragmentV1,
): SpatialPoint | undefined {
  const probe = directionProbe(visualKind);
  if (!probe) return undefined;
  const mappedCenter = mapBack(center, fragment);
  const mappedProbe = mapBack({ x: center.x + probe.x, y: center.y + probe.y }, fragment);
  const dx = mappedProbe.x - mappedCenter.x;
  const dy = mappedProbe.y - mappedCenter.y;
  const length = Math.hypot(dx, dy);
  if (length <= EPSILON) return undefined;
  return { x: q(dx / length), y: q(dy / length) };
}

function solveOrientedCuts(question: PfcDiscoveryQuestionV4_2): PfcExamImprintV5[] {
  let fragments: PfcLayerFragmentV1[] = [{
    fragmentId: "SHEET-ROOT",
    sourceSheetRegionId: "SHEET-ROOT",
    polygon: question.sheetBoundary.map((point) => ({ ...point })),
    transformHistory: [],
  }];
  for (const fold of question.folds) fragments = applyPfcFoldV1(fragments, fold);

  const imprints: PfcExamImprintV5[] = [];
  for (const cut of question.cuts) {
    const visualCut = cut as PfcVisualCutV4;
    const affected = fragments.filter((fragment) =>
      pointInPolygonInclusiveV1(visualCut.center, fragment.polygon),
    );
    if (affected.length === 0) throw new Error(`PFC V5 cut ${visualCut.cutId} misses folded material.`);
    const unique = new Map<string, PfcExamImprintV5>();
    for (const fragment of affected) {
      const originalCenter = mapBack(visualCut.center, fragment);
      const contact = pointOnPolygonBoundaryV1(originalCenter, question.sheetBoundary)
        ? "BOUNDARY" as const
        : "INTERIOR" as const;
      const visualDirection = mappedDirection(visualCut.center, visualCut.visualKind, fragment);
      const imprint: PfcExamImprintV5 = {
        x: q(originalCenter.x),
        y: q(originalCenter.y),
        kind: visualCut.kind,
        contact,
        visualKind: visualCut.visualKind,
        ...(visualDirection ? { visualDirection } : {}),
      };
      const directionKey = visualDirection ? `|${visualDirection.x},${visualDirection.y}` : "";
      const key = `${imprint.kind}|${imprint.visualKind}|${imprint.contact}|${imprint.x},${imprint.y}${directionKey}`;
      if (!unique.has(key)) unique.set(key, imprint);
    }
    imprints.push(...unique.values());
  }
  return imprints.sort((left, right) =>
    left.x - right.x || left.y - right.y || left.visualKind.localeCompare(right.visualKind),
  );
}

function imprintFingerprint(imprints: readonly PfcExamImprintV5[]): string {
  return imprints
    .map((imprint) => {
      const direction = imprint.visualDirection
        ? `|DIR:${q(imprint.visualDirection.x)},${q(imprint.visualDirection.y)}`
        : "";
      return `${imprint.kind}|${imprint.visualKind}|${imprint.contact}|${q(imprint.x)},${q(imprint.y)}${direction}`;
    })
    .sort()
    .join(";");
}

function clamp(value: number): number {
  return q(Math.min(94, Math.max(6, value)));
}

function shifted(correct: readonly PfcExamImprintV5[]): PfcExamImprintV5[] {
  return correct.map((imprint, index) => {
    if (imprint.contact === "BOUNDARY") {
      if (Math.abs(imprint.y) <= EPSILON || Math.abs(imprint.y - 100) <= EPSILON) {
        return { ...imprint, x: clamp(imprint.x + (index % 2 === 0 ? 7 : -7)) };
      }
      if (Math.abs(imprint.x) <= EPSILON || Math.abs(imprint.x - 100) <= EPSILON) {
        return { ...imprint, y: clamp(imprint.y + (index % 2 === 0 ? 7 : -7)) };
      }
    }
    return {
      ...imprint,
      x: clamp(imprint.x + (index % 2 === 0 ? 6 : -6)),
      y: clamp(imprint.y + (index % 2 === 0 ? -5 : 5)),
    };
  });
}

function buildOrientedOptions(
  correct: readonly PfcExamImprintV5[],
  variantIndex: number,
): { options: PfcExamOptionV5[]; correctOptionIndex: number } {
  const half = Math.max(1, Math.ceil(correct.length / 2));
  const first = correct[0];
  const extra: PfcExamImprintV5 = {
    x: 50,
    y: q(Math.min(92, Math.max(8, (first?.y ?? 50) + 16))),
    kind: first?.kind ?? "POINT_HOLE",
    contact: "INTERIOR",
    visualKind: first?.visualKind ?? "CIRCLE_HOLE",
    ...(first?.visualDirection ? { visualDirection: { ...first.visualDirection } } : {}),
  };
  const wrongOrientation = correct.map((imprint, index) =>
    imprint.visualDirection && index % 2 === 0
      ? {
          ...imprint,
          visualDirection: {
            x: q(-imprint.visualDirection.x),
            y: q(-imprint.visualDirection.y),
          },
        }
      : { ...imprint },
  );
  const candidates: Array<{ misconception: PfcMisconceptionV1; imprints: PfcExamImprintV5[] }> = [
    { misconception: "CORRECT", imprints: correct.map((imprint) => ({ ...imprint })) },
    { misconception: "INCOMPLETE_UNFOLD", imprints: correct.slice(0, half).map((imprint) => ({ ...imprint })) },
    { misconception: "WRONG_CUT_POSITION", imprints: shifted(correct) },
    { misconception: "EXTRA_IMPRINT", imprints: [...correct.map((imprint) => ({ ...imprint })), extra] },
    { misconception: "WRONG_CUT_POSITION", imprints: wrongOrientation },
  ];

  const selected: Array<{ misconception: PfcMisconceptionV1; imprints: PfcExamImprintV5[]; fingerprint: string }> = [];
  const seen = new Set<string>();
  for (const candidate of candidates) {
    const fingerprint = imprintFingerprint(candidate.imprints);
    if (!fingerprint || seen.has(fingerprint)) continue;
    const probe: PfcDiscoveryOptionV1 = {
      optionId: "A",
      misconception: candidate.misconception,
      imprints: candidate.imprints,
      fingerprint,
    };
    if (!pfcDiscoveryOptionIsReadableV1(probe)) continue;
    seen.add(fingerprint);
    selected.push({ ...candidate, fingerprint });
    if (selected.length === 4) break;
  }
  if (selected.length !== 4 || selected[0].misconception !== "CORRECT") {
    throw new Error(`PFC V5 option synthesis failed at variant ${variantIndex}.`);
  }

  const rotation = variantIndex % 4;
  const ordered = [...selected.slice(rotation), ...selected.slice(0, rotation)];
  const options = ordered.map<PfcExamOptionV5>((candidate, index) => ({
    optionId: OPTION_IDS[index],
    misconception: candidate.misconception,
    imprints: candidate.imprints,
    fingerprint: candidate.fingerprint,
  }));
  const correctOptionIndex = options.findIndex((option) => option.misconception === "CORRECT");
  return { options, correctOptionIndex };
}

function patchOrientedShapeQuestion(base: PfcDiscoveryQuestionV4_2): PfcExamQuestionV5 {
  const correct = solveOrientedCuts(base);
  const { options, correctOptionIndex } = buildOrientedOptions(correct, base.variantIndex);
  const correctOptionId = options[correctOptionIndex].optionId;
  const orientedFingerprint = imprintFingerprint(correct);
  return {
    ...base,
    options,
    correctOptionIndex,
    correctOptionId,
    unfoldedFingerprint: orientedFingerprint,
    semanticFingerprint: `${base.semanticFingerprint}::ORIENTED_SHAPE_IMPRINTS::${orientedFingerprint}`,
    explanation: base.coverageTags.includes("MIXED_HOLE_TRIANGLE_CUT")
      ? `The hole and triangular cut pass through the folded layers separately. Open the horizontal fold first and then the vertical fold. The circular holes copy to all matching positions, while the triangle also reverses its up/down orientation across the horizontal crease. The complete pattern is option ${correctOptionId}.`
      : `The triangular cut and slit pass through the same folded packet. Open the folds in reverse order. Their positions are reflected at each crease, and the triangle reverses orientation when reflected across the horizontal fold. The full cut pattern is option ${correctOptionId}.`,
    examStandardAuthorityId: PFC_001_EXAM_STANDARD_AUTHORITY_V5.authorityId,
  };
}

export function generatePfcExamQuestionV5(discoveryIndex: number): PfcExamQuestionV5 {
  const base = generatePfcDiscoveryQuestionV4_2(discoveryIndex);
  const orientedShapeMode = base.representationId === "PFC-PROT-08-MULTIPLE-CUTS" &&
    (base.coverageTags.includes("MIXED_HOLE_TRIANGLE_CUT") || base.coverageTags.includes("MIXED_TRIANGLE_SLIT"));
  if (orientedShapeMode) return patchOrientedShapeQuestion(base);
  return {
    ...base,
    options: base.options.map((option) => ({
      ...option,
      imprints: option.imprints.map((imprint) => ({ ...imprint })),
    })),
    examStandardAuthorityId: PFC_001_EXAM_STANDARD_AUTHORITY_V5.authorityId,
  };
}

export function generatePfcExamCorpusV5(): PfcExamQuestionV5[] {
  return Array.from({ length: 800 }, (_, index) => generatePfcExamQuestionV5(index));
}

function polygonPoints(points: readonly SpatialPoint[]): string {
  return points.map((point) => `${q(point.x)},${q(point.y)}`).join(" ");
}

function boundsForFragments(fragments: readonly PfcLayerFragmentV1[]) {
  const points = fragments.flatMap((fragment) => fragment.polygon);
  if (points.length === 0) return { minX: 0, maxX: 100, minY: 0, maxY: 100 };
  return {
    minX: Math.min(...points.map((point) => point.x)),
    maxX: Math.max(...points.map((point) => point.x)),
    minY: Math.min(...points.map((point) => point.y)),
    maxY: Math.max(...points.map((point) => point.y)),
  };
}

type Edge = "TOP" | "RIGHT" | "BOTTOM" | "LEFT" | null;

function edgeFor(center: SpatialPoint, bounds: ReturnType<typeof boundsForFragments>): Edge {
  const candidates = [
    { edge: "TOP" as const, distance: Math.abs(center.y - bounds.minY) },
    { edge: "RIGHT" as const, distance: Math.abs(center.x - bounds.maxX) },
    { edge: "BOTTOM" as const, distance: Math.abs(center.y - bounds.maxY) },
    { edge: "LEFT" as const, distance: Math.abs(center.x - bounds.minX) },
  ].sort((left, right) => left.distance - right.distance);
  return candidates[0].distance <= 0.8 ? candidates[0].edge : null;
}

function boundaryEraser(center: SpatialPoint, radius: number, edge: Edge): string {
  const r = Math.max(3, radius) + 1.6;
  if (edge === "TOP" || edge === "BOTTOM") {
    return `<line x1="${q(center.x - r)}" y1="${q(center.y)}" x2="${q(center.x + r)}" y2="${q(center.y)}" stroke="white" stroke-width="5.2" stroke-linecap="round"/>`;
  }
  if (edge === "LEFT" || edge === "RIGHT") {
    return `<line x1="${q(center.x)}" y1="${q(center.y - r)}" x2="${q(center.x)}" y2="${q(center.y + r)}" stroke="white" stroke-width="5.2" stroke-linecap="round"/>`;
  }
  return "";
}

function openVNotch(center: SpatialPoint, radius: number, edge: Edge): string {
  const r = Math.max(3, radius);
  if (!edge) {
    return `<polygon points="${q(center.x)},${q(center.y - r * 1.25)} ${q(center.x + r)},${q(center.y)} ${q(center.x)},${q(center.y + r * 1.25)} ${q(center.x - r)},${q(center.y)}" fill="black" stroke="black" stroke-width="1"/>`;
  }
  const erase = boundaryEraser(center, r, edge);
  if (edge === "TOP") return `${erase}<path d="M ${q(center.x - r)} ${q(center.y)} L ${q(center.x)} ${q(center.y + r * 1.45)} L ${q(center.x + r)} ${q(center.y)}" fill="none" stroke="black" stroke-width="1.8" stroke-linejoin="round"/>`;
  if (edge === "BOTTOM") return `${erase}<path d="M ${q(center.x - r)} ${q(center.y)} L ${q(center.x)} ${q(center.y - r * 1.45)} L ${q(center.x + r)} ${q(center.y)}" fill="none" stroke="black" stroke-width="1.8" stroke-linejoin="round"/>`;
  if (edge === "LEFT") return `${erase}<path d="M ${q(center.x)} ${q(center.y - r)} L ${q(center.x + r * 1.45)} ${q(center.y)} L ${q(center.x)} ${q(center.y + r)}" fill="none" stroke="black" stroke-width="1.8" stroke-linejoin="round"/>`;
  return `${erase}<path d="M ${q(center.x)} ${q(center.y - r)} L ${q(center.x - r * 1.45)} ${q(center.y)} L ${q(center.x)} ${q(center.y + r)}" fill="none" stroke="black" stroke-width="1.8" stroke-linejoin="round"/>`;
}

function openRoundedNotch(center: SpatialPoint, radius: number, edge: Edge): string {
  const r = Math.max(3, radius);
  if (!edge) {
    return `<circle cx="${q(center.x)}" cy="${q(center.y)}" r="${q(r)}" fill="black"/>`;
  }
  const erase = boundaryEraser(center, r, edge);
  if (edge === "TOP") return `${erase}<path d="M ${q(center.x - r)} ${q(center.y)} Q ${q(center.x)} ${q(center.y + r * 1.9)} ${q(center.x + r)} ${q(center.y)}" fill="none" stroke="black" stroke-width="1.8"/>`;
  if (edge === "BOTTOM") return `${erase}<path d="M ${q(center.x - r)} ${q(center.y)} Q ${q(center.x)} ${q(center.y - r * 1.9)} ${q(center.x + r)} ${q(center.y)}" fill="none" stroke="black" stroke-width="1.8"/>`;
  if (edge === "LEFT") return `${erase}<path d="M ${q(center.x)} ${q(center.y - r)} Q ${q(center.x + r * 1.9)} ${q(center.y)} ${q(center.x)} ${q(center.y + r)}" fill="none" stroke="black" stroke-width="1.8"/>`;
  return `${erase}<path d="M ${q(center.x)} ${q(center.y - r)} Q ${q(center.x - r * 1.9)} ${q(center.y)} ${q(center.x)} ${q(center.y + r)}" fill="none" stroke="black" stroke-width="1.8"/>`;
}

function normalizedDirection(direction: SpatialPoint | undefined, fallback: SpatialPoint): SpatialPoint {
  const source = direction ?? fallback;
  const length = Math.hypot(source.x, source.y);
  return length <= EPSILON ? fallback : { x: source.x / length, y: source.y / length };
}

function triangleMark(center: SpatialPoint, radius: number, direction?: SpatialPoint): string {
  const r = Math.max(3, radius);
  const d = normalizedDirection(direction, { x: 0, y: -1 });
  const p = { x: -d.y, y: d.x };
  const apex = { x: center.x + d.x * r * 1.25, y: center.y + d.y * r * 1.25 };
  const base = { x: center.x - d.x * r * 0.75, y: center.y - d.y * r * 0.75 };
  const left = { x: base.x + p.x * r, y: base.y + p.y * r };
  const right = { x: base.x - p.x * r, y: base.y - p.y * r };
  return `<polygon points="${q(apex.x)},${q(apex.y)} ${q(left.x)},${q(left.y)} ${q(right.x)},${q(right.y)}" fill="black"/>`;
}

function slitMark(center: SpatialPoint, radius: number, direction?: SpatialPoint): string {
  const r = Math.max(3.6, radius);
  const d = normalizedDirection(direction, { x: 1, y: 0 });
  return `<line x1="${q(center.x - d.x * r * 1.45)}" y1="${q(center.y - d.y * r * 1.45)}" x2="${q(center.x + d.x * r * 1.45)}" y2="${q(center.y + d.y * r * 1.45)}" stroke="black" stroke-width="2.3" stroke-linecap="round"/>`;
}

function renderMark(
  center: SpatialPoint,
  visualKind: PfcCutVisualKindV4,
  radius: number,
  edge: Edge,
  direction?: SpatialPoint,
): string {
  if (visualKind === "CIRCLE_HOLE") {
    return `<circle cx="${q(center.x)}" cy="${q(center.y)}" r="${q(Math.max(2.7, radius))}" fill="black"/>`;
  }
  if (visualKind === "V_NOTCH") return openVNotch(center, radius, edge);
  if (visualKind === "SEMICIRCLE_NOTCH") return openRoundedNotch(center, radius, edge);
  if (visualKind === "TRIANGLE_CUT") return triangleMark(center, radius, direction);
  return slitMark(center, radius, direction);
}

function foldArrow(fold: PfcFoldV1, markerId: string): string {
  const dx = fold.line.b.x - fold.line.a.x;
  const dy = fold.line.b.y - fold.line.a.y;
  const length = Math.hypot(dx, dy);
  if (length <= EPSILON) return "";
  const nx = -dy / length;
  const ny = dx / length;
  const sign = fold.movingSide === "POSITIVE" ? 1 : -1;
  const anchorT = fold.kind === "DIAGONAL" || fold.kind === "CORNER" ? 0.58 : 0.38;
  const anchor = { x: fold.line.a.x + dx * anchorT, y: fold.line.a.y + dy * anchorT };
  const start = { x: anchor.x + nx * sign * 22, y: anchor.y + ny * sign * 22 };
  const end = { x: anchor.x - nx * sign * 6, y: anchor.y - ny * sign * 6 };
  return `<line x1="${q(start.x)}" y1="${q(start.y)}" x2="${q(end.x)}" y2="${q(end.y)}" stroke="black" stroke-width="2.4" marker-end="url(#${markerId})"/>`;
}

function fitTransform(fragments: readonly PfcLayerFragmentV1[]): string {
  const bounds = boundsForFragments(fragments);
  const width = Math.max(1, bounds.maxX - bounds.minX);
  const height = Math.max(1, bounds.maxY - bounds.minY);
  const scale = Math.min(0.9, 90 / width, 90 / height);
  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerY = (bounds.minY + bounds.maxY) / 2;
  const tx = 60 - centerX * scale;
  const ty = 70 - centerY * scale;
  return `translate(${q(tx)} ${q(ty)}) scale(${q(scale)})`;
}

function fragmentOutlines(fragments: readonly PfcLayerFragmentV1[]): string {
  return fragments.map((fragment) =>
    `<polygon points="${polygonPoints(fragment.polygon)}" fill="white" fill-opacity="0.01" stroke="black" stroke-width="1.55"/>`,
  ).join("");
}

function movingShade(fragments: readonly PfcLayerFragmentV1[], fold: PfcFoldV1): string {
  return fragments
    .map((fragment) => clipPolygonToFoldSideV1(fragment.polygon, fold.line, fold.movingSide))
    .filter((polygon) => polygon.length >= 3)
    .map((polygon) => `<polygon points="${polygonPoints(polygon)}" fill="#d9d9d9" fill-opacity="0.55" stroke="none"/>`)
    .join("");
}

export function renderPfcExamStimulusSvgV5(question: PfcExamQuestionV5, size = 680): string {
  let fragments: PfcLayerFragmentV1[] = [{
    fragmentId: "SHEET-ROOT",
    sourceSheetRegionId: "SHEET-ROOT",
    polygon: question.sheetBoundary.map((point) => ({ ...point })),
    transformHistory: [],
  }];
  const panelWidth = 128;
  const panelCount = question.folds.length + 1;
  const markerId = `pfc-v5-arrow-${question.questionId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const panels: string[] = [];

  question.folds.forEach((fold, index) => {
    const x = 4 + index * panelWidth;
    const transform = fitTransform(fragments);
    panels.push(`<g transform="translate(${x},0)"><text x="60" y="11" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" font-weight="700">Fold ${index + 1}</text><g transform="${transform}">${movingShade(fragments, fold)}${fragmentOutlines(fragments)}<line x1="${q(fold.line.a.x)}" y1="${q(fold.line.a.y)}" x2="${q(fold.line.b.x)}" y2="${q(fold.line.b.y)}" stroke="black" stroke-width="1.25" stroke-dasharray="4 3"/>${foldArrow(fold, markerId)}</g></g>`);
    fragments = applyPfcFoldV1(fragments, fold);
  });

  const finalX = 4 + question.folds.length * panelWidth;
  const finalTransform = fitTransform(fragments);
  const finalBounds = boundsForFragments(fragments);
  const cuts = question.cuts.map((cut) => {
    const visualCut = cut as PfcVisualCutV4;
    return renderMark(visualCut.center, visualCut.visualKind, visualCut.radius, edgeFor(visualCut.center, finalBounds));
  }).join("");
  panels.push(`<g transform="translate(${finalX},0)"><text x="60" y="11" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" font-weight="700">Cut / Punch</text><g transform="${finalTransform}">${fragmentOutlines(fragments)}${cuts}</g></g>`);

  const separators = Array.from({ length: panelCount - 1 }, (_, index) =>
    `<text x="${4 + (index + 1) * panelWidth - 8}" y="72" font-family="Arial,sans-serif" font-size="17">→</text>`,
  ).join("");
  const viewWidth = 8 + panelCount * panelWidth;
  const viewHeight = 126;
  const scale = size / Math.max(viewWidth, viewHeight);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(viewWidth * scale)}" height="${Math.round(viewHeight * scale)}" viewBox="0 0 ${viewWidth} ${viewHeight}" role="img" aria-label="Paper folding and cutting sequence"><defs><marker id="${markerId}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="black"/></marker></defs><rect width="100%" height="100%" fill="white"/>${panels.join("")}${separators}</svg>`;
}

export function renderPfcExamOptionSvgV5(option: PfcExamOptionV5, size = 132): string {
  const marks = option.imprints.map((imprint) => {
    let edge: Edge = null;
    if (imprint.contact === "BOUNDARY") {
      if (Math.abs(imprint.y) <= EPSILON) edge = "TOP";
      else if (Math.abs(imprint.x - 100) <= EPSILON) edge = "RIGHT";
      else if (Math.abs(imprint.y - 100) <= EPSILON) edge = "BOTTOM";
      else if (Math.abs(imprint.x) <= EPSILON) edge = "LEFT";
    }
    return renderMark(
      { x: imprint.x, y: imprint.y },
      imprint.visualKind,
      imprint.visualKind === "STRAIGHT_SLIT" ? 3.8 : 3.2,
      edge,
      imprint.visualDirection,
    );
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="-8 -8 116 116" role="img" aria-label="Unfolded paper option"><rect x="-8" y="-8" width="116" height="116" fill="white"/><rect x="0" y="0" width="100" height="100" fill="white" stroke="black" stroke-width="2"/>${marks}</svg>`;
}

export function renderPfcExamReviewHtmlV5(questions: readonly PfcExamQuestionV5[]): string {
  const cards = questions.map((question) => `<article style="border-top:1px solid #999;padding:22px 0 26px;margin:0;background:#fff"><h2 style="font-size:17px;margin:0 0 5px">${question.questionId} · ${question.representationId}</h2><p style="margin:3px 0 9px;font-size:13px">${question.difficulty} · ${question.representationTitle} · <strong>${question.coverageTags.join(", ")}</strong></p><p style="margin:8px 0 12px"><strong>Question:</strong> A square paper is folded in the arrow direction and cut or punched as shown. Which option shows the paper after it is fully unfolded?</p><div style="overflow:auto;background:#fff">${renderPfcExamStimulusSvgV5(question, 680)}</div><div style="display:grid;grid-template-columns:repeat(4,minmax(132px,1fr));gap:20px;margin:18px 0 8px">${question.options.map((option) => `<div style="text-align:center;background:#fff"><strong>${option.optionId}</strong><div>${renderPfcExamOptionSvgV5(option, 132)}</div></div>`).join("")}</div><p style="margin:10px 0 4px"><strong>Answer:</strong> ${question.correctOptionId}</p><p style="margin:4px 0"><strong>Explanation:</strong> ${question.explanation}</p></article>`).join("\n");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PFC-001 Exam Standard Review V5</title></head><body style="font-family:Arial,sans-serif;background:#fff;color:#111;max-width:1140px;margin:0 auto;padding:22px"><h1 style="font-size:24px">PFC-001 Exam Standard Review V5</h1><p>White exam-style review. Each panel fits the actual folded packet, shows the moving side behind the paper outline, and uses an explicit crease and fold arrow. Boundary notches are open cut-outs without a closing chord. Oriented cuts retain their reflected orientation after unfolding.</p>${cards}</body></html>`;
}
