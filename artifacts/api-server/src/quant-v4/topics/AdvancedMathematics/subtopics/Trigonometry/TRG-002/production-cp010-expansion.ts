import { degree } from "../foundation/angle";
import {
  addExact,
  exactInteger,
  exactRational,
  exactSurd,
  exactToNumber,
  formatExactPlain,
  multiplyExact,
  subtractExact,
} from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";
import {
  buildObserverHeightElevationState,
  buildOppositeSideState,
  buildSingleDepressionState,
  type Trg002SpatialPoint,
  type Trg002SpatialState,
  type Trg002VerticalObject,
} from "./spatial";
import {
  buildTrg002MvpQuestion,
  mvpExplanation,
  mvpNumberAnswer,
  mvpPick,
  type Trg002MvpQuestion,
} from "./mvp-runtime-core";

export const TRG_002_PRODUCTION_CP010_EXPANSION_IDS = [
  "TRG-002-QL-074", "TRG-002-QL-075", "TRG-002-QL-077",
  "TRG-002-QL-079", "TRG-002-QL-080", "TRG-002-QL-082",
  "TRG-002-QL-084", "TRG-002-QL-085", "TRG-002-QL-087",
  "TRG-002-QL-089", "TRG-002-QL-090",
  "TRG-002-QL-093",
] as const;
export type Trg002ProductionCp010ExpansionId = (typeof TRG_002_PRODUCTION_CP010_EXPANSION_IDS)[number];

const ZERO = exactInteger(0);
function natural(value: ExactTrigNumber) {
  const numeric = exactToNumber(value);
  return Number.isInteger(numeric) ? String(numeric) : numeric.toFixed(1).replace(/\.0$/, "");
}
function p(id: string, x: ExactTrigNumber, y: ExactTrigNumber, role: Trg002SpatialPoint["role"], label: string): Trg002SpatialPoint { return { id, x, y, role, label }; }
function obj(id: string, kind: Trg002VerticalObject["kind"], basePointId: string, topPointId: string, height: ExactTrigNumber): Trg002VerticalObject { return { id, kind, basePointId, topPointId, height }; }

function ql074(seed: string) {
  const k = mvpPick(seed, "074-k", [6, 8, 10] as const);
  const eye = exactRational(3, 2), run = exactSurd(k, 3);
  const state = buildObserverHeightElevationState({ horizontal: run, angle: degree(30), eyeHeight: eye, units: "m" });
  const total = state.verticalObjects[0].height;
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-074", cpId: "TRG-CP-010", lockedFamily: "OBSERVER_HEIGHT_CORRECTION", solveMode: "findTotalHeightWithEyeLevelAt30Degrees", seed, difficulty: "Medium", target: "LENGTH",
    stem: `An observer's eye is 1.5 m above the ground and is ${formatExactPlain(run)} m horizontally from a building. The top is seen at 30°. Find the building's height.`, state, correct: mvpNumberAnswer(total),
    wrong: [{ value: mvpNumberAnswer(exactInteger(k)), misconceptionId: "OMITTED_EYE_HEIGHT" }, { value: mvpNumberAnswer(run), misconceptionId: "RETURNED_HORIZONTAL_DISTANCE" }, { value: mvpNumberAnswer(addExact(total, eye)), misconceptionId: "ADDED_EYE_HEIGHT_TWICE" }],
    explanation: mvpExplanation("Tangent gives the rise above eye level; add eye height once for total building height.", [`Rise=${formatExactPlain(run)}×tan30°=${k} m.`, `Total height=${k}+1.5=${natural(total)} m.`], "Eye height is part of the final total but must not be counted twice."),
  });
}

