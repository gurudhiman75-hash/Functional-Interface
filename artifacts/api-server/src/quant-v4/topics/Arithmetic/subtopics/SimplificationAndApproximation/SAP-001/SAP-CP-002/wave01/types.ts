import type { Rational } from "../../../shared/exact-rational";
import type { EvaluationTraceStep } from "../../../shared/exact-evaluator";
import type { SapFractionExpressionNode } from "./display-expression";

export const SAP_001_PACKAGE_ID = "SAP-001" as const;
export const SAP_CP_002_ID = "SAP-CP-002" as const;

export const SAP_CP002_WAVE01_PROTOTYPE_IDS = [
  "SAP-CP002-PROT-FRACTION-SUM-DIFFERENCE",
  "SAP-CP002-PROT-FRACTION-PRODUCT-CANCELLATION",
  "SAP-CP002-PROT-FRACTION-DIVISION-RECIPROCAL",
  "SAP-CP002-PROT-MIXED-FRACTION-OPERATION-CHAIN",
  "SAP-CP002-PROT-MIXED-NUMBERS-CONVERT-EVALUATE",
  "SAP-CP002-PROT-FRACTION-OF-FRACTION",
  "SAP-CP002-PROT-NESTED-COMPLEX-FRACTION",
  "SAP-CP002-PROT-SIGNED-FRACTION-BRACKETS",
] as const;

export type SapCp002Wave01PrototypeId = (typeof SAP_CP002_WAVE01_PROTOTYPE_IDS)[number];
export type SapCp002Difficulty = "EASY" | "MEDIUM" | "HARD";
export type SapCp002TaskDirection = "FORWARD";
export type SapCp002AnswerSemantic = "SIMPLIFIED_RATIONAL";

export type SapCp002MisconceptionId =
  | "ADDED_NUMERATORS_AND_DENOMINATORS"
  | "USED_PRODUCT_DENOMINATOR_WITHOUT_CROSS_SCALING"
  | "CROSS_MULTIPLIED_BUT_ADDED_DENOMINATORS"
  | "CANCELLED_ONLY_ONE_SIDE_OF_A_FACTOR"
  | "INVERTED_SECOND_FACTOR_IN_PRODUCT"
  | "ADDED_INSTEAD_OF_MULTIPLYING"
  | "MULTIPLIED_WITHOUT_RECIPROCAL"
  | "INVERTED_THE_DIVIDEND"
  | "REVERSED_THE_DIVISION"
  | "EVALUATED_STRICTLY_LEFT_TO_RIGHT"
  | "ADDED_BEFORE_MULTIPLYING"
  | "CHANGED_MULTIPLICATION_TO_DIVISION"
  | "CONVERTED_MIXED_NUMBER_AS_WHOLE_PLUS_NUMERATOR_OVER_DENOMINATOR"
  | "IGNORED_WHOLE_NUMBER_PART"
  | "COMBINED_WHOLE_AND_FRACTION_PARTS_INDEPENDENTLY"
  | "TREATED_OF_AS_ADDITION"
  | "APPLIED_OF_ONLY_TO_NEAREST_FRACTION"
  | "TREATED_OF_AS_DIVISION"
  | "COMPLEX_FRACTION_SCOPED_ONLY_ADJACENT_TERMS"
  | "MULTIPLIED_NUMERATOR_AND_DENOMINATOR_BLOCKS"
  | "INVERTED_COMPLEX_FRACTION"
  | "DROPPED_NEGATIVE_SIGN"
  | "REPLACED_NEGATIVE_BY_ABSOLUTE_VALUE"
  | "IGNORED_GROUPING_IN_SIGNED_EXPRESSION"
  | "FINAL_ARITHMETIC_PLUS_ONE"
  | "FINAL_ARITHMETIC_MINUS_ONE";

export interface SapCp002Wave01Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: SapCp002MisconceptionId | null;
  readonly analysis: string;
}

export interface SapCp002Wave01Explanation {
  readonly coreConcept: string;
  readonly givenDataAndStrategy: string;
  readonly stepByStep: readonly string[];
  readonly examSpeedMethod: string;
  readonly commonTraps: readonly string[];
  readonly finalAnswer: string;
}

export interface SapCp002Wave01Package {
  readonly packageId: "SAP-001";
  readonly checkpointId: "SAP-CP-002";
  readonly temporaryPrototypeId: SapCp002Wave01PrototypeId;
  readonly permanentQlId: null;
  readonly locale: "en-IN";
  readonly seed: number;
  readonly difficulty: SapCp002Difficulty;
  readonly difficultyEvidence: readonly string[];
  readonly taskDirection: SapCp002TaskDirection;
  readonly answerSemantic: SapCp002AnswerSemantic;
  readonly stem: string;
  readonly expression: SapFractionExpressionNode;
  readonly renderedExpression: string;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly canonicalTrace: readonly EvaluationTraceStep[];
  readonly independentTrace: readonly string[];
  readonly options: readonly SapCp002Wave01Option[];
  readonly correctIndex: number;
  readonly explanation: SapCp002Wave01Explanation;
  readonly hiddenState: Readonly<Record<string, string | number | boolean>>;
  readonly mathematicalFingerprint: string;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly validation: {
    readonly ok: boolean;
    readonly errors: readonly string[];
  };
  readonly lifecycle: {
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
  };
}

export interface SapCp002TrapCandidate {
  readonly value: Rational;
  readonly misconceptionId: SapCp002MisconceptionId;
  readonly analysis: string;
}
