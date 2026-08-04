import type { Cp003StudentExplanation } from "./cp003-exam-types";
import {
  type Cp003SolutionTrace,
  type Cp003SolutionTraceStep,
  type Cp003TraceDatum,
} from "./cp003-solution-trace";
import {
  answerText,
  annualFactorText,
  fractionLatex,
  moneyMath,
  moneyPlain,
  ordinal,
  rateMath,
  ratePlain,
} from "./cp003-exam-support";
import type { Rational } from "./cp003-exam-model";

const allSteps = (trace: Cp003SolutionTrace): readonly Cp003SolutionTraceStep[] =>
  Object.freeze([...trace.coreSteps, ...trace.foundationSteps, ...trace.verificationSteps]);

function datum(step: Cp003SolutionTraceStep, key: string): Cp003TraceDatum {
  const value = step.data.find((entry) => entry.key === key);
  if (!value) throw new Error(`${step.id}: missing trace datum ${key}`);
  return value;
}

function rational(step: Cp003SolutionTraceStep, key: string): Rational {
  const value = datum(step, key);
  if (value.kind !== "RATIONAL") throw new Error(`${step.id}: ${key} is not rational`);
  return value.value;
}

function numeric(step: Cp003SolutionTraceStep, key: string): number {
  const value = datum(step, key);
  if (value.kind !== "NUMBER") throw new Error(`${step.id}: ${key} is not numeric`);
  return value.value;
}

function findStep(trace: Cp003SolutionTrace, teachingKey: string): Cp003SolutionTraceStep {
  const step = allSteps(trace).find((candidate) => candidate.teachingKey === teachingKey);
  if (!step) throw new Error(`${trace.qlId}: missing trace step ${teachingKey}`);
  return step;
}

