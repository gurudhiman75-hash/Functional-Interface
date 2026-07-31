import type { MalCp002DiscoveryPrototypeId } from "./cp002-types";

export type MalCp002CoverageStatus =
  | "COVERED_EXECUTABLE"
  | "REPRESENTATION_GAP"
  | "TASK_GAP"
  | "EDGE_GAP"
  | "BOUNDARY_PENDING"
  | "EXCLUDED_OTHER_OWNER"
  | "NON_UNIQUE_WITHOUT_MORE_EVIDENCE";

export type MalCp002GapPriority =
  | "IMPLEMENT_NEXT"
  | "AUDIT_NEXT"
  | "SOURCE_REQUIRED"
  | "DEFER_TO_OWNER"
  | "NO_EXECUTION";

export interface MalCp002CoverageRow {
  contractId: string;
  conceptLayer:
    | "TWO_COMPONENT_STATE"
    | "PURE_COMPONENT_ADJUSTMENT"
    | "HOMOGENEOUS_SAMPLE_OPERATION"
    | "MULTI_COMPONENT_RELATION"
    | "OWNERSHIP_BOUNDARY";
  evidenceShape: string;
  taskDirection:
    | "FORWARD"
    | "INVERSE"
    | "RECONSTRUCTION"
    | "PREDICATE"
    | "BOUNDARY";
  requestedUnknown: string;
  decisiveInvariant: string;
  ownership:
    | "MAL-CP-002"
    | "MAL-CP-002_CP003_BOUNDARY"
    | "MAL-CP-001"
    | "MAL-CP-003"
    | "MAL-CP-004"
    | "RAP";
  status: MalCp002CoverageStatus;
  priority: MalCp002GapPriority;
  mappedPrototypeIds: readonly MalCp002DiscoveryPrototypeId[];
  rationale: string;
}

/**
 * This matrix is an open audit inventory, not a QL list and not a solve-mode
 * quota. Rows may merge, split, move to another owner or disappear when exact
 * sources and executable uniqueness tests justify a better boundary.
 */
