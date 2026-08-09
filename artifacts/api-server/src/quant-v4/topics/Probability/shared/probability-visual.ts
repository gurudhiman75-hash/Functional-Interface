import type { EventExpression, GeneratedParameters, ProbabilityExperiment, ProbabilityTaskRegistryEntry, ProbabilityVisual, SolvedProbability } from "./types";
export function buildProbabilityVisuals(entry: ProbabilityTaskRegistryEntry, parameters: GeneratedParameters, experiment: ProbabilityExperiment, event: EventExpression, solved: SolvedProbability): ProbabilityVisual[] {
  const id = entry.visualStrategyId; if (!id) return [];
  if (id === "TWO_DICE_OUTCOME_GRID") {
    const cells = Array.from({ length: 6 }, (_, row) => Array.from({ length: 6 }, (_, column) => ({ first: row + 1, second: column + 1, sum: row + column + 2, product: (row + 1) * (column + 1) })));
    return [{ strategyId:id,kind:"GRID",title:"Two-dice ordered outcome grid",data:{cells,event:event.label,favourableCount:solved.evidence.favourableOutcomeCount?.toString()},altText:`A 6 by 6 grid of ordered dice outcomes highlighting ${event.label}.` }];
  }
  if (id === "COIN_OUTCOME_TREE") {
    const tosses=Number(parameters.tosses ?? parameters.trials ?? 2),leaves=Array.from({length:2**tosses},(_,index)=>index.toString(2).padStart(tosses,"0").replace(/0/g,"H").replace(/1/g,"T"));
    return [{strategyId:id,kind:"TREE",title:"Coin outcome tree",data:{tosses,leaves,event:event.label},altText:`A branching tree for ${tosses} fair coin tosses showing ${2**tosses} ordered outcomes.`}];
  }
  if (id === "SUCCESSIVE_DRAW_TREE") {
    return [{strategyId:id,kind:"TREE",title:"Successive-draw probability tree",data:{red:parameters.red,blue:parameters.blue,replacementPolicy:experiment.replacementPolicy,event:event.label},altText:`A two-stage draw tree showing how the second-stage probabilities change under ${experiment.replacementPolicy.toLowerCase().replace(/_/g," ")}.`}];
  }
  if (id === "VENN_EVENT_REGIONS") {
    return [{strategyId:id,kind:"VENN",title:"Two-event region model",data:{aCount:parameters.aCount,bCount:parameters.bCount,overlap:parameters.overlap,total:parameters.total,event:event.label},altText:`A two-circle Venn model showing the A-only, overlap, B-only and neither regions.`}];
  }
  if (id === "CARD_DECK_SUMMARY") {
    return [{strategyId:id,kind:"TABLE",title:"Standard deck summary",data:{deck:52,suits:4,cardsPerSuit:13,red:26,black:26,faceCards:12,ranks:{ace:4,king:4,queen:4,jack:4}},altText:"A summary table of the canonical 52-card deck counts used in the solution."}];
  }
  if (id === "URN_COMPOSITION_DISPLAY") {
    return [{strategyId:id,kind:"URN",title:"Bag composition",data:{red:parameters.red,blue:parameters.blue,draws:parameters.draw ?? parameters.draws,replacementPolicy:experiment.replacementPolicy,event:event.label},altText:`An urn diagram with ${parameters.red} red and ${parameters.blue} blue balls.`}];
  }
  return [];
}
