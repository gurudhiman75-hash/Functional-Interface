import type { Money, Rational } from "./types";

export type Cp006Verification = Readonly<{
  valid: boolean;
  reason?: string;
  expectedPaise?: bigint;
  actualPaise?: bigint;
}>;

function rateEquals(value: Rational, numerator: bigint, denominator: bigint): boolean {
  return value.numerator * denominator === numerator * value.denominator;
}

export function verifyEffectiveCost(
  purchasePrice: Money,
  expenseComponents: readonly Money[],
  actualEffectiveCost: Money,
): Cp006Verification {
  const expectedPaise = purchasePrice.paise + expenseComponents.reduce((sum, item) => sum + item.paise, 0n);
  return {
    valid: expectedPaise === actualEffectiveCost.paise,
    expectedPaise,
    actualPaise: actualEffectiveCost.paise,
  };
}

export function verifyManufacturingUnitCost(input: Readonly<{
  rawMaterialCost: Money;
  labourCost: Money;
  factoryOverheadPercent: Rational;
  packagingCost: Money;
  scrapRecovery: Money;
  outputQuantity: bigint;
  actualUnitCost: Money;
}>): Cp006Verification {
  if (input.outputQuantity <= 0n) return { valid: false, reason: "Output quantity must be positive." };
  const primeCost = input.rawMaterialCost.paise + input.labourCost.paise;
  const overheadNumerator = primeCost * input.factoryOverheadPercent.numerator;
  const overheadDenominator = 100n * input.factoryOverheadPercent.denominator;
  if (overheadNumerator % overheadDenominator !== 0n) return { valid: false, reason: "Factory overhead is not exact in paise." };
  const netCost = primeCost + overheadNumerator / overheadDenominator + input.packagingCost.paise - input.scrapRecovery.paise;
  if (netCost < 0n || netCost % input.outputQuantity !== 0n) return { valid: false, reason: "Net production cost does not produce an exact unit cost." };
  const expectedPaise = netCost / input.outputQuantity;
  return { valid: expectedPaise === input.actualUnitCost.paise, expectedPaise, actualPaise: input.actualUnitCost.paise };
}

export function verifyBreakEvenQuantity(input: Readonly<{
  fixedCost: Money;
  variableCostPerUnit: Money;
  sellingPricePerUnit: Money;
  actualQuantity: bigint;
}>): Cp006Verification {
  const contribution = input.sellingPricePerUnit.paise - input.variableCostPerUnit.paise;
  if (contribution <= 0n || input.actualQuantity <= 0n) return { valid: false, reason: "Contribution and quantity must be positive." };
  const currentContribution = input.actualQuantity * contribution;
  const previousContribution = (input.actualQuantity - 1n) * contribution;
  return {
    valid: currentContribution >= input.fixedCost.paise && previousContribution < input.fixedCost.paise,
    reason: currentContribution >= input.fixedCost.paise && previousContribution < input.fixedCost.paise
      ? undefined
      : "Quantity is not the minimum whole-unit break-even quantity.",
  };
}

export function verifyContributionMarginRatio(
  fixedCost: Money,
  breakEvenRevenue: Money,
  actualRatio: Rational,
): Cp006Verification {
  if (breakEvenRevenue.paise <= 0n) return { valid: false, reason: "Break-even revenue must be positive." };
  const valid = rateEquals(actualRatio, 100n * fixedCost.paise, breakEvenRevenue.paise);
  return { valid, reason: valid ? undefined : "Contribution-margin ratio does not equal fixed cost divided by break-even revenue." };
}

export function verifyCommissionAdjustedResult(input: Readonly<{
  effectiveCost: Money;
  grossSellingPrice: Money;
  commissionPercent: Rational;
  actualNetRecovery: Money;
  actualAmount: Money;
}>): Cp006Verification {
  const commissionNumerator = input.grossSellingPrice.paise * input.commissionPercent.numerator;
  const commissionDenominator = 100n * input.commissionPercent.denominator;
  if (commissionNumerator % commissionDenominator !== 0n) return { valid: false, reason: "Commission is not exact in paise." };
  const expectedNet = input.grossSellingPrice.paise - commissionNumerator / commissionDenominator;
  const expectedAmount = expectedNet >= input.effectiveCost.paise
    ? expectedNet - input.effectiveCost.paise
    : input.effectiveCost.paise - expectedNet;
  return {
    valid: expectedNet === input.actualNetRecovery.paise && expectedAmount === input.actualAmount.paise,
    expectedPaise: expectedNet,
    actualPaise: input.actualNetRecovery.paise,
  };
}

export function verifyRecoveryRateAfterLoss(lossPercent: Rational, requiredProfitPercent: Rational): Cp006Verification {
  const retainedNumerator = 100n * lossPercent.denominator - lossPercent.numerator;
  if (retainedNumerator <= 0n) return { valid: false, reason: "Loss must be below 100%." };
  const valid = requiredProfitPercent.numerator * retainedNumerator ===
    100n * lossPercent.numerator * requiredProfitPercent.denominator;
  return { valid, reason: valid ? undefined : "Recovery rate does not restore the lost capital on the reduced base." };
}
