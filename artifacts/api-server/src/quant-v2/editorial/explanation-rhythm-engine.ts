import type {
  CanonicalPercentageProblem,
} from "../canonical/percentage-types";
import { sanitizeEquation } from "../reasoning/equation-utils";
import type {
  ReasoningGraph,
  ReasoningStep,
} from "../reasoning/reasoning-graph-types";
import { roundClean } from "../utils/math-utils";
import { createProblemSignature } from "../utils/problem-signature";
import type {
  EditorialRhythmProfile,
  EditorialStyle,
  NaturalizationTrace,
} from "./editorial-types";
import {
  semanticAnswerText,
  shortcutDomainNoun,
} from "./contextual-humanization";
import {
  formatSemanticValue,
  semanticValueForLabel,
} from "./semantic-values";
import {
  hashText,
  selectConnector,
  selectRhythmProfile,
  selectStepPhrase,
  shouldSurfaceShortcut,
} from "./phrase-rotation";
import { contextualOutputLabel } from "./contextual-label-registry";

type RenderedEquation = {
  label: string;
  expression: string;
  value?: number;
  lines: string[];
};

function n(value: number | undefined) {
  if (typeof value !== "number") {
    return "";
  }
  const rounded = roundClean(value, 2);
  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded).replace(/0+$/u, "").replace(/\.$/u, "");
}

function cleanPercentValue(value: number) {
  return n(value);
}

function normalizeSignedExpression(expression: string) {
  return expression
    .replace(/\(\s*100\s*\+\s*(-?\d+(?:\.\d+)?)\s*\)/gu, (_, raw: string) => {
      const value = Number(raw);
      return value < 0 ? `(100 - ${n(Math.abs(value))})` : `(100 + ${n(value)})`;
    })
    .replace(/\+\s*-/gu, "- ")
    .replace(/\s+/gu, " ")
    .trim();
}

function humanExpression(
  expression: string,
  variables: Record<string, number>,
) {
  return normalizeSignedExpression(
    expression
      .replace(
        /\{([A-Za-z_][A-Za-z0-9_]*)\}/gu,
        (_, key: string) =>
          typeof variables[key] === "number" ? n(variables[key]) : "",
      )
      .replace(
        /\b[A-Za-z_][A-Za-z0-9_]*\b/gu,
        (key) => (typeof variables[key] === "number" ? n(variables[key]) : ""),
      )
      .replace(/\*/gu, "x")
      .replace(/\s+%/gu, "%")
      .replace(/\s+;/gu, ";")
      .replace(/\s+/gu, " "),
  );
}

function evalExpression(
  expression: string,
  variables: Record<string, number>,
) {
  let substituted = expression
    .replace(
      /\{([A-Za-z_][A-Za-z0-9_]*)\}/gu,
      (_, key: string) =>
        typeof variables[key] === "number" ? n(variables[key]) : "",
    )
    .replace(
      /\b[A-Za-z_][A-Za-z0-9_]*\b/gu,
      (key) => (typeof variables[key] === "number" ? n(variables[key]) : ""),
    );

  if (/[A-Za-z_{}]/u.test(substituted)) {
    return null;
  }
  substituted = substituted.replace(/\^/gu, "**");
  if (!/^[0-9+\-*/().\s%]+$/u.test(substituted)) {
    return null;
  }

  try {
    const value = Function(`"use strict"; return (${substituted});`)() as unknown;
    return typeof value === "number" && Number.isFinite(value)
      ? roundClean(value, 2)
      : null;
  } catch {
    return null;
  }
}

function percentAfterChange(rate: number | undefined) {
  if (typeof rate !== "number") {
    return undefined;
  }

  return 100 + rate;
}

