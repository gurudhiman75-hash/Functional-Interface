import { formatNumber, formatPercent, growthFactor, mathJaxBlock, wrapAnswer } from "./math";
import type { Pct003Parameters, Pct003SolverResult } from "./types";

function value(parameters: Pct003Parameters, name: string) {
  return Number(parameters.variables[name]);
}

function formatByAnswerType(answerType: string, numericAnswer: number) {
  if (answerType === "PERCENT") return formatPercent(numericAnswer);
  if (answerType === "COUNT") return formatNumber(Math.round(numericAnswer));
  return formatNumber(numericAnswer);
}

export function solvePct003(parameters: Pct003Parameters): Pct003SolverResult {
  const taskKind = parameters.taskKind;
  let numericAnswer: number | null = null;

  if (taskKind === "directPercentageIncrease") {
    numericAnswer = value(parameters, "originalValue") * growthFactor(value(parameters, "increaseRate"));
  } else if (taskKind === "increaseAmount") {
    numericAnswer = value(parameters, "originalValue") * value(parameters, "increaseRate") / 100;
  } else if (taskKind === "originalValueFromIncreasedValue") {
    numericAnswer = value(parameters, "increasedValue") * 100 / (100 + value(parameters, "increaseRate"));
  } else if (taskKind === "equivalentMultiplier") {
    numericAnswer = growthFactor(value(parameters, "increaseRate"));
  } else if (taskKind === "repeatedPercentageIncrease") {
    numericAnswer =
      value(parameters, "originalValue") *
      growthFactor(value(parameters, "rate1")) *
      growthFactor(value(parameters, "rate2"));
  } else if (taskKind === "netIncreasePercentage") {
    numericAnswer =
      (growthFactor(value(parameters, "rate1")) * growthFactor(value(parameters, "rate2")) - 1) * 100;
  } else if (taskKind === "comparativeIncrease") {
    const newA = value(parameters, "originalA") * growthFactor(value(parameters, "rateA"));
    const newB = value(parameters, "originalB") * growthFactor(value(parameters, "rateB"));
    numericAnswer = Math.abs(newA - newB);
  } else if (taskKind === "percentageIncreaseInParts") {
    const totalValue = value(parameters, "totalValue");
    const partRate = value(parameters, "partRate");
    const initialPartValue = totalValue * partRate / 100;
    const initialOtherValue = totalValue - initialPartValue;
    const newPartValue = initialPartValue * growthFactor(value(parameters, "partIncreaseRate"));
    const newOtherValue = initialOtherValue * growthFactor(value(parameters, "otherIncreaseRate"));
    numericAnswer = newPartValue * 100 / (newPartValue + newOtherValue);
  } else if (taskKind === "requiredIncrease") {
    numericAnswer =
      (value(parameters, "targetValue") - value(parameters, "currentValue")) * 100 / value(parameters, "currentValue");
  } else if (taskKind === "growthBridge") {
    numericAnswer =
      value(parameters, "currentValue") *
      growthFactor(value(parameters, "growthRate")) ** value(parameters, "periodCount");
  }

  const rawAnswer = formatByAnswerType(parameters.answerType, numericAnswer ?? 0);
  const answer = wrapAnswer(parameters.answerType, rawAnswer);

  const increaseRate = value(parameters, "increaseRate");
  const rate1 = value(parameters, "rate1");
  const rate2 = value(parameters, "rate2");
  const originalValue = value(parameters, "originalValue");
  const currentValue = value(parameters, "currentValue");
  const targetValue = value(parameters, "targetValue");
  const partRate = value(parameters, "partRate");
  const totalValue = value(parameters, "totalValue");
  const initialPartValue = totalValue * partRate / 100;
  const initialOtherValue = totalValue - initialPartValue;
  const partIncreaseRate = value(parameters, "partIncreaseRate");
  const otherIncreaseRate = value(parameters, "otherIncreaseRate");
  const newPartValue = initialPartValue * growthFactor(partIncreaseRate);
  const newOtherValue = initialOtherValue * growthFactor(otherIncreaseRate);
  const originalA = value(parameters, "originalA");
  const rateA = value(parameters, "rateA");
  const originalB = value(parameters, "originalB");
  const rateB = value(parameters, "rateB");
  const newA = originalA * growthFactor(rateA);
  const newB = originalB * growthFactor(rateB);

  return {
    answer,
    numericAnswer,
    answerType: parameters.answerType,
    evidence: {
      ...parameters.variables,
      taskKind,
      answerType: parameters.answerType,
      numericAnswer: numericAnswer ?? "",
      newPercent: 100 + increaseRate,
      multiplier: growthFactor(increaseRate),
      increaseAmount: originalValue * increaseRate / 100,
      onePercentValue:
        taskKind === "originalValueFromIncreasedValue"
          ? value(parameters, "increasedValue") / (100 + increaseRate)
          : "",
      afterFirstValue:
        taskKind === "repeatedPercentageIncrease"
          ? value(parameters, "originalValue") * growthFactor(rate1)
          : "",
      netPercent:
        taskKind === "netIncreasePercentage"
          ? (growthFactor(rate1) * growthFactor(rate2) - 1) * 100
          : "",
      newA,
      newB,
      difference: Math.abs(newA - newB),
      initialPartValue,
      initialOtherValue,
      newPartValue,
      newOtherValue,
      newTotalValue: newPartValue + newOtherValue,
      neededAmount: targetValue - currentValue,
      growthFactor: growthFactor(value(parameters, "growthRate")),
      answer,
    },
    mathJax: {
      setupLatex: mathJaxBlock(String(taskKind)),
      calculationLatex: mathJaxBlock(rawAnswer.replace("%", "\\%")),
    },
  };
}
