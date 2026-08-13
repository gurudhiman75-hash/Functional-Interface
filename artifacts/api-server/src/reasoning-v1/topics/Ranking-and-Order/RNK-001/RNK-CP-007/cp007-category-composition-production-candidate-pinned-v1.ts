import {
  buildRnkCp007CategoryCompositionProductionCandidate,
  rnkCp007CategoryCompositionCandidateProjectionSha256,
  type RnkCp007CategoryCompositionCandidateQuestion,
} from "./cp007-category-composition-production-candidate-v1";

export const RNK_CP007_CATEGORY_COMPOSITION_PINNED_CANDIDATE_VERSION =
  "RNK_CP007_CATEGORY_COMPOSITION_PINNED_CANDIDATE_V1" as const;

export const RNK_CP007_CATEGORY_COMPOSITION_PINNED_CANDIDATE_PROJECTION_SHA256 =
  "63e8cc87812f1ec4546d23829022f333736a03c5e9aa8142384bcab15817dc94" as const;

export type RnkCp007PinnedCategoryCompositionQuestion =
  RnkCp007CategoryCompositionCandidateQuestion & {
    readonly candidateProjectionPinned: true;
  };

export function buildRnkCp007PinnedCategoryCompositionCandidate(): readonly RnkCp007PinnedCategoryCompositionQuestion[] {
  const source = buildRnkCp007CategoryCompositionProductionCandidate();
  const digest = rnkCp007CategoryCompositionCandidateProjectionSha256(source);
  if (digest !== RNK_CP007_CATEGORY_COMPOSITION_PINNED_CANDIDATE_PROJECTION_SHA256) {
    throw new Error(
      `CP007 category candidate projection drifted: ${digest} != ${RNK_CP007_CATEGORY_COMPOSITION_PINNED_CANDIDATE_PROJECTION_SHA256}`,
    );
  }
  return source.map((question) => ({ ...question, candidateProjectionPinned: true }));
}
