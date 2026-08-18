import { createHash } from 'node:crypto';

import { reconstructUniqueOrder } from './cp004-foundation';
import { RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID } from './cp004-authority-consolidation-v1';
import {
  buildRnkCp004PermanentRuntime,
  type RnkCp004PermanentQuestion,
} from './cp004-permanent-runtime-v1';
import type { RnkCp004LocalizedLocale } from './cp004-localization-review-v1';
import {
  localizeRnkCp004PermanentQuestionV2,
  type RnkCp004LocalizedReviewQuestionV2,
} from './cp004-localization-review-v2';

export const RNK_CP004_LOCALIZATION_REVIEW_V3_VERSION =
  'RNK_CP004_HI_PA_LOCALIZATION_REVIEW_V3' as const;
export const RNK_CP004_LOCALIZATION_REVIEW_V3_AUTHORITY =
  'RNK_CP004_HI_PA_RUNTIME_DISTRACTOR_CONTRACT_V3' as const;

export type RnkCp004LocalizedReviewQuestionV3 = Omit<
  RnkCp004LocalizedReviewQuestionV2,
  'localizationMetadata' | 'localizationProof'
> & {
  readonly localizationMetadata: Omit<
    RnkCp004LocalizedReviewQuestionV2['localizationMetadata'],
    'version'
  > & Readonly<{
    version: typeof RNK_CP004_LOCALIZATION_REVIEW_V3_VERSION;
    runtimeDistractorContractOverlay: 'FROZEN_RUNTIME_DISTRACTOR_CONTRACT_V3';
    v2EditorialBaselinePreserved: true;
  }>;
  readonly localizationProof: Omit<
    RnkCp004LocalizedReviewQuestionV2['localizationProof'],
    'authority'
  > & Readonly<{
    authority: typeof RNK_CP004_LOCALIZATION_REVIEW_V3_AUTHORITY;
    v2LocalizationFingerprint: string;
    runtimeDistractorContractCoverage: 'EXECUTABLE_PROVED';
  }>;
};

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

function localName(
  localized: RnkCp004LocalizedReviewQuestionV2,
  canonicalName: string,
): string {
  const index = localized.canonicalNames.indexOf(canonicalName);
  if (index < 0) throw new Error(`CP004 V3 cannot localize canonical name ${canonicalName}`);
  return localized.localizedNames[index]!;
}

function relationLabel(
  localized: RnkCp004LocalizedReviewQuestionV2,
  higher: string,
  lower: string,
  locale: RnkCp004LocalizedLocale,
  immediate = false,
): string {
  const high = localName(localized, higher);
  const low = localName(localized, lower);
  if (immediate) {
    return native(
      locale,
      `${high} की रैंक ${low} से ठीक ऊपर है`,
      `${high} ਦੀ ਰੈਂਕ ${low} ਤੋਂ ਤੁਰੰਤ ਉੱਪਰ ਹੈ`,
    );
  }
  return native(
    locale,
    `${high} की रैंक ${low} से ऊपर है`,
    `${high} ਦੀ ਰੈਂਕ ${low} ਤੋਂ ਉੱਪਰ ਹੈ`,
  );
}

function pairOrder(canonical: AnyQuestion): readonly string[] {
  return reconstructUniqueOrder(
    canonical.displayedEvidence.entities,
    canonical.displayedEvidence.clues,
  );
}

function pairHigherLower(canonical: AnyQuestion, order: readonly string[]): readonly [string, string] {
  const query = canonical.displayedEvidence.query;
  if (query.kind !== 'RELATIVE_ORDER_OF_PAIR') throw new Error('CP004 V3 expected relative-order pair query');
  const firstIndex = order.indexOf(query.first);
  const secondIndex = order.indexOf(query.second);
  if (firstIndex < 0 || secondIndex < 0) throw new Error('CP004 V3 pair entity missing from solved order');
  return firstIndex < secondIndex
    ? [query.first, query.second]
    : [query.second, query.first];
}

function parsedDistanceFromKey(key: string): number | null {
  const match = key.match(/(?:\||:)(\d+)$/u);
  return match ? Number(match[1]) : null;
}

