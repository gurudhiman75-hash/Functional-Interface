import {
  CoordinateOracle,
  angle,
  angleBetweenTangentsFromCentral,
  angleInSemicircle,
  identifyTriangleCentreFromConcurrency,
  rational,
  tangentChordAngleFromAlternateSegment,
  type GeoDiagramModel,
  type TheoremId,
} from "../../../../../shared/geometry";
import {
  approximate,
  buildExplanation,
  buildOptions,
  finalizeGapWave1Question,
  numericAngleDegrees,
  proveClueMinimality,
  remediationVerifier,
} from "./wave1-utils";
import type { GapWave1PrototypeDefinition, GapWave1Question } from "./wave1-types";

const q = (value: number, denominator = 1) => rational(value, denominator);

function circumcentreDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 25, y: 150 },
      { id: "B", label: "B", x: 185, y: 150 },
      { id: "C", label: "C", x: 65, y: 20 },
      { id: "M", label: "M", x: 105, y: 150 },
      { id: "N", label: "N", x: 45, y: 85 },
      { id: "O", label: "O", x: 103, y: 82 },
    ],
    segments: [
      { id: "AM", fromPointId: "A", toPointId: "M" },
      { id: "MB", fromPointId: "M", toPointId: "B" },
      { id: "AN", fromPointId: "A", toPointId: "N" },
      { id: "NC", fromPointId: "N", toPointId: "C" },
      { id: "BC", fromPointId: "B", toPointId: "C" },
      { id: "OM", fromPointId: "O", toPointId: "M" },
      { id: "ON", fromPointId: "O", toPointId: "N" },
    ],
    circles: [],
    angleMarks: [],
    rightAngleMarks: [
      { id: "perp-ab", vertexPointId: "M", firstRayPointId: "A", secondRayPointId: "O" },
      { id: "perp-ac", vertexPointId: "N", firstRayPointId: "A", secondRayPointId: "O" },
    ],
    equalLengthMarks: [
      { id: "mid-ab", segmentIds: ["AM", "MB"] },
      { id: "mid-ac", segmentIds: ["AN", "NC"] },
    ],
    parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function semicircleDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "O", label: "O", x: 100, y: 100 },
      { id: "A", label: "A", x: 30, y: 100 },
      { id: "B", label: "B", x: 170, y: 100 },
      { id: "P", label: "P", x: 144, y: 43 },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" },
      { id: "PA", fromPointId: "P", toPointId: "A" },
      { id: "PB", fromPointId: "P", toPointId: "B" },
    ],
    circles: [{ id: "circle-o", centerPointId: "O", radius: 70 }],
    angleMarks: [{ id: "angle-apb", firstPointId: "A", vertexPointId: "P", secondPointId: "B", label: "x" }],
    rightAngleMarks: [], equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function twoTangentsDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "O", label: "O", x: 100, y: 100 },
      { id: "A", label: "A", x: 137, y: 41 },
      { id: "B", label: "B", x: 137, y: 159 },
      { id: "P", label: "P", x: 232, y: 100 },
    ],
    segments: [
      { id: "OA", fromPointId: "O", toPointId: "A" },
      { id: "OB", fromPointId: "O", toPointId: "B" },
      { id: "PA", fromPointId: "P", toPointId: "A" },
      { id: "PB", fromPointId: "P", toPointId: "B" },
    ],
    circles: [{ id: "circle-o", centerPointId: "O", radius: 70 }],
    angleMarks: [
      { id: "central-aob", firstPointId: "A", vertexPointId: "O", secondPointId: "B", label: "124°" },
      { id: "angle-apb", firstPointId: "A", vertexPointId: "P", secondPointId: "B", label: "x" },
    ],
    rightAngleMarks: [], equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function tangentChordDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "O", label: "O", x: 100, y: 100 },
      { id: "T", label: "T", x: 170, y: 100 },
      { id: "A", label: "A", x: 110, y: 31 },
      { id: "B", label: "B", x: 32, y: 112 },
      { id: "P", label: "P", x: 170, y: 25 },
    ],
    segments: [
      { id: "PT", fromPointId: "P", toPointId: "T" },
      { id: "TA", fromPointId: "T", toPointId: "A" },
      { id: "BT", fromPointId: "B", toPointId: "T" },
      { id: "BA", fromPointId: "B", toPointId: "A" },
    ],
    circles: [{ id: "circle-o", centerPointId: "O", radius: 70 }],
    angleMarks: [
      { id: "alternate-angle", firstPointId: "T", vertexPointId: "B", secondPointId: "A", label: "38°" },
      { id: "tangent-chord-angle", firstPointId: "P", vertexPointId: "T", secondPointId: "A", label: "x" },
    ],
    rightAngleMarks: [], equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function generateCircumcentreIdentification(seed: string): GapWave1Question {
  const clueIds = ["ABC_IS_TRIANGLE", "O_ON_PERP_BISECTOR_AB", "O_ON_PERP_BISECTOR_AC"] as const;
  const expected = "Circumcentre";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    return identifyTriangleCentreFromConcurrency("PERPENDICULAR_BISECTORS");
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Circumcentre identification solver mismatch");

  const oracle = new CoordinateOracle({
    A: { x: q(0), y: q(0) }, B: { x: q(6), y: q(0) }, C: { x: q(2), y: q(4) },
    M: { x: q(3), y: q(0) }, N: { x: q(1), y: q(2) }, O: { x: q(3), y: q(1) },
  });
  const passed = oracle.collinear("A", "M", "B")
    && oracle.equalLengths("A", "M", "M", "B")
    && oracle.collinear("A", "N", "C")
    && oracle.equalLengths("A", "N", "N", "C")
    && oracle.perpendicular("M", "O", "A", "B")
    && oracle.perpendicular("N", "O", "A", "C")
    && oracle.equalLengths("O", "A", "O", "B")
    && oracle.equalLengths("O", "A", "O", "C");
  const theoremTrace: TheoremId[] = ["TRIANGLE_CENTRE_PERP_BISECTORS_CIRCUMCENTRE"];
  const optionSet = buildOptions(expected, [
    { text: "Incentre", misconceptionId: "CENTRE_CONFUSED_WITH_ANGLE_BISECTORS", rationale: "The incentre is where the internal angle bisectors meet." },
    { text: "Centroid", misconceptionId: "CENTRE_CONFUSED_WITH_MEDIANS", rationale: "The centroid is where the medians meet." },
    { text: "Orthocentre", misconceptionId: "CENTRE_CONFUSED_WITH_ALTITUDES", rationale: "The orthocentre is where the altitudes meet." },
  ], seed);
  return finalizeGapWave1Question({
    cpId: "GEO-CP-006", temporaryPrototypeId: "GEO-TMP-GAP-CP006-CIRCUMCENTRE-IDENTIFY-V1",
    sourceGapId: "GEO-CP-006/CENTRE_IDENTIFICATION",
    sourceEvidenceIds: ["SRC-TESTBOOK-SSC-CHSL-GEOMETRY-PYQ-2026"],
    solveMode: "identifyTriangleCentreFromPerpendicularBisectors", difficulty: "Easy", seed,
    stem: "In triangle ABC, the perpendicular bisectors of AB and AC meet at O. Which centre of the triangle is O?",
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "The perpendicular bisectors of the sides of a triangle meet at the circumcentre.",
      "Therefore O is the circumcentre of triangle ABC.",
    ]),
    theoremTrace, proofEvents: [], displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: remediationVerifier("COORDINATE_ORACLE", passed, [
      "M and N are exact side midpoints", "OM and ON are exact perpendicular bisectors", "hidden O is exactly equidistant from A, B and C",
    ]),
    diagramDisposition: "REQUIRED_STEM_DIAGRAM", diagramModel: circumcentreDiagram(),
  });
}

