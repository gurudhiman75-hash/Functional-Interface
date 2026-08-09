import {
  MEN_CP011_NEIGHBOUR_OWNERSHIP_BOUNDARIES,
  getMenCp011LivePrototypeIds,
  hasAttachedSourceReference,
  hasCompleteDirectSourceEvidence,
  type MenCp011DirectSourceEvidence,
  type MenCp011SourceFamilyGroup,
  type MenCp011SourceReadinessEntry,
} from "./source-normalisation-readiness";
import {
  MEN_CP011_SOURCE_READINESS_ENTRIES_V4,
} from "./source-normalisation-readiness-v4";
import {
  MEN_CP011_DIRECT_SOURCE_REVIEW_CHECK_IDS,
  type MenCp011DirectSourceReviewCheckId,
} from "./direct-source-human-review-batch";

export const MEN_CP011_SOURCE_READINESS_AUTHORITY_V5 =
  "MEN-CP011-DIRECT-SOURCE-NORMALISATION-READINESS-V5" as const;

export const MEN_CP011_AI_PRE_REVIEW_AUTHORITY =
  "MEN-CP011-DIRECT-SOURCE-AI-PRE-REVIEW-V1" as const;

export const MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_AUTHORITY_V2 =
  "MEN-CP011-DIRECT-SOURCE-HUMAN-REVIEW-BATCH-V2" as const;

export type MenCp011AiPreReviewRecommendation =
  | "RETAIN_DIRECT_PENDING_HUMAN_REVIEW"
  | "DOWNGRADE_TO_REPRESENTATION_ONLY";

export interface MenCp011AiPreReviewDecision {
  authority: typeof MEN_CP011_AI_PRE_REVIEW_AUTHORITY;
  prototypeId: string;
  recommendation: MenCp011AiPreReviewRecommendation;
  failedCheckIds: readonly MenCp011DirectSourceReviewCheckId[];
  rationale: string;
  humanApprovalRecorded: false;
}

const DIRECT_CANDIDATE_IDS_V4 = [
  "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME",
  "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS",
  "MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS",
  "MEN-CP011-PROT-COMPLETE-TUBE-SURFACE-AREA",
  "MEN-CP011-PROT-JOINED-CUBES-EXPOSED-AREA",
  "MEN-CP011-PROT-SPHERICAL-SHELL-MATERIAL-VOLUME",
  "MEN-CP011-PROT-HEMISPHERICAL-SHELL-MATERIAL-VOLUME",
  "MEN-CP011-PROT-HOLLOW-CUBOID-MATERIAL-VOLUME",
] as const;

