export const PNC_001_PACKAGE_ID = "PNC-001" as const;
export const PNC_001_CP_IDS = ["PNC-CP-001", "PNC-CP-002", "PNC-CP-003", "PNC-CP-004", "PNC-CP-005", "PNC-CP-006"] as const;
export const PNC_001_ACTIVE_CP_IDS = PNC_001_CP_IDS;

export type Pnc001CanonicalProblemId = (typeof PNC_001_CP_IDS)[number];
export type Pnc001ActiveCanonicalProblemId = Pnc001CanonicalProblemId;
export type Pnc001Language = "en" | "hi" | "pa";
export type Pnc001Difficulty = "Easy" | "Medium" | "Hard";
export type Pnc001Maturity = "DESIGN_LOCKED" | "RUNTIME_PROOF" | "MVP_QA" | "PRODUCTION_QA" | "MANUAL_REVIEW" | "FROZEN";
export type Pnc001AnswerType = "COUNT";
export type Pnc001TaskKind = "fundamentalCountingApplication" | "factorialReasoning" | "distinctPermutation" | "distinctCombination" | "digitCodeFormation" | "multisetPermutation";
export type Pnc001Cp006TaskKind = "selectionRoleAssignment";

export type Pnc001SolveMode =
  | "countSequentialIndependentChoices"
  | "countMutuallyExclusiveAlternatives"
  | "countDisjointCasePartition"
  | "countUsingSimpleComplement"
  | "recoverMissingStageChoiceCount"
  | "evaluateFactorialValue"
  | "evaluateFactorialUnitExpression"
  | "simplifyFactorialQuotient"
  | "recoverFactorialArgument"
  | "recoverFactorialQuotientArgument"
  | "arrangeAllDistinctObjects"
  | "arrangeRFromNDistinctObjects"
  | "recoverPermutationParameter"
  | "selectRFromNDistinctObjects"
  | "recoverCombinationParameter"
  | "recoverComplementaryCombinationIndex"
  | "formNumbersWithoutRepetitionNoZero"
  | "formNumbersWithoutRepetitionWithZero"
  | "formCodesWithRepetition"
  | "formNumbersWithRepetitionAndZero"
  | "formParityNumbersWithoutRepetition"
  | "formDivisibleByFiveNumbersWithoutRepetition"
  | "formNumbersAboveLeadingThreshold"
  | "formAlphanumericCodes"
  | "recoverSymbolCountForCode"
  | "formCodesWithExactlyOnePair"
  | "arrangeAllMultisetObjects"
  | "arrangeMultisetAfterFixingPosition"
  | "findMultisetOvercountFactor"
  | "recoverMultisetMultiplicity"
  | "findDictionaryRankOfWord";

export type Pnc001Cp006SolveMode =
  | "selectThenAssignDistinctRoles"
  | "selectThenArrangeAllSelected"
  | "findRoleAssignmentMultiplier"
  | "recoverSelectionRoleParameter";
export type Pnc001AnySolveMode = Pnc001SolveMode | Pnc001Cp006SolveMode;
export type Pnc001AnyTaskKind = Pnc001TaskKind | Pnc001Cp006TaskKind;

export interface Pnc001QuestionLanguageEntry { qlId: string; cpId: Pnc001CanonicalProblemId; difficulty: Pnc001Difficulty; template: string; }
export interface Pnc001RegistryGroup {
  qlIds: string[]; cpId: Pnc001CanonicalProblemId; taskKind: Pnc001AnyTaskKind; solveMode: Pnc001AnySolveMode;
  answerType: Pnc001AnswerType; explanationId: string; requiredVariables: string[]; scenarioFamily: string;
  constraintProfile: string; distractorProfile: string; difficulty: Pnc001Difficulty; active: boolean;
}
export interface Pnc001QuestionEntry extends Pnc001QuestionLanguageEntry {
  taskKind: Pnc001AnyTaskKind;
  solveMode: Pnc001AnySolveMode;
  answerType: Pnc001AnswerType; explanationId: string; requiredVariables: string[]; scenarioFamily: string;
  constraintProfile: string; distractorProfile: string; active: boolean;
}
export interface Pnc001ParameterInput {
  canonicalProblemId?: Pnc001ActiveCanonicalProblemId; cpId?: Pnc001ActiveCanonicalProblemId; difficulty?: Pnc001Difficulty;
  difficultyBand?: Pnc001Difficulty; language?: Pnc001Language; questionLanguageId?: string; seed?: string;
}
export interface Pnc001Parameters {
  packageId: typeof PNC_001_PACKAGE_ID; canonicalProblemId: Pnc001ActiveCanonicalProblemId; questionLanguageId: string;
  questionId: string; seed: string; language: "en"; difficulty: Pnc001Difficulty; taskKind: Pnc001AnyTaskKind;
  solveMode: Pnc001SolveMode; answerType: Pnc001AnswerType; explanationId: string; requiredVariables: string[];
  scenarioFamily: string; constraintProfile: string; distractorProfile: string; values: Record<string, number>;
  renderVariables: Record<string, string | number>;
}

export interface Pnc001DictionaryRankContribution {
  position: number;
  currentLetter: string;
  smallerLetter: string;
  remainingArrangementCount: number;
}

