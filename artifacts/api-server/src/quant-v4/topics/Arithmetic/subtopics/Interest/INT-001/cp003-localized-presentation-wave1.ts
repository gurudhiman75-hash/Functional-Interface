import type { IntCp003QlId } from "./cp003-exam-model";
import type { IntCp003EnglishFrozenQuestion } from "./cp003-english-frozen-runtime";
import { moneyMath, rateMath, resolve, tableMarkdown } from "./cp003-exam-support";
import {
  assertCp003LocalizedText,
  cp003CompoundedAnnuallyText,
  cp003FindPrompt,
  cp003Term,
  cp003YearsText,
} from "./cp003-localization-language-pack";
import type {
  IntCp003LocalizedLocale,
  IntCp003LocalizedPresentation,
  IntCp003LocalizedPresentationTable,
} from "./cp003-localization-types";

export const INT_CP003_PRESENTATION_WAVE1_QL_IDS = Object.freeze([
  "INT-QL-053",
  "INT-QL-054",
  "INT-QL-055",
  "INT-QL-056",
  "INT-QL-057",
  "INT-QL-058",
] as const satisfies readonly IntCp003QlId[]);

export type IntCp003PresentationWave1QlId = typeof INT_CP003_PRESENTATION_WAVE1_QL_IDS[number];

function isWave1QlId(qlId: IntCp003QlId): qlId is IntCp003PresentationWave1QlId {
  return (INT_CP003_PRESENTATION_WAVE1_QL_IDS as readonly IntCp003QlId[]).includes(qlId);
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
  if (locale === "hi-IN") {
    switch (representation) {
      case "ACCOUNT_TABLE": return "निवेश का विवरण नीचे दिया गया है।";
      case "BALANCE_LEDGER": return "वर्षवार राशि का विवरण नीचे दिया गया है।";
      case "GROWTH_RATIO": return "मूल राशि और अंतिम राशि से संबंधित विवरण नीचे दिया गया है।";
      case "BANK_STATEMENT": return "सावधि निवेश का विवरण नीचे दिया गया है।";
      case "MISSING_ENTRY": return "तालिका की एक प्रविष्टि रिक्त है।";
      case "STANDARD_PROSE": return "";
    }
  }
  switch (representation) {
    case "ACCOUNT_TABLE": return "ਨਿਵੇਸ਼ ਦਾ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ।";
    case "BALANCE_LEDGER": return "ਸਾਲ-ਵਾਰ ਰਕਮ ਦਾ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ।";
    case "GROWTH_RATIO": return "ਮੂਲ ਰਕਮ ਅਤੇ ਅੰਤਿਮ ਰਕਮ ਨਾਲ ਸੰਬੰਧਿਤ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ।";
    case "BANK_STATEMENT": return "ਮਿਆਦੀ ਨਿਵੇਸ਼ ਦਾ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ।";
    case "MISSING_ENTRY": return "ਸਾਰਣੀ ਦੀ ਇੱਕ ਐਂਟਰੀ ਖਾਲੀ ਹੈ।";
    case "STANDARD_PROSE": return "";
  }
}

function tableFor(
  source: IntCp003EnglishFrozenQuestion,
  locale: IntCp003LocalizedLocale,
): IntCp003LocalizedPresentationTable {
  const resolved = resolve(source.mathematicalState);
  const principal = cp003Term(locale, "PRINCIPAL");
  const originalSum = cp003Term(locale, "ORIGINAL_SUM");
  const rate = cp003Term(locale, "ANNUAL_RATE");
  const time = cp003Term(locale, "TIME");
  const amount = cp003Term(locale, "FINAL_AMOUNT");
  const compoundInterest = cp003Term(locale, "COMPOUND_INTEREST");
  const years = cp003YearsText(locale, resolved.years);

  switch (source.qlId) {
    case "INT-QL-053":
      return {
        headers: [principal, rate, time, amount],
        rows: [[moneyMath(resolved.principal), rateMath(resolved.ratePercent), years, "?"]],
      };
    case "INT-QL-054":
      return {
        headers: [principal, rate, time, compoundInterest],
        rows: [[moneyMath(resolved.principal), rateMath(resolved.ratePercent), years, "?"]],
      };
    case "INT-QL-055":
      return {
        headers: [originalSum, rate, time, amount],
        rows: [["?", rateMath(resolved.ratePercent), years, moneyMath(resolved.amount)]],
      };
    case "INT-QL-056":
      return {
        headers: [principal, rate, time, compoundInterest],
        rows: [["?", rateMath(resolved.ratePercent), years, moneyMath(resolved.compoundInterest)]],
      };
    case "INT-QL-057":
      return {
        headers: [originalSum, amount, time, rate],
        rows: [[moneyMath(resolved.principal), moneyMath(resolved.amount), years, "?"]],
      };
    case "INT-QL-058":
      return {
        headers: [originalSum, rate, amount, time],
        rows: [[moneyMath(resolved.principal), rateMath(resolved.ratePercent), moneyMath(resolved.amount), "?"]],
      };
    default:
      throw new Error(`${source.qlId}: unsupported Wave 1 table presentation.`);
  }
}

