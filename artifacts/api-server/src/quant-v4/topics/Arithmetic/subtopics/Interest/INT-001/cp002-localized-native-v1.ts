import {
  addRational,
  divideRational,
  formatRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./foundation/rational";
import type { Rational } from "./foundation/types";
import { generateIntCp002EnglishFrozenQuestion } from "./cp002-english-frozen-runtime";
import type { IntCp002FinalQlId } from "./cp002-final-registry";

export const INT_CP002_LOCALIZED_NATIVE_V1 = Object.freeze({
  version: "INT-CP-002-HI-PA-NATIVE-CANDIDATE-v1" as const,
  checkpointId: "INT-CP-002" as const,
  qlRange: "INT-QL-022..INT-QL-052" as const,
  qlCount: 31 as const,
  locales: ["hi-IN", "pa-IN"] as const,
  status: "MULTILINGUAL_REVIEW_CANDIDATE" as const,
  approved: false as const,
  frozen: false as const,
  permanentIdentityChanges: false as const,
  questionStudioActivationAuthorized: false as const,
});

export type IntCp002NativeLocale = (typeof INT_CP002_LOCALIZED_NATIVE_V1.locales)[number];

type ValueRecord = Record<string, Rational | string | number>;

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function hash(source: string): number {
  let state = 2166136261;
  for (const character of source) {
    state ^= character.charCodeAt(0);
    state = Math.imul(state, 16777619);
  }
  return state >>> 0;
}

function t(locale: IntCp002NativeLocale, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : pa;
}

function rationalValue(values: ValueRecord, key: string): Rational {
  const value = values[key];
  if (!value || typeof value !== "object" || !("numerator" in value) || !("denominator" in value)) {
    throw new Error(`CP002 localization value '${key}' is not rational.`);
  }
  return value as Rational;
}

function numberValue(values: ValueRecord, key: string): number {
  const value = values[key];
  if (typeof value === "number") return value;
  const rationalValueAtKey = rationalValue(values, key);
  if (rationalValueAtKey.denominator !== 1n) throw new Error(`CP002 localization value '${key}' is not an integer.`);
  return Number(rationalValueAtKey.numerator);
}

function q(value: Rational): string {
  return formatRational(value);
}

function indianDigits(value: bigint): string {
  const negative = value < 0n;
  const source = (negative ? -value : value).toString();
  if (source.length <= 3) return `${negative ? "−" : ""}${source}`;
  const tail = source.slice(-3);
  let head = source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) {
    groups.unshift(head.slice(-2));
    head = head.slice(0, -2);
  }
  if (head) groups.unshift(head);
  return `${negative ? "−" : ""}${groups.join(",")},${tail}`;
}

function money(value: Rational): string {
  if (value.denominator === 1n) return `₹${indianDigits(value.numerator)}`;
  return `₹${q(value)}`;
}

function percent(value: Rational): string {
  return `${q(value)}%`;
}

function years(value: Rational, locale: IntCp002NativeLocale): string {
  return `${q(value)} ${t(locale, "वर्ष", "ਸਾਲ")}`;
}

function days(value: Rational, locale: IntCp002NativeLocale): string {
  return `${q(value)} ${t(locale, "दिन", "ਦਿਨ")}`;
}

function ratio(value: Rational): string {
  const numerator = value.numerator < 0n ? -value.numerator : value.numerator;
  return `${numerator}:${value.denominator}`;
}

function si(principal: Rational, rate: Rational, time: Rational): Rational {
  return divideRational(multiplyRational(multiplyRational(principal, rate), time), rational(100));
}

function renderAnswer(
  semantic: string,
  value: Rational,
  locale: IntCp002NativeLocale,
): string {
  if (semantic === "MONEY" || semantic === "PRINCIPAL") return money(value);
  if (semantic === "RATE_PERCENT") return percent(value);
  if (semantic === "TIME_YEARS") return years(value, locale);
  if (semantic === "DAYS") return days(value, locale);
  if (semantic === "RATIO") return ratio(value);
  return q(value);
}

function context(locale: IntCp002NativeLocale, seed: string) {
  const frame = hash(`${seed}:context`) % 3;
  const hi = [
    { actor: "एक व्यक्ति", institution: "सहकारी बैंक" },
    { actor: "एक ग्राहक", institution: "डाकघर बचत योजना" },
    { actor: "एक जमाकर्ता", institution: "ग्रामीण बैंक" },
  ] as const;
  const pa = [
    { actor: "ਇੱਕ ਵਿਅਕਤੀ", institution: "ਸਹਿਕਾਰੀ ਬੈਂਕ" },
    { actor: "ਇੱਕ ਗਾਹਕ", institution: "ਡਾਕਘਰ ਬਚਤ ਯੋਜਨਾ" },
    { actor: "ਇੱਕ ਜਮਾਕਰਤਾ", institution: "ਪੇਂਡੂ ਬੈਂਕ" },
  ] as const;
  return { frame: frame + 1, ...(locale === "hi-IN" ? hi[frame]! : pa[frame]!) };
}

function localizationValues(source: ReturnType<typeof generateIntCp002EnglishFrozenQuestion>): ValueRecord {
  const state = source.internalProvenance.sourceState as { values?: ValueRecord } | undefined;
  if (!state?.values) throw new Error(`${source.qlId}/${source.seed}: structured values are unavailable for localization.`);
  return state.values;
}

function shortcut(topology: string, locale: IntCp002NativeLocale): string {
  const generic = t(locale,
    "हर अवधि या जमा का ब्याज अलग निकालें, फिर प्रश्न में मांगे गए संबंध के अनुसार जोड़ें, घटाएँ या उल्टा हल करें।",
    "ਹਰ ਮਿਆਦ ਜਾਂ ਜਮ੍ਹਾਂ ਦਾ ਵਿਆਜ ਵੱਖਰਾ ਕੱਢੋ, ਫਿਰ ਸਵਾਲ ਵਿੱਚ ਮੰਗੇ ਸੰਬੰਧ ਅਨੁਸਾਰ ਜੋੜੋ, ਘਟਾਓ ਜਾਂ ਉਲਟ ਹੱਲ ਕਰੋ।",
  );
  if (topology.includes("DAY_COUNT")) return t(locale,
    "दिनों वाले प्रश्न में वही 360 या 365 दिन का आधार लें जो प्रश्न में साफ लिखा है।",
    "ਦਿਨਾਂ ਵਾਲੇ ਸਵਾਲ ਵਿੱਚ ਓਹੀ 360 ਜਾਂ 365 ਦਿਨਾਂ ਦਾ ਆਧਾਰ ਲਓ ਜੋ ਸਵਾਲ ਵਿੱਚ ਸਾਫ਼ ਦਿੱਤਾ ਹੈ।",
  );
  if (topology.includes("OUTSTANDING_BALANCE")) return t(locale,
    "भुगतान से पहले पुराने मूलधन और भुगतान के बाद बचे मूलधन पर अलग-अलग ब्याज लगाएँ।",
    "ਭੁਗਤਾਨ ਤੋਂ ਪਹਿਲਾਂ ਪੁਰਾਣੇ ਮੂਲਧਨ ਅਤੇ ਭੁਗਤਾਨ ਤੋਂ ਬਾਅਦ ਬਚੇ ਮੂਲਧਨ ਉੱਤੇ ਵੱਖ-ਵੱਖ ਵਿਆਜ ਲਗਾਓ।",
  );
  if (topology.includes("BORROW_LEND")) return t(locale,
    "एक ही मूलधन और समय होने पर शुद्ध लाभ के लिए केवल उधार और उधार देने की दरों का अंतर काम करता है।",
    "ਇੱਕੋ ਮੂਲਧਨ ਅਤੇ ਸਮੇਂ ਲਈ ਸ਼ੁੱਧ ਲਾਭ ਵਿੱਚ ਸਿਰਫ਼ ਕਰਜ਼ ਲੈਣ ਅਤੇ ਕਰਜ਼ ਦੇਣ ਦੀਆਂ ਦਰਾਂ ਦਾ ਅੰਤਰ ਕੰਮ ਕਰਦਾ ਹੈ।",
  );
  return generic;
}

function trapText(locale: IntCp002NativeLocale, misconceptionId: string): string {
  if (/IGNORE|OMIT/u.test(misconceptionId)) return t(locale,
    "इस गलत विकल्प में प्रश्न की एक जरूरी अवधि, जमा या भुगतान को छोड़ दिया गया है।",
    "ਇਸ ਗਲਤ ਵਿਕਲਪ ਵਿੱਚ ਸਵਾਲ ਦੀ ਇੱਕ ਲਾਜ਼ਮੀ ਮਿਆਦ, ਜਮ੍ਹਾਂ ਜਾਂ ਭੁਗਤਾਨ ਛੱਡ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
  );
  if (/ADD_/u.test(misconceptionId)) return t(locale,
    "इस विकल्प में जहाँ अंतर लेना था वहाँ राशियों या दरों को जोड़ दिया गया है।",
    "ਇਸ ਵਿਕਲਪ ਵਿੱਚ ਜਿੱਥੇ ਅੰਤਰ ਲੈਣਾ ਸੀ ਉੱਥੇ ਰਕਮਾਂ ਜਾਂ ਦਰਾਂ ਜੋੜ ਦਿੱਤੀਆਂ ਗਈਆਂ ਹਨ।",
  );
  if (/REVERSE/u.test(misconceptionId)) return t(locale,
    "इस विकल्प में मांगा गया क्रम या अनुपात उलट दिया गया है।",
    "ਇਸ ਵਿਕਲਪ ਵਿੱਚ ਮੰਗਿਆ ਕ੍ਰਮ ਜਾਂ ਅਨੁਪਾਤ ਉਲਟ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
  );
  if (/RATE/u.test(misconceptionId)) return t(locale,
    "इस विकल्प में ब्याज दर का संबंध गलत लागू किया गया है।",
    "ਇਸ ਵਿਕਲਪ ਵਿੱਚ ਵਿਆਜ ਦਰ ਦਾ ਸੰਬੰਧ ਗਲਤ ਲਗਾਇਆ ਗਿਆ ਹੈ।",
  );
  if (/DURATION|TIME|DAYS/u.test(misconceptionId)) return t(locale,
    "इस विकल्प में समय या दिनों की अवधि गलत ली गई है।",
    "ਇਸ ਵਿਕਲਪ ਵਿੱਚ ਸਮਾਂ ਜਾਂ ਦਿਨਾਂ ਦੀ ਮਿਆਦ ਗਲਤ ਲਈ ਗਈ ਹੈ।",
  );
  return t(locale,
    "यह विकल्प प्रश्न की दी हुई शर्तों में से एक को गलत तरीके से लागू करने पर मिलता है।",
    "ਇਹ ਵਿਕਲਪ ਸਵਾਲ ਦੀ ਦਿੱਤੀ ਸ਼ਰਤਾਂ ਵਿੱਚੋਂ ਇੱਕ ਨੂੰ ਗਲਤ ਤਰੀਕੇ ਨਾਲ ਲਗਾਉਣ ਨਾਲ ਮਿਲਦਾ ਹੈ।",
  );
}

