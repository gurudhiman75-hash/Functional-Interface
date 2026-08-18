import { add, divide, multiply, rational, subtract, type Rational } from "../foundation/rational";
import { formatDurationHours, formatExamNumber } from "../cp003/generation-support";
import { TSD_CP005_APPROVED_LEARNER_AUTHORITIES } from "./approved-authority-registry";
import type { TsdCp005EnglishReviewQuestion, TsdCp005ReviewExplanation } from "./english-review-runtime";
import { generateCp005ReviewQuestionV6 } from "./english-review-runtime-v6";
import { sqrtRationalExact } from "./solver";

function required(value: Rational | undefined, name: string): Rational {
  if (!value) throw new Error(`CP005 V7 explanation missing ${name}`);
  return value;
}

function num(value: Rational): string { return formatExamNumber(value); }
function km(value: Rational): string { return `${num(value)} km`; }
function kmph(value: Rational): string { return `${num(value)} km/h`; }
function duration(value: Rational): string { return formatDurationHours(value); }
function ratio(value: Rational): string { return `${value.numerator}:${value.denominator}`; }

function ordinal(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  switch (value % 10) {
    case 1: return `${value}st`;
    case 2: return `${value}nd`;
    case 3: return `${value}rd`;
    default: return `${value}th`;
  }
}

function firstPoint(L: Rational, u: Rational, v: Rational): Rational {
  return divide(multiply(L, u), add(u, v));
}

