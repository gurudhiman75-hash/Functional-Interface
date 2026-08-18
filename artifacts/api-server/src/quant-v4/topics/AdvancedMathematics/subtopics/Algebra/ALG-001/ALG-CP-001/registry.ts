import type { AlgCp001Candidate } from "./types";

export const ALG_CP001_DISCOVERY_CANDIDATES: AlgCp001Candidate[] = [
  { candidateId: "ALG-CP001-CAND-001", solveMode: "identifyCoefficientOfTerm", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP001-CAND-002", solveMode: "combineLikeTerms", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP001-CAND-003", solveMode: "evaluateOneVariableExpression", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP001-CAND-004", solveMode: "evaluateTwoVariableExpression", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP001-CAND-005", solveMode: "findMissingCoefficientFromKnownValue", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP001-CAND-006", solveMode: "detectUndefinedSubstitution", status: "DISCOVERY", permanentQlId: null, answerKind: "BOOLEAN", difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
];

export function getAlgCp001Candidate(candidateId: string): AlgCp001Candidate {
  const candidate = ALG_CP001_DISCOVERY_CANDIDATES.find((entry) => entry.candidateId === candidateId);
  if (!candidate) throw new Error(`Unknown ALG-CP-001 discovery candidate: ${candidateId}`);
  return candidate;
}
