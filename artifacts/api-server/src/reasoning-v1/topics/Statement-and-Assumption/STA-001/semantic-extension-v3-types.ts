import type {
  StaCandidateAuthority,
  StaDependency,
  StaDifficulty,
  StaDiscourseAct,
  StaMisconceptionClass,
  StaOracleResult,
  StaProposition,
} from "./types.ts";
import type { StaLocalizedLocale } from "./localization-types.ts";

export type StaExtensionQlId = "STA-QL-005" | "STA-QL-006";
export type StaExtensionLocale = "en-IN" | StaLocalizedLocale;
export type StaExtensionSourceProfile = "SSC" | "BANKING" | "PUNJAB_STATE" | "CROSS_EXAM_DISCOVERY";
export type StaExtensionEvidenceClass =
  | "DIRECT_PYQ"
  | "MEMORY_BASED_PYQ"
  | "TARGET_EXAM_PREP_PATTERN"
  | "CONTROLLED_SYNTHESIS";

export interface StaExtensionSourceAuthority {
  readonly evidenceId: string;
  readonly evidenceClass: StaExtensionEvidenceClass;
  readonly examFamily: "SSC" | "BANKING" | "PUNJAB_STATE" | "CROSS_EXAM";
  readonly examLabel: string;
  readonly year?: number;
  readonly patternSummary: string;
  readonly sourceUrl?: string;
  readonly officialVerbatim: false;
}

export interface StaExtensionScenarioAuthority {
  readonly scenarioId: string;
  readonly extensionQlId: StaExtensionQlId;
  readonly checkpointId: "STA-CP-003" | "STA-CP-005";
  readonly sourceProfile: StaExtensionSourceProfile;
  readonly discourseAct: StaDiscourseAct;
  readonly objectiveIds: readonly [string, ...string[]];
  readonly statementVariants: readonly [string, ...string[]];
  readonly propositions: readonly StaProposition[];
  readonly explicitPropositionIds: readonly string[];
  readonly hiddenDependencies: readonly StaDependency[];
  readonly candidates: readonly [StaCandidateAuthority, StaCandidateAuthority, ...StaCandidateAuthority[]];
  readonly allowedCandidateCounts: readonly (2 | 3)[];
  readonly difficulty: StaDifficulty;
  readonly sourceAuthorityId: string;
  readonly sourceStatus: "SOURCE_SUPPORTED_SEMANTIC_EXTENSION_V3";
}

export interface StaExtensionLocalizedCopy {
  readonly statementVariants: readonly [string, ...string[]];
  readonly candidateText: Readonly<Record<string, string>>;
  readonly rationale: Readonly<Record<string, string>>;
}

export interface StaExtensionRenderedCandidate {
  readonly label: "I" | "II" | "III";
  readonly candidateId: string;
  readonly text: string;
  readonly oracle: StaOracleResult;
  readonly misconceptionClass?: StaMisconceptionClass;
}

export interface StaExtensionOption {
  readonly display: string;
  readonly semanticAnswerSet: readonly number[];
  readonly isCorrect: boolean;
}

export interface StaExtensionQuestion {
  readonly questionId: string;
  readonly packageId: "STA-001";
  readonly chapterId: "REAS-STA";
  readonly extensionVersion: "SEMANTIC_EXTENSION_V3";
  readonly qlId: StaExtensionQlId;
  readonly checkpointId: "STA-CP-003" | "STA-CP-005";
  readonly scenarioId: string;
  readonly seed: string;
  readonly locale: StaExtensionLocale;
  readonly difficulty: StaDifficulty;
  readonly sourceProfile: StaExtensionSourceProfile;
  readonly sourceAuthorityId: string;
  readonly statement: string;
  readonly candidates:
    | readonly [StaExtensionRenderedCandidate, StaExtensionRenderedCandidate]
    | readonly [StaExtensionRenderedCandidate, StaExtensionRenderedCandidate, StaExtensionRenderedCandidate];
  readonly options: readonly [StaExtensionOption, StaExtensionOption, StaExtensionOption, StaExtensionOption];
  readonly answerIndex: 0 | 1 | 2 | 3;
  readonly answerSet: readonly number[];
  readonly explanation: string;
  readonly oracleParity: true;
  readonly lifecycle: {
    readonly coreQl001To004: "IMMUTABLE_FROZEN";
    readonly semanticExtensionV3: "REVIEW_CANDIDATE";
    readonly ql005Status: "REVIEW_CANDIDATE_V1";
    readonly ql006Status: "REVIEW_CANDIDATE_V1";
    readonly multilingualChapterFrozen: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}
