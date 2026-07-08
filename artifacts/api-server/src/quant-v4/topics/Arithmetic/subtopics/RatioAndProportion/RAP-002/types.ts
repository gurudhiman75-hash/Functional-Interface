export const RAP_002_ARCHETYPE_ID = "RAP-002" as const;

export const RAP_002_CP_IDS = [
  "RAP-CP-007",
  "RAP-CP-008",
  "RAP-CP-009",
  "RAP-CP-010",
  "RAP-CP-011",
  "RAP-CP-012",
] as const;

export const RAP_002_LANGUAGES = ["en", "hi", "pa"] as const;

export type Rap002CanonicalProblemId = (typeof RAP_002_CP_IDS)[number];
export type Rap002Language = (typeof RAP_002_LANGUAGES)[number];
export type Rap002DifficultyBand = "Easy" | "Medium" | "Hard";

export type Rap002TaskKind =
  | "chainAlignment"
  | "extendedChainAlignment"
  | "missingChainRatio"
  | "reverseMiddleFinding"
  | "reverseEndpointFinding"
  | "constrainedReverseChain"
  | "successiveRatioChange"
  | "transferTracking"
  | "reconstructOriginalRatio"
  | "electionWinnerVotes"
  | "electionMargin"
  | "electionTotalVotersFromMargin"
  | "nestedPartition"
  | "conditionalDistribution"
  | "weightedNestedPartition"
  | "incomeExpenditureSavings"
  | "inverseChainWork"
  | "inverseChainSpeed"
  | "combinedInverseChain"
  | "sdtTimeRatioFromSpeedDistance"
  | "sdtRaceLead"
  | "chainOrdering"
  | "chainInequality"
  | "chainEquivalence";

export type Rap002AnswerType = "RATIO" | "COUNT" | "LOGIC";

export type Rap002Variables = Record<string, string | number>;

export interface Rap002TaskRegistryEntry {
  cpId: Rap002CanonicalProblemId;
  taskKind: Rap002TaskKind;
  answerType: Rap002AnswerType;
  difficulty: Rap002DifficultyBand;
  requiredVariables: string[];
  explanationId: string;
}

export interface Rap002QuestionLanguageEntry {
  cpId: Rap002CanonicalProblemId;
  taskKind: Rap002TaskKind;
  template: string;
  difficulty: Rap002DifficultyBand;
}

export interface Rap002Parameters {
  archetypeId: typeof RAP_002_ARCHETYPE_ID;
  canonicalProblemId: Rap002CanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  explanationId: string;
  language: Rap002Language;
  difficultyBand: Rap002DifficultyBand;
  taskKind: Rap002TaskKind;
  answerType: Rap002AnswerType;
  requiredVariables: string[];
  variables: Rap002Variables;
  sourceTrace: {
    questionLanguageSource: string;
    explanationSource: string;
    variableRangeSource: string;
  };
}

export interface Rap002SolverResult {
  answer: string;
  answerValue: string | number;
  answerType: Rap002AnswerType;
  workingValues: Record<string, string | number>;
  evidence: Record<string, string | number>;
  mathJax: Record<string, string>;
}

export interface Rap002Explanation {
  explanationId: string;
  lines: string[];
}

export interface Rap002ValidationResult {
  valid: boolean;
  checks: { name: string; passed: boolean; message: string }[];
}

export interface Rap002QuestionPackage {
  archetypeId: typeof RAP_002_ARCHETYPE_ID;
  canonicalProblemId: Rap002CanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  explanationId: string;
  language: Rap002Language;
  difficultyBand: Rap002DifficultyBand;
  stem: string;
  answer: string;
  parameters: Rap002Parameters;
  solver: Rap002SolverResult;
  explanation: Rap002Explanation;
  validation: Rap002ValidationResult;
  mathJax: Record<string, string>;
}

export interface Rap002ParameterInput {
  seed?: string;
  language?: Rap002Language;
  canonicalProblemId?: Rap002CanonicalProblemId;
  questionLanguageId?: string;
  difficultyBand?: Rap002DifficultyBand;
}