function ql075(seed: string) {
  const k = mvpPick(seed, "075-k", [8, 10, 12] as const);
  const eye = exactRational(3, 2), run = exactInteger(k);
  const state = buildObserverHeightElevationState({ horizontal: run, angle: degree(45), eyeHeight: eye, units: "m" });
  const total = state.verticalObjects[0].height;
  state.requested = { kind: "EYE_HEIGHT", observerId: "observer-1" };
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-075", cpId: "TRG-CP-010", lockedFamily: "OBSERVER_HEIGHT_CORRECTION", solveMode: "recoverObserverEyeHeightFromTotalHeight", seed, difficulty: "Medium", target: "LENGTH",
    stem: `A building is ${natural(total)} m high. From an observer ${formatExactPlain(run)} m from its foot, the top is seen at 45°. Find the observer's eye height above the ground.`, state, correct: mvpNumberAnswer(eye),
    wrong: [{ value: mvpNumberAnswer(run), misconceptionId: "RETURNED_RISE_ABOVE_EYE_LEVEL" }, { value: mvpNumberAnswer(total), misconceptionId: "RETURNED_BUILDING_HEIGHT" }, { value: mvpNumberAnswer(exactInteger(3)), misconceptionId: "DOUBLED_EYE_HEIGHT" }],
    explanation: mvpExplanation("At 45°, the rise from eye level to the top equals the horizontal distance.", [`Rise above eye=${formatExactPlain(run)} m.`, `Eye height=${natural(total)}−${formatExactPlain(run)}=${natural(eye)} m.`], "Subtract the trigonometric rise from the total height; do not subtract eye height twice."),
  });
}

function ql077(seed: string) {
  const k = mvpPick(seed, "077-k", [5, 7, 9] as const);
  const eye = exactInteger(2), run = exactInteger(k);
  const state = buildObserverHeightElevationState({ horizontal: run, angle: degree(60), eyeHeight: eye, units: "m" });
  const total = state.verticalObjects[0].height;
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-077", cpId: "TRG-CP-010", lockedFamily: "OBSERVER_HEIGHT_CORRECTION", solveMode: "findTotalHeightWithEyeLevelAt60Degrees", seed, difficulty: "Medium", target: "LENGTH",
    stem: `An observer's eye is 2 m above level ground and ${formatExactPlain(run)} m from a tower. The top is seen at 60°. Find the tower's exact height.`, state, correct: mvpNumberAnswer(total),
    wrong: [{ value: mvpNumberAnswer(exactSurd(k, 3)), misconceptionId: "OMITTED_EYE_HEIGHT" }, { value: mvpNumberAnswer(run), misconceptionId: "RETURNED_HORIZONTAL_DISTANCE" }, { value: mvpNumberAnswer(addExact(total, eye)), misconceptionId: "ADDED_EYE_HEIGHT_TWICE" }],
    explanation: mvpExplanation("Find the rise above the eye using tan60°, then add the 2 m eye height.", [`Rise=${formatExactPlain(run)}√3=${formatExactPlain(exactSurd(k, 3))} m.`, `Tower height=${formatExactPlain(total)} m.`], "The tangent triangle begins at eye level, not at ground level."),
  });
}

function ql079(seed: string) {
  const k = mvpPick(seed, "079-k", [8, 10, 12] as const);
  const sep = exactInteger(2 * k);
  const state = buildOppositeSideState({ leftAngle: degree(45), rightAngle: degree(45), observerSeparation: sep, units: "m" });
  const height = state.verticalObjects[0].height;
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-079", cpId: "TRG-CP-010", lockedFamily: "OPPOSITE_SIDE_OBSERVATIONS", solveMode: "findHeightFromEqual45DegreeOppositeSides", seed, difficulty: "Medium", target: "LENGTH",
    stem: `Two observation points are ${formatExactPlain(sep)} m apart on opposite sides of a tower. The angle of elevation of its top is 45° from each point. Find the tower's height.`, state, correct: mvpNumberAnswer(height),
    wrong: [{ value: mvpNumberAnswer(sep), misconceptionId: "RETURNED_FULL_OBSERVER_SEPARATION" }, { value: mvpNumberAnswer(exactSurd(k, 2)), misconceptionId: "RETURNED_SIGHT_LINE" }, { value: mvpNumberAnswer(exactInteger(3 * k)), misconceptionId: "ADDED_HALF_DISTANCE_TO_HEIGHT" }],
    explanation: mvpExplanation("Equal 45° angles place the tower midway between the opposite-side observers.", [`Each ground distance=${formatExactPlain(sep)}/2=${k} m.`, `At 45°, height=${k} m.`], "Opposite-side distances add to the full separation; they do not both equal it."),
  });
}