function outputLabel(
  problem: CanonicalPercentageProblem,
  step: ReasoningStep,
) {
  const contextualLabel = contextualOutputLabel(problem, step);
  if (contextualLabel) {
    return contextualLabel;
  }

  const output = step.outputVariable;
  const variant = problem.topology?.variant;

  switch (step.descriptionKey) {
    case "derive_salary_difference":
      return problem.answer < 0 ? "Decrease in salary" : "Increase in salary";
    case "derive_selling_cost_difference":
      return problem.answer < 0 ? "Loss amount" : "Profit amount";
    case "derive_new_price_index":
      return "New price after increase";
    case "derive_consumption_reduction_percent":
      return "Reduction in consumption";
    case "combine_shortfall_and_excess_marks":
      return "Total marks gap";
    case "derive_adjusted_score_percent":
      return "Adjusted score";
    case "derive_remaining_required_percent_gap":
      return "Extra marks required";
    case "derive_unchanged_non_added_component":
      return "Water quantity";
    case "map_fixed_component_to_target_total":
      return "Final mixture quantity";
    case "derive_added_quantity":
      return "Milk to be added";
    case "apply_growth_rate":
    case "apply_population_growth_rate":
      return "Population after increase";
    case "apply_decay_to_updated_population":
      return "Population after decrease";
    case "derive_migration_component_from_original_population":
      return "Population added by migration";
    case "aggregate_growth_and_migration":
      return "Final population after migration";
    case "derive_male_population_component":
      return "Male population";
    case "derive_female_population_component":
      return "Female population";
    case "apply_male_population_growth":
      return "Male population after growth";
    case "apply_female_population_decay":
      return "Female population after reduction";
    case "aggregate_shifted_population_components":
      return "Final population";
    case "derive_weighted_population_change_rate":
      return "Net population change";
    case "apply_weighted_change_to_total_population":
      return "Final population";
    default:
      break;
  }

  if (step.type === "derive_percentage_gap") {
    if (problem.subtype === "election_margin") {
      return step.descriptionKey.includes("remaining") ||
        step.descriptionKey.includes("runner") ||
        step.descriptionKey.includes("unstated")
        ? "Remaining vote share"
        : "Margin percentage";
    }
    if (problem.subtype === "pass_fail") {
      if (step.descriptionKey.includes("remaining")) {
        return "Marks still needed";
      }
      return "Pass mark difference";
    }
    if (step.descriptionKey.includes("remaining")) {
      return "Remaining percentage";
    }
    if (step.descriptionKey.includes("salary")) {
      return problem.answer < 0 ? "Decrease in salary" : "Increase in salary";
    }
    if (step.descriptionKey.includes("price")) {
      return problem.answer < 0 ? "Loss amount" : "Profit amount";
    }
    if (step.descriptionKey.includes("consumption")) {
      return "Reduction in consumption";
    }
    return "Difference";
  }
  if (step.type === "map_percentage_to_value") {
    if (output === "totalVotes") {
      return "Total votes";
    }
    if (output === "totalMarks") {
      return "Maximum marks";
    }
    if (output === "winnerVotes") {
      return "Winner's votes";
    }
    if (output === "revisionPercent") {
      return "Change %";
    }
    if (output === "profitLossPercent") {
      return problem.variables.direction === -1 ? "Loss %" : "Profit %";
    }
    if (output === "addedQuantity") {
      return "Milk to be added";
    }
    return variant?.includes("vote") ? "Votes" : "Required value";
  }
  if (step.type === "reverse_calculation") {
    if (output === "whole") {
      return "Total quantity";
    }
    if (output === "validVotes") {
      return "Valid votes";
    }
    if (output === "recoveryPercent") {
      return "Required increase %";
    }
    return "Total quantity";
  }
  if (step.type === "reconstruct_component") {
    if (output === "registeredVoters") {
      return "Registered voters";
    }
    if (output === "totalVotes") {
      return "Total votes";
    }
    if (output === "votedVotes") {
      return "Votes polled";
    }
    return "Original total";
  }
  if (step.type === "filter_subset") {
    if (output === "validVotes") {
      return "Effective valid votes";
    }
    if (output === "votedVotes") {
      return "Votes polled";
    }
    if (output === "winnerVotes") {
      return "Winner's votes";
    }
    return problem.subtype === "pass_fail"
      ? "Marks already secured"
      : "Effective total";
  }
  if (step.type === "derive_remaining_component") {
    if (problem.subtype === "election_margin") {
      return "Votes remaining for other candidates";
    }
    return output?.toLowerCase().includes("female")
      ? "Female population"
      : "Remaining component";
  }
  if (step.type === "aggregate_components") {
    return output?.toLowerCase().includes("population")
      ? "Final population"
      : "Combined total";
  }
  if (step.type === "apply_multiplier") {
    if (output?.toLowerCase().includes("multiplier")) {
      return "Change factor";
    }
    if (output === "adjustedPercent") {
      return "Adjusted score";
    }
    if (output === "afterFirst") {
      return "Value after first change";
    }
    if (output === "finalValue") {
      return "Final value";
    }
    if (output?.toLowerCase().includes("population")) {
      return "Population after change";
    }
    if (output === "newPriceIndex") {
      return "New price after increase";
    }
    return "Value after change";
  }
  if (step.type === "population_projection") {
    return "Population after growth";
  }
  if (step.type === "mixture_balance") {
    if (output === "fixedComponent") {
      return "Water quantity";
    }
    if (output === "finalMixtureTotal") {
      return "Final mixture quantity";
    }
    return "Mixture quantity";
  }
  if (step.type === "fixed_expenditure_relation") {
    return "New consumption";
  }
  if (step.type === "ratio_conversion") {
    return "Share";
  }
  if (step.type === "relation_normalization") {
    return "Reference value";
  }
  if (step.type === "relation_transformation") {
    if (output === "finalIndex") {
      return "Final value index";
    }
    return "Relation index";
  }
  if (step.type === "relation_inversion") {
    return "Inverted relation index";
  }
  if (step.type === "comparison_inference") {
    return problem.answer < 0 ? "Percentage less" : "Percentage more";
  }
  if (step.type === "subtract_invalid_component") {
    return "Valid votes";
  }

  return "Required value";
}

