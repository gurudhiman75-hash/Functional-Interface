import {
  CoordinateOracle,
  angle,
  divide,
  equals,
  exactRationalSquareRoot,
  multiply,
  rational,
  subtract,
  type GeoDiagramModel,
  type GeoProofEvent,
  type TheoremId,
} from "../../../../../../shared/geometry";
import {
  approximate,
  buildExplanation,
  buildOptions,
  finalizePhase5Question,
  numericAngleDegrees,
  proveClueMinimality,
  verifier,
} from "../discovery/phase5-utils";
import type { Phase5PrototypeDefinition, Phase5PrototypeQuestion } from "../discovery/phase5-types";

const CP_ID = "GEO-CP-014" as const;
const q = (value: number, denominator = 1) => rational(value, denominator);
const lengthText = (value: ReturnType<typeof rational>) => value.denominator === 1n ? `${value.numerator} cm` : `${value.numerator}/${value.denominator} cm`;

function chordPythagorasDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "O", label: "O", x: 90, y: 125 },
      { id: "A", label: "A", x: 35, y: 55 }, { id: "B", label: "B", x: 165, y: 55 },
      { id: "M", label: "M", x: 90, y: 55 },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" }, { id: "OM", fromPointId: "O", toPointId: "M" },
      { id: "OA", fromPointId: "O", toPointId: "A" }, { id: "AM", fromPointId: "A", toPointId: "M" },
    ],
    circles: [{ id: "circle-o", centerPointId: "O", radius: 88 }],
    angleMarks: [],
    rightAngleMarks: [{ id: "right-m", vertexPointId: "M", firstRayPointId: "O", secondRayPointId: "A" }],
    equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function cyclicIsoscelesDiagram(): GeoDiagramModel {
  const polar = (id: string, degrees: number) => {
    const radians = degrees * Math.PI / 180;
    return { id, label: id, x: 100 + 76 * Math.cos(radians), y: 100 + 76 * Math.sin(radians) };
  };
  return {
    points: [{ id: "O", label: "O", x: 100, y: 100 }, polar("A", 0), polar("B", 55), polar("C", 145), polar("D", 280)],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" }, { id: "BC", fromPointId: "B", toPointId: "C" },
      { id: "CD", fromPointId: "C", toPointId: "D" }, { id: "DA", fromPointId: "D", toPointId: "A" },
      { id: "BD", fromPointId: "B", toPointId: "D" },
    ],
    circles: [{ id: "circle-o", centerPointId: "O", radius: 76 }],
    angleMarks: [
      { id: "angle-dab", firstPointId: "D", vertexPointId: "A", secondPointId: "B", label: "110°" },
      { id: "angle-cbd", firstPointId: "C", vertexPointId: "B", secondPointId: "D", label: "x" },
    ],
    rightAngleMarks: [],
    equalLengthMarks: [{ id: "equal-bc-cd", segmentIds: ["BC", "CD"] }],
    parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function tangentTriangleDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "O", label: "O", x: 90, y: 110 }, { id: "T", label: "T", x: 160, y: 110 }, { id: "P", label: "P", x: 205, y: 45 },
    ],
    segments: [
      { id: "OT", fromPointId: "O", toPointId: "T" }, { id: "TP", fromPointId: "T", toPointId: "P" }, { id: "OP", fromPointId: "O", toPointId: "P" },
    ],
    circles: [{ id: "circle-o", centerPointId: "O", radius: 70 }],
    angleMarks: [
      { id: "angle-top", firstPointId: "T", vertexPointId: "O", secondPointId: "P", label: "35°" },
      { id: "angle-opt", firstPointId: "O", vertexPointId: "P", secondPointId: "T", label: "x" },
    ],
    rightAngleMarks: [], equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function bptBisectorDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 105, y: 20 }, { id: "B", label: "B", x: 25, y: 165 }, { id: "C", label: "C", x: 190, y: 155 },
      { id: "E", label: "E", x: 62, y: 98 }, { id: "F", label: "F", x: 150, y: 92 }, { id: "D", label: "D", x: 92, y: 161 },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" }, { id: "AC", fromPointId: "A", toPointId: "C" }, { id: "BC", fromPointId: "B", toPointId: "C" },
      { id: "EF", fromPointId: "E", toPointId: "F" }, { id: "AD", fromPointId: "A", toPointId: "D" },
    ],
    circles: [], angleMarks: [], rightAngleMarks: [], equalLengthMarks: [],
    parallelMarks: [{ id: "parallel-ef-bc", segmentIds: ["EF", "BC"] }],
    arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function generateChordPythagoras(seed: string): Phase5PrototypeQuestion {
  const clueIds = ["O_CENTRE_AB_CHORD", "OM_PERPENDICULAR_AB_AT_M", "OA_IS_10", "OM_IS_8"] as const;
  const expected = "12 cm";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const halfSquare = subtract(multiply(q(10), q(10)), multiply(q(8), q(8)));
    const halfChord = exactRationalSquareRoot(halfSquare);
    return lengthText(multiply(halfChord, q(2)));
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Chord + Pythagoras mixed solver mismatch");
  const oracle = new CoordinateOracle({ O: { x: q(0), y: q(0) }, A: { x: q(-6), y: q(8) }, B: { x: q(6), y: q(8) }, M: { x: q(0), y: q(8) } });
  const passed = oracle.pointOnCircle("A", "O", q(100)) && oracle.pointOnCircle("B", "O", q(100))
    && oracle.perpendicular("O", "M", "A", "B") && oracle.equalLengths("A", "M", "M", "B")
    && equals(oracle.squaredLength("O", "M"), q(64)) && equals(oracle.squaredLength("A", "B"), q(144));
  const theoremTrace: TheoremId[] = ["PERPENDICULAR_FROM_CENTRE_BISECTS_CHORD", "PYTHAGORAS"];
  const proofEvents: GeoProofEvent[] = [{ kind: "SEGMENT_RATIO", left: "AM", right: "MB", ratio: q(1), reason: "PERPENDICULAR_FROM_CENTRE_BISECTS_CHORD" }];
  const options = buildOptions(expected, [
    { text: "6 cm", misconceptionId: "STOPPED_AT_HALF_CHORD", rationale: "Finds AM correctly but forgets that AB contains two equal halves." },
    { text: "18 cm", misconceptionId: "ADDED_RADIUS_AND_DISTANCE", rationale: "Adds OA and OM rather than using the right triangle." },
    { text: "2 cm", misconceptionId: "SUBTRACTED_RADIUS_AND_DISTANCE", rationale: "Uses 10 − 8 instead of Pythagoras." },
  ], seed);
  return finalizePhase5Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP014-CHORD-PYTHAGORAS-V1", solveMode: "findChordFromRadiusAndCentreDistance", difficulty: "Medium", seed,
    stem: "In a circle with centre O, AB is a chord. OM is perpendicular to AB at M. If OA = 10 cm and OM = 8 cm, find AB.",
    ...options,
    explanation: buildExplanation(theoremTrace, [
      "Because OM is perpendicular to chord AB from the centre, M bisects the chord. So AM = MB.",
      "Triangle OMA is right-angled at M. With OA = 10 cm and OM = 8 cm, Pythagoras gives AM² = 10² − 8² = 36, so AM = 6 cm.",
      "Therefore AB = AM + MB = 6 + 6 = 12 cm.",
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: verifier("COORDINATE_ORACLE", passed, ["hidden chord endpoints lie on the exact radius-10 circle", "OM is exactly perpendicular to AB", "M is the exact chord midpoint", "OM = 8 and AB = 12 exactly"]),
    diagramModel: chordPythagorasDiagram(),
  });
}

