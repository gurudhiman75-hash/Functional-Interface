export const NS_LASTDIG_001_ARCHETYPE_ID = "NS-LASTDIG-001" as const;
export const NS_LASTDIG_001_CP_001 = "CP-001" as const;
export const NS_LASTDIG_001_CP_002 = "CP-002" as const;
export const NS_LASTDIG_001_CP_003 = "CP-003" as const;
export const NS_LASTDIG_001_CP_004 = "CP-004" as const;
export const NS_LASTDIG_001_CP_005 = "CP-005" as const;

export type NsLastdig001CanonicalProblemId =
  | typeof NS_LASTDIG_001_CP_001
  | typeof NS_LASTDIG_001_CP_002
  | typeof NS_LASTDIG_001_CP_003
  | typeof NS_LASTDIG_001_CP_004
  | typeof NS_LASTDIG_001_CP_005;

export type NsLastdig001DifficultyBand = "Easy" | "Medium" | "Hard";
export type NsLastdig001Answer = number | string;

export interface NsLastdig001PowerTerm {
  base: number;
  exponent: number;
}

export interface NsLastdig001MathJaxFields {
  cycleLatex: string;
  cyclePositionLatex: string;
  effectiveExponentLatex: string;
  productLastDigitLatex: string;
  towerReductionLatex: string;
}

export interface NsLastdig001Parameters {
  archetypeId: typeof NS_LASTDIG_001_ARCHETYPE_ID;
  canonicalProblemId: NsLastdig001CanonicalProblemId;
  questionId: string;
  difficultyBand: NsLastdig001DifficultyBand;
  questionLanguageId: string;
  explanationId: string;
  base?: number;
  exponent?: number;
  powerTerms?: NsLastdig001PowerTerm[];
  powerProduct?: string;
  towerBases?: number[];
  towerExpression?: string;
  targetLastDigit?: number;
  options?: number[];
  cycleLengthBucket?: string;
  exponentMagnitude?: string;
  termCountBucket?: string;
  cycleMixBucket?: string;
  towerHeightBucket?: string;
  towerReductionBucket?: string;
  cycleTypeBucket?: string;
  questionStyleBucket?: string;
  optionCountBucket?: string;
  distractorBucket?: string;
}

export interface NsLastdig001SolverResult extends NsLastdig001MathJaxFields {
  answer: NsLastdig001Answer;
  baseLastDigit?: number;
  cycle: number[];
  cycleLength: number;
  cyclePosition?: number;
  effectiveExponent?: number;
  termLastDigits?: number[];
  validOptions?: number[];
  verification: {
    inputValid: boolean;
    answerRecomputed: boolean;
    uniqueOptionValid: boolean;
    mathJaxValid: boolean;
  };
}

export interface NsLastdig001ReasoningGraph extends NsLastdig001MathJaxFields {
  graphId: string;
  canonicalProblemId: NsLastdig001CanonicalProblemId;
  nodes: readonly { id: string; inputs: Record<string, unknown>; outputs: Record<string, unknown> }[];
  edges: readonly { from: string; to: string; relationship: string }[];
  answerNodeId: string;
}

export interface NsLastdig001Explanation extends NsLastdig001MathJaxFields {
  graphId: string;
  familyId: string;
  styleId: string;
  lines: readonly string[];
}

export interface NsLastdig001ValidationResult {
  valid: boolean;
  checks: readonly { name: string; passed: boolean; message: string }[];
}

export interface NsLastdig001QuestionPackage extends NsLastdig001MathJaxFields {
  archetypeId: typeof NS_LASTDIG_001_ARCHETYPE_ID;
  canonicalProblemId: NsLastdig001CanonicalProblemId;
  questionId: string;
  difficultyBand: NsLastdig001DifficultyBand;
  questionLanguageId: string;
  explanationId: string;
  stem: string;
  answer: NsLastdig001Answer;
  parameters: NsLastdig001Parameters;
  solver: NsLastdig001SolverResult;
  reasoningGraph: NsLastdig001ReasoningGraph;
  explanation: NsLastdig001Explanation;
  traceability: {
    questionId: string;
    canonicalProblemId: NsLastdig001CanonicalProblemId;
    questionLanguageId: string;
    explanationId: string;
    difficultyBand: NsLastdig001DifficultyBand;
    graphId: string;
    answer: NsLastdig001Answer;
  } & NsLastdig001MathJaxFields;
  validation: NsLastdig001ValidationResult;
}
