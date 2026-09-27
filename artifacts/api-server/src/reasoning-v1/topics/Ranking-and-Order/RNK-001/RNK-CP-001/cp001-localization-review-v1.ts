import { createHash } from 'node:crypto';

import {
  RNK_PERSON_POOL_V2,
  type RnkObjectLocale,
} from '../foundation/rnk-object-pool-v2';
import { generateRnkCp001EnglishReviewedAuthorityQuestion } from './cp001-english-review-remediated-runtime';
import {
  RNK_CP001_PERMANENT_QL_IDS,
  generateRnkCp001PermanentQuestion,
  type RnkCp001PermanentQlId,
  type RnkCp001PermanentQuestion,
} from './cp001-permanent-runtime';

export const RNK_CP001_LOCALIZATION_REVIEW_VERSION =
  'RNK_CP001_HI_PA_LOCALIZATION_REVIEW_V1' as const;
export const RNK_CP001_LOCALIZATION_REVIEW_AUTHORITY =
  'RNK_CP001_HI_PA_LOCALIZATION_REVIEW_CANDIDATE_V1' as const;

export type RnkCp001LocalizedLocale = 'hi-IN' | 'pa-IN';
type ContextId = 'MERIT_LIST' | 'HORIZONTAL_ROW' | 'QUEUE';

type CanonicalSource = {
  readonly contextId: ContextId;
  readonly targetName: string;
  readonly stem: string;
};

type LocalizedOption = Omit<RnkCp001PermanentQuestion['options'][number], 'explanation'> & {
  readonly explanation: string;
};

type LocalizedExplanation = {
  readonly keyRule: string;
  readonly stepByStepSolution: readonly string[];
  readonly examSpeedShortcut: string;
  readonly optionAnalysis: readonly string[];
  readonly conclusion: string;
};

export type RnkCp001LocalizedReviewQuestion = Omit<
  RnkCp001PermanentQuestion,
  'locale' | 'stem' | 'options' | 'explanation' | 'reviewMetadata' | 'lifecycle'
> & {
  readonly locale: RnkCp001LocalizedLocale;
  readonly canonicalLocale: 'en-IN';
  readonly canonicalTargetName: string;
  readonly targetName: string;
  readonly contextId: ContextId;
  readonly stem: string;
  readonly options: readonly LocalizedOption[];
  readonly explanation: LocalizedExplanation;
  readonly reviewMetadata: RnkCp001PermanentQuestion['reviewMetadata'] & {
    readonly localization: Readonly<{
      version: typeof RNK_CP001_LOCALIZATION_REVIEW_VERSION;
      locale: RnkCp001LocalizedLocale;
      learnerTextLocalized: true;
      humanLanguageReviewRequired: true;
    }>;
  };
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
    authority: typeof RNK_CP001_LOCALIZATION_REVIEW_AUTHORITY;
    canonicalLocale: 'en-IN';
    locale: RnkCp001LocalizedLocale;
    permanentQlId: RnkCp001PermanentQlId;
    canonicalSemanticFingerprint: string;
    localizationFingerprint: string;
    semanticParity: 'EXECUTABLE_PROVED';
    humanLanguageReviewRequired: true;
    multilingualFreezeGranted: false;
    productDeliveryUnlocked: false;
  }>;
};

interface NativeContext {
  readonly group: string;
  readonly members: string;
  readonly start: string;
  readonly end: string;
  readonly middle: string;
}

const HINDI_CONTEXTS: Readonly<Record<ContextId, NativeContext>> = {
  MERIT_LIST: {
    group: 'योग्यता सूची',
    members: 'अभ्यर्थी',
    start: 'ऊपर से',
    end: 'नीचे से',
    middle: 'ठीक बीच के स्थान पर',
  },
  HORIZONTAL_ROW: {
    group: 'पंक्ति',
    members: 'व्यक्ति',
    start: 'बाएँ से',
    end: 'दाएँ से',
    middle: 'पंक्ति के ठीक बीच के स्थान पर',
  },
  QUEUE: {
    group: 'कतार',
    members: 'व्यक्ति',
    start: 'आगे से',
    end: 'पीछे से',
    middle: 'कतार के ठीक बीच के स्थान पर',
  },
};

