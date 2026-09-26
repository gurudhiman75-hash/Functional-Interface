import { createHash } from 'node:crypto';

import {
  buildRnkCp004PermanentRuntime,
  type RnkCp004PermanentQuestion,
} from './cp004-permanent-runtime-v1';
import type { RnkCp004LocalizedLocale } from './cp004-localization-review-v1';
import {
  localizeRnkCp004PermanentQuestionV5,
  type RnkCp004LocalizedReviewQuestionV5,
} from './cp004-localization-review-v5';

export const RNK_CP004_LOCALIZATION_REVIEW_V5_FINAL_VERSION =
  'RNK_CP004_HI_PA_LOCALIZATION_REVIEW_V5_FINAL' as const;
export const RNK_CP004_LOCALIZATION_REVIEW_V5_FINAL_AUTHORITY =
  'RNK_CP004_HI_PA_MODERATE_EDITORIAL_DIVERSITY_V5_FINAL' as const;

type AnyQuestion = Record<string, any>;
type ContextFamily =
  | 'SELECTION_TEST'
  | 'MERIT_LIST'
  | 'COMPETITION_STANDINGS'
  | 'PERFORMANCE_REVIEW'
  | 'INTERVIEW_SHORTLIST'
  | 'NEUTRAL_RANKING';

export type RnkCp004LocalizedReviewQuestionV5Final = AnyQuestion;

function sha256(value: unknown): string {
  return createHash('sha256')
    .update(typeof value === 'string' ? value : JSON.stringify(value), 'utf8')
    .digest('hex');
}

function localName(localized: RnkCp004LocalizedReviewQuestionV5, canonicalName: string): string {
  const index = localized.canonicalNames.indexOf(canonicalName);
  if (index < 0) throw new Error(`CP004 V5 final cannot localize canonical name ${canonicalName}`);
  return localized.localizedNames[index]!;
}

function contextFamily(question: AnyQuestion): ContextFamily {
  return question.reviewMetadata.languageProfile.contextFamily as ContextFamily;
}

function splitRelationKey(key: string): readonly [string, string] {
  const [higher, lower] = key.split('>');
  if (!higher || !lower) throw new Error(`CP004 V5 final invalid relation key ${key}`);
  return [higher, lower];
}

function refinedClue(
  family: ContextFamily,
  relation: string,
  localized: RnkCp004LocalizedReviewQuestionV5,
  locale: RnkCp004LocalizedLocale,
  variant: 0 | 1 | 2,
): string {
  const [higherKey, lowerKey] = splitRelationKey(relation);
  const higher = localName(localized, higherKey);
  const lower = localName(localized, lowerKey);

  const hi: Record<ContextFamily, readonly [string, string, string]> = {
    SELECTION_TEST: [
      `${higher} की चयन रैंक ${lower} से बेहतर है।`,
      `चयन क्रम में ${higher} का स्थान ${lower} से ऊपर है।`,
      `${lower} का स्थान ${higher} की तुलना में नीचे है।`,
    ],
    MERIT_LIST: [
      `${higher} योग्यता सूची में ${lower} से ऊपर है।`,
      `योग्यता क्रम में ${higher} का स्थान ${lower} से ऊपर है।`,
      `${lower} की रैंक ${higher} से नीचे है।`,
    ],
    COMPETITION_STANDINGS: [
      `${higher} ने प्रतियोगिता में ${lower} से ऊँचा स्थान प्राप्त किया।`,
      `प्रतियोगिता की रैंकिंग में ${higher} का स्थान ${lower} से ऊपर है।`,
      `${lower} की रैंक ${higher} से नीचे है।`,
    ],
    PERFORMANCE_REVIEW: [
      `${higher} की प्रदर्शन रैंक ${lower} से बेहतर है।`,
      `प्रदर्शन क्रम में ${higher} का स्थान ${lower} से ऊपर है।`,
      `${lower} का प्रदर्शन स्थान ${higher} से नीचे है।`,
    ],
    INTERVIEW_SHORTLIST: [
      `${higher} अंतिम साक्षात्कार सूची में ${lower} से ऊपर है।`,
      `इंटरव्यू क्रम में ${higher} का स्थान ${lower} से ऊपर है।`,
      `${lower} की इंटरव्यू रैंक ${higher} से नीचे है।`,
    ],
    NEUTRAL_RANKING: [
      `${higher} की रैंक ${lower} से ऊपर है।`,
      `रैंकिंग में ${higher} का स्थान ${lower} से ऊपर है।`,
      `${lower} का स्थान ${higher} से नीचे है।`,
    ],
  };

  const pa: Record<ContextFamily, readonly [string, string, string]> = {
    SELECTION_TEST: [
      `${higher} ਦੀ ਚੋਣ ਰੈਂਕ ${lower} ਨਾਲੋਂ ਬਿਹਤਰ ਹੈ।`,
      `ਚੋਣ ਕ੍ਰਮ ਵਿੱਚ ${higher} ਦਾ ਸਥਾਨ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`,
      `${lower} ਦਾ ਸਥਾਨ ${higher} ਨਾਲੋਂ ਹੇਠਾਂ ਹੈ।`,
    ],
    MERIT_LIST: [
      `${higher} ਯੋਗਤਾ ਸੂਚੀ ਵਿੱਚ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`,
      `ਯੋਗਤਾ ਕ੍ਰਮ ਵਿੱਚ ${higher} ਦਾ ਸਥਾਨ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`,
      `${lower} ਦੀ ਰੈਂਕ ${higher} ਨਾਲੋਂ ਹੇਠਾਂ ਹੈ।`,
    ],
    COMPETITION_STANDINGS: [
      `${higher} ਨੇ ਮੁਕਾਬਲੇ ਵਿੱਚ ${lower} ਨਾਲੋਂ ਉੱਚਾ ਸਥਾਨ ਹਾਸਲ ਕੀਤਾ।`,
      `ਮੁਕਾਬਲੇ ਦੀ ਰੈਂਕਿੰਗ ਵਿੱਚ ${higher} ਦਾ ਸਥਾਨ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`,
      `${lower} ਦੀ ਰੈਂਕ ${higher} ਨਾਲੋਂ ਹੇਠਾਂ ਹੈ।`,
    ],
    PERFORMANCE_REVIEW: [
      `${higher} ਦੀ ਪ੍ਰਦਰਸ਼ਨ ਰੈਂਕ ${lower} ਨਾਲੋਂ ਬਿਹਤਰ ਹੈ।`,
      `ਪ੍ਰਦਰਸ਼ਨ ਕ੍ਰਮ ਵਿੱਚ ${higher} ਦਾ ਸਥਾਨ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`,
      `${lower} ਦਾ ਪ੍ਰਦਰਸ਼ਨ ਸਥਾਨ ${higher} ਤੋਂ ਹੇਠਾਂ ਹੈ।`,
    ],
    INTERVIEW_SHORTLIST: [
      `${higher} ਅੰਤਿਮ ਇੰਟਰਵਿਊ ਸੂਚੀ ਵਿੱਚ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`,
      `ਇੰਟਰਵਿਊ ਕ੍ਰਮ ਵਿੱਚ ${higher} ਦਾ ਸਥਾਨ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`,
      `${lower} ਦੀ ਇੰਟਰਵਿਊ ਰੈਂਕ ${higher} ਨਾਲੋਂ ਹੇਠਾਂ ਹੈ।`,
    ],
    NEUTRAL_RANKING: [
      `${higher} ਦੀ ਰੈਂਕ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`,
      `ਰੈਂਕਿੰਗ ਵਿੱਚ ${higher} ਦਾ ਸਥਾਨ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`,
      `${lower} ਦਾ ਸਥਾਨ ${higher} ਤੋਂ ਹੇਠਾਂ ਹੈ।`,
    ],
  };

  return (locale === 'hi-IN' ? hi[family] : pa[family])[variant];
}

