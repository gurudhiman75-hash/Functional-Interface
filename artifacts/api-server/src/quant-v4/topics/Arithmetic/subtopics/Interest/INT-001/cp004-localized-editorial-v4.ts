import {
  brokenAmountForState,
  completeAmountForState,
  effectiveAnnualRate,
  periodicRate,
  sub,
  type Cp004Frequency,
} from "./cp004-frequency-math";
import { moneyText, percentText } from "./cp004-frequency-options";
import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import { assertCp004LocalizedText } from "./cp004-localization-language-pack";
import type {
  IntCp004LocalizedExplanation,
  IntCp004LocalizedLocale,
  IntCp004LocalizedOption,
} from "./cp004-localization-types";
import { renderCp004LocalizedEditorialV3Stem } from "./cp004-localized-editorial-v3";

export const INT_CP004_LOCALIZED_EDITORIAL_V4_VERSION = "INT-CP-004-HI-PA-EDITORIAL-v4" as const;

type FactRow = readonly [label: string, value: string];

function years(locale: IntCp004LocalizedLocale, value: number): string {
  return locale === "hi-IN" ? `${value} वर्ष` : `${value} ਸਾਲ`;
}

function months(locale: IntCp004LocalizedLocale, value: number): string {
  if (locale === "hi-IN") return `${value} ${value === 1 ? "महीना" : "महीने"}`;
  return `${value} ${value === 1 ? "ਮਹੀਨਾ" : "ਮਹੀਨੇ"}`;
}

function periodCount(locale: IntCp004LocalizedLocale, count: number, frequency: Cp004Frequency): string {
  if (locale === "hi-IN") {
    switch (frequency) {
      case 1: return `${count} वर्ष`;
      case 2: return `${count} ${count === 1 ? "छमाही" : "छमाहियाँ"}`;
      case 4: return `${count} ${count === 1 ? "तिमाही" : "तिमाहियाँ"}`;
      case 12: return `${count} ${count === 1 ? "महीना" : "महीने"}`;
    }
  }
  switch (frequency) {
    case 1: return `${count} ਸਾਲ`;
    case 2: return `${count} ${count === 1 ? "ਛਿਮਾਹੀ" : "ਛਿਮਾਹੀਆਂ"}`;
    case 4: return `${count} ${count === 1 ? "ਤਿਮਾਹੀ" : "ਤਿਮਾਹੀਆਂ"}`;
    case 12: return `${count} ${count === 1 ? "ਮਹੀਨਾ" : "ਮਹੀਨੇ"}`;
  }
}

function interval(locale: IntCp004LocalizedLocale, frequency: Cp004Frequency): string {
  if (locale === "hi-IN") {
    switch (frequency) {
      case 1: return "हर वर्ष";
      case 2: return "हर छमाही";
      case 4: return "हर तिमाही";
      case 12: return "हर महीने";
    }
  }
  switch (frequency) {
    case 1: return "ਹਰ ਸਾਲ";
    case 2: return "ਹਰ ਛਿਮਾਹੀ";
    case 4: return "ਹਰ ਤਿਮਾਹੀ";
    case 12: return "ਹਰ ਮਹੀਨੇ";
  }
}

function frequencyName(locale: IntCp004LocalizedLocale, frequency: Cp004Frequency): string {
  if (locale === "hi-IN") {
    switch (frequency) {
      case 1: return "वार्षिक";
      case 2: return "छमाही";
      case 4: return "तिमाही";
      case 12: return "मासिक";
    }
  }
  switch (frequency) {
    case 1: return "ਸਾਲਾਨਾ";
    case 2: return "ਛਿਮਾਹੀ";
    case 4: return "ਤਿਮਾਹੀ";
    case 12: return "ਮਾਸਿਕ";
  }
}

function duration(locale: IntCp004LocalizedLocale, periods: number, frequency: Cp004Frequency): string {
  const totalMonths = periods * (12 / frequency);
  return totalMonths % 12 === 0 ? years(locale, totalMonths / 12) : months(locale, totalMonths);
}

function extractNaturalQuestion(source: IntCp004EnglishFrozenQuestion, locale: IntCp004LocalizedLocale): string {
  const rendered = renderCp004LocalizedEditorialV3Stem(source, locale);
  if (source.representation === "STANDARD_PROSE") return rendered.trim();
  const rowPrefix = `| ${source.qlId} |`;
  const row = rendered.split("\n").find((line) => line.trimStart().startsWith(rowPrefix));
  if (!row) throw new Error(`${source.qlId}/${source.seed}/${locale}: editorial-v3 prose row is missing.`);
  return row.slice(row.indexOf(rowPrefix) + rowPrefix.length).replace(/\|\s*$/u, "").trim();
}

function questionPrompt(locale: IntCp004LocalizedLocale, source: IntCp004EnglishFrozenQuestion): string {
  if (locale === "hi-IN") {
    switch (source.qlId) {
      case "INT-QL-067": case "INT-QL-073": case "INT-QL-079": case "INT-QL-084": return "अंतिम राशि ज्ञात कीजिए।";
      case "INT-QL-068": case "INT-QL-074": case "INT-QL-080": case "INT-QL-085": return "चक्रवृद्धि ब्याज ज्ञात कीजिए।";
      case "INT-QL-069": case "INT-QL-070": case "INT-QL-081": return "मूलधन ज्ञात कीजिए।";
      case "INT-QL-071": case "INT-QL-082": return "वार्षिक ब्याज दर ज्ञात कीजिए।";
      case "INT-QL-072": return "निवेश की अवधि ज्ञात कीजिए।";
      case "INT-QL-075": return "दोनों योजनाओं की अंतिम राशियों का अंतर ज्ञात कीजिए।";
      case "INT-QL-076": return "प्रभावी वार्षिक ब्याज दर ज्ञात कीजिए।";
      case "INT-QL-077": return "घोषित वार्षिक ब्याज दर ज्ञात कीजिए।";
      case "INT-QL-078": return "बताइए कि ब्याज वर्ष में कितनी बार जोड़ा गया था।";
      case "INT-QL-083": return "पूरे वर्षों की संख्या ज्ञात कीजिए।";
    }
  }
  switch (source.qlId) {
    case "INT-QL-067": case "INT-QL-073": case "INT-QL-079": case "INT-QL-084": return "ਅੰਤਿਮ ਰਕਮ ਪਤਾ ਲਗਾਓ।";
    case "INT-QL-068": case "INT-QL-074": case "INT-QL-080": case "INT-QL-085": return "ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਪਤਾ ਲਗਾਓ।";
    case "INT-QL-069": case "INT-QL-070": case "INT-QL-081": return "ਮੂਲਧਨ ਪਤਾ ਲਗਾਓ।";
    case "INT-QL-071": case "INT-QL-082": return "ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪਤਾ ਲਗਾਓ।";
    case "INT-QL-072": return "ਨਿਵੇਸ਼ ਦਾ ਸਮਾਂ ਪਤਾ ਲਗਾਓ।";
    case "INT-QL-075": return "ਦੋਵੇਂ ਯੋਜਨਾਵਾਂ ਦੀਆਂ ਅੰਤਿਮ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਪਤਾ ਲਗਾਓ।";
    case "INT-QL-076": return "ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪਤਾ ਲਗਾਓ।";
    case "INT-QL-077": return "ਘੋਸ਼ਿਤ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪਤਾ ਲਗਾਓ।";
    case "INT-QL-078": return "ਦੱਸੋ ਕਿ ਵਿਆਜ ਸਾਲ ਵਿੱਚ ਕਿੰਨੀ ਵਾਰ ਜੋੜਿਆ ਗਿਆ ਸੀ।";
    case "INT-QL-083": return "ਪੂਰੇ ਸਾਲਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਲਗਾਓ।";
  }
}

