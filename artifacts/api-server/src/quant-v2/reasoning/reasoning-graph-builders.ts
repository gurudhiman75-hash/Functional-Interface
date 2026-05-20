import type {
  CanonicalPercentageProblem,
  PercentageSubtype,
  ReasoningPattern,
} from "../canonical/percentage-types";
import { sanitizeEquation } from "./equation-utils";
import type {
  ReasoningGraph,
  ReasoningStep,
  ReasoningStepType,
} from "./reasoning-graph-types";

export type ReasoningGraphBuilder = (
  problem: CanonicalPercentageProblem,
) => ReasoningGraph;

type StepInput = {
  id: string;
  type: ReasoningStepType;
  descriptionKey: string;
  inputVariables: string[];
  outputVariable?: string;
  equation?: string;
  explanationHint?: string;
  trapWarning?: string;
};

function step(input: StepInput): ReasoningStep {
  return {
    ...input,
    equation: input.equation
      ? sanitizeEquation(input.equation)
      : undefined,
  };
}

function finalStep(
  inputVariables: string[],
  equation = "answer = {answer}",
): ReasoningStep {
  return step({
    id: "final",
    type: "final_answer",
    descriptionKey: "confirm_final_answer",
    inputVariables,
    equation,
  });
}

function trapSummary(
  problem: CanonicalPercentageProblem,
  extra: readonly string[] = [],
): string {
  return [...problem.traps, ...extra].join("|");
}

function graph(
  problem: CanonicalPercentageProblem,
  data: {
    subtype: PercentageSubtype;
    reasoningPattern: ReasoningPattern;
    insightKey: string;
    steps: ReasoningStep[];
    finalEquation: string;
    shortcutEquation?: string;
    trapSummary: string;
  },
): ReasoningGraph {
  if (problem.subtype !== data.subtype) {
    throw new Error(
      `Reasoning builder subtype mismatch: expected ${data.subtype}, received ${problem.subtype}.`,
    );
  }
  if (problem.reasoningPattern !== data.reasoningPattern) {
    throw new Error(
      `Reasoning builder pattern mismatch: expected ${data.reasoningPattern}, received ${problem.reasoningPattern}.`,
    );
  }

  return {
    subtype: data.subtype,
    reasoningPattern: data.reasoningPattern,
    insightKey: data.insightKey,
    steps: data.steps,
    branches: [
      {
        branchId: "standard",
        branchType: "standard",
        steps: data.steps,
      },
    ],
    finalEquation: sanitizeEquation(data.finalEquation),
    shortcutEquation: data.shortcutEquation
      ? sanitizeEquation(data.shortcutEquation)
      : undefined,
    trapSummary: data.trapSummary,
  };
}

export function buildElectionMarginGraph(
  problem: CanonicalPercentageProblem,
): ReasoningGraph {
  return graph(problem, {
    subtype: "election_margin",
    reasoningPattern: "margin_mapping",
    insightKey: "vote_gap_maps_to_margin",
    steps: [
      step({
        id: "derive_gap",
        type: "derive_percentage_gap",
        descriptionKey: "derive_vote_gap",
        inputVariables: [
          "winnerPercent",
          "loserPercent",
        ],
        outputVariable: "gapPercent",
        equation:
          "gapPercent = {winnerPercent} - {loserPercent}",
        trapWarning: "margin_confusion",
      }),
      step({
        id: "map_gap_to_total",
        type: "map_percentage_to_value",
        descriptionKey: "map_difference_to_total",
        inputVariables: [
          "margin",
          "gapPercent",
        ],
        outputVariable: "totalVotes",
        equation:
          "totalVotes = {margin} * 100 / {gapPercent}",
        trapWarning: "invalid_percentage_mapping",
      }),
      finalStep([
        "totalVotes",
        "answer",
      ]),
    ],
    finalEquation:
      "answer = {margin} * 100 / {gapPercent}",
    shortcutEquation:
      "{gapPercent}% = {margin}; 100% = {answer}",
    trapSummary: trapSummary(problem, [
      "invalid_percentage_mapping",
    ]),
  });
}

