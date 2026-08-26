import { applyAffineTransform } from "./geometry";
import {
  applyPfcFoldV1,
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
  PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_1,
  generatePfcDiscoveryQuestionV4_1,
  renderPfcDiscoveryOptionSvgV4,
  renderPfcDiscoveryReviewHtmlV4,
  renderPfcDiscoveryStimulusSvgV4,
  type PfcDiscoveryQuestionV4_1,
} from "./paper-folding-visual-taxonomy-remediation-v4-1";
import type {
  PfcCutVisualKindV4,
  PfcVisualCutV4,
  PfcVisualImprintV4,
  PfcVisualOptionV4,
} from "./paper-folding-visual-taxonomy-remediation-v4";
import type { SpatialPoint } from "./types";

export const PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_2 = Object.freeze({
  ...PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_1,
  authorityId: "PFC-001-VISUAL-TAXONOMY-REMEDIATION-V4.2" as const,
  supersedesAuthority: PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_1.authorityId,
  executableCoverageModeCount: 30,
  fix: "FULL_800_SEMANTIC_DIVERSITY_FOR_CORNER_DIAGONAL_MIXED_AXIS_AND_MULTI_FOLD_NOTCH_FAMILIES" as const,
  status: "REMEDIATED_REVIEW_CANDIDATE" as const,
} as const);

export type PfcDiscoveryQuestionV4_2 = PfcDiscoveryQuestionV4_1 & {
  remediationDiversityAuthorityId: typeof PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_2.authorityId;
};

const OPTION_IDS = ["A", "B", "C", "D"] as const;
const EPSILON = 1e-6;

