import type {
  GlobalQuadraticSign,
  InequalityOperator,
  ParameterRange,
  QuadraticEquation,
  QuadraticExtremum,
  Rational,
  RationalIntervalSet,
} from "../../../../../../shared/algebra";

export type AlgCp012SolveMode =
  | "solveLinearInequality"
  | "solveLinearInequalityWithNegativeCoefficient"
  | "solveCompoundLinearInequality"
  | "solveQuadraticPositiveRegion"
  | "solveQuadraticNonPositiveRegion"
  | "solveRepeatedRootQuadraticInequality"
  | "findQuadraticMinimum"
  | "findQuadraticMaximum"
  | "findParameterRangeForGlobalQuadraticSign"
  | "countIntegerSolutionsInQuadraticInterval"
  | "findMinimumReciprocalSumUnderPositiveFixedSum"
  | "findMinimumSquareSumUnderPositiveFixedSum";

export type AlgCp012AnswerKind = "INTERVAL_SET" | "EXTREMUM" | "PARAMETER_RANGE" | "INTEGER_COUNT" | "SYMMETRIC_EXTREMUM";

export interface AlgCp012Candidate {
  candidateId: string;
  solveMode: AlgCp012SolveMode;
  status: "DISCOVERY";
  permanentQlId: null;
  answerKind: AlgCp012AnswerKind;
  difficulty: "Easy" | "Medium" | "Hard";
  sourceStatus: "UNVERIFIED_DRAFT";
}

export type AlgCp012MathState =
  | {
      kind: "LINEAR";
      a: Rational;
      b: Rational;
      operator: InequalityOperator;
    }
  | {
      kind: "COMPOUND_LINEAR";
      inequalities: [
        { a: Rational; b: Rational; operator: InequalityOperator },
        { a: Rational; b: Rational; operator: InequalityOperator },
      ];
    }
  | {
      kind: "QUADRATIC_INEQUALITY";
      equation: QuadraticEquation;
      operator: InequalityOperator;
    }
  | {
      kind: "EXTREMUM";
      equation: QuadraticEquation;
    }
  | {
      kind: "GLOBAL_SIGN_PARAMETER";
      a: Rational;
      b: Rational;
      target: GlobalQuadraticSign;
      parameter: "k";
    }
  | {
      kind: "INTEGER_COUNT";
      equation: QuadraticEquation;
      operator: InequalityOperator;
    }
  | {
      kind: "SYMMETRIC_FIXED_SUM";
      variableCount: 3;
      positiveDomain: true;
      sum: Rational;
      target: "RECIPROCAL_SUM" | "SQUARE_SUM";
    };

export type AlgCp012Answer =
  | { kind: "INTERVAL_SET"; value: RationalIntervalSet; text: string }
  | { kind: "EXTREMUM"; value: QuadraticExtremum; text: string }
  | { kind: "PARAMETER_RANGE"; value: ParameterRange; text: string }
  | { kind: "INTEGER_COUNT"; value: bigint; text: string }
  | { kind: "SYMMETRIC_EXTREMUM"; value: Rational; balancedVariable: Rational; text: string };

export interface AlgCp012DiscoveryItem {
  cpId: "ALG-CP-012";
  candidateId: string;
  solveMode: AlgCp012SolveMode;
  seed: number;
  stem: string;
  math: AlgCp012MathState;
  answer: AlgCp012Answer;
  explanation: string;
  sourceStatus: "UNVERIFIED_DRAFT";
}