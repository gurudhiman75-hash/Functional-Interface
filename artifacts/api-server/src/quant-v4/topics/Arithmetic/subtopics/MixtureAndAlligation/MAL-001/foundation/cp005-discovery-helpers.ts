import {
  addRational,
  multiplyRational,
  rational,
  reduceRationalRatio,
  subtractRational,
} from "./rational";
import { moneyText, percentText, quantityText, ratioText } from "./cp005-discovery-core";
import type { MalCp005SolveResult } from "./cp005-types";
import type { Rational } from "./types";

export const HUNDRED = rational(100);
export const r = (n: number, d = 1) => rational(n, d);
export function actorPhrase(actor: string): string { return `${/^[aeiou]/iu.test(actor) ? "An" : "A"} ${actor}`; }
export function expectPercent(result: MalCp005SolveResult): Rational {
  if (result.kind !== "PERCENT") throw new Error("Expected percent result.");
  return result.value;
}
export function expectQuantity(result: MalCp005SolveResult): Rational {
  if (result.kind !== "QUANTITY") throw new Error("Expected quantity result.");
  return result.value;
}
export function expectRate(result: MalCp005SolveResult): Rational {
  if (result.kind !== "SELLING_RATE") throw new Error("Expected selling-rate result.");
  return result.value;
}
export function expectRatio(result: MalCp005SolveResult): [Rational, Rational] {
  if (result.kind !== "RATIO") throw new Error("Expected ratio result.");
  return [result.firstPart, result.secondPart];
}
export function reducedRatio(first: Rational, second: Rational): string {
  const [a, b] = reduceRationalRatio(first, second);
  return ratioText(a, b);
}
export function profitAmount(cost: Rational, revenue: Rational): Rational {
  return subtractRational(revenue, cost);
}
export function freeLedger(input: {
  title: string; unit: "litres" | "kg"; pure: Rational; adulterant: Rational;
  pureCost: Rational; sellingRate: Rational; result: Rational;
}) {
  const total = addRational(input.pure, input.adulterant);
  const cost = multiplyRational(input.pure, input.pureCost);
  const revenue = multiplyRational(total, input.sellingRate);
  return {
    type: "COMMERCIAL_MIXTURE_LEDGER" as const, title: input.title,
    costBaseLabel: "Actual cost of the paid pure product",
    rows: [{ stage: "Final sale", pureQuantity: quantityText(input.pure, input.unit), adulterantQuantity: quantityText(input.adulterant, input.unit), totalQuantity: quantityText(total, input.unit), actualCost: moneyText(cost), revenue: moneyText(revenue), commercialResult: `${moneyText(profitAmount(cost, revenue))} profit = ${percentText(input.result)}` }],
    accessibleText: `Only ${quantityText(input.pure, input.unit)} is paid for, while ${quantityText(total, input.unit)} is sold.`,
  };
}
export function cheaperLedger(input: {
  title: string; unit: "litres" | "kg"; pure: Rational; adulterant: Rational;
  pureCost: Rational; adulterantCost: Rational; sellingRate: Rational; result: Rational;
}) {
  const total = addRational(input.pure, input.adulterant);
  const pureCostTotal = multiplyRational(input.pure, input.pureCost);
  const adulterantCostTotal = multiplyRational(input.adulterant, input.adulterantCost);
  const cost = addRational(pureCostTotal, adulterantCostTotal);
  const revenue = multiplyRational(total, input.sellingRate);
  return {
    type: "COMMERCIAL_MIXTURE_LEDGER" as const, title: input.title,
    costBaseLabel: "Actual combined cost of both ingredients",
    rows: [{ stage: "Final sale", pureQuantity: quantityText(input.pure, input.unit), adulterantQuantity: quantityText(input.adulterant, input.unit), totalQuantity: quantityText(total, input.unit), actualCost: moneyText(cost), revenue: moneyText(revenue), commercialResult: `${moneyText(profitAmount(cost, revenue))} profit = ${percentText(input.result)}` }],
    accessibleText: `The actual cost includes both ingredients: ${moneyText(pureCostTotal)} plus ${moneyText(adulterantCostTotal)}.`,
  };
}
