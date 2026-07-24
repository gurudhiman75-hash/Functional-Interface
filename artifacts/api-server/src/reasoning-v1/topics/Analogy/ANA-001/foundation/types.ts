export type AnalogyDirection = "FORWARD" | "REVERSE";
export type AnalogyLocaleMode = "TRANSLATABLE" | "LANGUAGE_ADAPTED" | "LANGUAGE_SPECIFIC";
export type AnalogyRenderer = "TEXT" | "STRUCTURED_TEXT" | "TABLE_OR_GRID";
export type NumberTreatment = "WHOLE_NUMBER" | "DIGIT_BASED";

export type AnalogyAnswer = string | number | readonly string[] | readonly number[];

export interface AnalogyRelation<P extends Record<string, unknown> = Record<string, unknown>> {
  family: string;
  ruleId: string;
  direction: AnalogyDirection;
  inputType: "WORD" | "NUMBER" | "LETTER" | "LETTER_CLUSTER" | "NUMBER_SET";
  arity: 1 | 2 | 3;
  parameters: P;
  numberTreatment?: NumberTreatment;
}

export interface ExplanationStep {
  label: string;
  expression: string;
  result: string;
}

export interface ExplanationTrace {
  ruleStatement: string;
  sourceDemonstration: readonly ExplanationStep[];
  targetApplication: readonly ExplanationStep[];
  conclusion: string;
  closestTrapRejection?: string;
}

export interface AnalogyOption<T extends AnalogyAnswer = AnalogyAnswer> {
  value: T;
  errorLabel: string | null;
}

export interface GeneratedAnalogy<T extends AnalogyAnswer = AnalogyAnswer> {
  sourceA: T;
  sourceB: T;
  targetA: T;
  targetB: T;
  relation: AnalogyRelation;
  options: readonly AnalogyOption<T>[];
  correctIndex: number;
  explanationTrace: ExplanationTrace;
}

export interface AnalogyRule<I = unknown, O = unknown, P extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  family: string;
  apply(input: I, parameters: P): O;
  explain(input: I, output: O, parameters: P): readonly ExplanationStep[];
  validateDomain(input: I, parameters: P): boolean;
}

export interface SemanticFact {
  id: string;
  left: string;
  right: string;
  relation: string;
  direction: AnalogyDirection;
  explanation: string;
  locale: "en-IN" | "hi-IN" | "pa-IN";
  examSuitability: readonly ("SSC" | "BANKING" | "PUNJAB")[];
  version: string;
  status: "CURATED" | "REVIEW" | "RETIRED";
}

export interface OptionValidationResult {
  valid: boolean;
  satisfyingOptionIndexes: readonly number[];
  errors: readonly string[];
}
