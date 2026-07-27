import { add, divide, multiply, rational, reciprocal } from "./rational";
import { pick } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp007Category, TmwCp007Context, TmwCp007Parameters, TmwCp007RegistryEntry } from "./cp007-types";

const r=(n:number,d=1):Rational=>rational(n,d);
const crew=(a:number,b:number,c=0):[Rational,Rational,Rational]=>[r(a),r(b),r(c)];
const zeroCrew=():[Rational,Rational,Rational]=>crew(0,0,0);

function category(singular:string,plural:string,efficiency:Rational,resourceTimeUnit:string):TmwCp007Category{
  return {singular,plural,efficiency,resourceTimeUnit};
}
function context(jobPhrase:string,outputUnit:string,labels:[string,string,string],efficiencies:[Rational,Rational,Rational],units:[string,string,string]):TmwCp007Context{
  return {jobPhrase,outputUnit,categories:[category(labels[0],pluralFor(labels[0]),efficiencies[0],units[0]),category(labels[1],pluralFor(labels[1]),efficiencies[1],units[1]),category(labels[2],pluralFor(labels[2]),efficiencies[2],units[2])]};
}
function pluralFor(value:string):string{
  const irregular:Record<string,string>={man:"men",woman:"women",child:"children",person:"people"};
  if(irregular[value])return irregular[value];
  if(value.endsWith("y"))return `${value.slice(0,-1)}ies`;
  return `${value}s`;
}
const workerContexts:readonly TmwCp007Context[]=[
  context("a road-repair contract","work units",["man","woman","child"],[r(3),r(2),r(1)],["man-days","woman-days","child-days"]),
  context("a component-assembly order","components",["skilled worker","unskilled worker","trainee"],[r(4),r(2),r(1)],["skilled-worker-days","unskilled-worker-days","trainee-days"]),
  context("a document-processing assignment","files",["senior clerk","junior clerk","assistant"],[r(5),r(3),r(1)],["senior-clerk-days","junior-clerk-days","assistant-days"]),
  context("a painting contract","work units",["master painter","painter","helper"],[r(6),r(3),r(2)],["master-painter-days","painter-days","helper-days"]),
];
const machineContexts:readonly TmwCp007Context[]=[
  context("a production order","components",["heavy machine","standard machine","compact machine"],[r(5),r(3),r(1)],["heavy-machine-hours","standard-machine-hours","compact-machine-hours"]),
  context("a printing order","copies",["high-speed printer","standard printer","desktop printer"],[r(6),r(3),r(1)],["high-speed-printer-hours","standard-printer-hours","desktop-printer-hours"]),
  context("a bottling order","bottles",["automatic line","semi-automatic line","manual station"],[r(4),r(2),r(1)],["automatic-line-hours","semi-automatic-line-hours","manual-station-hours"]),
];

function rate(c:TmwCp007Context,counts:[Rational,Rational,Rational]):Rational{
  return counts.reduce((sum,count,index)=>add(sum,multiply(count,c.categories[index].efficiency)),r(0));
}
function workerContext(seed:string,salt:string):TmwCp007Context{return pick(workerContexts,seed,salt);}
function anyContext(seed:string,salt:string):TmwCp007Context{return pick([...workerContexts,...machineContexts],seed,salt);}
function machineContext(seed:string,salt:string):TmwCp007Context{return pick(machineContexts,seed,salt);}

