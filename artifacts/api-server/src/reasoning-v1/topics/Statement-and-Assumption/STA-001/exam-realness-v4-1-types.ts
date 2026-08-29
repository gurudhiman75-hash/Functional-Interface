export type StaV4QlId =
  | "STA-QL-001"
  | "STA-QL-002"
  | "STA-QL-003"
  | "STA-QL-004"
  | "STA-QL-005"
  | "STA-QL-006";

export type StaV4CheckpointId = "STA-CP-001" | "STA-CP-002" | "STA-CP-003" | "STA-CP-004";
export type StaV4Language = "en" | "hi" | "pa";
export type StaV4Locale = "en-IN" | "hi-IN" | "pa-IN";
export type StaV4Difficulty = "Easy" | "Medium" | "Hard";
export type StaV4SourceProfile = "SSC" | "BANKING" | "PUNJAB_STATE" | "CROSS_EXAM_DISCOVERY";
export type StaV4ProfileId =
  | "SSC_2X4"
  | "SSC_3X4"
  | "BANK_2X5"
  | "BANK_3X5"
  | "BANK_4X5"
  | "BANK_3X5_NEGATIVE"
  | "BANK_5X5"
  | "PUNJAB_2X4"
  | "PUNJAB_3X4";

export type StaV4Classification = "IMPLICIT" | "NOT_IMPLICIT";
export type StaV4QueryPolarity = "POSITIVE" | "NEGATIVE";

export interface StaV4LocalizedText {
  readonly en: string;
  readonly hi: string;
  readonly pa: string;
}

export interface StaV4CandidateAuthority {
  readonly candidateId: string;
  readonly textVariants: readonly [StaV4LocalizedText, StaV4LocalizedText];
  readonly classification: StaV4Classification;
  readonly misconception: string;
  readonly rationale: StaV4LocalizedText;
}

export interface StaV4ScenarioAuthority {
  readonly scenarioId: string;
  readonly qlId: StaV4QlId;
  readonly checkpointId: StaV4CheckpointId;
  readonly sourceProfile: StaV4SourceProfile;
  readonly difficulty: StaV4Difficulty;
  readonly discourseAct: string;
  readonly domain: string;
  readonly statementVariants: readonly [StaV4LocalizedText, StaV4LocalizedText, StaV4LocalizedText];
  readonly candidates: readonly [
    StaV4CandidateAuthority,
    StaV4CandidateAuthority,
    StaV4CandidateAuthority,
    StaV4CandidateAuthority,
    StaV4CandidateAuthority,
    StaV4CandidateAuthority,
    StaV4CandidateAuthority
  ];
  readonly sourceAuthorityId: string;
}

export interface StaV4PresentationProfile {
  readonly profileId: StaV4ProfileId;
  readonly candidateCount: 2 | 3 | 4 | 5;
  readonly optionCount: 4 | 5;
  readonly queryPolarity: StaV4QueryPolarity;
  readonly evidenceClass: "DIRECT_PYQ_FORMAT" | "DIRECT_MEMORY_BASED_PYQ" | "LEGACY_OR_FAMILY_COMPATIBLE" | "CROSS_EXAM_SYNTHESIS";
  readonly officialVerbatim: false;
  readonly directPunjabPyqBacked: boolean;
}

export interface StaV4RenderedCandidate {
  readonly label: string;
  readonly candidateId: string;
  readonly text: string;
  readonly classification: StaV4Classification;
  readonly misconception: string;
}

export interface StaV4RenderedOption {
  readonly display: string;
  readonly semanticAnswerSet: readonly number[];
  readonly isCorrect: boolean;
}

export interface StaV4Question {
  readonly packageId: "STA-001";
  readonly chapterId: "REAS-STA";
  readonly runtimeVersion: "EXAM_REALNESS_V4_1";
  readonly qlId: StaV4QlId;
  readonly checkpointId: StaV4CheckpointId;
  readonly presentationProfile: StaV4ProfileId;
  readonly questionId: string;
  readonly canonicalItemId: string;
  readonly questionLanguageId: string;
  readonly contentFingerprint: string;
  readonly language: StaV4Language;
  readonly locale: StaV4Locale;
  readonly difficulty: StaV4Difficulty;
  readonly sourceProfile: StaV4SourceProfile;
  readonly evidenceClass: StaV4PresentationProfile["evidenceClass"];
  readonly candidateCount: 2 | 3 | 4 | 5;
  readonly optionCount: 4 | 5;
  readonly queryPolarity: StaV4QueryPolarity;
  readonly instruction: string;
  readonly statement: string;
  readonly candidates: readonly StaV4RenderedCandidate[];
  readonly options: readonly StaV4RenderedOption[];
  readonly answerIndex: number;
  readonly answerSet: readonly number[];
  readonly explanation: string;
  readonly seed: string;
  readonly scenarioId: string;
  readonly sourceAuthorityId: string;
}

export interface GenerateStaV4QuestionInput {
  readonly seed: string;
  readonly locale: StaV4Locale;
  readonly profileId: StaV4ProfileId;
  readonly qlId?: StaV4QlId;
}