function generateCyclicIsosceles(seed: string): Phase5PrototypeQuestion {
  const clueIds = ["ABCD_IS_CYCLIC", "ANGLE_DAB_IS_110", "BC_EQUALS_CD"] as const;
  const expected = "55°";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const angleC = 180 - 110;
    return `${(180 - angleC) / 2}°`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Cyclic + isosceles mixed solver mismatch");
  const unit = (degrees: number) => ({ x: Math.cos(degrees * Math.PI / 180), y: Math.sin(degrees * Math.PI / 180) });
  const A = unit(0); const B = unit(70); const C = unit(180); const D = unit(290);
  const measuredA = numericAngleDegrees(D, A, B);
  const measuredC = numericAngleDegrees(B, C, D);
  const measuredB = numericAngleDegrees(C, B, D);
  const measuredD = numericAngleDegrees(B, D, C);
  const bc = Math.hypot(B.x - C.x, B.y - C.y); const cd = Math.hypot(C.x - D.x, C.y - D.y);
  const passed = approximate(measuredA, 110) && approximate(measuredC, 70) && approximate(measuredB, 55) && approximate(measuredD, 55) && approximate(bc, cd);
  const theoremTrace: TheoremId[] = ["CYCLIC_OPPOSITE_SUPPLEMENTARY", "ISOSCELES_BASE_ANGLES", "TRIANGLE_ANGLE_SUM"];
  const proofEvents: GeoProofEvent[] = [
    { kind: "ANGLE_SUM", angleIds: ["DAB", "BCD"], total: angle(180), reason: "CYCLIC_OPPOSITE_SUPPLEMENTARY" },
    { kind: "ANGLE_EQUALITY", leftAngleId: "CBD", rightAngleId: "BDC", reason: "ISOSCELES_BASE_ANGLES" },
    { kind: "ANGLE_SUM", angleIds: ["CBD", "BCD", "BDC"], total: angle(180), reason: "TRIANGLE_ANGLE_SUM" },
  ];
  const options = buildOptions(expected, [
    { text: "70°", misconceptionId: "STOPPED_AT_CYCLIC_OPPOSITE", rationale: "Finds ∠BCD but stops before using the isosceles triangle." },
    { text: "35°", misconceptionId: "HALVED_CYCLIC_OPPOSITE", rationale: "Halves 70° instead of sharing the remaining 110° between the equal base angles." },
    { text: "110°", misconceptionId: "CYCLIC_OPPOSITE_EQUAL", rationale: "Treats opposite cyclic angles as equal." },
  ], seed);
  return finalizePhase5Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP014-CYCLIC-ISOSCELES-V1", solveMode: "findIsoscelesAngleInsideCyclicQuadrilateral", difficulty: "Medium", seed,
    stem: "ABCD is a cyclic quadrilateral. ∠DAB = 110°. Also, in triangle BCD, BC = CD. Find ∠CBD.",
    ...options,
    explanation: buildExplanation(theoremTrace, [
      "Opposite angles of a cyclic quadrilateral add to 180°, so ∠BCD = 180° − 110° = 70°.",
      "Because BC = CD, triangle BCD is isosceles and its base angles at B and D are equal.",
      "Those two equal angles share the remaining 180° − 70° = 110°, so ∠CBD = 110°/2 = 55°.",
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: verifier("HIGH_PRECISION_COORDINATE", passed, [`hidden cyclic angle DAB = ${measuredA.toFixed(8)}°`, `hidden angle BCD = ${measuredC.toFixed(8)}°`, `hidden BC and CD are equal`, `hidden base angles are ${measuredB.toFixed(8)}° and ${measuredD.toFixed(8)}°`]),
    diagramModel: cyclicIsoscelesDiagram(),
  });
}

