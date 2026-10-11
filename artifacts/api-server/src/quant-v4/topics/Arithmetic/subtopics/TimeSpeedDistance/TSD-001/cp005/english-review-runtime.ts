import {
  add,
  divide,
  equals,
  multiply,
  rational,
  subtract,
  toCanonicalString,
  type Rational,
} from "../foundation/rational";
import { formatDurationHours, formatExamNumber, hashSeed } from "../cp003/generation-support";
import { TSD_CP005_APPROVED_LEARNER_AUTHORITIES } from "./approved-authority-registry";
import { buildCp005Input } from "./generator";
import { cp005QlForAuthority } from "./ql-allocation";
import { bouncePosition, solveCp005, sqrtRationalExact } from "./solver";
import type { TsdCp005Input, TsdCp005Solution, TsdCp005SolveMode } from "./types";
import { independentlyVerifyCp005 } from "./verifier";

export type TsdCp005Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface TsdCp005ReviewExplanation {
  readonly method: string;
  readonly steps: readonly string[];
  readonly shortcut: string;
  readonly finalAnswer: string;
}

export interface TsdCp005ReviewOptionAudit {
  readonly text: string;
  readonly misconceptionId: string;
  readonly isCorrect: boolean;
  readonly wrongWorking: Readonly<{ calculation: string; diagnosis: string }> | null;
}

