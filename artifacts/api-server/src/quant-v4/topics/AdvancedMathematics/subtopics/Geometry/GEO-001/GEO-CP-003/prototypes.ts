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

function variantIndex(seed: string, length: number): number {
  let hash = 2166136261;
  for (const character of seed) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % length;
}

function triangleDiagram(
  kind: "THIRD" | "EXTERIOR" | "ISOSCELES",
  values: readonly number[],
): GeoDiagramModel {
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
      { id: "angle-a", firstPointId: "B", vertexPointId: "A", secondPointId: "C", label: `${values[0]}°` },
      { id: "angle-b", firstPointId: "A", vertexPointId: "B", secondPointId: "C", label: `${values[1]}°` },
      { id: "angle-c", firstPointId: "A", vertexPointId: "C", secondPointId: "B", label: "x" },
    ] : kind === "EXTERIOR" ? [
      { id: "angle-a", firstPointId: "B", vertexPointId: "A", secondPointId: "C", label: `${values[0]}°` },
      { id: "angle-c", firstPointId: "A", vertexPointId: "C", secondPointId: "B", label: `${values[1]}°` },
      { id: "angle-ext", firstPointId: "C", vertexPointId: "B", secondPointId: "D", label: "x" },
    ] : [
      { id: "angle-apex", firstPointId: "B", vertexPointId: "A", secondPointId: "C", label: `${values[0]}°` },
      { id: "angle-base-b", firstPointId: "A", vertexPointId: "B", secondPointId: "C", label: "x" },
    ],
    rightAngleMarks: [],
    equalLengthMarks: kind === "ISOSCELES" ? [{ id: "equal-ab-ac", segmentIds: ["AB", "AC"] }] : [],
    parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function generateThirdAngle(seed: string): Phase1PrototypeQuestion {
  const pool = [[60, 70], [48, 67], [35, 85], [72, 54], [42, 63]] as const;
  const [a, b] = pool[variantIndex(seed, pool.length)]!;
  const target = 180 - a - b;
  const clueIds = ["ABC_IS_TRIANGLE", "ANGLE_A_GIVEN", "ANGLE_B_GIVEN"] as const;
  const expected = `${target}°`;
  const solve = (active: ReadonlySet<string>): string | null => {
    const engine = new AngleConstraintEngine();
    if (active.has("ANGLE_A_GIVEN")) engine.addKnown("A", angle(a));
    if (active.has("ANGLE_B_GIVEN")) engine.addKnown("B", angle(b));
    if (active.has("ABC_IS_TRIANGLE")) engine.addFixedSum(["A", "B", "C"], ANGLE_180, "TRIANGLE_ANGLE_SUM");
    try { return formatAngle(engine.solve("C").value); } catch { return null; }
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Triangle third-angle synthetic solver mismatch");
  const theoremTrace: TheoremId[] = ["GIVEN_ANGLE", "TRIANGLE_ANGLE_SUM"];
  const proofEvents: GeoProofEvent[] = [{ kind: "ANGLE_SUM", angleIds: ["A", "B", "C"], total: ANGLE_180, reason: "TRIANGLE_ANGLE_SUM" }];
  const optionSet = buildOptions(expected, [
    { text: `${a + b}°`, misconceptionId: "ADD_TWO_GIVEN_ANGLES", rationale: "Returns the sum of the two given angles instead of subtracting from 180°." },
    { text: `${180 - a}°`, misconceptionId: "SUBTRACT_ONLY_ONE_GIVEN", rationale: "Uses only one of the two stated angles." },
    { text: `${360 - a - b}°`, misconceptionId: "USE_360_FOR_TRIANGLE", rationale: "Uses 360° as the triangle angle sum." },
  ], seed);
  return finalizeQuestion({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP003-THIRD-ANGLE-V1", solveMode: "findTriangleThirdAngle",
    difficulty: "Easy", seed,
    stem: `In triangle ABC, ∠A = ${a}° and ∠B = ${b}°. Find ∠C.`,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "The three interior angles of a triangle add to 180°.",
      `So ∠C = 180° − ${a}° − ${b}° = ${target}°.`,
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: passedVerifier("INDEPENDENT_ARITHMETIC", [`${a} + ${b} + ${target} = 180`]),
    diagramModel: triangleDiagram("THIRD", [a, b]),
  });
}

function generateExteriorAngle(seed: string): Phase1PrototypeQuestion {
  const pool = [[55, 65], [42, 71], [38, 84], [63, 49], [47, 58]] as const;
  const [a, cAngle] = pool[variantIndex(seed, pool.length)]!;
  const exterior = a + cAngle;
  const clueIds = ["AB_EXTENDED_THROUGH_B_TO_D", "REMOTE_ANGLE_A_GIVEN", "REMOTE_ANGLE_C_GIVEN"] as const;
  const expected = `${exterior}°`;
  const solve = (active: ReadonlySet<string>): string | null => {
    const engine = new AngleConstraintEngine();
    if (active.has("REMOTE_ANGLE_A_GIVEN")) engine.addKnown("A", angle(a));
    if (active.has("REMOTE_ANGLE_C_GIVEN")) engine.addKnown("C", angle(cAngle));
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
  const proofEvents: GeoProofEvent[] = [{ kind: "ANGLE_SUM", angleIds: ["A", "C"], total: angle(exterior), reason: "TRIANGLE_EXTERIOR_ANGLE" }];
  const optionSet = buildOptions(expected, [
    { text: `${180 - exterior}°`, misconceptionId: "SUPPLEMENT_REMOTE_SUM", rationale: "Subtracts the remote-angle sum from 180°." },
    { text: `${Math.abs(a - cAngle)}°`, misconceptionId: "DIFFERENCE_OF_REMOTE_ANGLES", rationale: "Takes the difference of the remote interior angles." },
    { text: `${a}°`, misconceptionId: "COPY_ONE_REMOTE_ANGLE", rationale: "Copies one remote interior angle instead of adding both." },
  ], seed);
  return finalizeQuestion({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP003-EXTERIOR-ANGLE-V1", solveMode: "findExteriorAngleFromRemoteInteriors",
    difficulty: "Easy", seed,
    stem: `In triangle ABC, side AB is extended through B to D. If ∠A = ${a}° and ∠C = ${cAngle}°, find the exterior angle ∠CBD.`,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "∠CBD is the exterior angle at B because AB is extended through B to D.",
      `An exterior angle equals the sum of the two remote interior angles, so ∠CBD = ${a}° + ${cAngle}° = ${exterior}°.`,
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: passedVerifier("INDEPENDENT_ARITHMETIC", [`${a} + ${cAngle} = ${exterior}`, "the exterior angle is between 0° and 180°"]),
    diagramModel: triangleDiagram("EXTERIOR", [a, cAngle]),
  });
}

function generateIsoscelesBase(seed: string): Phase1PrototypeQuestion {
  const apexPool = [36, 40, 52, 64, 80] as const;
  const apex = apexPool[variantIndex(seed, apexPool.length)]!;
  const base = (180 - apex) / 2;
  const clueIds = ["ABC_IS_TRIANGLE", "AB_EQUALS_AC", "APEX_ANGLE_A_GIVEN"] as const;
  const expected = `${base}°`;
  const solve = (active: ReadonlySet<string>): string | null => {
    const engine = new AngleConstraintEngine();
    if (active.has("APEX_ANGLE_A_GIVEN")) engine.addKnown("A", angle(apex));
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
    { text: `${180 - apex}°`, misconceptionId: "DO_NOT_HALVE_REMAINING_SUM", rationale: "Finds the sum of the two base angles but does not divide it equally." },
    { text: `${apex}°`, misconceptionId: "COPY_APEX_ANGLE", rationale: "Assumes all angles are equal although the triangle is only isosceles." },
    { text: "90°", misconceptionId: "ASSUME_ISOSCELES_RIGHT_TRIANGLE", rationale: "Adds an unstated right-angle condition." },
  ], seed);
  return finalizeQuestion({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP003-ISOSCELES-BASE-V1", solveMode: "findIsoscelesBaseAngle",
    difficulty: "Easy", seed,
    stem: `In triangle ABC, AB = AC and ∠A = ${apex}°. Find ∠B.`,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "Because AB = AC, the base angles at B and C are equal.",
      `The two base angles together are 180° − ${apex}° = ${180 - apex}°, so each is ${base}°. Therefore ∠B = ${base}°.`,
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: passedVerifier("INDEPENDENT_ARITHMETIC", [`${apex} + ${base} + ${base} = 180`, "equal sides correspond to equal base angles"]),
    diagramModel: triangleDiagram("ISOSCELES", [apex]),
  });
}

function generateTriangleInequalityRange(seed: string): Phase1PrototypeQuestion {
  const pool = [[7, 11], [5, 9], [8, 13], [6, 15], [10, 17]] as const;
  const [sideA, sideB] = pool[variantIndex(seed, pool.length)]!;
  const lower = Math.abs(sideB - sideA);
  const upper = sideA + sideB;
  const clueIds = ["ABC_IS_TRIANGLE", "TWO_SIDES_GIVEN"] as const;
  const expected = `${lower} < x < ${upper}`;
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clueId) => active.has(clueId))) return null;
    return `${lower} < x < ${upper}`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Triangle-inequality range solver mismatch");
  const theoremTrace: TheoremId[] = ["TRIANGLE_INEQUALITY"];
  const optionSet = buildOptions(expected, [
    { text: `${lower} ≤ x ≤ ${upper}`, misconceptionId: "INCLUSIVE_TRIANGLE_BOUNDARIES", rationale: "Includes degenerate boundary values that do not form a triangle." },
    { text: `x < ${upper}`, misconceptionId: "ONLY_UPPER_TRIANGLE_BOUND", rationale: "Uses only the sum condition and misses the lower bound." },
    { text: `${Math.min(sideA, sideB)} < x < ${Math.max(sideA, sideB)}`, misconceptionId: "THIRD_SIDE_BETWEEN_GIVEN_SIDES", rationale: "Incorrectly assumes the third side must lie between the two known sides." },
  ], seed);
  const validIntegers = Array.from({ length: Math.max(0, upper - lower - 1) }, (_, index) => lower + 1 + index);
  if (validIntegers[0] !== lower + 1 || validIntegers[validIntegers.length - 1] !== upper - 1) {
    throw new Error("Independent triangle-range enumeration mismatch");
  }
  return finalizeQuestion({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP003-TRIANGLE-INEQUALITY-RANGE-V1", solveMode: "findPermissibleThirdSideRange",
    difficulty: "Medium", seed,
    stem: `Two sides of a triangle are ${sideA} cm and ${sideB} cm. If the third side is x cm, which range can x satisfy?`,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "For three positive lengths to form a triangle, the third side must be greater than the difference and less than the sum of the other two sides.",
      `Here |${sideB} − ${sideA}| < x < ${sideB} + ${sideA}, so ${lower} < x < ${upper}.`,
    ]),
    theoremTrace, proofEvents: [], displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: passedVerifier("EXACT_RANGE_ENUMERATION", [
      `boundary x = ${lower} is degenerate`, `boundary x = ${upper} is degenerate`, `integer values ${lower + 1} through ${upper - 1} are admissible`,
    ]),
  });
}

export const GEO_CP_003_PHASE1_PROTOTYPES: readonly Phase1PrototypeDefinition[] = Object.freeze([
  { temporaryPrototypeId: "GEO-TMP-CP003-THIRD-ANGLE-V1", cpId: CP_ID, solveMode: "findTriangleThirdAngle", generate: generateThirdAngle },
  { temporaryPrototypeId: "GEO-TMP-CP003-EXTERIOR-ANGLE-V1", cpId: CP_ID, solveMode: "findExteriorAngleFromRemoteInteriors", generate: generateExteriorAngle },
  { temporaryPrototypeId: "GEO-TMP-CP003-ISOSCELES-BASE-V1", cpId: CP_ID, solveMode: "findIsoscelesBaseAngle", generate: generateIsoscelesBase },
  { temporaryPrototypeId: "GEO-TMP-CP003-TRIANGLE-INEQUALITY-RANGE-V1", cpId: CP_ID, solveMode: "findPermissibleThirdSideRange", generate: generateTriangleInequalityRange },
]);
