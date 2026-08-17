import { equals, formatRational, rational, reciprocal, toLatex } from "./rational";
import { required } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp007CommonTrap, TmwCp007LearningShortcut, TmwCp007Option, TmwCp007Parameters, TmwCp007RegistryEntry, TmwCp007Solution } from "./cp007-types";

const r=(n:number):Rational=>rational(n);
function number(value:Rational):string{return formatRational(value);}
function plural(value:Rational,singular:string,pluralForm:string):string{return equals(value,r(1))?singular:pluralForm;}
function count(p:TmwCp007Parameters,index:number,value:Rational):string{const c=p.context.categories[index];return `${number(value)} ${plural(value,c.singular,c.plural)}`;}
function timeUnit(p:TmwCp007Parameters):"hour"|"day"{return p.context.categories.every(category=>category.resourceTimeUnit.endsWith("hours"))?"hour":"day";}
function timeText(p:TmwCp007Parameters,value:Rational):string{const unit=timeUnit(p);return `${number(value)} ${plural(value,unit,`${unit}s`)}`;}
function crewText(p:TmwCp007Parameters,crew:[Rational,Rational,Rational]):string{
  const parts=crew.map((value,index)=>value.numerator===0?null:count(p,index,value)).filter((value):value is string=>Boolean(value));
  if(parts.length===1)return parts[0];if(parts.length===2)return `${parts[0]} and ${parts[1]}`;return `${parts[0]}, ${parts[1]} and ${parts[2]}`;
}
function rateText(p:TmwCp007Parameters,value:Rational):string{return `${number(value)} ${p.context.outputUnit} per ${timeUnit(p)}`;}
function isMachineContext(p:TmwCp007Parameters):boolean{return timeUnit(p)==="hour";}
function collective(p:TmwCp007Parameters):string{return isMachineContext(p)?"machine set-up":"crew";}
function activityVerb(p:TmwCp007Parameters):string{return isMachineContext(p)?"operate":"work";}
function inlineMath(latex:string):string{return `\\(${latex}\\)`;}

