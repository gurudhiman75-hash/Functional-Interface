import { createHash } from 'node:crypto';

import {
  RNK_PERSON_POOL_V2,
  type RnkObjectLocale,
} from '../foundation/rnk-object-pool-v2';
import {
  RNK_CP003_NAMES,
  fromStartRank,
  toStartRank,
  type RnkMovementDirection,
  type RnkSide,
} from './cp003-model';
import type { RnkCp003PermanentQlId } from './cp003-consolidation';
import {
  RNK_CP003_PERMANENT_QL_IDS,
  generateRnkCp003PermanentQuestion,
} from './cp003-permanent-runtime';

export const RNK_CP003_LOCALIZATION_REVIEW_VERSION =
  'RNK_CP003_HI_PA_LOCALIZATION_REVIEW_V1' as const;
export const RNK_CP003_LOCALIZATION_REVIEW_AUTHORITY =
  'RNK_CP003_HI_PA_STRUCTURED_TRANSFORMATION_REVIEW_V1' as const;

export type RnkCp003LocalizedLocale = 'hi-IN' | 'pa-IN';

type AnyQuestion = Record<string, any>;
type AnyEvidence = Record<string, any> & { readonly kind: string };
type AnyOption = Record<string, any> & {
  readonly label: string;
  readonly misconceptionId: string;
  readonly explanation: string;
};

