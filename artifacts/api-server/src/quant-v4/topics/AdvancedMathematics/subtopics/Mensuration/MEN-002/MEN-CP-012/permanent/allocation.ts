import {
  MEN_CP_012_CANONICAL_CLUSTERS,
  type MenCp012AnswerSemantic,
  type MenCp012CanonicalClusterId,
} from "../../cp012-foundation/merge-split-v4";

export const MEN_CP_012_PERMANENT_ALLOCATION_AUTHORITY =
  "MEN-CP012-PERMANENT-ALLOCATION-V4-V1" as const;

export const MEN_CP_012_PERMANENT_QL_IDS = Array.from(
  { length: 13 },
  (_unused, index) => `MEN-002-QL-${String(150 + index).padStart(3, "0")}`,
) as readonly `MEN-002-QL-${string}`[];

export type MenCp012PermanentQlId = `MEN-002-QL-${string}`;
export type MenCp012PermanentTemplateId = `MEN-CP012-TPL-${string}`;
export type MenCp012PermanentSolveModeId = `MEN-CP012-SM-${string}`;

export interface MenCp012PermanentAllocationEntry {
  readonly authority: typeof MEN_CP_012_PERMANENT_ALLOCATION_AUTHORITY;
  readonly packageId: "MEN-002";
  readonly cpId: "MEN-CP-012";
  readonly qlId: MenCp012PermanentQlId;
  readonly templateId: MenCp012PermanentTemplateId;
  readonly solveModeId: MenCp012PermanentSolveModeId;
  readonly clusterId: MenCp012CanonicalClusterId;
  readonly title: string;
  readonly governingInference: string;
  readonly reasoningSignature: string;
  readonly coreEvidenceIds: readonly string[];
  readonly representationEvidenceIds: readonly string[];
  readonly answerSemantic: MenCp012AnswerSemantic;
  readonly ownership: "CP012_RECAST_CONSERVATION" | "CP012_WHEN_RECAST_DECISIVE__CP011_WHEN_HOLLOW_GEOMETRY_ONLY";
  readonly allocationStatus: "PERMANENT_IDENTITY_ALLOCATED__ENGLISH_NOT_FROZEN__PRODUCT_LOCKED";
  readonly permanentIdentityFrozen: true;
  readonly solveModeFrozen: true;
  readonly englishImplementationFrozen: false;
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

if (MEN_CP_012_CANONICAL_CLUSTERS.length !== 13) {
  throw new Error("MEN-CP-012 canonical merge/split inventory must contain 13 permanent families");
}
if (MEN_CP_012_PERMANENT_QL_IDS.length !== MEN_CP_012_CANONICAL_CLUSTERS.length) {
  throw new Error("MEN-CP-012 permanent allocation count mismatch");
}

export const MEN_CP_012_PERMANENT_ALLOCATION: readonly MenCp012PermanentAllocationEntry[] =
  MEN_CP_012_CANONICAL_CLUSTERS.map((cluster, index) => ({
    authority: MEN_CP_012_PERMANENT_ALLOCATION_AUTHORITY,
    packageId: "MEN-002" as const,
    cpId: "MEN-CP-012" as const,
    qlId: MEN_CP_012_PERMANENT_QL_IDS[index]!,
    templateId: `MEN-CP012-TPL-${String(index + 1).padStart(3, "0")}` as MenCp012PermanentTemplateId,
    solveModeId: `MEN-CP012-SM-${String(index + 1).padStart(3, "0")}` as MenCp012PermanentSolveModeId,
    clusterId: cluster.clusterId,
    title: cluster.title,
    governingInference: cluster.governingInference,
    reasoningSignature: cluster.reasoningSignature,
    coreEvidenceIds: cluster.coreEvidenceIds,
    representationEvidenceIds: cluster.representationEvidenceIds,
    answerSemantic: cluster.answerSemantic,
    ownership: cluster.ownership,
    allocationStatus: "PERMANENT_IDENTITY_ALLOCATED__ENGLISH_NOT_FROZEN__PRODUCT_LOCKED" as const,
    permanentIdentityFrozen: true as const,
    solveModeFrozen: true as const,
    englishImplementationFrozen: false as const,
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
  }));

const byQlId = new Map(MEN_CP_012_PERMANENT_ALLOCATION.map((row) => [row.qlId, row]));
const byClusterId = new Map(MEN_CP_012_PERMANENT_ALLOCATION.map((row) => [row.clusterId, row]));

export function getMenCp012PermanentAllocation(qlId: MenCp012PermanentQlId) {
  const row = byQlId.get(qlId);
  if (!row) throw new Error(`Unknown MEN-CP-012 permanent QL: ${qlId}`);
  return row;
}

export function getMenCp012PermanentAllocationForCluster(clusterId: MenCp012CanonicalClusterId) {
  const row = byClusterId.get(clusterId);
  if (!row) throw new Error(`Unknown MEN-CP-012 canonical cluster: ${clusterId}`);
  return row;
}

export function auditMenCp012PermanentAllocation() {
  const qlIds = MEN_CP_012_PERMANENT_ALLOCATION.map((row) => row.qlId);
  const expected = Array.from(
    { length: 13 },
    (_unused, index) => `MEN-002-QL-${String(150 + index).padStart(3, "0")}`,
  );
  return {
    authority: MEN_CP_012_PERMANENT_ALLOCATION_AUTHORITY,
    permanentQlCount: qlIds.length,
    firstQlId: qlIds[0],
    lastQlId: qlIds.at(-1),
    uniqueQlCount: new Set(qlIds).size,
    uniqueClusterCount: new Set(MEN_CP_012_PERMANENT_ALLOCATION.map((row) => row.clusterId)).size,
    uniqueTemplateCount: new Set(MEN_CP_012_PERMANENT_ALLOCATION.map((row) => row.templateId)).size,
    uniqueSolveModeCount: new Set(MEN_CP_012_PERMANENT_ALLOCATION.map((row) => row.solveModeId)).size,
    contiguousQlRange: JSON.stringify(qlIds) === JSON.stringify(expected),
    englishImplementationFrozen: MEN_CP_012_PERMANENT_ALLOCATION.every((row) => row.englishImplementationFrozen),
    hollowOwnershipCount: MEN_CP_012_PERMANENT_ALLOCATION.filter(
      (row) => row.ownership === "CP012_WHEN_RECAST_DECISIVE__CP011_WHEN_HOLLOW_GEOMETRY_ONLY",
    ).length,
    lifecycleLocked: MEN_CP_012_PERMANENT_ALLOCATION.every(
      (row) =>
        row.permanentIdentityFrozen &&
        row.solveModeFrozen &&
        !row.englishImplementationFrozen &&
        !row.active &&
        !row.questionStudioDiscoverable &&
        row.questionBankStatus === "NOT_STORED" &&
        row.testEligibility === "INELIGIBLE" &&
        !row.publiclyPublishable,
    ),
  } as const;
}