export interface Pnc001SolverEvidence {
  stageCounts?: number[]; caseCounts?: Array<{ label: string; count: number; factors: number[] }>;
  totalCount?: number; invalidCount?: number; knownChoices?: number; totalChoices?: number;
  factorialArgument?: number; factorialValue?: number; factorialUpper?: number; factorialLower?: number;
  factorialFactors?: number[]; factorialTarget?: number; matchedFactorialArgument?: number; displayedShift?: number;
  unitFactorial?: "0!" | "1!"; unitOperation?: "ADD" | "SUBTRACT";
  permutationTotalObjects?: number; permutationSelectedObjects?: number; permutationFactors?: number[];
  permutationTarget?: number; recoveredPermutationParameter?: "n" | "r";
  combinationTotalObjects?: number; combinationSelectedObjects?: number; combinationOrderedCount?: number;
  combinationSelectionFactorial?: number; combinationTarget?: number; combinationKnownSelection?: number;
  recoveredCombinationParameter?: "n" | "r" | "complementaryR";
  digitMaximum?: number; digitLength?: number; symbolCount?: number; firstPositionChoices?: number;
  remainingPositions?: number; positionChoices?: number[]; eligibleLastDigits?: number[]; qualifyingFirstDigits?: number[];
  suffixArrangementCount?: number; letterSlots?: number; digitSlots?: number; letterChoices?: number; digitChoices?: number;
  letterStageCount?: number; digitStageCount?: number; codeTarget?: number; recoveredCodeSymbolCount?: number;
  repeatedSymbolChoices?: number; otherSymbolSelectionCount?: number; patternArrangementCount?: number;
  multisetTotalObjects?: number; multisetRemainingObjects?: number; multisetMultiplicities?: number[];
  multisetRemainingMultiplicities?: number[]; multisetNumerator?: number; multisetDenominator?: number;
  multisetTarget?: number; fixedObjectMultiplicityBefore?: number; recoveredMultisetMultiplicity?: number;
  dictionarySourceWord?: string; dictionaryTargetWord?: string; dictionarySortedLetters?: string;
  dictionaryRankContributions?: Pnc001DictionaryRankContribution[]; dictionaryPrecedingCount?: number; dictionaryRank?: number;
  mixedTotalObjects?: number; mixedSelectedObjects?: number; mixedRoleCount?: number; mixedSelectionCount?: number;
  mixedRoleAssignmentCount?: number; mixedTarget?: number; mixedEquivalentPermutationCount?: number;
  recoveredMixedParameter?: "n" | "selected" | "roles"; mixedSearchMinimum?: number; mixedSearchMaximum?: number;
  operation:
    | "PRODUCT" | "SUM" | "SUM_OF_PRODUCTS" | "COMPLEMENT" | "EXACT_DIVISION"
    | "FACTORIAL" | "FACTORIAL_UNIT_EXPRESSION" | "FACTORIAL_QUOTIENT" | "FACTORIAL_INVERSE" | "FACTORIAL_QUOTIENT_INVERSE"
    | "PERMUTATION_ALL" | "PERMUTATION_PARTIAL" | "PERMUTATION_INVERSE"
    | "COMBINATION_DIRECT" | "COMBINATION_INVERSE" | "COMBINATION_SYMMETRY"
    | "NUMBER_NO_ZERO_NO_REPEAT" | "NUMBER_WITH_ZERO_NO_REPEAT" | "CODE_REPETITION" | "NUMBER_REPETITION"
    | "PARITY_NUMBER" | "DIVISIBLE_BY_FIVE" | "THRESHOLD_NUMBER" | "ALPHANUMERIC_CODE"
    | "CODE_REPETITION_INVERSE" | "CODE_EXACTLY_ONE_PAIR"
    | "MULTISET_DIRECT" | "MULTISET_FIXED" | "MULTISET_OVERCOUNT" | "MULTISET_INVERSE" | "DICTIONARY_RANK"
    | "MIXED_SELECT_ASSIGN" | "MIXED_SELECT_ARRANGE_ALL" | "MIXED_ROLE_MULTIPLIER" | "MIXED_INVERSE";
}
export interface Pnc001SolverResult { exactAnswer: string; answer: string; numericAnswer: number; equation: string; mathJax: string; evidence: Pnc001SolverEvidence; }
export interface Pnc001IndependentVerification { supported: boolean; answer: number; method: string; }
export interface Pnc001ReasoningEvidence { conceptId: string; givens: Record<string, string | number>; equations: string[]; intermediateValues: Record<string, string | number>; decisiveCalculation: string; verification: string; }
export interface Pnc001Explanation { explanationId: string; lines: string[]; }
export interface Pnc001ValidationCheck { name: string; passed: boolean; message: string; }
export interface Pnc001ValidationResult { valid: boolean; checks: Pnc001ValidationCheck[]; }
export interface Pnc001QuestionPackage {
  packageId: typeof PNC_001_PACKAGE_ID; archetypeId: typeof PNC_001_PACKAGE_ID; canonicalProblemId: Pnc001ActiveCanonicalProblemId;
  questionLanguageId: string; questionId: string; seed: string; language: "en"; difficultyBand: Pnc001Difficulty;
  taskKind: Pnc001AnyTaskKind; solveMode: Pnc001SolveMode; stem: string; options: string[]; correctIndex: number;
  answer: string; parameters: Pnc001Parameters; solver: Pnc001SolverResult; independentVerification: Pnc001IndependentVerification;
  reasoningEvidence: Pnc001ReasoningEvidence; explanation: Pnc001Explanation; validation: Pnc001ValidationResult;
  maturity: Pnc001Maturity; publiclyPublishable: boolean; mathematicalFingerprint: string; traceability: Record<string, unknown>;
}