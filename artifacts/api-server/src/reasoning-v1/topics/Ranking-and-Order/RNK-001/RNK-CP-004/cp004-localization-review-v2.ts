import { createHash } from 'node:crypto';

import {
  reconstructUniqueOrder,
  type RnkCp004Comparison,
} from './cp004-foundation';
import {
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
} from './cp004-authority-consolidation-v1';
import {
  buildRnkCp004PermanentRuntime,
  type RnkCp004PermanentQuestion,
} from './cp004-permanent-runtime-v1';
import {
  localizeRnkCp004PermanentQuestion,
  type RnkCp004LocalizedLocale,
  type RnkCp004LocalizedReviewQuestion,
} from './cp004-localization-review-v1';

export const RNK_CP004_LOCALIZATION_REVIEW_V2_VERSION =
  'RNK_CP004_HI_PA_LOCALIZATION_REVIEW_V2' as const;
export const RNK_CP004_LOCALIZATION_REVIEW_V2_AUTHORITY =
  'RNK_CP004_HI_PA_NATIVE_EDITORIAL_V2' as const;

export type RnkCp004LocalizedReviewQuestionV2 = RnkCp004LocalizedReviewQuestion & {
  readonly localizationMetadata: RnkCp004LocalizedReviewQuestion['localizationMetadata'] & Readonly<{
    version: typeof RNK_CP004_LOCALIZATION_REVIEW_V2_VERSION;
    editorialOverlay: 'NATIVE_GRAMMAR_AND_PEDAGOGY_V2';
    v1SemanticBaselinePreserved: true;
  }>;
  readonly localizationProof: Omit<RnkCp004LocalizedReviewQuestion['localizationProof'], 'authority'> & Readonly<{
    authority: typeof RNK_CP004_LOCALIZATION_REVIEW_V2_AUTHORITY;
    v1LocalizationFingerprint: string;
    v1CanonicalSemanticFingerprint: string;
    editorialInvariance: 'EXECUTABLE_PROVED';
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

function relationKey(comparison: RnkCp004Comparison): string {
  return `${comparison.higher}>${comparison.lower}`;
}

function localName(
  localized: RnkCp004LocalizedReviewQuestion,
  canonicalName: string,
): string {
  const index = localized.canonicalNames.indexOf(canonicalName);
  if (index < 0) throw new Error(`CP004 V2 cannot localize canonical name ${canonicalName}`);
  return localized.localizedNames[index]!;
}

function localOrder(
  localized: RnkCp004LocalizedReviewQuestion,
  order: readonly string[],
): string {
  return order.map((name) => localName(localized, name)).join(' > ');
}

function solvedOrder(question: AnyQuestion): readonly string[] {
  const evidence = question.displayedEvidence;
  if (evidence.query.kind !== 'MISSING_COMPARISON') {
    return reconstructUniqueOrder(evidence.entities, evidence.clues);
  }
  const bridge = evidence.query.candidates.find(
    (candidate: RnkCp004Comparison) => relationKey(candidate) === question.answerKey,
  );
  if (!bridge) throw new Error(`CP004 V2 missing canonical bridge ${question.answerKey}`);
  return reconstructUniqueOrder(evidence.entities, [...evidence.clues, bridge]);
}

function replaceLastNonEmptyLine(text: string, replacement: string): string {
  const lines = text.split('\n');
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (lines[index]!.trim().length > 0) {
      lines[index] = replacement;
      return lines.join('\n');
    }
  }
  throw new Error('CP004 V2 stem has no non-empty question line');
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

function removeNameComma(
  text: string,
  localized: RnkCp004LocalizedReviewQuestion,
): string {
  let output = text;
  for (const name of localized.localizedNames) {
    output = output.split(`${name}, `).join(`${name} `);
  }
  return output;
}

function polishedStem(
  canonical: AnyQuestion,
  v1: RnkCp004LocalizedReviewQuestion,
  locale: RnkCp004LocalizedLocale,
): string {
  let stem = removeNameComma(v1.stem, v1);
  if (locale === 'hi-IN') {
    stem = stem
      .replace(/(\d+) अभ्यर्थियों का अलग-अलग स्थान है।/gu, '$1 अभ्यर्थियों के अलग-अलग स्थान हैं।')
      .replace(/(\d+) व्यक्तियों की रैंक अलग-अलग है।/gu, '$1 व्यक्तियों की रैंक अलग-अलग हैं।');
  }

  const query = canonical.displayedEvidence.query;
  const inverse = canonical.reviewMetadata.sourceInverseProfile;

  if (canonical.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    const first = localName(v1, query.first);
    const second = localName(v1, query.second);
    return replaceLastNonEmptyLine(
      stem,
      native(
        locale,
        `कौन-सा विकल्प ${first} और ${second} की रैंकों का सही अंतर तथा दोनों में किसकी रैंक ऊपर है—दोनों बातें सही बताता है?`,
        `ਕਿਹੜੀ ਚੋਣ ${first} ਅਤੇ ${second} ਦੀਆਂ ਰੈਂਕਾਂ ਦਾ ਸਹੀ ਫਰਕ ਅਤੇ ਦੋਵਾਂ ਵਿੱਚੋਂ ਕਿਸਦੀ ਰੈਂਕ ਉੱਪਰ ਹੈ—ਦੋਵੇਂ ਗੱਲਾਂ ਸਹੀ ਦੱਸਦੀ ਹੈ?`,
      ),
    );
  }

  if (query.kind === 'RANK_OF_NAMED_ENTITY') {
    const target = localName(v1, query.target);
    const side = inverse.rankReference === 'BOTTOM'
      ? native(locale, 'नीचे से', 'ਹੇਠੋਂ')
      : native(locale, 'ऊपर से', 'ਉੱਪਰੋਂ');
    return replaceLastNonEmptyLine(
      stem,
      native(
        locale,
        `${target} ${side} किस स्थान पर है?`,
        `${target} ${side} ਕਿਹੜੇ ਸਥਾਨ ਉੱਤੇ ਹੈ?`,
      ),
    );
  }

  if (query.kind === 'MISSING_COMPARISON') {
    return replaceLastNonEmptyLine(
      stem,
      native(
        locale,
        'कौन-सी अतिरिक्त तुलना जोड़ने पर केवल एक निश्चित पूरा क्रम बनेगा?',
        'ਕਿਹੜੀ ਵਾਧੂ ਤੁਲਨਾ ਜੋੜਨ ਨਾਲ ਕੇਵਲ ਇੱਕ ਨਿਸ਼ਚਿਤ ਪੂਰਾ ਕ੍ਰਮ ਬਣੇਗਾ?',
      ),
    );
  }

  return stem;
}

function requestedPosition(canonical: AnyQuestion): number {
  const query = canonical.displayedEvidence.query;
  if (query.kind !== 'ENTITY_AT_EXACT_RANK') throw new Error('CP004 V2 expected entity-at-rank query');
  return canonical.reviewMetadata.sourceInverseProfile.rankReference === 'BOTTOM'
    ? canonical.displayedEvidence.entities.length - query.rankFromTop + 1
    : query.rankFromTop;
}

function optionExplanation(
  canonical: AnyQuestion,
  v1: RnkCp004LocalizedReviewQuestion,
  option: AnyOption,
  optionIndex: number,
  label: string,
  answer: string,
  order: readonly string[],
  locale: RnkCp004LocalizedLocale,
): string {
  if (optionIndex === canonical.correctIndex) {
    return native(
      locale,
      `“${label}” दी गई सभी तुलनाओं और पूछी गई शर्त से मेल खाता है`,
      `“${label}” ਦਿੱਤੀਆਂ ਸਾਰੀਆਂ ਤੁਲਨਾਵਾਂ ਅਤੇ ਪੁੱਛੀ ਸ਼ਰਤ ਨਾਲ ਮਿਲਦਾ ਹੈ`,
    );
  }

  const query = canonical.displayedEvidence.query;
  if (canonical.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    return native(
      locale,
      `इस विकल्प में “${label}” दिया है, जबकि पूरे क्रम से सही निष्कर्ष “${answer}” मिलता है`,
      `ਇਸ ਚੋਣ ਵਿੱਚ “${label}” ਦਿੱਤਾ ਹੈ, ਜਦਕਿ ਪੂਰੇ ਕ੍ਰਮ ਤੋਂ ਸਹੀ ਨਤੀਜਾ “${answer}” ਮਿਲਦਾ ਹੈ`,
    );
  }

  if (query.kind === 'COMPLETE_ORDER') {
    const expected = canonical.options[canonical.correctIndex]!.answerKey.split('|');
    const candidate = option.answerKey.split('|');
    const mismatch = candidate.findIndex((name: string, index: number) => name !== expected[index]);
    if (mismatch >= 0) {
      const expectedName = localName(v1, expected[mismatch]!);
      const candidateName = localName(v1, candidate[mismatch]!);
      return native(
        locale,
        `स्थान ${mismatch + 1} पर ${expectedName} होना चाहिए, लेकिन इस विकल्प में ${candidateName} है`,
        `ਸਥਾਨ ${mismatch + 1} ਉੱਤੇ ${expectedName} ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ, ਪਰ ਇਸ ਚੋਣ ਵਿੱਚ ${candidateName} ਹੈ`,
      );
    }
  }

  if (query.kind === 'RELATIVE_ORDER_OF_PAIR') {
    const between = Math.abs(order.indexOf(query.first) - order.indexOf(query.second)) - 1;
    if (option.misconceptionId === 'ASSUMED_ADJACENCY') {
      return native(
        locale,
        `दिशा सही है, लेकिन दोनों के बीच ${between} व्यक्ति हैं; इसलिए “ठीक ऊपर” कहना गलत है`,
        `ਦਿਸ਼ਾ ਸਹੀ ਹੈ, ਪਰ ਦੋਵਾਂ ਦੇ ਵਿਚਕਾਰ ${between} ਵਿਅਕਤੀ ਹਨ; ਇਸ ਲਈ “ਤੁਰੰਤ ਉੱਪਰ” ਕਹਿਣਾ ਗਲਤ ਹੈ`,
      );
    }
    if (option.misconceptionId === 'REVERSED_AND_ASSUMED_ADJACENCY') {
      return native(
        locale,
        `यह विकल्प दिशा भी उलटता है और ${between} बीच के व्यक्तियों को भी नजरअंदाज करता है`,
        `ਇਹ ਚੋਣ ਦਿਸ਼ਾ ਵੀ ਉਲਟਦੀ ਹੈ ਅਤੇ ਵਿਚਕਾਰਲੇ ${between} ਵਿਅਕਤੀਆਂ ਨੂੰ ਵੀ ਨਜ਼ਰਅੰਦਾਜ਼ ਕਰਦੀ ਹੈ`,
      );
    }
    return native(
      locale,
      `“${label}” सही संबंध “${answer}” की दिशा उलट देता है`,
      `“${label}” ਸਹੀ ਸੰਬੰਧ “${answer}” ਦੀ ਦਿਸ਼ਾ ਉਲਟ ਦਿੰਦਾ ਹੈ`,
    );
  }

  if (query.kind === 'VALID_RANK_STATEMENT') {
    return native(
      locale,
      `“${label}” दिए गए क्रम से निश्चित रूप से सिद्ध नहीं होता; निश्चित संबंध “${answer}” है`,
      `“${label}” ਦਿੱਤੇ ਕ੍ਰਮ ਤੋਂ ਯਕੀਨੀ ਤੌਰ ਉੱਤੇ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ; ਨਿਸ਼ਚਿਤ ਸੰਬੰਧ “${answer}” ਹੈ`,
    );
  }

  if (query.kind === 'MISSING_COMPARISON') {
    return native(
      locale,
      `“${label}” जोड़ने पर भी दोनों क्रम-खंड एक ही निश्चित पूरे क्रम में नहीं जुड़ते`,
      `“${label}” ਜੋੜਨ ਉੱਤੇ ਵੀ ਦੋਵੇਂ ਕ੍ਰਮ-ਖੰਡ ਇੱਕੋ ਨਿਸ਼ਚਿਤ ਪੂਰੇ ਕ੍ਰਮ ਵਿੱਚ ਨਹੀਂ ਜੁੜਦੇ`,
    );
  }

  if (query.kind === 'IMMEDIATE_NEIGHBOUR') {
    const target = localName(v1, query.target);
    const direction = query.direction === 'ABOVE'
      ? native(locale, 'ठीक ऊपर', 'ਤੁਰੰਤ ਉੱਪਰ')
      : native(locale, 'ठीक नीचे', 'ਤੁਰੰਤ ਹੇਠਾਂ');
    return native(
      locale,
      `${target} से ${direction} ${answer} है, ${label} नहीं`,
      `${target} ਤੋਂ ${direction} ${answer} ਹੈ, ${label} ਨਹੀਂ`,
    );
  }

  if (canonical.answerSemantic === 'RANK') {
    return native(
      locale,
      `इस विकल्प में रैंक ${label} है, जबकि सही रैंक ${answer} है`,
      `ਇਸ ਚੋਣ ਵਿੱਚ ਰੈਂਕ ${label} ਹੈ, ਜਦਕਿ ਸਹੀ ਰੈਂਕ ${answer} ਹੈ`,
    );
  }

  return native(
    locale,
    `इस विकल्प में ${label} दिया है, जबकि सही उत्तर ${answer} है`,
    `ਇਸ ਚੋਣ ਵਿੱਚ ${label} ਦਿੱਤਾ ਹੈ, ਜਦਕਿ ਸਹੀ ਜਵਾਬ ${answer} ਹੈ`,
  );
}

function polishedExplanation(
  canonical: AnyQuestion,
  v1: RnkCp004LocalizedReviewQuestion,
  options: readonly AnyOption[],
  answer: string,
  order: readonly string[],
  locale: RnkCp004LocalizedLocale,
): RnkCp004LocalizedReviewQuestion['explanation'] {
  const query = canonical.displayedEvidence.query;
  const inverse = canonical.reviewMetadata.sourceInverseProfile;
  const chain = localOrder(v1, order);
  const steps: string[] = [
    native(
      locale,
      `दी गई तुलनाओं को जोड़ने पर ऊपर से नीचे क्रम है: ${chain}`,
      `ਦਿੱਤੀਆਂ ਤੁਲਨਾਵਾਂ ਜੋੜਨ ਉੱਤੇ ਉੱਪਰ ਤੋਂ ਹੇਠਾਂ ਕ੍ਰਮ ਹੈ: ${chain}`,
    ),
  ];

  if (canonical.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    const firstRank = order.indexOf(query.first) + 1;
    const secondRank = order.indexOf(query.second) + 1;
    const first = localName(v1, query.first);
    const second = localName(v1, query.second);
    steps.push(native(
      locale,
      `${first} की रैंक ${firstRank} और ${second} की रैंक ${secondRank} है। इसलिए अंतर ${Math.abs(firstRank - secondRank)} है।`,
      `${first} ਦੀ ਰੈਂਕ ${firstRank} ਅਤੇ ${second} ਦੀ ਰੈਂਕ ${secondRank} ਹੈ। ਇਸ ਲਈ ਫਰਕ ${Math.abs(firstRank - secondRank)} ਹੈ।`,
    ));
    steps.push(native(locale, `अतः सही विकल्प है: ${answer}।`, `ਇਸ ਲਈ ਸਹੀ ਚੋਣ ਹੈ: ${answer}।`));
  } else {
    switch (query.kind) {
      case 'HIGHEST_ENTITY':
        steps.push(native(locale, `${answer} क्रम में सबसे ऊपर है।`, `${answer} ਕ੍ਰਮ ਵਿੱਚ ਸਭ ਤੋਂ ਉੱਪਰ ਹੈ।`));
        break;
      case 'LOWEST_ENTITY':
        steps.push(native(locale, `${answer} क्रम में सबसे नीचे है।`, `${answer} ਕ੍ਰਮ ਵਿੱਚ ਸਭ ਤੋਂ ਹੇਠਾਂ ਹੈ।`));
        break;
      case 'ENTITY_AT_EXACT_RANK': {
        const position = requestedPosition(canonical);
        const side = inverse.rankReference === 'BOTTOM'
          ? native(locale, 'नीचे से', 'ਹੇਠੋਂ')
          : native(locale, 'ऊपर से', 'ਉੱਪਰੋਂ');
        steps.push(native(
          locale,
          `${answer} ${side} ${ordinalOblique(position, locale)} स्थान पर है।`,
          `${answer} ${side} ${ordinalOblique(position, locale)} ਸਥਾਨ ਉੱਤੇ ਹੈ।`,
        ));
        break;
      }
      case 'RANK_OF_NAMED_ENTITY': {
        const target = localName(v1, query.target);
        const topRank = order.indexOf(query.target) + 1;
        const rank = inverse.rankReference === 'BOTTOM' ? order.length - topRank + 1 : topRank;
        const side = inverse.rankReference === 'BOTTOM'
          ? native(locale, 'नीचे से', 'ਹੇਠੋਂ')
          : native(locale, 'ऊपर से', 'ਉੱਪਰੋਂ');
        steps.push(native(
          locale,
          `${target} ${side} ${ordinalOblique(rank, locale)} स्थान पर है; इसलिए उत्तर ${rank} है।`,
          `${target} ${side} ${ordinalOblique(rank, locale)} ਸਥਾਨ ਉੱਤੇ ਹੈ; ਇਸ ਲਈ ਜਵਾਬ ${rank} ਹੈ।`,
        ));
        break;
      }
      case 'MIDDLE_ENTITY': {
        const middle = (order.length + 1) / 2;
        steps.push(native(
          locale,
          `${order.length} व्यक्तियों में बीच का स्थान ${middle} है और वहाँ ${answer} है।`,
          `${order.length} ਵਿਅਕਤੀਆਂ ਵਿੱਚ ਵਿਚਕਾਰਲਾ ਸਥਾਨ ${middle} ਹੈ ਅਤੇ ਉੱਥੇ ${answer} ਹੈ।`,
        ));
        break;
      }
      case 'COMPLETE_ORDER':
        steps.push(native(
          locale,
          inverse.orderDirection === 'LOWEST_TO_HIGHEST'
            ? `प्रश्न नीचे से ऊपर क्रम माँगता है, इसलिए सही क्रम है: ${answer}`
            : `प्रश्न ऊपर से नीचे क्रम माँगता है, इसलिए सही क्रम है: ${answer}`,
          inverse.orderDirection === 'LOWEST_TO_HIGHEST'
            ? `ਸਵਾਲ ਹੇਠਾਂ ਤੋਂ ਉੱਪਰ ਕ੍ਰਮ ਮੰਗਦਾ ਹੈ, ਇਸ ਲਈ ਸਹੀ ਕ੍ਰਮ ਹੈ: ${answer}`
            : `ਸਵਾਲ ਉੱਪਰ ਤੋਂ ਹੇਠਾਂ ਕ੍ਰਮ ਮੰਗਦਾ ਹੈ, ਇਸ ਲਈ ਸਹੀ ਕ੍ਰਮ ਹੈ: ${answer}`,
        ));
        break;
      case 'RELATIVE_ORDER_OF_PAIR':
        steps.push(native(locale, `दोनों नामों की स्थिति से सही संबंध है: ${answer}।`, `ਦੋਵੇਂ ਨਾਮਾਂ ਦੀ ਸਥਿਤੀ ਤੋਂ ਸਹੀ ਸੰਬੰਧ ਹੈ: ${answer}।`));
        break;
      case 'IMMEDIATE_NEIGHBOUR': {
        const target = localName(v1, query.target);
        const direction = query.direction === 'ABOVE'
          ? native(locale, 'ठीक ऊपर', 'ਤੁਰੰਤ ਉੱਪਰ')
          : native(locale, 'ठीक नीचे', 'ਤੁਰੰਤ ਹੇਠਾਂ');
        steps.push(native(locale, `${target} से ${direction} ${answer} है।`, `${target} ਤੋਂ ${direction} ${answer} ਹੈ।`));
        break;
      }
      case 'VALID_RANK_STATEMENT':
        steps.push(native(locale, `क्रम से निश्चित रूप से सिद्ध संबंध है: ${answer}।`, `ਕ੍ਰਮ ਤੋਂ ਯਕੀਨੀ ਤੌਰ ਉੱਤੇ ਸਾਬਤ ਸੰਬੰਧ ਹੈ: ${answer}।`));
        break;
      case 'MISSING_COMPARISON':
        steps.push(native(
          locale,
          `“${answer}” जोड़ने पर दोनों क्रम-खंड जुड़कर केवल एक निश्चित पूरा क्रम बनाते हैं।`,
          `“${answer}” ਜੋੜਨ ਉੱਤੇ ਦੋਵੇਂ ਕ੍ਰਮ-ਖੰਡ ਜੁੜ ਕੇ ਕੇਵਲ ਇੱਕ ਨਿਸ਼ਚਿਤ ਪੂਰਾ ਕ੍ਰਮ ਬਣਾਉਂਦੇ ਹਨ।`,
        ));
        break;
    }
  }

  return {
    mentalPicture: native(
      locale,
      'तुलनाओं को जोड़कर एक स्पष्ट ऊपर-से-नीचे क्रम बनाइए।',
      'ਤੁਲਨਾਵਾਂ ਜੋੜ ਕੇ ਇੱਕ ਸਪਸ਼ਟ ਉੱਪਰ-ਤੋਂ-ਹੇਠਾਂ ਕ੍ਰਮ ਬਣਾਓ।',
    ),
    keyRule: native(
      locale,
      'पहले निश्चित क्रम बनाइए; फिर प्रश्न जिस दिशा, स्थान, दूरी या संबंध को पूछता है, उसी को पढ़िए।',
      'ਪਹਿਲਾਂ ਨਿਸ਼ਚਿਤ ਕ੍ਰਮ ਬਣਾਓ; ਫਿਰ ਸਵਾਲ ਜਿਹੜੀ ਦਿਸ਼ਾ, ਸਥਾਨ, ਫਰਕ ਜਾਂ ਸੰਬੰਧ ਪੁੱਛਦਾ ਹੈ, ਕੇਵਲ ਉਹੀ ਪੜ੍ਹੋ।',
    ),
    stepByStepSolution: steps,
    examSpeedShortcut: native(
      locale,
      'यदि पूरा क्रम जरूरी न हो, तो केवल पूछे गए नाम या स्थान तक पहुँचने वाली तुलना-कड़ियाँ जोड़ें।',
      'ਜੇ ਪੂਰਾ ਕ੍ਰਮ ਲੋੜੀਂਦਾ ਨਾ ਹੋਵੇ, ਤਾਂ ਕੇਵਲ ਪੁੱਛੇ ਨਾਮ ਜਾਂ ਸਥਾਨ ਤੱਕ ਪਹੁੰਚਣ ਵਾਲੀਆਂ ਤੁਲਨਾ-ਕੜੀਆਂ ਜੋੜੋ।',
    ),
    optionAnalysis: options.map((option, index) => native(
      locale,
      `विकल्प ${index + 1}: ${option.explanation}।`,
      `ਚੋਣ ${index + 1}: ${option.explanation}।`,
    )),
    conclusion: native(locale, `सही उत्तर: ${answer}।`, `ਸਹੀ ਜਵਾਬ: ${answer}।`),
  };
}

function v2Fingerprint(question: AnyQuestion): string {
  return sha256({
    version: RNK_CP004_LOCALIZATION_REVIEW_V2_VERSION,
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

export function localizeRnkCp004PermanentQuestionV2(
  canonicalQuestion: RnkCp004PermanentQuestion | AnyQuestion,
  locale: RnkCp004LocalizedLocale,
): RnkCp004LocalizedReviewQuestionV2 {
  const canonical = canonicalQuestion as AnyQuestion;
  const v1 = localizeRnkCp004PermanentQuestion(canonicalQuestion, locale);
  const order = solvedOrder(canonical);
  const labels = v1.options.map((option) => removeNameComma(option.label, v1));
  const answer = labels[canonical.correctIndex]!;
  const options = v1.options.map((option, index) => ({
    ...option,
    label: labels[index]!,
    explanation: optionExplanation(
      canonical,
      v1,
      canonical.options[index]!,
      index,
      labels[index]!,
      answer,
      order,
      locale,
    ),
  }));
  const explanation = polishedExplanation(canonical, v1, options, answer, order, locale);
  const stem = polishedStem(canonical, v1, locale);

  const localized = {
    ...v1,
    stem,
    answer,
    options,
    explanation,
    visibleExplanation: {
      ...v1.visibleExplanation,
      lines: explanation.stepByStepSolution,
      answer,
      optionAnalysis: explanation.optionAnalysis,
    },
    localizationMetadata: {
      ...v1.localizationMetadata,
      version: RNK_CP004_LOCALIZATION_REVIEW_V2_VERSION,
      editorialOverlay: 'NATIVE_GRAMMAR_AND_PEDAGOGY_V2',
      v1SemanticBaselinePreserved: true,
    },
    localizationProof: {
      ...v1.localizationProof,
      authority: RNK_CP004_LOCALIZATION_REVIEW_V2_AUTHORITY,
      v1LocalizationFingerprint: v1.localizationProof.localizationFingerprint,
      v1CanonicalSemanticFingerprint: v1.localizationProof.canonicalSemanticFingerprint,
      editorialInvariance: 'EXECUTABLE_PROVED',
      localizationFingerprint: '',
    },
  } as unknown as RnkCp004LocalizedReviewQuestionV2;

  return {
    ...localized,
    localizationProof: {
      ...localized.localizationProof,
      localizationFingerprint: v2Fingerprint(localized),
    },
  };
}

export function buildRnkCp004LocalizedReviewBankV2(
  locale: RnkCp004LocalizedLocale,
): readonly RnkCp004LocalizedReviewQuestionV2[] {
  return buildRnkCp004PermanentRuntime().map((question) =>
    localizeRnkCp004PermanentQuestionV2(question, locale));
}
