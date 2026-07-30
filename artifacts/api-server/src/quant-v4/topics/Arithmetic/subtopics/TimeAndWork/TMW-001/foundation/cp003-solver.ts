import { add, divide, equals, formatRational, formatTimeText, multiply, rational, reciprocal, subtract, toLatex } from "./rational";
import { required } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp003Parameters, TmwCp003RegistryEntry, TmwCp003Solution } from "./cp003-types";

function percent(value: Rational): Rational {
  return multiply(value, rational(100));
}

function abs(value: Rational): Rational {
  return value.numerator < 0 ? rational(-value.numerator, value.denominator) : value;
}

export function ratioText(value: Rational): string {
  return `${Math.abs(value.numerator)}:${value.denominator}`;
}

function answerText(entry: TmwCp003RegistryEntry, p: TmwCp003Parameters, answer: Rational): string {
  if (entry.answerType === "RATIO") return ratioText(answer);
  if (entry.answerType === "PERCENT") return `${formatRational(answer)}%`;
  if (entry.answerType === "TIME") return formatTimeText(answer, p.timeUnit, `${p.timeUnit}s`);
  return `${formatRational(answer)} ${p.context.outputNoun}`;
}

function agent(target: 0 | 1 | undefined): string {
  return target === 1 ? "B" : "A";
}

