import type { SriDiscoveryQuestion } from "./discovery-types";
import { generateSriExecutableDiscoveryCandidate } from "./saturation-registry";
import {
  SRI_PERMANENT_ALLOCATION_V1,
  type SriPermanentQlId,
  type SriPermanentSolveModeId,
} from "./permanent-allocation-v1";

export interface SriPermanentEnglishReviewMemberV1 {
  readonly qlId: SriPermanentQlId;
  readonly solveModeId: SriPermanentSolveModeId;
  readonly packageId: "SRI-001" | "SRI-002";
  readonly checkpointId: SriDiscoveryQuestion["checkpointId"];
  readonly retainedGroupId: `SRI-RG-${string}`;
  readonly qlTitle: string;
  readonly memberCandidateId: string;
}

export interface SriPermanentEnglishReviewRecordV1 extends SriPermanentEnglishReviewMemberV1 {
  readonly reviewSeedIndex: number;
  readonly question: SriDiscoveryQuestion;
}

/** Every prototype ancestry member remains review-visible after permanent compression. */
export const SRI_PERMANENT_ENGLISH_REVIEW_MEMBERS_V1: readonly SriPermanentEnglishReviewMemberV1[] =
  SRI_PERMANENT_ALLOCATION_V1.flatMap((allocation) =>
    allocation.memberCandidateIds.map((memberCandidateId) => ({
      qlId: allocation.qlId,
      solveModeId: allocation.solveModeId,
      packageId: allocation.packageId,
      checkpointId: allocation.checkpointId,
      retainedGroupId: allocation.retainedGroupId,
      qlTitle: allocation.title,
      memberCandidateId,
    })),
  );

export function generateSriPermanentEnglishReviewQuestionV1(
  member: SriPermanentEnglishReviewMemberV1,
  seedIndex: number,
): SriDiscoveryQuestion {
  if (!Number.isInteger(seedIndex) || seedIndex < 0) {
    throw new Error("Permanent English-review seedIndex must be a non-negative integer");
  }
  const seed = `SRI-PERM-EN-V1:${member.qlId}:${member.memberCandidateId}:${seedIndex}`;
  return generateSriExecutableDiscoveryCandidate(member.memberCandidateId, seed);
}

export function buildSriPermanentEnglishReviewCorpusV1(
  seedsPerMember = 2,
): readonly SriPermanentEnglishReviewRecordV1[] {
  if (!Number.isInteger(seedsPerMember) || seedsPerMember < 1) {
    throw new Error("seedsPerMember must be a positive integer");
  }
  return SRI_PERMANENT_ENGLISH_REVIEW_MEMBERS_V1.flatMap((member) =>
    Array.from({ length: seedsPerMember }, (_, reviewSeedIndex) => ({
      ...member,
      reviewSeedIndex,
      question: generateSriPermanentEnglishReviewQuestionV1(member, reviewSeedIndex),
    })),
  );
}
