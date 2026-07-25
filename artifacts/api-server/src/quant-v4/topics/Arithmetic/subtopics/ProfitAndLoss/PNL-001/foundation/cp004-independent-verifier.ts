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

function exactPaise(numerator: bigint, denominator: bigint): bigint | null {
  if (denominator <= 0n || numerator % denominator !== 0n) return null;
  return numerator / denominator;
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
    const factor = multiplier(stage);
    numerator *= factor.numerator;
    denominator *= factor.denominator;
  }
  const expectedPaise = exactPaise(numerator, denominator);
  if (expectedPaise === null) return { valid: false, reason: "Expected chain value is not an exact paise amount." };
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
  const expectedPaise = exactPaise(numerator, denominator);
  if (expectedPaise === null) return { valid: false, reason: "Expected reverse-chain value is not an exact paise amount." };
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
  const expectedPaise = exactPaise(
    grossSellingPrice.paise * retainedNumerator,
    retainedDenominator,
  );
  if (expectedPaise === null) return { valid: false, reason: "Expected net receipt is not an exact paise amount." };
  return {
    valid: expectedPaise === actualNetReceipt.paise,
    expectedPaise,
    actualPaise: actualNetReceipt.paise,
  };
}
