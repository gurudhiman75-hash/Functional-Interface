import {
  FREQUENCIES, absRational, add, brokenAmountForState, completeAmountForState, completeAmountFromNominal, deepFreeze,
  div, effectiveAnnualRate, mixedAmountForState, mul, periodicAmountForState, periodicRate, rat, registryEntry, sub,
  type Cp004Explanation, type Cp004MathematicalState,
} from "./cp004-frequency-math";
import {
  decimal, durationText, frequencyNoun, frequencyScheduleLabel, interestTimesPerYear, moneyText, percentText,
  rateStep, rationalText, repeatedAmountSteps,
} from "./cp004-frequency-options";

function periodCountText(state: Cp004MathematicalState): string {
  return `${state.periods} ${frequencyNoun(state.frequency)}${state.periods === 1 ? "" : "s"}`;
}

function exactRatioStep(label: string, numerator: ReturnType<typeof rat>, denominator: ReturnType<typeof rat>): string {
  const ratio = div(numerator, denominator);
  return `${label} = ${moneyText(numerator)} ÷ ${moneyText(denominator)} = ${rationalText(ratio)} (approximately ${decimal(ratio, 6)}).`;
}

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
      whatAsked = state.qlId === "INT-QL-067"
        ? "We need to find the amount after all the stated compounding periods."
        : "We need to find only the compound interest, not the final amount.";
      const working = repeatedAmountSteps(state.principal, periodRate, state.periods);
      steps = state.qlId === "INT-QL-067"
        ? Object.freeze([rateStep(state), ...working])
        : Object.freeze([
          rateStep(state),
          ...working,
          `Compound interest = final amount − principal = ${moneyText(completeAmount)} − ${moneyText(state.principal)} = ${moneyText(sub(completeAmount, state.principal))}.`,
        ]);
      commonMistake = state.qlId === "INT-QL-068"
        ? "The amount includes the principal. Subtract the principal before choosing the interest answer."
        : commonMistake;
      break;
    }

    case "INT-QL-069": {
      const amountRatio = div(completeAmount, state.principal);
      whatAsked = "We need to find the original principal by removing every compounding period from the final amount.";
      steps = Object.freeze([
        rateStep(state),
        exactRatioStep("Amount ratio A/P", completeAmount, state.principal),
        `The exact amount ratio is ${rationalText(amountRatio)}, so P = A × ${amountRatio.denominator}/${amountRatio.numerator}.`,
        `P = ${moneyText(completeAmount)} × ${amountRatio.denominator}/${amountRatio.numerator} = ${moneyText(state.principal)}.`,
        `Check: compounding ${moneyText(state.principal)} for ${periodCountText(state)} gives ${moneyText(completeAmount)}.`,
      ]);
      commonMistake = "Do not divide by a rounded decimal factor. Use the exact amount ratio or verify the option by compounding forward.";
      break;
    }

    case "INT-QL-070": {
      const compoundInterest = sub(completeAmount, state.principal);
      const interestRatio = div(compoundInterest, state.principal);
      whatAsked = "We need to find the principal from the compound interest earned over all the stated periods.";
      steps = Object.freeze([
        rateStep(state),
        exactRatioStep("Compound-interest ratio CI/P", compoundInterest, state.principal),
        `The exact ratio is ${rationalText(interestRatio)}, so P = CI × ${interestRatio.denominator}/${interestRatio.numerator}.`,
        `P = ${moneyText(compoundInterest)} × ${interestRatio.denominator}/${interestRatio.numerator} = ${moneyText(state.principal)}.`,
        `Check: this principal becomes ${moneyText(completeAmount)}, and ${moneyText(completeAmount)} − ${moneyText(state.principal)} = ${moneyText(compoundInterest)}.`,
      ]);
      commonMistake = "The given compound interest is not the final amount. Do not reverse-compound the interest figure as though it were the maturity value.";
      break;
    }

    case "INT-QL-071": {
      whatAsked = "We need to find the annual rate quoted for the stated compounding schedule.";
      const working = repeatedAmountSteps(state.principal, periodRate, state.periods);
      steps = Object.freeze([
        `The amount must grow from ${moneyText(state.principal)} to ${moneyText(completeAmount)} in ${periodCountText(state)}.`,
        `For the annual-rate option ${percentText(state.nominalAnnualRatePercent)}, the rate per ${frequencyNoun(state.frequency)} is ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.frequency} = ${percentText(periodRate)}.`,
        ...working,
        `This calculation reaches the stated amount ${moneyText(completeAmount)}, so the quoted annual rate is ${percentText(state.nominalAnnualRatePercent)}.`,
      ]);
      commonMistake = "The rate used in one half-year or quarter is not the annual rate; multiply it by the number of periods in a year.";
      break;
    }

    case "INT-QL-072": {
      whatAsked = "We need to find how many compounding periods are required and then convert them into time.";
      const working = repeatedAmountSteps(state.principal, periodRate, state.periods);
      steps = Object.freeze([
        rateStep(state),
        ...working,
        `The balance first reaches ${moneyText(completeAmount)} after ${state.periods} periods.`,
        `${state.periods} ${frequencyNoun(state.frequency)}${state.periods === 1 ? "" : "s"} = ${durationText(state.periods, state.frequency)}.`,
      ]);
      commonMistake = "Count the half-years, quarters or months first; do not label the number of periods directly as years.";
      break;
    }

    case "INT-QL-073":
    case "INT-QL-074": {
      const amount = periodicAmountForState(state);
      whatAsked = state.qlId === "INT-QL-073"
        ? "We need to find the final amount using the rate already stated for each period."
        : "We need to find the interest earned over all the stated periods.";
      const working = repeatedAmountSteps(state.principal, state.periodicRatePercent, state.periods);
      steps = state.qlId === "INT-QL-073"
        ? Object.freeze([`The rate ${percentText(state.periodicRatePercent)} is already the rate for one period, so it must not be divided again.`, ...working])
        : Object.freeze([
          `The rate ${percentText(state.periodicRatePercent)} is already the rate for one period, so it must not be divided again.`,
          ...working,
          `Interest = ${moneyText(amount)} − ${moneyText(state.principal)} = ${moneyText(sub(amount, state.principal))}.`,
        ]);
      commonMistake = "Do not divide a rate that is already stated for each half-year, quarter or month.";
      break;
    }

    case "INT-QL-075": {
      const firstAmount = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.frequency, state.frequency * state.years);
      const secondAmount = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.comparisonFrequency, state.comparisonFrequency * state.years);
      const firstRate = periodicRate(state.nominalAnnualRatePercent, state.frequency);
      const secondRate = periodicRate(state.nominalAnnualRatePercent, state.comparisonFrequency);
      whatAsked = "We need to find the difference between the maturity amounts under the two compounding schedules.";
      steps = Object.freeze([
        `For ${frequencyScheduleLabel(state.frequency)} compounding: rate per period = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.frequency} = ${percentText(firstRate)}, used ${state.frequency * state.years} times. Amount = ${moneyText(firstAmount)}.`,
        `For ${frequencyScheduleLabel(state.comparisonFrequency)} compounding: rate per period = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.comparisonFrequency} = ${percentText(secondRate)}, used ${state.comparisonFrequency * state.years} times. Amount = ${moneyText(secondAmount)}.`,
        `Compare the two maturity amounts: ${moneyText(firstAmount)} and ${moneyText(secondAmount)}.`,
        `Difference = larger amount − smaller amount = ${moneyText(absRational(sub(firstAmount, secondAmount)))}.`,
      ]);
      commonMistake = "The two plans quote the same annual rate, but their maturity amounts differ because interest is credited at different intervals.";
      break;
    }

    case "INT-QL-076": {
      const oneYearAmount = completeAmountFromNominal(rat(100), state.nominalAnnualRatePercent, state.frequency, state.frequency);
      whatAsked = "We need to find the actual percentage increase during one complete year.";
      steps = Object.freeze([
        rateStep(state),
        ...repeatedAmountSteps(rat(100), periodRate, state.frequency),
        `Actual increase on ₹100 = ${moneyText(oneYearAmount)} − ₹100 = ${moneyText(sub(oneYearAmount, rat(100)))}.`,
        `Therefore, the effective annual rate, correct to two decimal places, is ${percentText(effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency))}.`,
      ]);
      commonMistake = "The nominal annual rate and the actual one-year increase are not the same when interest is credited more than once a year.";
      break;
    }

    case "INT-QL-077": {
      const effective = effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency);
      const afterOneYear = completeAmountFromNominal(rat(100), state.nominalAnnualRatePercent, state.frequency, state.frequency);
      whatAsked = "We need to find the quoted annual rate that gives the stated effective one-year return.";
      steps = Object.freeze([
        `An effective rate of ${percentText(effective)} means ₹100 must become ${moneyText(add(rat(100), effective))} after one year.`,
        `For the annual-rate option ${percentText(state.nominalAnnualRatePercent)}, rate per period = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.frequency} = ${percentText(periodRate)}.`,
        ...repeatedAmountSteps(rat(100), periodRate, state.frequency),
        `${moneyText(afterOneYear)} is an increase of ${percentText(effective)} on ₹100, so the quoted nominal annual rate is ${percentText(state.nominalAnnualRatePercent)}.`,
      ]);
      commonMistake = "Do not multiply the effective rate by the number of periods. Verify a nominal-rate option after converting it to the rate used each period.";
      break;
    }

    case "INT-QL-078": {
      whatAsked = "We need to find which compounding schedule produces the stated final amount.";
      steps = Object.freeze([
        `The principal is ${moneyText(state.principal)}, the nominal annual rate is ${percentText(state.nominalAnnualRatePercent)}, and the target amount is ${moneyText(completeAmount)}.`,
        ...FREQUENCIES.map((frequency) => {
          const amount = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, frequency, frequency * state.years);
          return `${frequencyScheduleLabel(frequency)} compounding: amount = ${moneyText(amount)} after ${state.years} year${state.years === 1 ? "" : "s"}.`;
        }),
        `Only ${frequencyScheduleLabel(state.frequency)} compounding gives ${moneyText(completeAmount)}, so interest is added ${interestTimesPerYear(state.frequency)}.`,
      ]);
      commonMistake = "The annual rate alone cannot identify the schedule; compare the amount produced by each listed frequency.";
      break;
    }

    case "INT-QL-079":
    case "INT-QL-080": {
      whatAsked = state.qlId === "INT-QL-079"
        ? "We need to find the final amount after the complete years and the extra months."
        : "We need to find only the interest earned over the full broken duration.";
      steps = Object.freeze([
        ...repeatedAmountSteps(state.principal, state.nominalAnnualRatePercent, state.fullYears),
        `After ${state.fullYears} complete year${state.fullYears === 1 ? "" : "s"}, the balance is ${moneyText(afterWholeYears)}.`,
        `For the remaining ${state.tailMonths} months, simple interest is calculated on ${moneyText(afterWholeYears)}.`,
        `Tail interest = ${moneyText(afterWholeYears)} × ${percentText(state.nominalAnnualRatePercent)} × ${state.tailMonths}/12 = ${moneyText(tailInterest)}.`,
        `Final amount = ${moneyText(afterWholeYears)} + ${moneyText(tailInterest)} = ${moneyText(brokenAmount)}.`,
        ...(state.qlId === "INT-QL-080"
          ? [`Total interest = ${moneyText(brokenAmount)} − ${moneyText(state.principal)} = ${moneyText(sub(brokenAmount, state.principal))}.`]
          : []),
      ]);
      commonMistake = "Do not assume monthly compounding for the extra months; the question explicitly requires simple interest for that part.";
      break;
    }

    case "INT-QL-081": {
      const brokenRatio = div(brokenAmount, state.principal);
      whatAsked = "We need to find the original principal from the two-stage broken-period amount.";
      steps = Object.freeze([
        `The complete years multiply the principal by (1 + ${percentText(state.nominalAnnualRatePercent)}) each year, and the final ${state.tailMonths} months add simple interest on the latest balance.`,
        exactRatioStep("Final-amount ratio A/P", brokenAmount, state.principal),
        `The exact ratio is ${rationalText(brokenRatio)}, so P = A × ${brokenRatio.denominator}/${brokenRatio.numerator}.`,
        `P = ${moneyText(brokenAmount)} × ${brokenRatio.denominator}/${brokenRatio.numerator} = ${moneyText(state.principal)}.`,
        `Check: ${moneyText(state.principal)} becomes ${moneyText(afterWholeYears)} after the complete years and ${moneyText(brokenAmount)} after the simple-interest tail.`,
      ]);
      commonMistake = "Do not divide by a rounded decimal ratio, and do not remove only the complete-year growth while ignoring the final simple-interest period.";
      break;
    }

    case "INT-QL-082": {
      whatAsked = "We need to find the annual rate that satisfies both the complete-year compounding and the final simple-interest period.";
      steps = Object.freeze([
        `Use the annual-rate choices in the exact two-stage rule. For ${percentText(state.nominalAnnualRatePercent)}, compound annually for ${state.fullYears} complete year${state.fullYears === 1 ? "" : "s"}.`,
        ...repeatedAmountSteps(state.principal, state.nominalAnnualRatePercent, state.fullYears),
        `The balance after the complete years is ${moneyText(afterWholeYears)}.`,
        `Tail interest = ${moneyText(afterWholeYears)} × ${percentText(state.nominalAnnualRatePercent)} × ${state.tailMonths}/12 = ${moneyText(tailInterest)}.`,
        `Final amount = ${moneyText(afterWholeYears)} + ${moneyText(tailInterest)} = ${moneyText(brokenAmount)}, exactly matching the question.`,
      ]);
      commonMistake = "Do not use one simple-interest calculation for the full duration, and do not report the percentage used only for the final months as the annual rate.";
      break;
    }

    case "INT-QL-083": {
      whatAsked = "We need to find the number of complete compound-interest years before the stated simple-interest tail.";
      steps = Object.freeze([
        `Start with ${moneyText(state.principal)} and apply ${percentText(state.nominalAnnualRatePercent)} once for each complete year.`,
        ...repeatedAmountSteps(state.principal, state.nominalAnnualRatePercent, state.fullYears),
        `After ${state.fullYears} complete year${state.fullYears === 1 ? "" : "s"}, the balance is ${moneyText(afterWholeYears)}.`,
        `For the last ${state.tailMonths} months, simple interest = ${moneyText(afterWholeYears)} × ${percentText(state.nominalAnnualRatePercent)} × ${state.tailMonths}/12 = ${moneyText(tailInterest)}.`,
        `${moneyText(afterWholeYears)} + ${moneyText(tailInterest)} = ${moneyText(brokenAmount)}, so the number of complete years is ${state.fullYears}.`,
      ]);
      commonMistake = "The final months are a separate simple-interest stage; they must not be counted as another complete year.";
      break;
    }

    case "INT-QL-084":
    case "INT-QL-085": {
      const afterFirst = completeAmountFromNominal(
        state.principal,
        state.nominalAnnualRatePercent,
        state.firstFrequency,
        state.firstFrequency * state.firstYears,
      );
      const firstPeriodRate = periodicRate(state.nominalAnnualRatePercent, state.firstFrequency);
      const secondPeriodRate = periodicRate(state.nominalAnnualRatePercent, state.secondFrequency);
      whatAsked = state.qlId === "INT-QL-084"
        ? "We need to find the final amount when the compounding schedule changes."
        : "We need to find the interest earned when the compounding schedule changes.";
      steps = Object.freeze([
        `First interval: rate per period = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.firstFrequency} = ${percentText(firstPeriodRate)}, used ${state.firstFrequency * state.firstYears} times.`,
        `The balance after the first interval is ${moneyText(afterFirst)}.`,
        `Second interval: rate per period = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.secondFrequency} = ${percentText(secondPeriodRate)}, used ${state.secondFrequency * state.secondYears} times.`,
        `Applying the second schedule to ${moneyText(afterFirst)} gives ${moneyText(mixedAmount)}.`,
        ...(state.qlId === "INT-QL-085"
          ? [`Compound interest = ${moneyText(mixedAmount)} − ${moneyText(state.principal)} = ${moneyText(sub(mixedAmount, state.principal))}.`]
          : []),
      ]);
      commonMistake = "Do not use one frequency for the entire duration; change the rate per period and the number of periods at the stated boundary.";
      break;
    }
  }

  return deepFreeze({
    whatAsked,
    steps,
    finalAnswer: `Therefore, the answer is ${correctAnswer}.`,
    commonMistake,
  });
}
