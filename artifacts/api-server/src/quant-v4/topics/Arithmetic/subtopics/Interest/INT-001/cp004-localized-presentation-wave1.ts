import {
  completeAmountForState,
  sub,
  type Cp004Frequency,
  type IntCp004QlId,
} from "./cp004-frequency-math";
import { moneyText, percentText } from "./cp004-frequency-options";
import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import {
  assertCp004LocalizedText,
  cp004CompoundingText,
  cp004FindPrompt,
  cp004FrequencyLabel,
  cp004MonthsText,
  cp004Term,
  cp004YearsText,
} from "./cp004-localization-language-pack";
import type { IntCp004LocalizedLocale } from "./cp004-localization-types";

export const INT_CP004_PRESENTATION_WAVE1_QL_IDS = Object.freeze([
  "INT-QL-067",
  "INT-QL-068",
  "INT-QL-069",
  "INT-QL-070",
  "INT-QL-071",
  "INT-QL-072",
] as const satisfies readonly IntCp004QlId[]);

export type IntCp004PresentationWave1QlId = typeof INT_CP004_PRESENTATION_WAVE1_QL_IDS[number];

type Row = readonly [string, string];

function isWave1QlId(qlId: IntCp004QlId): qlId is IntCp004PresentationWave1QlId {
  return (INT_CP004_PRESENTATION_WAVE1_QL_IDS as readonly IntCp004QlId[]).includes(qlId);
}

function localizedDurationText(
  locale: IntCp004LocalizedLocale,
  periods: number,
  frequency: Cp004Frequency,
): string {
  const months = periods * (12 / frequency);
  return months % 12 === 0
    ? cp004YearsText(locale, months / 12)
    : cp004MonthsText(locale, months);
}

function targetFor(source: IntCp004EnglishFrozenQuestion, locale: IntCp004LocalizedLocale): string {
  switch (source.qlId) {
    case "INT-QL-067": return cp004Term(locale, "FINAL_AMOUNT");
    case "INT-QL-068": return cp004Term(locale, "COMPOUND_INTEREST");
    case "INT-QL-069":
    case "INT-QL-070": return cp004Term(locale, "PRINCIPAL");
    case "INT-QL-071": return cp004Term(locale, "NOMINAL_ANNUAL_RATE");
    case "INT-QL-072": return cp004Term(locale, "DURATION");
    default: throw new Error(`${source.qlId}: unsupported CP-004 presentation Wave 1 target.`);
  }
}

function factRows(source: IntCp004EnglishFrozenQuestion, locale: IntCp004LocalizedLocale): readonly Row[] {
  const state = source.mathematicalState;
  const amount = completeAmountForState(state);
  const compoundInterest = sub(amount, state.principal);
  const duration = localizedDurationText(locale, state.periods, state.frequency);
  const frequency = cp004FrequencyLabel(locale, state.frequency);
  const principal = moneyText(state.principal);
  const rate = percentText(state.nominalAnnualRatePercent);

  switch (source.qlId) {
    case "INT-QL-067":
      return Object.freeze([
        [cp004Term(locale, "PRINCIPAL"), principal],
        [cp004Term(locale, "NOMINAL_ANNUAL_RATE"), rate],
        [cp004Term(locale, "COMPOUNDING_FREQUENCY"), frequency],
        [cp004Term(locale, "DURATION"), duration],
        [cp004Term(locale, "FINAL_AMOUNT"), "?"],
      ]);
    case "INT-QL-068":
      return Object.freeze([
        [cp004Term(locale, "PRINCIPAL"), principal],
        [cp004Term(locale, "NOMINAL_ANNUAL_RATE"), rate],
        [cp004Term(locale, "COMPOUNDING_FREQUENCY"), frequency],
        [cp004Term(locale, "DURATION"), duration],
        [cp004Term(locale, "COMPOUND_INTEREST"), "?"],
      ]);
    case "INT-QL-069":
      return Object.freeze([
        [cp004Term(locale, "PRINCIPAL"), "?"],
        [cp004Term(locale, "NOMINAL_ANNUAL_RATE"), rate],
        [cp004Term(locale, "COMPOUNDING_FREQUENCY"), frequency],
        [cp004Term(locale, "DURATION"), duration],
        [cp004Term(locale, "FINAL_AMOUNT"), moneyText(amount)],
      ]);
    case "INT-QL-070":
      return Object.freeze([
        [cp004Term(locale, "PRINCIPAL"), "?"],
        [cp004Term(locale, "NOMINAL_ANNUAL_RATE"), rate],
        [cp004Term(locale, "COMPOUNDING_FREQUENCY"), frequency],
        [cp004Term(locale, "DURATION"), duration],
        [cp004Term(locale, "COMPOUND_INTEREST"), moneyText(compoundInterest)],
      ]);
    case "INT-QL-071":
      return Object.freeze([
        [cp004Term(locale, "PRINCIPAL"), principal],
        [cp004Term(locale, "NOMINAL_ANNUAL_RATE"), "?"],
        [cp004Term(locale, "COMPOUNDING_FREQUENCY"), frequency],
        [cp004Term(locale, "DURATION"), duration],
        [cp004Term(locale, "FINAL_AMOUNT"), moneyText(amount)],
      ]);
    case "INT-QL-072":
      return Object.freeze([
        [cp004Term(locale, "PRINCIPAL"), principal],
        [cp004Term(locale, "NOMINAL_ANNUAL_RATE"), rate],
        [cp004Term(locale, "COMPOUNDING_FREQUENCY"), frequency],
        [cp004Term(locale, "DURATION"), "?"],
        [cp004Term(locale, "FINAL_AMOUNT"), moneyText(amount)],
      ]);
    default:
      throw new Error(`${source.qlId}: unsupported CP-004 presentation Wave 1 facts.`);
  }
}