export interface TsdCp005EnglishReviewQuestion {
  readonly chapterId: "TSD-001";
  readonly checkpointId: "TSD-CP-005";
  readonly authorityKey: string;
  readonly permanentQlId: `TSD-QL-${string}`;
  readonly solveMode: TsdCp005SolveMode;
  readonly representation: string;
  readonly language: "en";
  readonly seed: string;
  readonly difficulty: TsdCp005Difficulty;
  readonly stem: string;
  readonly input: TsdCp005Input;
  readonly solution: TsdCp005Solution;
  readonly answerText: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly internalOptionAudit: readonly TsdCp005ReviewOptionAudit[];
  readonly explanation: TsdCp005ReviewExplanation;
  readonly mathematicalFingerprint: string;
  readonly validation: Readonly<{ valid: boolean; errors: readonly string[]; warnings: readonly string[] }>;
  readonly lifecycle: Readonly<{
    reviewStatus: "ENGLISH_REVIEW_CANDIDATE";
    englishFreezeStatus: "UNFROZEN";
    questionStudioEnabled: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}

type Wrong = Readonly<{ text: string; misconceptionId: string; calculation: string; diagnosis: string }>;

function required(value: Rational | undefined, name: string): Rational {
  if (!value) throw new Error(`CP005 review missing ${name}`);
  return value;
}

function num(value: Rational | undefined): string {
  return value ? formatExamNumber(value) : "?";
}

function km(value: Rational | undefined): string {
  return `${num(value)} km`;
}

function kmph(value: Rational | undefined): string {
  return `${num(value)} km/h`;
}

function duration(value: Rational | undefined): string {
  return value ? formatDurationHours(value) : "?";
}

function ratioText(value: Rational): string {
  return `${value.numerator}:${value.denominator}`;
}

function formatValue(value: Rational, unit: TsdCp005Solution["unit"]): string {
  switch (unit) {
    case "RATIO": return ratioText(value);
    case "HOUR": return formatDurationHours(value);
    case "KM": return `${formatExamNumber(value)} km`;
    case "KM_PER_HOUR": return `${formatExamNumber(value)} km/h`;
    case "COUNT": return formatExamNumber(value);
    case "NONE": return formatExamNumber(value);
  }
}

function formatAnswer(solution: TsdCp005Solution): string {
  if (solution.answerKind === "VALUE" && solution.value) return formatValue(solution.value, solution.unit);
  if (solution.answerKind === "PAIR" && solution.values?.length === 2) {
    return `${formatExamNumber(solution.values[0]!)} km/h and ${formatExamNumber(solution.values[1]!)} km/h`;
  }
  throw new Error(`${solution.solveMode}: learner review supports VALUE/PAIR answers only`);
}

function pairText(a: Rational, b: Rational): string {
  return `${formatExamNumber(a)} km/h and ${formatExamNumber(b)} km/h`;
}

function valueWrong(value: Rational, unit: TsdCp005Solution["unit"], misconceptionId: string, calculation: string, diagnosis: string): Wrong {
  return Object.freeze({ text: formatValue(value, unit), misconceptionId, calculation, diagnosis });
}

function pairWrong(a: Rational, b: Rational, misconceptionId: string, calculation: string, diagnosis: string): Wrong {
  return Object.freeze({ text: pairText(a, b), misconceptionId, calculation, diagnosis });
}

function firstMeeting(route: Rational, speedA: Rational, speedB: Rational): Rational {
  return divide(route, add(speedA, speedB));
}

function firstMeetingPoint(route: Rational, speedA: Rational, speedB: Rational): Rational {
  return multiply(speedA, firstMeeting(route, speedA, speedB));
}

function semanticWrongs(mode: TsdCp005SolveMode, input: TsdCp005Input, solution: TsdCp005Solution): readonly Wrong[] {
  const unit = solution.unit;
  const route = input.routeDistance;
  const u = input.speedA;
  const v = input.speedB;

  switch (mode) {
    case "findSpeedRatioFromPostMeetingArrivalTimes": {
      const a = required(input.postMeetingTimeA, "postMeetingTimeA");
      const b = required(input.postMeetingTimeB, "postMeetingTimeB");
      const inverseRoot = sqrtRationalExact(divide(a, b));
      return Object.freeze([
        valueWrong(inverseRoot, unit, "REVERSE_POST_TIME_RATIO", `sqrt(tA/tB) = ${toCanonicalString(inverseRoot)}`, "The post-meeting time ratio was reversed before taking the square root."),
        valueWrong(divide(b, a), unit, "SKIP_SQUARE_ROOT", `tB/tA = ${toCanonicalString(divide(b, a))}`, "The squared speed-ratio relation was used directly without taking its square root."),
        valueWrong(divide(a, b), unit, "REVERSE_AND_SKIP_ROOT", `tA/tB = ${toCanonicalString(divide(a, b))}`, "Both the arrival-time order and the square-root step were mishandled."),
      ]);
    }

    case "findPostMeetingArrivalTimeFromSpeedRatio": {
      const r = required(input.speedRatio, "speedRatio");
      const speedA = required(u, "speedA");
      const L = required(route, "routeDistance");
      const speedB = divide(speedA, r);
      const tFirst = firstMeeting(L, speedA, speedB);
      const otherPost = input.targetPostBody === "B"
        ? divide(subtract(L, firstMeetingPoint(L, speedA, speedB)), speedA)
        : divide(firstMeetingPoint(L, speedA, speedB), speedB);
      return Object.freeze([
        valueWrong(divide(L, speedA), unit, "USE_FULL_ROUTE_TIME", `L/u = ${toCanonicalString(divide(L, speedA))}`, "The full route was used instead of only the distance remaining after the first meeting."),
        valueWrong(tFirst, unit, "USE_FIRST_MEETING_TIME", `L/(u+v) = ${toCanonicalString(tFirst)}`, "The time up to the first meeting was returned instead of the post-meeting arrival time."),
        valueWrong(otherPost, unit, "USE_OTHER_TRAVELLER_POST_TIME", `other traveller post-time = ${toCanonicalString(otherPost)}`, "The other traveller's remaining journey time was selected."),
      ]);
    }

    case "findTotalDistanceFromPostMeetingTimes": {
      const speedA = required(u, "speedA");
      const tA = required(input.postMeetingTimeA, "postMeetingTimeA");
      const tB = required(input.postMeetingTimeB, "postMeetingTimeB");
      return Object.freeze([
        valueWrong(multiply(speedA, tA), unit, "USE_REMAINING_DISTANCE_ONLY", `u*tA = ${toCanonicalString(multiply(speedA, tA))}`, "Only A's post-meeting remaining distance was counted, not the whole route."),
        valueWrong(multiply(speedA, add(tA, tB)), unit, "ADD_POST_TIMES_AT_ONE_SPEED", `u*(tA+tB) = ${toCanonicalString(multiply(speedA, add(tA, tB)))}`, "Both post-meeting times were added and incorrectly treated as travel at A's speed."),
        valueWrong(multiply(speedA, tB), unit, "USE_OTHER_POST_TIME_AT_A_SPEED", `u*tB = ${toCanonicalString(multiply(speedA, tB))}`, "B's post-meeting time was paired with A's speed as if it represented the full route."),
      ]);
    }

    case "findSpeedsFromPostMeetingTimesAndDistance": {
      const values = solution.values!;
      const speedA = values[0]!;
      const speedB = values[1]!;
      const L = required(route, "routeDistance");
      const tA = required(input.postMeetingTimeA, "postMeetingTimeA");
      const tB = required(input.postMeetingTimeB, "postMeetingTimeB");
      return Object.freeze([
        pairWrong(speedB, speedA, "SWAP_TRAVELLER_SPEEDS", "interchange recovered u and v", "The two recovered speeds were assigned to the wrong travellers."),
        pairWrong(divide(L, tA), divide(L, tB), "TREAT_POST_TIMES_AS_FULL_ROUTE_TIMES", "L/tA and L/tB", "Each post-meeting time was incorrectly treated as the time for the full route."),
        pairWrong(speedA, speedA, "ASSUME_EQUAL_SPEEDS", `u=v=${toCanonicalString(speedA)}`, "The different post-meeting arrival times were ignored and equal speeds were assumed."),
      ]);
    }

    case "findMeetingPointFromPostMeetingTimes": {
      const L = required(route, "routeDistance");
      const correct = solution.value!;
      return Object.freeze([
        valueWrong(subtract(L, correct), unit, "MEASURE_FROM_OTHER_ENDPOINT", `L-x = ${toCanonicalString(subtract(L, correct))}`, "The meeting point was measured from the opposite endpoint."),
        valueWrong(divide(L, rational(2)), unit, "ASSUME_MIDPOINT", `L/2 = ${toCanonicalString(divide(L, rational(2)))}`, "Equal meeting distances were assumed despite unequal post-meeting times."),
        valueWrong(divide(multiply(L, required(input.postMeetingTimeB, "postMeetingTimeB")), add(required(input.postMeetingTimeA, "postMeetingTimeA"), required(input.postMeetingTimeB, "postMeetingTimeB"))), unit, "USE_TIME_RATIO_DIRECTLY", "L*tB/(tA+tB)", "The post-meeting time ratio was used directly instead of first converting it to the speed ratio."),
      ]);
    }

    case "findSecondMeetingTimeAfterEndpointTurnaround":
    case "findNthMeetingTimeOnLine":
    case "findMeetingAfterBothTurnAtEndpoints":
    case "findTimeBetweenFirstAndSecondMeetings": {
      const L = required(route, "routeDistance");
      const sum = add(required(u, "speedA"), required(v, "speedB"));
      const n = input.nthMeeting ?? (mode === "findSecondMeetingTimeAfterEndpointTurnaround" || mode === "findMeetingAfterBothTurnAtEndpoints" ? 2 : 1);
      const first = divide(L, sum);
      const doublePath = divide(multiply(rational(2 * Math.max(1, n)), L), sum);
      const evenOddConfusion = divide(multiply(rational(Math.max(1, 2 * n - 2)), L), sum);
      return Object.freeze([
        valueWrong(first, unit, "STOP_AT_FIRST_MEETING", `L/(u+v) = ${toCanonicalString(first)}`, "Only the first meeting was considered and endpoint reflections after it were ignored."),
        valueWrong(doublePath, unit, "USE_EVEN_MULTIPLE_PATH", `2nL/(u+v) = ${toCanonicalString(doublePath)}`, "Repeated meetings on a bounded line occur at odd combined-path multiples, not even ones."),
        valueWrong(evenOddConfusion, unit, "DROP_ONE_ROUTE_LENGTH", `(2n-2)L/(u+v) = ${toCanonicalString(evenOddConfusion)}`, "One complete route length was omitted from the reflected-path schedule."),
      ]);
    }

    case "findSecondMeetingPointAfterEndpointTurnaround":
    case "findNthMeetingPointOnLine": {
      const L = required(route, "routeDistance");
      const speedA = required(u, "speedA");
      const speedB = required(v, "speedB");
      const firstPoint = firstMeetingPoint(L, speedA, speedB);
      const correct = solution.value!;
      return Object.freeze([
        valueWrong(firstPoint, unit, "REUSE_FIRST_MEETING_POINT", `first point = ${toCanonicalString(firstPoint)}`, "The first meeting coordinate was reused without reflecting later travel at the endpoints."),
        valueWrong(subtract(L, correct), unit, "REFLECT_FROM_WRONG_ENDPOINT", `L-x = ${toCanonicalString(subtract(L, correct))}`, "The final reflected position was measured from the wrong end of the route."),
        valueWrong(divide(L, rational(2)), unit, "ASSUME_ROUTE_MIDPOINT", `L/2 = ${toCanonicalString(divide(L, rational(2)))}`, "The repeated meeting was assumed to occur at the midpoint regardless of the speed ratio."),
      ]);
    }

    case "findRepeatedMeetingCountInTimeWindow": {
      const count = solution.value!;
      const lower = subtract(count, rational(1));
      const upper = add(count, rational(1));
      const oddPathEvents = add(multiply(count, rational(2)), rational(-1));
      return Object.freeze([
        valueWrong(lower, unit, "EXCLUDE_FIRST_MEETING", `count-1 = ${toCanonicalString(lower)}`, "The first valid meeting inside the window was incorrectly excluded."),
        valueWrong(upper, unit, "INCLUDE_NEXT_MEETING_AFTER_DEADLINE", `count+1 = ${toCanonicalString(upper)}`, "The next meeting after the stated time window was counted."),
        valueWrong(oddPathEvents, unit, "COUNT_ODD_PATH_MULTIPLES_AS_MEETINGS", `2*count-1 = ${toCanonicalString(oddPathEvents)}`, "Odd route-length multipliers were counted as separate meetings rather than used to locate meeting events."),
      ]);
    }

    case "findMeetingAfterOneTravellerTurnsBack":
    case "findShuttleMeetingTime":
    case "findPassThenCatchAfterTurnaround": {
      const L = required(route, "routeDistance");
      const speedA = required(u, "speedA");
      const speedB = required(v, "speedB");
      return Object.freeze([
        valueWrong(divide(L, add(speedA, speedB)), unit, "USE_FIRST_MEETING_EQUATION", `L/(u+v) = ${toCanonicalString(divide(L, add(speedA, speedB)))}`, "The calculation stops at the ordinary first meeting and ignores A reaching the endpoint and returning."),
        valueWrong(divide(L, speedA), unit, "STOP_WHEN_FAST_TRAVELLER_REACHES_ENDPOINT", `L/u = ${toCanonicalString(divide(L, speedA))}`, "The time when A reaches the endpoint was mistaken for the later return meeting."),
        valueWrong(divide(multiply(rational(2), L), subtract(speedA, speedB)), unit, "USE_PURSUIT_DIFFERENCE_AFTER_TURN", `2L/(u-v) = ${toCanonicalString(divide(multiply(rational(2), L), subtract(speedA, speedB)))}`, "The whole event was treated as same-direction pursuit even though the route includes outward travel and a reversal."),
      ]);
    }

    case "findShuttleDistanceCovered": {
      const L = required(route, "routeDistance");
      const speedA = required(u, "speedA");
      const speedB = required(v, "speedB");
      const t = divide(multiply(rational(2), L), add(speedA, speedB));
      return Object.freeze([
        valueWrong(L, unit, "COUNT_OUTWARD_LEG_ONLY", `L = ${toCanonicalString(L)}`, "Only the outward leg to the endpoint was counted; the return leg before meeting was omitted."),
        valueWrong(multiply(speedB, t), unit, "USE_OTHER_TRAVELLER_DISTANCE", `v*t = ${toCanonicalString(multiply(speedB, t))}`, "The slower traveller's distance was returned instead of the shuttle traveller's total path."),
        valueWrong(subtract(multiply(rational(2), L), multiply(speedA, t)), unit, "USE_UNTRAVELLED_REFLECTION", `2L-u*t`, "The reflected remainder of the route was mistaken for the distance actually travelled by the shuttle."),
      ]);
    }

    case "findReturnJourneyMeetingPoint": {
      const L = required(route, "routeDistance");
      const speedA = required(u, "speedA");
      const speedB = required(v, "speedB");
      const firstPoint = firstMeetingPoint(L, speedA, speedB);
      const correct = solution.value!;
      return Object.freeze([
        valueWrong(firstPoint, unit, "USE_FIRST_MEETING_POINT", `first meeting point = ${toCanonicalString(firstPoint)}`, "The original first meeting point was returned instead of the later return-journey meeting point."),
        valueWrong(subtract(L, correct), unit, "MEASURE_RETURN_POINT_FROM_FAR_END", `L-x = ${toCanonicalString(subtract(L, correct))}`, "The return meeting coordinate was measured from the turnaround endpoint rather than the requested starting endpoint."),
        valueWrong(divide(L, rational(2)), unit, "ASSUME_MIDPOINT_RETURN_MEETING", `L/2 = ${toCanonicalString(divide(L, rational(2)))}`, "The route midpoint was assumed without using the travellers' unequal speeds."),
      ]);
    }

    case "findEndpointRestTimeFromNextMeeting":
    case "findRouteReversalScheduleParameter": {
      const L = required(route, "routeDistance");
      const speedA = required(u, "speedA");
      const speedB = required(v, "speedB");
      const observed = required(input.observedSecondMeetingTime, "observedSecondMeetingTime");
      const excessCombinedDistance = subtract(multiply(add(speedA, speedB), observed), multiply(rational(3), L));
      return Object.freeze([
        valueWrong(divide(excessCombinedDistance, add(speedA, speedB)), unit, "DIVIDE_DELAY_DISTANCE_BY_COMBINED_SPEED", "excess/(u+v)", "The lost distance caused by A's rest was converted back to time using the combined speed instead of A's own speed."),
        valueWrong(divide(subtract(multiply(add(speedA, speedB), observed), multiply(rational(2), L)), speedA), unit, "USE_TWO_ROUTE_BASELINE", "((u+v)t-2L)/u", "The no-rest second-meeting baseline was taken as 2L instead of the required combined path 3L."),
        valueWrong(subtract(observed, divide(multiply(rational(3), L), add(speedA, speedB))), unit, "TREAT_EVENT_DELAY_AS_REST", "observed t2 - no-rest t2", "The delay in the meeting event was equated directly with A's rest, ignoring that only A loses distance while both travellers continue to determine the meeting schedule."),
      ]);
    }

    case "findDistanceBetweenEndpointsFromRepeatedMeetings": {
      const speedA = required(u, "speedA");
      const speedB = required(v, "speedB");
      const t1 = required(input.observedFirstMeetingTime, "observedFirstMeetingTime");
      const t2 = required(input.observedSecondMeetingTime, "observedSecondMeetingTime");
      const sum = add(speedA, speedB);
      return Object.freeze([
        valueWrong(multiply(sum, subtract(t2, t1)), unit, "OMIT_FACTOR_TWO", `(u+v)(t2-t1)`, "The interval between consecutive first/second meetings corresponds to 2L of combined travel, so the factor 2 was omitted."),
        valueWrong(multiply(sum, t1), unit, "USE_FIRST_MEETING_ONLY", `(u+v)t1`, "Only the first-meeting observation was used instead of the repeated-meeting gap requested by the question."),
        valueWrong(divide(multiply(sum, t2), rational(3)), unit, "USE_SECOND_TIME_WITH_THREE_LAW_ONLY", `(u+v)t2/3`, "The second-meeting time was used alone, ignoring that the problem supplies a repeated-meeting time gap to reconstruct the route."),
      ]);
    }

    default:
      throw new Error(`${mode}: held/QA mode reached CP005 learner review runtime`);
  }
}

function authorityDifficulty(authorityKey: string): TsdCp005Difficulty {
  if ([
    "speedRatioFromPostMeetingArrivalTimes",
    "postMeetingArrivalTimeFromSpeedRelation",
    "repeatedLinearMeetingTime",
    "repeatedLinearMeetingCount",
  ].includes(authorityKey)) return "EASY";
  if ([
    "shuttleDistanceBeforeReturnMeeting",
    "endpointRestFromNextMeeting",
    "routeDistanceFromRepeatedMeetingGap",
  ].includes(authorityKey)) return "HARD";
  return "MEDIUM";
}

function representationFor(authorityKey: string, ordinal: number): string {
  const authority = TSD_CP005_APPROVED_LEARNER_AUTHORITIES.find((entry) => entry.authorityKey === authorityKey);
  if (!authority) throw new Error(`${authorityKey}: unknown CP005 approved authority`);
  return authority.examRepresentations[ordinal % authority.examRepresentations.length]!;
}

function stemPrefix(variant: number): string {
  return [
    "Two travellers move on a straight road between towns A and B.",
    "A road-study records two vehicles moving between endpoints P and Q.",
    "Two cyclists travel repeatedly along the same bounded route.",
    "On a straight route with fixed endpoints, two runners maintain constant speeds.",
  ][variant % 4]!;
}

function renderStem(mode: TsdCp005SolveMode, input: TsdCp005Input, variant: number): string {
  const lead = stemPrefix(variant);
  const L = input.routeDistance;
  const u = input.speedA;
  const v = input.speedB;
  switch (mode) {
    case "findSpeedRatioFromPostMeetingArrivalTimes":
      return `${lead} They start simultaneously from opposite ends and meet once. After meeting, A reaches B's end in ${duration(input.postMeetingTimeA)}, while B reaches A's end in ${duration(input.postMeetingTimeB)}. Find the ratio of A's speed to B's speed.`;
    case "findPostMeetingArrivalTimeFromSpeedRatio":
      return `${lead} The route is ${km(L)} long. A travels at ${kmph(u)}, and A:B speed ratio is ${ratioText(required(input.speedRatio, "speedRatio"))}. After their first meeting, how long does traveller ${input.targetPostBody ?? "A"} take to reach the opposite endpoint?`;
    case "findTotalDistanceFromPostMeetingTimes":
      return `${lead} A travels at ${kmph(u)}. After their first meeting, A reaches B in ${duration(input.postMeetingTimeA)} and B reaches A in ${duration(input.postMeetingTimeB)}. Find the distance between the two endpoints.`;
    case "findSpeedsFromPostMeetingTimesAndDistance":
      return `${lead} The endpoints are ${km(L)} apart. After the first meeting, A takes ${duration(input.postMeetingTimeA)} to reach B and B takes ${duration(input.postMeetingTimeB)} to reach A. Find the speeds of A and B respectively.`;
    case "findMeetingPointFromPostMeetingTimes":
      return `${lead} The route is ${km(L)} long. After the first meeting, A needs ${duration(input.postMeetingTimeA)} to reach B and B needs ${duration(input.postMeetingTimeB)} to reach A. How far from A did their first meeting occur?`;
    case "findSecondMeetingTimeAfterEndpointTurnaround":
      return `${lead} The route is ${km(L)} long. A and B start together from opposite ends at ${kmph(u)} and ${kmph(v)}. Each turns back immediately on reaching an endpoint. How long after the start will they meet for the second time?`;
    case "findNthMeetingTimeOnLine":
      return `${lead} A and B start simultaneously from opposite ends of a ${km(L)} route at ${kmph(u)} and ${kmph(v)} and reverse instantly at each endpoint. Find the time of their ${input.nthMeeting}th meeting after the start.`;
    case "findMeetingAfterBothTurnAtEndpoints":
      return `${lead} A and B start from opposite ends of a ${km(L)} route at ${kmph(u)} and ${kmph(v)}. Both keep moving and turn instantly at the endpoints. Find the time of their next meeting after both-endpoint motion has begun.`;
    case "findTimeBetweenFirstAndSecondMeetings":
      return `${lead} A and B start together from opposite ends of a ${km(L)} route at ${kmph(u)} and ${kmph(v)} and turn instantly at the endpoints. Find the time interval between their first and second meetings.`;
    case "findSecondMeetingPointAfterEndpointTurnaround":
      return `${lead} A and B start from opposite ends of a ${km(L)} route at ${kmph(u)} and ${kmph(v)} and reverse instantly at the endpoints. How far from A's starting end is their second meeting point?`;
    case "findNthMeetingPointOnLine":
      return `${lead} A and B start simultaneously from opposite ends of a ${km(L)} route at ${kmph(u)} and ${kmph(v)} and keep reflecting at the endpoints. How far from A's starting end is their ${input.nthMeeting}th meeting point?`;
    case "findRepeatedMeetingCountInTimeWindow":
      return `${lead} A and B start from opposite ends of a ${km(L)} route at ${kmph(u)} and ${kmph(v)}, turning instantly at every endpoint. How many times do they meet during the first ${duration(input.timeWindow)}?`;
    case "findMeetingAfterOneTravellerTurnsBack":
      return `${lead} Both start from A at the same time. Traveller A moves at ${kmph(u)} towards B, reaches B and immediately turns back; traveller B continues from A towards B at ${kmph(v)}. How long after the start do they meet?`;
    case "findShuttleMeetingTime":
      return `${lead} A starts from P at ${kmph(u)}, touches Q and immediately returns. B starts from P at ${kmph(v)} and keeps moving towards Q. If PQ is ${km(L)}, after how much time will returning A meet B?`;
    case "findPassThenCatchAfterTurnaround":
      return `${lead} A and B leave the same endpoint together at ${kmph(u)} and ${kmph(v)}. A reaches the far end of the ${km(L)} route first, turns immediately and meets B on the return. Find the elapsed time.`;
    case "findShuttleDistanceCovered":
      return `${lead} A leaves P at ${kmph(u)}, reaches Q and turns back immediately. B leaves P at ${kmph(v)} and continues towards Q. If PQ is ${km(L)}, find the total distance travelled by A before the return meeting.`;
    case "findReturnJourneyMeetingPoint":
      return `${lead} A and B leave P together at ${kmph(u)} and ${kmph(v)}. A reaches Q on the ${km(L)} route, turns immediately and later meets B. How far from P is that return-journey meeting point?`;
    case "findEndpointRestTimeFromNextMeeting":
    case "findRouteReversalScheduleParameter":
      return `${lead} A and B start from opposite ends of a ${km(L)} route at ${kmph(u)} and ${kmph(v)}. A rests for some time on reaching the far endpoint before turning, while B turns immediately. Their second meeting occurs ${duration(input.observedSecondMeetingTime)} after the start. Find A's endpoint rest time.`;
    case "findDistanceBetweenEndpointsFromRepeatedMeetings":
      return `${lead} A and B move at ${kmph(u)} and ${kmph(v)}, starting simultaneously from opposite ends and turning instantly at the endpoints. Their first meeting occurs after ${duration(input.observedFirstMeetingTime)} and their second after ${duration(input.observedSecondMeetingTime)}. Find the distance between the endpoints.`;
    default:
      throw new Error(`${mode}: no CP005 learner stem is defined`);
  }
}

function explanationFor(authorityKey: string, mode: TsdCp005SolveMode, input: TsdCp005Input, solution: TsdCp005Solution, answerText: string): TsdCp005ReviewExplanation {
  const methodByAuthority: Record<string, string> = {
    speedRatioFromPostMeetingArrivalTimes: "Use the standard post-meeting relation: the ratio of the two remaining arrival times equals the square of the opposite speed ratio.",
    postMeetingArrivalTimeFromSpeedRelation: "Recover the other speed, locate the first meeting, then use only the distance that remains after that meeting.",
    routeDistanceFromPostMeetingEvidence: "Use the two post-meeting times to recover the speed ratio, then rebuild the full endpoint distance from A's remaining leg.",
    individualSpeedsFromPostMeetingEvidence: "First recover the speed ratio from the post-meeting times, then use the known route length to recover both speeds.",
    firstMeetingPointFromPostMeetingEvidence: "Convert the post-meeting arrival times into the speed ratio; at the first meeting, distances from the endpoints are in the same ratio as the speeds.",
    repeatedLinearMeetingTime: "For repeated endpoint motion, unfold the reflected route into one straight line. Successive meetings occur at odd multiples of the route length in combined travel.",
    repeatedLinearMeetingPoint: "Find the repeated-meeting time on the unfolded line, then reflect A's travelled distance back into the physical route.",
    repeatedLinearMeetingCount: "Meeting times correspond to odd multiples of L/(u+v). Count only those event times that fall inside the stated window.",
    singleTurnaroundMeetingTime: "A travels to the far endpoint and then returns. By the return meeting, A's path plus B's path equals twice the route length.",
    shuttleDistanceBeforeReturnMeeting: "Find the return-meeting time first; A's total shuttle distance is its speed multiplied by that full elapsed time.",
    returnJourneyMeetingPoint: "Find the return-meeting time, then use B's uninterrupted outward distance to locate the physical meeting point from the starting end.",
    endpointRestFromNextMeeting: "Without a rest the second meeting needs a combined path of 3L. The extra observed combined distance is exactly the distance A failed to cover while resting.",
    routeDistanceFromRepeatedMeetingGap: "The interval from the first meeting to the second adds exactly 2L of combined travel, so the route follows directly from the time gap and the sum of speeds.",
  };
  const rawSteps = solution.derivation.map((step) => step.replace(/=/g, " = "));
  const numericContext = mode === "findSpeedsFromPostMeetingTimesAndDistance"
    ? `The route is ${km(input.routeDistance)}, with post-meeting times ${duration(input.postMeetingTimeA)} and ${duration(input.postMeetingTimeB)}.`
    : `Use the stated distances, speeds and times exactly as given in the question.`;
  return Object.freeze({
    method: methodByAuthority[authorityKey] ?? "Model the bounded-line motion exactly and solve the requested quantity.",
    steps: Object.freeze([numericContext, ...rawSteps]),
    shortcut: authorityKey.startsWith("repeatedLinear") ? "Unfold endpoint reflections into straight-line combined travel, then reflect back only if a physical point is required." : "Keep the first-meeting part and post-meeting/turnaround part separate so the correct distance is paired with the correct time.",
    finalAnswer: `Therefore, the required answer is ${answerText}.`,
  });
}

function rationals(value: unknown, output: Rational[] = []): Rational[] {
  if (!value || typeof value !== "object") return output;
  const candidate = value as Partial<Rational>;
  if (typeof candidate.numerator === "bigint" && typeof candidate.denominator === "bigint") {
    output.push(candidate as Rational);
    return output;
  }
  for (const child of Object.values(value as Record<string, unknown>)) rationals(child, output);
  return output;
}

function correctPosition(permanentQlId: string, seed: string): number {
  return (hashSeed(`${permanentQlId}:${seed}`) + Number(permanentQlId.slice(-3))) % 4;
}

function buildOptions(mode: TsdCp005SolveMode, input: TsdCp005Input, solution: TsdCp005Solution, permanentQlId: string, seed: string) {
  const correctText = formatAnswer(solution);
  const semantic = semanticWrongs(mode, input, solution);
  const distinct = semantic.filter((entry, index) => entry.text !== correctText && semantic.findIndex((candidate) => candidate.text === entry.text) === index);
  if (distinct.length < 3) throw new Error(`${mode}: fewer than three distinct semantic distractors for ${seed}`);
  const wrongs = distinct.slice(0, 3);
  const correctIndex = correctPosition(permanentQlId, seed);
  const entries: TsdCp005ReviewOptionAudit[] = wrongs.map((wrong) => Object.freeze({
    text: wrong.text,
    misconceptionId: wrong.misconceptionId,
    isCorrect: false,
    wrongWorking: Object.freeze({ calculation: wrong.calculation, diagnosis: wrong.diagnosis }),
  }));
  entries.splice(correctIndex, 0, Object.freeze({ text: correctText, misconceptionId: "CORRECT", isCorrect: true, wrongWorking: null }));
  return Object.freeze({
    answerText: correctText,
    correctIndex,
    options: Object.freeze(entries.map((entry) => entry.text)),
    audit: Object.freeze(entries),
  });
}

function validate(question: Omit<TsdCp005EnglishReviewQuestion, "validation">): TsdCp005EnglishReviewQuestion["validation"] {
  const errors: string[] = [];
  const warnings: string[] = [];
  const verification = independentlyVerifyCp005(question.input, question.solution);
  if (!verification.valid) errors.push(...verification.errors);
  if (question.options.length !== 4 || new Set(question.options).size !== 4) errors.push("options must contain four unique values");
  if (question.options[question.correctIndex] !== question.answerText) errors.push("keyed option does not equal answer text");
  if (question.internalOptionAudit.filter((entry) => entry.isCorrect).length !== 1) errors.push("option audit must contain exactly one correct option");
  if (question.internalOptionAudit.filter((entry) => !entry.isCorrect && entry.wrongWorking).length !== 3) errors.push("every distractor must retain semantic wrong-working provenance");
  if (question.explanation.steps.length < 2) errors.push("learner explanation is too short");
  if ((question.explanation as unknown as Record<string, unknown>).optionAnalysis !== undefined) errors.push("public explanation must not expose option analysis");
  if (cp005QlForAuthority(question.authorityKey).permanentQlId !== question.permanentQlId) errors.push("permanent QL does not match approved authority allocation");
  if (question.lifecycle.questionStudioEnabled || question.lifecycle.questionBankStatus !== "NOT_STORED" || question.lifecycle.testEligibility !== "INELIGIBLE" || question.lifecycle.publiclyPublishable) errors.push("downstream lifecycle unlocked during CP005 English review");
  if (question.stem.length < 80) warnings.push("stem is unusually short for CP005 review");
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors), warnings: Object.freeze(warnings) });
}

