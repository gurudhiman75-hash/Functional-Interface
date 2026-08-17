import { add, divide, multiply, rational, subtract, toLatex } from "./rational";
import { required } from "./cp001-helpers";
import type { TmwCp003MisconceptionId, TmwCp003Option, TmwCp003Parameters, TmwCp003RegistryEntry, TmwCp003Solution } from "./cp003-types";

export interface TmwCp003LearningShortcut {
  title: string;
  steps: string[];
}

export interface TmwCp003CommonTrap {
  optionLabel: string;
  optionText: string;
  misconceptionId: Exclude<TmwCp003MisconceptionId, "CORRECT">;
  explanation: string;
}

function targetLetter(p: TmwCp003Parameters): "A" | "B" {
  return p.targetAgentIndex === 1 ? "B" : "A";
}

function setupLatex(entry: TmwCp003RegistryEntry, p: TmwCp003Parameters): string {
  switch (entry.solveMode) {
    case "findEfficiencyRatioFromEqualWorkTimes": return `T_A=${toLatex(required(p.timeA, "timeA"))},\\quad T_B=${toLatex(required(p.timeB, "timeB"))},\\quad W_A=W_B`;
    case "findTimeRatioFromEfficiencyRatio": return `E_A=${toLatex(p.efficiencyA)},\\quad E_B=${toLatex(p.efficiencyB)},\\quad W_A=W_B`;
    case "findEfficiencyPercentMoreFromCompletionTimes": return `T_A=${toLatex(required(p.timeA, "timeA"))},\\quad T_B=${toLatex(required(p.timeB, "timeB"))},\\quad T_A<T_B`;
    case "findEfficiencyPercentLessFromCompletionTimes": return `T_A=${toLatex(required(p.timeA, "timeA"))},\\quad T_B=${toLatex(required(p.timeB, "timeB"))},\\quad T_A>T_B`;
    case "findFasterTimeFromSlowerTimeAndPercentMoreEfficient": return `T_B=${toLatex(required(p.timeB, "timeB"))},\\quad E_A=\\left(1+\\frac{${toLatex(required(p.percentAOverB, "percentAOverB"))}}{100}\\right)E_B`;
    case "findSlowerTimeFromFasterTimeAndPercentMoreEfficient": return `T_A=${toLatex(required(p.timeA, "timeA"))},\\quad E_A=\\left(1+\\frac{${toLatex(required(p.percentAOverB, "percentAOverB"))}}{100}\\right)E_B`;
    case "findTimePercentLessFromEfficiencyPercentMore": return `E_A=\\left(1+\\frac{${toLatex(required(p.percentAOverB, "percentAOverB"))}}{100}\\right)E_B`;
    case "findTimePercentMoreFromEfficiencyPercentLess": return `E_A=\\left(1-\\frac{${toLatex(required(p.percentAOverB, "percentAOverB"))}}{100}\\right)E_B`;
    case "findWorkRatioAtEqualTimeFromEfficiencyRatio": return `E_A=${toLatex(p.efficiencyA)},\\quad E_B=${toLatex(p.efficiencyB)},\\quad T_A=T_B`;
    case "findWorkRatioFromEfficiencyRatioAndUnequalTimes": return `E_A=${toLatex(p.efficiencyA)},\\ E_B=${toLatex(p.efficiencyB)},\\ T_A=${toLatex(required(p.durationA, "durationA"))},\\ T_B=${toLatex(required(p.durationB, "durationB"))}`;
    case "findTimeRatioForUnequalWorkAndEfficiencyRatio": return `W_A=${toLatex(required(p.workA, "workA"))},\\ W_B=${toLatex(required(p.workB, "workB"))},\\ E_A=${toLatex(p.efficiencyA)},\\ E_B=${toLatex(p.efficiencyB)}`;
    case "findEfficiencyRatioFromUnequalWorkAndTimes": return `W_A=${toLatex(required(p.workA, "workA"))},\\ W_B=${toLatex(required(p.workB, "workB"))},\\ T_A=${toLatex(required(p.timeA, "timeA"))},\\ T_B=${toLatex(required(p.timeB, "timeB"))}`;
    case "findOutputFromEfficiencyRatioAndReferenceOutput": return `Q_B=${toLatex(required(p.outputB, "outputB"))},\\quad E_A:E_B=${toLatex(p.efficiencyA)}:${toLatex(p.efficiencyB)}`;
    case "findReferenceOutputFromEfficiencyRatioAndOtherOutput": return `Q_A=${toLatex(required(p.outputA, "outputA"))},\\quad E_A:E_B=${toLatex(p.efficiencyA)}:${toLatex(p.efficiencyB)}`;
    case "findIndividualTimeFromEfficiencyRatioAndCombinedTime": return `T_{AB}=${toLatex(required(p.combinedTime, "combinedTime"))},\\quad E_A:E_B=${toLatex(p.efficiencyA)}:${toLatex(p.efficiencyB)},\\quad \\text{target}=T_${targetLetter(p)}`;
    case "findIndividualTimeFromEfficiencyRatioAndTimeDifference": return `|T_A-T_B|=${toLatex(required(p.timeDifference, "timeDifference"))},\\quad T_A:T_B=${toLatex(p.efficiencyB)}:${toLatex(p.efficiencyA)},\\quad \\text{target}=T_${targetLetter(p)}`;
    case "findIndividualTimeFromEfficiencyRatioAndTimeSum": return `T_A+T_B=${toLatex(required(p.timeSum, "timeSum"))},\\quad T_A:T_B=${toLatex(p.efficiencyB)}:${toLatex(p.efficiencyA)},\\quad \\text{target}=T_${targetLetter(p)}`;
    case "findEfficiencyRatioFromOutputAndTimeComparison": return `Q_A=${toLatex(required(p.outputA, "outputA"))},\\ Q_B=${toLatex(required(p.outputB, "outputB"))},\\ T_A=${toLatex(required(p.durationA, "durationA"))},\\ T_B=${toLatex(required(p.durationB, "durationB"))}`;
    case "findComparativeOutputFromDifferentEfficienciesAndDurations": return `Q_B=${toLatex(required(p.outputB, "outputB"))},\\ E_A:E_B=${toLatex(p.efficiencyA)}:${toLatex(p.efficiencyB)},\\ T_A=${toLatex(required(p.durationA, "durationA"))},\\ T_B=${toLatex(required(p.durationB, "durationB"))}`;
    case "findComparativeDurationFromDifferentWorkAndEfficiencies": return `W_A=${toLatex(required(p.workA, "workA"))},\\ W_B=${toLatex(required(p.workB, "workB"))},\\ E_A:E_B=${toLatex(p.efficiencyA)}:${toLatex(p.efficiencyB)},\\ T_B=${toLatex(required(p.timeB, "timeB"))}`;
    case "findSuccessiveEfficiencyRatioAcrossThreeAgents": return `\\frac{E_A}{E_B}=${toLatex(p.efficiencyA)},\\quad \\frac{E_B}{E_C}=${toLatex(divide(rational(1), required(p.efficiencyC, "efficiencyC")))}`;
    case "findSuccessiveEfficiencyPercentComparison": return `E_A:E_B=${toLatex(p.efficiencyA)}:1,\\quad E_B:E_C=1:${toLatex(required(p.efficiencyC, "efficiencyC"))}`;
    case "findEfficiencyChangePercentFromCompletionTimeChange": return `T_{old}=${toLatex(required(p.originalTime, "originalTime"))},\\quad T_{new}=${toLatex(required(p.changedTime, "changedTime"))}`;
  }
}

