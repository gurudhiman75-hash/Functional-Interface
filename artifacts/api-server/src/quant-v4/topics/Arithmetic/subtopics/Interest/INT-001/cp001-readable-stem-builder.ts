import { formatDurationYears as formatEnglishDuration } from "./foundation/cp001-presentation";
import { formatPercent, isWholeRational, multiplyRational, rational } from "./foundation/rational";
import type { Rational } from "./foundation/types";
import {
  asRecord,
  formatColonRatio,
  formatDays,
  formatDurationYears as formatLocalizedDuration,
  formatMoneyLocalized,
  formatMonths,
  inlineRational,
  readRational,
  requireRational,
  type UnknownRecord,
} from "./cp001-localization-foundation";
import {
  getIntCp001CashFlowContextV2,
} from "./cp001-cash-flow-context-v2";
import type { IntCp001CashFlowDirection } from "./cp001-cash-flow-direction";
import type { IntCp001ReadableLanguage } from "./cp001-readable-stem-release";

export type IntCp001StemAnchorSemantic =
  | "PRINCIPAL"
  | "RATE"
  | "TIME"
  | "INTEREST"
  | "AMOUNT"
  | "RATIO";

export interface IntCp001StemEmphasisSpan {
  semantic: IntCp001StemAnchorSemantic;
  text: string;
  start: number;
  end: number;
}

export interface IntCp001ReadableStemPresentation {
  plainText: string;
  richTextHtml: string;
  emphasisSpans: IntCp001StemEmphasisSpan[];
}

export interface IntCp001ReadableStemResult {
  stem: string;
  presentation: IntCp001ReadableStemPresentation;
  scenarioId: string;
  cashFlowDirection: IntCp001CashFlowDirection;
}

type AnchorInput = {
  semantic: IntCp001StemAnchorSemantic;
  text: string;
};

type ContextData = {
  scenarioId: string;
  actor: string;
  institution: string;
  instrument: string;
};

const ACTOR_NAMES: Record<IntCp001ReadableLanguage, Record<string, string>> = {
  en: {
    Meera: "Meera", Harpreet: "Harpreet", Aman: "Aman", Gurleen: "Gurleen",
    Ravi: "Ravi", Simran: "Simran", Navdeep: "Navdeep", Kiran: "Kiran",
  },
  hi: {
    Meera: "मीरा", Harpreet: "हरप्रीत", Aman: "अमन", Gurleen: "गुरलीन",
    Ravi: "रवि", Simran: "सिमरन", Navdeep: "नवदीप", Kiran: "किरण",
  },
  pa: {
    Meera: "ਮੀਰਾ", Harpreet: "ਹਰਪ੍ਰੀਤ", Aman: "ਅਮਨ", Gurleen: "ਗੁਰਲੀਨ",
    Ravi: "ਰਵੀ", Simran: "ਸਿਮਰਨ", Navdeep: "ਨਵਦੀਪ", Kiran: "ਕਿਰਨ",
  },
};

function htmlEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function presentation(stem: string, anchors: readonly AnchorInput[]): IntCp001ReadableStemPresentation {
  const spans: IntCp001StemEmphasisSpan[] = [];
  const occupied: Array<[number, number]> = [];

  for (const anchor of anchors) {
    if (!anchor.text) continue;
    let from = 0;
    while (from < stem.length) {
      const start = stem.indexOf(anchor.text, from);
      if (start < 0) break;
      const end = start + anchor.text.length;
      const overlaps = occupied.some(([left, right]) => start < right && end > left);
      if (!overlaps) {
        spans.push({ ...anchor, start, end });
        occupied.push([start, end]);
        break;
      }
      from = end;
    }
  }

  spans.sort((left, right) => left.start - right.start || left.end - right.end);
  let html = "<p>";
  let cursor = 0;
  for (const span of spans) {
    html += htmlEscape(stem.slice(cursor, span.start));
    html += `<strong data-int-semantic="${span.semantic}">${htmlEscape(span.text)}</strong>`;
    cursor = span.end;
  }
  html += `${htmlEscape(stem.slice(cursor))}</p>`;

  return {
    plainText: stem,
    richTextHtml: html,
    emphasisSpans: spans,
  };
}

function sourceRecords(sourceParameters: unknown) {
  const parameters = asRecord(sourceParameters) ?? {};
  return {
    parameters,
    context: asRecord(parameters.context) ?? {},
    hidden: asRecord(parameters.hiddenState) ?? {},
    display: asRecord(parameters.display) ?? {},
    request: asRecord(parameters.request) ?? {},
  };
}

