import {
  ANGLE_180,
  AngleConstraintEngine,
  CoordinateOracle,
  angle,
  rational,
  type CoordinateRealization,
  type GeoDiagramModel,
  type GeoProofEvent,
  type TheoremId,
} from "../../../../../../shared/geometry";
import {
  buildExplanation,
  buildOptions,
  finalizeQuestion,
  formatAngle,
  passedVerifier,
  proveClueMinimality,
} from "../discovery/phase1-utils";
import type { Phase1PrototypeDefinition, Phase1PrototypeQuestion } from "../discovery/phase1-types";

const CP_ID = "GEO-CP-001" as const;
const COORDINATES: CoordinateRealization = Object.freeze({
  A: { x: rational(-2), y: rational(0) },
  O: { x: rational(0), y: rational(0) },
  C: { x: rational(2), y: rational(0) },
  B: { x: rational(-2), y: rational(-2) },
  D: { x: rational(2), y: rational(2) },
});

function verticalDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 20, y: 70 }, { id: "O", label: "O", x: 90, y: 70 },
      { id: "C", label: "C", x: 160, y: 70 }, { id: "B", label: "B", x: 20, y: 140 },
      { id: "D", label: "D", x: 160, y: 0 },
    ],
    segments: [
      { id: "AC", fromPointId: "A", toPointId: "C" },
      { id: "BD", fromPointId: "B", toPointId: "D" },
    ],
    circles: [],
    angleMarks: [
      { id: "given-angle", firstPointId: "A", vertexPointId: "O", secondPointId: "B", label: "45°" },
      { id: "target-angle", firstPointId: "C", vertexPointId: "O", secondPointId: "D", label: "x" },
    ],
    rightAngleMarks: [], equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [],
    disclosure: "STEM", notToScale: false,
  };
}

function linearPairDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 20, y: 70 }, { id: "O", label: "O", x: 90, y: 70 },
      { id: "C", label: "C", x: 160, y: 70 }, { id: "B", label: "B", x: 20, y: 140 },
    ],
    segments: [
      { id: "AC", fromPointId: "A", toPointId: "C" },
      { id: "OB", fromPointId: "O", toPointId: "B" },
    ],
    circles: [],
    angleMarks: [
      { id: "given-angle", firstPointId: "A", vertexPointId: "O", secondPointId: "B", label: "45°" },
      { id: "target-angle", firstPointId: "B", vertexPointId: "O", secondPointId: "C", label: "x" },
    ],
    rightAngleMarks: [], equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [],
    disclosure: "STEM", notToScale: false,
  };
}