function prosePrompt(
  source: IntCp003EnglishFrozenQuestion,
  locale: IntCp003LocalizedLocale,
): string {
  const resolved = resolve(source.mathematicalState);
  const principal = moneyMath(resolved.principal);
  const amount = moneyMath(resolved.amount);
  const compoundInterest = moneyMath(resolved.compoundInterest);
  const rate = rateMath(resolved.ratePercent);
  const years = cp003YearsText(locale, resolved.years);
  const annually = cp003CompoundedAnnuallyText(locale);

  if (locale === "hi-IN") {
    switch (source.qlId) {
      case "INT-QL-053":
        return `${principal} को ${rate} वार्षिक दर से ${years} के लिए निवेश किया जाता है। ${annually}। ${years} बाद प्राप्त राशि ज्ञात कीजिए।`;
      case "INT-QL-054":
        return `${principal} पर ${rate} वार्षिक दर से ${years} के लिए चक्रवृद्धि ब्याज ज्ञात कीजिए। ${annually}।`;
      case "INT-QL-055":
        return `एक राशि ${rate} वार्षिक दर से ${years} में बढ़कर ${amount} हो जाती है। ${annually}। मूल राशि ज्ञात कीजिए।`;
      case "INT-QL-056":
        return `एक मूलधन पर ${rate} वार्षिक दर से ${years} का चक्रवृद्धि ब्याज ${compoundInterest} है। ${annually}। मूलधन ज्ञात कीजिए।`;
      case "INT-QL-057":
        return `${principal} की राशि ${years} में बढ़कर ${amount} हो जाती है। ${annually}। वार्षिक ब्याज दर ज्ञात कीजिए।`;
      case "INT-QL-058":
        return `${principal} की राशि ${rate} वार्षिक दर पर बढ़कर ${amount} हो जाती है। ${annually}। समय ज्ञात कीजिए।`;
      default:
        throw new Error(`${source.qlId}: unsupported Hindi Wave 1 prose presentation.`);
    }
  }

  switch (source.qlId) {
    case "INT-QL-053":
      return `${principal} ਨੂੰ ${rate} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${years} ਲਈ ਨਿਵੇਸ਼ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ${annually}। ${years} ਬਾਅਦ ਮਿਲਣ ਵਾਲੀ ਰਕਮ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-054":
      return `${principal} ਉੱਤੇ ${rate} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${years} ਲਈ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਪਤਾ ਕਰੋ। ${annually}।`;
    case "INT-QL-055":
      return `ਇੱਕ ਰਕਮ ${rate} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${years} ਵਿੱਚ ਵੱਧ ਕੇ ${amount} ਹੋ ਜਾਂਦੀ ਹੈ। ${annually}। ਮੂਲ ਰਕਮ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-056":
      return `ਇੱਕ ਮੂਲਧਨ ਉੱਤੇ ${rate} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${years} ਦਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ${compoundInterest} ਹੈ। ${annually}। ਮੂਲਧਨ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-057":
      return `${principal} ਦੀ ਰਕਮ ${years} ਵਿੱਚ ਵੱਧ ਕੇ ${amount} ਹੋ ਜਾਂਦੀ ਹੈ। ${annually}। ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪਤਾ ਕਰੋ।`;
    case "INT-QL-058":
      return `${principal} ਦੀ ਰਕਮ ${rate} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ਵੱਧ ਕੇ ${amount} ਹੋ ਜਾਂਦੀ ਹੈ। ${annually}। ਸਮਾਂ ਪਤਾ ਕਰੋ।`;
    default:
      throw new Error(`${source.qlId}: unsupported Punjabi Wave 1 prose presentation.`);
  }
}

function structuredPrompt(
  source: IntCp003EnglishFrozenQuestion,
  locale: IntCp003LocalizedLocale,
): string {
  switch (source.qlId) {
    case "INT-QL-053": return cp003FindPrompt(locale, cp003Term(locale, "FINAL_AMOUNT"));
    case "INT-QL-054": return cp003FindPrompt(locale, cp003Term(locale, "COMPOUND_INTEREST"));
    case "INT-QL-055": return cp003FindPrompt(locale, cp003Term(locale, "ORIGINAL_SUM"));
    case "INT-QL-056": return cp003FindPrompt(locale, cp003Term(locale, "PRINCIPAL"));
    case "INT-QL-057": return cp003FindPrompt(locale, cp003Term(locale, "ANNUAL_RATE"));
    case "INT-QL-058": return cp003FindPrompt(locale, cp003Term(locale, "TIME"));
    default: throw new Error(`${source.qlId}: unsupported Wave 1 prompt.`);
  }
}

export function renderCp003LocalizedPresentationWave1(
  source: IntCp003EnglishFrozenQuestion,
  locale: IntCp003LocalizedLocale,
): IntCp003LocalizedPresentation {
  if (!isWave1QlId(source.qlId)) {
    throw new Error(`${source.qlId}: not owned by CP-003 localisation presentation Wave 1.`);
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
