import type { Money, Rational } from "./types";
import {
  amountFractionFromRate,
  amountFromCostAndRate,
  costPriceFromAmountAndRate,
  costPriceFromSellingPriceAndAmount,
  costPriceFromSellingPriceAndRate,
  costPriceFromSellingPriceDifference,
  costSellingRatioFromRate,
  marginOnSellingFromProfitPercentOnCost,
  profitOrLossAmount,
  profitOrLossRateOnCost,
  profitPercentOnCostFromMarginOnSelling,
  rateFromAmountAndCost,
  rateFromAmountFraction,
  rateFromCostSellingRatio,
  secondConditionRate,
  sellingPriceDifferenceFromCostAndRates,
  sellingPriceFromCostAndAmount,
  sellingPriceFromCostAndRate,
} from "./math";
import { createPriceLedger } from "./ledgers";
import { moneyFromPaise } from "./money";

export type FundamentalSolveRequest =
  | { mode: "CP_SP_TO_AMOUNT"; costPrice: Money; sellingPrice: Money }
  | { mode: "CP_RATE_TO_AMOUNT"; costPrice: Money; direction: "PROFIT" | "LOSS"; ratePercent: Rational }
  | { mode: "CP_AMOUNT_TO_SP"; costPrice: Money; amount: Money; direction: "PROFIT" | "LOSS" }
  | { mode: "SP_AMOUNT_TO_CP"; sellingPrice: Money; amount: Money; direction: "PROFIT" | "LOSS" }
  | { mode: "CP_SP_TO_RATE"; costPrice: Money; sellingPrice: Money }
  | { mode: "CP_RATE_TO_SP"; costPrice: Money; direction: "PROFIT" | "LOSS"; ratePercent: Rational }
  | { mode: "SP_RATE_TO_CP"; sellingPrice: Money; direction: "PROFIT" | "LOSS"; ratePercent: Rational }
  | { mode: "AMOUNT_RATE_TO_CP"; amount: Money; direction: "PROFIT" | "LOSS"; ratePercent: Rational }
  | { mode: "AMOUNT_CP_TO_RATE"; amount: Money; costPrice: Money; direction: "PROFIT" | "LOSS" }
  | { mode: "CP_SP_RATIO_TO_RATE"; costPart: Rational; sellingPart: Rational }
  | { mode: "RATE_TO_CP_SP_RATIO"; direction: "PROFIT" | "LOSS"; ratePercent: Rational }
  | { mode: "MARGIN_SP_TO_PROFIT_CP"; marginPercent: Rational }
  | { mode: "PROFIT_CP_TO_MARGIN_SP"; profitPercent: Rational }
  | { mode: "FRACTION_TO_RATE"; direction: "PROFIT" | "LOSS"; amountFraction: Rational; fractionBase: "COST_PRICE" | "SELLING_PRICE" }
  | { mode: "RATE_TO_FRACTION"; direction: "PROFIT" | "LOSS"; ratePercent: Rational; fractionBase: "COST_PRICE" | "SELLING_PRICE" }
  | { mode: "CP_TWO_RATES_TO_SP_DIFFERENCE"; costPrice: Money; firstDirection: "PROFIT" | "LOSS"; firstRatePercent: Rational; secondDirection: "PROFIT" | "LOSS"; secondRatePercent: Rational }
  | { mode: "SP_DIFFERENCE_TWO_RATES_TO_CP"; difference: Money; firstDirection: "PROFIT" | "LOSS"; firstRatePercent: Rational; secondDirection: "PROFIT" | "LOSS"; secondRatePercent: Rational }
  | { mode: "TWO_SELLING_CONDITIONS_TO_SECOND_RATE"; firstSellingPrice: Money; firstDirection: "PROFIT" | "LOSS"; firstRatePercent: Rational; secondSellingPrice: Money };