function ql080(seed: string) {
  const k = mvpPick(seed, "080-k", [8, 10, 12] as const);
  const sep = exactInteger(4 * k), near = exactInteger(k), far = exactInteger(3 * k);
  const state = buildOppositeSideState({ leftAngle: degree(30), rightAngle: degree(60), observerSeparation: sep, units: "m" });
  state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "right-ground" };
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-080", cpId: "TRG-CP-010", lockedFamily: "OPPOSITE_SIDE_OBSERVATIONS", solveMode: "findNearDistanceIn30And60OppositeSystem", seed, difficulty: "Hard", target: "LENGTH",
    stem: `Two points ${formatExactPlain(sep)} m apart lie on opposite sides of a tower. The elevation angles are 30° and 60°. Find the distance from the tower to the point where the angle is 60°.`, state, correct: mvpNumberAnswer(near),
    wrong: [{ value: mvpNumberAnswer(far), misconceptionId: "RETURNED_30_DEGREE_DISTANCE" }, { value: mvpNumberAnswer(sep), misconceptionId: "RETURNED_TOTAL_SEPARATION" }, { value: mvpNumberAnswer(exactInteger(2 * k)), misconceptionId: "ASSUMED_TOWER_AT_MIDPOINT" }],
    explanation: mvpExplanation("Let the 60° side distance be y and the 30° side distance be x; opposite-side distances add.", [`h=x tan30°=y tan60° gives x=3y.`, `x+y=${formatExactPlain(sep)}, so 4y=${formatExactPlain(sep)}.`, `Thus y=${formatExactPlain(near)} m.`], "The larger angle belongs to the nearer observation point."),
  });
}

function ql082(seed: string) {
  const k = mvpPick(seed, "082-k", [8, 10, 12] as const);
  const sep = exactInteger(4 * k), near = exactInteger(k), far = exactInteger(3 * k);
  const state = buildOppositeSideState({ leftAngle: degree(30), rightAngle: degree(60), observerSeparation: sep, units: "m" });
  state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "left-ground", toPointId: "object-base" };
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-082", cpId: "TRG-CP-010", lockedFamily: "OPPOSITE_SIDE_OBSERVATIONS", solveMode: "findFarDistanceIn30And60OppositeSystem", seed, difficulty: "Hard", target: "LENGTH",
    stem: `Two observation points are ${formatExactPlain(sep)} m apart on opposite sides of a tower. Their elevation angles are 30° and 60°. Find the distance from the tower to the 30° observation point.`, state, correct: mvpNumberAnswer(far),
    wrong: [{ value: mvpNumberAnswer(near), misconceptionId: "RETURNED_60_DEGREE_DISTANCE" }, { value: mvpNumberAnswer(sep), misconceptionId: "RETURNED_FULL_SEPARATION" }, { value: mvpNumberAnswer(exactInteger(2 * k)), misconceptionId: "ASSUMED_EQUAL_SIDE_DISTANCES" }],
    explanation: mvpExplanation("The same tower height makes the 30° ground distance three times the 60° distance.", [`Let 60° distance=y; then 30° distance=3y.`, `3y+y=${formatExactPlain(sep)}, so y=${formatExactPlain(near)} m.`, `Therefore the 30° distance=${formatExactPlain(far)} m.`], "Use addition across opposite sides; the tower lies between the two observers."),
  });
}

function buildingState(input: { firstHeight: ExactTrigNumber; run: ExactTrigNumber; secondHeight: ExactTrigNumber; angle: 30 | 45 | 60; classification: "ELEVATION" | "DEPRESSION"; requested: "SECOND_HEIGHT" | "DISTANCE"; }): Trg002SpatialState {
  return {
    packageId: "TRG-002", scenario: "TWO_BUILDINGS", groundY: ZERO,
    points: [p("first-base", ZERO, ZERO, "OBJECT_BASE", "A"), p("first-top", ZERO, input.firstHeight, "OBSERVER_EYE", "E"), p("second-base", input.run, ZERO, "OBJECT_BASE", "B"), p("second-top", input.run, input.secondHeight, "OBJECT_TOP", "T")],
    verticalObjects: [obj("building-1", "BUILDING", "first-base", "first-top", input.firstHeight), obj("building-2", "BUILDING", "second-base", "second-top", input.secondHeight)],
    observers: [{ id: "observer-1", groundPointId: "first-base", eyePointId: "first-top", eyeHeight: input.firstHeight }],
    observations: [{ id: "obs-1", observerId: "observer-1", eyePointId: "first-top", targetPointId: "second-top", classification: input.classification, angle: degree(input.angle), horizontalReference: "EYE_LEVEL" }],
    movements: [],
    requested: input.requested === "SECOND_HEIGHT" ? { kind: "OBJECT_HEIGHT", objectId: "building-2" } : { kind: "HORIZONTAL_DISTANCE", fromPointId: "first-base", toPointId: "second-base" },
    diagramStrategy: "BUILDING_TO_BUILDING", metadata: { units: "m", sameSide: true },
  };
}

