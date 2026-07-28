import {
  addRational,
  divideRational,
  formatRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./foundation/rational";
import type { Rational } from "./foundation/types";
import type { IntCp001FinalQlId, IntCp001FinalRegistryEntry } from "./cp001-final-registry";

export interface LegacyExplanationLike {
  notice: string;
  relation: string;
  steps: string[];
  verification: string;
  conclusion: string;
  commonTrap: string;
}

export interface EditorialOptionAuditLike {
  text: string;
  misconceptionId: string;
  result: { semantic: string; value: unknown };
}

export interface IntCp001FourTierExplanation extends LegacyExplanationLike {
  coreConcept: {
    heading: "📌 Core Concept & Formula";
    narrative: string;
    displayMath: string;
  };
  stepByStep: {
    heading: "📝 Step-by-Step Solution";
    steps: string[];
    verification: string;
    conclusion: string;
  };
  examShortcut: {
    heading: "⚡ Exam Speed Shortcut";
    narrative: string;
    displayMath?: string;
  };
  trapAnalysis: {
    heading: "⚠️ Common Traps & Distractor Analysis";
    items: Array<{
      optionNumber: number;
      optionText: string;
      misconceptionId: string;
      explanation: string;
    }>;
  };
}

interface BuildEditorialArgs {
  qlId: IntCp001FinalQlId;
  entry: IntCp001FinalRegistryEntry;
  legacy: LegacyExplanationLike;
  parameters: unknown;
  options: string[];
  optionAudit: EditorialOptionAuditLike[];
  correctIndex: number;
}

type RationalRecord = Record<string, unknown>;

function isRational(value: unknown): value is Rational {
  return Boolean(
    value
    && typeof value === "object"
    && typeof (value as Rational).numerator === "bigint"
    && typeof (value as Rational).denominator === "bigint",
  );
}

function asRecord(value: unknown): RationalRecord | undefined {
  return value && typeof value === "object" ? value as RationalRecord : undefined;
}

function hiddenState(parameters: unknown): RationalRecord {
  const record = asRecord(parameters);
  return asRecord(record?.hiddenState) ?? {};
}

function requestState(parameters: unknown): RationalRecord {
  const record = asRecord(parameters);
  return asRecord(record?.request) ?? {};
}

function readRational(record: RationalRecord, key: string): Rational | undefined {
  const value = record[key];
  return isRational(value) ? value : undefined;
}

function latexRational(value: Rational): string {
  if (value.denominator === 1n) return value.numerator.toString();
  const negative = value.numerator < 0n;
  const numerator = negative ? -value.numerator : value.numerator;
  return `${negative ? "-" : ""}\\frac{${numerator}}{${value.denominator}}`;
}

function formatIndianInteger(raw: string): string {
  const negative = raw.startsWith("-");
  const digits = raw.replace(/[-,]/gu, "").replace(/^0+(?=\d)/u, "");
  if (digits.length <= 3) return `${negative ? "-" : ""}${digits}`;
  const lastThree = digits.slice(-3);
  const leading = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/gu, ",");
  return `${negative ? "-" : ""}${leading},${lastThree}`;
}

export function formatIndianCurrencyText(text: string): string {
  return text.replace(/₹\s*(-?\d[\d,]*)(?![\d./])/gu, (_match, raw: string) => `₹${formatIndianInteger(raw)}`);
}

