import type { Money, Rational } from "./types";
import { moneyFromPaise, multiplyMoney } from "./money";
import { asPercent, divideRational, rational } from "./rational";

export type RateDirection = "PROFIT" | "LOSS";

export type InventoryAdvancedRequest =
  | { mode: "GROUP_RATES_TO_OVERALL_RESULT"; groups: readonly Readonly<{ quantity: bigint; unitCostPrice: Money; direction: RateDirection; ratePercent: Rational }>[] }
  | { mode: "UNKNOWN_GROUP_RATE_FOR_TARGET"; knownGroups: readonly Readonly<{ quantity: bigint; unitCostPrice: Money; direction: RateDirection; ratePercent: Rational }>[]; unknownQuantity: bigint; unknownUnitCostPrice: Money; unknownDirection: RateDirection; targetDirection: RateDirection; targetRatePercent: Rational }
  | { mode: "UNKNOWN_GROUP_QUANTITY_FOR_TARGET"; fixedGroups: readonly Readonly<{ quantity: bigint; unitCostPrice: Money; direction: RateDirection; ratePercent: Rational }>[]; unknownUnitCostPrice: Money; unknownDirection: RateDirection; unknownRatePercent: Rational; targetDirection: RateDirection; targetRatePercent: Rational }
  | { mode: "UNSOLD_STOCK_REQUIRED_UNIT_PRICE"; totalQuantity: bigint; unitCostPrice: Money; soldGroups: readonly Readonly<{ quantity: bigint; unitSellingPrice: Money }>[]; targetDirection: RateDirection; targetRatePercent: Rational }
  | { mode: "UNSOLD_STOCK_REQUIRED_RATE"; totalQuantity: bigint; unitCostPrice: Money; soldGroups: readonly Readonly<{ quantity: bigint; unitSellingPrice: Money }>[]; targetDirection: RateDirection; targetRatePercent: Rational }
  | { mode: "SPOILED_STOCK_REQUIRED_RECOVERY"; totalQuantity: bigint; unitCostPrice: Money; goodQuantity: bigint; goodUnitSellingPrice: Money; spoiledQuantity: bigint; targetDirection: RateDirection; targetRatePercent: Rational }
  | { mode: "EQUAL_SP_EQUAL_RATES_SPECIAL"; ratePercent: Rational }
  | { mode: "EQUAL_SP_ONE_RATE_FROM_OVERALL"; knownDirection: RateDirection; knownRatePercent: Rational; unknownDirection: RateDirection; targetDirection: RateDirection; targetRatePercent: Rational }
  | { mode: "TOTAL_CP_AND_OVERALL_RATE_TO_TOTAL_SP"; totalCostPrice: Money; direction: RateDirection; ratePercent: Rational }
  | { mode: "TOTAL_SP_AND_OVERALL_RATE_TO_TOTAL_CP"; totalSellingPrice: Money; direction: RateDirection; ratePercent: Rational }
  | { mode: "RECOVERY_FRACTION_TO_OVERALL_RESULT"; totalCostPrice: Money; recoveredFraction: Rational };

export type InventoryAdvancedResult =
  | { mode: "GROUP_RATES_TO_OVERALL_RESULT"; totalCost: Money; totalSelling: Money; direction: "PROFIT" | "LOSS" | "NO_CHANGE"; amount: Money; ratePercent: Rational }
  | { mode: "UNKNOWN_GROUP_RATE_FOR_TARGET"; unknownRatePercent: Rational }
  | { mode: "UNKNOWN_GROUP_QUANTITY_FOR_TARGET"; unknownQuantity: bigint }
  | { mode: "UNSOLD_STOCK_REQUIRED_UNIT_PRICE"; requiredUnitSellingPrice: Money }
  | { mode: "UNSOLD_STOCK_REQUIRED_RATE"; requiredRatePercent: Rational }
  | { mode: "SPOILED_STOCK_REQUIRED_RECOVERY"; requiredRecoveryPerSpoiledUnit: Money }
  | { mode: "EQUAL_SP_EQUAL_RATES_SPECIAL"; direction: "LOSS"; ratePercent: Rational }
  | { mode: "EQUAL_SP_ONE_RATE_FROM_OVERALL"; unknownRatePercent: Rational }
  | { mode: "TOTAL_CP_AND_OVERALL_RATE_TO_TOTAL_SP"; totalSellingPrice: Money }
  | { mode: "TOTAL_SP_AND_OVERALL_RATE_TO_TOTAL_CP"; totalCostPrice: Money }
  | { mode: "RECOVERY_FRACTION_TO_OVERALL_RESULT"; direction: "PROFIT" | "LOSS" | "NO_CHANGE"; amount: Money; ratePercent: Rational };

