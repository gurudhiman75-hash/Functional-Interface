import { calibrateTsdDifficulty } from "../difficulty-calibration";
import { contextualizeLearnerStem } from "../learner-context";
import {
  add,
  divide,
  f,
  formatFraction,
  formatRatio,
  multiply,
  reciprocal,
  subtract,
  sum,
  type Fraction,
} from "./fraction";
import type {
  Segment,
  TsdCp002GeneratedQuestion,
  TsdCp002OptionAnalysis,
  TsdCp002OptionAudit,
} from "./types";

function q(value: Fraction): string {
  return formatFraction(value);
}

function parseNumber(text: string): Fraction | null {
  const match = text.trim().match(/^(-?\d+(?:\.\d+)?|-?\d+\/\d+)/);
  if (!match) return null;
  const raw = match[1];
  if (raw.includes("/")) {
    const [n, d] = raw.split("/").map(Number);
    return f(n, d);
  }
  if (!raw.includes(".")) return f(Number(raw));
  const negative = raw.startsWith("-");
  const unsigned = negative ? raw.slice(1) : raw;
  const [whole, decimals] = unsigned.split(".");
  const denominator = 10 ** decimals.length;
  const numerator = Number(whole) * denominator + Number(decimals);
  return f(negative ? -numerator : numerator, denominator);
}

function parseRatio(text: string): Fraction | null {
  const match = text.trim().match(/^(-?\d+)\s*:\s*(-?\d+)$/);
  if (!match) return null;
  return f(Number(match[1]), Number(match[2]));
}

function segmentTotals(segments: readonly Segment[]): {
  readonly distance: Fraction;
  readonly time: Fraction;
  readonly average: Fraction;
} {
  const distance = sum(segments.map((segment) => segment.distanceKm));
  const time = sum(segments.map((segment) => divide(segment.distanceKm, segment.speedKmph)));
  return Object.freeze({ distance, time, average: divide(distance, time) });
}

function ruleFor(mode: string): string {
  switch (mode) {
    case "averageSpeedFromSegments": return "Average speed = total distance ÷ total time.";
    case "averagePaceFromSegments": return "Average pace = total minutes ÷ total distance.";
    case "unknownSegmentSpeedFromAverage": return "Find the total time allowed, then find the time left for the second part.";
    case "unknownSegmentTimeFromAverage": return "Missing time = total time allowed − known time.";
    case "unknownSegmentDistanceFromAverage": return "The missing distance must make total distance ÷ total time equal the given average.";
    case "unknownSegmentShareFromAverage": return "Use the correct weighting for the share asked: distance share and time share use different formulas.";
    case "unknownRoundTripLegSpeedFromAverage": return "For equal outward and return distances, use both travel times; do not take a simple mean.";
    case "oneWayDistanceFromRoundTripData": return "Outward time + return time = total round-trip time.";
    case "roundTripTimeFromOneWayDistance": return "Round-trip time = outward time + return time.";
    case "totalDistanceFromAverageAndTime": return "Total distance = average speed × total time.";
    case "segmentAllocationFromTotalsAndSpeeds": return "The split must satisfy both total time and total distance.";
    case "segmentRatioFromAverageAndSpeeds": return "The required ratio must reproduce the given average speed.";
    case "requiredRemainingSpeedForTargetAverage": return "Find the time left first, then use speed = remaining distance ÷ time left.";
    case "compareSegmentedJourneyPlans": return "Find total distance ÷ total time for each plan, then compare.";
    default: return "Use total distance and total time carefully.";
  }
}

function leadFor(mode: string): string {
  switch (mode) {
    case "unknownSegmentSpeedFromAverage": return "Start with the whole journey, not the unknown speed.";
    case "unknownSegmentTimeFromAverage": return "First find how long the whole journey is allowed to take.";
    case "unknownSegmentDistanceFromAverage": return "Call the missing distance x and check the whole-trip average.";
    case "unknownSegmentShareFromAverage": return "First check whether the question asks for distance share or time share.";
    case "requiredRemainingSpeedForTargetAverage": return "Treat this as a time-budget question first.";
    default: return "Work with the whole journey before choosing the answer.";
  }
}

