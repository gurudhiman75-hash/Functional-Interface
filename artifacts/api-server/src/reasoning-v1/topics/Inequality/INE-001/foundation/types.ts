export type AtomicOrder = "LT" | "EQ" | "GT";

export type ComparisonRelation =
  | "GREATER_THAN"
  | "LESS_THAN"
  | "EQUAL_TO"
  | "GREATER_THAN_OR_EQUAL"
  | "LESS_THAN_OR_EQUAL";

export type ComparisonRelationToken =
  | ComparisonRelation
  | ">"
  | "<"
  | "="
  | ">="
  | "<="
  | "≥"
  | "≤";

export type RelationPhraseKey =
  | "GREATER_THAN"
  | "LESS_THAN"
  | "NOT_LESS_THAN"
  | "NOT_GREATER_THAN"
  | "EQUAL_TO"
  | "NEITHER_LESS_NOR_GREATER"
  | "NEITHER_LESS_NOR_EQUAL"
  | "NEITHER_GREATER_NOR_EQUAL";

export interface ComparisonConstraint {
  leftId: string;
  relation: ComparisonRelation;
  rightId: string;
  sourceStatementId: string;
}

export interface ComparisonProofStep {
  fromId: string;
  toId: string;
  strict: boolean;
  sourceStatementIds: readonly string[];
}

export interface ComparisonProofPath {
  componentIds: readonly string[];
  steps: readonly ComparisonProofStep[];
  strict: boolean;
}

export type NumericAssignment = Readonly<Record<string, number>>;

export interface PairRelationEvidence {
  leftId: string;
  rightId: string;
  possibleAtomicRelations: readonly AtomicOrder[];
  isDefinite: boolean;
  strongestDefiniteRelation?: ComparisonRelation;
  proofPath?: ComparisonProofPath;
  witnessByRelation?: Partial<Record<AtomicOrder, NumericAssignment>>;
}

export type ConclusionTruth =
  | "DEFINITELY_TRUE"
  | "POSSIBLY_TRUE"
  | "IMPOSSIBLE";

export interface ConclusionEvaluationEvidence {
  conclusion: ComparisonConstraint;
  truth: ConclusionTruth;
  pairEvidence: PairRelationEvidence;
  satisfyingAtomicRelations: readonly AtomicOrder[];
  rejectingAtomicRelations: readonly AtomicOrder[];
}

export interface InequalityContradiction {
  code: "STRICT_SELF_RELATION" | "STRICT_ORDER_CYCLE" | "INVALID_ENTITY_ID";
  message: string;
  sourceStatementIds: readonly string[];
}

export interface InequalityGraphAnalysis {
  entities: readonly string[];
  equalityComponents: readonly (readonly string[])[];
  normalizedConstraints: readonly ComparisonConstraint[];
  consistent: boolean;
  contradictions: readonly InequalityContradiction[];
}

export interface ModelEnumerationOptions {
  maxEntities?: number;
  maxAssignments?: number;
}

export interface ModelEnumerationResult {
  entities: readonly string[];
  validModelCount: number;
  evaluatedAssignmentCount: number;
  possibleAtomicRelations: readonly AtomicOrder[];
  witnessByRelation: Partial<Record<AtomicOrder, NumericAssignment>>;
  truncated: boolean;
}

export interface SolverAgreementEvidence {
  graphAnalysis: InequalityGraphAnalysis;
  graphEvidence?: PairRelationEvidence;
  modelEvidence: ModelEnumerationResult;
  agreed: boolean;
}
