import { degree } from "../foundation/angle";
import { exactInteger, exactSurd, formatExactPlain, multiplyExact, assertDefined, divideExact } from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";
import { buildSingleDepressionState } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick, type Trg002MvpQuestion } from "./mvp-runtime-core";

const div = (a: ExactTrigNumber, b: ExactTrigNumber) => assertDefined(divideExact(a, b));

export function generateTrg002ProductionQl021Clean(seed: string): Trg002MvpQuestion {
  const scalar = mvpPick(seed, "021-run", [12, 16, 20] as const);
  const run = exactInteger(scalar);
  const state = buildSingleDepressionState({
    horizontal: run,
    angle: degree(45),
    observerEyeHeight: run,
    targetHeight: exactInteger(0),
    units: "m",
  });

  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-021",
    cpId: "TRG-CP-007",
    lockedFamily: "DISTANCE_FROM_DEPRESSION",
    solveMode: "findGroundDistanceFrom45DegreeDepression",
    seed,
    difficulty: "Easy",
    target: "LENGTH",
    stem: `From the top of a ${formatExactPlain(run)} m building, a point on level ground is seen at an angle of depression of 45°. Find the horizontal distance of the point from the building.`,
    state,
    correct: mvpNumberAnswer(run),
    wrong: [
      { value: mvpNumberAnswer(multiplyExact(run, exactInteger(2))), misconceptionId: "DOUBLED_EQUAL_LEGS" },
      { value: mvpNumberAnswer(div(run, exactInteger(2))), misconceptionId: "HALVED_EQUAL_LEGS" },
      { value: mvpNumberAnswer(exactSurd(scalar, 2)), misconceptionId: "RETURNED_SIGHT_LINE" },
    ],
    explanation: mvpExplanation(
      "At 45°, the vertical drop and horizontal run are equal.",
      [`tan45°=${formatExactPlain(run)}/d=1.`, `Therefore d=${formatExactPlain(run)} m.`],
      "The horizontal distance is not the sloping line of sight.",
    ),
  });
}
