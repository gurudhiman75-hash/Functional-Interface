export type NumCp014Wave01PrototypeId =
  | "NUM-CP014-PROT-001"
  | "NUM-CP014-PROT-002"
  | "NUM-CP014-PROT-003"
  | "NUM-CP014-PROT-004"
  | "NUM-CP014-PROT-005"
  | "NUM-CP014-PROT-006";

export type NumCp014Wave01TaskKind =
  | "HIDDEN_DIGIT_DIVISIBILITY_REMAINDER"
  | "HIDDEN_NUMBER_HCF_PRIME"
  | "DIVISOR_COUNT_PERFECT_POWER"
  | "FACTORIAL_VALUATION_TERMINAL_CYCLE"
  | "UNKNOWN_BASE_VALIDITY_DIVISIBILITY"
  | "HIDDEN_NUMBER_PERFECT_POWER_REMAINDER";

export type NumCp014ComponentEngine =
  | "DIVISIBILITY"
  | "REMAINDER"
  | "HCF_LCM"
  | "PRIME_STRUCTURE"
  | "DIVISOR_FUNCTION"
  | "PERFECT_POWER"
  | "FACTORIAL_VALUATION"
  | "TERMINAL_DIGIT_CYCLE"
  | "POSITIONAL_BASE";

export interface NumCp014AblationEvidence {
  readonly componentA: NumCp014ComponentEngine;
  readonly componentB: NumCp014ComponentEngine;
  readonly fullCandidates: readonly string[];
  readonly withoutA: readonly string[];
  readonly withoutB: readonly string[];
  readonly componentANecessary: true;
  readonly componentBNecessary: true;
}

export interface NumCp014Wave01Option {
  readonly value: string;
  readonly misconceptionId: string;
}

export interface NumCp014Wave01Explanation {
  readonly standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1";
  readonly fullDerivation: readonly string[];
  readonly examShortcut: readonly string[];
}

export interface NumCp014Wave01Package {
  readonly checkpointId: "NUM-CP-014";
  readonly temporaryPrototypeId: NumCp014Wave01PrototypeId;
  readonly taskKind: NumCp014Wave01TaskKind;
  readonly seed: number;
  readonly stem: string;
  readonly options: readonly NumCp014Wave01Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly componentEngines: readonly [NumCp014ComponentEngine, NumCp014ComponentEngine];
  readonly ablation: NumCp014AblationEvidence;
  readonly explanation: NumCp014Wave01Explanation;
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