function exactDistanceLabel(
  canonical: AnyQuestion,
  localized: RnkCp004LocalizedReviewQuestionV2,
  option: AnyOption,
  locale: RnkCp004LocalizedLocale,
  order: readonly string[],
): string {
  const query = canonical.displayedEvidence.query;
  if (query.kind !== 'RELATIVE_ORDER_OF_PAIR') throw new Error('CP004 V3 exact-distance query mismatch');
  const [higher, lower] = pairHigherLower(canonical, order);
  const difference = Math.abs(order.indexOf(query.first) - order.indexOf(query.second));
  let displayedHigher = higher;
  let displayedDifference = difference;

  switch (option.misconceptionId) {
    case 'CORRECT':
      break;
    case 'REVERSE_DIRECTION':
    case 'RELATION_REVERSED':
      displayedHigher = lower;
      break;
    case 'NUMBER_BETWEEN_CONFUSION':
      displayedDifference = Math.max(0, difference - 1);
      break;
    case 'INCLUSIVE_COUNT_CONFUSION':
      displayedDifference = difference + 1;
      break;
    case 'DISTANCE_OFF_BY_ONE':
      displayedDifference = parsedDistanceFromKey(option.answerKey) ?? difference;
      break;
    default:
      displayedDifference = parsedDistanceFromKey(option.answerKey) ?? difference;
      break;
  }

  const high = localName(localized, displayedHigher);
  return native(
    locale,
    `रैंकों का अंतर ${displayedDifference} है और ${high} की रैंक ऊपर है`,
    `ਰੈਂਕਾਂ ਦਾ ਫਰਕ ${displayedDifference} ਹੈ ਅਤੇ ${high} ਦੀ ਰੈਂਕ ਉੱਪਰ ਹੈ`,
  );
}

function pairLabel(
  canonical: AnyQuestion,
  localized: RnkCp004LocalizedReviewQuestionV2,
  option: AnyOption,
  locale: RnkCp004LocalizedLocale,
  order: readonly string[],
): string {
  const query = canonical.displayedEvidence.query;
  if (query.kind !== 'RELATIVE_ORDER_OF_PAIR') return String(option.label);
  if (canonical.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    return exactDistanceLabel(canonical, localized, option, locale, order);
  }

  const [higher, lower] = pairHigherLower(canonical, order);
  switch (option.misconceptionId) {
    case 'CORRECT':
      return relationLabel(localized, higher, lower, locale);
    case 'REVERSE_DIRECTION':
    case 'RELATION_REVERSED':
      return relationLabel(localized, lower, higher, locale);
    case 'ASSUMED_ADJACENCY':
      return relationLabel(localized, higher, lower, locale, true);
    case 'REVERSED_AND_ASSUMED_ADJACENCY':
      return relationLabel(localized, lower, higher, locale, true);
    case 'SAME_RANK_CONTRADICTION': {
      const first = localName(localized, query.first);
      const second = localName(localized, query.second);
      return native(
        locale,
        `${first} और ${second} की रैंक समान है`,
        `${first} ਅਤੇ ${second} ਦੀਆਂ ਰੈਂਕਾਂ ਇੱਕੋ ਹਨ`,
      );
    }
    case 'CANNOT_DETERMINE_CONTRADICTION': {
      const first = localName(localized, query.first);
      const second = localName(localized, query.second);
      return native(
        locale,
        `${first} और ${second} का आपसी क्रम निर्धारित नहीं किया जा सकता`,
        `${first} ਅਤੇ ${second} ਦਾ ਆਪਸੀ ਕ੍ਰਮ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ`,
      );
    }
    default:
      throw new Error(`CP004 V3 unsupported relative-order misconception ${String(option.misconceptionId)}`);
  }
}

