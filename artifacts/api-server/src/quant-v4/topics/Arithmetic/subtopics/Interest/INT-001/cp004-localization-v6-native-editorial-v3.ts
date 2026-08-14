import { generateIntCp004V6NativeEditorialQuestion } from "./cp004-localization-v6-native-editorial";
import type { IntCp004V6Locale, IntCp004V6LocalizedQuestion } from "./cp004-localization-v6-types";

export const INT_CP004_HI_PA_V6_NATIVE_EDITORIAL_V3 = "INT-CP-004-HI-PA-V6-NATIVE-EDITORIAL-v3" as const;

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function naturalMonths(locale: IntCp004V6Locale, months: number): string {
  if (months < 12) return locale === "hi-IN" ? `${months} महीने` : `${months} ਮਹੀਨੇ`;
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  const yearText = locale === "hi-IN" ? `${years} वर्ष` : `${years} ਸਾਲ`;
  if (remainder === 0) return yearText;
  const monthText = locale === "hi-IN" ? `${remainder} महीने` : `${remainder} ਮਹੀਨੇ`;
  return locale === "hi-IN" ? `${yearText} और ${monthText}` : `${yearText} ਅਤੇ ${monthText}`;
}

const FLEX_SPACE = "[\\s\\u200B-\\u200D\\uFEFF]*";

