import type { AlgCp014Candidate } from "./types";

export const ALG_CP014_DISCOVERY_CANDIDATES: AlgCp014Candidate[] = [
  { candidateId: "ALG-CP014-CAND-001", solveMode: "compareExactQuantities", status: "DISCOVERY", permanentQlId: null, answerKind: "QUANTITY_RELATION", difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP014-CAND-002", solveMode: "compareDeterminatePossibilitySets", status: "DISCOVERY", permanentQlId: null, answerKind: "QUANTITY_RELATION", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP014-CAND-003", solveMode: "compareIndeterminatePossibilitySets", status: "DISCOVERY", permanentQlId: null, answerKind: "QUANTITY_RELATION", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP014-CAND-004", solveMode: "dataSufficiencyStatementIAlone", status: "DISCOVERY", permanentQlId: null, answerKind: "DATA_SUFFICIENCY", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP014-CAND-005", solveMode: "dataSufficiencyStatementIIAlone", status: "DISCOVERY", permanentQlId: null, answerKind: "DATA_SUFFICIENCY", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP014-CAND-006", solveMode: "dataSufficiencyEitherAlone", status: "DISCOVERY", permanentQlId: null, answerKind: "DATA_SUFFICIENCY", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP014-CAND-007", solveMode: "dataSufficiencyBothTogether", status: "DISCOVERY", permanentQlId: null, answerKind: "DATA_SUFFICIENCY", difficulty: "Hard", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP014-CAND-008", solveMode: "dataSufficiencyNotSufficient", status: "DISCOVERY", permanentQlId: null, answerKind: "DATA_SUFFICIENCY", difficulty: "Hard", sourceStatus: "UNVERIFIED_DRAFT" },
];

export function getAlgCp014Candidate(candidateId: string): AlgCp014Candidate {
  const candidate = ALG_CP014_DISCOVERY_CANDIDATES.find((entry) => entry.candidateId === candidateId);
  if (!candidate) throw new Error(`Unknown ALG-CP-014 discovery candidate: ${candidateId}`);
  return candidate;
}
