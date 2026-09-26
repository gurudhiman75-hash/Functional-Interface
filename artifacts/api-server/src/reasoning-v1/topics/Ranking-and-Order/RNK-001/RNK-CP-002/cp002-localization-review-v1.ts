import { createHash } from 'node:crypto';

import {
  RNK_PERSON_POOL_V2,
  type RnkObjectLocale,
} from '../foundation/rnk-object-pool-v2';
import {
  RNK_CP002_PERMANENT_QL_IDS,
  generateRnkCp002PermanentQuestion,
  type RnkCp002PermanentQlId,
  type RnkCp002PermanentQuestion,
} from './cp002-permanent-runtime';

export const RNK_CP002_LOCALIZATION_REVIEW_VERSION =
  'RNK_CP002_HI_PA_LOCALIZATION_REVIEW_V1' as const;
export const RNK_CP002_LOCALIZATION_REVIEW_AUTHORITY =
  'RNK_CP002_HI_PA_STRUCTURED_EVIDENCE_REVIEW_V1' as const;

export type RnkCp002LocalizedLocale = 'hi-IN' | 'pa-IN';
type ContextId = RnkCp002PermanentQuestion['contextId'];
type Evidence = RnkCp002PermanentQuestion['displayedEvidence'];

type LocalizedOption = Readonly<{
  value: string | number;
  label: string;
  misconceptionId: string;
  explanation: string;
}>;

type LocalizedExplanation = Readonly<{
  keyRule: string;
  stepByStepSolution: readonly string[];
  examSpeedShortcut: string;
  optionAnalysis: readonly string[];
  conclusion: string;
}>;

export type RnkCp002LocalizedReviewQuestion = Omit<
  RnkCp002PermanentQuestion,
  'locale' | 'firstName' | 'secondName' | 'stem' | 'answer' | 'options' | 'explanation' | 'reviewMetadata' | 'lifecycle'
