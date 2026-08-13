import type { AuditCaselet, AuditChild } from "../saturation/corpus.ts";
import type { Sea001TranslatedLocale } from "./readiness.ts";
import {
  SEA001_REVIEW_CANONICAL_NAMES,
  localizedSea001Name,
} from "./name-pack.ts";

export type NativeClueRendering = {
  readonly text: string;
  readonly action: string;
};

const NAME_PATTERN = "([A-Z][a-z]+)";
const ORDINAL_PATTERN = "(\\d+(?:st|nd|rd|th))";
const PUNCT = "।";

function tr(locale: Sea001TranslatedLocale, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : pa;
}

function name(value: string, locale: Sea001TranslatedLocale): string {
  return localizedSea001Name(value, locale);
}

function namesIn(text: string): readonly string[] {
  const escaped = [...SEA001_REVIEW_CANONICAL_NAMES]
    .sort((a, b) => b.length - a.length)
    .map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`\\b(?:${escaped.join("|")})\\b`, "g");
  return [...text.matchAll(re)].map((match) => match[0]!);
}

function joinNative(values: readonly string[], locale: Sea001TranslatedLocale): string {
  const localized = values.map((value) => name(value, locale));
  if (localized.length <= 1) return localized[0] ?? "";
  if (localized.length === 2) return `${localized[0]} ${tr(locale, "और", "ਅਤੇ")} ${localized[1]}`;
  return `${localized.slice(0, -1).join(", ")} ${tr(locale, "और", "ਅਤੇ")} ${localized.at(-1)}`;
}

function ordinalNumber(raw: string): number {
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value) || value < 1 || value > 20) throw new Error(`SEA-001 native renderer: unsupported ordinal ${raw}`);
  return value;
}

export function nativeOrdinal(raw: string, locale: Sea001TranslatedLocale): string {
  const value = ordinalNumber(raw);
  const hi: Record<number, string> = {1:"पहला",2:"दूसरा",3:"तीसरा",4:"चौथा",5:"पाँचवाँ",6:"छठा",7:"सातवाँ",8:"आठवाँ",9:"नौवाँ",10:"दसवाँ"};
  const pa: Record<number, string> = {1:"ਪਹਿਲਾ",2:"ਦੂਜਾ",3:"ਤੀਜਾ",4:"ਚੌਥਾ",5:"ਪੰਜਵਾਂ",6:"ਛੇਵਾਂ",7:"ਸੱਤਵਾਂ",8:"ਅੱਠਵਾਂ",9:"ਨੌਵਾਂ",10:"ਦਸਵਾਂ"};
  return (locale === "hi-IN" ? hi[value] : pa[value]) ?? String(value);
}

function nativeDirection(side: "left" | "right", locale: Sea001TranslatedLocale): string {
  return side === "left" ? tr(locale, "बाईं ओर", "ਖੱਬੇ ਪਾਸੇ") : tr(locale, "दाईं ओर", "ਸੱਜੇ ਪਾਸੇ");
}

function nativeFacing(value: string, locale: Sea001TranslatedLocale): string {
  const map: Record<string, readonly [string, string]> = {
    north: ["उत्तर की ओर", "ਉੱਤਰ ਵੱਲ"],
    south: ["दक्षिण की ओर", "ਦੱਖਣ ਵੱਲ"],
    centre: ["केंद्र की ओर", "ਕੇਂਦਰ ਵੱਲ"],
    outward: ["बाहर की ओर", "ਬਾਹਰ ਵੱਲ"],
  };
  const pair = map[value];
  if (!pair) throw new Error(`SEA-001 native renderer: unsupported facing ${value}`);
  return locale === "hi-IN" ? pair[0] : pair[1];
}

