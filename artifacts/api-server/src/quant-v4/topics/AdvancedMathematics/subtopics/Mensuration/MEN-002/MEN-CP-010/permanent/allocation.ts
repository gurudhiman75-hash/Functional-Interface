import {
  MEN_CP_010_CANONICAL_CLUSTERS,
  type MenCp010CanonicalClusterId,
} from "../../cp010-foundation/merge-split-v4";

export const MEN_CP_010_PERMANENT_ALLOCATION_AUTHORITY =
  "MEN-CP010-PERMANENT-ALLOCATION-V4-V1" as const;

export const MEN_CP_010_PERMANENT_QL_IDS = Array.from(
  { length: 26 },
  (_unused, index) => `MEN-002-QL-${String(124 + index).padStart(3, "0")}`,
) as readonly `MEN-002-QL-${string}`[];

export type MenCp010PermanentQlId = `MEN-002-QL-${string}`;
export type MenCp010PermanentTemplateId = `MEN-CP010-TPL-${string}`;
export type MenCp010PermanentSolveModeId = `MEN-CP010-SM-${string}`;

export interface MenCp010PermanentAllocationEntry {
  readonly authority: typeof MEN_CP_010_PERMANENT_ALLOCATION_AUTHORITY;
  readonly packageId: "MEN-002";
  readonly cpId: "MEN-CP-010";
  readonly qlId: MenCp010PermanentQlId;
  readonly templateId: MenCp010PermanentTemplateId;
  readonly solveModeId: MenCp010PermanentSolveModeId;
  readonly clusterId: MenCp010CanonicalClusterId;
  readonly title: string;
  readonly governingInference: string;
  readonly coreEvidenceIds: readonly string[];
  readonly representationEvidenceIds: readonly string[];
  readonly answerSemantic:
    | "VOLUME"
    | "LENGTH"
    | "SURFACE_AREA"
    | "RATIO"
    | "CAPACITY"
    | "COST"
    | "PERCENT_CHANGE";
  readonly allocationStatus: "PRODUCT_OWNER_AUTHORIZED_INACTIVE_ALLOCATION";
  readonly permanentIdentityFrozen: true;
  readonly solveModeFrozen: true;
  readonly englishImplementationFrozen: true;
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

if (MEN_CP_010_CANONICAL_CLUSTERS.length !== 26) {
  throw new Error("MEN-CP-010 canonical merge/split inventory must contain 26 families");
}
if (MEN_CP_010_PERMANENT_QL_IDS.length !== MEN_CP_010_CANONICAL_CLUSTERS.length) {
  throw new Error("MEN-CP-010 permanent allocation count mismatch");
}

export const MEN_CP_010_PERMANENT_ALLOCATION: readonly MenCp010PermanentAllocationEntry[] =
  MEN_CP_010_CANONICAL_CLUSTERS.map((cluster, index) => ({
    authority: MEN_CP_010_PERMANENT_ALLOCATION_AUTHORITY,
    packageId: "MEN-002" as const,
    cpId: "MEN-CP-010" as const,
    qlId: MEN_CP_010_PERMANENT_QL_IDS[index]!,
    templateId: `MEN-CP010-TPL-${String(index + 1).padStart(3, "0")}` as MenCp010PermanentTemplateId,
    solveModeId: `MEN-CP010-SM-${String(index + 1).padStart(3, "0")}` as MenCp010PermanentSolveModeId,
    clusterId: cluster.clusterId,
    title: cluster.title,
    governingInference: cluster.governingInference,
    coreEvidenceIds: cluster.coreEvidenceIds,
    representationEvidenceIds: cluster.representationEvidenceIds,
    answerSemantic: cluster.answerSemantic,
    allocationStatus: "PRODUCT_OWNER_AUTHORIZED_INACTIVE_ALLOCATION" as const,
    permanentIdentityFrozen: true as const,
    solveModeFrozen: true as const,
    englishImplementationFrozen: true as const,
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
  }));

const byQlId = new Map(MEN_CP_010_PERMANENT_ALLOCATION.map((row) => [row.qlId, row]));
const byClusterId = new Map(MEN_CP_010_PERMANENT_ALLOCATION.map((row) => [row.clusterId, row]));

export function getMenCp010PermanentAllocation(qlId: MenCp010PermanentQlId) {
  const row = byQlId.get(qlId);
  if (!row) throw new Error(`Unknown MEN-CP-010 permanent QL: ${qlId}`);
  return row;
}

export function getMenCp010PermanentAllocationForCluster(clusterId: MenCp010CanonicalClusterId) {
  const row = byClusterId.get(clusterId);
  if (!row) throw new Error(`Unknown MEN-CP-010 canonical cluster: ${clusterId}`);
  return row;
}

export function auditMenCp010PermanentAllocation() {
  const qlIds = MEN_CP_010_PERMANENT_ALLOCATION.map((row) => row.qlId);
  const clusterIds = MEN_CP_010_PERMANENT_ALLOCATION.map((row) => row.clusterId);
  const expected = Array.from(
    { length: 26 },
    (_unused, index) => `MEN-002-QL-${String(124 + index).padStart(3, "0")}`,
  );
  return {
    authority: MEN_CP_010_PERMANENT_ALLOCATION_AUTHORITY,
    permanentQlCount: qlIds.length,
    firstQlId: qlIds[0],
    lastQlId: qlIds.at(-1),
    uniqueQlCount: new Set(qlIds).size,
    uniqueClusterCount: new Set(clusterIds).size,
    contiguousQlRange: JSON.stringify(qlIds) === JSON.stringify(expected),
    englishImplementationFrozen: MEN_CP_010_PERMANENT_ALLOCATION.every(
      (row) => row.englishImplementationFrozen,
    ),
    lifecycleLocked: MEN_CP_010_PERMANENT_ALLOCATION.every(
      (row) =>
        row.permanentIdentityFrozen &&
        row.solveModeFrozen &&
        !row.active &&
        !row.questionStudioDiscoverable &&
        row.questionBankStatus === "NOT_STORED" &&
        row.testEligibility === "INELIGIBLE" &&
        !row.publiclyPublishable,
    ),
  } as const;
}
