import { degree } from "../foundation/angle";
import { exactInteger, exactSurd, formatExactPlain, multiplyExact } from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";
import type { Trg002SpatialPoint, Trg002SpatialState, Trg002VerticalObject } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick, type Trg002MvpQuestion } from "./mvp-runtime-core";

export const TRG_002_MVP_CP010_RIVER_IDS = ["TRG-002-QL-094"] as const;
export type Trg002MvpCp010RiverId = (typeof TRG_002_MVP_CP010_RIVER_IDS)[number];
const ZERO = exactInteger(0);
function p(id: string, x: ExactTrigNumber, y: ExactTrigNumber, role: Trg002SpatialPoint["role"], label: string): Trg002SpatialPoint { return { id, x, y, role, label }; }
function tower(height: ExactTrigNumber): Trg002VerticalObject { return { id: "bank-tower", kind: "TOWER", basePointId: "tower-base", topPointId: "tower-top", height }; }
function stateFor(height: ExactTrigNumber, width: ExactTrigNumber): Trg002SpatialState {
  return { packageId: "TRG-002", scenario: "RIVER_BANK", groundY: ZERO,
    points: [p("tower-base", ZERO, ZERO, "OBJECT_BASE", "B"), p("tower-top", ZERO, height, "OBSERVER_EYE", "E"), p("opposite-bank", width, ZERO, "GROUND", "P")],
    verticalObjects: [tower(height)], observers: [{ id: "observer-1", groundPointId: "tower-base", eyePointId: "tower-top", eyeHeight: height }],
    observations: [{ id: "obs-1", observerId: "observer-1", eyePointId: "tower-top", targetPointId: "opposite-bank", classification: "DEPRESSION", angle: degree(30), horizontalReference: "EYE_LEVEL" }],
    movements: [], requested: { kind: "HORIZONTAL_DISTANCE", fromPointId: "tower-base", toPointId: "opposite-bank" }, diagramStrategy: "RIVER_WIDTH", metadata: { units: "m" } };
}
export function generateTrg002MvpCp010RiverQuestion(_qlId: Trg002MvpCp010RiverId, seed: string): Trg002MvpQuestion {
  const height = exactInteger(mvpPick(seed, "094-height", [8, 10, 12] as const)); const width = exactSurd(height, 3);
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-094", cpId: "TRG-CP-010", lockedFamily: "RIVER_WIDTH_HORIZONTAL_SEPARATION", solveMode: "findRiverWidthFrom30DegreeDepression", seed, difficulty: "Medium", target: "LENGTH",
    stem: `A ${formatExactPlain(height)} m tower stands on one bank of a river. From its top, a point directly opposite on the other bank is seen at a depression of 30°. Find the width of the river.`, state: stateFor(height, width), correct: mvpNumberAnswer(width),
    wrong: [{ value: mvpNumberAnswer(height), misconceptionId: "TREATED_ANGLE_AS_45" }, { value: mvpNumberAnswer(multiplyExact(height, exactInteger(3))), misconceptionId: "USED_THREE_INSTEAD_OF_SQRT3" }, { value: mvpNumberAnswer(multiplyExact(height, exactSurd(1, 3))), misconceptionId: "MULTIPLIED_BY_TAN30_INSTEAD_OF_DIVIDING" }],
    explanation: mvpExplanation("The angle of depression equals the corresponding elevation angle across the horizontal banks.", [`tan30°=${formatExactPlain(height)}/w.`, `Thus w=${formatExactPlain(width)} m.`], "At 30°, the horizontal distance is greater than the vertical height.") });
}
