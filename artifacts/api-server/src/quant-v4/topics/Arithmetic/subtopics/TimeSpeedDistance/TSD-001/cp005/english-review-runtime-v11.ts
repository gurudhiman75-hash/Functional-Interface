import { add, divide, multiply, rational, subtract, type Rational } from "../foundation/rational";
import { formatDurationHours, formatExamNumber } from "../cp003/generation-support";
import type { TsdCp005EnglishReviewQuestion, TsdCp005ReviewExplanation, TsdCp005ReviewOptionAudit } from "./english-review-runtime";
import { generateCp005EnglishAuditPoolV10, generateCp005ReviewSetV10 } from "./english-review-runtime-v10";
import { sqrtRationalExact } from "./solver";

function required(value: Rational | undefined, name: string): Rational {
  if (!value) throw new Error(`CP005 V11 missing ${name}`);
  return value;
}

function num(value: Rational): string { return formatExamNumber(value); }
function km(value: Rational): string { return `${num(value)} km`; }
function kmph(value: Rational): string { return `${num(value)} km/h`; }
function duration(value: Rational): string { return formatDurationHours(value); }
function ratio(value: Rational): string { return `${value.numerator}:${value.denominator}`; }
function minutes(value: Rational): string { return num(multiply(value, rational(60))); }

function exactFractionHours(numerator: number, denominator: number): string {
  const totalSeconds = numerator * 3600 / denominator;
  if (!Number.isInteger(totalSeconds)) {
    const decimal = numerator / denominator;
    return `${decimal.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1")} hours`;
  }
  let seconds = totalSeconds;
  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  const mins = Math.floor(seconds / 60);
  seconds -= mins * 60;
  const parts: string[] = [];
  if (hours) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  if (mins) parts.push(`${mins} ${mins === 1 ? "minute" : "minutes"}`);
  if (seconds) parts.push(`${seconds} ${seconds === 1 ? "second" : "seconds"}`);
  return parts.join(" ") || "0 minutes";
}

function cleanFractionOptionText(text: string): string {
  let output = text.replace(/\b(\d+)\/(\d+) hours\b/g, (_match, a: string, b: string) => exactFractionHours(Number(a), Number(b)));
  output = output.replace(/\b(\d+)\/(\d+) (?=(?:km\/h|km)\b)/g, (_match, a: string, b: string) => {
    const value = Number(a) / Number(b);
    return `${value.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1")} `;
  });
  return output;
}

function replaceAuditEntry(
  question: TsdCp005EnglishReviewQuestion,
  targetIndex: number,
  replacement: TsdCp005ReviewOptionAudit,
): TsdCp005EnglishReviewQuestion {
  const audits = [...question.internalOptionAudit];
  audits[targetIndex] = replacement;
  const internalOptionAudit = Object.freeze(audits);
  const options = Object.freeze(internalOptionAudit.map((entry) => entry.text));
  if (new Set(options).size !== 4) throw new Error(`${question.solveMode}: V11 option replacement collided`);
  if (options[question.correctIndex] !== question.answerText) throw new Error(`${question.solveMode}: V11 correct option mapping changed`);
  return Object.freeze({ ...question, internalOptionAudit, options });
}

function improveMeetingPointDistractor(question: TsdCp005EnglishReviewQuestion): TsdCp005EnglishReviewQuestion {
  if (question.solveMode !== "findMeetingPointFromPostMeetingTimes") return question;
  const targetIndex = question.internalOptionAudit.findIndex((entry) => entry.misconceptionId === "USE_TIME_RATIO_DIRECTLY");
  if (targetIndex < 0) return question;
  const L = required(question.input.routeDistance, "routeDistance");
  const tA = required(question.input.postMeetingTimeA, "postMeetingTimeA");
  const tB = required(question.input.postMeetingTimeB, "postMeetingTimeB");
  const speedRatio = sqrtRationalExact(divide(tB, tA));
  const wrongPoint = divide(L, speedRatio);
  const replacement: TsdCp005ReviewOptionAudit = Object.freeze({
    text: km(wrongPoint),
    misconceptionId: "DIVIDE_ROUTE_BY_RATIO_VALUE",
    isCorrect: false,
    wrongWorking: Object.freeze({
      calculation: "L / (u/v)",
      diagnosis: "The speed ratio was treated as a single divisor of the whole route instead of dividing the route into ratio parts.",
    }),
  });
  return replaceAuditEntry(question, targetIndex, replacement);
}