function formulaFor(contract: string): string {
  const formulas: Record<string, string> = {
    FIND_SIMPLE_INTEREST_FROM_PRT: "$$I = \\frac{P \\times R \\times T}{100}$$",
    FIND_AMOUNT_FROM_PRT: "$$A = P + I = P\\left(1 + \\frac{R \\times T}{100}\\right)$$",
    FIND_PRINCIPAL_FROM_INTEREST: "$$P = \\frac{100I}{R \\times T}$$",
    FIND_PRINCIPAL_FROM_AMOUNT: "$$P = \\frac{100A}{100 + R \\times T}$$",
    FIND_RATE_FROM_INTEREST: "$$R = \\frac{100I}{P \\times T}$$",
    FIND_RATE_FROM_AMOUNT: "$$R = \\frac{100(A-P)}{P \\times T}$$",
    FIND_TIME_FROM_INTEREST: "$$T = \\frac{100I}{P \\times R}$$",
    FIND_TIME_FROM_AMOUNT: "$$T = \\frac{100(A-P)}{P \\times R}$$",
    FIND_INTEREST_FOR_TARGET_DURATION: "$$I_2 = I_1 \\times \\frac{T_2}{T_1}$$",
    FIND_RATE_FROM_AMOUNT_MULTIPLE: "$$R = \\frac{100\\left(\\frac{A}{P}-1\\right)}{T}$$",
    FIND_TIME_FROM_AMOUNT_MULTIPLE: "$$T = \\frac{100\\left(\\frac{A}{P}-1\\right)}{R}$$",
    FIND_TIME_FROM_INTEREST_RATIO: "$$T = \\frac{100\\left(\\frac{I}{P}\\right)}{R}$$",
    FIND_RATE_FROM_INTEREST_RATIO: "$$R = \\frac{100\\left(\\frac{I}{P}\\right)}{T}$$",
    FIND_ANNUAL_INTEREST_FROM_TWO_AMOUNTS: "$$I_{\\text{annual}} = \\frac{A_2-A_1}{T_2-T_1}$$",
    FIND_PRINCIPAL_FROM_TWO_AMOUNTS: "$$P = A_1 - I_{\\text{annual}}T_1$$",
    FIND_RATE_FROM_TWO_AMOUNTS: "$$R = \\frac{100I_{\\text{annual}}}{P}$$",
    FIND_RATE_FROM_TWO_TIME_AMOUNT_RATIO: "$$\\frac{A_2}{A_1} = \\frac{1+rT_2}{1+rT_1}$$",
    FIND_AMOUNT_MULTIPLE_FROM_RATE_TIME: "$$\\frac{A}{P} = 1 + \\frac{R \\times T}{100}$$",
    FIND_INTEREST_RATIO_FROM_RATE_TIME: "$$\\frac{I}{P} = \\frac{R \\times T}{100}$$",
    FIND_AMOUNT_AT_ANOTHER_TIME: "$$P = \\frac{A_1}{1+rT_1}, \\qquad A_2 = P(1+rT_2)$$",
    FIND_LATER_TIME_FROM_TWO_AMOUNT_RATIO: "$$\\frac{A_2}{A_1} = \\frac{1+rT_2}{1+rT_1}$$",
  };
  return formulas[contract] ?? "$$I = \\frac{P \\times R \\times T}{100}$$";
}

function conceptFor(entry: IntCp001FinalRegistryEntry): string {
  const concepts: Record<string, string> = {
    DIRECT_INTEREST: "Simple interest grows linearly and is always calculated on the original principal.",
    DIRECT_AMOUNT: "The total amount is the original principal plus the simple interest earned over the whole term.",
    PRINCIPAL_INVERSE_FROM_INTEREST: "Treat the supplied interest as a percentage of the unknown principal and reverse the simple-interest formula.",
    PRINCIPAL_INVERSE_FROM_AMOUNT: "The maturity amount represents 100% of the principal plus the net interest percentage for the term.",
    RATE_INVERSE_FROM_INTEREST: "The total interest percentage is split evenly across the stated number of years to recover the annual rate.",
    RATE_INVERSE_FROM_AMOUNT: "First separate interest from amount, then convert that interest into an annual percentage of principal.",
    TIME_INVERSE_FROM_INTEREST: "At simple interest, equal yearly interest is added each year, so total interest divided by one-year interest gives time.",
    TIME_INVERSE_FROM_AMOUNT: "Remove the principal from the amount, then compare total interest with the interest earned in one year.",
    SUBDURATION_PROPORTION: "For the same principal and rate, simple interest is directly proportional to time.",
    AMOUNT_MULTIPLE_RATE_INVERSE: "An amount multiple includes the original principal unit; subtract 1 before recovering the rate.",
    AMOUNT_MULTIPLE_TIME_INVERSE: "Convert the amount multiple into an interest multiple before dividing by the annual rate.",
    INTEREST_RATIO_TIME_INVERSE: "The ratio I/P is already the net simple-interest rate for the entire duration.",
    INTEREST_RATIO_RATE_INVERSE: "The ratio I/P gives total interest per unit principal; divide it across the stated time.",
    TWO_TIME_AMOUNT_DIFFERENCE: "Under simple interest, the difference between two amounts equals the interest earned during the time gap.",
    TWO_TIME_AMOUNT_RECONSTRUCTION: "Use the amount gap to recover annual interest, then reconstruct principal or rate.",
    TWO_TIME_AMOUNT_RATIO: "The same principal cancels when two amount factors are compared as a ratio.",
    DIRECT_AMOUNT_RATIO: "The amount-to-principal multiple equals one principal unit plus the net interest fraction.",
    DIRECT_INTEREST_RATIO: "The interest-to-principal ratio is exactly the net rate fraction RT/100.",
    TEMPORAL_AMOUNT_TRANSFER: "A known amount is not a fresh principal; first recover the original principal, then move to the target time.",
    TWO_TIME_AMOUNT_RATIO_TIME_INVERSE: "Both compared amounts include the same principal, so use their exact amount factors to recover the total later time.",
  };
  return concepts[entry.topology] ?? "Apply the exact simple-interest invariant and preserve the distinction between principal, interest and amount.";
}

