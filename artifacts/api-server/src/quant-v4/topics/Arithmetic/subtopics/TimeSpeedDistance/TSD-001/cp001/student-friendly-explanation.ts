import { contextualizeLearnerStem } from "../learner-context";
import type { TsdCp001GeneratedQuestion, TsdCp001OptionAnalysis } from "./runtime-types";

function ruleFor(mode: string): string {
  switch (mode) {
    case "distanceFromSpeedAndTime": return "Distance = speed × time.";
    case "speedFromDistanceAndTime": return "Speed = distance ÷ time.";
    case "timeFromDistanceAndSpeed": return "Time = distance ÷ speed.";
    case "convertSpeedUnit": return "Use the exact conversion factor between the two speed units.";
    case "convertDistanceUnit": return "Convert the distance once, in the direction asked.";
    case "convertTimeUnit": return "Convert the time once, in the direction asked.";
    case "speedFromMixedUnits": return "Make the distance and time units match the required speed unit, then divide.";
    case "arrivalClockTime": return "Arrival time = departure time + journey time.";
    case "departureClockTime": return "Departure time = arrival time − journey time.";
    case "elapsedClockTime": return "Journey time is the time gap from departure to arrival.";
    case "compareDistancesAtEqualTime": return "For the same time, distance ratio = speed ratio.";
    case "compareTimesAtEqualDistance": return "For the same distance, time ratio is the reverse of speed ratio.";
    case "compareSpeedsAtEqualTime": return "For the same time, speed ratio = distance ratio.";
    case "distanceRatioFromSpeedAndTimeRatios": return "Distance ratio = speed ratio × time ratio.";
    case "speedRatioFromDistanceAndTimeRatios": return "Speed ratio = distance ratio ÷ time ratio.";
    case "timeRatioFromDistanceAndSpeedRatios": return "Time ratio = distance ratio ÷ speed ratio.";
    case "distanceByProportion": return "First find the old speed. Then use distance = speed × new time.";
    case "timeByProportion": return "First find the old speed. Then use time = new distance ÷ new speed.";
    case "speedByProportion": return "Find the journey distance first. Then divide it by the new time.";
    case "speedFromPace": return "Pace tells the time for 1 km. Convert that to distance covered in one hour or one second.";
    case "paceFromSpeed": return "Pace = time needed for 1 km at the given speed.";
    case "distanceFromPaceAndTime": return "Number of kilometres = total time ÷ time per kilometre.";
    case "requiredUniformSpeedForDeadline": return "Find the available travel time first. Then use speed = distance ÷ time.";
    default: return "Use distance = speed × time and keep the units consistent.";
  }
}

function leadFor(mode: string): string {
  switch (mode) {
    case "convertSpeedUnit":
    case "convertDistanceUnit":
    case "convertTimeUnit": return "Check which unit is given and which unit is required.";
    case "arrivalClockTime":
    case "departureClockTime":
    case "elapsedClockTime": return "Work on the clock in hours and minutes.";
    case "compareDistancesAtEqualTime":
    case "compareTimesAtEqualDistance":
    case "compareSpeedsAtEqualTime": return "Use the quantity that is the same for both travellers.";
    case "distanceRatioFromSpeedAndTimeRatios":
    case "speedRatioFromDistanceAndTimeRatios":
    case "timeRatioFromDistanceAndSpeedRatios": return "Keep the order A:B the same from start to finish.";
    case "requiredUniformSpeedForDeadline": return "First find how much time is actually available.";
    default: return "Write the needed formula and put the numbers into it.";
  }
}