function shortcutFor(mode: string): string {
  switch (mode) {
    case "averageSpeedFromSegments": return "⚡ Exam Speed Trick: Make a quick distance-time table and divide the two totals once.";
    case "averagePaceFromSegments": return "⚡ Exam Speed Trick: Find total minutes first, then divide by total kilometres.";
    case "unknownSegmentSpeedFromAverage": return "⚡ Exam Speed Trick: Missing speed = missing distance ÷ time left.";
    case "unknownSegmentTimeFromAverage": return "⚡ Exam Speed Trick: Missing time = total allowed time − known time.";
    case "unknownRoundTripLegSpeedFromAverage": return "⚡ Exam Speed Trick: Equal distances mean the slower leg gets more time weight.";
    case "oneWayDistanceFromRoundTripData": return "⚡ Exam Speed Trick: Write d/u + d/v = total time.";
    case "roundTripTimeFromOneWayDistance": return "⚡ Exam Speed Trick: Add d/u and d/v.";
    case "totalDistanceFromAverageAndTime": return "⚡ Exam Speed Trick: Multiply average speed by total time.";
    case "requiredRemainingSpeedForTargetAverage": return "⚡ Exam Speed Trick: Find target finish time before finding the remaining speed.";
    case "compareSegmentedJourneyPlans": return "⚡ Exam Speed Trick: Compare complete-plan averages, not individual speeds.";
    default: return "⚡ Exam Speed Trick: Check the answer by putting it back into the average-speed formula.";
  }
}

function simpleLine(line: string): string {
  return line
    .replace(/^Therefore,?\s*/i, "")
    .replace(/^Comparison result:\s*/i, "Result: ")
    .replace(/^Collecting terms gives\s*/i, "Simplify: ")
    .replace(/reconstruct/gi, "find")
    .replace(/harmonic-average relation/gi, "equal-distance rule")
    .replace(/harmonic relation/gi, "equal-distance rule")
    .replace(/weighted-average equation/gi, "average-speed equation")
    .replace(/reciprocal speeds/gi, "1/speed values")
    .replace(/unknown-leg/gi, "second-part")
    .replace(/known-leg/gi, "known-part")
    .replace(/complete journey/gi, "whole journey")
    .replace(/overall average/gi, "average speed")
    .replace(/remaining time/gi, "time left")
    .replace(/allowed total time/gi, "total time allowed")
    .replace(/defining equation/gi, "check")
    .trim();
}

function compactSteps(question: TsdCp002GeneratedQuestion): readonly string[] {
  const core = question.explanation.stepByStepSolution
    .slice(1)
    .filter((line) => !/^Therefore, the answer is/i.test(line))
    .map(simpleLine)
    .filter(Boolean);
  const calculations = core.length <= 4
    ? core
    : [core[0], core[1], core[core.length - 2], core[core.length - 1]];
  return Object.freeze([
    leadFor(question.solveMode),
    ...calculations,
    `Answer = ${question.answerText}.`,
  ]);
}

function sourceDiagnosis(question: TsdCp002GeneratedQuestion, index: number): string {
  const entry = question.explanation.optionAnalysis[index];
  return entry.reason
    .replace(/^⚠️\s*[^:]+:\s*/, "")
    .replace(/\.$/, "")
    .replace(/reconstructing/gi, "checking")
    .replace(/reconstruct/gi, "check")
    .replace(/harmonic/gi, "equal-distance")
    .replace(/simultaneous time-and-distance system/gi, "time and distance totals")
    .replace(/does not survive/gi, "is not true after")
    .trim();
}