export const MEN_CP011_AI_PRE_REVIEW_DECISIONS: readonly MenCp011AiPreReviewDecision[] = [
  {
    authority: MEN_CP011_AI_PRE_REVIEW_AUTHORITY,
    prototypeId: "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME",
    recommendation: "DOWNGRADE_TO_REPRESENTATION_ONLY",
    failedCheckIds: ["GIVEN_UNKNOWN_CONTRACT_ALIGNED"],
    rationale:
      "R.S. Aggarwal Question 152 asks for hollow-cylinder material volume, but supplies outer girth and wall thickness. The live prototype is explicitly the RADII representation and requires outer and inner radii as givens. The source supports the governing formula, not this exact representation contract.",
    humanApprovalRecorded: false,
  },
  {
    authority: MEN_CP011_AI_PRE_REVIEW_AUTHORITY,
    prototypeId: "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS",
    recommendation: "DOWNGRADE_TO_REPRESENTATION_ONLY",
    failedCheckIds: ["GIVEN_UNKNOWN_CONTRACT_ALIGNED"],
    rationale:
      "R.S. Aggarwal Question 153 asks for tube material volume, but gives internal diameter and wall thickness. The live DIAMETERS prototype requires both external and internal diameters. The exemplar is mathematically relevant but does not align with the recorded given/unknown contract.",
    humanApprovalRecorded: false,
  },
  {
    authority: MEN_CP011_AI_PRE_REVIEW_AUTHORITY,
    prototypeId: "MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS",
    recommendation: "DOWNGRADE_TO_REPRESENTATION_ONLY",
    failedCheckIds: ["GIVEN_UNKNOWN_CONTRACT_ALIGNED"],
    rationale:
      "Questions 152 and 153 both use wall thickness, but neither supplies the live prototype's exact outer-radius-plus-thickness input contract: one gives girth and the other gives internal diameter. They support thickness-based reasoning only at representation level.",
    humanApprovalRecorded: false,
  },
  {
    authority: MEN_CP011_AI_PRE_REVIEW_AUTHORITY,
    prototypeId: "MEN-CP011-PROT-COMPLETE-TUBE-SURFACE-AREA",
    recommendation: "RETAIN_DIRECT_PENDING_HUMAN_REVIEW",
    failedCheckIds: [],
    rationale:
      "Question 151 asks for the whole surface of a hollow pipe. Its decisive surface ledger is the outer curved wall, inner curved wall and both annular ends, exactly matching the live complete-tube target. Diameter/thickness conversion does not change the target or included-face topology.",
    humanApprovalRecorded: false,
  },
  {
    authority: MEN_CP011_AI_PRE_REVIEW_AUTHORITY,
    prototypeId: "MEN-CP011-PROT-JOINED-CUBES-EXPOSED-AREA",
    recommendation: "DOWNGRADE_TO_REPRESENTATION_ONLY",
    failedCheckIds: ["EXEMPLAR_TARGET_MATCHES"],
    rationale:
      "Question 94 requires a ratio between the joined cuboid's surface area and the sum of the original cube surface areas. The live prototype asks for exposed area itself. The contact-face operation is relevant, but the final mathematical target is different.",
    humanApprovalRecorded: false,
  },
  {
    authority: MEN_CP011_AI_PRE_REVIEW_AUTHORITY,
    prototypeId: "MEN-CP011-PROT-SPHERICAL-SHELL-MATERIAL-VOLUME",
    recommendation: "RETAIN_DIRECT_PENDING_HUMAN_REVIEW",
    failedCheckIds: [],
    rationale:
      "Question 226 directly asks for the volume of metal in a hollow spherical ball from external diameter and uniform thickness. The final target and governing outer-sphere-minus-inner-sphere operation match the live family.",
    humanApprovalRecorded: false,
  },
  {
    authority: MEN_CP011_AI_PRE_REVIEW_AUTHORITY,
    prototypeId: "MEN-CP011-PROT-HEMISPHERICAL-SHELL-MATERIAL-VOLUME",
    recommendation: "RETAIN_DIRECT_PENDING_HUMAN_REVIEW",
    failedCheckIds: [],
    rationale:
      "Question 261 directly asks for the volume of steel in a hemispherical bowl from inside radius and uniform thickness. The target and outer-hemisphere-minus-inner-hemisphere operation match the live family.",
    humanApprovalRecorded: false,
  },
  {
    authority: MEN_CP011_AI_PRE_REVIEW_AUTHORITY,
    prototypeId: "MEN-CP011-PROT-HOLLOW-CUBOID-MATERIAL-VOLUME",
    recommendation: "RETAIN_DIRECT_PENDING_HUMAN_REVIEW",
    failedCheckIds: [],
    rationale:
      "Question 46 directly asks for the volume of wood in a covered cuboidal box and the worked solution uses outer cuboid volume minus inner cuboid volume. Inner dimensions plus thickness are an authentic representation of the same non-inverse family.",
    humanApprovalRecorded: false,
  },
] as const;

const DECISION_BY_PROTOTYPE = new Map(
  MEN_CP011_AI_PRE_REVIEW_DECISIONS.map((decision) => [
    decision.prototypeId,
    decision,
  ]),
);

function correctedEvidence(
  evidence: MenCp011DirectSourceEvidence,
  decision: MenCp011AiPreReviewDecision,
): MenCp011DirectSourceEvidence {
  if (decision.recommendation === "RETAIN_DIRECT_PENDING_HUMAN_REVIEW") {
    return {
      ...evidence,
      sourceMatchClassification: "DIRECT_TASK_MATCH",
      sourceMatchRationale: decision.rationale,
      reviewer: null,
      reviewedAt: null,
    };
  }

  return {
    ...evidence,
    sourceMatchClassification: "REPRESENTATION_ONLY_SUPPORT",
    sourceMatchRationale: decision.rationale,
    reviewer: null,
    reviewedAt: null,
  };
}

