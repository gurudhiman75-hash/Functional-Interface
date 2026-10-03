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

const CP_ID = "GEO-CP-002" as const;
const COORDINATES: CoordinateRealization = Object.freeze({
  A: { x: rational(-3), y: rational(0) }, P: { x: rational(0), y: rational(0) }, B: { x: rational(3), y: rational(0) },
  C: { x: rational(-1), y: rational(2) }, Q: { x: rational(2), y: rational(2) }, D: { x: rational(5), y: rational(2) },
  E: { x: rational(-2), y: rational(-2) }, F: { x: rational(4), y: rational(4) },
});

function variantIndex(seed: string, length: number): number {
  let hash = 2166136261;
  for (const character of seed) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % length;
}

function parallelDiagram(target: "CORRESPONDING" | "CO_INTERIOR", given: number): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 10, y: 40 }, { id: "P", label: "P", x: 90, y: 40 }, { id: "B", label: "B", x: 170, y: 40 },
      { id: "C", label: "C", x: 50, y: 120 }, { id: "Q", label: "Q", x: 130, y: 120 }, { id: "D", label: "D", x: 210, y: 120 },
      { id: "E", label: "E", x: 50, y: 0 }, { id: "F", label: "F", x: 170, y: 160 },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" },
      { id: "CD", fromPointId: "C", toPointId: "D" },
      { id: "EF", fromPointId: "E", toPointId: "F" },
    ],
    circles: [],
    angleMarks: target === "CORRESPONDING" ? [
      { id: "given-angle", firstPointId: "B", vertexPointId: "P", secondPointId: "Q", label: `${given}°` },
      { id: "target-angle", firstPointId: "D", vertexPointId: "Q", secondPointId: "F", label: "x" },
    ] : [
      { id: "given-angle", firstPointId: "B", vertexPointId: "P", secondPointId: "Q", label: `${given}°` },
      { id: "target-angle", firstPointId: "P", vertexPointId: "Q", secondPointId: "D", label: "x" },
    ],
    rightAngleMarks: [], equalLengthMarks: [],
    parallelMarks: [{ id: "parallel-ab-cd", segmentIds: ["AB", "CD"] }],
    arcs: [], labels: [], disclosure: "STEM", notToScale: false,
  };
}

function assertParallelOracle(): readonly string[] {
  const oracle = new CoordinateOracle(COORDINATES);
  if (!oracle.parallel("A", "B", "C", "D")) throw new Error("CP-002 oracle rejected explicit parallel lines");
  if (!oracle.collinear("E", "P", "Q") || !oracle.collinear("P", "Q", "F")) {
    throw new Error("CP-002 oracle rejected transversal incidence");
  }
  return ["AB is exactly parallel to CD", "E, P, Q and F are collinear on the transversal"];
}

