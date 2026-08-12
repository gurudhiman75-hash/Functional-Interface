import { runNumCp007PermanentPipeline } from "../permanent/runtime.ts";
import type { NumCp007PermanentQlId } from "../permanent/allocation.ts";
import type { NumCp007PermanentQuestion } from "../permanent/runtime.ts";
import type {
  NumCp007LocalizedExplanation,
  NumCp007LocalizedOption,
  NumCp007LocalizedQuestion,
  NumCp007TranslatedLocale,
} from "./types.ts";

export interface NumCp007LocalizedRuntimeInput {
  readonly questionLanguageId?: NumCp007PermanentQlId;
  readonly seed?: number;
  readonly locale: NumCp007TranslatedLocale;
}

type State = Readonly<Record<string, unknown>>;

const tx = (locale: NumCp007TranslatedLocale, hi: string, pa: string): string => locale === "hi-IN" ? hi : pa;

function num(state: State, key: string): number {
  const value = state[key];
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`Missing numeric state ${key}`);
  return value;
}

function text(state: State, key: string): string {
  const value = state[key];
  if (value === undefined || value === null) throw new Error(`Missing state ${key}`);
  return String(value);
}

function numbers(state: State, key: string): number[] {
  const value = state[key];
  if (!Array.isArray(value)) throw new Error(`Missing array state ${key}`);
  return value.map(Number);
}

