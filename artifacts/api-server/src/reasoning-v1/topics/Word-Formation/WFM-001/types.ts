export type WfmQlId = "WFM-QL-001" | "WFM-QL-002";
export type WfmTask = "CAN_FORM" | "CANNOT_FORM";
export type WfmDifficulty = "EASY" | "MEDIUM" | "HARD";
export type WfmLanguage = "en-IN" | "hi-IN" | "pa-IN";
export type WfmExamProfile = "SSC_CGL_4" | "PUNJAB_4";
export type WfmDeficitKind = "NONE" | "ABSENT_LETTER" | "MULTIPLICITY" | "MIXED";

export interface WfmCandidateAnalysis {
  word: string;
  canForm: boolean;
  deficitKind: WfmDeficitKind;
  totalDeficit: number;
  deficits: Readonly<Record<string, { needed: number; available: number }>>;
}

export interface WfmOption {
  id: "A" | "B" | "C" | "D";
  text: string;
  provenance:
    | "VALID_LETTER_MULTISET"
    | "IGNORED_MISSING_LETTER"
    | "IGNORED_REPEATED_LETTER_LIMIT";
}

export interface WfmGeneratedQuestion {
  chapterId: "WFM-001";
  checkpointId: "WFM-CP-001";
  qlId: WfmQlId;
  task: WfmTask;
  seed: number;
  language: WfmLanguage;
  examProfile: WfmExamProfile;
  difficulty: WfmDifficulty;
  stem: string;
  sourceWord: string;
  options: readonly WfmOption[];
  correctOptionId: WfmOption["id"];
  explanation: string;
  metadata: {
    runtimeVersion: "WFM-001-RUNTIME-V1-REVIEW";
    optionCount: 4;
    sourceEvidenceStatus: "SOURCE_BACKED_CLASSIC_SSC_PATTERN";
    lifecycle: "REVIEW_ONLY";
    questionBankStored: false;
    testEligible: false;
    publiclyPublishable: false;
    difficultyBasis: "GENERATED_INSTANCE";
    ownershipDecision: "PROPOSED_REAS_WFM";
  };
}
