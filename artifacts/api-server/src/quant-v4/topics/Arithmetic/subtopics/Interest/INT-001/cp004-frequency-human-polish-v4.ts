import {
  FREQUENCIES,
  absRational,
  brokenAmountForState,
  completeAmountForState,
  completeAmountFromNominal,
  deepFreeze,
  div,
  effectiveAnnualRate,
  rat,
  sub,
  type Cp004Explanation,
  type Cp004MathematicalState,
  type Cp004Representation,
} from "./cp004-frequency-math";
import {
  decimal,
  durationText,
  frequencyLabel,
  frequencyNoun,
  frequencyScheduleLabel,
  moneyText,
  percentText,
} from "./cp004-frequency-options";

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

const FORBIDDEN_LEARNER_SHORTHAND = /(?:\bA\/P ratio\b|\bCI\/P ratio\b|\breference principal\b|\bexact two-stage rule\b|\bObserved \/ required value\b|\billustrative compound-growth plan\b|\bextra months\b|\bcomplete compounded years?\b)/iu;
const MISLEADING_MONTHLY_EQUALITY = /monthly compounding:.*?rate per period\s*=\s*[0-9.]+%/iu;

function yearsText(years: number): string {
  return `${years} year${years === 1 ? "" : "s"}`;
}

function brokenDuration(state: Cp004MathematicalState): string {
  return `${yearsText(state.fullYears)} and ${state.tailMonths} months`;
}

function periodRateStem(state: Cp004MathematicalState, askInterest: boolean, variant: number): string {
  const principal = moneyText(state.principal);
  const rate = percentText(state.periodicRatePercent);
  const period = frequencyNoun(state.frequency);
  const time = durationText(state.periods, state.frequency);
  const request = askInterest ? "compound interest" : "amount";
  if (variant === 1) return `${principal} is compounded at ${rate} per ${period} for ${time}. Find the ${request}.`;
  if (variant === 2) return `Find the ${request} on ${principal} after ${time} if interest is ${rate} per ${period} and is compounded each ${period}.`;
  return `A sum of ${principal} earns ${rate} every ${period}, with the interest added to the balance each time, for ${time}. What is the ${request}?`;
}

function brokenRule(state: Cp004MathematicalState): string {
  return `Interest is compounded annually for the first ${yearsText(state.fullYears)}. For the remaining ${state.tailMonths} months, simple interest is calculated on the amount after ${yearsText(state.fullYears)}.`;
}

