import {
  add,
  brokenAmountForState,
  completeAmountForState,
  completeAmountFromNominal,
  div,
  effectiveAnnualRate,
  mixedAmountForState,
  mul,
  periodicAmountForState,
  periodicRate,
  pow,
  rat,
  sub,
  type Cp004Frequency,
  type Cp004MathematicalState,
  type Rational,
} from "./cp004-frequency-math";
import { decimal, moneyText, percentText } from "./cp004-frequency-options";
import {
  generateIntCp004EnglishFrozenV2Question,
  type IntCp004EnglishFrozenV2Question,
} from "./cp004-english-frozen-runtime-v2";
import type {
  IntCp004V6Locale,
  IntCp004V6LocalizedExplanation,
  IntCp004V6LocalizedLifecycle,
  IntCp004V6LocalizedOption,
  IntCp004V6LocalizedQuestion,
} from "./cp004-localization-v6-types";

export const INT_CP004_HI_PA_V6_MIGRATION_VERSION = "INT-CP-004-HI-PA-V6-MIGRATION-v1" as const;
export const INT_CP004_V6_LOCALIZED_LOCALES = Object.freeze(["hi-IN", "pa-IN"] as const);

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  }
  return Object.freeze(value);
}

function plain(value: Rational): string {
  if (value.denominator === 1n) return value.numerator.toString();
  return decimal(value, 2).replace(/\.00$/u, "").replace(/(\.\d)0$/u, "$1");
}

function isHindi(locale: IntCp004V6Locale): boolean {
  return locale === "hi-IN";
}

function frequencyLabel(locale: IntCp004V6Locale, frequency: Cp004Frequency): string {
  if (isHindi(locale)) {
    if (frequency === 1) return "वार्षिक";
    if (frequency === 2) return "छमाही";
    if (frequency === 4) return "तिमाही";
    return "मासिक";
  }
  if (frequency === 1) return "ਸਾਲਾਨਾ";
  if (frequency === 2) return "ਛਿਮਾਹੀ";
  if (frequency === 4) return "ਤਿਮਾਹੀ";
  return "ਮਹੀਨਾਵਾਰ";
}

function frequencyInterval(locale: IntCp004V6Locale, frequency: Cp004Frequency): string {
  if (isHindi(locale)) {
    if (frequency === 1) return "हर वर्ष";
    if (frequency === 2) return "हर छह महीने";
    if (frequency === 4) return "हर तीन महीने";
    return "हर महीने";
  }
  if (frequency === 1) return "ਹਰ ਸਾਲ";
  if (frequency === 2) return "ਹਰ ਛੇ ਮਹੀਨੇ";
  if (frequency === 4) return "ਹਰ ਤਿੰਨ ਮਹੀਨੇ";
  return "ਹਰ ਮਹੀਨੇ";
}

function frequencyOption(locale: IntCp004V6Locale, frequency: Cp004Frequency): string {
  if (isHindi(locale)) return frequencyLabel(locale, frequency);
  return frequencyLabel(locale, frequency);
}

function yearsText(locale: IntCp004V6Locale, years: number): string {
  if (isHindi(locale)) return `${years} वर्ष`;
  return `${years} ਸਾਲ`;
}

function monthsText(locale: IntCp004V6Locale, months: number): string {
  if (isHindi(locale)) return months === 1 ? "1 महीना" : `${months} महीने`;
  return months === 1 ? "1 ਮਹੀਨਾ" : `${months} ਮਹੀਨੇ`;
}

function yearsMonthsText(locale: IntCp004V6Locale, years: number, months: number): string {
  return isHindi(locale)
    ? `${yearsText(locale, years)} और ${monthsText(locale, months)}`
    : `${yearsText(locale, years)} ਅਤੇ ${monthsText(locale, months)}`;
}

function durationFromPeriods(locale: IntCp004V6Locale, periods: number, frequency: Cp004Frequency): string {
  const months = periods * (12 / frequency);
  if (months % 12 === 0) return yearsText(locale, months / 12);
  return monthsText(locale, months);
}

function frame(source: IntCp004EnglishFrozenV2Question): number {
  const match = source.stemFamilyId.match(/FRAME-(\d+)/u);
  return match ? Number(match[1]) : 1;
}

function hasVisibleTable(source: IntCp004EnglishFrozenV2Question): boolean {
  return /^\|.+\|$/mu.test(source.stem) && /^\|\s*[-:]+/mu.test(source.stem);
}

function table(locale: IntCp004V6Locale, rows: readonly (readonly [string, string])[], prompt: string): string {
  const h1 = isHindi(locale) ? "विवरण" : "ਵੇਰਵਾ";
  const h2 = isHindi(locale) ? "मान" : "ਮੁੱਲ";
  return [
    `| ${h1} | ${h2} |`,
    "|---|---|",
    ...rows.map(([left, right]) => `| ${left} | ${right} |`),
    "",
    prompt,
  ].join("\n");
}

function targetPrompt(locale: IntCp004V6Locale, qlId: string): string {
  if (isHindi(locale)) {
    if (["INT-QL-067", "INT-QL-073", "INT-QL-079", "INT-QL-084"].includes(qlId)) return "अंतिम राशि ज्ञात कीजिए।";
    if (["INT-QL-068", "INT-QL-074", "INT-QL-080", "INT-QL-085"].includes(qlId)) return "चक्रवृद्धि ब्याज ज्ञात कीजिए।";
    if (["INT-QL-069", "INT-QL-070", "INT-QL-081"].includes(qlId)) return "मूलधन ज्ञात कीजिए।";
    if (["INT-QL-071", "INT-QL-077", "INT-QL-082"].includes(qlId)) return "वार्षिक ब्याज दर ज्ञात कीजिए।";
    if (["INT-QL-072", "INT-QL-083"].includes(qlId)) return "समय ज्ञात कीजिए।";
    if (qlId === "INT-QL-075") return "दोनों योजनाओं की अंतिम राशियों का अंतर ज्ञात कीजिए।";
    if (qlId === "INT-QL-076") return "प्रभावी वार्षिक ब्याज दर ज्ञात कीजिए।";
    return "ब्याज जोड़ने का सही अंतराल ज्ञात कीजिए।";
  }
  if (["INT-QL-067", "INT-QL-073", "INT-QL-079", "INT-QL-084"].includes(qlId)) return "ਅੰਤਿਮ ਰਕਮ ਪਤਾ ਕਰੋ।";
  if (["INT-QL-068", "INT-QL-074", "INT-QL-080", "INT-QL-085"].includes(qlId)) return "ਮਿਸ਼ਰਤ ਵਿਆਜ ਪਤਾ ਕਰੋ।";
  if (["INT-QL-069", "INT-QL-070", "INT-QL-081"].includes(qlId)) return "ਮੂਲਧਨ ਪਤਾ ਕਰੋ।";
  if (["INT-QL-071", "INT-QL-077", "INT-QL-082"].includes(qlId)) return "ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪਤਾ ਕਰੋ।";
  if (["INT-QL-072", "INT-QL-083"].includes(qlId)) return "ਸਮਾਂ ਪਤਾ ਕਰੋ।";
  if (qlId === "INT-QL-075") return "ਦੋਵੇਂ ਯੋਜਨਾਵਾਂ ਦੀਆਂ ਅੰਤਿਮ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਪਤਾ ਕਰੋ।";
  if (qlId === "INT-QL-076") return "ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪਤਾ ਕਰੋ।";
  return "ਵਿਆਜ ਜੋੜਨ ਦਾ ਸਹੀ ਅੰਤਰਾਲ ਪਤਾ ਕਰੋ।";
}

