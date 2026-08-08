import {
  addRational, divideRational, formatRational, multiplyRational, rational,
  reduceRationalRatio, subtractRational,
} from "./rational";
import { buildOptions, moneyText, packageQuestion, percentText, pick, quantityText, rateText, ratioText } from "./cp005-discovery-core";
import { solveMalCp005 } from "./cp005-solver";
import type { MalCp005DiscoveryQuestion, MalCp005SolveRequest } from "./cp005-types";
import type { Rational } from "./types";
import { HUNDRED, actorPhrase, cheaperLedger, expectPercent, expectQuantity, expectRate, expectRatio, freeLedger, profitAmount, r, reducedRatio } from "./cp005-discovery-helpers";
import { FREE_SELLING_CASES } from "./cp005-discovery-data";

export function freeBlendProfitWithSellingRateQuestion(seed: string): MalCp005DiscoveryQuestion {
  const prototypeId = "MAL-CP005-PROT-PROFIT-FROM-FREE-BLEND-AND-SELLING-RATE" as const;
  const selected = pick(FREE_SELLING_CASES, `${seed}:case`);
  const pure = r(selected.pure);
  const adulterant = r(selected.adulterantQty);
  const pureCost = r(selected.pureCostN, selected.pureCostD);
  const sellingRate = r(selected.sellingN, selected.sellingD);
  const request: Extract<MalCp005SolveRequest, { mode: "FREE_BLEND_PROFIT_FROM_COST_AND_SELLING_RATE" }> = {
    mode: "FREE_BLEND_PROFIT_FROM_COST_AND_SELLING_RATE",
    pureQuantity: pure,
    adulterantQuantity: adulterant,
    pureUnitCost: pureCost,
    sellingRate,
  };
  const profit = expectPercent(solveMalCp005(request));
  const total = addRational(pure, adulterant);
  const cost = multiplyRational(pure, pureCost);
  const revenue = multiplyRational(total, sellingRate);
  const profitAmountValue = subtractRational(revenue, cost);
  const marginOnRevenue = multiplyRational(divideRational(profitAmountValue, revenue), HUNDRED);
  const waterPercent = multiplyRational(divideRational(adulterant, total), HUNDRED);
  const purePercent = multiplyRational(divideRational(pure, total), HUNDRED);
  const rateOnly = multiplyRational(divideRational(subtractRational(sellingRate, pureCost), pureCost), HUNDRED);
  const answer = percentText(profit);
  const adulterationOnly = multiplyRational(divideRational(adulterant, pure), HUNDRED);
  const options = buildOptions(answer, [
    { text: percentText(marginOnRevenue), misconceptionId: "used_revenue_as_percentage_base" },
    { text: percentText(waterPercent), misconceptionId: "used_adulterant_share_only" },
    { text: percentText(adulterationOnly), misconceptionId: "ignored_selling_rate_change" },
    { text: percentText(purePercent), misconceptionId: "reported_pure_share_of_mixture" },
    { text: percentText(rateOnly), misconceptionId: "ignored_extra_quantity_sold" },
  ], `${seed}:options`);
  return packageQuestion({
    prototypeId,
    seed,
    request,
    stem: `${actorPhrase(selected.actor)} buys pure ${selected.product} at ${rateText(pureCost, selected.unit)}, mixes it with ${selected.adulterant} in the ratio ${selected.pure}:${selected.adulterantQty}, and sells the mixture at ${rateText(sellingRate, selected.unit)}. What is the profit percentage?`,
    answer,
    options,
    explanation: {
      layoutId: "MAL-CP005-EN-COMMERCIAL-MIXTURE-DISCOVERY-V1",
      concept: `The ${selected.adulterant} has no cost, but every unit of the final mixture earns the stated selling rate. Compare total revenue with the cost of pure ${selected.product} actually used.`,
      calculation: [
        `For ${selected.pure + selected.adulterantQty} ratio-parts, actual cost = ${selected.pure} × ${rateText(pureCost, selected.unit)} = ${moneyText(cost)}.`,
        `Revenue = ${selected.pure + selected.adulterantQty} × ${rateText(sellingRate, selected.unit)} = ${moneyText(revenue)}.`,
        `Profit percentage = (${moneyText(revenue)} − ${moneyText(cost)})/${moneyText(cost)} × 100 = ${answer}.`,
      ],
      verification: `${moneyText(cost)} × (100 + ${formatRational(profit)})/100 = ${moneyText(revenue)}.`,
      conclusion: `The seller's profit percentage is ${answer}.`,
      fastMethod: "Use one ratio-batch: profit % = (batch revenue − batch cost) ÷ batch cost × 100.",
      commonMistake: "Do not add the selling-price change and adulterant percentage; both effects must be combined through money totals.",
    },
    commercialLedger: freeLedger({ title: "Free adulterant with an independent selling rate", unit: selected.unit, pure, adulterant, pureCost, sellingRate, result: profit }),
  });
}

