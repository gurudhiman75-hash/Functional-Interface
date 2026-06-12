export const NS_DIGIT_001_ARCHETYPE_ID = "NS-DIGIT-001" as const;
export type NsDigit001CanonicalProblemId = "CP-001" | "CP-002" | "CP-003" | "CP-004" | "CP-005";
export type NsDigit001DifficultyBand = "Easy" | "Medium" | "Hard";
export type NsDigit001Answer = number | string;
export type NsDigit001BoundType = "smallest" | "largest";

export interface NsDigit001MathJaxFields {
  digitCountFormulaLatex: string;
  logarithmExpansionLatex: string;
  productDigitFormulaLatex: string;
  nDigitNumberFormulaLatex: string;
  exponentDigitFormulaLatex: string;
}

export interface NsDigit001Parameters {
  archetypeId: typeof NS_DIGIT_001_ARCHETYPE_ID;
  canonicalProblemId: NsDigit001CanonicalProblemId;
  questionId: string;
  difficultyBand: NsDigit001DifficultyBand;
  questionLanguageId: string;
  explanationId: string;
  number?: number | string;
  base?: number;
  exponent?: number;
  expression?: string;
  factors?: number[];
  digitCount?: number;
  boundType?: NsDigit001BoundType;
  options?: number[];
  numberMagnitude?: string;
  boundaryStatus?: string;
  baseBand?: string;
  exponentBand?: string;
  factorCount?: string;
  productMagnitude?: string;
  digitCountBand?: string;
  uniquenessStatus?: string;
}

export interface NsDigit001SolverResult extends NsDigit001MathJaxFields {
  answer: NsDigit001Answer;
  digitCount?: number;
  validOptions?: number[];
  verification: {
    inputValid: boolean;
    answerRecomputed: boolean;
    uniqueOptionValid: boolean;
    mathJaxValid: boolean;
  };
}

export interface NsDigit001ReasoningGraph extends NsDigit001MathJaxFields {
  graphId: string;
  canonicalProblemId: NsDigit001CanonicalProblemId;
  nodes: readonly { id: string; inputs: Record<string, unknown>; outputs: Record<string, unknown> }[];
  edges: readonly { from: string; to: string; relationship: string }[];
  answerNodeId: string;
}

export interface NsDigit001Explanation extends NsDigit001MathJaxFields {
  graphId: string;
  familyId: string;
  styleId: string;
  lines: readonly string[];
}

export interface NsDigit001ValidationResult {
  valid: boolean;
  checks: readonly { name: string; passed: boolean; message: string }[];
}

export interface NsDigit001QuestionPackage extends NsDigit001MathJaxFields {
  archetypeId: typeof NS_DIGIT_001_ARCHETYPE_ID;
  canonicalProblemId: NsDigit001CanonicalProblemId;
  questionId: string;
  difficultyBand: NsDigit001DifficultyBand;
  questionLanguageId: string;
  explanationId: string;
  stem: string;
  answer: NsDigit001Answer;
  parameters: NsDigit001Parameters;
  solver: NsDigit001SolverResult;
  reasoningGraph: NsDigit001ReasoningGraph;
  explanation: NsDigit001Explanation;
  traceability: {
    questionId: string;
    canonicalProblemId: NsDigit001CanonicalProblemId;
    questionLanguageId: string;
    explanationId: string;
    difficultyBand: NsDigit001DifficultyBand;
    graphId: string;
    answer: NsDigit001Answer;
  } & NsDigit001MathJaxFields;
  validation: NsDigit001ValidationResult;
}
