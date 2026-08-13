export type NumCp001SourceDispositionStatus =
  | "COVERED_BY_EXECUTABLE_PROTOTYPE"
  | "MERGE_AS_REPRESENTATION"
  | "REASSIGNED_TO_OTHER_OWNER"
  | "ADVANCED_ENRICHMENT_HOLD";

export interface NumCp001SourceDisposition {
  readonly family: string;
  readonly status: NumCp001SourceDispositionStatus;
  readonly prototypeIds: readonly string[];
  readonly owner: string;
  readonly rationale: string;
}

export const NUM_CP001_SOURCE_DISPOSITIONS = Object.freeze([
  { family: "smallest applicable number set", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-001"], owner: "NUM-CP-001", rationale: "direct set classification under explicit convention" },
  { family: "select item outside declared number set", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-009"], owner: "NUM-CP-001", rationale: "complement membership is executable" },
  { family: "zero one negative membership convention", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-002"], owner: "NUM-CP-001", rationale: "boundary membership and zero parity are explicit" },
  { family: "rational versus irrational compound expression", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-017"], owner: "NUM-CP-001", rationale: "source-safe exact radical simplification without representation conversion" },
  { family: "signed integer ordering", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-003"], owner: "NUM-CP-001", rationale: "negative-order misconception and exact ascending order are executable" },
  { family: "mixed exact integer rational ordering", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-018"], owner: "NUM-CP-001", rationale: "exact common-scale comparison avoids recurring or decimal conversion" },
  { family: "direct number-line distance", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-004"], owner: "NUM-CP-001", rationale: "absolute separation is executable across same-side and crossing-zero states" },
  { family: "inverse number-line distance", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-014"], owner: "NUM-CP-001", rationale: "two-candidate absolute-distance reconstruction is executable" },
  { family: "least or greatest integer under strict non-strict bound", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-010"], owner: "NUM-CP-001", rationale: "all bound direction topologies are executable" },
  { family: "integer count between exact rational bounds", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-011"], owner: "NUM-CP-001", rationale: "exact rational endpoints with bounded integer enumeration are executable" },
  { family: "open closed half-open integer interval count", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-005"], owner: "NUM-CP-001", rationale: "all four endpoint topologies are executable" },
  { family: "recover interval endpoint from count", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-012"], owner: "NUM-CP-001", rationale: "inverse interval cardinality is executable" },
  { family: "filtered positive negative even odd interval count", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-013"], owner: "NUM-CP-001", rationale: "sign and parity filters are executable" },
  { family: "empty singleton two-member multiple interval topology", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-019"], owner: "NUM-CP-001", rationale: "solution-cardinality topology is executable" },
  { family: "direct parity of sum product and power", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-006"], owner: "NUM-CP-001", rationale: "addition product square and cube parity occur in the runtime" },
  { family: "parity claim always conditional or never", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-007"], owner: "NUM-CP-001", rationale: "four disjoint truth classes include consecutive-product and polynomial states" },
  { family: "inverse or missing parity condition", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-015", "NUM-CP001-PROT-020"], owner: "NUM-CP-001", rationale: "reverse parity and condition-on-n forms are executable" },
  { family: "recover ordinary consecutive integers from sum", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-008", "NUM-CP001-PROT-021"], owner: "NUM-CP-001", rationale: "short and longer block lengths are executable for later merge audit" },
  { family: "recover consecutive odd or even integers", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-016"], owner: "NUM-CP-001", rationale: "spacing-two reconstruction is executable" },
  { family: "recover consecutive block middle or endpoint", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-022"], owner: "NUM-CP-001", rationale: "first middle last targets are executable" },
  { family: "consecutive block sum property", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-021", "NUM-CP001-PROT-024"], owner: "NUM-CP-001", rationale: "block-average reconstruction plus explicit divisibility claim covers the source trace" },
  { family: "consecutive block product parity", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-007"], owner: "NUM-CP-001", rationale: "n(n+1) even is an explicit parity authority state" },
  { family: "guaranteed consecutive-product divisibility", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-026"], owner: "NUM-CP-001", rationale: "k! universal divisibility and sharpness close the historical source gap" },
  { family: "possible impossible consecutive block sum", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-023"], owner: "NUM-CP-001", rationale: "integer-feasibility residue condition is executable" },
  { family: "statement combination", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-024"], owner: "NUM-CP-001", rationale: "multi-claim exact truth subset is executable" },
  { family: "integer-structure data sufficiency", status: "COVERED_BY_EXECUTABLE_PROTOTYPE", prototypeIds: ["NUM-CP001-PROT-025"], owner: "NUM-CP-001", rationale: "ordinary inverse authority now supports candidate-set sufficiency" },
  { family: "number-line ordering rendering", status: "MERGE_AS_REPRESENTATION", prototypeIds: ["NUM-CP001-PROT-003"], owner: "NUM-CP-001", rationale: "drawing the same exact coordinates does not change signed-order inference" },
  { family: "number-line distance rendering", status: "MERGE_AS_REPRESENTATION", prototypeIds: ["NUM-CP001-PROT-004", "NUM-CP001-PROT-014"], owner: "NUM-CP-001", rationale: "visual points preserve direct and inverse absolute-distance state" },
  { family: "small exact-value table rendering", status: "MERGE_AS_REPRESENTATION", prototypeIds: ["NUM-CP001-PROT-018"], owner: "NUM-CP-001", rationale: "placing exact values in table rows does not alter comparison evidence" },
  { family: "interval notation rendering", status: "MERGE_AS_REPRESENTATION", prototypeIds: ["NUM-CP001-PROT-005", "NUM-CP001-PROT-012"], owner: "NUM-CP-001", rationale: "bracket notation is already parameterised by endpoint inclusion" },
  { family: "legacy NS-CLASS-001", status: "MERGE_AS_REPRESENTATION", prototypeIds: ["NUM-CP001-PROT-001", "NUM-CP001-PROT-002", "NUM-CP001-PROT-006", "NUM-CP001-PROT-007", "NUM-CP001-PROT-017"], owner: "NUM-CP-001", rationale: "legacy archetype is source-history evidence, not a V4 permanent identity" },
  { family: "legacy NS-NLINE-001", status: "MERGE_AS_REPRESENTATION", prototypeIds: ["NUM-CP001-PROT-003", "NUM-CP001-PROT-004", "NUM-CP001-PROT-014", "NUM-CP001-PROT-018"], owner: "NUM-CP-001/NUM-CP-002", rationale: "standalone number-line frequency is low and rendering does not create a new invariant" },
  { family: "fraction recurring decimal conversion as governing comparison step", status: "REASSIGNED_TO_OTHER_OWNER", prototypeIds: [], owner: "NUM-CP-002", rationale: "representation conversion, not general ordering, governs the solution" },
  { family: "prime composite classification as governing target", status: "REASSIGNED_TO_OTHER_OWNER", prototypeIds: [], owner: "NUM-CP-004", rationale: "primality and factorisation have dedicated ownership" },
  { family: "generic inequality solving", status: "REASSIGNED_TO_OTHER_OWNER", prototypeIds: [], owner: "ALGEBRA", rationale: "CP-001 owns integer selection from already-stated bounds, not general inequality algebra" },
  { family: "pattern continuation or arithmetic number series", status: "REASSIGNED_TO_OTHER_OWNER", prototypeIds: [], owner: "NUMBER_SERIES", rationale: "pattern continuation is not integer-structure classification" },
  { family: "formed-number arrangement counting", status: "REASSIGNED_TO_OTHER_OWNER", prototypeIds: [], owner: "P_AND_C", rationale: "arrangement counting changes the governing combinatorial inference" },
  { family: "non-routine irrational expression theorem", status: "ADVANCED_ENRICHMENT_HOLD", prototypeIds: [], owner: "NUM-CP-001/SURDS", rationale: "only source-safe non-square-root classification is routine CP-001 scope" },
] as const satisfies readonly NumCp001SourceDisposition[]);

export const NUM_CP001_SOURCE_SATURATION_STATUS = Object.freeze({
  discoveredPrototypeCount: 26,
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-124",
  routineSourceGapCount: 0,
  legacyTraceCount: 2,
  representationMergeCount: NUM_CP001_SOURCE_DISPOSITIONS.filter((row) => row.status === "MERGE_AS_REPRESENTATION").length,
  reassignedFamilyCount: NUM_CP001_SOURCE_DISPOSITIONS.filter((row) => row.status === "REASSIGNED_TO_OTHER_OWNER").length,
  advancedHoldCount: NUM_CP001_SOURCE_DISPOSITIONS.filter((row) => row.status === "ADVANCED_ENRICHMENT_HOLD").length,
  waveStatus: "SOURCE_SATURATED_AWAITING_MERGE_SPLIT_AUDIT",
} as const);