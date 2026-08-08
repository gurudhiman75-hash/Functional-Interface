import {
  brokenAmountForState,
  mixedAmountForState,
  sub,
  type IntCp004QlId,
} from "./cp004-frequency-math";
import { moneyText, percentText } from "./cp004-frequency-options";
import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import {
  assertCp004LocalizedText,
  cp004FindPrompt,
  cp004FrequencyLabel,
  cp004MonthsText,
  cp004Term,
  cp004YearsText,
} from "./cp004-localization-language-pack";
import type { IntCp004LocalizedLocale } from "./cp004-localization-types";

export const INT_CP004_PRESENTATION_WAVE3_QL_IDS = Object.freeze([
  "INT-QL-079",
  "INT-QL-080",
  "INT-QL-081",
  "INT-QL-082",
  "INT-QL-083",
  "INT-QL-084",
  "INT-QL-085",
] as const satisfies readonly IntCp004QlId[]);

export type IntCp004PresentationWave3QlId = typeof INT_CP004_PRESENTATION_WAVE3_QL_IDS[number];
type Row = readonly [string, string];

function isWave3QlId(qlId: IntCp004QlId): qlId is IntCp004PresentationWave3QlId {
  return (INT_CP004_PRESENTATION_WAVE3_QL_IDS as readonly IntCp004QlId[]).includes(qlId);
}

function completeYearsText(locale: IntCp004LocalizedLocale, years: number): string {
  return locale === "hi-IN" ? `${years} पूर्ण वर्ष` : `${years} ਪੂਰੇ ਸਾਲ`;
}

function simpleTailRule(locale: IntCp004LocalizedLocale): string {
  return locale === "hi-IN"
    ? "पूर्ण वर्षों के बाद शेष महीनों पर साधारण ब्याज"
    : "ਪੂਰੇ ਸਾਲਾਂ ਤੋਂ ਬਾਅਦ ਬਾਕੀ ਮਹੀਨਿਆਂ ਉੱਤੇ ਸਧਾਰਣ ਵਿਆਜ";
}

function intervalText(
  locale: IntCp004LocalizedLocale,
  years: number,
  frequency: 1 | 2 | 4 | 12,
): string {
  const duration = cp004YearsText(locale, years);
  const schedule = cp004FrequencyLabel(locale, frequency);
  return locale === "hi-IN" ? `${duration}, ${schedule} चक्रवृद्धि` : `${duration}, ${schedule} ਚੱਕਰਵੱਧੀ`;
}

function targetFor(source: IntCp004EnglishFrozenQuestion, locale: IntCp004LocalizedLocale): string {
  switch (source.qlId) {
    case "INT-QL-079":
    case "INT-QL-084": return cp004Term(locale, "FINAL_AMOUNT");
    case "INT-QL-080":
    case "INT-QL-085": return cp004Term(locale, "COMPOUND_INTEREST");
    case "INT-QL-081": return cp004Term(locale, "PRINCIPAL");
    case "INT-QL-082": return cp004Term(locale, "ANNUAL_RATE");
    case "INT-QL-083": return cp004Term(locale, "FULL_YEAR");
    default: throw new Error(`${source.qlId}: unsupported CP-004 presentation Wave 3 target.`);
  }
}

