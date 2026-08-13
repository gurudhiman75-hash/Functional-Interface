import {
  buildRnkCp006ProductionCandidate,
  rnkCp006ProductionCandidateProjectionSha256,
  type RnkCp006ProductionCandidateQuestion,
} from "./cp006-production-candidate-v1";

export const RNK_CP006_PINNED_PRODUCTION_CANDIDATE_PROJECTION_SHA256 =
  "3b26204b7137910d3247af37c75934680ea34cd86b5f342b55de2012e057fd00" as const;

export const RNK_CP006_PINNED_PRODUCTION_CANDIDATE_VERSION =
  "RNK_CP006_PRODUCTION_CANDIDATE_PINNED_V1" as const;

export type RnkCp006PinnedProductionCandidateQuestion = Omit<
  RnkCp006ProductionCandidateQuestion,
  "candidateProfile"
> & {
  readonly candidateProfile: Omit<
    RnkCp006ProductionCandidateQuestion["candidateProfile"],
    "projectionDigestPinned"
  > & {
    readonly projectionDigestPinned: true;
  };
};

export function buildRnkCp006PinnedProductionCandidate(): readonly RnkCp006PinnedProductionCandidateQuestion[] {
  const source = buildRnkCp006ProductionCandidate();
  const digest = rnkCp006ProductionCandidateProjectionSha256(source);
  if (digest !== RNK_CP006_PINNED_PRODUCTION_CANDIDATE_PROJECTION_SHA256) {
    throw new Error(
      `CP006 production candidate projection drifted: ${digest} != ${RNK_CP006_PINNED_PRODUCTION_CANDIDATE_PROJECTION_SHA256}`,
    );
  }

  return source.map((question) => ({
    ...question,
    candidateProfile: {
      ...question.candidateProfile,
      projectionDigestPinned: true,
    },
  }));
}