export function buildPassFailGraph(
  problem: CanonicalPercentageProblem,
): ReasoningGraph {
  return graph(problem, {
    subtype: "pass_fail",
    reasoningPattern: "difference_mapping",
    insightKey: "score_gap_maps_to_shortfall",
    steps: [
      step({
        id: "derive_shortfall_percent",
        type: "derive_percentage_gap",
        descriptionKey: "derive_pass_mark_gap",
        inputVariables: [
          "passPercent",
          "scoredPercent",
        ],
        outputVariable: "gapPercent",
        equation:
          "gapPercent = {passPercent} - {scoredPercent}",
        trapWarning: "margin_confusion",
      }),
      step({
        id: "map_shortfall_to_total",
        type: "map_percentage_to_value",
        descriptionKey: "map_shortfall_to_total_marks",
        inputVariables: [
          "shortBy",
          "gapPercent",
        ],
        outputVariable: "totalMarks",
        equation:
          "totalMarks = {shortBy} * 100 / {gapPercent}",
        trapWarning: "wrong_base",
      }),
      finalStep([
        "totalMarks",
        "answer",
      ]),
    ],
    finalEquation:
      "answer = {shortBy} * 100 / {gapPercent}",
    shortcutEquation:
      "{gapPercent}% = {shortBy}; 100% = {answer}",
    trapSummary: trapSummary(problem, [
      "denominator_confusion",
    ]),
  });
}

export function buildReversePercentageGraph(
  problem: CanonicalPercentageProblem,
): ReasoningGraph {
  return graph(problem, {
    subtype: "reverse_percentage",
    reasoningPattern: "reverse_reconstruction",
    insightKey: "part_percent_reconstructs_whole",
    steps: [
      step({
        id: "reverse_part_to_whole",
        type: "reverse_calculation",
        descriptionKey: "reverse_part_percent_relation",
        inputVariables: [
          "part",
          "percent",
        ],
        outputVariable: "whole",
        equation: "whole = {part} * 100 / {percent}",
        trapWarning: "wrong_base",
      }),
      finalStep([
        "whole",
        "answer",
      ]),
    ],
    finalEquation:
      "answer = {part} * 100 / {percent}",
    shortcutEquation:
      "{percent}% = {part}; 100% = {answer}",
    trapSummary: trapSummary(problem, [
      "denominator_confusion",
    ]),
  });
}

export function buildSuccessiveChangeGraph(
  problem: CanonicalPercentageProblem,
): ReasoningGraph {
  return graph(problem, {
    subtype: "increase_then_decrease",
    reasoningPattern: "successive_base_change",
    insightKey: "successive_changes_use_updated_base",
    steps: [
      step({
        id: "first_multiplier",
        type: "apply_multiplier",
        descriptionKey: "convert_first_percentage_to_multiplier",
        inputVariables: [
          "firstRate",
        ],
        outputVariable: "firstMultiplier",
        equation:
          "firstMultiplier = (100 + {firstRate}) / 100",
        trapWarning: "simple_addition",
      }),
      step({
        id: "apply_first_change",
        type: "apply_multiplier",
        descriptionKey: "apply_first_multiplier",
        inputVariables: [
          "base",
          "firstMultiplier",
        ],
        outputVariable: "afterFirst",
        equation:
          "afterFirst = {base} * firstMultiplier",
        trapWarning: "wrong_base",
      }),
      step({
        id: "second_multiplier",
        type: "apply_multiplier",
        descriptionKey: "convert_second_percentage_to_multiplier",
        inputVariables: [
          "secondRate",
        ],
        outputVariable: "secondMultiplier",
        equation:
          "secondMultiplier = (100 + {secondRate}) / 100",
        trapWarning: "reverse_direction",
      }),
      step({
        id: "apply_second_change",
        type: "apply_multiplier",
        descriptionKey: "apply_second_multiplier_to_updated_base",
        inputVariables: [
          "afterFirst",
          "secondMultiplier",
        ],
        outputVariable: "finalValue",
        equation:
          "finalValue = afterFirst * secondMultiplier",
        trapWarning: "wrong_base",
      }),
      finalStep([
        "finalValue",
        "answer",
      ]),
    ],
    finalEquation:
      "answer = {base} * (100 + {firstRate}) / 100 * (100 + {secondRate}) / 100",
    trapSummary: trapSummary(problem, [
      "additive_percentage_error",
    ]),
  });
}