const PUNJABI_CONTEXTS: Readonly<Record<ContextId, NativeContext>> = {
  MERIT_LIST: {
    group: 'ਯੋਗਤਾ ਸੂਚੀ',
    members: 'ਉਮੀਦਵਾਰ',
    start: 'ਉੱਪਰੋਂ',
    end: 'ਹੇਠੋਂ',
    middle: 'ਬਿਲਕੁਲ ਵਿਚਕਾਰਲੇ ਸਥਾਨ ਤੇ',
  },
  HORIZONTAL_ROW: {
    group: 'ਕਤਾਰ',
    members: 'ਵਿਅਕਤੀ',
    start: 'ਖੱਬੇ ਪਾਸੋਂ',
    end: 'ਸੱਜੇ ਪਾਸੋਂ',
    middle: 'ਕਤਾਰ ਦੇ ਬਿਲਕੁਲ ਵਿਚਕਾਰਲੇ ਸਥਾਨ ਤੇ',
  },
  QUEUE: {
    group: 'ਲਾਈਨ',
    members: 'ਵਿਅਕਤੀ',
    start: 'ਅੱਗੋਂ',
    end: 'ਪਿੱਛੋਂ',
    middle: 'ਲਾਈਨ ਦੇ ਬਿਲਕੁਲ ਵਿਚਕਾਰਲੇ ਸਥਾਨ ਤੇ',
  },
};

function sha256(value: unknown): string {
  return createHash('sha256')
    .update(typeof value === 'string' ? value : JSON.stringify(value), 'utf8')
    .digest('hex');
}

function objectLocale(locale: RnkCp001LocalizedLocale): Exclude<RnkObjectLocale, 'en'> {
  return locale === 'hi-IN' ? 'hi' : 'pa';
}

function localizedTargetName(canonicalName: string, locale: RnkCp001LocalizedLocale): string {
  const person = RNK_PERSON_POOL_V2.find((entry) => entry.names.en === canonicalName);
  if (!person) throw new Error(`CP001 target name is missing from RNK Object Pool V2: ${canonicalName}`);
  return person.names[objectLocale(locale)];
}

function nativeContext(contextId: ContextId, locale: RnkCp001LocalizedLocale): NativeContext {
  return locale === 'hi-IN' ? HINDI_CONTEXTS[contextId] : PUNJABI_CONTEXTS[contextId];
}

function relationPhrase(
  contextId: ContextId,
  side: 'BEFORE' | 'AFTER',
  targetName: string,
  locale: RnkCp001LocalizedLocale,
): string {
  if (locale === 'hi-IN') {
    if (contextId === 'MERIT_LIST') return side === 'BEFORE' ? `${targetName} से ऊपर` : `${targetName} से नीचे`;
    if (contextId === 'HORIZONTAL_ROW') return side === 'BEFORE' ? `${targetName} के बाएँ` : `${targetName} के दाएँ`;
    return side === 'BEFORE' ? `${targetName} से आगे` : `${targetName} से पीछे`;
  }
  if (contextId === 'MERIT_LIST') return side === 'BEFORE' ? `${targetName} ਤੋਂ ਉੱਪਰ` : `${targetName} ਤੋਂ ਹੇਠਾਂ`;
  if (contextId === 'HORIZONTAL_ROW') return side === 'BEFORE' ? `${targetName} ਦੇ ਖੱਬੇ ਪਾਸੇ` : `${targetName} ਦੇ ਸੱਜੇ ਪਾਸੇ`;
  return side === 'BEFORE' ? `${targetName} ਤੋਂ ਅੱਗੇ` : `${targetName} ਤੋਂ ਪਿੱਛੇ`;
}

function ordinalPosition(value: number, locale: RnkCp001LocalizedLocale): string {
  return locale === 'hi-IN' ? `${value}वें स्थान पर` : `${value}ਵੇਂ ਸਥਾਨ 'ਤੇ`;
}

