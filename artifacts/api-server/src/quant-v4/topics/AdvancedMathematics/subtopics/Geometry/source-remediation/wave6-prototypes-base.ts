import {
  medianLengthFromCentroidSegment,
  midpointConverseHalfLength,
  perpendicularBisectorConverseConclusion,
  perpendicularBisectorDirectConclusion,
  rational,
  toNumber,
  type GeoDiagramModel,
  type TheoremId,
} from "../../../../../shared/geometry";
import {
  approximate,
  buildExplanation,
  buildOptions,
  collinear,
  finalizeGapWave6Question,
  parallel,
  perpendicular,
  pointDistance,
  proveClueMinimality,
  wave6Verifier,
} from "./wave6-utils";
import type { GapWave6PrototypeDefinition, GapWave6Question } from "./wave6-types";

function variantIndex(seed: string, count: number): number {
  const final = seed.at(-1)?.toLowerCase();
  if (final && final >= "a" && final <= "z") return (final.charCodeAt(0) - 97) % count;
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  return hash % count;
}

function point(model: GeoDiagramModel, id: string) {
  const result = model.points.find((candidate) => candidate.id === id);
  if (!result) throw new Error(`Wave 6 diagram point ${id} missing`);
  return result;
}

function directPerpStemDiagram(rAngle: number, splitAngle: number): GeoDiagramModel {
  return {
    points: [
      { id: "P", label: "P", x: 25, y: 155, labelPosition: "SW" },
      { id: "Q", label: "Q", x: 185, y: 155, labelPosition: "SE" },
      { id: "R", label: "R", x: 55, y: 35, labelPosition: "NW" },
      { id: "S", label: "S", x: 105, y: 155, labelPosition: "S" },
      { id: "T", label: "T", x: 105, y: 81.153846, labelPosition: "E" },
    ],
    segments: [
      { id: "PS", fromPointId: "P", toPointId: "S" },
      { id: "SQ", fromPointId: "S", toPointId: "Q" },
      { id: "PR", fromPointId: "P", toPointId: "R" },
      { id: "RT", fromPointId: "R", toPointId: "T" },
      { id: "TQ", fromPointId: "T", toPointId: "Q" },
      { id: "ST", fromPointId: "S", toPointId: "T", style: "CONSTRUCTION" },
      { id: "PT", fromPointId: "P", toPointId: "T", style: "CONSTRUCTION" },
    ],
    circles: [],
    angleMarks: [
      { id: "given-r-angle", firstPointId: "P", vertexPointId: "R", secondPointId: "Q", label: `${rAngle}°`, radius: 18, labelRadius: 30 },
      { id: "given-tpr-angle", firstPointId: "T", vertexPointId: "P", secondPointId: "R", label: `${splitAngle}°`, radius: 18, labelRadius: 31 },
    ],
    rightAngleMarks: [{ id: "given-right-at-s", vertexPointId: "S", firstRayPointId: "P", secondRayPointId: "T" }],
    equalLengthMarks: [{ id: "given-s-midpoint", segmentIds: ["PS", "SQ"] }],
    parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function directPerpSolutionDiagram(rAngle: number, splitAngle: number, answer: number): GeoDiagramModel {
  const stem = directPerpStemDiagram(rAngle, splitAngle);
  return {
    ...stem,
    segments: stem.segments,
    angleMarks: [
      ...stem.angleMarks,
      { id: "derived-q-angle", firstPointId: "P", vertexPointId: "Q", secondPointId: "R", label: `${answer}°`, radius: 21, labelRadius: 34 },
      { id: "derived-tpq-angle", firstPointId: "T", vertexPointId: "P", secondPointId: "Q", label: `${answer}°`, radius: 28, labelRadius: 44 },
    ],
    equalLengthMarks: [...stem.equalLengthMarks, { id: "derived-tp-tq", segmentIds: ["PT", "TQ"] }],
    labels: [
      { id: "derived-equality-label", text: "TP = TQ", x: 146, y: 61 },
      { id: "answer-label", text: `∠PQR = ${answer}°`, x: 205, y: 175 },
    ],
    disclosure: "SOLUTION",
  };
}

function rhombusConverseSolutionDiagram(so: number, oq: number, answer: number): GeoDiagramModel {
  return {
    points: [
      { id: "P", label: "P", x: 105, y: 25, labelPosition: "N" },
      { id: "Q", label: "Q", x: 190, y: 105, labelPosition: "E" },
      { id: "R", label: "R", x: 105, y: 185, labelPosition: "S" },
      { id: "S", label: "S", x: 20, y: 105, labelPosition: "W" },
      { id: "M", label: "M", x: 105, y: 105, labelPosition: "SW" },
      { id: "O", label: "O", x: 137, y: 105, labelPosition: "NE" },
    ],
    segments: [
      { id: "PQ", fromPointId: "P", toPointId: "Q" }, { id: "QR", fromPointId: "Q", toPointId: "R" },
      { id: "RS", fromPointId: "R", toPointId: "S" }, { id: "SP", fromPointId: "S", toPointId: "P" },
      { id: "PM", fromPointId: "P", toPointId: "M", style: "CONSTRUCTION" },
      { id: "MR", fromPointId: "M", toPointId: "R", style: "CONSTRUCTION" },
      { id: "SM", fromPointId: "S", toPointId: "M", style: "CONSTRUCTION" },
      { id: "MO", fromPointId: "M", toPointId: "O", style: "CONSTRUCTION" },
      { id: "OQ", fromPointId: "O", toPointId: "Q", style: "CONSTRUCTION" },
      { id: "OP", fromPointId: "O", toPointId: "P", style: "CONSTRUCTION" },
      { id: "OR", fromPointId: "O", toPointId: "R", style: "CONSTRUCTION" },
    ],
    circles: [], angleMarks: [],
    rightAngleMarks: [{ id: "rhombus-diagonal-right", vertexPointId: "M", firstRayPointId: "P", secondRayPointId: "Q" }],
    equalLengthMarks: [
      { id: "rhombus-pr-bisected", segmentIds: ["PM", "MR"] },
      { id: "given-op-or", segmentIds: ["OP", "OR"] },
    ],
    parallelMarks: [], arcs: [],
    labels: [
      { id: "given-so", text: `SO = ${so} cm`, x: 47, y: 82 },
      { id: "given-oq", text: `OQ = ${oq} cm`, x: 156, y: 82 },
      { id: "derived-collinear", text: "S, O, Q are collinear", x: 70, y: 220 },
      { id: "answer-sq", text: `SQ = ${answer} cm`, x: 80, y: 242 },
    ],
    disclosure: "SOLUTION", notToScale: true,
  };
}

function centroidStemDiagram(known: "VERTEX_TO_CENTROID" | "CENTROID_TO_MIDPOINT", length: number): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 105, y: 25, labelPosition: "N" },
      { id: "B", label: "B", x: 25, y: 175, labelPosition: "SW" },
      { id: "C", label: "C", x: 185, y: 175, labelPosition: "SE" },
      { id: "D", label: "D", x: 105, y: 175, labelPosition: "S" },
      { id: "G", label: "G", x: 105, y: 125, labelPosition: "E" },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" }, { id: "AC", fromPointId: "A", toPointId: "C" },
      { id: "BD", fromPointId: "B", toPointId: "D" }, { id: "DC", fromPointId: "D", toPointId: "C" },
      { id: "AG", fromPointId: "A", toPointId: "G", style: "CONSTRUCTION" },
      { id: "GD", fromPointId: "G", toPointId: "D", style: "CONSTRUCTION" },
    ],
    circles: [], angleMarks: [], rightAngleMarks: [],
    equalLengthMarks: [{ id: "given-d-midpoint", segmentIds: ["BD", "DC"] }],
    parallelMarks: [], arcs: [],
    labels: [{
      id: "given-centroid-segment",
      text: `${known === "VERTEX_TO_CENTROID" ? "AG" : "GD"} = ${length} cm`,
      x: 130, y: known === "VERTEX_TO_CENTROID" ? 70 : 151,
    }],
    disclosure: "STEM", notToScale: true,
  };
}

