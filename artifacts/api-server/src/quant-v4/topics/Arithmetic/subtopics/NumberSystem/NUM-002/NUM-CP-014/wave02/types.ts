export type NumCp014Wave02PrototypeId =
  | "NUM-CP014-PROT-007"
  | "NUM-CP014-PROT-008"
  | "NUM-CP014-PROT-009"
  | "NUM-CP014-PROT-010"
  | "NUM-CP014-PROT-011"
  | "NUM-CP014-PROT-012";

export type NumCp014Wave02AnswerSemantic =
  | "LEAST_VALUE"
  | "GREATEST_VALUE"
  | "COUNT"
  | "SOLUTION_CLASS"
  | "HIDDEN_NUMBER";

export type NumCp014Wave02Engine =
  | "DIVISIBILITY"
  | "REMAINDER"
  | "HCF_LCM"
  | "PRIME_STRUCTURE"
  | "PERFECT_POWER"
  | "POSITIONAL_BASE";

export interface NumCp014Wave02Ablation {
  readonly components: readonly NumCp014Wave02Engine[];
  readonly fullCandidates: readonly string[];
  readonly componentRemovedCandidates: Readonly<Record<string, readonly string[]>>;
  readonly fullAnswer: string;
  readonly componentRemovedAnswers: Readonly<Record<string, string>>;
  readonly everyComponentChangesAnswer: true;
}

export interface NumCp014Wave02Package {
  readonly checkpointId: "NUM-CP-014";
  readonly temporaryPrototypeId: NumCp014Wave02PrototypeId;
  readonly seed: number;
  readonly answerSemantic: NumCp014Wave02AnswerSemantic;
  readonly stem: string;
  readonly options: readonly { readonly value: string; readonly misconceptionId: string }[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly ablation: NumCp014Wave02Ablation;
  readonly explanation: {
    readonly standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1";
    readonly fullDerivation: readonly string[];
    readonly examShortcut: readonly string[];
  };
  readonly mathematicalFingerprint: string;
  readonly lifecycle: {
    readonly permanentQlAllocated: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly mockTestEligible: false;
    readonly publiclyPublishable: false;
    readonly automaticStudentPublication: false;
  };
}
