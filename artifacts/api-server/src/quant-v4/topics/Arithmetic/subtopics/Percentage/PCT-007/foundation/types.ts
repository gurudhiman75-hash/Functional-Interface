export const PCT_007_ARCHETYPE_ID = "PCT-007" as const;

export const PCT_007_CP_IDS = [
  "PCT-CP-001",
  "PCT-CP-002",
  "PCT-CP-003",
  "PCT-CP-004",
  "PCT-CP-005",
  "PCT-CP-006",
  "PCT-CP-007",
  "PCT-CP-008",
  "PCT-CP-009",
  "PCT-CP-010",
] as const;

export const PCT_007_LANGUAGES = ["en", "hi", "pa"] as const;

export type Pct007CanonicalProblemId = (typeof PCT_007_CP_IDS)[number];
export type Pct007Language = (typeof PCT_007_LANGUAGES)[number];
export type Pct007DifficultyBand = "Easy" | "Medium" | "Hard";
export type Pct007ComparisonDirection = "greater" | "less" | "equal";

export type Pct007TaskKind =
  | "incomeExpenditureSavingsApplication"
  | "marksPassFailApplication"
  | "electionVotesApplication"
  | "populationProductionConsumptionApplication"
  | "mixtureConcentrationBasicApplication"
  | "evaporationDryingCompositionApplication"
  | "taxDiscountCommissionChargesApplication"
  | "errorMiscalculationPercentageErrorApplication"
  | "replacementRepeatedPercentageApplication"
  | "miniDiMixedPercentageCaselet";

export type Pct007AnswerType =
  | "ABSOLUTE"
  | "PERCENT"
  | "AMOUNT"
  | "COUNT"
  | "COMPARISON"
  | "DIFFERENCE"
  | "WEIGHT"
  | "VOLUME"
  | "BILL_VALUE";

export type Pct007SolveMode =
  | "findSavingsFromSpendRate"
  | "findExpenditureFromSavingsRate"
  | "findIncomeFromSavingsAmount"
  | "findIncomeFromExpenditureAmount"
  | "findExpenditureFromSavingsAmount"
  | "findMarksFromTotalMarks"
  | "findTotalFromMarksPercent"
  | "findPassMarksFromTotalMarks"
  | "findTotalFromFailMargin"
  | "findTotalFromPassMargin"
  | "findVotesPolledFromTurnout"
  | "findValidVotesFromInvalidRate"
  | "findCandidateVotesFromValidVotes"
  | "findWinningMarginFromVoteShare"
  | "findTotalVotersFromVotesPolled"
  | "findRevisedValueAfterIncrease"
  | "findOriginalValueBeforeIncrease"
  | "findRevisedValueAfterDecrease"
  | "findUsedQuantityFromPercent"
  | "findRemainingQuantityFromPercent"
  | "findComponentFromTotalAndRate"
  | "findOtherComponentFromTotalAndRate"
  | "findTotalFromComponentAndRate"
  | "findRateFromComponentAndTotal"
  | "findTotalFromOtherComponentAndRate"
  | "findFinalDryWeight"
  | "findWaterLostAfterDrying"
  | "findFinalVolumeAfterEvaporation"
  | "findEvaporatedAmount"
  | "findInitialWeightFromFinalDryWeight"
  | "findDiscountAmount"
  | "findBillAfterDiscount"
  | "findTaxOrChargeAmount"
  | "findFinalBillAfterDiscountAndTax"
  | "findCommissionAmount"
  | "findPercentageErrorFromWrongAndCorrect"
  | "findCorrectValueFromOverstatement"
  | "findCorrectValueFromUnderstatement"
  | "findPercentageErrorOnBill"
  | "findActualValueFromMeasuredError"
  | "findRemainingAfterOneRemoval"
  | "findRemainingAfterTwoSameRemovals"
  | "findRemainingAfterThreeSameRemovals"
  | "findRemainingAfterTwoDifferentRemovals"
  | "findTotalRemovedAfterTwoDifferentRemovals"
  | "findCaseletSavings"
  | "findCaseletCandidateVotes"
  | "findCaseletFinalBill"
  | "findCaseletRemainingGoodUnits"
  | "findCaseletComparison";

export interface Pct007TaskRegistryEntry {
  cpId: Pct007CanonicalProblemId;
  taskKind: Pct007TaskKind;
  solveMode: Pct007SolveMode;
  answerType: Pct007AnswerType;
  requiredVariables: string[];
  scenarioFamily: string;
  contextTag: string;
}

export interface Pct007TaskRegistryLibrary {
  archetypeId: typeof PCT_007_ARCHETYPE_ID;
  ownership: "HUMAN_OWNED";
  authority: string;
  usage: "Runtime Consumption Only";
  entries: Record<string, Pct007TaskRegistryEntry>;
}

export interface Pct007QuestionLanguageEntry {
  template: string;
  difficulty: Pct007DifficultyBand;
}

export interface Pct007QuestionLanguageLibrary {
  [cpId: string]: {
    families: Record<string, Pct007QuestionLanguageEntry>;
  };
}

export interface Pct007ExplanationEntry {
  explanationId: string;
}

export interface Pct007ExplanationLibrary {
  [cpId: string]: Pct007ExplanationEntry;
}

export type Pct007Variables = Record<string, number | string>;

export interface Pct007Parameters {
  archetypeId: typeof PCT_007_ARCHETYPE_ID;
  canonicalProblemId: Pct007CanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  explanationId: string;
  language: Pct007Language;
  difficultyBand: Pct007DifficultyBand;
  taskKind: Pct007TaskKind;
  solveMode: Pct007SolveMode;
  answerType: Pct007AnswerType;
  requiredVariables: string[];
  variables: Pct007Variables;
  sourceTrace: {
    questionLanguageSource: string;
    explanationSource: string;
    variableRangeSource: string;
  };
}

export interface Pct007SolverResult {
  answer: string;
  numericAnswer: number | null;
  answerType: Pct007AnswerType;
  evidence: Record<string, string | number>;
  mathJax: Record<string, string>;
}

export interface Pct007ReasoningNode {
  id: string;
  label: string;
  value: string | number | Record<string, string | number>;
}

export interface Pct007ReasoningGraph {
  graphId: string;
  nodes: Pct007ReasoningNode[];
}

export interface Pct007Explanation {
  explanationId: string;
  lines: string[];
}

export interface Pct007ValidationResult {
  valid: boolean;
  checks: { name: string; passed: boolean; message: string }[];
}

export interface Pct007QuestionPackage {
  archetypeId: typeof PCT_007_ARCHETYPE_ID;
  canonicalProblemId: Pct007CanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  explanationId: string;
  language: Pct007Language;
  difficultyBand: Pct007DifficultyBand;
  stem: string;
  answer: string;
  parameters: Pct007Parameters;
  solver: Pct007SolverResult;
  reasoningGraph: Pct007ReasoningGraph;
  explanation: Pct007Explanation;
  traceability: Record<string, unknown>;
  validation: Pct007ValidationResult;
  mathJax: Record<string, string>;
}

export interface Pct007CoverageAudit {
  questionCount: number;
  generationFailures: number;
  validationFailures: number;
  renderFailures: number;
  solverFailures: number;
  duplicateRate: number;
  cpCoverage: Record<string, number>;
  qlCoverage: Record<string, number>;
  esCoverage: Record<string, number>;
  difficultyCoverage: Record<string, number>;
  unusedQlIds: string[];
  unusedEsIds: string[];
  crossLanguageConsistencyFailures: number;
  libraryValidationFailures: string[];
}