function normalize(locale: IntCp004V6Locale, text: string): string {
  const pattern = locale === "hi-IN" ? /(\d+) महीने/gu : /(\d+) ਮਹੀਨੇ/gu;
  let result = text.replace(pattern, (match, raw: string) => {
    const months = Number(raw);
    return Number.isInteger(months) && months >= 12 ? naturalMonths(locale, months) : match;
  });
  if (locale === "hi-IN") {
    const annualAttached = new RegExp(`ब्याज${FLEX_SPACE}वार्षिक${FLEX_SPACE}रूप${FLEX_SPACE}से${FLEX_SPACE}जुड़ता${FLEX_SPACE}है`, "gu");
    const firstYearsAnnualAttached = new RegExp(`पहले${FLEX_SPACE}(\\d+)${FLEX_SPACE}वर्ष${FLEX_SPACE}ब्याज${FLEX_SPACE}वार्षिक${FLEX_SPACE}रूप${FLEX_SPACE}से${FLEX_SPACE}जुड़ता${FLEX_SPACE}है`, "gu");
    result = result
      .replace(/पहले 1 वर्ष/gu, "पहले वर्ष")
      .replace(/अगले 1 वर्ष/gu, "अगले वर्ष")
      .replace(firstYearsAnnualAttached, (_m, n: string) => Number(n) === 1
        ? "पहले वर्ष ब्याज सालाना जोड़ा जाता है"
        : `पहले ${n} वर्षों तक ब्याज सालाना जोड़ा जाता है`)
      .replace(annualAttached, "ब्याज सालाना जोड़ा जाता है")
      .replace(/ब्याज वार्षिक रूप से जुड़ता है/gu, "ब्याज सालाना जोड़ा जाता है")
      .replace(/वार्षिक रूप से जोड़ने/gu, "हर साल जोड़ने")
      .replace(/अंतिम (\d+) महीने के लिए/gu, "अंतिम $1 महीनों के लिए")
      .replace(/अंतिम 1 महीनों के लिए/gu, "अंतिम 1 महीने के लिए")
      .replace(/कुल समययाँ n = (\d+)।/gu, "ब्याज कुल $1 बार जुड़ता है, इसलिए n = $1।")
      .replace(/कुल समययाँ/gu, "ब्याज जुड़ने की कुल संख्या")
      .replace(/प्रति अवधि दर/gu, "हर अवधि की दर")
      .replace(/कुल अवधियाँ (\d+)।/gu, "ब्याज कुल $1 बार जुड़ता है।")
      .replace(/अवधियाँ (\d+)।/gu, "ब्याज $1 बार जुड़ता है।")
      .replace(/पहले वर्ष ब्याज जोड़ा जाता है और अगले वर्ष हर तीन महीने जोड़ा जाता है/gu, "पहले वर्ष ब्याज सालाना और अगले वर्ष हर तीन महीने जोड़ा जाता है")
      .replace(/पहले वर्ष ब्याज हर छह महीने जोड़ा जाता है और अगले वर्ष हर वर्ष जोड़ा जाता है/gu, "पहले वर्ष ब्याज हर छह महीने और अगले वर्ष सालाना जोड़ा जाता है")
      .replace(/पहले वर्ष ब्याज हर तीन महीने जोड़ा जाता है और अगले वर्ष हर वर्ष जोड़ा जाता है/gu, "पहले वर्ष ब्याज हर तीन महीने और अगले वर्ष सालाना जोड़ा जाता है")
      .replace(/पहले वर्ष ब्याज हर वर्ष और अगले वर्ष हर तीन महीने जोड़ा जाता है/gu, "पहले वर्ष ब्याज सालाना और अगले वर्ष हर तीन महीने जोड़ा जाता है")
      .replace(/पहले वर्ष ब्याज हर वर्ष और अगले वर्ष हर छह महीने जोड़ा जाता है/gu, "पहले वर्ष ब्याज सालाना और अगले वर्ष हर छह महीने जोड़ा जाता है")
      .replace(/अगले वर्ष हर वर्ष/gu, "अगले वर्ष सालाना")
      .replace(/पूरे हुए वर्षों/gu, "पूरे वर्षों");
  } else {
    const annualAttached = new RegExp(`ਵਿਆਜ${FLEX_SPACE}ਸਾਲਾਨਾ${FLEX_SPACE}ਜੁੜਦਾ${FLEX_SPACE}ਹੈ`, "gu");
    const firstYearsAnnualAttached = new RegExp(`ਪਹਿਲੇ${FLEX_SPACE}(\\d+)${FLEX_SPACE}ਸਾਲ${FLEX_SPACE}ਵਿਆਜ${FLEX_SPACE}ਸਾਲਾਨਾ${FLEX_SPACE}ਜੁੜਦਾ${FLEX_SPACE}ਹੈ`, "gu");
    result = result
      .replace(/ਪਹਿਲੇ 1 ਸਾਲ/gu, "ਪਹਿਲੇ ਸਾਲ")
      .replace(/ਅਗਲੇ 1 ਸਾਲ/gu, "ਅਗਲੇ ਸਾਲ")
      .replace(firstYearsAnnualAttached, (_m, n: string) => Number(n) === 1
        ? "ਪਹਿਲੇ ਸਾਲ ਵਿਆਜ ਸਾਲਾਨਾ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ"
        : `ਪਹਿਲੇ ${n} ਸਾਲਾਂ ਤੱਕ ਵਿਆਜ ਸਾਲਾਨਾ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ`)
      .replace(annualAttached, "ਵਿਆਜ ਸਾਲਾਨਾ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ")
      .replace(/ਵਿਆਜ ਸਾਲਾਨਾ ਜੁੜਦਾ ਹੈ/gu, "ਵਿਆਜ ਸਾਲਾਨਾ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ")
      .replace(/ਕੁੱਲ ਸਮਾਂਾਂ n = (\d+)।/gu, "ਵਿਆਜ ਕੁੱਲ $1 ਵਾਰ ਜੁੜਦਾ ਹੈ, ਇਸ ਲਈ n = $1।")
      .replace(/ਕੁੱਲ ਸਮਾਂਾਂ/gu, "ਵਿਆਜ ਜੁੜਨ ਦੀ ਕੁੱਲ ਗਿਣਤੀ")
      .replace(/ਕੁੱਲ ਮਿਆਦਾਂ (\d+)।/gu, "ਵਿਆਜ ਕੁੱਲ $1 ਵਾਰ ਜੁੜਦਾ ਹੈ।")
      .replace(/ਮਿਆਦਾਂ (\d+)।/gu, "ਵਿਆਜ $1 ਵਾਰ ਜੁੜਦਾ ਹੈ।")
      .replace(/ਪਹਿਲੇ ਸਾਲ ਵਿਆਜ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਅਗਲੇ ਸਾਲ ਹਰ ਤਿੰਨ ਮਹੀਨੇ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ/gu, "ਪਹਿਲੇ ਸਾਲ ਵਿਆਜ ਸਾਲਾਨਾ ਅਤੇ ਅਗਲੇ ਸਾਲ ਹਰ ਤਿੰਨ ਮਹੀਨੇ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ")
      .replace(/ਪਹਿਲੇ ਸਾਲ ਵਿਆਜ ਹਰ ਛੇ ਮਹੀਨੇ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਅਗਲੇ ਸਾਲ ਹਰ ਸਾਲ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ/gu, "ਪਹਿਲੇ ਸਾਲ ਵਿਆਜ ਹਰ ਛੇ ਮਹੀਨੇ ਅਤੇ ਅਗਲੇ ਸਾਲ ਸਾਲਾਨਾ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ")
      .replace(/ਪਹਿਲੇ ਸਾਲ ਵਿਆਜ ਹਰ ਤਿੰਨ ਮਹੀਨੇ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਅਗਲੇ ਸਾਲ ਹਰ ਸਾਲ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ/gu, "ਪਹਿਲੇ ਸਾਲ ਵਿਆਜ ਹਰ ਤਿੰਨ ਮਹੀਨੇ ਅਤੇ ਅਗਲੇ ਸਾਲ ਸਾਲਾਨਾ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ")
      .replace(/ਪਹਿਲੇ ਸਾਲ ਵਿਆਜ ਹਰ ਸਾਲ ਅਤੇ ਅਗਲੇ ਸਾਲ ਹਰ ਤਿੰਨ ਮਹੀਨੇ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ/gu, "ਪਹਿਲੇ ਸਾਲ ਵਿਆਜ ਸਾਲਾਨਾ ਅਤੇ ਅਗਲੇ ਸਾਲ ਹਰ ਤਿੰਨ ਮਹੀਨੇ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ")
      .replace(/ਪਹਿਲੇ ਸਾਲ ਵਿਆਜ ਹਰ ਸਾਲ ਅਤੇ ਅਗਲੇ ਸਾਲ ਹਰ ਛੇ ਮਹੀਨੇ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ/gu, "ਪਹਿਲੇ ਸਾਲ ਵਿਆਜ ਸਾਲਾਨਾ ਅਤੇ ਅਗਲੇ ਸਾਲ ਹਰ ਛੇ ਮਹੀਨੇ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ")
      .replace(/ਅਗਲੇ ਸਾਲ ਹਰ ਸਾਲ/gu, "ਅਗਲੇ ਸਾਲ ਸਾਲਾਨਾ")
      .replace(/ਪੂਰੇ ਹੋਏ ਸਾਲਾਂ/gu, "ਪੂਰੇ ਸਾਲਾਂ")
      .replace(/ਮਿਸ਼ਰਤ ਮਿਆਦ ਦਾ ਵਿਆਜ/gu, "ਚੱਕਰਵੱਧੀ ਵਿਆਜ")
      .replace(/ਮਿਸ਼ਰਤ ਵਿਆਜ/gu, "ਚੱਕਰਵੱਧੀ ਵਿਆਜ");
  }
  return result;
}