export function freeBlendRatioFromCommercialTargetQuestion(seed: string): MalCp005DiscoveryQuestion {
  const prototypeId = "MAL-CP005-PROT-FREE-BLEND-RATIO-FROM-COST-SELLING-RATE-AND-TARGET-PROFIT" as const;
  const selected = pick(FREE_SELLING_CASES, `${seed}:case`);
  const pure = r(selected.pure);
  const adulterant = r(selected.adulterantQty);
  const pureCost = r(selected.pureCostN, selected.pureCostD);
  const sellingRate = r(selected.sellingN, selected.sellingD);
  const profitRequest: Extract<MalCp005SolveRequest, { mode: "FREE_BLEND_PROFIT_FROM_COST_AND_SELLING_RATE" }> = { mode:"FREE_BLEND_PROFIT_FROM_COST_AND_SELLING_RATE", pureQuantity:pure, adulterantQuantity:adulterant, pureUnitCost:pureCost, sellingRate };
  const targetProfit = expectPercent(solveMalCp005(profitRequest));
  const request: Extract<MalCp005SolveRequest, { mode: "FREE_BLEND_RATIO_FROM_COST_SELLING_RATE_AND_TARGET_PROFIT" }> = { mode:"FREE_BLEND_RATIO_FROM_COST_SELLING_RATE_AND_TARGET_PROFIT", pureUnitCost:pureCost, sellingRate, targetProfitPercent:targetProfit };
  const [first, second] = expectRatio(solveMalCp005(request));
  const targetAverage = divideRational(multiplyRational(sellingRate,HUNDRED),addRational(HUNDRED,targetProfit));
  const answer = ratioText(first,second);
  const options = buildOptions(answer, [
    { text: ratioText(second,first), misconceptionId:"ratio_reversed" },
    { text: reducedRatio(pureCost,sellingRate), misconceptionId:"used_cost_to_selling_rate_directly" },
    { text: reducedRatio(HUNDRED,targetProfit), misconceptionId:"used_pure_cost_sale_shortcut" },
    { text: reducedRatio(targetAverage,pureCost), misconceptionId:"used_average_to_pure_cost_without_complement" },
  ], `${seed}:options`);
  return packageQuestion({
    prototypeId,seed,request,
    stem:`${actorPhrase(selected.actor)} buys pure ${selected.product} at ${rateText(pureCost,selected.unit)} and sells the adulterated mixture at ${rateText(sellingRate,selected.unit)}. In what ratio should pure ${selected.product} and ${selected.adulterant} be mixed to earn ${percentText(targetProfit)} profit?`,
    answer,options,
    explanation:{
      layoutId:"MAL-CP005-EN-COMMERCIAL-MIXTURE-DISCOVERY-V1",
      concept:"First convert the selling rate and target profit into the required average cost of the mixture. Then mix the paid product with the zero-cost adulterant.",
      calculation:[
        `Required mixture cost = ${rateText(sellingRate,selected.unit)} × 100/(100 + ${formatRational(targetProfit)}) = ${rateText(targetAverage,selected.unit)}.`,
        `Pure ${selected.product} : ${selected.adulterant} = ${formatRational(targetAverage)} : (${formatRational(pureCost)} − ${formatRational(targetAverage)}) = ${answer}.`,
      ],
      verification:`A batch in ratio ${answer} costs ${moneyText(multiplyRational(first,pureCost))} and sells for ${moneyText(multiplyRational(addRational(first,second),sellingRate))}, giving ${percentText(targetProfit)} profit.`,
      conclusion:`The required pure ${selected.product} : ${selected.adulterant} ratio is ${answer}.`,
      fastMethod:"Target average cost = SP × 100/(100 + gain%); then alligate that cost with zero.",
      commonMistake:"Do not use 100 : profit% unless the mixture is sold exactly at the pure product's cost price.",
    },
    commercialLedger:freeLedger({title:"Target-profit ratio with stated buying and selling rates",unit:selected.unit,pure:first,adulterant:second,pureCost,sellingRate,result:targetProfit}),
  });
}

