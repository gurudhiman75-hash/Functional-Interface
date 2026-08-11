import { div, factor, mul, pow, rat, type Rational } from "./cp003-exam-model";
import type { Cp003StudentExplanation } from "./cp003-exam-types";
import type { Cp003SolutionTrace, Cp003SolutionTraceStep } from "./cp003-grounded-solution-trace";
import {
  answerText,
  fractionLatex,
  moneyMath,
  moneyPlain,
  ordinal,
  rateMath,
  ratePlain,
} from "./cp003-exam-support";

function rational(step: Cp003SolutionTraceStep, key: string): Rational {
  const datum = step.data.find((entry) => entry.key === key);
  if (!datum || datum.kind !== "RATIONAL") throw new Error(`${step.id}: missing rational datum ${key}`);
  return datum.value;
}

function numeric(step: Cp003SolutionTraceStep, key: string): number {
  const datum = step.data.find((entry) => entry.key === key);
  if (!datum || datum.kind !== "NUMBER") throw new Error(`${step.id}: missing numeric datum ${key}`);
  return datum.value;
}

function allSteps(trace: Cp003SolutionTrace): readonly Cp003SolutionTraceStep[] {
  return Object.freeze([...trace.coreSteps, ...trace.foundationSteps, ...trace.verificationSteps]);
}

function findStep(trace: Cp003SolutionTrace, teachingKey: string): Cp003SolutionTraceStep {
  const step = allSteps(trace).find((candidate) => candidate.teachingKey === teachingKey);
  if (!step) throw new Error(`${trace.qlId}: missing explanation step ${teachingKey}`);
  return step;
}

function findOperation(trace: Cp003SolutionTrace, operationId: Cp003SolutionTraceStep["operationId"]): Cp003SolutionTraceStep {
  const step = allSteps(trace).find((candidate) => candidate.operationId === operationId);
  if (!step) throw new Error(`${trace.qlId}: missing explanation operation ${operationId}`);
  return step;
}

function rateFormula(value: Rational): string {
  const known = new Map<string, string>([
    ["25/3", "8\\frac{1}{3}"],
    ["50/3", "16\\frac{2}{3}"],
    ["100/3", "33\\frac{1}{3}"],
    ["100/7", "14\\frac{2}{7}"],
  ]);
  return known.get(`${value.numerator}/${value.denominator}`) ?? ratePlain(value);
}

const yearsText = (years: number): string => `${years} year${years === 1 ? "" : "s"}`;
const oneYearChange = (rate: Rational, value: Rational): string =>
  `$1+\\frac{${rateFormula(rate)}}{100}=${fractionLatex(value)}$`;

