import {
  SPATIAL_PFC_TPF_PERMANENT_QL_ALLOCATIONS_V4,
  type PfcTpfPermanentQlIdV4,
  type PfcTpfProposalIdV4,
} from "./spatial-permanent-ql-allocation-v4";
import {
  generatePfcTpfFinalCombinedEnglishReviewV1_2,
  PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1_2,
} from "./paper-folding-final-combined-english-review-v1-2";
import { PFC_TPF_FINAL_COMBINED_PRODUCT_OWNER_APPROVAL_V1 } from "./paper-folding-final-combined-product-owner-approval-v1";
import type { PfcTpfFinalCombinedQuestionV1 } from "./paper-folding-final-combined-english-review-v1";

export const PFC_TPF_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V3 = Object.freeze({
  authorityId: "PFC-TPF-PERMANENT-ENGLISH-RUNTIME-V3" as const,
  supersedesLegacyPfcRuntimeAuthorities: [
    "PFC-001-PERMANENT-ENGLISH-RUNTIME-V1",
    "PFC-001-PERMANENT-ENGLISH-RUNTIME-V2",
  ] as const,
  allocationAuthorityId: "SPA-FND-001-PERMANENT-QL-ALLOCATION-V4-PFC-TPF" as const,
  reviewedSurfaceAuthorityId: PFC_TPF_FINAL_COMBINED_ENGLISH_REVIEW_AUTHORITY_V1_2.authorityId,
  productOwnerApprovalAuthorityId: PFC_TPF_FINAL_COMBINED_PRODUCT_OWNER_APPROVAL_V1.authorityId,
  permanentQlRange: "SPA-QL-035..SPA-QL-040" as const,
  permanentQlCount: 6,
  canonicalArchetypeCount: 84,
  language: "en" as const,
  locale: "en-IN" as const,
  canonicalArchetypePolicy: "APPROVED_V1_2_LEARNER_SURFACE_CONTENT_IMMUTABLE" as const,
  fixedCorpusIsProductionCeiling: false,
  studioGenerationModel: "SEEDED_ENGINE_EXPANSION_FROM_FROZEN_SKILL_AND_VALIDATION_AUTHORITIES" as const,
  productionSamplingPolicy: {
    sourceBackedCoreRecommendedPercent: 50,
    controlledNovelRecommendedPercent: 40,
    experimentalStretchRecommendedPercent: 10,
    experimentalStretchPublicByDefault: false,
  },
  status: "PERMANENT_ENGLISH_RUNTIME_IMPLEMENTED_FREEZE_GATE_PENDING" as const,
  questionStudioRegistered: false,
  automaticPublication: false,
} as const);

export interface PfcTpfPermanentEnglishQuestionV3 extends PfcTpfFinalCombinedQuestionV1 {
  permanentQuestionId: string;
  canonicalQuestionId: string;
  permanentQlId: PfcTpfPermanentQlIdV4;
  permanentQlTitle: string;
  language: "en";
  locale: "en-IN";
  sourceReviewId: string;
  contentFingerprint: string;
}

const PROPOSAL_TO_QL: Readonly<Record<PfcTpfProposalIdV4, PfcTpfPermanentQlIdV4>> = Object.freeze({
  "PFC-PROP-01": "SPA-QL-035",
  "PFC-PROP-02": "SPA-QL-036",
  "PFC-PROP-03": "SPA-QL-037",
  "PFC-PROP-04": "SPA-QL-038",
  "PFC-PROP-05": "SPA-QL-039",
  "TPF-PROP-01": "SPA-QL-040",
});

function allocationFor(qlId: PfcTpfPermanentQlIdV4) {
  const allocation = SPATIAL_PFC_TPF_PERMANENT_QL_ALLOCATIONS_V4.find((entry) => entry.permanentQlId === qlId);
  if (!allocation) throw new Error(`Unknown PFC/TPF permanent QL ${qlId}.`);
  return allocation;
}

function shortHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function runtimeQuestion(
  question: PfcTpfFinalCombinedQuestionV1,
  qlOrdinal: number,
): PfcTpfPermanentEnglishQuestionV3 {
  const proposalId = question.proposalId as PfcTpfProposalIdV4;
  const qlId = PROPOSAL_TO_QL[proposalId];
  if (!qlId) throw new Error(`${question.reviewId} has unmapped proposal ${question.proposalId}.`);
  const allocation = allocationFor(qlId);
  if (allocation.chapterCode !== question.chapterCode) {
    throw new Error(`${question.reviewId} chapter ${question.chapterCode} does not match ${qlId} allocation ${allocation.chapterCode}.`);
  }
  const ordinal = String(qlOrdinal + 1).padStart(3, "0");
  const permanentQuestionId = `SPA-PFC-TPF-${qlId}-${ordinal}`;
  const contentFingerprint = shortHash([
    qlId,
    question.reviewId,
    question.provenance,
    question.representation,
    question.stem,
    question.stimulusSvg,
    question.options.map((option) => `${option.optionId}:${option.svg}`).join("||"),
    question.correctOptionId,
    question.explanation,
  ].join("::"));
  return {
    ...question,
    permanentQuestionId,
    canonicalQuestionId: `${permanentQuestionId}-CANONICAL`,
    permanentQlId: qlId,
    permanentQlTitle: allocation.name,
    language: "en",
    locale: "en-IN",
    sourceReviewId: question.reviewId,
    contentFingerprint,
  };
}

export function generatePfcTpfPermanentEnglishCorpusV3(): PfcTpfPermanentEnglishQuestionV3[] {
  if (!PFC_TPF_FINAL_COMBINED_PRODUCT_OWNER_APPROVAL_V1.authorization.englishRuntimeImplementationAllowed) {
    throw new Error("Product-owner approval does not allow permanent English runtime implementation.");
  }
  const reviewed = generatePfcTpfFinalCombinedEnglishReviewV1_2();
  const ordinals = new Map<PfcTpfPermanentQlIdV4, number>();
  return reviewed.map((question) => {
    const qlId = PROPOSAL_TO_QL[question.proposalId as PfcTpfProposalIdV4];
    if (!qlId) throw new Error(`${question.reviewId} has no permanent QL mapping.`);
    const ordinal = ordinals.get(qlId) ?? 0;
    ordinals.set(qlId, ordinal + 1);
    return runtimeQuestion(question, ordinal);
  });
}

export function generatePfcTpfPermanentEnglishQlV3(qlId: PfcTpfPermanentQlIdV4): PfcTpfPermanentEnglishQuestionV3[] {
  return generatePfcTpfPermanentEnglishCorpusV3().filter((question) => question.permanentQlId === qlId);
}

export function pfcTpfPermanentQlForProposalV3(proposalId: PfcTpfProposalIdV4): PfcTpfPermanentQlIdV4 {
  return PROPOSAL_TO_QL[proposalId];
}