function renderStep(step: Cp003SolutionTraceStep): string {
  switch (step.teachingKey) {
    case "ANNUAL_FACTOR": {
      const ratePercent = rational(step, "ratePercent");
      const annualFactor = rational(step, "annualFactor");
      return `Annual factor: $1+\\frac{${ratePlain(ratePercent)}}{100}=${fractionLatex(annualFactor)}$.`;
    }
    case "GROWTH_MULTIPLIER": {
      const base = rational(step, "base");
      const exponent = numeric(step, "exponent");
      const result = rational(step, "result");
      return `Multiplier for $${exponent}$ years: $\\left(${fractionLatex(base)}\\right)^{${exponent}}=${fractionLatex(result)}$.`;
    }
    case "AMOUNT_PRODUCT": {
      const principal = rational(step, "left");
      const multiplier = rational(step, "right");
      const result = rational(step, "result");
      return `$A=${moneyPlain(principal)}\\times${fractionLatex(multiplier)}=${moneyPlain(result)}$.`;
    }
    case "COMPOUND_INTEREST_DIFFERENCE": {
      const amount = rational(step, "left");
      const principal = rational(step, "right");
      const result = rational(step, "result");
      return `$CI=A-P=${moneyPlain(amount)}-${moneyPlain(principal)}=${moneyPlain(result)}$.`;
    }
    case "REVERSE_AMOUNT_TO_PRINCIPAL": {
      const amount = rational(step, "numerator");
      const multiplier = rational(step, "denominator");
      const result = rational(step, "result");
      return `$P=${moneyPlain(amount)}\\div${fractionLatex(multiplier)}=${moneyPlain(result)}$.`;
    }
    case "COMPOUND_INTEREST_FACTOR": {
      const multiplier = rational(step, "left");
      const result = rational(step, "result");
      return `Compound-interest factor: $${fractionLatex(multiplier)}-1=${fractionLatex(result)}$.`;
    }
    case "PRINCIPAL_FROM_CI_FACTOR": {
      const interest = rational(step, "numerator");
      const ciFactor = rational(step, "denominator");
      const result = rational(step, "result");
      return `$P=${moneyPlain(interest)}\\div${fractionLatex(ciFactor)}=${moneyPlain(result)}$.`;
    }
    case "AMOUNT_RATIO": {
      const amount = rational(step, "numerator");
      const principal = rational(step, "denominator");
      const ratio = rational(step, "result");
      return `$\\frac{A}{P}=\\frac{${amount.numerator}}{${principal.numerator}}=${fractionLatex(ratio)}$.`;
    }
    case "MATCH_FACTOR_POWER_FOR_RATE": {
      const base = rational(step, "base");
      const exponent = numeric(step, "exponent");
      const target = rational(step, "target");
      return `Recognise $${fractionLatex(target)}=\\left(${fractionLatex(base)}\\right)^{${exponent}}$.`;
    }
    case "FACTOR_TO_RATE": {
      const annualFactor = rational(step, "annualFactor");
      const ratePercent = rational(step, "ratePercent");
      return `Annual factor $=${fractionLatex(annualFactor)}$, so the rate is $(${fractionLatex(annualFactor)}-1)\\times100=${ratePlain(ratePercent)}\\%$.`;
    }
    case "VERIFY_AMOUNT_WITH_RATE": {
      const principal = rational(step, "principal");
      const ratePercent = rational(step, "ratePercent");
      const year = numeric(step, "year");
      const result = rational(step, "result");
      return `${moneyMath(principal)} compounded at ${rateMath(ratePercent)} for $${year}$ years gives ${moneyMath(result)}.`;
    }
    case "MATCH_FACTOR_POWER_FOR_TIME": {
      const base = rational(step, "base");
      const exponent = numeric(step, "exponent");
      const target = rational(step, "target");
      return `$${fractionLatex(base)}^{${exponent}}=${fractionLatex(target)}$, so the time is $${exponent}$ years.`;
    }
    case "FOUNDATION_YEAR_BALANCE": {
      const year = numeric(step, "year");
      const result = rational(step, "result");
      return `Balance after year $${year}$: ${moneyMath(result)}.`;
    }
    case "OPENING_BALANCE_OF_TARGET_YEAR": {
      const year = numeric(step, "year");
      const result = rational(step, "result");
      return `Opening balance of year $${year + 1}$, after $${year}$ completed years: ${moneyMath(result)}.`;
    }
    case "TARGET_YEAR_INTEREST": {
      const amount = rational(step, "amount");
      const ratePercent = rational(step, "ratePercent");
      const result = rational(step, "result");
      return `Required yearly interest: ${rateMath(ratePercent)} of ${moneyMath(amount)} $=${moneyPlain(result)}$.`;
    }
    case "FOUNDATION_YEAR_INTEREST": {
      const year = numeric(step, "year");
      const result = rational(step, "result");
      return `Interest earned during the ${ordinal(year)} year: ${moneyMath(result)}.`;
    }
    case "RATE_FRACTION_FROM_FACTOR": {
      const annualFactor = rational(step, "left");
      const rateFraction = rational(step, "result");
      return `Rate as a fraction of the balance: $${fractionLatex(annualFactor)}-1=${fractionLatex(rateFraction)}$.`;
    }
    case "PRIOR_YEAR_GROWTH": {
      const base = rational(step, "base");
      const exponent = numeric(step, "exponent");
      const result = rational(step, "result");
      return `Growth before the required year: $(${fractionLatex(base)})^{${exponent}}=${fractionLatex(result)}$.`;
    }
    case "NTH_YEAR_INTEREST_FACTOR": {
      const rateFraction = rational(step, "left");
      const earlierGrowth = rational(step, "right");
      const result = rational(step, "result");
      return `Year-specific interest factor: $${fractionLatex(rateFraction)}\\times${fractionLatex(earlierGrowth)}=${fractionLatex(result)}$.`;
    }
    case "PRINCIPAL_FROM_NTH_YEAR_INTEREST_FACTOR": {
      const yearlyInterest = rational(step, "numerator");
      const interestFactor = rational(step, "denominator");
      const result = rational(step, "result");
      return `$P=${moneyPlain(yearlyInterest)}\\div${fractionLatex(interestFactor)}=${moneyPlain(result)}$.`;
    }
    case "VERIFY_NTH_YEAR_RATE": {
      const principal = rational(step, "principal");
      const ratePercent = rational(step, "ratePercent");
      const year = numeric(step, "year");
      const expectedInterest = rational(step, "expectedInterest");
      return `At ${rateMath(ratePercent)}, the ${ordinal(year)}-year interest on ${moneyMath(principal)} is exactly ${moneyMath(expectedInterest)}.`;
    }
    case "PREVIOUS_BALANCE": {
      const current = rational(step, "numerator");
      const annualFactor = rational(step, "denominator");
      const result = rational(step, "result");
      return `Previous balance $=${moneyPlain(current)}\\div${fractionLatex(annualFactor)}=${moneyPlain(result)}$.`;
    }
    case "ONE_YEAR_INCREASE": {
      const closing = rational(step, "left");
      const opening = rational(step, "right");
      const result = rational(step, "result");
      return `One-year interest: $${moneyPlain(closing)}-${moneyPlain(opening)}=${moneyPlain(result)}$.`;
    }
    case "RATE_FROM_OPENING_BALANCE": {
      const increase = rational(step, "increase");
      const opening = rational(step, "openingAmount");
      const ratePercent = rational(step, "ratePercent");
      return `Rate $=\\frac{${moneyPlain(increase)}}{${moneyPlain(opening)}}\\times100=${ratePlain(ratePercent)}\\%$.`;
    }
    case "OBSERVED_ANNUAL_FACTOR": {
      const nextAmount = rational(step, "numerator");
      const currentAmount = rational(step, "denominator");
      const result = rational(step, "result");
      return `Annual factor $=${moneyPlain(nextAmount)}\\div${moneyPlain(currentAmount)}=${fractionLatex(result)}$.`;
    }
    case "OBSERVED_FACTOR_POWER": {
      const base = rational(step, "base");
      const exponent = numeric(step, "exponent");
      const result = rational(step, "result");
      return `Multiplier from the principal to the earlier observation: $(${fractionLatex(base)})^{${exponent}}=${fractionLatex(result)}$.`;
    }
    case "REVERSE_OBSERVED_AMOUNT_TO_PRINCIPAL": {
      const amount = rational(step, "numerator");
      const multiplier = rational(step, "denominator");
      const result = rational(step, "result");
      return `$P=${moneyPlain(amount)}\\div${fractionLatex(multiplier)}=${moneyPlain(result)}$.`;
    }
    case "EARLIER_YEAR_AMOUNT": {
      const year = numeric(step, "year");
      const result = rational(step, "result");
      return `Amount after $${year}$ years: ${moneyMath(result)}.`;
    }
    case "LATER_YEAR_AMOUNT": {
      const year = numeric(step, "year");
      const result = rational(step, "result");
      return `Amount after $${year}$ years: ${moneyMath(result)}.`;
    }
    case "CONSECUTIVE_AMOUNT_DIFFERENCE": {
      const earlierAmount = rational(step, "amount");
      const ratePercent = rational(step, "ratePercent");
      const result = rational(step, "result");
      return `The difference is the next year's interest: ${rateMath(ratePercent)} of ${moneyMath(earlierAmount)} $=${moneyPlain(result)}$.`;
    }
    case "AMOUNT_DIFFERENCE": {
      const laterAmount = rational(step, "left");
      const earlierAmount = rational(step, "right");
      const result = rational(step, "result");
      return `Difference $=${moneyPlain(laterAmount)}-${moneyPlain(earlierAmount)}=${moneyPlain(result)}$.`;
    }
    case "YEARLY_INTEREST_MULTIPLIER": {
      const base = rational(step, "base");
      const exponent = numeric(step, "exponent");
      const result = rational(step, "result");
      return `Yearly-interest multiplier for the $${exponent}$-year gap: $(${fractionLatex(base)})^{${exponent}}=${fractionLatex(result)}$.`;
    }
    case "LATER_YEAR_INTEREST": {
      const earlierInterest = rational(step, "left");
      const multiplier = rational(step, "right");
      const result = rational(step, "result");
      return `Later-year interest $=${moneyPlain(earlierInterest)}\\times${fractionLatex(multiplier)}=${moneyPlain(result)}$.`;
    }
    default:
      throw new Error(`unhandled explanation teaching key: ${step.teachingKey}`);
  }
}

