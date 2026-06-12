export const NS_CLASS_001_ARCHETYPE_ID = "NS-CLASS-001" as const;

export type NsClass001CanonicalProblemId = "CP01" | "CP02" | "CP03" | "CP04" | "CP05" | "CP06";
export type NsClass001DifficultyBand = "Easy" | "Medium" | "Hard";

export interface NsClass001MathJaxFields {
  propertyWorkingLatex: string;
}

export interface NsClass001Parameters {
  archetypeId: typeof NS_CLASS_001_ARCHETYPE_ID;
  canonicalProblemId: NsClass001CanonicalProblemId;
  questionId: string;
  difficultyBand: NsClass001DifficultyBand;
  questionLanguageId: string;
  explanationId: string;
  answer: string;
  coverageBucket: string;
  variableRange: string;
  reasoningPatternId: "RP01" | "RP02" | "RP03" | "RP04" | "RP05" | "RP06";
  operationType?: string;
  inputShape?: string;
  sequenceType?: string;
  propertyType?: string;
  candidateCount?: number;
  uniqueAnswer: boolean;
}

export interface NsClass001SolverResult extends NsClass001MathJaxFields {
  answer: string;
  verification: {
    inputValid: boolean;
    answerRecomputed: boolean;
    uniqueWhenRequired: boolean;
    mathJaxValid: boolean;
  };
}

export interface NsClass001ReasoningGraph extends NsClass001MathJaxFields {
  graphId: string;
  canonicalProblemId: NsClass001CanonicalProblemId;
  nodes: readonly { id: string; inputs: Record<string, unknown>; outputs: Record<string, unknown> }[];
  edges: readonly { from: string; to: string; relationship: string }[];
  answerNodeId: string;
}

export interface NsClass001Explanation extends NsClass001MathJaxFields {
  graphId: string;
  familyId: string;
  styleId: string;
  lines: readonly string[];
}

export interface NsClass001ValidationResult {
  valid: boolean;
  checks: readonly { name: string; passed: boolean; message: string }[];
}

export interface NsClass001QuestionPackage extends NsClass001MathJaxFields {
  archetypeId: typeof NS_CLASS_001_ARCHETYPE_ID;
  canonicalProblemId: NsClass001CanonicalProblemId;
  questionId: string;
  difficultyBand: NsClass001DifficultyBand;
  questionLanguageId: string;
  explanationId: string;
  stem: string;
  answer: string;
  parameters: NsClass001Parameters;
  solver: NsClass001SolverResult;
  reasoningGraph: NsClass001ReasoningGraph;
  explanation: NsClass001Explanation;
  traceability: {
    questionId: string;
    canonicalProblemId: NsClass001CanonicalProblemId;
    questionLanguageId: string;
    explanationId: string;
    difficultyBand: NsClass001DifficultyBand;
    graphId: string;
    answer: string;
  } & NsClass001MathJaxFields;
  validation: NsClass001ValidationResult;
}
