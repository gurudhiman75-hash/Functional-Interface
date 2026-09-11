export const CAE_QL_IDS = [
  "CAE-QL-001",
  "CAE-QL-002",
  "CAE-QL-003",
  "CAE-QL-004",
  "CAE-QL-005",
  "CAE-QL-006",
  "CAE-QL-007",
  "CAE-QL-008",
  "CAE-QL-009",
] as const;

export const CAE_CHECKPOINT_IDS = [
  "CAE-CP-001",
  "CAE-CP-002",
  "CAE-CP-003",
  "CAE-CP-004",
  "CAE-CP-005",
  "CAE-CP-006",
  "CAE-CP-007",
  "CAE-CP-008",
  "CAE-CP-009",
  "CAE-CP-010",
] as const;

export type CaeQlId = (typeof CAE_QL_IDS)[number];
export type CaeCheckpointId = (typeof CAE_CHECKPOINT_IDS)[number];
export type CaeLocale = "en-IN" | "hi-IN" | "pa-IN";
export type CaeDifficulty = "EASY" | "MEDIUM" | "HARD";
export type CaeQuestionProfile = "FOUR_WAY" | "FIVE_WAY";
export type LocalizedText = Readonly<Record<CaeLocale, string>>;

export type CaeNodeRole = "CAUSE" | "INTERMEDIATE" | "EFFECT" | "CONTEXT";
export type CaeNode = Readonly<{
  id: string;
  role: CaeNodeRole;
  temporalOrder: number;
  text: LocalizedText;
}>;

export type CaeCausalEdge = Readonly<{
  from: string;
  to: string;
  strength: "PRIMARY" | "CONTRIBUTING";
}>;

/** A complete, locale-neutral causal state from which questions are projected. */
export type CaeCausalWorld = Readonly<{
  id: string;
  domain: "TRANSPORT" | "WEATHER" | "INFRASTRUCTURE" | "UTILITIES" | "EDUCATION" | "RETAIL" | "MANUFACTURING";
  difficultyCeiling: CaeDifficulty;
  context: LocalizedText;
  nodes: readonly CaeNode[];
  edges: readonly CaeCausalEdge[];
  sourceMode: "CURATED_ORIGINAL_SCENARIO";
}>;

export type CaeProjectionKind =
  | "DIRECT_RELATIONSHIP"
  | "COMMON_OR_INDEPENDENT"
  | "PROBABLE_CAUSE"
  | "PROBABLE_EFFECT"
  | "COMPETING_EXPLANATION"
  | "INDIRECT_CAUSAL_CHAIN"
  | "CORRELATION_CHECK"
  | "MULTI_EVENT_SEQUENCE"
  | "MISSING_CAUSAL_LINK";

export type CaeRelationship =
  | "FIRST_DIRECT_CAUSES_SECOND"
  | "SECOND_DIRECT_CAUSES_FIRST"
  | "INDEPENDENT_CAUSES"
  | "INDEPENDENT_EFFECTS"
  | "COMMON_CAUSE"
  | "INDIRECT_FIRST_CAUSES_SECOND"
  | "INDIRECT_SECOND_CAUSES_FIRST"
  | "NO_CAUSAL_LINK";

export type CaeDistractorRole =
  | "REVERSE_CAUSATION"
  | "CORRELATION"
  | "TEMPORAL_VIOLATION"
  | "WEAK_CAUSE"
  | "WRONG_SCOPE"
  | "UNRELATED_EVENT"
  | "COMMON_CAUSE_CONFUSION"
  | "INDIRECTNESS_CONFUSION"
  | "OVERGENERALISATION";

/**
 * A task declaration exposes selected nodes from one causal world. Candidate
 * node IDs may come from another world only as explicitly tagged distractors.
 */
export type CaeProjectionAuthority = Readonly<{
  id: string;
  checkpointId: Exclude<CaeCheckpointId, "CAE-CP-010">;
  qlId: CaeQlId;
  kind: CaeProjectionKind;
  worldId: string;
  difficulty: CaeDifficulty;
  displayedNodeIds: readonly string[];
  targetNodeId?: string;
  candidateNodeIds?: readonly string[];
  correctNodeId?: string;
  sequenceNodeIds?: readonly string[];
  missingLinkNodeId?: string;
  distractorRoles?: Readonly<Record<string, CaeDistractorRole>>;
  expectedRelationship?: CaeRelationship;
}>;

export type CaeRenderedOption = Readonly<{
  id: string;
  text: string;
  isCorrect: boolean;
  distractorRole?: CaeDistractorRole;
}>;

export type GeneratedCaeQuestion = Readonly<{
  chapterId: "CAE-001";
  checkpointId: Exclude<CaeCheckpointId, "CAE-CP-010">;
  qlId: CaeQlId;
  projectionId: string;
  causalWorldId: string;
  locale: CaeLocale;
  seed: number;
  difficulty: CaeDifficulty;
  questionProfile: CaeQuestionProfile | null;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  answerId: string;
  explanation: string;
  causalTrace: readonly string[];
  optionMetadata: readonly CaeRenderedOption[];
  metadata: Readonly<{
    solver: "CAE_CAUSAL_WORLD_SOLVER_V2";
    sourceMode: "CURATED_ORIGINAL_SCENARIO";
    reviewOnly: true;
    questionBankWritable: false;
    testEligible: false;
    mockEligible: false;
    publicEligible: false;
  }>;
}>;
