import { degree } from "../foundation/angle";
import { addExact, exactInteger, exactRational, exactToNumber, formatExactPlain, multiplyExact, subtractExact } from "../foundation/exact";
import { buildObserverHeightElevationState, buildOppositeSideState } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick, type Trg002MvpQuestion } from "./mvp-runtime-core";

export const TRG_002_MVP_CP010_OBSERVER_OPPOSITE_IDS = ["TRG-002-QL-076", "TRG-002-QL-081"] as const;
export type Trg002MvpCp010ObserverOppositeId = (typeof TRG_002_MVP_CP010_OBSERVER_OPPOSITE_IDS)[number];

function naturalDecimal(value: any) {
  const numeric = exactToNumber(value);
  return Number.isInteger(numeric) ? String(numeric) : numeric.toFixed(1).replace(/\.0$/, "");
}

function ql076(seed: string) {
  const run = exactInteger(mvpPick(seed, "076-run", [10, 12, 15] as const));
  const eye = exactRational(3, 2);
  const state = buildObserverHeightElevationState({ horizontal: run, angle: degree(45), eyeHeight: eye, units: "m" });
  const total = state.verticalObjects[0].height;
  state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "observer-ground" };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-076", cpId: "TRG-CP-010", lockedFamily: "OBSERVER_HEIGHT_CORRECTION", solveMode: "findDistanceWithEyeHeightCorrection",
    seed, difficulty: "Medium", target: "LENGTH",
    stem: `An observer's eye is 1.5 m above the ground. The top of a ${naturalDecimal(total)} m building is seen at an angle of elevation of 45°. Find the horizontal distance from the observer to the building.`,
    state, correct: mvpNumberAnswer(run),
    wrong: [
      { value: mvpNumberAnswer(total), misconceptionId: "USED_FULL_BUILDING_HEIGHT_AS_RISE" },
      { value: mvpNumberAnswer(subtractExact(run, eye)), misconceptionId: "SUBTRACTED_EYE_HEIGHT_TWICE" },
      { value: mvpNumberAnswer(addExact(total, eye)), misconceptionId: "ADDED_EYE_HEIGHT_TO_FULL_HEIGHT" },
    ],
    explanation: mvpExplanation("Tangent uses the rise above eye level, not the full building height.", [`Rise=${naturalDecimal(total)}−1.5=${formatExactPlain(run)} m.`, `At 45°, rise=horizontal distance, so d=${formatExactPlain(run)} m.`], "Subtract the 1.5 m eye height exactly once before applying tangent."),
  });
}

function ql081(seed: string) {
  const sep = exactInteger(mvpPick(seed, "081-sep", [32, 40, 48] as const));
  const state = buildOppositeSideState({ leftAngle: degree(30), rightAngle: degree(60), observerSeparation: sep, units: "m" });
  const height = state.verticalObjects[0].height;
  const nearDistance = multiplyExact(sep, exactRational(1, 4));
  const farDistance = multiplyExact(nearDistance, exactInteger(3));
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-081", cpId: "TRG-CP-010", lockedFamily: "OPPOSITE_SIDE_OBSERVATIONS", solveMode: "findHeightFromUnequalOppositeAngles",
    seed, difficulty: "Hard", target: "LENGTH",
    stem: `Two observation points are ${formatExactPlain(sep)} m apart on opposite sides of a tower. The angle of elevation of the top is 30° at one point and 60° at the other. Find the height of the tower.`,
    state, correct: mvpNumberAnswer(height),
    wrong: [
      { value: mvpNumberAnswer(sep), misconceptionId: "RETURNED_FULL_SEPARATION" },
      { value: mvpNumberAnswer(multiplyExact(sep, exactRational(1, 2))), misconceptionId: "ASSUMED_EQUAL_HALF_DISTANCES" },
      { value: mvpNumberAnswer(nearDistance), misconceptionId: "RETURNED_NEARER_DISTANCE" },
    ],
    explanation: mvpExplanation("Opposite-side distances add to the separation, while the same height satisfies both tangent equations.", [
      `Let x be the distance from the tower to the 30° point and y the distance to the 60° point. Then x+y=${formatExactPlain(sep)}.`,
      "Since h=x tan30°=y tan60°, we get x/√3=y√3, hence x=3y.",
      `Therefore 3y+y=${formatExactPlain(sep)}, so y=${formatExactPlain(nearDistance)} m and x=${formatExactPlain(farDistance)} m.`,
      `Finally h=y tan60°=${formatExactPlain(nearDistance)}√3=${formatExactPlain(height)} m.`,
    ], "With unequal angles, the tower is not midway between the observers; first determine the two unequal ground distances."),
  });
}

export function generateTrg002MvpCp010ObserverOppositeQuestion(qlId: Trg002MvpCp010ObserverOppositeId, seed: string): Trg002MvpQuestion {
  return qlId === "TRG-002-QL-076" ? ql076(seed) : ql081(seed);
}
