import {
  applyPfcFoldV1,
  canonicalPfcCutPositionsV1,
  createSquarePfcSheetV1,
  pointInPolygonInclusiveV1,
  solvePfcCutsV1,
  type PfcCutKindV1,
  type PfcCutV1,
  type PfcFoldV1,
  type PfcLayerFragmentV1,
  type PfcOriginalContactV1,
} from "./paper-folding-foundation-v1";
import type { SpatialPoint } from "./types";

export const PFC_001_DISCOVERY_AUTHORITY_V1 = Object.freeze({
  authorityId: "PFC-001-EXECUTABLE-DISCOVERY-V1" as const,
  chapterCode: "PFC-001" as const,
  stage: "CP1_EXECUTABLE_DISCOVERY" as const,
  representationCount: 10,
  targetDiscoveryQuestions: 800,
  permanentQlAllocationStatus: "NOT_ALLOCATED_DISCOVERY_REVIEW_REQUIRED" as const,
  frozenSpatialQlRange: "SPA-QL-001..SPA-QL-034" as const,
  nextAvailableQl: "SPA-QL-035" as const,
  answerAuthority: "PFC-001-FOUNDATION-V1" as const,
  sourcePosture: {
    ssc: "CONTROLLED_PFC_TAXONOMY_COVERAGE_TARGET" as const,
    banking: "DIRECT_PFC_PREVALENCE_NOT_ASSUMED" as const,
    punjabState: "PFC_RELEVANCE_REVIEW_REQUIRED_BEFORE_SOURCE_FREEZE" as const,
  },
  questionStudioRegistration: false,
  automaticPublication: false,
} as const);

export type PfcDiscoveryRepresentationIdV1 =
  | "PFC-PROT-01-SINGLE-AXIAL-HOLE"
  | "PFC-PROT-02-SINGLE-AXIAL-EDGE-NOTCH"
  | "PFC-PROT-03-PERPENDICULAR-DOUBLE-FOLD"
  | "PFC-PROT-04-REPEATED-SAME-DIRECTION"
  | "PFC-PROT-05-CORNER-FOLD"
  | "PFC-PROT-06-DIAGONAL-FOLD"
  | "PFC-PROT-07-DIAGONAL-PLUS-AXIAL"
  | "PFC-PROT-08-MULTIPLE-CUTS"
  | "PFC-PROT-09-MULTI-FOLD-EDGE-NOTCH"
  | "PFC-PROT-10-THREE-FOLD-ADVANCED";

export type PfcDifficultyV1 = "L1" | "L2" | "L3" | "L4";
export type PfcMisconceptionV1 =
  | "CORRECT"
  | "INCOMPLETE_UNFOLD"
  | "ONE_LAYER_ONLY"
  | "WRONG_CUT_POSITION"
  | "EXTRA_IMPRINT"
  | "EDGE_TREATED_AS_INTERIOR";

export interface PfcRepresentationV1 {
  id: PfcDiscoveryRepresentationIdV1;
  title: string;
  reasoningFamily:
    | "AXIAL_UNFOLD"
    | "EDGE_CUT_UNFOLD"
    | "ORTHOGONAL_MULTI_FOLD"
    | "REPEATED_FOLD"
    | "CORNER_REFLECTION"
    | "DIAGONAL_REFLECTION"
    | "MIXED_AXIS_REFLECTION"
    | "MULTI_CUT"
    | "MULTI_FOLD_EDGE_CUT"
    | "ADVANCED_LAYER_UNFOLD";
  minimumDifficulty: PfcDifficultyV1;
  foldKinds: ReadonlyArray<PfcFoldV1["kind"]>;
  cutKinds: ReadonlyArray<PfcCutKindV1>;
  intendedMisconceptions: ReadonlyArray<Exclude<PfcMisconceptionV1, "CORRECT">>;
  coverageIntent: string;
}

