import { applyAffineTransform } from "./geometry";
import {
  applyPfcFoldV1,
  clipPolygonToFoldSideV1,
  pointInPolygonInclusiveV1,
  pointOnPolygonBoundaryV1,
  type PfcCutV1,
  type PfcFoldV1,
  type PfcLayerFragmentV1,
  type PfcOriginalContactV1,
} from "./paper-folding-foundation-v1";
import {
  PFC_001_REPRESENTATION_CATALOG_V1,
  pfcDiscoveryOptionIsReadableV1,
  type PfcDiscoveryImprintV1,
  type PfcDiscoveryOptionV1,
  type PfcDiscoveryQuestionV1,
  type PfcMisconceptionV1,
} from "./paper-folding-discovery-v1";
import { generatePfcDiscoveryQuestionV3 } from "./paper-folding-discovery-presentation-v3";
import type { SpatialPoint } from "./types";

export const PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4 = Object.freeze({
  authorityId: "PFC-001-VISUAL-TAXONOMY-REMEDIATION-V4" as const,
  chapterCode: "PFC-001" as const,
  supersedesPresentationAuthority: "PFC-001-DISCOVERY-PRESENTATION-V3" as const,
  keepsPermanentQlRange: "SPA-QL-035..SPA-QL-038" as const,
  representationCount: 10,
  executableCoverageModeCount: 28,
  targetQuestions: 800,
  remediation: [
    "WHITE_EXAM_SURFACE",
    "PRE_FOLD_STATE_WITH_CREASE_AND_MOVING_SIDE_ARROW",
    "TRUE_V_AND_SEMICIRCLE_EDGE_NOTCH_RENDERING",
    "TRIANGLE_AND_SLIT_CUT_RENDERING",
    "FOLD_LINE_CUT_COALESCING",
    "OFF_CENTER_AXIAL_FOLDS",
    "BOTH_REPEATED_AXES",
    "BOTH_DIAGONALS_AND_FOUR_CORNERS",
    "BOTH_MIXED_AXIS_ORDERS",
    "MIXED_HOLE_AND_EDGE_CUT",
    "MULTIPLE_DISTINCT_CUT_SHAPES",
  ] as const,
  priorEnglishFreezeStatus: "SUPERSEDED_FOR_QUESTION_STUDIO_INTEGRATION_PENDING_NEW_REVIEW" as const,
  questionStudioRegistered: false,
  automaticPublication: false,
} as const);

export type PfcCutVisualKindV4 =
  | "CIRCLE_HOLE"
  | "V_NOTCH"
  | "SEMICIRCLE_NOTCH"
  | "TRIANGLE_CUT"
  | "STRAIGHT_SLIT";

export interface PfcVisualCutV4 extends PfcCutV1 {
  visualKind: PfcCutVisualKindV4;
}

export interface PfcVisualImprintV4 extends PfcDiscoveryImprintV1 {
  visualKind: PfcCutVisualKindV4;
}

export interface PfcVisualOptionV4 extends Omit<PfcDiscoveryOptionV1, "imprints"> {
  imprints: PfcVisualImprintV4[];
}

export interface PfcDiscoveryQuestionV4 extends Omit<PfcDiscoveryQuestionV1, "cuts" | "options"> {
  cuts: PfcVisualCutV4[];
  options: PfcVisualOptionV4[];
  coverageTags: string[];
  remediationAuthorityId: typeof PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4.authorityId;
}

type V4MappedCut = {
  cutId: string;
  kind: PfcCutV1["kind"];
  visualKind: PfcCutVisualKindV4;
  originalCenter: SpatialPoint;
  originalContact: PfcOriginalContactV1;
};

type V4CutEvidence = {
  cutId: string;
  affectedLayerCount: number;
  mappedCuts: V4MappedCut[];
};

type V4Solution = {
  finalFragments: PfcLayerFragmentV1[];
  cuts: V4CutEvidence[];
  unfoldedFingerprint: string;
};

const OPTION_IDS = ["A", "B", "C", "D"] as const;
const EPSILON = 1e-6;

