import { add, divide, multiply, rational, subtract } from "./rational";
import { required, seedNumber } from "./cp001-helpers";
import type { Rational } from "./types";
import { formatTmwCp007Answer } from "./cp007-solver";
import type { TmwCp007MisconceptionId, TmwCp007Option, TmwCp007Parameters, TmwCp007RegistryEntry, TmwCp007Solution } from "./cp007-types";

const r=(n:number,d=1):Rational=>rational(n,d);
function key(values:Rational[]):string{return values.map(value=>`${value.numerator}/${value.denominator}`).join("|");}
function positive(values:Rational[]):boolean{return values.every(value=>value.numerator>0);}
function integralRequired(entry:TmwCp007RegistryEntry):boolean{return entry.answerType==="COUNT"||entry.answerType==="COUNT_PAIR"||entry.answerType==="RESOURCE_TIME";}
function totalCrew(crew:[Rational,Rational,Rational]):Rational{return crew.reduce((sum,value)=>add(sum,value),r(0));}

function modeSpecific(entry:TmwCp007RegistryEntry,p:TmwCp007Parameters,s:TmwCp007Solution):Array<{values:Rational[];label:TmwCp007MisconceptionId}>{
  const a=s.answerValues;
  switch(entry.solveMode){
    case "findTwoCategoryEfficiencyRatio":return [
      {values:[a[1],a[0]],label:"COUNT_RATIO_NOT_INVERTED"},
      {values:[r(1),r(1)],label:"CATEGORY_RATES_ASSUMED_EQUAL"},
    ];
    case "findThreeCategoryEfficiencyRatio":return [
      {values:[a[2],a[1],a[0]],label:"COUNT_RATIO_NOT_INVERTED"},
      {values:[r(1),r(1),r(1)],label:"CATEGORY_RATES_ASSUMED_EQUAL"},
      {values:[a[0],a[2],a[1]],label:"PAIR_ORDER_REVERSED"},
    ];
    case "findMixedCrewCompletionTime":return [
      {values:[multiply(a[0],r(2))],label:"CREW_RATE_NOT_SUMMED"},
      {values:[divide(p.workA,totalCrew(p.crewA))],label:"CATEGORY_RATES_ASSUMED_EQUAL"},
    ];
    case "findEquivalentCategoryCount":{
      const source=required(p.sourceCategoryIndex,"sourceCategoryIndex"),target=p.targetCategoryIndex??required(p.replacementCategoryIndex,"replacementCategoryIndex");return [
        {values:[p.crewA[source]],label:"CATEGORY_RATES_ASSUMED_EQUAL"},
        {values:[divide(multiply(p.crewA[source],p.context.categories[target].efficiency),p.context.categories[source].efficiency)],label:"REPLACEMENT_RATIO_REVERSED"},
        {values:[add(a[0],p.crewA[source])],label:"TOTAL_REPORTED_AS_REPLACEMENT"},
      ];
    }
    case "findUnknownCategoryCountForTargetTime":return [
      {values:[add(a[0],totalCrew(p.crewA))],label:"TOTAL_REPORTED_AS_REPLACEMENT"},
      {values:[divide(a[0],r(2))],label:"KNOWN_CATEGORY_OMITTED"},
    ];
    case "findCrewCompositionFromTwoOutputFacts":
    case "findMinimumIntegerCrewComposition":
    case "findIntegerCrewCompositionUnderConstraints":return [
      {values:[a[1],a[0]],label:"PAIR_ORDER_REVERSED"},
      {values:[add(a[0],r(1)),subtract(a[1],r(1))],label:"INTEGER_CONSTRAINT_IGNORED"},
      {values:[multiply(a[0],r(2)),a[1]],label:"PLAUSIBLE_SCALE_ERROR"},
    ];
    case "findCategoryRateFromWeightedCrewFacts":
    case "findHeterogeneousGroupRate":return [
      {values:[divide(a[0],r(2))],label:"CREW_RATE_NOT_SUMMED"},
      {values:[totalCrew(p.crewA)],label:"CATEGORY_RATES_ASSUMED_EQUAL"},
    ];
    case "findCompletionAfterCategoryReplacement":return [
      {values:[p.daysA],label:"CATEGORY_RATES_ASSUMED_EQUAL"},
      {values:[divide(a[0],r(2))],label:"TIME_RATE_INVERSION_MISSED"},
    ];
    case "findMixedCrewOutput":return [
      {values:[multiply(totalCrew(p.crewA),p.daysA)],label:"CATEGORY_RATES_ASSUMED_EQUAL"},
      {values:[divide(a[0],p.daysA)],label:"TIME_RATE_INVERSION_MISSED"},
    ];
    case "findEquivalentStandardResourceTime":return [
      {values:[multiply(totalCrew(p.crewA),p.daysA)],label:"CATEGORY_RATES_ASSUMED_EQUAL"},
      {values:[divide(a[0],r(2))],label:"CONTRIBUTION_USES_HEADCOUNT_ONLY"},
    ];
    case "findUnknownCategorySoloTime":return [
      {values:[divide(a[0],r(2))],label:"TIME_RATE_INVERSION_MISSED"},
      {values:[p.daysA],label:"CREW_RATE_NOT_SUMMED"},
    ];
    case "findCategoryContributionFraction":{
      const target=required(p.targetCategoryIndex,"targetCategoryIndex");return [
        {values:[divide(p.crewA[target],totalCrew(p.crewA))],label:"CONTRIBUTION_USES_HEADCOUNT_ONLY"},
        {values:[subtract(r(1),a[0])],label:"KNOWN_CATEGORY_OMITTED"},
      ];
    }
    case "compareTwoHeterogeneousCrews":return [
      {values:[a[1],a[0]],label:"PAIR_ORDER_REVERSED"},
      {values:[totalCrew(p.crewA),totalCrew(p.crewB)],label:"CATEGORY_RATES_ASSUMED_EQUAL"},
    ];
  }
}

