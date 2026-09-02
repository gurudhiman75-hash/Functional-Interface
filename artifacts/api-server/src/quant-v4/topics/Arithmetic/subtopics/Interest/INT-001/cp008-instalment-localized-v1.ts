import {
  INT_CP008_ENGLISH_FREEZE_ID,
  generateIntCp008EnglishFrozenQuestion,
} from "./cp008-instalment-english-v6-frozen";
import type { IntCp008QlId } from "./cp008-instalment-runtime-v1-final";

export const INT_CP008_LOCALIZED_VERSION = "INT-CP-008-HI-PA-v1-native-review" as const;
export const INT_CP008_LOCALIZED_LOCALES = Object.freeze(["hi-IN", "pa-IN"] as const);
export type IntCp008LocalizedLocale = (typeof INT_CP008_LOCALIZED_LOCALES)[number];

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  return Object.freeze(value);
}

function indianInteger(value: bigint): string {
  const source = value.toString();
  if (source.length <= 3) return source;
  const tail = source.slice(-3);
  let head = source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) { groups.unshift(head.slice(-2)); head = head.slice(0, -2); }
  if (head) groups.unshift(head);
  return `${groups.join(",")},${tail}`;
}

function money(value: any): string {
  const n = BigInt(value.numerator);
  const d = BigInt(value.denominator);
  let paise = (n * 100n) / d;
  const rem = (n * 100n) % d;
  if (rem * 2n >= d) paise += 1n;
  const rupees = paise / 100n;
  const p = paise % 100n;
  return p === 0n ? `₹${indianInteger(rupees)}` : `₹${indianInteger(rupees)}.${p.toString().padStart(2, "0")}`;
}

function rational(value: any, maximumDecimals = 6): string {
  const n = BigInt(value.numerator), d = BigInt(value.denominator);
  const sign = n < 0n ? "-" : "";
  const a = n < 0n ? -n : n;
  const whole = a / d;
  let rem = a % d;
  if (rem === 0n) return `${sign}${whole}`;
  let decimals = "";
  for (let i = 0; i < maximumDecimals && rem !== 0n; i += 1) {
    rem *= 10n;
    decimals += (rem / d).toString();
    rem %= d;
  }
  return rem === 0n ? `${sign}${whole}.${decimals}` : `${sign}${a}/${d}`;
}

const percent = (value: any): string => `${rational(value)}%`;
const hi = (locale: IntCp008LocalizedLocale): boolean => locale === "hi-IN";
const unit = (u: "YEAR" | "HALF_YEAR", locale: IntCp008LocalizedLocale): string =>
  hi(locale) ? (u === "YEAR" ? "वर्ष" : "छमाही") : (u === "YEAR" ? "ਸਾਲ" : "ਛਿਮਾਹੀ");
const duration = (n: number, u: "YEAR" | "HALF_YEAR", locale: IntCp008LocalizedLocale): string => `${n} ${unit(u, locale)}`;
const rate = (r: any, u: "YEAR" | "HALF_YEAR", locale: IntCp008LocalizedLocale): string =>
  hi(locale) ? `${percent(r)} प्रति ${unit(u, locale)}` : `${percent(r)} ਪ੍ਰਤੀ ${unit(u, locale)}`;
const endOf = (u: "YEAR" | "HALF_YEAR", locale: IntCp008LocalizedLocale): string =>
  hi(locale) ? `हर ${unit(u, locale)} के अंत में` : `ਹਰ ${unit(u, locale)} ਦੇ ਅੰਤ ਵਿੱਚ`;
const startOf = (u: "YEAR" | "HALF_YEAR", locale: IntCp008LocalizedLocale): string =>
  hi(locale) ? `हर ${unit(u, locale)} की शुरुआत में` : `ਹਰ ${unit(u, locale)} ਦੀ ਸ਼ੁਰੂਆਤ ਵਿੱਚ`;

function mathSegments(text: string): readonly string[] {
  return Object.freeze(text.match(/\$[^$]+\$/gu) ?? []);
}
function moneyTokens(text: string): readonly string[] {
  return Object.freeze(text.match(/₹[\d,]+(?:\.\d+)?/gu) ?? []);
}
function familyIndex(source: any): number {
  const match = String(source.presentation.stemFamilyId).match(/T(\d+)$/u);
  if (!match) throw new Error(`${source.qlId}/${source.seed}: missing stem family`);
  return Number(match[1]) - 1;
}
function roundingNote(source: any, locale: IntCp008LocalizedLocale): string {
  if (!String(source.presentation.prompt).includes("nearest paise")) return "";
  return hi(locale) ? " मौद्रिक उत्तर निकटतम पैसे तक दें।" : " ਰਕਮ ਵਾਲਾ ਉੱਤਰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੈਸੇ ਤੱਕ ਦਿਓ।";
}