function optionCheck(question: TsdCp002GeneratedQuestion, optionText: string): string {
  const input = question.input;
  const candidate = parseNumber(optionText);

  switch (input.mode) {
    case "averageSpeedFromSegments": {
      const totals = segmentTotals(input.segments);
      return `Whole trip: ${q(totals.distance)} ÷ ${q(totals.time)} = ${q(totals.average)} km/h`;
    }
    case "averagePaceFromSegments": {
      const minutes = sum(input.segments.map((segment) => multiply(segment.distanceKm, segment.paceMinutesPerKm)));
      const distance = sum(input.segments.map((segment) => segment.distanceKm));
      return `Whole route: ${q(minutes)} ÷ ${q(distance)} = ${q(divide(minutes, distance))} minutes/km`;
    }
    case "unknownSegmentSpeedFromAverage": {
      if (!candidate) return `Correct speed = ${question.answerText}`;
      const knownTime = divide(input.knownDistanceKm, input.knownSpeedKmph);
      const secondTime = divide(input.unknownDistanceKm, candidate);
      const totalDistance = add(input.knownDistanceKm, input.unknownDistanceKm);
      const implied = divide(totalDistance, add(knownTime, secondTime));
      return `If speed = ${q(candidate)}, average = ${q(totalDistance)} ÷ (${q(knownTime)} + ${q(secondTime)}) = ${q(implied)} km/h`;
    }
    case "unknownSegmentTimeFromAverage": {
      if (!candidate) return `Correct time = ${question.answerText}`;
      const totalDistance = add(input.knownDistanceKm, input.unknownDistanceKm);
      const implied = divide(totalDistance, add(input.knownTimeHours, candidate));
      return `If time = ${q(candidate)}, average = ${q(totalDistance)} ÷ (${q(input.knownTimeHours)} + ${q(candidate)}) = ${q(implied)} km/h`;
    }
    case "unknownSegmentDistanceFromAverage": {
      if (!candidate) return `Correct distance = ${question.answerText}`;
      const totalDistance = add(input.knownDistanceKm, candidate);
      const totalTime = add(
        divide(input.knownDistanceKm, input.knownSpeedKmph),
        divide(candidate, input.unknownSpeedKmph),
      );
      const implied = divide(totalDistance, totalTime);
      return `If x = ${q(candidate)} km, average = ${q(totalDistance)} ÷ ${q(totalTime)} = ${q(implied)} km/h`;
    }
    case "unknownSegmentShareFromAverage": {
      if (!candidate) return `Correct share = ${question.answerText}`;
      const x = divide(candidate, f(100));
      if (input.shareKind === "TIME") {
        const implied = add(multiply(x, input.firstSpeedKmph), multiply(subtract(f(1), x), input.secondSpeedKmph));
        return `If share = ${q(candidate)}%, average = ${q(x)}×${q(input.firstSpeedKmph)} + ${q(subtract(f(1), x))}×${q(input.secondSpeedKmph)} = ${q(implied)} km/h`;
      }
      const inverseAverage = add(divide(x, input.firstSpeedKmph), divide(subtract(f(1), x), input.secondSpeedKmph));
      const implied = reciprocal(inverseAverage);
      return `If share = ${q(candidate)}%, the distance-share formula gives average = ${q(implied)} km/h`;
    }
    case "unknownRoundTripLegSpeedFromAverage": {
      if (!candidate) return `Correct speed = ${question.answerText}`;
      const implied = divide(
        multiply(multiply(f(2), input.knownLegSpeedKmph), candidate),
        add(input.knownLegSpeedKmph, candidate),
      );
      return `If speed = ${q(candidate)}, round-trip average = 2×${q(input.knownLegSpeedKmph)}×${q(candidate)} ÷ (${q(input.knownLegSpeedKmph)}+${q(candidate)}) = ${q(implied)} km/h`;
    }
    case "oneWayDistanceFromRoundTripData": {
      if (!candidate) return `Correct distance = ${question.answerText}`;
      const totalTime = add(divide(candidate, input.outwardSpeedKmph), divide(candidate, input.returnSpeedKmph));
      return `If d = ${q(candidate)}, total time = ${q(candidate)}/${q(input.outwardSpeedKmph)} + ${q(candidate)}/${q(input.returnSpeedKmph)} = ${q(totalTime)} hours`;
    }
    case "roundTripTimeFromOneWayDistance": {
      const outward = divide(input.oneWayDistanceKm, input.outwardSpeedKmph);
      const returned = divide(input.oneWayDistanceKm, input.returnSpeedKmph);
      return `Exact time = ${q(outward)} + ${q(returned)} = ${q(add(outward, returned))} hours`;
    }
    case "totalDistanceFromAverageAndTime":
      return `Distance = ${q(input.overallAverageKmph)} × ${q(input.totalTimeHours)} = ${question.answerText}`;
    case "segmentAllocationFromTotalsAndSpeeds": {
      if (!candidate) return `Correct allocation = ${question.answerText}`;
      if (input.requested === "FIRST_TIME" || input.requested === "SECOND_TIME") {
        const firstTime = input.requested === "FIRST_TIME" ? candidate : subtract(input.totalTimeHours, candidate);
        const secondTime = subtract(input.totalTimeHours, firstTime);
        const impliedDistance = add(multiply(input.firstSpeedKmph, firstTime), multiply(input.secondSpeedKmph, secondTime));
        return `With this time split, distance = ${q(input.firstSpeedKmph)}×${q(firstTime)} + ${q(input.secondSpeedKmph)}×${q(secondTime)} = ${q(impliedDistance)} km`;
      }
      const firstDistance = input.requested === "FIRST_DISTANCE" ? candidate : subtract(input.totalDistanceKm, candidate);
      const secondDistance = subtract(input.totalDistanceKm, firstDistance);
      const impliedTime = add(divide(firstDistance, input.firstSpeedKmph), divide(secondDistance, input.secondSpeedKmph));
      return `With this distance split, time = ${q(firstDistance)}/${q(input.firstSpeedKmph)} + ${q(secondDistance)}/${q(input.secondSpeedKmph)} = ${q(impliedTime)} hours`;
    }
    case "segmentRatioFromAverageAndSpeeds": {
      const ratio = parseRatio(optionText);
      if (!ratio) return `Correct ratio = ${question.answerText}`;
      if (input.ratioKind === "TIME") {
        const implied = divide(
          add(multiply(f(ratio.n), input.firstSpeedKmph), multiply(f(ratio.d), input.secondSpeedKmph)),
          f(ratio.n + ratio.d),
        );
        return `For ${formatRatio(ratio)}, average = (${ratio.n}×${q(input.firstSpeedKmph)} + ${ratio.d}×${q(input.secondSpeedKmph)}) ÷ ${ratio.n + ratio.d} = ${q(implied)} km/h`;
      }
      const distanceTotal = f(ratio.n + ratio.d);
      const timeTotal = add(divide(f(ratio.n), input.firstSpeedKmph), divide(f(ratio.d), input.secondSpeedKmph));
      const implied = divide(distanceTotal, timeTotal);
      return `For ${formatRatio(ratio)}, average = ${ratio.n + ratio.d} ÷ (${ratio.n}/${q(input.firstSpeedKmph)} + ${ratio.d}/${q(input.secondSpeedKmph)}) = ${q(implied)} km/h`;
    }
    case "requiredRemainingSpeedForTargetAverage": {
      if (!candidate) return `Correct speed = ${question.answerText}`;
      const remainingDistance = subtract(input.totalDistanceKm, input.completedDistanceKm);
      const totalTime = add(input.completedTimeHours, divide(remainingDistance, candidate));
      const implied = divide(input.totalDistanceKm, totalTime);
      return `If speed = ${q(candidate)}, average = ${q(input.totalDistanceKm)} ÷ ${q(totalTime)} = ${q(implied)} km/h`;
    }
    case "compareSegmentedJourneyPlans": {
      const a = segmentTotals(input.planA);
      const b = segmentTotals(input.planB);
      return `Plan A = ${q(a.distance)} ÷ ${q(a.time)} = ${q(a.average)} km/h; Plan B = ${q(b.distance)} ÷ ${q(b.time)} = ${q(b.average)} km/h`;
    }
    case "classifyAverageSpeedState":
    case "verifyAverageSpeedClaim":
      throw new Error(`${question.questionLanguageId}: internal CP-002 mode reached learner remediation`);
  }
}

