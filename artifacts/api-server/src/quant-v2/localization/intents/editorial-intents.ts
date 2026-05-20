export type EditorialIntentKind =
  | "blank"
  | "equation"
  | "label"
  | "transition"
  | "narration"
  | "shortcut"
  | "ending"
  | "fallback";

export type EditorialIntentKey =
  | "layout.blank"
  | "equation.universal"
  | "label.vote_margin"
  | "label.vote_difference"
  | "label.valid_votes"
  | "label.total_votes"
  | "label.registered_voters"
  | "label.pass_mark_gap"
  | "label.maximum_marks"
  | "label.marks_secured"
  | "label.population_after_growth"
  | "label.population_after_reduction"
  | "label.final_population"
  | "label.male_population"
  | "label.female_population"
  | "label.new_price"
  | "label.new_consumption"
  | "label.reduction_consumption"
  | "label.salary_difference"
  | "label.percentage_change"
  | "label.profit_amount"
  | "label.loss_amount"
  | "label.profit_percentage"
  | "label.loss_percentage"
  | "label.final_value"
  | "label.value_after_first_change"
  | "label.remaining_value"
  | "label.required_increase"
  | "label.total_value"
  | "label.unchanged_quantity"
  | "label.final_mixture"
  | "label.quantity_to_add"
  | "label.required_difference"
  | "label.required_value"
  | "transition.therefore"
  | "transition.hence"
  | "transition.so"
  | "transition.thus"
  | "transition.accordingly"
  | "shortcut.heading"
  | "shortcut.total_votes"
  | "shortcut.total_marks"
  | "shortcut.total_value"
  | "shortcut.final_population"
  | "ending.final_answer"
  | "ending.total_votes"
  | "ending.maximum_marks"
  | "ending.final_population"
  | "ending.required_percentage"
  | "ending.required_value"
  | "narration.after_increase"
  | "narration.after_decrease"
  | "narration.after_price_increase"
  | "narration.same_expenditure"
  | "narration.water_unchanged"
  | "narration.fixed_quantity_unchanged"
  | "narration.target_mixture"
  | "narration.remaining_value"
  | "narration.full_value"
  | "narration.original_value"
  | "narration.shortcut_so"
  | "narration.combined_difference"
  | "narration.direct_relation"
  | "narration.percentage_relation"
  | "narration.after_bonus"
  | "narration.growth_period"
  | "fallback.english";

export interface EditorialIntent {
  key: EditorialIntentKey;
  kind: EditorialIntentKind;
  sourceText: string;
  fallbackText: string;
  params?: Record<string, string | number | boolean>;
}

export const STABLE_LOCALIZATION_INTENTS: readonly EditorialIntentKey[] = [
  "label.vote_margin",
  "label.valid_votes",
  "label.remaining_value",
  "label.pass_mark_gap",
  "label.population_after_growth",
  "transition.therefore",
  "transition.hence",
  "transition.so",
  "shortcut.total_votes",
  "shortcut.total_marks",
  "shortcut.final_population",
  "ending.final_answer",
  "ending.required_value",
];
