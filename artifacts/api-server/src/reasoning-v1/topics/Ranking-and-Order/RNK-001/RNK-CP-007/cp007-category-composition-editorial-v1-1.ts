import {
  generateRnkCp007CategoryCompositionQuestion as generateBaseQuestion,
  RNK_CP007_CATEGORY_COMPOSITION_MODES,
  RNK_CP007_CATEGORY_COMPOSITION_VERSION,
  solveRnkCp007CategoryComposition,
  type RnkCp007CategoryCompositionMode,
  type RnkCp007CategoryCompositionQuestion,
  type RnkCp007CategoryCompositionState,
  type RnkCp007CategoryEvidence,
  type RnkCp007CategoryId,
  type RnkCp007Side,
} from "./cp007-category-composition-discovery-v1";

export {
  RNK_CP007_CATEGORY_COMPOSITION_MODES,
  RNK_CP007_CATEGORY_COMPOSITION_VERSION,
  solveRnkCp007CategoryComposition,
};
export type {
  RnkCp007CategoryCompositionMode,
  RnkCp007CategoryCompositionQuestion,
  RnkCp007CategoryCompositionState,
  RnkCp007CategoryEvidence,
  RnkCp007CategoryId,
  RnkCp007Side,
};

export const RNK_CP007_CATEGORY_COMPOSITION_EDITORIAL_VERSION =
  "RNK_CP007_CATEGORY_COMPOSITION_EDITORIAL_V1_1_ZERO_ECHO" as const;

function mix32(value: number): number {
  let x = value >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

/**
 * Editorial selector over mathematically valid V1.1 states.
 *
 * A correct answer that happens to equal the subgroup count printed in the
 * stem is mathematically harmless but creates a learner-visible numeric echo.
 * We reject that presentation state instead of weakening the underlying
 * mathematical constructor or accepting a shortcut-prone review corpus.
 */
export function generateRnkCp007CategoryCompositionQuestion(
  mode: RnkCp007CategoryCompositionMode,
  logicalSeed: number,
  requestedAnswerIndex: 0 | 1 | 2 | 3 = (logicalSeed % 4) as 0 | 1 | 2 | 3,
): RnkCp007CategoryCompositionQuestion {
  for (let attempt = 0; attempt < 128; attempt += 1) {
    const physicalSeed = mix32(
      logicalSeed ^ Math.imul(attempt + 1, 0x9e3779b1) ^ 0x45444954,
    );
    const question = generateBaseQuestion(mode, physicalSeed, requestedAnswerIndex);
    if (question.answer === question.evidence.count) continue;

    return {
      ...question,
      seed: logicalSeed,
      mathematicalFingerprint:
        `${question.mathematicalFingerprint}:EDITORIAL_ZERO_ECHO:LOGICAL_SEED:${logicalSeed}`,
    };
  }

  throw new Error(
    `Unable to select zero-echo CP007 category-composition question for ${mode}/${logicalSeed}`,
  );
}
