export type ClsCp007PairPrototypeId = "CLS-CP007-PAIR-PROT-001";

export type ClsCp007PairRuleId =
  | "CLUSTER_PAIR_POSITION_SUM_VECTOR"
  | "CLUSTER_PAIR_OPPOSITE_TRANSFORM_STATUS"
  | "CLUSTER_PAIR_SIGNED_SHIFT_VECTOR"
  | "CLUSTER_PAIR_ABSOLUTE_SHIFT_VECTOR"
  | "CLUSTER_PAIR_DIRECT_REVERSAL_STATUS"
  | "CLUSTER_PAIR_REVERSED_OPPOSITE_STATUS"
  | "CLUSTER_PAIR_VOWEL_COUNT_SIGNATURE"
  | "CLUSTER_PAIR_REPEAT_TOPOLOGY_SIGNATURE";

export type ClsCp007PairTask = "FIND_ODD_LETTER_CLUSTER_PAIR";
export type ClsCp007PairDifficulty = "MEDIUM" | "HARD";
export type ClsCp007PairAuditResult = "UNIQUE" | "AMBIGUOUS" | "NO_VALID_RULE";

export type ClsCp007PairItem = {
  readonly kind: "LETTER_CLUSTER_PAIR";
  readonly left: readonly string[];
  readonly right: readonly string[];
};

export type ClsCp007PairRuleSupport = {
  readonly ruleId: ClsCp007PairRuleId;
  readonly commonValue: string;
  readonly outlierValue: string;
  readonly matchingOptionIndexes: readonly number[];
  readonly answerIndex: number;
};

export type ClsCp007PairAmbiguityAudit = {
  readonly result: ClsCp007PairAuditResult;
  readonly answerIndex: number | null;
  readonly intendedRuleSupported: boolean;
  readonly candidateSupports: readonly ClsCp007PairRuleSupport[];
  readonly reason: string;
};

export type GeneratedClsCp007PairQuestion = {
  readonly checkpointId: "CLS-CP-007";
  readonly prototypeId: ClsCp007PairPrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly task: ClsCp007PairTask;
  readonly clusterLength: 3;
  readonly stem: string;
  readonly items: readonly ClsCp007PairItem[];
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly intendedRuleId: "CLUSTER_PAIR_OPPOSITE_TRANSFORM_STATUS";
  readonly intendedRuleValue: "MATCH";
  readonly evidenceByOption: readonly string[];
  readonly ambiguityAudit: ClsCp007PairAmbiguityAudit;
  readonly difficulty: ClsCp007PairDifficulty;
  readonly explanation: {
    readonly coreConcept: readonly string[];
    readonly stepByStep: readonly string[];
    readonly examSpeedShortcut: readonly string[];
    readonly commonTrapWarning: readonly string[];
  };
  readonly reviewOnly: true;
  readonly questionStudioVisible: false;
  readonly qualityDiagnostics: {
    readonly nuisanceKey: string;
    readonly changedIndexes: readonly [number, number];
    readonly correspondingTotals: readonly [number, number, number];
    readonly commonPoolAttempt: number;
    readonly outlierAttempt: number;
  };
  readonly metadata: {
    readonly datasetVersion: "CLS-CP007-CLUSTER-PAIR-DOMAIN-v1";
    readonly runtimeVersion: "cls-cp007-cluster-pair-discovery-v1";
    readonly locale: "en-IN";
    readonly optionCount: 4 | 5;
    readonly sourcePrototypeSeed: number;
    readonly sourceSaturationStatus: "CLUSTER_PAIR_WAVE_1_EXECUTABLE__GAP_AUDIT_OPEN";
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