function stemFor(source: any, locale: IntCp008LocalizedLocale): string {
  const c = source.mathematicalState.contractState as any;
  const f = familyIndex(source);
  const H = hi(locale);
  let stems: string[];
  switch (source.qlId as IntCp008QlId) {
    case "INT-QL-116": {
      const p = money(c.openingBalance), r = rate(c.periodicRatePercent, c.periodUnit, locale), d = duration(c.periods, c.periodUnit, locale), e = endOf(c.periodUnit, locale);
      stems = H ? [
        `${p} का ऋण ${r} ब्याज पर है। इसे ${c.periods} बराबर किस्तों में चुकाना है, प्रत्येक किस्त ${e} दी जाएगी। प्रत्येक किस्त ज्ञात कीजिए।`,
        `${p} बकाया है। ${r} ब्याज जुड़ने के बाद ${e} एक समान भुगतान किया जाता है। ${d} बाद शेष राशि शून्य होनी है। भुगतान ज्ञात कीजिए।`,
        `अग्रिम भुगतान के बाद ${p} की राशि बाकी है। इस पर ${r} ब्याज लगता है और इसे ${c.periods} बराबर अवधि-अंत किस्तों में चुकाना है। प्रत्येक किस्त कितनी होगी?`,
        `एक उधारकर्ता ${p} को ${d} में चुकाना चाहता है। दर ${r} है और हर किस्त उस अवधि का ब्याज जुड़ने के बाद दी जाती है। समान किस्त ज्ञात कीजिए।`,
        `भुगतान लेखा: शुरुआती बकाया ${p}; दर ${r}; ${c.periods} बराबर अवधि-अंत भुगतान; अंतिम भुगतान के बाद शेष ₹0। आवर्ती भुगतान ज्ञात कीजिए।`,
        `${p} की बकाया राशि को ${d} में ${c.periods} बराबर किस्तों से चुकाया जाता है। ब्याज ${r} है और हर किस्त अवधि के अंत में दी जाती है। किस्त राशि ज्ञात कीजिए।`,
      ] : [
        `${p} ਦਾ ਕਰਜ਼ਾ ${r} ਵਿਆਜ ਤੇ ਹੈ। ਇਸ ਨੂੰ ${c.periods} ਬਰਾਬਰ ਕਿਸ਼ਤਾਂ ਵਿੱਚ ਚੁਕਾਉਣਾ ਹੈ ਅਤੇ ਹਰ ਕਿਸ਼ਤ ${e} ਦਿੱਤੀ ਜਾਵੇਗੀ। ਹਰ ਕਿਸ਼ਤ ਪਤਾ ਕਰੋ।`,
        `${p} ਬਕਾਇਆ ਹੈ। ${r} ਵਿਆਜ ਜੁੜਨ ਤੋਂ ਬਾਅਦ ${e} ਇੱਕੋ ਜਿਹੀ ਅਦਾਇਗੀ ਕੀਤੀ ਜਾਂਦੀ ਹੈ। ${d} ਬਾਅਦ ਬਕਾਇਆ ਸਿਫ਼ਰ ਹੋਣਾ ਹੈ। ਅਦਾਇਗੀ ਪਤਾ ਕਰੋ।`,
        `ਅਗਾਊਂ ਭੁਗਤਾਨ ਤੋਂ ਬਾਅਦ ${p} ਬਾਕੀ ਹੈ। ਇਸ ਤੇ ${r} ਵਿਆਜ ਲੱਗਦਾ ਹੈ ਅਤੇ ਇਸ ਨੂੰ ${c.periods} ਬਰਾਬਰ ਮਿਆਦ-ਅੰਤ ਕਿਸ਼ਤਾਂ ਵਿੱਚ ਚੁਕਾਇਆ ਜਾਂਦਾ ਹੈ। ਹਰ ਕਿਸ਼ਤ ਕਿੰਨੀ ਹੋਵੇਗੀ?`,
        `ਇੱਕ ਕਰਜ਼ਦਾਰ ${p} ਨੂੰ ${d} ਵਿੱਚ ਚੁਕਾਉਣਾ ਚਾਹੁੰਦਾ ਹੈ। ਦਰ ${r} ਹੈ ਅਤੇ ਹਰ ਕਿਸ਼ਤ ਉਸ ਮਿਆਦ ਦਾ ਵਿਆਜ ਜੁੜਨ ਤੋਂ ਬਾਅਦ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਬਰਾਬਰ ਕਿਸ਼ਤ ਪਤਾ ਕਰੋ।`,
        `ਅਦਾਇਗੀ ਲੇਖਾ: ਸ਼ੁਰੂਆਤੀ ਬਕਾਇਆ ${p}; ਦਰ ${r}; ${c.periods} ਬਰਾਬਰ ਮਿਆਦ-ਅੰਤ ਅਦਾਇਗੀਆਂ; ਆਖਰੀ ਅਦਾਇਗੀ ਤੋਂ ਬਾਅਦ ਬਕਾਇਆ ₹0। ਨਿਯਮਿਤ ਅਦਾਇਗੀ ਪਤਾ ਕਰੋ।`,
        `${p} ਦੀ ਬਕਾਇਆ ਰਕਮ ਨੂੰ ${d} ਵਿੱਚ ${c.periods} ਬਰਾਬਰ ਕਿਸ਼ਤਾਂ ਨਾਲ ਚੁਕਾਇਆ ਜਾਂਦਾ ਹੈ। ਵਿਆਜ ${r} ਹੈ ਅਤੇ ਹਰ ਕਿਸ਼ਤ ਮਿਆਦ ਦੇ ਅੰਤ ਵਿੱਚ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਕਿਸ਼ਤ ਦੀ ਰਕਮ ਪਤਾ ਕਰੋ।`,
      ]; break;
    }
    case "INT-QL-117": {
      const x = money(c.installment), r = rate(c.periodicRatePercent, c.periodUnit, locale), d = duration(c.periods, c.periodUnit, locale), e = endOf(c.periodUnit, locale);
      stems = H ? [
        `एक ऋण ${c.periods} बराबर किस्तों से ठीक-ठीक चुकता होता है। प्रत्येक किस्त ${x} है और ${e} दी जाती है। ब्याज ${r} है। मूल ऋण राशि ज्ञात कीजिए।`,
        `एक कोष ${r} कमाता है और उसमें से ${c.periods} बार ${x} की बराबर निकासी ${e} की जाती है। अंतिम निकासी के बाद कोष शून्य हो जाता है। शुरुआती राशि ज्ञात कीजिए।`,
        `${x} के ${c.periods} अवधि-अंत भुगतान ${d} में ${r} पर एक बकाया राशि को चुकाते हैं। शुरुआती बकाया ज्ञात कीजिए।`,
        `एक बकाया राशि ${x} की ${c.periods} बराबर किस्तों से चुकती है, प्रत्येक किस्त ${e} दी जाती है। दर ${r} है। शुरुआती बकाया ज्ञात कीजिए।`,
        `पुनर्भुगतान लेखा: किस्त ${x}; किस्तों की संख्या ${c.periods}; दर ${r}; अंतिम शेष ₹0। शुरुआती ऋण ज्ञात कीजिए।`,
        `एक निवेश कोष से ${x} की निकासी ${e} ${d} तक की जाती है। कोष ${r} कमाता है। अंतिम निकासी के बाद कुछ न बचे, इसके लिए शुरुआती कोष कितना होना चाहिए?`,
      ] : [
        `ਇੱਕ ਕਰਜ਼ਾ ${c.periods} ਬਰਾਬਰ ਕਿਸ਼ਤਾਂ ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਚੁਕ ਜਾਂਦਾ ਹੈ। ਹਰ ਕਿਸ਼ਤ ${x} ਹੈ ਅਤੇ ${e} ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਵਿਆਜ ${r} ਹੈ। ਮੂਲ ਕਰਜ਼ਾ ਪਤਾ ਕਰੋ।`,
        `ਇੱਕ ਫੰਡ ${r} ਕਮਾਉਂਦਾ ਹੈ ਅਤੇ ਇਸ ਵਿੱਚੋਂ ${c.periods} ਵਾਰ ${x} ਦੀ ਬਰਾਬਰ ਨਿਕਾਸੀ ${e} ਕੀਤੀ ਜਾਂਦੀ ਹੈ। ਆਖਰੀ ਨਿਕਾਸੀ ਤੋਂ ਬਾਅਦ ਫੰਡ ਸਿਫ਼ਰ ਹੋ ਜਾਂਦਾ ਹੈ। ਸ਼ੁਰੂਆਤੀ ਰਕਮ ਪਤਾ ਕਰੋ।`,
        `${x} ਦੀਆਂ ${c.periods} ਮਿਆਦ-ਅੰਤ ਅਦਾਇਗੀਆਂ ${d} ਵਿੱਚ ${r} ਤੇ ਇੱਕ ਬਕਾਇਆ ਰਕਮ ਨੂੰ ਚੁਕਾਉਂਦੀਆਂ ਹਨ। ਸ਼ੁਰੂਆਤੀ ਬਕਾਇਆ ਪਤਾ ਕਰੋ।`,
        `ਇੱਕ ਬਕਾਇਆ ਰਕਮ ${x} ਦੀਆਂ ${c.periods} ਬਰਾਬਰ ਕਿਸ਼ਤਾਂ ਨਾਲ ਚੁਕਦੀ ਹੈ ਅਤੇ ਹਰ ਕਿਸ਼ਤ ${e} ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਦਰ ${r} ਹੈ। ਸ਼ੁਰੂਆਤੀ ਬਕਾਇਆ ਪਤਾ ਕਰੋ।`,
        `ਵਾਪਸੀ ਲੇਖਾ: ਕਿਸ਼ਤ ${x}; ਕਿਸ਼ਤਾਂ ਦੀ ਗਿਣਤੀ ${c.periods}; ਦਰ ${r}; ਆਖਰੀ ਬਕਾਇਆ ₹0। ਸ਼ੁਰੂਆਤੀ ਕਰਜ਼ਾ ਪਤਾ ਕਰੋ।`,
        `ਇੱਕ ਨਿਵੇਸ਼ ਫੰਡ ਵਿੱਚੋਂ ${x} ਦੀ ਨਿਕਾਸੀ ${e} ${d} ਤੱਕ ਕੀਤੀ ਜਾਂਦੀ ਹੈ। ਫੰਡ ${r} ਕਮਾਉਂਦਾ ਹੈ। ਆਖਰੀ ਨਿਕਾਸੀ ਤੋਂ ਬਾਅਦ ਕੁਝ ਨਾ ਬਚੇ, ਇਸ ਲਈ ਸ਼ੁਰੂਆਤੀ ਫੰਡ ਕਿੰਨਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ?`,
      ]; break;
    }
    case "INT-QL-118": {
      const p = money(c.openingBalance), x = money(c.installment), r = rate(c.periodicRatePercent, c.periodUnit, locale), e = endOf(c.periodUnit, locale);
      stems = H ? [
        `ऋण की शुरुआती राशि ${p} है। ${r} ब्याज जुड़ने के बाद ${e} ${x} की किस्त दी जाती है। भुगतान ${c.afterPayments} के तुरंत बाद कितना बकाया रहेगा?`,
        `शुरुआती बकाया ${p}; आवधिक ब्याज ${r}; अवधि-अंत भुगतान ${x}। ${c.afterPayments} भुगतान के तुरंत बाद बकाया राशि ज्ञात कीजिए।`,
        `${p} की बकाया राशि ${x} की बराबर किस्तों से चुकाई जा रही है। दर ${r} है। किस्त ${c.afterPayments} के तुरंत बाद कितनी राशि बाकी है?`,
        `एक उधारकर्ता पर ${p} बकाया है और ${r} ब्याज जुड़ने के बाद ${e} ${x} देता है। भुगतान संख्या ${c.afterPayments} के बाद बकाया ज्ञात कीजिए।`,
        `बकाया लेखा: शुरुआती ऋण ${p}; दर ${r}; नियमित भुगतान ${x}; भुगतान ${c.afterPayments} के तुरंत बाद खाते को देखें। बकाया कितना है?`,
        `एक किस्त खाते की शुरुआत ${p} से होती है। ${e}, ${r} ब्याज जुड़ने के बाद ${x} की किस्त दी जाती है। ${c.afterPayments} भुगतान के बाद शेष राशि ज्ञात कीजिए।`,
      ] : [
        `ਕਰਜ਼ੇ ਦੀ ਸ਼ੁਰੂਆਤੀ ਰਕਮ ${p} ਹੈ। ${r} ਵਿਆਜ ਜੁੜਨ ਤੋਂ ਬਾਅਦ ${e} ${x} ਦੀ ਕਿਸ਼ਤ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਅਦਾਇਗੀ ${c.afterPayments} ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਕਿੰਨਾ ਬਕਾਇਆ ਰਹੇਗਾ?`,
        `ਸ਼ੁਰੂਆਤੀ ਬਕਾਇਆ ${p}; ਮਿਆਦੀ ਵਿਆਜ ${r}; ਮਿਆਦ-ਅੰਤ ਅਦਾਇਗੀ ${x}। ${c.afterPayments} ਅਦਾਇਗੀਆਂ ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਬਕਾਇਆ ਪਤਾ ਕਰੋ।`,
        `${p} ਦੀ ਬਕਾਇਆ ਰਕਮ ${x} ਦੀਆਂ ਬਰਾਬਰ ਕਿਸ਼ਤਾਂ ਨਾਲ ਚੁਕਾਈ ਜਾ ਰਹੀ ਹੈ। ਦਰ ${r} ਹੈ। ਕਿਸ਼ਤ ${c.afterPayments} ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਕਿੰਨੀ ਰਕਮ ਬਾਕੀ ਹੈ?`,
        `ਇੱਕ ਕਰਜ਼ਦਾਰ ਤੇ ${p} ਬਕਾਇਆ ਹੈ ਅਤੇ ${r} ਵਿਆਜ ਜੁੜਨ ਤੋਂ ਬਾਅਦ ${e} ${x} ਦਿੰਦਾ ਹੈ। ਅਦਾਇਗੀ ਨੰਬਰ ${c.afterPayments} ਤੋਂ ਬਾਅਦ ਬਕਾਇਆ ਪਤਾ ਕਰੋ।`,
        `ਬਕਾਇਆ ਲੇਖਾ: ਸ਼ੁਰੂਆਤੀ ਕਰਜ਼ਾ ${p}; ਦਰ ${r}; ਨਿਯਮਿਤ ਅਦਾਇਗੀ ${x}; ਅਦਾਇਗੀ ${c.afterPayments} ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਖਾਤਾ ਵੇਖੋ। ਬਕਾਇਆ ਕਿੰਨਾ ਹੈ?`,
        `ਇੱਕ ਕਿਸ਼ਤ ਖਾਤਾ ${p} ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ। ${e}, ${r} ਵਿਆਜ ਜੁੜਨ ਤੋਂ ਬਾਅਦ ${x} ਦੀ ਕਿਸ਼ਤ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ${c.afterPayments} ਅਦਾਇਗੀਆਂ ਤੋਂ ਬਾਅਦ ਬਾਕੀ ਰਕਮ ਪਤਾ ਕਰੋ।`,
      ]; break;
    }
    case "INT-QL-119": {
      const p = money(c.openingBalance), x = money(c.regularInstallment), r = rate(c.periodicRatePercent, c.periodUnit, locale), earlier = c.periods - 1;
      stems = H ? [
        `${p} के ऋण पर ${r} ब्याज लगता है। पहले ${earlier} अवधि-अंत भुगतान ${x} के हैं। ऋण को पूरा चुकाने वाला अंतिम भुगतान ज्ञात कीजिए।`,
        `${p} को ${c.periods} अवधियों में ${r} पर चुकाया जाता है। पहले ${earlier} भुगतान ${x} के हैं, अंतिम भुगतान अलग हो सकता है। अंतिम भुगतान कितना होगा?`,
        `${p} की बकाया राशि पर ${r} लगता है। ${x} की ${earlier} नियमित किस्तों के बाद अगली अवधि के अंत में एक समापन किस्त देनी है। उसे ज्ञात कीजिए।`,
        `खाता ${p} से शुरू होता है। हर भुगतान से पहले ${r} ब्याज जुड़ता है। ${x} के ${earlier} भुगतान के बाद अंतिम अवधि के अंत में कितनी राशि देने से बकाया शून्य होगा?`,
        `पुनर्भुगतान लेखा: शुरुआती ${p}; दर ${r}; पहले ${earlier} भुगतान ${x}; अंतिम शेष ₹0। अंतिम समायोजन भुगतान ज्ञात कीजिए।`,
        `${p} की बकाया राशि पर ${r} ब्याज है। ${x} की ${earlier} तय किस्तों के बाद एक समापन भुगतान देना है। उस भुगतान की गणना कीजिए।`,
      ] : [
        `${p} ਦੇ ਕਰਜ਼ੇ ਤੇ ${r} ਵਿਆਜ ਲੱਗਦਾ ਹੈ। ਪਹਿਲੀਆਂ ${earlier} ਮਿਆਦ-ਅੰਤ ਅਦਾਇਗੀਆਂ ${x} ਦੀਆਂ ਹਨ। ਕਰਜ਼ਾ ਪੂਰਾ ਚੁਕਾਉਣ ਵਾਲੀ ਆਖਰੀ ਅਦਾਇਗੀ ਪਤਾ ਕਰੋ।`,
        `${p} ਨੂੰ ${c.periods} ਮਿਆਦਾਂ ਵਿੱਚ ${r} ਤੇ ਚੁਕਾਇਆ ਜਾਂਦਾ ਹੈ। ਪਹਿਲੀਆਂ ${earlier} ਅਦਾਇਗੀਆਂ ${x} ਦੀਆਂ ਹਨ, ਆਖਰੀ ਅਦਾਇਗੀ ਵੱਖ ਹੋ ਸਕਦੀ ਹੈ। ਆਖਰੀ ਅਦਾਇਗੀ ਕਿੰਨੀ ਹੋਵੇਗੀ?`,
        `${p} ਦੀ ਬਕਾਇਆ ਰਕਮ ਤੇ ${r} ਲੱਗਦਾ ਹੈ। ${x} ਦੀਆਂ ${earlier} ਨਿਯਮਿਤ ਕਿਸ਼ਤਾਂ ਤੋਂ ਬਾਅਦ ਅਗਲੀ ਮਿਆਦ ਦੇ ਅੰਤ ਵਿੱਚ ਇੱਕ ਸਮਾਪਤੀ ਕਿਸ਼ਤ ਦੇਣੀ ਹੈ। ਉਹ ਪਤਾ ਕਰੋ।`,
        `ਖਾਤਾ ${p} ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ। ਹਰ ਅਦਾਇਗੀ ਤੋਂ ਪਹਿਲਾਂ ${r} ਵਿਆਜ ਜੁੜਦਾ ਹੈ। ${x} ਦੀਆਂ ${earlier} ਅਦਾਇਗੀਆਂ ਤੋਂ ਬਾਅਦ ਆਖਰੀ ਮਿਆਦ ਦੇ ਅੰਤ ਵਿੱਚ ਕਿੰਨੀ ਰਕਮ ਦੇਣ ਨਾਲ ਬਕਾਇਆ ਸਿਫ਼ਰ ਹੋਵੇਗਾ?`,
        `ਵਾਪਸੀ ਲੇਖਾ: ਸ਼ੁਰੂਆਤੀ ${p}; ਦਰ ${r}; ਪਹਿਲੀਆਂ ${earlier} ਅਦਾਇਗੀਆਂ ${x}; ਆਖਰੀ ਬਕਾਇਆ ₹0। ਆਖਰੀ ਸਮਾਇਕ ਅਦਾਇਗੀ ਪਤਾ ਕਰੋ।`,
        `${p} ਦੀ ਬਕਾਇਆ ਰਕਮ ਤੇ ${r} ਵਿਆਜ ਹੈ। ${x} ਦੀਆਂ ${earlier} ਨਿਯਤ ਕਿਸ਼ਤਾਂ ਤੋਂ ਬਾਅਦ ਇੱਕ ਸਮਾਪਤੀ ਅਦਾਇਗੀ ਦੇਣੀ ਹੈ। ਉਸ ਅਦਾਇਗੀ ਦੀ ਗਣਨਾ ਕਰੋ।`,
      ]; break;
    }
    case "INT-QL-120": {
      const p = money(c.openingBalance), r = rate(c.periodicRatePercent, c.periodUnit, locale), d = duration(c.periods, c.periodUnit, locale), s = startOf(c.periodUnit, locale);
      stems = H ? [
        `${p} का ऋण ${c.periods} बराबर किस्तों से चुकाया जाता है, हर किस्त ${s} दी जाती है। दर ${r} है। प्रत्येक किस्त ज्ञात कीजिए।`,
        `हर अवधि में ब्याज लगने से पहले भुगतान किया जाता है। ${p} को ${d} में ${r} पर चुकाने वाला समान शुरुआती भुगतान ज्ञात कीजिए।`,
        `${p} की बकाया राशि ${c.periods} बराबर किस्तों से चुकती है और पहली किस्त तुरंत देनी है। ब्याज ${r} है। किस्त ज्ञात कीजिए।`,
        `उधारकर्ता ${s} भुगतान करता है और फिर घटे हुए बकाया पर ${r} ब्याज लगता है। ${c.periods} बराबर भुगतान ${p} को चुकाते हैं। प्रत्येक भुगतान ज्ञात कीजिए।`,
        `बकाया लेखा भुगतान-पहले-ब्याज क्रम का है: शुरुआती ${p}; ${c.periods} बराबर भुगतान; दर ${r}; अंतिम शेष ₹0। नियमित भुगतान ज्ञात कीजिए।`,
        `किस्त योजना ${p} की बकाया राशि पर तुरंत शुरू होती है। ${c.periods} बराबर भुगतान ${s} किए जाते हैं और दर ${r} है। प्रत्येक किस्त कितनी है?`,
      ] : [
        `${p} ਦਾ ਕਰਜ਼ਾ ${c.periods} ਬਰਾਬਰ ਕਿਸ਼ਤਾਂ ਨਾਲ ਚੁਕਾਇਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਹਰ ਕਿਸ਼ਤ ${s} ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਦਰ ${r} ਹੈ। ਹਰ ਕਿਸ਼ਤ ਪਤਾ ਕਰੋ।`,
        `ਹਰ ਮਿਆਦ ਵਿੱਚ ਵਿਆਜ ਲੱਗਣ ਤੋਂ ਪਹਿਲਾਂ ਅਦਾਇਗੀ ਕੀਤੀ ਜਾਂਦੀ ਹੈ। ${p} ਨੂੰ ${d} ਵਿੱਚ ${r} ਤੇ ਚੁਕਾਉਣ ਵਾਲੀ ਬਰਾਬਰ ਸ਼ੁਰੂਆਤੀ ਅਦਾਇਗੀ ਪਤਾ ਕਰੋ।`,
        `${p} ਦੀ ਬਕਾਇਆ ਰਕਮ ${c.periods} ਬਰਾਬਰ ਕਿਸ਼ਤਾਂ ਨਾਲ ਚੁਕਦੀ ਹੈ ਅਤੇ ਪਹਿਲੀ ਕਿਸ਼ਤ ਤੁਰੰਤ ਦੇਣੀ ਹੈ। ਵਿਆਜ ${r} ਹੈ। ਕਿਸ਼ਤ ਪਤਾ ਕਰੋ।`,
        `ਕਰਜ਼ਦਾਰ ${s} ਅਦਾਇਗੀ ਕਰਦਾ ਹੈ ਅਤੇ ਫਿਰ ਘਟੇ ਹੋਏ ਬਕਾਇਆ ਤੇ ${r} ਵਿਆਜ ਲੱਗਦਾ ਹੈ। ${c.periods} ਬਰਾਬਰ ਅਦਾਇਗੀਆਂ ${p} ਨੂੰ ਚੁਕਾਉਂਦੀਆਂ ਹਨ। ਹਰ ਅਦਾਇਗੀ ਪਤਾ ਕਰੋ।`,
        `ਬਕਾਇਆ ਲੇਖਾ ਅਦਾਇਗੀ-ਪਹਿਲਾਂ-ਵਿਆਜ ਕ੍ਰਮ ਦਾ ਹੈ: ਸ਼ੁਰੂਆਤੀ ${p}; ${c.periods} ਬਰਾਬਰ ਅਦਾਇਗੀਆਂ; ਦਰ ${r}; ਆਖਰੀ ਬਕਾਇਆ ₹0। ਨਿਯਮਿਤ ਅਦਾਇਗੀ ਪਤਾ ਕਰੋ।`,
        `ਕਿਸ਼ਤ ਯੋਜਨਾ ${p} ਦੀ ਬਕਾਇਆ ਰਕਮ ਤੇ ਤੁਰੰਤ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ। ${c.periods} ਬਰਾਬਰ ਅਦਾਇਗੀਆਂ ${s} ਕੀਤੀਆਂ ਜਾਂਦੀਆਂ ਹਨ ਅਤੇ ਦਰ ${r} ਹੈ। ਹਰ ਕਿਸ਼ਤ ਕਿੰਨੀ ਹੈ?`,
      ]; break;
    }
    case "INT-QL-121": {
      const p = money(c.openingBalance), x = money(c.installment), e = endOf(c.periodUnit, locale);
      stems = H ? [
        `${p} का ऋण ${x} की ${c.periods} बराबर किस्तों से ठीक-ठीक चुकता होता है, प्रत्येक किस्त ${e} दी जाती है। प्रति ${unit(c.periodUnit, locale)} ब्याज दर ज्ञात कीजिए।`,
        `${p} को ${c.periods} अवधियों में ${x} के बराबर अवधि-अंत भुगतान से चुकाया जाता है। अंतिम बकाया ठीक शून्य होने वाली आवधिक ब्याज दर ज्ञात कीजिए।`,
        `${p} की बकाया राशि ${x} की ${c.periods} बराबर किस्तों से चुकती है। भुगतान ${e} होते हैं। सही आवधिक दर ज्ञात कीजिए।`,
        `शुरुआती ऋण ${p} है और ${x} के ${c.periods} अवधि-अंत भुगतान खाते को ठीक शून्य कर देते हैं। आवधिक ब्याज दर ज्ञात कीजिए।`,
        `पुनर्भुगतान लेखा: शुरुआती ${p}; किस्त ${x}; संख्या ${c.periods}; अंतिम शेष ₹0। इस कार्यक्रम से मेल खाने वाली आवधिक ब्याज दर कौन-सी है?`,
        `${p} की बकाया राशि ${c.periods} अवधियों के लिए है। समान भुगतान ${x} है और हर अवधि के ब्याज के बाद दिया जाता है। प्रति ${unit(c.periodUnit, locale)} ब्याज दर ज्ञात कीजिए।`,
      ] : [
        `${p} ਦਾ ਕਰਜ਼ਾ ${x} ਦੀਆਂ ${c.periods} ਬਰਾਬਰ ਕਿਸ਼ਤਾਂ ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਚੁਕ ਜਾਂਦਾ ਹੈ ਅਤੇ ਹਰ ਕਿਸ਼ਤ ${e} ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਪ੍ਰਤੀ ${unit(c.periodUnit, locale)} ਵਿਆਜ ਦਰ ਪਤਾ ਕਰੋ।`,
        `${p} ਨੂੰ ${c.periods} ਮਿਆਦਾਂ ਵਿੱਚ ${x} ਦੀਆਂ ਬਰਾਬਰ ਮਿਆਦ-ਅੰਤ ਅਦਾਇਗੀਆਂ ਨਾਲ ਚੁਕਾਇਆ ਜਾਂਦਾ ਹੈ। ਆਖਰੀ ਬਕਾਇਆ ਬਿਲਕੁਲ ਸਿਫ਼ਰ ਕਰਨ ਵਾਲੀ ਮਿਆਦੀ ਵਿਆਜ ਦਰ ਪਤਾ ਕਰੋ।`,
        `${p} ਦੀ ਬਕਾਇਆ ਰਕਮ ${x} ਦੀਆਂ ${c.periods} ਬਰਾਬਰ ਕਿਸ਼ਤਾਂ ਨਾਲ ਚੁਕਦੀ ਹੈ। ਅਦਾਇਗੀਆਂ ${e} ਹੁੰਦੀਆਂ ਹਨ। ਸਹੀ ਮਿਆਦੀ ਦਰ ਪਤਾ ਕਰੋ।`,
        `ਸ਼ੁਰੂਆਤੀ ਕਰਜ਼ਾ ${p} ਹੈ ਅਤੇ ${x} ਦੀਆਂ ${c.periods} ਮਿਆਦ-ਅੰਤ ਅਦਾਇਗੀਆਂ ਖਾਤੇ ਨੂੰ ਬਿਲਕੁਲ ਸਿਫ਼ਰ ਕਰ ਦਿੰਦੀਆਂ ਹਨ। ਮਿਆਦੀ ਵਿਆਜ ਦਰ ਪਤਾ ਕਰੋ।`,
        `ਵਾਪਸੀ ਲੇਖਾ: ਸ਼ੁਰੂਆਤੀ ${p}; ਕਿਸ਼ਤ ${x}; ਗਿਣਤੀ ${c.periods}; ਆਖਰੀ ਬਕਾਇਆ ₹0। ਇਸ ਕਾਰਜਕ੍ਰਮ ਨਾਲ ਮਿਲਦੀ ਮਿਆਦੀ ਵਿਆਜ ਦਰ ਕਿਹੜੀ ਹੈ?`,
        `${p} ਦੀ ਬਕਾਇਆ ਰਕਮ ${c.periods} ਮਿਆਦਾਂ ਲਈ ਹੈ। ਬਰਾਬਰ ਅਦਾਇਗੀ ${x} ਹੈ ਅਤੇ ਹਰ ਮਿਆਦ ਦੇ ਵਿਆਜ ਤੋਂ ਬਾਅਦ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਪ੍ਰਤੀ ${unit(c.periodUnit, locale)} ਵਿਆਜ ਦਰ ਪਤਾ ਕਰੋ।`,
      ]; break;
    }
    case "INT-QL-122": {
      const d = money(c.deposit), r = rate(c.periodicRatePercent, c.periodUnit, locale), e = endOf(c.periodUnit, locale), dur = duration(c.periods, c.periodUnit, locale);
      stems = H ? [
        `${d} ${e} ${dur} तक जमा किया जाता है। कोष ${r} कमाता है। अंतिम जमा के तुरंत बाद शेष राशि ज्ञात कीजिए।`,
        `एक बचतकर्ता ${e} कोष में ${d} जोड़ता है। कोष ${r} कमाता है। ${c.periods} जमा के बाद संचित राशि कितनी होगी?`,
        `एक आवर्ती बचत योजना में ${d} के ${c.periods} बराबर अवधि-अंत जमा किए जाते हैं और दर ${r} है। जमा संख्या ${c.periods} के तुरंत बाद परिपक्वता राशि ज्ञात कीजिए।`,
        `कोष शून्य से शुरू होता है, ${r} कमाता है और ${e} ${d} जमा होता है। ${dur} बाद कोष की राशि ज्ञात कीजिए।`,
        `बचत लेखा: शुरुआती ₹0; दर ${r}; हर अवधि-अंत जमा ${d}; कुल ${c.periods} जमा। अंतिम कोष ज्ञात कीजिए।`,
        `एक अवधि-अंत जमा योजना ${dur} तक चलती है। प्रत्येक जमा ${d} है और ब्याज ${r} है। अंतिम जमा के तुरंत बाद संचित राशि ज्ञात कीजिए।`,
      ] : [
        `${d} ${e} ${dur} ਤੱਕ ਜਮ੍ਹਾਂ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਫੰਡ ${r} ਕਮਾਉਂਦਾ ਹੈ। ਆਖਰੀ ਜਮ੍ਹਾਂ ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਬਕਾਇਆ ਰਕਮ ਪਤਾ ਕਰੋ।`,
        `ਇੱਕ ਬਚਤਕਾਰ ${e} ਫੰਡ ਵਿੱਚ ${d} ਜੋੜਦਾ ਹੈ। ਫੰਡ ${r} ਕਮਾਉਂਦਾ ਹੈ। ${c.periods} ਜਮ੍ਹਾਂ ਤੋਂ ਬਾਅਦ ਇਕੱਠੀ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ?`,
        `ਇੱਕ ਆਵਰਤੀ ਬਚਤ ਯੋਜਨਾ ਵਿੱਚ ${d} ਦੀਆਂ ${c.periods} ਬਰਾਬਰ ਮਿਆਦ-ਅੰਤ ਜਮ੍ਹਾਂ ਰਕਮਾਂ ਹਨ ਅਤੇ ਦਰ ${r} ਹੈ। ਜਮ੍ਹਾਂ ਨੰਬਰ ${c.periods} ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਮਿਆਦੀ ਰਕਮ ਪਤਾ ਕਰੋ।`,
        `ਫੰਡ ਸਿਫ਼ਰ ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ, ${r} ਕਮਾਉਂਦਾ ਹੈ ਅਤੇ ${e} ${d} ਜਮ੍ਹਾਂ ਹੁੰਦਾ ਹੈ। ${dur} ਬਾਅਦ ਫੰਡ ਦੀ ਰਕਮ ਪਤਾ ਕਰੋ।`,
        `ਬਚਤ ਲੇਖਾ: ਸ਼ੁਰੂਆਤੀ ₹0; ਦਰ ${r}; ਹਰ ਮਿਆਦ-ਅੰਤ ਜਮ੍ਹਾਂ ${d}; ਕੁੱਲ ${c.periods} ਜਮ੍ਹਾਂ। ਆਖਰੀ ਫੰਡ ਪਤਾ ਕਰੋ।`,
        `ਇੱਕ ਮਿਆਦ-ਅੰਤ ਜਮ੍ਹਾਂ ਯੋਜਨਾ ${dur} ਤੱਕ ਚੱਲਦੀ ਹੈ। ਹਰ ਜਮ੍ਹਾਂ ${d} ਹੈ ਅਤੇ ਵਿਆਜ ${r} ਹੈ। ਆਖਰੀ ਜਮ੍ਹਾਂ ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਇਕੱਠੀ ਰਕਮ ਪਤਾ ਕਰੋ।`,
      ]; break;
    }
    case "INT-QL-123": {
      const x = money(c.installment), r = rate(c.periodicRatePercent, c.periodUnit, locale), m = c.missedPaymentNumber;
      stems = H ? [
        `${c.periods} भुगतान वाली ऋण योजना में ${x} की बराबर अवधि-अंत किस्तें हैं और दर ${r} है। किस्त ${m} छूट जाती है। ऋण चुकाने के लिए अंतिम तय किस्त के साथ कितनी अतिरिक्त राशि देनी होगी?`,
        `${c.periods} बराबर भुगतान वाली योजना में भुगतान ${m} नहीं किया गया। नियमित भुगतान ${x} है और दर ${r} है। अंतिम भुगतान के साथ आवश्यक अतिरिक्त राशि ज्ञात कीजिए।`,
        `एक किस्त योजना में ${x} के ${c.periods} बराबर भुगतान हैं और दर ${r} है। भुगतान ${m} नहीं किया गया। अंतिम देय तिथि पर सामान्य अंतिम किस्त के अतिरिक्त कितनी राशि चाहिए?`,
        `उधारकर्ता ${c.periods} किस्तों की अवधि-अंत योजना में किस्त ${m} चूक जाता है। हर सामान्य किस्त ${x} है और ब्याज ${r} है। अंतिम किस्त के साथ देय अतिरिक्त राशि ज्ञात कीजिए।`,
        `भुगतान लेखा: ${x} के ${c.periods} तय भुगतान; दर ${r}; भुगतान ${m} छूटा; बाद के नियमित भुगतान किए गए। अंतिम अतिरिक्त समायोजन राशि ज्ञात कीजिए।`,
        `उधारकर्ता ${x} की भुगतान संख्या ${m} को ${c.periods}-भुगतान योजना में छोड़ देता है। दर ${r} है। मूल अंतिम तिथि पर खाता चुकाने के लिए अतिरिक्त कितनी राशि देनी होगी?`,
      ] : [
        `${c.periods} ਅਦਾਇਗੀਆਂ ਵਾਲੀ ਕਰਜ਼ਾ ਯੋਜਨਾ ਵਿੱਚ ${x} ਦੀਆਂ ਬਰਾਬਰ ਮਿਆਦ-ਅੰਤ ਕਿਸ਼ਤਾਂ ਹਨ ਅਤੇ ਦਰ ${r} ਹੈ। ਕਿਸ਼ਤ ${m} ਰਹਿ ਜਾਂਦੀ ਹੈ। ਕਰਜ਼ਾ ਚੁਕਾਉਣ ਲਈ ਆਖਰੀ ਨਿਯਤ ਕਿਸ਼ਤ ਨਾਲ ਕਿੰਨੀ ਵਾਧੂ ਰਕਮ ਦੇਣੀ ਪਵੇਗੀ?`,
        `${c.periods} ਬਰਾਬਰ ਅਦਾਇਗੀਆਂ ਵਾਲੀ ਯੋਜਨਾ ਵਿੱਚ ਅਦਾਇਗੀ ${m} ਨਹੀਂ ਕੀਤੀ ਗਈ। ਨਿਯਮਿਤ ਅਦਾਇਗੀ ${x} ਹੈ ਅਤੇ ਦਰ ${r} ਹੈ। ਆਖਰੀ ਅਦਾਇਗੀ ਨਾਲ ਲੋੜੀਂਦੀ ਵਾਧੂ ਰਕਮ ਪਤਾ ਕਰੋ।`,
        `ਇੱਕ ਕਿਸ਼ਤ ਯੋਜਨਾ ਵਿੱਚ ${x} ਦੀਆਂ ${c.periods} ਬਰਾਬਰ ਅਦਾਇਗੀਆਂ ਹਨ ਅਤੇ ਦਰ ${r} ਹੈ। ਅਦਾਇਗੀ ${m} ਨਹੀਂ ਕੀਤੀ ਗਈ। ਆਖਰੀ ਨਿਯਤ ਮਿਤੀ ਤੇ ਆਮ ਆਖਰੀ ਕਿਸ਼ਤ ਤੋਂ ਇਲਾਵਾ ਕਿੰਨੀ ਰਕਮ ਚਾਹੀਦੀ ਹੈ?`,
        `ਕਰਜ਼ਦਾਰ ${c.periods} ਕਿਸ਼ਤਾਂ ਦੀ ਮਿਆਦ-ਅੰਤ ਯੋਜਨਾ ਵਿੱਚ ਕਿਸ਼ਤ ${m} ਛੱਡ ਦਿੰਦਾ ਹੈ। ਹਰ ਆਮ ਕਿਸ਼ਤ ${x} ਹੈ ਅਤੇ ਵਿਆਜ ${r} ਹੈ। ਆਖਰੀ ਕਿਸ਼ਤ ਨਾਲ ਦੇਣੀ ਵਾਧੂ ਰਕਮ ਪਤਾ ਕਰੋ।`,
        `ਅਦਾਇਗੀ ਲੇਖਾ: ${x} ਦੀਆਂ ${c.periods} ਨਿਯਤ ਅਦਾਇਗੀਆਂ; ਦਰ ${r}; ਅਦਾਇਗੀ ${m} ਛੁੱਟੀ; ਬਾਅਦ ਦੀਆਂ ਨਿਯਮਿਤ ਅਦਾਇਗੀਆਂ ਕੀਤੀਆਂ ਗਈਆਂ। ਆਖਰੀ ਵਾਧੂ ਸਮਾਇਕ ਰਕਮ ਪਤਾ ਕਰੋ।`,
        `ਕਰਜ਼ਦਾਰ ${x} ਦੀ ਅਦਾਇਗੀ ਨੰਬਰ ${m} ਨੂੰ ${c.periods}-ਅਦਾਇਗੀ ਯੋਜਨਾ ਵਿੱਚ ਛੱਡ ਦਿੰਦਾ ਹੈ। ਦਰ ${r} ਹੈ। ਮੂਲ ਆਖਰੀ ਮਿਤੀ ਤੇ ਖਾਤਾ ਚੁਕਾਉਣ ਲਈ ਹੋਰ ਕਿੰਨੀ ਰਕਮ ਦੇਣੀ ਪਵੇਗੀ?`,
      ]; break;
    }
    case "INT-QL-124": {
      const p = money(c.openingBalance), a = rate(c.rateAPercent, c.periodUnit, locale), b = rate(c.rateBPercent, c.periodUnit, locale), dur = duration(c.periods, c.periodUnit, locale);
      stems = H ? [
        `समान ऋण राशि ${p} को ${c.periods} बराबर अवधि-अंत किस्तों में चुकाया जाता है। योजना A की दर ${a} और योजना B की दर ${b} है। दोनों किस्त राशियों का परम अंतर ज्ञात कीजिए।`,
        `${p} के लिए ${dur} की दो पुनर्भुगतान योजनाओं की तुलना कीजिए। दोनों में बराबर अवधि-अंत किस्तें हैं; दरें ${a} और ${b} हैं। आवश्यक किस्तों में कितना अंतर है?`,
        `${p} की बकाया राशि को ${dur} की दो योजनाओं से चुकाया जा सकता है। एक दर ${a}, दूसरी ${b} है। बराबर अवधि-अंत किस्तों का अंतर ज्ञात कीजिए।`,
        `${p} के शुरुआती ऋण के लिए, ${c.periods} अवधि-अंत भुगतान दोनों स्थितियों में समान रहते हैं। दर ${a} से ${b} होने पर समान आवधिक भुगतान में कितना बदलाव आता है?`,
        `तुलना लेखा: शुरुआती ${p}; ${c.periods} अवधि-अंत भुगतान; दर A ${a}; दर B ${b}। भुगतान का परम अंतर ज्ञात कीजिए।`,
        `दो वित्त योजनाएँ समान ${p} की बकाया राशि को ${dur} के लिए कवर करती हैं। दोनों में बराबर अवधि-अंत किस्तें हैं; दरें ${a} और ${b} हैं। किस्तों का अंतर ज्ञात कीजिए।`,
      ] : [
        `ਇੱਕੋ ਕਰਜ਼ਾ ਰਕਮ ${p} ਨੂੰ ${c.periods} ਬਰਾਬਰ ਮਿਆਦ-ਅੰਤ ਕਿਸ਼ਤਾਂ ਵਿੱਚ ਚੁਕਾਇਆ ਜਾਂਦਾ ਹੈ। ਯੋਜਨਾ A ਦੀ ਦਰ ${a} ਅਤੇ ਯੋਜਨਾ B ਦੀ ਦਰ ${b} ਹੈ। ਦੋਵਾਂ ਕਿਸ਼ਤ ਰਕਮਾਂ ਦਾ ਪੂਰਨ ਅੰਤਰ ਪਤਾ ਕਰੋ।`,
        `${p} ਲਈ ${dur} ਦੀਆਂ ਦੋ ਵਾਪਸੀ ਯੋਜਨਾਵਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ। ਦੋਵਾਂ ਵਿੱਚ ਬਰਾਬਰ ਮਿਆਦ-ਅੰਤ ਕਿਸ਼ਤਾਂ ਹਨ; ਦਰਾਂ ${a} ਅਤੇ ${b} ਹਨ। ਲੋੜੀਂਦੀਆਂ ਕਿਸ਼ਤਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੈ?`,
        `${p} ਦੀ ਬਕਾਇਆ ਰਕਮ ਨੂੰ ${dur} ਦੀਆਂ ਦੋ ਯੋਜਨਾਵਾਂ ਨਾਲ ਚੁਕਾਇਆ ਜਾ ਸਕਦਾ ਹੈ। ਇੱਕ ਦਰ ${a}, ਦੂਜੀ ${b} ਹੈ। ਬਰਾਬਰ ਮਿਆਦ-ਅੰਤ ਕਿਸ਼ਤਾਂ ਦਾ ਅੰਤਰ ਪਤਾ ਕਰੋ।`,
        `${p} ਦੇ ਸ਼ੁਰੂਆਤੀ ਕਰਜ਼ੇ ਲਈ, ${c.periods} ਮਿਆਦ-ਅੰਤ ਅਦਾਇਗੀਆਂ ਦੋਵਾਂ ਹਾਲਤਾਂ ਵਿੱਚ ਇੱਕੋ ਹਨ। ਦਰ ${a} ਤੋਂ ${b} ਹੋਣ ਤੇ ਬਰਾਬਰ ਮਿਆਦੀ ਅਦਾਇਗੀ ਵਿੱਚ ਕਿੰਨਾ ਬਦਲਾਅ ਆਉਂਦਾ ਹੈ?`,
        `ਤੁਲਨਾ ਲੇਖਾ: ਸ਼ੁਰੂਆਤੀ ${p}; ${c.periods} ਮਿਆਦ-ਅੰਤ ਅਦਾਇਗੀਆਂ; ਦਰ A ${a}; ਦਰ B ${b}। ਅਦਾਇਗੀ ਦਾ ਪੂਰਨ ਅੰਤਰ ਪਤਾ ਕਰੋ।`,
        `ਦੋ ਵਿੱਤੀ ਯੋਜਨਾਵਾਂ ਇੱਕੋ ${p} ਦੀ ਬਕਾਇਆ ਰਕਮ ਨੂੰ ${dur} ਲਈ ਕਵਰ ਕਰਦੀਆਂ ਹਨ। ਦੋਵਾਂ ਵਿੱਚ ਬਰਾਬਰ ਮਿਆਦ-ਅੰਤ ਕਿਸ਼ਤਾਂ ਹਨ; ਦਰਾਂ ${a} ਅਤੇ ${b} ਹਨ। ਕਿਸ਼ਤਾਂ ਦਾ ਅੰਤਰ ਪਤਾ ਕਰੋ।`,
      ]; break;
    }
  }
  const selected = stems[f];
  if (!selected) throw new Error(`${source.qlId}/${source.seed}: missing localized stem family ${f + 1}`);
  return `${selected}${roundingNote(source, locale)}`;
}