function facts(locale: IntCp004LocalizedLocale, source: IntCp004EnglishFrozenQuestion): readonly FactRow[] {
  const s = source.mathematicalState;
  const amount = completeAmountForState(s);
  const compoundInterest = sub(amount, s.principal);
  const brokenAmount = brokenAmountForState(s);
  const effectiveRate = effectiveAnnualRate(s.nominalAnnualRatePercent, s.frequency);
  const hi = locale === "hi-IN";
  const principal = hi ? "मूलधन" : "ਮੂਲਧਨ";
  const annualRate = hi ? "वार्षिक ब्याज दर" : "ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ";
  const creditRule = hi ? "ब्याज जोड़ने का नियम" : "ਵਿਆਜ ਜੋੜਨ ਦਾ ਨਿਯਮ";
  const time = hi ? "समय" : "ਸਮਾਂ";
  const finalAmount = hi ? "अंतिम राशि" : "ਅੰਤਿਮ ਰਕਮ";
  const givenInterest = hi ? "दिया गया चक्रवृद्धि ब्याज" : "ਦਿੱਤਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ";
  const perPeriodRate = hi ? "हर बार की ब्याज दर" : "ਹਰ ਵਾਰ ਦੀ ਵਿਆਜ ਦਰ";

  switch (source.qlId) {
    case "INT-QL-067": case "INT-QL-068":
      return [[principal, moneyText(s.principal)], [annualRate, percentText(s.nominalAnnualRatePercent)], [creditRule, interval(locale, s.frequency)], [time, duration(locale, s.periods, s.frequency)]];
    case "INT-QL-069":
      return [[finalAmount, moneyText(amount)], [annualRate, percentText(s.nominalAnnualRatePercent)], [creditRule, interval(locale, s.frequency)], [time, duration(locale, s.periods, s.frequency)]];
    case "INT-QL-070":
      return [[givenInterest, moneyText(compoundInterest)], [annualRate, percentText(s.nominalAnnualRatePercent)], [creditRule, interval(locale, s.frequency)], [time, duration(locale, s.periods, s.frequency)]];
    case "INT-QL-071":
      return [[principal, moneyText(s.principal)], [finalAmount, moneyText(amount)], [creditRule, interval(locale, s.frequency)], [time, duration(locale, s.periods, s.frequency)]];
    case "INT-QL-072":
      return [[principal, moneyText(s.principal)], [finalAmount, moneyText(amount)], [annualRate, percentText(s.nominalAnnualRatePercent)], [creditRule, interval(locale, s.frequency)]];
    case "INT-QL-073": case "INT-QL-074":
      return [[principal, moneyText(s.principal)], [perPeriodRate, percentText(s.periodicRatePercent)], [creditRule, interval(locale, s.frequency)], [hi ? "कुल अवधियाँ" : "ਕੁੱਲ ਵਾਰ", periodCount(locale, s.periods, s.frequency)]];
    case "INT-QL-075":
      return [[principal, moneyText(s.principal)], [annualRate, percentText(s.nominalAnnualRatePercent)], [time, years(locale, s.years)], [hi ? "योजना 1" : "ਯੋਜਨਾ 1", `${frequencyName(locale, s.frequency)} ${hi ? "चक्रवृद्धि" : "ਚੱਕਰਵੱਧੀ"}`], [hi ? "योजना 2" : "ਯੋਜਨਾ 2", `${frequencyName(locale, s.comparisonFrequency)} ${hi ? "चक्रवृद्धि" : "ਚੱਕਰਵੱਧੀ"}`]];
    case "INT-QL-076":
      return [[principal, moneyText(s.principal)], [hi ? "घोषित वार्षिक दर" : "ਘੋਸ਼ਿਤ ਸਾਲਾਨਾ ਦਰ", percentText(s.nominalAnnualRatePercent)], [creditRule, interval(locale, s.frequency)], [time, years(locale, 1)]];
    case "INT-QL-077":
      return [[hi ? "प्रभावी वार्षिक दर" : "ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ", percentText(effectiveRate)], [creditRule, interval(locale, s.frequency)]];
    case "INT-QL-078":
      return [[principal, moneyText(s.principal)], [annualRate, percentText(s.nominalAnnualRatePercent)], [time, years(locale, s.years)], [finalAmount, moneyText(amount)]];
    case "INT-QL-079": case "INT-QL-080":
      return [[principal, moneyText(s.principal)], [annualRate, percentText(s.nominalAnnualRatePercent)], [hi ? "पहला चरण" : "ਪਹਿਲਾ ਪੜਾਅ", `${years(locale, s.fullYears)} ${hi ? "तक वार्षिक चक्रवृद्धि" : "ਤੱਕ ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ"}`], [hi ? "अंतिम चरण" : "ਅੰਤਿਮ ਪੜਾਅ", `${months(locale, s.tailMonths)} ${hi ? "के लिए साधारण ब्याज" : "ਲਈ ਸਧਾਰਣ ਵਿਆਜ"}`]];
    case "INT-QL-081":
      return [[annualRate, percentText(s.nominalAnnualRatePercent)], [hi ? "पहला चरण" : "ਪਹਿਲਾ ਪੜਾਅ", `${years(locale, s.fullYears)} ${hi ? "तक वार्षिक चक्रवृद्धि" : "ਤੱਕ ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ"}`], [hi ? "अंतिम चरण" : "ਅੰਤਿਮ ਪੜਾਅ", `${months(locale, s.tailMonths)} ${hi ? "के लिए साधारण ब्याज" : "ਲਈ ਸਧਾਰਣ ਵਿਆਜ"}`], [finalAmount, moneyText(brokenAmount)]];
    case "INT-QL-082":
      return [[principal, moneyText(s.principal)], [hi ? "पहला चरण" : "ਪਹਿਲਾ ਪੜਾਅ", `${years(locale, s.fullYears)} ${hi ? "तक वार्षिक चक्रवृद्धि" : "ਤੱਕ ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ"}`], [hi ? "अंतिम चरण" : "ਅੰਤਿਮ ਪੜਾਅ", `${months(locale, s.tailMonths)} ${hi ? "के लिए उसी दर से साधारण ब्याज" : "ਲਈ ਉਸੇ ਦਰ ਨਾਲ ਸਧਾਰਣ ਵਿਆਜ"}`], [finalAmount, moneyText(brokenAmount)]];
    case "INT-QL-083":
      return [[principal, moneyText(s.principal)], [annualRate, percentText(s.nominalAnnualRatePercent)], [hi ? "अंतिम अतिरिक्त समय" : "ਅੰਤਿਮ ਵਾਧੂ ਸਮਾਂ", months(locale, s.tailMonths)], [hi ? "अतिरिक्त समय का ब्याज" : "ਵਾਧੂ ਸਮੇਂ ਦਾ ਵਿਆਜ", hi ? "साधारण ब्याज" : "ਸਧਾਰਣ ਵਿਆਜ"], [finalAmount, moneyText(brokenAmount)]];
    case "INT-QL-084": case "INT-QL-085":
      return [[principal, moneyText(s.principal)], [annualRate, percentText(s.nominalAnnualRatePercent)], [hi ? "पहला चरण" : "ਪਹਿਲਾ ਪੜਾਅ", `${years(locale, s.firstYears)}; ${interval(locale, s.firstFrequency)} ${hi ? "ब्याज जोड़ा गया" : "ਵਿਆਜ ਜੋੜਿਆ ਗਿਆ"}`], [hi ? "दूसरा चरण" : "ਦੂਜਾ ਪੜਾਅ", `${years(locale, s.secondYears)}; ${interval(locale, s.secondFrequency)} ${hi ? "ब्याज जोड़ा गया" : "ਵਿਆਜ ਜੋੜਿਆ ਗਿਆ"}`]];
  }
}

function table(headers: readonly [string, string], rows: readonly FactRow[]): string {
  return [`| ${headers[0]} | ${headers[1]} |`, "|---|---|", ...rows.map(([label, value]) => `| ${label} | ${value} |`)].join("\n");
}

