import { exactToNumber } from "../../foundation/exact";
import { toDegrees } from "../../foundation/angle";
import type {
  Trg002SpatialPoint,
  Trg002SpatialState,
  Trg002SpatialVerificationCheck,
} from "./types";

const EPSILON = 1e-9;

function numberOf(value: any) {
  return exactToNumber(value);
}

function angleDegrees(value: any) {
  const degrees = toDegrees(value);
  return Number(degrees.numerator) / Number(degrees.denominator);
}

function pointMap(state: Trg002SpatialState) {
  return new Map(state.points.map((point) => [point.id, point]));
}

function pointOrThrow(points: Map<string, Trg002SpatialPoint>, id: string) {
  const point = points.get(id);
  if (!point) throw new Error(`TRG-002 verifier cannot resolve point ${id}.`);
  return point;
}

function push(checks: Trg002SpatialVerificationCheck[], name: string, passed: boolean, message: string, delta?: number) {
  checks.push({ name, passed, message, ...(delta === undefined ? {} : { delta }) });
}

export function verifyTrg002SpatialState(state: Trg002SpatialState) {
  const checks: Trg002SpatialVerificationCheck[] = [];
  const points = pointMap(state);
  const groundY = numberOf(state.groundY);

  push(checks, "UNIQUE_POINT_IDS", points.size === state.points.length, "Every canonical point ID is unique.");
  push(checks, "FINITE_COORDINATES", state.points.every((point) => Number.isFinite(numberOf(point.x)) && Number.isFinite(numberOf(point.y))), "All canonical coordinates are finite.");

  for (const point of state.points.filter((item) => ["GROUND", "OBJECT_BASE", "OBSERVER_GROUND"].includes(item.role))) {
    const delta = Math.abs(numberOf(point.y) - groundY);
    push(checks, `GROUND_${point.id}`, delta <= EPSILON, `${point.id} lies on the canonical ground line.`, delta);
  }

  for (const object of state.verticalObjects) {
    const base = pointOrThrow(points, object.basePointId);
    const top = pointOrThrow(points, object.topPointId);
    const horizontalDelta = Math.abs(numberOf(base.x) - numberOf(top.x));
    const heightDelta = Math.abs((numberOf(top.y) - numberOf(base.y)) - numberOf(object.height));
    push(checks, `VERTICAL_${object.id}`, horizontalDelta <= EPSILON, `${object.id} is vertical.`, horizontalDelta);
    push(checks, `HEIGHT_${object.id}`, heightDelta <= EPSILON && numberOf(object.height) > 0, `${object.id} height matches its coordinates and is positive.`, heightDelta);
  }

  for (const observer of state.observers) {
    const ground = pointOrThrow(points, observer.groundPointId);
    const eye = pointOrThrow(points, observer.eyePointId);
    const horizontalDelta = Math.abs(numberOf(ground.x) - numberOf(eye.x));
    const eyeDelta = Math.abs((numberOf(eye.y) - numberOf(ground.y)) - numberOf(observer.eyeHeight));
    push(checks, `OBSERVER_VERTICAL_${observer.id}`, horizontalDelta <= EPSILON, `${observer.id} eye is vertically above its ground point.`, horizontalDelta);
    push(checks, `EYE_HEIGHT_${observer.id}`, eyeDelta <= EPSILON && numberOf(observer.eyeHeight) >= 0, `${observer.id} eye height is applied exactly once.`, eyeDelta);
  }

  for (const observation of state.observations) {
    const eye = pointOrThrow(points, observation.eyePointId);
    const target = pointOrThrow(points, observation.targetPointId);
    const dx = numberOf(target.x) - numberOf(eye.x);
    const dy = numberOf(target.y) - numberOf(eye.y);
    const horizontal = Math.abs(dx);
    const derivedAngle = Math.atan2(Math.abs(dy), horizontal) * 180 / Math.PI;
    const expectedAngle = angleDegrees(observation.angle);
    const angleDelta = Math.abs(derivedAngle - expectedAngle);
    const classificationValid = observation.classification === "ELEVATION" ? dy > EPSILON : dy < -EPSILON;
    push(checks, `OBS_HORIZONTAL_${observation.id}`, horizontal > EPSILON, `${observation.id} has non-zero horizontal separation.`);
    push(checks, `OBS_CLASSIFICATION_${observation.id}`, classificationValid, `${observation.id} elevation/depression classification matches coordinate direction.`);
    push(checks, `OBS_ANGLE_${observation.id}`, angleDelta <= 1e-8, `${observation.id} atan2 angle matches the canonical exact angle.`, angleDelta);
  }

  for (const movement of state.movements) {
    const from = pointOrThrow(points, movement.fromGroundPointId);
    const to = pointOrThrow(points, movement.toGroundPointId);
    const object = state.verticalObjects.find((item) => item.id === movement.referenceObjectId);
    if (!object) {
      push(checks, `MOVEMENT_OBJECT_${movement.id}`, false, `${movement.id} references a missing object.`);
      continue;
    }
    const base = pointOrThrow(points, object.basePointId);
    const actualDistance = Math.abs(numberOf(from.x) - numberOf(to.x));
    const distanceDelta = Math.abs(actualDistance - numberOf(movement.distance));
    const fromObject = Math.abs(numberOf(from.x) - numberOf(base.x));
    const toObject = Math.abs(numberOf(to.x) - numberOf(base.x));
    const directionValid = movement.direction === "CLOSER" ? toObject < fromObject - EPSILON : toObject > fromObject + EPSILON;
    push(checks, `MOVEMENT_DISTANCE_${movement.id}`, distanceDelta <= EPSILON, `${movement.id} coordinate separation matches the canonical movement.`, distanceDelta);
    push(checks, `MOVEMENT_DIRECTION_${movement.id}`, directionValid, `${movement.id} point order matches ${movement.direction.toLowerCase()} movement.`);
  }

  if (state.metadata.observerOrder && state.metadata.observerOrder.length >= 2) {
    const xs = state.metadata.observerOrder.map((id) => numberOf(pointOrThrow(points, id).x));
    const monotonic = xs.every((value, index) => index === 0 || value > xs[index - 1] + EPSILON);
    push(checks, "OBSERVER_ORDER", monotonic, "Declared same/opposite-side point order is strictly increasing on the ground axis.");
  }

  if (state.metadata.sameSide) {
    for (const observation of state.observations) {
      const eye = pointOrThrow(points, observation.eyePointId);
      const target = pointOrThrow(points, observation.targetPointId);
      push(checks, `SAME_SIDE_${observation.id}`, Math.abs(numberOf(eye.x) - numberOf(target.x)) > EPSILON, `${observation.id} has a valid same-side horizontal baseline.`);
    }
  }

  if (state.metadata.oppositeSide && state.verticalObjects.length > 0 && state.observers.length >= 2) {
    const objectBase = pointOrThrow(points, state.verticalObjects[0].basePointId);
    const observerXs = state.observers.map((observer) => numberOf(pointOrThrow(points, observer.groundPointId).x));
    const min = Math.min(...observerXs);
    const max = Math.max(...observerXs);
    const x = numberOf(objectBase.x);
    push(checks, "OPPOSITE_SIDE_OBJECT_ORDER", x > min + EPSILON && x < max - EPSILON, "The vertical object lies strictly between opposite-side observers.");
  }

  return { valid: checks.every((check) => check.passed), checks };
}