function contextData(sourceParameters: unknown, language: IntCp001ReadableLanguage): ContextData {
  const { context } = sourceRecords(sourceParameters);
  const actorKey = typeof context.actor === "string" ? context.actor : "";
  return {
    scenarioId: typeof context.scenarioId === "string" ? context.scenarioId : "NEUTRAL",
    actor: ACTOR_NAMES[language][actorKey]
      ?? (language === "en" ? "A person" : language === "hi" ? "एक व्यक्ति" : "ਇੱਕ ਵਿਅਕਤੀ"),
    institution: typeof context.institution === "string" ? context.institution : "a financial institution",
    instrument: typeof context.instrument === "string" ? context.instrument : "sum",
  };
}

function hindiAction(context: ContextData, principal?: string): string {
  const p = principal ? `${principal} का ` : "";
  switch (context.scenarioId) {
    case "FIXED_DEPOSIT": return `${context.actor} ने सहकारी बैंक में ${principal ? `${principal} की ` : ""}सावधि जमा की`;
    case "POST_OFFICE":
    case "POST_OFFICE_DEPOSIT": return `${context.actor} ने डाकघर में ${principal ? `${principal} की ` : ""}मियादी जमा की`;
    case "SAVINGS_CERTIFICATE": return `${context.actor} ने बचत सहकारी संस्था से ${p}बचत प्रमाणपत्र लिया`;
    case "EDUCATION_LOAN": return `${context.actor} ने क्षेत्रीय बैंक से ${p}शिक्षा ऋण लिया`;
    case "CROP_LOAN": return `${context.actor} ने ग्रामीण ऋण समिति से ${p}फसल ऋण लिया`;
    case "EQUIPMENT_LOAN": return `${context.actor} ने जिला बैंक से ${p}उपकरण ऋण लिया`;
    case "BUSINESS_ADVANCE": return `${context.actor} ने स्थानीय वित्त कार्यालय से ${p}व्यावसायिक अग्रिम ऋण लिया`;
    case "COMMUNITY_LOAN": return `${context.actor} ने सामुदायिक ऋण समूह से ${p}सदस्य ऋण लिया`;
    case "PERSONAL_LENDING": return principal
      ? `${context.actor} ने निजी ऋण समझौते के तहत ${principal} उधार लिए`
      : `${context.actor} ने निजी ऋण समझौते के तहत धन उधार लिया`;
    case "PERSONAL_AGREEMENT": return `${context.actor} ने वित्त कार्यालय से ${p}ऋण लिया`;
    default: return principal
      ? `${context.actor} ने ${principal} का निवेश किया`
      : `${context.actor} ने एक राशि का निवेश किया`;
  }
}

function punjabiAction(context: ContextData, principal?: string): string {
  const p = principal ? `${principal} ਦਾ ` : "";
  switch (context.scenarioId) {
    case "FIXED_DEPOSIT": return `${context.actor} ਨੇ ਸਹਿਕਾਰੀ ਬੈਂਕ ਵਿੱਚ ${principal ? `${principal} ਦੀ ` : ""}ਮਿਆਦੀ ਜਮ੍ਹਾ ਕਰਵਾਈ`;
    case "POST_OFFICE":
    case "POST_OFFICE_DEPOSIT": return `${context.actor} ਨੇ ਡਾਕਘਰ ਵਿੱਚ ${principal ? `${principal} ਦੀ ` : ""}ਮਿਆਦੀ ਜਮ੍ਹਾ ਕਰਵਾਈ`;
    case "SAVINGS_CERTIFICATE": return `${context.actor} ਨੇ ਬਚਤ ਸਹਿਕਾਰੀ ਸਭਾ ਤੋਂ ${p}ਬਚਤ ਸਰਟੀਫਿਕੇਟ ਲਿਆ`;
    case "EDUCATION_LOAN": return `${context.actor} ਨੇ ਖੇਤਰੀ ਬੈਂਕ ਤੋਂ ${p}ਸਿੱਖਿਆ ਕਰਜ਼ਾ ਲਿਆ`;
    case "CROP_LOAN": return `${context.actor} ਨੇ ਪੇਂਡੂ ਕਰਜ਼ਾ ਸਭਾ ਤੋਂ ${p}ਫਸਲੀ ਕਰਜ਼ਾ ਲਿਆ`;
    case "EQUIPMENT_LOAN": return `${context.actor} ਨੇ ਜ਼ਿਲ੍ਹਾ ਬੈਂਕ ਤੋਂ ${p}ਸਾਜ਼ੋ-ਸਾਮਾਨ ਕਰਜ਼ਾ ਲਿਆ`;
    case "BUSINESS_ADVANCE": return `${context.actor} ਨੇ ਸਥਾਨਕ ਵਿੱਤ ਦਫ਼ਤਰ ਤੋਂ ${p}ਕਾਰੋਬਾਰੀ ਅਗਾਊਂ ਕਰਜ਼ਾ ਲਿਆ`;
    case "COMMUNITY_LOAN": return `${context.actor} ਨੇ ਸਥਾਨਕ ਕਰਜ਼ਾ ਸਮੂਹ ਤੋਂ ${p}ਮੈਂਬਰ ਕਰਜ਼ਾ ਲਿਆ`;
    case "PERSONAL_LENDING": return principal
      ? `${context.actor} ਨੇ ਨਿੱਜੀ ਕਰਜ਼ਾ ਸਮਝੌਤੇ ਤਹਿਤ ${principal} ਉਧਾਰ ਲਏ`
      : `${context.actor} ਨੇ ਨਿੱਜੀ ਕਰਜ਼ਾ ਸਮਝੌਤੇ ਤਹਿਤ ਰਕਮ ਉਧਾਰ ਲਈ`;
    case "PERSONAL_AGREEMENT": return `${context.actor} ਨੇ ਵਿੱਤ ਦਫ਼ਤਰ ਤੋਂ ${p}ਕਰਜ਼ਾ ਲਿਆ`;
    default: return principal
      ? `${context.actor} ਨੇ ${principal} ਦਾ ਨਿਵੇਸ਼ ਕੀਤਾ`
      : `${context.actor} ਨੇ ਇੱਕ ਰਕਮ ਦਾ ਨਿਵੇਸ਼ ਕੀਤਾ`;
  }
}