function humanExplanation(question: TsdCp005EnglishReviewQuestion): TsdCp005ReviewExplanation {
  const input = question.input;
  const solution = question.solution;
  const answer = question.answerText;

  switch (question.solveMode) {
    case "findSpeedRatioFromPostMeetingArrivalTimes": {
      const tA = required(input.postMeetingTimeA, "postMeetingTimeA");
      const tB = required(input.postMeetingTimeB, "postMeetingTimeB");
      const squaredRatio = divide(tB, tA);
      const r = required(solution.value, "speed ratio");
      return Object.freeze({
        method: "The times are measured after the first meeting. For this setup, the ratio of the two remaining times equals the square of the opposite speed ratio.",
        steps: Object.freeze([
          `After meeting, A takes ${duration(tA)} and B takes ${duration(tB)} to reach the opposite endpoints.`,
          `(A's speed / B's speed)^2 = ${num(tB)} / ${num(tA)} = ${num(squaredRatio)}.`,
          `Taking the square root gives A's speed : B's speed = ${ratio(r)}.`,
        ]),
        shortcut: "Take the square root of (B's post-meeting time / A's post-meeting time).",
        finalAnswer: `Therefore, the required speed ratio is ${answer}.`,
      });
    }

    case "findPostMeetingArrivalTimeFromSpeedRatio": {
      const L = required(input.routeDistance, "routeDistance");
      const u = required(input.speedA, "speedA");
      const r = required(input.speedRatio, "speedRatio");
      const v = divide(u, r);
      const x = firstPoint(L, u, v);
      const target = input.targetPostBody ?? "A";
      const remaining = target === "A" ? subtract(L, x) : x;
      const targetSpeed = target === "A" ? u : v;
      const result = required(solution.value, "post-meeting time");
      return Object.freeze({
        method: "Recover B's speed, locate the first meeting, and then use only the distance still left for the traveller named in the question.",
        steps: Object.freeze([
          `The route is ${km(L)}. A travels at ${kmph(u)} and A:B = ${ratio(r)}, so B's speed = ${num(u)} × ${r.denominator}/${r.numerator} = ${kmph(v)}.`,
          `At the first meeting A has covered ${km(x)} from A's end.`,
          `${target} still has ${km(remaining)} to cover at ${kmph(targetSpeed)}.`,
          `Required time = ${num(remaining)} / ${num(targetSpeed)} = ${duration(result)}.`,
        ]),
        shortcut: "Do not divide the full route by the speed; first find the remaining distance after the meeting.",
        finalAnswer: `Therefore, traveller ${target} takes ${answer} after the first meeting.`,
      });
    }

    case "findTotalDistanceFromPostMeetingTimes": {
      const u = required(input.speedA, "speedA");
      const tA = required(input.postMeetingTimeA, "postMeetingTimeA");
      const tB = required(input.postMeetingTimeB, "postMeetingTimeB");
      const r = sqrtRationalExact(divide(tB, tA));
      const v = divide(u, r);
      const aRemaining = multiply(u, tA);
      const bRemaining = multiply(v, tB);
      const L = add(aRemaining, bRemaining);
      return Object.freeze({
        method: "The post-meeting times give the missing speed ratio. After the meeting, A's remaining leg and B's remaining leg are the two parts of the original route.",
        steps: Object.freeze([
          `From the two post-meeting times, A:B speed ratio = sqrt(${num(tB)}/${num(tA)}) = ${ratio(r)}.`,
          `A is ${kmph(u)}, so B's speed = ${num(u)} × ${r.denominator}/${r.numerator} = ${kmph(v)}.`,
          `A's remaining leg = ${num(u)} × ${num(tA)} = ${km(aRemaining)}.`,
          `B's remaining leg = ${num(v)} × ${num(tB)} = ${km(bRemaining)}.`,
          `Total route = ${num(aRemaining)} + ${num(bRemaining)} = ${km(L)}.`,
        ]),
        shortcut: "Recover B's speed from the square-root time relation, then add u×tA and v×tB.",
        finalAnswer: `Therefore, the distance between the endpoints is ${answer}.`,
      });
    }

    case "findSpeedsFromPostMeetingTimesAndDistance": {
      const L = required(input.routeDistance, "routeDistance");
      const tA = required(input.postMeetingTimeA, "postMeetingTimeA");
      const tB = required(input.postMeetingTimeB, "postMeetingTimeB");
      const values = solution.values;
      if (!values || values.length !== 2) throw new Error("CP005 V7 speed-pair solution missing");
      const u = values[0]!;
      const v = values[1]!;
      const r = divide(u, v);
      return Object.freeze({
        method: "First obtain the speed ratio from the two post-meeting times. Then use the fact that the two remaining legs together make the known route length.",
        steps: Object.freeze([
          `A:B speed ratio = sqrt(${num(tB)}/${num(tA)}) = ${ratio(r)}.`,
          `Let B's speed be s; then A's speed is (${r.numerator}/${r.denominator})s.`,
          `The post-meeting legs make the ${km(L)} route, so A-speed × ${num(tA)} + B-speed × ${num(tB)} = ${num(L)}.`,
          `Solving gives A = ${kmph(u)} and B = ${kmph(v)}.`,
        ]),
        shortcut: "Use the square-root time relation for A:B, then substitute that ratio into L = u×tA + v×tB.",
        finalAnswer: `Therefore, the speeds of A and B are ${answer}.`,
      });
    }

    case "findMeetingPointFromPostMeetingTimes": {
      const L = required(input.routeDistance, "routeDistance");
      const tA = required(input.postMeetingTimeA, "postMeetingTimeA");
      const tB = required(input.postMeetingTimeB, "postMeetingTimeB");
      const r = sqrtRationalExact(divide(tB, tA));
      const x = required(solution.value, "meeting point");
      return Object.freeze({
        method: "Convert the two post-meeting times into the speed ratio. At the first meeting, distances already covered are in the same ratio as the speeds.",
        steps: Object.freeze([
          `A:B speed ratio = sqrt(${num(tB)}/${num(tA)}) = ${ratio(r)}.`,
          `So the ${km(L)} route is divided at the first meeting in the ratio ${ratio(r)} from A's side to B's side.`,
          `Distance from A's end = ${km(x)}.`,
        ]),
        shortcut: "Square-root the reversed post-meeting time ratio, then divide the route in that speed ratio.",
        finalAnswer: `Therefore, the first meeting occurred ${answer} from A's end.`,
      });
    }

    case "findSecondMeetingTimeAfterEndpointTurnaround":
    case "findMeetingAfterBothTurnAtEndpoints": {
      const L = required(input.routeDistance, "routeDistance");
      const u = required(input.speedA, "speedA");
      const v = required(input.speedB, "speedB");
      const sum = add(u, v);
      const combinedPath = multiply(rational(3), L);
      const result = required(solution.value, "second meeting time");
      return Object.freeze({
        method: "Unfold the endpoint reversals into straight-line motion. By the second meeting, the two travellers have covered three route lengths in combined travel.",
        steps: Object.freeze([
          `Route length = ${km(L)}; combined speed = ${num(u)} + ${num(v)} = ${kmph(sum)}.`,
          `Combined distance for the second meeting = 3 × ${num(L)} = ${km(combinedPath)}.`,
          `Time = ${num(combinedPath)} / ${num(sum)} = ${duration(result)}.`,
        ]),
        shortcut: "With instant endpoint reversals, second-meeting time = 3L/(u+v).",
        finalAnswer: `Therefore, they meet for the second time after ${answer}.`,
      });
    }

    case "findNthMeetingTimeOnLine": {
      const L = required(input.routeDistance, "routeDistance");
      const u = required(input.speedA, "speedA");
      const v = required(input.speedB, "speedB");
      const meetingNumber = input.nthMeeting;
      if (!meetingNumber) throw new Error("CP005 V7 nth meeting missing");
      const odd = 2 * meetingNumber - 1;
      const path = multiply(rational(odd), L);
      const sum = add(u, v);
      const result = required(solution.value, "nth meeting time");
      return Object.freeze({
        method: "Unfold the repeated reversals. The nth meeting occurs when the combined travel reaches the odd multiple (2n−1)L.",
        steps: Object.freeze([
          `Here n = ${meetingNumber}, so 2n−1 = ${odd}.`,
          `Combined distance for the ${ordinal(meetingNumber)} meeting = ${odd} × ${num(L)} = ${km(path)}.`,
          `Combined speed = ${num(u)} + ${num(v)} = ${kmph(sum)}.`,
          `Meeting time = ${num(path)} / ${num(sum)} = ${duration(result)}.`,
        ]),
        shortcut: "For instant reversals, t_n = (2n−1)L/(u+v).",
        finalAnswer: `Therefore, their ${ordinal(meetingNumber)} meeting occurs after ${answer}.`,
      });
    }

    case "findTimeBetweenFirstAndSecondMeetings": {
      const L = required(input.routeDistance, "routeDistance");
      const u = required(input.speedA, "speedA");
      const v = required(input.speedB, "speedB");
      const sum = add(u, v);
      const path = multiply(rational(2), L);
      const result = required(solution.value, "meeting interval");
      return Object.freeze({
        method: "From the first meeting to the second, the two travellers together cover exactly two more route lengths.",
        steps: Object.freeze([
          `Combined speed = ${num(u)} + ${num(v)} = ${kmph(sum)}.`,
          `Combined distance between these meetings = 2 × ${num(L)} = ${km(path)}.`,
          `Time interval = ${num(path)} / ${num(sum)} = ${duration(result)}.`,
        ]),
        shortcut: "First-to-second meeting gap = 2L/(u+v).",
        finalAnswer: `Therefore, the time between the first and second meetings is ${answer}.`,
      });
    }

    case "findSecondMeetingPointAfterEndpointTurnaround":
    case "findNthMeetingPointOnLine": {
      const L = required(input.routeDistance, "routeDistance");
      const u = required(input.speedA, "speedA");
      const v = required(input.speedB, "speedB");
      const meetingNumber = question.solveMode === "findSecondMeetingPointAfterEndpointTurnaround" ? 2 : input.nthMeeting;
      if (!meetingNumber) throw new Error("CP005 V7 meeting-point ordinal missing");
      const odd = 2 * meetingNumber - 1;
      const path = multiply(rational(odd), L);
      const sum = add(u, v);
      const meetingTime = divide(path, sum);
      const travelledByA = multiply(u, meetingTime);
      return Object.freeze({
        method: "Find the repeated-meeting time on the unfolded route, then reflect A's total travelled path back inside the actual endpoint-to-endpoint route.",
        steps: Object.freeze([
          `For the ${ordinal(meetingNumber)} meeting, combined unfolded distance = ${odd} × ${num(L)} = ${km(path)}.`,
          `At combined speed ${kmph(sum)}, the meeting occurs after ${duration(meetingTime)}.`,
          `A has travelled ${num(u)} × ${num(meetingTime)} = ${km(travelledByA)} in total by then.`,
          `After accounting for endpoint reversals, that total path places the meeting ${answer} from A's starting end.`,
        ]),
        shortcut: "Total distance travelled is not the physical coordinate after a reversal; reflect it back into the route.",
        finalAnswer: `Therefore, their ${ordinal(meetingNumber)} meeting point is ${answer} from A's starting end.`,
      });
    }

    case "findRepeatedMeetingCountInTimeWindow": {
      const L = required(input.routeDistance, "routeDistance");
      const u = required(input.speedA, "speedA");
      const v = required(input.speedB, "speedB");
      const window = required(input.timeWindow, "timeWindow");
      const countValue = required(solution.value, "meeting count");
      const count = Number(countValue.numerator / countValue.denominator);
      const sum = add(u, v);
      const last = divide(multiply(rational(2 * count - 1), L), sum);
      const next = divide(multiply(rational(2 * (count + 1) - 1), L), sum);
      return Object.freeze({
        method: "Use the odd-multiple meeting schedule and count only the meetings whose times lie inside the stated window.",
        steps: Object.freeze([
          `Combined speed = ${kmph(sum)} and meeting n occurs at (2n−1)L/(u+v).`,
          `The ${ordinal(count)} meeting is at ${duration(last)}, which is within ${duration(window)}.`,
          `The ${ordinal(count + 1)} meeting is at ${duration(next)}, which is after the time limit.`,
        ]),
        shortcut: "Find the largest n for which (2n−1)L/(u+v) does not exceed the time window.",
        finalAnswer: `Therefore, they meet ${answer} times in the stated interval.`,
      });
    }

    case "findMeetingAfterOneTravellerTurnsBack":
    case "findShuttleMeetingTime":
    case "findPassThenCatchAfterTurnaround": {
      const L = required(input.routeDistance, "routeDistance");
      const u = required(input.speedA, "speedA");
      const v = required(input.speedB, "speedB");
      const sum = add(u, v);
      const path = multiply(rational(2), L);
      const result = required(solution.value, "turnaround meeting time");
      return Object.freeze({
        method: "By the return meeting, A has gone to the far endpoint and part-way back while B has moved outward. Their two travelled distances therefore add to twice the route length.",
        steps: Object.freeze([
          `Route length = ${km(L)}; speeds are ${kmph(u)} and ${kmph(v)}.`,
          `Total distance covered by A and B at the return meeting = 2 × ${num(L)} = ${km(path)}.`,
          `Combined speed = ${num(u)} + ${num(v)} = ${kmph(sum)}.`,
          `Elapsed time = ${num(path)} / ${num(sum)} = ${duration(result)}.`,
        ]),
        shortcut: "For this one-turn same-start meeting, use 2L/(u+v), not the ordinary first-meeting formula.",
        finalAnswer: `Therefore, the return meeting occurs after ${answer}.`,
      });
    }

    case "findShuttleDistanceCovered": {
      const L = required(input.routeDistance, "routeDistance");
      const u = required(input.speedA, "speedA");
      const v = required(input.speedB, "speedB");
      const meetingTime = divide(multiply(rational(2), L), add(u, v));
      const result = required(solution.value, "shuttle distance");
      return Object.freeze({
        method: "First find the return-meeting time. A's requested distance is the complete path A travels during that time, including both the outward and return portions.",
        steps: Object.freeze([
          `Return-meeting time = 2 × ${num(L)} / (${num(u)} + ${num(v)}) = ${duration(meetingTime)}.`,
          `A moves at ${kmph(u)} for ${duration(meetingTime)}.`,
          `Total distance travelled by A = ${num(u)} × ${num(meetingTime)} = ${km(result)}.`,
        ]),
        shortcut: "Find the one-turn meeting time first, then multiply it by A's speed.",
        finalAnswer: `Therefore, A travels ${answer} before the return meeting.`,
      });
    }

    case "findReturnJourneyMeetingPoint": {
      const L = required(input.routeDistance, "routeDistance");
      const u = required(input.speedA, "speedA");
      const v = required(input.speedB, "speedB");
      const meetingTime = divide(multiply(rational(2), L), add(u, v));
      const point = required(solution.value, "return meeting point");
      return Object.freeze({
        method: "Find the return-meeting time first. B has not reversed before that meeting, so B's outward distance directly gives the meeting point from the starting end.",
        steps: Object.freeze([
          `Return-meeting time = 2 × ${num(L)} / (${num(u)} + ${num(v)}) = ${duration(meetingTime)}.`,
          `B travels at ${kmph(v)} for ${duration(meetingTime)}.`,
          `Meeting point from the start = ${num(v)} × ${num(meetingTime)} = ${km(point)}.`,
        ]),
        shortcut: "After finding the return-meeting time, use the non-turning traveller's outward distance to locate the point.",
        finalAnswer: `Therefore, the return-journey meeting point is ${answer} from the starting end.`,
      });
    }

    case "findEndpointRestTimeFromNextMeeting":
    case "findRouteReversalScheduleParameter": {
      const L = required(input.routeDistance, "routeDistance");
      const u = required(input.speedA, "speedA");
      const v = required(input.speedB, "speedB");
      const observed = required(input.observedSecondMeetingTime, "observedSecondMeetingTime");
      const rest = required(solution.value, "endpoint rest time");
      const possibleCombined = multiply(add(u, v), observed);
      const normalSecondPath = multiply(rational(3), L);
      const missedByA = subtract(possibleCombined, normalSecondPath);
      return Object.freeze({
        method: "A normal second meeting corresponds to three route lengths of combined moving distance. Because A rests, A misses some distance; that missed distance equals A's speed multiplied by the rest time.",
        steps: Object.freeze([
          `Normal combined path for the second meeting = 3 × ${num(L)} = ${km(normalSecondPath)}.`,
          `Over the observed ${duration(observed)}, the two speeds would account for ${num(add(u, v))} × ${num(observed)} = ${km(possibleCombined)} if both kept moving.`,
          `The difference ${num(possibleCombined)} − ${num(normalSecondPath)} = ${km(missedByA)} is the distance A did not cover while resting.`,
          `Rest time = ${num(missedByA)} / ${num(u)} = ${duration(rest)}.`,
        ]),
        shortcut: "Compute (u+v)×observed time − 3L, then divide that missed distance by A's speed.",
        finalAnswer: `Therefore, A rests at the endpoint for ${answer}.`,
      });
    }

    case "findDistanceBetweenEndpointsFromRepeatedMeetings": {
      const u = required(input.speedA, "speedA");
      const v = required(input.speedB, "speedB");
      const t1 = required(input.observedFirstMeetingTime, "observedFirstMeetingTime");
      const t2 = required(input.observedSecondMeetingTime, "observedSecondMeetingTime");
      const gap = subtract(t2, t1);
      const sum = add(u, v);
      const combinedDistance = multiply(sum, gap);
      const L = required(solution.value, "route distance");
      return Object.freeze({
        method: "Between the first and second meetings, the two travellers together cover exactly two route lengths. The observed time gap therefore gives the route directly.",
        steps: Object.freeze([
          `Time gap = ${duration(t2)} − ${duration(t1)} = ${duration(gap)}.`,
          `Combined speed = ${num(u)} + ${num(v)} = ${kmph(sum)}.`,
          `Combined distance in that gap = ${num(sum)} × ${num(gap)} = ${km(combinedDistance)} = 2L.`,
          `Therefore L = ${num(combinedDistance)} / 2 = ${km(L)}.`,
        ]),
        shortcut: "Use L = (u+v)(t2−t1)/2.",
        finalAnswer: `Therefore, the distance between the endpoints is ${answer}.`,
      });
    }

    default:
      throw new Error(`${question.solveMode}: CP005 V7 has no learner explanation contract`);
  }
}