function visibleRows(source: IntCp004EnglishFrozenV2Question, locale: IntCp004V6Locale): readonly (readonly [string, string])[] {
  const s = source.mathematicalState;
  const amount = completeAmountForState(s);
  const periodicAmount = periodicAmountForState(s);
  const brokenAmount = brokenAmountForState(s);
  const mixedAmount = mixedAmountForState(s);
  const labels = isHindi(locale)
    ? { p: "मूलधन", r: "वार्षिक दर", pr: "प्रति अवधि दर", time: "समय", amount: "अंतिम राशि", ci: "चक्रवृद्धि ब्याज", freq: "ब्याज जोड़ना", effective: "प्रभावी वार्षिक दर", first: "पहला चरण", second: "दूसरा चरण" }
    : { p: "ਮੂਲਧਨ", r: "ਸਾਲਾਨਾ ਦਰ", pr: "ਹਰ ਮਿਆਦ ਦੀ ਦਰ", time: "ਸਮਾਂ", amount: "ਅੰਤਿਮ ਰਕਮ", ci: "ਮਿਸ਼ਰਤ ਵਿਆਜ", freq: "ਵਿਆਜ ਜੋੜਨਾ", effective: "ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ", first: "ਪਹਿਲਾ ਪੜਾਅ", second: "ਦੂਜਾ ਪੜਾਅ" };
  switch (source.qlId) {
    case "INT-QL-067": case "INT-QL-068": return [[labels.p, moneyText(s.principal)], [labels.r, percentText(s.nominalAnnualRatePercent)], [labels.freq, frequencyInterval(locale, s.frequency)], [labels.time, durationFromPeriods(locale, s.periods, s.frequency)]];
    case "INT-QL-069": return [[labels.amount, moneyText(amount)], [labels.r, percentText(s.nominalAnnualRatePercent)], [labels.freq, frequencyInterval(locale, s.frequency)], [labels.time, durationFromPeriods(locale, s.periods, s.frequency)]];
    case "INT-QL-070": return [[labels.ci, moneyText(sub(amount, s.principal))], [labels.r, percentText(s.nominalAnnualRatePercent)], [labels.freq, frequencyInterval(locale, s.frequency)], [labels.time, durationFromPeriods(locale, s.periods, s.frequency)]];
    case "INT-QL-071": return [[labels.p, moneyText(s.principal)], [labels.amount, moneyText(amount)], [labels.freq, frequencyInterval(locale, s.frequency)], [labels.time, durationFromPeriods(locale, s.periods, s.frequency)]];
    case "INT-QL-072": return [[labels.p, moneyText(s.principal)], [labels.amount, moneyText(amount)], [labels.r, percentText(s.nominalAnnualRatePercent)], [labels.freq, frequencyInterval(locale, s.frequency)]];
    case "INT-QL-073": case "INT-QL-074": return [[labels.p, moneyText(s.principal)], [labels.pr, percentText(s.periodicRatePercent)], [labels.freq, frequencyInterval(locale, s.frequency)], [labels.time, durationFromPeriods(locale, s.periods, s.frequency)]];
    case "INT-QL-075": return [[labels.p, moneyText(s.principal)], [labels.r, percentText(s.nominalAnnualRatePercent)], [labels.time, yearsText(locale, s.years)], [isHindi(locale) ? "योजना 1" : "ਯੋਜਨਾ 1", frequencyLabel(locale, s.frequency)], [isHindi(locale) ? "योजना 2" : "ਯੋਜਨਾ 2", frequencyLabel(locale, s.comparisonFrequency)]];
    case "INT-QL-076": return [[labels.r, percentText(s.nominalAnnualRatePercent)], [labels.freq, frequencyInterval(locale, s.frequency)]];
    case "INT-QL-077": return [[labels.effective, percentText(effectiveAnnualRate(s.nominalAnnualRatePercent, s.frequency))], [labels.freq, frequencyInterval(locale, s.frequency)]];
    case "INT-QL-078": return [[labels.p, moneyText(s.principal)], [labels.r, percentText(s.nominalAnnualRatePercent)], [labels.time, yearsText(locale, s.years)], [labels.amount, moneyText(amount)]];
    case "INT-QL-079": case "INT-QL-080": return [[labels.p, moneyText(s.principal)], [labels.r, percentText(s.nominalAnnualRatePercent)], [labels.time, yearsMonthsText(locale, s.fullYears, s.tailMonths)]];
    case "INT-QL-081": return [[labels.amount, moneyText(brokenAmount)], [labels.r, percentText(s.nominalAnnualRatePercent)], [labels.time, yearsMonthsText(locale, s.fullYears, s.tailMonths)]];
    case "INT-QL-082": return [[labels.p, moneyText(s.principal)], [labels.amount, moneyText(brokenAmount)], [labels.time, yearsMonthsText(locale, s.fullYears, s.tailMonths)]];
    case "INT-QL-083": return [[labels.p, moneyText(s.principal)], [labels.r, percentText(s.nominalAnnualRatePercent)], [isHindi(locale) ? "अंतिम महीनों की अवधि" : "ਆਖਰੀ ਮਹੀਨਿਆਂ ਦੀ ਮਿਆਦ", monthsText(locale, s.tailMonths)], [labels.amount, moneyText(brokenAmount)]];
    case "INT-QL-084": case "INT-QL-085": return [[labels.p, moneyText(s.principal)], [labels.r, percentText(s.nominalAnnualRatePercent)], [labels.first, `${yearsText(locale, s.firstYears)} — ${frequencyLabel(locale, s.firstFrequency)}`], [labels.second, `${yearsText(locale, s.secondYears)} — ${frequencyLabel(locale, s.secondFrequency)}`]];
  }
}

