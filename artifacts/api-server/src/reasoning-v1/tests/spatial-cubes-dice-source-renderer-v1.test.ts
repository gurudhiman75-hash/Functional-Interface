import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  CND_001_SOURCE_PATTERNS_V1,
  CND_001_SOURCE_SATURATION_AUTHORITY_V1,
  CND_001_SOURCE_SATURATION_SUMMARY_V1,
} from "../foundation/spatial/cubes-dice-source-saturation-v1";
import {
  CND_001_EXAM_RENDERER_AUTHORITY_V1,
  renderCubeNetExamSvgV1,
  renderDiceObservationPairExamSvgV1,
  renderPaintedCubeExamSvgV1,
  renderVoxelStackExamSvgV1,
} from "../foundation/spatial/cubes-dice-exam-renderer-v1";
import {
  CND_001_PRODUCTION_GENERATOR_AUTHORITY_V1,
  generateCubesDiceCandidateQuestionV1,
  type CubesDiceTaskKindV1,
} from "../foundation/spatial/cubes-dice-production-generator-v1";
import type { CubeNetCellV1, DiceObservationV1 } from "../foundation/spatial/cubes-dice-foundation-v1";

assert.equal(CND_001_SOURCE_SATURATION_AUTHORITY_V1.nextPermanentQlId, "SPA-QL-043");
assert.equal(CND_001_SOURCE_SATURATION_SUMMARY_V1.patternCount, 15);
assert.ok(CND_001_SOURCE_SATURATION_SUMMARY_V1.directSscPatternCount >= 9);
assert.ok(CND_001_SOURCE_SATURATION_SUMMARY_V1.directGovernmentPatternCount >= 3);
assert.equal(
  CND_001_SOURCE_SATURATION_SUMMARY_V1.retainedCoreCount
    + CND_001_SOURCE_SATURATION_SUMMARY_V1.retainedSecondaryCount
    + CND_001_SOURCE_SATURATION_SUMMARY_V1.heldForLaterProofCount,
  CND_001_SOURCE_PATTERNS_V1.length,
);
assert.equal(CND_001_SOURCE_SATURATION_SUMMARY_V1.permanentQlAllocationAuthorized, false);
assert.ok(CND_001_SOURCE_PATTERNS_V1.some((pattern) => pattern.module === "DICE_ORIENTATION" && pattern.disposition === "RETAIN_CORE"));
assert.ok(CND_001_SOURCE_PATTERNS_V1.some((pattern) => pattern.module === "CUBE_NET" && pattern.disposition === "RETAIN_CORE"));
assert.ok(CND_001_SOURCE_PATTERNS_V1.some((pattern) => pattern.module === "PAINTED_CUBE" && pattern.disposition === "RETAIN_CORE"));
assert.ok(CND_001_SOURCE_PATTERNS_V1.some((pattern) => pattern.module === "SELECTIVE_PAINT" && pattern.disposition === "RETAIN_SECONDARY"));
assert.ok(CND_001_SOURCE_PATTERNS_V1.some((pattern) => pattern.module === "CUBE_STACK" && pattern.disposition === "HOLD_FOR_LATER_PROOF"));

assert.equal(CND_001_EXAM_RENDERER_AUTHORITY_V1.background, "WHITE");
assert.equal(CND_001_EXAM_RENDERER_AUTHORITY_V1.strokeWidth, 1.35);
assert.equal(CND_001_EXAM_RENDERER_AUTHORITY_V1.cameraPolicy, "CANONICAL_ISOMETRIC_NO_RANDOM_TILT");