function shortcutFor(mode: string): string {
  switch (mode) {
    case "distanceFromSpeedAndTime": return "⚡ Exam Speed Trick: Match the units, then multiply speed by time.";
    case "speedFromDistanceAndTime": return "⚡ Exam Speed Trick: Match the units, then divide distance by time.";
    case "timeFromDistanceAndSpeed": return "⚡ Exam Speed Trick: Match the units, then divide distance by speed.";
    case "arrivalClockTime": return "⚡ Exam Speed Trick: Add whole hours first, then add the remaining minutes.";
    case "departureClockTime": return "⚡ Exam Speed Trick: Move backward by the journey time.";
    case "elapsedClockTime": return "⚡ Exam Speed Trick: Count the full hours first, then the extra minutes.";
    case "compareTimesAtEqualDistance": return "⚡ Exam Speed Trick: Same distance means faster speed gives less time, so reverse the speed ratio.";
    case "distanceRatioFromSpeedAndTimeRatios": return "⚡ Exam Speed Trick: Multiply the two ratio terms position by position.";
    case "speedRatioFromDistanceAndTimeRatios":
    case "timeRatioFromDistanceAndSpeedRatios": return "⚡ Exam Speed Trick: Divide ratios by multiplying by the reciprocal.";
    case "requiredUniformSpeedForDeadline": return "⚡ Exam Speed Trick: Deadline questions are time-budget questions first.";
    case "speedFromPace": return "⚡ Exam Speed Trick: For minutes/km, speed in km/h = 60 ÷ pace.";
    case "paceFromSpeed": return "⚡ Exam Speed Trick: For km/h, pace in minutes/km = 60 ÷ speed.";
    default: return `⚡ Exam Speed Trick: ${ruleFor(mode).replace(/\.$/, "")}.`;
  }
}

function simpleLine(line: string): string {
  return line
    .replace(/^Therefore,?\s*/i, "")
    .replace(/^So,?\s*/i, "")
    .replace(/^Collecting terms gives\s*/i, "Simplify: ")
    .replace(/compatible units/gi, "matching units")
    .replace(/reconstruct/gi, "find")
    .replace(/remaining duration/gi, "time left")
    .replace(/remaining time/gi, "time left")
    .replace(/unknown-leg/gi, "second-part")
    .replace(/known-leg/gi, "known-part")
    .replace(/complete journey/gi, "whole journey")
    .replace(/overall average/gi, "average speed")
    .replace(/required value/gi, "answer")
    .trim();
}

function simpleReason(entry: TsdCp001OptionAnalysis): TsdCp001OptionAnalysis {
  let reason = simpleLine(entry.reason)
    .replace(/this option/gi, "this answer")
    .replace(/This corresponds to/gi, "This comes from")
    .replace(/does not satisfy/gi, "does not give")
    .replace(/misconception/gi, "mistake")
    .replace(/arithmetic/gi, "calculation");
  reason = reason.replace(/\s+/g, " ").trim();
  return Object.freeze({ ...entry, reason });
}

function compactWorking(lines: readonly string[]): readonly string[] {
  const cleaned = lines.map(simpleLine).filter(Boolean);
  const selected = cleaned.length <= 4
    ? cleaned
    : [cleaned[0], cleaned[1], cleaned[cleaned.length - 2], cleaned[cleaned.length - 1]];
  return Object.freeze(selected);
}

export function makeCp001StudentFriendly(
  question: TsdCp001GeneratedQuestion,
): TsdCp001GeneratedQuestion {
  const rule = ruleFor(question.solveMode);
  const working = compactWorking(question.explanation.working);
  const steps = Object.freeze([
    leadFor(question.solveMode),
    rule,
    ...working,
    `Answer = ${question.answerText}.`,
  ]);
  const context = contextualizeLearnerStem(
    question.stem,
    question.stemMathJax,
    question.solveMode,
    question.seed,
  );
  const optionAnalysis = Object.freeze(question.explanation.optionAnalysis.map(simpleReason));

  return Object.freeze({
    ...question,
    stem: context.stem,
    stemMathJax: context.stemMathJax,
    explanation: Object.freeze({
      ...question.explanation,
      keyRule: `📌 Main Rule: ${rule}`,
      stepByStepSolution: steps,
      examSpeedShortcut: shortcutFor(question.solveMode),
      optionAnalysis,
      concept: rule,
      working,
      shortcut: shortcutFor(question.solveMode).replace(/^⚡ Exam Speed Trick:\s*/, ""),
      trap: "Common mistake: using the right formula with the wrong units or wrong direction.",
      conclusion: `Answer = ${question.answerText}.`,
    }),
  });
}
