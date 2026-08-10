import type { ProbabilityNativeLanguage } from "./multilingual-foundation";

type NativePair = Readonly<{ hi: string; pa: string }>;

const pair = (hi: string, pa: string): NativePair => ({ hi, pa });
const pick = (language: ProbabilityNativeLanguage, value: NativePair): string => value[language];

/**
 * Shared student-facing vocabulary only.
 *
 * These entries are not editorial approval for any QL. They are reusable primitives
 * that future native editorial libraries may reference while English remains the
 * sole mathematical/runtime authority.
 */
export const PROBABILITY_NATIVE_TERMS = {
  PROBABILITY: pair("प्रायिकता", "ਸੰਭਾਵਨਾ"),
  EVENT: pair("घटना", "ਘਟਨਾ"),
  EVENTS: pair("घटनाएँ", "ਘਟਨਾਵਾਂ"),
  OUTCOME: pair("परिणाम", "ਨਤੀਜਾ"),
  OUTCOMES: pair("परिणाम", "ਨਤੀਜੇ"),
  FAVOURABLE_OUTCOME: pair("अनुकूल परिणाम", "ਅਨੁਕੂਲ ਨਤੀਜਾ"),
  FAVOURABLE_OUTCOMES: pair("अनुकूल परिणाम", "ਅਨੁਕੂਲ ਨਤੀਜੇ"),
  TOTAL_OUTCOMES: pair("कुल परिणाम", "ਕੁੱਲ ਨਤੀਜੇ"),
  SAMPLE_SPACE: pair("प्रतिदर्श समष्टि", "ਨਮੂਨਾ ਅਵਕਾਸ"),
  COMPLEMENT_EVENT: pair("पूरक घटना", "ਪੂਰਕ ਘਟਨਾ"),
  CONDITIONAL_PROBABILITY: pair("सशर्त प्रायिकता", "ਸ਼ਰਤੀ ਸੰਭਾਵਨਾ"),
  INDEPENDENT_EVENTS: pair("स्वतंत्र घटनाएँ", "ਸੁਤੰਤਰ ਘਟਨਾਵਾਂ"),
  MUTUALLY_EXCLUSIVE_EVENTS: pair("परस्पर अपवर्ती घटनाएँ", "ਪਰਸਪਰ ਅਲੱਗ ਘਟਨਾਵਾਂ"),
  WITH_REPLACEMENT: pair("पुनःस्थापन सहित", "ਵਾਪਸ ਰੱਖ ਕੇ"),
  WITHOUT_REPLACEMENT: pair("पुनःस्थापन के बिना", "ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ"),
  ORDER_MATTERS: pair("क्रम महत्वपूर्ण है", "ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ"),
  ORDER_DOES_NOT_MATTER: pair("क्रम महत्वपूर्ण नहीं है", "ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੈ"),
  EXACTLY: pair("ठीक", "ਬਿਲਕੁਲ"),
  AT_LEAST: pair("कम से कम", "ਘੱਟੋ-ਘੱਟ"),
  AT_MOST: pair("अधिकतम", "ਵੱਧ ਤੋਂ ਵੱਧ"),
  AND: pair("और", "ਅਤੇ"),
  OR: pair("या", "ਜਾਂ"),
  NOT: pair("नहीं", "ਨਹੀਂ"),
  GIVEN_THAT: pair("यह दिया है कि", "ਇਹ ਦਿੱਤਾ ਹੈ ਕਿ"),
  CHOOSE: pair("चुनें", "ਚੁਣੋ"),
  ARRANGE: pair("क्रम में रखें", "ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਓ"),
  SELECTION: pair("चयन", "ਚੋਣ"),
  ARRANGEMENT: pair("व्यवस्था", "ਵਿਉਂਤ"),
  PERMUTATION: pair("क्रमचय", "ਕ੍ਰਮਚਯ"),
  COMBINATION: pair("संचय", "ਸੰਚਯ"),
  COMMITTEE: pair("समिति", "ਕਮੇਟੀ"),
  COIN: pair("सिक्का", "ਸਿੱਕਾ"),
  COINS: pair("सिक्के", "ਸਿੱਕੇ"),
  HEAD: pair("चित", "ਚਿੱਤ"),
  HEADS: pair("चित", "ਚਿੱਤ"),
  TAIL: pair("पट", "ਪੱਟ"),
  TAILS: pair("पट", "ਪੱਟ"),
  DIE: pair("पासा", "ਪਾਸਾ"),
  DICE: pair("पासे", "ਪਾਸੇ"),
  CARD: pair("पत्ता", "ਪੱਤਾ"),
  CARDS: pair("पत्ते", "ਪੱਤੇ"),
  DECK: pair("ताश की गड्डी", "ਤਾਸ਼ ਦੀ ਗੱਡੀ"),
  BAG: pair("थैला", "ਥੈਲਾ"),
  URN: pair("पात्र", "ਭਾਂਡਾ"),
  BALL: pair("गेंद", "ਗੇਂਦ"),
  BALLS: pair("गेंदें", "ਗੇਂਦਾਂ"),
  SPINNER: pair("घूमने वाला चक्र", "ਘੁੰਮਣ ਵਾਲਾ ਚੱਕਰ"),
  NUMBER: pair("संख्या", "ਸੰਖਿਆ"),
  NUMBERS: pair("संख्याएँ", "ਸੰਖਿਆਵਾਂ"),
  RED: pair("लाल", "ਲਾਲ"),
  BLUE: pair("नीला", "ਨੀਲਾ"),
  GREEN: pair("हरा", "ਹਰਾ"),
  YELLOW: pair("पीला", "ਪੀਲਾ"),
  BLACK: pair("काला", "ਕਾਲਾ"),
  WHITE: pair("सफेद", "ਚਿੱਟਾ"),
  HEART: pair("हार्ट", "ਹਾਰਟ"),
  HEARTS: pair("हार्ट्स", "ਹਾਰਟਸ"),
  DIAMOND: pair("डायमंड", "ਡਾਇਮੰਡ"),
  DIAMONDS: pair("डायमंड्स", "ਡਾਇਮੰਡਸ"),
  CLUB: pair("क्लब", "ਕਲੱਬ"),
  CLUBS: pair("क्लब्स", "ਕਲੱਬਸ"),
  SPADE: pair("स्पेड", "ਸਪੇਡ"),
  SPADES: pair("स्पेड्स", "ਸਪੇਡਸ"),
  ACE: pair("इक्का", "ਇੱਕਾ"),
  KING: pair("बादशाह", "ਬਾਦਸ਼ਾਹ"),
  QUEEN: pair("बेगम", "ਬੇਗਮ"),
  JACK: pair("गुलाम", "ਗੁਲਾਮ"),
  CRICKET: pair("क्रिकेट", "ਕ੍ਰਿਕਟ"),
  FOOTBALL: pair("फुटबॉल", "ਫੁੱਟਬਾਲ"),
  APPROACH: pair("विधि", "ਵਿਧੀ"),
  WORKING: pair("गणना", "ਗਣਨਾ"),
  SIMPLIFICATION: pair("सरलीकरण", "ਸਰਲੀਕਰਨ"),
  KEY_POINT: pair("मुख्य बिंदु", "ਮੁੱਖ ਬਿੰਦੂ"),
  ANSWER: pair("उत्तर", "ਉੱਤਰ"),
  FINAL_ANSWER: pair("अंतिम उत्तर", "ਅੰਤਿਮ ਉੱਤਰ"),
} as const;

