import {
  FREQUENCIES, absRational, add, brokenAmountForState, completeAmountForState, completeAmountFromNominal, deepFreeze,
  div, effectiveAnnualRate, mixedAmountForState, mul, periodicAmountForState, periodicRate, rat, registryEntry, sub,
  type Cp004Explanation, type Cp004MathematicalState,
} from "./cp004-frequency-math";
import { decimal, durationText, frequencyNoun, frequencyScheduleLabel, interestTimesPerYear, moneyText, percentText, rateStep, repeatedAmountSteps } from "./cp004-frequency-options";

export function explanationFor(state: Cp004MathematicalState, correctAnswer: string): Cp004Explanation {
  const entry = registryEntry(state.qlId);
  const completeAmount = completeAmountForState(state);
  const periodRate = periodicRate(state.nominalAnnualRatePercent, state.frequency);
  const brokenAmount = brokenAmountForState(state);
  const afterWholeYears = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, 1, state.fullYears);
  const tailInterest = sub(brokenAmount, afterWholeYears);
  const mixedAmount = mixedAmountForState(state);
  let whatAsked = "We need to find the required value from the stated compounding schedule.";
  let steps: readonly string[] = [];
  let commonMistake = "Do not use the annual rate directly when interest is added more than once a year.";

  switch (state.qlId) {
    case "INT-QL-067":
    case "INT-QL-068": {
      whatAsked = state.qlId === "INT-QL-067" ? "We need to find the amount after all the stated compounding periods." : "We need to find only the compound interest, not the final amount.";
      const working = repeatedAmountSteps(state.principal, periodRate, state.periods);
      steps = state.qlId === "INT-QL-067"
        ? Object.freeze([rateStep(state), ...working])
        : Object.freeze([rateStep(state), ...working, `Compound interest = final amount − principal = ${moneyText(completeAmount)} − ${moneyText(state.principal)} = ${moneyText(sub(completeAmount, state.principal))}.`]);
      commonMistake = state.qlId === "INT-QL-068" ? "The amount includes the principal. Subtract the principal before choosing the interest answer." : commonMistake;
      break;
    }
    case "INT-QL-069":
    case "INT-QL-070": {
      const observed = state.qlId === "INT-QL-069" ? completeAmount : sub(completeAmount, state.principal);
      const finalAmount = state.qlId === "INT-QL-069" ? observed : add(observed, state.principal);
      whatAsked = "We need to find the original principal by working backwards from the given interest or amount.";
      if (state.qlId === "INT-QL-069") {
        const increaseOnOneRupee = div(finalAmount, state.principal);
        steps = Object.freeze([
          `The final amount given is ${moneyText(finalAmount)}.`,
          rateStep(state),
          `After ${state.periods} periods, every ₹1 becomes ₹${decimal(increaseOnOneRupee, 6)}.`,
          `Principal = ${moneyText(finalAmount)} ÷ ${decimal(increaseOnOneRupee, 6)} = ${moneyText(state.principal)}.`,
          `Check: ${moneyText(state.principal)} under the stated schedule becomes ${moneyText(finalAmount)}.`,
        ]);
      } else {
        const interestOnOneRupee = div(observed, state.principal);
        steps = Object.freeze([
          `The compound interest given is ${moneyText(observed)}.`,
          rateStep(state),
          `Over ${state.periods} periods, every ₹1 of principal earns ₹${decimal(interestOnOneRupee, 6)} as compound interest.`,
          `Principal = ${moneyText(observed)} ÷ ${decimal(interestOnOneRupee, 6)} = ${moneyText(state.principal)}.`,
          `Check: this principal earns ${moneyText(observed)} under the stated schedule.`,
        ]);
      }
      commonMistake = "Do not subtract a total percentage from the final amount. Compound interest must be removed period by period.";
      break;
    }
    case "INT-QL-071": {
      whatAsked = "We need to find the annual rate quoted for the scheme.";
      steps = Object.freeze([
        `Compare the final amount with the principal: ${moneyText(completeAmount)} ÷ ${moneyText(state.principal)} = ${decimal(div(completeAmount, state.principal), 4)}.`,
        `This increase happened over ${state.periods} ${frequencyNoun(state.frequency)}${state.periods === 1 ? "" : "s"}. The exact rate that reproduces the amount is ${percentText(periodRate)} for each period.`,
        `There are ${state.frequency} such periods in one year, so annual rate = ${percentText(periodRate)} × ${state.frequency} = ${percentText(state.nominalAnnualRatePercent)}.`,
        `Checking this rate for all ${state.periods} periods gives ${moneyText(completeAmount)}, matching the question.`,
      ]);
      commonMistake = "The rate found for one half-year, quarter or month is not yet the annual rate.";
      break;
    }
    case "INT-QL-072": {
      whatAsked = "We need to find how long the money was invested.";
      steps = Object.freeze([
        rateStep(state),
        `Starting from ${moneyText(state.principal)}, apply ${percentText(periodRate)} repeatedly until the balance becomes ${moneyText(completeAmount)}.`,
        `The stated amount is reached after ${state.periods} periods.`,
        `${state.periods} ${frequencyNoun(state.frequency)}${state.periods === 1 ? "" : "s"} = ${durationText(state.periods, state.frequency)}.`,
      ]);
      commonMistake = "Count the actual half-years, quarters or months first; do not treat each one as a full year.";
      break;
    }
    case "INT-QL-073":
    case "INT-QL-074": {
      const amount = periodicAmountForState(state);
      whatAsked = state.qlId === "INT-QL-073" ? "We need to find the final amount using the rate stated for each period." : "We need to find the interest earned over all the stated periods.";
      const working = repeatedAmountSteps(state.principal, state.periodicRatePercent, state.periods);
      steps = state.qlId === "INT-QL-073"
        ? Object.freeze([`The rate ${percentText(state.periodicRatePercent)} is already the rate for one period, so it must not be divided again.`, ...working])
        : Object.freeze([`The rate ${percentText(state.periodicRatePercent)} is already the rate for one period, so it must not be divided again.`, ...working, `Interest = ${moneyText(amount)} − ${moneyText(state.principal)} = ${moneyText(sub(amount, state.principal))}.`]);
      commonMistake = "Do not divide a rate that is already stated for each half-year, quarter or month.";
      break;
    }
    case "INT-QL-075": {
      const firstAmount = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.frequency, state.frequency * state.years);
      const secondAmount = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.comparisonFrequency, state.comparisonFrequency * state.years);
      whatAsked = "We need to find how much extra one compounding schedule produces.";
      const firstRate = periodicRate(state.nominalAnnualRatePercent, state.frequency);
      const secondRate = periodicRate(state.nominalAnnualRatePercent, state.comparisonFrequency);
      steps = Object.freeze([
        `For ${frequencyScheduleLabel(state.frequency)} compounding, the rate used each time is ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.frequency} = ${percentText(firstRate)}, and it is applied ${state.frequency * state.years} times. The amount is ${moneyText(firstAmount)}.`,
        `For ${frequencyScheduleLabel(state.comparisonFrequency)} compounding, the rate used each time is ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.comparisonFrequency} = ${percentText(secondRate)}, and it is applied ${state.comparisonFrequency * state.years} times. The amount is ${moneyText(secondAmount)}.`,
        `Now compare the two maturity amounts: ${moneyText(firstAmount)} and ${moneyText(secondAmount)}.`,
        `Difference = larger amount − smaller amount = ${moneyText(absRational(sub(firstAmount, secondAmount)))}.`,
      ]);
      commonMistake = "Do not compare the quoted yearly rates alone; both schemes quote the same rate but add interest at different times.";
      break;
    }
    case "INT-QL-076": {
      const oneYearAmount = completeAmountFromNominal(rat(100), state.nominalAnnualRatePercent, state.frequency, state.frequency);
      whatAsked = "We need to find the actual percentage increase during one complete year.";
      steps = Object.freeze([
        rateStep(state),
        `Take ₹100 as the starting amount. After one year it becomes ${moneyText(oneYearAmount)}.`,
        `Actual increase = ${moneyText(oneYearAmount)} − ₹100 = ${moneyText(sub(oneYearAmount, rat(100)))}.`,
        `Therefore, the effective annual rate, correct to two decimal places, is ${percentText(effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency))}.`,
      ]);
      commonMistake = "The quoted annual rate and the actual one-year increase are not the same when interest is added more than once.";
      break;
    }
    case "INT-QL-077": {
      const effective = effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency);
      whatAsked = "We need to find the annual rate quoted by the scheme.";
      const afterFirstPeriod = add(rat(100), mul(rat(100), div(periodRate, rat(100))));
      const afterOneYear = completeAmountFromNominal(rat(100), state.nominalAnnualRatePercent, state.frequency, state.frequency);
      steps = Object.freeze([
        `The effective rate ${percentText(effective)} means ₹100 becomes ${moneyText(add(rat(100), effective))} after one year.`,
        `Test ${percentText(state.nominalAnnualRatePercent)} from the options. Since interest is added ${interestTimesPerYear(state.frequency)}, the rate for one period is ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.frequency} = ${percentText(periodRate)}.`,
        `After the first period, ₹100 becomes ${moneyText(afterFirstPeriod)}. After the remaining period${state.frequency === 2 ? "" : "s"}, it becomes ${moneyText(afterOneYear)}.`,
        `${moneyText(afterOneYear)} is an increase of ${percentText(effective)} on ₹100, so the quoted annual rate is ${percentText(state.nominalAnnualRatePercent)}.`,
      ]);
      commonMistake = "Do not multiply the effective rate by the number of periods. First find the rate used in one period.";
      break;
    }
    case "INT-QL-078": {
      whatAsked = "We need to find how often interest is added in one year.";
      steps = Object.freeze([
        `The principal is ${moneyText(state.principal)}, the quoted annual rate is ${percentText(state.nominalAnnualRatePercent)}, and the stated amount is ${moneyText(completeAmount)}.`,
        ...FREQUENCIES.map((frequency) => `With ${frequencyScheduleLabel(frequency)} compounding, the amount after ${state.years} year${state.years === 1 ? "" : "s"} = ${moneyText(completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, frequency, frequency * state.years))}.`),
        `Only ${frequencyScheduleLabel(state.frequency)} compounding gives ${moneyText(completeAmount)}, so interest is added ${interestTimesPerYear(state.frequency)}.`,
      ]);
      commonMistake = "Do not decide from the annual rate alone; use the final amount to test the schedule.";
      break;
    }
    case "INT-QL-079":
    case "INT-QL-080": {
      whatAsked = state.qlId === "INT-QL-079" ? "We need to find the final amount after the complete years and the extra months." : "We need to find only the interest earned over the full broken duration.";
      steps = Object.freeze([
        `First compound for ${state.fullYears} complete year${state.fullYears === 1 ? "" : "s"}: ${moneyText(state.principal)} becomes ${moneyText(afterWholeYears)}.`,
        `For the remaining ${state.tailMonths} months, the question specifically says to use simple interest on ${moneyText(afterWholeYears)}.`,
        `Tail interest = ${moneyText(afterWholeYears)} × ${percentText(state.nominalAnnualRatePercent)} × ${state.tailMonths}/12 = ${moneyText(tailInterest)}.`,
        `Final amount = ${moneyText(afterWholeYears)} + ${moneyText(tailInterest)} = ${moneyText(brokenAmount)}.`,
        ...(state.qlId === "INT-QL-080" ? [`Compound interest = ${moneyText(brokenAmount)} − ${moneyText(state.principal)} = ${moneyText(sub(brokenAmount, state.principal))}.`] : []),
      ]);
      commonMistake = "Do not guess monthly compounding for the extra months. The stem explicitly says to use simple interest for that part.";
      break;
    }
    case "INT-QL-081": {
      whatAsked = "We need to find the original principal from the final broken-period amount.";
      steps = Object.freeze([
        `Using the stated rule for the complete years and the extra ${state.tailMonths} months, every ₹1 of the starting sum becomes ₹${decimal(div(brokenAmount, state.principal), 5)}.`,
        `The final amount is ${moneyText(brokenAmount)}, so divide it by ${decimal(div(brokenAmount, state.principal), 5)} to recover the starting sum.`,
        `Principal = ${moneyText(brokenAmount)} ÷ ${decimal(div(brokenAmount, state.principal), 5)} = ${moneyText(state.principal)}.`,
        `Checking forward with ${moneyText(state.principal)} gives ${moneyText(brokenAmount)}, so the original sum is correct.`,
      ]);
      commonMistake = "Do not remove only the complete-year interest; the simple-interest tail must also be removed.";
      break;
    }
    case "INT-QL-082": {
      whatAsked = "We need to find the annual rate that produces the stated broken-period amount.";
      steps = Object.freeze([
        `The principal is ${moneyText(state.principal)} and the final amount is ${moneyText(brokenAmount)}.`,
        `Test the rate options using the stated rule: compound for ${state.fullYears} complete year${state.fullYears === 1 ? "" : "s"}, then use simple interest for ${state.tailMonths} months.`,
        `At ${percentText(state.nominalAnnualRatePercent)}, the amount after the complete years is ${moneyText(afterWholeYears)}.`,
        `The extra-month interest is ${moneyText(tailInterest)}, so the final amount is ${moneyText(afterWholeYears)} + ${moneyText(tailInterest)} = ${moneyText(brokenAmount)}.`,
      ]);
      commonMistake = "A single simple-interest calculation for the whole duration does not follow the convention stated in the question.";
      break;
    }
    case "INT-QL-083": {
      whatAsked = "We need to find the number of complete years before the stated extra months.";
      steps = Object.freeze([
        `The final amount is ${moneyText(brokenAmount)} and the extra ${state.tailMonths} months use simple interest.`,
        `Apply the annual compound increase year by year from ${moneyText(state.principal)}.`,
        `After ${state.fullYears} complete year${state.fullYears === 1 ? "" : "s"}: balance = ${moneyText(afterWholeYears)}.`,
        `Adding simple interest for ${state.tailMonths} months gives ${moneyText(brokenAmount)}, matching the question.`,
      ]);
      commonMistake = "Do not count the extra months as another complete year.";
      break;
    }
    case "INT-QL-084":
    case "INT-QL-085": {
      const afterFirst = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.firstFrequency, state.firstFrequency * state.firstYears);
      whatAsked = state.qlId === "INT-QL-084" ? "We need to find the final amount when the compounding schedule changes." : "We need to find the interest earned when the compounding schedule changes.";
      const firstPeriodRate = periodicRate(state.nominalAnnualRatePercent, state.firstFrequency);
      const secondPeriodRate = periodicRate(state.nominalAnnualRatePercent, state.secondFrequency);
      steps = Object.freeze([
        `For the first ${state.firstYears} year${state.firstYears === 1 ? "" : "s"}, the rate used each time is ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.firstFrequency} = ${percentText(firstPeriodRate)}.`,
        `After that first interval, the balance = ${moneyText(afterFirst)}.`,
        `For the next ${state.secondYears} year${state.secondYears === 1 ? "" : "s"}, the rate used each time is ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.secondFrequency} = ${percentText(secondPeriodRate)}.`,
        `Applying the second schedule to ${moneyText(afterFirst)} gives the final amount ${moneyText(mixedAmount)}.`,
        ...(state.qlId === "INT-QL-085" ? [`Interest = ${moneyText(mixedAmount)} − ${moneyText(state.principal)} = ${moneyText(sub(mixedAmount, state.principal))}.`] : []),
      ]);
      commonMistake = "Do not use one frequency for the whole duration. Change the calculation exactly where the stem changes the schedule.";
      break;
    }
  }
  return deepFreeze({ whatAsked, steps, finalAnswer: `Therefore, the answer is ${correctAnswer}.`, commonMistake });
}
