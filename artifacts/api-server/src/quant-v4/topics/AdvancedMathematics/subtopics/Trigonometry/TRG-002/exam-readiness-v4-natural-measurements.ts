import { degree } from "../foundation/angle";
import {
  addExact,
  exactInteger,
  exactRational,
  exactSurd,
  formatExactPlain,
  multiplyExact,
  subtractExact,
} from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";
import {
  buildLadderState,
  buildObserverHeightElevationState,
  buildSingleElevationState,
  type Trg002SpatialPoint,
  type Trg002SpatialState,
  type Trg002VerticalObject,
} from "./spatial";
import {
  buildTrg002MvpQuestion,
  mvpAngleAnswer,
  mvpExplanation,
  mvpNumberAnswer,
  mvpPick,
  type Trg002MvpQuestion,
} from "./mvp-runtime-core";
import type { Trg002ExamRealnessLocale } from "./localization-exam-realness-v2";
import type { Trg002SpatialTopology } from "./exam-readiness-v4-scenario-engine";

export const TRG_002_V4_NATURAL_MEASUREMENT_IDS = [
  "TRG-002-QL-006", "TRG-002-QL-010", "TRG-002-QL-011", "TRG-002-QL-013",
  "TRG-002-QL-016", "TRG-002-QL-017", "TRG-002-QL-029", "TRG-002-QL-031",
  "TRG-002-QL-039", "TRG-002-QL-040", "TRG-002-QL-048", "TRG-002-QL-059",
  "TRG-002-QL-063", "TRG-002-QL-064", "TRG-002-QL-068", "TRG-002-QL-070",
  "TRG-002-QL-074", "TRG-002-QL-084", "TRG-002-QL-085",
] as const;

export type Trg002V4NaturalMeasurementId = (typeof TRG_002_V4_NATURAL_MEASUREMENT_IDS)[number];
type NaturalLocale = "en" | Trg002ExamRealnessLocale;
type Surface = Record<string, string>;
type Built = { question: Trg002MvpQuestion; surface: Surface };

const NATURAL_ID_SET = new Set<string>(TRG_002_V4_NATURAL_MEASUREMENT_IDS);
const ZERO = exactInteger(0);
const HALF = exactRational(1, 2);
const TWO = exactInteger(2);

function p(id: string, x: ExactTrigNumber, y: ExactTrigNumber, role: Trg002SpatialPoint["role"], label: string): Trg002SpatialPoint {
  return { id, x, y, role, label };
}
function obj(id: string, kind: Trg002VerticalObject["kind"], basePointId: string, topPointId: string, height: ExactTrigNumber): Trg002VerticalObject {
  return { id, kind, basePointId, topPointId, height };
}
function times(value: ExactTrigNumber, factor: number) { return multiplyExact(value, exactInteger(factor)); }
function half(value: ExactTrigNumber) { return multiplyExact(value, HALF); }
function plusOne(value: ExactTrigNumber) { return addExact(value, exactInteger(1)); }
function wrongLengths(value: ExactTrigNumber) {
  return [
    { value: mvpNumberAnswer(times(value, 2)), misconceptionId: "DOUBLED_REQUIRED_VALUE" },
    { value: mvpNumberAnswer(half(value)), misconceptionId: "HALVED_REQUIRED_VALUE" },
    { value: mvpNumberAnswer(plusOne(value)), misconceptionId: "ADDED_ONE_TO_REQUIRED_VALUE" },
  ];
}
function f(value: ExactTrigNumber) { return formatExactPlain(value); }

function depressionObjectState(input: {
  observerHeight: ExactTrigNumber;
  run: ExactTrigNumber;
  targetHeight: ExactTrigNumber;
  angle: 30 | 60;
  targetKind?: Trg002VerticalObject["kind"];
}): Trg002SpatialState {
  return {
    packageId: "TRG-002",
    scenario: "TWO_BUILDINGS",
    groundY: ZERO,
    points: [
      p("observer-base", ZERO, ZERO, "OBJECT_BASE", "A"),
      p("observer-top", ZERO, input.observerHeight, "OBSERVER_EYE", "E"),
      p("target-base", input.run, ZERO, "OBJECT_BASE", "B"),
      p("target-top", input.run, input.targetHeight, "OBJECT_TOP", "T"),
    ],
    verticalObjects: [
      obj("observer-building", "BUILDING", "observer-base", "observer-top", input.observerHeight),
      obj("target-object", input.targetKind ?? "BUILDING", "target-base", "target-top", input.targetHeight),
    ],
    observers: [{ id: "observer-1", groundPointId: "observer-base", eyePointId: "observer-top", eyeHeight: input.observerHeight }],
    observations: [{ id: "obs-1", observerId: "observer-1", eyePointId: "observer-top", targetPointId: "target-top", classification: "DEPRESSION", angle: degree(input.angle), horizontalReference: "EYE_LEVEL" }],
    movements: [],
    requested: { kind: "OBJECT_HEIGHT", objectId: "target-object" },
    diagramStrategy: "BUILDING_TO_BUILDING",
    metadata: { units: "m", sameSide: true, notes: ["V4 natural-measurement roof-to-object depression state."] },
  };
}

function roofElevationState(input: { firstHeight: ExactTrigNumber; run: ExactTrigNumber; secondHeight: ExactTrigNumber; angle: 30 | 60; classification: "ELEVATION" | "DEPRESSION"; }): Trg002SpatialState {
  return {
    packageId: "TRG-002",
    scenario: "TWO_BUILDINGS",
    groundY: ZERO,
    points: [
      p("first-base", ZERO, ZERO, "OBJECT_BASE", "A"),
      p("first-top", ZERO, input.firstHeight, "OBSERVER_EYE", "E"),
      p("second-base", input.run, ZERO, "OBJECT_BASE", "B"),
      p("second-top", input.run, input.secondHeight, "OBJECT_TOP", "T"),
    ],
    verticalObjects: [
      obj("building-1", "BUILDING", "first-base", "first-top", input.firstHeight),
      obj("building-2", "BUILDING", "second-base", "second-top", input.secondHeight),
    ],
    observers: [{ id: "observer-1", groundPointId: "first-base", eyePointId: "first-top", eyeHeight: input.firstHeight }],
    observations: [{ id: "obs-1", observerId: "observer-1", eyePointId: "first-top", targetPointId: "second-top", classification: input.classification, angle: degree(input.angle), horizontalReference: "EYE_LEVEL" }],
    movements: [],
    requested: { kind: "OBJECT_HEIGHT", objectId: "building-2" },
    diagramStrategy: "BUILDING_TO_BUILDING",
    metadata: { units: "m", sameSide: true, notes: ["V4 natural-measurement two-building state."] },
  };
}

function shadowState(input: { height: ExactTrigNumber; shadow: ExactTrigNumber; angle: 30 | 60; requested: "HEIGHT" | "SHADOW"; objectKind?: Trg002VerticalObject["kind"] }): Trg002SpatialState {
  return {
    packageId: "TRG-002",
    scenario: "SHADOW",
    groundY: ZERO,
    points: [
      p("object-base", ZERO, ZERO, "OBJECT_BASE", "B"),
      p("object-top", ZERO, input.height, "OBJECT_TOP", "T"),
      p("shadow-tip", input.shadow, ZERO, "SHADOW_TIP", "S"),
    ],
    verticalObjects: [obj("object-1", input.objectKind ?? "POLE", "object-base", "object-top", input.height)],
    observers: [{ id: "sun-reference", groundPointId: "shadow-tip", eyePointId: "shadow-tip", eyeHeight: ZERO }],
    observations: [{ id: "sun-ray", observerId: "sun-reference", eyePointId: "shadow-tip", targetPointId: "object-top", classification: "ELEVATION", angle: degree(input.angle), horizontalReference: "EYE_LEVEL" }],
    movements: [],
    requested: input.requested === "HEIGHT" ? { kind: "OBJECT_HEIGHT", objectId: "object-1" } : { kind: "SHADOW_LENGTH", objectId: "object-1", shadowTipPointId: "shadow-tip" },
    diagramStrategy: "SHADOW",
    metadata: { units: "m", sameSide: true },
  };
}

function guyWireState(mastHeight: ExactTrigNumber): Trg002SpatialState {
  const anchorDistance = mastHeight;
  return {
    packageId: "TRG-002",
    scenario: "GUY_WIRE",
    groundY: ZERO,
    points: [
      p("mast-base", ZERO, ZERO, "OBJECT_BASE", "B"),
      p("mast-top", ZERO, mastHeight, "OBJECT_TOP", "T"),
      p("anchor", anchorDistance, ZERO, "ANCHOR", "A"),
    ],
    verticalObjects: [obj("mast-1", "MAST", "mast-base", "mast-top", mastHeight)],
    observers: [{ id: "anchor-observer", groundPointId: "anchor", eyePointId: "anchor", eyeHeight: ZERO }],
    observations: [{ id: "wire-angle", observerId: "anchor-observer", eyePointId: "anchor", targetPointId: "mast-top", classification: "ELEVATION", angle: degree(45), horizontalReference: "EYE_LEVEL" }],
    movements: [],
    requested: { kind: "HORIZONTAL_DISTANCE", fromPointId: "mast-base", toPointId: "anchor" },
    diagramStrategy: "GUY_WIRE",
    metadata: { units: "m", sameSide: true },
  };
}

function sameSide30And60State(input: { height: ExactTrigNumber; near: ExactTrigNumber; far: ExactTrigNumber; movement?: "CLOSER" | "FARTHER"; requested: "MOVEMENT" | "FINAL" | "SEPARATION"; objectKind?: Trg002VerticalObject["kind"] }): Trg002SpatialState {
  const movements = input.movement ? [{
    id: "movement-1",
    observerId: input.movement === "CLOSER" ? "observer-far" : "observer-near",
    fromGroundPointId: input.movement === "CLOSER" ? "far-ground" : "near-ground",
    toGroundPointId: input.movement === "CLOSER" ? "near-ground" : "far-ground",
    referenceObjectId: "object-1",
    direction: input.movement,
    distance: subtractExact(input.far, input.near),
  } as const] : [];
  return {
    packageId: "TRG-002",
    scenario: input.objectKind === "BUILDING" ? "BUILDING" : "TOWER",
    groundY: ZERO,
    points: [
      p("object-base", ZERO, ZERO, "OBJECT_BASE", "B"),
      p("object-top", ZERO, input.height, "OBJECT_TOP", "T"),
      p("near-ground", input.near, ZERO, "OBSERVER_GROUND", "N"),
      p("near-eye", input.near, ZERO, "OBSERVER_EYE", "N"),
      p("far-ground", input.far, ZERO, "OBSERVER_GROUND", "F"),
      p("far-eye", input.far, ZERO, "OBSERVER_EYE", "F"),
    ],
    verticalObjects: [obj("object-1", input.objectKind ?? "TOWER", "object-base", "object-top", input.height)],
    observers: [
      { id: "observer-near", groundPointId: "near-ground", eyePointId: "near-eye", eyeHeight: ZERO },
      { id: "observer-far", groundPointId: "far-ground", eyePointId: "far-eye", eyeHeight: ZERO },
    ],
    observations: [
      { id: "obs-near", observerId: "observer-near", eyePointId: "near-eye", targetPointId: "object-top", classification: "ELEVATION", angle: degree(60), horizontalReference: "EYE_LEVEL" },
      { id: "obs-far", observerId: "observer-far", eyePointId: "far-eye", targetPointId: "object-top", classification: "ELEVATION", angle: degree(30), horizontalReference: "EYE_LEVEL" },
    ],
    movements,
    requested: input.requested === "MOVEMENT"
      ? { kind: "MOVEMENT_DISTANCE", movementId: "movement-1" }
      : input.requested === "FINAL"
        ? { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "far-ground" }
        : { kind: "HORIZONTAL_DISTANCE", fromPointId: "near-ground", toPointId: "far-ground" },
    diagramStrategy: input.movement === "FARTHER" ? "OBSERVER_MOVES_FARTHER" : input.movement === "CLOSER" ? "OBSERVER_MOVES_CLOSER" : "TWO_OBSERVATIONS_SAME_SIDE",
    metadata: { units: "m", sameSide: true, observerOrder: ["object-base", "near-ground", "far-ground"] },
  };
}

