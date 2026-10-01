export const VEN_001_PERMANENT_QLS = Object.freeze([
  {
    qlId: "VEN-QL-001",
    learnerContract: "Select the Venn topology that represents the stated relationship among two or three sets.",
    operations: ["RELATIONS_TO_DIAGRAM"],
    checkpoints: ["VEN-CP001", "VEN-CP002"],
  },
  {
    qlId: "VEN-QL-002",
    learnerContract: "Select the Venn diagram that represents the stated real-world category relationship.",
    operations: ["CATEGORIES_TO_DIAGRAM"],
    checkpoints: ["VEN-CP003"],
  },
  {
    qlId: "VEN-QL-003",
    learnerContract: "Identify the category set that matches a shown Venn diagram.",
    operations: ["DIAGRAM_TO_CATEGORIES"],
    checkpoints: ["VEN-CP003"],
  },
  {
    qlId: "VEN-QL-004",
    learnerContract: "Identify the numbered Venn region that satisfies the stated membership condition.",
    operations: ["REGION_IDENTIFICATION"],
    checkpoints: ["VEN-CP004"],
  },
  {
    qlId: "VEN-QL-005",
    learnerContract: "Find a required set or region count from two-set or three-set Venn data.",
    operations: ["SET_COUNT"],
    checkpoints: ["VEN-CP005", "VEN-CP006"],
  },
  {
    qlId: "VEN-QL-006",
    learnerContract: "Find a percentage or ratio from Venn-set counts.",
    operations: ["PERCENTAGE_RATIO"],
    checkpoints: ["VEN-CP007"],
  },
  {
    qlId: "VEN-QL-007",
    learnerContract: "Solve for an unknown Venn region or set value from the supplied totals and overlaps.",
    operations: ["SOLVE_UNKNOWN"],
    checkpoints: ["VEN-CP008"],
  },
  {
    qlId: "VEN-QL-008",
    learnerContract: "Answer one or more count questions from a shared Venn caselet.",
    operations: ["CASELET_COUNT"],
    checkpoints: ["VEN-CP009"],
  },
  {
    qlId: "VEN-QL-009",
    learnerContract: "Determine a valid overlap bound or range from partial set information.",
    operations: ["OVERLAP_BOUNDS"],
    checkpoints: ["VEN-CP010"],
  },
  {
    qlId: "VEN-QL-010",
    learnerContract: "Count or identify regions in a geometric Venn arrangement.",
    operations: ["GEOMETRIC_REGION_COUNT"],
    checkpoints: ["VEN-CP011"],
  },
] as const);

export type Ven001PermanentQlId = (typeof VEN_001_PERMANENT_QLS)[number]["qlId"];
export type Ven001Operation = (typeof VEN_001_PERMANENT_QLS)[number]["operations"][number];

const QL_BY_OPERATION = new Map<string, Ven001PermanentQlId>(
  VEN_001_PERMANENT_QLS.flatMap((entry) => entry.operations.map((operation) => [operation, entry.qlId] as const)),
);

export function ven001QlForOperation(operation: string): Ven001PermanentQlId {
  const qlId = QL_BY_OPERATION.get(operation);
  if (!qlId) throw new Error(`VEN-001 has no permanent QL for operation '${operation}'.`);
  return qlId;
}

export const VEN_001_PERMANENT_QL_AUTHORITY = Object.freeze({
  authorityId: "VEN_001_PERMANENT_QL_REGISTRY_V1",
  chapterId: "VEN-001",
  permanentQlCount: VEN_001_PERMANENT_QLS.length,
  nextPermanentQlId: "VEN-QL-011",
  allocationRule: "LEARNER_CONTRACT_NOT_CHECKPOINT_COUNT",
  cp005Cp006MergedByContract: true,
  sourceState: "LIVE_GENERATOR_OPERATION_SURFACE",
  lifecycle: "REVIEW_ONLY",
});
