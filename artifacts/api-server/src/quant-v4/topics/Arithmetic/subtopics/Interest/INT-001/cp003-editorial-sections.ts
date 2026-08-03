import type { IntCp003GeneratedQuestion } from "./int-001-cp003-final-runtime";
import type { IntCp003EditorialExplanation } from "./cp003-editorial-base";
import { add, amount, cancellationProduct, decimal, div, fractionLatex, moneyPlain, mul, ordinal, pow, rat, sub, type EditorialState } from "./cp003-editorial-base";

export function explanationSections(question: IntCp003GeneratedQuestion, state: EditorialState): Omit<IntCp003EditorialExplanation, "optionAnalysis"> {
  const p = state.principal;
  const r = state.ratePercent;
  const n = state.years;
  const k = state.specifiedYear;
  const t = state.observationYear;
  const e = state.earlierYear;
  const l = state.laterYear;
  const f = state.annualFactor;
  const factorDecimal = decimal(f);
  const factorFraction = fractionLatex(f);
  const rateFraction = fractionLatex(div(r, rat(100)));

  switch (question.qlId) {
    case "INT-QL-053": {
      const multiplier = pow(f, n);
      return {
        coreConcept: "For annual compounding, the amount after $n$ years is:\n$$A=P\\left(1+\\frac{r}{100}\\right)^n$$",
        stepByStepSolution: Object.freeze([
          `Convert the rate into an annual multiplier: $1+\\frac{${decimal(r)}}{100}=${factorDecimal}=${factorFraction}$.`,
          `Substitute $P=${moneyPlain(p)}$ and $n=${n}$: $$A=${p.numerator}\\times\\left(${factorFraction}\\right)^{${n}}=${p.numerator}\\times${fractionLatex(multiplier)}$$`,
          ...cancellationProduct(p, multiplier, "A"),
        ]),
        examSpeedShortcut: `Use the decimal factor $${factorDecimal}$ for recognition and the fraction $${factorFraction}$ for cancellation.`,
      };
    }
    case "INT-QL-054":
      return {
        coreConcept: "First find the maturity amount, then subtract the principal:\n$$CI=P\\left[\\left(1+\\frac{r}{100}\\right)^n-1\\right]$$",
        stepByStepSolution: Object.freeze([
          `Annual multiplier: $${factorDecimal}=${factorFraction}$.`,
          `Maturity amount: $$A=${p.numerator}\\times\\left(${factorFraction}\\right)^{${n}}=${moneyPlain(state.maturityAmount)}$$`,
          `Compound interest: $$CI=A-P=${state.maturityAmount.numerator}-${p.numerator}=${moneyPlain(state.compoundInterest)}$$`,
        ]),
        examSpeedShortcut: "Compute the exact amount factor first; subtract the principal only at the end.",
      };
    case "INT-QL-055": {
      const inverseMultiplier = div(rat(1), pow(f, n));
      return {
        coreConcept: "Reverse the compound multiplier:\n$$P=\\frac{A}{\\left(1+\\frac{r}{100}\\right)^n}$$",
        stepByStepSolution: Object.freeze([
          `Annual multiplier: $${factorDecimal}=${factorFraction}$.`,
          `Total growth factor: $$\\left(${factorFraction}\\right)^{${n}}=${fractionLatex(pow(f, n))}$$`,
          `Reverse the factor: $$P=${state.maturityAmount.numerator}\\times${fractionLatex(inverseMultiplier)}$$`,
          ...cancellationProduct(state.maturityAmount, inverseMultiplier, "P"),
        ]),
        examSpeedShortcut: "Multiply by the reciprocal growth factor and cancel before multiplying.",
      };
    }
    case "INT-QL-056": {
      const compoundInterestFactor = sub(pow(f, n), rat(1));
      const inverseFactor = div(rat(1), compoundInterestFactor);
      return {
        coreConcept: "For compound interest alone:\n$$CI=P\\left[\\left(1+\\frac{r}{100}\\right)^n-1\\right]$$",
        stepByStepSolution: Object.freeze([
          `Annual multiplier: $${factorDecimal}=${factorFraction}$.`,
          `Compound-interest factor: $$\\left(${factorFraction}\\right)^{${n}}-1=${fractionLatex(compoundInterestFactor)}$$`,
          `Hence: $$P=${state.compoundInterest.numerator}\\div${fractionLatex(compoundInterestFactor)}=${state.compoundInterest.numerator}\\times${fractionLatex(inverseFactor)}$$`,
          ...cancellationProduct(state.compoundInterest, inverseFactor, "P"),
        ]),
        examSpeedShortcut: "Do not divide by $nr/100$; that is the simple-interest inverse.",
      };
    }
    case "INT-QL-057": {
      const observedFactor = div(state.maturityAmount, p);
      return {
        coreConcept: "Use the observed amount factor and match an exact annual power:\n$$\\frac{A}{P}=\\left(1+\\frac{r}{100}\\right)^n$$",
        stepByStepSolution: Object.freeze([
          `Observed factor: $$\\frac{A}{P}=\\frac{${state.maturityAmount.numerator}}{${p.numerator}}=${decimal(observedFactor)}=${fractionLatex(observedFactor)}$$`,
          `Recognise the perfect power: $$${fractionLatex(observedFactor)}=\\left(${factorFraction}\\right)^{${n}}$$`,
          `Therefore the annual factor is $${factorFraction}=${factorDecimal}$.`,
          `Rate: $$r=(${factorDecimal}-1)\\times100=${decimal(r)}\\%$$`,
        ]),
        examSpeedShortcut: "Reduce $A/P$ first; identify the exact square, cube or fourth power instead of using a rounded root.",
      };
    }
    case "INT-QL-058": {
      const observedFactor = div(state.maturityAmount, p);
      const ladder = Array.from({ length: n }, (_unused, index) => `${factorDecimal}^{${index + 1}}=${decimal(pow(f, index + 1))}`).join(", ");
      return {
        coreConcept: "The number of years is the number of times the annual factor is applied:\n$$\\frac{A}{P}=\\left(1+\\frac{r}{100}\\right)^n$$",
        stepByStepSolution: Object.freeze([
          `Annual factor: $${factorDecimal}=${factorFraction}$.`,
          `Observed factor: $$\\frac{${state.maturityAmount.numerator}}{${p.numerator}}=${decimal(observedFactor)}$$`,
          `Build the short factor ladder: $${ladder}$.`,
          `The observed factor occurs at $n=${n}$; therefore the time is $${n}$ years.`,
        ]),
        examSpeedShortcut: "For exam-friendly rates, a short factor ladder is faster and safer than logarithms.",
      };
    }
    case "INT-QL-059": {
      const openingBalance = amount(p, r, k - 1);
      return {
        coreConcept: "Interest in the $k^{\\text{th}}$ year is charged on the balance after $k-1$ years:\n$$J_k=P\\left(1+\\frac{r}{100}\\right)^{k-1}\\frac{r}{100}$$",
        stepByStepSolution: Object.freeze([
          `Opening balance of the ${ordinal(k)} year: $$B_{${k - 1}}=${p.numerator}\\left(${factorFraction}\\right)^{${k - 1}}=${moneyPlain(openingBalance)}$$`,
          `Interest for that year: $$J_${k}=${openingBalance.numerator}\\times${rateFraction}$$`,
          ...cancellationProduct(openingBalance, div(r, rat(100)), `J_${k}`),
        ]),
        examSpeedShortcut: `Find the previous year's closing balance, then take $${decimal(r)}\\%$ of it.`,
      };
    }
    case "INT-QL-060": {
      const yearlyInterestFactor = mul(div(r, rat(100)), pow(f, k - 1));
      const inverseFactor = div(rat(1), yearlyInterestFactor);
      return {
        coreConcept: "Reverse the $k^{\\text{th}}$-year interest factor:\n$$P=\\frac{J_k}{\\frac{r}{100}\\left(1+\\frac{r}{100}\\right)^{k-1}}$$",
        stepByStepSolution: Object.freeze([
          `Yearly-interest factor: $$${rateFraction}\\left(${factorFraction}\\right)^{${k - 1}}=${fractionLatex(yearlyInterestFactor)}$$`,
          `Reverse it: $$P=${state.specifiedYearInterest.numerator}\\div${fractionLatex(yearlyInterestFactor)}=${state.specifiedYearInterest.numerator}\\times${fractionLatex(inverseFactor)}$$`,
          ...cancellationProduct(state.specifiedYearInterest, inverseFactor, "P"),
        ]),
        examSpeedShortcut: "Combine the rate fraction and previous growth factors into one exact multiplier, then invert it.",
      };
    }
    case "INT-QL-061": {
      const observedRatio = div(state.specifiedYearInterest, p);
      const exactRatio = mul(div(r, rat(100)), pow(f, k - 1));
      return {
        coreConcept: "For the $k^{\\text{th}}$ year:\n$$\\frac{J_k}{P}=\\frac{r}{100}\\left(1+\\frac{r}{100}\\right)^{k-1}$$",
        stepByStepSolution: Object.freeze([
          `Observed ratio: $$\\frac{J_${k}}{P}=\\frac{${state.specifiedYearInterest.numerator}}{${p.numerator}}=${decimal(observedRatio)}$$`,
          `Test the exact exam-friendly rate $${decimal(r)}\\%$: $$\\frac{${decimal(r)}}{100}\\left(${factorFraction}\\right)^{${k - 1}}=${fractionLatex(exactRatio)}=${decimal(exactRatio)}$$`,
          `The calculated ratio equals the observed ratio; hence $r=${decimal(r)}\\%$.`,
        ]),
        examSpeedShortcut: "Use exact substitution from the standard rate set; do not estimate a floating root.",
      };
    }
    case "INT-QL-062": {
      const inverseFactor = div(rat(1), f);
      return {
        coreConcept: "One year earlier, divide the later balance by the annual growth factor:\n$$B_{t-1}=\\frac{B_t}{1+r/100}$$",
        stepByStepSolution: Object.freeze([
          `Annual factor: $${factorDecimal}=${factorFraction}$.`,
          `Previous balance: $$B_${t - 1}=${state.observedAmount.numerator}\\div${factorFraction}=${state.observedAmount.numerator}\\times${fractionLatex(inverseFactor)}$$`,
          ...cancellationProduct(state.observedAmount, inverseFactor, `B_${t - 1}`),
        ]),
        examSpeedShortcut: `Dividing by $${factorDecimal}$ is the same as multiplying by $${fractionLatex(inverseFactor)}$.`,
      };
    }
    case "INT-QL-063": {
      const increase = sub(state.nextObservedAmount, state.observedAmount);
      return {
        coreConcept: "For consecutive annual balances, the increase is one year's interest:\n$$r=\\frac{B_{t+1}-B_t}{B_t}\\times100$$",
        stepByStepSolution: Object.freeze([
          `One-year increase: $$${moneyPlain(state.nextObservedAmount)}-${moneyPlain(state.observedAmount)}=${moneyPlain(increase)}$$`,
          `Use the earlier balance as the base: $$r=\\frac{${increase.numerator}}{${state.observedAmount.numerator}}\\times100$$`,
          `Cancel: $$r=${fractionLatex(div(increase, state.observedAmount))}\\times100=${decimal(r)}\\%$$`,
        ]),
        examSpeedShortcut: "For consecutive balances, divide the difference by the earlier balance, never the later balance.",
      };
    }
    case "INT-QL-064": {
      const observedFactor = div(state.nextObservedAmount, state.observedAmount);
      const inverseFactor = div(rat(1), pow(observedFactor, t));
      return {
        coreConcept: "Consecutive amounts reveal the annual factor; then reverse all elapsed periods:\n$$\\frac{A_{t+1}}{A_t}=1+\\frac{r}{100},\\qquad P=\\frac{A_t}{(1+r/100)^t}$$",
        stepByStepSolution: Object.freeze([
          `One-year factor: $$\\frac{${state.nextObservedAmount.numerator}}{${state.observedAmount.numerator}}=${decimal(observedFactor)}=${fractionLatex(observedFactor)}$$`,
          `Reverse $${t}$ years: $$P=${state.observedAmount.numerator}\\times${fractionLatex(inverseFactor)}$$`,
          ...cancellationProduct(state.observedAmount, inverseFactor, "P"),
        ]),
        examSpeedShortcut: "Consecutive amounts reveal the annual factor directly; then move backwards to year zero.",
      };
    }
    case "INT-QL-065": {
      const difference = sub(state.laterAmount, state.earlierAmount);
      return {
        coreConcept: "The required difference is the later amount minus the earlier amount:\n$$\\Delta A=A_l-A_e$$",
        stepByStepSolution: Object.freeze([
          `Earlier amount: $$A_${e}=${p.numerator}\\left(${factorFraction}\\right)^{${e}}=${moneyPlain(state.earlierAmount)}$$`,
          `Later amount: $$A_${l}=${p.numerator}\\left(${factorFraction}\\right)^{${l}}=${moneyPlain(state.laterAmount)}$$`,
          `Difference: $$${moneyPlain(state.laterAmount)}-${moneyPlain(state.earlierAmount)}=${moneyPlain(difference)}$$`,
        ]),
        examSpeedShortcut: "When the years are consecutive, the difference equals the interest earned in the later year.",
      };
    }
    case "INT-QL-066": {
      const gap = l - e;
      const multiplier = pow(f, gap);
      return {
        coreConcept: "Successive yearly interests form a GP with common ratio $1+r/100$:\n$$J_l=J_e\\left(1+\\frac{r}{100}\\right)^{l-e}$$",
        stepByStepSolution: Object.freeze([
          `Common ratio: $${factorDecimal}=${factorFraction}$.`,
          `Year gap: $l-e=${l}-${e}=${gap}$.`,
          `Apply the growth factor: $$J_${l}=${state.earlierYearInterest.numerator}\\left(${factorFraction}\\right)^{${gap}}=${state.earlierYearInterest.numerator}\\times${fractionLatex(multiplier)}$$`,
          ...cancellationProduct(state.earlierYearInterest, multiplier, `J_${l}`),
        ]),
        examSpeedShortcut: `Move from year $${e}$ to year $${l}$ by applying exactly $${gap}$ growth step${gap === 1 ? "" : "s"}.`,
      };
    }
  }
}
