import { add, div, eq, mul, rat, sub, type Rational } from "./cp003-exam-model";
import {
  generateIntCp010ProductionCandidateV2,
} from "./cp010-production-authoring-candidate-v2-realism";
import type { IntCp010CandidateAuthorityId } from "./cp010-production-authoring-candidate-v1";

export const INT_CP010_LOCALIZATION_CANDIDATE_VERSION = "INT-CP-010-HI-PA-AUTHORING-CANDIDATE-v1" as const;
export const INT_CP010_LOCALIZATION_LANGUAGES = Object.freeze(["hi", "pa"] as const);
export type IntCp010LocalizationLanguage = (typeof INT_CP010_LOCALIZATION_LANGUAGES)[number];

const CONTEXTS: Record<string, Readonly<{ hi: string; pa: string }>> = Object.freeze({
  "bank loan": Object.freeze({ hi: "बैंक ऋण", pa: "ਬੈਂਕ ਕਰਜ਼ਾ" }),
  "education loan": Object.freeze({ hi: "शिक्षा ऋण", pa: "ਸਿੱਖਿਆ ਕਰਜ਼ਾ" }),
  "farm-machinery finance": Object.freeze({ hi: "कृषि-मशीनरी ऋण", pa: "ਖੇਤੀ ਮਸ਼ੀਨਰੀ ਕਰਜ਼ਾ" }),
  "business equipment loan": Object.freeze({ hi: "व्यावसायिक उपकरण ऋण", pa: "ਕਾਰੋਬਾਰੀ ਸਾਜ਼ੋ-ਸਾਮਾਨ ਕਰਜ਼ਾ" }),
  "cooperative-society loan": Object.freeze({ hi: "सहकारी समिति ऋण", pa: "ਸਹਿਕਾਰੀ ਸਭਾ ਕਰਜ਼ਾ" }),
  "vehicle finance": Object.freeze({ hi: "वाहन ऋण", pa: "ਵਾਹਨ ਕਰਜ਼ਾ" }),
  "shop-expansion loan": Object.freeze({ hi: "दुकान विस्तार ऋण", pa: "ਦੁਕਾਨ ਵਿਸਥਾਰ ਕਰਜ਼ਾ" }),
  "solar-equipment loan": Object.freeze({ hi: "सौर उपकरण ऋण", pa: "ਸੋਲਰ ਸਾਜ਼ੋ-ਸਾਮਾਨ ਕਰਜ਼ਾ" }),
  "farm-equipment loan": Object.freeze({ hi: "कृषि उपकरण ऋण", pa: "ਖੇਤੀ ਸਾਜ਼ੋ-ਸਾਮਾਨ ਕਰਜ਼ਾ" }),
  "business advance": Object.freeze({ hi: "व्यावसायिक अग्रिम ऋण", pa: "ਕਾਰੋਬਾਰੀ ਅਗਾਊਂ ਕਰਜ਼ਾ" }),
  "vehicle loan": Object.freeze({ hi: "वाहन ऋण", pa: "ਵਾਹਨ ਕਰਜ਼ਾ" }),
  "workshop-equipment finance": Object.freeze({ hi: "वर्कशॉप उपकरण ऋण", pa: "ਵਰਕਸ਼ਾਪ ਸਾਜ਼ੋ-ਸਾਮਾਨ ਕਰਜ਼ਾ" }),
  "crop-storage loan": Object.freeze({ hi: "फसल भंडारण ऋण", pa: "ਫਸਲ ਭੰਡਾਰਨ ਕਰਜ਼ਾ" }),
});

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  return Object.freeze(value);
}

function indianInteger(value: bigint): string {
  const negative = value < 0n;
  const source = (negative ? -value : value).toString();
  if (source.length <= 3) return `${negative ? "−" : ""}${source}`;
  const tail = source.slice(-3);
  let head = source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) { groups.unshift(head.slice(-2)); head = head.slice(0, -2); }
  if (head) groups.unshift(head);
  return `${negative ? "−" : ""}${groups.join(",")},${tail}`;
}

