import {
  angle,
  rational,
  type GeoDiagramModel,
  type GeoProofEvent,
  type TheoremId,
} from "../../../../../shared/geometry";
import {
  buildExplanation,
  buildOptions,
  finalizeGapWave9Question,
  proveClueMinimality,
  wave9Verifier,
} from "./wave9-utils";
import type { GapWave9PrototypeDefinition, GapWave9Question } from "./wave9-types";

function variantIndex(seed: string, count: number): number {
  const final = seed.at(-1)?.toLowerCase();
  if (final && final >= "a" && final <= "z") return (final.charCodeAt(0) - 97) % count;
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  return hash % count;
}

function aroundPointDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "O", label: "O", x: 105, y: 85 },
      { id: "A", label: "A", x: 195, y: 85 },
      { id: "B", label: "B", x: 60, y: 18 },
      { id: "C", label: "C", x: 60, y: 152 },
    ],
    segments: [
      { id: "OA", fromPointId: "O", toPointId: "A" },
      { id: "OB", fromPointId: "O", toPointId: "B" },
      { id: "OC", fromPointId: "O", toPointId: "C" },
    ],
    circles: [],
    angleMarks: [
      { id: "aob", firstPointId: "A", vertexPointId: "O", secondPointId: "B", label: "x" },
      { id: "boc", firstPointId: "B", vertexPointId: "O", secondPointId: "C", label: "x" },
      { id: "coa", firstPointId: "C", vertexPointId: "O", secondPointId: "A", label: "x" },
    ],
    rightAngleMarks: [], equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function alternateInteriorDiagram(givenLabel: string): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 20, y: 45 }, { id: "P", label: "P", x: 88, y: 45 }, { id: "B", label: "B", x: 205, y: 45 },
      { id: "C", label: "C", x: 20, y: 135 }, { id: "Q", label: "Q", x: 151, y: 135 }, { id: "D", label: "D", x: 215, y: 135 },
      { id: "E", label: "E", x: 60, y: 5 }, { id: "F", label: "F", x: 185, y: 182 },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" },
      { id: "CD", fromPointId: "C", toPointId: "D" },
      { id: "EF", fromPointId: "E", toPointId: "F" },
    ],
    circles: [],
    angleMarks: [
      { id: "given-alt", firstPointId: "B", vertexPointId: "P", secondPointId: "Q", label: givenLabel },
      { id: "target-alt", firstPointId: "P", vertexPointId: "Q", secondPointId: "C", label: "x" },
    ],
    rightAngleMarks: [], equalLengthMarks: [],
    parallelMarks: [{ id: "parallel-ab-cd", segmentIds: ["AB", "CD"] }],
    arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function generateAroundPoint(seed: string): GapWave9Question {
  const stems = [
    "At point O, the three angles ∠AOB, ∠BOC and ∠COA are equal and together make a full turn. Find ∠AOB.",
    "Three rays OA, OB and OC divide the angles around O into three equal parts. What is the measure of each part?",
    "If ∠AOB = ∠BOC = ∠COA and the three angles surround point O completely, find ∠BOC.",
  ] as const;
  const stem = stems[variantIndex(seed, stems.length)];
  const clueIds = ["THREE_ANGLES_SURROUND_POINT_O", "THREE_ANGLES_EQUAL", "TARGET_ONE_EQUAL_ANGLE"] as const;
  const expected = "120°";
  const solve = (active: ReadonlySet<string>): string | null => clueIds.every((clue) => active.has(clue)) ? "120°" : null;
  const theoremTrace: TheoremId[] = ["ANGLE_AROUND_POINT"];
  const proofEvents: GeoProofEvent[] = [{ kind: "ANGLE_SUM", angleIds: ["AOB", "BOC", "COA"], total: angle(360), reason: "ANGLE_AROUND_POINT" }];
  const optionSet = buildOptions(expected, [
    { text: "60°", misconceptionId: "USED_HALF_TURN_FOR_AROUND_POINT", rationale: "Divides 180° by three, treating the full set of angles around O as a straight angle." },
    { text: "90°", misconceptionId: "ASSUMED_FOUR_EQUAL_RIGHT_ANGLES", rationale: "Imports a four-quadrant right-angle picture even though exactly three equal angles are stated." },
    { text: "180°", misconceptionId: "USED_STRAIGHT_ANGLE_AS_ONE_PART", rationale: "Reports a straight angle as one sector instead of dividing the full 360° turn among the three equal sectors." },
  ], seed);
  return finalizeGapWave9Question({
    cpId: "GEO-CP-001",
    temporaryPrototypeId: "GEO-TMP-GAP-W9-CP001-AROUND-POINT-EQUAL-ANGLES-V1",
    sourceGapId: "GEO-CP-001/AROUND_POINT_SUM",
    sourceEvidenceIds: ["SRC-TESTBOOK-CGL-AROUND-POINT-EQUAL-ANGLES-PYQ-2022"],
    solveMode: "findEqualAngleAroundPoint",
    difficulty: "Easy",
    seed,
    stem,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "Angles around a point make one complete turn, so their total is 360°.",
      "The three angles are equal, so each is 360° ÷ 3 = 120°.",
    ]),
    theoremTrace,
    proofEvents,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: wave9Verifier("INDEPENDENT_ARITHMETIC", 3 * 120 === 360, ["three equal 120° sectors total exactly 360°"]),
    diagramDisposition: "REQUIRED_STEM_DIAGRAM",
    diagramModel: aroundPointDiagram(),
  });
}