function generateAngleInSemicircle(seed: string): GapWave1Question {
  const clueIds = ["AB_IS_DIAMETER", "P_ON_CIRCLE"] as const;
  const expected = "90°";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    return `${angleInSemicircle().numerator}°`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Semicircle solver mismatch");
  const oracle = new CoordinateOracle({
    O: { x: q(0), y: q(0) }, A: { x: q(-5), y: q(0) }, B: { x: q(5), y: q(0) }, P: { x: q(3), y: q(4) },
  });
  const passed = oracle.pointOnCircle("A", "O", q(25)) && oracle.pointOnCircle("B", "O", q(25))
    && oracle.pointOnCircle("P", "O", q(25)) && oracle.collinear("A", "O", "B")
    && oracle.perpendicular("P", "A", "P", "B");
  const theoremTrace: TheoremId[] = ["ANGLE_IN_SEMICIRCLE"];
  const optionSet = buildOptions(expected, [
    { text: "45°", misconceptionId: "SEMICIRCLE_ANGLE_HALVED", rationale: "Halves a right angle without using the diameter theorem." },
    { text: "180°", misconceptionId: "DIAMETER_STRAIGHT_ANGLE_MOVED_TO_CIRCUMFERENCE", rationale: "Confuses the straight angle at the centre with the angle at the circumference." },
    { text: "60°", misconceptionId: "SEMICIRCLE_STANDARD_ANGLE_GUESS", rationale: "Uses an unrelated standard angle." },
  ], seed);
  return finalizeGapWave1Question({
    cpId: "GEO-CP-011", temporaryPrototypeId: "GEO-TMP-GAP-CP011-SEMICIRCLE-ANGLE-V1",
    sourceGapId: "GEO-CP-011/ANGLE_IN_SEMICIRCLE",
    sourceEvidenceIds: ["SRC-OLIVEBOARD-CGL-CYCLIC-PYQ-2023"],
    solveMode: "findAngleSubtendedByDiameterAtCircumference", difficulty: "Easy", seed,
    stem: "AB is a diameter of a circle and P is another point on the circle. Find ∠APB.",
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "An angle subtended by a diameter at any point on the remaining circumference is a right angle.",
      "So ∠APB = 90°.",
    ]),
    theoremTrace, proofEvents: [], displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: remediationVerifier("COORDINATE_ORACLE", passed, [
      "hidden A and B are opposite endpoints of one exact diameter", "hidden P lies exactly on the same circle", "hidden PA and PB are exactly perpendicular",
    ]),
    diagramDisposition: "REQUIRED_STEM_DIAGRAM", diagramModel: semicircleDiagram(),
  });
}