function explanationFor(source: any, locale: IntCp008LocalizedLocale) {
  const c = source.mathematicalState.contractState as any;
  const H = hi(locale);
  const steps: string[] = [];
  let keyIdea = "", commonMistake = "";
  const sm = (i: number) => mathSegments(String(source.explanation.steps[i] ?? ""));
  const moneyIn = (i: number) => moneyTokens(String(source.explanation.steps[i] ?? ""));

  switch (source.qlId as IntCp008QlId) {
    case "INT-QL-116": {
      const m1 = sm(1), m2 = sm(2), m3 = sm(3);
      if (m1.length < 1 || m2.length < 2 || m3.length < 2) throw new Error(`${source.qlId}/${source.seed}: missing approved math segments`);
      keyIdea = H ? "हर किस्त उस अवधि का ब्याज जुड़ने के बाद दी जाती है, इसलिए एक ही किस्त राशि को अवधि-अंत पुनर्भुगतान क्रम से पूरा बकाया समाप्त करना चाहिए।" : "ਹਰ ਕਿਸ਼ਤ ਉਸ ਮਿਆਦ ਦਾ ਵਿਆਜ ਜੁੜਨ ਤੋਂ ਬਾਅਦ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ, ਇਸ ਲਈ ਇੱਕੋ ਕਿਸ਼ਤ ਰਕਮ ਨੂੰ ਮਿਆਦ-ਅੰਤ ਵਾਪਸੀ ਕ੍ਰਮ ਨਾਲ ਪੂਰਾ ਬਕਾਇਆ ਖਤਮ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ।";
      steps.push(
        H ? `हमें ऐसी समान किस्त चाहिए जो ${money(c.openingBalance)} के शुरुआती बकाया को ${c.periods} भुगतान के बाद शून्य कर दे।` : `ਸਾਨੂੰ ਐਸੀ ਬਰਾਬਰ ਕਿਸ਼ਤ ਚਾਹੀਦੀ ਹੈ ਜੋ ${money(c.openingBalance)} ਦੇ ਸ਼ੁਰੂਆਤੀ ਬਕਾਇਆ ਨੂੰ ${c.periods} ਅਦਾਇਗੀਆਂ ਤੋਂ ਬਾਅਦ ਸਿਫ਼ਰ ਕਰ ਦੇਵੇ।`,
        H ? `आवधिक दर ${percent(c.periodicRatePercent)} है, इसलिए ${m1[0]}।` : `ਮਿਆਦੀ ਦਰ ${percent(c.periodicRatePercent)} ਹੈ, ਇਸ ਲਈ ${m1[0]}।`,
        H ? `अवधि-अंत भुगतान के लिए ${m2[0]}। ${c.periods}वें भुगतान के बाद शेष शून्य रखने पर ${m2[1]} मिलता है।` : `ਮਿਆਦ-ਅੰਤ ਅਦਾਇਗੀ ਲਈ ${m2[0]}। ${c.periods}ਵੀਂ ਅਦਾਇਗੀ ਤੋਂ ਬਾਅਦ ਬਕਾਇਆ ਸਿਫ਼ਰ ਰੱਖਣ ਤੇ ${m2[1]} ਮਿਲਦਾ ਹੈ।`,
        H ? `यहाँ ${m3[0]} और ${m3[1]}। शुरुआती बकाया रखने पर समान किस्त ${source.correctAnswer} आती है।` : `ਇੱਥੇ ${m3[0]} ਅਤੇ ${m3[1]}। ਸ਼ੁਰੂਆਤੀ ਬਕਾਇਆ ਰੱਖਣ ਤੇ ਬਰਾਬਰ ਕਿਸ਼ਤ ${source.correctAnswer} ਆਉਂਦੀ ਹੈ।`,
        H ? `${source.correctAnswer} की हर किस्त देने पर अंतिम भुगतान के बाद बकाया ठीक शून्य हो जाता है।` : `${source.correctAnswer} ਦੀ ਹਰ ਕਿਸ਼ਤ ਦੇਣ ਨਾਲ ਆਖਰੀ ਅਦਾਇਗੀ ਤੋਂ ਬਾਅਦ ਬਕਾਇਆ ਬਿਲਕੁਲ ਸਿਫ਼ਰ ਹੋ ਜਾਂਦਾ ਹੈ।`,
      );
      commonMistake = H ? "मूल राशि को केवल किस्तों की संख्या से न बाँटें। हर भुगतान से पहले बकाया राशि पर ब्याज लगता है।" : "ਮੂਲ ਰਕਮ ਨੂੰ ਸਿਰਫ਼ ਕਿਸ਼ਤਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਨਾ ਵੰਡੋ। ਹਰ ਅਦਾਇਗੀ ਤੋਂ ਪਹਿਲਾਂ ਬਕਾਇਆ ਰਕਮ ਤੇ ਵਿਆਜ ਲੱਗਦਾ ਹੈ।";
      break;
    }
    case "INT-QL-117": {
      const m1 = sm(1), m2 = sm(2), m3 = sm(3);
      if (m1.length < 1 || m2.length < 1 || m3.length < 1) throw new Error(`${source.qlId}/${source.seed}: missing approved math segments`);
      keyIdea = H ? "बराबर अवधि-अंत नकदी प्रवाह से पीछे की ओर काम करके वह एकल शुरुआती राशि निकालें जिसे ये भुगतान ठीक-ठीक समाप्त करते हैं।" : "ਬਰਾਬਰ ਮਿਆਦ-ਅੰਤ ਨਕਦੀ ਪ੍ਰਵਾਹ ਤੋਂ ਪਿੱਛੇ ਵੱਲ ਕੰਮ ਕਰਕੇ ਉਹ ਇਕੱਲੀ ਸ਼ੁਰੂਆਤੀ ਰਕਮ ਕੱਢੋ ਜਿਸ ਨੂੰ ਇਹ ਅਦਾਇਗੀਆਂ ਬਿਲਕੁਲ ਖਤਮ ਕਰਦੀਆਂ ਹਨ।";
      steps.push(
        H ? `कार्यक्रम में ${c.periods} बराबर भुगतान या निकासी ${money(c.installment)} की हैं और शुरुआती बकाया पूछा गया है।` : `ਕਾਰਜਕ੍ਰਮ ਵਿੱਚ ${c.periods} ਬਰਾਬਰ ਅਦਾਇਗੀਆਂ ਜਾਂ ਨਿਕਾਸੀਆਂ ${money(c.installment)} ਦੀਆਂ ਹਨ ਅਤੇ ਸ਼ੁਰੂਆਤੀ ਬਕਾਇਆ ਪੁੱਛਿਆ ਗਿਆ ਹੈ।`,
        H ? `आवधिक दर ${percent(c.periodicRatePercent)} होने पर ${m1[0]}।` : `ਮਿਆਦੀ ਦਰ ${percent(c.periodicRatePercent)} ਹੋਣ ਤੇ ${m1[0]}।`,
        H ? `बराबर अवधि-अंत भुगतान के लिए ${m2[0]}।` : `ਬਰਾਬਰ ਮਿਆਦ-ਅੰਤ ਅਦਾਇਗੀਆਂ ਲਈ ${m2[0]}।`,
        H ? `ज्यामितीय योग और ${m3[0]} रखने पर शुरुआती राशि ${source.correctAnswer} मिलती है।` : `ਜਿਆਮਿਤੀ ਜੋੜ ਅਤੇ ${m3[0]} ਰੱਖਣ ਤੇ ਸ਼ੁਰੂਆਤੀ ਰਕਮ ${source.correctAnswer} ਮਿਲਦੀ ਹੈ।`,
        H ? `${source.correctAnswer} से शुरू करके हर ${money(c.installment)} नकदी प्रवाह से पहले ब्याज लगाने पर अंतिम शेष ठीक शून्य आता है।` : `${source.correctAnswer} ਤੋਂ ਸ਼ੁਰੂ ਕਰਕੇ ਹਰ ${money(c.installment)} ਨਕਦੀ ਪ੍ਰਵਾਹ ਤੋਂ ਪਹਿਲਾਂ ਵਿਆਜ ਲਗਾਉਣ ਤੇ ਆਖਰੀ ਬਕਾਇਆ ਬਿਲਕੁਲ ਸਿਫ਼ਰ ਆਉਂਦਾ ਹੈ।`,
      );
      commonMistake = H ? "किस्त को अवधियों की संख्या से गुणा करना पर्याप्त नहीं है; बदलते बकाया पर लगने या मिलने वाले ब्याज को शामिल करना होता है।" : "ਕਿਸ਼ਤ ਨੂੰ ਮਿਆਦਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰਨਾ ਕਾਫ਼ੀ ਨਹੀਂ; ਬਦਲਦੇ ਬਕਾਇਆ ਤੇ ਲੱਗਣ ਜਾਂ ਮਿਲਣ ਵਾਲੇ ਵਿਆਜ ਨੂੰ ਸ਼ਾਮਲ ਕਰਨਾ ਪੈਂਦਾ ਹੈ।";
      break;
    }
    case "INT-QL-118": {
      const m1 = sm(1);
      if (m1.length < 2) throw new Error(`${source.qlId}/${source.seed}: missing approved recurrence math`);
      keyIdea = H ? "दिए गए क्रम में बकाया अपडेट करें: पहले ब्याज जोड़ें, फिर किस्त घटाएँ। जितने भुगतान पूछे गए हैं, वहीं रुकें।" : "ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਬਕਾਇਆ ਅਪਡੇਟ ਕਰੋ: ਪਹਿਲਾਂ ਵਿਆਜ ਜੋੜੋ, ਫਿਰ ਕਿਸ਼ਤ ਘਟਾਓ। ਜਿੰਨੀਆਂ ਅਦਾਇਗੀਆਂ ਪੁੱਛੀਆਂ ਹਨ, ਉੱਥੇ ਹੀ ਰੁਕੋ।";
      steps.push(
        H ? `हम ${money(c.openingBalance)} से शुरू करते हैं और भुगतान ${c.afterPayments} के तुरंत बाद का बकाया चाहिए।` : `ਅਸੀਂ ${money(c.openingBalance)} ਤੋਂ ਸ਼ੁਰੂ ਕਰਦੇ ਹਾਂ ਅਤੇ ਅਦਾਇਗੀ ${c.afterPayments} ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਦਾ ਬਕਾਇਆ ਚਾਹੀਦਾ ਹੈ।`,
        H ? `पुनरावृत्ति ${m1[0]} है, जहाँ ${m1[1]} और भुगतान ${money(c.installment)} है।` : `ਪੁਨਰਾਵਰਤੀ ${m1[0]} ਹੈ, ਜਿੱਥੇ ${m1[1]} ਅਤੇ ਅਦਾਇਗੀ ${money(c.installment)} ਹੈ।`,
      );
      for (let i = 2; i < source.explanation.steps.length - 1; i += 1) {
        const ms = moneyIn(i);
        if (ms.length >= 2) steps.push(H ? `अवधि ${i - 1} में पहले ब्याज जुड़ने से बकाया ${ms[0]} होता है, फिर भुगतान के बाद ${ms[1]} बचता है।` : `ਮਿਆਦ ${i - 1} ਵਿੱਚ ਪਹਿਲਾਂ ਵਿਆਜ ਜੁੜਨ ਨਾਲ ਬਕਾਇਆ ${ms[0]} ਹੁੰਦਾ ਹੈ, ਫਿਰ ਅਦਾਇਗੀ ਤੋਂ ਬਾਅਦ ${ms[1]} ਬਚਦਾ ਹੈ।`);
      }
      steps.push(H ? `इसलिए पूछे गए बिंदु पर बकाया ${source.correctAnswer} है।` : `ਇਸ ਲਈ ਪੁੱਛੇ ਬਿੰਦੂ ਤੇ ਬਕਾਇਆ ${source.correctAnswer} ਹੈ।`);
      commonMistake = H ? "सभी किस्तों को शुरुआती ऋण से एक साथ न घटाएँ। ब्याज हर अवधि बदलते हुए बकाया पर लगता है।" : "ਸਾਰੀਆਂ ਕਿਸ਼ਤਾਂ ਨੂੰ ਸ਼ੁਰੂਆਤੀ ਕਰਜ਼ੇ ਤੋਂ ਇਕੱਠਿਆਂ ਨਾ ਘਟਾਓ। ਵਿਆਜ ਹਰ ਮਿਆਦ ਬਦਲਦੇ ਬਕਾਇਆ ਤੇ ਲੱਗਦਾ ਹੈ।";
      break;
    }
    case "INT-QL-119": {
      const m1 = sm(1), m2 = sm(2);
      if (m1.length < 1 || m2.length < 1) throw new Error(`${source.qlId}/${source.seed}: missing approved math segments`);
      const balance = moneyIn(1).at(-1) ?? "";
      keyIdea = H ? "पहले नियमित भुगतानों के बाद बचा बकाया निकालें। एक अंतिम अवधि का ब्याज जुड़ने के बाद जो राशि देय हो, वही समापन भुगतान है।" : "ਪਹਿਲਾਂ ਨਿਯਮਿਤ ਅਦਾਇਗੀਆਂ ਤੋਂ ਬਾਅਦ ਬਚਿਆ ਬਕਾਇਆ ਕੱਢੋ। ਇੱਕ ਆਖਰੀ ਮਿਆਦ ਦਾ ਵਿਆਜ ਜੁੜਨ ਤੋਂ ਬਾਅਦ ਜੋ ਰਕਮ ਦੇਣੀ ਹੋਵੇ, ਉਹੀ ਸਮਾਪਤੀ ਅਦਾਇਗੀ ਹੈ।";
      steps.push(
        H ? `पहले ${c.periods - 1} भुगतान ${money(c.regularInstallment)} के तय हैं; केवल अंतिम भुगतान अज्ञात है।` : `ਪਹਿਲੀਆਂ ${c.periods - 1} ਅਦਾਇਗੀਆਂ ${money(c.regularInstallment)} ਦੀਆਂ ਨਿਯਤ ਹਨ; ਸਿਰਫ਼ ਆਖਰੀ ਅਦਾਇਗੀ ਅਣਜਾਣ ਹੈ।`,
        H ? `इन नियमित भुगतानों के लिए ${m1[0]} लगाने पर भुगतान ${c.periods - 1} के तुरंत बाद ${balance} बचता है।` : `ਇਨ੍ਹਾਂ ਨਿਯਮਿਤ ਅਦਾਇਗੀਆਂ ਲਈ ${m1[0]} ਲਗਾਉਣ ਤੇ ਅਦਾਇਗੀ ${c.periods - 1} ਦੇ ਤੁਰੰਤ ਬਾਅਦ ${balance} ਬਚਦਾ ਹੈ।`,
        H ? `अब एक अंतिम अवधि का ब्याज जोड़ना है, इसलिए ${m2[0]} से गुणा करते हैं।` : `ਹੁਣ ਇੱਕ ਆਖਰੀ ਮਿਆਦ ਦਾ ਵਿਆਜ ਜੋੜਨਾ ਹੈ, ਇਸ ਲਈ ${m2[0]} ਨਾਲ ਗੁਣਾ ਕਰਦੇ ਹਾਂ।`,
        H ? `अंतिम भुगतान से ठीक पहले देय राशि ${source.correctAnswer} है। यही राशि देने पर अंतिम शेष शून्य हो जाता है।` : `ਆਖਰੀ ਅਦਾਇਗੀ ਤੋਂ ਠੀਕ ਪਹਿਲਾਂ ਦੇਣੀ ਰਕਮ ${source.correctAnswer} ਹੈ। ਇਹੀ ਰਕਮ ਦੇਣ ਨਾਲ ਆਖਰੀ ਬਕਾਇਆ ਸਿਫ਼ਰ ਹੋ ਜਾਂਦਾ ਹੈ।`,
      );
      commonMistake = H ? "नियमित किस्त को ही अंतिम भुगतान न मानें। पहले की किस्तें जानबूझकर अलग राशि पर तय थीं।" : "ਨਿਯਮਿਤ ਕਿਸ਼ਤ ਨੂੰ ਹੀ ਆਖਰੀ ਅਦਾਇਗੀ ਨਾ ਮੰਨੋ। ਪਹਿਲੀਆਂ ਕਿਸ਼ਤਾਂ ਜਾਣਬੁੱਝ ਕੇ ਵੱਖ ਰਕਮ ਤੇ ਨਿਯਤ ਸਨ।";
      break;
    }
    case "INT-QL-120": {
      const m1 = sm(1), m2 = sm(2);
      if (m1.length < 1 || m2.length < 2) throw new Error(`${source.qlId}/${source.seed}: missing approved math segments`);
      const endPayment = moneyIn(4)[0] ?? "";
      keyIdea = H ? "यहाँ भुगतान ब्याज से पहले होता है, इसलिए घटनाओं का क्रम सामान्य अवधि-अंत किस्त योजना से अलग है।" : "ਇੱਥੇ ਅਦਾਇਗੀ ਵਿਆਜ ਤੋਂ ਪਹਿਲਾਂ ਹੁੰਦੀ ਹੈ, ਇਸ ਲਈ ਘਟਨਾਵਾਂ ਦਾ ਕ੍ਰਮ ਆਮ ਮਿਆਦ-ਅੰਤ ਕਿਸ਼ਤ ਯੋਜਨਾ ਤੋਂ ਵੱਖ ਹੈ।";
      steps.push(
        H ? "पहली किस्त तुरंत दी जाती है और बाद की हर किस्त भी उस अवधि का ब्याज लगने से पहले दी जाती है।" : "ਪਹਿਲੀ ਕਿਸ਼ਤ ਤੁਰੰਤ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ ਅਤੇ ਬਾਅਦ ਦੀ ਹਰ ਕਿਸ਼ਤ ਵੀ ਉਸ ਮਿਆਦ ਦਾ ਵਿਆਜ ਲੱਗਣ ਤੋਂ ਪਹਿਲਾਂ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ।",
        H ? `सही पुनरावृत्ति ${m1[0]} है, न कि अवधि-अंत भुगतान वाली पुनरावृत्ति।` : `ਸਹੀ ਪੁਨਰਾਵਰਤੀ ${m1[0]} ਹੈ, ਨਾ ਕਿ ਮਿਆਦ-ਅੰਤ ਅਦਾਇਗੀ ਵਾਲੀ ਪੁਨਰਾਵਰਤੀ।`,
        H ? `${m2[0]} हल करने पर ${m2[1]} मिलता है।` : `${m2[0]} ਹੱਲ ਕਰਨ ਤੇ ${m2[1]} ਮਿਲਦਾ ਹੈ।`,
        H ? `${money(c.openingBalance)} रखने पर प्रत्येक अवधि-आरंभ भुगतान ${source.correctAnswer} आता है।` : `${money(c.openingBalance)} ਰੱਖਣ ਤੇ ਹਰ ਮਿਆਦ-ਸ਼ੁਰੂ ਅਦਾਇਗੀ ${source.correctAnswer} ਆਉਂਦੀ ਹੈ।`,
        H ? `तुलना के लिए अवधि-अंत भुगतान ${endPayment} होता, जो अधिक है क्योंकि वह बाद में दिया जाता है।` : `ਤੁਲਨਾ ਲਈ ਮਿਆਦ-ਅੰਤ ਅਦਾਇਗੀ ${endPayment} ਹੁੰਦੀ, ਜੋ ਵੱਧ ਹੈ ਕਿਉਂਕਿ ਉਹ ਬਾਅਦ ਵਿੱਚ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ।`,
      );
      commonMistake = H ? "सामान्य अवधि-अंत किस्त सूत्र न लगाएँ। ब्याज से पहले भुगतान करने पर बकाया जल्दी घटता है और आवश्यक किस्त बदलती है।" : "ਆਮ ਮਿਆਦ-ਅੰਤ ਕਿਸ਼ਤ ਫਾਰਮੂਲਾ ਨਾ ਲਗਾਓ। ਵਿਆਜ ਤੋਂ ਪਹਿਲਾਂ ਅਦਾਇਗੀ ਕਰਨ ਨਾਲ ਬਕਾਇਆ ਜਲਦੀ ਘਟਦਾ ਹੈ ਅਤੇ ਲੋੜੀਂਦੀ ਕਿਸ਼ਤ ਬਦਲਦੀ ਹੈ।";
      break;
    }
    case "INT-QL-121": {
      const m1 = sm(1);
      if (m1.length < 2) throw new Error(`${source.qlId}/${source.seed}: missing approved inverse-rate math`);
      keyIdea = H ? "दर अज्ञात है। वही आवधिक दर खोजें जिसके साथ सटीक पुनर्भुगतान पुनरावृत्ति अंतिम बकाया को शून्य करती है।" : "ਦਰ ਅਣਜਾਣ ਹੈ। ਉਹੀ ਮਿਆਦੀ ਦਰ ਲੱਭੋ ਜਿਸ ਨਾਲ ਸਹੀ ਵਾਪਸੀ ਪੁਨਰਾਵਰਤੀ ਆਖਰੀ ਬਕਾਇਆ ਨੂੰ ਸਿਫ਼ਰ ਕਰਦੀ ਹੈ।";
      steps.push(
        H ? `शुरुआती ऋण ${money(c.openingBalance)}, समान भुगतान ${money(c.installment)} और अवधि-अंत भुगतानों की संख्या ${c.periods} है।` : `ਸ਼ੁਰੂਆਤੀ ਕਰਜ਼ਾ ${money(c.openingBalance)}, ਬਰਾਬਰ ਅਦਾਇਗੀ ${money(c.installment)} ਅਤੇ ਮਿਆਦ-ਅੰਤ ਅਦਾਇਗੀਆਂ ਦੀ ਗਿਣਤੀ ${c.periods} ਹੈ।`,
        H ? `किसी परीक्षण दर ${m1[0]} पर बकाया ${m1[1]} के अनुसार बदलता है।` : `ਕਿਸੇ ਪਰਖ ਦਰ ${m1[0]} ਤੇ ਬਕਾਇਆ ${m1[1]} ਅਨੁਸਾਰ ਬਦਲਦਾ ਹੈ।`,
        H ? `${source.correctAnswer} प्रति ${unit(c.periodUnit, locale)} पर कार्यक्रम इस प्रकार बनता है:` : `${source.correctAnswer} ਪ੍ਰਤੀ ${unit(c.periodUnit, locale)} ਤੇ ਕਾਰਜਕ੍ਰਮ ਇਸ ਤਰ੍ਹਾਂ ਬਣਦਾ ਹੈ:`,
      );
      for (let i = 3; i < source.explanation.steps.length - 1; i += 1) {
        const ms = moneyIn(i);
        if (ms.length >= 2) steps.push(H ? `अवधि ${i - 2} में ब्याज के बाद बकाया ${ms[0]} होता है और भुगतान के बाद ${ms[1]} बचता है।` : `ਮਿਆਦ ${i - 2} ਵਿੱਚ ਵਿਆਜ ਤੋਂ ਬਾਅਦ ਬਕਾਇਆ ${ms[0]} ਹੁੰਦਾ ਹੈ ਅਤੇ ਅਦਾਇਗੀ ਤੋਂ ਬਾਅਦ ${ms[1]} ਬਚਦਾ ਹੈ।`);
      }
      steps.push(H ? `अंतिम बकाया ठीक ₹0 है, इसलिए आवश्यक आवधिक दर ${source.correctAnswer} है।` : `ਆਖਰੀ ਬਕਾਇਆ ਬਿਲਕੁਲ ₹0 ਹੈ, ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਮਿਆਦੀ ਦਰ ${source.correctAnswer} ਹੈ।`);
      commonMistake = H ? "इसे साधारण ब्याज मानकर कुल ब्याज को शुरुआती राशि से न बाँटें। हर किस्त के बाद बकाया बदलता है।" : "ਇਸ ਨੂੰ ਸਧਾਰਨ ਵਿਆਜ ਮੰਨ ਕੇ ਕੁੱਲ ਵਿਆਜ ਨੂੰ ਸ਼ੁਰੂਆਤੀ ਰਕਮ ਨਾਲ ਨਾ ਵੰਡੋ। ਹਰ ਕਿਸ਼ਤ ਤੋਂ ਬਾਅਦ ਬਕਾਇਆ ਬਦਲਦਾ ਹੈ।";
      break;
    }
    case "INT-QL-122": {
      const m1 = sm(1);
      if (m1.length < 2) throw new Error(`${source.qlId}/${source.seed}: missing approved savings math`);
      keyIdea = H ? "अवधि-अंत जमा में पहले मौजूदा कोष पर ब्याज लगता है, फिर नई बराबर जमा राशि जोड़ी जाती है।" : "ਮਿਆਦ-ਅੰਤ ਜਮ੍ਹਾਂ ਵਿੱਚ ਪਹਿਲਾਂ ਮੌਜੂਦਾ ਫੰਡ ਤੇ ਵਿਆਜ ਲੱਗਦਾ ਹੈ, ਫਿਰ ਨਵੀਂ ਬਰਾਬਰ ਜਮ੍ਹਾਂ ਰਕਮ ਜੋੜੀ ਜਾਂਦੀ ਹੈ।";
      steps.push(
        H ? `खाता बिना शुरुआती शेष के शुरू होता है और ${money(c.deposit)} की ${c.periods} बराबर जमा प्राप्त करता है।` : `ਖਾਤਾ ਬਿਨਾਂ ਸ਼ੁਰੂਆਤੀ ਬਕਾਇਆ ਦੇ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ ਅਤੇ ${money(c.deposit)} ਦੀਆਂ ${c.periods} ਬਰਾਬਰ ਜਮ੍ਹਾਂ ਰਕਮਾਂ ਲੈਂਦਾ ਹੈ।`,
        H ? `${m1[0]} के साथ पुनरावृत्ति ${m1[1]} है।` : `${m1[0]} ਨਾਲ ਪੁਨਰਾਵਰਤੀ ${m1[1]} ਹੈ।`,
      );
      for (let i = 2; i < source.explanation.steps.length - 1; i += 1) {
        const ms = moneyIn(i);
        if (!ms.length) continue;
        if (i === 2) steps.push(H ? `कोष ₹0 से शुरू होता है, इसलिए पहली अवधि-अंत जमा के बाद राशि ${ms.at(-1)} है।` : `ਫੰਡ ₹0 ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ, ਇਸ ਲਈ ਪਹਿਲੀ ਮਿਆਦ-ਅੰਤ ਜਮ੍ਹਾਂ ਤੋਂ ਬਾਅਦ ਰਕਮ ${ms.at(-1)} ਹੈ।`);
        else steps.push(H ? `अगली जमा से पहले मौजूदा राशि पर ब्याज लगता है; जमा जोड़ने के बाद कोष ${ms.at(-1)} हो जाता है।` : `ਅਗਲੀ ਜਮ੍ਹਾਂ ਤੋਂ ਪਹਿਲਾਂ ਮੌਜੂਦਾ ਰਕਮ ਤੇ ਵਿਆਜ ਲੱਗਦਾ ਹੈ; ਜਮ੍ਹਾਂ ਜੋੜਨ ਤੋਂ ਬਾਅਦ ਫੰਡ ${ms.at(-1)} ਹੋ ਜਾਂਦਾ ਹੈ।`);
      }
      steps.push(H ? `इसलिए अंतिम जमा के तुरंत बाद संचित कोष ${source.correctAnswer} है।` : `ਇਸ ਲਈ ਆਖਰੀ ਜਮ੍ਹਾਂ ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਇਕੱਠਾ ਫੰਡ ${source.correctAnswer} ਹੈ।`);
      commonMistake = H ? "अंतिम जमा को अतिरिक्त ब्याज न दें; राशि अंतिम जमा के तुरंत बाद पूछी गई है।" : "ਆਖਰੀ ਜਮ੍ਹਾਂ ਨੂੰ ਵਾਧੂ ਵਿਆਜ ਨਾ ਦਿਓ; ਰਕਮ ਆਖਰੀ ਜਮ੍ਹਾਂ ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਪੁੱਛੀ ਗਈ ਹੈ।";
      break;
    }
    case "INT-QL-123": {
      const m2 = sm(2), m3 = sm(3);
      if (m2.length < 1 || m3.length < 3) throw new Error(`${source.qlId}/${source.seed}: missing approved catch-up math`);
      const growthPeriods = c.periods - c.missedPaymentNumber;
      keyIdea = H ? "छूटी हुई किस्त ऋण में बनी रहती है और मूल अंतिम तिथि तक उस पर ब्याज बढ़ता रहता है।" : "ਛੁੱਟੀ ਹੋਈ ਕਿਸ਼ਤ ਕਰਜ਼ੇ ਵਿੱਚ ਹੀ ਰਹਿੰਦੀ ਹੈ ਅਤੇ ਮੂਲ ਆਖਰੀ ਮਿਤੀ ਤੱਕ ਉਸ ਤੇ ਵਿਆਜ ਵਧਦਾ ਰਹਿੰਦਾ ਹੈ।";
      steps.push(
        H ? `छूटी हुई राशि एक नियमित किस्त ${money(c.installment)} है, जो भुगतान ${c.missedPaymentNumber} पर देय थी।` : `ਛੁੱਟੀ ਹੋਈ ਰਕਮ ਇੱਕ ਨਿਯਮਿਤ ਕਿਸ਼ਤ ${money(c.installment)} ਹੈ, ਜੋ ਅਦਾਇਗੀ ${c.missedPaymentNumber} ਤੇ ਦੇਣੀ ਸੀ।`,
        H ? `उस देय तिथि से अंतिम देय तिथि तक ${growthPeriods} पूरी ब्याज अवधि है।` : `ਉਸ ਨਿਯਤ ਮਿਤੀ ਤੋਂ ਆਖਰੀ ਨਿਯਤ ਮਿਤੀ ਤੱਕ ${growthPeriods} ਪੂਰੀ ਵਿਆਜ ਮਿਆਦ ਹੈ।`,
        H ? `इसलिए अंत में आवश्यक अतिरिक्त राशि ${m2[0]} है।` : `ਇਸ ਲਈ ਅੰਤ ਵਿੱਚ ਲੋੜੀਂਦੀ ਵਾਧੂ ਰਕਮ ${m2[0]} ਹੈ।`,
        H ? `यहाँ ${m3[0]}, ${m3[1]} और ${m3[2]}; इससे ${source.correctAnswer} मिलता है।` : `ਇੱਥੇ ${m3[0]}, ${m3[1]} ਅਤੇ ${m3[2]}; ਇਸ ਤੋਂ ${source.correctAnswer} ਮਿਲਦਾ ਹੈ।`,
        H ? `यह सामान्य अंतिम किस्त के साथ जोड़ी जाएगी; प्रश्न केवल अतिरिक्त समायोजन राशि पूछता है।` : `ਇਹ ਆਮ ਆਖਰੀ ਕਿਸ਼ਤ ਨਾਲ ਜੋੜੀ ਜਾਵੇਗੀ; ਪ੍ਰਸ਼ਨ ਸਿਰਫ਼ ਵਾਧੂ ਸਮਾਇਕ ਰਕਮ ਪੁੱਛਦਾ ਹੈ।`,
      );
      commonMistake = H ? "केवल छूटी हुई मूल किस्त न दें। भुगतान न होने के कारण उस राशि पर अंतिम निपटान तक ब्याज बढ़ता है।" : "ਸਿਰਫ਼ ਛੁੱਟੀ ਹੋਈ ਮੂਲ ਕਿਸ਼ਤ ਨਾ ਦਿਓ। ਅਦਾਇਗੀ ਨਾ ਹੋਣ ਕਰਕੇ ਉਸ ਰਕਮ ਤੇ ਆਖਰੀ ਨਿਪਟਾਰੇ ਤੱਕ ਵਿਆਜ ਵਧਦਾ ਹੈ।";
      break;
    }
    case "INT-QL-124": {
      const m3 = sm(3);
      if (m3.length < 1) throw new Error(`${source.qlId}/${source.seed}: missing approved comparison math`);
      const aMoney = moneyIn(1).at(-1) ?? "", bMoney = moneyIn(2).at(-1) ?? "";
      keyIdea = H ? "दोनों दरों पर समान किस्त अलग-अलग निकालें, फिर दोनों भुगतान राशियों का परम अंतर लें।" : "ਦੋਵਾਂ ਦਰਾਂ ਤੇ ਬਰਾਬਰ ਕਿਸ਼ਤ ਵੱਖ-ਵੱਖ ਕੱਢੋ, ਫਿਰ ਦੋਵਾਂ ਅਦਾਇਗੀ ਰਕਮਾਂ ਦਾ ਪੂਰਨ ਅੰਤਰ ਲਓ।";
      steps.push(
        H ? `दोनों योजनाओं में शुरुआती राशि ${money(c.openingBalance)} और अवधि संख्या ${c.periods} समान है; केवल आवधिक दर बदलती है।` : `ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਸ਼ੁਰੂਆਤੀ ਰਕਮ ${money(c.openingBalance)} ਅਤੇ ਮਿਆਦਾਂ ਦੀ ਗਿਣਤੀ ${c.periods} ਇੱਕੋ ਹੈ; ਸਿਰਫ਼ ਮਿਆਦੀ ਦਰ ਬਦਲਦੀ ਹੈ।`,
        H ? `दर A ${percent(c.rateAPercent)} पर अवधि-अंत किस्त ${aMoney} आती है।` : `ਦਰ A ${percent(c.rateAPercent)} ਤੇ ਮਿਆਦ-ਅੰਤ ਕਿਸ਼ਤ ${aMoney} ਆਉਂਦੀ ਹੈ।`,
        H ? `दर B ${percent(c.rateBPercent)} पर उसी संबंध से किस्त ${bMoney} आती है।` : `ਦਰ B ${percent(c.rateBPercent)} ਤੇ ਉਸੇ ਸੰਬੰਧ ਨਾਲ ਕਿਸ਼ਤ ${bMoney} ਆਉਂਦੀ ਹੈ।`,
        H ? `अंतिम पैसे तक गोल करने से पहले के सटीक मानों पर ${m3[0]} का मान ${source.correctAnswer} है।` : `ਆਖਰੀ ਪੈਸੇ ਤੱਕ ਗੋਲ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਦੇ ਸਹੀ ਮੁੱਲਾਂ ਤੇ ${m3[0]} ਦਾ ਮੁੱਲ ${source.correctAnswer} ਹੈ।`,
      );
      commonMistake = H ? "दो ब्याज दरों का केवल अंतर लेकर उसे भुगतान अंतर न मानें। हर दर पूरे पुनर्भुगतान कार्यक्रम को बदलती है।" : "ਦੋ ਵਿਆਜ ਦਰਾਂ ਦਾ ਸਿਰਫ਼ ਅੰਤਰ ਲੈ ਕੇ ਉਸ ਨੂੰ ਅਦਾਇਗੀ ਅੰਤਰ ਨਾ ਮੰਨੋ। ਹਰ ਦਰ ਪੂਰੇ ਵਾਪਸੀ ਕਾਰਜਕ੍ਰਮ ਨੂੰ ਬਦਲਦੀ ਹੈ।";
      break;
    }
  }
  return deepFreeze({ keyIdea, steps: Object.freeze(steps), finalAnswer: source.correctAnswer, commonMistake });
}

