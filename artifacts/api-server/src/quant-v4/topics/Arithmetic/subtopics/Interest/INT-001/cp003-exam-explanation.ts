import type { Cp003StudentExplanation } from "./cp003-exam-types";
import type {
  Cp003SolutionTrace,
  Cp003SolutionTraceStep,
  Cp003TraceDatum,
  Cp003TraceDatumSemantic,
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

const yearsText = (years: number): string => `$${years}$ year${years === 1 ? "" : "s"}`;
const completedYearsText = (years: number): string => `$${years}$ completed year${years === 1 ? "" : "s"}`;

function rateFormula(value: Rational): string {
  const known = new Map<string, string>([
    ["25/3", "8\\frac{1}{3}"],
    ["50/3", "16\\frac{2}{3}"],
    ["100/3", "33\\frac{1}{3}"],
    ["100/7", "14\\frac{2}{7}"],
  ]);
  return known.get(`${value.numerator}/${value.denominator}`) ?? ratePlain(value);
}

function rawValue(value: Rational, semantic: Cp003TraceDatumSemantic): string {
  switch (semantic) {
    case "MONEY": return moneyPlain(value);
    case "RATE_PERCENT": return `${rateFormula(value)}\\%`;
    case "FACTOR": return fractionLatex(value);
    case "TIME_YEARS": return `${value.numerator / value.denominator}\\text{ years}`;
    case "NUMBER": return fractionLatex(value);
  }
}

function renderStep(step: Cp003SolutionTraceStep): string {
  switch (step.operationId) {
    case "ANNUAL_FACTOR": {
      const rate = rational(step, "ratePercent"), annualFactor = rational(step, "annualFactor");
      return `Annual factor: $1+\\frac{${rateFormula(rate)}}{100}=${fractionLatex(annualFactor)}$.`;
    }
    case "POWER": {
      const base = rational(step, "base"), exponent = numeric(step, "exponent"), result = rational(step, "result");
      const label = step.teachingKey === "PRIOR_YEAR_GROWTH"
        ? "Growth before the required year"
        : step.teachingKey === "YEARLY_INTEREST_MULTIPLIER"
          ? `Yearly-interest multiplier for the ${yearsText(exponent)} gap`
          : step.teachingKey === "OBSERVED_FACTOR_POWER"
            ? "Multiplier from the principal to the earlier observation"
            : `Multiplier for ${yearsText(exponent)}`;
      return `${label}: $\\left(${fractionLatex(base)}\\right)^{${exponent}}=${fractionLatex(result)}$.`;
    }
    case "MULTIPLY": {
      const leftDatum = datum(step, "left"), resultDatum = datum(step, "result");
      if (leftDatum.kind !== "RATIONAL" || resultDatum.kind !== "RATIONAL") throw new Error(`${step.id}: malformed multiplication trace`);
      const left = rawValue(leftDatum.value, leftDatum.semantic), right = fractionLatex(rational(step, "right")), result = rawValue(resultDatum.value, resultDatum.semantic);
      const label = step.teachingKey === "AMOUNT_PRODUCT" ? "Amount"
        : step.teachingKey === "NTH_YEAR_INTEREST_FACTOR" ? "Year-specific interest factor"
          : step.teachingKey === "LATER_YEAR_INTEREST" ? "Later-year interest"
            : "Product";
      return `${label}: $${left}\\times${right}=${result}$.`;
    }
    case "SUBTRACT": {
      const leftDatum = datum(step, "left"), rightDatum = datum(step, "right"), resultDatum = datum(step, "result");
      if (leftDatum.kind !== "RATIONAL" || rightDatum.kind !== "RATIONAL" || resultDatum.kind !== "RATIONAL") throw new Error(`${step.id}: malformed subtraction trace`);
      const left = rawValue(leftDatum.value, leftDatum.semantic), right = rawValue(rightDatum.value, rightDatum.semantic), result = rawValue(resultDatum.value, resultDatum.semantic);
      const label = step.teachingKey === "COMPOUND_INTEREST_DIFFERENCE" ? "Compound interest"
        : step.teachingKey === "COMPOUND_INTEREST_FACTOR" ? "Compound-interest factor"
          : step.teachingKey === "RATE_FRACTION_FROM_FACTOR" ? "Rate fraction"
            : step.teachingKey === "ONE_YEAR_INCREASE" ? "One-year interest"
              : "Required difference";
      return `${label}: $${left}-${right}=${result}$.`;
    }
    case "DIVIDE": {
      const numerator = rational(step, "numerator"), denominator = rational(step, "denominator"), resultDatum = datum(step, "result");
      if (resultDatum.kind !== "RATIONAL") throw new Error(`${step.id}: malformed division trace`);
      if (step.teachingKey === "AMOUNT_RATIO") return `$\\frac{A}{P}=\\frac{${numerator.numerator}}{${denominator.numerator}}=${fractionLatex(resultDatum.value)}$.`;
      if (step.teachingKey === "OBSERVED_ANNUAL_FACTOR") return `Annual factor: $${moneyPlain(numerator)}\\div${moneyPlain(denominator)}=${fractionLatex(resultDatum.value)}$.`;
      const label = step.teachingKey === "PREVIOUS_BALANCE" ? "Previous balance"
        : step.teachingKey.includes("PRINCIPAL") || step.teachingKey.includes("REVERSE") ? "Principal"
          : "Result";
      return `${label}: $${moneyPlain(numerator)}\\div${fractionLatex(denominator)}=${moneyPlain(resultDatum.value)}$.`;
    }
    case "RATE_FROM_FACTOR": {
      const annualFactor = rational(step, "annualFactor"), rate = rational(step, "ratePercent");
      return `Annual factor $=${fractionLatex(annualFactor)}$, so rate $=(${fractionLatex(annualFactor)}-1)\\times100=${rateFormula(rate)}\\%$.`;
    }
    case "MATCH_POWER": {
      const base = rational(step, "base"), exponent = numeric(step, "exponent"), target = rational(step, "target");
      return step.teachingKey === "MATCH_FACTOR_POWER_FOR_TIME"
        ? `$${fractionLatex(base)}^{${exponent}}=${fractionLatex(target)}$, so the time is ${yearsText(exponent)}.`
        : `Recognise $${fractionLatex(target)}=\\left(${fractionLatex(base)}\\right)^{${exponent}}$.`;
    }
    case "YEAR_BALANCE": {
      const year = numeric(step, "year"), result = rational(step, "result");
      if (step.teachingKey === "OPENING_BALANCE_OF_TARGET_YEAR") return `Opening balance of year $${year + 1}$, after ${completedYearsText(year)}: ${moneyMath(result)}.`;
      if (step.teachingKey === "EARLIER_YEAR_AMOUNT" || step.teachingKey === "LATER_YEAR_AMOUNT") return `Amount after ${yearsText(year)}: ${moneyMath(result)}.`;
      if (step.teachingKey === "VERIFY_AMOUNT_WITH_RATE") {
        return `${moneyMath(rational(step, "principal"))} compounded at ${rateMath(rational(step, "ratePercent"))} for ${yearsText(year)} gives ${moneyMath(result)}.`;
      }
      return `Balance after year $${year}$: ${moneyMath(result)}.`;
    }
    case "YEAR_INTEREST": {
      const year = numeric(step, "year"), result = rational(step, "result");
      return `Interest earned during the ${ordinal(year)} year: ${moneyMath(result)}.`;
    }
    case "RATE_PERCENT_OF_AMOUNT": {
      const amount = rational(step, "amount"), rate = rational(step, "ratePercent"), result = rational(step, "result");
      return step.teachingKey === "CONSECUTIVE_AMOUNT_DIFFERENCE"
        ? `The difference is the next year's interest: $${rateFormula(rate)}\\%\\text{ of }${moneyPlain(amount)}=${moneyPlain(result)}$.`
        : `Required yearly interest: $${rateFormula(rate)}\\%\\text{ of }${moneyPlain(amount)}=${moneyPlain(result)}$.`;
    }
    case "RATE_FROM_INCREASE": {
      const increase = rational(step, "increase"), opening = rational(step, "openingAmount"), rate = rational(step, "ratePercent");
      return `Rate $=\\frac{${moneyPlain(increase)}}{${moneyPlain(opening)}}\\times100=${rateFormula(rate)}\\%$.`;
    }
    case "VERIFY_NTH_YEAR_RATE": {
      const principal = rational(step, "principal"), rate = rational(step, "ratePercent"), year = numeric(step, "year"), interest = rational(step, "expectedInterest");
      return `At ${rateMath(rate)}, the ${ordinal(year)}-year interest on ${moneyMath(principal)} is exactly ${moneyMath(interest)}.`;
    }
  }
}

function renderConcept(trace: Cp003SolutionTrace): string {
  switch (trace.conceptKey) {
    case "AMOUNT_BY_ANNUAL_FACTOR": return `The balance is multiplied by ${annualFactorText(rational(findStep(trace, "ANNUAL_FACTOR"), "ratePercent"))} once each year.`;
    case "CI_AS_AMOUNT_MINUS_PRINCIPAL": return "First find the maturity amount, then subtract the original principal.";
    case "REVERSE_COMPOUND_AMOUNT": return "Reverse all annual growth factors to recover the original principal.";
    case "PRINCIPAL_FROM_CI_FACTOR": return "The given compound interest equals the principal multiplied by the compound-interest factor.";
    case "RATE_FROM_GROWTH_FACTOR": return "Compare amount with principal, then identify the annual factor whose repeated power gives that growth.";
    case "TIME_FROM_GROWTH_FACTOR": return "Match the observed amount ratio with repeated powers of the known annual factor.";
    case "NTH_YEAR_INTEREST_FROM_OPENING_BALANCE": {
      const completed = numeric(findStep(trace, "OPENING_BALANCE_OF_TARGET_YEAR"), "year");
      return `Interest in the ${ordinal(completed + 1)} year is calculated on the balance after ${completedYearsText(completed)}.`;
    }
    case "PRINCIPAL_FROM_NTH_YEAR_INTEREST": return "Undo the year-specific interest factor to recover the principal.";
    case "RATE_BY_NTH_YEAR_SUBSTITUTION": return "Test the exact annual rate against the specified year's interest relation.";
    case "PREVIOUS_BALANCE_BY_REVERSE_FACTOR": return "Undo one year's growth by dividing the current balance by the annual factor.";
    case "RATE_FROM_CONSECUTIVE_BALANCES": return "The increase between consecutive balances is one year's interest on the opening balance.";
    case "PRINCIPAL_FROM_CONSECUTIVE_BALANCES": return "Use consecutive balances to obtain the annual factor, then reverse the earlier observation.";
    case "AMOUNT_DIFFERENCE": return trace.shortcut?.key === "NEXT_YEAR_INTEREST"
      ? "The difference between consecutive year-end amounts is the interest earned in the later year."
      : "Find the two required year-end amounts from the same principal and subtract.";
    case "YEARLY_INTEREST_GP": return "Successive yearly interests grow by the same annual factor as the account balance.";
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
  const sourceStepIds = Object.freeze([...trace.shortcut.sourceStepIds]);
  switch (trace.shortcut.key) {
    case "CANCEL_BEFORE_MULTIPLYING": return Object.freeze({
      title: "Cancel before multiplying",
      steps: Object.freeze(["Cancel the denominator of the total growth multiplier against the principal before multiplying its numerator."]),
      sourceStepIds,
    });
    case "REVERSE_FACTOR_DIRECTLY": return Object.freeze({
      title: "Reverse the complete growth factor directly",
      steps: Object.freeze(["Compute the complete multi-year growth factor once, then divide the final amount by it."]),
      sourceStepIds,
    });
    case "OPENING_BALANCE_ONLY": return Object.freeze({
      title: "Find only the required year's opening balance",
      steps: Object.freeze(["Skip total compound interest: find the balance at the start of the required year and take the given rate of that balance."]),
      sourceStepIds,
    });
    case "NEXT_YEAR_INTEREST": return Object.freeze({
      title: "Treat the consecutive-year difference as interest",
      steps: Object.freeze(["For consecutive years, the amount difference is exactly the interest earned in the later year."]),
      sourceStepIds,
    });
    case "YEARLY_INTEREST_GP": return Object.freeze({
      title: "Use the yearly-interest geometric progression",
      steps: Object.freeze(["Multiply the earlier yearly interest by the annual factor once for each year in the gap."]),
      sourceStepIds,
    });
    default: throw new Error(`unhandled shortcut key: ${trace.shortcut.key}`);
  }
}

export function explanationFor(trace: Cp003SolutionTrace): Cp003StudentExplanation {
  const keyIdea = renderConcept(trace), studentSteps = trace.coreSteps.map(renderStep);
  const examSourceSteps = trace.coreSteps.length <= 2 ? trace.coreSteps : trace.coreSteps.slice(-2);
  const foundationSourceSteps = trace.foundationSteps.length > 0 ? trace.foundationSteps : trace.coreSteps;
  const shortcut = renderShortcut(trace);
  const verification = trace.verificationSteps.length > 0 ? Object.freeze({
    method: "Exact relation check",
    steps: Object.freeze(trace.verificationSteps.map(renderStep)),
    sourceStepIds: Object.freeze(trace.verificationSteps.map((step) => step.id)),
  }) : undefined;
  return Object.freeze({
    traceVersion: trace.version,
    methodId: trace.methodId,
    keyIdea,
    steps: Object.freeze(studentSteps),
    sourceStepIds: Object.freeze(trace.coreSteps.map((step) => step.id)),
    finalAnswer: `Therefore, the answer is ${answerText(trace.answerSemantic, trace.finalAnswer)}.`,
    ...(shortcut ? { shortcut } : {}),
    ...(trace.commonMistakeKey ? { commonMistake: renderCommonMistake(trace.commonMistakeKey) } : {}),
    ...(verification ? { verification } : {}),
    depths: Object.freeze({
      exam: Object.freeze({ steps: Object.freeze(examSourceSteps.map(renderStep)), sourceStepIds: Object.freeze(examSourceSteps.map((step) => step.id)) }),
      student: Object.freeze({ steps: Object.freeze([keyIdea, ...studentSteps]), sourceStepIds: Object.freeze(trace.coreSteps.map((step) => step.id)) }),
      foundation: Object.freeze({ steps: Object.freeze(foundationSourceSteps.map(renderStep)), sourceStepIds: Object.freeze(foundationSourceSteps.map((step) => step.id)) }),
    }),
  });
}