function centroidSolutionDiagram(known: "VERTEX_TO_CENTROID" | "CENTROID_TO_MIDPOINT", length: number, whole: number): GeoDiagramModel {
  const stem = centroidStemDiagram(known, length);
  const ag = known === "VERTEX_TO_CENTROID" ? length : 2 * length;
  const gd = known === "CENTROID_TO_MIDPOINT" ? length : length / 2;
  return {
    ...stem,
    labels: [
      { id: "ratio-label", text: "AG : GD = 2 : 1", x: -10, y: 95 },
      { id: "ag-label", text: `AG = ${ag} cm`, x: 130, y: 70 },
      { id: "gd-label", text: `GD = ${gd} cm`, x: 130, y: 151 },
      { id: "whole-label", text: `AD = ${whole} cm`, x: -5, y: 205 },
    ],
    disclosure: "SOLUTION",
  };
}

function midpointStemDiagram(whole: number): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 25, y: 175, labelPosition: "SW" },
      { id: "B", label: "B", x: 185, y: 175, labelPosition: "SE" },
      { id: "C", label: "C", x: 120, y: 35, labelPosition: "N" },
      { id: "D", label: "D", x: 105, y: 175, labelPosition: "S" },
      { id: "E", label: "E", x: 72.5, y: 105, labelPosition: "NW" },
    ],
    segments: [
      { id: "AD", fromPointId: "A", toPointId: "D" }, { id: "DB", fromPointId: "D", toPointId: "B" },
      { id: "AE", fromPointId: "A", toPointId: "E" }, { id: "EC", fromPointId: "E", toPointId: "C" },
      { id: "BC", fromPointId: "B", toPointId: "C" }, { id: "DE", fromPointId: "D", toPointId: "E", style: "CONSTRUCTION" },
    ],
    circles: [], angleMarks: [], rightAngleMarks: [],
    equalLengthMarks: [{ id: "given-ad-db", segmentIds: ["AD", "DB"] }],
    parallelMarks: [{ id: "given-de-parallel-bc", segmentIds: ["DE", "BC"] }],
    arcs: [], labels: [{ id: "given-ac", text: `AC = ${whole} cm`, x: 5, y: 82 }],
    disclosure: "STEM", notToScale: true,
  };
}

