import type { Rap001Parameters } from "./types";

function gcd(left: number, right: number): number {
  return right === 0 ? Math.abs(left) : gcd(right, left % right);
}

function normalizeFractionRatio(parameters: Rap001Parameters): Rap001Parameters {
  if (parameters.taskKind !== "ratioNormalization") return parameters;

  const qlNumber = Number(parameters.questionLanguageId.match(/(\d+)$/)?.[1] ?? 0);
  const variant = Math.floor(qlNumber / 100) % 20;
  const leftFractions = [
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
  ] as const;
  const rightFractions = [
    [1, 3],
    [2, 5],
    [3, 7],
    [4, 9],
  ] as const;
  const [numerator1, denominator1] = leftFractions[variant % leftFractions.length]!;
  const [numerator2, denominator2] = rightFractions[Math.floor(variant / leftFractions.length) % rightFractions.length]!;

  return {
    ...parameters,
    variables: {
      ...parameters.variables,
      numerator1,
      denominator1,
      numerator2,
      denominator2,
    },
  };
}

function normalizeIncomeExpenditure(parameters: Rap001Parameters): Rap001Parameters {
  if (parameters.taskKind !== "incomeExpenditureSystem") return parameters;

  const incomeRatioA = Number(parameters.variables.incomeRatioA);
  const incomeRatioB = Number(parameters.variables.incomeRatioB);
  if (!Number.isFinite(incomeRatioA) || !Number.isFinite(incomeRatioB) || incomeRatioA <= incomeRatioB) {
    return parameters;
  }

  // For equal positive savings, the expenditure ratio must be steeper than
  // the income ratio. The legacy generator produced the opposite ordering,
  // which forced a negative expenditure multiplier.
  const expRatioB = incomeRatioB;
  let expRatioA = incomeRatioA + 1;
  while (gcd(expRatioA, expRatioB) !== 1) expRatioA += 1;

  const baseUnit = 1000;
  const savingsAmount = (expRatioA * incomeRatioB - incomeRatioA * expRatioB) * baseUnit;

  return {
    ...parameters,
    variables: {
      ...parameters.variables,
      expRatioA,
      expRatioB,
      savingsAmount,
    },
  };
}

/**
 * Repairs invalid or non-diverse legacy parameter combinations before solving.
 * The normalization is deterministic and applies equally to every language.
 */
export function normalizeRap001EditorialParameters(parameters: Rap001Parameters): Rap001Parameters {
  return normalizeIncomeExpenditure(normalizeFractionRatio(parameters));
}