export function generateIntCp004V6NativeEditorialV3Question(
  qlId: IntCp004V6LocalizedQuestion["qlId"],
  seed: string,
  locale: IntCp004V6Locale,
): IntCp004V6LocalizedQuestion {
  const question = generateIntCp004V6NativeEditorialQuestion(qlId, seed, locale);
  const options = Object.freeze(question.options.map((option) => Object.freeze({ ...option, text: normalize(locale, option.text) })));
  const correctAnswer = options[question.correctIndex]?.text;
  if (!correctAnswer) throw new Error(`${qlId}/${seed}/${locale}: V3 correct answer missing.`);
  const explanation = Object.freeze({
    ...question.explanation,
    whatAsked: qlId === "INT-QL-083"
      ? locale === "hi-IN"
        ? `हमें पता करना है कि अंतिम ${question.mathematicalState.tailMonths} महीनों से पहले ब्याज कितने वर्षों तक सालाना जोड़ा गया था।`
        : `ਆਓ ਪਤਾ ਕਰੀਏ ਕਿ ਆਖਰੀ ${question.mathematicalState.tailMonths} ਮਹੀਨਿਆਂ ਤੋਂ ਪਹਿਲਾਂ ਵਿਆਜ ਕਿੰਨੇ ਸਾਲਾਂ ਤੱਕ ਸਾਲਾਨਾ ਜੋੜਿਆ ਗਿਆ ਸੀ।`
      : normalize(locale, question.explanation.whatAsked),
    steps: Object.freeze(question.explanation.steps.map((step) => normalize(locale, step))),
    finalAnswer: locale === "hi-IN" ? `उत्तर: ${correctAnswer}।` : `ਉੱਤਰ: ${correctAnswer}।`,
    commonMistake: normalize(locale, question.explanation.commonMistake),
  });
  return deepFreeze({ ...question, stem: normalize(locale, question.stem), options, correctAnswer, explanation });
}