function mod(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

function valuesInRange(lower: number, upper: number, divisor: number, remainder: number): number[] {
  const output: number[] = [];
  for (let value = lower; value <= upper; value += 1) {
    if (mod(value, divisor) === remainder) output.push(value);
  }
  return output;
}

function applyBound(values: readonly number[], operator: string, bound: number): number[] {
  return values.filter((value) => operator === "GT" ? value > bound : value < bound);
}

const FIXED_OPTION_TRANSLATIONS: Readonly<Record<NumCp007TranslatedLocale, Readonly<Record<string, string>>>> = {
  "hi-IN": {
    "No value": "कोई मान नहीं",
    "No integer satisfies the condition": "कोई पूर्णांक शर्त को पूरा नहीं करता",
    "Exactly one integer satisfies the condition": "केवल एक पूर्णांक शर्त को पूरा करता है",
    "More than one integer satisfies the condition": "एक से अधिक पूर्णांक शर्त को पूरा करते हैं",
    "The remainder condition itself is invalid": "शेषफल की शर्त ही अमान्य है",
    "The lower multiple is nearer": "निचला गुणज अधिक निकट है",
    "The upper multiple is nearer": "ऊपरी गुणज अधिक निकट है",
    "The two neighbouring multiples are equally near": "दोनों पड़ोसी गुणज समान दूरी पर हैं",
    "The given number is already a multiple": "दी गई संख्या पहले से ही गुणज है",
    "Valid division state": "मान्य भाग स्थिति",
    "Invalid: division identity fails": "अमान्य: भाग का समीकरण सही नहीं है",
    "Invalid: remainder condition fails": "अमान्य: शेषफल की शर्त पूरी नहीं होती",
    "Invalid: both conditions fail": "अमान्य: दोनों शर्तें पूरी नहीं होतीं",
    "I and II only": "केवल I और II",
    "I and III only": "केवल I और III",
    "II and III only": "केवल II और III",
    "I, II and III": "I, II और III तीनों",
    "Statement I alone is sufficient": "केवल कथन I पर्याप्त है",
    "Statement II alone is sufficient": "केवल कथन II पर्याप्त है",
    "Both statements together are sufficient, but neither alone is sufficient": "दोनों कथन मिलकर पर्याप्त हैं, पर कोई भी अकेला पर्याप्त नहीं है",
    "Even both statements together are not sufficient": "दोनों कथन मिलकर भी पर्याप्त नहीं हैं",
  },
  "pa-IN": {
    "No value": "ਕੋਈ ਮੁੱਲ ਨਹੀਂ",
    "No integer satisfies the condition": "ਕੋਈ ਪੂਰਨ ਅੰਕ ਸ਼ਰਤ ਪੂਰੀ ਨਹੀਂ ਕਰਦਾ",
    "Exactly one integer satisfies the condition": "ਕੇਵਲ ਇੱਕ ਪੂਰਨ ਅੰਕ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦਾ ਹੈ",
    "More than one integer satisfies the condition": "ਇੱਕ ਤੋਂ ਵੱਧ ਪੂਰਨ ਅੰਕ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦੇ ਹਨ",
    "The remainder condition itself is invalid": "ਬਾਕੀ ਵਾਲੀ ਸ਼ਰਤ ਹੀ ਅਵੈਧ ਹੈ",
    "The lower multiple is nearer": "ਹੇਠਲਾ ਗੁਣਜ ਵੱਧ ਨੇੜੇ ਹੈ",
    "The upper multiple is nearer": "ਉੱਪਰਲਾ ਗੁਣਜ ਵੱਧ ਨੇੜੇ ਹੈ",
    "The two neighbouring multiples are equally near": "ਦੋਵੇਂ ਨੇੜਲੇ ਗੁਣਜ ਇੱਕੋ ਦੂਰੀ ਤੇ ਹਨ",
    "The given number is already a multiple": "ਦਿੱਤੀ ਸੰਖਿਆ ਪਹਿਲਾਂ ਹੀ ਗੁਣਜ ਹੈ",
    "Valid division state": "ਵੈਧ ਭਾਗ ਸਥਿਤੀ",
    "Invalid: division identity fails": "ਅਵੈਧ: ਭਾਗ ਦਾ ਸਮੀਕਰਨ ਸਹੀ ਨਹੀਂ ਹੈ",
    "Invalid: remainder condition fails": "ਅਵੈਧ: ਬਾਕੀ ਵਾਲੀ ਸ਼ਰਤ ਪੂਰੀ ਨਹੀਂ ਹੁੰਦੀ",
    "Invalid: both conditions fail": "ਅਵੈਧ: ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਨਹੀਂ ਹੁੰਦੀਆਂ",
    "I and II only": "ਕੇਵਲ I ਅਤੇ II",
    "I and III only": "ਕੇਵਲ I ਅਤੇ III",
    "II and III only": "ਕੇਵਲ II ਅਤੇ III",
    "I, II and III": "I, II ਅਤੇ III ਤਿੰਨੇ",
    "Statement I alone is sufficient": "ਕੇਵਲ ਕਥਨ I ਕਾਫ਼ੀ ਹੈ",
    "Statement II alone is sufficient": "ਕੇਵਲ ਕਥਨ II ਕਾਫ਼ੀ ਹੈ",
    "Both statements together are sufficient, but neither alone is sufficient": "ਦੋਵੇਂ ਕਥਨ ਮਿਲ ਕੇ ਕਾਫ਼ੀ ਹਨ, ਪਰ ਕੋਈ ਵੀ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ",
    "Even both statements together are not sufficient": "ਦੋਵੇਂ ਕਥਨ ਮਿਲ ਕੇ ਵੀ ਕਾਫ਼ੀ ਨਹੀਂ ਹਨ",
  },
};

export function translateNumCp007OptionValue(value: string, locale: NumCp007TranslatedLocale): string {
  const fixed = FIXED_OPTION_TRANSLATIONS[locale][value];
  if (fixed) return fixed;

  const qr = value.match(/^Quotient (-?\d+); remainder (-?\d+)$/);
  if (qr) return tx(locale, `भागफल ${qr[1]}; शेषफल ${qr[2]}`, `ਭਾਗਫਲ ${qr[1]}; ਬਾਕੀ ${qr[2]}`);

  const pair = value.match(/^First remainder (-?\d+); second remainder (-?\d+)$/);
  if (pair) return tx(locale, `पहला शेषफल ${pair[1]}; दूसरा शेषफल ${pair[2]}`, `ਪਹਿਲੀ ਬਾਕੀ ${pair[1]}; ਦੂਜੀ ਬਾਕੀ ${pair[2]}`);

  return value;
}

function localizedStem(question: NumCp007PermanentQuestion, locale: NumCp007TranslatedLocale): string {
  const s = question.hiddenState;
  const task = text(s, "task");
  switch (task) {
    case "REMAINDER_FROM_STATE":
      return tx(locale,
        `${num(s, "dividend")} को ${num(s, "divisor")} से भाग देने पर भागफल ${num(s, "quotient")} है। शेषफल ज्ञात कीजिए।`,
        `${num(s, "dividend")} ਨੂੰ ${num(s, "divisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਭਾਗਫਲ ${num(s, "quotient")} ਹੈ। ਬਾਕੀ ਕੱਢੋ।`);
    case "DIVIDEND_FROM_STATE":
      return tx(locale,
        `किसी संख्या को ${num(s, "divisor")} से भाग देने पर भागफल ${num(s, "quotient")} और शेषफल ${num(s, "remainder")} मिलता है। वह संख्या ज्ञात कीजिए।`,
        `ਕਿਸੇ ਸੰਖਿਆ ਨੂੰ ${num(s, "divisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਭਾਗਫਲ ${num(s, "quotient")} ਅਤੇ ਬਾਕੀ ${num(s, "remainder")} ਮਿਲਦੀ ਹੈ। ਉਹ ਸੰਖਿਆ ਕੱਢੋ।`);
    case "DIVISOR_FROM_STATE":
      return tx(locale,
        `${num(s, "dividend")} को किसी संख्या से भाग देने पर भागफल ${num(s, "quotient")} और शेषफल ${num(s, "remainder")} मिलता है। भाजक ज्ञात कीजिए।`,
        `${num(s, "dividend")} ਨੂੰ ਕਿਸੇ ਸੰਖਿਆ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਭਾਗਫਲ ${num(s, "quotient")} ਅਤੇ ਬਾਕੀ ${num(s, "remainder")} ਮਿਲਦੀ ਹੈ। ਭਾਜਕ ਕੱਢੋ।`);
    case "QUOTIENT_FROM_STATE":
      return tx(locale,
        `${num(s, "dividend")} को ${num(s, "divisor")} से भाग देने पर शेषफल ${num(s, "remainder")} मिलता है। भागफल ज्ञात कीजिए।`,
        `${num(s, "dividend")} ਨੂੰ ${num(s, "divisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${num(s, "remainder")} ਮਿਲਦੀ ਹੈ। ਭਾਗਫਲ ਕੱਢੋ।`);
    case "SELECT_VALID_STATE":
      return tx(locale, "निम्नलिखित में से कौन-सा भाग कथन सही है?", "ਹੇਠਾਂ ਦਿੱਤੇ ਭਾਗ ਕਥਨਾਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸਹੀ ਹੈ?");
    case "SUM_REMAINDER":
      return tx(locale,
        `दो संख्याएँ ${num(s, "divisor")} से भाग देने पर क्रमशः ${num(s, "remainderA")} और ${num(s, "remainderB")} शेष देती हैं। उनके योग को ${num(s, "divisor")} से भाग देने पर शेषफल क्या होगा?`,
        `ਦੋ ਸੰਖਿਆਵਾਂ ਨੂੰ ${num(s, "divisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਕ੍ਰਮਵਾਰ ${num(s, "remainderA")} ਅਤੇ ${num(s, "remainderB")} ਬਾਕੀ ਮਿਲਦੀ ਹੈ। ਉਨ੍ਹਾਂ ਦੇ ਜੋੜ ਨੂੰ ${num(s, "divisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ਕੀ ਹੋਵੇਗੀ?`);
    case "DIFFERENCE_REMAINDER":
      return tx(locale,
        `A और B को ${num(s, "divisor")} से भाग देने पर क्रमशः ${num(s, "remainderA")} और ${num(s, "remainderB")} शेष मिलते हैं। A − B को ${num(s, "divisor")} से भाग देने पर शेषफल क्या होगा?`,
        `A ਅਤੇ B ਨੂੰ ${num(s, "divisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਕ੍ਰਮਵਾਰ ${num(s, "remainderA")} ਅਤੇ ${num(s, "remainderB")} ਬਾਕੀ ਮਿਲਦੀ ਹੈ। A − B ਨੂੰ ${num(s, "divisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ਕੀ ਹੋਵੇਗੀ?`);
    case "PRODUCT_REMAINDER":
      return tx(locale,
        `दो संख्याएँ ${num(s, "divisor")} से भाग देने पर क्रमशः ${num(s, "remainderA")} और ${num(s, "remainderB")} शेष देती हैं। उनके गुणनफल को ${num(s, "divisor")} से भाग देने पर शेषफल क्या होगा?`,
        `ਦੋ ਸੰਖਿਆਵਾਂ ਨੂੰ ${num(s, "divisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਕ੍ਰਮਵਾਰ ${num(s, "remainderA")} ਅਤੇ ${num(s, "remainderB")} ਬਾਕੀ ਮਿਲਦੀ ਹੈ। ਉਨ੍ਹਾਂ ਦੇ ਗੁਣਨਫਲ ਨੂੰ ${num(s, "divisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ਕੀ ਹੋਵੇਗੀ?`);
    case "EXACT_DIVISIBILITY_ADJUSTMENT": {
      const add = text(s, "operation") === "ADD";
      return tx(locale,
        `${num(s, "dividend")} में कम-से-कम कौन-सी गैर-ऋणात्मक संख्या ${add ? "जोड़ी" : "घटाई"} जाए ताकि परिणाम ${num(s, "divisor")} से पूर्णतः विभाज्य हो?`,
        `${num(s, "dividend")} ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਕਿਹੜੀ ਗੈਰ-ਰਣਾਤਮਕ ਸੰਖਿਆ ${add ? "ਜੋੜੀ" : "ਘਟਾਈ"} ਜਾਵੇ ਤਾਂ ਜੋ ਨਤੀਜਾ ${num(s, "divisor")} ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਾਗਯੋਗ ਹੋਵੇ?`);
    }
    case "SCALED_REMAINDER":
      return tx(locale,
        `N को ${num(s, "divisor")} से भाग देने पर शेषफल ${num(s, "remainder")} है। ${num(s, "multiplier")}N को ${num(s, "divisor")} से भाग देने पर शेषफल क्या होगा?`,
        `N ਨੂੰ ${num(s, "divisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${num(s, "remainder")} ਹੈ। ${num(s, "multiplier")}N ਨੂੰ ${num(s, "divisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ਕੀ ਹੋਵੇਗੀ?`);
    case "COMPATIBLE_NESTED_REMAINDER":
      return tx(locale,
        `किसी संख्या को ${num(s, "largeDivisor")} से भाग देने पर शेषफल ${num(s, "knownRemainder")} है। उसी संख्या को ${num(s, "smallDivisor")} से भाग देने पर शेषफल क्या होगा?`,
        `ਕਿਸੇ ਸੰਖਿਆ ਨੂੰ ${num(s, "largeDivisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${num(s, "knownRemainder")} ਹੈ। ਉਸੇ ਸੰਖਿਆ ਨੂੰ ${num(s, "smallDivisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ਕੀ ਹੋਵੇਗੀ?`);
    case "POLYNOMIAL_REMAINDER": {
      const expression = s.quadratic
        ? `N² + ${num(s, "coefficient")}N + ${num(s, "constant")}`
        : `${num(s, "coefficient")}N + ${num(s, "constant")}`;
      return tx(locale,
        `N को ${num(s, "divisor")} से भाग देने पर शेषफल ${num(s, "remainder")} है। ${expression} को ${num(s, "divisor")} से भाग देने पर शेषफल क्या होगा?`,
        `N ਨੂੰ ${num(s, "divisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${num(s, "remainder")} ਹੈ। ${expression} ਨੂੰ ${num(s, "divisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ਕੀ ਹੋਵੇਗੀ?`);
    }
    case "LINKED_DIVISOR_QUOTIENT":
      return tx(locale,
        `${num(s, "dividend")} को एक भाजक से भाग दिया गया। शेषफल ${num(s, "remainder")} है और भाजक, भागफल से ${num(s, "gap")} अधिक है। भाजक ज्ञात कीजिए।`,
        `${num(s, "dividend")} ਨੂੰ ਇੱਕ ਭਾਜਕ ਨਾਲ ਭਾਗ ਦਿੱਤਾ ਗਿਆ। ਬਾਕੀ ${num(s, "remainder")} ਹੈ ਅਤੇ ਭਾਜਕ, ਭਾਗਫਲ ਤੋਂ ${num(s, "gap")} ਵੱਧ ਹੈ। ਭਾਜਕ ਕੱਢੋ।`);
    case "BOUNDED_DIVIDEND_COUNT":
      return tx(locale,
        `${num(s, "lower")} से ${num(s, "upper")} तक, दोनों सहित, कितने पूर्णांक ${num(s, "divisor")} से भाग देने पर शेषफल ${num(s, "remainder")} देते हैं?`,
        `${num(s, "lower")} ਤੋਂ ${num(s, "upper")} ਤੱਕ, ਦੋਵੇਂ ਸਮੇਤ, ਕਿੰਨੇ ਪੂਰਨ ਅੰਕ ${num(s, "divisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${num(s, "remainder")} ਦਿੰਦੇ ਹਨ?`);
    case "BOUNDED_SOLUTION_CLASS":
      return tx(locale,
        `${num(s, "lower")} से ${num(s, "upper")} तक, दोनों सहित, उन पूर्णांकों पर विचार कीजिए जिन्हें ${num(s, "divisor")} से भाग देने पर शेषफल ${num(s, "remainder")} मिलता है। कौन-सा कथन सही है?`,
        `${num(s, "lower")} ਤੋਂ ${num(s, "upper")} ਤੱਕ, ਦੋਵੇਂ ਸਮੇਤ, ਉਹ ਪੂਰਨ ਅੰਕ ਵੇਖੋ ਜਿਨ੍ਹਾਂ ਨੂੰ ${num(s, "divisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${num(s, "remainder")} ਮਿਲਦੀ ਹੈ। ਕਿਹੜਾ ਕਥਨ ਸਹੀ ਹੈ?`);
    case "NEAREST_MULTIPLE_CLASS":
      return tx(locale,
        `संख्या ${num(s, "number")} और भाजक ${num(s, "divisor")} के लिए ${num(s, "divisor")} के निकटतम गुणज के बारे में कौन-सा कथन सही है?`,
        `ਸੰਖਿਆ ${num(s, "number")} ਅਤੇ ਭਾਜਕ ${num(s, "divisor")} ਲਈ ${num(s, "divisor")} ਦੇ ਸਭ ਤੋਂ ਨੇੜਲੇ ਗੁਣਜ ਬਾਰੇ ਕਿਹੜਾ ਕਥਨ ਸਹੀ ਹੈ?`);
    case "BOUNDED_DIVIDEND_RECONSTRUCTION":
      return tx(locale,
        `एक संख्या ${num(s, "lower")} से ${num(s, "upper")} के बीच, दोनों सहित, है। उसे ${num(s, "divisor")} से भाग देने पर शेषफल ${num(s, "remainder")} मिलता है। संख्या ज्ञात कीजिए।`,
        `ਇੱਕ ਸੰਖਿਆ ${num(s, "lower")} ਤੋਂ ${num(s, "upper")} ਦੇ ਵਿਚਕਾਰ, ਦੋਵੇਂ ਸਮੇਤ, ਹੈ। ਉਸ ਨੂੰ ${num(s, "divisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${num(s, "remainder")} ਮਿਲਦੀ ਹੈ। ਸੰਖਿਆ ਕੱਢੋ।`);
    case "BOUNDED_NUMBER_SET":
      return tx(locale,
        `कौन-सा समुच्चय ${num(s, "lower")} से ${num(s, "upper")} तक, दोनों सहित, उन सभी पूर्णांकों को दिखाता है जिन्हें ${num(s, "divisor")} से भाग देने पर शेषफल ${num(s, "remainder")} मिलता है?`,
        `ਕਿਹੜਾ ਸਮੂਹ ${num(s, "lower")} ਤੋਂ ${num(s, "upper")} ਤੱਕ, ਦੋਵੇਂ ਸਮੇਤ, ਉਹ ਸਾਰੇ ਪੂਰਨ ਅੰਕ ਦਿਖਾਉਂਦਾ ਹੈ ਜਿਨ੍ਹਾਂ ਨੂੰ ${num(s, "divisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${num(s, "remainder")} ਮਿਲਦੀ ਹੈ?`);
    case "DIVISION_STATE_CLASSIFICATION":
      return tx(locale,
        `एक भाग अभिलेख में भाज्य ${num(s, "dividend")}, भाजक ${num(s, "divisor")}, भागफल ${num(s, "quotient")} और शेषफल ${num(s, "remainder")} दिया है। इसे कैसे वर्गीकृत किया जाए?`,
        `ਇੱਕ ਭਾਗ ਦਰਜ ਵਿੱਚ ਭਾਜਯ ${num(s, "dividend")}, ਭਾਜਕ ${num(s, "divisor")}, ਭਾਗਫਲ ${num(s, "quotient")} ਅਤੇ ਬਾਕੀ ${num(s, "remainder")} ਦਿੱਤੇ ਹਨ। ਇਸ ਨੂੰ ਕਿਵੇਂ ਵਰਗੀਕ੍ਰਿਤ ਕੀਤਾ ਜਾਵੇ?`);
    case "SAME_REMAINDER_DIVISOR_CANDIDATE":
      return tx(locale,
        `${num(s, "first")} और ${num(s, "second")} को निम्न विकल्पों में से किसी एक भाजक से भाग देने पर समान शेषफल मिलता है। कौन-सा भाजक यह शर्त पूरी कर सकता है?`,
        `${num(s, "first")} ਅਤੇ ${num(s, "second")} ਨੂੰ ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ਕਿਸੇ ਇੱਕ ਭਾਜਕ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਇੱਕੋ ਬਾਕੀ ਮਿਲਦੀ ਹੈ। ਕਿਹੜਾ ਭਾਜਕ ਇਹ ਸ਼ਰਤ ਪੂਰੀ ਕਰ ਸਕਦਾ ਹੈ?`);
    case "QUOTIENT_REMAINDER_TABLE":
      return tx(locale,
        `${num(s, "dividend")} ÷ ${num(s, "divisor")} के लिए कौन-सा विकल्प सही भागफल और शेषफल देता है?`,
        `${num(s, "dividend")} ÷ ${num(s, "divisor")} ਲਈ ਕਿਹੜਾ ਵਿਕਲਪ ਸਹੀ ਭਾਗਫਲ ਅਤੇ ਬਾਕੀ ਦਿੰਦਾ ਹੈ?`);
    case "STATEMENT_COMBINATION": {
      const ii = text(s, "statementIIClaim") === "LT"
        ? tx(locale, `II. शेषफल ${num(s, "remainder")} भाजक ${num(s, "divisor")} से छोटा है।`, `II. ਬਾਕੀ ${num(s, "remainder")} ਭਾਜਕ ${num(s, "divisor")} ਤੋਂ ਛੋਟੀ ਹੈ।`)
        : tx(locale, `II. शेषफल ${num(s, "remainder")} भाजक ${num(s, "divisor")} के बराबर या उससे बड़ा है।`, `II. ਬਾਕੀ ${num(s, "remainder")} ਭਾਜਕ ${num(s, "divisor")} ਦੇ ਬਰਾਬਰ ਜਾਂ ਉਸ ਤੋਂ ਵੱਡੀ ਹੈ।`);
      return tx(locale,
        `एक भाग स्थिति के बारे में ये कथन हैं:\nI. ${num(s, "dividend")} = ${num(s, "divisor")} × ${num(s, "quotient")} + ${num(s, "statementIAddedRemainder")}\n${ii}\nIII. ${num(s, "statementIIIValue")} संख्या ${num(s, "divisor")} से विभाज्य है।\nकौन-से कथन सही हैं?`,
        `ਇੱਕ ਭਾਗ ਸਥਿਤੀ ਬਾਰੇ ਇਹ ਕਥਨ ਹਨ:\nI. ${num(s, "dividend")} = ${num(s, "divisor")} × ${num(s, "quotient")} + ${num(s, "statementIAddedRemainder")}\n${ii}\nIII. ${num(s, "statementIIIValue")} ਸੰਖਿਆ ${num(s, "divisor")} ਨਾਲ ਭਾਗਯੋਗ ਹੈ।\nਕਿਹੜੇ ਕਥਨ ਸਹੀ ਹਨ?`);
    }
    case "DATA_SUFFICIENCY": {
      const opI = text(s, "statementIOperator") === "GT" ? ">" : "<";
      const opII = text(s, "statementIIOperator") === "GT" ? ">" : "<";
      return tx(locale,
        `एक संख्या N, ${num(s, "lower")} से ${num(s, "upper")} तक, दोनों सहित, है और ${num(s, "divisor")} से भाग देने पर शेषफल ${num(s, "remainder")} देती है। क्या नीचे दी गई जानकारी N को अद्वितीय रूप से ज्ञात करने के लिए पर्याप्त है?\nI. N ${opI} ${num(s, "statementIValue")}\nII. N ${opII} ${num(s, "statementIIValue")}`,
        `ਇੱਕ ਸੰਖਿਆ N, ${num(s, "lower")} ਤੋਂ ${num(s, "upper")} ਤੱਕ, ਦੋਵੇਂ ਸਮੇਤ, ਹੈ ਅਤੇ ${num(s, "divisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${num(s, "remainder")} ਦਿੰਦੀ ਹੈ। ਕੀ ਹੇਠਾਂ ਦਿੱਤੀ ਜਾਣਕਾਰੀ N ਨੂੰ ਇਕੋ ਮੁੱਲ ਵਜੋਂ ਨਿਰਧਾਰਤ ਕਰਨ ਲਈ ਕਾਫ਼ੀ ਹੈ?\nI. N ${opI} ${num(s, "statementIValue")}\nII. N ${opII} ${num(s, "statementIIValue")}`);
    }
    case "LINKED_STATE_MINI_CASELET":
      return tx(locale,
        `भाग से जुड़ी जानकारी है: संख्या ${num(s, "dividend")} है, शेषफल ${num(s, "remainder")} है और भाजक, भागफल से ${num(s, "gap")} अधिक है। भागफल ज्ञात कीजिए।`,
        `ਭਾਗ ਨਾਲ ਜੁੜੀ ਜਾਣਕਾਰੀ ਹੈ: ਸੰਖਿਆ ${num(s, "dividend")} ਹੈ, ਬਾਕੀ ${num(s, "remainder")} ਹੈ ਅਤੇ ਭਾਜਕ, ਭਾਗਫਲ ਤੋਂ ${num(s, "gap")} ਵੱਧ ਹੈ। ਭਾਗਫਲ ਕੱਢੋ।`);
    case "RICHER_LINKED_RELATION": {
      const d = Number(question.canonicalAnswer);
      const q = Math.floor(num(s, "dividend") / d);
      const r = mod(num(s, "dividend"), d);
      const mode = text(s, "mode");
      const relation = mode === "D_MULTIPLE_Q_AND_R"
        ? tx(locale, `भाजक, भागफल का ${num(s, "a")} गुना और शेषफल का ${num(s, "b")} गुना है`, `ਭਾਜਕ, ਭਾਗਫਲ ਦਾ ${num(s, "a")} ਗੁਣਾ ਅਤੇ ਬਾਕੀ ਦਾ ${num(s, "b")} ਗੁਣਾ ਹੈ`)
        : mode === "D_MULTIPLE_Q_WITH_GAP"
          ? tx(locale, `भाजक, भागफल का ${num(s, "a")} गुना है और भागफल शेषफल से ${num(s, "gap")} अधिक है`, `ਭਾਜਕ, ਭਾਗਫਲ ਦਾ ${num(s, "a")} ਗੁਣਾ ਹੈ ਅਤੇ ਭਾਗਫਲ ਬਾਕੀ ਤੋਂ ${num(s, "gap")} ਵੱਧ ਹੈ`)
          : tx(locale, `भाजक, शेषफल का ${num(s, "b")} गुना है और भागफल शेषफल से ${num(s, "gap")} अधिक है`, `ਭਾਜਕ, ਬਾਕੀ ਦਾ ${num(s, "b")} ਗੁਣਾ ਹੈ ਅਤੇ ਭਾਗਫਲ ਬਾਕੀ ਤੋਂ ${num(s, "gap")} ਵੱਧ ਹੈ`);
      void q; void r;
      return tx(locale,
        `${num(s, "dividend")} को एक धनात्मक पूर्णांक से भाग देने पर ${relation}। भाजक ज्ञात कीजिए।`,
        `${num(s, "dividend")} ਨੂੰ ਇੱਕ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ${relation}। ਭਾਜਕ ਕੱਢੋ।`);
    }
    case "INVERSE_REMAINDER_PROPAGATION":
      return text(s, "mode") === "SUM_ONE_WRAP"
        ? tx(locale,
            `A और B को एक ही धनात्मक भाजक से भाग देने पर क्रमशः ${num(s, "r1")} और ${num(s, "r2")} शेष मिलते हैं। उनके योग का शेषफल ${num(s, "r3")} है और दोनों शेषफलों का योग भाजक को ठीक एक बार पार करता है। भाजक ज्ञात कीजिए।`,
            `A ਅਤੇ B ਨੂੰ ਇੱਕੋ ਧਨਾਤਮਕ ਭਾਜਕ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਕ੍ਰਮਵਾਰ ${num(s, "r1")} ਅਤੇ ${num(s, "r2")} ਬਾਕੀ ਮਿਲਦੀ ਹੈ। ਉਨ੍ਹਾਂ ਦੇ ਜੋੜ ਦੀ ਬਾਕੀ ${num(s, "r3")} ਹੈ ਅਤੇ ਦੋਵੇਂ ਬਾਕੀਆਂ ਦਾ ਜੋੜ ਭਾਜਕ ਨੂੰ ਠੀਕ ਇੱਕ ਵਾਰ ਪਾਰ ਕਰਦਾ ਹੈ। ਭਾਜਕ ਕੱਢੋ।`)
        : tx(locale,
            `एक संख्या को धनात्मक भाजक d से भाग देने पर शेषफल ${num(s, "remainder")} है। उस संख्या के ${num(s, "k")} गुने को उसी d से भाग देने पर शेषफल ${num(s, "scaledRemainder")} है। बिना घटाया अवशेष d को ठीक एक बार पार करता है। d ज्ञात कीजिए।`,
            `ਇੱਕ ਸੰਖਿਆ ਨੂੰ ਧਨਾਤਮਕ ਭਾਜਕ d ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${num(s, "remainder")} ਹੈ। ਉਸ ਸੰਖਿਆ ਦੇ ${num(s, "k")} ਗੁਣੇ ਨੂੰ ਉਸੇ d ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${num(s, "scaledRemainder")} ਹੈ। ਘਟਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਵਾਲਾ ਮੁੱਲ d ਨੂੰ ਠੀਕ ਇੱਕ ਵਾਰ ਪਾਰ ਕਰਦਾ ਹੈ। d ਕੱਢੋ।`);
    case "SUCCESSIVE_DIVISION_CHAIN":
      return text(s, "target") === "ORIGINAL_NUMBER"
        ? tx(locale,
            `एक संख्या को पहले ${num(s, "d1")} से भाग देने पर शेषफल ${num(s, "r1")} मिलता है। प्राप्त भागफल को ${num(s, "d2")} से भाग देने पर शेषफल ${num(s, "r2")} और भागफल ${num(s, "finalQ")} मिलता है। मूल संख्या ज्ञात कीजिए।`,
            `ਇੱਕ ਸੰਖਿਆ ਨੂੰ ਪਹਿਲਾਂ ${num(s, "d1")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${num(s, "r1")} ਮਿਲਦੀ ਹੈ। ਮਿਲੇ ਭਾਗਫਲ ਨੂੰ ${num(s, "d2")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${num(s, "r2")} ਅਤੇ ਭਾਗਫਲ ${num(s, "finalQ")} ਮਿਲਦਾ ਹੈ। ਮੂਲ ਸੰਖਿਆ ਕੱਢੋ।`)
        : tx(locale,
            `एक संख्या को पहले ${num(s, "d1")} से भाग देने पर शेषफल ${num(s, "r1")} और फिर प्राप्त भागफल को ${num(s, "d2")} से भाग देने पर शेषफल ${num(s, "r2")} मिलता है। मूल संख्या को ${num(s, "d1") * num(s, "d2")} से भाग देने पर शेषफल क्या होगा?`,
            `ਇੱਕ ਸੰਖਿਆ ਨੂੰ ਪਹਿਲਾਂ ${num(s, "d1")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${num(s, "r1")} ਅਤੇ ਫਿਰ ਮਿਲੇ ਭਾਗਫਲ ਨੂੰ ${num(s, "d2")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${num(s, "r2")} ਮਿਲਦੀ ਹੈ। ਮੂਲ ਸੰਖਿਆ ਨੂੰ ${num(s, "d1") * num(s, "d2")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ਕੀ ਹੋਵੇਗੀ?`);
    case "REVERSE_SUCCESSIVE_DIVISION":
      return tx(locale,
        `एक संख्या को क्रमशः ${num(s, "d1")} और ${num(s, "d2")} से भाग देने पर शेषफल ${num(s, "r1")} और ${num(s, "r2")} तथा अंतिम भागफल ${num(s, "finalQ")} मिलता है। यदि उसी संख्या को क्रमशः ${num(s, "d2")} और ${num(s, "d1")} से भाग दिया जाए, तो नए शेषफल क्रम में क्या होंगे?`,
        `ਇੱਕ ਸੰਖਿਆ ਨੂੰ ਕ੍ਰਮਵਾਰ ${num(s, "d1")} ਅਤੇ ${num(s, "d2")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀਆਂ ${num(s, "r1")} ਅਤੇ ${num(s, "r2")} ਅਤੇ ਅੰਤਿਮ ਭਾਗਫਲ ${num(s, "finalQ")} ਮਿਲਦਾ ਹੈ। ਜੇ ਉਸੇ ਸੰਖਿਆ ਨੂੰ ਕ੍ਰਮਵਾਰ ${num(s, "d2")} ਅਤੇ ${num(s, "d1")} ਨਾਲ ਭਾਗ ਦਿੱਤਾ ਜਾਵੇ, ਤਾਂ ਨਵੀਆਂ ਬਾਕੀਆਂ ਕ੍ਰਮ ਵਿੱਚ ਕੀ ਹੋਣਗੀਆਂ?`);
    case "WRONG_DIVISOR_CORRECTION":
      return tx(locale,
        `एक विद्यार्थी ने किसी संख्या को ${num(s, "correctDivisor")} के बजाय गलती से ${num(s, "wrongDivisor")} से भाग दिया और भागफल ${num(s, "wrongQuotient")} तथा शेषफल ${num(s, "wrongRemainder")} पाया। सही भाजक ${num(s, "correctDivisor")} से भाग देने पर सही भागफल और शेषफल क्या होंगे?`,
        `ਇੱਕ ਵਿਦਿਆਰਥੀ ਨੇ ਕਿਸੇ ਸੰਖਿਆ ਨੂੰ ${num(s, "correctDivisor")} ਦੀ ਥਾਂ ਗਲਤੀ ਨਾਲ ${num(s, "wrongDivisor")} ਨਾਲ ਭਾਗ ਦਿੱਤਾ ਅਤੇ ਭਾਗਫਲ ${num(s, "wrongQuotient")} ਅਤੇ ਬਾਕੀ ${num(s, "wrongRemainder")} ਮਿਲੀ। ਸਹੀ ਭਾਜਕ ${num(s, "correctDivisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਸਹੀ ਭਾਗਫਲ ਅਤੇ ਬਾਕੀ ਕੀ ਹੋਣਗੇ?`);
    case "LONG_DIVISION_TRACE": {
      const digits = String(num(s, "dividend")).split("");
      let prefix = "";
      const trace = numbers(s, "remainders").map((remainder, index) => {
        prefix += digits[index] ?? "";
        return tx(locale, `उपसर्ग ${Number(prefix)} के बाद शेष ${remainder}`, `ਅਗਲੇ ਅੰਕ ${Number(prefix)} ਤੱਕ ਬਾਕੀ ${remainder}`);
      }).join("; ");
      return tx(locale,
        `${num(s, "dividend")} का 2 से ${num(s, "maxDivisor")} के बीच किसी अज्ञात पूर्णांक भाजक से दीर्घ भाग किया गया। क्रमिक शेषफल हैं: ${trace}। कौन-सा भाजक पूरे क्रम से मेल खाता है?`,
        `${num(s, "dividend")} ਨੂੰ 2 ਤੋਂ ${num(s, "maxDivisor")} ਵਿਚਕਾਰ ਕਿਸੇ ਅਣਜਾਣ ਪੂਰਨ ਅੰਕ ਭਾਜਕ ਨਾਲ ਲੰਮਾ ਭਾਗ ਦਿੱਤਾ ਗਿਆ। ਕ੍ਰਮਵਾਰ ਬਾਕੀਆਂ ਹਨ: ${trace}। ਕਿਹੜਾ ਭਾਜਕ ਪੂਰੇ ਕ੍ਰਮ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ?`);
    }
    case "BOUNDED_NONZERO_REMAINDER_EXTREMUM":
      return text(s, "mode") === "LEAST_ABOVE"
        ? tx(locale,
            `${num(s, "bound")} से बड़ी वह सबसे छोटी पूर्णांक संख्या ज्ञात कीजिए जिसे ${num(s, "divisor")} से भाग देने पर शेषफल ${num(s, "remainder")} मिले।`,
            `${num(s, "bound")} ਤੋਂ ਵੱਡੀ ਸਭ ਤੋਂ ਛੋਟੀ ਪੂਰਨ ਅੰਕ ਸੰਖਿਆ ਕੱਢੋ ਜਿਸ ਨੂੰ ${num(s, "divisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${num(s, "remainder")} ਮਿਲੇ।`)
        : tx(locale,
            `${num(s, "bound")} से छोटी वह सबसे बड़ी पूर्णांक संख्या ज्ञात कीजिए जिसे ${num(s, "divisor")} से भाग देने पर शेषफल ${num(s, "remainder")} मिले।`,
            `${num(s, "bound")} ਤੋਂ ਛੋਟੀ ਸਭ ਤੋਂ ਵੱਡੀ ਪੂਰਨ ਅੰਕ ਸੰਖਿਆ ਕੱਢੋ ਜਿਸ ਨੂੰ ${num(s, "divisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${num(s, "remainder")} ਮਿਲੇ।`);
    case "SAME_REMAINDER_BOUNDED_RECONSTRUCTION":
      return tx(locale,
        `${num(s, "first")} और ${num(s, "second")} को पूर्णांक d से भाग देने पर समान शेषफल मिलता है। यदि ${num(s, "lower")} ≤ d ≤ ${num(s, "upper")}, तो d ज्ञात कीजिए।`,
        `${num(s, "first")} ਅਤੇ ${num(s, "second")} ਨੂੰ ਪੂਰਨ ਅੰਕ d ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਇੱਕੋ ਬਾਕੀ ਮਿਲਦੀ ਹੈ। ਜੇ ${num(s, "lower")} ≤ d ≤ ${num(s, "upper")}, ਤਾਂ d ਕੱਢੋ।`);
    default:
      throw new Error(`Unsupported NUM-CP-007 localization task: ${task}`);
  }
}

function localizedExplanation(question: NumCp007PermanentQuestion, locale: NumCp007TranslatedLocale): NumCp007LocalizedExplanation {
  const s = question.hiddenState;
  const task = text(s, "task");
  const answer = translateNumCp007OptionValue(question.canonicalAnswer, locale);
  const finalAnswer = tx(locale, `अंतिम उत्तर: ${answer}`, `ਅੰਤਿਮ ਉੱਤਰ: ${answer}`);
  const build = (coreHi: string, corePa: string, strategyHi: string, strategyPa: string, hiSteps: readonly string[], paSteps: readonly string[]): NumCp007LocalizedExplanation => ({
    coreConcept: tx(locale, coreHi, corePa),
    strategy: tx(locale, strategyHi, strategyPa),
    steps: locale === "hi-IN" ? hiSteps : paSteps,
    finalAnswer,
  });

  switch (task) {
    case "REMAINDER_FROM_STATE": {
      const product = num(s, "divisor") * num(s, "quotient");
      return build("भाग नियम है: भाज्य = भाजक × भागफल + शेषफल।", "ਭਾਗ ਦਾ ਨਿਯਮ ਹੈ: ਭਾਜਯ = ਭਾਜਕ × ਭਾਗਫਲ + ਬਾਕੀ।",
        "दिए गए तीन मान रखकर शेषफल अलग करें।", "ਦਿੱਤੇ ਤਿੰਨ ਮੁੱਲ ਰੱਖ ਕੇ ਬਾਕੀ ਕੱਢੋ।",
        [`भाग नियम से ${num(s,"dividend")} = ${num(s,"divisor")} × ${num(s,"quotient")} + r।`, `गुणा करने पर ${num(s,"divisor")} × ${num(s,"quotient")} = ${product}।`, `इसलिए शेषफल r = ${num(s,"dividend")} − ${product} = ${num(s,"remainder")}।`],
        [`ਭਾਗ ਨਿਯਮ ਤੋਂ ${num(s,"dividend")} = ${num(s,"divisor")} × ${num(s,"quotient")} + r।`, `ਗੁਣਾ ਕਰਨ ਤੇ ${num(s,"divisor")} × ${num(s,"quotient")} = ${product}।`, `ਇਸ ਲਈ ਬਾਕੀ r = ${num(s,"dividend")} − ${product} = ${num(s,"remainder")}।`]);
    }
    case "DIVIDEND_FROM_STATE": {
      const product = num(s,"divisor") * num(s,"quotient");
      return build("भाज्य निकालने के लिए भाजक × भागफल में शेषफल जोड़ते हैं।", "ਭਾਜਯ ਕੱਢਣ ਲਈ ਭਾਜਕ × ਭਾਗਫਲ ਵਿੱਚ ਬਾਕੀ ਜੋੜਦੇ ਹਾਂ।",
        "पहले गुणा करें, फिर शेषफल जोड़ें।", "ਪਹਿਲਾਂ ਗੁਣਾ ਕਰੋ, ਫਿਰ ਬਾਕੀ ਜੋੜੋ।",
        [`गुणा: ${num(s,"divisor")} × ${num(s,"quotient")} = ${product}।`, `अब शेषफल जोड़ें: ${product} + ${num(s,"remainder")} = ${num(s,"dividend")}।`],
        [`ਗੁਣਾ: ${num(s,"divisor")} × ${num(s,"quotient")} = ${product}।`, `ਹੁਣ ਬਾਕੀ ਜੋੜੋ: ${product} + ${num(s,"remainder")} = ${num(s,"dividend")}।`]);
    }
    case "DIVISOR_FROM_STATE": {
      const adjusted = num(s,"dividend") - num(s,"remainder");
      return build("शेषफल हटाने पर बची राशि = भाजक × भागफल।", "ਬਾਕੀ ਹਟਾਉਣ ਤੇ ਬਚਿਆ ਮੁੱਲ = ਭਾਜਕ × ਭਾਗਫਲ।",
        "भाज्य से शेषफल घटाकर भागफल से भाग दें।", "ਭਾਜਯ ਵਿੱਚੋਂ ਬਾਕੀ ਘਟਾ ਕੇ ਭਾਗਫਲ ਨਾਲ ਭਾਗ ਦਿਓ।",
        [`पहले ${num(s,"dividend")} − ${num(s,"remainder")} = ${adjusted}।`, `भाजक = ${adjusted} ÷ ${num(s,"quotient")} = ${num(s,"divisor")}।`],
        [`ਪਹਿਲਾਂ ${num(s,"dividend")} − ${num(s,"remainder")} = ${adjusted}।`, `ਭਾਜਕ = ${adjusted} ÷ ${num(s,"quotient")} = ${num(s,"divisor")}।`]);
    }
    case "QUOTIENT_FROM_STATE": {
      const adjusted = num(s,"dividend") - num(s,"remainder");
      return build("शेषफल हटाने के बाद भाजक से भाग देने पर भागफल मिलता है।", "ਬਾਕੀ ਹਟਾਉਣ ਤੋਂ ਬਾਅਦ ਭਾਜਕ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਭਾਗਫਲ ਮਿਲਦਾ ਹੈ।",
        "भाज्य से शेषफल घटाएँ और भाजक से भाग दें।", "ਭਾਜਯ ਵਿੱਚੋਂ ਬਾਕੀ ਘਟਾਓ ਅਤੇ ਭਾਜਕ ਨਾਲ ਭਾਗ ਦਿਓ।",
        [`पहले ${num(s,"dividend")} − ${num(s,"remainder")} = ${adjusted}।`, `भागफल = ${adjusted} ÷ ${num(s,"divisor")} = ${num(s,"quotient")}।`],
        [`ਪਹਿਲਾਂ ${num(s,"dividend")} − ${num(s,"remainder")} = ${adjusted}।`, `ਭਾਗਫਲ = ${adjusted} ÷ ${num(s,"divisor")} = ${num(s,"quotient")}।`]);
    }
    case "SELECT_VALID_STATE":
      return build("सही भाग स्थिति में N = dq + r और 0 ≤ r < d दोनों शर्तें पूरी होती हैं।", "ਸਹੀ ਭਾਗ ਸਥਿਤੀ ਵਿੱਚ N = dq + r ਅਤੇ 0 ≤ r < d ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਹੁੰਦੀਆਂ ਹਨ।",
        "हर विकल्प में समीकरण और शेषफल की सीमा दोनों जाँचें।", "ਹਰ ਵਿਕਲਪ ਵਿੱਚ ਸਮੀਕਰਨ ਅਤੇ ਬਾਕੀ ਦੀ ਹੱਦ ਦੋਵੇਂ ਜਾਂਚੋ।",
        [`सही गणना है ${num(s,"divisor")} × ${num(s,"quotient")} + ${num(s,"remainder")} = ${num(s,"dividend")}।`, `साथ ही ${num(s,"remainder")} शून्य से कम नहीं और ${num(s,"divisor")} से छोटा है।`],
        [`ਸਹੀ ਗਣਨਾ ਹੈ ${num(s,"divisor")} × ${num(s,"quotient")} + ${num(s,"remainder")} = ${num(s,"dividend")}।`, `ਨਾਲ ਹੀ ${num(s,"remainder")} ਸਿਫ਼ਰ ਤੋਂ ਘੱਟ ਨਹੀਂ ਅਤੇ ${num(s,"divisor")} ਤੋਂ ਛੋਟੀ ਹੈ।`]);
    case "SUM_REMAINDER":
    case "DIFFERENCE_REMAINDER":
    case "PRODUCT_REMAINDER": {
      const a = num(s,"remainderA"), b = num(s,"remainderB"), d = num(s,"divisor");
      const raw = task === "SUM_REMAINDER" ? a + b : task === "DIFFERENCE_REMAINDER" ? a - b : a * b;
      const symbol = task === "SUM_REMAINDER" ? "+" : task === "DIFFERENCE_REMAINDER" ? "−" : "×";
      return build("योग, अंतर या गुणनफल का शेषफल ज्ञात करने के लिए पहले ज्ञात शेषफलों पर वही क्रिया करें, फिर भाजक से घटाएँ।", "ਜੋੜ, ਅੰਤਰ ਜਾਂ ਗੁਣਨਫਲ ਦੀ ਬਾਕੀ ਲਈ ਪਹਿਲਾਂ ਦਿੱਤੀਆਂ ਬਾਕੀਆਂ ਤੇ ਉਹੀ ਕਿਰਿਆ ਕਰੋ, ਫਿਰ ਭਾਜਕ ਨਾਲ ਘਟਾਓ।",
        "कच्चा मान निकालकर उसका न्यूनतम गैर-ऋणात्मक शेषफल लें।", "ਕੱਚਾ ਮੁੱਲ ਕੱਢ ਕੇ ਉਸ ਦੀ ਸਭ ਤੋਂ ਛੋਟੀ ਗੈਰ-ਰਣਾਤਮਕ ਬਾਕੀ ਲਵੋ।",
        [`पहली गणना: ${a} ${symbol} ${b} = ${raw}।`, `अब ${raw} को ${d} से घटाने पर शेषफल ${mod(raw,d)} मिलता है।`],
        [`ਪਹਿਲੀ ਗਣਨਾ: ${a} ${symbol} ${b} = ${raw}।`, `ਹੁਣ ${raw} ਨੂੰ ${d} ਨਾਲ ਘਟਾਉਣ ਤੇ ਬਾਕੀ ${mod(raw,d)} ਮਿਲਦੀ ਹੈ।`]);
    }
    case "EXACT_DIVISIBILITY_ADJUSTMENT": {
      const add = text(s,"operation") === "ADD";
      const r = num(s,"remainder"), d = num(s,"divisor");
      const required = add ? (d - r) % d : r;
      return build("पूर्ण विभाज्यता के लिए वर्तमान शेषफल को शून्य तक पहुँचाना होता है।", "ਪੂਰੀ ਭਾਗਯੋਗਤਾ ਲਈ ਮੌਜੂਦਾ ਬਾਕੀ ਨੂੰ ਸਿਫ਼ਰ ਤੱਕ ਲਿਆਉਣਾ ਹੁੰਦਾ ਹੈ।",
        add ? "अगले गुणज तक की दूरी लें।" : "पिछले गुणज तक लौटने के लिए वर्तमान शेषफल घटाएँ।", add ? "ਅਗਲੇ ਗੁਣਜ ਤੱਕ ਦੀ ਦੂਰੀ ਲਵੋ।" : "ਪਿਛਲੇ ਗੁਣਜ ਤੱਕ ਜਾਣ ਲਈ ਮੌਜੂਦਾ ਬਾਕੀ ਘਟਾਓ।",
        [`${num(s,"dividend")} को ${d} से भाग देने पर शेषफल ${r} है।`, add ? `आवश्यक जोड़ = (${d} − ${r}) mod ${d} = ${required}।` : `आवश्यक घटाव = वर्तमान शेषफल = ${required}।`],
        [`${num(s,"dividend")} ਨੂੰ ${d} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${r} ਹੈ।`, add ? `ਲੋੜੀਂਦਾ ਜੋੜ = (${d} − ${r}) mod ${d} = ${required}।` : `ਲੋੜੀਂਦੀ ਘਟਾਉ = ਮੌਜੂਦਾ ਬਾਕੀ = ${required}।`]);
    }
    case "SCALED_REMAINDER": {
      const raw = num(s,"multiplier") * num(s,"remainder");
      return build("किसी गुणज का शेषफल उसी गुणांक से मूल शेषफल को गुणा करके पाया जा सकता है।", "ਕਿਸੇ ਗੁਣਜ ਦੀ ਬਾਕੀ ਮੂਲ ਬਾਕੀ ਨੂੰ ਉਸੇ ਗੁਣਕ ਨਾਲ ਗੁਣਾ ਕਰਕੇ ਮਿਲ ਸਕਦੀ ਹੈ।",
        "ज्ञात शेषफल को गुणांक से गुणा कर भाजक से शेष लें।", "ਦਿੱਤੀ ਬਾਕੀ ਨੂੰ ਗੁਣਕ ਨਾਲ ਗੁਣਾ ਕਰਕੇ ਭਾਜਕ ਨਾਲ ਬਾਕੀ ਲਵੋ।",
        [`पहले ${num(s,"multiplier")} × ${num(s,"remainder")} = ${raw}।`, `फिर ${raw} को ${num(s,"divisor")} से भाग देने पर शेषफल ${mod(raw,num(s,"divisor"))}।`],
        [`ਪਹਿਲਾਂ ${num(s,"multiplier")} × ${num(s,"remainder")} = ${raw}।`, `ਫਿਰ ${raw} ਨੂੰ ${num(s,"divisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${mod(raw,num(s,"divisor"))}।`]);
    }
    case "COMPATIBLE_NESTED_REMAINDER":
      return build("जब बड़ा भाजक छोटे भाजक का गुणज हो, तो ज्ञात शेषफल को छोटे भाजक से फिर घटाना पर्याप्त है।", "ਜਦੋਂ ਵੱਡਾ ਭਾਜਕ ਛੋਟੇ ਭਾਜਕ ਦਾ ਗੁਣਜ ਹੋਵੇ, ਤਾਂ ਦਿੱਤੀ ਬਾਕੀ ਨੂੰ ਛੋਟੇ ਭਾਜਕ ਨਾਲ ਫਿਰ ਘਟਾਉਣਾ ਕਾਫ਼ੀ ਹੈ।",
        "पहले भाजकों का संबंध देखें, फिर केवल शेषफल को छोटे भाजक से भाग दें।", "ਪਹਿਲਾਂ ਭਾਜਕਾਂ ਦਾ ਸੰਬੰਧ ਵੇਖੋ, ਫਿਰ ਕੇਵਲ ਬਾਕੀ ਨੂੰ ਛੋਟੇ ਭਾਜਕ ਨਾਲ ਭਾਗ ਦਿਓ।",
        [`यहाँ ${num(s,"largeDivisor")} = ${num(s,"smallDivisor")} × ${num(s,"factor")}।`, `इसलिए ${num(s,"knownRemainder")} को ${num(s,"smallDivisor")} से भाग देने पर नया शेषफल ${mod(num(s,"knownRemainder"),num(s,"smallDivisor"))}।`],
        [`ਇੱਥੇ ${num(s,"largeDivisor")} = ${num(s,"smallDivisor")} × ${num(s,"factor")}।`, `ਇਸ ਲਈ ${num(s,"knownRemainder")} ਨੂੰ ${num(s,"smallDivisor")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਨਵੀਂ ਬਾਕੀ ${mod(num(s,"knownRemainder"),num(s,"smallDivisor"))}।`]);
    case "POLYNOMIAL_REMAINDER": {
      const r=num(s,"remainder"), c=num(s,"coefficient"), k=num(s,"constant"), d=num(s,"divisor");
      const raw = s.quadratic ? r*r+c*r+k : c*r+k;
      return build("बहुपद में N की जगह उसका शेषफल रखकर वही अंतिम शेषफल मिलता है।", "ਬਹੁਪਦ ਵਿੱਚ N ਦੀ ਥਾਂ ਉਸ ਦੀ ਬਾਕੀ ਰੱਖ ਕੇ ਉਹੀ ਅੰਤਿਮ ਬਾਕੀ ਮਿਲਦੀ ਹੈ।",
        "N को ज्ञात शेषफल से बदलें, अभिव्यक्ति का मान निकालें और भाजक से घटाएँ।", "N ਨੂੰ ਦਿੱਤੀ ਬਾਕੀ ਨਾਲ ਬਦਲੋ, ਅਭਿਵੈਕਤੀ ਦਾ ਮੁੱਲ ਕੱਢੋ ਅਤੇ ਭਾਜਕ ਨਾਲ ਘਟਾਓ।",
        [s.quadratic ? `मान रखने पर ${r}² + ${c} × ${r} + ${k} = ${raw}।` : `मान रखने पर ${c} × ${r} + ${k} = ${raw}।`, `अब ${raw} को ${d} से भाग देने पर शेषफल ${mod(raw,d)}।`],
        [s.quadratic ? `ਮੁੱਲ ਰੱਖਣ ਤੇ ${r}² + ${c} × ${r} + ${k} = ${raw}।` : `ਮੁੱਲ ਰੱਖਣ ਤੇ ${c} × ${r} + ${k} = ${raw}।`, `ਹੁਣ ${raw} ਨੂੰ ${d} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${mod(raw,d)}।`]);
    }
    case "LINKED_DIVISOR_QUOTIENT":
    case "LINKED_STATE_MINI_CASELET":
    case "RICHER_LINKED_RELATION": {
      const dividend=num(s,"dividend");
      const d = task === "LINKED_STATE_MINI_CASELET" ? Number(question.canonicalAnswer)+num(s,"gap") : Number(task === "LINKED_DIVISOR_QUOTIENT" ? num(s,"divisor") : question.canonicalAnswer);
      const q=Math.floor(dividend/d), r=mod(dividend,d);
      return build("भाजक, भागफल और शेषफल के दिए संबंध को N = dq + r के साथ एक साथ पूरा होना चाहिए।", "ਭਾਜਕ, ਭਾਗਫਲ ਅਤੇ ਬਾਕੀ ਦਾ ਦਿੱਤਾ ਸੰਬੰਧ N = dq + r ਨਾਲ ਇਕੱਠੇ ਪੂਰਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।",
        "संबंध से संभावित भाग स्थिति बनाकर भाग नियम से जाँचें।", "ਸੰਬੰਧ ਤੋਂ ਸੰਭਵ ਭਾਗ ਸਥਿਤੀ ਬਣਾਕੇ ਭਾਗ ਨਿਯਮ ਨਾਲ ਜਾਂਚੋ।",
        [`सही स्थिति में भाजक ${d}, भागफल ${q} और शेषफल ${r} है।`, `जाँच: ${d} × ${q} + ${r} = ${dividend}।`],
        [`ਸਹੀ ਸਥਿਤੀ ਵਿੱਚ ਭਾਜਕ ${d}, ਭਾਗਫਲ ${q} ਅਤੇ ਬਾਕੀ ${r} ਹੈ।`, `ਜਾਂਚ: ${d} × ${q} + ${r} = ${dividend}।`]);
    }
    case "BOUNDED_DIVIDEND_COUNT":
    case "BOUNDED_DIVIDEND_RECONSTRUCTION":
    case "BOUNDED_NUMBER_SET": {
      const vals = task === "BOUNDED_DIVIDEND_COUNT" && Array.isArray(s.values) ? numbers(s,"values") : valuesInRange(num(s,"lower"),num(s,"upper"),num(s,"divisor"),num(s,"remainder"));
      return build("एक निश्चित शेषफल देने वाली संख्याएँ भाजक के अंतर से आने वाली समानांतर श्रेणी बनाती हैं।", "ਇੱਕ ਨਿਸ਼ਚਿਤ ਬਾਕੀ ਦੇਣ ਵਾਲੀਆਂ ਸੰਖਿਆਵਾਂ ਭਾਜਕ ਦੇ ਅੰਤਰ ਨਾਲ ਬਣਦੀ ਲੜੀ ਹੁੰਦੀਆਂ ਹਨ।",
        "सीमा के भीतर पहला सही मान लें और हर बार भाजक जोड़ते जाएँ।", "ਹੱਦ ਅੰਦਰ ਪਹਿਲਾ ਸਹੀ ਮੁੱਲ ਲਵੋ ਅਤੇ ਹਰ ਵਾਰ ਭਾਜਕ ਜੋੜਦੇ ਜਾਓ।",
        [`${num(s,"lower")} से ${num(s,"upper")} के भीतर मिलने वाले मान हैं: ${vals.length ? vals.join(", ") : "कोई नहीं"}।`, task === "BOUNDED_DIVIDEND_COUNT" ? `इस सूची में कुल ${vals.length} मान हैं।` : `इन मानों से सही विकल्प सीधे चुना जाता है।`],
        [`${num(s,"lower")} ਤੋਂ ${num(s,"upper")} ਅੰਦਰ ਮਿਲਣ ਵਾਲੇ ਮੁੱਲ ਹਨ: ${vals.length ? vals.join(", ") : "ਕੋਈ ਨਹੀਂ"}।`, task === "BOUNDED_DIVIDEND_COUNT" ? `ਇਸ ਸੂਚੀ ਵਿੱਚ ਕੁੱਲ ${vals.length} ਮੁੱਲ ਹਨ।` : `ਇਨ੍ਹਾਂ ਮੁੱਲਾਂ ਤੋਂ ਸਹੀ ਵਿਕਲਪ ਸਿੱਧਾ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ।`]);
    }
    case "BOUNDED_SOLUTION_CLASS": {
      const vals = num(s,"remainder") >= num(s,"divisor") ? [] : valuesInRange(num(s,"lower"),num(s,"upper"),num(s,"divisor"),num(s,"remainder"));
      return build("पहले जाँचें कि शेषफल 0 से भाजक−1 के बीच है; फिर सीमा में समाधान गिनें।", "ਪਹਿਲਾਂ ਜਾਂਚੋ ਕਿ ਬਾਕੀ 0 ਤੋਂ ਭਾਜਕ−1 ਵਿਚਕਾਰ ਹੈ; ਫਿਰ ਹੱਦ ਅੰਦਰ ਹੱਲ ਗਿਣੋ।",
        "शेषफल वैध हो तो सभी मेल खाते पूर्णांक सूचीबद्ध करें।", "ਬਾਕੀ ਵੈਧ ਹੋਵੇ ਤਾਂ ਸਾਰੇ ਮਿਲਦੇ ਪੂਰਨ ਅੰਕ ਲਿਖੋ।",
        [num(s,"remainder") >= num(s,"divisor") ? `यहाँ शेषफल ${num(s,"remainder")} भाजक ${num(s,"divisor")} से छोटा नहीं है, इसलिए शर्त अमान्य है।` : `सीमा में मेल खाने वाले मान हैं: ${vals.length ? vals.join(", ") : "कोई नहीं"}।`, `इसलिए सही वर्ग है: ${answer}।`],
        [num(s,"remainder") >= num(s,"divisor") ? `ਇੱਥੇ ਬਾਕੀ ${num(s,"remainder")} ਭਾਜਕ ${num(s,"divisor")} ਤੋਂ ਛੋਟੀ ਨਹੀਂ ਹੈ, ਇਸ ਲਈ ਸ਼ਰਤ ਅਵੈਧ ਹੈ।` : `ਹੱਦ ਅੰਦਰ ਮਿਲਦੇ ਮੁੱਲ ਹਨ: ${vals.length ? vals.join(", ") : "ਕੋਈ ਨਹੀਂ"}।`, `ਇਸ ਲਈ ਸਹੀ ਵਰਗ ਹੈ: ${answer}।`]);
    }
    case "NEAREST_MULTIPLE_CLASS":
      return build("निकटतम गुणज तय करने के लिए नीचे और ऊपर के पड़ोसी गुणजों की दूरी तुलना करते हैं।", "ਸਭ ਤੋਂ ਨੇੜਲਾ ਗੁਣਜ ਲੱਭਣ ਲਈ ਹੇਠਲੇ ਅਤੇ ਉੱਪਰਲੇ ਨੇੜਲੇ ਗੁਣਜਾਂ ਦੀ ਦੂਰੀ ਮਿਲਾਈ ਜਾਂਦੀ ਹੈ।",
        "दोनों पड़ोसी गुणज और उनकी दूरियाँ निकालें।", "ਦੋਵੇਂ ਨੇੜਲੇ ਗੁਣਜ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀਆਂ ਦੂਰੀਆਂ ਕੱਢੋ।",
        [`निचला गुणज ${num(s,"lower")} है; दूरी ${num(s,"lowerDistance")}।`, `ऊपरी गुणज ${num(s,"upper")} है; दूरी ${num(s,"upperDistance")}।`, `तुलना से सही निष्कर्ष: ${answer}।`],
        [`ਹੇਠਲਾ ਗੁਣਜ ${num(s,"lower")} ਹੈ; ਦੂਰੀ ${num(s,"lowerDistance")}।`, `ਉੱਪਰਲਾ ਗੁਣਜ ${num(s,"upper")} ਹੈ; ਦੂਰੀ ${num(s,"upperDistance")}।`, `ਤੁਲਨਾ ਤੋਂ ਸਹੀ ਨਤੀਜਾ: ${answer}।`]);
    case "DIVISION_STATE_CLASSIFICATION": {
      const identity=num(s,"divisor")*num(s,"quotient")+num(s,"remainder");
      return build("मान्य भाग स्थिति के लिए समीकरण और शेषफल की सीमा दोनों सही होने चाहिए।", "ਵੈਧ ਭਾਗ ਸਥਿਤੀ ਲਈ ਸਮੀਕਰਨ ਅਤੇ ਬਾਕੀ ਦੀ ਹੱਦ ਦੋਵੇਂ ਸਹੀ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।",
        "दोनों शर्तों को अलग-अलग जाँचकर वर्ग चुनें।", "ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਜਾਂਚ ਕੇ ਵਰਗ ਚੁਣੋ।",
        [`समीकरण जाँच: ${num(s,"divisor")} × ${num(s,"quotient")} + ${num(s,"remainder")} = ${identity}; दिया भाज्य ${num(s,"dividend")}।`, `शेषफल जाँच: 0 ≤ ${num(s,"remainder")} < ${num(s,"divisor")} होना चाहिए।`, `इन जाँचों से वर्ग है: ${answer}।`],
        [`ਸਮੀਕਰਨ ਜਾਂਚ: ${num(s,"divisor")} × ${num(s,"quotient")} + ${num(s,"remainder")} = ${identity}; ਦਿੱਤਾ ਭਾਜਯ ${num(s,"dividend")}।`, `ਬਾਕੀ ਜਾਂਚ: 0 ≤ ${num(s,"remainder")} < ${num(s,"divisor")} ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`, `ਇਨ੍ਹਾਂ ਜਾਂਚਾਂ ਤੋਂ ਵਰਗ ਹੈ: ${answer}।`]);
    }
    case "SAME_REMAINDER_DIVISOR_CANDIDATE":
    case "SAME_REMAINDER_BOUNDED_RECONSTRUCTION": {
      const first=num(s,"first"), second=num(s,"second"), d=Number(question.canonicalAnswer), diff=Math.abs(second-first);
      return build("दो संख्याएँ समान शेष दें तो उनका अंतर भाजक से विभाज्य होता है।", "ਦੋ ਸੰਖਿਆਵਾਂ ਇੱਕੋ ਬਾਕੀ ਦੇਣ ਤਾਂ ਉਨ੍ਹਾਂ ਦਾ ਅੰਤਰ ਭਾਜਕ ਨਾਲ ਭਾਗਯੋਗ ਹੁੰਦਾ ਹੈ।",
        "पहले अंतर निकालें, फिर उम्मीदवार भाजक की विभाज्यता और दोनों शेषफलों की समानता जाँचें।", "ਪਹਿਲਾਂ ਅੰਤਰ ਕੱਢੋ, ਫਿਰ ਸੰਭਵ ਭਾਜਕ ਦੀ ਭਾਗਯੋਗਤਾ ਅਤੇ ਦੋਵੇਂ ਬਾਕੀਆਂ ਦੀ ਸਮਾਨਤਾ ਜਾਂਚੋ।",
        [`अंतर = |${second} − ${first}| = ${diff} और ${diff} संख्या ${d} से विभाज्य है।`, `सीधी जाँच में दोनों संख्याएँ ${d} से भाग देने पर शेषफल ${mod(first,d)} देती हैं।`],
        [`ਅੰਤਰ = |${second} − ${first}| = ${diff} ਅਤੇ ${diff} ਸੰਖਿਆ ${d} ਨਾਲ ਭਾਗਯੋਗ ਹੈ।`, `ਸਿੱਧੀ ਜਾਂਚ ਵਿੱਚ ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ${d} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${mod(first,d)} ਦਿੰਦੀਆਂ ਹਨ।`]);
    }
    case "QUOTIENT_REMAINDER_TABLE": {
      const q=Math.floor(num(s,"dividend")/num(s,"divisor")), r=mod(num(s,"dividend"),num(s,"divisor"));
      return build("भागफल पूरा भाग है और शेषफल भाजक से छोटा बचा हुआ भाग।", "ਭਾਗਫਲ ਪੂਰਾ ਭਾਗ ਹੈ ਅਤੇ ਬਾਕੀ ਭਾਜਕ ਤੋਂ ਛੋਟਾ ਬਚਿਆ ਹਿੱਸਾ ਹੈ।",
        "N = dq + r से दोनों मान एक साथ जाँचें।", "N = dq + r ਨਾਲ ਦੋਵੇਂ ਮੁੱਲ ਇਕੱਠੇ ਜਾਂਚੋ।",
        [`गणना: ${num(s,"dividend")} = ${num(s,"divisor")} × ${q} + ${r}।`, `इसलिए भागफल ${q} और शेषफल ${r} है।`],
        [`ਗਣਨਾ: ${num(s,"dividend")} = ${num(s,"divisor")} × ${q} + ${r}।`, `ਇਸ ਲਈ ਭਾਗਫਲ ${q} ਅਤੇ ਬਾਕੀ ${r} ਹੈ।`]);
    }
    case "STATEMENT_COMBINATION": {
      const iActual=num(s,"divisor")*num(s,"quotient")+num(s,"statementIAddedRemainder");
      const iiTrue=text(s,"statementIIClaim")==="LT" ? num(s,"remainder")<num(s,"divisor") : num(s,"remainder")>=num(s,"divisor");
      const iiiTrue=num(s,"statementIIIValue")%num(s,"divisor")===0;
      return build("कथन-समूह प्रश्न में हर कथन को स्वतंत्र रूप से भाग नियम से जाँचना चाहिए।", "ਕਥਨ-ਸਮੂਹ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਹਰ ਕਥਨ ਨੂੰ ਵੱਖਰੇ ਤੌਰ ਤੇ ਭਾਗ ਨਿਯਮ ਨਾਲ ਜਾਂਚਣਾ ਚਾਹੀਦਾ ਹੈ।",
        "I, II और III को अलग जाँचकर सही संयोजन चुनें।", "I, II ਅਤੇ III ਨੂੰ ਵੱਖ-ਵੱਖ ਜਾਂਚ ਕੇ ਸਹੀ ਜੋੜ ਚੁਣੋ।",
        [`कथन I की दाईं ओर का मान ${iActual} है; इसे दिए भाज्य ${num(s,"dividend")} से मिलाएँ।`, `कथन II की शेषफल-सीमा जाँच ${iiTrue ? "सही" : "गलत"} है।`, `कथन III की विभाज्यता जाँच ${iiiTrue ? "सही" : "गलत"} है; सही संयोजन ${answer}।`],
        [`ਕਥਨ I ਦੇ ਸੱਜੇ ਪਾਸੇ ਦਾ ਮੁੱਲ ${iActual} ਹੈ; ਇਸ ਨੂੰ ਦਿੱਤੇ ਭਾਜਯ ${num(s,"dividend")} ਨਾਲ ਮਿਲਾਓ।`, `ਕਥਨ II ਦੀ ਬਾਕੀ-ਹੱਦ ਜਾਂਚ ${iiTrue ? "ਸਹੀ" : "ਗਲਤ"} ਹੈ।`, `ਕਥਨ III ਦੀ ਭਾਗਯੋਗਤਾ ਜਾਂਚ ${iiiTrue ? "ਸਹੀ" : "ਗਲਤ"} ਹੈ; ਸਹੀ ਜੋੜ ${answer}।`]);
    }
    case "DATA_SUFFICIENCY": {
      const base=valuesInRange(num(s,"lower"),num(s,"upper"),num(s,"divisor"),num(s,"remainder"));
      const afterI=applyBound(base,text(s,"statementIOperator"),num(s,"statementIValue"));
      const afterII=applyBound(base,text(s,"statementIIOperator"),num(s,"statementIIValue"));
      const afterBoth=applyBound(afterI,text(s,"statementIIOperator"),num(s,"statementIIValue"));
      return build("डेटा पर्याप्तता में लक्ष्य यह है कि मान अद्वितीय हो, केवल संभव होना पर्याप्त नहीं।", "ਡਾਟਾ ਕਾਫ਼ੀ ਹੋਣ ਵਾਲੇ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਲਕਸ਼ ਇਹ ਹੈ ਕਿ ਮੁੱਲ ਇਕੋ ਹੋਵੇ; ਕੇਵਲ ਸੰਭਵ ਹੋਣਾ ਕਾਫ਼ੀ ਨਹੀਂ।",
        "पहले सभी उम्मीदवार लिखें, फिर I, II और दोनों को अलग-अलग लागू करें।", "ਪਹਿਲਾਂ ਸਾਰੇ ਉਮੀਦਵਾਰ ਲਿਖੋ, ਫਿਰ I, II ਅਤੇ ਦੋਵੇਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਲਾਗੂ ਕਰੋ।",
        [`मूल उम्मीदवार हैं: ${base.join(", ")}।`, `केवल I के बाद: ${afterI.join(", ")}; केवल II के बाद: ${afterII.join(", ")}।`, `दोनों के बाद: ${afterBoth.join(", ")}; इसलिए निष्कर्ष ${answer}।`],
        [`ਮੂਲ ਉਮੀਦਵਾਰ ਹਨ: ${base.join(", ")}।`, `ਕੇਵਲ I ਤੋਂ ਬਾਅਦ: ${afterI.join(", ")}; ਕੇਵਲ II ਤੋਂ ਬਾਅਦ: ${afterII.join(", ")}।`, `ਦੋਵੇਂ ਤੋਂ ਬਾਅਦ: ${afterBoth.join(", ")}; ਇਸ ਲਈ ਨਤੀਜਾ ${answer}।`]);
    }
    case "INVERSE_REMAINDER_PROPAGATION": {
      if (text(s,"mode")==="SUM_ONE_WRAP") {
        const raw=num(s,"r1")+num(s,"r2"), d=raw-num(s,"r3");
        return build("कच्चे शेषों का योग भाजक को ठीक एक बार पार करे तो कच्चे योग से अंतिम शेषफल घटाने पर भाजक मिलता है।", "ਕੱਚੀਆਂ ਬਾਕੀਆਂ ਦਾ ਜੋੜ ਭਾਜਕ ਨੂੰ ਠੀਕ ਇੱਕ ਵਾਰ ਪਾਰ ਕਰੇ ਤਾਂ ਕੱਚੇ ਜੋੜ ਵਿੱਚੋਂ ਅੰਤਿਮ ਬਾਕੀ ਘਟਾ ਕੇ ਭਾਜਕ ਮਿਲਦਾ ਹੈ।",
          "पहले दोनों शेष जोड़ें, फिर देखा गया शेष घटाएँ।", "ਪਹਿਲਾਂ ਦੋਵੇਂ ਬਾਕੀਆਂ ਜੋੜੋ, ਫਿਰ ਮਿਲੀ ਬਾਕੀ ਘਟਾਓ।",
          [`कच्चा योग ${num(s,"r1")} + ${num(s,"r2")} = ${raw}।`, `एक बार पार करने पर भाजक = ${raw} − ${num(s,"r3")} = ${d}।`],
          [`ਕੱਚਾ ਜੋੜ ${num(s,"r1")} + ${num(s,"r2")} = ${raw}।`, `ਇੱਕ ਵਾਰ ਪਾਰ ਕਰਨ ਤੇ ਭਾਜਕ = ${raw} − ${num(s,"r3")} = ${d}।`]);
      }
      const raw=num(s,"k")*num(s,"remainder"), d=raw-num(s,"scaledRemainder");
      return build("गुणित कच्चा शेष भाजक को ठीक एक बार पार करे तो कच्चे मान से अंतिम शेषफल घटाकर भाजक मिलता है।", "ਗੁਣਿਤ ਕੱਚੀ ਬਾਕੀ ਭਾਜਕ ਨੂੰ ਠੀਕ ਇੱਕ ਵਾਰ ਪਾਰ ਕਰੇ ਤਾਂ ਕੱਚੇ ਮੁੱਲ ਵਿੱਚੋਂ ਅੰਤਿਮ ਬਾਕੀ ਘਟਾ ਕੇ ਭਾਜਕ ਮਿਲਦਾ ਹੈ।",
        "पहले गुणित शेष निकालें, फिर देखा गया शेष घटाएँ।", "ਪਹਿਲਾਂ ਗੁਣਿਤ ਬਾਕੀ ਕੱਢੋ, ਫਿਰ ਮਿਲੀ ਬਾਕੀ ਘਟਾਓ।",
        [`कच्चा मान ${num(s,"k")} × ${num(s,"remainder")} = ${raw}।`, `भाजक = ${raw} − ${num(s,"scaledRemainder")} = ${d}।`],
        [`ਕੱਚਾ ਮੁੱਲ ${num(s,"k")} × ${num(s,"remainder")} = ${raw}।`, `ਭਾਜਕ = ${raw} − ${num(s,"scaledRemainder")} = ${d}।`]);
    }
    case "SUCCESSIVE_DIVISION_CHAIN": {
      const firstQ=num(s,"d2")*num(s,"finalQ")+num(s,"r2");
      const original=num(s,"d1")*firstQ+num(s,"r1");
      return build("क्रमिक भाग में N = dq + r नियम हर चरण पर अलग लागू होता है।", "ਕ੍ਰਮਵਾਰ ਭਾਗ ਵਿੱਚ N = dq + r ਨਿਯਮ ਹਰ ਪੜਾਅ ਤੇ ਵੱਖ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।",
        "बाद वाले भाग से पीछे की ओर चलें या दोनों समीकरण फैलाएँ।", "ਬਾਅਦ ਵਾਲੇ ਭਾਗ ਤੋਂ ਪਿੱਛੇ ਵੱਲ ਚਲੋ ਜਾਂ ਦੋਵੇਂ ਸਮੀਕਰਨ ਖੋਲ੍ਹੋ।",
        [`दूसरे चरण से पहला भागफल = ${num(s,"d2")} × ${num(s,"finalQ")} + ${num(s,"r2")} = ${firstQ}।`, `मूल संख्या = ${num(s,"d1")} × ${firstQ} + ${num(s,"r1")} = ${original}।`, text(s,"target")==="PRODUCT_REMAINDER" ? `इसलिए ${num(s,"d1")*num(s,"d2")} से भाग देने पर शेषफल ${num(s,"productRemainder")}।` : `अतः मूल संख्या ${original}।`],
        [`ਦੂਜੇ ਪੜਾਅ ਤੋਂ ਪਹਿਲਾ ਭਾਗਫਲ = ${num(s,"d2")} × ${num(s,"finalQ")} + ${num(s,"r2")} = ${firstQ}।`, `ਮੂਲ ਸੰਖਿਆ = ${num(s,"d1")} × ${firstQ} + ${num(s,"r1")} = ${original}।`, text(s,"target")==="PRODUCT_REMAINDER" ? `ਇਸ ਲਈ ${num(s,"d1")*num(s,"d2")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${num(s,"productRemainder")}।` : `ਇਸ ਲਈ ਮੂਲ ਸੰਖਿਆ ${original}।`]);
    }
    case "REVERSE_SUCCESSIVE_DIVISION": {
      const original=num(s,"d1")*(num(s,"d2")*num(s,"finalQ")+num(s,"r2"))+num(s,"r1");
      const q1=Math.floor(original/num(s,"d2")), rr1=mod(original,num(s,"d2")), rr2=mod(q1,num(s,"d1"));
      return build("क्रम बदलने पर बीच का भागफल बदलता है, इसलिए पुराने शेषफल केवल अदला-बदली नहीं किए जा सकते।", "ਕ੍ਰਮ ਬਦਲਣ ਤੇ ਵਿਚਕਾਰਲਾ ਭਾਗਫਲ ਬਦਲ ਜਾਂਦਾ ਹੈ, ਇਸ ਲਈ ਪੁਰਾਣੀਆਂ ਬਾਕੀਆਂ ਨੂੰ ਕੇਵਲ ਅਦਲਾ-ਬਦਲੀ ਨਹੀਂ ਕਰ ਸਕਦੇ।",
        "पहले मूल संख्या बनाएँ, फिर नए क्रम में दोनों भाग करें।", "ਪਹਿਲਾਂ ਮੂਲ ਸੰਖਿਆ ਬਣਾਓ, ਫਿਰ ਨਵੇਂ ਕ੍ਰਮ ਵਿੱਚ ਦੋਵੇਂ ਭਾਗ ਕਰੋ।",
        [`मूल संख्या = ${num(s,"d1")} × (${num(s,"d2")} × ${num(s,"finalQ")} + ${num(s,"r2")}) + ${num(s,"r1")} = ${original}।`, `पहले ${original} को ${num(s,"d2")} से भाग देने पर भागफल ${q1} और शेषफल ${rr1}।`, `फिर ${q1} को ${num(s,"d1")} से भाग देने पर शेषफल ${rr2}।`],
        [`ਮੂਲ ਸੰਖਿਆ = ${num(s,"d1")} × (${num(s,"d2")} × ${num(s,"finalQ")} + ${num(s,"r2")}) + ${num(s,"r1")} = ${original}।`, `ਪਹਿਲਾਂ ${original} ਨੂੰ ${num(s,"d2")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਭਾਗਫਲ ${q1} ਅਤੇ ਬਾਕੀ ${rr1}।`, `ਫਿਰ ${q1} ਨੂੰ ${num(s,"d1")} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${rr2}।`]);
    }
    case "WRONG_DIVISOR_CORRECTION": {
      const original=num(s,"wrongDivisor")*num(s,"wrongQuotient")+num(s,"wrongRemainder");
      const q=Math.floor(original/num(s,"correctDivisor")), r=mod(original,num(s,"correctDivisor"));
      return build("गलत भाजक से मिले भागफल और शेषफल से भी मूल भाज्य N = dq + r द्वारा वापस मिल जाता है।", "ਗਲਤ ਭਾਜਕ ਨਾਲ ਮਿਲੇ ਭਾਗਫਲ ਅਤੇ ਬਾਕੀ ਤੋਂ ਵੀ ਮੂਲ ਭਾਜਯ N = dq + r ਨਾਲ ਵਾਪਸ ਮਿਲ ਜਾਂਦਾ ਹੈ।",
        "पहले गलत भाग से मूल संख्या बनाएँ, फिर सही भाजक से दोबारा भाग दें।", "ਪਹਿਲਾਂ ਗਲਤ ਭਾਗ ਤੋਂ ਮੂਲ ਸੰਖਿਆ ਬਣਾਓ, ਫਿਰ ਸਹੀ ਭਾਜਕ ਨਾਲ ਦੁਬਾਰਾ ਭਾਗ ਦਿਓ।",
        [`मूल संख्या = ${num(s,"wrongDivisor")} × ${num(s,"wrongQuotient")} + ${num(s,"wrongRemainder")} = ${original}।`, `सही भाग: ${original} = ${num(s,"correctDivisor")} × ${q} + ${r}।`],
        [`ਮੂਲ ਸੰਖਿਆ = ${num(s,"wrongDivisor")} × ${num(s,"wrongQuotient")} + ${num(s,"wrongRemainder")} = ${original}।`, `ਸਹੀ ਭਾਗ: ${original} = ${num(s,"correctDivisor")} × ${q} + ${r}।`]);
    }
    case "LONG_DIVISION_TRACE": {
      const d=Number(question.canonicalAnswer), remainders=numbers(s,"remainders");
      const digits=String(num(s,"dividend")).split(""); let prefix=0; const checks:string[]=[]; const checksPa:string[]=[];
      digits.forEach((digit,index)=>{ prefix=prefix*10+Number(digit); checks.push(`उपसर्ग ${prefix} को ${d} से भाग देने पर शेषफल ${remainders[index]}।`); checksPa.push(`ਅੰਕ ${prefix} ਤੱਕ ਦੇ ਮੁੱਲ ਨੂੰ ${d} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${remainders[index]}।`); });
      return build("दीर्घ भाग के हर चरण का शेषफल उसी भाजक के लिए बने उपसर्ग का शेषफल होता है।", "ਲੰਮੇ ਭਾਗ ਦੇ ਹਰ ਪੜਾਅ ਦੀ ਬਾਕੀ ਉਸੇ ਭਾਜਕ ਲਈ ਬਣੇ ਅੰਕ-ਉਪਸਰਗ ਦੀ ਬਾਕੀ ਹੁੰਦੀ ਹੈ।",
        "एक ही भाजक को पूरे क्रम पर जाँचें; केवल अंतिम शेषफल पर्याप्त नहीं है।", "ਇੱਕੋ ਭਾਜਕ ਨੂੰ ਪੂਰੇ ਕ੍ਰਮ ਤੇ ਜਾਂਚੋ; ਕੇਵਲ ਅੰਤਿਮ ਬਾਕੀ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।",
        [...checks, `पूरा क्रम केवल भाजक ${d} से मेल खाता है।`], [...checksPa, `ਪੂਰਾ ਕ੍ਰਮ ਕੇਵਲ ਭਾਜਕ ${d} ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।`]);
    }
    case "BOUNDED_NONZERO_REMAINDER_EXTREMUM": {
      const d=num(s,"divisor"), r=num(s,"remainder"), bound=num(s,"bound"), ans=Number(question.canonicalAnswer);
      const adjacent=text(s,"mode")==="LEAST_ABOVE" ? ans-d : ans+d;
      return build("निश्चित शेषफल वाली संख्याएँ d के अंतर से आती हैं; सीमा के ठीक सही ओर वाला सदस्य चुनना है।", "ਨਿਸ਼ਚਿਤ ਬਾਕੀ ਵਾਲੀਆਂ ਸੰਖਿਆਵਾਂ d ਦੇ ਅੰਤਰ ਨਾਲ ਆਉਂਦੀਆਂ ਹਨ; ਹੱਦ ਦੇ ਠੀਕ ਸਹੀ ਪਾਸੇ ਵਾਲਾ ਮੈਂਬਰ ਚੁਣਨਾ ਹੈ।",
        "r mod d वाले सदस्यों में सीमा के सबसे निकट सही सदस्य खोजें।", "r mod d ਵਾਲੇ ਮੈਂਬਰਾਂ ਵਿੱਚ ਹੱਦ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਸਹੀ ਮੈਂਬਰ ਨੂੰ ਲੱਭੋ।",
        [`उत्तर ${ans} को ${d} से भाग देने पर शेषफल ${mod(ans,d)} = ${r} मिलता है।`, `पास का अगला सदस्य ${adjacent} है, जिससे सीमा ${bound} के सापेक्ष ${ans} ही आवश्यक चरम मान रहता है।`],
        [`ਉੱਤਰ ${ans} ਨੂੰ ${d} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${mod(ans,d)} = ${r} ਮਿਲਦੀ ਹੈ।`, `ਨੇੜਲਾ ਅਗਲਾ ਮੈਂਬਰ ${adjacent} ਹੈ, ਇਸ ਕਰਕੇ ਹੱਦ ${bound} ਦੇ ਮੁਕਾਬਲੇ ${ans} ਹੀ ਲੋੜੀਂਦਾ ਚਰਮ ਮੁੱਲ ਰਹਿੰਦਾ ਹੈ।`]);
    }
    default:
      throw new Error(`Unsupported NUM-CP-007 explanation task: ${task}`);
  }
}

export function generateNumCp007LocalizedQuestion(input: NumCp007LocalizedRuntimeInput): NumCp007LocalizedQuestion {
  const english = runNumCp007PermanentPipeline({ questionLanguageId: input.questionLanguageId, seed: input.seed });
  const language = input.locale === "hi-IN" ? "hi" : "pa";
  const options: readonly NumCp007LocalizedOption[] = english.options.map((option) => ({
    ...option,
    value: translateNumCp007OptionValue(option.value, input.locale),
  }));
  const canonicalAnswer = translateNumCp007OptionValue(english.canonicalAnswer, input.locale);
  const verifierAnswer = translateNumCp007OptionValue(english.verifierAnswer, input.locale);

  return {
    ...english,
    locale: input.locale,
    language,
    stem: localizedStem(english, input.locale),
    options,
    canonicalAnswer,
    verifierAnswer,
    explanation: localizedExplanation(english, input.locale),
    traceability: { ...english.traceability, language },
    localization: {
      localizationVersion: "num-cp007-hi-pa-v1",
      canonicalLocale: "en-IN",
      canonicalLanguage: "en",
      canonicalQuestionId: english.questionId,
      canonicalAnswer: english.canonicalAnswer,
      canonicalVerifierAnswer: english.verifierAnswer,
      locale: input.locale,
      language,
      mathematicalStatePreserved: true,
      optionOrderPreserved: true,
      correctIndexPreserved: true,
      misconceptionMappingPreserved: true,
      lifecycleLocked: true,
    },
  };
}
