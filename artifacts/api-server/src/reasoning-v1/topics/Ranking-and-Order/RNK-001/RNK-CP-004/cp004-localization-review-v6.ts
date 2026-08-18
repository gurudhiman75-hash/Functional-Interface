import { createHash } from 'node:crypto';

import { reconstructUniqueOrder } from './cp004-foundation';
import {
  buildRnkCp004PermanentRuntime,
  type RnkCp004PermanentQuestion,
} from './cp004-permanent-runtime-v1';
import type { RnkCp004LocalizedLocale } from './cp004-localization-review-v1';
import {
  localizeRnkCp004PermanentQuestionV5Final,
  type RnkCp004LocalizedReviewQuestionV5Final,
} from './cp004-localization-review-v5-final';

export const RNK_CP004_LOCALIZATION_REVIEW_V6_VERSION =
  'RNK_CP004_HI_PA_LOCALIZATION_REVIEW_V6' as const;
export const RNK_CP004_LOCALIZATION_REVIEW_V6_AUTHORITY =
  'RNK_CP004_HI_PA_ENDPOINT_POSITION_OPTION_PEDAGOGY_V6' as const;

export type RnkCp004LocalizedReviewQuestionV6 = Record<string, any>;
type AnyQuestion = Record<string, any>;
type AnyOption = Record<string, any>;

function native(locale: RnkCp004LocalizedLocale, hi: string, pa: string): string {
  return locale === 'hi-IN' ? hi : pa;
}

function sha256(value: unknown): string {
  return createHash('sha256')
    .update(typeof value === 'string' ? value : JSON.stringify(value), 'utf8')
    .digest('hex');
}

function localName(question: AnyQuestion, canonicalName: string): string {
  const index = question.canonicalNames.indexOf(canonicalName);
  if (index < 0) throw new Error(`CP004 V6 cannot localize canonical name ${canonicalName}`);
  return question.localizedNames[index]!;
}

function solvedOrder(canonical: AnyQuestion): readonly string[] {
  return reconstructUniqueOrder(
    canonical.displayedEvidence.entities,
    canonical.displayedEvidence.clues,
  );
}

function optionEntity(canonical: AnyQuestion, optionIndex: number): string {
  const key = String(canonical.options[optionIndex]?.answerKey ?? '');
  if (!canonical.displayedEvidence.entities.includes(key)) {
    throw new Error(`CP004 V6 expected entity option at index ${optionIndex}, found ${key}`);
  }
  return key;
}

function endpointReason(
  canonical: AnyQuestion,
  localized: AnyQuestion,
  optionIndex: number,
  locale: RnkCp004LocalizedLocale,
  order: readonly string[],
): string {
  const optionKey = optionEntity(canonical, optionIndex);
  const answerKey = optionEntity(canonical, canonical.correctIndex);
  const option = localName(localized, optionKey);
  const answer = localName(localized, answerKey);
  const optionRank = order.indexOf(optionKey) + 1;
  const answerRank = order.indexOf(answerKey) + 1;

  if (answerRank !== 1 && answerRank !== order.length) {
    throw new Error(`CP004 V6 endpoint answer is not an endpoint: rank ${answerRank}/${order.length}`);
  }

  if (optionIndex === canonical.correctIndex) {
    return answerRank === 1
      ? native(
          locale,
          `${answer} पूरे क्रम में पहले स्थान पर है; इसलिए वही सबसे ऊपर है`,
          `${answer} ਪੂਰੇ ਕ੍ਰਮ ਵਿੱਚ ਪਹਿਲੇ ਸਥਾਨ ਉੱਤੇ ਹੈ; ਇਸ ਲਈ ਉਹੀ ਸਭ ਤੋਂ ਉੱਪਰ ਹੈ`,
        )
      : native(
          locale,
          `${answer} पूरे क्रम में अंतिम स्थान पर है; इसलिए वही सबसे नीचे है`,
          `${answer} ਪੂਰੇ ਕ੍ਰਮ ਵਿੱਚ ਆਖਰੀ ਸਥਾਨ ਉੱਤੇ ਹੈ; ਇਸ ਲਈ ਉਹੀ ਸਭ ਤੋਂ ਹੇਠਾਂ ਹੈ`,
        );
  }

  return answerRank === 1
    ? native(
        locale,
        `${option} पूरे क्रम में स्थान ${optionRank} पर है, जबकि ${answer} स्थान 1 पर है; इसलिए ${option} सबसे ऊपर नहीं हो सकता`,
        `${option} ਪੂਰੇ ਕ੍ਰਮ ਵਿੱਚ ਸਥਾਨ ${optionRank} ਉੱਤੇ ਹੈ, ਜਦਕਿ ${answer} ਸਥਾਨ 1 ਉੱਤੇ ਹੈ; ਇਸ ਲਈ ${option} ਸਭ ਤੋਂ ਉੱਪਰ ਨਹੀਂ ਹੋ ਸਕਦਾ`,
      )
    : native(
        locale,
        `${option} पूरे क्रम में स्थान ${optionRank} पर है, जबकि ${answer} अंतिम स्थान ${order.length} पर है; इसलिए ${option} सबसे नीचे नहीं हो सकता`,
        `${option} ਪੂਰੇ ਕ੍ਰਮ ਵਿੱਚ ਸਥਾਨ ${optionRank} ਉੱਤੇ ਹੈ, ਜਦਕਿ ${answer} ਆਖਰੀ ਸਥਾਨ ${order.length} ਉੱਤੇ ਹੈ; ਇਸ ਲਈ ${option} ਸਭ ਤੋਂ ਹੇਠਾਂ ਨਹੀਂ ਹੋ ਸਕਦਾ`,
      );
}