function generateVertical(seed: string): Phase1PrototypeQuestion {
  const clueIds = ["LINES_AC_BD_INTERSECT_AT_O", "ANGLE_AOB_IS_45"] as const;
  const expected = "45°";
  const solve = (active: ReadonlySet<string>): string | null => {
    const engine = new AngleConstraintEngine();
    if (active.has("ANGLE_AOB_IS_45")) engine.addKnown("AOB", angle(45));
    if (active.has("LINES_AC_BD_INTERSECT_AT_O")) {
      engine.addEqual("AOB", "COD", "VERTICAL_OPPOSITE_ANGLES");
    }
    try { return formatAngle(engine.solve("COD").value); } catch { return null; }
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Vertical-angle synthetic solver mismatch");
  const oracle = new CoordinateOracle(COORDINATES);
  if (!oracle.collinear("A", "O", "C") || !oracle.collinear("B", "O", "D") || oracle.parallel("A", "C", "B", "D")) {
    throw new Error("Vertical-angle coordinate oracle rejected canonical intersection");
  }
  const theoremTrace: TheoremId[] = ["GIVEN_ANGLE", "VERTICAL_OPPOSITE_ANGLES"];
  const proofEvents: GeoProofEvent[] = [{ kind: "ANGLE_EQUALITY", leftAngleId: "AOB", rightAngleId: "COD", reason: "VERTICAL_OPPOSITE_ANGLES" }];
  const optionSet = buildOptions(expected, [
    { text: "135°", misconceptionId: "SUPPLEMENT_INSTEAD_OF_VERTICAL_EQUALITY", rationale: "Treats a vertical pair as a linear pair." },
    { text: "90°", misconceptionId: "ASSUME_PERPENDICULAR_INTERSECTION", rationale: "Assumes the crossing lines are perpendicular from appearance." },
    { text: "22.5°", misconceptionId: "HALVE_VERTICAL_ANGLE", rationale: "Halves an angle even though vertical angles are equal." },
  ], seed);
  return finalizeQuestion({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP001-VERTICAL-ANGLE-V1", solveMode: "findVerticalAngle",
    difficulty: "Easy", seed,
    stem: "Lines AC and BD intersect at O. If ∠AOB = 45°, find ∠COD.",
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "∠AOB and ∠COD are opposite angles formed by the same two intersecting lines.",
      "Vertically opposite angles are equal, so ∠COD = 45°.",
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: passedVerifier("COORDINATE_ORACLE", [
      "A, O and C are collinear", "B, O and D are collinear", "the two lines are distinct and intersect at O",
    ]),
    diagramModel: verticalDiagram(),
  });
}

function generateLinearPair(seed: string): Phase1PrototypeQuestion {
  const clueIds = ["A_O_C_ARE_COLLINEAR", "ANGLE_AOB_IS_45"] as const;
  const expected = "135°";
  const solve = (active: ReadonlySet<string>): string | null => {
    const engine = new AngleConstraintEngine();
    if (active.has("ANGLE_AOB_IS_45")) engine.addKnown("AOB", angle(45));
    if (active.has("A_O_C_ARE_COLLINEAR")) engine.addSupplementary("AOB", "BOC", "LINEAR_PAIR_SUM");
    try { return formatAngle(engine.solve("BOC").value); } catch { return null; }
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Linear-pair synthetic solver mismatch");
  const oracle = new CoordinateOracle(COORDINATES);
  if (!oracle.collinear("A", "O", "C")) throw new Error("Linear-pair coordinate oracle rejected straight line");
  const theoremTrace: TheoremId[] = ["GIVEN_ANGLE", "LINEAR_PAIR_SUM"];
  const proofEvents: GeoProofEvent[] = [{ kind: "ANGLE_SUM", angleIds: ["AOB", "BOC"], total: ANGLE_180, reason: "LINEAR_PAIR_SUM" }];
  const optionSet = buildOptions(expected, [
    { text: "45°", misconceptionId: "COPY_ADJACENT_ANGLE", rationale: "Copies the given angle instead of using the straight-line sum." },
    { text: "90°", misconceptionId: "ASSUME_RIGHT_ANGLE", rationale: "Assumes the ray is perpendicular to the straight line." },
    { text: "180°", misconceptionId: "RETURN_TOTAL_NOT_MISSING_ANGLE", rationale: "Returns the linear-pair total rather than the unknown angle." },
  ], seed);
  return finalizeQuestion({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP001-LINEAR-PAIR-V1", solveMode: "findAdjacentLinearPairAngle",
    difficulty: "Easy", seed,
    stem: "A, O and C lie on one straight line. If ∠AOB = 45°, find ∠BOC.",
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "AOC is a straight line, so ∠AOB and ∠BOC form a linear pair and add to 180°.",
      "Therefore ∠BOC = 180° − 45° = 135°.",
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: passedVerifier("COORDINATE_ORACLE", ["A, O and C are exactly collinear in the hidden realization"]),
    diagramModel: linearPairDiagram(),
  });
}

export const GEO_CP_001_PHASE1_PROTOTYPES: readonly Phase1PrototypeDefinition[] = Object.freeze([
  { temporaryPrototypeId: "GEO-TMP-CP001-VERTICAL-ANGLE-V1", cpId: CP_ID, solveMode: "findVerticalAngle", generate: generateVertical },
  { temporaryPrototypeId: "GEO-TMP-CP001-LINEAR-PAIR-V1", cpId: CP_ID, solveMode: "findAdjacentLinearPairAngle", generate: generateLinearPair },
]);
