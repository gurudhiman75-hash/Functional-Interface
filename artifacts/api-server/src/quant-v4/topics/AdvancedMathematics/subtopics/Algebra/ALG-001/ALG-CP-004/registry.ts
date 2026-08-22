import type { AlgCp004Candidate } from "./types";

export const ALG_CP004_DISCOVERY_CANDIDATES: AlgCp004Candidate[] = [
  { candidateId: "ALG-CP004-CAND-001", solveMode: "factorCommonIntegerContent", status: "DISCOVERY", permanentQlId: null, answerKind: "FACTORIZATION", difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP004-CAND-002", solveMode: "factorDifferenceOfSquares", status: "DISCOVERY", permanentQlId: null, answerKind: "FACTORIZATION", difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP004-CAND-003", solveMode: "factorPerfectSquareTrinomial", status: "DISCOVERY", permanentQlId: null, answerKind: "FACTORIZATION", difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP004-CAND-004", solveMode: "factorMonicQuadratic", status: "DISCOVERY", permanentQlId: null, answerKind: "FACTORIZATION", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP004-CAND-005", solveMode: "factorNonMonicQuadratic", status: "DISCOVERY", permanentQlId: null, answerKind: "FACTORIZATION", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
];

export function getAlgCp004Candidate(candidateId: string): AlgCp004Candidate {
  const candidate = ALG_CP004_DISCOVERY_CANDIDATES.find((entry) => entry.candidateId === candidateId);
  if (!candidate) throw new Error(`Unknown ALG-CP-004 discovery candidate: ${candidateId}`);
  return candidate;
}
