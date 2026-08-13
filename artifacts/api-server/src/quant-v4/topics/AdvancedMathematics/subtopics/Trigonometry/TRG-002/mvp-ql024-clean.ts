import { degree } from "../foundation/angle";
import { exactInteger, exactSurd, formatExactPlain } from "../foundation/exact";
import { buildSingleElevationState } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick } from "./mvp-runtime-core";

export function generateTrg002MvpQl024Clean(seed: string) {
  const k = mvpPick(seed, "024-clean", [8, 10, 12] as const);
  const height = exactInteger(k);
  const horizontal = exactSurd(k, 3);
  const sloping = exactInteger(2 * k);
  const state = buildSingleElevationState({ horizontal, angle: degree(30), objectKind: "BUILDING", scenario: "BUILDING", units: "m" });
  state.requested = { kind: "SIGHT_LINE_LENGTH", fromPointId: "observer-eye", toPointId: "object-top" };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-024", cpId: "TRG-CP-007", lockedFamily: "REVERSE_SINGLE_OBSERVATION", solveMode: "findSlopingDistanceFromHeightAndElevation",
    seed, difficulty: "Medium", target: "LENGTH",
    stem: `The top of a ${formatExactPlain(height)} m building is observed at an elevation of 30°. Find the sloping distance from the observer to the top.`,
    state, correct: mvpNumberAnswer(sloping),
    wrong: [
      { value: mvpNumberAnswer(height), misconceptionId: "RETURNED_VERTICAL_HEIGHT" },
      { value: mvpNumberAnswer(horizontal), misconceptionId: "RETURNED_HORIZONTAL_DISTANCE" },
      { value: mvpNumberAnswer(exactInteger(3 * k)), misconceptionId: "TRIPLED_HEIGHT" }
    ],
    explanation: mvpExplanation("The vertical height is opposite 30° and the required sloping distance is the hypotenuse.", [`sin30°=${formatExactPlain(height)}/L=1/2.`, `Therefore L=${formatExactPlain(sloping)} m.`], "The sloping distance must be longer than the vertical height."),
  });
}
