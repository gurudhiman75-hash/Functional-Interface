import { compare, divide, multiply, rational } from "../foundation/rational";
import { deriveStrongCp004WrongWorkingsV5 } from "./distractor-engine-v5";
import type { TsdCp004CoreInput, TsdCp004CoreSolution, TsdCp004CoreSolveMode } from "./relative-motion-foundation";
import type { TsdCp004WrongWorking } from "./runtime-types";

function competitive(value: TsdCp004WrongWorking["value"], solution: TsdCp004CoreSolution): boolean {
  if (solution.unit === "CLOCK_MINUTE" || solution.unit === "RATIO") return true;
  const lower = divide(solution.answer, rational(3));
  const upper = multiply(solution.answer, rational(3));
  return compare(value, lower) >= 0 && compare(value, upper) <= 0;
}

export function deriveStrongCp004WrongWorkingsFinal(
  mode: TsdCp004CoreSolveMode,
  input: TsdCp004CoreInput,
  solution: TsdCp004CoreSolution,
): readonly TsdCp004WrongWorking[] {
  const candidates = deriveStrongCp004WrongWorkingsV5(mode, input, solution).filter((entry) => competitive(entry.value, solution));
  if (candidates.length < 3) throw new Error(`${mode}: fewer than three option candidates survived the magnitude gate`);
  if (new Set(candidates.map((entry) => entry.misconceptionId)).size < 2) throw new Error(`${mode}: option candidates collapse to one misconception class`);
  return Object.freeze(candidates);
}
