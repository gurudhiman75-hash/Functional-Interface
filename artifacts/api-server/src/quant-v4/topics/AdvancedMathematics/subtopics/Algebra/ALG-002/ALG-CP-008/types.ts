import type { Rational, RationalEquation1 } from "../../../../../../shared/algebra";

export type AlgCp008SolveMode =
  | "identifyExcludedValueLinearDenominator"
  | "solveLinearFractionEqualsConstant"
  | "solveTwoReciprocalFractions"
  | "rejectCancelledExcludedRoot"
  | "classifyNoValidRootAfterFiltering"
  | "solveReciprocalPlusConstant"
  | "classifyInfiniteOnRestrictedDomain";

export type AlgCp008Answer =
  | { kind: "EXCLUDED_VALUE"; value: Rational }
  | { kind: "ROOT_SET"; values: Rational[] }
  | { kind: "NO_SOLUTION" }
  | { kind: "INFINITE_ON_DOMAIN"; excludedValues: Rational[] };

export interface AlgCp008Candidate {
  candidateId: string;
  solveMode: AlgCp008SolveMode;
  status: "DISCOVERY";
  permanentQlId: null;
  difficulty: "Easy" | "Medium";
  sourceStatus: "UNVERIFIED_DRAFT";
}

export interface AlgCp008DiscoveryItem {
  cpId: "ALG-CP-008";
  candidateId: string;
  solveMode: AlgCp008SolveMode;
  seed: number;
  stem: string;
  equation: RationalEquation1;
  answer: AlgCp008Answer;
  explanation: string;
  sourceStatus: "UNVERIFIED_DRAFT";
}