function naturalProseStem(state: Cp004MathematicalState, variant: number): string {
  const principal = moneyText(state.principal);
  const rate = percentText(state.nominalAnnualRatePercent);
  const amount = completeAmountForState(state);
  const amountText = moneyText(amount);
  const ciText = moneyText(sub(amount, state.principal));
  const duration = durationText(state.periods, state.frequency);
  const schedule = frequencyLabel(state.frequency);
  const effective = percentText(effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency));
  const brokenAmount = moneyText(brokenAmountForState(state));

  switch (state.qlId) {
    case "INT-QL-067":
      if (variant === 1) return `${principal} is invested at ${rate} per annum, compounded ${schedule}, for ${duration}. Find the amount.`;
      if (variant === 2) return `Find the amount on ${principal} after ${duration} at ${rate} per annum, compounded ${schedule}.`;
      return `A sum of ${principal} is compounded ${schedule} at ${rate} per annum for ${duration}. What amount will it become?`;
    case "INT-QL-068":
      if (variant === 1) return `${principal} is invested at ${rate} per annum for ${duration}, with interest compounded ${schedule}. Find the compound interest.`;
      if (variant === 2) return `Find the compound interest on ${principal} for ${duration} at ${rate} per annum, compounded ${schedule}.`;
      return `A sum of ${principal} is compounded ${schedule} at ${rate} per annum for ${duration}. How much compound interest is earned?`;
    case "INT-QL-069":
      if (variant === 1) return `A sum amounts to ${amountText} in ${duration} at ${rate} per annum, compounded ${schedule}. Find the principal.`;
      if (variant === 2) return `What principal will amount to ${amountText} in ${duration} at ${rate} per annum if interest is compounded ${schedule}?`;
      return `After ${duration}, an investment becomes ${amountText} at ${rate} per annum with ${schedule} compounding. Find the original sum.`;
    case "INT-QL-070":
      if (variant === 1) return `The compound interest on a sum for ${duration} at ${rate} per annum, compounded ${schedule}, is ${ciText}. Find the principal.`;
      if (variant === 2) return `A sum earns ${ciText} as compound interest in ${duration} at ${rate} per annum, compounded ${schedule}. Find the sum.`;
      return `If the compound interest for ${duration} at ${rate} per annum, compounded ${schedule}, is ${ciText}, what was the principal?`;
    case "INT-QL-071":
      if (variant === 1) return `${principal} amounts to ${amountText} in ${duration} when interest is compounded ${schedule}. Find the nominal annual rate.`;
      if (variant === 2) return `At what nominal annual rate will ${principal} grow to ${amountText} in ${duration} if interest is compounded ${schedule}?`;
      return `${principal} becomes ${amountText} after ${duration} with ${schedule} compounding. Find the nominal annual rate.`;
    case "INT-QL-072":
      if (variant === 1) return `In how much time will ${principal} amount to ${amountText} at ${rate} per annum, compounded ${schedule}?`;
      if (variant === 2) return `${principal} grows to ${amountText} at ${rate} per annum with ${schedule} compounding. Find the time required.`;
      return `How long must ${principal} be invested at ${rate} per annum, compounded ${schedule}, to become ${amountText}?`;
    case "INT-QL-073": return periodRateStem(state, false, variant);
    case "INT-QL-074": return periodRateStem(state, true, variant);
    case "INT-QL-075": {
      const first = frequencyScheduleLabel(state.frequency);
      const second = frequencyScheduleLabel(state.comparisonFrequency);
      const term = yearsText(state.years);
      if (variant === 1) return `${principal} is invested for ${term} at ${rate} per annum. One scheme compounds interest ${first}; the other compounds it ${second}. Find the difference between the maturity amounts.`;
      if (variant === 2) return `The same sum, ${principal}, is invested for ${term} at ${rate} per annum under ${first} and ${second} compounding. By how much do the maturity amounts differ?`;
      return `Two schemes offer ${rate} per annum on ${principal} for ${term}: one uses ${first} compounding and the other ${second} compounding. Find the difference between their final amounts.`;
    }
    case "INT-QL-076":
      if (variant === 1) return `A nominal rate of ${rate} per annum is compounded ${schedule}. Find the effective annual rate, correct to two decimal places.`;
      if (variant === 2) return `If interest is compounded ${schedule} at a nominal rate of ${rate} per annum, what is the effective annual rate? Give the answer to two decimal places.`;
      return `Find the actual one-year percentage increase when the nominal annual rate is ${rate} and interest is compounded ${schedule}. Give the answer to two decimal places.`;
    case "INT-QL-077":
      if (variant === 1) return `The effective annual rate is ${effective} when interest is compounded ${schedule}. Find the nominal annual rate.`;
      if (variant === 2) return `What nominal annual rate, compounded ${schedule}, gives an effective annual rate of ${effective}?`;
      return `An investment has an effective annual rate of ${effective} with ${schedule} compounding. Find the quoted nominal annual rate.`;
    case "INT-QL-078":
      if (variant === 1) return `${principal} amounts to ${amountText} in ${yearsText(state.years)} at a nominal rate of ${rate} per annum. Which compounding frequency was used?`;
      if (variant === 2) return `At ${rate} per annum, ${principal} becomes ${amountText} in ${yearsText(state.years)}. Find the compounding frequency.`;
      return `An investment of ${principal} grows to ${amountText} in ${yearsText(state.years)} at a nominal annual rate of ${rate}. Was the compounding annual, half-yearly or quarterly?`;
    case "INT-QL-079":
      if (variant === 1) return `${principal} is invested at ${rate} per annum for ${brokenDuration(state)}. ${brokenRule(state)} Find the amount.`;
      if (variant === 2) return `Find the amount on ${principal} after ${brokenDuration(state)} at ${rate} per annum. Compound annually for the first ${yearsText(state.fullYears)}, then use simple interest for the remaining ${state.tailMonths} months on the balance at that point.`;
      return `${principal} is invested for ${brokenDuration(state)} at ${rate} per annum. After ${yearsText(state.fullYears)} of annual compounding, simple interest is applied for the remaining ${state.tailMonths} months on that balance. Find the final amount.`;
    case "INT-QL-080":
      if (variant === 1) return `${principal} is invested at ${rate} per annum for ${brokenDuration(state)}. ${brokenRule(state)} Find the total interest.`;
      if (variant === 2) return `Find the total interest on ${principal} after ${brokenDuration(state)} at ${rate} per annum. Compound annually for ${yearsText(state.fullYears)}, then use simple interest for the remaining ${state.tailMonths} months on the balance at that point.`;
      return `${principal} is invested for ${brokenDuration(state)} at ${rate} per annum. After ${yearsText(state.fullYears)} of annual compounding, simple interest is applied for the remaining ${state.tailMonths} months on that balance. Find the total interest earned.`;
    case "INT-QL-081":
      if (variant === 1) return `A sum amounts to ${brokenAmount} in ${brokenDuration(state)} at ${rate} per annum. ${brokenRule(state)} Find the principal.`;
      if (variant === 2) return `After ${brokenDuration(state)}, an investment becomes ${brokenAmount} at ${rate} per annum. Interest is compounded annually for ${yearsText(state.fullYears)} and then calculated as simple interest for the remaining ${state.tailMonths} months on the balance at that point. Find the original sum.`;
      return `What principal will amount to ${brokenAmount} in ${brokenDuration(state)} at ${rate} per annum if the first ${yearsText(state.fullYears)} are compounded annually and the remaining ${state.tailMonths} months use simple interest on the resulting balance?`;
    case "INT-QL-082":
      if (variant === 1) return `${principal} amounts to ${brokenAmount} in ${brokenDuration(state)}. Interest is compounded annually for the first ${yearsText(state.fullYears)} and calculated as simple interest for the remaining ${state.tailMonths} months on the balance at that point. Find the annual rate.`;
      if (variant === 2) return `At what annual rate will ${principal} become ${brokenAmount} in ${brokenDuration(state)} if interest is compounded annually for ${yearsText(state.fullYears)} and then treated as simple interest for the remaining ${state.tailMonths} months?`;
      return `${principal} becomes ${brokenAmount} after ${brokenDuration(state)}. The first ${yearsText(state.fullYears)} use annual compounding; the remaining ${state.tailMonths} months use simple interest on the balance after those years. Find the annual rate.`;
    case "INT-QL-083":
      if (variant === 1) return `${principal} becomes ${brokenAmount} at ${rate} per annum after a whole number of years plus ${state.tailMonths} months. Interest is compounded annually for the years and simple interest is used for the last ${state.tailMonths} months. Find the number of years.`;
      if (variant === 2) return `After how many years, followed by ${state.tailMonths} months at simple interest, will ${principal} become ${brokenAmount} at ${rate} per annum if the yearly part is compounded annually?`;
      return `${principal} is invested at ${rate} per annum and finally becomes ${brokenAmount}. The last ${state.tailMonths} months use simple interest after the preceding years of annual compounding. How many years were compounded annually?`;
    case "INT-QL-084": {
      const first = frequencyLabel(state.firstFrequency);
      const second = frequencyLabel(state.secondFrequency);
      if (variant === 1) return `${principal} is invested at ${rate} per annum. Interest is compounded ${first} during the first year and ${second} during the second year. Find the amount after 2 years.`;
      if (variant === 2) return `On ${principal} at ${rate} per annum, compounding is ${first} for the first year and ${second} for the next year. Find the final amount.`;
      return `A sum of ${principal} earns ${rate} per annum. It is compounded ${first} for one year and then ${second} for the next year. What amount will it become?`;
    }
    case "INT-QL-085": {
      const first = frequencyLabel(state.firstFrequency);
      const second = frequencyLabel(state.secondFrequency);
      if (variant === 1) return `${principal} is invested at ${rate} per annum. Interest is compounded ${first} during the first year and ${second} during the second year. Find the compound interest after 2 years.`;
      if (variant === 2) return `On ${principal} at ${rate} per annum, compounding is ${first} for the first year and ${second} for the next year. Find the total compound interest.`;
      return `A sum of ${principal} earns ${rate} per annum. It is compounded ${first} for one year and then ${second} for the next year. How much compound interest is earned in all?`;
    }
  }
}

