import type { ExpressionNode } from "../../../shared/expression-ast";
import type { EvaluationTraceStep } from "../../../shared/exact-evaluator";

export const SAP_001_PACKAGE_ID = "SAP-001" as const;
export const SAP_CP_001_ID = "SAP-CP-001" as const;

export const SAP_CP001_WAVE03_PROTOTYPE_IDS = [
  "SAP-CP001-PROT-VINCULUM-FRACTION-BAR-SCOPE",
  "SAP-CP001-PROT-UNAMBIGUOUS-IMPLICIT-MULTIPLICATION",
  "SAP-CP001-PROT-REPEATED-GROUPING",
  "SAP-CP001-PROT-NEGATIVE-INTERMEDIATE",
] as const;

export type SapCp001Wave03PrototypeId = (typeof SAP_CP001_WAVE03_PROTOTYPE_IDS)[number];
export type SapDifficulty = "EASY" | "MEDIUM" | "HARD";
export type SapTaskDirection = "FORWARD";
export type SapAnswerSemantic = "EXACT_VALUE";
export type SapRepresentationKind =
  | "FRACTION_BAR"
  | "IMPLICIT_MULTIPLICATION"
  | "REPEATED_GROUPING"
  | "NEGATIVE_INTERMEDIATE";

export type SapCp001Wave03MisconceptionId =
  | "FRACTION_BAR_SCOPED_ONLY_ADJACENT_TERMS"
  | "DENOMINATOR_GROUPING_DROPPED"
  | "NUMERATOR_GROUPING_DROPPED"
  | "IMPLICIT_PRODUCT_GROUPING_DROPPED"
  | "IMPLICIT_PRODUCT_READ_AS_ADDITION"
  | "COEFFICIENT_APPLIED_TO_PARTIAL_GROUP"
  | "INNER_GROUPING_IGNORED"
  | "BRACKET_SHAPE_TREATED_AS_PRECEDENCE"
  | "REDUNDANT_GROUP_CHANGED_VALUE"
  | "NEGATIVE_INTERMEDIATE_REPLACED_BY_ABSOLUTE_VALUE"
  | "NEGATIVE_SIGN_DROPPED_AFTER_GROUPING"
  | "FINAL_SIGN_REVERSED"
  | "FINAL_ARITHMETIC_PLUS_ONE"
  | "FINAL_ARITHMETIC_MINUS_ONE";

export interface SapCp001Wave03Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: SapCp001Wave03MisconceptionId | null;
  readonly analysis: string;
}

export interface SapCp001Wave03Explanation {
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

export interface SapCp001Wave03Package {
  readonly packageId: typeof SAP_001_PACKAGE_ID;
  readonly checkpointId: typeof SAP_CP_001_ID;
  readonly temporaryPrototypeId: SapCp001Wave03PrototypeId;
  readonly permanentQlId: null;
  readonly locale: "en-IN";
  readonly seed: number;
  readonly difficulty: SapDifficulty;
  readonly difficultyEvidence: readonly string[];
  readonly taskDirection: SapTaskDirection;
  readonly answerSemantic: SapAnswerSemantic;
  readonly representationKind: SapRepresentationKind;
  readonly stem: string;
  readonly expression: ExpressionNode;
  readonly renderedExpression: string;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly canonicalTrace: readonly EvaluationTraceStep[];
  readonly options: readonly SapCp001Wave03Option[];
  readonly correctIndex: number;
  readonly explanation: SapCp001Wave03Explanation;
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
