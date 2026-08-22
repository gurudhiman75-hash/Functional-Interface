import type { AlgCp003Candidate } from "./types";

export const ALG_CP003_DISCOVERY_CANDIDATES: AlgCp003Candidate[] = [
  { candidateId: "ALG-CP003-CAND-001", solveMode: "findPairwiseProductSumFromSumAndSquareSum", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP003-CAND-002", solveMode: "findSquareSumFromSumAndPairwiseProduct", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP003-CAND-003", solveMode: "findCubeSumWhenTotalSumIsZero", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP003-CAND-004", solveMode: "findPairwiseProductSumWhenTotalSumIsZero", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP003-CAND-005", solveMode: "findPairwiseDifferenceSquareSum", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP003-CAND-006", solveMode: "solveCyclicReciprocalRelation", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
];

export function getAlgCp003Candidate(candidateId: string): AlgCp003Candidate {
  const candidate = ALG_CP003_DISCOVERY_CANDIDATES.find((entry) => entry.candidateId === candidateId);
  if (!candidate) throw new Error(`Unknown ALG-CP-003 discovery candidate: ${candidateId}`);
  return candidate;
}