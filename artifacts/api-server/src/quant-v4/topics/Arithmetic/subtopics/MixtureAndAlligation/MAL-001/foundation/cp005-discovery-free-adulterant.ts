import {
  addRational, divideRational, formatRational, multiplyRational, rational,
  reduceRationalRatio, subtractRational,
} from "./rational";
import { buildOptions, moneyText, packageQuestion, percentText, pick, quantityText, rateText, ratioText } from "./cp005-discovery-core";
import { solveMalCp005 } from "./cp005-solver";
import type { MalCp005DiscoveryQuestion, MalCp005SolveRequest } from "./cp005-types";
import type { Rational } from "./types";
import { HUNDRED, actorPhrase, cheaperLedger, expectPercent, expectQuantity, expectRate, expectRatio, freeLedger, profitAmount, r, reducedRatio } from "./cp005-discovery-helpers";
import { FREE_ADULTERANT_CASES } from "./cp005-discovery-data";

export function freeProfitFromQuantitiesQuestion(seed: string): MalCp005DiscoveryQuestion {
  const prototypeId = "MAL-CP005-PROT-PROFIT-FROM-FREE-ADULTERANT-QUANTITIES" as const;
  const selected = pick(FREE_ADULTERANT_CASES, `${seed}:case`);
  const pure = r(selected.pure);
  const adulterant = r(selected.adulterantQty);
  const pureCost = r(selected.pureCost);
  const request: Extract<MalCp005SolveRequest, { mode: "FREE_ADULTERANT_PROFIT_FROM_QUANTITIES" }> = {
    mode: "FREE_ADULTERANT_PROFIT_FROM_QUANTITIES",
    pureQuantity: pure,
    adulterantQuantity: adulterant,
  };
  const profit = expectPercent(solveMalCp005(request));
  const total = addRational(pure, adulterant);
  const finalAdulterantPercent = multiplyRational(divideRational(adulterant, total), HUNDRED);
  const answer = percentText(profit);
  const purePercentOfFinal = multiplyRational(divideRational(pure, total), HUNDRED);
  const reducedBaseError = multiplyRational(divideRational(adulterant, subtractRational(pure, adulterant)), HUNDRED);
  const options = buildOptions(answer, [
    { text: percentText(finalAdulterantPercent), misconceptionId: "used_final_mixture_as_profit_base" },
    { text: percentText(purePercentOfFinal), misconceptionId: "reported_pure_share_of_final_mixture" },
    { text: percentText(reducedBaseError), misconceptionId: "subtracted_adulterant_from_cost_base" },
    { text: percentText(addRational(profit, finalAdulterantPercent)), misconceptionId: "added_two_incompatible_percentage_bases" },
  ], `${seed}:options`);
  return packageQuestion({
    prototypeId,
    seed,
    request,
    stem: `${actorPhrase(selected.actor)} adds ${selected.adulterantQty} ${selected.unit} of ${selected.adulterant} to ${selected.pure} ${selected.unit} of pure ${selected.product} and sells the mixture at the cost price of pure ${selected.product}. What is the profit percentage?`,
    answer,
    options,
    explanation: {
      layoutId: "MAL-CP005-EN-COMMERCIAL-MIXTURE-DISCOVERY-V1",
      concept: `The ${selected.adulterant} is free. Therefore, the cost base is only the ${selected.pure} ${selected.unit} of pure ${selected.product}, while the extra quantity is sold at the same rate.`,
      calculation: [
        `Paid quantity = ${selected.pure} ${selected.unit}; free quantity sold = ${selected.adulterantQty} ${selected.unit}.`,
        `Profit percentage = ${selected.adulterantQty}/${selected.pure} × 100 = ${answer}.`,
      ],
      verification: `On a cost of ${moneyText(multiplyRational(pure, pureCost))}, the extra receipt is ${moneyText(multiplyRational(adulterant, pureCost))}; their ratio is ${answer}.`,
      conclusion: `The profit percentage is ${answer}.`,
      fastMethod: "When a free adulterant is sold at the pure product's cost price, profit % = adulterant quantity ÷ pure quantity × 100.",
      commonMistake: "Profit percentage is measured on the paid pure quantity, not on the final mixture quantity.",
    },
    commercialLedger: freeLedger({ title: "Free-adulterant sale at pure-product cost price", unit: selected.unit, pure, adulterant, pureCost, sellingRate: pureCost, result: profit }),
  });
}

