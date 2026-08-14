import {
  FREQUENCIES,
  absRational,
  add,
  brokenAmountForState,
  canonicalCp004Answer,
  completeAmountForState,
  completeAmountFromNominal,
  deepFreeze,
  div,
  effectiveAnnualRate,
  hash,
  mixedAmountForState,
  mul,
  periodicAmountForState,
  periodicRate,
  rat,
  sub,
  type Cp004Explanation,
  type Cp004Frequency,
  type Cp004MathematicalState,
  type IntCp004QlId,
  type Rational,
} from "./cp004-frequency-math";
import { generateCp004State } from "./cp004-frequency-generation";
import {
  decimal,
  durationText,
  frequencyNoun,
  frequencyScheduleLabel,
  interestTimesPerYear,
  moneyText,
  percentText,
} from "./cp004-frequency-options";

export const INT_CP004_EDITORIAL_REMEDIATION_VERSION = "INT-CP-004-EDITORIAL-REMEDIATION-v4" as const;

const MONEY_QLS = new Set<IntCp004QlId>([
  "INT-QL-067", "INT-QL-068", "INT-QL-069", "INT-QL-070", "INT-QL-073", "INT-QL-074",
  "INT-QL-075", "INT-QL-079", "INT-QL-080", "INT-QL-081", "INT-QL-084", "INT-QL-085",
]);
const EASY_DIRECT_QLS = new Set<IntCp004QlId>(["INT-QL-067", "INT-QL-068", "INT-QL-073", "INT-QL-074"]);

function exactToPaise(value: Rational): boolean {
  return (value.numerator * 100n) % value.denominator === 0n;
}

function rateAtMost(value: Rational, percent: number): boolean {
  return value.numerator <= BigInt(percent) * value.denominator;
}

function observableMoneyValues(state: Cp004MathematicalState): readonly Rational[] {
  switch (state.qlId) {
    case "INT-QL-067":
    case "INT-QL-068":
    case "INT-QL-069":
    case "INT-QL-070":
    case "INT-QL-071":
    case "INT-QL-072":
    case "INT-QL-078": return Object.freeze([completeAmountForState(state)]);
    case "INT-QL-073":
    case "INT-QL-074": return Object.freeze([periodicAmountForState(state)]);
    case "INT-QL-075": {
      const first = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.frequency, state.frequency * state.years);
      const second = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.comparisonFrequency, state.comparisonFrequency * state.years);
      return Object.freeze([first, second, absRational(sub(first, second))]);
    }
    case "INT-QL-076": return Object.freeze([]);
    case "INT-QL-077": return Object.freeze([]);
    case "INT-QL-079":
    case "INT-QL-080":
    case "INT-QL-081":
    case "INT-QL-082":
    case "INT-QL-083": return Object.freeze([brokenAmountForState(state)]);
    case "INT-QL-084":
    case "INT-QL-085": return Object.freeze([mixedAmountForState(state)]);
  }
}

function isExamFriendlyState(state: Cp004MathematicalState, preferWholeMoney: boolean): boolean {
  if (observableMoneyValues(state).some((value) => !exactToPaise(value))) return false;

  if (EASY_DIRECT_QLS.has(state.qlId)) {
    if (state.periods > 6) return false;
    if (state.frequency === 12 && state.periods > 6) return false;
    if (!rateAtMost(state.nominalAnnualRatePercent, 24)) return false;
  }

  if (state.qlId === "INT-QL-075") {
    if (state.years > 2) return false;
    if (!rateAtMost(state.nominalAnnualRatePercent, 24)) return false;
  }
  if (state.qlId === "INT-QL-076" && !rateAtMost(state.nominalAnnualRatePercent, 24)) return false;
  if (state.qlId === "INT-QL-078") {
    if (state.years !== 1) return false;
    if (!rateAtMost(state.nominalAnnualRatePercent, 24)) return false;
  }
  if ((state.qlId === "INT-QL-084" || state.qlId === "INT-QL-085")
      && ((state.firstFrequency === 12 && state.firstYears > 1) || (state.secondFrequency === 12 && state.secondYears > 1))) return false;

  if (state.qlId === "INT-QL-077") {
    const effective = effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency);
    if (!exactToPaise(effective)) return false;
  }

  if (MONEY_QLS.has(state.qlId)) {
    const answer = canonicalCp004Answer(state);
    if (!exactToPaise(answer)) return false;
    if (preferWholeMoney && answer.denominator !== 1n) return false;
  }
  return true;
}

