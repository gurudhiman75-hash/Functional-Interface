import {
  CoordinateOracle,
  provesRhsCongruence,
  provesSssCongruence,
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

const CP_ID = "GEO-CP-004" as const;
const coordinate = (value: number) => rational(value);

function rhsDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 20, y: 100 },
      { id: "B", label: "B", x: 20, y: 20 },
      { id: "C", label: "C", x: 80, y: 100 },
      { id: "P", label: "P", x: 140, y: 100 },
      { id: "Q", label: "Q", x: 140, y: 20 },
      { id: "R", label: "R", x: 200, y: 100 },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" },
      { id: "AC", fromPointId: "A", toPointId: "C" },
      { id: "BC", fromPointId: "B", toPointId: "C" },
      { id: "PQ", fromPointId: "P", toPointId: "Q" },
      { id: "PR", fromPointId: "P", toPointId: "R" },
      { id: "QR", fromPointId: "Q", toPointId: "R" },
    ],
    circles: [], angleMarks: [],
    rightAngleMarks: [
      { id: "right-a", vertexPointId: "A", firstRayPointId: "B", secondRayPointId: "C" },
      { id: "right-p", vertexPointId: "P", firstRayPointId: "Q", secondRayPointId: "R" },
    ],
    equalLengthMarks: [
      { id: "equal-hypotenuse", segmentIds: ["BC", "QR"] },
      { id: "equal-leg", segmentIds: ["AB", "PQ"] },
    ],
    parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function sssCorrespondenceDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 20, y: 105 },
      { id: "B", label: "B", x: 20, y: 30 },
      { id: "C", label: "C", x: 100, y: 105 },
      { id: "P", label: "P", x: 135, y: 105 },
      { id: "Q", label: "Q", x: 135, y: 30 },
      { id: "R", label: "R", x: 215, y: 105 },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" },
      { id: "AC", fromPointId: "A", toPointId: "C" },
      { id: "BC", fromPointId: "B", toPointId: "C" },
      { id: "PQ", fromPointId: "P", toPointId: "Q" },
      { id: "PR", fromPointId: "P", toPointId: "R" },
      { id: "QR", fromPointId: "Q", toPointId: "R" },
    ],
    circles: [], angleMarks: [], rightAngleMarks: [],
    equalLengthMarks: [
      { id: "equal-ab-pq", segmentIds: ["AB", "PQ"] },
      { id: "equal-ac-pr", segmentIds: ["AC", "PR"] },
      { id: "equal-bc-qr", segmentIds: ["BC", "QR"] },
    ],
    parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function generateRhsCriterion(seed: string): Phase2PrototypeQuestion {
  const clueIds = ["BOTH_TRIANGLES_RIGHT", "HYPOTENUSES_EQUAL", "ONE_LEG_EQUAL"] as const;
  const expected = "RHS";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    return provesRhsCongruence({
      leftRightAngle: true,
      rightRightAngle: true,
      leftHypotenuse: rational(5),
      rightHypotenuse: rational(5),
      leftLeg: rational(4),
      rightLeg: rational(4),
    }) ? "RHS" : null;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("RHS congruence discovery solver mismatch");
  const oracle = new CoordinateOracle({
    A: { x: coordinate(0), y: coordinate(0) }, B: { x: coordinate(0), y: coordinate(4) }, C: { x: coordinate(3), y: coordinate(0) },
    P: { x: coordinate(10), y: coordinate(0) }, Q: { x: coordinate(10), y: coordinate(4) }, R: { x: coordinate(13), y: coordinate(0) },
  });
  const verifierPassed = oracle.perpendicular("A", "B", "A", "C")
    && oracle.perpendicular("P", "Q", "P", "R")
    && oracle.equalLengths("B", "C", "Q", "R")
    && oracle.equalLengths("A", "B", "P", "Q");
  if (!verifierPassed) throw new Error("RHS independent coordinate verification failed");
  const theoremTrace: TheoremId[] = ["RHS_CONGRUENCE"];
  const proofEvents: GeoProofEvent[] = [{
    kind: "CONGRUENCE",
    triangle1: { id: "ABC", vertexIds: ["A", "B", "C"] },
    triangle2: { id: "PQR", vertexIds: ["P", "Q", "R"] },
    criterion: "RHS_CONGRUENCE",
  }];
  const optionSet = buildOptions(expected, [
    { text: "SAS", misconceptionId: "WRONG_CONGRUENCE_CRITERION", rationale: "The stated right angle is not the included angle between the known hypotenuse and leg." },
    { text: "SSA", misconceptionId: "SSA_AS_CONGRUENCE", rationale: "Treats a non-general SSA pattern as a congruence rule." },
    { text: "AAA", misconceptionId: "AAA_AS_CONGRUENCE", rationale: "AAA can establish similarity, not triangle congruence." },
  ], seed);
  return finalizePhase2Question({
    cpId: CP_ID,
    temporaryPrototypeId: "GEO-TMP-CP004-RHS-CRITERION-V1",
    solveMode: "selectValidCongruenceCriterion",
    difficulty: "Easy",
    seed,
    stem: "Triangles ABC and PQR are right-angled at A and P. Their hypotenuses satisfy BC = QR, and AB = PQ. Which congruence criterion proves the triangles congruent?",
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "Both triangles are right triangles. Their hypotenuses are equal and one corresponding leg is also equal.",
      "That is exactly the right-angle–hypotenuse–side condition, so the valid criterion is RHS.",
    ]),
    theoremTrace,
    proofEvents,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: Object.freeze({
      passed: verifierPassed,
      oracle: "COORDINATE_ORACLE",
      checks: Object.freeze(["both canonical angles are right angles", "hypotenuse lengths are exactly equal", "one corresponding leg is exactly equal"]),
    }),
    diagramModel: rhsDiagram(),
  });
}