function renderConcept(trace: Cp003SolutionTrace): string {
  switch (trace.conceptKey) {
    case "AMOUNT_BY_ANNUAL_FACTOR": {
      const step = findStep(trace, "ANNUAL_FACTOR");
      return `The balance is multiplied by ${annualFactorText(rational(step, "ratePercent"))} once each year.`;
    }
    case "CI_AS_AMOUNT_MINUS_PRINCIPAL":
      return "First find the maturity amount, then subtract the original principal.";
    case "REVERSE_COMPOUND_AMOUNT":
      return "Reverse all annual growth factors to recover the original principal.";
    case "PRINCIPAL_FROM_CI_FACTOR":
      return "The given compound interest equals the principal multiplied by the compound-interest factor.";
    case "RATE_FROM_GROWTH_FACTOR":
      return "Compare amount with principal, then identify the annual factor whose repeated power gives that growth.";
    case "TIME_FROM_GROWTH_FACTOR":
      return "Match the observed amount ratio with repeated powers of the known annual factor.";
    case "NTH_YEAR_INTEREST_FROM_OPENING_BALANCE": {
      const step = findStep(trace, "OPENING_BALANCE_OF_TARGET_YEAR");
      const year = numeric(step, "year") + 1;
      return `Interest in the ${ordinal(year)} year is calculated on the balance after $${year - 1}$ completed years.`;
    }
    case "PRINCIPAL_FROM_NTH_YEAR_INTEREST":
      return "Undo the year-specific interest factor to recover the principal.";
    case "RATE_BY_NTH_YEAR_SUBSTITUTION":
      return "Test the exact annual rate against the specified year's interest relation.";
    case "PREVIOUS_BALANCE_BY_REVERSE_FACTOR":
      return "Undo one year's growth by dividing the current balance by the annual factor.";
    case "RATE_FROM_CONSECUTIVE_BALANCES":
      return "The increase between consecutive balances is one year's interest on the opening balance.";
    case "PRINCIPAL_FROM_CONSECUTIVE_BALANCES":
      return "Use consecutive balances to obtain the annual factor, then reverse the earlier observation.";
    case "AMOUNT_DIFFERENCE":
      return trace.shortcut?.key === "NEXT_YEAR_INTEREST"
        ? "The difference between consecutive year-end amounts is the interest earned in the later year."
        : "Find the two required year-end amounts from the same principal and subtract.";
    case "YEARLY_INTEREST_GP":
      return "Successive yearly interests grow by the same annual factor as the account balance.";
    default:
      throw new Error(`unhandled concept key: ${trace.conceptKey}`);
  }
}