function canonicalSource(question: RnkCp001PermanentQuestion): CanonicalSource {
  const reviewed = generateRnkCp001EnglishReviewedAuthorityQuestion(question.authorityId, question.seed);
  const source = reviewed.question as unknown as CanonicalSource;
  if (source.stem !== question.stem) {
    throw new Error(`CP001 canonical source drift for ${question.qlId} seed ${question.seed}`);
  }
  if (reviewed.sourcePrototypeId !== question.reviewMetadata.sourcePrototypeId) {
    throw new Error(`CP001 source prototype drift for ${question.qlId} seed ${question.seed}`);
  }
  return source;
}

function renderStem(
  question: RnkCp001PermanentQuestion,
  source: CanonicalSource,
  locale: RnkCp001LocalizedLocale,
  targetName: string,
): string {
  const c = nativeContext(source.contextId, locale);
  const state = question.normalizedState as {
    readonly total: number;
    readonly rankFromStart: number;
    readonly rankFromEnd: number;
    readonly beforeCount: number;
    readonly afterCount: number;
  };
  const prototype = question.reviewMetadata.sourcePrototypeId;
  const before = relationPhrase(source.contextId, 'BEFORE', targetName, locale);
  const after = relationPhrase(source.contextId, 'AFTER', targetName, locale);

  if (prototype === 'RNK-CP001-PROT-OPPOSITE-END-RANK') {
    const evidence = question.displayedEvidence as unknown as {
      readonly knownSide: 'START' | 'END';
      readonly knownRank: number;
      readonly total: number;
    };
    const known = evidence.knownSide === 'START' ? c.start : c.end;
    const asked = evidence.knownSide === 'START' ? c.end : c.start;
    return locale === 'hi-IN'
      ? `एक ${c.group} में कुल ${evidence.total} ${c.members} हैं। ${targetName} ${known} ${ordinalPosition(evidence.knownRank, locale)} है। ${asked} ${targetName} का स्थान क्या है?`
      : `ਇੱਕ ${c.group} ਵਿੱਚ ਕੁੱਲ ${evidence.total} ${c.members} ਹਨ। ${targetName} ${known} ${ordinalPosition(evidence.knownRank, locale)} ਹੈ। ${asked} ${targetName} ਦਾ ਸਥਾਨ ਕੀ ਹੈ?`;
  }

  if (prototype === 'RNK-CP001-PROT-TOTAL-FROM-TWO-END-RANKS') {
    return locale === 'hi-IN'
      ? `${targetName} ${c.start} ${ordinalPosition(state.rankFromStart, locale)} और ${c.end} ${ordinalPosition(state.rankFromEnd, locale)} है। ${c.group} में कुल कितने ${c.members} हैं?`
      : `${targetName} ${c.start} ${ordinalPosition(state.rankFromStart, locale)} ਅਤੇ ${c.end} ${ordinalPosition(state.rankFromEnd, locale)} ਹੈ। ${c.group} ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ${c.members} ਹਨ?`;
  }

  if (prototype === 'RNK-CP001-PROT-COUNT-BEFORE-FROM-RANK') {
    return locale === 'hi-IN'
      ? `${targetName} ${c.start} ${ordinalPosition(state.rankFromStart, locale)} है। ${before} कितने ${c.members} हैं?`
      : `${targetName} ${c.start} ${ordinalPosition(state.rankFromStart, locale)} ਹੈ। ${before} ਕਿੰਨੇ ${c.members} ਹਨ?`;
  }

  if (prototype === 'RNK-CP001-PROT-COUNT-AFTER-FROM-END-RANK') {
    return locale === 'hi-IN'
      ? `${targetName} ${c.end} ${ordinalPosition(state.rankFromEnd, locale)} है। ${after} कितने ${c.members} हैं?`
      : `${targetName} ${c.end} ${ordinalPosition(state.rankFromEnd, locale)} ਹੈ। ${after} ਕਿੰਨੇ ${c.members} ਹਨ?`;
  }

  if (prototype === 'RNK-CP001-PROT-COUNT-AFTER-FROM-TOTAL-AND-RANK') {
    return locale === 'hi-IN'
      ? `एक ${c.group} में कुल ${state.total} ${c.members} हैं। ${targetName} ${c.start} ${ordinalPosition(state.rankFromStart, locale)} है। ${after} कितने ${c.members} हैं?`
      : `ਇੱਕ ${c.group} ਵਿੱਚ ਕੁੱਲ ${state.total} ${c.members} ਹਨ। ${targetName} ${c.start} ${ordinalPosition(state.rankFromStart, locale)} ਹੈ। ${after} ਕਿੰਨੇ ${c.members} ਹਨ?`;
  }

  if (prototype === 'RNK-CP001-PROT-COUNT-BEFORE-FROM-TOTAL-END-RANK') {
    return locale === 'hi-IN'
      ? `एक ${c.group} में कुल ${state.total} ${c.members} हैं। ${targetName} ${c.end} ${ordinalPosition(state.rankFromEnd, locale)} है। ${before} कितने ${c.members} हैं?`
      : `ਇੱਕ ${c.group} ਵਿੱਚ ਕੁੱਲ ${state.total} ${c.members} ਹਨ। ${targetName} ${c.end} ${ordinalPosition(state.rankFromEnd, locale)} ਹੈ। ${before} ਕਿੰਨੇ ${c.members} ਹਨ?`;
  }

  if (prototype === 'RNK-CP001-PROT-RANK-FROM-COUNT-BEFORE') {
    return locale === 'hi-IN'
      ? `${before} ${state.beforeCount} ${c.members} हैं। ${c.start} ${targetName} का स्थान क्या है?`
      : `${before} ${state.beforeCount} ${c.members} ਹਨ। ${c.start} ${targetName} ਦਾ ਸਥਾਨ ਕੀ ਹੈ?`;
  }

  if (prototype === 'RNK-CP001-PROT-END-RANK-FROM-COUNT-AFTER') {
    return locale === 'hi-IN'
      ? `${after} ${state.afterCount} ${c.members} हैं। ${c.end} ${targetName} का स्थान क्या है?`
      : `${after} ${state.afterCount} ${c.members} ਹਨ। ${c.end} ${targetName} ਦਾ ਸਥਾਨ ਕੀ ਹੈ?`;
  }

  if (prototype === 'RNK-CP001-PROT-RANK-FROM-COUNT-AFTER-AND-TOTAL') {
    return locale === 'hi-IN'
      ? `एक ${c.group} में कुल ${state.total} ${c.members} हैं और ${after} ${state.afterCount} ${c.members} हैं। ${c.start} ${targetName} का स्थान क्या है?`
      : `ਇੱਕ ${c.group} ਵਿੱਚ ਕੁੱਲ ${state.total} ${c.members} ਹਨ ਅਤੇ ${after} ${state.afterCount} ${c.members} ਹਨ। ${c.start} ${targetName} ਦਾ ਸਥਾਨ ਕੀ ਹੈ?`;
  }

  if (prototype === 'RNK-CP001-PROT-END-RANK-FROM-COUNT-BEFORE-AND-TOTAL') {
    return locale === 'hi-IN'
      ? `एक ${c.group} में कुल ${state.total} ${c.members} हैं और ${before} ${state.beforeCount} ${c.members} हैं। ${c.end} ${targetName} का स्थान क्या है?`
      : `ਇੱਕ ${c.group} ਵਿੱਚ ਕੁੱਲ ${state.total} ${c.members} ਹਨ ਅਤੇ ${before} ${state.beforeCount} ${c.members} ਹਨ। ${c.end} ${targetName} ਦਾ ਸਥਾਨ ਕੀ ਹੈ?`;
  }

  if (prototype === 'RNK-CP001-PROT-MIDDLE-RANK-FROM-TOTAL') {
    return locale === 'hi-IN'
      ? `एक ${c.group} में कुल ${state.total} ${c.members} हैं। ${targetName} ${c.middle} है। ${c.start} ${targetName} का स्थान क्या है?`
      : `ਇੱਕ ${c.group} ਵਿੱਚ ਕੁੱਲ ${state.total} ${c.members} ਹਨ। ${targetName} ${c.middle} ਹੈ। ${c.start} ${targetName} ਦਾ ਸਥਾਨ ਕੀ ਹੈ?`;
  }

  if (prototype === 'RNK-CP001-PROT-TOTAL-FROM-MIDDLE-RANK') {
    return locale === 'hi-IN'
      ? `${targetName} ${c.start} ${ordinalPosition(state.rankFromStart, locale)} है और ${c.middle} है। ${c.group} में कुल कितने ${c.members} हैं?`
      : `${targetName} ${c.start} ${ordinalPosition(state.rankFromStart, locale)} ਹੈ ਅਤੇ ${c.middle} ਹੈ। ${c.group} ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ${c.members} ਹਨ?`;
  }

  if (prototype === 'RNK-CP001-PROT-TOTAL-FROM-BEFORE-AFTER-COUNTS') {
    return locale === 'hi-IN'
      ? `${before} ${state.beforeCount} ${c.members} हैं और ${after} ${state.afterCount} ${c.members} हैं। ${targetName} को मिलाकर ${c.group} में कुल कितने ${c.members} हैं?`
      : `${before} ${state.beforeCount} ${c.members} ਹਨ ਅਤੇ ${after} ${state.afterCount} ${c.members} ਹਨ। ${targetName} ਨੂੰ ਮਿਲਾ ਕੇ ${c.group} ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ${c.members} ਹਨ?`;
  }

  throw new Error(`Unsupported CP001 localization prototype: ${prototype}`);
}

