import type { AlgCp009Candidate } from "./types";

export const ALG_CP009_DISCOVERY_CANDIDATES: AlgCp009Candidate[] = [
  { candidateId: "ALG-CP009-CAND-001", solveMode: "solveFactorableQuadratic", status: "DISCOVERY", permanentQlId: null, difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP009-CAND-002", solveMode: "solveRepeatedRootQuadratic", status: "DISCOVERY", permanentQlId: null, difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP009-CAND-003", solveMode: "solveExactIrrationalQuadratic", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP009-CAND-004", solveMode: "classifyNoRealRoots", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP009-CAND-005", solveMode: "findParameterForEqualRoots", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP009-CAND-006", solveMode: "findCoefficientFromKnownRoot", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
];

export function getAlgCp009Candidate(candidateId: string): AlgCp009Candidate {
  const candidate = ALG_CP009_DISCOVERY_CANDIDATES.find((entry) => entry.candidateId === candidateId);
  if (!candidate) throw new Error(`Unknown ALG-CP-009 discovery candidate: ${candidateId}`);
  return candidate;
}
