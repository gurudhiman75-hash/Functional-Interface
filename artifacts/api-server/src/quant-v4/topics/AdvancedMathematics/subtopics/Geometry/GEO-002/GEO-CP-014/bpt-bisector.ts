import { divide, multiply, rational, type GeoDiagramModel, type GeoProofEvent, type TheoremId } from "../../../../../../shared/geometry";
import { approximate, buildExplanation, buildOptions, finalizePhase5Question, numericAngleDegrees, proveClueMinimality, verifier } from "../discovery/phase5-utils";
import type { Phase5PrototypeDefinition, Phase5PrototypeQuestion } from "../discovery/phase5-types";

const CP_ID = "GEO-CP-014" as const;
const q = (value: number, denominator = 1) => rational(value, denominator);
const lengthText = (value: ReturnType<typeof rational>) => value.denominator === 1n ? `${value.numerator} cm` : `${value.numerator}/${value.denominator} cm`;

function diagram(): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 105, y: 20 }, { id: "B", label: "B", x: 25, y: 165 }, { id: "C", label: "C", x: 190, y: 155 },
      { id: "E", label: "E", x: 62, y: 98 }, { id: "F", label: "F", x: 150, y: 92 }, { id: "D", label: "D", x: 92, y: 161 },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" }, { id: "AC", fromPointId: "A", toPointId: "C" }, { id: "BC", fromPointId: "B", toPointId: "C" },
      { id: "EF", fromPointId: "E", toPointId: "F" }, { id: "AD", fromPointId: "A", toPointId: "D" },
    ],
    circles: [], angleMarks: [], rightAngleMarks: [], equalLengthMarks: [],
    parallelMarks: [{ id: "parallel-ef-bc", segmentIds: ["EF", "BC"] }],
    arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function generate(seed: string): Phase5PrototypeQuestion {
  const clueIds = ["ABC_TRIANGLE_EF_PARALLEL_BC_WITH_E_ON_AB_F_ON_AC", "AE_IS_4", "EB_IS_2", "AF_IS_6", "AD_BISECTS_ANGLE_A", "BD_IS_4"] as const;
  const expected = "6 cm";
  const solve = (active: ReadonlySet<string>): string | null => {
    if (!clueIds.every((clue) => active.has(clue))) return null;
    const ab = q(6);
    const ac = divide(multiply(q(6), ab), q(4));
    const sideRatio = divide(ab, ac);
    const dc = divide(q(4), sideRatio);
    return lengthText(dc);
  };
  if (solve(new Set(clueIds)) !== expected) throw new Error("BPT + angle-bisector mixed solver mismatch");

  const A = { x: 0, y: 0 }; const B = { x: 6, y: 0 };
  const cx = 17 / 12; const cy = Math.sqrt(81 - cx * cx); const C = { x: cx, y: cy };
  const E = { x: 4, y: 0 }; const F = { x: C.x * 2 / 3, y: C.y * 2 / 3 };
  const D = { x: B.x + 0.4 * (C.x - B.x), y: B.y + 0.4 * (C.y - B.y) };
  const distance = (u: { x: number; y: number }, v: { x: number; y: number }) => Math.hypot(u.x - v.x, u.y - v.y);
  const cross = (u: { x: number; y: number }, v: { x: number; y: number }) => u.x * v.y - u.y * v.x;
  const ef = { x: F.x - E.x, y: F.y - E.y }; const bc = { x: C.x - B.x, y: C.y - B.y };
  const angleBAD = numericAngleDegrees(B, A, D); const angleDAC = numericAngleDegrees(D, A, C);
  const passed = approximate(distance(A, B), 6) && approximate(distance(A, C), 9) && approximate(distance(B, C), 10)
    && approximate(distance(A, E), 4) && approximate(distance(E, B), 2) && approximate(distance(A, F), 6)
    && approximate(cross(ef, bc), 0) && approximate(distance(B, D), 4) && approximate(distance(D, C), 6)
    && approximate(angleBAD, angleDAC);

  const theoremTrace: TheoremId[] = ["BASIC_PROPORTIONALITY_THEOREM", "ANGLE_BISECTOR_THEOREM"];
  const proofEvents: GeoProofEvent[] = [
    { kind: "SEGMENT_RATIO", left: "AE:AB", right: "AF:AC", ratio: q(1), reason: "BASIC_PROPORTIONALITY_THEOREM" },
    { kind: "SEGMENT_RATIO", left: "BD", right: "DC", ratio: q(2, 3), reason: "ANGLE_BISECTOR_THEOREM" },
  ];
  const options = buildOptions(expected, [
    { text: "3 cm", misconceptionId: "INVERTED_ANGLE_BISECTOR_RATIO", rationale: "Reverses the side ratio when applying the angle-bisector theorem." },
    { text: "4 cm", misconceptionId: "ASSUMED_BISECTOR_IS_MEDIAN", rationale: "Assumes the angle bisector splits BC into equal segments." },
    { text: "9 cm", misconceptionId: "RETURNED_DERIVED_AC", rationale: "Stops after finding AC and reports the intermediate value." },
  ], seed);
  return finalizePhase5Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP014-BPT-BISECTOR-V1", solveMode: "findSegmentUsingBptThenAngleBisector", difficulty: "Hard", seed,
    stem: "In triangle ABC, E lies on AB and F lies on AC with EF ∥ BC. AE = 4 cm, EB = 2 cm and AF = 6 cm. AD bisects ∠A and meets BC at D. If BD = 4 cm, find DC.",
    ...options,
    explanation: buildExplanation(theoremTrace, [
      "AB = AE + EB = 4 + 2 = 6 cm. Since EF is parallel to BC, proportional corresponding sides give AE/AB = AF/AC. Thus 4/6 = 6/AC, so AC = 9 cm.",
      "Now use the angle-bisector theorem on AD: BD/DC = AB/AC = 6/9 = 2/3.",
      "With BD = 4 cm, 4/DC = 2/3, so DC = 6 cm.",
    ]),
    theoremTrace, proofEvents, displayedClueIds: clueIds,
    minimalityProof: proveClueMinimality(clueIds, solve, expected),
    independentVerifierResult: verifier("HIGH_PRECISION_COORDINATE", passed, ["hidden AB = 6, AC = 9 and BC = 10", "hidden AE = 4, EB = 2 and AF = 6", "hidden EF is parallel to BC", "hidden BD = 4 and DC = 6", `hidden angle-bisector halves are ${angleBAD.toFixed(8)}° and ${angleDAC.toFixed(8)}°`]),
    diagramModel: diagram(),
  });
}

export const GEO_CP_014_BPT_BISECTOR_PHASE5_PROTOTYPE: Phase5PrototypeDefinition = Object.freeze({
  temporaryPrototypeId: "GEO-TMP-CP014-BPT-BISECTOR-V1", cpId: CP_ID, solveMode: "findSegmentUsingBptThenAngleBisector", generate,
});
