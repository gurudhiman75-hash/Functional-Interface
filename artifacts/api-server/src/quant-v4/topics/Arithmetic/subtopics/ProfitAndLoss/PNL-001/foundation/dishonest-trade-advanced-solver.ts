import type { Money, Rational } from "./types";
import { moneyFromPaise } from "./money";
import {
  asPercent,
  divideRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";

export type DishonestScheme = Readonly<{
  costPricePerTrueQuantity: Money;
  quotedSellingPricePerNominalQuantity: Money;
  trueQuantity: bigint;
  deliveredQuantity: bigint;
}>;

export type DishonestTradeAdvancedRequest =
  | {
      mode: "ACTUAL_RATE_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE";
      quotedSellingPricePerNominalQuantity: Money;
      trueQuantity: bigint;
      deliveredQuantity: bigint;
      actualDirection: "PROFIT" | "LOSS";
      actualRatePercent: Rational;
    }
  | {
      mode: "ACTUAL_AMOUNT_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE";
      quotedSellingPricePerNominalQuantity: Money;
      trueQuantity: bigint;
      deliveredQuantity: bigint;
      actualDirection: "PROFIT" | "LOSS";
      actualAmount: Money;
    }
  | {
      mode: "BUY_HEAVY_SELL_LIGHT_TARGET_TO_DELIVERED_QUANTITY";
      purchasePricePerNominalQuantity: Money;
      sellingPricePerNominalQuantity: Money;
      receivedQuantity: bigint;
      targetDirection: "PROFIT" | "LOSS";
      targetRatePercent: Rational;
    }
  | {
      mode: "BUY_HEAVY_SELL_LIGHT_TARGET_TO_RECEIVED_QUANTITY";
      purchasePricePerNominalQuantity: Money;
      sellingPricePerNominalQuantity: Money;
      deliveredQuantity: bigint;
      targetDirection: "PROFIT" | "LOSS";
      targetRatePercent: Rational;
    }
  | {
      mode: "FALSE_QUANTITY_TO_EFFECTIVE_PRICE_PER_TRUE_QUANTITY";
      quotedSellingPricePerNominalQuantity: Money;
      trueQuantity: bigint;
      deliveredQuantity: bigint;
    }
  | {
      mode: "COMPARE_TWO_DISHONEST_SCHEMES";
      firstScheme: DishonestScheme;
      secondScheme: DishonestScheme;
    };

export type DishonestTradeAdvancedResult =
  | { mode: "ACTUAL_RATE_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE"; costPricePerTrueQuantity: Money }
  | { mode: "ACTUAL_AMOUNT_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE"; costPricePerTrueQuantity: Money }
  | { mode: "BUY_HEAVY_SELL_LIGHT_TARGET_TO_DELIVERED_QUANTITY"; deliveredQuantity: Rational }
  | { mode: "BUY_HEAVY_SELL_LIGHT_TARGET_TO_RECEIVED_QUANTITY"; receivedQuantity: Rational }
  | { mode: "FALSE_QUANTITY_TO_EFFECTIVE_PRICE_PER_TRUE_QUANTITY"; effectivePricePerTrueQuantity: Rational }
  | {
      mode: "COMPARE_TWO_DISHONEST_SCHEMES";
      moreProfitableScheme: "FIRST" | "SECOND" | "SAME";
      firstProfitPercent: Rational;
      secondProfitPercent: Rational;
      differencePercent: Rational;
    };

function validateQuantity(value: bigint, label: string): void {
  if (value <= 0n) throw new Error(`${label} must be positive.`);
}

function multiplier(direction: "PROFIT" | "LOSS", rate: Rational): Rational {
  if (rate.denominator <= 0n || rate.numerator < 0n) throw new Error("Rate must be non-negative.");
  if (direction === "LOSS" && rate.numerator >= 100n * rate.denominator) {
    throw new Error("Loss rate must be below 100%.");
  }
  const fraction = divideRational(rate, rational(100));
  return direction === "PROFIT"
    ? rational(fraction.denominator + fraction.numerator, fraction.denominator)
    : subtractRational(rational(1), fraction);
}

function exactMoney(value: Rational, label: string): Money {
  if (value.numerator % value.denominator !== 0n) throw new Error(`${label} is not an exact paise amount.`);
  return moneyFromPaise(value.numerator / value.denominator);
}

function schemeProfitPercent(scheme: DishonestScheme): Rational {
  validateQuantity(scheme.trueQuantity, "True quantity");
  validateQuantity(scheme.deliveredQuantity, "Delivered quantity");
  const cost = multiplyRational(
    rational(scheme.costPricePerTrueQuantity.paise),
    rational(scheme.deliveredQuantity, scheme.trueQuantity),
  );
  const revenue = rational(scheme.quotedSellingPricePerNominalQuantity.paise);
  const profit = subtractRational(revenue, cost);
  return asPercent(divideRational(profit, cost));
}

export function solveDishonestTradeAdvanced(
  request: DishonestTradeAdvancedRequest,
): DishonestTradeAdvancedResult {
  switch (request.mode) {
    case "ACTUAL_RATE_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE": {
      validateQuantity(request.trueQuantity, "True quantity");
      validateQuantity(request.deliveredQuantity, "Delivered quantity");
      const actualCostOfDelivered = divideRational(
        rational(request.quotedSellingPricePerNominalQuantity.paise),
        multiplier(request.actualDirection, request.actualRatePercent),
      );
      const costPerTrue = multiplyRational(
        actualCostOfDelivered,
        rational(request.trueQuantity, request.deliveredQuantity),
      );
      return { mode: request.mode, costPricePerTrueQuantity: exactMoney(costPerTrue, "Cost price") };
    }

    case "ACTUAL_AMOUNT_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE": {
      validateQuantity(request.trueQuantity, "True quantity");
      validateQuantity(request.deliveredQuantity, "Delivered quantity");
      const deliveredCostPaise = request.actualDirection === "PROFIT"
        ? request.quotedSellingPricePerNominalQuantity.paise - request.actualAmount.paise
        : request.quotedSellingPricePerNominalQuantity.paise + request.actualAmount.paise;
      if (deliveredCostPaise <= 0n) throw new Error("Actual delivered cost must be positive.");
      const costPerTrue = multiplyRational(
        rational(deliveredCostPaise),
        rational(request.trueQuantity, request.deliveredQuantity),
      );
      return { mode: request.mode, costPricePerTrueQuantity: exactMoney(costPerTrue, "Cost price") };
    }

    case "BUY_HEAVY_SELL_LIGHT_TARGET_TO_DELIVERED_QUANTITY": {
      validateQuantity(request.receivedQuantity, "Received quantity");
      const delivered = divideRational(
        rational(request.sellingPricePerNominalQuantity.paise * request.receivedQuantity),
        multiplyRational(
          rational(request.purchasePricePerNominalQuantity.paise),
          multiplier(request.targetDirection, request.targetRatePercent),
        ),
      );
      return { mode: request.mode, deliveredQuantity: delivered };
    }

    case "BUY_HEAVY_SELL_LIGHT_TARGET_TO_RECEIVED_QUANTITY": {
      validateQuantity(request.deliveredQuantity, "Delivered quantity");
      const received = divideRational(
        multiplyRational(
          rational(request.purchasePricePerNominalQuantity.paise * request.deliveredQuantity),
          multiplier(request.targetDirection, request.targetRatePercent),
        ),
        rational(request.sellingPricePerNominalQuantity.paise),
      );
      return { mode: request.mode, receivedQuantity: received };
    }

    case "FALSE_QUANTITY_TO_EFFECTIVE_PRICE_PER_TRUE_QUANTITY": {
      validateQuantity(request.trueQuantity, "True quantity");
      validateQuantity(request.deliveredQuantity, "Delivered quantity");
      return {
        mode: request.mode,
        effectivePricePerTrueQuantity: multiplyRational(
          rational(request.quotedSellingPricePerNominalQuantity.paise),
          rational(request.trueQuantity, request.deliveredQuantity),
        ),
      };
    }

    case "COMPARE_TWO_DISHONEST_SCHEMES": {
      const firstProfitPercent = schemeProfitPercent(request.firstScheme);
      const secondProfitPercent = schemeProfitPercent(request.secondScheme);
      const difference = subtractRational(firstProfitPercent, secondProfitPercent);
      return {
        mode: request.mode,
        moreProfitableScheme: difference.numerator > 0n ? "FIRST" : difference.numerator < 0n ? "SECOND" : "SAME",
        firstProfitPercent,
        secondProfitPercent,
        differencePercent: rational(
          difference.numerator < 0n ? -difference.numerator : difference.numerator,
          difference.denominator,
        ),
      };
    }
  }
}
