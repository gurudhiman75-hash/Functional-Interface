import {
  brokenAmountForState, completeAmountForState, effectiveAnnualRate, sub,
  type Cp004MathematicalState, type Cp004Representation,
} from "./cp004-frequency-math";
import {
  durationText, frequencyLabel, frequencyNoun, frequencyScheduleLabel, interestTimesPerYear,
  moneyText, percentText,
} from "./cp004-frequency-options";

function proseStem(state: Cp004MathematicalState, frame: 1 | 2 | 3): string {
  const amount = completeAmountForState(state);
  const ci = sub(amount, state.principal);
  const brokenAmount = brokenAmountForState(state);
  const rate = percentText(state.nominalAnnualRatePercent);
  const periodRate = percentText(state.periodicRatePercent);
  const duration = durationText(state.periods, state.frequency);
  const schedule = frequencyLabel(state.frequency);
  const original = moneyText(state.principal);
  const finalAmount = moneyText(amount);
  const compoundInterest = moneyText({ numerator: ci.numerator, denominator: ci.denominator });
  const brokenFinal = moneyText(brokenAmount);
  const yearText = `${state.years} year${state.years === 1 ? "" : "s"}`;
  const fullYearText = `${state.fullYears} complete year${state.fullYears === 1 ? "" : "s"}`;
  const firstInterval = `${state.firstYears} year${state.firstYears === 1 ? "" : "s"}`;
  const secondInterval = `${state.secondYears} year${state.secondYears === 1 ? "" : "s"}`;
  const firstSchedule = frequencyLabel(state.firstFrequency);
  const secondSchedule = frequencyLabel(state.secondFrequency);

  switch (state.qlId) {
    case "INT-QL-067": return [
      `A sum of ${original} is invested at ${rate} per annum, compounded ${schedule}, for ${duration}. Find the amount.`,
      `The balance of an investment is ${original} at the start. Interest is added ${interestTimesPerYear(state.frequency)} at ${rate} per annum. What will the balance be after ${duration}?`,
      `Under a ${frequencyScheduleLabel(state.frequency)} compounding scheme, ${original} is kept for ${duration} at ${rate} per annum. Find its maturity amount.`,
    ][frame - 1]!;
    case "INT-QL-068": return [
      `Find the compound interest on ${original} at ${rate} per annum for ${duration}, when interest is compounded ${schedule}.`,
      `An investment starts with ${original}. It earns ${rate} per annum, with interest added ${interestTimesPerYear(state.frequency)}, for ${duration}. How much interest is earned?`,
      `${original} is placed in a ${frequencyScheduleLabel(state.frequency)} compounding scheme at ${rate} per annum for ${duration}. Find the interest included in the maturity value.`,
    ][frame - 1]!;
    case "INT-QL-069": return [
      `A sum amounts to ${finalAmount} in ${duration} at ${rate} per annum, compounded ${schedule}. Find the original sum.`,
      `An investment record shows a closing balance of ${finalAmount} after ${duration}. Interest was added ${interestTimesPerYear(state.frequency)} at ${rate} per annum. What was the opening balance?`,
      `The maturity value under a ${frequencyScheduleLabel(state.frequency)} compounding scheme is ${finalAmount}. The annual rate is ${rate} and the term is ${duration}. Find the amount invested initially.`,
    ][frame - 1]!;
    case "INT-QL-070": return [
      `The compound interest earned in ${duration} is ${compoundInterest} at ${rate} per annum, compounded ${schedule}. Find the principal.`,
      `An account earns ${compoundInterest} as compound interest over ${duration}. Interest is added ${interestTimesPerYear(state.frequency)} at ${rate} per annum. Find its starting balance.`,
      `Under a ${schedule} compounding scheme at ${rate} per annum, the interest after ${duration} is ${compoundInterest}. Determine the original sum.`,
    ][frame - 1]!;
    case "INT-QL-071": return [
      `${original} amounts to ${finalAmount} in ${duration} when interest is compounded ${schedule}. Find the annual rate.`,
      `A balance grows from ${original} to ${finalAmount} over ${duration}, with interest added ${interestTimesPerYear(state.frequency)}. What annual rate was charged?`,
      `A ${frequencyScheduleLabel(state.frequency)} compounding scheme turns ${original} into ${finalAmount} in ${duration}. Find the quoted annual rate.`,
    ][frame - 1]!;
    case "INT-QL-072": return [
      `${original} amounts to ${finalAmount} at ${rate} per annum, compounded ${schedule}. Find the time.`,
      `An account starts with ${original} and reaches ${finalAmount}. Interest is added ${interestTimesPerYear(state.frequency)} at ${rate} per annum. How long was the money invested?`,
      `Under a ${frequencyScheduleLabel(state.frequency)} compounding scheme at ${rate} per annum, ${original} becomes ${finalAmount}. Find the investment period.`,
    ][frame - 1]!;
    case "INT-QL-073": return [
      `A sum of ${original} earns ${periodRate} in every ${frequencyNoun(state.frequency)} for ${state.periods} such periods. Find the amount.`,
      `The opening balance is ${original}. At the end of each ${frequencyNoun(state.frequency)}, ${periodRate} interest is added. Find the balance after ${state.periods} periods.`,
      `An investment pays ${periodRate} per ${frequencyNoun(state.frequency)} and remains invested for ${state.periods} complete periods. Find its maturity value.`,
    ][frame - 1]!;
    case "INT-QL-074": return [
      `A sum of ${original} earns ${periodRate} in every ${frequencyNoun(state.frequency)} for ${state.periods} such periods. Find the compound interest.`,
      `The opening balance is ${original}. Interest of ${periodRate} is added after each ${frequencyNoun(state.frequency)} for ${state.periods} periods. How much interest is earned altogether?`,
      `An investment pays ${periodRate} per ${frequencyNoun(state.frequency)} and runs for ${state.periods} complete periods. Find only the interest earned.`,
    ][frame - 1]!;
    case "INT-QL-075": return [
      `The same sum of ${original} is invested for ${yearText} at ${rate} per annum under ${frequencyScheduleLabel(state.frequency)} and ${frequencyScheduleLabel(state.comparisonFrequency)} compounding. Find the difference between the two amounts.`,
      `Two schemes accept ${original} for ${yearText} at the same annual rate of ${rate}. One adds interest ${interestTimesPerYear(state.frequency)} and the other ${interestTimesPerYear(state.comparisonFrequency)}. How much do their maturity amounts differ?`,
      `${original} is placed in two compound-interest plans for ${yearText}. Both quote ${rate} per annum, but one compounds ${frequencyLabel(state.frequency)} and the other ${frequencyLabel(state.comparisonFrequency)}. Find the excess amount produced by the better plan.`,
    ][frame - 1]!;
    case "INT-QL-076": return [
      `A scheme quotes ${rate} per annum and adds interest ${interestTimesPerYear(state.frequency)}. Find the effective annual rate, correct to two decimal places.`,
      `Interest is credited ${interestTimesPerYear(state.frequency)} under a plan quoting ${rate} per annum. What is the actual percentage increase in one year, correct to two decimal places?`,
      `A compound-interest plan has a nominal annual rate of ${rate} with ${schedule} compounding. Find the one-year effective rate, correct to two decimal places.`,
    ][frame - 1]!;
    case "INT-QL-077": {
      const effectiveValue = effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency);
      const effective = percentText(effectiveValue);
      return [
        `The effective annual rate is ${effective} when interest is added ${interestTimesPerYear(state.frequency)}. Find the nominal annual rate.`,
        `A plan increases ₹100 to ${moneyText({ numerator: 100n * effectiveValue.denominator + effectiveValue.numerator, denominator: effectiveValue.denominator })} in one year and credits interest ${interestTimesPerYear(state.frequency)}. Find its quoted annual rate.`,
        `The actual one-year return of a ${schedule} compounding scheme is ${effective}. Determine the nominal rate stated per annum.`,
      ][frame - 1]!;
    }
    case "INT-QL-078": return [
      `${original} amounts to ${finalAmount} in ${yearText} at a nominal rate of ${rate} per annum. Interest is added annually, half-yearly, quarterly or monthly. Which schedule was used?`,
      `An account grows from ${original} to ${finalAmount} in ${yearText} at a quoted rate of ${rate} per annum. Identify how often interest was added.`,
      `A compound-interest plan produces ${finalAmount} from ${original} in ${yearText} at ${rate} per annum. Was the compounding annual, half-yearly, quarterly or monthly?`,
    ][frame - 1]!;
    case "INT-QL-079": return [
      `A sum of ${original} is invested at ${rate} per annum for ${fullYearText} and ${state.tailMonths} more months. Interest is compounded annually for the complete years and simple interest is used for the remaining months. Find the amount.`,
      `After ${fullYearText}, an investment of ${original} continues for another ${state.tailMonths} months. The complete years earn annual compound interest at ${rate}; the extra months earn simple interest on the latest balance. Find the final amount.`,
      `A scheme keeps ${original} at ${rate} per annum for ${fullYearText} plus ${state.tailMonths} months. It compounds the complete years and uses simple interest for the last ${state.tailMonths} months. Determine the maturity value.`,
    ][frame - 1]!;
    case "INT-QL-080": return [
      `A sum of ${original} is invested at ${rate} per annum for ${fullYearText} and ${state.tailMonths} more months. Interest is compounded annually for the complete years and simple interest is used for the remaining months. Find the compound interest.`,
      `An investment of ${original} runs for ${fullYearText} and another ${state.tailMonths} months at ${rate} per annum. Annual compounding applies to the complete years and simple interest to the extra months. How much interest is earned in total?`,
      `A scheme compounds ${original} annually for ${fullYearText}, then gives simple interest for ${state.tailMonths} months, all at ${rate} per annum. Find only the interest included in the final value.`,
    ][frame - 1]!;
    case "INT-QL-081": return [
      `An investment amounts to ${brokenFinal} at ${rate} per annum after ${fullYearText} and ${state.tailMonths} more months. Interest is compounded annually for the complete years and simple interest is used for the remaining months. Find the principal.`,
      `A maturity record shows ${brokenFinal} after ${fullYearText} plus ${state.tailMonths} months. The rate was ${rate}; complete years were compounded annually and the final months used simple interest. What was the opening sum?`,
      `Under a scheme that compounds complete years and uses simple interest for the final ${state.tailMonths} months, the maturity amount is ${brokenFinal}. The annual rate is ${rate} and the complete term is ${fullYearText}. Find the original investment.`,
    ][frame - 1]!;
    case "INT-QL-082": return [
      `${original} amounts to ${brokenFinal} after ${fullYearText} and ${state.tailMonths} more months. Interest is compounded annually for the complete years and simple interest is used for the remaining months. Find the annual rate.`,
      `An account grows from ${original} to ${brokenFinal} over ${fullYearText} plus ${state.tailMonths} months. Complete years are compounded annually, while the last months use simple interest. Determine the yearly rate.`,
      `A broken-period scheme turns ${original} into ${brokenFinal}. It compounds for ${fullYearText} and then uses simple interest for ${state.tailMonths} months. Find the annual rate charged throughout.`,
    ][frame - 1]!;
    case "INT-QL-083": return [
      `${original} amounts to ${brokenFinal} at ${rate} per annum after some complete years and ${state.tailMonths} more months. Interest is compounded annually for the complete years and simple interest is used for the remaining months. Find the number of complete years.`,
      `An account starting with ${original} reaches ${brokenFinal} at ${rate} per annum. After an unknown number of annually compounded years, simple interest is applied for ${state.tailMonths} months. How many complete years were there?`,
      `A broken-period investment has principal ${original}, maturity value ${brokenFinal} and annual rate ${rate}. The last ${state.tailMonths} months use simple interest. Determine the number of complete compound-interest years before them.`,
    ][frame - 1]!;
    case "INT-QL-084": return [
      `${original} is invested at ${rate} per annum. Interest is compounded ${firstSchedule} for the first ${firstInterval}, then ${secondSchedule} for the next ${secondInterval}. Find the amount.`,
      `An investment starts at ${original}. For ${firstInterval}, interest at ${rate} per annum is added ${interestTimesPerYear(state.firstFrequency)}; for the following ${secondInterval}, it is added ${interestTimesPerYear(state.secondFrequency)}. Find the closing balance.`,
      `A compound-interest scheme changes its schedule: ${firstSchedule} compounding for ${firstInterval}, followed by ${secondSchedule} compounding for ${secondInterval}, at ${rate} per annum throughout. Find the maturity amount on ${original}.`,
    ][frame - 1]!;
    case "INT-QL-085": return [
      `${original} is invested at ${rate} per annum. Interest is compounded ${firstSchedule} for the first ${firstInterval}, then ${secondSchedule} for the next ${secondInterval}. Find the compound interest.`,
      `An investment of ${original} earns ${rate} per annum. Interest is added ${interestTimesPerYear(state.firstFrequency)} for ${firstInterval} and ${interestTimesPerYear(state.secondFrequency)} for the following ${secondInterval}. How much interest is earned altogether?`,
      `A compound-interest plan changes from ${firstSchedule} compounding for ${firstInterval} to ${secondSchedule} compounding for ${secondInterval}. At ${rate} per annum on ${original}, find only the interest in the maturity value.`,
    ][frame - 1]!;
  }
}

export function hardenCp004Presentation(
  state: Cp004MathematicalState,
  original: Readonly<{ representation: Cp004Representation; stemFamilyId: string; stem: string }>,
): Readonly<{ representation: Cp004Representation; stemFamilyId: string; stem: string }> {
  const match = original.stemFamilyId.match(/FRAME-(\d)$/u);
  const frame = Number(match?.[1] ?? 1);
  if (frame <= 1) return original;
  const proseFrame = (frame - 1) as 1 | 2 | 3;
  const representation: Cp004Representation = frame === 2 ? "STANDARD_PROSE" : frame === 3 ? "BALANCE_RECORD" : "SCHEME_COMPARISON";
  return Object.freeze({
    representation,
    stemFamilyId: original.stemFamilyId,
    stem: proseStem(state, proseFrame),
  });
}
