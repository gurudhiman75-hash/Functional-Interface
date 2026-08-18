import type { Polynomial1, Rational } from "../../../../../../shared/algebra";

export type AlgCp005SolveMode =
  | "findRemainderForXMinusK"
  | "findRemainderForXPlusK"
  | "findUnknownCoefficientFromFactorCondition"
  | "findUnknownCoefficientFromGivenRemainder"
  | "findRemainderForGeneralLinearDivisor"
  | "verifyDeclaredLinearFactor"
  | "findTwoCoefficientsFromTwoRemainderConditions"
  | "findParameterAndCommonRemainderAcrossPolynomials";

export type AlgCp005AnswerKind = "RATIONAL" | "BOOLEAN" | "COEFFICIENT_PAIR" | "PARAMETER_REMAINDER";

export interface AlgCp005Candidate {
  candidateId: string;
  solveMode: AlgCp005SolveMode;
  status: "DISCOVERY";
  permanentQlId: null;
  answerKind: AlgCp005AnswerKind;
  difficulty: "Easy" | "Medium";
  sourceStatus: "UNVERIFIED_DRAFT";
}

export interface AlgCp005DiscoveryItem {
  cpId: "ALG-CP-005";
  candidateId: string;
  solveMode: AlgCp005SolveMode;
  seed: number;
  stem: string;
  polynomial: Polynomial1;
  divisor: { a: Rational; b: Rational; root: Rational };
  answer:
    | { kind: "RATIONAL"; value: Rational }
    | { kind: "BOOLEAN"; value: boolean }
    | { kind: "COEFFICIENT_PAIR"; k: Rational; m: Rational }
    | { kind: "PARAMETER_REMAINDER"; parameter: Rational; remainder: Rational };
  explanation: string;
  sourceStatus: "UNVERIFIED_DRAFT";
  conditionEvidence?: {
    secondRoot: Rational;
    secondRemainder: Rational;
  };
  equalRemainderEvidence?: {
    secondPolynomial: Polynomial1;
    parameterCoefficientDegree: number;
    commonRemainder: Rational;
  };
}
