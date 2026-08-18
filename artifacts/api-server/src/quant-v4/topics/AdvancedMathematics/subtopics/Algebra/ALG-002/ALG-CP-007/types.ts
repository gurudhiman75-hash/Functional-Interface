import type { LinearSystem2V, Rational } from "../../../../../../shared/algebra";

export type AlgCp007SolveMode =
  | "solveTwoByTwoSystem"
  | "findXPlusYFromSystem"
  | "findXMinusYFromSystem"
  | "findOneVariableFromSystem"
  | "classifyNoSolutionSystem"
  | "classifyInfiniteSolutionSystem"
  | "findParameterForNoSolutionSystem";

export type AlgCp007Answer =
  | { kind: "ORDERED_PAIR"; x: Rational; y: Rational }
  | { kind: "RATIONAL"; value: Rational }
  | { kind: "NO_SOLUTION" }
  | { kind: "INFINITE_SOLUTIONS" }
  | { kind: "PARAMETER_VALUE"; value: Rational };

export interface AlgCp007Candidate {
  candidateId: string;
  solveMode: AlgCp007SolveMode;
  status: "DISCOVERY";
  permanentQlId: null;
  difficulty: "Easy" | "Medium";
  sourceStatus: "UNVERIFIED_DRAFT";
}

export interface AlgCp007DiscoveryItem {
  cpId: "ALG-CP-007";
  candidateId: string;
  solveMode: AlgCp007SolveMode;
  seed: number;
  stem: string;
  system: LinearSystem2V;
  answer: AlgCp007Answer;
  explanation: string;
  sourceStatus: "UNVERIFIED_DRAFT";
  parameterEvidence?: { hiddenSecondXCoefficient: true };
}
