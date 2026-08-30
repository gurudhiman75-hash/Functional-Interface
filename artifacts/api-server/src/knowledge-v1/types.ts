export type KnowledgeV1Language = "en" | "hi" | "pa";
export type KnowledgeV1Difficulty = "Easy" | "Medium" | "Hard";

export type KnowledgeFreshnessClass =
  | "IMMUTABLE"
  | "SLOW_MUTABLE"
  | "CURRENT"
  | "EVENT";

export type KnowledgeReviewStatus =
  | "DRAFT"
  | "REVIEW_REQUIRED"
  | "APPROVED"
  | "REJECTED"
  | "RETIRED";

export type KnowledgeLocalizedText = {
  en: string;
  hi?: string;
  pa?: string;
};

export type KnowledgeFactValue =
  | {
      kind: "text";
      text: KnowledgeLocalizedText;
    }
  | {
      kind: "entity_ref";
      entityId: string;
      label: KnowledgeLocalizedText;
    }
  | {
      kind: "number";
      value: number;
      unit?: string;
    }
  | {
      kind: "date";
      isoDate: string;
    }
  | {
      kind: "boolean";
      value: boolean;
    };

export type KnowledgeFactSource = {
  sourceId: string;
  sourceType:
    | "official"
    | "statute"
    | "standard"
    | "textbook"
    | "reference"
    | "editorial";
  title: string;
  locator?: string;
  url?: string;
  edition?: string;
  publishedAt?: string;
};

export type KnowledgeFact = {
  factId: string;
  entityId: string;
  subject: string;
  chapterId: string;
  cpId: string;
  relation: string;
  entity: {
    canonicalName: string;
    label: KnowledgeLocalizedText;
    aliases?: Partial<Record<KnowledgeV1Language, string[]>>;
  };
  value: KnowledgeFactValue;
  contextGroupId: string;
  distractorGroupIds?: string[];
  difficulty: KnowledgeV1Difficulty;
  examTags: string[];
  tags: string[];
  source: KnowledgeFactSource;
  review: {
    status: KnowledgeReviewStatus;
    confidence: number;
    reviewedBy?: string;
    reviewedAt?: string;
  };
  freshness: {
    class: KnowledgeFreshnessClass;
    validFrom?: string;
    validUntil?: string;
    lastVerifiedAt?: string;
  };
};

export type KnowledgeEligibilityIssue = {
  code: string;
  field: string;
  message: string;
};

export type KnowledgeEligibilityResult = {
  eligible: boolean;
  issues: KnowledgeEligibilityIssue[];
};

export type KnowledgeQuestionMode =
  | "FORWARD_RECALL"
  | "REVERSE_RECALL"
  | "STATEMENT_IDENTIFICATION"
  | "CLASSIFICATION"
  | "MATCHING"
  | "CHRONOLOGY";

export type KnowledgeQlDefinition = {
  qlId: string;
  name: string;
  cpId: string;
  relation: string;
  mode: KnowledgeQuestionMode;
  difficulty?: KnowledgeV1Difficulty[];
  distractorCount?: number;
  minDistractorScore?: number;
  acceptsFact?: (fact: KnowledgeFact) => boolean;
  answerText: (
    fact: KnowledgeFact,
    language: KnowledgeV1Language,
  ) => string;
  renderStem: (
    fact: KnowledgeFact,
    language: KnowledgeV1Language,
  ) => string;
  renderExplanation: (
    fact: KnowledgeFact,
    language: KnowledgeV1Language,
  ) => string;
};

export type KnowledgePackageDefinition = {
  packageId: string;
  subject: string;
  topic: string;
  subtopic: string;
  label: string;
  enabled: boolean;
  cpIds: string[];
  supportedLanguages: KnowledgeV1Language[];
  qls: KnowledgeQlDefinition[];
};

export type KnowledgeGenerationRequest = {
  packageId: string;
  language: KnowledgeV1Language;
  difficulty?: KnowledgeV1Difficulty;
  count: number;
  seed: string;
  asOf: string;
  canonicalProblemId?: string;
};

export type KnowledgeGeneratedQuestion = {
  questionId: string;
  engineId: "knowledge-v1";
  packageId: string;
  cpId: string;
  qlId: string;
  qlName: string;
  factId: string;
  text: string;
  stem: string;
  options: string[];
  correctIndex: number;
  correct: number;
  canonicalAnswer: string;
  explanation: string;
  difficulty: KnowledgeV1Difficulty;
  difficultyLabel: KnowledgeV1Difficulty;
  language: KnowledgeV1Language;
  seed: string;
  validation: {
    valid: true;
    eligibilityChecked: true;
    uniqueOptions: true;
    canonicalAnswerVerified: true;
  };
  sourceMetadata: {
    sourceId: string;
    sourceType: KnowledgeFactSource["sourceType"];
    title: string;
    locator?: string;
    freshnessClass: KnowledgeFreshnessClass;
    validFrom?: string;
    validUntil?: string;
    lastVerifiedAt?: string;
  };
};

export type KnowledgeGenerationResult = {
  questions: KnowledgeGeneratedQuestion[];
  generationContext: {
    engineId: "knowledge-v1";
    packageId: string;
    seed: string;
    asOf: string;
    canonicalProblemId?: string;
    reviewStatus: "REVIEW_REQUIRED";
    manualApprovalRequired: true;
    automaticStudentPublication: false;
  };
};
