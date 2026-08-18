import type { LinearEquation, Rational } from "../../../../../../shared/algebra";

export type AlgCp006SolveMode =
  | "solveAxPlusBEqualsC"
  | "solveVariableOnBothSides"
  | "solveEquationWithBrackets"
  | "solveEquationWithFractionalCoefficient"
  | "classifyNoSolutionLinearEquation"
  | "classifyInfiniteSolutionLinearEquation"
  | "findParameterForKnownLinearSolution";

export type AlgCp006Answer =
  | { kind: "UNIQUE_VALUE"; value: Rational }
  | { kind: "NO_SOLUTION" }
  | { kind: "INFINITE_SOLUTIONS" }
  | { kind: "PARAMETER_VALUE"; value: Rational };

export interface AlgCp006Candidate {
  candidateId: string;
  solveMode: AlgCp006SolveMode;
  status: "DISCOVERY";
  permanentQlId: null;
  difficulty: "Easy" | "Medium";
  sourceStatus: "UNVERIFIED_DRAFT";
}

export interface AlgCp006DiscoveryItem {
  cpId: "ALG-CP-006";
  candidateId: string;
  solveMode: AlgCp006SolveMode;
  seed: number;
  stem: string;
  equation: LinearEquation;
  answer: AlgCp006Answer;
  explanation: string;
  sourceStatus: "UNVERIFIED_DRAFT";
  parameterEvidence?: {
    knownSolution: Rational;
    coefficientOffset: Rational;
  };
}
