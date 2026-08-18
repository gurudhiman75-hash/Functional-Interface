import type { AlgCp010Candidate } from "./types";

export const ALG_CP010_DISCOVERY_CANDIDATES: AlgCp010Candidate[] = [
  { candidateId: "ALG-CP010-CAND-001", solveMode: "findSumOfRootsByVieta", status: "DISCOVERY", permanentQlId: null, difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP010-CAND-002", solveMode: "findProductOfRootsByVieta", status: "DISCOVERY", permanentQlId: null, difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP010-CAND-003", solveMode: "findSquareSumOfRootsByVieta", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP010-CAND-004", solveMode: "findReciprocalSumOfRootsByVieta", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP010-CAND-005", solveMode: "findCubeSumOfRootsByVieta", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP010-CAND-006", solveMode: "constructEquationFromSumAndProduct", status: "DISCOVERY", permanentQlId: null, difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP010-CAND-007", solveMode: "constructEquationWithShiftedRoots", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP010-CAND-008", solveMode: "constructEquationWithReciprocalRoots", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP010-CAND-009", solveMode: "findOtherRootFromKnownRoot", status: "DISCOVERY", permanentQlId: null, difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP010-CAND-010", solveMode: "constructEquationWithProductPlusMinusSumRoots", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP010-CAND-011", solveMode: "constructEquationWithReciprocalThenShiftedRoots", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP010-CAND-012", solveMode: "findCubicRootSumByVieta", status: "DISCOVERY", permanentQlId: null, difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
];

export function getAlgCp010Candidate(candidateId: string): AlgCp010Candidate {
  const candidate = ALG_CP010_DISCOVERY_CANDIDATES.find((entry) => entry.candidateId === candidateId);
  if (!candidate) throw new Error(`Unknown ALG-CP-010 discovery candidate: ${candidateId}`);
  return candidate;
}