function generateTangentTriangle(seed: string): Phase5PrototypeQuestion {
  const clueIds = ["O_IS_CENTRE", "PT_TANGENT_AT_T", "ANGLE_TOP_IS_35"] as const;
  const expected = "55°";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    return `${180 - 90 - 35}°`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Tangent + triangle mixed solver mismatch");
  const O = { x: 0, y: 0 }; const T = { x: 5, y: 0 }; const P = { x: 5, y: 5 * Math.tan(35 * Math.PI / 180) };
  const measuredO = numericAngleDegrees(T, O, P);
  const measuredT = numericAngleDegrees(O, T, P);
  const measuredP = numericAngleDegrees(O, P, T);
  const passed = approximate(Math.hypot(T.x, T.y), 5) && approximate(measuredO, 35) && approximate(measuredT, 90) && approximate(measuredP, 55);
  const theoremTrace: TheoremId[] = ["GIVEN_ANGLE", "RADIUS_PERPENDICULAR_TANGENT", "TRIANGLE_ANGLE_SUM"];
  const proofEvents: GeoProofEvent[] = [
    { kind: "ANGLE_SUM", angleIds: ["OTP"], total: angle(90), reason: "RADIUS_PERPENDICULAR_TANGENT" },
    { kind: "ANGLE_SUM", angleIds: ["TOP", "OTP", "OPT"], total: angle(180), reason: "TRIANGLE_ANGLE_SUM" },
  ];
  const options = buildOptions(expected, [
    { text: "90°", misconceptionId: "RETURNED_RADIUS_TANGENT_ANGLE", rationale: "Returns the right angle at T instead of the requested angle at P." },
    { text: "35°", misconceptionId: "COPIED_GIVEN_CENTRAL_ANGLE", rationale: "Copies the given angle at O." },
    { text: "145°", misconceptionId: "USED_ONLY_SUPPLEMENT", rationale: "Subtracts 35° from 180° but ignores the tangent right angle." },
  ], seed);
  return finalizePhase5Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP014-TANGENT-TRIANGLE-V1", solveMode: "findTriangleAngleUsingRadiusTangent", difficulty: "Medium", seed,
    stem: "PT is tangent to a circle at T, O is the centre, and O, P and T form triangle OPT. If ∠TOP = 35°, find ∠OPT.",
    ...options,
    explanation: buildExplanation(theoremTrace, [
      "The radius OT is perpendicular to tangent PT at the point of contact, so ∠OTP = 90°.",
      "The angles of triangle OPT add to 180°. Therefore ∠OPT = 180° − 90° − 35° = 55°.",
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: verifier("HIGH_PRECISION_COORDINATE", passed, [`hidden ∠TOP = ${measuredO.toFixed(8)}°`, `hidden ∠OTP = ${measuredT.toFixed(8)}°`, `hidden ∠OPT = ${measuredP.toFixed(8)}°`]),
    diagramModel: tangentTriangleDiagram(),
  });
}

