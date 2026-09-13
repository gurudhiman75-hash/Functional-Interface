import { LP_001_010_PERMANENT_QL_REGISTRY_V1 } from "./lp-001-010-permanent-ql-registry-v1.ts";
import { LP_011_PERMANENT_QL_ALLOCATIONS } from "./lp-011-permanent-freeze-v1.ts";
import { LP_006_PROJECTION_PERMANENT_QL_ALLOCATIONS } from "./lp-006-projection-permanent-freeze-v1.ts";

export const LP_001_011_PERMANENT_QL_REGISTRY_V2 = Object.freeze({
  authorityId: "LP_001_011_PERMANENT_QL_REGISTRY_V2" as const,
  supersedes: LP_001_010_PERMANENT_QL_REGISTRY_V1.authorityId,
  permanentQlIds: Object.freeze([
    ...LP_001_010_PERMANENT_QL_REGISTRY_V1.permanentQlIds,
    ...LP_011_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.qlId),
    ...LP_006_PROJECTION_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.qlId),
  ]),
  permanentQlCount: LP_001_010_PERMANENT_QL_REGISTRY_V1.permanentQlCount + LP_011_PERMANENT_QL_ALLOCATIONS.length + LP_006_PROJECTION_PERMANENT_QL_ALLOCATIONS.length,
  allocations: Object.freeze([
    ...LP_001_010_PERMANENT_QL_REGISTRY_V1.allocations,
    ...LP_011_PERMANENT_QL_ALLOCATIONS.map((entry) => ({ ...entry, packageId: "LP-011" as const })),
    ...LP_006_PROJECTION_PERMANENT_QL_ALLOCATIONS.map((entry) => ({ ...entry, packageId: "LP-006" as const, extensionId: "LP-006-PROJECTION" as const })),
  ]),
  allocatedRange: Object.freeze(["LP-QL-001", "LP-QL-046"] as const),
  nextAvailableQlId: "LP-QL-047" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  productionEligible: false as const,
});
