import {
  SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V1,
  generateSpatialFinalHeldGapReviewQuestionV1,
  type SpatialFinalHeldGapEmbeddedQuestionV1,
  type SpatialFinalHeldGapLanguageV1,
  type SpatialFinalHeldGapNumericQuestionV1,
  type SpatialFinalHeldGapQlIdV1,
} from "./spatial-final-held-gap-review-runtime-v1";

export type SpatialFinalHeldGapReviewQuestionV2 =
  | SpatialFinalHeldGapNumericQuestionV1
  | SpatialFinalHeldGapEmbeddedQuestionV1;

export const SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V2 = Object.freeze({
  ...SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V1,
  authorityId: "SPA-FND-001-FINAL-HELD-GAP-REVIEW-RUNTIME-V2-EXAM-STROKES" as const,
  supersedesAuthorityId: SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V1.authorityId,
  status: "REVIEW_RUNTIME_V2_EXAM_STROKES_IMPLEMENTED_NOT_FROZEN" as const,
  rendererPolicy: Object.freeze({
    background: "WHITE" as const,
    stroke: "#111827" as const,
    strokeWidth: 1.35,
    randomWholeFigureTilt: false,
    clippingAllowed: false,
    legacyEmbeddedStrokeSuppressed: true,
  }),
  nextGate: "SPA_FINAL_HELD_GAP_DIRECT_VISUAL_AND_EDITORIAL_REVIEW_V2" as const,
} as const);

function normalizeEmbeddedExamSvg(svg: string): string {
  const normalized = svg
    .replaceAll('stroke="black"', 'stroke="#111827"')
    .replaceAll('stroke-width="2.2"', 'stroke-width="1.35"');
  if (!/<rect[^>]+fill="white"/iu.test(normalized)) {
    throw new Error("Final held-gap embedded renderer lost the white exam background.");
  }
  if (!/stroke="#111827"/iu.test(normalized) || !/stroke-width="1\.35"/iu.test(normalized)) {
    throw new Error("Final held-gap embedded renderer did not normalize to the exam stroke contract.");
  }
  return normalized;
}

export function generateSpatialFinalHeldGapReviewQuestionV2(input: Readonly<{
  qlId: SpatialFinalHeldGapQlIdV1;
  seed: string;
  language: SpatialFinalHeldGapLanguageV1;
}>): SpatialFinalHeldGapReviewQuestionV2 {
  const base = generateSpatialFinalHeldGapReviewQuestionV1(input);
  if (base.version === "SPA-FINAL-HELD-GAP-NUMERIC-QUESTION-V1") return base;
  return Object.freeze({
    ...base,
    stimulusSvgs: Object.freeze([normalizeEmbeddedExamSvg(base.stimulusSvgs[0])]) as readonly [string],
    optionSvgs: Object.freeze(base.optionSvgs.map(normalizeEmbeddedExamSvg)) as unknown as readonly [string, string, string, string],
  });
}

export function generateSpatialFinalHeldGapReviewBatchV2(input: Readonly<{
  qlId: SpatialFinalHeldGapQlIdV1;
  seed: string;
  language: SpatialFinalHeldGapLanguageV1;
  count: number;
}>): readonly SpatialFinalHeldGapReviewQuestionV2[] {
  if (!Number.isInteger(input.count) || input.count < 1 || input.count > 30) {
    throw new Error("Final Spatial held-gap review batch count must be an integer from 1 to 30.");
  }
  const output: SpatialFinalHeldGapReviewQuestionV2[] = [];
  const geometries = new Set<string>();
  for (let index = 0; index < input.count; index += 1) {
    let accepted: SpatialFinalHeldGapReviewQuestionV2 | null = null;
    for (let retry = 0; retry < 50; retry += 1) {
      const question = generateSpatialFinalHeldGapReviewQuestionV2({
        qlId: input.qlId,
        seed: `${input.seed}:${index}:${retry}`,
        language: input.language,
      });
      if (geometries.has(question.geometryFingerprint)) continue;
      geometries.add(question.geometryFingerprint);
      accepted = question;
      break;
    }
    if (!accepted) throw new Error(`${input.qlId}: unable to produce geometry-unique review item at index ${index}.`);
    output.push(accepted);
  }
  return Object.freeze(output);
}
