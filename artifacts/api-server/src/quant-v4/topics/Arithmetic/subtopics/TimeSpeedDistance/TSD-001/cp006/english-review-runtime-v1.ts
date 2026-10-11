import {
  absRational,
  add,
  divide,
  modulo,
  multiply,
  rational,
  subtract,
  toMixedString,
  type Rational,
} from "../foundation/rational";
import { solveCp006 } from "./solver";
import { independentlyVerifyCp006 } from "./verifier";
import type { TsdCp006Input, TsdCp006Solution } from "./types";
import type { TsdCp006SolveMode } from "./discovery-registry";
import { TSD_CP006_PERMANENT_QL_ALLOCATIONS } from "./ql-allocation";

export type TsdCp006EnglishDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface TsdCp006EnglishReviewQuestionV1 {
  readonly checkpointId: "TSD-CP-006";
  readonly permanentQlId: `TSD-QL-${string}`;
  readonly authorityKey: string;
  readonly solveMode: TsdCp006SolveMode;
  readonly seed: string;
  readonly difficulty: TsdCp006EnglishDifficulty;
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answerText: string;
  readonly explanation: Readonly<{ readonly steps: readonly [string, string] }>;
  readonly input: TsdCp006Input;
  readonly solution: TsdCp006Solution;
  readonly validation: Readonly<{ readonly valid: true; readonly errors: readonly string[] }>;
  readonly lifecycle: Readonly<{
    readonly englishReviewStatus: "REVIEW_CANDIDATE_V1";
    readonly englishFreezeStatus: "UNFROZEN";
    readonly questionStudioEnabled: false;
    readonly questionBankStatus: "NOT_STORED";
    readonly testEligibility: "INELIGIBLE";
    readonly publiclyPublishable: false;
  }>;
}

const TRACK = [240, 300, 360, 420, 480, 600] as const;
const SPEED_A = [60, 72, 54, 80, 75, 90] as const;
const SPEED_B = [40, 48, 36, 50, 45, 60] as const;
const SPEED_C = [30, 24, 18, 40, 25, 30] as const;
const OBJECTS = [
  ["inspection vehicle A", "inspection vehicle B"],
  ["service cart A", "service cart B"],
  ["patrol vehicle A", "patrol vehicle B"],
  ["test car A", "test car B"],
  ["delivery van A", "delivery van B"],
  ["maintenance vehicle A", "maintenance vehicle B"],
] as const;