const observations: readonly [DiceObservationV1, DiceObservationV1] = [
  { top: "1", front: "2", right: "3" },
  { top: "4", front: "2", right: "1" },
];
const diceSvg = renderDiceObservationPairExamSvgV1(observations);
assert.match(diceSvg, /fill="white"/);
assert.match(diceSvg, /stroke-width="1\.35"/);
assert.match(diceSvg, /Two positions of the same die/);
assert.match(diceSvg, />1<\/text>/);
assert.match(diceSvg, />4<\/text>/);
assert.doesNotMatch(diceSvg, /rotate\(/i);

const netCells: readonly CubeNetCellV1[] = [
  { id: "c0", x: 1, y: 1, label: "A" },
  { id: "c1", x: 0, y: 1, label: "B" },
  { id: "c2", x: 2, y: 1, label: "C" },
  { id: "c3", x: 1, y: 0, label: "D" },
  { id: "c4", x: 1, y: 2, label: "E" },
  { id: "c5", x: 1, y: 3, label: "F" },
];
const netSvg = renderCubeNetExamSvgV1(netCells);
assert.equal((netSvg.match(/<rect /g) ?? []).length, 7, "Net SVG must contain one white background plus six equal face cells.");
for (const label of ["A", "B", "C", "D", "E", "F"]) assert.match(netSvg, new RegExp(`>${label}<\\/text>`));
assert.doesNotMatch(netSvg, /rotate\(/i);

const paintedSvg = renderPaintedCubeExamSvgV1(5);
assert.match(paintedSvg, /fill="white"/);
assert.match(paintedSvg, /stroke-width="1\.35"/);
assert.equal((paintedSvg.match(/<polygon /g) ?? []).length, 3);
assert.ok((paintedSvg.match(/<line /g) ?? []).length >= 18, "Five subdivisions must render visible grid lines on all three faces.");

const voxelSvg = renderVoxelStackExamSvgV1([
  [1, 2, 0],
  [2, 1, 1],
  [0, 1, 3],
]);
assert.match(voxelSvg, /fill="white"/);
assert.match(voxelSvg, /stroke-width="1\.35"/);
assert.match(voxelSvg, /Stack of unit cubes/);
assert.ok((voxelSvg.match(/<polygon /g) ?? []).length >= 3);

const TASKS: readonly CubesDiceTaskKindV1[] = [
  "DICE_OPPOSITE_FROM_TWO_VIEWS",
  "CUBE_NET_OPPOSITE_FACE",
  "PAINTED_CUBE_EXACT_FACE_COUNT",
  "VOXEL_ORTHOGRAPHIC_VIEW_COUNT",
];

const samples: Record<string, unknown>[] = [];
for (const taskKind of TASKS) {
  for (let index = 0; index < 6; index += 1) {
    const seed = `CND-CP002-${taskKind}-${index}`;
    const question = generateCubesDiceCandidateQuestionV1({ seed, taskKind });
    const replay = generateCubesDiceCandidateQuestionV1({ seed, taskKind });
    assert.equal(question.permanentQlId, null);
    assert.equal(question.nextPermanentQlId, "SPA-QL-043");
    assert.equal(question.stimulusSvgs.length, 1);
    assert.match(question.stimulusSvgs[0], /^<svg /);
    assert.match(question.stimulusSvgs[0], /fill="white"/);
    assert.match(question.stimulusSvgs[0], /stroke-width="1\.35"/);
    assert.equal(question.renderer.authority, CND_001_EXAM_RENDERER_AUTHORITY_V1.authorityId);
    assert.equal(question.renderer.whiteBackground, true);
    assert.equal(question.renderer.canonicalCamera, true);
    assert.equal(question.renderer.randomWholeFigureTiltAllowed, false);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.equal(question.answer, replay.answer);
    assert.equal(question.stimulusSvgs[0], replay.stimulusSvgs[0], "Renderer output must be deterministic for the same seed.");
    assert.equal(question.lifecycle.reviewOnly, true);
    assert.equal(question.lifecycle.permanentQlAllocated, false);
    assert.equal(question.lifecycle.questionStudioRegistered, false);
    assert.equal(question.lifecycle.persistenceAllowed, false);
    assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.testEligible, false);
    assert.equal(question.lifecycle.publiclyPublishable, false);
    assert.equal(question.lifecycle.automaticStudentPublication, false);
    samples.push({
      seed,
      taskKind,
      candidateId: question.candidateId,
      difficulty: question.difficulty,
      answer: question.answer,
      svgLength: question.stimulusSvgs[0].length,
    });
  }
}

assert.equal(CND_001_PRODUCTION_GENERATOR_AUTHORITY_V1.rendererAuthorityId, CND_001_EXAM_RENDERER_AUTHORITY_V1.authorityId);
assert.equal(CND_001_PRODUCTION_GENERATOR_AUTHORITY_V1.permanentQlAllocationAuthorized, false);

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
const evidence = {
  authority: "CND-001-CP002-SOURCE-RENDERER-V1",
  sourceAuthority: CND_001_SOURCE_SATURATION_AUTHORITY_V1.authorityId,
  rendererAuthority: CND_001_EXAM_RENDERER_AUTHORITY_V1.authorityId,
  generatorAuthority: CND_001_PRODUCTION_GENERATOR_AUTHORITY_V1.authorityId,
  result: "PASS",
  sourcePatternCount: CND_001_SOURCE_PATTERNS_V1.length,
  sourceSummary: CND_001_SOURCE_SATURATION_SUMMARY_V1,
  generatedReviewSamples: samples.length,
  nextPermanentQlId: "SPA-QL-043",
  permanentQlAllocationAuthorized: false,
  invariants: [
    "WHITE_BACKGROUND",
    "THIN_EXAM_STANDARD_STROKE",
    "CANONICAL_DICE_CAMERA_NO_RANDOM_TILT",
    "ORTHOGONAL_EQUAL_SQUARE_NETS",
    "PAINTED_CUBE_GRID_PRESERVES_SUBDIVISION_COUNT",
    "VOXEL_STACK_RENDERER_PRESERVES_STRUCTURED_SCENE",
    "RENDERER_DOES_NOT_CHANGE_SOLVER_ANSWER",
    "DETERMINISTIC_REPLAY",
    "PERMANENT_QL_ALLOCATION_REMAINS_LOCKED",
    "QUESTION_STUDIO_AND_PUBLICATION_REMAIN_LOCKED",
  ],
};
writeFileSync(
  "dist/reasoning-v1/spatial/spa-cnd-001-source-renderer-v1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
);
console.log(JSON.stringify(evidence, null, 2));
