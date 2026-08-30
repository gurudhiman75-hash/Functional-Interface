import {
  CoordinateOracle,
  angle,
  equals,
  parallelogramDiagonalHalf,
  quadrilateralFourthAngle,
  rational,
  rhombusDiagonalIntersectionAngle,
  validateIntendedQuadrilateral,
  type ExactCoordinate,
  type GeoDiagramModel,
  type GeoProofEvent,
  type TheoremId,
} from "../../../../../../shared/geometry";
import {
  buildExplanation,
  buildOptions,
  finalizePhase3Question,
  proveClueMinimality,
} from "../discovery/phase3-utils";
import type { Phase3PrototypeDefinition, Phase3PrototypeQuestion } from "../discovery/phase3-types";

const CP_ID = "GEO-CP-008" as const;
const q = (value: number) => rational(value);
const p = (x: number, y: number): ExactCoordinate => Object.freeze({ x: q(x), y: q(y) });

function parallelogramDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 30, y: 130 },
      { id: "B", label: "B", x: 100, y: 150 },
      { id: "C", label: "C", x: 160, y: 30 },
      { id: "D", label: "D", x: 90, y: 10 },
      { id: "O", label: "O", x: 95, y: 80 },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" },
      { id: "BC", fromPointId: "B", toPointId: "C" },
      { id: "CD", fromPointId: "C", toPointId: "D" },
      { id: "DA", fromPointId: "D", toPointId: "A" },
      { id: "AC", fromPointId: "A", toPointId: "C" },
      { id: "BD", fromPointId: "B", toPointId: "D" },
    ],
    circles: [], angleMarks: [], rightAngleMarks: [], equalLengthMarks: [],
    parallelMarks: [
      { id: "parallel-ab-cd", segmentIds: ["AB", "CD"] },
      { id: "parallel-bc-da", segmentIds: ["BC", "DA"] },
    ],
    arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function rhombusDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 25, y: 85 },
      { id: "B", label: "B", x: 95, y: 25 },
      { id: "C", label: "C", x: 185, y: 75 },
      { id: "D", label: "D", x: 115, y: 135 },
      { id: "O", label: "O", x: 105, y: 80 },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" },
      { id: "BC", fromPointId: "B", toPointId: "C" },
      { id: "CD", fromPointId: "C", toPointId: "D" },
      { id: "DA", fromPointId: "D", toPointId: "A" },
      { id: "AC", fromPointId: "A", toPointId: "C" },
      { id: "BD", fromPointId: "B", toPointId: "D" },
    ],
    circles: [], angleMarks: [], rightAngleMarks: [],
    equalLengthMarks: [{ id: "all-rhombus-sides", segmentIds: ["AB", "BC", "CD", "DA"] }],
    parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function generateFourthAngle(seed: string): Phase3PrototypeQuestion {
  const clueIds = ["ABCD_IS_CONVEX_QUADRILATERAL", "ANGLE_A_IS_75", "ANGLE_B_IS_95", "ANGLE_C_IS_110"] as const;
  const expected = "80°";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const result = quadrilateralFourthAngle(angle(75), angle(95), angle(110));
    return result.denominator === 1n ? `${result.numerator}°` : `${result.numerator}/${result.denominator}°`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Quadrilateral fourth-angle solver mismatch");
  const verifierPassed = 75 + 95 + 110 + 80 === 360;
  const theoremTrace: TheoremId[] = ["POLYGON_INTERIOR_SUM"];
  const proofEvents: GeoProofEvent[] = [{
    kind: "ANGLE_SUM", angleIds: ["A", "B", "C", "D"], total: angle(360), reason: "POLYGON_INTERIOR_SUM",
  }];
  const optionSet = buildOptions(expected, [
    { text: "100°", misconceptionId: "USED_TRIANGLE_ANGLE_SUM", rationale: "Subtracts the three given angles from an inappropriate triangle-based total." },
    { text: "70°", misconceptionId: "ARITHMETIC_SUBTRACTION_ERROR", rationale: "Makes a subtraction error after using the 360° quadrilateral sum." },
    { text: "90°", misconceptionId: "ASSUMED_RIGHT_ANGLE", rationale: "Adds an unstated right-angle property to a general quadrilateral." },
  ], seed);
  return finalizePhase3Question({
    cpId: CP_ID,
    temporaryPrototypeId: "GEO-TMP-CP008-FOURTH-ANGLE-V1",
    solveMode: "findFourthQuadrilateralAngle",
    difficulty: "Easy",
    seed,
    stem: "In a convex quadrilateral ABCD, ∠A = 75°, ∠B = 95° and ∠C = 110°. Find ∠D.",
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "A quadrilateral has four interior angles whose total is 360°.",
      "Therefore ∠D = 360° − (75° + 95° + 110°) = 360° − 280° = 80°.",
    ]),
    theoremTrace,
    proofEvents,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: Object.freeze({
      passed: verifierPassed,
      oracle: "INDEPENDENT_ARITHMETIC",
      checks: Object.freeze(["75 + 95 + 110 + 80 = 360"]),
    }),
  });
}

