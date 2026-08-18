import {
  SPATIAL_PFC_PERMANENT_QL_ALLOCATIONS_V3,
  type PfcPermanentQlIdV3,
} from "./spatial-permanent-ql-allocation-v3";
import {
  generatePfcDiscoveryQuestionV3,
  renderPfcDiscoveryOptionSvgV1,
  renderPfcDiscoveryStimulusSvgV3,
} from "./paper-folding-discovery-presentation-v3";
import type { PfcDiscoveryQuestionV1 } from "./paper-folding-discovery-v1";

export const PFC_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1 = Object.freeze({
  authorityId: "PFC-001-PERMANENT-ENGLISH-RUNTIME-V1" as const,
  chapterCode: "PFC-001" as const,
  permanentQlRange: "SPA-QL-035..SPA-QL-038" as const,
  permanentQlCount: 4,
  questionsPerQl: 80,
  totalQuestions: 320,
  language: "en" as const,
  locale: "en-IN" as const,
  allocationAuthority: "SPA-FND-001-PERMANENT-QL-ALLOCATION-V3-PFC" as const,
  semanticAuthority: "PFC-001-EXECUTABLE-DISCOVERY-REMEDIATED-V2" as const,
  presentationAuthority: "PFC-001-DISCOVERY-PRESENTATION-V3" as const,
  status: "RUNTIME_IMPLEMENTED_REVIEW_PENDING" as const,
  questionStudioRegistered: false,
  automaticPublication: false,
} as const);

export interface PfcPermanentEnglishQuestionV1 extends PfcDiscoveryQuestionV1 {
  permanentQuestionId: string;
  canonicalQuestionId: string;
  permanentQlId: PfcPermanentQlIdV3;
  permanentQlTitle: string;
  language: "en";
  locale: "en-IN";
  stem: string;
  sourceDiscoveryQuestionId: string;
  sourceDiscoveryIndex: number;
  deliveryFingerprint: string;
}

const PERMANENT_SELECTIONS: Readonly<Record<PfcPermanentQlIdV3, readonly number[]>> = Object.freeze({
  "SPA-QL-035": [
    ...Array.from({ length: 40 }, (_, index) => index),
    ...Array.from({ length: 40 }, (_, index) => 240 + index),
  ],
  "SPA-QL-036": [
    ...Array.from({ length: 28 }, (_, index) => 160 + index),
    ...Array.from({ length: 28 }, (_, index) => 480 + index),
    ...Array.from({ length: 24 }, (_, index) => 720 + index),
  ],
  "SPA-QL-037": [
    ...Array.from({ length: 40 }, (_, index) => 320 + index),
    ...Array.from({ length: 40 }, (_, index) => 400 + index),
  ],
  "SPA-QL-038": [
    ...Array.from({ length: 28 }, (_, index) => 80 + index),
    ...Array.from({ length: 28 }, (_, index) => 560 + index),
    ...Array.from({ length: 24 }, (_, index) => 640 + index),
  ],
});

function allocationFor(qlId: PfcPermanentQlIdV3) {
  const allocation = SPATIAL_PFC_PERMANENT_QL_ALLOCATIONS_V3.find(
    (entry) => entry.permanentQlId === qlId,
  );
  if (!allocation) throw new Error(`Unknown permanent PFC QL ${qlId}.`);
  return allocation;
}

function permanentQuestion(
  qlId: PfcPermanentQlIdV3,
  qlIndex: number,
  discoveryIndex: number,
): PfcPermanentEnglishQuestionV1 {
  const source = generatePfcDiscoveryQuestionV3(discoveryIndex);
  const allocation = allocationFor(qlId);
  if (!allocation.representationIds.includes(source.representationId as never)) {
    throw new Error(`${source.representationId} is outside ${qlId}.`);
  }
  const ordinal = String(qlIndex + 1).padStart(3, "0");
  const permanentQuestionId = `PFC-PERM-${qlId}-${ordinal}`;
  const canonicalQuestionId = `${permanentQuestionId}-CANONICAL`;
  return {
    ...source,
    permanentQuestionId,
    canonicalQuestionId,
    permanentQlId: qlId,
    permanentQlTitle: allocation.name,
    language: "en",
    locale: "en-IN",
    stem: "A square paper is folded in the arrow direction and cut as shown. Which option shows the paper after it is fully unfolded?",
    sourceDiscoveryQuestionId: source.questionId,
    sourceDiscoveryIndex: discoveryIndex,
    deliveryFingerprint: [
      qlId,
      source.semanticFingerprint,
      source.options.map((option) => option.fingerprint).join("||"),
      source.correctOptionId,
    ].join("::"),
  };
}

export function generatePfcPermanentEnglishQlV1(
  qlId: PfcPermanentQlIdV3,
): PfcPermanentEnglishQuestionV1[] {
  const indices = PERMANENT_SELECTIONS[qlId];
  return indices.map((discoveryIndex, index) => permanentQuestion(qlId, index, discoveryIndex));
}

export function generatePfcPermanentEnglishCorpusV1(): PfcPermanentEnglishQuestionV1[] {
  return (["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038"] as const)
    .flatMap((qlId) => generatePfcPermanentEnglishQlV1(qlId));
}

export function renderPfcPermanentEnglishReviewHtmlV1(
  questions: readonly PfcPermanentEnglishQuestionV1[],
): string {
  const cards = questions.map((question) => `<article style="border:1px solid #ccc;border-radius:10px;padding:16px;margin:16px 0;background:#fff"><h2 style="margin:0 0 4px">${question.permanentQuestionId}</h2><p style="margin:4px 0 4px"><strong>${question.permanentQlId}</strong> · ${question.permanentQlTitle}</p><p style="margin:4px 0 12px">${question.difficulty} · ${question.representationTitle}</p><p><strong>Question:</strong> ${question.stem}</p><div style="overflow:auto">${renderPfcDiscoveryStimulusSvgV3(question, 520)}</div><div style="display:grid;grid-template-columns:repeat(4,minmax(112px,1fr));gap:12px;margin-top:14px">${question.options.map((option) => `<div style="text-align:center"><strong>${option.optionId}</strong><div>${renderPfcDiscoveryOptionSvgV1(option, 112)}</div></div>`).join("")}</div><p><strong>Answer:</strong> ${question.correctOptionId}</p><p><strong>Explanation:</strong> ${question.explanation}</p></article>`).join("\n");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PFC-001 Permanent English Review V1</title></head><body style="font-family:Arial,sans-serif;background:#f5f5f5;color:#111;max-width:1100px;margin:0 auto;padding:16px"><h1>PFC-001 Permanent English Review V1</h1><p>Permanent QLs SPA-QL-035..038. Fold arrows show the moving side; semantic fold state remains the answer authority.</p>${cards}</body></html>`;
}