function naturalizeTableStem(state: Cp004MathematicalState, stem: string): string {
  let result = stem
    .replace(/Observed \/ required value/gu, OBSERVED_VALUE_LABEL[state.qlId] ?? "Required value")
    .replace(/\| Extra months \|/gu, "| Remaining months |")
    .replace(/\| Rule for extra months \|/gu, "| Interest for remaining months |")
    .replace(/\| Complete years \| \? \|/gu, "| Years compounded annually | ? |")
    .replace(/\| Complete compounded years \| \? \|/gu, "| Years compounded annually | ? |");

  if (["INT-QL-079", "INT-QL-080", "INT-QL-081", "INT-QL-082"].includes(state.qlId)) {
    result = result
      .replace(new RegExp(`\\| Complete years \\| ${state.fullYears} \\|\\n\\| Remaining months \\| ${state.tailMonths} \\|`, "u"), `| Time | ${brokenDuration(state)} |`)
      .replace(/\| Interest for remaining months \| Simple interest \|/gu, `| Interest treatment | Annual compounding for ${yearsText(state.fullYears)}, then simple interest for the remaining ${state.tailMonths} months |`);
  }
  return result;
}

export function polishCp004PresentationHumanV4(
  state: Cp004MathematicalState,
  presentation: Presentation,
): Presentation {
  if (presentation.representation === "TERMS_TABLE") {
    return deepFreeze({ ...presentation, stem: naturalizeTableStem(state, presentation.stem) });
  }

  const variant = presentation.representation === "STANDARD_PROSE" ? 1
    : presentation.representation === "BALANCE_RECORD" ? 2
      : 3;
  return deepFreeze({
    ...presentation,
    representation: "STANDARD_PROSE",
    stem: naturalProseStem(state, variant),
  });
}

