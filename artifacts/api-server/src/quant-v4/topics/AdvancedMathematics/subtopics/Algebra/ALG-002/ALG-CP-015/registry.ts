import type { AlgCp015Candidate } from "./types";

export const ALG_CP015_DISCOVERY_CANDIDATES: AlgCp015Candidate[] = [
  { candidateId: "ALG-CP015-CAND-001", solveMode: "linearThenReciprocalTarget", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP015-CAND-002", solveMode: "systemThenQuantityComparison", status: "DISCOVERY", permanentQlId: null, answerKind: "QUANTITY_RELATION", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP015-CAND-003", solveMode: "quadraticThenAbsoluteRootGap", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP015-CAND-004", solveMode: "rationalEquationThenAbsoluteTarget", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Hard", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP015-CAND-005", solveMode: "factorDivisionThenEvaluateQuotient", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Hard", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP015-CAND-006", solveMode: "sharedSystemDerivedCaselet", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL_PAIR", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
];

export function getAlgCp015Candidate(candidateId: string): AlgCp015Candidate {
  const candidate = ALG_CP015_DISCOVERY_CANDIDATES.find((entry) => entry.candidateId === candidateId);
  if (!candidate) throw new Error(`Unknown ALG-CP-015 discovery candidate: ${candidateId}`);
  return candidate;
}
