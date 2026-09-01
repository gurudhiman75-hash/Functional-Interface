import {
  add,
  compare,
  divide,
  equals,
  floorRational,
  multiply,
  rational,
  subtract,
  type Rational,
} from "../../TSD-001/foundation/rational";
import type { TsdCp012ScalarSolution, TsdCp012Stage, TsdCp012TimedStage } from "./executable-types";

export type TsdCp012SourceExtensionInput =
  | Readonly<{ authorityKey: "discreteSpeedProgramState"; target: "EXACT_TIME_TO_DISTANCE_IN_REPEATING_CYCLE"; cycle: readonly TsdCp012TimedStage[]; distance: Rational }>
  | Readonly<{ authorityKey: "terminalConstraintProgramState"; target: "DISTANCE_REMAINING_AFTER_STAGES"; totalDistance: Rational; completedStages: readonly TsdCp012TimedStage[] }>
  | Readonly<{ authorityKey: "routeProfileProgramState"; target: "CLOSED_ROUTE_OPPOSITE_MEETING_TIME"; clockwiseSegments: readonly TsdCp012Stage[]; counterclockwiseSegments: readonly TsdCp012Stage[] }>;

export type TsdCp012SourceExtensionCase = Readonly<{
  caseId: string;
  authorityKey: TsdCp012SourceExtensionInput["authorityKey"];
  input: TsdCp012SourceExtensionInput;
  expected: TsdCp012ScalarSolution;
}>;

const ZERO = rational(0);
const q = (n: number, d = 1) => rational(BigInt(n), BigInt(d));

function positive(value: Rational, label: string): Rational {
  if (compare(value, ZERO) <= 0) throw new Error(`TSD-CP-012 source extension infeasible ${label}`);
  return value;
}
function nonNegative(value: Rational, label: string): Rational {
  if (compare(value, ZERO) < 0) throw new Error(`TSD-CP-012 source extension infeasible ${label}`);
  return value;
}
function sum(values: readonly Rational[]): Rational { return values.reduce((a, b) => add(a, b), ZERO); }
function timedDistance(stage: TsdCp012TimedStage): Rational { return multiply(positive(stage.speed, "stage speed"), positive(stage.duration, "stage duration")); }
function stageTime(stage: TsdCp012Stage): Rational { return divide(positive(stage.distance, "route segment distance"), positive(stage.speed, "route segment speed")); }
function scalar(answer: Rational, unit: TsdCp012ScalarSolution["unit"]): TsdCp012ScalarSolution {
  return Object.freeze({ kind: "SCALAR" as const, answer, unit });
}
function minRational(...values: readonly Rational[]): Rational {
  return values.reduce((best, value) => compare(value, best) < 0 ? value : best);
}
function perimeter(stages: readonly TsdCp012Stage[]): Rational {
  if (stages.length === 0) throw new Error("TSD-CP-012 closed route must contain at least one segment");
  return sum(stages.map((stage) => positive(stage.distance, "route segment distance")));
}

function exactTimeToDistanceInRepeatingCycle(cycle: readonly TsdCp012TimedStage[], distance: Rational): Rational {
  if (cycle.length === 0) throw new Error("TSD-CP-012 repeating cycle must contain at least one stage");
  const targetDistance = positive(distance, "target distance");
  const cycleDistances = cycle.map(timedDistance);
  const cycleDistance = positive(sum(cycleDistances), "cycle distance");
  const cycleTime = positive(sum(cycle.map((stage) => positive(stage.duration, "stage duration"))), "cycle time");
  const fullCycles = floorRational(divide(targetDistance, cycleDistance));
  let elapsed = multiply(rational(fullCycles), cycleTime);
  let remaining = subtract(targetDistance, multiply(rational(fullCycles), cycleDistance));
  if (compare(remaining, ZERO) === 0) return elapsed;
  for (let index = 0; index < cycle.length; index += 1) {
    const stage = cycle[index]!;
    const stageDistance = cycleDistances[index]!;
    if (compare(remaining, stageDistance) <= 0) return add(elapsed, divide(remaining, positive(stage.speed, "stage speed")));
    elapsed = add(elapsed, positive(stage.duration, "stage duration"));
    remaining = subtract(remaining, stageDistance);
  }
  throw new Error("TSD-CP-012 repeating-cycle remainder was not resolved");
}

