import { deterministicIndex } from "../foundation/prng";
import {
  compareRational,
  divideRational,
  formatExact,
  formatMoney,
  formatPercent,
  formatRational,
  isWholeRational,
  multiplyRational,
  rational,
  subtractRational,
} from "../foundation/rational";
import type {
  IntCp001Wave2Explanation,
  IntCp001Wave2PrototypeParameters,
  IntCp001Wave2ReasoningGraph,
  IntCp001Wave2SolveResult,
  Rational,
} from "./types";

function plural(value: Rational, singular: string, pluralForm = `${singular}s`): string {
  return value.numerator === value.denominator ? singular : pluralForm;
}

function formatDurationYears(value: Rational): string {
  if (isWholeRational(value)) return `${value.numerator} ${plural(value, "year")}`;
  const months = multiplyRational(value, rational(12));
  if (isWholeRational(months)) {
    if (months.numerator < 12n) {
      return `${months.numerator} ${months.numerator === 1n ? "month" : "months"}`;
    }
    const years = months.numerator / 12n;
    const remainder = months.numerator % 12n;
    if (remainder === 0n) return `${years} ${years === 1n ? "year" : "years"}`;
    return `${years} ${years === 1n ? "year" : "years"} ${remainder} ${remainder === 1n ? "month" : "months"}`;
  }
  return `${formatRational(value)} years`;
}

function formatRatio(value: Rational): string {
  return formatRational(value);
}

export function formatIntCp001Wave2Answer(result: IntCp001Wave2SolveResult): string {
  switch (result.semantic) {
    case "TOTAL_AMOUNT":
    case "PRINCIPAL":
    case "ANNUAL_INTEREST":
      return formatMoney(result.value);
    case "ANNUAL_RATE_PERCENT":
      return `${formatPercent(result.value)} per annum`;
    case "TIME_MONTHS":
      return `${formatRational(result.value)} ${result.value.numerator === result.value.denominator ? "month" : "months"}`;
    case "AMOUNT_MULTIPLE":
      return `${formatRatio(result.value)} times the principal`;
    case "INTEREST_TO_PRINCIPAL_RATIO":
      return compareRational(result.value, rational(1)) < 0
        ? `${formatRatio(result.value)} of the principal`
        : `${formatRatio(result.value)} times the principal`;
  }
}

function contextLead(parameters: IntCp001Wave2PrototypeParameters, variant: number): string {
  const { context } = parameters;
  const leads = [
    `${context.actor}'s ${context.instrument} is recorded by ${context.institution}`,
    `At ${context.institution}, ${context.actor} holds a ${context.instrument}`,
    `${context.institution} maintains ${context.actor}'s ${context.instrument}`,
    `For ${context.purpose}, ${context.actor} arranged a ${context.instrument} through ${context.institution}`,
    `${context.actor} obtained the ${context.instrument} from ${context.institution}`,
    `The ${context.instrument} used by ${context.actor} is with ${context.institution}`,
    `${context.actor}'s record at ${context.institution} concerns a ${context.instrument}`,
    `${context.institution} provided the ${context.instrument} used for ${context.purpose}`,
  ];
  return leads[variant % leads.length]!;
}

