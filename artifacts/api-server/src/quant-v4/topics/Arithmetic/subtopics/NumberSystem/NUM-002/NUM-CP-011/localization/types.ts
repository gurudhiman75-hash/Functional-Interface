import type { NumCp011PermanentAuthorityId, NumCp011PermanentQlId } from "../permanent-allocation.ts";

export type NumCp011LocalizedLanguage = "hi" | "pa";
export type NumCp011LocalizedLocale = "hi-IN" | "pa-IN";

export interface NumCp011LocalizedOption {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string;
}

export interface NumCp011LocalizedPackage {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-011";
  readonly authorityId: NumCp011PermanentAuthorityId;
  readonly authorityLabel: string;
  readonly temporaryPrototypeId: string;
  readonly permanentQlId: NumCp011PermanentQlId;
  readonly seed: number;
  readonly sourceSeed: number;
  readonly language: NumCp011LocalizedLanguage;
  readonly locale: NumCp011LocalizedLocale;
  readonly difficulty: "EASY" | "MEDIUM" | "HARD";
  readonly answerSemantic: string;
  readonly sourceAnswerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly NumCp011LocalizedOption[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: Readonly<{
    coreConcept: string;
    strategy: string;
    steps: readonly string[];
    finalAnswer: string;
  }>;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly lifecycle: Readonly<{
    permanentQlId: NumCp011PermanentQlId;
    maturity: "PERMANENT_AUTHORITY";
    reviewStatus: "MULTILINGUAL_FROZEN";
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>;
}
