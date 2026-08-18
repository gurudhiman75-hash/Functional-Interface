import type { AlgCp012Candidate } from "./types";

export const ALG_CP012_DISCOVERY_CANDIDATES: AlgCp012Candidate[] = [
  { candidateId: "ALG-CP012-CAND-001", solveMode: "solveLinearInequality", status: "DISCOVERY", permanentQlId: null, answerKind: "INTERVAL_SET", difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP012-CAND-002", solveMode: "solveLinearInequalityWithNegativeCoefficient", status: "DISCOVERY", permanentQlId: null, answerKind: "INTERVAL_SET", difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP012-CAND-003", solveMode: "solveCompoundLinearInequality", status: "DISCOVERY", permanentQlId: null, answerKind: "INTERVAL_SET", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP012-CAND-004", solveMode: "solveQuadraticPositiveRegion", status: "DISCOVERY", permanentQlId: null, answerKind: "INTERVAL_SET", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP012-CAND-005", solveMode: "solveQuadraticNonPositiveRegion", status: "DISCOVERY", permanentQlId: null, answerKind: "INTERVAL_SET", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP012-CAND-006", solveMode: "solveRepeatedRootQuadraticInequality", status: "DISCOVERY", permanentQlId: null, answerKind: "INTERVAL_SET", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP012-CAND-007", solveMode: "findQuadraticMinimum", status: "DISCOVERY", permanentQlId: null, answerKind: "EXTREMUM", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP012-CAND-008", solveMode: "findQuadraticMaximum", status: "DISCOVERY", permanentQlId: null, answerKind: "EXTREMUM", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP012-CAND-009", solveMode: "findParameterRangeForGlobalQuadraticSign", status: "DISCOVERY", permanentQlId: null, answerKind: "PARAMETER_RANGE", difficulty: "Hard", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP012-CAND-010", solveMode: "countIntegerSolutionsInQuadraticInterval", status: "DISCOVERY", permanentQlId: null, answerKind: "INTEGER_COUNT", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP012-CAND-011", solveMode: "findMinimumReciprocalSumUnderPositiveFixedSum", status: "DISCOVERY", permanentQlId: null, answerKind: "SYMMETRIC_EXTREMUM", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP012-CAND-012", solveMode: "findMinimumSquareSumUnderPositiveFixedSum", status: "DISCOVERY", permanentQlId: null, answerKind: "SYMMETRIC_EXTREMUM", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
];

export function getAlgCp012Candidate(candidateId: string): AlgCp012Candidate {
  const candidate = ALG_CP012_DISCOVERY_CANDIDATES.find((entry) => entry.candidateId === candidateId);
  if (!candidate) throw new Error(`Unknown ALG-CP-012 discovery candidate: ${candidateId}`);
  return candidate;
}