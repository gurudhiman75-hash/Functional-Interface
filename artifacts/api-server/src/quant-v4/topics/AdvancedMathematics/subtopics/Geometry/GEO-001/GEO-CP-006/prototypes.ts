import {
  CoordinateOracle,
  angleBisectorBaseSplit,
  centroidMedianSplit,
  equals,
  midpointTheoremSegment,
  multiply,
  rational,
  type GeoDiagramModel,
  type GeoProofEvent,
  type TheoremId,
} from "../../../../../../shared/geometry";
import {
  buildExplanation,
  buildOptions,
  finalizePhase2Question,
  proveClueMinimality,
} from "../discovery/phase2-utils";
import type { Phase2PrototypeDefinition, Phase2PrototypeQuestion } from "../discovery/phase2-types";

const CP_ID = "GEO-CP-006" as const;
const q = (value: number) => rational(value);

function centroidDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 105, y: 15 },
      { id: "B", label: "B", x: 25, y: 150 },
      { id: "C", label: "C", x: 185, y: 150 },
      { id: "M", label: "M", x: 105, y: 150 },
      { id: "G", label: "G", x: 105, y: 60 },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" },
      { id: "AC", fromPointId: "A", toPointId: "C" },
      { id: "BM", fromPointId: "B", toPointId: "M" },
      { id: "MC", fromPointId: "M", toPointId: "C" },
      { id: "AM", fromPointId: "A", toPointId: "M" },
    ],
    circles: [], angleMarks: [], rightAngleMarks: [],
    equalLengthMarks: [{ id: "midpoint-m", segmentIds: ["BM", "MC"] }],
    parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function angleBisectorDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 25, y: 135 },
      { id: "B", label: "B", x: 180, y: 135 },
      { id: "C", label: "C", x: 25, y: 15 },
      { id: "D", label: "D", x: 92, y: 68 },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" },
      { id: "AC", fromPointId: "A", toPointId: "C" },
      { id: "BD", fromPointId: "B", toPointId: "D" },
      { id: "DC", fromPointId: "D", toPointId: "C" },
      { id: "AD", fromPointId: "A", toPointId: "D" },
    ],
    circles: [],
    angleMarks: [
      { id: "bisector-left", firstPointId: "B", vertexPointId: "A", secondPointId: "D", label: "α" },
      { id: "bisector-right", firstPointId: "D", vertexPointId: "A", secondPointId: "C", label: "α" },
    ],
    rightAngleMarks: [], equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function midpointDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 25, y: 20 },
      { id: "B", label: "B", x: 25, y: 150 },
      { id: "C", label: "C", x: 185, y: 150 },
      { id: "D", label: "D", x: 25, y: 85 },
      { id: "E", label: "E", x: 105, y: 85 },
    ],
    segments: [
      { id: "AD", fromPointId: "A", toPointId: "D" },
      { id: "DB", fromPointId: "D", toPointId: "B" },
      { id: "AE", fromPointId: "A", toPointId: "E" },
      { id: "EC", fromPointId: "E", toPointId: "C" },
      { id: "DE", fromPointId: "D", toPointId: "E" },
      { id: "BC", fromPointId: "B", toPointId: "C" },
    ],
    circles: [], angleMarks: [], rightAngleMarks: [],
    equalLengthMarks: [
      { id: "d-midpoint", segmentIds: ["AD", "DB"] },
      { id: "e-midpoint", segmentIds: ["AE", "EC"] },
    ],
    parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function generateCentroidRatio(seed: string): Phase2PrototypeQuestion {
  const clueIds = ["ABC_IS_TRIANGLE", "AM_IS_MEDIAN", "G_IS_CENTROID", "AM_IS_12"] as const;
  const expected = "8 cm";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const split = centroidMedianSplit(rational(12));
    return split.vertexToCentroid.denominator === 1n ? `${split.vertexToCentroid.numerator} cm` : null;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Centroid 2:1 discovery solver mismatch");
  const oracle = new CoordinateOracle({
    A: { x: q(0), y: q(12) }, B: { x: q(-6), y: q(0) }, C: { x: q(6), y: q(0) },
    M: { x: q(0), y: q(0) }, G: { x: q(0), y: q(4) },
  });
  const ag2 = oracle.squaredLength("A", "G");
  const gm2 = oracle.squaredLength("G", "M");
  const verifierPassed = oracle.collinear("A", "G", "M")
    && oracle.equalLengths("B", "M", "M", "C")
    && equals(ag2, rational(64))
    && equals(gm2, rational(16));
  if (!verifierPassed) throw new Error("Centroid independent coordinate verification failed");
  const theoremTrace: TheoremId[] = ["CENTROID_DIVIDES_MEDIAN_2_TO_1"];
  const proofEvents: GeoProofEvent[] = [{
    kind: "SEGMENT_RATIO",
    left: "AG",
    right: "GM",
    ratio: rational(2),
    reason: "CENTROID_DIVIDES_MEDIAN_2_TO_1",
  }];
  const optionSet = buildOptions(expected, [
    { text: "4 cm", misconceptionId: "REVERSED_CENTROID_RATIO", rationale: "Takes the shorter centroid-to-midpoint part as the vertex-to-centroid part." },
    { text: "6 cm", misconceptionId: "CENTROID_1_TO_1_INSTEAD_OF_2_TO_1", rationale: "Incorrectly divides the median into two equal halves." },
    { text: "10 cm", misconceptionId: "CENTROID_RATIO_USED_AS_DIFFERENCE", rationale: "Treats the 2:1 relation as a subtraction adjustment rather than three equal ratio units." },
  ], seed);
  return finalizePhase2Question({
    cpId: CP_ID,
    temporaryPrototypeId: "GEO-TMP-CP006-CENTROID-2TO1-V1",
    solveMode: "findCentroidMedianSegment",
    difficulty: "Easy",
    seed,
    stem: "In triangle ABC, AM is a median of length 12 cm and G is the centroid on AM. Find AG.",
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "A centroid divides every median in the ratio 2:1, with the longer part next to the vertex.",
      "So AM is split into 3 equal ratio parts. AG = (2/3) × 12 = 8 cm.",
    ]),
    theoremTrace,
    proofEvents,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: Object.freeze({
      passed: verifierPassed,
      oracle: "COORDINATE_ORACLE",
      checks: Object.freeze(["M is the exact midpoint of BC", "A, G and M are collinear", "hidden coordinates give AG = 8 and GM = 4"]),
    }),
    diagramModel: centroidDiagram(),
  });
}