export function renderTmwCp007Stem(entry:TmwCp007RegistryEntry,p:TmwCp007Parameters):string{
  const c=p.context.categories,source=p.sourceCategoryIndex??0,target=p.targetCategoryIndex??p.replacementCategoryIndex??1;
  switch(entry.solveMode){
    case "findTwoCategoryEfficiencyRatio":return `${count(p,0,p.crewA[0])} can complete the same work in the same time as ${count(p,1,p.crewB[1])}. Find the efficiency ratio of one ${c[0].singular} to one ${c[1].singular}.`;
    case "findThreeCategoryEfficiencyRatio":return `${count(p,0,c[1].efficiency)} ${equals(c[1].efficiency,r(1))?"does":"do"} the same work in the same time as ${count(p,1,c[0].efficiency)}, while ${count(p,1,c[2].efficiency)} ${equals(c[2].efficiency,r(1))?"does":"do"} the same work as ${count(p,2,c[1].efficiency)}. Find the efficiency ratio ${c[0].singular}:${c[1].singular}:${c[2].singular}.`;
    case "findMixedCrewCompletionTime":return `${crewText(p,p.crewA)} ${activityVerb(p)} together on ${p.context.jobPhrase}. Their respective efficiencies are ${c.map(category=>number(category.efficiency)).join(", ")} ${p.context.outputUnit} per ${timeUnit(p)}. How long will they take to complete ${number(p.workA)} ${p.context.outputUnit}?`;
    case "findEquivalentCategoryCount":return p.replacementCategoryIndex===undefined?`How many ${c[target].plural} have the same work capacity as ${count(p,source,p.crewA[source])}?`:`${count(p,source,p.crewA[source])} are to be replaced by ${c[target].plural} without changing total capacity. How many ${c[target].plural} are required?`;
    case "findUnknownCategoryCountForTargetTime":return `${crewText(p,p.crewA)} are already assigned to ${p.context.jobPhrase}. How many additional ${c[target].plural} are required so that ${number(p.workA)} ${p.context.outputUnit} are completed in ${timeText(p,p.daysA)}? The per-${timeUnit(p)} efficiencies of ${c.map(category=>category.plural).join(", ")} are ${c.map(category=>number(category.efficiency)).join(", ")} respectively.`;
    case "findCrewCompositionFromTwoOutputFacts":return `A crew containing some ${c[0].plural} and some ${c[1].plural} produces ${number(p.workA)} ${p.context.outputUnit} in ${timeText(p,p.daysA)}. A second crew with twice as many ${c[0].plural} but the same number of ${c[1].plural} produces ${number(p.workB)} ${p.context.outputUnit} in ${timeText(p,p.daysB)}. If one ${c[0].singular} and one ${c[1].singular} produce ${number(c[0].efficiency)} and ${number(c[1].efficiency)} ${p.context.outputUnit} per ${timeUnit(p)} respectively, find the first crew's composition.`;
    case "findCategoryRateFromWeightedCrewFacts":{
      const crews=required(p.pairwiseCrews,"pairwiseCrews"),rates=required(p.pairwiseRates,"pairwiseRates");
      return `${crewText(p,crews[0])} produce ${rateText(p,rates[0])}; ${crewText(p,crews[1])} produce ${rateText(p,rates[1])}; and ${crewText(p,crews[2])} produce ${rateText(p,rates[2])}. Find the per-${timeUnit(p)} output of one ${c[target].singular}.`;
    }
    case "findHeterogeneousGroupRate":return `${crewText(p,p.crewA)} ${activityVerb(p)} together. One ${c[0].singular}, one ${c[1].singular} and one ${c[2].singular} produce ${number(c[0].efficiency)}, ${number(c[1].efficiency)} and ${number(c[2].efficiency)} ${p.context.outputUnit} per ${timeUnit(p)} respectively. Find the combined rate.`;
    case "findCompletionAfterCategoryReplacement":return `${crewText(p,p.crewA)} can complete ${p.context.jobPhrase} in ${timeText(p,p.daysA)}. If the ${collective(p)} is changed to ${crewText(p,p.crewB)}, how long will the same work take at the stated category efficiencies ${c.map(category=>number(category.efficiency)).join(":")}?`;
    case "findMixedCrewOutput":return `${crewText(p,p.crewA)} operate for ${timeText(p,p.daysA)}. Their individual outputs are ${c.map(category=>number(category.efficiency)).join(", ")} ${p.context.outputUnit} per ${timeUnit(p)} respectively. Find the total output.`;
    case "findEquivalentStandardResourceTime":return `${crewText(p,p.crewA)} ${activityVerb(p)} for ${timeText(p,p.daysA)}. Express their total contribution as equivalent ${c[target].resourceTimeUnit}, using one ${c[target].singular} as the standard.`;
    case "findMinimumIntegerCrewComposition":return `A ${collective(p)} must contain at least one ${c[0].singular} and at least one ${c[1].singular}. Their per-${timeUnit(p)} efficiencies are ${number(c[0].efficiency)} and ${number(c[1].efficiency)}. Find the smallest positive-integer category composition that gives an exact combined rate of ${number(required(p.targetCrewRate,"targetCrewRate"))} ${p.context.outputUnit} per ${timeUnit(p)}.`;
    case "findUnknownCategorySoloTime":return `${crewText(p,p.crewA)} together complete ${p.context.jobPhrase} in ${timeText(p,p.daysA)}. One ${c[0].singular} alone completes it in ${timeText(p,reciprocal(c[0].efficiency))}. In how many ${timeUnit(p)}s would one ${c[target].singular} alone complete it?`;
    case "findCategoryContributionFraction":return `${crewText(p,p.crewA)} ${activityVerb(p)} together at per-unit efficiencies ${c.map(category=>number(category.efficiency)).join(":")}. What fraction of the total work is contributed by the ${c[target].plural}?`;
    case "compareTwoHeterogeneousCrews":return `Group A contains ${crewText(p,p.crewA)}. Group B contains ${crewText(p,p.crewB)}. Using category efficiencies ${c.map(category=>number(category.efficiency)).join(":")}, find the work-rate ratio of Group A to Group B.`;
    case "findIntegerCrewCompositionUnderConstraints":return `A crew has ${number(required(p.totalCrewCount,"totalCrewCount"))} members, consisting only of ${c[0].plural} and ${c[1].plural}. Their efficiencies are ${number(c[0].efficiency)} and ${number(c[1].efficiency)} ${p.context.outputUnit} per ${timeUnit(p)}, and the crew's combined rate is ${number(required(p.targetCrewRate,"targetCrewRate"))} ${p.context.outputUnit} per ${timeUnit(p)}. Find the numbers of the two categories.`;
  }
}