export function generateExamReadyCp004State(qlId: IntCp004QlId, seed: string): Cp004MathematicalState {
  const preferWholeMoney = hash(`${seed}:${qlId}:whole-money-policy-v4`) % 4 !== 0;
  for (let attempt = 0; attempt < 256; attempt += 1) {
    const effectiveSeed = attempt === 0 ? seed : `${seed}:exam-ready-v4:${attempt}`;
    const state = generateCp004State(qlId, effectiveSeed);
    if (isExamFriendlyState(state, preferWholeMoney)) return state;
  }
  throw new Error(`${qlId}/${seed}: could not construct an exam-ready state under v4 policy.`);
}

function onePeriodMultiplierText(ratePercent: Rational): string {
  const rate = div(ratePercent, rat(100));
  return `1 + ${percentText(ratePercent)} = ${decimal(add(rat(1), rate), 4).replace(/0+$/u, "").replace(/\.$/u, "")}`;
}

function amountFormula(principal: Rational, ratePercent: Rational, periods: number, result: Rational): string {
  return `Amount = ${moneyText(principal)} × (1 + ${percentText(ratePercent)})^${periods} = ${moneyText(result)}.`;
}

function directCompleteExplanation(state: Cp004MathematicalState, interestOnly: boolean): Cp004Explanation {
  const ratePerPeriod = periodicRate(state.nominalAnnualRatePercent, state.frequency);
  const amount = completeAmountForState(state);
  const interest = sub(amount, state.principal);
  const steps = [
    `Interest is credited ${interestTimesPerYear(state.frequency)}, so the rate for one ${frequencyNoun(state.frequency)} is ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.frequency} = ${percentText(ratePerPeriod)}.`,
    `The stated time contains ${state.periods} compounding period${state.periods === 1 ? "" : "s"}.`,
    amountFormula(state.principal, ratePerPeriod, state.periods, amount),
  ];
  if (interestOnly) steps.push(`Compound interest = amount − principal = ${moneyText(amount)} − ${moneyText(state.principal)} = ${moneyText(interest)}.`);
  return deepFreeze({
    whatAsked: interestOnly
      ? "We need to find only the compound interest, not the maturity amount."
      : "We need to find the maturity amount after all the stated compounding periods.",
    steps: Object.freeze(steps),
    finalAnswer: `Therefore, the answer is ${interestOnly ? moneyText(interest) : moneyText(amount)}.`,
    commonMistake: state.frequency === 1
      ? "Annual compounding still adds each year's interest to the balance before the next year begins; do not treat the whole term as simple interest."
      : "First convert the annual rate to the rate used in one compounding period. Do not apply the full annual rate every time interest is credited.",
  });
}

function directPeriodicExplanation(state: Cp004MathematicalState, interestOnly: boolean): Cp004Explanation {
  const amount = periodicAmountForState(state);
  const interest = sub(amount, state.principal);
  const steps = [
    `The rate is already stated for one ${frequencyNoun(state.frequency)}, so ${percentText(state.periodicRatePercent)} is used directly; it is not divided again.`,
    `There are ${state.periods} complete ${frequencyNoun(state.frequency)}${state.periods === 1 ? "" : "s"}.`,
    amountFormula(state.principal, state.periodicRatePercent, state.periods, amount),
  ];
  if (interestOnly) steps.push(`Compound interest = ${moneyText(amount)} − ${moneyText(state.principal)} = ${moneyText(interest)}.`);
  return deepFreeze({
    whatAsked: interestOnly
      ? "We need to find the interest earned over all the stated periods."
      : "We need to find the final amount using the rate already given for each period.",
    steps: Object.freeze(steps),
    finalAnswer: `Therefore, the answer is ${interestOnly ? moneyText(interest) : moneyText(amount)}.`,
    commonMistake: "Do not divide a rate that is already stated for each half-year, quarter or month.",
  });
}