function multiplier(direction: RateDirection, ratePercent: Rational): Rational {
  const hundred = rational(100);
  return direction === "PROFIT"
    ? rational(100n * ratePercent.denominator + ratePercent.numerator, 100n * ratePercent.denominator)
    : rational(100n * ratePercent.denominator - ratePercent.numerator, 100n * ratePercent.denominator);
}

function summarize(cost: Money, selling: Money) {
  if (cost.paise <= 0n) throw new Error("Total cost must be positive.");
  const delta = selling.paise - cost.paise;
  const absolute = delta < 0n ? -delta : delta;
  return {
    direction: delta > 0n ? "PROFIT" as const : delta < 0n ? "LOSS" as const : "NO_CHANGE" as const,
    amount: moneyFromPaise(absolute),
    ratePercent: asPercent(divideRational(rational(absolute), rational(cost.paise))),
  };
}

function targetSelling(cost: Money, direction: RateDirection, rate: Rational): Money {
  return multiplyMoney(cost, multiplier(direction, rate));
}

export function solveInventoryAdvanced(request: InventoryAdvancedRequest): InventoryAdvancedResult {
  switch (request.mode) {
    case "GROUP_RATES_TO_OVERALL_RESULT": {
      if (!request.groups.length) throw new Error("At least one group is required.");
      let cp = 0n, sp = 0n;
      for (const group of request.groups) {
        if (group.quantity <= 0n) throw new Error("Group quantity must be positive.");
        const groupCost = moneyFromPaise(group.quantity * group.unitCostPrice.paise);
        cp += groupCost.paise;
        sp += targetSelling(groupCost, group.direction, group.ratePercent).paise;
      }
      const totalCost = moneyFromPaise(cp), totalSelling = moneyFromPaise(sp);
      return { mode: request.mode, totalCost, totalSelling, ...summarize(totalCost, totalSelling) };
    }
    case "UNKNOWN_GROUP_RATE_FOR_TARGET": {
      const known = solveInventoryAdvanced({ mode: "GROUP_RATES_TO_OVERALL_RESULT", groups: request.knownGroups });
      const unknownCost = moneyFromPaise(request.unknownQuantity * request.unknownUnitCostPrice.paise);
      const totalCost = moneyFromPaise(known.totalCost.paise + unknownCost.paise);
      const requiredUnknownSelling = moneyFromPaise(targetSelling(totalCost, request.targetDirection, request.targetRatePercent).paise - known.totalSelling.paise);
      const delta = requiredUnknownSelling.paise - unknownCost.paise;
      if ((request.unknownDirection === "PROFIT" && delta < 0n) || (request.unknownDirection === "LOSS" && delta > 0n)) throw new Error("Requested direction is incompatible with target.");
      return { mode: request.mode, unknownRatePercent: asPercent(divideRational(rational(delta < 0n ? -delta : delta), rational(unknownCost.paise))) };
    }
    case "UNKNOWN_GROUP_QUANTITY_FOR_TARGET": {
      const fixed = solveInventoryAdvanced({ mode: "GROUP_RATES_TO_OVERALL_RESULT", groups: request.fixedGroups });
      const unknownCp = request.unknownUnitCostPrice.paise;
      const unknownSp = targetSelling(request.unknownUnitCostPrice, request.unknownDirection, request.unknownRatePercent).paise;
      const targetMul = multiplier(request.targetDirection, request.targetRatePercent);
      const numerator = multiplyMoney(fixed.totalCost, targetMul).paise - fixed.totalSelling.paise;
      const denominator = unknownSp * targetMul.denominator - unknownCp * targetMul.numerator;
      if (denominator === 0n || numerator === 0n) throw new Error("Unknown quantity is indeterminate.");
      const quantity = numerator * targetMul.denominator / denominator;
      if (quantity <= 0n) throw new Error("No positive whole-number quantity satisfies the target.");
      return { mode: request.mode, unknownQuantity: quantity };
    }
    case "UNSOLD_STOCK_REQUIRED_UNIT_PRICE": {
      const soldQty = request.soldGroups.reduce((s, g) => s + g.quantity, 0n);
      const remaining = request.totalQuantity - soldQty;
      if (remaining <= 0n) throw new Error("Unsold quantity must be positive.");
      const totalCost = moneyFromPaise(request.totalQuantity * request.unitCostPrice.paise);
      const soldRecovery = request.soldGroups.reduce((s, g) => s + g.quantity * g.unitSellingPrice.paise, 0n);
      const needed = targetSelling(totalCost, request.targetDirection, request.targetRatePercent).paise - soldRecovery;
      if (needed < 0n) throw new Error("Existing recovery already exceeds target.");
      return { mode: request.mode, requiredUnitSellingPrice: moneyFromPaise(needed / remaining) };
    }
    case "UNSOLD_STOCK_REQUIRED_RATE": {
      const unit = solveInventoryAdvanced({ ...request, mode: "UNSOLD_STOCK_REQUIRED_UNIT_PRICE" });
      const delta = unit.requiredUnitSellingPrice.paise - request.unitCostPrice.paise;
      return { mode: request.mode, requiredRatePercent: asPercent(divideRational(rational(delta < 0n ? -delta : delta), rational(request.unitCostPrice.paise))) };
    }
    case "SPOILED_STOCK_REQUIRED_RECOVERY": {
      if (request.goodQuantity + request.spoiledQuantity !== request.totalQuantity || request.spoiledQuantity <= 0n) throw new Error("Quantities must reconcile.");
      const totalCost = moneyFromPaise(request.totalQuantity * request.unitCostPrice.paise);
      const needed = targetSelling(totalCost, request.targetDirection, request.targetRatePercent).paise - request.goodQuantity * request.goodUnitSellingPrice.paise;
      if (needed < 0n) throw new Error("Good-stock recovery already exceeds target.");
      return { mode: request.mode, requiredRecoveryPerSpoiledUnit: moneyFromPaise(needed / request.spoiledQuantity) };
    }
    case "EQUAL_SP_EQUAL_RATES_SPECIAL": {
      const r = request.ratePercent;
      return { mode: request.mode, direction: "LOSS", ratePercent: rational(r.numerator * r.numerator, 100n * r.denominator * r.denominator) };
    }
    case "EQUAL_SP_ONE_RATE_FROM_OVERALL": {
      const p = Number(request.knownRatePercent.numerator) / Number(request.knownRatePercent.denominator);
      const t = Number(request.targetRatePercent.numerator) / Number(request.targetRatePercent.denominator) * (request.targetDirection === "PROFIT" ? 1 : -1);
      const s1 = request.knownDirection === "PROFIT" ? 100 / (100 + p) : 100 / (100 - p);
      const targetCp = 200 / (1 + t / 100);
      const s2 = targetCp - s1;
      const unknown = request.unknownDirection === "PROFIT" ? 100 / s2 - 1 : 1 - 100 / s2;
      if (unknown < 0) throw new Error("Requested unknown direction is incompatible.");
      return { mode: request.mode, unknownRatePercent: rational(BigInt(Math.round(unknown * 1000000)), 10000n) };
    }
    case "TOTAL_CP_AND_OVERALL_RATE_TO_TOTAL_SP":
      return { mode: request.mode, totalSellingPrice: targetSelling(request.totalCostPrice, request.direction, request.ratePercent) };
    case "TOTAL_SP_AND_OVERALL_RATE_TO_TOTAL_CP": {
      const m = multiplier(request.direction, request.ratePercent);
      return { mode: request.mode, totalCostPrice: multiplyMoney(request.totalSellingPrice, rational(m.denominator, m.numerator)) };
    }
    case "RECOVERY_FRACTION_TO_OVERALL_RESULT": {
      const recovered = multiplyMoney(request.totalCostPrice, request.recoveredFraction);
      return { mode: request.mode, ...summarize(request.totalCostPrice, recovered) };
    }
  }
}
