import { createHash } from 'node:crypto';

import {
  RNK_PERSON_POOL_V2,
  type RnkObjectLocale,
} from '../foundation/rnk-object-pool-v2';
import {
  reconstructUniqueOrder,
  type RnkCp004Comparison,
} from './cp004-foundation';
import {
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
} from './cp004-authority-consolidation-v1';
import {
  RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS,
  buildRnkCp004PermanentRuntime,
  type RnkCp004PermanentQlId,
  type RnkCp004PermanentQuestion,
} from './cp004-permanent-runtime-v1';

export const RNK_CP004_LOCALIZATION_REVIEW_VERSION =
  'RNK_CP004_HI_PA_LOCALIZATION_REVIEW_V1' as const;
export const RNK_CP004_LOCALIZATION_REVIEW_AUTHORITY =
  'RNK_CP004_HI_PA_STRUCTURED_ORDER_REVIEW_V1' as const;

export type RnkCp004LocalizedLocale = 'hi-IN' | 'pa-IN';

type AnyQuestion = Record<string, any>;
type AnyOption = Record<string, any> & {
  readonly answerKey: string;
  readonly label: string;
  readonly misconceptionId: string;
  readonly explanation: string;
};

type ContextFamily =
  | 'SELECTION_TEST'
  | 'MERIT_LIST'
  | 'COMPETITION_STANDINGS'
  | 'PERFORMANCE_REVIEW'
  | 'INTERVIEW_SHORTLIST'
  | 'NEUTRAL_RANKING';

export type RnkCp004LocalizedReviewQuestion = AnyQuestion & {
  readonly locale: RnkCp004LocalizedLocale;
  readonly canonicalLocale: 'en-IN';
  readonly canonicalNames: readonly string[];
  readonly localizedNames: readonly string[];
  readonly stem: string;
  readonly answer: string;
  readonly options: readonly AnyOption[];
  readonly explanation: Readonly<{
    mentalPicture: string;
    keyRule: string;
    stepByStepSolution: readonly string[];
    examSpeedShortcut: string;
    optionAnalysis: readonly string[];
    conclusion: string;
  }>;
  readonly localizationMetadata: Readonly<{
    version: typeof RNK_CP004_LOCALIZATION_REVIEW_VERSION;
    locale: RnkCp004LocalizedLocale;
    learnerTextLocalized: true;
    structuredEvidenceRendered: true;
    canonicalOutcomePreserved: true;
    sourceInversePreserved: true;
    humanLanguageReviewRequired: true;
  }>;
  readonly lifecycle: Readonly<{
    permanentQlAllocated: true;
    englishFrozen: true;
    hindiPunjabi: 'REVIEW_CANDIDATE';
    humanLanguageReviewRequired: true;
    questionStudioDiscoverable: false;
    questionBankStatus: 'NOT_STORED';
    testEligibility: 'INELIGIBLE';
    publiclyPublishable: false;
    productDeliveryUnlocked: false;
  }>;
  readonly localizationProof: Readonly<{
    authority: typeof RNK_CP004_LOCALIZATION_REVIEW_AUTHORITY;
    canonicalLocale: 'en-IN';
    locale: RnkCp004LocalizedLocale;
    permanentQlId: RnkCp004PermanentQlId;
    canonicalSemanticFingerprint: string;
    localizationFingerprint: string;
    semanticParity: 'EXECUTABLE_PROVED';
    learnerSurfaceSource: 'STRUCTURED_DISPLAYED_EVIDENCE';
    canonicalOutcomeSource: 'FROZEN_PERMANENT_RUNTIME';
    sourceInverseSource: 'FROZEN_SOURCE_INVERSE_PROFILE';
    humanLanguageReviewRequired: true;
    multilingualFreezeGranted: false;
    productDeliveryUnlocked: false;
  }>;
};

function native(locale: RnkCp004LocalizedLocale, hi: string, pa: string): string {
  return locale === 'hi-IN' ? hi : pa;
}

function sha256(value: unknown): string {
  return createHash('sha256')
    .update(typeof value === 'string' ? value : JSON.stringify(value), 'utf8')
    .digest('hex');
}

function objectLocale(locale: RnkCp004LocalizedLocale): Exclude<RnkObjectLocale, 'en'> {
  return locale === 'hi-IN' ? 'hi' : 'pa';
}

function localizedName(canonicalName: string, locale: RnkCp004LocalizedLocale): string {
  const person = RNK_PERSON_POOL_V2.find((entry) => entry.names.en === canonicalName);
  if (!person) throw new Error(`CP004 name missing from RNK Object Pool V2: ${canonicalName}`);
  return person.names[objectLocale(locale)];
}

function localizedNames(
  names: readonly string[],
  locale: RnkCp004LocalizedLocale,
): readonly string[] {
  return names.map((name) => localizedName(name, locale));
}

function relationKey(comparison: RnkCp004Comparison): string {
  return `${comparison.higher}>${comparison.lower}`;
}

function localizeRelation(
  higher: string,
  lower: string,
  locale: RnkCp004LocalizedLocale,
  immediate = false,
): string {
  const high = localizedName(higher, locale);
  const low = localizedName(lower, locale);
  if (immediate) {
    return native(
      locale,
      `${high}, ${low} से ठीक ऊपर है`,
      `${high}, ${low} ਤੋਂ ਤੁਰੰਤ ਉੱਪਰ ਹੈ`,
    );
  }
  return native(
    locale,
    `${high}, ${low} से ऊपर है`,
    `${high}, ${low} ਤੋਂ ਉੱਪਰ ਹੈ`,
  );
}