> & {
  readonly locale: RnkCp002LocalizedLocale;
  readonly canonicalLocale: 'en-IN';
  readonly canonicalFirstName: string;
  readonly canonicalSecondName: string;
  readonly firstName: string;
  readonly secondName: string;
  readonly stem: string;
  readonly answer: string | number;
  readonly options: readonly LocalizedOption[];
  readonly explanation: LocalizedExplanation;
  readonly reviewMetadata: RnkCp002PermanentQuestion['reviewMetadata'] & {
    readonly localization: Readonly<{
      version: typeof RNK_CP002_LOCALIZATION_REVIEW_VERSION;
      locale: RnkCp002LocalizedLocale;
      learnerTextLocalized: true;
      structuredEvidenceRendered: true;
      canonicalOutcomeLocalization: true;
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
    authority: typeof RNK_CP002_LOCALIZATION_REVIEW_AUTHORITY;
    canonicalLocale: 'en-IN';
    locale: RnkCp002LocalizedLocale;
    permanentQlId: RnkCp002PermanentQlId;
    canonicalSemanticFingerprint: string;
    localizationFingerprint: string;
    semanticParity: 'EXECUTABLE_PROVED';
    learnerSurfaceSource: 'STRUCTURED_DISPLAYED_EVIDENCE';
    canonicalOutcomeSource: 'PERMANENT_REVIEW_METADATA';
    humanLanguageReviewRequired: true;
    multilingualFreezeGranted: false;
    productDeliveryUnlocked: false;
  }>;
};

interface NativeContext {
  readonly group: string;
  readonly members: string;
  readonly memberSingular: string;
  readonly startRank: string;
  readonly endRank: string;
  readonly startEnd: string;
  readonly endEnd: string;
}

const HINDI_CONTEXTS: Readonly<Record<ContextId, NativeContext>> = {
  MERIT_LIST: {
    group: 'योग्यता सूची',
    members: 'अभ्यर्थी',
    memberSingular: 'अभ्यर्थी',
    startRank: 'ऊपर से',
    endRank: 'नीचे से',
    startEnd: 'सूची के ऊपर वाले सिरे',
    endEnd: 'सूची के नीचे वाले सिरे',
  },
  HORIZONTAL_ROW: {
    group: 'पंक्ति',
    members: 'व्यक्ति',
    memberSingular: 'व्यक्ति',
    startRank: 'बाएँ से',
    endRank: 'दाएँ से',
    startEnd: 'बाएँ छोर',
    endEnd: 'दाएँ छोर',
  },
  QUEUE: {
    group: 'कतार',
    members: 'व्यक्ति',
    memberSingular: 'व्यक्ति',
    startRank: 'आगे से',
    endRank: 'पीछे से',
    startEnd: 'कतार के आगे वाले सिरे',
    endEnd: 'कतार के पीछे वाले सिरे',
  },
};

const PUNJABI_CONTEXTS: Readonly<Record<ContextId, NativeContext>> = {
  MERIT_LIST: {
    group: 'ਯੋਗਤਾ ਸੂਚੀ',
    members: 'ਉਮੀਦਵਾਰ',
    memberSingular: 'ਉਮੀਦਵਾਰ',
    startRank: 'ਉੱਪਰੋਂ',
    endRank: 'ਹੇਠੋਂ',
    startEnd: 'ਸੂਚੀ ਦੇ ਉੱਪਰਲੇ ਸਿਰੇ',
    endEnd: 'ਸੂਚੀ ਦੇ ਹੇਠਲੇ ਸਿਰੇ',
  },
  HORIZONTAL_ROW: {
    group: 'ਕਤਾਰ',
    members: 'ਵਿਅਕਤੀ',
    memberSingular: 'ਵਿਅਕਤੀ',
    startRank: 'ਖੱਬੇ ਪਾਸੋਂ',
    endRank: 'ਸੱਜੇ ਪਾਸੋਂ',
    startEnd: 'ਖੱਬੇ ਸਿਰੇ',
    endEnd: 'ਸੱਜੇ ਸਿਰੇ',
  },
  QUEUE: {
    group: 'ਲਾਈਨ',
    members: 'ਵਿਅਕਤੀ',
    memberSingular: 'ਵਿਅਕਤੀ',
    startRank: 'ਅੱਗੋਂ',
    endRank: 'ਪਿੱਛੋਂ',
    startEnd: 'ਲਾਈਨ ਦੇ ਅੱਗੇਲੇ ਸਿਰੇ',
    endEnd: 'ਲਾਈਨ ਦੇ ਪਿੱਛੇਲੇ ਸਿਰੇ',
  },
};

const CANNOT_BE_DETERMINED = 'Cannot be determined';
const BOTH_EQUAL = 'Both are equally placed';
const FIRST_NEAR_START = 'The first person is nearer the start end';
const SECOND_NEAR_START = 'The second person is nearer the start end';
const BOTH_ORDERS = 'Both orders are possible';
const PROPOSED_IMPOSSIBLE = 'The proposed total is impossible';

function sha256(value: unknown): string {
  return createHash('sha256')
    .update(typeof value === 'string' ? value : JSON.stringify(value), 'utf8')
    .digest('hex');
}

function objectLocale(locale: RnkCp002LocalizedLocale): Exclude<RnkObjectLocale, 'en'> {
  return locale === 'hi-IN' ? 'hi' : 'pa';
}

function localizedName(canonicalName: string, locale: RnkCp002LocalizedLocale): string {
  const person = RNK_PERSON_POOL_V2.find((entry) => entry.names.en === canonicalName);
  if (!person) throw new Error(`CP002 name missing from RNK Object Pool V2: ${canonicalName}`);
  return person.names[objectLocale(locale)];
}

function contextFor(contextId: ContextId, locale: RnkCp002LocalizedLocale): NativeContext {
  return locale === 'hi-IN' ? HINDI_CONTEXTS[contextId] : PUNJABI_CONTEXTS[contextId];
}

function ordinalPosition(value: number, locale: RnkCp002LocalizedLocale): string {
  if (locale === 'hi-IN') {
    if (value === 1) return 'पहले स्थान पर';
    if (value === 2) return 'दूसरे स्थान पर';
    if (value === 3) return 'तीसरे स्थान पर';
    if (value === 4) return 'चौथे स्थान पर';
    return `${value}वें स्थान पर`;
  }
  if (value === 1) return "ਪਹਿਲੇ ਸਥਾਨ 'ਤੇ";
  if (value === 2) return "ਦੂਜੇ ਸਥਾਨ 'ਤੇ";
  if (value === 3) return "ਤੀਜੇ ਸਥਾਨ 'ਤੇ";
  if (value === 4) return "ਚੌਥੇ ਸਥਾਨ 'ਤੇ";
  return `${value}ਵੇਂ ਸਥਾਨ 'ਤੇ`;
}

function rankPhrase(side: 'START' | 'END', context: NativeContext): string {
  return side === 'START' ? context.startRank : context.endRank;
}

function requestedEnd(
  evidence: Extract<Evidence, { kind: 'COMPARE_SAME_END' | 'COMPARE_MIXED_END' }>,
): 'START' | 'END' {
  if (evidence.kind === 'COMPARE_MIXED_END') return evidence.requested === 'TOWARD_START' ? 'START' : 'END';
  if (evidence.requested === 'NEARER_SUPPLIED_END') return evidence.side;
  return evidence.requested === 'TOWARD_START' ? 'START' : 'END';
}

function endLabel(side: 'START' | 'END', context: NativeContext): string {
  return side === 'START' ? context.startEnd : context.endEnd;
}

function relationSentence(
  subject: string,
  reference: string,
  direction: 'TOWARD_START' | 'TOWARD_END',
  contextId: ContextId,
  locale: RnkCp002LocalizedLocale,
): string {
  if (locale === 'hi-IN') {
    if (contextId === 'MERIT_LIST') return `${subject} ${reference} से ${direction === 'TOWARD_START' ? 'ऊपर' : 'नीचे'} है`;
    if (contextId === 'HORIZONTAL_ROW') return `${subject} ${reference} के ${direction === 'TOWARD_START' ? 'बाएँ' : 'दाएँ'} है`;
    return `${subject} ${reference} से ${direction === 'TOWARD_START' ? 'आगे' : 'पीछे'} है`;
  }
  if (contextId === 'MERIT_LIST') return `${subject} ${reference} ਤੋਂ ${direction === 'TOWARD_START' ? 'ਉੱਪਰ' : 'ਹੇਠਾਂ'} ਹੈ`;
  if (contextId === 'HORIZONTAL_ROW') return `${subject} ${reference} ਦੇ ${direction === 'TOWARD_START' ? 'ਖੱਬੇ ਪਾਸੇ' : 'ਸੱਜੇ ਪਾਸੇ'} ਹੈ`;
  return `${subject} ${reference} ਤੋਂ ${direction === 'TOWARD_START' ? 'ਅੱਗੇ' : 'ਪਿੱਛੇ'} ਹੈ`;
}

function betweenClause(
  count: number,
  context: NativeContext,
  locale: RnkCp002LocalizedLocale,
): string {
  if (locale === 'hi-IN') {
    if (count === 0) return `दोनों के बीच कोई ${context.memberSingular} नहीं है`;
    if (count === 1) return `दोनों के बीच एक ${context.memberSingular} है`;
    return `दोनों के बीच ${count} ${context.members} हैं`;
  }
  if (count === 0) return `ਦੋਵਾਂ ਦੇ ਵਿਚਕਾਰ ਕੋਈ ${context.memberSingular} ਨਹੀਂ ਹੈ`;
  if (count === 1) return `ਦੋਵਾਂ ਦੇ ਵਿਚਕਾਰ ਇੱਕ ${context.memberSingular} ਹੈ`;
  return `ਦੋਵਾਂ ਦੇ ਵਿਚਕਾਰ ${count} ${context.members} ਹਨ`;
}

function localizeOrderStatus(
  canonical: string,
  firstName: string,
  secondName: string,
  context: NativeContext,
  locale: RnkCp002LocalizedLocale,
): string {
  if (canonical === FIRST_NEAR_START) {
    return locale === 'hi-IN'
      ? `${firstName} ${context.startEnd} के अधिक निकट है`
      : `${firstName} ${context.startEnd} ਦੇ ਵੱਧ ਨੇੜੇ ਹੈ`;
  }
  if (canonical === SECOND_NEAR_START) {
    return locale === 'hi-IN'
      ? `${secondName} ${context.startEnd} के अधिक निकट है`
      : `${secondName} ${context.startEnd} ਦੇ ਵੱਧ ਨੇੜੇ ਹੈ`;
  }
  if (canonical === BOTH_ORDERS) return locale === 'hi-IN' ? 'दोनों क्रम संभव हैं' : 'ਦੋਵੇਂ ਕ੍ਰਮ ਸੰਭਵ ਹਨ';
  if (canonical === PROPOSED_IMPOSSIBLE) return locale === 'hi-IN' ? 'प्रस्तावित कुल संख्या संभव नहीं है' : 'ਪ੍ਰਸਤਾਵਿਤ ਕੁੱਲ ਗਿਣਤੀ ਸੰਭਵ ਨਹੀਂ ਹੈ';
  throw new Error(`Unknown CP002 order status: ${canonical}`);
}

function localizeCanonicalOutcome(
  canonical: string | number,
  question: RnkCp002PermanentQuestion,
  locale: RnkCp002LocalizedLocale,
  firstName: string,
  secondName: string,
): string | number {
  if (typeof canonical === 'number') return canonical;
  if (/^-?\d+(?:\.\d+)?$/u.test(canonical)) return canonical;
  if (canonical === question.firstName) return firstName;
  if (canonical === question.secondName) return secondName;
  if (canonical === CANNOT_BE_DETERMINED) return locale === 'hi-IN' ? 'निर्धारित नहीं किया जा सकता' : 'ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ';
  if (canonical === BOTH_EQUAL) return locale === 'hi-IN' ? 'दोनों समान दूरी पर हैं' : "ਦੋਵੇਂ ਇੱਕੋ ਦੂਰੀ 'ਤੇ ਹਨ";
  if ([FIRST_NEAR_START, SECOND_NEAR_START, BOTH_ORDERS, PROPOSED_IMPOSSIBLE].includes(canonical)) {
    return localizeOrderStatus(canonical, firstName, secondName, contextFor(question.contextId, locale), locale);
  }
  throw new Error(`Unsupported CP002 canonical learner outcome: ${canonical}`);
}

function renderStem(
  question: RnkCp002PermanentQuestion,
  locale: RnkCp002LocalizedLocale,
  firstName: string,
  secondName: string,
): string {
  const evidence = question.displayedEvidence;
  const context = contextFor(question.contextId, locale);
  const hi = locale === 'hi-IN';
  const rank = (value: number, side: 'START' | 'END') => `${rankPhrase(side, context)} ${ordinalPosition(value, locale)}`;
  const askBetween = hi ? `दोनों के बीच कितने ${context.members} हैं?` : `ਦੋਵਾਂ ਦੇ ਵਿਚਕਾਰ ਕਿੰਨੇ ${context.members} ਹਨ?`;
  const askGap = hi ? 'दोनों के स्थानों में कितना अंतर है?' : 'ਦੋਵਾਂ ਦੇ ਸਥਾਨਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੈ?';

  switch (evidence.kind) {
    case 'SAME_END_TWO_RANKS': {
      const body = hi
        ? `${firstName} ${rank(evidence.firstRank, evidence.side)} है और ${secondName} ${rank(evidence.secondRank, evidence.side)} है।`
        : `${firstName} ${rank(evidence.firstRank, evidence.side)} ਹੈ ਅਤੇ ${secondName} ${rank(evidence.secondRank, evidence.side)} ਹੈ।`;
      return `${body} ${evidence.requested === 'BETWEEN_COUNT' ? askBetween : askGap}`;
    }
    case 'SECOND_RANK_FROM_RELATIVE_OFFSET': {
      const relation = relationSentence(secondName, firstName, evidence.direction, question.contextId, locale);
      return hi
        ? `${firstName} ${rank(evidence.firstRank, evidence.side)} है। ${relation} और दोनों के स्थानों में ${evidence.offset} का अंतर है। ${rankPhrase(evidence.side, context)} ${secondName} का स्थान क्या है?`
        : `${firstName} ${rank(evidence.firstRank, evidence.side)} ਹੈ। ${relation} ਅਤੇ ਦੋਵਾਂ ਦੇ ਸਥਾਨਾਂ ਵਿੱਚ ${evidence.offset} ਦਾ ਅੰਤਰ ਹੈ। ${rankPhrase(evidence.side, context)} ${secondName} ਦਾ ਸਥਾਨ ਕੀ ਹੈ?`;
    }
    case 'BETWEEN_FROM_MIXED_END_RANKS':
      return hi
        ? `एक ${context.group} में कुल ${evidence.total} ${context.members} हैं। ${firstName} ${rank(evidence.firstRankFromStart, 'START')} है और ${secondName} ${rank(evidence.secondRankFromEnd, 'END')} है। ${askBetween}`
        : `ਇੱਕ ${context.group} ਵਿੱਚ ਕੁੱਲ ${evidence.total} ${context.members} ਹਨ। ${firstName} ${rank(evidence.firstRankFromStart, 'START')} ਹੈ ਅਤੇ ${secondName} ${rank(evidence.secondRankFromEnd, 'END')} ਹੈ। ${askBetween}`;
    case 'TOTAL_FROM_MIXED_END_RANKS_KNOWN_ORDER': {
      const relation = relationSentence(secondName, firstName, evidence.direction, question.contextId, locale);
      const between = betweenClause(evidence.betweenCount, context, locale);
      return hi
        ? `${firstName} ${rank(evidence.firstRankFromStart, 'START')} है और ${secondName} ${rank(evidence.secondRankFromEnd, 'END')} है। ${relation} तथा ${between}। ${context.group} में कुल कितने ${context.members} हैं?`
        : `${firstName} ${rank(evidence.firstRankFromStart, 'START')} ਹੈ ਅਤੇ ${secondName} ${rank(evidence.secondRankFromEnd, 'END')} ਹੈ। ${relation} ਅਤੇ ${between}। ${context.group} ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ${context.members} ਹਨ?`;
    }
    case 'EXTREME_TOTAL_FROM_MIXED_END_RANKS_UNKNOWN_ORDER': {
      const between = betweenClause(evidence.betweenCount, context, locale);
      const extreme = evidence.requestedExtreme === 'MAXIMUM'
        ? (hi ? 'अधिकतम' : 'ਵੱਧ ਤੋਂ ਵੱਧ')
        : (hi ? 'न्यूनतम' : 'ਘੱਟ ਤੋਂ ਘੱਟ');
      return hi
        ? `${firstName} ${rank(evidence.firstRankFromStart, 'START')} है और ${secondName} ${rank(evidence.secondRankFromEnd, 'END')} है। ${between}, लेकिन दोनों का आपसी क्रम नहीं बताया गया है। ${context.group} में ${context.members} की ${extreme} संख्या कितनी हो सकती है?`
        : `${firstName} ${rank(evidence.firstRankFromStart, 'START')} ਹੈ ਅਤੇ ${secondName} ${rank(evidence.secondRankFromEnd, 'END')} ਹੈ। ${between}, ਪਰ ਦੋਵਾਂ ਦਾ ਆਪਸੀ ਕ੍ਰਮ ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ। ${context.group} ਵਿੱਚ ${context.members} ਦੀ ${extreme} ਗਿਣਤੀ ਕਿੰਨੀ ਹੋ ਸਕਦੀ ਹੈ?`;
    }
    case 'POSITION_GAP_MIXED_END':
      return hi
        ? `एक ${context.group} में कुल ${evidence.total} ${context.members} हैं। ${firstName} ${rank(evidence.firstRankFromStart, 'START')} है और ${secondName} ${rank(evidence.secondRankFromEnd, 'END')} है। ${askGap}`
        : `ਇੱਕ ${context.group} ਵਿੱਚ ਕੁੱਲ ${evidence.total} ${context.members} ਹਨ। ${firstName} ${rank(evidence.firstRankFromStart, 'START')} ਹੈ ਅਤੇ ${secondName} ${rank(evidence.secondRankFromEnd, 'END')} ਹੈ। ${askGap}`;
    case 'OFFSET_FROM_SAME_END':
      return hi
        ? `${firstName} ${rank(evidence.firstRank, evidence.side)} है और ${secondName} ${rank(evidence.secondRank, evidence.side)} है। दोनों के स्थानों में कितना अंतर है?`
        : `${firstName} ${rank(evidence.firstRank, evidence.side)} ਹੈ ਅਤੇ ${secondName} ${rank(evidence.secondRank, evidence.side)} ਹੈ। ਦੋਵਾਂ ਦੇ ਸਥਾਨਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੈ?`;
    case 'TARGET_RANK_FROM_BETWEEN': {
      const relation = relationSentence(secondName, firstName, evidence.direction, question.contextId, locale);
      const between = betweenClause(evidence.betweenCount, context, locale);
      return hi
        ? `${firstName} ${rank(evidence.referenceRank, evidence.side)} है। ${relation} और ${between}। ${rankPhrase(evidence.side, context)} ${secondName} का स्थान क्या है?`
        : `${firstName} ${rank(evidence.referenceRank, evidence.side)} ਹੈ। ${relation} ਅਤੇ ${between}। ${rankPhrase(evidence.side, context)} ${secondName} ਦਾ ਸਥਾਨ ਕੀ ਹੈ?`;
    }
    case 'COMPARE_SAME_END': {
      const side = requestedEnd(evidence);
      const end = endLabel(side, context);
      const body = hi
        ? `${firstName} ${rank(evidence.firstRank, evidence.side)} है और ${secondName} ${rank(evidence.secondRank, evidence.side)} है।`
        : `${firstName} ${rank(evidence.firstRank, evidence.side)} ਹੈ ਅਤੇ ${secondName} ${rank(evidence.secondRank, evidence.side)} ਹੈ।`;
      return hi ? `${body} ${end} के अधिक निकट कौन है?` : `${body} ${end} ਦੇ ਵੱਧ ਨੇੜੇ ਕੌਣ ਹੈ?`;
    }
    case 'COMPARE_MIXED_END': {
      const side = requestedEnd(evidence);
      const end = endLabel(side, context);
      return hi
        ? `एक ${context.group} में कुल ${evidence.total} ${context.members} हैं। ${firstName} ${rank(evidence.firstRankFromStart, 'START')} है और ${secondName} ${rank(evidence.secondRankFromEnd, 'END')} है। ${end} के अधिक निकट कौन है?`
        : `ਇੱਕ ${context.group} ਵਿੱਚ ਕੁੱਲ ${evidence.total} ${context.members} ਹਨ। ${firstName} ${rank(evidence.firstRankFromStart, 'START')} ਹੈ ਅਤੇ ${secondName} ${rank(evidence.secondRankFromEnd, 'END')} ਹੈ। ${end} ਦੇ ਵੱਧ ਨੇੜੇ ਕੌਣ ਹੈ?`;
    }
    case 'EXACT_TOTAL_OR_INDETERMINATE': {
      const between = betweenClause(evidence.betweenCount, context, locale);
      return hi
        ? `${firstName} ${rank(evidence.firstRankFromStart, 'START')} है और ${secondName} ${rank(evidence.secondRankFromEnd, 'END')} है। ${between}, लेकिन दोनों का आपसी क्रम नहीं बताया गया है। ${context.group} में कुल कितने ${context.members} हैं?`
        : `${firstName} ${rank(evidence.firstRankFromStart, 'START')} ਹੈ ਅਤੇ ${secondName} ${rank(evidence.secondRankFromEnd, 'END')} ਹੈ। ${between}, ਪਰ ਦੋਵਾਂ ਦਾ ਆਪਸੀ ਕ੍ਰਮ ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ। ${context.group} ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ${context.members} ਹਨ?`;
    }
    case 'PROPOSED_TOTAL_ORDER_STATUS': {
      const between = betweenClause(evidence.betweenCount, context, locale);
      return hi
        ? `${firstName} ${rank(evidence.firstRankFromStart, 'START')} है और ${secondName} ${rank(evidence.secondRankFromEnd, 'END')} है। ${between}। यदि ${context.group} में कुल ${evidence.proposedTotal} ${context.members} हों, तो कौन-सा निष्कर्ष सही है?`
        : `${firstName} ${rank(evidence.firstRankFromStart, 'START')} ਹੈ ਅਤੇ ${secondName} ${rank(evidence.secondRankFromEnd, 'END')} ਹੈ। ${between}। ਜੇ ${context.group} ਵਿੱਚ ਕੁੱਲ ${evidence.proposedTotal} ${context.members} ਹੋਣ, ਤਾਂ ਕਿਹੜਾ ਨਤੀਜਾ ਸਹੀ ਹੈ?`;
    }
  }
}

function calculationForEvidence(
  question: RnkCp002PermanentQuestion,
  locale: RnkCp002LocalizedLocale,
  firstName: string,
  secondName: string,
  localizedAnswer: string | number,
): LocalizedExplanation {
  const evidence = question.displayedEvidence;
  const context = contextFor(question.contextId, locale);
  const hi = locale === 'hi-IN';
  const answer = String(localizedAnswer);
  let keyRule: string;
  let steps: string[];
  let shortcut: string;

  switch (evidence.kind) {
    case 'SAME_END_TWO_RANKS': {
      const gap = Math.abs(evidence.firstRank - evidence.secondRank);
      const between = gap - 1;
      if (evidence.requested === 'BETWEEN_COUNT') {
        keyRule = hi ? 'एक ही छोर से दिए दो स्थानों के बीच लोगों की संख्या = दोनों स्थानों का अंतर − 1।' : 'ਇੱਕੋ ਸਿਰੇ ਤੋਂ ਦਿੱਤੇ ਦੋ ਸਥਾਨਾਂ ਦੇ ਵਿਚਕਾਰ ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ = ਦੋਵਾਂ ਸਥਾਨਾਂ ਦਾ ਅੰਤਰ − 1।';
        steps = [
          hi ? `स्थान-अंतर = |${evidence.firstRank} - ${evidence.secondRank}| = ${gap}।` : `ਸਥਾਨ ਅੰਤਰ = |${evidence.firstRank} - ${evidence.secondRank}| = ${gap}।`,
          hi ? `बीच की संख्या = ${gap} - 1 = ${between}।` : `ਵਿਚਕਾਰਲੀ ਗਿਣਤੀ = ${gap} - 1 = ${between}।`,
          hi ? `अतः उत्तर ${answer} है।` : `ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।`,
        ];
        shortcut = hi ? 'एक ही छोर के स्थान हों तो सीधे बड़ा स्थान − छोटा स्थान − 1 करें।' : 'ਇੱਕੋ ਸਿਰੇ ਦੇ ਸਥਾਨ ਹੋਣ ਤਾਂ ਸਿੱਧਾ ਵੱਡਾ ਸਥਾਨ − ਛੋਟਾ ਸਥਾਨ − 1 ਕਰੋ।';
      } else {
        keyRule = hi ? 'एक ही छोर से दिए दो स्थानों का स्थान-अंतर उनके स्थानों का परिमाणात्मक अंतर है।' : 'ਇੱਕੋ ਸਿਰੇ ਤੋਂ ਦਿੱਤੇ ਦੋ ਸਥਾਨਾਂ ਦਾ ਅੰਤਰ ਉਨ੍ਹਾਂ ਸਥਾਨਾਂ ਦਾ ਪਰਮ ਅੰਤਰ ਹੈ।';
        steps = [hi ? `स्थान-अंतर = |${evidence.firstRank} - ${evidence.secondRank}| = ${gap}।` : `ਸਥਾਨ ਅੰਤਰ = |${evidence.firstRank} - ${evidence.secondRank}| = ${gap}।`, hi ? `यहाँ 1 घटाना नहीं है, क्योंकि पूछा गया मान स्थान-अंतर है।` : `ਇੱਥੇ 1 ਘਟਾਉਣਾ ਨਹੀਂ ਹੈ, ਕਿਉਂਕਿ ਪੁੱਛਿਆ ਮਾਨ ਸਥਾਨ ਅੰਤਰ ਹੈ।`, hi ? `अतः उत्तर ${answer} है।` : `ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।`];
        shortcut = hi ? 'स्थान-अंतर के लिए बस बड़ा स्थान − छोटा स्थान करें।' : 'ਸਥਾਨ ਅੰਤਰ ਲਈ ਸਿਰਫ਼ ਵੱਡਾ ਸਥਾਨ − ਛੋਟਾ ਸਥਾਨ ਕਰੋ।';
      }
      break;
    }
    case 'SECOND_RANK_FROM_RELATIVE_OFFSET': {
      const adds = (evidence.side === 'START' && evidence.direction === 'TOWARD_END') || (evidence.side === 'END' && evidence.direction === 'TOWARD_START');
      const result = evidence.firstRank + (adds ? evidence.offset : -evidence.offset);
      keyRule = hi ? 'जिस छोर से स्थान गिने जा रहे हैं, उस दिशा में जाने पर स्थान संख्या घटती है और विपरीत दिशा में बढ़ती है।' : 'ਜਿਸ ਸਿਰੇ ਤੋਂ ਸਥਾਨ ਗਿਣੇ ਜਾ ਰਹੇ ਹਨ, ਉਸ ਸਿਰੇ ਵੱਲ ਜਾਣ ਨਾਲ ਸਥਾਨ ਸੰਖਿਆ ਘਟਦੀ ਹੈ ਅਤੇ ਉਲਟੀ ਦਿਸ਼ਾ ਵੱਲ ਵੱਧਦੀ ਹੈ।';
      steps = [hi ? `दिया स्थान = ${evidence.firstRank}, स्थान-अंतर = ${evidence.offset}।` : `ਦਿੱਤਾ ਸਥਾਨ = ${evidence.firstRank}, ਸਥਾਨ ਅੰਤਰ = ${evidence.offset}।`, hi ? `दिशा के अनुसार ${adds ? 'जोड़ें' : 'घटाएँ'}: ${evidence.firstRank} ${adds ? '+' : '-'} ${evidence.offset} = ${result}।` : `ਦਿਸ਼ਾ ਅਨੁਸਾਰ ${adds ? 'ਜੋੜੋ' : 'ਘਟਾਓ'}: ${evidence.firstRank} ${adds ? '+' : '-'} ${evidence.offset} = ${result}।`, hi ? `अतः ${secondName} का स्थान ${answer} है।` : `ਇਸ ਲਈ ${secondName} ਦਾ ਸਥਾਨ ${answer} ਹੈ।`];
      shortcut = hi ? 'पहले तय करें कि स्थान संख्या बढ़ेगी या घटेगी, फिर सीधे अंतर जोड़ें/घटाएँ।' : 'ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਸਥਾਨ ਸੰਖਿਆ ਵੱਧੇਗੀ ਜਾਂ ਘਟੇਗੀ, ਫਿਰ ਅੰਤਰ ਸਿੱਧਾ ਜੋੜੋ/ਘਟਾਓ।';
      break;
    }
    case 'BETWEEN_FROM_MIXED_END_RANKS': {
      const secondStart = evidence.total - evidence.secondRankFromEnd + 1;
      const between = Math.abs(evidence.firstRankFromStart - secondStart) - 1;
      keyRule = hi ? 'विपरीत छोर के स्थान को पहले उसी छोर में बदलें, फिर दोनों स्थानों का अंतर लेकर 1 घटाएँ।' : 'ਉਲਟ ਸਿਰੇ ਦੇ ਸਥਾਨ ਨੂੰ ਪਹਿਲਾਂ ਇੱਕੋ ਸਿਰੇ ਵਿੱਚ ਬਦਲੋ, ਫਿਰ ਦੋਵਾਂ ਸਥਾਨਾਂ ਦਾ ਅੰਤਰ ਲੈ ਕੇ 1 ਘਟਾਓ।';
      steps = [hi ? `${secondName} का ${context.startRank} स्थान = ${evidence.total} - ${evidence.secondRankFromEnd} + 1 = ${secondStart}।` : `${secondName} ਦਾ ${context.startRank} ਸਥਾਨ = ${evidence.total} - ${evidence.secondRankFromEnd} + 1 = ${secondStart}।`, hi ? `बीच की संख्या = |${evidence.firstRankFromStart} - ${secondStart}| - 1 = ${between}।` : `ਵਿਚਕਾਰਲੀ ਗਿਣਤੀ = |${evidence.firstRankFromStart} - ${secondStart}| - 1 = ${between}।`, hi ? `अतः उत्तर ${answer} है।` : `ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।`];
      shortcut = hi ? 'मिश्रित छोर: पहले एक छोर में बदलें, फिर अंतर − 1।' : 'ਮਿਸ਼ਰਤ ਸਿਰੇ: ਪਹਿਲਾਂ ਇੱਕੋ ਸਿਰੇ ਵਿੱਚ ਬਦਲੋ, ਫਿਰ ਅੰਤਰ − 1।';
      break;
    }
    case 'TOTAL_FROM_MIXED_END_RANKS_KNOWN_ORDER': {
      const result = evidence.direction === 'TOWARD_END'
        ? evidence.firstRankFromStart + evidence.secondRankFromEnd + evidence.betweenCount
        : evidence.firstRankFromStart + evidence.secondRankFromEnd - evidence.betweenCount - 2;
      const formula = evidence.direction === 'TOWARD_END'
        ? `${evidence.firstRankFromStart} + ${evidence.secondRankFromEnd} + ${evidence.betweenCount}`
        : `${evidence.firstRankFromStart} + ${evidence.secondRankFromEnd} - ${evidence.betweenCount} - 2`;
      keyRule = hi ? 'मिश्रित छोरों में कुल संख्या का सूत्र दोनों व्यक्तियों के आपसी क्रम पर निर्भर करता है।' : 'ਮਿਸ਼ਰਤ ਸਿਰਿਆਂ ਵਿੱਚ ਕੁੱਲ ਗਿਣਤੀ ਦਾ ਫਾਰਮੂਲਾ ਦੋਵਾਂ ਵਿਅਕਤੀਆਂ ਦੇ ਆਪਸੀ ਕ੍ਰਮ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ।';
      steps = [hi ? `दिया आपसी क्रम तय करता है कि कौन-सी शाखा लागू होगी।` : `ਦਿੱਤਾ ਆਪਸੀ ਕ੍ਰਮ ਤੈਅ ਕਰਦਾ ਹੈ ਕਿ ਕਿਹੜੀ ਸ਼ਾਖਾ ਲਾਗੂ ਹੋਵੇਗੀ।`, hi ? `कुल = ${formula} = ${result}।` : `ਕੁੱਲ = ${formula} = ${result}।`, hi ? `अतः कुल संख्या ${answer} है।` : `ਇਸ ਲਈ ਕੁੱਲ ਗਿਣਤੀ ${answer} ਹੈ।`];
      shortcut = hi ? 'क्रम देखकर सही मिश्रित-छोर शाखा चुनें; दोनों सूत्रों को मिलाएँ नहीं।' : 'ਕ੍ਰਮ ਦੇਖ ਕੇ ਸਹੀ ਮਿਸ਼ਰਤ-ਸਿਰਾ ਸ਼ਾਖਾ ਚੁਣੋ; ਦੋਵੇਂ ਫਾਰਮੂਲੇ ਨਾ ਮਿਲਾਓ।';
      break;
    }
    case 'EXTREME_TOTAL_FROM_MIXED_END_RANKS_UNKNOWN_ORDER': {
      const high = evidence.firstRankFromStart + evidence.secondRankFromEnd + evidence.betweenCount;
      const low = evidence.firstRankFromStart + evidence.secondRankFromEnd - evidence.betweenCount - 2;
      const chosen = evidence.requestedExtreme === 'MAXIMUM' ? high : low;
      keyRule = hi ? 'आपसी क्रम अज्ञात हो तो दोनों क्रम-शाखाओं की कुल संख्याएँ निकालें; अधिकतम/न्यूनतम के अनुसार उपयुक्त मान चुनें।' : 'ਆਪਸੀ ਕ੍ਰਮ ਅਣਜਾਣ ਹੋਵੇ ਤਾਂ ਦੋਵੇਂ ਕ੍ਰਮ-ਸ਼ਾਖਾਵਾਂ ਦੀਆਂ ਕੁੱਲ ਗਿਣਤੀਆਂ ਕੱਢੋ; ਵੱਧ ਤੋਂ ਵੱਧ/ਘੱਟ ਤੋਂ ਘੱਟ ਅਨੁਸਾਰ ਮਾਨ ਚੁਣੋ।';
      steps = [hi ? `ऊँची शाखा = ${evidence.firstRankFromStart} + ${evidence.secondRankFromEnd} + ${evidence.betweenCount} = ${high}।` : `ਉੱਚੀ ਸ਼ਾਖਾ = ${evidence.firstRankFromStart} + ${evidence.secondRankFromEnd} + ${evidence.betweenCount} = ${high}।`, hi ? `निचली शाखा = ${evidence.firstRankFromStart} + ${evidence.secondRankFromEnd} - ${evidence.betweenCount} - 2 = ${low}।` : `ਹੇਠਲੀ ਸ਼ਾਖਾ = ${evidence.firstRankFromStart} + ${evidence.secondRankFromEnd} - ${evidence.betweenCount} - 2 = ${low}।`, hi ? `माँगा गया ${evidence.requestedExtreme === 'MAXIMUM' ? 'अधिकतम' : 'न्यूनतम'} मान = ${chosen}; अतः उत्तर ${answer} है।` : `ਮੰਗਿਆ ${evidence.requestedExtreme === 'MAXIMUM' ? 'ਵੱਧ ਤੋਂ ਵੱਧ' : 'ਘੱਟ ਤੋਂ ਘੱਟ'} ਮਾਨ = ${chosen}; ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।`];
      shortcut = hi ? 'दोनों शाखाएँ निकालें और सीधे माँगा गया चरम मान चुनें।' : 'ਦੋਵੇਂ ਸ਼ਾਖਾਵਾਂ ਕੱਢੋ ਅਤੇ ਮੰਗਿਆ ਚਰਮ ਮਾਨ ਸਿੱਧਾ ਚੁਣੋ।';
      break;
    }
    case 'POSITION_GAP_MIXED_END': {
      const secondStart = evidence.total - evidence.secondRankFromEnd + 1;
      const gap = Math.abs(evidence.firstRankFromStart - secondStart);
      keyRule = hi ? 'मिश्रित छोर के स्थानों को एक ही छोर में बदलकर उनका परिमाणात्मक अंतर लें; स्थान-अंतर में 1 नहीं घटता।' : 'ਮਿਸ਼ਰਤ ਸਿਰਿਆਂ ਦੇ ਸਥਾਨਾਂ ਨੂੰ ਇੱਕੋ ਸਿਰੇ ਵਿੱਚ ਬਦਲ ਕੇ ਪਰਮ ਅੰਤਰ ਲਵੋ; ਸਥਾਨ ਅੰਤਰ ਵਿੱਚ 1 ਨਹੀਂ ਘਟਦਾ।';
      steps = [hi ? `${secondName} का ${context.startRank} स्थान = ${evidence.total} - ${evidence.secondRankFromEnd} + 1 = ${secondStart}।` : `${secondName} ਦਾ ${context.startRank} ਸਥਾਨ = ${evidence.total} - ${evidence.secondRankFromEnd} + 1 = ${secondStart}।`, hi ? `स्थान-अंतर = |${evidence.firstRankFromStart} - ${secondStart}| = ${gap}।` : `ਸਥਾਨ ਅੰਤਰ = |${evidence.firstRankFromStart} - ${secondStart}| = ${gap}।`, hi ? `अतः उत्तर ${answer} है।` : `ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।`];
      shortcut = hi ? 'पहले एक छोर में बदलें, फिर सीधा अंतर लें।' : 'ਪਹਿਲਾਂ ਇੱਕੋ ਸਿਰੇ ਵਿੱਚ ਬਦਲੋ, ਫਿਰ ਸਿੱਧਾ ਅੰਤਰ ਲਵੋ।';
      break;
    }
    case 'OFFSET_FROM_SAME_END': {
      const gap = Math.abs(evidence.firstRank - evidence.secondRank);
      keyRule = hi ? 'एक ही छोर से दिए स्थानों का ऑफसेट उनके स्थानों का परिमाणात्मक अंतर है।' : 'ਇੱਕੋ ਸਿਰੇ ਤੋਂ ਦਿੱਤੇ ਸਥਾਨਾਂ ਦਾ ਅੰਤਰ ਉਨ੍ਹਾਂ ਸਥਾਨਾਂ ਦਾ ਪਰਮ ਅੰਤਰ ਹੈ।';
      steps = [hi ? `स्थान-अंतर = |${evidence.firstRank} - ${evidence.secondRank}| = ${gap}।` : `ਸਥਾਨ ਅੰਤਰ = |${evidence.firstRank} - ${evidence.secondRank}| = ${gap}।`, hi ? 'यहाँ बीच के व्यक्तियों की संख्या नहीं पूछी गई, इसलिए 1 नहीं घटेगा।' : 'ਇੱਥੇ ਵਿਚਕਾਰਲੇ ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ ਨਹੀਂ ਪੁੱਛੀ ਗਈ, ਇਸ ਲਈ 1 ਨਹੀਂ ਘਟੇਗਾ।', hi ? `अतः उत्तर ${answer} है।` : `ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।`];
      shortcut = hi ? 'एक ही छोर का ऑफसेट = बड़ा स्थान − छोटा स्थान।' : 'ਇੱਕੋ ਸਿਰੇ ਦਾ ਅੰਤਰ = ਵੱਡਾ ਸਥਾਨ − ਛੋਟਾ ਸਥਾਨ।';
      break;
    }
    case 'TARGET_RANK_FROM_BETWEEN': {
      const separation = evidence.betweenCount + 1;
      const adds = (evidence.side === 'START' && evidence.direction === 'TOWARD_END') || (evidence.side === 'END' && evidence.direction === 'TOWARD_START');
      const target = evidence.referenceRank + (adds ? separation : -separation);
      keyRule = hi ? 'बीच के लोगों की संख्या में 1 जोड़कर स्थान-अंतर बनाएँ, फिर दिशा के अनुसार संदर्भ स्थान में जोड़ें या घटाएँ।' : 'ਵਿਚਕਾਰਲੇ ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ ਵਿੱਚ 1 ਜੋੜ ਕੇ ਸਥਾਨ ਅੰਤਰ ਬਣਾਓ, ਫਿਰ ਦਿਸ਼ਾ ਅਨੁਸਾਰ ਸੰਦਰਭ ਸਥਾਨ ਵਿੱਚ ਜੋੜੋ ਜਾਂ ਘਟਾਓ।';
      steps = [hi ? `स्थान-अंतर = ${evidence.betweenCount} + 1 = ${separation}।` : `ਸਥਾਨ ਅੰਤਰ = ${evidence.betweenCount} + 1 = ${separation}।`, hi ? `दिशा के अनुसार ${evidence.referenceRank} ${adds ? '+' : '-'} ${separation} = ${target}।` : `ਦਿਸ਼ਾ ਅਨੁਸਾਰ ${evidence.referenceRank} ${adds ? '+' : '-'} ${separation} = ${target}।`, hi ? `अतः ${secondName} का स्थान ${answer} है।` : `ਇਸ ਲਈ ${secondName} ਦਾ ਸਥਾਨ ${answer} ਹੈ।`];
      shortcut = hi ? 'बीच की संख्या + 1 = वास्तविक स्थान-अंतर; फिर दिशा जाँचें।' : 'ਵਿਚਕਾਰਲੀ ਗਿਣਤੀ + 1 = ਅਸਲ ਸਥਾਨ ਅੰਤਰ; ਫਿਰ ਦਿਸ਼ਾ ਜਾਂਚੋ।';
      break;
    }
    case 'COMPARE_SAME_END': {
      const requested = requestedEnd(evidence);
      const supplied = evidence.side;
      const smallerWins = requested === supplied;
      const firstWins = smallerWins ? evidence.firstRank < evidence.secondRank : evidence.firstRank > evidence.secondRank;
      const winner = firstWins ? firstName : secondName;
      keyRule = hi ? 'एक ही छोर से स्थान दिए हों तो उसी छोर के निकट छोटा स्थान और विपरीत छोर के निकट बड़ा स्थान होता है।' : 'ਇੱਕੋ ਸਿਰੇ ਤੋਂ ਸਥਾਨ ਦਿੱਤੇ ਹੋਣ ਤਾਂ ਉਸੇ ਸਿਰੇ ਦੇ ਨੇੜੇ ਛੋਟਾ ਸਥਾਨ ਅਤੇ ਉਲਟ ਸਿਰੇ ਦੇ ਨੇੜੇ ਵੱਡਾ ਸਥਾਨ ਹੁੰਦਾ ਹੈ।';
      steps = [hi ? `दोनों स्थान एक ही छोर से हैं: ${evidence.firstRank} और ${evidence.secondRank}।` : `ਦੋਵੇਂ ਸਥਾਨ ਇੱਕੋ ਸਿਰੇ ਤੋਂ ਹਨ: ${evidence.firstRank} ਅਤੇ ${evidence.secondRank}।`, hi ? `माँगा छोर ${requested === supplied ? 'यही' : 'विपरीत'} है, इसलिए ${smallerWins ? 'छोटा' : 'बड़ा'} स्थान चुनें।` : `ਮੰਗਿਆ ਸਿਰਾ ${requested === supplied ? 'ਇਹੀ' : 'ਉਲਟ'} ਹੈ, ਇਸ ਲਈ ${smallerWins ? 'ਛੋਟਾ' : 'ਵੱਡਾ'} ਸਥਾਨ ਚੁਣੋ।`, hi ? `इसलिए ${winner} अधिक निकट है; सही उत्तर ${answer} है।` : `ਇਸ ਲਈ ${winner} ਵੱਧ ਨੇੜੇ ਹੈ; ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`];
      shortcut = hi ? 'एक ही छोर: उसी छोर के लिए छोटा, विपरीत छोर के लिए बड़ा स्थान।' : 'ਇੱਕੋ ਸਿਰਾ: ਉਸੇ ਸਿਰੇ ਲਈ ਛੋਟਾ, ਉਲਟ ਸਿਰੇ ਲਈ ਵੱਡਾ ਸਥਾਨ।';
      break;
    }
    case 'COMPARE_MIXED_END': {
      const secondStart = evidence.total - evidence.secondRankFromEnd + 1;
      const towardStart = evidence.requested === 'TOWARD_START';
      const firstWins = towardStart ? evidence.firstRankFromStart < secondStart : evidence.firstRankFromStart > secondStart;
      const winner = firstWins ? firstName : secondName;
      keyRule = hi ? 'विपरीत छोरों के स्थानों की तुलना करने से पहले दोनों को एक ही छोर में बदलना आवश्यक है।' : 'ਉਲਟ ਸਿਰਿਆਂ ਦੇ ਸਥਾਨਾਂ ਦੀ ਤੁਲਨਾ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਦੋਵਾਂ ਨੂੰ ਇੱਕੋ ਸਿਰੇ ਵਿੱਚ ਬਦਲਣਾ ਲਾਜ਼ਮੀ ਹੈ।';
      steps = [hi ? `${secondName} का ${context.startRank} स्थान = ${evidence.total} - ${evidence.secondRankFromEnd} + 1 = ${secondStart}।` : `${secondName} ਦਾ ${context.startRank} ਸਥਾਨ = ${evidence.total} - ${evidence.secondRankFromEnd} + 1 = ${secondStart}।`, hi ? `अब समान छोर से ${firstName}: ${evidence.firstRankFromStart}, ${secondName}: ${secondStart} की तुलना करें।` : `ਹੁਣ ਇੱਕੋ ਸਿਰੇ ਤੋਂ ${firstName}: ${evidence.firstRankFromStart}, ${secondName}: ${secondStart} ਦੀ ਤੁਲਨਾ ਕਰੋ।`, hi ? `माँगे छोर के अनुसार ${winner} अधिक निकट है; सही उत्तर ${answer} है।` : `ਮੰਗੇ ਸਿਰੇ ਅਨੁਸਾਰ ${winner} ਵੱਧ ਨੇੜੇ ਹੈ; ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`];
      shortcut = hi ? 'पहले दोनों स्थान एक ही छोर में लाएँ, फिर तुलना करें।' : 'ਪਹਿਲਾਂ ਦੋਵੇਂ ਸਥਾਨ ਇੱਕੋ ਸਿਰੇ ਵਿੱਚ ਲਿਆਓ, ਫਿਰ ਤੁਲਨਾ ਕਰੋ।';
      break;
    }
    case 'EXACT_TOTAL_OR_INDETERMINATE': {
      keyRule = hi ? 'आपसी क्रम न दिया हो तो उच्च और उलटी दोनों कुल-शाखाएँ जाँचें; दूसरी शाखा केवल तभी मान्य है जब कोई स्थान 1 से पहले न जाए।' : 'ਆਪਸੀ ਕ੍ਰਮ ਨਾ ਦਿੱਤਾ ਹੋਵੇ ਤਾਂ ਉੱਚੀ ਅਤੇ ਉਲਟੀ ਦੋਵੇਂ ਕੁੱਲ-ਸ਼ਾਖਾਵਾਂ ਜਾਂਚੋ; ਦੂਜੀ ਸ਼ਾਖਾ ਤਦੋਂ ਹੀ ਮੰਨਣਯੋਗ ਹੈ ਜਦੋਂ ਕੋਈ ਸਥਾਨ 1 ਤੋਂ ਪਹਿਲਾਂ ਨਾ ਜਾਵੇ।';
      steps = [hi ? `उच्च शाखा = ${evidence.firstRankFromStart} + ${evidence.secondRankFromEnd} + ${evidence.betweenCount} = ${evidence.highTotal}।` : `ਉੱਚੀ ਸ਼ਾਖਾ = ${evidence.firstRankFromStart} + ${evidence.secondRankFromEnd} + ${evidence.betweenCount} = ${evidence.highTotal}।`, hi ? `उलटी शाखा = ${evidence.firstRankFromStart} + ${evidence.secondRankFromEnd} - ${evidence.betweenCount} - 2 = ${evidence.lowTotal}; यह ${evidence.lowTotalValid ? 'मान्य' : 'अमान्य'} है।` : `ਉਲਟੀ ਸ਼ਾਖਾ = ${evidence.firstRankFromStart} + ${evidence.secondRankFromEnd} - ${evidence.betweenCount} - 2 = ${evidence.lowTotal}; ਇਹ ${evidence.lowTotalValid ? 'ਮੰਨਣਯੋਗ' : 'ਅਮੰਨਣਯੋਗ'} ਹੈ।`, evidence.lowTotalValid ? (hi ? `दो अलग कुल मान संभव हैं, इसलिए कुल निर्धारित नहीं किया जा सकता।` : `ਦੋ ਵੱਖ ਕੁੱਲ ਮਾਨ ਸੰਭਵ ਹਨ, ਇਸ ਲਈ ਕੁੱਲ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।`) : (hi ? `केवल ${evidence.highTotal} मान्य है, इसलिए कुल ${answer} है।` : `ਸਿਰਫ਼ ${evidence.highTotal} ਮੰਨਣਯੋਗ ਹੈ, ਇਸ ਲਈ ਕੁੱਲ ${answer} ਹੈ।`)];
      shortcut = hi ? 'दोनों क्रम-शाखाएँ निकालें; यदि दोनों मान्य हैं तो सटीक कुल निर्धारित नहीं होगा।' : 'ਦੋਵੇਂ ਕ੍ਰਮ-ਸ਼ਾਖਾਵਾਂ ਕੱਢੋ; ਜੇ ਦੋਵੇਂ ਮੰਨਣਯੋਗ ਹਨ ਤਾਂ ਸਹੀ ਕੁੱਲ ਨਿਰਧਾਰਤ ਨਹੀਂ ਹੋਵੇਗਾ।';
      break;
    }
    case 'PROPOSED_TOTAL_ORDER_STATUS': {
      const firstStatus = localizeOrderStatus(FIRST_NEAR_START, firstName, secondName, context, locale);
      const secondStatus = localizeOrderStatus(SECOND_NEAR_START, firstName, secondName, context, locale);
      keyRule = hi ? 'प्रस्तावित कुल संख्या तभी संभव है जब वह किसी मान्य क्रम-शाखा की कुल संख्या से मेल खाए।' : 'ਪ੍ਰਸਤਾਵਿਤ ਕੁੱਲ ਗਿਣਤੀ ਤਦੋਂ ਹੀ ਸੰਭਵ ਹੈ ਜਦੋਂ ਉਹ ਕਿਸੇ ਮੰਨਣਯੋਗ ਕ੍ਰਮ-ਸ਼ਾਖਾ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਨਾਲ ਮਿਲੇ।';
      steps = [hi ? `यदि ${firstStatus}, तो कुल = ${evidence.highTotal}।` : `ਜੇ ${firstStatus}, ਤਾਂ ਕੁੱਲ = ${evidence.highTotal}।`, hi ? `यदि ${secondStatus}, तो कुल = ${evidence.lowTotal}; यह शाखा ${evidence.lowTotalValid ? 'मान्य' : 'अमान्य'} है।` : `ਜੇ ${secondStatus}, ਤਾਂ ਕੁੱਲ = ${evidence.lowTotal}; ਇਹ ਸ਼ਾਖਾ ${evidence.lowTotalValid ? 'ਮੰਨਣਯੋਗ' : 'ਅਮੰਨਣਯੋਗ'} ਹੈ।`, hi ? `प्रस्तावित कुल ${evidence.proposedTotal} से मिलान करने पर सही निष्कर्ष: ${answer}।` : `ਪ੍ਰਸਤਾਵਿਤ ਕੁੱਲ ${evidence.proposedTotal} ਨਾਲ ਮਿਲਾਉਣ ਤੇ ਸਹੀ ਨਤੀਜਾ: ${answer}।`];
      shortcut = hi ? 'प्रस्तावित कुल को दोनों शाखा-मानों से मिलाएँ; किसी से न मिले तो वह असंभव है।' : 'ਪ੍ਰਸਤਾਵਿਤ ਕੁੱਲ ਨੂੰ ਦੋਵੇਂ ਸ਼ਾਖਾ-ਮਾਨਾਂ ਨਾਲ ਮਿਲਾਓ; ਕਿਸੇ ਨਾਲ ਨਾ ਮਿਲੇ ਤਾਂ ਉਹ ਅਸੰਭਵ ਹੈ।';
      break;
    }
  }

  const conclusion = hi ? `अतः सही उत्तर ${answer} है।` : `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`;
  return {
    keyRule,
    stepByStepSolution: steps,
    examSpeedShortcut: shortcut,
    optionAnalysis: [],
    conclusion,
  };
}

function optionExplanation(
  misconceptionId: string,
  correct: boolean,
  answer: string | number,
  locale: RnkCp002LocalizedLocale,
): string {
  const value = String(answer);
  if (correct) return locale === 'hi-IN' ? 'यह विकल्प दिए गए सभी स्थान-संबंधों को संतुष्ट करता है।' : 'ਇਹ ਵਿਕਲਪ ਦਿੱਤੇ ਸਾਰੇ ਸਥਾਨ-ਸੰਬੰਧਾਂ ਨੂੰ ਪੂਰਾ ਕਰਦਾ ਹੈ।';
  const betweenVsGap = /BETWEEN|ENDPOINT|OFFSET|ADDED_ONE|ADDED_TWO/u.test(misconceptionId);
  const comparison = /COMPAR|REVERSED|EQUAL|COMMON_END|NORMALIZED/u.test(misconceptionId);
  const branch = /BRANCH|ORDER|TOTAL|INDETERMINATE|IMPOSSIBLE|CONTRACT/u.test(misconceptionId);
  if (betweenVsGap) return locale === 'hi-IN' ? `यह विकल्प स्थान-अंतर और बीच की संख्या के संबंध में गलत समायोजन करता है; सही उत्तर ${value} है।` : `ਇਹ ਵਿਕਲਪ ਸਥਾਨ ਅੰਤਰ ਅਤੇ ਵਿਚਕਾਰਲੀ ਗਿਣਤੀ ਦੇ ਸੰਬੰਧ ਵਿੱਚ ਗਲਤ ਸਮਾਯੋਜਨ ਕਰਦਾ ਹੈ; ਸਹੀ ਉੱਤਰ ${value} ਹੈ।`;
  if (comparison) return locale === 'hi-IN' ? `यह विकल्प छोर/दिशा की तुलना को गलत पढ़ता है; सही उत्तर ${value} है।` : `ਇਹ ਵਿਕਲਪ ਸਿਰੇ/ਦਿਸ਼ਾ ਦੀ ਤੁਲਨਾ ਗਲਤ ਪੜ੍ਹਦਾ ਹੈ; ਸਹੀ ਉੱਤਰ ${value} ਹੈ।`;
  if (branch) return locale === 'hi-IN' ? `यह विकल्प मान्य क्रम-शाखाओं की जाँच पूरी नहीं करता; सही उत्तर ${value} है।` : `ਇਹ ਵਿਕਲਪ ਮੰਨਣਯੋਗ ਕ੍ਰਮ-ਸ਼ਾਖਾਵਾਂ ਦੀ ਜਾਂਚ ਪੂਰੀ ਨਹੀਂ ਕਰਦਾ; ਸਹੀ ਉੱਤਰ ${value} ਹੈ।`;
  return locale === 'hi-IN' ? `यह विकल्प सभी दिए गए स्थान-संबंधों के साथ संगत नहीं है; सही उत्तर ${value} है।` : `ਇਹ ਵਿਕਲਪ ਦਿੱਤੇ ਸਾਰੇ ਸਥਾਨ-ਸੰਬੰਧਾਂ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ; ਸਹੀ ਉੱਤਰ ${value} ਹੈ।`;
}

function localizeOptions(
  question: RnkCp002PermanentQuestion,
  locale: RnkCp002LocalizedLocale,
  firstName: string,
  secondName: string,
  localizedAnswer: string | number,
): readonly LocalizedOption[] {
  if (question.reviewMetadata.canonicalOptionValues.length !== question.options.length) {
    throw new Error(`CP002 canonical option drift ${question.qlId}:${question.seed}`);
  }
  return question.options.map((option, index) => {
    const canonicalValue = question.reviewMetadata.canonicalOptionValues[index]!;
    const value = localizeCanonicalOutcome(canonicalValue, question, locale, firstName, secondName);
    return {
      value,
      label: String(value),
      misconceptionId: option.misconceptionId,
      explanation: optionExplanation(option.misconceptionId, index === question.correctIndex, localizedAnswer, locale),
    };
  });
}

export function rnkCp002CanonicalSemanticFingerprint(question: RnkCp002PermanentQuestion): string {
  return sha256({
    packageId: question.packageId,
    checkpointId: question.checkpointId,
    qlId: question.qlId,
    permanentQlId: question.permanentQlId,
    seed: question.seed,
    authorityId: question.authorityId,
    contextId: question.contextId,
    firstName: question.firstName,
    secondName: question.secondName,
    displayedEvidence: question.displayedEvidence,
    answerSemantic: question.answerSemantic,
    canonicalAnswer: question.reviewMetadata.canonicalAnswer,
    canonicalOptionValues: question.reviewMetadata.canonicalOptionValues,
    correctIndex: question.correctIndex,
    difficulty: question.difficulty,
    normalizedState: question.normalizedState,
    mathematicalFingerprint: question.mathematicalFingerprint,
    sourcePrototypeId: question.reviewMetadata.sourcePrototypeId,
  });
}

export function localizeRnkCp002PermanentQuestion(
  question: RnkCp002PermanentQuestion,
  locale: RnkCp002LocalizedLocale,
): RnkCp002LocalizedReviewQuestion {
  const firstName = localizedName(question.firstName, locale);
  const secondName = localizedName(question.secondName, locale);
  const answer = localizeCanonicalOutcome(
    question.reviewMetadata.canonicalAnswer,
    question,
    locale,
    firstName,
    secondName,
  );
  const stem = renderStem(question, locale, firstName, secondName);
  const options = localizeOptions(question, locale, firstName, secondName, answer);
  const baseExplanation = calculationForEvidence(question, locale, firstName, secondName, answer);
  const optionAnalysis = options.map((option, index) => locale === 'hi-IN'
    ? `विकल्प ${index + 1} (${option.label}): ${option.explanation}`
    : `ਵਿਕਲਪ ${index + 1} (${option.label}): ${option.explanation}`);
  const explanation = { ...baseExplanation, optionAnalysis };
  const canonicalSemanticFingerprint = rnkCp002CanonicalSemanticFingerprint(question);
  const localizationFingerprint = sha256({
    version: RNK_CP002_LOCALIZATION_REVIEW_VERSION,
    permanentQlId: question.permanentQlId,
    seed: question.seed,
    canonicalSemanticFingerprint,
    locale,
    firstName,
    secondName,
    stem,
    answer,
    options,
    explanation,
  });

  return {
    ...question,
    locale,
    canonicalLocale: 'en-IN',
    canonicalFirstName: question.firstName,
    canonicalSecondName: question.secondName,
    firstName,
    secondName,
    stem,
    answer,
    options,
    explanation,
    reviewMetadata: {
      ...question.reviewMetadata,
      localization: {
        version: RNK_CP002_LOCALIZATION_REVIEW_VERSION,
        locale,
        learnerTextLocalized: true,
        structuredEvidenceRendered: true,
        canonicalOutcomeLocalization: true,
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
      authority: RNK_CP002_LOCALIZATION_REVIEW_AUTHORITY,
      canonicalLocale: 'en-IN',
      locale,
      permanentQlId: question.permanentQlId,
      canonicalSemanticFingerprint,
      localizationFingerprint,
      semanticParity: 'EXECUTABLE_PROVED',
      learnerSurfaceSource: 'STRUCTURED_DISPLAYED_EVIDENCE',
      canonicalOutcomeSource: 'PERMANENT_REVIEW_METADATA',
      humanLanguageReviewRequired: true,
      multilingualFreezeGranted: false,
      productDeliveryUnlocked: false,
    },
  };
}

export function buildRnkCp002LocalizedReviewBank(
  locale: RnkCp002LocalizedLocale,
  seedsPerQl = 192,
): readonly RnkCp002LocalizedReviewQuestion[] {
  if (!Number.isInteger(seedsPerQl) || seedsPerQl <= 0) throw new Error(`Invalid CP002 seedsPerQl: ${seedsPerQl}`);
  return RNK_CP002_PERMANENT_QL_IDS.flatMap((qlId) =>
    Array.from({ length: seedsPerQl }, (_, seed) =>
      localizeRnkCp002PermanentQuestion(generateRnkCp002PermanentQuestion(qlId, seed), locale),
    ),
  );
}
