export const MEN_CP_010_SATURATION_V3_AUTHORITY = "MEN-CP010-SOURCE-SATURATION-WAVE-03-V1" as const;

export type MenCp010SaturationDisposition =
  | "RETAIN_CLUSTER"
  | "MERGE_AS_REPRESENTATION"
  | "MERGE_EXISTING_CLUSTER"
  | "DEFER_SOURCE_REQUIRED"
  | "REASSIGN_CP011"
  | "REASSIGN_CP012"
  | "REASSIGN_CP013"
  | "NO_DISTINCT_SOURCE_FAMILY";

export type MenCp010SaturationRow = {
  id: string;
  axis: "DIRECT" | "INVERSE" | "REPRESENTATION" | "CONTEXT" | "RATIO" | "OWNERSHIP" | "SOURCE";
  disposition: MenCp010SaturationDisposition;
  cluster: string;
  executable: boolean;
  rationale: string;
};

const R = (id: string, axis: MenCp010SaturationRow["axis"], disposition: MenCp010SaturationDisposition, cluster: string, executable: boolean, rationale: string): MenCp010SaturationRow => ({ id, axis, disposition, cluster, executable, rationale });

export const MEN_CP_010_SATURATION_V3_ROWS: readonly MenCp010SaturationRow[] = [
  R("V3-REGULAR-PYRAMID-VOLUME", "REPRESENTATION", "MERGE_AS_REPRESENTATION", "PYRAMID_VOLUME_DIRECT", false, "Regular-polygon base volume is V=Bh/3, already owned by the direct pyramid-volume contract."),
  R("V3-REGULAR-PYRAMID-LSA", "DIRECT", "MERGE_AS_REPRESENTATION", "PYRAMID_SURFACE_DIRECT", true, "General perimeter form LSA=Pl/2 subsumes the square-pyramid special case."),
  R("V3-REGULAR-PYRAMID-TSA", "DIRECT", "MERGE_AS_REPRESENTATION", "PYRAMID_SURFACE_DIRECT", true, "General base-area plus perimeter form TSA=B+Pl/2 is a representation of direct pyramid surface measurement."),
  R("V3-REGULAR-FRUSTUM-LSA", "DIRECT", "MERGE_AS_REPRESENTATION", "POLYGONAL_FRUSTUM_SURFACE_DIRECT", true, "Corresponding regular-polygon perimeters generalise square-frustum lateral area."),
  R("V3-REGULAR-FRUSTUM-VOLUME", "DIRECT", "MERGE_AS_REPRESENTATION", "POLYGONAL_FRUSTUM_VOLUME_DIRECT", true, "Similar-base frustum volume by base areas generalises the square-frustum formula."),
  R("V3-PYRAMID-LSA-INVERSE-SLANT", "INVERSE", "RETAIN_CLUSTER", "PYRAMID_SURFACE_INVERSE", true, "Surface-area evidence changes task direction and requires isolating slant height."),
  R("V3-PYRAMID-TSA-INVERSE-SLANT", "INVERSE", "MERGE_EXISTING_CLUSTER", "PYRAMID_SURFACE_INVERSE", true, "Subtract the base then use the same surface inverse contract."),
  R("V3-CONICAL-FRUSTUM-CSA-INVERSE-SLANT", "INVERSE", "RETAIN_CLUSTER", "CONICAL_FRUSTUM_SURFACE_INVERSE", true, "CSA evidence isolates l after exact pi cancellation."),
  R("V3-CONICAL-FRUSTUM-TSA-INVERSE-SLANT", "INVERSE", "MERGE_EXISTING_CLUSTER", "CONICAL_FRUSTUM_SURFACE_INVERSE", true, "Subtract end discs then use the same exact-pi surface inverse contract."),
  R("V3-POLYGONAL-FRUSTUM-LSA-INVERSE-SLANT", "INVERSE", "RETAIN_CLUSTER", "POLYGONAL_FRUSTUM_SURFACE_INVERSE", true, "Polygonal frustum surface evidence isolates slant height from perimeter data."),
  R("V3-POLYGONAL-FRUSTUM-TSA-INVERSE-SLANT", "INVERSE", "MERGE_EXISTING_CLUSTER", "POLYGONAL_FRUSTUM_SURFACE_INVERSE", true, "Subtract both bases before the same polygonal surface inverse."),
  R("V3-PYRAMID-SIDE-FROM-L-H", "INVERSE", "MERGE_EXISTING_CLUSTER", "RIGHT_PYRAMID_FRUSTUM_PYTHAGOREAN_INVERSE", false, "Recovering half-side from l²-h² is the same right-triangle inverse already proved for frustum offsets."),
  R("V3-FRUSTUM-H-FROM-L-DIFFERENCE", "INVERSE", "MERGE_EXISTING_CLUSTER", "RIGHT_PYRAMID_FRUSTUM_PYTHAGOREAN_INVERSE", false, "Vertical-height recovery from slant and corresponding-dimension difference is the same Pythagorean inverse contract."),
  R("V3-SURD-SLANT-REPRESENTATION", "REPRESENTATION", "MERGE_AS_REPRESENTATION", "RIGHT_PYRAMID_FRUSTUM_PYTHAGOREAN_DIRECT", true, "Non-triple states require exact surd output but not a new reasoning family."),
  R("V3-NUMERICAL-PI-REPRESENTATION", "REPRESENTATION", "MERGE_AS_REPRESENTATION", "CONICAL_FRUSTUM_DIRECT", false, "Exact pi, 22/7 and exact 3.14 are state representations already supported by Wave 01."),
  R("V3-TRUNCATED-CONE-CONTEXT", "CONTEXT", "MERGE_AS_REPRESENTATION", "CONICAL_FRUSTUM_DIRECT", false, "A truncated cone is a conical frustum, not a separate family."),
  R("V3-TRUNCATED-PYRAMID-CONTEXT", "CONTEXT", "MERGE_AS_REPRESENTATION", "POLYGONAL_FRUSTUM_DIRECT", false, "A truncated regular pyramid is a polygonal frustum representation."),
  R("V3-BUCKET-LAMPSHADE-COST-VARIANTS", "CONTEXT", "MERGE_EXISTING_CLUSTER", "PYRAMID_FRUSTUM_APPLICATION", false, "Bucket, lampshade, canvas and rate wording remain capacity/surface/cost representations."),
  R("V3-RADIUS-FROM-FRUSTUM-VOLUME-QUADRATIC", "INVERSE", "DEFER_SOURCE_REQUIRED", "HIGHER_ALGEBRA_FRUSTUM_INVERSE", false, "Unknown radius in the full frustum-volume equation is quadratic; do not invent a mensuration QL without direct exam-source evidence."),
  R("V3-SIDE-FROM-FRUSTUM-VOLUME-QUADRATIC", "INVERSE", "DEFER_SOURCE_REQUIRED", "HIGHER_ALGEBRA_FRUSTUM_INVERSE", false, "Unknown corresponding side in the full polygonal-frustum volume equation is quadratic and source-gated."),
  R("V3-SURFACE-VOLUME-RATIO", "RATIO", "NO_DISTINCT_SOURCE_FAMILY", "COMPARISON_RATIO", false, "Repository source search found no CP-010-specific surface:volume family beyond direct formula composition; do not create a formula-combination QL by speculation."),
  R("V3-HOLLOW-OPEN-FRUSTUM", "OWNERSHIP", "REASSIGN_CP011", "SURFACE_EXPOSURE", false, "Open/hollow exposure remains CP-011 when that transformation is decisive."),
  R("V3-RECAST-PYRAMID-FRUSTUM", "OWNERSHIP", "REASSIGN_CP012", "VOLUME_CONSERVATION", false, "Melting/recasting remains CP-012."),
  R("V3-COMPOSITE-INSCRIBED-FRUSTUM", "OWNERSHIP", "REASSIGN_CP013", "COMPOSITE_TOPOLOGY", false, "Composite/inscribed/tank/displacement topology remains CP-013."),
  R("V3-LEGACY-FRUSTUM-VOLUME", "SOURCE", "MERGE_EXISTING_CLUSTER", "CONICAL_FRUSTUM_VOLUME_DIRECT", false, "Recovered men-frustum-vol is already represented, including the Rr cross-term misconception."),
  R("V3-LEGACY-PYRAMID-SLANT", "SOURCE", "MERGE_EXISTING_CLUSTER", "PYRAMID_SURFACE_DIRECT", false, "Recovered men-pyramid-slant is already represented, including vertical/slant confusion."),
] as const;

export const MEN_CP_010_SATURATION_EXECUTABLE_IDS = MEN_CP_010_SATURATION_V3_ROWS.filter((row) => row.executable).map((row) => row.id);

export function auditMenCp010SaturationV3() {
  const rows = MEN_CP_010_SATURATION_V3_ROWS;
  return {
    authority: MEN_CP_010_SATURATION_V3_AUTHORITY,
    rowCount: rows.length,
    executableCount: rows.filter((r) => r.executable).length,
    retainedNewClusterCount: new Set(rows.filter((r) => r.disposition === "RETAIN_CLUSTER").map((r) => r.cluster)).size,
    retainedNewClusters: [...new Set(rows.filter((r) => r.disposition === "RETAIN_CLUSTER").map((r) => r.cluster))],
    deferredSourceGatedCount: rows.filter((r) => r.disposition === "DEFER_SOURCE_REQUIRED").length,
    ownershipCount: rows.filter((r) => r.axis === "OWNERSHIP").length,
    unresolvedCount: rows.filter((r) => !r.disposition).length,
    permanentQlCount: 0,
    productLocked: true,
  } as const;
}
