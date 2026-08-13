import { degree } from "../foundation/angle";
import { addExact, exactInteger, exactSurd, formatExactPlain, multiplyExact } from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";
import type { Trg002SpatialPoint, Trg002SpatialState, Trg002VerticalObject } from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick, type Trg002MvpQuestion } from "./mvp-runtime-core";

export const TRG_002_MVP_CP010_BUILDING_SIGHT_IDS = ["TRG-002-QL-086", "TRG-002-QL-091"] as const;
export type Trg002MvpCp010BuildingSightId = (typeof TRG_002_MVP_CP010_BUILDING_SIGHT_IDS)[number];
const ZERO = exactInteger(0);
function p(id: string, x: ExactTrigNumber, y: ExactTrigNumber, role: Trg002SpatialPoint["role"], label: string): Trg002SpatialPoint { return { id, x, y, role, label }; }
function obj(id: string, kind: Trg002VerticalObject["kind"], basePointId: string, topPointId: string, height: ExactTrigNumber): Trg002VerticalObject { return { id, kind, basePointId, topPointId, height }; }

function buildingState(firstHeight: ExactTrigNumber, run: ExactTrigNumber, secondHeight: ExactTrigNumber): Trg002SpatialState {
  return {
    packageId: "TRG-002", scenario: "TWO_BUILDINGS", groundY: ZERO,
    points: [p("first-base", ZERO, ZERO, "OBJECT_BASE", "A"), p("first-top", ZERO, firstHeight, "OBSERVER_EYE", "E"), p("second-base", run, ZERO, "OBJECT_BASE", "B"), p("second-top", run, secondHeight, "OBJECT_TOP", "T")],
    verticalObjects: [obj("building-1", "BUILDING", "first-base", "first-top", firstHeight), obj("building-2", "BUILDING", "second-base", "second-top", secondHeight)],
    observers: [{ id: "observer-1", groundPointId: "first-base", eyePointId: "first-top", eyeHeight: firstHeight }],
    observations: [{ id: "obs-1", observerId: "observer-1", eyePointId: "first-top", targetPointId: "second-top", classification: "ELEVATION", angle: degree(45), horizontalReference: "EYE_LEVEL" }],
    movements: [], requested: { kind: "HORIZONTAL_DISTANCE", fromPointId: "first-base", toPointId: "second-base" }, diagramStrategy: "BUILDING_TO_BUILDING", metadata: { units: "m", sameSide: true },
  };
}
function ql086(seed: string) {
  const h1 = exactInteger(mvpPick(seed, "086-h1", [12, 18, 24] as const));
  const run = exactInteger(mvpPick(seed, "086-run", [8, 10, 14] as const));
  const h2 = addExact(h1, run);
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-086", cpId: "TRG-CP-010", lockedFamily: "BUILDING_TO_BUILDING", solveMode: "findBuildingSeparationFromRoofHeights",
    seed, difficulty: "Medium", target: "LENGTH",
    stem: `Two buildings are ${formatExactPlain(h1)} m and ${formatExactPlain(h2)} m high. From the roof of the shorter building, the top of the taller one is seen at 45°. Find the horizontal distance between them.`,
    state: buildingState(h1, run, h2), correct: mvpNumberAnswer(run),
    wrong: [
      { value: mvpNumberAnswer(h1), misconceptionId: "RETURNED_FIRST_BUILDING_HEIGHT" },
      { value: mvpNumberAnswer(h2), misconceptionId: "RETURNED_SECOND_BUILDING_HEIGHT" },
      { value: mvpNumberAnswer(addExact(h1, h2)), misconceptionId: "ADDED_BUILDING_HEIGHTS" },
    ],
    explanation: mvpExplanation("Use the height difference as the opposite side from the first roof.", [`Vertical rise=${formatExactPlain(h2)}−${formatExactPlain(h1)}=${formatExactPlain(run)} m.`, `At 45°, horizontal distance equals this rise, so d=${formatExactPlain(run)} m.`], "Do not use either full building height as the opposite side."),
  });
}

function sightState(eye: ExactTrigNumber, run: ExactTrigNumber, target: ExactTrigNumber): Trg002SpatialState {
  return {
    packageId: "TRG-002", scenario: "TWO_BUILDINGS", groundY: ZERO,
    points: [p("observer-base", ZERO, ZERO, "OBJECT_BASE", "A"), p("observer-top", ZERO, eye, "OBSERVER_EYE", "E"), p("target-base", run, ZERO, "OBJECT_BASE", "B"), p("target-top", run, target, "OBJECT_TOP", "T")],
    verticalObjects: [obj("observer-building", "BUILDING", "observer-base", "observer-top", eye), obj("target-tower", "TOWER", "target-base", "target-top", target)],
    observers: [{ id: "observer-1", groundPointId: "observer-base", eyePointId: "observer-top", eyeHeight: eye }],
    observations: [
      { id: "obs-up", observerId: "observer-1", eyePointId: "observer-top", targetPointId: "target-top", classification: "ELEVATION", angle: degree(60), horizontalReference: "EYE_LEVEL" },
      { id: "obs-down", observerId: "observer-1", eyePointId: "observer-top", targetPointId: "target-base", classification: "DEPRESSION", angle: degree(30), horizontalReference: "EYE_LEVEL" },
    ],
    movements: [], requested: { kind: "OBJECT_HEIGHT", objectId: "target-tower" }, diagramStrategy: "ELEVATION_AND_DEPRESSION", metadata: { units: "m", sameSide: true },
  };
}
function ql091(seed: string) {
  const eye = exactInteger(mvpPick(seed, "091-eye", [8, 10, 12] as const));
  const run = exactSurd(eye, 3);
  const rise = multiplyExact(eye, exactInteger(3));
  const target = addExact(eye, rise);
  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-091", cpId: "TRG-CP-010", lockedFamily: "ELEVATION_AND_DEPRESSION", solveMode: "findTowerHeightFromUnequalElevationDepression",
    seed, difficulty: "Hard", target: "LENGTH",
    stem: `From the top of a ${formatExactPlain(eye)} m building, the base of a tower is seen at a depression of 30° and its top at an elevation of 60°. Find the height of the tower.`,
    state: sightState(eye, run, target), correct: mvpNumberAnswer(target),
    wrong: [
      { value: mvpNumberAnswer(rise), misconceptionId: "RETURNED_ONLY_RISE_ABOVE_EYE_LEVEL" },
      { value: mvpNumberAnswer(eye), misconceptionId: "RETURNED_OBSERVER_BUILDING_HEIGHT" },
      { value: mvpNumberAnswer(multiplyExact(eye, exactInteger(2))), misconceptionId: "TREATED_BOTH_ANGLES_AS_45" },
    ],
    explanation: mvpExplanation("Use depression to find the common horizontal separation, then elevation for the rise above eye level.", [`From depression, tan30°=${formatExactPlain(eye)}/d, so d=${formatExactPlain(run)} m.`, `Rise above eye level=d tan60°=${formatExactPlain(rise)} m.`, `Tower height=${formatExactPlain(eye)}+${formatExactPlain(rise)}=${formatExactPlain(target)} m.`], "The tower extends both below and above the observer's horizontal level."),
  });
}

export function generateTrg002MvpCp010BuildingSightQuestion(qlId: Trg002MvpCp010BuildingSightId, seed: string): Trg002MvpQuestion {
  return qlId === "TRG-002-QL-086" ? ql086(seed) : ql091(seed);
}