export function renderNativeSetup(canonical: AuditCaselet, locale: Sea001TranslatedLocale): string {
  const people = namesIn(canonical.setupText);
  if (people.length < 4) throw new Error(`${canonical.caseletId}: native setup could not recover participants`);
  const list = joinNative(people, locale);
  switch (canonical.checkpointId) {
    case "SEA-CP-001": {
      const south = /all facing south/i.test(canonical.setupText);
      return south
        ? tr(locale, `${list} एक सीधी पंक्ति में बैठे हैं और सभी दक्षिण की ओर मुख किए हैं।`, `${list} ਇੱਕ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਬੈਠੇ ਹਨ ਅਤੇ ਸਭ ਦੱਖਣ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ।`)
        : tr(locale, `${list} एक सीधी पंक्ति में बैठे हैं और सभी उत्तर की ओर मुख किए हैं।`, `${list} ਇੱਕ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਬੈਠੇ ਹਨ ਅਤੇ ਸਭ ਉੱਤਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ।`);
    }
    case "SEA-CP-002":
      return tr(locale, `${list} एक सीधी पंक्ति में बैठे हैं। कुछ उत्तर की ओर और बाकी दक्षिण की ओर मुख किए हैं। उनका क्रम पहले से तय नहीं है।`, `${list} ਇੱਕ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਬੈਠੇ ਹਨ। ਕੁਝ ਉੱਤਰ ਵੱਲ ਅਤੇ ਬਾਕੀ ਦੱਖਣ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ। ਉਨ੍ਹਾਂ ਦਾ ਕ੍ਰਮ ਪਹਿਲਾਂ ਤੋਂ ਤੈਅ ਨਹੀਂ ਹੈ।`);
    case "SEA-CP-003":
      return tr(locale, `${list} एक गोल मेज के चारों ओर केंद्र की ओर मुख करके बैठे हैं। उनका क्रम पहले से तय नहीं है।`, `${list} ਗੋਲ ਮੇਜ਼ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਕੇਂਦਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ। ਉਨ੍ਹਾਂ ਦਾ ਕ੍ਰਮ ਪਹਿਲਾਂ ਤੋਂ ਤੈਅ ਨਹੀਂ ਹੈ।`);
    case "SEA-CP-004":
      return tr(locale, `${list} एक गोल मेज के चारों ओर बाहर की ओर मुख करके बैठे हैं। उनका क्रम पहले से तय नहीं है।`, `${list} ਗੋਲ ਮੇਜ਼ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ। ਉਨ੍ਹਾਂ ਦਾ ਕ੍ਰਮ ਪਹਿਲਾਂ ਤੋਂ ਤੈਅ ਨਹੀਂ ਹੈ।`);
    case "SEA-CP-005":
      return tr(locale, `${list} एक गोल मेज के चारों ओर बैठे हैं। कुछ केंद्र की ओर और बाकी बाहर की ओर मुख किए हैं। उनका क्रम पहले से तय नहीं है।`, `${list} ਗੋਲ ਮੇਜ਼ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਬੈਠੇ ਹਨ। ਕੁਝ ਕੇਂਦਰ ਵੱਲ ਅਤੇ ਬਾਕੀ ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ। ਉਨ੍ਹਾਂ ਦਾ ਕ੍ਰਮ ਪਹਿਲਾਂ ਤੋਂ ਤੈਅ ਨਹੀਂ ਹੈ।`);
  }
}

function immediateLinear(target: string, side: "left" | "right", ref: string, locale: Sea001TranslatedLocale): NativeClueRendering {
  const t = name(target, locale); const r = name(ref, locale); const dir = nativeDirection(side, locale);
  return {
    text: tr(locale, `${t}, ${r} के ठीक ${dir} बैठा है।`, `${t}, ${r} ਦੇ ਬਿਲਕੁਲ ${dir} ਬੈਠਾ ਹੈ।`),
    action: tr(locale, `${r} को रखें और उसके ठीक ${dir} ${t} को बैठाएँ।`, `${r} ਨੂੰ ਰੱਖੋ ਅਤੇ ਉਸਦੇ ਬਿਲਕੁਲ ${dir} ${t} ਨੂੰ ਬਿਠਾਓ।`),
  };
}

function nthLinear(target: string, rawOrdinal: string, side: "left" | "right", ref: string, locale: Sea001TranslatedLocale): NativeClueRendering {
  const t = name(target, locale); const r = name(ref, locale); const dir = nativeDirection(side, locale); const ord = nativeOrdinal(rawOrdinal, locale); const n = ordinalNumber(rawOrdinal);
  return {
    text: tr(locale, `${t}, ${r} के ${dir} ${ord} स्थान पर बैठा है।`, `${t}, ${r} ਦੇ ${dir} ${ord} ਸਥਾਨ 'ਤੇ ਬੈਠਾ ਹੈ।`),
    action: tr(locale, `${r} से ${dir} ${n} सीट गिनें और ${t} को वहाँ रखें।`, `${r} ਤੋਂ ${dir} ${n} ਸੀਟਾਂ ਗਿਣੋ ਅਤੇ ${t} ਨੂੰ ਉੱਥੇ ਰੱਖੋ।`),
  };
}