function displayValue(label: string, value: number) {
  const absoluteValue =
    label.includes("Loss") ||
    label.includes("Decrease") ||
    label.includes("reduction")
      ? Math.abs(value)
      : value;
  return formatSemanticValue(semanticValueForLabel(label, absoluteValue));
}

function positiveExpressionForLabel(label: string, expression: string) {
  if (
    label.includes("Loss") ||
    label.includes("Decrease") ||
    label.includes("reduction")
  ) {
    return expression.replace(/^-/, "").replace(/\(\s*-/gu, "(");
  }

  return expression;
}

function overrideEquation(
  problem: CanonicalPercentageProblem,
  step: ReasoningStep,
  variables: Record<string, number>,
): RenderedEquation | undefined {
  const v = problem.variables;
  const label = outputLabel(problem, step);
  let expression: string | undefined;
  let value: number | undefined;

  switch (step.descriptionKey) {
    case "derive_salary_difference":
      if (typeof v.oldSalary === "number" && typeof v.newSalary === "number") {
        if (v.newSalary < v.oldSalary) {
          expression = `${n(v.oldSalary)} - ${n(v.newSalary)}`;
          value = v.oldSalary - v.newSalary;
        } else {
          expression = `${n(v.newSalary)} - ${n(v.oldSalary)}`;
          value = v.newSalary - v.oldSalary;
        }
      }
      break;
    case "derive_selling_cost_difference":
      if (typeof v.costPrice === "number" && typeof v.sellingPrice === "number") {
        if (v.sellingPrice < v.costPrice) {
          expression = `${n(v.costPrice)} - ${n(v.sellingPrice)}`;
          value = v.costPrice - v.sellingPrice;
        } else {
          expression = `${n(v.sellingPrice)} - ${n(v.costPrice)}`;
          value = v.sellingPrice - v.costPrice;
        }
      }
      break;
    case "apply_first_multiplier":
      expression = `${n(v.base)} x ${cleanPercentValue(percentAfterChange(v.firstRate) ?? 0)} / 100`;
      value = v.afterFirst;
      break;
    case "apply_second_multiplier_to_updated_base":
      expression = `${n(v.afterFirst)} x ${cleanPercentValue(percentAfterChange(v.secondRate) ?? 0)} / 100`;
      value = problem.answer;
      break;
    case "project_population_across_years":
      expression = `${n(v.population)} x (${cleanPercentValue(percentAfterChange(v.rate) ?? 0)} / 100)^${n(v.years)}`;
      value = problem.answer;
      break;
    case "apply_growth_rate":
    case "apply_population_growth_rate":
      expression = `${n(v.population)} x ${cleanPercentValue(percentAfterChange(v.growthRate) ?? 0)} / 100`;
      value = v.afterGrowth;
      break;
    case "apply_decay_to_updated_population":
      expression = `${n(v.afterGrowth)} x ${cleanPercentValue(100 - (v.decayRate ?? 0))} / 100`;
      value = problem.answer;
      break;
    default:
      return undefined;
  }

  return typeof expression === "string"
    ? buildRenderedEquation(label, expression, value)
    : undefined;
}

function buildRenderedEquation(
  label: string,
  expression: string,
  value: number | undefined,
): RenderedEquation {
  const displayExpression = positiveExpressionForLabel(label, expression);
  const lines =
    typeof value === "number"
      ? [`${label} =`, displayExpression, `= ${displayValue(label, value)}`]
      : [`${label} =`, displayExpression];

  return {
    label,
    expression: displayExpression,
    value,
    lines,
  };
}

function normalizedLabelText(text: string) {
  return text
    .replace(/[:=]\s*$/u, "")
    .replace(/\s+is$/iu, "")
    .replace(/\s+are$/iu, "")
    .trim()
    .toLowerCase();
}

function equationLinesForPhrase(
  equation: RenderedEquation,
  phrase: string,
) {
  return normalizedLabelText(phrase) === normalizedLabelText(equation.label)
    ? equation.lines.slice(1)
    : equation.lines;
}

function renderEquation(
  problem: CanonicalPercentageProblem,
  step: ReasoningStep,
  variables: Record<string, number>,
) {
  if (!step.equation) {
    return undefined;
  }

  const override = overrideEquation(problem, step, variables);
  if (override) {
    if (step.outputVariable && typeof override.value === "number") {
      variables[step.outputVariable] = override.value;
    }
    return override;
  }

  const normalized = sanitizeEquation(step.equation);
  const [left, ...rightParts] = normalized.split("=");
  const output = left?.trim();
  const right = rightParts.join("=").trim();
  if (!output || !right) {
    return undefined;
  }

  const label = outputLabel(problem, step);
  const expression = humanExpression(right, variables);
  const value = evalExpression(right, variables);
  if (step.outputVariable && typeof value === "number") {
    variables[step.outputVariable] = value;
  }

  return buildRenderedEquation(label, expression, value ?? undefined);
}

function shortcutOutputLabel(problem: CanonicalPercentageProblem) {
  switch (problem.subtype) {
    case "price_consumption":
      return "Reduction in consumption";
    case "restore_original":
      return "Required increase %";
    case "profit_loss":
      return problem.answer < 0 ? "Loss %" : "Profit %";
    case "reverse_percentage":
      return "Total value";
    case "pass_fail":
      return "Maximum marks";
    case "election_margin":
      return "Total votes";
    default:
      return "Required value";
  }
}

function renderShortcutEquation(
  equation: string,
  variables: Record<string, number>,
  problem: CanonicalPercentageProblem,
) {
  const normalized = sanitizeEquation(equation);
  const [left, ...rightParts] = normalized.split("=");
  const output = left?.trim();
  const right = rightParts.join("=").trim();

  if (
    output &&
    right &&
    /^[A-Za-z_][A-Za-z0-9_]*$/u.test(output)
  ) {
    const expression = humanExpression(right, variables);
    const value = evalExpression(right, variables);
    const label = shortcutOutputLabel(problem);
    return typeof value === "number"
      ? [`${label} =`, expression, `= ${displayValue(label, value)}`]
      : [`${label} =`, expression];
  }

  const domainNoun =
    shortcutDomainNoun(problem);
  const rendered = humanExpression(normalized, variables)
    .replace(/;/gu, "\n")
    .replace(/\s*=\s*/gu, " = ")
    .replace(/[ \t]+/gu, " ")
    .split("\n")
    .map((line) => line.trim())
    .flatMap((line) => {
      const direct = line.match(/^(\d+(?:\.\d+)?%)\s*=\s*(\d+(?:\.\d+)?)$/u);
      if (direct) {
        const percent = direct[1]!;
        const value = direct[2]!;
        return percent === "100%"
          ? [`100% ${domainNoun} =`, value]
          : [`${percent} ${domainNoun} = ${value}`, "", "So,"];
      }

      const proportional = line.match(
        /^(\d+(?:\.\d+)?%)\s+(\d+(?:\.\d+)?)\s*=\s*(\d+(?:\.\d+)?)$/u,
      );
      if (proportional) {
        const percent = proportional[1]!;
        const base = proportional[2]!;
        const value = proportional[3]!;
        const baseLabel =
          Math.abs(Number(base) - problem.answer) < 0.0001
            ? `total ${domainNoun}`
            : `${base} ${domainNoun}`;
        return `${percent} of ${baseLabel} = ${value}`;
      }

      const identity = line.match(
        /^(\d+(?:\.\d+)?)\s*=\s*\1$/u,
      );
      if (identity) {
        const label = shortcutOutputLabel(problem);
        return `${label} = ${displayValue(label, Number(identity[1]))}`;
      }

      return line;
    })
    .filter(Boolean);

  return rendered.length > 0 ? rendered : [humanExpression(equation, variables)];
}

function rateObservation(rate: number | undefined) {
  if (typeof rate !== "number") {
    return "After the percentage change:";
  }

  return rate < 0
    ? `After a ${n(Math.abs(rate))}% decrease:`
    : `After a ${n(rate)}% increase:`;
}

function stepObservation(
  problem: CanonicalPercentageProblem,
  step: ReasoningStep,
  fallback: string,
) {
  const v = problem.variables;

  switch (step.descriptionKey) {
    case "apply_first_multiplier":
      return rateObservation(v.firstRate);
    case "apply_second_multiplier_to_updated_base":
      return rateObservation(v.secondRate);
    case "apply_growth_rate":
    case "apply_population_growth_rate":
      return "Population after increase:";
    case "apply_decay_to_updated_population":
      return "Population after decrease:";
    case "derive_adjusted_score_percent":
      return "After adding the bonus:";
    case "derive_vote_gap":
    case "derive_valid_vote_gap":
    case "derive_winner_runner_gap":
    case "derive_gap_against_remaining_candidate":
      return "Winning margin:";
    case "derive_runner_share_from_remaining_distribution":
    case "derive_unstated_candidate_share":
      return "Remaining candidate's vote share:";
    case "map_difference_to_total":
      return problem.subtype === "election_margin"
        ? "Total votes are:"
        : fallback;
    case "derive_pass_mark_gap":
    case "derive_pass_gap_after_adjustment":
      return "Pass mark difference:";
    case "combine_shortfall_and_excess_marks":
      return "Total marks gap:";
    case "derive_gap_between_two_scores":
      return "Marks percentage gap:";
    case "derive_scored_percent_over_total_marks":
      return "Marks already secured:";
    case "derive_remaining_required_percent_gap":
      return "Extra marks required:";
    case "map_shortfall_to_total_marks":
    case "map_combined_gap_to_total_marks":
    case "map_remaining_marks_required_to_total":
      return "Maximum marks are:";
    case "reverse_part_percent_relation":
      return "Total quantity is:";
    case "map_lost_percent_to_recovery_percent":
      return "Required increase %:";
    case "map_salary_difference_to_old_salary_percent":
      return "Change %:";
    case "derive_salary_difference":
      return problem.answer < 0
        ? "Decrease in salary:"
        : "Increase in salary:";
    case "derive_selling_cost_difference":
      return problem.answer < 0 ? "Loss amount:" : "Profit amount:";
    case "map_price_difference_to_cost_price_percent":
      return problem.answer < 0
        ? "Loss %:"
        : "Profit %:";
    case "reconstruct_valid_votes_from_margin":
      return "Effective valid votes:";
    case "reconstruct_total_before_invalid_filter":
      return "Total votes are:";
    case "reconstruct_voted_votes_before_invalid_filter":
      return "Votes polled are:";
    case "reconstruct_registered_voters_before_turnout_filter":
      return "Registered voters are:";
    case "map_valid_votes_to_winner_votes":
      return "Winner's votes are:";
    case "project_population_across_years":
      return "Population after growth:";
    case "derive_remaining_percent_after_cut":
      return `After a ${n(v.cutPercent)}% reduction, percentage left is:`;
    case "derive_new_price_index":
      return "New price after increase:";
    case "balance_consumption_for_fixed_expenditure":
      return "For the same expenditure:";
    case "derive_consumption_reduction_percent":
      return "Reduction in consumption is:";
    case "derive_unchanged_non_added_component":
      return "Water quantity remains unchanged.";
    case "map_fixed_component_to_target_total":
      return "Final mixture quantity:";
    case "derive_added_quantity":
      return "Milk to be added:";
    case "derive_migration_component_from_original_population":
      return "Population added by migration:";
    case "aggregate_growth_and_migration":
      return "Final population after migration:";
    case "derive_male_population_component":
      return "Male population:";
    case "derive_female_population_component":
      return "Female population:";
    case "apply_male_population_growth":
      return "Male population after growth:";
    case "apply_female_population_decay":
      return "Female population after reduction:";
    case "aggregate_shifted_population_components":
      return "Final population:";
    case "normalize_reference_entity_to_100":
      return "Take the reference value as 100:";
    case "apply_percentage_relation":
      return "Using the percentage relation:";
    case "invert_percentage_relation":
      return "Using the inverse relation:";
    case "infer_relative_difference_from_normalized_base":
      return "Compare with 100:";
    default:
      return fallback;
  }
}

function startsWithTransition(text: string) {
  return /^(?:So|Now|Hence|Therefore|Thus)(?:,|\b)/u.test(text.trim());
}

function isAssignmentShortcut(shortcutEquation: string | undefined) {
  if (!shortcutEquation) {
    return false;
  }
  const normalized = sanitizeEquation(shortcutEquation);
  const [left, ...rightParts] = normalized.split("=");
  return Boolean(rightParts.join("=").trim()) &&
    /^[A-Za-z_][A-Za-z0-9_]*$/u.test(left?.trim() ?? "");
}

function isAnswerEquivalentStep(
  problem: CanonicalPercentageProblem,
  step: ReasoningStep,
) {
  if (!step.outputVariable) {
    return false;
  }

  const outputValue = problem.variables[step.outputVariable];
  return typeof outputValue === "number" &&
    Math.abs(outputValue - problem.answer) < 0.0001;
}

function shortcutAlreadyCoversStep(input: {
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
  step: ReasoningStep;
}) {
  if (!input.graph.shortcutEquation || !input.step.outputVariable) {
    return false;
  }
  if (
    ![
      "map_percentage_to_value",
      "reverse_calculation",
      "reconstruct_component",
      "filter_subset",
    ].includes(input.step.type)
  ) {
    return false;
  }

  const outputValue = input.problem.variables[input.step.outputVariable];
  if (typeof outputValue !== "number") {
    return false;
  }

  return humanExpression(
    sanitizeEquation(input.graph.shortcutEquation),
    input.problem.variables,
  ).includes(n(outputValue));
}

function shouldSkipStepAfterShortcut(input: {
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
  step: ReasoningStep;
  shortcutSurfaced: boolean;
}) {
  void input;
  return false;
}

function pickEnding(
  problem: CanonicalPercentageProblem,
  options: readonly string[],
) {
  return options[
    hashText(createProblemSignature(problem)) % options.length
  ]!;
}

function finalEndingText(problem: CanonicalPercentageProblem) {
  const answer = semanticAnswerText(problem);
  const variant = problem.topology?.variant;

  switch (problem.subtype) {
    case "election_margin":
      return variant === "filtered_valid_vote_margin"
        ? `${pickEnding(problem, [
            "Hence, winning candidate's votes",
            "Therefore, winning candidate's votes",
            "Winning candidate's votes",
          ])} = ${answer}`
        : `${pickEnding(problem, [
            "Hence, total votes polled",
            "Therefore, total votes",
            "Total votes",
          ])} = ${answer}`;
    case "pass_fail":
      return `${pickEnding(problem, [
        "Thus, maximum marks",
        "Hence, maximum marks in the test",
        "Maximum marks",
      ])} = ${answer}`;
    case "population_growth":
      return `${pickEnding(problem, [
        "Hence, final population",
        "Accordingly, final population",
        "Final population",
      ])} = ${answer}`;
    case "price_consumption":
      return `${pickEnding(problem, [
        "So, reduction in consumption",
        "Hence, required reduction",
        "Reduction in consumption",
      ])} = ${answer}`;
    case "salary_revision":
      return `${pickEnding(problem, [
        "So, salary change",
        "Hence, salary revision",
        "Salary change",
      ])} = ${answer}`;
    case "profit_loss":
      return problem.answer < 0
        ? `${pickEnding(problem, [
            "Thus, loss %",
            "Hence, loss on cost price",
            "Loss %",
          ])} = ${answer}`
        : `${pickEnding(problem, [
            "Thus, profit %",
            "Hence, profit on cost price",
            "Profit %",
          ])} = ${answer}`;
    case "restore_original":
      return `${pickEnding(problem, [
        "So, required increase",
        "Hence, increase needed to restore the value",
        "Required increase %",
      ])} = ${answer}`;
    case "reverse_percentage":
      return `${pickEnding(problem, [
        "Hence, total quantity for the record",
        "Therefore, total quantity for the record",
        "Required total quantity for the record",
      ])} = ${answer}`;
    case "mixture_percentage":
      return `${pickEnding(problem, [
        "Thus, milk to be added",
        "Hence, milk to be added",
        "Milk to be added",
      ])} = ${answer}`;
    default:
      return `${pickEnding(problem, [
        "Therefore, final value",
        "Hence, final value",
        "Final value",
      ])} = ${answer}`;
  }
}

function suppressConnector(
  connector: string | undefined,
  phrase: string,
  lines: readonly string[],
) {
  if (!connector) {
    return undefined;
  }
  const previous = lines[lines.length - 1]?.trim() ?? "";
  if (
    startsWithTransition(phrase) ||
    startsWithTransition(previous) ||
    phrase.trim().endsWith(":")
  ) {
    return undefined;
  }

  return connector;
}

function isInternalConversionStep(step: ReasoningStep) {
  return [
    "convert_first_percentage_to_multiplier",
    "convert_second_percentage_to_multiplier",
    "convert_growth_rate_to_multiplier",
  ].includes(step.descriptionKey);
}

function explanationScore(input: {
  rhythmProfile: EditorialRhythmProfile;
  phraseVariants: readonly string[];
  shortcutSurfaced: boolean;
  hasShortcut: boolean;
}) {
  const uniquePhraseCount = new Set(input.phraseVariants).size;
  let score = 80 + Math.min(12, uniquePhraseCount * 2);

  if (input.rhythmProfile === "equation_first_rhythm") {
    score += 4;
  }
  if (input.rhythmProfile === "shortcut_first_rhythm") {
    score += 4;
  }
  if (!input.hasShortcut || input.shortcutSurfaced) {
    score += 4;
  }

  return Math.min(100, score);
}

function appendStepLines(input: {
  lines: string[];
  rhythmProfile: EditorialRhythmProfile;
  phrase: string;
  equation?: RenderedEquation;
  connector?: string;
  includePhraseForEquationFirst?: boolean;
}) {
  const {
    lines,
    rhythmProfile,
    phrase,
    equation,
    connector,
    includePhraseForEquationFirst,
  } = input;

  if (!equation) {
    lines.push(phrase);
    return "phrase_only";
  }
  const equationLines = equationLinesForPhrase(equation, phrase);

  if (rhythmProfile === "equation_first_rhythm") {
    if (includePhraseForEquationFirst) {
      lines.push(phrase);
    }
    lines.push(
      ...(includePhraseForEquationFirst ? equationLines : equation.lines),
    );
    return "equation_first";
  }

  if (rhythmProfile === "compact_exam_rhythm") {
    lines.push(phrase);
    lines.push(...equationLines);
    return "compact_human";
  }

  if (connector && lines.length > 0) {
    lines.push(connector);
  }
  lines.push(phrase);
  lines.push(...equationLines);
  return "lead_first_human";
}

export function realizeExplanationWithNaturalization(input: {
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
  style?: EditorialStyle;
  seed?: number | string;
}): {
  explanation: string;
  naturalization: Omit<NaturalizationTrace, "stemPatternId" | "naturalizationScore"> & {
    naturalizationScore: number;
  };
} {
  const signature = createProblemSignature(input.problem);
  const rhythmProfile = selectRhythmProfile({
    style: input.style,
    seed: input.seed,
    signature,
  });
  const variables: Record<string, number> = {
    ...input.problem.variables,
    answer: input.problem.answer,
  };
  const lines: string[] = [];
  const phraseVariants: string[] = [];
  const explanationPatternIds: string[] = [];
  let emittedStepCount = 0;
  const shortcutSurfaced = shouldSurfaceShortcut({
    hasShortcut: Boolean(input.graph.shortcutEquation),
    rhythmProfile,
    seed: input.seed,
    signature,
  });

  if (shortcutSurfaced && input.graph.shortcutEquation) {
    lines.push(
      rhythmProfile === "shortcut_first_rhythm"
        ? "Shortcut:"
        : "Direct relation:",
    );
    lines.push(
      ...renderShortcutEquation(
        input.graph.shortcutEquation,
        variables,
        input.problem,
      ),
    );
    lines.push("");
    lines.push("Using the percentage relation:");
    explanationPatternIds.push("shortcut_block");
  }

  const visibleStepCount = input.graph.steps.filter(
    (step) => step.type !== "final_answer" && !isInternalConversionStep(step),
  ).length;

  input.graph.steps.forEach((step, index) => {
    if (step.type === "final_answer") {
      return;
    }
    if (isInternalConversionStep(step)) {
      return;
    }
    if (
      shouldSkipStepAfterShortcut({
        problem: input.problem,
        graph: input.graph,
        step,
        shortcutSurfaced,
      })
    ) {
      explanationPatternIds.push(`${step.type}:shortcut_compressed`);
      return;
    }

    const equation = renderEquation(input.problem, step, variables);
    const { phrase, variantId } = selectStepPhrase({
      step,
      seed: input.seed,
      signature,
    });
    const displayPhrase = stepObservation(input.problem, step, phrase);
    const rawConnector =
      index > 0
        ? selectConnector({
            index,
            seed: input.seed,
            signature,
          })
        : undefined;
    const connector = suppressConnector(rawConnector, displayPhrase, lines);
    const patternId = appendStepLines({
      lines,
      rhythmProfile,
      phrase: displayPhrase,
      equation,
      connector,
      includePhraseForEquationFirst: visibleStepCount <= 2,
    });

    phraseVariants.push(variantId);
    explanationPatternIds.push(`${step.type}:${patternId}`);
    emittedStepCount += 1;

    if (rhythmProfile === "coaching_rhythm") {
      lines.push("");
    }
  });

  if (shortcutSurfaced && emittedStepCount === 0) {
    phraseVariants.push(`shortcut:${input.problem.subtype}_context_bridge`);
    explanationPatternIds.push("shortcut_bridge");
  }

  if (
    input.problem.subtype === "population_growth" &&
    typeof input.problem.variables.years === "number" &&
    input.problem.variables.years > 1 &&
    lines.filter((line) => line.trim().length > 0).length <= 3
  ) {
    lines.push(`Growth is applied for ${n(input.problem.variables.years)} years.`);
    explanationPatternIds.push("population_growth:pedagogical_bridge");
  }

  const previousLine = lines[lines.length - 1]?.trim() ?? "";
  if (startsWithTransition(previousLine)) {
    lines.pop();
  }
  lines.push(finalEndingText(input.problem));

  return {
    explanation: lines
      .join("\n")
      .replace(/[ \t]+$/gmu, "")
      .replace(/\n{3,}/gu, "\n\n")
      .trim(),
    naturalization: {
      rhythmProfile,
      phraseVariants,
      shortcutSurfaced,
      explanationPatternIds,
      naturalizationScore: explanationScore({
        rhythmProfile,
        phraseVariants,
        shortcutSurfaced,
        hasShortcut: Boolean(input.graph.shortcutEquation),
      }),
    },
  };
}
