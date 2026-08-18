import type { Rational } from "../../../../../../shared/algebra";

export type AlgCp003SolveMode =
  | "findPairwiseProductSumFromSumAndSquareSum"
  | "findSquareSumFromSumAndPairwiseProduct"
  | "findCubeSumWhenTotalSumIsZero"
  | "findPairwiseProductSumWhenTotalSumIsZero"
  | "findPairwiseDifferenceSquareSum";

export interface AlgCp003Candidate {
  candidateId: string;
  solveMode: AlgCp003SolveMode;
  status: "DISCOVERY";
  permanentQlId: null;
  answerKind: "RATIONAL";
  difficulty: "Easy" | "Medium";
  sourceStatus: "UNVERIFIED_DRAFT";
}

export interface AlgCp003DiscoveryItem {
  cpId: "ALG-CP-003";
  candidateId: string;
  solveMode: AlgCp003SolveMode;
  seed: number;
  stem: string;
  answer: { kind: "RATIONAL"; value: Rational };
  explanation: string;
  sourceStatus: "UNVERIFIED_DRAFT";
}
