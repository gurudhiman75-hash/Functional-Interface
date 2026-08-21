import { createHash } from 'node:crypto';

import type { RnkCp001LocalizedLocale } from './cp001-localization-review-v1';
import {
  buildRnkCp001LocalizedReviewBankV3,
  localizeRnkCp001PermanentQuestionV3,
  type RnkCp001LocalizedReviewQuestionV3,
} from './cp001-localization-review-v3';
import type { RnkCp001PermanentQuestion } from './cp001-permanent-runtime';

export const RNK_CP001_LOCALIZATION_REVIEW_V4_VERSION =
  'RNK_CP001_HI_PA_LOCALIZATION_REVIEW_V4' as const;
export const RNK_CP001_LOCALIZATION_REVIEW_V4_AUTHORITY =
  'RNK_CP001_HI_PA_NATIVE_EDITORIAL_REVIEW_V4' as const;
export const RNK_CP001_LOCALIZATION_REVIEW_V4_EDITORIAL =
  'NATURAL_NATIVE_VISIBLE_COUNT_LABELS_V4' as const;

export type RnkCp001LocalizedReviewQuestionV4 = Omit<
  RnkCp001LocalizedReviewQuestionV3,
  'explanation' | 'reviewMetadata' | 'localizationProof'
> & {
  readonly explanation: RnkCp001LocalizedReviewQuestionV3['explanation'];
  readonly reviewMetadata: Omit<RnkCp001LocalizedReviewQuestionV3['reviewMetadata'], 'localization'> & {
    readonly localization: Readonly<{
      version: typeof RNK_CP001_LOCALIZATION_REVIEW_V4_VERSION;
      locale: RnkCp001LocalizedLocale;
      learnerTextLocalized: true;
      humanLanguageReviewRequired: true;
      editorialVersion: typeof RNK_CP001_LOCALIZATION_REVIEW_V4_EDITORIAL;
    }>;
  };
  readonly localizationProof: Omit<
    RnkCp001LocalizedReviewQuestionV3['localizationProof'],
    'authority' | 'localizationFingerprint' | 'editorialVersion'
  > & {
    readonly authority: typeof RNK_CP001_LOCALIZATION_REVIEW_V4_AUTHORITY;
    readonly localizationFingerprint: string;
    readonly editorialVersion: typeof RNK_CP001_LOCALIZATION_REVIEW_V4_EDITORIAL;
  };
};

function sha256(value: unknown): string {
  return createHash('sha256')
    .update(typeof value === 'string' ? value : JSON.stringify(value), 'utf8')
    .digest('hex');
}

export function naturalizeRnkCp001VisibleCountLabels(
  visibleGivens: string,
  locale: RnkCp001LocalizedLocale,
): string {
  if (locale === 'hi-IN') {
    return visibleGivens
      .replaceAll('ऊपर अभ्यर्थी =', 'ऊपर अभ्यर्थियों की संख्या =')
      .replaceAll('नीचे अभ्यर्थी =', 'नीचे अभ्यर्थियों की संख्या =')
      .replaceAll('बाएँ व्यक्ति =', 'बाएँ व्यक्तियों की संख्या =')
      .replaceAll('दाएँ व्यक्ति =', 'दाएँ व्यक्तियों की संख्या =')
      .replaceAll('आगे व्यक्ति =', 'आगे व्यक्तियों की संख्या =')
      .replaceAll('पीछे व्यक्ति =', 'पीछे व्यक्तियों की संख्या =');
  }
  return visibleGivens
    .replaceAll('ਉੱਪਰ ਉਮੀਦਵਾਰ =', 'ਉੱਪਰ ਉਮੀਦਵਾਰਾਂ ਦੀ ਗਿਣਤੀ =')
    .replaceAll('ਹੇਠਾਂ ਉਮੀਦਵਾਰ =', 'ਹੇਠਾਂ ਉਮੀਦਵਾਰਾਂ ਦੀ ਗਿਣਤੀ =')
    .replaceAll('ਖੱਬੇ ਵਿਅਕਤੀ =', 'ਖੱਬੇ ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ =')
    .replaceAll('ਸੱਜੇ ਵਿਅਕਤੀ =', 'ਸੱਜੇ ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ =')
    .replaceAll('ਅੱਗੇ ਵਿਅਕਤੀ =', 'ਅੱਗੇ ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ =')
    .replaceAll('ਪਿੱਛੇ ਵਿਅਕਤੀ =', 'ਪਿੱਛੇ ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ =');
}

export function localizeRnkCp001V3QuestionToV4(
  question: RnkCp001LocalizedReviewQuestionV3,
): RnkCp001LocalizedReviewQuestionV4 {
  const firstStep = naturalizeRnkCp001VisibleCountLabels(
    question.explanation.stepByStepSolution[0]!,
    question.locale,
  );
  const explanation = {
    ...question.explanation,
    stepByStepSolution: [
      firstStep,
      question.explanation.stepByStepSolution[1]!,
      question.explanation.stepByStepSolution[2]!,
    ] as const,
  };
  const localizationFingerprint = sha256({
    version: RNK_CP001_LOCALIZATION_REVIEW_V4_VERSION,
    permanentQlId: question.permanentQlId,
    seed: question.seed,
    canonicalSemanticFingerprint: question.localizationProof.canonicalSemanticFingerprint,
    locale: question.locale,
    targetName: question.targetName,
    stem: question.stem,
    options: question.options,
    explanation,
  });

  return {
    ...question,
    explanation,
    reviewMetadata: {
      ...question.reviewMetadata,
      localization: {
        version: RNK_CP001_LOCALIZATION_REVIEW_V4_VERSION,
        locale: question.locale,
        learnerTextLocalized: true,
        humanLanguageReviewRequired: true,
        editorialVersion: RNK_CP001_LOCALIZATION_REVIEW_V4_EDITORIAL,
      },
    },
    localizationProof: {
      ...question.localizationProof,
      authority: RNK_CP001_LOCALIZATION_REVIEW_V4_AUTHORITY,
      localizationFingerprint,
      editorialVersion: RNK_CP001_LOCALIZATION_REVIEW_V4_EDITORIAL,
    },
  };
}

export function localizeRnkCp001PermanentQuestionV4(
  question: RnkCp001PermanentQuestion,
  locale: RnkCp001LocalizedLocale,
): RnkCp001LocalizedReviewQuestionV4 {
  return localizeRnkCp001V3QuestionToV4(localizeRnkCp001PermanentQuestionV3(question, locale));
}

export function buildRnkCp001LocalizedReviewBankV4(
  locale: RnkCp001LocalizedLocale,
  seedsPerQl = 128,
): readonly RnkCp001LocalizedReviewQuestionV4[] {
  return buildRnkCp001LocalizedReviewBankV3(locale, seedsPerQl).map(localizeRnkCp001V3QuestionToV4);
}