export const PFC_001_REPRESENTATION_CATALOG_V1: readonly PfcRepresentationV1[] = [
  {
    id: "PFC-PROT-01-SINGLE-AXIAL-HOLE",
    title: "Single axial fold with one hole",
    reasoningFamily: "AXIAL_UNFOLD",
    minimumDifficulty: "L1",
    foldKinds: ["VERTICAL", "HORIZONTAL"],
    cutKinds: ["POINT_HOLE"],
    intendedMisconceptions: ["ONE_LAYER_ONLY", "WRONG_CUT_POSITION"],
    coverageIntent: "Direct one-fold reflection and two-layer hole duplication.",
  },
  {
    id: "PFC-PROT-02-SINGLE-AXIAL-EDGE-NOTCH",
    title: "Single axial fold with edge notch",
    reasoningFamily: "EDGE_CUT_UNFOLD",
    minimumDifficulty: "L1",
    foldKinds: ["VERTICAL", "HORIZONTAL"],
    cutKinds: ["BOUNDARY_NOTCH"],
    intendedMisconceptions: ["EDGE_TREATED_AS_INTERIOR", "ONE_LAYER_ONLY"],
    coverageIntent: "Boundary cut semantics after a single axial fold.",
  },
  {
    id: "PFC-PROT-03-PERPENDICULAR-DOUBLE-FOLD",
    title: "Two perpendicular folds",
    reasoningFamily: "ORTHOGONAL_MULTI_FOLD",
    minimumDifficulty: "L2",
    foldKinds: ["VERTICAL", "HORIZONTAL"],
    cutKinds: ["POINT_HOLE"],
    intendedMisconceptions: ["INCOMPLETE_UNFOLD", "ONE_LAYER_ONLY"],
    coverageIntent: "Four-layer inverse unfolding across perpendicular axes.",
  },
  {
    id: "PFC-PROT-04-REPEATED-SAME-DIRECTION",
    title: "Repeated same-direction fold",
    reasoningFamily: "REPEATED_FOLD",
    minimumDifficulty: "L2",
    foldKinds: ["VERTICAL"],
    cutKinds: ["POINT_HOLE"],
    intendedMisconceptions: ["INCOMPLETE_UNFOLD", "WRONG_CUT_POSITION"],
    coverageIntent: "Second fold over an already folded half, preserving layer provenance.",
  },
  {
    id: "PFC-PROT-05-CORNER-FOLD",
    title: "Corner fold",
    reasoningFamily: "CORNER_REFLECTION",
    minimumDifficulty: "L2",
    foldKinds: ["CORNER"],
    cutKinds: ["POINT_HOLE"],
    intendedMisconceptions: ["ONE_LAYER_ONLY", "WRONG_CUT_POSITION"],
    coverageIntent: "Partial triangular fold with local two-layer overlap rather than whole-sheet doubling.",
  },
  {
    id: "PFC-PROT-06-DIAGONAL-FOLD",
    title: "Diagonal fold",
    reasoningFamily: "DIAGONAL_REFLECTION",
    minimumDifficulty: "L2",
    foldKinds: ["DIAGONAL"],
    cutKinds: ["POINT_HOLE"],
    intendedMisconceptions: ["ONE_LAYER_ONLY", "WRONG_CUT_POSITION"],
    coverageIntent: "Reflection across a non-axial fold line.",
  },
  {
    id: "PFC-PROT-07-DIAGONAL-PLUS-AXIAL",
    title: "Axial plus diagonal fold",
    reasoningFamily: "MIXED_AXIS_REFLECTION",
    minimumDifficulty: "L3",
    foldKinds: ["VERTICAL", "DIAGONAL"],
    cutKinds: ["POINT_HOLE"],
    intendedMisconceptions: ["INCOMPLETE_UNFOLD", "WRONG_CUT_POSITION"],
    coverageIntent: "Order-sensitive inverse unfolding across mixed fold axes.",
  },
  {
    id: "PFC-PROT-08-MULTIPLE-CUTS",
    title: "Multiple cuts after folding",
    reasoningFamily: "MULTI_CUT",
    minimumDifficulty: "L3",
    foldKinds: ["VERTICAL", "HORIZONTAL"],
    cutKinds: ["POINT_HOLE"],
    intendedMisconceptions: ["INCOMPLETE_UNFOLD", "EXTRA_IMPRINT"],
    coverageIntent: "Two distinct punches must each unfold through the same physical layer stack.",
  },
  {
    id: "PFC-PROT-09-MULTI-FOLD-EDGE-NOTCH",
    title: "Edge notch after multiple folds",
    reasoningFamily: "MULTI_FOLD_EDGE_CUT",
    minimumDifficulty: "L3",
    foldKinds: ["VERTICAL", "HORIZONTAL"],
    cutKinds: ["BOUNDARY_NOTCH"],
    intendedMisconceptions: ["EDGE_TREATED_AS_INTERIOR", "INCOMPLETE_UNFOLD"],
    coverageIntent: "Boundary notches propagated through a four-layer fold stack.",
  },
  {
    id: "PFC-PROT-10-THREE-FOLD-ADVANCED",
    title: "Three-fold advanced unfolding",
    reasoningFamily: "ADVANCED_LAYER_UNFOLD",
    minimumDifficulty: "L4",
    foldKinds: ["VERTICAL", "HORIZONTAL", "VERTICAL"],
    cutKinds: ["POINT_HOLE"],
    intendedMisconceptions: ["INCOMPLETE_UNFOLD", "EXTRA_IMPRINT"],
    coverageIntent: "Eight-layer three-fold state with reverse-order unfolding.",
  },
] as const;

