import type {
  AbsoluteEquationSolution,
  InequalityOperator,
  Rational,
  RationalIntervalSet,
} from "../../../../../../shared/algebra";

export type AlgCp013SolveMode =
  | "solveSimpleAbsoluteEquation"
  | "solveAffineAbsoluteEquation"
  | "solveZeroRhsAbsoluteEquation"
  | "rejectNegativeRhsAbsoluteEquation"
  | "solveBoundedAbsoluteInequality"
  | "solveExteriorAbsoluteInequality"
  | "solveZeroBoundaryAbsoluteInequality"
  | "solveEqualAbsoluteDistances"
  | "countIntegerSolutionsToAbsoluteInequality";

export type AlgCp013AnswerKind = "ABSOLUTE_SOLUTION" | "INTERVAL_SET" | "INTEGER_COUNT";

export interface AlgCp013Candidate {
  candidateId: string;
  solveMode: AlgCp013SolveMode;
  status: "DISCOVERY";
  permanentQlId: null;
  answerKind: AlgCp013AnswerKind;
  difficulty: "Easy" | "Medium";
  sourceStatus: "UNVERIFIED_DRAFT";
}

export type AlgCp013MathState =
  | { kind: "ABS_EQUATION"; a: Rational; b: Rational; rhs: Rational }
  | { kind: "ABS_INEQUALITY"; a: Rational; b: Rational; rhs: Rational; operator: InequalityOperator }
  | { kind: "EQUAL_DISTANCE"; leftCenter: Rational; rightCenter: Rational }
  | { kind: "INTEGER_COUNT"; a: Rational; b: Rational; rhs: Rational; operator: InequalityOperator };

export type AlgCp013Answer =
  | { kind: "ABSOLUTE_SOLUTION"; value: AbsoluteEquationSolution; text: string }
  | { kind: "INTERVAL_SET"; value: RationalIntervalSet; text: string }
  | { kind: "INTEGER_COUNT"; value: bigint; text: string };

export interface AlgCp013DiscoveryItem {
  cpId: "ALG-CP-013";
  candidateId: string;
  solveMode: AlgCp013SolveMode;
  seed: number;
  stem: string;
  math: AlgCp013MathState;
  answer: AlgCp013Answer;
  explanation: string;
  sourceStatus: "UNVERIFIED_DRAFT";
}
