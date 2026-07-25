import type { Money, Rational } from "./types";
import {
  costPriceFromSellingPriceAndRate,
  profitOrLossAmount,
  profitOrLossRateOnCost,
  sellingPriceFromCostAndRate,
} from "./math";
import { createPriceLedger } from "./ledgers";
import { moneyFromPaise } from "./money";

export type FundamentalSolveRequest =
  | { mode: "CP_SP_TO_AMOUNT"; costPrice: Money; sellingPrice: Money }
  | { mode: "CP_SP_TO_RATE"; costPrice: Money; sellingPrice: Money }
  | { mode: "CP_RATE_TO_SP"; costPrice: Money; direction: "PROFIT" | "LOSS"; ratePercent: Rational }
  | { mode: "SP_RATE_TO_CP"; sellingPrice: Money; direction: "PROFIT" | "LOSS"; ratePercent: Rational };

export type FundamentalSolveResult =
  | { mode: "CP_SP_TO_AMOUNT"; direction: "PROFIT" | "LOSS" | "NO_CHANGE"; amount: Money }
  | { mode: "CP_SP_TO_RATE"; direction: "PROFIT" | "LOSS" | "NO_CHANGE"; ratePercent: Rational }
  | { mode: "CP_RATE_TO_SP"; sellingPrice: Money }
  | { mode: "SP_RATE_TO_CP"; costPrice: Money };

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
        sellingPrice: sellingPriceFromCostAndRate({
          costPrice: request.costPrice,
          direction: request.direction,
          ratePercent: request.ratePercent,
        }),
      };
    case "SP_RATE_TO_CP":
      return {
        mode: request.mode,
        costPrice: costPriceFromSellingPriceAndRate({
          sellingPrice: request.sellingPrice,
          direction: request.direction,
          ratePercent: request.ratePercent,
        }),
      };
  }
}
