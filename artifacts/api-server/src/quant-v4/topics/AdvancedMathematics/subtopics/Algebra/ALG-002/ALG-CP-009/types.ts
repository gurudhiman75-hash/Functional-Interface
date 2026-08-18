import type { QuadraticEquation, QuadraticSurd, Rational } from "../../../../../../shared/algebra";

export type AlgCp009SolveMode =
  | "solveFactorableQuadratic"
  | "solveRepeatedRootQuadratic"
  | "solveExactIrrationalQuadratic"
  | "classifyNoRealRoots"
  | "findParameterForEqualRoots"
  | "findCoefficientFromKnownRoot";

export type AlgCp009Answer =
  | { kind: "RATIONAL_ROOT_SET"; values: Rational[] }
  | { kind: "SURD_ROOT_SET"; values: QuadraticSurd[] }
  | { kind: "NO_REAL_ROOTS" }
  | { kind: "PARAMETER_VALUE"; value: Rational };

export interface AlgCp009Candidate {
  candidateId: string;
  solveMode: AlgCp009SolveMode;
  status: "DISCOVERY";
  permanentQlId: null;
  difficulty: "Easy" | "Medium";
  sourceStatus: "UNVERIFIED_DRAFT";
}

export interface AlgCp009DiscoveryItem {
  cpId: "ALG-CP-009";
  candidateId: string;
  solveMode: AlgCp009SolveMode;
  seed: number;
  stem: string;
  equation: QuadraticEquation;
  answer: AlgCp009Answer;
  explanation: string;
  sourceStatus: "UNVERIFIED_DRAFT";
  knownRootEvidence?: Rational;
}