export function buildRestoreValueGraph(
  problem: CanonicalPercentageProblem,
): ReasoningGraph {
  return graph(problem, {
    subtype: "restore_original",
    reasoningPattern: "reverse_reconstruction",
    insightKey: "restore_percent_uses_reduced_base",
    steps: [
      step({
        id: "derive_remaining_percent",
        type: "derive_percentage_gap",
        descriptionKey: "derive_remaining_percent_after_cut",
        inputVariables: [
          "cutPercent",
        ],
        outputVariable: "remainingPercent",
        equation:
          "remainingPercent = 100 - {cutPercent}",
        trapWarning: "same_percentage_assumption",
      }),
      step({
        id: "map_loss_to_recovery",
        type: "reverse_calculation",
        descriptionKey: "map_lost_percent_to_recovery_percent",
        inputVariables: [
          "cutPercent",
          "remainingPercent",
        ],
        outputVariable: "recoveryPercent",
        equation:
          "recoveryPercent = {cutPercent} * 100 / {remainingPercent}",
        trapWarning: "wrong_base",
      }),
      finalStep([
        "recoveryPercent",
        "answer",
      ]),
    ],
    finalEquation:
      "answer = {cutPercent} * 100 / {remainingPercent}",
    shortcutEquation:
      "{remainingPercent}% = {cutPercent}; 100% = {answer}",
    trapSummary: trapSummary(problem, [
      "wrong_recovery_base",
    ]),
  });
}

export function buildPopulationGrowthGraph(
  problem: CanonicalPercentageProblem,
): ReasoningGraph {
  return graph(problem, {
    subtype: "population_growth",
    reasoningPattern: "population_projection",
    insightKey: "population_projects_by_compound_multiplier",
    steps: [
      step({
        id: "growth_multiplier",
        type: "apply_multiplier",
        descriptionKey: "convert_growth_rate_to_multiplier",
        inputVariables: [
          "rate",
        ],
        outputVariable: "growthMultiplier",
        equation:
          "growthMultiplier = (100 + {rate}) / 100",
        trapWarning: "simple_addition",
      }),
      step({
        id: "project_population",
        type: "population_projection",
        descriptionKey: "project_population_across_years",
        inputVariables: [
          "population",
          "growthMultiplier",
          "years",
        ],
        outputVariable: "projectedPopulation",
        equation:
          "projectedPopulation = {population} * growthMultiplier ^ {years}",
        trapWarning: "wrong_base",
      }),
      finalStep([
        "projectedPopulation",
        "answer",
      ]),
    ],
    finalEquation:
      "answer = {population} * ((100 + {rate}) / 100) ^ {years}",
    trapSummary: trapSummary(problem, [
      "linear_growth_error",
    ]),
  });
}

export function buildSalaryRevisionGraph(
  problem: CanonicalPercentageProblem,
): ReasoningGraph {
  return graph(problem, {
    subtype: "salary_revision",
    reasoningPattern: "difference_mapping",
    insightKey: "salary_change_maps_over_old_salary",
    steps: [
      step({
        id: "derive_salary_change",
        type: "derive_percentage_gap",
        descriptionKey: "derive_salary_difference",
        inputVariables: [
          "newSalary",
          "oldSalary",
        ],
        outputVariable: "salaryDifference",
        equation:
          "salaryDifference = {newSalary} - {oldSalary}",
        trapWarning: "reverse_direction",
      }),
      step({
        id: "map_change_to_percent",
        type: "map_percentage_to_value",
        descriptionKey: "map_salary_difference_to_old_salary_percent",
        inputVariables: [
          "salaryDifference",
          "oldSalary",
        ],
        outputVariable: "revisionPercent",
        equation:
          "revisionPercent = salaryDifference * 100 / {oldSalary}",
        trapWarning: "wrong_base",
      }),
      finalStep([
        "revisionPercent",
        "answer",
      ]),
    ],
    finalEquation:
      "answer = ({newSalary} - {oldSalary}) * 100 / {oldSalary}",
    trapSummary: trapSummary(problem, [
      "new_salary_base_error",
    ]),
  });
}