export const MEN_CP011_SOURCE_READINESS_ENTRIES_V5: readonly MenCp011SourceReadinessEntry[] =
  MEN_CP011_SOURCE_READINESS_ENTRIES_V4.map((entry) => {
    const decision = DECISION_BY_PROTOTYPE.get(entry.prototypeId);
    if (!decision) return entry;

    return {
      ...entry,
      sourceNormalisationStatus: "REFERENCE_ATTACHED_PENDING_REVIEW",
      evidence: correctedEvidence(entry.evidence, decision),
    };
  });

export interface MenCp011DirectSourceHumanReviewRecordV2 {
  authority: typeof MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_AUTHORITY_V2;
  prototypeId: string;
  familyGroup: MenCp011SourceFamilyGroup;
  sourceEvidence: MenCp011DirectSourceEvidence;
  aiPreReviewRecommendation: "RETAIN_DIRECT_PENDING_HUMAN_REVIEW";
  checkResults: Readonly<
    Record<MenCp011DirectSourceReviewCheckId, boolean | null>
  >;
  reviewDecision: "PENDING";
  reviewer: null;
  reviewedAt: null;
  reviewNotes: null;
  permanentQlAllocationBlocked: true;
  publicationBlocked: true;
}

function pendingCheckResults(): Readonly<
  Record<MenCp011DirectSourceReviewCheckId, boolean | null>
> {
  return Object.fromEntries(
    MEN_CP011_DIRECT_SOURCE_REVIEW_CHECK_IDS.map((checkId) => [
      checkId,
      null,
    ]),
  ) as Record<MenCp011DirectSourceReviewCheckId, boolean | null>;
}

export const MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_BATCH_V2: readonly MenCp011DirectSourceHumanReviewRecordV2[] =
  MEN_CP011_SOURCE_READINESS_ENTRIES_V5.filter(
    (entry) =>
      entry.sourceNormalisationStatus === "REFERENCE_ATTACHED_PENDING_REVIEW" &&
      entry.evidence.sourceMatchClassification === "DIRECT_TASK_MATCH",
  ).map((entry) => ({
    authority: MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_AUTHORITY_V2,
    prototypeId: entry.prototypeId,
    familyGroup: entry.familyGroup,
    sourceEvidence: entry.evidence,
    aiPreReviewRecommendation: "RETAIN_DIRECT_PENDING_HUMAN_REVIEW" as const,
    checkResults: pendingCheckResults(),
    reviewDecision: "PENDING" as const,
    reviewer: null,
    reviewedAt: null,
    reviewNotes: null,
    permanentQlAllocationBlocked: true as const,
    publicationBlocked: true as const,
  }));

function countFamilyGroups(entries: readonly MenCp011SourceReadinessEntry[]) {
  const counts = {} as Record<MenCp011SourceFamilyGroup, number>;
  for (const entry of entries) {
    counts[entry.familyGroup] = (counts[entry.familyGroup] ?? 0) + 1;
  }
  return counts;
}

