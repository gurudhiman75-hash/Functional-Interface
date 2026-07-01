import {
  comparisonText,
  differenceAsText,
  formatNumber,
  formatPercent,
  percentMultiplier,
  relativeChangePercent,
  reverseBasePercent,
  selectedBasePercent,
  wrapAnswer,
} from "./math";
import type { Pct006Parameters, Pct006SolverResult } from "./types";

function asNumber(parameters: Pct006Parameters, key: string) {
  return Number(parameters.variables[key] ?? 0);
}

function asString(parameters: Pct006Parameters, key: string, fallback = "") {
  return String(parameters.variables[key] ?? fallback);
}

function absoluteText(parameters: Pct006Parameters, numeric: number) {
  return differenceAsText(
    numeric,
    asString(parameters, "valuePrefix"),
    asString(parameters, "unitLabel"),
  );
}

export function solvePct006(parameters: Pct006Parameters): Pct006SolverResult {
  const evidence: Record<string, string | number> = {
    taskKind: parameters.taskKind,
    solveMode: parameters.solveMode,
  };
  const mathJax: Record<string, string> = {};

  switch (parameters.taskKind) {
    case "directMoreThanComparison": {
      const rate = asNumber(parameters, "percentageRate");
      const given = asNumber(parameters, "baseValue");
      const multiplier = percentMultiplier("more", rate);
      const base = parameters.solveMode === "moreFindBase" ? given / multiplier : given;
      const greater = base * multiplier;
      const difference = greater - base;
      evidence.multiplier = multiplier;
      evidence.base = base;
      evidence.greater = greater;
      evidence.difference = difference;
      mathJax.core = `${formatNumber(base)}\\times${formatNumber(multiplier)}=${formatNumber(greater)}`;

      if (parameters.solveMode === "moreFindBase") {
        const raw = absoluteText(parameters, base);
        return { answer: wrapAnswer("ABSOLUTE", formatNumber(base)), numericAnswer: base, answerType: parameters.answerType, evidence, mathJax };
      }
      if (parameters.solveMode === "moreFindDifference") {
        return { answer: wrapAnswer("ABSOLUTE", formatNumber(difference)), numericAnswer: difference, answerType: parameters.answerType, evidence, mathJax };
      }
      return { answer: wrapAnswer("ABSOLUTE", formatNumber(greater)), numericAnswer: greater, answerType: parameters.answerType, evidence, mathJax };
    }
    case "directLessThanComparison": {
      const rate = asNumber(parameters, "percentageRate");
      const given = asNumber(parameters, "baseValue");
      const multiplier = percentMultiplier("less", rate);
      const higher = parameters.solveMode === "lessFindBase" ? given / multiplier : given;
      const lower = higher * multiplier;
      const difference = higher - lower;
      evidence.multiplier = multiplier;
      evidence.higher = higher;
      evidence.lower = lower;
      evidence.difference = difference;
      mathJax.core = `${formatNumber(higher)}\\times${formatNumber(multiplier)}=${formatNumber(lower)}`;

      if (parameters.solveMode === "lessFindBase") {
        return { answer: wrapAnswer("ABSOLUTE", formatNumber(higher)), numericAnswer: higher, answerType: parameters.answerType, evidence, mathJax };
      }
      if (parameters.solveMode === "lessFindDifference") {
        return { answer: wrapAnswer("ABSOLUTE", formatNumber(difference)), numericAnswer: difference, answerType: parameters.answerType, evidence, mathJax };
      }
      return { answer: wrapAnswer("ABSOLUTE", formatNumber(lower)), numericAnswer: lower, answerType: parameters.answerType, evidence, mathJax };
    }
    case "reverseBaseSwitchingComparison": {
      const rate = asNumber(parameters, "percentageRate");
      const reverse = reverseBasePercent(parameters.solveMode === "reverseLessFromMore" ? "more" : "less", rate);
      evidence.rate = rate;
      evidence.reverse = reverse;
      mathJax.core =
        parameters.solveMode === "reverseLessFromMore"
          ? `\\frac{${formatNumber(rate)}}{${formatNumber(100 + rate)}}\\times100=${formatNumber(reverse)}\\%`
          : `\\frac{${formatNumber(rate)}}{${formatNumber(100 - rate)}}\\times100=${formatNumber(reverse)}\\%`;
      return { answer: wrapAnswer("PERCENT", formatPercent(reverse)), numericAnswer: reverse, answerType: parameters.answerType, evidence, mathJax };
    }
    case "differenceAsPercentageOfSelectedBase": {
      const value1 = asNumber(parameters, "value1");
      const value2 = asNumber(parameters, "value2");
      const larger = Math.max(value1, value2);
      const smaller = Math.min(value1, value2);
      const difference = larger - smaller;
      const percent =
        parameters.solveMode === "differenceAsPercentOfFirst"
          ? selectedBasePercent(difference, value1)
          : parameters.solveMode === "differenceAsPercentOfSecond"
            ? selectedBasePercent(difference, value2)
            : parameters.solveMode === "largerMoreThanSmaller"
              ? selectedBasePercent(difference, smaller)
              : selectedBasePercent(difference, larger);
      evidence.value1 = value1;
      evidence.value2 = value2;
      evidence.difference = difference;
      evidence.percent = percent;
      mathJax.core = `\\frac{${formatNumber(difference)}}{\\text{base}}\\times100=${formatNumber(percent)}\\%`;
      return { answer: wrapAnswer("PERCENT", formatPercent(percent)), numericAnswer: percent, answerType: parameters.answerType, evidence, mathJax };
    }
    case "ratioBasedPercentageComparison": {
      const ratioA = asNumber(parameters, "ratioA");
      const ratioB = asNumber(parameters, "ratioB");
      const difference = Math.abs(ratioA - ratioB);
      const percent =
        parameters.solveMode === "ratioMoreThan"
          ? selectedBasePercent(difference, ratioB)
          : selectedBasePercent(difference, ratioA);
      evidence.ratioA = ratioA;
      evidence.ratioB = ratioB;
      evidence.percent = percent;
      mathJax.core =
        parameters.solveMode === "ratioMoreThan"
          ? `\\frac{${formatNumber(ratioA - ratioB)}}{${formatNumber(ratioB)}}\\times100=${formatNumber(percent)}\\%`
          : `\\frac{${formatNumber(ratioA - ratioB)}}{${formatNumber(ratioA)}}\\times100=${formatNumber(percent)}\\%`;
      return { answer: wrapAnswer("PERCENT", formatPercent(percent)), numericAnswer: percent, answerType: parameters.answerType, evidence, mathJax };
    }
    case "requiredPercentageChangeToMatchTarget": {
      const value1 = asNumber(parameters, "value1");
      const value2 = asNumber(parameters, "value2");
      const percent =
        parameters.solveMode === "requiredIncreaseToTarget"
          ? selectedBasePercent(value2 - value1, value1)
          : selectedBasePercent(value1 - value2, value1);
      evidence.value1 = value1;
      evidence.value2 = value2;
      evidence.percent = percent;
      mathJax.core = `\\frac{\\text{target difference}}{${formatNumber(value1)}}\\times100=${formatNumber(percent)}\\%`;
      return { answer: wrapAnswer("PERCENT", formatPercent(percent)), numericAnswer: percent, answerType: parameters.answerType, evidence, mathJax };
    }
    case "compareAfterDifferentPercentageChanges": {
      const value1 = asNumber(parameters, "value1");
      const value2 = asNumber(parameters, "value2");
      const rate1 = asNumber(parameters, "rate1");
      const rate2 = asNumber(parameters, "rate2");
      const direction1 = parameters.solveMode === "compareFinalBothDecrease" || parameters.solveMode === "compareFinalADownBUp" ? "less" : "more";
      const direction2 = parameters.solveMode === "compareFinalBothIncrease" || parameters.solveMode === "compareFinalADownBUp" ? "more" : "less";
      const final1 = value1 * percentMultiplier(direction1, rate1);
      const final2 = value2 * percentMultiplier(direction2, rate2);
      const subjectA = asString(parameters, "subjectA", "A");
      const subjectB = asString(parameters, "subjectB", "B");
      const difference = Math.abs(final1 - final2);
      const direction = final1 === final2 ? "equal" : final1 > final2 ? "more" : "less";
      evidence.value1 = value1;
      evidence.value2 = value2;
      evidence.final1 = final1;
      evidence.final2 = final2;
      evidence.difference = difference;
      evidence.direction = direction;
      mathJax.core = `${formatNumber(final1)}\\text{ vs }${formatNumber(final2)}`;
      const answer =
        direction === "equal"
          ? `${subjectA} and ${subjectB} are equal after the change.`
          : comparisonText(subjectA, subjectB, direction, absoluteText(parameters, difference), "absolute");
      return { answer, numericAnswer: direction === "equal" ? 0 : difference, answerType: parameters.answerType, evidence, mathJax };
    }
    case "chainPercentageComparison": {
      const rate1 = asNumber(parameters, "rate1");
      const rate2 = asNumber(parameters, "rate2");
      const factorAB =
        parameters.solveMode === "chainABelow_BAboveC" || parameters.solveMode === "chainABelow_BBelowC"
          ? percentMultiplier("less", rate1)
          : percentMultiplier("more", rate1);
      const factorBC =
        parameters.solveMode === "chainAAboveB_BBelowC" || parameters.solveMode === "chainABelow_BBelowC"
          ? percentMultiplier("less", rate2)
          : percentMultiplier("more", rate2);
      const factorAC = factorAB * factorBC;
      const subjectA = asString(parameters, "subjectA", "A");
      const subjectC = asString(parameters, "subjectC", "C");
      const direction = factorAC === 1 ? "equal" : factorAC > 1 ? "more" : "less";
      const percent = Math.abs((factorAC - 1) * 100);
      evidence.factorAB = factorAB;
      evidence.factorBC = factorBC;
      evidence.factorAC = factorAC;
      evidence.percent = percent;
      evidence.direction = direction;
      mathJax.core = `${formatNumber(factorAB)}\\times${formatNumber(factorBC)}=${formatNumber(factorAC)}`;
      const answer =
        direction === "equal"
          ? `${subjectA} and ${subjectC} are equal.`
          : comparisonText(subjectA, subjectC, direction, formatPercent(percent), "percent");
      return { answer, numericAnswer: direction === "equal" ? 0 : percent, answerType: parameters.answerType, evidence, mathJax };
    }
    case "percentagePointsVsPercentageChange": {
      const oldRate = asNumber(parameters, "oldRate");
      const newRate = asNumber(parameters, "newRate");
      const pointDifference = newRate - oldRate;
      const relativePercent = relativeChangePercent(oldRate, newRate);
      evidence.oldRate = oldRate;
      evidence.newRate = newRate;
      evidence.pointDifference = pointDifference;
      evidence.relativePercent = relativePercent;
      mathJax.core = `\\frac{${formatNumber(newRate - oldRate)}}{${formatNumber(oldRate)}}\\times100=${formatNumber(relativePercent)}\\%`;
      if (parameters.solveMode === "percentagePointDifferenceOnly") {
        return {
          answer: `${formatNumber(pointDifference)} percentage points`,
          numericAnswer: pointDifference,
          answerType: parameters.answerType,
          evidence,
          mathJax,
        };
      }
      if (parameters.solveMode === "relativePercentageChangeOnly") {
        return {
          answer: wrapAnswer("PERCENT", formatPercent(relativePercent)),
          numericAnswer: relativePercent,
          answerType: parameters.answerType,
          evidence,
          mathJax,
        };
      }
      return {
        answer: `${formatNumber(pointDifference)} percentage points and ${formatPercent(relativePercent)}`,
        numericAnswer: relativePercent,
        answerType: parameters.answerType,
        evidence,
        mathJax,
      };
    }
    case "crossBasePercentageComparison": {
      const rate1 = asNumber(parameters, "rate1");
      const rate2 = asNumber(parameters, "rate2");
      const baseValue1 = asNumber(parameters, "baseValue1");
      const baseValue2 = asNumber(parameters, "baseValue2");
      const actual1 = (baseValue1 * rate1) / 100;
      const actual2 = (baseValue2 * rate2) / 100;
      const subjectA = asString(parameters, "subjectA", "A");
      const subjectB = asString(parameters, "subjectB", "B");
      const difference = Math.abs(actual1 - actual2);
      const direction = actual1 === actual2 ? "equal" : actual1 > actual2 ? "more" : "less";
      const higher = Math.max(actual1, actual2);
      const lower = Math.min(actual1, actual2);
      const percent = lower === 0 ? 0 : selectedBasePercent(higher - lower, lower);
      evidence.actual1 = actual1;
      evidence.actual2 = actual2;
      evidence.difference = difference;
      evidence.percent = percent;
      evidence.direction = direction;
      mathJax.core = `${formatNumber(actual1)}\\text{ vs }${formatNumber(actual2)}`;

      if (parameters.solveMode === "crossBaseDifferenceOnly") {
        return {
          answer: wrapAnswer("ABSOLUTE", formatNumber(difference)),
          numericAnswer: difference,
          answerType: parameters.answerType,
          evidence,
          mathJax,
        };
      }
      if (parameters.solveMode === "crossBasePercentMore") {
        return {
          answer: wrapAnswer("PERCENT", formatPercent(percent)),
          numericAnswer: percent,
          answerType: parameters.answerType,
          evidence,
          mathJax,
        };
      }
      const answer =
        direction === "equal"
          ? `${subjectA} and ${subjectB} have the same actual value.`
          : comparisonText(subjectA, subjectB, direction, absoluteText(parameters, difference), "absolute");
      return { answer, numericAnswer: difference, answerType: parameters.answerType, evidence, mathJax };
    }
  }
}