function standardNetRateShortcut(parameters: unknown): { narrative: string; displayMath?: string } | undefined {
  const state = hiddenState(parameters);
  const rate = readRational(state, "annualRatePercent");
  const time = readRational(state, "timeYears");
  if (!rate || !time) return undefined;
  const net = multiplyRational(rate, time);
  const amountPercent = addRational(rational(100), net);
  return {
    narrative: `Multiply rate by time first. The complete term earns ${formatRational(net)}% of the principal, so the amount represents ${formatRational(amountPercent)}% of the principal.`,
    displayMath: `$$\\text{Net interest percentage}=R\\times T=${latexRational(rate)}\\%\\times ${latexRational(time)}=${latexRational(net)}\\%$$`,
  };
}

function shortcutFor(args: BuildEditorialArgs): { narrative: string; displayMath?: string } {
  const { entry, parameters, options, correctIndex } = args;
  const state = hiddenState(parameters);
  const request = requestState(parameters);
  const correct = options[correctIndex]!;
  const standard = standardNetRateShortcut(parameters);

  switch (entry.solveContract) {
    case "FIND_SIMPLE_INTEREST_FROM_PRT":
      return standard ?? { narrative: `Compute the net rate R × T first and take that percentage of principal; the result is ${correct}.` };
    case "FIND_AMOUNT_FROM_PRT":
      return standard ?? { narrative: `Add 100% to the net interest percentage, then take that percentage of principal to obtain ${correct}.` };
    case "FIND_PRINCIPAL_FROM_INTEREST":
      return standard
        ? { narrative: `${standard.narrative} Since the given interest equals the net-rate percentage of principal, divide the interest by that percentage to obtain ${correct}.`, displayMath: standard.displayMath }
        : { narrative: `Treat interest as the net-rate percentage of principal and reverse the percentage in one step to obtain ${correct}.` };
    case "FIND_PRINCIPAL_FROM_AMOUNT":
      return standard
        ? { narrative: `${standard.narrative} Divide the amount by the full amount percentage to obtain ${correct}.`, displayMath: standard.displayMath }
        : { narrative: `Convert the amount into 100% + net interest %, then use the parts method to obtain ${correct}.` };
    case "FIND_RATE_FROM_INTEREST":
    case "FIND_RATE_FROM_AMOUNT":
      return { narrative: `Find the total interest percentage of principal first, then divide by the number of years. The annual rate is ${correct}.`, displayMath: "$$R=\\frac{\\text{net interest percentage}}{T}$$" };
    case "FIND_TIME_FROM_INTEREST":
    case "FIND_TIME_FROM_AMOUNT":
      return { narrative: `Calculate one-year interest first. Total interest ÷ one-year interest gives the duration directly: ${correct}.`, displayMath: "$$T=\\frac{I_{\\text{total}}}{I_{\\text{one year}}}$$" };
    case "FIND_INTEREST_FOR_TARGET_DURATION":
      return { narrative: `Keep principal and rate fixed and scale interest only by the time ratio. This produces ${correct}.`, displayMath: "$$I_1:I_2=T_1:T_2$$" };
    case "FIND_RATE_FROM_AMOUNT_MULTIPLE":
    case "FIND_TIME_FROM_AMOUNT_MULTIPLE":
      return { narrative: `Subtract the original 1 principal unit from A/P. The remaining fraction is RT/100; isolate the requested variable to obtain ${correct}.`, displayMath: "$$\\frac{I}{P}=\\frac{A}{P}-1$$" };
    case "FIND_TIME_FROM_INTEREST_RATIO":
    case "FIND_RATE_FROM_INTEREST_RATIO":
      return { narrative: `Do not subtract 1: I/P is already the net interest fraction. Divide by the known rate or time to obtain ${correct}.`, displayMath: "$$\\frac{I}{P}=\\frac{RT}{100}$$" };
    case "FIND_ANNUAL_INTEREST_FROM_TWO_AMOUNTS":
    case "FIND_PRINCIPAL_FROM_TWO_AMOUNTS":
    case "FIND_RATE_FROM_TWO_AMOUNTS": {
      const earlier = readRational(state, "earlierTimeYears");
      const later = readRational(state, "laterTimeYears");
      const gap = earlier && later ? subtractRational(later, earlier) : undefined;
      return {
        narrative: `Use the amount difference only over the time gap${gap ? ` of ${formatRational(gap)} years` : ""}. This immediately gives annual interest, from which the requested value is ${correct}.`,
        displayMath: "$$I_{\\text{annual}}=\\frac{A_2-A_1}{T_2-T_1}$$",
      };
    }
    case "FIND_RATE_FROM_TWO_TIME_AMOUNT_RATIO":
      return { narrative: `Assume the principal is 100. Convert both times into amount percentages, apply the displayed ratio and solve the single linear equation. The rate is ${correct}.`, displayMath: "$$\\frac{100+RT_2}{100+RT_1}=\\frac{A_2}{A_1}$$" };
    case "FIND_AMOUNT_MULTIPLE_FROM_RATE_TIME":
      return standard
        ? { narrative: `${standard.narrative} Divide the full amount percentage by 100 to get the amount multiple ${correct}.`, displayMath: standard.displayMath }
        : { narrative: `Add 1 to RT/100 to obtain the amount multiple ${correct}.` };
    case "FIND_INTEREST_RATIO_FROM_RATE_TIME":
      return standard
        ? { narrative: `${standard.narrative} Express the net percentage as a fraction of 100 to obtain ${correct}.`, displayMath: standard.displayMath }
        : { narrative: `Convert RT% into a fraction of 100 to obtain ${correct}.` };
    case "FIND_AMOUNT_AT_ANOTHER_TIME":
      return { narrative: `Use amount factors instead of calculating separate interest totals: recover P from A₁/(1+rT₁), then multiply by (1+rT₂). The target amount is ${correct}.`, displayMath: "$$A_2=A_1\\times\\frac{1+rT_2}{1+rT_1}$$" };
    case "FIND_LATER_TIME_FROM_TWO_AMOUNT_RATIO": {
      const rate = readRational(state, "annualRatePercent");
      const earlier = readRational(state, "earlierTimeYears");
      const ratioValue = readRational(request, "laterToEarlierAmountRatio");
      if (rate && earlier && ratioValue) {
        const earlierPercent = addRational(rational(100), multiplyRational(rate, earlier));
        const laterPercent = multiplyRational(earlierPercent, ratioValue);
        const net = subtractRational(laterPercent, rational(100));
        const laterTime = divideRational(net, rate);
        return {
          narrative: `Take principal as 100. The amount after ${formatRational(earlier)} years is ${formatRational(earlierPercent)}. Scale it by the given ratio to get ${formatRational(laterPercent)}, remove the original 100, and divide the remaining ${formatRational(net)} by ${formatRational(rate)} per year. The total later time is ${correct}.`,
          displayMath: `$$T_2=\\frac{${latexRational(laterPercent)}-100}{${latexRational(rate)}}=${latexRational(laterTime)}\\text{ years}$$`,
        };
      }
      return { narrative: `Take principal as 100, convert the known-time amount into a percentage, scale by the given ratio, then divide the net interest percentage by the annual rate. The total time is ${correct}.` };
    }
    default:
      return { narrative: `Use the net-rate percentage or amount-factor method to reduce the calculation to one exact step. The answer is ${correct}.` };
  }
}

