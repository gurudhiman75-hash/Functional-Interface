import type { AlgPermanentQlId } from "./allocation";
import {
  generateAlgPermanentEnglishReviewV3 as generateAlgPermanentEnglishReviewV3Raw,
  type AlgPermanentEnglishReviewV3Item,
} from "./english-review-v3";

function normalizeRenderedSigns(text: string): string {
  return text
    .replace(/\+\s+-([0-9]+)/g, "- $1")
    .replace(/-\s+-([0-9]+)/g, "+ $1")
    .replace(/\+\s+\(-([0-9]+)\)/g, "- $1")
    .replace(/-\s+\(-([0-9]+)\)/g, "+ $1");
}

export function generateAlgPermanentEnglishReviewV3(
  qlId: AlgPermanentQlId,
  seed: number,
  requestedVariantIndex?: number,
): AlgPermanentEnglishReviewV3Item {
  const item = generateAlgPermanentEnglishReviewV3Raw(qlId, seed, requestedVariantIndex);
  return {
    ...item,
    question: normalizeRenderedSigns(item.question),
    explanation: normalizeRenderedSigns(item.explanation),
  };
}
