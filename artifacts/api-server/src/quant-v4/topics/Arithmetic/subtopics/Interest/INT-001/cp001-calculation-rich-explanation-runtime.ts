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
  asRecord,
  formatMoneyLocalized,
  mathRational,
  readRational,
  requireRational,
  type UnknownRecord,
} from "./cp001-localization-foundation";
import {
  generateIntCp001ExplanationSanitizationQuestion,
  sanitizeIntCp001LearnerMath,
  validateIntCp001SanitizedExplanation,
  type IntCp001ExplanationSanitizationLanguage,
  type IntCp001ExplanationSanitizationQuestion,
} from "./cp001-explanation-sanitization-runtime";

export const INT_CP001_CALCULATION_RICH_PATCH_ID =
  "INT-CP-001-CALCULATION-RICH-EXPLANATIONS-V1" as const;
export const INT_CP001_CALCULATION_RICH_STATUS =
  "CALCULATION_RICH_EXPLANATION_CANDIDATE" as const;
export const INT_CP001_CALCULATION_RICH_REVIEW_STATUS =
  "PENDING_CALCULATION_RICH_EXPLANATION_REVIEW" as const;

export type IntCp001CalculationRichLanguage = IntCp001ExplanationSanitizationLanguage;

export type IntCp001CalculationRichQuestion = Omit<
  IntCp001ExplanationSanitizationQuestion,
  "releaseId" | "maturity" | "reviewStatus" | "localeReviewStatus" | "explanation" | "validation"
> & {
  releaseId: "INT-CP-001-EN-v6" | "INT-CP-001-HI-v6" | "INT-CP-001-PA-v6";
  maturity: typeof INT_CP001_CALCULATION_RICH_STATUS;
  reviewStatus: typeof INT_CP001_CALCULATION_RICH_REVIEW_STATUS;
  localeReviewStatus: "PENDING_HUMAN_REVIEW";
  explanation: IntCp001ExplanationSanitizationQuestion["explanation"];
  validation: IntCp001ExplanationSanitizationQuestion["validation"];
  calculationRichTrace: {
    patchId: typeof INT_CP001_CALCULATION_RICH_PATCH_ID;
    supersedesReleaseId: string;
    workedStepCount: number;
    explicitFormula: true;
    explicitNumericSubstitution: true;
    explicitArithmetic: true;
    canonicalStemChanged: false;
    optionValuesChanged: false;
    correctIndexChanged: false;
  };
};

interface CalculationState {
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
  ratio?: Rational;
  multiple?: Rational;
}

interface LocaleCopy {
  given: string;
  formula: string;
  substitute: string;
  calculate: string;
  convert: string;
  check: string;
  therefore: string;
  years: string;
  months: string;
}

const COPY: Record<IntCp001CalculationRichLanguage, LocaleCopy> = {
  en: {
    given: "Write the known values",
    formula: "Use the formula",
    substitute: "Substitute the actual values",
    calculate: "Complete the arithmetic",
    convert: "Convert the time unit",
    check: "Numerical check",
    therefore: "Therefore",
    years: "years",
    months: "months",
  },
  hi: {
    given: "दिए गए मान लिखें",
    formula: "सूत्र लिखें",
    substitute: "सूत्र में वास्तविक मान रखें",
    calculate: "गणना को चरणों में पूरा करें",
    convert: "समय की इकाई बदलें",
    check: "संख्यात्मक जाँच",
    therefore: "अतः",
    years: "वर्ष",
    months: "महीने",
  },
  pa: {
    given: "ਦਿੱਤੇ ਮੁੱਲ ਲਿਖੋ",
    formula: "ਸੂਤਰ ਲਿਖੋ",
    substitute: "ਸੂਤਰ ਵਿੱਚ ਅਸਲ ਮੁੱਲ ਰੱਖੋ",
    calculate: "ਗਣਨਾ ਕਦਮਾਂ ਵਿੱਚ ਪੂਰੀ ਕਰੋ",
    convert: "ਸਮੇਂ ਦੀ ਇਕਾਈ ਬਦਲੋ",
    check: "ਅੰਕਾਂ ਨਾਲ ਜਾਂਚ",
    therefore: "ਇਸ ਲਈ",
    years: "ਸਾਲ",
    months: "ਮਹੀਨੇ",
  },
};

