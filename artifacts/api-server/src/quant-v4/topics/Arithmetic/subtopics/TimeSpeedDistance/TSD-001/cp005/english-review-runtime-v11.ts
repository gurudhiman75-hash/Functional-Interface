import { add, divide, multiply, rational, subtract, type Rational } from "../foundation/rational";
import { formatDurationHours, formatExamNumber } from "../cp003/generation-support";
import type { TsdCp005EnglishReviewQuestion, TsdCp005ReviewExplanation, TsdCp005ReviewOptionAudit } from "./english-review-runtime";
import { generateCp005ReviewQuestionV7 } from "./english-review-runtime-v7";
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

function friendlyNumber(value: Rational): string {
  if (value.denominator === 1n) return value.numerator.toString();
  const decimal = Number(value.numerator) / Number(value.denominator);
  return decimal.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

function friendlyDuration(value: Rational): string {
  const secondsNumerator = value.numerator * 3600n;
  if (secondsNumerator % value.denominator !== 0n) return `${friendlyNumber(value)} hours`;
  let seconds = Number(secondsNumerator / value.denominator);
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
  let output = text.replace(/\b(\d+)\/(\d+) hours\b/g, (_match, a: string, b: string) => friendlyDuration(rational(Number(a), Number(b))));
  output = output.replace(/\b(\d+)\/(\d+) (?=(?:km\/h|km)\b)/g, (_match, a: string, b: string) => `${friendlyNumber(rational(Number(a), Number(b)))} `);
  return output;
}

function replaceAuditEntry(question: TsdCp005EnglishReviewQuestion, targetIndex: number, replacement: TsdCp005ReviewOptionAudit): TsdCp005EnglishReviewQuestion {
  const audits = [...question.internalOptionAudit];
  audits[targetIndex] = replacement;
  const internalOptionAudit = Object.freeze(audits);
  const options = Object.freeze(internalOptionAudit.map((entry) => entry.text));
  if (new Set(options).size !== 4) throw new Error(`${question.solveMode}: V11 option replacement collided`);
  if (options[question.correctIndex] !== question.answerText) throw new Error(`${question.solveMode}: V11 correct option mapping changed`);
  return Object.freeze({ ...question, internalOptionAudit, options });
}

function improveSpeedPairDistractor(question: TsdCp005EnglishReviewQuestion): TsdCp005EnglishReviewQuestion {
  if (question.solveMode !== "findSpeedsFromPostMeetingTimesAndDistance") return question;
  const targetIndex = question.internalOptionAudit.findIndex((entry) => entry.misconceptionId === "TREAT_POST_TIMES_AS_FULL_ROUTE_TIMES");
  if (targetIndex < 0) return question;
  const L = required(question.input.routeDistance, "routeDistance");
  const tA = required(question.input.postMeetingTimeA, "postMeetingTimeA");
  const tB = required(question.input.postMeetingTimeB, "postMeetingTimeB");
  const wrongRatio = divide(tB, tA);
  const wrongB = divide(L, add(multiply(wrongRatio, tA), tB));
  const wrongA = multiply(wrongRatio, wrongB);
  const replacement: TsdCp005ReviewOptionAudit = Object.freeze({
    text: `${friendlyNumber(wrongA)} km/h and ${friendlyNumber(wrongB)} km/h`,
    misconceptionId: "SKIP_ROOT_THEN_SOLVE_SPEEDS",
    isCorrect: false,
    wrongWorking: Object.freeze({
      calculation: "take u/v = tB/tA directly, then solve PQ = u*tA + v*tB",
      diagnosis: "The post-meeting time ratio was used directly as the speed ratio instead of taking its square root first.",
    }),
  });
  return replaceAuditEntry(question, targetIndex, replacement);
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
      calculation: "PQ / (u/v)",
      diagnosis: "The speed ratio was treated as one divisor of the whole route instead of dividing PQ into ratio parts.",
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
  const endpoint = [rational(0), L].find((value) => !otherTexts.includes(km(value)) && km(value) !== question.answerText);
  if (!endpoint) throw new Error(`${question.solveMode}: V11 could not find a distinct physical endpoint distractor`);
  const replacement: TsdCp005ReviewOptionAudit = Object.freeze({
    text: km(endpoint),
    misconceptionId: "ASSUME_ENDPOINT_MEETING_AFTER_REVERSAL",
    isCorrect: false,
    wrongWorking: Object.freeze({
      calculation: endpoint.numerator === 0n ? "assume meeting coordinate = P" : "assume meeting coordinate = Q",
      diagnosis: "The repeated meeting was assumed to occur at an endpoint instead of reflecting the actual travelled path to its physical coordinate.",
    }),
  });
  return replaceAuditEntry(question, offendingIndex, replacement);
}

function improveEndpointRestDistractors(question: TsdCp005EnglishReviewQuestion): TsdCp005EnglishReviewQuestion {
  if (!["findEndpointRestTimeFromNextMeeting", "findRouteReversalScheduleParameter"].includes(question.solveMode)) return question;
  const L = required(question.input.routeDistance, "routeDistance");
  const u = required(question.input.speedA, "speedA");
  const v = required(question.input.speedB, "speedB");
  const observed = required(question.input.observedSecondMeetingTime, "observedSecondMeetingTime");
  const excess = subtract(multiply(add(u, v), observed), multiply(rational(3), L));
  const wrongValues = [
    { value: divide(excess, add(u, v)), id: "DIVIDE_MISSED_DISTANCE_BY_COMBINED_SPEED", calculation: "missed distance / (u+v)", diagnosis: "The missed distance caused by A's halt was converted to time using the combined speed instead of A's own speed." },
    { value: divide(excess, v), id: "DIVIDE_MISSED_DISTANCE_BY_B_SPEED", calculation: "missed distance / v", diagnosis: "The missed distance was divided by B's speed even though A is the traveller that halts." },
    { value: divide(excess, multiply(rational(2), u)), id: "SPLIT_A_HALT_DISTANCE_IN_TWO", calculation: "missed distance / (2u)", diagnosis: "A's lost distance was incorrectly split into two equal parts before converting it to halt time." },
  ];
  const wrongAudits: TsdCp005ReviewOptionAudit[] = wrongValues.map((entry) => Object.freeze({
    text: friendlyDuration(entry.value), misconceptionId: entry.id, isCorrect: false,
    wrongWorking: Object.freeze({ calculation: entry.calculation, diagnosis: entry.diagnosis }),
  }));
  if (new Set(wrongAudits.map((entry) => entry.text)).size !== 3 || wrongAudits.some((entry) => entry.text === question.answerText)) throw new Error(`${question.solveMode}: V11 endpoint-rest distractors are not distinct`);
  const audits: TsdCp005ReviewOptionAudit[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === question.correctIndex) audits.push(question.internalOptionAudit[index]!);
    else audits.push(wrongAudits[wrongIndex++]!);
  }
  const internalOptionAudit = Object.freeze(audits);
  const options = Object.freeze(internalOptionAudit.map((entry) => entry.text));
  return Object.freeze({ ...question, internalOptionAudit, options });
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
      const tA = required(i.postMeetingTimeA, "postMeetingTimeA"); const tB = required(i.postMeetingTimeB, "postMeetingTimeB"); const r = required(question.solution.value, "speed ratio");
      return Object.freeze({ method: "The two times are measured after the first meeting. Their ratio gives the square of the opposite speed ratio.", steps: Object.freeze([`After meeting, A takes ${duration(tA)} and B takes ${duration(tB)} to reach Q and P respectively.`, postMeetingRatioLine(tA, tB), `(A's speed : B's speed)^2 = ${ratio(divide(tB, tA))}, so A:B = ${ratio(r)}.`]), shortcut: "Convert both post-meeting times to the same unit, form tB:tA, and take the square root of that ratio.", finalAnswer: `Therefore, the required speed ratio is ${question.answerText}.` });
    }
    case "findTotalDistanceFromPostMeetingTimes": {
      const u = required(i.speedA, "speedA"); const tA = required(i.postMeetingTimeA, "postMeetingTimeA"); const tB = required(i.postMeetingTimeB, "postMeetingTimeB"); const r = sqrtRationalExact(divide(tB, tA)); const v = divide(u, r); const aLeg = multiply(u, tA); const bLeg = multiply(v, tB); const L = add(aLeg, bLeg);
      return Object.freeze({ method: "Use the post-meeting times to recover B's speed. The two distances covered after the meeting are exactly the two parts of the original route.", steps: Object.freeze([`${postMeetingRatioLine(tA, tB)} Hence A:B = ${ratio(r)}.`, `A travels at ${kmph(u)}, so B's speed = ${num(u)} × ${r.denominator}/${r.numerator} = ${kmph(v)}.`, `After the meeting A covers ${num(u)} × ${num(tA)} = ${km(aLeg)}, while B covers ${num(v)} × ${num(tB)} = ${km(bLeg)}.`, `Therefore PQ = ${num(aLeg)} + ${num(bLeg)} = ${km(L)}.`]), shortcut: "Find the speed ratio from the post-meeting times, recover the missing speed, then add the two post-meeting distances.", finalAnswer: `Therefore, the distance PQ is ${question.answerText}.` });
    }
    case "findSpeedsFromPostMeetingTimesAndDistance": {
      const L = required(i.routeDistance, "routeDistance"); const tA = required(i.postMeetingTimeA, "postMeetingTimeA"); const tB = required(i.postMeetingTimeB, "postMeetingTimeB"); const values = question.solution.values; if (!values || values.length !== 2) throw new Error("CP005 V11 missing recovered speed pair"); const u = values[0]!; const v = values[1]!; const r = divide(u, v);
      return Object.freeze({ method: "First obtain A:B from the two post-meeting times. Then use the known route length to recover the two speeds.", steps: Object.freeze([`${postMeetingRatioLine(tA, tB)} Therefore A:B = ${ratio(r)}.`, `Let B's speed be s; then A's speed is (${r.numerator}/${r.denominator})s.`, `The two post-meeting legs make ${km(L)}, so A-speed × ${num(tA)} + B-speed × ${num(tB)} = ${num(L)}.`, `Solving gives A = ${kmph(u)} and B = ${kmph(v)}.`]), shortcut: "Use the square-root time relation for A:B, then substitute that ratio into PQ = u×tA + v×tB.", finalAnswer: `Therefore, the speeds of A and B are ${question.answerText}.` });
    }
    case "findMeetingPointFromPostMeetingTimes": {
      const L = required(i.routeDistance, "routeDistance"); const tA = required(i.postMeetingTimeA, "postMeetingTimeA"); const tB = required(i.postMeetingTimeB, "postMeetingTimeB"); const r = sqrtRationalExact(divide(tB, tA)); const x = required(question.solution.value, "meeting point");
      return Object.freeze({ method: "The post-meeting times give A:B. At the first meeting, the distances already covered from P and Q are in that same speed ratio.", steps: Object.freeze([`${postMeetingRatioLine(tA, tB)} Therefore A:B = ${ratio(r)}.`, `So the ${km(L)} route is divided at the meeting point in the ratio ${ratio(r)} from P to Q.`, `Distance from P = ${num(L)} × ${r.numerator}/(${r.numerator}+${r.denominator}) = ${km(x)}.`]), shortcut: "Convert the post-meeting times to a speed ratio, then divide PQ in that ratio.", finalAnswer: `Therefore, the first meeting occurred ${question.answerText} from P.` });
    }
    case "findDistanceBetweenEndpointsFromRepeatedMeetings": {
      const u = required(i.speedA, "speedA"); const v = required(i.speedB, "speedB"); const t1 = required(i.observedFirstMeetingTime, "observedFirstMeetingTime"); const t2 = required(i.observedSecondMeetingTime, "observedSecondMeetingTime"); const gap = subtract(t2, t1); const combined = add(u, v); const combinedDistance = multiply(combined, gap);
      return Object.freeze({ method: "Between the first and second meetings, the two travellers together cover exactly two route lengths.", steps: Object.freeze([`The interval between the first and second meetings is ${duration(gap)}.`, `Combined speed = ${num(u)} + ${num(v)} = ${kmph(combined)}.`, `Combined distance during the interval = ${num(combined)} × ${num(gap)} = ${km(combinedDistance)} = 2PQ.`, `Therefore PQ = ${num(combinedDistance)} / 2 = ${question.answerText}.`]), shortcut: "Use PQ = (u+v) × (time between first and second meetings) / 2.", finalAnswer: `Therefore, the distance PQ is ${question.answerText}.` });
    }
    default: return question.explanation;
  }
}

