import type {
  ClsCp003LocalizedLocale,
  ClsCp003LocalizedQlId,
} from "./cp003-localized-contracts";
import {
  generateClsCp003LocalizedQuestionV3,
  independentlyVerifyClsCp003LocalizedQuestionV3,
} from "./cp003-localized-runtime-v3";

function correctHindiPlural(text: string): string {
  return text.replace(
    /([2-9२-९]|[1-9१-९][0-9०-९]+) मात्रा हैं/g,
    "$1 मात्राएँ हैं",
  );
}

export function generateClsCp003LocalizedQuestionV4(
  qlId: ClsCp003LocalizedQlId,
  locale: ClsCp003LocalizedLocale,
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  const source = generateClsCp003LocalizedQuestionV3(qlId, locale, seed, requestedOptionCount);
  const transform = locale === "hi-IN" ? correctHindiPlural : (text: string) => text;
  return {
    ...source,
    stem: transform(source.stem),
    evidenceByOption: source.evidenceByOption.map(transform),
    explanation: {
      coreConcept: source.explanation.coreConcept.map(transform),
      stepByStep: source.explanation.stepByStep.map(transform),
      examSpeedShortcut: source.explanation.examSpeedShortcut.map(transform),
      commonTrapWarning: source.explanation.commonTrapWarning.map(transform),
    },
    metadata: {
      ...source.metadata,
      localizationVersion: "cls-cp003-hi-pa-localization-v4" as const,
      runtimeVersion: "cls-cp003-localized-runtime-v4" as const,
    },
  };
}

export type GeneratedClsCp003LocalizedQuestionV4 = ReturnType<
  typeof generateClsCp003LocalizedQuestionV4
>;

export function independentlyVerifyClsCp003LocalizedQuestionV4(
  question: GeneratedClsCp003LocalizedQuestionV4,
) {
  return independentlyVerifyClsCp003LocalizedQuestionV3(
    question as unknown as Parameters<typeof independentlyVerifyClsCp003LocalizedQuestionV3>[0],
  );
}
