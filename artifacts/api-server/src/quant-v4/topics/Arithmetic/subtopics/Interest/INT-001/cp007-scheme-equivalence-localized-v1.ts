import {
  INT_CP007_ENGLISH_FREEZE_ID,
  generateIntCp007EnglishFrozenQuestion,
} from "./cp007-scheme-equivalence-english-v8-frozen";
import type { IntCp007QlId } from "./cp007-scheme-equivalence-runtime-v3-final";

export const INT_CP007_LOCALIZED_VERSION = "INT-CP-007-HI-PA-v1-native-review" as const;
export const INT_CP007_LOCALIZED_LOCALES = Object.freeze(["hi-IN", "pa-IN"] as const);
export type IntCp007LocalizedLocale = (typeof INT_CP007_LOCALIZED_LOCALES)[number];

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  }
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
  while (head.length > 2) {
    groups.unshift(head.slice(-2));
    head = head.slice(0, -2);
  }
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
  const state = source.mathematicalState as any;
  const c = state.contractState as any;
  const family = Number(String(source.presentation.stemFamilyId).match(/T(\d+)$/u)?.[1] ?? "1");
  const hi = locale === "hi-IN";

  switch (source.qlId as IntCp007QlId) {
    case "INT-QL-109": {
      const p = formatMoney(c.principal), a = schemeText(c.schemeA, locale), b = schemeText(c.schemeB, locale);
      const stems = hi ? [
        `${p} को अलग-अलग योजना A (${a}) और योजना B (${b}) में लगाया जाता है। परिपक्वता पर किस योजना की राशि अधिक होगी?`,
        `दोनों योजनाओं में समान मूलधन ${p} लगाया गया है। योजना A में ${a} और योजना B में ${b} मिलता है। परिपक्वता पर अधिक राशि देने वाली योजना चुनिए।`,
        `समान निवेश ${p} के लिए योजना A (${a}) और योजना B (${b}) की तुलना कीजिए। अंत में किसमें अधिक राशि मिलेगी?`,
      ] : [
        `${p} ਨੂੰ ਵੱਖ-ਵੱਖ ਯੋਜਨਾ A (${a}) ਅਤੇ ਯੋਜਨਾ B (${b}) ਵਿੱਚ ਲਗਾਇਆ ਜਾਂਦਾ ਹੈ। ਮਿਆਦ ਪੂਰੀ ਹੋਣ ਤੇ ਕਿਹੜੀ ਯੋਜਨਾ ਦੀ ਰਕਮ ਵੱਧ ਹੋਵੇਗੀ?`,
        `ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਇੱਕੋ ਮੂਲਧਨ ${p} ਲਗਾਇਆ ਗਿਆ ਹੈ। ਯੋਜਨਾ A ਵਿੱਚ ${a} ਅਤੇ ਯੋਜਨਾ B ਵਿੱਚ ${b} ਮਿਲਦਾ ਹੈ। ਮਿਆਦ ਪੂਰੀ ਹੋਣ ਤੇ ਵੱਧ ਰਕਮ ਵਾਲੀ ਯੋਜਨਾ ਚੁਣੋ।`,
        `ਇੱਕੋ ਨਿਵੇਸ਼ ${p} ਲਈ ਯੋਜਨਾ A (${a}) ਅਤੇ ਯੋਜਨਾ B (${b}) ਦੀ ਤੁਲਨਾ ਕਰੋ। ਅੰਤ ਵਿੱਚ ਕਿਹੜੀ ਯੋਜਨਾ ਵੱਧ ਰਕਮ ਦੇਵੇਗੀ?`,
      ];
      return stems[(family - 1) % 3]!;
    }
    case "INT-QL-110": {
      const p = formatMoney(c.principal), a = schemeText(c.schemeA, locale), b = schemeText(c.schemeB, locale);
      const stems = hi ? [
        `${p} को योजना A (${a}) और अलग से योजना B (${b}) में लगाया जाता है। दोनों की परिपक्वता राशियों का अंतर ज्ञात कीजिए।`,
        `समान मूलधन ${p} पर योजना A में ${a} तथा योजना B में ${b} मिलता है। अंतिम राशियों में कितना अंतर होगा?`,
        `${p} को दो योजनाओं में तुलना के लिए लगाया गया है: A — ${a}; B — ${b}। परिपक्वता पर मिलने वाली राशियों का निरपेक्ष अंतर ज्ञात कीजिए।`,
      ] : [
        `${p} ਨੂੰ ਯੋਜਨਾ A (${a}) ਅਤੇ ਵੱਖਰੇ ਤੌਰ ਤੇ ਯੋਜਨਾ B (${b}) ਵਿੱਚ ਲਗਾਇਆ ਜਾਂਦਾ ਹੈ। ਦੋਵਾਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਦਾ ਅੰਤਰ ਕੱਢੋ।`,
        `ਇੱਕੋ ਮੂਲਧਨ ${p} ਤੇ ਯੋਜਨਾ A ਵਿੱਚ ${a} ਅਤੇ ਯੋਜਨਾ B ਵਿੱਚ ${b} ਮਿਲਦਾ ਹੈ। ਅੰਤਿਮ ਰਕਮਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੋਵੇਗਾ?`,
        `${p} ਨੂੰ ਦੋ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਤੁਲਨਾ ਲਈ ਲਗਾਇਆ ਗਿਆ ਹੈ: A — ${a}; B — ${b}। ਮਿਆਦ ਪੂਰੀ ਹੋਣ ਤੇ ਮਿਲਣ ਵਾਲੀਆਂ ਰਕਮਾਂ ਦਾ ਨਿਰਪੇਖ ਅੰਤਰ ਕੱਢੋ।`,
      ];
      return stems[(family - 1) % 3]!;
    }
    case "INT-QL-111": {
      const known = schemeText(c.knownScheme, locale);
      const second = c.missingMethod === "SIMPLE"
        ? (hi ? `${yearText(c.missingYears, locale)} के लिए साधारण ब्याज` : `${yearText(c.missingYears, locale)} ਲਈ ਸਧਾਰਨ ਵਿਆਜ`)
        : (hi ? `${yearText(c.missingYears, locale)} के लिए चक्रवृद्धि ब्याज, जिसमें ब्याज हर वर्ष मूलधन में जुड़ता है` : `${yearText(c.missingYears, locale)} ਲਈ ਮਿਸ਼ਰਤ ਵਿਆਜ, ਜਿਸ ਵਿੱਚ ਵਿਆਜ ਹਰ ਸਾਲ ਮੂਲ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ`);
      const stems = hi ? [
        `योजना A में ${known} मिलता है। योजना B में ${second} लागू है। समान मूलधन पर दोनों की परिपक्वता राशि बराबर हो, तो योजना B की वार्षिक ब्याज दर ज्ञात कीजिए।`,
        `समान मूलधन को दो योजनाओं में लगाकर समान अंतिम राशि चाहिए। पहली योजना में ${known} मिलता है और दूसरी में ${second} लागू है। दूसरी योजना की आवश्यक वार्षिक दर ज्ञात कीजिए।`,
        `समान मूलधन और समान परिपक्वता राशि के लिए योजना A में ${known} है। योजना B में ${second} है। योजना B की वार्षिक दर ज्ञात कीजिए।`,
      ] : [
        `ਯੋਜਨਾ A ਵਿੱਚ ${known} ਮਿਲਦਾ ਹੈ। ਯੋਜਨਾ B ਵਿੱਚ ${second} ਲਾਗੂ ਹੈ। ਇੱਕੋ ਮੂਲਧਨ ਤੋਂ ਦੋਵਾਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਬਰਾਬਰ ਹੋਵੇ, ਤਾਂ ਯੋਜਨਾ B ਦੀ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਕੱਢੋ।`,
        `ਇੱਕੋ ਮੂਲਧਨ ਨੂੰ ਦੋ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਲਗਾ ਕੇ ਇੱਕੋ ਅੰਤਿਮ ਰਕਮ ਚਾਹੀਦੀ ਹੈ। ਪਹਿਲੀ ਯੋਜਨਾ ਵਿੱਚ ${known} ਮਿਲਦਾ ਹੈ ਅਤੇ ਦੂਜੀ ਵਿੱਚ ${second} ਲਾਗੂ ਹੈ। ਦੂਜੀ ਯੋਜਨਾ ਦੀ ਲੋੜੀਂਦੀ ਸਾਲਾਨਾ ਦਰ ਕੱਢੋ।`,
        `ਇੱਕੋ ਮੂਲਧਨ ਅਤੇ ਬਰਾਬਰ ਮਿਆਦੀ ਰਕਮ ਲਈ ਯੋਜਨਾ A ਵਿੱਚ ${known} ਹੈ। ਯੋਜਨਾ B ਵਿੱਚ ${second} ਹੈ। ਯੋਜਨਾ B ਦੀ ਸਾਲਾਨਾ ਦਰ ਕੱਢੋ।`,
      ];
      return stems[(family - 1) % 3]!;
    }
    case "INT-QL-112": {
      const total = formatMoney(c.totalPrincipal), a = schemeText(c.schemeA, locale), b = schemeText(c.schemeB, locale);
      const stems = hi ? [
        `कुल ${total} को योजना A (${a}) और योजना B (${b}) में इस प्रकार बाँटना है कि दोनों हिस्सों की परिपक्वता राशि समान हो। योजना A में कितनी राशि लगानी चाहिए?`,
        `${total} को दो निवेशों में बाँटना है। पहला निवेश ${a} और दूसरा ${b} कमाता है। यदि दोनों की भविष्य राशि समान होनी है, तो पहले निवेश की राशि ज्ञात कीजिए।`,
        `${total} को योजना A (${a}) और योजना B (${b}) में बाँटिए ताकि दोनों की परिपक्वता राशि समान हो। योजना A की प्रारंभिक राशि ज्ञात कीजिए।`,
      ] : [
        `ਕੁੱਲ ${total} ਨੂੰ ਯੋਜਨਾ A (${a}) ਅਤੇ ਯੋਜਨਾ B (${b}) ਵਿੱਚ ਇਸ ਤਰ੍ਹਾਂ ਵੰਡਣਾ ਹੈ ਕਿ ਦੋਵਾਂ ਹਿੱਸਿਆਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਬਰਾਬਰ ਹੋਵੇ। ਯੋਜਨਾ A ਵਿੱਚ ਕਿੰਨੀ ਰਕਮ ਲਗਾਉਣੀ ਚਾਹੀਦੀ ਹੈ?`,
        `${total} ਨੂੰ ਦੋ ਨਿਵੇਸ਼ਾਂ ਵਿੱਚ ਵੰਡਣਾ ਹੈ। ਪਹਿਲੇ ਨਿਵੇਸ਼ ਨੂੰ ${a} ਅਤੇ ਦੂਜੇ ਨੂੰ ${b} ਮਿਲਦਾ ਹੈ। ਜੇ ਦੋਵਾਂ ਦੀ ਭਵਿੱਖੀ ਰਕਮ ਬਰਾਬਰ ਹੋਣੀ ਹੈ, ਤਾਂ ਪਹਿਲੇ ਨਿਵੇਸ਼ ਦੀ ਰਕਮ ਕੱਢੋ।`,
        `${total} ਨੂੰ ਯੋਜਨਾ A (${a}) ਅਤੇ ਯੋਜਨਾ B (${b}) ਵਿੱਚ ਵੰਡੋ ਤਾਂ ਕਿ ਦੋਵਾਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਬਰਾਬਰ ਹੋਵੇ। ਯੋਜਨਾ A ਦੀ ਸ਼ੁਰੂਆਤੀ ਰਕਮ ਕੱਢੋ।`,
      ];
      return stems[(family - 1) % 3]!;
    }
    case "INT-QL-113": {
      const a = schemeText(c.schemeA, locale), b = schemeText(c.schemeB, locale);
      const stems = hi ? [
        `दो प्रारंभिक मूलधन योजना A (${a}) और योजना B (${b}) में लगाए जाते हैं। यदि दोनों की परिपक्वता राशि समान है, तो मूलधन A : मूलधन B का आवश्यक अनुपात ज्ञात कीजिए।`,
        `योजना A में ${a} और योजना B में ${b} है। परिपक्वता पर दोनों राशियाँ समान हों, तो दोनों प्रारंभिक निवेशों का अनुपात क्या होना चाहिए?`,
        `योजना A (${a}) और योजना B (${b}) की भविष्य राशियाँ समान होनी हैं। प्रारंभिक निवेश A:B का अनुपात ज्ञात कीजिए।`,
      ] : [
        `ਦੋ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ਯੋਜਨਾ A (${a}) ਅਤੇ ਯੋਜਨਾ B (${b}) ਵਿੱਚ ਲਗਾਏ ਜਾਂਦੇ ਹਨ। ਜੇ ਦੋਵਾਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਬਰਾਬਰ ਹੈ, ਤਾਂ ਮੂਲਧਨ A : ਮੂਲਧਨ B ਦਾ ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`,
        `ਯੋਜਨਾ A ਵਿੱਚ ${a} ਅਤੇ ਯੋਜਨਾ B ਵਿੱਚ ${b} ਹੈ। ਮਿਆਦ ਪੂਰੀ ਹੋਣ ਤੇ ਦੋਵਾਂ ਰਕਮਾਂ ਬਰਾਬਰ ਹੋਣ, ਤਾਂ ਦੋਵਾਂ ਸ਼ੁਰੂਆਤੀ ਨਿਵੇਸ਼ਾਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ?`,
        `ਯੋਜਨਾ A (${a}) ਅਤੇ ਯੋਜਨਾ B (${b}) ਦੀਆਂ ਭਵਿੱਖੀ ਰਕਮਾਂ ਬਰਾਬਰ ਹੋਣੀਆਂ ਹਨ। ਸ਼ੁਰੂਆਤੀ ਨਿਵੇਸ਼ A:B ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`,
      ];
      return stems[(family - 1) % 3]!;
    }
    case "INT-QL-114": {
      const a = schemeText(c.initiallyHigherScheme, locale, false), b = schemeText(c.overtakingScheme, locale, false);
      const stems = hi ? [
        `समान मूलधन दो लगातार चलने वाली वार्षिक योजनाओं में लगाया गया है। योजना A में ${a} और योजना B में ${b} मिलता है। कितने पूरे वर्षों बाद योजना B पहली बार योजना A से अधिक राशि देगी?`,
        `दोनों योजनाएँ समान मूलधन से शुरू होती हैं। योजना A में ${a} और योजना B में ${b} है। वह पहला पूरा वर्ष ज्ञात कीजिए जब योजना B की संचित राशि योजना A से अधिक हो जाती है।`,
        `दो समान राशियाँ एक ही समय से बढ़ती हैं। A में ${a} और B में ${b} है। सबसे पहला पूरा वर्ष ज्ञात कीजिए जब B की संचित राशि A से अधिक हो जाए।`,
      ] : [
        `ਇੱਕੋ ਮੂਲਧਨ ਦੋ ਲਗਾਤਾਰ ਸਾਲਾਨਾ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਲਗਾਇਆ ਗਿਆ ਹੈ। ਯੋਜਨਾ A ਵਿੱਚ ${a} ਅਤੇ ਯੋਜਨਾ B ਵਿੱਚ ${b} ਮਿਲਦਾ ਹੈ। ਕਿੰਨੇ ਪੂਰੇ ਸਾਲਾਂ ਬਾਅਦ ਯੋਜਨਾ B ਪਹਿਲੀ ਵਾਰ ਯੋਜਨਾ A ਤੋਂ ਵੱਧ ਰਕਮ ਦੇਵੇਗੀ?`,
        `ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਇੱਕੋ ਮੂਲਧਨ ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦੀਆਂ ਹਨ। ਯੋਜਨਾ A ਵਿੱਚ ${a} ਅਤੇ ਯੋਜਨਾ B ਵਿੱਚ ${b} ਹੈ। ਉਹ ਪਹਿਲਾ ਪੂਰਾ ਸਾਲ ਕੱਢੋ ਜਦੋਂ ਯੋਜਨਾ B ਦੀ ਇਕੱਠੀ ਰਕਮ ਯੋਜਨਾ A ਤੋਂ ਵੱਧ ਹੋ ਜਾਂਦੀ ਹੈ।`,
        `ਦੋ ਬਰਾਬਰ ਰਕਮਾਂ ਇੱਕੋ ਸਮੇਂ ਤੋਂ ਵਧਦੀਆਂ ਹਨ। A ਵਿੱਚ ${a} ਅਤੇ B ਵਿੱਚ ${b} ਹੈ। ਸਭ ਤੋਂ ਪਹਿਲਾ ਪੂਰਾ ਸਾਲ ਕੱਢੋ ਜਦੋਂ B ਦੀ ਇਕੱਠੀ ਰਕਮ A ਤੋਂ ਵੱਧ ਹੋ ਜਾਵੇ।`,
      ];
      return stems[(family - 1) % 3]!;
    }
    case "INT-QL-115": {
      const known = formatMoney(c.knownPrincipal), a = schemeText(c.knownScheme, locale), b = schemeText(c.missingScheme, locale);
      const stems = hi ? [
        `${known} को योजना A (${a}) में लगाया गया है। योजना B (${b}) में कितनी राशि लगानी होगी ताकि दोनों की परिपक्वता राशि समान हो?`,
        `योजना A में प्रारंभिक राशि ${known} है और उस पर ${a} लागू है। योजना B में ${b} है। योजना B में शुरुआत में कितनी राशि लगाएँ ताकि दोनों की भविष्य राशि समान हो?`,
        `${known} का निवेश ${a} के अनुसार बढ़ता है। ${b} वाली योजना में कितनी राशि लगानी चाहिए ताकि वही परिपक्वता राशि मिले?`,
      ] : [
        `${known} ਨੂੰ ਯੋਜਨਾ A (${a}) ਵਿੱਚ ਲਗਾਇਆ ਗਿਆ ਹੈ। ਯੋਜਨਾ B (${b}) ਵਿੱਚ ਕਿੰਨੀ ਰਕਮ ਲਗਾਉਣੀ ਪਵੇਗੀ ਤਾਂ ਕਿ ਦੋਵਾਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਬਰਾਬਰ ਹੋਵੇ?`,
        `ਯੋਜਨਾ A ਵਿੱਚ ਸ਼ੁਰੂਆਤੀ ਰਕਮ ${known} ਹੈ ਅਤੇ ਇਸ ਤੇ ${a} ਲਾਗੂ ਹੈ। ਯੋਜਨਾ B ਵਿੱਚ ${b} ਹੈ। ਯੋਜਨਾ B ਵਿੱਚ ਸ਼ੁਰੂ ਵਿੱਚ ਕਿੰਨੀ ਰਕਮ ਲਗਾਈਏ ਤਾਂ ਕਿ ਦੋਵਾਂ ਦੀ ਭਵਿੱਖੀ ਰਕਮ ਬਰਾਬਰ ਹੋਵੇ?`,
        `${known} ਦਾ ਨਿਵੇਸ਼ ${a} ਅਨੁਸਾਰ ਵਧਦਾ ਹੈ। ${b} ਵਾਲੀ ਯੋਜਨਾ ਵਿੱਚ ਕਿੰਨੀ ਰਕਮ ਲਗਾਉਣੀ ਚਾਹੀਦੀ ਹੈ ਤਾਂ ਕਿ ਉਹੀ ਮਿਆਦੀ ਰਕਮ ਮਿਲੇ?`,
      ];
      return stems[(family - 1) % 3]!;
    }
  }
}

