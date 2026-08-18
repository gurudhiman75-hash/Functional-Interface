import type {
  WorCheckpointId,
  WorPermanentQlId,
  WorSourceEvidenceStatus,
} from "./foundation/types";

export const WOR_001_PERMANENT_QL_IDS = [
  "WOR-QL-001",
  "WOR-QL-002",
  "WOR-QL-003",
  "WOR-QL-004",
  "WOR-QL-005",
  "WOR-QL-006",
  "WOR-QL-007",
  "WOR-QL-008",
] as const satisfies readonly WorPermanentQlId[];

export interface WorPermanentQlRegistryEntry {
  readonly permanentQlId: WorPermanentQlId;
  readonly chapterId: "WOR-001";
  readonly checkpointId: WorCheckpointId;
  readonly rootPrototypeId: string;
  readonly mappedPrototypeIds: readonly string[];
  readonly title: string;
  readonly solveContract: string;
  readonly answerSemantic: string;
  readonly sourceEvidenceStatus: WorSourceEvidenceStatus;
  readonly allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE";
  readonly editorialStatus: "HUMAN_CONTENT_REVIEW_PENDING";
  readonly nativeHumanSignoffStatus: "PENDING";
  readonly active: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly mockTestEligible: false;
  readonly publiclyPublishable: false;
}

const ROOTS: readonly Omit<
  WorPermanentQlRegistryEntry,
  | "allocationStatus"
  | "editorialStatus"
  | "nativeHumanSignoffStatus"
  | "active"
  | "questionBankWritable"
  | "testEligible"
  | "mockTestEligible"
  | "publiclyPublishable"
>[] = [
  {
    permanentQlId: "WOR-QL-001",
    chapterId: "WOR-001",
    checkpointId: "WOR-CP-001",
    rootPrototypeId: "WOR-PROT-001",
    mappedPrototypeIds: ["WOR-PROT-001", "WOR-PROT-002", "WOR-PROT-016"],
    title: "Complete dictionary order",
    solveContract: "Arrange all displayed words in the requested normal or reverse dictionary order.",
    answerSemantic: "ORDERED_WORD_SEQUENCE",
    sourceEvidenceStatus: "PYQ_SUPPORTED",
  },
  {
    permanentQlId: "WOR-QL-002",
    chapterId: "WOR-001",
    checkpointId: "WOR-CP-001",
    rootPrototypeId: "WOR-PROT-003",
    mappedPrototypeIds: ["WOR-PROT-003", "WOR-PROT-004"],
    title: "Endpoint after dictionary ordering",
    solveContract: "Order the displayed words and select the first or last word as requested.",
    answerSemantic: "WORD",
    sourceEvidenceStatus: "PYQ_SUPPORTED",
  },
  {
    permanentQlId: "WOR-QL-003",
    chapterId: "WOR-001",
    checkpointId: "WOR-CP-002",
    rootPrototypeId: "WOR-PROT-005",
    mappedPrototypeIds: ["WOR-PROT-005", "WOR-PROT-009", "WOR-PROT-017", "WOR-PROT-020"],
    title: "Word or cluster at a specified position",
    solveContract: "Dictionary-sort the words or letter clusters and select the item at the requested ordinal position.",
    answerSemantic: "WORD_OR_CLUSTER",
    sourceEvidenceStatus: "PYQ_SUPPORTED",
  },
  {
    permanentQlId: "WOR-QL-004",
    chapterId: "WOR-001",
    checkpointId: "WOR-CP-002",
    rootPrototypeId: "WOR-PROT-006",
    mappedPrototypeIds: ["WOR-PROT-006", "WOR-PROT-018"],
    title: "Position of a specified word",
    solveContract: "Dictionary-sort the words and report the rank occupied by the specified word.",
    answerSemantic: "RANK",
    sourceEvidenceStatus: "PLATFORM_SUPPORTED",
  },
  {
    permanentQlId: "WOR-QL-005",
    chapterId: "WOR-001",
    checkpointId: "WOR-CP-005",
    rootPrototypeId: "WOR-PROT-021",
    mappedPrototypeIds: ["WOR-PROT-021"],
    title: "Sort, concatenate and query a global character",
    solveContract: "Dictionary-sort the clusters, concatenate them without spaces and select the requested global character.",
    answerSemantic: "LETTER",
    sourceEvidenceStatus: "PYQ_SUPPORTED",
  },
  {
    permanentQlId: "WOR-QL-006",
    chapterId: "WOR-001",
    checkpointId: "WOR-CP-005",
    rootPrototypeId: "WOR-PROT-022",
    mappedPrototypeIds: ["WOR-PROT-022"],
    title: "Sort, select a ranked cluster and query a local character",
    solveContract: "Dictionary-sort the clusters, select the requested ranked cluster and derive its requested local character, including an explicit alphabet offset when present.",
    answerSemantic: "LETTER",
    sourceEvidenceStatus: "PYQ_SUPPORTED",
  },
  {
    permanentQlId: "WOR-QL-007",
    chapterId: "WOR-001",
    checkpointId: "WOR-CP-005",
    rootPrototypeId: "WOR-PROT-023",
    mappedPrototypeIds: ["WOR-PROT-023"],
    title: "Transform each cluster, sort and query a position",
    solveContract: "Apply the explicitly stated transformation to every cluster, dictionary-sort the results and select the requested original or transformed cluster.",
    answerSemantic: "WORD_OR_CLUSTER",
    sourceEvidenceStatus: "PYQ_SUPPORTED",
  },
  {
    permanentQlId: "WOR-QL-008",
    chapterId: "WOR-001",
    checkpointId: "WOR-CP-005",
    rootPrototypeId: "WOR-PROT-024",
    mappedPrototypeIds: ["WOR-PROT-024"],
    title: "Transform each cluster, sort and query a local character",
    solveContract: "Apply the stated transformation to every cluster, dictionary-sort the transformed clusters and select the requested character from the ranked result.",
    answerSemantic: "LETTER",
    sourceEvidenceStatus: "PYQ_SUPPORTED",
  },
];

