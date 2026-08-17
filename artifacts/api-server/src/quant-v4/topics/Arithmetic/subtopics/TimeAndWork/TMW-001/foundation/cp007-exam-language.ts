import { equals, formatRational, rational, reciprocal } from "./rational";
import { required } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp007CommonTrap, TmwCp007LearningShortcut, TmwCp007Parameters, TmwCp007RegistryEntry, TmwCp007Solution } from "./cp007-types";

interface ScenarioProfile {
  setting:string;
  assignment:string;
}

function profile(jobPhrase:string):ScenarioProfile{
  switch(jobPhrase){
    case "a road-repair contract":return {setting:"a highway repair site",assignment:"the road-repair project"};
    case "a component-assembly order":return {setting:"an electronics assembly workshop",assignment:"a component-assembly order"};
    case "a document-processing assignment":return {setting:"a bank operations centre",assignment:"a document-processing backlog"};
    case "a painting contract":return {setting:"a commercial-complex painting site",assignment:"the painting contract"};
    case "a production order":return {setting:"an auto-component factory",assignment:"a bulk production order"};
    case "a printing order":return {setting:"a commercial printing press",assignment:"a large printing order"};
    case "a bottling order":return {setting:"a beverage bottling plant",assignment:"a bulk bottling order"};
    case "a repair contract":return {setting:"an industrial maintenance workshop",assignment:"a repair contract"};
    case "a verification assignment":return {setting:"a bank verification unit",assignment:"a verification assignment"};
    default:return {setting:"a project workplace",assignment:jobPhrase};
  }
}

const r=(n:number):Rational=>rational(n);
function number(value:Rational):string{return formatRational(value);}
function plural(value:Rational,singular:string,pluralForm:string):string{return equals(value,r(1))?singular:pluralForm;}
function displayCategory(raw:string):string{
  const replacements:Record<string,string>={
    "automatic line":"automated bottling line",
    "automatic lines":"automated bottling lines",
    "semi-automatic line":"semi-automatic bottling line",
    "semi-automatic lines":"semi-automatic bottling lines",
    "manual station":"manual bottling station",
    "manual stations":"manual bottling stations",
    "heavy machine":"heavy-duty machine",
    "heavy machines":"heavy-duty machines",
  };
  return replacements[raw]??raw;
}
function categoryNoun(p:TmwCp007Parameters,index:number,value:Rational):string{
  const category=p.context.categories[index],raw=plural(value,category.singular,category.plural);
  return displayCategory(raw);
}
function count(p:TmwCp007Parameters,index:number,value:Rational):string{return `${number(value)} ${categoryNoun(p,index,value)}`;}
function timeUnit(p:TmwCp007Parameters):"hour"|"day"{return p.context.categories.every(category=>category.resourceTimeUnit.endsWith("hours"))?"hour":"day";}
function timeText(p:TmwCp007Parameters,value:Rational):string{const unit=timeUnit(p);return `${number(value)} ${plural(value,unit,`${unit}s`)}`;}
function groupText(p:TmwCp007Parameters,group:[Rational,Rational,Rational]):string{
  const parts=group.map((value,index)=>value.numerator===0?null:count(p,index,value)).filter((value):value is string=>Boolean(value));
  if(parts.length===1)return parts[0];
  if(parts.length===2)return `${parts[0]} and ${parts[1]}`;
  return `${parts[0]}, ${parts[1]} and ${parts[2]}`;
}
function rateText(p:TmwCp007Parameters,value:Rational):string{return `${number(value)} ${p.context.outputUnit} per ${timeUnit(p)}`;}
function isMachineContext(p:TmwCp007Parameters):boolean{return timeUnit(p)==="hour";}