export function solveTmwCp003(entry: TmwCp003RegistryEntry, p: TmwCp003Parameters): TmwCp003Solution {
  let answer: Rational;
  let formulaLatex: string;
  let workedLatex: string[];

  switch (entry.solveMode) {
    case "findEfficiencyRatioFromEqualWorkTimes": {
      const timeA = required(p.timeA, "timeA");
      const timeB = required(p.timeB, "timeB");
      answer = divide(timeB, timeA);
      formulaLatex = "E_A:E_B=T_B:T_A";
      workedLatex = [`E_A:E_B=${toLatex(timeB)}:${toLatex(timeA)}=${ratioText(answer)}`];
      break;
    }
    case "findTimeRatioFromEfficiencyRatio": {
      answer = divide(p.efficiencyB, p.efficiencyA);
      formulaLatex = "T_A:T_B=E_B:E_A";
      workedLatex = [`T_A:T_B=${ratioText(answer)}`];
      break;
    }
    case "findEfficiencyPercentMoreFromCompletionTimes": {
      const timeA = required(p.timeA, "timeA");
      const timeB = required(p.timeB, "timeB");
      const ratio = divide(timeB, timeA);
      answer = percent(subtract(ratio, rational(1)));
      formulaLatex = "\\%\\text{ more efficient}=\\left(\\frac{T_B}{T_A}-1\\right)\\times100";
      workedLatex = [
        `\\frac{E_A}{E_B}=\\frac{T_B}{T_A}=\\frac{${toLatex(timeB)}}{${toLatex(timeA)}}=${toLatex(ratio)}`,
        `\\%\\text{ more}=\\left(${toLatex(ratio)}-1\\right)\\times100=${toLatex(answer)}\\%`,
      ];
      break;
    }
    case "findEfficiencyPercentLessFromCompletionTimes": {
      const timeA = required(p.timeA, "timeA");
      const timeB = required(p.timeB, "timeB");
      const ratio = divide(timeB, timeA);
      answer = percent(subtract(rational(1), ratio));
      formulaLatex = "\\%\\text{ less efficient}=\\left(1-\\frac{T_B}{T_A}\\right)\\times100";
      workedLatex = [
        `\\frac{E_A}{E_B}=\\frac{T_B}{T_A}=\\frac{${toLatex(timeB)}}{${toLatex(timeA)}}=${toLatex(ratio)}`,
        `\\%\\text{ less}=\\left(1-${toLatex(ratio)}\\right)\\times100=${toLatex(answer)}\\%`,
      ];
      break;
    }
    case "findFasterTimeFromSlowerTimeAndPercentMoreEfficient": {
      const timeB = required(p.timeB, "timeB");
      const pct = required(p.percentAOverB, "percentAOverB");
      const multiplier = add(rational(1), divide(pct, rational(100)));
      answer = divide(timeB, multiplier);
      formulaLatex = "T_A=\\frac{T_B}{1+p/100}";
      workedLatex = [
        `\\frac{E_A}{E_B}=1+\\frac{${toLatex(pct)}}{100}=${toLatex(multiplier)}`,
        `T_A=\\frac{${toLatex(timeB)}}{${toLatex(multiplier)}}=${toLatex(answer)}`,
      ];
      break;
    }
    case "findSlowerTimeFromFasterTimeAndPercentMoreEfficient": {
      const timeA = required(p.timeA, "timeA");
      const pct = required(p.percentAOverB, "percentAOverB");
      const multiplier = add(rational(1), divide(pct, rational(100)));
      answer = multiply(timeA, multiplier);
      formulaLatex = "T_B=T_A\\left(1+p/100\\right)";
      workedLatex = [
        `\\frac{E_A}{E_B}=1+\\frac{${toLatex(pct)}}{100}=${toLatex(multiplier)}`,
        `T_B=${toLatex(timeA)}\\times${toLatex(multiplier)}=${toLatex(answer)}`,
      ];
      break;
    }
    case "findTimePercentLessFromEfficiencyPercentMore": {
      const pct = required(p.percentAOverB, "percentAOverB");
      answer = percent(divide(pct, add(rational(100), pct)));
      formulaLatex = "\\%\\text{ less time}=\\frac{p}{100+p}\\times100";
      workedLatex = [`\\%\\text{ less time}=\\frac{${toLatex(pct)}}{100+${toLatex(pct)}}\\times100=${toLatex(answer)}\\%`];
      break;
    }
    case "findTimePercentMoreFromEfficiencyPercentLess": {
      const pct = required(p.percentAOverB, "percentAOverB");
      answer = percent(divide(pct, subtract(rational(100), pct)));
      formulaLatex = "\\%\\text{ more time}=\\frac{p}{100-p}\\times100";
      workedLatex = [`\\%\\text{ more time}=\\frac{${toLatex(pct)}}{100-${toLatex(pct)}}\\times100=${toLatex(answer)}\\%`];
      break;
    }
    case "findWorkRatioAtEqualTimeFromEfficiencyRatio": {
      answer = divide(p.efficiencyA, p.efficiencyB);
      formulaLatex = "W_A:W_B=E_A:E_B\\quad(\\text{equal time})";
      workedLatex = [`W_A:W_B=${ratioText(answer)}`];
      break;
    }
    case "findWorkRatioFromEfficiencyRatioAndUnequalTimes": {
      const durationA = required(p.durationA, "durationA");
      const durationB = required(p.durationB, "durationB");
      answer = divide(multiply(p.efficiencyA, durationA), multiply(p.efficiencyB, durationB));
      formulaLatex = "W_A:W_B=E_AT_A:E_BT_B";
      workedLatex = [`W_A:W_B=(${toLatex(p.efficiencyA)}\\times${toLatex(durationA)}):(${toLatex(p.efficiencyB)}\\times${toLatex(durationB)})=${ratioText(answer)}`];
      break;
    }
    case "findTimeRatioForUnequalWorkAndEfficiencyRatio": {
      const workA = required(p.workA, "workA");
      const workB = required(p.workB, "workB");
      answer = divide(multiply(workA, p.efficiencyB), multiply(workB, p.efficiencyA));
      formulaLatex = "T_A:T_B=\\frac{W_A}{E_A}:\\frac{W_B}{E_B}=W_AE_B:W_BE_A";
      workedLatex = [`T_A:T_B=(${toLatex(workA)}\\times${toLatex(p.efficiencyB)}):(${toLatex(workB)}\\times${toLatex(p.efficiencyA)})=${ratioText(answer)}`];
      break;
    }
    case "findEfficiencyRatioFromUnequalWorkAndTimes": {
      const workA = required(p.workA, "workA");
      const workB = required(p.workB, "workB");
      const timeA = required(p.timeA, "timeA");
      const timeB = required(p.timeB, "timeB");
      answer = divide(multiply(workA, timeB), multiply(workB, timeA));
      formulaLatex = "E_A:E_B=\\frac{W_A}{T_A}:\\frac{W_B}{T_B}=W_AT_B:W_BT_A";
      workedLatex = [`E_A:E_B=(${toLatex(workA)}\\times${toLatex(timeB)}):(${toLatex(workB)}\\times${toLatex(timeA)})=${ratioText(answer)}`];
      break;
    }
    case "findOutputFromEfficiencyRatioAndReferenceOutput": {
      const outputB = required(p.outputB, "outputB");
      answer = divide(multiply(outputB, p.efficiencyA), p.efficiencyB);
      formulaLatex = "Q_A=Q_B\\frac{E_A}{E_B}\\quad(\\text{equal time})";
      workedLatex = [`Q_A=${toLatex(outputB)}\\times\\frac{${toLatex(p.efficiencyA)}}{${toLatex(p.efficiencyB)}}=${toLatex(answer)}`];
      break;
    }
    case "findReferenceOutputFromEfficiencyRatioAndOtherOutput": {
      const outputA = required(p.outputA, "outputA");
      answer = divide(multiply(outputA, p.efficiencyB), p.efficiencyA);
      formulaLatex = "Q_B=Q_A\\frac{E_B}{E_A}\\quad(\\text{equal time})";
      workedLatex = [`Q_B=${toLatex(outputA)}\\times\\frac{${toLatex(p.efficiencyB)}}{${toLatex(p.efficiencyA)}}=${toLatex(answer)}`];
      break;
    }
    case "findIndividualTimeFromEfficiencyRatioAndCombinedTime": {
      const combinedTime = required(p.combinedTime, "combinedTime");
      const target = required(p.targetAgentIndex, "targetAgentIndex");
      const targetEfficiency = target === 0 ? p.efficiencyA : p.efficiencyB;
      const totalEfficiency = add(p.efficiencyA, p.efficiencyB);
      answer = divide(multiply(combinedTime, totalEfficiency), targetEfficiency);
      formulaLatex = `T_${agent(target)}=T_{AB}\\frac{E_A+E_B}{E_${agent(target)}}`;
      workedLatex = [
        `r_{AB}=\\frac{1}{${toLatex(combinedTime)}}`,
        `T_${agent(target)}=${toLatex(combinedTime)}\\times\\frac{${toLatex(totalEfficiency)}}{${toLatex(targetEfficiency)}}=${toLatex(answer)}`,
      ];
      break;
    }
    case "findIndividualTimeFromEfficiencyRatioAndTimeDifference": {
      const difference = required(p.timeDifference, "timeDifference");
      const target = required(p.targetAgentIndex, "targetAgentIndex");
      const timeRatioA = p.efficiencyB;
      const timeRatioB = p.efficiencyA;
      const scale = divide(difference, abs(subtract(timeRatioB, timeRatioA)));
      answer = multiply(target === 0 ? timeRatioA : timeRatioB, scale);
      formulaLatex = "T_A:T_B=E_B:E_A";
      workedLatex = [
        `T_A:T_B=${toLatex(timeRatioA)}:${toLatex(timeRatioB)}`,
        `k=\\frac{${toLatex(difference)}}{|${toLatex(timeRatioB)}-${toLatex(timeRatioA)}|}=${toLatex(scale)}`,
        `T_${agent(target)}=${toLatex(target === 0 ? timeRatioA : timeRatioB)}\\times${toLatex(scale)}=${toLatex(answer)}`,
      ];
      break;
    }
    case "findIndividualTimeFromEfficiencyRatioAndTimeSum": {
      const sum = required(p.timeSum, "timeSum");
      const target = required(p.targetAgentIndex, "targetAgentIndex");
      const timeRatioA = p.efficiencyB;
      const timeRatioB = p.efficiencyA;
      const scale = divide(sum, add(timeRatioA, timeRatioB));
      answer = multiply(target === 0 ? timeRatioA : timeRatioB, scale);
      formulaLatex = "T_A:T_B=E_B:E_A";
      workedLatex = [
        `T_A:T_B=${toLatex(timeRatioA)}:${toLatex(timeRatioB)}`,
        `k=\\frac{${toLatex(sum)}}{${toLatex(timeRatioA)}+${toLatex(timeRatioB)}}=${toLatex(scale)}`,
        `T_${agent(target)}=${toLatex(target === 0 ? timeRatioA : timeRatioB)}\\times${toLatex(scale)}=${toLatex(answer)}`,
      ];
      break;
    }
    case "findEfficiencyRatioFromOutputAndTimeComparison": {
      const outputA = required(p.outputA, "outputA");
      const outputB = required(p.outputB, "outputB");
      const durationA = required(p.durationA, "durationA");
      const durationB = required(p.durationB, "durationB");
      answer = divide(multiply(outputA, durationB), multiply(outputB, durationA));
      formulaLatex = "E_A:E_B=\\frac{Q_A}{T_A}:\\frac{Q_B}{T_B}=Q_AT_B:Q_BT_A";
      workedLatex = [`E_A:E_B=(${toLatex(outputA)}\\times${toLatex(durationB)}):(${toLatex(outputB)}\\times${toLatex(durationA)})=${ratioText(answer)}`];
      break;
    }
    case "findComparativeOutputFromDifferentEfficienciesAndDurations": {
      const outputB = required(p.outputB, "outputB");
      const durationA = required(p.durationA, "durationA");
      const durationB = required(p.durationB, "durationB");
      answer = divide(multiply(multiply(outputB, p.efficiencyA), durationA), multiply(p.efficiencyB, durationB));
      formulaLatex = "Q_A=Q_B\\frac{E_AT_A}{E_BT_B}";
      workedLatex = [`Q_A=${toLatex(outputB)}\\times\\frac{${toLatex(p.efficiencyA)}\\times${toLatex(durationA)}}{${toLatex(p.efficiencyB)}\\times${toLatex(durationB)}}=${toLatex(answer)}`];
      break;
    }
    case "findComparativeDurationFromDifferentWorkAndEfficiencies": {
      const workA = required(p.workA, "workA");
      const workB = required(p.workB, "workB");
      const timeB = required(p.timeB, "timeB");
      answer = divide(multiply(multiply(timeB, workA), p.efficiencyB), multiply(workB, p.efficiencyA));
      formulaLatex = "T_A=T_B\\frac{W_AE_B}{W_BE_A}";
      workedLatex = [`T_A=${toLatex(timeB)}\\times\\frac{${toLatex(workA)}\\times${toLatex(p.efficiencyB)}}{${toLatex(workB)}\\times${toLatex(p.efficiencyA)}}=${toLatex(answer)}`];
      break;
    }
    case "findSuccessiveEfficiencyRatioAcrossThreeAgents": {
      const efficiencyC = required(p.efficiencyC, "efficiencyC");
      const bOverC = reciprocal(efficiencyC);
      answer = divide(p.efficiencyA, efficiencyC);
      formulaLatex = "\\frac{E_A}{E_C}=\\frac{E_A}{E_B}\\times\\frac{E_B}{E_C}";
      workedLatex = [
        `\\frac{E_A}{E_C}=${toLatex(p.efficiencyA)}\\times${toLatex(bOverC)}=${toLatex(answer)}`,
        `E_A:E_C=${ratioText(answer)}`,
      ];
      break;
    }
    case "findSuccessiveEfficiencyPercentComparison": {
      const efficiencyC = required(p.efficiencyC, "efficiencyC");
      const finalRatio = divide(p.efficiencyA, efficiencyC);
      answer = percent(subtract(finalRatio, rational(1)));
      formulaLatex = "\\frac{E_A}{E_C}=\\left(1+\\frac{p}{100}\\right)\\left(1+\\frac{q}{100}\\right)";
      workedLatex = [
        `\\frac{E_A}{E_C}=${toLatex(finalRatio)}`,
        `\\%\\text{ more}=\\left(${toLatex(finalRatio)}-1\\right)\\times100=${toLatex(answer)}\\%`,
      ];
      break;
    }
    case "findEfficiencyChangePercentFromCompletionTimeChange": {
      const originalTime = required(p.originalTime, "originalTime");
      const changedTime = required(p.changedTime, "changedTime");
      const efficiencyRatio = divide(originalTime, changedTime);
      answer = percent(subtract(efficiencyRatio, rational(1)));
      formulaLatex = "\\%\\Delta E=\\left(\\frac{T_{old}}{T_{new}}-1\\right)\\times100";
      workedLatex = [
        `\\frac{E_{new}}{E_{old}}=\\frac{T_{old}}{T_{new}}=\\frac{${toLatex(originalTime)}}{${toLatex(changedTime)}}=${toLatex(efficiencyRatio)}`,
        `\\%\\Delta E=\\left(${toLatex(efficiencyRatio)}-1\\right)\\times100=${toLatex(answer)}\\%`,
      ];
      break;
    }
  }

  return { answer, answerType: entry.answerType, formulaLatex, workedLatex, answerText: answerText(entry, p, answer) };
}

