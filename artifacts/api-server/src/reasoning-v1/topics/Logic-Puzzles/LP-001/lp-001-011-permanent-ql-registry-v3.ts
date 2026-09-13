import { LP_001_011_PERMANENT_QL_REGISTRY_V2 } from "./lp-001-011-permanent-ql-registry-v2.ts";
import { LP_CP04_PERMANENT_QL_ALLOCATIONS } from "./lp-cp04-permanent-freeze-v1.ts";

export const LP_001_011_PERMANENT_QL_REGISTRY_V3 = Object.freeze({
  authorityId: "LP_001_011_PERMANENT_QL_REGISTRY_V3" as const,
  supersedes: LP_001_011_PERMANENT_QL_REGISTRY_V2.authorityId,
  permanentQlIds: Object.freeze([
    ...LP_001_011_PERMANENT_QL_REGISTRY_V2.permanentQlIds,
    ...LP_CP04_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.qlId),
  ]),
  permanentQlCount: LP_001_011_PERMANENT_QL_REGISTRY_V2.permanentQlCount + LP_CP04_PERMANENT_QL_ALLOCATIONS.length,
  allocations: Object.freeze([
    ...LP_001_011_PERMANENT_QL_REGISTRY_V2.allocations,
    ...LP_CP04_PERMANENT_QL_ALLOCATIONS.map((entry) => ({
      ...entry,
      packageId: "LP-CP04-COUNTERFACTUAL" as const,
      parentPackageIds: ["LP-001", "LP-004"] as const,
    })),
  ]),
  allocatedRange: Object.freeze(["LP-QL-001", "LP-QL-047"] as const),
  nextAvailableQlId: "LP-QL-048" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  sourceSaturatedForTargetExams: false as const,
  productionEligible: false as const,
});