function renderCoreStep(step: Cp003SolutionTraceStep, _trace: Cp003SolutionTrace): string {
  switch (step.operationId) {
    case "ANNUAL_FACTOR": {
      const rate = rational(step, "ratePercent");
      const afterOneYear = rational(step, "annualFactor");
      return `At ${rateMath(rate)} per year, the balance after one year is ${oneYearChange(rate, afterOneYear)} times the previous balance.`;
    }

    case "POWER": {
      const base = rational(step, "base");
      const exponent = numeric(step, "exponent");
      const result = rational(step, "result");
      if (step.teachingKey === "PRIOR_YEAR_GROWTH") {
        return `Before the required year starts, the money has already earned interest for ${yearsText(exponent)}: $\\left(${fractionLatex(base)}\\right)^{${exponent}}=${fractionLatex(result)}$.`;
      }
      if (step.teachingKey === "YEARLY_INTEREST_MULTIPLIER") {
        return `There are ${yearsText(exponent)} between the two given yearly interests. Applying the same yearly increase ${exponent} time${exponent === 1 ? "" : "s"} gives $\\left(${fractionLatex(base)}\\right)^{${exponent}}=${fractionLatex(result)}$.`;
      }
      if (step.teachingKey === "OBSERVED_FACTOR_POWER") {
        return `The earlier recorded amount is already after ${yearsText(exponent)}. Over those years, the original sum became $\\left(${fractionLatex(base)}\\right)^{${exponent}}=${fractionLatex(result)}$ times as large.`;
      }
      return `The same yearly increase is applied for ${yearsText(exponent)}: $\\left(${fractionLatex(base)}\\right)^{${exponent}}=${fractionLatex(result)}$.`;
    }

    case "MULTIPLY": {
      const left = rational(step, "left");
      const right = rational(step, "right");
      const result = rational(step, "result");
      if (step.teachingKey === "AMOUNT_PRODUCT") {
        return `Now apply this increase to the original sum: $${moneyPlain(left)}\\times${fractionLatex(right)}=${moneyPlain(result)}$.`;
      }
      if (step.teachingKey === "NTH_YEAR_INTEREST_FACTOR") {
        return `So, for every ₹1 of the original sum, the interest in the required year is $${fractionLatex(left)}\\times${fractionLatex(right)}=${fractionLatex(result)}$.`;
      }
      if (step.teachingKey === "LATER_YEAR_INTEREST") {
        return `Therefore, the later year's interest is $${moneyPlain(left)}\\times${fractionLatex(right)}=${moneyPlain(result)}$.`;
      }
      return `Multiplying the known value by the required yearly increase gives $${fractionLatex(left)}\\times${fractionLatex(right)}=${fractionLatex(result)}$.`;
    }

    case "SUBTRACT": {
      const left = rational(step, "left");
      const right = rational(step, "right");
      const result = rational(step, "result");
      if (step.teachingKey === "COMPOUND_INTEREST_DIFFERENCE") {
        return `The question asks for interest only, so remove the original sum from the final amount: $${moneyPlain(left)}-${moneyPlain(right)}=${moneyPlain(result)}$.`;
      }
      if (step.teachingKey === "COMPOUND_INTEREST_FACTOR") {
        return `Out of $${fractionLatex(left)}$ for each ₹1, ₹1 is the original money. Hence the interest earned on each ₹1 is $${fractionLatex(left)}-1=${fractionLatex(result)}$.`;
      }
      if (step.teachingKey === "RATE_FRACTION_FROM_FACTOR") {
        return `The interest part added each year is $${fractionLatex(left)}-1=${fractionLatex(result)}$, which is the same as the given rate divided by 100.`;
      }
      if (step.teachingKey === "ONE_YEAR_INCREASE") {
        return `The interest added during this one year is the increase in the balance: $${moneyPlain(left)}-${moneyPlain(right)}=${moneyPlain(result)}$.`;
      }
      return `Subtract the earlier amount from the later amount: $${moneyPlain(left)}-${moneyPlain(right)}=${moneyPlain(result)}$.`;
    }

    case "DIVIDE": {
      const numerator = rational(step, "numerator");
      const denominator = rational(step, "denominator");
      const result = rational(step, "result");
      if (step.teachingKey === "AMOUNT_RATIO") {
        return `First see how many times the money became: $${moneyPlain(numerator)}\\div${moneyPlain(denominator)}=${fractionLatex(result)}$.`;
      }
      if (step.teachingKey === "OBSERVED_ANNUAL_FACTOR") {
        return `From one year to the next, ${moneyMath(denominator)} became ${moneyMath(numerator)}. Thus one year's balance is $${moneyPlain(numerator)}\\div${moneyPlain(denominator)}=${fractionLatex(result)}$ times the previous balance.`;
      }
      if (step.teachingKey === "PREVIOUS_BALANCE") {
        return `The current balance already includes one year's interest. Therefore, the earlier balance is $${moneyPlain(numerator)}\\div${fractionLatex(denominator)}=${moneyPlain(result)}$.`;
      }
      if (step.teachingKey === "PRINCIPAL_FROM_CI_FACTOR") {
        return `The given interest is ${moneyMath(numerator)}. Since each ₹1 earns $${fractionLatex(denominator)}$ as interest, the original sum is $${moneyPlain(numerator)}\\div${fractionLatex(denominator)}=${moneyPlain(result)}$.`;
      }
      if (step.teachingKey === "PRINCIPAL_FROM_NTH_YEAR_INTEREST_FACTOR") {
        return `The given interest in the required year is ${moneyMath(numerator)}. Hence the original sum is $${moneyPlain(numerator)}\\div${fractionLatex(denominator)}=${moneyPlain(result)}$.`;
      }
      return `The final amount already includes all the yearly increases. Therefore, the original sum is $${moneyPlain(numerator)}\\div${fractionLatex(denominator)}=${moneyPlain(result)}$.`;
    }

    case "RATE_FROM_FACTOR": {
      const afterOneYear = rational(step, "annualFactor");
      const rate = rational(step, "ratePercent");
      return `If ₹1 becomes $${fractionLatex(afterOneYear)}$ in one year, the increase is $${fractionLatex(afterOneYear)}-1$. Therefore, the rate is $\\left(${fractionLatex(afterOneYear)}-1\\right)\\times100=${rateFormula(rate)}\\%$.`;
    }

    case "MATCH_POWER": {
      const base = rational(step, "base");
      const exponent = numeric(step, "exponent");
      const target = rational(step, "target");
      if (step.teachingKey === "MATCH_FACTOR_POWER_FOR_TIME") {
        return `At the given rate, $\\left(${fractionLatex(base)}\\right)^{${exponent}}=${fractionLatex(target)}$. Therefore, the required time is ${yearsText(exponent)}.`;
      }
      return `This change took place over ${yearsText(exponent)}. Since $\\left(${fractionLatex(base)}\\right)^{${exponent}}=${fractionLatex(target)}$, the balance became $${fractionLatex(base)}$ times in each year.`;
    }

    case "YEAR_BALANCE": {
      const principal = rational(step, "principal");
      const rate = rational(step, "ratePercent");
      const year = numeric(step, "year");
      const result = rational(step, "result");
      const yearlyValue = div(rate, rat(100));
      if (year === 0) return `The starting balance is ${moneyMath(result)}.`;
      if (step.teachingKey === "OPENING_BALANCE_OF_TARGET_YEAR") {
        return `Before the ${ordinal(year + 1)} year begins, interest has already been added for ${yearsText(year)}: $${moneyPlain(principal)}\\times\\left(1+${fractionLatex(yearlyValue)}\\right)^{${year}}=${moneyPlain(result)}$.`;
      }
      if (step.teachingKey === "EARLIER_YEAR_AMOUNT" || step.teachingKey === "LATER_YEAR_AMOUNT") {
        return `Amount after ${yearsText(year)}: $${moneyPlain(principal)}\\times\\left(1+${fractionLatex(yearlyValue)}\\right)^{${year}}=${moneyPlain(result)}$.`;
      }
      if (step.teachingKey === "VERIFY_AMOUNT_WITH_RATE") {
        return `Check: ${moneyMath(principal)} at ${rateMath(rate)} for ${yearsText(year)} becomes ${moneyMath(result)}, exactly as stated in the question.`;
      }
      return `After year ${year}, the balance is $${moneyPlain(principal)}\\times\\left(1+${fractionLatex(yearlyValue)}\\right)^{${year}}=${moneyPlain(result)}$.`;
    }

    case "YEAR_INTEREST": {
      const principal = rational(step, "principal");
      const rate = rational(step, "ratePercent");
      const year = numeric(step, "year");
      const result = rational(step, "result");
      const afterOneYear = factor(rate);
      const openingBalance = mul(principal, pow(afterOneYear, year - 1));
      return `At the start of the ${ordinal(year)} year, the balance is $${moneyPlain(principal)}\\times\\left(${fractionLatex(afterOneYear)}\\right)^{${year - 1}}=${moneyPlain(openingBalance)}$. The interest for that year is $${rateFormula(rate)}\\%\\text{ of }${moneyPlain(openingBalance)}=${moneyPlain(result)}$.`;
    }

    case "RATE_PERCENT_OF_AMOUNT": {
      const amount = rational(step, "amount");
      const rate = rational(step, "ratePercent");
      const result = rational(step, "result");
      if (step.teachingKey === "CONSECUTIVE_AMOUNT_DIFFERENCE") {
        return `The later year is just one year after the earlier year, so the difference is that year's interest: $${rateFormula(rate)}\\%\\text{ of }${moneyPlain(amount)}=${moneyPlain(result)}$.`;
      }
      return `Now calculate the interest for the required year: $${rateFormula(rate)}\\%\\text{ of }${moneyPlain(amount)}=${moneyPlain(result)}$.`;
    }

    case "RATE_FROM_INCREASE": {
      const increase = rational(step, "increase");
      const opening = rational(step, "openingAmount");
      const rate = rational(step, "ratePercent");
      return `This interest was earned on the earlier balance. Therefore, $\\text{rate}=\\frac{${moneyPlain(increase)}}{${moneyPlain(opening)}}\\times100=${rateFormula(rate)}\\%$.`;
    }

    case "VERIFY_NTH_YEAR_RATE": {
      const principal = rational(step, "principal");
      const rate = rational(step, "ratePercent");
      const year = numeric(step, "year");
      const expectedInterest = rational(step, "expectedInterest");
      return `At ${rateMath(rate)}, the interest during the ${ordinal(year)} year on ${moneyMath(principal)} is ${moneyMath(expectedInterest)}, which matches the question.`;
    }
  }
}

