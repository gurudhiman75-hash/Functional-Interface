import type { EnglishDifficulty } from "../core/types";

export type VoiceNarrationRuleId =
  | "GR-VNR-001" | "GR-VNR-002" | "GR-VNR-003" | "GR-VNR-004" | "GR-VNR-005" | "GR-VNR-006"
  | "GR-VNR-007" | "GR-VNR-008" | "GR-VNR-009" | "GR-VNR-010" | "GR-VNR-011" | "GR-VNR-012";

export type VoiceNarrationMutationId =
  | "MUT-VNR-PASSIVE-PARTICIPLE-001"
  | "MUT-VNR-PASSIVE-AUXILIARY-CHAIN-001"
  | "MUT-VNR-INTRANSITIVE-PASSIVE-001"
  | "MUT-VNR-MODAL-PASSIVE-001"
  | "MUT-VNR-PASSIVE-RETAINED-OBJECT-001"
  | "MUT-VNR-REPORTED-BACKSHIFT-001"
  | "MUT-VNR-REPORTED-PRONOUN-001"
  | "MUT-VNR-REPORTED-DEICTIC-001"
  | "MUT-VNR-REPORTED-QUESTION-001"
  | "MUT-VNR-REPORTED-COMMAND-001"
  | "MUT-VNR-UNIVERSAL-TRUTH-001"
  | "MUT-VNR-REPORTING-VERB-001";

export interface VoiceNarrationGrammarRuleV1 {
  ruleId: VoiceNarrationRuleId;
  category: "voice" | "narration";
  name: string;
  principle: string;
  mutationId: VoiceNarrationMutationId;
  allowedDifficulties: readonly EnglishDifficulty[];
  ambiguityGuard: string;
}

const ALL: readonly EnglishDifficulty[] = ["easy", "medium", "hard"];
const MEDIUM_HARD: readonly EnglishDifficulty[] = ["medium", "hard"];

