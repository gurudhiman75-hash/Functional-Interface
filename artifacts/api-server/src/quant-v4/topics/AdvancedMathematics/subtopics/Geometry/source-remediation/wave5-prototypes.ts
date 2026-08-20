import {
  getTheoremDefinition,
  type GeoDiagramModel,
  type TheoremId,
} from "../../../../../shared/geometry";
import {
  approximate,
  buildExplanation,
  buildOptions,
  finalizeGapWave5Question,
  parallel,
  pointDistance,
  proveClueMinimality,
  wave5Verifier,
} from "./wave5-utils";
import type { GapWave5PrototypeDefinition, GapWave5Question } from "./wave5-types";

function variantIndex(seed: string, count: number): number {
  const final = seed.at(-1)?.toLowerCase();
  if (final && final >= "a" && final <= "z") return (final.charCodeAt(0) - 97) % count;
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  return hash % count;
}

function parallelogramExtensionDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "M", label: "M", x: 30, y: 150, labelPosition: "SW" },
      { id: "N", label: "N", x: 90, y: 150, labelPosition: "S" },
      { id: "O", label: "O", x: 135, y: 75, labelPosition: "NE" },
      { id: "P", label: "P", x: 75, y: 75, labelPosition: "NW" },
      { id: "Q", label: "Q", x: 150, y: 150, labelPosition: "SE" },
      { id: "R", label: "R", x: 112.5, y: 112.5, labelPosition: "E" },
    ],
    segments: [
      { id: "MN", fromPointId: "M", toPointId: "N" },
      { id: "NO", fromPointId: "N", toPointId: "O" },
      { id: "OP", fromPointId: "O", toPointId: "P" },
      { id: "PM", fromPointId: "P", toPointId: "M" },
      { id: "NQ", fromPointId: "N", toPointId: "Q" },
      { id: "PQ", fromPointId: "P", toPointId: "Q" },
    ],
    circles: [],
    angleMarks: [],
    rightAngleMarks: [],
    equalLengthMarks: [{ id: "given-mn-nq", segmentIds: ["MN", "NQ"] }],
    parallelMarks: [],
    arcs: [],
    labels: [],
    disclosure: "STEM",
    notToScale: true,
  };
}

function equalParallelDiagonalDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 30, y: 145, labelPosition: "SW" },
      { id: "B", label: "B", x: 95, y: 145, labelPosition: "SE" },
      { id: "C", label: "C", x: 140, y: 70, labelPosition: "NE" },
      { id: "D", label: "D", x: 75, y: 70, labelPosition: "NW" },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" },
      { id: "BC", fromPointId: "B", toPointId: "C" },
      { id: "CD", fromPointId: "C", toPointId: "D" },
      { id: "DA", fromPointId: "D", toPointId: "A" },
      { id: "AC", fromPointId: "A", toPointId: "C", style: "CONSTRUCTION" },
    ],
    circles: [],
    angleMarks: [],
    rightAngleMarks: [],
    equalLengthMarks: [{ id: "given-ab-cd", segmentIds: ["AB", "CD"] }],
    parallelMarks: [{ id: "given-ab-parallel-cd", segmentIds: ["AB", "CD"] }],
    arcs: [],
    labels: [],
    disclosure: "STEM",
    notToScale: true,
  };
}

function point(model: GeoDiagramModel, id: string) {
  const result = model.points.find((candidate) => candidate.id === id);
  if (!result) throw new Error(`Wave 5 diagram point ${id} missing`);
  return result;
}