export function buildPriceConsumptionGraph(
  problem: CanonicalPercentageProblem,
): ReasoningGraph {
  return graph(problem, {
    subtype: "price_consumption",
    reasoningPattern: "fixed_base_relation",
    insightKey: "fixed_expenditure_inverse_consumption",
    steps: [
      step({
        id: "derive_new_price_index",
        type: "apply_multiplier",
        descriptionKey: "derive_new_price_index",
        inputVariables: [
          "priceIncreasePercent",
        ],
        outputVariable: "newPriceIndex",
        equation:
          "newPriceIndex = 100 + {priceIncreasePercent}",
        trapWarning: "same_percentage_assumption",
      }),
      step({
        id: "balance_consumption_index",
        type: "fixed_expenditure_relation",
        descriptionKey: "balance_consumption_for_fixed_expenditure",
        inputVariables: [
          "newPriceIndex",
        ],
        outputVariable: "consumptionIndex",
        equation:
          "consumptionIndex = 100 * 100 / newPriceIndex",
        trapWarning: "wrong_base",
      }),
      step({
        id: "derive_consumption_reduction",
        type: "derive_percentage_gap",
        descriptionKey: "derive_consumption_reduction_percent",
        inputVariables: [
          "consumptionIndex",
        ],
        outputVariable: "reductionPercent",
        equation:
          "reductionPercent = 100 - consumptionIndex",
        trapWarning: "reverse_direction",
      }),
      finalStep([
        "reductionPercent",
        "answer",
      ]),
    ],
    finalEquation:
      "answer = {priceIncreasePercent} * 100 / (100 + {priceIncreasePercent})",
    shortcutEquation:
      "answer = {priceIncreasePercent} * 100 / (100 + {priceIncreasePercent})",
    trapSummary: trapSummary(problem, [
      "fixed_expenditure_wrong_base",
    ]),
  });
}

export function buildProfitLossGraph(
  problem: CanonicalPercentageProblem,
): ReasoningGraph {
  return graph(problem, {
    subtype: "profit_loss",
    reasoningPattern: "difference_mapping",
    insightKey: "price_difference_maps_over_cost_price",
    steps: [
      step({
        id: "derive_price_difference",
        type: "derive_percentage_gap",
        descriptionKey: "derive_selling_cost_difference",
        inputVariables: [
          "sellingPrice",
          "costPrice",
        ],
        outputVariable: "priceDifference",
        equation:
          "priceDifference = {sellingPrice} - {costPrice}",
        trapWarning: "reverse_direction",
      }),
      step({
        id: "map_difference_to_cost_percent",
        type: "map_percentage_to_value",
        descriptionKey: "map_price_difference_to_cost_price_percent",
        inputVariables: [
          "priceDifference",
          "costPrice",
        ],
        outputVariable: "profitLossPercent",
        equation:
          "profitLossPercent = priceDifference * 100 / {costPrice}",
        trapWarning: "wrong_base",
      }),
      finalStep([
        "profitLossPercent",
        "answer",
      ]),
    ],
    finalEquation:
      "answer = ({sellingPrice} - {costPrice}) * 100 / {costPrice}",
    trapSummary: trapSummary(problem, [
      "selling_price_base_error",
    ]),
  });
}

