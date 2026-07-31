export type ClsCp006PrototypeId =
  | "CLS-CP006-PROT-001"
  | "CLS-CP006-PROT-002"
  | "CLS-CP006-PROT-003"
  | "CLS-CP006-PROT-004"
  | "CLS-CP006-PROT-005"
  | "CLS-CP006-PROT-006"
  | "CLS-CP006-PROT-007"
  | "CLS-CP006-PROT-008";

export type ClsCp006RuleId =
  | "LETTER_VOWEL_CONSONANT_CLASS"
  | "LETTER_POSITION_PARITY"
  | "LETTER_ALPHABET_HALF"
  | "PAIR_ABSOLUTE_POSITION_GAP"
  | "PAIR_SIGNED_POSITION_GAP"
  | "PAIR_POSITION_SUM"
  | "PAIR_OPPOSITE_STATUS"
  | "PAIR_VOWEL_CONSONANT_COMPOSITION";

export type ClsCp006Task = "FIND_ODD_LETTER" | "FIND_ODD_LETTER_PAIR";
export type ClsCp006OptionKind = "LETTER" | "LETTER_PAIR";
export type ClsCp006Difficulty = "EASY" | "MEDIUM" | "HARD";
export type ClsCp006AuditResult = "UNIQUE" | "AMBIGUOUS" | "NO_VALID_RULE";

export type ClsCp006LetterItem = {
  readonly kind: "LETTER";
  readonly letters: readonly [string];
};

export type ClsCp006LetterPairItem = {
  readonly kind: "LETTER_PAIR";
  readonly letters: readonly [string, string];
};

export type ClsCp006Item = ClsCp006LetterItem | ClsCp006LetterPairItem;

export type ClsCp006PrototypeDefinition = {
  readonly prototypeId: ClsCp006PrototypeId;
  readonly title: string;
  readonly task: ClsCp006Task;
  readonly optionKind: ClsCp006OptionKind;
  readonly allowedRuleIds: readonly ClsCp006RuleId[];
};

export type ClsCp006RuleSupport = {
  readonly ruleId: ClsCp006RuleId;
  readonly commonValue: string;
  readonly outlierValue: string;
  readonly matchingOptionIndexes: readonly number[];
  readonly answerIndex: number;
};

export type ClsCp006AmbiguityAudit = {
  readonly result: ClsCp006AuditResult;
  readonly answerIndex: number | null;
  readonly intendedRuleSupported: boolean;
  readonly candidateSupports: readonly ClsCp006RuleSupport[];
  readonly reason: string;
};

export type ClsCp006DifficultyFeatures = {
  readonly optionCount: 4 | 5;
  readonly optionKind: ClsCp006OptionKind;
  readonly arithmeticDemand: 1 | 2 | 3;
  readonly directionSensitive: boolean;
  readonly competingSupportCount: number;
  readonly maximumPosition: number;
  readonly score: number;
};

export type ClsCp006Explanation = {
  readonly coreConcept: readonly string[];
  readonly stepByStep: readonly string[];
  readonly examSpeedShortcut: readonly string[];
  readonly commonTrapWarning: readonly string[];
};

export type GeneratedClsCp006Question = {
  readonly checkpointId: "CLS-CP-006";
  readonly prototypeId: ClsCp006PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly task: ClsCp006Task;
  readonly optionKind: ClsCp006OptionKind;
  readonly stem: string;
  readonly items: readonly ClsCp006Item[];
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly intendedRuleId: ClsCp006RuleId;
  readonly intendedRuleValue: string;
  readonly evidenceByOption: readonly string[];
  readonly ambiguityAudit: ClsCp006AmbiguityAudit;
  readonly difficulty: ClsCp006Difficulty;
  readonly difficultyFeatures: ClsCp006DifficultyFeatures;
  readonly explanation: ClsCp006Explanation;
  readonly reviewOnly: true;
  readonly questionStudioVisible: false;
  readonly metadata: {
    readonly datasetVersion: "CLS-CP006-ALPHABET-DOMAIN-v1";
    readonly runtimeVersion: "cls-cp006-discovery-v1";
    readonly locale: "en-IN";
    readonly optionCount: 4 | 5;
    readonly sourcePrototypeSeed: number;
    readonly sourceSaturationStatus: "INITIAL_SOURCE_PASS_COMPLETE__GAP_AUDIT_OPEN";
  };
  readonly lifecycle: {
    readonly permanentQlId: null;
    readonly reviewStatus: "UNREVIEWED_DISCOVERY";
    readonly questionBankStatus: "NOT_STORED";
    readonly testEligibility: "INELIGIBLE";
    readonly publiclyPublishable: false;
    readonly questionStudioDiscoverable: false;
  };
};
