import { amount, type IntCp003QlId } from "./cp003-exam-model";
import type { IntCp003EnglishFrozenQuestion } from "./cp003-english-frozen-runtime";
import { moneyMath, rateMath, resolve, tableMarkdown } from "./cp003-exam-support";
import {
  assertCp003LocalizedText,
  cp003CompoundedAnnuallyText,
  cp003FindPrompt,
  cp003OrdinalYearText,
  cp003Term,
  cp003YearsText,
} from "./cp003-localization-language-pack";
import type {
  IntCp003LocalizedLocale,
  IntCp003LocalizedPresentation,
  IntCp003LocalizedPresentationTable,
} from "./cp003-localization-types";

export const INT_CP003_PRESENTATION_WAVE2_QL_IDS = Object.freeze([
  "INT-QL-059",
  "INT-QL-060",
  "INT-QL-061",
  "INT-QL-062",
  "INT-QL-063",
  "INT-QL-064",
  "INT-QL-065",
  "INT-QL-066",
] as const satisfies readonly IntCp003QlId[]);

export type IntCp003PresentationWave2QlId = typeof INT_CP003_PRESENTATION_WAVE2_QL_IDS[number];

function isWave2QlId(qlId: IntCp003QlId): qlId is IntCp003PresentationWave2QlId {
  return (INT_CP003_PRESENTATION_WAVE2_QL_IDS as readonly IntCp003QlId[]).includes(qlId);
}

function localized(locale: IntCp003LocalizedLocale, hindi: string, punjabi: string): string {
  return locale === "hi-IN" ? hindi : punjabi;
}

function freezeTable(table: IntCp003LocalizedPresentationTable): IntCp003LocalizedPresentationTable {
  return Object.freeze({
    headers: Object.freeze([...table.headers]),
    rows: Object.freeze(table.rows.map((row) => Object.freeze([...row]))),
  });
}

function buildPresentation(
  source: IntCp003EnglishFrozenQuestion,
  locale: IntCp003LocalizedLocale,
  leadText: string | undefined,
  table: IntCp003LocalizedPresentationTable | undefined,
  prompt: string,
): IntCp003LocalizedPresentation {
  const frozenTable = table ? freezeTable(table) : undefined;
  const markdown = frozenTable
    ? [leadText ?? "", "", tableMarkdown(frozenTable), "", prompt]
        .filter((part, index) => index !== 0 || part.length > 0)
        .join("\n")
    : prompt;
  assertCp003LocalizedText(locale, markdown, `${source.qlId}/${source.seed}/presentation`);
  return Object.freeze({
    representation: source.presentation.representation,
    stemFamilyId: source.presentation.stemFamilyId,
    ...(leadText ? { leadText } : {}),
    ...(frozenTable ? { table: frozenTable } : {}),
    prompt,
    markdown,
  });
}

function leadForRepresentation(
  locale: IntCp003LocalizedLocale,
  representation: IntCp003EnglishFrozenQuestion["presentation"]["representation"],
): string {
  switch (representation) {
    case "ACCOUNT_TABLE":
      return localized(locale, "ब्याज और राशि का विवरण नीचे दिया गया है।", "ਵਿਆਜ ਅਤੇ ਰਕਮ ਦਾ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ।");
    case "BALANCE_LEDGER":
      return localized(locale, "वर्षवार शेष राशि का विवरण नीचे दिया गया है।", "ਸਾਲ-ਵਾਰ ਬਕਾਇਆ ਰਕਮ ਦਾ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ।");
    case "GROWTH_RATIO":
      return localized(locale, "दो संबंधित राशियों का विवरण नीचे दिया गया है।", "ਦੋ ਸੰਬੰਧਿਤ ਰਕਮਾਂ ਦਾ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ।");
    case "BANK_STATEMENT":
      return localized(locale, "निवेश की वर्षवार राशि नीचे दी गई है।", "ਨਿਵੇਸ਼ ਦੀ ਸਾਲ-ਵਾਰ ਰਕਮ ਹੇਠਾਂ ਦਿੱਤੀ ਗਈ ਹੈ।");
    case "MISSING_ENTRY":
      return localized(locale, "तालिका की एक प्रविष्टि रिक्त है।", "ਸਾਰਣੀ ਦੀ ਇੱਕ ਐਂਟਰੀ ਖਾਲੀ ਹੈ।");
    case "STANDARD_PROSE":
      return "";
  }
}