function stemFor(parameters: IntCp001Wave2PrototypeParameters): string {
  const state = parameters.hiddenState;
  const variant = deterministicIndex(`${parameters.prototypeId}:${parameters.seed}:wave2-stem`, 24);
  const lead = contextLead(parameters, variant);
  const P = formatMoney(state.principal);
  const I = formatMoney(state.laterInterest);
  const A = formatMoney(state.laterAmount);
  const A1 = formatMoney(state.earlierAmount);
  const A2 = formatMoney(state.laterAmount);
  const R = formatPercent(state.annualRatePercent);
  const t1 = formatDurationYears(state.earlierTimeYears);
  const t2 = formatDurationYears(state.laterTimeYears);

  switch (parameters.prototypeId) {
    case "INT-CP001-W2-PROT-AMOUNT-FOR-MONTHS": {
      const months = parameters.display.displayedMonths!;
      return [
        `${lead}. A principal of ${P} carries simple interest at ${R} per annum for ${months} months. What amount is due?`,
        `Under simple interest, ${P} is kept for ${months} months at ${R} per annum. What total amount is received?`,
        `${lead}: ${P} remains at ${R} simple interest per annum for ${months} months. What is the final amount?`,
      ][variant % 3]!;
    }
    case "INT-CP001-W2-PROT-AMOUNT-FOR-DAYS": {
      const days = parameters.display.displayedDays!;
      return [
        `${lead}. Using a 365-day year, what amount is due on ${P} at ${R} simple interest per annum after ${days} days?`,
        `A principal of ${P} is held at ${R} simple interest per annum for ${days} days. On a 365-day basis, what is the amount?`,
        `${lead}: ${P} carries simple interest at ${R} per annum for ${days} days. Using 365 days as one year, what total is payable?`,
      ][variant % 3]!;
    }
    case "INT-CP001-W2-PROT-PRINCIPAL-FROM-INTEREST-MONTHS": {
      const months = parameters.display.displayedMonths!;
      return [
        `${lead}. The simple interest for ${months} months at ${R} per annum is ${I}. What was the principal?`,
        `A sum earns ${I} as simple interest in ${months} months at ${R} per annum. What sum was invested?`,
        `${I} is earned in ${months} months at ${R} simple interest per annum. What original principal produced it?`,
      ][variant % 3]!;
    }
    case "INT-CP001-W2-PROT-PRINCIPAL-FROM-AMOUNT-MONTHS": {
      const months = parameters.display.displayedMonths!;
      return [
        `${lead}. The amount after ${months} months at ${R} simple interest per annum is ${A}. What was the principal?`,
        `A sum becomes ${A} in ${months} months at ${R} simple interest per annum. What was the original sum?`,
        `At ${R} simple interest per annum, an investment amounts to ${A} after ${months} months. What principal was invested?`,
      ][variant % 3]!;
    }
    case "INT-CP001-W2-PROT-RATE-FROM-INTEREST-MONTHS": {
      const months = parameters.display.displayedMonths!;
      return [
        `${lead}. ${P} earns ${I} as simple interest in ${months} months. What is the annual rate?`,
        `The simple interest on ${P} for ${months} months is ${I}. At what rate per annum was it invested?`,
        `${lead}: a principal of ${P} produces ${I} simple interest over ${months} months. What annual percentage rate applies?`,
      ][variant % 3]!;
    }
    case "INT-CP001-W2-PROT-RATE-FROM-AMOUNT-MONTHS": {
      const months = parameters.display.displayedMonths!;
      return [
        `${lead}. ${P} amounts to ${A} in ${months} months under simple interest. What is the annual rate?`,
        `A principal of ${P} becomes ${A} after ${months} months at simple interest. At what rate per annum?`,
        `The final amount on ${P} after ${months} months is ${A}. What simple-interest rate per annum was used?`,
      ][variant % 3]!;
    }
    case "INT-CP001-W2-PROT-TIME-MONTHS-FROM-INTEREST":
      return [
        `${lead}. ${P} earns ${I} at ${R} simple interest per annum. For how many months was the money kept?`,
        `At ${R} simple interest per annum, ${P} produces ${I} interest. What is the duration in months?`,
        `The interest on ${P} at ${R} per annum is ${I}. How many months did the term last?`,
      ][variant % 3]!;
    case "INT-CP001-W2-PROT-TIME-MONTHS-FROM-AMOUNT":
      return [
        `${lead}. ${P} grows to ${A} at ${R} simple interest per annum. How many months does this take?`,
        `A principal of ${P} amounts to ${A} at ${R} simple interest per annum. What is the time in months?`,
        `At ${R} per annum simple interest, the amount on ${P} is ${A}. How many months was the money invested?`,
      ][variant % 3]!;
    case "INT-CP001-W2-PROT-ANNUAL-INTEREST-FROM-TWO-AMOUNTS":
      return [
        `Under simple interest, a sum amounts to ${A1} after ${t1} and ${A2} after ${t2}. How much interest is earned in one year?`,
        `${lead}. The recorded amounts are ${A1} at ${t1} and ${A2} at ${t2}. What is the annual simple interest?`,
        `The amount of the same sum is ${A1} after ${t1} and ${A2} after ${t2}. What yearly interest does this imply?`,
      ][variant % 3]!;
    case "INT-CP001-W2-PROT-PRINCIPAL-FROM-TWO-AMOUNTS":
      return [
        `A sum amounts to ${A1} after ${t1} and ${A2} after ${t2} at simple interest. What was the principal?`,
        `${lead}. The same principal gives amounts ${A1} at ${t1} and ${A2} at ${t2}. What original sum was invested?`,
        `Under simple interest, the amount is ${A1} after ${t1} and ${A2} after ${t2}. What was the initial principal?`,
      ][variant % 3]!;
    case "INT-CP001-W2-PROT-RATE-FROM-TWO-AMOUNTS":
      return [
        `A sum amounts to ${A1} after ${t1} and ${A2} after ${t2} at simple interest. What is the annual rate?`,
        `${lead}. The same principal produces ${A1} at ${t1} and ${A2} at ${t2}. At what simple-interest rate per annum?`,
        `Under simple interest, the amount is ${A1} after ${t1} and ${A2} after ${t2}. What annual percentage rate applies?`,
      ][variant % 3]!;
    case "INT-CP001-W2-PROT-RATE-FROM-TWO-AMOUNT-RATIO": {
      const ratio = parameters.display.laterToEarlierAmountRatio!;
      return [
        `For the same sum under simple interest, the amount after ${t2} is ${formatRatio(ratio)} times the amount after ${t1}. What is the annual rate?`,
        `${lead}. Its amounts at ${t1} and ${t2} are in the ratio 1:${formatRatio(ratio)}. What simple-interest rate per annum is implied?`,
        `The ratio of the amount after ${t2} to the amount after ${t1} is ${formatRatio(ratio)}. At what annual simple-interest rate?`,
      ][variant % 3]!;
    }
    case "INT-CP001-W2-PROT-AMOUNT-MULTIPLE-FROM-RATE-TIME":
      return [
        `At ${R} simple interest per annum for ${t2}, how many times the principal is the final amount?`,
        `${lead}. If the rate is ${R} per annum and the term is ${t2}, what is the amount-to-principal multiple?`,
        `A sum remains at ${R} simple interest per annum for ${t2}. Express the final amount as a multiple of the principal. What is that multiple?`,
      ][variant % 3]!;
    case "INT-CP001-W2-PROT-INTEREST-RATIO-FROM-RATE-TIME":
      return [
        `At ${R} simple interest per annum for ${t2}, what fraction of the principal is earned as interest?`,
        `${lead}. With rate ${R} per annum and term ${t2}, what is the interest-to-principal ratio?`,
        `A sum remains at ${R} simple interest per annum for ${t2}. Express the interest as a multiple or fraction of the principal. What is the ratio?`,
      ][variant % 3]!;
  }
}

