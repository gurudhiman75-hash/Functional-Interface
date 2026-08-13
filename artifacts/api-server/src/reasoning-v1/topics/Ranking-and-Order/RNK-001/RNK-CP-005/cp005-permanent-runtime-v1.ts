import { createHash } from "node:crypto";

import {
  buildRnkCp005PinnedPermanentRuntimeCandidate,
  RNK_CP005_PINNED_PERMANENT_RUNTIME_CANDIDATE_PROJECTION_SHA256,
  type RnkCp005PinnedPermanentRuntimeCandidateQuestion,
} from "./cp005-permanent-runtime-candidate-pinned-v1";
import type { RnkCp005PermanentRuntimeCandidateAuthorityId } from "./cp005-permanent-runtime-candidate-v1";

export const RNK_CP005_PERMANENT_RUNTIME_VERSION =
  "RNK_CP005_PERMANENT_RUNTIME_V1" as const;
export const RNK_CP005_ENGLISH_FREEZE_VERSION =
  "RNK_CP005_ENGLISH_FREEZE_V1" as const;
export const RNK_CP005_EXPECTED_PERMANENT_PROJECTION_SHA256 =
  "f6759445937626e6777f322f9b8217bc7aaa12f6a96ee180a24ca3350bd42717" as const;

export const RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS = [
  { qlId: "RNK-QL-036", authorityId: "RELATION_TRUTH_STATUS" },
  { qlId: "RNK-QL-037", authorityId: "POSSIBLE_RANK_BOUND" },
  { qlId: "RNK-QL-038", authorityId: "EXACT_RANK_DETERMINACY" },
] as const satisfies readonly {
  readonly qlId: string;
  readonly authorityId: RnkCp005PermanentRuntimeCandidateAuthorityId;
}[];

export type RnkCp005PermanentQlId =
  (typeof RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS)[number]["qlId"];

export interface RnkCp005PermanentProfile {
  readonly runtimeVersion: typeof RNK_CP005_PERMANENT_RUNTIME_VERSION;
  readonly freezeVersion: typeof RNK_CP005_ENGLISH_FREEZE_VERSION;
  readonly permanentQlId: RnkCp005PermanentQlId;
  readonly authorityId: RnkCp005PermanentRuntimeCandidateAuthorityId;
  readonly permanentOrdinalWithinAuthority: number;
  readonly questionsPerAuthority: 192;
  readonly sourceCandidateProjectionSha256:
    typeof RNK_CP005_PINNED_PERMANENT_RUNTIME_CANDIDATE_PROJECTION_SHA256;
  readonly projectionDigestPinned: boolean;
}

type FrozenCandidateProfile = Omit<
  RnkCp005PinnedPermanentRuntimeCandidateQuestion["candidateRuntimeProfile"],
  "finalOwnershipApproved" | "permanentQlId" | "englishFreezeApproved"
> & {
  readonly finalOwnershipApproved: true;
  readonly permanentQlId: RnkCp005PermanentQlId;
  readonly englishFreezeApproved: true;
};

export type RnkCp005PermanentQuestion = Omit<
  RnkCp005PinnedPermanentRuntimeCandidateQuestion,
  "candidateRuntimeProfile" | "lifecycle"
> & {
  readonly candidateRuntimeProfile: FrozenCandidateProfile;
  readonly permanentProfile: RnkCp005PermanentProfile;
  readonly permanentRuntimeFingerprint: string;
  readonly lifecycle: Readonly<{
    permanentQlAllocated: true;
    englishFrozen: true;
    questionStudio: "DISABLED";
    questionBank: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
};

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

export function buildRnkCp005PermanentRuntime(): readonly RnkCp005PermanentQuestion[] {
  const candidate = buildRnkCp005PinnedPermanentRuntimeCandidate();
  const output: RnkCp005PermanentQuestion[] = [];

  for (const assignment of RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS) {
    const authorityQuestions = candidate.filter(
      (question) =>
        question.candidateRuntimeProfile.authorityCandidateId === assignment.authorityId,
    );
    if (authorityQuestions.length !== 192) {
      throw new Error(
        `${assignment.authorityId}: expected 192 candidate questions, found ${authorityQuestions.length}`,
      );
    }

    authorityQuestions.forEach((question, index) => {
      const permanentOrdinalWithinAuthority = index + 1;
      const permanentRuntimeFingerprint = sha256({
        runtimeVersion: RNK_CP005_PERMANENT_RUNTIME_VERSION,
        freezeVersion: RNK_CP005_ENGLISH_FREEZE_VERSION,
        permanentQlId: assignment.qlId,
        authorityId: assignment.authorityId,
        permanentOrdinalWithinAuthority,
        candidateRuntimeFingerprint: question.candidateRuntimeFingerprint,
      });

      output.push({
        ...question,
        permanentRuntimeFingerprint,
        candidateRuntimeProfile: {
          ...question.candidateRuntimeProfile,
          finalOwnershipApproved: true,
          permanentQlId: assignment.qlId,
          englishFreezeApproved: true,
        },
        permanentProfile: {
          runtimeVersion: RNK_CP005_PERMANENT_RUNTIME_VERSION,
          freezeVersion: RNK_CP005_ENGLISH_FREEZE_VERSION,
          permanentQlId: assignment.qlId,
          authorityId: assignment.authorityId,
          permanentOrdinalWithinAuthority,
          questionsPerAuthority: 192,
          sourceCandidateProjectionSha256:
            RNK_CP005_PINNED_PERMANENT_RUNTIME_CANDIDATE_PROJECTION_SHA256,
          projectionDigestPinned:
            RNK_CP005_EXPECTED_PERMANENT_PROJECTION_SHA256 !== "UNPINNED",
        },
        lifecycle: {
          permanentQlAllocated: true,
          englishFrozen: true,
          questionStudio: "DISABLED",
          questionBank: "NOT_STORED",
          testEligibility: "INELIGIBLE",
          publiclyPublishable: false,
        },
      });
    });
  }

  if (output.length !== 576) {
    throw new Error(`CP-005 permanent runtime produced ${output.length}/576 questions`);
  }
  return output;
}

function projectionRecord(question: RnkCp005PermanentQuestion): unknown {
  return {
    permanentQlId: question.permanentProfile.permanentQlId,
    authorityId: question.permanentProfile.authorityId,
    permanentOrdinalWithinAuthority:
      question.permanentProfile.permanentOrdinalWithinAuthority,
    mode: question.candidateRuntimeProfile.mode,
    sourceForm: question.candidateRuntimeProfile.sourceForm,
    sourceOrdinal: question.candidateRuntimeProfile.sourceOrdinal,
    seed: question.seed,
    context: question.context,
    topology: question.v3Topology,
    pairStatusMode: question.pairStatusMode ?? null,
    difficulty: question.difficulty,
    instruction: question.instruction,
    clues: question.clues,
    stem: question.stem,
    options: question.options,
    correctIndex: question.correctIndex,
    answer: question.answer,
    explanation: question.explanation,
    candidateRuntimeFingerprint: question.candidateRuntimeFingerprint,
    permanentRuntimeFingerprint: question.permanentRuntimeFingerprint,
    normalizedLearnerFingerprint: question.normalizedLearnerFingerprint,
  };
}

export function rnkCp005PermanentProjectionSha256(
  questions: readonly RnkCp005PermanentQuestion[],
): string {
  return sha256(questions.map(projectionRecord));
}
