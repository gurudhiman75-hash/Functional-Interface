import { angle, type GeoDiagramModel, type GeoProofEvent, type TheoremId } from "../../../../../../shared/geometry";
import { approximate, buildExplanation, buildOptions, finalizePhase5Question, numericAngleDegrees, proveClueMinimality, verifier } from "../discovery/phase5-utils";
import type { Phase5PrototypeDefinition, Phase5PrototypeQuestion } from "../discovery/phase5-types";

const CP_ID = "GEO-CP-014" as const;

function diagram(): GeoDiagramModel {
  return {
    points: [{ id: "O", label: "O", x: 90, y: 110 }, { id: "T", label: "T", x: 160, y: 110 }, { id: "P", label: "P", x: 205, y: 45 }],
    segments: [
      { id: "OT", fromPointId: "O", toPointId: "T" }, { id: "TP", fromPointId: "T", toPointId: "P" }, { id: "OP", fromPointId: "O", toPointId: "P" },
    ],
    circles: [{ id: "circle-o", centerPointId: "O", radius: 70 }],
    angleMarks: [
      { id: "angle-top", firstPointId: "T", vertexPointId: "O", secondPointId: "P", label: "35°" },
      { id: "angle-opt", firstPointId: "O", vertexPointId: "P", secondPointId: "T", label: "x" },
    ],
    rightAngleMarks: [], equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function generate(seed: string): Phase5PrototypeQuestion {
  const clueIds = ["O_IS_CENTRE", "PT_TANGENT_AT_T", "ANGLE_TOP_IS_35"] as const;
  const expected = "55°";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    return `${180 - 90 - 35}°`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Tangent + triangle mixed solver mismatch");
  const O = { x: 0, y: 0 }; const T = { x: 5, y: 0 }; const P = { x: 5, y: 5 * Math.tan(35 * Math.PI / 180) };
  const measuredO = numericAngleDegrees(T, O, P);
  const measuredT = numericAngleDegrees(O, T, P);
  const measuredP = numericAngleDegrees(O, P, T);
  const passed = approximate(Math.hypot(T.x, T.y), 5) && approximate(measuredO, 35) && approximate(measuredT, 90) && approximate(measuredP, 55);
  const theoremTrace: TheoremId[] = ["GIVEN_ANGLE", "RADIUS_PERPENDICULAR_TANGENT", "TRIANGLE_ANGLE_SUM"];
  const proofEvents: GeoProofEvent[] = [
    { kind: "ANGLE_SUM", angleIds: ["OTP"], total: angle(90), reason: "RADIUS_PERPENDICULAR_TANGENT" },
    { kind: "ANGLE_SUM", angleIds: ["TOP", "OTP", "OPT"], total: angle(180), reason: "TRIANGLE_ANGLE_SUM" },
  ];
  const options = buildOptions(expected, [
    { text: "90°", misconceptionId: "RETURNED_RADIUS_TANGENT_ANGLE", rationale: "Returns the right angle at T instead of the requested angle at P." },
    { text: "35°", misconceptionId: "COPIED_GIVEN_CENTRAL_ANGLE", rationale: "Copies the given angle at O." },
    { text: "145°", misconceptionId: "USED_ONLY_SUPPLEMENT", rationale: "Subtracts 35° from 180° but ignores the tangent right angle." },
  ], seed);
  return finalizePhase5Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP014-TANGENT-TRIANGLE-V1", solveMode: "findTriangleAngleUsingRadiusTangent", difficulty: "Medium", seed,
    stem: "PT is tangent to a circle at T, O is the centre, and O, P and T form triangle OPT. If ∠TOP = 35°, find ∠OPT.",
    ...options,
    explanation: buildExplanation(theoremTrace, [
      "The radius OT is perpendicular to tangent PT at the point of contact, so ∠OTP = 90°.",
      "The angles of triangle OPT add to 180°. Therefore ∠OPT = 180° − 90° − 35° = 55°.",
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: verifier("HIGH_PRECISION_COORDINATE", passed, [`hidden ∠TOP = ${measuredO.toFixed(8)}°`, `hidden ∠OTP = ${measuredT.toFixed(8)}°`, `hidden ∠OPT = ${measuredP.toFixed(8)}°`]),
    diagramModel: diagram(),
  });
}

export const GEO_CP_014_TANGENT_TRIANGLE_PHASE5_PROTOTYPE: Phase5PrototypeDefinition = Object.freeze({
  temporaryPrototypeId: "GEO-TMP-CP014-TANGENT-TRIANGLE-V1", cpId: CP_ID, solveMode: "findTriangleAngleUsingRadiusTangent", generate,
});