export type RnkCp003LocalizedReviewQuestion = AnyQuestion & {
  readonly locale: RnkCp003LocalizedLocale;
  readonly canonicalLocale: 'en-IN';
  readonly canonicalNames: readonly string[];
  readonly localizedNames: readonly string[];
  readonly stem: string;
  readonly answer: string | number;
  readonly options: readonly AnyOption[];
  readonly explanation: Readonly<{
    keyRule: string;
    stepByStepSolution: readonly string[];
    examSpeedShortcut: string;
    optionAnalysis: readonly string[];
    conclusion: string;
  }>;
  readonly localizationMetadata: Readonly<{
    version: typeof RNK_CP003_LOCALIZATION_REVIEW_VERSION;
    locale: RnkCp003LocalizedLocale;
    learnerTextLocalized: true;
    structuredEvidenceRendered: true;
    canonicalOutcomePreserved: true;
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
    authority: typeof RNK_CP003_LOCALIZATION_REVIEW_AUTHORITY;
    canonicalLocale: 'en-IN';
    locale: RnkCp003LocalizedLocale;
    permanentQlId: RnkCp003PermanentQlId;
    canonicalSemanticFingerprint: string;
    localizationFingerprint: string;
    semanticParity: 'EXECUTABLE_PROVED';
    learnerSurfaceSource: 'STRUCTURED_DISPLAYED_EVIDENCE';
    canonicalOutcomeSource: 'FROZEN_PERMANENT_RUNTIME';
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
  readonly startBoundary: string;
  readonly endBoundary: string;
  readonly towardStart: string;
  readonly towardEnd: string;
}

const HINDI_CONTEXTS: Readonly<Record<string, NativeContext>> = {
  MERIT_LIST: {
    group: 'योग्यता सूची',
    members: 'अभ्यर्थी',
    memberSingular: 'अभ्यर्थी',
    startRank: 'ऊपर से',
    endRank: 'नीचे से',
    startBoundary: 'ऊपरी सिरे',
    endBoundary: 'निचले सिरे',
    towardStart: 'ऊपर की ओर',
    towardEnd: 'नीचे की ओर',
  },
  HORIZONTAL_ROW: {
    group: 'पंक्ति',
    members: 'व्यक्ति',
    memberSingular: 'व्यक्ति',
    startRank: 'बाएँ से',
    endRank: 'दाएँ से',
    startBoundary: 'बाएँ छोर',
    endBoundary: 'दाएँ छोर',
    towardStart: 'बाएँ की ओर',
    towardEnd: 'दाएँ की ओर',
  },
  QUEUE: {
    group: 'कतार',
    members: 'व्यक्ति',
    memberSingular: 'व्यक्ति',
    startRank: 'आगे से',
    endRank: 'पीछे से',
    startBoundary: 'आगे वाले सिरे',
    endBoundary: 'पीछे वाले सिरे',
    towardStart: 'आगे की ओर',
    towardEnd: 'पीछे की ओर',
  },
  RACE_ORDER: {
    group: 'दौड़ का अंतिम क्रम',
    members: 'धावक',
    memberSingular: 'धावक',
    startRank: 'आगे से',
    endRank: 'पीछे से',
    startBoundary: 'आगे वाले सिरे',
    endBoundary: 'पीछे वाले सिरे',
    towardStart: 'आगे की ओर',
    towardEnd: 'पीछे की ओर',
  },
};

const PUNJABI_CONTEXTS: Readonly<Record<string, NativeContext>> = {
  MERIT_LIST: {
    group: 'ਯੋਗਤਾ ਸੂਚੀ',
    members: 'ਉਮੀਦਵਾਰ',
    memberSingular: 'ਉਮੀਦਵਾਰ',
    startRank: 'ਉੱਪਰੋਂ',
    endRank: 'ਹੇਠੋਂ',
    startBoundary: 'ਉੱਪਰਲੇ ਸਿਰੇ',
    endBoundary: 'ਹੇਠਲੇ ਸਿਰੇ',
    towardStart: 'ਉੱਪਰ ਵੱਲ',
    towardEnd: 'ਹੇਠਾਂ ਵੱਲ',
  },
  HORIZONTAL_ROW: {
    group: 'ਕਤਾਰ',
    members: 'ਵਿਅਕਤੀ',
    memberSingular: 'ਵਿਅਕਤੀ',
    startRank: 'ਖੱਬੇ ਪਾਸੋਂ',
    endRank: 'ਸੱਜੇ ਪਾਸੋਂ',
    startBoundary: 'ਖੱਬੇ ਸਿਰੇ',
    endBoundary: 'ਸੱਜੇ ਸਿਰੇ',
    towardStart: 'ਖੱਬੇ ਵੱਲ',
    towardEnd: 'ਸੱਜੇ ਵੱਲ',
  },
  QUEUE: {
    group: 'ਲਾਈਨ',
    members: 'ਵਿਅਕਤੀ',
    memberSingular: 'ਵਿਅਕਤੀ',
    startRank: 'ਅੱਗੋਂ',
    endRank: 'ਪਿੱਛੋਂ',
    startBoundary: 'ਅੱਗੇਲੇ ਸਿਰੇ',
    endBoundary: 'ਪਿੱਛੇਲੇ ਸਿਰੇ',
    towardStart: 'ਅੱਗੇ ਵੱਲ',
    towardEnd: 'ਪਿੱਛੇ ਵੱਲ',
  },
  RACE_ORDER: {
    group: 'ਦੌੜ ਦਾ ਅੰਤਿਮ ਕ੍ਰਮ',
    members: 'ਦੌੜਾਕ',
    memberSingular: 'ਦੌੜਾਕ',
    startRank: 'ਅੱਗੋਂ',
    endRank: 'ਪਿੱਛੋਂ',
    startBoundary: 'ਅੱਗੇਲੇ ਸਿਰੇ',
    endBoundary: 'ਪਿੱਛੇਲੇ ਸਿਰੇ',
    towardStart: 'ਅੱਗੇ ਵੱਲ',
    towardEnd: 'ਪਿੱਛੇ ਵੱਲ',
  },
};

function native(locale: RnkCp003LocalizedLocale, hi: string, pa: string): string {
  return locale === 'hi-IN' ? hi : pa;
}

function sha256(value: unknown): string {
  return createHash('sha256')
    .update(typeof value === 'string' ? value : JSON.stringify(value), 'utf8')
    .digest('hex');
}

function objectLocale(locale: RnkCp003LocalizedLocale): Exclude<RnkObjectLocale, 'en'> {
  return locale === 'hi-IN' ? 'hi' : 'pa';
}

function localizedName(canonicalName: string, locale: RnkCp003LocalizedLocale): string {
  const person = RNK_PERSON_POOL_V2.find((entry) => entry.names.en === canonicalName);
  if (!person) throw new Error(`CP003 name missing from RNK Object Pool V2: ${canonicalName}`);
  return person.names[objectLocale(locale)];
}

function canonicalNamesForQuestion(question: AnyQuestion): readonly string[] {
  if (typeof question.firstName === 'string') {
    return [question.firstName, question.secondName].filter((value): value is string => typeof value === 'string');
  }
  const pattern = new RegExp(`\\b(${RNK_CP003_NAMES.join('|')})\\b`, 'g');
  const matches = String(question.stem).match(pattern) ?? [];
  return matches.filter((name, index) => matches.indexOf(name) === index);
}

function contextFor(contextId: string, locale: RnkCp003LocalizedLocale): NativeContext {
  const context = locale === 'hi-IN' ? HINDI_CONTEXTS[contextId] : PUNJABI_CONTEXTS[contextId];
  if (!context) throw new Error(`Unknown CP003 context ${contextId}`);
  return context;
}

function ordinalPosition(value: number, locale: RnkCp003LocalizedLocale): string {
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

function sidePhrase(side: RnkSide, context: NativeContext): string {
  return side === 'START' ? context.startRank : context.endRank;
}

function boundaryPhrase(side: RnkSide, context: NativeContext): string {
  return side === 'START' ? context.startBoundary : context.endBoundary;
}

function rankPhrase(rank: number, side: RnkSide, context: NativeContext, locale: RnkCp003LocalizedLocale): string {
  return `${sidePhrase(side, context)} ${ordinalPosition(rank, locale)}`;
}

function movementClause(
  name: string,
  direction: RnkMovementDirection,
  distance: number,
  context: NativeContext,
  locale: RnkCp003LocalizedLocale,
): string {
  const directionText = direction === 'TOWARD_START' ? context.towardStart : context.towardEnd;
  return native(
    locale,
    `${name} की स्थिति ${directionText} ${distance} स्थान बदलती है`,
    `${name} ਦੀ ਸਥਿਤੀ ${directionText} ${distance} ਸਥਾਨ ਬਦਲਦੀ ਹੈ`,
  );
}

function membershipClause(
  kind: 'INSERT' | 'REMOVE',
  side: 'START' | 'END',
  count: number,
  context: NativeContext,
  locale: RnkCp003LocalizedLocale,
): string {
  const member = count === 1 ? context.memberSingular : context.members;
  const boundary = boundaryPhrase(side, context);
  if (locale === 'hi-IN') {
    if (kind === 'INSERT') return `${boundary} पर ${count} ${member} जुड़${count === 1 ? 'ता' : 'ते'} है${count === 1 ? '' : 'ं'}`;
    return `${boundary} से ${count} ${member} बाहर हो ${count === 1 ? 'जाता' : 'जाते'} है${count === 1 ? '' : 'ं'}`;
  }
  if (kind === 'INSERT') return `${boundary} ਉੱਤੇ ${count} ${member} ਸ਼ਾਮਲ ਹੁੰ${count === 1 ? 'ਦਾ' : 'ਦੇ'} ਹੈ`;
  return `${boundary} ਤੋਂ ${count} ${member} ਬਾਹਰ ਹੋ ਜਾਂ${count === 1 ? 'ਦਾ' : 'ਦੇ'} ਹੈ`;
}

function pairAnswer(answerKey: string, names: readonly string[]): string {
  const [first, second] = answerKey.split('|').map(Number);
  if (!Number.isInteger(first) || !Number.isInteger(second) || !names[0] || !names[1]) {
    throw new Error(`Invalid CP003 pair answer ${answerKey}`);
  }
  return `${names[0]}: ${first}; ${names[1]}: ${second}`;
}

function optionSemanticValue(option: AnyQuestion): string | number | undefined {
  return Object.prototype.hasOwnProperty.call(option, 'answerKey') ? option.answerKey : option.answer;
}

function localizeAnswer(question: AnyQuestion, names: readonly string[]): string | number {
  if (question.answerSemantic === 'RANK_PAIR') return pairAnswer(String(question.answerKey), names);
  return question.answer;
}

const HINDI_MISCONCEPTIONS: Readonly<Record<string, string>> = {
  CORRECT: 'यह विकल्प सभी दिए गए परिवर्तन सही क्रम में लागू करके माँगी गई दिशा से सही रैंक देता है',
  FORGOT_SHARED_PERSON_SUBTRACTION: 'विपरीत सिरों की रैंकों को जोड़ते समय साझा व्यक्ति को एक बार घटाया नहीं गया',
  USED_OLD_RANK_AFTER_INTERCHANGE: 'स्थान बदलने के बाद मिली नई स्थिति की जगह पुरानी रैंक का उपयोग किया गया',
  SUBTRACTED_OPPOSITE_END_RANKS: 'विपरीत सिरों की रैंकों को जोड़ने की जगह सीधे घटा दिया गया',
  MOVED_IN_WRONG_DIRECTION: 'दिए गए स्थान परिवर्तन को उलटी दिशा में लागू किया गया',
  USED_OLD_RANK_AFTER_MOVEMENT: 'स्थान परिवर्तन को अनदेखा करके पुरानी रैंक ही रखी गई',
  OFF_BY_ONE_BOUNDARY: 'एक अनावश्यक एक-स्थान समायोजन कर दिया गया',
  FORGOT_MOVEMENT_ENDPOINT: 'बदली हुई दोनों स्थितियों का पूरा अंतर लेने की जगह एक कम कर दिया गया',
  COUNTED_TARGET_TWICE: 'पार किए गए व्यक्तियों के साथ एक सिरा अतिरिक्त गिन लिया गया',
  USED_MIXED_END_RANKS_DIRECTLY: 'दोनों रैंकों को एक ही सिरे में बदलने से पहले सीधे घटा दिया गया',
  REAPPLIED_MOVEMENT_INSTEAD_OF_REVERSING: 'मूल रैंक निकालते समय परिवर्तन को उलटने की जगह दोबारा उसी दिशा में लागू किया गया',
  USED_FINAL_AS_ORIGINAL: 'अंतिम स्थिति को ही मूल स्थिति मान लिया गया',
  IGNORED_INSERTION_SHIFT: 'नए सदस्य के आने से लक्ष्य की रैंक पर पड़ने वाले प्रभाव को अनदेखा किया गया',
  SHIFTED_WITHOUT_POSITION_CHECK: 'नए या हटे सदस्य की लक्ष्य के सापेक्ष स्थिति जाँचे बिना रैंक बदल दी गई',
  SHIFTED_IN_WRONG_DIRECTION: 'लक्ष्य की रैंक को गलत दिशा में एक स्थान बदल दिया गया',
  USED_OLD_TOTAL_FOR_END_CONVERSION: 'विपरीत सिरे से रैंक बदलते समय पुरानी कुल संख्या का उपयोग किया गया',
  IGNORED_REMOVAL_SHIFT: 'किसी सदस्य के हटने से लक्ष्य की रैंक पर पड़ने वाले प्रभाव को अनदेखा किया गया',
  APPLIED_ONLY_FIRST_MOVEMENT: 'केवल पहला स्थान परिवर्तन लागू करके दूसरा छोड़ दिया गया',
  APPLIED_ONLY_SECOND_MOVEMENT: 'पहला स्थान परिवर्तन छोड़कर केवल दूसरा लागू किया गया',
  TREATED_BOTH_MOVES_AS_SAME_DIRECTION: 'दोनों परिवर्तनों की दिशाएँ अलग होने पर भी उन्हें एक ही दिशा का मान लिया गया',
  COLLISION_SAFE_NEARBY_VALUE: 'पास की संख्या चुनी गई है, पर वह पूरे परिवर्तन-क्रम से सिद्ध नहीं होती',
  USED_OLD_RANKS_AFTER_INTERCHANGE: 'दोनों पुरानी रैंकें ही रखी गईं और स्थान-विनिमय लागू नहीं किया गया',
  REVERSED_PERSON_LABELS: 'दो सही संख्याएँ निकाली गईं, लेकिन उन्हें गलत व्यक्तियों से जोड़ दिया गया',
  OFF_BY_ONE_BOTH_RANKS: 'दोनों रैंकों में अनावश्यक एक-स्थान की त्रुटि की गई',
  USED_FINAL_RANKS_AS_ORIGINAL: 'स्थान-विनिमय को उलटे बिना अंतिम रैंकों को ही मूल रैंक मान लिया गया',
  COLLISION_SAFE_NEARBY_PAIR: 'रैंकों की पास की जोड़ी चुनी गई है, पर वह विनिमय की स्थितियों से मेल नहीं खाती',
  IGNORED_OTHER_PERSON_MOVEMENT: 'दूसरे व्यक्ति के लक्ष्य को पार करने या न करने का प्रभाव अनदेखा किया गया',
  REPORTED_FINAL_AS_ORIGINAL: 'दूसरे व्यक्ति की चाल को उलटे बिना दिखाई गई अंतिम रैंक को ही मूल रैंक बताया गया',
  IGNORED_BOTH_TRANSFORMATIONS: 'दिखाई गई रैंक रखकर दोनों परिवर्तनों को अनदेखा कर दिया गया',
  OFF_BY_ONE_LOW: 'सही पुनर्गणना से एक स्थान पहले रुक गया',
  OFF_BY_ONE_HIGH: 'सही पुनर्गणना से एक स्थान आगे चला गया',
  REVERSED_REFERENCE_END: 'माँगे गए सिरे की जगह विपरीत सिरे से रैंक पढ़ी गई',
  NEARBY_VALID_RANK: 'रैंक मान्य सीमा में है, लेकिन पूरे परिवर्तन-क्रम से मेल नहीं खाती',
};

const PUNJABI_MISCONCEPTIONS: Readonly<Record<string, string>> = {
  CORRECT: 'ਇਹ ਵਿਕਲਪ ਸਾਰੇ ਦਿੱਤੇ ਬਦਲਾਅ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾ ਕੇ ਮੰਗੇ ਪਾਸੇ ਤੋਂ ਸਹੀ ਰੈਂਕ ਦਿੰਦਾ ਹੈ',
  FORGOT_SHARED_PERSON_SUBTRACTION: 'ਉਲਟ ਸਿਰਿਆਂ ਵਾਲੀਆਂ ਰੈਂਕਾਂ ਜੋੜਦੇ ਸਮੇਂ ਸਾਂਝੇ ਵਿਅਕਤੀ ਨੂੰ ਇੱਕ ਵਾਰ ਘਟਾਇਆ ਨਹੀਂ ਗਿਆ',
  USED_OLD_RANK_AFTER_INTERCHANGE: 'ਥਾਂ ਬਦਲਣ ਤੋਂ ਬਾਅਦ ਮਿਲੀ ਨਵੀਂ ਸਥਿਤੀ ਦੀ ਥਾਂ ਪੁਰਾਣੀ ਰੈਂਕ ਵਰਤੀ ਗਈ',
  SUBTRACTED_OPPOSITE_END_RANKS: 'ਉਲਟ ਸਿਰਿਆਂ ਵਾਲੀਆਂ ਰੈਂਕਾਂ ਨੂੰ ਜੋੜਨ ਦੀ ਥਾਂ ਸਿੱਧਾ ਘਟਾ ਦਿੱਤਾ ਗਿਆ',
  MOVED_IN_WRONG_DIRECTION: 'ਦਿੱਤਾ ਸਥਾਨ-ਬਦਲਾਅ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ ਲਗਾਇਆ ਗਿਆ',
  USED_OLD_RANK_AFTER_MOVEMENT: 'ਸਥਾਨ-ਬਦਲਾਅ ਨੂੰ ਅਣਡਿੱਠਾ ਕਰਕੇ ਪੁਰਾਣੀ ਰੈਂਕ ਹੀ ਰੱਖੀ ਗਈ',
  OFF_BY_ONE_BOUNDARY: 'ਬਿਨਾ ਲੋੜ ਇੱਕ ਸਥਾਨ ਦਾ ਵਾਧੂ ਸੋਧ ਕੀਤਾ ਗਿਆ',
  FORGOT_MOVEMENT_ENDPOINT: 'ਦੋ ਬਦਲੀਆਂ ਸਥਿਤੀਆਂ ਦਾ ਪੂਰਾ ਫਰਕ ਲੈਣ ਦੀ ਥਾਂ ਇੱਕ ਘੱਟ ਕਰ ਦਿੱਤਾ ਗਿਆ',
  COUNTED_TARGET_TWICE: 'ਪਾਰ ਕੀਤੇ ਵਿਅਕਤੀਆਂ ਨਾਲ ਇੱਕ ਸਿਰਾ ਵਾਧੂ ਗਿਣ ਲਿਆ ਗਿਆ',
  USED_MIXED_END_RANKS_DIRECTLY: 'ਦੋਵੇਂ ਰੈਂਕਾਂ ਨੂੰ ਇੱਕੋ ਸਿਰੇ ਵਿੱਚ ਬਦਲਣ ਤੋਂ ਪਹਿਲਾਂ ਸਿੱਧਾ ਘਟਾ ਦਿੱਤਾ ਗਿਆ',
  REAPPLIED_MOVEMENT_INSTEAD_OF_REVERSING: 'ਮੂਲ ਰੈਂਕ ਕੱਢਦੇ ਸਮੇਂ ਬਦਲਾਅ ਉਲਟਣ ਦੀ ਥਾਂ ਮੁੜ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ਲਗਾਇਆ ਗਿਆ',
  USED_FINAL_AS_ORIGINAL: 'ਅੰਤਿਮ ਸਥਿਤੀ ਨੂੰ ਹੀ ਮੂਲ ਸਥਿਤੀ ਮੰਨ ਲਿਆ ਗਿਆ',
  IGNORED_INSERTION_SHIFT: 'ਨਵੇਂ ਮੈਂਬਰ ਦੇ ਆਉਣ ਨਾਲ ਟੀਚੇ ਦੀ ਰੈਂਕ ਉੱਤੇ ਪੈਣ ਵਾਲਾ ਅਸਰ ਅਣਡਿੱਠਾ ਕੀਤਾ ਗਿਆ',
  SHIFTED_WITHOUT_POSITION_CHECK: 'ਨਵੇਂ ਜਾਂ ਹਟੇ ਮੈਂਬਰ ਦੀ ਟੀਚੇ ਦੇ ਮੁਕਾਬਲੇ ਸਥਿਤੀ ਵੇਖੇ ਬਿਨਾ ਰੈਂਕ ਬਦਲ ਦਿੱਤੀ ਗਈ',
  SHIFTED_IN_WRONG_DIRECTION: 'ਟੀਚੇ ਦੀ ਰੈਂਕ ਨੂੰ ਗਲਤ ਦਿਸ਼ਾ ਵਿੱਚ ਇੱਕ ਸਥਾਨ ਬਦਲ ਦਿੱਤਾ ਗਿਆ',
  USED_OLD_TOTAL_FOR_END_CONVERSION: 'ਉਲਟ ਸਿਰੇ ਤੋਂ ਰੈਂਕ ਬਦਲਦੇ ਸਮੇਂ ਪੁਰਾਣੀ ਕੁੱਲ ਗਿਣਤੀ ਵਰਤੀ ਗਈ',
  IGNORED_REMOVAL_SHIFT: 'ਕਿਸੇ ਮੈਂਬਰ ਦੇ ਹਟਣ ਨਾਲ ਟੀਚੇ ਦੀ ਰੈਂਕ ਉੱਤੇ ਪੈਣ ਵਾਲਾ ਅਸਰ ਅਣਡਿੱਠਾ ਕੀਤਾ ਗਿਆ',
  APPLIED_ONLY_FIRST_MOVEMENT: 'ਕੇਵਲ ਪਹਿਲਾ ਸਥਾਨ-ਬਦਲਾਅ ਲਗਾ ਕੇ ਦੂਜਾ ਛੱਡ ਦਿੱਤਾ ਗਿਆ',
  APPLIED_ONLY_SECOND_MOVEMENT: 'ਪਹਿਲਾ ਸਥਾਨ-ਬਦਲਾਅ ਛੱਡ ਕੇ ਕੇਵਲ ਦੂਜਾ ਲਗਾਇਆ ਗਿਆ',
  TREATED_BOTH_MOVES_AS_SAME_DIRECTION: 'ਦੋ ਬਦਲਾਵਾਂ ਦੀਆਂ ਦਿਸ਼ਾਵਾਂ ਵੱਖ ਹੋਣ ਦੇ ਬਾਵਜੂਦ ਦੋਵੇਂ ਇੱਕੋ ਦਿਸ਼ਾ ਦੇ ਮੰਨ ਲਏ ਗਏ',
  COLLISION_SAFE_NEARBY_VALUE: 'ਨੇੜਲੀ ਗਿਣਤੀ ਚੁਣੀ ਗਈ ਹੈ, ਪਰ ਉਹ ਪੂਰੇ ਬਦਲਾਅ-ਕ੍ਰਮ ਨਾਲ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦੀ',
  USED_OLD_RANKS_AFTER_INTERCHANGE: 'ਦੋਵੇਂ ਪੁਰਾਣੀਆਂ ਰੈਂਕਾਂ ਹੀ ਰੱਖੀਆਂ ਗਈਆਂ ਅਤੇ ਥਾਂ-ਬਦਲੀ ਲਾਗੂ ਨਹੀਂ ਕੀਤੀ ਗਈ',
  REVERSED_PERSON_LABELS: 'ਦੋ ਸਹੀ ਅੰਕ ਕੱਢੇ ਗਏ, ਪਰ ਉਹ ਗਲਤ ਵਿਅਕਤੀਆਂ ਨਾਲ ਜੋੜ ਦਿੱਤੇ ਗਏ',
  OFF_BY_ONE_BOTH_RANKS: 'ਦੋਵੇਂ ਰੈਂਕਾਂ ਵਿੱਚ ਬਿਨਾ ਲੋੜ ਇੱਕ-ਸਥਾਨ ਦੀ ਗਲਤੀ ਕੀਤੀ ਗਈ',
  USED_FINAL_RANKS_AS_ORIGINAL: 'ਥਾਂ-ਬਦਲੀ ਉਲਟੇ ਬਿਨਾ ਅੰਤਿਮ ਰੈਂਕਾਂ ਨੂੰ ਹੀ ਮੂਲ ਰੈਂਕ ਮੰਨ ਲਿਆ ਗਿਆ',
  COLLISION_SAFE_NEARBY_PAIR: 'ਰੈਂਕਾਂ ਦੀ ਨੇੜਲੀ ਜੋੜੀ ਚੁਣੀ ਗਈ ਹੈ, ਪਰ ਉਹ ਬਦਲੀਆਂ ਸਥਿਤੀਆਂ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦੀ',
  IGNORED_OTHER_PERSON_MOVEMENT: 'ਦੂਜੇ ਵਿਅਕਤੀ ਦੇ ਟੀਚੇ ਨੂੰ ਪਾਰ ਕਰਨ ਜਾਂ ਨਾ ਕਰਨ ਦਾ ਅਸਰ ਅਣਡਿੱਠਾ ਕੀਤਾ ਗਿਆ',
  REPORTED_FINAL_AS_ORIGINAL: 'ਦੂਜੇ ਵਿਅਕਤੀ ਦੀ ਚਾਲ ਉਲਟੇ ਬਿਨਾ ਦਿਖਾਈ ਅੰਤਿਮ ਰੈਂਕ ਨੂੰ ਹੀ ਮੂਲ ਰੈਂਕ ਦੱਸਿਆ ਗਿਆ',
  IGNORED_BOTH_TRANSFORMATIONS: 'ਦਿਖਾਈ ਰੈਂਕ ਰੱਖ ਕੇ ਦੋਵੇਂ ਬਦਲਾਅ ਅਣਡਿੱਠੇ ਕਰ ਦਿੱਤੇ ਗਏ',
  OFF_BY_ONE_LOW: 'ਸਹੀ ਮੁੜ-ਗਿਣਤੀ ਤੋਂ ਇੱਕ ਸਥਾਨ ਪਹਿਲਾਂ ਰੁਕ ਗਿਆ',
  OFF_BY_ONE_HIGH: 'ਸਹੀ ਮੁੜ-ਗਿਣਤੀ ਤੋਂ ਇੱਕ ਸਥਾਨ ਅੱਗੇ ਚਲਾ ਗਿਆ',
  REVERSED_REFERENCE_END: 'ਮੰਗੇ ਸਿਰੇ ਦੀ ਥਾਂ ਉਲਟ ਸਿਰੇ ਤੋਂ ਰੈਂਕ ਪੜ੍ਹੀ ਗਈ',
  NEARBY_VALID_RANK: 'ਰੈਂਕ ਮੰਨੀ ਹੋਈ ਹੱਦ ਵਿੱਚ ਹੈ, ਪਰ ਪੂਰੇ ਬਦਲਾਅ-ਕ੍ਰਮ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦੀ',
};

function localizeMisconception(id: string, locale: RnkCp003LocalizedLocale): string {
  const dictionary = locale === 'hi-IN' ? HINDI_MISCONCEPTIONS : PUNJABI_MISCONCEPTIONS;
  return dictionary[id] ?? native(
    locale,
    'यह विकल्प दिए गए स्थान-परिवर्तन या माँगी गई दिशा में से किसी एक को सही ढंग से लागू नहीं करता',
    'ਇਹ ਵਿਕਲਪ ਦਿੱਤੇ ਸਥਾਨ-ਬਦਲਾਅ ਜਾਂ ਮੰਗੀ ਦਿਸ਼ਾ ਵਿੱਚੋਂ ਕਿਸੇ ਇੱਕ ਨੂੰ ਸਹੀ ਤਰ੍ਹਾਂ ਲਾਗੂ ਨਹੀਂ ਕਰਦਾ',
  );
}

function localizedOptionLabel(option: AnyQuestion, question: AnyQuestion, names: readonly string[]): string {
  if (question.answerSemantic === 'RANK_PAIR') return pairAnswer(String(option.answerKey), names);
  return String(optionSemanticValue(option));
}

function localizeOptions(
  question: AnyQuestion,
  names: readonly string[],
  locale: RnkCp003LocalizedLocale,
): readonly AnyOption[] {
  return question.options.map((option: AnyQuestion) => ({
    ...option,
    label: localizedOptionLabel(option, question, names),
    explanation: localizeMisconception(String(option.misconceptionId), locale),
  }));
}

function buildStem(
  question: AnyQuestion,
  names: readonly string[],
  context: NativeContext,
  locale: RnkCp003LocalizedLocale,
): string {
  const evidence = question.displayedEvidence as AnyEvidence;
  const first = names[0] ?? '';
  const second = names[1] ?? '';

  switch (evidence.kind) {
    case 'FINAL_RANKS_AFTER_INTERCHANGE':
      return native(
        locale,
        `${context.group} में कुल ${evidence.total} ${context.members} हैं। ${first} ${rankPhrase(evidence.firstOriginalRank, evidence.firstOriginalSide, context, locale)} है और ${second} ${rankPhrase(evidence.secondOriginalRank, evidence.secondOriginalSide, context, locale)} है। दोनों अपनी जगह बदल लेते हैं। क्रमशः ${first} की ${sidePhrase(evidence.firstRequestedSide, context)} और ${second} की ${sidePhrase(evidence.secondRequestedSide, context)} रैंक क्या होगी?`,
        `${context.group} ਵਿੱਚ ਕੁੱਲ ${evidence.total} ${context.members} ਹਨ। ${first} ${rankPhrase(evidence.firstOriginalRank, evidence.firstOriginalSide, context, locale)} ਹੈ ਅਤੇ ${second} ${rankPhrase(evidence.secondOriginalRank, evidence.secondOriginalSide, context, locale)} ਹੈ। ਦੋਵੇਂ ਆਪਣੀਆਂ ਥਾਵਾਂ ਬਦਲ ਲੈਂਦੇ ਹਨ। ਕ੍ਰਮਵਾਰ ${first} ਦੀ ${sidePhrase(evidence.firstRequestedSide, context)} ਅਤੇ ${second} ਦੀ ${sidePhrase(evidence.secondRequestedSide, context)} ਰੈਂਕ ਕੀ ਹੋਵੇਗੀ?`,
      );
    case 'ORIGINAL_RANKS_FROM_FINAL_INTERCHANGE':
      return native(
        locale,
        `${context.group} में कुल ${evidence.total} ${context.members} हैं। ${first} और ${second} ने अपनी जगह बदल ली। इसके बाद ${first} ${rankPhrase(evidence.firstFinalRank, evidence.firstFinalSide, context, locale)} और ${second} ${rankPhrase(evidence.secondFinalRank, evidence.secondFinalSide, context, locale)} है। क्रमशः ${first} की मूल ${sidePhrase(evidence.firstRequestedSide, context)} और ${second} की मूल ${sidePhrase(evidence.secondRequestedSide, context)} रैंक क्या थी?`,
        `${context.group} ਵਿੱਚ ਕੁੱਲ ${evidence.total} ${context.members} ਹਨ। ${first} ਅਤੇ ${second} ਨੇ ਆਪਣੀਆਂ ਥਾਵਾਂ ਬਦਲ ਲਈਆਂ। ਇਸ ਤੋਂ ਬਾਅਦ ${first} ${rankPhrase(evidence.firstFinalRank, evidence.firstFinalSide, context, locale)} ਅਤੇ ${second} ${rankPhrase(evidence.secondFinalRank, evidence.secondFinalSide, context, locale)} ਹੈ। ਕ੍ਰਮਵਾਰ ${first} ਦੀ ਮੂਲ ${sidePhrase(evidence.firstRequestedSide, context)} ਅਤੇ ${second} ਦੀ ਮੂਲ ${sidePhrase(evidence.secondRequestedSide, context)} ਰੈਂਕ ਕੀ ਸੀ?`,
      );
    case 'TOTAL_FROM_INTERCHANGE_RANK_CHANGE':
      return native(
        locale,
        `${context.group} में ${first} पहले ${rankPhrase(evidence.firstOriginalRankFromStart, 'START', context, locale)} है, जबकि ${second} ${rankPhrase(evidence.secondOriginalRankFromEnd, 'END', context, locale)} है। दोनों की जगह बदलने के बाद ${first} ${rankPhrase(evidence.firstFinalRankFromStart, 'START', context, locale)} हो जाता है। ${context.group} में कुल कितने ${context.members} हैं?`,
        `${context.group} ਵਿੱਚ ${first} ਪਹਿਲਾਂ ${rankPhrase(evidence.firstOriginalRankFromStart, 'START', context, locale)} ਹੈ, ਜਦਕਿ ${second} ${rankPhrase(evidence.secondOriginalRankFromEnd, 'END', context, locale)} ਹੈ। ਦੋਵਾਂ ਦੀ ਥਾਂ ਬਦਲਣ ਤੋਂ ਬਾਅਦ ${first} ${rankPhrase(evidence.firstFinalRankFromStart, 'START', context, locale)} ਹੋ ਜਾਂਦਾ ਹੈ। ${context.group} ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ${context.members} ਹਨ?`,
      );
    case 'FINAL_RANK_AFTER_SINGLE_MOVEMENT':
      return native(
        locale,
        `${context.group} में कुल ${evidence.total} ${context.members} हैं। ${first} ${rankPhrase(evidence.originalRank, evidence.originalSide, context, locale)} है। ${movementClause(first, evidence.direction, evidence.distance, context, locale)}। ${first} की नई ${sidePhrase(evidence.requestedSide, context)} रैंक क्या होगी?`,
        `${context.group} ਵਿੱਚ ਕੁੱਲ ${evidence.total} ${context.members} ਹਨ। ${first} ${rankPhrase(evidence.originalRank, evidence.originalSide, context, locale)} ਹੈ। ${movementClause(first, evidence.direction, evidence.distance, context, locale)}। ${first} ਦੀ ਨਵੀਂ ${sidePhrase(evidence.requestedSide, context)} ਰੈਂਕ ਕੀ ਹੋਵੇਗੀ?`,
      );
    case 'PEOPLE_PASSED_FROM_RANK_CHANGE':
      return native(
        locale,
        `${context.group} में कुल ${evidence.total} ${context.members} हैं। ${first} की रैंक ${rankPhrase(evidence.originalRank, evidence.originalSide, context, locale)} से बदलकर ${rankPhrase(evidence.finalRank, evidence.finalSide, context, locale)} हो जाती है। इस बदलाव में ${first} ने कितने ${context.members} को पार किया या कितने ${context.members} ने ${first} को पार किया?`,
        `${context.group} ਵਿੱਚ ਕੁੱਲ ${evidence.total} ${context.members} ਹਨ। ${first} ਦੀ ਰੈਂਕ ${rankPhrase(evidence.originalRank, evidence.originalSide, context, locale)} ਤੋਂ ਬਦਲ ਕੇ ${rankPhrase(evidence.finalRank, evidence.finalSide, context, locale)} ਹੋ ਜਾਂਦੀ ਹੈ। ਇਸ ਬਦਲਾਅ ਵਿੱਚ ${first} ਨੇ ਕਿੰਨੇ ${context.members} ਨੂੰ ਪਾਰ ਕੀਤਾ ਜਾਂ ਕਿੰਨੇ ${context.members} ਨੇ ${first} ਨੂੰ ਪਾਰ ਕੀਤਾ?`,
      );
    case 'ORIGINAL_RANK_FROM_FINAL_AND_MOVEMENT':
      return native(
        locale,
        `${context.group} में कुल ${evidence.total} ${context.members} हैं। ${movementClause(first, evidence.direction, evidence.distance, context, locale)} और इसके बाद ${first} ${rankPhrase(evidence.finalRank, evidence.finalSide, context, locale)} है। ${first} की मूल ${sidePhrase(evidence.requestedSide, context)} रैंक क्या थी?`,
        `${context.group} ਵਿੱਚ ਕੁੱਲ ${evidence.total} ${context.members} ਹਨ। ${movementClause(first, evidence.direction, evidence.distance, context, locale)} ਅਤੇ ਇਸ ਤੋਂ ਬਾਅਦ ${first} ${rankPhrase(evidence.finalRank, evidence.finalSide, context, locale)} ਹੈ। ${first} ਦੀ ਮੂਲ ${sidePhrase(evidence.requestedSide, context)} ਰੈਂਕ ਕੀ ਸੀ?`,
      );
    case 'TARGET_RANK_AFTER_INSERTION':
      return native(
        locale,
        `${context.group} में शुरू में ${evidence.totalBefore} ${context.members} हैं। ${first} ${rankPhrase(evidence.targetOriginalRank, evidence.targetOriginalSide, context, locale)} है। एक नया ${context.memberSingular} नई ${context.group} में ${rankPhrase(evidence.insertedFinalRank, evidence.insertedFinalSide, context, locale)} वाली जगह पर जुड़ता है। ${first} की नई ${sidePhrase(evidence.requestedSide, context)} रैंक क्या होगी?`,
        `${context.group} ਵਿੱਚ ਸ਼ੁਰੂ ਵਿੱਚ ${evidence.totalBefore} ${context.members} ਹਨ। ${first} ${rankPhrase(evidence.targetOriginalRank, evidence.targetOriginalSide, context, locale)} ਹੈ। ਇੱਕ ਨਵਾਂ ${context.memberSingular} ਨਵੀਂ ${context.group} ਵਿੱਚ ${rankPhrase(evidence.insertedFinalRank, evidence.insertedFinalSide, context, locale)} ਵਾਲੀ ਥਾਂ ਉੱਤੇ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ। ${first} ਦੀ ਨਵੀਂ ${sidePhrase(evidence.requestedSide, context)} ਰੈਂਕ ਕੀ ਹੋਵੇਗੀ?`,
      );
    case 'TARGET_RANK_AFTER_REMOVAL':
      return native(
        locale,
        `${context.group} में ${evidence.totalBefore} ${context.members} हैं। ${first} ${rankPhrase(evidence.targetOriginalRank, evidence.targetOriginalSide, context, locale)} है। ${rankPhrase(evidence.removedOriginalRank, evidence.removedOriginalSide, context, locale)} वाला ${context.memberSingular} ${context.group} से बाहर हो जाता है। ${first} की नई ${sidePhrase(evidence.requestedSide, context)} रैंक क्या होगी?`,
        `${context.group} ਵਿੱਚ ${evidence.totalBefore} ${context.members} ਹਨ। ${first} ${rankPhrase(evidence.targetOriginalRank, evidence.targetOriginalSide, context, locale)} ਹੈ। ${rankPhrase(evidence.removedOriginalRank, evidence.removedOriginalSide, context, locale)} ਵਾਲਾ ${context.memberSingular} ${context.group} ਤੋਂ ਬਾਹਰ ਹੋ ਜਾਂਦਾ ਹੈ। ${first} ਦੀ ਨਵੀਂ ${sidePhrase(evidence.requestedSide, context)} ਰੈਂਕ ਕੀ ਹੋਵੇਗੀ?`,
      );
    case 'FINAL_RANK_AFTER_SEQUENTIAL_MOVES':
      return native(
        locale,
        `${context.group} में कुल ${evidence.total} ${context.members} हैं। ${first} ${rankPhrase(evidence.originalRank, evidence.originalSide, context, locale)} है। पहले ${movementClause(first, evidence.firstDirection, evidence.firstDistance, context, locale)}; फिर ${movementClause(first, evidence.secondDirection, evidence.secondDistance, context, locale)}। अंतिम ${sidePhrase(evidence.requestedSide, context)} रैंक क्या होगी?`,
        `${context.group} ਵਿੱਚ ਕੁੱਲ ${evidence.total} ${context.members} ਹਨ। ${first} ${rankPhrase(evidence.originalRank, evidence.originalSide, context, locale)} ਹੈ। ਪਹਿਲਾਂ ${movementClause(first, evidence.firstDirection, evidence.firstDistance, context, locale)}; ਫਿਰ ${movementClause(first, evidence.secondDirection, evidence.secondDistance, context, locale)}। ਅੰਤਿਮ ${sidePhrase(evidence.requestedSide, context)} ਰੈਂਕ ਕੀ ਹੋਵੇਗੀ?`,
      );
    case 'TARGET_RANK_AFTER_ANOTHER_PERSON_MOVES': {
      const target = first;
      const mover = second;
      return native(
        locale,
        `${context.group} में कुल ${evidence.total} ${context.members} हैं। ${target} ${rankPhrase(evidence.targetOriginalRank, evidence.targetOriginalSide, context, locale)} है। ${mover} ${rankPhrase(evidence.moverOriginalRankFromStart, 'START', context, locale)} से ${rankPhrase(evidence.moverFinalRankFromStart, 'START', context, locale)} पर चला जाता है। ${target} की नई ${sidePhrase(evidence.requestedSide, context)} रैंक क्या होगी?`,
        `${context.group} ਵਿੱਚ ਕੁੱਲ ${evidence.total} ${context.members} ਹਨ। ${target} ${rankPhrase(evidence.targetOriginalRank, evidence.targetOriginalSide, context, locale)} ਹੈ। ${mover} ${rankPhrase(evidence.moverOriginalRankFromStart, 'START', context, locale)} ਤੋਂ ${rankPhrase(evidence.moverFinalRankFromStart, 'START', context, locale)} ਉੱਤੇ ਚਲਾ ਜਾਂਦਾ ਹੈ। ${target} ਦੀ ਨਵੀਂ ${sidePhrase(evidence.requestedSide, context)} ਰੈਂਕ ਕੀ ਹੋਵੇਗੀ?`,
      );
    }
    case 'ORIGINAL_TARGET_RANK_BEFORE_ANOTHER_PERSON_MOVED': {
      const mover = first;
      const target = second;
      return native(
        locale,
        `${context.group} में कुल ${evidence.total} ${context.members} हैं। ${mover} ${rankPhrase(evidence.moverOriginalRankFromStart, 'START', context, locale)} से ${rankPhrase(evidence.moverFinalRankFromStart, 'START', context, locale)} पर चला गया। इसके बाद ${target} ${rankPhrase(evidence.targetFinalRank, evidence.targetFinalSide, context, locale)} है। ${target} की मूल ${sidePhrase(evidence.requestedSide, context)} रैंक क्या थी?`,
        `${context.group} ਵਿੱਚ ਕੁੱਲ ${evidence.total} ${context.members} ਹਨ। ${mover} ${rankPhrase(evidence.moverOriginalRankFromStart, 'START', context, locale)} ਤੋਂ ${rankPhrase(evidence.moverFinalRankFromStart, 'START', context, locale)} ਉੱਤੇ ਚਲਾ ਗਿਆ। ਇਸ ਤੋਂ ਬਾਅਦ ${target} ${rankPhrase(evidence.targetFinalRank, evidence.targetFinalSide, context, locale)} ਹੈ। ${target} ਦੀ ਮੂਲ ${sidePhrase(evidence.requestedSide, context)} ਰੈਂਕ ਕੀ ਸੀ?`,
      );
    }
    case 'FINAL_RANK_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE': {
      const move = movementClause(first, evidence.movementDirection, evidence.movementDistance, context, locale);
      const change = membershipClause(evidence.membershipKind, evidence.membershipSide, evidence.membershipCount, context, locale);
      const sequence = evidence.operationOrder === 'MOVE_THEN_CHANGE'
        ? native(locale, `पहले ${move}; फिर ${change}`, `ਪਹਿਲਾਂ ${move}; ਫਿਰ ${change}`)
        : native(locale, `पहले ${change}; फिर ${move}`, `ਪਹਿਲਾਂ ${change}; ਫਿਰ ${move}`);
      return native(
        locale,
        `${context.group} में शुरू में ${evidence.totalBefore} ${context.members} हैं। ${first} ${rankPhrase(evidence.originalRank, evidence.originalSide, context, locale)} है। ${sequence}। ${first} की अंतिम ${sidePhrase(evidence.requestedSide, context)} रैंक क्या होगी?`,
        `${context.group} ਵਿੱਚ ਸ਼ੁਰੂ ਵਿੱਚ ${evidence.totalBefore} ${context.members} ਹਨ। ${first} ${rankPhrase(evidence.originalRank, evidence.originalSide, context, locale)} ਹੈ। ${sequence}। ${first} ਦੀ ਅੰਤਿਮ ${sidePhrase(evidence.requestedSide, context)} ਰੈਂਕ ਕੀ ਹੋਵੇਗੀ?`,
      );
    }
    case 'ORIGINAL_RANK_FROM_FINAL_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE': {
      const move = movementClause(first, evidence.movementDirection, evidence.movementDistance, context, locale);
      const change = membershipClause(evidence.membershipKind, evidence.membershipSide, evidence.membershipCount, context, locale);
      const sequence = evidence.operationOrder === 'MOVE_THEN_CHANGE'
        ? native(locale, `पहले ${move}; फिर ${change}`, `ਪਹਿਲਾਂ ${move}; ਫਿਰ ${change}`)
        : native(locale, `पहले ${change}; फिर ${move}`, `ਪਹਿਲਾਂ ${change}; ਫਿਰ ${move}`);
      return native(
        locale,
        `${context.group} में शुरू में ${evidence.totalBefore} ${context.members} हैं। ${sequence}। दोनों बदलावों के बाद ${first} ${rankPhrase(evidence.finalRank, evidence.finalSide, context, locale)} है। ${first} की मूल ${sidePhrase(evidence.requestedSide, context)} रैंक क्या थी?`,
        `${context.group} ਵਿੱਚ ਸ਼ੁਰੂ ਵਿੱਚ ${evidence.totalBefore} ${context.members} ਹਨ। ${sequence}। ਦੋਵੇਂ ਬਦਲਾਵਾਂ ਤੋਂ ਬਾਅਦ ${first} ${rankPhrase(evidence.finalRank, evidence.finalSide, context, locale)} ਹੈ। ${first} ਦੀ ਮੂਲ ${sidePhrase(evidence.requestedSide, context)} ਰੈਂਕ ਕੀ ਸੀ?`,
      );
    }
    default:
      throw new Error(`Unknown CP003 evidence kind ${evidence.kind}`);
  }
}

function normalizeToStart(
  total: number,
  rank: number,
  side: RnkSide,
  context: NativeContext,
  locale: RnkCp003LocalizedLocale,
): string {
  const start = toStartRank(total, rank, side);
  if (side === 'START') {
    return native(
      locale,
      `${sidePhrase(side, context)} रैंक ${rank} पहले से ही संदर्भ स्थिति ${start} है`,
      `${sidePhrase(side, context)} ਰੈਂਕ ${rank} ਪਹਿਲਾਂ ਹੀ ਹਵਾਲਾ ਸਥਿਤੀ ${start} ਹੈ`,
    );
  }
  return native(
    locale,
    `${sidePhrase(side, context)} रैंक ${rank} को ${context.startRank} बदलने पर ${total} - ${rank} + 1 = ${start} मिलता है`,
    `${sidePhrase(side, context)} ਰੈਂਕ ${rank} ਨੂੰ ${context.startRank} ਬਦਲਣ ਉੱਤੇ ${total} - ${rank} + 1 = ${start} ਮਿਲਦਾ ਹੈ`,
  );
}

function otherTargetAfterMove(target: number, moverOriginal: number, moverFinal: number): number {
  let result = target;
  if (moverOriginal < result) result -= 1;
  if (moverFinal <= result) result += 1;
  return result;
}

interface RankState {
  readonly total: number;
  readonly rankFromStart: number;
}

function applyMovement(state: RankState, direction: RnkMovementDirection, distance: number): RankState {
  return {
    total: state.total,
    rankFromStart: state.rankFromStart + (direction === 'TOWARD_START' ? -distance : distance),
  };
}

function applyMembership(
  state: RankState,
  kind: 'INSERT' | 'REMOVE',
  side: 'START' | 'END',
  count: number,
): RankState {
  if (kind === 'INSERT') {
    return {
      total: state.total + count,
      rankFromStart: side === 'START' ? state.rankFromStart + count : state.rankFromStart,
    };
  }
  return {
    total: state.total - count,
    rankFromStart: side === 'START' ? state.rankFromStart - count : state.rankFromStart,
  };
}

function buildExplanation(
  question: AnyQuestion,
  names: readonly string[],
  answer: string | number,
  options: readonly AnyOption[],
  context: NativeContext,
  locale: RnkCp003LocalizedLocale,
): RnkCp003LocalizedReviewQuestion['explanation'] {
  const evidence = question.displayedEvidence as AnyEvidence;
  const first = names[0] ?? '';
  const second = names[1] ?? '';
  let keyRule = '';
  let shortcut = '';
  let steps: string[] = [];

  switch (evidence.kind) {
    case 'FINAL_RANKS_AFTER_INTERCHANGE': {
      const firstStart = toStartRank(evidence.total, evidence.firstOriginalRank, evidence.firstOriginalSide);
      const secondStart = toStartRank(evidence.total, evidence.secondOriginalRank, evidence.secondOriginalSide);
      const firstFinal = fromStartRank(evidence.total, secondStart, evidence.firstRequestedSide);
      const secondFinal = fromStartRank(evidence.total, firstStart, evidence.secondRequestedSide);
      keyRule = native(locale, 'दो व्यक्ति जगह बदलें तो प्रत्येक व्यक्ति दूसरे की ठीक वही स्थिति लेता है।', 'ਦੋ ਵਿਅਕਤੀ ਥਾਂ ਬਦਲਣ ਤਾਂ ਹਰ ਵਿਅਕਤੀ ਦੂਜੇ ਦੀ ਠੀਕ ਉਹੀ ਸਥਿਤੀ ਲੈਂਦਾ ਹੈ।');
      shortcut = native(locale, 'पहले दोनों स्थितियाँ आपस में बदलें, फिर केवल माँगे गए सिरे में रैंक बदलें।', 'ਪਹਿਲਾਂ ਦੋਵੇਂ ਸਥਿਤੀਆਂ ਆਪਸ ਵਿੱਚ ਬਦਲੋ, ਫਿਰ ਕੇਵਲ ਮੰਗੇ ਸਿਰੇ ਵਿੱਚ ਰੈਂਕ ਬਦਲੋ।');
      steps = [
        `${first}: ${normalizeToStart(evidence.total, evidence.firstOriginalRank, evidence.firstOriginalSide, context, locale)}।`,
        `${second}: ${normalizeToStart(evidence.total, evidence.secondOriginalRank, evidence.secondOriginalSide, context, locale)}।`,
        native(locale, `जगह बदलने के बाद ${first} की संदर्भ स्थिति ${secondStart} और ${second} की ${firstStart} है।`, `ਥਾਂ ਬਦਲਣ ਤੋਂ ਬਾਅਦ ${first} ਦੀ ਹਵਾਲਾ ਸਥਿਤੀ ${secondStart} ਅਤੇ ${second} ਦੀ ${firstStart} ਹੈ।`),
        native(locale, `माँगे गए सिरों में रैंकें ${firstFinal} और ${secondFinal} मिलती हैं।`, `ਮੰਗੇ ਸਿਰਿਆਂ ਵਿੱਚ ਰੈਂਕਾਂ ${firstFinal} ਅਤੇ ${secondFinal} ਮਿਲਦੀਆਂ ਹਨ।`),
      ];
      break;
    }
    case 'ORIGINAL_RANKS_FROM_FINAL_INTERCHANGE': {
      const firstFinalStart = toStartRank(evidence.total, evidence.firstFinalRank, evidence.firstFinalSide);
      const secondFinalStart = toStartRank(evidence.total, evidence.secondFinalRank, evidence.secondFinalSide);
      const firstOriginal = fromStartRank(evidence.total, secondFinalStart, evidence.firstRequestedSide);
      const secondOriginal = fromStartRank(evidence.total, firstFinalStart, evidence.secondRequestedSide);
      keyRule = native(locale, 'स्थान-विनिमय उलटा किया जा सकता है; मूल स्थिति पाने के लिए अंतिम स्थितियाँ एक बार वापस बदलें।', 'ਥਾਂ-ਬਦਲੀ ਉਲਟੀ ਕੀਤੀ ਜਾ ਸਕਦੀ ਹੈ; ਮੂਲ ਸਥਿਤੀ ਲਈ ਅੰਤਿਮ ਸਥਿਤੀਆਂ ਇੱਕ ਵਾਰ ਵਾਪਸ ਬਦਲੋ।');
      shortcut = native(locale, 'अंतिम स्थितियों को केवल एक बार आपस में बदलें; कोई अतिरिक्त चाल न जोड़ें।', 'ਅੰਤਿਮ ਸਥਿਤੀਆਂ ਨੂੰ ਕੇਵਲ ਇੱਕ ਵਾਰ ਆਪਸ ਵਿੱਚ ਬਦਲੋ; ਕੋਈ ਵਾਧੂ ਚਾਲ ਨਾ ਜੋੜੋ।');
      steps = [
        `${first}: ${normalizeToStart(evidence.total, evidence.firstFinalRank, evidence.firstFinalSide, context, locale)}।`,
        `${second}: ${normalizeToStart(evidence.total, evidence.secondFinalRank, evidence.secondFinalSide, context, locale)}।`,
        native(locale, `विनिमय उलटने पर ${first} की मूल संदर्भ स्थिति ${secondFinalStart} और ${second} की ${firstFinalStart} है।`, `ਬਦਲੀ ਉਲਟਣ ਉੱਤੇ ${first} ਦੀ ਮੂਲ ਹਵਾਲਾ ਸਥਿਤੀ ${secondFinalStart} ਅਤੇ ${second} ਦੀ ${firstFinalStart} ਹੈ।`),
        native(locale, `माँगे गए सिरों से मूल रैंकें ${firstOriginal} और ${secondOriginal} हैं।`, `ਮੰਗੇ ਸਿਰਿਆਂ ਤੋਂ ਮੂਲ ਰੈਂਕਾਂ ${firstOriginal} ਅਤੇ ${secondOriginal} ਹਨ।`),
      ];
      break;
    }
    case 'TOTAL_FROM_INTERCHANGE_RANK_CHANGE': {
      const total = evidence.firstFinalRankFromStart + evidence.secondOriginalRankFromEnd - 1;
      keyRule = native(locale, 'स्थान बदलने के बाद पहले व्यक्ति की नई स्थिति दूसरे व्यक्ति की पुरानी स्थिति होती है; विपरीत सिरों की रैंकों का योग कुल से एक अधिक होता है।', 'ਥਾਂ ਬਦਲਣ ਤੋਂ ਬਾਅਦ ਪਹਿਲੇ ਵਿਅਕਤੀ ਦੀ ਨਵੀਂ ਸਥਿਤੀ ਦੂਜੇ ਦੀ ਪੁਰਾਣੀ ਸਥਿਤੀ ਹੁੰਦੀ ਹੈ; ਉਲਟ ਸਿਰਿਆਂ ਦੀਆਂ ਰੈਂਕਾਂ ਦਾ ਜੋੜ ਕੁੱਲ ਤੋਂ ਇੱਕ ਵੱਧ ਹੁੰਦਾ ਹੈ।');
      shortcut = native(locale, 'मिली हुई नई रैंक को दूसरे व्यक्ति की विपरीत-सिरे वाली पुरानी रैंक से जोड़कर एक घटाएँ।', 'ਮਿਲੀ ਨਵੀਂ ਰੈਂਕ ਨੂੰ ਦੂਜੇ ਵਿਅਕਤੀ ਦੀ ਉਲਟ-ਸਿਰੇ ਵਾਲੀ ਪੁਰਾਣੀ ਰੈਂਕ ਨਾਲ ਜੋੜ ਕੇ ਇੱਕ ਘਟਾਓ।');
      steps = [
        native(locale, `${first} की नई ${context.startRank} रैंक ${evidence.firstFinalRankFromStart}, ${second} की पुरानी ${context.startRank} स्थिति है।`, `${first} ਦੀ ਨਵੀਂ ${context.startRank} ਰੈਂਕ ${evidence.firstFinalRankFromStart}, ${second} ਦੀ ਪੁਰਾਣੀ ${context.startRank} ਸਥਿਤੀ ਹੈ।`),
        native(locale, `${second} की विपरीत-सिरे की रैंक ${evidence.secondOriginalRankFromEnd} दी है।`, `${second} ਦੀ ਉਲਟ-ਸਿਰੇ ਵਾਲੀ ਰੈਂਕ ${evidence.secondOriginalRankFromEnd} ਦਿੱਤੀ ਹੈ।`),
        native(locale, `कुल = ${evidence.firstFinalRankFromStart} + ${evidence.secondOriginalRankFromEnd} - 1 = ${total}।`, `ਕੁੱਲ = ${evidence.firstFinalRankFromStart} + ${evidence.secondOriginalRankFromEnd} - 1 = ${total}।`),
      ];
      break;
    }
    case 'FINAL_RANK_AFTER_SINGLE_MOVEMENT': {
      const originalStart = toStartRank(evidence.total, evidence.originalRank, evidence.originalSide);
      const finalStart = originalStart + (evidence.direction === 'TOWARD_START' ? -evidence.distance : evidence.distance);
      const requested = fromStartRank(evidence.total, finalStart, evidence.requestedSide);
      keyRule = native(locale, 'एक ही संदर्भ सिरे से रैंक रखें; उस सिरे की ओर चाल रैंक घटाती है और उससे दूर चाल रैंक बढ़ाती है।', 'ਇੱਕੋ ਹਵਾਲਾ ਸਿਰੇ ਤੋਂ ਰੈਂਕ ਰੱਖੋ; ਉਸ ਸਿਰੇ ਵੱਲ ਚਾਲ ਰੈਂਕ ਘਟਾਉਂਦੀ ਹੈ ਅਤੇ ਉਸ ਤੋਂ ਦੂਰ ਚਾਲ ਰੈਂਕ ਵਧਾਉਂਦੀ ਹੈ।');
      shortcut = native(locale, 'पहले एक ही सिरे में रैंक लें, फिर दिशा के अनुसार दूरी जोड़ें या घटाएँ।', 'ਪਹਿਲਾਂ ਇੱਕੋ ਸਿਰੇ ਵਿੱਚ ਰੈਂਕ ਲਵੋ, ਫਿਰ ਦਿਸ਼ਾ ਅਨੁਸਾਰ ਦੂਰੀ ਜੋੜੋ ਜਾਂ ਘਟਾਓ।');
      steps = [
        `${normalizeToStart(evidence.total, evidence.originalRank, evidence.originalSide, context, locale)}।`,
        native(locale, `चाल के बाद संदर्भ स्थिति ${originalStart} ${evidence.direction === 'TOWARD_START' ? '-' : '+'} ${evidence.distance} = ${finalStart}।`, `ਚਾਲ ਤੋਂ ਬਾਅਦ ਹਵਾਲਾ ਸਥਿਤੀ ${originalStart} ${evidence.direction === 'TOWARD_START' ? '-' : '+'} ${evidence.distance} = ${finalStart}।`),
        native(locale, `माँगे गए सिरे से अंतिम रैंक ${requested} है।`, `ਮੰਗੇ ਸਿਰੇ ਤੋਂ ਅੰਤਿਮ ਰੈਂਕ ${requested} ਹੈ।`),
      ];
      break;
    }
    case 'PEOPLE_PASSED_FROM_RANK_CHANGE': {
      const originalStart = toStartRank(evidence.total, evidence.originalRank, evidence.originalSide);
      const finalStart = toStartRank(evidence.total, evidence.finalRank, evidence.finalSide);
      const crossed = Math.abs(originalStart - finalStart);
      keyRule = native(locale, 'पार किए गए व्यक्तियों की संख्या एक ही सिरे से ली गई पुरानी और नई स्थितियों के अंतर के बराबर होती है।', 'ਪਾਰ ਕੀਤੇ ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ ਇੱਕੋ ਸਿਰੇ ਤੋਂ ਲਈਆਂ ਪੁਰਾਣੀ ਅਤੇ ਨਵੀਂ ਸਥਿਤੀਆਂ ਦੇ ਫਰਕ ਦੇ ਬਰਾਬਰ ਹੁੰਦੀ ਹੈ।');
      shortcut = native(locale, 'दोनों रैंकों को एक ही सिरे में बदलकर सीधा अंतर लें; एक अतिरिक्त न घटाएँ।', 'ਦੋਵੇਂ ਰੈਂਕਾਂ ਨੂੰ ਇੱਕੋ ਸਿਰੇ ਵਿੱਚ ਬਦਲ ਕੇ ਸਿੱਧਾ ਫਰਕ ਲਵੋ; ਇੱਕ ਵਾਧੂ ਨਾ ਘਟਾਓ।');
      steps = [
        native(locale, `पुरानी संदर्भ स्थिति = ${originalStart}।`, `ਪੁਰਾਣੀ ਹਵਾਲਾ ਸਥਿਤੀ = ${originalStart}।`),
        native(locale, `नई संदर्भ स्थिति = ${finalStart}।`, `ਨਵੀਂ ਹਵਾਲਾ ਸਥਿਤੀ = ${finalStart}।`),
        native(locale, `पार किए गए व्यक्तियों की संख्या = |${originalStart} - ${finalStart}| = ${crossed}।`, `ਪਾਰ ਕੀਤੇ ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ = |${originalStart} - ${finalStart}| = ${crossed}।`),
      ];
      break;
    }
    case 'ORIGINAL_RANK_FROM_FINAL_AND_MOVEMENT': {
      const finalStart = toStartRank(evidence.total, evidence.finalRank, evidence.finalSide);
      const originalStart = finalStart - (evidence.direction === 'TOWARD_START' ? -evidence.distance : evidence.distance);
      const requested = fromStartRank(evidence.total, originalStart, evidence.requestedSide);
      keyRule = native(locale, 'मूल रैंक निकालने के लिए दी गई चाल को उलटें और उसके बाद माँगे गए सिरे में बदलें।', 'ਮੂਲ ਰੈਂਕ ਕੱਢਣ ਲਈ ਦਿੱਤੀ ਚਾਲ ਨੂੰ ਉਲਟੋ ਅਤੇ ਉਸ ਤੋਂ ਬਾਅਦ ਮੰਗੇ ਸਿਰੇ ਵਿੱਚ ਬਦਲੋ।');
      shortcut = native(locale, 'अंतिम स्थिति से चाल का उलटा प्रभाव लगाएँ; फिर केवल एक बार सिरा बदलें।', 'ਅੰਤਿਮ ਸਥਿਤੀ ਤੋਂ ਚਾਲ ਦਾ ਉਲਟ ਅਸਰ ਲਗਾਓ; ਫਿਰ ਕੇਵਲ ਇੱਕ ਵਾਰ ਸਿਰਾ ਬਦਲੋ।');
      steps = [
        native(locale, `अंतिम संदर्भ स्थिति = ${finalStart}।`, `ਅੰਤਿਮ ਹਵਾਲਾ ਸਥਿਤੀ = ${finalStart}।`),
        native(locale, `चाल उलटने पर मूल संदर्भ स्थिति = ${originalStart}।`, `ਚਾਲ ਉਲਟਣ ਉੱਤੇ ਮੂਲ ਹਵਾਲਾ ਸਥਿਤੀ = ${originalStart}।`),
        native(locale, `माँगे गए सिरे से मूल रैंक = ${requested}।`, `ਮੰਗੇ ਸਿਰੇ ਤੋਂ ਮੂਲ ਰੈਂਕ = ${requested}।`),
      ];
      break;
    }
    case 'TARGET_RANK_AFTER_INSERTION': {
      const totalAfter = evidence.totalBefore + 1;
      const targetStart = toStartRank(evidence.totalBefore, evidence.targetOriginalRank, evidence.targetOriginalSide);
      const insertedStart = toStartRank(totalAfter, evidence.insertedFinalRank, evidence.insertedFinalSide);
      const finalStart = insertedStart <= targetStart ? targetStart + 1 : targetStart;
      const requested = fromStartRank(totalAfter, finalStart, evidence.requestedSide);
      keyRule = native(locale, 'नया सदस्य लक्ष्य की पुरानी स्थिति से पहले या उसी स्थान पर आए तो लक्ष्य एक स्थान पीछे खिसकता है; बाद में आए तो लक्ष्य नहीं बदलता।', 'ਨਵਾਂ ਮੈਂਬਰ ਟੀਚੇ ਦੀ ਪੁਰਾਣੀ ਸਥਿਤੀ ਤੋਂ ਪਹਿਲਾਂ ਜਾਂ ਉਸੇ ਥਾਂ ਆਵੇ ਤਾਂ ਟੀਚਾ ਇੱਕ ਸਥਾਨ ਪਿੱਛੇ ਖਿਸਕਦਾ ਹੈ; ਬਾਅਦ ਆਵੇ ਤਾਂ ਟੀਚਾ ਨਹੀਂ ਬਦਲਦਾ।');
      shortcut = native(locale, 'नई स्थिति को लक्ष्य की पुरानी संदर्भ स्थिति से तुलना करें; केवल जरूरत होने पर एक जोड़ें।', 'ਨਵੀਂ ਸਥਿਤੀ ਨੂੰ ਟੀਚੇ ਦੀ ਪੁਰਾਣੀ ਹਵਾਲਾ ਸਥਿਤੀ ਨਾਲ ਤੁਲਨਾ ਕਰੋ; ਕੇਵਲ ਲੋੜ ਹੋਣ ਉੱਤੇ ਇੱਕ ਜੋੜੋ।');
      steps = [
        native(locale, `${first} की पुरानी संदर्भ स्थिति = ${targetStart}।`, `${first} ਦੀ ਪੁਰਾਣੀ ਹਵਾਲਾ ਸਥਿਤੀ = ${targetStart}।`),
        native(locale, `नया ${context.memberSingular} नई कुल संख्या ${totalAfter} में संदर्भ स्थिति ${insertedStart} पर है।`, `ਨਵਾਂ ${context.memberSingular} ਨਵੀਂ ਕੁੱਲ ਗਿਣਤੀ ${totalAfter} ਵਿੱਚ ਹਵਾਲਾ ਸਥਿਤੀ ${insertedStart} ਉੱਤੇ ਹੈ।`),
        native(locale, `इसलिए ${first} की नई संदर्भ स्थिति = ${finalStart} और माँगी गई रैंक = ${requested}।`, `ਇਸ ਲਈ ${first} ਦੀ ਨਵੀਂ ਹਵਾਲਾ ਸਥਿਤੀ = ${finalStart} ਅਤੇ ਮੰਗੀ ਰੈਂਕ = ${requested}।`),
      ];
      break;
    }
    case 'TARGET_RANK_AFTER_REMOVAL': {
      const targetStart = toStartRank(evidence.totalBefore, evidence.targetOriginalRank, evidence.targetOriginalSide);
      const removedStart = toStartRank(evidence.totalBefore, evidence.removedOriginalRank, evidence.removedOriginalSide);
      const finalStart = removedStart < targetStart ? targetStart - 1 : targetStart;
      const totalAfter = evidence.totalBefore - 1;
      const requested = fromStartRank(totalAfter, finalStart, evidence.requestedSide);
      keyRule = native(locale, 'लक्ष्य से पहले वाला सदस्य हटे तो लक्ष्य एक स्थान आगे आता है; लक्ष्य के बाद वाला सदस्य हटे तो लक्ष्य की संदर्भ स्थिति नहीं बदलती।', 'ਟੀਚੇ ਤੋਂ ਪਹਿਲਾਂ ਵਾਲਾ ਮੈਂਬਰ ਹਟੇ ਤਾਂ ਟੀਚਾ ਇੱਕ ਸਥਾਨ ਅੱਗੇ ਆਉਂਦਾ ਹੈ; ਟੀਚੇ ਤੋਂ ਬਾਅਦ ਵਾਲਾ ਮੈਂਬਰ ਹਟੇ ਤਾਂ ਟੀਚੇ ਦੀ ਹਵਾਲਾ ਸਥਿਤੀ ਨਹੀਂ ਬਦਲਦੀ।');
      shortcut = native(locale, 'हटाए गए सदस्य की संदर्भ स्थिति लक्ष्य से तुलना करें; केवल पहले होने पर एक घटाएँ।', 'ਹਟਾਏ ਮੈਂਬਰ ਦੀ ਹਵਾਲਾ ਸਥਿਤੀ ਟੀਚੇ ਨਾਲ ਤੁਲਨਾ ਕਰੋ; ਕੇਵਲ ਪਹਿਲਾਂ ਹੋਣ ਉੱਤੇ ਇੱਕ ਘਟਾਓ।');
      steps = [
        native(locale, `${first} की पुरानी संदर्भ स्थिति = ${targetStart}।`, `${first} ਦੀ ਪੁਰਾਣੀ ਹਵਾਲਾ ਸਥਿਤੀ = ${targetStart}।`),
        native(locale, `हटने वाले ${context.memberSingular} की संदर्भ स्थिति = ${removedStart}।`, `ਹਟਣ ਵਾਲੇ ${context.memberSingular} ਦੀ ਹਵਾਲਾ ਸਥਿਤੀ = ${removedStart}।`),
        native(locale, `नई कुल संख्या ${totalAfter}; ${first} की नई संदर्भ स्थिति ${finalStart}; माँगी गई रैंक ${requested}।`, `ਨਵੀਂ ਕੁੱਲ ਗਿਣਤੀ ${totalAfter}; ${first} ਦੀ ਨਵੀਂ ਹਵਾਲਾ ਸਥਿਤੀ ${finalStart}; ਮੰਗੀ ਰੈਂਕ ${requested}।`),
      ];
      break;
    }
    case 'FINAL_RANK_AFTER_SEQUENTIAL_MOVES': {
      const originalStart = toStartRank(evidence.total, evidence.originalRank, evidence.originalSide);
      const afterFirst = originalStart + (evidence.firstDirection === 'TOWARD_START' ? -evidence.firstDistance : evidence.firstDistance);
      const afterSecond = afterFirst + (evidence.secondDirection === 'TOWARD_START' ? -evidence.secondDistance : evidence.secondDistance);
      const requested = fromStartRank(evidence.total, afterSecond, evidence.requestedSide);
      keyRule = native(locale, 'दो क्रमिक चालों को उसी क्रम में एक ही संदर्भ रेखा पर लागू करें।', 'ਦੋ ਲਗਾਤਾਰ ਚਾਲਾਂ ਨੂੰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਇੱਕੋ ਹਵਾਲਾ ਰੇਖਾ ਉੱਤੇ ਲਾਗੂ ਕਰੋ।');
      shortcut = native(locale, 'संदर्भ सिरे की ओर चाल को ऋण और उससे दूर चाल को धन मानकर क्रम से जोड़ें।', 'ਹਵਾਲਾ ਸਿਰੇ ਵੱਲ ਚਾਲ ਨੂੰ ਘਟਾਅ ਅਤੇ ਉਸ ਤੋਂ ਦੂਰ ਚਾਲ ਨੂੰ ਜੋੜ ਮੰਨ ਕੇ ਕ੍ਰਮ ਨਾਲ ਲਗਾਓ।');
      steps = [
        native(locale, `मूल संदर्भ स्थिति = ${originalStart}।`, `ਮੂਲ ਹਵਾਲਾ ਸਥਿਤੀ = ${originalStart}।`),
        native(locale, `पहली चाल के बाद = ${afterFirst}।`, `ਪਹਿਲੀ ਚਾਲ ਤੋਂ ਬਾਅਦ = ${afterFirst}।`),
        native(locale, `दूसरी चाल के बाद = ${afterSecond}; माँगे गए सिरे से रैंक = ${requested}।`, `ਦੂਜੀ ਚਾਲ ਤੋਂ ਬਾਅਦ = ${afterSecond}; ਮੰਗੇ ਸਿਰੇ ਤੋਂ ਰੈਂਕ = ${requested}।`),
      ];
      break;
    }
    case 'TARGET_RANK_AFTER_ANOTHER_PERSON_MOVES':
    case 'ORIGINAL_TARGET_RANK_BEFORE_ANOTHER_PERSON_MOVED': {
      const isDirect = evidence.kind === 'TARGET_RANK_AFTER_ANOTHER_PERSON_MOVES';
      const target = isDirect ? first : second;
      const mover = isDirect ? second : first;
      const originalStart = isDirect
        ? toStartRank(evidence.total, evidence.targetOriginalRank, evidence.targetOriginalSide)
        : toStartRank(evidence.total, Number(answer), evidence.requestedSide);
      const finalStart = otherTargetAfterMove(originalStart, evidence.moverOriginalRankFromStart, evidence.moverFinalRankFromStart);
      const crossed = originalStart !== finalStart;
      keyRule = native(locale, 'एक व्यक्ति की चाल से दूसरे व्यक्ति की रैंक केवल तभी एक स्थान बदलती है जब चलने वाला व्यक्ति उसे पार करता है।', 'ਇੱਕ ਵਿਅਕਤੀ ਦੀ ਚਾਲ ਨਾਲ ਦੂਜੇ ਦੀ ਰੈਂਕ ਕੇਵਲ ਤਦ ਇੱਕ ਸਥਾਨ ਬਦਲਦੀ ਹੈ ਜਦ ਚੱਲਣ ਵਾਲਾ ਵਿਅਕਤੀ ਉਸ ਨੂੰ ਪਾਰ ਕਰਦਾ ਹੈ।');
      shortcut = native(locale, 'सिर्फ यह जाँचें कि चलने वाला व्यक्ति लक्ष्य को पार करता है या नहीं; पार करने पर एक स्थान का प्रभाव लगता है।', 'ਕੇਵਲ ਇਹ ਵੇਖੋ ਕਿ ਚੱਲਣ ਵਾਲਾ ਵਿਅਕਤੀ ਟੀਚੇ ਨੂੰ ਪਾਰ ਕਰਦਾ ਹੈ ਜਾਂ ਨਹੀਂ; ਪਾਰ ਕਰਨ ਉੱਤੇ ਇੱਕ ਸਥਾਨ ਦਾ ਅਸਰ ਲੱਗਦਾ ਹੈ।');
      steps = [
        native(locale, `${target} की मूल संदर्भ स्थिति = ${originalStart}।`, `${target} ਦੀ ਮੂਲ ਹਵਾਲਾ ਸਥਿਤੀ = ${originalStart}।`),
        native(locale, `${mover} संदर्भ स्थिति ${evidence.moverOriginalRankFromStart} से ${evidence.moverFinalRankFromStart} पर जाता है।`, `${mover} ਹਵਾਲਾ ਸਥਿਤੀ ${evidence.moverOriginalRankFromStart} ਤੋਂ ${evidence.moverFinalRankFromStart} ਉੱਤੇ ਜਾਂਦਾ ਹੈ।`),
        native(locale, crossed ? `चाल लक्ष्य को पार करती है, इसलिए लक्ष्य की संदर्भ स्थिति एक बदलकर ${finalStart} होती है।` : `चाल लक्ष्य को पार नहीं करती, इसलिए लक्ष्य की संदर्भ स्थिति ${finalStart} ही रहती है।`, crossed ? `ਚਾਲ ਟੀਚੇ ਨੂੰ ਪਾਰ ਕਰਦੀ ਹੈ, ਇਸ ਲਈ ਟੀਚੇ ਦੀ ਹਵਾਲਾ ਸਥਿਤੀ ਇੱਕ ਬਦਲ ਕੇ ${finalStart} ਹੁੰਦੀ ਹੈ।` : `ਚਾਲ ਟੀਚੇ ਨੂੰ ਪਾਰ ਨਹੀਂ ਕਰਦੀ, ਇਸ ਲਈ ਟੀਚੇ ਦੀ ਹਵਾਲਾ ਸਥਿਤੀ ${finalStart} ਹੀ ਰਹਿੰਦੀ ਹੈ।`),
        native(locale, isDirect ? `माँगे गए सिरे से नई रैंक ${answer} है।` : `उलटा प्रभाव लगाने पर माँगे गए सिरे से मूल रैंक ${answer} है।`, isDirect ? `ਮੰਗੇ ਸਿਰੇ ਤੋਂ ਨਵੀਂ ਰੈਂਕ ${answer} ਹੈ।` : `ਉਲਟ ਅਸਰ ਲਗਾਉਣ ਉੱਤੇ ਮੰਗੇ ਸਿਰੇ ਤੋਂ ਮੂਲ ਰੈਂਕ ${answer} ਹੈ।`),
      ];
      break;
    }
    case 'FINAL_RANK_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE':
    case 'ORIGINAL_RANK_FROM_FINAL_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE': {
      const isDirect = evidence.kind === 'FINAL_RANK_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE';
      const originalStart = isDirect
        ? toStartRank(evidence.totalBefore, evidence.originalRank, evidence.originalSide)
        : toStartRank(evidence.totalBefore, Number(answer), evidence.requestedSide);
      const initial: RankState = { total: evidence.totalBefore, rankFromStart: originalStart };
      const afterFirst = evidence.operationOrder === 'MOVE_THEN_CHANGE'
        ? applyMovement(initial, evidence.movementDirection, evidence.movementDistance)
        : applyMembership(initial, evidence.membershipKind, evidence.membershipSide, evidence.membershipCount);
      const afterSecond = evidence.operationOrder === 'MOVE_THEN_CHANGE'
        ? applyMembership(afterFirst, evidence.membershipKind, evidence.membershipSide, evidence.membershipCount)
        : applyMovement(afterFirst, evidence.movementDirection, evidence.movementDistance);
      keyRule = native(locale, 'कुल संख्या और संदर्भ सिरे से लक्ष्य की स्थिति दोनों साथ रखें; दोनों बदलाव दिए गए क्रम में लागू करें।', 'ਕੁੱਲ ਗਿਣਤੀ ਅਤੇ ਹਵਾਲਾ ਸਿਰੇ ਤੋਂ ਟੀਚੇ ਦੀ ਸਥਿਤੀ ਦੋਵੇਂ ਨਾਲ ਰੱਖੋ; ਦੋਵੇਂ ਬਦਲਾਅ ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਓ।');
      shortcut = native(locale, 'दो मानों की सूची रखें: वर्तमान कुल और वर्तमान संदर्भ रैंक; हर बदलाव के बाद दोनों को अद्यतन करें।', 'ਦੋ ਮੁੱਲਾਂ ਦੀ ਲੜੀ ਰੱਖੋ: ਮੌਜੂਦਾ ਕੁੱਲ ਅਤੇ ਮੌਜੂਦਾ ਹਵਾਲਾ ਰੈਂਕ; ਹਰ ਬਦਲਾਅ ਤੋਂ ਬਾਅਦ ਦੋਵੇਂ ਨਵੇਂ ਕਰੋ।');
      steps = [
        native(locale, `शुरुआत: कुल ${initial.total}, ${first} की संदर्भ स्थिति ${initial.rankFromStart}।`, `ਸ਼ੁਰੂਆਤ: ਕੁੱਲ ${initial.total}, ${first} ਦੀ ਹਵਾਲਾ ਸਥਿਤੀ ${initial.rankFromStart}।`),
        native(locale, `पहले बदलाव के बाद: कुल ${afterFirst.total}, संदर्भ स्थिति ${afterFirst.rankFromStart}।`, `ਪਹਿਲੇ ਬਦਲਾਅ ਤੋਂ ਬਾਅਦ: ਕੁੱਲ ${afterFirst.total}, ਹਵਾਲਾ ਸਥਿਤੀ ${afterFirst.rankFromStart}।`),
        native(locale, `दूसरे बदलाव के बाद: कुल ${afterSecond.total}, संदर्भ स्थिति ${afterSecond.rankFromStart}।`, `ਦੂਜੇ ਬਦਲਾਅ ਤੋਂ ਬਾਅਦ: ਕੁੱਲ ${afterSecond.total}, ਹਵਾਲਾ ਸਥਿਤੀ ${afterSecond.rankFromStart}।`),
        native(locale, isDirect ? `माँगे गए सिरे से अंतिम रैंक ${answer} है।` : `अंतिम स्थिति से क्रम उलटकर माँगे गए सिरे से मूल रैंक ${answer} मिलती है।`, isDirect ? `ਮੰਗੇ ਸਿਰੇ ਤੋਂ ਅੰਤਿਮ ਰੈਂਕ ${answer} ਹੈ।` : `ਅੰਤਿਮ ਸਥਿਤੀ ਤੋਂ ਕ੍ਰਮ ਉਲਟ ਕੇ ਮੰਗੇ ਸਿਰੇ ਤੋਂ ਮੂਲ ਰੈਂਕ ${answer} ਮਿਲਦੀ ਹੈ।`),
      ];
      break;
    }
    default:
      throw new Error(`Unknown CP003 explanation evidence kind ${evidence.kind}`);
  }

  const optionAnalysis = options.map((option, index) => native(
    locale,
    `विकल्प ${index + 1} (${option.label}): ${option.explanation}`,
    `ਵਿਕਲਪ ${index + 1} (${option.label}): ${option.explanation}`,
  ));
  const conclusion = native(locale, `अतः सही उत्तर ${answer} है।`, `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`);
  return {
    keyRule,
    stepByStepSolution: steps,
    examSpeedShortcut: shortcut,
    optionAnalysis,
    conclusion,
  };
}

export function rnkCp003CanonicalSemanticFingerprint(question: AnyQuestion): string {
  return sha256({
    packageId: question.packageId,
    checkpointId: question.checkpointId,
    permanentQlId: question.permanentQlId,
    prototypeId: question.prototypeId,
    seed: question.seed,
    contextId: question.contextId,
    displayedEvidence: question.displayedEvidence,
    answerSemantic: question.answerSemantic ?? null,
    answerKey: question.answerKey ?? null,
    answer: question.answer,
    optionSemantics: question.options.map((option: AnyQuestion) => ({
      value: optionSemanticValue(option),
      misconceptionId: option.misconceptionId,
    })),
    correctIndex: question.correctIndex,
    difficulty: question.difficulty,
    mathematicalFingerprint: question.mathematicalFingerprint,
  });
}

export function localizeRnkCp003PermanentQuestion(
  question: AnyQuestion,
  locale: RnkCp003LocalizedLocale,
): RnkCp003LocalizedReviewQuestion {
  const canonicalNames = canonicalNamesForQuestion(question);
  if (canonicalNames.length < 1) throw new Error(`No canonical CP003 name found at ${question.permanentQlId}:${question.seed}`);
  const localizedNames = canonicalNames.map((name) => localizedName(name, locale));
  const context = contextFor(String(question.contextId), locale);
  const answer = localizeAnswer(question, localizedNames);
  const options = localizeOptions(question, localizedNames, locale);
  const stem = buildStem(question, localizedNames, context, locale);
  const explanation = buildExplanation(question, localizedNames, answer, options, context, locale);
  const canonicalSemanticFingerprint = rnkCp003CanonicalSemanticFingerprint(question);
  const localizationFingerprint = sha256({
    version: RNK_CP003_LOCALIZATION_REVIEW_VERSION,
    locale,
    permanentQlId: question.permanentQlId,
    prototypeId: question.prototypeId,
    seed: question.seed,
    stem,
    answer,
    options: options.map((option) => ({
      value: optionSemanticValue(option),
      label: option.label,
      misconceptionId: option.misconceptionId,
      explanation: option.explanation,
    })),
    explanation,
  });

  const localized: AnyQuestion = {
    ...question,
    locale,
    canonicalLocale: 'en-IN',
    canonicalNames,
    localizedNames,
    stem,
    answer,
    options,
    explanation,
    localizationMetadata: {
      version: RNK_CP003_LOCALIZATION_REVIEW_VERSION,
      locale,
      learnerTextLocalized: true,
      structuredEvidenceRendered: true,
      canonicalOutcomePreserved: true,
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
      authority: RNK_CP003_LOCALIZATION_REVIEW_AUTHORITY,
      canonicalLocale: 'en-IN',
      locale,
      permanentQlId: question.permanentQlId,
      canonicalSemanticFingerprint,
      localizationFingerprint,
      semanticParity: 'EXECUTABLE_PROVED',
      learnerSurfaceSource: 'STRUCTURED_DISPLAYED_EVIDENCE',
      canonicalOutcomeSource: 'FROZEN_PERMANENT_RUNTIME',
      humanLanguageReviewRequired: true,
      multilingualFreezeGranted: false,
      productDeliveryUnlocked: false,
    },
  };

  if (typeof question.firstName === 'string') {
    localized.canonicalFirstName = question.firstName;
    localized.firstName = localizedNames[0];
  }
  if (typeof question.secondName === 'string') {
    localized.canonicalSecondName = question.secondName;
    localized.secondName = localizedNames[1];
  }

  return localized as RnkCp003LocalizedReviewQuestion;
}

export function buildRnkCp003LocalizedReviewBank(
  locale: RnkCp003LocalizedLocale,
  seedsPerQl = 192,
): readonly RnkCp003LocalizedReviewQuestion[] {
  return RNK_CP003_PERMANENT_QL_IDS.flatMap((qlId) =>
    Array.from({ length: seedsPerQl }, (_, seed) =>
      localizeRnkCp003PermanentQuestion(generateRnkCp003PermanentQuestion(qlId, seed), locale),
    ),
  );
}