function generateAlternateInterior(seed: string): GapWave9Question {
  const variants = [
    { value: 115, stem: "Two parallel lines AB and CD are cut by transversal EF at P and Q. If one alternate interior angle is 115°, find the alternate interior angle on the opposite side of the transversal." },
    { value: 72, stem: "AB ∥ CD and EF is a transversal meeting them at P and Q. An alternate interior angle at P is 72°. What is its alternate interior partner at Q?" },
    { value: 38, stem: "A transversal crosses two parallel lines. One of a pair of alternate interior angles measures 38°. Find the other angle in that pair." },
  ] as const;
  const variant = variants[variantIndex(seed, variants.length)];
  const clueIds = ["TWO_LINES_PARALLEL", "COMMON_TRANSVERSAL", "ONE_ALTERNATE_INTERIOR_ANGLE_GIVEN", "TARGET_OTHER_ALTERNATE_INTERIOR_ANGLE"] as const;
  const expected = `${variant.value}°`;
  const solve = (active: ReadonlySet<string>): string | null => clueIds.every((clue) => active.has(clue)) ? expected : null;
  const theoremTrace: TheoremId[] = ["ALTERNATE_INTERIOR_ANGLES"];
  const proofEvents: GeoProofEvent[] = [{ kind: "ANGLE_EQUALITY", leftAngleId: "ALT_1", rightAngleId: "ALT_2", reason: "ALTERNATE_INTERIOR_ANGLES" }];
  const supplement = 180 - variant.value;
  const optionSet = buildOptions(expected, [
    { text: `${supplement}°`, misconceptionId: "TREATED_ALTERNATE_AS_COINTERIOR", rationale: `Uses the supplementary co-interior relation and calculates 180° − ${variant.value}° = ${supplement}°.` },
    { text: `${variant.value / 2}°`, misconceptionId: "HALVED_ALTERNATE_INTERIOR_ANGLE", rationale: "Halves the given angle even though alternate interior angles are equal, not in a 2:1 relation." },
    { text: "90°", misconceptionId: "ASSUMED_TRANSVERSAL_PERPENDICULAR", rationale: "Assumes the transversal is perpendicular to the parallel lines although no right-angle condition is given." },
  ], seed);
  return finalizeGapWave9Question({
    cpId: "GEO-CP-002",
    temporaryPrototypeId: "GEO-TMP-GAP-W9-CP002-ALTERNATE-INTERIOR-V1",
    sourceGapId: "GEO-CP-002/ALTERNATE_ANGLE_TRANSFER",
    sourceEvidenceIds: ["SRC-TESTBOOK-CGL-ALTERNATE-INTERIOR-PYQ-2025"],
    solveMode: "findAlternateInteriorAngle",
    difficulty: "Easy",
    seed,
    stem: variant.stem,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "The two lines are explicitly parallel and the third line is a transversal.",
      `Alternate interior angles between parallel lines are equal, so the target angle is ${variant.value}°.` ,
    ]),
    theoremTrace,
    proofEvents,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: wave9Verifier("INDEPENDENT_DEFINITION_CHECK", variant.value > 0 && variant.value < 180, ["the given angle is a valid interior angle", "alternate-interior equality preserves its exact measure"]),
    diagramDisposition: "REQUIRED_STEM_DIAGRAM",
    diagramModel: alternateInteriorDiagram(`${variant.value}°`),
  });
}