function generateBptBisector(seed: string): Phase5PrototypeQuestion {
  const clueIds = ["ABC_TRIANGLE_EF_PARALLEL_BC_WITH_E_ON_AB_F_ON_AC", "AE_IS_4", "EB_IS_2", "AF_IS_6", "AD_BISECTS_ANGLE_A", "BD_IS_4"] as const;
  const expected = "6 cm";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const fc = divide(multiply(q(6), q(2)), q(4));
    const ac = q(6 + Number(fc.numerator / fc.denominator));
    const ab = q(6);
    const ratio = divide(ab, ac);
    const dc = divide(q(4), ratio);
    return lengthText(dc);
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("BPT + angle-bisector mixed solver mismatch");
  const A = { x: 0, y: 0 }; const B = { x: 6, y: 0 };
  const cx = 17 / 12; const cy = Math.sqrt(81 - cx * cx); const C = { x: cx, y: cy };
  const E = { x: 4, y: 0 }; const F = { x: C.x * 2 / 3, y: C.y * 2 / 3 };
  const D = { x: B.x + 0.4 * (C.x - B.x), y: B.y + 0.4 * (C.y - B.y) };
  const distance = (u: { x: number; y: number }, v: { x: number; y: number }) => Math.hypot(u.x - v.x, u.y - v.y);
  const cross = (u: { x: number; y: number }, v: { x: number; y: number }) => u.x * v.y - u.y * v.x;
  const ef = { x: F.x - E.x, y: F.y - E.y }; const bc = { x: C.x - B.x, y: C.y - B.y };
  const angleBAD = numericAngleDegrees(B, A, D); const angleDAC = numericAngleDegrees(D, A, C);
  const passed = approximate(distance(A, B), 6) && approximate(distance(A, C), 9) && approximate(distance(B, C), 10)
    && approximate(distance(A, E), 4) && approximate(distance(E, B), 2) && approximate(distance(A, F), 6)
    && approximate(cross(ef, bc), 0) && approximate(distance(B, D), 4) && approximate(distance(D, C), 6)
    && approximate(angleBAD, angleDAC);
  const theoremTrace: TheoremId[] = ["BASIC_PROPORTIONALITY_THEOREM", "ANGLE_BISECTOR_THEOREM"];
  const proofEvents: GeoProofEvent[] = [
    { kind: "SEGMENT_RATIO", left: "AE:EB", right: "AF:FC", ratio: q(1), reason: "BASIC_PROPORTIONALITY_THEOREM" },
    { kind: "SEGMENT_RATIO", left: "BD", right: "DC", ratio: q(2, 3), reason: "ANGLE_BISECTOR_THEOREM" },
  ];
  const options = buildOptions(expected, [
    { text: "3 cm", misconceptionId: "INVERTED_ANGLE_BISECTOR_RATIO", rationale: "Reverses the side ratio when applying the angle-bisector theorem." },
    { text: "4 cm", misconceptionId: "ASSUMED_BISECTOR_IS_MEDIAN", rationale: "Assumes the angle bisector splits BC into equal segments." },
    { text: "9 cm", misconceptionId: "RETURNED_DERIVED_AC", rationale: "Stops after finding AC and reports the intermediate value." },
  ], seed);
  return finalizePhase5Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP014-BPT-BISECTOR-V1", solveMode: "findSegmentUsingBptThenAngleBisector", difficulty: "Hard", seed,
    stem: "In triangle ABC, E lies on AB and F lies on AC with EF ∥ BC. AE = 4 cm, EB = 2 cm and AF = 6 cm. AD bisects ∠A and meets BC at D. If BD = 4 cm, find DC.",
    ...options,
    explanation: buildExplanation(theoremTrace, [
      "Because EF is parallel to BC, the Basic Proportionality Theorem gives AE/EB = AF/FC. Thus 4/2 = 6/FC, so FC = 3 cm and AC = 6 + 3 = 9 cm. Also AB = 4 + 2 = 6 cm.",
      "Now use the angle-bisector theorem on AD: BD/DC = AB/AC = 6/9 = 2/3.",
      "With BD = 4 cm, 4/DC = 2/3, so DC = 6 cm.",
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: verifier("HIGH_PRECISION_COORDINATE", passed, ["hidden AB = 6, AC = 9 and BC = 10", "hidden AE = 4, EB = 2 and AF = 6", "hidden EF is parallel to BC", "hidden BD = 4 and DC = 6", `hidden angle-bisector halves are ${angleBAD.toFixed(8)}° and ${angleDAC.toFixed(8)}°`]),
    diagramModel: bptBisectorDiagram(),
  });
}

export const GEO_CP_014_PHASE5_PROTOTYPES: readonly Phase5PrototypeDefinition[] = Object.freeze([
  { temporaryPrototypeId: "GEO-TMP-CP014-CHORD-PYTHAGORAS-V1", cpId: CP_ID, solveMode: "findChordFromRadiusAndCentreDistance", generate: generateChordPythagoras },
  { temporaryPrototypeId: "GEO-TMP-CP014-CYCLIC-ISOSCELES-V1", cpId: CP_ID, solveMode: "findIsoscelesAngleInsideCyclicQuadrilateral", generate: generateCyclicIsosceles },
  { temporaryPrototypeId: "GEO-TMP-CP014-TANGENT-TRIANGLE-V1", cpId: CP_ID, solveMode: "findTriangleAngleUsingRadiusTangent", generate: generateTangentTriangle },
  { temporaryPrototypeId: "GEO-TMP-CP014-BPT-BISECTOR-V1", cpId: CP_ID, solveMode: "findSegmentUsingBptThenAngleBisector", generate: generateBptBisector },
]);
