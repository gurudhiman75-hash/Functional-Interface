import {
  addRational,
  divideRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./foundation/rational";
import type { Rational } from "./foundation/types";
import type { IntCp001FinalQlId } from "./cp001-final-registry";
import {
  generateIntCp001FinalEditorialV3Question,
  type IntCp001FinalEditorialV3Question,
} from "./cp001-final-editorial-runtime-v3";
import {
  INT_CP001_LOCALE_COPY,
  asRecord,
  formatColonRatio,
  formatDays,
  formatDurationYears,
  formatLocalizedOption,
  formatMoneyLocalized,
  formatMonths,
  formatPercentLocalized,
  hasGurmukhiScript,
  hasHindiScript,
  hasInstructionalLatinLeak,
  inlineRational,
  isRational,
  localizeDisplayMath,
  localizedContext,
  mathDurationYears,
  mathMoney,
  mathPercent,
  mathRational,
  readRational,
  requireRational,
  stableBigIntJson,
  type UnknownRecord,
} from "./cp001-localization-foundation";
import {
  getIntCp001LocaleReleaseId,
  type IntCp001Locale,
} from "./cp001-multilingual-release";

export interface IntCp001LocalizedTrapItem {
  optionNumber: number;
  optionText: string;
  misconceptionId: string;
  explanation: string;
}

export interface IntCp001LocalizedExplanation {
  notice: string;
  relation: string;
  steps: string[];
  verification: string;
  conclusion: string;
  commonTrap: string;
  coreConcept: {
    heading: string;
    narrative: string;
    displayMath: string;
  };
  stepByStep: {
    heading: string;
    steps: string[];
    verification: string;
    conclusion: string;
  };
  examShortcut: {
    heading: string;
    narrative: string;
    displayMath: string;
  };
  trapAnalysis: {
    heading: string;
    items: IntCp001LocalizedTrapItem[];
  };
}

export type IntCp001LocalizedQuestion = Omit<
  IntCp001FinalEditorialV3Question,
  | "releaseId"
  | "language"
  | "questionLanguageId"
  | "stem"
  | "options"
  | "optionAudit"
  | "explanation"
  | "reasoningGraph"
  | "validation"
  | "reviewStatus"
> & {
  releaseId: ReturnType<typeof getIntCp001LocaleReleaseId>;
  language: IntCp001Locale;
  questionLanguageId: "hi-IN" | "pa-IN";
  stem: string;
  options: string[];
  optionAudit: IntCp001FinalEditorialV3Question["optionAudit"];
  explanation: IntCp001LocalizedExplanation;
  reasoningGraph: IntCp001FinalEditorialV3Question["reasoningGraph"];
  validation: IntCp001FinalEditorialV3Question["validation"];
  reviewStatus: "PENDING_MULTILINGUAL_REVIEW";
  localeReviewStatus: "PENDING_HUMAN_REVIEW";
};

interface LocaleState {
  parameters: UnknownRecord;
  state: UnknownRecord;
  request: UnknownRecord;
  display: UnknownRecord;
  P?: Rational;
  I?: Rational;
  A?: Rational;
  R?: Rational;
  T?: Rational;
  A1?: Rational;
  A2?: Rational;
  T1?: Rational;
  T2?: Rational;
  J?: Rational;
  ratio?: Rational;
  multiple?: Rational;
}

function numberField(record: UnknownRecord, key: string): number | undefined {
  const value = record[key];
  return typeof value === "number" ? value : undefined;
}

function firstRational(...values: Array<Rational | undefined>): Rational | undefined {
  return values.find(Boolean);
}

function buildLocaleState(question: IntCp001FinalEditorialV3Question): LocaleState {
  const parameters = asRecord(question.internalProvenance.sourceParameters) ?? {};
  const state = asRecord(parameters.hiddenState) ?? {};
  const request = asRecord(parameters.request) ?? {};
  const display = asRecord(parameters.display) ?? {};

  return {
    parameters,
    state,
    request,
    display,
    P: readRational(state, "principal"),
    I: firstRational(readRational(state, "simpleInterest"), readRational(state, "laterInterest")),
    A: firstRational(readRational(state, "amount"), readRational(state, "laterAmount")),
    R: readRational(state, "annualRatePercent"),
    T: firstRational(
      readRational(request, "timeYears"),
      readRational(state, "timeYears"),
      readRational(state, "laterTimeYears"),
    ),
    A1: readRational(state, "earlierAmount"),
    A2: readRational(state, "laterAmount"),
    T1: firstRational(readRational(request, "earlierTimeYears"), readRational(state, "earlierTimeYears")),
    T2: firstRational(readRational(request, "laterTimeYears"), readRational(state, "laterTimeYears")),
    J: readRational(state, "annualInterest"),
    ratio: firstRational(
      readRational(request, "laterToEarlierAmountRatio"),
      readRational(display, "laterToEarlierAmountRatio"),
    ),
    multiple: firstRational(
      readRational(request, "amountMultiple"),
      readRational(display, "amountMultiple"),
      readRational(request, "interestToPrincipalRatio"),
      readRational(display, "interestToPrincipalRatio"),
    ),
  };
}

function questionDuration(data: LocaleState, locale: IntCp001Locale): string {
  const days = numberField(data.display, "displayedDays");
  if (days !== undefined) return formatDays(days, locale);
  const months = numberField(data.display, "displayedMonths");
  if (months !== undefined) return formatMonths(months, locale);
  return formatDurationYears(data.T ?? rational(1), locale);
}

function timeBasisSuffix(data: LocaleState, locale: IntCp001Locale): string {
  const days = numberField(data.display, "displayedDays");
  if (days === undefined) return "";
  return locale === "hi" ? " (365 दिन का वर्ष मानकर)" : " (365 ਦਿਨਾਂ ਦਾ ਸਾਲ ਮੰਨ ਕੇ)";
}

function knownTargetTimes(data: LocaleState): { known: Rational; target: Rational } {
  const known = firstRational(
    readRational(data.request, "knownTimeYears"),
    readRational(data.display, "knownTimeYears"),
    readRational(data.request, "timeYears"),
    data.T,
  ) ?? rational(1);
  const target = firstRational(
    readRational(data.request, "targetTimeYears"),
    readRational(data.display, "targetTimeYears"),
  ) ?? rational(1);
  return { known, target };
}

function localizedStem(
  question: IntCp001FinalEditorialV3Question,
  locale: IntCp001Locale,
  data: LocaleState,
): string {
  const context = localizedContext(data.parameters, locale, question.seed);
  const P = data.P ? formatMoneyLocalized(data.P) : "";
  const I = data.I ? formatMoneyLocalized(data.I) : "";
  const A = data.A ? formatMoneyLocalized(data.A) : "";
  const R = data.R ? formatPercentLocalized(data.R, locale) : "";
  const duration = questionDuration(data, locale);
  const basis = timeBasisSuffix(data, locale);

  if (locale === "hi") {
    switch (question.solveContract) {
      case "FIND_SIMPLE_INTEREST_FROM_PRT":
        return `${context.lead}। ${P} के मूलधन पर ${R} की साधारण ब्याज दर से ${duration}${basis} में कितना ब्याज मिलेगा?`;
      case "FIND_AMOUNT_FROM_PRT":
        return `${context.lead}। ${P} पर ${R} की साधारण ब्याज दर से ${duration}${basis} बाद कुल राशि कितनी होगी?`;
      case "FIND_PRINCIPAL_FROM_INTEREST":
        return `${context.lead}। ${R} की साधारण ब्याज दर से ${duration} में ${I} ब्याज मिला। मूलधन कितना था?`;
      case "FIND_PRINCIPAL_FROM_AMOUNT":
        return `${context.lead}। ${R} की साधारण ब्याज दर से ${duration} बाद कुल राशि ${A} हो गई। आरम्भिक मूलधन कितना था?`;
      case "FIND_RATE_FROM_INTEREST":
        return `${context.lead}। ${P} के मूलधन पर ${duration} में ${I} साधारण ब्याज मिला। वार्षिक ब्याज दर कितनी थी?`;
      case "FIND_RATE_FROM_AMOUNT":
        return `${context.lead}। ${P} का मूलधन ${duration} में ${A} हो गया। साधारण ब्याज की वार्षिक दर कितनी थी?`;
      case "FIND_TIME_FROM_INTEREST":
        return `${context.lead}। ${P} पर ${R} की दर से ${I} साधारण ब्याज मिला। धन कितने समय के लिए रखा गया था?`;
      case "FIND_TIME_FROM_AMOUNT":
        return `${context.lead}। ${P} की राशि ${R} की साधारण ब्याज दर से बढ़कर ${A} हो गई। इसमें कितना समय लगा?`;
      case "FIND_INTEREST_FOR_TARGET_DURATION": {
        const { known, target } = knownTargetTimes(data);
        return `${context.lead}। ${formatDurationYears(known, locale)} में ${I} साधारण ब्याज मिलता है। उसी मूलधन और दर पर ${formatDurationYears(target, locale)} में कितना ब्याज मिलेगा?`;
      }
      case "FIND_RATE_FROM_AMOUNT_MULTIPLE":
        return `${context.lead}। साधारण ब्याज पर ${duration} में कुल राशि ${data.multiple ? `${inlineRational(data.multiple)} गुना मूलधन` : "दिए गए गुणक"} हो जाती है। वार्षिक दर ज्ञात कीजिए।`;
      case "FIND_TIME_FROM_AMOUNT_MULTIPLE":
        return `${context.lead}। ${R} की साधारण ब्याज दर पर कुल राशि ${data.multiple ? `${inlineRational(data.multiple)} गुना मूलधन` : "दिए गए गुणक"} कब होगी?`;
      case "FIND_TIME_FROM_INTEREST_RATIO":
        return `${context.lead}। ${R} की साधारण ब्याज दर पर ब्याज, मूलधन का ${data.multiple ? inlineRational(data.multiple) : "दिया गया भाग"} कब होगा?`;
      case "FIND_RATE_FROM_INTEREST_RATIO":
        return `${context.lead}। ${duration} में साधारण ब्याज, मूलधन का ${data.multiple ? inlineRational(data.multiple) : "दिया गया भाग"} हो जाता है। वार्षिक दर कितनी है?`;
      case "FIND_ANNUAL_INTEREST_FROM_TWO_AMOUNTS":
        return `${context.lead}। राशि ${formatDurationYears(data.T1!, locale)} बाद ${formatMoneyLocalized(data.A1!)} और ${formatDurationYears(data.T2!, locale)} बाद ${formatMoneyLocalized(data.A2!)} है। एक वर्ष का साधारण ब्याज कितना है?`;
      case "FIND_PRINCIPAL_FROM_TWO_AMOUNTS":
        return `${context.lead}। राशि ${formatDurationYears(data.T1!, locale)} बाद ${formatMoneyLocalized(data.A1!)} और ${formatDurationYears(data.T2!, locale)} बाद ${formatMoneyLocalized(data.A2!)} है। मूलधन कितना था?`;
      case "FIND_RATE_FROM_TWO_AMOUNTS":
        return `${context.lead}। राशि ${formatDurationYears(data.T1!, locale)} बाद ${formatMoneyLocalized(data.A1!)} और ${formatDurationYears(data.T2!, locale)} बाद ${formatMoneyLocalized(data.A2!)} है। वार्षिक साधारण ब्याज दर कितनी है?`;
      case "FIND_RATE_FROM_TWO_TIME_AMOUNT_RATIO":
        return `${context.lead}। ${formatDurationYears(data.T2!, locale)} की राशि और ${formatDurationYears(data.T1!, locale)} की राशि का अनुपात ${formatColonRatio(data.ratio!)} है। वार्षिक साधारण ब्याज दर कितनी है?`;
      case "FIND_AMOUNT_MULTIPLE_FROM_RATE_TIME":
        return `${context.lead}। ${R} की साधारण ब्याज दर से ${duration} बाद कुल राशि, मूलधन की कितनी गुना होगी?`;
      case "FIND_INTEREST_RATIO_FROM_RATE_TIME":
        return `${context.lead}। ${R} की साधारण ब्याज दर से ${duration} में मिला ब्याज, मूलधन का कौन-सा भाग होगा?`;
      case "FIND_AMOUNT_AT_ANOTHER_TIME": {
        const knownAmount = requireRational(data.request, "knownAmount");
        const knownTime = requireRational(data.request, "knownTimeYears");
        const targetTime = requireRational(data.request, "targetTimeYears");
        return `${context.lead}। ${R} की साधारण ब्याज दर पर ${formatDurationYears(knownTime, locale)} बाद राशि ${formatMoneyLocalized(knownAmount)} है। ${formatDurationYears(targetTime, locale)} बाद राशि कितनी होगी?`;
      }
      case "FIND_LATER_TIME_FROM_TWO_AMOUNT_RATIO":
        return `${context.lead}। दर ${R} है। बाद की राशि और ${formatDurationYears(data.T1!, locale)} बाद की राशि का अनुपात ${formatColonRatio(data.ratio!)} है। बाद वाली राशि कुल कितने समय बाद प्राप्त होगी?`;
    }
  }

  switch (question.solveContract) {
    case "FIND_SIMPLE_INTEREST_FROM_PRT":
      return `${context.lead}। ${P} ਦੇ ਮੂਲਧਨ ਉੱਤੇ ${R} ਦੀ ਸਧਾਰਣ ਵਿਆਜ ਦਰ ਨਾਲ ${duration}${basis} ਵਿੱਚ ਕਿੰਨਾ ਵਿਆਜ ਮਿਲੇਗਾ?`;
    case "FIND_AMOUNT_FROM_PRT":
      return `${context.lead}। ${P} ਉੱਤੇ ${R} ਦੀ ਸਧਾਰਣ ਵਿਆਜ ਦਰ ਨਾਲ ${duration}${basis} ਬਾਅਦ ਕੁੱਲ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ?`;
    case "FIND_PRINCIPAL_FROM_INTEREST":
      return `${context.lead}। ${R} ਦੀ ਸਧਾਰਣ ਵਿਆਜ ਦਰ ਨਾਲ ${duration} ਵਿੱਚ ${I} ਵਿਆਜ ਮਿਲਿਆ। ਮੂਲਧਨ ਕਿੰਨਾ ਸੀ?`;
    case "FIND_PRINCIPAL_FROM_AMOUNT":
      return `${context.lead}। ${R} ਦੀ ਸਧਾਰਣ ਵਿਆਜ ਦਰ ਨਾਲ ${duration} ਬਾਅਦ ਕੁੱਲ ਰਕਮ ${A} ਹੋ ਗਈ। ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ਕਿੰਨਾ ਸੀ?`;
    case "FIND_RATE_FROM_INTEREST":
      return `${context.lead}। ${P} ਦੇ ਮੂਲਧਨ ਉੱਤੇ ${duration} ਵਿੱਚ ${I} ਸਧਾਰਣ ਵਿਆਜ ਮਿਲਿਆ। ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਕਿੰਨੀ ਸੀ?`;
    case "FIND_RATE_FROM_AMOUNT":
      return `${context.lead}। ${P} ਦਾ ਮੂਲਧਨ ${duration} ਵਿੱਚ ${A} ਹੋ ਗਿਆ। ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਸਾਲਾਨਾ ਦਰ ਕਿੰਨੀ ਸੀ?`;
    case "FIND_TIME_FROM_INTEREST":
      return `${context.lead}। ${P} ਉੱਤੇ ${R} ਦੀ ਦਰ ਨਾਲ ${I} ਸਧਾਰਣ ਵਿਆਜ ਮਿਲਿਆ। ਰਕਮ ਕਿੰਨੇ ਸਮੇਂ ਲਈ ਰੱਖੀ ਗਈ ਸੀ?`;
    case "FIND_TIME_FROM_AMOUNT":
      return `${context.lead}। ${P} ਦੀ ਰਕਮ ${R} ਦੀ ਸਧਾਰਣ ਵਿਆਜ ਦਰ ਨਾਲ ਵੱਧ ਕੇ ${A} ਹੋ ਗਈ। ਇਸ ਲਈ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗਿਆ?`;
    case "FIND_INTEREST_FOR_TARGET_DURATION": {
      const { known, target } = knownTargetTimes(data);
      return `${context.lead}। ${formatDurationYears(known, locale)} ਵਿੱਚ ${I} ਸਧਾਰਣ ਵਿਆਜ ਮਿਲਦਾ ਹੈ। ਉਸੇ ਮੂਲਧਨ ਅਤੇ ਦਰ ਨਾਲ ${formatDurationYears(target, locale)} ਵਿੱਚ ਕਿੰਨਾ ਵਿਆਜ ਮਿਲੇਗਾ?`;
    }
    case "FIND_RATE_FROM_AMOUNT_MULTIPLE":
      return `${context.lead}। ਸਧਾਰਣ ਵਿਆਜ ਉੱਤੇ ${duration} ਵਿੱਚ ਕੁੱਲ ਰਕਮ ${data.multiple ? `${inlineRational(data.multiple)} ਗੁਣਾ ਮੂਲਧਨ` : "ਦਿੱਤੇ ਗੁਣਕ"} ਹੋ ਜਾਂਦੀ ਹੈ। ਸਾਲਾਨਾ ਦਰ ਕਿੰਨੀ ਹੈ?`;
    case "FIND_TIME_FROM_AMOUNT_MULTIPLE":
      return `${context.lead}। ${R} ਦੀ ਸਧਾਰਣ ਵਿਆਜ ਦਰ ਉੱਤੇ ਕੁੱਲ ਰਕਮ ${data.multiple ? `${inlineRational(data.multiple)} ਗੁਣਾ ਮੂਲਧਨ` : "ਦਿੱਤੇ ਗੁਣਕ"} ਕਦੋਂ ਹੋਵੇਗੀ?`;
    case "FIND_TIME_FROM_INTEREST_RATIO":
      return `${context.lead}। ${R} ਦੀ ਸਧਾਰਣ ਵਿਆਜ ਦਰ ਉੱਤੇ ਵਿਆਜ, ਮੂਲਧਨ ਦਾ ${data.multiple ? inlineRational(data.multiple) : "ਦਿੱਤਾ ਹਿੱਸਾ"} ਕਦੋਂ ਹੋਵੇਗਾ?`;
    case "FIND_RATE_FROM_INTEREST_RATIO":
      return `${context.lead}। ${duration} ਵਿੱਚ ਸਧਾਰਣ ਵਿਆਜ, ਮੂਲਧਨ ਦਾ ${data.multiple ? inlineRational(data.multiple) : "ਦਿੱਤਾ ਹਿੱਸਾ"} ਹੋ ਜਾਂਦਾ ਹੈ। ਸਾਲਾਨਾ ਦਰ ਕਿੰਨੀ ਹੈ?`;
    case "FIND_ANNUAL_INTEREST_FROM_TWO_AMOUNTS":
      return `${context.lead}। ਰਕਮ ${formatDurationYears(data.T1!, locale)} ਬਾਅਦ ${formatMoneyLocalized(data.A1!)} ਅਤੇ ${formatDurationYears(data.T2!, locale)} ਬਾਅਦ ${formatMoneyLocalized(data.A2!)} ਹੈ। ਇੱਕ ਸਾਲ ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਕਿੰਨਾ ਹੈ?`;
    case "FIND_PRINCIPAL_FROM_TWO_AMOUNTS":
      return `${context.lead}। ਰਕਮ ${formatDurationYears(data.T1!, locale)} ਬਾਅਦ ${formatMoneyLocalized(data.A1!)} ਅਤੇ ${formatDurationYears(data.T2!, locale)} ਬਾਅਦ ${formatMoneyLocalized(data.A2!)} ਹੈ। ਮੂਲਧਨ ਕਿੰਨਾ ਸੀ?`;
    case "FIND_RATE_FROM_TWO_AMOUNTS":
      return `${context.lead}। ਰਕਮ ${formatDurationYears(data.T1!, locale)} ਬਾਅਦ ${formatMoneyLocalized(data.A1!)} ਅਤੇ ${formatDurationYears(data.T2!, locale)} ਬਾਅਦ ${formatMoneyLocalized(data.A2!)} ਹੈ। ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਦਰ ਕਿੰਨੀ ਹੈ?`;
    case "FIND_RATE_FROM_TWO_TIME_AMOUNT_RATIO":
      return `${context.lead}। ${formatDurationYears(data.T2!, locale)} ਦੀ ਰਕਮ ਅਤੇ ${formatDurationYears(data.T1!, locale)} ਦੀ ਰਕਮ ਦਾ ਅਨੁਪਾਤ ${formatColonRatio(data.ratio!)} ਹੈ। ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਦਰ ਕਿੰਨੀ ਹੈ?`;
    case "FIND_AMOUNT_MULTIPLE_FROM_RATE_TIME":
      return `${context.lead}। ${R} ਦੀ ਸਧਾਰਣ ਵਿਆਜ ਦਰ ਨਾਲ ${duration} ਬਾਅਦ ਕੁੱਲ ਰਕਮ, ਮੂਲਧਨ ਦੀ ਕਿੰਨੀ ਗੁਣਾ ਹੋਵੇਗੀ?`;
    case "FIND_INTEREST_RATIO_FROM_RATE_TIME":
      return `${context.lead}। ${R} ਦੀ ਸਧਾਰਣ ਵਿਆਜ ਦਰ ਨਾਲ ${duration} ਵਿੱਚ ਮਿਲਿਆ ਵਿਆਜ, ਮੂਲਧਨ ਦਾ ਕਿਹੜਾ ਹਿੱਸਾ ਹੋਵੇਗਾ?`;
    case "FIND_AMOUNT_AT_ANOTHER_TIME": {
      const knownAmount = requireRational(data.request, "knownAmount");
      const knownTime = requireRational(data.request, "knownTimeYears");
      const targetTime = requireRational(data.request, "targetTimeYears");
      return `${context.lead}। ${R} ਦੀ ਸਧਾਰਣ ਵਿਆਜ ਦਰ ਉੱਤੇ ${formatDurationYears(knownTime, locale)} ਬਾਅਦ ਰਕਮ ${formatMoneyLocalized(knownAmount)} ਹੈ। ${formatDurationYears(targetTime, locale)} ਬਾਅਦ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ?`;
    }
    case "FIND_LATER_TIME_FROM_TWO_AMOUNT_RATIO":
      return `${context.lead}। ਦਰ ${R} ਹੈ। ਬਾਅਦ ਦੀ ਰਕਮ ਅਤੇ ${formatDurationYears(data.T1!, locale)} ਬਾਅਦ ਦੀ ਰਕਮ ਦਾ ਅਨੁਪਾਤ ${formatColonRatio(data.ratio!)} ਹੈ। ਬਾਅਦ ਵਾਲੀ ਰਕਮ ਕੁੱਲ ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਮਿਲੇਗੀ?`;
  }
}

const CORE_HI: Record<string, string> = {
  FIND_SIMPLE_INTEREST_FROM_PRT: "साधारण ब्याज हमेशा मूलधन पर समान दर से बढ़ता है।",
  FIND_AMOUNT_FROM_PRT: "कुल राशि में मूलधन और पूरे समय का साधारण ब्याज दोनों शामिल होते हैं।",
  FIND_PRINCIPAL_FROM_INTEREST: "दिए गए ब्याज प्रतिशत को उलटकर मूलधन निकाला जाता है।",
  FIND_PRINCIPAL_FROM_AMOUNT: "कुल राशि, मूलधन के 100% और पूरे समय के ब्याज प्रतिशत का योग है।",
  FIND_RATE_FROM_INTEREST: "कुल ब्याज प्रतिशत को समय से भाग देने पर वार्षिक दर मिलती है।",
  FIND_RATE_FROM_AMOUNT: "पहले कुल राशि में से मूलधन घटाकर ब्याज निकालें, फिर वार्षिक दर ज्ञात करें।",
  FIND_TIME_FROM_INTEREST: "साधारण ब्याज में हर वर्ष समान ब्याज जुड़ता है; कुल ब्याज को एक वर्ष के ब्याज से भाग दें।",
  FIND_TIME_FROM_AMOUNT: "कुल राशि में से मूलधन घटाकर ब्याज निकालें और उसे एक वर्ष के ब्याज से तुलना करें।",
  FIND_INTEREST_FOR_TARGET_DURATION: "एक ही मूलधन और दर पर साधारण ब्याज समय के सीधे अनुपात में होता है।",
  FIND_RATE_FROM_AMOUNT_MULTIPLE: "राशि के गुणक में मूलधन का एक पूरा भाग शामिल है; दर निकालने से पहले 1 घटाएँ।",
  FIND_TIME_FROM_AMOUNT_MULTIPLE: "राशि के गुणक से 1 घटाने पर पूरे समय का ब्याज-भाग मिलता है।",
  FIND_TIME_FROM_INTEREST_RATIO: "ब्याज और मूलधन का अनुपात पूरे समय का शुद्ध ब्याज-भाग है।",
  FIND_RATE_FROM_INTEREST_RATIO: "ब्याज-मूलधन अनुपात को दिए समय में बाँटकर वार्षिक दर मिलती है।",
  FIND_ANNUAL_INTEREST_FROM_TWO_AMOUNTS: "दो राशियों का अंतर केवल बीच के समय में अर्जित ब्याज है।",
  FIND_PRINCIPAL_FROM_TWO_AMOUNTS: "पहले राशि-अंतर से एक वर्ष का ब्याज निकालें, फिर पहली राशि से पहले समय का ब्याज घटाएँ।",
  FIND_RATE_FROM_TWO_AMOUNTS: "राशि-अंतर से वार्षिक ब्याज और फिर मूलधन निकालकर दर ज्ञात होती है।",
  FIND_RATE_FROM_TWO_TIME_AMOUNT_RATIO: "दोनों राशियों में एक ही मूलधन है, इसलिए राशि-गुणकों का अनुपात लें।",
  FIND_AMOUNT_MULTIPLE_FROM_RATE_TIME: "राशि-मूलधन गुणक, 1 और पूरे समय के ब्याज-भाग का योग है।",
  FIND_INTEREST_RATIO_FROM_RATE_TIME: "ब्याज-मूलधन अनुपात सीधे $RT/100$ के बराबर होता है।",
  FIND_AMOUNT_AT_ANOTHER_TIME: "ज्ञात समय की राशि को नया मूलधन नहीं मानना है; राशि-गुणक से मूलधन पुनः प्राप्त करें।",
  FIND_LATER_TIME_FROM_TWO_AMOUNT_RATIO: "एक ही मूलधन के कारण दोनों राशियों का अनुपात उनके समय-गुणकों के अनुपात के बराबर है।",
};

const CORE_PA: Record<string, string> = {
  FIND_SIMPLE_INTEREST_FROM_PRT: "ਸਧਾਰਣ ਵਿਆਜ ਹਮੇਸ਼ਾਂ ਮੂਲਧਨ ਉੱਤੇ ਇੱਕੋ ਦਰ ਨਾਲ ਵੱਧਦਾ ਹੈ।",
  FIND_AMOUNT_FROM_PRT: "ਕੁੱਲ ਰਕਮ ਵਿੱਚ ਮੂਲਧਨ ਅਤੇ ਪੂਰੇ ਸਮੇਂ ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਦੋਵੇਂ ਸ਼ਾਮਲ ਹੁੰਦੇ ਹਨ।",
  FIND_PRINCIPAL_FROM_INTEREST: "ਦਿੱਤੇ ਵਿਆਜ ਪ੍ਰਤੀਸ਼ਤ ਨੂੰ ਉਲਟ ਕੇ ਮੂਲਧਨ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ।",
  FIND_PRINCIPAL_FROM_AMOUNT: "ਕੁੱਲ ਰਕਮ, ਮੂਲਧਨ ਦੇ 100% ਅਤੇ ਪੂਰੇ ਸਮੇਂ ਦੇ ਵਿਆਜ ਪ੍ਰਤੀਸ਼ਤ ਦਾ ਜੋੜ ਹੈ।",
  FIND_RATE_FROM_INTEREST: "ਕੁੱਲ ਵਿਆਜ ਪ੍ਰਤੀਸ਼ਤ ਨੂੰ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦੇਣ ਉੱਤੇ ਸਾਲਾਨਾ ਦਰ ਮਿਲਦੀ ਹੈ।",
  FIND_RATE_FROM_AMOUNT: "ਪਹਿਲਾਂ ਕੁੱਲ ਰਕਮ ਵਿੱਚੋਂ ਮੂਲਧਨ ਘਟਾ ਕੇ ਵਿਆਜ ਕੱਢੋ, ਫਿਰ ਸਾਲਾਨਾ ਦਰ ਲੱਭੋ।",
  FIND_TIME_FROM_INTEREST: "ਸਧਾਰਣ ਵਿਆਜ ਵਿੱਚ ਹਰ ਸਾਲ ਇੱਕੋ ਜਿਹਾ ਵਿਆਜ ਜੁੜਦਾ ਹੈ; ਕੁੱਲ ਵਿਆਜ ਨੂੰ ਇੱਕ ਸਾਲ ਦੇ ਵਿਆਜ ਨਾਲ ਭਾਗ ਦਿਓ।",
  FIND_TIME_FROM_AMOUNT: "ਕੁੱਲ ਰਕਮ ਵਿੱਚੋਂ ਮੂਲਧਨ ਘਟਾ ਕੇ ਵਿਆਜ ਕੱਢੋ ਅਤੇ ਉਸਦੀ ਇੱਕ ਸਾਲ ਦੇ ਵਿਆਜ ਨਾਲ ਤੁਲਨਾ ਕਰੋ।",
  FIND_INTEREST_FOR_TARGET_DURATION: "ਇੱਕੋ ਮੂਲਧਨ ਅਤੇ ਦਰ ਉੱਤੇ ਸਧਾਰਣ ਵਿਆਜ ਸਮੇਂ ਦੇ ਸਿੱਧੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹੁੰਦਾ ਹੈ।",
  FIND_RATE_FROM_AMOUNT_MULTIPLE: "ਰਕਮ ਦੇ ਗੁਣਕ ਵਿੱਚ ਮੂਲਧਨ ਦਾ ਇੱਕ ਪੂਰਾ ਹਿੱਸਾ ਸ਼ਾਮਲ ਹੈ; ਦਰ ਕੱਢਣ ਤੋਂ ਪਹਿਲਾਂ 1 ਘਟਾਓ।",
  FIND_TIME_FROM_AMOUNT_MULTIPLE: "ਰਕਮ ਦੇ ਗੁਣਕ ਵਿੱਚੋਂ 1 ਘਟਾਉਣ ਉੱਤੇ ਪੂਰੇ ਸਮੇਂ ਦਾ ਵਿਆਜ-ਹਿੱਸਾ ਮਿਲਦਾ ਹੈ।",
  FIND_TIME_FROM_INTEREST_RATIO: "ਵਿਆਜ ਅਤੇ ਮੂਲਧਨ ਦਾ ਅਨੁਪਾਤ ਪੂਰੇ ਸਮੇਂ ਦਾ ਕੁੱਲ ਵਿਆਜ-ਹਿੱਸਾ ਹੈ।",
  FIND_RATE_FROM_INTEREST_RATIO: "ਵਿਆਜ-ਮੂਲਧਨ ਅਨੁਪਾਤ ਨੂੰ ਦਿੱਤੇ ਸਮੇਂ ਵਿੱਚ ਵੰਡ ਕੇ ਸਾਲਾਨਾ ਦਰ ਮਿਲਦੀ ਹੈ।",
  FIND_ANNUAL_INTEREST_FROM_TWO_AMOUNTS: "ਦੋ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਸਿਰਫ਼ ਵਿਚਕਾਰਲੇ ਸਮੇਂ ਵਿੱਚ ਮਿਲਿਆ ਵਿਆਜ ਹੈ।",
  FIND_PRINCIPAL_FROM_TWO_AMOUNTS: "ਪਹਿਲਾਂ ਰਕਮਾਂ ਦੇ ਅੰਤਰ ਤੋਂ ਇੱਕ ਸਾਲ ਦਾ ਵਿਆਜ ਕੱਢੋ, ਫਿਰ ਪਹਿਲੀ ਰਕਮ ਵਿੱਚੋਂ ਪਹਿਲੇ ਸਮੇਂ ਦਾ ਵਿਆਜ ਘਟਾਓ।",
  FIND_RATE_FROM_TWO_AMOUNTS: "ਰਕਮਾਂ ਦੇ ਅੰਤਰ ਤੋਂ ਸਾਲਾਨਾ ਵਿਆਜ ਅਤੇ ਫਿਰ ਮੂਲਧਨ ਕੱਢ ਕੇ ਦਰ ਮਿਲਦੀ ਹੈ।",
  FIND_RATE_FROM_TWO_TIME_AMOUNT_RATIO: "ਦੋਵਾਂ ਰਕਮਾਂ ਵਿੱਚ ਇੱਕੋ ਮੂਲਧਨ ਹੈ, ਇਸ ਲਈ ਰਕਮ-ਗੁਣਕਾਂ ਦਾ ਅਨੁਪਾਤ ਵਰਤੋ।",
  FIND_AMOUNT_MULTIPLE_FROM_RATE_TIME: "ਰਕਮ-ਮੂਲਧਨ ਗੁਣਕ, 1 ਅਤੇ ਪੂਰੇ ਸਮੇਂ ਦੇ ਵਿਆਜ-ਹਿੱਸੇ ਦਾ ਜੋੜ ਹੈ।",
  FIND_INTEREST_RATIO_FROM_RATE_TIME: "ਵਿਆਜ-ਮੂਲਧਨ ਅਨੁਪਾਤ ਸਿੱਧਾ $RT/100$ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।",
  FIND_AMOUNT_AT_ANOTHER_TIME: "ਜਾਣੇ ਸਮੇਂ ਦੀ ਰਕਮ ਨੂੰ ਨਵਾਂ ਮੂਲਧਨ ਨਹੀਂ ਮੰਨਣਾ; ਰਕਮ-ਗੁਣਕ ਨਾਲ ਅਸਲ ਮੂਲਧਨ ਕੱਢੋ।",
  FIND_LATER_TIME_FROM_TWO_AMOUNT_RATIO: "ਇੱਕੋ ਮੂਲਧਨ ਕਰਕੇ ਦੋਵਾਂ ਰਕਮਾਂ ਦਾ ਅਨੁਪਾਤ ਉਨ੍ਹਾਂ ਦੇ ਸਮਾਂ-ਗੁਣਕਾਂ ਦੇ ਅਨੁਪਾਤ ਦੇ ਬਰਾਬਰ ਹੈ।",
};

function workingEquation(
  question: IntCp001FinalEditorialV3Question,
  data: LocaleState,
  answerValue: Rational,
  locale: IntCp001Locale,
): string[] {
  const P = data.P ?? rational(0);
  const I = data.I ?? rational(0);
  const A = data.A ?? rational(0);
  const R = data.R ?? rational(0);
  const T = data.T ?? rational(0);
  const resultMoney = mathMoney(answerValue);
  const resultRational = mathRational(answerValue);
  const resultDuration = mathDurationYears(answerValue, locale);
  const hi = locale === "hi";
  const given = hi ? "दिए गए मान लिखें" : "ਦਿੱਤੇ ਮੁੱਲ ਲਿਖੋ";
  const apply = hi ? "सूत्र में मान रखें" : "ਸੂਤਰ ਵਿੱਚ ਮੁੱਲ ਰੱਖੋ";

  switch (question.solveContract) {
    case "FIND_SIMPLE_INTEREST_FROM_PRT":
      return [
        `${given}: $P=${mathMoney(P)},\ R=${mathPercent(R)},\ T=${mathDurationYears(T, locale)}$।`,
        `${apply}: $$I=\\frac{P\\times R\\times T}{100}=\\frac{${mathMoney(P)}\\times ${mathPercent(R)}\\times ${mathRational(T)}}{100}=${resultMoney}$$`,
      ];
    case "FIND_AMOUNT_FROM_PRT":
      return [
        `${given}: $P=${mathMoney(P)},\ R=${mathPercent(R)},\ T=${mathDurationYears(T, locale)}$।`,
        `${apply}: $$A=P\\left(1+\\frac{RT}{100}\\right)=${mathMoney(P)}\\left(1+\\frac{${mathPercent(R)}\\times ${mathRational(T)}}{100}\\right)=${resultMoney}$$`,
      ];
    case "FIND_PRINCIPAL_FROM_INTEREST":
      return [
        `${given}: $I=${mathMoney(I)},\ R=${mathPercent(R)},\ T=${mathDurationYears(T, locale)}$।`,
        `${apply}: $$P=\\frac{100I}{RT}=\\frac{100\\times ${mathMoney(I)}}{${mathPercent(R)}\\times ${mathRational(T)}}=${resultMoney}$$`,
      ];
    case "FIND_PRINCIPAL_FROM_AMOUNT":
      return [
        `${given}: $A=${mathMoney(A)},\ R=${mathPercent(R)},\ T=${mathDurationYears(T, locale)}$।`,
        `${apply}: $$P=\\frac{100A}{100+RT}=\\frac{100\\times ${mathMoney(A)}}{100+${mathPercent(R)}\\times ${mathRational(T)}}=${resultMoney}$$`,
      ];
    case "FIND_RATE_FROM_INTEREST":
      return [
        `${given}: $P=${mathMoney(P)},\ I=${mathMoney(I)},\ T=${mathDurationYears(T, locale)}$।`,
        `${apply}: $$R=\\frac{100I}{PT}=\\frac{100\\times ${mathMoney(I)}}{${mathMoney(P)}\\times ${mathRational(T)}}=${resultRational}\\%$$`,
      ];
    case "FIND_RATE_FROM_AMOUNT": {
      const interest = subtractRational(A, P);
      return [
        `${hi ? "पहले ब्याज निकालें" : "ਪਹਿਲਾਂ ਵਿਆਜ ਕੱਢੋ"}: $$I=A-P=${mathMoney(A)}-${mathMoney(P)}=${mathMoney(interest)}$$`,
        `${apply}: $$R=\\frac{100I}{PT}=\\frac{100\\times ${mathMoney(interest)}}{${mathMoney(P)}\\times ${mathRational(T)}}=${resultRational}\\%$$`,
      ];
    }
    case "FIND_TIME_FROM_INTEREST":
      return [
        `${given}: $P=${mathMoney(P)},\ I=${mathMoney(I)},\ R=${mathPercent(R)}$।`,
        `${apply}: $$T=\\frac{100I}{PR}=\\frac{100\\times ${mathMoney(I)}}{${mathMoney(P)}\\times ${mathPercent(R)}}=${resultDuration}$$`,
      ];
    case "FIND_TIME_FROM_AMOUNT": {
      const interest = subtractRational(A, P);
      return [
        `${hi ? "पहले ब्याज निकालें" : "ਪਹਿਲਾਂ ਵਿਆਜ ਕੱਢੋ"}: $$I=A-P=${mathMoney(A)}-${mathMoney(P)}=${mathMoney(interest)}$$`,
        `${apply}: $$T=\\frac{100I}{PR}=\\frac{100\\times ${mathMoney(interest)}}{${mathMoney(P)}\\times ${mathPercent(R)}}=${resultDuration}$$`,
      ];
    }
    case "FIND_INTEREST_FOR_TARGET_DURATION": {
      const { known, target } = knownTargetTimes(data);
      return [
        `${hi ? "समान मूलधन और दर पर" : "ਇੱਕੋ ਮੂਲਧਨ ਅਤੇ ਦਰ ਉੱਤੇ"} $I_1:I_2=T_1:T_2$।`,
        `${apply}: $$I_2=I_1\\times\\frac{T_2}{T_1}=${mathMoney(I)}\\times\\frac{${mathRational(target)}}{${mathRational(known)}}=${resultMoney}$$`,
      ];
    }
    case "FIND_RATE_FROM_AMOUNT_MULTIPLE": {
      const m = data.multiple ?? rational(1);
      return [
        `${hi ? "राशि गुणक से ब्याज-भाग" : "ਰਕਮ ਦੇ ਗੁਣਕ ਤੋਂ ਵਿਆਜ-ਹਿੱਸਾ"}: $\\frac{I}{P}=\\frac{A}{P}-1=${mathRational(m)}-1$।`,
        `${apply}: $$R=\\frac{100\\left(${mathRational(m)}-1\\right)}{${mathRational(T)}}=${resultRational}\\%$$`,
      ];
    }
    case "FIND_TIME_FROM_AMOUNT_MULTIPLE": {
      const m = data.multiple ?? rational(1);
      return [
        `${hi ? "राशि गुणक से ब्याज-भाग" : "ਰਕਮ ਦੇ ਗੁਣਕ ਤੋਂ ਵਿਆਜ-ਹਿੱਸਾ"}: $\\frac{I}{P}=${mathRational(m)}-1$।`,
        `${apply}: $$T=\\frac{100\\left(${mathRational(m)}-1\\right)}{${mathPercent(R)}}=${resultDuration}$$`,
      ];
    }
    case "FIND_TIME_FROM_INTEREST_RATIO": {
      const k = data.multiple ?? rational(0);
      return [
        `${hi ? "दिया ब्याज-भाग" : "ਦਿੱਤਾ ਵਿਆਜ-ਹਿੱਸਾ"}: $\\frac{I}{P}=${mathRational(k)}$।`,
        `${apply}: $$T=\\frac{100\\left(${mathRational(k)}\\right)}{${mathPercent(R)}}=${resultDuration}$$`,
      ];
    }
    case "FIND_RATE_FROM_INTEREST_RATIO": {
      const k = data.multiple ?? rational(0);
      return [
        `${hi ? "दिया ब्याज-भाग" : "ਦਿੱਤਾ ਵਿਆਜ-ਹਿੱਸਾ"}: $\\frac{I}{P}=${mathRational(k)}$।`,
        `${apply}: $$R=\\frac{100\\left(${mathRational(k)}\\right)}{${mathRational(T)}}=${resultRational}\\%$$`,
      ];
    }
    case "FIND_ANNUAL_INTEREST_FROM_TWO_AMOUNTS":
      return [
        `${hi ? "राशि-अंतर" : "ਰਕਮਾਂ ਦਾ ਅੰਤਰ"}: $$A_2-A_1=${mathMoney(data.A2!)}-${mathMoney(data.A1!)}$$`,
        `${apply}: $$J=\\frac{A_2-A_1}{T_2-T_1}=\\frac{${mathMoney(subtractRational(data.A2!, data.A1!))}}{${mathRational(subtractRational(data.T2!, data.T1!))}}=${resultMoney}$$`,
      ];
    case "FIND_PRINCIPAL_FROM_TWO_AMOUNTS": {
      const gap = subtractRational(data.A2!, data.A1!);
      const timeGap = subtractRational(data.T2!, data.T1!);
      const annual = divideRational(gap, timeGap);
      return [
        `${hi ? "एक वर्ष का ब्याज" : "ਇੱਕ ਸਾਲ ਦਾ ਵਿਆਜ"}: $$J=\\frac{A_2-A_1}{T_2-T_1}=${mathMoney(annual)}$$`,
        `${apply}: $$P=A_1-JT_1=${mathMoney(data.A1!)}-${mathMoney(annual)}\\times ${mathRational(data.T1!)}=${resultMoney}$$`,
      ];
    }
    case "FIND_RATE_FROM_TWO_AMOUNTS": {
      const gap = subtractRational(data.A2!, data.A1!);
      const timeGap = subtractRational(data.T2!, data.T1!);
      const annual = divideRational(gap, timeGap);
      const principal = subtractRational(data.A1!, multiplyRational(annual, data.T1!));
      return [
        `${hi ? "पहले वार्षिक ब्याज और मूलधन" : "ਪਹਿਲਾਂ ਸਾਲਾਨਾ ਵਿਆਜ ਅਤੇ ਮੂਲਧਨ"}: $J=${mathMoney(annual)},\ P=${mathMoney(principal)}$।`,
        `${apply}: $$R=\\frac{100J}{P}=\\frac{100\\times ${mathMoney(annual)}}{${mathMoney(principal)}}=${resultRational}\\%$$`,
      ];
    }
    case "FIND_RATE_FROM_TWO_TIME_AMOUNT_RATIO":
      return [
        `${hi ? "एक ही मूलधन के राशि-गुणक लें" : "ਇੱਕੋ ਮੂਲਧਨ ਦੇ ਰਕਮ-ਗੁਣਕ ਲਵੋ"}।`,
        `${apply}: $$\\frac{1+rT_2}{1+rT_1}=\\frac{${data.ratio!.numerator}}{${data.ratio!.denominator}},\\qquad R=${resultRational}\\%$$`,
      ];
    case "FIND_AMOUNT_MULTIPLE_FROM_RATE_TIME":
      return [
        `${hi ? "पूरे समय का ब्याज प्रतिशत" : "ਪੂਰੇ ਸਮੇਂ ਦਾ ਵਿਆਜ ਪ੍ਰਤੀਸ਼ਤ"}: $RT=${mathPercent(R)}\\times ${mathRational(T)}$।`,
        `${apply}: $$\\frac{A}{P}=1+\\frac{RT}{100}=${resultRational}$$`,
      ];
    case "FIND_INTEREST_RATIO_FROM_RATE_TIME":
      return [
        `${hi ? "पूरे समय का ब्याज प्रतिशत" : "ਪੂਰੇ ਸਮੇਂ ਦਾ ਵਿਆਜ ਪ੍ਰਤੀਸ਼ਤ"}: $RT=${mathPercent(R)}\\times ${mathRational(T)}$।`,
        `${apply}: $$\\frac{I}{P}=\\frac{RT}{100}=${resultRational}$$`,
      ];
    case "FIND_AMOUNT_AT_ANOTHER_TIME": {
      const knownAmount = requireRational(data.request, "knownAmount");
      const knownTime = requireRational(data.request, "knownTimeYears");
      const targetTime = requireRational(data.request, "targetTimeYears");
      return [
        `${hi ? "राशि-गुणक से मूलधन निकालें" : "ਰਕਮ-ਗੁਣਕ ਨਾਲ ਮੂਲਧਨ ਕੱਢੋ"}: $$P=\\frac{${mathMoney(knownAmount)}}{1+\\frac{${mathPercent(R)}\\times ${mathRational(knownTime)}}{100}}$$`,
        `${apply}: $$A_2=P\\left(1+\\frac{${mathPercent(R)}\\times ${mathRational(targetTime)}}{100}\\right)=${resultMoney}$$`,
      ];
    }
    case "FIND_LATER_TIME_FROM_TWO_AMOUNT_RATIO":
      return [
        `${hi ? "पहले समय की राशि का गुणक" : "ਪਹਿਲੇ ਸਮੇਂ ਦੀ ਰਕਮ ਦਾ ਗੁਣਕ"}: $1+rT_1$।`,
        `${apply}: $$\\frac{1+rT_2}{1+rT_1}=\\frac{${data.ratio!.numerator}}{${data.ratio!.denominator}},\\qquad T_2=${resultDuration}$$`,
      ];
    default:
      return [hi ? "दिए गए मान पहचानें।" : "ਦਿੱਤੇ ਮੁੱਲ ਪਛਾਣੋ।", localizeDisplayMath(question.explanation.coreConcept.displayMath, locale)];
  }
}

function shortcutFor(
  question: IntCp001FinalEditorialV3Question,
  locale: IntCp001Locale,
  data: LocaleState,
  correctOption: string,
): { narrative: string; displayMath: string } {
  const hi = locale === "hi";
  const R = data.R;
  const T = data.T;
  if (R && T && [
    "FIND_SIMPLE_INTEREST_FROM_PRT",
    "FIND_AMOUNT_FROM_PRT",
    "FIND_PRINCIPAL_FROM_INTEREST",
    "FIND_PRINCIPAL_FROM_AMOUNT",
    "FIND_AMOUNT_MULTIPLE_FROM_RATE_TIME",
    "FIND_INTEREST_RATIO_FROM_RATE_TIME",
  ].includes(question.solveContract)) {
    const net = multiplyRational(R, T);
    return {
      narrative: hi
        ? `पहले $R\\times T$ करें। पूरे समय का ब्याज ${inlineRational(net)}% मूलधन है; इससे ${correctOption} तुरंत मिलता है।`
        : `ਪਹਿਲਾਂ $R\\times T$ ਕਰੋ। ਪੂਰੇ ਸਮੇਂ ਦਾ ਵਿਆਜ ਮੂਲਧਨ ਦਾ ${inlineRational(net)}% ਹੈ; ਇਸ ਨਾਲ ${correctOption} ਤੁਰੰਤ ਮਿਲਦਾ ਹੈ।`,
      displayMath: `$$\\text{${hi ? "कुल ब्याज प्रतिशत" : "ਕੁੱਲ ਵਿਆਜ ਪ੍ਰਤੀਸ਼ਤ"}}=R\\times T=${mathPercent(R)}\\times ${mathRational(T)}=${mathRational(net)}\\%$$`,
    };
  }

  const narrativesHi: Record<string, string> = {
    FIND_RATE_FROM_INTEREST: "कुल ब्याज को मूलधन का प्रतिशत बनाकर समय से भाग दें।",
    FIND_RATE_FROM_AMOUNT: "राशि में से मूलधन घटाएँ, ब्याज प्रतिशत निकालें और समय से भाग दें।",
    FIND_TIME_FROM_INTEREST: "एक वर्ष का ब्याज निकालें; कुल ब्याज को उससे भाग देने पर समय मिलता है।",
    FIND_TIME_FROM_AMOUNT: "राशि में से मूलधन घटाकर कुल ब्याज लें और एक वर्ष के ब्याज से भाग दें।",
    FIND_INTEREST_FOR_TARGET_DURATION: "ब्याज को केवल समय के अनुपात से बढ़ाएँ या घटाएँ।",
    FIND_RATE_FROM_AMOUNT_MULTIPLE: "राशि के गुणक से 1 घटाएँ; बचा भाग पूरे समय का ब्याज है।",
    FIND_TIME_FROM_AMOUNT_MULTIPLE: "राशि के गुणक से 1 घटाकर उसे वार्षिक दर से बाँटें।",
    FIND_TIME_FROM_INTEREST_RATIO: "यह अनुपात पहले से ब्याज-भाग है; इसमें से 1 नहीं घटाना।",
    FIND_RATE_FROM_INTEREST_RATIO: "ब्याज-भाग को दिए समय से बाँटकर वार्षिक दर लें।",
    FIND_ANNUAL_INTEREST_FROM_TWO_AMOUNTS: "दो राशियों का अंतर लेकर केवल समय-अंतर से भाग दें।",
    FIND_PRINCIPAL_FROM_TWO_AMOUNTS: "राशि-अंतर से वार्षिक ब्याज और फिर पहली राशि से मूलधन निकालें।",
    FIND_RATE_FROM_TWO_AMOUNTS: "राशि-अंतर से वार्षिक ब्याज निकालकर मूलधन का प्रतिशत लें।",
    FIND_RATE_FROM_TWO_TIME_AMOUNT_RATIO: "मूलधन 100 मानकर दोनों समय की राशियाँ प्रतिशत में लिखें।",
    FIND_AMOUNT_AT_ANOTHER_TIME: "दोनों समय के राशि-गुणकों का सीधा अनुपात लगाएँ।",
    FIND_LATER_TIME_FROM_TWO_AMOUNT_RATIO: "मूलधन 100 मानें, पहली राशि का प्रतिशत निकालें और दिए अनुपात से बाद की राशि पाएँ।",
  };
  const narrativesPa: Record<string, string> = {
    FIND_RATE_FROM_INTEREST: "ਕੁੱਲ ਵਿਆਜ ਨੂੰ ਮੂਲਧਨ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਬਣਾ ਕੇ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦਿਓ।",
    FIND_RATE_FROM_AMOUNT: "ਰਕਮ ਵਿੱਚੋਂ ਮੂਲਧਨ ਘਟਾਓ, ਵਿਆਜ ਪ੍ਰਤੀਸ਼ਤ ਕੱਢੋ ਅਤੇ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦਿਓ।",
    FIND_TIME_FROM_INTEREST: "ਇੱਕ ਸਾਲ ਦਾ ਵਿਆਜ ਕੱਢੋ; ਕੁੱਲ ਵਿਆਜ ਨੂੰ ਉਸ ਨਾਲ ਭਾਗ ਦੇਣ ਉੱਤੇ ਸਮਾਂ ਮਿਲਦਾ ਹੈ।",
    FIND_TIME_FROM_AMOUNT: "ਰਕਮ ਵਿੱਚੋਂ ਮੂਲਧਨ ਘਟਾ ਕੇ ਕੁੱਲ ਵਿਆਜ ਲਵੋ ਅਤੇ ਇੱਕ ਸਾਲ ਦੇ ਵਿਆਜ ਨਾਲ ਭਾਗ ਦਿਓ।",
    FIND_INTEREST_FOR_TARGET_DURATION: "ਵਿਆਜ ਨੂੰ ਸਿਰਫ਼ ਸਮੇਂ ਦੇ ਅਨੁਪਾਤ ਨਾਲ ਵਧਾਓ ਜਾਂ ਘਟਾਓ।",
    FIND_RATE_FROM_AMOUNT_MULTIPLE: "ਰਕਮ ਦੇ ਗੁਣਕ ਵਿੱਚੋਂ 1 ਘਟਾਓ; ਬਚਿਆ ਹਿੱਸਾ ਪੂਰੇ ਸਮੇਂ ਦਾ ਵਿਆਜ ਹੈ।",
    FIND_TIME_FROM_AMOUNT_MULTIPLE: "ਰਕਮ ਦੇ ਗੁਣਕ ਵਿੱਚੋਂ 1 ਘਟਾ ਕੇ ਉਸਨੂੰ ਸਾਲਾਨਾ ਦਰ ਨਾਲ ਵੰਡੋ।",
    FIND_TIME_FROM_INTEREST_RATIO: "ਇਹ ਅਨੁਪਾਤ ਪਹਿਲਾਂ ਹੀ ਵਿਆਜ-ਹਿੱਸਾ ਹੈ; ਇਸ ਵਿੱਚੋਂ 1 ਨਹੀਂ ਘਟਾਉਣਾ।",
    FIND_RATE_FROM_INTEREST_RATIO: "ਵਿਆਜ-ਹਿੱਸੇ ਨੂੰ ਦਿੱਤੇ ਸਮੇਂ ਨਾਲ ਵੰਡ ਕੇ ਸਾਲਾਨਾ ਦਰ ਲਵੋ।",
    FIND_ANNUAL_INTEREST_FROM_TWO_AMOUNTS: "ਦੋ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਲੈ ਕੇ ਸਿਰਫ਼ ਸਮੇਂ ਦੇ ਅੰਤਰ ਨਾਲ ਭਾਗ ਦਿਓ।",
    FIND_PRINCIPAL_FROM_TWO_AMOUNTS: "ਰਕਮਾਂ ਦੇ ਅੰਤਰ ਤੋਂ ਸਾਲਾਨਾ ਵਿਆਜ ਅਤੇ ਫਿਰ ਪਹਿਲੀ ਰਕਮ ਤੋਂ ਮੂਲਧਨ ਕੱਢੋ।",
    FIND_RATE_FROM_TWO_AMOUNTS: "ਰਕਮਾਂ ਦੇ ਅੰਤਰ ਤੋਂ ਸਾਲਾਨਾ ਵਿਆਜ ਕੱਢ ਕੇ ਮੂਲਧਨ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਲਵੋ।",
    FIND_RATE_FROM_TWO_TIME_AMOUNT_RATIO: "ਮੂਲਧਨ 100 ਮੰਨ ਕੇ ਦੋਵਾਂ ਸਮਿਆਂ ਦੀਆਂ ਰਕਮਾਂ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਲਿਖੋ।",
    FIND_AMOUNT_AT_ANOTHER_TIME: "ਦੋਵਾਂ ਸਮਿਆਂ ਦੇ ਰਕਮ-ਗੁਣਕਾਂ ਦਾ ਸਿੱਧਾ ਅਨੁਪਾਤ ਲਗਾਓ।",
    FIND_LATER_TIME_FROM_TWO_AMOUNT_RATIO: "ਮੂਲਧਨ 100 ਮੰਨੋ, ਪਹਿਲੀ ਰਕਮ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਕੱਢੋ ਅਤੇ ਦਿੱਤੇ ਅਨੁਪਾਤ ਨਾਲ ਬਾਅਦ ਦੀ ਰਕਮ ਲੱਭੋ।",
  };

  return {
    narrative: `${(hi ? narrativesHi : narrativesPa)[question.solveContract] ?? (hi ? "सही संबंध में सीधे मान रखकर उत्तर निकालें।" : "ਸਹੀ ਸੰਬੰਧ ਵਿੱਚ ਸਿੱਧੇ ਮੁੱਲ ਰੱਖ ਕੇ ਉੱਤਰ ਕੱਢੋ।")} ${hi ? "उत्तर" : "ਉੱਤਰ"}: ${correctOption}।`,
    displayMath: localizeDisplayMath(question.explanation.examShortcut.displayMath ?? question.explanation.coreConcept.displayMath, locale),
  };
}

const TRAP_HI: Record<string, string> = {
  RETURNED_AMOUNT_INSTEAD_OF_INTEREST: "इसमें मूलधन जोड़कर कुल राशि लौटा दी गई, जबकि प्रश्न केवल ब्याज पूछता है।",
  RETURNED_INTEREST_INSTEAD_OF_AMOUNT: "केवल ब्याज निकाला गया और मूलधन नहीं जोड़ा गया।",
  OMITTED_TIME_FACTOR: "केवल एक वर्ष का ब्याज लिया गया; पूरा समय शामिल नहीं किया गया।",
  OMITTED_DIVIDE_BY_100: "प्रतिशत को सीधे गुणक मान लिया गया और 100 से भाग नहीं दिया गया।",
  MONTHS_TREATED_AS_YEARS: "महीनों की संख्या को उतने ही वर्ष मान लिया गया।",
  DAYS_TREATED_AS_YEARS: "दिनों को वर्ष में बदले बिना सीधे समय मान लिया गया।",
  USED_AMOUNT_AS_PRINCIPAL: "कुल राशि को ही मूलधन मान लिया गया।",
  USED_INTEREST_AS_PRINCIPAL: "ब्याज को मूलधन समझ लिया गया।",
  OMITTED_ONE_PLUS: "राशि में मूलधन का पूरा 1 भाग जोड़ना भूल गए।",
  OMITTED_TIME_IN_RATE: "कुल ब्याज प्रतिशत को समय से भाग नहीं दिया गया।",
  USED_AMOUNT_IN_RATE_NUMERATOR: "दर निकालते समय ब्याज की जगह कुल राशि रख दी गई।",
  RATE_DECIMAL_REPORTED_AS_PERCENT: "दशमलव दर को प्रतिशत में बदले बिना उत्तर दे दिया गया।",
  OMITTED_RATE_IN_TIME: "समय निकालते समय वार्षिक दर से भाग नहीं दिया गया।",
  USED_AMOUNT_IN_TIME_NUMERATOR: "समय के सूत्र में ब्याज की जगह कुल राशि रखी गई।",
  TIME_RECIPROCAL: "समय का अनुपात उलट दिया गया।",
  TOTAL_INTEREST_REPORTED: "माँगे गए समय के बजाय पूरे ज्ञात समय का ब्याज लौटा दिया गया।",
  ANNUAL_INTEREST_REPORTED: "माँगे गए समय के बजाय केवल एक वर्ष का ब्याज चुना गया।",
  SUBDURATION_IGNORED: "समय बदलने के बाद भी पुराना ब्याज ही रख दिया गया।",
  TARGET_DURATION_INVERTED: "ज्ञात और लक्ष्य समय का अनुपात उलट दिया गया।",
  MULTIPLE_USED_WITHOUT_SUBTRACTING_ONE: "राशि के गुणक में से मूलधन का 1 भाग नहीं घटाया गया।",
  INTEREST_RATIO_TREATED_AS_AMOUNT_MULTIPLE: "ब्याज-अनुपात को कुल राशि का गुणक मान लिया गया।",
  COMPOUND_MODEL_USED: "साधारण ब्याज के प्रश्न में चक्रवृद्धि विधि लगा दी गई।",
  RATE_TIME_PRODUCT_INVERTED: "दर और समय से बने कुल ब्याज-भाग को उलट दिया गया।",
  YEARS_REPORTED_AS_MONTHS: "वर्षों की संख्या को बिना बदलें महीने लिख दिया गया।",
  MONTHS_DIVIDED_BY_12: "महीनों में माँगे उत्तर को फिर 12 से भाग दे दिया गया।",
  MONTHS_MULTIPLIED_TWICE: "वर्ष से महीने का परिवर्तन दो बार कर दिया गया।",
  AMOUNT_GAP_REPORTED: "राशियों का अंतर ही उत्तर मान लिया गया; उसे समय-अंतर से भाग नहीं दिया।",
  TIME_GAP_IGNORED: "दो राशियों का अंतर एक वर्ष का ब्याज मान लिया गया।",
  LATER_TIME_USED_INSTEAD_OF_GAP: "समय-अंतर की जगह बाद वाला पूरा समय इस्तेमाल किया गया।",
  EARLIER_AMOUNT_USED_AS_PRINCIPAL: "पहली देखी गई राशि को मूलधन मान लिया गया।",
  LATER_AMOUNT_USED_AS_PRINCIPAL: "बाद की राशि को मूलधन मान लिया गया।",
  ANNUAL_INTEREST_USED_AS_RATE: "रुपयों में मिला वार्षिक ब्याज प्रतिशत दर समझ लिया गया।",
  RATIO_MINUS_ONE_OMITTED: "राशि-अनुपात से मूलधन वाला भाग अलग नहीं किया गया।",
  EARLIER_TIME_RATIO_TERM_OMITTED: "पहले समय का राशि-गुणक छोड़ दिया गया।",
  AMOUNT_MULTIPLE_REPORTED_AS_INTEREST_RATIO: "कुल राशि का गुणक दिया गया, जबकि प्रश्न ब्याज-मूलधन अनुपात पूछता है।",
  INTEREST_RATIO_REPORTED_AS_AMOUNT_MULTIPLE: "ब्याज-भाग में मूलधन का 1 भाग जोड़े बिना राशि का गुणक बताया गया।",
  RATE_TIME_PRODUCT_REPORTED_AS_PERCENT: "दशमलव ब्याज-भाग को सही प्रतिशत रूप में नहीं बदला गया।",
  RECIPROCAL_RATIO: "दिया गया अनुपात उलट दिया गया।",
  RETURNED_KNOWN_AMOUNT: "लक्ष्य समय की राशि निकालने के बजाय ज्ञात राशि दोहरा दी गई।",
  USED_KNOWN_AMOUNT_AS_PRINCIPAL: "ज्ञात राशि को नया मूलधन मानकर ब्याज लगाया गया।",
  RESET_TIME_ORIGIN: "पहले समय पर निवेश को फिर से शुरू हुआ मान लिया गया।",
  ADDED_ONE_EXTRA_YEAR: "लक्ष्य समय से एक अतिरिक्त वर्ष का ब्याज जोड़ दिया गया।",
  REMOVED_ONE_YEAR: "सही राशि में से एक वर्ष का ब्याज घटा दिया गया।",
  REPORTED_TIME_GAP: "आरम्भ से कुल समय के बजाय केवल दोनों समयों का अंतर दिया गया।",
  IGNORED_EARLIER_AMOUNT_FACTOR: "अनुपात को पहली राशि के गुणक की जगह सीधे मूलधन पर लगा दिया गया।",
  FAILED_TO_REMOVE_PRINCIPAL_UNIT: "कुल राशि-गुणक को शुद्ध ब्याज मान लिया गया और 1 नहीं घटाया।",
  RETURNED_KNOWN_TIME: "प्रश्न में दिया पहला समय ही उत्तर के रूप में दोहरा दिया गया।",
};

const TRAP_PA: Record<string, string> = {
  RETURNED_AMOUNT_INSTEAD_OF_INTEREST: "ਇਸ ਵਿੱਚ ਮੂਲਧਨ ਜੋੜ ਕੇ ਕੁੱਲ ਰਕਮ ਦਿੱਤੀ ਗਈ, ਜਦਕਿ ਪ੍ਰਸ਼ਨ ਸਿਰਫ਼ ਵਿਆਜ ਪੁੱਛਦਾ ਹੈ।",
  RETURNED_INTEREST_INSTEAD_OF_AMOUNT: "ਸਿਰਫ਼ ਵਿਆਜ ਕੱਢਿਆ ਗਿਆ ਅਤੇ ਮੂਲਧਨ ਨਹੀਂ ਜੋੜਿਆ ਗਿਆ।",
  OMITTED_TIME_FACTOR: "ਸਿਰਫ਼ ਇੱਕ ਸਾਲ ਦਾ ਵਿਆਜ ਲਿਆ ਗਿਆ; ਪੂਰਾ ਸਮਾਂ ਸ਼ਾਮਲ ਨਹੀਂ ਕੀਤਾ ਗਿਆ।",
  OMITTED_DIVIDE_BY_100: "ਪ੍ਰਤੀਸ਼ਤ ਨੂੰ ਸਿੱਧਾ ਗੁਣਕ ਮੰਨਿਆ ਗਿਆ ਅਤੇ 100 ਨਾਲ ਭਾਗ ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ।",
  MONTHS_TREATED_AS_YEARS: "ਮਹੀਨਿਆਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਉਨ੍ਹਾਂ ਹੀ ਸਾਲਾਂ ਦੇ ਬਰਾਬਰ ਮੰਨ ਲਿਆ ਗਿਆ।",
  DAYS_TREATED_AS_YEARS: "ਦਿਨਾਂ ਨੂੰ ਸਾਲ ਵਿੱਚ ਬਦਲੇ ਬਿਨਾਂ ਸਿੱਧਾ ਸਮਾਂ ਮੰਨ ਲਿਆ ਗਿਆ।",
  USED_AMOUNT_AS_PRINCIPAL: "ਕੁੱਲ ਰਕਮ ਨੂੰ ਹੀ ਮੂਲਧਨ ਮੰਨ ਲਿਆ ਗਿਆ।",
  USED_INTEREST_AS_PRINCIPAL: "ਵਿਆਜ ਨੂੰ ਮੂਲਧਨ ਸਮਝ ਲਿਆ ਗਿਆ।",
  OMITTED_ONE_PLUS: "ਕੁੱਲ ਰਕਮ ਵਿੱਚ ਮੂਲਧਨ ਦਾ ਪੂਰਾ 1 ਹਿੱਸਾ ਜੋੜਨਾ ਭੁੱਲ ਗਏ।",
  OMITTED_TIME_IN_RATE: "ਕੁੱਲ ਵਿਆਜ ਪ੍ਰਤੀਸ਼ਤ ਨੂੰ ਸਮੇਂ ਨਾਲ ਭਾਗ ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ।",
  USED_AMOUNT_IN_RATE_NUMERATOR: "ਦਰ ਕੱਢਦੇ ਸਮੇਂ ਵਿਆਜ ਦੀ ਥਾਂ ਕੁੱਲ ਰਕਮ ਰੱਖ ਦਿੱਤੀ ਗਈ।",
  RATE_DECIMAL_REPORTED_AS_PERCENT: "ਦਸ਼ਮਲਵ ਦਰ ਨੂੰ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਬਦਲੇ ਬਿਨਾਂ ਉੱਤਰ ਦਿੱਤਾ ਗਿਆ।",
  OMITTED_RATE_IN_TIME: "ਸਮਾਂ ਕੱਢਦੇ ਸਮੇਂ ਸਾਲਾਨਾ ਦਰ ਨਾਲ ਭਾਗ ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ।",
  USED_AMOUNT_IN_TIME_NUMERATOR: "ਸਮੇਂ ਦੇ ਸੂਤਰ ਵਿੱਚ ਵਿਆਜ ਦੀ ਥਾਂ ਕੁੱਲ ਰਕਮ ਰੱਖੀ ਗਈ।",
  TIME_RECIPROCAL: "ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਉਲਟ ਦਿੱਤਾ ਗਿਆ।",
  TOTAL_INTEREST_REPORTED: "ਮੰਗੇ ਸਮੇਂ ਦੀ ਥਾਂ ਪੂਰੇ ਜਾਣੇ ਸਮੇਂ ਦਾ ਵਿਆਜ ਦਿੱਤਾ ਗਿਆ।",
  ANNUAL_INTEREST_REPORTED: "ਮੰਗੇ ਸਮੇਂ ਦੀ ਥਾਂ ਸਿਰਫ਼ ਇੱਕ ਸਾਲ ਦਾ ਵਿਆਜ ਚੁਣਿਆ ਗਿਆ।",
  SUBDURATION_IGNORED: "ਸਮਾਂ ਬਦਲਣ ਤੋਂ ਬਾਅਦ ਵੀ ਪੁਰਾਣਾ ਵਿਆਜ ਹੀ ਰੱਖਿਆ ਗਿਆ।",
  TARGET_DURATION_INVERTED: "ਜਾਣੇ ਅਤੇ ਲਕਸ਼ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਉਲਟ ਦਿੱਤਾ ਗਿਆ।",
  MULTIPLE_USED_WITHOUT_SUBTRACTING_ONE: "ਰਕਮ ਦੇ ਗੁਣਕ ਵਿੱਚੋਂ ਮੂਲਧਨ ਦਾ 1 ਹਿੱਸਾ ਨਹੀਂ ਘਟਾਇਆ ਗਿਆ।",
  INTEREST_RATIO_TREATED_AS_AMOUNT_MULTIPLE: "ਵਿਆਜ-ਅਨੁਪਾਤ ਨੂੰ ਕੁੱਲ ਰਕਮ ਦਾ ਗੁਣਕ ਮੰਨ ਲਿਆ ਗਿਆ।",
  COMPOUND_MODEL_USED: "ਸਧਾਰਣ ਵਿਆਜ ਦੇ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਚੱਕਰਵੱਧੀ ਤਰੀਕਾ ਲਗਾ ਦਿੱਤਾ ਗਿਆ।",
  RATE_TIME_PRODUCT_INVERTED: "ਦਰ ਅਤੇ ਸਮੇਂ ਤੋਂ ਬਣਿਆ ਕੁੱਲ ਵਿਆਜ-ਹਿੱਸਾ ਉਲਟ ਦਿੱਤਾ ਗਿਆ।",
  YEARS_REPORTED_AS_MONTHS: "ਸਾਲਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਬਿਨਾਂ ਬਦਲੇ ਮਹੀਨੇ ਲਿਖ ਦਿੱਤਾ ਗਿਆ।",
  MONTHS_DIVIDED_BY_12: "ਮਹੀਨਿਆਂ ਵਿੱਚ ਮੰਗੇ ਉੱਤਰ ਨੂੰ ਫਿਰ 12 ਨਾਲ ਭਾਗ ਦਿੱਤਾ ਗਿਆ।",
  MONTHS_MULTIPLIED_TWICE: "ਸਾਲ ਤੋਂ ਮਹੀਨੇ ਦਾ ਬਦਲਾਅ ਦੋ ਵਾਰ ਕੀਤਾ ਗਿਆ।",
  AMOUNT_GAP_REPORTED: "ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਹੀ ਉੱਤਰ ਮੰਨਿਆ ਗਿਆ; ਉਸਨੂੰ ਸਮੇਂ ਦੇ ਅੰਤਰ ਨਾਲ ਭਾਗ ਨਹੀਂ ਦਿੱਤਾ।",
  TIME_GAP_IGNORED: "ਦੋ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਇੱਕ ਸਾਲ ਦਾ ਵਿਆਜ ਮੰਨ ਲਿਆ ਗਿਆ।",
  LATER_TIME_USED_INSTEAD_OF_GAP: "ਸਮੇਂ ਦੇ ਅੰਤਰ ਦੀ ਥਾਂ ਬਾਅਦ ਵਾਲਾ ਪੂਰਾ ਸਮਾਂ ਵਰਤਿਆ ਗਿਆ।",
  EARLIER_AMOUNT_USED_AS_PRINCIPAL: "ਪਹਿਲੀ ਵੇਖੀ ਰਕਮ ਨੂੰ ਮੂਲਧਨ ਮੰਨ ਲਿਆ ਗਿਆ।",
  LATER_AMOUNT_USED_AS_PRINCIPAL: "ਬਾਅਦ ਦੀ ਰਕਮ ਨੂੰ ਮੂਲਧਨ ਮੰਨ ਲਿਆ ਗਿਆ।",
  ANNUAL_INTEREST_USED_AS_RATE: "ਰੁਪਏ ਵਿੱਚ ਮਿਲੇ ਸਾਲਾਨਾ ਵਿਆਜ ਨੂੰ ਪ੍ਰਤੀਸ਼ਤ ਦਰ ਸਮਝ ਲਿਆ ਗਿਆ।",
  RATIO_MINUS_ONE_OMITTED: "ਰਕਮ-ਅਨੁਪਾਤ ਵਿੱਚੋਂ ਮੂਲਧਨ ਵਾਲਾ ਹਿੱਸਾ ਵੱਖ ਨਹੀਂ ਕੀਤਾ ਗਿਆ।",
  EARLIER_TIME_RATIO_TERM_OMITTED: "ਪਹਿਲੇ ਸਮੇਂ ਦਾ ਰਕਮ-ਗੁਣਕ ਛੱਡ ਦਿੱਤਾ ਗਿਆ।",
  AMOUNT_MULTIPLE_REPORTED_AS_INTEREST_RATIO: "ਕੁੱਲ ਰਕਮ ਦਾ ਗੁਣਕ ਦਿੱਤਾ ਗਿਆ, ਜਦਕਿ ਪ੍ਰਸ਼ਨ ਵਿਆਜ-ਮੂਲਧਨ ਅਨੁਪਾਤ ਪੁੱਛਦਾ ਹੈ।",
  INTEREST_RATIO_REPORTED_AS_AMOUNT_MULTIPLE: "ਵਿਆਜ-ਹਿੱਸੇ ਵਿੱਚ ਮੂਲਧਨ ਦਾ 1 ਹਿੱਸਾ ਜੋੜੇ ਬਿਨਾਂ ਰਕਮ ਦਾ ਗੁਣਕ ਦੱਸਿਆ ਗਿਆ।",
  RATE_TIME_PRODUCT_REPORTED_AS_PERCENT: "ਦਸ਼ਮਲਵ ਵਿਆਜ-ਹਿੱਸੇ ਨੂੰ ਸਹੀ ਪ੍ਰਤੀਸ਼ਤ ਰੂਪ ਵਿੱਚ ਨਹੀਂ ਬਦਲਿਆ ਗਿਆ।",
  RECIPROCAL_RATIO: "ਦਿੱਤਾ ਅਨੁਪਾਤ ਉਲਟ ਦਿੱਤਾ ਗਿਆ।",
  RETURNED_KNOWN_AMOUNT: "ਲਕਸ਼ ਸਮੇਂ ਦੀ ਰਕਮ ਕੱਢਣ ਦੀ ਥਾਂ ਜਾਣੀ ਰਕਮ ਦੁਹਰਾ ਦਿੱਤੀ ਗਈ।",
  USED_KNOWN_AMOUNT_AS_PRINCIPAL: "ਜਾਣੀ ਰਕਮ ਨੂੰ ਨਵਾਂ ਮੂਲਧਨ ਮੰਨ ਕੇ ਵਿਆਜ ਲਾਇਆ ਗਿਆ।",
  RESET_TIME_ORIGIN: "ਪਹਿਲੇ ਸਮੇਂ ਉੱਤੇ ਨਿਵੇਸ਼ ਮੁੜ ਸ਼ੁਰੂ ਹੋਇਆ ਮੰਨ ਲਿਆ ਗਿਆ।",
  ADDED_ONE_EXTRA_YEAR: "ਲਕਸ਼ ਸਮੇਂ ਤੋਂ ਇੱਕ ਵਾਧੂ ਸਾਲ ਦਾ ਵਿਆਜ ਜੋੜ ਦਿੱਤਾ ਗਿਆ।",
  REMOVED_ONE_YEAR: "ਸਹੀ ਰਕਮ ਵਿੱਚੋਂ ਇੱਕ ਸਾਲ ਦਾ ਵਿਆਜ ਘਟਾ ਦਿੱਤਾ ਗਿਆ।",
  REPORTED_TIME_GAP: "ਸ਼ੁਰੂ ਤੋਂ ਕੁੱਲ ਸਮੇਂ ਦੀ ਥਾਂ ਸਿਰਫ਼ ਦੋਵਾਂ ਸਮਿਆਂ ਦਾ ਅੰਤਰ ਦਿੱਤਾ ਗਿਆ।",
  IGNORED_EARLIER_AMOUNT_FACTOR: "ਅਨੁਪਾਤ ਨੂੰ ਪਹਿਲੀ ਰਕਮ ਦੇ ਗੁਣਕ ਦੀ ਥਾਂ ਸਿੱਧਾ ਮੂਲਧਨ ਉੱਤੇ ਲਗਾਇਆ ਗਿਆ।",
  FAILED_TO_REMOVE_PRINCIPAL_UNIT: "ਕੁੱਲ ਰਕਮ-ਗੁਣਕ ਨੂੰ ਸਿਰਫ਼ ਵਿਆਜ ਮੰਨਿਆ ਗਿਆ ਅਤੇ 1 ਨਹੀਂ ਘਟਾਇਆ।",
  RETURNED_KNOWN_TIME: "ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤਾ ਪਹਿਲਾ ਸਮਾਂ ਹੀ ਉੱਤਰ ਵਜੋਂ ਦੁਹਰਾ ਦਿੱਤਾ ਗਿਆ।",
};

function trapText(id: string, locale: IntCp001Locale): string {
  const found = (locale === "hi" ? TRAP_HI : TRAP_PA)[id];
  if (found) return found;
  return locale === "hi"
    ? "यह विकल्प साधारण ब्याज के सही संबंध को पूरा नहीं करता।"
    : "ਇਹ ਵਿਕਲਪ ਸਧਾਰਣ ਵਿਆਜ ਦੇ ਸਹੀ ਸੰਬੰਧ ਨੂੰ ਪੂਰਾ ਨਹੀਂ ਕਰਦਾ।";
}

function buildExplanation(
  question: IntCp001FinalEditorialV3Question,
  locale: IntCp001Locale,
  data: LocaleState,
  options: string[],
): IntCp001LocalizedExplanation {
  const copy = INT_CP001_LOCALE_COPY[locale];
  const correctOption = options[question.correctIndex]!;
  const correctAudit = question.optionAudit[question.correctIndex]!;
  if (!isRational(correctAudit.result.value)) throw new Error("Correct INT-CP-001 option has no rational value.");
  const work = workingEquation(question, data, correctAudit.result.value, locale);
  const core = (locale === "hi" ? CORE_HI : CORE_PA)[question.solveContract]
    ?? (locale === "hi" ? "साधारण ब्याज के सही संबंध का प्रयोग करें।" : "ਸਧਾਰਣ ਵਿਆਜ ਦੇ ਸਹੀ ਸੰਬੰਧ ਦੀ ਵਰਤੋਂ ਕਰੋ।");
  const conclusion = locale === "hi"
    ? `अतः सही उत्तर ${correctOption} है।`
    : `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${correctOption} ਹੈ।`;
  const verification = locale === "hi"
    ? "प्राप्त मान को मूल साधारण-ब्याज संबंध में रखने पर दी गई राशि या ब्याज ठीक पुनः प्राप्त होता है।"
    : "ਮਿਲੇ ਮੁੱਲ ਨੂੰ ਮੂਲ ਸਧਾਰਣ-ਵਿਆਜ ਸੰਬੰਧ ਵਿੱਚ ਰੱਖਣ ਉੱਤੇ ਦਿੱਤੀ ਰਕਮ ਜਾਂ ਵਿਆਜ ਠੀਕ ਮੁੜ ਮਿਲਦਾ ਹੈ।";
  const shortcut = shortcutFor(question, locale, data, correctOption);
  const traps = question.optionAudit
    .map((item, index) => ({ item, index }))
    .filter(({ index }) => index !== question.correctIndex)
    .map(({ item, index }) => ({
      optionNumber: index + 1,
      optionText: options[index]!,
      misconceptionId: item.misconceptionId,
      explanation: trapText(item.misconceptionId, locale),
    }));

  const relation = localizeDisplayMath(question.explanation.coreConcept.displayMath, locale);
  const notice = core;
  const commonTrap = locale === "hi"
    ? "ब्याज, मूलधन और कुल राशि को अलग-अलग अर्थों में रखें और समय की इकाई अवश्य बदलें।"
    : "ਵਿਆਜ, ਮੂਲਧਨ ਅਤੇ ਕੁੱਲ ਰਕਮ ਨੂੰ ਵੱਖਰੇ ਅਰਥਾਂ ਵਿੱਚ ਰੱਖੋ ਅਤੇ ਸਮੇਂ ਦੀ ਇਕਾਈ ਜ਼ਰੂਰ ਬਦਲੋ।";

  return {
    notice,
    relation,
    steps: work,
    verification,
    conclusion,
    commonTrap,
    coreConcept: {
      heading: copy.headings.core,
      narrative: core,
      displayMath: relation,
    },
    stepByStep: {
      heading: copy.headings.steps,
      steps: work,
      verification,
      conclusion,
    },
    examShortcut: {
      heading: copy.headings.shortcut,
      narrative: shortcut.narrative,
      displayMath: shortcut.displayMath,
    },
    trapAnalysis: {
      heading: copy.headings.traps,
      items: traps,
    },
  };
}

function buildReasoningGraph(
  explanation: IntCp001LocalizedExplanation,
): IntCp001FinalEditorialV3Question["reasoningGraph"] {
  return {
    nodes: [
      {
        id: "given",
        kind: "GIVEN",
        text: explanation.stepByStep.steps[0] ?? explanation.coreConcept.narrative,
        dependsOn: [],
      },
      {
        id: "relation",
        kind: "RELATION",
        text: explanation.coreConcept.narrative,
        mathLatex: explanation.coreConcept.displayMath,
        dependsOn: ["given"],
      },
      {
        id: "derivation",
        kind: "DERIVATION",
        text: explanation.stepByStep.steps[1] ?? explanation.stepByStep.conclusion,
        dependsOn: ["relation"],
      },
      {
        id: "verification",
        kind: "VERIFICATION",
        text: explanation.stepByStep.verification,
        dependsOn: ["derivation"],
      },
      {
        id: "conclusion",
        kind: "CONCLUSION",
        text: explanation.stepByStep.conclusion,
        dependsOn: ["verification"],
      },
    ],
  };
}

export function generateIntCp001LocalizedQuestion(
  qlId: IntCp001FinalQlId,
  seed: string,
  locale: IntCp001Locale,
): IntCp001LocalizedQuestion {
  const english = generateIntCp001FinalEditorialV3Question(qlId, seed);
  const data = buildLocaleState(english);
  const stem = localizedStem(english, locale, data);
  const options = english.optionAudit.map((option) => formatLocalizedOption(option.result, option.text, locale));
  const optionAudit = english.optionAudit.map((option, index) => ({
    ...option,
    text: options[index]!,
  }));
  const explanation = buildExplanation(english, locale, data, options);
  const reasoningGraph = buildReasoningGraph(explanation);
  const errors = [...english.validation.errors];

  if (new Set(options).size !== 4) errors.push("Localized options are not unique.");
  if (!stem.endsWith("?")) errors.push("Localized stem is not a complete question.");
  if (!explanation.stepByStep.conclusion.includes(options[english.correctIndex]!)) {
    errors.push("Localized conclusion does not contain the displayed correct option.");
  }
  if (explanation.trapAnalysis.items.length !== 3) {
    errors.push(`Localized explanation must analyse three distractors; found ${explanation.trapAnalysis.items.length}.`);
  }
  for (const trap of explanation.trapAnalysis.items) {
    if (trap.optionText !== options[trap.optionNumber - 1]) {
      errors.push(`Localized trap option ${trap.optionNumber} is out of sync.`);
    }
  }

  const learnerText = [
    stem,
    ...options,
    explanation.coreConcept.heading,
    explanation.coreConcept.narrative,
    explanation.coreConcept.displayMath,
    explanation.stepByStep.heading,
    ...explanation.stepByStep.steps,
    explanation.stepByStep.verification,
    explanation.stepByStep.conclusion,
    explanation.examShortcut.heading,
    explanation.examShortcut.narrative,
    explanation.examShortcut.displayMath,
    explanation.trapAnalysis.heading,
    ...explanation.trapAnalysis.items.flatMap((item) => [item.optionText, item.explanation]),
  ].join(" ");

  if (locale === "hi") {
    if (!hasHindiScript(learnerText)) errors.push("Hindi learner text has no Devanagari script.");
    if (hasGurmukhiScript(learnerText)) errors.push("Hindi learner text contains Gurmukhi script.");
  } else {
    if (!hasGurmukhiScript(learnerText)) errors.push("Punjabi learner text has no Gurmukhi script.");
    if (hasHindiScript(learnerText)) errors.push("Punjabi learner text contains Devanagari script.");
    if (/\b(?:ਪਦ|ਸਾਦ੍ਰਿਸ਼ਤਾ)\b/u.test(learnerText)) errors.push("Punjabi learner text contains rejected formal terminology.");
  }
  if (hasInstructionalLatinLeak(learnerText)) {
    errors.push("Localized learner text contains an English instructional fallback outside MathJax.");
  }
  if (english.correctIndex !== optionAudit.findIndex((item) => item.misconceptionId === "CORRECT")) {
    errors.push("Localized correct-index parity was lost.");
  }

  return {
    ...english,
    releaseId: getIntCp001LocaleReleaseId(locale),
    language: locale,
    questionLanguageId: INT_CP001_LOCALE_COPY[locale].languageId,
    stem,
    options,
    optionAudit,
    explanation,
    reasoningGraph,
    validation: {
      ...english.validation,
      ok: errors.length === 0,
      errors,
    },
    reviewStatus: "PENDING_MULTILINGUAL_REVIEW",
    localeReviewStatus: "PENDING_HUMAN_REVIEW",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}

export function assertIntCp001LocaleParity(
  english: IntCp001FinalEditorialV3Question,
  localized: IntCp001LocalizedQuestion,
): void {
  const failures: string[] = [];
  if (english.qlId !== localized.qlId) failures.push("QL identity");
  if (english.solveContract !== localized.solveContract) failures.push("solve contract");
  if (english.correctIndex !== localized.correctIndex) failures.push("correct index");
  if (english.mathematicalFingerprint !== localized.mathematicalFingerprint) failures.push("mathematical fingerprint");
  if (stableBigIntJson(english.solution) !== stableBigIntJson(localized.solution)) failures.push("solution");
  if (stableBigIntJson(english.optionAudit.map((item) => item.result)) !== stableBigIntJson(localized.optionAudit.map((item) => item.result))) {
    failures.push("option results");
  }
  if (stableBigIntJson(english.internalProvenance) !== stableBigIntJson(localized.internalProvenance)) failures.push("internal provenance");
  if (failures.length) throw new Error(`${localized.qlId}/${localized.seed}/${localized.language} parity failed: ${failures.join(", ")}.`);
}