function twoTowerState(k: number): { state: Trg002SpatialState; nearHeight: ExactTrigNumber; farHeight: ExactTrigNumber; separation: ExactTrigNumber; nearDistance: ExactTrigNumber; farDistance: ExactTrigNumber } {
  const nearHeight = exactInteger(k);
  const farHeight = exactInteger(3 * k);
  const nearDistance = exactInteger(k);
  const farDistance = exactSurd(k, 3);
  const separation = subtractExact(farDistance, nearDistance);
  const state: Trg002SpatialState = {
    packageId: "TRG-002", scenario: "TOWER", groundY: ZERO,
    points: [
      p("observer-ground", ZERO, ZERO, "OBSERVER_GROUND", "O"),
      p("observer-eye", ZERO, ZERO, "OBSERVER_EYE", "O"),
      p("near-base", nearDistance, ZERO, "OBJECT_BASE", "B₁"), p("near-top", nearDistance, nearHeight, "OBJECT_TOP", "T₁"),
      p("far-base", farDistance, ZERO, "OBJECT_BASE", "B₂"), p("far-top", farDistance, farHeight, "OBJECT_TOP", "T₂"),
    ],
    verticalObjects: [obj("near-tower", "TOWER", "near-base", "near-top", nearHeight), obj("far-tower", "TOWER", "far-base", "far-top", farHeight)],
    observers: [{ id: "observer-1", groundPointId: "observer-ground", eyePointId: "observer-eye", eyeHeight: ZERO }],
    observations: [
      { id: "obs-near", observerId: "observer-1", eyePointId: "observer-eye", targetPointId: "near-top", classification: "ELEVATION", angle: degree(45), horizontalReference: "EYE_LEVEL" },
      { id: "obs-far", observerId: "observer-1", eyePointId: "observer-eye", targetPointId: "far-top", classification: "ELEVATION", angle: degree(60), horizontalReference: "EYE_LEVEL" },
    ],
    movements: [], requested: { kind: "HORIZONTAL_DISTANCE", fromPointId: "near-base", toPointId: "far-base" }, diagramStrategy: "TWO_OBSERVATIONS_SAME_SIDE",
    metadata: { units: "m", sameSide: true, observerOrder: ["observer-ground", "near-base", "far-base"] },
  };
  return { state, nearHeight, farHeight, separation, nearDistance, farDistance };
}

