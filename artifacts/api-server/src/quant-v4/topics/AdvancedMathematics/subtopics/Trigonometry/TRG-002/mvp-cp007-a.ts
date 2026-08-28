import { degree } from "../foundation/angle";
import { assertDefined, divideExact, exactInteger, exactSurd, formatExactPlain, multiplyExact } from "../foundation/exact";
import { requireTrigExact } from "../foundation/standard-values";
import type { ExactTrigNumber } from "../foundation/types";
import { buildSingleElevationState } from "./spatial";
import { buildTrg002MvpQuestion, mvpAngleAnswer, mvpExplanation, mvpNumberAnswer, mvpPick, type Trg002MvpQuestion } from "./mvp-runtime-core";

export const TRG_002_MVP_CP007_A_IDS = ["TRG-002-QL-002", "TRG-002-QL-005", "TRG-002-QL-009", "TRG-002-QL-014"] as const;
export type Trg002MvpCp007AId = (typeof TRG_002_MVP_CP007_A_IDS)[number];
const div = (a: ExactTrigNumber, b: ExactTrigNumber) => assertDefined(divideExact(a, b));
const tan = (a: 30 | 60) => requireTrigExact("TAN", degree(a));
const sin = (a: 30 | 60) => requireTrigExact("SIN", degree(a));

function ql002(seed: string) {
  const d = exactInteger(mvpPick(seed, "002-d", [12, 18, 24] as const));
  const state = buildSingleElevationState({ horizontal: d, angle: degree(45), objectKind: "FLAGPOLE", scenario: "FLAGPOLE", units: "m" });
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-002", cpId: "TRG-CP-007", lockedFamily: "HEIGHT_FROM_ELEVATION", solveMode: "findHeightFrom45DegreeElevation", seed, difficulty: "Easy", target: "LENGTH",
    stem: `From a point ${formatExactPlain(d)} m from a vertical flagpole, its top is seen at an elevation of 45°. Find its height.`, state, correct: mvpNumberAnswer(d),
    wrong: [{ value: mvpNumberAnswer(multiplyExact(d, exactInteger(2))), misconceptionId: "DOUBLED_DISTANCE" }, { value: mvpNumberAnswer(div(d, exactInteger(2))), misconceptionId: "HALVED_EQUAL_LEGS" }, { value: mvpNumberAnswer(multiplyExact(d, exactSurd(1, 2))), misconceptionId: "USED_SINE" }],
    explanation: mvpExplanation("At 45°, tan45°=1, so height equals horizontal distance.", [`tan45°=h/${formatExactPlain(d)}=1.`, `Hence h=${formatExactPlain(d)} m.`], "Use tangent because the given distance is horizontal.") });
}
function ql005(seed: string) {
  const k = mvpPick(seed, "005-k", [8, 10, 12] as const), angle = mvpPick(seed, "005-angle", [30, 60] as const);
  const d = exactInteger(angle === 30 ? 3 * k : k), h = exactSurd(k, 3);
  const state = buildSingleElevationState({ horizontal: d, angle: degree(angle), units: "m" });
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-005", cpId: "TRG-CP-007", lockedFamily: "HEIGHT_FROM_ELEVATION", solveMode: "findExactSurdHeightFromElevation", seed, difficulty: "Medium", target: "LENGTH",
    stem: `From a point ${formatExactPlain(d)} m from a tower, the angle of elevation is ${angle}°. Find the exact height.`, state, correct: mvpNumberAnswer(h),
    wrong: [{ value: mvpNumberAnswer(d), misconceptionId: "TREATED_AS_45" }, { value: mvpNumberAnswer(div(d, tan(angle))), misconceptionId: "INVERTED_TANGENT" }, { value: mvpNumberAnswer(multiplyExact(d, sin(angle))), misconceptionId: "USED_SINE" }],
    explanation: mvpExplanation("Use tanθ=height/horizontal distance.", [`tan${angle}°=h/${formatExactPlain(d)}.`, `So h=${formatExactPlain(h)} m.`], "Keep the exact surd form.") });
}
function ql009(seed: string) {
  const h = exactInteger(mvpPick(seed, "009-h", [14, 20, 26] as const));
  const state = buildSingleElevationState({ horizontal: h, angle: degree(45), objectKind: "POLE", scenario: "POLE", units: "m" });
  state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "observer-ground" };
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-009", cpId: "TRG-CP-007", lockedFamily: "DISTANCE_FROM_ELEVATION", solveMode: "findDistanceAt45Degrees", seed, difficulty: "Easy", target: "LENGTH",
    stem: `A vertical pole is ${formatExactPlain(h)} m high and its top is seen at 45°. Find the horizontal distance to the pole.`, state, correct: mvpNumberAnswer(h),
    wrong: [{ value: mvpNumberAnswer(multiplyExact(h, exactInteger(2))), misconceptionId: "DOUBLED_EQUAL_LEGS" }, { value: mvpNumberAnswer(div(h, exactInteger(2))), misconceptionId: "HALVED_EQUAL_LEGS" }, { value: mvpNumberAnswer(multiplyExact(h, exactSurd(1, 2))), misconceptionId: "USED_COSINE" }],
    explanation: mvpExplanation("At 45°, height equals horizontal distance.", [`1=${formatExactPlain(h)}/d.`, `Hence d=${formatExactPlain(h)} m.`], "The target is horizontal distance, not the sloping side.") });
}
function ql014(seed: string) {
  const side = exactInteger(mvpPick(seed, "014-side", [9, 15, 21] as const));
  const state = buildSingleElevationState({ horizontal: side, angle: degree(45), objectKind: "CHIMNEY", scenario: "CHIMNEY", units: "m" });
  state.requested = { kind: "ANGLE", observationId: "obs-1" };
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-014", cpId: "TRG-CP-007", lockedFamily: "ANGLE_FROM_HEIGHT_DISTANCE", solveMode: "recover45DegreeAngleFromEqualLegs", seed, difficulty: "Easy", target: "ANGLE",
    stem: `A chimney is ${formatExactPlain(side)} m high and an observation point is ${formatExactPlain(side)} m from its foot. Find the angle of elevation.`, state, correct: mvpAngleAnswer(degree(45)),
    wrong: [{ value: mvpAngleAnswer(degree(30)), misconceptionId: "MATCHED_TO_30" }, { value: mvpAngleAnswer(degree(60)), misconceptionId: "MATCHED_TO_60" }, { value: mvpAngleAnswer(degree(90)), misconceptionId: "CONFUSED_VERTICAL_WITH_SIGHT_ANGLE" }],
    explanation: mvpExplanation("Match tanθ=height/distance to a standard exact value.", ["tanθ=1.", "Therefore θ=45°."], "A vertical object does not make the elevation angle 90°.") });
}

export function generateTrg002MvpCp007AQuestion(qlId: Trg002MvpCp007AId, seed: string): Trg002MvpQuestion {
  switch (qlId) { case "TRG-002-QL-002": return ql002(seed); case "TRG-002-QL-005": return ql005(seed); case "TRG-002-QL-009": return ql009(seed); case "TRG-002-QL-014": return ql014(seed); }
}
