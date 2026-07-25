import type { FundamentalSolveRequest, FundamentalSolveResult } from "./solver";
import { formatMoney } from "./money";
import { rationalToNumber } from "./rational";

const money = (value: { paise: bigint }) => formatMoney(value, "INR", "en-IN");
const rate = (value: { numerator: bigint; denominator: bigint }) => `${rationalToNumber(value)}%`;

export function renderFundamentalExplanation(
  request: FundamentalSolveRequest,
  result: FundamentalSolveResult,
): readonly string[] {
  switch (result.mode) {
    case "CP_SP_TO_AMOUNT":
      return [
        `Compare the selling price with the cost price.`,
        `${result.direction === "LOSS" ? "Loss" : result.direction === "PROFIT" ? "Profit" : "Difference"} = ${money(result.amount)}.`,
      ];
    case "CP_SP_TO_RATE":
      return [
        `Find the absolute difference between selling price and cost price.`,
        `Use cost price as the percentage base, giving ${rate(result.ratePercent)} ${result.direction.toLowerCase()}.`,
      ];
    case "CP_RATE_TO_SP":
      return [
        `Apply the declared ${request.direction.toLowerCase()} rate to the cost price.`,
        `Selling price = ${money(result.sellingPrice)}.`,
      ];
    case "SP_RATE_TO_CP":
      return [
        `Reverse the declared ${request.direction.toLowerCase()} multiplier from the selling price.`,
        `Cost price = ${money(result.costPrice)}.`,
      ];
  }
}