function proseStem(source: IntCp004EnglishFrozenV2Question, locale: IntCp004V6Locale): string {
  const s = source.mathematicalState;
  const amount = completeAmountForState(s);
  const periodicAmount = periodicAmountForState(s);
  const brokenAmount = brokenAmountForState(s);
  const mixedAmount = mixedAmountForState(s);
  const f = frame(source);
  const prompt = targetPrompt(locale, source.qlId);
  const hi = isHindi(locale);
  const prefix = f === 2 ? (hi ? "एक प्रश्न में" : "ਇੱਕ ਪ੍ਰਸ਼ਨ ਵਿੱਚ") : f === 3 ? (hi ? "मान लीजिए" : "ਮੰਨ ਲਓ") : "";
  const start = prefix ? `${prefix}, ` : "";

  switch (source.qlId) {
    case "INT-QL-067": return hi
      ? `${start}${moneyText(s.principal)} को ${percentText(s.nominalAnnualRatePercent)} वार्षिक दर पर रखा गया है और ब्याज ${frequencyInterval(locale, s.frequency)} मूलधन में जुड़ता है। अवधि ${durationFromPeriods(locale, s.periods, s.frequency)} है। ${prompt}`
      : `${start}${moneyText(s.principal)} ਨੂੰ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਉੱਤੇ ਰੱਖਿਆ ਗਿਆ ਹੈ ਅਤੇ ਵਿਆਜ ${frequencyInterval(locale, s.frequency)} ਮੂਲਧਨ ਵਿੱਚ ਜੁੜਦਾ ਹੈ। ਮਿਆਦ ${durationFromPeriods(locale, s.periods, s.frequency)} ਹੈ। ${prompt}`;
    case "INT-QL-068": return hi
      ? `${start}${moneyText(s.principal)} पर ${percentText(s.nominalAnnualRatePercent)} वार्षिक दर से ${durationFromPeriods(locale, s.periods, s.frequency)} तक ब्याज ${frequencyInterval(locale, s.frequency)} जोड़ा जाता है। ${prompt}`
      : `${start}${moneyText(s.principal)} ਉੱਤੇ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${durationFromPeriods(locale, s.periods, s.frequency)} ਲਈ ਵਿਆਜ ${frequencyInterval(locale, s.frequency)} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ${prompt}`;
    case "INT-QL-069": return hi
      ? `${start}किसी मूलधन की राशि ${percentText(s.nominalAnnualRatePercent)} वार्षिक दर पर ${durationFromPeriods(locale, s.periods, s.frequency)} बाद ${moneyText(amount)} हो जाती है। ब्याज ${frequencyInterval(locale, s.frequency)} जोड़ा जाता है। ${prompt}`
      : `${start}ਕਿਸੇ ਮੂਲਧਨ ਦੀ ਰਕਮ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਉੱਤੇ ${durationFromPeriods(locale, s.periods, s.frequency)} ਬਾਅਦ ${moneyText(amount)} ਹੋ ਜਾਂਦੀ ਹੈ। ਵਿਆਜ ${frequencyInterval(locale, s.frequency)} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ${prompt}`;
    case "INT-QL-070": return hi
      ? `${start}${percentText(s.nominalAnnualRatePercent)} वार्षिक दर पर ${durationFromPeriods(locale, s.periods, s.frequency)} में चक्रवृद्धि ब्याज ${moneyText(sub(amount, s.principal))} है। ब्याज ${frequencyInterval(locale, s.frequency)} जोड़ा जाता है। ${prompt}`
      : `${start}${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਉੱਤੇ ${durationFromPeriods(locale, s.periods, s.frequency)} ਵਿੱਚ ਮਿਸ਼ਰਤ ਵਿਆਜ ${moneyText(sub(amount, s.principal))} ਹੈ। ਵਿਆਜ ${frequencyInterval(locale, s.frequency)} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ${prompt}`;
    case "INT-QL-071": return hi
      ? `${start}${moneyText(s.principal)} बढ़कर ${durationFromPeriods(locale, s.periods, s.frequency)} में ${moneyText(amount)} हो जाता है। ब्याज ${frequencyInterval(locale, s.frequency)} जोड़ा जाता है। ${prompt}`
      : `${start}${moneyText(s.principal)} ਵੱਧ ਕੇ ${durationFromPeriods(locale, s.periods, s.frequency)} ਵਿੱਚ ${moneyText(amount)} ਹੋ ਜਾਂਦਾ ਹੈ। ਵਿਆਜ ${frequencyInterval(locale, s.frequency)} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ${prompt}`;
    case "INT-QL-072": return hi
      ? `${start}${moneyText(s.principal)} को ${percentText(s.nominalAnnualRatePercent)} वार्षिक दर पर रखा गया है। ब्याज ${frequencyInterval(locale, s.frequency)} जुड़ता है और राशि ${moneyText(amount)} हो जाती है। ${prompt}`
      : `${start}${moneyText(s.principal)} ਨੂੰ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਉੱਤੇ ਰੱਖਿਆ ਗਿਆ ਹੈ। ਵਿਆਜ ${frequencyInterval(locale, s.frequency)} ਜੁੜਦਾ ਹੈ ਅਤੇ ਰਕਮ ${moneyText(amount)} ਹੋ ਜਾਂਦੀ ਹੈ। ${prompt}`;
    case "INT-QL-073": return hi
      ? `${start}${moneyText(s.principal)} पर प्रत्येक ${frequencyLabel(locale, s.frequency)} अवधि की ब्याज दर सीधे ${percentText(s.periodicRatePercent)} दी गई है। कुल अवधि ${durationFromPeriods(locale, s.periods, s.frequency)} है। ${prompt}`
      : `${start}${moneyText(s.principal)} ਉੱਤੇ ਹਰ ${frequencyLabel(locale, s.frequency)} ਮਿਆਦ ਦੀ ਵਿਆਜ ਦਰ ਸਿੱਧੀ ${percentText(s.periodicRatePercent)} ਦਿੱਤੀ ਹੈ। ਕੁੱਲ ਮਿਆਦ ${durationFromPeriods(locale, s.periods, s.frequency)} ਹੈ। ${prompt}`;
    case "INT-QL-074": return hi
      ? `${start}${moneyText(s.principal)} पर हर ${frequencyLabel(locale, s.frequency)} अवधि के लिए ${percentText(s.periodicRatePercent)} ब्याज लगता है। अवधि ${durationFromPeriods(locale, s.periods, s.frequency)} है। ${prompt}`
      : `${start}${moneyText(s.principal)} ਉੱਤੇ ਹਰ ${frequencyLabel(locale, s.frequency)} ਮਿਆਦ ਲਈ ${percentText(s.periodicRatePercent)} ਵਿਆਜ ਲੱਗਦਾ ਹੈ। ਮਿਆਦ ${durationFromPeriods(locale, s.periods, s.frequency)} ਹੈ। ${prompt}`;
    case "INT-QL-075": return hi
      ? `${start}${moneyText(s.principal)} को ${percentText(s.nominalAnnualRatePercent)} वार्षिक दर पर ${yearsText(locale, s.years)} के लिए दो योजनाओं में रखा जाता है। पहली में ब्याज ${frequencyInterval(locale, s.frequency)} और दूसरी में ${frequencyInterval(locale, s.comparisonFrequency)} जुड़ता है। ${prompt}`
      : `${start}${moneyText(s.principal)} ਨੂੰ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਉੱਤੇ ${yearsText(locale, s.years)} ਲਈ ਦੋ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ। ਪਹਿਲੀ ਵਿੱਚ ਵਿਆਜ ${frequencyInterval(locale, s.frequency)} ਅਤੇ ਦੂਜੀ ਵਿੱਚ ${frequencyInterval(locale, s.comparisonFrequency)} ਜੁੜਦਾ ਹੈ। ${prompt}`;
    case "INT-QL-076": return hi
      ? `${start}घोषित वार्षिक दर ${percentText(s.nominalAnnualRatePercent)} है और ब्याज ${frequencyInterval(locale, s.frequency)} जोड़ा जाता है। ${prompt}`
      : `${start}ਘੋਸ਼ਿਤ ਸਾਲਾਨਾ ਦਰ ${percentText(s.nominalAnnualRatePercent)} ਹੈ ਅਤੇ ਵਿਆਜ ${frequencyInterval(locale, s.frequency)} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ${prompt}`;
    case "INT-QL-077": return hi
      ? `${start}ब्याज ${frequencyInterval(locale, s.frequency)} जोड़ने पर प्रभावी वार्षिक दर ${percentText(effectiveAnnualRate(s.nominalAnnualRatePercent, s.frequency))} है। ${prompt}`
      : `${start}ਵਿਆਜ ${frequencyInterval(locale, s.frequency)} ਜੋੜਨ ਉੱਤੇ ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ ${percentText(effectiveAnnualRate(s.nominalAnnualRatePercent, s.frequency))} ਹੈ। ${prompt}`;
    case "INT-QL-078": return hi
      ? `${start}${moneyText(s.principal)} को ${percentText(s.nominalAnnualRatePercent)} वार्षिक दर पर ${yearsText(locale, s.years)} रखने पर राशि ${moneyText(amount)} हो जाती है। ${prompt}`
      : `${start}${moneyText(s.principal)} ਨੂੰ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਉੱਤੇ ${yearsText(locale, s.years)} ਰੱਖਣ ਉੱਤੇ ਰਕਮ ${moneyText(amount)} ਹੋ ਜਾਂਦੀ ਹੈ। ${prompt}`;
    case "INT-QL-079": return hi
      ? `${start}${moneyText(s.principal)} को ${percentText(s.nominalAnnualRatePercent)} वार्षिक दर पर ${yearsMonthsText(locale, s.fullYears, s.tailMonths)} के लिए रखा गया है। पहले ${yearsText(locale, s.fullYears)} ब्याज वार्षिक रूप से जोड़ा जाता है; अंतिम ${monthsText(locale, s.tailMonths)} में उस समय की राशि पर साधारण ब्याज लगाया जाता है। ${prompt}`
      : `${start}${moneyText(s.principal)} ਨੂੰ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਉੱਤੇ ${yearsMonthsText(locale, s.fullYears, s.tailMonths)} ਲਈ ਰੱਖਿਆ ਗਿਆ ਹੈ। ਪਹਿਲੇ ${yearsText(locale, s.fullYears)} ਵਿਆਜ ਸਾਲਾਨਾ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ; ਆਖਰੀ ${monthsText(locale, s.tailMonths)} ਲਈ ਉਸ ਵੇਲੇ ਦੀ ਰਕਮ ਉੱਤੇ ਸਧਾਰਣ ਵਿਆਜ ਲੱਗਦਾ ਹੈ। ${prompt}`;
    case "INT-QL-080": return hi
      ? `${start}${moneyText(s.principal)} पर ${percentText(s.nominalAnnualRatePercent)} वार्षिक दर से कुल समय ${yearsMonthsText(locale, s.fullYears, s.tailMonths)} है। पहले ${yearsText(locale, s.fullYears)} वार्षिक चक्रवृद्धि ब्याज लगता है और अंतिम ${monthsText(locale, s.tailMonths)} के लिए उस समय की राशि पर साधारण ब्याज लगता है। ${prompt}`
      : `${start}${moneyText(s.principal)} ਉੱਤੇ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ਕੁੱਲ ਸਮਾਂ ${yearsMonthsText(locale, s.fullYears, s.tailMonths)} ਹੈ। ਪਹਿਲੇ ${yearsText(locale, s.fullYears)} ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਲੱਗਦਾ ਹੈ ਅਤੇ ਆਖਰੀ ${monthsText(locale, s.tailMonths)} ਲਈ ਉਸ ਵੇਲੇ ਦੀ ਰਕਮ ਉੱਤੇ ਸਧਾਰਣ ਵਿਆਜ ਲੱਗਦਾ ਹੈ। ${prompt}`;
    case "INT-QL-081": return hi
      ? `${start}किसी राशि का कुल समय ${yearsMonthsText(locale, s.fullYears, s.tailMonths)} है। ${percentText(s.nominalAnnualRatePercent)} वार्षिक दर से पहले ${yearsText(locale, s.fullYears)} वार्षिक चक्रवृद्धि ब्याज और अंतिम ${monthsText(locale, s.tailMonths)} के लिए साधारण ब्याज लगाने पर राशि ${moneyText(brokenAmount)} होती है। ${prompt}`
      : `${start}ਕਿਸੇ ਰਕਮ ਦਾ ਕੁੱਲ ਸਮਾਂ ${yearsMonthsText(locale, s.fullYears, s.tailMonths)} ਹੈ। ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ਪਹਿਲੇ ${yearsText(locale, s.fullYears)} ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਅਤੇ ਆਖਰੀ ${monthsText(locale, s.tailMonths)} ਲਈ ਸਧਾਰਣ ਵਿਆਜ ਲਗਾਉਣ ਉੱਤੇ ਰਕਮ ${moneyText(brokenAmount)} ਹੁੰਦੀ ਹੈ। ${prompt}`;
    case "INT-QL-082": return hi
      ? `${start}${moneyText(s.principal)} बढ़कर ${yearsMonthsText(locale, s.fullYears, s.tailMonths)} में ${moneyText(brokenAmount)} हो जाता है। पहले ${yearsText(locale, s.fullYears)} ब्याज वार्षिक रूप से जुड़ता है और अंतिम ${monthsText(locale, s.tailMonths)} के लिए साधारण ब्याज लगता है। ${prompt}`
      : `${start}${moneyText(s.principal)} ਵੱਧ ਕੇ ${yearsMonthsText(locale, s.fullYears, s.tailMonths)} ਵਿੱਚ ${moneyText(brokenAmount)} ਹੋ ਜਾਂਦਾ ਹੈ। ਪਹਿਲੇ ${yearsText(locale, s.fullYears)} ਵਿਆਜ ਸਾਲਾਨਾ ਜੁੜਦਾ ਹੈ ਅਤੇ ਆਖਰੀ ${monthsText(locale, s.tailMonths)} ਲਈ ਸਧਾਰਣ ਵਿਆਜ ਲੱਗਦਾ ਹੈ। ${prompt}`;
    case "INT-QL-083": return hi
      ? `${start}${moneyText(s.principal)} को ${percentText(s.nominalAnnualRatePercent)} वार्षिक दर पर रखा गया है। कुछ वर्षों तक ब्याज वार्षिक रूप से जोड़ने के बाद अंतिम ${monthsText(locale, s.tailMonths)} के लिए उस समय की राशि पर साधारण ब्याज लगाया जाता है। अंतिम राशि ${moneyText(brokenAmount)} है। ${prompt}`
      : `${start}${moneyText(s.principal)} ਨੂੰ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਉੱਤੇ ਰੱਖਿਆ ਗਿਆ ਹੈ। ਕੁਝ ਸਾਲ ਵਿਆਜ ਸਾਲਾਨਾ ਜੋੜਨ ਤੋਂ ਬਾਅਦ ਆਖਰੀ ${monthsText(locale, s.tailMonths)} ਲਈ ਉਸ ਵੇਲੇ ਦੀ ਰਕਮ ਉੱਤੇ ਸਧਾਰਣ ਵਿਆਜ ਲੱਗਦਾ ਹੈ। ਅੰਤਿਮ ਰਕਮ ${moneyText(brokenAmount)} ਹੈ। ${prompt}`;
    case "INT-QL-084": return hi
      ? `${start}${moneyText(s.principal)} पर ${percentText(s.nominalAnnualRatePercent)} वार्षिक दर है। पहले ${yearsText(locale, s.firstYears)} ब्याज ${frequencyInterval(locale, s.firstFrequency)} जोड़ा जाता है और अगले ${yearsText(locale, s.secondYears)} ${frequencyInterval(locale, s.secondFrequency)} जोड़ा जाता है। ${prompt}`
      : `${start}${moneyText(s.principal)} ਉੱਤੇ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਹੈ। ਪਹਿਲੇ ${yearsText(locale, s.firstYears)} ਵਿਆਜ ${frequencyInterval(locale, s.firstFrequency)} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਅਗਲੇ ${yearsText(locale, s.secondYears)} ${frequencyInterval(locale, s.secondFrequency)} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ${prompt}`;
    case "INT-QL-085": return hi
      ? `${start}${moneyText(s.principal)} पर ${percentText(s.nominalAnnualRatePercent)} वार्षिक दर से पहले ${yearsText(locale, s.firstYears)} ब्याज ${frequencyInterval(locale, s.firstFrequency)} और अगले ${yearsText(locale, s.secondYears)} ${frequencyInterval(locale, s.secondFrequency)} जोड़ा जाता है। ${prompt}`
      : `${start}${moneyText(s.principal)} ਉੱਤੇ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ਪਹਿਲੇ ${yearsText(locale, s.firstYears)} ਵਿਆਜ ${frequencyInterval(locale, s.firstFrequency)} ਅਤੇ ਅਗਲੇ ${yearsText(locale, s.secondYears)} ${frequencyInterval(locale, s.secondFrequency)} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ${prompt}`;
  }
}

