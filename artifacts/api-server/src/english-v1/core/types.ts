export type EnglishDifficulty = "easy" | "medium" | "hard";

export type Eng001QlId =
  | "ENG-001-QL001"
  | "ENG-001-QL002"
  | "ENG-001-QL007";

export type Eng001CpId =
  | "ENG-001-CP001" | "ENG-001-CP002" | "ENG-001-CP003" | "ENG-001-CP004"
  | "ENG-001-CP005" | "ENG-001-CP006" | "ENG-001-CP007" | "ENG-001-CP008"
  | "ENG-001-CP009" | "ENG-001-CP010" | "ENG-001-CP011" | "ENG-001-CP012"
  | "ENG-001-CP013";

export type SvaRuleId =
  | "GR-SVA-001" | "GR-SVA-002" | "GR-SVA-003" | "GR-SVA-004" | "GR-SVA-005"
  | "GR-SVA-006" | "GR-SVA-007" | "GR-SVA-008" | "GR-SVA-009" | "GR-SVA-010";
export type TenseRuleId =
  | "GR-TNS-001" | "GR-TNS-002" | "GR-TNS-003" | "GR-TNS-004" | "GR-TNS-005"
  | "GR-TNS-006" | "GR-TNS-007" | "GR-TNS-008" | "GR-TNS-009" | "GR-TNS-010";
export type ArticleRuleId =
  | "GR-ART-001" | "GR-ART-002" | "GR-ART-003" | "GR-ART-004" | "GR-ART-005"
  | "GR-ART-006" | "GR-ART-007" | "GR-ART-008" | "GR-ART-009" | "GR-ART-010";
export type PronounRuleId =
  | "GR-PRN-001" | "GR-PRN-002" | "GR-PRN-003" | "GR-PRN-004" | "GR-PRN-005"
  | "GR-PRN-006" | "GR-PRN-007" | "GR-PRN-008" | "GR-PRN-009" | "GR-PRN-010";
export type PrepositionRuleId =
  | "GR-PRP-001" | "GR-PRP-002" | "GR-PRP-003" | "GR-PRP-004" | "GR-PRP-005"
  | "GR-PRP-006" | "GR-PRP-007" | "GR-PRP-008" | "GR-PRP-009" | "GR-PRP-010";
export type ComparisonRuleId =
  | "GR-CMP-001" | "GR-CMP-002" | "GR-CMP-003" | "GR-CMP-004" | "GR-CMP-005"
  | "GR-CMP-006" | "GR-CMP-007" | "GR-CMP-008" | "GR-CMP-009" | "GR-CMP-010";
export type ConjunctionRuleId =
  | "GR-CON-001" | "GR-CON-002" | "GR-CON-003" | "GR-CON-004" | "GR-CON-005"
  | "GR-CON-006" | "GR-CON-007" | "GR-CON-008" | "GR-CON-009" | "GR-CON-010";
export type NounQuantifierRuleId =
  | "GR-NQN-001" | "GR-NQN-002" | "GR-NQN-003" | "GR-NQN-004" | "GR-NQN-005"
  | "GR-NQN-006" | "GR-NQN-007" | "GR-NQN-008" | "GR-NQN-009" | "GR-NQN-010";
export type GerundInfinitiveParticipleRuleId =
  | "GR-GIP-001" | "GR-GIP-002" | "GR-GIP-003" | "GR-GIP-004" | "GR-GIP-005"
  | "GR-GIP-006" | "GR-GIP-007" | "GR-GIP-008" | "GR-GIP-009" | "GR-GIP-010";
export type ModifierRuleId =
  | "GR-MOD-001" | "GR-MOD-002" | "GR-MOD-003" | "GR-MOD-004" | "GR-MOD-005"
  | "GR-MOD-006" | "GR-MOD-007" | "GR-MOD-008" | "GR-MOD-009" | "GR-MOD-010";
export type ConditionalRuleId =
  | "GR-CND-001" | "GR-CND-002" | "GR-CND-003" | "GR-CND-004" | "GR-CND-005"
  | "GR-CND-006" | "GR-CND-007" | "GR-CND-008" | "GR-CND-009" | "GR-CND-010";
export type VoiceNarrationRuleId =
  | "GR-VNR-001" | "GR-VNR-002" | "GR-VNR-003" | "GR-VNR-004" | "GR-VNR-005" | "GR-VNR-006"
  | "GR-VNR-007" | "GR-VNR-008" | "GR-VNR-009" | "GR-VNR-010" | "GR-VNR-011" | "GR-VNR-012";
export type IdiomaticUsageRuleId =
  | "GR-USG-001" | "GR-USG-002" | "GR-USG-003" | "GR-USG-004" | "GR-USG-005"
  | "GR-USG-006" | "GR-USG-007" | "GR-USG-008" | "GR-USG-009";