function generateCpctCorrespondence(seed: string): Phase2PrototypeQuestion {
  const clueIds = ["AB_EQUALS_PQ", "AC_EQUALS_PR", "BC_EQUALS_QR"] as const;
  const expected = "∠R";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const congruent = provesSssCongruence({
      leftSides: [rational(3), rational(4), rational(5)],
      rightSides: [rational(3), rational(4), rational(5)],
    });
    return congruent ? "∠R" : null;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("SSS/CPCT correspondence discovery solver mismatch");
  const oracle = new CoordinateOracle({
    A: { x: coordinate(0), y: coordinate(0) }, B: { x: coordinate(0), y: coordinate(3) }, C: { x: coordinate(4), y: coordinate(0) },
    P: { x: coordinate(10), y: coordinate(0) }, Q: { x: coordinate(10), y: coordinate(3) }, R: { x: coordinate(14), y: coordinate(0) },
  });
  const verifierPassed = oracle.equalLengths("A", "B", "P", "Q")
    && oracle.equalLengths("A", "C", "P", "R")
    && oracle.equalLengths("B", "C", "Q", "R");
  if (!verifierPassed) throw new Error("SSS/CPCT independent coordinate verification failed");
  const theoremTrace: TheoremId[] = ["SSS_CONGRUENCE", "CPCT"];
  const proofEvents: GeoProofEvent[] = [
    {
      kind: "CONGRUENCE",
      triangle1: { id: "ABC", vertexIds: ["A", "B", "C"] },
      triangle2: { id: "PQR", vertexIds: ["P", "Q", "R"] },
      criterion: "SSS_CONGRUENCE",
    },
    { kind: "ANGLE_EQUALITY", leftAngleId: "C", rightAngleId: "R", reason: "CPCT" },
  ];
  const optionSet = buildOptions(expected, [
    { text: "∠P", misconceptionId: "WRONG_VERTEX_CORRESPONDENCE", rationale: "Maps C to the vertex corresponding to A instead of following the side-pair evidence." },
    { text: "∠Q", misconceptionId: "WRONG_VERTEX_CORRESPONDENCE", rationale: "Maps C to the vertex corresponding to B." },
    { text: "Cannot be concluded", misconceptionId: "MISSED_CPCT", rationale: "Misses that all corresponding angles are equal once SSS congruence is established." },
  ], seed);
  return finalizePhase2Question({
    cpId: CP_ID,
    temporaryPrototypeId: "GEO-TMP-CP004-CPCT-CORRESPONDENCE-V1",
    solveMode: "recoverVertexCorrespondenceByCongruence",
    difficulty: "Medium",
    seed,
    stem: "For triangles ABC and PQR, AB = PQ, AC = PR and BC = QR. After establishing congruence, which angle corresponds to ∠C?",
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "The three side pairs match, so the triangles are congruent by SSS.",
      "AB↔PQ and AC↔PR force A↔P; then B↔Q and C↔R. Therefore ∠C corresponds to ∠R, and corresponding parts of congruent triangles are equal.",
    ]),
    theoremTrace,
    proofEvents,
    displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: Object.freeze({
      passed: verifierPassed,
      oracle: "COORDINATE_ORACLE",
      checks: Object.freeze(["AB = PQ exactly", "AC = PR exactly", "BC = QR exactly in the hidden coordinate realization"]),
    }),
    diagramModel: sssCorrespondenceDiagram(),
  });
}

export const GEO_CP_004_PHASE2_PROTOTYPES: readonly Phase2PrototypeDefinition[] = Object.freeze([
  { temporaryPrototypeId: "GEO-TMP-CP004-RHS-CRITERION-V1", cpId: CP_ID, solveMode: "selectValidCongruenceCriterion", generate: generateRhsCriterion },
  { temporaryPrototypeId: "GEO-TMP-CP004-CPCT-CORRESPONDENCE-V1", cpId: CP_ID, solveMode: "recoverVertexCorrespondenceByCongruence", generate: generateCpctCorrespondence },
]);
