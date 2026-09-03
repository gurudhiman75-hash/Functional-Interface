import { ARG_CP009_CHECKPOINT_ID, ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY } from "./cp009-english-remediated-templates.ts";
import { ARG_CP009_LOCALIZATION_AUTHORITY_V2 } from "./cp009-localized-remediated-templates-v2.ts";
import { ARG_CP010_AUTHORITY, ARG_CP010_CHECKPOINT_ID } from "./cp010-correlated-real-paper-generator.ts";
import {
  ARG_CP010_QUESTION_STUDIO_AUTHORITY,
  ARG_CP010_REVIEW_STATUS,
  ARG_CP010_RUNTIME_MODE,
} from "./cp010-question-studio-adapter.ts";
import { ARG_QL_IDS } from "./types.ts";

export const ARG_CP011_CHECKPOINT_ID = "ARG-CP-011" as const;
export const ARG_CP011_SUPERSEDING_FREEZE_AUTHORITY = "ARG_CP011_POST_REMEDIATION_SUPERSEDING_FREEZE_V1" as const;
export const ARG_CP011_AUDIT_STATUS = "TECHNICAL_RELEASE_READY_MANUAL_EDITORIAL_APPROVAL_REQUIRED" as const;

/**
 * CP011 supersedes the release decision of the post-CP008 audit without
 * rewriting CP003/CP006/CP008. Those checkpoints remain immutable historical
 * evidence. Current generation authority is CP009 for ordinary Question Studio
 * review and CP010 for correlated real-paper review.
 */
export const ARG_CP011_SUPERSEDING_FREEZE = Object.freeze({
  checkpointId: ARG_CP011_CHECKPOINT_ID,
  authority: ARG_CP011_SUPERSEDING_FREEZE_AUTHORITY,
  packageId: "ARG-001" as const,
  chapter: "Statement & Arguments" as const,
  auditStatus: ARG_CP011_AUDIT_STATUS,
  supersedesReleaseDecisionAfter: "ARG-CP-008" as const,
  doesNotRewriteHistoricalAuthorities: Object.freeze([
    "ARG-CP-003",
    "ARG-CP-006",
    "ARG-CP-008",
  ] as const),
  currentAuthorities: Object.freeze({
    coreCheckpointId: ARG_CP009_CHECKPOINT_ID,
    english: ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY,
    localization: ARG_CP009_LOCALIZATION_AUTHORITY_V2,
    realPaperCheckpointId: ARG_CP010_CHECKPOINT_ID,
    realPaper: ARG_CP010_AUTHORITY,
    questionStudio: ARG_CP010_QUESTION_STUDIO_AUTHORITY,
    runtimeMode: ARG_CP010_RUNTIME_MODE,
    reviewStatus: ARG_CP010_REVIEW_STATUS,
  }),
  coverage: Object.freeze({
    permanentQlIds: ARG_QL_IDS,
    permanentQlCount: ARG_QL_IDS.length,
    languages: Object.freeze(["en", "hi", "pa"] as const),
    difficulties: Object.freeze(["Easy", "Medium", "Hard"] as const),
    englishExhaustiveSurfaceCount: 12_288,
    localizedExhaustiveSurfaceCount: 24_576,
    totalExhaustivelyProvedCoreSurfaces: 36_864,
    correlatedRealPaperRemediationRequired: true as const,
    deterministicGenerationRequired: true as const,
    registryPrecedenceRequired: true as const,
  }),
  lifecycle: Object.freeze({
    reviewOnly: true as const,
    questionStudioVisible: true as const,
    manualEditorialApprovalRequired: true as const,
    separateLearnerReleaseApprovalRequired: true as const,
    persistenceAllowed: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    learnerRelease: "LOCKED_PENDING_MANUAL_EDITORIAL_APPROVAL" as const,
  }),
  reopeningRule: Object.freeze([
    "A proven semantic, answer-authority, localization, explanation, exam-realness or presentation defect in the CP009/CP010 remediated path.",
    "A regression in deterministic QL × difficulty × language coverage or correlated real-paper generation.",
    "A routing regression that allows historical CP005/CP007 generation to precede the CP010 current Question Studio authority.",
    "A mutation that invalidates the preserved CP006 or CP008 historical freeze evidence.",
    "Any change that weakens persistence, Question Bank, test, mock-test, public-publication or automatic learner-publication locks without a separate approved learner-release checkpoint.",
  ]),
} as const);
