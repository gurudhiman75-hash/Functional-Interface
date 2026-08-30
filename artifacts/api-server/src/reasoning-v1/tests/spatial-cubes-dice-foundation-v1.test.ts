import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  ALL_CUBE_FACES_V1,
  CND_001_FOUNDATION_AUTHORITY_V1,
  CUBE_ORIENTATIONS_V1,
  buildStableVoxelStackFromHeightsV1,
  enumeratePaintedCuboidCellsV1,
  exposedVoxelFaceCountV1,
  foldCubeNetV1,
  observeCubeV1,
  oppositeCubeFaceV1,
  oppositeNetLabelV1,
  paintedFaceCountDistributionV1,
  voxelProjectionCountV1,
  type CubeLabelAssignmentV1,
  type CubeNetCellV1,
} from "../foundation/spatial/cubes-dice-foundation-v1";
import {
  CND_001_PRODUCTION_GENERATOR_AUTHORITY_V1,
  generateCubesDiceCandidateQuestionV1,
  type CubesDiceTaskKindV1,
} from "../foundation/spatial/cubes-dice-production-generator-v1";

assert.equal(CND_001_FOUNDATION_AUTHORITY_V1.nextPermanentQlId, "SPA-QL-043");
assert.equal(CUBE_ORIENTATIONS_V1.length, 24, "Cube orientation group must contain exactly 24 proper rotations.");
assert.equal(new Set(CUBE_ORIENTATIONS_V1.map((orientation) => JSON.stringify(orientation.worldFaceToCanonicalFace))).size, 24);
assert.equal(oppositeCubeFaceV1("U"), "D");
assert.equal(oppositeCubeFaceV1("F"), "B");
assert.equal(oppositeCubeFaceV1("R"), "L");

const assignment: CubeLabelAssignmentV1 = Object.freeze({ U: "1", D: "6", F: "2", B: "5", R: "3", L: "4" });
const observedTriples = CUBE_ORIENTATIONS_V1.map((orientation) => observeCubeV1(assignment, orientation));
assert.equal(new Set(observedTriples.map((view) => `${view.top}|${view.front}|${view.right}`)).size, 24, "Every proper die rotation must produce a unique ordered visible triplet for unique labels.");

const validNet: readonly CubeNetCellV1[] = Object.freeze([
  { id: "c0", x: 1, y: 1, label: "A" },
  { id: "c1", x: 0, y: 1, label: "B" },
  { id: "c2", x: 2, y: 1, label: "C" },
  { id: "c3", x: 1, y: 0, label: "D" },
  { id: "c4", x: 1, y: 2, label: "E" },
  { id: "c5", x: 1, y: 3, label: "F" },
]);
const folded = foldCubeNetV1(validNet);
assert.equal(folded.valid, true);
assert.equal(new Set(Object.values(folded.normalByCellId).map((normal) => normal.join(","))).size, 6);
assert.equal(oppositeNetLabelV1(validNet, "A"), "F");
assert.equal(oppositeNetLabelV1(validNet, "B"), "C");
assert.equal(oppositeNetLabelV1(validNet, "D"), "E");

const invalidNet: readonly CubeNetCellV1[] = Object.freeze(Array.from({ length: 6 }, (_, index) => ({
  id: `s${index}`,
  x: index,
  y: 0,
  label: String(index + 1),
})));
assert.equal(foldCubeNetV1(invalidNet).valid, false, "A six-cell straight strip must not be accepted as a cube net.");

const cube4 = enumeratePaintedCuboidCellsV1({ xCount: 4, yCount: 4, zCount: 4, paintedFaces: ALL_CUBE_FACES_V1 });
const distribution4 = paintedFaceCountDistributionV1(cube4);
assert.equal(cube4.length, 64);
assert.equal(distribution4[3], 8);
assert.equal(distribution4[2], 24);
assert.equal(distribution4[1], 24);
assert.equal(distribution4[0], 8);

const topOnly = enumeratePaintedCuboidCellsV1({ xCount: 4, yCount: 4, zCount: 4, paintedFaces: ["U"] });
const topOnlyDistribution = paintedFaceCountDistributionV1(topOnly);
assert.equal(topOnlyDistribution[1], 16);
assert.equal(topOnlyDistribution[0], 48);