function rateInverseExplanation(state: Cp004MathematicalState): Cp004Explanation {
  const amount = completeAmountForState(state);
  const periodRate = periodicRate(state.nominalAnnualRatePercent, state.frequency);
  return deepFreeze({
    whatAsked: "We need to find the nominal annual rate that produces the stated maturity amount.",
    steps: Object.freeze([
      `The money grows from ${moneyText(state.principal)} to ${moneyText(amount)} in ${state.periods} ${frequencyNoun(state.frequency)}${state.periods === 1 ? "" : "s"}.`,
      `Check the annual-rate option ${percentText(state.nominalAnnualRatePercent)}. Its rate for one ${frequencyNoun(state.frequency)} is ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.frequency} = ${percentText(periodRate)}.`,
      amountFormula(state.principal, periodRate, state.periods, amount),
      `The calculated amount exactly matches ${moneyText(amount)}, so the nominal annual rate is ${percentText(state.nominalAnnualRatePercent)}.`,
    ]),
    finalAnswer: `Therefore, the answer is ${percentText(state.nominalAnnualRatePercent)}.`,
    commonMistake: `The ${frequencyNoun(state.frequency)} rate is only the rate for one period. The question asks for the nominal annual rate.`,
  });
}

function durationInverseExplanation(state: Cp004MathematicalState): Cp004Explanation {
  const amount = completeAmountForState(state);
  const periodRate = periodicRate(state.nominalAnnualRatePercent, state.frequency);
  const previousPeriods = Math.max(1, state.periods - 1);
  const previousAmount = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.frequency, previousPeriods);
  return deepFreeze({
    whatAsked: "We need to find how many compounding periods are needed and then express them as time.",
    steps: Object.freeze([
      `Rate for one ${frequencyNoun(state.frequency)} = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.frequency} = ${percentText(periodRate)}.`,
      `After ${previousPeriods} period${previousPeriods === 1 ? "" : "s"}, the amount is ${moneyText(previousAmount)}, so the target has not yet been reached.`,
      amountFormula(state.principal, periodRate, state.periods, amount),
      `The target is reached after ${state.periods} periods, which is ${durationText(state.periods, state.frequency)}.`,
    ]),
    finalAnswer: `Therefore, the answer is ${durationText(state.periods, state.frequency)}.`,
    commonMistake: "Do not call the number of half-years, quarters or months 'years'. Convert the final period count into the requested time unit.",
  });
}

function comparisonExplanation(state: Cp004MathematicalState): Cp004Explanation {
  const firstRate = periodicRate(state.nominalAnnualRatePercent, state.frequency);
  const secondRate = periodicRate(state.nominalAnnualRatePercent, state.comparisonFrequency);
  const firstPeriods = state.frequency * state.years;
  const secondPeriods = state.comparisonFrequency * state.years;
  const firstAmount = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.frequency, firstPeriods);
  const secondAmount = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.comparisonFrequency, secondPeriods);
  const difference = absRational(sub(firstAmount, secondAmount));
  return deepFreeze({
    whatAsked: "We need to compare the maturity amounts under the two compounding schedules.",
    steps: Object.freeze([
      `${frequencyScheduleLabel(state.frequency)} compounding: rate per period = ${percentText(firstRate)} and number of periods = ${firstPeriods}. Amount = ${moneyText(state.principal)} × (1 + ${percentText(firstRate)})^${firstPeriods} = ${moneyText(firstAmount)}.`,
      `${frequencyScheduleLabel(state.comparisonFrequency)} compounding: rate per period = ${percentText(secondRate)} and number of periods = ${secondPeriods}. Amount = ${moneyText(state.principal)} × (1 + ${percentText(secondRate)})^${secondPeriods} = ${moneyText(secondAmount)}.`,
      `Difference = ${moneyText(firstAmount)} and ${moneyText(secondAmount)} compared = ${moneyText(difference)}.`,
    ]),
    finalAnswer: `Therefore, the answer is ${moneyText(difference)}.`,
    commonMistake: "The quoted annual rate is the same in both plans, but the rate used each time and the number of crediting periods are different.",
  });
}

