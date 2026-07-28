import type { Money, Rational } from "./types";
import { moneyFromPaise, multiplyMoney } from "./money";
import {
  asPercent,
  divideRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";

export type TradeDirection = "PROFIT" | "LOSS";

export type DishonestTradeRequest =
  | {
      mode: "FALSE_QUANTITY_AT_QUOTED_PRICE_TO_RESULT";
      costPricePerTrueQuantity: Money;
      quotedSellingPricePerNominalQuantity: Money;
      trueQuantity: bigint;
      deliveredQuantity: bigint;
    }
  | {
      mode: "DECLARED_RATE_FALSE_QUANTITY_TO_ACTUAL_RATE";
      costPricePerTrueQuantity: Money;
      declaredDirection: TradeDirection;
      declaredRatePercent: Rational;
      trueQuantity: bigint;
      deliveredQuantity: bigint;
    }
  | {
      mode: "TARGET_RATE_TO_DELIVERED_QUANTITY";
      costPricePerTrueQuantity: Money;
      quotedSellingPricePerNominalQuantity: Money;
      trueQuantity: bigint;
      targetDirection: TradeDirection;
      targetRatePercent: Rational;
    }
  | {
      mode: "TARGET_RATE_AND_FALSE_QUANTITY_TO_QUOTED_SP";
      costPricePerTrueQuantity: Money;
      trueQuantity: bigint;
      deliveredQuantity: bigint;
      targetDirection: TradeDirection;
      targetRatePercent: Rational;
    }
  | {
      mode: "BUY_HEAVY_SELL_LIGHT_TO_ACTUAL_RATE";
      purchasePricePerNominalQuantity: Money;
      sellingPricePerNominalQuantity: Money;
      nominalQuantity: bigint;
      receivedQuantity: bigint;
      deliveredQuantity: bigint;
    }
  | {
      mode: "MARKUP_DISCOUNT_FALSE_QUANTITY_TO_ACTUAL_RATE";
      costPricePerTrueQuantity: Money;
      markupPercent: Rational;
      discountPercent: Rational;
      trueQuantity: bigint;
      deliveredQuantity: bigint;
    }
  | {
      mode: "TARGET_RATE_FALSE_QUANTITY_DISCOUNT_TO_MARKUP";
      costPricePerTrueQuantity: Money;
      discountPercent: Rational;
      trueQuantity: bigint;
      deliveredQuantity: bigint;
      targetDirection: TradeDirection;
      targetRatePercent: Rational;
    }
  | {
      mode: "TARGET_RATE_FALSE_QUANTITY_MARKUP_TO_DISCOUNT";
      costPricePerTrueQuantity: Money;
      markupPercent: Rational;
      trueQuantity: bigint;
      deliveredQuantity: bigint;
      targetDirection: TradeDirection;
      targetRatePercent: Rational;
    }
  | {
      mode: "PRICE_CHANGE_AND_SHORT_QUANTITY_TO_ACTUAL_RATE";
      costPricePerTrueQuantity: Money;
      priceDirection: "INCREASE" | "DECREASE";
      priceChangePercent: Rational;
      trueQuantity: bigint;
      shortQuantityPercent: Rational;
    }
  | {
      mode: "SHORT_QUANTITY_TO_CUSTOMER_OVERCHARGE_RATE";
      trueQuantity: bigint;
      deliveredQuantity: bigint;
    }
  | {
      mode: "ACTUAL_AND_DECLARED_RATE_TO_FALSE_QUANTITY";
      trueQuantity: bigint;
      declaredDirection: TradeDirection;
      declaredRatePercent: Rational;
      actualDirection: TradeDirection;
      actualRatePercent: Rational;
    }
  | {
      mode: "ACTUAL_RATE_AND_FALSE_QUANTITY_TO_DECLARED_RATE";
      trueQuantity: bigint;
      deliveredQuantity: bigint;
      actualDirection: TradeDirection;
      actualRatePercent: Rational;
    };

export type DishonestTradeResult =
  | {
      mode: "FALSE_QUANTITY_AT_QUOTED_PRICE_TO_RESULT";
      actualCostOfDeliveredQuantity: Money;
      direction: "PROFIT" | "LOSS" | "NO_CHANGE";
      amount: Money;
      ratePercent: Rational;
    }
  | {
      mode: "DECLARED_RATE_FALSE_QUANTITY_TO_ACTUAL_RATE";
      quotedSellingPrice: Money;
      direction: "PROFIT" | "LOSS" | "NO_CHANGE";
      ratePercent: Rational;
    }
  | { mode: "TARGET_RATE_TO_DELIVERED_QUANTITY"; deliveredQuantity: Rational }
  | { mode: "TARGET_RATE_AND_FALSE_QUANTITY_TO_QUOTED_SP"; quotedSellingPrice: Money }
  | {
      mode: "BUY_HEAVY_SELL_LIGHT_TO_ACTUAL_RATE";
      direction: "PROFIT" | "LOSS" | "NO_CHANGE";
      ratePercent: Rational;
    }
  | {
      mode: "MARKUP_DISCOUNT_FALSE_QUANTITY_TO_ACTUAL_RATE";
      markedPrice: Money;
      quotedSellingPrice: Money;
      direction: "PROFIT" | "LOSS" | "NO_CHANGE";
      ratePercent: Rational;
    }
  | { mode: "TARGET_RATE_FALSE_QUANTITY_DISCOUNT_TO_MARKUP"; markupPercent: Rational }
  | { mode: "TARGET_RATE_FALSE_QUANTITY_MARKUP_TO_DISCOUNT"; discountPercent: Rational }
  | {
      mode: "PRICE_CHANGE_AND_SHORT_QUANTITY_TO_ACTUAL_RATE";
      quotedSellingPrice: Money;
      deliveredQuantity: Rational;
      direction: "PROFIT" | "LOSS" | "NO_CHANGE";
      ratePercent: Rational;
    }
  | { mode: "SHORT_QUANTITY_TO_CUSTOMER_OVERCHARGE_RATE"; overchargePercent: Rational }
  | { mode: "ACTUAL_AND_DECLARED_RATE_TO_FALSE_QUANTITY"; deliveredQuantity: Rational }
  | {
      mode: "ACTUAL_RATE_AND_FALSE_QUANTITY_TO_DECLARED_RATE";
      declaredDirection: "PROFIT" | "LOSS" | "NO_CHANGE";
      declaredRatePercent: Rational;
    };

function validateQuantity(value: bigint, label: string): void {
  if (value <= 0n) throw new Error(`${label} must be positive.`);
}

function validateRate(direction: TradeDirection, rate: Rational): void {
  if (rate.denominator <= 0n || rate.numerator < 0n) throw new Error("Rate must be non-negative.");
  if (direction === "LOSS" && rate.numerator >= 100n * rate.denominator) {
    throw new Error("Loss rate must be below 100%.");
  }
}

function commercialMultiplier(direction: TradeDirection, rate: Rational): Rational {
  validateRate(direction, rate);
  const hundred = rational(100);
  const fraction = divideRational(rate, hundred);
  return direction === "PROFIT"
    ? { numerator: fraction.denominator + fraction.numerator, denominator: fraction.denominator }
    : subtractRational(rational(1), fraction);
}

function quantityFraction(part: bigint, whole: bigint): Rational {
  validateQuantity(part, "Quantity");
  validateQuantity(whole, "Reference quantity");
  return rational(part, whole);
}

function summarize(cost: Rational, revenue: Rational) {
  if (cost.numerator <= 0n) throw new Error("Actual cost must be positive.");
  const difference = subtractRational(revenue, cost);
  const comparison = difference.numerator === 0n ? 0 : difference.numerator > 0n ? 1 : -1;
  const absolute = rational(difference.numerator < 0n ? -difference.numerator : difference.numerator, difference.denominator);
  return {
    direction: comparison > 0 ? "PROFIT" as const : comparison < 0 ? "LOSS" as const : "NO_CHANGE" as const,
    ratePercent: asPercent(divideRational(absolute, cost)),
  };
}

function actualCostRational(costPrice: Money, deliveredQuantity: bigint, trueQuantity: bigint): Rational {
  return multiplyRational(rational(costPrice.paise), quantityFraction(deliveredQuantity, trueQuantity));
}

function exactMoney(value: Rational, label: string): Money {
  if (value.numerator % value.denominator !== 0n) throw new Error(`${label} is not an exact paise amount.`);
  return moneyFromPaise(value.numerator / value.denominator);
}

function quoteFromDeclaredRate(costPrice: Money, direction: TradeDirection, rate: Rational): Money {
  return multiplyMoney(costPrice, commercialMultiplier(direction, rate));
}

export function solveDishonestTrade(request: DishonestTradeRequest): DishonestTradeResult {
  switch (request.mode) {
    case "FALSE_QUANTITY_AT_QUOTED_PRICE_TO_RESULT": {
      const cost = actualCostRational(request.costPricePerTrueQuantity, request.deliveredQuantity, request.trueQuantity);
      const revenue = rational(request.quotedSellingPricePerNominalQuantity.paise);
      const summary = summarize(cost, revenue);
      const actualCost = exactMoney(cost, "Delivered-quantity cost");
      const difference = request.quotedSellingPricePerNominalQuantity.paise - actualCost.paise;
      return {
        mode: request.mode,
        actualCostOfDeliveredQuantity: actualCost,
        direction: summary.direction,
        amount: moneyFromPaise(difference < 0n ? -difference : difference),
        ratePercent: summary.ratePercent,
      };
    }

    case "DECLARED_RATE_FALSE_QUANTITY_TO_ACTUAL_RATE": {
      const quotedSellingPrice = quoteFromDeclaredRate(
        request.costPricePerTrueQuantity,
        request.declaredDirection,
        request.declaredRatePercent,
      );
      const cost = actualCostRational(request.costPricePerTrueQuantity, request.deliveredQuantity, request.trueQuantity);
      const summary = summarize(cost, rational(quotedSellingPrice.paise));
      return { mode: request.mode, quotedSellingPrice, ...summary };
    }

    case "TARGET_RATE_TO_DELIVERED_QUANTITY": {
      const targetMultiplier = commercialMultiplier(request.targetDirection, request.targetRatePercent);
      const deliveredQuantity = divideRational(
        rational(request.quotedSellingPricePerNominalQuantity.paise * request.trueQuantity),
        multiplyRational(rational(request.costPricePerTrueQuantity.paise), targetMultiplier),
      );
      return { mode: request.mode, deliveredQuantity };
    }

    case "TARGET_RATE_AND_FALSE_QUANTITY_TO_QUOTED_SP": {
      const deliveredCost = actualCostRational(
        request.costPricePerTrueQuantity,
        request.deliveredQuantity,
        request.trueQuantity,
      );
      const selling = multiplyRational(
        deliveredCost,
        commercialMultiplier(request.targetDirection, request.targetRatePercent),
      );
      return { mode: request.mode, quotedSellingPrice: exactMoney(selling, "Quoted selling price") };
    }

    case "BUY_HEAVY_SELL_LIGHT_TO_ACTUAL_RATE": {
      validateQuantity(request.nominalQuantity, "Nominal quantity");
      validateQuantity(request.receivedQuantity, "Received quantity");
      validateQuantity(request.deliveredQuantity, "Delivered quantity");
      const revenue = multiplyRational(
        rational(request.sellingPricePerNominalQuantity.paise),
        rational(request.receivedQuantity, request.deliveredQuantity),
      );
      const cost = rational(request.purchasePricePerNominalQuantity.paise);
      return { mode: request.mode, ...summarize(cost, revenue) };
    }

    case "MARKUP_DISCOUNT_FALSE_QUANTITY_TO_ACTUAL_RATE": {
      const markedPrice = quoteFromDeclaredRate(
        request.costPricePerTrueQuantity,
        "PROFIT",
        request.markupPercent,
      );
      validateRate("LOSS", request.discountPercent);
      const quotedSellingPrice = multiplyMoney(
        markedPrice,
        commercialMultiplier("LOSS", request.discountPercent),
      );
      const cost = actualCostRational(request.costPricePerTrueQuantity, request.deliveredQuantity, request.trueQuantity);
      return {
        mode: request.mode,
        markedPrice,
        quotedSellingPrice,
        ...summarize(cost, rational(quotedSellingPrice.paise)),
      };
    }

    case "TARGET_RATE_FALSE_QUANTITY_DISCOUNT_TO_MARKUP": {
      validateRate("LOSS", request.discountPercent);
      const targetRevenue = multiplyRational(
        actualCostRational(request.costPricePerTrueQuantity, request.deliveredQuantity, request.trueQuantity),
        commercialMultiplier(request.targetDirection, request.targetRatePercent),
      );
      const markedPrice = divideRational(
        targetRevenue,
        commercialMultiplier("LOSS", request.discountPercent),
      );
      const markupFraction = subtractRational(
        divideRational(markedPrice, rational(request.costPricePerTrueQuantity.paise)),
        rational(1),
      );
      return { mode: request.mode, markupPercent: asPercent(markupFraction) };
    }

    case "TARGET_RATE_FALSE_QUANTITY_MARKUP_TO_DISCOUNT": {
      const markedPrice = multiplyRational(
        rational(request.costPricePerTrueQuantity.paise),
        commercialMultiplier("PROFIT", request.markupPercent),
      );
      const targetRevenue = multiplyRational(
        actualCostRational(request.costPricePerTrueQuantity, request.deliveredQuantity, request.trueQuantity),
        commercialMultiplier(request.targetDirection, request.targetRatePercent),
      );
      const retained = divideRational(targetRevenue, markedPrice);
      const discount = subtractRational(rational(1), retained);
      if (discount.numerator < 0n || discount.numerator > discount.denominator) {
        throw new Error("Target result is incompatible with a valid discount.");
      }
      return { mode: request.mode, discountPercent: asPercent(discount) };
    }

    case "PRICE_CHANGE_AND_SHORT_QUANTITY_TO_ACTUAL_RATE": {
      validateRate(request.priceDirection === "INCREASE" ? "PROFIT" : "LOSS", request.priceChangePercent);
      validateRate("LOSS", request.shortQuantityPercent);
      const quotedSellingPrice = multiplyMoney(
        request.costPricePerTrueQuantity,
        commercialMultiplier(request.priceDirection === "INCREASE" ? "PROFIT" : "LOSS", request.priceChangePercent),
      );
      const deliveredFraction = commercialMultiplier("LOSS", request.shortQuantityPercent);
      const deliveredQuantity = multiplyRational(rational(request.trueQuantity), deliveredFraction);
      const cost = multiplyRational(rational(request.costPricePerTrueQuantity.paise), deliveredFraction);
      return {
        mode: request.mode,
        quotedSellingPrice,
        deliveredQuantity,
        ...summarize(cost, rational(quotedSellingPrice.paise)),
      };
    }

    case "SHORT_QUANTITY_TO_CUSTOMER_OVERCHARGE_RATE": {
      validateQuantity(request.trueQuantity, "True quantity");
      validateQuantity(request.deliveredQuantity, "Delivered quantity");
      if (request.deliveredQuantity > request.trueQuantity) throw new Error("Delivered quantity cannot exceed true quantity.");
      const effectiveMultiplier = rational(request.trueQuantity, request.deliveredQuantity);
      return {
        mode: request.mode,
        overchargePercent: asPercent(subtractRational(effectiveMultiplier, rational(1))),
      };
    }

    case "ACTUAL_AND_DECLARED_RATE_TO_FALSE_QUANTITY": {
      const declaredMultiplier = commercialMultiplier(request.declaredDirection, request.declaredRatePercent);
      const actualMultiplier = commercialMultiplier(request.actualDirection, request.actualRatePercent);
      return {
        mode: request.mode,
        deliveredQuantity: multiplyRational(
          rational(request.trueQuantity),
          divideRational(declaredMultiplier, actualMultiplier),
        ),
      };
    }

    case "ACTUAL_RATE_AND_FALSE_QUANTITY_TO_DECLARED_RATE": {
      validateQuantity(request.trueQuantity, "True quantity");
      validateQuantity(request.deliveredQuantity, "Delivered quantity");
      const actualMultiplier = commercialMultiplier(request.actualDirection, request.actualRatePercent);
      const declaredMultiplier = multiplyRational(
        actualMultiplier,
        rational(request.deliveredQuantity, request.trueQuantity),
      );
      const difference = subtractRational(declaredMultiplier, rational(1));
      const direction = difference.numerator > 0n ? "PROFIT" as const : difference.numerator < 0n ? "LOSS" as const : "NO_CHANGE" as const;
      return {
        mode: request.mode,
        declaredDirection: direction,
        declaredRatePercent: asPercent(rational(
          difference.numerator < 0n ? -difference.numerator : difference.numerator,
          difference.denominator,
        )),
      };
    }
  }
}
