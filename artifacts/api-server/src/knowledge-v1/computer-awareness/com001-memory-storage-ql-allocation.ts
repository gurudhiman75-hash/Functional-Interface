import { auditCom001QlAllocationReadiness } from "./com001-ql-allocation-readiness";

export type Com001PermanentQlAllocation = {
  qlId: string;
  cpId: "COM-001-CP-001";
  sourceDecisionId: string;
  name: string;
  learnerTask: string;
  solveAuthority:
    | "CANONICAL_FACT_RELATION"
    | "ORDERED_HIERARCHY"
    | "STORAGE_PROFILE_CONSTRAINTS"
    | "MULTI_FACT_COMPOSITION";
  relationFamilies: string[];
  runtimeStatus: "ALLOCATED_NOT_REGISTERED";
};

export const COM001_CP_001 = {
  cpId: "COM-001-CP-001" as const,
  chapterId: "COM-001" as const,
  name: "Memory & Storage",
  runtimeStatus: "ALLOCATED_NOT_REGISTERED" as const,
};

/**
 * Permanent QL allocation is taxonomy-only at this checkpoint.
 *
 * It does NOT approve candidate facts, register a Question Studio package,
 * enable student publication, or make held discovery tasks production-ready.
 */
export const COM001_MEMORY_STORAGE_QLS: Com001PermanentQlAllocation[] = [
  {
    qlId: "COM-001-QL-001",
    cpId: "COM-001-CP-001",
    sourceDecisionId: "MS-001",
    name: "Memory Volatility & Data Retention",
    learnerTask: "Recognize or infer memory volatility/data-retention class",
    solveAuthority: "CANONICAL_FACT_RELATION",
    relationFamilies: ["has_volatility"],
    runtimeStatus: "ALLOCATED_NOT_REGISTERED",
  },
  {
    qlId: "COM-001-QL-002",
    cpId: "COM-001-CP-001",
    sourceDecisionId: "MS-002",
    name: "Memory & Storage Layer Classification",
    learnerTask: "Classify or infer memory/storage hierarchy layer",
    solveAuthority: "CANONICAL_FACT_RELATION",
    relationFamilies: ["classified_as_memory_layer"],
    runtimeStatus: "ALLOCATED_NOT_REGISTERED",
  },
  {
    qlId: "COM-001-QL-003",
    cpId: "COM-001-CP-001",
    sourceDecisionId: "MS-003",
    name: "Memory & Storage Function Mapping",
    learnerTask: "Map memory/storage components to defining functions and vice versa",
    solveAuthority: "CANONICAL_FACT_RELATION",
    relationFamilies: ["has_primary_function"],
    runtimeStatus: "ALLOCATED_NOT_REGISTERED",
  },
  {
    qlId: "COM-001-QL-004",
    cpId: "COM-001-CP-001",
    sourceDecisionId: "MS-004",
    name: "Memory & Storage Subtype Discrimination",
    learnerTask: "Discriminate memory subtypes by family or defining technology property",
    solveAuthority: "CANONICAL_FACT_RELATION",
    relationFamilies: ["is_subtype_of"],
    runtimeStatus: "ALLOCATED_NOT_REGISTERED",
  },
  {
    qlId: "COM-001-QL-005",
    cpId: "COM-001-CP-001",
    sourceDecisionId: "MS-005",
    name: "Storage Medium & Technology Classification",
    learnerTask: "Classify storage devices by storage medium/technology and infer device from medium",
    solveAuthority: "CANONICAL_FACT_RELATION",
    relationFamilies: ["uses_storage_medium"],
    runtimeStatus: "ALLOCATED_NOT_REGISTERED",
  },
  {
    qlId: "COM-001-QL-006",
    cpId: "COM-001-CP-001",
    sourceDecisionId: "MS-006",
    name: "Broad Memory Hierarchy Ordering",
    learnerTask: "Use the broad memory hierarchy to compare/order access speed or proximity",
    solveAuthority: "ORDERED_HIERARCHY",
    relationFamilies: ["memory_hierarchy_rank"],
    runtimeStatus: "ALLOCATED_NOT_REGISTERED",
  },
  {
    qlId: "COM-001-QL-007",
    cpId: "COM-001-CP-001",
    sourceDecisionId: "MS-009",
    name: "Backup Device Constraint Selection",
    learnerTask: "Select a storage/backup device from operational backup characteristics",
    solveAuthority: "STORAGE_PROFILE_CONSTRAINTS",
    relationFamilies: ["storage_profile_constraints"],
    runtimeStatus: "ALLOCATED_NOT_REGISTERED",
  },
  {
    qlId: "COM-001-QL-008",
    cpId: "COM-001-CP-001",
    sourceDecisionId: "MS-012",
    name: "Memory & Storage Multi-Statement Evaluation",
    learnerTask: "Evaluate a composition of multiple independent memory/storage facts",
    solveAuthority: "MULTI_FACT_COMPOSITION",
    relationFamilies: ["multi_fact_composition"],
    runtimeStatus: "ALLOCATED_NOT_REGISTERED",
  },
  {
    qlId: "COM-001-QL-009",
    cpId: "COM-001-CP-001",
    sourceDecisionId: "MS-015",
    name: "Computer Data Capacity Units",
    learnerTask: "Use canonical computer data-capacity units and relationships",
    solveAuthority: "CANONICAL_FACT_RELATION",
    relationFamilies: ["capacity_unit_relation"],
    runtimeStatus: "ALLOCATED_NOT_REGISTERED",
  },
];

