import type { EnglishDifficulty } from "../core/types";

export type IdiomaticUsageRuleId =
  | "GR-USG-001" | "GR-USG-002" | "GR-USG-003" | "GR-USG-004" | "GR-USG-005"
  | "GR-USG-006" | "GR-USG-007" | "GR-USG-008" | "GR-USG-009";

export type IdiomaticUsageMutationId =
  | "MUT-USG-PREFER-TO-001"
  | "MUT-USG-SENIOR-JUNIOR-TO-001"
  | "MUT-USG-DIFFERENT-FROM-001"
  | "MUT-USG-CAPABLE-OF-001"
  | "MUT-USG-INSIST-ON-001"
  | "MUT-USG-PREVENT-FROM-001"
  | "MUT-USG-DESPITE-IN-SPITE-001"
  | "MUT-USG-NO-SOONER-THAN-001"
  | "MUT-USG-HARDLY-WHEN-001";

export interface IdiomaticUsageGrammarRuleV1 {
  ruleId: IdiomaticUsageRuleId;
  category: "idiomatic_usage";
  name: string;
  principle: string;
  mutationId: IdiomaticUsageMutationId;
  allowedDifficulties: readonly EnglishDifficulty[];
  ambiguityGuard: string;
}

const ALL: readonly EnglishDifficulty[] = ["easy", "medium", "hard"];

export const IDIOMATIC_USAGE_RULES_V1: readonly IdiomaticUsageGrammarRuleV1[] = [
  {
    ruleId: "GR-USG-001", category: "idiomatic_usage", name: "prefer_x_to_y",
    principle: "When the verb 'prefer' directly compares two nouns or parallel -ing activities, standard exam English uses 'to' between the alternatives.",
    mutationId: "MUT-USG-PREFER-TO-001", allowedDifficulties: ALL,
    ambiguityGuard: "Exclude 'would prefer' and 'prefer to do ... rather than ...' structures, where 'rather than' is valid. Mutate only direct prefer X to Y comparisons.",
  },
  {
    ruleId: "GR-USG-002", category: "idiomatic_usage", name: "senior_junior_to",
    principle: "When 'senior' or 'junior' compares rank or position directly with a person, standard usage takes 'to', not comparative 'than'.",
    mutationId: "MUT-USG-SENIOR-JUNIOR-TO-001", allowedDifficulties: ALL,
    ambiguityGuard: "Use rank/position senses only. Do not confuse the construction with age expressions such as 'ten years his senior'.",
  },
  {
    ruleId: "GR-USG-003", category: "idiomatic_usage", name: "different_from_conservative_exam_form",
    principle: "The conservative competitive-exam form used by this checkpoint is 'different from'.",
    mutationId: "MUT-USG-DIFFERENT-FROM-001", allowedDifficulties: ALL,
    ambiguityGuard: "Modern standard English also permits 'different to' in British usage and 'different than' in American usage. Never key those variants as errors here; mutate only to an unambiguously invalid form such as 'different with'.",
  },
  {
    ruleId: "GR-USG-004", category: "idiomatic_usage", name: "capable_of",
    principle: "The adjective 'capable' takes 'of' before a noun or -ing form: capable of something / capable of doing something.",
    mutationId: "MUT-USG-CAPABLE-OF-001", allowedDifficulties: ALL,
    ambiguityGuard: "Use explicit capable + noun/-ing complements and mutate the preposition or complement into a clearly excluded pattern such as 'capable to do'.",
  },
  {
    ruleId: "GR-USG-005", category: "idiomatic_usage", name: "insist_on_noun_or_gerund",
    principle: "When 'insist' is followed by a noun or -ing activity, the standard complement is 'insist on ...'.",
    mutationId: "MUT-USG-INSIST-ON-001", allowedDifficulties: ALL,
    ambiguityGuard: "Do not treat 'insist that + clause' as wrong. Key only noun/-ing complement contexts where 'on' is required by the chosen construction.",
  },
  {
    ruleId: "GR-USG-006", category: "idiomatic_usage", name: "prevent_object_from_ing",
    principle: "A standard explicit pattern is 'prevent + object + from + -ing'.",
    mutationId: "MUT-USG-PREVENT-FROM-001", allowedDifficulties: ALL,
    ambiguityGuard: "Because standard British English can omit 'from' before an -ing complement in some contexts, never key simple omission of 'from'. Mutate to an excluded to-infinitive pattern such as 'prevent someone to do'.",
  },
  {
    ruleId: "GR-USG-007", category: "idiomatic_usage", name: "despite_vs_in_spite_of",
    principle: "Use 'despite + noun/-ing' or 'in spite of + noun/-ing'. 'Despite of' is not standard, and 'in spite' needs 'of' in this construction.",
    mutationId: "MUT-USG-DESPITE-IN-SPITE-001", allowedDifficulties: ALL,
    ambiguityGuard: "Keep the complement a noun phrase or -ing form. Do not mix this rule with although/even though clause selection, which belongs elsewhere.",
  },
  {
    ruleId: "GR-USG-008", category: "idiomatic_usage", name: "no_sooner_than",
    principle: "When 'no sooner' links two successive events, the paired connector is 'than'. Fronted 'No sooner' also normally uses auxiliary-subject inversion.",
    mutationId: "MUT-USG-NO-SOONER-THAN-001", allowedDifficulties: ALL,
    ambiguityGuard: "Every keyed mutation changes the paired connector to 'when' or another excluded form while leaving a structurally valid no-sooner clause, so the error is singular and deterministic.",
  },
  {
    ruleId: "GR-USG-009", category: "idiomatic_usage", name: "hardly_scarcely_when",
    principle: "For two events occurring in immediate succession, the formal pair is 'hardly/scarcely ... when'. Fronted forms use auxiliary-subject inversion.",
    mutationId: "MUT-USG-HARDLY-WHEN-001", allowedDifficulties: ALL,
    ambiguityGuard: "Use temporal immediate-succession meanings only. Mutate the paired connector to 'than'; do not test unrelated meanings of hardly/scarcely such as degree or frequency.",
  },
];

export const IDIOMATIC_USAGE_RULE_BY_ID: Readonly<Record<IdiomaticUsageRuleId, IdiomaticUsageGrammarRuleV1>> = Object.freeze(
  Object.fromEntries(IDIOMATIC_USAGE_RULES_V1.map((rule) => [rule.ruleId, rule])) as Record<IdiomaticUsageRuleId, IdiomaticUsageGrammarRuleV1>,
);