function tableFor(
  source: IntCp003EnglishFrozenQuestion,
  locale: IntCp003LocalizedLocale,
): IntCp003LocalizedPresentationTable {
  const state = resolve(source.mathematicalState);
  const principal = cp003Term(locale, "PRINCIPAL");
  const originalSum = cp003Term(locale, "ORIGINAL_SUM");
  const rate = cp003Term(locale, "ANNUAL_RATE");
  const balance = cp003Term(locale, "BALANCE");
  const interest = cp003Term(locale, "INTEREST");
  const earlierYear = cp003Term(locale, "EARLIER_YEAR");
  const laterYear = cp003Term(locale, "LATER_YEAR");
  const year = cp003Term(locale, "YEAR");
  const targetYear = cp003OrdinalYearText(locale, state.targetYear);
  const earlierOrdinal = cp003OrdinalYearText(locale, state.earlierYear);
  const laterOrdinal = cp003OrdinalYearText(locale, state.laterYear);
  const previousBalance = amount(state.principal, state.ratePercent, state.currentYear - 1);

  switch (source.qlId) {
    case "INT-QL-059":
      return {
        headers: [principal, rate, year, interest],
        rows: [[moneyMath(state.principal), rateMath(state.ratePercent), targetYear, "?"]],
      };
    case "INT-QL-060":
      return {
        headers: [principal, rate, year, interest],
        rows: [["?", rateMath(state.ratePercent), targetYear, moneyMath(state.nthYearInterest)]],
      };
    case "INT-QL-061":
      return {
        headers: [principal, year, interest, rate],
        rows: [[moneyMath(state.principal), targetYear, moneyMath(state.nthYearInterest), "?"]],
      };
    case "INT-QL-062":
      return {
        headers: [year, balance, rate, localized(locale, "पिछले वर्ष की शेष राशि", "ਪਿਛਲੇ ਸਾਲ ਦੀ ਬਕਾਇਆ ਰਕਮ")],
        rows: [[String(state.currentYear), moneyMath(state.currentAmount), rateMath(state.ratePercent), "?"]],
      };
    case "INT-QL-063":
      return {
        headers: [localized(locale, "आरंभिक शेष राशि", "ਸ਼ੁਰੂਆਤੀ ਬਕਾਇਆ ਰਕਮ"), localized(locale, "एक वर्ष बाद की राशि", "ਇੱਕ ਸਾਲ ਬਾਅਦ ਦੀ ਰਕਮ"), rate],
        rows: [[moneyMath(previousBalance), moneyMath(state.currentAmount), "?"]],
      };
    case "INT-QL-064":
      return {
        headers: [originalSum, localized(locale, `${state.currentYear} वर्ष बाद की राशि`, `${state.currentYear} ਸਾਲ ਬਾਅਦ ਦੀ ਰਕਮ`), localized(locale, `${state.currentYear + 1} वर्ष बाद की राशि`, `${state.currentYear + 1} ਸਾਲ ਬਾਅਦ ਦੀ ਰਕਮ`)],
        rows: [["?", moneyMath(state.currentAmount), moneyMath(state.nextAmount)]],
      };
    case "INT-QL-065":
      return {
        headers: [principal, rate, earlierYear, laterYear, localized(locale, "राशियों का अंतर", "ਰਕਮਾਂ ਦਾ ਅੰਤਰ")],
        rows: [[moneyMath(state.principal), rateMath(state.ratePercent), cp003YearsText(locale, state.earlierYear), cp003YearsText(locale, state.laterYear), "?"]],
      };
    case "INT-QL-066":
      return {
        headers: [earlierYear, localized(locale, "पहले दिए गए वर्ष का ब्याज", "ਪਹਿਲਾਂ ਦਿੱਤੇ ਸਾਲ ਦਾ ਵਿਆਜ"), rate, laterYear, localized(locale, "बाद वाले वर्ष का ब्याज", "ਬਾਅਦ ਵਾਲੇ ਸਾਲ ਦਾ ਵਿਆਜ")],
        rows: [[earlierOrdinal, moneyMath(state.earlierInterest), rateMath(state.ratePercent), laterOrdinal, "?"]],
      };
    default:
      throw new Error(`${source.qlId}: unsupported Wave 2 table presentation.`);
  }
}