function midpointSolutionDiagram(whole: number, half: number): GeoDiagramModel {
  const stem = midpointStemDiagram(whole);
  return {
    ...stem,
    equalLengthMarks: [...stem.equalLengthMarks, { id: "derived-ae-ec", segmentIds: ["AE", "EC"] }],
    labels: [
      { id: "given-ac", text: `AC = ${whole} cm`, x: 5, y: 82 },
      { id: "derived-midpoint", text: "AE = EC", x: 92, y: 78 },
      { id: "answer-ec", text: `EC = ${half} cm`, x: 130, y: 110 },
    ],
    disclosure: "SOLUTION",
  };
}

function generatePerpBisectorDirect(seed: string): GapWave6Question {
  const variants = [
    { r: 62, split: 38, answer: 40, stem: "In triangle PQR, ∠R = 62°. The perpendicular bisector of PQ at S meets QR at T. If ∠TPR = 38°, find ∠PQR." },
    { r: 54, split: 30, answer: 48, stem: "For ΔPQR, the perpendicular bisector of PQ passes through S and cuts QR at T. Given ∠PRQ = 54° and ∠TPR = 30°, what is ∠PQR?" },
    { r: 70, split: 34, answer: 38, stem: "In the shown triangle, ST is the perpendicular bisector of PQ and T lies on QR. If ∠PRQ = 70° and ∠TPR = 34°, calculate ∠PQR." },
  ] as const;
  const v = variants[variantIndex(seed, variants.length)];
  const expected = `${v.answer}°`;
  const clueIds = ["ST_PERP_BISECTS_PQ", "T_ON_QR", "R_ANGLE_GIVEN", "TPR_ANGLE_GIVEN", "TARGET_Q"] as const;
  const solve = (active: ReadonlySet<string>) => clueIds.every((id) => active.has(id)) ? `${(180 - v.r - v.split) / 2}°` : null;
  const model = directPerpStemDiagram(v.r, v.split);
  const solution = directPerpSolutionDiagram(v.r, v.split, v.answer);
  const P = point(model, "P"); const Q = point(model, "Q"); const R = point(model, "R"); const S = point(model, "S"); const T = point(model, "T");
  const topology = approximate(pointDistance(P, S), pointDistance(S, Q)) && perpendicular(P, Q, S, T) && collinear(R, T, Q)
    && approximate(pointDistance(T, P), pointDistance(T, Q)) && perpendicularBisectorDirectConclusion() === "EQUIDISTANT_FROM_ENDPOINTS";
  const theoremTrace: TheoremId[] = ["PERPENDICULAR_BISECTOR_EQUIDISTANT", "ISOSCELES_BASE_ANGLES", "TRIANGLE_ANGLE_SUM"];
  const optionSet = buildOptions(expected, [
    { text: `${2 * v.answer}°`, misconceptionId: "PERP_BISECTOR_FORGETS_EQUAL_BASE_ANGLES_SHARE", rationale: "Uses the whole remaining angle as ∠PQR instead of sharing it between the equal isosceles angles." },
    { text: `${(180 - v.r) / 2}°`, misconceptionId: "PERP_BISECTOR_IGNORES_SPLIT_AT_P", rationale: "Treats the entire angle at P as equal to ∠PQR and ignores the stated ∠TPR." },
    { text: `${v.split}°`, misconceptionId: "PERP_BISECTOR_COPIES_GIVEN_SPLIT", rationale: "Copies ∠TPR directly to ∠PQR without using TP = TQ and the triangle angle sum." },
  ], seed);
  return finalizeGapWave6Question({
    temporaryPrototypeId: "GEO-TMP-GAP-W6-CP006-PERP-BISECTOR-EQUIDISTANT-ANGLE-V1",
    sourceGapId: "GEO-CP-006/PERPENDICULAR_BISECTOR_EQUAL_DISTANCE_DIRECT",
    sourceEvidenceIds: ["SRC-TESTBOOK-CGL-2025-T2-PERP-BISECTOR-ANGLE-2026"],
    solveMode: "perpendicularBisectorToIsoscelesAngleRecovery", seed, stem: v.stem, ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "T lies on the perpendicular bisector of PQ, so TP = TQ. Therefore triangle TPQ is isosceles and ∠TPQ = ∠TQP = ∠PQR.",
      `Let ∠PQR = x. Then the full angle at P is x + ${v.split}°.`,
      `Using the angle sum of triangle PQR: (x + ${v.split}) + x + ${v.r} = 180. Hence 2x = ${180 - v.r - v.split}, so x = ${v.answer}°.`,
    ]),
    theoremTrace, displayedClueIds: clueIds, minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: wave6Verifier("HIGH_PRECISION_COORDINATE", topology, [
      "S is the midpoint of PQ in the coordinate model", "ST is perpendicular to PQ", "T lies on QR and on the perpendicular bisector of PQ", "independent distance check confirms TP = TQ",
    ]),
    diagramDisposition: "REQUIRED_BOTH", diagramModel: model, solutionDiagramModel: solution,
  });
}