function plainLanguage(text: string): string {
  return text
    .replace(/Use a reference principal of ₹100\./gu, "Suppose the original sum were ₹100.")
    .replace(/Start with a reference principal of ₹100\./gu, "Suppose the original sum were ₹100.")
    .replace(/reference principal/giu, "₹100 example")
    .replace(/₹100 example such as ₹100/giu, "₹100 example")
    .replace(/The exact A\/P ratio is ([0-9]+\/[0-9]+)\./gu, "In fraction form, the final amount is $1 of the original sum.")
    .replace(/The exact CI\/P ratio is ([0-9]+\/[0-9]+)\./gu, "In fraction form, the interest is $1 of the original sum.")
    .replace(/A\/P ratio/gu, "final amount compared with the original sum")
    .replace(/CI\/P ratio/gu, "interest compared with the original sum")
    .replace(/Use the annual-rate choices in the exact two-stage rule\./gu, "Check the annual-rate choices using the two stages stated in the question.")
    .replace(/the exact two-stage rule/giu, "the two stages stated in the question")
    .replace(/\bextra months\b/giu, "remaining months")
    .replace(/\bcomplete compounded years\b/giu, "years of annual compounding")
    .replace(/\bcomplete compounded year\b/giu, "year of annual compounding")
    .replace(/\bafter the complete years\b/giu, "after those years")
    .replace(/\bcomplete years\b/giu, "whole years")
    .replace(/\bcomplete year\b/giu, "full year")
    .replace(/\blatest balance\b/giu, "balance at that point")
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
  const firstIsLarger = firstAmount.numerator * secondAmount.denominator >= secondAmount.numerator * firstAmount.denominator;
  const larger = firstIsLarger ? firstAmount : secondAmount;
  const smaller = firstIsLarger ? secondAmount : firstAmount;
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

function directPeriodicSteps(state: Cp004MathematicalState, existing: readonly string[]): readonly string[] {
  if (state.qlId !== "INT-QL-073" && state.qlId !== "INT-QL-074") return existing;
  return Object.freeze(existing.map((step) => {
    const completePeriodPattern = new RegExp(`^There are ${state.periods} complete ${frequencyNoun(state.frequency)}s?\\.$`, "u");
    if (completePeriodPattern.test(step)) {
      return `The stated time is ${durationText(state.periods, state.frequency)}, giving ${state.periods} compounding period${state.periods === 1 ? "" : "s"}.`;
    }
    return step;
  }));
}

function frequencyIdentificationSteps(state: Cp004MathematicalState, existing: readonly string[]): readonly string[] {
  if (state.qlId !== "INT-QL-078") return existing;
  const target = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.frequency, state.frequency * state.years);
  const targetRatio = div(target, state.principal);
  const comparisons = FREQUENCIES.filter((frequency) => frequency !== 12).map((frequency) => {
    const amountOn100 = completeAmountFromNominal(rat(100), state.nominalAnnualRatePercent, frequency, frequency * state.years);
    const parts = frequency === 1 ? "once in the year"
      : frequency === 2 ? "into 2 equal half-yearly parts and apply it twice"
        : "into 4 equal quarterly parts and apply it four times";
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
  const periodSteps = directPeriodicSteps(state, plainSteps);
  const compared = comparisonSteps(state, periodSteps);
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

export function assertCp004HumanPolishV4(
  state: Cp004MathematicalState,
  presentation: Presentation,
  explanation: Cp004Explanation,
): void {
  const learnerText = [presentation.stem, explanation.whatAsked, ...explanation.steps, explanation.finalAnswer, explanation.commonMistake].join("\n");
  if (FORBIDDEN_LEARNER_SHORTHAND.test(learnerText)) {
    throw new Error(`${state.qlId}: technical or unnatural learner-facing wording survived the human-polish layer.`);
  }
  if (presentation.representation !== "TERMS_TABLE" && presentation.representation !== "STANDARD_PROSE") {
    throw new Error(`${state.qlId}: table-like card representation survived the prose-dominant presentation layer.`);
  }
  if (state.qlId === "INT-QL-078" && MISLEADING_MONTHLY_EQUALITY.test(learnerText)) {
    throw new Error(`${state.qlId}: rounded monthly rate is presented as an exact equality.`);
  }
  if (state.qlId === "INT-QL-075" && /Difference = .*? and .*? compared =/u.test(learnerText)) {
    throw new Error(`${state.qlId}: awkward comparison wording survived the human-polish layer.`);
  }
  if (state.qlId === "INT-QL-076" && explanation.steps.some((step) => /^After one year:.* = ₹/u.test(step))) {
    throw new Error(`${state.qlId}: rounded effective-rate amount is presented with exact equality.`);
  }
}