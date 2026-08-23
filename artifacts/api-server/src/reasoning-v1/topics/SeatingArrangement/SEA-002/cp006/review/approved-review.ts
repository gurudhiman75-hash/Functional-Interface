import { cp006EnglishReviewFingerprint, cp006ReviewContentFingerprint } from "../cp006-review-corpus.ts";
import type { Sea002Cp006Caselet } from "../types.ts";

export const SEA002_CP006_PREVIOUS_APPROVED_REVIEW = Object.freeze({
  reviewerId: "gurudhiman75-hash",
  reviewedAt: "2026-08-22T15:37:00+05:30",
  approvalSource: "Project owner approval in ChatGPT immediately after review of the original CP006 100-caselet position-wording artifact.",
  artifactName: "cp006-english-review-100",
  artifactId: 9474071929,
  artifactSha256: "7e37d79da61f4b4edca8601e353cd1cf4b8fc1b85fa427dfd89591fa7f747ccc",
  approvedReviewFingerprint: "07216e2a08c198266bd25e40484a477d5c6e4de73b2dae06b8235fc3773a0c3e",
  decision: "100_ACCEPT_0_REWRITE_0_REJECT",
  supersededByEditorialErrata: true as const,
} as const);

export const SEA002_CP006_APPROVED_REVIEW = Object.freeze({
  reviewerId: "gurudhiman75-hash",
  reviewedAt: "2026-08-22T17:32:00+05:30",
  approvalSource: "Project owner explicit approval in ChatGPT immediately after the CI-pinned corrected CP006 100-caselet artifact, fingerprint, artifact ID and ZIP digest were presented.",
  artifactName: "cp006-english-review-100",
  artifactId: 9474796937,
  artifactSha256: "df6636920226295a3f7486c3b753f6a03f6f0aa28e309b4c2530f5eed9fb99e7",
  approvedReviewFingerprint: "21e815257a510a943092cffb69f3c5f44222c7e332ffe171e36eadbca0b83621",
  decision: "100_ACCEPT_0_REWRITE_0_REJECT",
  replacesPreviousApprovalAfterEditorialErrata: true as const,
} as const);

export interface Sea002Cp006ApprovedReviewEntry {
  readonly caseletId: string;
  readonly checkpointId: "SEA-CP-006";
  readonly blueprintAuthorityId: string;
  readonly contentFingerprint: string;
  readonly decision: "ACCEPT";
  readonly reviewerId: string;
  readonly reviewedAt: string;
  readonly notes: string;
}

export function buildApprovedCp006ReviewLedger(
  reviewCorpus: readonly Sea002Cp006Caselet[],
): readonly Sea002Cp006ApprovedReviewEntry[] {
  const currentReviewFingerprint = cp006EnglishReviewFingerprint(reviewCorpus);
  if (currentReviewFingerprint !== SEA002_CP006_APPROVED_REVIEW.approvedReviewFingerprint) {
    throw new Error(
      `SEA-002 CP006 signed review is stale: approved=${SEA002_CP006_APPROVED_REVIEW.approvedReviewFingerprint}, current=${currentReviewFingerprint}`,
    );
  }

  return Object.freeze(reviewCorpus.map((caselet) => Object.freeze({
    caseletId: caselet.caseletId,
    checkpointId: "SEA-CP-006" as const,
    blueprintAuthorityId: caselet.blueprintAuthorityId,
    contentFingerprint: cp006ReviewContentFingerprint(caselet),
    decision: "ACCEPT" as const,
    reviewerId: SEA002_CP006_APPROVED_REVIEW.reviewerId,
    reviewedAt: SEA002_CP006_APPROVED_REVIEW.reviewedAt,
    notes: "Approved as part of the exact corrected 100-caselet CP006 English review artifact after the self-reference rationale errata pass.",
  })));
}