function renderKeyIdea(trace: Cp003SolutionTrace): string {
  switch (trace.methodId) {
    case "DIRECT_ANNUAL_FACTOR": {
      const amountStep = findStep(trace, "AMOUNT_PRODUCT");
      const years = numeric(findStep(trace, "GROWTH_MULTIPLIER"), "exponent");
      return `We need to find the total amount on ${moneyMath(rational(amountStep, "left"))} after ${yearsText(years)}, not only the interest. Since interest is added every year, the next year's interest is calculated on the increased balance.`;
    }
    case "AMOUNT_MINUS_PRINCIPAL": {
      const amountStep = findStep(trace, "AMOUNT_PRODUCT");
      const years = numeric(findStep(trace, "GROWTH_MULTIPLIER"), "exponent");
      return `We need to find only the compound interest earned on ${moneyMath(rational(amountStep, "left"))} in ${yearsText(years)}. First calculate the final amount, and then subtract the original sum.`;
    }
    case "REVERSE_COMPOUND_FACTOR": {
      const principalStep = findStep(trace, "REVERSE_AMOUNT_TO_PRINCIPAL");
      const years = numeric(findStep(trace, "GROWTH_MULTIPLIER"), "exponent");
      return `We need to find the original sum that grew to ${moneyMath(rational(principalStep, "numerator"))} after ${yearsText(years)}. The given amount is the final balance, so we work backwards by removing the complete increase for all the years.`;
    }
    case "REVERSE_COMPOUND_INTEREST_FACTOR": {
      const principalStep = findStep(trace, "PRINCIPAL_FROM_CI_FACTOR");
      const years = numeric(findStep(trace, "GROWTH_MULTIPLIER"), "exponent");
      return `We need to find the original sum when the question gives compound interest of ${moneyMath(rational(principalStep, "numerator"))} for ${yearsText(years)}, not the final amount. We first find how much interest is earned on each ₹1 and then use it to find the whole sum.`;
    }
    case "AMOUNT_RATIO_FACTOR_MATCH": {
      const ratioStep = findStep(trace, "AMOUNT_RATIO");
      const matchStep = findStep(trace, "MATCH_FACTOR_POWER_FOR_RATE");
      return `We need to find the yearly rate that changes ${moneyMath(rational(ratioStep, "denominator"))} into ${moneyMath(rational(ratioStep, "numerator"))} in ${yearsText(numeric(matchStep, "exponent"))}. First find how many times the money became, and then find the increase for one year.`;
    }
    case "FACTOR_POWER_TIME_MATCH": {
      const ratioStep = findStep(trace, "AMOUNT_RATIO");
      return `We need to find how long ${moneyMath(rational(ratioStep, "denominator"))} takes to become ${moneyMath(rational(ratioStep, "numerator"))} at the given yearly rate. We compare the total increase with the same increase applied year after year.`;
    }
    case "NTH_YEAR_OPENING_BALANCE": {
      const openingStep = findStep(trace, "OPENING_BALANCE_OF_TARGET_YEAR");
      const year = numeric(openingStep, "year") + 1;
      return `We need to find the interest earned in the ${ordinal(year)} year only. It is not calculated on the original sum; first find the balance at the beginning of that year, after ${yearsText(year - 1)} of earlier interest.`;
    }
    case "REVERSE_NTH_YEAR_INTEREST_FACTOR": {
      const priorStep = findStep(trace, "PRIOR_YEAR_GROWTH");
      const year = numeric(priorStep, "exponent") + 1;
      const principalStep = findStep(trace, "PRINCIPAL_FROM_NTH_YEAR_INTEREST_FACTOR");
      return `We need to find the original sum from the interest of the ${ordinal(year)} year, which is ${moneyMath(rational(principalStep, "numerator"))}. Because that year's interest is calculated after ${yearsText(year - 1)} of growth, those earlier increases must be included before solving for the original sum.`;
    }
    case "NTH_YEAR_RATE_SUBSTITUTION": {
      const verificationStep = findOperation(trace, "VERIFY_NTH_YEAR_RATE");
      const year = numeric(verificationStep, "year");
      return `We need to find the rate from the interest earned in the ${ordinal(year)} year. Because answer choices are given and each choice changes both the opening balance and that year's interest, the clearest method is to check the choices directly.`;
    }
    case "REVERSE_ONE_YEAR_FACTOR": {
      const previousStep = findStep(trace, "PREVIOUS_BALANCE");
      return `We need to find the balance one year before ${moneyMath(rational(previousStep, "numerator"))}. The given balance already includes one year's interest, so we divide by what the balance becomes in one year.`;
    }
    case "CONSECUTIVE_BALANCE_RATE": {
      const increaseStep = findStep(trace, "ONE_YEAR_INCREASE");
      return `We need to find the yearly rate from two balances that are one year apart. Their difference is the interest added during that year, and this interest was calculated on the earlier balance of ${moneyMath(rational(increaseStep, "right"))}.`;
    }
    case "CONSECUTIVE_BALANCE_PRINCIPAL": {
      const observationStep = findStep(trace, "OBSERVED_ANNUAL_FACTOR");
      return `We need to find the original sum from two consecutive year-end balances, ${moneyMath(rational(observationStep, "denominator"))} and ${moneyMath(rational(observationStep, "numerator"))}. First find how the balance changed in one year, then carry the earlier amount back to year 0.`;
    }
    case "ANNUAL_AMOUNT_DIFFERENCE": {
      const earlierStep = findStep(trace, "EARLIER_YEAR_AMOUNT");
      const earlierYear = numeric(earlierStep, "year");
      const laterStep = trace.coreSteps.find((step) => step.teachingKey === "LATER_YEAR_AMOUNT");
      const laterYear = laterStep ? numeric(laterStep, "year") : earlierYear + 1;
      return laterYear === earlierYear + 1
        ? `We need to find the difference between the amounts after ${yearsText(earlierYear)} and ${yearsText(laterYear)}. Since the second time is exactly one year later, this difference is simply the interest added during that one year.`
        : `We need to find the increase in the amount between ${yearsText(earlierYear)} and ${yearsText(laterYear)}. Find both year-end amounts separately and subtract the earlier amount from the later amount.`;
    }
    case "YEARLY_INTEREST_GEOMETRIC_GROWTH": {
      const interestSteps = trace.foundationSteps.filter((step) => step.operationId === "YEAR_INTEREST");
      const earlierYear = numeric(interestSteps[0]!, "year");
      const laterYear = numeric(interestSteps[interestSteps.length - 1]!, "year");
      return `We need to find the interest in the ${ordinal(laterYear)} year from the interest in the ${ordinal(earlierYear)} year. Under compound interest, yearly interest rises because each new year starts with a larger balance, so move the earlier interest forward through each year in between.`;
    }
  }
}

