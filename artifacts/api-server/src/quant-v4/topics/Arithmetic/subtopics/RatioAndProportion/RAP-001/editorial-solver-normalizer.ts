import type { Rap001Parameters, Rap001SolverResult } from "./types";

function gcd(left: number, right: number): number {
  return right === 0 ? Math.abs(left) : gcd(right, left % right);
}

function round(value: number) {
  return Math.round(value * 10000) / 10000;
}

/**
 * Corrects legacy solver results that lost exact rational information before
 * simplifying a ratio. The numeric quantities are still retained for display,
 * but the answer ratio is reduced from exact integer numerators.
 */
export function normalizeRap001EditorialSolver(
  parameters: Rap001Parameters,
  solver: Rap001SolverResult,
): Rap001SolverResult {
  if (parameters.taskKind !== "variableReplacementRatio") return solver;

  const volume = Number(parameters.variables.initialVolume);
  const removedFirst = Number(parameters.variables.removedVolume1);
  const removedSecond = Number(parameters.variables.removedVolume2);
  const exactOriginalNumerator = (volume - removedFirst) * (volume - removedSecond);
  const exactAddedNumerator = volume * volume - exactOriginalNumerator;
  const divisor = gcd(exactOriginalNumerator, exactAddedNumerator);
  const originalPart = exactOriginalNumerator / divisor;
  const addedPart = exactAddedNumerator / divisor;
  const finalOriginal = exactOriginalNumerator / volume;
  const finalAdded = exactAddedNumerator / volume;
  const answerValue = `${originalPart}:${addedPart}`;
  const answer = `$$${originalPart} : ${addedPart}$$`;

  return {
    ...solver,
    answer,
    answerValue,
    workingValues: {
      ...solver.workingValues,
      finalLiquidA: round(finalOriginal),
      finalLiquidB: round(finalAdded),
      exactOriginalNumerator,
      exactAddedNumerator,
    },
    evidence: {
      ...solver.evidence,
      finalLiquidA: round(finalOriginal),
      finalLiquidB: round(finalAdded),
      exactOriginalNumerator,
      exactAddedNumerator,
      answer,
    },
    mathJax: {
      ...solver.mathJax,
      calculationLatex: `calculation: \\(${exactOriginalNumerator}:${exactAddedNumerator}=${originalPart}:${addedPart}\\)`,
    },
  };
}
