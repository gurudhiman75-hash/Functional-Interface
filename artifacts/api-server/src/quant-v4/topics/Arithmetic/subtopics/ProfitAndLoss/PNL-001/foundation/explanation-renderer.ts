import type { FundamentalSolveRequest, FundamentalSolveResult } from "./solver";
import { formatMoney } from "./money";

const money = (value: { paise: bigint }) => formatMoney(value, "INR", "en-IN");
const fraction = (value: { numerator: bigint; denominator: bigint }) =>
  value.denominator === 1n ? String(value.numerator) : `${value.numerator}/${value.denominator}`;
const rate = (value: { numerator: bigint; denominator: bigint }) => `${fraction(value)}%`;

export function renderFundamentalExplanation(
  request: FundamentalSolveRequest,
  result: FundamentalSolveResult,
): readonly string[] {
  switch (result.mode) {
    case "CP_SP_TO_AMOUNT":
      return ["Compare selling price with cost price.", `${result.direction === "LOSS" ? "Loss" : result.direction === "PROFIT" ? "Profit" : "Difference"} = ${money(result.amount)}.`];
    case "CP_RATE_TO_AMOUNT":
      return ["Apply the declared rate to cost price.", `${request.direction === "PROFIT" ? "Profit" : "Loss"} amount = ${money(result.amount)}.`];
    case "CP_AMOUNT_TO_SP":
      return [`${request.direction === "PROFIT" ? "Add profit" : "Subtract loss"} from cost price.`, `Selling price = ${money(result.sellingPrice)}.`];
    case "SP_AMOUNT_TO_CP":
      return [`Reverse the stated ${request.direction.toLowerCase()} amount from selling price.`, `Cost price = ${money(result.costPrice)}.`];
    case "CP_SP_TO_RATE":
      return ["Find the absolute difference between selling price and cost price.", `Use cost price as the percentage base: ${rate(result.ratePercent)} ${result.direction.toLowerCase()}.`];
    case "CP_RATE_TO_SP":
      return [`Apply the ${request.direction.toLowerCase()} multiplier to cost price.`, `Selling price = ${money(result.sellingPrice)}.`];
    case "SP_RATE_TO_CP":
      return [`Reverse the ${request.direction.toLowerCase()} multiplier from selling price.`, `Cost price = ${money(result.costPrice)}.`];
    case "AMOUNT_RATE_TO_CP":
      return ["The amount equals the stated percentage of cost price.", `Cost price = amount × 100/rate = ${money(result.costPrice)}.`];
    case "AMOUNT_CP_TO_RATE":
      return ["Use cost price as the denominator.", `${request.direction === "PROFIT" ? "Profit" : "Loss"}% = amount/cost price × 100 = ${rate(result.ratePercent)}.`];
    case "CP_SP_RATIO_TO_RATE":
      return ["Treat the cost-price ratio part as the percentage base.", `The ratio implies ${rate(result.ratePercent)} ${result.direction.toLowerCase()}.`];
    case "RATE_TO_CP_SP_RATIO":
      return ["Take cost price as one unit and apply the stated rate.", `CP:SP = ${fraction(result.costPart)}:${fraction(result.sellingPart)}.`];
    case "MARGIN_SP_TO_PROFIT_CP":
      return ["Profit is measured on selling price, so first recover the cost-price share.", `Profit percentage on cost price = ${rate(result.profitPercent)}.`];
    case "PROFIT_CP_TO_MARGIN_SP":
      return ["Convert the cost-price profit rate to the selling-price base.", `Profit margin on selling price = ${rate(result.marginPercent)}.`];
    case "FRACTION_TO_RATE":
      return [`Convert the stated fraction on the ${request.fractionBase === "COST_PRICE" ? "cost-price" : "selling-price"} base.`, `${request.direction === "PROFIT" ? "Profit" : "Loss"} percentage on cost price = ${rate(result.ratePercent)}.`];
    case "RATE_TO_FRACTION":
      return [`Convert the cost-price rate to the requested ${request.fractionBase === "COST_PRICE" ? "cost-price" : "selling-price"} fraction.`, `Required fraction = ${fraction(result.amountFraction)}.`];
    case "CP_TWO_RATES_TO_SP_DIFFERENCE":
      return ["Compute both selling prices from the same cost price.", `Their absolute difference is ${money(result.difference)}.`];
    case "SP_DIFFERENCE_TWO_RATES_TO_CP":
      return ["The selling-price difference equals cost price multiplied by the difference of the two commercial multipliers.", `Cost price = ${money(result.costPrice)}.`];
    case "TWO_SELLING_CONDITIONS_TO_SECOND_RATE":
      return ["Recover cost price from the first selling condition, then compare the second selling price with it.", `The second sale gives ${rate(result.ratePercent)} ${result.direction.toLowerCase()}.`];
  }
}