export function tmwCp007Opening(entry:TmwCp007RegistryEntry):string{
  switch(entry.ruleId){
    case "TMW_CATEGORY_EQUIVALENCE":return "For equal work completed in equal time, total category capacity is equal: count × per-unit efficiency remains constant.";
    case "TMW_WEIGHTED_CREW_RATE":return "The combined rate is the sum of each category count multiplied by that category's per-unit efficiency.";
    case "TMW_HETEROGENEOUS_LINEAR_SYSTEM":return "Translate every mixed-group fact into a linear rate equation, then solve the simultaneous equations without assuming equal category efficiencies.";
    case "TMW_CATEGORY_REPLACEMENT":return "A capacity-preserving replacement must equate removed capacity with added capacity; a non-equivalent replacement changes the completion time inversely with the combined rate.";
    case "TMW_WEIGHTED_CONTRIBUTION":return "Contribution is weighted by both category count and efficiency, not by count alone.";
    case "TMW_INTEGER_CREW_SEARCH":return "Category counts are positive integers, so test only exact integer solutions and minimise the requested count after satisfying the capacity equation.";
  }
}

export function tmwCp007Givens(entry:TmwCp007RegistryEntry,p:TmwCp007Parameters):string[]{
  const c=p.context.categories,target=p.targetCategoryIndex??p.replacementCategoryIndex??0;
  switch(entry.solveMode){
    case "findTwoCategoryEfficiencyRatio":return [`Equivalent groups: ${crewText(p,p.crewA)} and ${crewText(p,p.crewB)}.`,`Required comparison: one ${c[0].singular} to one ${c[1].singular}.`];
    case "findThreeCategoryEfficiencyRatio":return [`Per-unit category efficiencies are linked by two equal-capacity statements.`,`Required order: ${c[0].singular}:${c[1].singular}:${c[2].singular}.`];
    case "findMixedCrewCompletionTime":return [`Group: ${crewText(p,p.crewA)}.`,`Total work: ${number(p.workA)} ${p.context.outputUnit}.`];
    case "findEquivalentCategoryCount":return [`Source group: ${crewText(p,p.crewA)}.`,`${p.replacementCategoryIndex===undefined?"Equivalent":"Replacement"} category: ${c[target].plural}.`];
    case "findUnknownCategoryCountForTargetTime":return [`Known group: ${crewText(p,p.crewA)}.`,`Target: ${number(p.workA)} ${p.context.outputUnit} in ${timeText(p,p.daysA)}.`];
    case "findCrewCompositionFromTwoOutputFacts":return [`First output fact: ${number(p.workA)} ${p.context.outputUnit} in ${timeText(p,p.daysA)}.`,`Second output fact: ${number(p.workB)} ${p.context.outputUnit} in ${timeText(p,p.daysB)} with twice the first-category count.`];
    case "findCategoryRateFromWeightedCrewFacts":return [`Three independent weighted-group rate equations are supplied.`,`Target category: ${c[target].singular}.`];
    case "findHeterogeneousGroupRate":return [`Group: ${crewText(p,p.crewA)}.`,`Category efficiencies: ${c.map(category=>number(category.efficiency)).join(":")}.`];
    case "findCompletionAfterCategoryReplacement":return [`Original ${collective(p)} and time: ${crewText(p,p.crewA)}, ${timeText(p,p.daysA)}.`,`Changed ${collective(p)}: ${crewText(p,p.crewB)}.`];
    case "findMixedCrewOutput":return [`Group: ${crewText(p,p.crewA)}.`,`Operating duration: ${timeText(p,p.daysA)}.`];
    case "findEquivalentStandardResourceTime":return [`Mixed group: ${crewText(p,p.crewA)} for ${timeText(p,p.daysA)}.`,`Standard category: ${c[target].singular}.`];
    case "findMinimumIntegerCrewComposition":return [`Exact target rate: ${number(required(p.targetCrewRate,"targetCrewRate"))}.`,`Both category counts must be positive integers.`];
    case "findUnknownCategorySoloTime":return [`Mixed-group time: ${timeText(p,p.daysA)}.`,`Known solo time: ${timeText(p,reciprocal(c[0].efficiency))}.`];
    case "findCategoryContributionFraction":return [`Group: ${crewText(p,p.crewA)}.`,`Target contribution: ${c[target].plural}.`];
    case "compareTwoHeterogeneousCrews":return [`Group A: ${crewText(p,p.crewA)}.`,`Group B: ${crewText(p,p.crewB)}.`];
    case "findIntegerCrewCompositionUnderConstraints":return [`Total members: ${number(required(p.totalCrewCount,"totalCrewCount"))}.`,`Required combined rate: ${number(required(p.targetCrewRate,"targetCrewRate"))}.`];
  }
}

