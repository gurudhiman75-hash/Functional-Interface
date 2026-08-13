import { compare, divide, equals, isPositive, multiply, rational } from "../foundation/rational";
import { deriveCp004WrongWorkings } from "./distractors";
import type { TsdCp004CoreInput, TsdCp004CoreSolution, TsdCp004CoreSolveMode } from "./relative-motion-foundation";
import type { TsdCp004WrongWorking } from "./runtime-types";

function plausible(
  value: TsdCp004WrongWorking["value"],
  mode: TsdCp004CoreSolveMode,
  input: TsdCp004CoreInput,
  solution: TsdCp004CoreSolution,
): boolean {
  if ((mode === "findMeetingPointDistanceSplit" || mode === "findMeetingPointFromSpeedRatio") && input.routeDistance) {
    if (!isPositive(value) || compare(value, input.routeDistance) >= 0) return false;
  }
  if (solution.unit === "CLOCK_MINUTE" || solution.unit === "RATIO") return true;
  const lower = divide(solution.answer, rational(3));
  const upper = multiply(solution.answer, rational(3));
  return compare(value, lower) >= 0 && compare(value, upper) <= 0;
}

export function deriveExamReadyCp004WrongWorkings(
  mode: TsdCp004CoreSolveMode,
  input: TsdCp004CoreInput,
  solution: TsdCp004CoreSolution,
): readonly TsdCp004WrongWorking[] {
  const accepted: TsdCp004WrongWorking[] = [];
  for (const working of deriveCp004WrongWorkings(mode, input, solution)) {
    if (!plausible(working.value, mode, input, solution)) continue;
    if (accepted.some((entry) => equals(entry.value, working.value))) continue;
    accepted.push(working);
  }

  const arithmeticFactors = [rational(3, 2), rational(2), rational(2, 3), rational(1, 2), rational(4, 3)];
  for (const factor of arithmeticFactors) {
    if (accepted.length >= 3) break;
    const value = multiply(solution.answer, factor);
    if (!isPositive(value) || equals(value, solution.answer)) continue;
    if (!plausible(value, mode, input, solution)) continue;
    if (accepted.some((entry) => equals(entry.value, value))) continue;
    accepted.push(Object.freeze({
      misconceptionId: factor.numerator > factor.denominator ? "MULTIPLY_INSTEAD_OF_DIVIDE" : "DIVIDE_INSTEAD_OF_MULTIPLY",
      value,
      calculation: `final arithmetic scaled by ${factor.numerator}/${factor.denominator}`,
      diagnosis: "The relative-motion setup may be correct, but the final arithmetic has been scaled incorrectly.",
    }));
  }

  if (accepted.length < 3) throw new Error(`${mode}: could not construct three plausible distractors`);
  return Object.freeze(accepted.slice(0, 3));
}