export interface PfcDiscoveryImprintV1 {
  x: number;
  y: number;
  kind: PfcCutKindV1;
  contact: PfcOriginalContactV1;
}

export interface PfcDiscoveryOptionV1 {
  optionId: "A" | "B" | "C" | "D";
  misconception: PfcMisconceptionV1;
  imprints: PfcDiscoveryImprintV1[];
  fingerprint: string;
}

export interface PfcDiscoveryQuestionV1 {
  questionId: string;
  chapterCode: "PFC-001";
  representationId: PfcDiscoveryRepresentationIdV1;
  representationTitle: string;
  reasoningFamily: PfcRepresentationV1["reasoningFamily"];
  discoveryIndex: number;
  variantIndex: number;
  difficulty: PfcDifficultyV1;
  sheetBoundary: SpatialPoint[];
  folds: PfcFoldV1[];
  cuts: PfcCutV1[];
  foldedLayerCounts: number[];
  unfoldedFingerprint: string;
  options: PfcDiscoveryOptionV1[];
  correctOptionIndex: number;
  correctOptionId: "A" | "B" | "C" | "D";
  explanation: string;
  semanticFingerprint: string;
}

const OPTION_IDS = ["A", "B", "C", "D"] as const;
const SHEET = createSquarePfcSheetV1(100);

