export const PNC_002_PACKAGE_ID = "PNC-002" as const;
export const PNC_002_CP_IDS = [
  "PNC-CP-007",
  "PNC-CP-008",
  "PNC-CP-009",
  "PNC-CP-010",
  "PNC-CP-011",
  "PNC-CP-012",
] as const;
export const PNC_002_ACTIVE_CP_IDS = ["PNC-CP-007"] as const;

export type Pnc002CanonicalProblemId = (typeof PNC_002_CP_IDS)[number];
export type Pnc002ActiveCanonicalProblemId = (typeof PNC_002_ACTIVE_CP_IDS)[number];
export type Pnc002Language = "en" | "hi" | "pa";
export type Pnc002Difficulty = "Easy" | "Medium" | "Hard";
export type Pnc002Maturity =
  | "DESIGN_LOCKED"
  | "RUNTIME_PROOF"
  | "MVP_QA"
  | "PRODUCTION_QA"
  | "MANUAL_REVIEW"
  | "FROZEN";
export type Pnc002AnswerType = "COUNT";
export type Pnc002TaskKind = "linearBlockRestriction";
export type Pnc002SolveMode =
  | "countSingleBlockTogether"
  | "countSingleBlockNotTogether"
  | "countMultipleBlocksTogether"
  | "countBlockWithExternalPairApart"
  | "countTwoBlocksTogetherNotAdjacent"
  | "countBlockWithOutsiderNotAdjacent"
  | "countOneBlockTogetherOtherNotTogether"
  | "countNotAllSpecifiedBlocksTogether"
  | "recoverBlockRestrictionParameter";

export interface Pnc002QuestionLanguageEntry {
  qlId: string;
  cpId: Pnc002ActiveCanonicalProblemId;
  difficulty: Pnc002Difficulty;
  template: string;
}

export interface Pnc002RegistryGroup {
  qlIds: string[];
  cpId: Pnc002ActiveCanonicalProblemId;
  taskKind: Pnc002TaskKind;
  solveMode: Pnc002SolveMode;
  answerType: Pnc002AnswerType;
  explanationId: string;
  requiredVariables: string[];
  scenarioFamily: string;
  constraintProfile: string;
  distractorProfile: string;
  difficulty: Pnc002Difficulty;
  active: boolean;
}

export interface Pnc002QuestionEntry extends Pnc002QuestionLanguageEntry {
  taskKind: Pnc002TaskKind;
  solveMode: Pnc002SolveMode;
  answerType: Pnc002AnswerType;
  explanationId: string;
  requiredVariables: string[];
  scenarioFamily: string;
  constraintProfile: string;
  distractorProfile: string;
  active: boolean;
}

export interface Pnc002ParameterInput {
  canonicalProblemId?: Pnc002ActiveCanonicalProblemId;
  cpId?: Pnc002ActiveCanonicalProblemId;
  difficulty?: Pnc002Difficulty;
  difficultyBand?: Pnc002Difficulty;
  language?: Pnc002Language;
  questionLanguageId?: string;
  seed?: string;
}

export type Pnc002GeneratedValue = number | number[];

export interface Pnc002Parameters {
  packageId: typeof PNC_002_PACKAGE_ID;
  canonicalProblemId: Pnc002ActiveCanonicalProblemId;
  questionLanguageId: string;
  questionId: string;
  seed: string;
  language: "en";
  difficulty: Pnc002Difficulty;
  taskKind: Pnc002TaskKind;
  solveMode: Pnc002SolveMode;
  answerType: Pnc002AnswerType;
  explanationId: string;
  requiredVariables: string[];
  scenarioFamily: string;
  constraintProfile: string;
  distractorProfile: string;
  values: Record<string, Pnc002GeneratedValue>;
  renderVariables: Record<string, string | number>;
}

export interface Pnc002SolverEvidence {
  operation:
    | "SINGLE_BLOCK_TOGETHER"
    | "SINGLE_BLOCK_COMPLEMENT"
    | "MULTIPLE_BLOCKS"
    | "BLOCK_WITH_EXTERNAL_PAIR_APART"
    | "TWO_BLOCKS_TOGETHER_NOT_ADJACENT"
    | "BLOCK_WITH_OUTSIDER_NOT_ADJACENT"
    | "ONE_BLOCK_TOGETHER_OTHER_BROKEN"
    | "NOT_ALL_BLOCKS_TOGETHER"
    | "BLOCK_INVERSE";
  totalObjects: number;
  blockSizes: number[];
  groupedObjectCount: number;
  blockCount: number;
  unitCount: number;
  externalArrangementCount: number;
  internalArrangementCounts: number[];
  internalArrangementMultiplier: number;
  unrestrictedCount?: number;
  forbiddenTogetherCount?: number;
  validUnitArrangementCount?: number;
  adjacentExternalPairCount?: number;
  forbiddenAdjacentUnitCount?: number;
  primaryUnitCount?: number;
  primaryExternalArrangementCount?: number;
  primaryInternalArrangementMultiplier?: number;
  primaryRestrictionCount?: number;
  allSpecifiedBlocksTogetherCount?: number;
  target?: number;
  recoveredParameter?: "n" | "blockSize";
  searchMinimum?: number;
  searchMaximum?: number;
}

export interface Pnc002SolverResult {
  exactAnswer: string;
  answer: string;
  numericAnswer: number;
  equation: string;
  mathJax: string;
  evidence: Pnc002SolverEvidence;
}

export interface Pnc002IndependentVerification {
  supported: boolean;
  answer: number;
  method: string;
}

export interface Pnc002ReasoningEvidence {
  conceptId: string;
  givens: Record<string, string | number>;
  equations: string[];
  intermediateValues: Record<string, string | number>;
  decisiveCalculation: string;
  verification: string;
}

export interface Pnc002Explanation {
  explanationId: string;
  lines: string[];
}

export interface Pnc002ValidationCheck {
  name: string;
  passed: boolean;
  message: string;
}

export interface Pnc002ValidationResult {
  valid: boolean;
  checks: Pnc002ValidationCheck[];
}

export interface Pnc002QuestionPackage {
  packageId: typeof PNC_002_PACKAGE_ID;
  archetypeId: typeof PNC_002_PACKAGE_ID;
  canonicalProblemId: Pnc002ActiveCanonicalProblemId;
  questionLanguageId: string;
  questionId: string;
  seed: string;
  language: "en";
  difficultyBand: Pnc002Difficulty;
  taskKind: Pnc002TaskKind;
  solveMode: Pnc002SolveMode;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  parameters: Pnc002Parameters;
  solver: Pnc002SolverResult;
  independentVerification: Pnc002IndependentVerification;
  reasoningEvidence: Pnc002ReasoningEvidence;
  explanation: Pnc002Explanation;
  validation: Pnc002ValidationResult;
  maturity: Pnc002Maturity;
  publiclyPublishable: boolean;
  mathematicalFingerprint: string;
  traceability: Record<string, unknown>;
}

export interface Pnc002CoverageAudit {
  passed: boolean;
  activeQlCount: number;
  expectedQlCount: number;
  missingQlIds: string[];
  duplicateQlIds: string[];
  exactDuplicateTemplateGroups: string[][];
  difficultyCounts: Record<string, number>;
  solveModeCounts: Record<string, number>;
  invalidRuntimeSamples: string[];
}
