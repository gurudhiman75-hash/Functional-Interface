import type { FormulaQuestion } from "../../lib/core/generator-engine";

export type PyqBenchmarkTopic =
  | "percentage"
  | "profit-loss"
  | "interest"
  | "ratio-proportion"
  | "time-work"
  | "data_interpretation";

export type PyqDifficultyBand =
  | "easy"
  | "medium"
  | "hard"
  | "advanced";

export type PyqBenchmarkPattern = {
  topic: PyqBenchmarkTopic;
  family: string;
  topology: string;
  difficulty: PyqDifficultyBand;
  requiredReasoningSteps: number;
  trapTypes: string[];
  realism: number;
  statementNaturalness: number;
  sscLikenessScore: number;
  pyqLevelScore: number;
  pyqPlusScore: number;
  optionQualityScore: number;
  languageQualityScore: number;
  conceptDepthScore: number;
  notes: string[];
};

export type PyqBenchmarkInput = {
  topic: Exclude<PyqBenchmarkTopic, "data_interpretation">;
  question: FormulaQuestion;
  family: string;
  topology: string;
  problem?: any;
  graph?: any;
  schedulerMetadata?: {
    topologyGroup?: string;
    distractorTraps?: string[];
    difficulty?: string;
    multiStep?: boolean;
  };
};

export type PyqBenchmarkAuditSummary = {
  topic: Exclude<PyqBenchmarkTopic, "data_interpretation">;
  totalGenerated: number;
  status: "PASS" | "FAIL";
  averageRealism: number;
  averagePyqLevelScore: number;
  averagePyqPlusScore: number;
  difficultyDistribution: Record<string, number>;
  reasoningStepDistribution: Record<string, number>;
  trapDistribution: Record<string, number>;
  familyDistribution: Record<string, number>;
  topologyDistribution: Record<string, number>;
  counters: Record<string, number>;
  acceptance: Record<string, boolean>;
  worstExamples: Array<{
    index: number;
    family: string;
    topology: string;
    issue: string;
    pyqLevelScore: number;
    pyqPlusScore: number;
    question: string;
    answer: string;
  }>;
};