export function renderTmwCp007ExamStem(entry:TmwCp007RegistryEntry,p:TmwCp007Parameters):string{
  const c=p.context.categories,source=p.sourceCategoryIndex??0,target=p.targetCategoryIndex??p.replacementCategoryIndex??1,s=profile(p.context.jobPhrase);
  switch(entry.solveMode){
    case "findTwoCategoryEfficiencyRatio":return `At ${s.setting}, ${count(p,0,p.crewA[0])} can complete the same production assignment in exactly the same time as ${count(p,1,p.crewB[1])}. What is the ratio of the efficiency of one ${displayCategory(c[0].singular)} to that of one ${displayCategory(c[1].singular)}?`;
    case "findThreeCategoryEfficiencyRatio":return `At ${s.setting}, production records show that ${count(p,0,c[1].efficiency)} complete the same assignment in the same time as ${count(p,1,c[0].efficiency)}. They also show that ${count(p,1,c[2].efficiency)} match the output of ${count(p,2,c[1].efficiency)} in equal time. Find the efficiency ratio ${displayCategory(c[0].singular)}:${displayCategory(c[1].singular)}:${displayCategory(c[2].singular)}.`;
    case "findMixedCrewCompletionTime":return `At ${s.setting}, a mixed group of ${groupText(p,p.crewA)} is assigned ${s.assignment}. One unit of the three categories can produce ${c.map(category=>number(category.efficiency)).join(", ")} ${p.context.outputUnit} per ${timeUnit(p)}, respectively. How long will the group take to complete ${number(p.workA)} ${p.context.outputUnit}?`;
    case "findEquivalentCategoryCount":return p.replacementCategoryIndex===undefined?`At ${s.setting}, management wants to replace the capacity of ${count(p,source,p.crewA[source])} with only ${displayCategory(c[target].plural)}. How many ${displayCategory(c[target].plural)} will provide exactly the same total output?`:`At ${s.setting}, ${count(p,source,p.crewA[source])} are being replaced by ${displayCategory(c[target].plural)} without changing the total production capacity. How many ${displayCategory(c[target].plural)} are required?`;
    case "findUnknownCategoryCountForTargetTime":return `At ${s.setting}, ${groupText(p,p.crewA)} are already assigned to complete ${number(p.workA)} ${p.context.outputUnit} in ${timeText(p,p.daysA)}. The per-${timeUnit(p)} outputs of ${c.map(category=>displayCategory(category.plural)).join(", ")} are ${c.map(category=>number(category.efficiency)).join(", ")}, respectively. How many additional ${displayCategory(c[target].plural)} must be deployed to meet the deadline?`;
    case "findCrewCompositionFromTwoOutputFacts":return `At ${s.setting}, one team containing some ${displayCategory(c[0].plural)} and some ${displayCategory(c[1].plural)} produces ${number(p.workA)} ${p.context.outputUnit} in ${timeText(p,p.daysA)}. In a second trial, the number of ${displayCategory(c[0].plural)} is doubled while the number of ${displayCategory(c[1].plural)} remains unchanged; this team produces ${number(p.workB)} ${p.context.outputUnit} in ${timeText(p,p.daysB)}. If one ${displayCategory(c[0].singular)} and one ${displayCategory(c[1].singular)} produce ${number(c[0].efficiency)} and ${number(c[1].efficiency)} ${p.context.outputUnit} per ${timeUnit(p)}, respectively, find the composition of the first team.`;
    case "findCategoryRateFromWeightedCrewFacts":{
      const groups=required(p.pairwiseCrews,"pairwiseCrews"),rates=required(p.pairwiseRates,"pairwiseRates");
      return `Production records at ${s.setting} show that ${groupText(p,groups[0])} produce ${rateText(p,rates[0])}, ${groupText(p,groups[1])} produce ${rateText(p,rates[1])}, and ${groupText(p,groups[2])} produce ${rateText(p,rates[2])}. What is the per-${timeUnit(p)} output of one ${displayCategory(c[target].singular)}?`;
    }
    case "findHeterogeneousGroupRate":return `During one operating period at ${s.setting}, ${groupText(p,p.crewA)} work together. One unit of the three categories produces ${number(c[0].efficiency)}, ${number(c[1].efficiency)} and ${number(c[2].efficiency)} ${p.context.outputUnit} per ${timeUnit(p)}, respectively. What is their combined production rate?`;
    case "findCompletionAfterCategoryReplacement":return `At ${s.setting}, an original group of ${groupText(p,p.crewA)} can complete ${s.assignment} in ${timeText(p,p.daysA)}. Management changes the group to ${groupText(p,p.crewB)} while the individual category efficiencies remain in the ratio ${c.map(category=>number(category.efficiency)).join(":")}. How long will the same assignment now take?`;
    case "findMixedCrewOutput":return `At ${s.setting}, ${groupText(p,p.crewA)} operate together for ${timeText(p,p.daysA)}. Their individual outputs are ${c.map(category=>number(category.efficiency)).join(", ")} ${p.context.outputUnit} per ${timeUnit(p)}, respectively. How many ${p.context.outputUnit} will they produce in total?`;
    case "findEquivalentStandardResourceTime":return `For capacity planning at ${s.setting}, ${groupText(p,p.crewA)} work for ${timeText(p,p.daysA)}. Express their combined contribution as an equivalent number of ${c[target].resourceTimeUnit}, taking one ${displayCategory(c[target].singular)} as the standard unit.`;
    case "findMinimumIntegerCrewComposition":return `At ${s.setting}, a supervisor needs an exact combined output of ${number(required(p.targetCrewRate,"targetCrewRate"))} ${p.context.outputUnit} per ${timeUnit(p)} using at least one ${displayCategory(c[0].singular)} and at least one ${displayCategory(c[1].singular)}. Their individual efficiencies are ${number(c[0].efficiency)} and ${number(c[1].efficiency)}. What is the smallest possible positive-integer composition?`;
    case "findUnknownCategorySoloTime":return `At ${s.setting}, ${groupText(p,p.crewA)} together complete ${s.assignment} in ${timeText(p,p.daysA)}. One ${displayCategory(c[0].singular)} working alone would finish it in ${timeText(p,reciprocal(c[0].efficiency))}. How many ${timeUnit(p)}s would one ${displayCategory(c[target].singular)} working alone require?`;
    case "findCategoryContributionFraction":return `At ${s.setting}, ${groupText(p,p.crewA)} work together on ${s.assignment}. Their per-unit efficiencies are in the ratio ${c.map(category=>number(category.efficiency)).join(":")}. What fraction of the total work is contributed by the ${displayCategory(c[target].plural)}?`;
    case "compareTwoHeterogeneousCrews":return `Two groups are being compared for ${s.assignment} at ${s.setting}. Group A has ${groupText(p,p.crewA)}, while Group B has ${groupText(p,p.crewB)}. If the three category efficiencies are in the ratio ${c.map(category=>number(category.efficiency)).join(":")}, what is the work-rate ratio of Group A to Group B?`;
    case "findIntegerCrewCompositionUnderConstraints":return `At ${s.setting}, a team has ${number(required(p.totalCrewCount,"totalCrewCount"))} members consisting only of ${displayCategory(c[0].plural)} and ${displayCategory(c[1].plural)}. One member of the two categories produces ${number(c[0].efficiency)} and ${number(c[1].efficiency)} ${p.context.outputUnit} per ${timeUnit(p)}, respectively, and the team's combined rate is ${number(required(p.targetCrewRate,"targetCrewRate"))} ${p.context.outputUnit} per ${timeUnit(p)}. How many members belong to each category?`;
  }
}