function generateParallelogramDiagonal(seed: string): Phase3PrototypeQuestion {
  const clueIds = ["ABCD_IS_PARALLELOGRAM", "DIAGONALS_INTERSECT_AT_O", "AC_IS_18"] as const;
  const expected = "9 cm";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const value = parallelogramDiagonalHalf(q(18));
    return value.denominator === 1n ? `${value.numerator} cm` : null;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Parallelogram diagonal-bisection solver mismatch");
  const A = p(0, 0); const B = p(6, 4); const C = p(0, 18); const D = p(-6, 14); const O = p(0, 9);
  const classification = validateIntendedQuadrilateral([A, B, C, D], "PARALLELOGRAM");
  const oracle = new CoordinateOracle({ A, B, C, D, O });
  const verifierPassed = classification.valid
    && oracle.collinear("A", "O", "C")
    && oracle.collinear("B", "O", "D")
    && oracle.equalLengths("A", "O", "O", "C")
    && oracle.equalLengths("B", "O", "O", "D")
    && equals(oracle.squaredLength("A", "C"), q(324));
  if (!verifierPassed) throw new Error(`Parallelogram coordinate verification failed: ${classification.errors.join(",")}`);
  const theoremTrace: TheoremId[] = ["PARALLELOGRAM_DIAGONALS_BISECT"];
  const proofEvents: GeoProofEvent[] = [{
    kind: "SEGMENT_RATIO", left: "AO", right: "OC", ratio: rational(1), reason: "PARALLELOGRAM_DIAGONALS_BISECT",
  }];
  const optionSet = buildOptions(expected, [
    { text: "18 cm", misconceptionId: "DIAGONAL_NOT_BISECTED", rationale: "Uses the full diagonal length as one half." },
    { text: "6 cm", misconceptionId: "DIVIDED_DIAGONAL_INTO_THREE", rationale: "Divides the diagonal into three parts instead of two equal parts." },
    { text: "36 cm", misconceptionId: "DOUBLED_DIAGONAL", rationale: "Doubles the given diagonal instead of taking half." },
  ], seed);
  return finalizePhase3Question({
    cpId: CP_ID,
    temporaryPrototypeId: "GEO-TMP-CP008-PARALLELOGRAM-DIAGONAL-V1",
    solveMode: "findParallelogramHalfDiagonal",
    difficulty: "Easy",
    seed,
    stem: "ABCD is a parallelogram whose diagonals AC and BD intersect at O. If AC = 18 cm, find AO.",
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "The diagonals of a parallelogram bisect each other, so O is the midpoint of AC.",
      "Hence AO = AC/2 = 18/2 = 9 cm.",
    ]),
    theoremTrace,
    proofEvents,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: Object.freeze({
      passed: verifierPassed,
      oracle: "COORDINATE_ORACLE",
      checks: Object.freeze(["hidden quadrilateral is a valid parallelogram with no accidental rectangle/rhombus/square subtype", "O lies on both diagonals", "O is the exact midpoint of both diagonals", "AC has exact length 18"]),
    }),
    diagramModel: parallelogramDiagram(),
  });
}

