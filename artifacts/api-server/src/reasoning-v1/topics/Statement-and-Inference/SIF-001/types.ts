export const SIF_CP_IDS = [
  "SIF-CP001", "SIF-CP002", "SIF-CP003", "SIF-CP004", "SIF-CP005", "SIF-CP006",
  "SIF-CP007", "SIF-CP008", "SIF-CP009", "SIF-CP010", "SIF-CP011", "SIF-CP012",
  "SIF-CP013", "SIF-CP014", "SIF-CP015", "SIF-CP016", "SIF-CP017",
] as const;

export type SifCpId = (typeof SIF_CP_IDS)[number];
export type SifLocale = "en-IN" | "hi-IN" | "pa-IN";
export type SifDifficulty = "EASY" | "MEDIUM" | "HARD";
export type SifInferenceStrength = "CERTAIN" | "STRONGLY_SUPPORTED" | "POSSIBLE_ONLY" | "UNSUPPORTED_OR_CONTRADICTED";
export type SifAnswerClass = "ONLY_I" | "ONLY_II" | "EITHER" | "NEITHER" | "BOTH";
export type SifQuestionFormat = "SINGLE_INFERENCE" | "TWO_INFERENCES" | "DOES_NOT_FOLLOW" | "BEST_SUPPORTED" | "MULTIPLE_STATEMENTS";
export type SifContextDomain = "WORKPLACE" | "EDUCATION" | "BUSINESS" | "BANKING" | "TRANSPORT" | "PUBLIC_ADMINISTRATION" | "SURVEY" | "EVERYDAY" | "HEALTHCARE";
export type SifDistractorType = "UNSUPPORTED_DETAIL" | "OVERGENERALISATION" | "EXCESSIVE_CERTAINTY" | "REVERSED_RELATIONSHIP" | "CAUSE_ASSUMPTION" | "SCOPE_CHANGE" | "QUANTITY_DISTORTION" | "TIME_DISTORTION" | "INTENT_WITHOUT_EVIDENCE" | "COMMON_KNOWLEDGE" | "PARTIAL_SUPPORT" | "STRONGER_CLAIM";
export type SifMechanism = "DIRECT_FACT" | "DUAL_EVALUATION" | "QUANTIFIER" | "COMPARISON" | "SUGGESTIVE_REASON" | "PURPOSE" | "NEGATIVE_RESTRICTION" | "CONTEXT_SYNTHESIS" | "DATA_COMPARISON" | "CONDITIONAL_DIRECTION" | "MULTIPLE_FACTOR" | "SUPPORT_THRESHOLD" | "SCOPE_CONTROL" | "TIME_SEQUENCE" | "STATED_POSITION" | "ADVANCED_PARAGRAPH" | "MIXED";

export interface SifLocalizedText {
  readonly "en-IN": string;
  readonly "hi-IN": string;
  readonly "pa-IN": string;
}

export interface SifCandidateAuthority {
  readonly id: string;
  readonly text: SifLocalizedText;
  readonly strength: SifInferenceStrength;
  readonly follows: boolean;
  readonly supportFactIds: readonly string[];
  readonly distractorType?: SifDistractorType;
}

export interface SifScenarioAuthority {
  readonly id: string;
  readonly cpId: SifCpId;
  readonly difficulty: SifDifficulty;
  readonly domain: SifContextDomain;
  readonly mechanisms: readonly SifMechanism[];
  readonly statement: SifLocalizedText;
  readonly facts: readonly { readonly id: string; readonly text: SifLocalizedText }[];
  readonly candidates: readonly [SifCandidateAuthority, SifCandidateAuthority];
  readonly explanation: SifLocalizedText;
  readonly identityGuard: {
    readonly evaluatesSupport: true;
    readonly assumptionQuestion: false;
    readonly conclusionQuestion: false;
    readonly argumentQuestion: false;
    readonly causeEffectQuestion: false;
    readonly courseOfActionQuestion: false;
  };
}

export interface SifValidationGateResult {
  readonly gate: "LOGICAL_VALIDITY" | "UNIQUE_ANSWER" | "NO_OUTSIDE_KNOWLEDGE" | "INFERENCE_IDENTITY" | "DISTRACTOR_PLAUSIBILITY" | "LANGUAGE_QUALITY" | "DIFFICULTY_MATCH" | "EXPLANATION_QUALITY" | "MULTILINGUAL_PARITY" | "NOVELTY";
  readonly passed: boolean;
  readonly detail: string;
}

export interface GeneratedSifQuestion {
  readonly chapterId: "SIF-001";
  readonly cpId: SifCpId;
  readonly scenarioId: string;
  readonly locale: SifLocale;
  readonly seed: number;
  readonly difficulty: SifDifficulty;
  readonly format: SifQuestionFormat;
  readonly domain: SifContextDomain;
  readonly instruction: string;
  readonly statement: string;
  readonly inferences: readonly [string, string];
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answerClass: SifAnswerClass;
  readonly explanation: string;
  readonly factIds: readonly string[];
  readonly candidateStrengths: readonly [SifInferenceStrength, SifInferenceStrength];
  readonly mechanisms: readonly SifMechanism[];
  readonly distractorTypes: readonly SifDistractorType[];
  readonly validation: readonly SifValidationGateResult[];
  readonly metadata: {
    readonly solver: "SIF_STRUCTURED_SUPPORT_V1";
    readonly generationOrder: "LOGIC_FIRST_LANGUAGE_SECOND";
    readonly reviewOnly: true;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly mockEligible: false;
    readonly publicEligible: false;
  };
}