function factRows(source: IntCp004EnglishFrozenQuestion, locale: IntCp004LocalizedLocale): readonly Row[] {
  const state = source.mathematicalState;
  const brokenAmount = brokenAmountForState(state);
  const mixedAmount = mixedAmountForState(state);
  const rate = percentText(state.nominalAnnualRatePercent);
  const principal = moneyText(state.principal);

  switch (source.qlId) {
    case "INT-QL-079":
      return Object.freeze([
        [cp004Term(locale, "PRINCIPAL"), principal],
        [cp004Term(locale, "ANNUAL_RATE"), rate],
        [cp004Term(locale, "FULL_YEAR"), completeYearsText(locale, state.fullYears)],
        [cp004Term(locale, "TAIL_PERIOD"), cp004MonthsText(locale, state.tailMonths)],
        [locale === "hi-IN" ? "अंतिम अवधि का नियम" : "ਅੰਤਿਮ ਅਵਧੀ ਦਾ ਨਿਯਮ", simpleTailRule(locale)],
        [cp004Term(locale, "FINAL_AMOUNT"), "?"],
      ]);
    case "INT-QL-080":
      return Object.freeze([
        [cp004Term(locale, "PRINCIPAL"), principal],
        [cp004Term(locale, "ANNUAL_RATE"), rate],
        [cp004Term(locale, "FULL_YEAR"), completeYearsText(locale, state.fullYears)],
        [cp004Term(locale, "TAIL_PERIOD"), cp004MonthsText(locale, state.tailMonths)],
        [locale === "hi-IN" ? "अंतिम अवधि का नियम" : "ਅੰਤਿਮ ਅਵਧੀ ਦਾ ਨਿਯਮ", simpleTailRule(locale)],
        [cp004Term(locale, "COMPOUND_INTEREST"), "?"],
      ]);
    case "INT-QL-081":
      return Object.freeze([
        [cp004Term(locale, "PRINCIPAL"), "?"],
        [cp004Term(locale, "FINAL_AMOUNT"), moneyText(brokenAmount)],
        [cp004Term(locale, "ANNUAL_RATE"), rate],
        [cp004Term(locale, "FULL_YEAR"), completeYearsText(locale, state.fullYears)],
        [cp004Term(locale, "TAIL_PERIOD"), cp004MonthsText(locale, state.tailMonths)],
        [locale === "hi-IN" ? "अंतिम अवधि का नियम" : "ਅੰਤਿਮ ਅਵਧੀ ਦਾ ਨਿਯਮ", simpleTailRule(locale)],
      ]);
    case "INT-QL-082":
      return Object.freeze([
        [cp004Term(locale, "PRINCIPAL"), principal],
        [cp004Term(locale, "FINAL_AMOUNT"), moneyText(brokenAmount)],
        [cp004Term(locale, "ANNUAL_RATE"), "?"],
        [cp004Term(locale, "FULL_YEAR"), completeYearsText(locale, state.fullYears)],
        [cp004Term(locale, "TAIL_PERIOD"), cp004MonthsText(locale, state.tailMonths)],
        [locale === "hi-IN" ? "अंतिम अवधि का नियम" : "ਅੰਤਿਮ ਅਵਧੀ ਦਾ ਨਿਯਮ", simpleTailRule(locale)],
      ]);
    case "INT-QL-083":
      return Object.freeze([
        [cp004Term(locale, "PRINCIPAL"), principal],
        [cp004Term(locale, "FINAL_AMOUNT"), moneyText(brokenAmount)],
        [cp004Term(locale, "ANNUAL_RATE"), rate],
        [cp004Term(locale, "FULL_YEAR"), "?"],
        [cp004Term(locale, "TAIL_PERIOD"), cp004MonthsText(locale, state.tailMonths)],
        [locale === "hi-IN" ? "अंतिम अवधि का नियम" : "ਅੰਤਿਮ ਅਵਧੀ ਦਾ ਨਿਯਮ", simpleTailRule(locale)],
      ]);
    case "INT-QL-084":
      return Object.freeze([
        [cp004Term(locale, "PRINCIPAL"), principal],
        [cp004Term(locale, "ANNUAL_RATE"), rate],
        [locale === "hi-IN" ? "पहला अंतराल" : "ਪਹਿਲਾ ਅੰਤਰਾਲ", intervalText(locale, state.firstYears, state.firstFrequency)],
        [locale === "hi-IN" ? "दूसरा अंतराल" : "ਦੂਜਾ ਅੰਤਰਾਲ", intervalText(locale, state.secondYears, state.secondFrequency)],
        [cp004Term(locale, "FINAL_AMOUNT"), "?"],
      ]);
    case "INT-QL-085":
      return Object.freeze([
        [cp004Term(locale, "PRINCIPAL"), principal],
        [cp004Term(locale, "ANNUAL_RATE"), rate],
        [locale === "hi-IN" ? "पहला अंतराल" : "ਪਹਿਲਾ ਅੰਤਰਾਲ", intervalText(locale, state.firstYears, state.firstFrequency)],
        [locale === "hi-IN" ? "दूसरा अंतराल" : "ਦੂਜਾ ਅੰਤਰਾਲ", intervalText(locale, state.secondYears, state.secondFrequency)],
        [cp004Term(locale, "COMPOUND_INTEREST"), "?"],
      ]);
    default:
      throw new Error(`${source.qlId}: unsupported CP-004 presentation Wave 3 facts.`);
  }
}