export type ProbabilityNativeTermId = keyof typeof PROBABILITY_NATIVE_TERMS;
export const PROBABILITY_NATIVE_TERM_IDS = Object.keys(
  PROBABILITY_NATIVE_TERMS,
) as readonly ProbabilityNativeTermId[];

export const PROBABILITY_NATIVE_NUMBER_POLICY = Object.freeze({
  digits: "ASCII_0_9",
  decimalSeparator: ".",
  fractionStyle: "PRESERVE_SOURCE_FRACTION",
  percentStyle: "PRESERVE_SOURCE_PERCENT",
  ratioStyle: "PRESERVE_SOURCE_RATIO",
  mathJaxStyle: "PRESERVE_SOURCE_MATHJAX",
} as const);

const PRIMITIVE_TOKEN_TO_TERM: Readonly<Record<string, ProbabilityNativeTermId>> = {
  probability: "PROBABILITY",
  event: "EVENT",
  events: "EVENTS",
  outcome: "OUTCOME",
  outcomes: "OUTCOMES",
  coin: "COIN",
  coins: "COINS",
  head: "HEAD",
  heads: "HEADS",
  tail: "TAIL",
  tails: "TAILS",
  die: "DIE",
  dice: "DICE",
  card: "CARD",
  cards: "CARDS",
  deck: "DECK",
  bag: "BAG",
  urn: "URN",
  ball: "BALL",
  balls: "BALLS",
  spinner: "SPINNER",
  number: "NUMBER",
  numbers: "NUMBERS",
  red: "RED",
  blue: "BLUE",
  green: "GREEN",
  yellow: "YELLOW",
  black: "BLACK",
  white: "WHITE",
  heart: "HEART",
  hearts: "HEARTS",
  diamond: "DIAMOND",
  diamonds: "DIAMONDS",
  club: "CLUB",
  clubs: "CLUBS",
  spade: "SPADE",
  spades: "SPADES",
  ace: "ACE",
  king: "KING",
  queen: "QUEEN",
  jack: "JACK",
  cricket: "CRICKET",
  football: "FOOTBALL",
  "with replacement": "WITH_REPLACEMENT",
  "without replacement": "WITHOUT_REPLACEMENT",
};

