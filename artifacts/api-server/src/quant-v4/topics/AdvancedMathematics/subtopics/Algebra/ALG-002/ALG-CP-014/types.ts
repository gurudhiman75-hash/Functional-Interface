import type {
  DataSufficiencyVerdict,
  InequalityOperator,
  LinearEquation,
  LinearSystem2V,
  QuantityRelation,
  Rational,
} from "../../../../../../shared/algebra";

export type AlgCp014SolveMode =
  | "compareExactQuantities"
  | "compareDeterminatePossibilitySets"
  | "compareIndeterminatePossibilitySets"
  | "dataSufficiencyStatementIAlone"
  | "dataSufficiencyStatementIIAlone"
  | "dataSufficiencyEitherAlone"
  | "dataSufficiencyBothTogether"
  | "dataSufficiencyNotSufficient";

export type AlgCp014AnswerKind = "QUANTITY_RELATION" | "DATA_SUFFICIENCY";

export interface AlgCp014Candidate {
  candidateId: string;
  solveMode: AlgCp014SolveMode;
  status: "DISCOVERY";
  permanentQlId: null;
  answerKind: AlgCp014AnswerKind;
  difficulty: "Easy" | "Medium" | "Hard";
  sourceStatus: "UNVERIFIED_DRAFT";
}

export type AlgCp014SingleVariableStatement =
  | { kind: "LINEAR_EQUATION"; equation: LinearEquation }
  | { kind: "LINEAR_INEQUALITY"; a: Rational; b: Rational; operator: InequalityOperator };

export type AlgCp014MathState =
  | { kind: "EXACT_QC"; quantityI: Rational; quantityII: Rational }
  | { kind: "SET_QC"; quantityIValues: Rational[]; quantityIIValues: Rational[] }
  | { kind: "DS_SINGLE_VARIABLE"; statementI: AlgCp014SingleVariableStatement; statementII: AlgCp014SingleVariableStatement; target: "x" }
  | { kind: "DS_SYSTEM"; system: LinearSystem2V; target: "x" | "y" };

export type AlgCp014Answer =
  | { kind: "QUANTITY_RELATION"; value: QuantityRelation; text: string }
  | { kind: "DATA_SUFFICIENCY"; value: DataSufficiencyVerdict; text: string };

export interface AlgCp014DiscoveryItem {
  cpId: "ALG-CP-014";
  candidateId: string;
  solveMode: AlgCp014SolveMode;
  seed: number;
  stem: string;
  statements?: [string, string];
  math: AlgCp014MathState;
  answer: AlgCp014Answer;
  explanation: string;
  sourceStatus: "UNVERIFIED_DRAFT";
}
