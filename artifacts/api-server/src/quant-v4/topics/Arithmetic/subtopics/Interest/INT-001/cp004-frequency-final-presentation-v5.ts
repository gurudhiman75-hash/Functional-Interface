import {
  brokenAmountForState,
  completeAmountForState,
  deepFreeze,
  effectiveAnnualRate,
  sub,
  type Cp004MathematicalState,
  type Cp004Representation,
} from "./cp004-frequency-math";
import {
  durationText,
  frequencyLabel,
  frequencyNoun,
  moneyText,
  percentText,
} from "./cp004-frequency-options";

type Presentation = Readonly<{ representation: Cp004Representation; stemFamilyId: string; stem: string }>;

const TABLE_WORTHY_QLS = new Set([
  "INT-QL-069",
  "INT-QL-071",
  "INT-QL-075",
  "INT-QL-076",
  "INT-QL-078",
  "INT-QL-081",
  "INT-QL-082",
  "INT-QL-083",
  "INT-QL-084",
  "INT-QL-085",
]);

function yearsText(years: number): string {
  return `${years} year${years === 1 ? "" : "s"}`;
}

function brokenDuration(state: Cp004MathematicalState): string {
  return `${yearsText(state.fullYears)} and ${state.tailMonths} months`;
}

function naturalTimeGrammar(text: string): string {
  return text
    .replace(/\bthe first 1 year\b/giu, "the first year")
    .replace(/\bfor the first 1 year\b/giu, "for the first year")
    .replace(/\bduring the first 1 year\b/giu, "during the first year")
    .replace(/\bthe next 1 year\b/giu, "the next year")
    .replace(/\bfor the next 1 year\b/giu, "for the next year")
    .replace(/\bduring the next 1 year\b/giu, "during the next year")
    .replace(/\bthe first year are\b/giu, "the first year is")
    .replace(/\b1 complete year\b/giu, "1 year")
    .replace(/\b(\d+) complete years\b/giu, "$1 years")
    .replace(/\b1 complete period\b/giu, "1 period")
    .replace(/\b(\d+) complete periods\b/giu, "$1 periods")
    .replace(/\bextra months\b/giu, "remaining months")
    .replace(/\bfor the complete years\b/giu, "for those years")
    .replace(/\bafter the complete years\b/giu, "after those years");
}

function proseInsteadOfTable(state: Cp004MathematicalState): string {
  const principal = moneyText(state.principal);
  const rate = percentText(state.nominalAnnualRatePercent);
  const amount = completeAmountForState(state);
  const amountText = moneyText(amount);
  const interestText = moneyText(sub(amount, state.principal));
  const schedule = frequencyLabel(state.frequency);
  const duration = durationText(state.periods, state.frequency);

  switch (state.qlId) {
    case "INT-QL-067":
      return `Find the amount on ${principal} after ${duration} at ${rate} per annum when interest is compounded ${schedule}.`;
    case "INT-QL-068":
      return `Find the compound interest on ${principal} after ${duration} at ${rate} per annum when interest is compounded ${schedule}.`;
    case "INT-QL-070":
      return `A sum earns ${interestText} as compound interest in ${duration} at ${rate} per annum, compounded ${schedule}. Find the original sum.`;
    case "INT-QL-072":
      return `${principal} amounts to ${amountText} at ${rate} per annum with ${schedule} compounding. Find the time required.`;
    case "INT-QL-073":
      return `${principal} is compounded at ${percentText(state.periodicRatePercent)} per ${frequencyNoun(state.frequency)} for ${duration}. Find the amount.`;
    case "INT-QL-074":
      return `${principal} is compounded at ${percentText(state.periodicRatePercent)} per ${frequencyNoun(state.frequency)} for ${duration}. Find the compound interest.`;
    case "INT-QL-077":
      return `The effective annual rate is ${percentText(effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency))} with ${schedule} compounding. Find the nominal annual rate.`;
    case "INT-QL-079":
      return `${principal} is invested at ${rate} per annum for ${brokenDuration(state)}. Interest is compounded annually for ${yearsText(state.fullYears)}, then simple interest is applied for the remaining ${state.tailMonths} months on the balance at that point. Find the amount.`;
    case "INT-QL-080":
      return `${principal} is invested at ${rate} per annum for ${brokenDuration(state)}. Interest is compounded annually for ${yearsText(state.fullYears)}, then simple interest is applied for the remaining ${state.tailMonths} months on the balance at that point. Find the total interest.`;
    default:
      return naturalTimeGrammar("Find the required value from the stated information.");
  }
}

function polishRemainingProse(state: Cp004MathematicalState, stem: string): string {
  if (state.qlId === "INT-QL-076" && stem.startsWith("Find the actual one-year percentage increase")) {
    return `A nominal annual rate of ${percentText(state.nominalAnnualRatePercent)} is compounded ${frequencyLabel(state.frequency)}. By what percentage does the investment actually grow in one year? Give the answer to two decimal places.`;
  }

  if (state.qlId === "INT-QL-083") {
    const principal = moneyText(state.principal);
    const amount = moneyText(brokenAmountForState(state));
    const rate = percentText(state.nominalAnnualRatePercent);
    if (stem.includes("whole number of years plus")) {
      return `A sum of ${principal} is invested at ${rate} per annum and becomes ${amount} after some years and ${state.tailMonths} months. Interest is compounded annually for the years, and simple interest is used for the final ${state.tailMonths} months. Find the number of years.`;
    }
    if (stem.startsWith("After how many years")) {
      return `${principal} is invested at ${rate} per annum. For how many years should interest be compounded annually, followed by simple interest for ${state.tailMonths} months, so that the amount becomes ${amount}?`;
    }
    if (stem.includes("finally becomes")) {
      return `${principal} is invested at ${rate} per annum and becomes ${amount}. Interest is compounded annually for some years and then simple interest is applied for the final ${state.tailMonths} months. Find the number of years of annual compounding.`;
    }
  }

  if ((state.qlId === "INT-QL-084" || state.qlId === "INT-QL-085") && stem.startsWith("On ₹")) {
    const principal = moneyText(state.principal);
    const rate = percentText(state.nominalAnnualRatePercent);
    const first = frequencyLabel(state.firstFrequency);
    const second = frequencyLabel(state.secondFrequency);
    const request = state.qlId === "INT-QL-084" ? "amount after 2 years" : "total compound interest after 2 years";
    return `${principal} is invested at ${rate} per annum. Interest is compounded ${first} in the first year and ${second} in the second year. Find the ${request}.`;
  }

  return stem;
}

export function finalizeCp004PresentationLanguageV5(
  state: Cp004MathematicalState,
  presentation: Presentation,
): Presentation {
  if (presentation.representation === "TERMS_TABLE" && !TABLE_WORTHY_QLS.has(state.qlId)) {
    return deepFreeze({
      ...presentation,
      representation: "STANDARD_PROSE",
      stem: naturalTimeGrammar(proseInsteadOfTable(state)),
    });
  }
  const natural = naturalTimeGrammar(presentation.stem);
  const stem = presentation.representation === "STANDARD_PROSE" ? polishRemainingProse(state, natural) : natural;
  return stem === presentation.stem ? presentation : deepFreeze({ ...presentation, stem });
}
