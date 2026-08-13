import {
  buildRnkCp005PermanentRuntimeCandidate,
  rnkCp005PermanentRuntimeCandidateProjectionSha256,
  type RnkCp005PermanentRuntimeCandidateQuestion,
} from "./cp005-permanent-runtime-candidate-v1";

export const RNK_CP005_PINNED_PERMANENT_RUNTIME_CANDIDATE_PROJECTION_SHA256 =
  "c45517d1d8bf4283d38eb4b62d1c9e2f90c5ec58593e2c400a59b2a26fb6e71e" as const;

export type RnkCp005PinnedPermanentRuntimeCandidateQuestion =
  RnkCp005PermanentRuntimeCandidateQuestion & {
    readonly candidateRuntimeProfile: RnkCp005PermanentRuntimeCandidateQuestion["candidateRuntimeProfile"] & {
      readonly projectionDigestPinned: true;
    };
  };

export function buildRnkCp005PinnedPermanentRuntimeCandidate(): readonly RnkCp005PinnedPermanentRuntimeCandidateQuestion[] {
  const runtime = buildRnkCp005PermanentRuntimeCandidate();
  const projectionSha256 = rnkCp005PermanentRuntimeCandidateProjectionSha256(runtime);
  if (projectionSha256 !== RNK_CP005_PINNED_PERMANENT_RUNTIME_CANDIDATE_PROJECTION_SHA256) {
    throw new Error(
      `CP-005 permanent-runtime candidate projection drift: ${projectionSha256}`,
    );
  }
  return runtime.map((question) => ({
    ...question,
    candidateRuntimeProfile: {
      ...question.candidateRuntimeProfile,
      projectionDigestPinned: true,
    },
  }));
}
