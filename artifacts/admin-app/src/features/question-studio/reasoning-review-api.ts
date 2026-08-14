// Shared Reasoning review display types only.
// Blood Relations no longer owns a separate Question Studio client or endpoint path.

export type ReasoningReviewLanguage = 'en' | 'hi' | 'pa';
export type ReasoningReviewDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface ReasoningReviewQuestion {
  questionId: string;
  canonicalItemId: string;
  questionLanguageId: string;
  qlId: string;
  language: ReasoningReviewLanguage;
  locale: string;
  difficultyBand: ReasoningReviewDifficulty;
  useMode: string;
  sharedPrompt: string;
  stem: string;
  options: string[];
  optionDetails: Array<{
    label: string;
    text: string;
    studentExplanation: string;
    isCorrect: boolean;
    semanticKey: string;
  }>;
  correctIndex: number;
  answer: string;
  decodedStatements: string[];
  explanation: {
    steps: string[];
    conclusion: string;
    shortcut: string;
    commonTrap: string;
    familyTree: unknown;
    diagramProof: unknown;
  };
  reasoningGraph: unknown;
  validation: { valid: boolean };
}

export interface ReasoningRunResult {
  id: string | null;
  publicCode: string | null;
  status: string;
  itemCount: number;
  existingCount?: number;
  preflightMissingCount?: number;
}