function ql084(seed: string) {
  const k = mvpPick(seed, "084-k", [6, 8, 10] as const);
  const first = exactInteger(2 * k), run = exactSurd(k, 3), second = exactInteger(3 * k);
  const state = buildingState({ firstHeight: first, run, secondHeight: second, angle: 30, classification: "ELEVATION", requested: "SECOND_HEIGHT" });
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-084", cpId: "TRG-CP-010", lockedFamily: "BUILDING_TO_BUILDING", solveMode: "findSecondBuildingHeightFrom30DegreeRoofView", seed, difficulty: "Hard", target: "LENGTH",
    stem: `From the roof of a ${formatExactPlain(first)} m building, the top of another building ${formatExactPlain(run)} m away is seen at an elevation of 30°. Find the height of the second building.`, state, correct: mvpNumberAnswer(second),
    wrong: [{ value: mvpNumberAnswer(exactInteger(k)), misconceptionId: "RETURNED_ONLY_RISE" }, { value: mvpNumberAnswer(first), misconceptionId: "RETURNED_FIRST_BUILDING_HEIGHT" }, { value: mvpNumberAnswer(addExact(second, first)), misconceptionId: "ADDED_FULL_BUILDING_HEIGHTS" }],
    explanation: mvpExplanation("Find the rise above the first roof, then add the first building's height.", [`Rise=${formatExactPlain(run)}×tan30°=${k} m.`, `Second building height=${formatExactPlain(first)}+${k}=${formatExactPlain(second)} m.`], "The tangent triangle starts at the roof level, so the rise is not the total second height."),
  });
}

function ql085(seed: string) {
  const k = mvpPick(seed, "085-k", [5, 7, 9] as const);
  const first = exactInteger(4 * k), run = exactSurd(k, 3), second = exactInteger(k);
  const state = buildingState({ firstHeight: first, run, secondHeight: second, angle: 60, classification: "DEPRESSION", requested: "SECOND_HEIGHT" });
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-085", cpId: "TRG-CP-010", lockedFamily: "BUILDING_TO_BUILDING", solveMode: "findShorterBuildingHeightFrom60DegreeRoofDepression", seed, difficulty: "Hard", target: "LENGTH",
    stem: `From the roof of a ${formatExactPlain(first)} m building, the top of a shorter building ${formatExactPlain(run)} m away is seen at a depression of 60°. Find the shorter building's height.`, state, correct: mvpNumberAnswer(second),
    wrong: [{ value: mvpNumberAnswer(exactInteger(3 * k)), misconceptionId: "RETURNED_VERTICAL_DROP" }, { value: mvpNumberAnswer(first), misconceptionId: "RETURNED_TALLER_BUILDING_HEIGHT" }, { value: mvpNumberAnswer(exactInteger(7 * k)), misconceptionId: "ADDED_DROP_INSTEAD_OF_SUBTRACTING" }],
    explanation: mvpExplanation("Depression gives the vertical drop from the taller roof to the shorter roof.", [`Drop=${formatExactPlain(run)}×tan60°=${3 * k} m.`, `Shorter height=${formatExactPlain(first)}−${3 * k}=${formatExactPlain(second)} m.`], "A depression angle means the target roof is below the observer's horizontal level."),
  });
}