function buildNaturalCanonical(qlId: Trg002V4NaturalMeasurementId, seed: string): Built {
  switch (qlId) {
    case "TRG-002-QL-006": {
      const runN = mvpPick(seed, "v4-natural-006-run", [12, 15, 18] as const);
      const run = exactInteger(runN), height = exactSurd(runN / 3, 3);
      const state = buildSingleElevationState({ horizontal: run, angle: degree(30), scenario: "POLE", objectKind: "POLE", units: "m" });
      const question = buildTrg002MvpQuestion({ qlId, cpId: "TRG-CP-007", lockedFamily: "HEIGHT_FROM_ELEVATION", solveMode: "findExactHeightFromNaturalDistanceAt30Degrees", seed, difficulty: "Medium", target: "LENGTH", stem: `A vertical pole is ${f(run)} m horizontally from an observation point on level ground. The angle of elevation of its top is 30°. Find the exact height of the pole.`, state, correct: mvpNumberAnswer(height), wrong: wrongLengths(height), explanation: mvpExplanation("Use tangent because the horizontal distance and vertical height are the two perpendicular sides.", [`Let the height be h. Then tan30°=h/${f(run)}.`, `So h=${f(run)}/√3=${f(height)} m.`], "Do not treat the horizontal distance as the hypotenuse.") });
      return { question, surface: { run: f(run), height: f(height) } };
    }
    case "TRG-002-QL-010": {
      const hN = mvpPick(seed, "v4-natural-010-height", [12, 15, 18] as const);
      const height = exactInteger(hN), run = exactSurd(hN / 3, 3);
      const state = buildSingleElevationState({ horizontal: run, angle: degree(60), scenario: "TOWER", objectKind: "TOWER", units: "m" });
      state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "observer-ground" };
      const question = buildTrg002MvpQuestion({ qlId, cpId: "TRG-CP-007", lockedFamily: "DISTANCE_FROM_ELEVATION", solveMode: "findExactDistanceFromNaturalHeightAt60Degrees", seed, difficulty: "Medium", target: "LENGTH", stem: `A tower is ${f(height)} m high. From a point on level ground, the angle of elevation of its top is 60°. Find the exact horizontal distance from the point to the tower.`, state, correct: mvpNumberAnswer(run), wrong: wrongLengths(run), explanation: mvpExplanation("Use tan60° = height/horizontal distance.", [`Let the distance be d. Then √3=${f(height)}/d.`, `Hence d=${f(height)}/√3=${f(run)} m.`], "The required distance is horizontal, not the sloping line of sight.") });
      return { question, surface: { height: f(height), run: f(run) } };
    }
    case "TRG-002-QL-011": {
      const hN = mvpPick(seed, "v4-natural-011-height", [8, 10, 12] as const);
      const height = exactInteger(hN), run = exactSurd(hN, 3);
      const state = buildSingleElevationState({ horizontal: run, angle: degree(30), scenario: "FLAGPOLE", objectKind: "FLAGPOLE", units: "m" });
      state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "observer-ground" };
      const question = buildTrg002MvpQuestion({ qlId, cpId: "TRG-CP-007", lockedFamily: "DISTANCE_FROM_ELEVATION", solveMode: "findExactDistanceFromNaturalFlagpoleHeightAt30Degrees", seed, difficulty: "Medium", target: "LENGTH", stem: `A vertical flagpole is ${f(height)} m high. Its top is seen from a point on level ground at an angle of elevation of 30°. Find the exact horizontal distance from the point to the foot of the flagpole.`, state, correct: mvpNumberAnswer(run), wrong: wrongLengths(run), explanation: mvpExplanation("Use tan30° = height/horizontal distance.", [`Let the distance be d. Then 1/√3=${f(height)}/d.`, `Therefore d=${f(height)}√3=${f(run)} m.`], "Do not use the flagpole height as the required ground distance.") });
      return { question, surface: { height: f(height), run: f(run) } };
    }
    case "TRG-002-QL-013": {
      const n = mvpPick(seed, "v4-natural-013-equal", [10, 12, 15] as const);
      const value = exactInteger(n);
      const state = buildSingleElevationState({ horizontal: value, angle: degree(45), scenario: "TOWER", objectKind: "TOWER", units: "m" });
      state.requested = { kind: "ANGLE", observationId: "obs-1" };
      const question = buildTrg002MvpQuestion({ qlId, cpId: "TRG-CP-007", lockedFamily: "ANGLE_FROM_HEIGHT_DISTANCE", solveMode: "recover45DegreeAngleFromNaturalEqualLegs", seed, difficulty: "Medium", target: "ANGLE", stem: `A tower is ${n} m high and an observation point is ${n} m horizontally from its foot. Find the angle of elevation of the top.`, state, correct: mvpAngleAnswer(degree(45)), wrong: [{ value: mvpAngleAnswer(degree(30)), misconceptionId: "USED_30_DEGREE_STANDARD_RATIO" }, { value: mvpAngleAnswer(degree(60)), misconceptionId: "USED_60_DEGREE_STANDARD_RATIO" }, { value: mvpAngleAnswer(degree(90)), misconceptionId: "USED_VERTICAL_ANGLE" }], explanation: mvpExplanation("The height and horizontal distance are equal, so tanθ=1.", [`tanθ=${n}/${n}=1.`, "Therefore θ=45°."], "The angle of elevation is measured from the horizontal, not from the vertical.") });
      return { question, surface: { value: String(n) } };
    }
    case "TRG-002-QL-016": {
      const k = mvpPick(seed, "v4-natural-016-k", [4, 5, 6] as const);
      const observerHeight = exactInteger(6 * k), run = exactInteger(3 * k), drop = exactSurd(k, 3), targetHeight = subtractExact(observerHeight, drop);
      const state = depressionObjectState({ observerHeight, run, targetHeight, angle: 30, targetKind: "POLE" });
      const question = buildTrg002MvpQuestion({ qlId, cpId: "TRG-CP-007", lockedFamily: "HEIGHT_FROM_DEPRESSION", solveMode: "findLowerPoleHeightFromNatural30DegreeRoofDepression", seed, difficulty: "Medium", target: "LENGTH", stem: `From the roof of a ${f(observerHeight)} m high building, the top of a vertical pole ${f(run)} m horizontally away is seen at an angle of depression of 30°. Find the exact height of the pole.`, state, correct: mvpNumberAnswer(targetHeight), wrong: wrongLengths(targetHeight), explanation: mvpExplanation("The depression triangle gives the drop from roof level to the pole top; subtract that drop from the building height.", [`Vertical drop=${f(run)}×tan30°=${f(drop)} m.`, `Pole height=${f(observerHeight)}−${f(drop)}=${f(targetHeight)} m.`], "The tangent gives only the drop below roof level, not the pole's full height.") });
      return { question, surface: { observerHeight: f(observerHeight), run: f(run), drop: f(drop), targetHeight: f(targetHeight) } };
    }
    case "TRG-002-QL-017": {
      const k = mvpPick(seed, "v4-natural-017-k", [4, 5, 6] as const);
      const observerHeight = exactInteger(8 * k), run = exactInteger(2 * k), drop = exactSurd(2 * k, 3), targetHeight = subtractExact(observerHeight, drop);
      const state = depressionObjectState({ observerHeight, run, targetHeight, angle: 60, targetKind: "TOWER" });
      const question = buildTrg002MvpQuestion({ qlId, cpId: "TRG-CP-007", lockedFamily: "HEIGHT_FROM_DEPRESSION", solveMode: "findLowerTowerHeightFromNatural60DegreeRoofDepression", seed, difficulty: "Medium", target: "LENGTH", stem: `From the roof of a ${f(observerHeight)} m high building, the top of a shorter tower ${f(run)} m horizontally away is seen at an angle of depression of 60°. Find the exact height of the shorter tower.`, state, correct: mvpNumberAnswer(targetHeight), wrong: wrongLengths(targetHeight), explanation: mvpExplanation("Find the vertical drop from the roof to the shorter tower top and subtract it from the building height.", [`Drop=${f(run)}×tan60°=${f(drop)} m.`, `Shorter tower height=${f(observerHeight)}−${f(drop)}=${f(targetHeight)} m.`], "Do not subtract the horizontal distance directly from the building height.") });
      return { question, surface: { observerHeight: f(observerHeight), run: f(run), drop: f(drop), targetHeight: f(targetHeight) } };
    }
    case "TRG-002-QL-029": {
      const sN = mvpPick(seed, "v4-natural-029-shadow", [12, 15, 18] as const);
      const shadow = exactInteger(sN), height = exactSurd(sN / 3, 3);
      const state = shadowState({ height, shadow, angle: 30, requested: "HEIGHT", objectKind: "TREE" });
      const question = buildTrg002MvpQuestion({ qlId, cpId: "TRG-CP-008", lockedFamily: "SHADOW_TO_HEIGHT", solveMode: "findExactTreeHeightFromNaturalShadowAt30Degrees", seed, difficulty: "Medium", target: "LENGTH", stem: `A tree casts a ${sN} m long shadow when the sun's elevation is 30°. Find the exact height of the tree.`, state, correct: mvpNumberAnswer(height), wrong: wrongLengths(height), explanation: mvpExplanation("For the right triangle formed by the tree and its shadow, tan30°=height/shadow.", [`Let the height be h. Then 1/√3=h/${sN}.`, `Hence h=${sN}/√3=${f(height)} m.`], "Use the shadow as the horizontal side, not as the height.") });
      return { question, surface: { shadow: String(sN), height: f(height) } };
    }
    case "TRG-002-QL-031": {
      const hN = mvpPick(seed, "v4-natural-031-height", [12, 15, 18] as const);
      const height = exactInteger(hN), shadow = exactSurd(hN / 3, 3);
      const state = shadowState({ height, shadow, angle: 60, requested: "SHADOW" });
      const question = buildTrg002MvpQuestion({ qlId, cpId: "TRG-CP-008", lockedFamily: "HEIGHT_TO_SHADOW", solveMode: "findExactShadowFromNaturalHeightAt60Degrees", seed, difficulty: "Medium", target: "LENGTH", stem: `A vertical pole is ${hN} m high. When the sun's elevation is 60°, find the exact length of its shadow.`, state, correct: mvpNumberAnswer(shadow), wrong: wrongLengths(shadow), explanation: mvpExplanation("Use tan60°=height/shadow length.", [`Let the shadow be s. Then √3=${hN}/s.`, `Therefore s=${hN}/√3=${f(shadow)} m.`], "The shadow is the horizontal side of the triangle.") });
      return { question, surface: { height: String(hN), shadow: f(shadow) } };
    }
    case "TRG-002-QL-039": {
      const lengthN = mvpPick(seed, "v4-natural-039-ladder", [10, 12, 14] as const);
      const length = exactInteger(lengthN), base = exactSurd(lengthN / 2, 2);
      const state = buildLadderState({ ladderLength: length, angleAtGround: degree(45), units: "m" });
      state.requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: "wall-base", toPointId: "ladder-base" };
      const question = buildTrg002MvpQuestion({ qlId, cpId: "TRG-CP-008", lockedFamily: "LADDER_AGAINST_WALL", solveMode: "findExactLadderFootDistanceFromNaturalLengthAt45Degrees", seed, difficulty: "Medium", target: "LENGTH", stem: `A ${lengthN} m ladder leans against a vertical wall and makes a 45° angle with the ground. Find the exact horizontal distance of its lower end from the wall.`, state, correct: mvpNumberAnswer(base), wrong: wrongLengths(base), explanation: mvpExplanation("The ladder is the hypotenuse, so use cosine for the horizontal distance.", [`Let the distance be d. Then cos45°=d/${lengthN}.`, `Thus d=${lengthN}/√2=${f(base)} m.`], "Do not treat the ladder length as the horizontal distance.") });
      return { question, surface: { length: String(lengthN), base: f(base) } };
    }
    case "TRG-002-QL-040": {
      const lengthN = mvpPick(seed, "v4-natural-040-ladder", [10, 12, 14] as const);
      const length = exactInteger(lengthN), height = exactInteger(lengthN / 2);
      const state = buildLadderState({ ladderLength: length, angleAtGround: degree(30), units: "m" });
      const question = buildTrg002MvpQuestion({ qlId, cpId: "TRG-CP-008", lockedFamily: "LADDER_AGAINST_WALL", solveMode: "findLadderLengthFromNaturalWallHeightAt30Degrees", seed, difficulty: "Medium", target: "LENGTH", stem: `A ladder reaches ${f(height)} m up a vertical wall and makes a 30° angle with the ground. Find the length of the ladder.`, state, correct: mvpNumberAnswer(length), wrong: wrongLengths(length), explanation: mvpExplanation("The reached height is opposite the 30° angle and the ladder is the hypotenuse.", [`sin30°=${f(height)}/L=1/2.`, `Therefore L=2×${f(height)}=${lengthN} m.`], "Do not use tangent here; the required ladder length is the hypotenuse.") });
      return { question, surface: { height: f(height), length: String(lengthN) } };
    }
    case "TRG-002-QL-048": {
      const hN = mvpPick(seed, "v4-natural-048-height", [15, 20, 25] as const);
      const height = exactInteger(hN), state = guyWireState(height);
      const question = buildTrg002MvpQuestion({ qlId, cpId: "TRG-CP-008", lockedFamily: "GUY_WIRE_MAST_ANCHOR", solveMode: "findAnchorDistanceFromNaturalMastHeightAt45Degrees", seed, difficulty: "Medium", target: "LENGTH", stem: `A ${hN} m high mast is supported by a wire from its top to an anchor on level ground. The wire makes a 45° angle with the ground. Find the horizontal distance from the foot of the mast to the anchor.`, state, correct: mvpNumberAnswer(height), wrong: wrongLengths(height), explanation: mvpExplanation("At 45°, the vertical mast height and horizontal anchor distance are equal.", [`Let the anchor distance be d. Then tan45°=${hN}/d=1.`, `So d=${hN} m.`], "The required distance is along the ground, not the wire length.") });
      return { question, surface: { height: String(hN) } };
    }
    case "TRG-002-QL-059": {
      const hN = mvpPick(seed, "v4-natural-059-height", [12, 15, 18] as const);
      const height = exactInteger(hN), near = exactSurd(hN / 3, 3), far = exactSurd(hN, 3), movement = subtractExact(far, near);
      const state = sameSide30And60State({ height, near, far, movement: "CLOSER", requested: "MOVEMENT" });
      const question = buildTrg002MvpQuestion({ qlId, cpId: "TRG-CP-009", lockedFamily: "OBSERVER_MOVES_CLOSER", solveMode: "findCloserMovementFromNaturalHeight30To60", seed, difficulty: "Hard", target: "LENGTH", stem: `A tower is ${hN} m high. An observer sees its top at 30°, then walks straight toward the tower until the angle becomes 60°. Find the exact distance walked.`, state, correct: mvpNumberAnswer(movement), wrong: wrongLengths(movement), explanation: mvpExplanation("Find the two horizontal distances from the same tower height, then subtract the nearer distance from the farther one.", [`At 30°, far distance=${hN}/tan30°=${f(far)} m.`, `At 60°, near distance=${hN}/tan60°=${f(near)} m.`, `Distance walked=${f(far)}−${f(near)}=${f(movement)} m.`], "Do not add the two distances; both are measured from the tower.") });
      return { question, surface: { height: String(hN), near: f(near), far: f(far), movement: f(movement) } };
    }
    case "TRG-002-QL-063": {
      const hN = mvpPick(seed, "v4-natural-063-height", [12, 15, 18] as const);
      const height = exactInteger(hN), near = exactSurd(hN / 3, 3), far = exactSurd(hN, 3);
      const state = sameSide30And60State({ height, near, far, movement: "FARTHER", requested: "FINAL", objectKind: "BUILDING" });
      const question = buildTrg002MvpQuestion({ qlId, cpId: "TRG-CP-009", lockedFamily: "OBSERVER_MOVES_FARTHER", solveMode: "findFinalDistanceAfterMovingFartherFromNaturalHeight60To30", seed, difficulty: "Medium", target: "LENGTH", stem: `A building is ${hN} m high. An observer first sees its top at 60°, then walks straight away until the angle becomes 30°. Find the exact final horizontal distance from the building.`, state, correct: mvpNumberAnswer(far), wrong: wrongLengths(far), explanation: mvpExplanation("The final 30° observation alone determines the final distance.", [`Let the final distance be d. Then tan30°=${hN}/d.`, `Hence d=${hN}√3=${f(far)} m.`], "Use the final 30° angle for the final distance; do not return the distance walked.") });
      return { question, surface: { height: String(hN), far: f(far) } };
    }
    case "TRG-002-QL-064": {
      const hN = mvpPick(seed, "v4-natural-064-height", [12, 15, 18] as const);
      const height = exactInteger(hN), near = exactSurd(hN / 3, 3), far = exactSurd(hN, 3), movement = subtractExact(far, near);
      const state = sameSide30And60State({ height, near, far, movement: "FARTHER", requested: "MOVEMENT" });
      const question = buildTrg002MvpQuestion({ qlId, cpId: "TRG-CP-009", lockedFamily: "OBSERVER_MOVES_FARTHER", solveMode: "findFartherMovementFromNaturalHeight60To30", seed, difficulty: "Medium", target: "LENGTH", stem: `A tower is ${hN} m high. From a point on level ground its top is seen at 60°. The observer then walks straight away until the angle becomes 30°. Find the exact distance walked.`, state, correct: mvpNumberAnswer(movement), wrong: wrongLengths(movement), explanation: mvpExplanation("Find the 60° and 30° horizontal distances and subtract the initial distance from the final distance.", [`Initial distance=${hN}/tan60°=${f(near)} m.`, `Final distance=${hN}/tan30°=${f(far)} m; movement=${f(far)}−${f(near)}=${f(movement)} m.`], "Because the observer moves away, final distance minus initial distance is required.") });
      return { question, surface: { height: String(hN), near: f(near), far: f(far), movement: f(movement) } };
    }
    case "TRG-002-QL-068": {
      const hN = mvpPick(seed, "v4-natural-068-height", [12, 15, 18] as const);
      const height = exactInteger(hN), near = exactSurd(hN / 3, 3), far = exactSurd(hN, 3), separation = subtractExact(far, near);
      const state = sameSide30And60State({ height, near, far, requested: "SEPARATION" });
      const question = buildTrg002MvpQuestion({ qlId, cpId: "TRG-CP-009", lockedFamily: "FIND_MOVEMENT_SEPARATION", solveMode: "findSameSidePointSeparationFromNaturalHeightAndAngles", seed, difficulty: "Medium", target: "LENGTH", stem: `A tower is ${hN} m high. From two points on the same side of the tower and in the same straight line with its foot, the angles of elevation of the top are 60° and 30°. Find the exact distance between the two points.`, state, correct: mvpNumberAnswer(separation), wrong: wrongLengths(separation), explanation: mvpExplanation("The 60° point is nearer and the 30° point is farther; subtract their distances from the tower.", [`Near distance=${hN}/tan60°=${f(near)} m and far distance=${hN}/tan30°=${f(far)} m.`, `Separation=${f(far)}−${f(near)}=${f(separation)} m.`], "The two points are on the same side, so subtract rather than add their tower distances.") });
      return { question, surface: { height: String(hN), near: f(near), far: f(far), separation: f(separation) } };
    }
    case "TRG-002-QL-070": {
      const k = mvpPick(seed, "v4-natural-070-k", [6, 8, 10] as const);
      const built = twoTowerState(k);
      const question = buildTrg002MvpQuestion({ qlId, cpId: "TRG-CP-009", lockedFamily: "COMPARATIVE_TWO_OBJECT_CONTROLLED", solveMode: "compareNaturalTwoTowersAt45And60FromOnePoint", seed, difficulty: "Hard", target: "LENGTH", stem: `From one observation point, a ${f(built.nearHeight)} m tower is seen at 45° and a farther ${f(built.farHeight)} m tower at 60°. Both tower feet lie on the same ray from the observer. Find the exact distance between the tower feet.`, state: built.state, correct: mvpNumberAnswer(built.separation), wrong: wrongLengths(built.separation), explanation: mvpExplanation("Find each tower's horizontal distance from the common observation point, then subtract because both towers are on the same ray.", [`Near-tower distance=${f(built.nearHeight)}/tan45°=${f(built.nearDistance)} m.`, `Far-tower distance=${f(built.farHeight)}/tan60°=${f(built.farDistance)} m.`, `Distance between tower feet=${f(built.farDistance)}−${f(built.nearDistance)}=${f(built.separation)} m.`], "Do not subtract the tower heights; the required quantity is the difference of their horizontal distances from the observer.") });
      return { question, surface: { nearHeight: f(built.nearHeight), farHeight: f(built.farHeight), nearDistance: f(built.nearDistance), farDistance: f(built.farDistance), separation: f(built.separation) } };
    }
    case "TRG-002-QL-074": {
      const runN = mvpPick(seed, "v4-natural-074-run", [9, 12, 15] as const);
      const eye = exactRational(3, 2), run = exactInteger(runN), rise = exactSurd(runN / 3, 3), total = addExact(eye, rise);
      const state = buildObserverHeightElevationState({ horizontal: run, angle: degree(30), eyeHeight: eye, units: "m" });
      const question = buildTrg002MvpQuestion({ qlId, cpId: "TRG-CP-010", lockedFamily: "OBSERVER_HEIGHT_CORRECTION", solveMode: "findTotalHeightWithNaturalRunAndEyeLevelAt30Degrees", seed, difficulty: "Medium", target: "LENGTH", stem: `An observer's eye is 1.5 m above level ground and is ${runN} m horizontally from a building. The top is seen at an angle of elevation of 30°. Find the exact height of the building.`, state, correct: mvpNumberAnswer(total), wrong: wrongLengths(total), explanation: mvpExplanation("Tangent gives the rise above eye level; add the observer's eye height once to get the full building height.", [`Rise above eye level=${runN}×tan30°=${f(rise)} m.`, `Building height=${f(rise)}+1.5=${f(total)} m.`], "Do not omit the 1.5 m eye height or add it twice.") });
      return { question, surface: { run: String(runN), rise: f(rise), total: f(total) } };
    }
    case "TRG-002-QL-084": {
      const k = mvpPick(seed, "v4-natural-084-k", [3, 4, 5] as const);
      const first = exactInteger(5 * k), run = exactInteger(3 * k), rise = exactSurd(k, 3), second = addExact(first, rise);
      const state = roofElevationState({ firstHeight: first, run, secondHeight: second, angle: 30, classification: "ELEVATION" });
      const question = buildTrg002MvpQuestion({ qlId, cpId: "TRG-CP-010", lockedFamily: "BUILDING_TO_BUILDING", solveMode: "findSecondBuildingHeightFromNatural30DegreeRoofView", seed, difficulty: "Hard", target: "LENGTH", stem: `A building is ${f(first)} m high and another building is ${f(run)} m horizontally away. From the roof of the first building, the top of the second is seen at an angle of elevation of 30°. Find the exact height of the second building.`, state, correct: mvpNumberAnswer(second), wrong: wrongLengths(second), explanation: mvpExplanation("The 30° triangle gives only the rise of the second roof above the first roof; add that rise to the first building height.", [`Rise above first roof=${f(run)}×tan30°=${f(rise)} m.`, `First roof is ${f(first)} m above ground.`, `Second building height=${f(first)}+${f(rise)}=${f(second)} m.`], "Do not report only the roof-to-roof rise as the second building's total height.") });
      return { question, surface: { first: f(first), run: f(run), rise: f(rise), second: f(second) } };
    }
    case "TRG-002-QL-085": {
      const k = mvpPick(seed, "v4-natural-085-k", [4, 5, 6] as const);
      const first = exactInteger(8 * k), run = exactInteger(2 * k), drop = exactSurd(2 * k, 3), second = subtractExact(first, drop);
      const state = roofElevationState({ firstHeight: first, run, secondHeight: second, angle: 60, classification: "DEPRESSION" });
      const question = buildTrg002MvpQuestion({ qlId, cpId: "TRG-CP-010", lockedFamily: "BUILDING_TO_BUILDING", solveMode: "findShorterBuildingHeightFromNatural60DegreeRoofDepression", seed, difficulty: "Hard", target: "LENGTH", stem: `A building is ${f(first)} m high and a shorter building is ${f(run)} m horizontally away. From the roof of the taller building, the top of the shorter one is seen at an angle of depression of 60°. Find the exact height of the shorter building.`, state, correct: mvpNumberAnswer(second), wrong: wrongLengths(second), explanation: mvpExplanation("The depression triangle gives the vertical drop from the taller roof to the shorter roof; subtract it from the taller building height.", [`Roof-to-roof drop=${f(run)}×tan60°=${f(drop)} m.`, `Taller roof is ${f(first)} m above ground.`, `Shorter building height=${f(first)}−${f(drop)}=${f(second)} m.`], "Do not use the horizontal separation as a vertical height difference.") });
      return { question, surface: { first: f(first), run: f(run), drop: f(drop), second: f(second) } };
    }
  }
}