function improveStem(question: TsdCp005EnglishReviewQuestion): string {
  const i = question.input;
  if (question.solveMode === "findSpeedRatioFromPostMeetingArrivalTimes") return `Travellers A and B start simultaneously from endpoints P and Q respectively and meet on the way. After the meeting, A takes ${duration(required(i.postMeetingTimeA, "postMeetingTimeA"))} to reach Q, while B takes ${duration(required(i.postMeetingTimeB, "postMeetingTimeB"))} to reach P. Find the ratio of A's speed to B's speed.`;
  if (question.solveMode === "findRouteReversalScheduleParameter") return `Traveller A starts from P at ${kmph(required(i.speedA, "speedA"))} and traveller B starts simultaneously from Q at ${kmph(required(i.speedB, "speedB"))}. The distance PQ is ${km(required(i.routeDistance, "routeDistance"))}. A halts at Q before reversing, while B reverses immediately at P. Their second meeting occurs ${duration(required(i.observedSecondMeetingTime, "observedSecondMeetingTime"))} after the start. Find A's halt time at Q.`;
  if (question.solveMode === "findDistanceBetweenEndpointsFromRepeatedMeetings") {
    const gap = subtract(required(i.observedSecondMeetingTime, "observedSecondMeetingTime"), required(i.observedFirstMeetingTime, "observedFirstMeetingTime"));
    return `Traveller A starts from P at ${kmph(required(i.speedA, "speedA"))} and traveller B starts simultaneously from Q at ${kmph(required(i.speedB, "speedB"))}. Both reverse immediately at the endpoints. The interval between their first and second meetings is ${duration(gap)}. Find the distance PQ.`;
  }
  return question.stem;
}