function calculation(question: RnkCp001PermanentQuestion): string {
  const state = question.normalizedState as {
    readonly total: number;
    readonly rankFromStart: number;
    readonly rankFromEnd: number;
    readonly beforeCount: number;
    readonly afterCount: number;
  };
  switch (question.qlId) {
    case 'RNK-QL-001': {
      const evidence = question.displayedEvidence as unknown as { readonly knownRank: number };
      return `${state.total} - ${evidence.knownRank} + 1 = ${question.answer}`;
    }
    case 'RNK-QL-002':
      return `${state.rankFromStart} + ${state.rankFromEnd} - 1 = ${question.answer}`;
    case 'RNK-QL-003': {
      const rank = question.reviewMetadata.sourcePrototypeId === 'RNK-CP001-PROT-COUNT-AFTER-FROM-END-RANK'
        ? state.rankFromEnd
        : state.rankFromStart;
      return `${rank} - 1 = ${question.answer}`;
    }
    case 'RNK-QL-004': {
      const rank = question.reviewMetadata.sourcePrototypeId === 'RNK-CP001-PROT-COUNT-BEFORE-FROM-TOTAL-END-RANK'
        ? state.rankFromEnd
        : state.rankFromStart;
      return `${state.total} - ${rank} = ${question.answer}`;
    }
    case 'RNK-QL-005': {
      const count = question.reviewMetadata.sourcePrototypeId === 'RNK-CP001-PROT-END-RANK-FROM-COUNT-AFTER'
        ? state.afterCount
        : state.beforeCount;
      return `${count} + 1 = ${question.answer}`;
    }
    case 'RNK-QL-006': {
      const count = question.reviewMetadata.sourcePrototypeId === 'RNK-CP001-PROT-END-RANK-FROM-COUNT-BEFORE-AND-TOTAL'
        ? state.beforeCount
        : state.afterCount;
      return `${state.total} - ${count} = ${question.answer}`;
    }
    case 'RNK-QL-007':
      return `(${state.total} + 1) ÷ 2 = ${question.answer}`;
    case 'RNK-QL-008':
      return `2 × ${state.rankFromStart} - 1 = ${question.answer}`;
    case 'RNK-QL-009':
      return `${state.beforeCount} + ${state.afterCount} + 1 = ${question.answer}`;
  }
}

