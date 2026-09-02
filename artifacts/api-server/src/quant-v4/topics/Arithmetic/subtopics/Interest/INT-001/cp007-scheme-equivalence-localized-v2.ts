import {
  INT_CP007_ENGLISH_FREEZE_ID,
  generateIntCp007EnglishFrozenQuestion,
} from "./cp007-scheme-equivalence-english-v8-frozen";
import type { IntCp007QlId } from "./cp007-scheme-equivalence-runtime-v3-final";

export const INT_CP007_LOCALIZED_VERSION = "INT-CP-007-HI-PA-v2-native-review" as const;
export const INT_CP007_LOCALIZED_V2_SUPERSEDES = "INT-CP-007-HI-PA-v1-native-review" as const;
export const INT_CP007_LOCALIZED_LOCALES = Object.freeze(["hi-IN", "pa-IN"] as const);
export type IntCp007LocalizedLocale = (typeof INT_CP007_LOCALIZED_LOCALES)[number];

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  return Object.freeze(value);
}

function gcd(a: bigint, b: bigint): bigint {
  let left = a < 0n ? -a : a;
  let right = b < 0n ? -b : b;
  while (right !== 0n) [left, right] = [right, left % right];
  return left;
}

function formatRational(value: any, maximumDecimals = 6): string {
  const n = BigInt(value.numerator);
  const d = BigInt(value.denominator);
  const sign = n < 0n ? "-" : "";
  const numerator = n < 0n ? -n : n;
  const whole = numerator / d;
  let remainder = numerator % d;
  if (remainder === 0n) return `${sign}${whole}`;
  let decimals = "";
  for (let i = 0; i < maximumDecimals && remainder !== 0n; i += 1) {
    remainder *= 10n;
    decimals += (remainder / d).toString();
    remainder %= d;
  }
  if (remainder === 0n) return `${sign}${whole}.${decimals}`;
  const divisor = gcd(numerator, d);
  return `${sign}${numerator / divisor}/${d / divisor}`;
}

function formatMoney(value: any): string {
  if (!value || value.numerator === undefined || value.denominator === undefined) throw new Error("CP007 localized V2 missing required money state");
  const n = BigInt(value.numerator);
  const d = BigInt(value.denominator);
  const paiseNumerator = n * 100n;
  if (paiseNumerator % d !== 0n) return `₹${formatRational(value)}`;
  const paise = paiseNumerator / d;
  const rupees = paise / 100n;
  const remainder = paise % 100n;
  const source = rupees.toString();
  const tail = source.length <= 3 ? source : source.slice(-3);
  let head = source.length <= 3 ? "" : source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) { groups.unshift(head.slice(-2)); head = head.slice(0, -2); }
  if (head) groups.unshift(head);
  const integer = groups.length ? `${groups.join(",")},${tail}` : tail;
  return remainder === 0n ? `₹${integer}` : `₹${integer}.${remainder.toString().padStart(2, "0")}`;
}

const rateText = (value: any): string => `${formatRational(value)}%`;
const yearText = (years: number, locale: IntCp007LocalizedLocale): string => locale === "hi-IN" ? `${years} वर्ष` : `${years} ਸਾਲ`;

function schemeText(scheme: any, locale: IntCp007LocalizedLocale, includeYears = true): string {
  const years = includeYears ? (locale === "hi-IN" ? `, ${yearText(scheme.years, locale)} के लिए` : `, ${yearText(scheme.years, locale)} ਲਈ`) : "";
  if (locale === "hi-IN") {
    if (scheme.method === "SIMPLE") return `${rateText(scheme.annualRatePercent)} वार्षिक साधारण ब्याज${years}`;
    return `${rateText(scheme.annualRatePercent)} वार्षिक चक्रवृद्धि ब्याज (ब्याज हर वर्ष मूलधन में जुड़ता है)${years}`;
  }
  if (scheme.method === "SIMPLE") return `${rateText(scheme.annualRatePercent)} ਸਾਲਾਨਾ ਸਧਾਰਨ ਵਿਆਜ${years}`;
  return `${rateText(scheme.annualRatePercent)} ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ (ਵਿਆਜ ਹਰ ਸਾਲ ਮੂਲ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ)${years}`;
}

function mathSegments(text: string): readonly string[] {
  return Object.freeze(text.match(/\$[^$]+\$/gu) ?? []);
}

function optionText(text: string, locale: IntCp007LocalizedLocale): string {
  if (locale === "hi-IN") {
    if (text === "Scheme A") return "योजना A";
    if (text === "Scheme B") return "योजना B";
    if (text === "Both give the same amount") return "दोनों की राशि समान होगी";
    if (text === "Cannot be determined") return "निर्धारित नहीं किया जा सकता";
    return text.replace(/^(\d+) years$/u, "$1 वर्ष");
  }
  if (text === "Scheme A") return "ਯੋਜਨਾ A";
  if (text === "Scheme B") return "ਯੋਜਨਾ B";
  if (text === "Both give the same amount") return "ਦੋਵਾਂ ਦੀ ਰਕਮ ਬਰਾਬਰ ਹੋਵੇਗੀ";
  if (text === "Cannot be determined") return "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ";
  return text.replace(/^(\d+) years$/u, "$1 ਸਾਲ");
}