type NativeBody = Readonly<{
  stem: string;
  mainRule: string;
  workedSteps: readonly string[];
}>;

function nativeBody(
  qlId: IntCp002FinalQlId,
  values: ValueRecord,
  locale: IntCp002NativeLocale,
  seed: string,
): NativeBody {
  const { actor, institution } = context(locale, seed);
  const simpleRule = t(locale,
    "साधारण ब्याज का मूल नियम: I = P × R × T / 100।",
    "ਸਧਾਰਨ ਵਿਆਜ ਦਾ ਮੁੱਖ ਨਿਯਮ: I = P × R × T / 100।",
  );
  const P = () => rationalValue(values, "principal");

  switch (qlId) {
    case "INT-QL-022": {
      const p = P(), r1 = rationalValue(values, "firstRate"), r2 = rationalValue(values, "secondRate"), t1 = rationalValue(values, "firstTime"), t2 = rationalValue(values, "secondTime");
      const i1 = si(p, r1, t1), i2 = si(p, r2, t2), total = addRational(i1, i2);
      return { stem: t(locale,
        `${actor} ${institution} में ${money(p)} जमा करता है। पहले ${years(t1, locale)} के लिए ${percent(r1)} और अगले ${years(t2, locale)} के लिए ${percent(r2)} वार्षिक साधारण ब्याज मिलता है। कुल ब्याज ज्ञात कीजिए।`,
        `${actor} ${institution} ਵਿੱਚ ${money(p)} ਜਮ੍ਹਾਂ ਕਰਦਾ ਹੈ। ਪਹਿਲੇ ${years(t1, locale)} ਲਈ ${percent(r1)} ਅਤੇ ਅਗਲੇ ${years(t2, locale)} ਲਈ ${percent(r2)} ਸਾਲਾਨਾ ਸਧਾਰਨ ਵਿਆਜ ਮਿਲਦਾ ਹੈ। ਕੁੱਲ ਵਿਆਜ ਪਤਾ ਕਰੋ।`), mainRule: simpleRule, workedSteps: [
        t(locale, `पहली अवधि का ब्याज = ${money(p)} × ${q(r1)} × ${q(t1)} / 100 = ${money(i1)}।`, `ਪਹਿਲੀ ਮਿਆਦ ਦਾ ਵਿਆਜ = ${money(p)} × ${q(r1)} × ${q(t1)} / 100 = ${money(i1)}।`),
        t(locale, `दूसरी अवधि का ब्याज = ${money(p)} × ${q(r2)} × ${q(t2)} / 100 = ${money(i2)}।`, `ਦੂਜੀ ਮਿਆਦ ਦਾ ਵਿਆਜ = ${money(p)} × ${q(r2)} × ${q(t2)} / 100 = ${money(i2)}।`),
        t(locale, `कुल ब्याज = ${money(i1)} + ${money(i2)} = ${money(total)}।`, `ਕੁੱਲ ਵਿਆਜ = ${money(i1)} + ${money(i2)} = ${money(total)}।`),
      ] };
    }
    case "INT-QL-023": {
      const p = P(), r1 = rationalValue(values, "firstRate"), r2 = rationalValue(values, "secondRate"), t1 = rationalValue(values, "firstTime"), t2 = rationalValue(values, "secondTime");
      const i1 = si(p, r1, t1), i2 = si(p, r2, t2), totalI = addRational(i1, i2), amount = addRational(p, totalI);
      return { stem: t(locale,
        `${actor} ${institution} में ${money(p)} जमा करता है। पहले ${years(t1, locale)} तक ${percent(r1)} और फिर ${years(t2, locale)} तक ${percent(r2)} साधारण ब्याज मिलता है। अंतिम राशि ज्ञात कीजिए।`,
        `${actor} ${institution} ਵਿੱਚ ${money(p)} ਜਮ੍ਹਾਂ ਕਰਦਾ ਹੈ। ਪਹਿਲਾਂ ${years(t1, locale)} ਲਈ ${percent(r1)} ਅਤੇ ਫਿਰ ${years(t2, locale)} ਲਈ ${percent(r2)} ਸਧਾਰਨ ਵਿਆਜ ਮਿਲਦਾ ਹੈ। ਅੰਤਿਮ ਰਕਮ ਪਤਾ ਕਰੋ।`), mainRule: simpleRule, workedSteps: [
        t(locale, `पहली अवधि का ब्याज = ${money(i1)} और दूसरी अवधि का ब्याज = ${money(i2)}।`, `ਪਹਿਲੀ ਮਿਆਦ ਦਾ ਵਿਆਜ = ${money(i1)} ਅਤੇ ਦੂਜੀ ਮਿਆਦ ਦਾ ਵਿਆਜ = ${money(i2)}।`),
        t(locale, `कुल ब्याज = ${money(i1)} + ${money(i2)} = ${money(totalI)}।`, `ਕੁੱਲ ਵਿਆਜ = ${money(i1)} + ${money(i2)} = ${money(totalI)}।`),
        t(locale, `अंतिम राशि = मूलधन + कुल ब्याज = ${money(p)} + ${money(totalI)} = ${money(amount)}।`, `ਅੰਤਿਮ ਰਕਮ = ਮੂਲਧਨ + ਕੁੱਲ ਵਿਆਜ = ${money(p)} + ${money(totalI)} = ${money(amount)}।`),
      ] };
    }
    case "INT-QL-024": {
      const r1 = rationalValue(values, "firstRate"), r2 = rationalValue(values, "secondRate"), t1 = rationalValue(values, "firstTime"), t2 = rationalValue(values, "secondTime"), totalI = rationalValue(values, "totalInterest");
      const exposure = addRational(multiplyRational(r1, t1), multiplyRational(r2, t2));
      const principal = divideRational(multiplyRational(totalI, rational(100)), exposure);
      return { stem: t(locale,
        `${actor} ने ${institution} में कुछ मूलधन जमा किया। उस पर ${years(t1, locale)} के लिए ${percent(r1)} और अगले ${years(t2, locale)} के लिए ${percent(r2)} साधारण ब्याज लगा। कुल ब्याज ${money(totalI)} है। मूलधन ज्ञात कीजिए।`,
        `${actor} ਨੇ ${institution} ਵਿੱਚ ਕੁਝ ਮੂਲਧਨ ਜਮ੍ਹਾਂ ਕੀਤਾ। ਉਸ ਉੱਤੇ ${years(t1, locale)} ਲਈ ${percent(r1)} ਅਤੇ ਅਗਲੇ ${years(t2, locale)} ਲਈ ${percent(r2)} ਸਧਾਰਨ ਵਿਆਜ ਲੱਗਾ। ਕੁੱਲ ਵਿਆਜ ${money(totalI)} ਹੈ। ਮੂਲਧਨ ਪਤਾ ਕਰੋ।`), mainRule: simpleRule, workedSteps: [
        t(locale, `दर-समय भार = ${q(r1)}×${q(t1)} + ${q(r2)}×${q(t2)} = ${q(exposure)}।`, `ਦਰ-ਸਮਾਂ ਭਾਰ = ${q(r1)}×${q(t1)} + ${q(r2)}×${q(t2)} = ${q(exposure)}।`),
        t(locale, `${money(totalI)} = P × ${q(exposure)} / 100, इसलिए P = ${money(totalI)} × 100 / ${q(exposure)}।`, `${money(totalI)} = P × ${q(exposure)} / 100, ਇਸ ਲਈ P = ${money(totalI)} × 100 / ${q(exposure)}।`),
        t(locale, `मूलधन = ${money(principal)}।`, `ਮੂਲਧਨ = ${money(principal)}।`),
      ] };
    }
    case "INT-QL-025":
    case "INT-QL-026": {
      const p = P(), r1 = rationalValue(values, "firstRate"), r2 = rationalValue(values, "secondRate"), t1 = rationalValue(values, "firstTime"), t2 = rationalValue(values, "secondTime"), totalI = rationalValue(values, "totalInterest");
      const i1 = si(p, r1, t1), i2 = subtractRational(totalI, i1);
      const askingRate = qlId === "INT-QL-025";
      const answer = askingRate ? divideRational(multiplyRational(i2, rational(100)), multiplyRational(p, t2)) : divideRational(multiplyRational(i2, rational(100)), multiplyRational(p, r2));
      return { stem: askingRate ? t(locale,
        `${actor} ${money(p)} को ${institution} में पहले ${years(t1, locale)} तक ${percent(r1)} साधारण ब्याज पर रखता है और फिर अगले ${years(t2, locale)} के लिए दर बदल जाती है। कुल ब्याज ${money(totalI)} है। दूसरी वार्षिक दर ज्ञात कीजिए।`,
        `${actor} ${money(p)} ਨੂੰ ${institution} ਵਿੱਚ ਪਹਿਲਾਂ ${years(t1, locale)} ਲਈ ${percent(r1)} ਸਧਾਰਨ ਵਿਆਜ ਉੱਤੇ ਰੱਖਦਾ ਹੈ ਅਤੇ ਫਿਰ ਅਗਲੇ ${years(t2, locale)} ਲਈ ਦਰ ਬਦਲ ਜਾਂਦੀ ਹੈ। ਕੁੱਲ ਵਿਆਜ ${money(totalI)} ਹੈ। ਦੂਜੀ ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਕਰੋ।`) : t(locale,
        `${actor} ${money(p)} को ${institution} में पहले ${years(t1, locale)} तक ${percent(r1)} और फिर ${percent(r2)} साधारण ब्याज पर रखता है। कुल ब्याज ${money(totalI)} है। दूसरी अवधि ज्ञात कीजिए।`,
        `${actor} ${money(p)} ਨੂੰ ${institution} ਵਿੱਚ ਪਹਿਲਾਂ ${years(t1, locale)} ਲਈ ${percent(r1)} ਅਤੇ ਫਿਰ ${percent(r2)} ਸਧਾਰਨ ਵਿਆਜ ਉੱਤੇ ਰੱਖਦਾ ਹੈ। ਕੁੱਲ ਵਿਆਜ ${money(totalI)} ਹੈ। ਦੂਜੀ ਮਿਆਦ ਪਤਾ ਕਰੋ।`), mainRule: simpleRule, workedSteps: [
        t(locale, `पहली अवधि का ब्याज = ${money(p)} × ${q(r1)} × ${q(t1)} / 100 = ${money(i1)}।`, `ਪਹਿਲੀ ਮਿਆਦ ਦਾ ਵਿਆਜ = ${money(p)} × ${q(r1)} × ${q(t1)} / 100 = ${money(i1)}।`),
        t(locale, `दूसरी अवधि का ब्याज = ${money(totalI)} − ${money(i1)} = ${money(i2)}।`, `ਦੂਜੀ ਮਿਆਦ ਦਾ ਵਿਆਜ = ${money(totalI)} − ${money(i1)} = ${money(i2)}।`),
        askingRate ? t(locale, `R₂ = ${money(i2)} × 100 / (${money(p)} × ${q(t2)}) = ${percent(answer)}।`, `R₂ = ${money(i2)} × 100 / (${money(p)} × ${q(t2)}) = ${percent(answer)}।`) : t(locale, `T₂ = ${money(i2)} × 100 / (${money(p)} × ${q(r2)}) = ${years(answer, locale)}।`, `T₂ = ${money(i2)} × 100 / (${money(p)} × ${q(r2)}) = ${years(answer, locale)}।`),
      ] };
    }
    case "INT-QL-027": {
      const p = P(), r1 = rationalValue(values, "firstRate"), r2 = rationalValue(values, "secondRate"), t1 = rationalValue(values, "firstTime"), t2 = rationalValue(values, "secondTime"), rc = rationalValue(values, "comparisonRate"), tc = rationalValue(values, "comparisonTime");
      const ia = addRational(si(p, r1, t1), si(p, r2, t2)), ib = si(p, rc, tc), diff = subtractRational(ia, ib);
      return { stem: t(locale,
        `${actor} ${money(p)} के लिए दो साधारण-ब्याज योजनाओं की तुलना करता है। योजना A में ${percent(r1)} for ${years(t1, locale)} और फिर ${percent(r2)} for ${years(t2, locale)} है; योजना B में ${percent(rc)} for ${years(tc, locale)} है। योजना A का ब्याज योजना B से कितना अधिक है?`.replaceAll(" for ", " के लिए "),
        `${actor} ${money(p)} ਲਈ ਦੋ ਸਧਾਰਨ-ਵਿਆਜ ਯੋਜਨਾਵਾਂ ਦੀ ਤੁਲਨਾ ਕਰਦਾ ਹੈ। ਯੋਜਨਾ A ਵਿੱਚ ${percent(r1)} for ${years(t1, locale)} ਅਤੇ ਫਿਰ ${percent(r2)} for ${years(t2, locale)} ਹੈ; ਯੋਜਨਾ B ਵਿੱਚ ${percent(rc)} for ${years(tc, locale)} ਹੈ। ਯੋਜਨਾ A ਦਾ ਵਿਆਜ ਯੋਜਨਾ B ਨਾਲੋਂ ਕਿੰਨਾ ਵੱਧ ਹੈ?`.replaceAll(" for ", " ਲਈ ")), mainRule: simpleRule, workedSteps: [
        t(locale, `योजना A का कुल ब्याज = ${money(ia)}।`, `ਯੋਜਨਾ A ਦਾ ਕੁੱਲ ਵਿਆਜ = ${money(ia)}।`),
        t(locale, `योजना B का ब्याज = ${money(p)} × ${q(rc)} × ${q(tc)} / 100 = ${money(ib)}।`, `ਯੋਜਨਾ B ਦਾ ਵਿਆਜ = ${money(p)} × ${q(rc)} × ${q(tc)} / 100 = ${money(ib)}।`),
        t(locale, `अंतर = ${money(ia)} − ${money(ib)} = ${money(diff)}।`, `ਅੰਤਰ = ${money(ia)} − ${money(ib)} = ${money(diff)}।`),
      ] };
    }
    case "INT-QL-028":
    case "INT-QL-029":
    case "INT-QL-030":
    case "INT-QL-031": {
      const p1 = rationalValue(values, "firstPrincipal"), p2 = rationalValue(values, "secondPrincipal"), r1 = rationalValue(values, "firstRate"), r2 = rationalValue(values, "secondRate"), t1 = rationalValue(values, "firstTime"), t2 = rationalValue(values, "secondTime");
      const i1 = si(p1, r1, t1), i2 = si(p2, r2, t2), totalI = values.totalInterest ? rationalValue(values, "totalInterest") : addRational(i1, i2);
      if (qlId === "INT-QL-028") return { stem: t(locale,
        `${actor} ${institution} में ${money(p1)} को ${percent(r1)} पर ${years(t1, locale)} और ${money(p2)} को ${percent(r2)} पर ${years(t2, locale)} साधारण ब्याज के लिए रखता है। संयुक्त ब्याज ज्ञात कीजिए।`,
        `${actor} ${institution} ਵਿੱਚ ${money(p1)} ਨੂੰ ${percent(r1)} ਉੱਤੇ ${years(t1, locale)} ਅਤੇ ${money(p2)} ਨੂੰ ${percent(r2)} ਉੱਤੇ ${years(t2, locale)} ਸਧਾਰਨ ਵਿਆਜ ਲਈ ਰੱਖਦਾ ਹੈ। ਮਿਲਿਆ ਕੁੱਲ ਵਿਆਜ ਪਤਾ ਕਰੋ।`), mainRule: simpleRule, workedSteps: [
        t(locale, `पहली जमा का ब्याज = ${money(i1)}।`, `ਪਹਿਲੀ ਜਮ੍ਹਾਂ ਦਾ ਵਿਆਜ = ${money(i1)}।`),
        t(locale, `दूसरी जमा का ब्याज = ${money(i2)}।`, `ਦੂਜੀ ਜਮ੍ਹਾਂ ਦਾ ਵਿਆਜ = ${money(i2)}।`),
        t(locale, `संयुक्त ब्याज = ${money(i1)} + ${money(i2)} = ${money(addRational(i1, i2))}।`, `ਕੁੱਲ ਵਿਆਜ = ${money(i1)} + ${money(i2)} = ${money(addRational(i1, i2))}।`),
      ] };
      const unknownI = subtractRational(totalI, i1);
      const answer = qlId === "INT-QL-029" ? divideRational(multiplyRational(unknownI, rational(100)), multiplyRational(r2, t2)) : qlId === "INT-QL-030" ? divideRational(multiplyRational(unknownI, rational(100)), multiplyRational(p2, t2)) : divideRational(multiplyRational(unknownI, rational(100)), multiplyRational(p2, r2));
      const target = qlId === "INT-QL-029" ? t(locale, "दूसरा मूलधन", "ਦੂਜਾ ਮੂਲਧਨ") : qlId === "INT-QL-030" ? t(locale, "दूसरी दर", "ਦੂਜੀ ਦਰ") : t(locale, "दूसरी अवधि", "ਦੂਜੀ ਮਿਆਦ");
      const secondKnown = qlId === "INT-QL-029" ? t(locale, `एक अज्ञात राशि को ${percent(r2)} पर ${years(t2, locale)}`, `ਇੱਕ ਅਣਜਾਣ ਰਕਮ ਨੂੰ ${percent(r2)} ਉੱਤੇ ${years(t2, locale)}`) : qlId === "INT-QL-030" ? t(locale, `${money(p2)} को अज्ञात दर पर ${years(t2, locale)}`, `${money(p2)} ਨੂੰ ਅਣਜਾਣ ਦਰ ਉੱਤੇ ${years(t2, locale)}`) : t(locale, `${money(p2)} को ${percent(r2)} पर अज्ञात अवधि`, `${money(p2)} ਨੂੰ ${percent(r2)} ਉੱਤੇ ਅਣਜਾਣ ਮਿਆਦ`);
      return { stem: t(locale,
        `${actor} ${institution} में ${money(p1)} को ${percent(r1)} पर ${years(t1, locale)} और ${secondKnown} रखता है। कुल साधारण ब्याज ${money(totalI)} है। ${target} ज्ञात कीजिए।`,
        `${actor} ${institution} ਵਿੱਚ ${money(p1)} ਨੂੰ ${percent(r1)} ਉੱਤੇ ${years(t1, locale)} ਅਤੇ ${secondKnown} ਰੱਖਦਾ ਹੈ। ਕੁੱਲ ਸਧਾਰਨ ਵਿਆਜ ${money(totalI)} ਹੈ। ${target} ਪਤਾ ਕਰੋ।`), mainRule: simpleRule, workedSteps: [
        t(locale, `पहली जमा का ब्याज = ${money(i1)}।`, `ਪਹਿਲੀ ਜਮ੍ਹਾਂ ਦਾ ਵਿਆਜ = ${money(i1)}।`),
        t(locale, `दूसरी जमा का ब्याज = ${money(totalI)} − ${money(i1)} = ${money(unknownI)}।`, `ਦੂਜੀ ਜਮ੍ਹਾਂ ਦਾ ਵਿਆਜ = ${money(totalI)} − ${money(i1)} = ${money(unknownI)}।`),
        qlId === "INT-QL-029" ? t(locale, `P₂ = ${money(unknownI)} × 100 / (${q(r2)} × ${q(t2)}) = ${money(answer)}।`, `P₂ = ${money(unknownI)} × 100 / (${q(r2)} × ${q(t2)}) = ${money(answer)}।`) : qlId === "INT-QL-030" ? t(locale, `R₂ = ${money(unknownI)} × 100 / (${money(p2)} × ${q(t2)}) = ${percent(answer)}।`, `R₂ = ${money(unknownI)} × 100 / (${money(p2)} × ${q(t2)}) = ${percent(answer)}।`) : t(locale, `T₂ = ${money(unknownI)} × 100 / (${money(p2)} × ${q(r2)}) = ${years(answer, locale)}।`, `T₂ = ${money(unknownI)} × 100 / (${money(p2)} × ${q(r2)}) = ${years(answer, locale)}।`),
      ] };
    }
    case "INT-QL-032": {
      const p1 = rationalValue(values, "firstPrincipal"), p2 = rationalValue(values, "secondPrincipal"), t1 = rationalValue(values, "firstTime"), t2 = rationalValue(values, "secondTime"), totalI = rationalValue(values, "totalInterest");
      const exposure = addRational(multiplyRational(p1, t1), multiplyRational(p2, t2));
      const rate = divideRational(multiplyRational(totalI, rational(100)), exposure);
      return { stem: t(locale,
        `${actor} ${money(p1)} को ${years(t1, locale)} और ${money(p2)} को ${years(t2, locale)} के लिए ${institution} में एक ही अज्ञात साधारण-ब्याज दर पर रखता है। संयुक्त ब्याज ${money(totalI)} है। समान वार्षिक दर ज्ञात कीजिए।`,
        `${actor} ${money(p1)} ਨੂੰ ${years(t1, locale)} ਅਤੇ ${money(p2)} ਨੂੰ ${years(t2, locale)} ਲਈ ${institution} ਵਿੱਚ ਇੱਕੋ ਅਣਜਾਣ ਸਧਾਰਨ-ਵਿਆਜ ਦਰ ਉੱਤੇ ਰੱਖਦਾ ਹੈ। ਕੁੱਲ ਵਿਆਜ ${money(totalI)} ਹੈ। ਸਾਂਝੀ ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਕਰੋ।`), mainRule: simpleRule, workedSteps: [
        t(locale, `कुल भार = ${money(p1)}×${q(t1)} + ${money(p2)}×${q(t2)} = ${q(exposure)}।`, `ਕੁੱਲ ਭਾਰ = ${money(p1)}×${q(t1)} + ${money(p2)}×${q(t2)} = ${q(exposure)}।`),
        t(locale, `${money(totalI)} = R × ${q(exposure)} / 100।`, `${money(totalI)} = R × ${q(exposure)} / 100।`),
        t(locale, `R = ${money(totalI)} × 100 / ${q(exposure)} = ${percent(rate)}।`, `R = ${money(totalI)} × 100 / ${q(exposure)} = ${percent(rate)}।`),
      ] };
    }
    case "INT-QL-033":
    case "INT-QL-034": {
      const totalP = rationalValue(values, "totalPrincipal"), r1 = rationalValue(values, "firstRate"), r2 = rationalValue(values, "secondRate"), totalI = rationalValue(values, "totalInterest");
      const tValue = values.time ? rationalValue(values, "time") : rationalValue(values, "firstTime");
      const firstT = values.firstTime ? rationalValue(values, "firstTime") : tValue;
      const secondT = values.secondTime ? rationalValue(values, "secondTime") : tValue;
      const firstPart = values.firstPart ? rationalValue(values, "firstPart") : rationalValue(values, "firstPrincipal");
      const secondPart = values.secondPart ? rationalValue(values, "secondPart") : rationalValue(values, "secondPrincipal");
      const answerRatio = divideRational(firstPart, secondPart);
      return { stem: qlId === "INT-QL-033" ? t(locale,
        `${actor} ${money(totalP)} को दो साधारण-ब्याज जमाओं में बाँटता है। पहला भाग ${percent(r1)} पर ${years(firstT, locale)} और बाकी भाग ${percent(r2)} पर ${years(secondT, locale)} रखा जाता है। कुल ब्याज ${money(totalI)} है। पहले भाग की राशि ज्ञात कीजिए।`,
        `${actor} ${money(totalP)} ਨੂੰ ਦੋ ਸਧਾਰਨ-ਵਿਆਜ ਜਮ੍ਹਾਂ ਵਿੱਚ ਵੰਡਦਾ ਹੈ। ਪਹਿਲਾ ਹਿੱਸਾ ${percent(r1)} ਉੱਤੇ ${years(firstT, locale)} ਅਤੇ ਬਾਕੀ ਹਿੱਸਾ ${percent(r2)} ਉੱਤੇ ${years(secondT, locale)} ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ। ਕੁੱਲ ਵਿਆਜ ${money(totalI)} ਹੈ। ਪਹਿਲੇ ਹਿੱਸੇ ਦੀ ਰਕਮ ਪਤਾ ਕਰੋ।`) : t(locale,
        `${actor} ${money(totalP)} को दो जमाओं में बाँटता है। पहला भाग ${percent(r1)} और दूसरा ${percent(r2)} पर ${years(tValue, locale)} रखा जाता है। कुल साधारण ब्याज ${money(totalI)} है। पहले भाग और दूसरे भाग का अनुपात ज्ञात कीजिए।`,
        `${actor} ${money(totalP)} ਨੂੰ ਦੋ ਜਮ੍ਹਾਂ ਵਿੱਚ ਵੰਡਦਾ ਹੈ। ਪਹਿਲਾ ਹਿੱਸਾ ${percent(r1)} ਅਤੇ ਦੂਜਾ ${percent(r2)} ਉੱਤੇ ${years(tValue, locale)} ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ। ਕੁੱਲ ਸਧਾਰਨ ਵਿਆਜ ${money(totalI)} ਹੈ। ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਹਿੱਸੇ ਦਾ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।`), mainRule: simpleRule, workedSteps: [
        t(locale, `पहले भाग को x मानें; दूसरा भाग ${money(totalP)} − x होगा।`, `ਪਹਿਲੇ ਹਿੱਸੇ ਨੂੰ x ਮੰਨੋ; ਦੂਜਾ ਹਿੱਸਾ ${money(totalP)} − x ਹੋਵੇਗਾ।`),
        t(locale, `${money(totalI)} = [x×${q(r1)}×${q(firstT)} + (${q(totalP)}−x)×${q(r2)}×${q(secondT)}] / 100।`, `${money(totalI)} = [x×${q(r1)}×${q(firstT)} + (${q(totalP)}−x)×${q(r2)}×${q(secondT)}] / 100।`),
        t(locale, `हल करने पर पहला भाग ${money(firstPart)} और दूसरा भाग ${money(secondPart)} मिलता है।`, `ਹੱਲ ਕਰਨ ਉੱਤੇ ਪਹਿਲਾ ਹਿੱਸਾ ${money(firstPart)} ਅਤੇ ਦੂਜਾ ਹਿੱਸਾ ${money(secondPart)} ਮਿਲਦਾ ਹੈ।`),
        ...(qlId === "INT-QL-034" ? [t(locale, `आवश्यक अनुपात = ${money(firstPart)} : ${money(secondPart)} = ${ratio(answerRatio)}।`, `ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ = ${money(firstPart)} : ${money(secondPart)} = ${ratio(answerRatio)}।`)] : []),
      ] };
    }
    case "INT-QL-035":
    case "INT-QL-036":
    case "INT-QL-037":
    case "INT-QL-038": {
      const r1 = rationalValue(values, "firstRate"), r2 = rationalValue(values, "secondRate"), t1 = rationalValue(values, "firstTime"), t2 = rationalValue(values, "secondTime");
      if (qlId === "INT-QL-038") {
        const result = divideRational(multiplyRational(r2, t2), multiplyRational(r1, t1));
        return { stem: t(locale,
          `दो मूलधन समान साधारण ब्याज देते हैं। पहला ${percent(r1)} पर ${years(t1, locale)} और दूसरा ${percent(r2)} पर ${years(t2, locale)} लगाया गया है। पहले मूलधन का दूसरे मूलधन से अनुपात ज्ञात कीजिए।`,
          `ਦੋ ਮੂਲਧਨ ਬਰਾਬਰ ਸਧਾਰਨ ਵਿਆਜ ਦਿੰਦੇ ਹਨ। ਪਹਿਲਾ ${percent(r1)} ਉੱਤੇ ${years(t1, locale)} ਅਤੇ ਦੂਜਾ ${percent(r2)} ਉੱਤੇ ${years(t2, locale)} ਲਗਾਇਆ ਗਿਆ ਹੈ। ਪਹਿਲੇ ਮੂਲਧਨ ਦਾ ਦੂਜੇ ਨਾਲ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।`), mainRule: simpleRule, workedSteps: [
          t(locale, `समान ब्याज से P₁×${q(r1)}×${q(t1)} = P₂×${q(r2)}×${q(t2)}।`, `ਬਰਾਬਰ ਵਿਆਜ ਤੋਂ P₁×${q(r1)}×${q(t1)} = P₂×${q(r2)}×${q(t2)}।`),
          t(locale, `P₁/P₂ = (${q(r2)}×${q(t2)}) / (${q(r1)}×${q(t1)}) = ${q(result)}।`, `P₁/P₂ = (${q(r2)}×${q(t2)}) / (${q(r1)}×${q(t1)}) = ${q(result)}।`),
          t(locale, `अतः अनुपात = ${ratio(result)}।`, `ਇਸ ਲਈ ਅਨੁਪਾਤ = ${ratio(result)}।`),
        ] };
      }
      const p1 = rationalValue(values, "firstPrincipal"), p2 = rationalValue(values, "secondPrincipal"), commonI = rationalValue(values, "commonInterest");
      const i1 = si(p1, r1, t1);
      const targetLabel = qlId === "INT-QL-035" ? t(locale, "दूसरा मूलधन", "ਦੂਜਾ ਮੂਲਧਨ") : qlId === "INT-QL-036" ? t(locale, "दूसरी दर", "ਦੂਜੀ ਦਰ") : t(locale, "दूसरी अवधि", "ਦੂਜੀ ਮਿਆਦ");
      const answer = qlId === "INT-QL-035" ? divideRational(multiplyRational(commonI, rational(100)), multiplyRational(r2, t2)) : qlId === "INT-QL-036" ? divideRational(multiplyRational(commonI, rational(100)), multiplyRational(p2, t2)) : divideRational(multiplyRational(commonI, rational(100)), multiplyRational(p2, r2));
      const secondDescription = qlId === "INT-QL-035" ? t(locale, `अज्ञात मूलधन को ${percent(r2)} पर ${years(t2, locale)}`, `ਅਣਜਾਣ ਮੂਲਧਨ ਨੂੰ ${percent(r2)} ਉੱਤੇ ${years(t2, locale)}`) : qlId === "INT-QL-036" ? t(locale, `${money(p2)} को अज्ञात दर पर ${years(t2, locale)}`, `${money(p2)} ਨੂੰ ਅਣਜਾਣ ਦਰ ਉੱਤੇ ${years(t2, locale)}`) : t(locale, `${money(p2)} को ${percent(r2)} पर अज्ञात अवधि`, `${money(p2)} ਨੂੰ ${percent(r2)} ਉੱਤੇ ਅਣਜਾਣ ਮਿਆਦ`);
      return { stem: t(locale,
        `${money(p1)} को ${percent(r1)} पर ${years(t1, locale)} लगाने से उतना ही साधारण ब्याज मिलता है जितना ${secondDescription} लगाने से। ${targetLabel} ज्ञात कीजिए।`,
        `${money(p1)} ਨੂੰ ${percent(r1)} ਉੱਤੇ ${years(t1, locale)} ਲਗਾਉਣ ਨਾਲ ਉਨਾ ਹੀ ਸਧਾਰਨ ਵਿਆਜ ਮਿਲਦਾ ਹੈ ਜਿੰਨਾ ${secondDescription} ਲਗਾਉਣ ਨਾਲ। ${targetLabel} ਪਤਾ ਕਰੋ।`), mainRule: simpleRule, workedSteps: [
        t(locale, `पहली जमा का ब्याज = ${money(p1)} × ${q(r1)} × ${q(t1)} / 100 = ${money(i1)}।`, `ਪਹਿਲੀ ਜਮ੍ਹਾਂ ਦਾ ਵਿਆਜ = ${money(p1)} × ${q(r1)} × ${q(t1)} / 100 = ${money(i1)}।`),
        t(locale, `दोनों ब्याज समान हैं, इसलिए दूसरी जमा का ब्याज भी ${money(commonI)} है।`, `ਦੋਵੇਂ ਵਿਆਜ ਬਰਾਬਰ ਹਨ, ਇਸ ਲਈ ਦੂਜੀ ਜਮ੍ਹਾਂ ਦਾ ਵਿਆਜ ਵੀ ${money(commonI)} ਹੈ।`),
        qlId === "INT-QL-035" ? t(locale, `P₂ = ${money(commonI)} × 100 / (${q(r2)}×${q(t2)}) = ${money(answer)}।`, `P₂ = ${money(commonI)} × 100 / (${q(r2)}×${q(t2)}) = ${money(answer)}।`) : qlId === "INT-QL-036" ? t(locale, `R₂ = ${money(commonI)} × 100 / (${money(p2)}×${q(t2)}) = ${percent(answer)}।`, `R₂ = ${money(commonI)} × 100 / (${money(p2)}×${q(t2)}) = ${percent(answer)}।`) : t(locale, `T₂ = ${money(commonI)} × 100 / (${money(p2)}×${q(r2)}) = ${years(answer, locale)}।`, `T₂ = ${money(commonI)} × 100 / (${money(p2)}×${q(r2)}) = ${years(answer, locale)}।`),
      ] };
    }
    case "INT-QL-039":
    case "INT-QL-040":
    case "INT-QL-041": {
      const p = P();
      if (qlId === "INT-QL-041") {
        const rate = rationalValue(values, "rate"), revised = rationalValue(values, "revisedDuration"), extra = rationalValue(values, "additionalInterest");
        const deltaT = divideRational(multiplyRational(extra, rational(100)), multiplyRational(p, rate));
        const original = subtractRational(revised, deltaT);
        return { stem: t(locale,
          `${actor} ${money(p)} को ${percent(rate)} साधारण ब्याज पर रखता है। अवधि को ${years(revised, locale)} तक बढ़ाने पर ब्याज ${money(extra)} बढ़ जाता है। मूल अवधि ज्ञात कीजिए।`,
          `${actor} ${money(p)} ਨੂੰ ${percent(rate)} ਸਧਾਰਨ ਵਿਆਜ ਉੱਤੇ ਰੱਖਦਾ ਹੈ। ਮਿਆਦ ਨੂੰ ${years(revised, locale)} ਤੱਕ ਵਧਾਉਣ ਨਾਲ ਵਿਆਜ ${money(extra)} ਵੱਧ ਜਾਂਦਾ ਹੈ। ਮੁੱਢਲੀ ਮਿਆਦ ਪਤਾ ਕਰੋ।`), mainRule: simpleRule, workedSteps: [
          t(locale, `अतिरिक्त ब्याज = P × R × ΔT / 100।`, `ਵਾਧੂ ਵਿਆਜ = P × R × ΔT / 100।`),
          t(locale, `ΔT = ${money(extra)} × 100 / (${money(p)}×${q(rate)}) = ${years(deltaT, locale)}।`, `ΔT = ${money(extra)} × 100 / (${money(p)}×${q(rate)}) = ${years(deltaT, locale)}।`),
          t(locale, `मूल अवधि = ${q(revised)} − ${q(deltaT)} = ${years(original, locale)}।`, `ਮੁੱਢਲੀ ਮਿਆਦ = ${q(revised)} − ${q(deltaT)} = ${years(original, locale)}।`),
        ] };
      }
      const oldRate = rationalValue(values, "oldRate"), newRate = rationalValue(values, "newRate"), time = rationalValue(values, "time");
      const extra = values.extraInterest ? rationalValue(values, "extraInterest") : subtractRational(si(p, newRate, time), si(p, oldRate, time));
      const gap = subtractRational(newRate, oldRate);
      return { stem: qlId === "INT-QL-039" ? t(locale,
        `${actor} ${money(p)} को ${years(time, locale)} के लिए ${percent(oldRate)} के बजाय ${percent(newRate)} साधारण ब्याज पर रखता है। अधिक दर से कितना अतिरिक्त ब्याज मिलेगा?`,
        `${actor} ${money(p)} ਨੂੰ ${years(time, locale)} ਲਈ ${percent(oldRate)} ਦੀ ਥਾਂ ${percent(newRate)} ਸਧਾਰਨ ਵਿਆਜ ਉੱਤੇ ਰੱਖਦਾ ਹੈ। ਵੱਧ ਦਰ ਨਾਲ ਕਿੰਨਾ ਵਾਧੂ ਵਿਆਜ ਮਿਲੇਗਾ?`) : t(locale,
        `${actor} ${money(p)} को ${years(time, locale)} के लिए नई ${percent(newRate)} साधारण-ब्याज दर पर रखता है और पहले से ${money(extra)} अधिक ब्याज पाता है। पुरानी वार्षिक दर ज्ञात कीजिए।`,
        `${actor} ${money(p)} ਨੂੰ ${years(time, locale)} ਲਈ ਨਵੀਂ ${percent(newRate)} ਸਧਾਰਨ-ਵਿਆਜ ਦਰ ਉੱਤੇ ਰੱਖਦਾ ਹੈ ਅਤੇ ਪਹਿਲਾਂ ਨਾਲੋਂ ${money(extra)} ਵੱਧ ਵਿਆਜ ਲੈਂਦਾ ਹੈ। ਪੁਰਾਣੀ ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਕਰੋ।`), mainRule: simpleRule, workedSteps: [
        t(locale, `दर का अंतर = ${q(newRate)} − ${q(oldRate)} = ${percent(gap)}।`, `ਦਰ ਦਾ ਅੰਤਰ = ${q(newRate)} − ${q(oldRate)} = ${percent(gap)}।`),
        t(locale, `अतिरिक्त ब्याज = ${money(p)} × ${q(gap)} × ${q(time)} / 100 = ${money(extra)}।`, `ਵਾਧੂ ਵਿਆਜ = ${money(p)} × ${q(gap)} × ${q(time)} / 100 = ${money(extra)}।`),
        ...(qlId === "INT-QL-040" ? [t(locale, `पुरानी दर = ${q(newRate)} − ${q(gap)} = ${percent(oldRate)}।`, `ਪੁਰਾਣੀ ਦਰ = ${q(newRate)} − ${q(gap)} = ${percent(oldRate)}।`)] : []),
      ] };
    }
    case "INT-QL-042":
    case "INT-QL-043":
    case "INT-QL-044":
    case "INT-QL-045": {
      const opening = rationalValue(values, "openingPrincipal"), rate = rationalValue(values, "rate"), horizon = rationalValue(values, "horizon");
      if (qlId === "INT-QL-045") {
        const repayment = rationalValue(values, "repayment"), early = rationalValue(values, "earlyTime"), late = rationalValue(values, "lateTime"), delta = subtractRational(late, early), saving = si(repayment, rate, delta);
        return { stem: t(locale,
          `${actor} पर ${money(opening)} का ऋण ${percent(rate)} साधारण ब्याज पर ${years(horizon, locale)} तक है। ${money(repayment)} का भुगतान ${years(early, locale)} बाद या ${years(late, locale)} बाद किया जा सकता है। पहले भुगतान करने पर ब्याज कितने से कम होगा?`,
          `${actor} ਉੱਤੇ ${money(opening)} ਦਾ ਕਰਜ਼ਾ ${percent(rate)} ਸਧਾਰਨ ਵਿਆਜ ਉੱਤੇ ${years(horizon, locale)} ਤੱਕ ਹੈ। ${money(repayment)} ਦਾ ਭੁਗਤਾਨ ${years(early, locale)} ਬਾਅਦ ਜਾਂ ${years(late, locale)} ਬਾਅਦ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ। ਪਹਿਲਾਂ ਭੁਗਤਾਨ ਕਰਨ ਨਾਲ ਵਿਆਜ ਕਿੰਨਾ ਘੱਟ ਹੋਵੇਗਾ?`), mainRule: simpleRule, workedSteps: [
          t(locale, `राशि ${q(late)} − ${q(early)} = ${years(delta, locale)} पहले मूलधन से हट जाती है।`, `ਰਕਮ ${q(late)} − ${q(early)} = ${years(delta, locale)} ਪਹਿਲਾਂ ਮੂਲਧਨ ਤੋਂ ਹਟ ਜਾਂਦੀ ਹੈ।`),
          t(locale, `ब्याज की बचत = ${money(repayment)} × ${q(rate)} × ${q(delta)} / 100 = ${money(saving)}।`, `ਵਿਆਜ ਦੀ ਬਚਤ = ${money(repayment)} × ${q(rate)} × ${q(delta)} / 100 = ${money(saving)}।`),
        ] };
      }
      const repayment = values.repaymentAmount ? rationalValue(values, "repaymentAmount") : rationalValue(values, "repayment");
      const repaymentTime = rationalValue(values, "repaymentTime");
      const remaining = subtractRational(opening, repayment);
      if (qlId === "INT-QL-042") {
        const i1 = si(opening, rate, repaymentTime), remainingTime = subtractRational(horizon, repaymentTime), i2 = si(remaining, rate, remainingTime), total = addRational(i1, i2);
        return { stem: t(locale,
          `${actor} पर ${money(opening)} का ऋण ${percent(rate)} वार्षिक साधारण ब्याज पर है। ${years(repaymentTime, locale)} बाद ${money(repayment)} मूलधन चुका दिया जाता है; फिर ब्याज केवल बचे मूलधन पर ${years(horizon, locale)} की कुल अवधि तक चलता है। कुल ब्याज ज्ञात कीजिए।`,
          `${actor} ਉੱਤੇ ${money(opening)} ਦਾ ਕਰਜ਼ਾ ${percent(rate)} ਸਾਲਾਨਾ ਸਧਾਰਨ ਵਿਆਜ ਉੱਤੇ ਹੈ। ${years(repaymentTime, locale)} ਬਾਅਦ ${money(repayment)} ਮੂਲਧਨ ਵਾਪਸ ਕਰ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ; ਫਿਰ ਵਿਆਜ ਸਿਰਫ਼ ਬਚੇ ਮੂਲਧਨ ਉੱਤੇ ${years(horizon, locale)} ਦੀ ਕੁੱਲ ਮਿਆਦ ਤੱਕ ਲੱਗਦਾ ਹੈ। ਕੁੱਲ ਵਿਆਜ ਪਤਾ ਕਰੋ।`), mainRule: simpleRule, workedSteps: [
          t(locale, `भुगतान से पहले ब्याज = ${money(opening)} × ${q(rate)} × ${q(repaymentTime)} / 100 = ${money(i1)}।`, `ਭੁਗਤਾਨ ਤੋਂ ਪਹਿਲਾਂ ਵਿਆਜ = ${money(opening)} × ${q(rate)} × ${q(repaymentTime)} / 100 = ${money(i1)}।`),
          t(locale, `बचा मूलधन = ${money(opening)} − ${money(repayment)} = ${money(remaining)}।`, `ਬਚਿਆ ਮੂਲਧਨ = ${money(opening)} − ${money(repayment)} = ${money(remaining)}।`),
          t(locale, `बाकी अवधि का ब्याज = ${money(remaining)} × ${q(rate)} × ${q(remainingTime)} / 100 = ${money(i2)}।`, `ਬਾਕੀ ਮਿਆਦ ਦਾ ਵਿਆਜ = ${money(remaining)} × ${q(rate)} × ${q(remainingTime)} / 100 = ${money(i2)}।`),
          t(locale, `कुल ब्याज = ${money(i1)} + ${money(i2)} = ${money(total)}।`, `ਕੁੱਲ ਵਿਆਜ = ${money(i1)} + ${money(i2)} = ${money(total)}।`),
        ] };
      }
      const totalI = rationalValue(values, "totalInterest");
      if (qlId === "INT-QL-043") {
        const fullI = si(opening, rate, horizon), saved = subtractRational(fullI, totalI), savingTime = subtractRational(horizon, repaymentTime), repay = divideRational(multiplyRational(saved, rational(100)), multiplyRational(rate, savingTime));
        return { stem: t(locale,
          `${actor} पर ${money(opening)} का ऋण ${percent(rate)} साधारण ब्याज पर ${years(horizon, locale)} के लिए है। ${years(repaymentTime, locale)} बाद मूलधन का कुछ भाग चुका दिया जाता है और कुल ब्याज ${money(totalI)} रहता है। चुकाई गई मूलधन राशि ज्ञात कीजिए।`,
          `${actor} ਉੱਤੇ ${money(opening)} ਦਾ ਕਰਜ਼ਾ ${percent(rate)} ਸਧਾਰਨ ਵਿਆਜ ਉੱਤੇ ${years(horizon, locale)} ਲਈ ਹੈ। ${years(repaymentTime, locale)} ਬਾਅਦ ਮੂਲਧਨ ਦਾ ਕੁਝ ਹਿੱਸਾ ਵਾਪਸ ਕੀਤਾ ਜਾਂਦਾ ਹੈ ਅਤੇ ਕੁੱਲ ਵਿਆਜ ${money(totalI)} ਰਹਿੰਦਾ ਹੈ। ਵਾਪਸ ਕੀਤੀ ਮੂਲਧਨ ਰਕਮ ਪਤਾ ਕਰੋ।`), mainRule: simpleRule, workedSteps: [
          t(locale, `बिना भुगतान पूरा ब्याज = ${money(fullI)}।`, `ਭੁਗਤਾਨ ਬਿਨਾਂ ਪੂਰਾ ਵਿਆਜ = ${money(fullI)}।`),
          t(locale, `बचा हुआ ब्याज = ${money(fullI)} − ${money(totalI)} = ${money(saved)}; यह बचत ${years(savingTime, locale)} की है।`, `ਬਚਿਆ ਵਿਆਜ = ${money(fullI)} − ${money(totalI)} = ${money(saved)}; ਇਹ ਬਚਤ ${years(savingTime, locale)} ਦੀ ਹੈ।`),
          t(locale, `भुगतान = ${money(saved)} × 100 / (${q(rate)}×${q(savingTime)}) = ${money(repay)}।`, `ਭੁਗਤਾਨ = ${money(saved)} × 100 / (${q(rate)}×${q(savingTime)}) = ${money(repay)}।`),
        ] };
      }
      const baseInterest = si(remaining, rate, horizon), extraBeforeRepayment = subtractRational(totalI, baseInterest), time = divideRational(multiplyRational(extraBeforeRepayment, rational(100)), multiplyRational(repayment, rate));
      return { stem: t(locale,
        `${actor} पर ${money(opening)} का ऋण ${percent(rate)} साधारण ब्याज पर कुल ${years(horizon, locale)} के लिए है। ${money(repayment)} का भुगतान किसी अज्ञात समय पर किया गया। कुल ब्याज ${money(totalI)} है। भुगतान कब किया गया?`,
        `${actor} ਉੱਤੇ ${money(opening)} ਦਾ ਕਰਜ਼ਾ ${percent(rate)} ਸਧਾਰਨ ਵਿਆਜ ਉੱਤੇ ਕੁੱਲ ${years(horizon, locale)} ਲਈ ਹੈ। ${money(repayment)} ਦਾ ਭੁਗਤਾਨ ਕਿਸੇ ਅਣਜਾਣ ਸਮੇਂ ਉੱਤੇ ਕੀਤਾ ਗਿਆ। ਕੁੱਲ ਵਿਆਜ ${money(totalI)} ਹੈ। ਭੁਗਤਾਨ ਕਦੋਂ ਕੀਤਾ ਗਿਆ?`), mainRule: simpleRule, workedSteps: [
        t(locale, `अगर भुगतान शुरू में ही हो जाता तो बचे ${money(remaining)} पर ${years(horizon, locale)} का ब्याज ${money(baseInterest)} होता।`, `ਜੇ ਭੁਗਤਾਨ ਸ਼ੁਰੂ ਵਿੱਚ ਹੀ ਹੋ ਜਾਂਦਾ ਤਾਂ ਬਚੇ ${money(remaining)} ਉੱਤੇ ${years(horizon, locale)} ਦਾ ਵਿਆਜ ${money(baseInterest)} ਹੁੰਦਾ।`),
        t(locale, `वास्तविक कुल ब्याज में अतिरिक्त हिस्सा = ${money(totalI)} − ${money(baseInterest)} = ${money(extraBeforeRepayment)}।`, `ਅਸਲ ਕੁੱਲ ਵਿਆਜ ਵਿੱਚ ਵਾਧੂ ਹਿੱਸਾ = ${money(totalI)} − ${money(baseInterest)} = ${money(extraBeforeRepayment)}।`),
        t(locale, `यह ${money(repayment)} पर भुगतान से पहले का ब्याज है: t = ${money(extraBeforeRepayment)} × 100 / (${money(repayment)}×${q(rate)}) = ${years(time, locale)}।`, `ਇਹ ${money(repayment)} ਉੱਤੇ ਭੁਗਤਾਨ ਤੋਂ ਪਹਿਲਾਂ ਦਾ ਵਿਆਜ ਹੈ: t = ${money(extraBeforeRepayment)} × 100 / (${money(repayment)}×${q(rate)}) = ${years(time, locale)}।`),
      ] };
    }
    case "INT-QL-046":
    case "INT-QL-047":
    case "INT-QL-048":
    case "INT-QL-049": {
      const p = P(), rb = rationalValue(values, "borrowRate"), rl = values.lendRate ? rationalValue(values, "lendRate") : rationalValue(values, "lendingRate"), time = rationalValue(values, "time");
      const spread = subtractRational(rl, rb), gain = values.netGain ? rationalValue(values, "netGain") : si(p, spread, time);
      const stem = qlId === "INT-QL-046" ? t(locale,
        `${actor} ${money(p)} को ${percent(rb)} साधारण ब्याज पर उधार लेता है और उतनी ही राशि को उसी ${years(time, locale)} के लिए ${percent(rl)} पर उधार देता है। शुद्ध ब्याज लाभ ज्ञात कीजिए।`,
        `${actor} ${money(p)} ਨੂੰ ${percent(rb)} ਸਧਾਰਨ ਵਿਆਜ ਉੱਤੇ ਕਰਜ਼ ਲੈਂਦਾ ਹੈ ਅਤੇ ਓਹੀ ਰਕਮ ਉਸੇ ${years(time, locale)} ਲਈ ${percent(rl)} ਉੱਤੇ ਕਰਜ਼ ਦਿੰਦਾ ਹੈ। ਸ਼ੁੱਧ ਵਿਆਜ ਲਾਭ ਪਤਾ ਕਰੋ।`) : qlId === "INT-QL-047" ? t(locale,
        `${actor} ${money(p)} को ${percent(rb)} साधारण ब्याज पर उधार लेकर उसी ${years(time, locale)} के लिए उधार देता है। शुद्ध लाभ ${money(gain)} है। उधार देने की वार्षिक दर ज्ञात कीजिए।`,
        `${actor} ${money(p)} ਨੂੰ ${percent(rb)} ਸਧਾਰਨ ਵਿਆਜ ਉੱਤੇ ਕਰਜ਼ ਲੈ ਕੇ ਉਸੇ ${years(time, locale)} ਲਈ ਅੱਗੇ ਕਰਜ਼ ਦਿੰਦਾ ਹੈ। ਸ਼ੁੱਧ ਲਾਭ ${money(gain)} ਹੈ। ਕਰਜ਼ ਦੇਣ ਦੀ ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਕਰੋ।`) : qlId === "INT-QL-048" ? t(locale,
        `${actor} किसी राशि को ${percent(rb)} साधारण ब्याज पर उधार लेता है और उसी राशि को ${years(time, locale)} के लिए ${percent(rl)} पर उधार देता है। शुद्ध लाभ ${money(gain)} है। मूल राशि ज्ञात कीजिए।`,
        `${actor} ਕਿਸੇ ਰਕਮ ਨੂੰ ${percent(rb)} ਸਧਾਰਨ ਵਿਆਜ ਉੱਤੇ ਕਰਜ਼ ਲੈਂਦਾ ਹੈ ਅਤੇ ਓਹੀ ਰਕਮ ${years(time, locale)} ਲਈ ${percent(rl)} ਉੱਤੇ ਕਰਜ਼ ਦਿੰਦਾ ਹੈ। ਸ਼ੁੱਧ ਲਾਭ ${money(gain)} ਹੈ। ਮੂਲ ਰਕਮ ਪਤਾ ਕਰੋ।`) : t(locale,
        `${actor} ${money(p)} को ${percent(rb)} साधारण ब्याज पर उधार लेकर ${percent(rl)} पर समान अज्ञात अवधि के लिए उधार देता है। शुद्ध लाभ ${money(gain)} है। अवधि ज्ञात कीजिए।`,
        `${actor} ${money(p)} ਨੂੰ ${percent(rb)} ਸਧਾਰਨ ਵਿਆਜ ਉੱਤੇ ਕਰਜ਼ ਲੈ ਕੇ ${percent(rl)} ਉੱਤੇ ਇੱਕੋ ਅਣਜਾਣ ਮਿਆਦ ਲਈ ਕਰਜ਼ ਦਿੰਦਾ ਹੈ। ਸ਼ੁੱਧ ਲਾਭ ${money(gain)} ਹੈ। ਮਿਆਦ ਪਤਾ ਕਰੋ।`);
      const answer = qlId === "INT-QL-047" ? addRational(rb, divideRational(multiplyRational(gain, rational(100)), multiplyRational(p, time))) : qlId === "INT-QL-048" ? divideRational(multiplyRational(gain, rational(100)), multiplyRational(spread, time)) : qlId === "INT-QL-049" ? divideRational(multiplyRational(gain, rational(100)), multiplyRational(p, spread)) : gain;
      return { stem, mainRule: t(locale,
        "एक ही मूलधन और समय के लिए शुद्ध लाभ = P × (उधार देने की दर − उधार लेने की दर) × T / 100।",
        "ਇੱਕੋ ਮੂਲਧਨ ਅਤੇ ਸਮੇਂ ਲਈ ਸ਼ੁੱਧ ਲਾਭ = P × (ਕਰਜ਼ ਦੇਣ ਦੀ ਦਰ − ਕਰਜ਼ ਲੈਣ ਦੀ ਦਰ) × T / 100।"), workedSteps: [
        t(locale, `दर का अंतर = ${q(rl)} − ${q(rb)} = ${percent(spread)}।`, `ਦਰ ਦਾ ਅੰਤਰ = ${q(rl)} − ${q(rb)} = ${percent(spread)}।`),
        qlId === "INT-QL-046" ? t(locale, `शुद्ध लाभ = ${money(p)} × ${q(spread)} × ${q(time)} / 100 = ${money(answer)}।`, `ਸ਼ੁੱਧ ਲਾਭ = ${money(p)} × ${q(spread)} × ${q(time)} / 100 = ${money(answer)}।`) : qlId === "INT-QL-047" ? t(locale, `दर-अंतर = ${money(gain)} × 100 / (${money(p)}×${q(time)}) = ${percent(subtractRational(answer, rb))}; अतः उधार देने की दर = ${percent(answer)}।`, `ਦਰ-ਅੰਤਰ = ${money(gain)} × 100 / (${money(p)}×${q(time)}) = ${percent(subtractRational(answer, rb))}; ਇਸ ਲਈ ਕਰਜ਼ ਦੇਣ ਦੀ ਦਰ = ${percent(answer)}।`) : qlId === "INT-QL-048" ? t(locale, `P = ${money(gain)} × 100 / (${q(spread)}×${q(time)}) = ${money(answer)}।`, `P = ${money(gain)} × 100 / (${q(spread)}×${q(time)}) = ${money(answer)}।`) : t(locale, `T = ${money(gain)} × 100 / (${money(p)}×${q(spread)}) = ${years(answer, locale)}।`, `T = ${money(gain)} × 100 / (${money(p)}×${q(spread)}) = ${years(answer, locale)}।`),
      ] };
    }
    case "INT-QL-050":
    case "INT-QL-051":
    case "INT-QL-052": {
      const p = P(), rate = rationalValue(values, "rate");
      if (qlId === "INT-QL-052") {
        const dayCount = rationalValue(values, "days"), i360 = divideRational(multiplyRational(multiplyRational(p, rate), dayCount), rational(100n * 360n)), i365 = divideRational(multiplyRational(multiplyRational(p, rate), dayCount), rational(100n * 365n)), diff = subtractRational(i360, i365);
        return { stem: t(locale,
          `${actor} ${money(p)} को ${percent(rate)} साधारण ब्याज पर ${days(dayCount, locale)} के लिए रखता है। घोषित 360-दिन वर्ष पर ब्याज, घोषित 365-दिन वर्ष से कितना अधिक होगा?`,
          `${actor} ${money(p)} ਨੂੰ ${percent(rate)} ਸਧਾਰਨ ਵਿਆਜ ਉੱਤੇ ${days(dayCount, locale)} ਲਈ ਰੱਖਦਾ ਹੈ। ਦਿੱਤੇ 360-ਦਿਨਾਂ ਵਾਲੇ ਸਾਲ ਦਾ ਵਿਆਜ, ਦਿੱਤੇ 365-ਦਿਨਾਂ ਵਾਲੇ ਸਾਲ ਨਾਲੋਂ ਕਿੰਨਾ ਵੱਧ ਹੋਵੇਗਾ?`), mainRule: t(locale, "दिनों के लिए I = P × R × days / (100 × year-basis)।", "ਦਿਨਾਂ ਲਈ I = P × R × days / (100 × year-basis)।"), workedSteps: [
          t(locale, `360-दिन आधार पर ब्याज = ${money(i360)}।`, `360-ਦਿਨ ਆਧਾਰ ਉੱਤੇ ਵਿਆਜ = ${money(i360)}।`),
          t(locale, `365-दिन आधार पर ब्याज = ${money(i365)}।`, `365-ਦਿਨ ਆਧਾਰ ਉੱਤੇ ਵਿਆਜ = ${money(i365)}।`),
          t(locale, `अंतर = ${money(i360)} − ${money(i365)} = ${money(diff)}।`, `ਅੰਤਰ = ${money(i360)} − ${money(i365)} = ${money(diff)}।`),
        ] };
      }
      if (qlId === "INT-QL-050") {
        const dayCount = rational(numberValue(values, "days")), denominator = rational(numberValue(values, "denominator")), interest = divideRational(multiplyRational(multiplyRational(p, rate), dayCount), multiplyRational(rational(100), denominator));
        return { stem: t(locale,
          `${actor} ${money(p)} को ${percent(rate)} वार्षिक साधारण ब्याज पर ${days(dayCount, locale)} के लिए रखता है। प्रश्न में दिया ${q(denominator)}-दिन का वर्ष मानकर ब्याज ज्ञात कीजिए।`,
          `${actor} ${money(p)} ਨੂੰ ${percent(rate)} ਸਾਲਾਨਾ ਸਧਾਰਨ ਵਿਆਜ ਉੱਤੇ ${days(dayCount, locale)} ਲਈ ਰੱਖਦਾ ਹੈ। ਸਵਾਲ ਵਿੱਚ ਦਿੱਤਾ ${q(denominator)}-ਦਿਨਾਂ ਵਾਲਾ ਸਾਲ ਮੰਨ ਕੇ ਵਿਆਜ ਪਤਾ ਕਰੋ।`), mainRule: t(locale, "दिनों के लिए समय = days / year-basis और I = P × R × T / 100।", "ਦਿਨਾਂ ਲਈ ਸਮਾਂ = days / year-basis ਅਤੇ I = P × R × T / 100।"), workedSteps: [
          t(locale, `समय = ${q(dayCount)}/${q(denominator)} वर्ष।`, `ਸਮਾਂ = ${q(dayCount)}/${q(denominator)} ਸਾਲ।`),
          t(locale, `I = ${money(p)} × ${q(rate)} × ${q(dayCount)} / (100×${q(denominator)})।`, `I = ${money(p)} × ${q(rate)} × ${q(dayCount)} / (100×${q(denominator)})।`),
          t(locale, `ब्याज = ${money(interest)}।`, `ਵਿਆਜ = ${money(interest)}।`),
        ] };
      }
      const interest = rationalValue(values, "interest"), denominator = rationalValue(values, "dayCountDenominator"), dayAnswer = divideRational(multiplyRational(multiplyRational(interest, rational(100)), denominator), multiplyRational(p, rate));
      return { stem: t(locale,
        `${actor} ${money(p)} को ${percent(rate)} साधारण ब्याज पर रखता है। प्रश्न में ${q(denominator)}-दिन का वर्ष दिया है और ब्याज ${money(interest)} है। धन कितने दिनों के लिए रखा गया था?`,
        `${actor} ${money(p)} ਨੂੰ ${percent(rate)} ਸਧਾਰਨ ਵਿਆਜ ਉੱਤੇ ਰੱਖਦਾ ਹੈ। ਸਵਾਲ ਵਿੱਚ ${q(denominator)}-ਦਿਨਾਂ ਵਾਲਾ ਸਾਲ ਦਿੱਤਾ ਹੈ ਅਤੇ ਵਿਆਜ ${money(interest)} ਹੈ। ਰਕਮ ਕਿੰਨੇ ਦਿਨਾਂ ਲਈ ਰੱਖੀ ਗਈ ਸੀ?`), mainRule: t(locale, "I = P × R × days / (100 × year-basis)।", "I = P × R × days / (100 × year-basis)।"), workedSteps: [
        t(locale, `${money(interest)} = ${money(p)} × ${q(rate)} × days / (100×${q(denominator)})।`, `${money(interest)} = ${money(p)} × ${q(rate)} × days / (100×${q(denominator)})।`),
        t(locale, `days = ${money(interest)} × 100 × ${q(denominator)} / (${money(p)}×${q(rate)})।`, `days = ${money(interest)} × 100 × ${q(denominator)} / (${money(p)}×${q(rate)})।`),
        t(locale, `अवधि = ${days(dayAnswer, locale)}।`, `ਮਿਆਦ = ${days(dayAnswer, locale)}।`),
      ] };
    }
  }
}

