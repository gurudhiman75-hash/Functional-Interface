import { add, div, mul, pow, rat, sub, type Rational } from "./cp003-exam-model";
import {
  INT_CP005_RUNTIME_VERSION_V16,
  INT_CP005_V16_QL_IDS,
  INT_CP005_V16_SCOPE_DECISION,
  generateIntCp005QuestionV16EditorialFinal,
  type IntCp005QuestionV16,
} from "./cp005-variable-growth-decay-runtime-v16-editorial-final";
import type { IntCp005Locale, IntCp005QlId, IntCp005Option, IntCp005State } from "./cp005-variable-growth-decay-runtime";

export const INT_CP005_V16_LOCALIZED_RUNTIME_VERSION = "INT-CP-005-V16-HI-PA-REVIEW-v1" as const;
export const INT_CP005_V16_LOCALIZED_LOCALES = Object.freeze(["hi-IN", "pa-IN"] as const);
export { INT_CP005_RUNTIME_VERSION_V16, INT_CP005_V16_QL_IDS, INT_CP005_V16_SCOPE_DECISION };
export type IntCp005LocalizedLocale = typeof INT_CP005_V16_LOCALIZED_LOCALES[number];

export type IntCp005QuestionV16Localized = Omit<IntCp005QuestionV16, "locale"> & {
  readonly locale: IntCp005LocalizedLocale;
};

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function growthFactor(rate: Rational): Rational { return add(rat(1n), div(rate, rat(100n))); }
function decayFactor(rate: Rational): Rational { return sub(rat(1n), div(rate, rat(100n))); }
function product(values: readonly Rational[]): Rational { return values.reduce((acc, value) => mul(acc, value), rat(1n)); }
function growthProduct(rates: readonly Rational[]): Rational { return product(rates.map(growthFactor)); }
function decayProduct(rates: readonly Rational[]): Rational { return product(rates.map(decayFactor)); }
function absRat(value: Rational): Rational { return value.numerator < 0n ? rat(-value.numerator, value.denominator) : value; }
function signedFactor(rate: Rational): Rational { return rate.numerator >= 0n ? growthFactor(rate) : decayFactor(absRat(rate)); }
function signedProduct(rates: readonly Rational[]): Rational { return product(rates.map(signedFactor)); }

function integer(value: Rational): bigint {
  if (value.denominator !== 1n) throw new Error(`CP005 V16 localized learner value must be integral: ${value.numerator}/${value.denominator}`);
  return value.numerator;
}
function indian(value: bigint): string {
  const sign = value < 0n ? "-" : "";
  const source = (value < 0n ? -value : value).toString();
  if (source.length <= 3) return sign + source;
  const tail = source.slice(-3);
  let head = source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) { groups.unshift(head.slice(-2)); head = head.slice(0, -2); }
  if (head) groups.unshift(head);
  return `${sign}${groups.join(",")},${tail}`;
}
function money(value: Rational): string { return `₹${indian(integer(value))}`; }
function rateText(value: Rational): string {
  if (value.denominator === 1n) return `${value.numerator}%`;
  return `${Number(value.numerator) / Number(value.denominator)}%`;
}
function mathNumber(value: Rational): string {
  if (value.denominator === 1n) return value.numerator.toString();
  return `\\frac{${value.numerator}}{${value.denominator}}`;
}
function factorMath(rate: Rational, direction: "GROWTH" | "DECAY" = "GROWTH"): string {
  const sign = direction === "GROWTH" ? "+" : "-";
  return `\\left(1${sign}\\frac{${mathNumber(absRat(rate))}}{100}\\right)`;
}
function factorsMath(rates: readonly Rational[], direction: "GROWTH" | "DECAY" = "GROWTH"): string {
  return rates.map((rate) => factorMath(rate, direction)).join("\\times");
}
function signedFactorsMath(rates: readonly Rational[]): string {
  return rates.map((rate) => factorMath(absRat(rate), rate.numerator >= 0n ? "GROWTH" : "DECAY")).join("\\times");
}

