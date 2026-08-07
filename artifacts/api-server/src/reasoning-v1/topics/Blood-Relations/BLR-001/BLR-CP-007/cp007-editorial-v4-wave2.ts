import "./cp007-editorial-v3-scenario-corrections";
import "./cp007-editorial-v3-endpoint-compatibility";
import "./cp007-editorial-v3-gender-evidence";
import "./cp007-editorial-v4-ql034-coherent-network";
import {
  buildBlrCp007EditorialV4Telemetry,
  generateBlrCp007EditorialV4Bank,
} from "./cp007-editorial-v4";
import type {
  BlrCp007EditorialV4Telemetry,
  BlrCp007V4RecommendedUse,
  GeneratedBlrCp007EditorialV4Question,
} from "./cp007-editorial-v4-model";

export const BLR_CP007_V4_QL034_COHERENT_NETWORK_AUTHORITY =
  "BLR_CP007_V4_QL034_COHERENT_NETWORK_REMODEL" as const;

function recommendedUse(
  question: GeneratedBlrCp007EditorialV4Question,
): BlrCp007V4RecommendedUse {
  return question.metadata.difficulty === "HARD"
    ? "ADVANCED_PRACTICE"
    : "STANDARD_MOCK";
}

function releaseConnectedQl034(
  question: GeneratedBlrCp007EditorialV4Question,
): GeneratedBlrCp007EditorialV4Question {
  if (question.qlId !== "BLR-QL-034") return question;
  const components = question.metadata.candidateNetworkComponentCount;
  if (components !== 1) {
    throw new Error(`${question.itemId}: QL-034 candidate network has ${components ?? "unknown"} components.`);
  }
  const use = recommendedUse(question);
  const blockers = ["HUMAN_EDITORIAL_APPROVAL_PENDING"] as const;
  return {
    ...question,
    reviewProof: {
      ...question.reviewProof,
      reviewerNote: "V4 Wave 2 coherent-network candidate; the four substitutions are graph-valid, exactly one completes the requested relation, and human editorial approval remains required.",
    },
    metadata: {
      ...question.metadata,
      disposition: "RELEASE_CANDIDATE",
      recommendedUse: use,
      activeEditorialBlockers: blockers,
    },
    v4ReviewProof: {
      ...question.v4ReviewProof,
      disposition: "RELEASE_CANDIDATE",
      recommendedUse: use,
      activeEditorialBlockers: blockers,
    },
  };
}

export function generateBlrCp007EditorialV4Wave2Bank(): readonly GeneratedBlrCp007EditorialV4Question[] {
  return generateBlrCp007EditorialV4Bank().map(releaseConnectedQl034);
}

export function buildBlrCp007EditorialV4Wave2Telemetry(
  bank = generateBlrCp007EditorialV4Wave2Bank(),
): BlrCp007EditorialV4Telemetry {
  return buildBlrCp007EditorialV4Telemetry(bank);
}