function proseStem(source: IntCp004EnglishFrozenQuestion, locale: IntCp004LocalizedLocale): string {
  const state = source.mathematicalState;
  const amount = completeAmountForState(state);
  const compoundInterest = sub(amount, state.principal);
  const principal = moneyText(state.principal);
  const rate = percentText(state.nominalAnnualRatePercent);
  const duration = localizedDurationText(locale, state.periods, state.frequency);
  const compounding = cp004CompoundingText(locale, state.frequency);

  if (locale === "hi-IN") {
    switch (source.qlId) {
      case "INT-QL-067":
        return `${principal} का निवेश ${rate} नाममात्र वार्षिक दर पर ${duration} के लिए किया जाता है। ${compounding}। परिपक्वता पर प्राप्त अंतिम राशि ज्ञात कीजिए।`;
      case "INT-QL-068":
        return `${principal} पर ${rate} नाममात्र वार्षिक दर से ${duration} के लिए चक्रवृद्धि ब्याज ज्ञात कीजिए। ${compounding}।`;
      case "INT-QL-069":
        return `एक निवेश ${rate} नाममात्र वार्षिक दर पर ${duration} में बढ़कर ${moneyText(amount)} हो जाता है। ${compounding}। प्रारम्भिक मूलधन ज्ञात कीजिए।`;
      case "INT-QL-070":
        return `एक निवेश पर ${rate} नाममात्र वार्षिक दर से ${duration} का चक्रवृद्धि ब्याज ${moneyText(compoundInterest)} है। ${compounding}। मूलधन ज्ञात कीजिए।`;
      case "INT-QL-071":
        return `${principal} की राशि ${duration} में बढ़कर ${moneyText(amount)} हो जाती है। ब्याज ${cp004FrequencyLabel(locale, state.frequency)} चक्रवृद्धि आधार पर जोड़ा जाता है। नाममात्र वार्षिक दर ज्ञात कीजिए।`;
      case "INT-QL-072":
        return `${principal} की राशि ${rate} नाममात्र वार्षिक दर पर बढ़कर ${moneyText(amount)} हो जाती है। ${compounding}। निवेश की अवधि ज्ञात कीजिए।`;
      default:
        throw new Error(`${source.qlId}: unsupported Hindi CP-004 presentation Wave 1 prose.`);
    }
  }

  switch (source.qlId) {
    case "INT-QL-067":
      return `${principal} ਦਾ ਨਿਵੇਸ਼ ${rate} ਨਾਮਮਾਤਰ ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${duration} ਲਈ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ${compounding}। ਮਿਆਦ ਪੂਰੀ ਹੋਣ 'ਤੇ ਮਿਲਣ ਵਾਲੀ ਅੰਤਿਮ ਰਕਮ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-068":
      return `${principal} ਉੱਤੇ ${rate} ਨਾਮਮਾਤਰ ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${duration} ਲਈ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਪਤਾ ਕਰੋ। ${compounding}।`;
    case "INT-QL-069":
      return `ਇੱਕ ਨਿਵੇਸ਼ ${rate} ਨਾਮਮਾਤਰ ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${duration} ਵਿੱਚ ਵੱਧ ਕੇ ${moneyText(amount)} ਹੋ ਜਾਂਦਾ ਹੈ। ${compounding}। ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-070":
      return `ਇੱਕ ਨਿਵੇਸ਼ ਉੱਤੇ ${rate} ਨਾਮਮਾਤਰ ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${duration} ਦਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ${moneyText(compoundInterest)} ਹੈ। ${compounding}। ਮੂਲਧਨ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-071":
      return `${principal} ਦੀ ਰਕਮ ${duration} ਵਿੱਚ ਵੱਧ ਕੇ ${moneyText(amount)} ਹੋ ਜਾਂਦੀ ਹੈ। ਵਿਆਜ ${cp004FrequencyLabel(locale, state.frequency)} ਚੱਕਰਵੱਧੀ ਆਧਾਰ 'ਤੇ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਨਾਮਮਾਤਰ ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-072":
      return `${principal} ਦੀ ਰਕਮ ${rate} ਨਾਮਮਾਤਰ ਸਾਲਾਨਾ ਦਰ ਨਾਲ ਵੱਧ ਕੇ ${moneyText(amount)} ਹੋ ਜਾਂਦੀ ਹੈ। ${compounding}। ਨਿਵੇਸ਼ ਦੀ ਮਿਆਦ ਪਤਾ ਕਰੋ।`;
    default:
      throw new Error(`${source.qlId}: unsupported Punjabi CP-004 presentation Wave 1 prose.`);
  }
}

