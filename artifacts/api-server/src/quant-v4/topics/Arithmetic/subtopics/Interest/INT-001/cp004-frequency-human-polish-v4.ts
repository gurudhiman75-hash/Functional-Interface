import {
  FREQUENCIES,
  absRational,
  completeAmountFromNominal,
  deepFreeze,
  div,
  rat,
  sub,
  type Cp004Explanation,
  type Cp004MathematicalState,
  type Cp004Representation,
} from "./cp004-frequency-math";
import { decimal, frequencyScheduleLabel, moneyText } from "./cp004-frequency-options";

type Presentation = Readonly<{ representation: Cp004Representation; stemFamilyId: string; stem: string }>;

const OBSERVED_VALUE_LABEL: Readonly<Partial<Record<Cp004MathematicalState["qlId"], string>>> = Object.freeze({
  "INT-QL-067": "Maturity amount",
  "INT-QL-068": "Compound interest",
  "INT-QL-069": "Maturity amount",
  "INT-QL-070": "Compound interest",
  "INT-QL-071": "Maturity amount",
  "INT-QL-072": "Maturity amount",
  "INT-QL-073": "Maturity amount",
  "INT-QL-074": "Compound interest",
});

export function polishCp004PresentationHumanV4(
  state: Cp004MathematicalState,
  presentation: Presentation,
): Presentation {
  const label = OBSERVED_VALUE_LABEL[state.qlId];
  if (!label || !presentation.stem.includes("Observed / required value")) return presentation;
  return deepFreeze({
    ...presentation,
    stem: presentation.stem.replace(/Observed \/ required value/gu, label),
  });
}

function plainLanguage(text: string): string {
  return text
    .replace(/Use a reference principal of ₹100\./gu, "Suppose the original sum were ₹100.")
    .replace(/Start with a reference principal of ₹100\./gu, "Suppose the original sum were ₹100.")
    .replace(/reference principal/giu, "₹100 example")
    .replace(/The exact A\/P ratio is ([0-9]+\/[0-9]+)\./gu, "In fraction form, the final amount is $1 of the original sum.")
    .replace(/The exact CI\/P ratio is ([0-9]+\/[0-9]+)\./gu, "In fraction form, the interest is $1 of the original sum.")
    .replace(/A\/P ratio/gu, "final amount compared with the original sum")
    .replace(/CI\/P ratio/gu, "interest compared with the original sum")
    .replace(/Use the annual-rate choices in the exact two-stage rule\./gu, "Check the annual-rate choices using the two stages stated in the question.")
    .replace(/the exact two-stage rule/giu, "the two stages stated in the question")
    .replace(
      /Do not use the unknown principal to manufacture the amount ratio\./gu,
      "Do not guess the original sum from the final amount. First see what ₹100 would become, then scale back to the given final amount.",
    )
    .replace(/exact amount ratio/giu, "exact comparison between the final amount and the original sum")
    .replace(/amount ratio/giu, "comparison between the final amount and the original sum");
}

function comparisonSteps(state: Cp004MathematicalState, existing: readonly string[]): readonly string[] {
  if (state.qlId !== "INT-QL-075") return existing;
  const firstPeriods = state.frequency * state.years;
  const secondPeriods = state.comparisonFrequency * state.years;
  const firstAmount = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.frequency, firstPeriods);
  const secondAmount = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.comparisonFrequency, secondPeriods);
  const difference = absRational(sub(firstAmount, secondAmount));
  const larger = firstAmount.numerator * secondAmount.denominator >= secondAmount.numerator * firstAmount.denominator ? firstAmount : secondAmount;
  const smaller = larger === firstAmount ? secondAmount : firstAmount;
  return Object.freeze([
    ...existing.slice(0, 2),
    `Difference = ${moneyText(larger)} − ${moneyText(smaller)} = ${moneyText(difference)}.`,
    ...existing.slice(3),
  ]);
}

function effectiveRateSteps(state: Cp004MathematicalState, existing: readonly string[]): readonly string[] {
  if (state.qlId !== "INT-QL-076") return existing;
  return Object.freeze(existing.map((step, index) => {
    if (index === 1) return step.replace(/ = (₹[0-9,.]+)\.$/u, " ≈ $1 (rounded to two decimal places).");
    if (index === 2) return step.replace(/^Actual increase = /u, "Actual increase ≈ ");
    return step;
  }));
}

function frequencyIdentificationSteps(state: Cp004MathematicalState, existing: readonly string[]): readonly string[] {
  if (state.qlId !== "INT-QL-078") return existing;
  const target = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.frequency, state.frequency * state.years);
  const targetRatio = div(target, state.principal);
  const comparisons = FREQUENCIES.map((frequency) => {
    const amountOn100 = completeAmountFromNominal(rat(100), state.nominalAnnualRatePercent, frequency, frequency * state.years);
    const parts = frequency === 1 ? "once in the year"
      : frequency === 2 ? "into 2 equal half-yearly parts and apply it twice"
        : frequency === 4 ? "into 4 equal quarterly parts and apply it four times"
          : "into 12 equal monthly parts and apply it twelve times";
    return `${frequencyScheduleLabel(frequency)} compounding: split the annual rate ${parts}. ₹100 becomes about ${moneyText(amountOn100)}.`;
  });
  return Object.freeze([
    `First compare the final amount with the original sum: ${moneyText(target)} ÷ ${moneyText(state.principal)} = ${decimal(targetRatio, 6)}. This shows how much the money grows over the stated time.`,
    ...comparisons,
    existing[existing.length - 1]!,
  ]);
}

export function polishCp004ExplanationHumanV4(
  state: Cp004MathematicalState,
  explanation: Cp004Explanation,
): Cp004Explanation {
  const plainSteps = explanation.steps.map(plainLanguage);
  const compared = comparisonSteps(state, plainSteps);
  const effective = effectiveRateSteps(state, compared);
  const steps = frequencyIdentificationSteps(state, effective);
  return deepFreeze({
    ...explanation,
    whatAsked: plainLanguage(explanation.whatAsked),
    steps,
    finalAnswer: plainLanguage(explanation.finalAnswer),
    commonMistake: plainLanguage(explanation.commonMistake),
  });
}
