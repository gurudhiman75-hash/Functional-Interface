import {
  FREQUENCIES, absRational, add, asInteger, brokenAmountForState, brokenPeriodAmount, canonicalCp004Answer,
  completeAmountForState, completeAmountFromNominal, completeAmountFromPeriodic, div, effectiveAnnualRate, eq, hash,
  mixedAmountForState, mixedFrequencyAmount, mul, periodMultiplierFromPeriodicRate, periodicAmountForState, periodicRate,
  pow, rat, registryEntry, sub, type Cp004AnswerSemantic, type Cp004Frequency, type Cp004MathematicalState,
  type Cp004Option, type Rational,
} from "./cp004-frequency-math";

const abs = (value: bigint): bigint => value < 0n ? -value : value;
export function frequencyLabel(frequency: Cp004Frequency): string {
  switch (frequency) {
    case 1: return "annually";
    case 2: return "half-yearly";
    case 4: return "quarterly";
    case 12: return "monthly";
  }
}
export function frequencyScheduleLabel(frequency: Cp004Frequency): string {
  return frequency === 1 ? "annual" : frequencyLabel(frequency);
}
export function frequencyNoun(frequency: Cp004Frequency): string {
  switch (frequency) {
    case 1: return "year";
    case 2: return "half-year";
    case 4: return "quarter";
    case 12: return "month";
  }
}
export function interestTimesPerYear(frequency: Cp004Frequency): string {
  switch (frequency) {
    case 1: return "once a year";
    case 2: return "twice a year";
    case 4: return "four times a year";
    case 12: return "every month";
  }
}
export function durationText(periods: number, frequency: Cp004Frequency): string {
  if (frequency === 1) return `${periods} year${periods === 1 ? "" : "s"}`;
  const months = periods * (12 / frequency);
  if (months % 12 === 0) {
    const years = months / 12;
    return `${years} year${years === 1 ? "" : "s"}`;
  }
  return `${months} months`;
}
export function decimal(value: Rational, places = 2): string {
  const sign = value.numerator < 0n ? "-" : "";
  const numerator = abs(value.numerator);
  const scale = 10n ** BigInt(places);
  let scaled = numerator * scale / value.denominator;
  const remainder = numerator * scale % value.denominator;
  if (remainder * 2n >= value.denominator) scaled += 1n;
  const digits = scaled.toString().padStart(places + 1, "0");
  return places === 0 ? `${sign}${digits}` : `${sign}${digits.slice(0, -places)}.${digits.slice(-places)}`;
}
function indianInteger(value: bigint): string {
  const source = abs(value).toString();
  if (source.length <= 3) return `${value < 0n ? "-" : ""}${source}`;
  const last = source.slice(-3);
  const head = source.slice(0, -3);
  const groups: string[] = [];
  for (let index = head.length; index > 0; index -= 2) groups.unshift(head.slice(Math.max(0, index - 2), index));
  return `${value < 0n ? "-" : ""}${groups.join(",")},${last}`;
}
export function moneyText(value: Rational): string {
  if (value.denominator === 1n) return `₹${indianInteger(value.numerator)}`;
  const sign = value.numerator < 0n ? "-" : "";
  const numerator = abs(value.numerator);
  const scale = 100n;
  let scaled = numerator * scale / value.denominator;
  if ((numerator * scale % value.denominator) * 2n >= value.denominator) scaled += 1n;
  const whole = scaled / scale;
  const fraction = (scaled % scale).toString().padStart(2, "0");
  return `₹${sign}${indianInteger(whole)}.${fraction}`;
}
export function percentText(value: Rational): string {
  if (value.denominator === 1n) return `${value.numerator}%`;
  return `${decimal(value, 2)}%`;
}
function frequencyAnswerText(value: Rational): string {
  const frequency = asInteger(value) as Cp004Frequency;
  return frequencyLabel(frequency);
}
function answerText(semantic: Cp004AnswerSemantic, value: Rational, state: Cp004MathematicalState): string {
  if (semantic === "MONEY") return moneyText(value);
  if (semantic === "RATE_PERCENT") return percentText(value);
  if (semantic === "FREQUENCY") return frequencyAnswerText(value);
  if (state.qlId === "INT-QL-072") return durationText(asInteger(value), state.frequency);
  return `${asInteger(value)} complete year${asInteger(value) === 1 ? "" : "s"}`;
}

