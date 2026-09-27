import { createHash } from 'node:crypto';

import type {
  RnkCp003LocalizedLocale,
  RnkCp003LocalizedReviewQuestion,
} from './cp003-localization-review-v1';
import {
  buildRnkCp003LocalizedReviewBankV3,
  localizeRnkCp003PermanentQuestionV3,
} from './cp003-localization-review-v3';

export const RNK_CP003_LOCALIZATION_REVIEW_V4_VERSION =
  'RNK_CP003_HI_PA_LOCALIZATION_REVIEW_V4' as const;
export const RNK_CP003_LOCALIZATION_REVIEW_V4_AUTHORITY =
  'RNK_CP003_HI_PA_STRUCTURED_TRANSFORMATION_REVIEW_V4' as const;
export const RNK_CP003_LOCALIZATION_REVIEW_V4_EDITORIAL =
  'RNK_CP003_FINAL_MICRO_EDITORIAL_V4' as const;

type AnyQuestion = Record<string, any>;

function sha256(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(value), 'utf8').digest('hex');
}

export function repairRnkCp003MicroEditorialV4(
  text: string,
  locale: RnkCp003LocalizedLocale,
): string {
  if (locale === 'hi-IN') {
    return text
      .replaceAll('माँगे गए सिरों में रैंकें', 'माँगे गए सिरों से रैंकें')
      .replaceAll('अंतिम आगे से रैंक', 'अंत में आगे से रैंक')
      .replaceAll('अंतिम पीछे से रैंक', 'अंत में पीछे से रैंक')
      .replace(/नया (अभ्यर्थी|व्यक्ति|धावक) नई कुल संख्या (\d+) में संदर्भ स्थिति (\d+) पर है।/gu,
        'कुल संख्या $2 होने के बाद, नया $1 संदर्भ स्थिति $3 पर है।');
  }
  return text
    .replaceAll('ਮੰਗੇ ਸਿਰਿਆਂ ਵਿੱਚ ਰੈਂਕਾਂ', 'ਮੰਗੇ ਸਿਰਿਆਂ ਤੋਂ ਰੈਂਕਾਂ')
    .replaceAll('ਅੰਤਿਮ ਅੱਗੋਂ ਰੈਂਕ', 'ਅੰਤ ਵਿੱਚ ਅੱਗੋਂ ਰੈਂਕ')
    .replaceAll('ਅੰਤਿਮ ਪਿੱਛੋਂ ਰੈਂਕ', 'ਅੰਤ ਵਿੱਚ ਪਿੱਛੋਂ ਰੈਂਕ')
    .replace(/ਨਵਾਂ (ਉਮੀਦਵਾਰ|ਵਿਅਕਤੀ|ਦੌੜਾਕ) ਨਵੀਂ ਕੁੱਲ ਗਿਣਤੀ (\d+) ਵਿੱਚ ਹਵਾਲਾ ਸਥਿਤੀ (\d+) ਉੱਤੇ ਹੈ।/gu,
      'ਕੁੱਲ ਗਿਣਤੀ $2 ਹੋਣ ਤੋਂ ਬਾਅਦ, ਨਵਾਂ $1 ਹਵਾਲਾ ਸਥਿਤੀ $3 ਉੱਤੇ ਹੈ।');
}

export function applyRnkCp003LocalizationEditorialV4(
  question: RnkCp003LocalizedReviewQuestion,
): RnkCp003LocalizedReviewQuestion {
  const locale = question.locale;
  const stem = repairRnkCp003MicroEditorialV4(question.stem, locale);
  const options = question.options.map((option: AnyQuestion) => ({
    ...option,
    label: repairRnkCp003MicroEditorialV4(String(option.label), locale),
    explanation: repairRnkCp003MicroEditorialV4(String(option.explanation), locale),
  }));
  const explanation = {
    keyRule: repairRnkCp003MicroEditorialV4(question.explanation.keyRule, locale),
    stepByStepSolution: question.explanation.stepByStepSolution.map((line) => repairRnkCp003MicroEditorialV4(line, locale)),
    examSpeedShortcut: repairRnkCp003MicroEditorialV4(question.explanation.examSpeedShortcut, locale),
    optionAnalysis: question.explanation.optionAnalysis.map((line) => repairRnkCp003MicroEditorialV4(line, locale)),
    conclusion: repairRnkCp003MicroEditorialV4(question.explanation.conclusion, locale),
  };
  const answer = typeof question.answer === 'string'
    ? repairRnkCp003MicroEditorialV4(question.answer, locale)
    : question.answer;
  const localizationFingerprint = sha256({
    version: RNK_CP003_LOCALIZATION_REVIEW_V4_VERSION,
    editorialVersion: RNK_CP003_LOCALIZATION_REVIEW_V4_EDITORIAL,
    locale,
    permanentQlId: question.permanentQlId,
    prototypeId: question.prototypeId,
    seed: question.seed,
    stem,
    answer,
    options: options.map((option: AnyQuestion) => ({
      answerKey: option.answerKey,
      answer: option.answer,
      label: option.label,
      misconceptionId: option.misconceptionId,
      explanation: option.explanation,
    })),
    explanation,
  });

  return {
    ...question,
    stem,
    answer,
    options,
    explanation,
    localizationMetadata: {
      ...question.localizationMetadata,
      version: RNK_CP003_LOCALIZATION_REVIEW_V4_VERSION,
      editorialVersion: RNK_CP003_LOCALIZATION_REVIEW_V4_EDITORIAL,
    },
    localizationProof: {
      ...question.localizationProof,
      authority: RNK_CP003_LOCALIZATION_REVIEW_V4_AUTHORITY,
      localizationFingerprint,
      editorialVersion: RNK_CP003_LOCALIZATION_REVIEW_V4_EDITORIAL,
    },
  } as RnkCp003LocalizedReviewQuestion;
}

export function localizeRnkCp003PermanentQuestionV4(
  question: AnyQuestion,
  locale: RnkCp003LocalizedLocale,
): RnkCp003LocalizedReviewQuestion {
  return applyRnkCp003LocalizationEditorialV4(localizeRnkCp003PermanentQuestionV3(question, locale));
}

export function buildRnkCp003LocalizedReviewBankV4(
  locale: RnkCp003LocalizedLocale,
  seedsPerQl = 192,
): readonly RnkCp003LocalizedReviewQuestion[] {
  return buildRnkCp003LocalizedReviewBankV3(locale, seedsPerQl).map(applyRnkCp003LocalizationEditorialV4);
}
