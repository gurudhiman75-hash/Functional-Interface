import { formatNumber, formatPercent, formatRatio, mathJaxBlock, wrapAnswer } from "./math";
import type { Pct002Parameters, Pct002SolverResult } from "./types";

function value(parameters: Pct002Parameters, name: string) {
  return Number(parameters.variables[name]);
}

function formatByAnswerType(answerType: string, numericAnswer: number) {
  if (answerType === "PERCENT") return formatPercent(numericAnswer);
  if (answerType === "RATIO") return formatRatio(numericAnswer, 100 - numericAnswer);
  if (answerType === "COUNT") return formatNumber(Math.round(numericAnswer));
  return formatNumber(numericAnswer);
}

function targetPartIndex(parameters: Pct002Parameters) {
  const explicitIndex = Number(parameters.variables["targetPartIndex"]);
  if (explicitIndex === 1 || explicitIndex === 2) return explicitIndex;
  return String(parameters.variables["targetPartLabel"]) === "first part" ? 1 : 2;
}

export function solvePct002(parameters: Pct002Parameters): Pct002SolverResult {
  const taskKind = parameters.taskKind;
  let numericAnswer: number | null = null;

  if (taskKind === "wholeFromPart") {
    numericAnswer = value(parameters, "knownValue") * 100 / value(parameters, "knownRate");
  } else if (taskKind === "anotherPercentageFromKnownPercentage") {
    numericAnswer = value(parameters, "knownValue") * value(parameters, "targetRate") / value(parameters, "knownRate");
  } else if (taskKind === "percentageFromPartAndWhole") {
    numericAnswer = value(parameters, "partValue") * 100 / value(parameters, "wholeValue");
  } else if (taskKind === "reversePercentageMapping") {
    numericAnswer = value(parameters, "targetValue") * value(parameters, "knownRate") / value(parameters, "knownValue");
  } else if (taskKind === "ratioToPercentage") {
    const totalParts = value(parameters, "partA") + value(parameters, "partB");
    const targetNumerator = targetPartIndex(parameters) === 1
      ? value(parameters, "partA")
      : value(parameters, "partB");
    numericAnswer = targetNumerator * 100 / totalParts;
  } else if (taskKind === "complementaryPercentage") {
    numericAnswer = 100 - value(parameters, "knownRate");
  } else if (taskKind === "differenceBetweenPercentageParts") {
    numericAnswer = Math.abs(value(parameters, "rate1") - value(parameters, "rate2"));
  } else if (taskKind === "percentagePartition") {
    numericAnswer = value(parameters, "totalValue") * value(parameters, "targetRate") / 100;
  } else if (taskKind === "missingPercentage") {
    numericAnswer = 100 - value(parameters, "rate1") - value(parameters, "rate2") - value(parameters, "rate3");
  } else if (taskKind === "multiCategoryPercentageDistribution") {
    numericAnswer = value(parameters, "totalValue") * value(parameters, "targetRate") / 100;
  }

  const rawAnswer = formatByAnswerType(parameters.answerType, numericAnswer ?? 0);
  const answer = wrapAnswer(parameters.answerType, rawAnswer);

  return {
    answer,
    numericAnswer,
    answerType: parameters.answerType,
    evidence: {
      ...parameters.variables,
      taskKind,
      answerType: parameters.answerType,
      numericAnswer: numericAnswer ?? "",
      knownRate: value(parameters, "knownRate"),
      knownValue: value(parameters, "knownValue"),
      targetRate: value(parameters, "targetRate"),
      wholeValue: value(parameters, "wholeValue"),
      partValue: value(parameters, "partValue"),
      targetValue: value(parameters, "targetValue"),
      partA: value(parameters, "partA"),
      partB: value(parameters, "partB"),
      totalParts: value(parameters, "partA") + value(parameters, "partB"),
      onePercentValue:
        taskKind === "wholeFromPart" ||
        taskKind === "anotherPercentageFromKnownPercentage" ||
        taskKind === "reversePercentageMapping"
          ? value(parameters, "knownValue") / value(parameters, "knownRate")
          : taskKind === "percentageFromPartAndWhole"
            ? value(parameters, "wholeValue") / 100
            : taskKind === "percentagePartition" || taskKind === "multiCategoryPercentageDistribution"
              ? value(parameters, "totalValue") / 100
              : "",
      missingRate:
        taskKind === "missingPercentage"
          ? 100 - value(parameters, "rate1") - value(parameters, "rate2") - value(parameters, "rate3")
          : "",
      answer,
    },
    mathJax: {
      setupLatex: mathJaxBlock(String(taskKind)),
      calculationLatex: mathJaxBlock(rawAnswer.replace("%", "\\%")),
    },
  };
}
