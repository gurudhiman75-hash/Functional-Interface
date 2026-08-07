import {
  addRational,
  divideRational,
  formatRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";
import {
  MAL_CP004_WAVE04_DILUTION_CASES,
  MAL_CP004_WAVE04_EVAPORATION_CASES,
  MAL_CP004_WAVE04_LIQUID_CONTEXTS,
  MAL_CP004_WAVE04_PURE_ADDITION_CASES,
  type FractionTuple,
  type MalCp004Wave04TargetCase,
} from "./cp004-unified-runtime-wave04-data";
import {
  malCp004Wave04BuildOptions,
  malCp004Wave04Percent,
  malCp004Wave04Pick,
  malCp004Wave04Quantity,
  malCp004Wave04VariantIndex,
} from "./cp004-unified-runtime-wave04-core";
import { malCp004Wave04Package } from "./cp004-unified-runtime-wave04-package";
import { solveMalCp004 } from "./cp004-solver";
import type { MalCp004Wave04Question } from "./cp004-unified-runtime-wave04-types";
import type { Rational } from "./types";

function fraction(value: FractionTuple): Rational {
  return rational(value[0], value[1]);
}

function targetState(seed: string, pool: readonly MalCp004Wave04TargetCase[]) {
  const selected = malCp004Wave04Pick(pool, `${seed}:case`);
  const context = malCp004Wave04Pick(
    MAL_CP004_WAVE04_LIQUID_CONTEXTS,
    `${seed}:context`,
  );
  return {
    initialTotal: rational(selected.initialTotal),
    initialRate: fraction(selected.initialRate),
    targetRate: fraction(selected.targetRate),
    context,
  };
}

function targetStem(input: {
  seed: string;
  action: string;
  initialTotal: Rational;
  initialRate: Rational;
  targetRate: Rational;
  context: { container: string; tracked: string; other: string };
}): string {
  const total = formatRational(input.initialTotal);
  const initial = malCp004Wave04Percent(input.initialRate);
  const target = malCp004Wave04Percent(input.targetRate);
  const templates = [
    `A ${input.context.container} contains ${total} litres of a ${initial} ${input.context.tracked} solution. ${input.action} to make its concentration ${target}?`,
    `${total} litres of solution contains ${initial} ${input.context.tracked} and the rest is ${input.context.other}. ${input.action} so that ${input.context.tracked} becomes ${target} of the solution?`,
    `A ${input.context.container} holds a ${total}-litre mixture of ${input.context.tracked} and ${input.context.other}, with ${input.context.tracked} at ${initial}. ${input.action} to obtain a ${target} solution?`,
    `The strength of ${input.context.tracked} in ${total} litres of solution is ${initial}. ${input.action} to change the strength to ${target}?`,
    `A complete ${total}-litre solution is ${initial} ${input.context.tracked} and ${malCp004Wave04Percent(subtractRational(rational(1), input.initialRate))} ${input.context.other}. ${input.action} to reach ${target} ${input.context.tracked}?`,
    `Initially, a ${input.context.container} has ${total} litres of ${input.context.tracked} solution at ${initial} strength. ${input.action} for a final strength of ${target}?`,
  ] as const;
  return templates[malCp004Wave04VariantIndex(`${input.seed}:stem`, templates.length)]!;
}

export function generateMalCp004Wave04SolventAddition(
  seed: string,
): MalCp004Wave04Question {
  const state = targetState(seed, MAL_CP004_WAVE04_DILUTION_CASES);
  const solved = solveMalCp004({
    mode: "ADD_SOLVENT_FOR_TARGET_CONCENTRATION",
    initialTotal: state.initialTotal,
    initialConcentration: state.initialRate,
    targetConcentration: state.targetRate,
  });
  if (solved.kind !== "SOLVENT_ADDED") throw new Error("Wrong solve kind.");
  const initialTracked = multiplyRational(state.initialTotal, state.initialRate);
  const initialOther = subtractRational(state.initialTotal, initialTracked);
  const added = solved.value;
  const finalTotal = addRational(state.initialTotal, added);
  const finalOther = addRational(initialOther, added);
  const percentageDifference = subtractRational(state.initialRate, state.targetRate);
  const reversedProjection = multiplyRational(
    state.initialTotal,
    divideRational(state.targetRate, state.initialRate),
  );
  const options = malCp004Wave04BuildOptions({
    answerValue: added,
    answerUnit: "litres",
    seed: `${seed}:options`,
    distractors: [
      {
        value: multiplyRational(state.initialTotal, percentageDifference),
        misconceptionId: "applied_percentage_difference_directly",
      },
      { value: finalTotal, misconceptionId: "reported_final_total" },
      { value: initialTracked, misconceptionId: "reported_initial_solute" },
      { value: initialOther, misconceptionId: "reported_initial_solvent" },
      {
        value: reversedProjection,
        misconceptionId: "reversed_concentration_ratio",
      },
      {
        value: divideRational(initialTracked, state.initialRate),
        misconceptionId: "reconstructed_initial_total",
      },
    ],
  });
  return malCp004Wave04Package({
    effectiveContractId: "MAL-CP004-EFF-SOLVENT-ADDITION-TARGET",
    representationVariant: "SOLVENT_ADDED",
    seed,
    difficulty: "Medium",
    sourceEvidenceIds: [
      "RSA-QA-PCT-Q331-WATER-ADDITION-TARGET",
      "RSA-QA-PCT-Q332-KNOWN-DILUTION-STRENGTH",
    ],
    sourceMatchKind: "DIRECT_TASK_MATCH",
    stem: targetStem({
      seed,
      action: `How much ${state.context.other} should be added`,
      ...state,
    }),
    answer: options.answer,
    answerValue: added,
    answerUnit: "litres",
    options: options.options,
    correctIndex: options.correctIndex,
    optionAudit: options.optionAudit,
    explanation: {
      layoutId: "MAL-CP004-EN-CONSERVED-QUANTITY-UNIFIED-V1",
      concept: `Adding ${state.context.other} changes the total volume but does not change the amount of ${state.context.tracked}.`,
      calculation: [
        `Initial ${state.context.tracked} = ${formatRational(state.initialTotal)} × ${formatRational(state.initialRate)} = ${formatRational(initialTracked)} litres.`,
        `Required final volume = ${formatRational(initialTracked)} ÷ ${formatRational(state.targetRate)} = ${formatRational(finalTotal)} litres.`,
        `${state.context.other} added = ${formatRational(finalTotal)} − ${formatRational(state.initialTotal)} = ${formatRational(added)} litres.`,
      ],
      verification: `${formatRational(initialTracked)}/${formatRational(finalTotal)} = ${formatRational(state.targetRate)}, so the final concentration is ${malCp004Wave04Percent(state.targetRate)}.`,
      conclusion: `${options.answer} of ${state.context.other} should be added.`,
      fastMethod: "Keep the solute amount fixed, find the required final volume, then subtract the initial volume.",
      commonMistake: "Do not apply the difference between the two percentages directly to the initial volume.",
    },
    ledger: {
      type: "CONSERVED_QUANTITY_TABLE",
      title: "Dilution by adding solvent",
      conservedLabel: state.context.tracked,
      rows: [
        {
          stage: "Initially",
          total: malCp004Wave04Quantity(state.initialTotal, "litres"),
          conserved: `${formatRational(initialTracked)} litres ${state.context.tracked}`,
          changing: `${formatRational(initialOther)} litres ${state.context.other}`,
          rate: malCp004Wave04Percent(state.initialRate),
        },
        {
          stage: `After adding ${state.context.other}`,
          total: malCp004Wave04Quantity(finalTotal, "litres"),
          conserved: `${formatRational(initialTracked)} litres ${state.context.tracked}`,
          changing: `${formatRational(finalOther)} litres ${state.context.other}`,
          rate: malCp004Wave04Percent(state.targetRate),
        },
      ],
      accessibleText: `${state.context.tracked} remains ${formatRational(initialTracked)} litres while the total increases from ${formatRational(state.initialTotal)} to ${formatRational(finalTotal)} litres.`,
    },
    exactState: {
      initialTotal: state.initialTotal,
      initialRate: state.initialRate,
      targetRate: state.targetRate,
      initialTracked,
      initialOther,
      solventAdded: added,
      finalTotal,
      finalOther,
    },
  });
}

export function generateMalCp004Wave04PureAddition(
  seed: string,
): MalCp004Wave04Question {
  const state = targetState(seed, MAL_CP004_WAVE04_PURE_ADDITION_CASES);
  const solved = solveMalCp004({
    mode: "ADD_PURE_SOLUTE_FOR_TARGET_CONCENTRATION",
    initialTotal: state.initialTotal,
    initialConcentration: state.initialRate,
    targetConcentration: state.targetRate,
  });
  if (solved.kind !== "PURE_SOLUTE_ADDED") throw new Error("Wrong solve kind.");
  const initialTracked = multiplyRational(state.initialTotal, state.initialRate);
  const conservedOther = subtractRational(state.initialTotal, initialTracked);
  const added = solved.value;
  const finalTotal = addRational(state.initialTotal, added);
  const finalTracked = addRational(initialTracked, added);
  const differenceAmount = multiplyRational(
    state.initialTotal,
    subtractRational(state.targetRate, state.initialRate),
  );
  const solventEquationResult = subtractRational(
    state.initialTotal,
    divideRational(initialTracked, state.targetRate),
  );
  const options = malCp004Wave04BuildOptions({
    answerValue: added,
    answerUnit: "litres",
    seed: `${seed}:options`,
    distractors: [
      {
        value: differenceAmount,
        misconceptionId: "applied_percentage_difference_directly",
      },
      { value: initialTracked, misconceptionId: "reported_initial_solute" },
      { value: conservedOther, misconceptionId: "reported_conserved_solvent" },
      { value: finalTotal, misconceptionId: "reported_final_total" },
      {
        value: divideRational(differenceAmount, state.targetRate),
        misconceptionId: "divided_difference_by_target_rate",
      },
      {
        value: solventEquationResult,
        misconceptionId: "used_solvent_only_equation",
      },
      { value: finalTracked, misconceptionId: "reported_final_solute" },
    ],
  });
  return malCp004Wave04Package({
    effectiveContractId: "MAL-CP004-EFF-PURE-SOLUTE-ADDITION-TARGET",
    representationVariant: "PURE_SOLUTE_ADDED",
    seed,
    difficulty: "Medium",
    sourceEvidenceIds: [
      "RSA-QA-PCT-EX42-PURE-SALT-ADDITION",
      "RSA-QA-PCT-Q328-PURE-GOLD-ADDITION",
      "RSA-QA-PCT-Q333-PURE-ALCOHOL-ADDITION",
    ],
    sourceMatchKind: "DIRECT_TASK_MATCH",
    stem: targetStem({
      seed,
      action: `How much pure ${state.context.tracked} should be added`,
      ...state,
    }),
    answer: options.answer,
    answerValue: added,
    answerUnit: "litres",
    options: options.options,
    correctIndex: options.correctIndex,
    optionAudit: options.optionAudit,
    explanation: {
      layoutId: "MAL-CP004-EN-CONSERVED-QUANTITY-UNIFIED-V1",
      concept: `Pure ${state.context.tracked} increases both the ${state.context.tracked} quantity and total volume, while ${state.context.other} remains unchanged.`,
      calculation: [
        `Initial ${state.context.tracked} = ${formatRational(state.initialTotal)} × ${formatRational(state.initialRate)} = ${formatRational(initialTracked)} litres.`,
        `Let x litres of pure ${state.context.tracked} be added: (${formatRational(initialTracked)} + x)/(${formatRational(state.initialTotal)} + x) = ${formatRational(state.targetRate)}.`,
        `Solving gives x = ${formatRational(added)} litres.`,
      ],
      verification: `${formatRational(finalTracked)}/${formatRational(finalTotal)} = ${formatRational(state.targetRate)}, and ${state.context.other} remains ${formatRational(conservedOther)} litres.`,
      conclusion: `${options.answer} of pure ${state.context.tracked} should be added.`,
      fastMethod: "Conserve the solvent amount, or solve the one-variable concentration equation.",
      commonMistake: "The added pure substance increases both the component amount and the total volume.",
    },
    ledger: {
      type: "CONSERVED_QUANTITY_TABLE",
      title: "Strengthening by adding pure solute",
      conservedLabel: state.context.other,
      rows: [
        {
          stage: "Initially",
          total: malCp004Wave04Quantity(state.initialTotal, "litres"),
          conserved: `${formatRational(conservedOther)} litres ${state.context.other}`,
          changing: `${formatRational(initialTracked)} litres ${state.context.tracked}`,
          rate: malCp004Wave04Percent(state.initialRate),
        },
        {
          stage: `After adding pure ${state.context.tracked}`,
          total: malCp004Wave04Quantity(finalTotal, "litres"),
          conserved: `${formatRational(conservedOther)} litres ${state.context.other}`,
          changing: `${formatRational(finalTracked)} litres ${state.context.tracked}`,
          rate: malCp004Wave04Percent(state.targetRate),
        },
      ],
      accessibleText: `${state.context.other} stays fixed at ${formatRational(conservedOther)} litres while pure ${state.context.tracked} is added.`,
    },
    exactState: {
      initialTotal: state.initialTotal,
      initialRate: state.initialRate,
      targetRate: state.targetRate,
      initialTracked,
      conservedOther,
      pureSoluteAdded: added,
      finalTotal,
      finalTracked,
    },
  });
}

function evaporationStem(input: {
  seed: string;
  requested: "evaporated" | "final";
  initialTotal: Rational;
  initialRate: Rational;
  targetRate: Rational;
  context: { container: string; tracked: string; other: string };
}): string {
  const total = formatRational(input.initialTotal);
  const initial = malCp004Wave04Percent(input.initialRate);
  const target = malCp004Wave04Percent(input.targetRate);
  const question =
    input.requested === "evaporated"
      ? `How many litres of ${input.context.other} must evaporate?`
      : "What will be the final volume of the solution?";
  const templates = [
    `A ${input.context.container} contains ${total} litres of a ${initial} ${input.context.tracked} solution. Only ${input.context.other} evaporates until the concentration becomes ${target}. ${question}`,
    `${total} litres of solution contains ${initial} ${input.context.tracked}. On evaporation of ${input.context.other}, its strength rises to ${target}. ${question}`,
    `A ${total}-litre mixture of ${input.context.tracked} and ${input.context.other} is ${initial} ${input.context.tracked}. After some ${input.context.other} evaporates, it becomes ${target}. ${question}`,
    `The ${input.context.tracked} strength in a ${input.context.container} rises from ${initial} to ${target} because only ${input.context.other} evaporates. The initial volume is ${total} litres. ${question}`,
    `Initially, the ${input.context.container} holds ${total} litres of ${initial} ${input.context.tracked} solution. Evaporation removes only ${input.context.other} and leaves a ${target} solution. ${question}`,
    `A solution has ${formatRational(multiplyRational(input.initialTotal, input.initialRate))} litres of ${input.context.tracked} in a total of ${total} litres. When only ${input.context.other} evaporates, the final strength is ${target}. ${question}`,
  ] as const;
  return templates[malCp004Wave04VariantIndex(`${input.seed}:stem`, templates.length)]!;
}

export function generateMalCp004Wave04EvaporationTarget(
  seed: string,
): MalCp004Wave04Question {
  const state = targetState(seed, MAL_CP004_WAVE04_EVAPORATION_CASES);
  const solved = solveMalCp004({
    mode: "EVAPORATE_SOLVENT_FOR_TARGET_CONCENTRATION",
    initialTotal: state.initialTotal,
    initialConcentration: state.initialRate,
    targetConcentration: state.targetRate,
  });
  if (solved.kind !== "SOLVENT_EVAPORATED") throw new Error("Wrong solve kind.");
  const initialTracked = multiplyRational(state.initialTotal, state.initialRate);
  const initialOther = subtractRational(state.initialTotal, initialTracked);
  const evaporated = solved.value;
  const finalTotal = subtractRational(state.initialTotal, evaporated);
  const finalOther = subtractRational(finalTotal, initialTracked);
  const finalVariant = malCp004Wave04VariantIndex(`${seed}:output`, 2) === 1;
  const answerValue = finalVariant ? finalTotal : evaporated;
  const directDifference = multiplyRational(
    state.initialTotal,
    subtractRational(state.targetRate, state.initialRate),
  );
  const reversedProjection = multiplyRational(
    state.initialTotal,
    divideRational(state.targetRate, state.initialRate),
  );
  const options = malCp004Wave04BuildOptions({
    answerValue,
    answerUnit: "litres",
    seed: `${seed}:options`,
    distractors: finalVariant
      ? [
          { value: evaporated, misconceptionId: "reported_evaporated_amount" },
          { value: state.initialTotal, misconceptionId: "reported_initial_total" },
          { value: initialTracked, misconceptionId: "reported_conserved_solute" },
          { value: initialOther, misconceptionId: "reported_initial_solvent" },
          { value: reversedProjection, misconceptionId: "reversed_concentration_ratio" },
          { value: directDifference, misconceptionId: "used_percentage_difference_as_volume" },
        ]
      : [
          { value: finalTotal, misconceptionId: "reported_final_total" },
          { value: initialTracked, misconceptionId: "reported_conserved_solute" },
          { value: initialOther, misconceptionId: "reported_initial_solvent" },
          { value: directDifference, misconceptionId: "applied_percentage_difference_directly" },
          { value: reversedProjection, misconceptionId: "reversed_concentration_ratio" },
        ],
  });
  return malCp004Wave04Package({
    effectiveContractId: "MAL-CP004-EFF-EVAPORATION-TARGET",
    representationVariant: finalVariant
      ? "FINAL_TOTAL_AFTER_EVAPORATION"
      : "EVAPORATED_AMOUNT",
    seed,
    difficulty: "Medium",
    sourceEvidenceIds: [
      "RSA-QA-PCT-EX43-EVAPORATION-ORIGINAL-MASS",
      "PCT-007/PCT-CP-006/findEvaporatedAmount",
      "PCT-007/PCT-CP-006/findFinalVolumeAfterEvaporation",
    ],
    sourceMatchKind: "FORMULA_EQUIVALENT_DIRECTION",
    stem: evaporationStem({
      seed,
      requested: finalVariant ? "final" : "evaporated",
      ...state,
    }),
    answer: options.answer,
    answerValue,
    answerUnit: "litres",
    options: options.options,
    correctIndex: options.correctIndex,
    optionAudit: options.optionAudit,
    explanation: {
      layoutId: "MAL-CP004-EN-CONSERVED-QUANTITY-UNIFIED-V1",
      concept: `Only ${state.context.other} evaporates, so the amount of ${state.context.tracked} remains unchanged.`,
      calculation: [
        `Initial ${state.context.tracked} = ${formatRational(state.initialTotal)} × ${formatRational(state.initialRate)} = ${formatRational(initialTracked)} litres.`,
        `Final volume = ${formatRational(initialTracked)} ÷ ${formatRational(state.targetRate)} = ${formatRational(finalTotal)} litres.`,
        `${state.context.other} evaporated = ${formatRational(state.initialTotal)} − ${formatRational(finalTotal)} = ${formatRational(evaporated)} litres.`,
      ],
      verification: `${formatRational(initialTracked)}/${formatRational(finalTotal)} = ${formatRational(state.targetRate)}, so the final concentration is ${malCp004Wave04Percent(state.targetRate)}.`,
      conclusion: finalVariant
        ? `The final volume is ${options.answer}.`
        : `${options.answer} of ${state.context.other} must evaporate.`,
      fastMethod: "Keep the solute fixed, divide it by the target concentration to get final volume, then compare volumes if needed.",
      commonMistake: "Do not reduce the solute amount; evaporation removes only the solvent.",
    },
    ledger: {
      type: "CONSERVED_QUANTITY_TABLE",
      title: "Concentration increase by evaporation",
      conservedLabel: state.context.tracked,
      rows: [
        {
          stage: "Initially",
          total: malCp004Wave04Quantity(state.initialTotal, "litres"),
          conserved: `${formatRational(initialTracked)} litres ${state.context.tracked}`,
          changing: `${formatRational(initialOther)} litres ${state.context.other}`,
          rate: malCp004Wave04Percent(state.initialRate),
        },
        {
          stage: "After evaporation",
          total: malCp004Wave04Quantity(finalTotal, "litres"),
          conserved: `${formatRational(initialTracked)} litres ${state.context.tracked}`,
          changing: `${formatRational(finalOther)} litres ${state.context.other}`,
          rate: malCp004Wave04Percent(state.targetRate),
        },
      ],
      accessibleText: `${state.context.tracked} remains ${formatRational(initialTracked)} litres while ${formatRational(evaporated)} litres of ${state.context.other} evaporates.`,
    },
    exactState: {
      initialTotal: state.initialTotal,
      initialRate: state.initialRate,
      targetRate: state.targetRate,
      initialTracked,
      initialOther,
      evaporatedAmount: evaporated,
      finalTotal,
      finalOther,
    },
  });
}
