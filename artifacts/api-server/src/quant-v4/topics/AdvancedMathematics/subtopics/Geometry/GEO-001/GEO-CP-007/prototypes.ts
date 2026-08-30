import {
  CoordinateOracle,
  angle,
  equals,
  isRightTriangleByPythagoreanConverse,
  rational,
  rightTriangleMedianToHypotenuse,
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

const CP_ID = "GEO-CP-007" as const;
const q = (value: number) => rational(value);

function classificationDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 30, y: 130 },
      { id: "B", label: "B", x: 55, y: 25 },
      { id: "C", label: "C", x: 170, y: 105 },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" },
      { id: "AC", fromPointId: "A", toPointId: "C" },
      { id: "BC", fromPointId: "B", toPointId: "C" },
    ],
    circles: [], angleMarks: [], rightAngleMarks: [], equalLengthMarks: [], parallelMarks: [], arcs: [],
    labels: [
      { id: "label-ab", text: "7", x: 30, y: 75 },
      { id: "label-ac", text: "24", x: 101, y: 130 },
      { id: "label-bc", text: "25", x: 111, y: 57 },
    ],
    disclosure: "STEM", notToScale: true,
  };
}

function medianDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 105, y: 25 },
      { id: "B", label: "B", x: 30, y: 100 },
      { id: "C", label: "C", x: 180, y: 100 },
      { id: "M", label: "M", x: 105, y: 100 },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" },
      { id: "AC", fromPointId: "A", toPointId: "C" },
      { id: "BM", fromPointId: "B", toPointId: "M" },
      { id: "MC", fromPointId: "M", toPointId: "C" },
      { id: "AM", fromPointId: "A", toPointId: "M" },
    ],
    circles: [], angleMarks: [],
    rightAngleMarks: [{ id: "right-a", vertexPointId: "A", firstRayPointId: "B", secondRayPointId: "C" }],
    equalLengthMarks: [{ id: "midpoint-m", segmentIds: ["BM", "MC"] }],
    parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function generatePythagoreanConverse(seed: string): Phase3PrototypeQuestion {
  const clueIds = ["ABC_IS_TRIANGLE", "AB_IS_7", "AC_IS_24", "BC_IS_25"] as const;
  const expected = "Right-angled at A";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    return isRightTriangleByPythagoreanConverse(q(7), q(24), q(25)) ? expected : null;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Pythagorean-converse discovery solver mismatch");
  const oracle = new CoordinateOracle({
    A: { x: q(0), y: q(0) }, B: { x: q(7), y: q(0) }, C: { x: q(0), y: q(24) },
  });
  const verifierPassed = equals(oracle.squaredLength("A", "B"), q(49))
    && equals(oracle.squaredLength("A", "C"), q(576))
    && equals(oracle.squaredLength("B", "C"), q(625))
    && oracle.perpendicular("A", "B", "A", "C");
  if (!verifierPassed) throw new Error("Pythagorean-converse coordinate verification failed");
  const theoremTrace: TheoremId[] = ["PYTHAGORAS_CONVERSE"];
  const proofEvents: GeoProofEvent[] = [{ kind: "ANGLE_SUM", angleIds: ["A"], total: angle(90), reason: "PYTHAGORAS_CONVERSE" }];
  const optionSet = buildOptions(expected, [
    { text: "Acute-angled", misconceptionId: "MISSED_PYTHAGOREAN_EQUALITY", rationale: "Misses that 7² + 24² equals 25² exactly." },
    { text: "Obtuse-angled", misconceptionId: "REVERSED_PYTHAGOREAN_CLASSIFICATION", rationale: "Treats equality as the greater-than case used for an obtuse triangle." },
    { text: "Cannot be determined", misconceptionId: "IGNORED_PYTHAGORAS_CONVERSE", rationale: "Misses that all three side lengths are sufficient for the converse test." },
  ], seed);
  return finalizePhase3Question({
    cpId: CP_ID,
    temporaryPrototypeId: "GEO-TMP-CP007-PYTHAGOREAN-CONVERSE-V1",
    solveMode: "classifyTriangleByPythagoreanConverse",
    difficulty: "Easy",
    seed,
    stem: "Triangle ABC has AB = 7 cm, AC = 24 cm and BC = 25 cm. How is the triangle classified?",
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "The longest side is BC = 25 cm.",
      "Since 7² + 24² = 49 + 576 = 625 = 25², the converse of Pythagoras tells us that the angle opposite BC is 90°. Therefore the triangle is right-angled at A.",
    ]),
    theoremTrace,
    proofEvents,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: Object.freeze({
      passed: verifierPassed,
      oracle: "COORDINATE_ORACLE",
      checks: Object.freeze(["hidden realization has exact side squares 49, 576 and 625", "AB is exactly perpendicular to AC"]),
    }),
    diagramModel: classificationDiagram(),
  });
}

