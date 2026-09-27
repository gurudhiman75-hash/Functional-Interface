import { createHash } from 'node:crypto';

import {
  buildRnkCp002LocalizedReviewBank,
  localizeRnkCp002PermanentQuestion,
  type RnkCp002LocalizedLocale,
  type RnkCp002LocalizedReviewQuestion,
} from './cp002-localization-review-v1';
import type { RnkCp002PermanentQuestion } from './cp002-permanent-runtime';

export const RNK_CP002_LOCALIZATION_REVIEW_V2_VERSION =
  'RNK_CP002_HI_PA_LOCALIZATION_REVIEW_V2' as const;
export const RNK_CP002_LOCALIZATION_REVIEW_V2_AUTHORITY =
  'RNK_CP002_HI_PA_NATIVE_EDITORIAL_REVIEW_V2' as const;
export const RNK_CP002_LOCALIZATION_REVIEW_V2_EDITORIAL =
  'NATIVE_EXTREME_GENITIVE_AND_COPULA_V2' as const;

export type RnkCp002LocalizedReviewQuestionV2 = Omit<
  RnkCp002LocalizedReviewQuestion,
  'stem' | 'options' | 'explanation' | 'reviewMetadata' | 'localizationProof'
> & {
  readonly stem: string;
  readonly options: RnkCp002LocalizedReviewQuestion['options'];
  readonly explanation: RnkCp002LocalizedReviewQuestion['explanation'];
  readonly reviewMetadata: Omit<RnkCp002LocalizedReviewQuestion['reviewMetadata'], 'localization'> & {
    readonly localization: Readonly<{
      version: typeof RNK_CP002_LOCALIZATION_REVIEW_V2_VERSION;
      locale: RnkCp002LocalizedLocale;
      learnerTextLocalized: true;
      structuredEvidenceRendered: true;
      canonicalOutcomeLocalization: true;
      humanLanguageReviewRequired: true;
      editorialVersion: typeof RNK_CP002_LOCALIZATION_REVIEW_V2_EDITORIAL;
    }>;
  };
  readonly localizationProof: Omit<
    RnkCp002LocalizedReviewQuestion['localizationProof'],
    'authority' | 'localizationFingerprint'
  > & {
    readonly authority: typeof RNK_CP002_LOCALIZATION_REVIEW_V2_AUTHORITY;
    readonly localizationFingerprint: string;
    readonly editorialVersion: typeof RNK_CP002_LOCALIZATION_REVIEW_V2_EDITORIAL;
  };
};

function sha256(value: unknown): string {
  return createHash('sha256')
    .update(typeof value === 'string' ? value : JSON.stringify(value), 'utf8')
    .digest('hex');
}

export function repairRnkCp002ExtremeGenitive(
  stem: string,
  locale: RnkCp002LocalizedLocale,
): string {
  if (locale === 'hi-IN') {
    return stem
      .replaceAll('अभ्यर्थी की अधिकतम संख्या', 'अभ्यर्थियों की अधिकतम संख्या')
      .replaceAll('अभ्यर्थी की न्यूनतम संख्या', 'अभ्यर्थियों की न्यूनतम संख्या')
      .replaceAll('व्यक्ति की अधिकतम संख्या', 'व्यक्तियों की अधिकतम संख्या')
      .replaceAll('व्यक्ति की न्यूनतम संख्या', 'व्यक्तियों की न्यूनतम संख्या');
  }
  return stem
    .replaceAll('ਉਮੀਦਵਾਰ ਦੀ ਵੱਧ ਤੋਂ ਵੱਧ ਗਿਣਤੀ', 'ਉਮੀਦਵਾਰਾਂ ਦੀ ਵੱਧ ਤੋਂ ਵੱਧ ਗਿਣਤੀ')
    .replaceAll('ਉਮੀਦਵਾਰ ਦੀ ਘੱਟ ਤੋਂ ਘੱਟ ਗਿਣਤੀ', 'ਉਮੀਦਵਾਰਾਂ ਦੀ ਘੱਟ ਤੋਂ ਘੱਟ ਗਿਣਤੀ')
    .replaceAll('ਵਿਅਕਤੀ ਦੀ ਵੱਧ ਤੋਂ ਵੱਧ ਗਿਣਤੀ', 'ਵਿਅਕਤੀਆਂ ਦੀ ਵੱਧ ਤੋਂ ਵੱਧ ਗਿਣਤੀ')
    .replaceAll('ਵਿਅਕਤੀ ਦੀ ਘੱਟ ਤੋਂ ਘੱਟ ਗਿਣਤੀ', 'ਵਿਅਕਤੀਆਂ ਦੀ ਘੱਟ ਤੋਂ ਘੱਟ ਗਿਣਤੀ');
}

