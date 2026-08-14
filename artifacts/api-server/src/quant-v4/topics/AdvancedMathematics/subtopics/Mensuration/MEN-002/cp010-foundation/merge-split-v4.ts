export const MEN_CP_010_MERGE_SPLIT_V4_AUTHORITY =
  "MEN-CP010-MERGE-SPLIT-V4-V1" as const;

export type MenCp010CanonicalClusterId =
  | "PYRAMID_VOLUME_DIRECT"
  | "PYRAMID_VOLUME_INVERSE_HEIGHT"
  | "RIGHT_PYRAMID_FRUSTUM_PYTHAGOREAN_DIRECT"
  | "RIGHT_PYRAMID_FRUSTUM_PYTHAGOREAN_INVERSE"
  | "PYRAMID_SURFACE_DIRECT"
  | "CONICAL_FRUSTUM_VOLUME_DIRECT"
  | "CONICAL_FRUSTUM_SURFACE_DIRECT"
  | "POLYGONAL_FRUSTUM_VOLUME_DIRECT"
  | "POLYGONAL_FRUSTUM_SURFACE_DIRECT"
  | "PYRAMID_VOLUME_INVERSE_BASE"
  | "CONICAL_FRUSTUM_VOLUME_INVERSE_HEIGHT"
  | "POLYGONAL_FRUSTUM_VOLUME_INVERSE_HEIGHT"
  | "SIMILAR_SOLID_VOLUME_RATIO"
  | "SIMILAR_SOLID_AREA_RATIO"
  | "SIMILAR_SOLID_VOLUME_RATIO_INVERSE"
  | "SIMILAR_SOLID_AREA_RATIO_INVERSE"
  | "PYRAMID_PRISM_SAME_BASE_HEIGHT_RATIO"
  | "FRUSTUM_SIMILAR_SECTION_HEIGHT"
  | "PYRAMID_CROSS_SECTION_SIMILARITY"
  | "FRUSTUM_CAPACITY_CONVERSION"
  | "PYRAMID_FRUSTUM_SURFACE_COST"
  | "PYRAMID_FRUSTUM_VOLUME_SCALING"
  | "PYRAMID_FRUSTUM_AREA_SCALING"
  | "PYRAMID_SURFACE_INVERSE"
  | "CONICAL_FRUSTUM_SURFACE_INVERSE"
  | "POLYGONAL_FRUSTUM_SURFACE_INVERSE";

export interface MenCp010CanonicalCluster {
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
  readonly disposition: "RETAIN_PERMANENT_FAMILY";
}

const C = (
  clusterId: MenCp010CanonicalClusterId,
  title: string,
  governingInference: string,
  coreEvidenceIds: readonly string[],
  representationEvidenceIds: readonly string[],
  answerSemantic: MenCp010CanonicalCluster["answerSemantic"],
): MenCp010CanonicalCluster => ({
  clusterId,
  title,
  governingInference,
  coreEvidenceIds,
  representationEvidenceIds,
  answerSemantic,
  disposition: "RETAIN_PERMANENT_FAMILY",
});

/**
 * Final reasoning-family inventory after Waves 01–03.
 *
 * Compression is by reasoning contract, not by formula spelling, shape noun or
 * context noun. A split is retained only where task direction, admissibility,
 * answer semantics or misconception structure materially changes.
 */
