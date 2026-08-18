import { createHash } from 'node:crypto';

import type { RnkCp004Comparison } from './cp004-foundation';
import { RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID } from './cp004-authority-consolidation-v1';
import {
  buildRnkCp004PermanentRuntime,
  type RnkCp004PermanentQuestion,
} from './cp004-permanent-runtime-v1';
import type { RnkCp004LocalizedLocale } from './cp004-localization-review-v1';
import {
  localizeRnkCp004PermanentQuestionV4,
  type RnkCp004LocalizedReviewQuestionV4,
} from './cp004-localization-review-v4';

export const RNK_CP004_LOCALIZATION_REVIEW_V5_VERSION =
  'RNK_CP004_HI_PA_LOCALIZATION_REVIEW_V5' as const;
export const RNK_CP004_LOCALIZATION_REVIEW_V5_AUTHORITY =
  'RNK_CP004_HI_PA_MODERATE_EDITORIAL_DIVERSITY_V5' as const;

export type RnkCp004LocalizedReviewQuestionV5 = Omit<
  RnkCp004LocalizedReviewQuestionV4,
  'localizationMetadata' | 'localizationProof'
> & {
  readonly localizationMetadata: RnkCp004LocalizedReviewQuestionV4['localizationMetadata'] & Readonly<{
    version: typeof RNK_CP004_LOCALIZATION_REVIEW_V5_VERSION;
    moderateEditorialDiversityOverlay: 'SEEDED_2_INTRO_3_CLUE_2_QUERY_V5';
    v4PedagogyBaselinePreserved: true;
    editorialDiversity: Readonly<{
      introVariant: 0 | 1;
      queryVariant: 0 | 1;
      clueVariantIds: readonly (0 | 1 | 2)[];
      clueOrderKeys: readonly string[];
      canonicalClueOrderKeys: readonly string[];
      clueOrderShuffled: boolean;
      maxConsecutiveSameClueTemplate: number;
    }>;
  }>;
  readonly localizationProof: Omit<
    RnkCp004LocalizedReviewQuestionV4['localizationProof'],
    'authority'
  > & Readonly<{
    authority: typeof RNK_CP004_LOCALIZATION_REVIEW_V5_AUTHORITY;
    v4LocalizationFingerprint: string;
    editorialDiversityCoverage: 'EXECUTABLE_PROVED';
  }>;
};

type AnyQuestion = Record<string, any>;
type ContextFamily =
  | 'SELECTION_TEST'
  | 'MERIT_LIST'
  | 'COMPETITION_STANDINGS'
  | 'PERFORMANCE_REVIEW'
  | 'INTERVIEW_SHORTLIST'
  | 'NEUTRAL_RANKING';

function native(locale: RnkCp004LocalizedLocale, hi: string, pa: string): string {
  return locale === 'hi-IN' ? hi : pa;
}

function sha256(value: unknown): string {
  return createHash('sha256')
    .update(typeof value === 'string' ? value : JSON.stringify(value), 'utf8')
    .digest('hex');
}

function hashNumber(value: string): number {
  return Number.parseInt(sha256(value).slice(0, 8), 16) >>> 0;
}

function stableQuestionKey(question: AnyQuestion): string {
  return String(
    question.reviewMetadata?.stableQuestionId
    ?? question.reviewMetadata?.permanentProfile?.stableQuestionId
    ?? `${question.prototypeId}:${question.seed}`,
  );
}

function relationKey(clue: RnkCp004Comparison): string {
  return `${clue.higher}>${clue.lower}`;
}

function contextFamily(question: AnyQuestion): ContextFamily {
  return question.reviewMetadata.languageProfile.contextFamily as ContextFamily;
}

function localName(
  localized: RnkCp004LocalizedReviewQuestionV4,
  canonicalName: string,
): string {
  const index = localized.canonicalNames.indexOf(canonicalName);
  if (index < 0) throw new Error(`CP004 V5 cannot localize canonical name ${canonicalName}`);
  return localized.localizedNames[index]!;
}

