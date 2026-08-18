import type { AlgCp007Candidate } from "./types";

export const ALG_CP007_DISCOVERY_CANDIDATES: AlgCp007Candidate[] = [
  { candidateId: "ALG-CP007-CAND-001", solveMode: "solveTwoByTwoSystem", status: "DISCOVERY", permanentQlId: null, difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP007-CAND-002", solveMode: "findXPlusYFromSystem", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP007-CAND-003", solveMode: "findXMinusYFromSystem", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP007-CAND-004", solveMode: "findOneVariableFromSystem", status: "DISCOVERY", permanentQlId: null, difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP007-CAND-005", solveMode: "classifyNoSolutionSystem", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP007-CAND-006", solveMode: "classifyInfiniteSolutionSystem", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP007-CAND-007", solveMode: "findParameterForNoSolutionSystem", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
];

export function getAlgCp007Candidate(candidateId: string): AlgCp007Candidate {
  const candidate = ALG_CP007_DISCOVERY_CANDIDATES.find((entry) => entry.candidateId === candidateId);
  if (!candidate) throw new Error(`Unknown ALG-CP-007 discovery candidate: ${candidateId}`);
  return candidate;
}