function englishAction(context: ContextData, principal?: string): string {
  const institution = context.institution;
  switch (context.scenarioId) {
    case "FIXED_DEPOSIT": return principal
      ? `${context.actor} invested ${principal} in a fixed deposit with ${institution}`
      : `${context.actor} opened a fixed deposit with ${institution}`;
    case "POST_OFFICE":
    case "POST_OFFICE_DEPOSIT": return principal
      ? `${context.actor} placed ${principal} in a term deposit at ${institution}`
      : `${context.actor} opened a term deposit at ${institution}`;
    case "SAVINGS_CERTIFICATE": return principal
      ? `${context.actor} invested ${principal} in a savings certificate with ${institution}`
      : `${context.actor} bought a savings certificate from ${institution}`;
    case "EDUCATION_LOAN": return `${context.actor} took ${principal ? `an education loan of ${principal}` : "an education loan"} from ${institution}`;
    case "CROP_LOAN": return `${context.actor} took ${principal ? `a crop loan of ${principal}` : "a crop loan"} from ${institution}`;
    case "EQUIPMENT_LOAN": return `${context.actor} took ${principal ? `an equipment loan of ${principal}` : "an equipment loan"} from ${institution}`;
    case "BUSINESS_ADVANCE": return `${context.actor} took ${principal ? `a business advance of ${principal}` : "a business advance"} from ${institution}`;
    case "COMMUNITY_LOAN": return `${context.actor} took ${principal ? `a member loan of ${principal}` : "a member loan"} from ${institution}`;
    case "PERSONAL_LENDING": return principal
      ? `${context.actor} borrowed ${principal} under a private lending agreement`
      : `${context.actor} borrowed money under a private lending agreement`;
    case "PERSONAL_AGREEMENT": return `${context.actor} took ${principal ? `a loan of ${principal}` : "a loan"} from ${institution}`;
    default: return principal
      ? `${context.actor} invested ${principal} with ${institution}`
      : `${context.actor} made an investment with ${institution}`;
  }
}

function action(language: IntCp001ReadableLanguage, context: ContextData, principal?: string): string {
  if (language === "hi") return hindiAction(context, principal);
  if (language === "pa") return punjabiAction(context, principal);
  return englishAction(context, principal);
}

function money(value: Rational): string {
  return formatMoneyLocalized(value);
}

function rate(value: Rational): string {
  return formatPercent(value);
}

function ratio(value: Rational): string {
  return value.denominator === 1n ? value.numerator.toString() : inlineRational(value);
}

function duration(value: Rational, language: IntCp001ReadableLanguage): string {
  if (language === "en") return formatEnglishDuration(value);
  return formatLocalizedDuration(value, language);
}

function durationFromDisplay(
  value: Rational,
  display: UnknownRecord,
  language: IntCp001ReadableLanguage,
): { text: string; dayBasis: boolean } {
  if (typeof display.displayedDays === "number") {
    return {
      text: language === "en"
        ? `${display.displayedDays} days`
        : formatDays(display.displayedDays, language),
      dayBasis: true,
    };
  }
  if (typeof display.displayedMonths === "number") {
    return {
      text: language === "en"
        ? `${display.displayedMonths} ${display.displayedMonths === 1 ? "month" : "months"}`
        : formatMonths(display.displayedMonths, language),
      dayBasis: false,
    };
  }
  if (display.timePresentation === "MONTHS") {
    const months = multiplyRational(value, rational(12));
    if (isWholeRational(months)) {
      return {
        text: language === "en"
          ? `${months.numerator} ${months.numerator === 1n ? "month" : "months"}`
          : formatMonths(months.numerator, language),
        dayBasis: false,
      };
    }
  }
  return { text: duration(value, language), dayBasis: false };
}

