import { degree } from "../foundation/angle";
import { addExact, exactInteger, formatExactPlain } from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";
import { buildSingleDepressionState, type Trg002SpatialPoint, type Trg002SpatialState, type Trg002VerticalObject } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick, type Trg002MvpQuestion } from "./mvp-runtime-core";

export const TRG_002_MVP_CP007_B_IDS = ["TRG-002-QL-018", "TRG-002-QL-020"] as const;
export type Trg002MvpCp007BId = (typeof TRG_002_MVP_CP007_B_IDS)[number];
const ZERO = exactInteger(0);
const p = (id: string, x: ExactTrigNumber, y: ExactTrigNumber, role: Trg002SpatialPoint["role"], label: string): Trg002SpatialPoint => ({ id, x, y, role, label });
const vo = (id: string, kind: Trg002VerticalObject["kind"], basePointId: string, topPointId: string, height: ExactTrigNumber): Trg002VerticalObject => ({ id, kind, basePointId, topPointId, height });

function lowerObjectState(observerHeight: ExactTrigNumber, run: ExactTrigNumber, targetHeight: ExactTrigNumber): Trg002SpatialState {
  return {
    packageId: "TRG-002", scenario: "TWO_BUILDINGS", groundY: ZERO,
    points: [p("observer-base", ZERO, ZERO, "OBJECT_BASE", "A"), p("observer-top", ZERO, observerHeight, "OBSERVER_EYE", "E"), p("target-base", run, ZERO, "OBJECT_BASE", "B"), p("target-top", run, targetHeight, "OBJECT_TOP", "T")],
    verticalObjects: [vo("observer-building", "BUILDING", "observer-base", "observer-top", observerHeight), vo("target-object", "POLE", "target-base", "target-top", targetHeight)],
    observers: [{ id: "observer-1", groundPointId: "observer-base", eyePointId: "observer-top", eyeHeight: observerHeight }],
    observations: [{ id: "obs-1", observerId: "observer-1", eyePointId: "observer-top", targetPointId: "target-top", classification: "DEPRESSION", angle: degree(45), horizontalReference: "EYE_LEVEL" }],
    movements: [], requested: { kind: "OBJECT_HEIGHT", objectId: "target-object" }, diagramStrategy: "SINGLE_DEPRESSION", metadata: { units: "m", sameSide: true },
  };
}
function ql018(seed: string) {
  const d = exactInteger(mvpPick(seed, "018-d", [8, 12, 16] as const));
  const targetHeight = exactInteger(mvpPick(seed, "018-target", [10, 14, 18] as const));
  const observerHeight = addExact(targetHeight, d);
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-018", cpId: "TRG-CP-007", lockedFamily: "HEIGHT_FROM_DEPRESSION", solveMode: "findLowerObjectHeightFrom45DegreeDepression", seed, difficulty: "Medium", target: "LENGTH",
    stem: `From the top of a ${formatExactPlain(observerHeight)} m building, the top of a pole ${formatExactPlain(d)} m away is seen at a depression of 45°. Find the pole's height.`, state: lowerObjectState(observerHeight, d, targetHeight), correct: mvpNumberAnswer(targetHeight),
    wrong: [{ value: mvpNumberAnswer(d), misconceptionId: "RETURNED_VERTICAL_DROP" }, { value: mvpNumberAnswer(observerHeight), misconceptionId: "IGNORED_DEPRESSION" }, { value: mvpNumberAnswer(addExact(observerHeight, d)), misconceptionId: "ADDED_DROP" }],
    explanation: mvpExplanation("At 45° depression, vertical drop equals horizontal separation.", [`Vertical drop=${formatExactPlain(d)} m.`, `Pole height=${formatExactPlain(observerHeight)}−${formatExactPlain(d)}=${formatExactPlain(targetHeight)} m.`], "The drop from eye level is not the pole height.") });
}
function ql020(seed: string) {
  const d = exactInteger(mvpPick(seed, "020-d", [9, 12, 15] as const));
  const targetHeight = exactInteger(mvpPick(seed, "020-target", [6, 10, 14] as const));
  const observerHeight = addExact(targetHeight, d);
  const state = buildSingleDepressionState({ horizontal: d, angle: degree(45), observerEyeHeight: observerHeight, targetHeight, units: "m" });
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-020", cpId: "TRG-CP-007", lockedFamily: "DISTANCE_FROM_DEPRESSION", solveMode: "findHorizontalDistanceFromDepressionAndLevels", seed, difficulty: "Medium", target: "LENGTH",
    stem: `From a point ${formatExactPlain(observerHeight)} m above ground, the top of a ${formatExactPlain(targetHeight)} m pole is seen at 45° depression. Find the horizontal distance.`, state, correct: mvpNumberAnswer(d),
    wrong: [{ value: mvpNumberAnswer(observerHeight), misconceptionId: "USED_FULL_OBSERVER_HEIGHT" }, { value: mvpNumberAnswer(targetHeight), misconceptionId: "RETURNED_TARGET_HEIGHT" }, { value: mvpNumberAnswer(addExact(observerHeight, targetHeight)), misconceptionId: "ADDED_LEVELS" }],
    explanation: mvpExplanation("Use the vertical difference between the observer level and target top.", [`Vertical drop=${formatExactPlain(observerHeight)}−${formatExactPlain(targetHeight)}=${formatExactPlain(d)} m.`, `At 45°, horizontal distance=${formatExactPlain(d)} m.`], "Neither full height alone is the opposite side.") });
}

export function generateTrg002MvpCp007BQuestion(qlId: Trg002MvpCp007BId, seed: string): Trg002MvpQuestion {
  return qlId === "TRG-002-QL-018" ? ql018(seed) : ql020(seed);
}
