export const AVG_001_PACKAGE_ID = "AVG-001" as const;
export const AVG_001_CP_IDS = ["AVG-CP-001", "AVG-CP-002", "AVG-CP-003", "AVG-CP-004", "AVG-CP-005", "AVG-CP-006"] as const;
export type Avg001CanonicalProblemId = (typeof AVG_001_CP_IDS)[number];
export type Avg001Language = "en" | "hi" | "pa";
export type Avg001Difficulty = "Easy" | "Medium" | "Hard";
export type Avg001Maturity = "DESIGN_LOCKED" | "RUNTIME_PROOF" | "MVP_QA" | "PRODUCTION_QA" | "MANUAL_REVIEW" | "FROZEN";
export type Avg001AnswerType = "ABSOLUTE" | "COUNT" | "AVERAGE" | "DIFFERENCE" | "RATIO" | "MEMBER_VALUE";
export type Avg001DisplayPolicy = "EXACT_INTEGER" | "EXACT_DECIMAL_1" | "EXACT_DECIMAL_2" | "EXACT_FRACTION";
export type Avg001TaskKind =
  | "sumCountMappingApplication"
  | "symmetricApPropertiesApplication"
  | "incrementDecrementReplacementApplication"
  | "weightedCombinedAggregationApplication"
  | "errorDetectionDeltaCorrectionApplication"
  | "multiStageHierarchicalSystemsApplication";
export type Avg001SolveMode =
  | "findSumFromAverageAndCount" | "findAverageFromSumAndCount" | "findCountFromSumAndAverage" | "findMissingValueFromAverage"
  | "findAverageOfConsecutiveSet" | "findMiddleTermFromAverage" | "findExtremeFromAverageAndCount" | "findAverageOfOddOrEvenSet"
  | "findNewAverageAfterAddition" | "findNewAverageAfterRemoval" | "findNewAverageAfterReplacement" | "findAddedMemberValueFromShift" | "findRemovedMemberValueFromShift" | "findReplacementValueFromShift" | "findInningsValueOrNewCricketAverage"
  | "findCombinedAverageOfTwoGroups" | "findCombinedAverageOfThreeOrFourGroups" | "findGroupCountFromCombinedAverage" | "findMissingGroupAverage" | "findAverageSpeedEqualDistance" | "findAverageSpeedEqualTime"
  | "findCorrectedAverageFromMistake" | "findCorrectValueFromAverageShift" | "findIncorrectValueFromCorrection" | "findNumberOfItemsFromTotalCorrection"
  | "findClassAverageFromSectionAverages" | "findSuperGroupAverageFromSubgroups" | "findMissingSectionAverage" | "findSectionCountFromOverallAverage";

export interface Rational { numerator: number; denominator: number }
export interface Avg001QuestionLanguageEntry {
  cpId: Avg001CanonicalProblemId; qlId: string; taskKind: Avg001TaskKind; solveMode: Avg001SolveMode;
  difficulty: Avg001Difficulty; answerType: Avg001AnswerType; contextDomain: string; scenarioVariant: string;
  template: string; requiredVariables: string[]; explanationStrategyId: string; distractorStrategyIds: string[];
  displayPolicy: Avg001DisplayPolicy; active: boolean; finalContext: string; unitKind?: string;
}
export interface Avg001Parameters {
  packageId: typeof AVG_001_PACKAGE_ID; canonicalProblemId: Avg001CanonicalProblemId; questionLanguageId: string;
  seed: string; language: Avg001Language; difficulty: Avg001Difficulty; taskKind: Avg001TaskKind; solveMode: Avg001SolveMode;
  answerType: Avg001AnswerType; displayPolicy: Avg001DisplayPolicy; contextDomain: string; scenarioVariant: string;
  values: {
    count: number; average: Rational; total: Rational;
    knownCount?: number; knownTotal?: Rational; missingValue?: Rational;
    firstTerm?: Rational; lastTerm?: Rational; middleTerm?: Rational;
    lowerMiddleTerm?: Rational; upperMiddleTerm?: Rational;
    commonDifference?: Rational; targetExtreme?: "smallest" | "largest";
    sequenceParity?: "odd" | "even" | "any";
    oldCount?: number; newCount?: number;
    oldAverage?: Rational; currentAverage?: Rational; newAverage?: Rational;
    oldTotal?: Rational; currentTotal?: Rational; newTotal?: Rational;
    addedValue?: Rational; removedValue?: Rational;
    outgoingValue?: Rational; incomingValue?: Rational;
    oldValue?: Rational; newValue?: Rational;
    replacementTarget?: "old" | "new";
    elapsedYears?: number; yearsElapsed?: number; inningsCount?: number;
    nextScore?: Rational;
    targetKind?: "newAverage" | "memberValue";
    groupCounts?: number[];
    groupAverages?: Rational[];
    groupTotals?: Rational[];
    combinedCount?: number;
    combinedAverage?: Rational;
    combinedTotal?: Rational;
    knownGroupCount?: number;
    knownGroupAverage?: Rational;
    unknownGroupCount?: number;
    unknownGroupAverage?: Rational;
    speed1?: Rational;
    speed2?: Rational;
  };
  renderVariables: Record<string, string | number>;
}
export interface Avg001SolverResult { exactAnswer: Rational; answer: string; equation: string; workingValues: Record<string, string | number> }
export interface Avg001IndependentVerification { supported: boolean; exactAnswer: Rational; displayAnswer: string; method: string }
export interface Avg001ReasoningEvidence { conceptId: string; givens: Record<string,string|number>; equations: string[]; intermediateValues: Record<string,string|number>; decisiveCalculation: string; verification: string; finalContext: string }
export interface Avg001Explanation { lines: string[] }
export interface Avg001ValidationCheck { name: string; passed: boolean; message: string }
export interface Avg001ValidationResult { valid: boolean; checks: Avg001ValidationCheck[] }
export interface Avg001QuestionPackage {
  packageId: typeof AVG_001_PACKAGE_ID; archetypeId: typeof AVG_001_PACKAGE_ID; canonicalProblemId: Avg001CanonicalProblemId;
  questionLanguageId: string; questionId: string; seed: string; language: Avg001Language; difficultyBand: Avg001Difficulty;
  taskKind: Avg001TaskKind; solveMode: Avg001SolveMode; stem: string; options: string[]; correctIndex: number; answer: string;
  parameters: Avg001Parameters; solver: Avg001SolverResult; independentVerification: Avg001IndependentVerification;
  reasoningEvidence: Avg001ReasoningEvidence; explanation: Avg001Explanation; validation: Avg001ValidationResult;
  maturity: Avg001Maturity; publiclyPublishable: boolean; mathematicalFingerprint: string;
  traceability: Record<string, unknown>;
}
