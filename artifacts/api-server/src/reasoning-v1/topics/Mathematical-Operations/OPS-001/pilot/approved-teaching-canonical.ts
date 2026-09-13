import {
  OPS_APPROVED_CANDIDATE_IDS,
  generateApprovedOpsQuestion as generateEntryQuestion,
  type ApprovedOpsQuestion,
  type OpsApprovedCandidateId,
} from "./approved-teaching-entry";
import {
  generateAuditMappingCandidate,
  supportsAuditGeneratedMappingCandidate,
} from "./audit-generated-mappings";
import { generateAuditCompoundCandidate } from "./audit-generated-compound";

export { OPS_APPROVED_CANDIDATE_IDS };
export type { ApprovedOpsQuestion, OpsApprovedCandidateId };

export function generateApprovedOpsQuestion(
  candidateId: OpsApprovedCandidateId,
  seed: number,
): ApprovedOpsQuestion {
  if (!Number.isInteger(seed) || seed < 0) {
    throw new Error(`Approved runtime seed must be a non-negative integer; received ${seed}.`);
  }
  if (supportsAuditGeneratedMappingCandidate(candidateId)) {
    return generateAuditMappingCandidate(candidateId, seed);
  }
  if (candidateId === "OPS-CAND-028" || candidateId === "OPS-CAND-029") {
    return generateAuditCompoundCandidate(candidateId, seed);
  }
  return generateEntryQuestion(candidateId, seed);
}
