import type { AngleMeasure, ExactTrigNumber } from "../../foundation/types";
import { addExact, exactInteger, exactKey, subtractExact } from "../../foundation/exact";
import type {
  Trg002DiagramStrategy,
  Trg002Scenario,
  Trg002SpatialPoint,
  Trg002SpatialState,
  Trg002VerticalObject,
} from "./types";
import {
  ladderAgainstWall,
  oppositeSideObservationSystem,
  sameSideTwoObservationSystem,
  singleDepressionTargetHeight,
  singleElevationObjectHeight,
} from "./solver";

function point(
  id: string,
  x: ExactTrigNumber,
  y: ExactTrigNumber,
  role: Trg002SpatialPoint["role"],
  label?: string,
): Trg002SpatialPoint {
  return { id, x, y, role, label };
}

function verticalObject(
  id: string,
  kind: Trg002VerticalObject["kind"],
  basePointId: string,
  topPointId: string,
  height: ExactTrigNumber,
): Trg002VerticalObject {
  return { id, kind, basePointId, topPointId, height };
}

export function buildSingleElevationState(input: {
  horizontal: ExactTrigNumber;
  angle: AngleMeasure;
  eyeHeight?: ExactTrigNumber;
  scenario?: Trg002Scenario;
  objectKind?: Trg002VerticalObject["kind"];
  units?: "m" | "ft" | "units";
  diagramStrategy?: Trg002DiagramStrategy;
}): Trg002SpatialState {
  const ground = exactInteger(0);
  const eyeHeight = input.eyeHeight ?? ground;
  const objectHeight = singleElevationObjectHeight(input.horizontal, input.angle, eyeHeight);
  const points = [
    point("object-base", ground, ground, "OBJECT_BASE", "B"),
    point("object-top", ground, objectHeight, "OBJECT_TOP", "T"),
    point("observer-ground", input.horizontal, ground, "OBSERVER_GROUND", "O"),
    point("observer-eye", input.horizontal, eyeHeight, "OBSERVER_EYE", "E"),
  ];
  return {
    packageId: "TRG-002",
    scenario: input.scenario ?? "TOWER",
    groundY: ground,
    points,
    verticalObjects: [verticalObject("object-1", input.objectKind ?? "TOWER", "object-base", "object-top", objectHeight)],
    observers: [{ id: "observer-1", groundPointId: "observer-ground", eyePointId: "observer-eye", eyeHeight }],
    observations: [{
      id: "obs-1",
      observerId: "observer-1",
      eyePointId: "observer-eye",
      targetPointId: "object-top",
      classification: "ELEVATION",
      angle: input.angle,
      horizontalReference: "EYE_LEVEL",
    }],
    movements: [],
    requested: { kind: "OBJECT_HEIGHT", objectId: "object-1" },
    diagramStrategy: input.diagramStrategy ?? (exactKey(eyeHeight) === exactKey(ground) ? "SINGLE_ELEVATION" : "OBSERVER_HEIGHT"),
    metadata: { units: input.units ?? "m", sameSide: true },
  };
}

export function buildSingleDepressionState(input: {
  horizontal: ExactTrigNumber;
  angle: AngleMeasure;
  observerEyeHeight: ExactTrigNumber;
  targetHeight?: ExactTrigNumber;
  units?: "m" | "ft" | "units";
}): Trg002SpatialState {
  const ground = exactInteger(0);
  const computedTarget = singleDepressionTargetHeight(input.observerEyeHeight, input.horizontal, input.angle);
  const targetHeight = input.targetHeight ?? computedTarget;
  const points = [
    point("observer-ground", ground, ground, "OBSERVER_GROUND", "O"),
    point("observer-eye", ground, input.observerEyeHeight, "OBSERVER_EYE", "E"),
    point("target-ground", input.horizontal, ground, "GROUND", "G"),
    point("target", input.horizontal, targetHeight, "AUXILIARY", "P"),
  ];
  return {
    packageId: "TRG-002",
    scenario: "BUILDING",
    groundY: ground,
    points,
    verticalObjects: [],
    observers: [{ id: "observer-1", groundPointId: "observer-ground", eyePointId: "observer-eye", eyeHeight: input.observerEyeHeight }],
    observations: [{
      id: "obs-1",
      observerId: "observer-1",
      eyePointId: "observer-eye",
      targetPointId: "target",
      classification: "DEPRESSION",
      angle: input.angle,
      horizontalReference: "EYE_LEVEL",
    }],
    movements: [],
    requested: { kind: "HORIZONTAL_DISTANCE", fromPointId: "observer-ground", toPointId: "target-ground" },
    diagramStrategy: "SINGLE_DEPRESSION",
    metadata: { units: input.units ?? "m", sameSide: true, notes: ["Target height must match the canonical depression relation when provided."] },
  };
}

