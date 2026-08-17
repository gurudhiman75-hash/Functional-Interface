import { degree } from "../foundation/angle";
import { exactInteger, exactSurd, formatExactPlain } from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";
import type { Trg002SpatialPoint, Trg002SpatialState, Trg002VerticalObject } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick, type Trg002MvpQuestion } from "./mvp-runtime-core";

const ZERO = exactInteger(0);
function p(id: string, x: ExactTrigNumber, y: ExactTrigNumber, role: Trg002SpatialPoint["role"], label: string): Trg002SpatialPoint {
  return { id, x, y, role, label };
}
function obj(id: string, kind: Trg002VerticalObject["kind"], basePointId: string, topPointId: string, height: ExactTrigNumber): Trg002VerticalObject {
  return { id, kind, basePointId, topPointId, height };
}

export function generateTrg002ProductionQl089Clean(seed: string): Trg002MvpQuestion {
  const k = mvpPick(seed, "089-k", [8, 10, 12] as const);
  const eye = exactInteger(k);
  const run = exactInteger(k);
  const target = exactInteger(2 * k);
  const state: Trg002SpatialState = {
    packageId: "TRG-002",
    scenario: "TWO_BUILDINGS",
    groundY: ZERO,
    points: [
      p("observer-base", ZERO, ZERO, "OBJECT_BASE", "A"),
      p("observer-top", ZERO, eye, "OBSERVER_EYE", "E"),
      p("target-base", run, ZERO, "OBJECT_BASE", "B"),
      p("target-top", run, target, "OBJECT_TOP", "T"),
    ],
    verticalObjects: [
      obj("observer-building", "BUILDING", "observer-base", "observer-top", eye),
      obj("target-tower", "TOWER", "target-base", "target-top", target),
    ],
    observers: [{ id: "observer-1", groundPointId: "observer-base", eyePointId: "observer-top", eyeHeight: eye }],
    observations: [
      { id: "obs-up", observerId: "observer-1", eyePointId: "observer-top", targetPointId: "target-top", classification: "ELEVATION", angle: degree(45), horizontalReference: "EYE_LEVEL" },
      { id: "obs-down", observerId: "observer-1", eyePointId: "observer-top", targetPointId: "target-base", classification: "DEPRESSION", angle: degree(45), horizontalReference: "EYE_LEVEL" },
    ],
    movements: [],
    requested: { kind: "HORIZONTAL_DISTANCE", fromPointId: "observer-base", toPointId: "target-base" },
    diagramStrategy: "ELEVATION_AND_DEPRESSION",
    metadata: { units: "m", sameSide: true },
  };

  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-089",
    cpId: "TRG-CP-010",
    lockedFamily: "ELEVATION_AND_DEPRESSION",
    solveMode: "findSeparationFromEqualElevationDepression",
    seed,
    difficulty: "Hard",
    target: "LENGTH",
    stem: `From the top of a ${formatExactPlain(eye)} m building, the base of a tower is seen at a depression of 45° and its top at an elevation of 45°. Find the horizontal distance between the building and tower.`,
    state,
    correct: mvpNumberAnswer(run),
    wrong: [
      { value: mvpNumberAnswer(target), misconceptionId: "RETURNED_TOWER_HEIGHT" },
      { value: mvpNumberAnswer(exactInteger(3 * k)), misconceptionId: "ADDED_TOWER_AND_OBSERVER_HEIGHTS" },
      { value: mvpNumberAnswer(exactSurd(k, 2)), misconceptionId: "RETURNED_SIGHT_LINE" },
    ],
    explanation: mvpExplanation(
      "The depression to the tower base fixes the horizontal separation directly.",
      [`For the downward sight line, tan45°=vertical drop/horizontal run.`, `So 1=${formatExactPlain(eye)}/d.`, `Therefore d=${formatExactPlain(run)} m.`],
      "The elevation observation confirms the target top is the same distance above eye level; it is not an extra horizontal distance.",
    ),
  });
}
