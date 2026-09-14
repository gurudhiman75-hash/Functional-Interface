import type { EnglishDifficulty } from "../core/types";

export type ModifierRuleId =
  | "GR-MOD-001" | "GR-MOD-002" | "GR-MOD-003" | "GR-MOD-004" | "GR-MOD-005"
  | "GR-MOD-006" | "GR-MOD-007" | "GR-MOD-008" | "GR-MOD-009" | "GR-MOD-010";

export type ModifierMutationId =
  | "MUT-MOD-DANGLING-PRESENT-001"
  | "MUT-MOD-DANGLING-PERFECT-001"
  | "MUT-MOD-DANGLING-PHRASE-001"
  | "MUT-MOD-RELATIVE-PROXIMITY-001"
  | "MUT-MOD-ONLY-FOCUS-001"
  | "MUT-MOD-ALMOST-FOCUS-001"
  | "MUT-MOD-EVEN-FOCUS-001"
  | "MUT-MOD-FREQUENCY-ADVERB-001"
  | "MUT-MOD-MANNER-ADVERB-001"
  | "MUT-MOD-PARTICIPLE-PROXIMITY-001";

export interface ModifierGrammarRuleV1 {
  ruleId: ModifierRuleId;
  category: "modifiers";
  name: string;
  principle: string;
  mutationId: ModifierMutationId;
  allowedDifficulties: readonly EnglishDifficulty[];
  ambiguityGuard: string;
}

const ALL: readonly EnglishDifficulty[] = ["easy", "medium", "hard"];

export const MODIFIER_RULES_V1: readonly ModifierGrammarRuleV1[] = [
  { ruleId: "GR-MOD-001", category: "modifiers", name: "introductory_present_participle_attachment", principle: "An introductory -ing phrase normally shares its understood subject with the subject of the main clause.", mutationId: "MUT-MOD-DANGLING-PRESENT-001", allowedDifficulties: ALL, ambiguityGuard: "The opening action must be semantically possible for only the intended human or agent subject." },
  { ruleId: "GR-MOD-002", category: "modifiers", name: "introductory_perfect_or_passive_participle_attachment", principle: "A perfect or passive participial opener must logically describe the grammatical subject that follows it.", mutationId: "MUT-MOD-DANGLING-PERFECT-001", allowedDifficulties: ALL, ambiguityGuard: "The passive/perfect opener must have one clear controller; avoid sentence-level supplementary readings." },
  { ruleId: "GR-MOD-003", category: "modifiers", name: "introductory_adjective_phrase_attachment", principle: "An introductory adjective or descriptive phrase must modify the subject of the main clause.", mutationId: "MUT-MOD-DANGLING-PHRASE-001", allowedDifficulties: ALL, ambiguityGuard: "The description must be logically compatible with only the intended subject." },
  { ruleId: "GR-MOD-004", category: "modifiers", name: "relative_clause_proximity", principle: "A relative clause should be placed next to the noun phrase it is intended to modify when distance would create a different antecedent.", mutationId: "MUT-MOD-RELATIVE-PROXIMITY-001", allowedDifficulties: ALL, ambiguityGuard: "Use lexical facts such as torn covers, tax amounts or certificates so the intended antecedent is unique." },
  { ruleId: "GR-MOD-005", category: "modifiers", name: "only_focus_placement", principle: "Place 'only' immediately before the constituent whose meaning is being limited when another placement changes the focus.", mutationId: "MUT-MOD-ONLY-FOCUS-001", allowedDifficulties: ALL, ambiguityGuard: "Every scene contains an explicit contrast such as 'not the figures' or 'not earlier files' to fix the intended scope." },
  { ruleId: "GR-MOD-006", category: "modifiers", name: "almost_nearly_scope", principle: "Place 'almost' or 'nearly' next to the degree, quantity or expression it modifies so the intended scope is clear.", mutationId: "MUT-MOD-ALMOST-FOCUS-001", allowedDifficulties: ALL, ambiguityGuard: "Prefer quantity and degree expressions where relocation is unnatural or changes a stated numerical/degree relation." },
  { ruleId: "GR-MOD-007", category: "modifiers", name: "even_negative_focus_position", principle: "In ordinary negative perfect and auxiliary constructions, 'even' follows the negative marker before the focused main verb phrase.", mutationId: "MUT-MOD-EVEN-FOCUS-001", allowedDifficulties: ALL, ambiguityGuard: "Use 'had not even + past participle' surfaces; avoid contexts where a marked contrastive 'even not' reading is intended." },
  { ruleId: "GR-MOD-008", category: "modifiers", name: "frequency_adverb_position", principle: "Frequency adverbs normally stand before a main lexical verb and after forms of 'be' or the first auxiliary, unless a deliberate emphatic position is intended.", mutationId: "MUT-MOD-FREQUENCY-ADVERB-001", allowedDifficulties: ALL, ambiguityGuard: "Do not key acceptable emphatic end positions; use neutral exam-style prose with a single intended reading." },
  { ruleId: "GR-MOD-009", category: "modifiers", name: "manner_adverb_position", principle: "With a transitive verb and a compact object, keep the verb-object unit together and place a manner adverb after the object or before the verb when that is the natural neutral order.", mutationId: "MUT-MOD-MANNER-ADVERB-001", allowedDifficulties: ALL, ambiguityGuard: "Use short direct objects and neutral prose; exclude literary inversions and deliberately marked information structure." },
  { ruleId: "GR-MOD-010", category: "modifiers", name: "participial_or_postmodifier_proximity", principle: "A participial or other restrictive postmodifier should remain close to the noun it describes when intervening material would attach it to a different noun.", mutationId: "MUT-MOD-PARTICIPLE-PROXIMITY-001", allowedDifficulties: ALL, ambiguityGuard: "Choose nouns whose properties make the wrong attachment semantically implausible, such as a tablet with a cracked screen or an envelope containing a memory card." },
];

export const MODIFIER_RULE_BY_ID: Readonly<Record<ModifierRuleId, ModifierGrammarRuleV1>> = Object.freeze(
  Object.fromEntries(MODIFIER_RULES_V1.map((rule) => [rule.ruleId, rule])) as Record<ModifierRuleId, ModifierGrammarRuleV1>,
);
