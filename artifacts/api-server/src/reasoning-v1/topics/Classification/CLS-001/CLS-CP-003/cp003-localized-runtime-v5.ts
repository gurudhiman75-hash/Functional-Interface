import type {
  ClsCp003LocalizedLocale,
  ClsCp003LocalizedQlId,
} from "./cp003-localized-contracts";
import {
  generateClsCp003LocalizedQuestionV4,
  independentlyVerifyClsCp003LocalizedQuestionV4,
} from "./cp003-localized-runtime-v4";

/**
 * Editorial-only native review layer.
 *
 * V4 remains the validated localization/solve-state source. V5 deliberately
 * removes forced shortcut/trap boilerplate from the learner explanation while
 * preserving every generated question state and answer invariant.
 */
export function generateClsCp003LocalizedQuestionV5(
  qlId: ClsCp003LocalizedQlId,
  locale: ClsCp003LocalizedLocale,
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  const source = generateClsCp003LocalizedQuestionV4(qlId, locale, seed, requestedOptionCount);
  return {
    ...source,
    explanation: {
      coreConcept: [...source.explanation.coreConcept],
      stepByStep: [...source.explanation.stepByStep],
      examSpeedShortcut: [] as string[],
      commonTrapWarning: [] as string[],
    },
    metadata: {
      ...source.metadata,
      localizationVersion: "cls-cp003-hi-pa-localization-v5" as const,
      runtimeVersion: "cls-cp003-localized-runtime-v5" as const,
      editorialReviewVersion: "beginner-first-explanation-v1" as const,
    },
  };
}

export type GeneratedClsCp003LocalizedQuestionV5 = ReturnType<
  typeof generateClsCp003LocalizedQuestionV5
>;

export function independentlyVerifyClsCp003LocalizedQuestionV5(
  question: GeneratedClsCp003LocalizedQuestionV5,
) {
  return independentlyVerifyClsCp003LocalizedQuestionV4(
    question as unknown as Parameters<typeof independentlyVerifyClsCp003LocalizedQuestionV4>[0],
  );
}