function pairOptionExplanation(
  canonical: AnyQuestion,
  localized: RnkCp004LocalizedReviewQuestionV2,
  option: AnyOption,
  optionIndex: number,
  label: string,
  answer: string,
  locale: RnkCp004LocalizedLocale,
  order: readonly string[],
): string {
  const query = canonical.displayedEvidence.query;
  if (query.kind !== 'RELATIVE_ORDER_OF_PAIR') throw new Error('CP004 V3 option explanation query mismatch');
  const [higher, lower] = pairHigherLower(canonical, order);
  const high = localName(localized, higher);
  const low = localName(localized, lower);

  if (optionIndex === canonical.correctIndex) {
    if (canonical.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
      const highRank = order.indexOf(higher) + 1;
      const lowRank = order.indexOf(lower) + 1;
      return native(
        locale,
        `${high} की रैंक ${highRank} और ${low} की रैंक ${lowRank} है; इसलिए “${label}” सही है`,
        `${high} ਦੀ ਰੈਂਕ ${highRank} ਅਤੇ ${low} ਦੀ ਰੈਂਕ ${lowRank} ਹੈ; ਇਸ ਲਈ “${label}” ਸਹੀ ਹੈ`,
      );
    }
    return native(
      locale,
      `पूरे क्रम में ${high}, ${low} से ऊपर है; इसलिए “${label}” सही है`,
      `ਪੂਰੇ ਕ੍ਰਮ ਵਿੱਚ ${high}, ${low} ਤੋਂ ਉੱਪਰ ਹੈ; ਇਸ ਲਈ “${label}” ਸਹੀ ਹੈ`,
    );
  }

  if (canonical.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    const difference = Math.abs(order.indexOf(query.first) - order.indexOf(query.second));
    const between = Math.max(0, difference - 1);
    const inclusive = difference + 1;
    switch (option.misconceptionId) {
      case 'REVERSE_DIRECTION':
      case 'RELATION_REVERSED':
        return native(
          locale,
          `रैंक-अंतर ${difference} सही है, लेकिन ${high}, ${low} से ऊपर है; दिशा उलटी नहीं हो सकती`,
          `ਰੈਂਕ-ਫਰਕ ${difference} ਸਹੀ ਹੈ, ਪਰ ${high}, ${low} ਤੋਂ ਉੱਪਰ ਹੈ; ਦਿਸ਼ਾ ਉਲਟੀ ਨਹੀਂ ਹੋ ਸਕਦੀ`,
        );
      case 'NUMBER_BETWEEN_CONFUSION':
        return native(
          locale,
          `दोनों के बीच ${between} व्यक्ति हैं, लेकिन रैंकों का अंतर ${difference} है`,
          `ਦੋਵਾਂ ਦੇ ਵਿਚਕਾਰ ${between} ਵਿਅਕਤੀ ਹਨ, ਪਰ ਰੈਂਕਾਂ ਦਾ ਫਰਕ ${difference} ਹੈ`,
        );
      case 'INCLUSIVE_COUNT_CONFUSION':
        return native(
          locale,
          `दोनों सिरों को साथ गिनने पर ${inclusive} आता है, लेकिन रैंकों का अंतर ${difference} है`,
          `ਦੋਵੇਂ ਸਿਰੇ ਸਮੇਤ ਗਿਣਨ ਉੱਤੇ ${inclusive} ਆਉਂਦਾ ਹੈ, ਪਰ ਰੈਂਕਾਂ ਦਾ ਫਰਕ ${difference} ਹੈ`,
        );
      case 'DISTANCE_OFF_BY_ONE':
        return native(
          locale,
          `इस विकल्प में अंतर गलत है; सही रैंक-अंतर ${difference} है`,
          `ਇਸ ਚੋਣ ਵਿੱਚ ਫਰਕ ਗਲਤ ਹੈ; ਸਹੀ ਰੈਂਕ-ਫਰਕ ${difference} ਹੈ`,
        );
      default:
        return native(
          locale,
          `“${label}” सही निष्कर्ष “${answer}” से मेल नहीं खाता`,
          `“${label}” ਸਹੀ ਨਤੀਜੇ “${answer}” ਨਾਲ ਨਹੀਂ ਮਿਲਦਾ`,
        );
    }
  }

  const between = Math.abs(order.indexOf(query.first) - order.indexOf(query.second)) - 1;
  switch (option.misconceptionId) {
    case 'REVERSE_DIRECTION':
    case 'RELATION_REVERSED':
      return native(
        locale,
        `${high}, ${low} से ऊपर है; यह विकल्प दिशा उलट देता है`,
        `${high}, ${low} ਤੋਂ ਉੱਪਰ ਹੈ; ਇਹ ਚੋਣ ਦਿਸ਼ਾ ਉਲਟ ਦਿੰਦੀ ਹੈ`,
      );
    case 'SAME_RANK_CONTRADICTION':
      return native(
        locale,
        'सभी व्यक्तियों की रैंक अलग-अलग है, इसलिए समान रैंक संभव नहीं है',
        'ਸਾਰੇ ਵਿਅਕਤੀਆਂ ਦੀਆਂ ਰੈਂਕਾਂ ਵੱਖ-ਵੱਖ ਹਨ, ਇਸ ਲਈ ਇੱਕੋ ਰੈਂਕ ਸੰਭਵ ਨਹੀਂ ਹੈ',
      );
    case 'CANNOT_DETERMINE_CONTRADICTION':
      return native(
        locale,
        `दी गई तुलनाएँ एक निश्चित पूरा क्रम बनाती हैं; इसलिए ${high} और ${low} का आपसी क्रम निर्धारित है`,
        `ਦਿੱਤੀਆਂ ਤੁਲਨਾਵਾਂ ਇੱਕ ਨਿਸ਼ਚਿਤ ਪੂਰਾ ਕ੍ਰਮ ਬਣਾਉਂਦੀਆਂ ਹਨ; ਇਸ ਲਈ ${high} ਅਤੇ ${low} ਦਾ ਆਪਸੀ ਕ੍ਰਮ ਨਿਰਧਾਰਤ ਹੈ`,
      );
    case 'ASSUMED_ADJACENCY':
      return native(
        locale,
        `दिशा सही है, लेकिन दोनों के बीच ${between} व्यक्ति हैं; इसलिए “ठीक ऊपर” कहना गलत है`,
        `ਦਿਸ਼ਾ ਸਹੀ ਹੈ, ਪਰ ਦੋਵਾਂ ਦੇ ਵਿਚਕਾਰ ${between} ਵਿਅਕਤੀ ਹਨ; ਇਸ ਲਈ “ਤੁਰੰਤ ਉੱਪਰ” ਕਹਿਣਾ ਗਲਤ ਹੈ`,
      );
    case 'REVERSED_AND_ASSUMED_ADJACENCY':
      return native(
        locale,
        `यह विकल्प दिशा भी उलटता है और बीच के ${between} व्यक्तियों को भी नजरअंदाज करता है`,
        `ਇਹ ਚੋਣ ਦਿਸ਼ਾ ਵੀ ਉਲਟਦੀ ਹੈ ਅਤੇ ਵਿਚਕਾਰਲੇ ${between} ਵਿਅਕਤੀਆਂ ਨੂੰ ਵੀ ਨਜ਼ਰਅੰਦਾਜ਼ ਕਰਦੀ ਹੈ`,
      );
    default:
      return native(
        locale,
        `“${label}” सही संबंध “${answer}” से मेल नहीं खाता`,
        `“${label}” ਸਹੀ ਸੰਬੰਧ “${answer}” ਨਾਲ ਨਹੀਂ ਮਿਲਦਾ`,
      );
  }
}

