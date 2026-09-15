import {
  generateClsCp004LocalizedQuestion,
  type ClsCp004TranslatedLocale,
  type GeneratedClsCp004LocalizedQuestion,
} from "./cp004-localized-runtime";

export type GeneratedClsCp004LocalizedReviewQuestion = Omit<GeneratedClsCp004LocalizedQuestion, "metadata"> & {
  readonly metadata: Omit<GeneratedClsCp004LocalizedQuestion["metadata"], "runtimeVersion"> & {
    readonly runtimeVersion: "cls-cp004-multilingual-review-v2";
    readonly languageReviewVersion: "punjabi-math-terms-v2";
  };
};

function standardizePunjabiMath(value: string): string {
  return value
    .replaceAll("ਜੁੜੀ ਸੰਖਿਆ", "ਜਿਸਤ ਸੰਖਿਆ")
    .replaceAll("ਸਾਰੇ ਅੰਕ ਜੁੜੇ ਹਨ", "ਸਾਰੇ ਅੰਕ ਜਿਸਤ ਹਨ")
    .replaceAll("ਅੰਕਾਂ ਵਿੱਚ ਜੁੜੇ ਅਤੇ ਟਾਂਕ", "ਅੰਕਾਂ ਵਿੱਚ ਜਿਸਤ ਅਤੇ ਟਾਂਕ")
    .replaceAll(" ਜੁੜੀ ਸੰਖਿਆ ਹੈ", " ਜਿਸਤ ਸੰਖਿਆ ਹੈ");
}

function applyPunjabiTerminology(
  question: GeneratedClsCp004LocalizedQuestion,
): GeneratedClsCp004LocalizedReviewQuestion {
  return {
    ...question,
    stem: standardizePunjabiMath(question.stem),
    evidenceByOption: question.evidenceByOption.map(standardizePunjabiMath),
    explanation: {
      ...question.explanation,
      coreConcept: question.explanation.coreConcept.map(standardizePunjabiMath),
      stepByStep: question.explanation.stepByStep.map(standardizePunjabiMath),
      examSpeedShortcut: question.explanation.examSpeedShortcut.map(standardizePunjabiMath),
      commonTrapWarning: question.explanation.commonTrapWarning.map(standardizePunjabiMath),
    },
    metadata: {
      ...question.metadata,
      runtimeVersion: "cls-cp004-multilingual-review-v2",
      languageReviewVersion: "punjabi-math-terms-v2",
    },
  };
}

export function generateClsCp004LocalizedReviewQuestion(
  locale: ClsCp004TranslatedLocale,
  seed = 0,
  requestedOptionCount?: 4 | 5,
): GeneratedClsCp004LocalizedReviewQuestion {
  const base = generateClsCp004LocalizedQuestion(locale, seed, requestedOptionCount);
  if (locale === "hi-IN") {
    return {
      ...base,
      metadata: {
        ...base.metadata,
        runtimeVersion: "cls-cp004-multilingual-review-v2",
        languageReviewVersion: "punjabi-math-terms-v2",
      },
    };
  }
  return applyPunjabiTerminology(base);
}