export function ratioFromTargetProfitAtPureCostQuestion(seed: string): MalCp005DiscoveryQuestion {
  const prototypeId = "MAL-CP005-PROT-RATIO-FROM-TARGET-PROFIT-AT-PURE-COST" as const;
  const selected = pick(FREE_ADULTERANT_CASES, `${seed}:case`);
  const pure = r(selected.pure);
  const adulterant = r(selected.adulterantQty);
  const targetProfit = multiplyRational(divideRational(adulterant, pure), HUNDRED);
  const request: Extract<MalCp005SolveRequest, { mode: "FREE_ADULTERANT_RATIO_FROM_TARGET_PROFIT" }> = {
    mode: "FREE_ADULTERANT_RATIO_FROM_TARGET_PROFIT",
    targetProfitPercent: targetProfit,
  };
  const [first, second] = expectRatio(solveMalCp005(request));
  const answer = ratioText(first, second);
  const options = buildOptions(answer, [
    { text: ratioText(second, first), misconceptionId: "ratio_reversed" },
    { text: reducedRatio(subtractRational(HUNDRED, targetProfit), targetProfit), misconceptionId: "treated_profit_as_final_mixture_percentage" },
    { text: reducedRatio(addRational(HUNDRED, targetProfit), targetProfit), misconceptionId: "used_final_total_as_pure_quantity" },
    { text: reducedRatio(HUNDRED, subtractRational(HUNDRED, targetProfit)), misconceptionId: "used_complement_of_profit" },
  ], `${seed}:options`);
  const pureCost = r(selected.pureCost);
  return packageQuestion({
    prototypeId,
    seed,
    request,
    stem: `${actorPhrase(selected.actor)} sells a ${selected.product}-${selected.adulterant} mixture at the cost price of pure ${selected.product} and makes ${percentText(targetProfit)} profit. In what ratio should pure ${selected.product} and ${selected.adulterant} be mixed?`,
    answer,
    options,
    explanation: {
      layoutId: "MAL-CP005-EN-COMMERCIAL-MIXTURE-DISCOVERY-V1",
      concept: `Every ${selected.adulterant} unit is free and becomes profit when the mixture is sold at the pure-product cost price.`,
      calculation: [
        `Take pure ${selected.product} cost as 100 parts. A ${percentText(targetProfit)} gain requires ${formatRational(targetProfit)} free parts.`,
        `Pure ${selected.product} : ${selected.adulterant} = 100 : ${formatRational(targetProfit)} = ${answer}.`,
      ],
      verification: `Using ${answer}, free quantity as a percentage of paid pure quantity is ${percentText(targetProfit)}.`,
      conclusion: `The required pure ${selected.product} : ${selected.adulterant} ratio is ${answer}.`,
      fastMethod: "At pure-product cost price, pure product : free adulterant = 100 : profit percentage.",
      commonMistake: "Do not use adulterant as a percentage of the final mixture; profit is calculated on actual cost.",
    },
    commercialLedger: freeLedger({ title: "Normalized target-profit ratio", unit: selected.unit, pure: first, adulterant: second, pureCost, sellingRate: pureCost, result: targetProfit }),
  });
}