function generatePerpBisectorConverseRhombus(seed: string): GapWave6Question {
  const variants = [
    { so: 5, oq: 7, answer: 12, stem: "PQRS is a rhombus. O is an interior point such that OP = OR. If SO = 5 cm and OQ = 7 cm, find the length of diagonal SQ." },
    { so: 8, oq: 11, answer: 19, stem: "In rhombus PQRS, an interior point O satisfies OP = OR. Given SO = 8 cm and OQ = 11 cm, what is SQ?" },
    { so: 9, oq: 13, answer: 22, stem: "A point O lies inside rhombus PQRS and is equally distant from P and R. If SO = 9 cm and OQ = 13 cm, calculate SQ." },
  ] as const;
  const v = variants[variantIndex(seed, variants.length)];
  const expected = `${v.answer} cm`;
  const clueIds = ["PQRS_RHOMBUS", "OP_EQUALS_OR", "SO_GIVEN", "OQ_GIVEN", "TARGET_SQ"] as const;
  const solve = (active: ReadonlySet<string>) => clueIds.every((id) => active.has(id)) ? `${v.so + v.oq} cm` : null;
  const solution = rhombusConverseSolutionDiagram(v.so, v.oq, v.answer);
  const P = point(solution, "P"); const Q = point(solution, "Q"); const R = point(solution, "R"); const S = point(solution, "S"); const M = point(solution, "M"); const O = point(solution, "O");
  const topology = approximate(pointDistance(P, M), pointDistance(M, R)) && perpendicular(P, R, S, Q)
    && approximate(pointDistance(O, P), pointDistance(O, R)) && collinear(S, O, Q)
    && perpendicularBisectorConverseConclusion() === "LIES_ON_PERPENDICULAR_BISECTOR";
  const theoremTrace: TheoremId[] = ["RHOMBUS_DIAGONALS_PERPENDICULAR", "PERPENDICULAR_BISECTOR_CONVERSE"];
  const optionSet = buildOptions(expected, [
    { text: `${Math.abs(v.oq - v.so)} cm`, misconceptionId: "COLLINEAR_SEGMENTS_SUBTRACTED", rationale: "Subtracts SO from OQ instead of adding the two adjacent parts of diagonal SQ." },
    { text: `${2 * v.so} cm`, misconceptionId: "ASSUMES_O_MIDPOINT_FROM_SO", rationale: "Assumes O is the midpoint of SQ and doubles SO; OP = OR does not make O the midpoint of SQ." },
    { text: `${2 * v.oq} cm`, misconceptionId: "ASSUMES_O_MIDPOINT_FROM_OQ", rationale: "Assumes O is the midpoint of SQ and doubles OQ." },
  ], seed);
  return finalizeGapWave6Question({
    temporaryPrototypeId: "GEO-TMP-GAP-W6-CP006-PERP-BISECTOR-CONVERSE-RHOMBUS-V1",
    sourceGapId: "GEO-CP-006/PERPENDICULAR_BISECTOR_EQUAL_DISTANCE_CONVERSE",
    sourceEvidenceIds: ["SRC-TESTBOOK-CGL-RHOMBUS-PERP-BISECTOR-CONVERSE-2024"],
    solveMode: "equalDistancesToPerpendicularBisectorToDiagonalLength", seed, stem: v.stem, ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "In a rhombus, diagonal SQ is the perpendicular bisector of diagonal PR.",
      "Because OP = OR, O is equidistant from P and R. By the converse perpendicular-bisector theorem, O must lie on the perpendicular bisector of PR, so S, O and Q are collinear.",
      `Therefore SQ = SO + OQ = ${v.so} + ${v.oq} = ${v.answer} cm.`,
    ]),
    theoremTrace, displayedClueIds: clueIds, minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: wave6Verifier("HIGH_PRECISION_COORDINATE", topology, [
      "the rhombus diagonals are perpendicular and PR is bisected at M", "independent distance check confirms OP = OR", "the converse places O on the same line as S and Q",
    ]),
    diagramDisposition: "REQUIRED_SOLUTION_DIAGRAM", solutionDiagramModel: solution,
  });
}