export function repairRnkCp002DoubleCopula(
  text: string,
  locale: RnkCp002LocalizedLocale,
): string {
  return locale === 'hi-IN'
    ? text.replaceAll('है है।', 'है।')
    : text.replaceAll('ਹੈ ਹੈ।', 'ਹੈ।');
}

export function localizeRnkCp002V1QuestionToV2(
  question: RnkCp002LocalizedReviewQuestion,
): RnkCp002LocalizedReviewQuestionV2 {
  const stem = question.qlId === 'RNK-QL-015'
    ? repairRnkCp002ExtremeGenitive(question.stem, question.locale)
    : question.stem;
  const options = question.options.map((option) => ({
    ...option,
    explanation: repairRnkCp002DoubleCopula(option.explanation, question.locale),
  }));
  const optionAnalysis = options.map((option, index) => question.locale === 'hi-IN'
    ? `विकल्प ${index + 1} (${option.label}): ${option.explanation}`
    : `ਵਿਕਲਪ ${index + 1} (${option.label}): ${option.explanation}`);
  const explanation = {
    ...question.explanation,
    optionAnalysis,
    conclusion: repairRnkCp002DoubleCopula(question.explanation.conclusion, question.locale),
  };
  const localizationFingerprint = sha256({
    version: RNK_CP002_LOCALIZATION_REVIEW_V2_VERSION,
    permanentQlId: question.permanentQlId,
    seed: question.seed,
    canonicalSemanticFingerprint: question.localizationProof.canonicalSemanticFingerprint,
    locale: question.locale,
    firstName: question.firstName,
    secondName: question.secondName,
    stem,
    answer: question.answer,
    options,
    explanation,
  });

  return {
    ...question,
    stem,
    options,
    explanation,
    reviewMetadata: {
      ...question.reviewMetadata,
      localization: {
        version: RNK_CP002_LOCALIZATION_REVIEW_V2_VERSION,
        locale: question.locale,
        learnerTextLocalized: true,
        structuredEvidenceRendered: true,
        canonicalOutcomeLocalization: true,
        humanLanguageReviewRequired: true,
        editorialVersion: RNK_CP002_LOCALIZATION_REVIEW_V2_EDITORIAL,
      },
    },
    localizationProof: {
      ...question.localizationProof,
      authority: RNK_CP002_LOCALIZATION_REVIEW_V2_AUTHORITY,
      localizationFingerprint,
      editorialVersion: RNK_CP002_LOCALIZATION_REVIEW_V2_EDITORIAL,
    },
  };
}

export function localizeRnkCp002PermanentQuestionV2(
  question: RnkCp002PermanentQuestion,
  locale: RnkCp002LocalizedLocale,
): RnkCp002LocalizedReviewQuestionV2 {
  return localizeRnkCp002V1QuestionToV2(localizeRnkCp002PermanentQuestion(question, locale));
}

export function buildRnkCp002LocalizedReviewBankV2(
  locale: RnkCp002LocalizedLocale,
  seedsPerQl = 192,
): readonly RnkCp002LocalizedReviewQuestionV2[] {
  return buildRnkCp002LocalizedReviewBank(locale, seedsPerQl).map(localizeRnkCp002V1QuestionToV2);
}
