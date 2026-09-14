import type { EnglishDifficulty } from "../core/types";

export type ConditionalRuleId =
  | "GR-CND-001" | "GR-CND-002" | "GR-CND-003" | "GR-CND-004" | "GR-CND-005"
  | "GR-CND-006" | "GR-CND-007" | "GR-CND-008" | "GR-CND-009" | "GR-CND-010";

export type ConditionalMutationId =
  | "MUT-CND-ZERO-TENSE-001"
  | "MUT-CND-FIRST-RESULT-001"
  | "MUT-CND-FIRST-IF-TENSE-001"
  | "MUT-CND-SECOND-001"
  | "MUT-CND-THIRD-001"
  | "MUT-CND-MIXED-PAST-PRESENT-001"
  | "MUT-CND-MIXED-PRESENT-PAST-001"
  | "MUT-CND-UNLESS-NEGATION-001"
  | "MUT-CND-INVERSION-HAD-001"
  | "MUT-CND-INVERSION-FORMAL-001"
;

export interface ConditionalGrammarRuleV1 {
  ruleId: ConditionalRuleId;
  category: "conditionals";
  name: string;
  principle: string;
  mutationId: ConditionalMutationId;
  allowedDifficulties: readonly EnglishDifficulty[];
  ambiguityGuard: string;
}

const ALL: readonly EnglishDifficulty[] = ["easy", "medium", "hard"];

export const CONDITIONAL_RULES_V1: readonly ConditionalGrammarRuleV1[] = [
  { ruleId: "GR-CND-001", category: "conditionals", name: "zero_conditional_general_truth", principle: "A zero conditional states a general truth, rule or regular result and normally uses present-tense forms in both clauses.", mutationId: "MUT-CND-ZERO-TENSE-001", allowedDifficulties: ALL, ambiguityGuard: "Use explicit general-rule or whenever contexts; do not key a future prediction that could legitimately take 'will'." },
  { ruleId: "GR-CND-002", category: "conditionals", name: "first_conditional_real_future_result", principle: "A real or open future condition normally uses a present-tense condition and a real future or modal result such as 'will', 'can' or 'may' plus the base form.", mutationId: "MUT-CND-FIRST-RESULT-001", allowedDifficulties: ALL, ambiguityGuard: "The context must present the condition as genuinely possible, not remote or counterfactual." },
  { ruleId: "GR-CND-003", category: "conditionals", name: "future_reference_inside_if_clause", principle: "In an ordinary real-future conditional, the if-clause normally uses the present simple rather than 'will' for neutral future reference.", mutationId: "MUT-CND-FIRST-IF-TENSE-001", allowedDifficulties: ALL, ambiguityGuard: "Exclude volitional, insistent or willingness uses of 'will' inside an if-clause." },
  { ruleId: "GR-CND-004", category: "conditionals", name: "second_conditional_unreal_present_or_future", principle: "A remote or unreal present/future condition typically uses a past form in the if-clause and 'would/could + base form' in the result.", mutationId: "MUT-CND-SECOND-001", allowedDifficulties: ALL, ambiguityGuard: "The scene must clearly signal a hypothetical present or future situation." },
  { ruleId: "GR-CND-005", category: "conditionals", name: "third_conditional_unreal_past", principle: "An unreal past condition uses the past perfect in the condition and 'would/could/might have + past participle' in the result.", mutationId: "MUT-CND-THIRD-001", allowedDifficulties: ALL, ambiguityGuard: "Both the condition and the imagined consequence must be anchored in the past." },
  { ruleId: "GR-CND-006", category: "conditionals", name: "mixed_conditional_past_condition_present_result", principle: "A mixed conditional may use a past-perfect condition for a different past event and 'would + base/continuous' for its present consequence.", mutationId: "MUT-CND-MIXED-PAST-PRESENT-001", allowedDifficulties: ALL, ambiguityGuard: "Include a clear present-time cue such as 'now' or 'today' so a third-conditional result is not equally plausible." },
  { ruleId: "GR-CND-007", category: "conditionals", name: "mixed_conditional_present_state_past_result", principle: "A mixed conditional may use an unreal present state or characteristic with 'would have + past participle' for a past consequence.", mutationId: "MUT-CND-MIXED-PRESENT-PAST-001", allowedDifficulties: ALL, ambiguityGuard: "Use a continuing state or characteristic and a separate past-time result cue; avoid one-time past-state readings where possible." },
  { ruleId: "GR-CND-008", category: "conditionals", name: "unless_negative_condition", principle: "'Unless' means 'if not', so an ordinary unless-clause should not add another negative when the intended meaning is a single negative condition.", mutationId: "MUT-CND-UNLESS-NEGATION-001", allowedDifficulties: ALL, ambiguityGuard: "Key only sentences where the extra negative reverses the intended condition; exclude rhetorical or deliberately double-negative meanings." },
  { ruleId: "GR-CND-009", category: "conditionals", name: "inverted_third_conditional_had", principle: "Formal past conditional inversion uses 'Had + subject + past participle' in place of 'If + subject + had + past participle'.", mutationId: "MUT-CND-INVERSION-HAD-001", allowedDifficulties: ALL, ambiguityGuard: "The mutation must target the inversion itself, not merely a tense choice elsewhere in the sentence." },
  { ruleId: "GR-CND-010", category: "conditionals", name: "formal_should_or_were_inversion", principle: "Formal conditional inversion can use 'Should + subject + base form' for a possible condition or 'Were + subject ...' for a remote condition, without 'if'.", mutationId: "MUT-CND-INVERSION-FORMAL-001", allowedDifficulties: ALL, ambiguityGuard: "Do not key stylistic preference. Use structurally invalid combinations such as 'if should ...' or 'if were ...' as the mutation." },
];

export const CONDITIONAL_RULE_BY_ID: Readonly<Record<ConditionalRuleId, ConditionalGrammarRuleV1>> = Object.freeze(
  Object.fromEntries(CONDITIONAL_RULES_V1.map((rule) => [rule.ruleId, rule])) as Record<ConditionalRuleId, ConditionalGrammarRuleV1>,
);