export const COM001_HELD_DISCOVERY_TASKS = [
  "MS-007", // pairwise technology/property comparison split product remains held
  "MS-008", // standalone access-method QL lacks sufficient evidence
  "MS-010", // abbreviation expansion remains a corpus/support surface, not a frozen QL
  "MS-011", // simple correct/incorrect wording is a realizer surface
  "MS-013", // matching awaits evidence + matching verifier
  "MS-014", // virtual memory awaits target-exam evidence
] as const;

export function auditCom001PermanentQlAllocation() {
  const issues: string[] = [];
  const readiness = auditCom001QlAllocationReadiness();
  if (!readiness.ready) {
    issues.push(...readiness.issues.map((issue) => `READINESS:${issue}`));
  }

  const qlIds = new Set<string>();
  const decisionIds = new Set<string>();
  for (const ql of COM001_MEMORY_STORAGE_QLS) {
    if (qlIds.has(ql.qlId)) issues.push(`DUPLICATE_QL_ID:${ql.qlId}`);
    qlIds.add(ql.qlId);
    if (decisionIds.has(ql.sourceDecisionId)) {
      issues.push(`DUPLICATE_DECISION_ALLOCATION:${ql.sourceDecisionId}`);
    }
    decisionIds.add(ql.sourceDecisionId);
    if (ql.cpId !== COM001_CP_001.cpId) issues.push(`CP_MISMATCH:${ql.qlId}`);
    if (ql.runtimeStatus !== "ALLOCATED_NOT_REGISTERED") {
      issues.push(`RUNTIME_STATUS_OPEN:${ql.qlId}`);
    }
  }

  const expectedQlIds = Array.from(
    { length: 9 },
    (_, index) => `COM-001-QL-${String(index + 1).padStart(3, "0")}`,
  );
  if ([...qlIds].join("|") !== expectedQlIds.join("|")) {
    issues.push(`NON_CONTIGUOUS_QL_IDS:${[...qlIds].join(",")}`);
  }

  for (const decisionId of readiness.provisionalDecisionIds) {
    if (!decisionIds.has(decisionId)) {
      issues.push(`UNALLOCATED_READY_DECISION:${decisionId}`);
    }
  }

  for (const heldDecisionId of COM001_HELD_DISCOVERY_TASKS) {
    if (decisionIds.has(heldDecisionId)) {
      issues.push(`HELD_TASK_WAS_ALLOCATED:${heldDecisionId}`);
    }
  }

  return {
    valid: issues.length === 0,
    cpId: COM001_CP_001.cpId,
    qlCount: COM001_MEMORY_STORAGE_QLS.length,
    qlIds: COM001_MEMORY_STORAGE_QLS.map((entry) => entry.qlId),
    heldDiscoveryTasks: [...COM001_HELD_DISCOVERY_TASKS],
    runtimeRegistered: false,
    factsApproved: false,
    issues,
  };
}
