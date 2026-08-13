import { createHash } from "node:crypto";

import {
  buildRnkCp007PinnedCategoryCompositionCandidate,
  RNK_CP007_CATEGORY_COMPOSITION_PINNED_CANDIDATE_PROJECTION_SHA256,
  type RnkCp007PinnedCategoryCompositionQuestion,
} from "./cp007-category-composition-production-candidate-pinned-v1";

export const RNK_CP007_PERMANENT_RUNTIME_VERSION =
  "RNK_CP007_PERMANENT_RUNTIME_V1" as const;
export const RNK_CP007_ENGLISH_FREEZE_VERSION =
  "RNK_CP007_ENGLISH_FREEZE_V1" as const;
export const RNK_CP007_PERMANENT_QL_ID = "RNK-QL-042" as const;
export const RNK_CP007_PERMANENT_AUTHORITY_ID =
  "CATEGORY_COMPOSITION_AROUND_RANK" as const;
export const RNK_CP007_EXPECTED_PERMANENT_PROJECTION_SHA256 =
  "44aefb019c1a55308b58f4b285b1b6f7df97dea0185652d6de73e2dafbbd446b" as const;

export type RnkCp007PermanentQuestion = Omit<
  RnkCp007PinnedCategoryCompositionQuestion,
  "permanentQlAllocated"
> & {
  readonly permanentQlAllocated: true;
  readonly permanentRuntimeFingerprint: string;
  readonly permanentProfile: Readonly<{
    runtimeVersion: typeof RNK_CP007_PERMANENT_RUNTIME_VERSION;
    freezeVersion: typeof RNK_CP007_ENGLISH_FREEZE_VERSION;
    permanentQlId: typeof RNK_CP007_PERMANENT_QL_ID;
    authorityId: typeof RNK_CP007_PERMANENT_AUTHORITY_ID;
    permanentOrdinal: number;
    questionsInAuthority: 192;
    sourceCandidateProjectionSha256:
      typeof RNK_CP007_CATEGORY_COMPOSITION_PINNED_CANDIDATE_PROJECTION_SHA256;
    candidateProjectionPinned: true;
  }>;
  readonly lifecycle: Readonly<{
    permanentQlAllocated: true;
    englishFrozen: true;
    questionStudio: "DISABLED";
    persistence: "DISABLED";
    questionBank: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
    hindiPunjabi: "NOT_STARTED";
  }>;
};

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

export function buildRnkCp007PermanentRuntime(): readonly RnkCp007PermanentQuestion[] {
  const candidate = buildRnkCp007PinnedCategoryCompositionCandidate();
  if (candidate.length !== 192) {
    throw new Error(`CP007 permanent runtime expected 192 candidate questions, found ${candidate.length}`);
  }

  return candidate.map((question, index) => {
    const permanentOrdinal = index + 1;
    const permanentRuntimeFingerprint = sha256({
      runtimeVersion: RNK_CP007_PERMANENT_RUNTIME_VERSION,
      freezeVersion: RNK_CP007_ENGLISH_FREEZE_VERSION,
      permanentQlId: RNK_CP007_PERMANENT_QL_ID,
      authorityId: RNK_CP007_PERMANENT_AUTHORITY_ID,
      permanentOrdinal,
      candidateOrdinal: question.candidateOrdinal,
      mathematicalFingerprint: question.mathematicalFingerprint,
    });

    return {
      ...question,
      permanentQlAllocated: true,
      permanentRuntimeFingerprint,
      permanentProfile: {
        runtimeVersion: RNK_CP007_PERMANENT_RUNTIME_VERSION,
        freezeVersion: RNK_CP007_ENGLISH_FREEZE_VERSION,
        permanentQlId: RNK_CP007_PERMANENT_QL_ID,
        authorityId: RNK_CP007_PERMANENT_AUTHORITY_ID,
        permanentOrdinal,
        questionsInAuthority: 192,
        sourceCandidateProjectionSha256:
          RNK_CP007_CATEGORY_COMPOSITION_PINNED_CANDIDATE_PROJECTION_SHA256,
        candidateProjectionPinned: true,
      },
      lifecycle: {
        permanentQlAllocated: true,
        englishFrozen: true,
        questionStudio: "DISABLED",
        persistence: "DISABLED",
        questionBank: "NOT_STORED",
        testEligibility: "INELIGIBLE",
        publiclyPublishable: false,
        hindiPunjabi: "NOT_STARTED",
      },
    };
  });
}

function projectionRecord(question: RnkCp007PermanentQuestion): unknown {
  return {
    permanentQlId: question.permanentProfile.permanentQlId,
    authorityId: question.permanentProfile.authorityId,
    permanentOrdinal: question.permanentProfile.permanentOrdinal,
    mode: question.mode,
    candidateOrdinal: question.candidateOrdinal,
    difficulty: question.difficulty,
    surfaceStyle: question.reviewMetadata.surfaceProfile.style,
    partitionId: question.reviewMetadata.partitionId,
    targetName: question.reviewMetadata.targetName,
    state: question.state,
    evidence: question.evidence,
    stem: question.stem,
    options: question.options,
    answerIndex: question.answerIndex,
    answer: question.answer,
    explanation: question.explanation,
    mathematicalFingerprint: question.mathematicalFingerprint,
    permanentRuntimeFingerprint: question.permanentRuntimeFingerprint,
  };
}

export function rnkCp007PermanentProjectionSha256(
  questions: readonly RnkCp007PermanentQuestion[] = buildRnkCp007PermanentRuntime(),
): string {
  return sha256(questions.map(projectionRecord));
}
