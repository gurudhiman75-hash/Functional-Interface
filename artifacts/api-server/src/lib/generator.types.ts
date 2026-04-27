import type { MockDifficulty, MockSection } from "@workspace/db";

export type VariableSpec =
  | { type: "int"; min: number; max: number }
  | { type: "float"; min: number; max: number; decimals?: number }
  | { type: "choice"; values: (string | number)[] };

export type DistractorStrategy =
  | { type: "numeric_offsets"; offsets: number[] }
  | { type: "choice"; values: string[] };

export type PatternFilter = {
  section?: MockSection;
  topic?: string;
  subtopic?: string;
  difficulty?: MockDifficulty;
  patternIds?: string[];
};

export type GenerateOptions = PatternFilter & {
  count?: number;
  useAI?: boolean;
  persist?: boolean;
};

export type PatternDefinition = {
  name: string;
  section: MockSection;
  topic: string;
  subtopic: string;
  difficulty: MockDifficulty;
  template: string;
  variables: Record<string, VariableSpec>;
  answerExpression: string;
  distractorStrategy?: DistractorStrategy;
  tags?: string[];
};