export function verifyTmwCp003(entry: TmwCp003RegistryEntry, p: TmwCp003Parameters, solution: TmwCp003Solution): boolean {
  const a = solution.answer;
  switch (entry.solveMode) {
    case "findEfficiencyRatioFromEqualWorkTimes":
      return equals(multiply(a, required(p.timeA, "timeA")), required(p.timeB, "timeB"));
    case "findTimeRatioFromEfficiencyRatio":
      return equals(multiply(a, p.efficiencyA), p.efficiencyB);
    case "findEfficiencyPercentMoreFromCompletionTimes":
      return equals(add(rational(1), divide(a, rational(100))), divide(required(p.timeB, "timeB"), required(p.timeA, "timeA")));
    case "findEfficiencyPercentLessFromCompletionTimes":
      return equals(subtract(rational(1), divide(a, rational(100))), divide(required(p.timeB, "timeB"), required(p.timeA, "timeA")));
    case "findFasterTimeFromSlowerTimeAndPercentMoreEfficient":
      return equals(multiply(a, p.efficiencyA), multiply(required(p.timeB, "timeB"), p.efficiencyB));
    case "findSlowerTimeFromFasterTimeAndPercentMoreEfficient":
      return equals(multiply(required(p.timeA, "timeA"), p.efficiencyA), multiply(a, p.efficiencyB));
    case "findTimePercentLessFromEfficiencyPercentMore":
      return equals(subtract(rational(1), divide(a, rational(100))), divide(p.efficiencyB, p.efficiencyA));
    case "findTimePercentMoreFromEfficiencyPercentLess":
      return equals(add(rational(1), divide(a, rational(100))), divide(p.efficiencyB, p.efficiencyA));
    case "findWorkRatioAtEqualTimeFromEfficiencyRatio":
      return equals(multiply(a, p.efficiencyB), p.efficiencyA);
    case "findWorkRatioFromEfficiencyRatioAndUnequalTimes":
      return equals(multiply(a, multiply(p.efficiencyB, required(p.durationB, "durationB"))), multiply(p.efficiencyA, required(p.durationA, "durationA")));
    case "findTimeRatioForUnequalWorkAndEfficiencyRatio":
      return equals(multiply(a, multiply(required(p.workB, "workB"), p.efficiencyA)), multiply(required(p.workA, "workA"), p.efficiencyB));
    case "findEfficiencyRatioFromUnequalWorkAndTimes":
    case "findEfficiencyRatioFromOutputAndTimeComparison":
      return equals(a, divide(p.efficiencyA, p.efficiencyB));
    case "findOutputFromEfficiencyRatioAndReferenceOutput":
      return equals(multiply(a, p.efficiencyB), multiply(required(p.outputB, "outputB"), p.efficiencyA));
    case "findReferenceOutputFromEfficiencyRatioAndOtherOutput":
      return equals(multiply(a, p.efficiencyA), multiply(required(p.outputA, "outputA"), p.efficiencyB));
    case "findIndividualTimeFromEfficiencyRatioAndCombinedTime": {
      const target = required(p.targetAgentIndex, "targetAgentIndex");
      const other = target === 0 ? required(p.timeB, "timeB") : required(p.timeA, "timeA");
      return equals(add(reciprocal(a), reciprocal(other)), reciprocal(required(p.combinedTime, "combinedTime")));
    }
    case "findIndividualTimeFromEfficiencyRatioAndTimeDifference":
      return equals(a, required(p.targetAgentIndex, "targetAgentIndex") === 0 ? required(p.timeA, "timeA") : required(p.timeB, "timeB"));
    case "findIndividualTimeFromEfficiencyRatioAndTimeSum":
      return equals(a, required(p.targetAgentIndex, "targetAgentIndex") === 0 ? required(p.timeA, "timeA") : required(p.timeB, "timeB"));
    case "findComparativeOutputFromDifferentEfficienciesAndDurations":
      return equals(multiply(multiply(a, p.efficiencyB), required(p.durationB, "durationB")), multiply(multiply(required(p.outputB, "outputB"), p.efficiencyA), required(p.durationA, "durationA")));
    case "findComparativeDurationFromDifferentWorkAndEfficiencies":
      return equals(multiply(multiply(a, required(p.workB, "workB")), p.efficiencyA), multiply(multiply(required(p.timeB, "timeB"), required(p.workA, "workA")), p.efficiencyB));
    case "findSuccessiveEfficiencyRatioAcrossThreeAgents":
      return equals(multiply(a, required(p.efficiencyC, "efficiencyC")), p.efficiencyA);
    case "findSuccessiveEfficiencyPercentComparison":
      return equals(add(rational(1), divide(a, rational(100))), divide(p.efficiencyA, required(p.efficiencyC, "efficiencyC")));
    case "findEfficiencyChangePercentFromCompletionTimeChange":
      return equals(add(rational(1), divide(a, rational(100))), divide(required(p.originalTime, "originalTime"), required(p.changedTime, "changedTime")));
  }
}
