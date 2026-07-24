import type { Pnc001IndependentVerification, Pnc001Parameters, Pnc001ReasoningEvidence, Pnc001SolverResult } from "./types";
const CONCEPT_IDS={
 countSequentialIndependentChoices:"FUNDAMENTAL_COUNTING_PRODUCT",countMutuallyExclusiveAlternatives:"FUNDAMENTAL_COUNTING_SUM",countDisjointCasePartition:"DISJOINT_CASE_PARTITION",countUsingSimpleComplement:"SIMPLE_COMPLEMENT",recoverMissingStageChoiceCount:"EXACT_FACTOR_RECOVERY",
 evaluateFactorialValue:"FACTORIAL_DEFINITION",evaluateFactorialUnitExpression:"FACTORIAL_ZERO_ONE_IDENTITY",simplifyFactorialQuotient:"FACTORIAL_CANCELLATION",recoverFactorialArgument:"FACTORIAL_INVERSE_SEARCH",recoverFactorialQuotientArgument:"FACTORIAL_QUOTIENT_INVERSE_SEARCH",
 arrangeAllDistinctObjects:"PERMUTATION_ALL_DISTINCT",arrangeRFromNDistinctObjects:"PERMUTATION_ORDERED_SELECTION",recoverPermutationParameter:"PERMUTATION_INVERSE_SEARCH",
}as const;
export function buildPnc001ReasoningEvidence(parameters:Pnc001Parameters,solver:Pnc001SolverResult,verification:Pnc001IndependentVerification):Pnc001ReasoningEvidence{
 const intermediateValues:Record<string,string|number>={};const e=solver.evidence;
 for(const[key,value]of Object.entries({totalCount:e.totalCount,invalidCount:e.invalidCount,factorialArgument:e.factorialArgument,factorialValue:e.factorialValue,factorialUpper:e.factorialUpper,factorialLower:e.factorialLower,factorialTarget:e.factorialTarget,matchedFactorialArgument:e.matchedFactorialArgument,permutationTotalObjects:e.permutationTotalObjects,permutationSelectedObjects:e.permutationSelectedObjects,permutationTarget:e.permutationTarget}))if(value!==undefined)intermediateValues[key]=value;
 for(const item of e.caseCounts??[])intermediateValues[`case${item.label}Count`]=item.count;
 return{conceptId:CONCEPT_IDS[parameters.solveMode],givens:{...parameters.renderVariables},equations:[solver.equation],intermediateValues,decisiveCalculation:solver.equation,verification:`${verification.method}: ${verification.answer}`};
}