export const MEN_CP_010_CANONICAL_CLUSTERS: readonly MenCp010CanonicalCluster[] = [
  C(
    "PYRAMID_VOLUME_DIRECT",
    "Pyramid volume from base measure and vertical height",
    "Construct base area when required, then apply V = Bh/3 using vertical height.",
    ["MEN-CP010-PROT-SQUARE-PYRAMID-VOLUME"],
    [
      "MEN-CP010-PROT-RECTANGULAR-PYRAMID-VOLUME",
      "MEN-CP010-PROT-TRIANGULAR-PYRAMID-VOLUME",
      "V3-REGULAR-PYRAMID-VOLUME",
    ],
    "VOLUME",
  ),
  C(
    "PYRAMID_VOLUME_INVERSE_HEIGHT",
    "Pyramid vertical height from volume",
    "Rearrange V = Bh/3 to h = 3V/B; the target is linear and must remain vertical height.",
    ["MEN-CP010-PROT-SQUARE-PYRAMID-HEIGHT-FROM-VOLUME"],
    [],
    "LENGTH",
  ),
  C(
    "RIGHT_PYRAMID_FRUSTUM_PYTHAGOREAN_DIRECT",
    "Slant measure from vertical height and horizontal offset",
    "Build the governing right triangle and apply l² = h² + offset²; preserve exact surds when necessary.",
    ["MEN-CP010-PROT-SQUARE-PYRAMID-SLANT-HEIGHT"],
    [
      "MEN-CP010-PROT-CONICAL-FRUSTUM-SLANT-HEIGHT",
      "MEN-CP010-PROT-SQUARE-FRUSTUM-SLANT-HEIGHT",
      "V3-SURD-SLANT-REPRESENTATION",
    ],
    "LENGTH",
  ),
  C(
    "RIGHT_PYRAMID_FRUSTUM_PYTHAGOREAN_INVERSE",
    "Recover vertical height or corresponding offset from slant evidence",
    "Use l² - h² or l² - offset², then reconstruct the requested side/radius/height from the geometric offset.",
    ["MEN-CP010-PROT-SQUARE-PYRAMID-VERTICAL-HEIGHT"],
    [
      "CP010-D2-INV-CONICAL-FRUSTUM-OUTER-RADIUS",
      "CP010-D2-INV-SQUARE-FRUSTUM-LOWER-SIDE",
      "V3-PYRAMID-SIDE-FROM-L-H",
      "V3-FRUSTUM-H-FROM-L-DIFFERENCE",
    ],
    "LENGTH",
  ),
  C(
    "PYRAMID_SURFACE_DIRECT",
    "Regular-pyramid lateral or total surface area",
    "Use LSA = Pl/2; for total area include the base exactly once. Square-pyramid forms are parameterisations.",
    ["MEN-CP010-PROT-SQUARE-PYRAMID-LSA", "MEN-CP010-PROT-SQUARE-PYRAMID-TSA"],
    ["V3-REGULAR-PYRAMID-LSA", "V3-REGULAR-PYRAMID-TSA", "CP010-D2-APP-PYRAMID-TENT-CANVAS"],
    "SURFACE_AREA",
  ),
  C(
    "CONICAL_FRUSTUM_VOLUME_DIRECT",
    "Conical-frustum volume",
    "Apply V = πh(R² + Rr + r²)/3 and retain the mixed Rr term.",
    ["MEN-CP010-PROT-CONICAL-FRUSTUM-VOLUME"],
    ["CP010-D2-SOURCE-LEGACY-FRUSTUM-VOLUME", "V3-LEGACY-FRUSTUM-VOLUME", "V3-TRUNCATED-CONE-CONTEXT"],
    "VOLUME",
  ),
  C(
    "CONICAL_FRUSTUM_SURFACE_DIRECT",
    "Conical-frustum curved or total surface area",
    "Use CSA = π(R+r)l; for TSA include both circular ends. Numerical-π policies are representations, not families.",
    ["MEN-CP010-PROT-CONICAL-FRUSTUM-CSA", "MEN-CP010-PROT-CONICAL-FRUSTUM-TSA"],
    ["CP010-D2-APP-LAMPSHADE-AREA", "V3-NUMERICAL-PI-REPRESENTATION"],
    "SURFACE_AREA",
  ),
  C(
    "POLYGONAL_FRUSTUM_VOLUME_DIRECT",
    "Similar-base polygonal-frustum volume",
    "Apply h(A₁ + √(A₁A₂) + A₂)/3; the square-frustum formula is the corresponding-side special case.",
    ["MEN-CP010-PROT-SQUARE-FRUSTUM-VOLUME"],
    ["V3-REGULAR-FRUSTUM-VOLUME", "CP010-D2-SIMILAR-FRUSTUM-FULL-MINUS-CUT", "V3-TRUNCATED-PYRAMID-CONTEXT"],
    "VOLUME",
  ),
  C(
    "POLYGONAL_FRUSTUM_SURFACE_DIRECT",
    "Regular-polygon frustum lateral or total surface area",
    "Use LSA = (P₁+P₂)l/2; for total area include both corresponding bases.",
    ["MEN-CP010-PROT-SQUARE-FRUSTUM-LSA", "MEN-CP010-PROT-SQUARE-FRUSTUM-TSA"],
    ["V3-REGULAR-FRUSTUM-LSA"],
    "SURFACE_AREA",
  ),
  C(
    "PYRAMID_VOLUME_INVERSE_BASE",
    "Recover a pyramid base dimension from volume",
    "Use B = 3V/h, then recover the requested base dimension; square-base recovery introduces square-root admissibility.",
    ["CP010-D2-INV-SQUARE-PYRAMID-SIDE-FROM-VOLUME"],
    ["CP010-D2-INV-RECT-PYRAMID-LENGTH-FROM-VOLUME"],
    "LENGTH",
  ),
  C(
    "CONICAL_FRUSTUM_VOLUME_INVERSE_HEIGHT",
    "Conical-frustum vertical height from volume",
    "Cancel the declared π policy and isolate h while retaining R² + Rr + r² intact.",
    ["CP010-D2-INV-CONICAL-FRUSTUM-HEIGHT-FROM-VOLUME"],
    [],
    "LENGTH",
  ),
  C(
    "POLYGONAL_FRUSTUM_VOLUME_INVERSE_HEIGHT",
    "Polygonal-frustum vertical height from volume",
    "Isolate h from the similar-base frustum volume relation without introducing a quadratic side/radius solve.",
    ["CP010-D2-INV-SQUARE-FRUSTUM-HEIGHT-FROM-VOLUME"],
    [],
    "LENGTH",
  ),
  C(
    "SIMILAR_SOLID_VOLUME_RATIO",
    "Volume ratio from linear ratio",
    "For similar pyramids/frustums, cube the corresponding linear ratio.",
    ["CP010-D2-RATIO-VOLUME-FROM-LINEAR"],
    [],
    "RATIO",
  ),
  C(
    "SIMILAR_SOLID_AREA_RATIO",
    "Surface-area ratio from linear ratio",
    "For similar pyramids/frustums, square the corresponding linear ratio.",
    ["CP010-D2-RATIO-AREA-FROM-LINEAR"],
    [],
    "RATIO",
  ),
  C(
    "SIMILAR_SOLID_VOLUME_RATIO_INVERSE",
    "Linear ratio from volume ratio",
    "Take the exact cube root of a similar-solid volume ratio.",
    ["CP010-D2-RATIO-LINEAR-FROM-VOLUME"],
    [],
    "RATIO",
  ),
  C(
    "SIMILAR_SOLID_AREA_RATIO_INVERSE",
    "Linear ratio from surface-area ratio",
    "Take the exact square root of a similar-solid area ratio.",
    ["CP010-D2-RATIO-LINEAR-FROM-AREA"],
    [],
    "RATIO",
  ),
  C(
    "PYRAMID_PRISM_SAME_BASE_HEIGHT_RATIO",
    "Pyramid-to-prism volume comparison on equal base and height",
    "Use the structural one-third relation Vpyramid = Vprism/3 rather than similarity scaling.",
    ["CP010-D2-RATIO-PYRAMID-TO-PRISM"],
    [],
    "RATIO",
  ),
  C(
    "FRUSTUM_SIMILAR_SECTION_HEIGHT",
    "Parent or removed height from a frustum similarity section",
    "Use corresponding linear dimensions to reconstruct the full parent solid and the removed top height.",
    ["CP010-D2-SIMILAR-FULL-HEIGHT-FROM-FRUSTUM"],
    ["CP010-D2-SIMILAR-REMOVED-TOP-HEIGHT"],
    "LENGTH",
  ),
  C(
    "PYRAMID_CROSS_SECTION_SIMILARITY",
    "Parallel cross-section dimension inside a pyramid",
    "Apply the linear similarity fraction between apex-to-section height and full pyramid height.",
    ["CP010-D2-SIMILAR-CROSS-SECTION-SIDE"],
    [],
    "LENGTH",
  ),
  C(
    "FRUSTUM_CAPACITY_CONVERSION",
    "Frustum capacity with cubic-unit conversion",
    "Compute frustum volume first, then convert cubic centimetres to litres only at the semantic boundary.",
    ["CP010-D2-APP-BUCKET-CAPACITY-LITRES"],
    [],
    "CAPACITY",
  ),
  C(
    "PYRAMID_FRUSTUM_SURFACE_COST",
    "Pyramid or frustum surface cost",
    "Select the required surface measure, compute it, then multiply by the stated unit-area rate.",
    ["CP010-D2-APP-SURFACE-COST"],
    [],
    "COST",
  ),
  C(
    "PYRAMID_FRUSTUM_VOLUME_SCALING",
    "Volume percentage change under common linear scaling",
    "If all corresponding lengths scale by k, volume scales by k³; translate the factor to percentage change.",
    ["CP010-D2-SCALE-VOLUME-PERCENT-CHANGE"],
    [],
    "PERCENT_CHANGE",
  ),
  C(
    "PYRAMID_FRUSTUM_AREA_SCALING",
    "Surface-area percentage change under common linear scaling",
    "If all corresponding lengths scale by k, area scales by k²; translate the factor to percentage change.",
    ["CP010-D2-SCALE-AREA-PERCENT-CHANGE"],
    [],
    "PERCENT_CHANGE",
  ),
  C(
    "PYRAMID_SURFACE_INVERSE",
    "Pyramid slant height from lateral or total surface area",
    "Isolate the lateral component, then solve l from LSA = Pl/2; TSA is the same inverse after subtracting the base.",
    ["V3-PYRAMID-LSA-INVERSE-SLANT"],
    ["V3-PYRAMID-TSA-INVERSE-SLANT"],
    "LENGTH",
  ),
  C(
    "CONICAL_FRUSTUM_SURFACE_INVERSE",
    "Conical-frustum slant height from curved or total surface area",
    "Cancel π, remove end discs when present, then isolate l from (R+r)l.",
    ["V3-CONICAL-FRUSTUM-CSA-INVERSE-SLANT"],
    ["V3-CONICAL-FRUSTUM-TSA-INVERSE-SLANT"],
    "LENGTH",
  ),
  C(
    "POLYGONAL_FRUSTUM_SURFACE_INVERSE",
    "Polygonal-frustum slant height from lateral or total surface area",
    "Remove both bases for TSA, then isolate l from (P₁+P₂)l/2.",
    ["V3-POLYGONAL-FRUSTUM-LSA-INVERSE-SLANT"],
    ["V3-POLYGONAL-FRUSTUM-TSA-INVERSE-SLANT"],
    "LENGTH",
  ),
] as const;