export function buildTmwCp007Options(entry:TmwCp007RegistryEntry,p:TmwCp007Parameters,solution:TmwCp007Solution,seed:string):{options:TmwCp007Option[];correctIndex:number}{
  const correct:TmwCp007Option={text:solution.answerText,key:solution.answerKey,misconceptionId:"CORRECT"};
  const candidates=[...modeSpecific(entry,p,solution),
    {values:solution.answerValues.map(value=>multiply(value,r(2))),label:"PLAUSIBLE_SCALE_ERROR" as const},
    {values:solution.answerValues.map(value=>divide(value,r(2))),label:"PLAUSIBLE_SCALE_ERROR" as const},
    {values:solution.answerValues.map((value,index)=>index===0?add(value,r(1)):value),label:"PLAUSIBLE_SCALE_ERROR" as const},
    {values:solution.answerValues.map((value,index)=>index===0?subtract(value,r(1)):value),label:"PLAUSIBLE_SCALE_ERROR" as const},
  ];
  const seen=new Set<string>([solution.answerKey]),seenText=new Set<string>([solution.answerText]),distractors:TmwCp007Option[]=[];
  for(const candidate of candidates){
    if(!positive(candidate.values))continue;
    if(integralRequired(entry)&&candidate.values.some(value=>value.denominator!==1))continue;
    const candidateKey=key(candidate.values),candidateText=formatTmwCp007Answer(entry,p,candidate.values);if(seen.has(candidateKey)||seenText.has(candidateText))continue;seen.add(candidateKey);seenText.add(candidateText);
    distractors.push({text:candidateText,key:candidateKey,misconceptionId:candidate.label});
    if(distractors.length===3)break;
  }
  let bump=2;
  while(distractors.length<3){
    const values=solution.answerValues.map((value,index)=>index===0?add(value,r(bump)):value);bump+=1;
    const candidateKey=key(values),candidateText=formatTmwCp007Answer(entry,p,values);if(seen.has(candidateKey)||seenText.has(candidateText))continue;seen.add(candidateKey);seenText.add(candidateText);
    distractors.push({text:candidateText,key:candidateKey,misconceptionId:"PLAUSIBLE_SCALE_ERROR"});
  }
  const correctIndex=seedNumber(seed,`${entry.qlId}:correct-position`)%4,options=[...distractors];options.splice(correctIndex,0,correct);
  return {options,correctIndex};
}
