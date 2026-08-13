import { runNumCp001PermanentPipeline } from "../permanent/runtime";
import type { NumCp001PermanentQlId } from "../permanent/allocation";
import type { NumCp001PermanentQuestion } from "../permanent/runtime";
import type {
  NumCp001LocalizedExplanation,
  NumCp001LocalizedOption,
  NumCp001LocalizedQuestion,
  NumCp001TranslatedLocale,
} from "./types";

export interface NumCp001LocalizedRuntimeInput {
  readonly questionLanguageId?: NumCp001PermanentQlId;
  readonly seed?: number;
  readonly locale: NumCp001TranslatedLocale;
}

type State = Readonly<Record<string, unknown>>;

const tx = (locale: NumCp001TranslatedLocale, hi: string, pa: string): string => locale === "hi-IN" ? hi : pa;

function num(state: State, key: string): number {
  const value = state[key];
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`Missing numeric state ${key}`);
  return value;
}

function bool(state: State, key: string): boolean {
  const value = state[key];
  if (typeof value !== "boolean") throw new Error(`Missing boolean state ${key}`);
  return value;
}

function text(state: State, key: string): string {
  const value = state[key];
  if (value === undefined || value === null) throw new Error(`Missing state ${key}`);
  return String(value);
}

function numberArray(state: State, key: string): number[] {
  const value = state[key];
  if (!Array.isArray(value)) throw new Error(`Missing array state ${key}`);
  return value.map(Number);
}

function booleanArray(state: State, key: string): boolean[] {
  const value = state[key];
  if (!Array.isArray(value)) throw new Error(`Missing array state ${key}`);
  return value.map(Boolean);
}

