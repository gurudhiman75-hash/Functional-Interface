export type ClassificationTask =
  | "FIND_OUTLIER"
  | "SELECT_CLASS_MEMBER"
  | "SELECT_COHERENT_GROUP";

export type PrototypeId =
  | "CLS-CP001-PROT-001"
  | "CLS-CP001-PROT-002"
  | "CLS-CP001-PROT-003"
  | "CLS-CP001-PROT-004"
  | "CLS-CP001-PROT-005"
  | "CLS-CP001-PROT-006"
  | "CLS-CP001-PROT-007"
  | "CLS-CP001-PROT-008";

export type PrototypeFamily =
  | "DIRECT_CATEGORY"
  | "FUNCTIONAL_USE"
  | "PART_WHOLE"
  | "HIERARCHY_CATEGORY"
  | "CROSS_CUTTING_CATEGORY"
  | "INVERSE_CLASS_MEMBER";

export type GenerationProfile =
  | "CLEAN_SIBLING"
  | "HIERARCHY_SIBLING"
  | "CROSS_CUTTING"
  | "CLASS_MEMBER"
  | "HIERARCHY_CLASS_MEMBER"
  | "COHERENT_GROUP";

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type SurfaceKind = "COMMON_NOUN" | "PROPER_NOUN" | "UNIT_TERM";

export type FactRisk = "LOW" | "MEDIUM";

export type DifficultyFeatures = {
  readonly hierarchyDepth: number;
  readonly allItemsShareParent: boolean;
  readonly multiMembershipItemCount: number;
  readonly candidateRuleCount: number;
  readonly inverseTask: boolean;
  readonly crossCutting: boolean;
  readonly semanticDemand: 0 | 1 | 2;
  readonly optionCount: 4 | 5;
  readonly score: number;
};

export type SemanticEntity = {
  readonly entityId: string;
  readonly label: string;
  readonly directClassIds: readonly string[];
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
  readonly hierarchyDepth: number;
  readonly parentClassIds: readonly string[];
  readonly memberEntityIds: readonly string[];
  readonly directMemberEntityIds: readonly string[];
  readonly factRisk: FactRisk;
  readonly explanation: string;
  readonly shortcut: string;
  readonly trap: string;
};

export type PrototypeDefinition = {
  readonly prototypeId: PrototypeId;
  readonly family: PrototypeFamily;
  readonly generationProfile: GenerationProfile;
  readonly task: ClassificationTask;
  readonly title: string;
  readonly intendedClassIds: readonly string[];
  readonly eligibleClassIds: readonly string[];
};

export type RuleSupport = {
  readonly classId: string;
  readonly supportCount: number;
  readonly matchingIndices: readonly number[];
  readonly outlierIndex: number | null;
  readonly qualityRank: number;
  readonly hierarchyDepth: number;
};

export type AmbiguityAudit = {
  readonly result: "UNIQUE" | "AMBIGUOUS" | "NO_VALID_RULE";
  readonly winningClassId: string | null;
  readonly winningOutlierIndex: number | null;
  readonly competingClassIds: readonly string[];
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
  readonly generationProfile: GenerationProfile;
  readonly difficulty: Difficulty;
  readonly difficultyFeatures: DifficultyFeatures;
  readonly intendedClassId: string;
  readonly intendedClassLabel: string;
  readonly stem: string;
  readonly givens: readonly string[];
  readonly options: readonly string[];
  readonly optionGroups: readonly (readonly string[])[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly evidenceByOption: readonly string[];
  readonly ambiguityAudit: AmbiguityAudit;
  readonly explanation: Explanation;
  readonly metadata: {
    readonly datasetVersion: "CLS-CP001-SEMANTIC-EN-v2";
    readonly locale: "en-IN";
    readonly renderer: "TEXT";
    readonly independentSolverVerified: true;
    readonly hierarchyAware: true;
    readonly multiMembershipAware: true;
    readonly difficultyModel: "CLS-CP001-INSTANCE-DIFFICULTY-v1";
  };
  readonly lifecycle: Lifecycle;
};