function renderRateCheck(trace: Cp003SolutionTrace): readonly string[] {
  const factorStep = findOperation(trace, "ANNUAL_FACTOR");
  const verificationStep = findOperation(trace, "VERIFY_NTH_YEAR_RATE");
  const rate = rational(factorStep, "ratePercent");
  const afterOneYear = rational(factorStep, "annualFactor");
  const principal = rational(verificationStep, "principal");
  const year = numeric(verificationStep, "year");
  const expectedInterest = rational(verificationStep, "expectedInterest");
  const openingBalance = mul(principal, pow(afterOneYear, year - 1));
  return Object.freeze([
    `Check the option ${rateMath(rate)}. At this rate, the balance at the start of the ${ordinal(year)} year is $${moneyPlain(principal)}\\times\\left(${fractionLatex(afterOneYear)}\\right)^{${year - 1}}=${moneyPlain(openingBalance)}$.`,
    `Now find that year's interest: $${rateFormula(rate)}\\%\\text{ of }${moneyPlain(openingBalance)}=${moneyPlain(expectedInterest)}$. This is exactly the interest given in the question, so ${rateMath(rate)} is the correct rate.`,
  ]);
}

function renderMainSteps(trace: Cp003SolutionTrace): readonly string[] {
  if (trace.methodId === "NTH_YEAR_RATE_SUBSTITUTION") return renderRateCheck(trace);
  return Object.freeze(trace.coreSteps.map((step) => renderCoreStep(step, trace)));
}