function keepMeetingPointOptionsPhysical(question: TsdCp005EnglishReviewQuestion): TsdCp005EnglishReviewQuestion {
  if (question.solveMode !== "findNthMeetingPointOnLine") return question;
  const L = required(question.input.routeDistance, "routeDistance");
  const route = Number(L.numerator) / Number(L.denominator);
  const offendingIndex = question.internalOptionAudit.findIndex((entry) => {
    if (entry.isCorrect) return false;
    if (!["USE_TOTAL_PATH_AS_PHYSICAL_COORDINATE", "USE_OTHER_TRAVELLER_TOTAL_PATH"].includes(entry.misconceptionId)) return false;
    const value = Number.parseFloat(entry.text);
    return Number.isFinite(value) && value > route;
  });
  if (offendingIndex < 0) return question;

  const otherTexts = question.internalOptionAudit.filter((_entry, index) => index !== offendingIndex).map((entry) => entry.text);
  const endpointChoices = [rational(0), L];
  const endpoint = endpointChoices.find((value) => !otherTexts.includes(km(value)) && km(value) !== question.answerText);
  if (!endpoint) throw new Error(`${question.solveMode}: V11 could not find a distinct endpoint distractor`);
  const replacement: TsdCp005ReviewOptionAudit = Object.freeze({
    text: km(endpoint),
    misconceptionId: "ASSUME_ENDPOINT_MEETING_AFTER_REVERSAL",
    isCorrect: false,
    wrongWorking: Object.freeze({
      calculation: endpoint.numerator === 0n ? "assume meeting coordinate = 0" : "assume meeting coordinate = L",
      diagnosis: "The repeated meeting was assumed to occur at an endpoint instead of reflecting the actual travelled path to its physical coordinate.",
    }),
  });
  return replaceAuditEntry(question, offendingIndex, replacement);
}

function humanizeRemainingFractionOptions(question: TsdCp005EnglishReviewQuestion): TsdCp005EnglishReviewQuestion {
  let changed = false;
  const audits = question.internalOptionAudit.map((entry) => {
    if (entry.isCorrect || !/\b\d+\/\d+\b/.test(entry.text)) return entry;
    const text = cleanFractionOptionText(entry.text);
    if (text === entry.text) return entry;
    changed = true;
    return Object.freeze({ ...entry, text });
  });
  if (!changed) return question;
  const internalOptionAudit = Object.freeze(audits);
  const options = Object.freeze(internalOptionAudit.map((entry) => entry.text));
  if (new Set(options).size !== 4) throw new Error(`${question.solveMode}: V11 fraction display cleanup collided`);
  return Object.freeze({ ...question, internalOptionAudit, options });
}

function postMeetingRatioLine(tA: Rational, tB: Rational): string {
  const squared = divide(tB, tA);
  return `In minutes, tA = ${minutes(tA)} and tB = ${minutes(tB)}, so tB:tA = ${minutes(tB)}:${minutes(tA)} = ${ratio(squared)}.`;
}