function generateParallelogramExtensionMidpoint(seed: string): GapWave5Question {
  const variants = [
    { on: 12, answer: 6, stem: "MNOP is a parallelogram. MN is extended to Q so that MN = NQ, and PQ meets ON at R. If ON = 12 cm, find OR." },
    { on: 24, answer: 12, stem: "In parallelogram MNOP, side MN is produced to Q with MN = NQ. The line PQ intersects ON at R. Given ON = 24 cm, what is OR?" },
    { on: 36, answer: 18, stem: "A parallelogram MNOP has MN extended beyond N to Q such that MN and NQ are equal. PQ cuts ON at R. If ON measures 36 cm, calculate OR." },
  ] as const;
  const variant = variants[variantIndex(seed, variants.length)];
  const expected = `${variant.answer} cm`;
  const clueIds = ["MNOP_IS_PARALLELOGRAM", "MN_EQUALS_NQ", "PQ_INTERSECTS_ON_AT_R", "ON_LENGTH_GIVEN", "TARGET_OR"] as const;
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    return `${variant.on / 2} cm`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Wave 5 parallelogram-extension fixture mismatch");

  const model = parallelogramExtensionDiagram();
  const M = point(model, "M"); const N = point(model, "N"); const O = point(model, "O");
  const P = point(model, "P"); const Q = point(model, "Q"); const R = point(model, "R");
  const visualPassed = approximate(pointDistance(M, N), pointDistance(N, Q))
    && parallel(M, N, O, P)
    && approximate(pointDistance(O, R), pointDistance(R, N))
    && approximate((Q.x - P.x) * (R.y - P.y) - (Q.y - P.y) * (R.x - P.x), 0)
    && approximate((N.x - O.x) * (R.y - O.y) - (N.y - O.y) * (R.x - O.x), 0);

  const theoremTrace: TheoremId[] = ["PARALLELOGRAM_OPPOSITE_SIDES", "ALTERNATE_INTERIOR_ANGLES", "ASA_AAS_CONGRUENCE", "CPCT"];
  const optionSet = buildOptions(expected, [
    { text: `${variant.on} cm`, misconceptionId: "CPCT_MIDPOINT_COPIES_WHOLE_SIDE", rationale: "Uses the full length ON instead of splitting it at the midpoint established by congruence." },
    { text: `${variant.on / 3} cm`, misconceptionId: "CPCT_MIDPOINT_ASSUMES_THREE_EQUAL_PARTS", rationale: "Treats R as if it trisected ON." },
    { text: `${2 * variant.on / 3} cm`, misconceptionId: "CPCT_MIDPOINT_USES_TWO_TO_ONE_RATIO", rationale: "Uses a 2:1 division instead of the equal corresponding segments obtained by CPCT." },
  ], seed);

  return finalizeGapWave5Question({
    temporaryPrototypeId: "GEO-TMP-GAP-W5-CP014-PARALLELOGRAM-EXTENSION-MIDPOINT-V1",
    sourceGapId: "GEO-CP-014/CONGRUENCE_PLUS_PARALLEL_SYNTHESIS",
    sourceEvidenceIds: ["SRC-TESTBOOK-CGL-PARALLELOGRAM-EXTENSION-CONGRUENCE-PYQ-2024"],
    solveMode: "parallelAnglesToAsaCongruenceToMidpointLength",
    seed,
    stem: variant.stem,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "Since MNOP is a parallelogram, OP is parallel to MN and OP = MN. Given MN = NQ, we also have OP = NQ.",
      "Because OP is parallel to NQ, the two transversals through R give two equal angle pairs. Thus triangles POR and QNR are congruent by ASA.",
      `By corresponding parts of congruent triangles, OR = RN. Hence R is the midpoint of ON, so OR = ${variant.on}/2 = ${variant.answer} cm.`,
    ]),
    theoremTrace,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: wave5Verifier("HIGH_PRECISION_COORDINATE", visualPassed, [
      "MN and OP are parallel in the learner topology",
      "MN and NQ are drawn with equal length as stated",
      "R lies on both PQ and ON",
      "the coordinate construction independently places R at the midpoint of ON",
    ]),
    diagramModel: model,
  });
}