function checkLatex(entry: TmwCp003RegistryEntry, p: TmwCp003Parameters, s: TmwCp003Solution): string {
  const x = s.answer;
  switch (entry.solveMode) {
    case "findEfficiencyRatioFromEqualWorkTimes": return `\\text{Check: }${toLatex(x)}\\times${toLatex(required(p.timeA, "timeA"))}=${toLatex(required(p.timeB, "timeB"))}`;
    case "findTimeRatioFromEfficiencyRatio": return `\\text{Check: }${toLatex(x)}\\times${toLatex(p.efficiencyA)}=${toLatex(p.efficiencyB)}`;
    case "findEfficiencyPercentMoreFromCompletionTimes": return `1+\\frac{${toLatex(x)}}{100}=\\frac{${toLatex(required(p.timeB, "timeB"))}}{${toLatex(required(p.timeA, "timeA"))}}`;
    case "findEfficiencyPercentLessFromCompletionTimes": return `1-\\frac{${toLatex(x)}}{100}=\\frac{${toLatex(required(p.timeB, "timeB"))}}{${toLatex(required(p.timeA, "timeA"))}}`;
    case "findFasterTimeFromSlowerTimeAndPercentMoreEfficient": return `${toLatex(x)}\\times${toLatex(p.efficiencyA)}=${toLatex(required(p.timeB, "timeB"))}\\times${toLatex(p.efficiencyB)}`;
    case "findSlowerTimeFromFasterTimeAndPercentMoreEfficient": return `${toLatex(required(p.timeA, "timeA"))}\\times${toLatex(p.efficiencyA)}=${toLatex(x)}\\times${toLatex(p.efficiencyB)}`;
    case "findTimePercentLessFromEfficiencyPercentMore": return `1-\\frac{${toLatex(x)}}{100}=\\frac{${toLatex(p.efficiencyB)}}{${toLatex(p.efficiencyA)}}`;
    case "findTimePercentMoreFromEfficiencyPercentLess": return `1+\\frac{${toLatex(x)}}{100}=\\frac{${toLatex(p.efficiencyB)}}{${toLatex(p.efficiencyA)}}`;
    case "findWorkRatioAtEqualTimeFromEfficiencyRatio": return `${toLatex(x)}\\times${toLatex(p.efficiencyB)}=${toLatex(p.efficiencyA)}`;
    case "findWorkRatioFromEfficiencyRatioAndUnequalTimes": return `${toLatex(x)}(${toLatex(p.efficiencyB)}\\times${toLatex(required(p.durationB, "durationB"))})=${toLatex(p.efficiencyA)}\\times${toLatex(required(p.durationA, "durationA"))}`;
    case "findTimeRatioForUnequalWorkAndEfficiencyRatio": return `${toLatex(x)}(${toLatex(required(p.workB, "workB"))}\\times${toLatex(p.efficiencyA)})=${toLatex(required(p.workA, "workA"))}\\times${toLatex(p.efficiencyB)}`;
    case "findEfficiencyRatioFromUnequalWorkAndTimes": return `${toLatex(x)}(${toLatex(required(p.workB, "workB"))}\\times${toLatex(required(p.timeA, "timeA"))})=${toLatex(required(p.workA, "workA"))}\\times${toLatex(required(p.timeB, "timeB"))}`;
    case "findOutputFromEfficiencyRatioAndReferenceOutput": return `${toLatex(x)}\\times${toLatex(p.efficiencyB)}=${toLatex(required(p.outputB, "outputB"))}\\times${toLatex(p.efficiencyA)}`;
    case "findReferenceOutputFromEfficiencyRatioAndOtherOutput": return `${toLatex(x)}\\times${toLatex(p.efficiencyA)}=${toLatex(required(p.outputA, "outputA"))}\\times${toLatex(p.efficiencyB)}`;
    case "findIndividualTimeFromEfficiencyRatioAndCombinedTime": {
      const other = p.targetAgentIndex === 1 ? required(p.timeA, "timeA") : required(p.timeB, "timeB");
      return `\\frac{1}{${toLatex(x)}}+\\frac{1}{${toLatex(other)}}=\\frac{1}{${toLatex(required(p.combinedTime, "combinedTime"))}}`;
    }
    case "findIndividualTimeFromEfficiencyRatioAndTimeDifference": return `${toLatex(x)}=T_${targetLetter(p)},\\quad |${toLatex(required(p.timeA, "timeA"))}-${toLatex(required(p.timeB, "timeB"))}|=${toLatex(required(p.timeDifference, "timeDifference"))}`;
    case "findIndividualTimeFromEfficiencyRatioAndTimeSum": return `${toLatex(x)}=T_${targetLetter(p)},\\quad ${toLatex(required(p.timeA, "timeA"))}+${toLatex(required(p.timeB, "timeB"))}=${toLatex(required(p.timeSum, "timeSum"))}`;
    case "findEfficiencyRatioFromOutputAndTimeComparison": return `${toLatex(x)}(${toLatex(required(p.outputB, "outputB"))}\\times${toLatex(required(p.durationA, "durationA"))})=${toLatex(required(p.outputA, "outputA"))}\\times${toLatex(required(p.durationB, "durationB"))}`;
    case "findComparativeOutputFromDifferentEfficienciesAndDurations": return `${toLatex(x)}(${toLatex(p.efficiencyB)}\\times${toLatex(required(p.durationB, "durationB"))})=${toLatex(required(p.outputB, "outputB"))}\\times${toLatex(p.efficiencyA)}\\times${toLatex(required(p.durationA, "durationA"))}`;
    case "findComparativeDurationFromDifferentWorkAndEfficiencies": return `${toLatex(x)}(${toLatex(required(p.workB, "workB"))}\\times${toLatex(p.efficiencyA)})=${toLatex(required(p.timeB, "timeB"))}\\times${toLatex(required(p.workA, "workA"))}\\times${toLatex(p.efficiencyB)}`;
    case "findSuccessiveEfficiencyRatioAcrossThreeAgents": return `${toLatex(x)}\\times${toLatex(required(p.efficiencyC, "efficiencyC"))}=${toLatex(p.efficiencyA)}`;
    case "findSuccessiveEfficiencyPercentComparison": return `1+\\frac{${toLatex(x)}}{100}=\\frac{${toLatex(p.efficiencyA)}}{${toLatex(required(p.efficiencyC, "efficiencyC"))}}`;
    case "findEfficiencyChangePercentFromCompletionTimeChange": return `1+\\frac{${toLatex(x)}}{100}=\\frac{${toLatex(required(p.originalTime, "originalTime"))}}{${toLatex(required(p.changedTime, "changedTime"))}}`;
  }
}