function generateHypotenuseMedian(seed: string): Phase3PrototypeQuestion {
  const clueIds = ["ABC_RIGHT_AT_A", "M_MIDPOINT_BC", "BC_IS_14"] as const;
  const expected = "7 cm";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const value = rightTriangleMedianToHypotenuse(q(14));
    return value.denominator === 1n ? `${value.numerator} cm` : `${value.numerator}/${value.denominator} cm`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Hypotenuse-median discovery solver mismatch");
  const oracle = new CoordinateOracle({
    A: { x: q(0), y: q(7) }, B: { x: q(-7), y: q(0) }, C: { x: q(7), y: q(0) }, M: { x: q(0), y: q(0) },
  });
  const verifierPassed = oracle.perpendicular("A", "B", "A", "C")
    && oracle.equalLengths("B", "M", "M", "C")
    && equals(oracle.squaredLength("B", "C"), q(196))
    && equals(oracle.squaredLength("A", "M"), q(49));
  if (!verifierPassed) throw new Error("Hypotenuse-median coordinate verification failed");
  const theoremTrace: TheoremId[] = ["RIGHT_TRIANGLE_HYPOTENUSE_MEDIAN"];
  const proofEvents: GeoProofEvent[] = [{
    kind: "SEGMENT_RATIO", left: "AM", right: "BC", ratio: rational(1, 2), reason: "RIGHT_TRIANGLE_HYPOTENUSE_MEDIAN",
  }];
  const optionSet = buildOptions(expected, [
    { text: "14 cm", misconceptionId: "MEDIAN_ASSUMED_EQUAL_HYPOTENUSE", rationale: "Copies the whole hypotenuse instead of taking half." },
    { text: "3.5 cm", misconceptionId: "HALVED_HYPOTENUSE_TWICE", rationale: "Applies the half-hypotenuse relation twice." },
    { text: "28 cm", misconceptionId: "REVERSED_HYPOTENUSE_MEDIAN_RATIO", rationale: "Doubles the hypotenuse instead of halving it." },
  ], seed);
  return finalizePhase3Question({
    cpId: CP_ID,
    temporaryPrototypeId: "GEO-TMP-CP007-HYPOTENUSE-MEDIAN-V1",
    solveMode: "findMedianToHypotenuse",
    difficulty: "Medium",
    seed,
    stem: "Triangle ABC is right-angled at A. M is the midpoint of hypotenuse BC, and BC = 14 cm. Find AM.",
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "In a right triangle, the midpoint of the hypotenuse is equally distant from all three vertices.",
      "So the median from the right angle to the hypotenuse is half the hypotenuse: AM = 14/2 = 7 cm.",
    ]),
    theoremTrace,
    proofEvents,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: Object.freeze({
      passed: verifierPassed,
      oracle: "COORDINATE_ORACLE",
      checks: Object.freeze(["hidden realization is exactly right-angled at A", "M is the exact midpoint of BC", "BC = 14 and AM = 7 exactly"]),
    }),
    diagramModel: medianDiagram(),
  });
}

export const GEO_CP_007_PHASE3_PROTOTYPES: readonly Phase3PrototypeDefinition[] = Object.freeze([
  { temporaryPrototypeId: "GEO-TMP-CP007-PYTHAGOREAN-CONVERSE-V1", cpId: CP_ID, solveMode: "classifyTriangleByPythagoreanConverse", generate: generatePythagoreanConverse },
  { temporaryPrototypeId: "GEO-TMP-CP007-HYPOTENUSE-MEDIAN-V1", cpId: CP_ID, solveMode: "findMedianToHypotenuse", generate: generateHypotenuseMedian },
]);
