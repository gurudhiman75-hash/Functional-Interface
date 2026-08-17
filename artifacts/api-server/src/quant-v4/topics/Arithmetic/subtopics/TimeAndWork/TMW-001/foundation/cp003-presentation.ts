import { divide, formatRational, formatTimeText } from "./rational";
import { required } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp003Parameters, TmwCp003RegistryEntry } from "./cp003-types";
import { ratioText } from "./cp003-solver";

function title(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function thirdPerson(verb: string): string {
  if (verb.endsWith("y")) return `${verb.slice(0, -1)}ies`;
  if (verb.endsWith("s") || verb.endsWith("x") || verb.endsWith("ch") || verb.endsWith("sh")) return `${verb}es`;
  return `${verb}s`;
}

function efficiencyRatio(p: TmwCp003Parameters): string {
  return ratioText(divide(p.efficiencyA, p.efficiencyB));
}

function workRatio(a: Rational, b: Rational): string {
  return ratioText(divide(a, b));
}

function name(p: TmwCp003Parameters, letter: "A" | "B" | "C"): string {
  return `${title(p.context.agentNoun)} ${letter}`;
}

function days(p: TmwCp003Parameters, value: Rational): string {
  return formatTimeText(value, p.timeUnit, `${p.timeUnit}s`);
}

function pct(value: Rational): string {
  return `${formatRational(value)}%`;
}

export function renderTmwCp003Stem(entry: TmwCp003RegistryEntry, p: TmwCp003Parameters): string {
  const A = name(p, "A");
  const B = name(p, "B");
  const C = name(p, "C");
  switch (entry.solveMode) {
    case "findEfficiencyRatioFromEqualWorkTimes":
      return `${A} can complete ${p.context.jobPhrase} in ${days(p, required(p.timeA, "timeA"))}, while ${B} requires ${days(p, required(p.timeB, "timeB"))} for the same work. Find the efficiency ratio of ${A} to ${B}.`;
    case "findTimeRatioFromEfficiencyRatio":
      return `The efficiency ratio of ${A} to ${B} is ${efficiencyRatio(p)}. If both are given equal workloads, find the ratio of their completion times, ${A}:${B}.`;
    case "findEfficiencyPercentMoreFromCompletionTimes":
      return `${A} completes ${p.context.jobPhrase} in ${days(p, required(p.timeA, "timeA"))}, whereas ${B} takes ${days(p, required(p.timeB, "timeB"))}. By what percent is ${A} more efficient than ${B}?`;
    case "findEfficiencyPercentLessFromCompletionTimes":
      return `${A} completes ${p.context.jobPhrase} in ${days(p, required(p.timeA, "timeA"))}, whereas ${B} takes ${days(p, required(p.timeB, "timeB"))}. By what percent is ${A} less efficient than ${B}?`;
    case "findFasterTimeFromSlowerTimeAndPercentMoreEfficient":
      return `${A} is ${pct(required(p.percentAOverB, "percentAOverB"))} more efficient than ${B}. If ${B} completes ${p.context.jobPhrase} in ${days(p, required(p.timeB, "timeB"))}, how long will ${A} take?`;
    case "findSlowerTimeFromFasterTimeAndPercentMoreEfficient":
      return `${A} is ${pct(required(p.percentAOverB, "percentAOverB"))} more efficient than ${B}. If ${A} completes ${p.context.jobPhrase} in ${days(p, required(p.timeA, "timeA"))}, how long will ${B} take?`;
    case "findTimePercentLessFromEfficiencyPercentMore":
      return `${A} is ${pct(required(p.percentAOverB, "percentAOverB"))} more efficient than ${B}. For the same work, by what percent will ${A}'s completion time be less than ${B}'s?`;
    case "findTimePercentMoreFromEfficiencyPercentLess":
      return `${A} is ${pct(required(p.percentAOverB, "percentAOverB"))} less efficient than ${B}. For the same work, by what percent will ${A}'s completion time exceed ${B}'s?`;
    case "findWorkRatioAtEqualTimeFromEfficiencyRatio":
      return `${A} and ${B} work for the same duration. Their efficiency ratio is ${efficiencyRatio(p)}. Find the ratio of the work completed by ${A} and ${B}.`;
    case "findWorkRatioFromEfficiencyRatioAndUnequalTimes":
      return `The efficiency ratio of ${A} to ${B} is ${efficiencyRatio(p)}. ${A} works for ${days(p, required(p.durationA, "durationA"))} and ${B} for ${days(p, required(p.durationB, "durationB"))}. Find the ratio of the work completed by them, ${A}:${B}.`;
    case "findTimeRatioForUnequalWorkAndEfficiencyRatio":
      return `${A} and ${B} have efficiency ratio ${efficiencyRatio(p)}. Their workloads are in the ratio ${workRatio(required(p.workA, "workA"), required(p.workB, "workB"))}. Find the ratio of their required times, ${A}:${B}.`;
    case "findEfficiencyRatioFromUnequalWorkAndTimes":
      return `${A} completes ${formatRational(required(p.workA, "workA"))} units of work in ${days(p, required(p.timeA, "timeA"))}, while ${B} completes ${formatRational(required(p.workB, "workB"))} units in ${days(p, required(p.timeB, "timeB"))}. Find the efficiency ratio ${A}:${B}.`;
    case "findOutputFromEfficiencyRatioAndReferenceOutput":
      return `${A} and ${B} work for equal time, and their efficiency ratio is ${efficiencyRatio(p)}. If ${B} ${thirdPerson(p.context.outputVerb)} ${formatRational(required(p.outputB, "outputB"))} ${p.context.outputNoun}, how many ${p.context.outputNoun} will ${A} ${p.context.outputVerb}?`;
    case "findReferenceOutputFromEfficiencyRatioAndOtherOutput":
      return `${A} and ${B} work for equal time, and their efficiency ratio is ${efficiencyRatio(p)}. If ${A} ${thirdPerson(p.context.outputVerb)} ${formatRational(required(p.outputA, "outputA"))} ${p.context.outputNoun}, how many ${p.context.outputNoun} will ${B} ${p.context.outputVerb}?`;
    case "findIndividualTimeFromEfficiencyRatioAndCombinedTime": {
      const target = required(p.targetAgentIndex, "targetAgentIndex") === 0 ? A : B;
      return `${A} and ${B} have efficiency ratio ${efficiencyRatio(p)}. Working together, they complete ${p.context.jobPhrase} in ${days(p, required(p.combinedTime, "combinedTime"))}. How long would ${target} take alone?`;
    }
    case "findIndividualTimeFromEfficiencyRatioAndTimeDifference": {
      const target = required(p.targetAgentIndex, "targetAgentIndex") === 0 ? A : B;
      return `The efficiency ratio of ${A} to ${B} is ${efficiencyRatio(p)}. For the same work, their completion times differ by ${days(p, required(p.timeDifference, "timeDifference"))}. Find ${target}'s completion time.`;
    }
    case "findIndividualTimeFromEfficiencyRatioAndTimeSum": {
      const target = required(p.targetAgentIndex, "targetAgentIndex") === 0 ? A : B;
      return `The efficiency ratio of ${A} to ${B} is ${efficiencyRatio(p)}. For the same work, the sum of their individual completion times is ${days(p, required(p.timeSum, "timeSum"))}. Find ${target}'s completion time.`;
    }
    case "findEfficiencyRatioFromOutputAndTimeComparison":
      return `${A} ${thirdPerson(p.context.outputVerb)} ${formatRational(required(p.outputA, "outputA"))} ${p.context.outputNoun} in ${days(p, required(p.durationA, "durationA"))}, while ${B} ${thirdPerson(p.context.outputVerb)} ${formatRational(required(p.outputB, "outputB"))} ${p.context.outputNoun} in ${days(p, required(p.durationB, "durationB"))}. Find their efficiency ratio, ${A}:${B}.`;
    case "findComparativeOutputFromDifferentEfficienciesAndDurations":
      return `The efficiency ratio of ${A} to ${B} is ${efficiencyRatio(p)}. ${B} ${thirdPerson(p.context.outputVerb)} ${formatRational(required(p.outputB, "outputB"))} ${p.context.outputNoun} in ${days(p, required(p.durationB, "durationB"))}. How many ${p.context.outputNoun} will ${A} ${p.context.outputVerb} in ${days(p, required(p.durationA, "durationA"))}?`;
    case "findComparativeDurationFromDifferentWorkAndEfficiencies":
      return `${A} and ${B} have efficiency ratio ${efficiencyRatio(p)}. Their work quantities are in the ratio ${workRatio(required(p.workA, "workA"), required(p.workB, "workB"))}. If ${B} needs ${days(p, required(p.timeB, "timeB"))}, how long will ${A} need?`;
    case "findSuccessiveEfficiencyRatioAcrossThreeAgents":
      return `The efficiency ratio of ${A} to ${B} is ${ratioText(p.efficiencyA)}, and that of ${B} to ${C} is ${ratioText({ numerator: required(p.efficiencyC, "efficiencyC").denominator, denominator: required(p.efficiencyC, "efficiencyC").numerator })}. Find the efficiency ratio ${A}:${C}.`;
    case "findSuccessiveEfficiencyPercentComparison":
      return `${A} is ${pct(required(p.percentAOverB, "percentAOverB"))} more efficient than ${B}, and ${B} is ${pct(required(p.percentBOverC, "percentBOverC"))} more efficient than ${C}. By what percent is ${A} more efficient than ${C}?`;
    case "findEfficiencyChangePercentFromCompletionTimeChange":
      return `After an improvement in working efficiency, the time required to complete ${p.context.jobPhrase} falls from ${days(p, required(p.originalTime, "originalTime"))} to ${days(p, required(p.changedTime, "changedTime"))}. By what percent has the efficiency increased?`;
  }
}

export function tmwCp003ExplanationOpening(entry: TmwCp003RegistryEntry): string {
  switch (entry.solveMode) {
    case "findEfficiencyPercentMoreFromCompletionTimes":
    case "findEfficiencyPercentLessFromCompletionTimes":
    case "findEfficiencyChangePercentFromCompletionTimeChange":
      return "For equal work, first reverse the completion-time comparison to obtain the efficiency ratio, then calculate the percentage on the reference efficiency named in the question.";
    case "findFasterTimeFromSlowerTimeAndPercentMoreEfficient":
    case "findSlowerTimeFromFasterTimeAndPercentMoreEfficient":
    case "findTimePercentLessFromEfficiencyPercentMore":
    case "findTimePercentMoreFromEfficiencyPercentLess":
      return "Convert the stated efficiency percentage into a multiplier; because time is inversely proportional to efficiency, use the reciprocal effect for completion time.";
    default:
      switch (entry.ruleId) {
        case "TMW_EFFICIENCY_TIME_INVERSE":
          return "For the same amount of work, efficiency and completion time vary inversely, so reverse the efficiency order when forming the time ratio.";
        case "TMW_COMPARATIVE_PRODUCTIVITY":
          return "Use work = efficiency × time and retain both the productivity factor and the working duration in the comparison.";
        case "TMW_EFFICIENCY_COMBINED_RATE":
          return "Represent the individual rates in the stated efficiency ratio and match their sum to the known combined completion rate.";
        case "TMW_SUCCESSIVE_EFFICIENCY":
          return "Link the successive efficiency relations multiplicatively; the second comparison changes the base and cannot simply be added to the first.";
        case "TMW_EFFICIENCY_PERCENT_CHANGE":
          return "Use the inverse relation between equal-work efficiency and completion time, preserving the comparison base specified in the question.";
      }
  }
}

export function tmwCp003Conclusion(entry: TmwCp003RegistryEntry, p: TmwCp003Parameters, answerText: string): string {
  const A = name(p, "A");
  const B = name(p, "B");
  const C = name(p, "C");
  switch (entry.solveMode) {
    case "findEfficiencyRatioFromEqualWorkTimes":
    case "findEfficiencyRatioFromUnequalWorkAndTimes":
    case "findEfficiencyRatioFromOutputAndTimeComparison":
      return `Therefore, the efficiency ratio ${A}:${B} is ${answerText}.`;
    case "findSuccessiveEfficiencyRatioAcrossThreeAgents":
      return `Therefore, the efficiency ratio ${A}:${C} is ${answerText}.`;
    case "findTimeRatioFromEfficiencyRatio":
    case "findTimeRatioForUnequalWorkAndEfficiencyRatio":
      return `Therefore, the completion-time ratio ${A}:${B} is ${answerText}.`;
    case "findWorkRatioAtEqualTimeFromEfficiencyRatio":
    case "findWorkRatioFromEfficiencyRatioAndUnequalTimes":
      return `Therefore, the work ratio ${A}:${B} is ${answerText}.`;
    case "findEfficiencyPercentMoreFromCompletionTimes":
      return `Therefore, ${A} is ${answerText} more efficient than ${B}.`;
    case "findEfficiencyPercentLessFromCompletionTimes":
      return `Therefore, ${A} is ${answerText} less efficient than ${B}.`;
    case "findTimePercentLessFromEfficiencyPercentMore":
      return `Therefore, ${A} takes ${answerText} less time than ${B} for the same work.`;
    case "findTimePercentMoreFromEfficiencyPercentLess":
      return `Therefore, ${A} takes ${answerText} more time than ${B} for the same work.`;
    case "findSuccessiveEfficiencyPercentComparison":
      return `Therefore, ${A} is ${answerText} more efficient than ${C}.`;
    case "findEfficiencyChangePercentFromCompletionTimeChange":
      return `Therefore, the working efficiency has increased by ${answerText}.`;
    case "findOutputFromEfficiencyRatioAndReferenceOutput":
    case "findReferenceOutputFromEfficiencyRatioAndOtherOutput":
    case "findComparativeOutputFromDifferentEfficienciesAndDurations":
      return `Therefore, the required output is ${answerText}.`;
    case "findFasterTimeFromSlowerTimeAndPercentMoreEfficient":
    case "findSlowerTimeFromFasterTimeAndPercentMoreEfficient":
    case "findIndividualTimeFromEfficiencyRatioAndCombinedTime":
    case "findIndividualTimeFromEfficiencyRatioAndTimeDifference":
    case "findIndividualTimeFromEfficiencyRatioAndTimeSum":
    case "findComparativeDurationFromDifferentWorkAndEfficiencies":
      return `Therefore, the required completion time is ${answerText}.`;
  }
}
