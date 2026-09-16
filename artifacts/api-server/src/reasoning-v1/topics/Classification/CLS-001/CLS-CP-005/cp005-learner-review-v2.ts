import {
  CLS_CP005_EQUIVALENT_TUPLE_QL_ID,
  CLS_CP005_ODD_TUPLE_QL_ID,
  type ClsCp005EnglishQlId,
} from "./cp005-english-contracts";
import { generateClsCp005Question } from "./cp005-multilingual-runtime";
import type { ClsCp005TranslatedLocale } from "./localization/cp005-language-pack";

function cleanStem(locale: ClsCp005TranslatedLocale, stem: string): string {
  if (locale === "hi-IN") {
    return stem.replaceAll("विषम (अलग) विकल्प", "अलग विकल्प");
  }
  return stem;
}

function conclusion(
  locale: ClsCp005TranslatedLocale,
  qlId: ClsCp005EnglishQlId,
  answer: string,
): string {
  if (locale === "hi-IN") {
    return qlId === CLS_CP005_ODD_TUPLE_QL_ID
      ? `इसलिए ${answer} अलग विकल्प है।`
      : `इसलिए ${answer} सही विकल्प है।`;
  }
  return qlId === CLS_CP005_ODD_TUPLE_QL_ID
    ? `ਇਸ ਲਈ ${answer} ਵੱਖਰਾ ਵਿਕਲਪ ਹੈ।`
    : `ਇਸ ਲਈ ${answer} ਸਹੀ ਵਿਕਲਪ ਹੈ।`;
}

export function toClsCp005LearnerReviewV2<
  T extends ReturnType<typeof generateClsCp005Question>,
>(question: T, locale: ClsCp005TranslatedLocale) {
  const qlId = question.qlId as ClsCp005EnglishQlId;
  let stepByStep: readonly string[];

  if (qlId === CLS_CP005_ODD_TUPLE_QL_ID) {
    const representativeIndex = question.evidenceByOption.findIndex(
      (_, index) => index !== question.correctIndex,
    );
    if (representativeIndex < 0) {
      throw new Error("CP005 learner review requires a matching representative option");
    }
    stepByStep = [
      question.evidenceByOption[representativeIndex]!,
      question.evidenceByOption[question.correctIndex]!,
      conclusion(locale, qlId, question.answer),
    ];
  } else if (qlId === CLS_CP005_EQUIVALENT_TUPLE_QL_ID) {
    const referenceStep = question.explanation.stepByStep[0]
      ?? question.explanation.coreConcept[0]
      ?? (locale === "hi-IN" ? "दिए गए समूह का नियम पहचानिए।" : "ਦਿੱਤੇ ਸਮੂਹ ਦਾ ਨਿਯਮ ਪਛਾਣੋ।");
    stepByStep = [
      referenceStep,
      question.evidenceByOption[question.correctIndex]!,
      conclusion(locale, qlId, question.answer),
    ];
  } else {
    throw new Error(`Unsupported CP005 learner-review QL: ${qlId}`);
  }

  return {
    ...question,
    stem: cleanStem(locale, question.stem),
    explanation: {
      coreConcept: question.explanation.coreConcept,
      stepByStep,
      examSpeedShortcut: [] as readonly string[],
      commonTrapWarning: [] as readonly string[],
    },
    metadata: {
      ...question.metadata,
      learnerReviewVersion: "cls-cp005-learner-review-v2" as const,
      learnerEditorialVersion: "compact-native-explanation-v2" as const,
    },
  };
}

export function generateClsCp005LearnerReviewV2(
  qlId: ClsCp005EnglishQlId,
  locale: ClsCp005TranslatedLocale,
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  return toClsCp005LearnerReviewV2(
    generateClsCp005Question(qlId, locale, seed, requestedOptionCount),
    locale,
  );
}
