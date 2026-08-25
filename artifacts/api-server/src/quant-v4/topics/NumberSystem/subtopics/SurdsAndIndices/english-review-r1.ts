import type { SriCheckpointId, SriDiscoveryQuestion } from "./discovery-types";
import { SRI_RETAINED_CONTRACTS_R1, type SriRetainedContractR1 } from "./retained-contracts-r1";
import { generateSriExecutableDiscoveryCandidate } from "./saturation-registry";
import { SRI_R1_UNRESOLVED_SOURCE_GATES } from "./source-gate-resolution-r1";

export interface SriEnglishReviewMemberR1 {
  readonly retainedGroupId: `SRI-RG-${string}`;
  readonly ownerCheckpointId: SriCheckpointId;
  readonly groupTitle: string;
  readonly memberCandidateId: string;
}

export interface SriEnglishReviewRecordR1 extends SriEnglishReviewMemberR1 {
  readonly reviewSeedIndex: number;
  readonly question: SriDiscoveryQuestion;
}

const unresolvedGroupIds = new Set(SRI_R1_UNRESOLVED_SOURCE_GATES.map((item) => item.retainedGroupId));

/**
 * Source-supported retained groups authorised for adversarial English review.
 * This is still pre-permanent authority: no retainedGroupId is a QL or permanent solve-mode ID.
 */
export const SRI_ENGLISH_REVIEW_READY_GROUPS_R1: readonly SriRetainedContractR1[] =
  SRI_RETAINED_CONTRACTS_R1.filter((group) => !unresolvedGroupIds.has(group.retainedGroupId));

/** Held groups remain visible to reviewers but are never counted as freeze-ready. */
export const SRI_ENGLISH_REVIEW_HOLD_GROUPS_R1: readonly SriRetainedContractR1[] =
  SRI_RETAINED_CONTRACTS_R1.filter((group) => unresolvedGroupIds.has(group.retainedGroupId));

/** Review every prototype member that contributed evidence to a retained group. */
export const SRI_ENGLISH_REVIEW_MEMBERS_R1: readonly SriEnglishReviewMemberR1[] =
  SRI_ENGLISH_REVIEW_READY_GROUPS_R1.flatMap((group) =>
    group.memberCandidateIds.map((memberCandidateId) => ({
      retainedGroupId: group.retainedGroupId,
      ownerCheckpointId: group.ownerCheckpointId,
      groupTitle: group.title,
      memberCandidateId,
    })),
  );

export function generateSriEnglishReviewQuestionR1(
  member: SriEnglishReviewMemberR1,
  seedIndex: number,
): SriDiscoveryQuestion {
  if (!Number.isInteger(seedIndex) || seedIndex < 0) throw new Error("English-review seedIndex must be a non-negative integer");
  const seed = `SRI-EN-R1:${member.retainedGroupId}:${member.memberCandidateId}:${seedIndex}`;
  return generateSriExecutableDiscoveryCandidate(member.memberCandidateId, seed);
}

export function buildSriEnglishReviewCorpusR1(seedsPerMember = 3): readonly SriEnglishReviewRecordR1[] {
  if (!Number.isInteger(seedsPerMember) || seedsPerMember < 1) throw new Error("seedsPerMember must be a positive integer");
  return SRI_ENGLISH_REVIEW_MEMBERS_R1.flatMap((member) =>
    Array.from({ length: seedsPerMember }, (_, reviewSeedIndex) => ({
      ...member,
      reviewSeedIndex,
      question: generateSriEnglishReviewQuestionR1(member, reviewSeedIndex),
    })),
  );
}
