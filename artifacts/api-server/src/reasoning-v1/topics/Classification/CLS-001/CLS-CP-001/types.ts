export type ClassificationTask = "FIND_OUTLIER" | "SELECT_CLASS_MEMBER";

export type PrototypeId =
  | "CLS-CP001-PROT-001"
  | "CLS-CP001-PROT-002"
  | "CLS-CP001-PROT-003"
  | "CLS-CP001-PROT-004";

export type PrototypeFamily =
  | "DIRECT_CATEGORY"
  | "FUNCTIONAL_USE"
  | "PART_WHOLE"
  | "INVERSE_CLASS_MEMBER";

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type SurfaceKind = "COMMON_NOUN" | "PROPER_NOUN" | "UNIT_TERM";

export type SemanticEntity = {
  readonly entityId: string;
  readonly label: string;
  readonly classIds: readonly string[];
  readonly aliases?: readonly string[];
};

export type SemanticClass = {
  readonly classId: string;
  readonly label: string;
  readonly family: Exclude<PrototypeFamily, "INVERSE_CLASS_MEMBER">;
  readonly contrastGroup: string;
  readonly surfaceKind: SurfaceKind;
  readonly qualityRank: number;
  readonly memberEntityIds: readonly string[];
  readonly explanation: string;
  readonly shortcut: string;
  readonly trap: string;
};

export type PrototypeDefinition = {
  readonly prototypeId: PrototypeId;
  readonly family: PrototypeFamily;
  readonly task: ClassificationTask;
  readonly title: string;
  readonly eligibleClassIds: readonly string[];
};

export type RuleSupport = {
  readonly classId: string;
  readonly supportCount: number;
  readonly matchingIndices: readonly number[];
  readonly outlierIndex: number | null;
  readonly qualityRank: number;
};

export type AmbiguityAudit = {
  readonly result: "UNIQUE" | "AMBIGUOUS" | "NO_VALID_RULE";
  readonly winningClassId: string | null;
  readonly winningOutlierIndex: number | null;
  readonly supports: readonly RuleSupport[];
};

export type Explanation = {
  readonly coreRule: readonly string[];
  readonly optionChecks: readonly string[];
  readonly examSpeedShortcut: readonly string[];
  readonly commonTraps: readonly string[];
};

export type Lifecycle = {
  readonly permanentQlId: null;
  readonly reviewStatus: "UNREVIEWED_DISCOVERY";
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
  readonly questionStudioDiscoverable: false;
};

export type GeneratedClassificationQuestion = {
  readonly chapterId: "CLS-001";
  readonly checkpointId: "CLS-CP-001";
  readonly prototypeId: PrototypeId;
  readonly seed: number;
  readonly task: ClassificationTask;
  readonly family: PrototypeFamily;
  readonly difficulty: Difficulty;
  readonly intendedClassId: string;
  readonly intendedClassLabel: string;
  readonly stem: string;
  readonly givens: readonly string[];
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly evidenceByOption: readonly string[];
  readonly ambiguityAudit: AmbiguityAudit;
  readonly explanation: Explanation;
  readonly metadata: {
    readonly datasetVersion: "CLS-CP001-SEMANTIC-EN-v1";
    readonly locale: "en-IN";
    readonly renderer: "TEXT";
    readonly independentSolverVerified: true;
  };
  readonly lifecycle: Lifecycle;
};