const voxels = buildStableVoxelStackFromHeightsV1([
  [1, 2],
  [3, 0],
]);
assert.equal(voxels.length, 6);
assert.equal(voxelProjectionCountV1(voxels, "TOP"), 3);
assert.equal(voxelProjectionCountV1(voxels, "FRONT"), 5);
assert.equal(voxelProjectionCountV1(voxels, "RIGHT"), 5);
assert.ok(exposedVoxelFaceCountV1(voxels) > 0);

const TASKS: readonly CubesDiceTaskKindV1[] = [
  "DICE_OPPOSITE_FROM_TWO_VIEWS",
  "CUBE_NET_OPPOSITE_FACE",
  "PAINTED_CUBE_EXACT_FACE_COUNT",
  "VOXEL_ORTHOGRAPHIC_VIEW_COUNT",
];

const generatedEvidence: Record<string, unknown>[] = [];
for (const taskKind of TASKS) {
  for (let index = 0; index < 4; index += 1) {
    const question = generateCubesDiceCandidateQuestionV1({ seed: `CND-FOUNDATION-${taskKind}-${index}`, taskKind });
    assert.equal(question.chapterCode, "CND-001");
    assert.equal(question.permanentQlId, null);
    assert.equal(question.nextPermanentQlId, "SPA-QL-043");
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map(String)).size, 4);
    assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.equal(question.lifecycle.reviewOnly, true);
    assert.equal(question.lifecycle.automaticStudentPublication, false);

    if (taskKind === "CUBE_NET_OPPOSITE_FACE") {
      const cells = question.scene.cells as readonly CubeNetCellV1[];
      const target = question.stem.match(/opposite to ([A-F])\?$/)?.[1];
      assert.ok(target);
      assert.equal(oppositeNetLabelV1(cells, target), question.answer);
    }
    if (taskKind === "PAINTED_CUBE_EXACT_FACE_COUNT") {
      const n = question.scene.subdivisionsPerEdge as number;
      const faceCount = Number(question.stem.match(/exactly (\d) painted/)?.[1]);
      const cells = enumeratePaintedCuboidCellsV1({ xCount: n, yCount: n, zCount: n, paintedFaces: ALL_CUBE_FACES_V1 });
      assert.equal(paintedFaceCountDistributionV1(cells)[faceCount] ?? 0, question.answer);
    }
    if (taskKind === "VOXEL_ORTHOGRAPHIC_VIEW_COUNT") {
      const heights = question.scene.heights as readonly (readonly number[])[];
      const view = question.scene.view as "TOP" | "FRONT" | "RIGHT";
      assert.equal(voxelProjectionCountV1(buildStableVoxelStackFromHeightsV1(heights), view), question.answer);
    }
    generatedEvidence.push({
      taskKind,
      seed: question.seed,
      answer: question.answer,
      difficulty: question.difficulty,
      candidateId: question.candidateId,
    });
  }
}

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
const evidence = {
  authority: CND_001_FOUNDATION_AUTHORITY_V1.authorityId,
  generatorAuthority: CND_001_PRODUCTION_GENERATOR_AUTHORITY_V1.authorityId,
  result: "PASS",
  nextPermanentQlId: "SPA-QL-043",
  properCubeRotations: CUBE_ORIENTATIONS_V1.length,
  validNetOppositePairs: [["A", "F"], ["B", "C"], ["D", "E"]],
  paintedCube4Distribution: distribution4,
  voxelProjectionProof: { top: 3, front: 5, right: 5 },
  generatedQuestionCount: generatedEvidence.length,
  generatedEvidence,
  invariants: [
    "24_PROPER_ROTATIONS_ONLY",
    "DICE_RELATIONS_SOLVED_BY_EXHAUSTIVE_ORIENTATION_COMPATIBILITY",
    "CUBE_NETS_FOLDED_TO_SIX_UNIQUE_3D_NORMALS",
    "PAINTED_CUBES_DERIVED_FROM_UNIT_COORDINATES_NOT_FORMULA_ONLY",
    "ORTHOGRAPHIC_VIEWS_DERIVED_FROM_VOXEL_PROJECTIONS",
    "PERMANENT_QL_ALLOCATION_REMAINS_LOCKED",
    "AUTOMATIC_STUDENT_PUBLICATION_DISABLED",
  ],
};
writeFileSync(
  "dist/reasoning-v1/spatial/spa-cnd-001-foundation-v1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
);
console.log(JSON.stringify(evidence, null, 2));