function localizedRule(question: RnkCp001PermanentQuestion, locale: RnkCp001LocalizedLocale): string {
  const hi: Readonly<Record<RnkCp001PermanentQlId, string>> = {
    'RNK-QL-001': 'विपरीत छोर से स्थान = कुल संख्या − दिए गए छोर का स्थान + 1।',
    'RNK-QL-002': 'कुल संख्या = दोनों छोरों से दिए गए स्थानों का योग − 1, क्योंकि वही व्यक्ति दोनों स्थानों में गिना गया है।',
    'RNK-QL-003': 'किसी व्यक्ति से उसी ओर मौजूद लोगों की संख्या = उसी ओर से उसका स्थान − 1।',
    'RNK-QL-004': 'दिए गए स्थान के विपरीत ओर लोगों की संख्या = कुल संख्या − दिया गया स्थान।',
    'RNK-QL-005': 'उसी ओर से स्थान = उस ओर मौजूद लोगों की संख्या + 1।',
    'RNK-QL-006': 'विपरीत छोर से स्थान = कुल संख्या − दी गई दूसरी ओर की लोगों की संख्या।',
    'RNK-QL-007': 'विषम कुल संख्या में ठीक बीच का स्थान = (कुल संख्या + 1) ÷ 2।',
    'RNK-QL-008': 'यदि कोई व्यक्ति ठीक बीच में है, तो कुल संख्या = 2 × बीच का स्थान − 1।',
    'RNK-QL-009': 'कुल संख्या = व्यक्ति से पहले वाले + व्यक्ति स्वयं + व्यक्ति के बाद वाले।',
  };
  const pa: Readonly<Record<RnkCp001PermanentQlId, string>> = {
    'RNK-QL-001': 'ਉਲਟ ਸਿਰੇ ਤੋਂ ਸਥਾਨ = ਕੁੱਲ ਗਿਣਤੀ − ਦਿੱਤੇ ਸਿਰੇ ਤੋਂ ਸਥਾਨ + 1।',
    'RNK-QL-002': 'ਕੁੱਲ ਗਿਣਤੀ = ਦੋਵੇਂ ਸਿਰਿਆਂ ਤੋਂ ਦਿੱਤੇ ਸਥਾਨਾਂ ਦਾ ਜੋੜ − 1, ਕਿਉਂਕਿ ਉਹੀ ਵਿਅਕਤੀ ਦੋਵੇਂ ਸਥਾਨਾਂ ਵਿੱਚ ਗਿਣਿਆ ਗਿਆ ਹੈ।',
    'RNK-QL-003': 'ਉਸੇ ਪਾਸੇ ਮੌਜੂਦ ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ = ਉਸੇ ਪਾਸੇ ਤੋਂ ਸਥਾਨ − 1।',
    'RNK-QL-004': 'ਦਿੱਤੇ ਸਥਾਨ ਦੇ ਉਲਟ ਪਾਸੇ ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ = ਕੁੱਲ ਗਿਣਤੀ − ਦਿੱਤਾ ਸਥਾਨ।',
    'RNK-QL-005': 'ਉਸੇ ਪਾਸੇ ਤੋਂ ਸਥਾਨ = ਉਸ ਪਾਸੇ ਮੌਜੂਦ ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ + 1।',
    'RNK-QL-006': 'ਉਲਟ ਸਿਰੇ ਤੋਂ ਸਥਾਨ = ਕੁੱਲ ਗਿਣਤੀ − ਦੂਜੇ ਪਾਸੇ ਮੌਜੂਦ ਵਿਅਕਤੀਆਂ ਦੀ ਦਿੱਤੀ ਗਿਣਤੀ।',
    'RNK-QL-007': 'ਵਿਸ਼ਮ ਕੁੱਲ ਗਿਣਤੀ ਵਿੱਚ ਬਿਲਕੁਲ ਵਿਚਕਾਰਲਾ ਸਥਾਨ = (ਕੁੱਲ ਗਿਣਤੀ + 1) ÷ 2।',
    'RNK-QL-008': 'ਜੇ ਵਿਅਕਤੀ ਬਿਲਕੁਲ ਵਿਚਕਾਰ ਹੈ, ਤਾਂ ਕੁੱਲ ਗਿਣਤੀ = 2 × ਵਿਚਕਾਰਲਾ ਸਥਾਨ − 1।',
    'RNK-QL-009': 'ਕੁੱਲ ਗਿਣਤੀ = ਵਿਅਕਤੀ ਤੋਂ ਪਹਿਲਾਂ ਵਾਲੇ + ਵਿਅਕਤੀ ਖੁਦ + ਵਿਅਕਤੀ ਤੋਂ ਬਾਅਦ ਵਾਲੇ।',
  };
  return locale === 'hi-IN' ? hi[question.qlId] : pa[question.qlId];
}

