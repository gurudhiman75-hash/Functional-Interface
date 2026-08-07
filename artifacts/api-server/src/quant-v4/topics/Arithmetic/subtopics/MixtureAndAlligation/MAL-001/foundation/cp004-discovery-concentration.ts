import {
  addRational,
  divideRational,
  formatRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";
import {
  COMPONENT_CASES,
  DILUTION_CASES,
  EVAPORATION_CASES,
  PURE_ADDITION_CASES,
  type TargetCase,
} from "./cp004-discovery-data";
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

export function componentAmountQuestion(seed: string): MalCp004DiscoveryQuestion {
  const prototypeId = "MAL-CP004-PROT-COMPONENT-AMOUNT-FROM-CONCENTRATION" as const;
  const selected = pick(COMPONENT_CASES, `${seed}:case`);
  const total = rational(selected.total);
  const concentration = rational(selected.concentrationNumerator, selected.concentrationDenominator);
  const request: Extract<MalCp004SolveRequest, { mode: "COMPONENT_AMOUNT_FROM_CONCENTRATION" }> = {
    mode: "COMPONENT_AMOUNT_FROM_CONCENTRATION",
    totalQuantity: total,
    concentration,
  };
  const solution = solveMalCp004(request);
  if (solution.kind !== "COMPONENT_QUANTITY") throw new Error("Wrong solution kind.");
  const solvent = subtractRational(total, solution.value);
  const answer = quantityText(solution.value, "litres");
  const options = buildOptions(answer, [
    { text: quantityText(solvent, "litres"), misconceptionId: "used_solvent_percentage" },
    { text: quantityText(total, "litres"), misconceptionId: "reported_total_quantity" },
    { text: quantityText(multiplyRational(concentration, rational(100)), "litres"), misconceptionId: "treated_percent_as_quantity" },
    { text: quantityText(divideRational(total, concentration), "litres"), misconceptionId: "divided_by_concentration" },
  ], `${seed}:options`);
  return packageQuestion({
    prototypeId,
    seed,
    request,
    stem: `A ${selected.container} contains ${selected.total} litres of a ${percentText(concentration)} ${selected.solute} solution. How many litres of ${selected.solute} does it contain?`,
    answer,
    options,
    explanation: {
      layoutId: "MAL-CP004-EN-CONSERVED-QUANTITY-DISCOVERY-V1",
      concept: "The concentration tells us what fraction of the total solution is the required component.",
      calculation: [
        `${selected.solute} fraction = ${percentText(concentration)} = ${formatRational(concentration)}.`,
        `${selected.solute} quantity = ${selected.total} × ${formatRational(concentration)} = ${formatRational(solution.value)} litres.`,
      ],
      verification: `${formatRational(solution.value)} litres of ${selected.solute} and ${formatRational(solvent)} litres of ${selected.solvent} add to ${selected.total} litres.`,
      conclusion: `The solution contains ${answer} of ${selected.solute}.`,
      fastMethod: "Multiply the total quantity by the concentration fraction.",
      commonMistake: "Do not use the percentage of the solvent when the question asks for the solute.",
    },
    ledger: {
      type: "CONSERVED_QUANTITY_LEDGER",
      title: "Component quantities in the solution",
      conservedLabel: selected.solute,
      rows: [{
        stage: "Given solution",
        totalQuantity: `${selected.total} litres`,
        conservedQuantity: `${formatRational(solution.value)} litres ${selected.solute}`,
        changingQuantity: `${formatRational(solvent)} litres ${selected.solvent}`,
        concentrationOrMoisture: percentText(concentration),
      }],
      accessibleText: `${selected.solute} forms ${percentText(concentration)} of the ${selected.total}-litre solution.`,
    },
  });
}

export function concentrationQuestion(seed: string): MalCp004DiscoveryQuestion {
  const prototypeId = "MAL-CP004-PROT-CONCENTRATION-FROM-COMPONENT-AMOUNT" as const;
  const selected = pick(COMPONENT_CASES, `${seed}:case`);
  const total = rational(selected.total);
  const component = multiplyRational(total, rational(selected.concentrationNumerator, selected.concentrationDenominator));
  const request: Extract<MalCp004SolveRequest, { mode: "CONCENTRATION_FROM_COMPONENT_AMOUNT" }> = {
    mode: "CONCENTRATION_FROM_COMPONENT_AMOUNT",
    totalQuantity: total,
    componentQuantity: component,
  };
  const solution = solveMalCp004(request);
  if (solution.kind !== "CONCENTRATION") throw new Error("Wrong solution kind.");
  const solvent = subtractRational(total, component);
  const answer = percentText(solution.value);
  const options = buildOptions(answer, [
    { text: percentText(divideRational(solvent, total)), misconceptionId: "reported_solvent_percentage" },
    { text: percentText(divideRational(component, solvent)), misconceptionId: "used_solute_to_solvent_ratio" },
    { text: percentText(divideRational(component, addRational(total, component))), misconceptionId: "added_component_to_denominator" },
    { text: `${formatRational(solution.value)}%`, misconceptionId: "forgot_to_convert_fraction_to_percent" },
  ], `${seed}:options`);
  return packageQuestion({
    prototypeId,
    seed,
    request,
    stem: `A ${selected.container} holds ${selected.total} litres of solution containing ${formatRational(component)} litres of ${selected.solute}. What is the concentration of ${selected.solute} in the solution?`,
    answer,
    options,
    explanation: {
      layoutId: "MAL-CP004-EN-CONSERVED-QUANTITY-DISCOVERY-V1",
      concept: "Concentration is the required component quantity divided by the total solution quantity.",
      calculation: [
        `Concentration fraction = ${formatRational(component)}/${selected.total} = ${formatRational(solution.value)}.`,
        `Concentration percentage = ${formatRational(solution.value)} × 100 = ${answer}.`,
      ],
      verification: `${answer} of ${selected.total} litres is ${formatRational(component)} litres, matching the given component amount.`,
      conclusion: `The ${selected.solute} concentration is ${answer}.`,
      fastMethod: "Divide component quantity by total quantity and multiply by 100.",
      commonMistake: "Use the total solution as the denominator, not only the solvent quantity.",
    },
    ledger: {
      type: "CONSERVED_QUANTITY_LEDGER",
      title: "Concentration from component quantity",
      conservedLabel: selected.solute,
      rows: [{
        stage: "Given solution",
        totalQuantity: `${selected.total} litres`,
        conservedQuantity: `${formatRational(component)} litres ${selected.solute}`,
        changingQuantity: `${formatRational(solvent)} litres ${selected.solvent}`,
        concentrationOrMoisture: answer,
      }],
      accessibleText: `${formatRational(component)} litres of ${selected.solute} is part of a total of ${selected.total} litres.`,
    },
  });
}

type TargetKind = "DILUTE" | "ADD_PURE" | "EVAPORATE";

function targetQuestion(seed: string, kind: TargetKind): MalCp004DiscoveryQuestion {
  const pool = kind === "DILUTE" ? DILUTION_CASES : kind === "ADD_PURE" ? PURE_ADDITION_CASES : EVAPORATION_CASES;
  const selected: TargetCase = pick(pool, `${seed}:case`);
  const initial = rational(selected.concentrationNumerator, selected.concentrationDenominator);
  const target = rational(selected.targetNumerator, selected.targetDenominator);
  const total = rational(selected.total);
  const request: MalCp004SolveRequest = kind === "DILUTE"
    ? { mode: "ADD_SOLVENT_FOR_TARGET_CONCENTRATION", initialTotal: total, initialConcentration: initial, targetConcentration: target }
    : kind === "ADD_PURE"
      ? { mode: "ADD_PURE_SOLUTE_FOR_TARGET_CONCENTRATION", initialTotal: total, initialConcentration: initial, targetConcentration: target }
      : { mode: "EVAPORATE_SOLVENT_FOR_TARGET_CONCENTRATION", initialTotal: total, initialConcentration: initial, targetConcentration: target };
  const solution = solveMalCp004(request);
  const change = solution.value;
  const initialSolute = multiplyRational(total, initial);
  const initialSolvent = subtractRational(total, initialSolute);
  const finalTotal = kind === "EVAPORATE" ? subtractRational(total, change) : addRational(total, change);
  const finalSolute = kind === "ADD_PURE" ? addRational(initialSolute, change) : initialSolute;
  const finalSolvent = subtractRational(finalTotal, finalSolute);
  const answer = quantityText(change, "litres");
  const directDifference = multiplyRational(total, kind === "DILUTE" ? subtractRational(initial, target) : subtractRational(target, initial));
  const common = [
    { text: quantityText(directDifference, "litres"), misconceptionId: "applied_percentage_difference_directly" },
    { text: quantityText(finalTotal, "litres"), misconceptionId: "reported_final_total" },
    { text: quantityText(initialSolute, "litres"), misconceptionId: "reported_initial_solute" },
  ];
  const distractors = kind === "ADD_PURE"
    ? [...common,
        { text: quantityText(divideRational(directDifference, target), "litres"), misconceptionId: "used_solvent_addition_equation" },
        { text: quantityText(initialSolvent, "litres"), misconceptionId: "reported_conserved_solvent" },
        { text: quantityText(finalSolute, "litres"), misconceptionId: "reported_final_solute" }]
    : [...common,
        { text: quantityText(multiplyRational(total, divideRational(target, initial)), "litres"), misconceptionId: "reversed_concentration_ratio" },
        { text: quantityText(initialSolvent, "litres"), misconceptionId: "reported_initial_solvent" }];
  const options = buildOptions(answer, distractors, `${seed}:options`);
  const prototypeId = kind === "DILUTE"
    ? "MAL-CP004-PROT-SOLVENT-ADDITION-FOR-TARGET"
    : kind === "ADD_PURE"
      ? "MAL-CP004-PROT-PURE-SOLUTE-ADDITION-FOR-TARGET"
      : "MAL-CP004-PROT-SOLVENT-EVAPORATION-FOR-TARGET";
  const action = kind === "DILUTE" ? `How much ${selected.solvent} should be added` : kind === "ADD_PURE" ? `How much pure ${selected.solute} should be added` : `How much ${selected.solvent} must evaporate`;
  const concept = kind === "ADD_PURE"
    ? `Pure ${selected.solute} increases both the ${selected.solute} quantity and total volume; ${selected.solvent} remains unchanged.`
    : kind === "DILUTE"
      ? `Adding ${selected.solvent} changes total volume but not the amount of ${selected.solute}.`
      : `Only ${selected.solvent} evaporates, so the amount of ${selected.solute} remains unchanged.`;
  const calculation = kind === "ADD_PURE"
    ? [
        `Initial ${selected.solute} = ${selected.total} × ${formatRational(initial)} = ${formatRational(initialSolute)} litres.`,
        `Let x litres be added: (${formatRational(initialSolute)} + x)/(${selected.total} + x) = ${formatRational(target)}.`,
        `Solving gives x = ${formatRational(change)} litres.`,
      ]
    : [
        `Initial ${selected.solute} = ${selected.total} × ${formatRational(initial)} = ${formatRational(initialSolute)} litres.`,
        `Required final volume = ${formatRational(initialSolute)} ÷ ${formatRational(target)} = ${formatRational(finalTotal)} litres.`,
        `${kind === "DILUTE" ? `${selected.solvent} added` : `${selected.solvent} evaporated`} = ${kind === "DILUTE" ? `${formatRational(finalTotal)} − ${selected.total}` : `${selected.total} − ${formatRational(finalTotal)}`} = ${formatRational(change)} litres.`,
      ];
  return packageQuestion({
    prototypeId,
    seed,
    request,
    stem: `A ${selected.container} contains ${selected.total} litres of a ${percentText(initial)} ${selected.solute} solution. ${action} to make the concentration ${percentText(target)}?`,
    answer,
    options,
    explanation: {
      layoutId: "MAL-CP004-EN-CONSERVED-QUANTITY-DISCOVERY-V1",
      concept,
      calculation,
      verification: `${formatRational(finalSolute)}/${formatRational(finalTotal)} = ${formatRational(target)}, so the final concentration is ${percentText(target)}.`,
      conclusion: `${answer} ${kind === "EVAPORATE" ? "must evaporate" : "should be added"}.`,
      fastMethod: kind === "ADD_PURE" ? "Conserve the solvent amount or solve the one-variable concentration equation." : "Keep the solute fixed, find the required final volume, then compare it with the initial volume.",
      commonMistake: kind === "ADD_PURE" ? "The added pure substance increases both the component amount and the total volume." : "Do not apply the difference between the two percentages directly to the initial volume.",
    },
    ledger: {
      type: "CONSERVED_QUANTITY_LEDGER",
      title: kind === "DILUTE" ? "Dilution by adding solvent" : kind === "ADD_PURE" ? "Strengthening by adding pure solute" : "Concentration increase by evaporation",
      conservedLabel: kind === "ADD_PURE" ? selected.solvent : selected.solute,
      rows: [
        { stage: "Initially", totalQuantity: `${selected.total} litres`, conservedQuantity: `${formatRational(kind === "ADD_PURE" ? initialSolvent : initialSolute)} litres ${kind === "ADD_PURE" ? selected.solvent : selected.solute}`, changingQuantity: `${formatRational(kind === "ADD_PURE" ? initialSolute : initialSolvent)} litres ${kind === "ADD_PURE" ? selected.solute : selected.solvent}`, concentrationOrMoisture: percentText(initial) },
        { stage: "Finally", totalQuantity: `${formatRational(finalTotal)} litres`, conservedQuantity: `${formatRational(kind === "ADD_PURE" ? initialSolvent : finalSolute)} litres ${kind === "ADD_PURE" ? selected.solvent : selected.solute}`, changingQuantity: `${formatRational(kind === "ADD_PURE" ? finalSolute : finalSolvent)} litres ${kind === "ADD_PURE" ? selected.solute : selected.solvent}`, concentrationOrMoisture: percentText(target) },
      ],
      accessibleText: `The conserved component remains unchanged while the total quantity changes from ${selected.total} to ${formatRational(finalTotal)} litres.`,
    },
  });
}

export const solventAdditionQuestion = (seed: string) => targetQuestion(seed, "DILUTE");
export const pureAdditionQuestion = (seed: string) => targetQuestion(seed, "ADD_PURE");
export const evaporationQuestion = (seed: string) => targetQuestion(seed, "EVAPORATE");