function ordinalDirect(value: number, locale: RnkCp004LocalizedLocale): string {
  if (locale === 'hi-IN') {
    if (value === 1) return 'पहला';
    if (value === 2) return 'दूसरा';
    if (value === 3) return 'तीसरा';
    if (value === 4) return 'चौथा';
    if (value === 5) return 'पाँचवाँ';
    if (value === 6) return 'छठा';
    if (value === 7) return 'सातवाँ';
    if (value === 8) return 'आठवाँ';
    return `${value}वाँ`;
  }
  if (value === 1) return 'ਪਹਿਲਾ';
  if (value === 2) return 'ਦੂਜਾ';
  if (value === 3) return 'ਤੀਜਾ';
  if (value === 4) return 'ਚੌਥਾ';
  if (value === 5) return 'ਪੰਜਵਾਂ';
  if (value === 6) return 'ਛੇਵਾਂ';
  if (value === 7) return 'ਸੱਤਵਾਂ';
  if (value === 8) return 'ਅੱਠਵਾਂ';
  return `${value}ਵਾਂ`;
}

function ordinalOblique(value: number, locale: RnkCp004LocalizedLocale): string {
  if (locale === 'hi-IN') {
    if (value === 1) return 'पहले';
    if (value === 2) return 'दूसरे';
    if (value === 3) return 'तीसरे';
    if (value === 4) return 'चौथे';
    if (value === 5) return 'पाँचवें';
    if (value === 6) return 'छठे';
    if (value === 7) return 'सातवें';
    if (value === 8) return 'आठवें';
    return `${value}वें`;
  }
  if (value === 1) return 'ਪਹਿਲੇ';
  if (value === 2) return 'ਦੂਜੇ';
  if (value === 3) return 'ਤੀਜੇ';
  if (value === 4) return 'ਚੌਥੇ';
  if (value === 5) return 'ਪੰਜਵੇਂ';
  if (value === 6) return 'ਛੇਵੇਂ';
  if (value === 7) return 'ਸੱਤਵੇਂ';
  if (value === 8) return 'ਅੱਠਵੇਂ';
  return `${value}ਵੇਂ`;
}