export function buildTmwCp007Parameters(entry:TmwCp007RegistryEntry,seed:string):TmwCp007Parameters{
  switch(entry.solveMode){
    case "findTwoCategoryEfficiencyRatio":{
      const c=anyContext(seed,"cp007-ratio2-context"),e0=c.categories[0].efficiency,e1=c.categories[1].efficiency;
      return {context:c,crewA:[e1,r(0),r(0)],crewB:[r(0),e0,r(0)],workA:r(1),workB:r(1),daysA:r(1),daysB:r(1),sourceCategoryIndex:0,replacementCategoryIndex:1};
    }
    case "findThreeCategoryEfficiencyRatio":{
      const c=anyContext(seed,"cp007-ratio3-context");
      return {context:c,crewA:zeroCrew(),crewB:zeroCrew(),workA:r(1),workB:r(1),daysA:r(1),daysB:r(1)};
    }
    case "findMixedCrewCompletionTime":{
      const c=anyContext(seed,"cp007-time-context"),v=pick([{crew:crew(2,3,4),days:8},{crew:crew(3,2,2),days:10},{crew:crew(4,3,1),days:6},{crew:crew(2,4,3),days:12}],seed,"cp007-time"),daily=rate(c,v.crew);
      return {context:c,crewA:v.crew,crewB:zeroCrew(),workA:multiply(daily,r(v.days)),workB:r(0),daysA:r(v.days),daysB:r(0)};
    }
    case "findEquivalentCategoryCount":{
      const c=anyContext(seed,"cp007-equivalent-context"),v=pick([
        {source:0,target:1,count:6,presentation:"EQUIVALENT"},
        {source:1,target:2,count:8,presentation:"REPLACEMENT"},
        {source:0,target:2,count:4,presentation:"REPLACEMENT"},
        {source:1,target:0,count:30,presentation:"EQUIVALENT"},
      ] as const,seed,"cp007-equivalent"),source=v.source as 0|1|2,target=v.target as 0|1|2,n=r(v.count);
      return {context:c,crewA:[source===0?n:r(0),source===1?n:r(0),source===2?n:r(0)],crewB:zeroCrew(),workA:r(1),workB:r(1),daysA:r(1),daysB:r(1),sourceCategoryIndex:source,...(v.presentation==="REPLACEMENT"?{replacementCategoryIndex:target}:{targetCategoryIndex:target})};
    }
    case "findUnknownCategoryCountForTargetTime":{
      const c=anyContext(seed,"cp007-unknown-count-context"),v=pick([{crew:crew(2,3,0),target:2,hidden:6,days:8},{crew:crew(3,0,2),target:1,hidden:5,days:10},{crew:crew(0,4,3),target:0,hidden:4,days:6},{crew:crew(2,0,5),target:1,hidden:6,days:12}],seed,"cp007-unknown-count"),full=[...v.crew] as [Rational,Rational,Rational];full[v.target]=r(v.hidden);const daily=rate(c,full);
      return {context:c,crewA:v.crew,crewB:full,workA:multiply(daily,r(v.days)),workB:r(0),daysA:r(v.days),daysB:r(0),targetCategoryIndex:v.target as 0|1|2};
    }
    case "findCrewCompositionFromTwoOutputFacts":{
      const c=workerContext(seed,"cp007-composition-facts-context"),v=pick([{x:3,y:4,d1:5,d2:4},{x:4,y:3,d1:6,d2:3},{x:2,y:5,d1:8,d2:4},{x:5,y:2,d1:4,d2:2}],seed,"cp007-composition-facts"),a=crew(v.x,v.y,0),b=crew(2*v.x,v.y,0);
      return {context:c,crewA:a,crewB:b,workA:multiply(rate(c,a),r(v.d1)),workB:multiply(rate(c,b),r(v.d2)),daysA:r(v.d1),daysB:r(v.d2),targetCategoryIndex:0,replacementCategoryIndex:1};
    }
    case "findCategoryRateFromWeightedCrewFacts":{
      const c=anyContext(seed,"cp007-weighted-system-context"),crews:[Rational,Rational,Rational][]= [crew(2,1,0),crew(0,2,1),crew(1,0,2)],rates=crews.map(item=>rate(c,item)),target=pick([0,1,2] as const,seed,"cp007-weighted-system-target");
      return {context:c,crewA:zeroCrew(),crewB:zeroCrew(),workA:r(1),workB:r(1),daysA:r(1),daysB:r(1),pairwiseCrews:crews,pairwiseRates:rates,targetCategoryIndex:target};
    }
    case "findHeterogeneousGroupRate":{
      const c=anyContext(seed,"cp007-group-rate-context"),v=pick([crew(2,3,4),crew(3,2,1),crew(4,1,3),crew(1,4,2)],seed,"cp007-group-rate");
      return {context:c,crewA:v,crewB:zeroCrew(),workA:r(1),workB:r(0),daysA:r(1),daysB:r(0)};
    }
    case "findCompletionAfterCategoryReplacement":{
      const v=pick([
        {c:workerContexts[0],base:crew(4,4,4),next:crew(2,5,4),days:10},
        {c:workerContexts[1],base:crew(3,4,4),next:crew(2,3,4),days:9},
        {c:workerContexts[2],base:crew(3,3,6),next:crew(2,2,4),days:8},
        {c:workerContexts[3],base:crew(2,4,3),next:crew(1,4,1),days:8},
        {c:machineContexts[0],base:crew(3,3,6),next:crew(2,2,4),days:8},
        {c:machineContexts[1],base:crew(2,4,6),next:crew(1,4,2),days:8},
        {c:machineContexts[2],base:crew(3,4,4),next:crew(2,3,4),days:9},
      ],seed,"cp007-replacement-time"),work=multiply(rate(v.c,v.base),r(v.days));
      return {context:v.c,crewA:v.base,crewB:v.next,workA:work,workB:work,daysA:r(v.days),daysB:divide(work,rate(v.c,v.next))};
    }
    case "findMixedCrewOutput":{
      const c=machineContext(seed,"cp007-output-context"),v=pick([{crew:crew(2,3,4),days:8},{crew:crew(3,2,2),days:10},{crew:crew(4,3,1),days:6},{crew:crew(2,4,3),days:12}],seed,"cp007-output"),output=multiply(rate(c,v.crew),r(v.days));
      return {context:c,crewA:v.crew,crewB:zeroCrew(),workA:output,workB:r(0),daysA:r(v.days),daysB:r(0)};
    }
    case "findEquivalentStandardResourceTime":{
      const v=pick([
        {c:workerContexts[0],crew:crew(2,3,3),days:4},
        {c:workerContexts[1],crew:crew(2,3,2),days:5},
        {c:workerContexts[2],crew:crew(2,3,1),days:5},
        {c:workerContexts[3],crew:crew(2,2,3),days:5},
        {c:machineContexts[0],crew:crew(2,3,1),days:5},
        {c:machineContexts[1],crew:crew(2,3,3),days:5},
        {c:machineContexts[2],crew:crew(2,3,2),days:5},
      ],seed,"cp007-resource-time");
      return {context:v.c,crewA:v.crew,crewB:zeroCrew(),workA:r(1),workB:r(0),daysA:r(v.days),daysB:r(0),targetCategoryIndex:0};
    }
    case "findMinimumIntegerCrewComposition":{
      const v=pick([
        {c:context("a repair contract","work units",["skilled worker","helper","trainee"],[r(3),r(1),r(1)],["skilled-worker-days","helper-days","trainee-days"]),target:r(10)},
        {c:context("a production order","components",["heavy machine","compact machine","manual station"],[r(4),r(1),r(1)],["heavy-machine-hours","compact-machine-hours","manual-station-hours"]),target:r(13)},
        {c:context("a printing order","copies",["high-speed printer","desktop printer","manual station"],[r(5),r(2),r(1)],["high-speed-printer-hours","desktop-printer-hours","manual-station-hours"]),target:r(19)},
      ],seed,"cp007-min");
      return {context:v.c,crewA:zeroCrew(),crewB:zeroCrew(),workA:r(1),workB:r(0),daysA:r(1),daysB:r(0),targetCrewRate:v.target,maximumCrewCount:r(20),targetCategoryIndex:0,replacementCategoryIndex:1};
    }
    case "findUnknownCategorySoloTime":{
      const v=pick([
        {c:context("a verification assignment","whole job",["senior clerk","junior clerk","assistant"],[r(1,12),r(1,18),r(1,24)],["senior-clerk-days","junior-clerk-days","assistant-days"]),crew:crew(2,3,0)},
        {c:context("a repair contract","whole job",["skilled worker","helper","trainee"],[r(1,10),r(1,20),r(1,25)],["skilled-worker-days","helper-days","trainee-days"]),crew:crew(1,2,0)},
        {c:context("a production order","whole job",["fast machine","standard machine","compact machine"],[r(1,8),r(1,16),r(1,24)],["fast-machine-hours","standard-machine-hours","compact-machine-hours"]),crew:crew(1,2,0)},
      ],seed,"cp007-solo"),daily=rate(v.c,v.crew),days=divide(r(1),daily);
      return {context:v.c,crewA:v.crew,crewB:zeroCrew(),workA:r(1),workB:r(0),daysA:days,daysB:r(0),targetCategoryIndex:1};
    }
    case "findCategoryContributionFraction":{
      const c=anyContext(seed,"cp007-contribution-context"),v=pick([{crew:crew(2,3,4),target:0},{crew:crew(3,2,2),target:1},{crew:crew(4,3,1),target:2},{crew:crew(2,4,3),target:1}],seed,"cp007-contribution");
      return {context:c,crewA:v.crew,crewB:zeroCrew(),workA:r(1),workB:r(0),daysA:r(1),daysB:r(0),targetCategoryIndex:v.target as 0|1|2};
    }
    case "compareTwoHeterogeneousCrews":{
      const c=anyContext(seed,"cp007-compare-context"),pair=pick([[crew(2,3,4),crew(3,2,2)],[crew(4,1,3),crew(2,4,2)],[crew(3,3,1),crew(1,5,2)],[crew(2,2,5),crew(4,1,2)]] as const,seed,"cp007-compare");
      return {context:c,crewA:pair[0],crewB:pair[1],workA:r(1),workB:r(1),daysA:r(1),daysB:r(1)};
    }
    case "findIntegerCrewCompositionUnderConstraints":{
      const c=workerContext(seed,"cp007-constraints-context"),v=pick([{x:4,y:6},{x:6,y:4},{x:5,y:7},{x:8,y:3}],seed,"cp007-constraints"),a=crew(v.x,v.y,0);
      return {context:c,crewA:a,crewB:zeroCrew(),workA:r(1),workB:r(0),daysA:r(1),daysB:r(0),totalCrewCount:r(v.x+v.y),targetCrewRate:rate(c,a),targetCategoryIndex:0,replacementCategoryIndex:1};
    }
  }
}

export function reciprocalEfficiency(value:Rational):Rational{return reciprocal(value);}