function dayBasisSuffix(language: IntCp001ReadableLanguage, enabled: boolean): string {
  if (!enabled) return "";
  if (language === "hi") return " (365 दिन का वर्ष मानकर)";
  if (language === "pa") return " (365 ਦਿਨਾਂ ਦਾ ਸਾਲ ਮੰਨ ਕੇ)";
  return " (using a 365-day year)";
}

function knownTargetTimes(request: UnknownRecord, language: IntCp001ReadableLanguage) {
  const known = readRational(request, "knownTimeYears") ?? readRational(request, "timeYears")!;
  const target = readRational(request, "targetTimeYears") ?? rational(1);
  return { known: duration(known, language), target: duration(target, language) };
}

function amountPhrase(direction: IntCp001CashFlowDirection, language: IntCp001ReadableLanguage): string {
  if (language === "hi") return direction === "BORROWER_PAYS" ? "कुल देय राशि" : "कुल राशि";
  if (language === "pa") return direction === "BORROWER_PAYS" ? "ਕੁੱਲ ਦੇਣ ਵਾਲੀ ਰਕਮ" : "ਕੁੱਲ ਰਕਮ";
  return direction === "BORROWER_PAYS" ? "total amount payable" : "amount";
}

function interestVerb(direction: IntCp001CashFlowDirection, language: IntCp001ReadableLanguage) {
  if (language === "hi") {
    return direction === "BORROWER_PAYS"
      ? { past: "ब्याज चुकाया", future: "ब्याज देना होगा", noun: "देय ब्याज" }
      : { past: "ब्याज मिला", future: "ब्याज मिलेगा", noun: "मिलने वाला ब्याज" };
  }
  if (language === "pa") {
    return direction === "BORROWER_PAYS"
      ? { past: "ਵਿਆਜ ਦਿੱਤਾ", future: "ਵਿਆਜ ਦੇਣਾ ਪਵੇਗਾ", noun: "ਦੇਣਾ ਪੈਣ ਵਾਲਾ ਵਿਆਜ" }
      : { past: "ਵਿਆਜ ਮਿਲਿਆ", future: "ਵਿਆਜ ਮਿਲੇਗਾ", noun: "ਮਿਲਣ ਵਾਲਾ ਵਿਆਜ" };
  }
  return direction === "BORROWER_PAYS"
    ? { past: "paid as interest", future: "must be paid as interest", noun: "interest payable" }
    : { past: "earned as interest", future: "will be earned as interest", noun: "interest earned" };
}