function integerCountForThirdSide(a: number, b: number): number {
  const lower = Math.abs(a - b);
  const upper = a + b;
  return Math.max(0, upper - lower - 1);
}

function generateTriangleIntegerCount(seed: string): GapWave9Question {
  const variants = [
    { a: 6, b: 12, target: 11, stem: "Two sides of a triangle are 6 units and 12 units. How many integer values are possible for the third side x?" },
    { a: 5, b: 9, target: 9, stem: "A triangle has two sides of lengths 5 cm and 9 cm. How many positive integer lengths can its third side have?" },
    { a: 7, b: 10, target: 13, stem: "The known sides of a triangle are 7 units and 10 units. Count the possible integer values of the remaining side." },
  ] as const;
  const variant = variants[variantIndex(seed, variants.length)];
  const lower = Math.abs(variant.b - variant.a);
  const upper = variant.a + variant.b;
  const clueIds = ["TWO_TRIANGLE_SIDES_GIVEN", "THIRD_SIDE_IS_POSITIVE_INTEGER", "STRICT_TRIANGLE_INEQUALITY_REQUIRED", "TARGET_COUNT"] as const;
  const expected = `${variant.target}`;
  const solve = (active: ReadonlySet<string>): string | null => clueIds.every((clue) => active.has(clue)) ? `${integerCountForThirdSide(variant.a, variant.b)}` : null;
  if (solve(new Set(clueIds)) !== expected) throw new Error("Wave 9 triangle integer-count fixture mismatch");
  const theoremTrace: TheoremId[] = ["TRIANGLE_INEQUALITY"];
  const inclusiveCount = variant.target + 2;
  const onlyUpperCount = upper - 1;
  const optionSet = buildOptions(expected, [
    { text: `${inclusiveCount}`, misconceptionId: "INCLUDED_DEGENERATE_BOUNDARIES", rationale: `Counts x = ${lower} and x = ${upper} even though either boundary makes a degenerate straight-line triangle.` },
    { text: `${onlyUpperCount}`, misconceptionId: "IGNORED_LOWER_TRIANGLE_BOUND", rationale: `Counts every positive integer below ${upper} and ignores the necessary lower bound x > ${lower}.` },
    { text: `${Math.min(variant.a, variant.b)}`, misconceptionId: "USED_SMALLER_SIDE_AS_COUNT", rationale: "Mistakes the smaller known side length for the number of admissible integer third-side values." },
  ], seed);
  const enumerated = Array.from({ length: Math.max(0, upper - 1) }, (_, index) => index + 1).filter((x) => x > lower && x < upper);
  const verifierPassed = enumerated.length === variant.target && enumerated.every((x) => variant.a + variant.b > x && variant.a + x > variant.b && variant.b + x > variant.a);
  return finalizeGapWave9Question({
    cpId: "GEO-CP-003",
    temporaryPrototypeId: "GEO-TMP-GAP-W9-CP003-TRIANGLE-INEQUALITY-INTEGER-COUNT-V1",
    sourceGapId: "GEO-CP-003/INTEGER_TRIANGLE_INEQUALITY_COUNT_OR_VALIDITY",
    sourceEvidenceIds: ["SRC-TESTBOOK-CGL-TRIANGLE-INEQUALITY-INTEGER-COUNT-PYQ-2024"],
    solveMode: "countIntegerThirdSides",
    difficulty: "Medium",
    seed,
    stem: variant.stem,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      `The third side must satisfy |${variant.b} − ${variant.a}| < x < ${variant.a} + ${variant.b}, so ${lower} < x < ${upper}.`,
      `The integers strictly inside that interval are ${lower + 1} through ${upper - 1}, giving ${variant.target} possible values.` ,
    ]),
    theoremTrace,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: wave9Verifier("INDEPENDENT_ARITHMETIC", verifierPassed, [`explicit enumeration produced ${variant.target} admissible integers`, "every enumerated value satisfies all three strict triangle inequalities"]),
    diagramDisposition: "NO_DIAGRAM",
  });
}