function localizedStem(source: IntCp004EnglishFrozenV2Question, locale: IntCp004V6Locale): string {
  if (hasVisibleTable(source)) return table(locale, visibleRows(source, locale), targetPrompt(locale, source.qlId));
  return proseStem(source, locale);
}

function optionText(source: IntCp004EnglishFrozenV2Question, locale: IntCp004V6Locale, value: Rational): string {
  if (source.answerSemantic === "MONEY") return moneyText(value);
  if (source.answerSemantic === "RATE_PERCENT") return percentText(value);
  if (source.answerSemantic === "FREQUENCY") return frequencyOption(locale, Number(value.numerator) as Cp004Frequency);
  if (source.qlId === "INT-QL-072") return durationFromPeriods(locale, Number(value.numerator), source.mathematicalState.frequency);
  return yearsText(locale, Number(value.numerator));
}

function localizedOptions(source: IntCp004EnglishFrozenV2Question, locale: IntCp004V6Locale): readonly IntCp004V6LocalizedOption[] {
  return Object.freeze(source.options.map((option) => Object.freeze({
    ...option,
    text: optionText(source, locale, option.value),
    feedback: "" as const,
  })));
}

function taskLine(locale: IntCp004V6Locale, qlId: string): string {
  const prompt = targetPrompt(locale, qlId);
  return isHindi(locale) ? `हमें ${prompt.replace(" ज्ञात कीजिए।", " ज्ञात करना है।").replace("सही अंतराल ज्ञात करना है।", "सही अंतराल ज्ञात करना है।")}` : `ਆਓ ${prompt.replace(" ਪਤਾ ਕਰੋ।", " ਕੱਢੀਏ।")}`;
}