function firstOppositeMeetingTime(clockwise: readonly TsdCp012Stage[], counterclockwise: readonly TsdCp012Stage[]): Rational {
  const clockwisePerimeter = perimeter(clockwise);
  const counterclockwisePerimeter = perimeter(counterclockwise);
  if (!equals(clockwisePerimeter, counterclockwisePerimeter)) throw new Error("TSD-CP-012 opposite routes must describe the same perimeter");

  let clockwiseIndex = 0;
  let counterIndex = 0;
  let clockwiseRemaining = positive(clockwise[0]!.distance, "clockwise segment distance");
  let counterRemaining = positive(counterclockwise[0]!.distance, "counterclockwise segment distance");
  let closedDistance = ZERO;
  let elapsed = ZERO;

  while (compare(closedDistance, clockwisePerimeter) < 0) {
    const clockwiseSpeed = positive(clockwise[clockwiseIndex]!.speed, "clockwise speed");
    const counterSpeed = positive(counterclockwise[counterIndex]!.speed, "counterclockwise speed");
    const closureRate = add(clockwiseSpeed, counterSpeed);
    const timeToMeet = divide(subtract(clockwisePerimeter, closedDistance), closureRate);
    const timeToClockwiseBoundary = divide(clockwiseRemaining, clockwiseSpeed);
    const timeToCounterBoundary = divide(counterRemaining, counterSpeed);
    const step = minRational(timeToMeet, timeToClockwiseBoundary, timeToCounterBoundary);

    elapsed = add(elapsed, step);
    closedDistance = add(closedDistance, multiply(closureRate, step));
    clockwiseRemaining = subtract(clockwiseRemaining, multiply(clockwiseSpeed, step));
    counterRemaining = subtract(counterRemaining, multiply(counterSpeed, step));

    if (compare(closedDistance, clockwisePerimeter) === 0) return positive(elapsed, "opposite-route meeting time");
    if (compare(clockwiseRemaining, ZERO) === 0) {
      clockwiseIndex += 1;
      if (clockwiseIndex >= clockwise.length) throw new Error("TSD-CP-012 clockwise traveller completed a lap before the first opposite meeting");
      clockwiseRemaining = positive(clockwise[clockwiseIndex]!.distance, "clockwise segment distance");
    }
    if (compare(counterRemaining, ZERO) === 0) {
      counterIndex += 1;
      if (counterIndex >= counterclockwise.length) throw new Error("TSD-CP-012 counterclockwise traveller completed a lap before the first opposite meeting");
      counterRemaining = positive(counterclockwise[counterIndex]!.distance, "counterclockwise segment distance");
    }
  }
  throw new Error("TSD-CP-012 opposite-route meeting state was not resolved");
}

export function solveTsdCp012SourceExtension(input: TsdCp012SourceExtensionInput): TsdCp012ScalarSolution {
  if (input.target === "EXACT_TIME_TO_DISTANCE_IN_REPEATING_CYCLE") {
    return scalar(exactTimeToDistanceInRepeatingCycle(input.cycle, input.distance), "SECOND");
  }
  if (input.target === "DISTANCE_REMAINING_AFTER_STAGES") {
    const completed = sum(input.completedStages.map(timedDistance));
    return scalar(nonNegative(subtract(positive(input.totalDistance, "total distance"), completed), "remaining distance"), "METRE");
  }
  return scalar(firstOppositeMeetingTime(input.clockwiseSegments, input.counterclockwiseSegments), "SECOND");
}

function repeatingCycleDistanceAtTime(cycle: readonly TsdCp012TimedStage[], time: Rational): Rational | undefined {
  if (cycle.length === 0 || compare(time, ZERO) < 0) return undefined;
  try {
    const cycleTime = sum(cycle.map((stage) => positive(stage.duration, "stage duration")));
    const cycleDistance = sum(cycle.map(timedDistance));
    const fullCycles = floorRational(divide(time, cycleTime));
    let distance = multiply(rational(fullCycles), cycleDistance);
    let remainingTime = subtract(time, multiply(rational(fullCycles), cycleTime));
    for (const stage of cycle) {
      if (compare(remainingTime, ZERO) === 0) return distance;
      if (compare(remainingTime, stage.duration) <= 0) return add(distance, multiply(stage.speed, remainingTime));
      distance = add(distance, timedDistance(stage));
      remainingTime = subtract(remainingTime, stage.duration);
    }
    return compare(remainingTime, ZERO) === 0 ? distance : undefined;
  } catch {
    return undefined;
  }
}

function oneLapDistanceAtTime(stages: readonly TsdCp012Stage[], time: Rational): Rational | undefined {
  if (stages.length === 0 || compare(time, ZERO) < 0) return undefined;
  let remainingTime = time;
  let distance = ZERO;
  try {
    for (const stage of stages) {
      if (compare(remainingTime, ZERO) === 0) return distance;
      const duration = stageTime(stage);
      if (compare(remainingTime, duration) <= 0) return add(distance, multiply(stage.speed, remainingTime));
      distance = add(distance, stage.distance);
      remainingTime = subtract(remainingTime, duration);
    }
    return compare(remainingTime, ZERO) === 0 ? distance : undefined;
  } catch {
    return undefined;
  }
}

