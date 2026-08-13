import { canonicalDigest } from "../canonical.ts";
import type { AuditCaselet } from "../saturation/corpus.ts";
import {
  sea001ReviewContentFingerprint,
  type Sea001ManualReviewEntry,
} from "./manual-review.ts";

export const SEA001_APPROVED_REVIEW = {
  reviewerId: "gurudhiman75-hash",
  reviewedAt: "2026-08-13T07:56:00+05:30",
  approvalSource: "Project owner approval in ChatGPT after review of the final 100-caselet plain-teacher English artifact.",
  artifactName: "sea-001-english-review-100-plain-teacher-final",
  artifactSha256: "68972a48f078118b45fffbd69e6552b66c71a2373df741e678270de3657f29cf",
  approvedReviewFingerprint: "e3a4bdcd5c3afb656bed4a695e50f2f4218e45907647e23d8c733feffb59ca22",
} as const;

export function buildApprovedSea001ManualReviewLedger(
  reviewCorpus: readonly AuditCaselet[],
): readonly Sea001ManualReviewEntry[] {
  const currentReviewFingerprint = canonicalDigest(reviewCorpus.map((caselet) => ({
    caseletId: caselet.caseletId,
    contentFingerprint: sea001ReviewContentFingerprint(caselet),
  })));

  if (currentReviewFingerprint !== SEA001_APPROVED_REVIEW.approvedReviewFingerprint) {
    throw new Error(
      `SEA-001 signed review is stale: approved=${SEA001_APPROVED_REVIEW.approvedReviewFingerprint}, current=${currentReviewFingerprint}`,
    );
  }

  return reviewCorpus.map((caselet) => ({
    caseletId: caselet.caseletId,
    checkpointId: caselet.checkpointId,
    blueprintAuthorityId: caselet.blueprintAuthorityId,
    contentFingerprint: sea001ReviewContentFingerprint(caselet),
    decision: "ACCEPT",
    reviewerId: SEA001_APPROVED_REVIEW.reviewerId,
    reviewedAt: SEA001_APPROVED_REVIEW.reviewedAt,
    notes: "Approved as part of the final 100-caselet plain-teacher English review.",
  }));
}