function leadFor(
  locale: IntCp004LocalizedLocale,
  representation: IntCp004EnglishFrozenQuestion["representation"],
): string {
  if (locale === "hi-IN") {
    switch (representation) {
      case "TERMS_TABLE": return "निवेश की शर्तें नीचे दी गई हैं।";
      case "BALANCE_RECORD": return "निवेश खाते का उपलब्ध विवरण नीचे दर्ज है।";
      case "SCHEME_COMPARISON": return "ब्याज योजना और अवधि का क्रम नीचे दिया गया है।";
      case "STANDARD_PROSE": return "";
    }
  }
  switch (representation) {
    case "TERMS_TABLE": return "ਨਿਵੇਸ਼ ਦੀਆਂ ਸ਼ਰਤਾਂ ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਹਨ।";
    case "BALANCE_RECORD": return "ਨਿਵੇਸ਼ ਖਾਤੇ ਦਾ ਉਪਲਬਧ ਵੇਰਵਾ ਹੇਠਾਂ ਦਰਜ ਹੈ।";
    case "SCHEME_COMPARISON": return "ਵਿਆਜ ਯੋਜਨਾ ਅਤੇ ਮਿਆਦ ਦਾ ਕ੍ਰਮ ਹੇਠਾਂ ਦਿੱਤਾ ਹੈ।";
    case "STANDARD_PROSE": return "";
  }
}

function tableHeaders(
  locale: IntCp004LocalizedLocale,
  representation: IntCp004EnglishFrozenQuestion["representation"],
): readonly [string, string] {
  if (locale === "hi-IN") {
    switch (representation) {
      case "TERMS_TABLE": return ["शर्त", "मान"];
      case "BALANCE_RECORD": return ["खाता प्रविष्टि", "विवरण"];
      case "SCHEME_COMPARISON": return ["चरण", "दिया गया विवरण"];
      case "STANDARD_PROSE": throw new Error("Standard prose has no table headers.");
    }
  }
  switch (representation) {
    case "TERMS_TABLE": return ["ਸ਼ਰਤ", "ਮੁੱਲ"];
    case "BALANCE_RECORD": return ["ਖਾਤਾ ਐਂਟਰੀ", "ਵੇਰਵਾ"];
    case "SCHEME_COMPARISON": return ["ਪੜਾਅ", "ਦਿੱਤਾ ਵੇਰਵਾ"];
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

export function renderCp004LocalizedPresentationWave1(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): string {
  if (!isWave1QlId(source.qlId)) {
    throw new Error(`${source.qlId}: not owned by CP-004 localisation presentation Wave 1.`);
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

  assertCp004LocalizedText(locale, stem, `${source.qlId}/${source.seed}/presentation-wave1`);
  return stem;
}
