export const SAP_CP003_PROTOTYPE_IDS = [
  "SAP-CP003-PROT-TERMINATING-DECIMAL-EXPRESSION",
  "SAP-CP003-PROT-DECIMAL-FRACTION-MIXED-EXPRESSION",
  "SAP-CP003-PROT-DECIMAL-PRODUCT-PLACE-VALUE",
  "SAP-CP003-PROT-DECIMAL-DIVISION-POWER-OF-TEN",
  "SAP-CP003-PROT-DECIMAL-DIVISION-COMPATIBLE-FACTOR",
  "SAP-CP003-PROT-PERCENTAGE-AS-NUMERIC-FACTOR",
  "SAP-CP003-PROT-PERCENT-OF-QUANTITY-IN-EXPRESSION",
  "SAP-CP003-PROT-MIXED-PERCENT-FRACTION-DECIMAL",
  "SAP-CP003-PROT-CONVERT-TERMS-TO-FRACTIONS",
  "SAP-CP003-PROT-CONVERT-TERMS-TO-DECIMALS",
  "SAP-CP003-PROT-KNOWN-FRACTION-DECIMAL-EQUIVALENCE",
  "SAP-CP003-PROT-RECURRING-DECIMAL-IN-EXPRESSION",
  "SAP-CP003-PROT-COMPLEMENTARY-PERCENTAGE-EXPRESSION",
  "SAP-CP003-PROT-SUCCESSIVE-PERCENT-FACTORS",
  "SAP-CP003-PROT-MISSING-DECIMAL-OPERAND",
  "SAP-CP003-PROT-MISSING-PERCENTAGE-LITERAL",
  "SAP-CP003-PROT-COMPARE-FRACTION-DECIMAL-PERCENT",
  "SAP-CP003-PROT-SELECT-CORRECT-DECIMAL-PLACEMENT",
  "SAP-CP003-PROT-IDENTIFY-INCORRECT-CONVERSION-STEP",
] as const;

export type SapCp003PrototypeId = (typeof SAP_CP003_PROTOTYPE_IDS)[number];

export const SAP_CP003_SOLVE_MODES = [
  "evaluateTerminatingDecimalExpression",
  "evaluateDecimalFractionMixedExpression",
  "evaluateDecimalProductByPlaceValue",
  "evaluateDecimalDivisionByPowerOfTen",
  "evaluateDecimalDivisionByCompatibleFactor",
  "evaluatePercentageAsNumericFactor",
  "evaluatePercentOfQuantityInsideExpression",
  "evaluateMixedPercentFractionDecimalExpression",
  "convertDisplayedTermsToFractionsThenEvaluate",
  "convertDisplayedTermsToDecimalsThenEvaluate",
  "useKnownFractionDecimalEquivalence",
  "evaluateRecurringDecimalInsideExpression",
  "evaluateComplementaryPercentageExpression",
  "evaluateSuccessivePercentFactorsAsPureArithmetic",
  "findMissingDecimalOperandInFixedExpression",
  "findMissingPercentageLiteralInFixedArithmeticExpression",
  "compareEquivalentFractionDecimalPercentResults",
  "selectCorrectDecimalPlacement",
  "identifyIncorrectRepresentationConversionStep",
] as const;

export type SapCp003SolveMode = (typeof SAP_CP003_SOLVE_MODES)[number];
export type SapCp003TaskDirection = "FORWARD" | "INVERSE" | "COMPARISON" | "SELECTION" | "DIAGNOSIS";
export type SapCp003Difficulty = "EASY" | "MEDIUM" | "HARD";
export type SapCp003AnswerSemantic =
  | "TERMINATING_DECIMAL"
  | "SIMPLIFIED_RATIONAL"
  | "INTEGER"
  | "PERCENTAGE_LITERAL"
  | "MISSING_DECIMAL"
  | "MISSING_PERCENTAGE"
  | "COMPARISON_CLASS"
  | "OPTION_VALUE"
  | "STEP_SELECTION";

export interface SapCp003PrototypeAuthority {
  readonly prototypeId: SapCp003PrototypeId;
  readonly solveMode: SapCp003SolveMode;
  readonly title: string;
  readonly solveAuthority: string;
  readonly taskDirection: SapCp003TaskDirection;
  readonly answerSemantic: SapCp003AnswerSemantic;
  readonly representations: readonly string[];
  readonly sourceStatus: "SCOPE_AUTHORITY_APPROVED_EXECUTABLE_DISCOVERY";
}

export interface SapCp003Option {
  readonly displayIndex: number;
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string | null;
  readonly analysis: string;
}

export interface SapCp003Explanation {
  readonly coreConcept: string;
  readonly steps: readonly string[];
  readonly finalAnswer: string;
}

export interface SapCp003Validation {
  readonly ok: boolean;
  readonly errors: readonly string[];
  readonly exactAgreementPassed: boolean;
  readonly optionUniquenessPassed: boolean;
  readonly singleCorrectOptionPassed: boolean;
  readonly answerBindingPassed: boolean;
  readonly surfaceSyntaxPassed: boolean;
  readonly explanationCompletenessPassed: boolean;
  readonly lifecyclePassed: boolean;
}

export interface SapCp003Package {
  readonly packageId: "SAP-001";
  readonly checkpointId: "SAP-CP-003";
  readonly prototypeId: SapCp003PrototypeId;
  readonly solveMode: SapCp003SolveMode;
  readonly seed: number;
  readonly taskDirection: SapCp003TaskDirection;
  readonly answerSemantic: SapCp003AnswerSemantic;
  readonly difficulty: SapCp003Difficulty;
  readonly difficultyScore: number;
  readonly stem: string;
  readonly options: readonly SapCp003Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly explanation: SapCp003Explanation;
  readonly canonicalPayloadKey: string;
  readonly generationIdentity: string;
  readonly validation: SapCp003Validation;
  readonly lifecycle: {
    readonly status: "EXECUTABLE_DISCOVERY_HUMAN_REVIEW_PENDING";
    readonly permanentQlId: null;
    readonly active: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

export interface SapCp003ReviewRecord {
  readonly questionId: string;
  readonly prototypeId: SapCp003PrototypeId;
  readonly solveMode: SapCp003SolveMode;
  readonly difficulty: SapCp003Difficulty;
  readonly stem: string;
  readonly options: readonly SapCp003Option[];
  readonly correctIndex: number;
  readonly correctAnswer: string;
  readonly canonicalPayloadKey: string;
  readonly generationIdentity: string;
}
