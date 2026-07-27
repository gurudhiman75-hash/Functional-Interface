import type { Money, Rational } from "./types";
import { moneyFromPaise, multiplyMoney } from "./money";
import { asPercent, divideRational, rational } from "./rational";

export type InventoryLot = Readonly<{
  quantity: bigint;
  unitCostPrice: Money;
  unitSellingPrice: Money;
}>;

export type InventorySolveRequest =
  | { mode: "MULTIPLE_LOTS_TO_OVERALL_RESULT"; lots: readonly InventoryLot[] }
  | { mode: "EQUAL_SP_TWO_ARTICLES_TO_OVERALL_RATE"; commonSellingPrice: Money; firstDirection: "PROFIT" | "LOSS"; firstRatePercent: Rational; secondDirection: "PROFIT" | "LOSS"; secondRatePercent: Rational }
  | { mode: "EQUAL_CP_TWO_ARTICLES_TO_OVERALL_RATE"; commonCostPrice: Money; firstDirection: "PROFIT" | "LOSS"; firstRatePercent: Rational; secondDirection: "PROFIT" | "LOSS"; secondRatePercent: Rational }
  | { mode: "PARTIAL_INVENTORY_TO_OVERALL_RESULT"; totalQuantity: bigint; unitCostPrice: Money; soldGroups: readonly Readonly<{ quantity: bigint; unitSellingPrice: Money }>[]; unsoldQuantity?: bigint; unsoldRecoveryPerUnit?: Money }
  | { mode: "DAMAGED_STOCK_REQUIRED_RATE_ON_REMAINDER"; totalQuantity: bigint; unitCostPrice: Money; damagedQuantity: bigint; damagedRecoveryPerUnit: Money; targetDirection: "PROFIT" | "LOSS"; targetRatePercent: Rational }
  | { mode: "FREE_UNITS_AND_SOLD_UNITS_TO_RESULT"; paidQuantity: bigint; freeQuantity: bigint; unitCostPrice: Money; unitSellingPrice: Money };

export type InventorySolveResult =
  | { mode: "MULTIPLE_LOTS_TO_OVERALL_RESULT"; totalCost: Money; totalSelling: Money; direction: "PROFIT" | "LOSS" | "NO_CHANGE"; amount: Money; ratePercent: Rational }
  | { mode: "EQUAL_SP_TWO_ARTICLES_TO_OVERALL_RATE"; direction: "PROFIT" | "LOSS" | "NO_CHANGE"; ratePercent: Rational }
  | { mode: "EQUAL_CP_TWO_ARTICLES_TO_OVERALL_RATE"; direction: "PROFIT" | "LOSS" | "NO_CHANGE"; ratePercent: Rational }
  | { mode: "PARTIAL_INVENTORY_TO_OVERALL_RESULT"; totalCost: Money; totalRecovery: Money; direction: "PROFIT" | "LOSS" | "NO_CHANGE"; amount: Money; ratePercent: Rational }
  | { mode: "DAMAGED_STOCK_REQUIRED_RATE_ON_REMAINDER"; requiredSellingPricePerGoodUnit: Money }
  | { mode: "FREE_UNITS_AND_SOLD_UNITS_TO_RESULT"; direction: "PROFIT" | "LOSS" | "NO_CHANGE"; amount: Money; ratePercent: Rational };

function fromRate(base: Money, direction: "PROFIT" | "LOSS", rate: Rational): Money {
  const delta = multiplyMoney(base, divideRational(rate, rational(100)));
  return moneyFromPaise(direction === "PROFIT" ? base.paise + delta.paise : base.paise - delta.paise);
}

function costFromSelling(selling: Money, direction: "PROFIT" | "LOSS", rate: Rational): Money {
  const denominator = direction === "PROFIT" ? 100n * rate.denominator + rate.numerator : 100n * rate.denominator - rate.numerator;
  if (denominator <= 0n) throw new Error("Invalid reverse rate.");
  return multiplyMoney(selling, rational(100n * rate.denominator, denominator));
}

function summarize(totalCost: Money, totalSelling: Money) {
  if (totalCost.paise <= 0n) throw new Error("Total cost must be positive.");
  const delta = totalSelling.paise - totalCost.paise;
  const direction = delta > 0n ? "PROFIT" as const : delta < 0n ? "LOSS" as const : "NO_CHANGE" as const;
  const absolute = delta < 0n ? -delta : delta;
  return { direction, amount: moneyFromPaise(absolute), ratePercent: asPercent(divideRational(rational(absolute), rational(totalCost.paise))) };
}