function formula(locale: IntCp004V6Locale, qlId: string): string {
  const hi = isHindi(locale);
  switch (qlId) {
    case "INT-QL-067": case "INT-QL-073": return hi ? "सूत्र: A = P × (1 + r/100)^n।" : "ਸੂਤਰ: A = P × (1 + r/100)^n।";
    case "INT-QL-068": case "INT-QL-074": return hi ? "सूत्र: A = P × (1 + r/100)^n और चक्रवृद्धि ब्याज = A − P।" : "ਸੂਤਰ: A = P × (1 + r/100)^n ਅਤੇ ਮਿਸ਼ਰਤ ਵਿਆਜ = A − P।";
    case "INT-QL-069": return hi ? "सूत्र: P = A ÷ (1 + r/100)^n।" : "ਸੂਤਰ: P = A ÷ (1 + r/100)^n।";
    case "INT-QL-070": return hi ? "सूत्र: चक्रवृद्धि ब्याज = P × [(1 + r/100)^n − 1]।" : "ਸੂਤਰ: ਮਿਸ਼ਰਤ ਵਿਆਜ = P × [(1 + r/100)^n − 1]।";
    case "INT-QL-071": case "INT-QL-072": return hi ? "सूत्र: A/P = (1 + r/100)^n और वार्षिक दर R = m × r।" : "ਸੂਤਰ: A/P = (1 + r/100)^n ਅਤੇ ਸਾਲਾਨਾ ਦਰ R = m × r।";
    case "INT-QL-075": return hi ? "सूत्र: प्रत्येक योजना के लिए A = P × (1 + R/(100m))^(mt); फिर दोनों राशियों का अंतर लें।" : "ਸੂਤਰ: ਹਰ ਯੋਜਨਾ ਲਈ A = P × (1 + R/(100m))^(mt); ਫਿਰ ਦੋਵੇਂ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਕੱਢੋ।";
    case "INT-QL-076": return hi ? "सूत्र: प्रभावी वार्षिक दर = [(1 + R/(100m))^m − 1] × 100।" : "ਸੂਤਰ: ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ = [(1 + R/(100m))^m − 1] × 100।";
    case "INT-QL-077": return hi ? "सूत्र: 1 + E/100 = (1 + R/(100m))^m।" : "ਸੂਤਰ: 1 + E/100 = (1 + R/(100m))^m।";
    case "INT-QL-078": return hi ? "सूत्र: A = P × (1 + R/(100m))^(mt); सही m वही है जिससे दी गई राशि मिलती है।" : "ਸੂਤਰ: A = P × (1 + R/(100m))^(mt); ਸਹੀ m ਉਹੀ ਹੈ ਜਿਸ ਨਾਲ ਦਿੱਤੀ ਰਕਮ ਮਿਲਦੀ ਹੈ।";
    case "INT-QL-079": case "INT-QL-080": return hi ? "सूत्र: A = P × (1 + R/100)^y × [1 + R×x/(100×12)]।" : "ਸੂਤਰ: A = P × (1 + R/100)^y × [1 + R×x/(100×12)]।";
    case "INT-QL-081": return hi ? "सूत्र: P = A ÷ {(1 + R/100)^y × [1 + R×x/(100×12)]}।" : "ਸੂਤਰ: P = A ÷ {(1 + R/100)^y × [1 + R×x/(100×12)]}।";
    case "INT-QL-082": case "INT-QL-083": return hi ? "सूत्र: A = P × (1 + R/100)^y × [1 + R×x/(100×12)]।" : "ਸੂਤਰ: A = P × (1 + R/100)^y × [1 + R×x/(100×12)]।";
    case "INT-QL-084": case "INT-QL-085": return hi ? "सूत्र: A = P × (1 + R/(100m₁))^(m₁t₁) × (1 + R/(100m₂))^(m₂t₂)।" : "ਸੂਤਰ: A = P × (1 + R/(100m₁))^(m₁t₁) × (1 + R/(100m₂))^(m₂t₂)।";
  }
}

