import {
  brokenAmountForState,
  completeAmountForState,
  completeAmountFromNominal,
  deepFreeze,
  periodicRate,
  rat,
  sub,
  type Cp004Explanation,
  type Cp004MathematicalState,
  type Cp004Representation,
  type Rational,
} from "./cp004-frequency-math";
import {
  frequencyNoun,
  moneyText,
  percentText,
  rateStep,
  rationalText,
} from "./cp004-frequency-options";

const INVERSE_PRINCIPAL_QLS = new Set(["INT-QL-069", "INT-QL-070", "INT-QL-081"]);

function exactDecimalText(value: Rational): string {
  const negative = value.numerator < 0n;
  const numerator = negative ? -value.numerator : value.numerator;
  const whole = numerator / value.denominator;
  let remainder = numerator % value.denominator;
  if (remainder === 0n) return `${negative ? "-" : ""}${whole}`;

  const digits: string[] = [];
  for (let index = 0; remainder !== 0n && index < 32; index += 1) {
    remainder *= 10n;
    digits.push(String(remainder / value.denominator));
    remainder %= value.denominator;
  }
  if (remainder !== 0n) return rationalText(value);
  return `${negative ? "-" : ""}${whole}.${digits.join("")}`;
}

function exactReferenceMoney(value: Rational): string {
  return `₹${exactDecimalText(value)}`;
}

function periodCountText(state: Cp004MathematicalState): string {
  return `${state.periods} ${frequencyNoun(state.frequency)}${state.periods === 1 ? "" : "s"}`;
}

export function hardenCp004ExplanationV3(
  state: Cp004MathematicalState,
  original: Cp004Explanation,
): Cp004Explanation {
  if (state.qlId === "INT-QL-069") {
    const amount = completeAmountForState(state);
    const periodRate = periodicRate(state.nominalAnnualRatePercent, state.frequency);
    const referenceAmount = completeAmountFromNominal(rat(100), state.nominalAnnualRatePercent, state.frequency, state.periods);
    const referenceRatio = rat(referenceAmount.numerator, referenceAmount.denominator * 100n);
    const steps = Object.freeze([
      rateStep(state),
      `Use a reference principal of ₹100. Amount after ${periodCountText(state)} = ₹100 × (1 + ${percentText(periodRate)})^${state.periods} = ${exactReferenceMoney(referenceAmount)}.`,
      `Therefore, every ₹100 of principal produces ${exactReferenceMoney(referenceAmount)} as the final amount. The exact A/P ratio is ${rationalText(referenceRatio)}.`,
      `Principal = ${moneyText(amount)} × 100 ÷ ${exactDecimalText(referenceAmount)} = ${moneyText(state.principal)}.`,
      `Check: compounding ${moneyText(state.principal)} for ${periodCountText(state)} gives ${moneyText(amount)}.`,
    ]);
    return deepFreeze({
      ...original,
      steps,
      commonMistake: "Do not divide the final amount by an assumed principal. First derive the amount produced by a reference principal such as ₹100.",
    });
  }

  if (state.qlId === "INT-QL-070") {
    const amount = completeAmountForState(state);
    const compoundInterest = sub(amount, state.principal);
    const periodRate = periodicRate(state.nominalAnnualRatePercent, state.frequency);
    const referenceAmount = completeAmountFromNominal(rat(100), state.nominalAnnualRatePercent, state.frequency, state.periods);
    const referenceInterest = sub(referenceAmount, rat(100));
    const referenceInterestRatio = rat(referenceInterest.numerator, referenceInterest.denominator * 100n);
    const steps = Object.freeze([
      rateStep(state),
      `Use a reference principal of ₹100. Amount after ${periodCountText(state)} = ₹100 × (1 + ${percentText(periodRate)})^${state.periods} = ${exactReferenceMoney(referenceAmount)}.`,
      `Compound interest on ₹100 = ${exactReferenceMoney(referenceAmount)} − ₹100 = ${exactReferenceMoney(referenceInterest)}. The exact CI/P ratio is ${rationalText(referenceInterestRatio)}.`,
      `Principal = ${moneyText(compoundInterest)} × 100 ÷ ${exactDecimalText(referenceInterest)} = ${moneyText(state.principal)}.`,
      `Check: ${moneyText(state.principal)} becomes ${moneyText(amount)}, so its compound interest is ${moneyText(amount)} − ${moneyText(state.principal)} = ${moneyText(compoundInterest)}.`,
    ]);
    return deepFreeze({
      ...original,
      steps,
      commonMistake: "The given figure is compound interest, not the maturity amount. Find the interest earned on a reference principal before scaling it to the given interest.",
    });
  }

  if (state.qlId === "INT-QL-081") {
    const amount = brokenAmountForState(state);
    const referenceAfterWholeYears = completeAmountFromNominal(rat(100), state.nominalAnnualRatePercent, 1, state.fullYears);
    const referenceTailInterest = rat(
      referenceAfterWholeYears.numerator * state.nominalAnnualRatePercent.numerator * BigInt(state.tailMonths),
      referenceAfterWholeYears.denominator * state.nominalAnnualRatePercent.denominator * 100n * 12n,
    );
    const referenceBrokenAmount = rat(
      referenceAfterWholeYears.numerator * referenceTailInterest.denominator + referenceTailInterest.numerator * referenceAfterWholeYears.denominator,
      referenceAfterWholeYears.denominator * referenceTailInterest.denominator,
    );
    const referenceRatio = rat(referenceBrokenAmount.numerator, referenceBrokenAmount.denominator * 100n);
    const steps = Object.freeze([
      `Start with a reference principal of ₹100. After ${state.fullYears} complete compounded year${state.fullYears === 1 ? "" : "s"}: ₹100 × (1 + ${percentText(state.nominalAnnualRatePercent)})^${state.fullYears} = ${exactReferenceMoney(referenceAfterWholeYears)}.`,
      `Simple interest for the final ${state.tailMonths} months = ${exactReferenceMoney(referenceAfterWholeYears)} × ${percentText(state.nominalAnnualRatePercent)} × ${state.tailMonths}/12 = ${exactReferenceMoney(referenceTailInterest)}.`,
      `Thus ₹100 becomes ${exactReferenceMoney(referenceAfterWholeYears)} + ${exactReferenceMoney(referenceTailInterest)} = ${exactReferenceMoney(referenceBrokenAmount)}. The exact A/P ratio is ${rationalText(referenceRatio)}.`,
      `Principal = ${moneyText(amount)} × 100 ÷ ${exactDecimalText(referenceBrokenAmount)} = ${moneyText(state.principal)}.`,
      `Check: ${moneyText(state.principal)} becomes ${moneyText(amount)} after the complete-year compounding and the stated simple-interest tail.`,
    ]);
    return deepFreeze({
      ...original,
      steps,
      commonMistake: "Do not use the unknown principal to manufacture the amount ratio. Build the two-stage result on ₹100, then scale the given final amount back to the principal.",
    });
  }

  return original;
}