export const VOICE_NARRATION_RULES_V1: readonly VoiceNarrationGrammarRuleV1[] = [
  {
    ruleId: "GR-VNR-001", category: "voice", name: "passive_requires_past_participle",
    principle: "An ordinary passive verb uses a suitable form of be followed by the lexical verb's past participle.",
    mutationId: "MUT-VNR-PASSIVE-PARTICIPLE-001", allowedDifficulties: ALL,
    ambiguityGuard: "Prefer forms where the base/past form and past participle are visibly different, or otherwise make the malformed passive unmistakable.",
  },
  {
    ruleId: "GR-VNR-002", category: "voice", name: "passive_tense_and_aspect_auxiliary_chain",
    principle: "A passive must preserve the intended tense and aspect through the auxiliary chain, such as is being repaired, has been approved, or had been completed.",
    mutationId: "MUT-VNR-PASSIVE-AUXILIARY-CHAIN-001", allowedDifficulties: ALL,
    ambiguityGuard: "Anchor the time/aspect in the sentence and mutate the auxiliary chain into a structurally invalid or clearly incompatible form, not merely a stylistic alternative.",
  },
  {
    ruleId: "GR-VNR-003", category: "voice", name: "ordinary_passive_requires_transitive_verb",
    principle: "An ordinary passive requires a verb that supplies an object in the active construction; intransitive uses such as arrive, occur, disappear, belong and consist do not form that passive.",
    mutationId: "MUT-VNR-INTRANSITIVE-PASSIVE-001", allowedDifficulties: ALL,
    ambiguityGuard: "Use verbs in unequivocally intransitive senses. Exclude verbs whose transitivity changes easily with meaning or dialect.",
  },
  {
    ruleId: "GR-VNR-004", category: "voice", name: "modal_passive",
    principle: "A modal passive uses modal + be + past participle; a perfect modal passive uses modal + have been + past participle.",
    mutationId: "MUT-VNR-MODAL-PASSIVE-001", allowedDifficulties: ALL,
    ambiguityGuard: "The sentence must make the patient role clear so an active reading is not equally plausible.",
  },
  {
    ruleId: "GR-VNR-005", category: "voice", name: "passive_argument_mapping_without_retained_object",
    principle: "When an active object or recipient becomes the passive subject, a co-referential object pronoun must not be retained redundantly in the passive clause.",
    mutationId: "MUT-VNR-PASSIVE-RETAINED-OBJECT-001", allowedDifficulties: ALL,
    ambiguityGuard: "Only mutate a pronoun that unmistakably duplicates the passive subject; do not interfere with a legitimate second object.",
  },
  {
    ruleId: "GR-VNR-006", category: "narration", name: "reported_statement_backshift",
    principle: "When a past reporting verb presents an earlier statement from a past viewpoint, the reported tense normally backshifts where the exam context requires it.",
    mutationId: "MUT-VNR-REPORTED-BACKSHIFT-001", allowedDifficulties: ALL,
    ambiguityGuard: "Use explicit past-time anchors or completed reporting contexts. Avoid cases where present-tense retention is naturally possible because the situation still holds now.",
  },
  {
    ruleId: "GR-VNR-007", category: "narration", name: "reported_pronoun_reference",
    principle: "Pronouns and possessives in reported speech must reflect the original speaker, the person addressed and the later narrator's reference point.",
    mutationId: "MUT-VNR-REPORTED-PRONOUN-001", allowedDifficulties: ALL,
    ambiguityGuard: "Make the speaker and addressee explicit. Hard items may quote the original wording so the intended pronoun mapping is deterministic.",
  },
  {
    ruleId: "GR-VNR-008", category: "narration", name: "reported_time_and_place_reference",
    principle: "Time and place expressions shift when the later reporting point changes their reference, for example tomorrow to the following day or here to there.",
    mutationId: "MUT-VNR-REPORTED-DEICTIC-001", allowedDifficulties: ALL,
    ambiguityGuard: "Specify both the original and later reporting time/place strongly enough that the unshifted expression would point to the wrong date or location.",
  },
  {
    ruleId: "GR-VNR-009", category: "narration", name: "reported_question_linker_and_statement_order",
    principle: "Reported yes/no questions use if or whether, while reported wh-questions retain the wh-word; both use statement word order rather than direct-question inversion.",
    mutationId: "MUT-VNR-REPORTED-QUESTION-001", allowedDifficulties: ALL,
    ambiguityGuard: "Do not key punctuation alone. The mutation must create an invalid linker or auxiliary-subject inversion in the reported clause.",
  },
  {
    ruleId: "GR-VNR-010", category: "narration", name: "reported_commands_and_requests",
    principle: "Commands and requests are commonly reported with an appropriate reporting verb + object + to-infinitive, with not to + verb for a negative command/request.",
    mutationId: "MUT-VNR-REPORTED-COMMAND-001", allowedDifficulties: ALL,
    ambiguityGuard: "Use tell/ask/order/request contexts with an explicit addressee; exclude speech acts that allow several materially different but valid reporting patterns.",
  },
  {
    ruleId: "GR-VNR-011", category: "narration", name: "universal_truth_retains_present",
    principle: "In the competitive-exam convention used by this engine, an indisputable universal or general truth remains in the present tense when reported.",
    mutationId: "MUT-VNR-UNIVERSAL-TRUTH-001", allowedDifficulties: MEDIUM_HARD,
    ambiguityGuard: "Restrict keyed items to explicit timeless truths and use mutations that wrongly turn them into completed past events. Do not generalize this rule to ordinary still-true personal states.",
  },
  {
    ruleId: "GR-VNR-012", category: "narration", name: "reporting_verb_complement_pattern",
    principle: "Reporting verbs take different complement patterns: tell/inform take a personal object directly, say does not take that object directly, and explain takes to before a personal object.",
    mutationId: "MUT-VNR-REPORTING-VERB-001", allowedDifficulties: MEDIUM_HARD,
    ambiguityGuard: "Key only complement patterns that are grammatically excluded in standard exam English, not mere differences of tone or reporting-verb choice.",
  },
];

export const VOICE_NARRATION_RULE_BY_ID: Readonly<Record<VoiceNarrationRuleId, VoiceNarrationGrammarRuleV1>> = Object.freeze(
  Object.fromEntries(VOICE_NARRATION_RULES_V1.map((rule) => [rule.ruleId, rule])) as Record<VoiceNarrationRuleId, VoiceNarrationGrammarRuleV1>,
);
