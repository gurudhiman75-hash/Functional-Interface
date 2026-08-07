import {
  addRational,
  divideRational,
  formatRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";
import { MOISTURE_CASES } from "./cp004-discovery-data";
import {
  buildOptions,
  packageQuestion,
  percentText,
  pick,
  quantityText,
} from "./cp004-discovery-core";
import { solveMalCp004 } from "./cp004-solver";
import type {
  MalCp004DiscoveryQuestion,
  MalCp004SolveRequest,
} from "./cp004-types";

export function moistureQuestion(
  seed: string,
  inverse: boolean,
): MalCp004DiscoveryQuestion {
  const prototypeId = inverse
    ? "MAL-CP004-PROT-INITIAL-MASS-FROM-MOISTURE-SHIFT"
    : "MAL-CP004-PROT-FINAL-MASS-FROM-MOISTURE-SHIFT";
  const selected = pick(MOISTURE_CASES, `${seed}:case`);
  const initialMoisture = rational(selected.initialMoistureNumerator, selected.initialMoistureDenominator);
  const finalMoisture = rational(selected.finalMoistureNumerator, selected.finalMoistureDenominator);
  const initialDryFraction = subtractRational(rational(1), initialMoisture);
  const finalDryFraction = subtractRational(rational(1), finalMoisture);
  const forwardRequest: Extract<MalCp004SolveRequest, { mode: "FINAL_MASS_FROM_MOISTURE_SHIFT" }> = {
    mode: "FINAL_MASS_FROM_MOISTURE_SHIFT",
    initialMass: rational(selected.initialMass),
    initialMoistureFraction: initialMoisture,
    finalMoistureFraction: finalMoisture,
  };
  const forward = solveMalCp004(forwardRequest);
  if (forward.kind !== "FINAL_MASS") throw new Error("Wrong solution kind.");
  const request: MalCp004SolveRequest = inverse
    ? { mode: "INITIAL_MASS_FROM_MOISTURE_SHIFT", finalMass: forward.value, initialMoistureFraction: initialMoisture, finalMoistureFraction: finalMoisture }
    : forwardRequest;
  const solution = solveMalCp004(request);
  const answerValue = solution.value;
  const answer = quantityText(answerValue, "kg");
  const dryMatter = multiplyRational(rational(selected.initialMass), initialDryFraction);
  const givenMass = inverse ? forward.value : rational(selected.initialMass);
  const linear = subtractRational(givenMass, multiplyRational(givenMass, subtractRational(initialMoisture, finalMoisture)));
  const distractors = inverse
    ? [
        { text: quantityText(dryMatter, "kg"), misconceptionId: "reported_dry_matter_only" },
        { text: quantityText(divideRational(givenMass, initialDryFraction), "kg"), misconceptionId: "ignored_final_dry_fraction" },
        { text: quantityText(multiplyRational(givenMass, divideRational(initialMoisture, finalMoisture)), "kg"), misconceptionId: "used_moisture_ratio" },
        { text: quantityText(addRational(givenMass, multiplyRational(givenMass, subtractRational(initialMoisture, finalMoisture))), "kg"), misconceptionId: "added_moisture_difference_linearly" },
        { text: quantityText(divideRational(dryMatter, finalDryFraction), "kg"), misconceptionId: "recomputed_final_mass" },
      ]
    : [
        { text: quantityText(dryMatter, "kg"), misconceptionId: "reported_dry_matter_only" },
        { text: quantityText(multiplyRational(givenMass, finalDryFraction), "kg"), misconceptionId: "applied_final_dry_fraction_directly" },
        { text: quantityText(linear, "kg"), misconceptionId: "subtracted_moisture_percentage_linearly" },
        { text: quantityText(multiplyRational(givenMass, divideRational(finalMoisture, initialMoisture)), "kg"), misconceptionId: "used_moisture_ratio" },
        { text: quantityText(divideRational(dryMatter, finalMoisture), "kg"), misconceptionId: "used_moisture_instead_of_dry_fraction" },
      ];
  const options = buildOptions(answer, distractors, `${seed}:options`);
  const initialMass = inverse ? answerValue : rational(selected.initialMass);
  const finalMass = inverse ? forward.value : answerValue;
  return packageQuestion({
    prototypeId,
    seed,
    request,
    stem: inverse
      ? `${quantityText(forward.value, "kg")} of ${selected.finalLabel} contains ${percentText(finalMoisture)} moisture. It was produced from ${selected.material} containing ${percentText(initialMoisture)} moisture. What was the initial mass of the ${selected.material}?`
      : `${selected.initialMass} kg of ${selected.material} contains ${percentText(initialMoisture)} moisture. After drying, the moisture content becomes ${percentText(finalMoisture)}. What is the final mass of the ${selected.finalLabel}?`,
    answer,
    options,
    explanation: {
      layoutId: "MAL-CP004-EN-CONSERVED-QUANTITY-DISCOVERY-V1",
      concept: "Dry matter does not change during drying; only moisture is removed.",
      calculation: inverse
        ? [
            `Final dry matter = ${formatRational(forward.value)} × ${formatRational(finalDryFraction)} = ${formatRational(dryMatter)} kg.`,
            `Initial dry fraction = ${formatRational(initialDryFraction)}.`,
            `Initial mass = ${formatRational(dryMatter)} ÷ ${formatRational(initialDryFraction)} = ${formatRational(answerValue)} kg.`,
          ]
        : [
            `Initial dry matter = ${selected.initialMass} × ${formatRational(initialDryFraction)} = ${formatRational(dryMatter)} kg.`,
            `Final dry fraction = ${formatRational(finalDryFraction)}.`,
            `Final mass = ${formatRational(dryMatter)} ÷ ${formatRational(finalDryFraction)} = ${formatRational(answerValue)} kg.`,
          ],
      verification: `${formatRational(initialMass)} × ${formatRational(initialDryFraction)} = ${formatRational(finalMass)} × ${formatRational(finalDryFraction)} = ${formatRational(dryMatter)} kg of dry matter.`,
      conclusion: inverse ? `The initial mass was ${answer}.` : `The final mass is ${answer}.`,
      fastMethod: "Equate dry matter before and after drying.",
      commonMistake: "Conserve the dry fraction, not the moisture percentage.",
    },
    ledger: {
      type: "CONSERVED_QUANTITY_LEDGER",
      title: "Dry matter before and after drying",
      conservedLabel: "dry matter",
      rows: [
        { stage: "Initially", totalQuantity: quantityText(initialMass, "kg"), conservedQuantity: `${formatRational(dryMatter)} kg dry matter`, changingQuantity: `${formatRational(subtractRational(initialMass, dryMatter))} kg moisture`, concentrationOrMoisture: percentText(initialMoisture) },
        { stage: "After drying", totalQuantity: quantityText(finalMass, "kg"), conservedQuantity: `${formatRational(dryMatter)} kg dry matter`, changingQuantity: `${formatRational(subtractRational(finalMass, dryMatter))} kg moisture`, concentrationOrMoisture: percentText(finalMoisture) },
      ],
      accessibleText: `Dry matter remains ${formatRational(dryMatter)} kg before and after drying.`,
    },
  });
}
