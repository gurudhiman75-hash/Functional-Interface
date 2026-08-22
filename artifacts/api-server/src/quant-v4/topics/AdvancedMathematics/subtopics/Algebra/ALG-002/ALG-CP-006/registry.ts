import type { AlgCp006Candidate } from "./types";

export const ALG_CP006_DISCOVERY_CANDIDATES: AlgCp006Candidate[] = [
  { candidateId: "ALG-CP006-CAND-001", solveMode: "solveAxPlusBEqualsC", status: "DISCOVERY", permanentQlId: null, difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP006-CAND-002", solveMode: "solveVariableOnBothSides", status: "DISCOVERY", permanentQlId: null, difficulty: "Easy", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP006-CAND-003", solveMode: "solveEquationWithBrackets", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP006-CAND-004", solveMode: "solveEquationWithFractionalCoefficient", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP006-CAND-005", solveMode: "classifyNoSolutionLinearEquation", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP006-CAND-006", solveMode: "classifyInfiniteSolutionLinearEquation", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
  { candidateId: "ALG-CP006-CAND-007", solveMode: "findParameterForKnownLinearSolution", status: "DISCOVERY", permanentQlId: null, difficulty: "Medium", sourceStatus: "UNVERIFIED_DRAFT" },
];

export function getAlgCp006Candidate(candidateId: string): AlgCp006Candidate {
  const candidate = ALG_CP006_DISCOVERY_CANDIDATES.find((entry) => entry.candidateId === candidateId);
  if (!candidate) throw new Error(`Unknown ALG-CP-006 discovery candidate: ${candidateId}`);
  return candidate;
}