export function hardenCp004PresentationV3(
  original: Readonly<{ representation: Cp004Representation; stemFamilyId: string; stem: string }>,
): Readonly<{ representation: Cp004Representation; stemFamilyId: string; stem: string }> {
  const stem = original.stem
    .replace(/^an investment plan/u, "An investment plan")
    .replace(/ earns ([0-9.]+%) in every (year|half-year|quarter|month)\b/gu, " earns $1 per $2");
  return stem === original.stem ? original : Object.freeze({ ...original, stem });
}

export function assertCp004ReviewV3(
  state: Cp004MathematicalState,
  presentation: Readonly<{ stem: string }>,
  explanation: Cp004Explanation,
): void {
  if (/^an investment plan/u.test(presentation.stem)) {
    throw new Error(`${state.qlId}: sentence begins with a lowercase article.`);
  }
  if (/ earns [0-9.]+% in every (?:year|half-year|quarter|month)\b/u.test(presentation.stem)) {
    throw new Error(`${state.qlId}: unnatural direct-period rate wording reached the stem.`);
  }
  if (!INVERSE_PRINCIPAL_QLS.has(state.qlId)) return;

  const text = explanation.steps.join(" ");
  if (!text.includes("reference principal of ₹100")) {
    throw new Error(`${state.qlId}: inverse-principal explanation does not derive the scale from ₹100.`);
  }
  if (/(?:A\/P|CI\/P).*÷\s*₹/u.test(text)) {
    throw new Error(`${state.qlId}: circular ratio working reached the explanation.`);
  }
}