function generateAngleBetweenTangents(seed: string): GapWave1Question {
  const clueIds = ["PA_TANGENT_AT_A", "PB_TANGENT_AT_B", "O_IS_CENTRE", "ANGLE_AOB_IS_124"] as const;
  const expected = "56°";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const result = angleBetweenTangentsFromCentral(angle(124));
    return `${result.numerator}°`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Angle-between-tangents solver mismatch");

  const theta = 62 * Math.PI / 180;
  const A = { x: Math.cos(theta), y: Math.sin(theta) };
  const B = { x: Math.cos(theta), y: -Math.sin(theta) };
  const O = { x: 0, y: 0 };
  const P = { x: 1 / Math.cos(theta), y: 0 };
  const central = numericAngleDegrees(A, O, B);
  const external = numericAngleDegrees(A, P, B);
  const tangentCheckA = (A.x * (P.x - A.x)) + (A.y * (P.y - A.y));
  const tangentCheckB = (B.x * (P.x - B.x)) + (B.y * (P.y - B.y));
  const passed = approximate(Math.hypot(A.x, A.y), 1) && approximate(Math.hypot(B.x, B.y), 1)
    && approximate(tangentCheckA, 0) && approximate(tangentCheckB, 0)
    && approximate(central, 124) && approximate(external, 56);
  const theoremTrace: TheoremId[] = ["RADIUS_PERPENDICULAR_TANGENT", "POLYGON_INTERIOR_SUM"];
  const optionSet = buildOptions(expected, [
    { text: "124°", misconceptionId: "TANGENT_ANGLE_COPIED_CENTRAL", rationale: "Copies the central angle instead of using the two radius–tangent right angles." },
    { text: "62°", misconceptionId: "TANGENT_ANGLE_HALF_CENTRAL", rationale: "Halves the central angle without completing the quadrilateral angle sum." },
    { text: "236°", misconceptionId: "TANGENT_ANGLE_SUBTRACTED_FROM_360", rationale: "Subtracts only the central angle from a full turn." },
  ], seed);
  return finalizeGapWave1Question({
    cpId: "GEO-CP-012", temporaryPrototypeId: "GEO-TMP-GAP-CP012-ANGLE-BETWEEN-TANGENTS-V1",
    sourceGapId: "GEO-CP-012/ANGLE_BETWEEN_TANGENTS",
    sourceEvidenceIds: ["SRC-OLIVEBOARD-CGL-TANGENT-PYQ-2024"],
    solveMode: "findAngleBetweenTangentsFromCentralAngle", difficulty: "Medium", seed,
    stem: "PA and PB are tangents to a circle at A and B, and O is the centre. If ∠AOB = 124°, find ∠APB.",
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "OA is perpendicular to PA and OB is perpendicular to PB, so the angles at A and B are 90° each.",
      "In quadrilateral OAPB, the four angles add to 360°. Hence ∠APB = 360° − 90° − 90° − 124° = 56°.",
    ]),
    theoremTrace, proofEvents: [], displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: remediationVerifier("HIGH_PRECISION_COORDINATE", passed, [
      `independent central angle = ${central.toFixed(8)}°`, `both constructed tangent directions are perpendicular to their radii`, `independent external tangent angle = ${external.toFixed(8)}°`,
    ]),
    diagramDisposition: "REQUIRED_STEM_DIAGRAM", diagramModel: twoTangentsDiagram(),
  });
}

