import { createHash } from "node:crypto";

import {
  buildRnkCp005EditorialV3State,
  classifyRnkCp005EditorialV3Relation,
  generateRnkCp005EditorialV3ApprovedQuestion,
  RNK_CP005_EDITORIAL_V3_REJECTED_SOURCE_FORMS,
  RNK_CP005_EDITORIAL_V3_SOURCE_FORMS,
  RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS,
  RNK_CP005_V3_TOPOLOGIES,
  shortestRnkCp005EditorialV3Path,
  type RnkCp005EditorialV3Question,
  type RnkCp005EditorialV3SourceForm,
  type RnkCp005EditorialV3State,
  type RnkCp005PairStatusMode,
  type RnkCp005V3Topology,
} from "./cp005-partial-order-editorial-v3-approved";

export {
  buildRnkCp005EditorialV3State,
  classifyRnkCp005EditorialV3Relation,
  RNK_CP005_EDITORIAL_V3_REJECTED_SOURCE_FORMS,
  RNK_CP005_EDITORIAL_V3_SOURCE_FORMS,
  RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS,
  RNK_CP005_V3_TOPOLOGIES,
  shortestRnkCp005EditorialV3Path,
};
export type {
  RnkCp005EditorialV3Question,
  RnkCp005EditorialV3SourceForm,
  RnkCp005EditorialV3State,
  RnkCp005PairStatusMode,
  RnkCp005V3Topology,
};

export const RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_RELEASE_VERSION =
  "RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_RELEASE" as const;

function releaseFingerprint(
  question: RnkCp005EditorialV3Question,
): string {
  return createHash("sha256")
    .update(
      JSON.stringify({
        version: RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_RELEASE_VERSION,
        prototypeId: question.prototypeId,
        authorityCandidateId: question.authorityCandidateId,
        topology: question.v3Topology,
        pairStatusMode: question.pairStatusMode,
        seed: question.seed,
        clues: question.clues,
        stem: question.stem,
        options: question.options.map((option) => option.label),
        answer: question.answer,
        explanation: question.explanation,
      }),
      "utf8",
    )
    .digest("hex");
}

function finalizeRelease(
  question: RnkCp005EditorialV3Question,
): RnkCp005EditorialV3Question {
  return {
    ...question,
    mathematicalFingerprint: releaseFingerprint(question),
  };
}

/**
 * The approved generator has a deliberately strict derived-proof filter.
 * Some ordinal residue classes are sparse. Search additional lanes separated
 * by 24 so every original corpus slot owns a unique residue modulo 24.
 *
 * 24 preserves:
 * - answer position, because 24 is divisible by 4;
 * - pair-status mode, because 24 is divisible by 3;
 * - uniqueness across the original 0..23 corpus slots.
 */
export function generateRnkCp005EditorialV3ReleaseQuestion(
  prototypeId: RnkCp005EditorialV3SourceForm,
  ordinal: number,
): RnkCp005EditorialV3Question {
  let lastError: unknown;
  for (let lane = 0; lane < 24; lane += 1) {
    const candidateOrdinal = ordinal + lane * 24;
    try {
      const question = generateRnkCp005EditorialV3ApprovedQuestion(
        prototypeId,
        candidateOrdinal,
      );
      if (question.correctIndex !== ordinal % 4) continue;
      if (
        prototypeId === "PAIR_RELATION_CANNOT_BE_DETERMINED" &&
        question.pairStatusMode !==
          (["FIRST_ABOVE", "SECOND_ABOVE", "INDETERMINATE"] as const)[
            ordinal % 3
          ]
      ) {
        continue;
      }
      return finalizeRelease(question);
    } catch (error) {
      lastError = error;
    }
  }
  const detail = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(
    `${prototypeId}:${ordinal}: no V3 release candidate found across 24 disjoint lanes; last=${detail}`,
  );
}

export function buildRnkCp005EditorialV3ReleaseCorpus(
  questionsPerSourceForm = 24,
): readonly RnkCp005EditorialV3Question[] {
  return RNK_CP005_EDITORIAL_V3_SOURCE_FORMS.flatMap((prototypeId) =>
    Array.from({ length: questionsPerSourceForm }, (_, ordinal) =>
      generateRnkCp005EditorialV3ReleaseQuestion(prototypeId, ordinal),
    ),
  );
}