function renderExplanation(
  question: RnkCp001PermanentQuestion,
  locale: RnkCp001LocalizedLocale,
  options: readonly LocalizedOption[],
): LocalizedExplanation {
  const calc = calculation(question);
  const state = question.normalizedState as {
    readonly total: number;
    readonly rankFromStart: number;
    readonly rankFromEnd: number;
    readonly beforeCount: number;
    readonly afterCount: number;
  };
  const keyRule = localizedRule(question, locale);

  const firstStep = locale === 'hi-IN'
    ? `दिए गए मानों को व्यवस्थित करें: कुल = ${state.total}, ऊपर/बाएँ/आगे से स्थान = ${state.rankFromStart}, नीचे/दाएँ/पीछे से स्थान = ${state.rankFromEnd}, पहले वाले = ${state.beforeCount}, बाद वाले = ${state.afterCount}।`
    : `ਦਿੱਤੇ ਮਾਨਾਂ ਨੂੰ ਵਿਵਸਥਿਤ ਕਰੋ: ਕੁੱਲ = ${state.total}, ਉੱਪਰ/ਖੱਬੇ/ਅੱਗੇ ਤੋਂ ਸਥਾਨ = ${state.rankFromStart}, ਹੇਠਾਂ/ਸੱਜੇ/ਪਿੱਛੇ ਤੋਂ ਸਥਾਨ = ${state.rankFromEnd}, ਪਹਿਲਾਂ ਵਾਲੇ = ${state.beforeCount}, ਬਾਅਦ ਵਾਲੇ = ${state.afterCount}।`;
  const secondStep = locale === 'hi-IN'
    ? `संबंधित नियम लगाएँ: ${calc}।`
    : `ਸੰਬੰਧਿਤ ਨਿਯਮ ਲਗਾਓ: ${calc}।`;
  const thirdStep = locale === 'hi-IN'
    ? `इसलिए आवश्यक उत्तर ${question.answer} है।`
    : `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਉੱਤਰ ${question.answer} ਹੈ।`;
  const shortcut = locale === 'hi-IN'
    ? `तेज़ तरीका: प्रश्न में दिए गए छोर/पक्ष को पहचानें और सीधे यही गणना करें — ${calc}।`
    : `ਤੇਜ਼ ਤਰੀਕਾ: ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੇ ਸਿਰੇ/ਪਾਸੇ ਨੂੰ ਪਛਾਣੋ ਅਤੇ ਸਿੱਧੀ ਇਹ ਗਣਨਾ ਕਰੋ — ${calc}।`;
  const optionAnalysis = options.map((option, index) => {
    if (option.value === question.answer) {
      return locale === 'hi-IN'
        ? `विकल्प ${index + 1} (${option.label}): सही, क्योंकि ${calc}।`
        : `ਵਿਕਲਪ ${index + 1} (${option.label}): ਸਹੀ, ਕਿਉਂਕਿ ${calc}।`;
    }
    return locale === 'hi-IN'
      ? `विकल्प ${index + 1} (${option.label}): सही नहीं; नियम से ${calc}, इसलिए ${option.value} स्वीकार्य नहीं है।`
      : `ਵਿਕਲਪ ${index + 1} (${option.label}): ਸਹੀ ਨਹੀਂ; ਨਿਯਮ ਤੋਂ ${calc}, ਇਸ ਲਈ ${option.value} ਸਵੀਕਾਰਯੋਗ ਨਹੀਂ ਹੈ।`;
  });
  const conclusion = locale === 'hi-IN'
    ? `अतः सही उत्तर ${question.answer} है।`
    : `ਅਤੇ ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${question.answer} ਹੈ।`;

  return {
    keyRule,
    stepByStepSolution: [firstStep, secondStep, thirdStep],
    examSpeedShortcut: shortcut,
    optionAnalysis,
    conclusion,
  };
}

