import type { CanonicalPercentageProblem } from "../canonical/percentage-types";
import { roundClean } from "./math-utils";

function stableNumberText(value: number) {
  const rounded = roundClean(value, 2);
  return Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(2).replace(/0+$/u, "").replace(/\.$/u, "");
}

function signedRateText(value: number) {
  return value < 0
    ? `decrease:${stableNumberText(Math.abs(value))}`
    : `increase:${stableNumberText(value)}`;
}

function semanticVariableText(
  problem: CanonicalPercentageProblem,
  key: string,
  value: number,
) {
  if (key === "direction") {
    return value < 0 ? "loss" : "profit";
  }

  if (
    [
      "firstRate",
      "secondRate",
      "rate",
      "growthRate",
      "decayRate",
      "priceIncreasePercent",
      "cutPercent",
      "revisionPercent",
      "profitLossPercent",
    ].includes(key)
  ) {
    if (key === "decayRate" || key === "cutPercent") {
      return `decrease:${stableNumberText(Math.abs(value))}`;
    }
    if (key === "priceIncreasePercent" || key === "growthRate") {
      return `increase:${stableNumberText(Math.abs(value))}`;
    }
    if (key === "profitLossPercent") {
      return problem.answer < 0
        ? `loss:${stableNumberText(Math.abs(value))}`
        : `profit:${stableNumberText(Math.abs(value))}`;
    }
    return signedRateText(value);
  }

  if (value < 0) {
    if (problem.subtype === "profit_loss") {
      return `loss:${stableNumberText(Math.abs(value))}`;
    }
    return `decrease:${stableNumberText(Math.abs(value))}`;
  }

  return stableNumberText(value);
}

function semanticAnswerText(problem: CanonicalPercentageProblem) {
  if (problem.answer < 0) {
    if (problem.subtype === "profit_loss") {
      return `loss:${stableNumberText(Math.abs(problem.answer))}`;
    }
    return `decrease:${stableNumberText(Math.abs(problem.answer))}`;
  }

  if (problem.subtype === "profit_loss") {
    return `profit:${stableNumberText(problem.answer)}`;
  }

  return stableNumberText(problem.answer);
}

export function createProblemSignature(
  problem: CanonicalPercentageProblem,
): string {
  const variableSignature = Object.entries(problem.variables)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => semanticVariableText(problem, key, value))
    .join("_");

  const topologySignature = problem.topology
    ? `${problem.topology.family}|${problem.topology.variant}|`
    : "";

  return `${problem.id}|${topologySignature}${variableSignature}|ans=${semanticAnswerText(problem)}`;
}
