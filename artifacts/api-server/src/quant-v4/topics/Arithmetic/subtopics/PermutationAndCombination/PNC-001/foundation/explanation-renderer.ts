import { getPnc001ExplanationStrategy, renderPnc001Template } from "./library";
import type { Pnc001Explanation, Pnc001Parameters, Pnc001ReasoningEvidence, Pnc001SolverResult } from "./types";
function readableList(values:number[]):string{if(values.length<=1)return String(values[0]??"");if(values.length===2)return`${values[0]} and ${values[1]}`;return`${values.slice(0,-1).join(", ")} and ${values.at(-1)}`;}
export function renderPnc001Explanation(parameters:Pnc001Parameters,solver:Pnc001SolverResult,_reasoning:Pnc001ReasoningEvidence):Pnc001Explanation{
  const strategy=getPnc001ExplanationStrategy(parameters.explanationId);if(strategy.solveMode!==parameters.solveMode)throw new Error(`PNC-001 explanation ${parameters.explanationId} does not support ${parameters.solveMode}`);
  const e=solver.evidence,stages=e.stageCounts??[],caseA=e.caseCounts?.[0],caseB=e.caseCounts?.[1];
  const factorialFactors=e.factorialFactors??[],permutationFactors=e.permutationFactors??[];
  const permutationN=e.permutationTotalObjects??parameters.values.totalObjects??0,permutationR=e.permutationSelectedObjects??parameters.values.selectedObjects??0;
  const combinationN=e.combinationTotalObjects??parameters.values.totalObjects??0,combinationR=e.combinationSelectedObjects??parameters.values.selectedObjects??0;
  const multisetMultiplicities=e.multisetMultiplicities??[];
  const remainingMultiplicities=e.multisetRemainingMultiplicities??[];
  const calculation=parameters.taskKind==="fundamentalCountingApplication"?solver.equation.replace(` = ${solver.answer}`,""):solver.equation;
  const permutationKnowns=e.recoveredPermutationParameter==="n"?`r = ${permutationR}`:`n = ${permutationN}`;
  const combinationKnowns=e.recoveredCombinationParameter==="n"?`r = ${combinationR}`:`n = ${combinationN}`;
  const target=e.multisetTarget??e.combinationTarget??e.permutationTarget??e.factorialTarget??parameters.values.target??0;
  const multisetDenominatorExpression=multisetMultiplicities.map(value=>`${value}!`).join(" × ")||"1";
  const variables:Record<string,string|number>={
    ...parameters.renderVariables,answer:solver.answer,stageList:readableList(stages),calculation,unrestrictedCalculation:stages.join(" × "),
    totalCount:e.totalCount??solver.numericAnswer,invalidCount:e.invalidCount??0,
    caseACount:caseA?.count??0,caseBCount:caseB?.count??0,caseACalculation:caseA?.factors.join(" × ")??"",caseBCalculation:caseB?.factors.join(" × ")??"",
    knownChoices:e.knownChoices??parameters.values.knownChoices??0,totalChoices:e.totalChoices??parameters.values.totalChoices??0,
    factorialArgument:e.factorialArgument??parameters.values.factorialArgument??0,factorialValue:e.factorialValue??solver.numericAnswer,
    factorialExpansion:factorialFactors.length?factorialFactors.join(" × "):"1",unitFactorial:e.unitFactorial??"0!",
    upper:e.factorialUpper??parameters.values.upper??0,lower:e.factorialLower??parameters.values.lower??0,
    quotientExpansion:factorialFactors.join(" × "),factorList:(permutationFactors.length?permutationFactors:factorialFactors).join(" × "),
    target,matchedArgument:e.matchedFactorialArgument??parameters.values.matchedFactorialArgument??0,previousInteger:solver.numericAnswer-1,
    totalObjects:e.combinationTotalObjects??e.permutationTotalObjects??parameters.values.totalObjects??0,
    selectedObjects:e.combinationSelectedObjects??e.permutationSelectedObjects??parameters.values.selectedObjects??0,
    permutationKnowns,matchedPermutationEquation:`${permutationN}P${permutationR} = ${e.permutationTarget??parameters.values.target??solver.numericAnswer}`,
    orderedCount:e.combinationOrderedCount??0,selectionFactorial:e.combinationSelectionFactorial??1,
    combinationKnowns,matchedCombinationEquation:`${combinationN}C${combinationR} = ${target}`,
    knownSelection:e.combinationKnownSelection??parameters.values.knownSelection??0,
    multisetTotalObjects:e.multisetTotalObjects??parameters.values.totalObjects??0,
    multisetRemainingObjects:e.multisetRemainingObjects??0,
    multiplicityList:readableList(multisetMultiplicities),
    remainingMultiplicityList:remainingMultiplicities.length?readableList(remainingMultiplicities):"none",
    multisetNumerator:e.multisetNumerator!==undefined?`${e.multisetTotalObjects??e.multisetRemainingObjects}! = ${e.multisetNumerator}`:"",
    multisetDenominator:e.multisetDenominator!==undefined?`${multisetDenominatorExpression} = ${e.multisetDenominator}`:"",
    multisetDenominatorCalculation:e.multisetDenominator!==undefined?`${multisetDenominatorExpression} = ${e.multisetDenominator}`:"",
    maximumMultiplicity:parameters.values.maximumMultiplicity??0,
    matchedMultiplicityEquation:`${e.multisetTotalObjects??parameters.values.totalObjects??0}! ÷ ${e.recoveredMultisetMultiplicity??solver.numericAnswer}! = ${e.multisetTarget??parameters.values.target??0}`,
  };
  return{explanationId:parameters.explanationId,lines:[strategy.concept,...strategy.lines.map(line=>renderPnc001Template(line,variables))]};
}