function introText(
  family: ContextFamily,
  count: number,
  locale: RnkCp004LocalizedLocale,
  variant: 0 | 1,
  missingComparison: boolean,
): string {
  const hi: Record<ContextFamily, readonly [string, string]> = {
    SELECTION_TEST: [
      `चयन परीक्षा में ${count} अभ्यर्थियों की रैंक अलग-अलग हैं। दी गई जानकारी के आधार पर प्रश्न का उत्तर दीजिए।`,
      `चयन परीक्षा के ${count} अभ्यर्थियों ने अलग-अलग रैंक प्राप्त की हैं। नीचे दी गई तुलनाओं को ध्यान से पढ़िए।`,
    ],
    MERIT_LIST: [
      `योग्यता सूची में ${count} अभ्यर्थियों के स्थान अलग-अलग हैं। दी गई जानकारी के आधार पर प्रश्न का उत्तर दीजिए।`,
      `${count} अभ्यर्थियों की योग्यता सूची के बारे में कुछ तुलनाएँ दी गई हैं। इन्हें पढ़कर प्रश्न हल कीजिए।`,
    ],
    COMPETITION_STANDINGS: [
      `प्रतियोगिता में ${count} प्रतिभागियों के स्थान अलग-अलग हैं। दी गई जानकारी के आधार पर प्रश्न का उत्तर दीजिए।`,
      `${count} प्रतिभागियों ने प्रतियोगिता में अलग-अलग स्थान प्राप्त किए हैं। नीचे दी गई तुलनाओं को ध्यान से पढ़िए।`,
    ],
    PERFORMANCE_REVIEW: [
      `प्रदर्शन समीक्षा में ${count} व्यक्तियों की रैंक अलग-अलग हैं। दी गई जानकारी के आधार पर प्रश्न का उत्तर दीजिए।`,
      `${count} व्यक्तियों के प्रदर्शन क्रम के बारे में कुछ तुलनाएँ दी गई हैं। इन्हें पढ़कर प्रश्न हल कीजिए।`,
    ],
    INTERVIEW_SHORTLIST: [
      `अंतिम साक्षात्कार सूची में ${count} अभ्यर्थियों की रैंक अलग-अलग हैं। दी गई जानकारी के आधार पर प्रश्न का उत्तर दीजिए।`,
      `${count} अभ्यर्थियों की अंतिम साक्षात्कार रैंकिंग के बारे में कुछ तुलनाएँ दी गई हैं। इन्हें पढ़कर प्रश्न हल कीजिए।`,
    ],
    NEUTRAL_RANKING: [
      `${count} व्यक्तियों की रैंक अलग-अलग हैं। दी गई जानकारी के आधार पर प्रश्न का उत्तर दीजिए।`,
      `${count} व्यक्तियों के क्रम के बारे में कुछ तुलनाएँ दी गई हैं। इन्हें पढ़कर प्रश्न हल कीजिए।`,
    ],
  };
  const pa: Record<ContextFamily, readonly [string, string]> = {
    SELECTION_TEST: [
      `ਚੋਣ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ${count} ਉਮੀਦਵਾਰਾਂ ਦੀਆਂ ਰੈਂਕਾਂ ਵੱਖ-ਵੱਖ ਹਨ। ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ 'ਤੇ ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ਦਿਓ।`,
      `ਚੋਣ ਪ੍ਰੀਖਿਆ ਦੇ ${count} ਉਮੀਦਵਾਰਾਂ ਨੇ ਵੱਖ-ਵੱਖ ਰੈਂਕਾਂ ਹਾਸਲ ਕੀਤੀਆਂ ਹਨ। ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਤੁਲਨਾਵਾਂ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ।`,
    ],
    MERIT_LIST: [
      `ਯੋਗਤਾ ਸੂਚੀ ਵਿੱਚ ${count} ਉਮੀਦਵਾਰਾਂ ਦੇ ਸਥਾਨ ਵੱਖ-ਵੱਖ ਹਨ। ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ 'ਤੇ ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ਦਿਓ।`,
      `${count} ਉਮੀਦਵਾਰਾਂ ਦੀ ਯੋਗਤਾ ਸੂਚੀ ਬਾਰੇ ਕੁਝ ਤੁਲਨਾਵਾਂ ਦਿੱਤੀਆਂ ਗਈਆਂ ਹਨ। ਇਨ੍ਹਾਂ ਨੂੰ ਪੜ੍ਹ ਕੇ ਪ੍ਰਸ਼ਨ ਹੱਲ ਕਰੋ।`,
    ],
    COMPETITION_STANDINGS: [
      `ਮੁਕਾਬਲੇ ਵਿੱਚ ${count} ਭਾਗੀਦਾਰਾਂ ਦੇ ਸਥਾਨ ਵੱਖ-ਵੱਖ ਹਨ। ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ 'ਤੇ ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ਦਿਓ।`,
      `${count} ਭਾਗੀਦਾਰਾਂ ਨੇ ਮੁਕਾਬਲੇ ਵਿੱਚ ਵੱਖ-ਵੱਖ ਸਥਾਨ ਹਾਸਲ ਕੀਤੇ ਹਨ। ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਤੁਲਨਾਵਾਂ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ।`,
    ],
    PERFORMANCE_REVIEW: [
      `ਪ੍ਰਦਰਸ਼ਨ ਸਮੀਖਿਆ ਵਿੱਚ ${count} ਵਿਅਕਤੀਆਂ ਦੀਆਂ ਰੈਂਕਾਂ ਵੱਖ-ਵੱਖ ਹਨ। ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ 'ਤੇ ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ਦਿਓ।`,
      `${count} ਵਿਅਕਤੀਆਂ ਦੇ ਪ੍ਰਦਰਸ਼ਨ ਕ੍ਰਮ ਬਾਰੇ ਕੁਝ ਤੁਲਨਾਵਾਂ ਦਿੱਤੀਆਂ ਗਈਆਂ ਹਨ। ਇਨ੍ਹਾਂ ਨੂੰ ਪੜ੍ਹ ਕੇ ਪ੍ਰਸ਼ਨ ਹੱਲ ਕਰੋ।`,
    ],
    INTERVIEW_SHORTLIST: [
      `ਅੰਤਿਮ ਇੰਟਰਵਿਊ ਸੂਚੀ ਵਿੱਚ ${count} ਉਮੀਦਵਾਰਾਂ ਦੀਆਂ ਰੈਂਕਾਂ ਵੱਖ-ਵੱਖ ਹਨ। ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ 'ਤੇ ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ਦਿਓ।`,
      `${count} ਉਮੀਦਵਾਰਾਂ ਦੀ ਅੰਤਿਮ ਇੰਟਰਵਿਊ ਰੈਂਕਿੰਗ ਬਾਰੇ ਕੁਝ ਤੁਲਨਾਵਾਂ ਦਿੱਤੀਆਂ ਗਈਆਂ ਹਨ। ਇਨ੍ਹਾਂ ਨੂੰ ਪੜ੍ਹ ਕੇ ਪ੍ਰਸ਼ਨ ਹੱਲ ਕਰੋ।`,
    ],
    NEUTRAL_RANKING: [
      `${count} ਵਿਅਕਤੀਆਂ ਦੀਆਂ ਰੈਂਕਾਂ ਵੱਖ-ਵੱਖ ਹਨ। ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ 'ਤੇ ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ਦਿਓ।`,
      `${count} ਵਿਅਕਤੀਆਂ ਦੇ ਕ੍ਰਮ ਬਾਰੇ ਕੁਝ ਤੁਲਨਾਵਾਂ ਦਿੱਤੀਆਂ ਗਈਆਂ ਹਨ। ਇਨ੍ਹਾਂ ਨੂੰ ਪੜ੍ਹ ਕੇ ਪ੍ਰਸ਼ਨ ਹੱਲ ਕਰੋ।`,
    ],
  };
  const base = (locale === 'hi-IN' ? hi[family] : pa[family])[variant];
  if (!missingComparison) return base;
  return `${base} ${native(
    locale,
    'इन तुलनाओं से पूरा क्रम अभी निर्धारित नहीं होता; एक अतिरिक्त तुलना की आवश्यकता है।',
    'ਇਨ੍ਹਾਂ ਤੁਲਨਾਵਾਂ ਨਾਲ ਪੂਰਾ ਕ੍ਰਮ ਹਾਲੇ ਨਿਰਧਾਰਤ ਨਹੀਂ ਹੁੰਦਾ; ਇੱਕ ਵਾਧੂ ਤੁਲਨਾ ਦੀ ਲੋੜ ਹੈ।',
  )}`;
}

