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

export interface StcCandidateAuthority {
  readonly id: string;
  readonly expression: StcExpr;
  readonly text: LocalizedText;
  readonly defectIfNotEntailed?: "POLARITY_FLIP" | "UNSUPPORTED_EXTRA" | "OVERCLAIM" | "INVALID_COMBINATION";
}

export interface StcScenarioAuthority {
  readonly id: string;
  readonly qlId: "STC-QL-001" | "STC-QL-002";
  readonly difficulty: StcDifficulty;
  readonly statement: LocalizedText;
  readonly premises: readonly StcExpr[];
  readonly candidates: readonly [StcCandidateAuthority, StcCandidateAuthority, StcCandidateAuthority, StcCandidateAuthority];
}

export type StcAnswerClass = "ONLY_I" | "ONLY_II" | "BOTH" | "NEITHER";

export interface GeneratedStcQuestion {
  readonly chapterId: "STC-001";
  readonly checkpointId: "STC-CP-001";
  readonly qlId: "STC-QL-001" | "STC-QL-002";
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
    readonly solver: "TRUTH_MODEL_ENTAILMENT_V1";
    readonly reviewOnly: true;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly mockEligible: false;
    readonly publicEligible: false;
  };
}