function renderFoundationStep(step: Cp003SolutionTraceStep, trace: Cp003SolutionTrace): string {
  if (step.operationId === "YEAR_INTEREST") {
    const principal = rational(step, "principal");
    const rate = rational(step, "ratePercent");
    const year = numeric(step, "year");
    const result = rational(step, "result");
    const afterOneYear = factor(rate);
    const openingBalance = mul(principal, pow(afterOneYear, year - 1));
    return `For the ${ordinal(year)} year, first find the opening balance: $${moneyPlain(principal)}\\times\\left(${fractionLatex(afterOneYear)}\\right)^{${year - 1}}=${moneyPlain(openingBalance)}$. Then $${rateFormula(rate)}\\%\\text{ of }${moneyPlain(openingBalance)}=${moneyPlain(result)}$.`;
  }
  return renderCoreStep(step, trace);
}

function renderShortcut(trace: Cp003SolutionTrace): Cp003StudentExplanation["shortcut"] {
  if (!trace.shortcut) return undefined;
  const sourceStepIds = Object.freeze([...trace.shortcut.sourceStepIds]);
  switch (trace.shortcut.key) {
    case "CANCEL_BEFORE_MULTIPLYING":
      return Object.freeze({
        title: "Simplify before multiplying",
        steps: Object.freeze(["Before multiplying large numbers, cancel any common part between the original sum and the denominator. This keeps the calculation short and exact."]),
        sourceStepIds,
      });
    case "REVERSE_FACTOR_DIRECTLY":
      return Object.freeze({
        title: "Work backwards in one step",
        steps: Object.freeze(["Find how many times the money became over all the years, then divide the final amount by that value instead of undoing one year at a time."]),
        sourceStepIds,
      });
    case "OPENING_BALANCE_ONLY":
      return Object.freeze({
        title: "Focus only on the required year",
        steps: Object.freeze(["There is no need to find total compound interest. Find the balance at the start of the required year and take the given percentage of that balance."]),
        sourceStepIds,
      });
    case "NEXT_YEAR_INTEREST":
      return Object.freeze({
        title: "Use the one-year gap",
        steps: Object.freeze(["When the two amounts are for consecutive years, their difference is exactly the interest added in the later year."]),
        sourceStepIds,
      });
    case "YEARLY_INTEREST_GP":
      return Object.freeze({
        title: "Move the interest forward year by year",
        steps: Object.freeze(["Increase the earlier year's interest by the given rate once for every year in the gap. You do not need to find the original sum."]),
        sourceStepIds,
      });
    default:
      throw new Error(`${trace.qlId}: unhandled quick-method key ${trace.shortcut.key}`);
  }
}

