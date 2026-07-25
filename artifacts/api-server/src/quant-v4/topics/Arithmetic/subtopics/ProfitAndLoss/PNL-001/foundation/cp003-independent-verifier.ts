import type { Money } from "./types";
import type { InventoryLot, InventorySolveResult } from "./inventory-solver";
import { moneyFromPaise } from "./money";
import { asPercent, divideRational, rational } from "./rational";

export type InventoryVerification = Readonly<{
  valid: boolean;
  expectedDirection: "PROFIT" | "LOSS" | "NO_CHANGE";
  expectedAmount: Money;
  expectedRateNumerator: bigint;
  expectedRateDenominator: bigint;
}>;

export function verifyMultipleLotsResult(
  lots: readonly InventoryLot[],
  result: Extract<InventorySolveResult, { mode: "MULTIPLE_LOTS_TO_OVERALL_RESULT" }>,
): InventoryVerification {
  let totalCost = 0n;
  let totalSelling = 0n;
  for (const lot of lots) {
    totalCost += lot.quantity * lot.unitCostPrice.paise;
    totalSelling += lot.quantity * lot.unitSellingPrice.paise;
  }
  const delta = totalSelling - totalCost;
  const absolute = delta < 0n ? -delta : delta;
  const expectedDirection = delta > 0n ? "PROFIT" as const : delta < 0n ? "LOSS" as const : "NO_CHANGE" as const;
  const expectedRate = asPercent(divideRational(rational(absolute), rational(totalCost)));
  return {
    valid:
      result.totalCost.paise === totalCost &&
      result.totalSelling.paise === totalSelling &&
      result.direction === expectedDirection &&
      result.amount.paise === absolute &&
      result.ratePercent.numerator * expectedRate.denominator === expectedRate.numerator * result.ratePercent.denominator,
    expectedDirection,
    expectedAmount: moneyFromPaise(absolute),
    expectedRateNumerator: expectedRate.numerator,
    expectedRateDenominator: expectedRate.denominator,
  };
}

export function verifyInventoryIdentity(condition: boolean, message: string): void {
  if (!condition) throw new Error(`PNL-CP-003 verification failed: ${message}`);
}
