export const MEN_001_PACKAGE_ID = "MEN-001" as const;

export const MEN_001_CP_IDS = [
  "MEN-CP-001",
  "MEN-CP-002",
  "MEN-CP-003",
  "MEN-CP-004",
  "MEN-CP-005",
  "MEN-CP-006",
] as const;

export const MEN_001_ACTIVE_CP_IDS = ["MEN-CP-001"] as const;

export type Men001CanonicalProblemId = (typeof MEN_001_CP_IDS)[number];
export type Men001ActiveCanonicalProblemId = (typeof MEN_001_ACTIVE_CP_IDS)[number];
export type Men001Language = "en" | "hi" | "pa";
export type Men001Difficulty = "Easy" | "Medium" | "Hard";
export type Men001TaskKind = "triangleMeasurementApplication";
export type Men001AnswerDimension = "LENGTH" | "AREA";
export type Men001UnitPolicy = "CENTIMETRES" | "SQUARE_CENTIMETRES";
export type Men001DiagramRequirement = "REQUIRED" | "OPTIONAL" | "NONE";

export type Men001SolveMode =
  | "findTriangleAreaBaseHeight"
  | "findMissingHeightFromAreaAndBase"
  | "findTriangleAreaHeron"
  | "findRightTriangleAreaFromLegs"
  | "findEquilateralTriangleArea";

export type ExactSpatialNumber =
  | { kind: "INTEGER"; value: number }
  | { kind: "RATIONAL"; numerator: number; denominator: number }
  | {
      kind: "SURD";
      coefficientNumerator: number;
      coefficientDenominator: number;
      radicand: number;
    };

export type Men001CanonicalAnswer =
  | {
      kind: "unit";
      value: number;
      unit: string;
      precision: number;
      display: string;
      rounding: "exact";
      metadata: Record<string, unknown>;
    }
  | {
      kind: "symbolic";
      value: string;
      rendered: string;
      display: string;
      rounding: "exact";
      metadata: Record<string, unknown>;
    };

export interface Men001QuestionLanguageEntry {
  cpId: Men001CanonicalProblemId;
  qlId: string;
  solveMode: Men001SolveMode;
  difficulty: Men001Difficulty;
  template: string;
  requiredVariables: string[];
  answerDimension: Men001AnswerDimension;
  unitPolicy: Men001UnitPolicy;
  explanationStrategyId: string;
  distractorStrategyIds: string[];
  diagramRequirement: Men001DiagramRequirement;
  active: boolean;
}

export interface Men001TaskRegistryEntry {
  cpId: Men001CanonicalProblemId;
  qlId: string;
  taskKind: Men001TaskKind;
  solveMode: Men001SolveMode;
  answerDimension: Men001AnswerDimension;
  requiredVariables: string[];
}

export interface Men001Parameters {
  packageId: typeof MEN_001_PACKAGE_ID;
  canonicalProblemId: Men001ActiveCanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  language: Men001Language;
  difficulty: Men001Difficulty;
  taskKind: Men001TaskKind;
  solveMode: Men001SolveMode;
  answerDimension: Men001AnswerDimension;
  unitPolicy: Men001UnitPolicy;
  seed: string;
  values: {
    base?: number;
    height?: number;
    area?: number;
    sideA?: number;
    sideB?: number;
    sideC?: number;
    legA?: number;
    legB?: number;
    side?: number;
  };
  renderVariables: Record<string, string | number>;
}

export interface Men001SolverResult {
  exactAnswer: ExactSpatialNumber;
  canonicalAnswer: Men001CanonicalAnswer;
  answer: string;
  answerDimension: Men001AnswerDimension;
  unit: "cm" | "cm²";
  equation: string;
  workingValues: Record<string, string | number>;
}

export interface Men001ReasoningNode {
  nodeId: string;
  operation: string;
  description: string;
  inputs: Record<string, string | number>;
  outputs: Record<string, string | number>;
}

export interface Men001ReasoningGraph {
  graphId: string;
  nodes: Men001ReasoningNode[];
}

export interface Men001Explanation {
  strategyId: string;
  lines: string[];
}

export interface Men001ValidationCheck {
  name: string;
  passed: boolean;
  message: string;
}

export interface Men001ValidationResult {
  valid: boolean;
  checks: Men001ValidationCheck[];
}

export interface Men001QuestionPackage {
  packageId: typeof MEN_001_PACKAGE_ID;
  archetypeId: typeof MEN_001_PACKAGE_ID;
  canonicalProblemId: Men001ActiveCanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  language: "en";
  difficultyBand: Men001Difficulty;
  taskKind: Men001TaskKind;
  solveMode: Men001SolveMode;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  parameters: Men001Parameters;
  solver: Men001SolverResult;
  reasoningGraph: Men001ReasoningGraph;
  explanation: Men001Explanation;
  validation: Men001ValidationResult;
  maturity: "RUNTIME_PROOF";
  publiclyPublishable: false;
  mathematicalFingerprint: string;
  traceability: Record<string, unknown>;
}
