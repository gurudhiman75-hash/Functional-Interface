import {
  hasCompleteDirectSourceEvidence,
  type MenCp011DirectSourceEvidence,
  type MenCp011SourceFamilyGroup,
} from "./source-normalisation-readiness";
import {
  MEN_CP011_SOURCE_READINESS_ENTRIES_V4,
  auditMenCp011SourceReadinessV4,
} from "./source-normalisation-readiness-v4";

export const MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_AUTHORITY =
  "MEN-CP011-DIRECT-SOURCE-HUMAN-REVIEW-BATCH-V1" as const;

export const MEN_CP011_DIRECT_SOURCE_REVIEW_CHECK_IDS = [
  "SOURCE_LOCATOR_RESOLVES",
  "EXEMPLAR_TARGET_MATCHES",
  "GOVERNING_OPERATION_MATCHES",
  "GIVEN_UNKNOWN_CONTRACT_ALIGNED",
  "CANONICAL_OWNERSHIP_CONFIRMED",
  "EXAM_REPRESENTATION_APPROPRIATE",
] as const;

export type MenCp011DirectSourceReviewCheckId =
  (typeof MEN_CP011_DIRECT_SOURCE_REVIEW_CHECK_IDS)[number];

export type MenCp011DirectSourceReviewDecision =
  | "PENDING"
  | "APPROVED"
  | "NEEDS_CORRECTION"
  | "REJECTED";

export interface MenCp011DirectSourceReviewCheckDefinition {
  checkId: MenCp011DirectSourceReviewCheckId;
  prompt: string;
  rejectionRule: string;
}

export const MEN_CP011_DIRECT_SOURCE_REVIEW_CHECKS: readonly MenCp011DirectSourceReviewCheckDefinition[] = [
  {
    checkId: "SOURCE_LOCATOR_RESOLVES",
    prompt:
      "Open the recorded edition and confirm that the page, question/example and immutable extract locators resolve to the stated source content.",
    rejectionRule:
      "Reject or correct the candidate when any edition, page, question or extract locator is missing, unstable or points to different content.",
  },
  {
    checkId: "EXEMPLAR_TARGET_MATCHES",
    prompt:
      "Confirm that the source asks for the same final mathematical quantity as the live MEN-CP-011 prototype.",
    rejectionRule:
      "Representation-only similarity is insufficient; reject direct normalisation when the source asks for another target.",
  },
  {
    checkId: "GOVERNING_OPERATION_MATCHES",
    prompt:
      "Confirm that the decisive source operation or surface ledger is the same operation used by the live prototype.",
    rejectionRule:
      "Reject when the source is solved by a neighbouring operation such as recasting, generic removal, direct intact-solid measurement or a different included-surface ledger.",
  },
  {
    checkId: "GIVEN_UNKNOWN_CONTRACT_ALIGNED",
    prompt:
      "Confirm that the source given/unknown structure supports the prototype contract rather than merely mentioning the same shape.",
    rejectionRule:
      "Reject or downgrade to representation-only support when the decisive unknown, required inverse or included faces differ materially.",
  },
  {
    checkId: "CANONICAL_OWNERSHIP_CONFIRMED",
    prompt:
      "Confirm that the exemplar belongs to MEN-CP-011 after applying the recorded MEN-CP-007/008/009/010/012/013 boundaries.",
    rejectionRule:
      "Reject direct normalisation when the exemplar is canonically owned by a neighbouring problem.",
  },
  {
    checkId: "EXAM_REPRESENTATION_APPROPRIATE",
    prompt:
      "Confirm that the source is a legitimate competitive-exam representation for the intended SSC/banking/state-exam pool.",
    rejectionRule:
      "Reject publication authority when the match is formula-only, artificial, misleading or unsuitable for the intended exam level.",
  },
] as const;

