export type KnowledgeLanguage = "en" | "hi" | "pa";

export type KnowledgeDifficulty =
  | "easy"
  | "moderate"
  | "hard";

export type KnowledgeEngineFamily =
  | "GeneralKnowledgeEngine"
  | "ComputerAwarenessEngine";

export type KnowledgeSubject =
  | "India GK"
  | "Punjab GK"
  | "Static GK"
  | "Banking Awareness"
  | "Current Affairs"
  | "Computer Awareness";

export type KnowledgeFactType =
  | "constitution-article"
  | "person-event"
  | "person-title"
  | "date-event"
  | "location-fact"
  | "river-state"
  | "capital-state"
  | "award-recipient"
  | "organization-founder"
  | "historical-event"
  | "sports-achievement"
  | "scheme-purpose"
  | "scientific-discovery"
  | "computer-hardware"
  | "computer-software"
  | "computer-networking"
  | "computer-security";

export type KnowledgeQuestionMode =
  | "recall"
  | "reverse-recall"
  | "match-following"
  | "chronology"
  | "assertion-reason"
  | "fill-blank";

export type LocalizedText = Record<
  KnowledgeLanguage,
  string
>;

export type KnowledgeRelation = {
  type:
    | "related_to"
    | "precedes"
    | "same_group"
    | "located_in"
    | "founded_by"
    | "part_of";
  target: string;
};

export type PyqOccurrence = {
  exam: string;
  year: number;
  shift?: number | string;
};

export type KnowledgeFact = {
  factId: string;
  entityId: string;
  subject: KnowledgeSubject;
  topic: string;
  subtopic: string;
  factType: KnowledgeFactType;
  contextGroupId: string;
  sequenceIndex?: number;
  data: {
    entity: LocalizedText;
    fact: LocalizedText;
    detail?: Partial<LocalizedText>;
  };
  aliases?: Partial<
    Record<KnowledgeLanguage, string[]>
  >;
  difficulty: KnowledgeDifficulty;
  examTags: string[];
  tags: string[];
  relations?: KnowledgeRelation[];
  distractorPool?: string[];
  pyqMetadata?: {
    wasAsked: boolean;
    occurrences: PyqOccurrence[];
  };
  verification: {
    reviewed: boolean;
    confidence: number;
  };
  source: {
    book?: string;
    url?: string;
    page?: number;
    chapter?: string;
    note?: string;
  };
  currentAffair?: {
    enabled: boolean;
    eventDate?: string;
    validUntil?: string;
  };
};

export type KnowledgePatternLike = {
  id: string;
  topic: string;
  subtopic: string;
  difficulty?: string;
  supportedMotifs?: string[];
};

export type KnowledgeLocalizedBundle = {
  question: string;
  options: string[];
  explanation: string;
};

export type KnowledgeScenario = {
  id: string;
  engine: KnowledgeEngineFamily;
  mode: KnowledgeQuestionMode;
  stem: string;
  options: string[];
  correct: number;
  explanation: string;
  reasoningSteps: string[];
  ruleApplied: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  structuralSignature: string;
  factSnapshot: KnowledgeFact;
  logic: {
    source: "knowledge-repository";
    factId: string;
    entityId: string;
    factType: KnowledgeFactType;
    contextGroupId: string;
    mode: KnowledgeQuestionMode;
    subject: KnowledgeSubject;
    topic: string;
    subtopic: string;
    answerKey: string;
  };
  content: Partial<
    Record<
      KnowledgeLanguage,
      KnowledgeLocalizedBundle
    >
  >;
  matchMatrix?: {
    left: string[];
    right: string[];
    answerKey: Record<string, string>;
  };
  optionMetadata: Array<{
    option: string;
    isCorrect: boolean;
    distractorType: string;
    rationale: string;
  }>;
};

export type FactExtractionCandidate = {
  candidateId: string;
  rawText: string;
  proposedFact: KnowledgeFact;
  extractionNotes: string[];
  status:
    | "draft"
    | "needs_review"
    | "approved"
    | "rejected";
  review?: {
    reviewedAt: string;
    reviewerId?: string;
    notes?: string;
  };
};
