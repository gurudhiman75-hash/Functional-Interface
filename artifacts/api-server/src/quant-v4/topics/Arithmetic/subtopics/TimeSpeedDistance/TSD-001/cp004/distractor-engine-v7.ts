import { add, compare, divide, equals, isPositive, multiply, rational, subtract } from "../foundation/rational";
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

function clockClassicCandidates(
  mode: TsdCp004CoreSolveMode,
  input: TsdCp004CoreInput,
  solution: TsdCp004CoreSolution,
): readonly TsdCp004WrongWorking[] {
  if (mode !== "findMeetingClockTime" && mode !== "findDepartureClockTimeFromMeetingState") return Object.freeze([]);
  if (!input.speedA || !input.speedB || !input.initialSeparation) return Object.freeze([]);

  const same = input.directionCase === "SAME";
  const relative = same ? subtract(input.speedA, input.speedB) : add(input.speedA, input.speedB);
  if (!isPositive(relative)) return Object.freeze([]);
  const durationMinutes = multiply(divide(input.initialSeparation, relative), rational(60));
  if (durationMinutes.denominator !== 1n) return Object.freeze([]);

  const rows: TsdCp004WrongWorking[] = [];
  const push = (
    misconceptionId: TsdCp004WrongWorking["misconceptionId"],
    value: TsdCp004WrongWorking["value"],
    calculation: string,
    diagnosis: string,
  ) => {
    if (value.denominator !== 1n || value.numerator < 0n || equals(value, solution.answer)) return;
    if (rows.some((row) => equals(row.value, value))) return;
    rows.push(Object.freeze({ misconceptionId, value, calculation, diagnosis }));
  };

  if (mode === "findMeetingClockTime") {
    const departure = input.departureMinute!;
    push("COPY_DEPARTURE_CLOCK", departure, "copy the departure clock time", "The learner reports the starting clock time and omits the correctly calculated meeting duration.");
    const back = subtract(departure, durationMinutes);
    if (back.numerator >= 0n) push("SUBTRACT_MEETING_DURATION", back, "departure time − correct meeting duration", "The learner obtains the correct travel duration but shifts the clock in the wrong direction.");
    push("DOUBLE_MEETING_DURATION", add(departure, multiply(durationMinutes, rational(2))), "departure time + twice the correct meeting duration", "The correct duration is found but then counted twice when advancing the clock.");
  } else {
    const meeting = input.meetingClockMinute!;
    push("COPY_MEETING_CLOCK", meeting, "copy the meeting clock time", "The learner reports the known meeting time instead of reconstructing the earlier departure time.");
    push("ADD_MEETING_DURATION", add(meeting, durationMinutes), "meeting time + correct meeting duration", "The correct duration is found but added even though departure must occur before the meeting.");
    const twiceBack = subtract(meeting, multiply(durationMinutes, rational(2)));
    if (twiceBack.numerator >= 0n) push("DOUBLE_MEETING_DURATION", twiceBack, "meeting time − twice the correct meeting duration", "The learner subtracts the correctly found duration twice while working backwards.");
  }
  return Object.freeze(rows);
}

function competitive(entry: TsdCp004WrongWorking, mode: TsdCp004CoreSolveMode, input: TsdCp004CoreInput, solution: TsdCp004CoreSolution): boolean {
  if (solution.unit === "RATIO") {
    const value = numeric(entry.value);
    return value >= 0.1 && value <= 10;
  }

  if (solution.unit === "CLOCK_MINUTE") {
    return entry.value.denominator === 1n && Math.abs(numeric(entry.value) - numeric(solution.answer)) <= 720;
  }

  if ((mode === "findMeetingPointDistanceSplit" || mode === "findMeetingPointFromSpeedRatio") && input.routeDistance) {
    if (compare(entry.value, input.routeDistance) >= 0) return false;
  }

  const ratio = ratioToAnswer(entry, solution);
  const withinBand = ratio >= 0.25 && ratio <= 4;
  return withinBand || classicSemanticException(entry, solution);
}

function semanticPriority(entry: TsdCp004WrongWorking, mode: TsdCp004CoreSolveMode, solution: TsdCp004CoreSolution): number {
  if (solution.unit === "RATIO") {
    if (entry.misconceptionId === "REVERSE_MEETING_RATIO") return 0;
    if (entry.misconceptionId === "ASSUME_MIDPOINT") return 0.05;
    if (entry.misconceptionId === "USE_ROUTE_DIFFERENCE") return 0.15;
  }

  if (solution.unit === "CLOCK_MINUTE") {
    if (classicSemanticException(entry, solution)) return 0;
    return 1;
  }

  if ((mode === "findMeetingPointDistanceSplit" || mode === "findMeetingPointFromSpeedRatio") && entry.misconceptionId === "USE_ROUTE_DIFFERENCE") {
    if (/difference as the first traveller's share/i.test(entry.calculation)) return 0;
    if (/count the first traveller's speed or ratio part twice/i.test(entry.calculation)) return 4;
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

function selectThree(
  candidates: readonly TsdCp004WrongWorking[],
  mode: TsdCp004CoreSolveMode,
  solution: TsdCp004CoreSolution,
): readonly TsdCp004WrongWorking[] {
  const sorted = [...candidates].sort((a, b) => {
    const scoreA = semanticPriority(a, mode, solution) + closeness(a, solution);
    const scoreB = semanticPriority(b, mode, solution) + closeness(b, solution);
    return scoreA - scoreB;
  });

  const selected: TsdCp004WrongWorking[] = [];
  const usedIds = new Set<string>();
  const usedPaths = new Set<string>();

  for (const candidate of sorted) {
    if (selected.length >= 3) break;
    const path = pathKey(candidate);
    if (usedIds.has(candidate.misconceptionId) || usedPaths.has(path)) continue;
    selected.push(candidate);
    usedIds.add(candidate.misconceptionId);
    usedPaths.add(path);
  }

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
  const semanticCandidates = [
    ...deriveStrongCp004WrongWorkingsV6(mode, input, solution),
    ...clockClassicCandidates(mode, input, solution),
  ];
  const deduped = semanticCandidates.filter((entry, index, rows) => rows.findIndex((candidate) => equals(candidate.value, entry.value)) === index);
  const candidates = deduped.filter((entry) => competitive(entry, mode, input, solution));

  const pool = candidates.length >= 3 ? candidates : solution.unit === "CLOCK_MINUTE"
    ? candidates
    : deduped;
  const selected = selectThree(pool, mode, solution);

  if (selected.length !== 3) throw new Error(`${mode}: could not produce three semantic distractor paths`);
  if (new Set(selected.map(pathKey)).size !== 3) throw new Error(`${mode}: distractor paths are not distinct`);
  if (new Set(selected.map((entry) => entry.misconceptionId)).size < 2) throw new Error(`${mode}: distractors collapse to one misconception class`);
  if (selected.some((entry) => /scaled|alter final arithmetic|answer ×|answer ÷/i.test(entry.calculation))) {
    throw new Error(`${mode}: generic arithmetic filler leaked into V7 distractors`);
  }
  if (solution.unit === "CLOCK_MINUTE" && selected.some((entry) => entry.value.denominator !== 1n)) {
    throw new Error(`${mode}: non-minute clock distractor leaked into V7`);
  }

  return selected;
}