export const MAL_CP002_COVERAGE_MATRIX: readonly MalCp002CoverageRow[] = [
  {
    contractId: "CP002-COV-EXPLICIT-ADD-TO-TARGET",
    conceptLayer: "PURE_COMPONENT_ADJUSTMENT",
    evidenceShape: "Explicit initial A and B quantities plus target ratio",
    taskDirection: "INVERSE",
    requestedUnknown: "Quantity of one pure component to add",
    decisiveInvariant: "The counterpart component quantity is unchanged",
    ownership: "MAL-CP-002",
    status: "COVERED_EXECUTABLE",
    priority: "NO_EXECUTION",
    mappedPrototypeIds: [
      "MAL-CP002-PROT-ADD-COMPONENT-FOR-TARGET-RATIO",
    ],
    rationale: "Direct exact solver, independent verifier and learner runtime exist in both component directions.",
  },
  {
    contractId: "CP002-COV-EXPLICIT-REMOVE-TO-TARGET",
    conceptLayer: "PURE_COMPONENT_ADJUSTMENT",
    evidenceShape: "Explicit initial A and B quantities plus target ratio",
    taskDirection: "INVERSE",
    requestedUnknown: "Quantity of one named pure component to remove",
    decisiveInvariant: "The counterpart component quantity is unchanged",
    ownership: "MAL-CP-002",
    status: "COVERED_EXECUTABLE",
    priority: "NO_EXECUTION",
    mappedPrototypeIds: [
      "MAL-CP002-PROT-REMOVE-COMPONENT-FOR-TARGET-RATIO",
    ],
    rationale: "The stem explicitly distinguishes pure-component removal from homogeneous sample removal.",
  },
  {
    contractId: "CP002-COV-FORWARD-AFTER-ADD",
    conceptLayer: "PURE_COMPONENT_ADJUSTMENT",
    evidenceShape: "Explicit initial A and B quantities plus known pure addition",
    taskDirection: "FORWARD",
    requestedUnknown: "Resulting component ratio",
    decisiveInvariant: "Update only the added component",
    ownership: "MAL-CP-002",
    status: "COVERED_EXECUTABLE",
    priority: "NO_EXECUTION",
    mappedPrototypeIds: [
      "MAL-CP002-PROT-RATIO-AFTER-COMPONENT-ADDITION",
    ],
    rationale: "Forward state transition, reduction and misconception options are executable.",
  },
  {
    contractId: "CP002-COV-FORWARD-AFTER-PURE-REMOVAL",
    conceptLayer: "PURE_COMPONENT_ADJUSTMENT",
    evidenceShape: "Explicit initial A and B quantities plus known pure removal",
    taskDirection: "FORWARD",
    requestedUnknown: "Resulting component ratio",
    decisiveInvariant: "Update only the removed pure component",
    ownership: "MAL-CP-002",
    status: "COVERED_EXECUTABLE",
    priority: "NO_EXECUTION",
    mappedPrototypeIds: [
      "MAL-CP002-PROT-RATIO-AFTER-COMPONENT-REMOVAL",
    ],
    rationale: "Forward pure-removal state is distinct from removing a homogeneous sample.",
  },
  {
    contractId: "CP002-COV-REVERSE-BEFORE-ADDITION",
    conceptLayer: "PURE_COMPONENT_ADJUSTMENT",
    evidenceShape: "Explicit final A and B quantities plus known prior addition",
    taskDirection: "RECONSTRUCTION",
    requestedUnknown: "Original component ratio",
    decisiveInvariant: "Undo the addition on one component only",
    ownership: "MAL-CP-002",
    status: "COVERED_EXECUTABLE",
    priority: "NO_EXECUTION",
    mappedPrototypeIds: [
      "MAL-CP002-PROT-ORIGINAL-RATIO-BEFORE-ADDITION",
    ],
    rationale: "Reverse operation and forward replay verification are executable.",
  },
  {
    contractId: "CP002-COV-REVERSE-BEFORE-REMOVAL",
    conceptLayer: "PURE_COMPONENT_ADJUSTMENT",
    evidenceShape: "Explicit final A and B quantities plus known prior pure removal",
    taskDirection: "RECONSTRUCTION",
    requestedUnknown: "Original component ratio",
    decisiveInvariant: "Undo the removal on one component only",
    ownership: "MAL-CP-002",
    status: "COVERED_EXECUTABLE",
    priority: "NO_EXECUTION",
    mappedPrototypeIds: [
      "MAL-CP002-PROT-ORIGINAL-RATIO-BEFORE-REMOVAL",
    ],
    rationale: "Reverse pure removal is independently replayed to the stated final state.",
  },
  {
    contractId: "CP002-COV-TOTAL-AND-RATIO-PARTITION",
    conceptLayer: "TWO_COMPONENT_STATE",
    evidenceShape: "Total quantity plus component ratio",
    taskDirection: "RECONSTRUCTION",
    requestedUnknown: "Both component quantities",
    decisiveInvariant: "The total is partitioned by ratio parts",
    ownership: "MAL-CP-002",
    status: "COVERED_EXECUTABLE",
    priority: "NO_EXECUTION",
    mappedPrototypeIds: [
      "MAL-CP002-PROT-COMPONENTS-FROM-TOTAL-AND-RATIO",
    ],
    rationale: "This state reconstruction supports downstream adjustment but is not treated as a permanent QL yet.",
  },
  {
    contractId: "CP002-COV-SINGLE-REMOVE-REFILL-INVERSE",
    conceptLayer: "HOMOGENEOUS_SAMPLE_OPERATION",
    evidenceShape: "Explicit initial state, pure refill component and target ratio",
    taskDirection: "INVERSE",
    requestedUnknown: "Single removed-and-refilled quantity",
    decisiveInvariant: "Both original components retain the same one-stage fraction before refill",
    ownership: "MAL-CP-002_CP003_BOUNDARY",
    status: "COVERED_EXECUTABLE",
    priority: "AUDIT_NEXT",
    mappedPrototypeIds: [
      "MAL-CP002-PROT-SINGLE-REMOVE-REFILL-FOR-TARGET-RATIO",
    ],
    rationale: "Executable for ownership comparison; repeated retention remains CP-003.",
  },
  {
    contractId: "CP002-GAP-TOTAL-RATIO-ADD-TO-TARGET",
    conceptLayer: "PURE_COMPONENT_ADJUSTMENT",
    evidenceShape: "Initial total and initial ratio plus target ratio",
    taskDirection: "INVERSE",
    requestedUnknown: "Quantity of pure A or B to add",
    decisiveInvariant: "Reconstruct the state, then conserve the counterpart component",
    ownership: "MAL-CP-002",
    status: "REPRESENTATION_GAP",
    priority: "IMPLEMENT_NEXT",
    mappedPrototypeIds: [],
    rationale: "The mathematics is covered only after explicit quantities are supplied; the ratio-plus-total evidence surface is absent.",
  },
  {
    contractId: "CP002-GAP-TOTAL-RATIO-REMOVE-TO-TARGET",
    conceptLayer: "PURE_COMPONENT_ADJUSTMENT",
    evidenceShape: "Initial total and initial ratio plus target ratio",
    taskDirection: "INVERSE",
    requestedUnknown: "Quantity of pure A or B to remove",
    decisiveInvariant: "Reconstruct the state, then conserve the counterpart component",
    ownership: "MAL-CP-002",
    status: "REPRESENTATION_GAP",
    priority: "IMPLEMENT_NEXT",
    mappedPrototypeIds: [],
    rationale: "Pure-removal questions commonly hide component quantities behind total and ratio evidence.",
  },
  {
    contractId: "CP002-GAP-ONE-COMPONENT-AND-RATIO-STATE",
    conceptLayer: "TWO_COMPONENT_STATE",
    evidenceShape: "One component quantity plus component ratio",
    taskDirection: "RECONSTRUCTION",
    requestedUnknown: "Other component quantity or full state",
    decisiveInvariant: "One ratio part is fixed by the known component",
    ownership: "MAL-CP-002",
    status: "REPRESENTATION_GAP",
    priority: "IMPLEMENT_NEXT",
    mappedPrototypeIds: [],
    rationale: "This is a required state-reconstruction surface for adjustment questions that omit the total.",
  },
  {
    contractId: "CP002-GAP-RATIO-DIFFERENCE-STATE",
    conceptLayer: "TWO_COMPONENT_STATE",
    evidenceShape: "Component ratio plus quantity difference",
    taskDirection: "RECONSTRUCTION",
    requestedUnknown: "Component quantities or total",
    decisiveInvariant: "The ratio-part difference corresponds to the stated quantity difference",
    ownership: "MAL-CP-002",
    status: "BOUNDARY_PENDING",
    priority: "AUDIT_NEXT",
    mappedPrototypeIds: [],
    rationale: "May remain RAP when no mixture operation is essential; ownership depends on the surrounding adjustment task.",
  },
  {
    contractId: "CP002-GAP-ORIGINAL-TOTAL-FROM-ADD-RATIO-SHIFT",
    conceptLayer: "PURE_COMPONENT_ADJUSTMENT",
    evidenceShape: "Original ratio, final ratio and known pure addition",
    taskDirection: "RECONSTRUCTION",
    requestedUnknown: "Original total or original component quantities",
    decisiveInvariant: "The counterpart component has the same quantity in both ratio states",
    ownership: "MAL-CP-002",
    status: "TASK_GAP",
    priority: "IMPLEMENT_NEXT",
    mappedPrototypeIds: [],
    rationale: "This inverse scale problem is not equivalent to undoing an operation from explicit final quantities.",
  },
  {
    contractId: "CP002-GAP-ORIGINAL-TOTAL-FROM-REMOVAL-RATIO-SHIFT",
    conceptLayer: "PURE_COMPONENT_ADJUSTMENT",
    evidenceShape: "Original ratio, final ratio and known pure removal",
    taskDirection: "RECONSTRUCTION",
    requestedUnknown: "Original total or original component quantities",
    decisiveInvariant: "The counterpart component has the same quantity in both ratio states",
    ownership: "MAL-CP-002",
    status: "TASK_GAP",
    priority: "IMPLEMENT_NEXT",
    mappedPrototypeIds: [],
    rationale: "The known removed amount sets the scale between two otherwise relative ratio states.",
  },
  {
    contractId: "CP002-GAP-SINGLE-REMOVE-REFILL-FORWARD",
    conceptLayer: "HOMOGENEOUS_SAMPLE_OPERATION",
    evidenceShape: "Explicit initial state plus known single replacement quantity and refill component",
    taskDirection: "FORWARD",
    requestedUnknown: "Resulting component ratio",
    decisiveInvariant: "One-stage proportional retention followed by pure refill",
    ownership: "MAL-CP-002_CP003_BOUNDARY",
    status: "TASK_GAP",
    priority: "IMPLEMENT_NEXT",
    mappedPrototypeIds: [],
    rationale: "The inverse boundary prototype exists, but its forward closure is absent.",
  },
  {
    contractId: "CP002-GAP-HOMOGENEOUS-REMOVAL-RATIO-INVARIANCE",
    conceptLayer: "HOMOGENEOUS_SAMPLE_OPERATION",
    evidenceShape: "Initial ratio plus removal of a well-mixed sample without refill",
    taskDirection: "FORWARD",
    requestedUnknown: "Ratio after removal",
    decisiveInvariant: "Both components are reduced by the same fraction, so the ratio is unchanged",
    ownership: "MAL-CP-002_CP003_BOUNDARY",
    status: "EDGE_GAP",
    priority: "IMPLEMENT_NEXT",
    mappedPrototypeIds: [],
    rationale: "This conceptual edge distinguishes homogeneous sample removal from pure-component removal and supports trap-resistant authoring.",
  },
  {
    contractId: "CP002-GAP-OPERATION-FEASIBILITY",
    conceptLayer: "PURE_COMPONENT_ADJUSTMENT",
    evidenceShape: "Initial state, stated operation direction and target ratio",
    taskDirection: "PREDICATE",
    requestedUnknown: "Possible, impossible or zero-change classification",
    decisiveInvariant: "Adding a component cannot reduce its share; removing it cannot increase its share",
    ownership: "MAL-CP-002",
    status: "EDGE_GAP",
    priority: "AUDIT_NEXT",
    mappedPrototypeIds: [],
    rationale: "The current generator rejects non-positive adjustments but does not expose feasibility as a learner task.",
  },
  {
    contractId: "CP002-GAP-PURE-TRANSFER-ONE-OUT-OTHER-IN",
    conceptLayer: "PURE_COMPONENT_ADJUSTMENT",
    evidenceShape: "A stated amount of pure A is removed and the same or another amount of pure B is added",
    taskDirection: "FORWARD",
    requestedUnknown: "Resulting ratio or required transfer quantity",
    decisiveInvariant: "One component falls while the other rises by stated linked amounts",
    ownership: "MAL-CP-002",
    status: "BOUNDARY_PENDING",
    priority: "SOURCE_REQUIRED",
    mappedPrototypeIds: [],
    rationale: "This is not homogeneous replacement; direct source evidence is needed before deciding whether it is one CP-002 contract or a separate operation family.",
  },
  {
    contractId: "CP002-GAP-ADD-KNOWN-TWO-COMPONENT-MIXTURE",
    conceptLayer: "PURE_COMPONENT_ADJUSTMENT",
    evidenceShape: "A second mixture with a known component ratio is added to the first mixture",
    taskDirection: "FORWARD",
    requestedUnknown: "Resulting ratio or required added quantity",
    decisiveInvariant: "Both components change according to the added mixture's composition",
    ownership: "MAL-CP-002",
    status: "BOUNDARY_PENDING",
    priority: "SOURCE_REQUIRED",
    mappedPrototypeIds: [],
    rationale: "It is composition arithmetic rather than weighted price, but it is outside the current one-pure-component invariant.",
  },
  {
    contractId: "CP002-GAP-THREE-COMPONENT-COUPLED-ADDITION",
    conceptLayer: "MULTI_COMPONENT_RELATION",
    evidenceShape: "Initial three-way ratio, stated additions and final three-way ratio",
    taskDirection: "RECONSTRUCTION",
    requestedUnknown: "A final component quantity or original scale",
    decisiveInvariant: "Coupled before/after ratio relations determine a common scale",
    ownership: "MAL-CP-002",
    status: "BOUNDARY_PENDING",
    priority: "SOURCE_REQUIRED",
    mappedPrototypeIds: [
      "MAL-CP002-PROT-THREE-COMPONENT-ADDITION-RATIO-ADJUSTMENT",
    ],
    rationale: "CP-001 referred this family, but exact source encoding and uniqueness proof remain pending.",
  },
  {
    contractId: "CP002-NONUNIQUE-FINAL-RATIO-ONLY-REVERSE-REPLACEMENT",
    conceptLayer: "HOMOGENEOUS_SAMPLE_OPERATION",
    evidenceShape: "Final ratio and a known replacement quantity without an initial total or component scale",
    taskDirection: "RECONSTRUCTION",
    requestedUnknown: "Original ratio or original quantities",
    decisiveInvariant: "One final ratio alone does not restore the lost initial scale",
    ownership: "MAL-CP-002_CP003_BOUNDARY",
    status: "NON_UNIQUE_WITHOUT_MORE_EVIDENCE",
    priority: "NO_EXECUTION",
    mappedPrototypeIds: [],
    rationale: "Do not create a contract until an additional independent quantity or ratio condition makes the state unique.",
  },
  {
    contractId: "CP002-BOUNDARY-TARGET-WEIGHTED-MEAN",
    conceptLayer: "OWNERSHIP_BOUNDARY",
    evidenceShape: "Source values or prices and a target weighted mean",
    taskDirection: "BOUNDARY",
    requestedUnknown: "Source ratio or quantity",
    decisiveInvariant: "Weighted total value rather than component-composition ratio",
    ownership: "MAL-CP-001",
    status: "EXCLUDED_OTHER_OWNER",
    priority: "DEFER_TO_OWNER",
    mappedPrototypeIds: [],
    rationale: "MAL-CP-001 owns target-mean blending even when the wording includes addition or removal.",
  },
  {
    contractId: "CP002-BOUNDARY-REPEATED-REPLACEMENT",
    conceptLayer: "OWNERSHIP_BOUNDARY",
    evidenceShape: "Two or more homogeneous remove-refill operations",
    taskDirection: "BOUNDARY",
    requestedUnknown: "Final composition, replacement fraction or operation count",
    decisiveInvariant: "Repeated multiplicative retention",
    ownership: "MAL-CP-003",
    status: "EXCLUDED_OTHER_OWNER",
    priority: "DEFER_TO_OWNER",
    mappedPrototypeIds: [],
    rationale: "Repeated retention and all geometric/product-form inverses remain CP-003.",
  },
  {
    contractId: "CP002-BOUNDARY-CONCENTRATION",
    conceptLayer: "OWNERSHIP_BOUNDARY",
    evidenceShape: "Percentage concentration, solute, dry matter, evaporation or dilution",
    taskDirection: "BOUNDARY",
    requestedUnknown: "Concentration or transformed quantity",
    decisiveInvariant: "Conserved solute or dry matter",
    ownership: "MAL-CP-004",
    status: "EXCLUDED_OTHER_OWNER",
    priority: "DEFER_TO_OWNER",
    mappedPrototypeIds: [],
    rationale: "A two-component ratio may be intermediate, but concentration semantics control ownership.",
  },
  {
    contractId: "CP002-BOUNDARY-CONTEXT-FREE-RATIO",
    conceptLayer: "OWNERSHIP_BOUNDARY",
    evidenceShape: "Ratio and total or difference without a required mixture state transition",
    taskDirection: "BOUNDARY",
    requestedUnknown: "Ordinary ratio quantity",
    decisiveInvariant: "General ratio-and-proportion partition",
    ownership: "RAP",
    status: "EXCLUDED_OTHER_OWNER",
    priority: "DEFER_TO_OWNER",
    mappedPrototypeIds: [],
    rationale: "A mixture noun does not override RAP ownership when conservation and before/after state are irrelevant.",
  },
] as const;

export const MAL_CP002_IMPLEMENT_NEXT_CONTRACT_IDS =
  MAL_CP002_COVERAGE_MATRIX.filter(
    (row) => row.priority === "IMPLEMENT_NEXT",
  ).map((row) => row.contractId);