function domainIntro(locale: IntCp004LocalizedLocale, source: IntCp004EnglishFrozenQuestion, representation: "TERMS_TABLE" | "BALANCE_RECORD" | "SCHEME_COMPARISON"): string {
  const broken = ["INT-QL-079", "INT-QL-080", "INT-QL-081", "INT-QL-082", "INT-QL-083"].includes(source.qlId);
  const phased = ["INT-QL-084", "INT-QL-085"].includes(source.qlId);
  const effective = ["INT-QL-076", "INT-QL-077", "INT-QL-078"].includes(source.qlId);
  if (locale === "hi-IN") {
    if (representation === "TERMS_TABLE") {
      if (broken) return "निवेश की समय-संबंधी शर्तें नीचे दी गई हैं।";
      if (phased) return "दो चरणों वाली ब्याज योजना की शर्तें नीचे दी गई हैं।";
      if (effective) return "ब्याज योजना का आवश्यक विवरण नीचे दिया गया है।";
      return "निवेश की शर्तें नीचे दी गई हैं।";
    }
    if (representation === "BALANCE_RECORD") {
      if (broken || phased) return "खाते में दर्ज ब्याज-क्रम को ध्यान से पढ़िए।";
      return "खाते में दर्ज जानकारी के आधार पर प्रश्न हल कीजिए।";
    }
    if (source.qlId === "INT-QL-075") return "एक ही निवेश के लिए बैंक की दो योजनाएँ नीचे दी गई हैं।";
    if (phased) return "इस निवेश में ब्याज जोड़ने का नियम बीच में बदलता है।";
    if (effective) return "बैंक द्वारा दी गई ब्याज योजना का सार नीचे है।";
    return "बैंक की ब्याज योजना का सार नीचे दिया गया है।";
  }
  if (representation === "TERMS_TABLE") {
    if (broken) return "ਨਿਵੇਸ਼ ਨਾਲ ਸੰਬੰਧਿਤ ਸਮੇਂ ਦੀਆਂ ਸ਼ਰਤਾਂ ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਹਨ।";
    if (phased) return "ਦੋ ਪੜਾਵਾਂ ਵਾਲੀ ਵਿਆਜ ਯੋਜਨਾ ਦੀਆਂ ਸ਼ਰਤਾਂ ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਹਨ।";
    if (effective) return "ਵਿਆਜ ਯੋਜਨਾ ਦਾ ਲੋੜੀਂਦਾ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਹੈ।";
    return "ਨਿਵੇਸ਼ ਦੀਆਂ ਸ਼ਰਤਾਂ ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਹਨ।";
  }
  if (representation === "BALANCE_RECORD") {
    if (broken || phased) return "ਖਾਤੇ ਵਿੱਚ ਦਰਜ ਵਿਆਜ-ਕ੍ਰਮ ਨੂੰ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ।";
    return "ਖਾਤੇ ਵਿੱਚ ਦਰਜ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਉੱਤੇ ਪ੍ਰਸ਼ਨ ਹੱਲ ਕਰੋ।";
  }
  if (source.qlId === "INT-QL-075") return "ਇੱਕੋ ਨਿਵੇਸ਼ ਲਈ ਬੈਂਕ ਦੀਆਂ ਦੋ ਯੋਜਨਾਵਾਂ ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਹਨ।";
  if (phased) return "ਇਸ ਨਿਵੇਸ਼ ਵਿੱਚ ਵਿਆਜ ਜੋੜਨ ਦਾ ਨਿਯਮ ਵਿਚਕਾਰ ਬਦਲਦਾ ਹੈ।";
  if (effective) return "ਬੈਂਕ ਵੱਲੋਂ ਦਿੱਤੀ ਵਿਆਜ ਯੋਜਨਾ ਦਾ ਸਾਰ ਹੇਠਾਂ ਹੈ।";
  return "ਬੈਂਕ ਦੀ ਵਿਆਜ ਯੋਜਨਾ ਦਾ ਸਾਰ ਹੇਠਾਂ ਦਿੱਤਾ ਹੈ।";
}

function renderTermsTable(locale: IntCp004LocalizedLocale, source: IntCp004EnglishFrozenQuestion): string {
  const hi = locale === "hi-IN";
  return `${domainIntro(locale, source, "TERMS_TABLE")}\n\n${table(
    hi ? ["दी गई जानकारी", "मान"] : ["ਦਿੱਤੀ ਜਾਣਕਾਰੀ", "ਮੁੱਲ"],
    facts(locale, source),
  )}\n\n**${hi ? "ज्ञात कीजिए" : "ਪਤਾ ਲਗਾਓ"}:** ${questionPrompt(locale, source)}`;
}

function renderBalanceRecord(locale: IntCp004LocalizedLocale, source: IntCp004EnglishFrozenQuestion): string {
  const hi = locale === "hi-IN";
  const rows = facts(locale, source).map(([label, value], index) => [
    index === 0 ? (hi ? "आरंभिक प्रविष्टि" : "ਸ਼ੁਰੂਆਤੀ ਦਰਜ") : label,
    value,
  ] as const);
  return `${domainIntro(locale, source, "BALANCE_RECORD")}\n\n${table(
    hi ? ["खाते की प्रविष्टि", "दर्ज विवरण"] : ["ਖਾਤੇ ਦੀ ਦਰਜ", "ਦਰਜ ਵੇਰਵਾ"],
    rows,
  )}\n\n**${hi ? "प्रश्न" : "ਪ੍ਰਸ਼ਨ"}:** ${questionPrompt(locale, source)}`;
}

function renderScheme(locale: IntCp004LocalizedLocale, source: IntCp004EnglishFrozenQuestion): string {
  const hi = locale === "hi-IN";
  const rows = facts(locale, source);
  const headers: readonly [string, string] = source.qlId === "INT-QL-075"
    ? (hi ? ["योजना/शर्त", "विवरण"] : ["ਯੋਜਨਾ/ਸ਼ਰਤ", "ਵੇਰਵਾ"])
    : (hi ? ["योजना की शर्त", "विवरण"] : ["ਯੋਜਨਾ ਦੀ ਸ਼ਰਤ", "ਵੇਰਵਾ"]);
  return `${domainIntro(locale, source, "SCHEME_COMPARISON")}\n\n${table(headers, rows)}\n\n**${hi ? "पूछा गया" : "ਪੁੱਛਿਆ ਗਿਆ"}:** ${questionPrompt(locale, source)}`;
}

export function renderCp004LocalizedEditorialV4Stem(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): string {
  const prose = extractNaturalQuestion(source, locale);
  let stem: string;
  switch (source.representation) {
    case "STANDARD_PROSE": stem = prose; break;
    case "TERMS_TABLE": stem = renderTermsTable(locale, source); break;
    case "BALANCE_RECORD": stem = renderBalanceRecord(locale, source); break;
    case "SCHEME_COMPARISON": stem = renderScheme(locale, source); break;
  }
  assertCp004LocalizedText(locale, stem, `${source.qlId}/${source.seed}/${locale}/editorial-v4-stem`);
  return stem;
}