function renderCommonMistake(key: string): string {
  const messages: Readonly<Record<string, string>> = Object.freeze({
    RETURN_INTEREST_INSTEAD_OF_AMOUNT: "Do not stop at compound interest; the question asks for the total amount.",
    USE_SIMPLE_INTEREST: "Simple interest ignores interest earned on earlier interest.",
    REVERSE_SIMPLE_INTEREST: "Do not reverse a compound amount with a simple-interest multiplier.",
    COPY_COMPOUND_INTEREST_AS_PRINCIPAL: "The given compound interest is not the original principal.",
    DIVIDE_TOTAL_GROWTH_BY_YEARS: "Do not divide total percentage growth equally by the number of years; compound growth is multiplicative.",
    USE_SIMPLE_INTEREST_TIME: "A simple-interest time formula does not apply to repeated annual multiplication.",
    USE_FIRST_YEAR_INTEREST: "Later-year interest is based on the increased balance, not only on the original principal.",
    TREAT_NTH_YEAR_AS_FIRST_YEAR: "Dividing only by the rate treats the observed interest as first-year interest.",
    USE_DIRECT_INTEREST_TO_PRINCIPAL_RATIO: "Using interest divided by principal directly ignores the earlier growth of the balance.",
    SUBTRACT_RATE_FROM_CURRENT_BALANCE: "Subtracting a percentage from the current amount is not the reverse of percentage growth.",
    DIVIDE_BY_CLOSING_BALANCE: "The percentage base is the opening balance, not the closing balance.",
    COPY_FIRST_OBSERVED_AMOUNT_AS_PRINCIPAL: "The first observed amount is not necessarily the year-zero principal.",
    USE_SIMPLE_INTEREST_FOR_YEAR_GAP: "Do not apply simple interest to the original principal across the year gap; the balance has already grown.",
    KEEP_YEARLY_INTEREST_CONSTANT: "Keeping yearly interest constant is simple-interest reasoning.",
  });
  const message = messages[key];
  if (!message) throw new Error(`unhandled common-mistake key: ${key}`);
  return message;
}