function ql087(seed: string) {
  const k = mvpPick(seed, "087-k", [6, 8, 10] as const);
  const first = exactInteger(2 * k), run = exactInteger(k), second = addExact(first, exactSurd(k, 3));
  const state = buildingState({ firstHeight: first, run, secondHeight: second, angle: 60, classification: "ELEVATION", requested: "DISTANCE" });
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-087", cpId: "TRG-CP-010", lockedFamily: "BUILDING_TO_BUILDING", solveMode: "findBuildingSeparationFrom60DegreeRoofView", seed, difficulty: "Hard", target: "LENGTH",
    stem: `Two buildings are ${formatExactPlain(first)} m and ${formatExactPlain(second)} m high. From the roof of the shorter building, the top of the taller one is seen at 60°. Find their horizontal separation.`, state, correct: mvpNumberAnswer(run),
    wrong: [{ value: mvpNumberAnswer(exactSurd(k, 3)), misconceptionId: "RETURNED_HEIGHT_DIFFERENCE" }, { value: mvpNumberAnswer(first), misconceptionId: "RETURNED_SHORTER_HEIGHT" }, { value: mvpNumberAnswer(second), misconceptionId: "RETURNED_TALLER_HEIGHT" }],
    explanation: mvpExplanation("Use only the height difference as the opposite side of the roof-level triangle.", [`Rise=${formatExactPlain(second)}−${formatExactPlain(first)}=${formatExactPlain(exactSurd(k, 3))} m.`, `d=rise/tan60°=${formatExactPlain(run)} m.`], "Do not use either full building height as the trigonometric rise."),
  });
}

function elevationDepressionState(input: { eye: ExactTrigNumber; run: ExactTrigNumber; targetHeight: ExactTrigNumber; depression: 30 | 45 | 60; elevation: 30 | 45 | 60; requested: "TARGET_HEIGHT" | "DISTANCE" | "EYE_HEIGHT"; }): Trg002SpatialState {
  const state: Trg002SpatialState = {
    packageId: "TRG-002", scenario: "TWO_BUILDINGS", groundY: ZERO,
    points: [p("observer-base", ZERO, ZERO, "OBJECT_BASE", "A"), p("observer-top", ZERO, input.eye, "OBSERVER_EYE", "E"), p("target-base", input.run, ZERO, "OBJECT_BASE", "B"), p("target-top", input.run, input.targetHeight, "OBJECT_TOP", "T")],
    verticalObjects: [obj("observer-building", "BUILDING", "observer-base", "observer-top", input.eye), obj("target-tower", "TOWER", "target-base", "target-top", input.targetHeight)],
    observers: [{ id: "observer-1", groundPointId: "observer-base", eyePointId: "observer-top", eyeHeight: input.eye }],
    observations: [
      { id: "obs-up", observerId: "observer-1", eyePointId: "observer-top", targetPointId: "target-top", classification: "ELEVATION", angle: degree(input.elevation), horizontalReference: "EYE_LEVEL" },
      { id: "obs-down", observerId: "observer-1", eyePointId: "observer-top", targetPointId: "target-base", classification: "DEPRESSION", angle: degree(input.depression), horizontalReference: "EYE_LEVEL" },
    ],
    movements: [], requested: { kind: "OBJECT_HEIGHT", objectId: "target-tower" }, diagramStrategy: "ELEVATION_AND_DEPRESSION", metadata: { units: "m", sameSide: true },
  };
  if (input.requested === "DISTANCE") state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "observer-base", toPointId: "target-base" };
  if (input.requested === "EYE_HEIGHT") state.requested = { kind: "EYE_HEIGHT", observerId: "observer-1" };
  return state;
}

function ql089(seed: string) {
  const k = mvpPick(seed, "089-k", [8, 10, 12] as const);
  const eye = exactInteger(k), run = exactInteger(k), target = exactInteger(2 * k);
  const state = elevationDepressionState({ eye, run, targetHeight: target, depression: 45, elevation: 45, requested: "DISTANCE" });
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-089", cpId: "TRG-CP-010", lockedFamily: "ELEVATION_AND_DEPRESSION", solveMode: "findSeparationFromEqualElevationDepression", seed, difficulty: "Hard", target: "LENGTH",
    stem: `From the top of a ${formatExactPlain(eye)} m building, the base of a tower is seen at a depression of 45° and its top at an elevation of 45°. Find the horizontal distance between the building and tower.`, state, correct: mvpNumberAnswer(run),
    wrong: [{ value: mvpNumberAnswer(target), misconceptionId: "RETURNED_TOWER_HEIGHT" }, { value: mvpNumberAnswer(exactInteger(2 * k)), misconceptionId: "ADDED_EQUAL_VERTICAL_PARTS" }, { value: mvpNumberAnswer(exactSurd(k, 2)), misconceptionId: "RETURNED_SIGHT_LINE" }],
    explanation: mvpExplanation("The depression to the tower base alone fixes the horizontal separation.", [`tan45°=${formatExactPlain(eye)}/d=1.`, `Therefore d=${formatExactPlain(run)} m.`], "The elevation observation is consistent with the same run but is not an additional distance to add."),
  });
}