function firstRational(...values: Array<Rational | undefined>): Rational | undefined {
  return values.find(Boolean);
}

function buildState(question: IntCp001ExplanationSanitizationQuestion): CalculationState {
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

function requireValue(value: Rational | undefined, label: string): Rational {
  if (!value) throw new Error(`Missing ${label} for calculation-rich explanation.`);
  return value;
}

function m(value: Rational): string {
  return mathRational(value);
}

function p(value: Rational): string {
  return `${m(value)}\\%`;
}

function duration(value: Rational, language: IntCp001CalculationRichLanguage): string {
  const months = multiplyRational(value, rational(12));
  if (months.denominator === 1n && months.numerator % 12n !== 0n) {
    return `${months.numerator}\\text{ ${COPY[language].months}}`;
  }
  return `${m(value)}\\text{ ${COPY[language].years}}`;
}

function money(value: Rational): string {
  return formatMoneyLocalized(value);
}

function sanitizeValue<T>(value: T): T {
  if (typeof value === "string") return sanitizeIntCp001LearnerMath(value) as T;
  if (Array.isArray(value)) return value.map((item) => sanitizeValue(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, sanitizeValue(item)]),
    ) as T;
  }
  return value;
}

function knownTargetTimes(data: CalculationState): { known: Rational; target: Rational } {
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

function workedSteps(
  question: IntCp001ExplanationSanitizationQuestion,
  language: IntCp001CalculationRichLanguage,
  data: CalculationState,
): string[] {
  const c = COPY[language];
  const P = requireValue(data.P, "principal");
  const R = data.R;
  const T = data.T;

  switch (question.solveContract) {
    case "FIND_SIMPLE_INTEREST_FROM_PRT": {
      const rate = requireValue(R, "rate");
      const time = requireValue(T, "time");
      const interest = divideRational(multiplyRational(multiplyRational(P, rate), time), rational(100));
      const numerator = multiplyRational(multiplyRational(P, rate), time);
      return [
        `${c.given}: $P=${m(P)},\ R=${p(rate)},\ T=${duration(time, language)}$.`,
        `${c.formula}: $$I=\\frac{P\\times R\\times T}{100}$$`,
        `${c.substitute}: $$I=\\frac{${m(P)}\\times ${m(rate)}\\times ${m(time)}}{100}$$`,
        `${c.calculate}: $$I=\\frac{${m(numerator)}}{100}=${m(interest)}$$`,
      ];
    }
    case "FIND_AMOUNT_FROM_PRT": {
      const rate = requireValue(R, "rate");
      const time = requireValue(T, "time");
      const interest = divideRational(multiplyRational(multiplyRational(P, rate), time), rational(100));
      const amount = addRational(P, interest);
      return [
        `${c.given}: $P=${m(P)},\ R=${p(rate)},\ T=${duration(time, language)}$.`,
        `${c.formula}: $$I=\\frac{PRT}{100},\\qquad A=P+I$$`,
        `${c.substitute}: $$I=\\frac{${m(P)}\\times ${m(rate)}\\times ${m(time)}}{100}=${m(interest)}$$`,
        `${c.calculate}: $$A=${m(P)}+${m(interest)}=${m(amount)}$$`,
      ];
    }
    case "FIND_PRINCIPAL_FROM_INTEREST": {
      const interest = requireValue(data.I, "interest");
      const rate = requireValue(R, "rate");
      const time = requireValue(T, "time");
      const denominator = multiplyRational(rate, time);
      return [
        `${c.given}: $I=${m(interest)},\ R=${p(rate)},\ T=${duration(time, language)}$.`,
        `${c.formula}: $$P=\\frac{100I}{RT}$$`,
        `${c.substitute}: $$P=\\frac{100\\times ${m(interest)}}{${m(rate)}\\times ${m(time)}}$$`,
        `${c.calculate}: $$RT=${m(denominator)},\\qquad P=\\frac{${m(multiplyRational(rational(100), interest))}}{${m(denominator)}}=${m(P)}$$`,
      ];
    }
    case "FIND_PRINCIPAL_FROM_AMOUNT": {
      const amount = requireValue(data.A, "amount");
      const rate = requireValue(R, "rate");
      const time = requireValue(T, "time");
      const rt = multiplyRational(rate, time);
      const factor = addRational(rational(100), rt);
      return [
        `${c.given}: $A=${m(amount)},\ R=${p(rate)},\ T=${duration(time, language)}$.`,
        `${c.formula}: $$P=\\frac{100A}{100+RT}$$`,
        `${c.substitute}: $$P=\\frac{100\\times ${m(amount)}}{100+${m(rate)}\\times ${m(time)}}$$`,
        `${c.calculate}: $$100+RT=${m(factor)},\\qquad P=\\frac{${m(multiplyRational(rational(100), amount))}}{${m(factor)}}=${m(P)}$$`,
      ];
    }
    case "FIND_RATE_FROM_INTEREST": {
      const interest = requireValue(data.I, "interest");
      const time = requireValue(T, "time");
      const denominator = multiplyRational(P, time);
      const rate = divideRational(multiplyRational(rational(100), interest), denominator);
      return [
        `${c.given}: $P=${m(P)},\ I=${m(interest)},\ T=${duration(time, language)}$.`,
        `${c.formula}: $$R=\\frac{100I}{PT}$$`,
        `${c.substitute}: $$R=\\frac{100\\times ${m(interest)}}{${m(P)}\\times ${m(time)}}$$`,
        `${c.calculate}: $$R=\\frac{${m(multiplyRational(rational(100), interest))}}{${m(denominator)}}=${p(rate)}$$`,
      ];
    }
    case "FIND_RATE_FROM_AMOUNT": {
      const amount = requireValue(data.A, "amount");
      const time = requireValue(T, "time");
      const interest = subtractRational(amount, P);
      const rate = divideRational(multiplyRational(rational(100), interest), multiplyRational(P, time));
      return [
        `${c.given}: $P=${m(P)},\ A=${m(amount)},\ T=${duration(time, language)}$.`,
        `${c.calculate}: $$I=A-P=${m(amount)}-${m(P)}=${m(interest)}$$`,
        `${c.formula}: $$R=\\frac{100I}{PT}$$`,
        `${c.substitute}: $$R=\\frac{100\\times ${m(interest)}}{${m(P)}\\times ${m(time)}}=${p(rate)}$$`,
      ];
    }
    case "FIND_TIME_FROM_INTEREST": {
      const interest = requireValue(data.I, "interest");
      const rate = requireValue(R, "rate");
      const time = divideRational(multiplyRational(rational(100), interest), multiplyRational(P, rate));
      return [
        `${c.given}: $P=${m(P)},\ I=${m(interest)},\ R=${p(rate)}$.`,
        `${c.formula}: $$T=\\frac{100I}{PR}$$`,
        `${c.substitute}: $$T=\\frac{100\\times ${m(interest)}}{${m(P)}\\times ${m(rate)}}$$`,
        `${c.calculate}: $$T=${m(time)}\\text{ ${c.years}}=${duration(time, language)}$$`,
      ];
    }
    case "FIND_TIME_FROM_AMOUNT": {
      const amount = requireValue(data.A, "amount");
      const rate = requireValue(R, "rate");
      const interest = subtractRational(amount, P);
      const time = divideRational(multiplyRational(rational(100), interest), multiplyRational(P, rate));
      return [
        `${c.given}: $P=${m(P)},\ A=${m(amount)},\ R=${p(rate)}$.`,
        `${c.calculate}: $$I=A-P=${m(amount)}-${m(P)}=${m(interest)}$$`,
        `${c.formula}: $$T=\\frac{100I}{PR}$$`,
        `${c.substitute}: $$T=\\frac{100\\times ${m(interest)}}{${m(P)}\\times ${m(rate)}}=${duration(time, language)}$$`,
      ];
    }
    case "FIND_INTEREST_FOR_TARGET_DURATION": {
      const interest = requireValue(data.I, "interest");
      const { known, target } = knownTargetTimes(data);
      const result = divideRational(multiplyRational(interest, target), known);
      return [
        `${c.given}: $I_1=${m(interest)},\ T_1=${duration(known, language)},\ T_2=${duration(target, language)}$.`,
        `${c.formula}: $$I_2=I_1\\times\\frac{T_2}{T_1}$$`,
        `${c.substitute}: $$I_2=${m(interest)}\\times\\frac{${m(target)}}{${m(known)}}$$`,
        `${c.calculate}: $$I_2=${m(result)}$$`,
      ];
    }
    case "FIND_RATE_FROM_AMOUNT_MULTIPLE": {
      const multiple = requireValue(data.multiple, "amount multiple");
      const time = requireValue(T, "time");
      const interestRatio = subtractRational(multiple, rational(1));
      const rate = divideRational(multiplyRational(rational(100), interestRatio), time);
      return [
        `${c.given}: $\\frac{A}{P}=${m(multiple)},\ T=${duration(time, language)}$.`,
        `${c.calculate}: $$\\frac{I}{P}=\\frac{A}{P}-1=${m(multiple)}-1=${m(interestRatio)}$$`,
        `${c.formula}: $$R=\\frac{100(I/P)}{T}$$`,
        `${c.substitute}: $$R=\\frac{100\\times ${m(interestRatio)}}{${m(time)}}=${p(rate)}$$`,
      ];
    }
    case "FIND_TIME_FROM_AMOUNT_MULTIPLE": {
      const multiple = requireValue(data.multiple, "amount multiple");
      const rate = requireValue(R, "rate");
      const interestRatio = subtractRational(multiple, rational(1));
      const time = divideRational(multiplyRational(rational(100), interestRatio), rate);
      return [
        `${c.given}: $\\frac{A}{P}=${m(multiple)},\ R=${p(rate)}$.`,
        `${c.calculate}: $$\\frac{I}{P}=${m(multiple)}-1=${m(interestRatio)}$$`,
        `${c.formula}: $$T=\\frac{100(I/P)}{R}$$`,
        `${c.substitute}: $$T=\\frac{100\\times ${m(interestRatio)}}{${m(rate)}}=${duration(time, language)}$$`,
      ];
    }
    case "FIND_TIME_FROM_INTEREST_RATIO": {
      const interestRatio = requireValue(data.multiple, "interest ratio");
      const rate = requireValue(R, "rate");
      const time = divideRational(multiplyRational(rational(100), interestRatio), rate);
      return [
        `${c.given}: $\\frac{I}{P}=${m(interestRatio)},\ R=${p(rate)}$.`,
        `${c.formula}: $$T=\\frac{100(I/P)}{R}$$`,
        `${c.substitute}: $$T=\\frac{100\\times ${m(interestRatio)}}{${m(rate)}}$$`,
        `${c.calculate}: $$T=${m(time)}\\text{ ${c.years}}=${duration(time, language)}$$`,
      ];
    }
    case "FIND_RATE_FROM_INTEREST_RATIO": {
      const interestRatio = requireValue(data.multiple, "interest ratio");
      const time = requireValue(T, "time");
      const rate = divideRational(multiplyRational(rational(100), interestRatio), time);
      return [
        `${c.given}: $\\frac{I}{P}=${m(interestRatio)},\ T=${duration(time, language)}$.`,
        `${c.formula}: $$R=\\frac{100(I/P)}{T}$$`,
        `${c.substitute}: $$R=\\frac{100\\times ${m(interestRatio)}}{${m(time)}}$$`,
        `${c.calculate}: $$R=${p(rate)}$$`,
      ];
    }
    case "FIND_ANNUAL_INTEREST_FROM_TWO_AMOUNTS": {
      const A1 = requireValue(data.A1, "earlier amount");
      const A2 = requireValue(data.A2, "later amount");
      const T1 = requireValue(data.T1, "earlier time");
      const T2 = requireValue(data.T2, "later time");
      const amountGap = subtractRational(A2, A1);
      const timeGap = subtractRational(T2, T1);
      const annual = divideRational(amountGap, timeGap);
      return [
        `${c.given}: $A_1=${m(A1)},\ A_2=${m(A2)},\ T_1=${m(T1)},\ T_2=${m(T2)}$.`,
        `${c.formula}: $$J=\\frac{A_2-A_1}{T_2-T_1}$$`,
        `${c.substitute}: $$J=\\frac{${m(A2)}-${m(A1)}}{${m(T2)}-${m(T1)}}=\\frac{${m(amountGap)}}{${m(timeGap)}}$$`,
        `${c.calculate}: $$J=${m(annual)}$$`,
      ];
    }
    case "FIND_PRINCIPAL_FROM_TWO_AMOUNTS": {
      const A1 = requireValue(data.A1, "earlier amount");
      const A2 = requireValue(data.A2, "later amount");
      const T1 = requireValue(data.T1, "earlier time");
      const T2 = requireValue(data.T2, "later time");
      const annual = divideRational(subtractRational(A2, A1), subtractRational(T2, T1));
      const earlierInterest = multiplyRational(annual, T1);
      const principal = subtractRational(A1, earlierInterest);
      return [
        `${c.formula}: $$J=\\frac{A_2-A_1}{T_2-T_1}$$`,
        `${c.substitute}: $$J=\\frac{${m(A2)}-${m(A1)}}{${m(T2)}-${m(T1)}}=${m(annual)}$$`,
        `${c.calculate}: $$I_1=JT_1=${m(annual)}\\times ${m(T1)}=${m(earlierInterest)}$$`,
        `${c.calculate}: $$P=A_1-I_1=${m(A1)}-${m(earlierInterest)}=${m(principal)}$$`,
      ];
    }
    case "FIND_RATE_FROM_TWO_AMOUNTS": {
      const A1 = requireValue(data.A1, "earlier amount");
      const A2 = requireValue(data.A2, "later amount");
      const T1 = requireValue(data.T1, "earlier time");
      const T2 = requireValue(data.T2, "later time");
      const annual = divideRational(subtractRational(A2, A1), subtractRational(T2, T1));
      const principal = subtractRational(A1, multiplyRational(annual, T1));
      const rate = divideRational(multiplyRational(rational(100), annual), principal);
      return [
        `${c.substitute}: $$J=\\frac{${m(A2)}-${m(A1)}}{${m(T2)}-${m(T1)}}=${m(annual)}$$`,
        `${c.calculate}: $$P=A_1-JT_1=${m(A1)}-${m(annual)}\\times ${m(T1)}=${m(principal)}$$`,
        `${c.formula}: $$R=\\frac{100J}{P}$$`,
        `${c.substitute}: $$R=\\frac{100\\times ${m(annual)}}{${m(principal)}}=${p(rate)}$$`,
      ];
    }
    case "FIND_RATE_FROM_TWO_TIME_AMOUNT_RATIO": {
      const ratio = requireValue(data.ratio, "amount ratio");
      const T1 = requireValue(data.T1, "earlier time");
      const T2 = requireValue(data.T2, "later time");
      const n = rational(ratio.numerator);
      const d = rational(ratio.denominator);
      const coefficient = subtractRational(multiplyRational(d, T2), multiplyRational(n, T1));
      const rhs = multiplyRational(rational(100), subtractRational(n, d));
      const rate = divideRational(rhs, coefficient);
      return [
        `${c.formula}: $$\\frac{100+RT_2}{100+RT_1}=\\frac{${ratio.numerator}}{${ratio.denominator}}$$`,
        `${c.substitute}: $$${ratio.denominator}\\left(100+R\\times ${m(T2)}\\right)=${ratio.numerator}\\left(100+R\\times ${m(T1)}\\right)$$`,
        `${c.calculate}: $$${m(coefficient)}R=${m(rhs)}$$`,
        `${c.calculate}: $$R=\\frac{${m(rhs)}}{${m(coefficient)}}=${p(rate)}$$`,
      ];
    }
    case "FIND_AMOUNT_MULTIPLE_FROM_RATE_TIME": {
      const rate = requireValue(R, "rate");
      const time = requireValue(T, "time");
      const net = multiplyRational(rate, time);
      const interestRatio = divideRational(net, rational(100));
      const multiple = addRational(rational(1), interestRatio);
      return [
        `${c.given}: $R=${p(rate)},\ T=${duration(time, language)}$.`,
        `${c.formula}: $$\\frac{A}{P}=1+\\frac{RT}{100}$$`,
        `${c.substitute}: $$\\frac{A}{P}=1+\\frac{${m(rate)}\\times ${m(time)}}{100}=1+\\frac{${m(net)}}{100}$$`,
        `${c.calculate}: $$\\frac{A}{P}=1+${m(interestRatio)}=${m(multiple)}$$`,
      ];
    }
    case "FIND_INTEREST_RATIO_FROM_RATE_TIME": {
      const rate = requireValue(R, "rate");
      const time = requireValue(T, "time");
      const net = multiplyRational(rate, time);
      const ratio = divideRational(net, rational(100));
      return [
        `${c.given}: $R=${p(rate)},\ T=${duration(time, language)}$.`,
        `${c.formula}: $$\\frac{I}{P}=\\frac{RT}{100}$$`,
        `${c.substitute}: $$\\frac{I}{P}=\\frac{${m(rate)}\\times ${m(time)}}{100}=\\frac{${m(net)}}{100}$$`,
        `${c.calculate}: $$\\frac{I}{P}=${m(ratio)}$$`,
      ];
    }
    case "FIND_AMOUNT_AT_ANOTHER_TIME": {
      const rate = requireValue(R, "rate");
      const knownAmount = requireRational(data.request, "knownAmount");
      const knownTime = requireRational(data.request, "knownTimeYears");
      const targetTime = requireRational(data.request, "targetTimeYears");
      const knownFactor = addRational(rational(1), divideRational(multiplyRational(rate, knownTime), rational(100)));
      const principal = divideRational(knownAmount, knownFactor);
      const targetFactor = addRational(rational(1), divideRational(multiplyRational(rate, targetTime), rational(100)));
      const targetAmount = multiplyRational(principal, targetFactor);
      return [
        `${c.formula}: $$A_1=P\\left(1+\\frac{RT_1}{100}\\right)$$`,
        `${c.substitute}: $$P=\\frac{${m(knownAmount)}}{1+\\frac{${m(rate)}\\times ${m(knownTime)}}{100}}=\\frac{${m(knownAmount)}}{${m(knownFactor)}}=${m(principal)}$$`,
        `${c.formula}: $$A_2=P\\left(1+\\frac{RT_2}{100}\\right)$$`,
        `${c.calculate}: $$A_2=${m(principal)}\\left(1+\\frac{${m(rate)}\\times ${m(targetTime)}}{100}\\right)=${m(targetAmount)}$$`,
      ];
    }
    case "FIND_LATER_TIME_FROM_TWO_AMOUNT_RATIO": {
      const ratio = requireValue(data.ratio, "amount ratio");
      const rate = requireValue(R, "rate");
      const T1 = requireValue(data.T1, "earlier time");
      const n = rational(ratio.numerator);
      const d = rational(ratio.denominator);
      const numerator = addRational(
        multiplyRational(rational(100), subtractRational(n, d)),
        multiplyRational(multiplyRational(n, rate), T1),
      );
      const denominator = multiplyRational(d, rate);
      const T2 = divideRational(numerator, denominator);
      return [
        `${c.formula}: $$\\frac{100+RT_2}{100+RT_1}=\\frac{${ratio.numerator}}{${ratio.denominator}}$$`,
        `${c.substitute}: $$${ratio.denominator}\\left(100+${m(rate)}T_2\\right)=${ratio.numerator}\\left(100+${m(rate)}\\times ${m(T1)}\\right)$$`,
        `${c.calculate}: $$${m(denominator)}T_2=${m(numerator)}$$`,
        `${c.calculate}: $$T_2=\\frac{${m(numerator)}}{${m(denominator)}}=${duration(T2, language)}$$`,
      ];
    }
    default:
      throw new Error(`Unsupported calculation-rich solve contract ${question.solveContract}.`);
  }
}

function releaseId(language: IntCp001CalculationRichLanguage): IntCp001CalculationRichQuestion["releaseId"] {
  if (language === "en") return "INT-CP-001-EN-v6";
  return language === "hi" ? "INT-CP-001-HI-v6" : "INT-CP-001-PA-v6";
}

function calculationErrors(steps: readonly string[], solveContract: string): string[] {
  const errors: string[] = [];
  const joined = steps.join("\n");
  if (steps.length < 4) errors.push("Calculation-rich explanation requires at least four worked steps.");
  if (!steps.every((step) => /\d/u.test(step))) errors.push("Every worked step must contain a concrete numeric value.");
  if (!joined.includes("$$")) errors.push("Worked explanation has no display equation.");
  if (!/[=].*[=]/su.test(joined)) errors.push("Worked explanation does not show an arithmetic chain.");
  if (solveContract === "FIND_RATE_FROM_TWO_TIME_AMOUNT_RATIO" && !joined.includes(")=")) {
    errors.push("Two-time amount-ratio rate explanation does not show cross multiplication.");
  }
  if (solveContract === "FIND_LATER_TIME_FROM_TWO_AMOUNT_RATIO" && !joined.includes("T_2")) {
    errors.push("Later-time amount-ratio explanation does not isolate T_2.");
  }
  return errors;
}

export function generateIntCp001CalculationRichQuestion(
  qlId: IntCp001FinalQlId,
  seed: string,
  language: IntCp001CalculationRichLanguage,
): IntCp001CalculationRichQuestion {
  const source = generateIntCp001ExplanationSanitizationQuestion(qlId, seed, language);
  const data = buildState(source);
  const steps = workedSteps(source, language, data);
  const sanitizedExplanation = sanitizeValue(source.explanation);
  const explanation = {
    ...sanitizedExplanation,
    steps,
    stepByStep: {
      ...sanitizedExplanation.stepByStep,
      steps,
      verification: `${COPY[language].check}: ${steps.at(-1)}`,
      conclusion: `${COPY[language].therefore}, ${source.options[source.correctIndex]}.`,
    },
    verification: `${COPY[language].check}: ${steps.at(-1)}`,
    conclusion: `${COPY[language].therefore}, ${source.options[source.correctIndex]}.`,
  };
  const errors = [
    ...source.validation.errors,
    ...calculationErrors(steps, source.solveContract),
    ...validateIntCp001SanitizedExplanation(explanation),
  ];

  return {
    ...source,
    releaseId: releaseId(language),
    maturity: INT_CP001_CALCULATION_RICH_STATUS,
    reviewStatus: INT_CP001_CALCULATION_RICH_REVIEW_STATUS,
    localeReviewStatus: "PENDING_HUMAN_REVIEW",
    explanation,
    validation: {
      ...source.validation,
      ok: errors.length === 0,
      errors,
    },
    calculationRichTrace: {
      patchId: INT_CP001_CALCULATION_RICH_PATCH_ID,
      supersedesReleaseId: source.releaseId,
      workedStepCount: steps.length,
      explicitFormula: true,
      explicitNumericSubstitution: true,
      explicitArithmetic: true,
      canonicalStemChanged: false,
      optionValuesChanged: false,
      correctIndexChanged: false,
    },
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}
