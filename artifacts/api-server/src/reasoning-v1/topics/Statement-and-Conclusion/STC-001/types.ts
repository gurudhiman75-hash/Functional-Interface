export const STC_QL_IDS = [
  "STC-QL-001",
  "STC-QL-002",
  "STC-QL-003",
  "STC-QL-004",
  "STC-QL-005",
  "STC-QL-006",
] as const;

export type StcQlId = (typeof STC_QL_IDS)[number];
export type StcLocale = "en-IN" | "hi-IN" | "pa-IN";
export type StcDifficulty = "EASY" | "MEDIUM" | "HARD";

export type StcExpr =
  | { readonly kind: "atom"; readonly id: string }
  | { readonly kind: "not"; readonly value: StcExpr }
  | { readonly kind: "and"; readonly values: readonly StcExpr[] }
  | { readonly kind: "or"; readonly values: readonly StcExpr[] }
  | { readonly kind: "implies"; readonly if: StcExpr; readonly then: StcExpr };

export interface LocalizedText {
  readonly "en-IN": string;
  readonly "hi-IN": string;
  readonly "pa-IN": string;
}

export type StcLogicalDefect =
  | "POLARITY_FLIP"
  | "UNSUPPORTED_EXTRA"
  | "OVERCLAIM"
  | "INVALID_COMBINATION"
  | "CONVERSE"
  | "INVERSE"
  | "DENYING_ANTECEDENT";

export interface StcCandidateAuthority {
  readonly id: string;
  readonly expression: StcExpr;
  readonly text: LocalizedText;
  readonly defectIfNotEntailed?: StcLogicalDefect;
}

export interface StcScenarioAuthority {
  readonly id: string;
  readonly qlId: "STC-QL-001" | "STC-QL-002" | "STC-QL-003";
  readonly difficulty: StcDifficulty;
  readonly statement: LocalizedText;
  readonly premises: readonly StcExpr[];
  readonly candidates: readonly [StcCandidateAuthority, StcCandidateAuthority, StcCandidateAuthority, StcCandidateAuthority];
}

export type StcModalStrength = "POSSIBLE" | "CERTAIN";
export type StcModalPolarity = "POSITIVE" | "NEGATIVE";

export interface StcModalClaim {
  readonly atom: string;
  readonly strength: StcModalStrength;
  readonly polarity: StcModalPolarity;
}

export type StcModalDefect = "STRONGER_MODALITY" | "POLARITY_FLIP" | "UNSUPPORTED_EXTRA";

export interface StcModalCandidateAuthority {
  readonly id: string;
  readonly claim: StcModalClaim;
  readonly text: LocalizedText;
  readonly defectIfNotEntailed?: StcModalDefect;
}

export interface StcModalScenarioAuthority {
  readonly id: string;
  readonly qlId: "STC-QL-004";
  readonly difficulty: StcDifficulty;
  readonly statement: LocalizedText;
  readonly premise: StcModalClaim;
  readonly candidates: readonly [StcModalCandidateAuthority, StcModalCandidateAuthority, StcModalCandidateAuthority, StcModalCandidateAuthority];
}

export interface StcOrderClaim {
  readonly relationId: string;
  readonly higher: string;
  readonly lower: string;
}

export type StcOrderDefect = "REVERSED_ORDER" | "UNSUPPORTED_RELATION" | "UNRELATED_ENTITY";

export interface StcOrderCandidateAuthority {
  readonly id: string;
  readonly claim: StcOrderClaim;
  readonly text: LocalizedText;
  readonly defectIfNotEntailed?: StcOrderDefect;
}

export interface StcOrderScenarioAuthority {
  readonly id: string;
  readonly qlId: "STC-QL-005";
  readonly difficulty: StcDifficulty;
  readonly statement: LocalizedText;
  readonly premises: readonly StcOrderClaim[];
  readonly candidates: readonly [StcOrderCandidateAuthority, StcOrderCandidateAuthority, StcOrderCandidateAuthority, StcOrderCandidateAuthority];
}

export type StcTemporalClaim =
  | { readonly kind: "before"; readonly first: string; readonly second: string }
  | { readonly kind: "trend"; readonly metric: string; readonly from: string; readonly to: string; readonly direction: "INCREASED" | "DECREASED" };

export type StcTemporalDefect = "REVERSED_TIME" | "REVERSED_TREND" | "UNSUPPORTED_EXTRA";

export interface StcTemporalCandidateAuthority {
  readonly id: string;
  readonly claim: StcTemporalClaim;
  readonly text: LocalizedText;
  readonly defectIfNotEntailed?: StcTemporalDefect;
}

export interface StcTemporalScenarioAuthority {
  readonly id: string;
  readonly qlId: "STC-QL-006";
  readonly difficulty: StcDifficulty;
  readonly statement: LocalizedText;
  readonly premises: readonly StcTemporalClaim[];
  readonly candidates: readonly [StcTemporalCandidateAuthority, StcTemporalCandidateAuthority, StcTemporalCandidateAuthority, StcTemporalCandidateAuthority];
}

export type StcAnswerClass = "ONLY_I" | "ONLY_II" | "BOTH" | "NEITHER";

export interface GeneratedStcQuestion {
  readonly chapterId: "STC-001";
  readonly checkpointId: "STC-CP-001" | "STC-CP-002" | "STC-CP-003";
  readonly qlId: StcQlId;
  readonly scenarioId: string;
  readonly locale: StcLocale;
  readonly seed: number;
  readonly difficulty: StcDifficulty;
  readonly stem: string;
  readonly conclusions: readonly [string, string];
  readonly options: readonly [string, string, string, string];
  readonly correctIndex: number;
  readonly answerClass: StcAnswerClass;
  readonly explanation: string;
  readonly metadata: {
    readonly solver: "TRUTH_MODEL_ENTAILMENT_V1" | "MODAL_STRENGTH_ENTAILMENT_V1" | "STRICT_ORDER_CLOSURE_V1" | "TEMPORAL_TREND_CLOSURE_V1";
    readonly reviewOnly: true;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly mockEligible: false;
    readonly publicEligible: false;
  };
}