function explanationFor(
  parameters: IntCp001Wave2PrototypeParameters,
  solution: IntCp001Wave2SolveResult,
): IntCp001Wave2Explanation {
  const state = parameters.hiddenState;
  const request = parameters.request;
  const P = formatMoney(state.principal);
  const I = formatMoney(state.laterInterest);
  const A = formatMoney(state.laterAmount);
  const A1 = formatMoney(state.earlierAmount);
  const A2 = formatMoney(state.laterAmount);
  const J = formatMoney(state.annualInterest);
  const R = formatPercent(state.annualRatePercent);
  const T = formatDurationYears(state.laterTimeYears);
  const answer = formatIntCp001Wave2Answer(solution);
  const amountGap = subtractRational(state.laterAmount, state.earlierAmount);
  const timeGap = subtractRational(state.laterTimeYears, state.earlierTimeYears);

  switch (request.mode) {
    case "AMOUNT_FROM_PRT":
      return {
        notice: "The required amount includes the original principal and the simple interest for the stated part of a year.",
        relation: "Use I = PRT/100 after exact time conversion, then A = P + I.",
        steps: [
          `Principal P = ${P} and annual rate R = ${R}.`,
          `The displayed duration equals ${formatRational(request.timeYears)} year(s).`,
          `Interest = ${P} × ${formatExact(state.annualRate)} × ${formatRational(request.timeYears)} = ${I}.`,
          `Amount = ${P} + ${I} = ${A}.`,
        ],
        verification: `${A} − ${P} = ${I}, matching the exact interest for ${T}.`,
        conclusion: `Therefore, the total amount is ${answer}.`,
        commonTrap: "Do not treat months or days as whole years, and do not stop after finding interest.",
      };
    case "PRINCIPAL_FROM_INTEREST":
      return {
        notice: "The duration is displayed in months, but the rate is annual, so the time factor must first be converted to years.",
        relation: "Rearrange I = PRT/100 to P = 100I/(RT).",
        steps: [
          `Time = ${parameters.display.displayedMonths} months = ${formatRational(request.timeYears)} years.`,
          `Rate–time factor = ${formatExact(multiplyRational(state.annualRate, request.timeYears))}.`,
          `${I} divided by this factor gives ${P}.`,
        ],
        verification: `${P} at ${R} for ${parameters.display.displayedMonths} months earns exactly ${I}.`,
        conclusion: `Therefore, the principal was ${answer}.`,
        commonTrap: "Dividing by the annual rate without the month fraction omits the time factor.",
      };
    case "PRINCIPAL_FROM_AMOUNT":
      return {
        notice: "The amount contains principal plus interest; it is not the interest numerator.",
        relation: "For simple interest, A = P(1 + RT/100), so P = A/(1 + RT/100).",
        steps: [
          `Time = ${parameters.display.displayedMonths} months = ${formatRational(request.timeYears)} years.`,
          `The amount multiplier is 1 + ${formatExact(state.annualRate)} × ${formatRational(request.timeYears)} = ${formatExact(divideRational(state.laterAmount, state.principal))}.`,
          `${A} divided by that multiplier gives ${P}.`,
        ],
        verification: `${P} earns ${I}; adding them reproduces ${A}.`,
        conclusion: `Therefore, the original principal was ${answer}.`,
        commonTrap: "Do not use the final amount directly as the principal or as the interest.",
      };
    case "RATE_FROM_INTEREST":
      return {
        notice: "The annual rate is unknown, and the month duration must be expressed as a fraction of a year.",
        relation: "Use R = 100I/(PT).",
        steps: [
          `Time = ${parameters.display.displayedMonths} months = ${formatRational(request.timeYears)} years.`,
          `I/(PT) = ${I} ÷ (${P} × ${formatRational(request.timeYears)}) = ${formatExact(state.annualRate)}.`,
          `Multiplying by 100 gives ${R}.`,
        ],
        verification: `${P} at ${R} for ${parameters.display.displayedMonths} months earns ${I}.`,
        conclusion: `Therefore, the annual rate is ${answer}.`,
        commonTrap: "The decimal annual rate must be converted to a percentage, and the month fraction cannot be omitted.",
      };
    case "RATE_FROM_AMOUNT":
      return {
        notice: "First separate the interest from the amount, then account for the month fraction.",
        relation: "Use I = A − P and R = 100I/(PT).",
        steps: [
          `${A} − ${P} = ${I}.`,
          `Time = ${parameters.display.displayedMonths} months = ${formatRational(request.timeYears)} years.`,
          `100 × ${I}/(${P} × ${formatRational(request.timeYears)}) = ${R}.`,
        ],
        verification: `Applying ${R} to ${P} for the stated months gives amount ${A}.`,
        conclusion: `Therefore, the rate is ${answer}.`,
        commonTrap: "Using the full amount in the rate numerator produces an inflated result.",
      };
    case "TIME_MONTHS_FROM_INTEREST":
      return {
        notice: "The annual relation first gives time in years; the requested answer must then be converted to months.",
        relation: "Use T = I/(P × R/100), then multiply the year value by 12.",
        steps: [
          `Yearly interest on ${P} at ${R} is ${J}.`,
          `${I} ÷ ${J} = ${formatRational(state.laterTimeYears)} years.`,
          `${formatRational(state.laterTimeYears)} × 12 = ${formatRational(solution.value)} months.`,
        ],
        verification: `${J} per year for ${formatRational(solution.value)} months produces exactly ${I}.`,
        conclusion: `Therefore, the duration is ${answer}.`,
        commonTrap: "Do not report the year value as though it were already a month count.",
      };
    case "TIME_MONTHS_FROM_AMOUNT":
      return {
        notice: "The interest must be isolated from the amount before the duration is recovered.",
        relation: "Use I = A − P, T = I/(P × R/100), then convert years to months.",
        steps: [
          `${A} − ${P} = ${I}.`,
          `Annual interest on ${P} at ${R} is ${J}.`,
          `${I} ÷ ${J} = ${formatRational(state.laterTimeYears)} years = ${formatRational(solution.value)} months.`,
        ],
        verification: `For ${formatRational(solution.value)} months the interest is ${I}, giving amount ${A}.`,
        conclusion: `Therefore, the required time is ${answer}.`,
        commonTrap: "The full amount is not the earned interest, and years must be multiplied by 12 to obtain months.",
      };
    case "ANNUAL_INTEREST_FROM_TWO_AMOUNTS":
      return {
        notice: "With simple interest, the amount rises by an equal sum in each equal time interval.",
        relation: "Annual interest = change in amount ÷ change in time.",
        steps: [
          `Amount change = ${A2} − ${A1} = ${formatMoney(amountGap)}.`,
          `Time change = ${formatDurationYears(state.laterTimeYears)} − ${formatDurationYears(state.earlierTimeYears)} = ${formatRational(timeGap)} years.`,
          `${formatMoney(amountGap)} ÷ ${formatRational(timeGap)} = ${J} per year.`,
        ],
        verification: `${J} × ${formatRational(timeGap)} = ${formatMoney(amountGap)}, exactly reproducing the amount gap.`,
        conclusion: `Therefore, the annual interest is ${answer}.`,
        commonTrap: "Divide by the gap between the two times, not by the later time alone.",
      };
    case "PRINCIPAL_FROM_TWO_AMOUNTS":
      return {
        notice: "The two amounts first reveal the equal annual interest increment; then the earlier accumulated interest is removed.",
        relation: "J = (A₂ − A₁)/(t₂ − t₁), then P = A₁ − Jt₁.",
        steps: [
          `Annual interest J = (${A2} − ${A1})/${formatRational(timeGap)} = ${J}.`,
          `Interest accumulated by ${formatDurationYears(state.earlierTimeYears)} is ${J} × ${formatRational(state.earlierTimeYears)} = ${formatMoney(state.earlierInterest)}.`,
          `${A1} − ${formatMoney(state.earlierInterest)} = ${P}.`,
        ],
        verification: `Starting from ${P}, adding the appropriate simple interest gives both ${A1} and ${A2}.`,
        conclusion: `Therefore, the principal was ${answer}.`,
        commonTrap: "Neither observed amount is the principal because each already includes accumulated interest.",
      };
    case "RATE_FROM_TWO_AMOUNTS":
      return {
        notice: "Recover annual interest and principal from the two observations before converting their ratio to a percentage rate.",
        relation: "J = (A₂ − A₁)/(t₂ − t₁), P = A₁ − Jt₁, and R = 100J/P.",
        steps: [
          `Annual interest = ${formatMoney(amountGap)} ÷ ${formatRational(timeGap)} = ${J}.`,
          `Principal = ${A1} − ${J} × ${formatRational(state.earlierTimeYears)} = ${P}.`,
          `Rate = 100 × ${J}/${P} = ${R}.`,
        ],
        verification: `${P} at ${R} reaches ${A1} at the earlier time and ${A2} at the later time.`,
        conclusion: `Therefore, the annual rate is ${answer}.`,
        commonTrap: "The amount gap is interest for the time gap, not automatically the interest for one year.",
      };
    case "RATE_FROM_TWO_AMOUNT_RATIO": {
      const k = request.laterToEarlierAmountRatio;
      const denominator = subtractRational(
        request.laterTimeYears,
        multiplyRational(k, request.earlierTimeYears),
      );
      return {
        notice: "The principal cancels only after both amount expressions are written with their full simple-interest multipliers.",
        relation: "If k = A₂/A₁, then k = (1 + rt₂)/(1 + rt₁), so r = (k − 1)/(t₂ − kt₁).",
        steps: [
          `k = ${formatRational(k)}, t₁ = ${formatRational(request.earlierTimeYears)}, and t₂ = ${formatRational(request.laterTimeYears)}.`,
          `k − 1 = ${formatRational(subtractRational(k, rational(1)))} and t₂ − kt₁ = ${formatRational(denominator)}.`,
          `The decimal rate is ${formatExact(state.annualRate)}; multiplying by 100 gives ${R}.`,
        ],
        verification: `(1 + rt₂)/(1 + rt₁) reconstructs the stated ratio ${formatRational(k)} exactly.`,
        conclusion: `Therefore, the annual rate is ${answer}.`,
        commonTrap: "Using only the later time ignores that the earlier amount has already earned interest.",
      };
    }
    case "AMOUNT_MULTIPLE_FROM_RATE_TIME": {
      const interestRatio = multiplyRational(state.annualRate, state.laterTimeYears);
      return {
        notice: "The amount multiple includes the original principal once in addition to the interest fraction.",
        relation: "For simple interest, A/P = 1 + RT/100.",
        steps: [
          `Annual decimal rate = ${formatExact(state.annualRate)}.`,
          `Interest-to-principal ratio for ${T} = ${formatExact(state.annualRate)} × ${formatRational(state.laterTimeYears)} = ${formatRational(interestRatio)}.`,
          `Amount multiple = 1 + ${formatRational(interestRatio)} = ${formatRational(solution.value)}.`,
        ],
        verification: `A principal P would earn ${formatRational(interestRatio)}P, so the amount is ${formatRational(solution.value)}P.`,
        conclusion: `Therefore, the amount is ${answer}.`,
        commonTrap: "Reporting RT/100 alone gives the interest fraction, not the amount multiple.",
      };
    }
    case "INTEREST_RATIO_FROM_RATE_TIME":
      return {
        notice: "The question asks for interest relative to principal, so the original principal is not added.",
        relation: "For simple interest, I/P = RT/100.",
        steps: [
          `Annual decimal rate = ${formatExact(state.annualRate)}.`,
          `Time = ${formatRational(state.laterTimeYears)} years.`,
          `I/P = ${formatExact(state.annualRate)} × ${formatRational(state.laterTimeYears)} = ${formatRational(solution.value)}.`,
        ],
        verification: `Multiplying any principal by ${formatRational(solution.value)} gives the corresponding simple interest for ${T}.`,
        conclusion: `Therefore, the interest is ${answer}.`,
        commonTrap: "Adding 1 converts the interest ratio into the amount multiple, which is a different answer.",
      };
  }
}

