import type { NumCp012PermanentAuthorityId, NumCp012PermanentQlId } from "../permanent-allocation.ts";

export type NumCp012LocalizedLanguage = "hi" | "pa";
export type NumCp012LocalizedLocale = "hi-IN" | "pa-IN";

export interface NumCp012LocalizedOption {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string;
}

export interface NumCp012LocalizedPackage {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-012";
  readonly authorityId: NumCp012PermanentAuthorityId;
  readonly authorityLabel: string;
  readonly temporaryPrototypeId: string;
  readonly permanentQlId: NumCp012PermanentQlId;
  readonly seed: number;
  readonly sourceSeed: number;
  readonly language: NumCp012LocalizedLanguage;
  readonly locale: NumCp012LocalizedLocale;
  readonly difficulty: "EASY" | "MEDIUM" | "HARD";
  readonly answerSemantic: string;
  readonly sourceAnswerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly NumCp012LocalizedOption[];
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
    permanentQlId: NumCp012PermanentQlId;
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
