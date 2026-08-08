import { createHash } from "node:crypto";
import {
  RNK_CP005_AUTHORITY_IDS,
  generateRnkCp005Question,
  type RnkCp005AuthorityId,
  type RnkCp005Question,
} from "./cp005-foundation";

export const RNK_CP005_PERMANENT_RUNTIME_VERSION = "RNK_CP005_PERMANENT_RUNTIME_V1" as const;
export const RNK_CP005_ENGLISH_DISCOVERY_FREEZE_VERSION = "RNK_CP005_ENGLISH_DISCOVERY_FREEZE_V1" as const;
export const RNK_CP005_EXPECTED_PROJECTION_SHA256 = "3fcc8981c4eb66b04cc455605da5d2f89a29555a48a7c17bd2e3d51403fa2c29" as const;

export const RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS = [
  { qlId: "RNK-QL-036", authorityId: "SHARED_ENDPOINT_ENTITY" },
  { qlId: "RNK-QL-037", authorityId: "SHARED_ENTITY_AT_POSITION" },
  { qlId: "RNK-QL-038", authorityId: "SHARED_RANK_OF_ENTITY" },
  { qlId: "RNK-QL-039", authorityId: "SHARED_PAIR_RELATION" },
  { qlId: "RNK-QL-040", authorityId: "SHARED_RANK_GAP" },
  { qlId: "RNK-QL-041", authorityId: "SHARED_IMMEDIATE_NEIGHBOUR" },
  { qlId: "RNK-QL-042", authorityId: "SHARED_COMPLETE_ORDER" },
  { qlId: "RNK-QL-043", authorityId: "SHARED_TRUE_STATEMENT" },
] as const satisfies readonly {
  readonly qlId: string;
  readonly authorityId: RnkCp005AuthorityId;
}[];

export type RnkCp005PermanentQlId =
  (typeof RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS)[number]["qlId"];

export interface RnkCp005PermanentProfile {
  readonly runtimeVersion: typeof RNK_CP005_PERMANENT_RUNTIME_VERSION;
  readonly freezeVersion: typeof RNK_CP005_ENGLISH_DISCOVERY_FREEZE_VERSION;
  readonly permanentQlId: RnkCp005PermanentQlId;
  readonly authorityId: RnkCp005AuthorityId;
  readonly permanentOrdinalWithinAuthority: number;
  readonly questionsPerAuthority: 192;
  readonly linkedSharedSetSeed: number;
  readonly projectionDigestPinned: boolean;
}

export type RnkCp005PermanentQuestion = Omit<RnkCp005Question, "permanentQlId" | "reviewMetadata"> & {
  readonly permanentQlId: RnkCp005PermanentQlId;
  readonly reviewMetadata: RnkCp005Question["reviewMetadata"] & {
    readonly permanentRuntimeStatus: "FROZEN";
    readonly permanentProfile: RnkCp005PermanentProfile;
  };
};

function permanentQuestionsFor(
  qlId: RnkCp005PermanentQlId,
  authorityId: RnkCp005AuthorityId,
): readonly RnkCp005PermanentQuestion[] {
  const output: RnkCp005PermanentQuestion[] = [];
  for (let seed = 0; seed < 192; seed += 1) {
    const permanentOrdinalWithinAuthority = seed + 1;
    const base = generateRnkCp005Question(authorityId, seed, seed % 4);
    output.push({
      ...base,
      permanentQlId: qlId,
      mathematicalFingerprint:
        `${base.mathematicalFingerprint}:${RNK_CP005_PERMANENT_RUNTIME_VERSION}:${qlId}:${permanentOrdinalWithinAuthority}`,
      reviewMetadata: {
        ...base.reviewMetadata,
        permanentRuntimeStatus: "FROZEN",
        permanentProfile: {
          runtimeVersion: RNK_CP005_PERMANENT_RUNTIME_VERSION,
          freezeVersion: RNK_CP005_ENGLISH_DISCOVERY_FREEZE_VERSION,
          permanentQlId: qlId,
          authorityId,
          permanentOrdinalWithinAuthority,
          questionsPerAuthority: 192,
          linkedSharedSetSeed: seed,
          projectionDigestPinned: true,
        },
      },
    });
  }
  return output;
}

export function buildRnkCp005PermanentRuntime(): readonly RnkCp005PermanentQuestion[] {
  if (RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS.length !== RNK_CP005_AUTHORITY_IDS.length) {
    throw new Error("CP-005 permanent assignment count does not match authority count");
  }
  return RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS.flatMap(({ qlId, authorityId }) =>
    permanentQuestionsFor(qlId, authorityId),
  );
}

function projectionRecord(question: RnkCp005PermanentQuestion): unknown {
  return {
    qlId: question.permanentQlId,
    authorityId: question.authorityId,
    ordinal: question.reviewMetadata.permanentProfile.permanentOrdinalWithinAuthority,
    seed: question.seed,
    sharedSetId: question.sharedPassage.sharedSetId,
    sharedPassageFingerprint: question.sharedPassage.sharedPassageFingerprint,
    contextFamily: question.sharedPassage.contextFamily,
    presentationMode: question.sharedPassage.presentationMode,
    rendererClass: question.sharedPassage.rendererClass,
    title: question.sharedPassage.title,
    instruction: question.sharedPassage.instruction,
    rankRows: question.sharedPassage.rankRows,
    comparisons: question.sharedPassage.comparisons,
    stem: question.stem,
    query: question.query,
    answerSemantic: question.answerSemantic,
    answerKey: question.answerKey,
    answer: question.answer,
    options: question.options,
    correctIndex: question.correctIndex,
    difficulty: question.difficulty,
    visibleExplanation: question.visibleExplanation,
  };
}

export function rnkCp005PermanentProjectionSha256(
  questions: readonly RnkCp005PermanentQuestion[],
): string {
  return createHash("sha256")
    .update(JSON.stringify(questions.map(projectionRecord)), "utf8")
    .digest("hex");
}