function reasoningGraphFor(
  parameters: IntCp001Wave2PrototypeParameters,
  solution: IntCp001Wave2SolveResult,
): IntCp001Wave2ReasoningGraph {
  const state = parameters.hiddenState;
  return {
    nodes: [
      {
        id: "given",
        kind: "GIVEN",
        text: "Identify whether each displayed value is principal, interest, amount, time, or an amount ratio.",
        dependsOn: [],
      },
      {
        id: "normalise",
        kind: "NORMALISATION",
        text: `Use exact annual rate ${formatExact(state.annualRate)} and exact year coordinates ${formatRational(state.earlierTimeYears)}, ${formatRational(state.laterTimeYears)}.`,
        mathLatex: `r=${formatRational(state.annualRate)},\\quad t_1=${formatRational(state.earlierTimeYears)},\\quad t_2=${formatRational(state.laterTimeYears)}`,
        dependsOn: ["given"],
      },
      {
        id: "relation",
        kind: "RELATION",
        text: "Model simple interest as a linear amount timeline or its exact ratio form.",
        mathLatex: "I=Prt,\\quad A(t)=P(1+rt)",
        dependsOn: ["normalise"],
      },
      {
        id: "derive",
        kind: "DERIVATION",
        text: `The exact requested value is ${formatIntCp001Wave2Answer(solution)}.`,
        dependsOn: ["relation"],
      },
      {
        id: "verify",
        kind: "VERIFICATION",
        text: "Substitute the result back into the displayed amount, interest, month, or ratio evidence.",
        dependsOn: ["derive"],
      },
      {
        id: "conclusion",
        kind: "CONCLUSION",
        text: `State the answer with its correct semantic: ${formatIntCp001Wave2Answer(solution)}.`,
        dependsOn: ["verify"],
      },
    ],
  };
}

export function presentIntCp001Wave2(
  parameters: IntCp001Wave2PrototypeParameters,
  solution: IntCp001Wave2SolveResult,
): {
  stem: string;
  explanation: IntCp001Wave2Explanation;
  reasoningGraph: IntCp001Wave2ReasoningGraph;
} {
  return {
    stem: stemFor(parameters),
    explanation: explanationFor(parameters, solution),
    reasoningGraph: reasoningGraphFor(parameters, solution),
  };
}
