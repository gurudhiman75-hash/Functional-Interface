import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_001_FOUNDATION_AUTHORITY_V1,
  PfcFoundationErrorV1,
  canonicalPfcCutPositionsV1,
  createSquarePfcSheetV1,
  solvePfcCutsV1,
  type PfcFoldV1,
} from "../foundation/spatial/paper-folding-foundation-v1";

const sheet = createSquarePfcSheetV1(100);

const verticalRightToLeft: PfcFoldV1 = {
  foldId: "F-V",
  kind: "VERTICAL",
  line: { a: { x: 50, y: 0 }, b: { x: 50, y: 100 } },
  movingSide: "NEGATIVE",
};

const horizontalBottomToTop: PfcFoldV1 = {
  foldId: "F-H",
  kind: "HORIZONTAL",
  line: { a: { x: 0, y: 50 }, b: { x: 100, y: 50 } },
  movingSide: "POSITIVE",
};

const mainDiagonal: PfcFoldV1 = {
  foldId: "F-D",
  kind: "DIAGONAL",
  line: { a: { x: 0, y: 0 }, b: { x: 100, y: 100 } },
  movingSide: "POSITIVE",
};

const singleAxial = solvePfcCutsV1(sheet, [verticalRightToLeft], [
  { cutId: "C1", kind: "POINT_HOLE", center: { x: 20, y: 30 }, radius: 2 },
]);
assert.equal(singleAxial.cuts[0].affectedLayerCount, 2);
assert.deepEqual(canonicalPfcCutPositionsV1(singleAxial, "C1"), [
  { x: 20, y: 30, contact: "INTERIOR" },
  { x: 80, y: 30, contact: "INTERIOR" },
]);

const perpendicular = solvePfcCutsV1(
  sheet,
  [verticalRightToLeft, horizontalBottomToTop],
  [{ cutId: "C2", kind: "POINT_HOLE", center: { x: 20, y: 30 }, radius: 2 }],
);
assert.equal(perpendicular.cuts[0].affectedLayerCount, 4);
assert.deepEqual(canonicalPfcCutPositionsV1(perpendicular, "C2"), [
  { x: 20, y: 30, contact: "INTERIOR" },
  { x: 20, y: 70, contact: "INTERIOR" },
  { x: 80, y: 30, contact: "INTERIOR" },
  { x: 80, y: 70, contact: "INTERIOR" },
]);

const diagonal = solvePfcCutsV1(sheet, [mainDiagonal], [
  { cutId: "C3", kind: "POINT_HOLE", center: { x: 70, y: 30 }, radius: 2 },
]);
assert.equal(diagonal.cuts[0].affectedLayerCount, 2);
assert.deepEqual(canonicalPfcCutPositionsV1(diagonal, "C3"), [
  { x: 30, y: 70, contact: "INTERIOR" },
  { x: 70, y: 30, contact: "INTERIOR" },
]);

const diagonalOnHalf: PfcFoldV1 = {
  foldId: "F-D-HALF",
  kind: "DIAGONAL",
  line: { a: { x: 0, y: 0 }, b: { x: 50, y: 50 } },
  movingSide: "POSITIVE",
};
const mixedOrder = solvePfcCutsV1(
  sheet,
  [verticalRightToLeft, diagonalOnHalf],
  [{ cutId: "C4", kind: "POINT_HOLE", center: { x: 40, y: 20 }, radius: 2 }],
);
assert.equal(mixedOrder.cuts[0].affectedLayerCount, 4);
assert.deepEqual(canonicalPfcCutPositionsV1(mixedOrder, "C4"), [
  { x: 20, y: 40, contact: "INTERIOR" },
  { x: 40, y: 20, contact: "INTERIOR" },
  { x: 60, y: 20, contact: "INTERIOR" },
  { x: 80, y: 40, contact: "INTERIOR" },
]);

