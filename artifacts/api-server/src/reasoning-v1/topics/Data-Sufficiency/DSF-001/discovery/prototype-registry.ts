export type DsDiscoveryDomainFamily = "QUANT" | "REASONING";
export type DsDiscoveryStatus = "EXECUTABLE_PROTOTYPE" | "EXISTING_RUNTIME_TO_AUDIT" | "PROTOTYPE_REQUIRED" | "DEFERRED";

export interface DsDiscoveryPrototype {
  readonly prototypeId: string;
  readonly domainFamily: DsDiscoveryDomainFamily;
  readonly sourceChapter: string;
  readonly sourcePath?: string;
  readonly targetKinds: readonly string[];
  readonly status: DsDiscoveryStatus;
  readonly permanentQlId: null;
  readonly notes: string;
}

/**
 * CP-000 is discovery-only. These IDs are disposable prototype identities and
 * must never be exposed as learner/question-bank QL identities.
 */
export const DSF_DISCOVERY_PROTOTYPES: readonly DsDiscoveryPrototype[] = [
  {
    prototypeId: "DSF-PROT-001",
    domainFamily: "QUANT",
    sourceChapter: "Number System",
    sourcePath: "quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-001/foundation/divisibility.ts",
    targetKinds: ["MISSING_DIGIT", "DIGIT_PARITY", "DIVISIBILITY_PROPERTY", "REMAINDER", "COUNT"],
    status: "EXECUTABLE_PROTOTYPE",
    permanentQlId: null,
    notes: "Executable adapter now reuses NUM-001 divisibility helpers and routes all sufficiency truth through the shared DSF target-projection evaluator.",
  },
  {
    prototypeId: "DSF-PROT-002",
    domainFamily: "QUANT",
    sourceChapter: "Time and Work",
    sourcePath: "quant-v4/topics/Arithmetic/subtopics/TimeAndWork/TMW-001/foundation/cp013-data-sufficiency-runtime.ts",
    targetKinds: ["TIME", "RATE", "EFFICIENCY_RELATION"],
    status: "EXISTING_RUNTIME_TO_AUDIT",
    permanentQlId: null,
    notes: "Existing TMW DS runtime contains five-class answer semantics but must be upgraded to shared target-projection proof contracts.",
  },
  {
    prototypeId: "DSF-PROT-003",
    domainFamily: "QUANT",
    sourceChapter: "Simplification and Approximation",
    sourcePath: "quant-v4/topics/Arithmetic/subtopics/SimplificationAndApproximation/SAP-001/SAP-CP-006/runtime-wave3-v3.ts",
    targetKinds: ["INTEGER", "ARITHMETIC_EXPRESSION"],
    status: "EXISTING_RUNTIME_TO_AUDIT",
    permanentQlId: null,
    notes: "Existing SAP prototype uses candidate sets but only four DS classes; shared DSF semantics must preserve the missing EACH_STATEMENT_ALONE class.",
  },
  {
    prototypeId: "DSF-PROT-004",
    domainFamily: "QUANT",
    sourceChapter: "Algebra",
    targetKinds: ["SCALAR", "BOOLEAN", "FUNCTION_OF_VARIABLES"],
    status: "PROTOTYPE_REQUIRED",
    permanentQlId: null,
    notes: "Must prove that a target can be unique while the complete variable assignment is not unique.",
  },
  {
    prototypeId: "DSF-PROT-005",
    domainFamily: "REASONING",
    sourceChapter: "Ranking and Order",
    targetKinds: ["RANK", "COUNT", "RELATIVE_ORDER"],
    status: "PROTOTYPE_REQUIRED",
    permanentQlId: null,
    notes: "Finite-world adapter should reuse ranking constraints and project only the asked rank/order fact.",
  },
  {
    prototypeId: "DSF-PROT-006",
    domainFamily: "REASONING",
    sourceChapter: "Direction and Distance",
    targetKinds: ["DIRECTION", "DISTANCE", "RELATIVE_POSITION"],
    status: "PROTOTYPE_REQUIRED",
    permanentQlId: null,
    notes: "Multiple paths may survive while the asked direction or displacement is uniquely fixed.",
  },
  {
    prototypeId: "DSF-PROT-007",
    domainFamily: "REASONING",
    sourceChapter: "Blood Relations",
    targetKinds: ["RELATION", "GENERATION", "GENDER"],
    status: "PROTOTYPE_REQUIRED",
    permanentQlId: null,
    notes: "Adapter must project the asked relation across every valid family graph without cultural assumptions.",
  },
  {
    prototypeId: "DSF-PROT-008",
    domainFamily: "REASONING",
    sourceChapter: "Seating Arrangement",
    targetKinds: ["IDENTITY", "POSITION", "NEIGHBOUR_RELATION"],
    status: "DEFERRED",
    permanentQlId: null,
    notes: "Deferred until simpler relational adapters prove target-projection semantics and seating solver reuse is stable.",
  },
];