export function buildMixturePercentageGraph(
  problem: CanonicalPercentageProblem,
): ReasoningGraph {
  return graph(problem, {
    subtype: "mixture_percentage",
    reasoningPattern: "mixture_balance",
    insightKey: "unchanged_component_anchors_mixture",
    steps: [
      step({
        id: "derive_fixed_component",
        type: "mixture_balance",
        descriptionKey: "derive_unchanged_non_added_component",
        inputVariables: [
          "total",
          "initialPure",
        ],
        outputVariable: "fixedComponent",
        equation:
          "fixedComponent = {total} - {initialPure}",
        trapWarning: "wrong_base",
      }),
      step({
        id: "map_fixed_component_to_final_total",
        type: "mixture_balance",
        descriptionKey: "map_fixed_component_to_target_total",
        inputVariables: [
          "fixedComponent",
          "targetPercent",
        ],
        outputVariable: "finalMixtureTotal",
        equation:
          "finalMixtureTotal = fixedComponent * 100 / (100 - {targetPercent})",
        trapWarning: "denominator_confusion",
      }),
      step({
        id: "derive_added_quantity",
        type: "derive_percentage_gap",
        descriptionKey: "derive_added_quantity",
        inputVariables: [
          "finalMixtureTotal",
          "total",
        ],
        outputVariable: "addedQuantity",
        equation:
          "addedQuantity = finalMixtureTotal - {total}",
        trapWarning: "simple_addition",
      }),
      finalStep([
        "addedQuantity",
        "answer",
      ]),
    ],
    finalEquation:
      "answer = ({total} - {initialPure}) * 100 / (100 - {targetPercent}) - {total}",
    trapSummary: trapSummary(problem, [
      "unchanged_component_confusion",
    ]),
  });
}

export function buildRelationalPercentageGraph(
  problem: CanonicalPercentageProblem,
): ReasoningGraph {
  const v = problem.variables;
  const steps: ReasoningStep[] = [];
  const relationCount = Math.max(1, Math.trunc(v.relationCount ?? 1));

  steps.push(
    step({
      id: "normalize_base_entity",
      type: "relation_normalization",
      descriptionKey: "normalize_reference_entity_to_100",
      inputVariables: ["baseIndex"],
      outputVariable: "normalizedBase",
      equation: "normalizedBase = {baseIndex}",
      trapWarning: "normalization_error",
    }),
  );

  for (let index = 1; index <= relationCount; index += 1) {
    const inputVariable =
      index === 1 ? "normalizedBase" : `afterRelation${index - 1}`;
    const outputVariable =
      index === relationCount ? "finalIndex" : `afterRelation${index}`;
    const type =
      problem.topology?.variant === "reverse_relation_inference" && index === 1
        ? "relation_inversion"
        : "relation_transformation";
    steps.push(
      step({
        id: `apply_relation_${index}`,
        type,
        descriptionKey:
          type === "relation_inversion"
            ? "invert_percentage_relation"
            : "apply_percentage_relation",
          inputVariables: [
            inputVariable,
          `relation${index}Index`,
          ],
        outputVariable,
        equation:
          `${outputVariable} = ${inputVariable} * relation${index}Index / 100`,
        trapWarning:
          type === "relation_inversion"
            ? "incorrect_inversion"
            : "wrong_base",
      }),
    );
  }

  steps.push(
    step({
      id: "infer_final_comparison",
      type: "comparison_inference",
      descriptionKey: "infer_relative_difference_from_normalized_base",
      inputVariables: ["finalIndex", "baseIndex"],
      outputVariable: "relativeDifference",
      equation: "relativeDifference = finalIndex - {baseIndex}",
      trapWarning: "transitive_shortcut_error",
    }),
    finalStep([
      "relativeDifference",
      "answer",
    ]),
  );

  return {
    subtype: "relational_percentage",
    reasoningPattern: "relational_chain",
    insightKey: "chained_relations_multiply_not_add",
    steps,
    branches: [
      {
        branchId: "standard",
        branchType: "standard",
        steps,
      },
      {
        branchId: "relational_index",
        branchType: "relational",
        steps,
      },
    ],
    finalEquation:
      "answer = finalIndex - {baseIndex}",
    trapSummary: trapSummary(problem, [
      "additive_relation_error",
      "inverse_relation_error",
    ]),
  };
}