const boundaryNotch = solvePfcCutsV1(sheet, [verticalRightToLeft], [
  { cutId: "N1", kind: "BOUNDARY_NOTCH", center: { x: 20, y: 0 }, radius: 3 },
]);
assert.equal(boundaryNotch.cuts[0].affectedLayerCount, 2);
assert.deepEqual(canonicalPfcCutPositionsV1(boundaryNotch, "N1"), [
  { x: 20, y: 0, contact: "BOUNDARY" },
  { x: 80, y: 0, contact: "BOUNDARY" },
]);

const multiCut = solvePfcCutsV1(sheet, [verticalRightToLeft], [
  { cutId: "M1", kind: "POINT_HOLE", center: { x: 15, y: 25 }, radius: 2 },
  { cutId: "M2", kind: "POINT_HOLE", center: { x: 35, y: 40 }, radius: 2 },
]);
assert.deepEqual(canonicalPfcCutPositionsV1(multiCut, "M1"), [
  { x: 15, y: 25, contact: "INTERIOR" },
  { x: 85, y: 25, contact: "INTERIOR" },
]);
assert.deepEqual(canonicalPfcCutPositionsV1(multiCut, "M2"), [
  { x: 35, y: 40, contact: "INTERIOR" },
  { x: 65, y: 40, contact: "INTERIOR" },
]);

const replayA = solvePfcCutsV1(
  sheet,
  [verticalRightToLeft, horizontalBottomToTop],
  [{ cutId: "R", kind: "POINT_HOLE", center: { x: 17, y: 29 }, radius: 2 }],
);
const replayB = solvePfcCutsV1(
  sheet,
  [verticalRightToLeft, horizontalBottomToTop],
  [{ cutId: "R", kind: "POINT_HOLE", center: { x: 17, y: 29 }, radius: 2 }],
);
assert.equal(replayA.unfoldedFingerprint, replayB.unfoldedFingerprint);
assert.deepEqual(replayA.foldSnapshots, replayB.foldSnapshots);

assert.throws(
  () =>
    solvePfcCutsV1(sheet, [verticalRightToLeft], [
      { cutId: "MISS", kind: "POINT_HOLE", center: { x: 70, y: 30 }, radius: 2 },
    ]),
  (error: unknown) =>
    error instanceof PfcFoundationErrorV1 &&
    error.code === "PFC_CUT_MISSES_FOLDED_MATERIAL",
);

assert.throws(
  () =>
    solvePfcCutsV1(
      sheet,
      [
        {
          foldId: "BAD",
          kind: "GENERAL_LINE",
          line: { a: { x: 0, y: -10 }, b: { x: 100, y: -10 } },
          movingSide: "POSITIVE",
        },
      ],
      [],
    ),
  (error: unknown) =>
    error instanceof PfcFoundationErrorV1 && error.code === "PFC_INVALID_FOLD_LINE",
);

const evidence = {
  authority: PFC_001_FOUNDATION_AUTHORITY_V1,
  status: "PASS_PFC_001_FOUNDATION_V1",
  proofs: {
    singleAxial: canonicalPfcCutPositionsV1(singleAxial, "C1"),
    perpendicular: canonicalPfcCutPositionsV1(perpendicular, "C2"),
    diagonal: canonicalPfcCutPositionsV1(diagonal, "C3"),
    mixedOrder: canonicalPfcCutPositionsV1(mixedOrder, "C4"),
    boundaryNotch: canonicalPfcCutPositionsV1(boundaryNotch, "N1"),
    multiCut: {
      M1: canonicalPfcCutPositionsV1(multiCut, "M1"),
      M2: canonicalPfcCutPositionsV1(multiCut, "M2"),
    },
  },
  guarantees: {
    semanticAuthorityNotSvg: true,
    layerCoverageDerivedFromFragments: true,
    inverseMappingUsesPerFragmentReflectionHistory: true,
    optionIndexUsedBySolver: false,
    deterministicReplay: true,
    frozenExistingSpatialQlRange: "SPA-QL-001..SPA-QL-034",
    permanentPfcQlAllocation: "NOT_YET_ALLOCATED",
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-001-foundation-v1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify(evidence));