export const MEN_CP_010_DEFERRED_SOURCE_GATED = [
  "V3-RADIUS-FROM-FRUSTUM-VOLUME-QUADRATIC",
  "V3-SIDE-FROM-FRUSTUM-VOLUME-QUADRATIC",
] as const;

export const MEN_CP_010_REASSIGNED_OWNERSHIP = [
  ["V3-HOLLOW-OPEN-FRUSTUM", "MEN-CP-011"],
  ["V3-RECAST-PYRAMID-FRUSTUM", "MEN-CP-012"],
  ["V3-COMPOSITE-INSCRIBED-FRUSTUM", "MEN-CP-013"],
] as const;

export function auditMenCp010MergeSplitV4() {
  const ids = MEN_CP_010_CANONICAL_CLUSTERS.map((row) => row.clusterId);
  const evidence = MEN_CP_010_CANONICAL_CLUSTERS.flatMap((row) => [
    ...row.coreEvidenceIds,
    ...row.representationEvidenceIds,
  ]);
  return {
    authority: MEN_CP_010_MERGE_SPLIT_V4_AUTHORITY,
    canonicalClusterCount: MEN_CP_010_CANONICAL_CLUSTERS.length,
    uniqueCanonicalClusterCount: new Set(ids).size,
    representedEvidenceCount: new Set(evidence).size,
    deferredSourceGatedCount: MEN_CP_010_DEFERRED_SOURCE_GATED.length,
    reassignedOwnershipCount: MEN_CP_010_REASSIGNED_OWNERSHIP.length,
    unresolvedCount: 0,
    productLocked: true,
  } as const;
}
