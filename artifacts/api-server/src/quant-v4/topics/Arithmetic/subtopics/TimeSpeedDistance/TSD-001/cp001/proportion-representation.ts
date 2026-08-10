import { multiply, rational, toMixedString } from "../foundation/rational";
import type { TsdCp001SolveInput } from "./canonical-solver";
import type { GeneratedState } from "./runtime-types";
import { trailingSeedOrdinal } from "./runtime-support";

export type TsdProportionRepresentation =
  | "REFERENCE_TRIP_SAME_SPEED"
  | "REFERENCE_TRIP_CHANGED_SPEED"
  | "REFERENCE_TRIP_CHANGED_SPEED_SAME_DISTANCE";

function distanceRepresentation(seed: string, state: GeneratedState): GeneratedState {
  if (state.input.solveMode !== "distanceByProportion") return state;
  const variant = trailingSeedOrdinal(seed) % 3;
  if (variant === 0) return state;

  const factor = variant === 1 ? rational(3, 2) : rational(4, 5);
  const targetSpeed = multiply(state.input.knownSpeed, factor);
  const direction = variant === 1 ? "higher" : "lower";
  return Object.freeze({
    input: Object.freeze({ ...state.input, targetSpeed }),
    stem: `A bus covers ${toMixedString(state.input.knownDistance)} km in ${toMixedString(state.input.knownTime)} hours. It then travels for ${toMixedString(state.input.targetTime)} hours at the ${direction} speed of ${toMixedString(targetSpeed)} km/h. How far does it travel during the second journey?`,
    display: Object.freeze({
      unit: "km",
      formula: "Target distance = Reference distance × (target speed ÷ reference speed) × (target time ÷ reference time)",
      givens: Object.freeze([
        `Reference journey = ${toMixedString(state.input.knownDistance)} km in ${toMixedString(state.input.knownTime)} hours`,
        `Target speed = ${toMixedString(targetSpeed)} km/h`,
        `Target time = ${toMixedString(state.input.targetTime)} hours`,
      ]),
      shortcut: "First recover the reference speed, then multiply the target speed by the target time.",
    }),
  });
}

function timeRepresentation(seed: string, state: GeneratedState): GeneratedState {
  if (state.input.solveMode !== "timeByProportion") return state;
  const variant = trailingSeedOrdinal(seed) % 3;
  if (variant === 0) return state;

  if (variant === 1) {
    const targetSpeed = multiply(state.input.knownSpeed, rational(3, 2));
    return Object.freeze({
      input: Object.freeze({
        ...state.input,
        targetDistance: state.input.knownDistance,
        targetSpeed,
      }),
      stem: `A car covers ${toMixedString(state.input.knownDistance)} km in ${toMixedString(state.input.knownTime)} hours. How much time will it take to cover the same distance at ${toMixedString(targetSpeed)} km/h?`,
      display: Object.freeze({
        unit: "hours",
        formula: "For the same distance, target time = reference time × reference speed ÷ target speed",
        givens: Object.freeze([
          `Reference journey = ${toMixedString(state.input.knownDistance)} km in ${toMixedString(state.input.knownTime)} hours`,
          `Target distance = ${toMixedString(state.input.knownDistance)} km`,
          `Target speed = ${toMixedString(targetSpeed)} km/h`,
        ]),
        shortcut: "For a fixed distance, time changes inversely with speed.",
      }),
    });
  }

  const targetDistance = multiply(state.input.knownDistance, rational(3, 2));
  const targetSpeed = multiply(state.input.knownSpeed, rational(4, 5));
  return Object.freeze({
    input: Object.freeze({ ...state.input, targetDistance, targetSpeed }),
    stem: `A car covers ${toMixedString(state.input.knownDistance)} km in ${toMixedString(state.input.knownTime)} hours. How much time will it take to cover ${toMixedString(targetDistance)} km at ${toMixedString(targetSpeed)} km/h?`,
    display: Object.freeze({
      unit: "hours",
      formula: "Target time = Reference time × (target distance ÷ reference distance) × (reference speed ÷ target speed)",
      givens: Object.freeze([
        `Reference journey = ${toMixedString(state.input.knownDistance)} km in ${toMixedString(state.input.knownTime)} hours`,
        `Target distance = ${toMixedString(targetDistance)} km`,
        `Target speed = ${toMixedString(targetSpeed)} km/h`,
      ]),
      shortcut: "Scale time directly with distance and inversely with speed.",
    }),
  });
}

export function applyProportionRepresentation(seed: string, state: GeneratedState): GeneratedState {
  return timeRepresentation(seed, distanceRepresentation(seed, state));
}

export function proportionRepresentation(input: TsdCp001SolveInput): TsdProportionRepresentation | null {
  if (input.solveMode === "distanceByProportion") {
    return input.targetSpeed.numerator === input.knownSpeed.numerator
      && input.targetSpeed.denominator === input.knownSpeed.denominator
      ? "REFERENCE_TRIP_SAME_SPEED"
      : "REFERENCE_TRIP_CHANGED_SPEED";
  }
  if (input.solveMode === "timeByProportion") {
    const sameSpeed = input.targetSpeed.numerator === input.knownSpeed.numerator
      && input.targetSpeed.denominator === input.knownSpeed.denominator;
    if (sameSpeed) return "REFERENCE_TRIP_SAME_SPEED";
    const sameDistance = input.targetDistance.numerator === input.knownDistance.numerator
      && input.targetDistance.denominator === input.knownDistance.denominator;
    return sameDistance ? "REFERENCE_TRIP_CHANGED_SPEED_SAME_DISTANCE" : "REFERENCE_TRIP_CHANGED_SPEED";
  }
  return null;
}
