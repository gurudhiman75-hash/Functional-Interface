import {
  addRational, divideRational, formatRational, multiplyRational, rational,
  reduceRationalRatio, subtractRational,
} from "./rational";
import { buildOptions, moneyText, packageQuestion, percentText, pick, quantityText, rateText, ratioText } from "./cp005-discovery-core";
import { solveMalCp005 } from "./cp005-solver";
import type { MalCp005DiscoveryQuestion, MalCp005SolveRequest } from "./cp005-types";
import type { Rational } from "./types";
import { HUNDRED, actorPhrase, cheaperLedger, expectPercent, expectQuantity, expectRate, expectRatio, freeLedger, profitAmount, r, reducedRatio } from "./cp005-discovery-helpers";
import { CHEAPER_IMPURITY_CASES } from "./cp005-discovery-data";

export function cheaperBlendProfitQuestion(seed: string): MalCp005DiscoveryQuestion {
  const prototypeId="MAL-CP005-PROT-PROFIT-FROM-CHEAPER-IMPURITY-BLEND" as const;
  const selected=pick(CHEAPER_IMPURITY_CASES,`${seed}:case`); const pure=r(selected.pure); const adulterant=r(selected.adulterantQty); const pureCost=r(selected.pureCost); const adulterantCost=r(selected.adulterantCost); const sellingRate=r(selected.selling);
  const request:Extract<MalCp005SolveRequest,{mode:"CHEAPER_BLEND_PROFIT_FROM_COSTS_QUANTITIES_AND_SELLING_RATE"}>={mode:"CHEAPER_BLEND_PROFIT_FROM_COSTS_QUANTITIES_AND_SELLING_RATE",pureQuantity:pure,adulterantQuantity:adulterant,pureUnitCost:pureCost,adulterantUnitCost:adulterantCost,sellingRate};
  const profit=expectPercent(solveMalCp005(request)); const total=addRational(pure,adulterant); const cost=addRational(multiplyRational(pure,pureCost),multiplyRational(adulterant,adulterantCost)); const revenue=multiplyRational(total,sellingRate); const profitValue=subtractRational(revenue,cost);
  const margin=multiplyRational(divideRational(profitValue,revenue),HUNDRED); const pureCostTotal=multiplyRational(pure,pureCost); const ignoredImpurityCost=multiplyRational(divideRational(subtractRational(revenue,pureCostTotal),pureCostTotal),HUNDRED); const simpleAverage=divideRational(addRational(pureCost,adulterantCost),rational(2)); const simpleAverageProfit=multiplyRational(divideRational(subtractRational(sellingRate,simpleAverage),simpleAverage),HUNDRED); const impurityShare=multiplyRational(divideRational(adulterant,total),HUNDRED);
  const answer=percentText(profit); const options=buildOptions(answer,[
    {text:percentText(margin),misconceptionId:"used_revenue_as_percentage_base"},
    {text:percentText(ignoredImpurityCost),misconceptionId:"treated_cheaper_impurity_as_free"},
    {text:percentText(simpleAverageProfit),misconceptionId:"used_unweighted_average_cost"},
    {text:percentText(impurityShare),misconceptionId:"reported_impurity_share_as_profit"},
  ],`${seed}:options`);
  return packageQuestion({prototypeId,seed,request,
    stem:`${actorPhrase(selected.actor)} mixes ${selected.pure} ${selected.unit} of ${selected.product} costing ${rateText(pureCost,selected.unit)} with ${selected.adulterantQty} ${selected.unit} of ${selected.adulterant} costing ${rateText(adulterantCost,selected.unit)}. The mixture is sold at ${rateText(sellingRate,selected.unit)}. What is the profit percentage?`,answer,options,
    explanation:{layoutId:"MAL-CP005-EN-COMMERCIAL-MIXTURE-DISCOVERY-V1",concept:"Because the impurity also has a cost, add the costs of both ingredients before comparing with the total sale proceeds.",calculation:[
      `Actual cost = ${selected.pure} × ${formatRational(pureCost)} + ${selected.adulterantQty} × ${formatRational(adulterantCost)} = ${moneyText(cost)}.`,
      `Revenue = ${selected.pure+selected.adulterantQty} × ${formatRational(sellingRate)} = ${moneyText(revenue)}.`,
      `Profit percentage = (${moneyText(revenue)} − ${moneyText(cost)})/${moneyText(cost)} × 100 = ${answer}.`,
    ],verification:`${moneyText(cost)} × (100 + ${formatRational(profit)})/100 = ${moneyText(revenue)}.`,conclusion:`The profit percentage is ${answer}.`,fastMethod:"Use one ratio-batch and compare total selling value with the weighted total cost.",commonMistake:"A cheaper impurity is not free; include its cost in the denominator."},
    commercialLedger:cheaperLedger({title:"Commercial result of a cheaper-impurity blend",unit:selected.unit,pure,adulterant,pureCost,adulterantCost,sellingRate,result:profit})});
}