function generateAngleBisectorRatio(seed: string): Phase2PrototypeQuestion {
  const clueIds = ["ABC_IS_TRIANGLE", "D_ON_BC", "AD_BISECTS_ANGLE_A", "AB_IS_21", "AC_IS_28", "BD_IS_15"] as const;
  const expected = "20 cm";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const dc = angleBisectorBaseSplit(rational(21), rational(28), rational(15));
    return dc.denominator === 1n ? `${dc.numerator} cm` : `${dc.numerator}/${dc.denominator} cm`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Angle-bisector theorem discovery solver mismatch");
  const realization = {
    A: { x: q(0), y: q(0) }, B: { x: q(21), y: q(0) }, C: { x: q(0), y: q(28) }, D: { x: q(12), y: q(12) },
  } as const;
  const oracle = new CoordinateOracle(realization);
  const ab2 = oracle.squaredLength("A", "B");
  const ac2 = oracle.squaredLength("A", "C");
  const bd2 = oracle.squaredLength("B", "D");
  const dc2 = oracle.squaredLength("D", "C");
  const verifierPassed = oracle.collinear("B", "D", "C")
    && oracle.perpendicular("A", "B", "A", "C")
    && equals(realization.D.x, realization.D.y)
    && equals(multiply(ab2, dc2), multiply(ac2, bd2));
  if (!verifierPassed) throw new Error("Angle-bisector independent coordinate verification failed");
  const theoremTrace: TheoremId[] = ["ANGLE_BISECTOR_THEOREM"];
  const proofEvents: GeoProofEvent[] = [{
    kind: "SEGMENT_RATIO",
    left: "BD/DC",
    right: "AB/AC",
    ratio: rational(3, 4),
    reason: "ANGLE_BISECTOR_THEOREM",
  }];
  const optionSet = buildOptions(expected, [
    { text: "15 cm", misconceptionId: "ANGLE_BISECTOR_ASSUMED_MEDIAN", rationale: "Assumes an angle bisector must split the opposite side into equal parts." },
    { text: "28 cm", misconceptionId: "MIXED_NONCORRESPONDING_SIDES", rationale: "Copies AC instead of using the proportional division of BC." },
    { text: "35 cm", misconceptionId: "INVERTED_SIDE_RATIO", rationale: "Uses the adjacent-side ratio in the wrong direction when solving for DC." },
  ], seed);
  return finalizePhase2Question({
    cpId: CP_ID,
    temporaryPrototypeId: "GEO-TMP-CP006-ANGLE-BISECTOR-RATIO-V1",
    solveMode: "findOppositeSegmentByAngleBisectorTheorem",
    difficulty: "Medium",
    seed,
    stem: "In triangle ABC, D lies on BC and AD bisects ∠A. If AB = 21 cm, AC = 28 cm and BD = 15 cm, find DC.",
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "Because AD bisects ∠A, the angle-bisector theorem gives BD/DC = AB/AC.",
      "Thus 15/DC = 21/28 = 3/4. Therefore 3DC = 60 and DC = 20 cm.",
    ]),
    theoremTrace,
    proofEvents,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: Object.freeze({
      passed: verifierPassed,
      oracle: "COORDINATE_ORACLE",
      checks: Object.freeze(["B, D and C are exactly collinear", "AB is perpendicular to AC and hidden D lies on the 45° direction x = y, independently realizing the angle bisector", "exact squared lengths satisfy AB²·DC² = AC²·BD²"]),
    }),
    diagramModel: angleBisectorDiagram(),
  });
}