export function buildTmwCp003WorkingLatex(entry: TmwCp003RegistryEntry, p: TmwCp003Parameters, s: TmwCp003Solution, visibleWorked: string[]): string[] {
  return [setupLatex(entry, p), ...visibleWorked, checkLatex(entry, p, s)];
}

export function buildTmwCp003Shortcut(entry: TmwCp003RegistryEntry, p: TmwCp003Parameters, s: TmwCp003Solution): TmwCp003LearningShortcut {
  switch (entry.solveMode) {
    case "findEfficiencyRatioFromEqualWorkTimes": return { title: "10-Second Reverse-Time Ratio", steps: [`For equal work, reverse the completion times; the efficiency ratio is ${s.answerText}.`] };
    case "findTimeRatioFromEfficiencyRatio": return { title: "10-Second Reverse-Efficiency Ratio", steps: [`For equal work, reverse the efficiency ratio; the time ratio is ${s.answerText}.`] };
    case "findEfficiencyPercentMoreFromCompletionTimes": return { title: "10-Second Faster-to-Efficiency Percent", steps: [`Form slower time ÷ faster time, subtract 1, then multiply by 100 to obtain ${s.answerText}.`] };
    case "findEfficiencyPercentLessFromCompletionTimes": return { title: "10-Second Efficiency Shortfall", steps: [`Form the inverse-time efficiency ratio and subtract it from 1; the shortfall is ${s.answerText}.`] };
    case "findFasterTimeFromSlowerTimeAndPercentMoreEfficient": return { title: "10-Second Invert the Efficiency Multiplier", steps: [`Divide the slower time by the efficiency multiplier; the faster time is ${s.answerText}.`] };
    case "findSlowerTimeFromFasterTimeAndPercentMoreEfficient": return { title: "10-Second Restore the Slower Time", steps: [`Multiply the faster time by the efficiency multiplier; the slower time is ${s.answerText}.`] };
    case "findTimePercentLessFromEfficiencyPercentMore": return { title: "10-Second Percent Base Conversion", steps: [`Convert efficiency gain p% to time reduction p/(100+p); the result is ${s.answerText}.`] };
    case "findTimePercentMoreFromEfficiencyPercentLess": return { title: "10-Second Reduced-Efficiency Time Rise", steps: [`Convert efficiency loss p% to time rise p/(100-p); the result is ${s.answerText}.`] };
    case "findWorkRatioAtEqualTimeFromEfficiencyRatio": return { title: "10-Second Equal-Time Output Ratio", steps: [`With equal duration, copy the efficiency ratio directly to work; the answer is ${s.answerText}.`] };
    case "findWorkRatioFromEfficiencyRatioAndUnequalTimes": return { title: "10-Second Efficiency × Time", steps: [`Compare E×T for both agents; the work ratio is ${s.answerText}.`] };
    case "findTimeRatioForUnequalWorkAndEfficiencyRatio": return { title: "10-Second Work ÷ Efficiency", steps: [`Compare W/E for both jobs, or cross-multiply W_AE_B:W_BE_A; the time ratio is ${s.answerText}.`] };
    case "findEfficiencyRatioFromUnequalWorkAndTimes": return { title: "10-Second Work-per-Time Ratio", steps: [`Compare W/T by cross-multiplying W_AT_B:W_BT_A; the efficiency ratio is ${s.answerText}.`] };
    case "findOutputFromEfficiencyRatioAndReferenceOutput": return { title: "10-Second Scale Reference Output", steps: [`Multiply the reference output by E_A/E_B; the required output is ${s.answerText}.`] };
    case "findReferenceOutputFromEfficiencyRatioAndOtherOutput": return { title: "10-Second Reverse Output Scale", steps: [`Multiply the known output by E_B/E_A; the reference output is ${s.answerText}.`] };
    case "findIndividualTimeFromEfficiencyRatioAndCombinedTime": return { title: "10-Second Combined-to-Solo Time", steps: [`Multiply combined time by total efficiency and divide by the target efficiency; solo time is ${s.answerText}.`] };
    case "findIndividualTimeFromEfficiencyRatioAndTimeDifference": return { title: "10-Second Difference Ratio Parts", steps: [`Reverse efficiencies for the time ratio, use the ratio-part difference to find one part, then scale the target; answer ${s.answerText}.`] };
    case "findIndividualTimeFromEfficiencyRatioAndTimeSum": return { title: "10-Second Sum Ratio Parts", steps: [`Reverse efficiencies for the time ratio, divide the total by ratio-part sum, then scale the target; answer ${s.answerText}.`] };
    case "findEfficiencyRatioFromOutputAndTimeComparison": return { title: "10-Second Output-per-Time Cross Product", steps: [`Compare Q/T as Q_AT_B:Q_BT_A; the efficiency ratio is ${s.answerText}.`] };
    case "findComparativeOutputFromDifferentEfficienciesAndDurations": return { title: "10-Second Double Output Scale", steps: [`Scale reference output by both efficiency and duration ratios; the output is ${s.answerText}.`] };
    case "findComparativeDurationFromDifferentWorkAndEfficiencies": return { title: "10-Second Work-and-Efficiency Time Scale", steps: [`Scale reference time by work ratio and inverse efficiency ratio; the duration is ${s.answerText}.`] };
    case "findSuccessiveEfficiencyRatioAcrossThreeAgents": return { title: "10-Second Chain Ratios", steps: [`Multiply E_A/E_B by E_B/E_C and cancel E_B; the final ratio is ${s.answerText}.`] };
    case "findSuccessiveEfficiencyPercentComparison": return { title: "10-Second Compound Efficiency Changes", steps: [`Multiply successive efficiency multipliers rather than adding percentages; the final comparison is ${s.answerText}.`] };
    case "findEfficiencyChangePercentFromCompletionTimeChange": return { title: "10-Second Old-Time ÷ New-Time", steps: [`Use old time ÷ new time as the efficiency multiplier, subtract 1, then convert to percent: ${s.answerText}.`] };
  }
}

