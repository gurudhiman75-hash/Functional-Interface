import type { Rational } from "../../../../../../shared/algebra";

export type AlgCp002SolveMode =
  | "findSquareSumFromSumAndProduct"
  | "findCubeSumFromSumAndProduct"
  | "findReciprocalSquareFromPlus"
  | "findReciprocalCubeFromPlus"
  | "findReciprocalHigherPowerFromPlus"
  | "findReciprocalSquareFromMinus"
  | "findReciprocalCubeFromMinus"
  | "findDifferenceOfSquaresFromSumAndDifference";

export interface AlgCp002Candidate {
  candidateId: string;
  solveMode: AlgCp002SolveMode;
  status: "DISCOVERY";
  permanentQlId: null;
  answerKind: "RATIONAL";
  difficulty: "Easy" | "Medium";
  sourceStatus: "UNVERIFIED_DRAFT";
}

export interface AlgCp002DiscoveryItem {
  cpId: "ALG-CP-002";
  candidateId: string;
  solveMode: AlgCp002SolveMode;
  seed: number;
  stem: string;
  answer: { kind: "RATIONAL"; value: Rational };
  explanation: string;
  sourceStatus: "UNVERIFIED_DRAFT";
}
