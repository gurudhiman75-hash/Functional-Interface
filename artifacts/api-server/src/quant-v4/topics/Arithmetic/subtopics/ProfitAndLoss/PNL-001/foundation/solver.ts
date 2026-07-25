import type { Money, Rational } from "./types";
import {
  costPriceFromAmountAndRate,
  costPriceFromSellingPriceAndRate,
  costSellingRatioFromRate,
  marginOnSellingFromProfitPercentOnCost,
  profitOrLossAmount,
  profitOrLossRateOnCost,
  profitPercentOnCostFromMarginOnSelling,
  rateFromAmountAndCost,
  rateFromCostSellingRatio,
  sellingPriceFromCostAndRate,
} from "./math";
import { createPriceLedger } from "./ledgers";
import { moneyFromPaise } from "./money";

export type FundamentalSolveRequest =
  | { mode: "CP_SP_TO_AMOUNT"; costPrice: Money; sellingPrice: Money }
  | { mode: "CP_SP_TO_RATE"; costPrice: Money; sellingPrice: Money }
  | { mode: "CP_RATE_TO_SP"; costPrice: Money; direction: "PROFIT" | "LOSS"; ratePercent: Rational }
  | { mode: "SP_RATE_TO_CP"; sellingPrice: Money; direction: "PROFIT" | "LOSS"; ratePercent: Rational }
  | { mode: "AMOUNT_RATE_TO_CP"; amount: Money; direction: "PROFIT" | "LOSS"; ratePercent: Rational }
  | { mode: "AMOUNT_CP_TO_RATE"; amount: Money; costPrice: Money; direction: "PROFIT" | "LOSS" }
  | { mode: "CP_SP_RATIO_TO_RATE"; costPart: Rational; sellingPart: Rational }
  | { mode: "RATE_TO_CP_SP_RATIO"; direction: "PROFIT" | "LOSS"; ratePercent: Rational }
  | { mode: "MARGIN_SP_TO_PROFIT_CP"; marginPercent: Rational }
  | { mode: "PROFIT_CP_TO_MARGIN_SP"; profitPercent: Rational };

export type FundamentalSolveResult =
  | { mode: "CP_SP_TO_AMOUNT"; direction: "PROFIT" | "LOSS" | "NO_CHANGE"; amount: Money }
  | { mode: "CP_SP_TO_RATE"; direction: "PROFIT" | "LOSS" | "NO_CHANGE"; ratePercent: Rational }
  | { mode: "CP_RATE_TO_SP"; sellingPrice: Money }
  | { mode: "SP_RATE_TO_CP"; costPrice: Money }
  | { mode: "AMOUNT_RATE_TO_CP"; costPrice: Money }
  | { mode: "AMOUNT_CP_TO_RATE"; direction: "PROFIT" | "LOSS"; ratePercent: Rational }
  | { mode: "CP_SP_RATIO_TO_RATE"; direction: "PROFIT" | "LOSS" | "NO_CHANGE"; ratePercent: Rational }
  | { mode: "RATE_TO_CP_SP_RATIO"; costPart: Rational; sellingPart: Rational }
  | { mode: "MARGIN_SP_TO_PROFIT_CP"; profitPercent: Rational }
  | { mode: "PROFIT_CP_TO_MARGIN_SP"; marginPercent: Rational };

export function solveFundamental(request: FundamentalSolveRequest): FundamentalSolveResult {
  switch (request.mode) {
    case "CP_SP_TO_AMOUNT": {
      const delta = profitOrLossAmount(createPriceLedger(request));
      const direction = delta.paise > 0n ? "PROFIT" : delta.paise < 0n ? "LOSS" : "NO_CHANGE";
      return {
        mode: request.mode,
        direction,
        amount: moneyFromPaise(delta.paise < 0n ? -delta.paise : delta.paise),
      };
    }
    case "CP_SP_TO_RATE": {
      const result = profitOrLossRateOnCost(createPriceLedger(request));
      return { mode: request.mode, direction: result.direction, ratePercent: result.rate };
    }
    case "CP_RATE_TO_SP":
      return {
        mode: request.mode,
        sellingPrice: sellingPriceFromCostAndRate(request),
      };
    case "SP_RATE_TO_CP":
      return {
        mode: request.mode,
        costPrice: costPriceFromSellingPriceAndRate(request),
      };
    case "AMOUNT_RATE_TO_CP":
      return {
        mode: request.mode,
        costPrice: costPriceFromAmountAndRate(request),
      };
    case "AMOUNT_CP_TO_RATE":
      return {
        mode: request.mode,
        direction: request.direction,
        ratePercent: rateFromAmountAndCost(request),
      };
    case "CP_SP_RATIO_TO_RATE": {
      const result = rateFromCostSellingRatio(request);
      return { mode: request.mode, direction: result.direction, ratePercent: result.rate };
    }
    case "RATE_TO_CP_SP_RATIO": {
      const ratio = costSellingRatioFromRate(request);
      return { mode: request.mode, ...ratio };
    }
    case "MARGIN_SP_TO_PROFIT_CP":
      return {
        mode: request.mode,
        profitPercent: profitPercentOnCostFromMarginOnSelling(request.marginPercent),
      };
    case "PROFIT_CP_TO_MARGIN_SP":
      return {
        mode: request.mode,
        marginPercent: marginOnSellingFromProfitPercentOnCost(request.profitPercent),
      };
  }
}