function positionReason(
  canonical: AnyQuestion,
  localized: AnyQuestion,
  optionIndex: number,
  locale: RnkCp004LocalizedLocale,
  order: readonly string[],
): string {
  const optionKey = optionEntity(canonical, optionIndex);
  const answerKey = optionEntity(canonical, canonical.correctIndex);
  const option = localName(localized, optionKey);
  const answer = localName(localized, answerKey);
  const optionTopRank = order.indexOf(optionKey) + 1;
  const answerTopRank = order.indexOf(answerKey) + 1;
  const fromBottom = canonical.reviewMetadata.sourceInverseProfile.rankReference === 'BOTTOM';
  const optionRank = fromBottom ? order.length - optionTopRank + 1 : optionTopRank;
  const answerRank = fromBottom ? order.length - answerTopRank + 1 : answerTopRank;
  const side = native(locale, fromBottom ? 'नीचे से' : 'ऊपर से', fromBottom ? 'ਹੇਠੋਂ' : 'ਉੱਪਰੋਂ');

  if (optionIndex === canonical.correctIndex) {
    return native(
      locale,
      `${answer} ${side} स्थान ${answerRank} पर है; इसलिए यह विकल्प पूछे गए स्थान से ठीक मेल खाता है`,
      `${answer} ${side} ਸਥਾਨ ${answerRank} ਉੱਤੇ ਹੈ; ਇਸ ਲਈ ਇਹ ਚੋਣ ਪੁੱਛੇ ਗਏ ਸਥਾਨ ਨਾਲ ਠੀਕ ਮਿਲਦੀ ਹੈ`,
    );
  }

  return native(
    locale,
    `${option} ${side} स्थान ${optionRank} पर है, लेकिन पूछा गया स्थान ${answerRank} है और वहाँ ${answer} है`,
    `${option} ${side} ਸਥਾਨ ${optionRank} ਉੱਤੇ ਹੈ, ਪਰ ਪੁੱਛਿਆ ਗਿਆ ਸਥਾਨ ${answerRank} ਹੈ ਅਤੇ ਉੱਥੇ ${answer} ਹੈ`,
  );
}

function finalFingerprint(question: AnyQuestion): string {
  return sha256({
    version: RNK_CP004_LOCALIZATION_REVIEW_V6_VERSION,
    previousFingerprint: question.localizationProof.v5FinalLocalizationFingerprint,
    canonicalSemanticFingerprint: question.localizationProof.canonicalSemanticFingerprint,
    locale: question.locale,
    stem: question.stem,
    answer: question.answer,
    options: question.options,
    explanation: question.explanation,
    visibleExplanation: question.visibleExplanation,
  });
}

export function localizeRnkCp004PermanentQuestionV6(
  canonicalQuestion: RnkCp004PermanentQuestion | AnyQuestion,
  locale: RnkCp004LocalizedLocale,
): RnkCp004LocalizedReviewQuestionV6 {
  const canonical = canonicalQuestion as AnyQuestion;
  const v5 = localizeRnkCp004PermanentQuestionV5Final(
    canonicalQuestion,
    locale,
  ) as RnkCp004LocalizedReviewQuestionV5Final & AnyQuestion;
  const qlId = canonical.reviewMetadata.permanentProfile.permanentQlId as string;
  const remediated = qlId === 'RNK-QL-027' || qlId === 'RNK-QL-028';

  let options = v5.options;
  let explanation = v5.explanation;
  let visibleExplanation = v5.visibleExplanation;

  if (remediated) {
    const order = solvedOrder(canonical);
    const reasonFor = (index: number) => qlId === 'RNK-QL-027'
      ? endpointReason(canonical, v5, index, locale, order)
      : positionReason(canonical, v5, index, locale, order);

    options = v5.options.map((option: AnyOption, index: number) => ({
      ...option,
      explanation: reasonFor(index),
    }));
    const optionAnalysis = options.map((option: AnyOption, index: number) => native(
      locale,
      `विकल्प ${index + 1}: ${option.explanation}।`,
      `ਚੋਣ ${index + 1}: ${option.explanation}।`,
    ));
    explanation = {
      ...v5.explanation,
      optionAnalysis,
    };
    visibleExplanation = {
      ...v5.visibleExplanation,
      optionAnalysis,
    };
  }

  const localized: AnyQuestion = {
    ...v5,
    options,
    explanation,
    visibleExplanation,
    localizationMetadata: {
      ...v5.localizationMetadata,
      version: RNK_CP004_LOCALIZATION_REVIEW_V6_VERSION,
      optionPedagogyOverlay: 'ENDPOINT_POSITION_REASON_SPECIFIC_V6',
      v5FinalSurfacePreserved: true,
      ql027028PedagogyRemediated: remediated,
    },
    localizationProof: {
      ...v5.localizationProof,
      authority: RNK_CP004_LOCALIZATION_REVIEW_V6_AUTHORITY,
      v5FinalLocalizationFingerprint: v5.localizationProof.localizationFingerprint,
      optionPedagogyCoverage: remediated ? 'EXECUTABLE_PROVED' : 'NOT_APPLICABLE',
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

export function buildRnkCp004LocalizedReviewBankV6(
  locale: RnkCp004LocalizedLocale,
): readonly RnkCp004LocalizedReviewQuestionV6[] {
  return buildRnkCp004PermanentRuntime().map((question) =>
    localizeRnkCp004PermanentQuestionV6(question, locale));
}
