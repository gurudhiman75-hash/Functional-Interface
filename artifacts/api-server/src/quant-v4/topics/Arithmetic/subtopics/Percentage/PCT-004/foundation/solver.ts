import { formatNumber, formatPercent, mathJaxBlock, retainedFactor, wrapAnswer } from "./math";
import type { Pct004Parameters, Pct004SolverResult } from "./types";

function value(parameters: Pct004Parameters, name: string) {
  return Number(parameters.variables[name]);
}

function formatByAnswerType(answerType: string, numericAnswer: number) {
  if (answerType === "PERCENT") return formatPercent(numericAnswer);
  if (answerType === "COUNT") return formatNumber(Math.round(numericAnswer));
  return formatNumber(numericAnswer);
}

export function solvePct004(parameters: Pct004Parameters): Pct004SolverResult {
  const taskKind = parameters.taskKind;
  let numericAnswer: number | null = null;

  if (taskKind === "directPercentageDecrease") {
    numericAnswer = value(parameters, "originalValue") * retainedFactor(value(parameters, "decreaseRate"));
  } else if (taskKind === "decreaseAmount") {
    numericAnswer = value(parameters, "originalValue") * value(parameters, "decreaseRate") / 100;
  } else if (taskKind === "originalValueFromDecreasedValue") {
    numericAnswer = value(parameters, "decreasedValue") * 100 / (100 - value(parameters, "decreaseRate"));
  } else if (taskKind === "decreaseMultiplier") {
    numericAnswer = retainedFactor(value(parameters, "decreaseRate"));
  } else if (taskKind === "successiveDecrease") {
    numericAnswer =
      value(parameters, "originalValue") *
      retainedFactor(value(parameters, "rate1")) *
      retainedFactor(value(parameters, "rate2"));
  } else if (taskKind === "netPercentageDecrease") {
    numericAnswer =
      (1 - retainedFactor(value(parameters, "rate1")) * retainedFactor(value(parameters, "rate2"))) * 100;
  } else if (taskKind === "comparativeDecrease") {
    const newA = value(parameters, "originalA") * retainedFactor(value(parameters, "rateA"));
    const newB = value(parameters, "originalB") * retainedFactor(value(parameters, "rateB"));
    numericAnswer = Math.abs(newA - newB);
  } else if (taskKind === "componentWiseDecrease") {
    const totalValue = value(parameters, "totalValue");
    const partRate = value(parameters, "partRate");
    const initialPartValue = totalValue * partRate / 100;
    const initialOtherValue = totalValue - initialPartValue;
    const newPartValue = initialPartValue * retainedFactor(value(parameters, "partDecreaseRate"));
    const newOtherValue = initialOtherValue * retainedFactor(value(parameters, "otherDecreaseRate"));
    numericAnswer = newPartValue * 100 / (newPartValue + newOtherValue);
  } else if (taskKind === "requiredDecrease") {
    numericAnswer =
      (value(parameters, "currentValue") - value(parameters, "targetValue")) * 100 / value(parameters, "currentValue");
  } else if (taskKind === "percentageDecreaseBridge") {
    numericAnswer =
      value(parameters, "currentValue") *
      retainedFactor(value(parameters, "decreaseRate")) ** value(parameters, "periodCount");
  }

  const rawAnswer = formatByAnswerType(parameters.answerType, numericAnswer ?? 0);
  const answer = wrapAnswer(parameters.answerType, rawAnswer);

  const decreaseRate = value(parameters, "decreaseRate");
  const rate1 = value(parameters, "rate1");
  const rate2 = value(parameters, "rate2");
  const originalValue = value(parameters, "originalValue");
  const currentValue = value(parameters, "currentValue");
  const targetValue = value(parameters, "targetValue");
  const partRate = value(parameters, "partRate");
  const totalValue = value(parameters, "totalValue");
  const initialPartValue = totalValue * partRate / 100;
  const initialOtherValue = totalValue - initialPartValue;
  const partDecreaseRate = value(parameters, "partDecreaseRate");
  const otherDecreaseRate = value(parameters, "otherDecreaseRate");
  const newPartValue = initialPartValue * retainedFactor(partDecreaseRate);
  const newOtherValue = initialOtherValue * retainedFactor(otherDecreaseRate);
  const originalA = value(parameters, "originalA");
  const rateA = value(parameters, "rateA");
  const originalB = value(parameters, "originalB");
  const rateB = value(parameters, "rateB");
  const newA = originalA * retainedFactor(rateA);
  const newB = originalB * retainedFactor(rateB);

  return {
    answer,
    numericAnswer,
    answerType: parameters.answerType,
    evidence: {
      ...parameters.variables,
      taskKind,
      answerType: parameters.answerType,
      numericAnswer: numericAnswer ?? "",
      remainingPercent: 100 - decreaseRate,
      multiplier: retainedFactor(decreaseRate),
      decreaseAmount: originalValue * decreaseRate / 100,
      onePercentValue:
        taskKind === "originalValueFromDecreasedValue"
          ? value(parameters, "decreasedValue") / (100 - decreaseRate)
          : "",
      afterFirstValue:
        taskKind === "successiveDecrease"
          ? value(parameters, "originalValue") * retainedFactor(rate1)
          : "",
      netPercent:
        taskKind === "netPercentageDecrease"
          ? (1 - retainedFactor(rate1) * retainedFactor(rate2)) * 100
          : "",
      newA,
      newB,
      difference: Math.abs(newA - newB),
      initialPartValue,
      initialOtherValue,
      newPartValue,
      newOtherValue,
      newTotalValue: newPartValue + newOtherValue,
      neededReduction: currentValue - targetValue,
      retainedFactor: retainedFactor(value(parameters, "decreaseRate")),
      answer,
    },
    mathJax: {
      setupLatex: mathJaxBlock(String(taskKind)),
      calculationLatex: mathJaxBlock(rawAnswer.replace("%", "\\%")),
    },
  };
}