function q(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function reflectionHistoryPoint(point: SpatialPoint, fragment: PfcLayerFragmentV1): SpatialPoint {
  let mapped = { ...point };
  for (let index = fragment.transformHistory.length - 1; index >= 0; index -= 1) {
    mapped = applyAffineTransform(mapped, fragment.transformHistory[index]);
  }
  return mapped;
}

function finalFragments(sheetBoundary: readonly SpatialPoint[], folds: readonly PfcFoldV1[]): PfcLayerFragmentV1[] {
  let fragments: PfcLayerFragmentV1[] = [{
    fragmentId: "SHEET-ROOT",
    sourceSheetRegionId: "SHEET-ROOT",
    polygon: sheetBoundary.map((point) => ({ ...point })),
    transformHistory: [],
  }];
  for (const fold of folds) fragments = applyPfcFoldV1(fragments, fold);
  return fragments;
}

function foldedLayerCounts(sheetBoundary: readonly SpatialPoint[], folds: readonly PfcFoldV1[]): number[] {
  let fragments: PfcLayerFragmentV1[] = [{
    fragmentId: "SHEET-ROOT",
    sourceSheetRegionId: "SHEET-ROOT",
    polygon: sheetBoundary.map((point) => ({ ...point })),
    transformHistory: [],
  }];
  const counts: number[] = [];
  for (const fold of folds) {
    fragments = applyPfcFoldV1(fragments, fold);
    counts.push(fragments.length);
  }
  return counts;
}

function solveSingleCut(
  sheetBoundary: readonly SpatialPoint[],
  folds: readonly PfcFoldV1[],
  cut: PfcVisualCutV4,
): { imprints: PfcVisualImprintV4[]; affectedLayerCount: number } {
  const fragments = finalFragments(sheetBoundary, folds);
  const affected = fragments.filter((fragment) =>
    pointInPolygonInclusiveV1(cut.center, fragment.polygon),
  );
  if (affected.length === 0) throw new Error(`PFC V4.2 cut ${cut.cutId} misses folded material.`);

  const unique = new Map<string, PfcVisualImprintV4>();
  for (const fragment of affected) {
    const originalCenter = reflectionHistoryPoint(cut.center, fragment);
    const contact = pointOnPolygonBoundaryV1(originalCenter, sheetBoundary)
      ? "BOUNDARY" as const
      : "INTERIOR" as const;
    const imprint: PfcVisualImprintV4 = {
      x: q(originalCenter.x),
      y: q(originalCenter.y),
      kind: cut.kind,
      contact,
      visualKind: cut.visualKind,
    };
    const key = `${imprint.kind}|${imprint.visualKind}|${imprint.contact}|${imprint.x},${imprint.y}`;
    if (!unique.has(key)) unique.set(key, imprint);
  }
  return {
    imprints: [...unique.values()].sort((left, right) => left.x - right.x || left.y - right.y),
    affectedLayerCount: affected.length,
  };
}

function imprintFingerprint(imprints: readonly PfcVisualImprintV4[]): string {
  return imprints
    .map((imprint) => `${imprint.kind}|${imprint.visualKind}|${imprint.contact}|${q(imprint.x)},${q(imprint.y)}`)
    .sort()
    .join(";");
}

function clamp(value: number): number {
  return q(Math.min(94, Math.max(6, value)));
}

function shifted(correct: readonly PfcVisualImprintV4[]): PfcVisualImprintV4[] {
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

function buildOptions(
  correct: readonly PfcVisualImprintV4[],
  variantIndex: number,
): { options: PfcVisualOptionV4[]; correctOptionIndex: number } {
  const half = Math.max(1, Math.ceil(correct.length / 2));
  const first = correct[0];
  const extra: PfcVisualImprintV4 = {
    x: 50,
    y: q(Math.min(92, Math.max(8, (first?.y ?? 50) + 16))),
    kind: first?.kind ?? "POINT_HOLE",
    contact: "INTERIOR",
    visualKind: first?.visualKind ?? "CIRCLE_HOLE",
  };
  const boundaryAsInterior = correct.map((imprint) =>
    imprint.contact === "BOUNDARY"
      ? {
          ...imprint,
          contact: "INTERIOR" as const,
          x: Math.abs(imprint.x) <= EPSILON ? 7 : imprint.x,
          y: Math.abs(imprint.y) <= EPSILON ? 7 : imprint.y,
        }
      : { ...imprint },
  );
  const candidates: Array<{ misconception: PfcMisconceptionV1; imprints: PfcVisualImprintV4[] }> = [
    { misconception: "CORRECT", imprints: correct.map((imprint) => ({ ...imprint })) },
    { misconception: "INCOMPLETE_UNFOLD", imprints: correct.slice(0, half).map((imprint) => ({ ...imprint })) },
    { misconception: "WRONG_CUT_POSITION", imprints: shifted(correct) },
    { misconception: "EXTRA_IMPRINT", imprints: [...correct.map((imprint) => ({ ...imprint })), extra] },
    { misconception: "EDGE_TREATED_AS_INTERIOR", imprints: boundaryAsInterior },
  ];

  const selected: Array<{ misconception: PfcMisconceptionV1; imprints: PfcVisualImprintV4[]; fingerprint: string }> = [];
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
    throw new Error(`PFC V4.2 option synthesis failed at variant ${variantIndex}.`);
  }

  const rotation = variantIndex % 4;
  const ordered = [...selected.slice(rotation), ...selected.slice(0, rotation)];
  const options = ordered.map<PfcVisualOptionV4>((candidate, index) => ({
    optionId: OPTION_IDS[index],
    misconception: candidate.misconception,
    imprints: candidate.imprints,
    fingerprint: candidate.fingerprint,
  }));
  const correctOptionIndex = options.findIndex((option) => option.misconception === "CORRECT");
  return { options, correctOptionIndex };
}

function foldFingerprint(folds: readonly PfcFoldV1[]): string {
  return folds.map((fold) =>
    `${fold.kind}:${q(fold.line.a.x)},${q(fold.line.a.y)}>${q(fold.line.b.x)},${q(fold.line.b.y)}:${fold.movingSide}`,
  ).join("|");
}

function patchedQuestion(
  discoveryIndex: number,
  folds: PfcFoldV1[],
  cut: PfcVisualCutV4,
  coverageTag: string,
  explanationText: (answer: string, markCount: number, affectedLayerCount: number) => string,
): PfcDiscoveryQuestionV4_2 {
  const base = generatePfcDiscoveryQuestionV4_1(discoveryIndex);
  const solved = solveSingleCut(base.sheetBoundary, folds, cut);
  const { options, correctOptionIndex } = buildOptions(solved.imprints, base.variantIndex);
  const correctOptionId = options[correctOptionIndex].optionId;
  const unfoldedFingerprint = imprintFingerprint(solved.imprints);
  return {
    ...base,
    folds,
    cuts: [cut],
    foldedLayerCounts: foldedLayerCounts(base.sheetBoundary, folds),
    unfoldedFingerprint,
    options,
    correctOptionIndex,
    correctOptionId,
    explanation: explanationText(correctOptionId, solved.imprints.length, solved.affectedLayerCount),
    semanticFingerprint: `${base.representationId}::${coverageTag}::${foldFingerprint(folds)}::${cut.kind}:${cut.visualKind}:${q(cut.center.x)},${q(cut.center.y)}::${unfoldedFingerprint}`,
    coverageTags: [coverageTag],
    remediationDiversityAuthorityId: PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_2.authorityId,
  };
}

function circleCut(center: SpatialPoint): PfcVisualCutV4 {
  return {
    cutId: "C1",
    kind: "POINT_HOLE",
    center,
    radius: 2.2,
    visualKind: "CIRCLE_HOLE",
  };
}

function cornerQuestion(discoveryIndex: number): PfcDiscoveryQuestionV4_2 {
  const u = discoveryIndex % 80;
  const mode = u % 4;
  const k = Math.floor(u / 4);
  const a = (k % 5) * 2;
  const b = Math.floor(k / 5) * 2;
  const cases = [
    {
      tag: "CORNER_TOP_LEFT",
      fold: { foldId: "F1", kind: "CORNER" as const, line: { a: { x: 0, y: 50 }, b: { x: 50, y: 0 } }, movingSide: "NEGATIVE" as const },
      center: { x: 28 + a, y: 28 + b },
    },
    {
      tag: "CORNER_TOP_RIGHT",
      fold: { foldId: "F1", kind: "CORNER" as const, line: { a: { x: 50, y: 0 }, b: { x: 100, y: 50 } }, movingSide: "NEGATIVE" as const },
      center: { x: 72 - a, y: 28 + b },
    },
    {
      tag: "CORNER_BOTTOM_RIGHT",
      fold: { foldId: "F1", kind: "CORNER" as const, line: { a: { x: 100, y: 50 }, b: { x: 50, y: 100 } }, movingSide: "NEGATIVE" as const },
      center: { x: 72 - a, y: 72 - b },
    },
    {
      tag: "CORNER_BOTTOM_LEFT",
      fold: { foldId: "F1", kind: "CORNER" as const, line: { a: { x: 50, y: 100 }, b: { x: 0, y: 50 } }, movingSide: "NEGATIVE" as const },
      center: { x: 28 + a, y: 72 - b },
    },
  ] as const;
  const selected = cases[mode];
  return patchedQuestion(
    discoveryIndex,
    [selected.fold],
    circleCut(selected.center),
    selected.tag,
    (answer) => `Only the folded corner overlaps the sheet at the punch. Opening the corner reflects the hole across the sloping crease and creates one matching partner. The correct pair is shown in option ${answer}.`,
  );
}

function diagonalQuestion(discoveryIndex: number): PfcDiscoveryQuestionV4_2 {
  const u = discoveryIndex % 80;
  const k = Math.floor(u / 2);
  const a = (k % 10) * 2;
  const b = Math.floor(k / 10) * 6;
  if (u % 2 === 0) {
    const fold: PfcFoldV1 = {
      foldId: "F1",
      kind: "DIAGONAL",
      line: { a: { x: 0, y: 0 }, b: { x: 100, y: 100 } },
      movingSide: "POSITIVE",
    };
    return patchedQuestion(
      discoveryIndex,
      [fold],
      circleCut({ x: 62 + a, y: 12 + b }),
      "DIAGONAL_MAIN",
      (answer) => `The paper is folded across the main diagonal. Opening it reflects the punched hole to the same perpendicular distance on the other side of that diagonal. The mirror pair is option ${answer}.`,
    );
  }
  const fold: PfcFoldV1 = {
    foldId: "F1",
    kind: "DIAGONAL",
    line: { a: { x: 100, y: 0 }, b: { x: 0, y: 100 } },
    movingSide: "POSITIVE",
  };
  return patchedQuestion(
    discoveryIndex,
    [fold],
    circleCut({ x: 62 + a, y: 62 + b }),
    "DIAGONAL_ANTI",
    (answer) => `The paper is folded across the opposite diagonal. Opening it places a matching hole at the reflected position across that crease. The correct diagonal pair is option ${answer}.`,
  );
}

function mixedAxisQuestion(discoveryIndex: number): PfcDiscoveryQuestionV4_2 {
  const u = discoveryIndex % 80;
  const k = Math.floor(u / 2);
  const center = { x: q(30 + (k % 10) * 1.4), y: 7 + Math.floor(k / 10) * 4 };
  if (u % 2 === 0) {
    const folds: PfcFoldV1[] = [
      { foldId: "F1", kind: "VERTICAL", line: { a: { x: 50, y: 0 }, b: { x: 50, y: 100 } }, movingSide: "NEGATIVE" },
      { foldId: "F2", kind: "DIAGONAL", line: { a: { x: 0, y: 0 }, b: { x: 50, y: 50 } }, movingSide: "POSITIVE" },
    ];
    return patchedQuestion(
      discoveryIndex,
      folds,
      circleCut(center),
      "MIXED_AXIAL_THEN_DIAGONAL",
      (answer, markCount) => `The axial fold is made first and the diagonal fold second. Open the diagonal fold first, then the axial fold, reflecting all existing marks at each step. This produces ${markCount} holes, arranged as in option ${answer}.`,
    );
  }
  const folds: PfcFoldV1[] = [
    { foldId: "F1", kind: "DIAGONAL", line: { a: { x: 0, y: 0 }, b: { x: 100, y: 100 } }, movingSide: "POSITIVE" },
    { foldId: "F2", kind: "VERTICAL", line: { a: { x: 50, y: 0 }, b: { x: 50, y: 100 } }, movingSide: "NEGATIVE" },
  ];
  return patchedQuestion(
    discoveryIndex,
    folds,
    circleCut(center),
    "MIXED_DIAGONAL_THEN_AXIAL",
    (answer, markCount) => `The diagonal fold is made first and the axial fold second. Reverse that order while opening the paper: open the axial fold first, then the diagonal. The ${markCount}-hole result is option ${answer}.`,
  );
}

function multiFoldNotchQuestion(discoveryIndex: number): PfcDiscoveryQuestionV4_2 {
  const u = discoveryIndex % 80;
  const mode = u % 4;
  const k = Math.floor(u / 4);
  const position = q(8 + k * 1.5);
  const folds: PfcFoldV1[] = [
    { foldId: "F1", kind: "VERTICAL", line: { a: { x: 50, y: 0 }, b: { x: 50, y: 100 } }, movingSide: "NEGATIVE" },
    { foldId: "F2", kind: "HORIZONTAL", line: { a: { x: 0, y: 50 }, b: { x: 100, y: 50 } }, movingSide: "POSITIVE" },
  ];
  const definitions: Array<{ tag: string; center: SpatialPoint; visualKind: PfcCutVisualKindV4 }> = [
    { tag: "MULTIFOLD_OUTER_V_NOTCH", center: { x: position, y: 0 }, visualKind: "V_NOTCH" },
    { tag: "MULTIFOLD_OUTER_SEMICIRCLE_NOTCH", center: { x: 0, y: position }, visualKind: "SEMICIRCLE_NOTCH" },
    { tag: "MULTIFOLD_FOLD_EDGE_V_NOTCH", center: { x: 50, y: position }, visualKind: "V_NOTCH" },
    { tag: "MULTIFOLD_FOLD_EDGE_SEMICIRCLE_NOTCH", center: { x: position, y: 50 }, visualKind: "SEMICIRCLE_NOTCH" },
  ];
  const selected = definitions[mode];
  const cut: PfcVisualCutV4 = {
    cutId: "N1",
    kind: "BOUNDARY_NOTCH",
    center: selected.center,
    radius: 3.2,
    visualKind: selected.visualKind,
  };
  const onFoldEdge = mode >= 2;
  return patchedQuestion(
    discoveryIndex,
    folds,
    cut,
    selected.tag,
    (answer, markCount, affectedLayerCount) => onFoldEdge
      ? `The notch is cut on a folded crease edge. It touches ${affectedLayerCount} physical layers, but coincident marks on the crease join when the paper opens. The resulting ${markCount} interior cut position${markCount === 1 ? "" : "s"} match option ${answer}.`
      : `The notch is cut on the outside boundary of a packet made by two folds. Open the folds in reverse order and keep each copy on the corresponding outer boundary. The final notch pattern is option ${answer}.`,
  );
}

export function generatePfcDiscoveryQuestionV4_2(discoveryIndex: number): PfcDiscoveryQuestionV4_2 {
  if (!Number.isInteger(discoveryIndex) || discoveryIndex < 0 || discoveryIndex >= 800) {
    throw new RangeError("PFC discoveryIndex must be an integer from 0 to 799.");
  }
  const representationIndex = Math.floor(discoveryIndex / 80);
  if (representationIndex === 4) return cornerQuestion(discoveryIndex);
  if (representationIndex === 5) return diagonalQuestion(discoveryIndex);
  if (representationIndex === 6) return mixedAxisQuestion(discoveryIndex);
  if (representationIndex === 8) return multiFoldNotchQuestion(discoveryIndex);
  return {
    ...generatePfcDiscoveryQuestionV4_1(discoveryIndex),
    remediationDiversityAuthorityId: PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_2.authorityId,
  };
}

export function generatePfcDiscoveryCorpusV4_2(): PfcDiscoveryQuestionV4_2[] {
  return Array.from({ length: 800 }, (_, index) => generatePfcDiscoveryQuestionV4_2(index));
}

export function pfcV4_2CoverageTags(): string[] {
  return [...new Set(generatePfcDiscoveryCorpusV4_2().flatMap((question) => question.coverageTags))].sort();
}

export function pfcV4_2RepresentationCoverage(): Record<string, string[]> {
  const result = new Map<string, Set<string>>();
  for (const question of generatePfcDiscoveryCorpusV4_2()) {
    if (!result.has(question.representationId)) result.set(question.representationId, new Set());
    for (const tag of question.coverageTags) result.get(question.representationId)!.add(tag);
  }
  return Object.fromEntries([...result.entries()].map(([id, tags]) => [id, [...tags].sort()]));
}

export { renderPfcDiscoveryOptionSvgV4, renderPfcDiscoveryReviewHtmlV4, renderPfcDiscoveryStimulusSvgV4 };
