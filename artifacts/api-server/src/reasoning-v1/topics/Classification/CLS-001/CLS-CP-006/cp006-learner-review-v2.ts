import {
  CLS_CP006_ODD_LETTER_PAIR_QL_ID,
  CLS_CP006_ODD_LETTER_QL_ID,
  type ClsCp006EnglishQlId,
} from "./cp006-english-contracts";
import { generateClsCp006Question } from "./cp006-multilingual-runtime";
import type { ClsCp006TranslatedLocale } from "./localization/cp006-language-pack";

function cleanText(
  locale: ClsCp006TranslatedLocale,
  ruleId: string,
  value: string,
): string {
  let next = value;
  if (locale === "hi-IN") {
    next = next
      .replaceAll("विषम (अलग) अक्षर", "अलग अक्षर")
      .replaceAll("विषम (अलग) जोड़ा", "अलग जोड़ा")
      .replaceAll("एक ही आंतरिक नियम", "एक ही नियम");
  } else {
    next = next.replaceAll("ਇੱਕੋ ਅੰਦਰੂਨੀ ਨਿਯਮ", "ਇੱਕੋ ਨਿਯਮ");
    if (ruleId === "LETTER_POSITION_PARITY") {
      next = next.replaceAll("ਜੋੜਾ", "ਜਿਸਤ");
    }
  }
  return next;
}

function conclusion(
  locale: ClsCp006TranslatedLocale,
  qlId: ClsCp006EnglishQlId,
  answer: string,
): string {
  if (locale === "hi-IN") {
    return qlId === CLS_CP006_ODD_LETTER_PAIR_QL_ID
      ? `इसलिए ${answer} अलग अक्षर-जोड़ी है।`
      : `इसलिए ${answer} अलग अक्षर है।`;
  }
  return qlId === CLS_CP006_ODD_LETTER_PAIR_QL_ID
    ? `ਇਸ ਲਈ ${answer} ਵੱਖਰਾ ਅੱਖਰ-ਜੋੜਾ ਹੈ।`
    : `ਇਸ ਲਈ ${answer} ਵੱਖਰਾ ਅੱਖਰ ਹੈ।`;
}

export function toClsCp006LearnerReviewV2<
  T extends ReturnType<typeof generateClsCp006Question>,
>(question: T, locale: ClsCp006TranslatedLocale) {
  const qlId = question.qlId as ClsCp006EnglishQlId;
  const map = (value: string) => cleanText(locale, question.intendedRuleId, value);
  const representativeIndex = question.evidenceByOption.findIndex(
    (_, index) => index !== question.correctIndex,
  );
  if (representativeIndex < 0) {
    throw new Error("CP006 learner review requires a matching representative option");
  }

  return {
    ...question,
    stem: map(question.stem),
    explanation: {
      coreConcept: question.explanation.coreConcept.map(map),
      stepByStep: [
        map(question.evidenceByOption[representativeIndex]!),
        map(question.evidenceByOption[question.correctIndex]!),
        conclusion(locale, qlId, question.answer),
      ] as readonly string[],
      examSpeedShortcut: [] as readonly string[],
      commonTrapWarning: [] as readonly string[],
    },
    metadata: {
      ...question.metadata,
      learnerReviewVersion: "cls-cp006-learner-review-v2" as const,
      learnerEditorialVersion: "compact-native-explanation-v2" as const,
    },
  };
}

export function generateClsCp006LearnerReviewV2(
  qlId: ClsCp006EnglishQlId,
  locale: ClsCp006TranslatedLocale,
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  return toClsCp006LearnerReviewV2(
    generateClsCp006Question(qlId, locale, seed, requestedOptionCount),
    locale,
  );
}

export const CLS_CP006_LEARNER_REVIEW_QLS = [
  CLS_CP006_ODD_LETTER_QL_ID,
  CLS_CP006_ODD_LETTER_PAIR_QL_ID,
] as const;
