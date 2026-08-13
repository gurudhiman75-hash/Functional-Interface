import { degree } from "../foundation/angle";
import { exactInteger, exactRational, formatExactPlain, multiplyExact, subtractExact } from "../foundation/exact";
import { buildObserverHeightElevationState, buildOppositeSideState } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick, type Trg002MvpQuestion } from "./mvp-runtime-core";

export const TRG_002_MVP_CP010_OBSERVER_OPPOSITE_IDS = ["TRG-002-QL-076", "TRG-002-QL-081"] as const;
export type Trg002MvpCp010ObserverOppositeId = (typeof TRG_002_MVP_CP010_OBSERVER_OPPOSITE_IDS)[number];

function ql076(seed: string) {
  const run = exactInteger(mvpPick(seed, "076-run", [10, 12, 15] as const));
  const eye = exactRational(3, 2);
  const state = buildObserverHeightElevationState({ horizontal: run, angle: degree(45), eyeHeight: eye, units: "m" });
  const total = state.verticalObjects[0].height;
  state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "observer-ground" };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-076", cpId: "TRG-CP-010", lockedFamily: "OBSERVER_HEIGHT_CORRECTION", solveMode: "findDistanceWithEyeHeightCorrection",
    seed, difficulty: "Medium", target: "LENGTH",
    stem: `An observer's eye is 1.5 m above the ground. The top of a ${formatExactPlain(total)} m building is seen at an elevation of 45°. Find the horizontal distance from the observer to the building.`,
    state, correct: mvpNumberAnswer(run),
    wrong: [
      { value: mvpNumberAnswer(total), misconceptionId: "USED_FULL_BUILDING_HEIGHT_AS_RISE" },
      { value: mvpNumberAnswer(subtractExact(run, eye)), misconceptionId: "SUBTRACTED_EYE_HEIGHT_TWICE" },
      { value: mvpNumberAnswer(multiplyExact(run, exactInteger(2))), misconceptionId: "DOUBLED_HORIZONTAL_DISTANCE" },
    ],
    explanation: mvpExplanation("Tangent uses the rise above eye level, not the full building height.", [`Rise=${formatExactPlain(total)}−1.5=${formatExactPlain(run)} m.`, `At 45°, rise=horizontal distance, so d=${formatExactPlain(run)} m.`], "Apply eye height exactly once before using tangent."),
  });
}

function ql081(seed: string) {
  const sep = exactInteger(mvpPick(seed, "081-sep", [32, 40, 48] as const));
  const state = buildOppositeSideState({ leftAngle: degree(30), rightAngle: degree(60), observerSeparation: sep, units: "m" });
  const height = state.verticalObjects[0].height;
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-081", cpId: "TRG-CP-010", lockedFamily: "OPPOSITE_SIDE_OBSERVATIONS", solveMode: "findHeightFromUnequalOppositeAngles",
    seed, difficulty: "Hard", target: "LENGTH",
    stem: `Two observation points are ${formatExactPlain(sep)} m apart on opposite sides of a tower. The angles of elevation of its top are 30° and 60°. Find the height of the tower.`,
    state, correct: mvpNumberAnswer(height),
    wrong: [
      { value: mvpNumberAnswer(sep), misconceptionId: "RETURNED_FULL_SEPARATION" },
      { value: mvpNumberAnswer(multiplyExact(sep, exactRational(1, 2))), misconceptionId: "ASSUMED_EQUAL_HALF_DISTANCES" },
      { value: mvpNumberAnswer(multiplyExact(sep, exactRational(1, 4))), misconceptionId: "RETURNED_NEARER_DISTANCE_PATTERN" },
    ],
    explanation: mvpExplanation("Opposite-side distances add to the separation, while the same height satisfies both tangent equations.", ["Let the distances from the tower be x and y, so x+y equals the observer separation.", "Use h=x tan30°=y tan60° to relate x and y.", `Solving gives h=${formatExactPlain(height)} m.`], "With unequal angles, the tower is not midway between the observers."),
  });
}

export function generateTrg002MvpCp010ObserverOppositeQuestion(qlId: Trg002MvpCp010ObserverOppositeId, seed: string): Trg002MvpQuestion {
  return qlId === "TRG-002-QL-076" ? ql076(seed) : ql081(seed);
}