function rateStep(locale: IntCp004V6Locale, state: Cp004MathematicalState, frequency = state.frequency): string {
  const rate = periodicRate(state.nominalAnnualRatePercent, frequency);
  return isHindi(locale)
    ? `प्रति अवधि दर = ${percentText(state.nominalAnnualRatePercent)} ÷ ${frequency} = ${percentText(rate)}।`
    : `ਹਰ ਮਿਆਦ ਦੀ ਦਰ = ${percentText(state.nominalAnnualRatePercent)} ÷ ${frequency} = ${percentText(rate)}।`;
}

function finalLine(locale: IntCp004V6Locale, answer: string): string {
  return isHindi(locale) ? `उत्तर: ${answer}।` : `ਉੱਤਰ: ${answer}।`;
}

function commonMistake(locale: IntCp004V6Locale, qlId: string): string {
  if (["INT-QL-079", "INT-QL-080", "INT-QL-081", "INT-QL-082", "INT-QL-083"].includes(qlId)) {
    return isHindi(locale)
      ? "अंतिम महीनों का साधारण ब्याज मूलधन पर नहीं, पूरे वर्षों के बाद बनी राशि पर लगाना है।"
      : "ਆਖਰੀ ਮਹੀਨਿਆਂ ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਮੂਲਧਨ ਉੱਤੇ ਨਹੀਂ, ਪੂਰੇ ਸਾਲਾਂ ਤੋਂ ਬਾਅਦ ਬਣੀ ਰਕਮ ਉੱਤੇ ਲਗਾਉਣਾ ਹੈ।";
  }
  if (["INT-QL-084", "INT-QL-085"].includes(qlId)) {
    return isHindi(locale)
      ? "दूसरे चरण में ब्याज जोड़ने का अंतराल बदलता है; पूरे समय एक ही अंतराल न रखें।"
      : "ਦੂਜੇ ਪੜਾਅ ਵਿੱਚ ਵਿਆਜ ਜੋੜਨ ਦਾ ਅੰਤਰਾਲ ਬਦਲਦਾ ਹੈ; ਪੂਰੇ ਸਮੇਂ ਲਈ ਇੱਕੋ ਅੰਤਰਾਲ ਨਾ ਵਰਤੋ।";
  }
  return isHindi(locale)
    ? "वार्षिक दर को सही अवधि की दर में बदलना और ब्याज जुड़ने की कुल संख्या सही रखना जरूरी है।"
    : "ਸਾਲਾਨਾ ਦਰ ਨੂੰ ਸਹੀ ਮਿਆਦ ਦੀ ਦਰ ਵਿੱਚ ਬਦਲਣਾ ਅਤੇ ਵਿਆਜ ਜੁੜਨ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਸਹੀ ਰੱਖਣਾ ਜ਼ਰੂਰੀ ਹੈ।";
}