const HI_ORDINAL = Object.freeze(["पहले", "दूसरे", "तीसरे", "चौथे"] as const);
const PA_ORDINAL = Object.freeze(["ਪਹਿਲੇ", "ਦੂਜੇ", "ਤੀਜੇ", "ਚੌਥੇ"] as const);
function joinNatural(items: readonly string[], locale: IntCp005LocalizedLocale): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return locale === "hi-IN" ? `${items[0]} और ${items[1]}` : `${items[0]} ਅਤੇ ${items[1]}`;
  const conjunction = locale === "hi-IN" ? "और" : "ਅਤੇ";
  return `${items.slice(0, -1).join(", ")} ${conjunction} ${items[items.length - 1]}`;
}
function annualRateSequence(rates: readonly Rational[], locale: IntCp005LocalizedLocale, missingIndex?: number): string {
  return joinNatural(rates.map((rate, index) => {
    const ordinal = locale === "hi-IN" ? HI_ORDINAL[index] ?? `${index + 1}वें` : PA_ORDINAL[index] ?? `${index + 1}ਵੇਂ`;
    const value = index === missingIndex ? "?" : rateText(rate);
    return locale === "hi-IN" ? `${ordinal} वर्ष ${value}` : `${ordinal} ਸਾਲ ${value}`;
  }), locale);
}
function signedSequence(rates: readonly Rational[], locale: IntCp005LocalizedLocale): string {
  return joinNatural(rates.map((rate, index) => {
    const ordinal = locale === "hi-IN" ? HI_ORDINAL[index] ?? `${index + 1}वें` : PA_ORDINAL[index] ?? `${index + 1}ਵੇਂ`;
    const direction = rate.numerator >= 0n
      ? (locale === "hi-IN" ? "बढ़ता है" : "ਵਧਦਾ ਹੈ")
      : (locale === "hi-IN" ? "घटता है" : "ਘਟਦਾ ਹੈ");
    return locale === "hi-IN"
      ? `${ordinal} वर्ष ${rateText(absRat(rate))} ${direction}`
      : `${ordinal} ਸਾਲ ${rateText(absRat(rate))} ${direction}`;
  }), locale);
}

function tableMarkdown(headers: readonly string[], rows: readonly (readonly string[])[]): string {
  return [`| ${headers.join(" | ")} |`, `| ${headers.map(() => "---").join(" | ")} |`, ...rows.map((row) => `| ${row.join(" | ")} |`)].join("\n");
}