export function verifyTsdCp012SourceExtension(input: TsdCp012SourceExtensionInput, claimed: TsdCp012ScalarSolution): Readonly<{ accepted: boolean; reason: string }> {
  try {
    if (input.target === "EXACT_TIME_TO_DISTANCE_IN_REPEATING_CYCLE") {
      if (claimed.unit !== "SECOND" || compare(claimed.answer, ZERO) <= 0) return Object.freeze({ accepted: false, reason: "cycle-time unit/positivity" });
      const travelled = repeatingCycleDistanceAtTime(input.cycle, claimed.answer);
      return Object.freeze({ accepted: travelled !== undefined && equals(travelled, input.distance), reason: "repeating-cycle distance at claimed time" });
    }
    if (input.target === "DISTANCE_REMAINING_AFTER_STAGES") {
      if (claimed.unit !== "METRE" || compare(claimed.answer, ZERO) < 0) return Object.freeze({ accepted: false, reason: "remaining-distance unit/positivity" });
      const completed = sum(input.completedStages.map((stage) => multiply(stage.speed, stage.duration)));
      return Object.freeze({ accepted: equals(add(completed, claimed.answer), input.totalDistance), reason: "completed plus remaining distance" });
    }
    if (claimed.unit !== "SECOND" || compare(claimed.answer, ZERO) <= 0) return Object.freeze({ accepted: false, reason: "meeting-time unit/positivity" });
    const clockwisePerimeter = perimeter(input.clockwiseSegments);
    const counterPerimeter = perimeter(input.counterclockwiseSegments);
    if (!equals(clockwisePerimeter, counterPerimeter)) return Object.freeze({ accepted: false, reason: "perimeter mismatch" });
    const clockwiseDistance = oneLapDistanceAtTime(input.clockwiseSegments, claimed.answer);
    const counterDistance = oneLapDistanceAtTime(input.counterclockwiseSegments, claimed.answer);
    return Object.freeze({ accepted: clockwiseDistance !== undefined && counterDistance !== undefined && equals(add(clockwiseDistance, counterDistance), clockwisePerimeter), reason: "opposite-route closure equality" });
  } catch (error) {
    return Object.freeze({ accepted: false, reason: error instanceof Error ? error.message : "source-extension verification error" });
  }
}

export function generateTsdCp012SourceExtensionCases(): readonly TsdCp012SourceExtensionCase[] {
  const inputs: readonly TsdCp012SourceExtensionInput[] = Object.freeze([
    Object.freeze({ authorityKey: "discreteSpeedProgramState", target: "EXACT_TIME_TO_DISTANCE_IN_REPEATING_CYCLE", cycle: Object.freeze([{ speed: q(5), duration: q(2) }, { speed: q(10), duration: q(1) }]), distance: q(75) }),
    Object.freeze({ authorityKey: "discreteSpeedProgramState", target: "EXACT_TIME_TO_DISTANCE_IN_REPEATING_CYCLE", cycle: Object.freeze([{ speed: q(6), duration: q(3) }, { speed: q(9), duration: q(2) }, { speed: q(12), duration: q(1) }]), distance: q(125) }),
    Object.freeze({ authorityKey: "terminalConstraintProgramState", target: "DISTANCE_REMAINING_AFTER_STAGES", totalDistance: q(300), completedStages: Object.freeze([{ speed: q(10), duration: q(5) }, { speed: q(15), duration: q(4) }]) }),
    Object.freeze({ authorityKey: "terminalConstraintProgramState", target: "DISTANCE_REMAINING_AFTER_STAGES", totalDistance: q(500), completedStages: Object.freeze([{ speed: q(20), duration: q(10) }, { speed: q(15), duration: q(8) }, { speed: q(10), duration: q(5) }]) }),
    Object.freeze({ authorityKey: "routeProfileProgramState", target: "CLOSED_ROUTE_OPPOSITE_MEETING_TIME", clockwiseSegments: Object.freeze([{ distance: q(100), speed: q(10) }, { distance: q(50), speed: q(5) }, { distance: q(100), speed: q(20) }, { distance: q(50), speed: q(10) }]), counterclockwiseSegments: Object.freeze([{ distance: q(50), speed: q(10) }, { distance: q(100), speed: q(10) }, { distance: q(50), speed: q(5) }, { distance: q(100), speed: q(20) }]) }),
    Object.freeze({ authorityKey: "routeProfileProgramState", target: "CLOSED_ROUTE_OPPOSITE_MEETING_TIME", clockwiseSegments: Object.freeze([{ distance: q(60), speed: q(12) }, { distance: q(60), speed: q(6) }, { distance: q(60), speed: q(12) }, { distance: q(60), speed: q(6) }]), counterclockwiseSegments: Object.freeze([{ distance: q(60), speed: q(8) }, { distance: q(60), speed: q(12) }, { distance: q(60), speed: q(8) }, { distance: q(60), speed: q(12) }]) }),
  ]);

  return Object.freeze(inputs.map((input, index) => Object.freeze({
    caseId: `TSD-CP012-SOURCE-EXT-${String(index + 1).padStart(2, "0")}`,
    authorityKey: input.authorityKey,
    input,
    expected: solveTsdCp012SourceExtension(input),
  })));
}
