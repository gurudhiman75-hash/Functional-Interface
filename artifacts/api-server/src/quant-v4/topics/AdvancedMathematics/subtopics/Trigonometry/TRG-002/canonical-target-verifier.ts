import { exactToNumber } from "../foundation/exact";
import { toDegrees } from "../foundation/angle";
import type { Trg002ProofQuestion } from "./runtime-proof";
import type { Trg002SpatialState } from "./spatial";

const EPSILON = 1e-9;

function point(state: Trg002SpatialState, id: string) {
  const found = state.points.find((item) => item.id === id);
  if (!found) throw new Error(`TRG-002 canonical-target verifier cannot resolve point ${id}.`);
  return found;
}

function object(state: Trg002SpatialState, id: string) {
  const found = state.verticalObjects.find((item) => item.id === id);
  if (!found) throw new Error(`TRG-002 canonical-target verifier cannot resolve object ${id}.`);
  return found;
}

export function canonicalRequestedTargetNumericValue(state: Trg002SpatialState): number {
  switch (state.requested.kind) {
    case "OBJECT_HEIGHT":
      return exactToNumber(object(state, state.requested.objectId).height);
    case "HORIZONTAL_DISTANCE": {
      const first = point(state, state.requested.fromPointId);
      const second = point(state, state.requested.toPointId);
      return Math.abs(exactToNumber(first.x) - exactToNumber(second.x));
    }
    case "ANGLE": {
      const observation = state.observations.find((item) => item.id === state.requested.observationId);
      if (!observation) throw new Error(`TRG-002 canonical-target verifier cannot resolve observation ${state.requested.observationId}.`);
      const degrees = toDegrees(observation.angle);
      return Number(degrees.numerator) / Number(degrees.denominator);
    }
    case "MOVEMENT_DISTANCE": {
      const movement = state.movements.find((item) => item.id === state.requested.movementId);
      if (!movement) throw new Error(`TRG-002 canonical-target verifier cannot resolve movement ${state.requested.movementId}.`);
      return exactToNumber(movement.distance);
    }
    case "SIGHT_LINE_LENGTH": {
      const first = point(state, state.requested.fromPointId);
      const second = point(state, state.requested.toPointId);
      const dx = exactToNumber(first.x) - exactToNumber(second.x);
      const dy = exactToNumber(first.y) - exactToNumber(second.y);
      return Math.hypot(dx, dy);
    }
    case "EYE_HEIGHT": {
      const observer = state.observers.find((item) => item.id === state.requested.observerId);
      if (!observer) throw new Error(`TRG-002 canonical-target verifier cannot resolve observer ${state.requested.observerId}.`);
      return exactToNumber(observer.eyeHeight);
    }
    case "SHADOW_LENGTH": {
      const targetObject = object(state, state.requested.objectId);
      const base = point(state, targetObject.basePointId);
      const tip = point(state, state.requested.shadowTipPointId);
      return Math.abs(exactToNumber(base.x) - exactToNumber(tip.x));
    }
  }
}

function exactAnswerNumericValue(question: Trg002ProofQuestion): number {
  if (question.exactAnswer.kind === "NUMBER") return exactToNumber(question.exactAnswer.value);
  const degrees = toDegrees(question.exactAnswer.value);
  return Number(degrees.numerator) / Number(degrees.denominator);
}

export function verifyTrg002CanonicalRequestedTarget(question: Trg002ProofQuestion) {
  const requested = canonicalRequestedTargetNumericValue(question.canonicalSpatialState);
  const answer = exactAnswerNumericValue(question);
  const delta = Math.abs(requested - answer);
  return {
    valid: Number.isFinite(requested) && Number.isFinite(answer) && delta <= EPSILON,
    requested,
    answer,
    delta,
    requestedKind: question.canonicalSpatialState.requested.kind,
  };
}