export function generateIntCp002LocalizedNativeV1(
  qlId: IntCp002FinalQlId,
  seed: string,
  locale: IntCp002NativeLocale,
) {
  const source = generateIntCp002EnglishFrozenQuestion(qlId, seed);
  if (!source.validation.ok) throw new Error(`${qlId}/${seed}: English frozen source validation failed.`);
  const values = localizationValues(source);
  const body = nativeBody(qlId, values, locale, seed);
  const options = Object.freeze(source.optionAudit.map((option) => renderAnswer(source.answerSemantic, option.value, locale)));
  if (new Set(options).size !== 4) throw new Error(`${qlId}/${seed}/${locale}: localized option collision.`);
  const answer = options[source.correctIndex]!;
  const localizedTrapAnalysis = Object.freeze(source.optionAudit
    .map((option, index) => ({ option, index }))
    .filter(({ option }) => option.misconceptionId !== "CORRECT")
    .map(({ option, index }) => Object.freeze({
      optionNumber: index + 1,
      misconceptionId: option.misconceptionId,
      explanation: trapText(locale, option.misconceptionId),
    })));

  const ctx = context(locale, seed);
  return deepFreeze({
    packageId: source.packageId,
    canonicalProblemId: source.canonicalProblemId,
    qlId: source.qlId,
    permanentQlId: source.permanentQlId,
    questionLanguageId: `${source.qlId}:${locale}:${seed}`,
    language: locale === "hi-IN" ? "hi" as const : "pa" as const,
    locale,
    localizationVersion: INT_CP002_LOCALIZED_NATIVE_V1.version,
    localizationStatus: "MULTILINGUAL_REVIEW_CANDIDATE" as const,
    sourceEnglishFreezeId: source.freezeId,
    sourceReleaseCandidateId: source.sourceReleaseCandidateId,
    solveContract: source.solveContract,
    topology: source.topology,
    taskDirection: source.taskDirection,
    answerSemantic: source.answerSemantic,
    difficulty: source.difficulty,
    seed,
    stemFamilyId: `CP002-${source.qlId}-${locale}-FRAME-${ctx.frame}`,
    stem: body.stem,
    options,
    optionAudit: Object.freeze(source.optionAudit.map((option, index) => Object.freeze({
      ...option,
      text: options[index]!,
      explanation: trapText(locale, option.misconceptionId),
    }))),
    correctIndex: source.correctIndex,
    correctAnswer: answer,
    explanation: Object.freeze({
      mainRule: body.mainRule,
      workedSteps: Object.freeze([...body.workedSteps]),
      examShortcut: shortcut(source.topology, locale),
      verification: t(locale,
        "निकले हुए उत्तर को मूल साधारण-ब्याज संबंध में रखने पर प्रश्न की दी हुई कुल राशि, ब्याज या तुलना फिर से सही मिलती है।",
        "ਮਿਲੇ ਉੱਤਰ ਨੂੰ ਮੁੱਢਲੇ ਸਧਾਰਨ-ਵਿਆਜ ਸੰਬੰਧ ਵਿੱਚ ਵਾਪਸ ਰੱਖਣ ਉੱਤੇ ਸਵਾਲ ਦੀ ਦਿੱਤੀ ਕੁੱਲ ਰਕਮ, ਵਿਆਜ ਜਾਂ ਤੁਲਨਾ ਫਿਰ ਠੀਕ ਮਿਲਦੀ ਹੈ।",
      ),
      conclusion: t(locale, `अतः सही उत्तर ${answer} है।`, `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`),
      trapAnalysis: localizedTrapAnalysis,
    }),
    solution: source.solution,
    mathematicalFingerprint: source.mathematicalFingerprint,
    sourceValidation: source.validation,
    internalProvenance: source.internalProvenance,
    reviewStatus: "MULTILINGUAL_REVIEW_CANDIDATE" as const,
    approvalStatus: "NOT_APPROVED" as const,
    learnerContentFrozen: false as const,
    manualApprovalRequired: true as const,
    enabled: false as const,
    stagingStatus: "NOT_STAGED" as const,
    registrationStatus: "NOT_REGISTERED" as const,
    questionStudioDiscoverable: false as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
  });
}
