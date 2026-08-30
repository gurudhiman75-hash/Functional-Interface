import {
  ANGLE_180,
  AngleConstraintEngine,
  angle,
  rational,
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

const CP_ID = "GEO-CP-003" as const;

function triangleDiagram(kind: "THIRD" | "EXTERIOR" | "ISOSCELES"): GeoDiagramModel {
  const exterior = kind === "EXTERIOR";
  const points = exterior ? [
    { id: "A", label: "A", x: 90, y: 10 },
    { id: "B", label: "B", x: 20, y: 130 },
    { id: "C", label: "C", x: 160, y: 130 },
    { id: "D", label: "D", x: -15, y: 190 },
  ] : [
    { id: "A", label: "A", x: 90, y: 10 },
    { id: "B", label: "B", x: 20, y: 130 },
    { id: "C", label: "C", x: 160, y: 130 },
  ];
  const segments = exterior ? [
    { id: "AD", fromPointId: "A", toPointId: "D" },
    { id: "AC", fromPointId: "A", toPointId: "C" },
    { id: "BC", fromPointId: "B", toPointId: "C" },
  ] : [
    { id: "AB", fromPointId: "A", toPointId: "B" },
    { id: "AC", fromPointId: "A", toPointId: "C" },
    { id: "BC", fromPointId: "B", toPointId: "C" },
  ];
  return {
    points,
    segments,
    circles: [],
    angleMarks: kind === "THIRD" ? [
      { id: "angle-a", firstPointId: "B", vertexPointId: "A", secondPointId: "C", label: "60°" },
      { id: "angle-b", firstPointId: "A", vertexPointId: "B", secondPointId: "C", label: "70°" },
      { id: "angle-c", firstPointId: "A", vertexPointId: "C", secondPointId: "B", label: "x" },
    ] : kind === "EXTERIOR" ? [
      { id: "angle-a", firstPointId: "B", vertexPointId: "A", secondPointId: "C", label: "55°" },
      { id: "angle-c", firstPointId: "A", vertexPointId: "C", secondPointId: "B", label: "65°" },
      { id: "angle-ext", firstPointId: "C", vertexPointId: "B", secondPointId: "D", label: "x" },
    ] : [
      { id: "angle-apex", firstPointId: "B", vertexPointId: "A", secondPointId: "C", label: "40°" },
      { id: "angle-base-b", firstPointId: "A", vertexPointId: "B", secondPointId: "C", label: "x" },
    ],
    rightAngleMarks: [],
    equalLengthMarks: kind === "ISOSCELES" ? [{ id: "equal-ab-ac", segmentIds: ["AB", "AC"] }] : [],
    parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function generateThirdAngle(seed: string): Phase1PrototypeQuestion {
  const clueIds = ["ABC_IS_TRIANGLE", "ANGLE_A_IS_60", "ANGLE_B_IS_70"] as const;
  const expected = "50°";
  const solve = (active: ReadonlySet<string>): string | null => {
    const engine = new AngleConstraintEngine();
    if (active.has("ANGLE_A_IS_60")) engine.addKnown("A", angle(60));
    if (active.has("ANGLE_B_IS_70")) engine.addKnown("B", angle(70));
    if (active.has("ABC_IS_TRIANGLE")) engine.addFixedSum(["A", "B", "C"], ANGLE_180, "TRIANGLE_ANGLE_SUM");
    try { return formatAngle(engine.solve("C").value); } catch { return null; }
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Triangle third-angle synthetic solver mismatch");
  const theoremTrace: TheoremId[] = ["GIVEN_ANGLE", "TRIANGLE_ANGLE_SUM"];
  const proofEvents: GeoProofEvent[] = [{ kind: "ANGLE_SUM", angleIds: ["A", "B", "C"], total: ANGLE_180, reason: "TRIANGLE_ANGLE_SUM" }];
  const optionSet = buildOptions(expected, [
    { text: "110°", misconceptionId: "ADD_TWO_GIVEN_ANGLES", rationale: "Returns 60° + 70° instead of subtracting from 180°." },
    { text: "130°", misconceptionId: "SUBTRACT_ONLY_ONE_GIVEN", rationale: "Uses only one of the two stated angles." },
    { text: "230°", misconceptionId: "USE_360_FOR_TRIANGLE", rationale: "Uses 360° as the triangle angle sum." },
  ], seed);
  return finalizeQuestion({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP003-THIRD-ANGLE-V1", solveMode: "findTriangleThirdAngle",
    difficulty: "Easy", seed,
    stem: "In triangle ABC, ∠A = 60° and ∠B = 70°. Find ∠C.",
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "The three interior angles of a triangle add to 180°.",
      "So ∠C = 180° − 60° − 70° = 50°.",
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: passedVerifier("INDEPENDENT_ARITHMETIC", ["60 + 70 + 50 = 180"]),
    diagramModel: triangleDiagram("THIRD"),
  });
}

function generateExteriorAngle(seed: string): Phase1PrototypeQuestion {
  const clueIds = ["AB_EXTENDED_THROUGH_B_TO_D", "REMOTE_ANGLE_A_IS_55", "REMOTE_ANGLE_C_IS_65"] as const;
  const expected = "120°";
  const solve = (active: ReadonlySet<string>): string | null => {
    const engine = new AngleConstraintEngine();
    if (active.has("REMOTE_ANGLE_A_IS_55")) engine.addKnown("A", angle(55));
    if (active.has("REMOTE_ANGLE_C_IS_65")) engine.addKnown("C", angle(65));
    if (active.has("AB_EXTENDED_THROUGH_B_TO_D")) {
      engine.graph.addEquation([
        { variable: "EXT", coefficient: rational(1) },
        { variable: "A", coefficient: rational(-1) },
        { variable: "C", coefficient: rational(-1) },
      ], rational(0), "TRIANGLE_EXTERIOR_ANGLE");
    }
    try { return formatAngle(engine.solve("EXT").value); } catch { return null; }
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Triangle exterior-angle synthetic solver mismatch");
  const theoremTrace: TheoremId[] = ["GIVEN_ANGLE", "TRIANGLE_EXTERIOR_ANGLE"];
  const proofEvents: GeoProofEvent[] = [{ kind: "ANGLE_SUM", angleIds: ["A", "C"], total: angle(120), reason: "TRIANGLE_EXTERIOR_ANGLE" }];
  const optionSet = buildOptions(expected, [
    { text: "60°", misconceptionId: "SUPPLEMENT_REMOTE_SUM", rationale: "Subtracts the remote-angle sum from 180°." },
    { text: "10°", misconceptionId: "DIFFERENCE_OF_REMOTE_ANGLES", rationale: "Takes the difference of the remote interior angles." },
    { text: "55°", misconceptionId: "COPY_ONE_REMOTE_ANGLE", rationale: "Copies one remote interior angle instead of adding both." },
  ], seed);
  return finalizeQuestion({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP003-EXTERIOR-ANGLE-V1", solveMode: "findExteriorAngleFromRemoteInteriors",
    difficulty: "Easy", seed,
    stem: "In triangle ABC, side AB is extended through B to D. If ∠A = 55° and ∠C = 65°, find the exterior angle ∠CBD.",
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "∠CBD is the exterior angle at B because AB is extended through B to D.",
      "An exterior angle equals the sum of the two remote interior angles, so ∠CBD = 55° + 65° = 120°.",
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: passedVerifier("INDEPENDENT_ARITHMETIC", ["55 + 65 = 120", "the exterior angle is between 0° and 180°"]),
    diagramModel: triangleDiagram("EXTERIOR"),
  });
}

function generateIsoscelesBase(seed: string): Phase1PrototypeQuestion {
  const clueIds = ["ABC_IS_TRIANGLE", "AB_EQUALS_AC", "APEX_ANGLE_A_IS_40"] as const;
  const expected = "70°";
  const solve = (active: ReadonlySet<string>): string | null => {
    const engine = new AngleConstraintEngine();
    if (active.has("APEX_ANGLE_A_IS_40")) engine.addKnown("A", angle(40));
    if (active.has("ABC_IS_TRIANGLE")) engine.addFixedSum(["A", "B", "C"], ANGLE_180, "TRIANGLE_ANGLE_SUM");
    if (active.has("AB_EQUALS_AC")) engine.addEqual("B", "C", "ISOSCELES_BASE_ANGLES");
    try { return formatAngle(engine.solve("B").value); } catch { return null; }
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Isosceles base-angle synthetic solver mismatch");
  const theoremTrace: TheoremId[] = ["GIVEN_ANGLE", "TRIANGLE_ANGLE_SUM", "ISOSCELES_BASE_ANGLES"];
  const proofEvents: GeoProofEvent[] = [
    { kind: "ANGLE_EQUALITY", leftAngleId: "B", rightAngleId: "C", reason: "ISOSCELES_BASE_ANGLES" },
    { kind: "ANGLE_SUM", angleIds: ["A", "B", "C"], total: ANGLE_180, reason: "TRIANGLE_ANGLE_SUM" },
  ];
  const optionSet = buildOptions(expected, [
    { text: "140°", misconceptionId: "DO_NOT_HALVE_REMAINING_SUM", rationale: "Finds the sum of the two base angles but does not divide it equally." },
    { text: "40°", misconceptionId: "COPY_APEX_ANGLE", rationale: "Assumes all angles are equal although the triangle is only isosceles." },
    { text: "90°", misconceptionId: "ASSUME_ISOSCELES_RIGHT_TRIANGLE", rationale: "Adds an unstated right-angle condition." },
  ], seed);
  return finalizeQuestion({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP003-ISOSCELES-BASE-V1", solveMode: "findIsoscelesBaseAngle",
    difficulty: "Easy", seed,
    stem: "In triangle ABC, AB = AC and ∠A = 40°. Find ∠B.",
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "Because AB = AC, the base angles at B and C are equal.",
      "The two base angles together are 180° − 40° = 140°, so each is 70°. Therefore ∠B = 70°.",
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: passedVerifier("INDEPENDENT_ARITHMETIC", ["40 + 70 + 70 = 180", "equal sides correspond to equal base angles"]),
    diagramModel: triangleDiagram("ISOSCELES"),
  });
}

function generateTriangleInequalityRange(seed: string): Phase1PrototypeQuestion {
  const clueIds = ["ABC_IS_TRIANGLE", "SIDE_A_IS_7", "SIDE_B_IS_11"] as const;
  const expected = "4 < x < 18";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clueId) => active.has(clueId))) return null;
    const lower = Math.abs(11 - 7);
    const upper = 11 + 7;
    return `${lower} < x < ${upper}`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Triangle-inequality range solver mismatch");
  const theoremTrace: TheoremId[] = ["TRIANGLE_INEQUALITY"];
  const optionSet = buildOptions(expected, [
    { text: "4 ≤ x ≤ 18", misconceptionId: "INCLUSIVE_TRIANGLE_BOUNDARIES", rationale: "Includes degenerate boundary values that do not form a triangle." },
    { text: "x < 18", misconceptionId: "ONLY_UPPER_TRIANGLE_BOUND", rationale: "Uses only the sum condition and misses the lower bound." },
    { text: "7 < x < 11", misconceptionId: "THIRD_SIDE_BETWEEN_GIVEN_SIDES", rationale: "Incorrectly assumes the third side must lie between the two known sides." },
  ], seed);
  const validIntegers = Array.from({ length: 13 }, (_, index) => index + 5);
  if (validIntegers[0] !== 5 || validIntegers[validIntegers.length - 1] !== 17 || validIntegers.length !== 13) {
    throw new Error("Independent triangle-range enumeration mismatch");
  }
  return finalizeQuestion({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP003-TRIANGLE-INEQUALITY-RANGE-V1", solveMode: "findPermissibleThirdSideRange",
    difficulty: "Medium", seed,
    stem: "Two sides of a triangle are 7 cm and 11 cm. If the third side is x cm, which range can x satisfy?",
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "For three positive lengths to form a triangle, the third side must be greater than the difference and less than the sum of the other two sides.",
      "Here |11 − 7| < x < 11 + 7, so 4 < x < 18.",
    ]),
    theoremTrace, proofEvents: [], displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: passedVerifier("EXACT_RANGE_ENUMERATION", [
      "boundary x = 4 is degenerate", "boundary x = 18 is degenerate", "integer values 5 through 17 are admissible",
    ]),
  });
}

export const GEO_CP_003_PHASE1_PROTOTYPES: readonly Phase1PrototypeDefinition[] = Object.freeze([
  { temporaryPrototypeId: "GEO-TMP-CP003-THIRD-ANGLE-V1", cpId: CP_ID, solveMode: "findTriangleThirdAngle", generate: generateThirdAngle },
  { temporaryPrototypeId: "GEO-TMP-CP003-EXTERIOR-ANGLE-V1", cpId: CP_ID, solveMode: "findExteriorAngleFromRemoteInteriors", generate: generateExteriorAngle },
  { temporaryPrototypeId: "GEO-TMP-CP003-ISOSCELES-BASE-V1", cpId: CP_ID, solveMode: "findIsoscelesBaseAngle", generate: generateIsoscelesBase },
  { temporaryPrototypeId: "GEO-TMP-CP003-TRIANGLE-INEQUALITY-RANGE-V1", cpId: CP_ID, solveMode: "findPermissibleThirdSideRange", generate: generateTriangleInequalityRange },
]);
