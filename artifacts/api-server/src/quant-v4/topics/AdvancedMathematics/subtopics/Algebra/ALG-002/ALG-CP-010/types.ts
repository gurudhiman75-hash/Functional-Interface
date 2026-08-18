import type { QuadraticEquation, Rational } from "../../../../../../shared/algebra";

export type AlgCp010SolveMode =
  | "findSumOfRootsByVieta"
  | "findProductOfRootsByVieta"
  | "findSquareSumOfRootsByVieta"
  | "findReciprocalSumOfRootsByVieta"
  | "findCubeSumOfRootsByVieta"
  | "constructEquationFromSumAndProduct"
  | "constructEquationWithShiftedRoots"
  | "constructEquationWithReciprocalRoots"
  | "findOtherRootFromKnownRoot";

export type AlgCp010Answer =
  | { kind: "RATIONAL"; value: Rational }
  | { kind: "QUADRATIC_EQUATION"; value: QuadraticEquation };

export interface AlgCp010Candidate {
  candidateId: string;
  solveMode: AlgCp010SolveMode;
  status: "DISCOVERY";
  permanentQlId: null;
  difficulty: "Easy" | "Medium";
  sourceStatus: "UNVERIFIED_DRAFT";
}

export interface AlgCp010DiscoveryItem {
  cpId: "ALG-CP-010";
  candidateId: string;
  solveMode: AlgCp010SolveMode;
  seed: number;
  stem: string;
  originalEquation: QuadraticEquation;
  answer: AlgCp010Answer;
  explanation: string;
  sourceStatus: "UNVERIFIED_DRAFT";
  hiddenRoots?: [Rational, Rational];
  transformEvidence?: { kind: "SHIFT"; value: Rational } | { kind: "RECIPROCAL" };
  knownRootEvidence?: Rational;
}