function prosePrompt(
  source: IntCp003EnglishFrozenQuestion,
  locale: IntCp003LocalizedLocale,
): string {
  const state = resolve(source.mathematicalState);
  const principal = moneyMath(state.principal);
  const rate = rateMath(state.ratePercent);
  const targetYear = cp003OrdinalYearText(locale, state.targetYear);
  const earlierYear = cp003OrdinalYearText(locale, state.earlierYear);
  const laterYear = cp003OrdinalYearText(locale, state.laterYear);
  const annually = cp003CompoundedAnnuallyText(locale);
  const previousBalance = amount(state.principal, state.ratePercent, state.currentYear - 1);

  if (locale === "hi-IN") {
    switch (source.qlId) {
      case "INT-QL-059":
        return `${principal} को ${rate} वार्षिक दर से निवेश किया गया है। ${annually}। ${targetYear} में प्राप्त ब्याज ज्ञात कीजिए।`;
      case "INT-QL-060":
        return `${rate} वार्षिक दर पर ${targetYear} का ब्याज ${moneyMath(state.nthYearInterest)} है। ${annually}। मूलधन ज्ञात कीजिए।`;
      case "INT-QL-061":
        return `${principal} पर ${targetYear} का ब्याज ${moneyMath(state.nthYearInterest)} है। ${annually}। वार्षिक ब्याज दर ज्ञात कीजिए।`;
      case "INT-QL-062":
        return `${state.currentYear} वर्ष के अंत में शेष राशि ${moneyMath(state.currentAmount)} है। वार्षिक दर ${rate} है और ${annually}। इससे एक वर्ष पहले की शेष राशि ज्ञात कीजिए।`;
      case "INT-QL-063":
        return `एक वर्ष में शेष राशि ${moneyMath(previousBalance)} से बढ़कर ${moneyMath(state.currentAmount)} हो जाती है। ${annually}। वार्षिक ब्याज दर ज्ञात कीजिए।`;
      case "INT-QL-064":
        return `एक राशि ${state.currentYear} वर्ष बाद ${moneyMath(state.currentAmount)} तथा ${state.currentYear + 1} वर्ष बाद ${moneyMath(state.nextAmount)} हो जाती है। ${annually}। मूल राशि ज्ञात कीजिए।`;
      case "INT-QL-065":
        return `${principal} को ${rate} वार्षिक दर से निवेश किया गया है। ${annually}। ${cp003YearsText(locale, state.earlierYear)} और ${cp003YearsText(locale, state.laterYear)} बाद की राशियों का अंतर ज्ञात कीजिए।`;
      case "INT-QL-066":
        return `${rate} वार्षिक दर पर ${earlierYear} का ब्याज ${moneyMath(state.earlierInterest)} है। ${annually}। ${laterYear} का ब्याज ज्ञात कीजिए।`;
      default:
        throw new Error(`${source.qlId}: unsupported Hindi Wave 2 prose presentation.`);
    }
  }

  switch (source.qlId) {
    case "INT-QL-059":
      return `${principal} ਨੂੰ ${rate} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ਨਿਵੇਸ਼ ਕੀਤਾ ਗਿਆ ਹੈ। ${annually}। ${targetYear} ਵਿੱਚ ਮਿਲਣ ਵਾਲਾ ਵਿਆਜ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-060":
      return `${rate} ਸਾਲਾਨਾ ਦਰ ਉੱਤੇ ${targetYear} ਦਾ ਵਿਆਜ ${moneyMath(state.nthYearInterest)} ਹੈ। ${annually}। ਮੂਲਧਨ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-061":
      return `${principal} ਉੱਤੇ ${targetYear} ਦਾ ਵਿਆਜ ${moneyMath(state.nthYearInterest)} ਹੈ। ${annually}। ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-062":
      return `${state.currentYear} ਸਾਲ ਦੇ ਅੰਤ ਵਿੱਚ ਬਕਾਇਆ ਰਕਮ ${moneyMath(state.currentAmount)} ਹੈ। ਸਾਲਾਨਾ ਦਰ ${rate} ਹੈ ਅਤੇ ${annually}। ਇਸ ਤੋਂ ਇੱਕ ਸਾਲ ਪਹਿਲਾਂ ਦੀ ਬਕਾਇਆ ਰਕਮ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-063":
      return `ਇੱਕ ਸਾਲ ਵਿੱਚ ਬਕਾਇਆ ਰਕਮ ${moneyMath(previousBalance)} ਤੋਂ ਵੱਧ ਕੇ ${moneyMath(state.currentAmount)} ਹੋ ਜਾਂਦੀ ਹੈ। ${annually}। ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-064":
      return `ਇੱਕ ਰਕਮ ${state.currentYear} ਸਾਲ ਬਾਅਦ ${moneyMath(state.currentAmount)} ਅਤੇ ${state.currentYear + 1} ਸਾਲ ਬਾਅਦ ${moneyMath(state.nextAmount)} ਹੋ ਜਾਂਦੀ ਹੈ। ${annually}। ਮੂਲ ਰਕਮ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-065":
      return `${principal} ਨੂੰ ${rate} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ਨਿਵੇਸ਼ ਕੀਤਾ ਗਿਆ ਹੈ। ${annually}। ${cp003YearsText(locale, state.earlierYear)} ਅਤੇ ${cp003YearsText(locale, state.laterYear)} ਬਾਅਦ ਦੀਆਂ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-066":
      return `${rate} ਸਾਲਾਨਾ ਦਰ ਉੱਤੇ ${earlierYear} ਦਾ ਵਿਆਜ ${moneyMath(state.earlierInterest)} ਹੈ। ${annually}। ${laterYear} ਦਾ ਵਿਆਜ ਪਤਾ ਕਰੋ।`;
    default:
      throw new Error(`${source.qlId}: unsupported Punjabi Wave 2 prose presentation.`);
  }
}

function structuredPrompt(
  source: IntCp003EnglishFrozenQuestion,
  locale: IntCp003LocalizedLocale,
): string {
  switch (source.qlId) {
    case "INT-QL-059": return cp003FindPrompt(locale, cp003Term(locale, "INTEREST_IN_YEAR"));
    case "INT-QL-060": return cp003FindPrompt(locale, cp003Term(locale, "PRINCIPAL"));
    case "INT-QL-061": return cp003FindPrompt(locale, cp003Term(locale, "ANNUAL_RATE"));
    case "INT-QL-062": return cp003FindPrompt(locale, localized(locale, "पिछले वर्ष की शेष राशि", "ਪਿਛਲੇ ਸਾਲ ਦੀ ਬਕਾਇਆ ਰਕਮ"));
    case "INT-QL-063": return cp003FindPrompt(locale, cp003Term(locale, "ANNUAL_RATE"));
    case "INT-QL-064": return cp003FindPrompt(locale, cp003Term(locale, "ORIGINAL_SUM"));
    case "INT-QL-065": return cp003FindPrompt(locale, localized(locale, "दोनों राशियों का अंतर", "ਦੋਵੇਂ ਰਕਮਾਂ ਦਾ ਅੰਤਰ"));
    case "INT-QL-066": return cp003FindPrompt(locale, cp003Term(locale, "INTEREST_IN_YEAR"));
    default: throw new Error(`${source.qlId}: unsupported Wave 2 prompt.`);
  }
}

export function renderCp003LocalizedPresentationWave2(
  source: IntCp003EnglishFrozenQuestion,
  locale: IntCp003LocalizedLocale,
): IntCp003LocalizedPresentation {
  if (!isWave2QlId(source.qlId)) {
    throw new Error(`${source.qlId}: not owned by CP-003 localisation presentation Wave 2.`);
  }
  if (source.presentation.representation === "STANDARD_PROSE") {
    return buildPresentation(source, locale, undefined, undefined, prosePrompt(source, locale));
  }
  return buildPresentation(
    source,
    locale,
    leadForRepresentation(locale, source.presentation.representation),
    tableFor(source, locale),
    structuredPrompt(source, locale),
  );
}
