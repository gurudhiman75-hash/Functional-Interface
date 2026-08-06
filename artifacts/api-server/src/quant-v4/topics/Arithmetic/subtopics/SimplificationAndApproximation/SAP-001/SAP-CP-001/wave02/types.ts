import type { ExpressionNode } from "../../../shared/expression-ast";
import type { EvaluationTraceStep } from "../../../shared/exact-evaluator";

export const SAP_001_PACKAGE_ID = "SAP-001" as const;
export const SAP_CP_001_ID = "SAP-CP-001" as const;

export const SAP_CP001_WAVE02_PROTOTYPE_IDS = [
  "SAP-CP001-PROT-COMPARE-DIFFERENT-GROUPINGS",
  "SAP-CP001-PROT-SELECT-EQUIVALENT-GROUPING",
  "SAP-CP001-PROT-IDENTIFY-FIRST-VALID-STEP",
  "SAP-CP001-PROT-IDENTIFY-INCORRECT-PRECEDENCE-STEP",
  "SAP-CP001-PROT-PARTIAL-SUBEXPRESSION-VALUE",
] as const;

export type SapCp001Wave02PrototypeId = (typeof SAP_CP001_WAVE02_PROTOTYPE_IDS)[number];
export type SapDifficulty = "EASY" | "MEDIUM" | "HARD";
export type SapTaskDirection = "COMPARISON" | "SELECTION" | "DIAGNOSIS" | "PARTIAL_EVALUATION";
export type SapAnswerSemantic = "COMPARISON_CLASS" | "EXPRESSION_SELECTION" | "STEP_SELECTION" | "EXACT_VALUE";

export type SapCp001Wave02MisconceptionId =
  | "ASSUMED_GROUPING_NEVER_CHANGES_VALUE"
  | "IGNORED_LEFT_TO_RIGHT_ASSOCIATIVITY"
  | "GROUPED_RIGHT_OPERANDS"
  | "GROUPED_ADDITION_BEFORE_MULTIPLICATION"
  | "APPLIED_LOWER_PRIORITY_OPERATION_FIRST"
  | "DIVIDED_BEFORE_POWER"
  | "DIVIDED_BEFORE_FACTORIAL"
  | "IGNORED_EXPLICIT_GROUPING"
  | "DROPPED_VISIBLE_TERM"
  | "REVERSED_SUBTRACTION_SIGN"
  | "MULTIPLIED_INSTEAD_OF_DIVIDING"
  | "FINAL_ARITHMETIC_PLUS_ONE"
  | "FINAL_ARITHMETIC_MINUS_ONE"
  | "CANNOT_DETERMINE_WITH_VISIBLE_VALUES";

export interface SapCp001Wave02Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: SapCp001Wave02MisconceptionId | null;
  readonly analysis: string;
}

export interface SapCp001Wave02Explanation {
  readonly coreConcept: string;
  readonly givenDataAndStrategy: string;
  readonly stepByStep: readonly string[];
  readonly examSpeedMethod: string;
  readonly commonTraps: readonly string[];
  readonly finalAnswer: string;
}

export interface SapCp001Lifecycle {
  readonly permanentQlId: null;
  readonly maturity: "EXECUTABLE_DISCOVERY_PROOF";
  readonly reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE";
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

export type SapCp001Wave02QuestionState =
  | {
      readonly kind: "COMPARISON";
      readonly leftExpression: ExpressionNode;
      readonly rightExpression: ExpressionNode;
    }
  | {
      readonly kind: "EQUIVALENT_GROUPING";
      readonly sourceExpression: ExpressionNode;
      readonly candidateExpressions: readonly ExpressionNode[];
    }
  | {
      readonly kind: "FIRST_VALID_STEP";
      readonly sourceExpression: ExpressionNode;
      readonly candidateAfterExpressions: readonly ExpressionNode[];
    }
  | {
      readonly kind: "INCORRECT_CHAIN";
      readonly sourceExpression: ExpressionNode;
      readonly chainExpressions: readonly ExpressionNode[];
    }
  | {
      readonly kind: "PARTIAL_EVALUATION";
      readonly sourceExpression: ExpressionNode;
      readonly declaredSubexpression: ExpressionNode;
      readonly substitutedExpression: ExpressionNode;
    };

export interface SapCp001Wave02Package {
  readonly packageId: typeof SAP_001_PACKAGE_ID;
  readonly checkpointId: typeof SAP_CP_001_ID;
  readonly temporaryPrototypeId: SapCp001Wave02PrototypeId;
  readonly permanentQlId: null;
  readonly locale: "en-IN";
  readonly seed: number;
  readonly difficulty: SapDifficulty;
  readonly difficultyEvidence: readonly string[];
  readonly taskDirection: SapTaskDirection;
  readonly answerSemantic: SapAnswerSemantic;
  readonly stem: string;
  readonly questionState: SapCp001Wave02QuestionState;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly canonicalTrace: readonly EvaluationTraceStep[];
  readonly options: readonly SapCp001Wave02Option[];
  readonly correctIndex: number;
  readonly explanation: SapCp001Wave02Explanation;
  readonly hiddenState: Readonly<Record<string, string | number | boolean>>;
  readonly mathematicalFingerprint: string;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly validation: {
    readonly ok: boolean;
    readonly errors: readonly string[];
  };
  readonly lifecycle: SapCp001Lifecycle;
}