function hardenSelectedQuestion(question: TsdCp005EnglishReviewQuestion): TsdCp005EnglishReviewQuestion {
  let result = improveSpeedPairDistractor(question);
  result = improveMeetingPointDistractor(result);
  result = keepMeetingPointOptionsPhysical(result);
  result = improveEndpointRestDistractors(result);
  result = humanizeRemainingFractionOptions(result);
  return Object.freeze({ ...result, stem: improveStem(result), explanation: improveExplanation(result) });
}

const QL058_V11_STATES = Object.freeze([0, 3, 4, 5, 9, 10] as const);
function selectedBaseV11(perAuthority: number): readonly TsdCp005EnglishReviewQuestion[] {
  const base = [...generateCp005ReviewSetV10(perAuthority)];
  if (perAuthority !== 6) return Object.freeze(base);
  let ordinal = 0;
  return Object.freeze(base.map((question) => {
    if (question.permanentQlId !== "TSD-QL-058") return question;
    const state = QL058_V11_STATES[ordinal]!;
    const replacement = generateCp005ReviewQuestionV7(question.authorityKey, `cp005-review-v11:0:${ordinal}:state-${state}`, ordinal);
    ordinal += 1;
    return replacement;
  }));
}

export function generateCp005ReviewSetV11(perAuthority = 6): readonly TsdCp005EnglishReviewQuestion[] {
  return Object.freeze(selectedBaseV11(perAuthority).map(hardenSelectedQuestion));
}

/** The 390-question exact-rational stress audit remains unchanged. */
export function generateCp005EnglishAuditPoolV11(perAuthority = 30): readonly TsdCp005EnglishReviewQuestion[] {
  return generateCp005EnglishAuditPoolV10(perAuthority);
}