export function generateCp005ReviewQuestion(authorityKey: string, seed: string, ordinal = 0): TsdCp005EnglishReviewQuestion {
  const authority = TSD_CP005_APPROVED_LEARNER_AUTHORITIES.find((entry) => entry.authorityKey === authorityKey);
  if (!authority) throw new Error(`${authorityKey}: not an approved CP005 learner authority`);
  const solveMode = authority.underlyingSolveModes[ordinal % authority.underlyingSolveModes.length] as TsdCp005SolveMode;
  const input = buildCp005Input(solveMode, seed);
  const solution = solveCp005(solveMode, input);
  const verification = independentlyVerifyCp005(input, solution);
  if (!verification.valid) throw new Error(`${authorityKey}/${solveMode}: generated state failed independent verification: ${verification.errors.join("; ")}`);
  const permanentQlId = cp005QlForAuthority(authorityKey).permanentQlId;
  const built = buildOptions(solveMode, input, solution, permanentQlId, seed);
  const representation = representationFor(authorityKey, ordinal);
  const draft = {
    chapterId: "TSD-001" as const,
    checkpointId: "TSD-CP-005" as const,
    authorityKey,
    permanentQlId,
    solveMode,
    representation,
    language: "en" as const,
    seed,
    difficulty: authorityDifficulty(authorityKey),
    stem: renderStem(solveMode, input, ordinal),
    input,
    solution,
    answerText: built.answerText,
    options: built.options,
    correctIndex: built.correctIndex,
    internalOptionAudit: built.audit,
    explanation: explanationFor(authorityKey, solveMode, input, solution, built.answerText),
    mathematicalFingerprint: `${authorityKey}|${solveMode}|${rationals(input).map(toCanonicalString).join("|")}`,
    lifecycle: Object.freeze({
      reviewStatus: "ENGLISH_REVIEW_CANDIDATE" as const,
      englishFreezeStatus: "UNFROZEN" as const,
      questionStudioEnabled: false as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
    }),
  };
  return Object.freeze({ ...draft, validation: validate(draft) });
}

export function generateCp005ReviewSet(perAuthority = 6): readonly TsdCp005EnglishReviewQuestion[] {
  if (!Number.isInteger(perAuthority) || perAuthority <= 0) throw new Error("CP005 perAuthority must be a positive integer");
  return Object.freeze(TSD_CP005_APPROVED_LEARNER_AUTHORITIES.flatMap((authority, authorityIndex) =>
    Array.from({ length: perAuthority }, (_unused, questionIndex) =>
      generateCp005ReviewQuestion(authority.authorityKey, `cp005-review:${authorityIndex}:${questionIndex}`, questionIndex),
    ),
  ));
}

export function generateCp005EnglishAuditPool(perAuthority = 30): readonly TsdCp005EnglishReviewQuestion[] {
  if (!Number.isInteger(perAuthority) || perAuthority <= 0) throw new Error("CP005 audit perAuthority must be a positive integer");
  return Object.freeze(TSD_CP005_APPROVED_LEARNER_AUTHORITIES.flatMap((authority, authorityIndex) =>
    Array.from({ length: perAuthority }, (_unused, questionIndex) =>
      generateCp005ReviewQuestion(authority.authorityKey, `cp005-audit:${authorityIndex}:${questionIndex}`, questionIndex),
    ),
  ));
}
