import type { CanonicalPercentageProblem, Trap } from "../canonical/percentage-types";

export type DistractorTrapType =
  | "wrong_denominator"
  | "reverse_percentage"
  | "additive_error"
  | "multiplicative_confusion"
  | "margin_confusion"
  | "hidden_base_error"
  | "inverse_relation_error"
  | "filtering_mistake"
  | "valid_vs_total_confusion"
  | "rounding_trap"
  | "one_step_shortcut_error"
  | "wrong_base"
  | "near_miss";

export type IntelligentDistractor = {
  value: number;
  rendered: string;
  trapType: DistractorTrapType;
  plausibility: number;
  eliminateRisk: number;
  reasoningPath: string;
};

function trapType(trap: Trap | string | undefined): DistractorTrapType {
  switch (trap) {
    case "wrong_denominator":
      return "wrong_denominator";
    case "reverse_direction":
      return "reverse_percentage";
    case "simple_addition":
      return "additive_error";
    case "additive_instead_of_multiplicative":
      return "multiplicative_confusion";
    case "margin_confusion":
      return "margin_confusion";
    case "hidden_base":
    case "hidden_base_error":
      return "hidden_base_error";
    case "incorrect_inversion":
    case "transitive_shortcut_error":
      return "inverse_relation_error";
    case "shortcut_overuse":
    case "skipped_derivation":
      return "one_step_shortcut_error";
    case "rounding":
    case "rounding_error":
      return "rounding_trap";
    case "forgetting_filtering_stage":
      return "filtering_mistake";
    case "ignoring_invalid_votes":
      return "valid_vs_total_confusion";
    case "wrong_base":
      return "wrong_base";
    default:
      return "near_miss";
  }
}

function numericValue(rendered: string) {
  const value = Number(rendered.replace(/[^\d.-]/gu, ""));
  return Number.isFinite(value) ? value : undefined;
}

function plausibilityFor(value: number, answer: number, type: DistractorTrapType) {
  const magnitude = Math.max(Math.abs(answer), 1);
  const distanceRatio = Math.abs(value - answer) / magnitude;
  const distanceScore = Math.max(42, 100 - Math.round(distanceRatio * 42));
  const trapBonus = type === "near_miss" ? 2 : 10;
  return Math.min(98, Math.max(35, distanceScore + trapBonus));
}

export function createDistractorIntelligence(input: {
  problem: CanonicalPercentageProblem;
  renderedOptions: readonly string[];
  correctIndex: number;
}): IntelligentDistractor[] {
  const topologyTraps = input.problem.topology?.misconceptionDistractors ?? [];
  return input.renderedOptions
    .map((rendered, index) => ({ rendered, index }))
    .filter((item) => item.index !== input.correctIndex)
    .map((item, distractorIndex) => {
      const value =
        numericValue(item.rendered) ??
        input.problem.distractors[distractorIndex] ??
        0;
      const trap =
        topologyTraps[distractorIndex]?.misconception ??
        input.problem.traps[distractorIndex];
      const type = trapType(trap);
      const plausibility = plausibilityFor(value, input.problem.answer, type);
      const magnitude = Math.max(Math.abs(input.problem.answer), 1);
      const distanceRatio = Math.abs(value - input.problem.answer) / magnitude;
      const eliminateRisk = Math.max(
        2,
        Math.min(95, 96 - plausibility + Math.round(Math.max(0, distanceRatio - 2) * 12)),
      );
      return {
        value,
        rendered: item.rendered,
        trapType: type,
        plausibility,
        eliminateRisk,
        reasoningPath:
          type === "near_miss"
            ? "near arithmetic miss"
            : type === "rounding_trap"
              ? "student rounds the intermediate value too early"
              : type === "one_step_shortcut_error"
                ? "student jumps from shortcut to answer without preserving the base"
                : `student applies ${type.replace(/_/gu, " ")} trap`,
      };
    });
}

export function validateDistractorIntelligence(
  distractors: readonly IntelligentDistractor[],
) {
  const issues: string[] = [];
  const trapTypes = new Set<string>();

  for (const distractor of distractors) {
    if (trapTypes.has(distractor.trapType)) {
      issues.push(`Duplicate distractor trap class: ${distractor.trapType}.`);
    }
    trapTypes.add(distractor.trapType);
    if (distractor.plausibility < 45) {
      issues.push(`Low-plausibility distractor: ${distractor.rendered}.`);
    }
    if (distractor.eliminateRisk > 70) {
      issues.push(`Instantly eliminable distractor: ${distractor.rendered}.`);
    }
    if (!distractor.reasoningPath.trim()) {
      issues.push(`Distractor has no reasoning path: ${distractor.rendered}.`);
    }
  }
  const absValues = distractors
    .map((item) => Math.abs(item.value))
    .filter((value) => value > 0)
    .sort((left, right) => left - right);
  const min = absValues[0] ?? 0;
  const max = absValues.at(-1) ?? 0;
  if (min > 0 && max / min > 50) {
    issues.push("Distractor magnitude spread is too large.");
  }

  return {
    valid: issues.length === 0,
    issues,
    metrics: {
      averagePlausibility:
        distractors.reduce((sum, item) => sum + item.plausibility, 0) /
        Math.max(1, distractors.length),
      maxEliminateRisk: Math.max(0, ...distractors.map((item) => item.eliminateRisk)),
      trapClassCount: trapTypes.size,
    },
  };
}
