import { createHash } from 'node:crypto';

import type { RnkCp001LocalizedLocale } from './cp001-localization-review-v1';
import {
  buildRnkCp001LocalizedReviewBankV2,
  localizeRnkCp001PermanentQuestionV2,
  type RnkCp001LocalizedReviewQuestionV2,
} from './cp001-localization-review-v2';
import {
  RNK_CP001_PERMANENT_QL_IDS,
  generateRnkCp001PermanentQuestion,
  type RnkCp001PermanentQuestion,
} from './cp001-permanent-runtime';

export const RNK_CP001_LOCALIZATION_REVIEW_V3_VERSION =
  'RNK_CP001_HI_PA_LOCALIZATION_REVIEW_V3' as const;
export const RNK_CP001_LOCALIZATION_REVIEW_V3_AUTHORITY =
  'RNK_CP001_HI_PA_NATIVE_EDITORIAL_REVIEW_V3' as const;
export const RNK_CP001_LOCALIZATION_REVIEW_V3_EDITORIAL =
  'BOUNDARY_SAFE_NATIVE_ORDINALS_V3' as const;

export type RnkCp001LocalizedReviewQuestionV3 = Omit<
  RnkCp001LocalizedReviewQuestionV2,
  'stem' | 'reviewMetadata' | 'localizationProof'
> & {
  readonly stem: string;
  readonly reviewMetadata: Omit<RnkCp001LocalizedReviewQuestionV2['reviewMetadata'], 'localization'> & {
    readonly localization: Readonly<{
      version: typeof RNK_CP001_LOCALIZATION_REVIEW_V3_VERSION;
      locale: RnkCp001LocalizedLocale;
      learnerTextLocalized: true;
      humanLanguageReviewRequired: true;
      editorialVersion: typeof RNK_CP001_LOCALIZATION_REVIEW_V3_EDITORIAL;
    }>;
  };
  readonly localizationProof: Omit<
    RnkCp001LocalizedReviewQuestionV2['localizationProof'],
    'authority' | 'localizationFingerprint' | 'editorialVersion'
  > & {
    readonly authority: typeof RNK_CP001_LOCALIZATION_REVIEW_V3_AUTHORITY;
    readonly localizationFingerprint: string;
    readonly editorialVersion: typeof RNK_CP001_LOCALIZATION_REVIEW_V3_EDITORIAL;
  };
};

function sha256(value: unknown): string {
  return createHash('sha256')
    .update(typeof value === 'string' ? value : JSON.stringify(value), 'utf8')
    .digest('hex');
}

/**
 * V2 correctly intended to humanize exact ranks 1..4, but plain replaceAll
 * also matched the tail of 11/12/13/14, 21/22/23/24, etc. V3 repairs only
 * those malformed prefixed-word compounds. Exact standalone first..fourth
 * wording remains native; all larger ranks return to the original numeric
 * ordinal form.
 */
export function repairRnkCp001BoundaryOrdinalCorruption(
  stem: string,
  locale: RnkCp001LocalizedLocale,
): string {
  if (locale === 'hi-IN') {
    return stem
      .replace(/(\d+)पहले स्थान पर/gu, (_, prefix: string) => `${prefix}1वें स्थान पर`)
      .replace(/(\d+)दूसरे स्थान पर/gu, (_, prefix: string) => `${prefix}2वें स्थान पर`)
      .replace(/(\d+)तीसरे स्थान पर/gu, (_, prefix: string) => `${prefix}3वें स्थान पर`)
      .replace(/(\d+)चौथे स्थान पर/gu, (_, prefix: string) => `${prefix}4वें स्थान पर`);
  }
  return stem
    .replace(/(\d+)ਪਹਿਲੇ ਸਥਾਨ 'ਤੇ/gu, (_, prefix: string) => `${prefix}1ਵੇਂ ਸਥਾਨ 'ਤੇ`)
    .replace(/(\d+)ਦੂਜੇ ਸਥਾਨ 'ਤੇ/gu, (_, prefix: string) => `${prefix}2ਵੇਂ ਸਥਾਨ 'ਤੇ`)
    .replace(/(\d+)ਤੀਜੇ ਸਥਾਨ 'ਤੇ/gu, (_, prefix: string) => `${prefix}3ਵੇਂ ਸਥਾਨ 'ਤੇ`)
    .replace(/(\d+)ਚੌਥੇ ਸਥਾਨ 'ਤੇ/gu, (_, prefix: string) => `${prefix}4ਵੇਂ ਸਥਾਨ 'ਤੇ`);
}

export function localizeRnkCp001V2QuestionToV3(
  question: RnkCp001LocalizedReviewQuestionV2,
): RnkCp001LocalizedReviewQuestionV3 {
  const stem = repairRnkCp001BoundaryOrdinalCorruption(question.stem, question.locale);
  const localizationFingerprint = sha256({
    version: RNK_CP001_LOCALIZATION_REVIEW_V3_VERSION,
    permanentQlId: question.permanentQlId,
    seed: question.seed,
    canonicalSemanticFingerprint: question.localizationProof.canonicalSemanticFingerprint,
    locale: question.locale,
    targetName: question.targetName,
    stem,
    options: question.options,
    explanation: question.explanation,
  });

  return {
    ...question,
    stem,
    reviewMetadata: {
      ...question.reviewMetadata,
      localization: {
        version: RNK_CP001_LOCALIZATION_REVIEW_V3_VERSION,
        locale: question.locale,
        learnerTextLocalized: true,
        humanLanguageReviewRequired: true,
        editorialVersion: RNK_CP001_LOCALIZATION_REVIEW_V3_EDITORIAL,
      },
    },
    localizationProof: {
      ...question.localizationProof,
      authority: RNK_CP001_LOCALIZATION_REVIEW_V3_AUTHORITY,
      localizationFingerprint,
      editorialVersion: RNK_CP001_LOCALIZATION_REVIEW_V3_EDITORIAL,
    },
  };
}

export function localizeRnkCp001PermanentQuestionV3(
  question: RnkCp001PermanentQuestion,
  locale: RnkCp001LocalizedLocale,
): RnkCp001LocalizedReviewQuestionV3 {
  return localizeRnkCp001V2QuestionToV3(localizeRnkCp001PermanentQuestionV2(question, locale));
}

export function buildRnkCp001LocalizedReviewBankV3(
  locale: RnkCp001LocalizedLocale,
  seedsPerQl = 128,
): readonly RnkCp001LocalizedReviewQuestionV3[] {
  const v2 = buildRnkCp001LocalizedReviewBankV2(locale, seedsPerQl);
  return v2.map(localizeRnkCp001V2QuestionToV3);
}

export function buildRnkCp001LocalizedReviewBankV3FromCanonical(
  locale: RnkCp001LocalizedLocale,
  seedsPerQl = 128,
): readonly RnkCp001LocalizedReviewQuestionV3[] {
  return RNK_CP001_PERMANENT_QL_IDS.flatMap((qlId) =>
    Array.from({ length: seedsPerQl }, (_, seed) =>
      localizeRnkCp001PermanentQuestionV3(generateRnkCp001PermanentQuestion(qlId, seed), locale),
    ),
  );
}
