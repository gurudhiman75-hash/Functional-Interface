import { degree } from "../foundation/angle";
import { exactInteger, exactSurd, formatExactPlain } from "../foundation/exact";
import { buildSingleDepressionState } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick, type Trg002MvpQuestion } from "./mvp-runtime-core";

export function generateTrg002ProductionQl019Clean(seed: string): Trg002MvpQuestion {
  const k = mvpPick(seed, "019-k", [6, 8, 12] as const);
  const run = exactSurd(k, 3);
  const targetHeight = exactInteger(2 * k);
  const observerHeight = exactInteger(3 * k);
  const state = buildSingleDepressionState({
    horizontal: run,
    angle: degree(30),
    observerEyeHeight: observerHeight,
    targetHeight,
    units: "m",
  });
  const ground = state.points.find((item) => item.id === "target-ground");
  const top = state.points.find((item) => item.id === "target");
  if (!ground || !top) throw new Error("TRG-002-QL-019: depression target points missing.");
  ground.role = "OBJECT_BASE";
  top.role = "OBJECT_TOP";
  state.verticalObjects = [{ id: "target-object", kind: "POLE", basePointId: ground.id, topPointId: top.id, height: targetHeight }];
  state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "observer-ground", toPointId: "target-ground" };

  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-019",
    cpId: "TRG-CP-007",
    lockedFamily: "DISTANCE_FROM_DEPRESSION",
    solveMode: "findDistanceFrom30DegreeDepressionBetweenKnownLevels",
    seed,
    difficulty: "Medium",
    target: "LENGTH",
    stem: `From a point ${formatExactPlain(observerHeight)} m above ground, the top of a ${formatExactPlain(targetHeight)} m pole is seen at a depression of 30°. Find the horizontal distance to the pole.`,
    state,
    correct: mvpNumberAnswer(run),
    wrong: [
      { value: mvpNumberAnswer(exactInteger(k)), misconceptionId: "RETURNED_VERTICAL_DROP" },
      { value: mvpNumberAnswer(observerHeight), misconceptionId: "USED_FULL_OBSERVER_HEIGHT" },
      { value: mvpNumberAnswer(targetHeight), misconceptionId: "RETURNED_TARGET_HEIGHT" },
    ],
    explanation: mvpExplanation(
      "First take the difference in levels, then use tan30°.",
      [`Vertical drop=${formatExactPlain(observerHeight)}−${formatExactPlain(targetHeight)}=${k} m.`, `tan30°=${k}/d, so d=${formatExactPlain(run)} m.`],
      "Use the vertical difference, not either full height.",
    ),
  });
}