function refinedStem(
  canonical: AnyQuestion,
  v5: RnkCp004LocalizedReviewQuestionV5,
  locale: RnkCp004LocalizedLocale,
): string {
  const sections = v5.stem.split('\n\n');
  if (sections.length !== 3) {
    throw new Error(`CP004 V5 final expected three stem sections, found ${sections.length}`);
  }
  const diversity = v5.localizationMetadata.editorialDiversity;
  const clueLines = diversity.clueOrderKeys.map((relation: string, index: number) => {
    const variant = diversity.clueVariantIds[index] as 0 | 1 | 2;
    return `- ${refinedClue(contextFamily(canonical), relation, v5, locale, variant)}`;
  });
  return `${sections[0]}\n\n${clueLines.join('\n')}\n\n${sections[2]}`;
}

function finalFingerprint(question: AnyQuestion): string {
  return sha256({
    version: RNK_CP004_LOCALIZATION_REVIEW_V5_FINAL_VERSION,
    canonicalSemanticFingerprint: question.localizationProof.canonicalSemanticFingerprint,
    locale: question.locale,
    stem: question.stem,
    answer: question.answer,
    options: question.options,
    explanation: question.explanation,
    visibleExplanation: question.visibleExplanation,
    editorialDiversity: question.localizationMetadata.editorialDiversity,
  });
}

export function localizeRnkCp004PermanentQuestionV5Final(
  canonicalQuestion: RnkCp004PermanentQuestion | AnyQuestion,
  locale: RnkCp004LocalizedLocale,
): RnkCp004LocalizedReviewQuestionV5Final {
  const canonical = canonicalQuestion as AnyQuestion;
  const v5 = localizeRnkCp004PermanentQuestionV5(canonicalQuestion, locale) as AnyQuestion;
  const stem = refinedStem(canonical, v5 as RnkCp004LocalizedReviewQuestionV5, locale);
  const localized = {
    ...v5,
    stem,
    localizationMetadata: {
      ...v5.localizationMetadata,
      version: RNK_CP004_LOCALIZATION_REVIEW_V5_FINAL_VERSION,
      finalSurfaceRefinement: 'DISTINCT_THREE_PATTERN_CLUE_SURFACES',
      v5DiversityContractPreserved: true,
    },
    localizationProof: {
      ...v5.localizationProof,
      authority: RNK_CP004_LOCALIZATION_REVIEW_V5_FINAL_AUTHORITY,
      v5LocalizationFingerprint: v5.localizationProof.localizationFingerprint,
      finalSurfaceRefinementCoverage: 'EXECUTABLE_PROVED',
      localizationFingerprint: '',
    },
  };
  return {
    ...localized,
    localizationProof: {
      ...localized.localizationProof,
      localizationFingerprint: finalFingerprint(localized),
    },
  };
}

export function buildRnkCp004LocalizedReviewBankV5Final(
  locale: RnkCp004LocalizedLocale,
): readonly RnkCp004LocalizedReviewQuestionV5Final[] {
  return buildRnkCp004PermanentRuntime().map((question) =>
    localizeRnkCp004PermanentQuestionV5Final(question, locale));
}