export function generateIntCp008LocalizedReviewQuestion(
  qlId: IntCp008QlId,
  seed: string,
  locale: IntCp008LocalizedLocale,
) {
  const source = generateIntCp008EnglishFrozenQuestion(qlId, seed) as any;
  const prompt = stemFor(source, locale);
  const explanation = explanationFor(source, locale);
  return deepFreeze({
    ...source,
    id: `${source.id}:${locale}`,
    locale,
    presentation: deepFreeze({ ...source.presentation, prompt, markdown: prompt }),
    options: Object.freeze(source.options.map((option: any) => deepFreeze({ ...option }))),
    correctAnswer: source.correctAnswer,
    explanation,
    localizedVersion: INT_CP008_LOCALIZED_VERSION,
    sourceEnglishFreezeId: INT_CP008_ENGLISH_FREEZE_ID,
    sourceEnglishContentFrozen: true as const,
    editorialStatus: "MULTILINGUAL_NATIVE_REVIEW" as const,
    approvalStatus: "PENDING_MULTILINGUAL_PRODUCT_REVIEW" as const,
    allocationStatus: "INACTIVE_MULTILINGUAL_REVIEW" as const,
    permanentIdentityFrozen: true as const,
    learnerContentFrozen: false as const,
    enabled: false as const,
    stagingStatus: "NOT_STAGED" as const,
    registrationStatus: "NOT_REGISTERED" as const,
    questionStudioDiscoverable: false as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
    mathematicalFingerprint: `${source.mathematicalFingerprint}|${INT_CP008_LOCALIZED_VERSION}|${locale}`,
  });
}
