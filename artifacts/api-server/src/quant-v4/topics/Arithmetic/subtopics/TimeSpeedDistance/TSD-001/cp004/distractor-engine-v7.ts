import { compare, multiply, rational } from "../foundation/rational";
import { deriveStrongCp004WrongWorkingsV6 } from "./distractor-engine-v6";
import type { TsdCp004CoreInput, TsdCp004CoreSolution, TsdCp004CoreSolveMode } from "./relative-motion-foundation";
import type { TsdCp004WrongWorking } from "./runtime-types";

function numeric(value: TsdCp004WrongWorking["value"]): number {
  return Number(value.numerator) / Number(value.denominator);
}

function ratioToAnswer(entry: TsdCp004WrongWorking, solution: TsdCp004CoreSolution): number {
  const answer = numeric(solution.answer);
  const wrong = numeric(entry.value);
  if (answer <= 0 || wrong <= 0) return Number.POSITIVE_INFINITY;
  return wrong / answer;
}

function classicSemanticException(entry: TsdCp004WrongWorking, solution: TsdCp004CoreSolution): boolean {
  if (solution.unit === "RATIO") {
    return ["REVERSE_MEETING_RATIO", "ASSUME_MIDPOINT", "USE_ROUTE_DIFFERENCE"].includes(entry.misconceptionId);
  }
  if (solution.unit === "CLOCK_MINUTE") {
    return ["COPY_DEPARTURE_CLOCK", "COPY_MEETING_CLOCK", "SUBTRACT_MEETING_DURATION", "ADD_MEETING_DURATION", "DOUBLE_MEETING_DURATION"].includes(entry.misconceptionId);
  }
  return [
    "USE_SUM_INSTEAD_OF_DIFFERENCE",
    "USE_DIFFERENCE_INSTEAD_OF_SUM",
    "IGNORE_INITIAL_GAP",
    "IGNORE_HEAD_START",
    "IGNORE_START_DELAY",
    "TREAT_DELAY_AS_PURSUIT_TIME",
    "REVERSE_MEETING_RATIO",
    "ASSUME_MIDPOINT",
    "USE_TARGET_RELATIVE_SPEED_AS_BODY_SPEED",
    "REVERSE_TARGET_DECOMPOSITION",
  ].includes(entry.misconceptionId);
}

function competitive(entry: TsdCp004WrongWorking, mode: TsdCp004CoreSolveMode, input: TsdCp004CoreInput, solution: TsdCp004CoreSolution): boolean {
  if (solution.unit === "RATIO") {
    const value = numeric(entry.value);
    return value >= 0.1 && value <= 10;
  }

  if (solution.unit === "CLOCK_MINUTE") {
    return Math.abs(numeric(entry.value) - numeric(solution.answer)) <= 720;
  }

  if ((mode === "findMeetingPointDistanceSplit" || mode === "findMeetingPointFromSpeedRatio") && input.routeDistance) {
    if (compare(entry.value, input.routeDistance) >= 0) return false;
  }

  const ratio = ratioToAnswer(entry, solution);
  const withinBand = ratio >= 0.25 && ratio <= 4;
  return withinBand || classicSemanticException(entry, solution);
}

function semanticPriority(entry: TsdCp004WrongWorking, solution: TsdCp004CoreSolution): number {
  if (solution.unit === "RATIO") {
    if (entry.misconceptionId === "REVERSE_MEETING_RATIO") return 0;
    if (entry.misconceptionId === "ASSUME_MIDPOINT") return 0.05;
    if (entry.misconceptionId === "USE_ROUTE_DIFFERENCE") return 0.15;
  }

  if (classicSemanticException(entry, solution)) return 0.2;
  if (entry.misconceptionId === "USE_ONE_SPEED_ONLY") return 0.35;
  if (entry.misconceptionId === "USE_AVERAGE_SPEED") return 0.4;
  if (entry.misconceptionId === "COPY_KNOWN_SPEED") return 0.45;
  return 0.6;
}

function closeness(entry: TsdCp004WrongWorking, solution: TsdCp004CoreSolution): number {
  if (solution.unit === "RATIO") {
    if (entry.misconceptionId === "REVERSE_MEETING_RATIO" || entry.misconceptionId === "ASSUME_MIDPOINT") return 0;
  }
  const answer = numeric(solution.answer);
  const wrong = numeric(entry.value);
  if (solution.unit === "CLOCK_MINUTE") return Math.abs(wrong - answer) / 180;
  if (answer <= 0 || wrong <= 0) return Number.POSITIVE_INFINITY;
  return Math.abs(Math.log(wrong / answer));
}

function pathKey(entry: TsdCp004WrongWorking): string {
  return `${entry.misconceptionId}|${entry.calculation.trim().toLowerCase()}`;
}

function selectThree(candidates: readonly TsdCp004WrongWorking[], solution: TsdCp004CoreSolution): readonly TsdCp004WrongWorking[] {
  const sorted = [...candidates].sort((a, b) => {
    const scoreA = semanticPriority(a, solution) + closeness(a, solution);
    const scoreB = semanticPriority(b, solution) + closeness(b, solution);
    return scoreA - scoreB;
  });

  const selected: TsdCp004WrongWorking[] = [];
  const usedIds = new Set<string>();
  const usedPaths = new Set<string>();

  // First prefer distinct misconception classes.
  for (const candidate of sorted) {
    if (selected.length >= 3) break;
    const path = pathKey(candidate);
    if (usedIds.has(candidate.misconceptionId) || usedPaths.has(path)) continue;
    selected.push(candidate);
    usedIds.add(candidate.misconceptionId);
    usedPaths.add(path);
  }

  // Then allow a second calculation under the same broad class only when it is a genuinely different path.
  for (const candidate of sorted) {
    if (selected.length >= 3) break;
    const path = pathKey(candidate);
    if (usedPaths.has(path) || selected.includes(candidate)) continue;
    selected.push(candidate);
    usedIds.add(candidate.misconceptionId);
    usedPaths.add(path);
  }

  return Object.freeze(selected);
}

export function deriveStrongCp004WrongWorkingsV7(
  mode: TsdCp004CoreSolveMode,
  input: TsdCp004CoreInput,
  solution: TsdCp004CoreSolution,
): readonly TsdCp004WrongWorking[] {
  const semanticCandidates = deriveStrongCp004WrongWorkingsV6(mode, input, solution);
  const candidates = semanticCandidates.filter((entry) => competitive(entry, mode, input, solution));

  // Do not invent scaled or offset fillers. If the competitive subset is small,
  // retain authentic misconception-derived candidates rather than reshaping the source state.
  const pool = candidates.length >= 3 ? candidates : semanticCandidates;
  const selected = selectThree(pool, solution);

  if (selected.length !== 3) throw new Error(`${mode}: could not produce three semantic distractor paths`);
  if (new Set(selected.map(pathKey)).size !== 3) throw new Error(`${mode}: distractor paths are not distinct`);
  if (new Set(selected.map((entry) => entry.misconceptionId)).size < 2) throw new Error(`${mode}: distractors collapse to one misconception class`);
  if (selected.some((entry) => /scaled|alter final arithmetic|answer ×|answer ÷/i.test(entry.calculation))) {
    throw new Error(`${mode}: generic arithmetic filler leaked into V7 distractors`);
  }

  return selected;
}
