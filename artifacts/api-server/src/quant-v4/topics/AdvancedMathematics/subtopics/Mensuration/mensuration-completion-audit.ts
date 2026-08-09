export const MENSURATION_COMPLETION_AUDIT_AUTHORITY =
  "MENSURATION-13-CP-COMPLETION-AUDIT-V1" as const;

export type MensurationPackageId = "MEN-001" | "MEN-002";

export type MensurationImplementationStatus =
  | "RUNTIME_PROOF_COMPLETE_ACTIVATION_LOCKED"
  | "ENGLISH_COMPLETE_APPROVED_INACTIVE"
  | "ENGLISH_IMPLEMENTATION_FROZEN_INACTIVE"
  | "IMPLEMENTATION_COMPLETE_ACTIVATION_LOCKED"
  | "DESIGN_ONLY_NOT_IMPLEMENTED";

export interface MensurationCanonicalProblemStatus {
  authority: typeof MENSURATION_COMPLETION_AUDIT_AUTHORITY;
  packageId: MensurationPackageId;
  cpId: `MEN-CP-${string}`;
  title: string;
  implementationStatus: MensurationImplementationStatus;
  engineeringImplemented: boolean;
  englishAuthorityPresent: boolean;
  permanentQlRange: string | null;
  evidencePr: number | null;
  evidenceMergeCommit: string | null;
  nextAction: string;
  active: false;
  questionStudioDiscoverable: false;
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
}

const lockedProductState = {
  active: false,
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false,
};

