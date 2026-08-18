import {
  SPATIAL_PFC_PERMANENT_QL_ALLOCATIONS_V3,
  type PfcPermanentQlIdV3,
} from "./spatial-permanent-ql-allocation-v3";
import {
  PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_2,
  generatePfcDiscoveryQuestionV4_2,
  renderPfcDiscoveryOptionSvgV4,
  renderPfcDiscoveryStimulusSvgV4,
  type PfcDiscoveryQuestionV4_2,
} from "./paper-folding-visual-taxonomy-remediation-v4-2";

export const PFC_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V2_2 = Object.freeze({
  authorityId: "PFC-001-PERMANENT-ENGLISH-RUNTIME-V2.2" as const,
  chapterCode: "PFC-001" as const,
  permanentQlRange: "SPA-QL-035..SPA-QL-038" as const,
  permanentQlCount: 4,
  questionsPerQl: 80,
  totalQuestions: 320,
  language: "en" as const,
  locale: "en-IN" as const,
  allocationAuthority: "SPA-FND-001-PERMANENT-QL-ALLOCATION-V3-PFC" as const,
  remediationAuthority: PFC_001_VISUAL_TAXONOMY_REMEDIATION_AUTHORITY_V4_2.authorityId,
  priorEnglishFreeze: "PFC-001-ENGLISH-FREEZE-V1" as const,
  priorFreezeStatus: "SUPERSEDED_FOR_INTEGRATION_PENDING_V2_2_LEARNER_REVIEW" as const,
  status: "REMEDIATED_RUNTIME_IMPLEMENTED_REVIEW_REQUIRED" as const,
  questionStudioRegistered: false,
  automaticPublication: false,
} as const);

export interface PfcPermanentEnglishQuestionV2_2 extends PfcDiscoveryQuestionV4_2 {
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

const PERMANENT_SELECTIONS_V2_2: Readonly<Record<PfcPermanentQlIdV3, readonly number[]>> = Object.freeze({
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

export const PFC_001_PERMANENT_V2_2_REVIEW_OFFSETS: Readonly<Record<PfcPermanentQlIdV3, readonly number[]>> = Object.freeze({
  "SPA-QL-035": [0, 1, 2, 3, 18, 19, 38, 39, 40, 41, 42, 43, 58, 59, 78, 79],
  "SPA-QL-036": [0, 1, 14, 15, 26, 27, 28, 29, 42, 43, 54, 56, 57, 68, 69, 79],
  "SPA-QL-037": [0, 1, 2, 3, 18, 19, 38, 39, 40, 41, 42, 43, 58, 59, 78, 79],
  "SPA-QL-038": [0, 1, 2, 3, 18, 27, 28, 29, 30, 31, 42, 56, 57, 58, 59, 79],
});

function allocationFor(qlId: PfcPermanentQlIdV3) {
  const allocation = SPATIAL_PFC_PERMANENT_QL_ALLOCATIONS_V3.find(
    (entry) => entry.permanentQlId === qlId,
  );
  if (!allocation) throw new Error(`Unknown permanent PFC QL ${qlId}.`);
  return allocation;
}

function permanentQuestionV2_2(
  qlId: PfcPermanentQlIdV3,
  qlIndex: number,
  discoveryIndex: number,
): PfcPermanentEnglishQuestionV2_2 {
  const source = generatePfcDiscoveryQuestionV4_2(discoveryIndex);
  const allocation = allocationFor(qlId);
  if (!allocation.representationIds.includes(source.representationId as never)) {
    throw new Error(`${source.representationId} is outside ${qlId}.`);
  }
  const ordinal = String(qlIndex + 1).padStart(3, "0");
  const permanentQuestionId = `PFC-PERM-V2-${qlId}-${ordinal}`;
  const canonicalQuestionId = `${permanentQuestionId}-CANONICAL`;
  return {
    ...source,
    permanentQuestionId,
    canonicalQuestionId,
    permanentQlId: qlId,
    permanentQlTitle: allocation.name,
    language: "en",
    locale: "en-IN",
    stem: "A square paper is folded in the arrow direction and cut or punched as shown. Which option shows the paper after it is fully unfolded?",
    sourceDiscoveryQuestionId: source.questionId,
    sourceDiscoveryIndex: discoveryIndex,
    deliveryFingerprint: [
      "V2.2",
      qlId,
      source.semanticFingerprint,
      source.options.map((option) => option.fingerprint).join("||"),
      source.correctOptionId,
    ].join("::"),
  };
}

export function generatePfcPermanentEnglishQlV2_2(
  qlId: PfcPermanentQlIdV3,
): PfcPermanentEnglishQuestionV2_2[] {
  return PERMANENT_SELECTIONS_V2_2[qlId].map((discoveryIndex, index) =>
    permanentQuestionV2_2(qlId, index, discoveryIndex),
  );
}

export function generatePfcPermanentEnglishCorpusV2_2(): PfcPermanentEnglishQuestionV2_2[] {
  return (["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038"] as const)
    .flatMap((qlId) => generatePfcPermanentEnglishQlV2_2(qlId));
}

export function generatePfcPermanentEnglishReviewQuestionsV2_2(): PfcPermanentEnglishQuestionV2_2[] {
  return (["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038"] as const)
    .flatMap((qlId) => {
      const questions = generatePfcPermanentEnglishQlV2_2(qlId);
      return PFC_001_PERMANENT_V2_2_REVIEW_OFFSETS[qlId].map((offset) => questions[offset]);
    });
}

export function renderPfcPermanentEnglishReviewHtmlV2_2(
  questions: readonly PfcPermanentEnglishQuestionV2_2[],
): string {
  const cards = questions.map((question) => `<article style="border-top:1px solid #999;padding:20px 0 24px;margin:0;background:#fff"><h2 style="font-size:17px;margin:0 0 4px">${question.permanentQuestionId}</h2><p style="margin:3px 0 3px"><strong>${question.permanentQlId}</strong> · ${question.permanentQlTitle}</p><p style="margin:3px 0 9px;font-size:13px">${question.difficulty} · ${question.representationTitle} · <strong>${question.coverageTags.join(", ")}</strong></p><p style="margin:8px 0 12px"><strong>Question:</strong> ${question.stem}</p><div style="overflow:auto;background:#fff">${renderPfcDiscoveryStimulusSvgV4(question, 640)}</div><div style="display:grid;grid-template-columns:repeat(4,minmax(124px,1fr));gap:18px;margin:18px 0 8px">${question.options.map((option) => `<div style="text-align:center;background:#fff"><strong>${option.optionId}</strong><div>${renderPfcDiscoveryOptionSvgV4(option, 124)}</div></div>`).join("")}</div><p style="margin:10px 0 4px"><strong>Answer:</strong> ${question.correctOptionId}</p><p style="margin:4px 0"><strong>Explanation:</strong> ${question.explanation}</p></article>`).join("\n");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PFC-001 Permanent English Review V2.2</title></head><body style="font-family:Arial,sans-serif;background:#fff;color:#111;max-width:1120px;margin:0 auto;padding:20px"><h1 style="font-size:24px">PFC-001 Permanent English Review V2.2</h1><p>Remediated paper-folding review. White exam surface, physically ordered fold panels, true learner-visible cut/notch shapes, off-centre folds, both diagonal/corner directions, mixed cut families and fold-line cuts are deliberately represented. All source questions remain semantically distinct. This runtime is review-only until fresh learner approval.</p>${cards}</body></html>`;
}
