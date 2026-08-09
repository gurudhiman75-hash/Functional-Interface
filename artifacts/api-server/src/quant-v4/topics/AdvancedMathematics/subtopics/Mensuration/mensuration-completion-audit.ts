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

function row(
  packageId: MensurationPackageId,
  cpId: `MEN-CP-${string}`,
  title: string,
  implementationStatus: MensurationImplementationStatus,
  engineeringImplemented: boolean,
  englishAuthorityPresent: boolean,
  permanentQlRange: string | null,
  evidencePr: number | null,
  evidenceMergeCommit: string | null,
  nextAction: string,
): MensurationCanonicalProblemStatus {
  return {
    authority: MENSURATION_COMPLETION_AUDIT_AUTHORITY,
    packageId,
    cpId,
    title,
    implementationStatus,
    engineeringImplemented,
    englishAuthorityPresent,
    permanentQlRange,
    evidencePr,
    evidenceMergeCommit,
    nextAction,
    ...lockedProductState,
  };
}

export const MENSURATION_CANONICAL_PROBLEM_STATUS: readonly MensurationCanonicalProblemStatus[] = [
  row(
    "MEN-001",
    "MEN-CP-001",
    "Triangle Measurement Systems",
    "RUNTIME_PROOF_COMPLETE_ACTIVATION_LOCKED",
    true,
    true,
    null,
    100,
    "cdd6c24ad05d79822d8ec264e4290085166d5d94",
    "Retain runtime proof; complete cross-package activation review before product exposure.",
  ),
  row(
    "MEN-001",
    "MEN-CP-002",
    "Quadrilateral Measurement Systems",
    "RUNTIME_PROOF_COMPLETE_ACTIVATION_LOCKED",
    true,
    true,
    null,
    100,
    "cdd6c24ad05d79822d8ec264e4290085166d5d94",
    "Retain runtime proof; complete cross-package activation review before product exposure.",
  ),
  row(
    "MEN-001",
    "MEN-CP-003",
    "Circles, Arcs, Sectors & Annular Regions",
    "RUNTIME_PROOF_COMPLETE_ACTIVATION_LOCKED",
    true,
    true,
    null,
    100,
    "cdd6c24ad05d79822d8ec264e4290085166d5d94",
    "Retain runtime proof; complete cross-package activation review before product exposure.",
  ),
  row(
    "MEN-001",
    "MEN-CP-004",
    "Paths, Borders, Flooring, Fencing & Cost",
    "RUNTIME_PROOF_COMPLETE_ACTIVATION_LOCKED",
    true,
    true,
    null,
    100,
    "cdd6c24ad05d79822d8ec264e4290085166d5d94",
    "Retain runtime proof; complete cross-package activation review before product exposure.",
  ),
  row(
    "MEN-001",
    "MEN-CP-005",
    "Composite, Inscribed & Regular Plane Figures",
    "RUNTIME_PROOF_COMPLETE_ACTIVATION_LOCKED",
    true,
    true,
    null,
    110,
    "e3c69abddea7b5134d3e0d25c00ad20a93ad5985",
    "Retain runtime proof; complete cross-package activation review before product exposure.",
  ),
  row(
    "MEN-001",
    "MEN-CP-006",
    "Boundary Conservation, Scaling & Unit Transformation",
    "RUNTIME_PROOF_COMPLETE_ACTIVATION_LOCKED",
    true,
    true,
    null,
    134,
    "f40c02260b74c69178f8d103fd68278225a868dd",
    "Retain the completed MEN-001 runtime-proof scope; complete package activation review.",
  ),
  row(
    "MEN-002",
    "MEN-CP-007",
    "Cubes, Cuboids & Prisms",
    "ENGLISH_COMPLETE_APPROVED_INACTIVE",
    true,
    true,
    "MEN-002-QL-001..MEN-002-QL-043",
    326,
    "9f1fd985bc57659f96eedc92f81a02f87cfe30ce",
    "Retain approved inactive English authority; localise and activate only through later product gates.",
  ),
  row(
    "MEN-002",
    "MEN-CP-008",
    "Cylinders & Cones",
    "ENGLISH_IMPLEMENTATION_FROZEN_INACTIVE",
    true,
    true,
    "MEN-002-QL-044..MEN-002-QL-095",
    397,
    "660d6c20445483f3e50422a3633358e07b14f4c8",
    "Retain the source-closed frozen English implementation; localise and activate through later gates.",
  ),
  row(
    "MEN-002",
    "MEN-CP-009",
    "Spheres & Hemispheres",
    "ENGLISH_IMPLEMENTATION_FROZEN_INACTIVE",
    true,
    true,
    "MEN-002-QL-096..MEN-002-QL-123",
    656,
    "5b9b0d00c0741b66fa83db1f7790e74a799274ef",
    "Retain the V2 frozen English authority; complete human/source review, localisation and product activation separately.",
  ),
  row(
    "MEN-002",
    "MEN-CP-010",
    "Pyramids & Frustums",
    "DESIGN_ONLY_NOT_IMPLEMENTED",
    false,
    false,
    null,
    null,
    null,
    "Design and implement pyramids and frustums using the stable direct-solid and exact-arithmetic authorities.",
  ),
  row(
    "MEN-002",
    "MEN-CP-011",
    "Surface Exposure, Open/Closed & Hollow Solids",
    "IMPLEMENTATION_COMPLETE_ACTIVATION_LOCKED",
    true,
    true,
    null,
    647,
    "4e79dcae0fee1914cd7f4514c064b03e76288fab",
    "Complete genuine human source and English review, permanent QL allocation and multilingual parity before activation.",
  ),
  row(
    "MEN-002",
    "MEN-CP-012",
    "Recasting, Melting & Volume Conservation",
    "DESIGN_ONLY_NOT_IMPLEMENTED",
    false,
    false,
    null,
    null,
    null,
    "Implement conservation-led recasting after all required direct-solid authorities are stable.",
  ),
  row(
    "MEN-002",
    "MEN-CP-013",
    "Composite/Inscribed Solids, Tanks & Displacement",
    "DESIGN_ONLY_NOT_IMPLEMENTED",
    false,
    false,
    null,
    null,
    null,
    "Implement last, reusing stable direct-solid and conservation authorities without duplicating neighbouring ownership.",
  ),
] as const;

