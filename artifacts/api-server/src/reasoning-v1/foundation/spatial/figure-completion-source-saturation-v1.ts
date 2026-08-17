import {
  FGC_001_CANDIDATE_AUTHORITIES_V1,
  FGC_001_EXECUTABLE_PROTOTYPES_V1,
} from "./figure-completion-merge-split-proposal-v1";

export const FGC_001_SOURCE_SATURATION_AUTHORITY_V1 = {
  version: "FGC-001-SOURCE-SATURATION-V1" as const,
  chapterCode: "FGC-001" as const,
  status: "READY_FOR_SCOPED_PERMANENT_QL_PROPOSAL" as const,
  humanReviewedAuthority: {
    headSha: "1c14d6b54b53622c09285436fec50ded0ecae22e" as const,
    workflowRunId: 32007652999,
    artifactId: 9280591062,
    artifactDigest: "sha256:f1237905665b9b19ffce00efdf5990b56c3e2c5c8546a6e3d6f9cd3dbacab3dc" as const,
    learnerReviewQuestionCount: 80,
    generatedQuestionProofCount: 800,
    mobileReviewApproxOptionPx: 104,
    directHumanVerdict: "NO_REMAINING_LEARNER_VISIBLE_BLOCKER" as const,
  },
  taxonomy: {
    executablePrototypeCount: FGC_001_EXECUTABLE_PROTOTYPES_V1.length,
    candidateAuthorityCount: FGC_001_CANDIDATE_AUTHORITIES_V1.length,
    permanentQlCountAtThisGate: 0,
    knownExecutableRepresentationGaps: 0,
    fifthReasoningIdentityFoundInControlledSscExpansion: false,
    antiDuplicationDecision: "TEN_EXECUTABLE_PROTOTYPES_COMPRESS_TO_FOUR_REASONING_AUTHORITIES" as const,
  },
  sourceScope: {
    SSC: {
      status: "CONTROLLED_TAXONOMY_SATURATED_FOR_CURRENT_FGC_SCOPE" as const,
      directFamiliesCovered: [
        "stroke/path/junction/contour continuity",
        "marker placement and local feature recovery",
        "component count plus orientation",
        "quadrant geometric symmetry",
        "arc/quarter-circle symmetry representation",
        "mirror plus black/white state reversal",
        "shape/contact/fill/vertical-flip compound state",
      ] as const,
      anchors: [
        "SSC CGL 2017: cross-line/local structural completion",
        "SSC MTS 2017: dot/marker placement and three-circles-plus-opposite-arrows completion",
        "SSC MTS 2024: mirror relation plus black/white reversal",
        "SSC GD 2024: shape class, shaded/non-shaded contact and vertical-flip distractors",
        "SSC CHSL 2025: parallel-line and quarter-circle/arc quadrant completion",
      ] as const,
      claimBoundary: "Saturation applies to the controlled FGC reasoning taxonomy, not to every historical SSC image representation." as const,
    },
    Banking: {
      status: "NOT_ESTABLISHED_FOR_FGC_001" as const,
      note: "Search results contained figure-matrix/missing-figure material but did not establish a controlled FGC previous-paper authority suitable for taxonomy claims." as const,
    },
    PunjabState: {
      status: "DIRECT_FGC_EVIDENCE_PRESENT_RULE_CLASSIFICATION_PENDING" as const,
      anchors: [
        "Punjab Police Constable Official Paper-I & II, 07-Aug-2024 Shift 1: direct Completion of Incomplete Pattern question; Option 2 recorded correct.",
        "Additional Punjab Police Constable 2024 shifts contain direct choose-the-option-to-complete-the-pattern questions.",
      ] as const,
      note: "The parsed source exposes the question/exam/answer but not enough image semantics to assign the Punjab item to one of the four rule authorities without guessing." as const,
    },
  },
  permanentQlProposal: {
    allowed: true,
    proposedCount: 4,
    proposedFirstCoordinate: "SPA-QL-031" as const,
    allocationNotYetApplied: true,
    requiredRule: "Allocate by reasoning authority, never one permanent QL per visual prototype." as const,
  },
  lifecycle: {
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    multilingualStarted: false,
  },
} as const;