function q(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function verticalFold(id: string, x: number, movingSide: PfcFoldV1["movingSide"]): PfcFoldV1 {
  return {
    foldId: id,
    kind: "VERTICAL",
    line: { a: { x, y: 0 }, b: { x, y: 100 } },
    movingSide,
  };
}

function horizontalFold(id: string, y: number, movingSide: PfcFoldV1["movingSide"]): PfcFoldV1 {
  return {
    foldId: id,
    kind: "HORIZONTAL",
    line: { a: { x: 0, y }, b: { x: 100, y } },
    movingSide,
  };
}

function buildScenario(
  representationId: PfcDiscoveryRepresentationIdV1,
  variantIndex: number,
): { folds: PfcFoldV1[]; cuts: PfcCutV1[]; difficulty: PfcDifficultyV1 } {
  const u = variantIndex;
  const x1 = q(8 + (u % 16) * 0.83);
  const y1 = q(11 + (u % 20) * 1.31);
  const x2 = q(12 + (u % 14) * 0.77);
  const y2 = q(13 + (u % 15) * 0.91);

  switch (representationId) {
    case "PFC-PROT-01-SINGLE-AXIAL-HOLE": {
      const vertical = u % 2 === 0;
      return vertical
        ? {
            folds: [verticalFold("F1", 50, "NEGATIVE")],
            cuts: [{ cutId: "C1", kind: "POINT_HOLE", center: { x: q(10 + (u % 28) * 1.07), y: q(12 + (u % 60) * 1.13) }, radius: 2.2 }],
            difficulty: "L1",
          }
        : {
            folds: [horizontalFold("F1", 50, "POSITIVE")],
            cuts: [{ cutId: "C1", kind: "POINT_HOLE", center: { x: q(12 + (u % 60) * 1.19), y: q(8 + (u % 30) * 1.09) }, radius: 2.2 }],
            difficulty: "L1",
          };
    }
    case "PFC-PROT-02-SINGLE-AXIAL-EDGE-NOTCH": {
      const topEdge = u % 2 === 0;
      return topEdge
        ? {
            folds: [verticalFold("F1", 50, "NEGATIVE")],
            cuts: [{ cutId: "N1", kind: "BOUNDARY_NOTCH", center: { x: q(8 + (u % 34) * 1.03), y: 0 }, radius: 3 }],
            difficulty: "L1",
          }
        : {
            folds: [horizontalFold("F1", 50, "POSITIVE")],
            cuts: [{ cutId: "N1", kind: "BOUNDARY_NOTCH", center: { x: 0, y: q(8 + (u % 34) * 1.03) }, radius: 3 }],
            difficulty: "L1",
          };
    }
    case "PFC-PROT-03-PERPENDICULAR-DOUBLE-FOLD":
      return {
        folds: [verticalFold("F1", 50, "NEGATIVE"), horizontalFold("F2", 50, "POSITIVE")],
        cuts: [{ cutId: "C1", kind: "POINT_HOLE", center: { x: q(8 + (u % 30) * 1.03), y: q(9 + (u % 28) * 1.09) }, radius: 2.2 }],
        difficulty: u % 3 === 0 ? "L3" : "L2",
      };
    case "PFC-PROT-04-REPEATED-SAME-DIRECTION":
      return {
        folds: [verticalFold("F1", 50, "NEGATIVE"), verticalFold("F2", 25, "NEGATIVE")],
        cuts: [{ cutId: "C1", kind: "POINT_HOLE", center: { x: q(5 + (u % 18) * 0.91), y: q(9 + (u % 65) * 1.17) }, radius: 2.1 }],
        difficulty: "L2",
      };
    case "PFC-PROT-05-CORNER-FOLD":
      return {
        folds: [{
          foldId: "F1",
          kind: "CORNER",
          line: { a: { x: 0, y: 50 }, b: { x: 50, y: 0 } },
          movingSide: "NEGATIVE",
        }],
        cuts: [{ cutId: "C1", kind: "POINT_HOLE", center: { x: q(28 + (u % 10) * 1.1), y: q(28 + ((u * 3) % 10) * 1.07) }, radius: 2 }],
        difficulty: u % 4 === 0 ? "L3" : "L2",
      };
    case "PFC-PROT-06-DIAGONAL-FOLD":
      return {
        folds: [{
          foldId: "F1",
          kind: "DIAGONAL",
          line: { a: { x: 0, y: 0 }, b: { x: 100, y: 100 } },
          movingSide: "POSITIVE",
        }],
        cuts: [{ cutId: "C1", kind: "POINT_HOLE", center: { x: q(58 + (u % 25) * 1.03), y: q(10 + (u % 24) * 1.07) }, radius: 2.2 }],
        difficulty: "L2",
      };
    case "PFC-PROT-07-DIAGONAL-PLUS-AXIAL":
      return {
        folds: [
          verticalFold("F1", 50, "NEGATIVE"),
          {
            foldId: "F2",
            kind: "DIAGONAL",
            line: { a: { x: 0, y: 0 }, b: { x: 50, y: 50 } },
            movingSide: "POSITIVE",
          },
        ],
        cuts: [{ cutId: "C1", kind: "POINT_HOLE", center: { x: q(30 + (u % 13) * 1.03), y: q(8 + (u % 12) * 0.97) }, radius: 2 }],
        difficulty: "L3",
      };
    case "PFC-PROT-08-MULTIPLE-CUTS":
      return {
        folds: [verticalFold("F1", 50, "NEGATIVE"), horizontalFold("F2", 50, "POSITIVE")],
        cuts: [
          { cutId: "C1", kind: "POINT_HOLE", center: { x: x1, y: y1 > 43 ? q(18 + (u % 20)) : y1 }, radius: 2 },
          { cutId: "C2", kind: "POINT_HOLE", center: { x: q(28 + (u % 12) * 1.09), y: q(26 + ((u * 5) % 12) * 1.03) }, radius: 2.6 },
        ],
        difficulty: "L3",
      };
    case "PFC-PROT-09-MULTI-FOLD-EDGE-NOTCH":
      return {
        folds: [verticalFold("F1", 50, "NEGATIVE"), horizontalFold("F2", 50, "POSITIVE")],
        cuts: [{ cutId: "N1", kind: "BOUNDARY_NOTCH", center: { x: q(8 + (u % 30) * 1.03), y: 0 }, radius: 3 }],
        difficulty: "L3",
      };
    case "PFC-PROT-10-THREE-FOLD-ADVANCED":
      return {
        folds: [
          verticalFold("F1", 50, "NEGATIVE"),
          horizontalFold("F2", 50, "POSITIVE"),
          verticalFold("F3", 25, "NEGATIVE"),
        ],
        cuts: [{ cutId: "C1", kind: "POINT_HOLE", center: { x: q(5 + (u % 18) * 0.89), y: q(7 + (u % 32) * 1.01) }, radius: 2 }],
        difficulty: "L4",
      };
  }
}

function imprintFingerprint(imprints: readonly PfcDiscoveryImprintV1[]): string {
  return imprints
    .map((imprint) => `${imprint.kind}|${imprint.contact}|${q(imprint.x)},${q(imprint.y)}`)
    .sort()
    .join(";");
}

function answerImprints(
  solution: ReturnType<typeof solvePfcCutsV1>,
  cuts: readonly PfcCutV1[],
): PfcDiscoveryImprintV1[] {
  return cuts.flatMap((cut) =>
    canonicalPfcCutPositionsV1(solution, cut.cutId).map((point) => ({
      x: point.x,
      y: point.y,
      kind: cut.kind,
      contact: point.contact,
    })),
  );
}

function uniqueImprints(imprints: readonly PfcDiscoveryImprintV1[]): PfcDiscoveryImprintV1[] {
  const byKey = new Map<string, PfcDiscoveryImprintV1>();
  for (const imprint of imprints) {
    const key = `${imprint.kind}|${imprint.contact}|${q(imprint.x)},${q(imprint.y)}`;
    if (!byKey.has(key)) byKey.set(key, { ...imprint });
  }
  return [...byKey.values()].sort((a, b) => a.x - b.x || a.y - b.y || a.kind.localeCompare(b.kind));
}

function clampInterior(value: number): number {
  return q(Math.min(95, Math.max(5, value)));
}

function buildDistractorCandidates(
  correct: readonly PfcDiscoveryImprintV1[],
  representation: PfcRepresentationV1,
  variantIndex: number,
): Array<{ misconception: Exclude<PfcMisconceptionV1, "CORRECT">; imprints: PfcDiscoveryImprintV1[] }> {
  const halfCount = Math.max(1, Math.ceil(correct.length / 2));
  const shifted = correct.map((imprint, index) => ({
    ...imprint,
    x: imprint.contact === "BOUNDARY" && imprint.x === 0 ? 0 : clampInterior(imprint.x + (index % 2 === 0 ? 6 : -6)),
    y: imprint.contact === "BOUNDARY" && imprint.y === 0 ? 0 : clampInterior(imprint.y + (index % 2 === 0 ? -5 : 5)),
  }));
  const extraBase = correct[0] ?? { x: 50, y: 50, kind: "POINT_HOLE" as const, contact: "INTERIOR" as const };
  const extra: PfcDiscoveryImprintV1 = {
    kind: extraBase.kind,
    contact: "INTERIOR",
    x: clampInterior(46 + (variantIndex % 7)),
    y: clampInterior(52 - (variantIndex % 9)),
  };
  const boundaryAsInterior = correct.map((imprint) =>
    imprint.contact === "BOUNDARY"
      ? {
          ...imprint,
          contact: "INTERIOR" as const,
          x: imprint.x === 0 ? 5 : imprint.x,
          y: imprint.y === 0 ? 5 : imprint.y,
        }
      : { ...imprint },
  );

  const candidates: Array<{ misconception: Exclude<PfcMisconceptionV1, "CORRECT">; imprints: PfcDiscoveryImprintV1[] }> = [
    { misconception: "INCOMPLETE_UNFOLD", imprints: correct.slice(0, halfCount).map((item) => ({ ...item })) },
    { misconception: "ONE_LAYER_ONLY", imprints: correct.length ? [{ ...correct[0] }] : [] },
    { misconception: "WRONG_CUT_POSITION", imprints: shifted },
    { misconception: "EXTRA_IMPRINT", imprints: [...correct.map((item) => ({ ...item })), extra] },
    { misconception: "EDGE_TREATED_AS_INTERIOR", imprints: boundaryAsInterior },
  ];

  const preferred = new Set(representation.intendedMisconceptions);
  return candidates.sort((a, b) => Number(preferred.has(b.misconception)) - Number(preferred.has(a.misconception)));
}

function buildOptions(
  correct: readonly PfcDiscoveryImprintV1[],
  representation: PfcRepresentationV1,
  variantIndex: number,
): { options: PfcDiscoveryOptionV1[]; correctOptionIndex: number } {
  const correctFingerprint = imprintFingerprint(correct);
  const distinct = new Map<string, { misconception: PfcMisconceptionV1; imprints: PfcDiscoveryImprintV1[] }>();
  distinct.set(correctFingerprint, { misconception: "CORRECT", imprints: uniqueImprints(correct) });

  for (const candidate of buildDistractorCandidates(correct, representation, variantIndex)) {
    const cleaned = uniqueImprints(candidate.imprints);
    const fingerprint = imprintFingerprint(cleaned);
    if (fingerprint && !distinct.has(fingerprint)) {
      distinct.set(fingerprint, { misconception: candidate.misconception, imprints: cleaned });
    }
    if (distinct.size >= 4) break;
  }

  if (distinct.size < 4) {
    throw new Error(`PFC discovery option synthesis failed for ${representation.id} variant ${variantIndex}.`);
  }

  const all = [...distinct.entries()].slice(0, 4).map(([fingerprint, candidate]) => ({
    fingerprint,
    ...candidate,
  }));
  const rotation = variantIndex % 4;
  const ordered = [...all.slice(rotation), ...all.slice(0, rotation)];
  const options = ordered.map<PfcDiscoveryOptionV1>((candidate, index) => ({
    optionId: OPTION_IDS[index],
    misconception: candidate.misconception,
    imprints: candidate.imprints,
    fingerprint: candidate.fingerprint,
  }));
  const correctOptionIndex = options.findIndex((option) => option.fingerprint === correctFingerprint);
  if (correctOptionIndex < 0) throw new Error("Correct PFC option was lost during permutation.");
  return { options, correctOptionIndex };
}

function buildFoldedLayerCounts(folds: readonly PfcFoldV1[]): number[] {
  let fragments: PfcLayerFragmentV1[] = [{
    fragmentId: "SHEET-ROOT",
    sourceSheetRegionId: "SHEET-ROOT",
    polygon: SHEET.map((point) => ({ ...point })),
    transformHistory: [],
  }];
  const counts: number[] = [];
  for (const fold of folds) {
    fragments = applyPfcFoldV1(fragments, fold);
    counts.push(fragments.length);
  }
  return counts;
}

function explainQuestion(
  folds: readonly PfcFoldV1[],
  cuts: readonly PfcCutV1[],
  solution: ReturnType<typeof solvePfcCutsV1>,
  correctOptionId: string,
): string {
  const affected = solution.cuts.map((cut) => cut.affectedLayerCount);
  const positions = cuts.flatMap((cut) =>
    canonicalPfcCutPositionsV1(solution, cut.cutId).map((point) => `(${point.x}, ${point.y})`),
  );
  const foldText = folds.length === 1 ? "1 fold" : `${folds.length} folds`;
  const cutText = cuts.length === 1 ? "the cut" : "the cuts";
  return `The paper has ${foldText}. ${cutText} pass through ${affected.join(" and ")} physical layer${affected.every((count) => count === 1) ? "" : "s"}. Open the folds in reverse order. The cut marks therefore appear at ${positions.join(", ")}. This matches option ${correctOptionId}.`;
}

export function generatePfcDiscoveryQuestionV1(discoveryIndex: number): PfcDiscoveryQuestionV1 {
  if (!Number.isInteger(discoveryIndex) || discoveryIndex < 0 || discoveryIndex >= 800) {
    throw new RangeError("PFC discoveryIndex must be an integer from 0 to 799.");
  }

  const representationIndex = Math.floor(discoveryIndex / 80);
  const variantIndex = discoveryIndex % 80;
  const representation = PFC_001_REPRESENTATION_CATALOG_V1[representationIndex];
  const scenario = buildScenario(representation.id, variantIndex);
  const solution = solvePfcCutsV1(SHEET, scenario.folds, scenario.cuts);
  const correct = answerImprints(solution, scenario.cuts);
  const { options, correctOptionIndex } = buildOptions(correct, representation, variantIndex);
  const correctOptionId = options[correctOptionIndex].optionId;
  const semanticFingerprint = [
    representation.id,
    scenario.folds.map((fold) => `${fold.kind}:${q(fold.line.a.x)},${q(fold.line.a.y)}>${q(fold.line.b.x)},${q(fold.line.b.y)}:${fold.movingSide}`).join("|"),
    scenario.cuts.map((cut) => `${cut.kind}:${q(cut.center.x)},${q(cut.center.y)}:${q(cut.radius)}`).join("|"),
    solution.unfoldedFingerprint,
  ].join("::");

  return {
    questionId: `PFC-DISC-${String(discoveryIndex + 1).padStart(4, "0")}`,
    chapterCode: "PFC-001",
    representationId: representation.id,
    representationTitle: representation.title,
    reasoningFamily: representation.reasoningFamily,
    discoveryIndex,
    variantIndex,
    difficulty: scenario.difficulty,
    sheetBoundary: SHEET.map((point) => ({ ...point })),
    folds: scenario.folds,
    cuts: scenario.cuts,
    foldedLayerCounts: buildFoldedLayerCounts(scenario.folds),
    unfoldedFingerprint: solution.unfoldedFingerprint,
    options,
    correctOptionIndex,
    correctOptionId,
    explanation: explainQuestion(scenario.folds, scenario.cuts, solution, correctOptionId),
    semanticFingerprint,
  };
}

export function generatePfcDiscoveryCorpusV1(): PfcDiscoveryQuestionV1[] {
  return Array.from({ length: 800 }, (_, index) => generatePfcDiscoveryQuestionV1(index));
}

function polygonPoints(points: readonly SpatialPoint[]): string {
  return points.map((point) => `${q(point.x)},${q(point.y)}`).join(" ");
}

export function renderPfcDiscoveryOptionSvgV1(option: PfcDiscoveryOptionV1, size = 120): string {
  const notches = option.imprints.filter((imprint) => imprint.kind === "BOUNDARY_NOTCH");
  const holes = option.imprints.filter((imprint) => imprint.kind === "POINT_HOLE");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="-6 -6 112 112" role="img" aria-label="Unfolded paper option"><rect x="0" y="0" width="100" height="100" fill="white" stroke="black" stroke-width="2"/>${holes.map((hole) => `<circle cx="${q(hole.x)}" cy="${q(hole.y)}" r="3" fill="none" stroke="black" stroke-width="2"/>`).join("")}${notches.map((notch) => `<circle cx="${q(notch.x)}" cy="${q(notch.y)}" r="4" fill="white" stroke="black" stroke-width="2"/>`).join("")}</svg>`;
}

export function renderPfcDiscoveryStimulusSvgV1(question: PfcDiscoveryQuestionV1, size = 360): string {
  let fragments: PfcLayerFragmentV1[] = [{
    fragmentId: "SHEET-ROOT",
    sourceSheetRegionId: "SHEET-ROOT",
    polygon: question.sheetBoundary.map((point) => ({ ...point })),
    transformHistory: [],
  }];
  const panels: string[] = [];
  const panelCount = question.folds.length + 2;
  const panelWidth = 122;
  panels.push(`<g transform="translate(8,10)"><text x="50" y="-2" text-anchor="middle" font-size="9">Paper</text><polygon points="${polygonPoints(question.sheetBoundary)}" fill="white" stroke="black" stroke-width="1.8"/></g>`);

  question.folds.forEach((fold, index) => {
    fragments = applyPfcFoldV1(fragments, fold);
    const x = 8 + (index + 1) * panelWidth;
    const visiblePolygons = fragments.map((fragment) => `<polygon points="${polygonPoints(fragment.polygon)}" fill="white" fill-opacity="0.7" stroke="black" stroke-width="1.2"/>`).join("");
    panels.push(`<g transform="translate(${x},10)"><text x="50" y="-2" text-anchor="middle" font-size="9">Fold ${index + 1}</text>${visiblePolygons}<line x1="${q(fold.line.a.x)}" y1="${q(fold.line.a.y)}" x2="${q(fold.line.b.x)}" y2="${q(fold.line.b.y)}" stroke="black" stroke-width="1" stroke-dasharray="4 3"/></g>`);
  });

  const finalX = 8 + (panelCount - 1) * panelWidth;
  const finalPolygons = fragments.map((fragment) => `<polygon points="${polygonPoints(fragment.polygon)}" fill="white" fill-opacity="0.7" stroke="black" stroke-width="1.2"/>`).join("");
  const finalCuts = question.cuts.map((cut) => `<circle cx="${q(cut.center.x)}" cy="${q(cut.center.y)}" r="${q(Math.max(2.6, cut.radius))}" fill="${cut.kind === "POINT_HOLE" ? "black" : "white"}" stroke="black" stroke-width="1.5"/>`).join("");
  panels.push(`<g transform="translate(${finalX},10)"><text x="50" y="-2" text-anchor="middle" font-size="9">Cut</text>${finalPolygons}${finalCuts}</g>`);

  const viewWidth = 16 + panelCount * panelWidth;
  const renderHeight = 126;
  const scale = size / Math.max(viewWidth, renderHeight);
  const width = Math.round(viewWidth * scale);
  const height = Math.round(renderHeight * scale);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${viewWidth} ${renderHeight}" role="img" aria-label="Paper folding and cutting sequence"><rect width="100%" height="100%" fill="white"/>${panels.join("")}</svg>`;
}

export function renderPfcDiscoveryReviewHtmlV1(questions: readonly PfcDiscoveryQuestionV1[]): string {
  const cards = questions.map((question) => `<article style="border:1px solid #ccc;border-radius:10px;padding:16px;margin:16px 0;background:#fff"><h2 style="margin:0 0 4px">${question.questionId} · ${question.representationId}</h2><p style="margin:4px 0 12px">${question.difficulty} · ${question.representationTitle}</p><p><strong>Question:</strong> A square paper is folded and cut as shown. Which option shows the paper after it is fully unfolded?</p><div style="overflow:auto">${renderPfcDiscoveryStimulusSvgV1(question, 520)}</div><div style="display:grid;grid-template-columns:repeat(4,minmax(112px,1fr));gap:12px;margin-top:14px">${question.options.map((option) => `<div style="text-align:center"><strong>${option.optionId}</strong><div>${renderPfcDiscoveryOptionSvgV1(option, 112)}</div></div>`).join("")}</div><p><strong>Answer:</strong> ${question.correctOptionId}</p><p><strong>Explanation:</strong> ${question.explanation}</p></article>`).join("\n");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PFC-001 Discovery Learner Review V1</title></head><body style="font-family:Arial,sans-serif;background:#f5f5f5;color:#111;max-width:1100px;margin:0 auto;padding:16px"><h1>PFC-001 Discovery Learner Review V1</h1><p>Generated from semantic fold-state authority. SVG is presentation only. Review at normal/mobile option size; no zoom should be required.</p>${cards}</body></html>`;
}

export function pfcDiscoveryOptionIsReadableV1(option: PfcDiscoveryOptionV1): boolean {
  for (let index = 0; index < option.imprints.length; index += 1) {
    const current = option.imprints[index];
    if (current.x < 0 || current.x > 100 || current.y < 0 || current.y > 100) return false;
    for (let otherIndex = index + 1; otherIndex < option.imprints.length; otherIndex += 1) {
      const other = option.imprints[otherIndex];
      if (Math.hypot(current.x - other.x, current.y - other.y) < 4.5) return false;
    }
  }
  return true;
}

export function validatePfcDiscoveryCutReachabilityV1(question: PfcDiscoveryQuestionV1): boolean {
  let fragments: PfcLayerFragmentV1[] = [{
    fragmentId: "SHEET-ROOT",
    sourceSheetRegionId: "SHEET-ROOT",
    polygon: question.sheetBoundary.map((point) => ({ ...point })),
    transformHistory: [],
  }];
  for (const fold of question.folds) fragments = applyPfcFoldV1(fragments, fold);
  return question.cuts.every((cut) => fragments.some((fragment) => pointInPolygonInclusiveV1(cut.center, fragment.polygon)));
}