export function solveInventory(request: InventorySolveRequest): InventorySolveResult {
  switch (request.mode) {
    case "MULTIPLE_LOTS_TO_OVERALL_RESULT": {
      if (request.lots.length === 0) throw new Error("At least one lot is required.");
      let totalCost = 0n, totalSelling = 0n;
      for (const lot of request.lots) {
        if (lot.quantity <= 0n) throw new Error("Lot quantity must be positive.");
        totalCost += lot.quantity * lot.unitCostPrice.paise;
        totalSelling += lot.quantity * lot.unitSellingPrice.paise;
      }
      const cost = moneyFromPaise(totalCost), selling = moneyFromPaise(totalSelling);
      return { mode: request.mode, totalCost: cost, totalSelling: selling, ...summarize(cost, selling) };
    }
    case "EQUAL_SP_TWO_ARTICLES_TO_OVERALL_RATE": {
      const firstCost = costFromSelling(request.commonSellingPrice, request.firstDirection, request.firstRatePercent);
      const secondCost = costFromSelling(request.commonSellingPrice, request.secondDirection, request.secondRatePercent);
      const totalCost = moneyFromPaise(firstCost.paise + secondCost.paise);
      const totalSelling = moneyFromPaise(2n * request.commonSellingPrice.paise);
      const summary = summarize(totalCost, totalSelling);
      return { mode: request.mode, direction: summary.direction, ratePercent: summary.ratePercent };
    }
    case "EQUAL_CP_TWO_ARTICLES_TO_OVERALL_RATE": {
      const firstSp = fromRate(request.commonCostPrice, request.firstDirection, request.firstRatePercent);
      const secondSp = fromRate(request.commonCostPrice, request.secondDirection, request.secondRatePercent);
      const totalCost = moneyFromPaise(2n * request.commonCostPrice.paise);
      const totalSelling = moneyFromPaise(firstSp.paise + secondSp.paise);
      const summary = summarize(totalCost, totalSelling);
      return { mode: request.mode, direction: summary.direction, ratePercent: summary.ratePercent };
    }
    case "PARTIAL_INVENTORY_TO_OVERALL_RESULT": {
      if (request.totalQuantity <= 0n) throw new Error("Total quantity must be positive.");
      const soldQuantity = request.soldGroups.reduce((sum, group) => sum + group.quantity, 0n);
      const unsold = request.unsoldQuantity ?? request.totalQuantity - soldQuantity;
      if (soldQuantity + unsold !== request.totalQuantity) throw new Error("Inventory quantities do not reconcile.");
      const totalCost = moneyFromPaise(request.totalQuantity * request.unitCostPrice.paise);
      let recovery = request.soldGroups.reduce((sum, group) => sum + group.quantity * group.unitSellingPrice.paise, 0n);
      recovery += unsold * (request.unsoldRecoveryPerUnit?.paise ?? 0n);
      const totalRecovery = moneyFromPaise(recovery);
      return { mode: request.mode, totalCost, totalRecovery, ...summarize(totalCost, totalRecovery) };
    }
    case "DAMAGED_STOCK_REQUIRED_RATE_ON_REMAINDER": {
      const goodQuantity = request.totalQuantity - request.damagedQuantity;
      if (goodQuantity <= 0n) throw new Error("At least one good unit must remain.");
      const totalCost = moneyFromPaise(request.totalQuantity * request.unitCostPrice.paise);
      const targetRecovery = fromRate(totalCost, request.targetDirection, request.targetRatePercent);
      const damagedRecovery = request.damagedQuantity * request.damagedRecoveryPerUnit.paise;
      const needed = targetRecovery.paise - damagedRecovery;
      if (needed < 0n) throw new Error("Damaged-stock recovery already exceeds target recovery.");
      return { mode: request.mode, requiredSellingPricePerGoodUnit: moneyFromPaise(needed / goodQuantity) };
    }
    case "FREE_UNITS_AND_SOLD_UNITS_TO_RESULT": {
      if (request.paidQuantity <= 0n || request.freeQuantity < 0n) throw new Error("Invalid quantities.");
      const totalQuantity = request.paidQuantity + request.freeQuantity;
      const totalCost = moneyFromPaise(request.paidQuantity * request.unitCostPrice.paise);
      const totalSelling = moneyFromPaise(totalQuantity * request.unitSellingPrice.paise);
      const summary = summarize(totalCost, totalSelling);
      return { mode: request.mode, ...summary };
    }
  }
}