function generateRhombusDiagonalAngle(seed: string): Phase3PrototypeQuestion {
  const clueIds = ["ABCD_IS_RHOMBUS", "DIAGONALS_INTERSECT_AT_O"] as const;
  const expected = "90°";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const value = rhombusDiagonalIntersectionAngle();
    return `${value.numerator}°`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Rhombus diagonal-angle solver mismatch");
  const A = p(-5, 0); const B = p(0, 3); const C = p(5, 0); const D = p(0, -3); const O = p(0, 0);
  const classification = validateIntendedQuadrilateral([A, B, C, D], "RHOMBUS");
  const oracle = new CoordinateOracle({ A, B, C, D, O });
  const verifierPassed = classification.valid
    && oracle.collinear("A", "O", "C")
    && oracle.collinear("B", "O", "D")
    && oracle.perpendicular("A", "C", "B", "D");
  if (!verifierPassed) throw new Error(`Rhombus coordinate verification failed: ${classification.errors.join(",")}`);
  const theoremTrace: TheoremId[] = ["RHOMBUS_DIAGONALS_PERPENDICULAR"];
  const proofEvents: GeoProofEvent[] = [{
    kind: "ANGLE_SUM", angleIds: ["AOB"], total: angle(90), reason: "RHOMBUS_DIAGONALS_PERPENDICULAR",
  }];
  const optionSet = buildOptions(expected, [
    { text: "45°", misconceptionId: "DIAGONALS_ASSUMED_ANGLE_BISECTORS_ONLY", rationale: "Confuses diagonal angle-bisecting behavior with the angle between the diagonals." },
    { text: "60°", misconceptionId: "ASSUMED_EQUILATERAL_GEOMETRY", rationale: "Imports a 60° triangle angle without justification." },
    { text: "180°", misconceptionId: "DIAGONALS_ASSUMED_COLLINEAR", rationale: "Treats the two distinct diagonals as one straight line." },
  ], seed);
  return finalizePhase3Question({
    cpId: CP_ID,
    temporaryPrototypeId: "GEO-TMP-CP008-RHOMBUS-DIAGONAL-ANGLE-V1",
    solveMode: "findRhombusDiagonalIntersectionAngle",
    difficulty: "Easy",
    seed,
    stem: "ABCD is a rhombus whose diagonals AC and BD intersect at O. Find ∠AOB.",
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "The diagonals of a rhombus are perpendicular to each other.",
      "Therefore the angle formed where AC and BD meet is a right angle, so ∠AOB = 90°.",
    ]),
    theoremTrace,
    proofEvents,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: Object.freeze({
      passed: verifierPassed,
      oracle: "COORDINATE_ORACLE",
      checks: Object.freeze(["hidden quadrilateral is a valid rhombus and not an accidental square", "O lies on both diagonals", "AC is exactly perpendicular to BD"]),
    }),
    diagramModel: rhombusDiagram(),
  });
}

export const GEO_CP_008_PHASE3_PROTOTYPES: readonly Phase3PrototypeDefinition[] = Object.freeze([
  { temporaryPrototypeId: "GEO-TMP-CP008-FOURTH-ANGLE-V1", cpId: CP_ID, solveMode: "findFourthQuadrilateralAngle", generate: generateFourthAngle },
  { temporaryPrototypeId: "GEO-TMP-CP008-PARALLELOGRAM-DIAGONAL-V1", cpId: CP_ID, solveMode: "findParallelogramHalfDiagonal", generate: generateParallelogramDiagonal },
  { temporaryPrototypeId: "GEO-TMP-CP008-RHOMBUS-DIAGONAL-ANGLE-V1", cpId: CP_ID, solveMode: "findRhombusDiagonalIntersectionAngle", generate: generateRhombusDiagonalAngle },
]);