function explanation(source: IntCp004EnglishFrozenV2Question, locale: IntCp004V6Locale, answer: string): IntCp004V6LocalizedExplanation {
  const s = source.mathematicalState;
  const amount = completeAmountForState(s);
  const per = periodicRate(s.nominalAnnualRatePercent, s.frequency);
  const broken = brokenAmountForState(s);
  const mixed = mixedAmountForState(s);
  const steps: string[] = [formula(locale, source.qlId)];
  const hi = isHindi(locale);

  switch (source.qlId) {
    case "INT-QL-067":
      steps.push(rateStep(locale, s));
      steps.push(hi ? `कुल अवधियाँ n = ${s.periods}।` : `ਕੁੱਲ ਮਿਆਦਾਂ n = ${s.periods}।`);
      steps.push(`A = ${moneyText(s.principal)} × (1 + ${plain(per)}/100)^${s.periods} = ${moneyText(amount)}।`);
      break;
    case "INT-QL-068":
      steps.push(rateStep(locale, s));
      steps.push(`A = ${moneyText(s.principal)} × (1 + ${plain(per)}/100)^${s.periods} = ${moneyText(amount)}।`);
      steps.push(hi ? `चक्रवृद्धि ब्याज = ${moneyText(amount)} − ${moneyText(s.principal)} = ${moneyText(sub(amount, s.principal))}।` : `ਮਿਸ਼ਰਤ ਵਿਆਜ = ${moneyText(amount)} − ${moneyText(s.principal)} = ${moneyText(sub(amount, s.principal))}।`);
      break;
    case "INT-QL-069":
      steps.push(rateStep(locale, s));
      steps.push(`P = ${moneyText(amount)} ÷ (1 + ${plain(per)}/100)^${s.periods} = ${moneyText(s.principal)}।`);
      break;
    case "INT-QL-070": {
      const ci = sub(amount, s.principal);
      steps.push(rateStep(locale, s));
      steps.push(`P = ${moneyText(ci)} ÷ [(1 + ${plain(per)}/100)^${s.periods} − 1] = ${moneyText(s.principal)}।`);
      break;
    }
    case "INT-QL-071":
      steps.push(hi ? `सही विकल्प ${percentText(s.nominalAnnualRatePercent)} रखने पर प्रति अवधि दर ${percentText(per)} होती है।` : `ਸਹੀ ਚੋਣ ${percentText(s.nominalAnnualRatePercent)} ਰੱਖਣ ਉੱਤੇ ਹਰ ਮਿਆਦ ਦੀ ਦਰ ${percentText(per)} ਹੁੰਦੀ ਹੈ।`);
      steps.push(`A = ${moneyText(s.principal)} × (1 + ${plain(per)}/100)^${s.periods} = ${moneyText(amount)}।`);
      steps.push(hi ? "यह प्रश्न में दी गई राशि से मिलती है, इसलिए यही वार्षिक दर सही है।" : "ਇਹ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀ ਰਕਮ ਨਾਲ ਮਿਲਦੀ ਹੈ, ਇਸ ਲਈ ਇਹੀ ਸਾਲਾਨਾ ਦਰ ਸਹੀ ਹੈ।");
      break;
    case "INT-QL-072":
      steps.push(rateStep(locale, s));
      steps.push(`${moneyText(amount)} ÷ ${moneyText(s.principal)} = (1 + ${plain(per)}/100)^n; n = ${s.periods}।`);
      steps.push(hi ? `${s.periods} अवधियाँ = ${durationFromPeriods(locale, s.periods, s.frequency)}।` : `${s.periods} ਮਿਆਦਾਂ = ${durationFromPeriods(locale, s.periods, s.frequency)}।`);
      break;
    case "INT-QL-073":
      steps.push(hi ? `प्रति अवधि दर सीधे ${percentText(s.periodicRatePercent)} दी गई है और n = ${s.periods}।` : `ਹਰ ਮਿਆਦ ਦੀ ਦਰ ਸਿੱਧੀ ${percentText(s.periodicRatePercent)} ਦਿੱਤੀ ਹੈ ਅਤੇ n = ${s.periods}।`);
      steps.push(`A = ${moneyText(s.principal)} × (1 + ${plain(s.periodicRatePercent)}/100)^${s.periods} = ${moneyText(periodicAmountForState(s))}।`);
      break;
    case "INT-QL-074": {
      const pa = periodicAmountForState(s);
      steps.push(hi ? `प्रति अवधि दर ${percentText(s.periodicRatePercent)} और n = ${s.periods}।` : `ਹਰ ਮਿਆਦ ਦੀ ਦਰ ${percentText(s.periodicRatePercent)} ਅਤੇ n = ${s.periods}।`);
      steps.push(`A = ${moneyText(s.principal)} × (1 + ${plain(s.periodicRatePercent)}/100)^${s.periods} = ${moneyText(pa)}।`);
      steps.push(hi ? `चक्रवृद्धि ब्याज = ${moneyText(pa)} − ${moneyText(s.principal)} = ${moneyText(sub(pa, s.principal))}।` : `ਮਿਸ਼ਰਤ ਵਿਆਜ = ${moneyText(pa)} − ${moneyText(s.principal)} = ${moneyText(sub(pa, s.principal))}।`);
      break;
    }
    case "INT-QL-075": {
      const r1 = periodicRate(s.nominalAnnualRatePercent, s.frequency);
      const r2 = periodicRate(s.nominalAnnualRatePercent, s.comparisonFrequency);
      const a1 = completeAmountFromNominal(s.principal, s.nominalAnnualRatePercent, s.frequency, s.frequency * s.years);
      const a2 = completeAmountFromNominal(s.principal, s.nominalAnnualRatePercent, s.comparisonFrequency, s.comparisonFrequency * s.years);
      steps.push(hi ? `योजना 1: प्रति अवधि दर ${percentText(r1)}, कुल अवधियाँ ${s.frequency * s.years}।` : `ਯੋਜਨਾ 1: ਹਰ ਮਿਆਦ ਦੀ ਦਰ ${percentText(r1)}, ਕੁੱਲ ਮਿਆਦਾਂ ${s.frequency * s.years}।`);
      steps.push(`A₁ = ${moneyText(s.principal)} × (1 + ${plain(r1)}/100)^${s.frequency * s.years} = ${moneyText(a1)}।`);
      steps.push(hi ? `योजना 2: प्रति अवधि दर ${percentText(r2)}, कुल अवधियाँ ${s.comparisonFrequency * s.years}।` : `ਯੋਜਨਾ 2: ਹਰ ਮਿਆਦ ਦੀ ਦਰ ${percentText(r2)}, ਕੁੱਲ ਮਿਆਦਾਂ ${s.comparisonFrequency * s.years}।`);
      steps.push(`A₂ = ${moneyText(s.principal)} × (1 + ${plain(r2)}/100)^${s.comparisonFrequency * s.years} = ${moneyText(a2)}।`);
      const diff = source.solution;
      steps.push(hi ? `अंतर = |${moneyText(a1)} − ${moneyText(a2)}| = ${moneyText(diff)}।` : `ਅੰਤਰ = |${moneyText(a1)} − ${moneyText(a2)}| = ${moneyText(diff)}।`);
      break;
    }
    case "INT-QL-076": {
      const effective = effectiveAnnualRate(s.nominalAnnualRatePercent, s.frequency);
      steps.push(rateStep(locale, s));
      steps.push(`E = [(1 + ${plain(s.nominalAnnualRatePercent)}/(100×${s.frequency}))^${s.frequency} − 1] × 100 = ${percentText(effective)}।`);
      break;
    }
    case "INT-QL-077": {
      const effective = effectiveAnnualRate(s.nominalAnnualRatePercent, s.frequency);
      steps.push(hi ? `सही विकल्प ${percentText(s.nominalAnnualRatePercent)} रखने पर प्रति अवधि दर ${percentText(per)} होती है।` : `ਸਹੀ ਚੋਣ ${percentText(s.nominalAnnualRatePercent)} ਰੱਖਣ ਉੱਤੇ ਹਰ ਮਿਆਦ ਦੀ ਦਰ ${percentText(per)} ਹੁੰਦੀ ਹੈ।`);
      steps.push(`[(1 + ${plain(per)}/100)^${s.frequency} − 1] × 100 = ${percentText(effective)}।`);
      steps.push(hi ? "यह दी गई प्रभावी दर से मिलती है।" : "ਇਹ ਦਿੱਤੀ ਪ੍ਰਭਾਵੀ ਦਰ ਨਾਲ ਮਿਲਦੀ ਹੈ।");
      break;
    }
    case "INT-QL-078":
      steps.push(hi ? `सही अंतराल ${frequencyLabel(locale, s.frequency)} है, इसलिए m = ${s.frequency} और n = ${s.frequency * s.years}।` : `ਸਹੀ ਅੰਤਰਾਲ ${frequencyLabel(locale, s.frequency)} ਹੈ, ਇਸ ਲਈ m = ${s.frequency} ਅਤੇ n = ${s.frequency * s.years}।`);
      steps.push(`A = ${moneyText(s.principal)} × (1 + ${plain(s.nominalAnnualRatePercent)}/(100×${s.frequency}))^${s.frequency * s.years} = ${moneyText(amount)}।`);
      steps.push(hi ? "यह दी गई राशि से ठीक मेल खाती है।" : "ਇਹ ਦਿੱਤੀ ਰਕਮ ਨਾਲ ਠੀਕ ਮਿਲਦੀ ਹੈ।");
      break;
    case "INT-QL-079":
      steps.push(hi ? `y = ${s.fullYears}, x = ${s.tailMonths} महीने।` : `y = ${s.fullYears}, x = ${s.tailMonths} ਮਹੀਨੇ।`);
      steps.push(`A = ${moneyText(s.principal)} × (1 + ${plain(s.nominalAnnualRatePercent)}/100)^${s.fullYears} × [1 + ${plain(s.nominalAnnualRatePercent)}×${s.tailMonths}/(100×12)] = ${moneyText(broken)}।`);
      break;
    case "INT-QL-080":
      steps.push(hi ? `y = ${s.fullYears}, x = ${s.tailMonths} महीने।` : `y = ${s.fullYears}, x = ${s.tailMonths} ਮਹੀਨੇ।`);
      steps.push(`A = ${moneyText(s.principal)} × (1 + ${plain(s.nominalAnnualRatePercent)}/100)^${s.fullYears} × [1 + ${plain(s.nominalAnnualRatePercent)}×${s.tailMonths}/(100×12)] = ${moneyText(broken)}।`);
      steps.push(hi ? `चक्रवृद्धि ब्याज = ${moneyText(broken)} − ${moneyText(s.principal)} = ${moneyText(sub(broken, s.principal))}।` : `ਮਿਸ਼ਰਤ ਵਿਆਜ = ${moneyText(broken)} − ${moneyText(s.principal)} = ${moneyText(sub(broken, s.principal))}।`);
      break;
    case "INT-QL-081":
      steps.push(hi ? `y = ${s.fullYears}, x = ${s.tailMonths} महीने।` : `y = ${s.fullYears}, x = ${s.tailMonths} ਮਹੀਨੇ।`);
      steps.push(`P = ${moneyText(broken)} ÷ {(1 + ${plain(s.nominalAnnualRatePercent)}/100)^${s.fullYears} × [1 + ${plain(s.nominalAnnualRatePercent)}×${s.tailMonths}/(100×12)]} = ${moneyText(s.principal)}।`);
      break;
    case "INT-QL-082":
      steps.push(hi ? `सही विकल्प ${percentText(s.nominalAnnualRatePercent)} रखने पर:` : `ਸਹੀ ਚੋਣ ${percentText(s.nominalAnnualRatePercent)} ਰੱਖਣ ਉੱਤੇ:`);
      steps.push(`A = ${moneyText(s.principal)} × (1 + ${plain(s.nominalAnnualRatePercent)}/100)^${s.fullYears} × [1 + ${plain(s.nominalAnnualRatePercent)}×${s.tailMonths}/(100×12)] = ${moneyText(broken)}।`);
      steps.push(hi ? "यह दी गई राशि से मिलती है, इसलिए यही दर सही है।" : "ਇਹ ਦਿੱਤੀ ਰਕਮ ਨਾਲ ਮਿਲਦੀ ਹੈ, ਇਸ ਲਈ ਇਹੀ ਦਰ ਸਹੀ ਹੈ।");
      break;
    case "INT-QL-083":
      steps.push(hi ? `सही विकल्प y = ${s.fullYears} वर्ष रखने पर:` : `ਸਹੀ ਚੋਣ y = ${s.fullYears} ਸਾਲ ਰੱਖਣ ਉੱਤੇ:`);
      steps.push(`A = ${moneyText(s.principal)} × (1 + ${plain(s.nominalAnnualRatePercent)}/100)^${s.fullYears} × [1 + ${plain(s.nominalAnnualRatePercent)}×${s.tailMonths}/(100×12)] = ${moneyText(broken)}।`);
      steps.push(hi ? "यह दी गई अंतिम राशि से मिलती है।" : "ਇਹ ਦਿੱਤੀ ਅੰਤਿਮ ਰਕਮ ਨਾਲ ਮਿਲਦੀ ਹੈ।");
      break;
    case "INT-QL-084":
    case "INT-QL-085": {
      const r1 = periodicRate(s.nominalAnnualRatePercent, s.firstFrequency);
      const r2 = periodicRate(s.nominalAnnualRatePercent, s.secondFrequency);
      steps.push(hi ? `पहला चरण: प्रति अवधि दर ${percentText(r1)}, अवधियाँ ${s.firstFrequency * s.firstYears}।` : `ਪਹਿਲਾ ਪੜਾਅ: ਹਰ ਮਿਆਦ ਦੀ ਦਰ ${percentText(r1)}, ਮਿਆਦਾਂ ${s.firstFrequency * s.firstYears}।`);
      steps.push(hi ? `दूसरा चरण: प्रति अवधि दर ${percentText(r2)}, अवधियाँ ${s.secondFrequency * s.secondYears}।` : `ਦੂਜਾ ਪੜਾਅ: ਹਰ ਮਿਆਦ ਦੀ ਦਰ ${percentText(r2)}, ਮਿਆਦਾਂ ${s.secondFrequency * s.secondYears}।`);
      steps.push(`A = ${moneyText(s.principal)} × (1 + ${plain(r1)}/100)^${s.firstFrequency * s.firstYears} × (1 + ${plain(r2)}/100)^${s.secondFrequency * s.secondYears} = ${moneyText(mixed)}।`);
      if (source.qlId === "INT-QL-085") steps.push(hi ? `मिश्रित अवधि का चक्रवृद्धि ब्याज = ${moneyText(mixed)} − ${moneyText(s.principal)} = ${moneyText(sub(mixed, s.principal))}।` : `ਮਿਸ਼ਰਤ ਮਿਆਦ ਦਾ ਵਿਆਜ = ${moneyText(mixed)} − ${moneyText(s.principal)} = ${moneyText(sub(mixed, s.principal))}।`);
      break;
    }
  }

  return Object.freeze({
    whatAsked: taskLine(locale, source.qlId),
    steps: Object.freeze(steps),
    finalAnswer: finalLine(locale, answer),
    commonMistake: commonMistake(locale, source.qlId),
  });
}

