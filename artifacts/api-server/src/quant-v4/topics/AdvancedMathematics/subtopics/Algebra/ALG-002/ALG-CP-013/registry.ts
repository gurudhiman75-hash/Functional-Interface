import type { AlgCp013Candidate } from "./types";

export const ALG_CP013_DISCOVERY_CANDIDATES: AlgCp013Candidate[] = [
  { candidateId: "ALG-CP013-CAND-001", solveMode: "solveSimpleAbsoluteEquation", status: "DISCOVERY", permanentQlId: null, answerKind: "ABSOLUTE_SOLUTION", difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP013-CAND-002", solveMode: "solveAffineAbsoluteEquation", status: "DISCOVERY", permanentQlId: null, answerKind: "ABSOLUTE_SOLUTION", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP013-CAND-003", solveMode: "solveZeroRhsAbsoluteEquation", status: "DISCOVERY", permanentQlId: null, answerKind: "ABSOLUTE_SOLUTION", difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP013-CAND-004", solveMode: "rejectNegativeRhsAbsoluteEquation", status: "DISCOVERY", permanentQlId: null, answerKind: "ABSOLUTE_SOLUTION", difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP013-CAND-005", solveMode: "solveBoundedAbsoluteInequality", status: "DISCOVERY", permanentQlId: null, answerKind: "INTERVAL_SET", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP013-CAND-006", solveMode: "solveExteriorAbsoluteInequality", status: "DISCOVERY", permanentQlId: null, answerKind: "INTERVAL_SET", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP013-CAND-007", solveMode: "solveZeroBoundaryAbsoluteInequality", status: "DISCOVERY", permanentQlId: null, answerKind: "INTERVAL_SET", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP013-CAND-008", solveMode: "solveEqualAbsoluteDistances", status: "DISCOVERY", permanentQlId: null, answerKind: "ABSOLUTE_SOLUTION", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP013-CAND-009", solveMode: "countIntegerSolutionsToAbsoluteInequality", status: "DISCOVERY", permanentQlId: null, answerKind: "INTEGER_COUNT", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
];

export function getAlgCp013Candidate(candidateId: string): AlgCp013Candidate {
  const candidate = ALG_CP013_DISCOVERY_CANDIDATES.find((entry) => entry.candidateId === candidateId);
  if (!candidate) throw new Error(`Unknown ALG-CP-013 discovery candidate: ${candidateId}`);
  return candidate;
}
