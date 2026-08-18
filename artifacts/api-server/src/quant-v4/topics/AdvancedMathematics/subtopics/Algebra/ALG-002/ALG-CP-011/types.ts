import type { QuadraticEquation, Rational, RootSetRelation } from "../../../../../../shared/algebra";

export type AlgCp011SolveMode =
  | "compareAlwaysGreaterRootSets"
  | "compareAlwaysLessRootSets"
  | "compareGreaterOrEqualRootSets"
  | "compareLessOrEqualRootSets"
  | "compareEqualRepeatedRoots"
  | "compareOverlappingIndeterminateRootSets";

export interface AlgCp011Candidate {
  candidateId: string;
  solveMode: AlgCp011SolveMode;
  status: "DISCOVERY";
  permanentQlId: null;
  difficulty: "Easy" | "Medium";
  sourceStatus: "UNVERIFIED_DRAFT";
}

export interface AlgCp011DiscoveryItem {
  cpId: "ALG-CP-011";
  candidateId: string;
  solveMode: AlgCp011SolveMode;
  seed: number;
  equationX: QuadraticEquation;
  equationY: QuadraticEquation;
  stem: string;
  answer: RootSetRelation;
  explanation: string;
  rootEvidence: { xRoots: Rational[]; yRoots: Rational[] };
  sourceStatus: "UNVERIFIED_DRAFT";
}
