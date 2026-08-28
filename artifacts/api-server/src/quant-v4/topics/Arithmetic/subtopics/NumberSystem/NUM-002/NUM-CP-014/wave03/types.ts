export type NumCp014Wave03PrototypeId =
  | "NUM-CP014-PROT-013"
  | "NUM-CP014-PROT-014"
  | "NUM-CP014-PROT-015"
  | "NUM-CP014-PROT-016"
  | "NUM-CP014-PROT-017"
  | "NUM-CP014-PROT-018";

export type NumCp014Wave03Engine =
  | "DIVISIBILITY"
  | "PERFECT_POWER"
  | "DIVISOR_FUNCTION"
  | "HCF_LCM"
  | "REMAINDER"
  | "POSITIONAL_BASE"
  | "TERMINAL_CYCLE";

export type NumCp014Wave03Representation =
  | "CONSTRAINT_TABLE"
  | "ELIMINATION_GRID"
  | "MINI_CASELET"
  | "MULTI_STAGE_GRAPH";

export interface NumCp014Wave03Ablation {
  readonly components: readonly NumCp014Wave03Engine[];
  readonly fullCandidates: readonly string[];
  readonly componentRemovedCandidates: Readonly<Record<string, readonly string[]>>;
  readonly fullAnswer: string;
  readonly componentRemovedAnswers: Readonly<Record<string, string>>;
  readonly everyComponentChangesAnswer: true;
}

export interface NumCp014Wave03Explanation {
  readonly standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1";
  readonly fullDerivation: readonly string[];
  readonly examShortcut: readonly string[];
}

export interface NumCp014Wave03Package {
  readonly checkpointId: "NUM-CP-014";
  readonly temporaryPrototypeId: NumCp014Wave03PrototypeId;
  readonly seed: number;
  readonly answerSemantic: "DIGIT" | "HIDDEN_NUMBER" | "HIDDEN_BASE" | "HIDDEN_EXPONENT";
  readonly representation: NumCp014Wave03Representation;
  readonly representationPayload: readonly string[];
  readonly stem: string;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly componentEngines: readonly NumCp014Wave03Engine[];
  readonly ablation: NumCp014Wave03Ablation;
  readonly explanation: NumCp014Wave03Explanation;
  readonly mathematicalFingerprint: string;
  readonly options: readonly Readonly<{ value: string; misconceptionId: string }>[];
  readonly correctIndex: number;
  readonly lifecycle: Readonly<{
    permanentQlAllocated: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  }>;
}
