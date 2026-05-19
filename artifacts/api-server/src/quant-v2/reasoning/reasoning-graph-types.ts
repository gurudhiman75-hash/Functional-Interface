import type {
  PercentageSubtype,
  ReasoningPattern,
} from "../canonical/percentage-types";

export type ReasoningStepType =
  | "derive_percentage_gap"
  | "map_percentage_to_value"
  | "apply_multiplier"
  | "reverse_calculation"
  | "fixed_expenditure_relation"
  | "ratio_conversion"
  | "population_projection"
  | "subtract_invalid_component"
  | "filter_subset"
  | "derive_remaining_component"
  | "reconstruct_component"
  | "aggregate_components"
  | "mixture_balance"
  | "final_answer";

export interface ReasoningStep {
  id: string;
  type: ReasoningStepType;
  descriptionKey: string;
  inputVariables: string[];
  outputVariable?: string;
  equation?: string;
  explanationHint?: string;
  trapWarning?: string;
}

export interface ReasoningBranch {
  branchId: string;
  branchType:
    | "standard"
    | "shortcut"
    | "proportional"
    | "unitary"
    | "reverse";
  steps: ReasoningStep[];
}

export interface ReasoningGraph {
  subtype: PercentageSubtype;
  reasoningPattern: ReasoningPattern;
  insightKey?: string;
  steps: ReasoningStep[];
  branches: ReasoningBranch[];
  finalEquation?: string;
  shortcutEquation?: string;
  trapSummary?: string;
}