function generateCentroidInverse(seed: string): GapWave6Question {
  const variants = [
    { known: "VERTEX_TO_CENTROID" as const, length: 18, whole: 27, stem: "AD is a median of triangle ABC and G is the centroid. If AG = 18 cm, find the length of median AD." },
    { known: "CENTROID_TO_MIDPOINT" as const, length: 10, whole: 30, stem: "In ΔABC, D is the midpoint of BC and G is the centroid on median AD. Given GD = 10 cm, what is AD?" },
    { known: "VERTEX_TO_CENTROID" as const, length: 24, whole: 36, stem: "G is the centroid of triangle ABC and lies on median AD. If the vertex-to-centroid part AG measures 24 cm, calculate the complete median AD." },
  ] as const;
  const v = variants[variantIndex(seed, variants.length)];
  const exactWhole = toNumber(medianLengthFromCentroidSegment(rational(v.length), v.known));
  if (!approximate(exactWhole, v.whole)) throw new Error("Wave 6 centroid fixture mismatch");
  const expected = `${v.whole} cm`;
  const clueIds = ["AD_IS_MEDIAN", "G_IS_CENTROID_ON_AD", "CENTROID_SEGMENT_GIVEN", "TARGET_AD"] as const;
  const solve = (active: ReadonlySet<string>) => clueIds.every((id) => active.has(id)) ? `${exactWhole} cm` : null;
  const model = centroidStemDiagram(v.known, v.length);
  const solution = centroidSolutionDiagram(v.known, v.length, v.whole);
  const A = point(model, "A"); const D = point(model, "D"); const G = point(model, "G"); const B = point(model, "B"); const C = point(model, "C");
  const topology = collinear(A, G, D) && approximate(pointDistance(B, D), pointDistance(D, C)) && approximate(pointDistance(A, G) / pointDistance(G, D), 2);
  const theoremTrace: TheoremId[] = ["CENTROID_DIVIDES_MEDIAN_2_TO_1"];
  const wrongs = v.known === "VERTEX_TO_CENTROID" ? [
    { text: `${3 * v.length} cm`, misconceptionId: "CENTROID_VERTEX_PART_TRIPLED", rationale: "Triples the vertex-to-centroid part; AG is two of the three equal ratio parts, not one." },
    { text: `${2 * v.length / 3} cm`, misconceptionId: "CENTROID_RATIO_APPLIED_BACKWARDS", rationale: "Multiplies AG by 2/3 instead of recovering the whole median with 3/2." },
    { text: `${v.length / 2} cm`, misconceptionId: "CENTROID_TAKES_HALF_OF_VERTEX_PART", rationale: "Returns the shorter centroid-to-midpoint part instead of the full median." },
  ] : [
    { text: `${1.5 * v.length} cm`, misconceptionId: "CENTROID_SHORT_PART_TREATED_AS_LONG_PART", rationale: "Uses the 3/2 factor that applies when the known segment is the vertex-to-centroid part." },
    { text: `${2 * v.length} cm`, misconceptionId: "CENTROID_ONLY_RECOVERS_VERTEX_PART", rationale: "Finds AG = 2·GD but stops before adding GD to obtain the whole median." },
    { text: `${v.length} cm`, misconceptionId: "CENTROID_COPIES_KNOWN_PART", rationale: "Copies GD as the whole median." },
  ];
  const optionSet = buildOptions(expected, wrongs, seed);
  return finalizeGapWave6Question({
    temporaryPrototypeId: "GEO-TMP-GAP-W6-CP006-CENTROID-INVERSE-MEDIAN-V1",
    sourceGapId: "GEO-CP-006/CENTROID_INVERSE",
    sourceEvidenceIds: v.known === "VERTEX_TO_CENTROID" ? ["SRC-TESTBOOK-CHSL-CENTROID-INVERSE-MEDIAN-2023"] : ["SRC-TESTBOOK-CGL-CENTROID-INVERSE-BASE-SEGMENT-2023"],
    solveMode: "centroidKnownSectionToWholeMedian", seed, stem: v.stem, ...optionSet,
    explanation: buildExplanation(theoremTrace, v.known === "VERTEX_TO_CENTROID" ? [
      "A centroid divides every median in the ratio 2:1 from the vertex, so AG is two of three equal ratio parts of AD.",
      `Therefore AD = AG × 3/2 = ${v.length} × 3/2 = ${v.whole} cm.`,
    ] : [
      "A centroid divides a median in the ratio 2:1 from the vertex, so GD is one of the three equal ratio parts of AD.",
      `Therefore AD = 3 × GD = 3 × ${v.length} = ${v.whole} cm.`,
    ]),
    theoremTrace, displayedClueIds: clueIds, minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: wave6Verifier("EXACT_RATIO_CROSSCHECK", topology && approximate(exactWhole, v.whole), [
      "D is independently placed at the midpoint of BC", "A, G and D are collinear", "the coordinate ratio AG:GD is 2:1", "exact rational inference independently recovers the whole median",
    ]),
    diagramDisposition: "REQUIRED_BOTH", diagramModel: model, solutionDiagramModel: solution,
  });
}