function renderCommonMistake(key: string): string {
  const messages: Readonly<Record<string, string>> = Object.freeze({
    RETURN_INTEREST_INSTEAD_OF_AMOUNT: "The question asks for the total amount. Do not subtract the original sum unless compound interest alone is required.",
    USE_SIMPLE_INTEREST: "Do not use the simple-interest formula here. Each year's interest is added to the balance before the next year's interest is calculated.",
    REVERSE_SIMPLE_INTEREST: "Do not subtract the total percentage from the final amount. The money increased year by year, so the calculation must be undone using the same yearly changes.",
    COPY_COMPOUND_INTEREST_AS_PRINCIPAL: "The given compound interest is only the extra money earned; it is not the original sum.",
    DIVIDE_TOTAL_GROWTH_BY_YEARS: "Do not divide the total percentage increase equally by the number of years. The second year's interest is earned on a larger balance.",
    USE_SIMPLE_INTEREST_TIME: "Do not use the simple-interest time formula. Under compound interest, the balance changes after every year.",
    USE_FIRST_YEAR_INTEREST: "The required year's interest is calculated on that year's opening balance, not only on the original sum.",
    TREAT_NTH_YEAR_AS_FIRST_YEAR: "The given interest belongs to a later year, so the balance had already increased during the earlier years.",
    USE_DIRECT_INTEREST_TO_PRINCIPAL_RATIO: "Interest divided by the original sum gives the rate only for the first year. For a later year, first account for the earlier increase in the balance.",
    SUBTRACT_RATE_FROM_CURRENT_BALANCE: "To go back one year, do not subtract the rate from the current balance. The current balance is already the amount after interest was added.",
    DIVIDE_BY_CLOSING_BALANCE: "The year's interest is calculated on the earlier balance, not on the balance after interest was added.",
    COPY_FIRST_OBSERVED_AMOUNT_AS_PRINCIPAL: "The first amount shown is already a later year-end balance. It is not automatically the original sum.",
    USE_SIMPLE_INTEREST_FOR_YEAR_GAP: "Do not calculate the change from the original sum using simple interest. Find the required compound amounts, or use the one-year interest when the years are consecutive.",
    KEEP_YEARLY_INTEREST_CONSTANT: "Yearly interest does not remain the same. It increases because every new year starts with a larger balance.",
  });
  const message = messages[key];
  if (!message) throw new Error(`unhandled common-mistake key: ${key}`);
  return message;
}