function simpleInterestAmount(principal: Rational, annualRatePercent: Rational, totalYears: Rational): Rational {
  return mul(principal, add(rat(1), mul(div(annualRatePercent, rat(100)), totalYears)));
}
function onePeriodLessAmount(state: Cp004MathematicalState): Rational {
  if (state.qlId === "INT-QL-073" || state.qlId === "INT-QL-074") {
    return completeAmountFromPeriodic(state.principal, state.periodicRatePercent, Math.max(1, state.periods - 1));
  }
  return completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.frequency, Math.max(1, state.periods - 1));
}
function wrongValues(state: Cp004MathematicalState, solution: Rational): readonly { value: Rational; id: string; feedback: string }[] {
  const completeAmount = completeAmountForState(state);
  const totalYears = rat(state.periods, state.frequency);
  const simpleAmount = simpleInterestAmount(state.principal, state.nominalAnnualRatePercent, totalYears);
  const brokenAmount = brokenAmountForState(state);
  const mixedAmount = mixedAmountForState(state);
  switch (state.qlId) {
    case "INT-QL-067": return [
      { value: simpleAmount, id: "USED_SIMPLE_INTEREST", feedback: "This adds the same interest on the original sum instead of adding each period's interest to the balance." },
      { value: onePeriodLessAmount(state), id: "MISSED_ONE_PERIOD", feedback: "One compounding period was left out." },
      { value: state.principal, id: "RETURNED_PRINCIPAL", feedback: "This is only the starting sum; the question asks for the final amount." },
    ];
    case "INT-QL-068": return [
      { value: completeAmount, id: "RETURNED_AMOUNT", feedback: "This is the final amount, not the interest alone." },
      { value: sub(simpleAmount, state.principal), id: "USED_SIMPLE_INTEREST", feedback: "This calculates simple interest for the whole duration." },
      { value: sub(onePeriodLessAmount(state), state.principal), id: "MISSED_ONE_PERIOD", feedback: "One compounding period was left out." },
    ];
    case "INT-QL-069":
    case "INT-QL-070": return [
      { value: completeAmount, id: "RETURNED_FINAL_AMOUNT", feedback: "The observed final amount is not the original principal." },
      { value: div(completeAmount, periodMultiplierFromPeriodicRate(periodicRate(state.nominalAnnualRatePercent, state.frequency))), id: "REMOVED_ONLY_ONE_PERIOD", feedback: "Only one period of interest was removed." },
      { value: div(completeAmount, add(rat(1), mul(div(state.nominalAnnualRatePercent, rat(100)), totalYears))), id: "REVERSED_SIMPLE_INTEREST", feedback: "This works backwards using simple interest instead of period-by-period compounding." },
    ];
    case "INT-QL-071": return [
      { value: periodicRate(state.nominalAnnualRatePercent, state.frequency), id: "RETURNED_PERIOD_RATE", feedback: "This is the rate for one compounding period, not the annual rate." },
      { value: div(state.nominalAnnualRatePercent, rat(state.periods)), id: "DIVIDED_BY_TOTAL_PERIODS", feedback: "The annual rate is divided by periods in one year, not by the total number of periods." },
      { value: div(mul(sub(div(completeAmount, state.principal), rat(1)), rat(100)), totalYears), id: "USED_SIMPLE_RATE", feedback: "This treats the full increase as simple interest." },
    ];
    case "INT-QL-072": return [
      { value: rat(Math.max(1, state.periods - 1)), id: "ONE_PERIOD_SHORT", feedback: "The amount has not yet reached the value in the question." },
      { value: rat(state.periods + 1), id: "ONE_PERIOD_EXTRA", feedback: "This adds one unnecessary compounding period." },
      { value: rat(Math.max(1, Math.round(state.periods / state.frequency))), id: "CONFUSED_YEARS_AND_PERIODS", feedback: "This confuses complete years with the actual number of compounding periods." },
    ];
    case "INT-QL-073": return [
      { value: simpleInterestAmount(state.principal, mul(state.periodicRatePercent, rat(state.frequency)), totalYears), id: "USED_SIMPLE_INTEREST", feedback: "This uses simple interest instead of adding interest after every stated period." },
      { value: onePeriodLessAmount(state), id: "MISSED_ONE_PERIOD", feedback: "One stated period was left out." },
      { value: state.principal, id: "RETURNED_PRINCIPAL", feedback: "This is the starting sum, not the final amount." },
    ];
    case "INT-QL-074": return [
      { value: periodicAmountForState(state), id: "RETURNED_AMOUNT", feedback: "This is the final amount, not the interest alone." },
      { value: mul(state.principal, mul(div(state.periodicRatePercent, rat(100)), rat(state.periods))), id: "USED_SIMPLE_INTEREST", feedback: "This keeps calculating interest only on the original sum." },
      { value: sub(onePeriodLessAmount(state), state.principal), id: "MISSED_ONE_PERIOD", feedback: "One stated period was left out." },
    ];
    case "INT-QL-075": return [
      { value: rat(0), id: "ASSUMED_NO_FREQUENCY_EFFECT", feedback: "More frequent compounding changes the final amount even when the stated annual rate is the same." },
      { value: completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.frequency, state.frequency * state.years), id: "RETURNED_ONE_AMOUNT", feedback: "This is one scheme's full amount, not the excess between the schemes." },
      { value: sub(simpleAmount, state.principal), id: "USED_SIMPLE_INTEREST", feedback: "This ignores both compounding schedules." },
    ];
    case "INT-QL-076": return [
      { value: state.nominalAnnualRatePercent, id: "RETURNED_NOMINAL_RATE", feedback: "The stated annual rate is not the actual one-year increase when interest is added more than once." },
      { value: periodicRate(state.nominalAnnualRatePercent, state.frequency), id: "RETURNED_PERIOD_RATE", feedback: "This is only the rate for one smaller period." },
      { value: mul(periodicRate(state.nominalAnnualRatePercent, state.frequency), rat(state.frequency - 1)), id: "MISCOUNTED_PERIODS", feedback: "One compounding period was omitted." },
    ];
    case "INT-QL-077": return [
      { value: effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency), id: "RETURNED_EFFECTIVE_RATE", feedback: "This repeats the actual one-year increase instead of finding the stated annual rate." },
      { value: periodicRate(state.nominalAnnualRatePercent, state.frequency), id: "RETURNED_PERIOD_RATE", feedback: "This is the rate used once, not the annual rate quoted for the scheme." },
      { value: mul(effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency), rat(state.frequency)), id: "MULTIPLIED_EFFECTIVE_RATE", feedback: "The effective rate already describes the whole year." },
    ];
    case "INT-QL-078": return FREQUENCIES.filter((item) => item !== state.frequency).slice(0, 3).map((item) => ({
      value: rat(item), id: `ASSUMED_${item}_PER_YEAR`, feedback: `Compounding ${frequencyLabel(item)} does not produce the stated amount.`,
    }));
    case "INT-QL-079": return [
      { value: completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, 1, state.fullYears), id: "IGNORED_TAIL", feedback: "The extra months were ignored." },
      { value: completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, 12, state.fullYears * 12 + state.tailMonths), id: "COMPOUNDED_TAIL_MONTHLY", feedback: "The question says to use simple interest for the remaining months, not monthly compounding." },
      { value: simpleInterestAmount(state.principal, state.nominalAnnualRatePercent, rat(state.fullYears * 12 + state.tailMonths, 12)), id: "USED_SIMPLE_INTEREST_THROUGHOUT", feedback: "Only the remaining months use simple interest; the complete years are compounded." },
    ];
    case "INT-QL-080": return [
      { value: brokenAmount, id: "RETURNED_AMOUNT", feedback: "This is the final amount, not the interest alone." },
      { value: sub(completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, 1, state.fullYears), state.principal), id: "IGNORED_TAIL", feedback: "The interest for the extra months was omitted." },
      { value: sub(simpleInterestAmount(state.principal, state.nominalAnnualRatePercent, rat(state.fullYears * 12 + state.tailMonths, 12)), state.principal), id: "USED_SIMPLE_INTEREST_THROUGHOUT", feedback: "This uses simple interest for the complete years as well." },
    ];
    case "INT-QL-081": return [
      { value: brokenAmount, id: "RETURNED_FINAL_AMOUNT", feedback: "The final amount is not the starting principal." },
      { value: div(brokenAmount, add(rat(1), mul(div(state.nominalAnnualRatePercent, rat(100)), rat(state.fullYears * 12 + state.tailMonths, 12)))), id: "REVERSED_SIMPLE_INTEREST", feedback: "This treats the whole duration as simple interest." },
      { value: div(brokenAmount, pow(add(rat(1), div(state.nominalAnnualRatePercent, rat(100))), state.fullYears)), id: "REMOVED_ONLY_WHOLE_YEARS", feedback: "The simple-interest part for the remaining months was not removed." },
    ];
    case "INT-QL-082": return [
      { value: div(state.nominalAnnualRatePercent, rat(12)), id: "RETURNED_MONTHLY_RATE", feedback: "The question asks for the annual rate." },
      { value: div(mul(sub(div(brokenAmount, state.principal), rat(1)), rat(100)), rat(state.fullYears * 12 + state.tailMonths, 12)), id: "USED_SIMPLE_RATE", feedback: "This treats the complete years as simple interest." },
      { value: add(state.nominalAnnualRatePercent, rat(2)), id: "NEARBY_RATE", feedback: "Using this rate does not reproduce the stated amount." },
    ];
    case "INT-QL-083": return [
      { value: rat(Math.max(1, state.fullYears - 1)), id: "ONE_YEAR_SHORT", feedback: "The amount is still below the stated value." },
      { value: rat(state.fullYears + 1), id: "ONE_YEAR_EXTRA", feedback: "This adds one full year too many." },
      { value: rat(state.fullYears + 2), id: "COUNTED_TAIL_AS_EXTRA_YEARS", feedback: "The remaining months were incorrectly counted as additional complete years." },
    ];
    case "INT-QL-084": return [
      { value: completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.firstFrequency, state.firstFrequency * (state.firstYears + state.secondYears)), id: "USED_FIRST_FREQUENCY_THROUGHOUT", feedback: "The second interval uses a different compounding schedule." },
      { value: completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.secondFrequency, state.secondFrequency * (state.firstYears + state.secondYears)), id: "USED_SECOND_FREQUENCY_THROUGHOUT", feedback: "The first interval uses a different compounding schedule." },
      { value: completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, 1, state.firstYears + state.secondYears), id: "USED_ANNUAL_THROUGHOUT", feedback: "This ignores both stated compounding frequencies." },
    ];
    case "INT-QL-085": return [
      { value: mixedAmount, id: "RETURNED_AMOUNT", feedback: "This is the final amount, not the interest alone." },
      { value: sub(completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.firstFrequency, state.firstFrequency * (state.firstYears + state.secondYears)), state.principal), id: "USED_FIRST_FREQUENCY_THROUGHOUT", feedback: "The second interval's compounding schedule was ignored." },
      { value: sub(completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.secondFrequency, state.secondFrequency * (state.firstYears + state.secondYears)), state.principal), id: "USED_SECOND_FREQUENCY_THROUGHOUT", feedback: "The first interval's compounding schedule was ignored." },
    ];
  }
}