const misconceptionExplanations: Record<string, string> = {
  RETURNED_AMOUNT_INSTEAD_OF_INTEREST: "Added the principal even though the question asks only for interest.",
  RETURNED_INTEREST_INSTEAD_OF_AMOUNT: "Stopped after finding interest and did not add the original principal.",
  OMITTED_TIME_FACTOR: "Calculated interest for one year only and ignored the full duration.",
  OMITTED_DIVIDE_BY_100: "Used the percentage number as a multiplier without dividing by 100.",
  MONTHS_TREATED_AS_YEARS: "Read the number of months as the same number of years.",
  DAYS_TREATED_AS_YEARS: "Read the number of days as years instead of using the stated day-count basis.",
  USED_AMOUNT_AS_PRINCIPAL: "Reused the maturity amount as though it were the original principal.",
  USED_INTEREST_AS_PRINCIPAL: "Mistook the interest component for the original principal.",
  OMITTED_ONE_PLUS: "Used only the interest fraction and omitted the original principal unit in the amount.",
  OMITTED_TIME_IN_RATE: "Recovered a total interest percentage but failed to divide it by time.",
  USED_AMOUNT_IN_RATE_NUMERATOR: "Used total amount instead of interest while calculating rate.",
  RATE_DECIMAL_REPORTED_AS_PERCENT: "Reported the decimal rate directly without converting it to a percentage.",
  OMITTED_RATE_IN_TIME: "Solved for time without dividing by the annual rate.",
  USED_AMOUNT_IN_TIME_NUMERATOR: "Used amount instead of the interest component while solving for time.",
  TIME_RECIPROCAL: "Inverted the time relation and obtained the reciprocal-style result.",
  TOTAL_INTEREST_REPORTED: "Returned the interest for the complete known duration instead of the requested target duration.",
  ANNUAL_INTEREST_REPORTED: "Returned one-year interest instead of the requested duration's interest.",
  SUBDURATION_IGNORED: "Ignored the change in duration and reused the known interest.",
  TARGET_DURATION_INVERTED: "Reversed the known-to-target time ratio.",
  MULTIPLE_USED_WITHOUT_SUBTRACTING_ONE: "Treated A/P as interest/P and forgot that amount includes the original principal.",
  INTEREST_RATIO_TREATED_AS_AMOUNT_MULTIPLE: "Added or removed a principal unit even though I/P is already an interest ratio.",
  COMPOUND_MODEL_USED: "Applied compounding even though the question explicitly uses simple interest.",
  RATE_TIME_PRODUCT_INVERTED: "Inverted the net rate-time product.",
  YEARS_REPORTED_AS_MONTHS: "Reported a year value as though it were already a month value.",
  MONTHS_DIVIDED_BY_12: "Divided the required month answer by 12 instead of reporting months.",
  MONTHS_MULTIPLIED_TWICE: "Applied the year-to-month conversion twice.",
  AMOUNT_GAP_REPORTED: "Returned the amount difference instead of converting it to the requested annual value.",
  TIME_GAP_IGNORED: "Used the amount gap as one-year interest without dividing by the time gap.",
  LATER_TIME_USED_INSTEAD_OF_GAP: "Divided by the later time rather than the difference between the two times.",
  EARLIER_AMOUNT_USED_AS_PRINCIPAL: "Treated the earlier observed amount as the original principal.",
  LATER_AMOUNT_USED_AS_PRINCIPAL: "Treated the later observed amount as the original principal.",
  ANNUAL_INTEREST_USED_AS_RATE: "Confused a rupee interest value with a percentage rate.",
  RATIO_MINUS_ONE_OMITTED: "Used an amount ratio directly without separating its principal component.",
  EARLIER_TIME_RATIO_TERM_OMITTED: "Ignored the earlier-time amount factor in the two-time ratio equation.",
  AMOUNT_MULTIPLE_REPORTED_AS_INTEREST_RATIO: "Reported A/P when the question asks for I/P.",
  INTEREST_RATIO_REPORTED_AS_AMOUNT_MULTIPLE: "Reported I/P without adding the original principal unit required for A/P.",
  RATE_TIME_PRODUCT_REPORTED_AS_PERCENT: "Reported the decimal RT product as a percentage without the required conversion.",
  RECIPROCAL_RATIO: "Reversed the requested ratio.",
  PLAUSIBLE_SCALE_ERROR: "Used a nearby but unsupported scale change instead of the exact invariant.",
  RETURNED_KNOWN_AMOUNT: "Repeated the amount at the known time instead of transferring it to the target time.",
  USED_KNOWN_AMOUNT_AS_PRINCIPAL: "Started a new interest calculation from the known amount rather than recovering the original principal.",
  RESET_TIME_ORIGIN: "Calculated only for the time gap as though the investment restarted at the first observation.",
  ADDED_ONE_EXTRA_YEAR: "Added one additional year's interest beyond the target time.",
  REMOVED_ONE_YEAR: "Removed one year's interest from the required target amount.",
  REPORTED_TIME_GAP: "Returned only the gap between the two observations instead of total time from the start.",
  IGNORED_EARLIER_AMOUNT_FACTOR: "Applied the amount ratio to principal rather than to the earlier amount factor.",
  FAILED_TO_REMOVE_PRINCIPAL_UNIT: "Treated an amount factor as pure interest without subtracting the original principal unit.",
  RETURNED_KNOWN_TIME: "Repeated the earlier duration given in the question.",
  ADMISSIBLE_TIME_FROM_WRONG_RELATION: "Chose a plausible duration that does not satisfy the displayed amount ratio.",
  ADDED_ONE_YEAR_TO_KNOWN_TIME: "Added one year mechanically to the known time without solving the ratio.",
  REMOVED_ONE_YEAR_FROM_LATER_TIME: "Reduced the correct later time by one year without mathematical support.",
};

