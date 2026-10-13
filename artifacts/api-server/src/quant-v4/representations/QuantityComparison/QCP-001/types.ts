export type Qcp001Language = "en" | "hi" | "pa";

export type Qcp001ExamProfile = "BANKING_PRELIMS" | "BANKING_MAINS";
export type Qcp001SourceFamily =
  | "PERCENTAGE"
  | "RATIO"
  | "NUMBER_SYSTEM"
  | "ALGEBRA"
  | "PROFIT_LOSS"
  | "INTEREST"
  | "MIXTURE"
  | "COMPOUND_INTEREST"
  | "WORK"
  | "BOATS"
  | "TRAINS"
  | "AGES"
  | "PROBABILITY"
  | "MENSURATION"
  | "REPLACEMENT"
  | "PRICE_RECOVERY";

export type Qcp001RelationClass =
  | "QUANTITY_I_GREATER"
  | "QUANTITY_I_LESS"
  | "QUANTITY_I_GREATER_OR_EQUAL"
  | "QUANTITY_I_LESS_OR_EQUAL"
  | "EQUAL_OR_RELATION_CANNOT_BE_ESTABLISHED";

export type Qcp001AnswerEvidenceMode =
  | "STRICT_DETERMINATE"
  | "NON_STRICT_DETERMINATE"
  | "EXACT_EQUALITY"
  | "RELATION_CANNOT_BE_ESTABLISHED";

export type Qcp001PercentageState = Readonly<{
  kind: "PERCENTAGE";
  percentageRate: number;
  baseValue: number;
}>;

export type Qcp001RatioState = Readonly<{
  kind: "RATIO";
  ratioA: number;
  ratioB: number;
  valueA: number;
}>;

export type Qcp001NumberSystemState = Readonly<{
  kind: "NUMBER_SYSTEM";
  dividend: number;
  divisor: number;
}>;

export type Qcp001QuadraticState = Readonly<{
  kind: "ALGEBRA";
  a: number;
  b: number;
  c: number;
  rootIndex: 0 | 1;
  positiveOnly?: true;
}>;

export type Qcp001WordState =
  | Readonly<{
      kind: "PROFIT_LOSS";
      task: "SELLING_PRICE" | "COST_PRICE" | "PROFIT_AMOUNT";
      amount: number;
      rate: number;
      direction: "PROFIT" | "LOSS";
    }>
  | Readonly<{
      kind: "INTEREST";
      task: "INTEREST" | "AMOUNT" | "PRINCIPAL";
      amount: number;
      rate: number;
      years: number;
    }>
  | Readonly<{
      kind: "MIXTURE";
      task: "MEAN" | "UNKNOWN_PRICE";
      quantities: readonly number[];
      prices: readonly number[];
      mean: number;
    }>;

export type Qcp001AdditionalState =
  | Readonly<{
      kind: "COMPOUND_INTEREST";
      task: "AMOUNT" | "INTEREST" | "PRINCIPAL";
      amount: number;
      rate: number;
      years: number;
    }>
  | Readonly<{
      kind: "WORK";
      task: "COMBINED" | "MISSING";
      firstTime: number;
      secondTime: number;
      combinedNumerator: number;
      combinedDenominator: number;
    }>
  | Readonly<{
      kind: "BOATS";
      task: "UPSTREAM" | "DOWNSTREAM" | "ROUND_TRIP";
      bodySpeed: number;
      streamSpeed: number;
      distance: number;
    }>
  | Readonly<{
      kind: "TRAINS";
      task: "SAME" | "OPPOSITE";
      lengthA: number;
      lengthB: number;
      speedA: number;
      speedB: number;
    }>
  | Readonly<{
      kind: "AGES";
      task: "FUTURE" | "PAST";
      difference: number;
      shift: number;
    }>
  | Readonly<{
      kind: "PROBABILITY";
      task:
        | "SINGLE"
        | "WITH_REPLACEMENT"
        | "WITHOUT_REPLACEMENT"
        | "CONDITIONAL";
      red: number;
      blue: number;
    }>
  | Readonly<{
      kind: "MENSURATION";
      task: "TRIANGLE_AREA" | "TRIANGLE_HEIGHT";
      base: number;
      height: number;
      area: number;
    }>
  | Readonly<{
      kind: "REPLACEMENT";
      task: "REMOVE_REFILL";
      milk: number;
      water: number;
      removed: number;
      cycles: number;
    }>
  | Readonly<{
      kind: "PRICE_RECOVERY";
      task: "COST_PRICE";
      difference: number;
      firstRate: number;
      secondRate: number;
      firstDirection: "PROFIT" | "LOSS";
      secondDirection: "PROFIT" | "LOSS";
    }>;