export function buildSameSideMovingState(input: {
  farAngle: AngleMeasure;
  nearAngle: AngleMeasure;
  movementTowardObject: ExactTrigNumber;
  eyeHeight?: ExactTrigNumber;
  units?: "m" | "ft" | "units";
}): Trg002SpatialState {
  const ground = exactInteger(0);
  const eyeHeight = input.eyeHeight ?? ground;
  const solved = sameSideTwoObservationSystem(input.farAngle, input.nearAngle, input.movementTowardObject);
  const objectHeight = addExact(eyeHeight, solved.verticalDelta);
  const points = [
    point("object-base", ground, ground, "OBJECT_BASE", "B"),
    point("object-top", ground, objectHeight, "OBJECT_TOP", "T"),
    point("far-ground", solved.farDistance, ground, "OBSERVER_GROUND", "F"),
    point("far-eye", solved.farDistance, eyeHeight, "OBSERVER_EYE", "Fₑ"),
    point("near-ground", solved.nearDistance, ground, "OBSERVER_GROUND", "N"),
    point("near-eye", solved.nearDistance, eyeHeight, "OBSERVER_EYE", "Nₑ"),
  ];
  return {
    packageId: "TRG-002",
    scenario: "TOWER",
    groundY: ground,
    points,
    verticalObjects: [verticalObject("object-1", "TOWER", "object-base", "object-top", objectHeight)],
    observers: [
      { id: "observer-far", groundPointId: "far-ground", eyePointId: "far-eye", eyeHeight },
      { id: "observer-near", groundPointId: "near-ground", eyePointId: "near-eye", eyeHeight },
    ],
    observations: [
      { id: "obs-far", observerId: "observer-far", eyePointId: "far-eye", targetPointId: "object-top", classification: "ELEVATION", angle: input.farAngle, horizontalReference: "EYE_LEVEL" },
      { id: "obs-near", observerId: "observer-near", eyePointId: "near-eye", targetPointId: "object-top", classification: "ELEVATION", angle: input.nearAngle, horizontalReference: "EYE_LEVEL" },
    ],
    movements: [{
      id: "movement-1",
      observerId: "observer-far",
      fromGroundPointId: "far-ground",
      toGroundPointId: "near-ground",
      referenceObjectId: "object-1",
      direction: "CLOSER",
      distance: input.movementTowardObject,
    }],
    requested: { kind: "OBJECT_HEIGHT", objectId: "object-1" },
    diagramStrategy: "OBSERVER_MOVES_CLOSER",
    metadata: { units: input.units ?? "m", sameSide: true, observerOrder: ["object-base", "near-ground", "far-ground"] },
  };
}

