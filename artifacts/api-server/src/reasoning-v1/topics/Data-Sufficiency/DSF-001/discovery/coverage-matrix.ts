export type DsCoverageReadiness =
  | "EXECUTABLE_PROTOTYPE"
  | "EXISTING_RUNTIME_AUDIT"
  | "PROTOTYPE_REQUIRED"
  | "DEFERRED";

export interface DsCoverageRow {
  readonly domainFamily: "QUANT" | "REASONING";
  readonly sourceChapter: string;
  readonly targetKinds: readonly string[];
  readonly readiness: DsCoverageReadiness;
  readonly ownership: "SOURCE_CHAPTER_SOLVER" | "SOURCE_CAPABILITY_REUSE" | "TO_BE_RESOLVED";
  readonly notes: string;
}

/**
 * Architectural coverage matrix only. It is not a claim that exam-source
 * discovery is complete. PYQ/source-pattern evidence must still be attached
 * before permanent QL allocation.
 */
export const DSF_COVERAGE_MATRIX: readonly DsCoverageRow[] = [
  {
    domainFamily: "QUANT",
    sourceChapter: "Number System",
    targetKinds: ["MISSING_DIGIT", "DIGIT_PARITY", "DIVISIBILITY_PROPERTY", "REMAINDER", "COUNT"],
    readiness: "EXECUTABLE_PROTOTYPE",
    ownership: "SOURCE_CAPABILITY_REUSE",
    notes: "DSF adapter reuses NUM-001 divisibility helpers while shared DSF owns sufficiency classification.",
  },
  {
    domainFamily: "QUANT",
    sourceChapter: "Simplification and Approximation",
    targetKinds: ["SCALAR", "BOUNDED_UNKNOWN"],
    readiness: "EXISTING_RUNTIME_AUDIT",
    ownership: "SOURCE_CHAPTER_SOLVER",
    notes: "Existing SAP DS prototype has useful candidate solving but a non-canonical four-class answer contract.",
  },
  {
    domainFamily: "QUANT",
    sourceChapter: "Time and Work",
    targetKinds: ["TIME", "RATE", "EFFICIENCY_RELATION"],
    readiness: "EXISTING_RUNTIME_AUDIT",
    ownership: "SOURCE_CHAPTER_SOLVER",
    notes: "Existing TMW DS scenarios should migrate from intended uniqueness flags to shared target-projection proof.",
  },
  {
    domainFamily: "QUANT",
    sourceChapter: "Ratio / Percentage / Average / Profit-Loss / Ages / Interest",
    targetKinds: ["SCALAR", "RATIO", "PERCENT", "COMPARISON"],
    readiness: "PROTOTYPE_REQUIRED",
    ownership: "SOURCE_CHAPTER_SOLVER",
    notes: "Arithmetic source solvers should be wrapped rather than copied into DSF.",
  },
  {
    domainFamily: "QUANT",
    sourceChapter: "Algebra",
    targetKinds: ["SCALAR", "BOOLEAN", "FUNCTION_OF_VARIABLES"],
    readiness: "EXECUTABLE_PROTOTYPE",
    ownership: "SOURCE_CHAPTER_SOLVER",
    notes: "Discovery prototype proves x+y can be unique while two ordered-pair worlds survive. Production source-runtime integration remains pending because Algebra runtime is not yet available on New-main.",
  },
  {
    domainFamily: "QUANT",
    sourceChapter: "Geometry / Mensuration",
    targetKinds: ["LENGTH", "ANGLE", "AREA", "VOLUME"],
    readiness: "PROTOTYPE_REQUIRED",
    ownership: "SOURCE_CHAPTER_SOLVER",
    notes: "Must preserve geometric feasibility as well as algebraic determinacy.",
  },
  {
    domainFamily: "REASONING",
    sourceChapter: "Ranking and Order",
    targetKinds: ["RANK", "COUNT", "RELATIVE_ORDER"],
    readiness: "EXECUTABLE_PROTOTYPE",
    ownership: "SOURCE_CAPABILITY_REUSE",
    notes: "Executable relational adapter projects rank across all valid total orders and independently checks the answer set with RNK-CP-007 exactRankSet.",
  },
  {
    domainFamily: "REASONING",
    sourceChapter: "Direction and Distance",
    targetKinds: ["DIRECTION", "DISTANCE", "RELATIVE_POSITION"],
    readiness: "PROTOTYPE_REQUIRED",
    ownership: "SOURCE_CHAPTER_SOLVER",
    notes: "Multiple complete paths may survive while direction/displacement is fixed.",
  },
  {
    domainFamily: "REASONING",
    sourceChapter: "Blood Relations",
    targetKinds: ["RELATION", "GENERATION", "GENDER"],
    readiness: "PROTOTYPE_REQUIRED",
    ownership: "SOURCE_CHAPTER_SOLVER",
    notes: "Must project relation across all valid family graphs and reject cultural assumptions.",
  },
  {
    domainFamily: "REASONING",
    sourceChapter: "Inequality",
    targetKinds: ["COMPARISON", "GREATEST", "SMALLEST", "DEFINITE_RELATION"],
    readiness: "PROTOTYPE_REQUIRED",
    ownership: "SOURCE_CHAPTER_SOLVER",
    notes: "Underlying solver must distinguish definite truth from indeterminate comparison before DS classification.",
  },
  {
    domainFamily: "REASONING",
    sourceChapter: "Seating Arrangement",
    targetKinds: ["IDENTITY", "POSITION", "NEIGHBOUR_RELATION", "OPPOSITE_RELATION"],
    readiness: "DEFERRED",
    ownership: "SOURCE_CHAPTER_SOLVER",
    notes: "Deferred until simpler relational adapters establish complete-world enumeration/projection contracts.",
  },
  {
    domainFamily: "REASONING",
    sourceChapter: "General Puzzles",
    targetKinds: ["IDENTITY", "ATTRIBUTE_PAIR", "POSITION", "SCHEDULE_FACT"],
    readiness: "DEFERRED",
    ownership: "SOURCE_CHAPTER_SOLVER",
    notes: "Requires complete constraint-solver coverage; no partial-world shortcut is acceptable.",
  },
];

export function dsfCoverageSummary(): {
  readonly total: number;
  readonly quant: number;
  readonly reasoning: number;
  readonly byReadiness: Readonly<Record<DsCoverageReadiness, number>>;
} {
  const byReadiness: Record<DsCoverageReadiness, number> = {
    EXECUTABLE_PROTOTYPE: 0,
    EXISTING_RUNTIME_AUDIT: 0,
    PROTOTYPE_REQUIRED: 0,
    DEFERRED: 0,
  };
  for (const row of DSF_COVERAGE_MATRIX) byReadiness[row.readiness] += 1;
  return {
    total: DSF_COVERAGE_MATRIX.length,
    quant: DSF_COVERAGE_MATRIX.filter((row) => row.domainFamily === "QUANT").length,
    reasoning: DSF_COVERAGE_MATRIX.filter((row) => row.domainFamily === "REASONING").length,
    byReadiness,
  };
}
