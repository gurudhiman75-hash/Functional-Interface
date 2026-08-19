import { add, divide, multiply, rational, subtract, type Rational } from "../foundation/rational";
import { formatDurationHours, formatExamNumber } from "../cp003/generation-support";
import type { TsdCp005EnglishReviewQuestion, TsdCp005ReviewExplanation } from "./english-review-runtime";
import { generateCp005EnglishAuditPoolV11, generateCp005ReviewSetV11 } from "./english-review-runtime-v11";
import { sqrtRationalExact } from "./solver";

function required(value: Rational | undefined, name: string): Rational {
  if (!value) throw new Error(`CP005 V12 missing ${name}`);
  return value;
}
function n(value: Rational): string { return formatExamNumber(value); }
function km(value: Rational): string { return `${n(value)} km`; }
function kmph(value: Rational): string { return `${n(value)} km/h`; }
function time(value: Rational): string { return formatDurationHours(value); }
function ratio(value: Rational): string { return `${value.numerator}:${value.denominator}`; }
function minutes(value: Rational): string { return n(multiply(value, rational(60))); }
function ordinal(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function pick<T>(items: readonly T[], variant: number): T {
  return items[variant % items.length]!;
}

function renderVariedStem(question: TsdCp005EnglishReviewQuestion, variant: number): string {
  const i = question.input;
  switch (question.authorityKey) {
    case "speedRatioFromPostMeetingArrivalTimes": {
      const a = time(required(i.postMeetingTimeA, "postMeetingTimeA"));
      const b = time(required(i.postMeetingTimeB, "postMeetingTimeB"));
      return pick([
        `A starts from P and B from Q at the same time. They meet on the way. After meeting, A reaches Q in ${a} and B reaches P in ${b}. Find A:B speed ratio.`,
        `Two travellers leave opposite ends P and Q simultaneously. From their meeting point, A needs ${a} to reach Q, while B needs ${b} to reach P. Determine the ratio of their speeds A:B.`,
        `After starting together from opposite ends of PQ, A and B meet once. A then takes ${a} for the remaining journey to Q and B takes ${b} to P. What is A's speed : B's speed?`,
        `On route PQ, A travels from P and B from Q. They start simultaneously and cross each other. Their post-meeting times are ${a} for A and ${b} for B. Find the speed ratio A:B.`,
        `A and B move towards each other from P and Q and meet. The remaining trip takes A ${a} and B ${b}. Calculate the ratio of A's speed to B's speed.`,
        `Travellers A and B start at the same instant from P and Q. Once they meet, A reaches Q after ${a}, whereas B reaches P after ${b}. Their speed ratio A:B is?`,
      ], variant);
    }
    case "postMeetingArrivalTimeFromSpeedRelation": {
      const L = km(required(i.routeDistance, "routeDistance"));
      const u = kmph(required(i.speedA, "speedA"));
      const r = ratio(required(i.speedRatio, "speedRatio"));
      const target = i.targetPostBody ?? "A";
      return pick([
        `A and B start together from opposite ends of a ${L} route. A travels at ${u} and their speed ratio A:B is ${r}. After the first meeting, how long does ${target} take to reach the opposite end?`,
        `The distance PQ is ${L}. A leaves P at ${u}; B leaves Q at the same time, with A:B speed ratio ${r}. Find ${target}'s remaining travel time after they meet.`,
        `Two travellers move towards each other on a ${L} road. A's speed is ${u} and A:B = ${r}. They meet once. How much longer does ${target} need to reach the far endpoint?`,
        `From P and Q, A and B start simultaneously on a route of ${L}. Given A = ${u} and speed ratio A:B = ${r}, calculate ${target}'s time from the meeting point to the opposite end.`,
        `A covers PQ from P at ${u}; B starts from Q at the same instant. PQ = ${L} and A:B = ${r}. After crossing, find the time taken by ${target} to finish the route.`,
        `On a ${L} route, A and B start from opposite ends. A moves at ${u} and the speed ratio is ${r}. What is ${target}'s post-meeting time to the other endpoint?`,
      ], variant);
    }
    case "routeDistanceFromPostMeetingEvidence": {
      const u = kmph(required(i.speedA, "speedA"));
      const a = time(required(i.postMeetingTimeA, "postMeetingTimeA"));
      const b = time(required(i.postMeetingTimeB, "postMeetingTimeB"));
      return pick([
        `A and B start simultaneously from opposite ends P and Q. A travels at ${u}. After meeting, A reaches Q in ${a} and B reaches P in ${b}. Find PQ.`,
        `Two travellers move towards each other between P and Q. A's speed is ${u}. Their remaining times after the meeting are ${a} for A and ${b} for B. Determine the route length.`,
        `A leaves P at ${u} while B leaves Q at the same time. They meet once; afterwards A takes ${a} to Q and B takes ${b} to P. How far apart are P and Q?`,
        `On route PQ, A moves at ${u} from P and B starts from Q simultaneously. From the meeting point, A needs ${a} and B needs ${b} to finish. Calculate PQ.`,
        `A and B start from opposite ends and meet. A's speed is ${u}; after crossing, A travels for ${a} more and B for ${b} more. Find the distance between the endpoints.`,
        `The travellers A and B begin together from P and Q. A moves at ${u}. Their post-meeting arrival times are ${a} and ${b} respectively. What is the length of PQ?`,
      ], variant);
    }
    case "individualSpeedsFromPostMeetingEvidence": {
      const L = km(required(i.routeDistance, "routeDistance"));
      const a = time(required(i.postMeetingTimeA, "postMeetingTimeA"));
      const b = time(required(i.postMeetingTimeB, "postMeetingTimeB"));
      return pick([
        `A and B start from opposite ends of a ${L} route and meet. After meeting, A reaches Q in ${a} and B reaches P in ${b}. Find their speeds, A first.`,
        `The distance PQ is ${L}. A leaves P and B leaves Q simultaneously. From their meeting point, A needs ${a} to reach Q and B needs ${b} to reach P. Determine both speeds.`,
        `Two travellers start together from P and Q, ${L} apart. Their post-meeting times are ${a} for A and ${b} for B. Calculate A's speed and B's speed.`,
        `On a ${L} route, A and B move towards each other and meet once. A completes the remaining part in ${a}; B completes his remaining part in ${b}. Find their speeds.`,
        `P and Q are ${L} apart. A and B start simultaneously from the two ends. After crossing, A takes ${a} and B takes ${b} to reach the opposite ends. What are their speeds?`,
        `A travels P→Q and B travels Q→P on a ${L} road, starting at the same time. Their times after the meeting are ${a} and ${b}. Find the speeds of A and B.`,
      ], variant);
    }
    case "firstMeetingPointFromPostMeetingEvidence": {
      const L = km(required(i.routeDistance, "routeDistance"));
      const a = time(required(i.postMeetingTimeA, "postMeetingTimeA"));
      const b = time(required(i.postMeetingTimeB, "postMeetingTimeB"));
      return pick([
        `A and B start simultaneously from P and Q on a ${L} route. After meeting, A takes ${a} to reach Q and B takes ${b} to reach P. How far from P did they meet?`,
        `The endpoints P and Q are ${L} apart. A and B leave them at the same time. Their post-meeting times are ${a} and ${b}. Find the first meeting point measured from P.`,
        `Two travellers move towards each other over ${L}. Once they cross, A reaches Q in ${a} and B reaches P in ${b}. At what distance from P did the crossing occur?`,
        `On route PQ of length ${L}, A starts at P and B at Q. After their meeting, A has ${a} of travel left and B has ${b}. Locate the meeting point from P.`,
        `A and B begin together from opposite ends of a ${L} road. A needs ${a} after the meeting to reach Q; B needs ${b} to reach P. Find PM, where M is their meeting point.`,
        `P and Q are ${L} apart. A and B start simultaneously and meet at M. From M, A takes ${a} to Q and B takes ${b} to P. Find PM.`,
      ], variant);
    }
    case "repeatedLinearMeetingTime": {
      const L = km(required(i.routeDistance, "routeDistance"));
      const u = kmph(required(i.speedA, "speedA"));
      const v = kmph(required(i.speedB, "speedB"));
      const base = pick([
        `A starts from P at ${u} and B from Q at ${v} on a ${L} route.`,
        `On a ${L} route, A leaves P at ${u} while B leaves Q at ${v}.`,
        `P and Q are ${L} apart. A and B start simultaneously from the two ends at ${u} and ${v}.`,
        `Two travellers start together from opposite ends of PQ (${L}) at ${u} and ${v}.`,
        `A moves P→Q at ${u}; B moves Q→P at ${v}. The route length is ${L}.`,
        `From endpoints P and Q, A and B begin at the same time with speeds ${u} and ${v}; PQ = ${L}.`,
      ], variant);
      if (question.solveMode === "findNthMeetingTimeOnLine") return `${base} Both reverse immediately at each endpoint. When will their ${ordinal(i.nthMeeting!)} meeting occur?`;
      if (question.solveMode === "findTimeBetweenFirstAndSecondMeetings") return `${base} Both reverse immediately at the endpoints. Find the time from their first meeting to their second meeting.`;
      if (question.solveMode === "findMeetingAfterBothTurnAtEndpoints") return `${base} They keep moving and reverse instantly at the endpoints. At what time from the start do they meet for the second time?`;
      return `${base} Each reverses immediately at an endpoint. Find the time of their second meeting.`;
    }
    case "repeatedLinearMeetingPoint": {
      const L = km(required(i.routeDistance, "routeDistance"));
      const u = kmph(required(i.speedA, "speedA"));
      const v = kmph(required(i.speedB, "speedB"));
      const base = pick([
        `A starts from P at ${u} and B from Q at ${v}; PQ = ${L}.`,
        `On route PQ (${L}), A leaves P at ${u} and B leaves Q at ${v}.`,
        `P and Q are ${L} apart. A and B start simultaneously at ${u} and ${v} from opposite ends.`,
        `Two travellers begin from P and Q on a ${L} route with speeds ${u} and ${v}.`,
        `A moves from P at ${u}, B from Q at ${v}, and the endpoint distance is ${L}.`,
        `From opposite ends of PQ, A and B start together at ${u} and ${v}; PQ measures ${L}.`,
      ], variant);
      const ask = question.solveMode === "findNthMeetingPointOnLine"
        ? `How far from P is their ${ordinal(i.nthMeeting!)} meeting point?`
        : `How far from P is their second meeting point?`;
      return `${base} Both reverse immediately at every endpoint. ${ask}`;
    }
    case "repeatedLinearMeetingCount": {
      const L = km(required(i.routeDistance, "routeDistance"));
      const u = kmph(required(i.speedA, "speedA"));
      const v = kmph(required(i.speedB, "speedB"));
      const w = time(required(i.timeWindow, "timeWindow"));
      return pick([
        `A leaves P at ${u} and B leaves Q at ${v} on a ${L} route. Both reverse immediately at the endpoints. How many meetings occur in the first ${w}?`,
        `On route PQ of ${L}, A and B start from opposite ends at ${u} and ${v}. They keep reversing at P and Q. Count their meetings during ${w}.`,
        `P and Q are ${L} apart. A starts at P with speed ${u}; B starts at Q with ${v}. With instant endpoint reversals, how many times do they meet within ${w}?`,
        `Two travellers begin simultaneously from P and Q, ${L} apart, at ${u} and ${v}. They continue back and forth. Find the number of meetings in ${w}.`,
        `A moves between P and Q at ${u} and B at ${v}, starting from opposite ends of the ${L} route. If each turns immediately at an endpoint, how many meetings occur by ${w}?`,
        `From opposite ends of a ${L} route, A and B start together at ${u} and ${v}. They reverse without stopping at P and Q. Determine the meeting count for the first ${w}.`,
      ], variant);
    }
    case "singleTurnaroundMeetingTime": {
      const L = km(required(i.routeDistance, "routeDistance"));
      const u = kmph(required(i.speedA, "speedA"));
      const v = kmph(required(i.speedB, "speedB"));
      const base = pick([
        `A and B leave P together for Q on a ${L} route. A travels at ${u} and B at ${v}.`,
        `From P, A starts towards Q at ${u} while B starts with him at ${v}; PQ = ${L}.`,
        `Two travellers begin together at P on a ${L} P–Q route, moving at ${u} and ${v}.`,
        `On route PQ of length ${L}, A and B set out from P at ${u} and ${v}.`,
        `A and B start simultaneously from P towards Q. Their speeds are ${u} and ${v}, and PQ is ${L}.`,
        `P to Q is ${L}. A and B leave P at the same time with speeds ${u} and ${v}.`,
      ], variant);
      if (question.solveMode === "findShuttleMeetingTime") return `${base} A reaches Q first and turns back immediately. Find the elapsed time until returning A meets B.`;
      if (question.solveMode === "findPassThenCatchAfterTurnaround") return `${base} A reaches Q before B, reverses at once and meets B on the way back. Find the total elapsed time.`;
      return `${base} A reaches Q first, turns immediately and comes back towards B. When do they meet?`;
    }
    case "shuttleDistanceBeforeReturnMeeting": {
      const L = km(required(i.routeDistance, "routeDistance"));
      const u = kmph(required(i.speedA, "speedA"));
      const v = kmph(required(i.speedB, "speedB"));
      return pick([
        `A and B leave P together for Q on a ${L} route at ${u} and ${v}. A turns back immediately at Q. Find A's total distance travelled before meeting B.`,
        `From P, A starts at ${u} and B at ${v} towards Q, ${L} away. A reaches Q first and returns at once. How far has A travelled when they meet?`,
        `Two travellers start together from P on a ${L} route. A moves at ${u}, B at ${v}. After touching Q, A immediately comes back. Find A's distance covered up to the meeting.`,
        `On route PQ (${L}), A and B set out from P at ${u} and ${v}. A reverses as soon as he reaches Q. Determine A's total path before he meets B.`,
        `A leaves P for Q at ${u}; B starts with him at ${v}. PQ = ${L}. A reaches Q and turns back without stopping. What distance does A cover before the return meeting?`,
        `P and Q are ${L} apart. A and B leave P simultaneously at ${u} and ${v}. A is the faster traveller and returns immediately from Q. Find A's travelled distance when they meet.`,
      ], variant);
    }
    case "returnJourneyMeetingPoint": {
      const L = km(required(i.routeDistance, "routeDistance"));
      const u = kmph(required(i.speedA, "speedA"));
      const v = kmph(required(i.speedB, "speedB"));
      return pick([
        `A and B start together from P towards Q on a ${L} route at ${u} and ${v}. A reaches Q first and turns back. How far from P do they meet?`,
        `From P, A moves at ${u} and B at ${v} towards Q, ${L} away. A reverses immediately at Q. Locate their return meeting from P.`,
        `Two travellers leave P together on route PQ (${L}) with speeds ${u} and ${v}. The faster A turns back at Q. Find the point, measured from P, where A meets B.`,
        `A and B set out from P at ${u} and ${v}; PQ = ${L}. A reaches Q before B and immediately returns. At what distance from P do they meet?`,
        `On a ${L} P–Q route, A and B start together at ${u} and ${v}. A reverses at Q without stopping. Determine the return-meeting position from P.`,
        `P to Q is ${L}. A travels at ${u}, B at ${v}, both starting from P. A turns back as soon as he reaches Q. Find how far from P the meeting occurs.`,
      ], variant);
    }
    case "endpointRestFromNextMeeting": {
      const L = km(required(i.routeDistance, "routeDistance"));
      const u = kmph(required(i.speedA, "speedA"));
      const v = kmph(required(i.speedB, "speedB"));
      const t2 = time(required(i.observedSecondMeetingTime, "observedSecondMeetingTime"));
      return pick([
        `A starts from P at ${u} and B from Q at ${v}; PQ = ${L}. A rests at Q before returning, while B turns immediately at P. Their second meeting is at ${t2}. Find A's rest time.`,
        `On a ${L} route, A leaves P at ${u} and B leaves Q at ${v}. At Q, A waits before reversing; B reverses at P without waiting. They meet a second time after ${t2}. How long did A wait?`,
        `P and Q are ${L} apart. A and B start together from opposite ends at ${u} and ${v}. A halts on reaching Q, but B turns back immediately at P. If the second meeting occurs at ${t2}, find A's halt.`,
        `Two travellers start from P and Q at ${u} and ${v} on a ${L} route. A pauses at Q before returning; B does not pause at P. Their second meeting time is ${t2}. Determine A's stop time.`,
        `A moves P→Q at ${u} and B moves Q→P at ${v}; PQ is ${L}. A waits at Q before reversing, whereas B reverses instantly at P. The second meeting is ${t2} from the start. Find the wait.`,
        `From opposite ends of a ${L} route, A and B start simultaneously at ${u} and ${v}. A takes a halt at Q; B turns around immediately at P. They meet again for the second time at ${t2}. Calculate A's halt time.`,
      ], variant);
    }
    case "routeDistanceFromRepeatedMeetingGap": {
      const u = kmph(required(i.speedA, "speedA"));
      const v = kmph(required(i.speedB, "speedB"));
      const gap = time(subtract(required(i.observedSecondMeetingTime, "observedSecondMeetingTime"), required(i.observedFirstMeetingTime, "observedFirstMeetingTime")));
      return pick([
        `A and B start simultaneously from opposite ends P and Q at ${u} and ${v}, reversing immediately at each endpoint. The gap between their first and second meetings is ${gap}. Find PQ.`,
        `Two travellers begin from P and Q at ${u} and ${v} and keep reversing at the endpoints. Their first-to-second meeting interval is ${gap}. Determine the route length.`,
        `A moves from P at ${u}; B moves from Q at ${v}. Both turn instantly at P and Q. If ${gap} elapses between the first two meetings, how far apart are P and Q?`,
        `On route PQ, A and B start from opposite ends at ${u} and ${v} and continue back and forth. The time from meeting 1 to meeting 2 is ${gap}. Calculate PQ.`,
        `From P and Q, A and B start together at ${u} and ${v}. With no stop at the endpoints, the first and second meetings are ${gap} apart. Find the distance PQ.`,
        `A and B travel repeatedly between P and Q at ${u} and ${v}, starting from opposite ends. The interval separating their first two meetings is ${gap}. What is the length of PQ?`,
      ], variant);
    }
    default:
      return question.stem;
  }
}

function compactExplanation(question: TsdCp005EnglishReviewQuestion): TsdCp005ReviewExplanation {
  const i = question.input;
  const answer = question.answerText;
  switch (question.solveMode) {
    case "findSpeedRatioFromPostMeetingArrivalTimes": {
      const tA = required(i.postMeetingTimeA, "postMeetingTimeA");
      const tB = required(i.postMeetingTimeB, "postMeetingTimeB");
      const r = required(question.solution.value, "speed ratio");
      return Object.freeze({
        method: "Post-meeting times give the square of the speed ratio.",
        steps: Object.freeze([
          `Use minutes: tA = ${minutes(tA)}, tB = ${minutes(tB)}; so tB:tA = ${ratio(divide(tB, tA))}.`,
          `Taking the square root gives A:B = ${ratio(r)}.`,
        ]),
        shortcut: "Same units first; then square-root tB:tA.",
        finalAnswer: `Answer: ${answer}.`,
      });
    }
    case "findPostMeetingArrivalTimeFromSpeedRatio": {
      const L = required(i.routeDistance, "routeDistance");
      const u = required(i.speedA, "speedA");
      const r = required(i.speedRatio, "speedRatio");
      const v = divide(u, r);
      const x = divide(multiply(L, u), add(u, v));
      const target = i.targetPostBody ?? "A";
      const remaining = target === "A" ? subtract(L, x) : x;
      const speed = target === "A" ? u : v;
      return Object.freeze({
        method: "Find the meeting point, then use only the distance left afterwards.",
        steps: Object.freeze([
          `B's speed = ${n(u)} × ${r.denominator}/${r.numerator} = ${kmph(v)}; meeting point from P = ${km(x)}.`,
          `${target} has ${km(remaining)} left, so time = ${n(remaining)}/${n(speed)} = ${answer}.`,
        ]),
        shortcut: "Do not use the full-route time after the meeting.",
        finalAnswer: `Answer: ${answer}.`,
      });
    }
    case "findTotalDistanceFromPostMeetingTimes": {
      const u = required(i.speedA, "speedA");
      const tA = required(i.postMeetingTimeA, "postMeetingTimeA");
      const tB = required(i.postMeetingTimeB, "postMeetingTimeB");
      const r = sqrtRationalExact(divide(tB, tA));
      const v = divide(u, r);
      const aLeg = multiply(u, tA);
      const bLeg = multiply(v, tB);
      return Object.freeze({
        method: "Recover B's speed, then add the two post-meeting legs.",
        steps: Object.freeze([
          `tB:tA gives A:B = ${ratio(r)}, so B's speed = ${kmph(v)}.`,
          `PQ = ${n(u)}×${n(tA)} + ${n(v)}×${n(tB)} = ${n(aLeg)} + ${n(bLeg)} = ${answer}.`,
        ]),
        shortcut: "The two remaining legs together make the whole route.",
        finalAnswer: `Answer: ${answer}.`,
      });
    }
    case "findSpeedsFromPostMeetingTimesAndDistance": {
      const L = required(i.routeDistance, "routeDistance");
      const tA = required(i.postMeetingTimeA, "postMeetingTimeA");
      const tB = required(i.postMeetingTimeB, "postMeetingTimeB");
      const values = question.solution.values;
      if (!values || values.length !== 2) throw new Error("CP005 V12 missing speed pair");
      const u = values[0]!, v = values[1]!, r = divide(u, v);
      return Object.freeze({
        method: "First get the speed ratio; then use the known route length.",
        steps: Object.freeze([
          `From the post-meeting times, A:B = ${ratio(r)}.`,
          `Using PQ = u×tA + v×tB = ${n(L)}, we get A = ${kmph(u)} and B = ${kmph(v)}.`,
        ]),
        shortcut: "Ratio first, route equation second.",
        finalAnswer: `Answer: ${answer}.`,
      });
    }
    case "findMeetingPointFromPostMeetingTimes": {
      const L = required(i.routeDistance, "routeDistance");
      const tA = required(i.postMeetingTimeA, "postMeetingTimeA");
      const tB = required(i.postMeetingTimeB, "postMeetingTimeB");
      const r = sqrtRationalExact(divide(tB, tA));
      const x = required(question.solution.value, "meeting point");
      return Object.freeze({
        method: "The first meeting divides PQ in the speed ratio.",
        steps: Object.freeze([
          `Post-meeting times give A:B = ${ratio(r)}.`,
          `So PM = ${n(L)} × ${r.numerator}/(${r.numerator}+${r.denominator}) = ${km(x)}.`,
        ]),
        shortcut: "Find A:B, then divide PQ in that ratio.",
        finalAnswer: `Answer: ${answer} from P.`,
      });
    }
    case "findSecondMeetingTimeAfterEndpointTurnaround":
    case "findMeetingAfterBothTurnAtEndpoints": {
      const L = required(i.routeDistance, "routeDistance");
      const u = required(i.speedA, "speedA"), v = required(i.speedB, "speedB");
      return Object.freeze({
        method: "By the second meeting, combined travel equals 3PQ.",
        steps: Object.freeze([
          `Combined speed = ${n(u)} + ${n(v)} = ${kmph(add(u, v))}.`,
          `Time = 3×${n(L)}/${n(add(u, v))} = ${answer}.`,
        ]),
        shortcut: "Second meeting time = 3L/(u+v).",
        finalAnswer: `Answer: ${answer}.`,
      });
    }
    case "findNthMeetingTimeOnLine": {
      const L = required(i.routeDistance, "routeDistance");
      const u = required(i.speedA, "speedA"), v = required(i.speedB, "speedB");
      const meeting = i.nthMeeting!;
      const odd = 2 * meeting - 1;
      return Object.freeze({
        method: "Repeated meetings occur at odd multiples of PQ in combined travel.",
        steps: Object.freeze([
          `For the ${ordinal(meeting)} meeting, combined distance = ${odd}×${n(L)} = ${km(multiply(rational(odd), L))}.`,
          `Time = ${n(multiply(rational(odd), L))}/${n(add(u, v))} = ${answer}.`,
        ]),
        shortcut: "nth meeting: (2n−1)L/(u+v).",
        finalAnswer: `Answer: ${answer}.`,
      });
    }
    case "findTimeBetweenFirstAndSecondMeetings": {
      const L = required(i.routeDistance, "routeDistance");
      const u = required(i.speedA, "speedA"), v = required(i.speedB, "speedB");
      return Object.freeze({
        method: "From meeting 1 to meeting 2, combined travel increases by 2PQ.",
        steps: Object.freeze([
          `Combined speed = ${kmph(add(u, v))}.`,
          `Gap = 2×${n(L)}/${n(add(u, v))} = ${answer}.`,
        ]),
        shortcut: "First-to-second gap = 2L/(u+v).",
        finalAnswer: `Answer: ${answer}.`,
      });
    }
    case "findSecondMeetingPointAfterEndpointTurnaround":
    case "findNthMeetingPointOnLine": {
      const L = required(i.routeDistance, "routeDistance");
      const u = required(i.speedA, "speedA"), v = required(i.speedB, "speedB");
      const meeting = question.solveMode === "findSecondMeetingPointAfterEndpointTurnaround" ? 2 : i.nthMeeting!;
      const odd = 2 * meeting - 1;
      const t = divide(multiply(rational(odd), L), add(u, v));
      const travelled = multiply(u, t);
      return Object.freeze({
        method: "Find the meeting time, then reflect A's travelled path back onto PQ.",
        steps: Object.freeze([
          `${ordinal(meeting)} meeting time = ${odd}×${n(L)}/${n(add(u, v))} = ${time(t)}.`,
          `A travels ${n(u)}×${n(t)} = ${km(travelled)}; after reflection the point is ${answer} from P.`,
        ]),
        shortcut: "Travelled distance and physical position are different after a turn.",
        finalAnswer: `Answer: ${answer} from P.`,
      });
    }
    case "findRepeatedMeetingCountInTimeWindow": {
      const L = required(i.routeDistance, "routeDistance");
      const u = required(i.speedA, "speedA"), v = required(i.speedB, "speedB");
      const window = required(i.timeWindow, "timeWindow");
      const countValue = required(question.solution.value, "count");
      const count = Number(countValue.numerator / countValue.denominator);
      const last = divide(multiply(rational(2 * count - 1), L), add(u, v));
      const next = divide(multiply(rational(2 * count + 1), L), add(u, v));
      return Object.freeze({
        method: "Check the odd-multiple meeting times against the time limit.",
        steps: Object.freeze([
          `${ordinal(count)} meeting is at ${time(last)}, within ${time(window)}.`,
          `${ordinal(count + 1)} meeting is at ${time(next)}, beyond the limit.`,
        ]),
        shortcut: "Count odd-multiple meeting times not exceeding the window.",
        finalAnswer: `Answer: ${answer} meetings.`,
      });
    }
    case "findMeetingAfterOneTravellerTurnsBack":
    case "findShuttleMeetingTime":
    case "findPassThenCatchAfterTurnaround": {
      const L = required(i.routeDistance, "routeDistance");
      const u = required(i.speedA, "speedA"), v = required(i.speedB, "speedB");
      return Object.freeze({
        method: "At the return meeting, A's path plus B's path equals 2PQ.",
        steps: Object.freeze([
          `Combined speed = ${kmph(add(u, v))}; combined path = ${km(multiply(rational(2), L))}.`,
          `Time = 2×${n(L)}/${n(add(u, v))} = ${answer}.`,
        ]),
        shortcut: "One-turn same-start meeting: 2L/(u+v).",
        finalAnswer: `Answer: ${answer}.`,
      });
    }
    case "findShuttleDistanceCovered": {
      const L = required(i.routeDistance, "routeDistance");
      const u = required(i.speedA, "speedA"), v = required(i.speedB, "speedB");
      const t = divide(multiply(rational(2), L), add(u, v));
      return Object.freeze({
        method: "Find the return-meeting time, then multiply by A's speed.",
        steps: Object.freeze([
          `Meeting time = 2×${n(L)}/${n(add(u, v))} = ${time(t)}.`,
          `A's distance = ${n(u)}×${n(t)} = ${answer}.`,
        ]),
        shortcut: "Distance travelled by A = u × return-meeting time.",
        finalAnswer: `Answer: ${answer}.`,
      });
    }
    case "findReturnJourneyMeetingPoint": {
      const L = required(i.routeDistance, "routeDistance");
      const u = required(i.speedA, "speedA"), v = required(i.speedB, "speedB");
      const t = divide(multiply(rational(2), L), add(u, v));
      return Object.freeze({
        method: "At the meeting, B has only moved outward from P.",
        steps: Object.freeze([
          `Return-meeting time = 2×${n(L)}/${n(add(u, v))} = ${time(t)}.`,
          `Meeting point from P = ${n(v)}×${n(t)} = ${answer}.`,
        ]),
        shortcut: "Use B's outward distance after finding the meeting time.",
        finalAnswer: `Answer: ${answer} from P.`,
      });
    }
    case "findEndpointRestTimeFromNextMeeting":
    case "findRouteReversalScheduleParameter": {
      const L = required(i.routeDistance, "routeDistance");
      const u = required(i.speedA, "speedA"), v = required(i.speedB, "speedB");
      const observed = required(i.observedSecondMeetingTime, "observedSecondMeetingTime");
      const excess = subtract(multiply(add(u, v), observed), multiply(rational(3), L));
      return Object.freeze({
        method: "A's halt removes distance from the normal 3PQ second-meeting path.",
        steps: Object.freeze([
          `Missed distance = (${n(u)}+${n(v)})×${n(observed)} − 3×${n(L)} = ${km(excess)}.`,
          `Rest time = ${n(excess)}/${n(u)} = ${answer}.`,
        ]),
        shortcut: "Rest = [(u+v)t − 3L]/u.",
        finalAnswer: `Answer: ${answer}.`,
      });
    }
    case "findDistanceBetweenEndpointsFromRepeatedMeetings": {
      const u = required(i.speedA, "speedA"), v = required(i.speedB, "speedB");
      const gap = subtract(required(i.observedSecondMeetingTime, "observedSecondMeetingTime"), required(i.observedFirstMeetingTime, "observedFirstMeetingTime"));
      return Object.freeze({
        method: "Between the first two meetings, combined travel equals 2PQ.",
        steps: Object.freeze([
          `Combined speed = ${kmph(add(u, v))}; time gap = ${time(gap)}.`,
          `PQ = ${n(add(u, v))}×${n(gap)}/2 = ${answer}.`,
        ]),
        shortcut: "PQ = (u+v) × meeting gap / 2.",
        finalAnswer: `Answer: ${answer}.`,
      });
    }
    default:
      return question.explanation;
  }
}

export function generateCp005ReviewSetV12(perAuthority = 6): readonly TsdCp005EnglishReviewQuestion[] {
  const counters = new Map<string, number>();
  return Object.freeze(generateCp005ReviewSetV11(perAuthority).map((question) => {
    const variant = counters.get(question.permanentQlId) ?? 0;
    counters.set(question.permanentQlId, variant + 1);
    return Object.freeze({
      ...question,
      stem: renderVariedStem(question, variant),
      explanation: compactExplanation(question),
    });
  }));
}

/** V12 changes only the curated learner surface; the exact-rational audit remains V11. */
export function generateCp005EnglishAuditPoolV12(perAuthority = 30): readonly TsdCp005EnglishReviewQuestion[] {
  return generateCp005EnglishAuditPoolV11(perAuthority);
}
