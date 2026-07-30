import { add, compare, divide, equals, formatTimeText, multiply, rational, rationalKey, reciprocal, subtract } from "./rational";
import { required, seedNumber } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp003MisconceptionId, TmwCp003Option, TmwCp003Parameters, TmwCp003RegistryEntry, TmwCp003Solution } from "./cp003-types";
import { ratioText } from "./cp003-solver";
import { formatRational } from "./rational";

function percent(value: Rational): Rational {
  return multiply(value, rational(100));
}

function formatOption(entry: TmwCp003RegistryEntry, p: TmwCp003Parameters, value: Rational): string {
  if (entry.answerType === "RATIO") return ratioText(value);
  if (entry.answerType === "PERCENT") return `${formatRational(value)}%`;
  if (entry.answerType === "TIME") return formatTimeText(value, p.timeUnit, `${p.timeUnit}s`);
  return `${formatRational(value)} ${p.context.outputNoun}`;
}

function option(value: Rational, misconceptionId: TmwCp003MisconceptionId): { value: Rational; misconceptionId: TmwCp003MisconceptionId } {
  return { value, misconceptionId };
}

function wrongOptions(entry: TmwCp003RegistryEntry, p: TmwCp003Parameters, answer: Rational): Array<{ value: Rational; misconceptionId: TmwCp003MisconceptionId }> {
  switch (entry.solveMode) {
    case "findEfficiencyRatioFromEqualWorkTimes":
      return [
        option(divide(required(p.timeA, "timeA"), required(p.timeB, "timeB")), "DIRECT_TIME_RATIO"),
        option(divide(add(required(p.timeA, "timeA"), required(p.timeB, "timeB")), required(p.timeA, "timeA")), "RATIO_SUM_USED"),
        option(divide(add(required(p.timeA, "timeA"), required(p.timeB, "timeB")), required(p.timeB, "timeB")), "PLAUSIBLE_SCALE_ERROR"),
      ];
    case "findTimeRatioFromEfficiencyRatio":
      return [
        option(divide(p.efficiencyA, p.efficiencyB), "DIRECT_TIME_RATIO"),
        option(divide(p.efficiencyA, add(p.efficiencyA, p.efficiencyB)), "RATIO_SUM_USED"),
        option(divide(p.efficiencyB, add(p.efficiencyA, p.efficiencyB)), "PLAUSIBLE_SCALE_ERROR"),
      ];
    case "findEfficiencyPercentMoreFromCompletionTimes": {
      const timeA = required(p.timeA, "timeA");
      const timeB = required(p.timeB, "timeB");
      const difference = subtract(timeB, timeA);
      return [
        option(percent(divide(difference, timeB)), "PERCENT_BASE_REVERSED"),
        option(percent(divide(difference, timeA)), "TIME_PERCENT_USED_AS_EFFICIENCY_PERCENT"),
        option(percent(divide(timeA, timeB)), "RAW_TIME_RATIO_PERCENT"),
      ];
    }
    case "findEfficiencyPercentLessFromCompletionTimes": {
      const timeA = required(p.timeA, "timeA");
      const timeB = required(p.timeB, "timeB");
      const difference = subtract(timeA, timeB);
      return [
        option(percent(divide(difference, timeB)), "PERCENT_BASE_REVERSED"),
        option(percent(divide(timeB, timeA)), "RAW_TIME_RATIO_PERCENT"),
        option(percent(divide(difference, add(timeA, timeB))), "PLAUSIBLE_SCALE_ERROR"),
      ];
    }
    case "findFasterTimeFromSlowerTimeAndPercentMoreEfficient": {
      const timeB = required(p.timeB, "timeB");
      const pct = required(p.percentAOverB, "percentAOverB");
      const multiplier = add(rational(1), divide(pct, rational(100)));
      return [
        option(multiply(timeB, multiplier), "EFFICIENCY_MULTIPLIER_NOT_INVERTED"),
        option(multiply(timeB, subtract(rational(1), divide(pct, rational(100)))), "EFFICIENCY_PERCENT_USED_AS_TIME_PERCENT"),
        option(timeB, "REFERENCE_OUTPUT_REPORTED"),
      ];
    }
    case "findSlowerTimeFromFasterTimeAndPercentMoreEfficient": {
      const timeA = required(p.timeA, "timeA");
      const pct = required(p.percentAOverB, "percentAOverB");
      const multiplier = add(rational(1), divide(pct, rational(100)));
      return [
        option(divide(timeA, multiplier), "EFFICIENCY_MULTIPLIER_NOT_INVERTED"),
        option(multiply(timeA, subtract(rational(1), divide(pct, rational(100)))), "EFFICIENCY_PERCENT_USED_AS_TIME_PERCENT"),
        option(timeA, "REFERENCE_OUTPUT_REPORTED"),
      ];
    }
    case "findTimePercentLessFromEfficiencyPercentMore": {
      const pct = required(p.percentAOverB, "percentAOverB");
      return [
        option(pct, "EFFICIENCY_PERCENT_USED_AS_TIME_PERCENT"),
        option(percent(divide(pct, subtract(rational(100), pct))), "PERCENT_BASE_REVERSED"),
        option(subtract(rational(100), answer), "PLAUSIBLE_SCALE_ERROR"),
      ];
    }
    case "findTimePercentMoreFromEfficiencyPercentLess": {
      const pct = required(p.percentAOverB, "percentAOverB");
      return [
        option(pct, "EFFICIENCY_PERCENT_USED_AS_TIME_PERCENT"),
        option(percent(divide(pct, add(rational(100), pct))), "PERCENT_BASE_REVERSED"),
        option(subtract(rational(100), answer), "PLAUSIBLE_SCALE_ERROR"),
      ];
    }
    case "findWorkRatioAtEqualTimeFromEfficiencyRatio":
      return [
        option(reciprocal(answer), "RATIO_ORDER_REVERSED"),
        option(rational(1), "EQUAL_TIME_ASSUMED"),
        option(divide(p.efficiencyA, add(p.efficiencyA, p.efficiencyB)), "RATIO_SUM_USED"),
      ];
    case "findWorkRatioFromEfficiencyRatioAndUnequalTimes":
      return [
        option(divide(p.efficiencyA, p.efficiencyB), "TIME_FACTOR_OMITTED"),
        option(divide(required(p.durationA, "durationA"), required(p.durationB, "durationB")), "WORK_FACTOR_OMITTED"),
        option(reciprocal(answer), "RATIO_ORDER_REVERSED"),
      ];
    case "findTimeRatioForUnequalWorkAndEfficiencyRatio":
      return [
        option(divide(required(p.workA, "workA"), required(p.workB, "workB")), "TIME_FACTOR_OMITTED"),
        option(divide(p.efficiencyB, p.efficiencyA), "WORK_FACTOR_OMITTED"),
        option(divide(multiply(required(p.workA, "workA"), p.efficiencyA), multiply(required(p.workB, "workB"), p.efficiencyB)), "EFFICIENCY_MULTIPLIER_NOT_INVERTED"),
      ];
    case "findEfficiencyRatioFromUnequalWorkAndTimes":
    case "findEfficiencyRatioFromOutputAndTimeComparison":
      return [
        option(divide(required(entry.solveMode === "findEfficiencyRatioFromOutputAndTimeComparison" ? p.outputA : p.workA, "quantityA"), required(entry.solveMode === "findEfficiencyRatioFromOutputAndTimeComparison" ? p.outputB : p.workB, "quantityB")), "TIME_FACTOR_OMITTED"),
        option(divide(required(entry.solveMode === "findEfficiencyRatioFromOutputAndTimeComparison" ? p.durationA : p.timeA, "timeA"), required(entry.solveMode === "findEfficiencyRatioFromOutputAndTimeComparison" ? p.durationB : p.timeB, "timeB")), "WORK_FACTOR_OMITTED"),
        option(reciprocal(answer), "RATIO_ORDER_REVERSED"),
      ];
    case "findOutputFromEfficiencyRatioAndReferenceOutput":
      return [
        option(required(p.outputB, "outputB"), "REFERENCE_OUTPUT_REPORTED"),
        option(divide(multiply(required(p.outputB, "outputB"), p.efficiencyB), p.efficiencyA), "OUTPUT_DIVIDED_INSTEAD_OF_MULTIPLIED"),
        option(add(required(p.outputB, "outputB"), p.efficiencyA), "PLAUSIBLE_SCALE_ERROR"),
      ];
    case "findReferenceOutputFromEfficiencyRatioAndOtherOutput":
      return [
        option(required(p.outputA, "outputA"), "REFERENCE_OUTPUT_REPORTED"),
        option(divide(multiply(required(p.outputA, "outputA"), p.efficiencyA), p.efficiencyB), "OUTPUT_DIVIDED_INSTEAD_OF_MULTIPLIED"),
        option(subtract(required(p.outputA, "outputA"), p.efficiencyA), "PLAUSIBLE_SCALE_ERROR"),
      ];
    case "findIndividualTimeFromEfficiencyRatioAndCombinedTime": {
      const target = required(p.targetAgentIndex, "targetAgentIndex");
      return [
        option(required(p.combinedTime, "combinedTime"), "COMBINED_TIME_REPORTED"),
        option(target === 0 ? required(p.timeB, "timeB") : required(p.timeA, "timeA"), "OTHER_AGENT_TIME_REPORTED"),
        option(multiply(required(p.combinedTime, "combinedTime"), divide(target === 0 ? p.efficiencyA : p.efficiencyB, add(p.efficiencyA, p.efficiencyB))), "EFFICIENCY_MULTIPLIER_NOT_INVERTED"),
      ];
    }
    case "findIndividualTimeFromEfficiencyRatioAndTimeDifference":
      return [
        option(required(p.timeDifference, "timeDifference"), "TIME_DIFFERENCE_USED_DIRECTLY"),
        option(required(p.targetAgentIndex, "targetAgentIndex") === 0 ? required(p.timeB, "timeB") : required(p.timeA, "timeA"), "OTHER_AGENT_TIME_REPORTED"),
        option(add(answer, required(p.timeDifference, "timeDifference")), "PLAUSIBLE_SCALE_ERROR"),
      ];
    case "findIndividualTimeFromEfficiencyRatioAndTimeSum":
      return [
        option(required(p.timeSum, "timeSum"), "TIME_SUM_USED_DIRECTLY"),
        option(required(p.targetAgentIndex, "targetAgentIndex") === 0 ? required(p.timeB, "timeB") : required(p.timeA, "timeA"), "OTHER_AGENT_TIME_REPORTED"),
        option(divide(required(p.timeSum, "timeSum"), rational(2)), "EQUAL_TIME_ASSUMED"),
      ];
    case "findComparativeOutputFromDifferentEfficienciesAndDurations":
      return [
        option(divide(multiply(required(p.outputB, "outputB"), p.efficiencyA), p.efficiencyB), "TIME_FACTOR_OMITTED"),
        option(divide(multiply(required(p.outputB, "outputB"), required(p.durationA, "durationA")), required(p.durationB, "durationB")), "WORK_FACTOR_OMITTED"),
        option(required(p.outputB, "outputB"), "REFERENCE_OUTPUT_REPORTED"),
      ];
    case "findComparativeDurationFromDifferentWorkAndEfficiencies":
      return [
        option(divide(multiply(required(p.timeB, "timeB"), required(p.workA, "workA")), required(p.workB, "workB")), "WORK_FACTOR_OMITTED"),
        option(divide(multiply(required(p.timeB, "timeB"), p.efficiencyB), p.efficiencyA), "TIME_FACTOR_OMITTED"),
        option(required(p.timeB, "timeB"), "REFERENCE_OUTPUT_REPORTED"),
      ];
    case "findSuccessiveEfficiencyRatioAcrossThreeAgents":
      return [
        option(p.efficiencyA, "SECOND_RELATION_OMITTED"),
        option(reciprocal(required(p.efficiencyC, "efficiencyC")), "SECOND_RELATION_OMITTED"),
        option(add(p.efficiencyA, reciprocal(required(p.efficiencyC, "efficiencyC"))), "RATIO_SUM_USED"),
      ];
    case "findSuccessiveEfficiencyPercentComparison":
      return [
        option(add(required(p.percentAOverB, "percentAOverB"), required(p.percentBOverC, "percentBOverC")), "SUCCESSIVE_PERCENTAGES_ADDED"),
        option(required(p.percentAOverB, "percentAOverB"), "SECOND_RELATION_OMITTED"),
        option(required(p.percentBOverC, "percentBOverC"), "SECOND_RELATION_OMITTED"),
      ];
    case "findEfficiencyChangePercentFromCompletionTimeChange": {
      const oldTime = required(p.originalTime, "originalTime");
      const newTime = required(p.changedTime, "changedTime");
      return [
        option(percent(divide(subtract(oldTime, newTime), oldTime)), "OLD_TIME_BASE_USED"),
        option(percent(divide(oldTime, newTime)), "RAW_TIME_RATIO_PERCENT"),
        option(percent(divide(subtract(oldTime, newTime), add(oldTime, newTime))), "TIME_CHANGE_PERCENT_REPORTED"),
      ];
    }
  }
}