function correctFeedback(source: IntCp004EnglishFrozenQuestion, option: IntCp004LocalizedOption, locale: IntCp004LocalizedLocale): string {
  const s = source.mathematicalState;
  const rate = periodicRate(s.nominalAnnualRatePercent, s.frequency);
  const count = periodCount(locale, s.periods, s.frequency);
  const every = interval(locale, s.frequency);
  const hi = locale === "hi-IN";
  switch (source.qlId) {
    case "INT-QL-067": return hi ? `सही। ${every} की दर ${percentText(rate)} और कुल ${count} लेने पर राशि ${option.text} आती है।` : `ਸਹੀ। ${every} ਦੀ ਦਰ ${percentText(rate)} ਅਤੇ ਕੁੱਲ ${count} ਲੈਣ ਉੱਤੇ ਰਕਮ ${option.text} ਆਉਂਦੀ ਹੈ।`;
    case "INT-QL-068": return hi ? `सही। कुल राशि में से मूलधन घटाने पर चक्रवृद्धि ब्याज ${option.text} मिलता है।` : `ਸਹੀ। ਕੁੱਲ ਰਕਮ ਵਿੱਚੋਂ ਮੂਲਧਨ ਘਟਾਉਣ ਉੱਤੇ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ${option.text} ਮਿਲਦਾ ਹੈ।`;
    case "INT-QL-069": case "INT-QL-070": case "INT-QL-081": return hi ? `सही। दी गई राशि या ब्याज से पूरा वृद्धि-गुणक हटाने पर मूलधन ${option.text} मिलता है।` : `ਸਹੀ। ਦਿੱਤੀ ਰਕਮ ਜਾਂ ਵਿਆਜ ਵਿੱਚੋਂ ਪੂਰਾ ਵਾਧਾ-ਗੁਣਕ ਹਟਾਉਣ ਉੱਤੇ ਮੂਲਧਨ ${option.text} ਮਿਲਦਾ ਹੈ।`;
    case "INT-QL-071": case "INT-QL-077": case "INT-QL-082": return hi ? `सही। इस दर को प्रश्न में दिए ब्याज-नियम से जाँचने पर सभी आंकड़े मेल खाते हैं; दर ${option.text} है।` : `ਸਹੀ। ਇਸ ਦਰ ਨੂੰ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੇ ਵਿਆਜ-ਨਿਯਮ ਨਾਲ ਜਾਂਚਣ ਉੱਤੇ ਸਾਰੇ ਅੰਕ ਮਿਲਦੇ ਹਨ; ਦਰ ${option.text} ਹੈ।`;
    case "INT-QL-072": case "INT-QL-083": return hi ? `सही। दिए गए वृद्धि-गुणक तक पहुँचने के लिए आवश्यक समय ${option.text} है।` : `ਸਹੀ। ਦਿੱਤੇ ਵਾਧਾ-ਗੁਣਕ ਤੱਕ ਪਹੁੰਚਣ ਲਈ ਲੋੜੀਂਦਾ ਸਮਾਂ ${option.text} ਹੈ।`;
    case "INT-QL-073": return hi ? `सही। ${percentText(s.periodicRatePercent)} की दर को कुल ${count} बार लगाने पर राशि ${option.text} बनती है।` : `ਸਹੀ। ${percentText(s.periodicRatePercent)} ਦੀ ਦਰ ਕੁੱਲ ${count} ਵਾਰ ਲਗਾਉਣ ਉੱਤੇ ਰਕਮ ${option.text} ਬਣਦੀ ਹੈ।`;
    case "INT-QL-074": return hi ? `सही। पहले कुल राशि निकालकर मूलधन घटाने पर ब्याज ${option.text} मिलता है।` : `ਸਹੀ। ਪਹਿਲਾਂ ਕੁੱਲ ਰਕਮ ਕੱਢ ਕੇ ਮੂਲਧਨ ਘਟਾਉਣ ਉੱਤੇ ਵਿਆਜ ${option.text} ਮਿਲਦਾ ਹੈ।`;
    case "INT-QL-075": return hi ? `सही। दोनों योजनाओं की राशियाँ अलग-अलग निकालने पर उनका अंतर ${option.text} है।` : `ਸਹੀ। ਦੋਵੇਂ ਯੋਜਨਾਵਾਂ ਦੀਆਂ ਰਕਮਾਂ ਵੱਖ-ਵੱਖ ਕੱਢਣ ਉੱਤੇ ਉਨ੍ਹਾਂ ਦਾ ਅੰਤਰ ${option.text} ਹੈ।`;
    case "INT-QL-076": return hi ? `सही। एक वर्ष के सभी चक्रवृद्धि चरण शामिल करने पर प्रभावी दर ${option.text} होती है।` : `ਸਹੀ। ਇੱਕ ਸਾਲ ਦੇ ਸਾਰੇ ਚੱਕਰਵੱਧੀ ਪੜਾਅ ਸ਼ਾਮਲ ਕਰਨ ਉੱਤੇ ਪ੍ਰਭਾਵੀ ਦਰ ${option.text} ਹੁੰਦੀ ਹੈ।`;
    case "INT-QL-078": return hi ? `सही। ${option.text} ब्याज-क्रम से गणना करने पर दी गई अंतिम राशि ठीक प्राप्त होती है।` : `ਸਹੀ। ${option.text} ਵਿਆਜ-ਕ੍ਰਮ ਨਾਲ ਗਿਣਤੀ ਕਰਨ ਉੱਤੇ ਦਿੱਤੀ ਅੰਤਿਮ ਰਕਮ ਠੀਕ ਮਿਲਦੀ ਹੈ।`;
    case "INT-QL-079": return hi ? `सही। पूरे वर्षों की चक्रवृद्धि राशि पर अंतिम महीनों का साधारण ब्याज जोड़ने से ${option.text} मिलता है।` : `ਸਹੀ। ਪੂਰੇ ਸਾਲਾਂ ਦੀ ਚੱਕਰਵੱਧੀ ਰਕਮ ਉੱਤੇ ਅੰਤਿਮ ਮਹੀਨਿਆਂ ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਜੋੜਨ ਨਾਲ ${option.text} ਮਿਲਦਾ ਹੈ।`;
    case "INT-QL-080": return hi ? `सही। मिश्रित अवधि की अंतिम राशि में से मूलधन घटाने पर कुल ब्याज ${option.text} है।` : `ਸਹੀ। ਮਿਲੀ-ਜੁਲੀ ਮਿਆਦ ਦੀ ਅੰਤਿਮ ਰਕਮ ਵਿੱਚੋਂ ਮੂਲਧਨ ਘਟਾਉਣ ਉੱਤੇ ਕੁੱਲ ਵਿਆਜ ${option.text} ਹੈ।`;
    case "INT-QL-084": return hi ? `सही। पहले और दूसरे चरण के अलग-अलग ब्याज-नियम क्रम से लगाने पर राशि ${option.text} बनती है।` : `ਸਹੀ। ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਪੜਾਅ ਦੇ ਵੱਖ-ਵੱਖ ਵਿਆਜ-ਨਿਯਮ ਕ੍ਰਮ ਨਾਲ ਲਗਾਉਣ ਉੱਤੇ ਰਕਮ ${option.text} ਬਣਦੀ ਹੈ।`;
    case "INT-QL-085": return hi ? `सही। दोनों चरणों के बाद बनी राशि में से मूलधन घटाने पर ब्याज ${option.text} है।` : `ਸਹੀ। ਦੋਵੇਂ ਪੜਾਵਾਂ ਤੋਂ ਬਾਅਦ ਬਣੀ ਰਕਮ ਵਿੱਚੋਂ ਮੂਲਧਨ ਘਟਾਉਣ ਉੱਤੇ ਵਿਆਜ ${option.text} ਹੈ।`;
  }
}