function generateTangentChordAngle(seed: string): GapWave1Question {
  const clueIds = ["PT_TANGENT_AT_T", "T_A_B_ON_CIRCLE", "ANGLE_TBA_IS_38", "ANGLE_TBA_SUBTENDS_CHORD_TA"] as const;
  const expected = "38°";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const result = tangentChordAngleFromAlternateSegment(angle(38));
    return `${result.numerator}°`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Tangent-chord solver mismatch");

  const unit = (degrees: number) => ({ x: Math.cos(degrees * Math.PI / 180), y: Math.sin(degrees * Math.PI / 180) });
  const O = { x: 0, y: 0 };
  const T = unit(0); const A = unit(76); const B = unit(180); const P = { x: 1, y: 2 };
  const alternate = numericAngleDegrees(T, B, A);
  const tangentChord = numericAngleDegrees(P, T, A);
  const tangentDot = T.x * (P.x - T.x) + T.y * (P.y - T.y);
  const passed = [T, A, B].every((point) => approximate(Math.hypot(point.x, point.y), 1))
    && approximate(tangentDot, 0) && approximate(alternate, 38) && approximate(tangentChord, 38);
  const theoremTrace: TheoremId[] = ["TANGENT_CHORD_ANGLE"];
  const optionSet = buildOptions(expected, [
    { text: "52°", misconceptionId: "TANGENT_CHORD_USED_COMPLEMENT", rationale: "Uses the complement of the alternate-segment angle." },
    { text: "76°", misconceptionId: "TANGENT_CHORD_DOUBLED", rationale: "Doubles the circumference angle as though the target were a central angle." },
    { text: "142°", misconceptionId: "TANGENT_CHORD_USED_SUPPLEMENT", rationale: "Uses the supplement instead of the angle in the alternate segment." },
  ], seed);
  return finalizeGapWave1Question({
    cpId: "GEO-CP-012", temporaryPrototypeId: "GEO-TMP-GAP-CP012-TANGENT-CHORD-V1",
    sourceGapId: "GEO-CP-012/TANGENT_CHORD_ALTERNATE_SEGMENT",
    sourceEvidenceIds: ["SRC-TESTBOOK-SSC-CGL-GEOMETRY-PYQ-2026"],
    solveMode: "findTangentChordAngleFromAlternateSegment", difficulty: "Medium", seed,
    stem: "PT is tangent to a circle at T. Points T, A and B lie on the circle, and ∠TBA = 38° subtends chord TA. Find the angle between tangent PT and chord TA.",
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "The angle between a tangent and a chord equals the angle made by that chord in the alternate segment of the circle.",
      "Chord TA makes ∠TBA = 38° at B, so the angle between PT and TA is also 38°.",
    ]),
    theoremTrace, proofEvents: [], displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: remediationVerifier("HIGH_PRECISION_COORDINATE", passed, [
      "T, A and B lie on an independent unit circle", "the constructed tangent at T is perpendicular to OT", `independent alternate-segment angle = ${alternate.toFixed(8)}°`, `independent tangent–chord angle = ${tangentChord.toFixed(8)}°`,
    ]),
    diagramDisposition: "REQUIRED_STEM_DIAGRAM", diagramModel: tangentChordDiagram(),
  });
}

export const GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES: readonly GapWave1PrototypeDefinition[] = Object.freeze([
  { temporaryPrototypeId: "GEO-TMP-GAP-CP006-CIRCUMCENTRE-IDENTIFY-V1", cpId: "GEO-CP-006", sourceGapId: "GEO-CP-006/CENTRE_IDENTIFICATION", solveMode: "identifyTriangleCentreFromPerpendicularBisectors", generate: generateCircumcentreIdentification },
  { temporaryPrototypeId: "GEO-TMP-GAP-CP011-SEMICIRCLE-ANGLE-V1", cpId: "GEO-CP-011", sourceGapId: "GEO-CP-011/ANGLE_IN_SEMICIRCLE", solveMode: "findAngleSubtendedByDiameterAtCircumference", generate: generateAngleInSemicircle },
  { temporaryPrototypeId: "GEO-TMP-GAP-CP012-ANGLE-BETWEEN-TANGENTS-V1", cpId: "GEO-CP-012", sourceGapId: "GEO-CP-012/ANGLE_BETWEEN_TANGENTS", solveMode: "findAngleBetweenTangentsFromCentralAngle", generate: generateAngleBetweenTangents },
  { temporaryPrototypeId: "GEO-TMP-GAP-CP012-TANGENT-CHORD-V1", cpId: "GEO-CP-012", sourceGapId: "GEO-CP-012/TANGENT_CHORD_ALTERNATE_SEGMENT", solveMode: "findTangentChordAngleFromAlternateSegment", generate: generateTangentChordAngle },
]);