function clueText(
  family: ContextFamily,
  clue: RnkCp004Comparison,
  localized: RnkCp004LocalizedReviewQuestionV4,
  locale: RnkCp004LocalizedLocale,
  variant: 0 | 1 | 2,
): string {
  const higher = localName(localized, clue.higher);
  const lower = localName(localized, clue.lower);
  const hi: Record<ContextFamily, readonly [string, string, string]> = {
    SELECTION_TEST: [
      `${higher} की चयन रैंक ${lower} से बेहतर है।`,
      `चयन क्रम में ${higher} का स्थान ${lower} से ऊपर है।`,
      `${lower} की चयन रैंक ${higher} से नीचे है।`,
    ],
    MERIT_LIST: [
      `${higher} योग्यता सूची में ${lower} से ऊपर है।`,
      `योग्यता क्रम में ${higher} का स्थान ${lower} से ऊपर है।`,
      `${lower} योग्यता सूची में ${higher} से नीचे है।`,
    ],
    COMPETITION_STANDINGS: [
      `${higher} ने प्रतियोगिता में ${lower} से ऊँचा स्थान प्राप्त किया।`,
      `प्रतियोगिता की रैंकिंग में ${higher} का स्थान ${lower} से ऊपर है।`,
      `${lower} का स्थान प्रतियोगिता में ${higher} से नीचे है।`,
    ],
    PERFORMANCE_REVIEW: [
      `${higher} की प्रदर्शन रैंक ${lower} से बेहतर है।`,
      `प्रदर्शन क्रम में ${higher} का स्थान ${lower} से ऊपर है।`,
      `${lower} की प्रदर्शन रैंक ${higher} से नीचे है।`,
    ],
    INTERVIEW_SHORTLIST: [
      `${higher} अंतिम साक्षात्कार सूची में ${lower} से ऊपर है।`,
      `साक्षात्कार क्रम में ${higher} का स्थान ${lower} से ऊपर है।`,
      `${lower} अंतिम साक्षात्कार सूची में ${higher} से नीचे है।`,
    ],
    NEUTRAL_RANKING: [
      `${higher} की रैंक ${lower} से ऊपर है।`,
      `रैंकिंग में ${higher} का स्थान ${lower} से ऊपर है।`,
      `${lower} की रैंक ${higher} से नीचे है।`,
    ],
  };
  const pa: Record<ContextFamily, readonly [string, string, string]> = {
    SELECTION_TEST: [
      `${higher} ਦੀ ਚੋਣ ਰੈਂਕ ${lower} ਨਾਲੋਂ ਬਿਹਤਰ ਹੈ।`,
      `ਚੋਣ ਕ੍ਰਮ ਵਿੱਚ ${higher} ਦਾ ਸਥਾਨ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`,
      `${lower} ਦੀ ਚੋਣ ਰੈਂਕ ${higher} ਨਾਲੋਂ ਹੇਠਾਂ ਹੈ।`,
    ],
    MERIT_LIST: [
      `${higher} ਯੋਗਤਾ ਸੂਚੀ ਵਿੱਚ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`,
      `ਯੋਗਤਾ ਕ੍ਰਮ ਵਿੱਚ ${higher} ਦਾ ਸਥਾਨ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`,
      `${lower} ਯੋਗਤਾ ਸੂਚੀ ਵਿੱਚ ${higher} ਤੋਂ ਹੇਠਾਂ ਹੈ।`,
    ],
    COMPETITION_STANDINGS: [
      `${higher} ਨੇ ਮੁਕਾਬਲੇ ਵਿੱਚ ${lower} ਨਾਲੋਂ ਉੱਚਾ ਸਥਾਨ ਹਾਸਲ ਕੀਤਾ।`,
      `ਮੁਕਾਬਲੇ ਦੀ ਰੈਂਕਿੰਗ ਵਿੱਚ ${higher} ਦਾ ਸਥਾਨ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`,
      `${lower} ਦਾ ਸਥਾਨ ਮੁਕਾਬਲੇ ਵਿੱਚ ${higher} ਤੋਂ ਹੇਠਾਂ ਹੈ।`,
    ],
    PERFORMANCE_REVIEW: [
      `${higher} ਦੀ ਪ੍ਰਦਰਸ਼ਨ ਰੈਂਕ ${lower} ਨਾਲੋਂ ਬਿਹਤਰ ਹੈ।`,
      `ਪ੍ਰਦਰਸ਼ਨ ਕ੍ਰਮ ਵਿੱਚ ${higher} ਦਾ ਸਥਾਨ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`,
      `${lower} ਦੀ ਪ੍ਰਦਰਸ਼ਨ ਰੈਂਕ ${higher} ਨਾਲੋਂ ਹੇਠਾਂ ਹੈ।`,
    ],
    INTERVIEW_SHORTLIST: [
      `${higher} ਅੰਤਿਮ ਇੰਟਰਵਿਊ ਸੂਚੀ ਵਿੱਚ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`,
      `ਇੰਟਰਵਿਊ ਕ੍ਰਮ ਵਿੱਚ ${higher} ਦਾ ਸਥਾਨ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`,
      `${lower} ਅੰਤਿਮ ਇੰਟਰਵਿਊ ਸੂਚੀ ਵਿੱਚ ${higher} ਤੋਂ ਹੇਠਾਂ ਹੈ।`,
    ],
    NEUTRAL_RANKING: [
      `${higher} ਦੀ ਰੈਂਕ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`,
      `ਰੈਂਕਿੰਗ ਵਿੱਚ ${higher} ਦਾ ਸਥਾਨ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`,
      `${lower} ਦੀ ਰੈਂਕ ${higher} ਤੋਂ ਹੇਠਾਂ ਹੈ।`,
    ],
  };
  return (locale === 'hi-IN' ? hi[family] : pa[family])[variant];
}

