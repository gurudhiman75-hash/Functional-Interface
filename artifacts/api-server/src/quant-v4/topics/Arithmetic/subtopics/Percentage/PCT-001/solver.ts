import { formatFraction, formatNumber, formatPercent, formatRatio, mathJaxLine, percentOf, roundTo } from "./math";
import type { Pct001Parameters, Pct001SolverResult } from "./types";

function value(parameters: Pct001Parameters, name: string) {
  return Number(parameters.variables[name]);
}

function formatByAnswerType(parameters: Pct001Parameters, numericAnswer: number) {
  if (parameters.answerType === "PERCENT") return formatPercent(numericAnswer);
  if (parameters.answerType === "COUNT") return formatNumber(Math.round(numericAnswer));
  return formatNumber(numericAnswer);
}

export function solvePct001(parameters: Pct001Parameters): Pct001SolverResult {
  const t = parameters.taskKind;
  let numericAnswer: number | null = null;
  let answer = "";

  if (t === "percentOf" || t === "directRelation") numericAnswer = percentOf(value(parameters, "percentageRate"), value(parameters, "baseValue"));
  else if (t === "percentToFraction") answer = formatFraction(value(parameters, "percentageRate") * 100, 10000);
  else if (t === "valueAsPercent") numericAnswer = value(parameters, "value") / value(parameters, "baseValue") * 100;
  else if (t === "moreToLess") numericAnswer = value(parameters, "percentageRate") / (100 + value(parameters, "percentageRate")) * 100;
  else if (t === "lessToMore") numericAnswer = value(parameters, "percentageRate") / (100 - value(parameters, "percentageRate")) * 100;
  else if (t === "ratioFromPercentEquality") answer = formatRatio(value(parameters, "rate2"), value(parameters, "rate1"));
  else if (t === "reversePercent") numericAnswer = value(parameters, "value") * 100 / value(parameters, "percentageRate");
  else if (t === "increaseNewValue") numericAnswer = value(parameters, "baseValue") * (100 + value(parameters, "percentageRate")) / 100;
  else if (t === "decreaseNewValue") numericAnswer = value(parameters, "baseValue") * (100 - value(parameters, "percentageRate")) / 100;
  else if (t === "reverseIncrease") numericAnswer = value(parameters, "finalValue") * 100 / (100 + value(parameters, "percentageRate"));
  else if (t === "reverseDecrease") numericAnswer = value(parameters, "finalValue") * 100 / (100 - value(parameters, "percentageRate"));
  else if (t === "increaseByAmount") numericAnswer = value(parameters, "value") * 100 / value(parameters, "percentageRate");
  else if (t === "percentOfKnownNumber") numericAnswer = value(parameters, "value1") * value(parameters, "rate2") / value(parameters, "rate1");
  else if (t === "differenceOfPercents") numericAnswer = value(parameters, "value") * 100 / Math.abs(value(parameters, "rate1") - value(parameters, "rate2"));
  else if (t === "restoreAfterDecrease") numericAnswer = value(parameters, "percentageRate") * 100 / (100 - value(parameters, "percentageRate"));
  else if (t === "successiveIncrease") numericAnswer = ((1 + value(parameters, "rate1") / 100) * (1 + value(parameters, "rate2") / 100) - 1) * 100;
  else if (t === "successiveChange") numericAnswer = ((1 + value(parameters, "rate1") / 100) * (1 - value(parameters, "rate2") / 100) - 1) * 100;
  else if (t === "compoundGrowth") numericAnswer = value(parameters, "initialValue") * (1 + value(parameters, "percentageRate") / 100) ** 2;
  else if (t === "compoundDecay") numericAnswer = value(parameters, "initialValue") * (1 - value(parameters, "percentageRate") / 100) ** 2;
  else if (t === "areaChange") numericAnswer = ((1 + value(parameters, "rate1") / 100) * (1 + value(parameters, "rate2") / 100) - 1) * 100;
  else if (t === "squareAreaChange") numericAnswer = ((1 + value(parameters, "percentageRate") / 100) ** 2 - 1) * 100;
  else if (t === "invarianceDecrease" || t === "restoreAfterIncrease") numericAnswer = value(parameters, t === "restoreAfterIncrease" ? "rate1" : "percentageRate") * 100 / (100 + value(parameters, t === "restoreAfterIncrease" ? "rate1" : "percentageRate"));
  else if (t === "invarianceIncrease") numericAnswer = value(parameters, "percentageRate") * 100 / (100 - value(parameters, "percentageRate"));
  else if (t === "revenueChange") numericAnswer = ((1 - value(parameters, "rate1") / 100) * (1 + value(parameters, "rate2") / 100) - 1) * 100;
  else if (t === "circleAreaDecrease") numericAnswer = (1 - (1 - value(parameters, "percentageRate") / 100) ** 2) * 100;
  else if (t === "incomePartition") numericAnswer = value(parameters, "value") * 100 / (100 - value(parameters, "rate1") - value(parameters, "rate2") - value(parameters, "rate3"));
  else if (t === "successiveExpense") numericAnswer = value(parameters, "value") / ((1 - value(parameters, "rate1") / 100) * (1 - value(parameters, "rate2") / 100));
  else if (t === "winnerVotes") numericAnswer = value(parameters, "voteDifference") / ((2 * value(parameters, "percentageRate") - 100) / 100);
  else if (t === "cancelledVotes") numericAnswer = value(parameters, "voteDifference") / ((1 - value(parameters, "rate1") / 100) * ((2 * value(parameters, "rate2") - 100) / 100));
  else if (t === "passMarks") numericAnswer = (value(parameters, "marksObtained") + value(parameters, "failMargin")) * 100 / value(parameters, "passRate");
  else if (t === "partToTotal") numericAnswer = value(parameters, "value") * 100 / (100 - value(parameters, "rate1"));
  else if (t === "complementOfTotal") numericAnswer = value(parameters, "totalPopulation") * (100 - value(parameters, "percentageRate")) / 100;
  else if (t === "moreMarksBase") numericAnswer = value(parameters, "marks") * 100 / (100 + value(parameters, "rate1"));
  else if (t === "twoShareRemainder") numericAnswer = value(parameters, "value") * 100 / (100 - value(parameters, "rate1") - value(parameters, "rate2"));
  else if (t === "loserVotes") numericAnswer = value(parameters, "voteDifference") / ((100 - 2 * value(parameters, "rate1")) / 100);
  else if (t === "dilutionAddWater") numericAnswer = value(parameters, "totalMixture") * value(parameters, "percentageRate") / value(parameters, "newRate") - value(parameters, "totalMixture");
  else if (t === "dryFromFresh") numericAnswer = value(parameters, "totalQuantity") * (100 - value(parameters, "waterRate")) / (100 - value(parameters, "dryWaterRate"));
  else if (t === "addSolute" || t === "addPureComponent") numericAnswer = value(parameters, "totalMixture") * (value(parameters, "newRate") - value(parameters, "percentageRate")) / (100 - value(parameters, "newRate"));
  else if (t === "dilutedPercent") numericAnswer = value(parameters, "totalMixture") * value(parameters, "percentageRate") / (value(parameters, "totalMixture") + value(parameters, "value"));
  else if (t === "freshFromDry") numericAnswer = value(parameters, "value") * (100 - value(parameters, "rate2")) / (100 - value(parameters, "rate1"));
  else if (t === "evaporationOriginal") numericAnswer = value(parameters, "newRate") * value(parameters, "value") / (value(parameters, "newRate") - value(parameters, "percentageRate"));
  else if (t === "alloyComplement") numericAnswer = value(parameters, "totalWeight") * (100 - value(parameters, "percentageRate")) / 100;

  if (!answer) answer = formatByAnswerType(parameters, numericAnswer ?? 0);

  return {
    answer,
    numericAnswer: numericAnswer === null ? null : roundTo(numericAnswer, 4),
    answerType: parameters.answerType,
    evidence: { taskKind: t, answerType: parameters.answerType, answer },
    mathJax: {
      setupLatex: mathJaxLine("setup", `${t}`),
      calculationLatex: mathJaxLine("answer", answer),
    },
  };
}
