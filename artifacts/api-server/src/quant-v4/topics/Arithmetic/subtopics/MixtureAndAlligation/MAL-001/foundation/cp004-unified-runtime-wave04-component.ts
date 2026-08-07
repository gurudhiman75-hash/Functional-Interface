import {
  addRational,
  divideRational,
  formatRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";
import {
  MAL_CP004_WAVE04_COMPONENT_RATES,
  MAL_CP004_WAVE04_COMPONENT_TOTALS,
  MAL_CP004_WAVE04_LIQUID_CONTEXTS,
  type FractionTuple,
} from "./cp004-unified-runtime-wave04-data";
import {
  malCp004Wave04BuildOptions,
  malCp004Wave04Percent,
  malCp004Wave04Pick,
  malCp004Wave04Quantity,
  malCp004Wave04VariantIndex,
} from "./cp004-unified-runtime-wave04-core";
import { malCp004Wave04Package } from "./cp004-unified-runtime-wave04-package";
import type { MalCp004Wave04Question } from "./cp004-unified-runtime-wave04-types";
import type { Rational } from "./types";

function fraction(value: FractionTuple): Rational {
  return rational(value[0], value[1]);
}

function componentState(seed: string) {
  const total = rational(
    malCp004Wave04Pick(MAL_CP004_WAVE04_COMPONENT_TOTALS, `${seed}:total`),
  );
  const rate = fraction(
    malCp004Wave04Pick(MAL_CP004_WAVE04_COMPONENT_RATES, `${seed}:rate`),
  );
  const tracked = multiplyRational(total, rate);
  const other = subtractRational(total, tracked);
  const context = malCp004Wave04Pick(
    MAL_CP004_WAVE04_LIQUID_CONTEXTS,
    `${seed}:context`,
  );
  return { total, rate, tracked, other, context };
}

function componentAmountStem(input: {
  seed: string;
  total: Rational;
  rate: Rational;
  requested: string;
  context: { container: string; tracked: string; other: string };
}): string {
  const totalText = formatRational(input.total);
  const rateText = malCp004Wave04Percent(input.rate);
  const templates = [
    `A ${input.context.container} contains ${totalText} litres of a ${rateText} ${input.context.tracked} solution. How many litres of ${input.requested} does it contain?`,
    `In ${totalText} litres of solution, ${input.context.tracked} forms ${rateText} of the total and the rest is ${input.context.other}. Find the quantity of ${input.requested}.`,
    `A ${totalText}-litre mixture contains ${input.context.tracked} and ${input.context.other}. If the ${input.context.tracked} concentration is ${rateText}, how much ${input.requested} is present?`,
    `A ${input.context.container} holds ${totalText} litres of ${input.context.tracked} solution of strength ${rateText}. Determine the amount of ${input.requested}.`,
    `The ${input.context.tracked} content of a ${totalText}-litre solution is ${rateText}; the remaining liquid is ${input.context.other}. What is the quantity of ${input.requested}?`,
    `A solution has total volume ${totalText} litres and contains ${rateText} ${input.context.tracked}. How many litres of ${input.requested} are in it?`,
  ] as const;
  return templates[malCp004Wave04VariantIndex(`${input.seed}:stem`, templates.length)]!;
}

export function generateMalCp004Wave04ComponentAmount(
  seed: string,
): MalCp004Wave04Question {
  const state = componentState(seed);
  const otherVariant = malCp004Wave04VariantIndex(`${seed}:output`, 2) === 1;
  const answerValue = otherVariant ? state.other : state.tracked;
  const requested = otherVariant ? state.context.other : state.context.tracked;
  const complement = otherVariant ? state.tracked : state.other;
  const options = malCp004Wave04BuildOptions({
    answerValue,
    answerUnit: "litres",
    seed: `${seed}:options`,
    distractors: [
      { value: complement, misconceptionId: "used_other_component_percentage" },
      { value: state.total, misconceptionId: "reported_total_quantity" },
      {
        value: divideRational(state.total, state.rate),
        misconceptionId: "divided_total_by_concentration",
      },
      {
        value: multiplyRational(state.rate, rational(100)),
        misconceptionId: "treated_percentage_number_as_litres",
      },
      {
        value: multiplyRational(answerValue, state.rate),
        misconceptionId: "applied_concentration_twice",
      },
      {
        value: divideRational(answerValue, rational(100)),
        misconceptionId: "divided_quantity_by_100_again",
      },
    ],
  });
  return malCp004Wave04Package({
    effectiveContractId: "MAL-CP004-EFF-COMPONENT-AMOUNT",
    representationVariant: otherVariant
      ? "OTHER_COMPONENT_AMOUNT"
      : "TRACKED_COMPONENT_AMOUNT",
    seed,
    difficulty: "Easy",
    sourceEvidenceIds: [
      "RSA-QA-PCT-EX42-PURE-SALT-ADDITION",
      "PCT-007/PCT-CP-005/findComponentFromTotalAndRate",
      "PCT-007/PCT-CP-005/findOtherComponentFromTotalAndRate",
    ],
    sourceMatchKind: "FORMULA_EQUIVALENT_DIRECTION",
    stem: componentAmountStem({
      seed,
      total: state.total,
      rate: state.rate,
      requested,
      context: state.context,
    }),
    answer: options.answer,
    answerValue,
    answerUnit: "litres",
    options: options.options,
    correctIndex: options.correctIndex,
    optionAudit: options.optionAudit,
    explanation: {
      layoutId: "MAL-CP004-EN-CONSERVED-QUANTITY-UNIFIED-V1",
      concept: `The concentration gives the fraction of the total occupied by ${state.context.tracked}. The remaining fraction belongs to ${state.context.other}.`,
      calculation: otherVariant
        ? [
            `${state.context.other} fraction = 1 − ${formatRational(state.rate)} = ${formatRational(subtractRational(rational(1), state.rate))}.`,
            `${state.context.other} quantity = ${formatRational(state.total)} × ${formatRational(subtractRational(rational(1), state.rate))} = ${formatRational(answerValue)} litres.`,
          ]
        : [
            `${state.context.tracked} fraction = ${malCp004Wave04Percent(state.rate)} = ${formatRational(state.rate)}.`,
            `${state.context.tracked} quantity = ${formatRational(state.total)} × ${formatRational(state.rate)} = ${formatRational(answerValue)} litres.`,
          ],
      verification: `${formatRational(state.tracked)} litres of ${state.context.tracked} and ${formatRational(state.other)} litres of ${state.context.other} add to ${formatRational(state.total)} litres.`,
      conclusion: `The quantity of ${requested} is ${options.answer}.`,
      fastMethod: otherVariant
        ? "Use the complement of the stated concentration and multiply by the total."
        : "Multiply the total quantity by the concentration fraction.",
      commonMistake: `Do not report the quantity of ${otherVariant ? state.context.tracked : state.context.other} when the question asks for ${requested}.`,
    },
    ledger: {
      type: "CONSERVED_QUANTITY_TABLE",
      title: "Component quantities in the solution",
      conservedLabel: state.context.tracked,
      rows: [
        {
          stage: "Given solution",
          total: malCp004Wave04Quantity(state.total, "litres"),
          conserved: `${formatRational(state.tracked)} litres ${state.context.tracked}`,
          changing: `${formatRational(state.other)} litres ${state.context.other}`,
          rate: malCp004Wave04Percent(state.rate),
        },
      ],
      accessibleText: `${state.context.tracked} and ${state.context.other} together account for the complete ${formatRational(state.total)}-litre solution.`,
    },
    exactState: {
      total: state.total,
      trackedRate: state.rate,
      trackedAmount: state.tracked,
      otherAmount: state.other,
      requestedComponent: requested,
    },
  });
}

function concentrationStem(input: {
  seed: string;
  total: Rational;
  tracked: Rational;
  other: Rational;
  context: { container: string; tracked: string; other: string };
}): string {
  const templates = [
    `A ${input.context.container} contains ${formatRational(input.tracked)} litres of ${input.context.tracked} and ${formatRational(input.other)} litres of ${input.context.other}. What is the concentration of ${input.context.tracked}?`,
    `A solution consists of ${formatRational(input.tracked)} litres of ${input.context.tracked} and ${formatRational(input.other)} litres of ${input.context.other}. Find the percentage of ${input.context.tracked}.`,
    `In a ${formatRational(input.total)}-litre mixture, ${formatRational(input.tracked)} litres is ${input.context.tracked} and the rest is ${input.context.other}. Determine the ${input.context.tracked} concentration.`,
    `A ${input.context.container} holds a total of ${formatRational(input.total)} litres, including ${formatRational(input.tracked)} litres of ${input.context.tracked}. What percent of the mixture is ${input.context.tracked}?`,
    `${formatRational(input.tracked)} litres of ${input.context.tracked} is mixed with ${formatRational(input.other)} litres of ${input.context.other}. What is the strength of ${input.context.tracked} in the resulting solution?`,
    `The complete solution contains ${formatRational(input.tracked)} litres of ${input.context.tracked} and ${formatRational(input.other)} litres of ${input.context.other}. Find its ${input.context.tracked} percentage.`,
  ] as const;
  return templates[malCp004Wave04VariantIndex(`${input.seed}:stem`, templates.length)]!;
}

export function generateMalCp004Wave04Concentration(
  seed: string,
): MalCp004Wave04Question {
  const state = componentState(seed);
  const inflatedTotal = addRational(state.total, state.tracked);
  const options = malCp004Wave04BuildOptions({
    answerValue: state.rate,
    answerUnit: "percent",
    seed: `${seed}:options`,
    distractors: [
      {
        value: subtractRational(rational(1), state.rate),
        misconceptionId: "reported_other_component_percentage",
      },
      {
        value: divideRational(state.tracked, inflatedTotal),
        misconceptionId: "added_component_to_denominator",
      },
      {
        value: multiplyRational(state.rate, state.rate),
        misconceptionId: "applied_percentage_twice",
      },
      {
        value: divideRational(state.rate, rational(100)),
        misconceptionId: "forgot_fraction_to_percent_conversion",
      },
      {
        value: divideRational(
          state.other,
          addRational(state.total, state.other),
        ),
        misconceptionId: "used_other_component_with_inflated_total",
      },
    ],
  });
  return malCp004Wave04Package({
    effectiveContractId: "MAL-CP004-EFF-CONCENTRATION",
    representationVariant: "TRACKED_COMPONENT_PERCENT",
    seed,
    difficulty: "Easy",
    sourceEvidenceIds: [
      "RSA-QA-PCT-Q330-KNOWN-EVAPORATION-STRENGTH",
      "PCT-007/PCT-CP-005/findRateFromComponentAndTotal",
    ],
    sourceMatchKind: "FORMULA_EQUIVALENT_DIRECTION",
    stem: concentrationStem({ seed, ...state }),
    answer: options.answer,
    answerValue: state.rate,
    answerUnit: "percent",
    options: options.options,
    correctIndex: options.correctIndex,
    optionAudit: options.optionAudit,
    explanation: {
      layoutId: "MAL-CP004-EN-CONSERVED-QUANTITY-UNIFIED-V1",
      concept: "Concentration is the required component quantity divided by the complete solution quantity.",
      calculation: [
        `Total solution = ${formatRational(state.tracked)} + ${formatRational(state.other)} = ${formatRational(state.total)} litres.`,
        `${state.context.tracked} fraction = ${formatRational(state.tracked)}/${formatRational(state.total)} = ${formatRational(state.rate)}.`,
        `${state.context.tracked} concentration = ${formatRational(state.rate)} × 100 = ${options.answer}.`,
      ],
      verification: `${options.answer} of ${formatRational(state.total)} litres is ${formatRational(state.tracked)} litres, matching the stated ${state.context.tracked} amount.`,
      conclusion: `The ${state.context.tracked} concentration is ${options.answer}.`,
      fastMethod: "Divide the component quantity by the total and multiply by 100.",
      commonMistake: `Use the complete solution as the denominator, not only the ${state.context.other} quantity.`,
    },
    ledger: {
      type: "CONSERVED_QUANTITY_TABLE",
      title: "Concentration from complete component quantities",
      conservedLabel: state.context.tracked,
      rows: [
        {
          stage: "Given solution",
          total: malCp004Wave04Quantity(state.total, "litres"),
          conserved: `${formatRational(state.tracked)} litres ${state.context.tracked}`,
          changing: `${formatRational(state.other)} litres ${state.context.other}`,
          rate: options.answer,
        },
      ],
      accessibleText: `${formatRational(state.tracked)} litres of ${state.context.tracked} forms part of the complete ${formatRational(state.total)}-litre mixture.`,
    },
    exactState: {
      total: state.total,
      trackedRate: state.rate,
      trackedAmount: state.tracked,
      otherAmount: state.other,
    },
  });
}

function totalStem(input: {
  seed: string;
  givenAmount: Rational;
  rate: Rational;
  givenLabel: string;
  tracked: string;
  other: string;
  container: string;
}): string {
  const templates = [
    `A ${input.container} contains a ${malCp004Wave04Percent(input.rate)} ${input.tracked} solution. If it contains ${formatRational(input.givenAmount)} litres of ${input.givenLabel}, what is the total quantity of the solution?`,
    `${input.tracked} forms ${malCp004Wave04Percent(input.rate)} of a solution and ${formatRational(input.givenAmount)} litres of ${input.givenLabel} is present. Find the total volume.`,
    `A mixture contains ${input.tracked} and ${input.other}. The ${input.tracked} concentration is ${malCp004Wave04Percent(input.rate)}, while the amount of ${input.givenLabel} is ${formatRational(input.givenAmount)} litres. What is the total volume?`,
    `In a ${malCp004Wave04Percent(input.rate)} ${input.tracked} solution, ${input.givenLabel} measures ${formatRational(input.givenAmount)} litres. Determine the complete solution quantity.`,
    `The proportion of ${input.tracked} in a ${input.container} is ${malCp004Wave04Percent(input.rate)}. Given ${formatRational(input.givenAmount)} litres of ${input.givenLabel}, calculate the total mixture.`,
    `A solution is made only of ${input.tracked} and ${input.other}. If ${input.tracked} is ${malCp004Wave04Percent(input.rate)} and ${input.givenLabel} is ${formatRational(input.givenAmount)} litres, how much solution is there altogether?`,
  ] as const;
  return templates[malCp004Wave04VariantIndex(`${input.seed}:stem`, templates.length)]!;
}

export function generateMalCp004Wave04TotalFromRate(
  seed: string,
): MalCp004Wave04Question {
  const state = componentState(seed);
  const otherVariant = malCp004Wave04VariantIndex(`${seed}:output`, 2) === 1;
  const givenAmount = otherVariant ? state.other : state.tracked;
  const givenRate = otherVariant
    ? subtractRational(rational(1), state.rate)
    : state.rate;
  const givenLabel = otherVariant ? state.context.other : state.context.tracked;
  const options = malCp004Wave04BuildOptions({
    answerValue: state.total,
    answerUnit: "litres",
    seed: `${seed}:options`,
    distractors: [
      {
        value: multiplyRational(givenAmount, givenRate),
        misconceptionId: "multiplied_component_by_rate",
      },
      {
        value: divideRational(
          givenAmount,
          subtractRational(rational(1), givenRate),
        ),
        misconceptionId: "used_complement_rate",
      },
      {
        value: addRational(
          givenAmount,
          multiplyRational(givenRate, rational(100)),
        ),
        misconceptionId: "added_percentage_number_as_quantity",
      },
      {
        value: multiplyRational(
          givenAmount,
          addRational(rational(1), givenRate),
        ),
        misconceptionId: "increased_component_by_rate",
      },
      {
        value: divideRational(
          givenAmount,
          addRational(rational(1), givenRate),
        ),
        misconceptionId: "divided_by_one_plus_rate",
      },
      {
        value: otherVariant ? state.tracked : state.other,
        misconceptionId: "reported_ungiven_component",
      },
    ],
  });
  return malCp004Wave04Package({
    effectiveContractId: "MAL-CP004-EFF-TOTAL-FROM-COMPONENT-RATE",
    representationVariant: otherVariant
      ? "TOTAL_FROM_OTHER_COMPONENT"
      : "TOTAL_FROM_TRACKED_COMPONENT",
    seed,
    difficulty: "Medium",
    sourceEvidenceIds: [
      "PCT-007/PCT-CP-005/findTotalFromComponentAndRate",
      "PCT-007/PCT-CP-005/findTotalFromOtherComponentAndRate",
      "MAL-CP004-WAVE03-EQUIVALENCE-CLOSURE",
    ],
    sourceMatchKind: "INTERNAL_COLLISION_AUTHORITY",
    stem: totalStem({
      seed,
      givenAmount,
      rate: state.rate,
      givenLabel,
      tracked: state.context.tracked,
      other: state.context.other,
      container: state.context.container,
    }),
    answer: options.answer,
    answerValue: state.total,
    answerUnit: "litres",
    options: options.options,
    correctIndex: options.correctIndex,
    optionAudit: options.optionAudit,
    explanation: {
      layoutId: "MAL-CP004-EN-CONSERVED-QUANTITY-UNIFIED-V1",
      concept: `The given ${givenLabel} quantity equals its fraction of the complete solution. Divide the quantity by that fraction to recover the total.`,
      calculation: [
        `${givenLabel} fraction = ${formatRational(givenRate)}.`,
        `Total quantity = ${formatRational(givenAmount)} ÷ ${formatRational(givenRate)} = ${formatRational(state.total)} litres.`,
      ],
      verification: `${formatRational(state.total)} × ${formatRational(givenRate)} = ${formatRational(givenAmount)} litres of ${givenLabel}.`,
      conclusion: `The total solution quantity is ${options.answer}.`,
      fastMethod: "Divide the known component quantity by its fraction of the total.",
      commonMistake: `Do not multiply by the percentage; the total must be larger than the known ${givenLabel} amount.`,
    },
    ledger: {
      type: "CONSERVED_QUANTITY_TABLE",
      title: "Recovering the complete solution",
      conservedLabel: givenLabel,
      rows: [
        {
          stage: "Recovered complete solution",
          total: malCp004Wave04Quantity(state.total, "litres"),
          conserved: `${formatRational(givenAmount)} litres ${givenLabel}`,
          changing: `${formatRational(otherVariant ? state.tracked : state.other)} litres ${otherVariant ? state.context.tracked : state.context.other}`,
          rate: malCp004Wave04Percent(givenRate),
        },
      ],
      accessibleText: `${formatRational(givenAmount)} litres is ${malCp004Wave04Percent(givenRate)} of the complete ${formatRational(state.total)}-litre solution.`,
    },
    exactState: {
      total: state.total,
      trackedRate: state.rate,
      trackedAmount: state.tracked,
      otherAmount: state.other,
      givenComponent: givenLabel,
      givenRate,
      givenAmount,
    },
  });
}
