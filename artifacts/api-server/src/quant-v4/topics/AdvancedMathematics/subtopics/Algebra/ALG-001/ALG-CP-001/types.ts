import type { Rational } from "../../../../../../shared/algebra";

export type AlgCp001SolveMode =
  | "identifyCoefficientOfTerm"
  | "combineLikeTerms"
  | "evaluateOneVariableExpression"
  | "evaluateTwoVariableExpression"
  | "findMissingCoefficientFromKnownValue"
  | "detectUndefinedSubstitution";

export interface AlgCp001Candidate {
  candidateId: string;
  solveMode: AlgCp001SolveMode;
  status: "DISCOVERY";
  permanentQlId: null;
  answerKind: "RATIONAL" | "BOOLEAN";
  difficulty: "Easy" | "Medium";
  sourceStatus: "UNVERIFIED_DRAFT";
}

export type AlgCp001Answer =
  | { kind: "RATIONAL"; value: Rational }
  | { kind: "BOOLEAN"; value: boolean };

export interface AlgCp001DiscoveryItem {
  cpId: "ALG-CP-001";
  candidateId: string;
  solveMode: AlgCp001SolveMode;
  seed: number;
  stem: string;
  answer: AlgCp001Answer;
  explanation: string;
  sourceStatus: "UNVERIFIED_DRAFT";
}