export function tmwCp007Shortcut(entry:TmwCp007RegistryEntry,p:TmwCp007Parameters,solution:TmwCp007Solution):TmwCp007LearningShortcut{
  const c=p.context.categories,target=p.targetCategoryIndex??p.replacementCategoryIndex??0;
  switch(entry.solveMode){
    case "findTwoCategoryEfficiencyRatio":return {title:"Cross the Equivalent Counts",steps:["When equal groups finish equal work in equal time, reverse the group counts to get the per-unit efficiency ratio.",`Read the ratio directly as ${solution.answerText}.`]};
    case "findThreeCategoryEfficiencyRatio":return {title:"Build a Common Middle Term",steps:["Write both two-category ratios in the same category order.","Scale them until the middle category has the same value, then join the outer terms."]};
    case "findMixedCrewCompletionTime":return {title:"Convert Everyone to Capacity Units",steps:["Multiply each category count by its efficiency and add once.","Divide total work by that single combined-rate total."]};
    case "findEquivalentCategoryCount":return {title:"Capacity Exchange",steps:["Source count × source efficiency = equivalent count × target efficiency.",`Use the one-line exchange to obtain ${solution.answerText}.`]};
    case "findUnknownCategoryCountForTargetTime":return {title:"Required Rate Minus Known Rate",steps:["Compute target daily rate as work ÷ time.",`Subtract the known group's rate, then divide the gap by one ${c[target].singular}'s efficiency.`]};
    case "findCrewCompositionFromTwoOutputFacts":return {title:"Subtract the Two Crew Equations",steps:["Convert each output fact to a daily rate.","Subtracting cancels the unchanged second category and reveals the first count immediately."]};
    case "findCategoryRateFromWeightedCrewFacts":return {title:"Eliminate One Category at a Time",steps:["Write the three weighted group equations in aligned category order.","Use pairwise subtraction or elimination; do not divide a group rate by its total category count."]};
    case "findHeterogeneousGroupRate":return {title:"Weighted Headcount Sum",steps:["Replace each category count by count × efficiency.","Add the three capacity contributions; no reciprocal is needed for a rate answer."]};
    case "findCompletionAfterCategoryReplacement":return {title:"Old Rate × Old Time",steps:["Recover total work from the original combined rate and original time.","Divide that unchanged work by the new combined rate."]};
    case "findMixedCrewOutput":return {title:"Rate First, Then Output",steps:["Add weighted category rates to get one combined rate.","Multiply by the operating duration."]};
    case "findEquivalentStandardResourceTime":return {title:"Standard-Category Conversion",steps:["Find the mixed group's weighted contribution over the full duration.",`Divide by one ${c[target].singular}'s efficiency to express it in ${c[target].resourceTimeUnit}.`]};
    case "findMinimumIntegerCrewComposition":return {title:"Start with the Faster Category",steps:["For minimum headcount, test the largest feasible count of the faster category first.","Retain only an exact positive-integer solution containing both categories."]};
    case "findUnknownCategorySoloTime":return {title:"Rate Gap Method",steps:["Mixed-group rate = reciprocal of mixed completion time.","Subtract the known category contribution, divide by the unknown count, then take the reciprocal."]};
    case "findCategoryContributionFraction":return {title:"Weighted Share",steps:[`Target share = (${c[target].plural} × their efficiency) ÷ total weighted rate.`,"Cancel common factors before multiplying anything large."]};
    case "compareTwoHeterogeneousCrews":return {title:"Compare Capacity Totals",steps:["Find one weighted-rate total for each group.","Reduce those two totals directly to the required ratio."]};
    case "findIntegerCrewCompositionUnderConstraints":return {title:"Replace One Variable Using Total Headcount",steps:["Use y = total − x in the capacity equation.","Solve one linear equation, then recover the second count."]};
  }
}

