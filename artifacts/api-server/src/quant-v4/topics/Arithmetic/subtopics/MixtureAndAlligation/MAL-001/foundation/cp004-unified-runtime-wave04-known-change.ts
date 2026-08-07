import {
  addRational,
  divideRational,
  formatRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";
import {
  MAL_CP004_WAVE04_INITIAL_FROM_EVAPORATION_CASES,
  MAL_CP004_WAVE04_KNOWN_SOLVENT_CHANGE_CASES,
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

function knownChangeStem(input: {
  seed: string;
  initialTotal: Rational;
  initialRate: Rational;
  solventChange: Rational;
  direction: "ADD" | "EVAPORATE";
  context: { container: string; tracked: string; other: string };
}): string {
  const action =
    input.direction === "ADD"
      ? `${formatRational(input.solventChange)} litres of ${input.context.other} is added`
      : `${formatRational(input.solventChange)} litres of ${input.context.other} evaporates`;
  const templates = [
    `A ${input.context.container} contains ${formatRational(input.initialTotal)} litres of a ${malCp004Wave04Percent(input.initialRate)} ${input.context.tracked} solution. If ${action}, what is the new concentration of ${input.context.tracked}?`,
    `${formatRational(input.initialTotal)} litres of solution contains ${malCp004Wave04Percent(input.initialRate)} ${input.context.tracked} and the rest is ${input.context.other}. After ${action}, find the final ${input.context.tracked} percentage.`,
    `A mixture of ${input.context.tracked} and ${input.context.other} has volume ${formatRational(input.initialTotal)} litres and strength ${malCp004Wave04Percent(input.initialRate)}. When ${action}, what will its strength be?`,
    `The initial ${input.context.tracked} concentration in a ${input.context.container} is ${malCp004Wave04Percent(input.initialRate)} and the total volume is ${formatRational(input.initialTotal)} litres. ${action[0]!.toUpperCase()}${action.slice(1)}. Determine the final concentration.`,
    `A complete ${formatRational(input.initialTotal)}-litre solution is ${malCp004Wave04Percent(input.initialRate)} ${input.context.tracked}. Only the ${input.context.other} quantity changes: ${action}. What percent ${input.context.tracked} remains in the final solution?`,
    `Initially, ${input.context.tracked} forms ${malCp004Wave04Percent(input.initialRate)} of ${formatRational(input.initialTotal)} litres. After ${action}, calculate the new ${input.context.tracked} strength.`,
  ] as const;
  return templates[malCp004Wave04VariantIndex(`${input.seed}:stem`, templates.length)]!;
}

export function generateMalCp004Wave04KnownSolventChange(
  seed: string,
): MalCp004Wave04Question {
  const selected = malCp004Wave04Pick(
    MAL_CP004_WAVE04_KNOWN_SOLVENT_CHANGE_CASES,
    `${seed}:case`,
  );
  const context = malCp004Wave04Pick(
    MAL_CP004_WAVE04_LIQUID_CONTEXTS,
    `${seed}:context`,
  );
  const initialTotal = rational(selected.initialTotal);
  const initialRate = fraction(selected.initialRate);
  const solventChange = rational(selected.solventChange);
  const tracked = multiplyRational(initialTotal, initialRate);
  const initialOther = subtractRational(initialTotal, tracked);
  const finalTotal =
    selected.direction === "ADD"
      ? addRational(initialTotal, solventChange)
      : subtractRational(initialTotal, solventChange);
  const finalRate = divideRational(tracked, finalTotal);
  const finalOther = subtractRational(finalTotal, tracked);
  const oppositeTotal =
    selected.direction === "ADD"
      ? subtractRational(initialTotal, solventChange)
      : addRational(initialTotal, solventChange);
  const oppositeRate = divideRational(tracked, oppositeTotal);
  const changeFraction = divideRational(solventChange, initialTotal);
  const linearRate =
    selected.direction === "ADD"
      ? subtractRational(initialRate, changeFraction)
      : addRational(initialRate, changeFraction);
  const inflatedDenominatorRate = divideRational(
    tracked,
    addRational(finalTotal, tracked),
  );
  const options = malCp004Wave04BuildOptions({
    answerValue: finalRate,
    answerUnit: "percent",
    seed: `${seed}:options`,
    distractors: [
      { value: initialRate, misconceptionId: "kept_original_percentage" },
      {
        value: oppositeRate,
        misconceptionId: "used_opposite_solvent_direction",
      },
      {
        value: linearRate,
        misconceptionId: "changed_percentage_points_linearly",
      },
      {
        value: divideRational(solventChange, finalTotal),
        misconceptionId: "treated_solvent_change_as_solute",
      },
      {
        value: inflatedDenominatorRate,
        misconceptionId: "added_solute_to_final_denominator",
      },
      {
        value: subtractRational(rational(1), finalRate),
        misconceptionId: "reported_solvent_percentage",
      },
    ],
  });
  return malCp004Wave04Package({
    effectiveContractId:
      "MAL-CP004-EFF-FINAL-CONCENTRATION-AFTER-SOLVENT-CHANGE",
    representationVariant:
      selected.direction === "ADD"
        ? "FINAL_CONCENTRATION_AFTER_SOLVENT_ADDITION"
        : "FINAL_CONCENTRATION_AFTER_SOLVENT_EVAPORATION",
    seed,
    difficulty: "Medium",
    sourceEvidenceIds:
      selected.direction === "ADD"
        ? ["RSA-QA-PCT-Q332-KNOWN-DILUTION-STRENGTH"]
        : ["RSA-QA-PCT-Q330-KNOWN-EVAPORATION-STRENGTH"],
    sourceMatchKind: "DIRECT_TASK_MATCH",
    stem: knownChangeStem({
      seed,
      initialTotal,
      initialRate,
      solventChange,
      direction: selected.direction,
      context,
    }),
    answer: options.answer,
    answerValue: finalRate,
    answerUnit: "percent",
    options: options.options,
    correctIndex: options.correctIndex,
    optionAudit: options.optionAudit,
    explanation: {
      layoutId: "MAL-CP004-EN-CONSERVED-QUANTITY-UNIFIED-V1",
      concept: `The amount of ${context.tracked} remains fixed because only ${context.other} is added or removed.`,
      calculation: [
        `Initial ${context.tracked} = ${formatRational(initialTotal)} × ${formatRational(initialRate)} = ${formatRational(tracked)} litres.`,
        `Final total = ${formatRational(initialTotal)} ${selected.direction === "ADD" ? "+" : "−"} ${formatRational(solventChange)} = ${formatRational(finalTotal)} litres.`,
        `Final concentration = ${formatRational(tracked)}/${formatRational(finalTotal)} = ${formatRational(finalRate)} = ${options.answer}.`,
      ],
      verification: `${options.answer} of ${formatRational(finalTotal)} litres equals ${formatRational(tracked)} litres of ${context.tracked}, the unchanged initial amount.`,
      conclusion: `The final ${context.tracked} concentration is ${options.answer}.`,
      fastMethod: "Keep the solute amount fixed and divide it by the new total volume.",
      commonMistake: "Do not add or subtract the solvent quantity directly from the percentage.",
    },
    ledger: {
      type: "CONSERVED_QUANTITY_TABLE",
      title:
        selected.direction === "ADD"
          ? "Final concentration after solvent addition"
          : "Final concentration after solvent evaporation",
      conservedLabel: context.tracked,
      rows: [
        {
          stage: "Initially",
          total: malCp004Wave04Quantity(initialTotal, "litres"),
          conserved: `${formatRational(tracked)} litres ${context.tracked}`,
          changing: `${formatRational(initialOther)} litres ${context.other}`,
          rate: malCp004Wave04Percent(initialRate),
        },
        {
          stage:
            selected.direction === "ADD"
              ? `After adding ${context.other}`
              : `After ${context.other} evaporates`,
          total: malCp004Wave04Quantity(finalTotal, "litres"),
          conserved: `${formatRational(tracked)} litres ${context.tracked}`,
          changing: `${formatRational(finalOther)} litres ${context.other}`,
          rate: options.answer,
        },
      ],
      accessibleText: `${context.tracked} remains ${formatRational(tracked)} litres while total volume changes from ${formatRational(initialTotal)} to ${formatRational(finalTotal)} litres.`,
    },
    exactState: {
      initialTotal,
      initialRate,
      solventChange,
      direction: selected.direction,
      trackedAmount: tracked,
      initialOther,
      finalTotal,
      finalOther,
      finalRate,
    },
  });
}

function initialTotalStem(input: {
  seed: string;
  evaporated: Rational;
  initialRate: Rational;
  targetRate: Rational;
  context: { container: string; tracked: string; other: string };
}): string {
  const templates = [
    `After ${formatRational(input.evaporated)} litres of ${input.context.other} evaporates from a ${malCp004Wave04Percent(input.initialRate)} ${input.context.tracked} solution, its concentration becomes ${malCp004Wave04Percent(input.targetRate)}. What was the initial volume of the solution?`,
    `A ${input.context.container} initially contains a ${malCp004Wave04Percent(input.initialRate)} ${input.context.tracked} solution. When ${formatRational(input.evaporated)} litres of ${input.context.other} evaporates, the strength rises to ${malCp004Wave04Percent(input.targetRate)}. Find the original volume.`,
    `${formatRational(input.evaporated)} litres of ${input.context.other} is lost by evaporation from a solution whose ${input.context.tracked} strength changes from ${malCp004Wave04Percent(input.initialRate)} to ${malCp004Wave04Percent(input.targetRate)}. Determine the initial quantity.`,
    `Only ${input.context.other} evaporates from a ${input.context.tracked} solution. The concentration rises from ${malCp004Wave04Percent(input.initialRate)} to ${malCp004Wave04Percent(input.targetRate)} after ${formatRational(input.evaporated)} litres evaporates. What was the starting volume?`,
    `A solution becomes ${malCp004Wave04Percent(input.targetRate)} ${input.context.tracked} after losing ${formatRational(input.evaporated)} litres of ${input.context.other}; initially it was ${malCp004Wave04Percent(input.initialRate)} ${input.context.tracked}. Find its initial volume.`,
    `The amount of ${input.context.tracked} stays unchanged while ${formatRational(input.evaporated)} litres of ${input.context.other} evaporates. If the strength changes from ${malCp004Wave04Percent(input.initialRate)} to ${malCp004Wave04Percent(input.targetRate)}, how much solution was present initially?`,
  ] as const;
  return templates[malCp004Wave04VariantIndex(`${input.seed}:stem`, templates.length)]!;
}

export function generateMalCp004Wave04InitialTotalFromEvaporation(
  seed: string,
): MalCp004Wave04Question {
  const selected = malCp004Wave04Pick(
    MAL_CP004_WAVE04_INITIAL_FROM_EVAPORATION_CASES,
    `${seed}:case`,
  );
  const context = malCp004Wave04Pick(
    MAL_CP004_WAVE04_LIQUID_CONTEXTS,
    `${seed}:context`,
  );
  const evaporated = rational(selected.evaporated);
  const initialRate = fraction(selected.initialRate);
  const targetRate = fraction(selected.targetRate);
  const rateIncrease = subtractRational(targetRate, initialRate);
  const initialTotal = divideRational(
    multiplyRational(evaporated, targetRate),
    rateIncrease,
  );
  const tracked = multiplyRational(initialTotal, initialRate);
  const finalTotal = subtractRational(initialTotal, evaporated);
  const initialOther = subtractRational(initialTotal, tracked);
  const finalOther = subtractRational(finalTotal, tracked);
  const options = malCp004Wave04BuildOptions({
    answerValue: initialTotal,
    answerUnit: "litres",
    seed: `${seed}:options`,
    distractors: [
      { value: finalTotal, misconceptionId: "reported_final_total" },
      {
        value: divideRational(evaporated, targetRate),
        misconceptionId: "divided_evaporation_by_final_rate",
      },
      {
        value: divideRational(evaporated, rateIncrease),
        misconceptionId: "omitted_final_rate_numerator",
      },
      {
        value: divideRational(
          multiplyRational(evaporated, initialRate),
          rateIncrease,
        ),
        misconceptionId: "used_initial_rate_in_numerator",
      },
      {
        value: divideRational(
          evaporated,
          subtractRational(rational(1), targetRate),
        ),
        misconceptionId: "treated_evaporation_as_final_solvent",
      },
      { value: tracked, misconceptionId: "reported_conserved_solute" },
    ],
  });
  return malCp004Wave04Package({
    effectiveContractId: "MAL-CP004-EFF-INITIAL-TOTAL-FROM-EVAPORATION",
    representationVariant: "INITIAL_TOTAL_BEFORE_EVAPORATION",
    seed,
    difficulty: "Hard",
    sourceEvidenceIds: [
      "RSA-QA-PCT-EX43-EVAPORATION-ORIGINAL-MASS",
      "MAL-CP004-GAP-INITIAL-TOTAL-FROM-EVAPORATED-QUANTITY",
    ],
    sourceMatchKind: "DIRECT_TASK_MATCH",
    stem: initialTotalStem({
      seed,
      evaporated,
      initialRate,
      targetRate,
      context,
    }),
    answer: options.answer,
    answerValue: initialTotal,
    answerUnit: "litres",
    options: options.options,
    correctIndex: options.correctIndex,
    optionAudit: options.optionAudit,
    explanation: {
      layoutId: "MAL-CP004-EN-CONSERVED-QUANTITY-UNIFIED-V1",
      concept: `The amount of ${context.tracked} is the same before and after evaporation.`,
      calculation: [
        `Let the initial volume be V litres. Final volume = V − ${formatRational(evaporated)}.`,
        `${formatRational(initialRate)}V = ${formatRational(targetRate)}(V − ${formatRational(evaporated)}).`,
        `${formatRational(rateIncrease)}V = ${formatRational(multiplyRational(evaporated, targetRate))}, so V = ${formatRational(initialTotal)} litres.`,
      ],
      verification: `Initial ${context.tracked} = ${formatRational(initialTotal)} × ${formatRational(initialRate)} = ${formatRational(tracked)} litres, and final ${context.tracked} = ${formatRational(finalTotal)} × ${formatRational(targetRate)} = ${formatRational(tracked)} litres.`,
      conclusion: `The initial solution volume was ${options.answer}.`,
      fastMethod: "Equate the solute amount before and after evaporation and solve the one-variable equation.",
      commonMistake: "Do not treat the evaporated quantity as a percentage of the original solution without using both concentrations.",
    },
    ledger: {
      type: "CONSERVED_QUANTITY_TABLE",
      title: "Recovering initial volume from evaporation",
      conservedLabel: context.tracked,
      rows: [
        {
          stage: "Initially",
          total: malCp004Wave04Quantity(initialTotal, "litres"),
          conserved: `${formatRational(tracked)} litres ${context.tracked}`,
          changing: `${formatRational(initialOther)} litres ${context.other}`,
          rate: malCp004Wave04Percent(initialRate),
        },
        {
          stage: "After evaporation",
          total: malCp004Wave04Quantity(finalTotal, "litres"),
          conserved: `${formatRational(tracked)} litres ${context.tracked}`,
          changing: `${formatRational(finalOther)} litres ${context.other}`,
          rate: malCp004Wave04Percent(targetRate),
        },
      ],
      accessibleText: `${context.tracked} remains ${formatRational(tracked)} litres while ${formatRational(evaporated)} litres of ${context.other} evaporates.`,
    },
    exactState: {
      evaporated,
      initialRate,
      targetRate,
      initialTotal,
      trackedAmount: tracked,
      finalTotal,
      initialOther,
      finalOther,
    },
  });
}