function localizedSurface(qlId: Trg002V4NaturalMeasurementId, locale: NaturalLocale, s: Surface) {
  if (locale === "en") return null;
  const hi = locale === "hi-IN";
  switch (qlId) {
    case "TRG-002-QL-006": return hi ? { stem: `समतल जमीन पर एक अवलोकन बिंदु से एक ऊर्ध्वाधर खंभे के आधार की क्षैतिज दूरी ${s.run} m है। उसके शीर्ष का उन्नयन कोण 30° है। खंभे की सटीक ऊँचाई ज्ञात कीजिए।`, rule: "क्षैतिज दूरी और ऊँचाई के लिए tangent का उपयोग करें।", steps: [`ऊँचाई h मानें। tan30°=h/${s.run}।`, `इसलिए h=${s.run}/√3=${s.height} m।`], trap: "क्षैतिज दूरी को कर्ण न मानें।" } : { stem: `ਸਮਤਲ ਜ਼ਮੀਨ ਉੱਤੇ ਇੱਕ ਨਿਰੀਖਣ ਬਿੰਦੂ ਤੋਂ ਇੱਕ ਖੜ੍ਹੇ ਖੰਭੇ ਦੇ ਅਧਾਰ ਦੀ ਖਿਤਿਜੀ ਦੂਰੀ ${s.run} m ਹੈ। ਇਸ ਦੀ ਚੋਟੀ ਦਾ ਉਚਾਣ ਕੋਣ 30° ਹੈ। ਖੰਭੇ ਦੀ ਸਟੀਕ ਉਚਾਈ ਕੱਢੋ।`, rule: "ਖਿਤਿਜੀ ਦੂਰੀ ਅਤੇ ਉਚਾਈ ਲਈ tangent ਵਰਤੋ।", steps: [`ਉਚਾਈ h ਮੰਨੋ। tan30°=h/${s.run}।`, `ਇਸ ਲਈ h=${s.run}/√3=${s.height} m।`], trap: "ਖਿਤਿਜੀ ਦੂਰੀ ਨੂੰ ਕਰਣ ਨਾ ਮੰਨੋ।" };
    case "TRG-002-QL-010": return hi ? { stem: `एक मीनार ${s.height} m ऊँची है। समतल जमीन के एक बिंदु से उसके शीर्ष का उन्नयन कोण 60° है। बिंदु से मीनार के आधार तक सटीक क्षैतिज दूरी ज्ञात कीजिए।`, rule: "tan60° = ऊँचाई/क्षैतिज दूरी का उपयोग करें।", steps: [`दूरी d मानें। √3=${s.height}/d।`, `अतः d=${s.height}/√3=${s.run} m।`], trap: "दृष्टि-रेखा की लंबाई नहीं, क्षैतिज दूरी चाहिए।" } : { stem: `ਇੱਕ ਮੀਨਾਰ ${s.height} m ਉੱਚੀ ਹੈ। ਸਮਤਲ ਜ਼ਮੀਨ ਦੇ ਇੱਕ ਬਿੰਦੂ ਤੋਂ ਇਸ ਦੀ ਚੋਟੀ ਦਾ ਉਚਾਣ ਕੋਣ 60° ਹੈ। ਬਿੰਦੂ ਤੋਂ ਮੀਨਾਰ ਦੇ ਅਧਾਰ ਤੱਕ ਸਟੀਕ ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢੋ।`, rule: "tan60° = ਉਚਾਈ/ਖਿਤਿਜੀ ਦੂਰੀ ਵਰਤੋ।", steps: [`ਦੂਰੀ d ਮੰਨੋ। √3=${s.height}/d।`, `ਇਸ ਲਈ d=${s.height}/√3=${s.run} m।`], trap: "ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾ ਨਹੀਂ, ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢਣੀ ਹੈ।" };
    case "TRG-002-QL-011": return hi ? { stem: `एक ऊर्ध्वाधर ध्वजदंड ${s.height} m ऊँचा है। समतल जमीन के एक बिंदु से उसके शीर्ष का उन्नयन कोण 30° है। बिंदु से ध्वजदंड के आधार तक सटीक क्षैतिज दूरी ज्ञात कीजिए।`, rule: "tan30° = ऊँचाई/क्षैतिज दूरी का उपयोग करें।", steps: [`दूरी d मानें। 1/√3=${s.height}/d।`, `अतः d=${s.height}√3=${s.run} m।`], trap: "ध्वजदंड की ऊँचाई को जमीन की दूरी न मानें।" } : { stem: `ਇੱਕ ਖੜ੍ਹਾ ਝੰਡੇ ਦਾ ਡੰਡਾ ${s.height} m ਉੱਚਾ ਹੈ। ਸਮਤਲ ਜ਼ਮੀਨ ਦੇ ਇੱਕ ਬਿੰਦੂ ਤੋਂ ਇਸ ਦੀ ਚੋਟੀ ਦਾ ਉਚਾਣ ਕੋਣ 30° ਹੈ। ਬਿੰਦੂ ਤੋਂ ਡੰਡੇ ਦੇ ਅਧਾਰ ਤੱਕ ਸਟੀਕ ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢੋ।`, rule: "tan30° = ਉਚਾਈ/ਖਿਤਿਜੀ ਦੂਰੀ ਵਰਤੋ।", steps: [`ਦੂਰੀ d ਮੰਨੋ। 1/√3=${s.height}/d।`, `ਇਸ ਲਈ d=${s.height}√3=${s.run} m।`], trap: "ਡੰਡੇ ਦੀ ਉਚਾਈ ਨੂੰ ਜ਼ਮੀਨੀ ਦੂਰੀ ਨਾ ਮੰਨੋ।" };
    case "TRG-002-QL-013": return hi ? { stem: `एक मीनार ${s.value} m ऊँची है और अवलोकन बिंदु उसके आधार से ${s.value} m की क्षैतिज दूरी पर है। शीर्ष का उन्नयन कोण ज्ञात कीजिए।`, rule: "ऊँचाई और क्षैतिज दूरी बराबर हैं, इसलिए tanθ=1।", steps: [`tanθ=${s.value}/${s.value}=1।`, "अतः θ=45°।"], trap: "उन्नयन कोण क्षैतिज रेखा से मापा जाता है।" } : { stem: `ਇੱਕ ਮੀਨਾਰ ${s.value} m ਉੱਚੀ ਹੈ ਅਤੇ ਨਿਰੀਖਣ ਬਿੰਦੂ ਇਸ ਦੇ ਅਧਾਰ ਤੋਂ ${s.value} m ਖਿਤਿਜੀ ਦੂਰੀ 'ਤੇ ਹੈ। ਚੋਟੀ ਦਾ ਉਚਾਣ ਕੋਣ ਕੱਢੋ।`, rule: "ਉਚਾਈ ਅਤੇ ਖਿਤਿਜੀ ਦੂਰੀ ਬਰਾਬਰ ਹਨ, ਇਸ ਲਈ tanθ=1।", steps: [`tanθ=${s.value}/${s.value}=1।`, "ਇਸ ਲਈ θ=45°।"], trap: "ਉਚਾਣ ਕੋਣ ਖਿਤਿਜੀ ਰੇਖਾ ਤੋਂ ਮਾਪਿਆ ਜਾਂਦਾ ਹੈ।" };
    case "TRG-002-QL-016": return hi ? { stem: `${s.observerHeight} m ऊँची इमारत की छत से ${s.run} m क्षैतिज दूरी पर स्थित एक ऊर्ध्वाधर खंभे के शीर्ष का अवनमन कोण 30° है। खंभे की सटीक ऊँचाई ज्ञात कीजिए।`, rule: "पहले छत से खंभे के शीर्ष तक लंबवत गिरावट निकालें, फिर उसे इमारत की ऊँचाई से घटाएँ।", steps: [`गिरावट=${s.run}×tan30°=${s.drop} m।`, `खंभे की ऊँचाई=${s.observerHeight}−${s.drop}=${s.targetHeight} m।`], trap: "tangent से मिली गिरावट खंभे की पूरी ऊँचाई नहीं है।" } : { stem: `${s.observerHeight} m ਉੱਚੀ ਇਮਾਰਤ ਦੀ ਛੱਤ ਤੋਂ ${s.run} m ਖਿਤਿਜੀ ਦੂਰੀ 'ਤੇ ਖੜ੍ਹੇ ਇੱਕ ਖੰਭੇ ਦੀ ਚੋਟੀ ਦਾ ਨਿਵਾਣ ਕੋਣ 30° ਹੈ। ਖੰਭੇ ਦੀ ਸਟੀਕ ਉਚਾਈ ਕੱਢੋ।`, rule: "ਪਹਿਲਾਂ ਛੱਤ ਤੋਂ ਖੰਭੇ ਦੀ ਚੋਟੀ ਤੱਕ ਲੰਬਵੀਂ ਘਟਾਅ ਕੱਢੋ, ਫਿਰ ਇਸ ਨੂੰ ਇਮਾਰਤ ਦੀ ਉਚਾਈ ਵਿਚੋਂ ਘਟਾਓ।", steps: [`ਘਟਾਅ=${s.run}×tan30°=${s.drop} m।`, `ਖੰਭੇ ਦੀ ਉਚਾਈ=${s.observerHeight}−${s.drop}=${s.targetHeight} m।`], trap: "tangent ਨਾਲ ਮਿਲੀ ਘਟਾਅ ਖੰਭੇ ਦੀ ਪੂਰੀ ਉਚਾਈ ਨਹੀਂ ਹੈ।" };
    case "TRG-002-QL-017": return hi ? { stem: `${s.observerHeight} m ऊँची इमारत की छत से ${s.run} m क्षैतिज दूरी पर स्थित एक छोटी मीनार के शीर्ष का अवनमन कोण 60° है। छोटी मीनार की सटीक ऊँचाई ज्ञात कीजिए।`, rule: "छत से छोटी मीनार के शीर्ष तक लंबवत गिरावट निकालकर इमारत की ऊँचाई से घटाएँ।", steps: [`गिरावट=${s.run}×tan60°=${s.drop} m।`, `छोटी मीनार की ऊँचाई=${s.observerHeight}−${s.drop}=${s.targetHeight} m।`], trap: "क्षैतिज दूरी को सीधे ऊँचाई से न घटाएँ।" } : { stem: `${s.observerHeight} m ਉੱਚੀ ਇਮਾਰਤ ਦੀ ਛੱਤ ਤੋਂ ${s.run} m ਖਿਤਿਜੀ ਦੂਰੀ 'ਤੇ ਇੱਕ ਛੋਟੀ ਮੀਨਾਰ ਦੀ ਚੋਟੀ ਦਾ ਨਿਵਾਣ ਕੋਣ 60° ਹੈ। ਛੋਟੀ ਮੀਨਾਰ ਦੀ ਸਟੀਕ ਉਚਾਈ ਕੱਢੋ।`, rule: "ਛੱਤ ਤੋਂ ਛੋਟੀ ਮੀਨਾਰ ਦੀ ਚੋਟੀ ਤੱਕ ਲੰਬਵੀਂ ਘਟਾਅ ਕੱਢ ਕੇ ਇਮਾਰਤ ਦੀ ਉਚਾਈ ਵਿਚੋਂ ਘਟਾਓ।", steps: [`ਘਟਾਅ=${s.run}×tan60°=${s.drop} m।`, `ਛੋਟੀ ਮੀਨਾਰ ਦੀ ਉਚਾਈ=${s.observerHeight}−${s.drop}=${s.targetHeight} m।`], trap: "ਖਿਤਿਜੀ ਦੂਰੀ ਨੂੰ ਸਿੱਧਾ ਉਚਾਈ ਵਿਚੋਂ ਨਾ ਘਟਾਓ।" };
    case "TRG-002-QL-029": return hi ? { stem: `एक पेड़ की छाया ${s.shadow} m लंबी है। उस समय सूर्य का उन्नयन कोण 30° है। पेड़ की सटीक ऊँचाई ज्ञात कीजिए।`, rule: "पेड़ और उसकी छाया से बने समकोण त्रिभुज में tan30°=ऊँचाई/छाया।", steps: [`ऊँचाई h मानें। 1/√3=h/${s.shadow}।`, `अतः h=${s.shadow}/√3=${s.height} m।`], trap: "छाया की लंबाई को पेड़ की ऊँचाई न मानें।" } : { stem: `ਇੱਕ ਦਰੱਖਤ ਦੀ ਛਾਂ ${s.shadow} m ਲੰਬੀ ਹੈ। ਉਸ ਵੇਲੇ ਸੂਰਜ ਦਾ ਉਚਾਣ ਕੋਣ 30° ਹੈ। ਦਰੱਖਤ ਦੀ ਸਟੀਕ ਉਚਾਈ ਕੱਢੋ।`, rule: "ਦਰੱਖਤ ਅਤੇ ਇਸ ਦੀ ਛਾਂ ਦੇ ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ tan30°=ਉਚਾਈ/ਛਾਂ।", steps: [`ਉਚਾਈ h ਮੰਨੋ। 1/√3=h/${s.shadow}।`, `ਇਸ ਲਈ h=${s.shadow}/√3=${s.height} m।`], trap: "ਛਾਂ ਦੀ ਲੰਬਾਈ ਨੂੰ ਦਰੱਖਤ ਦੀ ਉਚਾਈ ਨਾ ਮੰਨੋ।" };
    case "TRG-002-QL-031": return hi ? { stem: `एक ऊर्ध्वाधर खंभा ${s.height} m ऊँचा है। सूर्य का उन्नयन कोण 60° होने पर उसकी छाया की सटीक लंबाई ज्ञात कीजिए।`, rule: "tan60°=ऊँचाई/छाया की लंबाई।", steps: [`छाया s मानें। √3=${s.height}/s।`, `अतः s=${s.height}/√3=${s.shadow} m।`], trap: "छाया समतल जमीन पर क्षैतिज लंबाई है।" } : { stem: `ਇੱਕ ਖੜ੍ਹਾ ਖੰਭਾ ${s.height} m ਉੱਚਾ ਹੈ। ਸੂਰਜ ਦਾ ਉਚਾਣ ਕੋਣ 60° ਹੋਣ 'ਤੇ ਇਸ ਦੀ ਛਾਂ ਦੀ ਸਟੀਕ ਲੰਬਾਈ ਕੱਢੋ।`, rule: "tan60°=ਉਚਾਈ/ਛਾਂ ਦੀ ਲੰਬਾਈ।", steps: [`ਛਾਂ s ਮੰਨੋ। √3=${s.height}/s।`, `ਇਸ ਲਈ s=${s.height}/√3=${s.shadow} m।`], trap: "ਛਾਂ ਸਮਤਲ ਜ਼ਮੀਨ ਉੱਤੇ ਖਿਤਿਜੀ ਲੰਬਾਈ ਹੈ।" };
    case "TRG-002-QL-039": return hi ? { stem: `${s.length} m लंबी सीढ़ी एक ऊर्ध्वाधर दीवार से लगी है और जमीन के साथ 45° का कोण बनाती है। सीढ़ी के निचले सिरे से दीवार की सटीक क्षैतिज दूरी ज्ञात कीजिए।`, rule: "सीढ़ी कर्ण है, इसलिए क्षैतिज दूरी के लिए cosine का उपयोग करें।", steps: [`दूरी d मानें। cos45°=d/${s.length}।`, `अतः d=${s.length}/√2=${s.base} m।`], trap: "सीढ़ी की लंबाई को क्षैतिज दूरी न मानें।" } : { stem: `${s.length} m ਲੰਬੀ ਸੀੜ੍ਹੀ ਇੱਕ ਖੜ੍ਹੀ ਕੰਧ ਨਾਲ ਟਿਕੀ ਹੈ ਅਤੇ ਜ਼ਮੀਨ ਨਾਲ 45° ਦਾ ਕੋਣ ਬਣਾਉਂਦੀ ਹੈ। ਸੀੜ੍ਹੀ ਦੇ ਹੇਠਲੇ ਸਿਰੇ ਤੋਂ ਕੰਧ ਦੀ ਸਟੀਕ ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢੋ।`, rule: "ਸੀੜ੍ਹੀ ਕਰਣ ਹੈ, ਇਸ ਲਈ ਖਿਤਿਜੀ ਦੂਰੀ ਲਈ cosine ਵਰਤੋ।", steps: [`ਦੂਰੀ d ਮੰਨੋ। cos45°=d/${s.length}।`, `ਇਸ ਲਈ d=${s.length}/√2=${s.base} m।`], trap: "ਸੀੜ੍ਹੀ ਦੀ ਲੰਬਾਈ ਨੂੰ ਖਿਤਿਜੀ ਦੂਰੀ ਨਾ ਮੰਨੋ।" };
    case "TRG-002-QL-040": return hi ? { stem: `एक सीढ़ी ऊर्ध्वाधर दीवार पर ${s.height} m की ऊँचाई तक पहुँचती है और जमीन के साथ 30° का कोण बनाती है। सीढ़ी की लंबाई ज्ञात कीजिए।`, rule: "दीवार पर पहुँची ऊँचाई 30° के सामने वाली भुजा है और सीढ़ी कर्ण है।", steps: [`sin30°=${s.height}/L=1/2।`, `अतः L=2×${s.height}=${s.length} m।`], trap: "यहाँ सीढ़ी की लंबाई कर्ण है; tangent का उपयोग न करें।" } : { stem: `ਇੱਕ ਸੀੜ੍ਹੀ ਖੜ੍ਹੀ ਕੰਧ ਉੱਤੇ ${s.height} m ਦੀ ਉਚਾਈ ਤੱਕ ਪਹੁੰਚਦੀ ਹੈ ਅਤੇ ਜ਼ਮੀਨ ਨਾਲ 30° ਦਾ ਕੋਣ ਬਣਾਉਂਦੀ ਹੈ। ਸੀੜ੍ਹੀ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`, rule: "ਕੰਧ ਉੱਤੇ ਪਹੁੰਚੀ ਉਚਾਈ 30° ਦੇ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ਹੈ ਅਤੇ ਸੀੜ੍ਹੀ ਕਰਣ ਹੈ।", steps: [`sin30°=${s.height}/L=1/2।`, `ਇਸ ਲਈ L=2×${s.height}=${s.length} m।`], trap: "ਇੱਥੇ ਸੀੜ੍ਹੀ ਦੀ ਲੰਬਾਈ ਕਰਣ ਹੈ; tangent ਨਾ ਵਰਤੋ।" };
    case "TRG-002-QL-048": return hi ? { stem: `${s.height} m ऊँचे मस्तूल के शीर्ष से एक सहारा-तार समतल जमीन पर एक लंगर-बिंदु तक लगा है। तार जमीन के साथ 45° का कोण बनाता है। मस्तूल के आधार से लंगर-बिंदु तक क्षैतिज दूरी ज्ञात कीजिए।`, rule: "45° पर मस्तूल की ऊँचाई और जमीन की क्षैतिज दूरी बराबर होती हैं।", steps: [`दूरी d मानें। tan45°=${s.height}/d=1।`, `अतः d=${s.height} m।`], trap: "माँगी गई दूरी जमीन पर है, तार की लंबाई नहीं।" } : { stem: `${s.height} m ਉੱਚੇ ਮਸਤੂਲ ਦੀ ਚੋਟੀ ਤੋਂ ਇੱਕ ਸਹਾਰਾ-ਤਾਰ ਸਮਤਲ ਜ਼ਮੀਨ ਦੇ ਲੰਗਰ-ਬਿੰਦੂ ਤੱਕ ਲੱਗਿਆ ਹੈ। ਤਾਰ ਜ਼ਮੀਨ ਨਾਲ 45° ਦਾ ਕੋਣ ਬਣਾਉਂਦਾ ਹੈ। ਮਸਤੂਲ ਦੇ ਅਧਾਰ ਤੋਂ ਲੰਗਰ-ਬਿੰਦੂ ਤੱਕ ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢੋ।`, rule: "45° 'ਤੇ ਮਸਤੂਲ ਦੀ ਉਚਾਈ ਅਤੇ ਜ਼ਮੀਨੀ ਖਿਤਿਜੀ ਦੂਰੀ ਬਰਾਬਰ ਹੁੰਦੀਆਂ ਹਨ।", steps: [`ਦੂਰੀ d ਮੰਨੋ। tan45°=${s.height}/d=1।`, `ਇਸ ਲਈ d=${s.height} m।`], trap: "ਮੰਗੀ ਦੂਰੀ ਜ਼ਮੀਨ ਉੱਤੇ ਹੈ, ਤਾਰ ਦੀ ਲੰਬਾਈ ਨਹੀਂ।" };
    case "TRG-002-QL-059": return hi ? { stem: `एक मीनार ${s.height} m ऊँची है। एक पर्यवेक्षक पहले उसके शीर्ष को 30° के उन्नयन कोण पर देखता है और फिर मीनार की ओर सीधा चलता है, जहाँ कोण 60° हो जाता है। वह सटीक कितनी दूरी चला?`, rule: "दोनों स्थितियों की मीनार से क्षैतिज दूरी निकालें और दूर वाली दूरी में से निकट वाली दूरी घटाएँ।", steps: [`30° पर दूरी=${s.far} m।`, `60° पर दूरी=${s.near} m।`, `चली दूरी=${s.far}−${s.near}=${s.movement} m।`], trap: "दोनों दूरियों को जोड़ना नहीं है।" } : { stem: `ਇੱਕ ਮੀਨਾਰ ${s.height} m ਉੱਚੀ ਹੈ। ਇੱਕ ਨਿਰੀਖਕ ਪਹਿਲਾਂ ਇਸ ਦੀ ਚੋਟੀ ਨੂੰ 30° ਦੇ ਉਚਾਣ ਕੋਣ 'ਤੇ ਵੇਖਦਾ ਹੈ ਅਤੇ ਫਿਰ ਮੀਨਾਰ ਵੱਲ ਸਿੱਧਾ ਤੁਰਦਾ ਹੈ, ਜਿੱਥੇ ਕੋਣ 60° ਹੋ ਜਾਂਦਾ ਹੈ। ਉਹ ਸਟੀਕ ਕਿੰਨੀ ਦੂਰੀ ਤੁਰਿਆ?`, rule: "ਦੋਵੇਂ ਥਾਵਾਂ ਦੀ ਮੀਨਾਰ ਤੋਂ ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢੋ ਅਤੇ ਦੂਰਲੀ ਦੂਰੀ ਵਿਚੋਂ ਨੇੜਲੀ ਦੂਰੀ ਘਟਾਓ।", steps: [`30° 'ਤੇ ਦੂਰੀ=${s.far} m।`, `60° 'ਤੇ ਦੂਰੀ=${s.near} m।`, `ਤੁਰੀ ਦੂਰੀ=${s.far}−${s.near}=${s.movement} m।`], trap: "ਦੋਵੇਂ ਦੂਰੀਆਂ ਨੂੰ ਜੋੜਨਾ ਨਹੀਂ ਹੈ।" };
    case "TRG-002-QL-063": return hi ? { stem: `एक इमारत ${s.height} m ऊँची है। पर्यवेक्षक पहले उसके शीर्ष को 60° के उन्नयन कोण पर देखता है और फिर सीधा दूर चलता है, जहाँ कोण 30° हो जाता है। इमारत से उसकी अंतिम सटीक क्षैतिज दूरी ज्ञात कीजिए।`, rule: "अंतिम 30° का अवलोकन ही अंतिम दूरी निर्धारित करता है।", steps: [`अंतिम दूरी d मानें। tan30°=${s.height}/d।`, `अतः d=${s.height}√3=${s.far} m।`], trap: "यहाँ अंतिम दूरी पूछी गई है, चली हुई दूरी नहीं।" } : { stem: `ਇੱਕ ਇਮਾਰਤ ${s.height} m ਉੱਚੀ ਹੈ। ਨਿਰੀਖਕ ਪਹਿਲਾਂ ਇਸ ਦੀ ਚੋਟੀ ਨੂੰ 60° ਦੇ ਉਚਾਣ ਕੋਣ 'ਤੇ ਵੇਖਦਾ ਹੈ ਅਤੇ ਫਿਰ ਸਿੱਧਾ ਦੂਰ ਤੁਰਦਾ ਹੈ, ਜਿੱਥੇ ਕੋਣ 30° ਹੋ ਜਾਂਦਾ ਹੈ। ਇਮਾਰਤ ਤੋਂ ਉਸ ਦੀ ਅੰਤਿਮ ਸਟੀਕ ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢੋ।`, rule: "ਅੰਤਿਮ 30° ਵਾਲਾ ਨਿਰੀਖਣ ਹੀ ਅੰਤਿਮ ਦੂਰੀ ਨਿਰਧਾਰਤ ਕਰਦਾ ਹੈ।", steps: [`ਅੰਤਿਮ ਦੂਰੀ d ਮੰਨੋ। tan30°=${s.height}/d।`, `ਇਸ ਲਈ d=${s.height}√3=${s.far} m।`], trap: "ਇੱਥੇ ਅੰਤਿਮ ਦੂਰੀ ਪੁੱਛੀ ਗਈ ਹੈ, ਤੁਰੀ ਹੋਈ ਦੂਰੀ ਨਹੀਂ।" };
    case "TRG-002-QL-064": return hi ? { stem: `एक मीनार ${s.height} m ऊँची है। एक बिंदु से उसके शीर्ष का उन्नयन कोण 60° है। पर्यवेक्षक मीनार से सीधा दूर चलता है, जहाँ कोण 30° हो जाता है। वह सटीक कितनी दूरी चला?`, rule: "पहले 60° और 30° वाली दोनों क्षैतिज दूरियाँ निकालें, फिर अंतिम में से प्रारंभिक दूरी घटाएँ।", steps: [`प्रारंभिक दूरी=${s.near} m।`, `अंतिम दूरी=${s.far} m; चली दूरी=${s.far}−${s.near}=${s.movement} m।`], trap: "दूर जाने पर अंतिम दूरी बड़ी होती है, इसलिए अंतिम−प्रारंभिक करें।" } : { stem: `ਇੱਕ ਮੀਨਾਰ ${s.height} m ਉੱਚੀ ਹੈ। ਇੱਕ ਬਿੰਦੂ ਤੋਂ ਇਸ ਦੀ ਚੋਟੀ ਦਾ ਉਚਾਣ ਕੋਣ 60° ਹੈ। ਨਿਰੀਖਕ ਮੀਨਾਰ ਤੋਂ ਸਿੱਧਾ ਦੂਰ ਤੁਰਦਾ ਹੈ, ਜਿੱਥੇ ਕੋਣ 30° ਹੋ ਜਾਂਦਾ ਹੈ। ਉਹ ਸਟੀਕ ਕਿੰਨੀ ਦੂਰੀ ਤੁਰਿਆ?`, rule: "ਪਹਿਲਾਂ 60° ਅਤੇ 30° ਵਾਲੀਆਂ ਦੋਵੇਂ ਖਿਤਿਜੀ ਦੂਰੀਆਂ ਕੱਢੋ, ਫਿਰ ਅੰਤਿਮ ਵਿਚੋਂ ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ ਘਟਾਓ।", steps: [`ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ=${s.near} m।`, `ਅੰਤਿਮ ਦੂਰੀ=${s.far} m; ਤੁਰੀ ਦੂਰੀ=${s.far}−${s.near}=${s.movement} m।`], trap: "ਦੂਰ ਜਾਣ 'ਤੇ ਅੰਤਿਮ ਦੂਰੀ ਵੱਡੀ ਹੁੰਦੀ ਹੈ, ਇਸ ਲਈ ਅੰਤਿਮ−ਸ਼ੁਰੂਆਤੀ ਕਰੋ।" };
    case "TRG-002-QL-068": return hi ? { stem: `एक ${s.height} m ऊँची मीनार के एक ही ओर और उसके आधार के साथ एक ही सीधी रेखा पर दो बिंदु हैं। उनसे शीर्ष के उन्नयन कोण 60° और 30° हैं। दोनों बिंदुओं के बीच सटीक दूरी ज्ञात कीजिए।`, rule: "60° वाला बिंदु निकट और 30° वाला बिंदु दूर है; मीनार से उनकी दूरियों का अंतर लें।", steps: [`निकट दूरी=${s.near} m और दूर दूरी=${s.far} m।`, `अंतर=${s.far}−${s.near}=${s.separation} m।`], trap: "दोनों बिंदु एक ही ओर हैं, इसलिए दूरियाँ जोड़ें नहीं।" } : { stem: `ਇੱਕ ${s.height} m ਉੱਚੀ ਮੀਨਾਰ ਦੇ ਇੱਕੋ ਪਾਸੇ ਅਤੇ ਇਸ ਦੇ ਅਧਾਰ ਨਾਲ ਇੱਕੋ ਸਿੱਧੀ ਰੇਖਾ ਉੱਤੇ ਦੋ ਬਿੰਦੂ ਹਨ। ਉਨ੍ਹਾਂ ਤੋਂ ਚੋਟੀ ਦੇ ਉਚਾਣ ਕੋਣ 60° ਅਤੇ 30° ਹਨ। ਦੋਵੇਂ ਬਿੰਦੂਆਂ ਵਿਚਕਾਰ ਸਟੀਕ ਦੂਰੀ ਕੱਢੋ।`, rule: "60° ਵਾਲਾ ਬਿੰਦੂ ਨੇੜੇ ਅਤੇ 30° ਵਾਲਾ ਬਿੰਦੂ ਦੂਰ ਹੈ; ਮੀਨਾਰ ਤੋਂ ਉਨ੍ਹਾਂ ਦੀਆਂ ਦੂਰੀਆਂ ਦਾ ਅੰਤਰ ਲਵੋ।", steps: [`ਨੇੜਲੀ ਦੂਰੀ=${s.near} m ਅਤੇ ਦੂਰਲੀ ਦੂਰੀ=${s.far} m।`, `ਅੰਤਰ=${s.far}−${s.near}=${s.separation} m।`], trap: "ਦੋਵੇਂ ਬਿੰਦੂ ਇੱਕੋ ਪਾਸੇ ਹਨ, ਇਸ ਲਈ ਦੂਰੀਆਂ ਨਾ ਜੋੜੋ।" };
    case "TRG-002-QL-070": return hi ? { stem: `एक अवलोकन बिंदु के एक ही ओर दो मीनारें हैं। निकट मीनार ${s.nearHeight} m ऊँची है और उसका उन्नयन कोण 45° है। दूर मीनार ${s.farHeight} m ऊँची है और उसका उन्नयन कोण 60° है। दोनों मीनारों के आधारों के बीच सटीक दूरी ज्ञात कीजिए।`, rule: "दोनों मीनारों की अवलोकन बिंदु से क्षैतिज दूरी अलग-अलग निकालें और उनका अंतर लें।", steps: [`निकट मीनार की दूरी=${s.nearDistance} m।`, `दूर मीनार की दूरी=${s.farDistance} m।`, `आधारों के बीच दूरी=${s.farDistance}−${s.nearDistance}=${s.separation} m।`], trap: "मीनारों की ऊँचाइयों का अंतर उत्तर नहीं है।" } : { stem: `ਇੱਕ ਨਿਰੀਖਣ ਬਿੰਦੂ ਦੇ ਇੱਕੋ ਪਾਸੇ ਦੋ ਮੀਨਾਰਾਂ ਹਨ। ਨੇੜਲੀ ਮੀਨਾਰ ${s.nearHeight} m ਉੱਚੀ ਹੈ ਅਤੇ ਇਸ ਦਾ ਉਚਾਣ ਕੋਣ 45° ਹੈ। ਦੂਰਲੀ ਮੀਨਾਰ ${s.farHeight} m ਉੱਚੀ ਹੈ ਅਤੇ ਇਸ ਦਾ ਉਚਾਣ ਕੋਣ 60° ਹੈ। ਦੋਵੇਂ ਮੀਨਾਰਾਂ ਦੇ ਅਧਾਰਾਂ ਵਿਚਕਾਰ ਸਟੀਕ ਦੂਰੀ ਕੱਢੋ।`, rule: "ਦੋਵੇਂ ਮੀਨਾਰਾਂ ਦੀ ਨਿਰੀਖਣ ਬਿੰਦੂ ਤੋਂ ਖਿਤਿਜੀ ਦੂਰੀ ਵੱਖ-ਵੱਖ ਕੱਢੋ ਅਤੇ ਉਨ੍ਹਾਂ ਦਾ ਅੰਤਰ ਲਵੋ।", steps: [`ਨੇੜਲੀ ਮੀਨਾਰ ਦੀ ਦੂਰੀ=${s.nearDistance} m।`, `ਦੂਰਲੀ ਮੀਨਾਰ ਦੀ ਦੂਰੀ=${s.farDistance} m।`, `ਅਧਾਰਾਂ ਵਿਚਕਾਰ ਦੂਰੀ=${s.farDistance}−${s.nearDistance}=${s.separation} m।`], trap: "ਮੀਨਾਰਾਂ ਦੀਆਂ ਉਚਾਈਆਂ ਦਾ ਅੰਤਰ ਉੱਤਰ ਨਹੀਂ ਹੈ।" };
    case "TRG-002-QL-074": return hi ? { stem: `एक पर्यवेक्षक की आँख समतल जमीन से 1.5 m ऊपर है और वह इमारत से ${s.run} m की क्षैतिज दूरी पर है। इमारत के शीर्ष का उन्नयन कोण 30° है। इमारत की सटीक कुल ऊँचाई ज्ञात कीजिए।`, rule: "tangent से आँख के स्तर से ऊपर की वृद्धि निकालें और उसमें आँख की ऊँचाई एक बार जोड़ें।", steps: [`आँख के स्तर से ऊपर वृद्धि=${s.run}×tan30°=${s.rise} m।`, `इमारत की ऊँचाई=${s.rise}+1.5=${s.total} m।`], trap: "1.5 m आँख की ऊँचाई न छोड़ें और न ही दो बार जोड़ें।" } : { stem: `ਇੱਕ ਨਿਰੀਖਕ ਦੀ ਅੱਖ ਸਮਤਲ ਜ਼ਮੀਨ ਤੋਂ 1.5 m ਉੱਪਰ ਹੈ ਅਤੇ ਉਹ ਇਮਾਰਤ ਤੋਂ ${s.run} m ਖਿਤਿਜੀ ਦੂਰੀ 'ਤੇ ਹੈ। ਇਮਾਰਤ ਦੀ ਚੋਟੀ ਦਾ ਉਚਾਣ ਕੋਣ 30° ਹੈ। ਇਮਾਰਤ ਦੀ ਸਟੀਕ ਕੁੱਲ ਉਚਾਈ ਕੱਢੋ।`, rule: "tangent ਨਾਲ ਅੱਖ ਦੇ ਪੱਧਰ ਤੋਂ ਉੱਪਰ ਦੀ ਵਾਧੂ ਉਚਾਈ ਕੱਢੋ ਅਤੇ ਅੱਖ ਦੀ ਉਚਾਈ ਇੱਕ ਵਾਰ ਜੋੜੋ।", steps: [`ਅੱਖ ਦੇ ਪੱਧਰ ਤੋਂ ਉੱਪਰ ਵਾਧਾ=${s.run}×tan30°=${s.rise} m।`, `ਇਮਾਰਤ ਦੀ ਉਚਾਈ=${s.rise}+1.5=${s.total} m।`], trap: "1.5 m ਅੱਖ ਦੀ ਉਚਾਈ ਨਾ ਛੱਡੋ ਅਤੇ ਨਾ ਹੀ ਦੋ ਵਾਰ ਜੋੜੋ।" };
    case "TRG-002-QL-084": return hi ? { stem: `पहली इमारत ${s.first} m ऊँची है और दूसरी इमारत उसके आधार से ${s.run} m की क्षैतिज दूरी पर है। पहली इमारत की छत से दूसरी इमारत का शीर्ष 30° के उन्नयन कोण पर दिखाई देता है। दूसरी इमारत की सटीक ऊँचाई ज्ञात कीजिए।`, rule: "पहली छत से दूसरी छत तक की वृद्धि निकालें और उसे पहली इमारत की ऊँचाई में जोड़ें।", steps: [`छतों के बीच वृद्धि=${s.run}×tan30°=${s.rise} m।`, `पहली छत जमीन से ${s.first} m ऊपर है।`, `दूसरी इमारत की ऊँचाई=${s.first}+${s.rise}=${s.second} m।`], trap: "केवल छतों के बीच की वृद्धि को दूसरी इमारत की पूरी ऊँचाई न मानें।" } : { stem: `ਪਹਿਲੀ ਇਮਾਰਤ ${s.first} m ਉੱਚੀ ਹੈ ਅਤੇ ਦੂਜੀ ਇਮਾਰਤ ਇਸ ਦੇ ਅਧਾਰ ਤੋਂ ${s.run} m ਖਿਤਿਜੀ ਦੂਰੀ 'ਤੇ ਹੈ। ਪਹਿਲੀ ਇਮਾਰਤ ਦੀ ਛੱਤ ਤੋਂ ਦੂਜੀ ਇਮਾਰਤ ਦੀ ਚੋਟੀ 30° ਦੇ ਉਚਾਣ ਕੋਣ 'ਤੇ ਦਿਖਾਈ ਦਿੰਦੀ ਹੈ। ਦੂਜੀ ਇਮਾਰਤ ਦੀ ਸਟੀਕ ਉਚਾਈ ਕੱਢੋ।`, rule: "ਪਹਿਲੀ ਛੱਤ ਤੋਂ ਦੂਜੀ ਛੱਤ ਤੱਕ ਦਾ ਵਾਧਾ ਕੱਢੋ ਅਤੇ ਇਸ ਨੂੰ ਪਹਿਲੀ ਇਮਾਰਤ ਦੀ ਉਚਾਈ ਵਿੱਚ ਜੋੜੋ।", steps: [`ਛੱਤਾਂ ਵਿਚਕਾਰ ਵਾਧਾ=${s.run}×tan30°=${s.rise} m।`, `ਪਹਿਲੀ ਛੱਤ ਜ਼ਮੀਨ ਤੋਂ ${s.first} m ਉੱਪਰ ਹੈ।`, `ਦੂਜੀ ਇਮਾਰਤ ਦੀ ਉਚਾਈ=${s.first}+${s.rise}=${s.second} m।`], trap: "ਸਿਰਫ਼ ਛੱਤਾਂ ਵਿਚਕਾਰ ਵਾਧੇ ਨੂੰ ਦੂਜੀ ਇਮਾਰਤ ਦੀ ਪੂਰੀ ਉਚਾਈ ਨਾ ਮੰਨੋ।" };
    case "TRG-002-QL-085": return hi ? { stem: `पहली इमारत ${s.first} m ऊँची है और एक छोटी इमारत उसके आधार से ${s.run} m की क्षैतिज दूरी पर है। पहली इमारत की छत से छोटी इमारत का शीर्ष 60° के अवनमन कोण पर दिखाई देता है। छोटी इमारत की सटीक ऊँचाई ज्ञात कीजिए।`, rule: "ऊँची छत से छोटी छत तक की गिरावट निकालें और उसे पहली इमारत की ऊँचाई से घटाएँ।", steps: [`छतों के बीच गिरावट=${s.run}×tan60°=${s.drop} m।`, `पहली छत जमीन से ${s.first} m ऊपर है।`, `छोटी इमारत की ऊँचाई=${s.first}−${s.drop}=${s.second} m।`], trap: "क्षैतिज दूरी को ऊँचाई की गिरावट न मानें।" } : { stem: `ਪਹਿਲੀ ਇਮਾਰਤ ${s.first} m ਉੱਚੀ ਹੈ ਅਤੇ ਇੱਕ ਛੋਟੀ ਇਮਾਰਤ ਇਸ ਦੇ ਅਧਾਰ ਤੋਂ ${s.run} m ਖਿਤਿਜੀ ਦੂਰੀ 'ਤੇ ਹੈ। ਪਹਿਲੀ ਇਮਾਰਤ ਦੀ ਛੱਤ ਤੋਂ ਛੋਟੀ ਇਮਾਰਤ ਦੀ ਚੋਟੀ 60° ਦੇ ਨਿਵਾਣ ਕੋਣ 'ਤੇ ਦਿਖਾਈ ਦਿੰਦੀ ਹੈ। ਛੋਟੀ ਇਮਾਰਤ ਦੀ ਸਟੀਕ ਉਚਾਈ ਕੱਢੋ।`, rule: "ਉੱਚੀ ਛੱਤ ਤੋਂ ਛੋਟੀ ਛੱਤ ਤੱਕ ਦੀ ਘਟਾਅ ਕੱਢੋ ਅਤੇ ਇਸ ਨੂੰ ਪਹਿਲੀ ਇਮਾਰਤ ਦੀ ਉਚਾਈ ਵਿਚੋਂ ਘਟਾਓ।", steps: [`ਛੱਤਾਂ ਵਿਚਕਾਰ ਘਟਾਅ=${s.run}×tan60°=${s.drop} m।`, `ਪਹਿਲੀ ਛੱਤ ਜ਼ਮੀਨ ਤੋਂ ${s.first} m ਉੱਪਰ ਹੈ।`, `ਛੋਟੀ ਇਮਾਰਤ ਦੀ ਉਚਾਈ=${s.first}−${s.drop}=${s.second} m।`], trap: "ਖਿਤਿਜੀ ਦੂਰੀ ਨੂੰ ਉਚਾਈ ਦੀ ਘਟਾਅ ਨਾ ਮੰਨੋ।" };
  }
}

