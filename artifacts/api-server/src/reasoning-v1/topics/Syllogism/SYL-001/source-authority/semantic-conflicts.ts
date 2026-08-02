export interface SyllogismSemanticConflict {
  conflictId: string;
  form: string;
  competingInterpretations: readonly string[];
  selectedPolicy: string | null;
  status: "OPEN" | "FROZEN" | "EXCLUDED";
  notes: string;
}

export const SYL_001_SEMANTIC_CONFLICTS: readonly SyllogismSemanticConflict[] = [
  {
    conflictId: "SYL-CONFLICT-001",
    form: "NO_A_IS_B_PREDICATE_EXISTENCE",
    competingInterpretations: [
      "No predicate existence is inferred.",
      "Both named categories are treated as non-empty.",
    ],
    selectedPolicy: "No predicate existence is inferred in the foundation profile.",
    status: "FROZEN",
    notes: "CP-001 source saturation may request a versioned profile amendment, never a silent change.",
  },
  {
    conflictId: "SYL-CONFLICT-002",
    form: "FEW_A_ARE_B",
    competingInterpretations: [
      "Some A are B and some A are not B.",
      "Some A are B with a small-count conversational implication only.",
    ],
    selectedPolicy: null,
    status: "OPEN",
    notes: "FEW is rejected by the normalizer until a source-profile decision is frozen.",
  },
];
