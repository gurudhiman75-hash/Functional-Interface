export const MEN_CP_010_DISCOVERY_V2_AUTHORITY = "MEN-CP010-DISCOVERY-WAVE-02-V1" as const;

export type MenCp010DiscoveryAxis =
  | "INVERSE"
  | "RATIO_SCALING"
  | "SIMILAR_SECTION"
  | "APPLICATION"
  | "SOURCE_LEGACY"
  | "OWNERSHIP";

export type MenCp010DiscoveryDisposition =
  | "PROVISIONALLY_RETAIN"
  | "MERGE_WITH_EXISTING"
  | "MERGE_AS_REPRESENTATION"
  | "REASSIGN_CP011"
  | "REASSIGN_CP012"
  | "REASSIGN_CP013";

export type MenCp010DiscoveryCandidateId =
  | "CP010-D2-INV-SQUARE-PYRAMID-SIDE-FROM-VOLUME"
  | "CP010-D2-INV-RECT-PYRAMID-LENGTH-FROM-VOLUME"
  | "CP010-D2-INV-CONICAL-FRUSTUM-HEIGHT-FROM-VOLUME"
  | "CP010-D2-INV-SQUARE-FRUSTUM-HEIGHT-FROM-VOLUME"
  | "CP010-D2-INV-CONICAL-FRUSTUM-OUTER-RADIUS"
  | "CP010-D2-INV-SQUARE-FRUSTUM-LOWER-SIDE"
  | "CP010-D2-RATIO-VOLUME-FROM-LINEAR"
  | "CP010-D2-RATIO-AREA-FROM-LINEAR"
  | "CP010-D2-RATIO-LINEAR-FROM-VOLUME"
  | "CP010-D2-RATIO-LINEAR-FROM-AREA"
  | "CP010-D2-RATIO-PYRAMID-TO-PRISM"
  | "CP010-D2-SIMILAR-FULL-HEIGHT-FROM-FRUSTUM"
  | "CP010-D2-SIMILAR-REMOVED-TOP-HEIGHT"
  | "CP010-D2-SIMILAR-CROSS-SECTION-SIDE"
  | "CP010-D2-SIMILAR-FRUSTUM-FULL-MINUS-CUT"
  | "CP010-D2-APP-BUCKET-CAPACITY-LITRES"
  | "CP010-D2-APP-LAMPSHADE-AREA"
  | "CP010-D2-APP-PYRAMID-TENT-CANVAS"
  | "CP010-D2-APP-SURFACE-COST"
  | "CP010-D2-SCALE-VOLUME-PERCENT-CHANGE"
  | "CP010-D2-SCALE-AREA-PERCENT-CHANGE"
  | "CP010-D2-SOURCE-LEGACY-FRUSTUM-VOLUME"
  | "CP010-D2-SOURCE-LEGACY-PYRAMID-SLANT"
  | "CP010-D2-OWN-HOLLOW-FRUSTUM"
  | "CP010-D2-OWN-RECAST-PYRAMID-FRUSTUM"
  | "CP010-D2-OWN-INSCRIBED-COMPOSITE";

export interface MenCp010DiscoveryCandidate {
  id: MenCp010DiscoveryCandidateId;
  axis: MenCp010DiscoveryAxis;
  cluster: string;
  disposition: MenCp010DiscoveryDisposition;
  source: "MEN-002-DESIGN" | "LEGACY-MOTIF" | "OWNERSHIP-AUDIT";
  rationale: string;
  executable: boolean;
}

export interface MenCp010DiscoveryProbe {
  authority: typeof MEN_CP_010_DISCOVERY_V2_AUTHORITY;
  candidateId: MenCp010DiscoveryCandidateId;
  seed: string;
  stem: string;
  answer: string;
  options: Array<{ label: "A" | "B" | "C" | "D"; value: string; isCorrect: boolean }>;
  correctIndex: number;
  verification: { valid: boolean; method: string };
  misconceptionLabels: string[];
  productLocked: true;
  permanentQlId: null;
}

const C = (
  id: MenCp010DiscoveryCandidateId,
  axis: MenCp010DiscoveryAxis,
  cluster: string,
  disposition: MenCp010DiscoveryDisposition,
  source: MenCp010DiscoveryCandidate["source"],
  rationale: string,
  executable = true,
): MenCp010DiscoveryCandidate => ({ id, axis, cluster, disposition, source, rationale, executable });

