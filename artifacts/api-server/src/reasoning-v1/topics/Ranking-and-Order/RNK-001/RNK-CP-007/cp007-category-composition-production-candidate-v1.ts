import { createHash } from "node:crypto";

import {
  generateRnkCp007CategoryCompositionQuestion,
  RNK_CP007_CATEGORY_COMPOSITION_EDITORIAL_V2_VERSION,
  RNK_CP007_CATEGORY_COMPOSITION_MODES,
  type RnkCp007CategoryCompositionEditorialV2Question,
  type RnkCp007CategoryCompositionMode,
} from "./cp007-category-composition-editorial-v2";

export const RNK_CP007_CATEGORY_COMPOSITION_PRODUCTION_CANDIDATE_VERSION =
  "RNK_CP007_CATEGORY_COMPOSITION_PRODUCTION_CANDIDATE_V2" as const;

export const RNK_CP007_CATEGORY_COMPOSITION_AUTHORITY_CANDIDATE_ID =
  "CATEGORY_COMPOSITION_AROUND_RANK" as const;

export type RnkCp007CandidateDifficulty = "MEDIUM" | "HARD";

export type RnkCp007CategoryCompositionCandidateQuestion =
  RnkCp007CategoryCompositionEditorialV2Question & {
    readonly candidateVersion: typeof RNK_CP007_CATEGORY_COMPOSITION_PRODUCTION_CANDIDATE_VERSION;
    readonly authorityCandidateId: typeof RNK_CP007_CATEGORY_COMPOSITION_AUTHORITY_CANDIDATE_ID;
    readonly candidateOrdinal: number;
    readonly difficulty: RnkCp007CandidateDifficulty;
    readonly permanentQlAllocated: false;
  };

function difficultyFor(mode: RnkCp007CategoryCompositionMode): RnkCp007CandidateDifficulty {
  // Converting a same-category "after" count to "ahead" requires the extra
  // target exclusion and is the only consistently hard production lane.
  return mode === "OTHER_CATEGORY_AHEAD_FROM_TARGET_AFTER" ? "HARD" : "MEDIUM";
}

export function generateRnkCp007CategoryCompositionCandidateQuestion(
  mode: RnkCp007CategoryCompositionMode,
  modeIndex: number,
  ordinalWithinMode: number,
): RnkCp007CategoryCompositionCandidateQuestion {
  const candidateOrdinal = modeIndex * 48 + ordinalWithinMode;
  const logicalSeed = modeIndex * 10_000 + ordinalWithinMode * 17 + 101;
  const answerIndex = (candidateOrdinal % 4) as 0 | 1 | 2 | 3;
  const question = generateRnkCp007CategoryCompositionQuestion(mode, logicalSeed, answerIndex);
  return {
    ...question,
    candidateVersion: RNK_CP007_CATEGORY_COMPOSITION_PRODUCTION_CANDIDATE_VERSION,
    authorityCandidateId: RNK_CP007_CATEGORY_COMPOSITION_AUTHORITY_CANDIDATE_ID,
    candidateOrdinal,
    difficulty: difficultyFor(mode),
    permanentQlAllocated: false,
  };
}

export function buildRnkCp007CategoryCompositionProductionCandidate(): readonly RnkCp007CategoryCompositionCandidateQuestion[] {
  return RNK_CP007_CATEGORY_COMPOSITION_MODES.flatMap((mode, modeIndex) =>
    Array.from({ length: 48 }, (_, ordinalWithinMode) =>
      generateRnkCp007CategoryCompositionCandidateQuestion(mode, modeIndex, ordinalWithinMode),
    ),
  );
}

export function rnkCp007CategoryCompositionCandidateProjectionSha256(
  questions: readonly RnkCp007CategoryCompositionCandidateQuestion[] =
    buildRnkCp007CategoryCompositionProductionCandidate(),
): string {
  return createHash("sha256")
    .update(JSON.stringify(questions.map((question) => ({
      candidateVersion: question.candidateVersion,
      authorityCandidateId: question.authorityCandidateId,
      mode: question.mode,
      candidateOrdinal: question.candidateOrdinal,
      difficulty: question.difficulty,
      stem: question.stem,
      options: question.options,
      answerIndex: question.answerIndex,
      answer: question.answer,
      explanation: question.explanation,
      state: question.state,
      evidence: question.evidence,
      mathematicalFingerprint: question.mathematicalFingerprint,
      partitionId: question.reviewMetadata.partitionId,
      editorialVersion: RNK_CP007_CATEGORY_COMPOSITION_EDITORIAL_V2_VERSION,
      surfaceStyle: question.reviewMetadata.surfaceProfile.style,
      distractorKinds: question.reviewMetadata.editorialProfile.distractorKinds,
    }))), "utf8")
    .digest("hex");
}
