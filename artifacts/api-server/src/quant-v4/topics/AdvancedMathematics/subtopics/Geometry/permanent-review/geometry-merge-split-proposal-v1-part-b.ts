import { defineGeometryMergeSplitFamilyV1 } from "./geometry-merge-split-proposal-v1-types";

export const GEO_MERGE_SPLIT_PROPOSAL_V1_PART_B = Object.freeze([
  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP005_AA_SIMILARITY_CORRESPONDENCE", cpId: "GEO-CP-005", learnerDecision: "Recover correspondence from AA similarity", candidateIds: Object.freeze(["GEO-TMP-CP005-AA-CORRESPONDENCE-V1"]), mergeRationale: "Correspondence recovery after AA evidence is distinct from selecting a similarity criterion or applying a scale factor." }),
  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP005_SSS_SIMILARITY_CRITERION", cpId: "GEO-CP-005", learnerDecision: "Select SSS similarity criterion", candidateIds: Object.freeze(["GEO-TMP-GAP-W10-CP005-SSS-SIMILARITY-V1"]), mergeRationale: "Criterion recognition is a proof-establishment decision and is not merged with correspondence recovery." }),
  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP005_MISSING_SIDE_FROM_SIMILARITY", cpId: "GEO-CP-005", learnerDecision: "Find a corresponding side using similarity scale", candidateIds: Object.freeze(["GEO-TMP-CP005-MISSING-SIDE-V1"]), mergeRationale: "Direct missing-side recovery uses a linear corresponding-side ratio and remains a primitive scale-transfer family." }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP005_PERIMETER_SIDE_SCALE_TRANSFER",
    cpId: "GEO-CP-005",
    learnerDecision: "Transfer between corresponding side scale and perimeter scale",
    candidateIds: Object.freeze(["GEO-TMP-GAP-W4-CP005-PERIMETER-TO-SIDE-V1", "GEO-TMP-GAP-W4-CP005-SIDE-TO-PERIMETER-V1"]),
    mergeRationale: "The two directions use the same linear similarity scale factor and differ only in which side of the reversible proportional relation is unknown.",
  }),
  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP005_AREA_RATIO_TO_SIDE_RATIO", cpId: "GEO-CP-005", learnerDecision: "Recover side ratio from area ratio of similar triangles", candidateIds: Object.freeze(["GEO-TMP-GAP-W10-CP005-AREA-RATIO-TO-SIDE-RATIO-V1"]), mergeRationale: "Area-ratio recovery introduces the square-law relation and square-root step, so it must not be merged into linear side/perimeter scaling." }),
  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP005_BPT_DIRECT", cpId: "GEO-CP-005", learnerDecision: "Basic proportionality theorem direct", candidateIds: Object.freeze(["GEO-TMP-CP005-BPT-DIRECT-V1"]), mergeRationale: "Direct BPT segment recovery is a separate theorem operation; BPT converse remains source-deferred." }),

  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP006_CENTROID_DIRECT_INVERSE",
    cpId: "GEO-CP-006",
    learnerDecision: "Use the centroid 2:1 median relation",
    candidateIds: Object.freeze(["GEO-TMP-CP006-CENTROID-2TO1-V1", "GEO-TMP-GAP-W6-CP006-CENTROID-INVERSE-MEDIAN-V1"]),
    mergeRationale: "Direct section recovery and inverse whole-median recovery are algebraic projections of the same fixed 2:1 centroid relation.",
  }),
  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP006_ANGLE_BISECTOR_THEOREM", cpId: "GEO-CP-006", learnerDecision: "Use the angle-bisector theorem", candidateIds: Object.freeze(["GEO-TMP-CP006-ANGLE-BISECTOR-RATIO-V1"]), mergeRationale: "Opposite-side proportional division is a distinct theorem family." }),
  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP006_MIDPOINT_THEOREM_DIRECT", cpId: "GEO-CP-006", learnerDecision: "Use the midpoint theorem to find the joining segment", candidateIds: Object.freeze(["GEO-TMP-CP006-MIDPOINT-THEOREM-V1"]), mergeRationale: "The direct midpoint theorem starts from two midpoints; its converse has different givens and inference direction." }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP006_TRIANGLE_CENTRE_IDENTIFICATION",
    cpId: "GEO-CP-006",
    learnerDecision: "Identify a triangle centre from its defining construction",
    candidateIds: Object.freeze(["GEO-TMP-GAP-CP006-CIRCUMCENTRE-IDENTIFY-V1", "GEO-TMP-GAP-W3-CP006-INCENTRE-IDENTIFY-V1", "GEO-TMP-GAP-W3-CP006-RIGHT-TRIANGLE-ORTHOCENTRE-V1"]),
    mergeRationale: "Circumcentre, incentre and orthocentre examples are parameterized centre-from-defining-concurrency recognition under one learner decision." }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP006_INCENTRE_ANGLE_DIRECT_INVERSE",
    cpId: "GEO-CP-006",
    learnerDecision: "Use the incentre opposite-angle relation",
    candidateIds: Object.freeze(["GEO-TMP-GAP-W3-CP006-INCENTRE-ANGLE-DIRECT-V1", "GEO-TMP-GAP-W3-CP006-INCENTRE-ANGLE-INVERSE-V1"]),
    mergeRationale: "Direct and inverse questions solve the same fixed incentre-angle equation with a different requested variable." }),
  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP006_PERP_BISECTOR_EQUIDISTANCE_DIRECT", cpId: "GEO-CP-006", learnerDecision: "Use perpendicular-bisector membership to infer equal-distance geometry", candidateIds: Object.freeze(["GEO-TMP-GAP-W6-CP006-PERP-BISECTOR-EQUIDISTANT-ANGLE-V1"]), mergeRationale: "Forward locus use remains separate because it starts from perpendicular-bisector membership and derives an equidistance consequence." }),
  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP006_PERP_BISECTOR_CONVERSE", cpId: "GEO-CP-006", learnerDecision: "Use equal distances to infer perpendicular-bisector membership", candidateIds: Object.freeze(["GEO-TMP-GAP-W6-CP006-PERP-BISECTOR-CONVERSE-RHOMBUS-V1"]), mergeRationale: "The converse reverses the logical precondition and is explicitly a separate solve family in the Geometry authority." }),
  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP006_MIDPOINT_CONVERSE", cpId: "GEO-CP-006", learnerDecision: "Use midpoint-plus-parallel evidence to infer the second midpoint relation", candidateIds: Object.freeze(["GEO-TMP-GAP-W6-CP006-MIDPOINT-CONVERSE-SEGMENT-V1"]), mergeRationale: "The midpoint converse has a distinct inference direction and evidence contract from the direct midpoint theorem." }),

  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP007_PYTHAGOREAN_CONVERSE", cpId: "GEO-CP-007", learnerDecision: "Classify a triangle by the Pythagorean converse", candidateIds: Object.freeze(["GEO-TMP-CP007-PYTHAGOREAN-CONVERSE-V1"]), mergeRationale: "Side-length classification by equality of squares is its own theorem decision." }),
  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP007_HYPOTENUSE_MEDIAN_LENGTH", cpId: "GEO-CP-007", learnerDecision: "Find the median to the hypotenuse", candidateIds: Object.freeze(["GEO-TMP-CP007-HYPOTENUSE-MEDIAN-V1"]), mergeRationale: "Metric recovery of the median is distinct from identifying the circumcentre location." }),
  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP007_RIGHT_TRIANGLE_CIRCUMCENTRE", cpId: "GEO-CP-007", learnerDecision: "Identify the right-triangle circumcentre at the hypotenuse midpoint", candidateIds: Object.freeze(["GEO-TMP-GAP-W11-CP007-RIGHT-CIRCUMCENTRE-MIDPOINT-V1"]), mergeRationale: "Centre identification is a structural recognition task rather than a length calculation." }),

  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP008_QUADRILATERAL_ANGLE_SUM", cpId: "GEO-CP-008", learnerDecision: "Find the fourth angle of a quadrilateral", candidateIds: Object.freeze(["GEO-TMP-CP008-FOURTH-ANGLE-V1"]), mergeRationale: "General 360-degree angle-sum recovery is distinct from named-quadrilateral properties." }),
  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP008_PARALLELOGRAM_DIAGONAL_BISECTION", cpId: "GEO-CP-008", learnerDecision: "Use parallelogram diagonal bisection", candidateIds: Object.freeze(["GEO-TMP-CP008-PARALLELOGRAM-DIAGONAL-V1"]), mergeRationale: "Metric diagonal bisection is a distinct application family." }),
  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP008_RHOMBUS_DIAGONAL_PERPENDICULAR", cpId: "GEO-CP-008", learnerDecision: "Use perpendicular diagonals of a rhombus", candidateIds: Object.freeze(["GEO-TMP-CP008-RHOMBUS-DIAGONAL-ANGLE-V1"]), mergeRationale: "Rhombus perpendicular-diagonal reasoning has its own theorem and target." }),
  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP008_PARALLELOGRAM_PROPERTY_RECOGNITION", cpId: "GEO-CP-008", learnerDecision: "Recognize a core parallelogram property", candidateIds: Object.freeze(["GEO-TMP-GAP-W11-CP008-PARALLELOGRAM-PROPERTY-RECOGNITION-V1"]), mergeRationale: "Property recognition is separate from applying diagonal bisection numerically." }),
  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP008_SQUARE_COMBINED_PROPERTIES", cpId: "GEO-CP-008", learnerDecision: "Recognize the stronger combined properties of a square", candidateIds: Object.freeze(["GEO-TMP-GAP-W11-CP008-SQUARE-STRONGER-SUBTYPE-V1"]), mergeRationale: "Square subtype classification combines stronger properties and must not be hidden inside general parallelogram or rhombus families." }),
]);