function objectArray(state: State, key: string): Array<Record<string, unknown>> {
  const value = state[key];
  if (!Array.isArray(value)) throw new Error(`Missing object-array state ${key}`);
  return value.map((entry) => {
    if (!entry || typeof entry !== "object") throw new Error(`Invalid object-array state ${key}`);
    return entry as Record<string, unknown>;
  });
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

function frac(n: number, d: number): string {
  const g = gcd(n, d);
  const sign = d < 0 ? -1 : 1;
  return `${(n / g) * sign}/${Math.abs(d / g)}`;
}

function localizedSetName(value: string, locale: NumCp001TranslatedLocale): string {
  const key = value.toLowerCase();
  const map: Record<string, readonly [string, string]> = {
    "natural numbers": ["प्राकृतिक संख्याएँ", "ਕੁਦਰਤੀ ਸੰਖਿਆਵਾਂ"],
    "whole numbers": ["पूर्ण संख्याएँ", "ਪੂਰਨ ਸੰਖਿਆਵਾਂ"],
    integers: ["पूर्णांक", "ਪੂਰਨ ਅੰਕ"],
    "rational numbers": ["परिमेय संख्याएँ", "ਪਰਿਮੇਯ ਸੰਖਿਆਵਾਂ"],
    "irrational numbers": ["अपरिमेय संख्याएँ", "ਅਪਰਿਮੇਯ ਸੰਖਿਆਵਾਂ"],
    "real numbers": ["वास्तविक संख्याएँ", "ਵਾਸਤਵਿਕ ਸੰਖਿਆਵਾਂ"],
  };
  const pair = map[key];
  return pair ? tx(locale, pair[0], pair[1]) : value;
}

const FIXED_OPTION_TRANSLATIONS: Readonly<Record<NumCp001TranslatedLocale, Readonly<Record<string, string>>>> = {
  "hi-IN": {
    "Natural numbers": "प्राकृतिक संख्याएँ",
    "Whole numbers": "पूर्ण संख्याएँ",
    "Integers": "पूर्णांक",
    "Rational numbers": "परिमेय संख्याएँ",
    "Irrational numbers": "अपरिमेय संख्याएँ",
    "Real numbers": "वास्तविक संख्याएँ",
    "Always true": "सदैव सत्य",
    "True only when n is even": "केवल n के सम होने पर सत्य",
    "True only when n is odd": "केवल n के विषम होने पर सत्य",
    "Never true": "कभी सत्य नहीं",
    "Even": "सम",
    "Odd": "विषम",
    "Cannot be determined": "निर्धारित नहीं किया जा सकता",
    "Neither even nor odd": "न सम, न विषम",
    "No integers": "कोई पूर्णांक नहीं",
    "Exactly one integer": "ठीक एक पूर्णांक",
    "Exactly two integers": "ठीक दो पूर्णांक",
    "At least three integers": "कम-से-कम तीन पूर्णांक",
    "n must be even": "n का सम होना आवश्यक है",
    "n must be odd": "n का विषम होना आवश्यक है",
    "every integer n": "हर पूर्णांक n",
    "no integer n": "कोई भी पूर्णांक n नहीं",
    "Possible": "संभव",
    "Impossible": "असंभव",
    "Possible only if the first integer is even": "केवल तब संभव जब पहला पूर्णांक सम हो",
    "Possible only if the first integer is odd": "केवल तब संभव जब पहला पूर्णांक विषम हो",
    "I only": "केवल I",
    "II only": "केवल II",
    "III only": "केवल III",
    "I and II only": "केवल I और II",
    "I and III only": "केवल I और III",
    "II and III only": "केवल II और III",
    "I, II and III": "I, II और III तीनों",
    "I alone is sufficient": "केवल कथन I पर्याप्त है",
    "II alone is sufficient": "केवल कथन II पर्याप्त है",
    "Both together are sufficient": "दोनों कथन मिलकर पर्याप्त हैं",
    "Even together are insufficient": "दोनों कथन मिलकर भी पर्याप्त नहीं हैं",
  },
  "pa-IN": {
    "Natural numbers": "ਕੁਦਰਤੀ ਸੰਖਿਆਵਾਂ",
    "Whole numbers": "ਪੂਰਨ ਸੰਖਿਆਵਾਂ",
    "Integers": "ਪੂਰਨ ਅੰਕ",
    "Rational numbers": "ਪਰਿਮੇਯ ਸੰਖਿਆਵਾਂ",
    "Irrational numbers": "ਅਪਰਿਮੇਯ ਸੰਖਿਆਵਾਂ",
    "Real numbers": "ਵਾਸਤਵਿਕ ਸੰਖਿਆਵਾਂ",
    "Always true": "ਹਮੇਸ਼ਾ ਸਹੀ",
    "True only when n is even": "ਕੇਵਲ ਜਦੋਂ n ਜਿਸਤ ਹੋਵੇ ਤਾਂ ਸਹੀ",
    "True only when n is odd": "ਕੇਵਲ ਜਦੋਂ n ਟਾਂਕ ਹੋਵੇ ਤਾਂ ਸਹੀ",
    "Never true": "ਕਦੇ ਵੀ ਸਹੀ ਨਹੀਂ",
    "Even": "ਜਿਸਤ",
    "Odd": "ਟਾਂਕ",
    "Cannot be determined": "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ",
    "Neither even nor odd": "ਨਾ ਜਿਸਤ, ਨਾ ਟਾਂਕ",
    "No integers": "ਕੋਈ ਪੂਰਨ ਅੰਕ ਨਹੀਂ",
    "Exactly one integer": "ਠੀਕ ਇੱਕ ਪੂਰਨ ਅੰਕ",
    "Exactly two integers": "ਠੀਕ ਦੋ ਪੂਰਨ ਅੰਕ",
    "At least three integers": "ਘੱਟੋ-ਘੱਟ ਤਿੰਨ ਪੂਰਨ ਅੰਕ",
    "n must be even": "n ਦਾ ਜਿਸਤ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ",
    "n must be odd": "n ਦਾ ਟਾਂਕ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ",
    "every integer n": "ਹਰ ਪੂਰਨ ਅੰਕ n",
    "no integer n": "ਕੋਈ ਵੀ ਪੂਰਨ ਅੰਕ n ਨਹੀਂ",
    "Possible": "ਸੰਭਵ",
    "Impossible": "ਅਸੰਭਵ",
    "Possible only if the first integer is even": "ਕੇਵਲ ਤਦੋਂ ਸੰਭਵ ਜਦੋਂ ਪਹਿਲਾ ਪੂਰਨ ਅੰਕ ਜਿਸਤ ਹੋਵੇ",
    "Possible only if the first integer is odd": "ਕੇਵਲ ਤਦੋਂ ਸੰਭਵ ਜਦੋਂ ਪਹਿਲਾ ਪੂਰਨ ਅੰਕ ਟਾਂਕ ਹੋਵੇ",
    "I only": "ਕੇਵਲ I",
    "II only": "ਕੇਵਲ II",
    "III only": "ਕੇਵਲ III",
    "I and II only": "ਕੇਵਲ I ਅਤੇ II",
    "I and III only": "ਕੇਵਲ I ਅਤੇ III",
    "II and III only": "ਕੇਵਲ II ਅਤੇ III",
    "I, II and III": "I, II ਅਤੇ III ਤਿੰਨੇ",
    "I alone is sufficient": "ਕੇਵਲ ਕਥਨ I ਕਾਫ਼ੀ ਹੈ",
    "II alone is sufficient": "ਕੇਵਲ ਕਥਨ II ਕਾਫ਼ੀ ਹੈ",
    "Both together are sufficient": "ਦੋਵੇਂ ਕਥਨ ਮਿਲ ਕੇ ਕਾਫ਼ੀ ਹਨ",
    "Even together are insufficient": "ਦੋਵੇਂ ਕਥਨ ਮਿਲ ਕੇ ਵੀ ਕਾਫ਼ੀ ਨਹੀਂ ਹਨ",
  },
};

function translateStatementOption(value: string, locale: NumCp001TranslatedLocale): string | null {
  const exact: Record<string, readonly [string, string]> = {
    "0 is an even integer.": ["0 एक सम पूर्णांक है।", "0 ਇੱਕ ਜਿਸਤ ਪੂਰਨ ਅੰਕ ਹੈ।"],
    "0 is an odd integer.": ["0 एक विषम पूर्णांक है।", "0 ਇੱਕ ਟਾਂਕ ਪੂਰਨ ਅੰਕ ਹੈ।"],
    "1 is a natural number.": ["1 एक प्राकृतिक संख्या है।", "1 ਇੱਕ ਕੁਦਰਤੀ ਸੰਖਿਆ ਹੈ।"],
    "0 is a natural number.": ["0 एक प्राकृतिक संख्या है।", "0 ਇੱਕ ਕੁਦਰਤੀ ਸੰਖਿਆ ਹੈ।"],
    "0 is both a whole number and an integer.": ["0 पूर्ण संख्या भी है और पूर्णांक भी।", "0 ਪੂਰਨ ਸੰਖਿਆ ਵੀ ਹੈ ਅਤੇ ਪੂਰਨ ਅੰਕ ਵੀ।"],
  };
  const pair = exact[value];
  if (pair) return tx(locale, pair[0], pair[1]);

  let match = value.match(/^(-?\d+) is a whole number\.$/);
  if (match) return tx(locale, `${match[1]} एक पूर्ण संख्या है।`, `${match[1]} ਇੱਕ ਪੂਰਨ ਸੰਖਿਆ ਹੈ।`);
  match = value.match(/^(-?\d+) is a natural number\.$/);
  if (match) return tx(locale, `${match[1]} एक प्राकृतिक संख्या है।`, `${match[1]} ਇੱਕ ਕੁਦਰਤੀ ਸੰਖਿਆ ਹੈ।`);
  match = value.match(/^(-?\d+) is both an integer and a rational number\.$/);
  if (match) return tx(locale, `${match[1]} पूर्णांक भी है और परिमेय संख्या भी।`, `${match[1]} ਪੂਰਨ ਅੰਕ ਵੀ ਹੈ ਅਤੇ ਪਰਿਮੇਯ ਸੰਖਿਆ ਵੀ।`);
  return null;
}

export function translateNumCp001OptionValue(value: string, locale: NumCp001TranslatedLocale): string {
  const fixed = FIXED_OPTION_TRANSLATIONS[locale][value];
  if (fixed) return fixed;
  const statement = translateStatementOption(value, locale);
  if (statement) return statement;
  return value;
}

function claimText(claimId: string, locale: NumCp001TranslatedLocale): string {
  const map: Record<string, readonly [string, string]> = {
    N_IS_EVEN: ["n सम है", "n ਜਿਸਤ ਹੈ"],
    N_IS_ODD: ["n विषम है", "n ਟਾਂਕ ਹੈ"],
    CONSECUTIVE_PRODUCT_EVEN: ["n(n + 1) सम है", "n(n + 1) ਜਿਸਤ ਹੈ"],
    CONSECUTIVE_PRODUCT_ODD: ["n(n + 1) विषम है", "n(n + 1) ਟਾਂਕ ਹੈ"],
    SQUARE_EVEN: ["n² सम है", "n² ਜਿਸਤ ਹੈ"],
    SQUARE_ODD: ["n² विषम है", "n² ਟਾਂਕ ਹੈ"],
    POLYNOMIAL_ALWAYS_ODD: ["n² + n + 1 विषम है", "n² + n + 1 ਟਾਂਕ ਹੈ"],
    POLYNOMIAL_NEVER_ODD: ["n² + n विषम है", "n² + n ਟਾਂਕ ਹੈ"],
  };
  const pair = map[claimId];
  if (!pair) throw new Error(`Unknown parity claim ${claimId}`);
  return tx(locale, pair[0], pair[1]);
}

function p015Condition(mode: number, locale: NumCp001TranslatedLocale): string {
  const hi = [
    "n और एक विषम पूर्णांक का योग सम है।",
    "n और एक सम पूर्णांक का योग विषम है।",
    "n और एक विषम पूर्णांक का गुणनफल विषम है।",
    "n और एक विषम पूर्णांक का गुणनफल सम है।",
  ];
  const pa = [
    "n ਅਤੇ ਇੱਕ ਟਾਂਕ ਪੂਰਨ ਅੰਕ ਦਾ ਜੋੜ ਜਿਸਤ ਹੈ।",
    "n ਅਤੇ ਇੱਕ ਜਿਸਤ ਪੂਰਨ ਅੰਕ ਦਾ ਜੋੜ ਟਾਂਕ ਹੈ।",
    "n ਅਤੇ ਇੱਕ ਟਾਂਕ ਪੂਰਨ ਅੰਕ ਦਾ ਗੁਣਨਫਲ ਟਾਂਕ ਹੈ।",
    "n ਅਤੇ ਇੱਕ ਟਾਂਕ ਪੂਰਨ ਅੰਕ ਦਾ ਗੁਣਨਫਲ ਜਿਸਤ ਹੈ।",
  ];
  return locale === "hi-IN" ? hi[mode]! : pa[mode]!;
}

function p024Statements(mode: number, locale: NumCp001TranslatedLocale): readonly string[] {
  const hi = [
    ["0 एक सम पूर्णांक है।", "हर पूर्णांक एक प्राकृतिक संख्या है।", "दो विषम पूर्णांकों का योग विषम होता है।"],
    ["हर पूर्ण संख्या ऋणात्मक है।", "दो विषम पूर्णांकों का गुणनफल विषम होता है।", "1 एक सम पूर्णांक है।"],
    ["0 एक पूर्ण संख्या है।", "तीन क्रमागत पूर्णांकों का योग 3 से विभाज्य होता है।", "एक सम और एक विषम पूर्णांक का योग सम होता है।"],
    ["हर परिमेय संख्या पूर्णांक है।", "यदि a < b, तो -a > -b।", "दो सम पूर्णांकों का योग सम होता है।"],
  ] as const;
  const pa = [
    ["0 ਇੱਕ ਜਿਸਤ ਪੂਰਨ ਅੰਕ ਹੈ।", "ਹਰ ਪੂਰਨ ਅੰਕ ਇੱਕ ਕੁਦਰਤੀ ਸੰਖਿਆ ਹੈ।", "ਦੋ ਟਾਂਕ ਪੂਰਨ ਅੰਕਾਂ ਦਾ ਜੋੜ ਟਾਂਕ ਹੁੰਦਾ ਹੈ।"],
    ["ਹਰ ਪੂਰਨ ਸੰਖਿਆ ਰਿਣਾਤਮਕ ਹੈ।", "ਦੋ ਟਾਂਕ ਪੂਰਨ ਅੰਕਾਂ ਦਾ ਗੁਣਨਫਲ ਟਾਂਕ ਹੁੰਦਾ ਹੈ।", "1 ਇੱਕ ਜਿਸਤ ਪੂਰਨ ਅੰਕ ਹੈ।"],
    ["0 ਇੱਕ ਪੂਰਨ ਸੰਖਿਆ ਹੈ।", "ਤਿੰਨ ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਦਾ ਜੋੜ 3 ਨਾਲ ਭਾਜਯ ਹੁੰਦਾ ਹੈ।", "ਇੱਕ ਜਿਸਤ ਅਤੇ ਇੱਕ ਟਾਂਕ ਪੂਰਨ ਅੰਕ ਦਾ ਜੋੜ ਜਿਸਤ ਹੁੰਦਾ ਹੈ।"],
    ["ਹਰ ਪਰਿਮੇਯ ਸੰਖਿਆ ਪੂਰਨ ਅੰਕ ਹੈ।", "ਜੇ a < b, ਤਾਂ -a > -b।", "ਦੋ ਜਿਸਤ ਪੂਰਨ ਅੰਕਾਂ ਦਾ ਜੋੜ ਜਿਸਤ ਹੁੰਦਾ ਹੈ।"],
  ] as const;
  return locale === "hi-IN" ? hi[mode]! : pa[mode]!;
}

function dsDescriptions(state: State, locale: NumCp001TranslatedLocale): readonly [string, string] {
  const scenario = num(state, "scenario");
  const hidden = num(state, "hidden");
  const parity = Math.abs(hidden) % 2 === 0
    ? tx(locale, "सम", "ਜਿਸਤ")
    : tx(locale, "विषम", "ਟਾਂਕ");
  const parityDesc = tx(locale, `x ${parity} है`, `x ${parity} ਹੈ`);
  const upper = tx(locale,
    `x, ${hidden + 0.5} से सख्ती से छोटा सबसे बड़ा पूर्णांक है`,
    `x, ${hidden + 0.5} ਤੋਂ ਸਖ਼ਤੀ ਨਾਲ ਛੋਟਾ ਸਭ ਤੋਂ ਵੱਡਾ ਪੂਰਨ ਅੰਕ ਹੈ`);
  const lower = tx(locale,
    `x, ${hidden - 0.5} से सख्ती से बड़ा सबसे छोटा पूर्णांक है`,
    `x, ${hidden - 0.5} ਤੋਂ ਸਖ਼ਤੀ ਨਾਲ ਵੱਡਾ ਸਭ ਤੋਂ ਛੋਟਾ ਪੂਰਨ ਅੰਕ ਹੈ`);
  const pair = `${hidden - 0.5} < x < ${hidden + 1.5}`;
  const broad = `${hidden - 2.5} < x < ${hidden + 2.5}`;
  if (scenario === 0) return [upper, parityDesc];
  if (scenario === 1) return [parityDesc, lower];
  if (scenario === 2) return [parityDesc, pair];
  return [parityDesc, broad];
}

function localizedStem(question: NumCp001PermanentQuestion, locale: NumCp001TranslatedLocale): string {
  const s = question.hiddenState;
  const p = question.traceability.runtimePrototypeId;
  switch (p) {
    case "NUM-CP001-PROT-001": {
      const representation = text(s, "representation");
      const display = representation === "FRACTION"
        ? `${num(s, "numerator")}/${num(s, "denominator")}`
        : representation === "SQUARE_ROOT"
          ? `√${num(s, "radicand")}`
          : String(num(s, "value"));
      return tx(locale,
        `इस प्रश्न में प्राकृतिक संख्याएँ 1 से शुरू होती हैं। ${display} किस सबसे छोटे दिए गए संख्या-समूह से संबंधित है?`,
        `ਇਸ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਕੁਦਰਤੀ ਸੰਖਿਆਵਾਂ 1 ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀਆਂ ਹਨ। ${display} ਸਭ ਤੋਂ ਛੋਟੇ ਦਿੱਤੇ ਸੰਖਿਆ-ਸਮੂਹ ਵਿੱਚੋਂ ਕਿਸ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ?`);
    }
    case "NUM-CP001-PROT-002":
      return tx(locale,
        "इस प्रश्न में प्राकृतिक संख्याएँ 1 से शुरू होती हैं। निम्नलिखित में से कौन-सा कथन सही है?",
        "ਇਸ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਕੁਦਰਤੀ ਸੰਖਿਆਵਾਂ 1 ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀਆਂ ਹਨ। ਹੇਠਾਂ ਦਿੱਤੇ ਕਥਨਾਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸਹੀ ਹੈ?");
    case "NUM-CP001-PROT-003": {
      const shown = numberArray(s, "shown").join(", ");
      return tx(locale, `${shown} को आरोही क्रम में लगाइए।`, `${shown} ਨੂੰ ਚੜ੍ਹਦੇ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਓ।`);
    }
    case "NUM-CP001-PROT-004":
      return tx(locale,
        `संख्या रेखा पर बिंदु A = ${num(s, "first")} और बिंदु B = ${num(s, "second")} है। दूरी AB कितनी है?`,
        `ਸੰਖਿਆ ਰੇਖਾ ਉੱਤੇ ਬਿੰਦੂ A = ${num(s, "first")} ਅਤੇ ਬਿੰਦੂ B = ${num(s, "second")} ਹੈ। ਦੂਰੀ AB ਕਿੰਨੀ ਹੈ?`);
    case "NUM-CP001-PROT-005":
      return tx(locale, `अंतराल ${text(s, "topology")} में कितने पूर्णांक हैं?`, `ਅੰਤਰਾਲ ${text(s, "topology")} ਵਿੱਚ ਕਿੰਨੇ ਪੂਰਨ ਅੰਕ ਹਨ?`);
    case "NUM-CP001-PROT-006":
      return tx(locale, "निम्नलिखित में से किस व्यंजक का मान विषम है?", "ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਅੰਜਕਾਂ ਵਿੱਚੋਂ ਕਿਸ ਦਾ ਮੁੱਲ ਟਾਂਕ ਹੈ?");
    case "NUM-CP001-PROT-007":
      return tx(locale,
        `हर पूर्णांक n के लिए कथन “${claimText(text(s, "claimId"), locale)}” के बारे में सही वर्णन कौन-सा है?`,
        `ਹਰ ਪੂਰਨ ਅੰਕ n ਲਈ ਕਥਨ “${claimText(text(s, "claimId"), locale)}” ਬਾਰੇ ਸਹੀ ਵਰਣਨ ਕਿਹੜਾ ਹੈ?`);
    case "NUM-CP001-PROT-008":
      return tx(locale,
        `${num(s, "length")} क्रमागत पूर्णांकों का योग ${num(s, "sum")} है। कौन-सा क्रमबद्ध समूह वे पूर्णांक देता है?`,
        `${num(s, "length")} ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਦਾ ਜੋੜ ${num(s, "sum")} ਹੈ। ਕਿਹੜਾ ਕ੍ਰਮਬੱਧ ਸਮੂਹ ਉਹ ਪੂਰਨ ਅੰਕ ਦਿੰਦਾ ਹੈ?`);
    case "NUM-CP001-PROT-009":
      return tx(locale,
        `निम्नलिखित में से कौन ${localizedSetName(text(s, "set"), locale)} का सदस्य नहीं है? प्राकृतिक संख्याएँ 1 से शुरू मानें।`,
        `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ${localizedSetName(text(s, "set"), locale)} ਦਾ ਮੈਂਬਰ ਨਹੀਂ ਹੈ? ਕੁਦਰਤੀ ਸੰਖਿਆਵਾਂ 1 ਤੋਂ ਸ਼ੁਰੂ ਮੰਨੋ।`);
    case "NUM-CP001-PROT-010": {
      const least = bool(s, "least");
      const strict = bool(s, "strict");
      const op = least ? (strict ? ">" : "≥") : (strict ? "<" : "≤");
      return tx(locale,
        `वह ${least ? "सबसे छोटा" : "सबसे बड़ा"} पूर्णांक x ज्ञात कीजिए जिसके लिए x ${op} ${text(s, "bound")}।`,
        `ਉਹ ${least ? "ਸਭ ਤੋਂ ਛੋਟਾ" : "ਸਭ ਤੋਂ ਵੱਡਾ"} ਪੂਰਨ ਅੰਕ x ਕੱਢੋ ਜਿਸ ਲਈ x ${op} ${text(s, "bound")}।`);
    }
    case "NUM-CP001-PROT-011":
      return tx(locale,
        `कितने पूर्णांक x शर्त ${frac(num(s, "leftNum"), num(s, "leftDen"))} < x < ${frac(num(s, "rightNum"), num(s, "rightDen"))} को पूरा करते हैं?`,
        `ਕਿੰਨੇ ਪੂਰਨ ਅੰਕ x ਸ਼ਰਤ ${frac(num(s, "leftNum"), num(s, "leftDen"))} < x < ${frac(num(s, "rightNum"), num(s, "rightDen"))} ਨੂੰ ਪੂਰਾ ਕਰਦੇ ਹਨ?`);
    case "NUM-CP001-PROT-012": {
      const lbr = bool(s, "leftInclusive") ? "[" : "(";
      const rbr = bool(s, "rightInclusive") ? "]" : ")";
      return tx(locale,
        `अंतराल ${lbr}${num(s, "left")}, b${rbr} में ठीक ${num(s, "count")} पूर्णांक हैं। पूर्णांक सिरा b ज्ञात कीजिए।`,
        `ਅੰਤਰਾਲ ${lbr}${num(s, "left")}, b${rbr} ਵਿੱਚ ਠੀਕ ${num(s, "count")} ਪੂਰਨ ਅੰਕ ਹਨ। ਪੂਰਨ ਅੰਕ ਸਿਰਾ b ਕੱਢੋ।`);
    }
    case "NUM-CP001-PROT-013": {
      const kind = text(s, "kind");
      const kindLocal = kind === "positive" ? tx(locale, "धनात्मक", "ਧਨਾਤਮਕ")
        : kind === "negative" ? tx(locale, "ऋणात्मक", "ਰਿਣਾਤਮਕ")
          : kind === "even" ? tx(locale, "सम", "ਜਿਸਤ") : tx(locale, "विषम", "ਟਾਂਕ");
      return tx(locale,
        `बंद अंतराल [${num(s, "low")}, ${num(s, "high")}] में कितने ${kindLocal} पूर्णांक हैं?`,
        `ਬੰਦ ਅੰਤਰਾਲ [${num(s, "low")}, ${num(s, "high")}] ਵਿੱਚ ਕਿੰਨੇ ${kindLocal} ਪੂਰਨ ਅੰਕ ਹਨ?`);
    }
    case "NUM-CP001-PROT-014":
      return tx(locale,
        `संख्या रेखा पर ${num(s, "centre")} से ठीक ${num(s, "dist")} इकाई दूर सभी पूर्णांक बिंदुओं का युग्म कौन-सा है?`,
        `ਸੰਖਿਆ ਰੇਖਾ ਉੱਤੇ ${num(s, "centre")} ਤੋਂ ਠੀਕ ${num(s, "dist")} ਇਕਾਈ ਦੂਰ ਸਾਰੇ ਪੂਰਨ ਅੰਕ ਬਿੰਦੂਆਂ ਦਾ ਜੋੜਾ ਕਿਹੜਾ ਹੈ?`);
    case "NUM-CP001-PROT-015":
      return tx(locale,
        `${p015Condition(num(s, "mode"), locale)} पूर्णांक n की सम-विषम प्रकृति क्या होनी चाहिए?`,
        `${p015Condition(num(s, "mode"), locale)} ਪੂਰਨ ਅੰਕ n ਦੀ ਜਿਸਤ-ਟਾਂਕ ਪ੍ਰਕਿਰਤੀ ਕੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ?`);
    case "NUM-CP001-PROT-016":
      return tx(locale,
        `${num(s, "len")} क्रमागत ${bool(s, "odd") ? "विषम" : "सम"} धनात्मक पूर्णांकों का योग ${num(s, "sum")} है। सही समूह कौन-सा है?`,
        `${num(s, "len")} ਲਗਾਤਾਰ ${bool(s, "odd") ? "ਟਾਂਕ" : "ਜਿਸਤ"} ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕਾਂ ਦਾ ਜੋੜ ${num(s, "sum")} ਹੈ। ਸਹੀ ਸਮੂਹ ਕਿਹੜਾ ਹੈ?`);
    case "NUM-CP001-PROT-017":
      return tx(locale,
        `यहाँ ${num(s, "n")} पूर्ण वर्ग नहीं है। निम्नलिखित में से कौन-सा व्यंजक परिमेय है?`,
        `ਇੱਥੇ ${num(s, "n")} ਪੂਰਨ ਵਰਗ ਨਹੀਂ ਹੈ। ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਿਅੰਜਕ ਪਰਿਮੇਯ ਹੈ?`);
    case "NUM-CP001-PROT-018": {
      const assigned = objectArray(s, "assigned");
      const listing = assigned.map((x) => `${String(x.label)} = ${String(x.text)}`).join(", ");
      return tx(locale, `इन सटीक मानों को आरोही क्रम में लगाइए: ${listing}।`, `ਇਨ੍ਹਾਂ ਸਹੀ ਮੁੱਲਾਂ ਨੂੰ ਚੜ੍ਹਦੇ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਓ: ${listing}।`);
    }
    case "NUM-CP001-PROT-019":
      return tx(locale,
        `शर्त ${frac(num(s, "leftNum"), num(s, "leftDen"))} < x < ${frac(num(s, "rightNum"), num(s, "rightDen"))} को पूरा करने वाले पूर्णांकों के समुच्चय का सही वर्णन कौन-सा है?`,
        `ਸ਼ਰਤ ${frac(num(s, "leftNum"), num(s, "leftDen"))} < x < ${frac(num(s, "rightNum"), num(s, "rightDen"))} ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਪੂਰਨ ਅੰਕਾਂ ਦੇ ਸਮੂਹ ਦਾ ਸਹੀ ਵਰਣਨ ਕਿਹੜਾ ਹੈ?`);
    case "NUM-CP001-PROT-020":
      return tx(locale,
        `पूर्णांक n पर कौन-सी शर्त होने पर ${text(s, "expression")} सम होगा?`,
        `ਪੂਰਨ ਅੰਕ n ਉੱਤੇ ਕਿਹੜੀ ਸ਼ਰਤ ਹੋਣ ਤੇ ${text(s, "expression")} ਜਿਸਤ ਹੋਵੇਗਾ?`);
    case "NUM-CP001-PROT-021":
      return tx(locale,
        `${num(s, "len")} क्रमागत पूर्णांकों का योग ${num(s, "sum")} है। पूरा समूह बढ़ते क्रम में कौन-सा है?`,
        `${num(s, "len")} ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਦਾ ਜੋੜ ${num(s, "sum")} ਹੈ। ਪੂਰਾ ਸਮੂਹ ਵਧਦੇ ਕ੍ਰਮ ਵਿੱਚ ਕਿਹੜਾ ਹੈ?`);
    case "NUM-CP001-PROT-022": {
      const target = text(s, "target");
      const targetLocal = target === "first" ? tx(locale, "पहला", "ਪਹਿਲਾ") : target === "middle" ? tx(locale, "मध्य", "ਵਿਚਕਾਰਲਾ") : tx(locale, "अंतिम", "ਆਖ਼ਰੀ");
      return tx(locale,
        `${num(s, "len")} क्रमागत पूर्णांकों का योग ${num(s, "sum")} है। समूह का ${targetLocal} पूर्णांक ज्ञात कीजिए।`,
        `${num(s, "len")} ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਦਾ ਜੋੜ ${num(s, "sum")} ਹੈ। ਸਮੂਹ ਦਾ ${targetLocal} ਪੂਰਨ ਅੰਕ ਕੱਢੋ।`);
    }
    case "NUM-CP001-PROT-023":
      return tx(locale,
        `क्या ${num(s, "proposedSum")} को ${num(s, "len")} क्रमागत पूर्णांकों के योग के रूप में लिखा जा सकता है?`,
        `ਕੀ ${num(s, "proposedSum")} ਨੂੰ ${num(s, "len")} ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਦੇ ਜੋੜ ਵਜੋਂ ਲਿਖਿਆ ਜਾ ਸਕਦਾ ਹੈ?`);
    case "NUM-CP001-PROT-024": {
      const statements = p024Statements(num(s, "mode"), locale);
      return tx(locale,
        `निम्न कथनों पर विचार कीजिए:\nI. ${statements[0]}\nII. ${statements[1]}\nIII. ${statements[2]}\nठीक सही कथनों को दर्शाने वाला विकल्प चुनिए। प्राकृतिक संख्याएँ 1 से शुरू मानें।`,
        `ਹੇਠਾਂ ਦਿੱਤੇ ਕਥਨਾਂ ਨੂੰ ਵੇਖੋ:\nI. ${statements[0]}\nII. ${statements[1]}\nIII. ${statements[2]}\nਠੀਕ ਸਹੀ ਕਥਨਾਂ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ। ਕੁਦਰਤੀ ਸੰਖਿਆਵਾਂ 1 ਤੋਂ ਸ਼ੁਰੂ ਮੰਨੋ।`);
    }
    case "NUM-CP001-PROT-025": {
      const [first, second] = dsDescriptions(s, locale);
      return tx(locale,
        `पूर्णांक x, -10 से 10 तक (दोनों सहित) है। तय कीजिए कि x को अद्वितीय रूप से ज्ञात किया जा सकता है या नहीं। कथन I: ${first}। कथन II: ${second}।`,
        `ਪੂਰਨ ਅੰਕ x, -10 ਤੋਂ 10 ਤੱਕ (ਦੋਵੇਂ ਸਮੇਤ) ਹੈ। ਨਿਰਧਾਰਤ ਕਰੋ ਕਿ x ਨੂੰ ਇਕੋ ਮੁੱਲ ਵਜੋਂ ਲੱਭਿਆ ਜਾ ਸਕਦਾ ਹੈ ਜਾਂ ਨਹੀਂ। ਕਥਨ I: ${first}। ਕਥਨ II: ${second}।`);
    }
    case "NUM-CP001-PROT-026": {
      const k = num(s, "k");
      const factors = Array.from({ length: k }, (_, i) => i === 0 ? "n" : `(n + ${i})`).join("");
      return tx(locale,
        `हर पूर्णांक n के लिए वह सबसे बड़ा धनात्मक पूर्णांक कौन-सा है जो ${factors} को निश्चित रूप से विभाजित करता है?`,
        `ਹਰ ਪੂਰਨ ਅੰਕ n ਲਈ ਉਹ ਸਭ ਤੋਂ ਵੱਡਾ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ ਕਿਹੜਾ ਹੈ ਜੋ ${factors} ਨੂੰ ਯਕੀਨੀ ਤੌਰ ਤੇ ਭਾਗ ਕਰਦਾ ਹੈ?`);
    }
    default:
      throw new Error(`Unsupported NUM-CP-001 localization prototype: ${p}`);
  }
}

function explanation(
  locale: NumCp001TranslatedLocale,
  coreHi: string,
  corePa: string,
  strategyHi: string,
  strategyPa: string,
  stepsHi: readonly string[],
  stepsPa: readonly string[],
  speedHi: string,
  speedPa: string,
  trapsHi: readonly string[],
  trapsPa: readonly string[],
  finalAnswer: string,
): NumCp001LocalizedExplanation {
  return {
    coreConcept: [tx(locale, coreHi, corePa)],
    givenDataAndStrategy: [tx(locale, strategyHi, strategyPa)],
    stepByStep: locale === "hi-IN" ? stepsHi : stepsPa,
    examSpeedMethod: [tx(locale, speedHi, speedPa)],
    commonTraps: locale === "hi-IN" ? trapsHi : trapsPa,
    finalAnswer: tx(locale, `अंतिम उत्तर: ${finalAnswer}`, `ਅੰਤਿਮ ਉੱਤਰ: ${finalAnswer}`),
  };
}

function localizedExplanation(
  question: NumCp001PermanentQuestion,
  locale: NumCp001TranslatedLocale,
  localizedAnswer: string,
): NumCp001LocalizedExplanation {
  const s = question.hiddenState;
  const p = question.traceability.runtimePrototypeId;

  switch (p) {
    case "NUM-CP001-PROT-001": {
      const display = text(s, "representation") === "FRACTION" ? `${num(s, "numerator")}/${num(s, "denominator")}` : text(s, "representation") === "SQUARE_ROOT" ? `√${num(s, "radicand")}` : String(num(s, "value"));
      return explanation(locale,
        "सबसे छोटा लागू संख्या-समूह चुनना है; बड़ा समुच्चय सही होते हुए भी सबसे विशिष्ट उत्तर नहीं होता।",
        "ਸਭ ਤੋਂ ਛੋਟਾ ਲਾਗੂ ਸੰਖਿਆ-ਸਮੂਹ ਚੁਣਨਾ ਹੈ; ਵੱਡਾ ਸਮੂਹ ਸਹੀ ਹੋਣ ਦੇ ਬਾਵਜੂਦ ਸਭ ਤੋਂ ਵਿਸ਼ੇਸ਼ ਉੱਤਰ ਨਹੀਂ ਹੁੰਦਾ।",
        `${display} की प्रकृति पहचानकर सबसे छोटे उपयुक्त समूह तक रुकें।`,
        `${display} ਦੀ ਪ੍ਰਕਿਰਤੀ ਪਛਾਣ ਕੇ ਸਭ ਤੋਂ ਛੋਟੇ ਢੁੱਕਵੇਂ ਸਮੂਹ ਤੇ ਰੁਕੋ।`,
        [`दिया मान ${display} है।`, `उसकी सबसे विशिष्ट दी गई श्रेणी ${localizedAnswer} है।`],
        [`ਦਿੱਤਾ ਮੁੱਲ ${display} ਹੈ।`, `ਇਸ ਦੀ ਸਭ ਤੋਂ ਵਿਸ਼ੇਸ਼ ਦਿੱਤੀ ਸ਼੍ਰੇਣੀ ${localizedAnswer} ਹੈ।`],
        "पहले धनात्मक पूर्णांक, शून्य, ऋणात्मक पूर्णांक, भिन्न या अपरिमेय रूप पहचानें।",
        "ਪਹਿਲਾਂ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ, ਸਿਫ਼ਰ, ਰਿਣਾਤਮਕ ਪੂਰਨ ਅੰਕ, ਭਿੰਨ ਜਾਂ ਅਪਰਿਮੇਯ ਰੂਪ ਪਛਾਣੋ।",
        ["बड़े समुच्चय को सबसे छोटा समुच्चय न समझें।", "प्राकृतिक संख्याओं की दी गई परिभाषा को न भूलें।"],
        ["ਵੱਡੇ ਸਮੂਹ ਨੂੰ ਸਭ ਤੋਂ ਛੋਟਾ ਸਮੂਹ ਨਾ ਮੰਨੋ।", "ਕੁਦਰਤੀ ਸੰਖਿਆਵਾਂ ਦੀ ਦਿੱਤੀ ਪਰਿਭਾਸ਼ਾ ਨਾ ਭੁੱਲੋ।"], localizedAnswer);
    }
    case "NUM-CP001-PROT-002": {
      const options = question.options.map((o) => translateNumCp001OptionValue(o.value, locale));
      const stepsHi = options.map((o, i) => `${o} — ${question.options[i]!.isCorrect ? "सही" : "गलत"}।`);
      const stepsPa = options.map((o, i) => `${o} — ${question.options[i]!.isCorrect ? "ਸਹੀ" : "ਗਲਤ"}।`);
      return explanation(locale,
        "शून्य सम है, प्राकृतिक संख्याएँ 1 से शुरू हैं, और हर पूर्णांक परिमेय होता है।",
        "ਸਿਫ਼ਰ ਜਿਸਤ ਹੈ, ਕੁਦਰਤੀ ਸੰਖਿਆਵਾਂ 1 ਤੋਂ ਸ਼ੁਰੂ ਹਨ, ਅਤੇ ਹਰ ਪੂਰਨ ਅੰਕ ਪਰਿਮੇਯ ਹੁੰਦਾ ਹੈ।",
        "हर कथन को सीमा-परिभाषाओं और शून्य की सम-विषम प्रकृति से जाँचें।",
        "ਹਰ ਕਥਨ ਨੂੰ ਸੀਮਾ-ਪਰਿਭਾਸ਼ਾਵਾਂ ਅਤੇ ਸਿਫ਼ਰ ਦੀ ਜਿਸਤ-ਟਾਂਕ ਪ੍ਰਕਿਰਤੀ ਨਾਲ ਜਾਂਚੋ।",
        stepsHi, stepsPa,
        "0, 1 और ऋणात्मक पूर्णांकों के मूल तथ्य पहले याद करें।",
        "0, 1 ਅਤੇ ਰਿਣਾਤਮਕ ਪੂਰਨ ਅੰਕਾਂ ਦੇ ਮੂਲ ਤੱਥ ਪਹਿਲਾਂ ਯਾਦ ਕਰੋ।",
        ["0 को विषम न मानें।", "ऋणात्मक पूर्णांक को पूर्ण संख्या या प्राकृतिक संख्या न मानें।"],
        ["0 ਨੂੰ ਟਾਂਕ ਨਾ ਮੰਨੋ।", "ਰਿਣਾਤਮਕ ਪੂਰਨ ਅੰਕ ਨੂੰ ਪੂਰਨ ਸੰਖਿਆ ਜਾਂ ਕੁਦਰਤੀ ਸੰਖਿਆ ਨਾ ਮੰਨੋ।"], localizedAnswer);
    }
    case "NUM-CP001-PROT-003":
    case "NUM-CP001-PROT-018":
      return explanation(locale,
        "आरोही क्रम में संख्या रेखा पर बाएँ से दाएँ बढ़ते मान लिखे जाते हैं।",
        "ਚੜ੍ਹਦੇ ਕ੍ਰਮ ਵਿੱਚ ਸੰਖਿਆ ਰੇਖਾ ਉੱਤੇ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਵਧਦੇ ਮੁੱਲ ਲਿਖੇ ਜਾਂਦੇ ਹਨ।",
        "ऋणात्मक मानों में चिह्न का ध्यान रखते हुए सटीक तुलना करें।",
        "ਰਿਣਾਤਮਕ ਮੁੱਲਾਂ ਵਿੱਚ ਨਿਸ਼ਾਨ ਦਾ ਧਿਆਨ ਰੱਖਦੇ ਹੋਏ ਸਹੀ ਤੁਲਨਾ ਕਰੋ।",
        [`सभी दिए मानों की सटीक तुलना करें।`, `सही आरोही क्रम ${localizedAnswer} है।`],
        [`ਸਾਰੇ ਦਿੱਤੇ ਮੁੱਲਾਂ ਦੀ ਸਹੀ ਤੁਲਨਾ ਕਰੋ।`, `ਸਹੀ ਚੜ੍ਹਦਾ ਕ੍ਰਮ ${localizedAnswer} ਹੈ।`],
        "भिन्नों के लिए समान हर या दोगुना मान लेकर तुरंत तुलना करें।",
        "ਭਿੰਨਾਂ ਲਈ ਸਾਂਝਾ ਹਰ ਜਾਂ ਦੁੱਗਣਾ ਮੁੱਲ ਲੈ ਕੇ ਤੁਰੰਤ ਤੁਲਨਾ ਕਰੋ।",
        ["ऋणात्मक संख्याओं को केवल परिमाण से क्रमित न करें।", "आरोही और अवरोही क्रम न बदलें।"],
        ["ਰਿਣਾਤਮਕ ਸੰਖਿਆਵਾਂ ਨੂੰ ਕੇਵਲ ਪਰਿਮਾਣ ਨਾਲ ਕ੍ਰਮਿਤ ਨਾ ਕਰੋ।", "ਚੜ੍ਹਦਾ ਅਤੇ ਘਟਦਾ ਕ੍ਰਮ ਨਾ ਬਦਲੋ।"], localizedAnswer);
    case "NUM-CP001-PROT-004": {
      const a = num(s, "first"); const b = num(s, "second"); const d = Math.abs(b - a);
      return explanation(locale,
        "संख्या रेखा पर दूरी दो निर्देशांकों के अंतर का परम मान होती है।",
        "ਸੰਖਿਆ ਰੇਖਾ ਉੱਤੇ ਦੂਰੀ ਦੋ ਨਿਰਦੇਸ਼ਾਂ ਦੇ ਅੰਤਰ ਦਾ ਪਰਮ ਮੁੱਲ ਹੁੰਦੀ ਹੈ।",
        `|${b} - (${a})| निकालें।`, `|${b} - (${a})| ਕੱਢੋ।`,
        [`${b} - (${a}) = ${b - a}।`, `परम मान लेने पर दूरी ${d} मिलती है।`],
        [`${b} - (${a}) = ${b - a}।`, `ਪਰਮ ਮੁੱਲ ਲੈਣ ਤੇ ਦੂਰੀ ${d} ਮਿਲਦੀ ਹੈ।`],
        "विपरीत ओर होने पर शून्य से दोनों दूरियाँ जोड़ी जा सकती हैं।",
        "ਵਿਰੁੱਧ ਪਾਸਿਆਂ ਤੇ ਹੋਣ ਤੇ ਸਿਫ਼ਰ ਤੋਂ ਦੋਵੇਂ ਦੂਰੀਆਂ ਜੋੜੀਆਂ ਜਾ ਸਕਦੀਆਂ ਹਨ।",
        ["दूरी को ऋणात्मक न लिखें।", "बिंदुओं की संख्या नहीं, इकाई-अंतर गिनें।"],
        ["ਦੂਰੀ ਨੂੰ ਰਿਣਾਤਮਕ ਨਾ ਲਿਖੋ।", "ਬਿੰਦੂਆਂ ਦੀ ਗਿਣਤੀ ਨਹੀਂ, ਇਕਾਈ-ਅੰਤਰ ਗਿਣੋ।"], localizedAnswer);
    }
    case "NUM-CP001-PROT-005": {
      const low = num(s, "lower"); const high = num(s, "upper");
      const inclusive = high - low + 1;
      return explanation(locale,
        "वर्ग कोष्ठक सिरा शामिल करता है और गोल कोष्ठक सिरा बाहर रखता है।",
        "ਚੌਰਸ ਕੋਠੀ ਸਿਰਾ ਸ਼ਾਮਲ ਕਰਦੀ ਹੈ ਅਤੇ ਗੋਲ ਕੋਠੀ ਸਿਰਾ ਬਾਹਰ ਰੱਖਦੀ ਹੈ।",
        "पहले दोनों सिरों सहित पूर्णांक गिनें, फिर खुले सिरों को हटाएँ।",
        "ਪਹਿਲਾਂ ਦੋਵੇਂ ਸਿਰਿਆਂ ਸਮੇਤ ਪੂਰਨ ਅੰਕ ਗਿਣੋ, ਫਿਰ ਖੁੱਲ੍ਹੇ ਸਿਰੇ ਹਟਾਓ।",
        [`${low} से ${high} तक दोनों सिरों सहित ${inclusive} पूर्णांक हैं।`, `कोष्ठकों के अनुसार सिरों को समायोजित करने पर ${localizedAnswer} बचते हैं।`],
        [`${low} ਤੋਂ ${high} ਤੱਕ ਦੋਵੇਂ ਸਿਰਿਆਂ ਸਮੇਤ ${inclusive} ਪੂਰਨ ਅੰਕ ਹਨ।`, `ਕੋਠੀਆਂ ਅਨੁਸਾਰ ਸਿਰਿਆਂ ਨੂੰ ਸਮਾਇਤ ਕਰਨ ਤੇ ${localizedAnswer} ਬਚਦੇ ਹਨ।`],
        "सूत्र: ऊपरी − निचला + 1, फिर हर खुले सिरे के लिए 1 घटाएँ।",
        "ਸੂਤਰ: ਉੱਪਰਲਾ − ਹੇਠਲਾ + 1, ਫਿਰ ਹਰ ਖੁੱਲ੍ਹੇ ਸਿਰੇ ਲਈ 1 ਘਟਾਓ।",
        ["हर सिरे को अपने कोष्ठक के अनुसार ही लें।", "दोनों सिरों को अपने-आप शामिल न करें।"],
        ["ਹਰ ਸਿਰੇ ਨੂੰ ਆਪਣੀ ਕੋਠੀ ਅਨੁਸਾਰ ਹੀ ਲਵੋ।", "ਦੋਵੇਂ ਸਿਰਿਆਂ ਨੂੰ ਆਪਣੇ-ਆਪ ਸ਼ਾਮਲ ਨਾ ਕਰੋ।"], localizedAnswer);
    }
    case "NUM-CP001-PROT-006": {
      const expressions = objectArray(s, "expressions");
      const stepsHi = expressions.map((e) => `${String(e.text)} = ${String(e.value)}, इसलिए यह ${Math.abs(Number(e.value)) % 2 ? "विषम" : "सम"} है।`);
      const stepsPa = expressions.map((e) => `${String(e.text)} = ${String(e.value)}, ਇਸ ਲਈ ਇਹ ${Math.abs(Number(e.value)) % 2 ? "ਟਾਂਕ" : "ਜਿਸਤ"} ਹੈ।`);
      return explanation(locale,
        "सम-विषम नियमों से पूरे मान की लंबी गणना के बिना उत्तर निकाला जा सकता है।",
        "ਜਿਸਤ-ਟਾਂਕ ਨਿਯਮਾਂ ਨਾਲ ਪੂਰੇ ਮੁੱਲ ਦੀ ਲੰਮੀ ਗਣਨਾ ਬਿਨਾਂ ਉੱਤਰ ਕੱਢਿਆ ਜਾ ਸਕਦਾ ਹੈ।",
        "हर व्यंजक की सम-विषम प्रकृति जाँचें।", "ਹਰ ਵਿਅੰਜਕ ਦੀ ਜਿਸਤ-ਟਾਂਕ ਪ੍ਰਕਿਰਤੀ ਜਾਂਚੋ।",
        stepsHi, stepsPa,
        "संख्याओं को केवल सम/विषम रूप में घटाकर नियम लगाएँ।", "ਸੰਖਿਆਵਾਂ ਨੂੰ ਕੇਵਲ ਜਿਸਤ/ਟਾਂਕ ਰੂਪ ਵਿੱਚ ਘਟਾ ਕੇ ਨਿਯਮ ਲਗਾਓ।",
        ["सम गुणक वाले गुणनफल को विषम न मानें।", "विषम + विषम को विषम न मानें।"],
        ["ਜਿਸਤ ਗੁਣਕ ਵਾਲੇ ਗੁਣਨਫਲ ਨੂੰ ਟਾਂਕ ਨਾ ਮੰਨੋ।", "ਟਾਂਕ + ਟਾਂਕ ਨੂੰ ਟਾਂਕ ਨਾ ਮੰਨੋ।"], localizedAnswer);
    }
    case "NUM-CP001-PROT-007":
      return explanation(locale,
        "कथन को सम n और विषम n के दो मामलों में जाँचकर उसकी सार्वत्रिक श्रेणी तय करें।",
        "ਕਥਨ ਨੂੰ ਜਿਸਤ n ਅਤੇ ਟਾਂਕ n ਦੇ ਦੋ ਮਾਮਲਿਆਂ ਵਿੱਚ ਜਾਂਚ ਕੇ ਇਸ ਦੀ ਸਰਬਭੌਮ ਸ਼੍ਰੇਣੀ ਨਿਰਧਾਰਤ ਕਰੋ।",
        `कथन ${claimText(text(s, "claimId"), locale)} को दोनों सम-विषम मामलों में जाँचें।`,
        `ਕਥਨ ${claimText(text(s, "claimId"), locale)} ਨੂੰ ਦੋਵੇਂ ਜਿਸਤ-ਟਾਂਕ ਮਾਮਲਿਆਂ ਵਿੱਚ ਜਾਂਚੋ।`,
        [`सम और विषम दोनों मामलों की सत्यता तुलना करें।`, `सही वर्गीकरण ${localizedAnswer} है।`],
        [`ਜਿਸਤ ਅਤੇ ਟਾਂਕ ਦੋਵੇਂ ਮਾਮਲਿਆਂ ਦੀ ਸੱਚਾਈ ਦੀ ਤੁਲਨਾ ਕਰੋ।`, `ਸਹੀ ਵਰਗੀਕਰਨ ${localizedAnswer} ਹੈ।`],
        "दो मामलों के बाद तुरंत सदैव/कभी नहीं/केवल सम/केवल विषम तय करें।",
        "ਦੋ ਮਾਮਲਿਆਂ ਤੋਂ ਬਾਅਦ ਤੁਰੰਤ ਹਮੇਸ਼ਾ/ਕਦੇ ਨਹੀਂ/ਕੇਵਲ ਜਿਸਤ/ਕੇਵਲ ਟਾਂਕ ਨਿਰਧਾਰਤ ਕਰੋ।",
        ["एक उदाहरण को सार्वत्रिक प्रमाण न मानें।", "सम और विषम मामलों को उलट न दें।"],
        ["ਇੱਕ ਉਦਾਹਰਨ ਨੂੰ ਸਰਬਭੌਮ ਸਬੂਤ ਨਾ ਮੰਨੋ।", "ਜਿਸਤ ਅਤੇ ਟਾਂਕ ਮਾਮਲੇ ਨਾ ਉਲਟੋ।"], localizedAnswer);
    case "NUM-CP001-PROT-008":
    case "NUM-CP001-PROT-021": {
      const length = p === "NUM-CP001-PROT-008" ? num(s, "length") : num(s, "len");
      const sum = num(s, "sum");
      return explanation(locale,
        "क्रमागत पूर्णांक 1 के अंतर से चलते हैं और उनका औसत समूह के केंद्र को तय करता है।",
        "ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕ 1 ਦੇ ਅੰਤਰ ਨਾਲ ਚਲਦੇ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦਾ ਔਸਤ ਸਮੂਹ ਦਾ ਕੇਂਦਰ ਨਿਰਧਾਰਤ ਕਰਦਾ ਹੈ।",
        `${sum} को ${length} पदों में समान औसत के रूप में बाँटकर समूह पुनर्निर्मित करें।`,
        `${sum} ਨੂੰ ${length} ਪਦਾਂ ਵਿੱਚ ਸਮਾਨ ਔਸਤ ਵਜੋਂ ਵੰਡ ਕੇ ਸਮੂਹ ਮੁੜ ਬਣਾਓ।`,
        [`औसत = ${sum}/${length}।`, `1-1 के अंतर से पूरा समूह लिखने पर ${localizedAnswer} मिलता है।`],
        [`ਔਸਤ = ${sum}/${length}।`, `1-1 ਦੇ ਅੰਤਰ ਨਾਲ ਪੂਰਾ ਸਮੂਹ ਲਿਖਣ ਤੇ ${localizedAnswer} ਮਿਲਦਾ ਹੈ।`],
        "पहले औसत निकालें; फिर केंद्र से दोनों ओर 1-1 बढ़ें/घटें।",
        "ਪਹਿਲਾਂ ਔਸਤ ਕੱਢੋ; ਫਿਰ ਕੇਂਦਰ ਤੋਂ ਦੋਵੇਂ ਪਾਸੇ 1-1 ਵਧੋ/ਘਟੋ।",
        ["क्रमागत पूर्णांकों में अंतर 2 न लें।", "समूह को एक स्थान खिसका न दें।"],
        ["ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਵਿੱਚ ਅੰਤਰ 2 ਨਾ ਲਵੋ।", "ਸਮੂਹ ਨੂੰ ਇੱਕ ਥਾਂ ਖਿਸਕਾਓ ਨਾ।"], localizedAnswer);
    }
    case "NUM-CP001-PROT-009":
      return explanation(locale,
        "समुच्चय-सदस्यता उसकी परिभाषा से तय होती है; प्रश्न बाहर के एकमात्र मान को पूछता है।",
        "ਸਮੂਹ-ਮੈਂਬਰਸ਼ਿਪ ਉਸ ਦੀ ਪਰਿਭਾਸ਼ਾ ਨਾਲ ਨਿਰਧਾਰਤ ਹੁੰਦੀ ਹੈ; ਪ੍ਰਸ਼ਨ ਬਾਹਰਲੇ ਇਕੋ ਮੁੱਲ ਨੂੰ ਪੁੱਛਦਾ ਹੈ।",
        `${localizedSetName(text(s, "set"), locale)} की परिभाषा से चारों विकल्प जाँचें।`,
        `${localizedSetName(text(s, "set"), locale)} ਦੀ ਪਰਿਭਾਸ਼ਾ ਨਾਲ ਚਾਰੇ ਵਿਕਲਪ ਜਾਂਚੋ।`,
        [`तीन विकल्प दिए समुच्चय की शर्त पूरी करते हैं।`, `${localizedAnswer} वह मान है जो शर्त पूरी नहीं करता।`],
        [`ਤਿੰਨ ਵਿਕਲਪ ਦਿੱਤੇ ਸਮੂਹ ਦੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦੇ ਹਨ।`, `${localizedAnswer} ਉਹ ਮੁੱਲ ਹੈ ਜੋ ਸ਼ਰਤ ਪੂਰੀ ਨਹੀਂ ਕਰਦਾ।`],
        "सबसे विशिष्ट श्रेणी नहीं, केवल सदस्यता जाँचें।", "ਸਭ ਤੋਂ ਵਿਸ਼ੇਸ਼ ਸ਼੍ਰੇਣੀ ਨਹੀਂ, ਕੇਵਲ ਮੈਂਬਰਸ਼ਿਪ ਜਾਂਚੋ।",
        ["किसी बड़े समुच्चय की सदस्यता से भ्रमित न हों।", "गैर-पूर्णांक भिन्न परिमेय हो सकता है।"],
        ["ਕਿਸੇ ਵੱਡੇ ਸਮੂਹ ਦੀ ਮੈਂਬਰਸ਼ਿਪ ਨਾਲ ਭੁੱਲ ਨਾ ਕਰੋ।", "ਗੈਰ-ਪੂਰਨ ਅੰਕ ਭਿੰਨ ਪਰਿਮੇਯ ਹੋ ਸਕਦਾ ਹੈ।"], localizedAnswer);
    case "NUM-CP001-PROT-010":
      return explanation(locale,
        "सबसे छोटा/बड़ा पूर्णांक चुनते समय असमता की दिशा और सख्ती दोनों महत्वपूर्ण हैं।",
        "ਸਭ ਤੋਂ ਛੋਟਾ/ਵੱਡਾ ਪੂਰਨ ਅੰਕ ਚੁਣਦੇ ਸਮੇਂ ਅਸਮਤਾ ਦੀ ਦਿਸ਼ਾ ਅਤੇ ਸਖ਼ਤੀ ਦੋਵੇਂ ਮਹੱਤਵਪੂਰਨ ਹਨ।",
        `सीमा ${text(s, "bound")} को पड़ोसी पूर्णांकों के बीच रखें।`, `ਸੀਮਾ ${text(s, "bound")} ਨੂੰ ਨੇੜਲੇ ਪੂਰਨ ਅੰਕਾਂ ਵਿਚਕਾਰ ਰੱਖੋ।`,
        [`बराबरी ${bool(s, "strict") ? "मान्य नहीं" : "मान्य है"}।`, `आवश्यक पूर्णांक ${localizedAnswer} है।`],
        [`ਬਰਾਬਰੀ ${bool(s, "strict") ? "ਮਨਜ਼ੂਰ ਨਹੀਂ" : "ਮਨਜ਼ੂਰ ਹੈ"}।`, `ਲੋੜੀਂਦਾ ਪੂਰਨ ਅੰਕ ${localizedAnswer} ਹੈ।`],
        "सीमा यदि स्वयं पूर्णांक हो तो < और ≤ का फर्क तुरंत जाँचें।", "ਜੇ ਸੀਮਾ ਆਪ ਪੂਰਨ ਅੰਕ ਹੋਵੇ ਤਾਂ < ਅਤੇ ≤ ਦਾ ਫਰਕ ਤੁਰੰਤ ਜਾਂਚੋ।",
        ["सबसे छोटा और सबसे बड़ा न उलटें।", "भिन्न को दशमलव में गोल न करें।"],
        ["ਸਭ ਤੋਂ ਛੋਟਾ ਅਤੇ ਸਭ ਤੋਂ ਵੱਡਾ ਨਾ ਉਲਟੋ।", "ਭਿੰਨ ਨੂੰ ਦਸ਼ਮਲਵ ਵਿੱਚ ਗੋਲ ਨਾ ਕਰੋ।"], localizedAnswer);
    case "NUM-CP001-PROT-011":
      return explanation(locale,
        "दो परिमेय सीमाओं के बीच पूर्णांक गिनने के लिए पहला और अंतिम मान्य पूर्णांक खोजें।",
        "ਦੋ ਪਰਿਮੇਯ ਸੀਮਾਵਾਂ ਵਿਚਕਾਰ ਪੂਰਨ ਅੰਕ ਗਿਣਣ ਲਈ ਪਹਿਲਾ ਅਤੇ ਆਖ਼ਰੀ ਮੰਨਿਆ ਪੂਰਨ ਅੰਕ ਲੱਭੋ।",
        "सीमाओं को सटीक रखें और अंदर आने वाले पहले/अंतिम पूर्णांक तय करें।", "ਸੀਮਾਵਾਂ ਨੂੰ ਸਹੀ ਰੱਖੋ ਅਤੇ ਅੰਦਰ ਆਉਣ ਵਾਲੇ ਪਹਿਲੇ/ਆਖ਼ਰੀ ਪੂਰਨ ਅੰਕ ਨਿਰਧਾਰਤ ਕਰੋ।",
        [`पहला मान्य पूर्णांक ${num(s, "first")} है।`, `अंतिम मान्य पूर्णांक ${num(s, "last")} है।`, `गिनती ${localizedAnswer} है।`],
        [`ਪਹਿਲਾ ਮੰਨਿਆ ਪੂਰਨ ਅੰਕ ${num(s, "first")} ਹੈ।`, `ਆਖ਼ਰੀ ਮੰਨਿਆ ਪੂਰਨ ਅੰਕ ${num(s, "last")} ਹੈ।`, `ਗਿਣਤੀ ${localizedAnswer} ਹੈ।`],
        "अंतिम − पहला + 1 करें।", "ਆਖ਼ਰੀ − ਪਹਿਲਾ + 1 ਕਰੋ।",
        ["खुली सीमा को शामिल न करें।", "परिमेय सीमा को गोल न करें।"],
        ["ਖੁੱਲ੍ਹੀ ਸੀਮਾ ਨੂੰ ਸ਼ਾਮਲ ਨਾ ਕਰੋ।", "ਪਰਿਮੇਯ ਸੀਮਾ ਨੂੰ ਗੋਲ ਨਾ ਕਰੋ।"], localizedAnswer);
    case "NUM-CP001-PROT-012":
      return explanation(locale,
        "अंतराल के सिरे की पुनर्प्राप्ति, पूर्णांक-गिनती की उलटी प्रक्रिया है।",
        "ਅੰਤਰਾਲ ਦੇ ਸਿਰੇ ਦੀ ਮੁੜ-ਪ੍ਰਾਪਤੀ, ਪੂਰਨ ਅੰਕ-ਗਿਣਤੀ ਦੀ ਉਲਟੀ ਪ੍ਰਕਿਰਿਆ ਹੈ।",
        "पहले पहला शामिल पूर्णांक, फिर अंतिम शामिल पूर्णांक तय करें।", "ਪਹਿਲਾਂ ਪਹਿਲਾ ਸ਼ਾਮਲ ਪੂਰਨ ਅੰਕ, ਫਿਰ ਆਖ਼ਰੀ ਸ਼ਾਮਲ ਪੂਰਨ ਅੰਕ ਨਿਰਧਾਰਤ ਕਰੋ।",
        [`पहला शामिल पूर्णांक ${num(s, "first")} है।`, `${num(s, "count")} मानों का अंतिम शामिल पूर्णांक ${num(s, "last")} है।`, `कोष्ठक के अनुसार b = ${localizedAnswer}।`],
        [`ਪਹਿਲਾ ਸ਼ਾਮਲ ਪੂਰਨ ਅੰਕ ${num(s, "first")} ਹੈ।`, `${num(s, "count")} ਮੁੱਲਾਂ ਦਾ ਆਖ਼ਰੀ ਸ਼ਾਮਲ ਪੂਰਨ ਅੰਕ ${num(s, "last")} ਹੈ।`, `ਕੋਠੀ ਅਨੁਸਾਰ b = ${localizedAnswer}।`],
        "हर कोष्ठक प्रकार के अलग सूत्र की जगह पहले/अंतिम शामिल मान सोचें।", "ਹਰ ਕੋਠੀ ਕਿਸਮ ਦੇ ਵੱਖਰੇ ਸੂਤਰ ਦੀ ਥਾਂ ਪਹਿਲਾ/ਆਖ਼ਰੀ ਸ਼ਾਮਲ ਮੁੱਲ ਸੋਚੋ।",
        ["खुले सिरे को न गिनें।", "पहले से समावेशी गिनती के बाद अतिरिक्त 1 न जोड़ें।"],
        ["ਖੁੱਲ੍ਹੇ ਸਿਰੇ ਨੂੰ ਨਾ ਗਿਣੋ।", "ਪਹਿਲਾਂ ਹੀ ਸਮਾਵੇਸ਼ੀ ਗਿਣਤੀ ਤੋਂ ਬਾਅਦ ਵਾਧੂ 1 ਨਾ ਜੋੜੋ।"], localizedAnswer);
    case "NUM-CP001-PROT-013": {
      const filtered = numberArray(s, "filtered");
      return explanation(locale,
        "बंद अंतराल की सदस्यता और माँगी गई पूर्णांक-विशेषता दोनों एक साथ लागू करनी हैं।",
        "ਬੰਦ ਅੰਤਰਾਲ ਦੀ ਮੈਂਬਰਸ਼ਿਪ ਅਤੇ ਮੰਗੀ ਪੂਰਨ ਅੰਕ-ਵਿਸ਼ੇਸ਼ਤਾ ਦੋਵੇਂ ਇਕੱਠੇ ਲਾਗੂ ਕਰਨੀਆਂ ਹਨ।",
        "पहले अंतराल के पूर्णांक लें, फिर माँगी गई विशेषता से छानें।", "ਪਹਿਲਾਂ ਅੰਤਰਾਲ ਦੇ ਪੂਰਨ ਅੰਕ ਲਵੋ, ਫਿਰ ਮੰਗੀ ਵਿਸ਼ੇਸ਼ਤਾ ਨਾਲ ਛਾਣੋ।",
        [`छँटे हुए मान: ${filtered.join(", ")}।`, `इनकी संख्या ${localizedAnswer} है।`],
        [`ਛਾਂਟੇ ਹੋਏ ਮੁੱਲ: ${filtered.join(", ")}।`, `ਇਨ੍ਹਾਂ ਦੀ ਗਿਣਤੀ ${localizedAnswer} ਹੈ।`],
        "सम/विषम के लिए पहला और अंतिम सही सदस्य पहचानकर 2-2 की चाल से गिनें।", "ਜਿਸਤ/ਟਾਂਕ ਲਈ ਪਹਿਲਾ ਅਤੇ ਆਖ਼ਰੀ ਸਹੀ ਮੈਂਬਰ ਪਛਾਣ ਕੇ 2-2 ਦੀ ਚਾਲ ਨਾਲ ਗਿਣੋ।",
        ["0 सम है पर न धनात्मक है न ऋणात्मक।", "सही सिरे को गलती से न हटाएँ।"],
        ["0 ਜਿਸਤ ਹੈ ਪਰ ਨਾ ਧਨਾਤਮਕ ਹੈ ਨਾ ਰਿਣਾਤਮਕ।", "ਸਹੀ ਸਿਰੇ ਨੂੰ ਗਲਤੀ ਨਾਲ ਨਾ ਹਟਾਓ।"], localizedAnswer);
    }
    case "NUM-CP001-PROT-014":
      return explanation(locale,
        "किसी केंद्र से धनात्मक निश्चित दूरी पर दो बिंदु होते हैं: केंद्र − दूरी और केंद्र + दूरी।",
        "ਕਿਸੇ ਕੇਂਦਰ ਤੋਂ ਧਨਾਤਮਕ ਨਿਰਧਾਰਤ ਦੂਰੀ ਤੇ ਦੋ ਬਿੰਦੂ ਹੁੰਦੇ ਹਨ: ਕੇਂਦਰ − ਦੂਰੀ ਅਤੇ ਕੇਂਦਰ + ਦੂਰੀ।",
        "केंद्र के दोनों ओर समान दूरी जाएँ।", "ਕੇਂਦਰ ਦੇ ਦੋਵੇਂ ਪਾਸਿਆਂ ਇੱਕੋ ਦੂਰੀ ਜਾਓ।",
        [`बायाँ बिंदु = ${num(s, "centre")} − ${num(s, "dist")} = ${num(s, "a")}।`, `दायाँ बिंदु = ${num(s, "centre")} + ${num(s, "dist")} = ${num(s, "b")}।`],
        [`ਖੱਬਾ ਬਿੰਦੂ = ${num(s, "centre")} − ${num(s, "dist")} = ${num(s, "a")}।`, `ਸੱਜਾ ਬਿੰਦੂ = ${num(s, "centre")} + ${num(s, "dist")} = ${num(s, "b")}।`],
        "|x − a| = d में सीधे x = a ± d लिखें।", "|x − a| = d ਵਿੱਚ ਸਿੱਧਾ x = a ± d ਲਿਖੋ।",
        ["केवल एक ओर का बिंदु न लें।", "केंद्र की दूरी स्वयं से 0 होती है।"],
        ["ਕੇਵਲ ਇੱਕ ਪਾਸੇ ਦਾ ਬਿੰਦੂ ਨਾ ਲਵੋ।", "ਕੇਂਦਰ ਦੀ ਆਪਣੇ ਆਪ ਤੋਂ ਦੂਰੀ 0 ਹੁੰਦੀ ਹੈ।"], localizedAnswer);
    case "NUM-CP001-PROT-015":
    case "NUM-CP001-PROT-020":
      return explanation(locale,
        "सम-विषम नियमों को उलटकर n की आवश्यक प्रकृति निकाली जा सकती है।",
        "ਜਿਸਤ-ਟਾਂਕ ਨਿਯਮਾਂ ਨੂੰ ਉਲਟ ਕੇ n ਦੀ ਲੋੜੀਂਦੀ ਪ੍ਰਕਿਰਤੀ ਕੱਢੀ ਜਾ ਸਕਦੀ ਹੈ।",
        "व्यंजक या दी गई शर्त को modulo 2 के रूप में देखें।", "ਵਿਅੰਜਕ ਜਾਂ ਦਿੱਤੀ ਸ਼ਰਤ ਨੂੰ modulo 2 ਦੇ ਰੂਪ ਵਿੱਚ ਵੇਖੋ।",
        [`सम और विषम n दोनों मामलों को जाँचें।`, `सही शर्त ${localizedAnswer} है।`],
        [`ਜਿਸਤ ਅਤੇ ਟਾਂਕ n ਦੋਵੇਂ ਮਾਮਲੇ ਜਾਂਚੋ।`, `ਸਹੀ ਸ਼ਰਤ ${localizedAnswer} ਹੈ।`],
        "गुणांक और नियतांक को 2 से भाग के शेष तक घटाएँ।", "ਗੁਣਾਂਕ ਅਤੇ ਨਿਯਤ ਅੰਕ ਨੂੰ 2 ਨਾਲ ਭਾਗ ਦੇ ਬਾਕੀ ਤੱਕ ਘਟਾਓ।",
        ["परिणाम की सम-विषम प्रकृति को यांत्रिक रूप से उलट न दें।", "2n हमेशा सम होता है।"],
        ["ਨਤੀਜੇ ਦੀ ਜਿਸਤ-ਟਾਂਕ ਪ੍ਰਕਿਰਤੀ ਨੂੰ ਮਕੈਨਿਕੀ ਤੌਰ ਤੇ ਨਾ ਉਲਟੋ।", "2n ਹਮੇਸ਼ਾ ਜਿਸਤ ਹੁੰਦਾ ਹੈ।"], localizedAnswer);
    case "NUM-CP001-PROT-016": {
      const seq = numberArray(s, "seq");
      return explanation(locale,
        "क्रमागत समान सम-विषम पूर्णांक 2 के अंतर से चलते हैं।",
        "ਲਗਾਤਾਰ ਇੱਕੋ ਜਿਸਤ-ਟਾਂਕ ਕਿਸਮ ਦੇ ਪੂਰਨ ਅੰਕ 2 ਦੇ ਅੰਤਰ ਨਾਲ ਚਲਦੇ ਹਨ।",
        "औसत से मध्य मान निकालें और 2-2 के अंतर से समूह बनाएँ।", "ਔਸਤ ਨਾਲ ਵਿਚਕਾਰਲਾ ਮੁੱਲ ਕੱਢੋ ਅਤੇ 2-2 ਦੇ ਅੰਤਰ ਨਾਲ ਸਮੂਹ ਬਣਾਓ।",
        [`समूह ${seq.join(", ")} है।`, `इनका योग ${num(s, "sum")} है, इसलिए यही सही समूह है।`],
        [`ਸਮੂਹ ${seq.join(", ")} ਹੈ।`, `ਇਨ੍ਹਾਂ ਦਾ ਜੋੜ ${num(s, "sum")} ਹੈ, ਇਸ ਲਈ ਇਹੀ ਸਹੀ ਸਮੂਹ ਹੈ।`],
        "विषम संख्या में पद हों तो औसत ही मध्य पद है।", "ਜੇ ਪਦਾਂ ਦੀ ਗਿਣਤੀ ਟਾਂਕ ਹੋਵੇ ਤਾਂ ਔਸਤ ਹੀ ਵਿਚਕਾਰਲਾ ਪਦ ਹੈ।",
        ["अंतर 1 न लें।", "मिले हुए औसत के बाद पूरा समूह न खिसकाएँ।"],
        ["ਅੰਤਰ 1 ਨਾ ਲਵੋ।", "ਮਿਲੇ ਔਸਤ ਤੋਂ ਬਾਅਦ ਪੂਰਾ ਸਮੂਹ ਨਾ ਖਿਸਕਾਓ।"], localizedAnswer);
    }
    case "NUM-CP001-PROT-017":
      return explanation(locale,
        "धनात्मक अपूर्ण वर्ग का वर्गमूल अपरिमेय है, लेकिन उसी मूल का अपने साथ गुणन मूल को हटा देता है।",
        "ਧਨਾਤਮਕ ਅਪੂਰਨ ਵਰਗ ਦਾ ਵਰਗਮੂਲ ਅਪਰਿਮੇਯ ਹੈ, ਪਰ ਉਸੇ ਮੂਲ ਦਾ ਆਪਣੇ ਨਾਲ ਗੁਣਨ ਮੂਲ ਨੂੰ ਹਟਾ ਦਿੰਦਾ ਹੈ।",
        "हर विकल्प को सटीक रूप से सरल करें; दशमलव अनुमान न लें।", "ਹਰ ਵਿਕਲਪ ਨੂੰ ਸਹੀ ਰੂਪ ਵਿੱਚ ਸਰਲ ਕਰੋ; ਦਸ਼ਮਲਵ ਅੰਦਾਜ਼ਾ ਨਾ ਲਵੋ।",
        [`√${num(s, "n")} × √${num(s, "n")} = ${num(s, "n")}।`, `चुने गए व्यंजक का सरलीकृत मान ${text(s, "rationalValue")} है, जो परिमेय है।`],
        [`√${num(s, "n")} × √${num(s, "n")} = ${num(s, "n")}।`, `ਚੁਣੇ ਵਿਅੰਜਕ ਦਾ ਸਰਲ ਮੁੱਲ ${text(s, "rationalValue")} ਹੈ, ਜੋ ਪਰਿਮੇਯ ਹੈ।`],
        "एक ही √n की दो प्रतियाँ दिखें तो पहले उनका गुणन करें।", "ਇੱਕੋ √n ਦੀਆਂ ਦੋ ਕਾਪੀਆਂ ਦਿਖਣ ਤਾਂ ਪਹਿਲਾਂ ਉਨ੍ਹਾਂ ਦਾ ਗੁਣਨ ਕਰੋ।",
        ["√n दिखते ही हर व्यंजक को अपरिमेय न मानें।", "दशमलव अनुमान से वर्गीकरण न करें।"],
        ["√n ਦਿਖਦੇ ਹੀ ਹਰ ਵਿਅੰਜਕ ਨੂੰ ਅਪਰਿਮੇਯ ਨਾ ਮੰਨੋ।", "ਦਸ਼ਮਲਵ ਅੰਦਾਜ਼ੇ ਨਾਲ ਵਰਗੀਕਰਨ ਨਾ ਕਰੋ।"], localizedAnswer);
    case "NUM-CP001-PROT-019": {
      const ints = numberArray(s, "integers");
      return explanation(locale,
        "सटीक सीमाओं के अनुसार अंतराल में 0, 1, 2 या कई पूर्णांक हो सकते हैं।",
        "ਸਹੀ ਸੀਮਾਵਾਂ ਅਨੁਸਾਰ ਅੰਤਰਾਲ ਵਿੱਚ 0, 1, 2 ਜਾਂ ਕਈ ਪੂਰਨ ਅੰਕ ਹੋ ਸਕਦੇ ਹਨ।",
        "बाएँ सीमा से बड़ा पहला और दाएँ सीमा से छोटा अंतिम पूर्णांक जाँचें।", "ਖੱਬੀ ਸੀਮਾ ਤੋਂ ਵੱਡਾ ਪਹਿਲਾ ਅਤੇ ਸੱਜੀ ਸੀਮਾ ਤੋਂ ਛੋਟਾ ਆਖ਼ਰੀ ਪੂਰਨ ਅੰਕ ਜਾਂਚੋ।",
        [`मान्य पूर्णांक: ${ints.length ? ints.join(", ") : "कोई नहीं"}।`, `कुल ${ints.length}; अतः वर्ग ${localizedAnswer} है।`],
        [`ਮੰਨੇ ਪੂਰਨ ਅੰਕ: ${ints.length ? ints.join(", ") : "ਕੋਈ ਨਹੀਂ"}।`, `ਕੁੱਲ ${ints.length}; ਇਸ ਲਈ ਵਰਗ ${localizedAnswer} ਹੈ।`],
        "छोटे अंतराल में पड़ोसी पूर्णांक सीधे जाँचना सबसे तेज है।", "ਛੋਟੇ ਅੰਤਰਾਲ ਵਿੱਚ ਨੇੜਲੇ ਪੂਰਨ ਅੰਕ ਸਿੱਧੇ ਜਾਂਚਣਾ ਸਭ ਤੋਂ ਤੇਜ਼ ਹੈ।",
        ["सख्त असमता के सिरे शामिल न करें।", "हर गैर-खाली वास्तविक अंतराल में पूर्णांक होना आवश्यक नहीं।"],
        ["ਸਖ਼ਤ ਅਸਮਤਾ ਦੇ ਸਿਰੇ ਸ਼ਾਮਲ ਨਾ ਕਰੋ।", "ਹਰ ਗੈਰ-ਖਾਲੀ ਵਾਸਤਵਿਕ ਅੰਤਰਾਲ ਵਿੱਚ ਪੂਰਨ ਅੰਕ ਹੋਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ।"], localizedAnswer);
    }
    case "NUM-CP001-PROT-022": {
      const middle = num(s, "middle"); const target = text(s, "target");
      const result = target === "first" ? num(s, "first") : target === "middle" ? middle : num(s, "last");
      return explanation(locale,
        "विषम संख्या वाले क्रमागत समूह में औसत ठीक मध्य पूर्णांक होता है।",
        "ਟਾਂਕ ਗਿਣਤੀ ਵਾਲੇ ਲਗਾਤਾਰ ਸਮੂਹ ਵਿੱਚ ਔਸਤ ਠੀਕ ਵਿਚਕਾਰਲਾ ਪੂਰਨ ਅੰਕ ਹੁੰਦਾ ਹੈ।",
        "पहले मध्य मान निकालें, फिर माँगे गए स्थान तक 1-1 कदम जाएँ।", "ਪਹਿਲਾਂ ਵਿਚਕਾਰਲਾ ਮੁੱਲ ਕੱਢੋ, ਫਿਰ ਮੰਗੀ ਥਾਂ ਤੱਕ 1-1 ਕਦਮ ਜਾਓ।",
        [`मध्य पूर्णांक = ${num(s, "sum")} ÷ ${num(s, "len")} = ${middle}।`, `माँगा गया मान ${result} है।`],
        [`ਵਿਚਕਾਰਲਾ ਪੂਰਨ ਅੰਕ = ${num(s, "sum")} ÷ ${num(s, "len")} = ${middle}।`, `ਮੰਗਿਆ ਮੁੱਲ ${result} ਹੈ।`],
        "औसत मिलने के बाद पहले/अंतिम तक केवल निश्चित कदम गिनें।", "ਔਸਤ ਮਿਲਣ ਤੋਂ ਬਾਅਦ ਪਹਿਲੇ/ਆਖ਼ਰੀ ਤੱਕ ਕੇਵਲ ਨਿਰਧਾਰਤ ਕਦਮ ਗਿਣੋ।",
        ["औसत को हर बार अंतिम उत्तर न मानें।", "पदों की जगह अंतरालों की संख्या गिनें।"],
        ["ਔਸਤ ਨੂੰ ਹਰ ਵਾਰ ਅੰਤਿਮ ਉੱਤਰ ਨਾ ਮੰਨੋ।", "ਪਦਾਂ ਦੀ ਥਾਂ ਅੰਤਰਾਂ ਦੀ ਗਿਣਤੀ ਗਿਣੋ।"], localizedAnswer);
    }
    case "NUM-CP001-PROT-023": {
      const len = num(s, "len"); const S = num(s, "proposedSum");
      const doubledFirst = 2 * S / len - (len - 1);
      return explanation(locale,
        "प्रस्तावित योग तभी संभव है जब उलटा क्रमागत-योग सूत्र पूर्णांक पहला पद दे।",
        "ਪ੍ਰਸਤਾਵਿਤ ਜੋੜ ਤਦੋਂ ਹੀ ਸੰਭਵ ਹੈ ਜਦੋਂ ਉਲਟਾ ਲਗਾਤਾਰ-ਜੋੜ ਸੂਤਰ ਪੂਰਨ ਅੰਕ ਪਹਿਲਾ ਪਦ ਦੇਵੇ।",
        "2S/k − (k − 1) की समता जाँचें; इसे 2 से भाग देने पर पहला पद मिलता है।", "2S/k − (k − 1) ਦੀ ਜਿਸਤਤਾ ਜਾਂਚੋ; ਇਸ ਨੂੰ 2 ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਪਹਿਲਾ ਪਦ ਮਿਲਦਾ ਹੈ।",
        [`2S/k − (k − 1) = ${doubledFirst}।`, `इससे निष्कर्ष ${localizedAnswer} है।`],
        [`2S/k − (k − 1) = ${doubledFirst}।`, `ਇਸ ਤੋਂ ਨਤੀਜਾ ${localizedAnswer} ਹੈ।`],
        "विषम लंबाई में औसत पूर्णांक और सम लंबाई में आधा-पूर्णांक हो सकता है।", "ਟਾਂਕ ਲੰਬਾਈ ਵਿੱਚ ਔਸਤ ਪੂਰਨ ਅੰਕ ਅਤੇ ਜਿਸਤ ਲੰਬਾਈ ਵਿੱਚ ਅੱਧਾ-ਪੂਰਨ ਅੰਕ ਹੋ ਸਕਦਾ ਹੈ।",
        ["सिर्फ देखने में उचित योग को संभव न मानें।", "सम लंबाई के लिए आधा-पूर्णांक औसत को असंभव न समझें।"],
        ["ਕੇਵਲ ਵੇਖਣ ਵਿੱਚ ਢੁੱਕਵੇਂ ਜੋੜ ਨੂੰ ਸੰਭਵ ਨਾ ਮੰਨੋ।", "ਜਿਸਤ ਲੰਬਾਈ ਲਈ ਅੱਧਾ-ਪੂਰਨ ਅੰਕ ਔਸਤ ਨੂੰ ਅਸੰਭਵ ਨਾ ਸਮਝੋ।"], localizedAnswer);
    }
    case "NUM-CP001-PROT-024": {
      const truths = booleanArray(s, "truths");
      return explanation(locale,
        "कथन-संयोजन में हर कथन को स्वतंत्र रूप से सही/गलत जाँचकर अंत में संयोजन चुनना चाहिए।",
        "ਕਥਨ-ਸੰਯੋਜਨ ਵਿੱਚ ਹਰ ਕਥਨ ਨੂੰ ਅਲੱਗ ਸਹੀ/ਗਲਤ ਜਾਂਚ ਕੇ ਅੰਤ ਵਿੱਚ ਸੰਯੋਜਨ ਚੁਣਨਾ ਚਾਹੀਦਾ ਹੈ।",
        "I, II और III पर परिभाषा, क्रम और सम-विषम नियम अलग-अलग लगाएँ।", "I, II ਅਤੇ III ਉੱਤੇ ਪਰਿਭਾਸ਼ਾ, ਕ੍ਰਮ ਅਤੇ ਜਿਸਤ-ਟਾਂਕ ਨਿਯਮ ਵੱਖ-ਵੱਖ ਲਗਾਓ।",
        truths.map((v, i) => `कथन ${["I", "II", "III"][i]} ${v ? "सही" : "गलत"} है।`),
        truths.map((v, i) => `ਕਥਨ ${["I", "II", "III"][i]} ${v ? "ਸਹੀ" : "ਗਲਤ"} ਹੈ।`),
        "पहले T/F पैटर्न बनाकर फिर विकल्प से मिलाएँ।", "ਪਹਿਲਾਂ ਸਹੀ/ਗਲਤ ਪੈਟਰਨ ਬਣਾਕੇ ਫਿਰ ਵਿਕਲਪ ਨਾਲ ਮਿਲਾਓ।",
        ["एक परिचित सही कथन देखकर पूरा विकल्प सही न मानें।", "ऋण चिह्न से असमता की दिशा बदलती है।"],
        ["ਇੱਕ ਜਾਣਿਆ ਸਹੀ ਕਥਨ ਵੇਖ ਕੇ ਪੂਰਾ ਵਿਕਲਪ ਸਹੀ ਨਾ ਮੰਨੋ।", "ਰਿਣ ਨਿਸ਼ਾਨ ਨਾਲ ਅਸਮਤਾ ਦੀ ਦਿਸ਼ਾ ਬਦਲਦੀ ਹੈ।"], localizedAnswer);
    }
    case "NUM-CP001-PROT-025": {
      const a = numberArray(s, "firstCandidates"); const b = numberArray(s, "secondCandidates"); const both = numberArray(s, "combinedCandidates");
      return explanation(locale,
        "डेटा पर्याप्त तभी है जब संबंधित कथन ठीक एक अनुमत पूर्णांक छोड़ता है।",
        "ਡਾਟਾ ਤਦੋਂ ਹੀ ਕਾਫ਼ੀ ਹੈ ਜਦੋਂ ਸੰਬੰਧਿਤ ਕਥਨ ਠੀਕ ਇੱਕ ਮਨਜ਼ੂਰ ਪੂਰਨ ਅੰਕ ਛੱਡਦਾ ਹੈ।",
        "कथन I, कथन II और दोनों के प्रतिच्छेद के उम्मीदवार अलग-अलग लिखें।", "ਕਥਨ I, ਕਥਨ II ਅਤੇ ਦੋਵਾਂ ਦੇ ਛੇਦ ਦੇ ਉਮੀਦਵਾਰ ਵੱਖ-ਵੱਖ ਲਿਖੋ।",
        [`I से {${a.join(", ")}} बचते हैं।`, `II से {${b.join(", ")}} बचते हैं।`, `दोनों से {${both.join(", ")}} बचते हैं; इसलिए ${localizedAnswer}।`],
        [`I ਨਾਲ {${a.join(", ")}} ਬਚਦੇ ਹਨ।`, `II ਨਾਲ {${b.join(", ")}} ਬਚਦੇ ਹਨ।`, `ਦੋਵਾਂ ਨਾਲ {${both.join(", ")}} ਬਚਦੇ ਹਨ; ਇਸ ਲਈ ${localizedAnswer}।`],
        "उम्मीदवारों की संख्या 1 हो तो पर्याप्त; 2 या अधिक हो तो अपर्याप्त।", "ਉਮੀਦਵਾਰਾਂ ਦੀ ਗਿਣਤੀ 1 ਹੋਵੇ ਤਾਂ ਕਾਫ਼ੀ; 2 ਜਾਂ ਵੱਧ ਹੋਵੇ ਤਾਂ ਅਕਾਫ਼ੀ।",
        ["दोनों कथन मिलाने से पहले प्रत्येक को अकेले जाँचें।", "सिर्फ informative दिखने से कथन पर्याप्त नहीं होता।"],
        ["ਦੋਵੇਂ ਕਥਨ ਮਿਲਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਹਰ ਇੱਕ ਨੂੰ ਇਕੱਲਾ ਜਾਂਚੋ।", "ਕੇਵਲ ਜਾਣਕਾਰੀਪੂਰਨ ਲੱਗਣ ਨਾਲ ਕਥਨ ਕਾਫ਼ੀ ਨਹੀਂ ਹੁੰਦਾ।"], localizedAnswer);
    }
    case "NUM-CP001-PROT-026": {
      const k = num(s, "k"); const fact = num(s, "factorial");
      return explanation(locale,
        "k क्रमागत पूर्णांकों का गुणनफल हमेशा k! से विभाज्य होता है, और यही सबसे बड़ा सार्वत्रिक सुनिश्चित भाजक है।",
        "k ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਦਾ ਗੁਣਨਫਲ ਹਮੇਸ਼ਾ k! ਨਾਲ ਭਾਜਯ ਹੁੰਦਾ ਹੈ, ਅਤੇ ਇਹੀ ਸਭ ਤੋਂ ਵੱਡਾ ਸਰਬਭੌਮ ਯਕੀਨੀ ਭਾਜਕ ਹੈ।",
        `${k} क्रमागत गुणकों को पहचानकर ${k}! लगाएँ।`, `${k} ਲਗਾਤਾਰ ਗੁਣਕ ਪਛਾਣ ਕੇ ${k}! ਲਗਾਓ।`,
        [`${k}! = ${fact}।`, `हर ${k}-पद क्रमागत ब्लॉक का गुणनफल ${fact} से विभाज्य है।`, `1×2×…×${k} = ${fact}, इसलिए इससे बड़ा भाजक हर बार सुनिश्चित नहीं हो सकता।`],
        [`${k}! = ${fact}।`, `ਹਰ ${k}-ਪਦ ਲਗਾਤਾਰ ਬਲਾਕ ਦਾ ਗੁਣਨਫਲ ${fact} ਨਾਲ ਭਾਜਯ ਹੈ।`, `1×2×…×${k} = ${fact}, ਇਸ ਲਈ ਇਸ ਤੋਂ ਵੱਡਾ ਭਾਜਕ ਹਰ ਵਾਰ ਯਕੀਨੀ ਨਹੀਂ ਹੋ ਸਕਦਾ।`],
        "पूरा क्रमागत ब्लॉक दिखे तो सार्वत्रिक विभाज्यता को सीधे k! से जोड़ें।", "ਪੂਰਾ ਲਗਾਤਾਰ ਬਲਾਕ ਦਿਖੇ ਤਾਂ ਸਰਬਭੌਮ ਭਾਜਯਤਾ ਨੂੰ ਸਿੱਧਾ k! ਨਾਲ ਜੋੜੋ।",
        ["केवल पदों की संख्या k को उत्तर न लें।", "एक नमूना गुणनफल देखकर अतिरिक्त स्थायी गुणक न मानें।"],
        ["ਕੇਵਲ ਪਦਾਂ ਦੀ ਗਿਣਤੀ k ਨੂੰ ਉੱਤਰ ਨਾ ਲਵੋ।", "ਇੱਕ ਨਮੂਨਾ ਗੁਣਨਫਲ ਵੇਖ ਕੇ ਵਾਧੂ ਸਥਾਈ ਗੁਣਕ ਨਾ ਮੰਨੋ।"], localizedAnswer);
    }
    default:
      throw new Error(`Unsupported explanation prototype ${p}`);
  }
}

export function runNumCp001LocalizedPipeline(
  input: NumCp001LocalizedRuntimeInput,
): NumCp001LocalizedQuestion {
  const canonical = runNumCp001PermanentPipeline({
    questionLanguageId: input.questionLanguageId,
    seed: input.seed,
    language: "en",
  });
  const locale = input.locale;
  const language = locale === "hi-IN" ? "hi" : "pa";
  const options: NumCp001LocalizedOption[] = canonical.options.map((option) => ({
    ...option,
    value: translateNumCp001OptionValue(option.value, locale),
  }));
  const canonicalAnswer = translateNumCp001OptionValue(canonical.canonicalAnswer, locale);
  const verifierAnswer = translateNumCp001OptionValue(canonical.verifierAnswer, locale);
  const stem = localizedStem(canonical, locale);
  const explanationValue = localizedExplanation(canonical, locale, canonicalAnswer);

  if (options.length !== canonical.options.length) throw new Error("Localized option count changed");
  if (options[canonical.correctIndex]?.value !== canonicalAnswer) {
    throw new Error(`${canonical.questionLanguageId}/${canonical.seed}/${locale}: localized correct option mismatch`);
  }
  if (canonicalAnswer !== verifierAnswer) {
    throw new Error(`${canonical.questionLanguageId}/${canonical.seed}/${locale}: localized verifier mismatch`);
  }

  return {
    ...canonical,
    locale,
    language,
    stem,
    options,
    canonicalAnswer,
    verifierAnswer,
    explanation: explanationValue,
    traceability: {
      ...canonical.traceability,
      language,
    },
    localization: {
      localizationVersion: "num-cp001-hi-pa-v1",
      canonicalLocale: "en-IN",
      canonicalLanguage: "en",
      canonicalQuestionId: canonical.questionId,
      canonicalAnswer: canonical.canonicalAnswer,
      canonicalVerifierAnswer: canonical.verifierAnswer,
      locale,
      language,
      mathematicalStatePreserved: true,
      optionOrderPreserved: true,
      correctIndexPreserved: true,
      misconceptionMappingPreserved: true,
      lifecycleLocked: true,
    },
  };
}