function proseStem(source: IntCp004EnglishFrozenQuestion, locale: IntCp004LocalizedLocale): string {
  const state = source.mathematicalState;
  const brokenAmount = brokenAmountForState(state);
  const mixedAmount = mixedAmountForState(state);
  const mixedInterest = sub(mixedAmount, state.principal);
  const principal = moneyText(state.principal);
  const rate = percentText(state.nominalAnnualRatePercent);
  const wholeYears = completeYearsText(locale, state.fullYears);
  const tail = cp004MonthsText(locale, state.tailMonths);

  if (locale === "hi-IN") {
    switch (source.qlId) {
      case "INT-QL-079":
        return `${principal} का निवेश ${rate} वार्षिक दर पर ${wholeYears} और उसके बाद ${tail} के लिए किया जाता है। पूर्ण वर्षों के लिए ब्याज वार्षिक चक्रवृद्धि है और शेष महीनों के लिए साधारण ब्याज लगाया जाता है। अंतिम राशि ज्ञात कीजिए।`;
      case "INT-QL-080":
        return `${principal} का निवेश ${rate} वार्षिक दर पर ${wholeYears} और उसके बाद ${tail} के लिए किया जाता है। पूर्ण वर्षों के लिए ब्याज वार्षिक चक्रवृद्धि है और शेष महीनों के लिए साधारण ब्याज लगाया जाता है। कुल ब्याज ज्ञात कीजिए।`;
      case "INT-QL-081":
        return `एक निवेश ${rate} वार्षिक दर पर ${wholeYears} और उसके बाद ${tail} में बढ़कर ${moneyText(brokenAmount)} हो जाता है। पूर्ण वर्षों में वार्षिक चक्रवृद्धि और शेष महीनों में साधारण ब्याज लागू है। मूलधन ज्ञात कीजिए।`;
      case "INT-QL-082":
        return `${principal} की राशि ${wholeYears} और उसके बाद ${tail} में बढ़कर ${moneyText(brokenAmount)} हो जाती है। पूर्ण वर्षों में वार्षिक चक्रवृद्धि और शेष महीनों में साधारण ब्याज लागू है। वार्षिक दर ज्ञात कीजिए।`;
      case "INT-QL-083":
        return `${principal} की राशि ${rate} वार्षिक दर पर कुछ पूर्ण वर्षों और उसके बाद ${tail} में बढ़कर ${moneyText(brokenAmount)} हो जाती है। पूर्ण वर्षों में वार्षिक चक्रवृद्धि और शेष महीनों में साधारण ब्याज लागू है। पूर्ण वर्षों की संख्या ज्ञात कीजिए।`;
      case "INT-QL-084":
        return `${principal} का निवेश ${rate} वार्षिक दर पर किया गया। पहले ${cp004YearsText(locale, state.firstYears)} तक ब्याज ${cp004FrequencyLabel(locale, state.firstFrequency)} और अगले ${cp004YearsText(locale, state.secondYears)} तक ${cp004FrequencyLabel(locale, state.secondFrequency)} चक्रवृद्धि आधार पर जोड़ा गया। अंतिम राशि ज्ञात कीजिए।`;
      case "INT-QL-085":
        return `${principal} का निवेश ${rate} वार्षिक दर पर किया गया। पहले ${cp004YearsText(locale, state.firstYears)} तक ब्याज ${cp004FrequencyLabel(locale, state.firstFrequency)} और अगले ${cp004YearsText(locale, state.secondYears)} तक ${cp004FrequencyLabel(locale, state.secondFrequency)} चक्रवृद्धि आधार पर जोड़ा गया। कुल चक्रवृद्धि ब्याज ज्ञात कीजिए।`;
      default:
        throw new Error(`${source.qlId}: unsupported Hindi CP-004 presentation Wave 3 prose.`);
    }
  }

  switch (source.qlId) {
    case "INT-QL-079":
      return `${principal} ਦਾ ਨਿਵੇਸ਼ ${rate} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${wholeYears} ਅਤੇ ਉਸ ਤੋਂ ਬਾਅਦ ${tail} ਲਈ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਪੂਰੇ ਸਾਲਾਂ ਲਈ ਵਿਆਜ ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਹੈ ਅਤੇ ਬਾਕੀ ਮਹੀਨਿਆਂ ਲਈ ਸਧਾਰਣ ਵਿਆਜ ਲਗਾਇਆ ਜਾਂਦਾ ਹੈ। ਅੰਤਿਮ ਰਕਮ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-080":
      return `${principal} ਦਾ ਨਿਵੇਸ਼ ${rate} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${wholeYears} ਅਤੇ ਉਸ ਤੋਂ ਬਾਅਦ ${tail} ਲਈ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਪੂਰੇ ਸਾਲਾਂ ਲਈ ਵਿਆਜ ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਹੈ ਅਤੇ ਬਾਕੀ ਮਹੀਨਿਆਂ ਲਈ ਸਧਾਰਣ ਵਿਆਜ ਲਗਾਇਆ ਜਾਂਦਾ ਹੈ। ਕੁੱਲ ਵਿਆਜ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-081":
      return `ਇੱਕ ਨਿਵੇਸ਼ ${rate} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${wholeYears} ਅਤੇ ਉਸ ਤੋਂ ਬਾਅਦ ${tail} ਵਿੱਚ ਵੱਧ ਕੇ ${moneyText(brokenAmount)} ਹੋ ਜਾਂਦਾ ਹੈ। ਪੂਰੇ ਸਾਲਾਂ ਵਿੱਚ ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਅਤੇ ਬਾਕੀ ਮਹੀਨਿਆਂ ਵਿੱਚ ਸਧਾਰਣ ਵਿਆਜ ਲਾਗੂ ਹੈ। ਮੂਲਧਨ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-082":
      return `${principal} ਦੀ ਰਕਮ ${wholeYears} ਅਤੇ ਉਸ ਤੋਂ ਬਾਅਦ ${tail} ਵਿੱਚ ਵੱਧ ਕੇ ${moneyText(brokenAmount)} ਹੋ ਜਾਂਦੀ ਹੈ। ਪੂਰੇ ਸਾਲਾਂ ਵਿੱਚ ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਅਤੇ ਬਾਕੀ ਮਹੀਨਿਆਂ ਵਿੱਚ ਸਧਾਰਣ ਵਿਆਜ ਲਾਗੂ ਹੈ। ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-083":
      return `${principal} ਦੀ ਰਕਮ ${rate} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ਕੁਝ ਪੂਰੇ ਸਾਲਾਂ ਅਤੇ ਉਸ ਤੋਂ ਬਾਅਦ ${tail} ਵਿੱਚ ਵੱਧ ਕੇ ${moneyText(brokenAmount)} ਹੋ ਜਾਂਦੀ ਹੈ। ਪੂਰੇ ਸਾਲਾਂ ਵਿੱਚ ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਅਤੇ ਬਾਕੀ ਮਹੀਨਿਆਂ ਵਿੱਚ ਸਧਾਰਣ ਵਿਆਜ ਲਾਗੂ ਹੈ। ਪੂਰੇ ਸਾਲਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-084":
      return `${principal} ਦਾ ਨਿਵੇਸ਼ ${rate} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ਕੀਤਾ ਗਿਆ। ਪਹਿਲੇ ${cp004YearsText(locale, state.firstYears)} ਲਈ ਵਿਆਜ ${cp004FrequencyLabel(locale, state.firstFrequency)} ਅਤੇ ਅਗਲੇ ${cp004YearsText(locale, state.secondYears)} ਲਈ ${cp004FrequencyLabel(locale, state.secondFrequency)} ਚੱਕਰਵੱਧੀ ਆਧਾਰ 'ਤੇ ਜੋੜਿਆ ਗਿਆ। ਅੰਤਿਮ ਰਕਮ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-085":
      return `${principal} ਦਾ ਨਿਵੇਸ਼ ${rate} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ਕੀਤਾ ਗਿਆ। ਪਹਿਲੇ ${cp004YearsText(locale, state.firstYears)} ਲਈ ਵਿਆਜ ${cp004FrequencyLabel(locale, state.firstFrequency)} ਅਤੇ ਅਗਲੇ ${cp004YearsText(locale, state.secondYears)} ਲਈ ${cp004FrequencyLabel(locale, state.secondFrequency)} ਚੱਕਰਵੱਧੀ ਆਧਾਰ 'ਤੇ ਜੋੜਿਆ ਗਿਆ। ਕੁੱਲ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਪਤਾ ਕਰੋ।`;
    default:
      throw new Error(`${source.qlId}: unsupported Punjabi CP-004 presentation Wave 3 prose.`);
  }

  void mixedInterest;
}