function normalizedId(question: TsdCp002GeneratedQuestion, audit: TsdCp002OptionAudit): string {
  if (audit.isCorrect) return "CORRECT";
  if (question.solveMode === "unknownSegmentDistanceFromAverage") {
    const candidate = parseNumber(audit.text);
    const input = question.input;
    if (input.mode === "unknownSegmentDistanceFromAverage" && candidate) {
      if (candidate.n === input.knownDistanceKm.n && candidate.d === input.knownDistanceKm.d) return "ASSUME_EQUAL_DISTANCES";
      const speedDifference = subtract(input.unknownSpeedKmph, input.knownSpeedKmph);
      if (candidate.n === speedDifference.n && candidate.d === speedDifference.d) return "USE_SPEED_DIFFERENCE_AS_DISTANCE";
      const direct = multiply(input.knownDistanceKm, divide(input.unknownSpeedKmph, input.knownSpeedKmph));
      if (candidate.n === direct.n && candidate.d === direct.d) return "DIRECT_SPEED_DISTANCE_PROPORTION";
      return "WRONG_DISTANCE_BALANCE";
    }
  }
  if (question.solveMode === "segmentRatioFromAverageAndSpeeds") {
    const ratio = parseRatio(audit.text);
    const input = question.input;
    if (input.mode === "segmentRatioFromAverageAndSpeeds" && ratio) {
      const speedRatio = divide(input.firstSpeedKmph, input.secondSpeedKmph);
      if (ratio.n === speedRatio.n && ratio.d === speedRatio.d) return "COPY_SPEED_RATIO";
      if (ratio.n === speedRatio.d && ratio.d === speedRatio.n) return "REVERSE_SPEED_RATIO";
      return "WRONG_WEIGHTING";
    }
  }
  return audit.misconceptionId.replace(/^FAILS_.*_EQUATION$/, "WRONG_METHOD");
}

