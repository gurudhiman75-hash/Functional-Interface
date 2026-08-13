import { createHash } from "node:crypto";

import {
  buildRnkCp006PinnedProductionCandidate,
  RNK_CP006_PINNED_PRODUCTION_CANDIDATE_PROJECTION_SHA256,
  type RnkCp006PinnedProductionCandidateQuestion,
} from "./cp006-production-candidate-pinned-v1";
import type { RnkCp006ProvisionalAuthorityId } from "./cp006-authority-consolidation-v1";

export const RNK_CP006_PERMANENT_RUNTIME_VERSION =
  "RNK_CP006_PERMANENT_RUNTIME_V1" as const;
export const RNK_CP006_ENGLISH_FREEZE_VERSION =
  "RNK_CP006_ENGLISH_FREEZE_V1" as const;
export const RNK_CP006_EXPECTED_PERMANENT_PROJECTION_SHA256 =
  "7043ecd80798ed9b60529d6052f4bc6fd4e678a98d06cc3e0332a3d10028d819" as const;

export const RNK_CP006_PERMANENT_AUTHORITY_ASSIGNMENTS = [
  { qlId: "RNK-QL-039", authorityId: "EQUALITY_AWARE_PAIR_RELATION" },
  { qlId: "RNK-QL-040", authorityId: "EQUALITY_AWARE_ENDPOINT" },
  { qlId: "RNK-QL-041", authorityId: "COMPLETE_WEAK_ORDER" },
] as const satisfies readonly {
  readonly qlId: string;
  readonly authorityId: RnkCp006ProvisionalAuthorityId;
}[];

export type RnkCp006PermanentQlId =
  (typeof RNK_CP006_PERMANENT_AUTHORITY_ASSIGNMENTS)[number]["qlId"];

export interface RnkCp006PermanentProfile {
  readonly runtimeVersion: typeof RNK_CP006_PERMANENT_RUNTIME_VERSION;
  readonly freezeVersion: typeof RNK_CP006_ENGLISH_FREEZE_VERSION;
  readonly permanentQlId: RnkCp006PermanentQlId;
  readonly authorityId: RnkCp006ProvisionalAuthorityId;
  readonly permanentOrdinalWithinAuthority: number;
  readonly questionsPerAuthority: 192;
  readonly sourceCandidateProjectionSha256:
    typeof RNK_CP006_PINNED_PRODUCTION_CANDIDATE_PROJECTION_SHA256;
  readonly projectionDigestPinned: boolean;
}

type FrozenCandidateProfile = Omit<
  RnkCp006PinnedProductionCandidateQuestion["candidateProfile"],
  "finalOwnershipApproved" | "permanentQlId" | "englishFreezeApproved"
> & {
  readonly finalOwnershipApproved: true;
  readonly permanentQlId: RnkCp006PermanentQlId;
  readonly englishFreezeApproved: true;
};

export type RnkCp006PermanentQuestion = Omit<
  RnkCp006PinnedProductionCandidateQuestion,
  "candidateProfile" | "lifecycle"
> & {
  readonly candidateProfile: FrozenCandidateProfile;
  readonly permanentProfile: RnkCp006PermanentProfile;
  readonly permanentRuntimeFingerprint: string;
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

export function buildRnkCp006PermanentRuntime(): readonly RnkCp006PermanentQuestion[] {
  const candidate = buildRnkCp006PinnedProductionCandidate();
  const output: RnkCp006PermanentQuestion[] = [];

  for (const assignment of RNK_CP006_PERMANENT_AUTHORITY_ASSIGNMENTS) {
    const authorityQuestions = candidate.filter(
      (question) => question.authorityId === assignment.authorityId,
    );
    if (authorityQuestions.length !== 192) {
      throw new Error(
        `${assignment.authorityId}: expected 192 candidate questions, found ${authorityQuestions.length}`,
      );
    }

    authorityQuestions.forEach((question, index) => {
      const permanentOrdinalWithinAuthority = index + 1;
      const permanentRuntimeFingerprint = sha256({
        runtimeVersion: RNK_CP006_PERMANENT_RUNTIME_VERSION,
        freezeVersion: RNK_CP006_ENGLISH_FREEZE_VERSION,
        permanentQlId: assignment.qlId,
        authorityId: assignment.authorityId,
        permanentOrdinalWithinAuthority,
        candidateRuntimeFingerprint: question.candidateRuntimeFingerprint,
      });

      output.push({
        ...question,
        permanentRuntimeFingerprint,
        candidateProfile: {
          ...question.candidateProfile,
          finalOwnershipApproved: true,
          permanentQlId: assignment.qlId,
          englishFreezeApproved: true,
        },
        permanentProfile: {
          runtimeVersion: RNK_CP006_PERMANENT_RUNTIME_VERSION,
          freezeVersion: RNK_CP006_ENGLISH_FREEZE_VERSION,
          permanentQlId: assignment.qlId,
          authorityId: assignment.authorityId,
          permanentOrdinalWithinAuthority,
          questionsPerAuthority: 192,
          sourceCandidateProjectionSha256:
            RNK_CP006_PINNED_PRODUCTION_CANDIDATE_PROJECTION_SHA256,
          projectionDigestPinned:
            RNK_CP006_EXPECTED_PERMANENT_PROJECTION_SHA256 !== "UNPINNED",
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
      });
    });
  }

  if (output.length !== 576) {
    throw new Error(`CP006 permanent runtime produced ${output.length}/576 questions`);
  }
  return output;
}

function projectionRecord(question: RnkCp006PermanentQuestion): unknown {
  return {
    permanentQlId: question.permanentProfile.permanentQlId,
    authorityId: question.permanentProfile.authorityId,
    permanentOrdinalWithinAuthority:
      question.permanentProfile.permanentOrdinalWithinAuthority,
    sourceForm: question.sourceForm,
    mode: question.mode,
    authorityOrdinal: question.authorityOrdinal,
    seed: question.seed,
    context: question.context,
    difficulty: question.difficulty,
    mathematicalStateKey: question.state.mathematicalStateKey,
    orderedGroups: question.state.orderedGroups,
    equalityBridge: question.state.equalityBridge,
    strictEdges: question.state.strictEdges,
    clues: question.clues,
    stem: question.stem,
    options: question.options,
    correctIndex: question.correctIndex,
    answer: question.answer,
    explanation: question.explanation,
    learnerFingerprint: question.learnerFingerprint,
    candidateRuntimeFingerprint: question.candidateRuntimeFingerprint,
    permanentRuntimeFingerprint: question.permanentRuntimeFingerprint,
  };
}

export function rnkCp006PermanentProjectionSha256(
  questions: readonly RnkCp006PermanentQuestion[],
): string {
  return sha256(questions.map(projectionRecord));
}