export type GrammarRuleId =
  | SvaRuleId | TenseRuleId | ArticleRuleId | PronounRuleId | PrepositionRuleId
  | ComparisonRuleId | ConjunctionRuleId | NounQuantifierRuleId | GerundInfinitiveParticipleRuleId
  | ModifierRuleId | ConditionalRuleId | VoiceNarrationRuleId | IdiomaticUsageRuleId;

export type SvaMutationId =
  | "MUT-SVA-NUMBER-001" | "MUT-SVA-EACH-EVERY-001" | "MUT-SVA-ONE-OF-001" | "MUT-SVA-NUMBER-PHRASE-001"
  | "MUT-SVA-ADDITIVE-PHRASE-001" | "MUT-SVA-PROXIMITY-001" | "MUT-SVA-COLLECTIVE-001"
  | "MUT-SVA-MORE-THAN-ONE-001" | "MUT-SVA-MANY-A-001" | "MUT-SVA-INTERVENING-PP-001";
export type TenseMutationId =
  | "MUT-TNS-PAST-TIME-001" | "MUT-TNS-CONTINUING-ACTION-001" | "MUT-TNS-HABIT-001" | "MUT-TNS-CURRENT-ACTION-001"
  | "MUT-TNS-STATIVE-CONTINUOUS-001" | "MUT-TNS-DID-BASE-001" | "MUT-TNS-PAST-SEQUENCE-001"
  | "MUT-TNS-PAST-INTERRUPTION-001" | "MUT-TNS-SINGLE-PAST-001" | "MUT-TNS-STATIVE-DURATION-001";
export type ArticleMutationId =
  | "MUT-ART-INDEFINITE-001" | "MUT-ART-SOUND-001" | "MUT-ART-SUPERLATIVE-001" | "MUT-ART-UNIQUE-001"
  | "MUT-ART-ZERO-GENERAL-001" | "MUT-ART-PROFESSION-001" | "MUT-ART-INSTITUTION-001" | "MUT-ART-GEOGRAPHY-001"
  | "MUT-ART-COUNTABILITY-001" | "MUT-ART-DETERMINER-NUMBER-001";
export type PronounMutationId =
  | "MUT-PRN-SUBJECT-CASE-001" | "MUT-PRN-OBJECT-CASE-001" | "MUT-PRN-POSSESSIVE-FORM-001" | "MUT-PRN-REFLEXIVE-COREFERENCE-001"
  | "MUT-PRN-REFLEXIVE-MISUSE-001" | "MUT-PRN-ANTECEDENT-NUMBER-001" | "MUT-PRN-WHO-WHOM-001" | "MUT-PRN-RELATIVE-PERSON-THING-001"
  | "MUT-PRN-DEMONSTRATIVE-NUMBER-001" | "MUT-PRN-WHOSE-WHOS-001";
export type PrepositionMutationId =
  | "MUT-PRP-TIME-001" | "MUT-PRP-PLACE-001" | "MUT-PRP-SINCE-FOR-001" | "MUT-PRP-BY-UNTIL-001" | "MUT-PRP-BETWEEN-AMONG-001"
  | "MUT-PRP-IN-INTO-001" | "MUT-PRP-BESIDE-BESIDES-001" | "MUT-PRP-ADJECTIVE-COMPLEMENT-001" | "MUT-PRP-VERB-COMPLEMENT-001" | "MUT-PRP-NOUN-COMPLEMENT-001";
export type ComparisonMutationId =
  | "MUT-CMP-ADVERB-MANNER-001" | "MUT-CMP-LINKING-ADJECTIVE-001" | "MUT-CMP-AS-AS-001" | "MUT-CMP-COMPARATIVE-THAN-001"
  | "MUT-CMP-SUPERLATIVE-ARTICLE-001" | "MUT-CMP-ONE-OF-SUPERLATIVE-001" | "MUT-CMP-DOUBLE-COMPARATIVE-001"
  | "MUT-CMP-DOUBLE-SUPERLATIVE-001" | "MUT-CMP-COMPARATIVE-INTENSIFIER-001" | "MUT-CMP-IRREGULAR-DEGREE-001";
export type ConjunctionMutationId =
  | "MUT-CON-COORDINATOR-001" | "MUT-CON-BOTH-AND-001" | "MUT-CON-EITHER-OR-001" | "MUT-CON-NEITHER-NOR-001"
  | "MUT-CON-NOT-ONLY-BUT-ALSO-001" | "MUT-CON-ALTHOUGH-BUT-001" | "MUT-CON-BECAUSE-BECAUSE-OF-001"
  | "MUT-CON-DESPITE-ALTHOUGH-001" | "MUT-CON-PARALLEL-LIST-001" | "MUT-CON-PARALLEL-CORRELATIVE-001";