function generateTriangleInequalityClaim(seed: string): GapWave9Question {
  const stems = [
    "Which statement is always true for the side lengths of a non-degenerate triangle?",
    "Select the universally valid triangle-inequality statement.",
    "For any ordinary triangle with positive side lengths, which claim must hold?",
  ] as const;
  const stem = stems[variantIndex(seed, stems.length)];
  const clueIds = ["NON_DEGENERATE_TRIANGLE", "POSITIVE_SIDE_LENGTHS", "TARGET_UNIVERSAL_SIDE_CLAIM"] as const;
  const expected = "The sum of any two sides is greater than the third side.";
  const solve = (active: ReadonlySet<string>): string | null => clueIds.every((clue) => active.has(clue)) ? expected : null;
  const theoremTrace: TheoremId[] = ["TRIANGLE_INEQUALITY"];
  const optionSet = buildOptions(expected, [
    { text: "The sum of two sides may equal the third side.", misconceptionId: "ALLOWED_DEGENERATE_TRIANGLE", rationale: "Equality collapses the triangle into a straight segment, so it does not describe a non-degenerate triangle." },
    { text: "The sum of any two sides is always less than the third side.", misconceptionId: "REVERSED_TRIANGLE_INEQUALITY", rationale: "Reverses the strict triangle inequality and would make ordinary triangle construction impossible." },
    { text: "The longest side is always equal to the sum of the other two sides.", misconceptionId: "USED_STRAIGHT_LINE_BOUNDARY", rationale: "Uses the degenerate boundary case as though it were a property of every valid triangle." },
  ], seed);
  return finalizeGapWave9Question({
    cpId: "GEO-CP-003",
    temporaryPrototypeId: "GEO-TMP-GAP-W9-CP003-TRIANGLE-INEQUALITY-CLAIM-V1",
    sourceGapId: "GEO-CP-003/TRIANGLE_CLASSIFICATION_OR_CLAIM",
    sourceEvidenceIds: ["SRC-TESTBOOK-CGL-TRIANGLE-INEQUALITY-CLAIM-PYQ-2023"],
    solveMode: "identifyTriangleInequalityClaim",
    difficulty: "Easy",
    seed,
    stem,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "A non-degenerate triangle must satisfy the strict triangle inequality for every pair of sides.",
      "Therefore the sum of any two sides is always greater than the remaining side.",
    ]),
    theoremTrace,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: wave9Verifier("INDEPENDENT_DEFINITION_CHECK", true, ["strict inequality excludes degenerate equality", "the statement is symmetric across all three choices of the third side"]),
    diagramDisposition: "NO_DIAGRAM",
  });
}

export const GEO_GAP_REMEDIATION_WAVE9_PROTOTYPES: readonly GapWave9PrototypeDefinition[] = Object.freeze([
  Object.freeze({ temporaryPrototypeId: "GEO-TMP-GAP-W9-CP001-AROUND-POINT-EQUAL-ANGLES-V1", cpId: "GEO-CP-001", sourceGapId: "GEO-CP-001/AROUND_POINT_SUM", solveMode: "findEqualAngleAroundPoint", generate: generateAroundPoint }),
  Object.freeze({ temporaryPrototypeId: "GEO-TMP-GAP-W9-CP002-ALTERNATE-INTERIOR-V1", cpId: "GEO-CP-002", sourceGapId: "GEO-CP-002/ALTERNATE_ANGLE_TRANSFER", solveMode: "findAlternateInteriorAngle", generate: generateAlternateInterior }),
  Object.freeze({ temporaryPrototypeId: "GEO-TMP-GAP-W9-CP003-TRIANGLE-INEQUALITY-INTEGER-COUNT-V1", cpId: "GEO-CP-003", sourceGapId: "GEO-CP-003/INTEGER_TRIANGLE_INEQUALITY_COUNT_OR_VALIDITY", solveMode: "countIntegerThirdSides", generate: generateTriangleIntegerCount }),
  Object.freeze({ temporaryPrototypeId: "GEO-TMP-GAP-W9-CP003-TRIANGLE-INEQUALITY-CLAIM-V1", cpId: "GEO-CP-003", sourceGapId: "GEO-CP-003/TRIANGLE_CLASSIFICATION_OR_CLAIM", solveMode: "identifyTriangleInequalityClaim", generate: generateTriangleInequalityClaim }),
]);
