export type OpsLocale = "en-IN" | "hi-IN" | "pa-IN";
export type OpsLocaleMode = "TRANSLATABLE" | "LANGUAGE_ADAPTED" | "LANGUAGE_SPECIFIC";

export type ArithmeticOperator = "ADD" | "SUBTRACT" | "MULTIPLY" | "DIVIDE";
export type RelationOperator = "EQUAL" | "LESS_THAN" | "GREATER_THAN";
export type SemanticOperator = ArithmeticOperator | RelationOperator;

export interface ExactRational {
  numerator: bigint;
  denominator: bigint;
}

export interface NumberToken {
  kind: "NUMBER";
  source: string;
  value: ExactRational;
}

export interface SymbolToken {
  kind: "SYMBOL";
  lexeme: string;
}

export interface LeftParenToken {
  kind: "LPAREN";
}

export interface RightParenToken {
  kind: "RPAREN";
}

export type DisplayToken = NumberToken | SymbolToken | LeftParenToken | RightParenToken;

export interface ArithmeticSemanticToken {
  kind: "ARITHMETIC";
  operator: ArithmeticOperator;
  sourceLexeme: string;
}

export interface RelationSemanticToken {
  kind: "RELATION";
  operator: RelationOperator;
  sourceLexeme: string;
}

export type SemanticToken =
  | NumberToken
  | ArithmeticSemanticToken
  | RelationSemanticToken
  | LeftParenToken
  | RightParenToken;

export interface ValueAst {
  kind: "VALUE";
  value: ExactRational;
  source: string;
}

export interface UnaryAst {
  kind: "UNARY_NEGATE";
  child: ArithmeticAst;
}

export interface BinaryAst {
  kind: "BINARY";
  operator: ArithmeticOperator;
  left: ArithmeticAst;
  right: ArithmeticAst;
}

export type ArithmeticAst = ValueAst | UnaryAst | BinaryAst;

export interface RelationAst {
  kind: "RELATION";
  operator: RelationOperator;
  left: ArithmeticAst;
  right: ArithmeticAst;
}

export interface ArithmeticParseResult {
  kind: "ARITHMETIC";
  ast: ArithmeticAst;
}

export interface RelationParseResult {
  kind: "RELATION";
  ast: RelationAst;
}

export type ParsedExpression = ArithmeticParseResult | RelationParseResult;

export interface OperatorMappingEntry {
  displayToken: string;
  semanticOperator: SemanticOperator;
}

export interface OperatorMapping {
  entries: readonly OperatorMappingEntry[];
  preserveUnmappedStandardOperators?: boolean;
}

export interface OperatorPairSwap {
  left: string;
  right: string;
}

export interface TransformationTrace {
  transformationId: string;
  before: string;
  after: string;
  fingerprint: string;
}

export interface EvaluationResult {
  parsed: ParsedExpression;
  arithmeticValue?: ExactRational;
  relationValue?: boolean;
}

export interface CandidateRepair<T> {
  candidate: T;
  transformed: readonly DisplayToken[];
  result: EvaluationResult;
}

export type OpsRejectionCode =
  | "EMPTY_EXPRESSION"
  | "UNKNOWN_TOKEN"
  | "MALFORMED_NUMBER"
  | "MALFORMED_EXPRESSION"
  | "UNBALANCED_BRACKETS"
  | "DIVISION_BY_ZERO"
  | "INVALID_RELATION_STRUCTURE"
  | "UNMAPPED_SYMBOL"
  | "DUPLICATE_MAPPING_TOKEN"
  | "DUPLICATE_SWAP_TOKEN"
  | "LEADING_ZERO_AFTER_DIGIT_SWAP"
  | "INVALID_DIGIT_SWAP"
  | "AMBIGUOUS_REPAIR"
  | "NO_VALID_REPAIR";

export class OpsFoundationError extends Error {
  readonly code: OpsRejectionCode;

  constructor(code: OpsRejectionCode, message: string) {
    super(message);
    this.name = "OpsFoundationError";
    this.code = code;
  }
}