function generateMidpointConverse(seed: string): GapWave6Question {
  const variants = [
    { whole: 24, half: 12, stem: "In triangle ABC, D is the midpoint of AB. Through D, DE is drawn parallel to BC and meets AC at E. If AC = 24 cm, find EC." },
    { whole: 36, half: 18, stem: "D is the midpoint of side AB of ΔABC. The line through D parallel to BC meets AC at E. Given AC = 36 cm, what is the length of EC?" },
    { whole: 48, half: 24, stem: "In the shown triangle, AD = DB and DE ∥ BC with E on AC. If AC measures 48 cm, calculate EC." },
  ] as const;
  const v = variants[variantIndex(seed, variants.length)];
  const exactHalf = toNumber(midpointConverseHalfLength(rational(v.whole)));
  const expected = `${v.half} cm`;
  const clueIds = ["D_MIDPOINT_AB", "DE_PARALLEL_BC", "E_ON_AC", "AC_LENGTH_GIVEN", "TARGET_EC"] as const;
  const solve = (active: ReadonlySet<string>) => clueIds.every((id) => active.has(id)) ? `${exactHalf} cm` : null;
  const model = midpointStemDiagram(v.whole);
  const solution = midpointSolutionDiagram(v.whole, v.half);
  const A = point(model, "A"); const B = point(model, "B"); const C = point(model, "C"); const D = point(model, "D"); const E = point(model, "E");
  const topology = approximate(pointDistance(A, D), pointDistance(D, B)) && collinear(A, E, C) && parallel(D, E, B, C)
    && approximate(pointDistance(A, E), pointDistance(E, C)) && approximate(exactHalf, v.half);
  const theoremTrace: TheoremId[] = ["MIDPOINT_CONVERSE"];
  const optionSet = buildOptions(expected, [
    { text: `${v.whole} cm`, misconceptionId: "MIDPOINT_CONVERSE_COPIES_WHOLE_SIDE", rationale: "Copies AC instead of using E as the midpoint of AC." },
    { text: `${v.whole / 4} cm`, misconceptionId: "MIDPOINT_CONVERSE_HALVES_TWICE", rationale: "Halves the side twice after already establishing E as its midpoint." },
    { text: `${2 * v.whole / 3} cm`, misconceptionId: "MIDPOINT_CONVERSE_USES_CENTROID_RATIO", rationale: "Incorrectly applies a 2:1 centroid ratio to a midpoint-converse configuration." },
  ], seed);
  return finalizeGapWave6Question({
    temporaryPrototypeId: "GEO-TMP-GAP-W6-CP006-MIDPOINT-CONVERSE-SEGMENT-V1",
    sourceGapId: "GEO-CP-006/MIDPOINT_CONVERSE",
    sourceEvidenceIds: ["SRC-TESTBOOK-CGL-MIDPOINT-CONVERSE-INTERMEDIATE-2018"],
    solveMode: "sideMidpointPlusParallelToSecondMidpointLength", seed, stem: v.stem, ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "D is the midpoint of AB and DE is parallel to BC. By the converse midpoint theorem, E is the midpoint of AC.",
      `Hence AE = EC = AC/2 = ${v.whole}/2 = ${v.half} cm.`,
    ]),
    theoremTrace, displayedClueIds: clueIds, minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: wave6Verifier("HIGH_PRECISION_COORDINATE", topology, [
      "D is independently placed at the midpoint of AB", "DE is parallel to BC", "E lies on AC", "the coordinate construction independently places E at the midpoint of AC",
    ]),
    diagramDisposition: "REQUIRED_BOTH", diagramModel: model, solutionDiagramModel: solution,
  });
}