function trapReason(id:TmwCp007Option["misconceptionId"]):string{
  switch(id){
    case "CATEGORY_RATES_ASSUMED_EQUAL":return "This treats every category as equally productive and therefore uses raw headcount instead of weighted capacity.";
    case "COUNT_RATIO_NOT_INVERTED":return "Equivalent group counts and individual efficiencies vary inversely; copying the count ratio gives the reverse result.";
    case "CREW_RATE_NOT_SUMMED":return "This omits or mis-combines one or more category contributions before converting rate to time or output.";
    case "KNOWN_CATEGORY_OMITTED":return "This solves from the total requirement without first removing the capacity already supplied by known categories.";
    case "TOTAL_REPORTED_AS_REPLACEMENT":return "This reports a combined total rather than the requested replacement or additional category count.";
    case "REPLACEMENT_RATIO_REVERSED":return "The efficiency ratio is applied in the wrong direction, so stronger and weaker categories are exchanged incorrectly.";
    case "TIME_RATE_INVERSION_MISSED":return "Completion time is inverse to rate; using the rate factor directly reverses the time effect.";
    case "CONTRIBUTION_USES_HEADCOUNT_ONLY":return "Contribution depends on count × efficiency, not on the number of people or machines alone.";
    case "PAIR_ORDER_REVERSED":return "The two category counts or ratio terms are placed in the opposite order from the question.";
    case "INTEGER_CONSTRAINT_IGNORED":return "The value may look close but it does not satisfy every exact integer category-count constraint simultaneously.";
    case "PLAUSIBLE_SCALE_ERROR":return "This is a nearby scaled value that does not satisfy the original weighted-capacity equation.";
    case "CORRECT":return "";
  }
}

export function tmwCp007CommonTrap(options:TmwCp007Option[],correctIndex:number):TmwCp007CommonTrap{
  const preferred=options.map((option,index)=>({option,index})).find(({option,index})=>index!==correctIndex&&option.misconceptionId!=="PLAUSIBLE_SCALE_ERROR")??options.map((option,index)=>({option,index})).find(({index})=>index!==correctIndex);
  if(!preferred||preferred.option.misconceptionId==="CORRECT")throw new Error("No valid CP-007 distractor available for trap analysis");
  return {optionLabel:`Option ${String.fromCharCode(65+preferred.index)}`,optionText:preferred.option.text,misconceptionId:preferred.option.misconceptionId,explanation:trapReason(preferred.option.misconceptionId)};
}

export function tmwCp007Conclusion(entry:TmwCp007RegistryEntry,p:TmwCp007Parameters,answerText:string):string{
  const c=p.context.categories,target=p.targetCategoryIndex??p.replacementCategoryIndex??0;
  switch(entry.solveMode){
    case "findTwoCategoryEfficiencyRatio":
    case "findThreeCategoryEfficiencyRatio":return `Therefore, the required category-efficiency ratio is ${answerText}.`;
    case "findMixedCrewCompletionTime":return `Therefore, the mixed group completes ${p.context.jobPhrase} in ${answerText}.`;
    case "findEquivalentCategoryCount":return p.replacementCategoryIndex===undefined?`Therefore, ${answerText} provide the same work capacity.`:`Therefore, ${answerText} are required for the capacity-preserving replacement.`;
    case "findUnknownCategoryCountForTargetTime":return `Therefore, ${answerText} are required to meet the target time.`;
    case "findCrewCompositionFromTwoOutputFacts":
    case "findMinimumIntegerCrewComposition":
    case "findIntegerCrewCompositionUnderConstraints":return `Therefore, the required category composition is ${answerText}.`;
    case "findCategoryRateFromWeightedCrewFacts":return `Therefore, one ${c[target].singular} produces ${answerText}.`;
    case "findHeterogeneousGroupRate":return `Therefore, the combined rate is ${answerText}.`;
    case "findCompletionAfterCategoryReplacement":return `Therefore, the changed group completes the same work in ${answerText}.`;
    case "findMixedCrewOutput":return `Therefore, the mixed machines produce ${answerText}.`;
    case "findEquivalentStandardResourceTime":return `Therefore, the mixed contribution equals ${answerText}.`;
    case "findUnknownCategorySoloTime":return `Therefore, one ${c[target].singular} alone would take ${answerText}.`;
    case "findCategoryContributionFraction":return `Therefore, the ${c[target].plural} contribute ${answerText}.`;
    case "compareTwoHeterogeneousCrews":return `Therefore, the work-rate ratio of Group A to Group B is ${answerText}.`;
  }
}

export function wrapTmwCp007Math(latex:string):string{return inlineMath(latex);}