export function buildIntCp001ReadableStem(
  solveContract: string,
  sourceParameters: unknown,
  language: IntCp001ReadableLanguage,
): IntCp001ReadableStemResult {
  const { hidden, display, request } = sourceRecords(sourceParameters);
  const context = contextData(sourceParameters, language);
  const cashFlow = getIntCp001CashFlowContextV2(sourceParameters);
  const direction = cashFlow.direction;
  const verbs = interestVerb(direction, language);

  const P = money(requireRational(hidden, "principal"));
  const I = money(requireRational(hidden, "simpleInterest"));
  const A = money(requireRational(hidden, "amount"));
  const R = rate(requireRational(hidden, "annualRatePercent"));
  const timeValue = requireRational(hidden, "timeYears");
  const shownTime = durationFromDisplay(timeValue, display, language);
  const T = shownTime.text;
  const basis = dayBasisSuffix(language, shownTime.dayBasis);
  const amountNoun = amountPhrase(direction, language);
  const anchors: AnchorInput[] = [];
  let stem = "";

  const add = (semantic: IntCp001StemAnchorSemantic, ...values: string[]) => {
    for (const text of values) anchors.push({ semantic, text });
  };

  switch (solveContract) {
    case "FIND_SIMPLE_INTEREST_FROM_PRT": {
      if (language === "hi") {
        stem = `${action(language, context, P)}। ${R} वार्षिक साधारण ब्याज की दर से ${T}${basis} बाद कितना ${direction === "BORROWER_PAYS" ? "ब्याज देना होगा" : "ब्याज मिलेगा"}?`;
      } else if (language === "pa") {
        stem = `${action(language, context, P)}। ${R} ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਦਰ ਨਾਲ ${T}${basis} ਬਾਅਦ ਕਿੰਨਾ ${direction === "BORROWER_PAYS" ? "ਵਿਆਜ ਦੇਣਾ ਪਵੇਗਾ" : "ਵਿਆਜ ਮਿਲੇਗਾ"}?`;
      } else {
        stem = `${action(language, context, P)} at ${R} per annum simple interest. How much ${verbs.future} after ${T}${basis}?`;
      }
      add("PRINCIPAL", P); add("RATE", R); add("TIME", T);
      break;
    }

    case "FIND_AMOUNT_FROM_PRT": {
      if (language === "hi") {
        stem = `${action(language, context, P)}। ${R} वार्षिक साधारण ब्याज की दर से ${T} बाद ${amountNoun} कितनी होगी?`;
      } else if (language === "pa") {
        stem = `${action(language, context, P)}। ${R} ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਦਰ ਨਾਲ ${T} ਬਾਅਦ ${amountNoun} ਕਿੰਨੀ ਹੋਵੇਗੀ?`;
      } else {
        stem = `${action(language, context, P)} at ${R} per annum simple interest. What will the ${amountNoun} be after ${T}?`;
      }
      add("PRINCIPAL", P); add("RATE", R); add("TIME", T);
      break;
    }

    case "FIND_PRINCIPAL_FROM_INTEREST": {
      if (language === "hi") {
        stem = `${action(language, context)}। ${R} वार्षिक साधारण ब्याज की दर से ${T} में ${I} ${verbs.past}। मूलधन कितना था?`;
      } else if (language === "pa") {
        stem = `${action(language, context)}। ${R} ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਦਰ ਨਾਲ ${T} ਵਿੱਚ ${I} ${verbs.past}। ਮੂਲਧਨ ਕਿੰਨਾ ਸੀ?`;
      } else {
        stem = `${action(language, context)} at ${R} per annum simple interest and ${I} was ${verbs.past} over ${T}. What was the original principal?`;
      }
      add("RATE", R); add("TIME", T); add("INTEREST", I);
      break;
    }

    case "FIND_PRINCIPAL_FROM_AMOUNT": {
      if (language === "hi") {
        stem = `${action(language, context)}। ${R} वार्षिक साधारण ब्याज की दर से ${T} बाद ${amountNoun} ${A} थी। मूलधन कितना था?`;
      } else if (language === "pa") {
        stem = `${action(language, context)}। ${R} ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਦਰ ਨਾਲ ${T} ਬਾਅਦ ${amountNoun} ${A} ਸੀ। ਮੂਲਧਨ ਕਿੰਨਾ ਸੀ?`;
      } else {
        stem = `${action(language, context)} at ${R} per annum simple interest. The ${amountNoun} after ${T} was ${A}. What was the original principal?`;
      }
      add("RATE", R); add("TIME", T); add("AMOUNT", A);
      break;
    }

    case "FIND_RATE_FROM_INTEREST": {
      if (language === "hi") {
        stem = `${action(language, context, P)}। ${T} में ${I} ${verbs.past}। साधारण ब्याज की वार्षिक दर कितनी थी?`;
      } else if (language === "pa") {
        stem = `${action(language, context, P)}। ${T} ਵਿੱਚ ${I} ${verbs.past}। ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਸਾਲਾਨਾ ਦਰ ਕਿੰਨੀ ਸੀ?`;
      } else {
        stem = `${action(language, context, P)} and ${I} was ${verbs.past} over ${T}. What was the annual simple-interest rate?`;
      }
      add("PRINCIPAL", P); add("TIME", T); add("INTEREST", I);
      break;
    }

    case "FIND_RATE_FROM_AMOUNT": {
      if (language === "hi") {
        stem = `${action(language, context, P)}। ${T} बाद ${amountNoun} ${A} हो गई। साधारण ब्याज की वार्षिक दर कितनी थी?`;
      } else if (language === "pa") {
        stem = `${action(language, context, P)}। ${T} ਬਾਅਦ ${amountNoun} ${A} ਹੋ ਗਈ। ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਸਾਲਾਨਾ ਦਰ ਕਿੰਨੀ ਸੀ?`;
      } else {
        stem = `${action(language, context, P)}. After ${T}, the ${amountNoun} was ${A}. What was the annual simple-interest rate?`;
      }
      add("PRINCIPAL", P); add("TIME", T); add("AMOUNT", A);
      break;
    }

    case "FIND_TIME_FROM_INTEREST": {
      if (language === "hi") {
        stem = `${action(language, context, P)}। ${R} वार्षिक साधारण ब्याज की दर से ${I} ${verbs.past}। यह ब्याज कितने समय में हुआ?`;
      } else if (language === "pa") {
        stem = `${action(language, context, P)}। ${R} ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਦਰ ਨਾਲ ${I} ${verbs.past}। ਇਹ ਵਿਆਜ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਹੋਇਆ?`;
      } else {
        stem = `${action(language, context, P)} at ${R} per annum simple interest, and ${I} was ${verbs.past}. How long was the money kept?`;
      }
      add("PRINCIPAL", P); add("RATE", R); add("INTEREST", I);
      break;
    }

    case "FIND_TIME_FROM_AMOUNT": {
      if (language === "hi") {
        stem = `${action(language, context, P)}। ${R} वार्षिक साधारण ब्याज की दर से ${amountNoun} ${A} हो गई। इसमें कितना समय लगा?`;
      } else if (language === "pa") {
        stem = `${action(language, context, P)}। ${R} ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਦਰ ਨਾਲ ${amountNoun} ${A} ਹੋ ਗਈ। ਇਸ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗਿਆ?`;
      } else {
        stem = `${action(language, context, P)} at ${R} per annum simple interest. The ${amountNoun} became ${A}. How long did this take?`;
      }
      add("PRINCIPAL", P); add("RATE", R); add("AMOUNT", A);
      break;
    }

    case "FIND_INTEREST_FOR_TARGET_DURATION": {
      const knownInterest = readRational(request, "totalInterest") ?? readRational(request, "simpleInterest") ?? requireRational(hidden, "simpleInterest");
      const shownInterest = money(knownInterest);
      const times = knownTargetTimes(request, language);
      if (language === "hi") {
        stem = `${action(language, context)}। ${times.known} में ${shownInterest} ${verbs.past}। उसी मूलधन और दर पर ${times.target} में कितना ${direction === "BORROWER_PAYS" ? "ब्याज देना होगा" : "ब्याज मिलेगा"}?`;
      } else if (language === "pa") {
        stem = `${action(language, context)}। ${times.known} ਵਿੱਚ ${shownInterest} ${verbs.past}। ਉਸੇ ਮੂਲਧਨ ਅਤੇ ਦਰ ਨਾਲ ${times.target} ਵਿੱਚ ਕਿੰਨਾ ${direction === "BORROWER_PAYS" ? "ਵਿਆਜ ਦੇਣਾ ਪਵੇਗਾ" : "ਵਿਆਜ ਮਿਲੇਗਾ"}?`;
      } else {
        stem = `${action(language, context)}. ${shownInterest} was ${verbs.past} over ${times.known}. How much ${verbs.future} over ${times.target} at the same principal and rate?`;
      }
      add("INTEREST", shownInterest); add("TIME", times.known, times.target);
      break;
    }

    case "FIND_RATE_FROM_AMOUNT_MULTIPLE": {
      const multiple = ratio(readRational(request, "amountMultiple") ?? requireRational(display, "amountMultiple"));
      if (language === "hi") {
        stem = `${action(language, context)}। ${T} बाद ${amountNoun}, मूलधन की ${multiple} गुना हो जाती है। साधारण ब्याज की वार्षिक दर कितनी है?`;
      } else if (language === "pa") {
        stem = `${action(language, context)}। ${T} ਬਾਅਦ ${amountNoun}, ਮੂਲਧਨ ਦੀ ${multiple} ਗੁਣਾ ਹੋ ਜਾਂਦੀ ਹੈ। ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਸਾਲਾਨਾ ਦਰ ਕਿੰਨੀ ਹੈ?`;
      } else {
        stem = `${action(language, context)}. After ${T}, the ${amountNoun} is ${multiple} times the principal. What is the annual simple-interest rate?`;
      }
      add("TIME", T); add("RATIO", multiple);
      break;
    }

    case "FIND_TIME_FROM_AMOUNT_MULTIPLE": {
      const multiple = ratio(readRational(request, "amountMultiple") ?? requireRational(display, "amountMultiple"));
      if (language === "hi") {
        stem = `${action(language, context)}। ${R} वार्षिक साधारण ब्याज की दर से ${amountNoun}, मूलधन की ${multiple} गुना कब होगी?`;
      } else if (language === "pa") {
        stem = `${action(language, context)}। ${R} ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਦਰ ਨਾਲ ${amountNoun}, ਮੂਲਧਨ ਦੀ ${multiple} ਗੁਣਾ ਕਦੋਂ ਹੋਵੇਗੀ?`;
      } else {
        stem = `${action(language, context)} at ${R} per annum simple interest. After how long will the ${amountNoun} be ${multiple} times the principal?`;
      }
      add("RATE", R); add("RATIO", multiple);
      break;
    }

    case "FIND_TIME_FROM_INTEREST_RATIO": {
      const fraction = ratio(readRational(request, "interestToPrincipalRatio") ?? requireRational(display, "interestToPrincipalRatio"));
      if (language === "hi") {
        stem = `${action(language, context)}। ${R} वार्षिक साधारण ब्याज की दर से ${verbs.noun}, मूलधन का ${fraction} भाग कब होगा?`;
      } else if (language === "pa") {
        stem = `${action(language, context)}। ${R} ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਦਰ ਨਾਲ ${verbs.noun}, ਮੂਲਧਨ ਦਾ ${fraction} ਹਿੱਸਾ ਕਦੋਂ ਹੋਵੇਗਾ?`;
      } else {
        stem = `${action(language, context)} at ${R} per annum simple interest. After how long will the ${verbs.noun} equal ${fraction} of the principal?`;
      }
      add("RATE", R); add("RATIO", fraction);
      break;
    }

    case "FIND_RATE_FROM_INTEREST_RATIO": {
      const fraction = ratio(readRational(request, "interestToPrincipalRatio") ?? requireRational(display, "interestToPrincipalRatio"));
      if (language === "hi") {
        stem = `${action(language, context)}। ${T} में ${verbs.noun}, मूलधन का ${fraction} भाग है। साधारण ब्याज की वार्षिक दर कितनी है?`;
      } else if (language === "pa") {
        stem = `${action(language, context)}। ${T} ਵਿੱਚ ${verbs.noun}, ਮੂਲਧਨ ਦਾ ${fraction} ਹਿੱਸਾ ਹੈ। ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਸਾਲਾਨਾ ਦਰ ਕਿੰਨੀ ਹੈ?`;
      } else {
        stem = `${action(language, context)}. Over ${T}, the ${verbs.noun} equals ${fraction} of the principal. What is the annual simple-interest rate?`;
      }
      add("TIME", T); add("RATIO", fraction);
      break;
    }

    case "FIND_ANNUAL_INTEREST_FROM_TWO_AMOUNTS":
    case "FIND_PRINCIPAL_FROM_TWO_AMOUNTS":
    case "FIND_RATE_FROM_TWO_AMOUNTS": {
      const t1 = duration(requireRational(hidden, "earlierTimeYears"), language);
      const t2 = duration(requireRational(hidden, "laterTimeYears"), language);
      const a1 = money(requireRational(hidden, "earlierAmount"));
      const a2 = money(requireRational(hidden, "laterAmount"));
      const question = solveContract === "FIND_ANNUAL_INTEREST_FROM_TWO_AMOUNTS"
        ? language === "hi" ? "एक वर्ष का साधारण ब्याज कितना है?" : language === "pa" ? "ਇੱਕ ਸਾਲ ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਕਿੰਨਾ ਹੈ?" : "How much simple interest applies in one year?"
        : solveContract === "FIND_PRINCIPAL_FROM_TWO_AMOUNTS"
          ? language === "hi" ? "मूलधन कितना था?" : language === "pa" ? "ਮੂਲਧਨ ਕਿੰਨਾ ਸੀ?" : "What was the principal?"
          : language === "hi" ? "साधारण ब्याज की वार्षिक दर कितनी है?" : language === "pa" ? "ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਸਾਲਾਨਾ ਦਰ ਕਿੰਨੀ ਹੈ?" : "What is the annual simple-interest rate?";
      if (language === "hi") {
        stem = `${action(language, context)}। ${amountNoun} ${t1} बाद ${a1} और ${t2} बाद ${a2} है। ${question}`;
      } else if (language === "pa") {
        stem = `${action(language, context)}। ${amountNoun} ${t1} ਬਾਅਦ ${a1} ਅਤੇ ${t2} ਬਾਅਦ ${a2} ਹੈ। ${question}`;
      } else {
        stem = `${action(language, context)}. The ${amountNoun} is ${a1} after ${t1} and ${a2} after ${t2}. ${question}`;
      }
      add("TIME", t1, t2); add("AMOUNT", a1, a2);
      break;
    }

    case "FIND_RATE_FROM_TWO_TIME_AMOUNT_RATIO": {
      const earlier = duration(requireRational(hidden, "earlierTimeYears"), language);
      const later = duration(requireRational(hidden, "laterTimeYears"), language);
      const value = readRational(request, "laterToEarlierAmountRatio") ?? requireRational(display, "laterToEarlierAmountRatio");
      const comparedRatio = formatColonRatio(value);
      if (language === "hi") {
        stem = `${action(language, context)}। ${later} बाद की ${amountNoun} और ${earlier} बाद की ${amountNoun} का अनुपात ${comparedRatio} है। साधारण ब्याज की वार्षिक दर कितनी है?`;
      } else if (language === "pa") {
        stem = `${action(language, context)}। ${later} ਬਾਅਦ ਦੀ ${amountNoun} ਅਤੇ ${earlier} ਬਾਅਦ ਦੀ ${amountNoun} ਦਾ ਅਨੁਪਾਤ ${comparedRatio} ਹੈ। ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਸਾਲਾਨਾ ਦਰ ਕਿੰਨੀ ਹੈ?`;
      } else {
        stem = `${action(language, context)}. The ${amountNoun} after ${later} and after ${earlier} are in the ratio ${comparedRatio}. What is the annual simple-interest rate?`;
      }
      add("TIME", later, earlier); add("RATIO", comparedRatio);
      break;
    }

    case "FIND_AMOUNT_MULTIPLE_FROM_RATE_TIME": {
      const t = duration(readRational(request, "timeYears") ?? requireRational(hidden, "laterTimeYears"), language);
      if (language === "hi") {
        stem = `${action(language, context)}। ${R} वार्षिक साधारण ब्याज की दर से ${t} बाद ${amountNoun}, मूलधन की कितनी गुना होगी?`;
      } else if (language === "pa") {
        stem = `${action(language, context)}। ${R} ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਦਰ ਨਾਲ ${t} ਬਾਅਦ ${amountNoun}, ਮੂਲਧਨ ਦੀ ਕਿੰਨੀ ਗੁਣਾ ਹੋਵੇਗੀ?`;
      } else {
        stem = `${action(language, context)} at ${R} per annum simple interest. After ${t}, what multiple of the principal will the ${amountNoun} be?`;
      }
      add("RATE", R); add("TIME", t);
      break;
    }

    case "FIND_INTEREST_RATIO_FROM_RATE_TIME": {
      const t = duration(readRational(request, "timeYears") ?? requireRational(hidden, "laterTimeYears"), language);
      if (language === "hi") {
        stem = `${action(language, context)}। ${R} वार्षिक साधारण ब्याज की दर से ${t} में ${verbs.noun}, मूलधन का कौन-सा भाग होगा?`;
      } else if (language === "pa") {
        stem = `${action(language, context)}। ${R} ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਦਰ ਨਾਲ ${t} ਵਿੱਚ ${verbs.noun}, ਮੂਲਧਨ ਦਾ ਕਿਹੜਾ ਹਿੱਸਾ ਹੋਵੇਗਾ?`;
      } else {
        stem = `${action(language, context)} at ${R} per annum simple interest. After ${t}, what fraction of the principal will the ${verbs.noun} be?`;
      }
      add("RATE", R); add("TIME", t);
      break;
    }

    case "FIND_AMOUNT_AT_ANOTHER_TIME": {
      const knownAmount = money(readRational(request, "knownAmount") ?? requireRational(hidden, "earlierAmount"));
      const knownTime = duration(readRational(request, "knownTimeYears") ?? requireRational(hidden, "earlierTimeYears"), language);
      const targetTime = duration(readRational(request, "targetTimeYears") ?? requireRational(hidden, "laterTimeYears"), language);
      if (language === "hi") {
        stem = `${action(language, context)}। ${R} वार्षिक साधारण ब्याज की दर से ${knownTime} बाद ${amountNoun} ${knownAmount} है। ${targetTime} बाद यह कितनी होगी?`;
      } else if (language === "pa") {
        stem = `${action(language, context)}। ${R} ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਦਰ ਨਾਲ ${knownTime} ਬਾਅਦ ${amountNoun} ${knownAmount} ਹੈ। ${targetTime} ਬਾਅਦ ਇਹ ਕਿੰਨੀ ਹੋਵੇਗੀ?`;
      } else {
        stem = `${action(language, context)} at ${R} per annum simple interest. The ${amountNoun} after ${knownTime} is ${knownAmount}. What will it be after ${targetTime}?`;
      }
      add("RATE", R); add("TIME", knownTime, targetTime); add("AMOUNT", knownAmount);
      break;
    }

    case "FIND_LATER_TIME_FROM_TWO_AMOUNT_RATIO": {
      const earlierTime = duration(readRational(request, "earlierTimeYears") ?? requireRational(hidden, "earlierTimeYears"), language);
      const comparedRatio = formatColonRatio(readRational(request, "laterToEarlierAmountRatio")!);
      if (language === "hi") {
        stem = `${action(language, context)}। साधारण ब्याज की दर ${R} वार्षिक है। किसी अज्ञात समय बाद की ${amountNoun} और ${earlierTime} बाद की ${amountNoun} का अनुपात ${comparedRatio} है। अज्ञात समय कितना है?`;
      } else if (language === "pa") {
        stem = `${action(language, context)}। ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਦਰ ${R} ਸਾਲਾਨਾ ਹੈ। ਕਿਸੇ ਅਣਜਾਣ ਸਮੇਂ ਬਾਅਦ ਦੀ ${amountNoun} ਅਤੇ ${earlierTime} ਬਾਅਦ ਦੀ ${amountNoun} ਦਾ ਅਨੁਪਾਤ ${comparedRatio} ਹੈ। ਅਣਜਾਣ ਸਮਾਂ ਕਿੰਨਾ ਹੈ?`;
      } else {
        stem = `${action(language, context)} at ${R} per annum simple interest. The ${amountNoun} after an unknown time and after ${earlierTime} are in the ratio ${comparedRatio}. What is the unknown time?`;
      }
      add("RATE", R); add("TIME", earlierTime); add("RATIO", comparedRatio);
      break;
    }

    default:
      throw new Error(`Readable-stem builder does not support solve contract ${solveContract}.`);
  }

  return {
    stem,
    presentation: presentation(stem, anchors),
    scenarioId: cashFlow.scenarioId,
    cashFlowDirection: direction,
  };
}
