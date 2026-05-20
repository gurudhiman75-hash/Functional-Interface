import type { CanonicalPercentageProblem } from "../canonical/percentage-types";
import type { ReasoningGraph } from "../reasoning/reasoning-graph-types";

export type ExaminerIntent =
  | "denominator_confusion"
  | "reverse_relation"
  | "hidden_total"
  | "successive_change_trap"
  | "valid_vs_total"
  | "filtered_population"
  | "ratio_percentage_confusion"
  | "hidden_base"
  | "wrong_base"
  | "consumption_inverse"
  | "component_balance";

export type ExaminerIntentReport = {
  primaryIntent: ExaminerIntent;
  secondaryIntents: ExaminerIntent[];
  intentQualityScore: number;
  psychologicalTrapDepth: number;
};

export function inferExaminerIntent(
  problem: CanonicalPercentageProblem,
  graph?: ReasoningGraph,
): ExaminerIntentReport {
  const intents = new Set<ExaminerIntent>();
  const topology = problem.topology;

  if (problem.subtype === "election_margin") {
    intents.add(topology?.filteringChain ? "valid_vs_total" : "denominator_confusion");
  }
  if (problem.subtype === "relational_percentage") {
    intents.add("reverse_relation");
  }
  if (problem.subtype === "increase_then_decrease") {
    intents.add("successive_change_trap");
  }
  if (problem.subtype === "price_consumption") {
    intents.add("consumption_inverse");
  }
  if (problem.subtype === "mixture_percentage") {
    intents.add("component_balance");
  }
  if (topology?.hiddenBase) {
    intents.add("hidden_base");
  }
  if (topology?.filteringChain) {
    intents.add(
      problem.category === "population" ? "filtered_population" : "valid_vs_total",
    );
  }
  if (problem.category === "ratio_mapping") {
    intents.add("ratio_percentage_confusion");
  }
  if (problem.subtype === "reverse_percentage" || problem.subtype === "restore_original") {
    intents.add("hidden_total");
  }

  if (intents.size === 0) {
    intents.add("wrong_base");
  }

  const primaryIntent = [...intents][0]!;
  const secondaryIntents = [...intents].slice(1);
  const graphDepth = graph?.steps.length ?? 1;
  const psychologicalTrapDepth = Math.min(
    100,
    55 + intents.size * 12 + graphDepth * 4 + (topology ? 8 : 0),
  );

  return {
    primaryIntent,
    secondaryIntents,
    intentQualityScore: Math.min(98, psychologicalTrapDepth + secondaryIntents.length * 3),
    psychologicalTrapDepth,
  };
}