function wrongFeedback(source: IntCp004EnglishFrozenQuestion, option: IntCp004LocalizedOption, locale: IntCp004LocalizedLocale): string {
  const s = source.mathematicalState;
  const hi = locale === "hi-IN";
  const rate = periodicRate(s.nominalAnnualRatePercent, s.frequency);
  const count = periodCount(locale, s.periods, s.frequency);
  const oneLess = periodCount(locale, Math.max(0, s.periods - 1), s.frequency);
  const oneMore = periodCount(locale, s.periods + 1, s.frequency);
  const frequency = frequencyName(locale, s.frequency);
  const first = frequencyName(locale, s.firstFrequency);
  const second = frequencyName(locale, s.secondFrequency);

  switch (option.misconceptionId) {
    case "USED_SIMPLE_INTEREST": return hi ? `यह परिणाम साधारण ब्याज लगाने से आता है। यहाँ ${percentText(rate)} की दर से कुल ${count} चक्रवृद्धि करनी है।` : `ਇਹ ਨਤੀਜਾ ਸਧਾਰਣ ਵਿਆਜ ਲਗਾਉਣ ਨਾਲ ਆਉਂਦਾ ਹੈ। ਇੱਥੇ ${percentText(rate)} ਦੀ ਦਰ ਨਾਲ ਕੁੱਲ ${count} ਚੱਕਰਵੱਧੀ ਕਰਨੀ ਹੈ।`;
    case "MISSED_ONE_PERIOD": case "ONE_PERIOD_SHORT": return hi ? `इसमें केवल ${oneLess} लिए गए हैं, जबकि प्रश्न में कुल ${count} हैं।` : `ਇਸ ਵਿੱਚ ਕੇਵਲ ${oneLess} ਲਏ ਗਏ ਹਨ, ਜਦਕਿ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਕੁੱਲ ${count} ਹਨ।`;
    case "ONE_PERIOD_EXTRA": case "ADDED_ONE_CREDITING_PERIOD": return hi ? `इसमें ${oneMore} ले लिए गए हैं, जबकि सही गणना में केवल ${count} हैं।` : `ਇਸ ਵਿੱਚ ${oneMore} ਲੈ ਲਏ ਗਏ ਹਨ, ਜਦਕਿ ਸਹੀ ਗਿਣਤੀ ਵਿੱਚ ਕੇਵਲ ${count} ਹਨ।`;
    case "RETURNED_PRINCIPAL": return hi ? "यह केवल मूलधन है। प्रश्न में ब्याज जुड़ने के बाद की राशि चाहिए।" : "ਇਹ ਕੇਵਲ ਮੂਲਧਨ ਹੈ। ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਵਿਆਜ ਜੁੜਨ ਤੋਂ ਬਾਅਦ ਦੀ ਰਕਮ ਚਾਹੀਦੀ ਹੈ।";
    case "RETURNED_AMOUNT": case "RETURNED_FINAL_AMOUNT": return hi ? "यह अंतिम राशि है; प्रश्न केवल अर्जित चक्रवृद्धि ब्याज पूछता है, इसलिए मूलधन घटाना होगा।" : "ਇਹ ਅੰਤਿਮ ਰਕਮ ਹੈ; ਪ੍ਰਸ਼ਨ ਕੇਵਲ ਕਮਾਇਆ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਪੁੱਛਦਾ ਹੈ, ਇਸ ਲਈ ਮੂਲਧਨ ਘਟਾਉਣਾ ਪਵੇਗਾ।";
    case "REMOVED_ONLY_ONE_PERIOD": return hi ? `अंतिम राशि से केवल एक अवधि का गुणक हटाया गया है; पूरे ${count} का गुणक हटाना होगा।` : `ਅੰਤਿਮ ਰਕਮ ਵਿੱਚੋਂ ਕੇਵਲ ਇੱਕ ਮਿਆਦ ਦਾ ਗੁਣਕ ਹਟਾਇਆ ਗਿਆ ਹੈ; ਪੂਰੇ ${count} ਦਾ ਗੁਣਕ ਹਟਾਉਣਾ ਪਵੇਗਾ।`;
    case "RETURNED_GIVEN_INTEREST": return hi ? "यह वही ब्याज है जो प्रश्न में दिया गया है; इससे मूलधन निकालना अभी बाकी है।" : "ਇਹ ਉਹੀ ਵਿਆਜ ਹੈ ਜੋ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤਾ ਹੈ; ਇਸ ਤੋਂ ਮੂਲਧਨ ਕੱਢਣਾ ਹਾਲੇ ਬਾਕੀ ਹੈ।";
    case "USED_SIMPLE_INTEREST_INVERSE": case "REVERSED_SIMPLE_INTEREST": return hi ? "पीछे की गणना साधारण ब्याज से की गई है। दी गई वृद्धि चक्रवृद्धि है, इसलिए पूरा चक्रवृद्धि गुणक हटाइए।" : "ਪਿੱਛੇ ਦੀ ਗਿਣਤੀ ਸਧਾਰਣ ਵਿਆਜ ਨਾਲ ਕੀਤੀ ਗਈ ਹੈ। ਦਿੱਤਾ ਵਾਧਾ ਚੱਕਰਵੱਧੀ ਹੈ, ਇਸ ਲਈ ਪੂਰਾ ਚੱਕਰਵੱਧੀ ਗੁਣਕ ਹਟਾਓ।";
    case "TREATED_INTEREST_AS_AMOUNT": return hi ? "दिए गए चक्रवृद्धि ब्याज को अंतिम राशि मान लिया गया है। ब्याज और कुल राशि अलग राशियाँ हैं।" : "ਦਿੱਤੇ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਨੂੰ ਅੰਤਿਮ ਰਕਮ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ। ਵਿਆਜ ਅਤੇ ਕੁੱਲ ਰਕਮ ਵੱਖ ਰਕਮਾਂ ਹਨ।";
    case "USED_SIMPLE_RATE": return hi ? `कुल वृद्धि को साधारण ब्याज मान लिया गया है। ${frequency} चक्रवृद्धि के हर चरण का प्रभाव लेना होगा।` : `ਕੁੱਲ ਵਾਧੇ ਨੂੰ ਸਧਾਰਣ ਵਿਆਜ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ। ${frequency} ਚੱਕਰਵੱਧੀ ਦੇ ਹਰ ਪੜਾਅ ਦਾ ਅਸਰ ਲੈਣਾ ਪਵੇਗਾ।`;
    case "DIVIDED_BY_TOTAL_PERIODS": return hi ? "कुल वृद्धि को अवधियों की संख्या से सीधे बाँटना सही नहीं है; चक्रवृद्धि में गुणक क्रम से बढ़ते हैं।" : "ਕੁੱਲ ਵਾਧੇ ਨੂੰ ਮਿਆਦਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਸਿੱਧਾ ਵੰਡਣਾ ਠੀਕ ਨਹੀਂ; ਚੱਕਰਵੱਧੀ ਵਿੱਚ ਗੁਣਕ ਕ੍ਰਮ ਨਾਲ ਵਧਦੇ ਹਨ।";
    case "MULTIPLIED_PERIODS_BY_FREQUENCY": return hi ? `अवधियों की संख्या पहले ही ${count} है; इसे ब्याज जोड़ने की आवृत्ति से दोबारा गुणा न करें।` : `ਮਿਆਦਾਂ ਦੀ ਗਿਣਤੀ ਪਹਿਲਾਂ ਹੀ ${count} ਹੈ; ਇਸ ਨੂੰ ਵਿਆਜ ਜੋੜਨ ਦੀ ਗਿਣਤੀ ਨਾਲ ਦੁਬਾਰਾ ਗੁਣਾ ਨਾ ਕਰੋ।`;
    case "ASSUMED_NO_FREQUENCY_EFFECT": return hi ? `ब्याज जोड़ने की आवृत्ति को अनदेखा किया गया है। ${frequency} चक्रवृद्धि में वार्षिक दर को उसी अनुसार बाँटना पड़ता है।` : `ਵਿਆਜ ਜੋੜਨ ਦੀ ਗਿਣਤੀ ਨੂੰ ਅਣਡਿੱਠਾ ਕੀਤਾ ਗਿਆ ਹੈ। ${frequency} ਚੱਕਰਵੱਧੀ ਵਿੱਚ ਸਾਲਾਨਾ ਦਰ ਨੂੰ ਉਸੇ ਅਨੁਸਾਰ ਵੰਡਣਾ ਪੈਂਦਾ ਹੈ।`;
    case "RETURNED_PERIOD_RATE": case "RETURNED_MONTHLY_RATE": case "RETURNED_TAIL_PERIOD_RATE": return hi ? `यह केवल एक बार की दर ${percentText(rate)} है; प्रश्न पूरे वर्ष की दर पूछता है।` : `ਇਹ ਕੇਵਲ ਇੱਕ ਵਾਰ ਦੀ ਦਰ ${percentText(rate)} ਹੈ; ਪ੍ਰਸ਼ਨ ਪੂਰੇ ਸਾਲ ਦੀ ਦਰ ਪੁੱਛਦਾ ਹੈ।`;
    case "RETURNED_ONE_AMOUNT": return hi ? "यह केवल एक योजना की राशि है। प्रश्न दोनों योजनाओं की राशियों का अंतर पूछता है।" : "ਇਹ ਕੇਵਲ ਇੱਕ ਯੋਜਨਾ ਦੀ ਰਕਮ ਹੈ। ਪ੍ਰਸ਼ਨ ਦੋਵੇਂ ਯੋਜਨਾਵਾਂ ਦੀਆਂ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਪੁੱਛਦਾ ਹੈ।";
    case "RETURNED_NOMINAL_RATE": return hi ? "यह घोषित वार्षिक दर है। प्रभावी दर में वर्ष के भीतर होने वाली सभी चक्रवृद्धियाँ शामिल होती हैं।" : "ਇਹ ਘੋਸ਼ਿਤ ਸਾਲਾਨਾ ਦਰ ਹੈ। ਪ੍ਰਭਾਵੀ ਦਰ ਵਿੱਚ ਸਾਲ ਦੇ ਅੰਦਰ ਹੋਣ ਵਾਲੀਆਂ ਸਾਰੀਆਂ ਚੱਕਰਵੱਧੀਆਂ ਸ਼ਾਮਲ ਹੁੰਦੀਆਂ ਹਨ।";
    case "RETURNED_EFFECTIVE_RATE": return hi ? "यह प्रश्न में दी गई प्रभावी दर है; इससे घोषित वार्षिक दर निकालनी है।" : "ਇਹ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀ ਪ੍ਰਭਾਵੀ ਦਰ ਹੈ; ਇਸ ਤੋਂ ਘੋਸ਼ਿਤ ਸਾਲਾਨਾ ਦਰ ਕੱਢਣੀ ਹੈ।";
    case "MULTIPLIED_EFFECTIVE_RATE": return hi ? "प्रभावी दर को ब्याज जोड़ने की संख्या से गुणा नहीं किया जाता; सही वार्षिक दर को चक्रवृद्धि समीकरण से जाँचें।" : "ਪ੍ਰਭਾਵੀ ਦਰ ਨੂੰ ਵਿਆਜ ਜੋੜਨ ਦੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਨਹੀਂ ਕੀਤਾ ਜਾਂਦਾ; ਸਹੀ ਸਾਲਾਨਾ ਦਰ ਨੂੰ ਚੱਕਰਵੱਧੀ ਸਮੀਕਰਨ ਨਾਲ ਜਾਂਚੋ।";
    case "ASSUMED_1_PER_YEAR": return hi ? "यह वार्षिक चक्रवृद्धि मानने पर आता है, लेकिन दी गई राशि उस ब्याज-क्रम से मेल नहीं खाती।" : "ਇਹ ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਮੰਨਣ ਉੱਤੇ ਆਉਂਦਾ ਹੈ, ਪਰ ਦਿੱਤੀ ਰਕਮ ਉਸ ਵਿਆਜ-ਕ੍ਰਮ ਨਾਲ ਨਹੀਂ ਮਿਲਦੀ।";
    case "ASSUMED_2_PER_YEAR": return hi ? "यह छमाही चक्रवृद्धि मानने पर आता है, लेकिन दी गई अंतिम राशि अलग है।" : "ਇਹ ਛਿਮਾਹੀ ਚੱਕਰਵੱਧੀ ਮੰਨਣ ਉੱਤੇ ਆਉਂਦਾ ਹੈ, ਪਰ ਦਿੱਤੀ ਅੰਤਿਮ ਰਕਮ ਵੱਖ ਹੈ।";
    case "ASSUMED_4_PER_YEAR": return hi ? "यह तिमाही चक्रवृद्धि मानने पर आता है, लेकिन दी गई अंतिम राशि से मेल नहीं खाता।" : "ਇਹ ਤਿਮਾਹੀ ਚੱਕਰਵੱਧੀ ਮੰਨਣ ਉੱਤੇ ਆਉਂਦਾ ਹੈ, ਪਰ ਦਿੱਤੀ ਅੰਤਿਮ ਰਕਮ ਨਾਲ ਨਹੀਂ ਮਿਲਦਾ।";
    case "ASSUMED_12_PER_YEAR": return hi ? "यह मासिक चक्रवृद्धि मानने पर आता है, लेकिन प्रश्न की अंतिम राशि इससे नहीं बनती।" : "ਇਹ ਮਾਸਿਕ ਚੱਕਰਵੱਧੀ ਮੰਨਣ ਉੱਤੇ ਆਉਂਦਾ ਹੈ, ਪਰ ਪ੍ਰਸ਼ਨ ਦੀ ਅੰਤਿਮ ਰਕਮ ਇਸ ਨਾਲ ਨਹੀਂ ਬਣਦੀ।";
    case "IGNORED_TAIL": return hi ? `पूरे वर्षों के बाद के ${months(locale, s.tailMonths)} छोड़ दिए गए हैं; इन महीनों का साधारण ब्याज भी जोड़ना है।` : `ਪੂਰੇ ਸਾਲਾਂ ਤੋਂ ਬਾਅਦ ਦੇ ${months(locale, s.tailMonths)} ਛੱਡ ਦਿੱਤੇ ਹਨ; ਇਨ੍ਹਾਂ ਮਹੀਨਿਆਂ ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਵੀ ਜੋੜਨਾ ਹੈ।`;
    case "TAIL_INTEREST_ON_ORIGINAL_PRINCIPAL": return hi ? `अंतिम ${months(locale, s.tailMonths)} का ब्याज मूलधन पर नहीं, पूरे वर्षों के बाद बनी राशि पर लगेगा।` : `ਅੰਤਿਮ ${months(locale, s.tailMonths)} ਦਾ ਵਿਆਜ ਮੂਲਧਨ ਉੱਤੇ ਨਹੀਂ, ਪੂਰੇ ਸਾਲਾਂ ਤੋਂ ਬਾਅਦ ਬਣੀ ਰਕਮ ਉੱਤੇ ਲੱਗੇਗਾ।`;
    case "COMPOUNDED_TAIL_MONTHLY": return hi ? `अंतिम ${months(locale, s.tailMonths)} के लिए प्रश्न साधारण ब्याज कहता है; उन्हें मासिक चक्रवृद्धि न मानें।` : `ਅੰਤਿਮ ${months(locale, s.tailMonths)} ਲਈ ਪ੍ਰਸ਼ਨ ਸਧਾਰਣ ਵਿਆਜ ਕਹਿੰਦਾ ਹੈ; ਉਨ੍ਹਾਂ ਨੂੰ ਮਾਸਿਕ ਚੱਕਰਵੱਧੀ ਨਾ ਮੰਨੋ।`;
    case "SUBTRACTED_TAIL_FROM_FINAL_AMOUNT": return hi ? "अंतिम महीनों का ब्याज सीधे अंतिम राशि से घटाना पर्याप्त नहीं; पहले पूरे वर्षों का चक्रवृद्धि गुणक भी हटाना होगा।" : "ਅੰਤਿਮ ਮਹੀਨਿਆਂ ਦਾ ਵਿਆਜ ਸਿੱਧਾ ਅੰਤਿਮ ਰਕਮ ਵਿੱਚੋਂ ਘਟਾਉਣਾ ਕਾਫ਼ੀ ਨਹੀਂ; ਪਹਿਲਾਂ ਪੂਰੇ ਸਾਲਾਂ ਦਾ ਚੱਕਰਵੱਧੀ ਗੁਣਕ ਵੀ ਹਟਾਉਣਾ ਪਵੇਗਾ।";
    case "IGNORED_COMPLETE_YEARS": return hi ? `केवल अंतिम ${months(locale, s.tailMonths)} लिए गए हैं; उससे पहले के पूरे वर्षों की चक्रवृद्धि भी शामिल करनी है।` : `ਕੇਵਲ ਅੰਤਿਮ ${months(locale, s.tailMonths)} ਲਏ ਹਨ; ਇਸ ਤੋਂ ਪਹਿਲਾਂ ਦੇ ਪੂਰੇ ਸਾਲਾਂ ਦੀ ਚੱਕਰਵੱਧੀ ਵੀ ਸ਼ਾਮਲ ਕਰਨੀ ਹੈ।`;
    case "ONE_YEAR_EXTRA": return hi ? "गणना में एक पूरा वर्ष अधिक ले लिया गया है। प्रश्न में दिए अंतिम अतिरिक्त महीनों को अलग साधारण ब्याज से लेना है।" : "ਗਿਣਤੀ ਵਿੱਚ ਇੱਕ ਪੂਰਾ ਸਾਲ ਵੱਧ ਲੈ ਲਿਆ ਹੈ। ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੇ ਅੰਤਿਮ ਵਾਧੂ ਮਹੀਨਿਆਂ ਨੂੰ ਵੱਖ ਸਧਾਰਣ ਵਿਆਜ ਨਾਲ ਲੈਣਾ ਹੈ।";
    case "COUNTED_TAIL_AS_EXTRA_YEARS": return hi ? `अंतिम ${months(locale, s.tailMonths)} को पूरे वर्ष मान लिया गया है; यह केवल वर्ष का एक भाग है।` : `ਅੰਤਿਮ ${months(locale, s.tailMonths)} ਨੂੰ ਪੂਰਾ ਸਾਲ ਮੰਨ ਲਿਆ ਹੈ; ਇਹ ਕੇਵਲ ਸਾਲ ਦਾ ਇੱਕ ਹਿੱਸਾ ਹੈ।`;
    case "USED_SIMPLE_INTEREST_THROUGHOUT": return hi ? "पूरी अवधि पर साधारण ब्याज लगाया गया है। पहले पूरे वर्षों के लिए चक्रवृद्धि और केवल अंतिम महीनों के लिए साधारण ब्याज लगना चाहिए।" : "ਪੂਰੇ ਸਮੇਂ ਉੱਤੇ ਸਧਾਰਣ ਵਿਆਜ ਲਗਾਇਆ ਗਿਆ ਹੈ। ਪਹਿਲਾਂ ਪੂਰੇ ਸਾਲਾਂ ਲਈ ਚੱਕਰਵੱਧੀ ਅਤੇ ਕੇਵਲ ਅੰਤਿਮ ਮਹੀਨਿਆਂ ਲਈ ਸਧਾਰਣ ਵਿਆਜ ਲੱਗਣਾ ਚਾਹੀਦਾ ਹੈ।";
    case "USED_FIRST_FREQUENCY_THROUGHOUT": return hi ? `पहले चरण का ${first} नियम पूरी अवधि पर लगा दिया गया है; दूसरे चरण में ${second} नियम लागू होगा।` : `ਪਹਿਲੇ ਪੜਾਅ ਦਾ ${first} ਨਿਯਮ ਪੂਰੇ ਸਮੇਂ ਉੱਤੇ ਲਗਾ ਦਿੱਤਾ ਹੈ; ਦੂਜੇ ਪੜਾਅ ਵਿੱਚ ${second} ਨਿਯਮ ਲਾਗੂ ਹੋਵੇਗਾ।`;
    case "USED_SECOND_FREQUENCY_THROUGHOUT": return hi ? `दूसरे चरण का ${second} नियम पूरी अवधि पर लगा दिया गया है; पहले चरण में ${first} नियम लागू होगा।` : `ਦੂਜੇ ਪੜਾਅ ਦਾ ${second} ਨਿਯਮ ਪੂਰੇ ਸਮੇਂ ਉੱਤੇ ਲਗਾ ਦਿੱਤਾ ਹੈ; ਪਹਿਲੇ ਪੜਾਅ ਵਿੱਚ ${first} ਨਿਯਮ ਲਾਗੂ ਹੋਵੇਗਾ।`;
    default: return hi ? `यह विकल्प ${option.text} प्रश्न में दिए सभी ब्याज-चरणों को सही क्रम में लागू नहीं करता।` : `ਇਹ ਚੋਣ ${option.text} ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੇ ਸਾਰੇ ਵਿਆਜ-ਪੜਾਵਾਂ ਨੂੰ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਲਾਗੂ ਨਹੀਂ ਕਰਦੀ।`;
  }
}