function explanationFor(source: any, locale: IntCp007LocalizedLocale) {
  const hi = locale === "hi-IN";
  const ql = source.qlId as IntCp007QlId;
  const c = source.mathematicalState.contractState as any;
  const m = (index: number) => mathSegments(source.explanation.steps[index] ?? "");
  const correct = optionText(source.correctAnswer, locale);

  const content: Record<IntCp007QlId, { keyIdea: string; steps: string[]; commonMistake: string }> = {
    "INT-QL-109": {
      keyIdea: hi ? "दोनों योजनाओं का मूलधन समान है। पहले प्रत्येक योजना का वृद्धि गुणक निकालें, फिर उससे परिपक्वता राशि निकालकर तुलना करें।" : "ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਦਾ ਮੂਲਧਨ ਇੱਕੋ ਹੈ। ਪਹਿਲਾਂ ਹਰ ਯੋਜਨਾ ਦਾ ਵਾਧਾ ਗੁਣਕ ਕੱਢੋ, ਫਿਰ ਉਸ ਨਾਲ ਮਿਆਦੀ ਰਕਮ ਕੱਢ ਕੇ ਤੁਲਨਾ ਕਰੋ।",
      steps: hi ? [
        `दोनों योजनाओं में शुरुआती मूलधन ${formatMoney(c.principal)} है; हमें अधिक परिपक्वता राशि वाली योजना चुननी है।`,
        `योजना A का वृद्धि गुणक ${m(1)[0]} है।`,
        `इसलिए योजना A की परिपक्वता राशि ${m(2)[0]} है।`,
        `योजना B का वृद्धि गुणक ${m(3)[0]} है।`,
        `योजना B की परिपक्वता राशि ${m(4)[0]} है। तुलना से ${correct} अधिक राशि देती है।`,
      ] : [
        `ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ${formatMoney(c.principal)} ਹੈ; ਸਾਨੂੰ ਵੱਧ ਮਿਆਦੀ ਰਕਮ ਵਾਲੀ ਯੋਜਨਾ ਚੁਣਨੀ ਹੈ।`,
        `ਯੋਜਨਾ A ਦਾ ਵਾਧਾ ਗੁਣਕ ${m(1)[0]} ਹੈ।`,
        `ਇਸ ਲਈ ਯੋਜਨਾ A ਦੀ ਮਿਆਦੀ ਰਕਮ ${m(2)[0]} ਹੈ।`,
        `ਯੋਜਨਾ B ਦਾ ਵਾਧਾ ਗੁਣਕ ${m(3)[0]} ਹੈ।`,
        `ਯੋਜਨਾ B ਦੀ ਮਿਆਦੀ ਰਕਮ ${m(4)[0]} ਹੈ। ਤੁਲਨਾ ਤੋਂ ${correct} ਵੱਧ ਰਕਮ ਦਿੰਦੀ ਹੈ।`,
      ],
      commonMistake: hi ? "केवल वार्षिक ब्याज दरों की तुलना न करें। साधारण और चक्रवृद्धि ब्याज में समान दिखने वाली दरें भी अलग परिपक्वता राशि दे सकती हैं।" : "ਕੇਵਲ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰਾਂ ਦੀ ਤੁਲਨਾ ਨਾ ਕਰੋ। ਸਧਾਰਨ ਅਤੇ ਮਿਸ਼ਰਤ ਵਿਆਜ ਵਿੱਚ ਇੱਕੋ ਜਿਹੀਆਂ ਲੱਗਣ ਵਾਲੀਆਂ ਦਰਾਂ ਵੀ ਵੱਖਰੀ ਮਿਆਦੀ ਰਕਮ ਦੇ ਸਕਦੀਆਂ ਹਨ।",
    },
    "INT-QL-110": {
      keyIdea: hi ? "दोनों योजनाओं की परिपक्वता राशि अलग-अलग निकालें। आवश्यक उत्तर उन दोनों अंतिम राशियों का धनात्मक अंतर है।" : "ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਵੱਖ-ਵੱਖ ਕੱਢੋ। ਲੋੜੀਂਦਾ ਉੱਤਰ ਦੋਵਾਂ ਅੰਤਿਮ ਰਕਮਾਂ ਦਾ ਧਨਾਤਮਕ ਅੰਤਰ ਹੈ।",
      steps: hi ? [
        `दोनों योजनाओं में समान मूलधन ${formatMoney(c.principal)} है और हमें उनकी परिपक्वता राशियों का अंतर निकालना है।`,
        `योजना A के लिए ${m(1)[0]} और परिपक्वता राशि ${m(1)[1]} है।`,
        `योजना B के लिए ${m(2)[0]} और परिपक्वता राशि ${m(2)[1]} है।`,
        `दोनों राशियों का निरपेक्ष अंतर ${m(3)[0]} है।`,
        `अतः परिपक्वता राशियों का अंतर ${correct} है।`,
      ] : [
        `ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਇੱਕੋ ਮੂਲਧਨ ${formatMoney(c.principal)} ਹੈ ਅਤੇ ਸਾਨੂੰ ਉਹਨਾਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਦਾ ਅੰਤਰ ਕੱਢਣਾ ਹੈ।`,
        `ਯੋਜਨਾ A ਲਈ ${m(1)[0]} ਅਤੇ ਮਿਆਦੀ ਰਕਮ ${m(1)[1]} ਹੈ।`,
        `ਯੋਜਨਾ B ਲਈ ${m(2)[0]} ਅਤੇ ਮਿਆਦੀ ਰਕਮ ${m(2)[1]} ਹੈ।`,
        `ਦੋਵਾਂ ਰਕਮਾਂ ਦਾ ਨਿਰਪੇਖ ਅੰਤਰ ${m(3)[0]} ਹੈ।`,
        `ਇਸ ਲਈ ਮਿਆਦੀ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ${correct} ਹੈ।`,
      ],
      commonMistake: hi ? "वार्षिक दरों को घटाकर उस अंतर को मूलधन पर सीधे लागू न करें। पहले दोनों पूरी परिपक्वता राशियाँ निकालें, फिर घटाएँ।" : "ਸਾਲਾਨਾ ਦਰਾਂ ਨੂੰ ਘਟਾ ਕੇ ਉਸ ਅੰਤਰ ਨੂੰ ਮੂਲਧਨ ਤੇ ਸਿੱਧਾ ਲਾਗੂ ਨਾ ਕਰੋ। ਪਹਿਲਾਂ ਦੋਵਾਂ ਪੂਰੀਆਂ ਮਿਆਦੀ ਰਕਮਾਂ ਕੱਢੋ, ਫਿਰ ਘਟਾਓ।",
    },
    "INT-QL-111": {
      keyIdea: hi ? "समान मूलधन और समान परिपक्वता राशि के लिए दोनों योजनाओं के वृद्धि गुणक समान होने चाहिए। ज्ञात गुणक से दूसरी योजना की दर का समीकरण बनाकर दर निकालें।" : "ਇੱਕੋ ਮੂਲਧਨ ਅਤੇ ਬਰਾਬਰ ਮਿਆਦੀ ਰਕਮ ਲਈ ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਦੇ ਵਾਧਾ ਗੁਣਕ ਬਰਾਬਰ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ। ਜਾਣੇ ਹੋਏ ਗੁਣਕ ਤੋਂ ਦੂਜੀ ਯੋਜਨਾ ਦੀ ਦਰ ਦਾ ਸਮੀਕਰਨ ਬਣਾ ਕੇ ਦਰ ਕੱਢੋ।",
      steps: hi ? [
        "दोनों योजनाएँ समान मूलधन से शुरू होती हैं, इसलिए आवश्यक दर ऐसी होनी चाहिए जिससे उनकी परिपक्वता राशि बराबर हो।",
        `ज्ञात योजना का वृद्धि गुणक ${m(1)[0]} है; इसलिए दूसरी योजना का लक्ष्य गुणक ${m(1).at(-1)} है।`,
        `दूसरी योजना के लिए आवश्यक समीकरण ${m(2)[0]} है।`,
        `समीकरण को सरल करने पर ${m(3).join(" और ")} मिलता है।`,
        `इससे ${m(4).join(" और ")} मिलता है; यही आवश्यक वार्षिक दर है।`,
        `जाँच: इस दर पर दूसरी योजना का गुणक ${m(5)[1] ?? m(5)[0]} है, जो लक्ष्य गुणक ${m(5).at(-1)} के बराबर है।`,
      ] : [
        "ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਇੱਕੋ ਮੂਲਧਨ ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦੀਆਂ ਹਨ, ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਦਰ ਐਸੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ ਜਿਸ ਨਾਲ ਉਹਨਾਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਬਰਾਬਰ ਹੋਵੇ।",
        `ਜਾਣੀ ਹੋਈ ਯੋਜਨਾ ਦਾ ਵਾਧਾ ਗੁਣਕ ${m(1)[0]} ਹੈ; ਇਸ ਲਈ ਦੂਜੀ ਯੋਜਨਾ ਦਾ ਟੀਚਾ ਗੁਣਕ ${m(1).at(-1)} ਹੈ।`,
        `ਦੂਜੀ ਯੋਜਨਾ ਲਈ ਲੋੜੀਂਦਾ ਸਮੀਕਰਨ ${m(2)[0]} ਹੈ।`,
        `ਸਮੀਕਰਨ ਸੌਖਾ ਕਰਨ ਤੇ ${m(3).join(" ਅਤੇ ")} ਮਿਲਦਾ ਹੈ।`,
        `ਇਸ ਤੋਂ ${m(4).join(" ਅਤੇ ")} ਮਿਲਦਾ ਹੈ; ਇਹੀ ਲੋੜੀਂਦੀ ਸਾਲਾਨਾ ਦਰ ਹੈ।`,
        `ਜਾਂਚ: ਇਸ ਦਰ ਤੇ ਦੂਜੀ ਯੋਜਨਾ ਦਾ ਗੁਣਕ ${m(5)[1] ?? m(5)[0]} ਹੈ, ਜੋ ਟੀਚਾ ਗੁਣਕ ${m(5).at(-1)} ਦੇ ਬਰਾਬਰ ਹੈ।`,
      ],
      commonMistake: hi ? "ज्ञात योजना की वार्षिक दर को सीधे उत्तर न मानें। तरीका या अवधि बदलने पर समान परिपक्वता राशि वृद्धि गुणकों को बराबर करके ही मिलती है।" : "ਜਾਣੀ ਹੋਈ ਯੋਜਨਾ ਦੀ ਸਾਲਾਨਾ ਦਰ ਨੂੰ ਸਿੱਧਾ ਉੱਤਰ ਨਾ ਮੰਨੋ। ਤਰੀਕਾ ਜਾਂ ਸਮਾਂ ਬਦਲਣ ਤੇ ਬਰਾਬਰ ਮਿਆਦੀ ਰਕਮ ਵਾਧਾ ਗੁਣਕਾਂ ਨੂੰ ਬਰਾਬਰ ਕਰਕੇ ਹੀ ਮਿਲਦੀ ਹੈ।",
    },
    "INT-QL-112": {
      keyIdea: hi ? "योजना A की प्रारंभिक राशि को एक चर मानें; शेष राशि योजना B में जाएगी। दोनों की परिपक्वता राशि बराबर रखकर चर हल करें।" : "ਯੋਜਨਾ A ਦੀ ਸ਼ੁਰੂਆਤੀ ਰਕਮ ਨੂੰ ਇੱਕ ਚਲ ਮੰਨੋ; ਬਾਕੀ ਰਕਮ ਯੋਜਨਾ B ਵਿੱਚ ਜਾਵੇਗੀ। ਦੋਵਾਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਬਰਾਬਰ ਰੱਖ ਕੇ ਚਲ ਹੱਲ ਕਰੋ।",
      steps: hi ? [
        `कुल राशि ${formatMoney(c.totalPrincipal)} है। योजना A में $x$ मानें; शेष राशि योजना B में जाएगी।`,
        `योजना A का वृद्धि गुणक ${m(1)[0]} और योजना B का वृद्धि गुणक ${m(1)[1]} है।`,
        `समान परिपक्वता राशि के लिए ${m(2)[0]}।`,
        `हल करने पर ${m(3)[0]}। इससे योजना A की प्रारंभिक राशि मिल जाती है।`,
        `जाँच करने पर दोनों हिस्सों की परिपक्वता राशि समान आती है। इसलिए योजना A में ${correct} लगाना चाहिए।`,
      ] : [
        `ਕੁੱਲ ਰਕਮ ${formatMoney(c.totalPrincipal)} ਹੈ। ਯੋਜਨਾ A ਵਿੱਚ $x$ ਮੰਨੋ; ਬਾਕੀ ਰਕਮ ਯੋਜਨਾ B ਵਿੱਚ ਜਾਵੇਗੀ।`,
        `ਯੋਜਨਾ A ਦਾ ਵਾਧਾ ਗੁਣਕ ${m(1)[0]} ਅਤੇ ਯੋਜਨਾ B ਦਾ ਵਾਧਾ ਗੁਣਕ ${m(1)[1]} ਹੈ।`,
        `ਬਰਾਬਰ ਮਿਆਦੀ ਰਕਮ ਲਈ ${m(2)[0]}।`,
        `ਹੱਲ ਕਰਨ ਤੇ ${m(3)[0]}। ਇਸ ਤੋਂ ਯੋਜਨਾ A ਦੀ ਸ਼ੁਰੂਆਤੀ ਰਕਮ ਮਿਲ ਜਾਂਦੀ ਹੈ।`,
        `ਜਾਂਚ ਕਰਨ ਤੇ ਦੋਵਾਂ ਹਿੱਸਿਆਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਬਰਾਬਰ ਆਉਂਦੀ ਹੈ। ਇਸ ਲਈ ਯੋਜਨਾ A ਵਿੱਚ ${correct} ਲਗਾਉਣਾ ਚਾਹੀਦਾ ਹੈ।`,
      ],
      commonMistake: hi ? "कुल राशि को बराबर-बराबर न बाँटें, जब तक दोनों योजनाओं के वृद्धि गुणक समान न हों। अलग वृद्धि गुणक होने पर प्रारंभिक राशियाँ भी अलग होती हैं।" : "ਕੁੱਲ ਰਕਮ ਨੂੰ ਬਰਾਬਰ-ਬਰਾਬਰ ਨਾ ਵੰਡੋ, ਜਦ ਤੱਕ ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਦੇ ਵਾਧਾ ਗੁਣਕ ਇੱਕੋ ਨਾ ਹੋਣ। ਵੱਖਰੇ ਵਾਧਾ ਗੁਣਕ ਹੋਣ ਤੇ ਸ਼ੁਰੂਆਤੀ ਰਕਮਾਂ ਵੀ ਵੱਖਰੀਆਂ ਹੁੰਦੀਆਂ ਹਨ।",
    },
    "INT-QL-113": {
      keyIdea: hi ? "समान परिपक्वता राशि के लिए प्रत्येक प्रारंभिक मूलधन को उसके वृद्धि गुणक से गुणा करने पर समान परिणाम आना चाहिए। इसलिए मूलधनों का अनुपात वृद्धि गुणकों के उलटे अनुपात में होगा।" : "ਬਰਾਬਰ ਮਿਆਦੀ ਰਕਮ ਲਈ ਹਰ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ਨੂੰ ਉਸਦੇ ਵਾਧਾ ਗੁਣਕ ਨਾਲ ਗੁਣਾ ਕਰਨ ਤੇ ਇੱਕੋ ਨਤੀਜਾ ਆਉਣਾ ਚਾਹੀਦਾ ਹੈ। ਇਸ ਲਈ ਮੂਲਧਨਾਂ ਦਾ ਅਨੁਪਾਤ ਵਾਧਾ ਗੁਣਕਾਂ ਦੇ ਉਲਟ ਅਨੁਪਾਤ ਵਿੱਚ ਹੋਵੇਗਾ।",
      steps: hi ? [
        "दोनों प्रारंभिक मूलधनों को अलग चर मानें। उनकी परिपक्वता राशि समान होनी चाहिए।",
        `योजना A का वृद्धि गुणक ${m(1)[0]} और योजना B का वृद्धि गुणक ${m(1)[1]} है।`,
        `समान परिपक्वता राशि से ${m(2)[0]}।`,
        `अतः ${m(3)[0]}।`,
        `इसलिए ${m(4)[0]}। यह वृद्धि गुणकों का उलटा अनुपात है।`,
      ] : [
        "ਦੋਵਾਂ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨਾਂ ਨੂੰ ਵੱਖਰੇ ਚਲ ਮੰਨੋ। ਉਹਨਾਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਬਰਾਬਰ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।",
        `ਯੋਜਨਾ A ਦਾ ਵਾਧਾ ਗੁਣਕ ${m(1)[0]} ਅਤੇ ਯੋਜਨਾ B ਦਾ ਵਾਧਾ ਗੁਣਕ ${m(1)[1]} ਹੈ।`,
        `ਬਰਾਬਰ ਮਿਆਦੀ ਰਕਮ ਤੋਂ ${m(2)[0]}।`,
        `ਇਸ ਲਈ ${m(3)[0]}।`,
        `ਅਤੇ ਇਸ ਕਰਕੇ ${m(4)[0]}। ਇਹ ਵਾਧਾ ਗੁਣਕਾਂ ਦਾ ਉਲਟ ਅਨੁਪਾਤ ਹੈ।`,
      ],
      commonMistake: hi ? "केवल वार्षिक ब्याज दरों का अनुपात न लें। आवश्यक मूलधन अनुपात दोनों योजनाओं के पूरे वृद्धि गुणकों से आता है और क्रम उलटा होता है।" : "ਕੇਵਲ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰਾਂ ਦਾ ਅਨੁਪਾਤ ਨਾ ਲਓ। ਲੋੜੀਂਦਾ ਮੂਲਧਨ ਅਨੁਪਾਤ ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਦੇ ਪੂਰੇ ਵਾਧਾ ਗੁਣਕਾਂ ਤੋਂ ਆਉਂਦਾ ਹੈ ਅਤੇ ਕ੍ਰਮ ਉਲਟ ਹੁੰਦਾ ਹੈ।",
    },
    "INT-QL-114": {
      keyIdea: hi ? "पहली बार आगे निकलने वाला वर्ष पाने के लिए लगातार दो पूरे वर्षों की जाँच करें: एक वर्ष पहले B आगे नहीं होना चाहिए और चुने गए वर्ष में B आगे होना चाहिए।" : "ਪਹਿਲੀ ਵਾਰ ਅੱਗੇ ਨਿਕਲਣ ਵਾਲਾ ਸਾਲ ਲੱਭਣ ਲਈ ਲਗਾਤਾਰ ਦੋ ਪੂਰੇ ਸਾਲ ਜਾਂਚੋ: ਇੱਕ ਸਾਲ ਪਹਿਲਾਂ B ਅੱਗੇ ਨਹੀਂ ਹੋਣਾ ਚਾਹੀਦਾ ਅਤੇ ਚੁਣੇ ਸਾਲ ਵਿੱਚ B ਅੱਗੇ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।",
      steps: hi ? [
        "दोनों योजनाएँ समान मूलधन से शुरू होती हैं, इसलिए केवल उनके वृद्धि गुणकों की तुलना पर्याप्त है।",
        `पिछले पूरे वर्ष पर योजना A और B के गुणक क्रमशः ${m(1)[0]} और ${m(1)[1]} हैं; यहाँ B अभी आगे नहीं है।`,
        `अगले पूरे वर्ष पर योजना A और B के गुणक क्रमशः ${m(2)[0]} और ${m(2)[1]} हैं।`,
        `तुलना ${m(3)[0]} से ${m(3)[1]} में बदलती है; इसलिए इसी वर्ष B पहली बार आगे निकलती है।`,
        `अतः उत्तर ${correct} है।`,
      ] : [
        "ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਇੱਕੋ ਮੂਲਧਨ ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦੀਆਂ ਹਨ, ਇਸ ਲਈ ਕੇਵਲ ਉਹਨਾਂ ਦੇ ਵਾਧਾ ਗੁਣਕਾਂ ਦੀ ਤੁਲਨਾ ਕਾਫੀ ਹੈ।",
        `ਪਿਛਲੇ ਪੂਰੇ ਸਾਲ ਤੇ ਯੋਜਨਾ A ਅਤੇ B ਦੇ ਗੁਣਕ ਕ੍ਰਮਵਾਰ ${m(1)[0]} ਅਤੇ ${m(1)[1]} ਹਨ; ਇੱਥੇ B ਹਾਲੇ ਅੱਗੇ ਨਹੀਂ ਹੈ।`,
        `ਅਗਲੇ ਪੂਰੇ ਸਾਲ ਤੇ ਯੋਜਨਾ A ਅਤੇ B ਦੇ ਗੁਣਕ ਕ੍ਰਮਵਾਰ ${m(2)[0]} ਅਤੇ ${m(2)[1]} ਹਨ।`,
        `ਤੁਲਨਾ ${m(3)[0]} ਤੋਂ ${m(3)[1]} ਵਿੱਚ ਬਦਲਦੀ ਹੈ; ਇਸ ਲਈ ਇਸੇ ਸਾਲ B ਪਹਿਲੀ ਵਾਰ ਅੱਗੇ ਨਿਕਲਦੀ ਹੈ।`,
        `ਇਸ ਲਈ ਉੱਤਰ ${correct} ਹੈ।`,
      ],
      commonMistake: hi ? "कोई बाद का वर्ष केवल इसलिए न चुनें कि वहाँ B बड़ी है। पहला पार-बिंदु सिद्ध करने के लिए ठीक पिछले पूरे वर्ष की भी जाँच आवश्यक है।" : "ਕੋਈ ਬਾਅਦਲਾ ਸਾਲ ਸਿਰਫ਼ ਇਸ ਲਈ ਨਾ ਚੁਣੋ ਕਿ ਉੱਥੇ B ਵੱਡੀ ਹੈ। ਪਹਿਲੀ ਵਾਰ ਅੱਗੇ ਨਿਕਲਣਾ ਸਾਬਤ ਕਰਨ ਲਈ ਠੀਕ ਪਿਛਲੇ ਪੂਰੇ ਸਾਲ ਦੀ ਵੀ ਜਾਂਚ ਲਾਜ਼ਮੀ ਹੈ।",
    },
    "INT-QL-115": {
      keyIdea: hi ? "पहले ज्ञात प्रारंभिक मूलधन से मिलने वाली परिपक्वता राशि निकालें। फिर उस लक्ष्य राशि को दूसरी योजना के वृद्धि गुणक से भाग देकर आवश्यक प्रारंभिक मूलधन निकालें।" : "ਪਹਿਲਾਂ ਜਾਣੇ ਹੋਏ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ਤੋਂ ਮਿਲਣ ਵਾਲੀ ਮਿਆਦੀ ਰਕਮ ਕੱਢੋ। ਫਿਰ ਉਸ ਟੀਚਾ ਰਕਮ ਨੂੰ ਦੂਜੀ ਯੋਜਨਾ ਦੇ ਵਾਧਾ ਗੁਣਕ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਲੋੜੀਂਦਾ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ਕੱਢੋ।",
      steps: hi ? [
        `ज्ञात प्रारंभिक मूलधन ${formatMoney(c.knownPrincipal)} है और दोनों योजनाओं की परिपक्वता राशि समान होनी है।`,
        `ज्ञात योजना का वृद्धि गुणक ${m(1)[0]} है, इसलिए उसकी परिपक्वता राशि ${m(1)[1]} है।`,
        `दूसरी योजना का वृद्धि गुणक ${m(2)[0]} है।`,
        `यदि दूसरी योजना का प्रारंभिक मूलधन $P$ है, तो ${m(3)[0]} और इसलिए ${m(3).at(-1)}।`,
        `जाँच करने पर दोनों योजनाएँ समान परिपक्वता राशि देती हैं। अतः आवश्यक प्रारंभिक मूलधन ${correct} है।`,
      ] : [
        `ਜਾਣਿਆ ਹੋਇਆ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ${formatMoney(c.knownPrincipal)} ਹੈ ਅਤੇ ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਦੀ ਮਿਆਦੀ ਰਕਮ ਬਰਾਬਰ ਹੋਣੀ ਹੈ।`,
        `ਜਾਣੀ ਹੋਈ ਯੋਜਨਾ ਦਾ ਵਾਧਾ ਗੁਣਕ ${m(1)[0]} ਹੈ, ਇਸ ਲਈ ਉਸਦੀ ਮਿਆਦੀ ਰਕਮ ${m(1)[1]} ਹੈ।`,
        `ਦੂਜੀ ਯੋਜਨਾ ਦਾ ਵਾਧਾ ਗੁਣਕ ${m(2)[0]} ਹੈ।`,
        `ਜੇ ਦੂਜੀ ਯੋਜਨਾ ਦਾ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ $P$ ਹੈ, ਤਾਂ ${m(3)[0]} ਅਤੇ ਇਸ ਲਈ ${m(3).at(-1)}।`,
        `ਜਾਂਚ ਕਰਨ ਤੇ ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਇੱਕੋ ਮਿਆਦੀ ਰਕਮ ਦਿੰਦੀਆਂ ਹਨ। ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ${correct} ਹੈ।`,
      ],
      commonMistake: hi ? "यह न मानें कि दोनों योजनाओं में समान प्रारंभिक मूलधन चाहिए। अलग वृद्धि गुणक होने पर समान भविष्य राशि पाने के लिए प्रारंभिक मूलधन अलग होंगे।" : "ਇਹ ਨਾ ਮੰਨੋ ਕਿ ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਇੱਕੋ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ਚਾਹੀਦਾ ਹੈ। ਵੱਖਰੇ ਵਾਧਾ ਗੁਣਕ ਹੋਣ ਤੇ ਇੱਕੋ ਭਵਿੱਖੀ ਰਕਮ ਲਈ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ਵੱਖਰੇ ਹੋਣਗੇ।",
    },
  };

  return deepFreeze({
    keyIdea: content[ql].keyIdea,
    steps: Object.freeze(content[ql].steps),
    finalAnswer: correct,
    commonMistake: content[ql].commonMistake,
  });
}

export function generateIntCp007LocalizedReviewQuestion(
  qlId: IntCp007QlId,
  seed: string,
  locale: IntCp007LocalizedLocale,
) {
  const source = generateIntCp007EnglishFrozenQuestion(qlId, seed, "en-IN") as any;
  if (source.freezeId !== INT_CP007_ENGLISH_FREEZE_ID || !source.learnerContentFrozen) {
    throw new Error(`${qlId}/${seed}: localization source is not the approved frozen English authority`);
  }
  const localizedOptions = source.options.map((option: any) => deepFreeze({ ...option, text: optionText(option.text, locale) }));
  const correctAnswer = localizedOptions[source.correctIndex]!.text;
  const markdown = stemFor(source, locale);
  const explanation = explanationFor(source, locale);
  const {
    freezeId: sourceEnglishFreezeId,
    freezeApproval: sourceEnglishFreezeApproval,
    editorialStatus: _englishEditorialStatus,
    approvalStatus: _englishApprovalStatus,
    allocationStatus: _englishAllocationStatus,
    learnerContentFrozen: _englishLearnerContentFrozen,
    ...base
  } = source;

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
