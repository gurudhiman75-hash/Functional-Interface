import { MEN_CP_009_FROZEN_QLS } from "../permanent/registry";

export const MEN_CP_009_COVERAGE_V2_AUTHORITY =
  "MEN-CP009-COVERAGE-CLOSURE-V2" as const;

export type MenCp009SurfaceVolumeFamilyId =
  | "SPHERE_OR_HEMISPHERE_CURVED_SURFACE_VOLUME_RATIO"
  | "RADIUS_FROM_CURVED_SURFACE_VOLUME_RATIO"
  | "HEMISPHERE_TOTAL_SURFACE_VOLUME_RATIO"
  | "HEMISPHERE_RADIUS_FROM_TOTAL_SURFACE_VOLUME_RATIO";

export interface MenCp009CoverageQl {
  qlId: `MEN-002-QL-${string}`;
  templateId: `MEN-CP009-TPL-${string}`;
  familyId: MenCp009SurfaceVolumeFamilyId;
  title: string;
  solveMode:
    | "findCurvedSurfaceVolumeRatio"
    | "findRadiusFromCurvedSurfaceVolumeRatio"
    | "findHemisphereTotalSurfaceVolumeRatio"
    | "findHemisphereRadiusFromTotalSurfaceVolumeRatio";
  answerSemantic: "RATIO" | "LENGTH";
  permanentIdentityFrozen: true;
  questionStudioDiscoverable: false;
  publiclyPublishable: false;
}

export const MEN_CP_009_SURFACE_VOLUME_QLS: readonly MenCp009CoverageQl[] = [
  {
    qlId: "MEN-002-QL-120",
    templateId: "MEN-CP009-TPL-025",
    familyId: "SPHERE_OR_HEMISPHERE_CURVED_SURFACE_VOLUME_RATIO",
    title: "Surface-area-to-volume ratio from radius",
    solveMode: "findCurvedSurfaceVolumeRatio",
    answerSemantic: "RATIO",
    permanentIdentityFrozen: true,
    questionStudioDiscoverable: false,
    publiclyPublishable: false,
  },
  {
    qlId: "MEN-002-QL-121",
    templateId: "MEN-CP009-TPL-026",
    familyId: "RADIUS_FROM_CURVED_SURFACE_VOLUME_RATIO",
    title: "Radius from surface-area-to-volume ratio",
    solveMode: "findRadiusFromCurvedSurfaceVolumeRatio",
    answerSemantic: "LENGTH",
    permanentIdentityFrozen: true,
    questionStudioDiscoverable: false,
    publiclyPublishable: false,
  },
  {
    qlId: "MEN-002-QL-122",
    templateId: "MEN-CP009-TPL-027",
    familyId: "HEMISPHERE_TOTAL_SURFACE_VOLUME_RATIO",
    title: "Hemisphere total-area-to-volume ratio from radius",
    solveMode: "findHemisphereTotalSurfaceVolumeRatio",
    answerSemantic: "RATIO",
    permanentIdentityFrozen: true,
    questionStudioDiscoverable: false,
    publiclyPublishable: false,
  },
  {
    qlId: "MEN-002-QL-123",
    templateId: "MEN-CP009-TPL-028",
    familyId: "HEMISPHERE_RADIUS_FROM_TOTAL_SURFACE_VOLUME_RATIO",
    title: "Hemisphere radius from total-area-to-volume ratio",
    solveMode: "findHemisphereRadiusFromTotalSurfaceVolumeRatio",
    answerSemantic: "LENGTH",
    permanentIdentityFrozen: true,
    questionStudioDiscoverable: false,
    publiclyPublishable: false,
  },
] as const;

export const MEN_CP_009_EXPLICIT_SOLVE_MODE_DISPOSITION = [
  {
    sourceSolveMode: "findSphereSurfaceOrVolume",
    disposition: "IMPLEMENTED_BASE_V1",
    evidence: "MEN-002-QL-096..MEN-002-QL-099",
  },
  {
    sourceSolveMode: "findSphereRadius",
    disposition: "IMPLEMENTED_BASE_V1",
    evidence: "MEN-002-QL-100..MEN-002-QL-103",
  },
  {
    sourceSolveMode: "findHemisphereCsaOrTsa",
    disposition: "IMPLEMENTED_BASE_V1",
    evidence: "MEN-002-QL-104..MEN-002-QL-105 and MEN-002-QL-107..MEN-002-QL-108",
  },
  {
    sourceSolveMode: "findHemisphereVolume",
    disposition: "IMPLEMENTED_BASE_V1",
    evidence: "MEN-002-QL-106, MEN-002-QL-109 and MEN-002-QL-110",
  },
  {
    sourceSolveMode: "compareSphereAndHemisphere",
    disposition: "IMPLEMENTED_BASE_V1",
    evidence: "MEN-002-QL-113..MEN-002-QL-119",
  },
  {
    sourceSolveMode: "findSphericalShellMaterial",
    disposition: "REASSIGNED_IMPLEMENTED_CP011",
    evidence: "MEN-CP011-SPHERICAL-SHELLS-WAVE-01-V1",
  },
  {
    sourceSolveMode: "findNumberOfSmallSpheres",
    disposition: "REASSIGNED_CP012",
    evidence: "Volume-conservation ownership; not duplicated in CP-009",
  },
  {
    sourceSolveMode: "findSurfaceVolumeRatio",
    disposition: "IMPLEMENTED_COVERAGE_V2",
    evidence: "MEN-002-QL-120..MEN-002-QL-123",
  },
] as const;

export const MEN_CP_009_FROZEN_QLS_V2 = [
  ...MEN_CP_009_FROZEN_QLS,
  ...MEN_CP_009_SURFACE_VOLUME_QLS,
] as const;

export function auditMenCp009CoverageV2() {
  const qlIds = MEN_CP_009_FROZEN_QLS_V2.map((row) => row.qlId);
  const expected = Array.from(
    { length: 28 },
    (_unused, index) => `MEN-002-QL-${String(96 + index).padStart(3, "0")}`,
  );
  const dispositions = MEN_CP_009_EXPLICIT_SOLVE_MODE_DISPOSITION.map(
    (row) => row.sourceSolveMode,
  );

  return {
    authority: MEN_CP_009_COVERAGE_V2_AUTHORITY,
    permanentQlCount: qlIds.length,
    baseQlCount: MEN_CP_009_FROZEN_QLS.length,
    coverageQlCount: MEN_CP_009_SURFACE_VOLUME_QLS.length,
    firstQlId: qlIds[0],
    lastQlId: qlIds.at(-1),
    uniqueQlCount: new Set(qlIds).size,
    contiguousQlRange: JSON.stringify(qlIds) === JSON.stringify(expected),
    explicitSolveModeCount: dispositions.length,
    uniqueExplicitSolveModeCount: new Set(dispositions).size,
    unresolvedExplicitSolveModeCount: MEN_CP_009_EXPLICIT_SOLVE_MODE_DISPOSITION.filter(
      (row) => !row.disposition.startsWith("IMPLEMENTED") && !row.disposition.startsWith("REASSIGNED"),
    ).length,
    lifecycleLocked: MEN_CP_009_FROZEN_QLS_V2.every(
      (row) =>
        row.permanentIdentityFrozen &&
        !row.questionStudioDiscoverable &&
        !row.publiclyPublishable,
    ),
  } as const;
}