function optionValues(state: Cp004MathematicalState, solution: Rational): readonly { value: Rational; id: string; feedback: string }[] {
  const candidates = [...wrongValues(state, solution)];
  const unique: { value: Rational; id: string; feedback: string }[] = [];
  for (const candidate of candidates) {
    if (!eq(candidate.value, solution) && !unique.some((existing) => eq(existing.value, candidate.value))) unique.push(candidate);
  }
  let offset = 1;
  while (unique.length < 3) {
    const step = registryEntry(state.qlId).answerSemantic === "MONEY" ? rat(100 * offset) : rat(offset);
    const candidate = add(solution, step);
    if (!eq(candidate, solution) && !unique.some((existing) => eq(existing.value, candidate))) {
      unique.push({ value: candidate, id: "ARITHMETIC_SLIP", feedback: "This value comes from an arithmetic slip and does not satisfy the given conditions." });
    }
    offset += 1;
  }
  return unique.slice(0, 3);
}

export function optionsFor(state: Cp004MathematicalState, seed: string): readonly Cp004Option[] {
  const entry = registryEntry(state.qlId);
  const solution = canonicalCp004Answer(state);
  const wrong = optionValues(state, solution);
  const correctPosition = hash(`${seed}:${state.qlId}:correct-position`) % 4;
  const orderedValues = [...wrong];
  orderedValues.splice(correctPosition, 0, { value: solution, id: "CORRECT", feedback: "This value satisfies every condition in the question." });
  return Object.freeze(orderedValues.map((candidate, index) => Object.freeze({
    id: (["A", "B", "C", "D"] as const)[index],
    value: candidate.value,
    text: answerText(entry.answerSemantic, candidate.value, state),
    isCorrect: index === correctPosition,
    misconceptionId: candidate.id,
    feedback: candidate.feedback,
  })));
}

export function rateStep(state: Cp004MathematicalState): string {
  const periodRate = periodicRate(state.nominalAnnualRatePercent, state.frequency);
  return `Interest is added ${interestTimesPerYear(state.frequency)}, so the rate used each time is ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.frequency} = ${percentText(periodRate)}.`;
}
export function repeatedAmountSteps(principal: Rational, ratePerPeriod: Rational, periods: number): readonly string[] {
  const steps: string[] = [];
  let balance = principal;
  const shown = Math.min(periods, 4);
  for (let index = 1; index <= shown; index += 1) {
    const interest = mul(balance, div(ratePerPeriod, rat(100)));
    const next = add(balance, interest);
    steps.push(`After period ${index}: ${moneyText(balance)} + ${percentText(ratePerPeriod)} of ${moneyText(balance)} = ${moneyText(next)}.`);
    balance = next;
  }
  if (periods > shown) {
    const final = completeAmountFromPeriodic(principal, ratePerPeriod, periods);
    steps.push(`Continue the same calculation for all ${periods} periods. The final amount is ${moneyText(final)}.`);
  }
  return Object.freeze(steps);
}