function presentationFor(state: IntCp005State, locale: IntCp005LocalizedLocale): IntCp005QuestionV16["presentation"] {
  switch (state.qlId) {
    case "INT-QL-086": {
      const sequence = annualRateSequence(state.rates, locale);
      const prompt = locale === "hi-IN"
        ? `${money(state.initial)} का निवेश ${sequence} वार्षिक चक्रवृद्धि दर से किया जाता है। अवधि के अंत में राशि कितनी होगी?`
        : `${money(state.initial)} ਦਾ ਨਿਵੇਸ਼ ${sequence} ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦਰ 'ਤੇ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਮਿਆਦ ਦੇ ਅੰਤ ਵਿੱਚ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ?`;
      return deepFreeze({ prompt, markdown: prompt });
    }
    case "INT-QL-087": {
      const sequence = annualRateSequence(state.rates, locale);
      const prompt = locale === "hi-IN"
        ? `${money(state.initial)} का निवेश ${sequence} वार्षिक चक्रवृद्धि दर से किया जाता है। पूरी अवधि का चक्रवृद्धि ब्याज कितना होगा?`
        : `${money(state.initial)} ਦਾ ਨਿਵੇਸ਼ ${sequence} ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦਰ 'ਤੇ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਪੂਰੀ ਮਿਆਦ ਦਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਕਿੰਨਾ ਹੋਵੇਗਾ?`;
      return deepFreeze({ prompt, markdown: prompt });
    }
    case "INT-QL-088": {
      const sequence = annualRateSequence(state.rates, locale);
      const prompt = locale === "hi-IN"
        ? `किसी निवेश की राशि ${sequence} वार्षिक चक्रवृद्धि दर से बढ़कर ${money(state.finalValue)} हो जाती है। प्रारंभिक मूलधन कितना था?`
        : `ਕਿਸੇ ਨਿਵੇਸ਼ ਦੀ ਰਕਮ ${sequence} ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦਰ ਨਾਲ ਵੱਧ ਕੇ ${money(state.finalValue)} ਹੋ ਜਾਂਦੀ ਹੈ। ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ਕਿੰਨਾ ਸੀ?`;
      return deepFreeze({ prompt, markdown: prompt });
    }
    case "INT-QL-089": {
      const sequence = annualRateSequence(state.rates, locale, state.missingIndex);
      const years = state.rates.length;
      const prompt = locale === "hi-IN"
        ? `${money(state.initial)} का निवेश ${years} वर्षों में बढ़कर ${money(state.finalValue)} हो जाता है। वार्षिक चक्रवृद्धि दरें क्रमशः ${sequence} हैं। अज्ञात दर कितनी है?`
        : `${money(state.initial)} ਦਾ ਨਿਵੇਸ਼ ${years} ਸਾਲਾਂ ਵਿੱਚ ਵੱਧ ਕੇ ${money(state.finalValue)} ਹੋ ਜਾਂਦਾ ਹੈ। ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦਰਾਂ ਕ੍ਰਮਵਾਰ ${sequence} ਹਨ। ਅਣਜਾਣ ਦਰ ਕਿੰਨੀ ਹੈ?`;
      return deepFreeze({ prompt, markdown: prompt });
    }
    case "INT-QL-090": {
      const subjectHi = state.context === "VEHICLE" ? "एक वाहन" : "एक मशीन";
      const subjectPa = state.context === "VEHICLE" ? "ਇੱਕ ਵਾਹਨ" : "ਇੱਕ ਮਸ਼ੀਨ";
      const sequence = annualRateSequence(state.decayRates, locale);
      const prompt = locale === "hi-IN"
        ? `${subjectHi} का वर्तमान मूल्य ${money(state.initial)} है। उसके मूल्य में ${sequence} क्रमशः वार्षिक मूल्यह्रास होता है। अवधि के अंत में उसका मूल्य कितना होगा?`
        : `${subjectPa} ਦਾ ਮੌਜੂਦਾ ਮੁੱਲ ${money(state.initial)} ਹੈ। ਇਸ ਦੇ ਮੁੱਲ ਵਿੱਚ ${sequence} ਕ੍ਰਮਵਾਰ ਸਾਲਾਨਾ ਘਟਾਓ ਹੁੰਦਾ ਹੈ। ਮਿਆਦ ਦੇ ਅੰਤ ਵਿੱਚ ਇਸ ਦਾ ਮੁੱਲ ਕਿੰਨਾ ਹੋਵੇਗਾ?`;
      return deepFreeze({ prompt, markdown: prompt });
    }
    case "INT-QL-091": {
      const subjectHi = state.context === "VEHICLE" ? "एक वाहन" : "एक मशीन";
      const subjectPa = state.context === "VEHICLE" ? "ਇੱਕ ਵਾਹਨ" : "ਇੱਕ ਮਸ਼ੀਨ";
      const sequence = annualRateSequence(state.decayRates, locale);
      const prompt = locale === "hi-IN"
        ? `${subjectHi} के मूल्य में ${sequence} क्रमशः वार्षिक मूल्यह्रास होने के बाद उसका मूल्य ${money(state.finalValue)} है। उसका प्रारंभिक मूल्य कितना था?`
        : `${subjectPa} ਦੇ ਮੁੱਲ ਵਿੱਚ ${sequence} ਕ੍ਰਮਵਾਰ ਸਾਲਾਨਾ ਘਟਾਓ ਹੋਣ ਤੋਂ ਬਾਅਦ ਇਸ ਦਾ ਮੁੱਲ ${money(state.finalValue)} ਹੈ। ਇਸ ਦਾ ਸ਼ੁਰੂਆਤੀ ਮੁੱਲ ਕਿੰਨਾ ਸੀ?`;
      return deepFreeze({ prompt, markdown: prompt });
    }
    case "INT-QL-092": {
      const sequence = signedSequence(state.signedRates, locale);
      const prompt = locale === "hi-IN"
        ? `एक संपत्ति का प्रारंभिक मूल्य ${money(state.initial)} है। उसका मूल्य ${sequence}। अवधि के अंत में संपत्ति का मूल्य कितना होगा?`
        : `ਇੱਕ ਸੰਪਤੀ ਦਾ ਸ਼ੁਰੂਆਤੀ ਮੁੱਲ ${money(state.initial)} ਹੈ। ਇਸ ਦਾ ਮੁੱਲ ${sequence}। ਮਿਆਦ ਦੇ ਅੰਤ ਵਿੱਚ ਸੰਪਤੀ ਦਾ ਮੁੱਲ ਕਿੰਨਾ ਹੋਵੇਗਾ?`;
      return deepFreeze({ prompt, markdown: prompt });
    }
    case "INT-QL-093": {
      const r = rateText(state.rate);
      if (state.direction === "GROWTH") {
        const prompt = locale === "hi-IN"
          ? `एक नगर की जनसंख्या ${indian(integer(state.initial))} है और हर वर्ष ${r} बढ़ती है। कितने पूरे वर्षों बाद जनसंख्या पहली बार कम-से-कम ${indian(integer(state.threshold))} होगी?`
          : `ਇੱਕ ਸ਼ਹਿਰ ਦੀ ਆਬਾਦੀ ${indian(integer(state.initial))} ਹੈ ਅਤੇ ਹਰ ਸਾਲ ${r} ਵਧਦੀ ਹੈ। ਕਿੰਨੇ ਪੂਰੇ ਸਾਲਾਂ ਬਾਅਦ ਆਬਾਦੀ ਪਹਿਲੀ ਵਾਰ ਘੱਟੋ-ਘੱਟ ${indian(integer(state.threshold))} ਹੋਵੇਗੀ?`;
        return deepFreeze({ prompt, markdown: prompt });
      }
      const prompt = locale === "hi-IN"
        ? `एक संपत्ति का मूल्य ${money(state.initial)} है और हर वर्ष ${r} घटता है। कितने पूरे वर्षों बाद उसका मूल्य पहली बार ${money(state.threshold)} या उससे कम होगा?`
        : `ਇੱਕ ਸੰਪਤੀ ਦਾ ਮੁੱਲ ${money(state.initial)} ਹੈ ਅਤੇ ਹਰ ਸਾਲ ${r} ਘਟਦਾ ਹੈ। ਕਿੰਨੇ ਪੂਰੇ ਸਾਲਾਂ ਬਾਅਦ ਇਸ ਦਾ ਮੁੱਲ ਪਹਿਲੀ ਵਾਰ ${money(state.threshold)} ਜਾਂ ਇਸ ਤੋਂ ਘੱਟ ਹੋਵੇਗਾ?`;
      return deepFreeze({ prompt, markdown: prompt });
    }
    case "INT-QL-095": {
      const headers = locale === "hi-IN" ? ["वर्ष", "योजना A", "योजना B"] : ["ਸਾਲ", "ਯੋਜਨਾ A", "ਯੋਜਨਾ B"];
      const rows = state.planARates.map((rate, index) => Object.freeze([String(index + 1), rateText(rate), rateText(state.planBRates[index]!) ]));
      const lead = locale === "hi-IN"
        ? `समान राशि ${money(state.initial)} को नीचे दी गई दो योजनाओं में निवेश किया जाता है।`
        : `ਇੱਕੋ ਰਕਮ ${money(state.initial)} ਨੂੰ ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਦੋ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਨਿਵੇਸ਼ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।`;
      const prompt = locale === "hi-IN" ? "दोनों योजनाओं की अंतिम राशियों में कितना अंतर होगा?" : "ਦੋਵੇਂ ਯੋਜਨਾਵਾਂ ਦੀਆਂ ਅੰਤਿਮ ਰਕਮਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੋਵੇਗਾ?";
      const table = deepFreeze({ headers: Object.freeze(headers), rows: Object.freeze(rows) });
      return deepFreeze({ prompt, markdown: `${lead}\n\n${tableMarkdown(headers, rows)}\n\n${prompt}`, table });
    }
    case "INT-QL-094": throw new Error("INT-QL-094 is outside CP005 V16 localized learner scope");
  }
}

