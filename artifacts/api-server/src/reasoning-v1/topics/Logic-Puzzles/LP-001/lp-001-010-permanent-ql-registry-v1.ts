import { LP_001_008_PERMANENT_QL_ALLOCATIONS } from "./lp-001-008-permanent-freeze-v1.ts";
import { LP_009_PERMANENT_QL_ALLOCATIONS } from "./lp-009-permanent-freeze.ts";
import { LP_010_PERMANENT_QL_ALLOCATIONS } from "./lp-010-permanent-freeze.ts";

export const LP_001_010_PERMANENT_QL_REGISTRY_V1 = Object.freeze({
  authorityId: "LP_001_010_PERMANENT_QL_REGISTRY_V1" as const,
  permanentQlIds: Object.freeze([
    ...LP_001_008_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.qlId),
    ...LP_009_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.qlId),
    ...LP_010_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.qlId),
  ]),
  permanentQlCount: LP_001_008_PERMANENT_QL_ALLOCATIONS.length + LP_009_PERMANENT_QL_ALLOCATIONS.length + LP_010_PERMANENT_QL_ALLOCATIONS.length,
  allocations: Object.freeze([
    ...LP_001_008_PERMANENT_QL_ALLOCATIONS,
    ...LP_009_PERMANENT_QL_ALLOCATIONS.map((entry) => ({ ...entry, packageId: "LP-009" as const })),
    ...LP_010_PERMANENT_QL_ALLOCATIONS.map((entry) => ({ ...entry, packageId: "LP-010" as const })),
  ]),
  allocatedRange: Object.freeze(["LP-QL-001", "LP-QL-040"] as const),
  nextAvailableQlId: "LP-QL-041" as const,
});