const preferredTrap: Partial<Record<TmwCp003RegistryEntry["solveMode"], TmwCp003MisconceptionId[]>> = {
  findEfficiencyRatioFromEqualWorkTimes: ["DIRECT_TIME_RATIO", "RATIO_SUM_USED"],
  findTimeRatioFromEfficiencyRatio: ["DIRECT_TIME_RATIO", "RATIO_SUM_USED"],
  findEfficiencyPercentMoreFromCompletionTimes: ["PERCENT_BASE_REVERSED", "TIME_PERCENT_USED_AS_EFFICIENCY_PERCENT"],
  findEfficiencyPercentLessFromCompletionTimes: ["PERCENT_BASE_REVERSED", "RAW_TIME_RATIO_PERCENT"],
  findFasterTimeFromSlowerTimeAndPercentMoreEfficient: ["EFFICIENCY_MULTIPLIER_NOT_INVERTED", "EFFICIENCY_PERCENT_USED_AS_TIME_PERCENT"],
  findSlowerTimeFromFasterTimeAndPercentMoreEfficient: ["EFFICIENCY_MULTIPLIER_NOT_INVERTED", "EFFICIENCY_PERCENT_USED_AS_TIME_PERCENT"],
  findTimePercentLessFromEfficiencyPercentMore: ["EFFICIENCY_PERCENT_USED_AS_TIME_PERCENT", "PERCENT_BASE_REVERSED"],
  findTimePercentMoreFromEfficiencyPercentLess: ["EFFICIENCY_PERCENT_USED_AS_TIME_PERCENT", "PERCENT_BASE_REVERSED"],
  findWorkRatioAtEqualTimeFromEfficiencyRatio: ["RATIO_ORDER_REVERSED", "EQUAL_TIME_ASSUMED"],
  findWorkRatioFromEfficiencyRatioAndUnequalTimes: ["TIME_FACTOR_OMITTED", "WORK_FACTOR_OMITTED"],
  findTimeRatioForUnequalWorkAndEfficiencyRatio: ["TIME_FACTOR_OMITTED", "WORK_FACTOR_OMITTED"],
  findEfficiencyRatioFromUnequalWorkAndTimes: ["TIME_FACTOR_OMITTED", "WORK_FACTOR_OMITTED"],
  findOutputFromEfficiencyRatioAndReferenceOutput: ["REFERENCE_OUTPUT_REPORTED", "OUTPUT_DIVIDED_INSTEAD_OF_MULTIPLIED"],
  findReferenceOutputFromEfficiencyRatioAndOtherOutput: ["REFERENCE_OUTPUT_REPORTED", "OUTPUT_DIVIDED_INSTEAD_OF_MULTIPLIED"],
  findIndividualTimeFromEfficiencyRatioAndCombinedTime: ["COMBINED_TIME_REPORTED", "OTHER_AGENT_TIME_REPORTED"],
  findIndividualTimeFromEfficiencyRatioAndTimeDifference: ["TIME_DIFFERENCE_USED_DIRECTLY", "OTHER_AGENT_TIME_REPORTED"],
  findIndividualTimeFromEfficiencyRatioAndTimeSum: ["TIME_SUM_USED_DIRECTLY", "EQUAL_TIME_ASSUMED"],
  findEfficiencyRatioFromOutputAndTimeComparison: ["TIME_FACTOR_OMITTED", "WORK_FACTOR_OMITTED"],
  findComparativeOutputFromDifferentEfficienciesAndDurations: ["TIME_FACTOR_OMITTED", "WORK_FACTOR_OMITTED"],
  findComparativeDurationFromDifferentWorkAndEfficiencies: ["WORK_FACTOR_OMITTED", "TIME_FACTOR_OMITTED"],
  findSuccessiveEfficiencyRatioAcrossThreeAgents: ["SECOND_RELATION_OMITTED", "RATIO_SUM_USED"],
  findSuccessiveEfficiencyPercentComparison: ["SUCCESSIVE_PERCENTAGES_ADDED", "SECOND_RELATION_OMITTED"],
  findEfficiencyChangePercentFromCompletionTimeChange: ["OLD_TIME_BASE_USED", "TIME_CHANGE_PERCENT_REPORTED"],
};

