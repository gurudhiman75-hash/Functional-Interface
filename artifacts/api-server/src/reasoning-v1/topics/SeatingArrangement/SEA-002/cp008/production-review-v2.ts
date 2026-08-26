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

function humanizeExplanation(candidate: Sea002Cp008ReviewCandidateV3): string {
  const marker = "One valid clockwise representation";
  const markerIndex = candidate.explanation.indexOf(marker);
  if (markerIndex < 0) throw new Error("CP008 V3 explanation lost its completed-arrangement representation.");
  const completedArrangement = candidate.explanation.slice(markerIndex);

  let opening: string;
  if (candidate.topology === "ALT12_METRIC") {
    opening = "Since adjacent seats are 5 m apart, convert the given distances into seat positions and place the persons around the square.";
  } else if (candidate.topology === "VARIABLE_SIDE6") {
    opening = "First use the 1-2-1-2 side-occupancy condition, then combine the opposite and left/right statements to place all six persons.";
  } else if (candidate.topology === "ALT8_MIXED" || candidate.topology === "SIDEPAIR8_MIXED") {
    opening = "First determine which way each person faces. Then use the left/right, opposite and same-side statements to complete the seating arrangement.";
  } else if (candidate.topology === "ALT8_ROLE_DERIVED" || candidate.topology === "ALT12_ROLE_DERIVED") {
    opening = "First identify the corner and side positions. The stated rule then gives each person's facing direction, after which the left/right and opposite statements can be combined.";
  } else if (candidate.topology === "SIDEPAIR8_UNIFORM") {
    opening = "Use the same-side information first, then combine the left/right and opposite statements to complete the arrangement.";
  } else {
    opening = "Use the corner or side information first, then combine the left/right and opposite statements to complete the arrangement.";
  }
  return `${opening} ${completedArrangement}`;
}

export function generateSea002Cp008EnglishReviewCandidateV2(
  permanentQlId: Sea002Cp008PermanentQlId,
  variantIndex: number,
): Sea002Cp008ReviewCandidateV3 {
  const candidate = generateSea002Cp008EnglishReviewCandidateV3(permanentQlId, variantIndex);
  const lead = EDITORIAL_LEADS[variantIndex % EDITORIAL_LEADS.length]!;
  const stem = `${lead} ${candidate.stem}`;
  const explanation = humanizeExplanation(candidate);
  const fingerprint = createHash("sha256")
    .update(JSON.stringify({
      version: "CP008_ENGLISH_EDITORIAL_V2_ON_PRODUCTION_GRAPH_V3_HUMAN_EXPLANATION",
      permanentQlId,
      seed: candidate.seed,
      stem,
      question: candidate.question,
      options: candidate.options,
      explanation,
      productionGraphProof: candidate.productionGraphProof,
    }))
    .digest("hex");
  return Object.freeze({
    ...candidate,
    stem,
    explanation,
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
  explanationPolicy: "HUMAN_COMPLETED_ARRANGEMENT_NO_GRAPH_JARGON" as const,
  humanApprovalStatus: "PENDING" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  publiclyPublishable: false as const,
});
