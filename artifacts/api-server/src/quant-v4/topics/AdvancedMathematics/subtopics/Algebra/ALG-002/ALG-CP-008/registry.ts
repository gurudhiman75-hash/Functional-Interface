import type { AlgCp008Candidate } from "./types";

export const ALG_CP008_DISCOVERY_CANDIDATES: AlgCp008Candidate[] = [
  { candidateId: "ALG-CP008-CAND-001", solveMode: "identifyExcludedValueLinearDenominator", status: "DISCOVERY", permanentQlId: null, difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP008-CAND-002", solveMode: "solveLinearFractionEqualsConstant", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP008-CAND-003", solveMode: "solveTwoReciprocalFractions", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP008-CAND-004", solveMode: "rejectCancelledExcludedRoot", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP008-CAND-005", solveMode: "classifyNoValidRootAfterFiltering", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP008-CAND-006", solveMode: "solveReciprocalPlusConstant", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP008-CAND-007", solveMode: "classifyInfiniteOnRestrictedDomain", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
];

export function getAlgCp008Candidate(candidateId: string): AlgCp008Candidate {
  const candidate = ALG_CP008_DISCOVERY_CANDIDATES.find((entry) => entry.candidateId === candidateId);
  if (!candidate) throw new Error(`Unknown ALG-CP-008 discovery candidate: ${candidateId}`);
  return candidate;
}
