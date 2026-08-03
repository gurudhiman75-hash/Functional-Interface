import type { ExpressionNode } from "../../../shared/expression-ast";
import type { EvaluationTraceStep } from "../../../shared/exact-evaluator";

export const SAP_001_PACKAGE_ID = "SAP-001" as const;
export const SAP_CP_001_ID = "SAP-CP-001" as const;

export const SAP_CP001_WAVE01_PROTOTYPE_IDS = [
  "SAP-CP001-PROT-FLAT-MIXED-OPERATIONS",
  "SAP-CP001-PROT-MULTIPLY-DIVIDE-LEFT-TO-RIGHT",
  "SAP-CP001-PROT-ADD-SUBTRACT-LEFT-TO-RIGHT",
  "SAP-CP001-PROT-NESTED-GROUPING",
  "SAP-CP001-PROT-SIGNED-ARITHMETIC",
  "SAP-CP001-PROT-SCOPED-OF-MULTIPLICATION",
  "SAP-CP001-PROT-POWER-BEFORE-ARITHMETIC",
  "SAP-CP001-PROT-FACTORIAL-BEFORE-ARITHMETIC",
] as const;

export type SapCp001Wave01PrototypeId = (typeof SAP_CP001_WAVE01_PROTOTYPE_IDS)[number];
export type SapDifficulty = "EASY" | "MEDIUM" | "HARD";
export type SapTaskDirection = "FORWARD";
export type SapAnswerSemantic = "EXACT_VALUE";

export type SapCp001MisconceptionId =
  | "EVALUATED_STRICTLY_LEFT_TO_RIGHT"
  | "MULTIPLIED_DIVISOR_BEFORE_DIVIDING"
  | "ADDED_BEFORE_SUBTRACTING"
  | "IGNORED_EXPLICIT_GROUPING"
  | "DROPPED_UNARY_NEGATIVE"
  | "APPLIED_OF_TO_INCOMPLETE_SCOPE"
  | "ADDED_BEFORE_APPLYING_POWER"
  | "TREATED_FACTORIAL_AS_ORDINARY_MULTIPLICATION"
  | "FINAL_ARITHMETIC_PLUS_ONE"
  | "FINAL_ARITHMETIC_MINUS_ONE"
  | "SIGN_SLIP";

export interface SapCp001Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: SapCp001MisconceptionId | null;
  readonly analysis: string;
}

export interface SapCp001Explanation {
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

export interface SapCp001Wave01Package {
  readonly packageId: typeof SAP_001_PACKAGE_ID;
  readonly checkpointId: typeof SAP_CP_001_ID;
  readonly temporaryPrototypeId: SapCp001Wave01PrototypeId;
  readonly permanentQlId: null;
  readonly locale: "en-IN";
  readonly seed: number;
  readonly difficulty: SapDifficulty;
  readonly difficultyEvidence: readonly string[];
  readonly taskDirection: SapTaskDirection;
  readonly answerSemantic: SapAnswerSemantic;
  readonly stem: string;
  readonly expression: ExpressionNode;
  readonly renderedExpression: string;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly canonicalTrace: readonly EvaluationTraceStep[];
  readonly options: readonly SapCp001Option[];
  readonly correctIndex: number;
  readonly explanation: SapCp001Explanation;
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