export function tmwCp007PlainEnglishOpening(entry:TmwCp007RegistryEntry,p:TmwCp007Parameters):string{
  const c=p.context.categories,target=p.targetCategoryIndex??p.replacementCategoryIndex??0;
  switch(entry.ruleId){
    case "TMW_CATEGORY_EQUIVALENCE":return `Let n denote the number of units and e the output of one unit in the same time. When two groups complete equal work in equal time, their total capacities are equal: \(n_Ae_A=n_Be_B\). Therefore, the smaller group has the greater individual efficiency.`;
    case "TMW_WEIGHTED_CREW_RATE":return `For every category, multiply the number deployed by the output of one unit. Add those category contributions to obtain the group's true combined rate before finding time or output.`;
    case "TMW_HETEROGENEOUS_LINEAR_SYSTEM":return `Give each category its own unknown per-unit output. Every production record becomes one ordinary linear equation, and the equations must be solved together because the categories are not equally efficient.`;
    case "TMW_CATEGORY_REPLACEMENT":return `A capacity-preserving replacement must supply exactly the capacity removed. If the changed group has a different total rate, completion time changes inversely with that rate.`;
    case "TMW_WEIGHTED_CONTRIBUTION":return `The ${displayCategory(c[target].plural)} contribute according to their number multiplied by their individual efficiency; raw headcount alone is not enough.`;
    case "TMW_INTEGER_CREW_SEARCH":return `The category counts must be whole positive numbers. First satisfy the exact weighted-capacity equation, then apply the stated total-count or minimum-count condition.`;
  }
}

