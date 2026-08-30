import { angle, type GeoDiagramModel, type GeoProofEvent, type TheoremId } from "../../../../../../shared/geometry";
import { approximate, buildExplanation, buildOptions, finalizePhase5Question, numericAngleDegrees, proveClueMinimality, verifier } from "../discovery/phase5-utils";
import type { Phase5PrototypeDefinition, Phase5PrototypeQuestion } from "../discovery/phase5-types";

const CP_ID = "GEO-CP-014" as const;

function diagram(): GeoDiagramModel {
  const polar = (id: string, degrees: number) => {
    const radians = degrees * Math.PI / 180;
    return { id, label: id, x: 100 + 76 * Math.cos(radians), y: 100 + 76 * Math.sin(radians) };
  };
  return {
    points: [{ id: "O", label: "O", x: 100, y: 100 }, polar("A", 0), polar("B", 55), polar("C", 145), polar("D", 280)],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" }, { id: "BC", fromPointId: "B", toPointId: "C" },
      { id: "CD", fromPointId: "C", toPointId: "D" }, { id: "DA", fromPointId: "D", toPointId: "A" }, { id: "BD", fromPointId: "B", toPointId: "D" },
    ],
    circles: [{ id: "circle-o", centerPointId: "O", radius: 76 }],
    angleMarks: [
      { id: "angle-dab", firstPointId: "D", vertexPointId: "A", secondPointId: "B", label: "110°" },
      { id: "angle-cbd", firstPointId: "C", vertexPointId: "B", secondPointId: "D", label: "x" },
    ],
    rightAngleMarks: [], equalLengthMarks: [{ id: "equal-bc-cd", segmentIds: ["BC", "CD"] }],
    parallelMarks: [], arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function generate(seed: string): Phase5PrototypeQuestion {
  const clueIds = ["ABCD_IS_CYCLIC", "ANGLE_DAB_IS_110", "BC_EQUALS_CD"] as const;
  const expected = "55°";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const angleC = 180 - 110;
    return `${(180 - angleC) / 2}°`;
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("Cyclic + isosceles mixed solver mismatch");
  const unit = (degrees: number) => ({ x: Math.cos(degrees * Math.PI / 180), y: Math.sin(degrees * Math.PI / 180) });
  const A = unit(0); const B = unit(70); const C = unit(180); const D = unit(290);
  const measuredA = numericAngleDegrees(D, A, B);
  const measuredC = numericAngleDegrees(B, C, D);
  const measuredB = numericAngleDegrees(C, B, D);
  const measuredD = numericAngleDegrees(B, D, C);
  const bc = Math.hypot(B.x - C.x, B.y - C.y); const cd = Math.hypot(C.x - D.x, C.y - D.y);
  const passed = approximate(measuredA, 110) && approximate(measuredC, 70) && approximate(measuredB, 55) && approximate(measuredD, 55) && approximate(bc, cd);
  const theoremTrace: TheoremId[] = ["CYCLIC_OPPOSITE_SUPPLEMENTARY", "ISOSCELES_BASE_ANGLES", "TRIANGLE_ANGLE_SUM"];
  const proofEvents: GeoProofEvent[] = [
    { kind: "ANGLE_SUM", angleIds: ["DAB", "BCD"], total: angle(180), reason: "CYCLIC_OPPOSITE_SUPPLEMENTARY" },
    { kind: "ANGLE_EQUALITY", leftAngleId: "CBD", rightAngleId: "BDC", reason: "ISOSCELES_BASE_ANGLES" },
    { kind: "ANGLE_SUM", angleIds: ["CBD", "BCD", "BDC"], total: angle(180), reason: "TRIANGLE_ANGLE_SUM" },
  ];
  const options = buildOptions(expected, [
    { text: "70°", misconceptionId: "STOPPED_AT_CYCLIC_OPPOSITE", rationale: "Finds ∠BCD but stops before using the isosceles triangle." },
    { text: "35°", misconceptionId: "HALVED_CYCLIC_OPPOSITE", rationale: "Halves 70° instead of sharing the remaining 110° between the equal base angles." },
    { text: "110°", misconceptionId: "CYCLIC_OPPOSITE_EQUAL", rationale: "Treats opposite cyclic angles as equal." },
  ], seed);
  return finalizePhase5Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP014-CYCLIC-ISOSCELES-V1", solveMode: "findIsoscelesAngleInsideCyclicQuadrilateral", difficulty: "Medium", seed,
    stem: "ABCD is a cyclic quadrilateral. ∠DAB = 110°. Also, in triangle BCD, BC = CD. Find ∠CBD.",
    ...options,
    explanation: buildExplanation(theoremTrace, [
      "Opposite angles of a cyclic quadrilateral add to 180°, so ∠BCD = 180° − 110° = 70°.",
      "Because BC = CD, triangle BCD is isosceles and its base angles at B and D are equal.",
      "Those two equal angles share the remaining 180° − 70° = 110°, so ∠CBD = 110°/2 = 55°.",
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: verifier("HIGH_PRECISION_COORDINATE", passed, [`hidden cyclic angle DAB = ${measuredA.toFixed(8)}°`, `hidden angle BCD = ${measuredC.toFixed(8)}°`, "hidden BC and CD are equal", `hidden base angles are ${measuredB.toFixed(8)}° and ${measuredD.toFixed(8)}°`]),
    diagramModel: diagram(),
  });
}

export const GEO_CP_014_CYCLIC_ISOSCELES_PHASE5_PROTOTYPE: Phase5PrototypeDefinition = Object.freeze({
  temporaryPrototypeId: "GEO-TMP-CP014-CYCLIC-ISOSCELES-V1", cpId: CP_ID, solveMode: "findIsoscelesAngleInsideCyclicQuadrilateral", generate,
});