export const MENSURATION_CANONICAL_PROBLEM_STATUS: readonly MensurationCanonicalProblemStatus[] = [
  {
    authority: MENSURATION_COMPLETION_AUDIT_AUTHORITY,
    packageId: "MEN-001",
    cpId: "MEN-CP-001",
    title: "Triangle Measurement Systems",
    implementationStatus: "RUNTIME_PROOF_COMPLETE_ACTIVATION_LOCKED",
    engineeringImplemented: true,
    englishAuthorityPresent: true,
    permanentQlRange: null,
    evidencePr: 100,
    evidenceMergeCommit: "cdd6c24ad05d79822d8ec264e4290085166d5d94",
    nextAction: "Retain runtime proof; complete cross-package activation review before product exposure.",
    ...lockedProductState,
  },
  {
    authority: MENSURATION_COMPLETION_AUDIT_AUTHORITY,
    packageId: "MEN-001",
    cpId: "MEN-CP-002",
    title: "Quadrilateral Measurement Systems",
    implementationStatus: "RUNTIME_PROOF_COMPLETE_ACTIVATION_LOCKED",
    engineeringImplemented: true,
    englishAuthorityPresent: true,
    permanentQlRange: null,
    evidencePr: 100,
    evidenceMergeCommit: "cdd6c24ad05d79822d8ec264e4290085166d5d94",
    nextAction: "Retain runtime proof; complete cross-package activation review before product exposure.",
    ...lockedProductState,
  },
  {
    authority: MENSURATION_COMPLETION_AUDIT_AUTHORITY,
    packageId: "MEN-001",
    cpId: "MEN-CP-003",
    title: "Circles, Arcs, Sectors & Annular Regions",
    implementationStatus: "RUNTIME_PROOF_COMPLETE_ACTIVATION_LOCKED",
    engineeringImplemented: true,
    englishAuthorityPresent: true,
    permanentQlRange: null,
    evidencePr: 100,
    evidenceMergeCommit: "cdd6c24ad05d79822d8ec264e4290085166d5d94",
    nextAction: "Retain runtime proof; complete cross-package activation review before product exposure.",
    ...lockedProductState,
  },
  {
    authority: MENSURATION_COMPLETION_AUDIT_AUTHORITY,
    packageId: "MEN-001",
    cpId: "MEN-CP-004",
    title: "Paths, Borders, Flooring, Fencing & Cost",
    implementationStatus: "RUNTIME_PROOF_COMPLETE_ACTIVATION_LOCKED",
    engineeringImplemented: true,
    englishAuthorityPresent: true,
    permanentQlRange: null,
    evidencePr: 100,
    evidenceMergeCommit: "cdd6c24ad05d79822d8ec264e4290085166d5d94",
    nextAction: "Retain runtime proof; complete cross-package activation review before product exposure.",
    ...lockedProductState,
  },
  {
    authority: MENSURATION_COMPLETION_AUDIT_AUTHORITY,
    packageId: "MEN-001",
    cpId: "MEN-CP-005",
    title: "Composite, Inscribed & Regular Plane Figures",
    implementationStatus: "RUNTIME_PROOF_COMPLETE_ACTIVATION_LOCKED",
    engineeringImplemented: true,
    englishAuthorityPresent: true,
    permanentQlRange: null,
    evidencePr: 110,
    evidenceMergeCommit: "e3c69abddea7b5134d3e0d25c00ad20a93ad5985",
    nextAction: "Retain runtime proof; complete cross-package activation review before product exposure.",
    ...lockedProductState,
  },
  {
    authority: MENSURATION_COMPLETION_AUDIT_AUTHORITY,
    packageId: "MEN-001",
    cpId: "MEN-CP-006",
    title: "Boundary Conservation, Scaling & Unit Transformation",
    implementationStatus: "RUNTIME_PROOF_COMPLETE_ACTIVATION_LOCKED",
    engineeringImplemented: true,
    englishAuthorityPresent: true,
    permanentQlRange: null,
    evidencePr: 134,
    evidenceMergeCommit: "f40c02260b74c69178f8d103fd68278225a868dd",
    nextAction: "Retain the completed MEN-001 runtime-proof scope; complete package activation review.",
    ...lockedProductState,
  },
  {
    authority: MENSURATION_COMPLETION_AUDIT_AUTHORITY,
    packageId: "MEN-002",
    cpId: "MEN-CP-007",
    title: "Cubes, Cuboids & Prisms",
    implementationStatus: "ENGLISH_COMPLETE_APPROVED_INACTIVE",
    engineeringImplemented: true,
    englishAuthorityPresent: true,
    permanentQlRange: "MEN-002-QL-001..MEN-002-QL-043",
    evidencePr: 326,
    evidenceMergeCommit: "9f1fd985bc57659f96eedc92f81a02f87cfe30ce",
    nextAction: "Retain approved inactive English authority; localise and activate only through later product gates.",
    ...lockedProductState,
  },
  {
    authority: MENSURATION_COMPLETION_AUDIT_AUTHORITY,
    packageId: "MEN-002",
    cpId: "MEN-CP-008",
    title: "Cylinders & Cones",
    implementationStatus: "ENGLISH_IMPLEMENTATION_FROZEN_INACTIVE",
    engineeringImplemented: true,
    englishAuthorityPresent: true,
    permanentQlRange: "MEN-002-QL-044..MEN-002-QL-095",
    evidencePr: 397,
    evidenceMergeCommit: "660d6c20445483f3e50422a3633358e07b14f4c8",
    nextAction: "Retain the source-closed frozen English implementation; localise and activate through later gates.",
    ...lockedProductState,
  },
  {
    authority: MENSURATION_COMPLETION_AUDIT_AUTHORITY,
    packageId: "MEN-002",
    cpId: "MEN-CP-009",
    title: "Spheres & Hemispheres",
    implementationStatus: "DESIGN_ONLY_NOT_IMPLEMENTED",
    engineeringImplemented: false,
    englishAuthorityPresent: false,
    permanentQlRange: null,
    evidencePr: null,
    evidenceMergeCommit: null,
    nextAction: "Design and implement end to end, beginning with direct and inverse sphere/hemisphere measurement.",
    ...lockedProductState,
  },
  {
    authority: MENSURATION_COMPLETION_AUDIT_AUTHORITY,
    packageId: "MEN-002",
    cpId: "MEN-CP-010",
    title: "Pyramids & Frustums",
    implementationStatus: "DESIGN_ONLY_NOT_IMPLEMENTED",
    engineeringImplemented: false,
    englishAuthorityPresent: false,
    permanentQlRange: null,
    evidencePr: null,
    evidenceMergeCommit: null,
    nextAction: "Design and implement pyramid and frustum families after CP-009 foundation contracts are stable.",
    ...lockedProductState,
  },
  {
    authority: MENSURATION_COMPLETION_AUDIT_AUTHORITY,
    packageId: "MEN-002",
    cpId: "MEN-CP-011",
    title: "Surface Exposure, Open/Closed & Hollow Solids",
    implementationStatus: "IMPLEMENTATION_COMPLETE_ACTIVATION_LOCKED",
    engineeringImplemented: true,
    englishAuthorityPresent: true,
    permanentQlRange: null,
    evidencePr: 647,
    evidenceMergeCommit: "4e79dcae0fee1914cd7f4514c064b03e76288fab",
    nextAction: "Complete genuine human source and English review, permanent QL allocation and multilingual parity before activation.",
    ...lockedProductState,
  },
  {
    authority: MENSURATION_COMPLETION_AUDIT_AUTHORITY,
    packageId: "MEN-002",
    cpId: "MEN-CP-012",
    title: "Recasting, Melting & Volume Conservation",
    implementationStatus: "DESIGN_ONLY_NOT_IMPLEMENTED",
    engineeringImplemented: false,
    englishAuthorityPresent: false,
    permanentQlRange: null,
    evidencePr: null,
    evidenceMergeCommit: null,
    nextAction: "Implement conservation-led recasting only after direct solid authorities are available.",
    ...lockedProductState,
  },
  {
    authority: MENSURATION_COMPLETION_AUDIT_AUTHORITY,
    packageId: "MEN-002",
    cpId: "MEN-CP-013",
    title: "Composite/Inscribed Solids, Tanks & Displacement",
    implementationStatus: "DESIGN_ONLY_NOT_IMPLEMENTED",
    engineeringImplemented: false,
    englishAuthorityPresent: false,
    permanentQlRange: null,
    evidencePr: null,
    evidenceMergeCommit: null,
    nextAction: "Implement last, reusing stable direct-solid and conservation authorities without duplicating neighbouring CP ownership.",
    ...lockedProductState,
  },
] as const;