export function freeBlendSellingRateQuestion(seed: string): MalCp005DiscoveryQuestion {
  const prototypeId = "MAL-CP005-PROT-FREE-BLEND-SELLING-RATE-FROM-RATIO-AND-TARGET-PROFIT" as const;
  const selected=pick(FREE_SELLING_CASES,`${seed}:case`);
  const pure=r(selected.pure); const adulterant=r(selected.adulterantQty); const pureCost=r(selected.pureCostN,selected.pureCostD); const knownSelling=r(selected.sellingN,selected.sellingD);
  const pRequest:Extract<MalCp005SolveRequest,{mode:"FREE_BLEND_PROFIT_FROM_COST_AND_SELLING_RATE"}>={mode:"FREE_BLEND_PROFIT_FROM_COST_AND_SELLING_RATE",pureQuantity:pure,adulterantQuantity:adulterant,pureUnitCost:pureCost,sellingRate:knownSelling};
  const targetProfit=expectPercent(solveMalCp005(pRequest));
  const request:Extract<MalCp005SolveRequest,{mode:"FREE_BLEND_SELLING_RATE_FROM_RATIO_AND_TARGET_PROFIT"}>={mode:"FREE_BLEND_SELLING_RATE_FROM_RATIO_AND_TARGET_PROFIT",pureQuantity:pure,adulterantQuantity:adulterant,pureUnitCost:pureCost,targetProfitPercent:targetProfit};
  const sellingRate=expectRate(solveMalCp005(request)); const total=addRational(pure,adulterant); const average=divideRational(multiplyRational(pure,pureCost),total);
  const answer=rateText(sellingRate,selected.unit);
  const profitOnPureUnit = multiplyRational(pureCost, divideRational(targetProfit, HUNDRED));
  const marginRate = divideRational(multiplyRational(average, HUNDRED), subtractRational(HUNDRED, targetProfit));
  const options=buildOptions(answer,[
    {text:rateText(average,selected.unit),misconceptionId:"forgot_target_profit"},
    {text:rateText(divideRational(multiplyRational(pureCost,addRational(HUNDRED,targetProfit)),HUNDRED),selected.unit),misconceptionId:"ignored_free_adulterant"},
    {text:rateText(pureCost,selected.unit),misconceptionId:"reported_pure_product_cost"},
    {text:rateText(addRational(average, profitOnPureUnit),selected.unit),misconceptionId:"added_profit_on_pure_cost_to_mixture_cost"},
    {text:rateText(marginRate,selected.unit),misconceptionId:"treated_profit_as_margin_on_selling_price"},
  ],`${seed}:options`);
  return packageQuestion({prototypeId,seed,request,
    stem:`Pure ${selected.product} costs ${rateText(pureCost,selected.unit)}. A ${selected.actor} mixes pure ${selected.product} and ${selected.adulterant} in the ratio ${selected.pure}:${selected.adulterantQty}. At what rate should the mixture be sold to earn ${percentText(targetProfit)} profit?`,answer,options,
    explanation:{layoutId:"MAL-CP005-EN-COMMERCIAL-MIXTURE-DISCOVERY-V1",concept:"Find the actual average cost per unit of the mixture first, then apply the target profit percentage to that cost.",calculation:[
      `Mixture cost per litre = (${selected.pure} × ${formatRational(pureCost)})/${selected.pure+selected.adulterantQty} = ${formatRational(average)}.`,
      `Required selling rate = ${formatRational(average)} × (100 + ${formatRational(targetProfit)})/100 = ${answer}.`,
    ],verification:`Selling ${formatRational(total)} ratio-parts at ${answer} gives the exact ${percentText(targetProfit)} gain on the paid pure-product cost.`,conclusion:`The mixture should be sold at ${answer}.`,fastMethod:"Average mixture cost first; then multiply by (100 + gain%)/100.",commonMistake:"Do not apply the profit rate to the pure product's cost without first allowing for the free adulterant."},
    commercialLedger:freeLedger({title:"Required selling rate for a free-adulterant blend",unit:selected.unit,pure,adulterant,pureCost,sellingRate,result:targetProfit})});
}