function answerText(state: IntCp005State, value: Rational, locale: IntCp005LocalizedLocale): string {
  if (state.qlId === "INT-QL-089") return rateText(value);
  if (state.qlId === "INT-QL-093") return locale === "hi-IN" ? `${integer(value)} वर्ष` : `${integer(value)} ਸਾਲ`;
  return money(value);
}

function feedbackText(id: string, locale: IntCp005LocalizedLocale): string {
  const hi = (text: string) => locale === "hi-IN" ? text : "";
  const pa = (text: string) => locale === "pa-IN" ? text : "";
  if (id === "CORRECT") return hi("सही गणना।") || pa("ਸਹੀ ਗਣਨਾ।");
  if (id === "ADD_RATES" || id === "ADD_DECAY_RATES" || id === "ADD_SIGNED_RATES" || id === "ADD_PLAN_RATES") return hi("क्रमिक प्रतिशतों को सीधे जोड़ना सही नहीं है; हर दर अद्यतन राशि पर लगती है।") || pa("ਲਗਾਤਾਰ ਪ੍ਰਤੀਸ਼ਤਾਂ ਨੂੰ ਸਿੱਧਾ ਜੋੜਨਾ ਠੀਕ ਨਹੀਂ; ਹਰ ਦਰ ਅੱਪਡੇਟ ਰਕਮ ਉੱਤੇ ਲੱਗਦੀ ਹੈ।");
  if (id.startsWith("OMIT_YEAR_") || id.includes("OMIT_LAST")) return hi("एक वर्ष का गुणक छोड़ दिया गया है।") || pa("ਇੱਕ ਸਾਲ ਦਾ ਗੁਣਕ ਛੱਡ ਦਿੱਤਾ ਗਿਆ ਹੈ।");
  if (id.startsWith("ONLY_YEAR_")) return hi("केवल एक वर्ष की दर लगाई गई है; बाकी वर्षों की दरें भी लगानी होंगी।") || pa("ਸਿਰਫ਼ ਇੱਕ ਸਾਲ ਦੀ ਦਰ ਲਗਾਈ ਗਈ ਹੈ; ਬਾਕੀ ਸਾਲਾਂ ਦੀਆਂ ਦਰਾਂ ਵੀ ਲੱਗਣਗੀਆਂ।");
  if (id === "FINAL_AMOUNT_NOT_CI") return hi("अंतिम राशि को चक्रवृद्धि ब्याज मान लिया गया है; ब्याज के लिए मूलधन घटाना होता है।") || pa("ਅੰਤਿਮ ਰਕਮ ਨੂੰ ਮਿਸ਼ਰਤ ਵਿਆਜ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ; ਵਿਆਜ ਲਈ ਮੂਲਧਨ ਘਟਾਉਣਾ ਹੁੰਦਾ ਹੈ।");
  if (id === "NO_REVERSE") return hi("अंतिम मूल्य को ही प्रारंभिक मूल्य मान लिया गया है; सभी गुणकों को उलटना होगा।") || pa("ਅੰਤਿਮ ਮੁੱਲ ਨੂੰ ਹੀ ਸ਼ੁਰੂਆਤੀ ਮੁੱਲ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ; ਸਾਰੇ ਗੁਣਕ ਉਲਟਣੇ ਪੈਣਗੇ।");
  if (id.startsWith("REVERSE_ONLY_YEAR_")) return hi("केवल एक वर्ष का गुणक उलटा गया है।") || pa("ਸਿਰਫ਼ ਇੱਕ ਸਾਲ ਦਾ ਗੁਣਕ ਉਲਟਿਆ ਗਿਆ ਹੈ।");
  if (id.startsWith("RATE_PLUS_") || id.startsWith("RATE_MINUS_")) return hi("अज्ञात दर को समीकरण से निकालना चाहिए; पास की दर चुनना पर्याप्त नहीं है।") || pa("ਅਣਜਾਣ ਦਰ ਸਮੀਕਰਨ ਤੋਂ ਕੱਢਣੀ ਚਾਹੀਦੀ ਹੈ; ਨੇੜਲੀ ਦਰ ਚੁਣਨਾ ਕਾਫ਼ੀ ਨਹੀਂ।");
  if (id === "TREAT_DECAY_AS_GROWTH" || id === "ALL_INCREASE") return hi("कमी को वृद्धि मान लिया गया है।") || pa("ਘਟਾਓ ਨੂੰ ਵਾਧਾ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।");
  if (id === "DECREASE_ON_ORIGINAL") return hi("कमी अद्यतन मूल्य पर लगती है, प्रारंभिक मूल्य पर नहीं।") || pa("ਘਟਾਓ ਅੱਪਡੇਟ ਮੁੱਲ ਉੱਤੇ ਲੱਗਦਾ ਹੈ, ਸ਼ੁਰੂਆਤੀ ਮੁੱਲ ਉੱਤੇ ਨਹੀਂ।");
  if (id === "IGNORE_DECREASE") return hi("मूल्य में हुई कमी को छोड़ दिया गया है।") || pa("ਮੁੱਲ ਵਿੱਚ ਹੋਈ ਘਟਾਓ ਨੂੰ ਛੱਡ ਦਿੱਤਾ ਗਿਆ ਹੈ।");
  if (id === "IGNORE_INCREASE") return hi("मूल्य में हुई वृद्धि को छोड़ दिया गया है।") || pa("ਮੁੱਲ ਵਿੱਚ ਹੋਇਆ ਵਾਧਾ ਛੱਡ ਦਿੱਤਾ ਗਿਆ ਹੈ।");
  if (id.includes("EARLY")) return hi("इस समय सीमा अभी पार नहीं हुई है।") || pa("ਇਸ ਸਮੇਂ ਤੱਕ ਹੱਦ ਅਜੇ ਪਾਰ ਨਹੀਂ ਹੋਈ।");
  if (id.includes("LATE")) return hi("सीमा इससे पहले ही पार हो चुकी है।") || pa("ਹੱਦ ਇਸ ਤੋਂ ਪਹਿਲਾਂ ਹੀ ਪਾਰ ਹੋ ਚੁੱਕੀ ਹੈ।");
  if (id.includes("PLAN_A")) return hi("यह केवल योजना A की अंतिम राशि है, दोनों योजनाओं का अंतर नहीं।") || pa("ਇਹ ਸਿਰਫ਼ ਯੋਜਨਾ A ਦੀ ਅੰਤਿਮ ਰਕਮ ਹੈ, ਦੋਵੇਂ ਯੋਜਨਾਵਾਂ ਦਾ ਅੰਤਰ ਨਹੀਂ।");
  if (id.includes("PLAN_B")) return hi("यह केवल योजना B की अंतिम राशि है, दोनों योजनाओं का अंतर नहीं।") || pa("ਇਹ ਸਿਰਫ਼ ਯੋਜਨਾ B ਦੀ ਅੰਤਿਮ ਰਕਮ ਹੈ, ਦੋਵੇਂ ਯੋਜਨਾਵਾਂ ਦਾ ਅੰਤਰ ਨਹੀਂ।");
  return hi("यह विकल्प पूरी गणना को सही ढंग से लागू नहीं करता।") || pa("ਇਹ ਵਿਕਲਪ ਪੂਰੀ ਗਣਨਾ ਨੂੰ ਠੀਕ ਤਰ੍ਹਾਂ ਲਾਗੂ ਨਹੀਂ ਕਰਦਾ।");
}

