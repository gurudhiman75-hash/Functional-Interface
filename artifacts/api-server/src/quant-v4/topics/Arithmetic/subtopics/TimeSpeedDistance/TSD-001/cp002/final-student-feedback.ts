import type {
  TsdCp002GeneratedQuestion,
  TsdCp002OptionAnalysis,
} from "./types";

function resultSentence(question: TsdCp002GeneratedQuestion): string {
  switch (question.solveMode) {
    case "averageSpeedFromSegments":
    case "unknownSegmentSpeedFromAverage":
    case "unknownRoundTripLegSpeedFromAverage":
    case "requiredRemainingSpeedForTargetAverage":
      return `Correct speed is ${question.answerText}.`;
    case "averagePaceFromSegments":
      return `Correct pace is ${question.answerText}.`;
    case "unknownSegmentTimeFromAverage":
    case "roundTripTimeFromOneWayDistance":
      return `Correct time is ${question.answerText}.`;
    case "unknownSegmentDistanceFromAverage":
    case "oneWayDistanceFromRoundTripData":
    case "totalDistanceFromAverageAndTime":
      return `Correct distance is ${question.answerText}.`;
    case "unknownSegmentShareFromAverage":
      return `Correct share is ${question.answerText}.`;
    case "segmentRatioFromAverageAndSpeeds":
      return `Correct ratio is ${question.answerText}.`;
    case "compareSegmentedJourneyPlans":
      return `Correct choice is ${question.answerText}.`;
    case "segmentAllocationFromTotalsAndSpeeds":
      return `Correct value is ${question.answerText}.`;
    case "classifyAverageSpeedState":
    case "verifyAverageSpeedClaim":
      return `Correct answer is ${question.answerText}.`;
  }
}

function diagnosisFor(
  question: TsdCp002GeneratedQuestion,
  entry: TsdCp002OptionAnalysis,
): string | null {
  if (question.solveMode !== "unknownSegmentDistanceFromAverage" || entry.isCorrect) return null;

  switch (entry.misconceptionId) {
    case "ASSUME_EQUAL_DISTANCES":
      return "This assumes both distances are equal, but the question does not say that.";
    case "USE_SPEED_DIFFERENCE_AS_DISTANCE":
      return "This uses the difference between two speeds as a distance. Speed difference is not distance.";
    case "DIRECT_SPEED_DISTANCE_PROPORTION":
      return "This scales distance only by the speed ratio. It ignores that the two parts take different times.";
    case "WRONG_DISTANCE_BALANCE":
      return "With this distance, total distance ÷ total time gives the wrong average speed.";
    default:
      return null;
  }
}

function removeOldResultEnding(reason: string): string {
  return reason
    .replace(/;\s*required average\/result is [^.]+\.?$/i, "")
    .replace(/;\s*required result is [^.]+\.?$/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.\s]+$/, "");
}

function checkPart(reason: string): string {
  const match = reason.match(/\bCheck:\s*(.+?)(?:;\s*required average\/result is|;\s*required result is|$)/i);
  return match?.[1]?.trim().replace(/[.\s]+$/, "") ?? "";
}

function rewriteWrongReason(
  question: TsdCp002GeneratedQuestion,
  entry: TsdCp002OptionAnalysis,
): string {
  const diagnosis = diagnosisFor(question, entry);
  const check = checkPart(entry.reason);

  if (diagnosis && check) {
    return `⚠️ ${entry.text}: ${diagnosis} Check: ${check}. ${resultSentence(question)}`;
  }

  let reason = removeOldResultEnding(entry.reason)
    .replace(/This forces an unsupported direct proportion between speed and distance\.?/gi, "This scales distance only by the speed ratio and ignores the different travel times.")
    .replace(/This combines the given numbers without satisfying the average-speed equation\.?/gi, "With this value, total distance ÷ total time gives the wrong average speed.")
    .replace(/unsupported direct proportion/gi, "wrong speed-only shortcut")
    .replace(/combines the given numbers/gi, "uses the given numbers in the wrong way")
    .replace(/without satisfying the average-speed equation/gi, "but gives the wrong whole-trip average")
    .replace(/\s+/g, " ")
    .trim();

  if (!reason.endsWith(".")) reason += ".";
  return `${reason} ${resultSentence(question)}`;
}

export function makeCp002FinalStudentFeedback(
  question: TsdCp002GeneratedQuestion,
): TsdCp002GeneratedQuestion {
  const optionAnalysis = Object.freeze(question.explanation.optionAnalysis.map((entry): TsdCp002OptionAnalysis => {
    if (entry.isCorrect) return entry;
    return Object.freeze({
      ...entry,
      reason: rewriteWrongReason(question, entry),
    });
  }));

  return Object.freeze({
    ...question,
    explanation: Object.freeze({
      ...question.explanation,
      optionAnalysis,
      conclusion: `Answer = ${question.answerText}.`,
    }),
  });
}
