export type DsfCp001SourceDependencyStatus =
  | "PRODUCTION_BACKED_ON_NEW_MAIN";

export interface DsfCp001SourceDependency {
  readonly sourceChapterId: string;
  readonly domain: string;
  readonly status: DsfCp001SourceDependencyStatus;
  readonly productionSolveModes: readonly string[];
  readonly sourceRef?: {
    readonly prNumber: number;
    readonly branch: string;
    readonly mergedHeadSha: string;
    readonly mergeCommitSha: string;
  };
  readonly policy: string;
}

/**
 * CP-001 final-freeze dependency snapshot.
 *
 * All planned source domains are now production-backed on New-main. Algebra is
 * consumed through its frozen permanent source contract ALG-QL-040 / ALG-CP-014;
 * DSF does not copy or replace Algebra solver truth.
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
    sourceChapterId: "ALG-002",
    domain: "Algebra",
    status: "PRODUCTION_BACKED_ON_NEW_MAIN",
    productionSolveModes: [
      "DSF-SM-ALG-SINGLE-VARIABLE-X",
      "DSF-SM-ALG-LINEAR-SYSTEM-X",
    ],
    sourceRef: {
      prNumber: 867,
      branch: "feature/alg-001-phase0-foundation",
      mergedHeadSha: "9bb081add70142a9bfb39e89ffd44904e6e67f89",
      mergeCommitSha: "849017e332c75108aef37b8bd51d4886fc54c7f3",
    },
    policy: "Reuse frozen ALG-QL-040 / ALG-CP-014 problem states and exact shared Algebra solvers; DSF owns canonical sufficiency classification and DS rendering.",
  },
] as const;

export const DSF_CP001_PRE_FREEZE_DECISION = {
  status: "READY_FOR_FINAL_CP001_FREEZE" as const,
  productionBackedDomains: ["Number System", "Ratio & Proportion", "Percentage", "Algebra"] as const,
  blockingDomain: null,
  permanentQlId: "DSF-QL-001" as const,
  newQlAllocationRequired: false,
  sourceDependenciesSatisfied: true,
  questionStudioPublicationAllowed: false,
} as const;
