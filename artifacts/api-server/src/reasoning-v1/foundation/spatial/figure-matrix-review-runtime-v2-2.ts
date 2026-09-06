import {
  FMT_V2_SOURCE_VARIANTS,
  type FigureMatrixLanguageV2,
  type FigureMatrixQlIdV2,
} from "./figure-matrix-review-runtime-v2";
import { generateFigureMatrixReviewQuestionV2_1 } from "./figure-matrix-review-runtime-v2-1";

function variantOrdinal(seed: string): number {
  const match = /(\d+)$/.exec(seed);
  if (match) return Math.max(0, Number(match[1]) - 1);
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function sameVariantRetrySeed(qlId: FigureMatrixQlIdV2, originalSeed: string, attempt: number): string {
  const variants = FMT_V2_SOURCE_VARIANTS[qlId];
  const targetIndex = variantOrdinal(originalSeed) % variants.length;
  // The base runtime selects the source variant from the trailing ordinal.  Keep
  // that ordinal congruent to the original family while changing the hash input
  // that controls geometry/distractor details.
  const trailingOrdinal = targetIndex + 1 + attempt * variants.length;
  return `${originalSeed}-retry-${trailingOrdinal}`;
}

export function generateFigureMatrixReviewQuestionV2_2(input: Readonly<{
  qlId: FigureMatrixQlIdV2;
  seed: string;
  language: FigureMatrixLanguageV2;
}>) {
  const variants = FMT_V2_SOURCE_VARIANTS[input.qlId];
  const expectedVariant = variants[variantOrdinal(input.seed) % variants.length];
  let lastDistinctOptionError: unknown = null;

  for (let attempt = 0; attempt <= 8; attempt += 1) {
    const generationSeed = attempt === 0 ? input.seed : sameVariantRetrySeed(input.qlId, input.seed, attempt);
    try {
      const question = generateFigureMatrixReviewQuestionV2_1({ ...input, seed: generationSeed });
      if (question.solveFacts.sourceVariant !== expectedVariant) {
        throw new Error(
          `FMT-001 V2.2 retry changed source variant for ${input.qlId}/${input.seed}: expected ${expectedVariant}, got ${question.solveFacts.sourceVariant}.`,
        );
      }
      return Object.freeze({
        ...question,
        version: "SPA-FMT-001-REVIEW-QUESTION-V2.2" as const,
        seed: input.seed,
        solveFacts: Object.freeze({
          ...question.solveFacts,
          reviewGenerationSeed: generationSeed,
          distinctOptionRetryCount: attempt,
        }),
        validation: Object.freeze({
          ...question.validation,
          deterministicDistinctOptionRetry: true as const,
          sourceVariantPreservedAcrossRetry: true as const,
        }),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes("failed to construct four semantically distinct options")) throw error;
      lastDistinctOptionError = error;
    }
  }

  throw new Error(
    `FMT-001 V2.2 could not construct four semantically distinct options for ${input.qlId}/${input.seed}/${expectedVariant} after deterministic same-variant retries. ${lastDistinctOptionError instanceof Error ? lastDistinctOptionError.message : ""}`.trim(),
  );
}