export function remediateCp004LocalizedOptionsV4(
  source: IntCp004EnglishFrozenQuestion,
  options: readonly IntCp004LocalizedOption[],
  locale: IntCp004LocalizedLocale,
): readonly IntCp004LocalizedOption[] {
  return Object.freeze(options.map((option) => Object.freeze({
    ...option,
    feedback: option.isCorrect ? correctFeedback(source, option, locale) : wrongFeedback(source, option, locale),
  })));
}

function cleanAnswer(locale: IntCp004LocalizedLocale, finalAnswer: string): string {
  if (locale === "hi-IN") {
    return finalAnswer.replace(/^अतः सही उत्तर\s*/u, "").replace(/^सही उत्तर\s*/u, "").replace(/\s*है।$/u, "").replace(/।$/u, "").trim();
  }
  return finalAnswer.replace(/^ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ\s*/u, "").replace(/^ਸਹੀ ਉੱਤਰ\s*/u, "").replace(/\s*ਹੈ।$/u, "").replace(/।$/u, "").trim();
}

function finalAnswerV4(source: IntCp004EnglishFrozenQuestion, locale: IntCp004LocalizedLocale, answer: string): string {
  if (locale === "hi-IN") {
    switch (source.qlId) {
      case "INT-QL-067": case "INT-QL-073": case "INT-QL-079": case "INT-QL-084": return `अंतिम राशि = ${answer}।`;
      case "INT-QL-068": case "INT-QL-074": case "INT-QL-080": case "INT-QL-085": return `चक्रवृद्धि ब्याज = ${answer}।`;
      case "INT-QL-069": case "INT-QL-070": case "INT-QL-081": return `मूलधन = ${answer}।`;
      case "INT-QL-071": case "INT-QL-077": case "INT-QL-082": return `वार्षिक ब्याज दर = ${answer}।`;
      case "INT-QL-072": case "INT-QL-083": return `समय = ${answer}।`;
      case "INT-QL-075": return `दोनों अंतिम राशियों का अंतर = ${answer}।`;
      case "INT-QL-076": return `प्रभावी वार्षिक दर = ${answer}।`;
      case "INT-QL-078": return `ब्याज जोड़ने की सही आवृत्ति = ${answer}।`;
    }
  }
  switch (source.qlId) {
    case "INT-QL-067": case "INT-QL-073": case "INT-QL-079": case "INT-QL-084": return `ਅੰਤਿਮ ਰਕਮ = ${answer}।`;
    case "INT-QL-068": case "INT-QL-074": case "INT-QL-080": case "INT-QL-085": return `ਚੱਕਰਵੱਧੀ ਵਿਆਜ = ${answer}।`;
    case "INT-QL-069": case "INT-QL-070": case "INT-QL-081": return `ਮੂਲਧਨ = ${answer}।`;
    case "INT-QL-071": case "INT-QL-077": case "INT-QL-082": return `ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ = ${answer}।`;
    case "INT-QL-072": case "INT-QL-083": return `ਸਮਾਂ = ${answer}।`;
    case "INT-QL-075": return `ਦੋਵੇਂ ਅੰਤਿਮ ਰਕਮਾਂ ਦਾ ਅੰਤਰ = ${answer}।`;
    case "INT-QL-076": return `ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ = ${answer}।`;
    case "INT-QL-078": return `ਵਿਆਜ ਜੋੜਨ ਦੀ ਸਹੀ ਗਿਣਤੀ = ${answer}।`;
  }
}

