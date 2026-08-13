import { degree } from "../foundation/angle";
import { assertDefined, divideExact, exactInteger, exactSurd, formatExactPlain, multiplyExact } from "../foundation/exact";
import { buildLadderState } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick } from "./mvp-runtime-core";

export function generateTrg002MvpQl038Clean(seed: string) {
  const k = mvpPick(seed, "038-clean", [10, 16, 20] as const);
  const length = exactInteger(k);
  const distance = assertDefined(divideExact(length, exactInteger(2)));
  const verticalReach = assertDefined(divideExact(multiplyExact(length, exactSurd(1, 3)), exactInteger(2)));
  const state = buildLadderState({ ladderLength: length, angleAtGround: degree(60), units: "m" });
  state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "wall-base", toPointId: "ladder-base" };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-038", cpId: "TRG-CP-008", lockedFamily: "LADDER_AGAINST_WALL", solveMode: "findLadderFootDistanceFromAngle",
    seed, difficulty: "Medium", target: "LENGTH",
    stem: `A ${formatExactPlain(length)} m ladder leans against a vertical wall and makes an angle of 60° with the ground. How far is its foot from the wall?`,
    state, correct: mvpNumberAnswer(distance),
    wrong: [
      { value: mvpNumberAnswer(length), misconceptionId: "RETURNED_LADDER_LENGTH" },
      { value: mvpNumberAnswer(verticalReach), misconceptionId: "RETURNED_VERTICAL_REACH" },
      { value: mvpNumberAnswer(multiplyExact(length, exactSurd(1, 2))), misconceptionId: "USED_SQRT2_PATTERN" }
    ],
    explanation: mvpExplanation("The ladder is the hypotenuse and the required ground distance is adjacent to 60°.", [`cos60°=d/${formatExactPlain(length)}=1/2.`, `Thus d=${formatExactPlain(distance)} m.`], "Using sine gives the vertical reach, not the foot-to-wall distance."),
  });
}
