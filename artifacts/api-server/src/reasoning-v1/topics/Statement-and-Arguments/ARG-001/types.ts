export const ARG_QL_IDS = [
  "ARG-QL-001",
  "ARG-QL-002",
  "ARG-QL-003",
  "ARG-QL-004",
  "ARG-QL-005",
  "ARG-QL-006",
] as const;

export type ArgQlId = (typeof ARG_QL_IDS)[number];
export type ArgLocale = "en-IN" | "hi-IN" | "pa-IN";
export type ArgDifficulty = "EASY" | "MEDIUM" | "HARD";
export type ArgStrength = "STRONG" | "WEAK";
export type ArgStance = "SUPPORTS" | "OPPOSES";
export type ArgAnswerClass = "ONLY_I" | "ONLY_II" | "BOTH" | "NEITHER";

export type ArgRelevance = "DIRECT" | "INDIRECT" | "IRRELEVANT";
export type ArgMateriality = "MAJOR" | "MINOR" | "TRIVIAL";
export type ArgSupportQuality = "GROUNDED" | "PLAUSIBLE" | "ASSERTED" | "FALLACIOUS";
export type ArgFeasibility = "REALISTIC" | "UNCERTAIN" | "IMPRACTICAL" | "NOT_APPLICABLE";
export type ArgScope = "CALIBRATED" | "OVERBROAD" | "ABSOLUTE_UNJUSTIFIED";
export type ArgStakeholderLegitimacy = "LEGITIMATE" | "WEAK" | "PREJUDICIAL" | "NOT_APPLICABLE";
export type ArgIssueMatch = "EXACT" | "PARTIAL" | "DIFFERENT_ISSUE";

export type ArgWeaknessDefect =
  | "IRRELEVANT_TANGENT"
  | "TRIVIAL_CONSIDERATION"
  | "BARE_ASSERTION"
  | "UNSUPPORTED_CAUSAL_LEAP"
  | "CORRELATION_AS_CAUSATION"
  | "ANECDOTE_AS_UNIVERSAL_PROOF"
  | "CIRCULAR_REASONING"
  | "IMPRACTICAL_PREMISE"
  | "UNSUPPORTED_IMPLEMENTATION_FAILURE"
  | "OVERGENERALIZATION"
  | "ABSOLUTE_CLAIM"
  | "EMOTIONAL_APPEAL"
  | "POPULARITY_OR_AUTHORITY_APPEAL"
  | "PREJUDICIAL_STEREOTYPE"
  | "PERSONAL_CONVENIENCE_ONLY"
  | "SPECULATIVE_SLIPPERY_SLOPE"
  | "FALSE_DILEMMA"
  | "REMOTE_SECOND_ORDER_EFFECT"
  | "DIFFERENT_PROPOSAL"
  | "RESTATES_ISSUE";

export interface ArgArgumentAuthority {
  readonly id: string;
  readonly stance: ArgStance;
  readonly text: string;
  readonly expectedStrength: ArgStrength;
  readonly relevance: ArgRelevance;
  readonly materiality: ArgMateriality;
  readonly support: ArgSupportQuality;
  readonly feasibility: ArgFeasibility;
  readonly scope: ArgScope;
  readonly stakeholderLegitimacy: ArgStakeholderLegitimacy;
  readonly issueMatch: ArgIssueMatch;
  readonly weaknessDefects: readonly ArgWeaknessDefect[];
}

export interface ArgScenarioAuthority {
  readonly id: string;
  readonly qlId: ArgQlId;
  readonly difficulty: ArgDifficulty;
  readonly statement: string;
  readonly arguments: readonly [ArgArgumentAuthority, ArgArgumentAuthority];
  readonly expectedAnswerClass: ArgAnswerClass;
  readonly domain:
    | "EDUCATION"
    | "BANKING"
    | "PUBLIC_ADMIN"
    | "TRANSPORT"
    | "ENVIRONMENT"
    | "WORKPLACE"
    | "CONSUMER"
    | "TECHNOLOGY"
    | "RECRUITMENT";
}

export interface GeneratedArgQuestion {
  readonly chapterId: "ARG-001";
  readonly checkpointId: "ARG-CP-001" | "ARG-CP-002" | "ARG-CP-003" | "ARG-CP-004" | "ARG-CP-005" | "ARG-CP-006";
  readonly qlId: ArgQlId;
  readonly scenarioId: string;
  readonly locale: ArgLocale;
  readonly seed: number;
  readonly difficulty: ArgDifficulty;
  readonly statement: string;
  readonly arguments: readonly [string, string];
  readonly options: readonly [string, string, string, string];
  readonly correctIndex: number;
  readonly answerClass: ArgAnswerClass;
  readonly explanation: string;
  readonly metadata: {
    readonly solver: "ARGUMENT_STRENGTH_AUTHORITY_V1";
    readonly reviewOnly: true;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly mockEligible: false;
    readonly publicEligible: false;
    readonly automaticStudentPublication: false;
  };
}