function commonMistakeV4(source: IntCp004EnglishFrozenQuestion, locale: IntCp004LocalizedLocale): string {
  const s = source.mathematicalState;
  const hi = locale === "hi-IN";
  const rate = periodicRate(s.nominalAnnualRatePercent, s.frequency);
  const count = periodCount(locale, s.periods, s.frequency);
  switch (source.qlId) {
    case "INT-QL-067": case "INT-QL-068": case "INT-QL-069": case "INT-QL-070": case "INT-QL-071": case "INT-QL-072":
      return hi ? `${percentText(s.nominalAnnualRatePercent)} वार्षिक दर को सीधे हर अवधि पर न लगाएँ; ${interval(locale, s.frequency)} की दर ${percentText(rate)} और कुल ${count} हैं।` : `${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਨੂੰ ਸਿੱਧਾ ਹਰ ਮਿਆਦ ਉੱਤੇ ਨਾ ਲਗਾਓ; ${interval(locale, s.frequency)} ਦੀ ਦਰ ${percentText(rate)} ਅਤੇ ਕੁੱਲ ${count} ਹਨ।`;
    case "INT-QL-073": case "INT-QL-074": return hi ? `${percentText(s.periodicRatePercent)} पहले से हर बार की दर है; इसे ${s.frequency} से दोबारा न बाँटें।` : `${percentText(s.periodicRatePercent)} ਪਹਿਲਾਂ ਹੀ ਹਰ ਵਾਰ ਦੀ ਦਰ ਹੈ; ਇਸ ਨੂੰ ${s.frequency} ਨਾਲ ਦੁਬਾਰਾ ਨਾ ਵੰਡੋ।`;
    case "INT-QL-075": return hi ? "दोनों योजनाओं में मूलधन, वार्षिक दर और समय समान रखें; केवल ब्याज जोड़ने की आवृत्ति बदलती है।" : "ਦੋਵੇਂ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਮੂਲਧਨ, ਸਾਲਾਨਾ ਦਰ ਅਤੇ ਸਮਾਂ ਇੱਕੋ ਰੱਖੋ; ਕੇਵਲ ਵਿਆਜ ਜੋੜਨ ਦੀ ਗਿਣਤੀ ਬਦਲਦੀ ਹੈ।";
    case "INT-QL-076": return hi ? "घोषित वार्षिक दर को प्रभावी दर न मानें; एक वर्ष के भीतर हुई सभी चक्रवृद्धियाँ शामिल करें।" : "ਘੋਸ਼ਿਤ ਸਾਲਾਨਾ ਦਰ ਨੂੰ ਪ੍ਰਭਾਵੀ ਦਰ ਨਾ ਮੰਨੋ; ਇੱਕ ਸਾਲ ਦੇ ਅੰਦਰ ਹੋਈਆਂ ਸਾਰੀਆਂ ਚੱਕਰਵੱਧੀਆਂ ਸ਼ਾਮਲ ਕਰੋ।";
    case "INT-QL-077": return hi ? "प्रभावी दर को ब्याज जोड़ने की संख्या से सीधे भाग न दें; विकल्प को पूरे एक वर्ष के चक्रवृद्धि गुणक से जाँचें।" : "ਪ੍ਰਭਾਵੀ ਦਰ ਨੂੰ ਵਿਆਜ ਜੋੜਨ ਦੀ ਗਿਣਤੀ ਨਾਲ ਸਿੱਧਾ ਨਾ ਵੰਡੋ; ਚੋਣ ਨੂੰ ਪੂਰੇ ਇੱਕ ਸਾਲ ਦੇ ਚੱਕਰਵੱਧੀ ਗੁਣਕ ਨਾਲ ਜਾਂਚੋ।";
    case "INT-QL-078": return hi ? "आवृत्ति अनुमान से न चुनें; प्रत्येक संभावित ब्याज-क्रम से राशि बनाकर दी गई राशि से मिलाएँ।" : "ਵਿਆਜ ਜੋੜਨ ਦੀ ਗਿਣਤੀ ਅੰਦਾਜ਼ੇ ਨਾਲ ਨਾ ਚੁਣੋ; ਹਰ ਸੰਭਵ ਕ੍ਰਮ ਨਾਲ ਰਕਮ ਕੱਢ ਕੇ ਦਿੱਤੀ ਰਕਮ ਨਾਲ ਮਿਲਾਓ।";
    case "INT-QL-079": case "INT-QL-080": case "INT-QL-081": case "INT-QL-082": case "INT-QL-083": return hi ? `अंतिम ${months(locale, s.tailMonths)} का साधारण ब्याज मूलधन पर नहीं, पूरे वर्षों के बाद बनी राशि पर लगाएँ।` : `ਅੰਤਿਮ ${months(locale, s.tailMonths)} ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਮੂਲਧਨ ਉੱਤੇ ਨਹੀਂ, ਪੂਰੇ ਸਾਲਾਂ ਤੋਂ ਬਾਅਦ ਬਣੀ ਰਕਮ ਉੱਤੇ ਲਗਾਓ।`;
    case "INT-QL-084": case "INT-QL-085": return hi ? "पहले चरण की बनी राशि ही दूसरे चरण का आधार है; दोनों चरणों पर एक ही ब्याज-आवृत्ति न लगाएँ।" : "ਪਹਿਲੇ ਪੜਾਅ ਦੀ ਬਣੀ ਰਕਮ ਹੀ ਦੂਜੇ ਪੜਾਅ ਦਾ ਆਧਾਰ ਹੈ; ਦੋਵੇਂ ਪੜਾਵਾਂ ਉੱਤੇ ਇੱਕੋ ਵਿਆਜ-ਨਿਯਮ ਨਾ ਲਗਾਓ।";
  }
}