export function auditMenCp011SourceReadinessV5() {
  const livePrototypeIds = getMenCp011LivePrototypeIds();
  const ledgerPrototypeIds = MEN_CP011_SOURCE_READINESS_ENTRIES_V5.map(
    (entry) => entry.prototypeId,
  );
  const attachedEntries = MEN_CP011_SOURCE_READINESS_ENTRIES_V5.filter(
    (entry) => hasAttachedSourceReference(entry.evidence),
  );
  const directEntries = attachedEntries.filter(
    (entry) =>
      entry.evidence.sourceMatchClassification === "DIRECT_TASK_MATCH" &&
      entry.sourceNormalisationStatus === "REFERENCE_ATTACHED_PENDING_REVIEW",
  );
  const representationOnlyEntries = attachedEntries.filter(
    (entry) =>
      entry.evidence.sourceMatchClassification ===
      "REPRESENTATION_ONLY_SUPPORT",
  );
  const normalisedEntries = MEN_CP011_SOURCE_READINESS_ENTRIES_V5.filter(
    (entry) =>
      entry.sourceNormalisationStatus === "DIRECTLY_NORMALISED" &&
      hasCompleteDirectSourceEvidence(entry.evidence),
  );
  const falselyNormalisedEntries = MEN_CP011_SOURCE_READINESS_ENTRIES_V5.filter(
    (entry) =>
      entry.sourceNormalisationStatus === "DIRECTLY_NORMALISED" &&
      !hasCompleteDirectSourceEvidence(entry.evidence),
  );
  const missingEntries = MEN_CP011_SOURCE_READINESS_ENTRIES_V5.filter(
    (entry) => entry.sourceNormalisationStatus === "MISSING_DIRECT_REFERENCE",
  );
  const incompleteAttachedEntries = MEN_CP011_SOURCE_READINESS_ENTRIES_V5.filter(
    (entry) =>
      entry.sourceNormalisationStatus ===
        "REFERENCE_ATTACHED_PENDING_REVIEW" &&
      !hasAttachedSourceReference(entry.evidence),
  );

  return {
    authority: MEN_CP011_SOURCE_READINESS_AUTHORITY_V5,
    inheritedAuthority:
      "MEN-CP011-DIRECT-SOURCE-NORMALISATION-READINESS-V4" as const,
    aiPreReviewAuthority: MEN_CP011_AI_PRE_REVIEW_AUTHORITY,
    humanReviewBatchAuthority:
      MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_AUTHORITY_V2,
    livePrototypeCount: livePrototypeIds.length,
    ledgerPrototypeCount: ledgerPrototypeIds.length,
    uniqueLivePrototypeCount: new Set(livePrototypeIds).size,
    uniqueLedgerPrototypeCount: new Set(ledgerPrototypeIds).size,
    liveAndLedgerSetsMatch:
      livePrototypeIds.length === ledgerPrototypeIds.length &&
      livePrototypeIds.every((prototypeId) =>
        ledgerPrototypeIds.includes(prototypeId),
      ),
    familyGroupCounts: countFamilyGroups(
      MEN_CP011_SOURCE_READINESS_ENTRIES_V5,
    ),
    canonicalOwnerConfirmedCount:
      MEN_CP011_SOURCE_READINESS_ENTRIES_V5.filter(
        (entry) => entry.ownershipStatus === "CANONICAL_OWNER_CONFIRMED",
      ).length,
    executableFormulaAuthorityCount:
      MEN_CP011_SOURCE_READINESS_ENTRIES_V5.filter(
        (entry) =>
          entry.formulaAuthorityStatus ===
          "EXECUTABLE_AND_INDEPENDENTLY_VERIFIED",
      ).length,
    attachedReferenceCount: attachedEntries.length,
    directTaskMatchPendingReviewCount: directEntries.length,
    representationOnlySupportCount: representationOnlyEntries.length,
    directlyNormalisedCount: normalisedEntries.length,
    missingDirectReferenceCount: missingEntries.length,
    incompleteAttachedReferenceCount: incompleteAttachedEntries.length,
    falselyNormalisedCount: falselyNormalisedEntries.length,
    aiPreReviewDecisionCount: MEN_CP011_AI_PRE_REVIEW_DECISIONS.length,
    aiRetainDirectCount: MEN_CP011_AI_PRE_REVIEW_DECISIONS.filter(
      (decision) =>
        decision.recommendation === "RETAIN_DIRECT_PENDING_HUMAN_REVIEW",
    ).length,
    aiDowngradeCount: MEN_CP011_AI_PRE_REVIEW_DECISIONS.filter(
      (decision) =>
        decision.recommendation === "DOWNGRADE_TO_REPRESENTATION_ONLY",
    ).length,
    revisedHumanReviewQueueCount:
      MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_BATCH_V2.length,
    pendingHumanReviewCount:
      MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_BATCH_V2.length,
    approvedHumanReviewCount: 0,
    promotionReadyCount: 0,
    neighbourBoundaryCount: MEN_CP011_NEIGHBOUR_OWNERSHIP_BOUNDARIES.length,
    sourceNormalisationComplete: false,
    permanentQlAllocationAllowed: false,
    publicationEligible: false,
    blockers: [
      "FOUR_DIRECT_SOURCE_CANDIDATES_AWAIT_HUMAN_REVIEW",
      "ELEVEN_LIVE_FAMILIES_STILL_LACK_ATTACHED_REFERENCES",
      "THIRTEEN_REFERENCES_ARE_REPRESENTATION_ONLY",
      "SOURCE_REVIEWER_ATTESTATION_MISSING",
      "PERMANENT_QLS_UNALLOCATED",
      "MANUAL_ENGLISH_REVIEW_PENDING",
      "MULTILINGUAL_PARITY_PENDING",
    ] as const,
  };
}

export function getMenCp011V4DirectCandidateIds() {
  return [...DIRECT_CANDIDATE_IDS_V4];
}