export function renderNativeClue(clue: string, locale: Sea001TranslatedLocale): NativeClueRendering {
  let m: RegExpMatchArray | null;

  m = clue.match(new RegExp(`^${NAME_PATTERN} sits immediately to the (left|right) of ${NAME_PATTERN}\\.$`));
  if (m) return immediateLinear(m[1]!, m[2]! as "left" | "right", m[3]!, locale);

  m = clue.match(new RegExp(`^${NAME_PATTERN} sits ${ORDINAL_PATTERN} to the (left|right) of ${NAME_PATTERN}\\.$`));
  if (m) return nthLinear(m[1]!, m[2]!, m[3]! as "left" | "right", m[4]!, locale);

  m = clue.match(new RegExp(`^${NAME_PATTERN} sits immediately clockwise from ${NAME_PATTERN}\\.$`));
  if (m) {
    const t=name(m[1]!,locale), r=name(m[2]!,locale);
    return {text:tr(locale,`${t}, ${r} से ठीक अगली घड़ी की दिशा वाली सीट पर बैठा है।`,`${t}, ${r} ਤੋਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਬਿਲਕੁਲ ਅਗਲੀ ਸੀਟ 'ਤੇ ਬੈਠਾ ਹੈ।`),action:tr(locale,`${r} से घड़ी की दिशा में अगली सीट पर ${t} को रखें।`,`${r} ਤੋਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਅਗਲੀ ਸੀਟ 'ਤੇ ${t} ਨੂੰ ਰੱਖੋ।`)};
  }

  m = clue.match(new RegExp(`^${NAME_PATTERN} sits ${ORDINAL_PATTERN} clockwise from ${NAME_PATTERN}\\.$`));
  if (m) {
    const t=name(m[1]!,locale), r=name(m[3]!,locale), n=ordinalNumber(m[2]!);
    return {text:tr(locale,`${t}, ${r} से घड़ी की दिशा में ${nativeOrdinal(m[2]!,locale)} स्थान पर बैठा है।`,`${t}, ${r} ਤੋਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ${nativeOrdinal(m[2]!,locale)} ਸਥਾਨ 'ਤੇ ਬੈਠਾ ਹੈ।`),action:tr(locale,`${r} से घड़ी की दिशा में ${n} सीट गिनें और ${t} को वहाँ रखें।`,`${r} ਤੋਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ${n} ਸੀਟਾਂ ਗਿਣੋ ਅਤੇ ${t} ਨੂੰ ਉੱਥੇ ਰੱਖੋ।`)};
  }

  m = clue.match(new RegExp(`^${NAME_PATTERN} faces (north|south|centre|outward)\\.$`));
  if (m) {
    const p=name(m[1]!,locale), f=nativeFacing(m[2]!,locale);
    return {text:tr(locale,`${p} ${f} मुख किए है।`,`${p} ${f} ਮੂੰਹ ਕਰਕੇ ਬੈਠਾ ਹੈ।`),action:tr(locale,`${p} की मुख-दिशा ${f} चिन्हित कर दें।`,`${p} ਦੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ${f} ਨਿਸ਼ਾਨ ਲਗਾ ਦਿਓ।`)};
  }

  m = clue.match(new RegExp(`^${NAME_PATTERN} sits at one of the extreme ends\\.$`));
  if (m) {
    const p=name(m[1]!,locale);
    return {text:tr(locale,`${p} पंक्ति के किसी एक अंतिम छोर पर बैठा है।`,`${p} ਕਤਾਰ ਦੇ ਕਿਸੇ ਇੱਕ ਅੰਤਲੇ ਸਿਰੇ 'ਤੇ ਬੈਠਾ ਹੈ।`),action:tr(locale,`${p} के लिए दोनों अंतिम छोर संभव रखें; अगला संबंधित संकेत सही छोर तय करेगा।`,`${p} ਲਈ ਦੋਵੇਂ ਅੰਤਲੇ ਸਿਰੇ ਸੰਭਵ ਰੱਖੋ; ਅਗਲਾ ਸੰਬੰਧਿਤ ਸੰਕੇਤ ਸਹੀ ਸਿਰਾ ਤੈਅ ਕਰੇਗਾ।`)};
  }

  m = clue.match(new RegExp(`^${NAME_PATTERN} sits at the (extreme left|left|right) end\\.$`));
  if (m) {
    const p=name(m[1]!,locale), left=m[2]!=="right";
    return {text:left?tr(locale,`${p} पंक्ति के बाएँ छोर पर बैठा है।`,`${p} ਕਤਾਰ ਦੇ ਖੱਬੇ ਸਿਰੇ 'ਤੇ ਬੈਠਾ ਹੈ।`):tr(locale,`${p} पंक्ति के दाएँ छोर पर बैठा है।`,`${p} ਕਤਾਰ ਦੇ ਸੱਜੇ ਸਿਰੇ 'ਤੇ ਬੈਠਾ ਹੈ।`),action:left?tr(locale,`${p} को सबसे बाईं सीट पर रखें।`,`${p} ਨੂੰ ਸਭ ਤੋਂ ਖੱਬੀ ਸੀਟ 'ਤੇ ਰੱਖੋ।`):tr(locale,`${p} को सबसे दाईं सीट पर रखें।`,`${p} ਨੂੰ ਸਭ ਤੋਂ ਸੱਜੀ ਸੀਟ 'ਤੇ ਰੱਖੋ।`)};
  }

  m = clue.match(new RegExp(`^${NAME_PATTERN} sits ${ORDINAL_PATTERN} from the left end\\.$`));
  if (m) {
    const p=name(m[1]!,locale), n=ordinalNumber(m[2]!);
    return {text:tr(locale,`${p} बाएँ छोर से ${nativeOrdinal(m[2]!,locale)} स्थान पर बैठा है।`,`${p} ਖੱਬੇ ਸਿਰੇ ਤੋਂ ${nativeOrdinal(m[2]!,locale)} ਸਥਾਨ 'ਤੇ ਬੈਠਾ ਹੈ।`),action:tr(locale,`बाएँ छोर से ${n}वीं सीट पर ${p} को रखें।`,`ਖੱਬੇ ਸਿਰੇ ਤੋਂ ${n}ਵੀਂ ਸੀਟ 'ਤੇ ${p} ਨੂੰ ਰੱਖੋ।`)};
  }

  m = clue.match(new RegExp(`^${NAME_PATTERN} sits in a middle seat\\.$`));
  if (m) {
    const p=name(m[1]!,locale);
    return {text:tr(locale,`${p} बीच की सीटों में से किसी एक पर बैठा है।`,`${p} ਵਿਚਕਾਰਲੀਆਂ ਸੀਟਾਂ ਵਿੱਚੋਂ ਕਿਸੇ ਇੱਕ 'ਤੇ ਬੈਠਾ ਹੈ।`),action:tr(locale,`${p} को केवल बीच की संभावित सीटों में रखें; बाकी संकेत सही सीट तय करेंगे।`,`${p} ਨੂੰ ਸਿਰਫ਼ ਵਿਚਕਾਰਲੀਆਂ ਸੰਭਵ ਸੀਟਾਂ ਵਿੱਚ ਰੱਖੋ; ਬਾਕੀ ਸੰਕੇਤ ਸਹੀ ਸੀਟ ਤੈਅ ਕਰਨਗੇ।`)};
  }

  m = clue.match(new RegExp(`^${NAME_PATTERN} (sits next to|sits adjacent to) ${NAME_PATTERN}\\.$`));
  if (m) {
    const a=name(m[1]!,locale), b=name(m[3]!,locale);
    return {text:tr(locale,`${a} और ${b} पास-पास बैठे हैं।`,`${a} ਅਤੇ ${b} ਨਾਲ-ਨਾਲ ਬੈਠੇ ਹਨ।`),action:tr(locale,`${a} और ${b} को साथ वाली सीटों पर रखें।`,`${a} ਅਤੇ ${b} ਨੂੰ ਨਾਲ ਵਾਲੀਆਂ ਸੀਟਾਂ 'ਤੇ ਰੱਖੋ।`)};
  }

  m = clue.match(new RegExp(`^${NAME_PATTERN} (does not sit next to|does not sit adjacent to) ${NAME_PATTERN}\\.$`));
  if (m) {
    const a=name(m[1]!,locale), b=name(m[3]!,locale);
    return {text:tr(locale,`${a} और ${b} पास-पास नहीं बैठे हैं।`,`${a} ਅਤੇ ${b} ਨਾਲ-ਨਾਲ ਨਹੀਂ ਬੈਠੇ ਹਨ।`),action:tr(locale,`${a} और ${b} को साथ वाली सीटों पर न रखें; ऐसी संभावना काट दें।`,`${a} ਅਤੇ ${b} ਨੂੰ ਨਾਲ ਵਾਲੀਆਂ ਸੀਟਾਂ 'ਤੇ ਨਾ ਰੱਖੋ; ਅਜਿਹੀ ਸੰਭਾਵਨਾ ਰੱਦ ਕਰੋ।`)};
  }

  m = clue.match(new RegExp(`^${NAME_PATTERN} sits opposite ${NAME_PATTERN}\\.$`));
  if (m) {
    const a=name(m[1]!,locale), b=name(m[2]!,locale);
    return {text:tr(locale,`${a}, ${b} के ठीक सामने बैठा है।`,`${a}, ${b} ਦੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ ਬੈਠਾ ਹੈ।`),action:tr(locale,`${b} के सामने वाली सीट पर ${a} को रखें।`,`${b} ਦੇ ਸਾਹਮਣੇ ਵਾਲੀ ਸੀਟ 'ਤੇ ${a} ਨੂੰ ਰੱਖੋ।`)};
  }

  m = clue.match(new RegExp(`^Exactly (\\d+) persons? sit between ${NAME_PATTERN} and ${NAME_PATTERN}\\.$`));
  if (m) {
    const n=Number(m[1]), a=name(m[2]!,locale), b=name(m[3]!,locale);
    return {text:tr(locale,`${a} और ${b} के बीच ठीक ${n} व्यक्ति बैठे हैं।`,`${a} ਅਤੇ ${b} ਦੇ ਵਿਚਕਾਰ ਠੀਕ ${n} ਵਿਅਕਤੀ ਬੈਠੇ ਹਨ।`),action:tr(locale,`${n} व्यक्ति बीच में होने का अर्थ है कि ${a} और ${b} की सीटों में ${n+1} स्थान का अंतर होगा।`,`${n} ਵਿਅਕਤੀ ਵਿਚਕਾਰ ਹੋਣ ਦਾ ਅਰਥ ਹੈ ਕਿ ${a} ਅਤੇ ${b} ਦੀਆਂ ਸੀਟਾਂ ਵਿੱਚ ${n+1} ਸਥਾਨਾਂ ਦਾ ਫਰਕ ਹੋਵੇਗਾ।`)};
  }

  m = clue.match(new RegExp(`^Exactly (\\d+) person sits between ${NAME_PATTERN} and ${NAME_PATTERN} when counted clockwise from ${NAME_PATTERN}\\.$`));
  if (m) {
    const n=Number(m[1]), a=name(m[2]!,locale), b=name(m[3]!,locale), from=name(m[4]!,locale);
    return {text:tr(locale,`${from} से घड़ी की दिशा में गिनने पर ${a} और ${b} के बीच ठीक ${n} व्यक्ति बैठा है।`,`${from} ਤੋਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਗਿਣਣ 'ਤੇ ${a} ਅਤੇ ${b} ਦੇ ਵਿਚਕਾਰ ਠੀਕ ${n} ਵਿਅਕਤੀ ਬੈਠਾ ਹੈ।`),action:tr(locale,`${from} से घड़ी की दिशा में ${n+1} सीट आगे बढ़ें; दूसरी दी गई व्यक्ति की सीट वहाँ होगी।`,`${from} ਤੋਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ${n+1} ਸੀਟਾਂ ਅੱਗੇ ਵਧੋ; ਦੂਜੇ ਦਿੱਤੇ ਵਿਅਕਤੀ ਦੀ ਸੀਟ ਉੱਥੇ ਹੋਵੇਗੀ।`)};
  }

  m = clue.match(new RegExp(`^${NAME_PATTERN} sits at the seat nearest the (door|entrance|stage)\\.$`));
  if (m) {
    const p=name(m[1]!,locale); const landmark=m[2]==="door"?tr(locale,"दरवाज़े","ਦਰਵਾਜ਼ੇ"):m[2]==="entrance"?tr(locale,"प्रवेश-द्वार","ਪ੍ਰਵੇਸ਼-ਦੁਆਰ"):tr(locale,"मंच","ਮੰਚ");
    return {text:tr(locale,`${p} ${landmark} के सबसे पास वाली सीट पर बैठा है।`,`${p} ${landmark} ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਵਾਲੀ ਸੀਟ 'ਤੇ ਬੈਠਾ ਹੈ।`),action:tr(locale,`${landmark} के पास वाली तय सीट पर ${p} को रखें; अब गोल व्यवस्था का घुमाव भी तय हो जाता है।`,`${landmark} ਦੇ ਨੇੜੇ ਵਾਲੀ ਤੈਅ ਸੀਟ 'ਤੇ ${p} ਨੂੰ ਰੱਖੋ; ਹੁਣ ਗੋਲ ਵਿਵਸਥਾ ਦਾ ਘੁੰਮਾਵ ਵੀ ਤੈਅ ਹੋ ਜਾਂਦਾ ਹੈ।`)};
  }

  m = clue.match(/^(.+?) face the centre; (.+?) face outward\.$/);
  if (m) {
    const centre=namesIn(m[1]!), outward=namesIn(m[2]!);
    if (centre.length && outward.length) {
      const c=joinNative(centre,locale), o=joinNative(outward,locale);
      return {text:tr(locale,`${c} केंद्र की ओर और ${o} बाहर की ओर मुख किए हैं।`,`${c} ਕੇਂਦਰ ਵੱਲ ਅਤੇ ${o} ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ।`),action:tr(locale,`${c} के लिए केंद्र की ओर और ${o} के लिए बाहर की ओर मुख-दिशा चिन्हित करें।`,`${c} ਲਈ ਕੇਂਦਰ ਵੱਲ ਅਤੇ ${o} ਲਈ ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਨਿਸ਼ਾਨ ਲਗਾਓ।`)};
    }
  }

  m = clue.match(new RegExp(`^If ${NAME_PATTERN} faces (centre|outward), ${NAME_PATTERN} faces (centre|outward); otherwise, ${NAME_PATTERN} faces (centre|outward)\\.$`));
  if (m) {
    const a=name(m[1]!,locale), af=nativeFacing(m[2]!,locale), b=name(m[3]!,locale), bf=nativeFacing(m[4]!,locale), b2=name(m[5]!,locale), elseF=nativeFacing(m[6]!,locale);
    if (b!==b2) throw new Error(`SEA-001 native renderer: conditional facing subject mismatch: ${clue}`);
    return {text:tr(locale,`यदि ${a} ${af} मुख किए है, तो ${b} ${bf} मुख करेगा; अन्यथा ${b} ${elseF} मुख करेगा।`,`ਜੇ ${a} ${af} ਮੂੰਹ ਕਰਕੇ ਬੈਠਾ ਹੈ, ਤਾਂ ${b} ${bf} ਮੂੰਹ ਕਰੇਗਾ; ਨਹੀਂ ਤਾਂ ${b} ${elseF} ਮੂੰਹ ਕਰੇਗਾ।`),action:tr(locale,`${a} की मुख-दिशा तय होते ही इस शर्त से ${b} की मुख-दिशा तय कर दें।`,`${a} ਦੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਤੈਅ ਹੁੰਦੇ ਹੀ ਇਸ ਸ਼ਰਤ ਨਾਲ ${b} ਦੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਤੈਅ ਕਰੋ।`)};
  }

  throw new Error(`SEA-001 native renderer: unsupported clue form: ${clue}`);
}