function effectiveRateExplanation(state: Cp004MathematicalState): Cp004Explanation {
  const periodRate = periodicRate(state.nominalAnnualRatePercent, state.frequency);
  const oneYearAmount = completeAmountFromNominal(rat(100), state.nominalAnnualRatePercent, state.frequency, state.frequency);
  const effective = effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency);
  return deepFreeze({
    whatAsked: "We need to find the actual percentage increase during one complete year.",
    steps: Object.freeze([
      `Take a starting value of ₹100. Rate for one ${frequencyNoun(state.frequency)} = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.frequency} = ${percentText(periodRate)}.`,
      `After one year: ₹100 × (1 + ${percentText(periodRate)})^${state.frequency} = ${moneyText(oneYearAmount)}.`,
      `Actual increase = ${moneyText(oneYearAmount)} − ₹100 = ${moneyText(sub(oneYearAmount, rat(100)))}.`,
      `Therefore, the effective annual rate is ${decimal(effective, 2)}%.`,
    ]),
    finalAnswer: `Therefore, the answer is ${decimal(effective, 2)}%.`,
    commonMistake: "When interest is credited more than once a year, the quoted annual rate and the actual one-year percentage increase are not the same.",
  });
}

function effectiveRateInverseExplanation(state: Cp004MathematicalState): Cp004Explanation {
  const periodRate = periodicRate(state.nominalAnnualRatePercent, state.frequency);
  const effective = effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency);
  const oneYearAmount = completeAmountFromNominal(rat(100), state.nominalAnnualRatePercent, state.frequency, state.frequency);
  return deepFreeze({
    whatAsked: "We need to find the quoted annual rate that gives the stated effective one-year return.",
    steps: Object.freeze([
      `An effective rate of ${percentText(effective)} means ₹100 must become ${moneyText(add(rat(100), effective))} after one year.`,
      `Check the nominal-rate option ${percentText(state.nominalAnnualRatePercent)}. Rate per ${frequencyNoun(state.frequency)} = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.frequency} = ${percentText(periodRate)}.`,
      `₹100 × (1 + ${percentText(periodRate)})^${state.frequency} = ${moneyText(oneYearAmount)}.`,
      `This is exactly the required one-year value, so the nominal annual rate is ${percentText(state.nominalAnnualRatePercent)}.`,
    ]),
    finalAnswer: `Therefore, the answer is ${percentText(state.nominalAnnualRatePercent)}.`,
    commonMistake: "Do not multiply the effective rate by the number of crediting periods. Check a nominal-rate option after converting it to the rate used each period.",
  });
}

function frequencyIdentificationExplanation(state: Cp004MathematicalState): Cp004Explanation {
  const target = completeAmountForState(state);
  const targetRatio = div(target, state.principal);
  const comparisonSteps = FREQUENCIES.map((frequency) => {
    const rate = periodicRate(state.nominalAnnualRatePercent, frequency);
    const amountOn100 = completeAmountFromNominal(rat(100), state.nominalAnnualRatePercent, frequency, frequency * state.years);
    return `${frequencyScheduleLabel(frequency)}: rate per period = ${percentText(rate)}; ₹100 becomes ${moneyText(amountOn100)}.`;
  });
  return deepFreeze({
    whatAsked: "We need to find which compounding schedule produces the stated maturity amount.",
    steps: Object.freeze([
      `First compare amount with principal: ${moneyText(target)} ÷ ${moneyText(state.principal)} = ${decimal(targetRatio, 6)}. This tells us how ₹1 grows over the year.`,
      ...comparisonSteps,
      `Only ${frequencyScheduleLabel(state.frequency)} compounding gives the same increase, so that is the schedule used.`,
    ]),
    finalAnswer: `Therefore, the answer is ${frequencyScheduleLabel(state.frequency)} compounding.`,
    commonMistake: "Do not compare only the quoted annual rate. The number of times interest is added changes the final amount.",
  });
}

