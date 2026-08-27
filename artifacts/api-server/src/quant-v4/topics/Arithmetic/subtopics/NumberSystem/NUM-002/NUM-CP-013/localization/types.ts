import type { NumCp013PermanentAuthorityId, NumCp013PermanentQlId } from "../permanent-allocation.ts";

export type NumCp013LocalizedLanguage = "hi" | "pa";
export type NumCp013LocalizedLocale = "hi-IN" | "pa-IN";

export interface NumCp013LocalizedOption {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string;
}

export interface NumCp013LocalizedPackage {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-013";
  readonly authorityId: NumCp013PermanentAuthorityId;
  readonly authorityLabel: string;
  readonly temporaryPrototypeId: string;
  readonly permanentQlId: NumCp013PermanentQlId;
  readonly seed: number;
  readonly sourceSeed: number;
  readonly language: NumCp013LocalizedLanguage;
  readonly locale: NumCp013LocalizedLocale;
  readonly difficulty: "EASY" | "MEDIUM" | "HARD";
  readonly taskKind: string;
  readonly answerSemantic: string;
  readonly sourceAnswerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly NumCp013LocalizedOption[];
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
    permanentQlId: NumCp013PermanentQlId;
    maturity: "PERMANENT_AUTHORITY";
    reviewStatus: "MULTILINGUAL_FROZEN";
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  }>;
}
