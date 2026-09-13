import {
  OPS_APPROVED_CANDIDATE_IDS,
  generateApprovedOpsQuestion as generateEntryQuestion,
  type ApprovedOpsQuestion,
  type OpsApprovedCandidateId,
} from "./approved-teaching-entry";
import { generateAuditArbitraryCandidate } from "./audit-generated-arbitrary";
import {
  generateAuditMappingCandidate,
  supportsAuditGeneratedMappingCandidate,
} from "./audit-generated-mappings";
import {
  generateAuditInterchangeCandidate,
  supportsAuditGeneratedInterchangeCandidate,
} from "./audit-generated-interchange";
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
  if (candidateId === "OPS-CAND-004" || candidateId === "OPS-CAND-007") {
    return generateAuditArbitraryCandidate(candidateId, seed);
  }
  if (supportsAuditGeneratedMappingCandidate(candidateId)) {
    return generateAuditMappingCandidate(candidateId, seed);
  }
  if (supportsAuditGeneratedInterchangeCandidate(candidateId)) {
    return generateAuditInterchangeCandidate(candidateId, seed);
  }
  if (candidateId === "OPS-CAND-028" || candidateId === "OPS-CAND-029") {
    return generateAuditCompoundCandidate(candidateId, seed);
  }
  return generateEntryQuestion(candidateId, seed);
}
