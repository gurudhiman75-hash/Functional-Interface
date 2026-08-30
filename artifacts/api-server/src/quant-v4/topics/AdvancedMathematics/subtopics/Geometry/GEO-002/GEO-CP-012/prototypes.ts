import {
  CoordinateOracle,
  equalTangentLength,
  equals,
  radiusTangentAngle,
  rational,
  type GeoDiagramModel,
  type GeoProofEvent,
  type TheoremId,
} from "../../../../../../shared/geometry";
import { buildExplanation, buildOptions, finalizePhase4Question, proveClueMinimality, verifier } from "../discovery/phase4-utils";
import type { Phase4PrototypeDefinition, Phase4PrototypeQuestion } from "../discovery/phase4-types";

const CP_ID = "GEO-CP-012" as const;
const q = (value: number, denominator = 1) => rational(value, denominator);

function radiusTangentDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "O", label: "O", x: 100, y: 100 },
      { id: "T", label: "T", x: 170, y: 100 },
      { id: "P", label: "P", x: 205, y: 45 },
    ],
    segments: [{ id: "OT", fromPointId: "O", toPointId: "T" }, { id: "TP", fromPointId: "T", toPointId: "P" }],
    circles: [{ id: "circle-o", centerPointId: "O", radius: 70 }],
    angleMarks: [{ id: "angle-otp", firstPointId: "O", vertexPointId: "T", secondPointId: "P", label: "x" }],
    rightAngleMarks: [], equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function equalTangentsDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "O", label: "O", x: 100, y: 100 }, { id: "P", label: "P", x: 205, y: 94 },
      { id: "A", label: "A", x: 149, y: 50 }, { id: "B", label: "B", x: 151, y: 148 },
    ],
    segments: [{ id: "PA", fromPointId: "P", toPointId: "A" }, { id: "PB", fromPointId: "P", toPointId: "B" }],
    circles: [{ id: "circle-o", centerPointId: "O", radius: 70 }],
    angleMarks: [], rightAngleMarks: [], equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function generateRadiusTangentAngle(seed: string): Phase4PrototypeQuestion {
  const clueIds = ["O_IS_CENTRE", "T_ON_CIRCLE", "PT_TANGENT_AT_T"] as const;
  const expected = "90°";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    return `${radiusTangentAngle().numerator}°`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Radius-tangent angle solver mismatch");
  const oracle = new CoordinateOracle({ O: { x: q(0), y: q(0) }, T: { x: q(5), y: q(0) }, P: { x: q(5), y: q(12) } });
  const passed = oracle.pointOnCircle("T", "O", q(25)) && oracle.perpendicular("O", "T", "T", "P");
  const theoremTrace: TheoremId[] = ["RADIUS_PERPENDICULAR_TANGENT"];
  const proofEvents: GeoProofEvent[] = [{ kind: "ANGLE_SUM", angleIds: ["OTP"], total: rational(90), reason: "RADIUS_PERPENDICULAR_TANGENT" }];
  const options = buildOptions(expected, [
    { text: "45°", misconceptionId: "RADIUS_TANGENT_ASSUMED_45", rationale: "Uses a familiar acute angle instead of the radius–tangent theorem." },
    { text: "180°", misconceptionId: "RADIUS_TANGENT_ASSUMED_STRAIGHT", rationale: "Treats the radius and tangent as one straight line." },
    { text: "60°", misconceptionId: "RADIUS_TANGENT_ASSUMED_60", rationale: "Imports an unrelated standard angle." },
  ], seed);
  return finalizePhase4Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP012-RADIUS-TANGENT-ANGLE-V1", solveMode: "findRadiusTangentAngle", difficulty: "Easy", seed,
    stem: "PT is tangent to a circle at T, and O is the centre. Find ∠OTP.",
    ...options,
    explanation: buildExplanation(theoremTrace, [
      "A radius drawn to the point of contact is perpendicular to the tangent.",
      "Therefore OT is perpendicular to PT, so ∠OTP = 90°.",
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: verifier("COORDINATE_ORACLE", passed, ["hidden T lies exactly on the circle", "hidden OT and TP have zero dot product"]),
    diagramModel: radiusTangentDiagram(),
  });
}

function generateEqualTangents(seed: string): Phase4PrototypeQuestion {
  const clueIds = ["PA_TANGENT_AT_A", "PB_TANGENT_AT_B", "COMMON_EXTERNAL_POINT_P", "PA_IS_9"] as const;
  const expected = "9 cm";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const result = equalTangentLength(q(9));
    return `${result.numerator} cm`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Equal-tangents solver mismatch");
  const oracle = new CoordinateOracle({
    O: { x: q(0), y: q(0) }, P: { x: q(15), y: q(0) },
    A: { x: q(48, 5), y: q(36, 5) }, B: { x: q(48, 5), y: q(-36, 5) },
  });
  const passed = oracle.pointOnCircle("A", "O", q(144)) && oracle.pointOnCircle("B", "O", q(144))
    && oracle.perpendicular("O", "A", "P", "A") && oracle.perpendicular("O", "B", "P", "B")
    && oracle.equalLengths("P", "A", "P", "B") && equals(oracle.squaredLength("P", "A"), q(81));
  const theoremTrace: TheoremId[] = ["TANGENTS_FROM_EXTERNAL_POINT_EQUAL"];
  const proofEvents: GeoProofEvent[] = [{ kind: "SEGMENT_RATIO", left: "PA", right: "PB", ratio: q(1), reason: "TANGENTS_FROM_EXTERNAL_POINT_EQUAL" }];
  const options = buildOptions(expected, [
    { text: "18 cm", misconceptionId: "ADDED_EQUAL_TANGENTS", rationale: "Adds the two tangent lengths instead of equating them." },
    { text: "4.5 cm", misconceptionId: "HALVED_EQUAL_TANGENT", rationale: "Halves the known tangent without justification." },
    { text: "Cannot be determined", misconceptionId: "UNEQUAL_TANGENTS_FROM_SAME_POINT", rationale: "Misses that two tangents from one external point are equal." },
  ], seed);
  return finalizePhase4Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP012-EQUAL-TANGENTS-V1", solveMode: "findSecondTangentFromExternalPoint", difficulty: "Easy", seed,
    stem: "From an external point P, PA and PB are tangents to the same circle at A and B. If PA = 9 cm, find PB.",
    ...options,
    explanation: buildExplanation(theoremTrace, [
      "Tangents drawn from the same external point to a circle are equal in length.",
      "So PB = PA = 9 cm.",
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: verifier("COORDINATE_ORACLE", passed, ["hidden A and B lie exactly on the circle", "OA is perpendicular to PA and OB is perpendicular to PB", "PA and PB both have exact squared length 81"]),
    diagramModel: equalTangentsDiagram(),
  });
}

export const GEO_CP_012_PHASE4_PROTOTYPES: readonly Phase4PrototypeDefinition[] = Object.freeze([
  { temporaryPrototypeId: "GEO-TMP-CP012-RADIUS-TANGENT-ANGLE-V1", cpId: CP_ID, solveMode: "findRadiusTangentAngle", generate: generateRadiusTangentAngle },
  { temporaryPrototypeId: "GEO-TMP-CP012-EQUAL-TANGENTS-V1", cpId: CP_ID, solveMode: "findSecondTangentFromExternalPoint", generate: generateEqualTangents },
]);