export function remodelCp002DistractorExplanations(
  question: TsdCp002GeneratedQuestion,
): TsdCp002GeneratedQuestion {
  const context = contextualizeLearnerStem(
    question.stem,
    question.stemMathJax,
    question.solveMode,
    question.seed,
  );
  const optionAudit = Object.freeze(question.optionAudit.map((audit): TsdCp002OptionAudit => Object.freeze({
    ...audit,
    misconceptionId: normalizedId(question, audit),
  })));
  const optionAnalysis = Object.freeze(question.explanation.optionAnalysis.map((entry, index): TsdCp002OptionAnalysis => {
    const audit = optionAudit[index];
    const check = optionCheck(question, entry.text);
    const reason = audit.isCorrect
      ? `✅ ${entry.text}: correct. ${check}.`
      : `⚠️ ${entry.text}: ${simpleLine(sourceDiagnosis(question, index))}. Check: ${check}; required average/result is ${question.answerText}.`;
    return Object.freeze({
      ...entry,
      misconceptionId: audit.misconceptionId,
      reason: reason.replace(/\s+/g, " ").trim(),
    });
  }));

  return Object.freeze({
    ...question,
    stem: context.stem,
    stemMathJax: context.stemMathJax,
    difficulty: calibrateTsdDifficulty(question.difficulty, question.solveMode, question.input),
    optionAudit,
    explanation: Object.freeze({
      ...question.explanation,
      keyRule: `📌 Main Rule: ${ruleFor(question.solveMode)}`,
      stepByStepSolution: compactSteps(question),
      examSpeedShortcut: shortcutFor(question.solveMode),
      optionAnalysis,
      conclusion: `Answer = ${question.answerText}.`,
    }),
  });
}