function h(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function mixed(value: Rational | undefined, label: string): string {
  if (!value) throw new Error(`${label} missing from CP006 English candidate input`);
  return toMixedString(value);
}

function base(variant: number) {
  return {
    L: rational(TRACK[variant]!),
    u: rational(SPEED_A[variant]!),
    v: rational(SPEED_B[variant]!),
    w: rational(SPEED_C[variant]!),
  };
}

function pairPeriod(L: Rational, u: Rational, v: Rational, opposite: boolean): Rational {
  return divide(L, opposite ? add(u, v) : absRational(subtract(u, v)));
}

function buildAuthorityCase(authorityKey: string, variant: number): { mode: TsdCp006SolveMode; input: TsdCp006Input } {
  const { L, u, v, w } = base(variant);
  switch (authorityKey) {
    case "circularFirstMeetingOrOvertakeTime": {
      const modes: readonly TsdCp006SolveMode[] = [
        "findCircularFirstMeetingTimeSameDirection",
        "findCircularFirstMeetingTimeOppositeDirections",
        "findFirstOvertakeTime",
        "findNthMeetingTime",
        "findNthOvertakeTime",
        "findCircularFirstMeetingTimeOppositeDirections",
      ];
      const mode = modes[variant]!;
      return {
        mode,
        input: Object.freeze({
          trackLength: L, speedA: u, speedB: v,
          directionA: 1, directionB: mode === "findCircularFirstMeetingTimeOppositeDirections" || mode === "findNthMeetingTime" ? -1 : 1,
          startPositionA: rational(0), startPositionB: rational(0),
          ...(mode === "findNthMeetingTime" || mode === "findNthOvertakeTime" ? { nthEvent: 2 + (variant % 4) } : {}),
        }),
      };
    }
    case "relativeLapDifferenceAfterTime":
      return { mode: "findLapDifferenceAfterTime", input: Object.freeze({ trackLength: L, speedA: u, speedB: v, timeWindow: rational(5 + variant) }) };
    case "circularEventCountInWindow": {
      const opposite = variant % 2 === 0;
      const period = pairPeriod(L, u, v, opposite);
      return {
        mode: opposite ? "findMeetingCountInTimeWindow" : "findOvertakeCountInTimeWindow",
        input: Object.freeze({
          trackLength: L, speedA: u, speedB: v, directionA: 1, directionB: opposite ? -1 : 1,
          timeWindow: add(multiply(period, rational(3 + (variant % 3))), divide(period, rational(2))),
        }),
      };
    }
    case "distinctCircularMeetingPointCount":
      return { mode: "findDistinctMeetingPointCount", input: Object.freeze({ trackLength: L, speedA: u, speedB: v, directionA: 1, directionB: -1 }) };
    case "circularMeetingPointLocation":
      return { mode: "findMeetingPointLocation", input: Object.freeze({ trackLength: L, speedA: u, speedB: v, directionA: 1, directionB: -1, startPositionA: rational(0), startPositionB: rational(0) }) };
    case "trackLengthFromCircularMeetingPeriod": {
      const t = rational(1 + (variant % 4));
      return { mode: "findTrackLengthFromMeetingTime", input: Object.freeze({ speedA: u, speedB: v, directionA: 1, directionB: -1, observedMeetingTime: t }) };
    }
    case "runnerSpeedFromCircularEventCount": {
      const count = 3 + (variant % 4);
      const timeWindow = divide(multiply(rational(count), L), subtract(u, v));
      return { mode: "findRunnerSpeedFromMeetingCount", input: Object.freeze({ trackLength: L, speedA: u, speedB: v, directionA: 1, directionB: 1, observedMeetingCount: count, timeWindow }) };
    }
    case "simultaneousReturnToStart": {
      if (variant % 3 === 2) return { mode: "findThreeRunnerSimultaneousReturn", input: Object.freeze({ trackLength: L, speedA: u, speedB: v, speedC: w, directionA: 1, directionB: -1, directionC: 1 }) };
      return { mode: variant % 3 === 0 ? "findTimeBothReturnToStart" : "findFirstSimultaneousStartPointReturn", input: Object.freeze({ trackLength: L, speedA: u, speedB: v, directionA: 1, directionB: variant % 2 === 0 ? 1 : -1 }) };
    }
    case "multiRunnerFirstCommonMeeting":
      return { mode: "findThreeRunnerFirstCommonMeeting", input: Object.freeze({ trackLength: L, speedA: u, speedB: v, speedC: w, directionA: 1, directionB: 1, directionC: -1 }) };
    case "multiRunnerPairwiseMeetingSchedule":
      return { mode: "findPairwiseMeetingScheduleForThreeRunners", input: Object.freeze({ trackLength: L, speedA: u, speedB: v, speedC: w, directionA: 1, directionB: 1, directionC: -1 }) };
    case "circularMeetingFromInitialArcGap": {
      const smallGap = multiply(subtract(u, v), rational(1 + (variant % 2)));
      const wrappedAhead = subtract(L, smallGap);
      return { mode: "findMeetingWithInitialArcGap", input: Object.freeze({ trackLength: L, speedA: u, speedB: v, directionA: 1, directionB: 1, startPositionA: rational(0), startPositionB: wrappedAhead, initialArcGap: wrappedAhead }) };
    }
    case "circularStaggeredStartMeeting": {
      const delay = add(divide(L, v), rational(1 + (variant % 2)));
      return { mode: "findMeetingWithStaggeredStarts", input: Object.freeze({ trackLength: L, speedA: v, speedB: u, directionA: 1, directionB: 1, startPositionA: rational(0), startPositionB: rational(0), startDelayB: delay }) };
    }
    case "circularLapStateAfterTime":
      if (variant % 2 === 0) return { mode: "findNumberOfCompletedLaps", input: Object.freeze({ trackLength: L, speedA: u, timeWindow: rational(8 + variant) }) };
      return { mode: "findLocationAfterGivenTime", input: Object.freeze({ trackLength: L, speedA: u, directionA: variant % 4 === 1 ? 1 : -1, startPositionA: rational(20 + 5 * variant), timeWindow: rational(6 + variant) }) };
    default:
      throw new Error(`No CP006 English learner builder for ${authorityKey}`);
  }
}

function answerText(solution: TsdCp006Solution): string {
  const suffix: Record<string, string> = { HOUR: " hours", KM: " km", KM_PER_HOUR: " km/h", LAP: " laps", COUNT: "", RATIO: "", NONE: "" };
  if (solution.answerKind === "VALUE" && solution.value) return `${toMixedString(solution.value)}${suffix[solution.unit] ?? ""}`;
  if (solution.answerKind === "COUNT" && typeof solution.count === "number") return String(solution.count);
  if (solution.answerKind === "LIST" && solution.values) return solution.values.map((value, index) => `${["AB", "AC", "BC"][index] ?? index + 1} = ${toMixedString(value)}${suffix[solution.unit] ?? ""}`).join(", ");
  throw new Error(`${solution.solveMode}: unsupported CP006 learner answer kind ${solution.answerKind}`);
}

function shiftedAnswer(solution: TsdCp006Solution, delta: number): string {
  const suffix: Record<string, string> = { HOUR: " hours", KM: " km", KM_PER_HOUR: " km/h", LAP: " laps", COUNT: "", RATIO: "", NONE: "" };
  if (solution.answerKind === "VALUE" && solution.value) return `${toMixedString(add(solution.value, rational(delta)))}${suffix[solution.unit] ?? ""}`;
  if (solution.answerKind === "COUNT" && typeof solution.count === "number") return String(solution.count + delta);
  if (solution.answerKind === "LIST" && solution.values) return solution.values.map((value, index) => `${["AB", "AC", "BC"][index] ?? index + 1} = ${toMixedString(add(value, rational(delta)))}${suffix[solution.unit] ?? ""}`).join(", ");
  throw new Error(`${solution.solveMode}: cannot create learner distractor`);
}

function optionsFor(solution: TsdCp006Solution, seed: string): { options: readonly string[]; correctIndex: number } {
  const correct = answerText(solution);
  const candidates = [correct, shiftedAnswer(solution, 1), shiftedAnswer(solution, 2), shiftedAnswer(solution, 3)];
  if (new Set(candidates).size !== 4) throw new Error(`${solution.solveMode}: duplicate CP006 options`);
  const order = [0, 1, 2, 3];
  let state = h(seed) || 1;
  for (let i = order.length - 1; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  const options = Object.freeze(order.map((index) => candidates[index]!));
  return { options, correctIndex: order.indexOf(0) };
}

function actors(variant: number): readonly [string, string] {
  return OBJECTS[variant]!;
}

function stemFor(authorityKey: string, mode: TsdCp006SolveMode, input: TsdCp006Input, variant: number): string {
  const [a, b] = actors(variant);
  const L = input.trackLength ? mixed(input.trackLength, "trackLength") : "";
  const u = input.speedA ? mixed(input.speedA, "speedA") : "";
  const v = input.speedB ? mixed(input.speedB, "speedB") : "";
  const alt = variant % 2 === 1;
  switch (authorityKey) {
    case "circularFirstMeetingOrOvertakeTime": {
      const opposite = input.directionB === -1;
      const nth = input.nthEvent;
      if (nth) return `${a} and ${b} start together from the same point on a ${L} km closed route at ${u} km/h and ${v} km/h ${opposite ? "in opposite directions" : "in the same direction"}. When will they meet for the ${nth}${nth === 2 ? "nd" : nth === 3 ? "rd" : "th"} time after starting?`;
      return alt
        ? `A ${L} km circular route is used by ${a} and ${b}. They leave the same point together at ${u} km/h and ${v} km/h ${opposite ? "in opposite directions" : "in the same direction"}. Find their first meeting time after departure.`
        : `${a} and ${b} start together from one point on a ${L} km closed route and move ${opposite ? "in opposite directions" : "in the same direction"} at ${u} km/h and ${v} km/h. After how much time will they meet again for the first time?`;
    }
    case "relativeLapDifferenceAfterTime":
      return `${a} and ${b} move in the same direction on a ${L} km closed route at ${u} km/h and ${v} km/h. After ${mixed(input.timeWindow, "timeWindow")} hours, by how many laps is the faster vehicle ahead?`;
    case "circularEventCountInWindow":
      return `${a} and ${b} start together on a ${L} km circular route at ${u} km/h and ${v} km/h, moving ${input.directionB === -1 ? "in opposite directions" : "in the same direction"}. During the next ${mixed(input.timeWindow, "timeWindow")} hours, how many ${input.directionB === -1 ? "meetings" : "overtakes"} occur after the start?`;
    case "distinctCircularMeetingPointCount":
      return `${a} and ${b} start from the same point on a ${L} km circular route and move in opposite directions at ${u} km/h and ${v} km/h. Before the pattern of meeting locations repeats, at how many distinct points can they meet?`;
    case "circularMeetingPointLocation":
      return `${a} and ${b} start together from point P on a ${L} km circular route and move in opposite directions at ${u} km/h and ${v} km/h. How far clockwise from P is their first meeting point, measured along ${a}'s direction?`;
    case "trackLengthFromCircularMeetingPeriod":
      return `${a} and ${b} start from the same point and move in opposite directions around a closed route at ${u} km/h and ${v} km/h. They first meet again after ${mixed(input.observedMeetingTime, "observedMeetingTime")} hours. Find the length of the route.`;
    case "runnerSpeedFromCircularEventCount":
      return `${a} and ${b} move in the same direction on a ${L} km circular route. ${b} travels at ${v} km/h. The faster ${a} overtakes it ${input.observedMeetingCount} times in exactly ${mixed(input.timeWindow, "timeWindow")} hours. Find ${a}'s speed.`;
    case "simultaneousReturnToStart":
      if (input.speedC) return `Three vehicles start together from the same point on a ${L} km circular route at ${u} km/h, ${v} km/h and ${mixed(input.speedC, "speedC")} km/h. After how much time will all three be together at the starting point again?`;
      return `${a} and ${b} start together from the same point on a ${L} km closed route at ${u} km/h and ${v} km/h. Find the first time when both are again at the starting point together.`;
    case "multiRunnerFirstCommonMeeting":
      return `Vehicles A, B and C start together from one point on a ${L} km circular route. A and B move clockwise at ${u} km/h and ${v} km/h, while C moves anticlockwise at ${mixed(input.speedC, "speedC")} km/h. Find the first time all three are at the same point.`;
    case "multiRunnerPairwiseMeetingSchedule":
      return `Vehicles A, B and C start together on a ${L} km circular route. A and B move clockwise at ${u} km/h and ${v} km/h, while C moves anticlockwise at ${mixed(input.speedC, "speedC")} km/h. Find the fundamental meeting times for AB, AC and BC, in that order.`;
    case "circularMeetingFromInitialArcGap":
      return `${a} starts at point P on a ${L} km circular route at ${u} km/h. ${b}, moving in the same direction at ${v} km/h, is already ${mixed(input.startPositionB, "startPositionB")} km clockwise from P. Because this position lies close to completing a full lap, ${a} must gain almost one complete relative lap. After how much time will ${a} catch ${b}?`;
    case "circularStaggeredStartMeeting":
      return `${a} starts from P on a ${L} km circular route at ${u} km/h. After ${mixed(input.startDelayB, "startDelayB")} hours—by which time ${a} has completed at least one lap—${b} starts from P in the same direction at ${v} km/h. When, measured from ${a}'s start, do they first meet?`;
    case "circularLapStateAfterTime":
      if (mode === "findNumberOfCompletedLaps") return `${a} moves at ${u} km/h on a ${L} km circular route for ${mixed(input.timeWindow, "timeWindow")} hours. How many complete laps does it finish?`;
      return `${a} is initially ${mixed(input.startPositionA, "startPositionA")} km clockwise from P on a ${L} km circular route. It moves ${input.directionA === -1 ? "anticlockwise" : "clockwise"} at ${u} km/h for ${mixed(input.timeWindow, "timeWindow")} hours. Where is it then, measured clockwise from P?`;
    default:
      throw new Error(`No CP006 English stem renderer for ${authorityKey}`);
  }
}

function stepsFor(authorityKey: string, input: TsdCp006Input, solution: TsdCp006Solution): readonly [string, string] {
  const ans = answerText(solution);
  const L = input.trackLength;
  const u = input.speedA;
  const v = input.speedB;
  switch (authorityKey) {
    case "circularFirstMeetingOrOvertakeTime": {
      const relative = input.directionB === -1 ? add(u!, v!) : absRational(subtract(u!, v!));
      const one = divide(L!, relative);
      const n = input.nthEvent ?? 1;
      return [`They must cover one full relative lap of ${mixed(L, "trackLength")} km. Their relative speed is ${toMixedString(relative)} km/h, so one meeting period is ${toMixedString(one)} hours.`, n === 1 ? `Therefore the first required meeting occurs after ${ans}.` : `The required event is number ${n}, so ${n} such periods give ${ans}.`];
    }
    case "relativeLapDifferenceAfterTime": {
      const gain = multiply(absRational(subtract(u!, v!)), input.timeWindow!);
      return [`In ${mixed(input.timeWindow, "timeWindow")} hours, the faster vehicle gains ${toMixedString(gain)} km on the slower one.`, `One lap is ${mixed(L, "trackLength")} km, so dividing the gain by one lap gives ${ans}.`];
    }
    case "circularEventCountInWindow": {
      const period = pairPeriod(L!, u!, v!, input.directionB === -1);
      return [`A meeting/overtake repeats every ${toMixedString(period)} hours because one full relative lap must be gained.`, `Only complete periods inside ${mixed(input.timeWindow, "timeWindow")} hours count, giving ${ans} events after the start.`];
    }
    case "distinctCircularMeetingPointCount": {
      const period = pairPeriod(L!, u!, v!, true);
      const advance = modulo(multiply(u!, period), L!);
      return [`The first meeting period is ${toMixedString(period)} hours, so A advances ${toMixedString(advance)} km around the track from one meeting point to the next.`, `Repeating that modular shift cycles through ${ans} distinct meeting points before returning to the first one.`];
    }
    case "circularMeetingPointLocation": {
      const period = pairPeriod(L!, u!, v!, true);
      const distance = multiply(u!, period);
      return [`Their opposite-direction relative speed gives a first meeting after ${toMixedString(period)} hours. In that time A travels ${toMixedString(distance)} km.`, `Reducing that travel within the ${mixed(L, "trackLength")} km lap places the meeting ${ans} clockwise from P.`];
    }
    case "trackLengthFromCircularMeetingPeriod": {
      const relative = add(u!, v!);
      return [`Moving in opposite directions, they cover one full relative lap at ${toMixedString(relative)} km/h.`, `In ${mixed(input.observedMeetingTime, "observedMeetingTime")} hours that relative distance is ${ans}, which is the route length.`];
    }
    case "runnerSpeedFromCircularEventCount": {
      const relative = divide(multiply(rational(input.observedMeetingCount!), L!), input.timeWindow!);
      return [`${input.observedMeetingCount} overtakes mean the faster vehicle gains ${input.observedMeetingCount} full laps, so its relative speed is ${toMixedString(relative)} km/h.`, `Adding the slower speed ${mixed(v, "speedB")} km/h gives the faster speed ${ans}.`];
    }
    case "simultaneousReturnToStart": {
      const lapA = divide(L!, u!);
      const lapB = divide(L!, v!);
      return [`The first two lap times are ${toMixedString(lapA)} hours and ${toMixedString(lapB)} hours${input.speedC ? `; the third is ${toMixedString(divide(L!, input.speedC))} hours` : ""}.`, `The first time all required lap cycles finish together is their exact common multiple, ${ans}.`];
    }
    case "multiRunnerFirstCommonMeeting": {
      const ab = pairPeriod(L!, u!, v!, false);
      const ac = pairPeriod(L!, u!, input.speedC!, true);
      return [`A and B coincide every ${toMixedString(ab)} hours, while A and C coincide every ${toMixedString(ac)} hours.`, `The first time both conditions hold together is ${ans}.`];
    }
    case "multiRunnerPairwiseMeetingSchedule":
      return [`Compute one full relative-lap period separately for AB, AC and BC using their signed relative speeds.`, `Those three exact periods, in AB–AC–BC order, are ${ans}.`];
    case "circularMeetingFromInitialArcGap": {
      const relative = subtract(u!, v!);
      return [`B is ${mixed(input.startPositionB, "startPositionB")} km clockwise from P, so A must gain that wrap-around arc at ${toMixedString(relative)} km/h.`, `Dividing the required relative distance by the relative speed gives the catch time ${ans}.`];
    }
    case "circularStaggeredStartMeeting": {
      const delay = input.startDelayB!;
      const earlyPosition = modulo(multiply(u!, delay), L!);
      return [`At B's delayed start, A has already travelled for ${toMixedString(delay)} hours and is ${toMixedString(earlyPosition)} km clockwise from P after reducing completed laps.`, `From that circular position the relative-motion catch is solved and added to the delay, giving ${ans} from A's original start.`];
    }
    case "circularLapStateAfterTime": {
      const travel = multiply(u!, input.timeWindow!);
      if (solution.answerKind === "COUNT") return [`The vehicle covers ${toMixedString(travel)} km in the stated time.`, `Dividing by the ${mixed(L, "trackLength")} km lap and keeping only complete laps gives ${ans}.`];
      return [`Start from ${mixed(input.startPositionA, "startPositionA")} km and apply the signed travel of ${toMixedString(travel)} km.`, `Reducing the resulting coordinate modulo the ${mixed(L, "trackLength")} km route gives ${ans} clockwise from P.`];
    }
    default:
      throw new Error(`No CP006 explanation renderer for ${authorityKey}`);
  }
}

function difficultyFor(authorityKey: string, variant: number): TsdCp006EnglishDifficulty {
  if (["multiRunnerFirstCommonMeeting", "multiRunnerPairwiseMeetingSchedule", "distinctCircularMeetingPointCount"].includes(authorityKey)) return variant < 3 ? "MEDIUM" : "HARD";
  if (["circularMeetingFromInitialArcGap", "circularStaggeredStartMeeting"].includes(authorityKey)) return variant < 2 ? "MEDIUM" : variant < 5 ? "HARD" : "MEDIUM";
  return variant < 2 ? "EASY" : variant < 5 ? "MEDIUM" : "HARD";
}

export function generateCp006EnglishReviewSetV1(perAuthority = 6): readonly TsdCp006EnglishReviewQuestionV1[] {
  if (perAuthority !== 6) throw new Error("CP006 English review V1 is certified only for exactly six variants per authority");
  return Object.freeze(TSD_CP006_PERMANENT_QL_ALLOCATIONS.flatMap((allocation) =>
    Array.from({ length: perAuthority }, (_, variant) => {
      const seed = `cp006-en-v1:${allocation.permanentQlId}:${variant + 1}`;
      const built = buildAuthorityCase(allocation.authorityKey, variant);
      const solution = solveCp006(built.mode, built.input);
      const verification = independentlyVerifyCp006(built.mode, built.input, solution);
      if (!verification.valid) throw new Error(`${allocation.permanentQlId}/${variant + 1}: independent verification failed: ${verification.errors.join("; ")}`);
      const { options, correctIndex } = optionsFor(solution, seed);
      const answer = answerText(solution);
      if (options[correctIndex] !== answer) throw new Error(`${allocation.permanentQlId}/${variant + 1}: correct option identity failed`);
      return Object.freeze({
        checkpointId: "TSD-CP-006" as const,
        permanentQlId: allocation.permanentQlId,
        authorityKey: allocation.authorityKey,
        solveMode: built.mode,
        seed,
        difficulty: difficultyFor(allocation.authorityKey, variant),
        stem: stemFor(allocation.authorityKey, built.mode, built.input, variant),
        options,
        correctIndex,
        answerText: answer,
        explanation: Object.freeze({ steps: Object.freeze(stepsFor(allocation.authorityKey, built.input, solution)) as readonly [string, string] }),
        input: built.input,
        solution,
        validation: Object.freeze({ valid: true as const, errors: Object.freeze([]) }),
        lifecycle: Object.freeze({
          englishReviewStatus: "REVIEW_CANDIDATE_V1" as const,
          englishFreezeStatus: "UNFROZEN" as const,
          questionStudioEnabled: false as const,
          questionBankStatus: "NOT_STORED" as const,
          testEligibility: "INELIGIBLE" as const,
          publiclyPublishable: false as const,
        }),
      });
    }),
  ));
}
