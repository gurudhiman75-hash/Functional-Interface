import { hash, type Rational } from "./cp003-exam-model";
import type { IntCp005Context, IntCp005Option, IntCp005QlId, IntCp005State } from "./cp005-variable-growth-decay-runtime";
import {
  generateIntCp005QuestionV16_1Final,
  type IntCp005QuestionV16_1,
} from "./cp005-variable-growth-decay-runtime-v16-1-final";

export const INT_CP005_V16_1_LOCALIZED_VERSION = "INT-CP-005-V16.1-HI-PA-HARDENING-v1" as const;
export const INT_CP005_V16_1_LOCALES = Object.freeze(["hi-IN", "pa-IN"] as const);
export type IntCp005V16_1Locale = typeof INT_CP005_V16_1_LOCALES[number];
export type IntCp005QuestionV16_1Localized = Omit<IntCp005QuestionV16_1, "locale"> & { readonly locale: IntCp005V16_1Locale };

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}
function integer(value: Rational): bigint {
  if (value.denominator !== 1n) throw new Error(`V16.1 localized value must be integral: ${value.numerator}/${value.denominator}`);
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
function count(value: Rational): string { return indian(integer(value)); }
function percent(value: Rational): string {
  if (value.denominator === 1n) return `${value.numerator}%`;
  const scaled = value.numerator * 100n;
  if (scaled % value.denominator !== 0n) throw new Error("V16.1 localized rate must terminate within two decimals");
  const h = scaled / value.denominator;
  const whole = h / 100n; const frac = h % 100n;
  return frac === 0n ? `${whole}%` : frac % 10n === 0n ? `${whole}.${frac / 10n}%` : `${whole}.${frac.toString().padStart(2, "0")}%`;
}
function years(year: number, locale: IntCp005V16_1Locale): string { return locale === "hi-IN" ? `${year} वर्ष` : `${year} ਸਾਲ`; }
function valueText(value: Rational, context: IntCp005Context): string { return context === "POPULATION" ? count(value) : money(value); }
function subject(context: IntCp005Context, locale: IntCp005V16_1Locale): string {
  if (locale === "hi-IN") return context === "MACHINE" ? "मशीन" : context === "VEHICLE" ? "वाहन" : "संपत्ति";
  return context === "MACHINE" ? "ਮਸ਼ੀਨ" : context === "VEHICLE" ? "ਵਾਹਨ" : "ਸੰਪਤੀ";
}
const HI_ORD = ["पहले", "दूसरे", "तीसरे", "चौथे", "पाँचवें"] as const;
const PA_ORD = ["ਪਹਿਲੇ", "ਦੂਜੇ", "ਤੀਜੇ", "ਚੌਥੇ", "ਪੰਜਵੇਂ"] as const;
function schedule(rates: readonly Rational[], locale: IntCp005V16_1Locale, missingIndex?: number): string {
  const parts = rates.map((rate, index) => {
    const ord = locale === "hi-IN" ? HI_ORD[index]! : PA_ORD[index]!;
    const shown = index === missingIndex ? "?" : percent(rate);
    return locale === "hi-IN" ? `${ord} वर्ष ${shown}` : `${ord} ਸਾਲ ${shown}`;
  });
  if (parts.length === 1) return parts[0]!;
  const and = locale === "hi-IN" ? "और" : "ਅਤੇ";
  return `${parts.slice(0, -1).join(", ")} ${and} ${parts[parts.length - 1]}`;
}
function signedSchedule(rates: readonly Rational[], locale: IntCp005V16_1Locale): string {
  const parts = rates.map((rate, index) => {
    const ord = locale === "hi-IN" ? HI_ORD[index]! : PA_ORD[index]!;
    const absRate: Rational = rate.numerator < 0n ? { numerator: -rate.numerator, denominator: rate.denominator } : rate;
    const direction = rate.numerator >= 0n ? (locale === "hi-IN" ? "वृद्धि" : "ਵਾਧਾ") : (locale === "hi-IN" ? "कमी" : "ਘਟਾਓ");
    return locale === "hi-IN" ? `${ord} वर्ष ${percent(absRate)} ${direction}` : `${ord} ਸਾਲ ${percent(absRate)} ${direction}`;
  });
  const and = locale === "hi-IN" ? "और" : "ਅਤੇ";
  return parts.length === 2 ? `${parts[0]} ${and} ${parts[1]}` : `${parts.slice(0, -1).join(", ")} ${and} ${parts[parts.length - 1]}`;
}
function templateIndex(seed: string): number { return (hash(`${seed}:cp005-v16.1:localized-stem`) >>> 0) % 3; }
function tableMarkdown(headers: readonly string[], rows: readonly (readonly string[])[]): string {
  return [`| ${headers.join(" | ")} |`, `| ${headers.map(() => "---").join(" | ")} |`, ...rows.map((row) => `| ${row.join(" | ")} |`)].join("\n");
}

function presentation(state: IntCp005State, seed: string, locale: IntCp005V16_1Locale): IntCp005QuestionV16_1["presentation"] {
  const t = templateIndex(seed);
  let prompt = "";
  switch (state.qlId) {
    case "INT-QL-086": {
      const s = schedule(state.rates, locale); const opening = valueText(state.initial, state.context);
      if (locale === "hi-IN") {
        const lead = state.context === "POPULATION" ? `एक नगर की जनसंख्या ${opening} है।` : state.context === "ASSET" ? `एक संपत्ति का मूल्य ${opening} है।` : `${opening} का निवेश किया जाता है।`;
        const noun = state.context === "POPULATION" ? "जनसंख्या" : state.context === "ASSET" ? "मूल्य" : "राशि";
        prompt = [
          `${lead} ${s} की वार्षिक दरें क्रमशः लागू होती हैं। ${years(state.rates.length, locale)} बाद ${noun} कितनी होगी?`,
          `${lead} वार्षिक चक्रवृद्धि वृद्धि की दरें ${s} हैं। अवधि के अंत में ${noun} ज्ञात कीजिए।`,
          `${lead} ${s} की दरें एक के बाद एक लागू होती हैं। अंतिम ${noun} कितनी होगी?`,
        ][t]!;
      } else {
        const lead = state.context === "POPULATION" ? `ਇੱਕ ਸ਼ਹਿਰ ਦੀ ਆਬਾਦੀ ${opening} ਹੈ।` : state.context === "ASSET" ? `ਇੱਕ ਸੰਪਤੀ ਦਾ ਮੁੱਲ ${opening} ਹੈ।` : `${opening} ਦਾ ਨਿਵੇਸ਼ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।`;
        const noun = state.context === "POPULATION" ? "ਆਬਾਦੀ" : state.context === "ASSET" ? "ਮੁੱਲ" : "ਰਕਮ";
        prompt = [
          `${lead} ${s} ਦੀਆਂ ਸਾਲਾਨਾ ਦਰਾਂ ਕ੍ਰਮਵਾਰ ਲਾਗੂ ਹੁੰਦੀਆਂ ਹਨ। ${years(state.rates.length, locale)} ਬਾਅਦ ${noun} ਕਿੰਨੀ ਹੋਵੇਗੀ?`,
          `${lead} ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਾਧੇ ਦੀਆਂ ਦਰਾਂ ${s} ਹਨ। ਮਿਆਦ ਦੇ ਅੰਤ ਵਿੱਚ ${noun} ਪਤਾ ਕਰੋ।`,
          `${lead} ${s} ਦੀਆਂ ਦਰਾਂ ਇੱਕ ਤੋਂ ਬਾਅਦ ਇੱਕ ਲਾਗੂ ਹੁੰਦੀਆਂ ਹਨ। ਅੰਤਿਮ ${noun} ਕਿੰਨੀ ਹੋਵੇਗੀ?`,
        ][t]!;
      }
      break;
    }
    case "INT-QL-087": {
      const s = schedule(state.rates, locale);
      prompt = locale === "hi-IN" ? [
        `${money(state.initial)} का निवेश किया जाता है। वार्षिक चक्रवृद्धि ब्याज दरें ${s} हैं। पूरी अवधि का चक्रवृद्धि ब्याज कितना है?`,
        `${money(state.initial)} के निवेश पर ${s} की वार्षिक चक्रवृद्धि दरें लागू होती हैं। कुल अर्जित चक्रवृद्धि ब्याज ज्ञात कीजिए।`,
        `${money(state.initial)} पर ${s} की दर से चक्रवृद्धि ब्याज मिलता है। केवल अर्जित ब्याज ज्ञात कीजिए, अंतिम राशि नहीं।`,
      ][t]! : [
        `${money(state.initial)} ਦਾ ਨਿਵੇਸ਼ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦਰਾਂ ${s} ਹਨ। ਪੂਰੀ ਮਿਆਦ ਦਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਕਿੰਨਾ ਹੈ?`,
        `${money(state.initial)} ਦੇ ਨਿਵੇਸ਼ 'ਤੇ ${s} ਦੀਆਂ ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦਰਾਂ ਲਾਗੂ ਹੁੰਦੀਆਂ ਹਨ। ਕੁੱਲ ਕਮਾਇਆ ਮਿਸ਼ਰਤ ਵਿਆਜ ਪਤਾ ਕਰੋ।`,
        `${money(state.initial)} 'ਤੇ ${s} ਦੀ ਦਰ ਨਾਲ ਮਿਸ਼ਰਤ ਵਿਆਜ ਮਿਲਦਾ ਹੈ। ਕੇਵਲ ਕਮਾਇਆ ਵਿਆਜ ਪਤਾ ਕਰੋ, ਅੰਤਿਮ ਰਕਮ ਨਹੀਂ।`,
      ][t]!;
      break;
    }
    case "INT-QL-088": {
      const s = schedule(state.rates, locale); const final = valueText(state.finalValue, state.context);
      if (locale === "hi-IN") {
        const noun = state.context === "POPULATION" ? "एक नगर की जनसंख्या" : state.context === "ASSET" ? "एक संपत्ति का मूल्य" : "एक निवेश";
        const ask = state.context === "POPULATION" ? "प्रारंभिक जनसंख्या" : state.context === "ASSET" ? "प्रारंभिक मूल्य" : "मूलधन";
        prompt = [
          `${noun} ${s} की वार्षिक दरों के बाद ${final} हो जाती है। ${ask} कितना था?`,
          `${s} की दरें क्रमशः लागू होने पर ${noun} ${final} है। ${ask} ज्ञात कीजिए।`,
          `${noun} पर ${s} की दरें लागू करने के बाद मान ${final} हो जाता है। परिवर्तन से पहले का ${ask} कितना था?`,
        ][t]!;
      } else {
        const noun = state.context === "POPULATION" ? "ਇੱਕ ਸ਼ਹਿਰ ਦੀ ਆਬਾਦੀ" : state.context === "ASSET" ? "ਇੱਕ ਸੰਪਤੀ ਦਾ ਮੁੱਲ" : "ਇੱਕ ਨਿਵੇਸ਼";
        const ask = state.context === "POPULATION" ? "ਸ਼ੁਰੂਆਤੀ ਆਬਾਦੀ" : state.context === "ASSET" ? "ਸ਼ੁਰੂਆਤੀ ਮੁੱਲ" : "ਮੂਲਧਨ";
        prompt = [
          `${noun} ${s} ਦੀਆਂ ਸਾਲਾਨਾ ਦਰਾਂ ਤੋਂ ਬਾਅਦ ${final} ਹੋ ਜਾਂਦੀ ਹੈ। ${ask} ਕਿੰਨਾ ਸੀ?`,
          `${s} ਦੀਆਂ ਦਰਾਂ ਕ੍ਰਮਵਾਰ ਲਾਗੂ ਹੋਣ 'ਤੇ ${noun} ${final} ਹੈ। ${ask} ਪਤਾ ਕਰੋ।`,
          `${noun} 'ਤੇ ${s} ਦੀਆਂ ਦਰਾਂ ਲਾਗੂ ਕਰਨ ਤੋਂ ਬਾਅਦ ਮੁੱਲ ${final} ਹੋ ਜਾਂਦਾ ਹੈ। ਬਦਲਾਅ ਤੋਂ ਪਹਿਲਾਂ ਦਾ ${ask} ਕਿੰਨਾ ਸੀ?`,
        ][t]!;
      }
      break;
    }
    case "INT-QL-089": {
      const s = schedule(state.rates, locale, state.missingIndex);
      prompt = locale === "hi-IN" ? [
        `${money(state.initial)} का निवेश 3 वर्षों में ${money(state.finalValue)} हो जाता है। वार्षिक चक्रवृद्धि दरें ${s} हैं। अज्ञात दर ज्ञात कीजिए।`,
        `एक निवेश ${money(state.initial)} से बढ़कर 3 वर्षों में ${money(state.finalValue)} हो जाता है। दरों का क्रम ${s} है। लुप्त वार्षिक दर कितनी है?`,
        `${money(state.initial)} के 3-वर्षीय निवेश में चक्रवृद्धि दरें ${s} हैं और अंतिम राशि ${money(state.finalValue)} है। अज्ञात दर ज्ञात कीजिए।`,
      ][t]! : [
        `${money(state.initial)} ਦਾ ਨਿਵੇਸ਼ 3 ਸਾਲਾਂ ਵਿੱਚ ${money(state.finalValue)} ਹੋ ਜਾਂਦਾ ਹੈ। ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦਰਾਂ ${s} ਹਨ। ਅਣਜਾਣ ਦਰ ਪਤਾ ਕਰੋ।`,
        `ਇੱਕ ਨਿਵੇਸ਼ ${money(state.initial)} ਤੋਂ ਵੱਧ ਕੇ 3 ਸਾਲਾਂ ਵਿੱਚ ${money(state.finalValue)} ਹੋ ਜਾਂਦਾ ਹੈ। ਦਰਾਂ ਦਾ ਕ੍ਰਮ ${s} ਹੈ। ਗੁੰਮ ਸਾਲਾਨਾ ਦਰ ਕਿੰਨੀ ਹੈ?`,
        `${money(state.initial)} ਦੇ 3-ਸਾਲਾ ਨਿਵੇਸ਼ ਵਿੱਚ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦਰਾਂ ${s} ਹਨ ਅਤੇ ਅੰਤਿਮ ਰਕਮ ${money(state.finalValue)} ਹੈ। ਅਣਜਾਣ ਦਰ ਪਤਾ ਕਰੋ।`,
      ][t]!;
      break;
    }
    case "INT-QL-090": {
      const s = schedule(state.decayRates, locale); const noun = subject(state.context, locale);
      prompt = locale === "hi-IN" ? [
        `एक ${noun} का मूल्य ${money(state.initial)} है। उसमें ${s} की वार्षिक दर से मूल्यह्रास होता है। ${years(state.decayRates.length, locale)} बाद उसका मूल्य कितना होगा?`,
        `एक ${noun} का वर्तमान मूल्य ${money(state.initial)} है और वार्षिक मूल्यह्रास दरें ${s} हैं। अवधि के अंत का मूल्य ज्ञात कीजिए।`,
        `${money(state.initial)} मूल्य की ${noun} में ${s} के अनुसार क्रमिक मूल्यह्रास होता है। अंत में उसका मूल्य कितना रहेगा?`,
      ][t]! : [
        `ਇੱਕ ${noun} ਦਾ ਮੁੱਲ ${money(state.initial)} ਹੈ। ਇਸ ਵਿੱਚ ${s} ਦੀ ਸਾਲਾਨਾ ਦਰ ਨਾਲ ਘਟਾਓ ਹੁੰਦਾ ਹੈ। ${years(state.decayRates.length, locale)} ਬਾਅਦ ਇਸ ਦਾ ਮੁੱਲ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
        `ਇੱਕ ${noun} ਦਾ ਮੌਜੂਦਾ ਮੁੱਲ ${money(state.initial)} ਹੈ ਅਤੇ ਸਾਲਾਨਾ ਘਟਾਓ ਦਰਾਂ ${s} ਹਨ। ਮਿਆਦ ਦੇ ਅੰਤ ਦਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।`,
        `${money(state.initial)} ਮੁੱਲ ਦੀ ${noun} ਵਿੱਚ ${s} ਅਨੁਸਾਰ ਲਗਾਤਾਰ ਘਟਾਓ ਹੁੰਦਾ ਹੈ। ਅੰਤ ਵਿੱਚ ਇਸ ਦਾ ਮੁੱਲ ਕਿੰਨਾ ਰਹੇਗਾ?`,
      ][t]!;
      break;
    }
    case "INT-QL-091": {
      const s = schedule(state.decayRates, locale); const noun = subject(state.context, locale);
      prompt = locale === "hi-IN" ? [
        `${s} की वार्षिक मूल्यह्रास दरों के बाद एक ${noun} का मूल्य ${money(state.finalValue)} रह जाता है। उसका प्रारंभिक मूल्य कितना था?`,
        `एक ${noun} का मूल्य घटकर ${money(state.finalValue)} हो गया। वार्षिक मूल्यह्रास दरें ${s} थीं। मूल्यह्रास से पहले का मूल्य ज्ञात कीजिए।`,
        `एक ${noun} का अंतिम मूल्य ${money(state.finalValue)} है और उस पर ${s} का क्रमिक मूल्यह्रास हुआ। मूल मूल्य कितना था?`,
      ][t]! : [
        `${s} ਦੀਆਂ ਸਾਲਾਨਾ ਘਟਾਓ ਦਰਾਂ ਤੋਂ ਬਾਅਦ ਇੱਕ ${noun} ਦਾ ਮੁੱਲ ${money(state.finalValue)} ਰਹਿ ਜਾਂਦਾ ਹੈ। ਇਸ ਦਾ ਸ਼ੁਰੂਆਤੀ ਮੁੱਲ ਕਿੰਨਾ ਸੀ?`,
        `ਇੱਕ ${noun} ਦਾ ਮੁੱਲ ਘਟ ਕੇ ${money(state.finalValue)} ਹੋ ਗਿਆ। ਸਾਲਾਨਾ ਘਟਾਓ ਦਰਾਂ ${s} ਸਨ। ਘਟਾਓ ਤੋਂ ਪਹਿਲਾਂ ਦਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।`,
        `ਇੱਕ ${noun} ਦਾ ਅੰਤਿਮ ਮੁੱਲ ${money(state.finalValue)} ਹੈ ਅਤੇ ਇਸ 'ਤੇ ${s} ਦਾ ਲਗਾਤਾਰ ਘਟਾਓ ਹੋਇਆ। ਮੂਲ ਮੁੱਲ ਕਿੰਨਾ ਸੀ?`,
      ][t]!;
      break;
    }
    case "INT-QL-092": {
      const s = signedSchedule(state.signedRates, locale);
      prompt = locale === "hi-IN" ? [
        `एक संपत्ति का मूल्य ${money(state.initial)} है। उसमें ${s} होता है। अवधि के अंत में उसका मूल्य कितना होगा?`,
        `${money(state.initial)} मूल्य की संपत्ति में क्रमशः ${s} होता है। अंतिम मूल्य ज्ञात कीजिए।`,
        `एक संपत्ति का प्रारंभिक मूल्य ${money(state.initial)} है और वार्षिक परिवर्तन ${s} हैं। अंत में उसका मूल्य कितना होगा?`,
      ][t]! : [
        `ਇੱਕ ਸੰਪਤੀ ਦਾ ਮੁੱਲ ${money(state.initial)} ਹੈ। ਇਸ ਵਿੱਚ ${s} ਹੁੰਦਾ ਹੈ। ਮਿਆਦ ਦੇ ਅੰਤ ਵਿੱਚ ਇਸ ਦਾ ਮੁੱਲ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
        `${money(state.initial)} ਮੁੱਲ ਦੀ ਸੰਪਤੀ ਵਿੱਚ ਕ੍ਰਮਵਾਰ ${s} ਹੁੰਦਾ ਹੈ। ਅੰਤਿਮ ਮੁੱਲ ਪਤਾ ਕਰੋ।`,
        `ਇੱਕ ਸੰਪਤੀ ਦਾ ਸ਼ੁਰੂਆਤੀ ਮੁੱਲ ${money(state.initial)} ਹੈ ਅਤੇ ਸਾਲਾਨਾ ਬਦਲਾਅ ${s} ਹਨ। ਅੰਤ ਵਿੱਚ ਇਸ ਦਾ ਮੁੱਲ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
      ][t]!;
      break;
    }
    case "INT-QL-093": {
      if (state.direction === "GROWTH") {
        prompt = locale === "hi-IN" ? [
          `एक नगर की जनसंख्या ${count(state.initial)} है और हर वर्ष ${percent(state.rate)} बढ़ती है। कितने पूरे वर्षों बाद यह पहली बार कम-से-कम ${count(state.threshold)} होगी?`,
          `एक नगर की जनसंख्या ${count(state.initial)} है और वार्षिक वृद्धि ${percent(state.rate)} है। पहली बार किस पूरे वर्ष में जनसंख्या ${count(state.threshold)} या उससे अधिक होगी?`,
          `${count(state.initial)} की जनसंख्या हर वर्ष ${percent(state.rate)} बढ़ती है। इसे पहली बार कम-से-कम ${count(state.threshold)} होने में कितने पूरे वर्ष लगेंगे?`,
        ][t]! : [
          `ਇੱਕ ਸ਼ਹਿਰ ਦੀ ਆਬਾਦੀ ${count(state.initial)} ਹੈ ਅਤੇ ਹਰ ਸਾਲ ${percent(state.rate)} ਵਧਦੀ ਹੈ। ਕਿੰਨੇ ਪੂਰੇ ਸਾਲਾਂ ਬਾਅਦ ਇਹ ਪਹਿਲੀ ਵਾਰ ਘੱਟੋ-ਘੱਟ ${count(state.threshold)} ਹੋਵੇਗੀ?`,
          `ਇੱਕ ਸ਼ਹਿਰ ਦੀ ਆਬਾਦੀ ${count(state.initial)} ਹੈ ਅਤੇ ਸਾਲਾਨਾ ਵਾਧਾ ${percent(state.rate)} ਹੈ। ਪਹਿਲੀ ਵਾਰ ਕਿਹੜੇ ਪੂਰੇ ਸਾਲ ਵਿੱਚ ਆਬਾਦੀ ${count(state.threshold)} ਜਾਂ ਇਸ ਤੋਂ ਵੱਧ ਹੋਵੇਗੀ?`,
          `${count(state.initial)} ਦੀ ਆਬਾਦੀ ਹਰ ਸਾਲ ${percent(state.rate)} ਵਧਦੀ ਹੈ। ਇਸ ਨੂੰ ਪਹਿਲੀ ਵਾਰ ਘੱਟੋ-ਘੱਟ ${count(state.threshold)} ਹੋਣ ਵਿੱਚ ਕਿੰਨੇ ਪੂਰੇ ਸਾਲ ਲੱਗਣਗੇ?`,
        ][t]!;
      } else {
        prompt = locale === "hi-IN" ? [
          `${money(state.initial)} मूल्य की संपत्ति हर वर्ष ${percent(state.rate)} घटती है। कितने पूरे वर्षों बाद उसका मूल्य पहली बार ${money(state.threshold)} या उससे कम होगा?`,
          `एक संपत्ति का मूल्य ${money(state.initial)} है और वार्षिक मूल्यह्रास ${percent(state.rate)} है। पहली बार किस पूरे वर्ष में मूल्य ${money(state.threshold)} या उससे कम होगा?`,
          `${money(state.initial)} से शुरू होने वाली संपत्ति हर वर्ष ${percent(state.rate)} घटती है। उसका मूल्य पहली बार ${money(state.threshold)} या कम होने में कितने पूरे वर्ष लगेंगे?`,
        ][t]! : [
          `${money(state.initial)} ਮੁੱਲ ਦੀ ਸੰਪਤੀ ਹਰ ਸਾਲ ${percent(state.rate)} ਘਟਦੀ ਹੈ। ਕਿੰਨੇ ਪੂਰੇ ਸਾਲਾਂ ਬਾਅਦ ਇਸ ਦਾ ਮੁੱਲ ਪਹਿਲੀ ਵਾਰ ${money(state.threshold)} ਜਾਂ ਇਸ ਤੋਂ ਘੱਟ ਹੋਵੇਗਾ?`,
          `ਇੱਕ ਸੰਪਤੀ ਦਾ ਮੁੱਲ ${money(state.initial)} ਹੈ ਅਤੇ ਸਾਲਾਨਾ ਘਟਾਓ ${percent(state.rate)} ਹੈ। ਪਹਿਲੀ ਵਾਰ ਕਿਹੜੇ ਪੂਰੇ ਸਾਲ ਵਿੱਚ ਮੁੱਲ ${money(state.threshold)} ਜਾਂ ਇਸ ਤੋਂ ਘੱਟ ਹੋਵੇਗਾ?`,
          `${money(state.initial)} ਤੋਂ ਸ਼ੁਰੂ ਹੋਣ ਵਾਲੀ ਸੰਪਤੀ ਹਰ ਸਾਲ ${percent(state.rate)} ਘਟਦੀ ਹੈ। ਇਸ ਦਾ ਮੁੱਲ ਪਹਿਲੀ ਵਾਰ ${money(state.threshold)} ਜਾਂ ਘੱਟ ਹੋਣ ਵਿੱਚ ਕਿੰਨੇ ਪੂਰੇ ਸਾਲ ਲੱਗਣਗੇ?`,
        ][t]!;
      }
      break;
    }
    case "INT-QL-095": {
      const headers = locale === "hi-IN" ? ["वर्ष", "योजना A", "योजना B"] : ["ਸਾਲ", "ਯੋਜਨਾ A", "ਯੋਜਨਾ B"];
      const rows = state.planARates.map((rate, index) => Object.freeze([String(index + 1), percent(rate), percent(state.planBRates[index]!) ]));
      const leads = locale === "hi-IN" ? [
        `${money(state.initial)} की राशि दोनों चक्रवृद्धि ब्याज योजनाओं में अलग-अलग निवेश की जाती है।`,
        `${money(state.initial)} के दो समान निवेश नीचे दी गई वार्षिक चक्रवृद्धि दरों का पालन करते हैं।`,
        `समान मूलधन ${money(state.initial)} को योजना A और योजना B में 3 वर्षों के लिए अलग-अलग निवेश किया जाता है।`,
      ] : [
        `${money(state.initial)} ਦੀ ਰਕਮ ਦੋਵੇਂ ਮਿਸ਼ਰਤ ਵਿਆਜ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਵੱਖ-ਵੱਖ ਨਿਵੇਸ਼ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।`,
        `${money(state.initial)} ਦੇ ਦੋ ਬਰਾਬਰ ਨਿਵੇਸ਼ ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦਰਾਂ ਅਨੁਸਾਰ ਵਧਦੇ ਹਨ।`,
        `ਇੱਕੋ ਮੂਲਧਨ ${money(state.initial)} ਨੂੰ ਯੋਜਨਾ A ਅਤੇ ਯੋਜਨਾ B ਵਿੱਚ 3 ਸਾਲਾਂ ਲਈ ਵੱਖ-ਵੱਖ ਨਿਵੇਸ਼ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।`,
      ];
      const asks = locale === "hi-IN" ? ["दोनों अंतिम राशियों में कितना अंतर होगा?", "दोनों योजनाओं की अंतिम राशियों का अंतर ज्ञात कीजिए।", "3 वर्षों बाद दोनों राशियों के बीच निरपेक्ष अंतर कितना होगा?"] : ["ਦੋਵੇਂ ਅੰਤਿਮ ਰਕਮਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੋਵੇਗਾ?", "ਦੋਵੇਂ ਯੋਜਨਾਵਾਂ ਦੀਆਂ ਅੰਤਿਮ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਪਤਾ ਕਰੋ।", "3 ਸਾਲਾਂ ਬਾਅਦ ਦੋਵੇਂ ਰਕਮਾਂ ਵਿਚਕਾਰ ਨਿਰਪੇਖ ਅੰਤਰ ਕਿੰਨਾ ਹੋਵੇਗਾ?"];
      const table = deepFreeze({ headers: Object.freeze(headers), rows: Object.freeze(rows) });
      prompt = asks[t]!;
      return deepFreeze({ prompt, markdown: `${leads[t]}\n\n${tableMarkdown(headers, rows)}\n\n${asks[t]}`, table });
    }
    case "INT-QL-094": throw new Error("INT-QL-094 remains excluded");
  }
  return deepFreeze({ prompt, markdown: prompt });
}

function optionText(value: Rational, state: IntCp005State, locale: IntCp005V16_1Locale): string {
  if (state.qlId === "INT-QL-089") return percent(value);
  if (state.qlId === "INT-QL-093") return years(Number(integer(value)), locale);
  if ((state.qlId === "INT-QL-086" || state.qlId === "INT-QL-088") && state.context === "POPULATION") return count(value);
  return money(value);
}
function feedback(id: string, locale: IntCp005V16_1Locale, correct: boolean): string {
  if (correct) return locale === "hi-IN" ? "सही उत्तर।" : "ਸਹੀ ਉੱਤਰ।";
  const hi = (text: string) => locale === "hi-IN" ? text : "";
  if (/ADD_PLAN_RATES/u.test(id)) return locale === "hi-IN" ? "दोनों योजनाओं की वार्षिक दरें जोड़कर तुलना करना चक्रवृद्धि परिणाम नहीं देता।" : "ਦੋਵੇਂ ਯੋਜਨਾਵਾਂ ਦੀਆਂ ਸਾਲਾਨਾ ਦਰਾਂ ਜੋੜ ਕੇ ਤੁਲਨਾ ਕਰਨ ਨਾਲ ਮਿਸ਼ਰਤ ਨਤੀਜਾ ਨਹੀਂ ਮਿਲਦਾ।";
  if (/OMIT_FINAL_YEAR_COMPARISON/u.test(id)) return locale === "hi-IN" ? "दोनों योजनाओं में अंतिम वर्ष छोड़ दिया गया है।" : "ਦੋਵੇਂ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਅੰਤਿਮ ਸਾਲ ਛੱਡ ਦਿੱਤਾ ਗਿਆ ਹੈ।";
  if (/OMIT_FIRST_YEAR_COMPARISON/u.test(id)) return locale === "hi-IN" ? "दोनों योजनाओं में पहला वर्ष छोड़ दिया गया है।" : "ਦੋਵੇਂ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਪਹਿਲਾ ਸਾਲ ਛੱਡ ਦਿੱਤਾ ਗਿਆ ਹੈ।";
  if (/COMPARE_FIRST_YEAR_ONLY/u.test(id)) return locale === "hi-IN" ? "केवल पहले वर्ष के अंतर की तुलना की गई है।" : "ਕੇਵਲ ਪਹਿਲੇ ਸਾਲ ਦੇ ਅੰਤਰ ਦੀ ਤੁਲਨਾ ਕੀਤੀ ਗਈ ਹੈ।";
  if (/COMPARE_LAST_YEAR_ONLY/u.test(id)) return locale === "hi-IN" ? "केवल अंतिम वर्ष के अंतर की तुलना की गई है।" : "ਕੇਵਲ ਅੰਤਿਮ ਸਾਲ ਦੇ ਅੰਤਰ ਦੀ ਤੁਲਨਾ ਕੀਤੀ ਗਈ ਹੈ।";
  if (/REPEAT_KNOWN_RATE/u.test(id)) return locale === "hi-IN" ? "अज्ञात दर निकालने के बजाय ज्ञात वर्ष की दर दोहरा दी गई है।" : "ਅਣਜਾਣ ਦਰ ਕੱਢਣ ਦੀ ਥਾਂ ਜਾਣੀ ਹੋਈ ਸਾਲਾਨਾ ਦਰ ਦੁਹਰਾ ਦਿੱਤੀ ਗਈ ਹੈ।";
  if (/ADD_KNOWN_RATES/u.test(id)) return locale === "hi-IN" ? "दो ज्ञात दरों को जोड़कर अज्ञात दर मान लिया गया है।" : "ਦੋ ਜਾਣੀਆਂ ਦਰਾਂ ਨੂੰ ਜੋੜ ਕੇ ਅਣਜਾਣ ਦਰ ਮੰਨ ਲਈ ਗਈ ਹੈ।";
  if (/ADD_DECAY_RATES/u.test(id)) return locale === "hi-IN" ? "सभी मूल्यह्रास दरें मूल मूल्य पर एक साथ घटा दी गई हैं।" : "ਸਾਰੀਆਂ ਘਟਾਓ ਦਰਾਂ ਮੂਲ ਮੁੱਲ ਤੋਂ ਇੱਕੋ ਵਾਰ ਘਟਾ ਦਿੱਤੀਆਂ ਗਈਆਂ ਹਨ।";
  if (/REPEAT_FIRST_RATE/u.test(id)) return locale === "hi-IN" ? "पहले वर्ष की दर हर वर्ष के लिए दोहरा दी गई है।" : "ਪਹਿਲੇ ਸਾਲ ਦੀ ਦਰ ਹਰ ਸਾਲ ਲਈ ਦੁਹਰਾ ਦਿੱਤੀ ਗਈ ਹੈ।";
  if (/REPEAT_LAST_RATE/u.test(id)) return locale === "hi-IN" ? "अंतिम वर्ष की दर हर वर्ष के लिए दोहरा दी गई है।" : "ਅੰਤਿਮ ਸਾਲ ਦੀ ਦਰ ਹਰ ਸਾਲ ਲਈ ਦੁਹਰਾ ਦਿੱਤੀ ਗਈ ਹੈ।";
  if (/ONE_YEAR_EARLY/u.test(id)) return locale === "hi-IN" ? "इस समय तक सीमा पार नहीं हुई है।" : "ਇਸ ਸਮੇਂ ਤੱਕ ਹੱਦ ਪਾਰ ਨਹੀਂ ਹੋਈ।";
  if (/YEAR_LATE|TWO_YEARS_LATE/u.test(id)) return locale === "hi-IN" ? "सीमा इससे पहले ही पार हो चुकी थी।" : "ਹੱਦ ਇਸ ਤੋਂ ਪਹਿਲਾਂ ਹੀ ਪਾਰ ਹੋ ਚੁੱਕੀ ਸੀ।";
  if (/ALL_INCREASE/u.test(id)) return locale === "hi-IN" ? "कमी को भी वृद्धि मान लिया गया है।" : "ਘਟਾਓ ਨੂੰ ਵੀ ਵਾਧਾ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।";
  if (/DECREASE_ON_ORIGINAL/u.test(id)) return locale === "hi-IN" ? "कमी को अद्यतन मूल्य के बजाय मूल मूल्य पर लगाया गया है।" : "ਘਟਾਓ ਨੂੰ ਬਦਲੇ ਹੋਏ ਮੁੱਲ ਦੀ ਥਾਂ ਮੂਲ ਮੁੱਲ 'ਤੇ ਲਾਇਆ ਗਿਆ ਹੈ।";
  if (/ADD_SIGNED_RATES|ADD_RATES/u.test(id)) return locale === "hi-IN" ? "क्रमिक प्रतिशत परिवर्तनों को साधारण जोड़ की तरह लिया गया है।" : "ਲਗਾਤਾਰ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਵਾਂ ਨੂੰ ਸਧਾਰਣ ਜੋੜ ਵਾਂਗ ਲਿਆ ਗਿਆ ਹੈ।";
  if (/FINAL_AMOUNT/u.test(id)) return locale === "hi-IN" ? "यह अंतिम राशि है, अर्जित ब्याज नहीं।" : "ਇਹ ਅੰਤਿਮ ਰਕਮ ਹੈ, ਕਮਾਇਆ ਵਿਆਜ ਨਹੀਂ।";
  if (/NO_REVERSE/u.test(id)) return locale === "hi-IN" ? "अंतिम मान से चक्रवृद्धि गुणकों को उलटा नहीं गया है।" : "ਅੰਤਿਮ ਮੁੱਲ ਤੋਂ ਮਿਸ਼ਰਤ ਗੁਣਕਾਂ ਨੂੰ ਉਲਟਿਆ ਨਹੀਂ ਗਿਆ।";
  if (/LINEAR_REVERSE/u.test(id)) return locale === "hi-IN" ? "क्रमिक गुणकों को उलटने के बजाय कुल प्रतिशत को रैखिक रूप से उलटा गया है।" : "ਲਗਾਤਾਰ ਗੁਣਕਾਂ ਨੂੰ ਉਲਟਣ ਦੀ ਥਾਂ ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਨੂੰ ਰੇਖੀ ਢੰਗ ਨਾਲ ਉਲਟਿਆ ਗਿਆ ਹੈ।";
  if (/REVERSE_ONLY_YEAR/u.test(id)) return locale === "hi-IN" ? "केवल एक वर्ष का गुणक उलटा गया है।" : "ਕੇਵਲ ਇੱਕ ਸਾਲ ਦਾ ਗੁਣਕ ਉਲਟਿਆ ਗਿਆ ਹੈ।";
  if (/OMIT/u.test(id)) return locale === "hi-IN" ? "एक आवश्यक वर्ष का परिवर्तन छोड़ दिया गया है।" : "ਇੱਕ ਲੋੜੀਂਦੇ ਸਾਲ ਦਾ ਬਦਲਾਅ ਛੱਡ ਦਿੱਤਾ ਗਿਆ ਹੈ।";
  if (/ONLY_YEAR/u.test(id)) return locale === "hi-IN" ? "केवल एक वर्ष की दर लागू की गई है।" : "ਕੇਵਲ ਇੱਕ ਸਾਲ ਦੀ ਦਰ ਲਾਗੂ ਕੀਤੀ ਗਈ ਹੈ।";
  return hi("यह विकल्प पूर्ण क्रमिक गणना का पालन नहीं करता।") || "ਇਹ ਵਿਕਲਪ ਪੂਰੀ ਲਗਾਤਾਰ ਗਣਨਾ ਦਾ ਪਾਲਣ ਨਹੀਂ ਕਰਦਾ।";
}
function options(source: IntCp005QuestionV16_1, locale: IntCp005V16_1Locale): readonly IntCp005Option[] {
  return Object.freeze(source.options.map((option) => deepFreeze({
    ...option,
    text: optionText(option.value, source.mathematicalState, locale),
    studentFeedback: feedback(option.misconceptionId, locale, option.isCorrect),
  })));
}

function explanation(source: IntCp005QuestionV16_1, locale: IntCp005V16_1Locale): IntCp005QuestionV16_1["explanation"] {
  const ql = source.qlId;
  const key: Record<string, [string, string]> = {
    "INT-QL-086": ["हर वर्ष की वृद्धि दर क्रमशः लागू करें।", "ਹਰ ਸਾਲ ਦੀ ਵਾਧਾ ਦਰ ਕ੍ਰਮਵਾਰ ਲਾਗੂ ਕਰੋ।"],
    "INT-QL-087": ["पहले अंतिम चक्रवृद्धि राशि निकालें, फिर मूलधन घटाएँ।", "ਪਹਿਲਾਂ ਅੰਤਿਮ ਮਿਸ਼ਰਤ ਰਕਮ ਕੱਢੋ, ਫਿਰ ਮੂਲਧਨ ਘਟਾਓ।"],
    "INT-QL-088": ["अंतिम मान से प्रत्येक वार्षिक गुणक को उलटा करें।", "ਅੰਤਿਮ ਮੁੱਲ ਤੋਂ ਹਰ ਸਾਲਾਨਾ ਗੁਣਕ ਨੂੰ ਉਲਟੋ।"],
    "INT-QL-089": ["ज्ञात गुणकों को हटाकर अज्ञात वार्षिक गुणक अलग करें।", "ਜਾਣੇ ਹੋਏ ਗੁਣਕ ਹਟਾ ਕੇ ਅਣਜਾਣ ਸਾਲਾਨਾ ਗੁਣਕ ਵੱਖ ਕਰੋ।"],
    "INT-QL-090": ["हर मूल्यह्रास दर घटे हुए मूल्य पर क्रमशः लगती है।", "ਹਰ ਘਟਾਓ ਦਰ ਘਟੇ ਹੋਏ ਮੁੱਲ 'ਤੇ ਕ੍ਰਮਵਾਰ ਲੱਗਦੀ ਹੈ।"],
    "INT-QL-091": ["मूल मूल्य पाने के लिए सभी मूल्यह्रास गुणकों को उलटा करें।", "ਮੂਲ ਮੁੱਲ ਲਈ ਸਾਰੇ ਘਟਾਓ ਗੁਣਕ ਉਲਟੋ।"],
    "INT-QL-092": ["वृद्धि के लिए 1+r/100 और कमी के लिए 1-r/100 का गुणक लें।", "ਵਾਧੇ ਲਈ 1+r/100 ਅਤੇ ਘਟਾਓ ਲਈ 1-r/100 ਦਾ ਗੁਣਕ ਲਓ।"],
    "INT-QL-093": ["सीमा पहली बार कब पार होती है, इसके लिए पिछले और वर्तमान वर्ष दोनों जाँचें।", "ਹੱਦ ਪਹਿਲੀ ਵਾਰ ਕਦੋਂ ਪਾਰ ਹੁੰਦੀ ਹੈ, ਇਸ ਲਈ ਪਿਛਲਾ ਅਤੇ ਮੌਜੂਦਾ ਸਾਲ ਦੋਵੇਂ ਜਾਂਚੋ।"],
    "INT-QL-095": ["दोनों योजनाओं को अलग-अलग चक्रवृद्धि करें और फिर अंतिम राशियों का अंतर लें।", "ਦੋਵੇਂ ਯੋਜਨਾਵਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਮਿਸ਼ਰਤ ਕਰੋ ਅਤੇ ਫਿਰ ਅੰਤਿਮ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਲਓ।"],
  };
  const mistake: Record<string, [string, string]> = {
    "INT-QL-086": ["वार्षिक दरों को जोड़कर एक बार मूल मान पर लागू न करें।", "ਸਾਲਾਨਾ ਦਰਾਂ ਜੋੜ ਕੇ ਇੱਕ ਵਾਰ ਮੂਲ ਮੁੱਲ 'ਤੇ ਲਾਗੂ ਨਾ ਕਰੋ।"],
    "INT-QL-087": ["अंतिम राशि को चक्रवृद्धि ब्याज न समझें।", "ਅੰਤਿਮ ਰਕਮ ਨੂੰ ਮਿਸ਼ਰਤ ਵਿਆਜ ਨਾ ਸਮਝੋ।"],
    "INT-QL-088": ["अंतिम मान से दरों को सीधे घटाना चक्रवृद्धि को उलटा नहीं करता।", "ਅੰਤਿਮ ਮੁੱਲ ਤੋਂ ਦਰਾਂ ਸਿੱਧੀਆਂ ਘਟਾਉਣ ਨਾਲ ਮਿਸ਼ਰਤ ਵਾਧਾ ਉਲਟਦਾ ਨਹੀਂ।"],
    "INT-QL-089": ["अज्ञात दर को ज्ञात दरों को जोड़कर या दोहराकर न चुनें।", "ਅਣਜਾਣ ਦਰ ਨੂੰ ਜਾਣੀਆਂ ਦਰਾਂ ਜੋੜ ਕੇ ਜਾਂ ਦੁਹਰਾ ਕੇ ਨਾ ਚੁਣੋ।"],
    "INT-QL-090": ["सभी मूल्यह्रास प्रतिशत मूल मूल्य से एक साथ न घटाएँ।", "ਸਾਰੇ ਘਟਾਓ ਪ੍ਰਤੀਸ਼ਤ ਮੂਲ ਮੁੱਲ ਤੋਂ ਇੱਕੋ ਵਾਰ ਨਾ ਘਟਾਓ।"],
    "INT-QL-091": ["कुल मूल्यह्रास को एक साधारण प्रतिशत की तरह उलटा न करें।", "ਕੁੱਲ ਘਟਾਓ ਨੂੰ ਇੱਕ ਸਧਾਰਣ ਪ੍ਰਤੀਸ਼ਤ ਵਾਂਗ ਉਲਟੋ ਨਾ।"],
    "INT-QL-092": ["कमी को वृद्धि की तरह न लें; हर परिवर्तन अद्यतन मूल्य पर लगता है।", "ਘਟਾਓ ਨੂੰ ਵਾਧੇ ਵਾਂਗ ਨਾ ਲਓ; ਹਰ ਬਦਲਾਅ ਬਦਲੇ ਮੁੱਲ 'ਤੇ ਲੱਗਦਾ ਹੈ।"],
    "INT-QL-093": ["कोई बाद का वर्ष भी सीमा पूरी कर सकता है, पर उत्तर पहला सीमा-पार वर्ष है।", "ਬਾਅਦ ਦਾ ਸਾਲ ਵੀ ਹੱਦ ਪੂਰੀ ਕਰ ਸਕਦਾ ਹੈ, ਪਰ ਉੱਤਰ ਪਹਿਲਾ ਹੱਦ-ਪਾਰ ਸਾਲ ਹੈ।"],
    "INT-QL-095": ["योजनाओं की वार्षिक दरों को केवल जोड़कर तुलना न करें।", "ਯੋਜਨਾਵਾਂ ਦੀਆਂ ਸਾਲਾਨਾ ਦਰਾਂ ਕੇਵਲ ਜੋੜ ਕੇ ਤੁਲਨਾ ਨਾ ਕਰੋ।"],
  };
  const index = locale === "hi-IN" ? 0 : 1;
  const steps = source.explanation.steps.slice(0, -1);
  const final = locale === "hi-IN" ? `अतः उत्तर ${optionText(source.solution, source.mathematicalState, locale)} है।` : `ਇਸ ਲਈ ਉੱਤਰ ${optionText(source.solution, source.mathematicalState, locale)} ਹੈ।`;
  return deepFreeze({
    keyIdea: key[ql]![index],
    steps: Object.freeze([...steps, final]),
    finalAnswer: optionText(source.solution, source.mathematicalState, locale),
    commonMistake: mistake[ql]![index],
  });
}

export function generateIntCp005QuestionV16_1Localized(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005V16_1Locale,
): IntCp005QuestionV16_1Localized {
  if (qlId === "INT-QL-094") throw new Error("INT-QL-094 remains outside CP005 V16.1 learner authority.");
  const source = generateIntCp005QuestionV16_1Final(qlId, seed, "en-IN");
  const optionList = options(source, locale);
  return deepFreeze({
    ...source,
    locale,
    presentation: presentation(source.mathematicalState, seed, locale),
    options: optionList,
    correctAnswer: optionList[source.correctIndex]!.text,
    explanation: explanation(source, locale),
  });
}