export const GEO_GAP_REMEDIATION_WAVE6_PROTOTYPES: readonly GapWave6PrototypeDefinition[] = Object.freeze([
  Object.freeze({ temporaryPrototypeId: "GEO-TMP-GAP-W6-CP006-PERP-BISECTOR-EQUIDISTANT-ANGLE-V1", cpId: "GEO-CP-006", sourceGapId: "GEO-CP-006/PERPENDICULAR_BISECTOR_EQUAL_DISTANCE_DIRECT", solveMode: "perpendicularBisectorToIsoscelesAngleRecovery", diagramDisposition: "REQUIRED_BOTH", generate: generatePerpBisectorDirect }),
  Object.freeze({ temporaryPrototypeId: "GEO-TMP-GAP-W6-CP006-PERP-BISECTOR-CONVERSE-RHOMBUS-V1", cpId: "GEO-CP-006", sourceGapId: "GEO-CP-006/PERPENDICULAR_BISECTOR_EQUAL_DISTANCE_CONVERSE", solveMode: "equalDistancesToPerpendicularBisectorToDiagonalLength", diagramDisposition: "REQUIRED_SOLUTION_DIAGRAM", generate: generatePerpBisectorConverseRhombus }),
  Object.freeze({ temporaryPrototypeId: "GEO-TMP-GAP-W6-CP006-CENTROID-INVERSE-MEDIAN-V1", cpId: "GEO-CP-006", sourceGapId: "GEO-CP-006/CENTROID_INVERSE", solveMode: "centroidKnownSectionToWholeMedian", diagramDisposition: "REQUIRED_BOTH", generate: generateCentroidInverse }),
  Object.freeze({ temporaryPrototypeId: "GEO-TMP-GAP-W6-CP006-MIDPOINT-CONVERSE-SEGMENT-V1", cpId: "GEO-CP-006", sourceGapId: "GEO-CP-006/MIDPOINT_CONVERSE", solveMode: "sideMidpointPlusParallelToSecondMidpointLength", diagramDisposition: "REQUIRED_BOTH", generate: generateMidpointConverse }),
]);