function renderVerification(trace: Cp003SolutionTrace): Cp003StudentExplanation["verification"] {
  if (trace.verificationSteps.length === 0) return undefined;
  const steps = Object.freeze(trace.verificationSteps.map((step) => renderCoreStep(step, trace)));
  return Object.freeze({
    method: trace.methodId === "FACTOR_POWER_TIME_MATCH" ? "Check the balance year by year" : "Check the answer",
    steps,
    sourceStepIds: Object.freeze(trace.verificationSteps.map((step) => step.id)),
  });
}

function finalAnswer(trace: Cp003SolutionTrace): string {
  const value = answerText(trace.answerSemantic, trace.finalAnswer);
  switch (trace.qlId) {
    case "INT-QL-053": return `Therefore, the amount after the given time is ${value}.`;
    case "INT-QL-054": return `Therefore, the compound interest earned is ${value}.`;
    case "INT-QL-055":
    case "INT-QL-056":
    case "INT-QL-060":
    case "INT-QL-064": return `Therefore, the original sum was ${value}.`;
    case "INT-QL-057":
    case "INT-QL-061":
    case "INT-QL-063": return `Therefore, the required rate is ${value}.`;
    case "INT-QL-058": return `Therefore, the required time is ${value}.`;
    case "INT-QL-059":
    case "INT-QL-066": return `Therefore, the interest asked in the question is ${value}.`;
    case "INT-QL-062": return `Therefore, the balance one year earlier was ${value}.`;
    case "INT-QL-065": return `Therefore, the required difference is ${value}.`;
  }
}

export function explanationFor(trace: Cp003SolutionTrace): Cp003StudentExplanation {
  const keyIdea = renderKeyIdea(trace);
  const steps = renderMainSteps(trace);
  const sourceStepIds = Object.freeze(trace.coreSteps.map((step) => step.id));
  if (steps.length !== sourceStepIds.length) throw new Error(`${trace.qlId}: explanation step lineage mismatch`);

  const foundationSteps = Object.freeze(trace.foundationSteps.map((step) => renderFoundationStep(step, trace)));
  const foundationSourceStepIds = Object.freeze(trace.foundationSteps.map((step) => step.id));
  const shortcut = renderShortcut(trace);
  const verification = renderVerification(trace);

  return Object.freeze({
    traceVersion: trace.version,
    methodId: trace.methodId,
    keyIdea,
    steps,
    sourceStepIds,
    finalAnswer: finalAnswer(trace),
    ...(shortcut ? { shortcut } : {}),
    ...(trace.commonMistakeKey ? { commonMistake: renderCommonMistake(trace.commonMistakeKey) } : {}),
    ...(verification ? { verification } : {}),
    depths: Object.freeze({
      exam: Object.freeze({ steps, sourceStepIds }),
      student: Object.freeze({ steps, sourceStepIds }),
      foundation: Object.freeze({
        steps: foundationSteps.length > 0 ? foundationSteps : steps,
        sourceStepIds: foundationSourceStepIds.length > 0 ? foundationSourceStepIds : sourceStepIds,
      }),
    }),
  });
}