export interface MenCp011DirectSourceHumanReviewRecord {
  authority: typeof MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_AUTHORITY;
  prototypeId: string;
  familyGroup: MenCp011SourceFamilyGroup;
  sourceEvidence: MenCp011DirectSourceEvidence;
  reviewDecision: MenCp011DirectSourceReviewDecision;
  checkResults: Readonly<
    Record<MenCp011DirectSourceReviewCheckId, boolean | null>
  >;
  reviewer: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
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

const DIRECT_TASK_ENTRIES = MEN_CP011_SOURCE_READINESS_ENTRIES_V4.filter(
  (entry) =>
    entry.sourceNormalisationStatus === "REFERENCE_ATTACHED_PENDING_REVIEW" &&
    entry.evidence.sourceMatchClassification === "DIRECT_TASK_MATCH",
);

export const MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_BATCH: readonly MenCp011DirectSourceHumanReviewRecord[] =
  DIRECT_TASK_ENTRIES.map((entry) => ({
    authority: MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_AUTHORITY,
    prototypeId: entry.prototypeId,
    familyGroup: entry.familyGroup,
    sourceEvidence: entry.evidence,
    reviewDecision: "PENDING" as const,
    checkResults: pendingCheckResults(),
    reviewer: null,
    reviewedAt: null,
    reviewNotes: null,
    permanentQlAllocationBlocked: true as const,
    publicationBlocked: true as const,
  }));

export function hasCompleteMenCp011HumanSourceReview(
  record: MenCp011DirectSourceHumanReviewRecord,
) {
  return Boolean(
    record.reviewDecision === "APPROVED" &&
      record.reviewer?.trim() &&
      record.reviewedAt?.trim() &&
      record.reviewNotes?.trim() &&
      MEN_CP011_DIRECT_SOURCE_REVIEW_CHECK_IDS.every(
        (checkId) => record.checkResults[checkId] === true,
      ),
  );
}

export function canPromoteMenCp011DirectSourceCandidate(
  record: MenCp011DirectSourceHumanReviewRecord,
) {
  if (!hasCompleteMenCp011HumanSourceReview(record)) return false;

  return hasCompleteDirectSourceEvidence({
    ...record.sourceEvidence,
    reviewer: record.reviewer,
    reviewedAt: record.reviewedAt,
  });
}

export function auditMenCp011DirectSourceHumanReviewBatch() {
  const sourceAudit = auditMenCp011SourceReadinessV4();
  const prototypeIds = MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_BATCH.map(
    (record) => record.prototypeId,
  );
  const representationOnlyIds = new Set(
    MEN_CP011_SOURCE_READINESS_ENTRIES_V4.filter(
      (entry) =>
        entry.evidence.sourceMatchClassification ===
        "REPRESENTATION_ONLY_SUPPORT",
    ).map((entry) => entry.prototypeId),
  );
  const approvedRecords = MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_BATCH.filter(
    (record) => record.reviewDecision === "APPROVED",
  );
  const promotionReadyRecords = MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_BATCH.filter(
    canPromoteMenCp011DirectSourceCandidate,
  );
  const representationOnlyLeakIds = prototypeIds.filter((prototypeId) =>
    representationOnlyIds.has(prototypeId),
  );

  return {
    authority: MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_AUTHORITY,
    inheritedSourceAuthority: sourceAudit.authority,
    livePrototypeCount: sourceAudit.livePrototypeCount,
    attachedReferenceCount: sourceAudit.attachedReferenceCount,
    directTaskCandidateCount: sourceAudit.directTaskMatchPendingReviewCount,
    representationOnlySupportCount:
      sourceAudit.representationOnlySupportCount,
    missingDirectReferenceCount: sourceAudit.missingDirectReferenceCount,
    reviewBatchRecordCount:
      MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_BATCH.length,
    uniqueReviewBatchRecordCount: new Set(prototypeIds).size,
    pendingReviewCount:
      MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_BATCH.filter(
        (record) => record.reviewDecision === "PENDING",
      ).length,
    approvedReviewCount: approvedRecords.length,
    promotionReadyCount: promotionReadyRecords.length,
    representationOnlyLeakCount: representationOnlyLeakIds.length,
    representationOnlyLeakIds,
    directlyNormalisedCount: sourceAudit.directlyNormalisedCount,
    allDirectCandidatesIncluded:
      prototypeIds.length === sourceAudit.directTaskMatchPendingReviewCount,
    humanReviewComplete:
      promotionReadyRecords.length ===
        sourceAudit.directTaskMatchPendingReviewCount &&
      sourceAudit.directTaskMatchPendingReviewCount > 0,
    permanentQlAllocationAllowed: false,
    publicationEligible: false,
    blockers: [
      "EIGHT_DIRECT_SOURCE_CANDIDATES_AWAIT_HUMAN_REVIEW",
      "ELEVEN_LIVE_FAMILIES_STILL_LACK_DIRECT_REFERENCES",
      "REPRESENTATION_ONLY_REFERENCES_CANNOT_BE_PROMOTED",
      "PERMANENT_QLS_UNALLOCATED",
      "MANUAL_ENGLISH_REVIEW_PENDING",
      "MULTILINGUAL_PARITY_PENDING",
    ] as const,
  };
}