function mixedFrequencyExplanation(state: Cp004MathematicalState, interestOnly: boolean): Cp004Explanation {
  const firstRate = periodicRate(state.nominalAnnualRatePercent, state.firstFrequency);
  const secondRate = periodicRate(state.nominalAnnualRatePercent, state.secondFrequency);
  const firstPeriods = state.firstFrequency * state.firstYears;
  const secondPeriods = state.secondFrequency * state.secondYears;
  const afterFirst = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.firstFrequency, firstPeriods);
  const finalAmount = mixedAmountForState(state);
  const interest = sub(finalAmount, state.principal);
  const steps = [
    `First interval: rate per period = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.firstFrequency} = ${percentText(firstRate)}, used ${firstPeriods} time${firstPeriods === 1 ? "" : "s"}. ${moneyText(state.principal)} × (1 + ${percentText(firstRate)})^${firstPeriods} = ${moneyText(afterFirst)}.`,
    `Second interval: rate per period = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.secondFrequency} = ${percentText(secondRate)}, used ${secondPeriods} time${secondPeriods === 1 ? "" : "s"}. ${moneyText(afterFirst)} × (1 + ${percentText(secondRate)})^${secondPeriods} = ${moneyText(finalAmount)}.`,
  ];
  if (interestOnly) steps.push(`Compound interest = ${moneyText(finalAmount)} − ${moneyText(state.principal)} = ${moneyText(interest)}.`);
  return deepFreeze({
    whatAsked: interestOnly
      ? "We need to find the interest after applying the two compounding schedules in the order stated."
      : "We need to find the final amount after applying the two compounding schedules in the order stated.",
    steps: Object.freeze(steps),
    finalAnswer: `Therefore, the answer is ${interestOnly ? moneyText(interest) : moneyText(finalAmount)}.`,
    commonMistake: "Do not use one frequency for the whole duration. Finish the first interval, then use that balance as the starting value for the second interval.",
  });
}

export function hardenCp004ExplanationV4(state: Cp004MathematicalState, original: Cp004Explanation): Cp004Explanation {
  switch (state.qlId) {
    case "INT-QL-067": return directCompleteExplanation(state, false);
    case "INT-QL-068": return directCompleteExplanation(state, true);
    case "INT-QL-071": return rateInverseExplanation(state);
    case "INT-QL-072": return durationInverseExplanation(state);
    case "INT-QL-073": return directPeriodicExplanation(state, false);
    case "INT-QL-074": return directPeriodicExplanation(state, true);
    case "INT-QL-075": return comparisonExplanation(state);
    case "INT-QL-076": return effectiveRateExplanation(state);
    case "INT-QL-077": return effectiveRateInverseExplanation(state);
    case "INT-QL-078": return frequencyIdentificationExplanation(state);
    case "INT-QL-084": return mixedFrequencyExplanation(state, false);
    case "INT-QL-085": return mixedFrequencyExplanation(state, true);
    default: return original;
  }
}

function requireText(stem: string, expected: string, qlId: IntCp004QlId, label: string): void {
  if (!stem.includes(expected)) throw new Error(`${qlId}: displayed stem omits ${label} (${expected}).`);
}

