import type { AlgCp002Candidate } from "./types";

export const ALG_CP002_DISCOVERY_CANDIDATES: AlgCp002Candidate[] = [
  { candidateId: "ALG-CP002-CAND-001", solveMode: "findSquareSumFromSumAndProduct", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP002-CAND-002", solveMode: "findCubeSumFromSumAndProduct", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP002-CAND-003", solveMode: "findReciprocalSquareFromPlus", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP002-CAND-004", solveMode: "findReciprocalCubeFromPlus", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP002-CAND-005", solveMode: "findReciprocalHigherPowerFromPlus", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP002-CAND-006", solveMode: "findReciprocalSquareFromMinus", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP002-CAND-007", solveMode: "findReciprocalCubeFromMinus", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP002-CAND-008", solveMode: "findDifferenceOfSquaresFromSumAndDifference", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP002-CAND-009", solveMode: "findScaledReciprocalSquare", status: "DISCOVERY", permanentQlId: null, answerKind: "RATIONAL", difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
];

export function getAlgCp002Candidate(candidateId: string): AlgCp002Candidate {
  const candidate = ALG_CP002_DISCOVERY_CANDIDATES.find((entry) => entry.candidateId === candidateId);
  if (!candidate) throw new Error(`Unknown ALG-CP-002 discovery candidate: ${candidateId}`);
  return candidate;
}