export type FundamentalSolveResult =
  | { mode: "CP_SP_TO_AMOUNT"; direction: "PROFIT" | "LOSS" | "NO_CHANGE"; amount: Money }
  | { mode: "CP_RATE_TO_AMOUNT"; amount: Money }
  | { mode: "CP_AMOUNT_TO_SP"; sellingPrice: Money }
  | { mode: "SP_AMOUNT_TO_CP"; costPrice: Money }
  | { mode: "CP_SP_TO_RATE"; direction: "PROFIT" | "LOSS" | "NO_CHANGE"; ratePercent: Rational }
  | { mode: "CP_RATE_TO_SP"; sellingPrice: Money }
  | { mode: "SP_RATE_TO_CP"; costPrice: Money }
  | { mode: "AMOUNT_RATE_TO_CP"; costPrice: Money }
  | { mode: "AMOUNT_CP_TO_RATE"; direction: "PROFIT" | "LOSS"; ratePercent: Rational }
  | { mode: "CP_SP_RATIO_TO_RATE"; direction: "PROFIT" | "LOSS" | "NO_CHANGE"; ratePercent: Rational }
  | { mode: "RATE_TO_CP_SP_RATIO"; costPart: Rational; sellingPart: Rational }
  | { mode: "MARGIN_SP_TO_PROFIT_CP"; profitPercent: Rational }
  | { mode: "PROFIT_CP_TO_MARGIN_SP"; marginPercent: Rational }
  | { mode: "FRACTION_TO_RATE"; ratePercent: Rational }
  | { mode: "RATE_TO_FRACTION"; amountFraction: Rational }
  | { mode: "CP_TWO_RATES_TO_SP_DIFFERENCE"; difference: Money }
  | { mode: "SP_DIFFERENCE_TWO_RATES_TO_CP"; costPrice: Money }
  | { mode: "TWO_SELLING_CONDITIONS_TO_SECOND_RATE"; direction: "PROFIT" | "LOSS" | "NO_CHANGE"; ratePercent: Rational };

export function solveFundamental(request: FundamentalSolveRequest): FundamentalSolveResult {
  switch (request.mode) {
    case "CP_SP_TO_AMOUNT": {
      const delta = profitOrLossAmount(createPriceLedger(request));
      const direction = delta.paise > 0n ? "PROFIT" : delta.paise < 0n ? "LOSS" : "NO_CHANGE";
      return { mode: request.mode, direction, amount: moneyFromPaise(delta.paise < 0n ? -delta.paise : delta.paise) };
    }
    case "CP_RATE_TO_AMOUNT": return { mode: request.mode, amount: amountFromCostAndRate(request) };
    case "CP_AMOUNT_TO_SP": return { mode: request.mode, sellingPrice: sellingPriceFromCostAndAmount(request) };
    case "SP_AMOUNT_TO_CP": return { mode: request.mode, costPrice: costPriceFromSellingPriceAndAmount(request) };
    case "CP_SP_TO_RATE": {
      const result = profitOrLossRateOnCost(createPriceLedger(request));
      return { mode: request.mode, direction: result.direction, ratePercent: result.rate };
    }
    case "CP_RATE_TO_SP": return { mode: request.mode, sellingPrice: sellingPriceFromCostAndRate(request) };
    case "SP_RATE_TO_CP": return { mode: request.mode, costPrice: costPriceFromSellingPriceAndRate(request) };
    case "AMOUNT_RATE_TO_CP": return { mode: request.mode, costPrice: costPriceFromAmountAndRate(request) };
    case "AMOUNT_CP_TO_RATE": return { mode: request.mode, direction: request.direction, ratePercent: rateFromAmountAndCost(request) };
    case "CP_SP_RATIO_TO_RATE": {
      const result = rateFromCostSellingRatio(request);
      return { mode: request.mode, direction: result.direction, ratePercent: result.rate };
    }
    case "RATE_TO_CP_SP_RATIO": return { mode: request.mode, ...costSellingRatioFromRate(request) };
    case "MARGIN_SP_TO_PROFIT_CP": return { mode: request.mode, profitPercent: profitPercentOnCostFromMarginOnSelling(request.marginPercent) };
    case "PROFIT_CP_TO_MARGIN_SP": return { mode: request.mode, marginPercent: marginOnSellingFromProfitPercentOnCost(request.profitPercent) };
    case "FRACTION_TO_RATE": return { mode: request.mode, ratePercent: rateFromAmountFraction(request) };
    case "RATE_TO_FRACTION": return { mode: request.mode, amountFraction: amountFractionFromRate(request) };
    case "CP_TWO_RATES_TO_SP_DIFFERENCE": return { mode: request.mode, difference: sellingPriceDifferenceFromCostAndRates(request) };
    case "SP_DIFFERENCE_TWO_RATES_TO_CP": return { mode: request.mode, costPrice: costPriceFromSellingPriceDifference(request) };
    case "TWO_SELLING_CONDITIONS_TO_SECOND_RATE": {
      const result = secondConditionRate(request);
      return { mode: request.mode, direction: result.direction, ratePercent: result.rate };
    }
  }
}