export function adulterantQuantityFromPureQuestion(seed: string): MalCp005DiscoveryQuestion {
  const prototypeId = "MAL-CP005-PROT-ADULTERANT-QUANTITY-FROM-PURE-AND-TARGET-PROFIT" as const;
  const selected = pick(FREE_ADULTERANT_CASES, `${seed}:case`);
  const pure = r(selected.pure);
  const targetProfit = multiplyRational(divideRational(r(selected.adulterantQty), pure), HUNDRED);
  const request: Extract<MalCp005SolveRequest, { mode: "FREE_ADULTERANT_QUANTITY_FROM_PURE_AND_TARGET" }> = {
    mode: "FREE_ADULTERANT_QUANTITY_FROM_PURE_AND_TARGET",
    pureQuantity: pure,
    targetProfitPercent: targetProfit,
  };
  const adulterant = expectQuantity(solveMalCp005(request));
  const total = addRational(pure, adulterant);
  const answer = quantityText(adulterant, selected.unit);
  const options = buildOptions(answer, [
    { text: quantityText(divideRational(multiplyRational(pure, targetProfit), addRational(HUNDRED, targetProfit)), selected.unit), misconceptionId: "used_final_mixture_as_base" },
    { text: quantityText(total, selected.unit), misconceptionId: "reported_final_mixture_quantity" },
    { text: quantityText(divideRational(multiplyRational(pure, targetProfit), subtractRational(HUNDRED, targetProfit)), selected.unit), misconceptionId: "used_pure_share_as_wrong_denominator" },
    { text: quantityText(multiplyRational(pure, divideRational(addRational(HUNDRED, targetProfit), HUNDRED)), selected.unit), misconceptionId: "reported_revenue_equivalent_quantity" },
  ], `${seed}:options`);
  const pureCost = r(selected.pureCost);
  return packageQuestion({
    prototypeId,
    seed,
    request,
    stem: `${actorPhrase(selected.actor)} has ${selected.pure} ${selected.unit} of pure ${selected.product}. How much ${selected.adulterant} should be added so that selling the mixture at the cost price of pure ${selected.product} gives ${percentText(targetProfit)} profit?`,
    answer,
    options,
    explanation: {
      layoutId: "MAL-CP005-EN-COMMERCIAL-MIXTURE-DISCOVERY-V1",
      concept: `At the pure-product cost price, the value of the free ${selected.adulterant} is the entire profit.`,
      calculation: [
        `${selected.adulterant} needed = ${selected.pure} × ${formatRational(targetProfit)}/100.`,
        `${selected.adulterant} needed = ${answer}.`,
      ],
      verification: `${formatRational(adulterant)}/${selected.pure} × 100 = ${percentText(targetProfit)}.`,
      conclusion: `${answer} of ${selected.adulterant} should be added.`,
      fastMethod: "Free adulterant = pure quantity × target profit %.",
      commonMistake: "Do not calculate the target percentage on the final mixture quantity.",
    },
    commercialLedger: freeLedger({ title: "Required free-adulterant quantity", unit: selected.unit, pure, adulterant, pureCost, sellingRate: pureCost, result: targetProfit }),
  });
}

