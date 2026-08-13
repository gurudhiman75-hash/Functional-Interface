import { degree } from "../foundation/angle";
import { assertDefined, divideExact, exactInteger, exactSurd, formatExactPlain, multiplyExact } from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";
import { buildLadderState, type Trg002SpatialPoint, type Trg002SpatialState, type Trg002VerticalObject } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick, type Trg002MvpQuestion } from "./mvp-runtime-core";

export const TRG_002_MVP_CP008_SHADOW_LADDER_IDS = ["TRG-002-QL-028", "TRG-002-QL-032", "TRG-002-QL-035", "TRG-002-QL-038"] as const;
export type Trg002MvpCp008ShadowLadderId = (typeof TRG_002_MVP_CP008_SHADOW_LADDER_IDS)[number];
const ZERO = exactInteger(0);
const div = (a: ExactTrigNumber, b: ExactTrigNumber) => assertDefined(divideExact(a, b));
function point(id: string, x: ExactTrigNumber, y: ExactTrigNumber, role: Trg002SpatialPoint["role"], label?: string): Trg002SpatialPoint { return { id, x, y, role, ...(label ? { label } : {}) }; }
function object(id: string, basePointId: string, topPointId: string, height: ExactTrigNumber): Trg002VerticalObject { return { id, kind: "POLE", basePointId, topPointId, height }; }
function shadowState(height: ExactTrigNumber, shadow: ExactTrigNumber, angle: 30 | 45, target: "HEIGHT" | "SHADOW"): Trg002SpatialState {
  return { packageId: "TRG-002", scenario: "SHADOW", groundY: ZERO,
    points: [point("object-base", ZERO, ZERO, "OBJECT_BASE", "B"), point("object-top", ZERO, height, "OBJECT_TOP", "T"), point("shadow-tip", shadow, ZERO, "SHADOW_TIP", "S")],
    verticalObjects: [object("object-1", "object-base", "object-top", height)],
    observers: [{ id: "sun-reference", groundPointId: "shadow-tip", eyePointId: "shadow-tip", eyeHeight: ZERO }],
    observations: [{ id: "obs-sun", observerId: "sun-reference", eyePointId: "shadow-tip", targetPointId: "object-top", classification: "ELEVATION", angle: degree(angle), horizontalReference: "EYE_LEVEL" }],
    movements: [], requested: target === "HEIGHT" ? { kind: "OBJECT_HEIGHT", objectId: "object-1" } : { kind: "SHADOW_LENGTH", objectId: "object-1", shadowTipPointId: "shadow-tip" },
    diagramStrategy: "SHADOW", metadata: { units: "m", sameSide: true } };
}
function ql028(seed: string) {
  const s = exactInteger(mvpPick(seed, "028-s", [9, 14, 18] as const));
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-028", cpId: "TRG-CP-008", lockedFamily: "SHADOW_TO_HEIGHT", solveMode: "findHeightFrom45DegreeShadow", seed, difficulty: "Easy", target: "LENGTH",
    stem: `A vertical pole casts a ${formatExactPlain(s)} m shadow when the sun's angle of elevation is 45°. Find the height of the pole.`, state: shadowState(s, s, 45, "HEIGHT"), correct: mvpNumberAnswer(s),
    wrong: [{ value: mvpNumberAnswer(multiplyExact(s, exactInteger(2))), misconceptionId: "DOUBLED_SHADOW_AT_45" }, { value: mvpNumberAnswer(div(s, exactInteger(2))), misconceptionId: "HALVED_SHADOW_AT_45" }, { value: mvpNumberAnswer(multiplyExact(s, exactSurd(1, 2))), misconceptionId: "USED_SINE_INSTEAD_OF_TANGENT" }],
    explanation: mvpExplanation("At 45°, tan45°=height/shadow=1.", [`1=h/${formatExactPlain(s)}.`, `Hence h=${formatExactPlain(s)} m.`], "Shadow length is the horizontal adjacent side.") });
}
function ql032(seed: string) {
  const h = exactInteger(mvpPick(seed, "032-h", [8, 12, 16] as const));
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-032", cpId: "TRG-CP-008", lockedFamily: "HEIGHT_TO_SHADOW", solveMode: "findShadowAt45Degrees", seed, difficulty: "Easy", target: "LENGTH",
    stem: `A tree is ${formatExactPlain(h)} m high. When the sun's angle of elevation is 45°, find the length of its shadow.`, state: shadowState(h, h, 45, "SHADOW"), correct: mvpNumberAnswer(h),
    wrong: [{ value: mvpNumberAnswer(multiplyExact(h, exactInteger(2))), misconceptionId: "DOUBLED_HEIGHT_FOR_SHADOW" }, { value: mvpNumberAnswer(div(h, exactInteger(2))), misconceptionId: "HALVED_HEIGHT_FOR_SHADOW" }, { value: mvpNumberAnswer(multiplyExact(h, exactSurd(1, 2))), misconceptionId: "USED_COSINE_WITH_HEIGHT" }],
    explanation: mvpExplanation("At 45°, height and shadow are equal legs.", [`tan45°=${formatExactPlain(h)}/s=1.`, `So s=${formatExactPlain(h)} m.`], "The shadow is horizontal, not the sloping solar ray.") });
}
function ql035(seed: string) {
  const h = exactInteger(mvpPick(seed, "035-h", [8, 10, 12] as const)); const oldShadow = h; const newShadow = exactSurd(h, 3);
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-035", cpId: "TRG-CP-008", lockedFamily: "CHANGED_SHADOW", solveMode: "findLongerShadowAfterSolarAngleFalls", seed, difficulty: "Medium", target: "LENGTH",
    stem: `A pole casts a ${formatExactPlain(oldShadow)} m shadow when the sun's elevation is 45°. Later the elevation becomes 30°. Find the new shadow length.`, state: shadowState(h, newShadow, 30, "SHADOW"), correct: mvpNumberAnswer(newShadow),
    wrong: [{ value: mvpNumberAnswer(oldShadow), misconceptionId: "KEPT_SHADOW_UNCHANGED" }, { value: mvpNumberAnswer(multiplyExact(h, exactInteger(3))), misconceptionId: "TRIPLED_OLD_SHADOW" }, { value: mvpNumberAnswer(div(h, exactInteger(2))), misconceptionId: "USED_SINE_FOR_SHADOW" }],
    explanation: mvpExplanation("The pole height stays fixed while the shadow changes.", [`At 45°, pole height=${formatExactPlain(h)} m.`, `At 30°, tan30°=${formatExactPlain(h)}/s, so s=${formatExactPlain(newShadow)} m.`], "A lower sun produces a longer shadow.") });
}
function ql038(seed: string) {
  const L = exactInteger(mvpPick(seed, "038-L", [10, 16, 20] as const)); const state = buildLadderState({ ladderLength: L, angleAtGround: degree(60), units: "m" }); state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "wall-base", toPointId: "ladder-base" }; const d = div(L, exactInteger(2));
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-038", cpId: "TRG-CP-008", lockedFamily: "LADDER_AGAINST_WALL", solveMode: "findLadderFootDistanceFromAngle", seed, difficulty: "Medium", target: "LENGTH",
    stem: `A ${formatExactPlain(L)} m ladder leans against a vertical wall and makes an angle of 60° with the ground. How far is its foot from the wall?`, state, correct: mvpNumberAnswer(d),
    wrong: [{ value: mvpNumberAnswer(L), misconceptionId: "RETURNED_LADDER_LENGTH" }, { value: mvpNumberAnswer(multiplyExact(L, exactSurd(1, 3))), misconceptionId: "RETURNED_VERTICAL_REACH" }, { value: mvpNumberAnswer(multiplyExact(L, exactSurd(1, 2))), misconceptionId: "USED_SQRT2_PATTERN" }],
    explanation: mvpExplanation("The ladder is the hypotenuse and the required ground distance is adjacent to 60°.", [`cos60°=d/${formatExactPlain(L)}=1/2.`, `Thus d=${formatExactPlain(d)} m.`], "Using sine gives the vertical reach, not the foot-to-wall distance.") });
}
export function generateTrg002MvpCp008ShadowLadderQuestion(qlId: Trg002MvpCp008ShadowLadderId, seed: string): Trg002MvpQuestion { switch (qlId) { case "TRG-002-QL-028": return ql028(seed); case "TRG-002-QL-032": return ql032(seed); case "TRG-002-QL-035": return ql035(seed); case "TRG-002-QL-038": return ql038(seed); } }
