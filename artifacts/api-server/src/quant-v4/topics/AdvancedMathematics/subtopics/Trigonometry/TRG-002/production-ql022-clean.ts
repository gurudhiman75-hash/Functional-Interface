import { degree } from "../foundation/angle";
import { exactInteger, exactSurd, formatExactPlain } from "../foundation/exact";
import { buildSingleDepressionState } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick, type Trg002MvpQuestion } from "./mvp-runtime-core";

export function generateTrg002ProductionQl022Clean(seed: string): Trg002MvpQuestion {
  const k = mvpPick(seed, "022-k", [5, 7, 9] as const);
  const run = exactSurd(k, 3);
  const targetHeight = exactInteger(2 * k);
  const observerHeight = exactInteger(5 * k);
  const drop = exactInteger(3 * k);
  const state = buildSingleDepressionState({
    horizontal: run,
    angle: degree(60),
    observerEyeHeight: observerHeight,
    targetHeight,
    units: "m",
  });
  const ground = state.points.find((item) => item.id === "target-ground");
  const top = state.points.find((item) => item.id === "target");
  if (!ground || !top) throw new Error("TRG-002-QL-022: depression target points missing.");
  ground.role = "OBJECT_BASE";
  top.role = "OBJECT_TOP";
  state.verticalObjects = [{ id: "target-object", kind: "POLE", basePointId: ground.id, topPointId: top.id, height: targetHeight }];
  state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "observer-ground", toPointId: "target-ground" };

  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-022",
    cpId: "TRG-CP-007",
    lockedFamily: "DISTANCE_FROM_DEPRESSION",
    solveMode: "findDistanceFrom60DegreeDepressionBetweenKnownLevels",
    seed,
    difficulty: "Medium",
    target: "LENGTH",
    stem: `A ${formatExactPlain(targetHeight)} m pole stands on level ground. From an observation point ${formatExactPlain(observerHeight)} m above the same ground level, its top is viewed at a 60° angle of depression. Determine the horizontal separation between the observation point's vertical projection and the pole.`,
    state,
    correct: mvpNumberAnswer(run),
    wrong: [
      { value: mvpNumberAnswer(drop), misconceptionId: "RETURNED_VERTICAL_DROP" },
      { value: mvpNumberAnswer(exactInteger(k)), misconceptionId: "DIVIDED_BY_THREE_INSTEAD_OF_SQRT3" },
      { value: mvpNumberAnswer(observerHeight), misconceptionId: "USED_FULL_OBSERVER_HEIGHT" },
    ],
    explanation: mvpExplanation(
      "Use the difference in levels as the opposite side of the 60° depression triangle.",
      [`Vertical drop=${formatExactPlain(observerHeight)}−${formatExactPlain(targetHeight)}=${formatExactPlain(drop)} m.`, `Horizontal separation=${formatExactPlain(drop)}/tan60°=${formatExactPlain(run)} m.`],
      "The requested quantity is the ground separation, so use the level difference rather than either full height.",
    ),
  });
}