function improveSteps(source: IntCp004EnglishFrozenQuestion, locale: IntCp004LocalizedLocale, steps: readonly string[]): readonly string[] {
  const s = source.mathematicalState;
  const countSentence = locale === "hi-IN" ? `कुल ${periodCount(locale, s.periods, s.frequency)} हैं।` : `ਕੁੱਲ ${periodCount(locale, s.periods, s.frequency)} ਹਨ।`;
  return Object.freeze(steps.map((step) => {
    let next = step;
    if (/कुल (?:ब्याज-|चक्रवृद्धि )?अवधि(?:याँ|यां)?\s*=\s*\d+/u.test(next)) next = countSentence;
    if (/ਕੁੱਲ (?:ਵਿਆਜ-|ਚੱਕਰਵੱਧੀ )?ਮਿਆਦਾਂ\s*=\s*\d+/u.test(next)) next = countSentence;
    if (source.qlId === "INT-QL-076" && /₹100 .*₹100.*%/u.test(next)) {
      const effective = effectiveAnnualRate(s.nominalAnnualRatePercent, s.frequency);
      next = locale === "hi-IN" ? `₹100 पर एक वर्ष का ब्याज = ${percentText(effective)} के बराबर है; इसलिए प्रभावी वार्षिक दर ${percentText(effective)} है।` : `₹100 ਉੱਤੇ ਇੱਕ ਸਾਲ ਦਾ ਵਿਆਜ ${percentText(effective)} ਦੇ ਬਰਾਬਰ ਹੈ; ਇਸ ਲਈ ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ ${percentText(effective)} ਹੈ।`;
    }
    return next;
  }));
}

export function remediateCp004LocalizedExplanationV4(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
  explanation: IntCp004LocalizedExplanation,
): IntCp004LocalizedExplanation {
  const answer = cleanAnswer(locale, explanation.finalAnswer);
  const remediated = Object.freeze({
    ...explanation,
    steps: improveSteps(source, locale, explanation.steps),
    finalAnswer: finalAnswerV4(source, locale, answer),
    commonMistake: commonMistakeV4(source, locale),
  });
  assertCp004LocalizedText(locale, [remediated.whatAsked, ...remediated.steps, remediated.finalAnswer, remediated.commonMistake].join("\n"), `${source.qlId}/${source.seed}/${locale}/editorial-v4-explanation`);
  return remediated;
}
