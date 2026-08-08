import {
  completeAmountForState,
  effectiveAnnualRate,
  type IntCp004QlId,
} from "./cp004-frequency-math";
import { moneyText, percentText } from "./cp004-frequency-options";
import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import {
  assertCp004LocalizedText,
  cp004FindPrompt,
  cp004FrequencyLabel,
  cp004PeriodsText,
  cp004Term,
  cp004YearsText,
} from "./cp004-localization-language-pack";
import type { IntCp004LocalizedLocale } from "./cp004-localization-types";

export const INT_CP004_PRESENTATION_WAVE2_QL_IDS = Object.freeze([
  "INT-QL-073",
  "INT-QL-074",
  "INT-QL-075",
  "INT-QL-076",
  "INT-QL-077",
  "INT-QL-078",
] as const satisfies readonly IntCp004QlId[]);

export type IntCp004PresentationWave2QlId = typeof INT_CP004_PRESENTATION_WAVE2_QL_IDS[number];
type Row = readonly [string, string];

function isWave2QlId(qlId: IntCp004QlId): qlId is IntCp004PresentationWave2QlId {
  return (INT_CP004_PRESENTATION_WAVE2_QL_IDS as readonly IntCp004QlId[]).includes(qlId);
}

function creditedTimesText(locale: IntCp004LocalizedLocale, frequency: 1 | 2 | 4 | 12): string {
  if (locale === "hi-IN") {
    switch (frequency) {
      case 1: return "वर्ष में एक बार";
      case 2: return "वर्ष में दो बार";
      case 4: return "वर्ष में चार बार";
      case 12: return "हर माह";
    }
  }
  switch (frequency) {
    case 1: return "ਸਾਲ ਵਿੱਚ ਇੱਕ ਵਾਰ";
    case 2: return "ਸਾਲ ਵਿੱਚ ਦੋ ਵਾਰ";
    case 4: return "ਸਾਲ ਵਿੱਚ ਚਾਰ ਵਾਰ";
    case 12: return "ਹਰ ਮਹੀਨੇ";
  }
}

function targetFor(source: IntCp004EnglishFrozenQuestion, locale: IntCp004LocalizedLocale): string {
  switch (source.qlId) {
    case "INT-QL-073": return cp004Term(locale, "FINAL_AMOUNT");
    case "INT-QL-074": return cp004Term(locale, "COMPOUND_INTEREST");
    case "INT-QL-075": return cp004Term(locale, "DIFFERENCE");
    case "INT-QL-076": return cp004Term(locale, "EFFECTIVE_ANNUAL_RATE");
    case "INT-QL-077": return cp004Term(locale, "NOMINAL_ANNUAL_RATE");
    case "INT-QL-078": return cp004Term(locale, "COMPOUNDING_FREQUENCY");
    default: throw new Error(`${source.qlId}: unsupported CP-004 presentation Wave 2 target.`);
  }
}

function factRows(source: IntCp004EnglishFrozenQuestion, locale: IntCp004LocalizedLocale): readonly Row[] {
  const state = source.mathematicalState;
  const amount = completeAmountForState(state);
  const effective = effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency);
  const principal = moneyText(state.principal);
  const nominal = percentText(state.nominalAnnualRatePercent);
  const periodic = percentText(state.periodicRatePercent);

  switch (source.qlId) {
    case "INT-QL-073":
      return Object.freeze([
        [cp004Term(locale, "PRINCIPAL"), principal],
        [cp004Term(locale, "PERIOD_RATE"), periodic],
        [cp004Term(locale, "PERIOD"), cp004PeriodsText(locale, state.periods, state.frequency)],
        [cp004Term(locale, "FINAL_AMOUNT"), "?"],
      ]);
    case "INT-QL-074":
      return Object.freeze([
        [cp004Term(locale, "PRINCIPAL"), principal],
        [cp004Term(locale, "PERIOD_RATE"), periodic],
        [cp004Term(locale, "PERIOD"), cp004PeriodsText(locale, state.periods, state.frequency)],
        [cp004Term(locale, "COMPOUND_INTEREST"), "?"],
      ]);
    case "INT-QL-075":
      return Object.freeze([
        [cp004Term(locale, "PRINCIPAL"), principal],
        [cp004Term(locale, "NOMINAL_ANNUAL_RATE"), nominal],
        [cp004Term(locale, "DURATION"), cp004YearsText(locale, state.years)],
        [locale === "hi-IN" ? "पहली ब्याज गणना" : "ਪਹਿਲੀ ਵਿਆਜ ਗਿਣਤੀ", cp004FrequencyLabel(locale, state.frequency)],
        [locale === "hi-IN" ? "दूसरी ब्याज गणना" : "ਦੂਜੀ ਵਿਆਜ ਗਿਣਤੀ", cp004FrequencyLabel(locale, state.comparisonFrequency)],
        [cp004Term(locale, "DIFFERENCE"), "?"],
      ]);
    case "INT-QL-076":
      return Object.freeze([
        [cp004Term(locale, "NOMINAL_ANNUAL_RATE"), nominal],
        [locale === "hi-IN" ? "ब्याज जोड़ने की आवृत्ति" : "ਵਿਆਜ ਜੋੜਨ ਦੀ ਆਵ੍ਰਿਤੀ", creditedTimesText(locale, state.frequency)],
        [cp004Term(locale, "EFFECTIVE_ANNUAL_RATE"), "?"],
      ]);
    case "INT-QL-077":
      return Object.freeze([
        [cp004Term(locale, "EFFECTIVE_ANNUAL_RATE"), percentText(effective)],
        [locale === "hi-IN" ? "ब्याज जोड़ने की आवृत्ति" : "ਵਿਆਜ ਜੋੜਨ ਦੀ ਆਵ੍ਰਿਤੀ", creditedTimesText(locale, state.frequency)],
        [cp004Term(locale, "NOMINAL_ANNUAL_RATE"), "?"],
      ]);
    case "INT-QL-078":
      return Object.freeze([
        [cp004Term(locale, "PRINCIPAL"), principal],
        [cp004Term(locale, "FINAL_AMOUNT"), moneyText(amount)],
        [cp004Term(locale, "NOMINAL_ANNUAL_RATE"), nominal],
        [cp004Term(locale, "DURATION"), cp004YearsText(locale, state.years)],
        [cp004Term(locale, "COMPOUNDING_FREQUENCY"), "?"],
      ]);
    default:
      throw new Error(`${source.qlId}: unsupported CP-004 presentation Wave 2 facts.`);
  }
}

