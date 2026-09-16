import {
  generateClsCp004LocalizedQuestion,
  type ClsCp004TranslatedLocale,
  type GeneratedClsCp004LocalizedQuestion,
} from "./cp004-localized-runtime";

export type GeneratedClsCp004LocalizedReviewQuestion = Omit<GeneratedClsCp004LocalizedQuestion, "metadata"> & {
  readonly metadata: Omit<GeneratedClsCp004LocalizedQuestion["metadata"], "runtimeVersion"> & {
    readonly runtimeVersion: "cls-cp004-multilingual-review-v4";
    readonly languageReviewVersion: "native-language-v4";
  };
};

function standardizeHindiReviewText(value: string): string {
  return value
    .replaceAll(
      "निम्नलिखित में से विषम संख्या चुनिए।",
      "निम्नलिखित में से अलग संख्या चुनिए।",
    )
    .replace(/(\d+) में अंकों में सम और विषम दोनों प्रकार हैं/g, "$1 में सम और विषम दोनों प्रकार के अंक हैं")
    .replace(/(\d+), (किसी पूर्ण (?:वर्ग|घन) से 1 (?:कम|अधिक) है)/g, "$1 $2")
    .replace(
      /, इसलिए यह त्रिभुजीय है, इसलिए यह बाकी संख्याओं से अलग है।/g,
      ", अतः यह त्रिभुजीय है और बाकी संख्याओं से अलग है।",
    );
}

function standardizePunjabiReviewText(value: string): string {
  return value
    .replaceAll("ਜੁੜੀ ਸੰਖਿਆ", "ਜਿਸਤ ਸੰਖਿਆ")
    .replaceAll("ਸਾਰੇ ਅੰਕ ਜੁੜੇ ਹਨ", "ਸਾਰੇ ਅੰਕ ਜਿਸਤ ਹਨ")
    .replaceAll("ਅੰਕਾਂ ਵਿੱਚ ਜੁੜੇ ਅਤੇ ਟਾਂਕ", "ਅੰਕਾਂ ਵਿੱਚ ਜਿਸਤ ਅਤੇ ਟਾਂਕ")
    .replaceAll(" ਜੁੜੀ ਸੰਖਿਆ ਹੈ", " ਜਿਸਤ ਸੰਖਿਆ ਹੈ")
    .replace(/(\d+) ਵਿੱਚ ਅੰਕਾਂ ਵਿੱਚ ਜਿਸਤ ਅਤੇ ਟਾਂਕ ਦੋਵੇਂ ਕਿਸਮਾਂ ਹਨ/g, "$1 ਵਿੱਚ ਜਿਸਤ ਅਤੇ ਟਾਂਕ ਦੋਵੇਂ ਕਿਸਮਾਂ ਦੇ ਅੰਕ ਹਨ")
    .replace(/(\d+), (ਕਿਸੇ ਪੂਰਨ (?:ਵਰਗ|ਘਣ) ਤੋਂ 1 (?:ਘੱਟ|ਵੱਧ) ਹੈ)/g, "$1 $2")
    .replace(
      /, ਇਸ ਲਈ ਇਹ ਤਿਕੋਣੀ ਹੈ, ਇਸ ਲਈ ਇਹ ਬਾਕੀ ਸੰਖਿਆਵਾਂ ਤੋਂ ਵੱਖਰੀ ਹੈ।/g,
      ", ਇਸ ਕਰਕੇ ਇਹ ਤਿਕੋਣੀ ਹੈ ਅਤੇ ਬਾਕੀ ਸੰਖਿਆਵਾਂ ਤੋਂ ਵੱਖਰੀ ਹੈ।",
    );
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
      runtimeVersion: "cls-cp004-multilingual-review-v4",
      languageReviewVersion: "native-language-v4",
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