function leadFor(locale: IntCp004LocalizedLocale, representation: IntCp004EnglishFrozenQuestion["representation"]): string {
  if (locale === "hi-IN") {
    switch (representation) {
      case "TERMS_TABLE": return "निवेश की शर्तें नीचे दी गई हैं।";
      case "BALANCE_RECORD": return "निवेश खाते का समयानुसार विवरण नीचे दिया गया है।";
      case "SCHEME_COMPARISON": return "ब्याज नियम और समय-अंतराल नीचे दिए गए हैं।";
      case "STANDARD_PROSE": return "";
    }
  }
  switch (representation) {
    case "TERMS_TABLE": return "ਨਿਵੇਸ਼ ਦੀਆਂ ਸ਼ਰਤਾਂ ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਹਨ।";
    case "BALANCE_RECORD": return "ਨਿਵੇਸ਼ ਖਾਤੇ ਦਾ ਸਮੇਂ ਅਨੁਸਾਰ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਹੈ।";
    case "SCHEME_COMPARISON": return "ਵਿਆਜ ਨਿਯਮ ਅਤੇ ਸਮਾਂ-ਅੰਤਰਾਲ ਹੇਠਾਂ ਦਿੱਤੇ ਹਨ।";
    case "STANDARD_PROSE": return "";
  }
}