export function assertCp004VisibleGivensV4(state: Cp004MathematicalState, stem: string): void {
  const amount = completeAmountForState(state);
  const broken = brokenAmountForState(state);
  const rate = percentText(state.nominalAnnualRatePercent);
  const original = moneyText(state.principal);

  switch (state.qlId) {
    case "INT-QL-067":
    case "INT-QL-068":
      requireText(stem, original, state.qlId, "principal");
      requireText(stem, rate, state.qlId, "annual rate");
      break;
    case "INT-QL-069":
      requireText(stem, moneyText(amount), state.qlId, "final amount");
      requireText(stem, rate, state.qlId, "annual rate");
      break;
    case "INT-QL-070":
      requireText(stem, moneyText(sub(amount, state.principal)), state.qlId, "compound interest");
      requireText(stem, rate, state.qlId, "annual rate");
      break;
    case "INT-QL-071":
      requireText(stem, original, state.qlId, "principal");
      requireText(stem, moneyText(amount), state.qlId, "final amount");
      break;
    case "INT-QL-072":
      requireText(stem, original, state.qlId, "principal");
      requireText(stem, moneyText(amount), state.qlId, "final amount");
      requireText(stem, rate, state.qlId, "annual rate");
      break;
    case "INT-QL-073":
    case "INT-QL-074":
      requireText(stem, original, state.qlId, "principal");
      requireText(stem, percentText(state.periodicRatePercent), state.qlId, "period rate");
      requireText(stem, String(state.periods), state.qlId, "number of periods");
      break;
    case "INT-QL-075":
      requireText(stem, original, state.qlId, "principal");
      requireText(stem, rate, state.qlId, "annual rate");
      break;
    case "INT-QL-076":
      requireText(stem, rate, state.qlId, "quoted annual rate");
      break;
    case "INT-QL-077":
      requireText(stem, percentText(effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency)), state.qlId, "effective annual rate");
      break;
    case "INT-QL-078":
      requireText(stem, original, state.qlId, "principal");
      requireText(stem, moneyText(amount), state.qlId, "final amount");
      requireText(stem, rate, state.qlId, "annual rate");
      break;
    case "INT-QL-079":
    case "INT-QL-080":
      requireText(stem, original, state.qlId, "principal");
      requireText(stem, rate, state.qlId, "annual rate");
      requireText(stem, String(state.tailMonths), state.qlId, "extra months");
      if (!/simple interest/iu.test(stem)) throw new Error(`${state.qlId}: broken-period stem omits the simple-interest tail rule.`);
      break;
    case "INT-QL-081":
      requireText(stem, moneyText(broken), state.qlId, "final amount");
      requireText(stem, rate, state.qlId, "annual rate");
      requireText(stem, String(state.tailMonths), state.qlId, "extra months");
      break;
    case "INT-QL-082":
      requireText(stem, original, state.qlId, "principal");
      requireText(stem, moneyText(broken), state.qlId, "final amount");
      requireText(stem, String(state.tailMonths), state.qlId, "extra months");
      break;
    case "INT-QL-083":
      requireText(stem, original, state.qlId, "principal");
      requireText(stem, moneyText(broken), state.qlId, "final amount");
      requireText(stem, rate, state.qlId, "annual rate");
      requireText(stem, String(state.tailMonths), state.qlId, "extra months");
      break;
    case "INT-QL-084":
    case "INT-QL-085":
      requireText(stem, original, state.qlId, "principal");
      requireText(stem, rate, state.qlId, "annual rate");
      break;
  }
}

export function assertCp004ExamReadinessV4(state: Cp004MathematicalState, explanation: Cp004Explanation): void {
  if (observableMoneyValues(state).some((value) => !exactToPaise(value))) {
    throw new Error(`${state.qlId}: a displayed money value requires hidden precision beyond paise.`);
  }
  if (EASY_DIRECT_QLS.has(state.qlId) && state.periods > 6) {
    throw new Error(`${state.qlId}: Easy direct question has too many repeated compounding periods.`);
  }
  if (state.frequency === 12 && EASY_DIRECT_QLS.has(state.qlId) && state.periods > 6) {
    throw new Error(`${state.qlId}: Easy monthly question is too calculation-heavy.`);
  }
  const text = [explanation.whatAsked, ...explanation.steps, explanation.commonMistake].join(" ");
  if (/Continue the same calculation/iu.test(text)) {
    throw new Error(`${state.qlId}: explanation asks the learner to continue an undisplayed calculation.`);
  }
  if (state.frequency === 1 && /interest is added more than once a year/iu.test(explanation.commonMistake)) {
    throw new Error(`${state.qlId}: common-mistake text contradicts annual compounding.`);
  }
}
