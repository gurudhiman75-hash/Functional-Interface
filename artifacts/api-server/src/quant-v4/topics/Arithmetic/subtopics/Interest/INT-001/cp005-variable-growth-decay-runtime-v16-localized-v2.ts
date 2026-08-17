import type { Rational } from "./cp003-exam-model";
import {
  INT_CP005_V16_LOCALIZED_LOCALES,
  INT_CP005_V16_LOCALIZED_RUNTIME_VERSION,
  generateIntCp005QuestionV16LocalizedFinal,
  type IntCp005LocalizedLocale,
  type IntCp005QuestionV16Localized,
} from "./cp005-variable-growth-decay-runtime-v16-localized-final";
import type { IntCp005QlId, IntCp005State } from "./cp005-variable-growth-decay-runtime";

export const INT_CP005_V16_LOCALIZED_EDITORIAL_VERSION = "INT-CP-005-V16-HI-PA-REVIEW-v2" as const;
export { INT_CP005_V16_LOCALIZED_LOCALES, INT_CP005_V16_LOCALIZED_RUNTIME_VERSION };
export type { IntCp005LocalizedLocale, IntCp005QuestionV16Localized };

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}
function integer(value: Rational): bigint {
  if (value.denominator !== 1n) throw new Error(`CP005 V16 localized V2 expects integral learner value: ${value.numerator}/${value.denominator}`);
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
function rate(value: Rational): string { return value.denominator === 1n ? `${value.numerator}%` : `${Number(value.numerator) / Number(value.denominator)}%`; }
const HI_ORD = ["पहले", "दूसरे", "तीसरे", "चौथे"] as const;
const PA_ORD = ["ਪਹਿਲੇ", "ਦੂਜੇ", "ਤੀਜੇ", "ਚੌਥੇ"] as const;
function join(items: readonly string[], locale: IntCp005LocalizedLocale): string {
  if (items.length === 1) return items[0]!;
  const and = locale === "hi-IN" ? "और" : "ਅਤੇ";
  return `${items.slice(0, -1).join(", ")} ${and} ${items[items.length - 1]}`;
}
function schedule(rates: readonly Rational[], locale: IntCp005LocalizedLocale, missingIndex?: number): string {
  return join(rates.map((r, index) => {
    const ord = locale === "hi-IN" ? HI_ORD[index] ?? `${index + 1}वें` : PA_ORD[index] ?? `${index + 1}ਵੇਂ`;
    const value = index === missingIndex ? "?" : rate(r);
    return locale === "hi-IN" ? `${ord} वर्ष ${value}` : `${ord} ਸਾਲ ${value}`;
  }), locale);
}
function tableMarkdown(headers: readonly string[], rows: readonly (readonly string[])[]): string {
  return [`| ${headers.join(" | ")} |`, `| ${headers.map(() => "---").join(" | ")} |`, ...rows.map((row) => `| ${row.join(" | ")} |`)].join("\n");
}

function presentationV2(state: IntCp005State, locale: IntCp005LocalizedLocale): IntCp005QuestionV16Localized["presentation"] | null {
  switch (state.qlId) {
    case "INT-QL-086": {
      const s = schedule(state.rates, locale);
      const prompt = locale === "hi-IN"
        ? `${money(state.initial)} के निवेश पर ${s} वार्षिक चक्रवृद्धि ब्याज मिलता है। अवधि के अंत में राशि कितनी होगी?`
        : `${money(state.initial)} ਦੇ ਨਿਵੇਸ਼ 'ਤੇ ${s} ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਮਿਲਦਾ ਹੈ। ਮਿਆਦ ਦੇ ਅੰਤ ਵਿੱਚ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ?`;
      return deepFreeze({ prompt, markdown: prompt });
    }
    case "INT-QL-087": {
      const s = schedule(state.rates, locale);
      const prompt = locale === "hi-IN"
        ? `${money(state.initial)} के निवेश पर ${s} वार्षिक चक्रवृद्धि ब्याज मिलता है। पूरी अवधि का चक्रवृद्धि ब्याज कितना होगा?`
        : `${money(state.initial)} ਦੇ ਨਿਵੇਸ਼ 'ਤੇ ${s} ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਮਿਲਦਾ ਹੈ। ਪੂਰੀ ਮਿਆਦ ਦਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਕਿੰਨਾ ਹੋਵੇਗਾ?`;
      return deepFreeze({ prompt, markdown: prompt });
    }
    case "INT-QL-088": {
      const s = schedule(state.rates, locale);
      const prompt = locale === "hi-IN"
        ? `किसी निवेश पर ${s} वार्षिक चक्रवृद्धि ब्याज मिलता है। अवधि के अंत में राशि ${money(state.finalValue)} है। प्रारंभिक मूलधन कितना था?`
        : `ਕਿਸੇ ਨਿਵੇਸ਼ 'ਤੇ ${s} ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਮਿਲਦਾ ਹੈ। ਮਿਆਦ ਦੇ ਅੰਤ ਵਿੱਚ ਰਕਮ ${money(state.finalValue)} ਹੈ। ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ਕਿੰਨਾ ਸੀ?`;
      return deepFreeze({ prompt, markdown: prompt });
    }
    case "INT-QL-089": {
      const s = schedule(state.rates, locale, state.missingIndex);
      const prompt = locale === "hi-IN"
        ? `${money(state.initial)} का निवेश ${state.rates.length} वर्षों में ${money(state.finalValue)} हो जाता है। दरों का क्रम है: ${s}। अज्ञात वार्षिक चक्रवृद्धि ब्याज दर कितनी है?`
        : `${money(state.initial)} ਦਾ ਨਿਵੇਸ਼ ${state.rates.length} ਸਾਲਾਂ ਵਿੱਚ ${money(state.finalValue)} ਹੋ ਜਾਂਦਾ ਹੈ। ਦਰਾਂ ਦਾ ਕ੍ਰਮ ਹੈ: ${s}। ਅਣਜਾਣ ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦਰ ਕਿੰਨੀ ਹੈ?`;
      return deepFreeze({ prompt, markdown: prompt });
    }
    case "INT-QL-090": {
      const subject = locale === "hi-IN"
        ? (state.context === "VEHICLE" ? "एक वाहन" : "एक मशीन")
        : (state.context === "VEHICLE" ? "ਇੱਕ ਵਾਹਨ" : "ਇੱਕ ਮਸ਼ੀਨ");
      const s = schedule(state.decayRates, locale);
      const prompt = locale === "hi-IN"
        ? `${subject} का वर्तमान मूल्य ${money(state.initial)} है। उसमें ${s} वार्षिक मूल्यह्रास होता है। अवधि के अंत में उसका मूल्य कितना होगा?`
        : `${subject} ਦਾ ਮੌਜੂਦਾ ਮੁੱਲ ${money(state.initial)} ਹੈ। ਇਸ ਵਿੱਚ ${s} ਸਾਲਾਨਾ ਘਟਾਓ ਹੁੰਦਾ ਹੈ। ਮਿਆਦ ਦੇ ਅੰਤ ਵਿੱਚ ਇਸ ਦਾ ਮੁੱਲ ਕਿੰਨਾ ਹੋਵੇਗਾ?`;
      return deepFreeze({ prompt, markdown: prompt });
    }
    case "INT-QL-091": {
      const subject = locale === "hi-IN"
        ? (state.context === "VEHICLE" ? "एक वाहन" : "एक मशीन")
        : (state.context === "VEHICLE" ? "ਇੱਕ ਵਾਹਨ" : "ਇੱਕ ਮਸ਼ੀਨ");
      const s = schedule(state.decayRates, locale);
      const prompt = locale === "hi-IN"
        ? `${subject} के मूल्य में ${s} वार्षिक मूल्यह्रास होने के बाद उसका मूल्य ${money(state.finalValue)} रह जाता है। उसका प्रारंभिक मूल्य कितना था?`
        : `${subject} ਦੇ ਮੁੱਲ ਵਿੱਚ ${s} ਸਾਲਾਨਾ ਘਟਾਓ ਹੋਣ ਤੋਂ ਬਾਅਦ ਇਸ ਦਾ ਮੁੱਲ ${money(state.finalValue)} ਰਹਿ ਜਾਂਦਾ ਹੈ। ਇਸ ਦਾ ਸ਼ੁਰੂਆਤੀ ਮੁੱਲ ਕਿੰਨਾ ਸੀ?`;
      return deepFreeze({ prompt, markdown: prompt });
    }
    case "INT-QL-095": {
      const headers = locale === "hi-IN" ? ["वर्ष", "योजना A", "योजना B"] : ["ਸਾਲ", "ਯੋਜਨਾ A", "ਯੋਜਨਾ B"];
      const rows = state.planARates.map((r, index) => Object.freeze([String(index + 1), rate(r), rate(state.planBRates[index]!)]));
      const lead = locale === "hi-IN"
        ? `${money(state.initial)} की समान राशि नीचे दी गई दोनों योजनाओं में अलग-अलग निवेश की जाती है।`
        : `${money(state.initial)} ਦੀ ਇੱਕੋ ਰਕਮ ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਦੋਵੇਂ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਵੱਖ-ਵੱਖ ਨਿਵੇਸ਼ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।`;
      const prompt = locale === "hi-IN" ? "दोनों योजनाओं की अंतिम राशियों में कितना अंतर होगा?" : "ਦੋਵੇਂ ਯੋਜਨਾਵਾਂ ਦੀਆਂ ਅੰਤਿਮ ਰਕਮਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੋਵੇਗਾ?";
      const table = deepFreeze({ headers: Object.freeze(headers), rows: Object.freeze(rows) });
      return deepFreeze({ prompt, markdown: `${lead}\n\n${tableMarkdown(headers, rows)}\n\n${prompt}`, table });
    }
    default: return null;
  }
}

function polishExplanation(source: IntCp005QuestionV16Localized, locale: IntCp005LocalizedLocale): IntCp005QuestionV16Localized["explanation"] {
  let keyIdea = source.explanation.keyIdea;
  let commonMistake = source.explanation.commonMistake;
  if (source.qlId === "INT-QL-086") {
    commonMistake = locale === "hi-IN" ? "हर वर्ष की दर उस समय की राशि पर लगती है, केवल मूलधन पर नहीं।" : "ਹਰ ਸਾਲ ਦੀ ਦਰ ਉਸ ਸਮੇਂ ਦੀ ਰਕਮ ਉੱਤੇ ਲੱਗਦੀ ਹੈ, ਸਿਰਫ਼ ਮੂਲਧਨ ਉੱਤੇ ਨਹੀਂ।";
  } else if (source.qlId === "INT-QL-090") {
    keyIdea = locale === "hi-IN" ? "हर वर्ष की मूल्यह्रास दर पिछले वर्ष के बचे हुए मूल्य पर लगाएँ।" : "ਹਰ ਸਾਲ ਦੀ ਘਟਾਓ ਦਰ ਪਿਛਲੇ ਸਾਲ ਦੇ ਬਚੇ ਮੁੱਲ ਉੱਤੇ ਲਗਾਓ।";
  } else if (source.qlId === "INT-QL-093") {
    keyIdea = locale === "hi-IN" ? "सीमा पहली बार कब पूरी होती है, यह जानने के लिए पिछले वर्ष और उस वर्ष का मूल्य जाँचें।" : "ਹੱਦ ਪਹਿਲੀ ਵਾਰ ਕਦੋਂ ਪੂਰੀ ਹੁੰਦੀ ਹੈ, ਇਹ ਜਾਣਨ ਲਈ ਪਿਛਲੇ ਸਾਲ ਅਤੇ ਉਸ ਸਾਲ ਦਾ ਮੁੱਲ ਜਾਂਚੋ।";
  }
  return deepFreeze({ ...source.explanation, keyIdea, commonMistake });
}

export function generateIntCp005QuestionV16LocalizedV2(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005LocalizedLocale,
): IntCp005QuestionV16Localized {
  const source = generateIntCp005QuestionV16LocalizedFinal(qlId, seed, locale);
  const presentation = presentationV2(source.mathematicalState, locale) ?? source.presentation;
  const explanation = polishExplanation(source, locale);
  return deepFreeze({ ...source, presentation, explanation, mathematicalFingerprint: `${source.mathematicalFingerprint}|${INT_CP005_V16_LOCALIZED_EDITORIAL_VERSION}` });
}