function generateMidpointTheorem(seed: string): Phase2PrototypeQuestion {
  const clueIds = ["ABC_IS_TRIANGLE", "D_MIDPOINT_AB", "E_MIDPOINT_AC", "BC_IS_10"] as const;
  const expected = "5 cm";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const de = midpointTheoremSegment(rational(10));
    return de.denominator === 1n ? `${de.numerator} cm` : `${de.numerator}/${de.denominator} cm`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Midpoint theorem discovery solver mismatch");
  const oracle = new CoordinateOracle({
    A: { x: q(0), y: q(0) }, B: { x: q(6), y: q(0) }, C: { x: q(0), y: q(8) },
    D: { x: q(3), y: q(0) }, E: { x: q(0), y: q(4) },
  });
  const de2 = oracle.squaredLength("D", "E");
  const bc2 = oracle.squaredLength("B", "C");
  const verifierPassed = oracle.collinear("A", "D", "B")
    && oracle.collinear("A", "E", "C")
    && oracle.equalLengths("A", "D", "D", "B")
    && oracle.equalLengths("A", "E", "E", "C")
    && oracle.parallel("D", "E", "B", "C")
    && equals(multiply(de2, rational(4)), bc2);
  if (!verifierPassed) throw new Error("Midpoint theorem coordinate verification failed");
  const theoremTrace: TheoremId[] = ["MIDPOINT_THEOREM"];
  const proofEvents: GeoProofEvent[] = [{
    kind: "SEGMENT_RATIO",
    left: "DE",
    right: "BC",
    ratio: rational(1, 2),
    reason: "MIDPOINT_THEOREM",
  }];
  const optionSet = buildOptions(expected, [
    { text: "10 cm", misconceptionId: "MIDPOINT_SEGMENT_ASSUMED_EQUAL_THIRD_SIDE", rationale: "Treats the midpoint segment as equal to the whole third side instead of half." },
    { text: "20 cm", misconceptionId: "REVERSED_MIDPOINT_RATIO", rationale: "Doubles the third side instead of halving it." },
    { text: "2.5 cm", misconceptionId: "HALVED_TWICE", rationale: "Applies the half-length relation twice." },
  ], seed);
  return finalizePhase2Question({
    cpId: CP_ID,
    temporaryPrototypeId: "GEO-TMP-CP006-MIDPOINT-THEOREM-V1",
    solveMode: "findMidpointJoinLength",
    difficulty: "Easy",
    seed,
    stem: "In triangle ABC, D is the midpoint of AB and E is the midpoint of AC. If BC = 10 cm, find DE.",
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "The segment joining the midpoints of two sides of a triangle is parallel to the third side and half its length.",
      "Therefore DE = BC/2 = 10/2 = 5 cm.",
    ]),
    theoremTrace,
    proofEvents,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: Object.freeze({
      passed: verifierPassed,
      oracle: "COORDINATE_ORACLE",
      checks: Object.freeze(["D and E are exact side midpoints", "hidden coordinate DE is exactly parallel to BC", "4·DE² = BC², hence DE is half of BC"]),
    }),
    diagramModel: midpointDiagram(),
  });
}

export const GEO_CP_006_PHASE2_PROTOTYPES: readonly Phase2PrototypeDefinition[] = Object.freeze([
  { temporaryPrototypeId: "GEO-TMP-CP006-CENTROID-2TO1-V1", cpId: CP_ID, solveMode: "findCentroidMedianSegment", generate: generateCentroidRatio },
  { temporaryPrototypeId: "GEO-TMP-CP006-ANGLE-BISECTOR-RATIO-V1", cpId: CP_ID, solveMode: "findOppositeSegmentByAngleBisectorTheorem", generate: generateAngleBisectorRatio },
  { temporaryPrototypeId: "GEO-TMP-CP006-MIDPOINT-THEOREM-V1", cpId: CP_ID, solveMode: "findMidpointJoinLength", generate: generateMidpointTheorem },
]);