function pairExplanation(
  canonical: AnyQuestion,
  localized: RnkCp004LocalizedReviewQuestionV2,
  options: readonly AnyOption[],
  answer: string,
  locale: RnkCp004LocalizedLocale,
  order: readonly string[],
): RnkCp004LocalizedReviewQuestionV2['explanation'] {
  const query = canonical.displayedEvidence.query;
  if (query.kind !== 'RELATIVE_ORDER_OF_PAIR') return localized.explanation;
  const firstLine = localized.explanation.stepByStepSolution[0]!;
  const steps: string[] = [firstLine];

  if (canonical.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    const first = localName(localized, query.first);
    const second = localName(localized, query.second);
    const firstRank = order.indexOf(query.first) + 1;
    const secondRank = order.indexOf(query.second) + 1;
    const difference = Math.abs(firstRank - secondRank);
    steps.push(native(
      locale,
      `${first} की रैंक ${firstRank} और ${second} की रैंक ${secondRank} है; इसलिए रैंकों का अंतर ${difference} है।`,
      `${first} ਦੀ ਰੈਂਕ ${firstRank} ਅਤੇ ${second} ਦੀ ਰੈਂਕ ${secondRank} ਹੈ; ਇਸ ਲਈ ਰੈਂਕਾਂ ਦਾ ਫਰਕ ${difference} ਹੈ।`,
    ));
    steps.push(native(locale, `अतः सही विकल्प है: ${answer}।`, `ਇਸ ਲਈ ਸਹੀ ਚੋਣ ਹੈ: ${answer}।`));
  } else {
    const [higher, lower] = pairHigherLower(canonical, order);
    const high = localName(localized, higher);
    const low = localName(localized, lower);
    steps.push(native(
      locale,
      `${high} पूरे क्रम में ${low} से ऊपर है; इसलिए सही संबंध है: ${answer}।`,
      `${high} ਪੂਰੇ ਕ੍ਰਮ ਵਿੱਚ ${low} ਤੋਂ ਉੱਪਰ ਹੈ; ਇਸ ਲਈ ਸਹੀ ਸੰਬੰਧ ਹੈ: ${answer}।`,
    ));
  }

  const optionAnalysis = options.map((option, index) => native(
    locale,
    `विकल्प ${index + 1}: ${option.explanation}।`,
    `ਚੋਣ ${index + 1}: ${option.explanation}।`,
  ));

  return {
    ...localized.explanation,
    stepByStepSolution: steps,
    optionAnalysis,
    conclusion: native(locale, `सही उत्तर: ${answer}।`, `ਸਹੀ ਜਵਾਬ: ${answer}।`),
  };
}