function money(value: Rational): string {
  const negative = value.numerator < 0n;
  const numerator = negative ? -value.numerator : value.numerator;
  let paise = (numerator * 100n) / value.denominator;
  const remainder = (numerator * 100n) % value.denominator;
  if (remainder * 2n >= value.denominator) paise += 1n;
  const rupees = paise / 100n;
  const p = paise % 100n;
  const body = p === 0n ? indianInteger(rupees) : `${indianInteger(rupees)}.${p.toString().padStart(2, "0")}`;
  return `${negative ? "−" : ""}₹${body}`;
}

function percent(value: Rational) {
  return value.denominator === 1n ? `${value.numerator}%` : `${value.numerator}/${value.denominator}%`;
}

function rateFactor(ratePercent: Rational) {
  return add(rat(1n), div(ratePercent, rat(100n)));
}

function contextFor(source: any, language: IntCp010LocalizationLanguage) {
  return CONTEXTS[source.context]?.[language] ?? (language === "hi" ? "ऋण" : "ਕਰਜ਼ਾ");
}

function ratesText(rates: readonly Rational[], language: IntCp010LocalizationLanguage) {
  return rates.map((rate, index) => language === "hi"
    ? `वर्ष ${index + 1}: ${percent(rate)}`
    : `ਸਾਲ ${index + 1}: ${percent(rate)}`).join(", ");
}