export const WOR_001_PERMANENT_QL_REGISTRY: readonly WorPermanentQlRegistryEntry[] = ROOTS.map((entry) => Object.freeze({
  ...entry,
  allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE" as const,
  editorialStatus: "HUMAN_CONTENT_REVIEW_PENDING" as const,
  nativeHumanSignoffStatus: "PENDING" as const,
  active: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
}));

const PROTOTYPE_TO_QL = new Map<string, WorPermanentQlId>();
for (const entry of WOR_001_PERMANENT_QL_REGISTRY) {
  for (const prototypeId of entry.mappedPrototypeIds) {
    if (PROTOTYPE_TO_QL.has(prototypeId)) {
      throw new Error(`WOR-001 permanent QL mapping duplicates prototype ${prototypeId}.`);
    }
    PROTOTYPE_TO_QL.set(prototypeId, entry.permanentQlId);
  }
}

export const WOR_001_SOURCE_DEFERRED_PROTOTYPE_IDS = [
  "WOR-PROT-007",
  "WOR-PROT-008",
  "WOR-PROT-010",
  "WOR-PROT-011",
  "WOR-PROT-012",
  "WOR-PROT-013",
  "WOR-PROT-014",
  "WOR-PROT-015",
  "WOR-PROT-019",
] as const;

export function worPermanentQlIdForPrototype(prototypeId: string): WorPermanentQlId | null {
  return PROTOTYPE_TO_QL.get(prototypeId) ?? null;
}

export function worPermanentQlById(permanentQlId: WorPermanentQlId): WorPermanentQlRegistryEntry {
  const found = WOR_001_PERMANENT_QL_REGISTRY.find((entry) => entry.permanentQlId === permanentQlId);
  if (!found) throw new Error(`Unknown WOR-001 permanent QL: ${permanentQlId}`);
  return found;
}
