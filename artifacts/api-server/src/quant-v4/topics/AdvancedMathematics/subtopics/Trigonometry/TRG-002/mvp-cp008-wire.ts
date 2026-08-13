import { degree } from "../foundation/angle";
import { assertDefined, divideExact, exactInteger, exactSurd, formatExactPlain, multiplyExact } from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";
import { buildSingleElevationState } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick, type Trg002MvpQuestion } from "./mvp-runtime-core";

export const TRG_002_MVP_CP008_WIRE_IDS = ["TRG-002-QL-048"] as const;
export type Trg002MvpCp008WireId = (typeof TRG_002_MVP_CP008_WIRE_IDS)[number];
const div = (a: ExactTrigNumber, b: ExactTrigNumber) => assertDefined(divideExact(a, b));

export function generateTrg002MvpCp008WireQuestion(_qlId: Trg002MvpCp008WireId, seed: string): Trg002MvpQuestion {
  const height = exactInteger(mvpPick(seed, "048-height", [10, 15, 20] as const));
  const state = buildSingleElevationState({ horizontal: height, angle: degree(45), objectKind: "MAST", scenario: "MAST", units: "m", diagramStrategy: "GUY_WIRE" });
  const anchorGround = state.points.find((item) => item.id === "observer-ground");
  if (anchorGround) anchorGround.role = "ANCHOR";
  state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "observer-ground" };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-048", cpId: "TRG-CP-008", lockedFamily: "GUY_WIRE_MAST_ANCHOR", solveMode: "findAnchorDistanceFromMastHeight",
    seed, difficulty: "Medium", target: "LENGTH",
    stem: `A supporting wire from the top of a ${formatExactPlain(height)} m mast is fixed to the ground and makes a 45° angle with it. Find the horizontal distance of the anchor from the mast.`,
    state, correct: mvpNumberAnswer(height),
    wrong: [
      { value: mvpNumberAnswer(multiplyExact(height, exactSurd(1, 2))), misconceptionId: "CONFUSED_ANCHOR_DISTANCE_WITH_DIAGONAL" },
      { value: mvpNumberAnswer(multiplyExact(height, exactInteger(2))), misconceptionId: "DOUBLED_MAST_HEIGHT" },
      { value: mvpNumberAnswer(div(height, exactInteger(2))), misconceptionId: "HALVED_MAST_HEIGHT" },
    ],
    explanation: mvpExplanation("Use tan45°=mast height/anchor distance.", [`1=${formatExactPlain(height)}/d.`, `Therefore d=${formatExactPlain(height)} m.`], "The question asks for horizontal anchor distance, not the sloping wire length."),
  });
}