function promptFor(source: any, language: IntCp010LocalizationLanguage) {
  const state = source.mathematicalState as any;
  const context = contextFor(source, language);
  const periods = state.periodRatesPercent.length;
  const family = Number(String(source.stemFamilyId).match(/T(\d+)$/u)?.[1] ?? "1");

  if (source.authorityId === "INT-CP010-AUTH-01") {
    const hi = [
      `${money(state.openingDebt)} का ${context} ${periods} समान वार्षिक किस्तों से चुकाना है, प्रत्येक किस्त वर्ष के अंत में दी जाएगी। घटते शेष पर ब्याज दरें हैं: ${ratesText(state.periodRatesPercent, language)}। प्रत्येक किस्त ज्ञात कीजिए।`,
      `${context} के अंतर्गत ${money(state.openingDebt)} उधार लिए गए। हर वर्ष ब्याज दर बदलती है: ${ratesText(state.periodRatesPercent, language)}। यदि हर वर्ष के अंत में समान भुगतान करके ऋण ठीक समाप्त हो जाता है, तो वार्षिक भुगतान कितना है?`,
      `एक उधारकर्ता ${money(state.openingDebt)} के ${context} को ${periods} समान वर्ष-अंत भुगतानों में चुकाता है। क्रमशः दरें ${state.periodRatesPercent.map(percent).join(", ")} हैं। समान किस्त ज्ञात कीजिए।`,
      `${context} का प्रारंभिक शेष ${money(state.openingDebt)} है। ब्याज ${ratesText(state.periodRatesPercent, language)} के अनुसार लगता है और हर वर्ष ब्याज के बाद समान किस्त दी जाती है। किस्त कितनी होगी?`,
      `${money(state.openingDebt)} के ${context} पर अगले ${periods} वर्षों की दरें क्रमशः ${state.periodRatesPercent.map(percent).join(", ")} हैं। हर वर्ष के अंत में समान भुगतान से अंतिम शेष शून्य हो जाता है। भुगतान ज्ञात कीजिए।`,
      `एक ${context} ${periods} समान वर्ष-अंत किस्तों से चुकाया जाता है। प्रारंभिक ऋण ${money(state.openingDebt)} है और दरें ${ratesText(state.periodRatesPercent, language)} हैं। अंतिम किस्त के बाद शेष शून्य करने वाली किस्त ज्ञात कीजिए।`,
      `${context} पर आरंभ में ${money(state.openingDebt)} बकाया है। अगले ${periods} वर्षों की दरें ${state.periodRatesPercent.map(percent).join(", ")} हैं। प्रत्येक वर्ष के अंत में कितना समान भुगतान किया जाए कि ऋण पूरा चुक जाए?`,
      `${money(state.openingDebt)} का ${context} घटते शेष पर है। क्रमिक वर्षों की दरें ${state.periodRatesPercent.map(percent).join(", ")} हैं और ब्याज जुड़ने के बाद हर वर्ष समान किस्त दी जाती है। प्रत्येक किस्त ज्ञात कीजिए।`,
    ];
    const pa = [
      `${money(state.openingDebt)} ਦਾ ${context} ${periods} ਬਰਾਬਰ ਸਾਲਾਨਾ ਕਿਸ਼ਤਾਂ ਨਾਲ ਚੁਕਾਉਣਾ ਹੈ ਅਤੇ ਹਰ ਕਿਸ਼ਤ ਸਾਲ ਦੇ ਅੰਤ ਤੇ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਘਟਦੇ ਬਕਾਏ ਉੱਤੇ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦੀਆਂ ਦਰਾਂ ਹਨ: ${ratesText(state.periodRatesPercent, language)}। ਹਰ ਕਿਸ਼ਤ ਕੱਢੋ।`,
      `${context} ਅਧੀਨ ${money(state.openingDebt)} ਕਰਜ਼ਾ ਲਿਆ ਗਿਆ। ਹਰ ਸਾਲ ਵਿਆਜ ਦਰ ਬਦਲਦੀ ਹੈ: ${ratesText(state.periodRatesPercent, language)}। ਜੇ ਹਰ ਸਾਲ ਦੇ ਅੰਤ ਤੇ ਇਕੋ ਜਿਹਾ ਭੁਗਤਾਨ ਕਰਕੇ ਕਰਜ਼ਾ ਪੂਰਾ ਮੁੱਕ ਜਾਂਦਾ ਹੈ, ਤਾਂ ਸਾਲਾਨਾ ਭੁਗਤਾਨ ਕਿੰਨਾ ਹੈ?`,
      `ਇੱਕ ਕਰਜ਼ਦਾਰ ${money(state.openingDebt)} ਦੇ ${context} ਨੂੰ ${periods} ਬਰਾਬਰ ਸਾਲ-ਅੰਤ ਭੁਗਤਾਨਾਂ ਵਿੱਚ ਚੁਕਾਉਂਦਾ ਹੈ। ਲਗਾਤਾਰ ਦਰਾਂ ${state.periodRatesPercent.map(percent).join(", ")} ਹਨ। ਬਰਾਬਰ ਕਿਸ਼ਤ ਕੱਢੋ।`,
      `${context} ਦਾ ਸ਼ੁਰੂਆਤੀ ਬਕਾਇਆ ${money(state.openingDebt)} ਹੈ। ਵਿਆਜ ${ratesText(state.periodRatesPercent, language)} ਅਨੁਸਾਰ ਲੱਗਦਾ ਹੈ ਅਤੇ ਹਰ ਸਾਲ ਵਿਆਜ ਤੋਂ ਬਾਅਦ ਇਕੋ ਕਿਸ਼ਤ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਕਿਸ਼ਤ ਕਿੰਨੀ ਹੋਵੇਗੀ?`,
      `${money(state.openingDebt)} ਦੇ ${context} ਲਈ ਅਗਲੇ ${periods} ਸਾਲਾਂ ਦੀਆਂ ਦਰਾਂ ਕ੍ਰਮਵਾਰ ${state.periodRatesPercent.map(percent).join(", ")} ਹਨ। ਹਰ ਸਾਲ ਦੇ ਅੰਤ ਤੇ ਬਰਾਬਰ ਭੁਗਤਾਨ ਨਾਲ ਆਖਰੀ ਬਕਾਇਆ ਸਿਫ਼ਰ ਹੋ ਜਾਂਦਾ ਹੈ। ਭੁਗਤਾਨ ਕੱਢੋ।`,
      `ਇੱਕ ${context} ${periods} ਬਰਾਬਰ ਸਾਲ-ਅੰਤ ਕਿਸ਼ਤਾਂ ਨਾਲ ਚੁਕਾਇਆ ਜਾਂਦਾ ਹੈ। ਸ਼ੁਰੂਆਤੀ ਕਰਜ਼ਾ ${money(state.openingDebt)} ਹੈ ਅਤੇ ਦਰਾਂ ${ratesText(state.periodRatesPercent, language)} ਹਨ। ਆਖਰੀ ਕਿਸ਼ਤ ਤੋਂ ਬਾਅਦ ਬਕਾਇਆ ਸਿਫ਼ਰ ਕਰਨ ਵਾਲੀ ਕਿਸ਼ਤ ਕੱਢੋ।`,
      `${context} ਉੱਤੇ ਸ਼ੁਰੂ ਵਿੱਚ ${money(state.openingDebt)} ਬਕਾਇਆ ਹੈ। ਅਗਲੇ ${periods} ਸਾਲਾਂ ਦੀਆਂ ਦਰਾਂ ${state.periodRatesPercent.map(percent).join(", ")} ਹਨ। ਹਰ ਸਾਲ ਦੇ ਅੰਤ ਤੇ ਕਿੰਨਾ ਬਰਾਬਰ ਭੁਗਤਾਨ ਕੀਤਾ ਜਾਵੇ ਕਿ ਕਰਜ਼ਾ ਪੂਰਾ ਮੁੱਕ ਜਾਵੇ?`,
      `${money(state.openingDebt)} ਦਾ ${context} ਘਟਦੇ ਬਕਾਏ ਉੱਤੇ ਹੈ। ਲਗਾਤਾਰ ਸਾਲਾਂ ਦੀਆਂ ਦਰਾਂ ${state.periodRatesPercent.map(percent).join(", ")} ਹਨ ਅਤੇ ਵਿਆਜ ਜੁੜਨ ਤੋਂ ਬਾਅਦ ਹਰ ਸਾਲ ਇਕੋ ਕਿਸ਼ਤ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਹਰ ਕਿਸ਼ਤ ਕੱਢੋ।`,
    ];
    return (language === "hi" ? hi : pa)[family - 1]!;
  }

  const paymentsHi = state.repayments.map((payment: Rational, index: number) => `${money(payment)} वर्ष ${index + 1} के अंत में`).join(", ");
  const paymentsPa = state.repayments.map((payment: Rational, index: number) => `${money(payment)} ਸਾਲ ${index + 1} ਦੇ ਅੰਤ ਤੇ`).join(", ");
  const hi = [
    `${context} को इन भुगतानों से ठीक चुकाया जाता है: ${paymentsHi}। घटते शेष की दरें हैं: ${ratesText(state.periodRatesPercent, language)}। मूल उधार राशि ज्ञात कीजिए।`,
    `${context} में उधारकर्ता ${paymentsHi} भुगतान करता है। वार्षिक ब्याज दरें क्रमशः ${state.periodRatesPercent.map(percent).join(", ")} हैं। अंतिम भुगतान से ऋण समाप्त हो जाता है। प्रारंभिक ऋण कितना था?`,
    `${context} के लिए भुगतान क्रम है: ${paymentsHi}। बकाया राशि पर ब्याज ${ratesText(state.periodRatesPercent, language)} से लगता है। आरंभिक ऋण ज्ञात कीजिए।`,
    `${context} की किस्तें असमान हैं: ${paymentsHi}। वर्षों की बदलती दरें ${state.periodRatesPercent.map(percent).join(", ")} हैं और अंतिम भुगतान के बाद कुछ बकाया नहीं रहता। प्रारंभिक शेष ज्ञात कीजिए।`,
    `${context} ${periods} वर्ष-अंत भुगतानों ${state.repayments.map(money).join(", ")} से चुकाया गया। संबंधित दरें ${state.periodRatesPercent.map(percent).join(", ")} हैं। शुरुआत में कितनी राशि वित्तपोषित की गई थी?`,
    `${context} का अंतिम शेष इन भुगतानों ${paymentsHi} के बाद शून्य हो जाता है। दर हर वर्ष ${ratesText(state.periodRatesPercent, language)} के अनुसार बदलती है। मूल ऋण ज्ञात कीजिए।`,
    `${context} पर क्रमिक वर्ष-अंत भुगतान ${state.repayments.map(money).join(", ")} हैं और उन्हीं वर्षों की दरें ${state.periodRatesPercent.map(percent).join(", ")} हैं। अंतिम भुगतान ऋण समाप्त करता है। शुरुआती ऋण कितना था?`,
    `ऋणदाता को ${context} पर ये वर्ष-अंत भुगतान मिलते हैं: ${paymentsHi}। हर भुगतान से पहले बकाया पर ${ratesText(state.periodRatesPercent, language)} के अनुसार ब्याज लगता है। आरंभिक बकाया ज्ञात कीजिए।`,
  ];
  const pa = [
    `${context} ਇਹਨਾਂ ਭੁਗਤਾਨਾਂ ਨਾਲ ਪੂਰਾ ਚੁਕਾਇਆ ਜਾਂਦਾ ਹੈ: ${paymentsPa}। ਘਟਦੇ ਬਕਾਏ ਉੱਤੇ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦੀਆਂ ਦਰਾਂ ਹਨ: ${ratesText(state.periodRatesPercent, language)}। ਸ਼ੁਰੂ ਵਿੱਚ ਲਿਆ ਕਰਜ਼ਾ ਕੱਢੋ।`,
    `${context} ਵਿੱਚ ਕਰਜ਼ਦਾਰ ${paymentsPa} ਭੁਗਤਾਨ ਕਰਦਾ ਹੈ। ਸਾਲਾਨਾ ਦਰਾਂ ਕ੍ਰਮਵਾਰ ${state.periodRatesPercent.map(percent).join(", ")} ਹਨ। ਆਖਰੀ ਭੁਗਤਾਨ ਨਾਲ ਕਰਜ਼ਾ ਮੁੱਕ ਜਾਂਦਾ ਹੈ। ਸ਼ੁਰੂਆਤੀ ਕਰਜ਼ਾ ਕਿੰਨਾ ਸੀ?`,
    `${context} ਲਈ ਭੁਗਤਾਨ ਕ੍ਰਮ ਹੈ: ${paymentsPa}। ਬਕਾਏ ਉੱਤੇ ਵਿਆਜ ${ratesText(state.periodRatesPercent, language)} ਅਨੁਸਾਰ ਲੱਗਦਾ ਹੈ। ਸ਼ੁਰੂਆਤੀ ਕਰਜ਼ਾ ਕੱਢੋ।`,
    `${context} ਦੀਆਂ ਕਿਸ਼ਤਾਂ ਅਸਮਾਨ ਹਨ: ${paymentsPa}। ਬਦਲਦੀਆਂ ਸਾਲਾਨਾ ਦਰਾਂ ${state.periodRatesPercent.map(percent).join(", ")} ਹਨ ਅਤੇ ਆਖਰੀ ਭੁਗਤਾਨ ਤੋਂ ਬਾਅਦ ਕੋਈ ਬਕਾਇਆ ਨਹੀਂ ਰਹਿੰਦਾ। ਸ਼ੁਰੂਆਤੀ ਬਕਾਇਆ ਕੱਢੋ।`,
    `${context} ${periods} ਸਾਲ-ਅੰਤ ਭੁਗਤਾਨਾਂ ${state.repayments.map(money).join(", ")} ਨਾਲ ਚੁਕਾਇਆ ਗਿਆ। ਸੰਬੰਧਿਤ ਦਰਾਂ ${state.periodRatesPercent.map(percent).join(", ")} ਹਨ। ਸ਼ੁਰੂ ਵਿੱਚ ਕਿੰਨੀ ਰਕਮ ਫਾਇਨੈਂਸ ਕੀਤੀ ਗਈ ਸੀ?`,
    `${context} ਦਾ ਆਖਰੀ ਬਕਾਇਆ ਇਹਨਾਂ ਭੁਗਤਾਨਾਂ ${paymentsPa} ਤੋਂ ਬਾਅਦ ਸਿਫ਼ਰ ਹੋ ਜਾਂਦਾ ਹੈ। ਦਰ ਹਰ ਸਾਲ ${ratesText(state.periodRatesPercent, language)} ਅਨੁਸਾਰ ਬਦਲਦੀ ਹੈ। ਮੂਲ ਕਰਜ਼ਾ ਕੱਢੋ।`,
    `${context} ਉੱਤੇ ਲਗਾਤਾਰ ਸਾਲ-ਅੰਤ ਭੁਗਤਾਨ ${state.repayments.map(money).join(", ")} ਹਨ ਅਤੇ ਉਹਨਾਂ ਸਾਲਾਂ ਦੀਆਂ ਦਰਾਂ ${state.periodRatesPercent.map(percent).join(", ")} ਹਨ। ਆਖਰੀ ਭੁਗਤਾਨ ਕਰਜ਼ਾ ਮੁਕਾਉਂਦਾ ਹੈ। ਸ਼ੁਰੂਆਤੀ ਕਰਜ਼ਾ ਕਿੰਨਾ ਸੀ?`,
    `ਕਰਜ਼ਦਾਤਾ ਨੂੰ ${context} ਉੱਤੇ ਇਹ ਸਾਲ-ਅੰਤ ਭੁਗਤਾਨ ਮਿਲਦੇ ਹਨ: ${paymentsPa}। ਹਰ ਭੁਗਤਾਨ ਤੋਂ ਪਹਿਲਾਂ ਬਕਾਏ ਉੱਤੇ ${ratesText(state.periodRatesPercent, language)} ਅਨੁਸਾਰ ਵਿਆਜ ਲੱਗਦਾ ਹੈ। ਸ਼ੁਰੂਆਤੀ ਬਕਾਇਆ ਕੱਢੋ।`,
  ];
  return (language === "hi" ? hi : pa)[family - 1]!;
}

