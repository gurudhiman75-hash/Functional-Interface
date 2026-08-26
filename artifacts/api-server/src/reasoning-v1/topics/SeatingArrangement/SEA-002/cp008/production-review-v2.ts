import { createHash } from "node:crypto";

import {
  generateSea002Cp008EnglishReviewCandidateV3,
  type Sea002Cp008ReviewCandidateV3,
} from "./production-review-v3.ts";
import {
  SEA002_CP008_PERMANENT_QL_IDS,
  type Sea002Cp008PermanentQlId,
} from "./permanent/registry.ts";

const EDITORIAL_LEADS = Object.freeze([
  "Study the following square-table arrangement carefully.",
  "Read the seating information below and answer the question.",
  "Consider the following arrangement around the square table.",
  "Use the clues below to determine the square-table arrangement.",
  "Analyse the seating details given for the square table.",
  "Based on the information below, determine the required position.",
] as const);

export function generateSea002Cp008EnglishReviewCandidateV2(
  permanentQlId: Sea002Cp008PermanentQlId,
  variantIndex: number,
): Sea002Cp008ReviewCandidateV3 {
  const candidate = generateSea002Cp008EnglishReviewCandidateV3(permanentQlId, variantIndex);
  const lead = EDITORIAL_LEADS[variantIndex % EDITORIAL_LEADS.length]!;
  const stem = `${lead} ${candidate.stem}`;
  const fingerprint = createHash("sha256")
    .update(JSON.stringify({
      version: "CP008_ENGLISH_EDITORIAL_V2_ON_PRODUCTION_GRAPH_V3",
      permanentQlId,
      seed: candidate.seed,
      stem,
      question: candidate.question,
      options: candidate.options,
      explanation: candidate.explanation,
      productionGraphProof: candidate.productionGraphProof,
    }))
    .digest("hex");
  return Object.freeze({
    ...candidate,
    stem,
    fingerprint,
  });
}

export const SEA002_CP008_ENGLISH_REVIEW_SET_V2: readonly Sea002Cp008ReviewCandidateV3[] = Object.freeze(
  SEA002_CP008_PERMANENT_QL_IDS.flatMap((permanentQlId) =>
    Array.from({ length: 6 }, (_, variantIndex) =>
      generateSea002Cp008EnglishReviewCandidateV2(permanentQlId, variantIndex),
    ),
  ),
);

export const SEA002_CP008_ENGLISH_EDITORIAL_V2 = Object.freeze({
  renderer: "EXAM_REAL_SQUARE_PRODUCTION_GRAPH_V3_EDITORIAL_V2" as const,
  canonicalSurfaceCount: SEA002_CP008_ENGLISH_REVIEW_SET_V2.length,
  leadVariantCount: EDITORIAL_LEADS.length,
  productionGraphVersion: "EXAM_REAL_PRODUCTION_GRAPH_V3" as const,
  discoveryConstraintSpineUsed: false as const,
  difficultyPolicy: "STRUCTURAL_DEDUCTION_DEPTH_NOT_LABEL_ONLY" as const,
  humanApprovalStatus: "PENDING" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  publiclyPublishable: false as const,
});