export const MEN_CP_010_DISCOVERY_V2_CANDIDATES: readonly MenCp010DiscoveryCandidate[] = [
  C("CP010-D2-INV-SQUARE-PYRAMID-SIDE-FROM-VOLUME", "INVERSE", "PYRAMID_VOLUME_INVERSE_BASE", "PROVISIONALLY_RETAIN", "MEN-002-DESIGN", "Square-root admissibility changes the inverse answer contract."),
  C("CP010-D2-INV-RECT-PYRAMID-LENGTH-FROM-VOLUME", "INVERSE", "PYRAMID_VOLUME_INVERSE_BASE", "MERGE_AS_REPRESENTATION", "MEN-002-DESIGN", "Same inverse-volume reasoning with a rectangular-base representation."),
  C("CP010-D2-INV-CONICAL-FRUSTUM-HEIGHT-FROM-VOLUME", "INVERSE", "CONICAL_FRUSTUM_VOLUME_INVERSE", "PROVISIONALLY_RETAIN", "MEN-002-DESIGN", "Inverse frustum volume requires preserving the Rr cross-term and declared pi cancellation."),
  C("CP010-D2-INV-SQUARE-FRUSTUM-HEIGHT-FROM-VOLUME", "INVERSE", "SQUARE_FRUSTUM_VOLUME_INVERSE", "PROVISIONALLY_RETAIN", "MEN-002-DESIGN", "Polygonal-frustum inverse has no pi but retains the mixed base term."),
  C("CP010-D2-INV-CONICAL-FRUSTUM-OUTER-RADIUS", "INVERSE", "FRUSTUM_PYTHAGOREAN_DIMENSION_INVERSE", "PROVISIONALLY_RETAIN", "MEN-002-DESIGN", "Recover radius difference from l^2-h^2, then reconstruct the requested radius."),
  C("CP010-D2-INV-SQUARE-FRUSTUM-LOWER-SIDE", "INVERSE", "FRUSTUM_PYTHAGOREAN_DIMENSION_INVERSE", "MERGE_AS_REPRESENTATION", "MEN-002-DESIGN", "Same offset-reconstruction contract represented by corresponding square sides."),
  C("CP010-D2-RATIO-VOLUME-FROM-LINEAR", "RATIO_SCALING", "SIMILAR_SOLID_VOLUME_RATIO", "PROVISIONALLY_RETAIN", "MEN-002-DESIGN", "Linear ratio must be cubed for similar-solid volume."),
  C("CP010-D2-RATIO-AREA-FROM-LINEAR", "RATIO_SCALING", "SIMILAR_SOLID_AREA_RATIO", "PROVISIONALLY_RETAIN", "MEN-002-DESIGN", "Linear ratio must be squared for surface area."),
  C("CP010-D2-RATIO-LINEAR-FROM-VOLUME", "RATIO_SCALING", "SIMILAR_SOLID_VOLUME_RATIO_INVERSE", "PROVISIONALLY_RETAIN", "MEN-002-DESIGN", "Cube-root inverse changes the task direction and misconception profile."),
  C("CP010-D2-RATIO-LINEAR-FROM-AREA", "RATIO_SCALING", "SIMILAR_SOLID_AREA_RATIO_INVERSE", "PROVISIONALLY_RETAIN", "MEN-002-DESIGN", "Square-root inverse changes the task direction and answer semantics."),
  C("CP010-D2-RATIO-PYRAMID-TO-PRISM", "RATIO_SCALING", "PYRAMID_PRISM_SAME_BASE_HEIGHT_RATIO", "PROVISIONALLY_RETAIN", "MEN-002-DESIGN", "Uses the one-third structural relation rather than similarity scaling."),
  C("CP010-D2-SIMILAR-FULL-HEIGHT-FROM-FRUSTUM", "SIMILAR_SECTION", "FRUSTUM_SIMILAR_SECTION_HEIGHT", "PROVISIONALLY_RETAIN", "MEN-002-DESIGN", "Reconstructs the parent solid from corresponding linear dimensions."),
  C("CP010-D2-SIMILAR-REMOVED-TOP-HEIGHT", "SIMILAR_SECTION", "FRUSTUM_SIMILAR_SECTION_HEIGHT", "MERGE_AS_REPRESENTATION", "MEN-002-DESIGN", "Same similarity system with the removed top as target."),
  C("CP010-D2-SIMILAR-CROSS-SECTION-SIDE", "SIMILAR_SECTION", "PYRAMID_CROSS_SECTION_SIMILARITY", "PROVISIONALLY_RETAIN", "MEN-002-DESIGN", "Finds an internal parallel cross-section by a linear similarity fraction."),
  C("CP010-D2-SIMILAR-FRUSTUM-FULL-MINUS-CUT", "SIMILAR_SECTION", "FRUSTUM_VOLUME_DERIVATION", "MERGE_WITH_EXISTING", "MEN-002-DESIGN", "Full-minus-cut is a derivation/presentation path for the retained direct frustum-volume family."),
  C("CP010-D2-APP-BUCKET-CAPACITY-LITRES", "APPLICATION", "FRUSTUM_CAPACITY_CONVERSION", "PROVISIONALLY_RETAIN", "MEN-002-DESIGN", "Capacity target plus cm^3-to-litre conversion adds a dimensional representation burden."),
  C("CP010-D2-APP-LAMPSHADE-AREA", "APPLICATION", "FRUSTUM_SURFACE_CONTEXT", "MERGE_AS_REPRESENTATION", "MEN-002-DESIGN", "Lampshade wording is a direct frustum lateral-area context, not a new formula contract."),
  C("CP010-D2-APP-PYRAMID-TENT-CANVAS", "APPLICATION", "PYRAMID_SURFACE_CONTEXT", "MERGE_AS_REPRESENTATION", "MEN-002-DESIGN", "Tent/canvas wording is a lateral-area representation when no exposure transformation is required."),
  C("CP010-D2-APP-SURFACE-COST", "APPLICATION", "PYRAMID_FRUSTUM_SURFACE_COST", "PROVISIONALLY_RETAIN", "MEN-002-DESIGN", "Area must be selected first and then multiplied by a rate with cost semantics."),
  C("CP010-D2-SCALE-VOLUME-PERCENT-CHANGE", "RATIO_SCALING", "PYRAMID_FRUSTUM_VOLUME_SCALING", "PROVISIONALLY_RETAIN", "MEN-002-DESIGN", "All linear dimensions scale by k while volume scales by k^3."),
  C("CP010-D2-SCALE-AREA-PERCENT-CHANGE", "RATIO_SCALING", "PYRAMID_FRUSTUM_AREA_SCALING", "PROVISIONALLY_RETAIN", "MEN-002-DESIGN", "All linear dimensions scale by k while area scales by k^2."),
  C("CP010-D2-SOURCE-LEGACY-FRUSTUM-VOLUME", "SOURCE_LEGACY", "CONICAL_FRUSTUM_VOLUME", "MERGE_WITH_EXISTING", "LEGACY-MOTIF", "Legacy men-frustum-vol is already represented by Wave 01 direct frustum volume and its Rr misconception boundary.", false),
  C("CP010-D2-SOURCE-LEGACY-PYRAMID-SLANT", "SOURCE_LEGACY", "SQUARE_PYRAMID_TSA", "MERGE_WITH_EXISTING", "LEGACY-MOTIF", "Legacy men-pyramid-slant is already represented by Wave 01 pyramid TSA/slant-height reasoning.", false),
  C("CP010-D2-OWN-HOLLOW-FRUSTUM", "OWNERSHIP", "HOLLOW_SURFACE_TRANSFORMATION", "REASSIGN_CP011", "OWNERSHIP-AUDIT", "Hollow/open/closed exposure is owned by MEN-CP-011 when it is the decisive transformation.", false),
  C("CP010-D2-OWN-RECAST-PYRAMID-FRUSTUM", "OWNERSHIP", "VOLUME_CONSERVATION", "REASSIGN_CP012", "OWNERSHIP-AUDIT", "Melting/recasting is owned by MEN-CP-012 even when a pyramid or frustum is a source/target shape.", false),
  C("CP010-D2-OWN-INSCRIBED-COMPOSITE", "OWNERSHIP", "COMPOSITE_INSCRIBED", "REASSIGN_CP013", "OWNERSHIP-AUDIT", "Inscribed/composite containment is owned by MEN-CP-013 when topology is decisive.", false),
] as const;
