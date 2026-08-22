import type { Polynomial1, Rational } from "../../../../../../shared/algebra";

export type AlgCp001SolveMode =
  | "identifyCoefficientOfTerm"
  | "combineLikeTerms"
  | "evaluateOneVariableExpression"
  | "evaluateTwoVariableExpression"
  | "findMissingCoefficientFromKnownValue"
  | "detectUndefinedSubstitution"
  | "expandAndSimplifyExpression";

export interface AlgCp001Candidate {
  candidateId: string;
  solveMode: AlgCp001SolveMode;
  status: "DISCOVERY";
  permanentQlId: null;
  answerKind: "RATIONAL" | "BOOLEAN" | "POLYNOMIAL";
  difficulty: "Easy" | "Medium";
  sourceStatus: "UNVERIFIED_DRAFT";
}

export type AlgCp001Answer =
  | { kind: "RATIONAL"; value: Rational }
  | { kind: "BOOLEAN"; value: boolean }
  | { kind: "POLYNOMIAL"; value: Polynomial1; text: string };

export interface AlgCp001DiscoveryItem {
  cpId: "ALG-CP-001";
  candidateId: string;
  solveMode: AlgCp001SolveMode;
  seed: number;
  stem: string;
  answer: AlgCp001Answer;
  explanation: string;
  sourceStatus: "UNVERIFIED_DRAFT";
  expansionEvidence?: {
    firstMultiplier: Rational;
    firstShift: Rational;
    secondMultiplier: Rational;
    secondShift: Rational;
  };
}