export type NounQuantifierMutationId =
  | "MUT-NQN-MANY-MUCH-001" | "MUT-NQN-FEW-A-FEW-001" | "MUT-NQN-LITTLE-A-LITTLE-001" | "MUT-NQN-FEWER-LESS-001"
  | "MUT-NQN-NUMBER-AMOUNT-001" | "MUT-NQN-UNCOUNTABLE-PLURAL-001" | "MUT-NQN-IRREGULAR-PLURAL-001"
  | "MUT-NQN-PAIR-NOUN-001" | "MUT-NQN-UNIT-MASS-NOUN-001" | "MUT-NQN-EACH-ONE-OF-001";
export type GerundInfinitiveParticipleMutationId =
  | "MUT-GIP-VERB-GERUND-001" | "MUT-GIP-VERB-TO-INFINITIVE-001" | "MUT-GIP-OBJECT-TO-INFINITIVE-001"
  | "MUT-GIP-CAUSATIVE-BARE-INFINITIVE-001" | "MUT-GIP-MODAL-BARE-INFINITIVE-001" | "MUT-GIP-PREPOSITION-GERUND-001"
  | "MUT-GIP-USED-TO-001" | "MUT-GIP-PURPOSE-INFINITIVE-001" | "MUT-GIP-MEANING-SHIFT-001" | "MUT-GIP-PARTICIPLE-FORM-001";
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
  | "MUT-CND-INVERSION-FORMAL-001";
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

export type GrammarMutationId =
  | SvaMutationId | TenseMutationId | ArticleMutationId | PronounMutationId | PrepositionMutationId
  | ComparisonMutationId | ConjunctionMutationId | NounQuantifierMutationId | GerundInfinitiveParticipleMutationId
  | ModifierMutationId | ConditionalMutationId | VoiceNarrationMutationId | IdiomaticUsageMutationId;

export interface DifficultyDimensions {
  ruleComplexity: 1 | 2 | 3 | 4 | 5;
  dependencyDistance: 1 | 2 | 3 | 4 | 5;
  distractorSimilarity: 1 | 2 | 3 | 4 | 5;
  sentenceLength: 1 | 2 | 3 | 4 | 5;
  ruleInteraction: 1 | 2 | 3 | 4 | 5;
  lexicalLoad: 1 | 2 | 3 | 4 | 5;
}

export interface EnglishGrammarRule {
  ruleId: GrammarRuleId;
  category:
    | "subject_verb_agreement" | "tenses_sequence" | "articles_determiners" | "pronouns" | "prepositions"
    | "adjectives_adverbs_comparison" | "conjunctions_parallelism" | "nouns_quantifiers"
    | "gerunds_infinitives_participles" | "modifiers" | "conditionals" | "voice" | "narration"
    | "idiomatic_usage";
  name: string;
  principle: string;
  mutationId: GrammarMutationId;
  allowedDifficulties: readonly EnglishDifficulty[];
  ambiguityGuard?: string;
}

export interface Eng001SentenceCandidate {
  candidateId: string;
  ruleId: GrammarRuleId;
  mutationId: GrammarMutationId;
  difficulty: EnglishDifficulty;
  dimensions: DifficultyDimensions;
  correctSegments: readonly string[];
  errorSegments: readonly string[];
  errorIndex: number | null;
  errorSpan: string | null;
  correction: string | null;
  subjectHead: string;
  distractorCue?: string;
  explanationApplication: string;
  tags: readonly string[];
}

export interface Eng001QuestionMetadata {
  track: "english";
  chapterId: "ENG-001";
  cpId: Eng001CpId;
  qlId: Eng001QlId;
  ruleId: GrammarRuleId;
  mutationId: GrammarMutationId;
  difficulty: EnglishDifficulty;
  dimensions: DifficultyDimensions;
  answerSegment: string;
  hasNoError: boolean;
  seed: string;
  candidateId: string;
  reviewOnly: true;
}

export interface Eng001Question {
  questionId: string;
  stem: string;
  segments: readonly string[];
  options: readonly string[];
  correctOptionIndex: number;
  correctedSentence: string;
  explanation: string;
  metadata: Eng001QuestionMetadata;
}

export interface ValidationIssue {
  code:
    | "SEGMENT_COUNT" | "ANSWER_RANGE" | "ERROR_COUNT" | "ERROR_INDEX" | "CORRECTION_MISSING"
    | "NO_ERROR_CONTRACT" | "RULE_MUTATION_MISMATCH" | "EMPTY_SEGMENT" | "EXPLANATION_MISMATCH";
  message: string;
}

export interface ValidationResult {
  ok: boolean;
  issues: readonly ValidationIssue[];
}