export type Qcp001SourceState =
  | Qcp001PercentageState
  | Qcp001RatioState
  | Qcp001NumberSystemState
  | Qcp001QuadraticState
  | Qcp001WordState
  | Qcp001AdditionalState;

export interface Qcp001Operand {
  readonly label: "Quantity I" | "Quantity II";
  readonly sourceFamily: Qcp001SourceFamily;
  readonly sourcePackageId:
    | "PCT-001"
    | "RAP-001"
    | "NUM-001"
    | "ALG-002"
    | "PNL-001"
    | "INT-001"
    | "MAL-001"
    | "TMW-001"
    | "TSD-002"
    | "ALG-001"
    | "PRB-001"
    | "PRB-002"
    | "MEN-001";
  readonly sourceSolveMode:
    | "percentOf"
    | "scalingByComponent"
    | "positiveMod"
    | "solveQuadraticEquation"
    | "fundamentalMoney"
    | "simpleInterest"
    | "weightedBlend"
    | "annualCompound"
    | "combineWorkRates"
    | "mediumJourney"
    | "trainCrossing"
    | "ageShift"
    | "urnProbability"
    | "triangleMeasurement"
    | "removeRefill"
    | "twoSellingConditions";
  readonly prompt: string;
  readonly states: readonly Qcp001SourceState[];
  readonly values: readonly number[];
}

export interface Qcp001Option {
  readonly text: string;
  readonly relationClass: Qcp001RelationClass;
  readonly isCorrect: boolean;
}

export interface Qcp001DistractorAnalysis {
  readonly optionText: string;
  readonly relationClass: Qcp001RelationClass;
  readonly whyWrong: string;
}

export interface Qcp001ValidationCheck {
  readonly id: string;
  readonly passed: boolean;
  readonly message: string;
}

export interface Qcp001Question {
  readonly packageId: "QCP-001";
  readonly representation: "QUANTITY_COMPARISON";
  readonly questionId: string;
  readonly seed: string;
  readonly language: Qcp001Language;
  readonly examProfile: Qcp001ExamProfile;
  readonly optionCount: 5;
  readonly difficulty: "Medium" | "Hard";
  readonly direction: string;
  readonly stem: string;
  readonly quantityI: Qcp001Operand;
  readonly quantityII: Qcp001Operand;
  readonly options: readonly string[];
  readonly optionMetadata: readonly Qcp001Option[];
  readonly correctIndex: number;
  readonly answerClass: Qcp001RelationClass;
  readonly answer: string;
  readonly answerEvidenceMode: Qcp001AnswerEvidenceMode;
  readonly distractorAnalysis: readonly Qcp001DistractorAnalysis[];
  readonly explanation: Readonly<{
    keyIdea: string;
    steps: readonly string[];
    shortcut: string;
  }>;
  readonly traceability: Readonly<{
    representationOwner: "QCP-001";
    sourceTruthOwners: readonly (
      | "PCT-001"
      | "RAP-001"
      | "NUM-001"
      | "ALG-002"
      | "PNL-001"
      | "INT-001"
      | "MAL-001"
      | "TMW-001"
      | "TSD-002"
      | "ALG-001"
      | "PRB-001"
      | "PRB-002"
      | "MEN-001"
    )[];
    contractVersion:
      | "QCP-001-BANKING-RELATION-V2"
      | "QCP-001-BANKING-RELATION-V3"
      | "QCP-001-BANKING-RELATION-V4";
    reviewStatus: "UNREVIEWED";
    questionStudioDiscoverable: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
  readonly validation: Readonly<{
    valid: boolean;
    checks: readonly Qcp001ValidationCheck[];
  }>;
}
