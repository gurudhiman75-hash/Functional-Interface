import {
  generateClsCp004LocalizedQuestion,
  type ClsCp004TranslatedLocale,
  type GeneratedClsCp004LocalizedQuestion,
} from "./cp004-localized-runtime";

export type GeneratedClsCp004LocalizedReviewQuestion = Omit<GeneratedClsCp004LocalizedQuestion, "metadata"> & {
  readonly metadata: Omit<GeneratedClsCp004LocalizedQuestion["metadata"], "runtimeVersion"> & {
    readonly runtimeVersion: "cls-cp004-multilingual-review-v3";
    readonly languageReviewVersion: "native-language-v3";
  };
};

function standardizeHindiReviewText(value: string): string {
  return value.replaceAll(
    "निम्नलिखित में से विषम संख्या चुनिए।",
    "निम्नलिखित में से अलग संख्या चुनिए।",
  );
}

function standardizePunjabiReviewText(value: string): string {
  return value
    .replaceAll("ਜੁੜੀ ਸੰਖਿਆ", "ਜਿਸਤ ਸੰਖਿਆ")
    .replaceAll("ਸਾਰੇ ਅੰਕ ਜੁੜੇ ਹਨ", "ਸਾਰੇ ਅੰਕ ਜਿਸਤ ਹਨ")
    .replaceAll("ਅੰਕਾਂ ਵਿੱਚ ਜੁੜੇ ਅਤੇ ਟਾਂਕ", "ਅੰਕਾਂ ਵਿੱਚ ਜਿਸਤ ਅਤੇ ਟਾਂਕ")
    .replaceAll(" ਜੁੜੀ ਸੰਖਿਆ ਹੈ", " ਜਿਸਤ ਸੰਖਿਆ ਹੈ");
}

function applyLanguageReview(
  question: GeneratedClsCp004LocalizedQuestion,
  transform: (value: string) => string,
): GeneratedClsCp004LocalizedReviewQuestion {
  return {
    ...question,
    stem: transform(question.stem),
    evidenceByOption: question.evidenceByOption.map(transform),
    explanation: {
      ...question.explanation,
      coreConcept: question.explanation.coreConcept.map(transform),
      stepByStep: question.explanation.stepByStep.map(transform),
      examSpeedShortcut: question.explanation.examSpeedShortcut.map(transform),
      commonTrapWarning: question.explanation.commonTrapWarning.map(transform),
    },
    metadata: {
      ...question.metadata,
      runtimeVersion: "cls-cp004-multilingual-review-v3",
      languageReviewVersion: "native-language-v3",
    },
  };
}

export function generateClsCp004LocalizedReviewQuestion(
  locale: ClsCp004TranslatedLocale,
  seed = 0,
  requestedOptionCount?: 4 | 5,
): GeneratedClsCp004LocalizedReviewQuestion {
  const base = generateClsCp004LocalizedQuestion(locale, seed, requestedOptionCount);
  return applyLanguageReview(
    base,
    locale === "hi-IN" ? standardizeHindiReviewText : standardizePunjabiReviewText,
  );
}
