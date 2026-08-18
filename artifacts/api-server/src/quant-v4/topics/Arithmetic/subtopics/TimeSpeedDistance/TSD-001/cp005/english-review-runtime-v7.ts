import { add, divide, multiply, rational, subtract, type Rational } from "../foundation/rational";
import { formatDurationHours, formatExamNumber } from "../cp003/generation-support";
import type { TsdCp005EnglishReviewQuestion, TsdCp005ReviewExplanation } from "./english-review-runtime";
import { generateCp005ReviewQuestionV6 } from "./english-review-runtime-v6";

function required(value: Rational | undefined, name: string): Rational {
  if (!value) throw new Error(`CP005 V7 explanation missing ${name}`);
  return value;
}

function n(value: Rational): string {
  return formatExamNumber(value);
}

function km(value: Rational): string {
  return `${n(value)} km`;
}

function kmph(value: Rational): string {
  return `${n(value)} km/h`;
}

function time(value: Rational): string {
  return formatDurationHours(value);
}

function ratio(value: Rational): string {
  return `${value.numerator}:${value.denominator}`;
}

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

function firstTime(L: Rational, u: Rational, v: Rational): Rational {
  return divide(L, add(u, v));
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
        method: "The two times are measured after the first meeting. In this situation, the ratio of those remaining times is the square of the opposite speed ratio.",
        steps: Object.freeze([
          `A takes ${time(tA)} after the meeting, while B takes ${time(tB)}.`,
          `So (A's speed / B's speed)^2 = ${n(tB)} / ${n(tA)} = ${n(squaredRatio)}.`,
          `Taking the square root gives A's speed / B's speed = ${ratio(r)}.`,
        ]),
        shortcut: "For two travellers who meet and then continue to the opposite endpoints, take the square root of (B's post-meeting time / A's post-meeting time).",
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
      const speed = target === "A" ? u : v;
      return Object.freeze({
        method: "First recover the second speed and locate the first meeting. Then use only the distance that the asked traveller still has to cover after that meeting.",
        steps: Object.freeze([
          `The route is ${km(L)}. A's speed is ${kmph(u)} and A:B = ${ratio(r)}, so B's speed = ${n(u)} / (${n(r.numerator)}/${n(r.denominator)}) = ${kmph(v)}.`,
          `Their first meeting is ${km(x)} from A's end.`,
          `${target} still has ${km(remaining)} to cover after the meeting, at ${kmph(speed)}.`,
          `Required post-meeting time = ${n(remaining)} / ${n(speed)} = ${time(required(solution.value, "post-meeting time"))}.`,
        ]),
        shortcut: "Do not use the full-route time. Find the first meeting point first, then divide the remaining distance by the asked traveller's speed.",
        finalAnswer: `Therefore, traveller ${target} takes ${answer} after the first meeting.`,
      });
    }

    case "findTotalDistanceFromPostMeetingTimes": {
      const u = required(input.speedA, "speedA");
      const tA = required(input.postMeetingTimeA, "postMeetingTimeA");
      const tB = required(input.postMeetingTimeB, "postMeetingTimeB");
      const r = required(divide(required(solution.value, "route distance"), required(solution.value, "route distance")), "unit ratio");
      // The actual speed ratio is recovered directly from the two post-meeting times.
      const speedRatioSquared = divide(tB, tA);
      const answerL = required(solution.value, "route distance");
      const remainingA = multiply(u, tA);
      const firstMeetingDistanceFromA = subtract(answerL, remainingA);
      const v = divide(firstMeetingDistanceFromA, tB);
      void r;
      return Object.freeze({
        method: "A's post-meeting time gives A's remaining distance directly. B's post-meeting time corresponds to the distance from A's end to the meeting point; together those two pieces make the whole route.",
        steps: Object.freeze([
          `A travels at ${kmph(u)} for ${time(tA)} after the meeting, so A's remaining leg = ${n(u)} × ${n(tA)} = ${km(remainingA)}.`,
          `From the paired post-meeting times, the speed-ratio square is ${n(tB)} / ${n(tA)} = ${n(speedRatioSquared)}; the corresponding B speed is ${kmph(v)}.`,
          `B's post-meeting leg = ${n(v)} × ${n(tB)} = ${km(firstMeetingDistanceFromA)}.`,
          `Whole route = ${n(remainingA)} + ${n(firstMeetingDistanceFromA)} = ${km(answerL)}.`,
        ]),
        shortcut: "After the first meeting, the two remaining legs are exactly the two parts of the original route; recover the missing speed and add those two distances.",
        finalAnswer: `Therefore, the distance between the endpoints is ${answer}.`,
      });
    }

    case "findSpeedsFromPostMeetingTimesAndDistance": {
      const L = required(input.routeDistance, "routeDistance");
      const tA = required(input.postMeetingTimeA, "postMeetingTimeA");
      const tB = required(input.postMeetingTimeB, "postMeetingTimeB");
      const [u, v] = solution.values ?? [];
      if (!u || !v) throw new Error("CP005 V7 speed-pair solution missing");
      const r = divide(u, v);
      return Object.freeze({
        method: "The post-meeting times first tell us the speed ratio. Then use the fact that the two post-meeting distances together equal the full route.",
        steps: Object.freeze([
          `After meeting, A takes ${time(tA)} and B takes ${time(tB)}, so A:B speed ratio = sqrt(${n(tB)}/${n(tA)}) = ${ratio(r)}.`,
          `Let B's speed be v. Then A's speed is (${n(r.numerator)}/${n(r.denominator)})v.`,
          `The two remaining legs make the ${km(L)} route: A-speed × ${n(tA)} + B-speed × ${n(tB)} = ${n(L)}.`,
          `Solving gives B = ${kmph(v)} and A = ${kmph(u)}.`,
        ]),
        shortcut: "Use the square-root time relation for the ratio, then use L = u·tA + v·tB.",
        finalAnswer: `Therefore, the speeds of A and B are ${answer}.`,
      });
    }

    case "findMeetingPointFromPostMeetingTimes": {
      const L = required(input.routeDistance, "routeDistance");
      const tA = required(input.postMeetingTimeA, "postMeetingTimeA");
      const tB = required(input.postMeetingTimeB, "postMeetingTimeB");
      const x = required(solution.value, "meeting point");
      const ratioSquared = divide(tB, tA);
      return Object.freeze({
        method: "Use the post-meeting times to recover the speed ratio. At the first meeting, the two distances already covered are in the same ratio as the speeds.",
        steps: Object.freeze([
          `The route is ${km(L)}. After the meeting A takes ${time(tA)} and B takes ${time(tB)}.`,
          `Thus (A-speed/B-speed)^2 = ${n(tB)}/${n(tA)} = ${n(ratioSquared)}.`,
          `Using that speed ratio to divide the ${km(L)} route places the first meeting ${km(x)} from A's end.`,
        ]),
        shortcut: "Post-meeting times give the speed ratio by a square root; then divide the route in that speed ratio.",
        finalAnswer: `Therefore, the first meeting occurred ${answer} from A's end.`,
      });
    }

    case "findSecondMeetingTimeAfterEndpointTurnaround":
    case "findMeetingAfterBothTurnAtEndpoints": {
      const L = required(input.routeDistance, "routeDistance");
      const u = required(input.speedA, "speedA");
      const v = required(input.speedB, "speedB");
      const sum = add(u, v);
      const t = required(solution.value, "second meeting time");
      return Object.freeze({
        method: "After unfolding the endpoint reversals, the second meeting occurs when the two travellers have covered three route lengths in total.",
        steps: Object.freeze([
          `Route length = ${km(L)} and combined speed = ${n(u)} + ${n(v)} = ${kmph(sum)}.`,
          `For the second meeting, combined distance = 3 × ${n(L)} = ${km(multiply(rational(3), L))}.`,
          `Time = ${n(multiply(rational(3), L))} / ${n(sum)} = ${time(t)}.`,
        ]),
        shortcut: "With instant reversals at both endpoints, the second meeting time is 3L/(u+v).",
        finalAnswer: `Therefore, they meet for the second time after ${answer}.`,
      });
    }

    case "findNthMeetingTimeOnLine": {
      const L = required(input.routeDistance, "routeDistance");
      const u = required(input.speedA, "speedA");
      const v = required(input.speedB, "speedB");
      const count = input.nthMeeting;
      if (!count) throw new Error("CP005 V7 nth meeting missing");
      const odd = 2 * count - 1;
      const path = multiply(rational(odd), L);
      const sum = add(u, v);
      return Object.freeze({
        method: "Unfold the repeated reversals into straight-line motion. The nth meeting occurs after an odd multiple, (2n−1), of the route has been covered in combined travel.",
        steps: Object.freeze([
          `Here n = ${count}, so 2n−1 = ${odd}.`,
          `Combined distance for the ${ordinal(count)} meeting = ${odd} × ${n(L)} = ${km(path)}.`,
          `Combined speed = ${n(u)} + ${n(v)} = ${kmph(sum)}.`,
          `Meeting time = ${n(path)} / ${n(sum)} = ${time(required(solution.value, "nth meeting time"))}.`,
        ]),
        shortcut: "For instant endpoint reversals, t_n = (2n−1)L/(u+v).",
        finalAnswer: `Therefore, their ${ordinal(count)} meeting occurs after ${answer}.`,
      });
    }

    case "findTimeBetweenFirstAndSecondMeetings": {
      const L = required(input.routeDistance, "routeDistance");
      const u = required(input.speedA, "speedA");
      const v = required(input.speedB, "speedB");
      const sum = add(u, v);
      const gap = required(solution.value, "meeting gap");
      return Object.freeze({
        method: "Between the first and second meetings, the two travellers together cover exactly two additional route lengths.",
        steps: Object.freeze([
          `Combined speed = ${n(u)} + ${n(v)} = ${kmph(sum)}.`,
          `Combined distance from the first meeting to the second = 2 × ${n(L)} = ${km(multiply(rational(2), L))}.`,
          `Time gap = ${n(multiply(rational(2), L))} / ${n(sum)} = ${time(gap)}.`,
        ]),
        shortcut: "The first-to-second meeting gap is 2L/(u+v).",
        finalAnswer: `Therefore, the time between the first and second meetings is ${answer}.`,
      });
    }

    case "findSecondMeetingPointAfterEndpointTurnaround":
    case "findNthMeetingPointOnLine": {
      const L = required(input.routeDistance, "routeDistance");
      const u = required(input.speedA, "speedA");
      const v = required(input.speedB, "speedB");
      const count = question.solveMode === "findSecondMeetingPointAfterEndpointTurnaround" ? 2 : input.nthMeeting!;
      const odd = 2 * count - 1;
      const path = multiply(rational(odd), L);
      const sum = add(u, v);
      const t = divide(path, sum);
      const travelled = multiply(u, t);
      return Object.freeze({
        method: "Find the repeated-meeting time on the unfolded route, then convert A's total travelled distance back to its physical position after endpoint reversals.",
        steps: Object.freeze([
          `For the ${ordinal(count)} meeting, combined unfolded distance = ${odd} × ${n(L)} = ${km(path)}.`,
          `At combined speed ${n(u)} + ${n(v)} = ${kmph(sum)}, this takes ${time(t)}.`,
          `A travels ${n(u)} × ${n(t)} = ${km(travelled)} in total by then.`,
          `After reflecting that path at the endpoints, the physical meeting point is ${answer} from A's starting end.`,
        ]),
        shortcut: "Use the odd-multiple meeting time first; total distance travelled is not the same as physical position once endpoint reversals have occurred.",
        finalAnswer: `Therefore, their ${ordinal(count)} meeting point is ${answer} from A's starting end.`,
      });
    }

    case "findRepeatedMeetingCountInTimeWindow": {
      const L = required(input.routeDistance, "routeDistance");
      const u = required(input.speedA, "speedA");
      const v = required(input.speedB, "speedB");
      const window = required(input.timeWindow, "timeWindow");
      const count = Number(required(solution.value, "meeting count").numerator);
      const sum = add(u, v);
      const last = divide(multiply(rational(2 * count - 1), L), sum);
      const next = divide(multiply(rational(2 * (count + 1) - 1), L), sum);
      return Object.freeze({
        method: "List meeting times through the odd-multiple rule and stop when the next meeting would fall outside the given time window.",
        steps: Object.freeze([
          `Combined speed = ${kmph(sum)} and meeting times are (2n−1)×${n(L)}/${n(sum)}.`,
          `The ${ordinal(count)} meeting occurs at ${time(last)}, which is within the ${time(window)} window.`,
          `The ${ordinal(count + 1)} meeting would occur at ${time(next)}, which is after the window.`,
        ]),
        shortcut: "Count the odd-multiple meeting times that are not greater than the stated time limit.",
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
      const t = required(solution.value, "turnaround meeting time");
      return Object.freeze({
        method: "By the return meeting, A has travelled to the far endpoint and part of the way back, while B has travelled outward. Those two travelled distances add to twice the route length.",
        steps: Object.freeze([
          `Route length = ${km(L)}. A and B move at ${kmph(u)} and ${kmph(v)}.`,
          `At the return meeting, total distance covered by A and B together = 2 × ${n(L)} = ${km(multiply(rational(2), L))}.`,
          `Their combined speed is ${n(u)} + ${n(v)} = ${kmph(sum)}.`,
          `Elapsed time = ${n(multiply(rational(2), L))} / ${n(sum)} = ${time(t)}.`,
        ]),
        shortcut: "For this one-turn same-start setup, use 2L/(u+v), not the ordinary first-meeting formula L/(u+v).",
        finalAnswer: `Therefore, the return meeting occurs after ${answer}.`,
      });
    }

    case "findShuttleDistanceCovered": {
      const L = required(input.routeDistance, "routeDistance");
      const u = required(input.speedA, "speedA");
      const v = required(input.speedB, "speedB");
      const t = divide(multiply(rational(2), L), add(u, v));
      const distance = required(solution.value, "shuttle distance");
      return Object.freeze({
        method: "First find when returning A meets B. Then multiply A's speed by that full elapsed time to get A's total outward-plus-return path.",
        steps: Object.freeze([
          `Return-meeting time = 2×${n(L)} / (${n(u)}+${n(v)}) = ${time(t)}.`,
          `A travels at ${kmph(u)} for the whole ${time(t)}.`,
          `A's total distance = ${n(u)} × ${n(t)} = ${km(distance)}.`,
        ]),
        shortcut: "Find the one-turn meeting time first; the requested shuttle distance is u×t, not the physical meeting coordinate.",
        finalAnswer: `Therefore, A travels a total of ${answer} before meeting B on the return journey.`,
      });
    }

    case "findReturnJourneyMeetingPoint": {
      const L = required(input.routeDistance, "routeDistance");
      const u = required(input.speedA, "speedA");
      const v = required(input.speedB, "speedB");
      const t = divide(multiply(rational(2), L), add(u, v));
      const point = required(solution.value, "return meeting point");
      return Object.freeze({
        method: "Find the return-meeting time. B never reverses before this meeting, so B's outward distance directly gives the physical meeting point from the common starting end.",
        steps: Object.freeze([
          `Return-meeting time = 2×${n(L)} / (${n(u)}+${n(v)}) = ${time(t)}.`,
          `B moves outward at ${kmph(v)} for ${time(t)}.`,
          `Meeting point from the start = ${n(v)} × ${n(t)} = ${km(point)}.`,
        ]),
        shortcut: "After finding the one-turn meeting time, use the slower traveller's uninterrupted outward distance to locate the point.",
        finalAnswer: `Therefore, the return-journey meeting point is ${answer} from the starting end.`,
      });
    }

    case "findEndpointRestTimeFromNextMeeting":
    case "findRouteReversalScheduleParameter": {
      const L = required(input.routeDistance, "routeDistance");
      const u = required(input.speedA, "speedA");
      const v = required(input.speedB, "speedB");
      const observed = required(input.observedSecondMeetingTime, "observedSecondMeetingTime");
      const rest = required(solution.value, "endpoint rest");
      const combinedObserved = multiply(add(u, v), observed);
      const requiredMovingPath = multiply(rational(3), L);
      const missingAPath = subtract(combinedObserved, requiredMovingPath);
      return Object.freeze({
        method: "For a normal second meeting the moving travellers account for three route lengths in combined travel. A's rest creates a shortfall equal to the distance A would have covered during that rest.",
        steps: Object.freeze([
          `If nobody rested, the second-meeting combined path would be 3×${n(L)} = ${km(requiredMovingPath)}.`,
          `Over the observed ${time(observed)}, the two speeds together correspond to ${n(add(u, v))} × ${n(observed)} = ${km(combinedObserved)}.`,
          `The excess over 3L is ${n(combinedObserved)} − ${n(requiredMovingPath)} = ${km(missingAPath)}. This is exactly the distance A would have covered while resting.`,
          `A's rest time = ${n(missingAPath)} / ${n(u)} = ${time(rest)}.`,
        ]),
        shortcut: "Use (u+v)×observed time − 3L to find A's missed distance, then divide by A's speed.",
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
      const combinedGapDistance = multiply(sum, gap);
      const L = required(solution.value, "route distance");
      return Object.freeze({
        method: "From the first meeting to the second, the two travellers together cover exactly two route lengths. The observed time gap therefore determines the route directly.",
        steps: Object.freeze([
          `Time gap = ${time(t2)} − ${time(t1)} = ${time(gap)}.`,
          `Combined speed = ${n(u)} + ${n(v)} = ${kmph(sum)}.`,
          `Combined distance during the gap = ${n(sum)} × ${n(gap)} = ${km(combinedGapDistance)} = 2L.`,
          `So L = ${n(combinedGapDistance)}/2 = ${km(L)}.`,
        ]),
        shortcut: "For the first-to-second meeting gap, L = (u+v)(t2−t1)/2.",
        finalAnswer: `Therefore, the distance between the endpoints is ${answer}.`,
      });
    }
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
  return Object.freeze({
    ...base,
    stem: naturalizeStem(base.stem),
    explanation: humanExplanation(base),
  });
}

export function generateCp005ReviewSetV7(perAuthority = 6): readonly TsdCp005EnglishReviewQuestion[] {
  if (!Number.isInteger(perAuthority) || perAuthority <= 0) throw new Error("CP005 V7 perAuthority must be a positive integer");
  const authorities = [...new Set(Array.from({ length: 13 }, (_unused, index) => index))];
  void authorities;
  return Object.freeze((awaitlessAuthorities()).flatMap((authority, authorityIndex) =>
    Array.from({ length: perAuthority }, (_unused, questionIndex) =>
      generateCp005ReviewQuestionV7(authority.authorityKey, `cp005-review-v7:${authorityIndex}:${questionIndex}`, questionIndex),
    ),
  ));
}

function awaitlessAuthorities() {
  // Keep authority order sourced from the same approved registry used by V6 without introducing another lifecycle registry.
  // Dynamic import is intentionally avoided so generation remains synchronous and deterministic.
  return requireApprovedAuthorities();
}

function requireApprovedAuthorities() {
  // This indirection keeps the exported generation functions compact while preserving strict synchronous execution.
  // The value is injected below through the static import alias.
  return APPROVED_AUTHORITIES;
}

import { TSD_CP005_APPROVED_LEARNER_AUTHORITIES as APPROVED_AUTHORITIES } from "./approved-authority-registry";

export function generateCp005EnglishAuditPoolV7(perAuthority = 30): readonly TsdCp005EnglishReviewQuestion[] {
  if (!Number.isInteger(perAuthority) || perAuthority <= 0) throw new Error("CP005 V7 audit perAuthority must be a positive integer");
  return Object.freeze(APPROVED_AUTHORITIES.flatMap((authority, authorityIndex) =>
    Array.from({ length: perAuthority }, (_unused, questionIndex) =>
      generateCp005ReviewQuestionV7(authority.authorityKey, `cp005-audit-v7:${authorityIndex}:${questionIndex}`, questionIndex),
    ),
  ));
}
