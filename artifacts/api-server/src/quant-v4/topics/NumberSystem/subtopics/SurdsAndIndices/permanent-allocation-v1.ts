import type { SriCheckpointId } from "./discovery-types";
import { SRI_RETAINED_CONTRACTS_R1, type SriRetainedContractR1 } from "./retained-contracts-r1";
import { SRI_R1_UNRESOLVED_SOURCE_GATES } from "./source-gate-resolution-r1";

export type SriPermanentPackageId = "SRI-001" | "SRI-002";
export type SriPermanentQlId = `${SriPermanentPackageId}-QL-${string}`;
export type SriPermanentSolveModeId = `${SriPermanentPackageId}-SM-${string}`;

/**
 * Permanent allocation order is intentionally explicit and immutable.
 * Do not derive permanent numbering from mutable discovery-array order.
 */
export const SRI_001_PERMANENT_GROUP_ORDER = [
  "SRI-RG-001", "SRI-RG-002", "SRI-RG-003", "SRI-RG-004", "SRI-RG-005", "SRI-RG-006",
  "SRI-RG-007", "SRI-RG-008", "SRI-RG-009", "SRI-RG-010", "SRI-RG-011", "SRI-RG-012",
  "SRI-RG-013", "SRI-RG-014", "SRI-RG-015", "SRI-RG-016", "SRI-RG-017", "SRI-RG-018",
  "SRI-RG-019", "SRI-RG-020", "SRI-RG-021", "SRI-RG-022", "SRI-RG-023", "SRI-RG-024",
  "SRI-RG-025", "SRI-RG-026", "SRI-RG-027", "SRI-RG-028", "SRI-RG-029",
] as const;

export const SRI_002_PERMANENT_GROUP_ORDER = [
  "SRI-RG-030", "SRI-RG-031", "SRI-RG-032", "SRI-RG-033", "SRI-RG-034", "SRI-RG-035",
  "SRI-RG-036", "SRI-RG-037", "SRI-RG-038",
  // RG039 remains an unresolved source HOLD and intentionally receives no permanent slot.
  "SRI-RG-040", "SRI-RG-041", "SRI-RG-042", "SRI-RG-043", "SRI-RG-044", "SRI-RG-045",
  "SRI-RG-046", "SRI-RG-047", "SRI-RG-048", "SRI-RG-049", "SRI-RG-050", "SRI-RG-051",
  "SRI-RG-052", "SRI-RG-053", "SRI-RG-054", "SRI-RG-055", "SRI-RG-056", "SRI-RG-057",
  "SRI-RG-058", "SRI-RG-059",
] as const;

export interface SriPermanentAllocationEntryV1 {
  readonly qlId: SriPermanentQlId;
  readonly solveModeId: SriPermanentSolveModeId;
  readonly packageId: SriPermanentPackageId;
  readonly checkpointId: SriCheckpointId;
  readonly retainedGroupId: `SRI-RG-${string}`;
  readonly title: string;
  readonly memberCandidateIds: readonly string[];
  readonly sourceSupported: true;
  readonly permanentIdentityAllocated: true;
  readonly allocationStatus: "PERMANENT_ID_ALLOCATED_ENGLISH_FREEZE_PENDING";
  readonly solveModeFrozen: false;
  readonly englishFingerprint: null;
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionStudioGenerationEnabled: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

const retainedById = new Map(SRI_RETAINED_CONTRACTS_R1.map((group) => [group.retainedGroupId, group] as const));
const unresolvedGroupIds = new Set(SRI_R1_UNRESOLVED_SOURCE_GATES.map((item) => item.retainedGroupId));

function localId(packageId: SriPermanentPackageId, kind: "QL" | "SM", index: number): SriPermanentQlId | SriPermanentSolveModeId {
  return `${packageId}-${kind}-${String(index + 1).padStart(3, "0")}` as SriPermanentQlId | SriPermanentSolveModeId;
}

function allocatePackage(
  packageId: SriPermanentPackageId,
  groupOrder: readonly string[],
): readonly SriPermanentAllocationEntryV1[] {
  return groupOrder.map((retainedGroupId, index) => {
    const group = retainedById.get(retainedGroupId);
    if (!group) throw new Error(`Missing retained SRI contract ${retainedGroupId}`);
    if (unresolvedGroupIds.has(retainedGroupId)) {
      throw new Error(`Unresolved source-gated group cannot receive a permanent QL: ${retainedGroupId}`);
    }
    return {
      qlId: localId(packageId, "QL", index) as SriPermanentQlId,
      solveModeId: localId(packageId, "SM", index) as SriPermanentSolveModeId,
      packageId,
      checkpointId: group.ownerCheckpointId,
      retainedGroupId: group.retainedGroupId,
      title: group.title,
      memberCandidateIds: group.memberCandidateIds,
      sourceSupported: true,
      permanentIdentityAllocated: true,
      allocationStatus: "PERMANENT_ID_ALLOCATED_ENGLISH_FREEZE_PENDING",
      solveModeFrozen: false,
      englishFingerprint: null,
      active: false,
      questionStudioDiscoverable: false,
      questionStudioGenerationEnabled: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    } as const;
  });
}

export const SRI_001_PERMANENT_ALLOCATION_V1 = allocatePackage("SRI-001", SRI_001_PERMANENT_GROUP_ORDER);
export const SRI_002_PERMANENT_ALLOCATION_V1 = allocatePackage("SRI-002", SRI_002_PERMANENT_GROUP_ORDER);

export const SRI_PERMANENT_ALLOCATION_V1: readonly SriPermanentAllocationEntryV1[] = [
  ...SRI_001_PERMANENT_ALLOCATION_V1,
  ...SRI_002_PERMANENT_ALLOCATION_V1,
];

const allocationByQlId = new Map(SRI_PERMANENT_ALLOCATION_V1.map((entry) => [entry.qlId, entry] as const));
const allocationByRetainedGroupId = new Map(SRI_PERMANENT_ALLOCATION_V1.map((entry) => [entry.retainedGroupId, entry] as const));

export function getSriPermanentAllocationByQlId(qlId: SriPermanentQlId): SriPermanentAllocationEntryV1 {
  const entry = allocationByQlId.get(qlId);
  if (!entry) throw new Error(`Unknown SRI permanent QL ID: ${qlId}`);
  return entry;
}

export function getSriPermanentAllocationByRetainedGroupId(retainedGroupId: string): SriPermanentAllocationEntryV1 {
  const entry = allocationByRetainedGroupId.get(retainedGroupId);
  if (!entry) throw new Error(`Retained group is not permanently allocated: ${retainedGroupId}`);
  return entry;
}

/** Package ownership is defined by the dominant SRI engine, not prototype ancestry. */
export function expectedSriPackageForCheckpoint(checkpointId: SriCheckpointId): SriPermanentPackageId {
  const checkpointNumber = Number(checkpointId.slice(-3));
  return checkpointNumber <= 6 ? "SRI-001" : "SRI-002";
}

export function retainedContractForAllocation(entry: SriPermanentAllocationEntryV1): SriRetainedContractR1 {
  const group = retainedById.get(entry.retainedGroupId);
  if (!group) throw new Error(`Missing retained authority for ${entry.qlId}`);
  return group;
}