export function localizeIntCp004EnglishV6Question(
  source: IntCp004EnglishFrozenV2Question,
  locale: IntCp004V6Locale,
): IntCp004V6LocalizedQuestion {
  const options = localizedOptions(source, locale);
  const correctAnswer = options[source.correctIndex]?.text;
  if (!correctAnswer) throw new Error(`${source.qlId}/${source.seed}/${locale}: localized correct answer missing.`);
  const lifecycle: IntCp004V6LocalizedLifecycle = {
    permanentQlId: source.qlId,
    maturity: "MULTILINGUAL_LOCALISATION_REVIEW",
    reviewStatus: "LOCALIZED_REVIEW_REQUIRED",
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  };
  return deepFreeze({
    ...source,
    locale,
    language: isHindi(locale) ? "hi" : "pa",
    stem: localizedStem(source, locale),
    options,
    correctAnswer,
    explanation: explanation(source, locale, correctAnswer),
    editorialStatus: "MULTILINGUAL_LOCALISATION_REVIEW",
    approvalStatus: "LOCALIZED_REVIEW_REQUIRED",
    allocationStatus: "INACTIVE_LOCALISATION_REVIEW",
    lifecycle,
    localization: {
      version: INT_CP004_HI_PA_V6_MIGRATION_VERSION,
      canonicalFreezeId: "INT-CP-004-EN-v2-frozen",
      canonicalQlId: source.qlId,
      canonicalSeed: source.seed,
      locale,
      mathematicalStatePreserved: true,
      solutionPreserved: true,
      optionValuesPreserved: true,
      optionOrderPreserved: true,
      correctIndexPreserved: true,
      misconceptionIdsPreserved: true,
      representationPreserved: true,
      stemFamilyPreserved: true,
      formulaFirst: true,
      lifecycleLocked: true,
    },
  });
}

export function generateIntCp004V6LocalizedQuestion(
  qlId: IntCp004EnglishFrozenV2Question["qlId"],
  seed: string,
  locale: IntCp004V6Locale,
): IntCp004V6LocalizedQuestion {
  return localizeIntCp004EnglishV6Question(generateIntCp004EnglishFrozenV2Question(qlId, seed), locale);
}
