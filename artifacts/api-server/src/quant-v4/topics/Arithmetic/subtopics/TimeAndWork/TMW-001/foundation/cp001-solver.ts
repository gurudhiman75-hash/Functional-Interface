import { add, divide, equals, multiply, rational, reciprocal, subtract, toLatex } from "./rational";
import { answerText, percent, required } from "./cp001-helpers";
import type { TmwCp001Parameters, TmwCp001RegistryEntry, TmwCp001Solution } from "./types";

export function solveTmwCp001(entry: TmwCp001RegistryEntry, p: TmwCp001Parameters): TmwCp001Solution {
  let answer;
  let formulaLatex: string;
  let workedLatex: string[];

  switch (entry.solveMode) {
    case "findWorkFromRateAndTime":
    case "findOutputFromUnitRateAndTime":
      formulaLatex = "W=r\\times t";
      answer = multiply(p.rate, p.time);
      workedLatex = [`W=${toLatex(p.rate)}\\times${toLatex(p.time)}=${toLatex(answer)}`];
      break;
    case "findRateFromWorkAndTime":
    case "findRequiredRateForTargetCompletion":
      formulaLatex = "r=\\frac{W}{t}";
      answer = divide(p.totalWork, p.time);
      workedLatex = [`r=\\frac{${toLatex(p.totalWork)}}{${toLatex(p.time)}}=${toLatex(answer)}`];
      break;
    case "findTimeFromWorkAndRate":
      formulaLatex = "t=\\frac{W}{r}";
      answer = divide(p.totalWork, p.rate);
      workedLatex = [`t=\\frac{${toLatex(p.totalWork)}}{${toLatex(p.rate)}}=${toLatex(answer)}`];
      break;
    case "findOneUnitWorkFromCompletionTime": {
      const completion = reciprocal(p.rate);
      formulaLatex = "r=\\frac{1}{T}";
      answer = p.rate;
      workedLatex = [`T=${toLatex(completion)}\\;\\Rightarrow\\;r=\\frac{1}{T}=${toLatex(answer)}`];
      break;
    }
    case "findCompletionTimeFromOneUnitWork":
      formulaLatex = "T=\\frac{1}{r}";
      answer = reciprocal(p.rate);
      workedLatex = [`T=\\frac{1}{${toLatex(p.rate)}}=${toLatex(answer)}`];
      break;
    case "findFractionCompletedInGivenTime":
      formulaLatex = "W_{done}=r\\times t";
      answer = multiply(p.rate, p.time);
      workedLatex = [`W_{done}=${toLatex(p.rate)}\\times${toLatex(p.time)}=${toLatex(answer)}`];
      break;
    case "findPercentCompletedInGivenTime": {
      formulaLatex = "\\%W_{done}=r\\times t\\times100";
      const completed = multiply(p.rate, p.time);
      answer = percent(completed);
      workedLatex = [`W_{done}=${toLatex(p.rate)}\\times${toLatex(p.time)}=${toLatex(completed)}`, `\\%W_{done}=${toLatex(completed)}\\times100=${toLatex(answer)}\\%`];
      break;
    }
    case "findTimeForGivenFraction":
    case "findTimeForGivenPercent": {
      const target = required(p.requestedFraction, "requestedFraction");
      formulaLatex = "t=\\frac{W_{target}}{r}";
      answer = divide(target, p.rate);
      workedLatex = [];
      if (entry.solveMode === "findTimeForGivenPercent") workedLatex.push(`W_{target}=${toLatex(percent(target))}\\%=${toLatex(target)}`);
      workedLatex.push(`t=\\frac{${toLatex(target)}}{${toLatex(p.rate)}}=${toLatex(answer)}`);
      break;
    }
    case "findRemainingFractionAfterTime": {
      formulaLatex = "W_{remaining}=1-r\\times t";
      const completed = multiply(p.rate, p.time);
      answer = subtract(rational(1), completed);
      workedLatex = [`W_{done}=${toLatex(p.rate)}\\times${toLatex(p.time)}=${toLatex(completed)}`, `W_{remaining}=1-${toLatex(completed)}=${toLatex(answer)}`];
      break;
    }
    case "findRemainingPercentAfterTime": {
      formulaLatex = "\\%W_{remaining}=(1-r\\times t)\\times100";
      const completed = multiply(p.rate, p.time);
      const remaining = subtract(rational(1), completed);
      answer = percent(remaining);
      workedLatex = [`W_{remaining}=1-${toLatex(completed)}=${toLatex(remaining)}`, `\\%W_{remaining}=${toLatex(remaining)}\\times100=${toLatex(answer)}\\%`];
      break;
    }
    case "recoverWholeWorkFromPartAndFraction": {
      const partWork = required(p.partWork, "partWork");
      const fraction = required(p.requestedFraction, "requestedFraction");
      formulaLatex = "W_{whole}=\\frac{W_{part}}{f}";
      answer = divide(partWork, fraction);
      workedLatex = [`W_{whole}=\\frac{${toLatex(partWork)}}{${toLatex(fraction)}}=${toLatex(answer)}`];
      break;
    }
    case "recoverWholeTimeFromPartCompletion": {
      const partTime = required(p.partTime, "partTime");
      const fraction = required(p.requestedFraction, "requestedFraction");
      formulaLatex = "T_{whole}=\\frac{t_{part}}{f}";
      answer = divide(partTime, fraction);
      workedLatex = [`T_{whole}=\\frac{${toLatex(partTime)}}{${toLatex(fraction)}}=${toLatex(answer)}`];
      break;
    }
    case "convertRateAcrossTimeUnits": {
      const sourceDuration = required(p.sourceDuration, "sourceDuration");
      const targetDuration = required(p.targetDuration, "targetDuration");
      formulaLatex = "W_{target}=\\frac{W_{source}}{t_{source}}\\times t_{target}";
      const unitRate = divide(p.totalWork, sourceDuration);
      answer = multiply(unitRate, targetDuration);
      workedLatex = [`r=\\frac{${toLatex(p.totalWork)}}{${toLatex(sourceDuration)}}=${toLatex(unitRate)}`, `W_{target}=${toLatex(unitRate)}\\times${toLatex(targetDuration)}=${toLatex(answer)}`];
      break;
    }
    case "compareWorkCompletedAtEqualTime": {
      const secondaryRate = required(p.secondaryRate, "secondaryRate");
      formulaLatex = "\\Delta W=(r_1-r_2)t";
      const firstWork = multiply(p.rate, p.time);
      const secondWork = multiply(secondaryRate, p.time);
      answer = subtract(firstWork, secondWork);
      workedLatex = [`W_1=${toLatex(p.rate)}\\times${toLatex(p.time)}=${toLatex(firstWork)}`, `W_2=${toLatex(secondaryRate)}\\times${toLatex(p.time)}=${toLatex(secondWork)}`, `\\Delta W=${toLatex(firstWork)}-${toLatex(secondWork)}=${toLatex(answer)}`];
      break;
    }
    case "compareTimeForDifferentWorkAtSameRate": {
      const secondaryWork = required(p.secondaryWork, "secondaryWork");
      formulaLatex = "\\Delta t=\\frac{W_1-W_2}{r}";
      const firstTime = divide(p.totalWork, p.rate);
      const secondTime = divide(secondaryWork, p.rate);
      answer = subtract(firstTime, secondTime);
      workedLatex = [`t_1=\\frac{${toLatex(p.totalWork)}}{${toLatex(p.rate)}}=${toLatex(firstTime)}`, `t_2=\\frac{${toLatex(secondaryWork)}}{${toLatex(p.rate)}}=${toLatex(secondTime)}`, `\\Delta t=${toLatex(firstTime)}-${toLatex(secondTime)}=${toLatex(answer)}`];
      break;
    }
    case "findDelayFromReducedUniformRate": {
      const changePercent = required(p.changePercent, "changePercent");
      const originalTime = required(p.originalTime, "originalTime");
      const rateFactor = subtract(rational(1), divide(changePercent, rational(100)));
      formulaLatex = "t_{new}=\\frac{t_{old}}{1-p/100},\\qquad \\text{Delay}=t_{new}-t_{old}";
      const changedTime = divide(originalTime, rateFactor);
      answer = subtract(changedTime, originalTime);
      workedLatex = [`r_{new}=\\left(1-\\frac{${toLatex(changePercent)}}{100}\\right)r_{old}=${toLatex(rateFactor)}r_{old}`, `t_{new}=\\frac{${toLatex(originalTime)}}{${toLatex(rateFactor)}}=${toLatex(changedTime)}`, `\\text{Delay}=${toLatex(changedTime)}-${toLatex(originalTime)}=${toLatex(answer)}`];
      break;
    }
    case "findTimeSavedFromIncreasedUniformRate": {
      const changePercent = required(p.changePercent, "changePercent");
      const originalTime = required(p.originalTime, "originalTime");
      const rateFactor = add(rational(1), divide(changePercent, rational(100)));
      formulaLatex = "t_{new}=\\frac{t_{old}}{1+p/100},\\qquad \\text{Time saved}=t_{old}-t_{new}";
      const changedTime = divide(originalTime, rateFactor);
      answer = subtract(originalTime, changedTime);
      workedLatex = [`r_{new}=\\left(1+\\frac{${toLatex(changePercent)}}{100}\\right)r_{old}=${toLatex(rateFactor)}r_{old}`, `t_{new}=\\frac{${toLatex(originalTime)}}{${toLatex(rateFactor)}}=${toLatex(changedTime)}`, `\\text{Time saved}=${toLatex(originalTime)}-${toLatex(changedTime)}=${toLatex(answer)}`];
      break;
    }
  }

  return { answer, answerType: entry.answerType, formulaLatex, workedLatex, answerText: answerText(entry, p, answer) };
}

