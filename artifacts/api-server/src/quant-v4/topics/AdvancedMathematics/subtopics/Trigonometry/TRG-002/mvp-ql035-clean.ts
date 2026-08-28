import { degree } from "../foundation/angle";
import { exactInteger, exactSurd, formatExactPlain, multiplyExact, divideExact, assertDefined } from "../foundation/exact";
import type { Trg002SpatialState } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick } from "./mvp-runtime-core";

export function generateTrg002MvpQl035Clean(seed: string) {
  const k = mvpPick(seed, "035-clean", [8, 10, 12] as const);
  const height = exactInteger(k);
  const oldShadow = height;
  const newShadow = exactSurd(k, 3);
  const zero = exactInteger(0);
  const state: Trg002SpatialState = {
    packageId: "TRG-002",
    scenario: "SHADOW",
    groundY: zero,
    points: [
      { id: "object-base", x: zero, y: zero, role: "OBJECT_BASE", label: "B" },
      { id: "object-top", x: zero, y: height, role: "OBJECT_TOP", label: "T" },
      { id: "shadow-tip-new", x: newShadow, y: zero, role: "SHADOW_TIP", label: "N" },
      { id: "shadow-tip-old", x: oldShadow, y: zero, role: "SHADOW_TIP", label: "O" },
    ],
    verticalObjects: [{ id: "object-1", kind: "POLE", basePointId: "object-base", topPointId: "object-top", height }],
    observers: [
      { id: "new-sun-reference", groundPointId: "shadow-tip-new", eyePointId: "shadow-tip-new", eyeHeight: zero },
      { id: "old-sun-reference", groundPointId: "shadow-tip-old", eyePointId: "shadow-tip-old", eyeHeight: zero },
    ],
    observations: [
      { id: "new-solar-angle", observerId: "new-sun-reference", eyePointId: "shadow-tip-new", targetPointId: "object-top", classification: "ELEVATION", angle: degree(30), horizontalReference: "EYE_LEVEL" },
      { id: "old-solar-angle", observerId: "old-sun-reference", eyePointId: "shadow-tip-old", targetPointId: "object-top", classification: "ELEVATION", angle: degree(45), horizontalReference: "EYE_LEVEL" },
    ],
    movements: [],
    requested: { kind: "SHADOW_LENGTH", objectId: "object-1", shadowTipPointId: "shadow-tip-new" },
    diagramStrategy: "SHADOW",
    metadata: { units: "m", sameSide: true, notes: ["Both old and new solar-angle shadow states are represented canonically."] },
  };
  const half = assertDefined(divideExact(height, exactInteger(2)));
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-035", cpId: "TRG-CP-008", lockedFamily: "CHANGED_SHADOW", solveMode: "findLongerShadowAfterSolarAngleFalls",
    seed, difficulty: "Medium", target: "LENGTH",
    stem: `A pole casts a ${formatExactPlain(oldShadow)} m shadow when the sun's elevation is 45°. Later the elevation becomes 30°. Find the new shadow length.`,
    state,
    correct: mvpNumberAnswer(newShadow),
    wrong: [
      { value: mvpNumberAnswer(oldShadow), misconceptionId: "KEPT_SHADOW_UNCHANGED" },
      { value: mvpNumberAnswer(multiplyExact(height, exactInteger(3))), misconceptionId: "TRIPLED_OLD_SHADOW" },
      { value: mvpNumberAnswer(half), misconceptionId: "HALVED_OLD_SHADOW" }
    ],
    explanation: mvpExplanation("The pole height is unchanged while the shadow changes with the solar angle.", [`At 45°, pole height=${formatExactPlain(oldShadow)} m.`, `At 30°, tan30°=${formatExactPlain(height)}/s, so s=${formatExactPlain(newShadow)} m.`], "A lower sun produces a longer shadow."),
  });
}