function generateEqualParallelDiagonalCpct(seed: string): GapWave5Question {
  const variants = [
    { ad: 8, stem: "In quadrilateral ABCD, AB ∥ CD and AB = CD. The diagonal AC is drawn. If AD = 8 cm, find BC." },
    { ad: 12, stem: "ABCD is a quadrilateral with AB parallel to CD and AB equal to CD. AC is a diagonal. If DA = 12 cm, what is BC?" },
    { ad: 16, stem: "In the shown quadrilateral, opposite sides AB and CD are equal and parallel, and AC joins A to C. Given AD = 16 cm, calculate BC." },
  ] as const;
  const variant = variants[variantIndex(seed, variants.length)];
  const expected = `${variant.ad} cm`;
  const clueIds = ["AB_PARALLEL_CD", "AB_EQUALS_CD", "AC_IS_DIAGONAL", "AD_LENGTH_GIVEN", "TARGET_BC"] as const;
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    return expected;
  };

  const model = equalParallelDiagonalDiagram();
  const A = point(model, "A"); const B = point(model, "B"); const C = point(model, "C"); const D = point(model, "D");
  const visualPassed = parallel(A, B, D, C)
    && approximate(pointDistance(A, B), pointDistance(D, C))
    && approximate(pointDistance(B, C), pointDistance(D, A));
  const theoremTrace: TheoremId[] = ["ALTERNATE_INTERIOR_ANGLES", "SAS_CONGRUENCE", "CPCT"];
  const optionSet = buildOptions(expected, [
    { text: `${2 * variant.ad} cm`, misconceptionId: "CONGRUENT_SIDE_DOUBLED", rationale: "Doubles the corresponding side instead of using equality from congruence." },
    { text: `${variant.ad / 2} cm`, misconceptionId: "DIAGONAL_HALVES_CORRESPONDING_SIDE", rationale: "Incorrectly assumes drawing the diagonal halves the corresponding outer side." },
    { text: `${3 * variant.ad / 2} cm`, misconceptionId: "CONGRUENCE_TREATED_AS_THREE_TO_TWO_SCALE", rationale: "Treats congruent triangles as though they had a 3:2 similarity scale." },
  ], seed);

  return finalizeGapWave5Question({
    temporaryPrototypeId: "GEO-TMP-GAP-W5-CP014-EQUAL-PARALLEL-DIAGONAL-CPCT-V1",
    sourceGapId: "GEO-CP-014/CONGRUENCE_PLUS_PARALLEL_SYNTHESIS",
    sourceEvidenceIds: ["SRC-TESTBOOK-CGL-EQUAL-PARALLEL-OPPOSITE-SIDES-PYQ-2025"],
    solveMode: "parallelAngleToSasCongruenceToCorrespondingSide",
    seed,
    stem: variant.stem,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "Since AB is parallel to CD, diagonal AC makes equal alternate interior angles: ∠BAC = ∠DCA.",
      "Now AB = CD, AC is common to both triangles, and the included angles are equal. Therefore triangles BAC and DCA are congruent by SAS.",
      `So their corresponding sides BC and DA are equal. Since AD = ${variant.ad} cm, BC = ${variant.ad} cm.`,
    ]),
    theoremTrace,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: wave5Verifier("HIGH_PRECISION_COORDINATE", visualPassed, [
      "AB and CD are exactly parallel in the coordinate construction",
      "AB and CD have equal drawn length as explicitly stated",
      "AC is the shared diagonal of the two congruent triangles",
      "the independent coordinate model gives BC = DA without displaying that derived equality mark",
    ]),
    diagramModel: model,
  });
}

export const GEO_GAP_REMEDIATION_WAVE5_PROTOTYPES: readonly GapWave5PrototypeDefinition[] = Object.freeze([
  Object.freeze({
    temporaryPrototypeId: "GEO-TMP-GAP-W5-CP014-PARALLELOGRAM-EXTENSION-MIDPOINT-V1",
    cpId: "GEO-CP-014",
    sourceGapId: "GEO-CP-014/CONGRUENCE_PLUS_PARALLEL_SYNTHESIS",
    solveMode: "parallelAnglesToAsaCongruenceToMidpointLength",
    generate: generateParallelogramExtensionMidpoint,
  }),
  Object.freeze({
    temporaryPrototypeId: "GEO-TMP-GAP-W5-CP014-EQUAL-PARALLEL-DIAGONAL-CPCT-V1",
    cpId: "GEO-CP-014",
    sourceGapId: "GEO-CP-014/CONGRUENCE_PLUS_PARALLEL_SYNTHESIS",
    solveMode: "parallelAngleToSasCongruenceToCorrespondingSide",
    generate: generateEqualParallelDiagonalCpct,
  }),
]);

void getTheoremDefinition;
