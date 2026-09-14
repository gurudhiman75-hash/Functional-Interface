export type WfmQlId = "WFM-QL-001" | "WFM-QL-002" | "WFM-QL-003" | "WFM-QL-004";
export type WfmCheckpointId = "WFM-CP-001" | "WFM-CP-002" | "WFM-CP-003";
export type WfmTask =
  | "CAN_FORM"
  | "CANNOT_FORM"
  | "COUNT_SELECTED_LETTER_WORDS"
  | "REARRANGE_TO_MEANINGFUL_WORD";
export type WfmDifficulty = "EASY" | "MEDIUM" | "HARD";
export type WfmLanguage = "en-IN" | "hi-IN" | "pa-IN";
export type WfmExamProfile = "SSC_CGL_4" | "PUNJAB_4";
export type WfmDeficitKind = "NONE" | "ABSENT_LETTER" | "MULTIPLICITY" | "MIXED";
export type WfmRenderer = "FULL_SOURCE_WORD" | "SELECTED_POSITION_COUNT" | "JUMBLED_WORD" | "NUMBERED_SEQUENCE";

export interface WfmCandidateAnalysis {
  readonly word: string;
  readonly canForm: boolean;
  readonly deficitKind: WfmDeficitKind;
  readonly totalDeficit: number;
  readonly deficits: Readonly<Record<string, { needed: number; available: number }>>;
}

export interface WfmOption {
  readonly id: "A" | "B" | "C" | "D";
  readonly text: string;
  readonly provenance:
    | "VALID_LETTER_MULTISET"
    | "IGNORED_MISSING_LETTER"
    | "IGNORED_REPEATED_LETTER_LIMIT"
    | "CORRECT_WORD_COUNT"
    | "COUNT_NEAR_MISS"
    | "EXACT_REARRANGEMENT"
    | "NEAR_REARRANGEMENT"
    | "WRONG_INDEX_ORDER";
}

export interface WfmGeneratedQuestion {
  readonly chapterId: "WFM-001";
  readonly checkpointId: WfmCheckpointId;
  readonly qlId: WfmQlId;
  readonly task: WfmTask;
  readonly renderer: WfmRenderer;
  readonly seed: number;
  readonly language: WfmLanguage;
  readonly examProfile: WfmExamProfile;
  readonly difficulty: WfmDifficulty;
  readonly stem: string;
  readonly sourceWord?: string;
  readonly structuredPrompt: Readonly<Record<string, unknown>>;
  readonly options: readonly WfmOption[];
  readonly correctOptionId: WfmOption["id"];
  readonly explanation: string;
  readonly metadata: {
    readonly runtimeVersion: "WFM-001-RUNTIME-V2-REVIEW";
    readonly optionCount: 4;
    readonly sourceEvidenceStatus: "SOURCE_BACKED_SSC_WORD_FORMATION";
    readonly lifecycle: "REVIEW_ONLY";
    readonly questionStudioVisible: false;
    readonly questionBankStored: false;
    readonly testEligible: false;
    readonly mockTestEligible: false;
    readonly publiclyPublishable: false;
    readonly difficultyBasis: "GENERATED_INSTANCE";
    readonly ownershipDecision: "PROPOSED_REAS_WFM";
  };
}