export function pureQuantityFromAdulterantQuestion(seed: string): MalCp005DiscoveryQuestion {
  const prototypeId = "MAL-CP005-PROT-PURE-QUANTITY-FROM-ADULTERANT-AND-TARGET-PROFIT" as const;
  const selected = pick(FREE_ADULTERANT_CASES, `${seed}:case`);
  const adulterant = r(selected.adulterantQty);
  const targetProfit = multiplyRational(divideRational(adulterant, r(selected.pure)), HUNDRED);
  const request: Extract<MalCp005SolveRequest, { mode: "PURE_QUANTITY_FROM_FREE_ADULTERANT_AND_TARGET" }> = {
    mode: "PURE_QUANTITY_FROM_FREE_ADULTERANT_AND_TARGET",
    adulterantQuantity: adulterant,
    targetProfitPercent: targetProfit,
  };
  const pure = expectQuantity(solveMalCp005(request));
  const total = addRational(pure, adulterant);
  const answer = quantityText(pure, selected.unit);
  const options = buildOptions(answer, [
    { text: quantityText(divideRational(multiplyRational(adulterant, subtractRational(HUNDRED, targetProfit)), targetProfit), selected.unit), misconceptionId: "used_profit_complement_as_pure_base" },
    { text: quantityText(total, selected.unit), misconceptionId: "reported_final_mixture_quantity" },
    { text: quantityText(divideRational(multiplyRational(adulterant, addRational(HUNDRED, targetProfit)), HUNDRED), selected.unit), misconceptionId: "treated_adulterant_as_percentage_base" },
    { text: quantityText(divideRational(multiplyRational(adulterant, addRational(HUNDRED, targetProfit)), targetProfit), selected.unit), misconceptionId: "reported_final_total_from_adulterant_share" },
  ], `${seed}:options`);
  const pureCost = r(selected.pureCost);
  return packageQuestion({
    prototypeId,
    seed,
    request,
    stem: `${actorPhrase(selected.actor)} adds ${selected.adulterantQty} ${selected.unit} of ${selected.adulterant} to some pure ${selected.product} and sells the mixture at the cost price of pure ${selected.product}, making ${percentText(targetProfit)} profit. How much pure ${selected.product} was used?`,
    answer,
    options,
    explanation: {
      layoutId: "MAL-CP005-EN-COMMERCIAL-MIXTURE-DISCOVERY-V1",
      concept: `The free ${selected.adulterant} quantity is ${percentText(targetProfit)} of the paid pure-${selected.product} quantity.`,
      calculation: [
        `${selected.adulterantQty} = pure quantity × ${formatRational(targetProfit)}/100.`,
        `Pure quantity = ${selected.adulterantQty} × 100/${formatRational(targetProfit)} = ${answer}.`,
      ],
      verification: `${selected.adulterantQty}/${formatRational(pure)} × 100 = ${percentText(targetProfit)}.`,
      conclusion: `The seller used ${answer} of pure ${selected.product}.`,
      fastMethod: "Pure quantity = free adulterant × 100 ÷ profit percentage.",
      commonMistake: "The stated profit percentage is on the cost of the pure product, not on the final mixture.",
    },
    commercialLedger: freeLedger({ title: "Recovering pure quantity from adulteration gain", unit: selected.unit, pure, adulterant, pureCost, sellingRate: pureCost, result: targetProfit }),
  });
}

export function adulterantPercentFromProfitQuestion(seed: string): MalCp005DiscoveryQuestion {
  const prototypeId = "MAL-CP005-PROT-ADULTERANT-PERCENT-FROM-TARGET-PROFIT" as const;
  const selected = pick(FREE_ADULTERANT_CASES, `${seed}:case`);
  const pure = r(selected.pure);
  const adulterant = r(selected.adulterantQty);
  const targetProfit = multiplyRational(divideRational(adulterant, pure), HUNDRED);
  const request: Extract<MalCp005SolveRequest, { mode: "ADULTERANT_PERCENT_FROM_TARGET_PROFIT" }> = {
    mode: "ADULTERANT_PERCENT_FROM_TARGET_PROFIT",
    targetProfitPercent: targetProfit,
  };
  const adulterantPercent = expectPercent(solveMalCp005(request));
  const answer = percentText(adulterantPercent);
  const halfProfit = divideRational(targetProfit, rational(2));
  const options = buildOptions(answer, [
    { text: percentText(targetProfit), misconceptionId: "equated_profit_percent_with_final_adulterant_percent" },
    { text: percentText(divideRational(multiplyRational(HUNDRED, targetProfit), addRational(HUNDRED, halfProfit))), misconceptionId: "added_only_half_the_free_part_to_total" },
    { text: percentText(subtractRational(HUNDRED, adulterantPercent)), misconceptionId: "reported_pure_share_of_final_mixture" },
    { text: percentText(divideRational(multiplyRational(HUNDRED, targetProfit), addRational(HUNDRED, multiplyRational(rational(2), targetProfit)))), misconceptionId: "added_profit_twice_to_total" },
  ], `${seed}:options`);
  const pureCost = r(selected.pureCost);
  return packageQuestion({
    prototypeId,
    seed,
    request,
    stem: `${actorPhrase(selected.actor)} sells an adulterated ${selected.product} mixture at the cost price of pure ${selected.product} and gains ${percentText(targetProfit)}. What percentage of the final mixture is ${selected.adulterant}?`,
    answer,
    options,
    explanation: {
      layoutId: "MAL-CP005-EN-COMMERCIAL-MIXTURE-DISCOVERY-V1",
      concept: `A ${percentText(targetProfit)} gain means ${formatRational(targetProfit)} free parts are added to 100 paid parts. The final mixture therefore has ${formatRational(addRational(HUNDRED, targetProfit))} parts.`,
      calculation: [
        `${selected.adulterant} percentage = ${formatRational(targetProfit)}/${formatRational(addRational(HUNDRED, targetProfit))} × 100.`,
        `${selected.adulterant} percentage = ${answer}.`,
      ],
      verification: `In the source ratio ${selected.pure}:${selected.adulterantQty}, ${selected.adulterantQty} out of ${selected.pure + selected.adulterantQty} parts is ${answer}.`,
      conclusion: `${selected.adulterant} forms ${answer} of the final mixture.`,
      fastMethod: "Adulterant % of final mixture = profit % ÷ (100 + profit %) × 100.",
      commonMistake: "Profit percentage and adulterant percentage use different bases.",
    },
    commercialLedger: freeLedger({ title: "Profit-base to final-mixture percentage conversion", unit: selected.unit, pure, adulterant, pureCost, sellingRate: pureCost, result: targetProfit }),
  });
}