export function verifyTmwCp001(entry: TmwCp001RegistryEntry, p: TmwCp001Parameters, solution: TmwCp001Solution): boolean {
  switch (entry.solveMode) {
    case "findWorkFromRateAndTime":
    case "findOutputFromUnitRateAndTime": return equals(solution.answer, multiply(p.rate, p.time));
    case "findRateFromWorkAndTime":
    case "findRequiredRateForTargetCompletion": return equals(multiply(solution.answer, p.time), p.totalWork);
    case "findTimeFromWorkAndRate": return equals(multiply(solution.answer, p.rate), p.totalWork);
    case "findOneUnitWorkFromCompletionTime": return equals(multiply(solution.answer, reciprocal(p.rate)), rational(1));
    case "findCompletionTimeFromOneUnitWork": return equals(multiply(solution.answer, p.rate), rational(1));
    case "findFractionCompletedInGivenTime": return equals(solution.answer, multiply(p.rate, p.time));
    case "findPercentCompletedInGivenTime": return equals(divide(solution.answer, rational(100)), multiply(p.rate, p.time));
    case "findTimeForGivenFraction":
    case "findTimeForGivenPercent": return equals(multiply(solution.answer, p.rate), required(p.requestedFraction, "requestedFraction"));
    case "findRemainingFractionAfterTime": return equals(add(solution.answer, multiply(p.rate, p.time)), rational(1));
    case "findRemainingPercentAfterTime": return equals(add(divide(solution.answer, rational(100)), multiply(p.rate, p.time)), rational(1));
    case "recoverWholeWorkFromPartAndFraction": return equals(multiply(solution.answer, required(p.requestedFraction, "requestedFraction")), required(p.partWork, "partWork"));
    case "recoverWholeTimeFromPartCompletion": return equals(multiply(solution.answer, required(p.requestedFraction, "requestedFraction")), required(p.partTime, "partTime"));
    case "convertRateAcrossTimeUnits": return equals(divide(solution.answer, required(p.targetDuration, "targetDuration")), divide(p.totalWork, required(p.sourceDuration, "sourceDuration")));
    case "compareWorkCompletedAtEqualTime": return equals(solution.answer, multiply(subtract(p.rate, required(p.secondaryRate, "secondaryRate")), p.time));
    case "compareTimeForDifferentWorkAtSameRate": return equals(solution.answer, divide(subtract(p.totalWork, required(p.secondaryWork, "secondaryWork")), p.rate));
    case "findDelayFromReducedUniformRate": {
      const changeFraction = divide(required(p.changePercent, "changePercent"), rational(100));
      const expectedNewTime = divide(required(p.originalTime, "originalTime"), subtract(rational(1), changeFraction));
      return equals(add(solution.answer, required(p.originalTime, "originalTime")), expectedNewTime);
    }
    case "findTimeSavedFromIncreasedUniformRate": {
      const changeFraction = divide(required(p.changePercent, "changePercent"), rational(100));
      const expectedNewTime = divide(required(p.originalTime, "originalTime"), add(rational(1), changeFraction));
      return equals(subtract(required(p.originalTime, "originalTime"), solution.answer), expectedNewTime);
    }
  }
}