export function tmwCp007ExamShortcut(shortcut:TmwCp007LearningShortcut):TmwCp007LearningShortcut{
  return {title:`10-Second ${shortcut.title}`,steps:shortcut.steps};
}

export function tmwCp007FriendlyTrap(trap:TmwCp007CommonTrap):TmwCp007CommonTrap{
  const warning=(()=>{
    switch(trap.misconceptionId){
      case "COUNT_RATIO_NOT_INVERTED":return "Do not copy the group-count ratio as the efficiency ratio. Equal work in equal time means individual efficiencies are in the reverse order of the counts.";
      case "CATEGORY_RATES_ASSUMED_EQUAL":return "Do not add raw headcounts. Different categories have different outputs, so each count must first be weighted by its own efficiency.";
      case "CREW_RATE_NOT_SUMMED":return "Include the contribution of every active category before converting the combined rate into time or output.";
      case "KNOWN_CATEGORY_OMITTED":return "Subtract the capacity already supplied by the known categories before dividing by the efficiency of the missing category.";
      case "TOTAL_REPORTED_AS_REPLACEMENT":return "Check the exact target: the question asks for the replacement or additional category count, not a combined workforce total.";
      case "REPLACEMENT_RATIO_REVERSED":return "A stronger category needs fewer units and a weaker category needs more. Apply the efficiency ratio in the correct direction.";
      case "TIME_RATE_INVERSION_MISSED":return "Completion time moves opposite to rate. A higher combined rate means less time, not more.";
      case "CONTRIBUTION_USES_HEADCOUNT_ONLY":return "Contribution is count multiplied by efficiency. A larger headcount does not automatically mean a larger work share.";
      case "PAIR_ORDER_REVERSED":return "Keep the answer in the same category order asked in the question; reversing the terms gives the inverse ratio or swapped counts.";
      case "INTEGER_CONSTRAINT_IGNORED":return "Both category counts must satisfy every equation exactly and must remain positive whole numbers.";
      default:return trap.explanation;
    }
  })();
  return {...trap,explanation:`Don't fall for ${trap.optionLabel} (${trap.optionText})! ${warning}`};
}

export function isTmwCp007ExamStyleStem(stem:string):boolean{
  const setting=/factory|warehouse|contractor|construction|highway|bank|printing press|bottling plant|workshop|maintenance|project workplace|painting site|operations centre|verification unit/i;
  const mechanical=/^(?:\d|How many |A crew containing|Group A contains|A crew has)/;
  return setting.test(stem)&&!mechanical.test(stem);
}

export function explainTmwCp007Target(entry:TmwCp007RegistryEntry,p:TmwCp007Parameters,solution:TmwCp007Solution):string{
  const target=p.targetCategoryIndex??p.replacementCategoryIndex??0,category=displayCategory(p.context.categories[target].singular);
  switch(entry.answerType){
    case "COUNT":return `The final value is a number of ${displayCategory(p.context.categories[target].plural)}, so the option must include that category label.`;
    case "TIME":return `The answer is a completion time in ${timeUnit(p)}s, not a production rate.`;
    case "RATE":return `The answer is the output of ${entry.solveMode==="findCategoryRateFromWeightedCrewFacts"?`one ${category}`:"the complete mixed group"} per ${timeUnit(p)}.`;
    case "COUNT_PAIR":return "The answer must report both category counts in the order requested.";
    case "WORK":return `The answer is total ${p.context.outputUnit}, so multiply the combined rate by the full operating time.`;
    case "FRACTION":return "The answer is a fraction of total work and must lie between 0 and 1.";
    case "RESOURCE_TIME":return `The answer must be expressed in ${p.context.categories[target].resourceTimeUnit}.`;
    default:return `Keep the final ratio in the category order stated in the question: ${solution.answerText}.`;
  }
}