function stemFor(source: any, locale: IntCp007LocalizedLocale): string {
  const c = source.mathematicalState.contractState as any;
  const family = Number(String(source.presentation.stemFamilyId).match(/T(\d+)$/u)?.[1] ?? "1");
  const hi = locale === "hi-IN";
  let stems: string[];

  switch (source.qlId as IntCp007QlId) {
    case "INT-QL-109": {
      const p = formatMoney(c.principal), a = schemeText(c.schemeA, locale), b = schemeText(c.schemeB, locale);
      stems = hi ? [
        `${p} को अलग-अलग योजना A (${a}) और योजना B (${b}) में लगाया जाता है। परिपक्वता पर किस योजना की राशि अधिक होगी?`,
        `दोनों योजनाओं में समान मूलधन ${p} लगाया गया है। योजना A में ${a} और योजना B में ${b} मिलता है। परिपक्वता पर अधिक राशि देने वाली योजना चुनिए।`,
        `समान निवेश ${p} के लिए योजना A (${a}) और योजना B (${b}) की तुलना कीजिए। अंत में किसमें अधिक राशि मिलेगी?`,
      ] : [
        `${p} ਨੂੰ ਵੱਖ-ਵੱਖ ਯੋਜਨਾ A (${a}) ਅਤੇ ਯੋਜਨਾ B (${b}) ਵਿੱਚ ਲਗਾਇਆ ਜਾਂਦਾ ਹੈ। ਮਿਆਦ ਪੂਰੀ ਹੋਣ ਤੇ ਕਿਹੜੀ ਯੋਜਨਾ ਦੀ ਰਕਮ ਵੱਧ ਹੋਵੇਗੀ?`,
        `ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਇੱਕੋ ਮੂਲਧਨ ${p} ਲਗਾਇਆ ਗਿਆ ਹੈ। ਯੋਜਨਾ A ਵਿੱਚ ${a} ਅਤੇ ਯੋਜਨਾ B ਵਿੱਚ ${b} ਮਿਲਦਾ ਹੈ। ਮਿਆਦ ਪੂਰੀ ਹੋਣ ਤੇ ਵੱਧ ਰਕਮ ਵਾਲੀ ਯੋਜਨਾ ਚੁਣੋ।`,
        `ਇੱਕੋ ਨਿਵੇਸ਼ ${p} ਲਈ ਯੋਜਨਾ A (${a}) ਅਤੇ ਯੋਜਨਾ B (${b}) ਦੀ ਤੁਲਨਾ ਕਰੋ। ਅੰਤ ਵਿੱਚ ਕਿਹੜੀ ਯੋਜਨਾ ਵੱਧ ਰਕਮ ਦੇਵੇਗੀ?`,
      ]; break;
    }
    case "INT-QL-110": {
      const p = formatMoney(c.principal), a = schemeText(c.schemeA, locale), b = schemeText(c.schemeB, locale);
      stems = hi ? [
        `${p} को योजना A (${a}) और अलग से योजना B (${b}) में लगाया जाता है। दोनों की परिपक्वता राशियों का अंतर ज्ञात कीजिए।`,
        `समान मूलधन ${p} पर योजना A में ${a} तथा योजना B में ${b} मिलता है। अंतिम राशियों में कितना अंतर होगा?`,
        `${p} को दो योजनाओं में तुलना के लिए लगाया गया है: A — ${a}; B — ${b}। परिपक्वता पर मिलने वाली राशियों का निरपेक्ष अंतर ज्ञात कीजिए।`,
      ] : [
        `${p} ਨੂੰ ਯੋਜਨਾ A (${a}) ਅਤੇ ਵੱਖਰੇ ਤੌਰ ਤੇ ਯੋਜਨਾ B (${b}) ਵਿੱਚ ਲਗਾਇਆ ਜਾਂਦਾ ਹੈ। ਦੋਵਾਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਦਾ ਅੰਤਰ ਕੱਢੋ।`,
        `ਇੱਕੋ ਮੂਲਧਨ ${p} ਤੇ ਯੋਜਨਾ A ਵਿੱਚ ${a} ਅਤੇ ਯੋਜਨਾ B ਵਿੱਚ ${b} ਮਿਲਦਾ ਹੈ। ਅੰਤਿਮ ਰਕਮਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੋਵੇਗਾ?`,
        `${p} ਨੂੰ ਦੋ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਤੁਲਨਾ ਲਈ ਲਗਾਇਆ ਗਿਆ ਹੈ: A — ${a}; B — ${b}। ਮਿਆਦ ਪੂਰੀ ਹੋਣ ਤੇ ਮਿਲਣ ਵਾਲੀਆਂ ਰਕਮਾਂ ਦਾ ਨਿਰਪੇਖ ਅੰਤਰ ਕੱਢੋ।`,
      ]; break;
    }
    case "INT-QL-111": {
      const known = schemeText(c.knownScheme, locale);
      const second = c.missingMethod === "SIMPLE"
        ? (hi ? `${yearText(c.missingYears, locale)} के लिए साधारण ब्याज` : `${yearText(c.missingYears, locale)} ਲਈ ਸਧਾਰਨ ਵਿਆਜ`)
        : (hi ? `${yearText(c.missingYears, locale)} के लिए चक्रवृद्धि ब्याज, जिसमें ब्याज हर वर्ष मूलधन में जुड़ता है` : `${yearText(c.missingYears, locale)} ਲਈ ਮਿਸ਼ਰਤ ਵਿਆਜ, ਜਿਸ ਵਿੱਚ ਵਿਆਜ ਹਰ ਸਾਲ ਮੂਲ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ`);
      stems = hi ? [
        `योजना A में ${known} मिलता है। योजना B में ${second} लागू है। समान मूलधन पर दोनों की परिपक्वता राशि बराबर हो, तो योजना B की वार्षिक ब्याज दर ज्ञात कीजिए।`,
        `समान मूलधन को दो योजनाओं में लगाकर समान अंतिम राशि चाहिए। पहली योजना में ${known} मिलता है और दूसरी में ${second} लागू है। दूसरी योजना की आवश्यक वार्षिक दर ज्ञात कीजिए।`,
        `समान मूलधन और समान परिपक्वता राशि के लिए योजना A में ${known} है। योजना B में ${second} है। योजना B की वार्षिक दर ज्ञात कीजिए।`,
      ] : [
        `ਯੋਜਨਾ A ਵਿੱਚ ${known} ਮਿਲਦਾ ਹੈ। ਯੋਜਨਾ B ਵਿੱਚ ${second} ਲਾਗੂ ਹੈ। ਇੱਕੋ ਮੂਲਧਨ ਤੋਂ ਦੋਵਾਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਬਰਾਬਰ ਹੋਵੇ, ਤਾਂ ਯੋਜਨਾ B ਦੀ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਕੱਢੋ।`,
        `ਇੱਕੋ ਮੂਲਧਨ ਨੂੰ ਦੋ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਲਗਾ ਕੇ ਇੱਕੋ ਅੰਤਿਮ ਰਕਮ ਚਾਹੀਦੀ ਹੈ। ਪਹਿਲੀ ਯੋਜਨਾ ਵਿੱਚ ${known} ਮਿਲਦਾ ਹੈ ਅਤੇ ਦੂਜੀ ਵਿੱਚ ${second} ਲਾਗੂ ਹੈ। ਦੂਜੀ ਯੋਜਨਾ ਦੀ ਲੋੜੀਂਦੀ ਸਾਲਾਨਾ ਦਰ ਕੱਢੋ।`,
        `ਇੱਕੋ ਮੂਲਧਨ ਅਤੇ ਬਰਾਬਰ ਮਿਆਦੀ ਰਕਮ ਲਈ ਯੋਜਨਾ A ਵਿੱਚ ${known} ਹੈ। ਯੋਜਨਾ B ਵਿੱਚ ${second} ਹੈ। ਯੋਜਨਾ B ਦੀ ਸਾਲਾਨਾ ਦਰ ਕੱਢੋ।`,
      ]; break;
    }
    case "INT-QL-112": {
      const total = formatMoney(c.totalPrincipal), a = schemeText(c.schemeA, locale), b = schemeText(c.schemeB, locale);
      stems = hi ? [
        `कुल ${total} को योजना A (${a}) और योजना B (${b}) में इस प्रकार बाँटना है कि दोनों हिस्सों की परिपक्वता राशि समान हो। योजना A में कितनी राशि लगानी चाहिए?`,
        `${total} को दो निवेशों में बाँटना है। पहला निवेश ${a} और दूसरा ${b} कमाता है। यदि दोनों की भविष्य राशि समान होनी है, तो पहले निवेश की राशि ज्ञात कीजिए।`,
        `${total} को योजना A (${a}) और योजना B (${b}) में बाँटिए ताकि दोनों की परिपक्वता राशि समान हो। योजना A की प्रारंभिक राशि ज्ञात कीजिए।`,
      ] : [
        `ਕੁੱਲ ${total} ਨੂੰ ਯੋਜਨਾ A (${a}) ਅਤੇ ਯੋਜਨਾ B (${b}) ਵਿੱਚ ਇਸ ਤਰ੍ਹਾਂ ਵੰਡਣਾ ਹੈ ਕਿ ਦੋਵਾਂ ਹਿੱਸਿਆਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਬਰਾਬਰ ਹੋਵੇ। ਯੋਜਨਾ A ਵਿੱਚ ਕਿੰਨੀ ਰਕਮ ਲਗਾਉਣੀ ਚਾਹੀਦੀ ਹੈ?`,
        `${total} ਨੂੰ ਦੋ ਨਿਵੇਸ਼ਾਂ ਵਿੱਚ ਵੰਡਣਾ ਹੈ। ਪਹਿਲੇ ਨਿਵੇਸ਼ ਨੂੰ ${a} ਅਤੇ ਦੂਜੇ ਨੂੰ ${b} ਮਿਲਦਾ ਹੈ। ਜੇ ਦੋਵਾਂ ਦੀ ਭਵਿੱਖੀ ਰਕਮ ਬਰਾਬਰ ਹੋਣੀ ਹੈ, ਤਾਂ ਪਹਿਲੇ ਨਿਵੇਸ਼ ਦੀ ਰਕਮ ਕੱਢੋ।`,
        `${total} ਨੂੰ ਯੋਜਨਾ A (${a}) ਅਤੇ ਯੋਜਨਾ B (${b}) ਵਿੱਚ ਵੰਡੋ ਤਾਂ ਕਿ ਦੋਵਾਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਬਰਾਬਰ ਹੋਵੇ। ਯੋਜਨਾ A ਦੀ ਸ਼ੁਰੂਆਤੀ ਰਕਮ ਕੱਢੋ।`,
      ]; break;
    }
    case "INT-QL-113": {
      const a = schemeText(c.schemeA, locale), b = schemeText(c.schemeB, locale);
      stems = hi ? [
        `दो प्रारंभिक मूलधन योजना A (${a}) और योजना B (${b}) में लगाए जाते हैं। यदि दोनों की परिपक्वता राशि समान है, तो मूलधन A : मूलधन B का आवश्यक अनुपात ज्ञात कीजिए।`,
        `योजना A में ${a} और योजना B में ${b} है। परिपक्वता पर दोनों राशियाँ समान हों, तो दोनों प्रारंभिक निवेशों का अनुपात क्या होना चाहिए?`,
        `योजना A (${a}) और योजना B (${b}) की भविष्य राशियाँ समान होनी हैं। प्रारंभिक निवेश A:B का अनुपात ज्ञात कीजिए।`,
      ] : [
        `ਦੋ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ਯੋਜਨਾ A (${a}) ਅਤੇ ਯੋਜਨਾ B (${b}) ਵਿੱਚ ਲਗਾਏ ਜਾਂਦੇ ਹਨ। ਜੇ ਦੋਵਾਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਬਰਾਬਰ ਹੈ, ਤਾਂ ਮੂਲਧਨ A : ਮੂਲਧਨ B ਦਾ ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`,
        `ਯੋਜਨਾ A ਵਿੱਚ ${a} ਅਤੇ ਯੋਜਨਾ B ਵਿੱਚ ${b} ਹੈ। ਮਿਆਦ ਪੂਰੀ ਹੋਣ ਤੇ ਦੋਵਾਂ ਰਕਮਾਂ ਬਰਾਬਰ ਹੋਣ, ਤਾਂ ਦੋਵਾਂ ਸ਼ੁਰੂਆਤੀ ਨਿਵੇਸ਼ਾਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ?`,
        `ਯੋਜਨਾ A (${a}) ਅਤੇ ਯੋਜਨਾ B (${b}) ਦੀਆਂ ਭਵਿੱਖੀ ਰਕਮਾਂ ਬਰਾਬਰ ਹੋਣੀਆਂ ਹਨ। ਸ਼ੁਰੂਆਤੀ ਨਿਵੇਸ਼ A:B ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`,
      ]; break;
    }
    case "INT-QL-114": {
      const a = schemeText(c.initiallyHigherScheme, locale, false), b = schemeText(c.overtakingScheme, locale, false);
      stems = hi ? [
        `समान मूलधन दो लगातार चलने वाली वार्षिक योजनाओं में लगाया गया है। योजना A में ${a} और योजना B में ${b} मिलता है। कितने पूरे वर्षों बाद योजना B पहली बार योजना A से अधिक राशि देगी?`,
        `दोनों योजनाएँ समान मूलधन से शुरू होती हैं। योजना A में ${a} और योजना B में ${b} है। वह पहला पूरा वर्ष ज्ञात कीजिए जब योजना B की संचित राशि योजना A से अधिक हो जाती है।`,
        `दो समान राशियाँ एक ही समय से बढ़ती हैं। A में ${a} और B में ${b} है। सबसे पहला पूरा वर्ष ज्ञात कीजिए जब B की संचित राशि A से अधिक हो जाए।`,
      ] : [
        `ਇੱਕੋ ਮੂਲਧਨ ਦੋ ਲਗਾਤਾਰ ਸਾਲਾਨਾ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਲਗਾਇਆ ਗਿਆ ਹੈ। ਯੋਜਨਾ A ਵਿੱਚ ${a} ਅਤੇ ਯੋਜਨਾ B ਵਿੱਚ ${b} ਮਿਲਦਾ ਹੈ। ਕਿੰਨੇ ਪੂਰੇ ਸਾਲਾਂ ਬਾਅਦ ਯੋਜਨਾ B ਪਹਿਲੀ ਵਾਰ ਯੋਜਨਾ A ਤੋਂ ਵੱਧ ਰਕਮ ਦੇਵੇਗੀ?`,
        `ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਇੱਕੋ ਮੂਲਧਨ ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦੀਆਂ ਹਨ। ਯੋਜਨਾ A ਵਿੱਚ ${a} ਅਤੇ ਯੋਜਨਾ B ਵਿੱਚ ${b} ਹੈ। ਉਹ ਪਹਿਲਾ ਪੂਰਾ ਸਾਲ ਕੱਢੋ ਜਦੋਂ ਯੋਜਨਾ B ਦੀ ਇਕੱਠੀ ਰਕਮ ਯੋਜਨਾ A ਤੋਂ ਵੱਧ ਹੋ ਜਾਂਦੀ ਹੈ।`,
        `ਦੋ ਬਰਾਬਰ ਰਕਮਾਂ ਇੱਕੋ ਸਮੇਂ ਤੋਂ ਵਧਦੀਆਂ ਹਨ। A ਵਿੱਚ ${a} ਅਤੇ B ਵਿੱਚ ${b} ਹੈ। ਸਭ ਤੋਂ ਪਹਿਲਾ ਪੂਰਾ ਸਾਲ ਕੱਢੋ ਜਦੋਂ B ਦੀ ਇਕੱਠੀ ਰਕਮ A ਤੋਂ ਵੱਧ ਹੋ ਜਾਵੇ।`,
      ]; break;
    }
    case "INT-QL-115": {
      const known = formatMoney(c.knownPrincipal), a = schemeText(c.knownScheme, locale), b = schemeText(c.missingScheme, locale);
      stems = hi ? [
        `${known} को योजना A (${a}) में लगाया गया है। योजना B (${b}) में कितनी राशि लगानी होगी ताकि दोनों की परिपक्वता राशि समान हो?`,
        `योजना A में प्रारंभिक राशि ${known} है और उस पर ${a} लागू है। योजना B में ${b} है। योजना B में शुरुआत में कितनी राशि लगाएँ ताकि दोनों की भविष्य राशि समान हो?`,
        `${known} का निवेश ${a} के अनुसार बढ़ता है। ${b} वाली योजना में कितनी राशि लगानी चाहिए ताकि वही परिपक्वता राशि मिले?`,
      ] : [
        `${known} ਨੂੰ ਯੋਜਨਾ A (${a}) ਵਿੱਚ ਲਗਾਇਆ ਗਿਆ ਹੈ। ਯੋਜਨਾ B (${b}) ਵਿੱਚ ਕਿੰਨੀ ਰਕਮ ਲਗਾਉਣੀ ਪਵੇਗੀ ਤਾਂ ਕਿ ਦੋਵਾਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਬਰਾਬਰ ਹੋਵੇ?`,
        `ਯੋਜਨਾ A ਵਿੱਚ ਸ਼ੁਰੂਆਤੀ ਰਕਮ ${known} ਹੈ ਅਤੇ ਇਸ ਤੇ ${a} ਲਾਗੂ ਹੈ। ਯੋਜਨਾ B ਵਿੱਚ ${b} ਹੈ। ਯੋਜਨਾ B ਵਿੱਚ ਸ਼ੁਰੂ ਵਿੱਚ ਕਿੰਨੀ ਰਕਮ ਲਗਾਈਏ ਤਾਂ ਕਿ ਦੋਵਾਂ ਦੀ ਭਵਿੱਖੀ ਰਕਮ ਬਰਾਬਰ ਹੋਵੇ?`,
        `${known} ਦਾ ਨਿਵੇਸ਼ ${a} ਅਨੁਸਾਰ ਵਧਦਾ ਹੈ। ${b} ਵਾਲੀ ਯੋਜਨਾ ਵਿੱਚ ਕਿੰਨੀ ਰਕਮ ਲਗਾਉਣੀ ਚਾਹੀਦੀ ਹੈ ਤਾਂ ਕਿ ਉਹੀ ਮਿਆਦੀ ਰਕਮ ਮਿਲੇ?`,
      ]; break;
    }
  }
  return stems![(family - 1) % 3]!;
}