export const MENSURATION_UNIMPLEMENTED_CP_ORDER = [
  "MEN-CP-009",
  "MEN-CP-010",
  "MEN-CP-012",
  "MEN-CP-013",
] as const;

function countBy<T>(items: readonly T[], keyOf: (item: T) => string) {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyOf(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

export function auditMensurationCompletion() {
  const rows = MENSURATION_CANONICAL_PROBLEM_STATUS;
  const implemented = rows.filter((row) => row.engineeringImplemented);
  const designOnly = rows.filter(
    (row) => row.implementationStatus === "DESIGN_ONLY_NOT_IMPLEMENTED",
  );
  const activated = rows.filter(
    (row) =>
      row.active ||
      row.questionStudioDiscoverable ||
      row.questionBankStatus !== "NOT_STORED" ||
      row.testEligibility !== "INELIGIBLE" ||
      row.publiclyPublishable,
  );

  return {
    authority: MENSURATION_COMPLETION_AUDIT_AUTHORITY,
    canonicalProblemCount: rows.length,
    uniqueCanonicalProblemCount: new Set(rows.map((row) => row.cpId)).size,
    packageCounts: countBy(rows, (row) => row.packageId),
    implementationStatusCounts: countBy(
      rows,
      (row) => row.implementationStatus,
    ),
    engineeringImplementedCount: implemented.length,
    englishAuthorityCount: rows.filter((row) => row.englishAuthorityPresent)
      .length,
    designOnlyNotImplementedCount: designOnly.length,
    activationReadyCount: activated.length,
    questionStudioDiscoverableCount: rows.filter(
      (row) => row.questionStudioDiscoverable,
    ).length,
    questionBankStoredCount: rows.filter(
      (row) => row.questionBankStatus !== "NOT_STORED",
    ).length,
    testEligibleCount: rows.filter(
      (row) => row.testEligibility !== "INELIGIBLE",
    ).length,
    publiclyPublishableCount: rows.filter((row) => row.publiclyPublishable)
      .length,
    mensurationEngineeringComplete: implemented.length === rows.length,
    mensurationProductReady: activated.length === rows.length,
    nextImplementationOrder: [...MENSURATION_UNIMPLEMENTED_CP_ORDER],
    conclusion:
      "MENSURATION_PARTIALLY_IMPLEMENTED__NINE_OF_THIRTEEN__PRODUCT_ACTIVATION_ZERO" as const,
  };
}
