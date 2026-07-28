import { deterministicIndex } from "./prng";
import {
  divideRational,
  formatExact,
  formatMoney,
  formatPercent,
  formatRational,
  isWholeRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";
import type {
  IntAnswerSemantic,
  IntCp001Explanation,
  IntCp001PrototypeParameters,
  IntCp001SolveResult,
  IntReasoningGraph,
  Rational,
} from "./types";

function plural(value: Rational, singular: string, pluralForm = `${singular}s`): string {
  return value.numerator === value.denominator ? singular : pluralForm;
}

export function formatDurationYears(value: Rational): string {
  if (isWholeRational(value)) {
    return `${value.numerator} ${plural(value, "year")}`;
  }
  const months = multiplyRational(value, rational(12));
  if (isWholeRational(months)) {
    if (months.numerator < 12n) return `${months.numerator} ${months.numerator === 1n ? "month" : "months"}`;
    const years = months.numerator / 12n;
    const remainder = months.numerator % 12n;
    if (remainder === 0n) return `${years} ${years === 1n ? "year" : "years"}`;
    return `${years} ${years === 1n ? "year" : "years"} ${remainder} ${remainder === 1n ? "month" : "months"}`;
  }
  return `${formatRational(value)} years`;
}

export function formatIntCp001Answer(result: IntCp001SolveResult): string {
  switch (result.semantic) {
    case "SIMPLE_INTEREST":
    case "TOTAL_AMOUNT":
    case "PRINCIPAL":
    case "ANNUAL_INTEREST":
      return formatMoney(result.value);
    case "ANNUAL_RATE_PERCENT":
      return `${formatPercent(result.value)} per annum`;
    case "TIME_YEARS":
      return formatDurationYears(result.value);
  }
}

function ratioPhrase(value: Rational): string {
  if (value.denominator === 1n) return `${value.numerator} times`;
  return `${formatRational(value)} times`;
}

function contextLead(parameters: IntCp001PrototypeParameters, variant: number): string {
  const { context } = parameters;
  const leads = [
    `${context.actor} uses ${context.instrument} from ${context.institution}`,
    `For ${context.purpose}, ${context.actor} takes ${context.instrument} from ${context.institution}`,
    `${context.institution} records ${context.actor}'s ${context.instrument}`,
    `${context.actor}'s ${context.instrument} with ${context.institution}`,
  ];
  return leads[variant % leads.length]!;
}

function money(value: Rational): string {
  return formatMoney(value);
}

function percent(value: Rational): string {
  return formatPercent(value);
}

function stemFor(parameters: IntCp001PrototypeParameters): string {
  const state = parameters.hiddenState;
  const variant = deterministicIndex(`${parameters.prototypeId}:${parameters.seed}:stem`, 8);
  const lead = contextLead(parameters, variant);
  const years = formatDurationYears(state.timeYears);
  const P = money(state.principal);
  const I = money(state.simpleInterest);
  const A = money(state.amount);
  const R = percent(state.annualRatePercent);

  switch (parameters.prototypeId) {
    case "INT-CP001-PROT-SI-FROM-PRT":
      return [
        `${lead}: ${P} is placed at ${R} simple interest per annum for ${years}. What simple interest is earned?`,
        `${lead}. The principal is ${P}, the simple-interest rate is ${R} per annum, and the term is ${years}. How much interest accrues?`,
        `A principal of ${P} is kept under simple interest at ${R} per annum for ${years}. What is the interest for the full term?`,
      ][variant % 3]!;
    case "INT-CP001-PROT-AMOUNT-FROM-PRT":
      return [
        `${lead}: ${P} carries simple interest at ${R} per annum for ${years}. What total amount is due at the end?`,
        `Under simple interest, ${P} is invested for ${years} at ${R} per annum. What amount, including principal, is received?`,
        `${lead}. On a principal of ${P}, simple interest is charged at ${R} per annum for ${years}. Determine the final amount.`
      ][variant % 3]!;
    case "INT-CP001-PROT-PRINCIPAL-FROM-INTEREST":
      return [
        `${lead}: the simple interest for ${years} at ${R} per annum is ${I}. What was the original principal?`,
        `A sum earns ${I} as simple interest in ${years} at ${R} per annum. Determine the sum invested.`,
        `${I} is the simple interest on a deposit for ${years} at ${R} per annum. What principal produced this interest?`,
      ][variant % 3]!;
    case "INT-CP001-PROT-PRINCIPAL-FROM-AMOUNT":
      return [
        `${lead}: the amount after ${years} at ${R} simple interest per annum is ${A}. What was the principal?`,
        `A sum grows to ${A} in ${years} under simple interest at ${R} per annum. Determine the original sum.`,
        `At ${R} simple interest per annum, an investment amounts to ${A} after ${years}. What principal was invested?`,
      ][variant % 3]!;
    case "INT-CP001-PROT-RATE-FROM-INTEREST":
      return [
        `${lead}: ${P} earns ${I} as simple interest in ${years}. What is the annual rate of interest?`,
        `The simple interest on ${P} for ${years} is ${I}. Determine the rate per annum.`,
        `${lead}. A principal of ${P} produces ${I} simple interest over ${years}. At what annual percentage rate?`,
      ][variant % 3]!;
    case "INT-CP001-PROT-RATE-FROM-AMOUNT":
      return [
        `${lead}: ${P} amounts to ${A} in ${years} under simple interest. What is the annual rate?`,
        `A principal of ${P} becomes ${A} after ${years} at simple interest. Determine the rate per annum.`,
        `${lead}. The final amount on ${P} after ${years} is ${A}. At what simple-interest rate per annum was it placed?`,
      ][variant % 3]!;
    case "INT-CP001-PROT-TIME-FROM-INTEREST":
      return [
        `${lead}: ${P} earns ${I} at ${R} simple interest per annum. For how long was the money kept?`,
        `At ${R} simple interest per annum, ${P} produces ${I} interest. Determine the duration.`,
        `${lead}. The interest on ${P} at ${R} per annum is ${I}. What was the term of the loan or deposit?`,
      ][variant % 3]!;
    case "INT-CP001-PROT-TIME-FROM-AMOUNT":
      return [
        `${lead}: ${P} grows to ${A} at ${R} simple interest per annum. How long does this take?`,
        `A principal of ${P} amounts to ${A} at ${R} simple interest per annum. Determine the time.`,
        `${lead}. At ${R} per annum simple interest, the amount on ${P} is ${A}. What is the duration?`,
      ][variant % 3]!;
    case "INT-CP001-PROT-INTEREST-FOR-MONTHS": {
      const months = parameters.display.displayedMonths!;
      return [
        `${lead}: ${P} is charged simple interest at ${R} per annum for ${months} months. What interest is due?`,
        `A principal of ${P} remains at ${R} simple interest per annum for ${months} months. Determine the interest.`,
        `${lead}. What simple interest accrues on ${P} at ${R} per annum over ${months} months?`,
      ][variant % 3]!;
    }
    case "INT-CP001-PROT-INTEREST-FOR-DAYS": {
      const days = parameters.display.displayedDays!;
      return [
        `${lead}: ${P} is lent at ${R} simple interest per annum for ${days} days. Using a 365-day year, what interest accrues?`,
        `Using 365 days as one year, determine the simple interest on ${P} at ${R} per annum for ${days} days.`,
        `${lead}. The principal is ${P}, the rate is ${R} per annum, and the term is ${days} days on a 365-day basis. What is the interest?`,
      ][variant % 3]!;
    }
    case "INT-CP001-PROT-ANNUAL-INTEREST-FROM-TOTAL":
      return [
        `${lead}: the total simple interest for ${years} is ${I}. How much interest is earned in one year?`,
        `A sum produces ${I} simple interest over ${years} at a constant rate. Determine the annual interest.`,
        `${lead}. Since the simple interest for ${years} is ${I}, what is the interest for a single year?`,
      ][variant % 3]!;
    case "INT-CP001-PROT-INTEREST-FOR-SUBDURATION": {
      const known = formatDurationYears(parameters.display.knownTimeYears!);
      const target = formatDurationYears(parameters.display.targetTimeYears!);
      return [
        `${lead}: the simple interest for ${known} is ${I}. At the same principal and rate, what interest is earned in ${target}?`,
        `A fixed sum earns ${I} simple interest in ${known}. What would it earn in ${target} at the same rate?`,
        `${lead}. The interest over ${known} is ${I}. Determine the proportional simple interest for ${target}.`,
      ][variant % 3]!;
    }
    case "INT-CP001-PROT-RATE-FROM-AMOUNT-MULTIPLE": {
      const multiple = parameters.display.amountMultiple!;
      return [
        `Under simple interest, a sum becomes ${ratioPhrase(multiple)} the original in ${years}. What is the annual rate?`,
        `${lead}: after ${years}, the amount is ${ratioPhrase(multiple)} the principal under simple interest. Determine the rate per annum.`,
        `A principal grows to ${ratioPhrase(multiple)} itself in ${years} by simple interest. At what annual rate?`,
      ][variant % 3]!;
    }
    case "INT-CP001-PROT-TIME-FROM-AMOUNT-MULTIPLE": {
      const multiple = parameters.display.amountMultiple!;
      return [
        `At ${R} simple interest per annum, a sum becomes ${ratioPhrase(multiple)} the original. How long does this take?`,
        `${lead}: the amount reaches ${ratioPhrase(multiple)} the principal at ${R} simple interest per annum. Determine the time.`,
        `Under simple interest at ${R} per annum, after what time will the amount be ${ratioPhrase(multiple)} the principal?`,
      ][variant % 3]!;
    }
    case "INT-CP001-PROT-TIME-FROM-INTEREST-MULTIPLE": {
      const ratio = parameters.display.interestToPrincipalRatio!;
      return [
        `At ${R} simple interest per annum, the interest becomes ${ratioPhrase(ratio)} the principal. After how many years does this occur?`,
        `${lead}: the simple interest is ${ratioPhrase(ratio)} the original sum at ${R} per annum. Determine the time.`,
        `The interest earned is ${ratioPhrase(ratio)} the principal under simple interest at ${R} per annum. What is the duration?`,
      ][variant % 3]!;
    }
    case "INT-CP001-PROT-RATE-FROM-INTEREST-PRINCIPAL-RATIO": {
      const ratio = parameters.display.interestToPrincipalRatio!;
      return [
        `In ${years}, the simple interest is ${ratioPhrase(ratio)} the principal. What is the annual rate?`,
        `${lead}: over ${years}, interest equals ${ratioPhrase(ratio)} the original sum. Determine the simple-interest rate per annum.`,
        `A sum earns simple interest equal to ${ratioPhrase(ratio)} its principal in ${years}. At what annual rate?`,
      ][variant % 3]!;
    }
  }
}

function explanationFor(
  parameters: IntCp001PrototypeParameters,
  solution: IntCp001SolveResult,
): IntCp001Explanation {
  const state = parameters.hiddenState;
  const P = money(state.principal);
  const I = money(state.simpleInterest);
  const A = money(state.amount);
  const R = percent(state.annualRatePercent);
  const T = formatDurationYears(state.timeYears);
  const answer = formatIntCp001Answer(solution);
  const annualInterest = divideRational(state.simpleInterest, state.timeYears);

  switch (parameters.request.mode) {
    case "INTEREST_FROM_PRT":
      return {
        notice: `The question asks only for simple interest, so the principal ${P} is not added at the end.`,
        relation: "Use I = P × R × T / 100 after expressing the duration in years.",
        steps: [
          `Principal P = ${P}.`,
          `Annual rate R = ${R}, so the decimal rate is ${formatExact(state.annualRate)}.`,
          `Time T = ${T}.`,
          `Interest for one year is ${money(annualInterest)}.`,
          `Scaling that yearly interest by ${formatRational(state.timeYears)} gives ${I}.`,
        ],
        verification: `Adding the interest to the principal would give ${A}, confirming that ${I} is the interest portion alone.`,
        conclusion: `Therefore, the simple interest is ${answer}.`,
        commonTrap: "Do not return the total amount when the question asks only for interest.",
      };
    case "AMOUNT_FROM_PRT":
      return {
        notice: `The required answer is the amount, which includes both the original principal and the simple interest.`,
        relation: "First calculate I = P × R × T / 100, then use A = P + I.",
        steps: [
          `Principal P = ${P}.`,
          `At ${R} per annum, the interest for one year is ${money(annualInterest)}.`,
          `For ${T}, the total simple interest is ${I}.`,
          `Amount = ${P} + ${I} = ${A}.`,
        ],
        verification: `${A} − ${P} = ${I}, which matches the independently calculated interest.`,
        conclusion: `Therefore, the final amount is ${answer}.`,
        commonTrap: "Interest and amount are different answer semantics; amount includes the principal once.",
      };
    case "PRINCIPAL_FROM_INTEREST":
      return {
        notice: `The interest ${I}, rate ${R}, and time ${T} are known; the original sum is missing.`,
        relation: "Rearrange I = P × R × T / 100 to P = 100I/(RT).",
        steps: [
          `Substitute I = ${I}, R = ${R}, and T = ${formatRational(state.timeYears)} years.`,
          `The rate–time factor is ${formatExact(multiplyRational(state.annualRate, state.timeYears))}.`,
          `Dividing ${I} by that factor gives ${P}.`,
        ],
        verification: `On ${P}, the yearly interest is ${money(annualInterest)}; over ${T} it becomes exactly ${I}.`,
        conclusion: `Therefore, the principal was ${answer}.`,
        commonTrap: "Do not treat the interest itself as the principal.",
      };
    case "PRINCIPAL_FROM_AMOUNT":
      return {
        notice: `The displayed ${A} is the amount, not the interest. Under simple interest, A = P(1 + RT/100).`,
        relation: "Use P = A/(1 + RT/100).",
        steps: [
          `The interest factor for ${T} at ${R} is ${formatExact(multiplyRational(state.annualRate, state.timeYears))}.`,
          `Therefore the amount multiplier is ${formatExact(divideRational(state.amount, state.principal))}.`,
          `${A} divided by this multiplier gives ${P}.`,
        ],
        verification: `${P} earns ${I}; adding them reproduces the stated amount ${A}.`,
        conclusion: `Therefore, the original principal was ${answer}.`,
        commonTrap: "Do not use the final amount as though it were the interest numerator.",
      };
    case "RATE_FROM_INTEREST":
      return {
        notice: `The annual percentage rate is unknown, while principal, interest, and time are known.`,
        relation: "Rearrange I = PRT/100 to R = 100I/(PT).",
        steps: [
          `Use P = ${P}, I = ${I}, and T = ${formatRational(state.timeYears)} years.`,
          `The fraction I/(PT) is ${formatExact(state.annualRate)}.`,
          `Multiplying by 100 converts the decimal rate to ${R}.`,
        ],
        verification: `${P} at ${R} for ${T} earns exactly ${I}.`,
        conclusion: `Therefore, the annual simple-interest rate is ${answer}.`,
        commonTrap: "A decimal rate such as 0.08 must be converted to 8%, not reported as 0.08%.",
      };
    case "RATE_FROM_AMOUNT":
      return {
        notice: `First separate the interest from the amount: interest = amount − principal.`,
        relation: "After finding I, use R = 100I/(PT).",
        steps: [
          `${A} − ${P} = ${I}, so ${I} is the interest earned.`,
          `Now divide ${I} by P × T = ${P} × ${formatRational(state.timeYears)}.`,
          `The decimal annual rate is ${formatExact(state.annualRate)}, or ${R}.`,
        ],
        verification: `Applying ${R} to ${P} for ${T} gives interest ${I} and amount ${A}.`,
        conclusion: `Therefore, the rate is ${answer}.`,
        commonTrap: "Using the amount instead of amount minus principal produces an inflated rate.",
      };
    case "TIME_FROM_INTEREST":
      return {
        notice: `The duration is unknown, so compare the total interest with the interest earned in one year.`,
        relation: "Use T = I/(P × R/100).",
        steps: [
          `At ${R}, the yearly interest on ${P} is ${money(annualInterest)}.`,
          `Total interest is ${I}.`,
          `${I} divided by ${money(annualInterest)} gives ${formatRational(state.timeYears)} years.`,
        ],
        verification: `${money(annualInterest)} per year for ${T} equals ${I}.`,
        conclusion: `Therefore, the duration is ${answer}.`,
        commonTrap: "Do not divide by the percentage number without first accounting for the factor of 100.",
      };
    case "TIME_FROM_AMOUNT":
      return {
        notice: `The amount contains principal plus interest, so first isolate the interest.`,
        relation: "Use I = A − P, then T = I/(P × R/100).",
        steps: [
          `${A} − ${P} = ${I}.`,
          `The one-year interest at ${R} on ${P} is ${money(annualInterest)}.`,
          `${I} ÷ ${money(annualInterest)} = ${formatRational(state.timeYears)} years.`,
        ],
        verification: `For ${T}, the interest is ${I}, giving the stated amount ${A}.`,
        conclusion: `Therefore, the required time is ${answer}.`,
        commonTrap: "Do not use the full amount as the interest earned.",
      };
    case "ANNUAL_INTEREST_FROM_TOTAL":
      return {
        notice: `At simple interest, equal time intervals earn equal interest because the principal does not change.`,
        relation: "Annual interest = total interest ÷ number of years.",
        steps: [
          `Total interest for ${T} is ${I}.`,
          `Divide ${I} by ${formatRational(state.timeYears)}.`,
          `The result is ${money(annualInterest)} for one year.`,
        ],
        verification: `${money(annualInterest)} × ${formatRational(state.timeYears)} = ${I}.`,
        conclusion: `Therefore, the annual interest is ${answer}.`,
        commonTrap: "Do not report the whole-term interest as the one-year interest.",
      };
    case "INTEREST_FOR_SUBDURATION": {
      const known = parameters.display.knownTimeYears!;
      const target = parameters.display.targetTimeYears!;
      const oneYear = divideRational(state.simpleInterest, known);
      return {
        notice: `With principal and rate unchanged, simple interest is directly proportional to time.`,
        relation: "Target interest = known interest × target time / known time.",
        steps: [
          `${I} is earned in ${formatDurationYears(known)}.`,
          `Interest for one year is ${money(oneYear)}.`,
          `For ${formatDurationYears(target)}, multiply by ${formatRational(target)} to obtain ${answer}.`,
        ],
        verification: `${answer} bears the same time ratio to ${I} as ${formatDurationYears(target)} does to ${formatDurationYears(known)}.`,
        conclusion: `Therefore, the interest for the shorter duration is ${answer}.`,
        commonTrap: "Do not use inverse proportion; simple interest grows directly with time.",
      };
    }
    case "RATE_FROM_AMOUNT_MULTIPLE": {
      const multiple = parameters.display.amountMultiple!;
      const interestRatio = subtractRational(multiple, rational(1));
      return {
        notice: `If amount is ${ratioPhrase(multiple)} the principal, only ${ratioPhrase(interestRatio)} the principal is interest.`,
        relation: "For simple interest, A/P = 1 + RT/100.",
        steps: [
          `Amount multiplier = ${formatRational(multiple)}.`,
          `Interest-to-principal ratio = ${formatRational(multiple)} − 1 = ${formatRational(interestRatio)}.`,
          `Divide this ratio by ${formatRational(state.timeYears)} years and multiply by 100.`,
          `The annual rate is ${R}.`,
        ],
        verification: `At ${R} for ${T}, RT/100 = ${formatRational(interestRatio)}, so A/P = ${formatRational(multiple)}.`,
        conclusion: `Therefore, the annual rate is ${answer}.`,
        commonTrap: "Subtract 1 from the amount multiple before equating it to simple interest.",
      };
    }
    case "TIME_FROM_AMOUNT_MULTIPLE": {
      const multiple = parameters.display.amountMultiple!;
      const interestRatio = subtractRational(multiple, rational(1));
      return {
        notice: `The amount multiple includes the original principal; the interest ratio is one less.`,
        relation: "Use T = (A/P − 1)/(R/100).",
        steps: [
          `A/P = ${formatRational(multiple)}, so I/P = ${formatRational(interestRatio)}.`,
          `The annual decimal rate is ${formatExact(state.annualRate)}.`,
          `${formatRational(interestRatio)} ÷ ${formatExact(state.annualRate)} = ${formatRational(state.timeYears)} years.`,
        ],
        verification: `At ${R} for ${T}, the interest ratio is ${formatRational(interestRatio)}, giving the stated amount multiple.`,
        conclusion: `Therefore, the time required is ${answer}.`,
        commonTrap: "Using the full amount multiple instead of amount multiple minus one overstates the time.",
      };
    }
    case "TIME_FROM_INTEREST_MULTIPLE": {
      const ratio = parameters.display.interestToPrincipalRatio!;
      return {
        notice: `The given multiple already compares interest with principal, so no subtraction of 1 is needed.`,
        relation: "For SI, I/P = RT/100, hence T = (I/P)/(R/100).",
        steps: [
          `Interest-to-principal ratio = ${formatRational(ratio)}.`,
          `Annual decimal rate = ${formatExact(state.annualRate)}.`,
          `${formatRational(ratio)} ÷ ${formatExact(state.annualRate)} = ${formatRational(state.timeYears)} years.`,
        ],
        verification: `${R} for ${T} gives RT/100 = ${formatRational(ratio)}.`,
        conclusion: `Therefore, the required duration is ${answer}.`,
        commonTrap: "Do not subtract 1 when the statement already describes interest rather than amount.",
      };
    }
    case "RATE_FROM_INTEREST_PRINCIPAL_RATIO": {
      const ratio = parameters.display.interestToPrincipalRatio!;
      return {
        notice: `The interest-to-principal ratio is the product of annual decimal rate and time.`,
        relation: "Use R = 100(I/P)/T.",
        steps: [
          `I/P = ${formatRational(ratio)}.`,
          `Time = ${formatRational(state.timeYears)} years.`,
          `Decimal annual rate = ${formatRational(ratio)} ÷ ${formatRational(state.timeYears)} = ${formatExact(state.annualRate)}.`,
          `Converting to a percentage gives ${R}.`,
        ],
        verification: `${formatExact(state.annualRate)} × ${formatRational(state.timeYears)} = ${formatRational(ratio)}.`,
        conclusion: `Therefore, the annual rate is ${answer}.`,
        commonTrap: "The ratio I/P is a decimal growth fraction, not the percentage rate itself.",
      };
    }
  }
}

function reasoningGraphFor(
  parameters: IntCp001PrototypeParameters,
  solution: IntCp001SolveResult,
): IntReasoningGraph {
  const state = parameters.hiddenState;
  return {
    nodes: [
      {
        id: "given",
        kind: "GIVEN",
        text: `Identify the displayed principal, interest or amount, annual rate and duration without interchanging their roles.`,
        dependsOn: [],
      },
      {
        id: "normalise",
        kind: "NORMALISATION",
        text: `Express the rate as an exact annual fraction and the time as ${formatRational(state.timeYears)} years.`,
        mathLatex: `r=${formatRational(state.annualRate)},\\quad t=${formatRational(state.timeYears)}`,
        dependsOn: ["given"],
      },
      {
        id: "relation",
        kind: "RELATION",
        text: `Use the simple-interest identity or its exact inverse for this requested semantic.`,
        mathLatex: "I=Prt,\\quad A=P+I",
        dependsOn: ["normalise"],
      },
      {
        id: "derive",
        kind: "DERIVATION",
        text: `The exact derived answer is ${formatIntCp001Answer(solution)}.`,
        dependsOn: ["relation"],
      },
      {
        id: "verify",
        kind: "VERIFICATION",
        text: `Reconstruct the displayed evidence with the answer and confirm the same principal–rate–time state.`,
        dependsOn: ["derive"],
      },
      {
        id: "conclusion",
        kind: "CONCLUSION",
        text: `State the answer as ${formatIntCp001Answer(solution)} with its correct semantic and unit.`,
        dependsOn: ["verify"],
      },
    ],
  };
}

export function presentIntCp001(
  parameters: IntCp001PrototypeParameters,
  solution: IntCp001SolveResult,
): {
  stem: string;
  explanation: IntCp001Explanation;
  reasoningGraph: IntReasoningGraph;
} {
  return {
    stem: stemFor(parameters),
    explanation: explanationFor(parameters, solution),
    reasoningGraph: reasoningGraphFor(parameters, solution),
  };
}

export function answerSemanticLabel(semantic: IntAnswerSemantic): string {
  return semantic.toLowerCase().replace(/_/gu, " ");
}