function naturalizeStem(stem: string): string {
  return stem
    .replace("A road-study records two vehicles moving between endpoints P and Q.", "Two vehicles move on a straight route between endpoints P and Q.")
    .replace("Two cyclists travel repeatedly along the same bounded route.", "Two cyclists move between two fixed endpoints of a straight route.")
    .replace("On a straight route with fixed endpoints, two runners maintain constant speeds.", "Two runners move at constant speeds between two fixed endpoints.")
    .replace("keep reflecting at the endpoints", "reverse direction immediately at each endpoint");
}

export function generateCp005ReviewQuestionV7(authorityKey: string, seed: string, questionOrdinal = 0): TsdCp005EnglishReviewQuestion {
  const base = generateCp005ReviewQuestionV6(authorityKey, seed, questionOrdinal);
  return Object.freeze({ ...base, stem: naturalizeStem(base.stem), explanation: humanExplanation(base) });
}

export function generateCp005ReviewSetV7(perAuthority = 6): readonly TsdCp005EnglishReviewQuestion[] {
  if (!Number.isInteger(perAuthority) || perAuthority <= 0) throw new Error("CP005 V7 perAuthority must be a positive integer");
  return Object.freeze(TSD_CP005_APPROVED_LEARNER_AUTHORITIES.flatMap((authority, authorityIndex) =>
    Array.from({ length: perAuthority }, (_unused, questionIndex) =>
      generateCp005ReviewQuestionV7(authority.authorityKey, `cp005-review-v7:${authorityIndex}:${questionIndex}`, questionIndex),
    ),
  ));
}

export function generateCp005EnglishAuditPoolV7(perAuthority = 30): readonly TsdCp005EnglishReviewQuestion[] {
  if (!Number.isInteger(perAuthority) || perAuthority <= 0) throw new Error("CP005 V7 audit perAuthority must be a positive integer");
  return Object.freeze(TSD_CP005_APPROVED_LEARNER_AUTHORITIES.flatMap((authority, authorityIndex) =>
    Array.from({ length: perAuthority }, (_unused, questionIndex) =>
      generateCp005ReviewQuestionV7(authority.authorityKey, `cp005-audit-v7:${authorityIndex}:${questionIndex}`, questionIndex),
    ),
  ));
}