export const MENSURATION_UNIMPLEMENTED_CP_ORDER = [
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
  const implemented = rows.filter((item) => item.engineeringImplemented);
  const designOnly = rows.filter(
    (item) => item.implementationStatus === "DESIGN_ONLY_NOT_IMPLEMENTED",
  );
  const activated = rows.filter(
    (item) =>
      item.active ||
      item.questionStudioDiscoverable ||
      item.questionBankStatus !== "NOT_STORED" ||
      item.testEligibility !== "INELIGIBLE" ||
      item.publiclyPublishable,
  );

  return {
    authority: MENSURATION_COMPLETION_AUDIT_AUTHORITY,
    canonicalProblemCount: rows.length,
    uniqueCanonicalProblemCount: new Set(rows.map((item) => item.cpId)).size,
    packageCounts: countBy(rows, (item) => item.packageId),
    implementationStatusCounts: countBy(rows, (item) => item.implementationStatus),
    engineeringImplementedCount: implemented.length,
    englishAuthorityCount: rows.filter((item) => item.englishAuthorityPresent).length,
    designOnlyNotImplementedCount: designOnly.length,
    activationReadyCount: activated.length,
    questionStudioDiscoverableCount: rows.filter((item) => item.questionStudioDiscoverable).length,
    questionBankStoredCount: rows.filter((item) => item.questionBankStatus !== "NOT_STORED").length,
    testEligibleCount: rows.filter((item) => item.testEligibility !== "INELIGIBLE").length,
    publiclyPublishableCount: rows.filter((item) => item.publiclyPublishable).length,
    mensurationEngineeringComplete: implemented.length === rows.length,
    mensurationProductReady: activated.length === rows.length,
    nextImplementationOrder: [...MENSURATION_UNIMPLEMENTED_CP_ORDER],
    conclusion:
      "MENSURATION_PARTIALLY_IMPLEMENTED__TEN_OF_THIRTEEN__PRODUCT_ACTIVATION_ZERO" as const,
  };
}
