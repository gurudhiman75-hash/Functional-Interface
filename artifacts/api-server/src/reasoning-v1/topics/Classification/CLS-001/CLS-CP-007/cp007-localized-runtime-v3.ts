import type { ClsCp007LocalizedLocale } from "./cp007-localized-runtime";
import {
  generateClsCp007LocalizedClusterQuestionV2,
  generateClsCp007LocalizedPairQuestionV2,
} from "./cp007-localized-runtime-v2";
import type { ClsCp007PrototypeId } from "./types";

function conclusion(
  locale: ClsCp007LocalizedLocale,
  answer: string,
  pair: boolean,
): string {
  if (locale === "hi-IN") {
    return pair
      ? `इसलिए ${answer} अलग अक्षर-समूह जोड़ी है।`
      : `इसलिए ${answer} अलग अक्षर-समूह है।`;
  }
  return pair
    ? `ਇਸ ਲਈ ${answer} ਵੱਖਰੀ ਅੱਖਰ-ਸਮੂਹ ਜੋੜੀ ਹੈ।`
    : `ਇਸ ਲਈ ${answer} ਵੱਖਰਾ ਅੱਖਰ-ਸਮੂਹ ਹੈ।`;
}

function compactExplanation<T extends {
  readonly answer: string;
  readonly correctIndex: number;
  readonly evidenceByOption: readonly string[];
  readonly explanation: {
    readonly coreConcept: readonly string[];
    readonly stepByStep: readonly string[];
    readonly examSpeedShortcut: readonly string[];
    readonly commonTrapWarning: readonly string[];
  };
  readonly metadata: Record<string, unknown>;
}>(question: T, locale: ClsCp007LocalizedLocale, pair: boolean) {
  const representativeIndex = question.evidenceByOption.findIndex((_, index) => index !== question.correctIndex);
  if (representativeIndex < 0) throw new Error("CP007 compact explanation requires a matching option");
  const representativeEvidence = question.evidenceByOption[representativeIndex]!;
  const outlierEvidence = question.evidenceByOption[question.correctIndex]!;

  return {
    ...question,
    explanation: {
      coreConcept: question.explanation.coreConcept,
      stepByStep: [
        representativeEvidence,
        outlierEvidence,
        conclusion(locale, question.answer, pair),
      ] as readonly string[],
      examSpeedShortcut: [] as readonly string[],
      commonTrapWarning: [] as readonly string[],
    },
    metadata: {
      ...question.metadata,
      runtimeVersion: "cls-cp007-multilingual-review-v3" as const,
      editorialVersion: "compact-learner-explanation-v3" as const,
    },
  };
}

export function generateClsCp007LocalizedClusterQuestionV3(
  locale: ClsCp007LocalizedLocale,
  prototypeId: ClsCp007PrototypeId,
  seed: number,
  optionCount: 4 | 5 = 4,
) {
  return compactExplanation(
    generateClsCp007LocalizedClusterQuestionV2(locale, prototypeId, seed, optionCount),
    locale,
    false,
  );
}

export function generateClsCp007LocalizedPairQuestionV3(
  locale: ClsCp007LocalizedLocale,
  seed: number,
  optionCount: 4 | 5 = 4,
) {
  return compactExplanation(
    generateClsCp007LocalizedPairQuestionV2(locale, seed, optionCount),
    locale,
    true,
  );
}
