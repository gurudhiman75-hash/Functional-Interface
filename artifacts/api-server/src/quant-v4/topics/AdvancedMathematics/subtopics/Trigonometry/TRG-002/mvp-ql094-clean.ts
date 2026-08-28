import { degree } from "../foundation/angle";
import { exactInteger, exactRational, exactSurd, formatExactPlain, multiplyExact } from "../foundation/exact";
import type { Trg002SpatialState } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick } from "./mvp-runtime-core";

export function generateTrg002MvpQl094Clean(seed: string) {
  const k = mvpPick(seed, "094-clean", [8, 10, 12] as const);
  const h = exactInteger(k), w = exactSurd(k, 3), z = exactInteger(0);
  const state: Trg002SpatialState = {
    packageId: "TRG-002", scenario: "RIVER_BANK", groundY: z,
    points: [{ id: "tower-base", x: z, y: z, role: "OBJECT_BASE", label: "B" }, { id: "tower-top", x: z, y: h, role: "OBSERVER_EYE", label: "E" }, { id: "opposite-bank", x: w, y: z, role: "GROUND", label: "P" }],
    verticalObjects: [{ id: "bank-tower", kind: "TOWER", basePointId: "tower-base", topPointId: "tower-top", height: h }],
    observers: [{ id: "observer-1", groundPointId: "tower-base", eyePointId: "tower-top", eyeHeight: h }],
    observations: [{ id: "obs-1", observerId: "observer-1", eyePointId: "tower-top", targetPointId: "opposite-bank", classification: "DEPRESSION", angle: degree(30), horizontalReference: "EYE_LEVEL" }],
    movements: [], requested: { kind: "HORIZONTAL_DISTANCE", fromPointId: "tower-base", toPointId: "opposite-bank" }, diagramStrategy: "RIVER_WIDTH", metadata: { units: "m" }
  };
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-094", cpId: "TRG-CP-010", lockedFamily: "RIVER_WIDTH_HORIZONTAL_SEPARATION", solveMode: "findRiverWidthFrom30DegreeDepression", seed, difficulty: "Medium", target: "LENGTH",
    stem: `A ${k} m tower stands on one river bank. From its top, the point directly opposite on the other bank is seen at a depression of 30°. Find the river width.`,
    state, correct: mvpNumberAnswer(w),
    wrong: [{ value: mvpNumberAnswer(h), misconceptionId: "TREATED_ANGLE_AS_45" }, { value: mvpNumberAnswer(multiplyExact(h, exactInteger(3))), misconceptionId: "USED_THREE_INSTEAD_OF_SQRT3" }, { value: mvpNumberAnswer(multiplyExact(h, exactRational(1, 2))), misconceptionId: "HALVED_HEIGHT" }],
    explanation: mvpExplanation("Use tan30°=vertical height/horizontal width.", [`tan30°=${formatExactPlain(h)}/w.`, `Hence w=${formatExactPlain(w)} m.`], "At 30°, the horizontal width is greater than the tower height."),
  });
}