export function buildTmwCp003Options(entry: TmwCp003RegistryEntry, p: TmwCp003Parameters, solution: TmwCp003Solution, seed: string): { options: TmwCp003Option[]; correctIndex: number } {
  const candidates = [option(solution.answer, "CORRECT"), ...wrongOptions(entry, p, solution.answer)];
  const unique: Array<{ value: Rational; misconceptionId: TmwCp003MisconceptionId }> = [];
  for (const candidate of candidates) {
    if (compare(candidate.value, rational(0)) <= 0) continue;
    if (entry.answerType === "OUTPUT" && candidate.value.denominator !== 1) continue;
    if (!unique.some((item) => equals(item.value, candidate.value))) unique.push(candidate);
  }
  const fallbackValues = [multiply(solution.answer, rational(2)), divide(solution.answer, rational(2)), add(solution.answer, rational(1)), add(solution.answer, rational(2))];
  for (const value of fallbackValues) {
    if (unique.length >= 4) break;
    if (entry.answerType === "OUTPUT" && value.denominator !== 1) continue;
    if (compare(value, rational(0)) > 0 && !unique.some((item) => rationalKey(item.value) === rationalKey(value))) unique.push(option(value, "PLAUSIBLE_SCALE_ERROR"));
  }
  if (entry.answerType === "OUTPUT") {
    for (const delta of [3, 5, 10, 15]) {
      if (unique.length >= 4) break;
      const value = add(solution.answer, rational(delta));
      if (!unique.some((item) => equals(item.value, value))) unique.push(option(value, "PLAUSIBLE_SCALE_ERROR"));
    }
  }
  if (unique.length < 4) throw new Error(`Unable to construct four CP-003 options for ${entry.qlId}`);
  const selected = unique.slice(0, 4);
  const rotation = seedNumber(seed, "cp003-option-rotation") % 4;
  const rotated = selected.map((_, index) => selected[(index + rotation) % selected.length]);
  const options: TmwCp003Option[] = rotated.map((item) => ({ ...item, text: formatOption(entry, p, item.value) }));
  return { options, correctIndex: options.findIndex((item) => item.misconceptionId === "CORRECT") };
}