export function cheaperBlendRatioQuestion(seed: string): MalCp005DiscoveryQuestion {
  const prototypeId="MAL-CP005-PROT-CHEAPER-IMPURITY-RATIO-FROM-TARGET-PROFIT" as const;
  const selected=pick(CHEAPER_IMPURITY_CASES,`${seed}:case`); const pure=r(selected.pure); const adulterant=r(selected.adulterantQty); const pureCost=r(selected.pureCost); const adulterantCost=r(selected.adulterantCost); const sellingRate=r(selected.selling);
  const pRequest:Extract<MalCp005SolveRequest,{mode:"CHEAPER_BLEND_PROFIT_FROM_COSTS_QUANTITIES_AND_SELLING_RATE"}>={mode:"CHEAPER_BLEND_PROFIT_FROM_COSTS_QUANTITIES_AND_SELLING_RATE",pureQuantity:pure,adulterantQuantity:adulterant,pureUnitCost:pureCost,adulterantUnitCost:adulterantCost,sellingRate}; const targetProfit=expectPercent(solveMalCp005(pRequest));
  const request:Extract<MalCp005SolveRequest,{mode:"CHEAPER_BLEND_RATIO_FROM_COSTS_SELLING_RATE_AND_TARGET_PROFIT"}>={mode:"CHEAPER_BLEND_RATIO_FROM_COSTS_SELLING_RATE_AND_TARGET_PROFIT",pureUnitCost:pureCost,adulterantUnitCost:adulterantCost,sellingRate,targetProfitPercent:targetProfit}; const [first,second]=expectRatio(solveMalCp005(request)); const targetAverage=divideRational(multiplyRational(sellingRate,HUNDRED),addRational(HUNDRED,targetProfit));
  const answer=ratioText(first,second); const options=buildOptions(answer,[
    {text:ratioText(second,first),misconceptionId:"ratio_reversed"},
    {text:reducedRatio(targetAverage,adulterantCost),misconceptionId:"used_average_to_lower_cost_directly"},
    {text:reducedRatio(pureCost,targetAverage),misconceptionId:"used_higher_cost_to_average_directly"},
    {text:reducedRatio(HUNDRED,targetProfit),misconceptionId:"treated_cheaper_impurity_as_free"},
  ],`${seed}:options`);
  return packageQuestion({prototypeId,seed,request,
    stem:`${actorPhrase(selected.actor)} mixes ${selected.product} costing ${rateText(pureCost,selected.unit)} with ${selected.adulterant} costing ${rateText(adulterantCost,selected.unit)}. The mixture is sold at ${rateText(sellingRate,selected.unit)} for a profit of ${percentText(targetProfit)}. In what ratio should ${selected.product} and ${selected.adulterant} be mixed?`,answer,options,
    explanation:{layoutId:"MAL-CP005-EN-COMMERCIAL-MIXTURE-DISCOVERY-V1",concept:"Convert the selling condition into the required average cost, then use opposite differences between that average and the two ingredient costs.",calculation:[
      `Required average cost = ${formatRational(sellingRate)} × 100/(100 + ${formatRational(targetProfit)}) = ${rateText(targetAverage,selected.unit)}.`,
      `${selected.product} : ${selected.adulterant} = (${formatRational(targetAverage)} − ${formatRational(adulterantCost)}) : (${formatRational(pureCost)} − ${formatRational(targetAverage)}) = ${answer}.`,
    ],verification:`A batch in ratio ${answer} has the required average cost ${rateText(targetAverage,selected.unit)} and therefore gives ${percentText(targetProfit)} at the stated selling rate.`,conclusion:`The required ${selected.product} : ${selected.adulterant} ratio is ${answer}.`,fastMethod:"Find target average cost from SP and gain%, then use opposite cost differences.",commonMistake:"Do not treat the cheaper ingredient as free, and do not use the selling rate itself as the target average cost."},
    commercialLedger:cheaperLedger({title:"Target-profit ratio for a cheaper-impurity blend",unit:selected.unit,pure:first,adulterant:second,pureCost,adulterantCost,sellingRate,result:targetProfit})});
}

