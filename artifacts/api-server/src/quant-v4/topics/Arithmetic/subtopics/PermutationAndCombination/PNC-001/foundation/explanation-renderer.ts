import { getPnc001ExplanationStrategy, renderPnc001Template } from "./library";
import type { Pnc001Explanation, Pnc001Parameters, Pnc001ReasoningEvidence, Pnc001SolverResult } from "./types";
function readableList(values:number[]):string{if(values.length<=1)return String(values[0]??"");if(values.length===2)return`${values[0]} and ${values[1]}`;return`${values.slice(0,-1).join(", ")} and ${values.at(-1)}`;}
export function renderPnc001Explanation(parameters:Pnc001Parameters,solver:Pnc001SolverResult,_reasoning:Pnc001ReasoningEvidence):Pnc001Explanation{
  const strategy=getPnc001ExplanationStrategy(parameters.explanationId);if(strategy.solveMode!==parameters.solveMode)throw new Error(`PNC-001 explanation ${parameters.explanationId} does not support ${parameters.solveMode}`);
  const stages=solver.evidence.stageCounts??[],caseA=solver.evidence.caseCounts?.[0],caseB=solver.evidence.caseCounts?.[1];
  const factorialFactors=solver.evidence.factorialFactors??[],permutationFactors=solver.evidence.permutationFactors??[];
  const n=solver.evidence.permutationTotalObjects??parameters.values.totalObjects??0,r=solver.evidence.permutationSelectedObjects??parameters.values.selectedObjects??0;
  const calculation=parameters.taskKind==="fundamentalCountingApplication"?solver.equation.replace(` = ${solver.answer}`,""):solver.equation;
  const knowns=solver.evidence.recoveredPermutationParameter==="n"?`r = ${r}`:`n = ${n}`;
  const variables:Record<string,string|number>={
    ...parameters.renderVariables,answer:solver.answer,stageList:readableList(stages),calculation,unrestrictedCalculation:stages.join(" × "),
    totalCount:solver.evidence.totalCount??solver.numericAnswer,invalidCount:solver.evidence.invalidCount??0,
    caseACount:caseA?.count??0,caseBCount:caseB?.count??0,caseACalculation:caseA?.factors.join(" × ")??"",caseBCalculation:caseB?.factors.join(" × ")??"",
    knownChoices:solver.evidence.knownChoices??parameters.values.knownChoices??0,totalChoices:solver.evidence.totalChoices??parameters.values.totalChoices??0,
    factorialArgument:solver.evidence.factorialArgument??parameters.values.factorialArgument??0,factorialValue:solver.evidence.factorialValue??solver.numericAnswer,
    factorialExpansion:factorialFactors.length?factorialFactors.join(" × "):"1",unitFactorial:solver.evidence.unitFactorial??"0!",
    upper:solver.evidence.factorialUpper??parameters.values.upper??0,lower:solver.evidence.factorialLower??parameters.values.lower??0,
    quotientExpansion:factorialFactors.join(" × "),factorList:(permutationFactors.length?permutationFactors:factorialFactors).join(" × "),
    target:solver.evidence.permutationTarget??solver.evidence.factorialTarget??parameters.values.target??0,
    matchedArgument:solver.evidence.matchedFactorialArgument??parameters.values.matchedFactorialArgument??0,previousInteger:solver.numericAnswer-1,
    totalObjects:n,selectedObjects:r,permutationKnowns:knowns,matchedPermutationEquation:`${n}P${r} = ${solver.evidence.permutationTarget??parameters.values.target??solver.numericAnswer}`,
  };
  return{explanationId:parameters.explanationId,lines:[strategy.concept,...strategy.lines.map(line=>renderPnc001Template(line,variables))]};
}