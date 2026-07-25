import type { Money, Rational } from "./types";
import { rational } from "./rational";
import type { TransactionStage } from "./transaction-chain-solver";

export type Cp004Verification = Readonly<{
  valid: boolean;
  expectedPaise?: bigint;
  actualPaise?: bigint;
  reason?: string;
}>;

function multiplier(stage: TransactionStage): Rational {
  const base = 100n * stage.ratePercent.denominator;
  const change = stage.ratePercent.numerator;
  return rational(
    stage.direction === "PROFIT" ? base + change : base - change,
    base,
  );
}

function multiplyFraction(
  numerator: bigint,
  denominator: bigint,
  factor: Rational,
): { numerator: bigint; denominator: bigint } {
  return {
    numerator: numerator * factor.numerator,
    denominator: denominator * factor.denominator,
  };
}

function roundedPaise(numerator: bigint, denominator: bigint): bigint {
  if (denominator <= 0n) throw new Error("Verifier denominator must be positive.");
  const quotient = numerator / denominator;
  const remainder = numerator % denominator;
  return remainder * 2n >= denominator ? quotient + 1n : quotient;
}

export function verifyTransactionChainFinal(
  initialCostPrice: Money,
  stages: readonly TransactionStage[],
  actualFinalSellingPrice: Money,
): Cp004Verification {
  if (initialCostPrice.paise <= 0n || stages.length === 0) {
    return { valid: false, reason: "Initial price and stages must be present." };
  }
  let numerator = initialCostPrice.paise;
  let denominator = 1n;
  for (const stage of stages) {
    const next = multiplyFraction(numerator, denominator, multiplier(stage));
    numerator = next.numerator;
    denominator = next.denominator;
  }
  const expectedPaise = roundedPaise(numerator, denominator);
  return {
    valid: expectedPaise === actualFinalSellingPrice.paise,
    expectedPaise,
    actualPaise: actualFinalSellingPrice.paise,
  };
}

export function verifyTransactionChainInitial(
  finalSellingPrice: Money,
  stages: readonly TransactionStage[],
  actualInitialCostPrice: Money,
): Cp004Verification {
  if (finalSellingPrice.paise <= 0n || stages.length === 0) {
    return { valid: false, reason: "Final price and stages must be present." };
  }
  let numerator = finalSellingPrice.paise;
  let denominator = 1n;
  for (const stage of stages) {
    const factor = multiplier(stage);
    numerator *= factor.denominator;
    denominator *= factor.numerator;
  }
  const expectedPaise = roundedPaise(numerator, denominator);
  return {
    valid: expectedPaise === actualInitialCostPrice.paise,
    expectedPaise,
    actualPaise: actualInitialCostPrice.paise,
  };
}

export function verifyCommissionNetReceipt(
  grossSellingPrice: Money,
  commissionPercent: Rational,
  actualNetReceipt: Money,
): Cp004Verification {
  const retainedNumerator = 100n * commissionPercent.denominator - commissionPercent.numerator;
  const retainedDenominator = 100n * commissionPercent.denominator;
  const expectedPaise = roundedPaise(
    grossSellingPrice.paise * retainedNumerator,
    retainedDenominator,
  );
  return {
    valid: expectedPaise === actualNetReceipt.paise,
    expectedPaise,
    actualPaise: actualNetReceipt.paise,
  };
}
