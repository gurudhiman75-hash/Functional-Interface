export type EnglishDifficulty = "easy" | "medium" | "hard";

export type Eng001QlId =
  | "ENG-001-QL001"
  | "ENG-001-QL002"
  | "ENG-001-QL007";

export type GrammarRuleId =
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
  category: "subject_verb_agreement";
  name: string;
  principle: string;
  mutationId: SvaMutationId;
  allowedDifficulties: readonly EnglishDifficulty[];
  ambiguityGuard?: string;
}

export interface Eng001SentenceCandidate {
  candidateId: string;
  ruleId: GrammarRuleId;
  mutationId: SvaMutationId;
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
  cpId: "ENG-001-CP001";
  qlId: Eng001QlId;
  ruleId: GrammarRuleId;
  mutationId: SvaMutationId;
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
