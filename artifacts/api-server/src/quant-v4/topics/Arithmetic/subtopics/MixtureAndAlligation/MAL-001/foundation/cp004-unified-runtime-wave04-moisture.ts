import {
  addRational,
  divideRational,
  formatRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";
import {
  MAL_CP004_WAVE04_MOISTURE_CASES,
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
import { solveMalCp004 } from "./cp004-solver";
import type { MalCp004Wave04Question } from "./cp004-unified-runtime-wave04-types";
import type { Rational } from "./types";

function fraction(value: FractionTuple): Rational {
  return rational(value[0], value[1]);
}

function moistureState(seed: string) {
  const selected = malCp004Wave04Pick(
    MAL_CP004_WAVE04_MOISTURE_CASES,
    `${seed}:case`,
  );
  const initialMass = rational(selected.initialMass);
  const initialMoisture = fraction(selected.initialMoisture);
  const finalMoisture = fraction(selected.finalMoisture);
  const initialDryFraction = subtractRational(rational(1), initialMoisture);
  const finalDryFraction = subtractRational(rational(1), finalMoisture);
  const dryMatter = multiplyRational(initialMass, initialDryFraction);
  const finalMass = divideRational(dryMatter, finalDryFraction);
  const moistureLost = subtractRational(initialMass, finalMass);
  const initialMoistureAmount = subtractRational(initialMass, dryMatter);
  const finalMoistureAmount = subtractRational(finalMass, dryMatter);
  return {
    ...selected,
    initialMass,
    initialMoisture,
    finalMoisture,
    initialDryFraction,
    finalDryFraction,
    dryMatter,
    finalMass,
    moistureLost,
    initialMoistureAmount,
    finalMoistureAmount,
  };
}

function forwardStem(input: {
  seed: string;
  initialMass: Rational;
  initialMoisture: Rational;
  finalMoisture: Rational;
  material: string;
  finalMaterial: string;
  requested: "final" | "lost";
}): string {
  const question =
    input.requested === "final"
      ? `What is the final mass of the ${input.finalMaterial}?`
      : "How much moisture is lost during drying?";
  const templates = [
    `${formatRational(input.initialMass)} kg of ${input.material} contains ${malCp004Wave04Percent(input.initialMoisture)} moisture. After drying, the moisture content becomes ${malCp004Wave04Percent(input.finalMoisture)}. ${question}`,
    `A batch of ${input.material} weighs ${formatRational(input.initialMass)} kg and is ${malCp004Wave04Percent(input.initialMoisture)} moisture. It is dried until the moisture percentage is ${malCp004Wave04Percent(input.finalMoisture)}. ${question}`,
    `${input.material[0]!.toUpperCase()}${input.material.slice(1)} has mass ${formatRational(input.initialMass)} kg, of which ${malCp004Wave04Percent(input.initialMoisture)} is moisture. The dried product contains ${malCp004Wave04Percent(input.finalMoisture)} moisture. ${question}`,
    `The dry matter in ${formatRational(input.initialMass)} kg of ${input.material} remains unchanged while its moisture falls from ${malCp004Wave04Percent(input.initialMoisture)} to ${malCp004Wave04Percent(input.finalMoisture)}. ${question}`,
    `A ${formatRational(input.initialMass)}-kg lot of ${input.material} is dried. Its moisture percentage decreases from ${malCp004Wave04Percent(input.initialMoisture)} to ${malCp004Wave04Percent(input.finalMoisture)}. ${question}`,
    `Initially, ${input.material} weighs ${formatRational(input.initialMass)} kg and contains ${malCp004Wave04Percent(input.initialMoisture)} moisture. The final ${input.finalMaterial} contains ${malCp004Wave04Percent(input.finalMoisture)} moisture. ${question}`,
  ] as const;
  return templates[malCp004Wave04VariantIndex(`${input.seed}:stem`, templates.length)]!;
}

export function generateMalCp004Wave04MoistureForward(
  seed: string,
): MalCp004Wave04Question {
  const state = moistureState(seed);
  const lostVariant = malCp004Wave04VariantIndex(`${seed}:output`, 2) === 1;
  const answerValue = lostVariant ? state.moistureLost : state.finalMass;
  const linearFinal = subtractRational(
    state.initialMass,
    multiplyRational(
      state.initialMass,
      subtractRational(state.initialMoisture, state.finalMoisture),
    ),
  );
  const moistureRatioFinal = multiplyRational(
    state.initialMass,
    divideRational(state.finalMoisture, state.initialMoisture),
  );
  const options = malCp004Wave04BuildOptions({
    answerValue,
    answerUnit: "kg",
    seed: `${seed}:options`,
    distractors: lostVariant
      ? [
          { value: state.finalMass, misconceptionId: "reported_final_mass" },
          {
            value: state.initialMoistureAmount,
            misconceptionId: "reported_initial_moisture",
          },
          {
            value: state.finalMoistureAmount,
            misconceptionId: "reported_final_moisture",
          },
          { value: state.dryMatter, misconceptionId: "reported_dry_matter" },
          {
            value: subtractRational(state.initialMass, linearFinal),
            misconceptionId: "subtracted_moisture_rates_linearly",
          },
          { value: state.initialMass, misconceptionId: "reported_initial_mass" },
        ]
      : [
          { value: state.dryMatter, misconceptionId: "reported_dry_matter_only" },
          {
            value: multiplyRational(
              state.initialMass,
              state.finalDryFraction,
            ),
            misconceptionId: "applied_final_dry_fraction_to_initial_mass",
          },
          {
            value: linearFinal,
            misconceptionId: "subtracted_moisture_rates_linearly",
          },
          {
            value: moistureRatioFinal,
            misconceptionId: "used_moisture_ratio",
          },
          {
            value: divideRational(state.dryMatter, state.finalMoisture),
            misconceptionId: "used_final_moisture_instead_of_dry_fraction",
          },
          { value: state.moistureLost, misconceptionId: "reported_moisture_lost" },
        ],
  });
  return malCp004Wave04Package({
    effectiveContractId: "MAL-CP004-EFF-MOISTURE-FORWARD",
    representationVariant: lostVariant ? "MOISTURE_LOST" : "FINAL_MASS",
    seed,
    difficulty: "Medium",
    sourceEvidenceIds: [
      "RSA-QA-PCT-Q325-FRESH-TO-DRY-MASS",
      "ARUN-QA-CAT2001-FRESH-DRY-GRAPES",
      "PCT-007/PCT-CP-006/findFinalDryWeight",
      "PCT-007/PCT-CP-006/findWaterLostAfterDrying",
    ],
    sourceMatchKind: "DIRECT_TASK_MATCH",
    stem: forwardStem({
      seed,
      initialMass: state.initialMass,
      initialMoisture: state.initialMoisture,
      finalMoisture: state.finalMoisture,
      material: state.material,
      finalMaterial: state.finalMaterial,
      requested: lostVariant ? "lost" : "final",
    }),
    answer: options.answer,
    answerValue,
    answerUnit: "kg",
    options: options.options,
    correctIndex: options.correctIndex,
    optionAudit: options.optionAudit,
    explanation: {
      layoutId: "MAL-CP004-EN-CONSERVED-QUANTITY-UNIFIED-V1",
      concept: "Dry matter does not change during drying; only moisture is removed.",
      calculation: [
        `Initial dry fraction = 1 − ${formatRational(state.initialMoisture)} = ${formatRational(state.initialDryFraction)}.`,
        `Dry matter = ${formatRational(state.initialMass)} × ${formatRational(state.initialDryFraction)} = ${formatRational(state.dryMatter)} kg.`,
        `Final mass = ${formatRational(state.dryMatter)} ÷ ${formatRational(state.finalDryFraction)} = ${formatRational(state.finalMass)} kg.`,
        `Moisture lost = ${formatRational(state.initialMass)} − ${formatRational(state.finalMass)} = ${formatRational(state.moistureLost)} kg.`,
      ],
      verification: `${formatRational(state.initialMass)} × ${formatRational(state.initialDryFraction)} = ${formatRational(state.finalMass)} × ${formatRational(state.finalDryFraction)} = ${formatRational(state.dryMatter)} kg of dry matter.`,
      conclusion: lostVariant
        ? `The moisture lost is ${options.answer}.`
        : `The final mass is ${options.answer}.`,
      fastMethod: "Equate dry matter before and after drying.",
      commonMistake: "Conserve the dry fraction, not the moisture percentage.",
    },
    ledger: {
      type: "CONSERVED_QUANTITY_TABLE",
      title: "Dry matter before and after drying",
      conservedLabel: "dry matter",
      rows: [
        {
          stage: "Initially",
          total: malCp004Wave04Quantity(state.initialMass, "kg"),
          conserved: `${formatRational(state.dryMatter)} kg dry matter`,
          changing: `${formatRational(state.initialMoistureAmount)} kg moisture`,
          rate: malCp004Wave04Percent(state.initialMoisture),
        },
        {
          stage: "After drying",
          total: malCp004Wave04Quantity(state.finalMass, "kg"),
          conserved: `${formatRational(state.dryMatter)} kg dry matter`,
          changing: `${formatRational(state.finalMoistureAmount)} kg moisture`,
          rate: malCp004Wave04Percent(state.finalMoisture),
        },
      ],
      accessibleText: `Dry matter remains ${formatRational(state.dryMatter)} kg while moisture falls from ${formatRational(state.initialMoistureAmount)} to ${formatRational(state.finalMoistureAmount)} kg.`,
    },
    exactState: {
      initialMass: state.initialMass,
      initialMoisture: state.initialMoisture,
      finalMoisture: state.finalMoisture,
      dryMatter: state.dryMatter,
      finalMass: state.finalMass,
      moistureLost: state.moistureLost,
      initialMoistureAmount: state.initialMoistureAmount,
      finalMoistureAmount: state.finalMoistureAmount,
      material: state.material,
      finalMaterial: state.finalMaterial,
    },
  });
}

function inverseStem(input: {
  seed: string;
  finalMass: Rational;
  initialMoisture: Rational;
  finalMoisture: Rational;
  material: string;
  finalMaterial: string;
}): string {
  const templates = [
    `${formatRational(input.finalMass)} kg of ${input.finalMaterial} contains ${malCp004Wave04Percent(input.finalMoisture)} moisture. It was produced from ${input.material} containing ${malCp004Wave04Percent(input.initialMoisture)} moisture. What was the initial mass of the ${input.material}?`,
    `After drying, ${input.finalMaterial} weighs ${formatRational(input.finalMass)} kg and has ${malCp004Wave04Percent(input.finalMoisture)} moisture. The original ${input.material} had ${malCp004Wave04Percent(input.initialMoisture)} moisture. Find its original mass.`,
    `A dried batch weighs ${formatRational(input.finalMass)} kg and contains ${malCp004Wave04Percent(input.finalMoisture)} moisture. Before drying, the ${input.material} contained ${malCp004Wave04Percent(input.initialMoisture)} moisture. Determine the starting mass.`,
    `The dry matter is unchanged when ${input.material} becomes ${input.finalMaterial}. If the final mass is ${formatRational(input.finalMass)} kg, final moisture is ${malCp004Wave04Percent(input.finalMoisture)}, and initial moisture was ${malCp004Wave04Percent(input.initialMoisture)}, what was the initial mass?`,
    `${input.finalMaterial[0]!.toUpperCase()}${input.finalMaterial.slice(1)} of mass ${formatRational(input.finalMass)} kg has ${malCp004Wave04Percent(input.finalMoisture)} moisture. It came from ${input.material} with ${malCp004Wave04Percent(input.initialMoisture)} moisture. Calculate the original mass.`,
    `A material changes from ${malCp004Wave04Percent(input.initialMoisture)} moisture to ${malCp004Wave04Percent(input.finalMoisture)} moisture after drying. If the final ${input.finalMaterial} weighs ${formatRational(input.finalMass)} kg, how much ${input.material} was present initially?`,
  ] as const;
  return templates[malCp004Wave04VariantIndex(`${input.seed}:stem`, templates.length)]!;
}

export function generateMalCp004Wave04MoistureInverse(
  seed: string,
): MalCp004Wave04Question {
  const state = moistureState(seed);
  const solved = solveMalCp004({
    mode: "INITIAL_MASS_FROM_MOISTURE_SHIFT",
    finalMass: state.finalMass,
    initialMoistureFraction: state.initialMoisture,
    finalMoistureFraction: state.finalMoisture,
  });
  if (solved.kind !== "INITIAL_MASS") throw new Error("Wrong solve kind.");
  const answerValue = solved.value;
  const linearInitial = addRational(
    state.finalMass,
    multiplyRational(
      state.finalMass,
      subtractRational(state.initialMoisture, state.finalMoisture),
    ),
  );
  const options = malCp004Wave04BuildOptions({
    answerValue,
    answerUnit: "kg",
    seed: `${seed}:options`,
    distractors: [
      { value: state.dryMatter, misconceptionId: "reported_dry_matter_only" },
      {
        value: divideRational(state.finalMass, state.initialDryFraction),
        misconceptionId: "ignored_final_dry_fraction",
      },
      {
        value: multiplyRational(
          state.finalMass,
          divideRational(state.initialMoisture, state.finalMoisture),
        ),
        misconceptionId: "used_moisture_ratio",
      },
      {
        value: linearInitial,
        misconceptionId: "added_moisture_difference_linearly",
      },
      {
        value: divideRational(state.finalMass, state.finalDryFraction),
        misconceptionId: "divided_final_mass_by_final_dry_fraction",
      },
      { value: state.moistureLost, misconceptionId: "reported_moisture_lost" },
    ],
  });
  return malCp004Wave04Package({
    effectiveContractId: "MAL-CP004-EFF-MOISTURE-INVERSE",
    representationVariant: "INITIAL_MASS",
    seed,
    difficulty: "Hard",
    sourceEvidenceIds: [
      "RSA-QA-PCT-Q327-DRY-TO-FRESH-MASS",
      "PCT-007/PCT-CP-006/findInitialWeightFromFinalDryWeight",
    ],
    sourceMatchKind: "DIRECT_TASK_MATCH",
    stem: inverseStem({
      seed,
      finalMass: state.finalMass,
      initialMoisture: state.initialMoisture,
      finalMoisture: state.finalMoisture,
      material: state.material,
      finalMaterial: state.finalMaterial,
    }),
    answer: options.answer,
    answerValue,
    answerUnit: "kg",
    options: options.options,
    correctIndex: options.correctIndex,
    optionAudit: options.optionAudit,
    explanation: {
      layoutId: "MAL-CP004-EN-CONSERVED-QUANTITY-UNIFIED-V1",
      concept: "The final dry matter is the same dry matter that was present before drying.",
      calculation: [
        `Final dry fraction = 1 − ${formatRational(state.finalMoisture)} = ${formatRational(state.finalDryFraction)}.`,
        `Dry matter = ${formatRational(state.finalMass)} × ${formatRational(state.finalDryFraction)} = ${formatRational(state.dryMatter)} kg.`,
        `Initial dry fraction = ${formatRational(state.initialDryFraction)}.`,
        `Initial mass = ${formatRational(state.dryMatter)} ÷ ${formatRational(state.initialDryFraction)} = ${formatRational(answerValue)} kg.`,
      ],
      verification: `${formatRational(answerValue)} × ${formatRational(state.initialDryFraction)} = ${formatRational(state.finalMass)} × ${formatRational(state.finalDryFraction)} = ${formatRational(state.dryMatter)} kg.`,
      conclusion: `The initial mass was ${options.answer}.`,
      fastMethod: "Find final dry matter, then divide it by the initial dry fraction.",
      commonMistake: "Do not compare moisture percentages directly; compare the unchanged dry matter.",
    },
    ledger: {
      type: "CONSERVED_QUANTITY_TABLE",
      title: "Recovering initial mass from dry matter",
      conservedLabel: "dry matter",
      rows: [
        {
          stage: "Initially",
          total: malCp004Wave04Quantity(answerValue, "kg"),
          conserved: `${formatRational(state.dryMatter)} kg dry matter`,
          changing: `${formatRational(state.initialMoistureAmount)} kg moisture`,
          rate: malCp004Wave04Percent(state.initialMoisture),
        },
        {
          stage: "After drying",
          total: malCp004Wave04Quantity(state.finalMass, "kg"),
          conserved: `${formatRational(state.dryMatter)} kg dry matter`,
          changing: `${formatRational(state.finalMoistureAmount)} kg moisture`,
          rate: malCp004Wave04Percent(state.finalMoisture),
        },
      ],
      accessibleText: `Dry matter is ${formatRational(state.dryMatter)} kg in both the original ${state.material} and final ${state.finalMaterial}.`,
    },
    exactState: {
      initialMass: answerValue,
      initialMoisture: state.initialMoisture,
      finalMoisture: state.finalMoisture,
      dryMatter: state.dryMatter,
      finalMass: state.finalMass,
      moistureLost: state.moistureLost,
      initialMoistureAmount: state.initialMoistureAmount,
      finalMoistureAmount: state.finalMoistureAmount,
      material: state.material,
      finalMaterial: state.finalMaterial,
    },
  });
}