export function cheaperBlendSellingRateQuestion(seed: string): MalCp005DiscoveryQuestion {
  const prototypeId="MAL-CP005-PROT-CHEAPER-IMPURITY-SELLING-RATE-FROM-TARGET-PROFIT" as const;
  const selected=pick(CHEAPER_IMPURITY_CASES,`${seed}:case`); const pure=r(selected.pure); const adulterant=r(selected.adulterantQty); const pureCost=r(selected.pureCost); const adulterantCost=r(selected.adulterantCost); const knownSelling=r(selected.selling);
  const pRequest:Extract<MalCp005SolveRequest,{mode:"CHEAPER_BLEND_PROFIT_FROM_COSTS_QUANTITIES_AND_SELLING_RATE"}>={mode:"CHEAPER_BLEND_PROFIT_FROM_COSTS_QUANTITIES_AND_SELLING_RATE",pureQuantity:pure,adulterantQuantity:adulterant,pureUnitCost:pureCost,adulterantUnitCost:adulterantCost,sellingRate:knownSelling}; const targetProfit=expectPercent(solveMalCp005(pRequest));
  const request:Extract<MalCp005SolveRequest,{mode:"CHEAPER_BLEND_SELLING_RATE_FROM_RATIO_AND_TARGET_PROFIT"}>={mode:"CHEAPER_BLEND_SELLING_RATE_FROM_RATIO_AND_TARGET_PROFIT",pureQuantity:pure,adulterantQuantity:adulterant,pureUnitCost:pureCost,adulterantUnitCost:adulterantCost,targetProfitPercent:targetProfit}; const sellingRate=expectRate(solveMalCp005(request)); const total=addRational(pure,adulterant); const average=divideRational(addRational(multiplyRational(pure,pureCost),multiplyRational(adulterant,adulterantCost)),total); const simpleAverage=divideRational(addRational(pureCost,adulterantCost),rational(2));
  const answer=rateText(sellingRate,selected.unit); const options=buildOptions(answer,[
    {text:rateText(average,selected.unit),misconceptionId:"forgot_target_profit"},
    {text:rateText(divideRational(multiplyRational(pureCost,addRational(HUNDRED,targetProfit)),HUNDRED),selected.unit),misconceptionId:"used_only_higher_cost"},
    {text:rateText(divideRational(multiplyRational(adulterantCost,addRational(HUNDRED,targetProfit)),HUNDRED),selected.unit),misconceptionId:"used_only_lower_cost"},
    {text:rateText(divideRational(multiplyRational(simpleAverage,addRational(HUNDRED,targetProfit)),HUNDRED),selected.unit),misconceptionId:"used_unweighted_average_cost"},
  ],`${seed}:options`);
  return packageQuestion({prototypeId,seed,request,
    stem:`${actorPhrase(selected.actor)} mixes ${selected.product} costing ${rateText(pureCost,selected.unit)} and ${selected.adulterant} costing ${rateText(adulterantCost,selected.unit)} in the ratio ${selected.pure}:${selected.adulterantQty}. At what rate should the mixture be sold to earn ${percentText(targetProfit)} profit?`,answer,options,
    explanation:{layoutId:"MAL-CP005-EN-COMMERCIAL-MIXTURE-DISCOVERY-V1",concept:"Find the weighted average cost of the two paid ingredients, then apply the target profit multiplier.",calculation:[
      `Average mixture cost = (${selected.pure} × ${formatRational(pureCost)} + ${selected.adulterantQty} × ${formatRational(adulterantCost)})/${selected.pure+selected.adulterantQty} = ${rateText(average,selected.unit)}.`,
      `Required selling rate = ${formatRational(average)} × (100 + ${formatRational(targetProfit)})/100 = ${answer}.`,
    ],verification:`Selling one ${formatRational(total)}-part batch at ${answer} gives exactly ${percentText(targetProfit)} on its combined ingredient cost.`,conclusion:`The mixture should be sold at ${answer}.`,fastMethod:"Weighted cost per unit × target commercial multiplier.",commonMistake:"Do not take a simple average of the two costs unless the quantities are equal."},
    commercialLedger:cheaperLedger({title:"Required selling rate for a cheaper-impurity blend",unit:selected.unit,pure,adulterant,pureCost,adulterantCost,sellingRate,result:targetProfit})});
}