const EXACT_TEXTUAL_OPTIONS: Readonly<Record<string, NativePair>> = {
  "none of these": pair("इनमें से कोई नहीं", "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ"),
  "cannot be determined": pair("निर्धारित नहीं किया जा सकता", "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ"),
  "all of these": pair("ये सभी", "ਇਹ ਸਾਰੇ"),
  "both a and b": pair("A और B दोनों", "A ਅਤੇ B ਦੋਵੇਂ"),
  "both a and c": pair("A और C दोनों", "A ਅਤੇ C ਦੋਵੇਂ"),
  "both b and c": pair("B और C दोनों", "B ਅਤੇ C ਦੋਵੇਂ"),
  "only a": pair("केवल A", "ਕੇਵਲ A"),
  "only b": pair("केवल B", "ਕੇਵਲ B"),
  "only c": pair("केवल C", "ਕੇਵਲ C"),
  "either a or b": pair("A या B में से कोई एक", "A ਜਾਂ B ਵਿੱਚੋਂ ਕੋਈ ਇੱਕ"),
  "neither a nor b": pair("न A, न B", "ਨਾ A, ਨਾ B"),
  always: pair("हमेशा", "ਹਮੇਸ਼ਾਂ"),
  never: pair("कभी नहीं", "ਕਦੇ ਨਹੀਂ"),
  equal: pair("समान", "ਬਰਾਬਰ"),
  "same probability": pair("समान प्रायिकता", "ਇੱਕੋ ਸੰਭਾਵਨਾ"),
  "both are equally likely": pair("दोनों की प्रायिकता समान है", "ਦੋਵਾਂ ਦੀ ਸੰਭਾਵਨਾ ਇੱਕੋ ਹੈ"),
};

// U+0964/U+0965 (danda/double danda) are shared Indic punctuation and are
// intentionally excluded from the Devanagari script detector so Punjabi prose
// ending in "।" is not falsely classified as mixed Hindi/Punjabi script.
const DEVANAGARI = /[\u0900-\u0963\u0966-\u097F]/u;
const GURMUKHI = /[\u0A00-\u0A7F]/u;
const LATIN_TOKEN = /\b[A-Za-z][A-Za-z0-9_-]*\b/g;