function requestedPosition(question: AnyQuestion): number {
  const query = question.displayedEvidence.query;
  if (query.kind !== 'ENTITY_AT_EXACT_RANK') throw new Error('CP004 V5 expected entity-at-rank query');
  return question.reviewMetadata.sourceInverseProfile.rankReference === 'BOTTOM'
    ? question.displayedEvidence.entities.length - query.rankFromTop + 1
    : query.rankFromTop;
}

function queryText(
  canonical: AnyQuestion,
  localized: RnkCp004LocalizedReviewQuestionV4,
  locale: RnkCp004LocalizedLocale,
  variant: 0 | 1,
): string {
  const query = canonical.displayedEvidence.query;
  const inverse = canonical.reviewMetadata.sourceInverseProfile;
  if (canonical.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    const first = localName(localized, query.first);
    const second = localName(localized, query.second);
    return variant === 0
      ? native(
        locale,
        `${first} और ${second} की रैंकों का सही अंतर तथा दोनों में किसकी रैंक ऊपर है—कौन-सा विकल्प सही है?`,
        `${first} ਅਤੇ ${second} ਦੀਆਂ ਰੈਂਕਾਂ ਦਾ ਸਹੀ ਫਰਕ ਅਤੇ ਦੋਵਾਂ ਵਿੱਚੋਂ ਕਿਸਦੀ ਰੈਂਕ ਉੱਪਰ ਹੈ—ਕਿਹੜੀ ਚੋਣ ਸਹੀ ਹੈ?`,
      )
      : native(
        locale,
        `${first} और ${second} के बीच रैंक-अंतर और सही दिशा बताने वाला विकल्प चुनिए।`,
        `${first} ਅਤੇ ${second} ਵਿਚਕਾਰ ਰੈਂਕ ਦਾ ਫਰਕ ਅਤੇ ਸਹੀ ਦਿਸ਼ਾ ਦੱਸਣ ਵਾਲੀ ਚੋਣ ਚੁਣੋ।`,
      );
  }

  switch (query.kind) {
    case 'HIGHEST_ENTITY':
      return variant === 0
        ? native(locale, 'सबसे ऊँची रैंक किसकी है?', 'ਸਭ ਤੋਂ ਉੱਚੀ ਰੈਂਕ ਕਿਸਦੀ ਹੈ?')
        : native(locale, 'रैंकिंग में सबसे ऊपर कौन है?', 'ਰੈਂਕਿੰਗ ਵਿੱਚ ਸਭ ਤੋਂ ਉੱਪਰ ਕੌਣ ਹੈ?');
    case 'LOWEST_ENTITY':
      return variant === 0
        ? native(locale, 'सबसे नीची रैंक किसकी है?', 'ਸਭ ਤੋਂ ਹੇਠਲੀ ਰੈਂਕ ਕਿਸਦੀ ਹੈ?')
        : native(locale, 'रैंकिंग में सबसे नीचे कौन है?', 'ਰੈਂਕਿੰਗ ਵਿੱਚ ਸਭ ਤੋਂ ਹੇਠਾਂ ਕੌਣ ਹੈ?');
    case 'ENTITY_AT_EXACT_RANK': {
      const position = requestedPosition(canonical);
      const side = inverse.rankReference === 'BOTTOM'
        ? native(locale, 'नीचे से', 'ਹੇਠੋਂ')
        : native(locale, 'ऊपर से', 'ਉੱਪਰੋਂ');
      return variant === 0
        ? native(
          locale,
          `${side} ${ordinalDirect(position, locale)} स्थान किसका है?`,
          `${side} ${ordinalDirect(position, locale)} ਸਥਾਨ ਕਿਸਦਾ ਹੈ?`,
        )
        : native(
          locale,
          `${side} ${ordinalOblique(position, locale)} स्थान पर कौन है?`,
          `${side} ${ordinalOblique(position, locale)} ਸਥਾਨ ਉੱਤੇ ਕੌਣ ਹੈ?`,
        );
    }
    case 'RANK_OF_NAMED_ENTITY': {
      const target = localName(localized, query.target);
      const side = inverse.rankReference === 'BOTTOM'
        ? native(locale, 'नीचे से', 'ਹੇਠੋਂ')
        : native(locale, 'ऊपर से', 'ਉੱਪਰੋਂ');
      return variant === 0
        ? native(locale, `${target} ${side} किस स्थान पर है?`, `${target} ${side} ਕਿਹੜੇ ਸਥਾਨ ਉੱਤੇ ਹੈ?`)
        : native(locale, `${side} गिनने पर ${target} किस स्थान पर है?`, `${side} ਗਿਣਿਆਂ ${target} ਕਿਹੜੇ ਸਥਾਨ ਉੱਤੇ ਹੈ?`);
    }
    case 'MIDDLE_ENTITY':
      return variant === 0
        ? native(locale, 'बीच वाले स्थान पर कौन है?', 'ਵਿਚਕਾਰਲੇ ਸਥਾਨ ਉੱਤੇ ਕੌਣ ਹੈ?')
        : native(locale, 'रैंकिंग के ठीक बीच में कौन है?', 'ਰੈਂਕਿੰਗ ਦੇ ਬਿਲਕੁਲ ਵਿਚਕਾਰ ਕੌਣ ਹੈ?');
    case 'COMPLETE_ORDER': {
      const lowToHigh = inverse.orderDirection === 'LOWEST_TO_HIGHEST';
      if (variant === 0) {
        return lowToHigh
          ? native(locale, 'सबसे नीचे से सबसे ऊपर तक सही पूरा क्रम कौन-सा है?', 'ਸਭ ਤੋਂ ਹੇਠਾਂ ਤੋਂ ਸਭ ਤੋਂ ਉੱਪਰ ਤੱਕ ਸਹੀ ਪੂਰਾ ਕ੍ਰਮ ਕਿਹੜਾ ਹੈ?')
          : native(locale, 'सबसे ऊपर से सबसे नीचे तक सही पूरा क्रम कौन-सा है?', 'ਸਭ ਤੋਂ ਉੱਪਰ ਤੋਂ ਸਭ ਤੋਂ ਹੇਠਾਂ ਤੱਕ ਸਹੀ ਪੂਰਾ ਕ੍ਰਮ ਕਿਹੜਾ ਹੈ?');
      }
      return lowToHigh
        ? native(locale, 'नीचे से ऊपर तक सही क्रम वाला विकल्प चुनिए।', 'ਹੇਠਾਂ ਤੋਂ ਉੱਪਰ ਤੱਕ ਸਹੀ ਕ੍ਰਮ ਵਾਲੀ ਚੋਣ ਚੁਣੋ।')
        : native(locale, 'ऊपर से नीचे तक सही क्रम वाला विकल्प चुनिए।', 'ਉੱਪਰ ਤੋਂ ਹੇਠਾਂ ਤੱਕ ਸਹੀ ਕ੍ਰਮ ਵਾਲੀ ਚੋਣ ਚੁਣੋ।');
    }
    case 'RELATIVE_ORDER_OF_PAIR': {
      const first = localName(localized, query.first);
      const second = localName(localized, query.second);
      return variant === 0
        ? native(
          locale,
          `${first} और ${second} के आपसी क्रम के बारे में कौन-सा विकल्प सही है?`,
          `${first} ਅਤੇ ${second} ਦੇ ਆਪਸੀ ਕ੍ਰਮ ਬਾਰੇ ਕਿਹੜੀ ਚੋਣ ਸਹੀ ਹੈ?`,
        )
        : native(
          locale,
          `${first} और ${second} में कौन ऊपर है—सही कथन चुनिए।`,
          `${first} ਅਤੇ ${second} ਵਿੱਚੋਂ ਕੌਣ ਉੱਪਰ ਹੈ—ਸਹੀ ਕਥਨ ਚੁਣੋ।`,
        );
    }
    case 'IMMEDIATE_NEIGHBOUR': {
      const target = localName(localized, query.target);
      const direction = query.direction === 'ABOVE'
        ? native(locale, 'ठीक ऊपर', 'ਤੁਰੰਤ ਉੱਪਰ')
        : native(locale, 'ठीक नीचे', 'ਤੁਰੰਤ ਹੇਠਾਂ');
      return variant === 0
        ? native(locale, `${target} से ${direction} कौन है?`, `${target} ਤੋਂ ${direction} ਕੌਣ ਹੈ?`)
        : native(locale, `${target} के ${direction} किसका स्थान है?`, `${target} ਦੇ ${direction} ਕਿਸਦਾ ਸਥਾਨ ਹੈ?`);
    }
    case 'VALID_RANK_STATEMENT':
      return variant === 0
        ? native(
          locale,
          'दी गई तुलनाओं से कौन-सा निष्कर्ष निश्चित रूप से सही है?',
          'ਦਿੱਤੀਆਂ ਤੁਲਨਾਵਾਂ ਤੋਂ ਕਿਹੜਾ ਨਤੀਜਾ ਯਕੀਨੀ ਤੌਰ ਉੱਤੇ ਸਹੀ ਹੈ?',
        )
        : native(
          locale,
          'निम्न में से कौन-सा संबंध निश्चित रूप से सिद्ध होता है?',
          'ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸੰਬੰਧ ਯਕੀਨੀ ਤੌਰ ਉੱਤੇ ਸਾਬਤ ਹੁੰਦਾ ਹੈ?',
        );
    case 'MISSING_COMPARISON':
      return variant === 0
        ? native(
          locale,
          'कौन-सी अतिरिक्त तुलना जोड़ने पर पूरा क्रम केवल एक ही होगा?',
          'ਕਿਹੜੀ ਵਾਧੂ ਤੁਲਨਾ ਜੋੜਨ ਨਾਲ ਪੂਰਾ ਕ੍ਰਮ ਕੇਵਲ ਇੱਕ ਹੀ ਰਹੇਗਾ?',
        )
        : native(
          locale,
          'पूरा क्रम निश्चित करने के लिए कौन-सी अतिरिक्त तुलना पर्याप्त है?',
          'ਪੂਰਾ ਕ੍ਰਮ ਨਿਸ਼ਚਿਤ ਕਰਨ ਲਈ ਕਿਹੜੀ ਵਾਧੂ ਤੁਲਨਾ ਕਾਫ਼ੀ ਹੈ?',
        );
  }
}