function localizeOptions(
  question: RnkCp001PermanentQuestion,
  locale: RnkCp001LocalizedLocale,
): readonly LocalizedOption[] {
  const calc = calculation(question);
  return question.options.map((option) => ({
    ...option,
    explanation: option.value === question.answer
      ? locale === 'hi-IN'
        ? `यह सही विकल्प है: ${calc}।`
        : `ਇਹ ਸਹੀ ਵਿਕਲਪ ਹੈ: ${calc}।`
      : locale === 'hi-IN'
        ? `यह मान सही नियम से नहीं मिलता; सही गणना ${calc} है।`
        : `ਇਹ ਮਾਨ ਸਹੀ ਨਿਯਮ ਤੋਂ ਨਹੀਂ ਮਿਲਦਾ; ਸਹੀ ਗਣਨਾ ${calc} ਹੈ।`,
  }));
}

export function rnkCp001CanonicalSemanticFingerprint(
  question: RnkCp001PermanentQuestion,
): string {
  return sha256({
    packageId: question.packageId,
    checkpointId: question.checkpointId,
    qlId: question.qlId,
    permanentQlId: question.permanentQlId,
    seed: question.seed,
    authorityId: question.authorityId,
    authorityContract: question.authorityContract,
    displayedEvidence: question.displayedEvidence,
    answerSemantic: question.answerSemantic,
    answer: question.answer,
    options: question.options.map((option) => ({
      value: option.value,
      label: option.label,
      misconceptionId: option.misconceptionId,
    })),
    correctIndex: question.correctIndex,
    difficulty: question.difficulty,
    normalizedState: question.normalizedState,
    mathematicalFingerprint: question.mathematicalFingerprint,
    sourcePrototypeId: question.reviewMetadata.sourcePrototypeId,
  });
}

