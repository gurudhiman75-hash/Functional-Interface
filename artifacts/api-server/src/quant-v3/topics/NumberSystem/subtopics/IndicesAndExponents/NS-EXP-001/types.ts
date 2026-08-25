export const NS_EXP_001_ARCHETYPE_ID = "NS-EXP-001" as const;

export type NsExp001CanonicalProblemId = "CP01" | "CP02" | "CP03" | "CP04" | "CP05" | "CP06" | "CP07" | "CP09";
export type NsExp001DifficultyBand = "Easy" | "Medium" | "Hard";
export type NsExp001VariableMap = Record<string, number>;

export interface NsExp001MathJaxFields {
  sameBaseCompressionLatex: string;
  sameBaseEquationLatex: string;
  baseTransformationLatex: string;
  negativeExponentLatex: string;
  fractionalExponentLatex: string;
  mixedExponentLatex: string;
  comparisonLatex: string;
  substitutionLatex: string;
}

export interface NsExp001Parameters {
  archetypeId: typeof NS_EXP_001_ARCHETYPE_ID;
  canonicalProblemId: NsExp001CanonicalProblemId;
  questionId: string;
  difficultyBand: NsExp001DifficultyBand;
  questionLanguageId: string;
  explanationId: string;
  stemTemplate: string;
  variables: NsExp001VariableMap;
  expression: string;
  /** Independent reference answer generated from structured state. The runtime solver must not read this field. */
  expectedAnswer: string;
  coverageBucket: string;
  operationType?: string;
  comparisonMode?: string;
}

export interface NsExp001SolverResult extends NsExp001MathJaxFields {
  answer: string;
  verification: {
    inputValid: boolean;
    answerRecomputed: boolean;
    independentlyVerified: boolean;
    referenceAnswer: string;
    mathJaxValid: boolean;
  };
}

export interface NsExp001ReasoningGraph extends NsExp001MathJaxFields {
  graphId: string;
  canonicalProblemId: NsExp001CanonicalProblemId;
  nodes: readonly { id: string; inputs: Record<string, unknown>; outputs: Record<string, unknown> }[];
  edges: readonly { from: string; to: string; relationship: string }[];
  answerNodeId: string;
}

export interface NsExp001Explanation extends NsExp001MathJaxFields {
  graphId: string;
  familyId: string;
  styleId: string;
  lines: readonly string[];
}

export interface NsExp001ValidationResult {
  valid: boolean;
  checks: readonly { name: string; passed: boolean; message: string }[];
}

export interface NsExp001QuestionPackage extends NsExp001MathJaxFields {
  archetypeId: typeof NS_EXP_001_ARCHETYPE_ID;
  canonicalProblemId: NsExp001CanonicalProblemId;
  questionId: string;
  difficultyBand: NsExp001DifficultyBand;
  questionLanguageId: string;
  explanationId: string;
  stem: string;
  answer: string;
  parameters: NsExp001Parameters;
  solver: NsExp001SolverResult;
  reasoningGraph: NsExp001ReasoningGraph;
  explanation: NsExp001Explanation;
  traceability: {
    questionId: string;
    canonicalProblemId: NsExp001CanonicalProblemId;
    questionLanguageId: string;
    explanationId: string;
    difficultyBand: NsExp001DifficultyBand;
    graphId: string;
    answer: string;
  } & NsExp001MathJaxFields;
  validation: NsExp001ValidationResult;
}
