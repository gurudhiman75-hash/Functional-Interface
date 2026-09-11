export type EnglishDifficulty = "easy" | "medium" | "hard";

export type Eng001QlId =
  | "ENG-001-QL001"
  | "ENG-001-QL002"
  | "ENG-001-QL007";

export type Eng001CpId =
  | "ENG-001-CP001"
  | "ENG-001-CP002";

export type SvaRuleId =
  | "GR-SVA-001"
  | "GR-SVA-002"
  | "GR-SVA-003"
  | "GR-SVA-004"
  | "GR-SVA-005"
  | "GR-SVA-006"
  | "GR-SVA-007"
  | "GR-SVA-008"
  | "GR-SVA-009"
  | "GR-SVA-010";

export type TenseRuleId =
  | "GR-TNS-001"
  | "GR-TNS-002"
  | "GR-TNS-003"
  | "GR-TNS-004"
  | "GR-TNS-005"
  | "GR-TNS-006"
  | "GR-TNS-007"
  | "GR-TNS-008"
  | "GR-TNS-009"
  | "GR-TNS-010";

export type GrammarRuleId = SvaRuleId | TenseRuleId;

export type SvaMutationId =
  | "MUT-SVA-NUMBER-001"
  | "MUT-SVA-EACH-EVERY-001"
  | "MUT-SVA-ONE-OF-001"
  | "MUT-SVA-NUMBER-PHRASE-001"
  | "MUT-SVA-ADDITIVE-PHRASE-001"
  | "MUT-SVA-PROXIMITY-001"
  | "MUT-SVA-COLLECTIVE-001"
  | "MUT-SVA-MORE-THAN-ONE-001"
  | "MUT-SVA-MANY-A-001"
  | "MUT-SVA-INTERVENING-PP-001";

export type TenseMutationId =
  | "MUT-TNS-PAST-TIME-001"
  | "MUT-TNS-CONTINUING-ACTION-001"
  | "MUT-TNS-HABIT-001"
  | "MUT-TNS-CURRENT-ACTION-001"
  | "MUT-TNS-STATIVE-CONTINUOUS-001"
  | "MUT-TNS-DID-BASE-001"
  | "MUT-TNS-PAST-SEQUENCE-001"
  | "MUT-TNS-PAST-INTERRUPTION-001"
  | "MUT-TNS-SINGLE-PAST-001"
  | "MUT-TNS-STATIVE-DURATION-001";

export type GrammarMutationId = SvaMutationId | TenseMutationId;

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
  category: "subject_verb_agreement" | "tenses_sequence";
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
    | "SEGMENT_COUNT"
    | "ANSWER_RANGE"
    | "ERROR_COUNT"
    | "ERROR_INDEX"
    | "CORRECTION_MISSING"
    | "NO_ERROR_CONTRACT"
    | "RULE_MUTATION_MISMATCH"
    | "EMPTY_SEGMENT"
    | "EXPLANATION_MISMATCH";
  message: string;
}

export interface ValidationResult {
  ok: boolean;
  issues: readonly ValidationIssue[];
}
