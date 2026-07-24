import { createSeededRandom, factorialExact, permutationExact, productExact, shuffleSeeded, sumExact } from "./math";
import type { Pnc001Parameters, Pnc001SolverResult } from "./types";
function uniquePositiveIntegers(values:number[],correct:number):number[]{return[...new Set(values.filter(v=>Number.isInteger(v)&&v>0&&v!==correct))];}
function assertNever(value:never):never{throw new Error(`Unsupported PNC-001 solve mode for options: ${String(value)}`);}
export function buildPnc001Options(parameters:Pnc001Parameters,solver:Pnc001SolverResult):{options:string[];correctIndex:number}{
 const correct=solver.numericAnswer,e=solver.evidence;let candidates:number[]=[];
 switch(parameters.solveMode){
  case"countSequentialIndependentChoices":{const s=e.stageCounts??[];candidates=[sumExact(s),s.length>1?productExact(s.slice(0,-1)):correct+1,productExact(s.map((v,i)=>i? v:v+1)),correct+(s[0]??2)];break;}
  case"countMutuallyExclusiveAlternatives":{const s=e.stageCounts??[];candidates=[productExact(s),Math.max(...s),correct+Math.min(...s),correct-Math.min(...s)];break;}
  case"countDisjointCasePartition":{const cases=e.caseCounts??[],f=cases.flatMap(i=>i.factors);candidates=[productExact(f),sumExact(f),cases[0]?.count??correct+1,cases[1]?.count??correct+2];break;}
  case"countUsingSimpleComplement":{const t=e.totalCount??correct,i=e.invalidCount??1;candidates=[t,t+i,i,Math.max(1,t-2*i)];break;}
  case"recoverMissingStageChoiceCount":{const t=e.totalChoices??parameters.values.totalChoices!,k=e.knownChoices??parameters.values.knownChoices!;candidates=[t-k,k,Math.max(1,Math.floor(t/(k+1))),correct+k];break;}
  case"evaluateFactorialValue":{const a=e.factorialArgument??2;candidates=[factorialExact(Math.max(0,a-1)),factorialExact(a+1),a*a,correct+a];break;}
  case"evaluateFactorialUnitExpression":{const f=e.factorialValue??correct;candidates=[f,f+2,Math.max(1,f-2),1];break;}
  case"simplifyFactorialQuotient":{const f=e.factorialFactors??[],u=e.factorialUpper??correct,l=e.factorialLower??0;candidates=[sumExact(f),f.length>1?productExact(f.slice(0,-1)):u-l,factorialExact(Math.max(0,u-l)),u*Math.max(1,l)];break;}
  case"recoverFactorialArgument":{const m=e.matchedFactorialArgument??correct,t=e.factorialTarget??correct;candidates=[m,Math.max(1,correct-1),correct+1,t];break;}
  case"recoverFactorialQuotientArgument":{const t=e.factorialTarget??correct;candidates=[Math.max(1,correct-1),correct+1,Math.max(1,Math.round(Math.sqrt(t))),t];break;}
  case"arrangeAllDistinctObjects":{const n=e.permutationTotalObjects??2;candidates=[n*n,Math.max(1,factorialExact(n-1)),n,Math.max(1,Math.floor(correct/n))];break;}
  case"arrangeRFromNDistinctObjects":{const n=e.permutationTotalObjects??2,r=e.permutationSelectedObjects??2;candidates=[factorialExact(r),Math.max(1,Math.round(correct/factorialExact(r))),Math.pow(n,r),permutationExact(n,Math.max(1,r-1))];break;}
  case"recoverPermutationParameter":{const n=e.permutationTotalObjects??correct,r=e.permutationSelectedObjects??correct,t=e.permutationTarget??correct;candidates=[n,r,Math.max(1,correct-1),Math.min(t,correct+1)];break;}
  default:return assertNever(parameters.solveMode);
 }
 const distractors=uniquePositiveIntegers(candidates,correct);for(let offset=1;distractors.length<3;offset++)for(const c of[correct+offset,correct-offset]){if(c>0&&c!==correct&&!distractors.includes(c))distractors.push(c);if(distractors.length>=3)break;}
 const shuffled=shuffleSeeded([correct,...distractors.slice(0,3)],createSeededRandom(`${parameters.seed}:${parameters.questionLanguageId}:options`));return{options:shuffled.map(String),correctIndex:shuffled.indexOf(correct)};
}