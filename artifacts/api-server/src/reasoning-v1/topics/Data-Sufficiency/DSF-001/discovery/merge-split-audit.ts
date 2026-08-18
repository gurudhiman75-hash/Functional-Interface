export type DsMergeSplitDecision = "MERGE" | "SPLIT_CONTRACT" | "SPLIT_ADAPTER" | "DEFER";

export interface DsMergeSplitAuditEntry {
  readonly concern: string;
  readonly decision: DsMergeSplitDecision;
  readonly rationale: string;
  readonly permanentQlEffect: "NO_NEW_QL" | "QL_BOUNDARY_CANDIDATE" | "QL_ALLOCATION_BLOCKED";
}

/**
 * CP-000 merge/split policy. A QL represents a distinct solving/task contract,
 * not a cosmetic presentation difference.
 */
export const DSF_MERGE_SPLIT_AUDIT: readonly DsMergeSplitAuditEntry[] = [
  {
    concern: "Two-statement five-class option order varies by exam",
    decision: "MERGE",
    rationale: "Indian Bank PO 2011 and BOB JMG 2015 expose the same five semantic outcomes in different display orders. Option position is an answer-contract profile, not a new Question Logic.",
    permanentQlEffect: "NO_NEW_QL",
  },
  {
    concern: "Two-statement wording variants such as 'either statement alone' vs 'each statement alone'",
    decision: "MERGE",
    rationale: "When the underlying semantic class is EACH_STATEMENT_ALONE, wording/localization belongs to the answer contract. The canonical internal class remains unchanged.",
    permanentQlEffect: "NO_NEW_QL",
  },
  {
    concern: "Three-statement minimal-sufficient-combination questions",
    decision: "SPLIT_CONTRACT",
    rationale: "Three-statement questions require subset evaluation over I, II, III and exam-specific combination rendering. They share the DS sufficiency engine but cannot use the two-statement five-class answer contract.",
    permanentQlEffect: "QL_BOUNDARY_CANDIDATE",
  },
  {
    concern: "Quant vs Reasoning Data Sufficiency",
    decision: "SPLIT_ADAPTER",
    rationale: "The learner-facing chapter and sufficiency semantics remain shared, while source-domain world construction and target solving stay owned by Quant/Reasoning adapters.",
    permanentQlEffect: "NO_NEW_QL",
  },
  {
    concern: "Different Quant source chapters using the same scalar-determinacy task",
    decision: "SPLIT_ADAPTER",
    rationale: "Percentage, ages, work, interest, geometry and algebra need different source solvers, but source chapter identity alone does not justify a DSF QL if the DS task contract is otherwise the same.",
    permanentQlEffect: "NO_NEW_QL",
  },
  {
    concern: "Different target semantics: scalar value, yes/no proposition, rank, identity, direction, relation",
    decision: "SPLIT_CONTRACT",
    rationale: "Target normalization and explanation proof can differ materially. Executable discovery must determine which target kinds share one QL contract and which require distinct permanent QLs.",
    permanentQlEffect: "QL_BOUNDARY_CANDIDATE",
  },
  {
    concern: "Seating and general puzzle DS",
    decision: "DEFER",
    rationale: "Constraint-heavy adapters require complete valid-world enumeration or equivalent proof from source solvers. They remain outside the first permanent allocation until source interfaces are proven.",
    permanentQlEffect: "QL_ALLOCATION_BLOCKED",
  },
  {
    concern: "SSC-specific and Punjab-state-specific DS variants",
    decision: "DEFER",
    rationale: "Direct exam-source DS evidence has not yet been verified in CP-000. Exam-specific QL or answer-contract allocation would currently be speculative.",
    permanentQlEffect: "QL_ALLOCATION_BLOCKED",
  },
];

export function dsfMergeSplitSummary(): Readonly<Record<DsMergeSplitDecision, number>> {
  return DSF_MERGE_SPLIT_AUDIT.reduce<Record<DsMergeSplitDecision, number>>(
    (counts, entry) => {
      counts[entry.decision] += 1;
      return counts;
    },
    { MERGE: 0, SPLIT_CONTRACT: 0, SPLIT_ADAPTER: 0, DEFER: 0 },
  );
}

export const DSF_PERMANENT_QL_ALLOCATION_DECISION = {
  status: "BLOCKED_PENDING_SOURCE_COMPLETION" as const,
  reasons: [
    "SSC direct DS evidence not yet verified",
    "Punjab-state direct DS evidence not yet verified",
    "existing TMW/SAP/NUM chapter-local DS ownership still requires reconciliation",
    "constraint-heavy Seating/Puzzle adapters are intentionally deferred",
  ] as const,
};