function lookupKey(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function getProbabilityNativeTerm(
  termId: ProbabilityNativeTermId,
  language: ProbabilityNativeLanguage,
): string {
  return pick(language, PROBABILITY_NATIVE_TERMS[termId]);
}

export function localizeProbabilityPrimitiveToken(
  value: string,
  language: ProbabilityNativeLanguage,
): string {
  const termId = PRIMITIVE_TOKEN_TO_TERM[lookupKey(value)];
  if (!termId) {
    throw new Error(
      `Unsupported Probability native primitive token: ${JSON.stringify(value)}. Add an approved shared primitive or handle it in the QL editorial entry.`,
    );
  }
  return getProbabilityNativeTerm(termId, language);
}

/**
 * Probability answer options are currently numeric/fraction/ratio/percent strings.
 * The native layer must preserve them byte-for-byte so the English solver remains
 * the answer-key authority. A small closed set of future textual options is mapped
 * explicitly; unknown prose fails closed.
 */
export function isProbabilityMathOrNumericOption(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (/^[+-]?\d+(?:\.\d+)?%?$/u.test(trimmed)) return true;
  if (/^[+-]?\d+\s*\/\s*[+-]?\d+%?$/u.test(trimmed)) return true;
  if (/^[+-]?\d+\s*:\s*[+-]?\d+$/u.test(trimmed)) return true;
  if (/^\\\([\s\S]*\\\)$/u.test(trimmed)) return true;
  if (/^\\\[[\s\S]*\\\]$/u.test(trimmed)) return true;
  if (/^\$\$[\s\S]*\$\$$/u.test(trimmed)) return true;
  if (/^\$[^\n$]+\$$/u.test(trimmed)) return true;
  if (/^\\(?:d?frac|binom)\s*\{[^{}]+\}\s*\{[^{}]+\}%?$/u.test(trimmed)) return true;
  return false;
}

export function localizeProbabilityOption(
  value: string,
  language: ProbabilityNativeLanguage,
): string {
  if (isProbabilityMathOrNumericOption(value)) return value;

  const key = lookupKey(value);
  const exact = EXACT_TEXTUAL_OPTIONS[key];
  if (exact) return pick(language, exact);

  const primitive = PRIMITIVE_TOKEN_TO_TERM[key];
  if (primitive) return getProbabilityNativeTerm(primitive, language);

  throw new Error(
    `Probability ${language} option localisation is fail-closed for unknown prose: ${JSON.stringify(value)}.`,
  );
}

export function preserveProbabilityNativeNumericDisplay(value: string | number | bigint): string {
  const display = typeof value === "string" ? value : value.toString();
  if (!isProbabilityMathOrNumericOption(display)) {
    throw new Error(`Probability numeric display is not an approved numeric/math form: ${JSON.stringify(display)}.`);
  }
  return display;
}

export function stripProbabilityMathForLanguageAudit(value: string): string {
  return value
    .replace(/\\\[[\s\S]*?\\\]/g, " ")
    .replace(/\\\([\s\S]*?\\\)/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$[^\n$]*\$/g, " ");
}

export function listUnresolvedProbabilityPlaceholders(value: string): readonly string[] {
  const prose = stripProbabilityMathForLanguageAudit(value);
  const unresolved = new Set<string>();
  const patterns = [
    /\{\{\s*([A-Za-z_][A-Za-z0-9_.-]*)\s*\}\}/g,
    /\$\{\s*([A-Za-z_][A-Za-z0-9_.-]*)\s*\}/g,
    /\{\s*([A-Za-z_][A-Za-z0-9_.-]*)\s*\}/g,
  ];
  for (const pattern of patterns) {
    for (const match of prose.matchAll(pattern)) unresolved.add(match[1]!);
  }
  return [...unresolved].sort();
}

export type ProbabilityNativeTextAudit = Readonly<{
  valid: boolean;
  language: ProbabilityNativeLanguage;
  hasNativeScript: boolean;
  hasWrongNativeScript: boolean;
  unresolvedPlaceholders: readonly string[];
  disallowedLatinTokens: readonly string[];
  mathOnly: boolean;
}>;

export function auditProbabilityNativeText(
  value: string,
  language: ProbabilityNativeLanguage,
  options: Readonly<{
    allowMathOnly?: boolean;
    allowedLatinTokens?: readonly string[];
  }> = {},
): ProbabilityNativeTextAudit {
  const prose = stripProbabilityMathForLanguageAudit(value);
  const unresolvedPlaceholders = listUnresolvedProbabilityPlaceholders(value);
  const targetScript = language === "hi" ? DEVANAGARI : GURMUKHI;
  const otherScript = language === "hi" ? GURMUKHI : DEVANAGARI;
  const hasNativeScript = targetScript.test(prose);
  const hasWrongNativeScript = otherScript.test(prose);
  const allowedLatin = new Set((options.allowedLatinTokens ?? []).map((token) => token.toLowerCase()));
  const disallowedLatinTokens = [...new Set(prose.match(LATIN_TOKEN) ?? [])]
    .filter((token) => token.length > 1 && !allowedLatin.has(token.toLowerCase()))
    .sort();
  const neutral = prose
    .replace(/[\u0900-\u097F\u0A00-\u0A7F]/gu, "")
    .replace(/[A-Za-z0-9\s.,:;!?()[\]{}%+\-=/*×÷'"–—_]/g, "");
  const mathOnly = !prose.trim() || (!hasNativeScript && disallowedLatinTokens.length === 0 && neutral.trim().length === 0);
  const valid =
    unresolvedPlaceholders.length === 0 &&
    !hasWrongNativeScript &&
    disallowedLatinTokens.length === 0 &&
    (hasNativeScript || (Boolean(options.allowMathOnly) && mathOnly));

  return {
    valid,
    language,
    hasNativeScript,
    hasWrongNativeScript,
    unresolvedPlaceholders,
    disallowedLatinTokens,
    mathOnly,
  };
}

export function assertProbabilityNativeTextValid(
  value: string,
  language: ProbabilityNativeLanguage,
  options: Readonly<{
    allowMathOnly?: boolean;
    allowedLatinTokens?: readonly string[];
  }> = {},
): void {
  const audit = auditProbabilityNativeText(value, language, options);
  if (audit.valid) return;
  throw new Error(
    `Probability ${language} native text failed audit: ${JSON.stringify(audit)}.`,
  );
}