function fallbackMisconceptionText(id: string): string {
  const phrase = id.toLowerCase().replace(/_/gu, " ");
  return `This option follows the “${phrase}” route rather than the required simple-interest relation.`;
}

export function buildIntCp001FourTierExplanation(args: BuildEditorialArgs): IntCp001FourTierExplanation {
  const { entry, legacy, options, optionAudit, correctIndex } = args;
  const correctOption = options[correctIndex]!;
  const shortcut = shortcutFor(args);
  const formattedLegacy: LegacyExplanationLike = {
    notice: formatIndianCurrencyText(legacy.notice),
    relation: formatIndianCurrencyText(legacy.relation),
    steps: legacy.steps.map(formatIndianCurrencyText),
    verification: formatIndianCurrencyText(legacy.verification),
    conclusion: formatIndianCurrencyText(legacy.conclusion),
    commonTrap: formatIndianCurrencyText(legacy.commonTrap),
  };
  const conclusion = formattedLegacy.conclusion.includes(correctOption)
    ? formattedLegacy.conclusion
    : `Therefore, the required answer is ${correctOption}.`;

  return {
    ...formattedLegacy,
    conclusion,
    coreConcept: {
      heading: "📌 Core Concept & Formula",
      narrative: conceptFor(entry),
      displayMath: formulaFor(entry.solveContract),
    },
    stepByStep: {
      heading: "📝 Step-by-Step Solution",
      steps: formattedLegacy.steps,
      verification: formattedLegacy.verification,
      conclusion,
    },
    examShortcut: {
      heading: "⚡ Exam Speed Shortcut",
      narrative: formatIndianCurrencyText(shortcut.narrative),
      displayMath: shortcut.displayMath,
    },
    trapAnalysis: {
      heading: "⚠️ Common Traps & Distractor Analysis",
      items: optionAudit
        .map((option, index) => ({ option, index }))
        .filter(({ index }) => index !== correctIndex)
        .map(({ option, index }) => ({
          optionNumber: index + 1,
          optionText: formatIndianCurrencyText(option.text),
          misconceptionId: option.misconceptionId,
          explanation: misconceptionExplanations[option.misconceptionId] ?? fallbackMisconceptionText(option.misconceptionId),
        })),
    },
  };
}
