import type { AlgCp005Candidate } from "./types";

export const ALG_CP005_DISCOVERY_CANDIDATES: AlgCp005Candidate[] = [
  { candidateId: "ALG-CP005-CAND-001", solveMode: "findRemainderForXMinusK", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP005-CAND-002", solveMode: "findRemainderForXPlusK", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP005-CAND-003", solveMode: "findUnknownCoefficientFromFactorCondition", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP005-CAND-004", solveMode: "findUnknownCoefficientFromGivenRemainder", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP005-CAND-005", solveMode: "findRemainderForGeneralLinearDivisor", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP005-CAND-006", solveMode: "verifyDeclaredLinearFactor", status: "DISCOVERY", permanentQlId: null, answerKind: "BOOLEAN", difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP005-CAND-007", solveMode: "findTwoCoefficientsFromTwoRemainderConditions", status: "DISCOVERY", permanentQlId: null, answerKind: "COEFFICIENT_PAIR", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP005-CAND-008", solveMode: "findParameterAndCommonRemainderAcrossPolynomials", status: "DISCOVERY", permanentQlId: null, answerKind: "PARAMETER_REMAINDER", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
];

export function getAlgCp005Candidate(candidateId: string): AlgCp005Candidate {
  const candidate = ALG_CP005_DISCOVERY_CANDIDATES.find((entry) => entry.candidateId === candidateId);
  if (!candidate) throw new Error(`Unknown ALG-CP-005 discovery candidate: ${candidateId}`);
  return candidate;
}