function v3Fingerprint(question: AnyQuestion): string {
  return sha256({
    version: RNK_CP004_LOCALIZATION_REVIEW_V3_VERSION,
    canonicalSemanticFingerprint: question.localizationProof.canonicalSemanticFingerprint,
    locale: question.locale,
    stem: question.stem,
    answer: question.answer,
    options: question.options.map((option: AnyOption) => ({
      answerKey: option.answerKey,
      label: option.label,
      misconceptionId: option.misconceptionId,
      explanation: option.explanation,
    })),
    explanation: question.explanation,
    visibleExplanation: question.visibleExplanation,
  });
}

export function localizeRnkCp004PermanentQuestionV3(
  canonicalQuestion: RnkCp004PermanentQuestion | AnyQuestion,
  locale: RnkCp004LocalizedLocale,
): RnkCp004LocalizedReviewQuestionV3 {
  const canonical = canonicalQuestion as AnyQuestion;
  const v2 = localizeRnkCp004PermanentQuestionV2(canonicalQuestion, locale);
  const query = canonical.displayedEvidence.query;

  let answer = v2.answer;
  let options = v2.options as readonly AnyOption[];
  let explanation = v2.explanation;
  let visibleExplanation = v2.visibleExplanation;

  if (query.kind === 'RELATIVE_ORDER_OF_PAIR') {
    const order = pairOrder(canonical);
    const labels = canonical.options.map((option: AnyOption) =>
      pairLabel(canonical, v2, option, locale, order));
    answer = labels[canonical.correctIndex]!;
    options = v2.options.map((option: AnyOption, index: number) => ({
      ...option,
      label: labels[index]!,
      explanation: pairOptionExplanation(
        canonical,
        v2,
        canonical.options[index]!,
        index,
        labels[index]!,
        answer,
        locale,
        order,
      ),
    }));
    explanation = pairExplanation(canonical, v2, options, answer, locale, order);
    visibleExplanation = {
      ...v2.visibleExplanation,
      lines: explanation.stepByStepSolution,
      answer,
      optionAnalysis: explanation.optionAnalysis,
    };
  }

  const localized = {
    ...v2,
    answer,
    options,
    explanation,
    visibleExplanation,
    localizationMetadata: {
      ...v2.localizationMetadata,
      version: RNK_CP004_LOCALIZATION_REVIEW_V3_VERSION,
      runtimeDistractorContractOverlay: 'FROZEN_RUNTIME_DISTRACTOR_CONTRACT_V3',
      v2EditorialBaselinePreserved: true,
    },
    localizationProof: {
      ...v2.localizationProof,
      authority: RNK_CP004_LOCALIZATION_REVIEW_V3_AUTHORITY,
      v2LocalizationFingerprint: v2.localizationProof.localizationFingerprint,
      runtimeDistractorContractCoverage: 'EXECUTABLE_PROVED',
      localizationFingerprint: '',
    },
  } as unknown as RnkCp004LocalizedReviewQuestionV3;

  return {
    ...localized,
    localizationProof: {
      ...localized.localizationProof,
      localizationFingerprint: v3Fingerprint(localized),
    },
  };
}

export function buildRnkCp004LocalizedReviewBankV3(
  locale: RnkCp004LocalizedLocale,
): readonly RnkCp004LocalizedReviewQuestionV3[] {
  return buildRnkCp004PermanentRuntime().map((question) =>
    localizeRnkCp004PermanentQuestionV3(question, locale));
}
