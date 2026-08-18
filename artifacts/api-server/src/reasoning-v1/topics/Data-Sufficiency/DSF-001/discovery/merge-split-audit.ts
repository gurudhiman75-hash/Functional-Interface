export type DsMergeSplitDecision = "MERGE" | "SPLIT_CONTRACT" | "SPLIT_ADAPTER" | "DEFER";

export interface DsMergeSplitAuditEntry {
  readonly concern: string;
  readonly decision: DsMergeSplitDecision;
  readonly rationale: string;
  readonly permanentQlEffect: "NO_NEW_QL" | "QL_BOUNDARY_CANDIDATE" | "QL_ALLOCATION_BLOCKED";
}

export const DSF_MERGE_SPLIT_AUDIT: readonly DsMergeSplitAuditEntry[] = [
  {
    concern: "Two-statement option order varies by exam",
    decision: "MERGE",
    rationale: "Banking five-option profiles and SSC four-option profiles demonstrate that option position belongs to an answer-contract profile, not to the semantic Question Logic.",
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
    rationale: "Executable CP-000 discovery shows scalar, categorical and rank targets can share the same two-statement target-projection contract. They remain solve-mode metadata in the initial allocation; a future split requires evidence of materially different task behavior.",
    permanentQlEffect: "NO_NEW_QL",
  },
  {
    concern: "Seating and general puzzle DS",
    decision: "DEFER",
    rationale: "Constraint-heavy adapters require complete valid-world enumeration or equivalent proof from source solvers. They remain outside the first permanent allocation until source interfaces are proven.",
    permanentQlEffect: "QL_ALLOCATION_BLOCKED",
  },
  {
    concern: "Punjab-state-specific answer-contract freeze",
    decision: "DEFER",
    rationale: "PSSSB Clerk preparation material confirms DS relevance, but the exact official-paper answer contract is not yet verified. Generic DS semantics may proceed; a Punjab-specific rendering profile must not be frozen from preparation material alone.",
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
  status: "READY_FOR_CP000_FREEZE_REVIEW" as const,
  initialPermanentQlCandidateCount: 1,
  initialCandidateId: "DSF-QL-CAND-001" as const,
  permanentIdsAllocated: false,
  nonBlockingDeferredProfiles: [
    "Punjab-state official answer-contract profile remains disabled until verified",
    "constraint-heavy Seating/Puzzle adapters are deferred from the first permanent allocation",
    "three-statement DS is a source-supported future contract and is deferred until its renderer/QA are implemented",
  ] as const,
  resolvedEvidence: [
    "banking two-statement five-class semantics and option-order variation",
    "banking three-statement subset contracts",
    "SSC CGL two-statement four-option profiles across reasoning and quantitative examples",
    "PSSSB Clerk preparation signal confirming Punjab-state DS relevance",
    "TMW/SAP/NUM existing-runtime ownership reconciled without reassigning permanent source QLs",
    "initial QL boundary inventory freezes all two-statement target types into one adapter-driven task contract",
  ] as const,
};