export function buildOppositeSideState(input: {
  leftAngle: AngleMeasure;
  rightAngle: AngleMeasure;
  observerSeparation: ExactTrigNumber;
  eyeHeight?: ExactTrigNumber;
  units?: "m" | "ft" | "units";
}): Trg002SpatialState {
  const ground = exactInteger(0);
  const eyeHeight = input.eyeHeight ?? ground;
  const solved = oppositeSideObservationSystem(input.leftAngle, input.rightAngle, input.observerSeparation);
  const objectX = solved.leftDistance;
  const objectHeight = addExact(eyeHeight, solved.verticalDelta);
  const points = [
    point("left-ground", ground, ground, "OBSERVER_GROUND", "L"),
    point("left-eye", ground, eyeHeight, "OBSERVER_EYE", "Lₑ"),
    point("object-base", objectX, ground, "OBJECT_BASE", "B"),
    point("object-top", objectX, objectHeight, "OBJECT_TOP", "T"),
    point("right-ground", input.observerSeparation, ground, "OBSERVER_GROUND", "R"),
    point("right-eye", input.observerSeparation, eyeHeight, "OBSERVER_EYE", "Rₑ"),
  ];
  return {
    packageId: "TRG-002",
    scenario: "TOWER",
    groundY: ground,
    points,
    verticalObjects: [verticalObject("object-1", "TOWER", "object-base", "object-top", objectHeight)],
    observers: [
      { id: "observer-left", groundPointId: "left-ground", eyePointId: "left-eye", eyeHeight },
      { id: "observer-right", groundPointId: "right-ground", eyePointId: "right-eye", eyeHeight },
    ],
    observations: [
      { id: "obs-left", observerId: "observer-left", eyePointId: "left-eye", targetPointId: "object-top", classification: "ELEVATION", angle: input.leftAngle, horizontalReference: "EYE_LEVEL" },
      { id: "obs-right", observerId: "observer-right", eyePointId: "right-eye", targetPointId: "object-top", classification: "ELEVATION", angle: input.rightAngle, horizontalReference: "EYE_LEVEL" },
    ],
    movements: [],
    requested: { kind: "OBJECT_HEIGHT", objectId: "object-1" },
    diagramStrategy: "OPPOSITE_SIDE_OBSERVATIONS",
    metadata: { units: input.units ?? "m", oppositeSide: true, observerOrder: ["left-ground", "object-base", "right-ground"] },
  };
}

export function buildLadderState(input: {
  ladderLength: ExactTrigNumber;
  angleAtGround: AngleMeasure;
  units?: "m" | "ft" | "units";
}): Trg002SpatialState {
  const ground = exactInteger(0);
  const solved = ladderAgainstWall(input.ladderLength, input.angleAtGround);
  const points = [
    point("wall-base", ground, ground, "OBJECT_BASE", "W"),
    point("wall-contact", ground, solved.verticalHeight, "LADDER_CONTACT", "C"),
    point("ladder-base", solved.baseDistance, ground, "GROUND", "A"),
  ];
  return {
    packageId: "TRG-002",
    scenario: "LADDER",
    groundY: ground,
    points,
    verticalObjects: [verticalObject("wall-1", "WALL", "wall-base", "wall-contact", solved.verticalHeight)],
    observers: [],
    observations: [],
    movements: [],
    requested: { kind: "SIGHT_LINE_LENGTH", fromPointId: "ladder-base", toPointId: "wall-contact" },
    diagramStrategy: "LADDER",
    metadata: { units: input.units ?? "m", notes: ["The ladder is the hypotenuse of the canonical right triangle."] },
  };
}

export function buildObserverHeightElevationState(input: {
  horizontal: ExactTrigNumber;
  angle: AngleMeasure;
  eyeHeight: ExactTrigNumber;
  units?: "m" | "ft" | "units";
}): Trg002SpatialState {
  return buildSingleElevationState({
    horizontal: input.horizontal,
    angle: input.angle,
    eyeHeight: input.eyeHeight,
    scenario: "BUILDING",
    objectKind: "BUILDING",
    units: input.units,
    diagramStrategy: "OBSERVER_HEIGHT",
  });
}

export function horizontalSeparationBetweenPoints(
  state: Trg002SpatialState,
  firstPointId: string,
  secondPointId: string,
): ExactTrigNumber {
  const first = state.points.find((item) => item.id === firstPointId);
  const second = state.points.find((item) => item.id === secondPointId);
  if (!first || !second) throw new Error(`Unknown point pair ${firstPointId}/${secondPointId}.`);
  return subtractExact(second.x, first.x);
}