type ExplanationContent = { keyIdea: string; steps: string[]; commonMistake: string };

function explanationFor(source: any, locale: IntCp007LocalizedLocale) {
  const hi = locale === "hi-IN";
  const ql = source.qlId as IntCp007QlId;
  const c = source.mathematicalState.contractState as any;
  const m = (index: number) => mathSegments(source.explanation.steps[index] ?? "");
  const need = (index: number, position = 0): string => {
    const value = m(index)[position];
    if (!value) throw new Error(`${ql}/${source.seed}: missing approved English math segment at step ${index}, position ${position}`);
    return value;
  };
  const last = (index: number): string => {
    const values = m(index);
    const value = values.at(-1);
    if (!value) throw new Error(`${ql}/${source.seed}: missing approved English math segment at step ${index}`);
    return value;
  };
  const joined = (index: number, joiner: string): string => {
    const values = m(index);
    if (!values.length) throw new Error(`${ql}/${source.seed}: missing approved English math segments at step ${index}`);
    return values.join(joiner);
  };
  const correct = optionText(source.correctAnswer, locale);
  let content: ExplanationContent;

  switch (ql) {
    case "INT-QL-109":
      content = {
        keyIdea: hi ? "दोनों योजनाओं का मूलधन समान है। पहले प्रत्येक योजना का वृद्धि गुणक निकालें, फिर परिपक्वता राशि निकालकर तुलना करें।" : "ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਦਾ ਮੂਲਧਨ ਇੱਕੋ ਹੈ। ਪਹਿਲਾਂ ਹਰ ਯੋਜਨਾ ਦਾ ਵਾਧਾ ਗੁਣਕ ਕੱਢੋ, ਫਿਰ ਮਿਆਦੀ ਰਕਮ ਕੱਢ ਕੇ ਤੁਲਨਾ ਕਰੋ।",
        steps: hi ? [
          `दोनों योजनाओं में शुरुआती मूलधन ${formatMoney(c.principal)} है; हमें अधिक परिपक्वता राशि वाली योजना चुननी है।`,
          `योजना A का वृद्धि गुणक ${need(1)} है।`,
          `इसलिए योजना A की परिपक्वता राशि ${need(2)} है।`,
          `योजना B का वृद्धि गुणक ${need(3)} है।`,
          `योजना B की परिपक्वता राशि ${need(4)} है। तुलना से ${correct} अधिक राशि देती है।`,
        ] : [
          `ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ${formatMoney(c.principal)} ਹੈ; ਸਾਨੂੰ ਵੱਧ ਮਿਆਦੀ ਰਕਮ ਵਾਲੀ ਯੋਜਨਾ ਚੁਣਨੀ ਹੈ।`,
          `ਯੋਜਨਾ A ਦਾ ਵਾਧਾ ਗੁਣਕ ${need(1)} ਹੈ।`,
          `ਇਸ ਲਈ ਯੋਜਨਾ A ਦੀ ਮਿਆਦੀ ਰਕਮ ${need(2)} ਹੈ।`,
          `ਯੋਜਨਾ B ਦਾ ਵਾਧਾ ਗੁਣਕ ${need(3)} ਹੈ।`,
          `ਯੋਜਨਾ B ਦੀ ਮਿਆਦੀ ਰਕਮ ${need(4)} ਹੈ। ਤੁਲਨਾ ਤੋਂ ${correct} ਵੱਧ ਰਕਮ ਦਿੰਦੀ ਹੈ।`,
        ],
        commonMistake: hi ? "केवल वार्षिक ब्याज दरों की तुलना न करें। साधारण और चक्रवृद्धि ब्याज समान दिखने वाली दरों पर भी अलग परिपक्वता राशि दे सकते हैं।" : "ਕੇਵਲ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰਾਂ ਦੀ ਤੁਲਨਾ ਨਾ ਕਰੋ। ਸਧਾਰਨ ਅਤੇ ਮਿਸ਼ਰਤ ਵਿਆਜ ਇੱਕੋ ਜਿਹੀਆਂ ਲੱਗਣ ਵਾਲੀਆਂ ਦਰਾਂ ਤੇ ਵੀ ਵੱਖਰੀ ਮਿਆਦੀ ਰਕਮ ਦੇ ਸਕਦੇ ਹਨ।",
      }; break;
    case "INT-QL-110":
      content = {
        keyIdea: hi ? "दोनों योजनाओं की परिपक्वता राशि अलग-अलग निकालें। उत्तर दोनों अंतिम राशियों का धनात्मक अंतर है।" : "ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਵੱਖ-ਵੱਖ ਕੱਢੋ। ਉੱਤਰ ਦੋਵਾਂ ਅੰਤਿਮ ਰਕਮਾਂ ਦਾ ਧਨਾਤਮਕ ਅੰਤਰ ਹੈ।",
        steps: hi ? [
          `दोनों योजनाओं में समान मूलधन ${formatMoney(c.principal)} है और हमें उनकी परिपक्वता राशियों का अंतर निकालना है।`,
          `योजना A के लिए ${need(1, 0)} और परिपक्वता राशि ${need(1, 1)} है।`,
          `योजना B के लिए ${need(2, 0)} और परिपक्वता राशि ${need(2, 1)} है।`,
          `दोनों राशियों का निरपेक्ष अंतर ${need(3)} है।`,
          `अतः अंतर ${correct} है।`,
        ] : [
          `ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਇੱਕੋ ਮੂਲਧਨ ${formatMoney(c.principal)} ਹੈ ਅਤੇ ਸਾਨੂੰ ਉਹਨਾਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਦਾ ਅੰਤਰ ਕੱਢਣਾ ਹੈ।`,
          `ਯੋਜਨਾ A ਲਈ ${need(1, 0)} ਅਤੇ ਮਿਆਦੀ ਰਕਮ ${need(1, 1)} ਹੈ।`,
          `ਯੋਜਨਾ B ਲਈ ${need(2, 0)} ਅਤੇ ਮਿਆਦੀ ਰਕਮ ${need(2, 1)} ਹੈ।`,
          `ਦੋਵਾਂ ਰਕਮਾਂ ਦਾ ਨਿਰਪੇਖ ਅੰਤਰ ${need(3)} ਹੈ।`,
          `ਇਸ ਲਈ ਅੰਤਰ ${correct} ਹੈ।`,
        ],
        commonMistake: hi ? "दोनों दरों का अंतर सीधे मूलधन पर लागू न करें। पहले दोनों परिपक्वता राशियाँ निकालें, फिर घटाएँ।" : "ਦੋਵਾਂ ਦਰਾਂ ਦਾ ਅੰਤਰ ਸਿੱਧਾ ਮੂਲਧਨ ਤੇ ਲਾਗੂ ਨਾ ਕਰੋ। ਪਹਿਲਾਂ ਦੋਵਾਂ ਮਿਆਦੀ ਰਕਮਾਂ ਕੱਢੋ, ਫਿਰ ਘਟਾਓ।",
      }; break;
    case "INT-QL-111":
      content = {
        keyIdea: hi ? "समान मूलधन और समान परिपक्वता राशि के लिए दोनों योजनाओं के वृद्धि गुणक समान होने चाहिए। उसी समानता से दूसरी योजना की दर निकालें।" : "ਇੱਕੋ ਮੂਲਧਨ ਅਤੇ ਬਰਾਬਰ ਮਿਆਦੀ ਰਕਮ ਲਈ ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਦੇ ਵਾਧਾ ਗੁਣਕ ਬਰਾਬਰ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ। ਉਸੇ ਬਰਾਬਰੀ ਤੋਂ ਦੂਜੀ ਯੋਜਨਾ ਦੀ ਦਰ ਕੱਢੋ।",
        steps: hi ? [
          "दोनों योजनाएँ समान मूलधन से शुरू होती हैं, इसलिए आवश्यक दर ऐसी होनी चाहिए जिससे उनकी परिपक्वता राशि बराबर हो।",
          `ज्ञात योजना का वृद्धि गुणक ${need(1, 0)} है; दूसरी योजना को भी यही लक्ष्य गुणक देना होगा।`,
          `दूसरी योजना के लिए समीकरण ${need(2, 0)} है।`,
          `सरल करने पर ${joined(3, " और ")} मिलता है।`,
          `इससे ${joined(4, " और ")} मिलता है; यही आवश्यक वार्षिक दर है।`,
          `जाँच में दूसरी योजना का गुणक ${last(5)} आता है, जो लक्ष्य गुणक के बराबर है।`,
        ] : [
          "ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਇੱਕੋ ਮੂਲਧਨ ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦੀਆਂ ਹਨ, ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਦਰ ਐਸੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ ਜਿਸ ਨਾਲ ਉਹਨਾਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਬਰਾਬਰ ਹੋਵੇ।",
          `ਜਾਣੀ ਹੋਈ ਯੋਜਨਾ ਦਾ ਵਾਧਾ ਗੁਣਕ ${need(1, 0)} ਹੈ; ਦੂਜੀ ਯੋਜਨਾ ਨੂੰ ਵੀ ਇਹੀ ਟੀਚਾ ਗੁਣਕ ਦੇਣਾ ਪਵੇਗਾ।`,
          `ਦੂਜੀ ਯੋਜਨਾ ਲਈ ਸਮੀਕਰਨ ${need(2, 0)} ਹੈ।`,
          `ਸੌਖਾ ਕਰਨ ਤੇ ${joined(3, " ਅਤੇ ")} ਮਿਲਦਾ ਹੈ।`,
          `ਇਸ ਤੋਂ ${joined(4, " ਅਤੇ ")} ਮਿਲਦਾ ਹੈ; ਇਹੀ ਲੋੜੀਂਦੀ ਸਾਲਾਨਾ ਦਰ ਹੈ।`,
          `ਜਾਂਚ ਵਿੱਚ ਦੂਜੀ ਯੋਜਨਾ ਦਾ ਗੁਣਕ ${last(5)} ਆਉਂਦਾ ਹੈ, ਜੋ ਟੀਚਾ ਗੁਣਕ ਦੇ ਬਰਾਬਰ ਹੈ।`,
        ],
        commonMistake: hi ? "ज्ञात योजना की वार्षिक दर को सीधे उत्तर न मानें। तरीका या अवधि बदलने पर वृद्धि गुणक बराबर करके दर निकालनी होती है।" : "ਜਾਣੀ ਹੋਈ ਯੋਜਨਾ ਦੀ ਸਾਲਾਨਾ ਦਰ ਨੂੰ ਸਿੱਧਾ ਉੱਤਰ ਨਾ ਮੰਨੋ। ਤਰੀਕਾ ਜਾਂ ਸਮਾਂ ਬਦਲਣ ਤੇ ਵਾਧਾ ਗੁਣਕ ਬਰਾਬਰ ਕਰਕੇ ਦਰ ਕੱਢਣੀ ਪੈਂਦੀ ਹੈ।",
      }; break;
    case "INT-QL-112":
      content = {
        keyIdea: hi ? "योजना A की शुरुआती राशि को x मानें; शेष राशि योजना B में जाएगी। दोनों की परिपक्वता राशि बराबर रखकर x निकालें।" : "ਯੋਜਨਾ A ਦੀ ਸ਼ੁਰੂਆਤੀ ਰਕਮ x ਮੰਨੋ; ਬਾਕੀ ਰਕਮ ਯੋਜਨਾ B ਵਿੱਚ ਜਾਵੇਗੀ। ਦੋਵਾਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਬਰਾਬਰ ਰੱਖ ਕੇ x ਕੱਢੋ।",
        steps: hi ? [
          `कुल राशि ${formatMoney(c.totalPrincipal)} है। योजना A में $x$ मानें; शेष योजना B में जाएगा।`,
          `योजना A और B के वृद्धि गुणक क्रमशः ${need(1, 0)} और ${need(1, 1)} हैं।`,
          `समान परिपक्वता राशि के लिए ${need(2, 0)}।`,
          `हल करने पर ${need(3, 0)}। इससे योजना A की शुरुआती राशि मिलती है।`,
          `अतः योजना A में ${correct} लगाना चाहिए।`,
        ] : [
          `ਕੁੱਲ ਰਕਮ ${formatMoney(c.totalPrincipal)} ਹੈ। ਯੋਜਨਾ A ਵਿੱਚ $x$ ਮੰਨੋ; ਬਾਕੀ ਯੋਜਨਾ B ਵਿੱਚ ਜਾਵੇਗੀ।`,
          `ਯੋਜਨਾ A ਅਤੇ B ਦੇ ਵਾਧਾ ਗੁਣਕ ਕ੍ਰਮਵਾਰ ${need(1, 0)} ਅਤੇ ${need(1, 1)} ਹਨ।`,
          `ਬਰਾਬਰ ਮਿਆਦੀ ਰਕਮ ਲਈ ${need(2, 0)}।`,
          `ਹੱਲ ਕਰਨ ਤੇ ${need(3, 0)}। ਇਸ ਤੋਂ ਯੋਜਨਾ A ਦੀ ਸ਼ੁਰੂਆਤੀ ਰਕਮ ਮਿਲਦੀ ਹੈ।`,
          `ਇਸ ਲਈ ਯੋਜਨਾ A ਵਿੱਚ ${correct} ਲਗਾਉਣਾ ਚਾਹੀਦਾ ਹੈ।`,
        ],
        commonMistake: hi ? "कुल राशि को बराबर-बराबर न बाँटें। अलग वृद्धि गुणक होने पर बराबर भविष्य राशि के लिए शुरुआती राशियाँ अलग होंगी।" : "ਕੁੱਲ ਰਕਮ ਨੂੰ ਬਰਾਬਰ-ਬਰਾਬਰ ਨਾ ਵੰਡੋ। ਵੱਖਰੇ ਵਾਧਾ ਗੁਣਕ ਹੋਣ ਤੇ ਬਰਾਬਰ ਭਵਿੱਖੀ ਰਕਮ ਲਈ ਸ਼ੁਰੂਆਤੀ ਰਕਮਾਂ ਵੱਖਰੀਆਂ ਹੋਣਗੀਆਂ।",
      }; break;
    case "INT-QL-113":
      content = {
        keyIdea: hi ? "समान परिपक्वता राशि के लिए दोनों शुरुआती मूलधनों और उनके वृद्धि गुणकों के गुणनफल बराबर होंगे। इसलिए मूलधनों का अनुपात वृद्धि गुणकों के उलटे अनुपात में होगा।" : "ਬਰਾਬਰ ਮਿਆਦੀ ਰਕਮ ਲਈ ਦੋਵਾਂ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨਾਂ ਅਤੇ ਉਹਨਾਂ ਦੇ ਵਾਧਾ ਗੁਣਕਾਂ ਦੇ ਗੁਣਨਫਲ ਬਰਾਬਰ ਹੋਣਗੇ। ਇਸ ਲਈ ਮੂਲਧਨਾਂ ਦਾ ਅਨੁਪਾਤ ਵਾਧਾ ਗੁਣਕਾਂ ਦੇ ਉਲਟ ਅਨੁਪਾਤ ਵਿੱਚ ਹੋਵੇਗਾ।",
        steps: hi ? [
          "दोनों शुरुआती मूलधनों को अलग चर मानें। उनकी परिपक्वता राशि समान होनी चाहिए।",
          `योजना A और B के वृद्धि गुणक ${need(1, 0)} और ${need(1, 1)} हैं।`,
          `समान परिपक्वता राशि से ${need(2, 0)}।`,
          `अतः ${need(3, 0)}।`,
          `इसलिए ${need(4, 0)}। यही आवश्यक अनुपात है।`,
        ] : [
          "ਦੋਵਾਂ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨਾਂ ਨੂੰ ਵੱਖਰੇ ਚਲ ਮੰਨੋ। ਉਹਨਾਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਬਰਾਬਰ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।",
          `ਯੋਜਨਾ A ਅਤੇ B ਦੇ ਵਾਧਾ ਗੁਣਕ ${need(1, 0)} ਅਤੇ ${need(1, 1)} ਹਨ।`,
          `ਬਰਾਬਰ ਮਿਆਦੀ ਰਕਮ ਤੋਂ ${need(2, 0)}।`,
          `ਇਸ ਲਈ ${need(3, 0)}।`,
          `ਅਤੇ ਇਸ ਕਰਕੇ ${need(4, 0)}। ਇਹੀ ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ ਹੈ।`,
        ],
        commonMistake: hi ? "केवल वार्षिक ब्याज दरों का अनुपात न लें। आवश्यक मूलधन अनुपात पूरे वृद्धि गुणकों के उलटे अनुपात से आता है।" : "ਕੇਵਲ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰਾਂ ਦਾ ਅਨੁਪਾਤ ਨਾ ਲਓ। ਲੋੜੀਂਦਾ ਮੂਲਧਨ ਅਨੁਪਾਤ ਪੂਰੇ ਵਾਧਾ ਗੁਣਕਾਂ ਦੇ ਉਲਟ ਅਨੁਪਾਤ ਤੋਂ ਆਉਂਦਾ ਹੈ।",
      }; break;
    case "INT-QL-114":
      content = {
        keyIdea: hi ? "पहला आगे निकलने वाला वर्ष साबित करने के लिए लगातार दो पूरे वर्षों की जाँच करें: पिछले वर्ष B आगे नहीं हो और चुने वर्ष में B आगे हो।" : "ਪਹਿਲੀ ਵਾਰ ਅੱਗੇ ਨਿਕਲਣ ਵਾਲਾ ਸਾਲ ਸਾਬਤ ਕਰਨ ਲਈ ਲਗਾਤਾਰ ਦੋ ਪੂਰੇ ਸਾਲ ਜਾਂਚੋ: ਪਿਛਲੇ ਸਾਲ B ਅੱਗੇ ਨਾ ਹੋਵੇ ਅਤੇ ਚੁਣੇ ਸਾਲ ਵਿੱਚ B ਅੱਗੇ ਹੋਵੇ।",
        steps: hi ? [
          "दोनों योजनाएँ समान मूलधन से शुरू होती हैं, इसलिए उनके वृद्धि गुणकों की तुलना पर्याप्त है।",
          `पिछले पूरे वर्ष पर A और B के गुणक ${need(1, 0)} और ${need(1, 1)} हैं; यहाँ B आगे नहीं है।`,
          `अगले पूरे वर्ष पर A और B के गुणक ${need(2, 0)} और ${need(2, 1)} हैं।`,
          `तुलना ${need(3, 0)} से ${need(3, 1)} में बदलती है; इसलिए इसी वर्ष B पहली बार आगे निकलती है।`,
          `अतः उत्तर ${correct} है।`,
        ] : [
          "ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਇੱਕੋ ਮੂਲਧਨ ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦੀਆਂ ਹਨ, ਇਸ ਲਈ ਉਹਨਾਂ ਦੇ ਵਾਧਾ ਗੁਣਕਾਂ ਦੀ ਤੁਲਨਾ ਕਾਫੀ ਹੈ।",
          `ਪਿਛਲੇ ਪੂਰੇ ਸਾਲ ਤੇ A ਅਤੇ B ਦੇ ਗੁਣਕ ${need(1, 0)} ਅਤੇ ${need(1, 1)} ਹਨ; ਇੱਥੇ B ਅੱਗੇ ਨਹੀਂ ਹੈ।`,
          `ਅਗਲੇ ਪੂਰੇ ਸਾਲ ਤੇ A ਅਤੇ B ਦੇ ਗੁਣਕ ${need(2, 0)} ਅਤੇ ${need(2, 1)} ਹਨ।`,
          `ਤੁਲਨਾ ${need(3, 0)} ਤੋਂ ${need(3, 1)} ਵਿੱਚ ਬਦਲਦੀ ਹੈ; ਇਸ ਲਈ ਇਸੇ ਸਾਲ B ਪਹਿਲੀ ਵਾਰ ਅੱਗੇ ਨਿਕਲਦੀ ਹੈ।`,
          `ਇਸ ਲਈ ਉੱਤਰ ${correct} ਹੈ।`,
        ],
        commonMistake: hi ? "कोई बाद का वर्ष केवल इसलिए न चुनें कि वहाँ B बड़ी है। पहले आगे निकलने का वर्ष सिद्ध करने के लिए ठीक पिछले पूरे वर्ष की भी जाँच करें।" : "ਕੋਈ ਬਾਅਦਲਾ ਸਾਲ ਸਿਰਫ਼ ਇਸ ਲਈ ਨਾ ਚੁਣੋ ਕਿ ਉੱਥੇ B ਵੱਡੀ ਹੈ। ਪਹਿਲੀ ਵਾਰ ਅੱਗੇ ਨਿਕਲਣ ਦਾ ਸਾਲ ਸਾਬਤ ਕਰਨ ਲਈ ਠੀਕ ਪਿਛਲੇ ਪੂਰੇ ਸਾਲ ਦੀ ਵੀ ਜਾਂਚ ਕਰੋ।",
      }; break;
    case "INT-QL-115":
      content = {
        keyIdea: hi ? "पहले ज्ञात शुरुआती मूलधन से मिलने वाली परिपक्वता राशि निकालें। फिर उस लक्ष्य राशि को दूसरी योजना के वृद्धि गुणक से भाग देकर आवश्यक शुरुआती मूलधन निकालें।" : "ਪਹਿਲਾਂ ਜਾਣੇ ਹੋਏ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ਤੋਂ ਮਿਲਣ ਵਾਲੀ ਮਿਆਦੀ ਰਕਮ ਕੱਢੋ। ਫਿਰ ਉਸ ਟੀਚਾ ਰਕਮ ਨੂੰ ਦੂਜੀ ਯੋਜਨਾ ਦੇ ਵਾਧਾ ਗੁਣਕ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਲੋੜੀਂਦਾ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ਕੱਢੋ।",
        steps: hi ? [
          `ज्ञात शुरुआती मूलधन ${formatMoney(c.knownPrincipal)} है और दोनों योजनाओं की परिपक्वता राशि समान होनी है।`,
          `ज्ञात योजना का वृद्धि गुणक ${need(1, 0)} है, इसलिए उसकी परिपक्वता राशि ${need(1, 1)} है।`,
          `दूसरी योजना का वृद्धि गुणक ${need(2, 0)} है।`,
          `यदि दूसरी योजना का शुरुआती मूलधन $P$ है, तो ${need(3, 0)} और इसलिए ${last(3)}।`,
          `जाँच से दोनों योजनाएँ समान परिपक्वता राशि देती हैं। अतः आवश्यक शुरुआती मूलधन ${correct} है।`,
        ] : [
          `ਜਾਣਿਆ ਹੋਇਆ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ${formatMoney(c.knownPrincipal)} ਹੈ ਅਤੇ ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਬਰਾਬਰ ਹੋਣੀ ਹੈ।`,
          `ਜਾਣੀ ਹੋਈ ਯੋਜਨਾ ਦਾ ਵਾਧਾ ਗੁਣਕ ${need(1, 0)} ਹੈ, ਇਸ ਲਈ ਉਸਦੀ ਮਿਆਦੀ ਰਕਮ ${need(1, 1)} ਹੈ।`,
          `ਦੂਜੀ ਯੋਜਨਾ ਦਾ ਵਾਧਾ ਗੁਣਕ ${need(2, 0)} ਹੈ।`,
          `ਜੇ ਦੂਜੀ ਯੋਜਨਾ ਦਾ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ $P$ ਹੈ, ਤਾਂ ${need(3, 0)} ਅਤੇ ਇਸ ਲਈ ${last(3)}।`,
          `ਜਾਂਚ ਤੋਂ ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਇੱਕੋ ਮਿਆਦੀ ਰਕਮ ਦਿੰਦੀਆਂ ਹਨ। ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ${correct} ਹੈ।`,
        ],
        commonMistake: hi ? "यह न मानें कि दोनों योजनाओं में समान शुरुआती मूलधन चाहिए। अलग वृद्धि गुणक होने पर समान भविष्य राशि के लिए शुरुआती मूलधन अलग होंगे।" : "ਇਹ ਨਾ ਮੰਨੋ ਕਿ ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਇੱਕੋ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ਚਾਹੀਦਾ ਹੈ। ਵੱਖਰੇ ਵਾਧਾ ਗੁਣਕ ਹੋਣ ਤੇ ਇੱਕੋ ਭਵਿੱਖੀ ਰਕਮ ਲਈ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ਵੱਖਰੇ ਹੋਣਗੇ।",
      }; break;
  }

  return deepFreeze({ keyIdea: content!.keyIdea, steps: Object.freeze(content!.steps), finalAnswer: correct, commonMistake: content!.commonMistake });
}