function q(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function q6(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function pointKey(point: SpatialPoint): string {
  return `${q6(point.x)},${q6(point.y)}`;
}

function mapBack(point: SpatialPoint, fragment: PfcLayerFragmentV1): SpatialPoint {
  let mapped = { ...point };
  for (let index = fragment.transformHistory.length - 1; index >= 0; index -= 1) {
    mapped = applyAffineTransform(mapped, fragment.transformHistory[index]);
  }
  return mapped;
}

function solveV4(
  sheetBoundary: readonly SpatialPoint[],
  folds: readonly PfcFoldV1[],
  cuts: readonly PfcVisualCutV4[],
): V4Solution {
  let fragments: PfcLayerFragmentV1[] = [{
    fragmentId: "SHEET-ROOT",
    sourceSheetRegionId: "SHEET-ROOT",
    polygon: sheetBoundary.map((point) => ({ ...point })),
    transformHistory: [],
  }];

  for (const fold of folds) fragments = applyPfcFoldV1(fragments, fold);

  const cutEvidence = cuts.map<V4CutEvidence>((cut) => {
    const affected = fragments.filter((fragment) =>
      pointInPolygonInclusiveV1(cut.center, fragment.polygon),
    );
    if (affected.length === 0) {
      throw new Error(`PFC V4 cut ${cut.cutId} misses folded material.`);
    }

    const unique = new Map<string, V4MappedCut>();
    for (const fragment of affected) {
      const originalCenter = mapBack(cut.center, fragment);
      const originalContact = pointOnPolygonBoundaryV1(originalCenter, sheetBoundary)
        ? "BOUNDARY"
        : "INTERIOR";
      const mapped: V4MappedCut = {
        cutId: cut.cutId,
        kind: cut.kind,
        visualKind: cut.visualKind,
        originalCenter,
        originalContact,
      };
      const key = `${cut.cutId}|${cut.kind}|${cut.visualKind}|${originalContact}|${pointKey(originalCenter)}`;
      if (!unique.has(key)) unique.set(key, mapped);
    }

    return {
      cutId: cut.cutId,
      affectedLayerCount: affected.length,
      mappedCuts: [...unique.values()].sort((left, right) =>
        left.originalCenter.x - right.originalCenter.x ||
        left.originalCenter.y - right.originalCenter.y ||
        left.visualKind.localeCompare(right.visualKind),
      ),
    };
  });

  const unfoldedFingerprint = cutEvidence
    .flatMap((evidence) => evidence.mappedCuts)
    .map((mapped) => `${mapped.cutId}|${mapped.kind}|${mapped.visualKind}|${mapped.originalContact}|${pointKey(mapped.originalCenter)}`)
    .sort()
    .join(";");

  return { finalFragments: fragments, cuts: cutEvidence, unfoldedFingerprint };
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

function visualCut(
  cutId: string,
  kind: PfcCutV1["kind"],
  center: SpatialPoint,
  radius: number,
  visualKind: PfcCutVisualKindV4,
): PfcVisualCutV4 {
  return { cutId, kind, center, radius, visualKind };
}

function baseCuts(question: PfcDiscoveryQuestionV1): PfcVisualCutV4[] {
  return question.cuts.map((cut) => visualCut(
    cut.cutId,
    cut.kind,
    { ...cut.center },
    cut.radius,
    cut.kind === "BOUNDARY_NOTCH" ? "V_NOTCH" : "CIRCLE_HOLE",
  ));
}

function copyFolds(question: PfcDiscoveryQuestionV1): PfcFoldV1[] {
  return question.folds.map((fold) => ({
    ...fold,
    line: { a: { ...fold.line.a }, b: { ...fold.line.b } },
  }));
}

function scenarioV4(question: PfcDiscoveryQuestionV1): {
  folds: PfcFoldV1[];
  cuts: PfcVisualCutV4[];
  coverageTags: string[];
} {
  const u = question.variantIndex;
  const mode = u % 4;

  switch (question.representationId) {
    case "PFC-PROT-01-SINGLE-AXIAL-HOLE": {
      if (mode === 0) return { folds: copyFolds(question), cuts: baseCuts(question), coverageTags: ["SINGLE_VERTICAL_CENTER"] };
      if (mode === 1) return { folds: copyFolds(question), cuts: baseCuts(question), coverageTags: ["SINGLE_HORIZONTAL_CENTER"] };
      if (mode === 2) {
        return {
          folds: [verticalFold("F1", 40, "NEGATIVE")],
          cuts: [visualCut("C1", "POINT_HOLE", { x: q(48 + (u % 19) * 1.21), y: q(12 + (u % 57) * 1.19) }, 2.2, "CIRCLE_HOLE")],
          coverageTags: ["OFF_CENTER_VERTICAL"],
        };
      }
      return {
        folds: [horizontalFold("F1", 60, "POSITIVE")],
        cuts: [visualCut("C1", "POINT_HOLE", { x: q(12 + (u % 57) * 1.19), y: q(28 + (u % 19) * 1.21) }, 2.2, "CIRCLE_HOLE")],
        coverageTags: ["OFF_CENTER_HORIZONTAL"],
      };
    }

    case "PFC-PROT-02-SINGLE-AXIAL-EDGE-NOTCH": {
      if (mode === 0) {
        const cuts = baseCuts(question).map((cut) => ({ ...cut, visualKind: "V_NOTCH" as const }));
        return { folds: copyFolds(question), cuts, coverageTags: ["OUTER_V_NOTCH"] };
      }
      if (mode === 1) {
        const cuts = baseCuts(question).map((cut) => ({ ...cut, visualKind: "SEMICIRCLE_NOTCH" as const }));
        return { folds: copyFolds(question), cuts, coverageTags: ["OUTER_SEMICIRCLE_NOTCH"] };
      }
      if (mode === 2) {
        return {
          folds: [verticalFold("F1", 50, "NEGATIVE")],
          cuts: [visualCut("N1", "BOUNDARY_NOTCH", { x: 50, y: q(12 + (u % 61) * 1.17) }, 3.2, "V_NOTCH")],
          coverageTags: ["FOLD_LINE_V_NOTCH"],
        };
      }
      return {
        folds: [horizontalFold("F1", 50, "POSITIVE")],
        cuts: [visualCut("N1", "BOUNDARY_NOTCH", { x: q(12 + (u % 61) * 1.17), y: 50 }, 3.2, "SEMICIRCLE_NOTCH")],
        coverageTags: ["FOLD_LINE_SEMICIRCLE_NOTCH"],
      };
    }

    case "PFC-PROT-03-PERPENDICULAR-DOUBLE-FOLD": {
      const cut = visualCut("C1", "POINT_HOLE", {
        x: q(10 + (u % 27) * 1.17),
        y: q(11 + (u % 25) * 1.19),
      }, 2.2, "CIRCLE_HOLE");
      if (u % 2 === 0) {
        return {
          folds: [verticalFold("F1", 50, "NEGATIVE"), horizontalFold("F2", 50, "POSITIVE")],
          cuts: [cut],
          coverageTags: ["PERPENDICULAR_VERTICAL_THEN_HORIZONTAL"],
        };
      }
      return {
        folds: [horizontalFold("F1", 50, "POSITIVE"), verticalFold("F2", 50, "NEGATIVE")],
        cuts: [cut],
        coverageTags: ["PERPENDICULAR_HORIZONTAL_THEN_VERTICAL"],
      };
    }

    case "PFC-PROT-04-REPEATED-SAME-DIRECTION": {
      if (u % 2 === 0) {
        return {
          folds: [verticalFold("F1", 50, "NEGATIVE"), verticalFold("F2", 25, "NEGATIVE")],
          cuts: [visualCut("C1", "POINT_HOLE", { x: q(6 + (u % 16) * 0.94), y: q(10 + (u % 63) * 1.17) }, 2.1, "CIRCLE_HOLE")],
          coverageTags: ["REPEATED_VERTICAL"],
        };
      }
      return {
        folds: [horizontalFold("F1", 50, "POSITIVE"), horizontalFold("F2", 25, "POSITIVE")],
        cuts: [visualCut("C1", "POINT_HOLE", { x: q(10 + (u % 63) * 1.17), y: q(6 + (u % 16) * 0.94) }, 2.1, "CIRCLE_HOLE")],
        coverageTags: ["REPEATED_HORIZONTAL"],
      };
    }

    case "PFC-PROT-05-CORNER-FOLD": {
      const definitions = [
        { line: { a: { x: 0, y: 50 }, b: { x: 50, y: 0 } }, center: { x: 30, y: 30 }, tag: "CORNER_TOP_LEFT" },
        { line: { a: { x: 50, y: 0 }, b: { x: 100, y: 50 } }, center: { x: 70, y: 30 }, tag: "CORNER_TOP_RIGHT" },
        { line: { a: { x: 100, y: 50 }, b: { x: 50, y: 100 } }, center: { x: 70, y: 70 }, tag: "CORNER_BOTTOM_RIGHT" },
        { line: { a: { x: 50, y: 100 }, b: { x: 0, y: 50 } }, center: { x: 30, y: 70 }, tag: "CORNER_BOTTOM_LEFT" },
      ] as const;
      const selected = definitions[mode];
      const jitter = q((u % 7) * 0.8);
      return {
        folds: [{ foldId: "F1", kind: "CORNER", line: selected.line, movingSide: "NEGATIVE" }],
        cuts: [visualCut("C1", "POINT_HOLE", {
          x: q(selected.center.x + (mode === 0 || mode === 3 ? jitter : -jitter)),
          y: q(selected.center.y + (mode === 0 || mode === 1 ? jitter : -jitter)),
        }, 2, "CIRCLE_HOLE")],
        coverageTags: [selected.tag],
      };
    }

    case "PFC-PROT-06-DIAGONAL-FOLD": {
      if (u % 2 === 0) {
        return {
          folds: [{ foldId: "F1", kind: "DIAGONAL", line: { a: { x: 0, y: 0 }, b: { x: 100, y: 100 } }, movingSide: "POSITIVE" }],
          cuts: [visualCut("C1", "POINT_HOLE", { x: q(60 + (u % 23) * 1.01), y: q(10 + (u % 23) * 0.91) }, 2.2, "CIRCLE_HOLE")],
          coverageTags: ["DIAGONAL_MAIN"],
        };
      }
      return {
        folds: [{ foldId: "F1", kind: "DIAGONAL", line: { a: { x: 100, y: 0 }, b: { x: 0, y: 100 } }, movingSide: "POSITIVE" }],
        cuts: [visualCut("C1", "POINT_HOLE", { x: q(60 + (u % 22) * 0.91), y: q(60 + ((u * 3) % 22) * 0.89) }, 2.2, "CIRCLE_HOLE")],
        coverageTags: ["DIAGONAL_ANTI"],
      };
    }

    case "PFC-PROT-07-DIAGONAL-PLUS-AXIAL": {
      if (u % 2 === 0) {
        return {
          folds: [
            verticalFold("F1", 50, "NEGATIVE"),
            { foldId: "F2", kind: "DIAGONAL", line: { a: { x: 0, y: 0 }, b: { x: 50, y: 50 } }, movingSide: "POSITIVE" },
          ],
          cuts: [visualCut("C1", "POINT_HOLE", { x: q(30 + (u % 12) * 1.07), y: q(8 + (u % 11) * 0.97) }, 2, "CIRCLE_HOLE")],
          coverageTags: ["MIXED_AXIAL_THEN_DIAGONAL"],
        };
      }
      return {
        folds: [
          { foldId: "F1", kind: "DIAGONAL", line: { a: { x: 0, y: 0 }, b: { x: 100, y: 100 } }, movingSide: "POSITIVE" },
          verticalFold("F2", 50, "NEGATIVE"),
        ],
        cuts: [visualCut("C1", "POINT_HOLE", { x: q(31 + (u % 12) * 1.01), y: q(8 + (u % 10) * 0.93) }, 2, "CIRCLE_HOLE")],
        coverageTags: ["MIXED_DIAGONAL_THEN_AXIAL"],
      };
    }

    case "PFC-PROT-08-MULTIPLE-CUTS": {
      const folds = [verticalFold("F1", 50, "NEGATIVE"), horizontalFold("F2", 50, "POSITIVE")];
      const c1 = { x: q(12 + (u % 17) * 0.91), y: q(14 + (u % 16) * 0.93) };
      const c2 = { x: q(31 + (u % 11) * 0.83), y: q(29 + ((u * 3) % 11) * 0.79) };
      if (mode === 0) {
        return {
          folds,
          cuts: [visualCut("C1", "POINT_HOLE", c1, 2, "CIRCLE_HOLE"), visualCut("C2", "POINT_HOLE", c2, 2.6, "CIRCLE_HOLE")],
          coverageTags: ["MULTI_TWO_HOLES"],
        };
      }
      if (mode === 1) {
        return {
          folds,
          cuts: [
            visualCut("C1", "POINT_HOLE", c1, 2.2, "CIRCLE_HOLE"),
            visualCut("N1", "BOUNDARY_NOTCH", { x: q(28 + (u % 15) * 0.97), y: 0 }, 3.2, "V_NOTCH"),
          ],
          coverageTags: ["MIXED_HOLE_EDGE_NOTCH"],
        };
      }
      if (mode === 2) {
        return {
          folds,
          cuts: [
            visualCut("C1", "POINT_HOLE", c1, 2.2, "CIRCLE_HOLE"),
            visualCut("C2", "POINT_HOLE", c2, 3.3, "TRIANGLE_CUT"),
          ],
          coverageTags: ["MIXED_HOLE_TRIANGLE_CUT"],
        };
      }
      return {
        folds,
        cuts: [
          visualCut("C1", "POINT_HOLE", c1, 3.2, "TRIANGLE_CUT"),
          visualCut("C2", "POINT_HOLE", c2, 3.8, "STRAIGHT_SLIT"),
        ],
        coverageTags: ["MIXED_TRIANGLE_SLIT"],
      };
    }

    case "PFC-PROT-09-MULTI-FOLD-EDGE-NOTCH": {
      const folds = [verticalFold("F1", 50, "NEGATIVE"), horizontalFold("F2", 50, "POSITIVE")];
      if (mode === 0) {
        return {
          folds,
          cuts: [visualCut("N1", "BOUNDARY_NOTCH", { x: q(10 + (u % 28) * 1.07), y: 0 }, 3.2, "V_NOTCH")],
          coverageTags: ["MULTIFOLD_OUTER_V_NOTCH"],
        };
      }
      if (mode === 1) {
        return {
          folds,
          cuts: [visualCut("N1", "BOUNDARY_NOTCH", { x: 0, y: q(10 + (u % 28) * 1.07) }, 3.2, "SEMICIRCLE_NOTCH")],
          coverageTags: ["MULTIFOLD_OUTER_SEMICIRCLE_NOTCH"],
        };
      }
      if (mode === 2) {
        return {
          folds,
          cuts: [visualCut("N1", "BOUNDARY_NOTCH", { x: 50, y: q(10 + (u % 28) * 1.07) }, 3.2, "V_NOTCH")],
          coverageTags: ["MULTIFOLD_FOLD_EDGE_V_NOTCH"],
        };
      }
      return {
        folds,
        cuts: [visualCut("N1", "BOUNDARY_NOTCH", { x: q(10 + (u % 28) * 1.07), y: 50 }, 3.2, "SEMICIRCLE_NOTCH")],
        coverageTags: ["MULTIFOLD_FOLD_EDGE_SEMICIRCLE_NOTCH"],
      };
    }

    case "PFC-PROT-10-THREE-FOLD-ADVANCED": {
      if (u % 2 === 0) {
        return {
          folds: [verticalFold("F1", 50, "NEGATIVE"), horizontalFold("F2", 50, "POSITIVE"), verticalFold("F3", 25, "NEGATIVE")],
          cuts: [visualCut("C1", "POINT_HOLE", { x: q(6 + (u % 15) * 0.93), y: q(8 + (u % 31) * 1.03) }, 2, "CIRCLE_HOLE")],
          coverageTags: ["THREE_FOLD_VERTICAL_HORIZONTAL_VERTICAL"],
        };
      }
      return {
        folds: [horizontalFold("F1", 50, "POSITIVE"), verticalFold("F2", 50, "NEGATIVE"), horizontalFold("F3", 25, "POSITIVE")],
        cuts: [visualCut("C1", "POINT_HOLE", { x: q(8 + (u % 31) * 1.03), y: q(6 + (u % 15) * 0.93) }, 2, "CIRCLE_HOLE")],
        coverageTags: ["THREE_FOLD_HORIZONTAL_VERTICAL_HORIZONTAL"],
      };
    }
  }
}

function answerImprints(solution: V4Solution): PfcVisualImprintV4[] {
  return solution.cuts.flatMap((cut) => cut.mappedCuts.map((mapped) => ({
    x: q(mapped.originalCenter.x),
    y: q(mapped.originalCenter.y),
    kind: mapped.kind,
    contact: mapped.originalContact,
    visualKind: mapped.visualKind,
  })));
}

function imprintFingerprint(imprints: readonly PfcVisualImprintV4[]): string {
  return imprints
    .map((imprint) => `${imprint.kind}|${imprint.visualKind}|${imprint.contact}|${q(imprint.x)},${q(imprint.y)}`)
    .sort()
    .join(";");
}

function uniqueImprints(imprints: readonly PfcVisualImprintV4[]): PfcVisualImprintV4[] {
  const unique = new Map<string, PfcVisualImprintV4>();
  for (const imprint of imprints) {
    const key = `${imprint.kind}|${imprint.visualKind}|${imprint.contact}|${q(imprint.x)},${q(imprint.y)}`;
    if (!unique.has(key)) unique.set(key, { ...imprint });
  }
  return [...unique.values()].sort((left, right) =>
    left.x - right.x || left.y - right.y || left.visualKind.localeCompare(right.visualKind),
  );
}

function shifted(correct: readonly PfcVisualImprintV4[], dx: number, dy: number): PfcVisualImprintV4[] {
  return correct.map((imprint, index) => {
    if (imprint.contact === "BOUNDARY") {
      if (Math.abs(imprint.y) <= EPSILON || Math.abs(imprint.y - 100) <= EPSILON) {
        return { ...imprint, x: q(Math.min(94, Math.max(6, imprint.x + (index % 2 === 0 ? dx : -dx)))) };
      }
      if (Math.abs(imprint.x) <= EPSILON || Math.abs(imprint.x - 100) <= EPSILON) {
        return { ...imprint, y: q(Math.min(94, Math.max(6, imprint.y + (index % 2 === 0 ? dy : -dy)))) };
      }
    }
    return {
      ...imprint,
      x: q(Math.min(94, Math.max(6, imprint.x + (index % 2 === 0 ? dx : -dx)))),
      y: q(Math.min(94, Math.max(6, imprint.y + (index % 2 === 0 ? dy : -dy)))),
    };
  });
}

function distractorCandidates(
  correct: readonly PfcVisualImprintV4[],
  variantIndex: number,
): Array<{ misconception: Exclude<PfcMisconceptionV1, "CORRECT">; imprints: PfcVisualImprintV4[] }> {
  const half = Math.max(1, Math.ceil(correct.length / 2));
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
  const seed = correct[0] ?? {
    x: 50,
    y: 50,
    kind: "POINT_HOLE" as const,
    contact: "INTERIOR" as const,
    visualKind: "CIRCLE_HOLE" as const,
  };
  const extra: PfcVisualImprintV4 = {
    ...seed,
    contact: "INTERIOR",
    x: q(44 + (variantIndex % 9)),
    y: q(57 - (variantIndex % 7)),
  };

  return [
    { misconception: "INCOMPLETE_UNFOLD", imprints: correct.slice(0, half).map((item) => ({ ...item })) },
    { misconception: "ONE_LAYER_ONLY", imprints: correct.length ? [{ ...correct[correct.length - 1] }] : [] },
    { misconception: "WRONG_CUT_POSITION", imprints: shifted(correct, 7, -6) },
    { misconception: "WRONG_CUT_POSITION", imprints: shifted(correct, 10, 8) },
    { misconception: "EDGE_TREATED_AS_INTERIOR", imprints: boundaryAsInterior },
    { misconception: "EXTRA_IMPRINT", imprints: [...correct.map((item) => ({ ...item })), extra] },
  ];
}

function buildOptions(correct: readonly PfcVisualImprintV4[], variantIndex: number): {
  options: PfcVisualOptionV4[];
  correctOptionIndex: number;
} {
  const cleanedCorrect = uniqueImprints(correct);
  const correctFingerprint = imprintFingerprint(cleanedCorrect);
  const selected: Array<{ misconception: PfcMisconceptionV1; imprints: PfcVisualImprintV4[]; fingerprint: string }> = [{
    misconception: "CORRECT",
    imprints: cleanedCorrect,
    fingerprint: correctFingerprint,
  }];
  const seen = new Set([correctFingerprint]);

  for (const candidate of distractorCandidates(cleanedCorrect, variantIndex)) {
    const imprints = uniqueImprints(candidate.imprints);
    const fingerprint = imprintFingerprint(imprints);
    if (!fingerprint || seen.has(fingerprint)) continue;
    const probe: PfcDiscoveryOptionV1 = {
      optionId: "A",
      misconception: candidate.misconception,
      imprints,
      fingerprint,
    };
    if (!pfcDiscoveryOptionIsReadableV1(probe)) continue;
    seen.add(fingerprint);
    selected.push({ ...candidate, imprints, fingerprint });
    if (selected.length === 4) break;
  }

  if (selected.length !== 4) {
    throw new Error(`PFC V4 option synthesis produced only ${selected.length} readable options at variant ${variantIndex}.`);
  }

  const rotation = variantIndex % 4;
  const ordered = [...selected.slice(rotation), ...selected.slice(0, rotation)];
  const options = ordered.map<PfcVisualOptionV4>((option, index) => ({
    optionId: OPTION_IDS[index],
    misconception: option.misconception,
    imprints: option.imprints,
    fingerprint: option.fingerprint,
  }));
  const correctOptionIndex = options.findIndex((option) => option.fingerprint === correctFingerprint);
  if (correctOptionIndex < 0) throw new Error("PFC V4 correct option lost during permutation.");
  return { options, correctOptionIndex };
}

function semanticFingerprint(
  question: PfcDiscoveryQuestionV1,
  folds: readonly PfcFoldV1[],
  cuts: readonly PfcVisualCutV4[],
  unfoldedFingerprint: string,
  coverageTags: readonly string[],
): string {
  const foldFingerprint = folds
    .map((fold) => `${fold.kind}:${q(fold.line.a.x)},${q(fold.line.a.y)}>${q(fold.line.b.x)},${q(fold.line.b.y)}:${fold.movingSide}`)
    .join("|");
  const cutFingerprint = cuts
    .map((cut) => `${cut.kind}:${cut.visualKind}:${q(cut.center.x)},${q(cut.center.y)}:${q(cut.radius)}`)
    .join("|");
  return `${question.representationId}::${coverageTags.join("+")}::${foldFingerprint}::${cutFingerprint}::${unfoldedFingerprint}`;
}

function explanation(question: PfcDiscoveryQuestionV1, solution: V4Solution, coverageTags: readonly string[], answer: string): string {
  const layerCounts = solution.cuts.map((cut) => cut.affectedLayerCount);
  const markCount = solution.cuts.reduce((sum, cut) => sum + cut.mappedCuts.length, 0);
  const foldCount = question.folds.length;
  const hasEdgeCut = coverageTags.some((tag) => tag.includes("NOTCH") || tag.includes("FOLD_LINE"));
  const hasMixedCuts = coverageTags.some((tag) => tag.startsWith("MIXED_"));
  const orderSensitive = coverageTags.some((tag) => tag.startsWith("MIXED_AXIAL") || tag.startsWith("MIXED_DIAGONAL"));

  if (hasMixedCuts) {
    return `The folded packet has different cut marks, so each mark must be unfolded separately through the layers it actually touches. Open the folds in reverse order and keep the hole/notch or cut shapes distinct. This gives ${markCount} final mark${markCount === 1 ? "" : "s"}, matching option ${answer}.`;
  }
  if (hasEdgeCut) {
    return `The cut is made on an edge of the folded packet. When the folds are opened in reverse order, the cut is mirrored only through the layers that meet that edge. A cut made on a crease can join into one interior shape after opening. The resulting pattern is option ${answer}.`;
  }
  if (orderSensitive) {
    return `There are ${foldCount} folds on different axes. Open the last fold first and then reverse the earlier fold. The existing mark is reflected across each fold line in that order, giving the arrangement in option ${answer}.`;
  }
  return `The cut passes through ${layerCounts.join(" and ")} physical layer${layerCounts.every((count) => count === 1) ? "" : "s"}. Open the ${foldCount === 1 ? "fold" : `${foldCount} folds`} in reverse order and mirror each existing mark across the crease being opened. The final pattern is option ${answer}.`;
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

export function generatePfcDiscoveryQuestionV4(discoveryIndex: number): PfcDiscoveryQuestionV4 {
  const base = generatePfcDiscoveryQuestionV3(discoveryIndex);
  const scenario = scenarioV4(base);
  const solution = solveV4(base.sheetBoundary, scenario.folds, scenario.cuts);
  const correct = answerImprints(solution);
  const { options, correctOptionIndex } = buildOptions(correct, base.variantIndex);
  const correctOptionId = options[correctOptionIndex].optionId;

  const questionForExplanation: PfcDiscoveryQuestionV1 = {
    ...base,
    folds: scenario.folds,
    cuts: scenario.cuts,
    options,
    correctOptionIndex,
    correctOptionId,
  };

  return {
    ...base,
    folds: scenario.folds,
    cuts: scenario.cuts,
    foldedLayerCounts: foldedLayerCounts(base.sheetBoundary, scenario.folds),
    unfoldedFingerprint: solution.unfoldedFingerprint,
    options,
    correctOptionIndex,
    correctOptionId,
    explanation: explanation(questionForExplanation, solution, scenario.coverageTags, correctOptionId),
    semanticFingerprint: semanticFingerprint(base, scenario.folds, scenario.cuts, solution.unfoldedFingerprint, scenario.coverageTags),
    coverageTags: [...scenario.coverageTags],
    remediationAuthorityId: PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4.authorityId,
  };
}

export function generatePfcDiscoveryCorpusV4(): PfcDiscoveryQuestionV4[] {
  return Array.from({ length: 800 }, (_, index) => generatePfcDiscoveryQuestionV4(index));
}

function polygonPoints(points: readonly SpatialPoint[]): string {
  return points.map((point) => `${q(point.x)},${q(point.y)}`).join(" ");
}

function boundsForFragments(fragments: readonly PfcLayerFragmentV1[]) {
  const points = fragments.flatMap((fragment) => fragment.polygon);
  return {
    minX: Math.min(...points.map((point) => point.x)),
    maxX: Math.max(...points.map((point) => point.x)),
    minY: Math.min(...points.map((point) => point.y)),
    maxY: Math.max(...points.map((point) => point.y)),
  };
}

function cutEdge(center: SpatialPoint, bounds: ReturnType<typeof boundsForFragments>): "TOP" | "RIGHT" | "BOTTOM" | "LEFT" | null {
  const candidates = [
    { edge: "TOP" as const, distance: Math.abs(center.y - bounds.minY) },
    { edge: "RIGHT" as const, distance: Math.abs(center.x - bounds.maxX) },
    { edge: "BOTTOM" as const, distance: Math.abs(center.y - bounds.maxY) },
    { edge: "LEFT" as const, distance: Math.abs(center.x - bounds.minX) },
  ].sort((a, b) => a.distance - b.distance);
  return candidates[0].distance <= 0.8 ? candidates[0].edge : null;
}

function vNotchPath(center: SpatialPoint, radius: number, edge: ReturnType<typeof cutEdge>): string {
  const r = Math.max(3, radius);
  if (edge === "TOP") return `<path d="M ${q(center.x - r)} ${q(center.y - 0.8)} L ${q(center.x)} ${q(center.y + r * 1.35)} L ${q(center.x + r)} ${q(center.y - 0.8)} Z" fill="white" stroke="black" stroke-width="1.6"/>`;
  if (edge === "BOTTOM") return `<path d="M ${q(center.x - r)} ${q(center.y + 0.8)} L ${q(center.x)} ${q(center.y - r * 1.35)} L ${q(center.x + r)} ${q(center.y + 0.8)} Z" fill="white" stroke="black" stroke-width="1.6"/>`;
  if (edge === "LEFT") return `<path d="M ${q(center.x - 0.8)} ${q(center.y - r)} L ${q(center.x + r * 1.35)} ${q(center.y)} L ${q(center.x - 0.8)} ${q(center.y + r)} Z" fill="white" stroke="black" stroke-width="1.6"/>`;
  if (edge === "RIGHT") return `<path d="M ${q(center.x + 0.8)} ${q(center.y - r)} L ${q(center.x - r * 1.35)} ${q(center.y)} L ${q(center.x + 0.8)} ${q(center.y + r)} Z" fill="white" stroke="black" stroke-width="1.6"/>`;
  return `<polygon points="${q(center.x)},${q(center.y - r)} ${q(center.x + r)},${q(center.y)} ${q(center.x)},${q(center.y + r)} ${q(center.x - r)},${q(center.y)}" fill="white" stroke="black" stroke-width="1.6"/>`;
}

function semicircleNotch(center: SpatialPoint, radius: number, edge: ReturnType<typeof cutEdge>): string {
  const r = Math.max(3, radius);
  if (edge === "TOP") return `<path d="M ${q(center.x - r)} ${q(center.y)} A ${r} ${r} 0 0 0 ${q(center.x + r)} ${q(center.y)} L ${q(center.x - r)} ${q(center.y)} Z" fill="white" stroke="black" stroke-width="1.6"/>`;
  if (edge === "BOTTOM") return `<path d="M ${q(center.x - r)} ${q(center.y)} A ${r} ${r} 0 0 1 ${q(center.x + r)} ${q(center.y)} L ${q(center.x - r)} ${q(center.y)} Z" fill="white" stroke="black" stroke-width="1.6"/>`;
  if (edge === "LEFT") return `<path d="M ${q(center.x)} ${q(center.y - r)} A ${r} ${r} 0 0 1 ${q(center.x)} ${q(center.y + r)} L ${q(center.x)} ${q(center.y - r)} Z" fill="white" stroke="black" stroke-width="1.6"/>`;
  if (edge === "RIGHT") return `<path d="M ${q(center.x)} ${q(center.y - r)} A ${r} ${r} 0 0 0 ${q(center.x)} ${q(center.y + r)} L ${q(center.x)} ${q(center.y - r)} Z" fill="white" stroke="black" stroke-width="1.6"/>`;
  return `<circle cx="${q(center.x)}" cy="${q(center.y)}" r="${q(r)}" fill="white" stroke="black" stroke-width="1.6"/>`;
}

function renderVisualMark(
  center: SpatialPoint,
  visualKind: PfcCutVisualKindV4,
  radius: number,
  edge: ReturnType<typeof cutEdge>,
  filledHole: boolean,
): string {
  const r = Math.max(2.7, radius);
  if (visualKind === "CIRCLE_HOLE") {
    return `<circle cx="${q(center.x)}" cy="${q(center.y)}" r="${q(r)}" fill="${filledHole ? "black" : "white"}" stroke="black" stroke-width="1.6"/>`;
  }
  if (visualKind === "V_NOTCH") return vNotchPath(center, r, edge);
  if (visualKind === "SEMICIRCLE_NOTCH") return semicircleNotch(center, r, edge);
  if (visualKind === "TRIANGLE_CUT") {
    return `<polygon points="${q(center.x)},${q(center.y - r)} ${q(center.x + r)},${q(center.y + r)} ${q(center.x - r)},${q(center.y + r)}" fill="white" stroke="black" stroke-width="1.6"/>`;
  }
  return `<line x1="${q(center.x - r * 1.35)}" y1="${q(center.y)}" x2="${q(center.x + r * 1.35)}" y2="${q(center.y)}" stroke="black" stroke-width="2.2" stroke-linecap="round"/>`;
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
  const anchor = {
    x: fold.line.a.x + dx * anchorT,
    y: fold.line.a.y + dy * anchorT,
  };
  const start = { x: anchor.x + nx * sign * 21, y: anchor.y + ny * sign * 21 };
  const end = { x: anchor.x - nx * sign * 5, y: anchor.y - ny * sign * 5 };
  return `<line x1="${q(start.x)}" y1="${q(start.y)}" x2="${q(end.x)}" y2="${q(end.y)}" stroke="black" stroke-width="2.2" marker-end="url(#${markerId})"/>`;
}

function renderCurrentFragments(fragments: readonly PfcLayerFragmentV1[]): string {
  return fragments
    .map((fragment) => `<polygon points="${polygonPoints(fragment.polygon)}" fill="white" stroke="black" stroke-width="1.35"/>`)
    .join("");
}

function renderMovingShade(fragments: readonly PfcLayerFragmentV1[], fold: PfcFoldV1): string {
  return fragments
    .map((fragment) => clipPolygonToFoldSideV1(fragment.polygon, fold.line, fold.movingSide))
    .filter((polygon) => polygon.length >= 3)
    .map((polygon) => `<polygon points="${polygonPoints(polygon)}" fill="#eeeeee" stroke="none"/>`)
    .join("");
}

export function renderPfcDiscoveryStimulusSvgV4(question: PfcDiscoveryQuestionV4 | PfcDiscoveryQuestionV1, size = 640): string {
  const visualQuestion = question as PfcDiscoveryQuestionV4;
  let fragments: PfcLayerFragmentV1[] = [{
    fragmentId: "SHEET-ROOT",
    sourceSheetRegionId: "SHEET-ROOT",
    polygon: question.sheetBoundary.map((point) => ({ ...point })),
    transformHistory: [],
  }];

  const panelWidth = 132;
  const panelCount = question.folds.length + 1;
  const panels: string[] = [];
  const markerId = `pfc-v4-arrow-${question.questionId.replace(/[^a-zA-Z0-9]/g, "")}`;

  question.folds.forEach((fold, index) => {
    const x = 8 + index * panelWidth;
    const current = renderCurrentFragments(fragments);
    const shade = renderMovingShade(fragments, fold);
    panels.push(`<g transform="translate(${x},17)"><text x="50" y="-6" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" font-weight="700">Fold ${index + 1}</text>${current}${shade}<line x1="${q(fold.line.a.x)}" y1="${q(fold.line.a.y)}" x2="${q(fold.line.b.x)}" y2="${q(fold.line.b.y)}" stroke="black" stroke-width="1.25" stroke-dasharray="4 3"/>${foldArrow(fold, markerId)}</g>`);
    fragments = applyPfcFoldV1(fragments, fold);
  });

  const finalX = 8 + question.folds.length * panelWidth;
  const bounds = boundsForFragments(fragments);
  const cuts = (visualQuestion.cuts ?? question.cuts).map((cut) => {
    const visual = (cut as PfcVisualCutV4).visualKind ?? (cut.kind === "BOUNDARY_NOTCH" ? "V_NOTCH" : "CIRCLE_HOLE");
    return renderVisualMark(cut.center, visual, cut.radius, cutEdge(cut.center, bounds), true);
  }).join("");
  panels.push(`<g transform="translate(${finalX},17)"><text x="50" y="-6" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" font-weight="700">Cut / Punch</text>${renderCurrentFragments(fragments)}${cuts}</g>`);

  const separators = Array.from({ length: panelCount - 1 }, (_, index) => {
    const x = 8 + (index + 1) * panelWidth - 17;
    return `<text x="${x}" y="72" font-family="Arial,sans-serif" font-size="18">→</text>`;
  }).join("");
  const viewWidth = 20 + panelCount * panelWidth;
  const viewHeight = 132;
  const scale = size / Math.max(viewWidth, viewHeight);
  const width = Math.round(viewWidth * scale);
  const height = Math.round(viewHeight * scale);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${viewWidth} ${viewHeight}" role="img" aria-label="Paper folding and cutting sequence"><defs><marker id="${markerId}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="black"/></marker></defs><rect width="100%" height="100%" fill="white"/>${panels.join("")}${separators}</svg>`;
}

export function renderPfcDiscoveryOptionSvgV4(option: PfcVisualOptionV4 | PfcDiscoveryOptionV1, size = 124): string {
  const imprints = option.imprints as PfcVisualImprintV4[];
  const marks = imprints.map((imprint) => {
    const visual = imprint.visualKind ?? (imprint.kind === "BOUNDARY_NOTCH" ? "V_NOTCH" : "CIRCLE_HOLE");
    let edge: ReturnType<typeof cutEdge> = null;
    if (imprint.contact === "BOUNDARY") {
      if (Math.abs(imprint.y) <= EPSILON) edge = "TOP";
      else if (Math.abs(imprint.x - 100) <= EPSILON) edge = "RIGHT";
      else if (Math.abs(imprint.y - 100) <= EPSILON) edge = "BOTTOM";
      else if (Math.abs(imprint.x) <= EPSILON) edge = "LEFT";
    }
    return renderVisualMark({ x: imprint.x, y: imprint.y }, visual, visual === "STRAIGHT_SLIT" ? 3.8 : 3.1, edge, false);
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="-7 -7 114 114" role="img" aria-label="Unfolded paper option"><rect width="114" height="114" x="-7" y="-7" fill="white"/><rect x="0" y="0" width="100" height="100" fill="white" stroke="black" stroke-width="2"/>${marks}</svg>`;
}

export function renderPfcDiscoveryReviewHtmlV4(questions: readonly PfcDiscoveryQuestionV4[]): string {
  const cards = questions.map((question) => `<article style="border-top:1px solid #999;padding:20px 0 24px;margin:0;background:#fff"><h2 style="font-size:17px;margin:0 0 5px">${question.questionId} · ${question.representationId}</h2><p style="margin:3px 0 9px;font-size:13px"><strong>${question.difficulty}</strong> · ${question.representationTitle} · ${question.coverageTags.join(", ")}</p><p style="margin:8px 0 12px"><strong>Question:</strong> A square paper is folded in the arrow direction and cut as shown. Which option shows the paper after it is fully unfolded?</p><div style="overflow:auto;background:#fff">${renderPfcDiscoveryStimulusSvgV4(question, 640)}</div><div style="display:grid;grid-template-columns:repeat(4,minmax(124px,1fr));gap:18px;margin:18px 0 8px">${question.options.map((option) => `<div style="text-align:center;background:#fff"><strong>${option.optionId}</strong><div>${renderPfcDiscoveryOptionSvgV4(option, 124)}</div></div>`).join("")}</div><p style="margin:10px 0 4px"><strong>Answer:</strong> ${question.correctOptionId}</p><p style="margin:4px 0"><strong>Explanation:</strong> ${question.explanation}</p></article>`).join("\n");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PFC-001 Visual Taxonomy Remediation V4</title></head><body style="font-family:Arial,sans-serif;background:#fff;color:#111;max-width:1120px;margin:0 auto;padding:20px"><h1 style="font-size:24px">PFC-001 Visual Taxonomy Remediation V4</h1><p>White exam-style review surface. Each fold panel shows the state before that fold, the crease, shaded moving side, and arrow. Boundary notches are drawn as true edge removals; fold-line notches coalesce into interior cuts after unfolding.</p>${cards}</body></html>`;
}

export function pfcV4CoverageTags(): string[] {
  return [...new Set(generatePfcDiscoveryCorpusV4().flatMap((question) => question.coverageTags))].sort();
}

export function pfcV4RepresentationCoverage(): Record<string, string[]> {
  const result: Record<string, Set<string>> = {};
  for (const representation of PFC_001_REPRESENTATION_CATALOG_V1) result[representation.id] = new Set<string>();
  for (const question of generatePfcDiscoveryCorpusV4()) {
    for (const tag of question.coverageTags) result[question.representationId].add(tag);
  }
  return Object.fromEntries(Object.entries(result).map(([id, tags]) => [id, [...tags].sort()]));
}
