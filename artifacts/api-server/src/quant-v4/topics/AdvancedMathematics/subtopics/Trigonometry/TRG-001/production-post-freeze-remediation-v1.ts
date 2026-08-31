import { TRG_001_AUTHORITY_ALIGNED_IDS } from "./production-authority-runtime";
import { generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";

type AnyQuestion = Record<string, any>;

export const TRG_001_POST_FREEZE_REMEDIATION_V1_VERSION =
  "TRG001_POST_FREEZE_REMEDIATION_V1" as const;

export const TRG_001_POST_FREEZE_REMEDIATION_V1_IDS = ["TRG-001-QL-093"] as const;

const QL093_TRAP = "Write 1 as a fraction with the same denominator before combining.";

function applyPostFreezeRemediation(question: AnyQuestion) {
  let remediated = question;

  if (question.qlId === "TRG-001-QL-093") {
    remediated = {
      ...question,
      explanation: {
        ...question.explanation,
        traps: (question.explanation?.traps ?? []).map((trap: unknown) =>
          String(trap ?? "").includes("${t.h}") ? QL093_TRAP : trap,
        ),
      },
    };
  }

  return {
    ...remediated,
    reviewStatus: "POST_FREEZE_REMEDIATION_CANDIDATE_V1" as const,
    humanReviewStatus: "PENDING" as const,
    frozen: false as const,
    freezeEligible: false as const,
    freezeStatus: "NOT_FROZEN" as const,
    questionStudioDiscoverable: false as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
    publicReleaseAuthorized: false as const,
    previousHumanApproval: question.humanReview,
    previousFreeze: question.freeze,
    postFreezeRemediation: {
      version: TRG_001_POST_FREEZE_REMEDIATION_V1_VERSION,
      reason: "LEARNER_FACING_TEMPLATE_PLACEHOLDER_LEAK" as const,
      changedQlIds: [...TRG_001_POST_FREEZE_REMEDIATION_V1_IDS],
      contentChangeRequiresNewHumanApproval: true as const,
      previousFreezeInvalidForThisCandidate: true as const,
      activationAuthorized: false as const,
    },
    humanReview: {
      status: "PENDING" as const,
      previousApprovalNotInherited: true as const,
      requiredBecauseContentChangedAfterFreeze: true as const,
    },
    freeze: {
      status: "NOT_FROZEN" as const,
      previousFreezeNotInherited: true as const,
      newHumanApprovalRequired: true as const,
      activationAuthorized: false as const,
    },
  };
}

export function generatePostFreezeRemediatedTrg001Question(qlId: string, seed: string) {
  if (!TRG_001_AUTHORITY_ALIGNED_IDS.includes(qlId)) {
    throw new Error(`Unknown TRG-001 post-freeze remediation QL ${qlId}`);
  }
  return applyPostFreezeRemediation(generateHumanApprovedTrg001Question(qlId, seed) as AnyQuestion);
}

export function generateAllPostFreezeRemediatedTrg001Questions(seed: string) {
  return TRG_001_AUTHORITY_ALIGNED_IDS.map((qlId) => generatePostFreezeRemediatedTrg001Question(qlId, seed));
}