function shuffledClues(
  canonical: AnyQuestion,
): readonly RnkCp004Comparison[] {
  const clues = [...canonical.displayedEvidence.clues] as RnkCp004Comparison[];
  const key = stableQuestionKey(canonical);
  const shuffled = clues
    .map((clue, index) => ({ clue, index, score: hashNumber(`${key}:clue-order:${relationKey(clue)}:${index}`) }))
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .map((entry) => entry.clue);

  if (shuffled.length > 1 && shuffled.every((clue, index) => clue === clues[index])) {
    return [...shuffled.slice(1), shuffled[0]!];
  }
  return shuffled;
}

function clueVariants(
  canonical: AnyQuestion,
  clues: readonly RnkCp004Comparison[],
): readonly (0 | 1 | 2)[] {
  const key = stableQuestionKey(canonical);
  const variants: (0 | 1 | 2)[] = [];
  for (let index = 0; index < clues.length; index += 1) {
    let variant = (hashNumber(`${key}:clue-template:${relationKey(clues[index]!)}:${index}`) % 3) as 0 | 1 | 2;
    if (index >= 2 && variants[index - 1] === variant && variants[index - 2] === variant) {
      variant = ((variant + 1) % 3) as 0 | 1 | 2;
    }
    variants.push(variant);
  }
  return variants;
}