function frequencyChoices(locale: IntCp004LocalizedLocale): string {
  return [1, 2, 4, 12]
    .map((frequency) => cp004FrequencyLabel(locale, frequency as 1 | 2 | 4 | 12))
    .join(locale === "hi-IN" ? ", " : ", ");
}

function proseStem(source: IntCp004EnglishFrozenQuestion, locale: IntCp004LocalizedLocale): string {
  const state = source.mathematicalState;
  const amount = completeAmountForState(state);
  const effective = effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency);
  const principal = moneyText(state.principal);
  const nominal = percentText(state.nominalAnnualRatePercent);
  const periodic = percentText(state.periodicRatePercent);
  const periods = cp004PeriodsText(locale, state.periods, state.frequency);

  if (locale === "hi-IN") {
    switch (source.qlId) {
      case "INT-QL-073":
        return `${principal} के निवेश पर प्रत्येक ${cp004FrequencyLabel(locale, state.frequency)} अवधि में ${periodic} ब्याज जोड़ा जाता है। कुल ${periods} के बाद प्राप्त राशि ज्ञात कीजिए।`;
      case "INT-QL-074":
        return `${principal} के निवेश पर प्रत्येक ${cp004FrequencyLabel(locale, state.frequency)} अवधि में ${periodic} ब्याज जोड़ा जाता है। कुल ${periods} के बाद चक्रवृद्धि ब्याज ज्ञात कीजिए।`;
      case "INT-QL-075":
        return `समान मूलधन ${principal} को ${nominal} नाममात्र वार्षिक दर पर ${cp004YearsText(locale, state.years)} के लिए दो योजनाओं में लगाया गया है। पहली योजना में ब्याज ${cp004FrequencyLabel(locale, state.frequency)} और दूसरी में ${cp004FrequencyLabel(locale, state.comparisonFrequency)} जोड़ा जाता है। दोनों अंतिम राशियों का अंतर ज्ञात कीजिए।`;
      case "INT-QL-076":
        return `एक योजना ${nominal} नाममात्र वार्षिक दर बताती है और ब्याज ${creditedTimesText(locale, state.frequency)} जोड़ती है। दो दशमलव स्थान तक प्रभावी वार्षिक दर ज्ञात कीजिए।`;
      case "INT-QL-077":
        return `जब ब्याज ${creditedTimesText(locale, state.frequency)} जोड़ा जाता है, तब प्रभावी वार्षिक दर ${percentText(effective)} है। नाममात्र वार्षिक दर ज्ञात कीजिए।`;
      case "INT-QL-078":
        return `${principal} की राशि ${nominal} नाममात्र वार्षिक दर पर ${cp004YearsText(locale, state.years)} में बढ़कर ${moneyText(amount)} हो जाती है। ब्याज जोड़ने का क्रम ${frequencyChoices(locale)} में से कौन-सा था?`;
      default:
        throw new Error(`${source.qlId}: unsupported Hindi CP-004 presentation Wave 2 prose.`);
    }
  }

  switch (source.qlId) {
    case "INT-QL-073":
      return `${principal} ਦੇ ਨਿਵੇਸ਼ ਉੱਤੇ ਹਰ ${cp004FrequencyLabel(locale, state.frequency)} ਅਵਧੀ ਵਿੱਚ ${periodic} ਵਿਆਜ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਕੁੱਲ ${periods} ਤੋਂ ਬਾਅਦ ਮਿਲਣ ਵਾਲੀ ਰਕਮ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-074":
      return `${principal} ਦੇ ਨਿਵੇਸ਼ ਉੱਤੇ ਹਰ ${cp004FrequencyLabel(locale, state.frequency)} ਅਵਧੀ ਵਿੱਚ ${periodic} ਵਿਆਜ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਕੁੱਲ ${periods} ਤੋਂ ਬਾਅਦ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-075":
      return `ਇੱਕੋ ਮੂਲਧਨ ${principal} ਨੂੰ ${nominal} ਨਾਮਮਾਤਰ ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${cp004YearsText(locale, state.years)} ਲਈ ਦੋ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਲਗਾਇਆ ਗਿਆ ਹੈ। ਪਹਿਲੀ ਯੋਜਨਾ ਵਿੱਚ ਵਿਆਜ ${cp004FrequencyLabel(locale, state.frequency)} ਅਤੇ ਦੂਜੀ ਵਿੱਚ ${cp004FrequencyLabel(locale, state.comparisonFrequency)} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਦੋਵਾਂ ਅੰਤਿਮ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-076":
      return `ਇੱਕ ਯੋਜਨਾ ${nominal} ਨਾਮਮਾਤਰ ਸਾਲਾਨਾ ਦਰ ਦਿੰਦੀ ਹੈ ਅਤੇ ਵਿਆਜ ${creditedTimesText(locale, state.frequency)} ਜੋੜਦੀ ਹੈ। ਦੋ ਦਸ਼ਮਲਵ ਥਾਵਾਂ ਤੱਕ ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-077":
      return `ਜਦੋਂ ਵਿਆਜ ${creditedTimesText(locale, state.frequency)} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ, ਤਦ ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ ${percentText(effective)} ਹੈ। ਨਾਮਮਾਤਰ ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-078":
      return `${principal} ਦੀ ਰਕਮ ${nominal} ਨਾਮਮਾਤਰ ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${cp004YearsText(locale, state.years)} ਵਿੱਚ ਵੱਧ ਕੇ ${moneyText(amount)} ਹੋ ਜਾਂਦੀ ਹੈ। ਵਿਆਜ ਜੋੜਨ ਦਾ ਕ੍ਰਮ ${frequencyChoices(locale)} ਵਿੱਚੋਂ ਕਿਹੜਾ ਸੀ?`;
    default:
      throw new Error(`${source.qlId}: unsupported Punjabi CP-004 presentation Wave 2 prose.`);
  }
}

function leadFor(locale: IntCp004LocalizedLocale, representation: IntCp004EnglishFrozenQuestion["representation"]): string {
  if (locale === "hi-IN") {
    switch (representation) {
      case "TERMS_TABLE": return "योजना की शर्तें नीचे दी गई हैं।";
      case "BALANCE_RECORD": return "ब्याज खाते का उपलब्ध विवरण नीचे दिया गया है।";
      case "SCHEME_COMPARISON": return "योजनाओं या ब्याज क्रम का विवरण नीचे दिया गया है।";
      case "STANDARD_PROSE": return "";
    }
  }
  switch (representation) {
    case "TERMS_TABLE": return "ਯੋਜਨਾ ਦੀਆਂ ਸ਼ਰਤਾਂ ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਹਨ।";
    case "BALANCE_RECORD": return "ਵਿਆਜ ਖਾਤੇ ਦਾ ਉਪਲਬਧ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਹੈ।";
    case "SCHEME_COMPARISON": return "ਯੋਜਨਾਵਾਂ ਜਾਂ ਵਿਆਜ ਕ੍ਰਮ ਦਾ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਹੈ।";
    case "STANDARD_PROSE": return "";
  }
}

function tableHeaders(locale: IntCp004LocalizedLocale, representation: IntCp004EnglishFrozenQuestion["representation"]): readonly [string, string] {
  if (locale === "hi-IN") {
    switch (representation) {
      case "TERMS_TABLE": return ["शर्त", "मान"];
      case "BALANCE_RECORD": return ["खाता प्रविष्टि", "विवरण"];
      case "SCHEME_COMPARISON": return ["योजना/चरण", "विवरण"];
      case "STANDARD_PROSE": throw new Error("Standard prose has no table headers.");
    }
  }
  switch (representation) {
    case "TERMS_TABLE": return ["ਸ਼ਰਤ", "ਮੁੱਲ"];
    case "BALANCE_RECORD": return ["ਖਾਤਾ ਐਂਟਰੀ", "ਵੇਰਵਾ"];
    case "SCHEME_COMPARISON": return ["ਯੋਜਨਾ/ਪੜਾਅ", "ਵੇਰਵਾ"];
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

export function renderCp004LocalizedPresentationWave2(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): string {
  if (!isWave2QlId(source.qlId)) {
    throw new Error(`${source.qlId}: not owned by CP-004 localisation presentation Wave 2.`);
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

  assertCp004LocalizedText(locale, stem, `${source.qlId}/${source.seed}/presentation-wave2`);
  return stem;
}