export function profitFromAdulterantPercentQuestion(seed: string): MalCp005DiscoveryQuestion {
  const prototypeId = "MAL-CP005-PROT-PROFIT-FROM-ADULTERANT-PERCENT" as const;
  const selected = pick(FREE_ADULTERANT_CASES, `${seed}:case`);
  const pure = r(selected.pure);
  const adulterant = r(selected.adulterantQty);
  const adulterantPercent = multiplyRational(divideRational(adulterant, addRational(pure, adulterant)), HUNDRED);
  const request: Extract<MalCp005SolveRequest, { mode: "TARGET_PROFIT_FROM_ADULTERANT_PERCENT" }> = {
    mode: "TARGET_PROFIT_FROM_ADULTERANT_PERCENT",
    adulterantPercentOfMixture: adulterantPercent,
  };
  const profit = expectPercent(solveMalCp005(request));
  const answer = percentText(profit);
  const options = buildOptions(answer, [
    { text: percentText(adulterantPercent), misconceptionId: "reported_adulterant_percent_as_profit" },
    { text: percentText(subtractRational(HUNDRED, adulterantPercent)), misconceptionId: "reported_pure_product_percent" },
    { text: percentText(divideRational(multiplyRational(HUNDRED, adulterantPercent), addRational(HUNDRED, adulterantPercent))), misconceptionId: "used_profit_to_mixture_conversion_forward" },
    { text: percentText(divideRational(HUNDRED, adulterantPercent)), misconceptionId: "inverted_percentage_without_base_conversion" },
  ], `${seed}:options`);
  const pureCost = r(selected.pureCost);
  return packageQuestion({
    prototypeId,
    seed,
    request,
    stem: `${percentText(adulterantPercent)} of a ${selected.product}-${selected.adulterant} mixture is ${selected.adulterant}. The mixture is sold at the cost price of pure ${selected.product}. What is the profit percentage?`,
    answer,
    options,
    explanation: {
      layoutId: "MAL-CP005-EN-COMMERCIAL-MIXTURE-DISCOVERY-V1",
      concept: `Take 100 parts of mixture. ${formatRational(adulterantPercent)} parts are free ${selected.adulterant}, so only ${formatRational(subtractRational(HUNDRED, adulterantPercent))} parts carry cost.`,
      calculation: [
        `Profit percentage = (${formatRational(adulterantPercent)})/(${formatRational(subtractRational(HUNDRED, adulterantPercent))}) × 100.`,
        `Profit percentage = ${answer}.`,
      ],
      verification: `The source quantities give ${formatRational(adulterant)}/${formatRational(pure)} × 100 = ${answer}.`,
      conclusion: `The profit percentage is ${answer}.`,
      fastMethod: "Profit % = adulterant % ÷ pure-product % × 100.",
      commonMistake: "Do not report the adulterant's share of the final mixture as the profit rate.",
    },
    commercialLedger: freeLedger({ title: "Final-mixture percentage to profit-base conversion", unit: selected.unit, pure, adulterant, pureCost, sellingRate: pureCost, result: profit }),
  });
}
