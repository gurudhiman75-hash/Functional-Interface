export type DsfCp001SourceDependencyStatus =
  | "PRODUCTION_BACKED_ON_NEW_MAIN"
  | "SOURCE_RUNTIME_READY_OFF_BASE_BLOCKS_CP001_FREEZE";

export interface DsfCp001SourceDependency {
  readonly sourceChapterId: string;
  readonly domain: string;
  readonly status: DsfCp001SourceDependencyStatus;
  readonly productionSolveModes: readonly string[];
  readonly sourceRef?: {
    readonly prNumber: number;
    readonly branch: string;
    readonly headShaAtAudit: string;
    readonly draft: boolean;
  };
  readonly policy: string;
}

/**
 * CP-001 pre-freeze dependency snapshot.
 *
 * Existing merged waves are production-backed on New-main. Algebra has a mature
 * source runtime in draft PR #867, but DSF must not import an unmerged source
 * branch. Once Algebra is merged, this snapshot must be revisited before CP-001
 * can be frozen.
 */
export const DSF_CP001_SOURCE_DEPENDENCIES: readonly DsfCp001SourceDependency[] = [
  {
    sourceChapterId: "NUM-001",
    domain: "Number System",
    status: "PRODUCTION_BACKED_ON_NEW_MAIN",
    productionSolveModes: [
      "DSF-SM-NUM-MISSING-DIGIT",
      "DSF-SM-NUM-DIGIT-PARITY",
    ],
    policy: "Reuse NUM-001 divisibility truth; DSF owns sufficiency classification only.",
  },
  {
    sourceChapterId: "RAP-001",
    domain: "Ratio & Proportion",
    status: "PRODUCTION_BACKED_ON_NEW_MAIN",
    productionSolveModes: [
      "DSF-SM-RAP-RATIO-AB",
      "DSF-SM-RAP-GREATER-QUANTITY",
    ],
    policy: "Reuse RAP-001 canonical ratio simplification; DSF owns statement subsets and target projection.",
  },
  {
    sourceChapterId: "PCT-001",
    domain: "Percentage",
    status: "PRODUCTION_BACKED_ON_NEW_MAIN",
    productionSolveModes: [
      "DSF-SM-PCT-NET-SUCCESSIVE-CHANGE",
      "DSF-SM-PCT-FINAL-DIRECTION",
    ],
    policy: "Reuse PCT-001 percentage arithmetic; DSF owns finite-world DS semantics and rendering.",
  },
  {
    sourceChapterId: "ALG-001/ALG-002",
    domain: "Algebra",
    status: "SOURCE_RUNTIME_READY_OFF_BASE_BLOCKS_CP001_FREEZE",
    productionSolveModes: [],
    sourceRef: {
      prNumber: 867,
      branch: "feature/alg-001-phase0-foundation",
      headShaAtAudit: "2332b2e0b2e08bd8baa20951393bb68934126ab4",
      draft: true,
    },
    policy: "Do not copy Algebra solvers into DSF and do not import from an unmerged feature branch. Re-audit after the source Algebra PR reaches New-main.",
  },
] as const;

export const DSF_CP001_PRE_FREEZE_DECISION = {
  status: "NOT_FREEZABLE_SOURCE_DEPENDENCY_PENDING" as const,
  productionBackedDomains: ["Number System", "Ratio & Proportion", "Percentage"] as const,
  blockingDomain: "Algebra" as const,
  permanentQlId: "DSF-QL-001" as const,
  newQlAllocationRequired: false,
  questionStudioPublicationAllowed: false,
} as const;
