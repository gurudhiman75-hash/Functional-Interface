import type { AlgCp011Candidate } from "./types";

export const ALG_CP011_DISCOVERY_CANDIDATES: AlgCp011Candidate[] = [
  { candidateId: "ALG-CP011-CAND-001", solveMode: "compareAlwaysGreaterRootSets", status: "DISCOVERY", permanentQlId: null, difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP011-CAND-002", solveMode: "compareAlwaysLessRootSets", status: "DISCOVERY", permanentQlId: null, difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP011-CAND-003", solveMode: "compareGreaterOrEqualRootSets", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP011-CAND-004", solveMode: "compareLessOrEqualRootSets", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP011-CAND-005", solveMode: "compareEqualRepeatedRoots", status: "DISCOVERY", permanentQlId: null, difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP011-CAND-006", solveMode: "compareOverlappingIndeterminateRootSets", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
];

export function getAlgCp011Candidate(candidateId: string): AlgCp011Candidate {
  const candidate = ALG_CP011_DISCOVERY_CANDIDATES.find((entry) => entry.candidateId === candidateId);
  if (!candidate) throw new Error(`Unknown ALG-CP-011 discovery candidate: ${candidateId}`);
  return candidate;
}
