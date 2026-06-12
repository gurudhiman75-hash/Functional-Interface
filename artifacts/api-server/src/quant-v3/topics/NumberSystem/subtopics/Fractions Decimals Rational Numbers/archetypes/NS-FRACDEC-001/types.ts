export const NS_FRACDEC_001_ARCHETYPE_ID = "NS-FRACDEC-001" as const;

export type NsFracdec001CanonicalProblemId =
  | "CP-001"
  | "CP-002"
  | "CP-003"
  | "CP-004"
  | "CP-005"
  | "CP-006"
  | "CP-007"
  | "CP-008"
  | "CP-009";

export type NsFracdec001DifficultyBand = "Easy" | "Medium" | "Hard";
export type FractionInput = { numerator: number; denominator: number };
export type MixedFractionInput = { whole: number; numerator: number; denominator: number };
export type RationalToken = FractionInput | number;

export interface NsFracdec001MathJaxFields {
  fractionReductionLatex: string;
  mixedFractionConversionLatex: string;
  fractionArithmeticLatex: string;
  comparisonWorkingLatex: string;
  fractionToDecimalLatex: string;
  decimalToFractionLatex: string;
  recurringDecimalConversionLatex: string;
  terminatingCheckLatex: string;
  fractionHcfLcmLatex: string;
}

export interface NsFracdec001Parameters {
  archetypeId: typeof NS_FRACDEC_001_ARCHETYPE_ID;
  canonicalProblemId: NsFracdec001CanonicalProblemId;
  questionId: string;
  difficultyBand: NsFracdec001DifficultyBand;
  questionLanguageId: string;
  explanationId: string;
  numerator?: number;
  denominator?: number;
  fraction?: string;
  improperFraction?: string;
  mixedFraction?: string;
  decimal?: string;
  recurringDecimal?: string;
  expression?: string;
  values?: string;
  valueA?: string;
  valueB?: string;
  fractions?: string;
  operation?: string;
  operands?: RationalToken[];
  rationalValues?: FractionInput[];
  direction?: "improperToMixed" | "mixedToImproper";
  targetType?: "HCF" | "LCM";
  fractionType?: string;
  reductionStatus?: string;
  conversionType?: string;
  denominatorBand?: string;
  operationType?: string;
  operandCount?: string;
  expressionType?: string;
  comparisonMode?: string;
  valueCount?: string;
  decimalType?: string;
  denominatorClass?: string;
  decimalPlaces?: string;
  repeatBlockLength?: string;
  decimalPattern?: string;
  denominatorPrimeProfile?: string;
  classification?: string;
  fractionCount?: string;
}

export interface NsFracdec001SolverResult extends NsFracdec001MathJaxFields {
  answer: string;
  verification: {
    inputValid: boolean;
    answerRecomputed: boolean;
    mathJaxValid: boolean;
  };
}

export interface NsFracdec001ReasoningGraph extends NsFracdec001MathJaxFields {
  graphId: string;
  canonicalProblemId: NsFracdec001CanonicalProblemId;
  nodes: readonly { id: string; inputs: Record<string, unknown>; outputs: Record<string, unknown> }[];
  edges: readonly { from: string; to: string; relationship: string }[];
  answerNodeId: string;
}

export interface NsFracdec001Explanation extends NsFracdec001MathJaxFields {
  graphId: string;
  familyId: string;
  styleId: string;
  lines: readonly string[];
}

export interface NsFracdec001ValidationResult {
  valid: boolean;
  checks: readonly { name: string; passed: boolean; message: string }[];
}

export interface NsFracdec001QuestionPackage extends NsFracdec001MathJaxFields {
  archetypeId: typeof NS_FRACDEC_001_ARCHETYPE_ID;
  canonicalProblemId: NsFracdec001CanonicalProblemId;
  questionId: string;
  difficultyBand: NsFracdec001DifficultyBand;
  questionLanguageId: string;
  explanationId: string;
  stem: string;
  answer: string;
  parameters: NsFracdec001Parameters;
  solver: NsFracdec001SolverResult;
  reasoningGraph: NsFracdec001ReasoningGraph;
  explanation: NsFracdec001Explanation;
  traceability: {
    questionId: string;
    canonicalProblemId: NsFracdec001CanonicalProblemId;
    questionLanguageId: string;
    explanationId: string;
    difficultyBand: NsFracdec001DifficultyBand;
    graphId: string;
    answer: string;
  } & NsFracdec001MathJaxFields;
  validation: NsFracdec001ValidationResult;
}
