import type {
  ReasoningStep,
  ReasoningStepType,
} from "../reasoning/reasoning-graph-types";
import type { EditorialRhythmProfile } from "./editorial-types";

type PhraseOption = {
  id: string;
  text: string;
};

const STEP_PHRASES = {
  derive_percentage_gap: [
    { id: "gap_difference", text: "Difference between them is:" },
    { id: "gap_percentage", text: "Percentage gap:" },
    { id: "gap_required", text: "Required difference:" },
    { id: "gap_shares", text: "Difference in shares:" },
  ],
  map_percentage_to_value: [
    { id: "map_this_share", text: "So the full value is:" },
    { id: "map_given_value", text: "Required percentage is:" },
    { id: "map_scale_total", text: "100% value is:" },
    { id: "map_full_value", text: "Total value is:" },
  ],
  reverse_calculation: [
    { id: "reverse_base", text: "So, 100% is:" },
    { id: "reverse_full", text: "The full value is:" },
    { id: "reverse_total", text: "Total value is:" },
    { id: "reverse_hundred", text: "Original value is:" },
  ],
  reconstruct_component: [
    { id: "reconstruct_previous", text: "Therefore, the original value is:" },
    { id: "reconstruct_before_filter", text: "Before this stage, the total was:" },
    { id: "reconstruct_original_pool", text: "So the original total is:" },
    { id: "reconstruct_hidden_base", text: "The required total is:" },
  ],
  filter_subset: [
    { id: "filter_effective", text: "The effective part is:" },
    { id: "filter_subset", text: "The remaining group is:" },
    { id: "filter_layer", text: "At this stage, the value is:" },
    { id: "filter_next_base", text: "This gives:" },
  ],
  derive_remaining_component: [
    { id: "remaining_left", text: "First find the part left." },
    { id: "remaining_share", text: "Remaining share:" },
    { id: "remaining_component", text: "The unstated component is:" },
    { id: "remaining_after_known", text: "After known shares, the balance is:" },
  ],
  aggregate_components: [
    { id: "aggregate_sum", text: "Add the parts." },
    { id: "aggregate_total", text: "Together, they give:" },
    { id: "aggregate_together", text: "Total of these parts is:" },
    { id: "aggregate_final_pool", text: "The combined value is:" },
  ],
  apply_multiplier: [
    { id: "multiplier_apply", text: "After this change:" },
    { id: "multiplier_new_value", text: "New value becomes:" },
    { id: "multiplier_updated_base", text: "After this change:" },
    { id: "multiplier_change_factor", text: "Changed value is:" },
  ],
  population_projection: [
    { id: "population_project", text: "Population after the period:" },
    { id: "population_after_change", text: "Population after the change:" },
    { id: "population_updated", text: "Updated population is:" },
    { id: "population_period", text: "After the given period:" },
  ],
  mixture_balance: [
    { id: "mixture_unchanged", text: "Fixed quantity remains unchanged." },
    { id: "mixture_balance", text: "From the mixture balance:" },
    { id: "mixture_fixed_part", text: "Fixed quantity remains unchanged." },
    { id: "mixture_target", text: "For the target mixture:" },
  ],
  fixed_expenditure_relation: [
    { id: "expenditure_fixed", text: "Expenditure remains fixed." },
    { id: "expenditure_inverse", text: "Consumption changes in the opposite ratio." },
    { id: "expenditure_same", text: "Keep total spending the same." },
    { id: "expenditure_balance", text: "Balance the new price with consumption." },
  ],
  ratio_conversion: [
    { id: "ratio_convert", text: "From the ratio:" },
    { id: "ratio_percent", text: "As a percentage relation:" },
    { id: "ratio_share", text: "Use the share from the ratio." },
    { id: "ratio_parts", text: "Compare the parts in the ratio." },
  ],
  relation_normalization: [
    { id: "normalize_reference", text: "Take the reference value as 100." },
    { id: "normalize_base", text: "Let the base value be 100." },
    { id: "normalize_index", text: "Use 100 as the reference index." },
    { id: "normalize_comparison", text: "Start with the comparison base." },
  ],
  relation_transformation: [
    { id: "apply_relation", text: "Apply the relation." },
    { id: "relation_step", text: "From this relation:" },
    { id: "next_relation", text: "Move to the next value." },
    { id: "relation_index", text: "Convert this to an index." },
  ],
  relation_inversion: [
    { id: "invert_relation", text: "Reverse the given relation." },
    { id: "inverse_base", text: "Use the inverse base." },
    { id: "reverse_comparison", text: "Read the comparison in reverse." },
    { id: "inverted_index", text: "Convert through the inverse relation." },
  ],
  comparison_inference: [
    { id: "infer_difference", text: "Now compare with the base." },
    { id: "final_relation", text: "Final relation with the base:" },
    { id: "relative_difference", text: "Relative difference is:" },
    { id: "comparison_result", text: "This gives the comparison." },
  ],
  subtract_invalid_component: [
    { id: "invalid_remove", text: "Remove the invalid part." },
    { id: "invalid_valid_pool", text: "Only valid votes remain." },
    { id: "invalid_after_removal", text: "After removing invalid votes:" },
    { id: "invalid_effective_votes", text: "Valid votes are:" },
  ],
  final_answer: [
    { id: "answer", text: "Answer" },
  ],
} as const satisfies Record<ReasoningStepType, readonly PhraseOption[]>;

const CONNECTORS = [
  "So,",
  "Now,",
  "Hence,",
  "Therefore,",
  "Thus,",
] as const;

const RHYTHM_ROTATION = [
  "coaching_rhythm",
  "compact_exam_rhythm",
  "shortcut_first_rhythm",
  "equation_first_rhythm",
] as const satisfies readonly EditorialRhythmProfile[];

export function hashText(text: string) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function pickIndex(seed: number | string | undefined, key: string, length: number) {
  return hashText(`${seed ?? ""}|${key}`) % length;
}

export function selectRhythmProfile(input: {
  style?: string;
  seed?: number | string;
  signature: string;
}): EditorialRhythmProfile {
  if (input.style === "coaching") {
    return "coaching_rhythm";
  }
  if (input.style === "compact") {
    return "compact_exam_rhythm";
  }
  if (input.style === "shortcut_first") {
    return "shortcut_first_rhythm";
  }

  return RHYTHM_ROTATION[
    pickIndex(input.seed, `${input.signature}|rhythm`, RHYTHM_ROTATION.length)
  ]!;
}

export function selectStepPhrase(input: {
  step: ReasoningStep;
  seed?: number | string;
  signature: string;
}) {
  const options = STEP_PHRASES[input.step.type];
  const index = pickIndex(
    input.seed,
    `${input.signature}|${input.step.id}|${input.step.descriptionKey}`,
    options.length,
  );
  const option = options[index]!;

  return {
    phrase: option.text,
    variantId: `${input.step.type}:${option.id}`,
  };
}

export function selectConnector(input: {
  index: number;
  seed?: number | string;
  signature: string;
}) {
  return CONNECTORS[
    pickIndex(
      input.seed,
      `${input.signature}|connector|${input.index}`,
      CONNECTORS.length,
    )
  ]!;
}

export function shouldSurfaceShortcut(input: {
  hasShortcut: boolean;
  rhythmProfile: EditorialRhythmProfile;
  seed?: number | string;
  signature: string;
}) {
  if (!input.hasShortcut) {
    return false;
  }
  if (input.rhythmProfile === "shortcut_first_rhythm") {
    return true;
  }

  return pickIndex(input.seed, `${input.signature}|shortcut`, 4) === 0;
}