function maxRun(values: readonly number[]): number {
  let best = 0;
  let current = 0;
  let previous: number | undefined;
  for (const value of values) {
    current = value === previous ? current + 1 : 1;
    previous = value;
    best = Math.max(best, current);
  }
  return best;
}

function v5Fingerprint(question: AnyQuestion): string {
  return sha256({
    version: RNK_CP004_LOCALIZATION_REVIEW_V5_VERSION,
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

export function localizeRnkCp004PermanentQuestionV5(
  canonicalQuestion: RnkCp004PermanentQuestion | AnyQuestion,
  locale: RnkCp004LocalizedLocale,
): RnkCp004LocalizedReviewQuestionV5 {
  const canonical = canonicalQuestion as AnyQuestion;
  const v4 = localizeRnkCp004PermanentQuestionV4(canonicalQuestion, locale);
  const family = contextFamily(canonical);
  const key = stableQuestionKey(canonical);
  const introVariant = (hashNumber(`${key}:intro`) % 2) as 0 | 1;
  const queryVariant = (hashNumber(`${key}:query`) % 2) as 0 | 1;
  const clues = shuffledClues(canonical);
  const variants = clueVariants(canonical, clues);
  const canonicalClueOrderKeys = (canonical.displayedEvidence.clues as readonly RnkCp004Comparison[]).map(relationKey);
  const clueOrderKeys = clues.map(relationKey);
  const missingComparison = canonical.displayedEvidence.query.kind === 'MISSING_COMPARISON';
  const intro = introText(family, canonical.displayedEvidence.entities.length, locale, introVariant, missingComparison);
  const clueLines = clues.map((clue, index) => `- ${clueText(family, clue, v4, locale, variants[index]!)}`).join('\n');
  const query = queryText(canonical, v4, locale, queryVariant);
  const stem = `${intro}\n\n${clueLines}\n\n${query}`;
  const diversity = {
    introVariant,
    queryVariant,
    clueVariantIds: variants,
    clueOrderKeys,
    canonicalClueOrderKeys,
    clueOrderShuffled: clueOrderKeys.join('|') !== canonicalClueOrderKeys.join('|'),
    maxConsecutiveSameClueTemplate: maxRun(variants),
  } as const;

  const localized = {
    ...v4,
    stem,
    localizationMetadata: {
      ...v4.localizationMetadata,
      version: RNK_CP004_LOCALIZATION_REVIEW_V5_VERSION,
      moderateEditorialDiversityOverlay: 'SEEDED_2_INTRO_3_CLUE_2_QUERY_V5',
      v4PedagogyBaselinePreserved: true,
      editorialDiversity: diversity,
    },
    localizationProof: {
      ...v4.localizationProof,
      authority: RNK_CP004_LOCALIZATION_REVIEW_V5_AUTHORITY,
      v4LocalizationFingerprint: v4.localizationProof.localizationFingerprint,
      editorialDiversityCoverage: 'EXECUTABLE_PROVED',
      localizationFingerprint: '',
    },
  } as unknown as RnkCp004LocalizedReviewQuestionV5;

  return {
    ...localized,
    localizationProof: {
      ...localized.localizationProof,
      localizationFingerprint: v5Fingerprint(localized),
    },
  };
}

export function buildRnkCp004LocalizedReviewBankV5(
  locale: RnkCp004LocalizedLocale,
): readonly RnkCp004LocalizedReviewQuestionV5[] {
  return buildRnkCp004PermanentRuntime().map((question) =>
    localizeRnkCp004PermanentQuestionV5(question, locale));
}
