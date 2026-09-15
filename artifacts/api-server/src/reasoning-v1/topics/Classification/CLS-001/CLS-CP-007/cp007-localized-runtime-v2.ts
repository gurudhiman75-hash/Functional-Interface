import {
  generateClsCp007LocalizedClusterQuestion,
  generateClsCp007LocalizedPairQuestion,
  type ClsCp007LocalizedLocale,
} from "./cp007-localized-runtime";
import type { ClsCp007PrototypeId } from "./types";

function simplifyHindi(value: string): string {
  return value
    .replaceAll("क्रमिक अंतर के परिमाण", "क्रमिक अंतर, +/− चिह्न हटाकर")
    .replaceAll("घटाया हुआ अंतर-अनुपात", "अंतर का सरल अनुपात")
    .replaceAll("घटाया अनुपात", "सरल अनुपात")
    .replaceAll("हर संबंधित जोड़ी का योग 27 नहीं है।", "कम-से-कम एक संबंधित जोड़ी का योग 27 नहीं है।");
}

function simplifyPunjabi(value: string): string {
  return value
    .replaceAll("ਲੜੀਵਾਰ ਅੰਤਰਾਂ ਦੇ ਪਰਿਮਾਣ", "ਲੜੀਵਾਰ ਅੰਤਰ, +/− ਨਿਸ਼ਾਨ ਹਟਾ ਕੇ")
    .replaceAll("ਘਟਾਇਆ ਹੋਇਆ ਅੰਤਰ-ਅਨੁਪਾਤ", "ਅੰਤਰਾਂ ਦਾ ਸਰਲ ਅਨੁਪਾਤ")
    .replaceAll("ਘਟਾਇਆ ਅਨੁਪਾਤ", "ਸਰਲ ਅਨੁਪਾਤ")
    .replaceAll("ਵਿਰੋਧੀ", "ਉਲਟ")
    .replaceAll("ਹਰ ਸੰਬੰਧਿਤ ਜੋੜੀ ਦਾ ਜੋੜ 27 ਨਹੀਂ ਹੈ।", "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸੰਬੰਧਿਤ ਜੋੜੀ ਦਾ ਜੋੜ 27 ਨਹੀਂ ਹੈ।");
}

function transform(locale: ClsCp007LocalizedLocale, value: string): string {
  return locale === "hi-IN" ? simplifyHindi(value) : simplifyPunjabi(value);
}

function editorialize<T extends {
  readonly stem: string;
  readonly evidenceByOption: readonly string[];
  readonly explanation: {
    readonly coreConcept: readonly string[];
    readonly stepByStep: readonly string[];
    readonly examSpeedShortcut: readonly string[];
    readonly commonTrapWarning: readonly string[];
  };
  readonly metadata: Record<string, unknown>;
}>(question: T, locale: ClsCp007LocalizedLocale) {
  const map = (value: string) => transform(locale, value);
  return {
    ...question,
    stem: map(question.stem),
    evidenceByOption: question.evidenceByOption.map(map),
    explanation: {
      coreConcept: question.explanation.coreConcept.map(map),
      stepByStep: question.explanation.stepByStep.map(map),
      examSpeedShortcut: [] as readonly string[],
      commonTrapWarning: [] as readonly string[],
    },
    metadata: {
      ...question.metadata,
      runtimeVersion: "cls-cp007-multilingual-review-v2" as const,
      editorialVersion: "simple-native-language-v2" as const,
    },
  };
}

export function generateClsCp007LocalizedClusterQuestionV2(
  locale: ClsCp007LocalizedLocale,
  prototypeId: ClsCp007PrototypeId,
  seed: number,
  optionCount: 4 | 5 = 4,
) {
  return editorialize(
    generateClsCp007LocalizedClusterQuestion(locale, prototypeId, seed, optionCount),
    locale,
  );
}

export function generateClsCp007LocalizedPairQuestionV2(
  locale: ClsCp007LocalizedLocale,
  seed: number,
  optionCount: 4 | 5 = 4,
) {
  return editorialize(generateClsCp007LocalizedPairQuestion(locale, seed, optionCount), locale);
}