export function generateIntCp007LocalizedReviewQuestion(qlId: IntCp007QlId, seed: string, locale: IntCp007LocalizedLocale) {
  const source = generateIntCp007EnglishFrozenQuestion(qlId, seed, "en-IN") as any;
  if (source.freezeId !== INT_CP007_ENGLISH_FREEZE_ID || !source.learnerContentFrozen) throw new Error(`${qlId}/${seed}: localization source is not the approved frozen English authority`);
  const localizedOptions = source.options.map((option: any) => deepFreeze({ ...option, text: optionText(option.text, locale) }));
  const correctAnswer = localizedOptions[source.correctIndex]!.text;
  const markdown = stemFor(source, locale);
  const explanation = explanationFor(source, locale);
  const { freezeId: sourceEnglishFreezeId, freezeApproval: sourceEnglishFreezeApproval, editorialStatus: _a, approvalStatus: _b, allocationStatus: _c, learnerContentFrozen: _d, ...base } = source;

  return deepFreeze({
    ...base,
    locale,
    presentation: deepFreeze({ ...source.presentation, markdown, prompt: markdown }),
    options: Object.freeze(localizedOptions),
    correctAnswer,
    explanation,
    localizedVersion: INT_CP007_LOCALIZED_VERSION,
    sourceEnglishFreezeId,
    sourceEnglishFreezeApproval,
    editorialStatus: "MULTILINGUAL_NATIVE_REVIEW" as const,
    approvalStatus: "PENDING_MULTILINGUAL_PRODUCT_REVIEW" as const,
    allocationStatus: "INACTIVE_MULTILINGUAL_REVIEW" as const,
    permanentIdentityFrozen: true as const,
    learnerContentFrozen: false as const,
    mathematicalFingerprint: `${source.mathematicalFingerprint}|${INT_CP007_LOCALIZED_VERSION}|${locale}`,
  });
}

export function containsDeprecatedPunjabiCompoundInterestTerm(text: string): boolean {
  return text.includes("ਚੱਕਰਵੱਧੀ");
}