function tableHeaders(locale: IntCp004LocalizedLocale, representation: IntCp004EnglishFrozenQuestion["representation"]): readonly [string, string] {
  if (locale === "hi-IN") {
    switch (representation) {
      case "TERMS_TABLE": return ["शर्त", "मान"];
      case "BALANCE_RECORD": return ["समय/खाता प्रविष्टि", "विवरण"];
      case "SCHEME_COMPARISON": return ["चरण", "ब्याज नियम"];
      case "STANDARD_PROSE": throw new Error("Standard prose has no table headers.");
    }
  }
  switch (representation) {
    case "TERMS_TABLE": return ["ਸ਼ਰਤ", "ਮੁੱਲ"];
    case "BALANCE_RECORD": return ["ਸਮਾਂ/ਖਾਤਾ ਐਂਟਰੀ", "ਵੇਰਵਾ"];
    case "SCHEME_COMPARISON": return ["ਪੜਾਅ", "ਵਿਆਜ ਨਿਯਮ"];
    case "STANDARD_PROSE": throw new Error("Standard prose has no table headers.");
  }
}

function tableMarkdown(headers: readonly [string, string], rows: readonly Row[]): string {
  return [
    `| ${headers[0]} | ${headers[1]} |`,
    "| --- | --- |",
    ...rows.map(([label, value]) => `| ${label} | ${value} |`),
  ].join("\n");
}

export function renderCp004LocalizedPresentationWave3(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): string {
  if (!isWave3QlId(source.qlId)) {
    throw new Error(`${source.qlId}: not owned by CP-004 localisation presentation Wave 3.`);
  }

  const stem = source.representation === "STANDARD_PROSE"
    ? proseStem(source, locale)
    : [
        leadFor(locale, source.representation),
        "",
        tableMarkdown(tableHeaders(locale, source.representation), factRows(source, locale)),
        "",
        cp004FindPrompt(locale, targetFor(source, locale)),
      ].join("\n");

  assertCp004LocalizedText(locale, stem, `${source.qlId}/${source.seed}/presentation-wave3`);
  return stem;
}