function trapReason(id: Exclude<TmwCp003MisconceptionId, "CORRECT">): string {
  switch (id) {
    case "DIRECT_TIME_RATIO": return "copies a time ratio directly even though efficiency and equal-work time are inverse";
    case "RATIO_ORDER_REVERSED": return "reports the comparison in the opposite order";
    case "RATIO_SUM_USED": return "uses a sum of ratio parts instead of the required quotient";
    case "PERCENT_BASE_REVERSED": return "measures the percentage change from the wrong reference value";
    case "EFFICIENCY_PERCENT_USED_AS_TIME_PERCENT": return "copies an efficiency percentage directly to time although time changes inversely";
    case "TIME_PERCENT_USED_AS_EFFICIENCY_PERCENT": return "uses the time reduction percentage as though it were the efficiency gain";
    case "EFFICIENCY_MULTIPLIER_NOT_INVERTED": return "applies the efficiency multiplier in the same direction to completion time";
    case "EQUAL_TIME_ASSUMED": return "treats unequal or constrained times as equal";
    case "TIME_FACTOR_OMITTED": return "ignores one duration factor in a productivity comparison";
    case "WORK_FACTOR_OMITTED": return "ignores one work or output factor in the comparison";
    case "OUTPUT_DIVIDED_INSTEAD_OF_MULTIPLIED": return "reverses the efficiency scaling applied to the reference output";
    case "REFERENCE_OUTPUT_REPORTED": return "copies the known output or time without applying the required scale";
    case "COMBINED_TIME_REPORTED": return "reports the together-time instead of converting it to a solo time";
    case "OTHER_AGENT_TIME_REPORTED": return "selects the non-target agent's duration";
    case "TIME_DIFFERENCE_USED_DIRECTLY": return "uses the difference as a full duration instead of one ratio-part gap";
    case "TIME_SUM_USED_DIRECTLY": return "uses the total sum as one agent's duration";
    case "SUCCESSIVE_PERCENTAGES_ADDED": return "adds successive percentages although their multipliers compound";
    case "SECOND_RELATION_OMITTED": return "stops after the first link in a three-agent comparison";
    case "TIME_CHANGE_PERCENT_REPORTED": return "reports the percentage change in time rather than the inverse efficiency change";
    case "OLD_TIME_BASE_USED": return "uses the old-time difference percentage instead of the old-to-new time ratio";
    case "RAW_TIME_RATIO_PERCENT": return "converts a raw time ratio directly to percent without subtracting the baseline 1";
    case "PLAUSIBLE_SCALE_ERROR": return "is numerically nearby but does not satisfy the generated comparison equation";
  }
}

export function buildTmwCp003CommonTrap(entry: TmwCp003RegistryEntry, options: TmwCp003Option[]): TmwCp003CommonTrap {
  const preferred = preferredTrap[entry.solveMode] ?? [];
  let selectedIndex = -1;
  for (const id of preferred) {
    const index = options.findIndex((option) => option.misconceptionId === id);
    if (index >= 0) { selectedIndex = index; break; }
  }
  if (selectedIndex < 0) selectedIndex = options.findIndex((option) => option.misconceptionId !== "CORRECT");
  if (selectedIndex < 0) throw new Error("CP-003 option set has no distractor for the common-trap explanation");
  const selected = options[selectedIndex];
  if (selected.misconceptionId === "CORRECT") throw new Error("CP-003 common trap selected the correct option");
  const optionLabel = `Option ${"ABCD"[selectedIndex] ?? selectedIndex + 1}`;
  return {
    optionLabel,
    optionText: selected.text,
    misconceptionId: selected.misconceptionId,
    explanation: `${optionLabel} (${selected.text}) ${trapReason(selected.misconceptionId)}; verify the direction and base with the generated equation above.`,
  };
}
