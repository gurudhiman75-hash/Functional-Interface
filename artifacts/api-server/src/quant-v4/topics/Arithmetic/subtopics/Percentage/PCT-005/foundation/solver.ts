import { formatNumber, formatPercent, mathJaxBlock, stageFactor, stagePercent, wrapAnswer } from "./math";
import type { Pct005Direction, Pct005Parameters, Pct005SolverResult } from "./types";

function value(parameters: Pct005Parameters, name: string) {
  return Number(parameters.variables[name]);
}

function text(parameters: Pct005Parameters, name: string) {
  return String(parameters.variables[name] ?? "");
}

function direction(parameters: Pct005Parameters, name: string, fallback: Pct005Direction = "increase"): Pct005Direction {
  const value = text(parameters, name);
  return value === "decrease" ? "decrease" : fallback;
}

function formatByAnswerType(answerType: string, numericAnswer: number) {
  if (answerType === "PERCENT") return formatPercent(numericAnswer);
  if (answerType === "COUNT") return formatNumber(numericAnswer);
  return formatNumber(numericAnswer);
}

function stageMeta(directionValue: Pct005Direction, rate: number) {
  return {
    direction: directionValue,
    rate,
    percent: stagePercent(directionValue, rate),
    factor: stageFactor(directionValue, rate),
  };
}

function product(items: number[]) {
  return items.reduce((acc, item) => acc * item, 1);
}

export function solvePct005(parameters: Pct005Parameters): Pct005SolverResult {
  const taskKind = parameters.taskKind;
  let numericAnswer: number | null = null;

  const d1 = direction(parameters, "direction1", taskKind === "successiveDecrease" || taskKind === "decreaseThenIncrease" ? "decrease" : "increase");
  const d2 = direction(parameters, "direction2", taskKind === "successiveDecrease" || taskKind === "increaseThenDecrease" ? "decrease" : "increase");
  const r1 = value(parameters, "rate1");
  const r2 = value(parameters, "rate2");
  const stage1 = stageMeta(d1, r1);
  const stage2 = stageMeta(d2, r2);
  const combinedFactor = stage1.factor * stage2.factor;

  if (taskKind === "successiveIncrease") {
    numericAnswer = value(parameters, "originalValue") * combinedFactor;
  } else if (taskKind === "successiveDecrease") {
    numericAnswer = value(parameters, "originalValue") * combinedFactor;
  } else if (taskKind === "increaseThenDecrease") {
    numericAnswer = value(parameters, "originalValue") * combinedFactor;
  } else if (taskKind === "decreaseThenIncrease") {
    numericAnswer = value(parameters, "originalValue") * combinedFactor;
  } else if (taskKind === "netPercentageChange") {
    numericAnswer = (combinedFactor - 1) * 100;
  } else if (taskKind === "equivalentSingleMultiplier") {
    numericAnswer = combinedFactor;
  } else if (taskKind === "reverseSuccessiveChange") {
    numericAnswer = value(parameters, "finalValue") / combinedFactor;
  } else if (taskKind === "comparativeSuccessiveChange") {
    const factorA = product([
      stageFactor(direction(parameters, "directionA1"), value(parameters, "rateA1")),
      stageFactor(direction(parameters, "directionA2"), value(parameters, "rateA2")),
    ]);
    const factorB = product([
      stageFactor(direction(parameters, "directionB1"), value(parameters, "rateB1")),
      stageFactor(direction(parameters, "directionB2"), value(parameters, "rateB2")),
    ]);
    const finalA = value(parameters, "originalA") * factorA;
    const finalB = value(parameters, "originalB") * factorB;
    numericAnswer = Math.abs(finalA - finalB);
  } else if (taskKind === "multiStageSuccessiveChange" || taskKind === "contextualSuccessiveChange") {
    const stageCount = Math.max(3, Math.floor(value(parameters, "stageCount")));
    const factors: number[] = [];
    for (let stageIndex = 1; stageIndex <= stageCount; stageIndex += 1) {
      const stageDirection = direction(parameters, `direction${stageIndex}`);
      const stageRate = value(parameters, `rate${stageIndex}`);
      factors.push(stageFactor(stageDirection, stageRate));
    }
    numericAnswer = value(parameters, "originalValue") * product(factors);
  }

  const rawAnswer = formatByAnswerType(parameters.answerType, numericAnswer ?? 0);
  const answer = wrapAnswer(parameters.answerType, rawAnswer);

  const originalValue = value(parameters, "originalValue");
  const afterFirstValue = originalValue * stage1.factor;
  const finalValue = value(parameters, "finalValue");
  const netPercent = (combinedFactor - 1) * 100;

  const factorA = product([
    stageFactor(direction(parameters, "directionA1"), value(parameters, "rateA1")),
    stageFactor(direction(parameters, "directionA2"), value(parameters, "rateA2")),
  ]);
  const factorB = product([
    stageFactor(direction(parameters, "directionB1"), value(parameters, "rateB1")),
    stageFactor(direction(parameters, "directionB2"), value(parameters, "rateB2")),
  ]);
  const finalA = value(parameters, "originalA") * factorA;
  const finalB = value(parameters, "originalB") * factorB;

  const stageCount = Math.max(0, Math.floor(value(parameters, "stageCount")));
  const stageFactors: number[] = [];
  const stagePercents: number[] = [];
  for (let stageIndex = 1; stageIndex <= stageCount; stageIndex += 1) {
    const stageDirection = direction(parameters, `direction${stageIndex}`);
    const stageRate = value(parameters, `rate${stageIndex}`);
    stageFactors.push(stageFactor(stageDirection, stageRate));
    stagePercents.push(stagePercent(stageDirection, stageRate));
  }

  return {
    answer,
    numericAnswer,
    answerType: parameters.answerType,
    evidence: {
      ...parameters.variables,
      taskKind,
      answerType: parameters.answerType,
      numericAnswer: numericAnswer ?? "",
      stage1Percent: stage1.percent,
      stage2Percent: stage2.percent,
      stage1Factor: stage1.factor,
      stage2Factor: stage2.factor,
      combinedFactor,
      afterFirstValue,
      netPercent,
      originalFromFinal: taskKind === "reverseSuccessiveChange" ? numericAnswer ?? "" : "",
      finalA,
      finalB,
      difference: Math.abs(finalA - finalB),
      factorA,
      factorB,
      stageCount,
      stageFactors: stageFactors.join(","),
      stagePercents: stagePercents.join(","),
      answer,
      finalValue,
    },
    mathJax: {
      setupLatex: mathJaxBlock(String(taskKind)),
      calculationLatex: mathJaxBlock(rawAnswer.replace("%", "\\%")),
    },
  };
}