function explanationFor(source: any, language: IntCp010LocalizationLanguage) {
  const state = source.mathematicalState as any;
  const answer = source.answer as Rational;
  if (source.authorityId === "INT-CP010-AUTH-01") {
    let balance = state.openingDebt as Rational;
    const lines = state.periodRatesPercent.map((rate: Rational, index: number) => {
      const factor = rateFactor(rate);
      const next = sub(mul(balance, factor), answer);
      const line = language === "hi"
        ? `वर्ष ${index + 1}: ${money(balance)} × ${factor.numerator}/${factor.denominator} − ${money(answer)} = ${money(next)}।`
        : `ਸਾਲ ${index + 1}: ${money(balance)} × ${factor.numerator}/${factor.denominator} − ${money(answer)} = ${money(next)}।`;
      balance = next;
      return line;
    });
    if (!eq(balance, rat(0n))) throw new Error("CP010 localized AUTH-01 recurrence did not close at zero");
    return deepFreeze(language === "hi" ? {
      keyIdea: "हर वर्ष ब्याज दर बदलती है। इसलिए उस वर्ष की दर से बकाया बढ़ाएँ, फिर वही समान किस्त घटाएँ; सही किस्त अंतिम बकाया ठीक शून्य करती है।",
      steps: Object.freeze([
        `दिया है: प्रारंभिक ऋण ${money(state.openingDebt)}, वार्षिक दरें ${state.periodRatesPercent.map(percent).join(", ")} और ${state.periodRatesPercent.length} समान वर्ष-अंत किस्तें। ज्ञात करना है: समान किस्त।`,
        ...lines,
        `अंतिम बकाया ₹0 है, इसलिए प्रत्येक किस्त ${money(answer)} है।`,
      ]),
      finalAnswer: money(answer),
    } : {
      keyIdea: "ਹਰ ਸਾਲ ਵਿਆਜ ਦਰ ਬਦਲਦੀ ਹੈ। ਇਸ ਲਈ ਉਸ ਸਾਲ ਦੀ ਦਰ ਨਾਲ ਬਕਾਇਆ ਵਧਾਓ, ਫਿਰ ਉਹੀ ਬਰਾਬਰ ਕਿਸ਼ਤ ਘਟਾਓ; ਸਹੀ ਕਿਸ਼ਤ ਆਖਰੀ ਬਕਾਇਆ ਠੀਕ ਸਿਫ਼ਰ ਕਰਦੀ ਹੈ।",
      steps: Object.freeze([
        `ਦਿੱਤਾ ਹੈ: ਸ਼ੁਰੂਆਤੀ ਕਰਜ਼ਾ ${money(state.openingDebt)}, ਸਾਲਾਨਾ ਦਰਾਂ ${state.periodRatesPercent.map(percent).join(", ")} ਅਤੇ ${state.periodRatesPercent.length} ਬਰਾਬਰ ਸਾਲ-ਅੰਤ ਕਿਸ਼ਤਾਂ। ਕੱਢਣਾ ਹੈ: ਬਰਾਬਰ ਕਿਸ਼ਤ।`,
        ...lines,
        `ਆਖਰੀ ਬਕਾਇਆ ₹0 ਹੈ, ਇਸ ਲਈ ਹਰ ਕਿਸ਼ਤ ${money(answer)} ਹੈ।`,
      ]),
      finalAnswer: money(answer),
    });
  }

  let balanceAfter = rat(0n);
  const reverseLines: string[] = [];
  for (let index = state.periodRatesPercent.length - 1; index >= 0; index -= 1) {
    const factor = rateFactor(state.periodRatesPercent[index]!);
    const previous = div(add(balanceAfter, state.repayments[index]!), factor);
    reverseLines.unshift(language === "hi"
      ? `वर्ष ${index + 1} से पहले: (${money(balanceAfter)} + ${money(state.repayments[index]!)}) ÷ ${factor.numerator}/${factor.denominator} = ${money(previous)}।`
      : `ਸਾਲ ${index + 1} ਤੋਂ ਪਹਿਲਾਂ: (${money(balanceAfter)} + ${money(state.repayments[index]!)}) ÷ ${factor.numerator}/${factor.denominator} = ${money(previous)}।`);
    balanceAfter = previous;
  }
  if (!eq(balanceAfter, answer)) throw new Error("CP010 localized AUTH-02 reverse recurrence drifted");
  return deepFreeze(language === "hi" ? {
    keyIdea: "अंतिम भुगतान के बाद शेष शून्य से शुरू करके पीछे चलें। हर वर्ष उस वर्ष का भुगतान वापस जोड़ें और फिर उसी वर्ष के ब्याज गुणक को उलटें।",
    steps: Object.freeze([
      `दिया है: क्रमिक वर्ष-अंत भुगतान ${state.repayments.map(money).join(", ")} और दरें ${state.periodRatesPercent.map(percent).join(", ")}। अंतिम शेष शून्य है। ज्ञात करना है: प्रारंभिक ऋण।`,
      ...reverseLines,
      `पीछे चलते हुए आरंभिक ऋण ${money(answer)} मिलता है।`,
    ]),
    finalAnswer: money(answer),
  } : {
    keyIdea: "ਆਖਰੀ ਭੁਗਤਾਨ ਤੋਂ ਬਾਅਦ ਬਕਾਇਆ ਸਿਫ਼ਰ ਤੋਂ ਪਿੱਛੇ ਚੱਲੋ। ਹਰ ਸਾਲ ਉਸ ਸਾਲ ਦਾ ਭੁਗਤਾਨ ਵਾਪਸ ਜੋੜੋ ਅਤੇ ਫਿਰ ਉਸੇ ਸਾਲ ਦੇ ਵਿਆਜ ਗੁਣਕ ਨੂੰ ਉਲਟੋ।",
    steps: Object.freeze([
      `ਦਿੱਤਾ ਹੈ: ਲਗਾਤਾਰ ਸਾਲ-ਅੰਤ ਭੁਗਤਾਨ ${state.repayments.map(money).join(", ")} ਅਤੇ ਦਰਾਂ ${state.periodRatesPercent.map(percent).join(", ")}। ਆਖਰੀ ਬਕਾਇਆ ਸਿਫ਼ਰ ਹੈ। ਕੱਢਣਾ ਹੈ: ਸ਼ੁਰੂਆਤੀ ਕਰਜ਼ਾ।`,
      ...reverseLines,
      `ਪਿੱਛੇ ਚੱਲਣ ਤੇ ਸ਼ੁਰੂਆਤੀ ਕਰਜ਼ਾ ${money(answer)} ਮਿਲਦਾ ਹੈ।`,
    ]),
    finalAnswer: money(answer),
  });
}

export function generateIntCp010LocalizedCandidate(
  authorityId: IntCp010CandidateAuthorityId,
  seed: string | number,
  language: IntCp010LocalizationLanguage,
) {
  const source = generateIntCp010ProductionCandidateV2(authorityId, seed) as any;
  const stem = promptFor(source, language);
  const explanation = explanationFor(source, language);
  return deepFreeze({
    ...source,
    localizationCandidateVersion: INT_CP010_LOCALIZATION_CANDIDATE_VERSION,
    language,
    locale: language === "hi" ? "hi-IN" as const : "pa-IN" as const,
    stem,
    explanation,
    maturity: "MULTILINGUAL_AUTHORING_CANDIDATE" as const,
  });
}