function ql090(seed: string) {
  const k = mvpPick(seed, "090-k", [6, 8, 10] as const);
  const eye = exactInteger(k), run = exactSurd(k, 3), target = exactInteger(4 * k);
  const state = elevationDepressionState({ eye, run, targetHeight: target, depression: 30, elevation: 60, requested: "EYE_HEIGHT" });
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-090", cpId: "TRG-CP-010", lockedFamily: "ELEVATION_AND_DEPRESSION", solveMode: "recoverObserverBuildingHeightFrom30And60SightLines", seed, difficulty: "Hard", target: "LENGTH",
    stem: `From the roof of a building, the base of a ${formatExactPlain(target)} m tower is seen at a depression of 30° and its top at an elevation of 60°. Find the height of the observer's building.`, state, correct: mvpNumberAnswer(eye),
    wrong: [{ value: mvpNumberAnswer(exactInteger(3 * k)), misconceptionId: "RETURNED_RISE_ABOVE_ROOF" }, { value: mvpNumberAnswer(run), misconceptionId: "RETURNED_HORIZONTAL_SEPARATION" }, { value: mvpNumberAnswer(target), misconceptionId: "RETURNED_TOWER_HEIGHT" }],
    explanation: mvpExplanation("The same horizontal separation links the downward and upward sight lines.", [`If observer height=h and separation=d, tan30°=h/d gives d=h√3.`, `The rise to the tower top is d tan60°=3h.`, `Tower height=h+3h=4h=${formatExactPlain(target)}, so h=${formatExactPlain(eye)} m.`], "The tower height contains both the part below and the part above the observer's roof level."),
  });
}

function ql093(seed: string) {
  const k = mvpPick(seed, "093-k", [8, 10, 12] as const);
  const width = exactInteger(k), eye = exactSurd(k, 3);
  const state = buildSingleDepressionState({ horizontal: width, angle: degree(60), observerEyeHeight: eye, targetHeight: ZERO, units: "m" });
  state.scenario = "RIVER_BANK";
  state.diagramStrategy = "RIVER_WIDTH";
  return buildTrg002MvpQuestion({ qlId: "TRG-002-QL-093", cpId: "TRG-CP-010", lockedFamily: "RIVER_WIDTH_HORIZONTAL_SEPARATION", solveMode: "findRiverWidthFrom60DegreeDepression", seed, difficulty: "Medium", target: "LENGTH",
    stem: `From a point ${formatExactPlain(eye)} m above one river bank, a point directly opposite on the other bank is seen at a depression of 60°. Find the width of the river.`, state, correct: mvpNumberAnswer(width),
    wrong: [{ value: mvpNumberAnswer(eye), misconceptionId: "RETURNED_OBSERVER_HEIGHT" }, { value: mvpNumberAnswer(exactInteger(3 * k)), misconceptionId: "MULTIPLIED_BY_SQRT3" }, { value: mvpNumberAnswer(exactInteger(2 * k)), misconceptionId: "USED_SINE_RATIO" }],
    explanation: mvpExplanation("River width is the horizontal adjacent side of the depression triangle.", [`tan60°=${formatExactPlain(eye)}/w.`, `Thus w=${formatExactPlain(width)} m.`], "Use the horizontal separation between banks, not the sloping line of sight."),
  });
}

export function generateTrg002ProductionCp010ExpansionQuestion(qlId: Trg002ProductionCp010ExpansionId, seed: string): Trg002MvpQuestion {
  switch (qlId) {
    case "TRG-002-QL-074": return ql074(seed);
    case "TRG-002-QL-075": return ql075(seed);
    case "TRG-002-QL-077": return ql077(seed);
    case "TRG-002-QL-079": return ql079(seed);
    case "TRG-002-QL-080": return ql080(seed);
    case "TRG-002-QL-082": return ql082(seed);
    case "TRG-002-QL-084": return ql084(seed);
    case "TRG-002-QL-085": return ql085(seed);
    case "TRG-002-QL-087": return ql087(seed);
    case "TRG-002-QL-089": return ql089(seed);
    case "TRG-002-QL-090": return ql090(seed);
    case "TRG-002-QL-093": return ql093(seed);
  }
}
