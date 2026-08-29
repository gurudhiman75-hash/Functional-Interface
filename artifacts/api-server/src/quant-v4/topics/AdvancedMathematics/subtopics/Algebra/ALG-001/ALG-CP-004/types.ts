import type { Factorization1, Polynomial1 } from "../../../../../../shared/algebra";

export type AlgCp004SolveMode =
  | "factorCommonIntegerContent"
  | "factorDifferenceOfSquares"
  | "factorPerfectSquareTrinomial"
  | "factorMonicQuadratic"
  | "factorNonMonicQuadratic";

export interface AlgCp004Candidate {
  candidateId: string;
  solveMode: AlgCp004SolveMode;
  status: "DISCOVERY";
  permanentQlId: null;
  answerKind: "FACTORIZATION";
  difficulty: "Easy" | "Medium";
  sourceStatus: "UNVERIFIED_DRAFT";
}

export interface AlgCp004DiscoveryItem {
  cpId: "ALG-CP-004";
  candidateId: string;
  solveMode: AlgCp004SolveMode;
  seed: number;
  stem: string;
  polynomial: Polynomial1;
  answer: { kind: "FACTORIZATION"; value: Factorization1; text: string };
  explanation: string;
  sourceStatus: "UNVERIFIED_DRAFT";
}
