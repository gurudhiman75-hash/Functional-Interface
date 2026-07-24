import type { Pnc001IndependentVerification, Pnc001Parameters, Pnc001ReasoningEvidence, Pnc001SolverResult } from "./types";
const CONCEPT_IDS={
 countSequentialIndependentChoices:"FUNDAMENTAL_COUNTING_PRODUCT",countMutuallyExclusiveAlternatives:"FUNDAMENTAL_COUNTING_SUM",countDisjointCasePartition:"DISJOINT_CASE_PARTITION",countUsingSimpleComplement:"SIMPLE_COMPLEMENT",recoverMissingStageChoiceCount:"EXACT_FACTOR_RECOVERY",
 evaluateFactorialValue:"FACTORIAL_DEFINITION",evaluateFactorialUnitExpression:"FACTORIAL_ZERO_ONE_IDENTITY",simplifyFactorialQuotient:"FACTORIAL_CANCELLATION",recoverFactorialArgument:"FACTORIAL_INVERSE_SEARCH",recoverFactorialQuotientArgument:"FACTORIAL_QUOTIENT_INVERSE_SEARCH",
 arrangeAllDistinctObjects:"PERMUTATION_ALL_DISTINCT",arrangeRFromNDistinctObjects:"PERMUTATION_ORDERED_SELECTION",recoverPermutationParameter:"PERMUTATION_INVERSE_SEARCH",
 selectRFromNDistinctObjects:"COMBINATION_UNORDERED_SELECTION",recoverCombinationParameter:"COMBINATION_INVERSE_SEARCH",recoverComplementaryCombinationIndex:"COMBINATION_SYMMETRY",
 formNumbersWithoutRepetitionNoZero:"NUMBER_FORMATION_NO_ZERO",formNumbersWithoutRepetitionWithZero:"NUMBER_FORMATION_LEADING_ZERO",formCodesWithRepetition:"CODE_FORMATION_REPETITION",formNumbersWithRepetitionAndZero:"NUMBER_FORMATION_REPETITION_LEADING_ZERO",
 formParityNumbersWithoutRepetition:"NUMBER_FORMATION_PARITY_CASES",formDivisibleByFiveNumbersWithoutRepetition:"NUMBER_FORMATION_DIVISIBLE_BY_FIVE",formNumbersAboveLeadingThreshold:"NUMBER_FORMATION_THRESHOLD_PREFIX",formAlphanumericCodes:"ALPHANUMERIC_FIXED_PATTERN",recoverSymbolCountForCode:"CODE_ALPHABET_INVERSE",formCodesWithExactlyOnePair:"CODE_MULTIPLICITY_PATTERN_211",
 arrangeAllMultisetObjects:"MULTISET_IDENTICAL_CORRECTION",arrangeMultisetAfterFixingPosition:"MULTISET_FIXED_POSITION",findMultisetOvercountFactor:"MULTISET_OVERCOUNT_FACTOR",recoverMultisetMultiplicity:"MULTISET_INVERSE_SEARCH",
}as const;
export function buildPnc001ReasoningEvidence(parameters:Pnc001Parameters,solver:Pnc001SolverResult,verification:Pnc001IndependentVerification):Pnc001ReasoningEvidence{
 const intermediateValues:Record<string,string|number>={};const e=solver.evidence;
 for(const[key,value]of Object.entries({
  totalCount:e.totalCount,invalidCount:e.invalidCount,
  factorialArgument:e.factorialArgument,factorialValue:e.factorialValue,factorialUpper:e.factorialUpper,factorialLower:e.factorialLower,factorialTarget:e.factorialTarget,matchedFactorialArgument:e.matchedFactorialArgument,
  permutationTotalObjects:e.permutationTotalObjects,permutationSelectedObjects:e.permutationSelectedObjects,permutationTarget:e.permutationTarget,
  combinationTotalObjects:e.combinationTotalObjects,combinationSelectedObjects:e.combinationSelectedObjects,combinationOrderedCount:e.combinationOrderedCount,combinationSelectionFactorial:e.combinationSelectionFactorial,combinationTarget:e.combinationTarget,combinationKnownSelection:e.combinationKnownSelection,
  digitMaximum:e.digitMaximum,digitLength:e.digitLength,symbolCount:e.symbolCount,firstPositionChoices:e.firstPositionChoices,remainingPositions:e.remainingPositions,suffixArrangementCount:e.suffixArrangementCount,
  letterSlots:e.letterSlots,digitSlots:e.digitSlots,letterChoices:e.letterChoices,digitChoices:e.digitChoices,letterStageCount:e.letterStageCount,digitStageCount:e.digitStageCount,codeTarget:e.codeTarget,recoveredCodeSymbolCount:e.recoveredCodeSymbolCount,
  repeatedSymbolChoices:e.repeatedSymbolChoices,otherSymbolSelectionCount:e.otherSymbolSelectionCount,patternArrangementCount:e.patternArrangementCount,
  multisetTotalObjects:e.multisetTotalObjects,multisetRemainingObjects:e.multisetRemainingObjects,multisetNumerator:e.multisetNumerator,multisetDenominator:e.multisetDenominator,multisetTarget:e.multisetTarget,fixedObjectMultiplicityBefore:e.fixedObjectMultiplicityBefore,recoveredMultisetMultiplicity:e.recoveredMultisetMultiplicity,
 }))if(value!==undefined)intermediateValues[key]=value;
 if(e.positionChoices)intermediateValues.positionChoices=e.positionChoices.join(",");
 if(e.eligibleLastDigits)intermediateValues.eligibleLastDigits=e.eligibleLastDigits.join(",");
 if(e.qualifyingFirstDigits)intermediateValues.qualifyingFirstDigits=e.qualifyingFirstDigits.join(",");
 if(e.multisetMultiplicities)intermediateValues.multisetMultiplicities=e.multisetMultiplicities.join(",");
 if(e.multisetRemainingMultiplicities)intermediateValues.multisetRemainingMultiplicities=e.multisetRemainingMultiplicities.join(",");
 for(const item of e.caseCounts??[])intermediateValues[`case${item.label}Count`]=item.count;
 return{conceptId:CONCEPT_IDS[parameters.solveMode],givens:{...parameters.renderVariables},equations:[solver.equation],intermediateValues,decisiveCalculation:solver.equation,verification:`${verification.method}: ${verification.answer}`};
}
