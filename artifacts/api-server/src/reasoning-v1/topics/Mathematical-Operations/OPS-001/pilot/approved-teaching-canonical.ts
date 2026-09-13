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

function restoreApprovedTeachingInvariants(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  if (question.candidateId === "OPS-CAND-008") {
    return {
      ...question,
      explanation: {
        ...question.explanation,
        steps: [
          {
            label: "Read the meaning key",
            expression: "A → +; B → =; C → >; D → <",
            result: "Use the complete replacement key before checking any option.",
          },
          ...question.explanation.steps,
        ],
      },
    };
  }

  if (
    question.candidateId === "OPS-CAND-023" &&
    !question.explanation.conclusion.includes(question.answer)
  ) {
    return {
      ...question,
      explanation: {
        ...question.explanation,
        conclusion: `${question.explanation.conclusion} Required interchange: ${question.answer}.`,
      },
    };
  }

  return question;
}

export function generateApprovedOpsQuestion(
  candidateId: OpsApprovedCandidateId,
  seed: number,
): ApprovedOpsQuestion {
  if (!Number.isInteger(seed) || seed < 0) {
    throw new Error(`Approved runtime seed must be a non-negative integer; received ${seed}.`);
  }

  let question: ApprovedOpsQuestion;
  if (candidateId === "OPS-CAND-004" || candidateId === "OPS-CAND-007") {
    question = generateAuditArbitraryCandidate(candidateId, seed);
  } else if (supportsAuditGeneratedMappingCandidate(candidateId)) {
    question = generateAuditMappingCandidate(candidateId, seed);
  } else if (supportsAuditGeneratedInterchangeCandidate(candidateId)) {
    question = generateAuditInterchangeCandidate(candidateId, seed);
  } else if (candidateId === "OPS-CAND-028" || candidateId === "OPS-CAND-029") {
    question = generateAuditCompoundCandidate(candidateId, seed);
  } else {
    question = generateEntryQuestion(candidateId, seed);
  }

  const normalized = restoreApprovedTeachingInvariants(question);
  return normalized.seed === seed ? normalized : { ...normalized, seed };
}