export function nativeDirectionRule(canonical: AuditCaselet, locale: Sea001TranslatedLocale): string {
  switch (canonical.checkpointId) {
    case "SEA-CP-001":
      return /all facing south/i.test(canonical.setupText)
        ? tr(locale,"सभी दक्षिण की ओर मुख किए हैं। इसलिए व्यक्ति का बायाँ पृष्ठ की दाईं ओर और दायाँ पृष्ठ की बाईं ओर होगा।","ਸਭ ਦੱਖਣ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ। ਇਸ ਲਈ ਵਿਅਕਤੀ ਦਾ ਖੱਬਾ ਸਫ਼ੇ ਦੇ ਸੱਜੇ ਪਾਸੇ ਅਤੇ ਸੱਜਾ ਸਫ਼ੇ ਦੇ ਖੱਬੇ ਪਾਸੇ ਹੋਵੇਗਾ।")
        : tr(locale,"सभी उत्तर की ओर मुख किए हैं। इसलिए बायाँ और दायाँ पृष्ठ पर दिखने वाली दिशा के अनुसार ही पढ़ें।","ਸਭ ਉੱਤਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ। ਇਸ ਲਈ ਖੱਬਾ ਅਤੇ ਸੱਜਾ ਸਫ਼ੇ 'ਤੇ ਦਿਖ ਰਹੀ ਦਿਸ਼ਾ ਅਨੁਸਾਰ ਹੀ ਪੜ੍ਹੋ।");
    case "SEA-CP-002":
      return tr(locale,"हर बाएँ/दाएँ वाले संकेत में पहले संदर्भ व्यक्ति की मुख-दिशा देखें। उत्तर की ओर मुख करने पर सामान्य बायाँ/दायाँ लें; दक्षिण की ओर मुख करने पर दिशा उलट जाएगी।","ਹਰ ਖੱਬੇ/ਸੱਜੇ ਵਾਲੇ ਸੰਕੇਤ ਵਿੱਚ ਪਹਿਲਾਂ ਹਵਾਲਾ ਦਿੱਤੇ ਵਿਅਕਤੀ ਦੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਵੇਖੋ। ਉੱਤਰ ਵੱਲ ਮੂੰਹ ਹੋਵੇ ਤਾਂ ਆਮ ਖੱਬਾ/ਸੱਜਾ ਲਵੋ; ਦੱਖਣ ਵੱਲ ਮੂੰਹ ਹੋਵੇ ਤਾਂ ਦਿਸ਼ਾ ਉਲਟ ਜਾਵੇਗੀ।");
    case "SEA-CP-003":
      return tr(locale,"सभी केंद्र की ओर मुख किए हैं। इसलिए बायाँ = घड़ी की दिशा और दायाँ = घड़ी की विपरीत दिशा।","ਸਭ ਕੇਂਦਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ। ਇਸ ਲਈ ਖੱਬਾ = ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਅਤੇ ਸੱਜਾ = ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ।");
    case "SEA-CP-004":
      return tr(locale,"सभी बाहर की ओर मुख किए हैं। इसलिए बायाँ = घड़ी की विपरीत दिशा और दायाँ = घड़ी की दिशा।","ਸਭ ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ। ਇਸ ਲਈ ਖੱਬਾ = ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਅਤੇ ਸੱਜਾ = ਘੜੀ ਦੀ ਦਿਸ਼ਾ।");
    case "SEA-CP-005":
      return tr(locale,"केंद्र की ओर मुख करने वाले व्यक्ति के लिए बायाँ घड़ी की दिशा और दायाँ घड़ी की विपरीत दिशा है। बाहर की ओर मुख करने वाले व्यक्ति के लिए यह उलटा होगा।","ਕੇਂਦਰ ਵੱਲ ਮੂੰਹ ਕਰਦੇ ਵਿਅਕਤੀ ਲਈ ਖੱਬਾ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਅਤੇ ਸੱਜਾ ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਹੈ। ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕਰਦੇ ਵਿਅਕਤੀ ਲਈ ਇਹ ਉਲਟ ਹੋਵੇਗਾ।");
  }
}