function localizedOptions(source: IntCp005QuestionV16, locale: IntCp005LocalizedLocale): readonly IntCp005Option[] {
  return Object.freeze(source.options.map((option) => deepFreeze({
    ...option,
    text: answerText(source.mathematicalState, option.value, locale),
    studentFeedback: feedbackText(option.misconceptionId, locale),
  })));
}

function resultSentence(text: string, locale: IntCp005LocalizedLocale): string {
  return locale === "hi-IN" ? `अतः उत्तर ${text} है।` : `ਇਸ ਲਈ ਉੱਤਰ ${text} ਹੈ।`;
}
function explanationFor(state: IntCp005State, solution: Rational, locale: IntCp005LocalizedLocale): IntCp005QuestionV16["explanation"] {
  const formula = locale === "hi-IN" ? "सूत्र" : "ਸੂਤਰ";
  const substitute = locale === "hi-IN" ? "मान रखने पर" : "ਮੁੱਲ ਰੱਖਣ 'ਤੇ";
  const common = locale === "hi-IN" ? "हर वर्ष की दर उस समय की अद्यतन राशि पर लगती है।" : "ਹਰ ਸਾਲ ਦੀ ਦਰ ਉਸ ਸਮੇਂ ਦੀ ਅੱਪਡੇਟ ਰਕਮ ਉੱਤੇ ਲੱਗਦੀ ਹੈ।";
  const finalAnswer = answerText(state, solution, locale);
  switch (state.qlId) {
    case "INT-QL-086": {
      const amount = mul(state.initial, growthProduct(state.rates));
      return deepFreeze({
        keyIdea: locale === "hi-IN" ? "हर वर्ष का चक्रवृद्धि गुणक क्रम से लगाएँ।" : "ਹਰ ਸਾਲ ਦਾ ਮਿਸ਼ਰਤ ਗੁਣਕ ਕ੍ਰਮ ਨਾਲ ਲਗਾਓ।",
        steps: Object.freeze([
          `${formula}: \\(A=P\\prod(1+r_k/100)\\).`,
          `${substitute}: \\(A=${mathNumber(state.initial)}\\times${factorsMath(state.rates)}=${mathNumber(amount)}\\).`,
          resultSentence(finalAnswer, locale),
        ]), finalAnswer, commonMistake: common,
      });
    }
    case "INT-QL-087": {
      const amount = mul(state.initial, growthProduct(state.rates));
      return deepFreeze({
        keyIdea: locale === "hi-IN" ? "पहले अंतिम राशि निकालें, फिर मूलधन घटाएँ।" : "ਪਹਿਲਾਂ ਅੰਤਿਮ ਰਕਮ ਕੱਢੋ, ਫਿਰ ਮੂਲਧਨ ਘਟਾਓ।",
        steps: Object.freeze([
          `${formula}: \\(A=P\\prod(1+r_k/100),\\quad CI=A-P\\).`,
          `${substitute}: \\(A=${mathNumber(state.initial)}\\times${factorsMath(state.rates)}=${mathNumber(amount)}\\).`,
          `\\(CI=${mathNumber(amount)}-${mathNumber(state.initial)}=${mathNumber(solution)}\\).`,
          resultSentence(finalAnswer, locale),
        ]), finalAnswer, commonMistake: locale === "hi-IN" ? "अंतिम राशि और चक्रवृद्धि ब्याज एक ही चीज़ नहीं हैं।" : "ਅੰਤਿਮ ਰਕਮ ਅਤੇ ਮਿਸ਼ਰਤ ਵਿਆਜ ਇੱਕੋ ਚੀਜ਼ ਨਹੀਂ ਹਨ।",
      });
    }
    case "INT-QL-088": {
      return deepFreeze({
        keyIdea: locale === "hi-IN" ? "अंतिम राशि से सभी वार्षिक गुणकों को उलटकर मूलधन निकालें।" : "ਅੰਤਿਮ ਰਕਮ ਤੋਂ ਸਾਰੇ ਸਾਲਾਨਾ ਗੁਣਕ ਉਲਟ ਕੇ ਮੂਲਧਨ ਕੱਢੋ।",
        steps: Object.freeze([
          `${formula}: \\(P=\\frac{A}{\\prod(1+r_k/100)}\\).`,
          `${substitute}: \\(P=\\frac{${mathNumber(state.finalValue)}}{${factorsMath(state.rates)}}=${mathNumber(solution)}\\).`,
          resultSentence(finalAnswer, locale),
        ]), finalAnswer, commonMistake: locale === "hi-IN" ? "केवल एक वर्ष की दर उलटने से मूलधन नहीं मिलेगा।" : "ਸਿਰਫ਼ ਇੱਕ ਸਾਲ ਦੀ ਦਰ ਉਲਟਣ ਨਾਲ ਮੂਲਧਨ ਨਹੀਂ ਮਿਲੇਗਾ।",
      });
    }
    case "INT-QL-089": {
      const knownRates = state.rates.filter((_rate, index) => index !== state.missingIndex);
      const knownFactors = factorsMath(knownRates);
      return deepFreeze({
        keyIdea: locale === "hi-IN" ? "ज्ञात वर्षों के गुणक अलग करके अज्ञात वार्षिक दर निकालें।" : "ਜਾਣੀਆਂ ਸਾਲਾਨਾ ਦਰਾਂ ਦੇ ਗੁਣਕ ਵੱਖ ਕਰਕੇ ਅਣਜਾਣ ਦਰ ਕੱਢੋ।",
        steps: Object.freeze([
          `${formula}: \\(A=P\\left(\\prod_{k\\ne m}(1+r_k/100)\\right)(1+x/100)\\).`,
          `${substitute}: \\(1+\\frac{x}{100}=\\frac{${mathNumber(state.finalValue)}}{${mathNumber(state.initial)}\\times${knownFactors}}\\).`,
          `\\(x=${mathNumber(solution)}\\%\\).`,
          resultSentence(finalAnswer, locale),
        ]), finalAnswer, commonMistake: locale === "hi-IN" ? "वार्षिक दरों को सीधे जोड़कर अज्ञात दर नहीं निकाली जा सकती।" : "ਸਾਲਾਨਾ ਦਰਾਂ ਨੂੰ ਸਿੱਧਾ ਜੋੜ ਕੇ ਅਣਜਾਣ ਦਰ ਨਹੀਂ ਕੱਢੀ ਜਾ ਸਕਦੀ।",
      });
    }
    case "INT-QL-090": {
      const final = mul(state.initial, decayProduct(state.decayRates));
      return deepFreeze({
        keyIdea: locale === "hi-IN" ? "हर वर्ष मूल्यह्रास का गुणक अद्यतन मूल्य पर लगाएँ।" : "ਹਰ ਸਾਲ ਘਟਾਓ ਦਾ ਗੁਣਕ ਅੱਪਡੇਟ ਮੁੱਲ ਉੱਤੇ ਲਗਾਓ।",
        steps: Object.freeze([
          `${formula}: \\(V=P\\prod(1-d_k/100)\\).`,
          `${substitute}: \\(V=${mathNumber(state.initial)}\\times${factorsMath(state.decayRates, "DECAY")}=${mathNumber(final)}\\).`,
          resultSentence(finalAnswer, locale),
        ]), finalAnswer, commonMistake: locale === "hi-IN" ? "मूल्यह्रास दरों को सीधे जोड़कर मूल मूल्य से घटाना सही नहीं है।" : "ਘਟਾਓ ਦੀਆਂ ਦਰਾਂ ਨੂੰ ਸਿੱਧਾ ਜੋੜ ਕੇ ਮੂਲ ਮੁੱਲ ਤੋਂ ਘਟਾਉਣਾ ਠੀਕ ਨਹੀਂ।",
      });
    }
    case "INT-QL-091": {
      return deepFreeze({
        keyIdea: locale === "hi-IN" ? "अंतिम मूल्य से सभी मूल्यह्रास गुणकों को उलटें।" : "ਅੰਤਿਮ ਮੁੱਲ ਤੋਂ ਸਾਰੇ ਘਟਾਓ ਗੁਣਕ ਉਲਟੋ।",
        steps: Object.freeze([
          `${formula}: \\(P=\\frac{V}{\\prod(1-d_k/100)}\\).`,
          `${substitute}: \\(P=\\frac{${mathNumber(state.finalValue)}}{${factorsMath(state.decayRates, "DECAY")}}=${mathNumber(solution)}\\).`,
          resultSentence(finalAnswer, locale),
        ]), finalAnswer, commonMistake: locale === "hi-IN" ? "केवल एक वर्ष का मूल्यह्रास उलटने से प्रारंभिक मूल्य नहीं मिलेगा।" : "ਸਿਰਫ਼ ਇੱਕ ਸਾਲ ਦਾ ਘਟਾਓ ਉਲਟਣ ਨਾਲ ਸ਼ੁਰੂਆਤੀ ਮੁੱਲ ਨਹੀਂ ਮਿਲੇਗਾ।",
      });
    }
    case "INT-QL-092": {
      const final = mul(state.initial, signedProduct(state.signedRates));
      return deepFreeze({
        keyIdea: locale === "hi-IN" ? "वृद्धि के लिए + और कमी के लिए − वाला गुणक क्रम से लगाएँ।" : "ਵਾਧੇ ਲਈ + ਅਤੇ ਘਟਾਓ ਲਈ − ਵਾਲਾ ਗੁਣਕ ਕ੍ਰਮ ਨਾਲ ਲਗਾਓ।",
        steps: Object.freeze([
          `${formula}: \\(V=P\\prod(1+s_k/100)\\), जहाँ कमी के लिए \\(s_k<0\\).`,
          `${substitute}: \\(V=${mathNumber(state.initial)}\\times${signedFactorsMath(state.signedRates)}=${mathNumber(final)}\\).`,
          resultSentence(finalAnswer, locale),
        ]), finalAnswer, commonMistake: locale === "hi-IN" ? "क्रमिक वृद्धि और कमी को सीधे जोड़ना सही नहीं है।" : "ਲਗਾਤਾਰ ਵਾਧੇ ਅਤੇ ਘਟਾਓ ਨੂੰ ਸਿੱਧਾ ਜੋੜਨਾ ਠੀਕ ਨਹੀਂ।",
      });
    }
    case "INT-QL-093": {
      const factor = state.direction === "GROWTH" ? growthFactor(state.rate) : decayFactor(state.rate);
      const previous = mul(state.initial, pow(factor, state.targetYear - 1));
      const atTarget = mul(state.initial, pow(factor, state.targetYear));
      const sign = state.direction === "GROWTH" ? "+" : "-";
      return deepFreeze({
        keyIdea: locale === "hi-IN" ? "सीमा पहली बार कब पार होती है, इसके लिए ठीक पहले और अगले वर्ष का मूल्य जाँचें।" : "ਹੱਦ ਪਹਿਲੀ ਵਾਰ ਕਦੋਂ ਪਾਰ ਹੁੰਦੀ ਹੈ, ਇਸ ਲਈ ਠੀਕ ਪਹਿਲਾਂ ਅਤੇ ਅਗਲੇ ਸਾਲ ਦਾ ਮੁੱਲ ਜਾਂਚੋ।",
        steps: Object.freeze([
          `${formula}: \\(V_t=V_0\\left(1${sign}\\frac{r}{100}\\right)^t\\).`,
          `${locale === "hi-IN" ? "सीमा जाँच" : "ਹੱਦ ਜਾਂਚ"}: \\(V_{${state.targetYear - 1}}=${mathNumber(previous)},\\quad V_{${state.targetYear}}=${mathNumber(atTarget)}\\).`,
          resultSentence(finalAnswer, locale),
        ]), finalAnswer, commonMistake: locale === "hi-IN" ? "उस वर्ष को चुनें जब सीमा पहली बार पूरी होती है, उसके बाद का वर्ष नहीं।" : "ਉਹੀ ਸਾਲ ਚੁਣੋ ਜਦੋਂ ਹੱਦ ਪਹਿਲੀ ਵਾਰ ਪੂਰੀ ਹੁੰਦੀ ਹੈ, ਉਸ ਤੋਂ ਅਗਲਾ ਸਾਲ ਨਹੀਂ।",
      });
    }
    case "INT-QL-095": {
      const amountA = mul(state.initial, growthProduct(state.planARates));
      const amountB = mul(state.initial, growthProduct(state.planBRates));
      return deepFreeze({
        keyIdea: locale === "hi-IN" ? "दोनों योजनाओं की अंतिम राशि अलग-अलग निकालकर उनका अंतर लें।" : "ਦੋਵੇਂ ਯੋਜਨਾਵਾਂ ਦੀ ਅੰਤਿਮ ਰਕਮ ਵੱਖ-ਵੱਖ ਕੱਢ ਕੇ ਉਨ੍ਹਾਂ ਦਾ ਅੰਤਰ ਲਵੋ।",
        steps: Object.freeze([
          `${formula}: \\(A=P\\prod(1+r_{A,k}/100),\\quad B=P\\prod(1+r_{B,k}/100)\\).`,
          `${locale === "hi-IN" ? "योजना A" : "ਯੋਜਨਾ A"}: \\(A=${mathNumber(state.initial)}\\times${factorsMath(state.planARates)}=${mathNumber(amountA)}\\).`,
          `${locale === "hi-IN" ? "योजना B" : "ਯੋਜਨਾ B"}: \\(B=${mathNumber(state.initial)}\\times${factorsMath(state.planBRates)}=${mathNumber(amountB)}\\).`,
          `\\(|A-B|=${mathNumber(solution)}\\).`,
          resultSentence(finalAnswer, locale),
        ]), finalAnswer, commonMistake: locale === "hi-IN" ? "केवल दरों के योग की तुलना न करें; हर योजना की चक्रवृद्धि राशि निकालें।" : "ਸਿਰਫ਼ ਦਰਾਂ ਦੇ ਜੋੜ ਦੀ ਤੁਲਨਾ ਨਾ ਕਰੋ; ਹਰ ਯੋਜਨਾ ਦੀ ਮਿਸ਼ਰਤ ਰਕਮ ਕੱਢੋ।",
      });
    }
    case "INT-QL-094": throw new Error("INT-QL-094 is outside CP005 V16 localized learner scope");
  }
}

export function generateIntCp005QuestionV16Localized(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005LocalizedLocale,
): IntCp005QuestionV16Localized {
  if (!INT_CP005_V16_LOCALIZED_LOCALES.includes(locale)) throw new Error(`${locale}: unsupported CP005 V16 localized locale`);
  if (qlId === "INT-QL-094") throw new Error("INT-QL-094 is outside CP005 V16 localized learner scope");
  const source = generateIntCp005QuestionV16EditorialFinal(qlId, seed, "en-IN");
  const options = localizedOptions(source, locale);
  const presentation = presentationFor(source.mathematicalState, locale);
  const explanation = explanationFor(source.mathematicalState, source.solution, locale);
  return deepFreeze({
    ...source,
    locale,
    presentation,
    options,
    correctAnswer: options[source.correctIndex]!.text,
    explanation,
    mathematicalFingerprint: `${source.mathematicalFingerprint}|${INT_CP005_V16_LOCALIZED_RUNTIME_VERSION}|${locale}`,
  });
}