function improveExplanation(question: TsdCp005EnglishReviewQuestion): TsdCp005ReviewExplanation {
  const i = question.input;
  switch (question.solveMode) {
    case "findSpeedRatioFromPostMeetingArrivalTimes": {
      const tA = required(i.postMeetingTimeA, "postMeetingTimeA");
      const tB = required(i.postMeetingTimeB, "postMeetingTimeB");
      const r = required(question.solution.value, "speed ratio");
      return Object.freeze({
        method: "The two times are measured after the first meeting. Their ratio gives the square of the opposite speed ratio.",
        steps: Object.freeze([
          `After meeting, A takes ${duration(tA)} and B takes ${duration(tB)} to reach Q and P respectively.`,
          postMeetingRatioLine(tA, tB),
          `(A's speed : B's speed)^2 = ${ratio(divide(tB, tA))}, so A:B = ${ratio(r)}.`,
        ]),
        shortcut: "Convert both post-meeting times to the same unit, form tB:tA, and take the square root of that ratio.",
        finalAnswer: `Therefore, the required speed ratio is ${question.answerText}.`,
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
      const L = add(aLeg, bLeg);
      return Object.freeze({
        method: "Use the post-meeting times to recover B's speed. The two distances covered after the meeting are exactly the two parts of the original route.",
        steps: Object.freeze([
          `${postMeetingRatioLine(tA, tB)} Hence A:B = ${ratio(r)}.`,
          `A travels at ${kmph(u)}, so B's speed = ${num(u)} × ${r.denominator}/${r.numerator} = ${kmph(v)}.`,
          `After the meeting A covers ${num(u)} × ${num(tA)} = ${km(aLeg)}, while B covers ${num(v)} × ${num(tB)} = ${km(bLeg)}.`,
          `Therefore PQ = ${num(aLeg)} + ${num(bLeg)} = ${km(L)}.`,
        ]),
        shortcut: "Find the speed ratio from the post-meeting times, recover the missing speed, then add the two post-meeting distances.",
        finalAnswer: `Therefore, the distance PQ is ${question.answerText}.`,
      });
    }
    case "findSpeedsFromPostMeetingTimesAndDistance": {
      const L = required(i.routeDistance, "routeDistance");
      const tA = required(i.postMeetingTimeA, "postMeetingTimeA");
      const tB = required(i.postMeetingTimeB, "postMeetingTimeB");
      const values = question.solution.values;
      if (!values || values.length !== 2) throw new Error("CP005 V11 missing recovered speed pair");
      const u = values[0]!;
      const v = values[1]!;
      const r = divide(u, v);
      return Object.freeze({
        method: "First obtain A:B from the two post-meeting times. Then use the known route length to recover the two speeds.",
        steps: Object.freeze([
          `${postMeetingRatioLine(tA, tB)} Therefore A:B = ${ratio(r)}.`,
          `Let B's speed be s; then A's speed is (${r.numerator}/${r.denominator})s.`,
          `The two post-meeting legs make ${km(L)}, so A-speed × ${num(tA)} + B-speed × ${num(tB)} = ${num(L)}.`,
          `Solving gives A = ${kmph(u)} and B = ${kmph(v)}.`,
        ]),
        shortcut: "Use the square-root time relation for A:B, then substitute that ratio into PQ = u×tA + v×tB.",
        finalAnswer: `Therefore, the speeds of A and B are ${question.answerText}.`,
      });
    }
    case "findMeetingPointFromPostMeetingTimes": {
      const L = required(i.routeDistance, "routeDistance");
      const tA = required(i.postMeetingTimeA, "postMeetingTimeA");
      const tB = required(i.postMeetingTimeB, "postMeetingTimeB");
      const r = sqrtRationalExact(divide(tB, tA));
      const x = required(question.solution.value, "meeting point");
      return Object.freeze({
        method: "The post-meeting times give A:B. At the first meeting, the distances already covered from P and Q are in that same speed ratio.",
        steps: Object.freeze([
          `${postMeetingRatioLine(tA, tB)} Therefore A:B = ${ratio(r)}.`,
          `So the ${km(L)} route is divided at the meeting point in the ratio ${ratio(r)} from P to Q.`,
          `Distance from P = ${num(L)} × ${r.numerator}/(${r.numerator}+${r.denominator}) = ${km(x)}.`,
        ]),
        shortcut: "Convert the post-meeting times to a speed ratio, then divide PQ in that ratio.",
        finalAnswer: `Therefore, the first meeting occurred ${question.answerText} from P.`,
      });
    }
    case "findDistanceBetweenEndpointsFromRepeatedMeetings": {
      const u = required(i.speedA, "speedA");
      const v = required(i.speedB, "speedB");
      const t1 = required(i.observedFirstMeetingTime, "observedFirstMeetingTime");
      const t2 = required(i.observedSecondMeetingTime, "observedSecondMeetingTime");
      const gap = subtract(t2, t1);
      const combined = add(u, v);
      const combinedDistance = multiply(combined, gap);
      return Object.freeze({
        method: "Between the first and second meetings, the two travellers together cover exactly two route lengths.",
        steps: Object.freeze([
          `The interval between the first and second meetings is ${duration(gap)}.`,
          `Combined speed = ${num(u)} + ${num(v)} = ${kmph(combined)}.`,
          `Combined distance during the interval = ${num(combined)} × ${num(gap)} = ${km(combinedDistance)} = 2PQ.`,
          `Therefore PQ = ${num(combinedDistance)} / 2 = ${question.answerText}.`,
        ]),
        shortcut: "Use PQ = (u+v) × (time between first and second meetings) / 2.",
        finalAnswer: `Therefore, the distance PQ is ${question.answerText}.`,
      });
    }
    default:
      return question.explanation;
  }
}

function improveStem(question: TsdCp005EnglishReviewQuestion): string {
  const i = question.input;
  if (question.solveMode === "findRouteReversalScheduleParameter") {
    return `Traveller A starts from P at ${kmph(required(i.speedA, "speedA"))} and traveller B starts simultaneously from Q at ${kmph(required(i.speedB, "speedB"))}. The distance PQ is ${km(required(i.routeDistance, "routeDistance"))}. A halts at Q before reversing, while B reverses immediately at P. Their second meeting occurs ${duration(required(i.observedSecondMeetingTime, "observedSecondMeetingTime"))} after the start. Find A's halt time at Q.`;
  }
  if (question.solveMode === "findDistanceBetweenEndpointsFromRepeatedMeetings") {
    const gap = subtract(required(i.observedSecondMeetingTime, "observedSecondMeetingTime"), required(i.observedFirstMeetingTime, "observedFirstMeetingTime"));
    return `Traveller A starts from P at ${kmph(required(i.speedA, "speedA"))} and traveller B starts simultaneously from Q at ${kmph(required(i.speedB, "speedB"))}. Both reverse immediately at the endpoints. The interval between their first and second meetings is ${duration(gap)}. Find the distance PQ.`;
  }
  return question.stem;
}

function hardenSelectedQuestion(question: TsdCp005EnglishReviewQuestion): TsdCp005EnglishReviewQuestion {
  let result = improveMeetingPointDistractor(question);
  result = keepMeetingPointOptionsPhysical(result);
  result = humanizeRemainingFractionOptions(result);
  const stem = improveStem(result);
  const explanation = improveExplanation(result);
  return Object.freeze({ ...result, stem, explanation });
}

export function generateCp005ReviewSetV11(perAuthority = 6): readonly TsdCp005EnglishReviewQuestion[] {
  return Object.freeze(generateCp005ReviewSetV10(perAuthority).map(hardenSelectedQuestion));
}

/** The 390-question exact-rational stress audit remains unchanged. */
export function generateCp005EnglishAuditPoolV11(perAuthority = 30): readonly TsdCp005EnglishReviewQuestion[] {
  return generateCp005EnglishAuditPoolV10(perAuthority);
}
