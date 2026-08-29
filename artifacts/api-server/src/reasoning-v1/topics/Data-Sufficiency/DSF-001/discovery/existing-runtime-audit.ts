export type DsRuntimeReuseDecision =
  | "ADAPT_TO_SHARED_DSF"
  | "MIGRATE_PROOF_MODEL"
  | "DO_NOT_REUSE_ANSWER_CONTRACT";

export interface ExistingDsRuntimeAuditEntry {
  readonly sourceChapter: string;
  readonly evidencePath: string;
  readonly currentClassCount: number;
  readonly currentProofModel: string;
  readonly usefulAssets: readonly string[];
  readonly defectOrGap: string;
  readonly reuseDecision: DsRuntimeReuseDecision;
}

/**
 * CP-000 static audit of DS-shaped runtimes already present on New-main.
 * This inventory exists to prevent a second, incompatible sufficiency engine
 * from being grown inside DSF-001.
 */
export const EXISTING_DSF_RUNTIME_AUDIT: readonly ExistingDsRuntimeAuditEntry[] = [
  {
    sourceChapter: "Number System / NUM-001",
    evidencePath: "quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-001/NUM-CP-003/retained/authority-data-sufficiency.ts",
    currentClassCount: 5,
    currentProofModel: "candidate sets for I, II and their intersection",
    usefulAssets: [
      "predicate construction",
      "finite missing-digit domains",
      "candidate-set explanations",
      "five-class semantic coverage",
    ],
    defectOrGap: "Chapter-local class names and candidate-count logic are tied to the missing digit itself; DSF must generalize to arbitrary target projection.",
    reuseDecision: "ADAPT_TO_SHARED_DSF",
  },
  {
    sourceChapter: "Time and Work / TMW-001",
    evidencePath: "quant-v4/topics/Arithmetic/subtopics/TimeAndWork/TMW-001/foundation/cp013-data-sufficiency-runtime.ts",
    currentClassCount: 5,
    currentProofModel: "precomputed iUnique / iiUnique / combinedUnique booleans plus explanatory text",
    usefulAssets: [
      "domain-specific work/rate scenarios",
      "multilingual statement wording",
      "five outcome classes",
    ],
    defectOrGap: "The current runtime carries intended uniqueness flags in generated state rather than deriving canonical DS truth through the shared target-projection evaluator.",
    reuseDecision: "MIGRATE_PROOF_MODEL",
  },
  {
    sourceChapter: "Simplification and Approximation / SAP-001",
    evidencePath: "quant-v4/topics/Arithmetic/subtopics/SimplificationAndApproximation/SAP-001/SAP-CP-006/runtime-wave3.ts",
    currentClassCount: 4,
    currentProofModel: "candidate sets for a bounded x domain",
    usefulAssets: [
      "bounded arithmetic candidate solving",
      "deterministic prototype generation",
      "lifecycle isolation",
    ],
    defectOrGap: "Its answer contract omits the EACH_STATEMENT_ALONE class, so its four-option taxonomy is not a canonical DSF truth model.",
    reuseDecision: "DO_NOT_REUSE_ANSWER_CONTRACT",
  },
];

export function existingRuntimeAuditSummary(): Readonly<Record<DsRuntimeReuseDecision, number>> {
  return EXISTING_DSF_RUNTIME_AUDIT.reduce<Record<DsRuntimeReuseDecision, number>>(
    (counts, entry) => {
      counts[entry.reuseDecision] += 1;
      return counts;
    },
    {
      ADAPT_TO_SHARED_DSF: 0,
      MIGRATE_PROOF_MODEL: 0,
      DO_NOT_REUSE_ANSWER_CONTRACT: 0,
    },
  );
}
