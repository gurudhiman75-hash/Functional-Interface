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

function variantIndex(seed: string, length: number): number {
  let hash = 2166136261;
  for (const character of seed) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % length;
}

function classificationDiagram(a: number, b: number, c: number): GeoDiagramModel {
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
      { id: "label-ab", text: String(a), x: 30, y: 75 },
      { id: "label-ac", text: String(b), x: 101, y: 130 },
      { id: "label-bc", text: String(c), x: 111, y: 57 },
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
  const pool = [[7, 24, 25], [5, 12, 13], [8, 15, 17], [9, 40, 41], [12, 35, 37]] as const;
  const [ab, ac, bc] = pool[variantIndex(seed, pool.length)]!;
  const clueIds = ["ABC_IS_TRIANGLE", "THREE_SIDE_LENGTHS_GIVEN"] as const;
  const expected = "Right-angled at A";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    return isRightTriangleByPythagoreanConverse(q(ab), q(ac), q(bc)) ? expected : null;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Pythagorean-converse discovery solver mismatch");
  const oracle = new CoordinateOracle({
    A: { x: q(0), y: q(0) }, B: { x: q(ab), y: q(0) }, C: { x: q(0), y: q(ac) },
  });
  const verifierPassed = equals(oracle.squaredLength("A", "B"), q(ab * ab))
    && equals(oracle.squaredLength("A", "C"), q(ac * ac))
    && equals(oracle.squaredLength("B", "C"), q(bc * bc))
    && oracle.perpendicular("A", "B", "A", "C");
  if (!verifierPassed) throw new Error("Pythagorean-converse coordinate verification failed");
  const theoremTrace: TheoremId[] = ["PYTHAGORAS_CONVERSE"];
  const proofEvents: GeoProofEvent[] = [{ kind: "ANGLE_SUM", angleIds: ["A"], total: angle(90), reason: "PYTHAGORAS_CONVERSE" }];
  const optionSet = buildOptions(expected, [
    { text: "Acute-angled", misconceptionId: "MISSED_PYTHAGOREAN_EQUALITY", rationale: "Misses that the two shorter-side squares add exactly to the longest-side square." },
    { text: "Obtuse-angled", misconceptionId: "REVERSED_PYTHAGOREAN_CLASSIFICATION", rationale: "Treats equality as the greater-than case used for an obtuse triangle." },
    { text: "Cannot be determined", misconceptionId: "IGNORED_PYTHAGORAS_CONVERSE", rationale: "Misses that all three side lengths are sufficient for the converse test." },
  ], seed);
  return finalizePhase3Question({
    cpId: CP_ID,
    temporaryPrototypeId: "GEO-TMP-CP007-PYTHAGOREAN-CONVERSE-V1",
    solveMode: "classifyTriangleByPythagoreanConverse",
    difficulty: "Easy",
    seed,
    stem: `Triangle ABC has AB = ${ab} cm, AC = ${ac} cm and BC = ${bc} cm. How is the triangle classified?`,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      `The longest side is BC = ${bc} cm.`,
      `Since ${ab}² + ${ac}² = ${ab * ab} + ${ac * ac} = ${bc * bc} = ${bc}², the converse of Pythagoras tells us that the angle opposite BC is 90°. Therefore the triangle is right-angled at A.`,
    ]),
    theoremTrace,
    proofEvents,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: Object.freeze({
      passed: verifierPassed,
      oracle: "COORDINATE_ORACLE",
      checks: Object.freeze([`hidden realization has exact side squares ${ab * ab}, ${ac * ac} and ${bc * bc}`, "AB is exactly perpendicular to AC"]),
    }),
    diagramModel: classificationDiagram(ab, ac, bc),
  });
}

function generateHypotenuseMedian(seed: string): Phase3PrototypeQuestion {
  const hypotenusePool = [10, 14, 18, 22, 26] as const;
  const bc = hypotenusePool[variantIndex(seed, hypotenusePool.length)]!;
  const median = bc / 2;
  const clueIds = ["ABC_RIGHT_AT_A", "M_MIDPOINT_BC", "BC_GIVEN"] as const;
  const expected = `${median} cm`;
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const value = rightTriangleMedianToHypotenuse(q(bc));
    return value.denominator === 1n ? `${value.numerator} cm` : `${value.numerator}/${value.denominator} cm`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Hypotenuse-median discovery solver mismatch");
  const oracle = new CoordinateOracle({
    A: { x: q(0), y: q(median) }, B: { x: q(-median), y: q(0) }, C: { x: q(median), y: q(0) }, M: { x: q(0), y: q(0) },
  });
  const verifierPassed = oracle.perpendicular("A", "B", "A", "C")
    && oracle.equalLengths("B", "M", "M", "C")
    && equals(oracle.squaredLength("B", "C"), q(bc * bc))
    && equals(oracle.squaredLength("A", "M"), q(median * median));
  if (!verifierPassed) throw new Error("Hypotenuse-median coordinate verification failed");
  const theoremTrace: TheoremId[] = ["RIGHT_TRIANGLE_HYPOTENUSE_MEDIAN"];
  const proofEvents: GeoProofEvent[] = [{
    kind: "SEGMENT_RATIO", left: "AM", right: "BC", ratio: rational(1, 2), reason: "RIGHT_TRIANGLE_HYPOTENUSE_MEDIAN",
  }];
  const optionSet = buildOptions(expected, [
    { text: `${bc} cm`, misconceptionId: "MEDIAN_ASSUMED_EQUAL_HYPOTENUSE", rationale: "Copies the whole hypotenuse instead of taking half." },
    { text: `${median / 2} cm`, misconceptionId: "HALVED_HYPOTENUSE_TWICE", rationale: "Applies the half-hypotenuse relation twice." },
    { text: `${2 * bc} cm`, misconceptionId: "REVERSED_HYPOTENUSE_MEDIAN_RATIO", rationale: "Doubles the hypotenuse instead of halving it." },
  ], seed);
  return finalizePhase3Question({
    cpId: CP_ID,
    temporaryPrototypeId: "GEO-TMP-CP007-HYPOTENUSE-MEDIAN-V1",
    solveMode: "findMedianToHypotenuse",
    difficulty: "Medium",
    seed,
    stem: `Triangle ABC is right-angled at A. M is the midpoint of hypotenuse BC, and BC = ${bc} cm. Find AM.`,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "In a right triangle, the midpoint of the hypotenuse is equally distant from all three vertices.",
      `So the median from the right angle to the hypotenuse is half the hypotenuse: AM = ${bc}/2 = ${median} cm.`,
    ]),
    theoremTrace,
    proofEvents,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: Object.freeze({
      passed: verifierPassed,
      oracle: "COORDINATE_ORACLE",
      checks: Object.freeze(["hidden realization is exactly right-angled at A", "M is the exact midpoint of BC", `BC = ${bc} and AM = ${median} exactly`]),
    }),
    diagramModel: medianDiagram(),
  });
}

export const GEO_CP_007_PHASE3_PROTOTYPES: readonly Phase3PrototypeDefinition[] = Object.freeze([
  { temporaryPrototypeId: "GEO-TMP-CP007-PYTHAGOREAN-CONVERSE-V1", cpId: CP_ID, solveMode: "classifyTriangleByPythagoreanConverse", generate: generatePythagoreanConverse },
  { temporaryPrototypeId: "GEO-TMP-CP007-HYPOTENUSE-MEDIAN-V1", cpId: CP_ID, solveMode: "findMedianToHypotenuse", generate: generateHypotenuseMedian },
]);