function localize(question: Trg002MvpQuestion, qlId: Trg002V4NaturalMeasurementId, locale: NaturalLocale, surface: Surface) {
  if (locale === "en") return question;
  const localized = localizedSurface(qlId, locale, surface);
  if (!localized) throw new Error(`${qlId}:${locale}: missing V4 natural-measurement localization.`);
  return {
    ...question,
    stem: localized.stem,
    explanation: {
      keyRule: localized.rule,
      steps: localized.steps.map((body, index) => ({ title: index === localized.steps.length - 1 ? (locale === "hi-IN" ? "उत्तर" : "ਉੱਤਰ") : (locale === "hi-IN" ? `चरण ${index + 1}` : `ਕਦਮ ${index + 1}`), body })),
      shortcut: localized.rule,
      traps: [localized.trap],
    },
    humanReviewStatus: "PENDING" as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}

export function isTrg002V4NaturalMeasurementOverride(qlId: string): qlId is Trg002V4NaturalMeasurementId {
  return NATURAL_ID_SET.has(qlId);
}

export function trg002V4NaturalMeasurementScenarioId(qlId: string) {
  const ids: Record<string, string> = {
    "TRG-002-QL-006": "GROUND_ELECTRIC_POLE",
    "TRG-002-QL-010": "GROUND_TOWER",
    "TRG-002-QL-011": "GROUND_FLAGPOLE",
    "TRG-002-QL-013": "GROUND_TOWER",
    "TRG-002-QL-016": "URBAN_ROOFTOP_TO_TOWER",
    "TRG-002-QL-017": "URBAN_ROOFTOP_TO_TOWER",
    "TRG-002-QL-029": "SHADOW_TOWER_DIRECT",
    "TRG-002-QL-031": "SHADOW_TOWER_DIRECT",
    "TRG-002-QL-039": "SUPPORT_LADDER_WALL",
    "TRG-002-QL-040": "SUPPORT_LADDER_WALL",
    "TRG-002-QL-048": "SUPPORT_GUY_WIRE_POLE",
    "TRG-002-QL-059": "MOVE_PERSON_TOWARD_TOWER",
    "TRG-002-QL-063": "MOVE_PERSON_AWAY_FROM_BUILDING",
    "TRG-002-QL-064": "ROAD_CAR_RECEDES_POLE",
    "TRG-002-QL-068": "MOVE_PERSON_TOWARD_TOWER",
    "TRG-002-QL-070": "MULTI_TWO_TOWERS_SAME_SIDE",
    "TRG-002-QL-074": "MULTI_OBSERVER_EYE_LEVEL",
    "TRG-002-QL-084": "URBAN_TWO_BUILDINGS",
    "TRG-002-QL-085": "URBAN_TWO_BUILDINGS",
  };
  return ids[qlId];
}

export function trg002V4NaturalMeasurementTopology(qlId: string): Trg002SpatialTopology | undefined {
  const map: Record<string, Trg002SpatialTopology> = {
    "TRG-002-QL-006": "SINGLE_RIGHT_TRIANGLE", "TRG-002-QL-010": "SINGLE_RIGHT_TRIANGLE", "TRG-002-QL-011": "SINGLE_RIGHT_TRIANGLE", "TRG-002-QL-013": "SINGLE_RIGHT_TRIANGLE",
    "TRG-002-QL-016": "ELEVATED_OBSERVER", "TRG-002-QL-017": "ELEVATED_OBSERVER",
    "TRG-002-QL-029": "SHADOW_COMPARISON", "TRG-002-QL-031": "SHADOW_COMPARISON",
    "TRG-002-QL-039": "SUPPORT_TRIANGLE", "TRG-002-QL-040": "SUPPORT_TRIANGLE", "TRG-002-QL-048": "SUPPORT_TRIANGLE",
    "TRG-002-QL-059": "SAME_SIDE_TWO_POSITIONS", "TRG-002-QL-063": "SAME_SIDE_TWO_POSITIONS", "TRG-002-QL-064": "SAME_SIDE_TWO_POSITIONS", "TRG-002-QL-068": "SAME_SIDE_TWO_POSITIONS",
    "TRG-002-QL-070": "TWO_VERTICAL_OBJECTS", "TRG-002-QL-074": "SINGLE_RIGHT_TRIANGLE", "TRG-002-QL-084": "TWO_VERTICAL_OBJECTS", "TRG-002-QL-085": "TWO_VERTICAL_OBJECTS",
  };
  return map[qlId];
}

export function generateTrg002V4NaturalMeasurementQuestion(qlId: Trg002V4NaturalMeasurementId, seed: string, locale: NaturalLocale) {
  const built = buildNaturalCanonical(qlId, seed);
  return localize(built.question, qlId, locale, built.surface);
}