function renderShortcut(trace: Cp003SolutionTrace): Cp003StudentExplanation["shortcut"] {
  if (!trace.shortcut) return undefined;
  const sourceSteps = trace.shortcut.sourceStepIds.map((id) => {
    const step = trace.coreSteps.find((candidate) => candidate.id === id);
    if (!step) throw new Error(`${trace.qlId}: shortcut source step ${id} missing`);
    return step;
  });
  switch (trace.shortcut.key) {
    case "CANCEL_BEFORE_MULTIPLYING":
      return Object.freeze({
        title: "Cancel before multiplying",
        steps: Object.freeze(sourceSteps.map(renderStep)),
        sourceStepIds: Object.freeze([...trace.shortcut.sourceStepIds]),
      });
    case "REVERSE_FACTOR_DIRECTLY":
      return Object.freeze({
        title: "Reverse the complete growth factor directly",
        steps: Object.freeze(sourceSteps.map(renderStep)),
        sourceStepIds: Object.freeze([...trace.shortcut.sourceStepIds]),
      });
    case "OPENING_BALANCE_ONLY":
      return Object.freeze({
        title: "Find only the required year's opening balance",
        steps: Object.freeze(sourceSteps.map(renderStep)),
        sourceStepIds: Object.freeze([...trace.shortcut.sourceStepIds]),
      });
    case "NEXT_YEAR_INTEREST":
      return Object.freeze({
        title: "Treat the consecutive-year difference as interest",
        steps: Object.freeze(sourceSteps.map(renderStep)),
        sourceStepIds: Object.freeze([...trace.shortcut.sourceStepIds]),
      });
    case "YEARLY_INTEREST_GP":
      return Object.freeze({
        title: "Use the yearly-interest geometric progression",
        steps: Object.freeze(sourceSteps.map(renderStep)),
        sourceStepIds: Object.freeze([...trace.shortcut.sourceStepIds]),
      });
    default:
      throw new Error(`unhandled shortcut key: ${trace.shortcut.key}`);
  }
}

export function explanationFor(trace: Cp003SolutionTrace): Cp003StudentExplanation {
  const keyIdea = renderConcept(trace);
  const studentSteps = trace.coreSteps.map(renderStep);
  const examSourceSteps = trace.coreSteps.length <= 2 ? trace.coreSteps : trace.coreSteps.slice(-2);
  const foundationSourceSteps = trace.foundationSteps.length > 0 ? trace.foundationSteps : trace.coreSteps;
  const shortcut = renderShortcut(trace);
  const verification = trace.verificationSteps.length > 0
    ? Object.freeze({
        method: "Exact relation check",
        steps: Object.freeze(trace.verificationSteps.map(renderStep)),
        sourceStepIds: Object.freeze(trace.verificationSteps.map((step) => step.id)),
      })
    : undefined;
  const finalAnswer = answerText(trace.answerSemantic, trace.finalAnswer);

  return Object.freeze({
    traceVersion: trace.version,
    methodId: trace.methodId,
    keyIdea,
    steps: Object.freeze(studentSteps),
    sourceStepIds: Object.freeze(trace.coreSteps.map((step) => step.id)),
    finalAnswer: `Therefore, the answer is ${finalAnswer}.`,
    ...(shortcut ? { shortcut } : {}),
    ...(trace.commonMistakeKey ? { commonMistake: renderCommonMistake(trace.commonMistakeKey) } : {}),
    ...(verification ? { verification } : {}),
    depths: Object.freeze({
      exam: Object.freeze({
        steps: Object.freeze(examSourceSteps.map(renderStep)),
        sourceStepIds: Object.freeze(examSourceSteps.map((step) => step.id)),
      }),
      student: Object.freeze({
        steps: Object.freeze([keyIdea, ...studentSteps]),
        sourceStepIds: Object.freeze(trace.coreSteps.map((step) => step.id)),
      }),
      foundation: Object.freeze({
        steps: Object.freeze(foundationSourceSteps.map(renderStep)),
        sourceStepIds: Object.freeze(foundationSourceSteps.map((step) => step.id)),
      }),
    }),
  });
}
