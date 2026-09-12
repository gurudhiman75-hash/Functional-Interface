export type Qcp001ExamProfile = "BANKING_PRELIMS" | "BANKING_MAINS";
export type Qcp001SourceFamily = "PERCENTAGE" | "RATIO" | "NUMBER_SYSTEM";

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

export type Qcp001SourceState =
  | Qcp001PercentageState
  | Qcp001RatioState
  | Qcp001NumberSystemState;

export interface Qcp001Operand {
  readonly label: "Quantity I" | "Quantity II";
  readonly sourceFamily: Qcp001SourceFamily;
  readonly sourcePackageId: "PCT-001" | "RAP-001" | "NUM-001";
  readonly sourceSolveMode: "percentOf" | "scalingByComponent" | "positiveMod";
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
  readonly language: "en";
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
  readonly explanation: Readonly<{
    keyIdea: string;
    steps: readonly string[];
    shortcut: string;
    distractorAnalysis: readonly Qcp001DistractorAnalysis[];
  }>;
  readonly traceability: Readonly<{
    representationOwner: "QCP-001";
    sourceTruthOwners: readonly ["PCT-001", "RAP-001", "NUM-001"];
    contractVersion: "QCP-001-BANKING-RELATION-V1";
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