function generateCorresponding(seed: string): Phase1PrototypeQuestion {
  const values = [38, 45, 56, 72, 115] as const;
  const given = values[variantIndex(seed, values.length)]!;
  const clueIds = ["AB_PARALLEL_CD", "EF_IS_TRANSVERSAL_THROUGH_P_Q", "ANGLE_BPQ_GIVEN"] as const;
  const expected = `${given}°`;
  const solve = (active: ReadonlySet<string>): string | null => {
    const engine = new AngleConstraintEngine();
    if (active.has("ANGLE_BPQ_GIVEN")) engine.addKnown("BPQ", angle(given));
    if (active.has("AB_PARALLEL_CD") && active.has("EF_IS_TRANSVERSAL_THROUGH_P_Q")) {
      engine.addEqual("BPQ", "DQF", "CORRESPONDING_ANGLES_PARALLEL");
    }
    try { return formatAngle(engine.solve("DQF").value); } catch { return null; }
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Corresponding-angle synthetic solver mismatch");
  const checks = assertParallelOracle();
  const theoremTrace: TheoremId[] = ["GIVEN_ANGLE", "CORRESPONDING_ANGLES_PARALLEL"];
  const proofEvents: GeoProofEvent[] = [{ kind: "ANGLE_EQUALITY", leftAngleId: "BPQ", rightAngleId: "DQF", reason: "CORRESPONDING_ANGLES_PARALLEL" }];
  const optionSet = buildOptions(expected, [
    { text: `${180 - given}°`, misconceptionId: "SUPPLEMENT_CORRESPONDING_ANGLE", rationale: "Uses a supplementary relation instead of corresponding-angle equality." },
    { text: "90°", misconceptionId: "ASSUME_TRANSVERSAL_PERPENDICULAR", rationale: "Assumes the transversal is perpendicular to the parallel lines." },
    { text: `${given / 2}°`, misconceptionId: "HALVE_CORRESPONDING_ANGLE", rationale: "Halves an equal corresponding angle." },
  ], seed);
  return finalizeQuestion({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP002-CORRESPONDING-V1", solveMode: "findCorrespondingAngle",
    difficulty: "Easy", seed,
    stem: `AB ∥ CD. The transversal EF meets AB at P and CD at Q. If ∠BPQ = ${given}°, find ∠DQF.`,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "AB and CD are explicitly parallel, and EF is the transversal through P and Q.",
      `∠BPQ and ∠DQF are corresponding angles, so they are equal. Hence ∠DQF = ${given}°.`,
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: passedVerifier("COORDINATE_ORACLE", checks),
    diagramModel: parallelDiagram("CORRESPONDING", given),
  });
}

function generateCoInterior(seed: string): Phase1PrototypeQuestion {
  const values = [35, 45, 64, 78, 112] as const;
  const given = values[variantIndex(seed, values.length)]!;
  const missing = 180 - given;
  const clueIds = ["AB_PARALLEL_CD", "EF_IS_TRANSVERSAL_THROUGH_P_Q", "ANGLE_BPQ_GIVEN"] as const;
  const expected = `${missing}°`;
  const solve = (active: ReadonlySet<string>): string | null => {
    const engine = new AngleConstraintEngine();
    if (active.has("ANGLE_BPQ_GIVEN")) engine.addKnown("BPQ", angle(given));
    if (active.has("AB_PARALLEL_CD") && active.has("EF_IS_TRANSVERSAL_THROUGH_P_Q")) {
      engine.addSupplementary("BPQ", "PQD", "CO_INTERIOR_SUPPLEMENTARY");
    }
    try { return formatAngle(engine.solve("PQD").value); } catch { return null; }
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Co-interior synthetic solver mismatch");
  const checks = assertParallelOracle();
  const theoremTrace: TheoremId[] = ["GIVEN_ANGLE", "CO_INTERIOR_SUPPLEMENTARY"];
  const proofEvents: GeoProofEvent[] = [{ kind: "ANGLE_SUM", angleIds: ["BPQ", "PQD"], total: ANGLE_180, reason: "CO_INTERIOR_SUPPLEMENTARY" }];
  const optionSet = buildOptions(expected, [
    { text: `${given}°`, misconceptionId: "COPY_COINTERIOR_ANGLE", rationale: "Treats same-side interior angles as equal." },
    { text: `${360 - given}°`, misconceptionId: "USE_360_INSTEAD_OF_180", rationale: "Subtracts from a full turn rather than a straight angle." },
    { text: "90°", misconceptionId: "ASSUME_PERPENDICULAR_TRANSVERSAL", rationale: "Assumes a right angle without a perpendicular mark." },
  ], seed);
  return finalizeQuestion({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP002-COINTERIOR-V1", solveMode: "findCoInteriorSupplement",
    difficulty: "Easy", seed,
    stem: `AB ∥ CD. The transversal EF meets AB at P and CD at Q. If ∠BPQ = ${given}°, find the co-interior angle ∠PQD.`,
    ...optionSet,
    explanation: buildExplanation(theoremTrace, [
      "The parallel marks establish AB ∥ CD; this is not inferred from the drawing.",
      `Co-interior angles on the same side of a transversal add to 180°, so ∠PQD = 180° − ${given}° = ${missing}°.`,
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: passedVerifier("COORDINATE_ORACLE", checks),
    diagramModel: parallelDiagram("CO_INTERIOR", given),
  });
}

export const GEO_CP_002_PHASE1_PROTOTYPES: readonly Phase1PrototypeDefinition[] = Object.freeze([
  { temporaryPrototypeId: "GEO-TMP-CP002-CORRESPONDING-V1", cpId: CP_ID, solveMode: "findCorrespondingAngle", generate: generateCorresponding },
  { temporaryPrototypeId: "GEO-TMP-CP002-COINTERIOR-V1", cpId: CP_ID, solveMode: "findCoInteriorSupplement", generate: generateCoInterior },
]);