export function localizeRnkCp001PermanentQuestion(
  question: RnkCp001PermanentQuestion,
  locale: RnkCp001LocalizedLocale,
): RnkCp001LocalizedReviewQuestion {
  const source = canonicalSource(question);
  const targetName = localizedTargetName(source.targetName, locale);
  const stem = renderStem(question, source, locale, targetName);
  const options = localizeOptions(question, locale);
  const explanation = renderExplanation(question, locale, options);
  const canonicalSemanticFingerprint = rnkCp001CanonicalSemanticFingerprint(question);
  const localizationFingerprint = sha256({
    version: RNK_CP001_LOCALIZATION_REVIEW_VERSION,
    qlId: question.qlId,
    seed: question.seed,
    canonicalSemanticFingerprint,
    locale,
    targetName,
    stem,
    options,
    explanation,
  });

  return {
    ...question,
    locale,
    canonicalLocale: 'en-IN',
    canonicalTargetName: source.targetName,
    targetName,
    contextId: source.contextId,
    stem,
    options,
    explanation,
    reviewMetadata: {
      ...question.reviewMetadata,
      localization: {
        version: RNK_CP001_LOCALIZATION_REVIEW_VERSION,
        locale,
        learnerTextLocalized: true,
        humanLanguageReviewRequired: true,
      },
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
      authority: RNK_CP001_LOCALIZATION_REVIEW_AUTHORITY,
      canonicalLocale: 'en-IN',
      locale,
      permanentQlId: question.permanentQlId,
      canonicalSemanticFingerprint,
      localizationFingerprint,
      semanticParity: 'EXECUTABLE_PROVED',
      humanLanguageReviewRequired: true,
      multilingualFreezeGranted: false,
      productDeliveryUnlocked: false,
    },
  };
}

export function buildRnkCp001LocalizedReviewBank(
  locale: RnkCp001LocalizedLocale,
  seedsPerQl = 128,
): readonly RnkCp001LocalizedReviewQuestion[] {
  if (!Number.isInteger(seedsPerQl) || seedsPerQl <= 0) {
    throw new Error(`Invalid CP001 localization seedsPerQl: ${seedsPerQl}`);
  }
  return RNK_CP001_PERMANENT_QL_IDS.flatMap((qlId) =>
    Array.from({ length: seedsPerQl }, (_, seed) =>
      localizeRnkCp001PermanentQuestion(generateRnkCp001PermanentQuestion(qlId, seed), locale),
    ),
  );
}
