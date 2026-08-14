import { compare, divide, multiply, rational } from "../foundation/rational";
import { deriveStrongCp004WrongWorkingsV5 } from "./distractor-engine-v5";
import type { TsdCp004CoreInput, TsdCp004CoreSolution, TsdCp004CoreSolveMode } from "./relative-motion-foundation";
import type { TsdCp004WrongWorking } from "./runtime-types";

function numeric(value: TsdCp004WrongWorking["value"]): number {
  return Number(value.numerator) / Number(value.denominator);
}

function competitive(value: TsdCp004WrongWorking["value"], solution: TsdCp004CoreSolution): boolean {
  if (solution.unit === "CLOCK_MINUTE") {
    return Math.abs(numeric(value) - numeric(solution.answer)) <= 360;
  }
  const lower = divide(solution.answer, rational(2, 5));
  const upper = multiply(solution.answer, rational(5, 2));
  return compare(value, lower) >= 0 && compare(value, upper) <= 0;
}

function closeness(entry: TsdCp004WrongWorking, solution: TsdCp004CoreSolution): number {
  const answer = numeric(solution.answer);
  const wrong = numeric(entry.value);
  if (solution.unit === "CLOCK_MINUTE") return Math.abs(wrong - answer);
  if (answer <= 0 || wrong <= 0) return Number.POSITIVE_INFINITY;
  return Math.abs(Math.log(wrong / answer));
}

function selectCompetitiveSet(
  candidates: readonly TsdCp004WrongWorking[],
  solution: TsdCp004CoreSolution,
): readonly TsdCp004WrongWorking[] {
  const sorted = [...candidates].sort((a, b) => closeness(a, solution) - closeness(b, solution));
  const selected: TsdCp004WrongWorking[] = [];
  const usedClasses = new Set<string>();

  for (const candidate of sorted) {
    if (selected.length >= 3) break;
    if (usedClasses.has(candidate.misconceptionId)) continue;
    selected.push(candidate);
    usedClasses.add(candidate.misconceptionId);
  }
  for (const candidate of sorted) {
    if (selected.length >= 3) break;
    if (selected.includes(candidate)) continue;
    selected.push(candidate);
  }

  return Object.freeze(selected);
}

export function deriveStrongCp004WrongWorkingsFinal(
  mode: TsdCp004CoreSolveMode,
  input: TsdCp004CoreInput,
  solution: TsdCp004CoreSolution,
): readonly TsdCp004WrongWorking[] {
  const candidates = deriveStrongCp004WrongWorkingsV5(mode, input, solution).filter((entry) => competitive(entry.value, solution));
  if (candidates.length < 3) throw new Error(`${mode}: fewer than three option candidates survived the competitive magnitude gate`);
  const selected = selectCompetitiveSet(candidates, solution);
  if (selected.length !== 3) throw new Error(`${mode}: could not select three competitive distractors`);
  if (new Set(selected.map((entry) => entry.misconceptionId)).size < 2) throw new Error(`${mode}: selected distractors collapse to one misconception class`);
  return selected;
}
