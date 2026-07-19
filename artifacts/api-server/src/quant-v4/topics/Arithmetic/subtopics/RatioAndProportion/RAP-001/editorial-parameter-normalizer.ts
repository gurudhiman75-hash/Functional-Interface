import type { Rap001Parameters } from "./types";

function gcd(left: number, right: number): number {
  return right === 0 ? Math.abs(left) : gcd(right, left % right);
}

/**
 * Repairs mathematically invalid legacy parameter combinations before solving.
 * This stays deterministic and applies equally to every language for the same QL/seed.
 */
export function normalizeRap001EditorialParameters(parameters: Rap001Parameters): Rap001Parameters {
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
