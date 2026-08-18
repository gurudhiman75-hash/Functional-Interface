import type {
  LinearEquation,
  LinearSystem2V,
  Polynomial1,
  QuadraticEquation,
  QuantityRelation,
  Rational,
  RationalEquation1,
} from "../../../../../../shared/algebra";

export type AlgCp015SolveMode =
  | "linearThenReciprocalTarget"
  | "systemThenQuantityComparison"
  | "quadraticThenAbsoluteRootGap"
  | "rationalEquationThenAbsoluteTarget"
  | "factorDivisionThenEvaluateQuotient"
  | "sharedSystemDerivedCaselet";

export type AlgCp015AnswerKind = "RATIONAL" | "QUANTITY_RELATION" | "RATIONAL_PAIR";

export interface AlgCp015Candidate {
  candidateId: string;
  solveMode: AlgCp015SolveMode;
  status: "DISCOVERY";
  permanentQlId: null;
  answerKind: AlgCp015AnswerKind;
  difficulty: "Medium" | "Hard";
  sourceStatus: "UNVERIFIED_DRAFT";
}

export type AlgCp015MathState =
  | { kind: "LINEAR_RECIPROCAL"; equation: LinearEquation }
  | { kind: "SYSTEM_QC"; system: LinearSystem2V }
  | { kind: "QUADRATIC_ROOT_GAP"; equation: QuadraticEquation }
  | { kind: "RATIONAL_ABS"; equation: RationalEquation1; p: Rational; d: Rational; q: Rational; offset: Rational }
  | { kind: "DIVISION_EVAL"; polynomial: Polynomial1; factorRoot: Rational; evaluationPoint: Rational }
  | { kind: "SYSTEM_CASELET"; system: LinearSystem2V };

export type AlgCp015Answer =
  | { kind: "RATIONAL"; value: Rational; text: string }
  | { kind: "QUANTITY_RELATION"; value: QuantityRelation; text: string }
  | { kind: "RATIONAL_PAIR"; first: Rational; second: Rational; text: string };

export interface AlgCp015DiscoveryItem {
  cpId: "ALG-CP-015";
  candidateId: string;
  solveMode: AlgCp015SolveMode;
  seed: number;
  stem: string;
  math: AlgCp015MathState;
  answer: AlgCp015Answer;
  explanation: string;
  sourceStatus: "UNVERIFIED_DRAFT";
}