function localizeRelationKey(key: string, locale: RnkCp004LocalizedLocale): string {
  const [higher, lower] = key.split('>');
  if (!higher || !lower) throw new Error(`Invalid CP004 relation key: ${key}`);
  return localizeRelation(higher, lower, locale);
}

function ordinal(value: number, locale: RnkCp004LocalizedLocale): string {
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

function contextFamily(question: AnyQuestion): ContextFamily {
  const family = question.reviewMetadata.languageProfile.contextFamily as ContextFamily;
  if (![
    'SELECTION_TEST',
    'MERIT_LIST',
    'COMPETITION_STANDINGS',
    'PERFORMANCE_REVIEW',
    'INTERVIEW_SHORTLIST',
    'NEUTRAL_RANKING',
  ].includes(family)) {
    throw new Error(`Unknown CP004 context family ${String(family)}`);
  }
  return family;
}

function contextIntro(
  family: ContextFamily,
  count: number,
  locale: RnkCp004LocalizedLocale,
): string {
  const hi: Record<ContextFamily, string> = {
    SELECTION_TEST: `चयन परीक्षा में ${count} अभ्यर्थियों की अलग-अलग रैंक हैं। नीचे दी गई तुलनाओं से उनका क्रम तय करें।`,
    MERIT_LIST: `योग्यता सूची में ${count} अभ्यर्थियों का अलग-अलग स्थान है। नीचे दी गई तुलनाओं से पूरा क्रम तय करें।`,
    COMPETITION_STANDINGS: `प्रतियोगिता में ${count} प्रतिभागियों के स्थान अलग-अलग हैं। नीचे दी गई तुलनाओं से उनका क्रम तय करें।`,
    PERFORMANCE_REVIEW: `प्रदर्शन समीक्षा में ${count} व्यक्तियों की अलग-अलग रैंक हैं। नीचे दी गई तुलनाओं से उनका क्रम तय करें।`,
    INTERVIEW_SHORTLIST: `अंतिम साक्षात्कार सूची में ${count} अभ्यर्थियों की अलग-अलग रैंक हैं। नीचे दी गई तुलनाओं से उनका क्रम तय करें।`,
    NEUTRAL_RANKING: `${count} व्यक्तियों की रैंक अलग-अलग है। नीचे दी गई तुलनाओं से पूरा क्रम तय करें।`,
  };
  const pa: Record<ContextFamily, string> = {
    SELECTION_TEST: `ਚੋਣ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ${count} ਉਮੀਦਵਾਰਾਂ ਦੀਆਂ ਵੱਖ-ਵੱਖ ਰੈਂਕਾਂ ਹਨ। ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਤੁਲਨਾਵਾਂ ਤੋਂ ਉਨ੍ਹਾਂ ਦਾ ਕ੍ਰਮ ਬਣਾਓ।`,
    MERIT_LIST: `ਯੋਗਤਾ ਸੂਚੀ ਵਿੱਚ ${count} ਉਮੀਦਵਾਰਾਂ ਦੇ ਵੱਖ-ਵੱਖ ਸਥਾਨ ਹਨ। ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਤੁਲਨਾਵਾਂ ਤੋਂ ਪੂਰਾ ਕ੍ਰਮ ਬਣਾਓ।`,
    COMPETITION_STANDINGS: `ਮੁਕਾਬਲੇ ਵਿੱਚ ${count} ਭਾਗੀਦਾਰਾਂ ਦੇ ਸਥਾਨ ਵੱਖ-ਵੱਖ ਹਨ। ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਤੁਲਨਾਵਾਂ ਤੋਂ ਉਨ੍ਹਾਂ ਦਾ ਕ੍ਰਮ ਬਣਾਓ।`,
    PERFORMANCE_REVIEW: `ਪ੍ਰਦਰਸ਼ਨ ਸਮੀਖਿਆ ਵਿੱਚ ${count} ਵਿਅਕਤੀਆਂ ਦੀਆਂ ਵੱਖ-ਵੱਖ ਰੈਂਕਾਂ ਹਨ। ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਤੁਲਨਾਵਾਂ ਤੋਂ ਉਨ੍ਹਾਂ ਦਾ ਕ੍ਰਮ ਬਣਾਓ।`,
    INTERVIEW_SHORTLIST: `ਅੰਤਿਮ ਇੰਟਰਵਿਊ ਸੂਚੀ ਵਿੱਚ ${count} ਉਮੀਦਵਾਰਾਂ ਦੀਆਂ ਵੱਖ-ਵੱਖ ਰੈਂਕਾਂ ਹਨ। ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਤੁਲਨਾਵਾਂ ਤੋਂ ਉਨ੍ਹਾਂ ਦਾ ਕ੍ਰਮ ਬਣਾਓ।`,
    NEUTRAL_RANKING: `${count} ਵਿਅਕਤੀਆਂ ਦੀਆਂ ਰੈਂਕਾਂ ਵੱਖ-ਵੱਖ ਹਨ। ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਤੁਲਨਾਵਾਂ ਤੋਂ ਪੂਰਾ ਕ੍ਰਮ ਬਣਾਓ।`,
  };
  return locale === 'hi-IN' ? hi[family] : pa[family];
}

function contextClue(
  family: ContextFamily,
  clue: RnkCp004Comparison,
  locale: RnkCp004LocalizedLocale,
): string {
  const higher = localizedName(clue.higher, locale);
  const lower = localizedName(clue.lower, locale);
  if (locale === 'hi-IN') {
    switch (family) {
      case 'SELECTION_TEST': return `${higher} की चयन रैंक ${lower} से बेहतर है।`;
      case 'MERIT_LIST': return `${higher} योग्यता सूची में ${lower} से ऊपर है।`;
      case 'COMPETITION_STANDINGS': return `${higher} ने प्रतियोगिता में ${lower} से ऊँचा स्थान प्राप्त किया।`;
      case 'PERFORMANCE_REVIEW': return `${higher} की प्रदर्शन रैंक ${lower} से बेहतर है।`;
      case 'INTERVIEW_SHORTLIST': return `${higher} अंतिम साक्षात्कार सूची में ${lower} से ऊपर है।`;
      case 'NEUTRAL_RANKING': return `${higher} की रैंक ${lower} से ऊपर है।`;
    }
  }
  switch (family) {
    case 'SELECTION_TEST': return `${higher} ਦੀ ਚੋਣ ਰੈਂਕ ${lower} ਨਾਲੋਂ ਬਿਹਤਰ ਹੈ।`;
    case 'MERIT_LIST': return `${higher} ਯੋਗਤਾ ਸੂਚੀ ਵਿੱਚ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`;
    case 'COMPETITION_STANDINGS': return `${higher} ਨੇ ਮੁਕਾਬਲੇ ਵਿੱਚ ${lower} ਨਾਲੋਂ ਉੱਚਾ ਸਥਾਨ ਹਾਸਲ ਕੀਤਾ।`;
    case 'PERFORMANCE_REVIEW': return `${higher} ਦੀ ਪ੍ਰਦਰਸ਼ਨ ਰੈਂਕ ${lower} ਨਾਲੋਂ ਬਿਹਤਰ ਹੈ।`;
    case 'INTERVIEW_SHORTLIST': return `${higher} ਅੰਤਿਮ ਇੰਟਰਵਿਊ ਸੂਚੀ ਵਿੱਚ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`;
    case 'NEUTRAL_RANKING': return `${higher} ਦੀ ਰੈਂਕ ${lower} ਤੋਂ ਉੱਪਰ ਹੈ।`;
  }
}

function solvedOrder(question: AnyQuestion): readonly string[] {
  const evidence = question.displayedEvidence;
  if (evidence.query.kind !== 'MISSING_COMPARISON') {
    return reconstructUniqueOrder(evidence.entities, evidence.clues);
  }
  const bridge = evidence.query.candidates.find(
    (candidate: RnkCp004Comparison) => relationKey(candidate) === question.answerKey,
  );
  if (!bridge) throw new Error(`Missing CP004 bridge for ${question.answerKey}`);
  return reconstructUniqueOrder(evidence.entities, [...evidence.clues, bridge]);
}

function requestedPosition(question: AnyQuestion): number {
  const query = question.displayedEvidence.query;
  if (query.kind !== 'ENTITY_AT_EXACT_RANK') throw new Error('Expected entity-at-rank query');
  if (question.reviewMetadata.sourceInverseProfile.rankReference === 'BOTTOM') {
    return question.displayedEvidence.entities.length - query.rankFromTop + 1;
  }
  return query.rankFromTop;
}

function queryText(
  question: AnyQuestion,
  locale: RnkCp004LocalizedLocale,
): string {
  const query = question.displayedEvidence.query;
  const inverse = question.reviewMetadata.sourceInverseProfile;
  if (question.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    if (query.kind !== 'RELATIVE_ORDER_OF_PAIR') throw new Error('Exact-rank-difference authority requires pair query');
    const first = localizedName(query.first, locale);
    const second = localizedName(query.second, locale);
    return native(
      locale,
      `${first} और ${second} की रैंकों का सही अंतर और यह कि किसकी रैंक ऊपर है—कौन-सा विकल्प सही बताता है?`,
      `${first} ਅਤੇ ${second} ਦੀਆਂ ਰੈਂਕਾਂ ਦਾ ਸਹੀ ਫਰਕ ਅਤੇ ਕੌਣ ਉੱਪਰ ਰੈਂਕ ਕਰਦਾ ਹੈ—ਕਿਹੜੀ ਚੋਣ ਸਹੀ ਦੱਸਦੀ ਹੈ?`,
    );
  }
  switch (query.kind) {
    case 'HIGHEST_ENTITY':
      return native(locale, 'सबसे ऊँची रैंक किसकी है?', 'ਸਭ ਤੋਂ ਉੱਚੀ ਰੈਂਕ ਕਿਸਦੀ ਹੈ?');
    case 'LOWEST_ENTITY':
      return native(locale, 'सबसे नीची रैंक किसकी है?', 'ਸਭ ਤੋਂ ਹੇਠਲੀ ਰੈਂਕ ਕਿਸਦੀ ਹੈ?');
    case 'ENTITY_AT_EXACT_RANK': {
      const position = requestedPosition(question);
      const side = inverse.rankReference === 'BOTTOM'
        ? native(locale, 'नीचे से', 'ਹੇਠੋਂ')
        : native(locale, 'ऊपर से', 'ਉੱਪਰੋਂ');
      return native(
        locale,
        `${side} ${ordinal(position, locale)} स्थान किसका है?`,
        `${side} ${ordinal(position, locale)} ਸਥਾਨ ਕਿਸਦਾ ਹੈ?`,
      );
    }
    case 'RANK_OF_NAMED_ENTITY': {
      const target = localizedName(query.target, locale);
      const side = inverse.rankReference === 'BOTTOM'
        ? native(locale, 'नीचे से', 'ਹੇਠੋਂ')
        : native(locale, 'ऊपर से', 'ਉੱਪਰੋਂ');
      return native(
        locale,
        `${target} की रैंक ${side} क्या है?`,
        `${target} ਦੀ ਰੈਂਕ ${side} ਕੀ ਹੈ?`,
      );
    }
    case 'MIDDLE_ENTITY':
      return native(locale, 'बीच वाले स्थान पर कौन है?', 'ਵਿਚਕਾਰਲੇ ਸਥਾਨ ਉੱਤੇ ਕੌਣ ਹੈ?');
    case 'COMPLETE_ORDER':
      return inverse.orderDirection === 'LOWEST_TO_HIGHEST'
        ? native(locale, 'सबसे नीचे से सबसे ऊपर तक सही पूरा क्रम कौन-सा है?', 'ਸਭ ਤੋਂ ਹੇਠਾਂ ਤੋਂ ਸਭ ਤੋਂ ਉੱਪਰ ਤੱਕ ਸਹੀ ਪੂਰਾ ਕ੍ਰਮ ਕਿਹੜਾ ਹੈ?')
        : native(locale, 'सबसे ऊपर से सबसे नीचे तक सही पूरा क्रम कौन-सा है?', 'ਸਭ ਤੋਂ ਉੱਪਰ ਤੋਂ ਸਭ ਤੋਂ ਹੇਠਾਂ ਤੱਕ ਸਹੀ ਪੂਰਾ ਕ੍ਰਮ ਕਿਹੜਾ ਹੈ?');
    case 'RELATIVE_ORDER_OF_PAIR': {
      const first = localizedName(query.first, locale);
      const second = localizedName(query.second, locale);
      return native(
        locale,
        `${first} और ${second} के आपसी क्रम के बारे में कौन-सा विकल्प सही है?`,
        `${first} ਅਤੇ ${second} ਦੇ ਆਪਸੀ ਕ੍ਰਮ ਬਾਰੇ ਕਿਹੜੀ ਚੋਣ ਸਹੀ ਹੈ?`,
      );
    }
    case 'IMMEDIATE_NEIGHBOUR': {
      const target = localizedName(query.target, locale);
      const direction = query.direction === 'ABOVE'
        ? native(locale, 'ठीक ऊपर', 'ਤੁਰੰਤ ਉੱਪਰ')
        : native(locale, 'ठीक नीचे', 'ਤੁਰੰਤ ਹੇਠਾਂ');
      return native(
        locale,
        `${target} से ${direction} कौन है?`,
        `${target} ਤੋਂ ${direction} ਕੌਣ ਹੈ?`,
      );
    }
    case 'VALID_RANK_STATEMENT':
      return native(
        locale,
        'दी गई तुलनाओं से कौन-सा निष्कर्ष निश्चित रूप से सही है?',
        'ਦਿੱਤੀਆਂ ਤੁਲਨਾਵਾਂ ਤੋਂ ਕਿਹੜਾ ਨਤੀਜਾ ਯਕੀਨੀ ਤੌਰ ਉੱਤੇ ਸਹੀ ਹੈ?',
      );
    case 'MISSING_COMPARISON':
      return native(
        locale,
        'कौन-सी अतिरिक्त तुलना जोड़ने पर पूरा क्रम केवल एक ही होगा?',
        'ਕਿਹੜੀ ਵਾਧੂ ਤੁਲਨਾ ਜੋੜਨ ਨਾਲ ਪੂਰਾ ਕ੍ਰਮ ਕੇਵਲ ਇੱਕ ਹੀ ਰਹੇਗਾ?',
      );
  }
}

function localizedStem(
  question: AnyQuestion,
  locale: RnkCp004LocalizedLocale,
): string {
  const family = contextFamily(question);
  const evidence = question.displayedEvidence;
  const clues = evidence.clues
    .map((clue: RnkCp004Comparison) => `- ${contextClue(family, clue, locale)}`)
    .join('\n');
  return `${contextIntro(family, evidence.entities.length, locale)}\n\n${clues}\n\n${queryText(question, locale)}`;
}

function parseDistanceFromSyntheticKey(key: string): number | null {
  const match = key.match(/\|(\d+)$/u);
  return match ? Number(match[1]) : null;
}

function pairHigherLower(question: AnyQuestion, order: readonly string[]): readonly [string, string] {
  const query = question.displayedEvidence.query;
  if (query.kind !== 'RELATIVE_ORDER_OF_PAIR') throw new Error('Expected pair query');
  const first = order.indexOf(query.first);
  const second = order.indexOf(query.second);
  return first < second ? [query.first, query.second] : [query.second, query.first];
}

function localizeOptionLabel(
  question: AnyQuestion,
  option: AnyOption,
  locale: RnkCp004LocalizedLocale,
  order: readonly string[],
): string {
  const query = question.displayedEvidence.query;
  if (question.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    const [higher, lower] = pairHigherLower(question, order);
    const firstRank = order.indexOf(query.first) + 1;
    const secondRank = order.indexOf(query.second) + 1;
    const correctDistance = Math.abs(firstRank - secondRank);
    const optionDistance = parseDistanceFromSyntheticKey(option.answerKey) ?? correctDistance;
    const displayedHigher = option.misconceptionId === 'RELATION_REVERSED' ? lower : higher;
    const high = localizedName(displayedHigher, locale);
    return native(
      locale,
      `रैंक का अंतर ${optionDistance} है और ${high} की रैंक ऊपर है`,
      `ਰੈਂਕ ਦਾ ਫਰਕ ${optionDistance} ਹੈ ਅਤੇ ${high} ਦੀ ਰੈਂਕ ਉੱਪਰ ਹੈ`,
    );
  }

  if (query.kind === 'COMPLETE_ORDER') {
    return option.answerKey
      .split('|')
      .map((name) => localizedName(name, locale))
      .join(' > ');
  }

  if (query.kind === 'RELATIVE_ORDER_OF_PAIR') {
    const [higher, lower] = pairHigherLower(question, order);
    if (option.misconceptionId === 'CORRECT') {
      return localizeRelation(higher, lower, locale);
    }
    if (option.misconceptionId === 'RELATION_REVERSED') {
      return localizeRelation(lower, higher, locale);
    }
    if (option.misconceptionId === 'ASSUMED_ADJACENCY') {
      return localizeRelation(higher, lower, locale, true);
    }
    if (option.misconceptionId === 'REVERSED_AND_ASSUMED_ADJACENCY') {
      return localizeRelation(lower, higher, locale, true);
    }
  }

  if (query.kind === 'VALID_RANK_STATEMENT' || query.kind === 'MISSING_COMPARISON') {
    return localizeRelationKey(option.answerKey, locale);
  }

  if (question.answerSemantic === 'ENTITY') {
    return localizedName(option.answerKey, locale);
  }
  if (question.answerSemantic === 'RANK') {
    return String(option.answerKey);
  }
  if (option.answerKey.includes('>')) {
    return localizeRelationKey(option.answerKey, locale);
  }
  return String(option.label);
}

function localizedOptionExplanation(
  question: AnyQuestion,
  option: AnyOption,
  locale: RnkCp004LocalizedLocale,
  correctAnswer: string,
): string {
  if (option.misconceptionId === 'CORRECT') {
    return native(
      locale,
      'यह विकल्प दी गई सभी तुलनाओं और माँगे गए क्रम से मेल खाता है',
      'ਇਹ ਚੋਣ ਦਿੱਤੀਆਂ ਸਾਰੀਆਂ ਤੁਲਨਾਵਾਂ ਅਤੇ ਮੰਗੇ ਕ੍ਰਮ ਨਾਲ ਮਿਲਦੀ ਹੈ',
    );
  }
  const query = question.displayedEvidence.query;
  if (question.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    return native(
      locale,
      `पूरा क्रम बनाने पर सही संबंध “${correctAnswer}” मिलता है; यह विकल्प उसी अंतर या दिशा को गलत पढ़ता है`,
      `ਪੂਰਾ ਕ੍ਰਮ ਬਣਾਉਣ ਉੱਤੇ ਸਹੀ ਸੰਬੰਧ “${correctAnswer}” ਮਿਲਦਾ ਹੈ; ਇਹ ਚੋਣ ਫਰਕ ਜਾਂ ਦਿਸ਼ਾ ਨੂੰ ਗਲਤ ਪੜ੍ਹਦੀ ਹੈ`,
    );
  }
  if (query.kind === 'COMPLETE_ORDER') {
    return native(
      locale,
      'इस क्रम में कम-से-कम एक जोड़ी दी गई तुलना के उलट हो जाती है',
      'ਇਸ ਕ੍ਰਮ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਜੋੜਾ ਦਿੱਤੀ ਤੁਲਨਾ ਦੇ ਉਲਟ ਹੋ ਜਾਂਦਾ ਹੈ',
    );
  }
  if (query.kind === 'MISSING_COMPARISON') {
    return native(
      locale,
      'यह तुलना दोनों क्रम-खंडों को एक ही निश्चित पूरे क्रम में नहीं जोड़ती',
      'ਇਹ ਤੁਲਨਾ ਦੋਵੇਂ ਕ੍ਰਮ-ਖੰਡਾਂ ਨੂੰ ਇੱਕੋ ਨਿਸ਼ਚਿਤ ਪੂਰੇ ਕ੍ਰਮ ਵਿੱਚ ਨਹੀਂ ਜੋੜਦੀ',
    );
  }
  if (query.kind === 'RELATIVE_ORDER_OF_PAIR' || query.kind === 'VALID_RANK_STATEMENT') {
    return native(
      locale,
      `दी गई तुलनाओं से सही संबंध “${correctAnswer}” बनता है; यह विकल्प उस संबंध को गलत पढ़ता है`,
      `ਦਿੱਤੀਆਂ ਤੁਲਨਾਵਾਂ ਤੋਂ ਸਹੀ ਸੰਬੰਧ “${correctAnswer}” ਬਣਦਾ ਹੈ; ਇਹ ਚੋਣ ਉਸ ਸੰਬੰਧ ਨੂੰ ਗਲਤ ਪੜ੍ਹਦੀ ਹੈ`,
    );
  }
  if (question.answerSemantic === 'RANK') {
    return native(
      locale,
      `पूरा क्रम बनाने पर सही रैंक ${correctAnswer} है; यह संख्या उस स्थान से मेल नहीं खाती`,
      `ਪੂਰਾ ਕ੍ਰਮ ਬਣਾਉਣ ਉੱਤੇ ਸਹੀ ਰੈਂਕ ${correctAnswer} ਹੈ; ਇਹ ਗਿਣਤੀ ਉਸ ਸਥਾਨ ਨਾਲ ਨਹੀਂ ਮਿਲਦੀ`,
    );
  }
  return native(
    locale,
    `पूरा क्रम बनाने पर सही उत्तर ${correctAnswer} है; यह विकल्प उस स्थान पर नहीं आता`,
    `ਪੂਰਾ ਕ੍ਰਮ ਬਣਾਉਣ ਉੱਤੇ ਸਹੀ ਜਵਾਬ ${correctAnswer} ਹੈ; ਇਹ ਚੋਣ ਉਸ ਸਥਾਨ ਉੱਤੇ ਨਹੀਂ ਆਉਂਦੀ`,
  );
}

function localizedOrder(
  order: readonly string[],
  locale: RnkCp004LocalizedLocale,
): string {
  return order.map((name) => localizedName(name, locale)).join(' > ');
}

function explanationFor(
  question: AnyQuestion,
  locale: RnkCp004LocalizedLocale,
  order: readonly string[],
  answer: string,
  options: readonly AnyOption[],
): RnkCp004LocalizedReviewQuestion['explanation'] {
  const query = question.displayedEvidence.query;
  const inverse = question.reviewMetadata.sourceInverseProfile;
  const chain = localizedOrder(order, locale);
  const steps: string[] = [
    native(
      locale,
      `सभी तुलनाओं को जोड़ने पर ऊपर से नीचे क्रम बनता है: ${chain}`,
      `ਸਾਰੀਆਂ ਤੁਲਨਾਵਾਂ ਜੋੜਨ ਉੱਤੇ ਉੱਪਰ ਤੋਂ ਹੇਠਾਂ ਕ੍ਰਮ ਬਣਦਾ ਹੈ: ${chain}`,
    ),
  ];

  if (question.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    const firstRank = order.indexOf(query.first) + 1;
    const secondRank = order.indexOf(query.second) + 1;
    const first = localizedName(query.first, locale);
    const second = localizedName(query.second, locale);
    steps.push(native(
      locale,
      `${first} की रैंक ${firstRank} और ${second} की रैंक ${secondRank} है; अंतर = ${Math.max(firstRank, secondRank)} − ${Math.min(firstRank, secondRank)} = ${Math.abs(firstRank - secondRank)}।`,
      `${first} ਦੀ ਰੈਂਕ ${firstRank} ਅਤੇ ${second} ਦੀ ਰੈਂਕ ${secondRank} ਹੈ; ਫਰਕ = ${Math.max(firstRank, secondRank)} − ${Math.min(firstRank, secondRank)} = ${Math.abs(firstRank - secondRank)}।`,
    ));
    steps.push(native(locale, `इसलिए ${answer}।`, `ਇਸ ਲਈ ${answer}।`));
  } else {
    switch (query.kind) {
      case 'HIGHEST_ENTITY':
        steps.push(native(locale, `क्रम का पहला नाम ${answer} है, इसलिए यही सबसे ऊँची रैंक है।`, `ਕ੍ਰਮ ਦਾ ਪਹਿਲਾ ਨਾਮ ${answer} ਹੈ, ਇਸ ਲਈ ਇਹੀ ਸਭ ਤੋਂ ਉੱਚੀ ਰੈਂਕ ਹੈ।`));
        break;
      case 'LOWEST_ENTITY':
        steps.push(native(locale, `क्रम का अंतिम नाम ${answer} है, इसलिए यही सबसे नीची रैंक है।`, `ਕ੍ਰਮ ਦਾ ਆਖਰੀ ਨਾਮ ${answer} ਹੈ, ਇਸ ਲਈ ਇਹੀ ਸਭ ਤੋਂ ਹੇਠਲੀ ਰੈਂਕ ਹੈ।`));
        break;
      case 'ENTITY_AT_EXACT_RANK': {
        const position = requestedPosition(question);
        const side = inverse.rankReference === 'BOTTOM' ? native(locale, 'नीचे से', 'ਹੇਠੋਂ') : native(locale, 'ऊपर से', 'ਉੱਪਰੋਂ');
        steps.push(native(locale, `${side} ${ordinal(position, locale)} स्थान पर ${answer} है।`, `${side} ${ordinal(position, locale)} ਸਥਾਨ ਉੱਤੇ ${answer} ਹੈ।`));
        break;
      }
      case 'RANK_OF_NAMED_ENTITY': {
        const topRank = order.indexOf(query.target) + 1;
        const rank = inverse.rankReference === 'BOTTOM' ? order.length - topRank + 1 : topRank;
        const target = localizedName(query.target, locale);
        const side = inverse.rankReference === 'BOTTOM' ? native(locale, 'नीचे से', 'ਹੇਠੋਂ') : native(locale, 'ऊपर से', 'ਉੱਪਰੋਂ');
        steps.push(native(locale, `${target} की रैंक ${side} ${rank} है।`, `${target} ਦੀ ਰੈਂਕ ${side} ${rank} ਹੈ।`));
        break;
      }
      case 'MIDDLE_ENTITY': {
        const middle = (order.length + 1) / 2;
        steps.push(native(locale, `${order.length} व्यक्तियों में बीच का स्थान ${middle} है; वहाँ ${answer} है।`, `${order.length} ਵਿਅਕਤੀਆਂ ਵਿੱਚ ਵਿਚਕਾਰਲਾ ਸਥਾਨ ${middle} ਹੈ; ਉੱਥੇ ${answer} ਹੈ।`));
        break;
      }
      case 'COMPLETE_ORDER':
        if (inverse.orderDirection === 'LOWEST_TO_HIGHEST') {
          const reversed = localizedOrder([...order].reverse(), locale);
          steps.push(native(locale, `प्रश्न नीचे से ऊपर क्रम माँगता है, इसलिए क्रम उलटने पर मिलता है: ${reversed}`, `ਸਵਾਲ ਹੇਠਾਂ ਤੋਂ ਉੱਪਰ ਕ੍ਰਮ ਮੰਗਦਾ ਹੈ, ਇਸ ਲਈ ਕ੍ਰਮ ਉਲਟਣ ਉੱਤੇ ਮਿਲਦਾ ਹੈ: ${reversed}`));
        } else {
          steps.push(native(locale, `प्रश्न ऊपर से नीचे पूरा क्रम माँगता है; यही क्रम सही विकल्प में होना चाहिए।`, `ਸਵਾਲ ਉੱਪਰ ਤੋਂ ਹੇਠਾਂ ਪੂਰਾ ਕ੍ਰਮ ਮੰਗਦਾ ਹੈ; ਇਹੀ ਕ੍ਰਮ ਸਹੀ ਚੋਣ ਵਿੱਚ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`));
        }
        break;
      case 'RELATIVE_ORDER_OF_PAIR':
        steps.push(native(locale, `पूरे क्रम में दोनों नामों की स्थिति देखकर सही संबंध मिलता है: ${answer}।`, `ਪੂਰੇ ਕ੍ਰਮ ਵਿੱਚ ਦੋਵੇਂ ਨਾਮਾਂ ਦੀ ਸਥਿਤੀ ਵੇਖ ਕੇ ਸਹੀ ਸੰਬੰਧ ਮਿਲਦਾ ਹੈ: ${answer}।`));
        break;
      case 'IMMEDIATE_NEIGHBOUR':
        steps.push(native(locale, `लक्ष्य के ठीक पास माँगी गई दिशा में ${answer} है।`, `ਨਿਸ਼ਾਨੇ ਦੇ ਤੁਰੰਤ ਕੋਲ ਮੰਗੀ ਦਿਸ਼ਾ ਵਿੱਚ ${answer} ਹੈ।`));
        break;
      case 'VALID_RANK_STATEMENT':
        steps.push(native(locale, `क्रम से निश्चित रूप से सिद्ध संबंध है: ${answer}।`, `ਕ੍ਰਮ ਤੋਂ ਯਕੀਨੀ ਤੌਰ ਉੱਤੇ ਸਾਬਤ ਸੰਬੰਧ ਹੈ: ${answer}।`));
        break;
      case 'MISSING_COMPARISON':
        steps.push(native(locale, `सही अतिरिक्त तुलना “${answer}” जोड़ने पर दोनों क्रम-खंड एक ही पूरे क्रम में जुड़ जाते हैं।`, `ਸਹੀ ਵਾਧੂ ਤੁਲਨਾ “${answer}” ਜੋੜਨ ਉੱਤੇ ਦੋਵੇਂ ਕ੍ਰਮ-ਖੰਡ ਇੱਕੋ ਪੂਰੇ ਕ੍ਰਮ ਵਿੱਚ ਜੁੜ ਜਾਂਦੇ ਹਨ।`));
        break;
    }
  }

  const optionAnalysis = options.map((option, index) => native(
    locale,
    `विकल्प ${index + 1}: ${option.explanation}।`,
    `ਚੋਣ ${index + 1}: ${option.explanation}।`,
  ));

  return {
    mentalPicture: native(
      locale,
      'तुलनाओं को एक दिशा में जोड़कर एक सीधा रैंक-क्रम बनाइए।',
      'ਤੁਲਨਾਵਾਂ ਨੂੰ ਇੱਕ ਦਿਸ਼ਾ ਵਿੱਚ ਜੋੜ ਕੇ ਇੱਕ ਸਿੱਧਾ ਰੈਂਕ-ਕ੍ਰਮ ਬਣਾਓ।',
    ),
    keyRule: native(
      locale,
      'पहले सभी दी गई तुलनाओं से निश्चित क्रम बनाइए; फिर केवल पूछी गई स्थिति, दूरी या संबंध पढ़िए।',
      'ਪਹਿਲਾਂ ਸਾਰੀਆਂ ਦਿੱਤੀਆਂ ਤੁਲਨਾਵਾਂ ਤੋਂ ਨਿਸ਼ਚਿਤ ਕ੍ਰਮ ਬਣਾਓ; ਫਿਰ ਕੇਵਲ ਪੁੱਛਿਆ ਸਥਾਨ, ਫਰਕ ਜਾਂ ਸੰਬੰਧ ਪੜ੍ਹੋ।',
    ),
    stepByStepSolution: steps,
    examSpeedShortcut: native(
      locale,
      'पूरे क्रम की जरूरत न हो तो केवल उन तुलना-कड़ियों को जोड़ें जो पूछे गए नाम या स्थान तक पहुँचती हैं।',
      'ਜੇ ਪੂਰੇ ਕ੍ਰਮ ਦੀ ਲੋੜ ਨਾ ਹੋਵੇ ਤਾਂ ਕੇਵਲ ਉਹ ਤੁਲਨਾ-ਕੜੀਆਂ ਜੋੜੋ ਜੋ ਪੁੱਛੇ ਨਾਮ ਜਾਂ ਸਥਾਨ ਤੱਕ ਪਹੁੰਚਦੀਆਂ ਹਨ।',
    ),
    optionAnalysis,
    conclusion: native(locale, `सही उत्तर: ${answer}।`, `ਸਹੀ ਜਵਾਬ: ${answer}।`),
  };
}

export function rnkCp004CanonicalSemanticFingerprint(question: AnyQuestion): string {
  return sha256({
    packageId: question.packageId,
    checkpointId: question.checkpointId,
    qlId: question.reviewMetadata.permanentProfile.permanentQlId,
    authorityId: question.reviewMetadata.permanentProfile.authorityId,
    ordinal: question.reviewMetadata.permanentProfile.permanentOrdinalWithinAuthority,
    prototypeId: question.prototypeId,
    seed: question.seed,
    sourceInverseVariant: question.reviewMetadata.sourceInverseProfile.variant,
    sourceInverseRankReference: question.reviewMetadata.sourceInverseProfile.rankReference,
    sourceInverseOrderDirection: question.reviewMetadata.sourceInverseProfile.orderDirection,
    context: question.reviewMetadata.languageProfile.contextFamily,
    displayedEvidence: question.displayedEvidence,
    answerSemantic: question.answerSemantic,
    answerKey: question.answerKey,
    options: question.options.map((option: AnyOption) => ({
      answerKey: option.answerKey,
      misconceptionId: option.misconceptionId,
    })),
    correctIndex: question.correctIndex,
    difficulty: question.difficulty,
    mathematicalFingerprint: question.mathematicalFingerprint,
    proofContract: question.reviewMetadata.authorityConsolidationProfile.proofContract,
  });
}

function localizationFingerprint(
  question: RnkCp004LocalizedReviewQuestion,
): string {
  return sha256({
    canonicalSemanticFingerprint: question.localizationProof.canonicalSemanticFingerprint,
    locale: question.locale,
    stem: question.stem,
    answer: question.answer,
    options: question.options.map((option) => ({
      label: option.label,
      explanation: option.explanation,
      misconceptionId: option.misconceptionId,
    })),
    explanation: question.explanation,
    visibleExplanation: question.visibleExplanation,
  });
}

export function localizeRnkCp004PermanentQuestion(
  canonicalQuestion: RnkCp004PermanentQuestion | AnyQuestion,
  locale: RnkCp004LocalizedLocale,
): RnkCp004LocalizedReviewQuestion {
  const question = canonicalQuestion as AnyQuestion;
  const canonicalNames = [...question.displayedEvidence.entities] as string[];
  const translatedNames = localizedNames(canonicalNames, locale);
  const order = solvedOrder(question);
  const labels = question.options.map((option: AnyOption) =>
    localizeOptionLabel(question, option, locale, order));
  const answer = labels[question.correctIndex]!;
  const options = question.options.map((option: AnyOption, index: number): AnyOption => ({
    ...option,
    label: labels[index]!,
    explanation: localizedOptionExplanation(question, option, locale, answer),
  }));
  const explanation = explanationFor(question, locale, order, answer, options);
  const canonicalSemanticFingerprint = rnkCp004CanonicalSemanticFingerprint(question);
  const permanentQlId = question.reviewMetadata.permanentProfile.permanentQlId as RnkCp004PermanentQlId;

  const localized = {
    ...question,
    locale,
    canonicalLocale: 'en-IN',
    canonicalNames,
    localizedNames: translatedNames,
    stem: localizedStem(question, locale),
    answer,
    options,
    explanation,
    visibleExplanation: {
      ...question.visibleExplanation,
      lines: explanation.stepByStepSolution,
      answer,
      optionAnalysis: explanation.optionAnalysis,
    },
    localizationMetadata: {
      version: RNK_CP004_LOCALIZATION_REVIEW_VERSION,
      locale,
      learnerTextLocalized: true,
      structuredEvidenceRendered: true,
      canonicalOutcomePreserved: true,
      sourceInversePreserved: true,
      humanLanguageReviewRequired: true,
    },
    lifecycle: {
      permanentQlAllocated: true,
      englishFrozen: true,
      hindiPunjabi: 'REVIEW_CANDIDATE',
      humanLanguageReviewRequired: true,
      questionStudioDiscoverable: false,
      questionBankStatus: 'NOT_STORED',
      testEligibility: 'INELIGIBLE',
      publiclyPublishable: false,
      productDeliveryUnlocked: false,
    },
    localizationProof: {
      authority: RNK_CP004_LOCALIZATION_REVIEW_AUTHORITY,
      canonicalLocale: 'en-IN',
      locale,
      permanentQlId,
      canonicalSemanticFingerprint,
      localizationFingerprint: '',
      semanticParity: 'EXECUTABLE_PROVED',
      learnerSurfaceSource: 'STRUCTURED_DISPLAYED_EVIDENCE',
      canonicalOutcomeSource: 'FROZEN_PERMANENT_RUNTIME',
      sourceInverseSource: 'FROZEN_SOURCE_INVERSE_PROFILE',
      humanLanguageReviewRequired: true,
      multilingualFreezeGranted: false,
      productDeliveryUnlocked: false,
    },
  } as RnkCp004LocalizedReviewQuestion;

  return {
    ...localized,
    localizationProof: {
      ...localized.localizationProof,
      localizationFingerprint: localizationFingerprint(localized),
    },
  };
}

export function buildRnkCp004LocalizedReviewBank(
  locale: RnkCp004LocalizedLocale,
): readonly RnkCp004LocalizedReviewQuestion[] {
  return buildRnkCp004PermanentRuntime().map((question) =>
    localizeRnkCp004PermanentQuestion(question, locale));
}

export const RNK_CP004_PERMANENT_QL_IDS = RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS.map(
  ({ qlId }) => qlId,
) as readonly RnkCp004PermanentQlId[];