function nativeQuestionName(raw: string, locale: Sea001TranslatedLocale): string { return name(raw,locale); }

export function renderNativeQuestion(child: AuditChild, locale: Sea001TranslatedLocale): string {
  const q=child.text; let m:RegExpMatchArray|null;
  m=q.match(new RegExp(`^Who sits ${ORDINAL_PATTERN} to the (left|right) of ${NAME_PATTERN}\\?$`));
  if(m) return tr(locale,`${nativeQuestionName(m[3]!,locale)} के ${nativeDirection(m[2]! as "left"|"right",locale)} ${nativeOrdinal(m[1]!,locale)} स्थान पर कौन बैठा है?`,`${nativeQuestionName(m[3]!,locale)} ਦੇ ${nativeDirection(m[2]! as "left"|"right",locale)} ${nativeOrdinal(m[1]!,locale)} ਸਥਾਨ 'ਤੇ ਕੌਣ ਬੈਠਾ ਹੈ?`);
  m=q.match(new RegExp(`^Who sits immediately to the right of ${NAME_PATTERN}\\?$`));
  if(m) return tr(locale,`${name(m[1]!,locale)} के ठीक दाईं ओर कौन बैठा है?`,`${name(m[1]!,locale)} ਦੇ ਬਿਲਕੁਲ ਸੱਜੇ ਪਾਸੇ ਕੌਣ ਬੈਠਾ ਹੈ?`);
  m=q.match(new RegExp(`^Who are the immediate neighbours of ${NAME_PATTERN}\\?$`));
  if(m) return tr(locale,`${name(m[1]!,locale)} के दोनों ठीक पड़ोसी कौन हैं?`,`${name(m[1]!,locale)} ਦੇ ਦੋਵੇਂ ਬਿਲਕੁਲ ਨਾਲ ਬੈਠੇ ਵਿਅਕਤੀ ਕੌਣ ਹਨ?`);
  m=q.match(new RegExp(`^How many persons sit between ${NAME_PATTERN} and ${NAME_PATTERN} when counted clockwise from ${NAME_PATTERN}\\?$`));
  if(m) return tr(locale,`${name(m[3]!,locale)} से घड़ी की दिशा में गिनने पर ${name(m[1]!,locale)} और ${name(m[2]!,locale)} के बीच कितने व्यक्ति बैठे हैं?`,`${name(m[3]!,locale)} ਤੋਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਗਿਣਣ 'ਤੇ ${name(m[1]!,locale)} ਅਤੇ ${name(m[2]!,locale)} ਦੇ ਵਿਚਕਾਰ ਕਿੰਨੇ ਵਿਅਕਤੀ ਬੈਠੇ ਹਨ?`);
  m=q.match(new RegExp(`^How many persons sit between ${NAME_PATTERN} and ${NAME_PATTERN}\\?$`));
  if(m) return tr(locale,`${name(m[1]!,locale)} और ${name(m[2]!,locale)} के बीच कितने व्यक्ति बैठे हैं?`,`${name(m[1]!,locale)} ਅਤੇ ${name(m[2]!,locale)} ਦੇ ਵਿਚਕਾਰ ਕਿੰਨੇ ਵਿਅਕਤੀ ਬੈਠੇ ਹਨ?`);
  m=q.match(new RegExp(`^Who sits opposite ${NAME_PATTERN}\\?$`));
  if(m) return tr(locale,`${name(m[1]!,locale)} के ठीक सामने कौन बैठा है?`,`${name(m[1]!,locale)} ਦੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ ਕੌਣ ਬੈਠਾ ਹੈ?`);
  if(q==="Who sits at the left end of the row?") return tr(locale,"पंक्ति के बाएँ छोर पर कौन बैठा है?","ਕਤਾਰ ਦੇ ਖੱਬੇ ਸਿਰੇ 'ਤੇ ਕੌਣ ਬੈਠਾ ਹੈ?");
  m=q.match(new RegExp(`^Who sits ${ORDINAL_PATTERN} clockwise from ${NAME_PATTERN}\\?$`));
  if(m) return tr(locale,`${name(m[2]!,locale)} से घड़ी की दिशा में ${nativeOrdinal(m[1]!,locale)} स्थान पर कौन बैठा है?`,`${name(m[2]!,locale)} ਤੋਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ${nativeOrdinal(m[1]!,locale)} ਸਥਾਨ 'ਤੇ ਕੌਣ ਬੈਠਾ ਹੈ?`);
  m=q.match(new RegExp(`^What is the position of ${NAME_PATTERN} from the left end\\?$`));
  if(m) return tr(locale,`${name(m[1]!,locale)} बाएँ छोर से किस स्थान पर बैठा है?`,`${name(m[1]!,locale)} ਖੱਬੇ ਸਿਰੇ ਤੋਂ ਕਿਹੜੇ ਸਥਾਨ 'ਤੇ ਬੈਠਾ ਹੈ?`);
  m=q.match(new RegExp(`^What is the position of ${NAME_PATTERN} with respect to ${NAME_PATTERN}\\?$`));
  if(m) return tr(locale,`${name(m[1]!,locale)}, ${name(m[2]!,locale)} के संबंध में किस स्थान पर है?`,`${name(m[1]!,locale)}, ${name(m[2]!,locale)} ਦੇ ਸਬੰਧ ਵਿੱਚ ਕਿਹੜੇ ਸਥਾਨ 'ਤੇ ਹੈ?`);
  if(q==="Which of the following statements is true?") return tr(locale,"निम्नलिखित में से कौन-सा कथन सही है?","ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਸਹੀ ਹੈ?");
  if(q==="Which of the following statements is false?") return tr(locale,"निम्नलिखित में से कौन-सा कथन गलत है?","ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਗਲਤ ਹੈ?");
  if(q==="Which of the following pairs is different from the other three with respect to their seating relation?") return tr(locale,"बैठने के संबंध के आधार पर निम्नलिखित में से कौन-सी जोड़ी बाकी तीन से अलग है?","ਬੈਠਣ ਦੇ ਸਬੰਧ ਦੇ ਆਧਾਰ 'ਤੇ ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਜੋੜਾ ਬਾਕੀ ਤਿੰਨ ਤੋਂ ਵੱਖਰਾ ਹੈ?");
  m=q.match(new RegExp(`^Which sequence lists the next three persons clockwise from ${NAME_PATTERN}\\?$`));
  if(m) return tr(locale,`${name(m[1]!,locale)} के बाद घड़ी की दिशा में आने वाले अगले तीन व्यक्तियों का सही क्रम कौन-सा है?`,`${name(m[1]!,locale)} ਤੋਂ ਬਾਅਦ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਅਗਲੇ ਤਿੰਨ ਵਿਅਕਤੀਆਂ ਦਾ ਸਹੀ ਕ੍ਰਮ ਕਿਹੜਾ ਹੈ?`);
  m=q.match(/^Which of the following shows the (\w+) three persons from the left end in the correct order\?$/);
  if(m) return tr(locale,`बाएँ छोर से पहले तीन व्यक्तियों का सही क्रम कौन-सा है?`,`ਖੱਬੇ ਸਿਰੇ ਤੋਂ ਪਹਿਲੇ ਤਿੰਨ ਵਿਅਕਤੀਆਂ ਦਾ ਸਹੀ ਕ੍ਰਮ ਕਿਹੜਾ ਹੈ?`);
  m=q.match(new RegExp(`^If ${NAME_PATTERN} and ${NAME_PATTERN} exchange their seats, who will sit at the left end\\?$`));
  if(m) return tr(locale,`यदि ${name(m[1]!,locale)} और ${name(m[2]!,locale)} अपनी सीटें आपस में बदल लें, तो बाएँ छोर पर कौन बैठेगा?`,`ਜੇ ${name(m[1]!,locale)} ਅਤੇ ${name(m[2]!,locale)} ਆਪਣੀਆਂ ਸੀਟਾਂ ਆਪਸ ਵਿੱਚ ਬਦਲ ਲੈਣ, ਤਾਂ ਖੱਬੇ ਸਿਰੇ 'ਤੇ ਕੌਣ ਬੈਠੇਗਾ?`);
  m=q.match(new RegExp(`^If everyone changes their facing direction, who will sit ${ORDINAL_PATTERN} to the left of ${NAME_PATTERN}\\?$`));
  if(m) return tr(locale,`यदि सभी अपनी मुख-दिशा बदल लें, तो ${name(m[2]!,locale)} के बाईं ओर ${nativeOrdinal(m[1]!,locale)} स्थान पर कौन बैठेगा?`,`ਜੇ ਸਭ ਆਪਣੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਬਦਲ ਲੈਣ, ਤਾਂ ${name(m[2]!,locale)} ਦੇ ਖੱਬੇ ਪਾਸੇ ${nativeOrdinal(m[1]!,locale)} ਸਥਾਨ 'ਤੇ ਕੌਣ ਬੈਠੇਗਾ?`);
  throw new Error(`SEA-001 native renderer: unsupported question form: ${q}`);
}

export function nativeNamesIn(text: string): readonly string[] { return namesIn(text); }
export function nativeJoinNames(values: readonly string[], locale: Sea001TranslatedLocale): string { return joinNative(values,locale); }
export function nativeTerm(locale: Sea001TranslatedLocale, hi: string, pa: string): string { return tr(locale,hi,pa); }
