import type { Rational } from "../../../shared/exact-rational";
import type { SapFractionExpressionNode } from "../wave01/display-expression";

export const SAP_CP002_COMPLETION_PROTOTYPE_IDS = [
  "SAP-CP002-PROT-FRACTION-EXPRESSION-INTEGER-PART",
  "SAP-CP002-PROT-PRODUCT-SUM-DIFFERENCE",
  "SAP-CP002-PROT-RECIPROCAL-EXPRESSION",
  "SAP-CP002-PROT-FRACTION-COMPLEMENT",
  "SAP-CP002-PROT-BOUNDED-CONTINUED-FRACTION",
  "SAP-CP002-PROT-MISSING-NUMERATOR",
  "SAP-CP002-PROT-MISSING-DENOMINATOR",
  "SAP-CP002-PROT-MISSING-FRACTION-OPERAND",
  "SAP-CP002-PROT-COMPARE-EVALUATED-FRACTIONS",
  "SAP-CP002-PROT-SELECT-EQUIVALENT-REDUCED-FRACTION",
  "SAP-CP002-PROT-IDENTIFY-INCORRECT-FRACTION-STEP",
] as const;

export type SapCp002CompletionPrototypeId = (typeof SAP_CP002_COMPLETION_PROTOTYPE_IDS)[number];
export type SapCp002AllDifficulty = "EASY" | "MEDIUM" | "HARD";
export type SapCp002CompletionDirection = "FORWARD" | "INVERSE" | "COMPARISON" | "SELECTION" | "DIAGNOSIS";
export type SapCp002CompletionAnswerSemantic =
  | "SIMPLIFIED_RATIONAL"
  | "MISSING_INTEGER"
  | "MISSING_RATIONAL"
  | "COMPARISON_CLASS"
  | "EXPRESSION_SELECTION"
  | "STEP_SELECTION";

export interface SapCp002CompletionOption {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string | null;
  readonly analysis: string;
}

export interface SapCp002CompletionExplanation {
  readonly coreConcept: string;
  readonly givenDataAndStrategy: string;
  readonly stepByStep: readonly string[];
  readonly examSpeedMethod: string;
  readonly commonTraps: readonly string[];
  readonly finalAnswer: string;
}

export interface SapCp002CompletionPackage {
  readonly packageId: "SAP-001";
  readonly checkpointId: "SAP-CP-002";
  readonly temporaryPrototypeId: SapCp002CompletionPrototypeId;
  readonly permanentQlId: null;
  readonly locale: "en-IN";
  readonly seed: number;
  readonly difficulty: SapCp002AllDifficulty;
  readonly difficultyEvidence: readonly string[];
  readonly taskDirection: SapCp002CompletionDirection;
  readonly answerSemantic: SapCp002CompletionAnswerSemantic;
  readonly stem: string;
  readonly expression: SapFractionExpressionNode | null;
  readonly renderedExpression: string;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly canonicalValue: Rational | null;
  readonly independentTrace: readonly string[];
  readonly options: readonly SapCp002CompletionOption[];
  readonly correctIndex: number;
  readonly explanation: SapCp002CompletionExplanation;
  readonly hiddenState: Readonly<Record<string, string | number | boolean>>;
  readonly mathematicalFingerprint: string;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly validation: { readonly ok: boolean; readonly errors: readonly string[] };
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
