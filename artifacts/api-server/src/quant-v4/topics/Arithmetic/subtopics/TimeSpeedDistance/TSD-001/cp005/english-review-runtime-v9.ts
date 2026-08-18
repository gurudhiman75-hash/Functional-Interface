import type { Rational } from "../foundation/rational";
import { formatDurationHours, formatExamNumber } from "../cp003/generation-support";
import type { TsdCp005EnglishReviewQuestion } from "./english-review-runtime";
import { generateCp005EnglishAuditPoolV8, generateCp005ReviewSetV8 } from "./english-review-runtime-v8";

function required(value: Rational | undefined, name: string): Rational {
  if (!value) throw new Error(`CP005 V9 stem missing ${name}`);
  return value;
}
function n(value: Rational): string { return formatExamNumber(value); }
function km(value: Rational): string { return `${n(value)} km`; }
function kmph(value: Rational): string { return `${n(value)} km/h`; }
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

function renderExamStem(question: TsdCp005EnglishReviewQuestion): string {
  const i = question.input;
  switch (question.solveMode) {
    case "findSpeedRatioFromPostMeetingArrivalTimes":
      return `Travellers A and B start simultaneously from endpoints P and Q respectively and meet on the way. After the meeting, A takes ${duration(required(i.postMeetingTimeA, "postMeetingTimeA"))} to reach Q, while B takes ${duration(required(i.postMeetingTimeB, "postMeetingTimeB"))} to reach P. Find the ratio of A's speed to B's speed.`;

    case "findPostMeetingArrivalTimeFromSpeedRatio":
      return `Travellers A and B start simultaneously from opposite ends P and Q of a ${km(required(i.routeDistance, "routeDistance"))} route. A travels at ${kmph(required(i.speedA, "speedA"))}, and the speed ratio A:B is ${ratio(required(i.speedRatio, "speedRatio"))}. After their first meeting, how long will traveller ${i.targetPostBody ?? "A"} take to reach the opposite endpoint?`;

    case "findTotalDistanceFromPostMeetingTimes":
      return `Travellers A and B start simultaneously from endpoints P and Q respectively. A travels at ${kmph(required(i.speedA, "speedA"))}. After their first meeting, A takes ${duration(required(i.postMeetingTimeA, "postMeetingTimeA"))} to reach Q and B takes ${duration(required(i.postMeetingTimeB, "postMeetingTimeB"))} to reach P. Find the distance PQ.`;

    case "findSpeedsFromPostMeetingTimesAndDistance":
      return `Travellers A and B start simultaneously from opposite ends P and Q of a ${km(required(i.routeDistance, "routeDistance"))} route. After their first meeting, A takes ${duration(required(i.postMeetingTimeA, "postMeetingTimeA"))} to reach Q and B takes ${duration(required(i.postMeetingTimeB, "postMeetingTimeB"))} to reach P. Find their speeds, A first and B second.`;

    case "findMeetingPointFromPostMeetingTimes":
      return `Travellers A and B start simultaneously from opposite ends P and Q of a ${km(required(i.routeDistance, "routeDistance"))} route. After their first meeting, A takes ${duration(required(i.postMeetingTimeA, "postMeetingTimeA"))} to reach Q and B takes ${duration(required(i.postMeetingTimeB, "postMeetingTimeB"))} to reach P. How far from P did their first meeting occur?`;

    case "findSecondMeetingTimeAfterEndpointTurnaround":
    case "findMeetingAfterBothTurnAtEndpoints":
      return `Traveller A starts from P at ${kmph(required(i.speedA, "speedA"))} and traveller B starts simultaneously from Q at ${kmph(required(i.speedB, "speedB"))}. The distance PQ is ${km(required(i.routeDistance, "routeDistance"))}. Both reverse direction immediately whenever they reach an endpoint. How long after the start will they meet for the second time?`;

    case "findNthMeetingTimeOnLine": {
      const meeting = i.nthMeeting;
      if (!meeting) throw new Error("CP005 V9 nth meeting missing");
      return `Traveller A starts from P at ${kmph(required(i.speedA, "speedA"))} and traveller B starts simultaneously from Q at ${kmph(required(i.speedB, "speedB"))}. The distance PQ is ${km(required(i.routeDistance, "routeDistance"))}, and both reverse immediately at each endpoint. How long after the start will their ${ordinal(meeting)} meeting occur?`;
    }

    case "findTimeBetweenFirstAndSecondMeetings":
      return `Traveller A starts from P at ${kmph(required(i.speedA, "speedA"))} and traveller B starts simultaneously from Q at ${kmph(required(i.speedB, "speedB"))}. The distance PQ is ${km(required(i.routeDistance, "routeDistance"))}. Both reverse immediately at the endpoints and continue moving. Find the time interval between their first and second meetings.`;

    case "findSecondMeetingPointAfterEndpointTurnaround":
      return `Traveller A starts from P at ${kmph(required(i.speedA, "speedA"))} and traveller B starts simultaneously from Q at ${kmph(required(i.speedB, "speedB"))}. The distance PQ is ${km(required(i.routeDistance, "routeDistance"))}, and both reverse immediately at each endpoint. How far from P is their second meeting point?`;

    case "findNthMeetingPointOnLine": {
      const meeting = i.nthMeeting;
      if (!meeting) throw new Error("CP005 V9 nth meeting point missing");
      return `Traveller A starts from P at ${kmph(required(i.speedA, "speedA"))} and traveller B starts simultaneously from Q at ${kmph(required(i.speedB, "speedB"))}. The distance PQ is ${km(required(i.routeDistance, "routeDistance"))}, and both reverse immediately at each endpoint. How far from P is their ${ordinal(meeting)} meeting point?`;
    }

    case "findRepeatedMeetingCountInTimeWindow":
      return `Traveller A starts from P at ${kmph(required(i.speedA, "speedA"))} and traveller B starts simultaneously from Q at ${kmph(required(i.speedB, "speedB"))}. The distance PQ is ${km(required(i.routeDistance, "routeDistance"))}, and both reverse immediately at each endpoint. How many times do they meet during the first ${duration(required(i.timeWindow, "timeWindow"))}?`;

    case "findMeetingAfterOneTravellerTurnsBack":
    case "findShuttleMeetingTime":
    case "findPassThenCatchAfterTurnaround":
      return `Travellers A and B start together from P towards Q on a ${km(required(i.routeDistance, "routeDistance"))} route. A travels at ${kmph(required(i.speedA, "speedA"))} and B at ${kmph(required(i.speedB, "speedB"))}. A reaches Q first and immediately turns back, while B continues towards Q. How long after the start will they meet?`;

    case "findShuttleDistanceCovered":
      return `Travellers A and B start together from P towards Q on a ${km(required(i.routeDistance, "routeDistance"))} route. A travels at ${kmph(required(i.speedA, "speedA"))} and B at ${kmph(required(i.speedB, "speedB"))}. A reaches Q first and immediately turns back. Find the total distance travelled by A before A and B meet.`;

    case "findReturnJourneyMeetingPoint":
      return `Travellers A and B start together from P towards Q on a ${km(required(i.routeDistance, "routeDistance"))} route. A travels at ${kmph(required(i.speedA, "speedA"))} and B at ${kmph(required(i.speedB, "speedB"))}. A reaches Q first, turns back immediately and later meets B. How far from P is their meeting point?`;

    case "findEndpointRestTimeFromNextMeeting":
    case "findRouteReversalScheduleParameter":
      return `Traveller A starts from P at ${kmph(required(i.speedA, "speedA"))} and traveller B starts simultaneously from Q at ${kmph(required(i.speedB, "speedB"))}. The distance PQ is ${km(required(i.routeDistance, "routeDistance"))}. A rests at Q before turning back, while B reverses immediately on reaching P. Their second meeting occurs ${duration(required(i.observedSecondMeetingTime, "observedSecondMeetingTime"))} after the start. How long does A rest at Q?`;

    case "findDistanceBetweenEndpointsFromRepeatedMeetings":
      return `Traveller A starts from P at ${kmph(required(i.speedA, "speedA"))} and traveller B starts simultaneously from Q at ${kmph(required(i.speedB, "speedB"))}. Both reverse immediately at the endpoints. They meet for the first time after ${duration(required(i.observedFirstMeetingTime, "observedFirstMeetingTime"))} and for the second time after ${duration(required(i.observedSecondMeetingTime, "observedSecondMeetingTime"))}. Find the distance PQ.`;

    default:
      throw new Error(`${question.solveMode}: CP005 V9 has no learner stem renderer`);
  }
}

function normalizeSelected(question: TsdCp005EnglishReviewQuestion): TsdCp005EnglishReviewQuestion {
  return Object.freeze({ ...question, stem: renderExamStem(question) });
}

export function generateCp005ReviewSetV9(perAuthority = 6): readonly TsdCp005EnglishReviewQuestion[] {
  return Object.freeze(generateCp005ReviewSetV8(perAuthority).map(normalizeSelected));
}

/** Structural stress audit remains the exact-rational V8/V7 audit surface. */
export function generateCp005EnglishAuditPoolV9(perAuthority = 30): readonly TsdCp005EnglishReviewQuestion[] {
  return generateCp005EnglishAuditPoolV8(perAuthority);
}
