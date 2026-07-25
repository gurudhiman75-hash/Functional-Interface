import type { FundamentalSolveRequest, FundamentalSolveResult } from "./solver";
import { formatMoney } from "./money";
import { rationalToNumber } from "./rational";

const money = (value: { paise: bigint }) => formatMoney(value, "INR", "en-IN");
const rate = (value: { numerator: bigint; denominator: bigint }) => `${rationalToNumber(value)}%`;
const ratioPart = (value: { numerator: bigint; denominator: bigint }) =>
  value.denominator === 1n ? String(value.numerator) : `${value.numerator}/${value.denominator}`;

export function renderFundamentalExplanation(
  request: FundamentalSolveRequest,
  result: FundamentalSolveResult,
): readonly string[] {
  switch (result.mode) {
    case "CP_SP_TO_AMOUNT":
      return [
        "Compare the selling price with the cost price.",
        `${result.direction === "LOSS" ? "Loss" : result.direction === "PROFIT" ? "Profit" : "Difference"} = ${money(result.amount)}.`,
      ];
    case "CP_SP_TO_RATE":
      return [
        "Find the absolute difference between selling price and cost price.",
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
    case "AMOUNT_RATE_TO_CP":
      return [
        "Treat the stated profit or loss amount as the given percentage of cost price.",
        `Cost price = amount × 100 ÷ rate = ${money(result.costPrice)}.`,
      ];
    case "AMOUNT_CP_TO_RATE":
      return [
        "Use cost price as the percentage base.",
        `${request.direction === "PROFIT" ? "Profit" : "Loss"} percentage = amount ÷ cost price × 100 = ${rate(result.ratePercent)}.`,
      ];
    case "CP_SP_RATIO_TO_RATE":
      return [
        "Compare the selling-price part with the cost-price part.",
        `The difference as a percentage of the cost-price part gives ${rate(result.ratePercent)} ${result.direction.toLowerCase()}.`,
      ];
    case "RATE_TO_CP_SP_RATIO":
      return [
        "Take cost price as one unit and apply the stated rate.",
        `CP:SP = ${ratioPart(result.costPart)}:${ratioPart(result.sellingPart)}.`,
      ];
    case "MARGIN_SP_TO_PROFIT_CP":
      return [
        "Margin is based on selling price, so first recover the corresponding cost-price base.",
        `The equivalent profit percentage on cost price is ${rate(result.profitPercent)}.`,
      ];
    case "PROFIT_CP_TO_MARGIN_SP":
      return [
        "Profit percentage is based on cost price, while margin is based on selling price.",
        `The equivalent margin on selling price is ${rate(result.marginPercent)}.`,
      ];
  }
}
