import type {
  NumCp006AuthorityId,
  NumCp006PermanentAllocationEntry,
  NumCp006PermanentQlId,
  NumCp006PrototypeId,
} from "./allocation";

export type NumCp006Difficulty = "EASY" | "MEDIUM" | "HARD";
export type NumCp006Locale = "en-IN" | "hi-IN" | "pa-IN";
export type NumCp006Language = "en" | "hi" | "pa";

export interface NumCp006Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string;
  readonly analysis: string;
}

export interface NumCp006Explanation {
  readonly coreConcept: string;
  readonly givenDataAndStrategy: string;
  readonly stepByStep: readonly string[];
  readonly examSpeedMethod: string;
  readonly commonTraps: readonly string[];
  readonly finalAnswer: string;
}

export interface NumCp006PermanentLifecycle {
  readonly permanentQlId: NumCp006PermanentQlId;
  readonly maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN";
  readonly reviewStatus: "PRODUCT_OWNER_COMPLETION_AUTHORISED";
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

export interface NumCp006PermanentQuestion {
  readonly packageId: "NUM-001";
  readonly checkpointId: "NUM-CP-006";
  readonly permanentQlId: NumCp006PermanentQlId;
  readonly questionLanguageId: NumCp006PermanentQlId;
  readonly questionId: string;
  readonly qlTemplateId: NumCp006PermanentAllocationEntry["qlTemplateId"];
  readonly solveModeId: NumCp006PermanentAllocationEntry["solveModeId"];
  readonly authorityId: NumCp006AuthorityId;
  readonly temporaryPrototypeId: NumCp006PrototypeId;
  readonly authorityPrototypeIds: readonly NumCp006PrototypeId[];
  readonly seed: number;
  readonly sourceSeed: number;
  readonly locale: NumCp006Locale;
  readonly language: NumCp006Language;
  readonly difficulty: NumCp006Difficulty;
  readonly answerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly NumCp006Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp006Explanation;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_MULTILINGUAL_IMPLEMENTATION";
  readonly permanentIdentityFrozen: true;
  readonly reviewStatus: "PRODUCT_OWNER_COMPLETION_AUTHORISED";
  readonly maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN";
  readonly lifecycle: NumCp006PermanentLifecycle;
  readonly traceability: Readonly<{
    packageId: "NUM-001";
    canonicalProblemId: "NUM-CP-006";
    questionLanguageId: NumCp006PermanentQlId;
    qlTemplateId: NumCp006PermanentAllocationEntry["qlTemplateId"];
    solveModeId: NumCp006PermanentAllocationEntry["solveModeId"];
    authorityId: NumCp006AuthorityId;
    authorityPrototypeIds: readonly NumCp006PrototypeId[];
    runtimePrototypeId: NumCp006PrototypeId;
    language: NumCp006Language;
  }>;
}

export interface NumCp006GeneratedContent {
  readonly difficulty: NumCp006Difficulty;
  readonly answerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly NumCp006Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp006Explanation;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
}
