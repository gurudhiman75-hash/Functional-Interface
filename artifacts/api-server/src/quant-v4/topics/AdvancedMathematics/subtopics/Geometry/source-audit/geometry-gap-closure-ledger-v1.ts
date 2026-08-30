export type GeometryGapClosureState =
  | "IMPLEMENTED"
  | "MERGED_EXISTING_AUTHORITY"
  | "OWNED_OTHER_CHAPTER"
  | "DEFERRED_SOURCE_EVIDENCE";

export interface GeometryGapClosureEntry {
  readonly cpId: string;
  readonly gapId: string;
  readonly state: GeometryGapClosureState;
  readonly resolution: string;
  readonly prototypeIds?: readonly string[];
  readonly revisitTrigger?: string;
}

const E = (cpId:string,gap:string,state:GeometryGapClosureState,resolution:string,prototypeIds?:readonly string[],revisitTrigger?:string):GeometryGapClosureEntry => Object.freeze({cpId,gapId:`${cpId}/${gap}`,state,resolution,prototypeIds:prototypeIds?Object.freeze([...prototypeIds]):undefined,revisitTrigger});

export const GEO_GAP_CLOSURE_LEDGER_V1: readonly GeometryGapClosureEntry[] = Object.freeze([
  E("GEO-CP-001","AROUND_POINT_SUM","IMPLEMENTED","Source-backed equal-angle full-turn recovery is executable.",["GEO-TMP-GAP-W9-CP001-AROUND-POINT-EQUAL-ANGLES-V1"]),
  E("GEO-CP-001","ALGEBRAIC_X_INTERSECTION","MERGED_EXISTING_AUTHORITY","Algebraic x is a numeric wrapper around the existing vertical-angle/linear-pair learner decision; it does not create a new Geometry theorem identity.",["GEO-TMP-CP001-VERTICAL-ANGLE-V1","GEO-TMP-CP001-LINEAR-PAIR-V1"]),
  E("GEO-CP-001","COMPLEMENTARY_SUPPLEMENTARY_IDENTIFICATION","IMPLEMENTED","Exact complement/supplement relation is now executable from SSC CHSL evidence.",["GEO-TMP-GAP-W13-CP001-COMPLEMENT-SUPPLEMENT-RELATION-V1"]),

  E("GEO-CP-002","ALTERNATE_ANGLE_TRANSFER","IMPLEMENTED","Alternate-interior transfer is source-backed and executable.",["GEO-TMP-GAP-W9-CP002-ALTERNATE-INTERIOR-V1"]),
  E("GEO-CP-002","CONVERSE_PARALLELISM","DEFERRED_SOURCE_EVIDENCE","The theorem is valid but the final SSC-only sweep did not find a clean exact PYQ meeting the remediation provenance standard.",undefined,"Reopen only when an SSC/Punjab target-exam PYQ directly requires equal corresponding/alternate/co-interior evidence to infer parallelism."),
  E("GEO-CP-002","MULTI_TRANSVERSAL_OR_TRIANGLE_PARALLEL_CHAIN","DEFERRED_SOURCE_EVIDENCE","No clean target-exam source established a materially distinct multi-transversal/triangle-parallel learner decision beyond existing angle-transfer and synthesis authorities.",undefined,"Reopen on a direct SSC/Punjab PYQ with a distinct multi-line theorem graph."),

  E("GEO-CP-003","ISOSCELES_CONVERSE","MERGED_EXISTING_AUTHORITY","Forward and converse isosceles relations share one bidirectional isosceles theorem authority; direction is a parameter, not a QL split.",["GEO-TMP-CP003-ISOSCELES-BASE-V1"]),
  E("GEO-CP-003","SIDE_ANGLE_ORDERING","IMPLEMENTED","Greater-angle/greater-opposite-side ordering is now source-backed and executable.",["GEO-TMP-GAP-W13-CP003-SIDE-ANGLE-ORDERING-V1"]),
  E("GEO-CP-003","INTEGER_TRIANGLE_INEQUALITY_COUNT_OR_VALIDITY","IMPLEMENTED","Strict triangle-inequality integer counting is executable.",["GEO-TMP-GAP-W9-CP003-TRIANGLE-INEQUALITY-INTEGER-COUNT-V1"]),
  E("GEO-CP-003","TRIANGLE_CLASSIFICATION_OR_CLAIM","IMPLEMENTED","Universal strict triangle-inequality claim recognition is executable.",["GEO-TMP-GAP-W9-CP003-TRIANGLE-INEQUALITY-CLAIM-V1"]),

  E("GEO-CP-004","SSS_SAS_ASA_AAS_VARIANTS","IMPLEMENTED","Criterion-selection authority now has source-backed SAS evidence; SSS/SAS/ASA/AAS are evidence modes under the same learner decision.",["GEO-TMP-GAP-W10-CP004-SAS-CRITERION-V1","GEO-TMP-CP004-RHS-CRITERION-V1"]),
  E("GEO-CP-004","SSA_AAA_INSUFFICIENCY","IMPLEMENTED","AAA and SSA invalid-general-congruence variants are source-owned under one insufficiency decision.",["GEO-TMP-GAP-W10-CP004-INVALID-CONGRUENCE-CRITERION-V1"]),
  E("GEO-CP-004","CONGRUENCE_EVIDENCE_SUFFICIENCY","IMPLEMENTED","Two equal side pairs plus equal perimeter forcing SSS is executable.",["GEO-TMP-GAP-W10-CP004-CONGRUENCE-EVIDENCE-SUFFICIENCY-V1"]),
  E("GEO-CP-004","CPCT_MISSING_SIDE_OR_ANGLE","MERGED_EXISTING_AUTHORITY","Which corresponding part is unknown is a target parameter of the existing CPCT consequence authority.",["GEO-TMP-CP004-CPCT-CORRESPONDENCE-V1"]),

  E("GEO-CP-005","SAS_SSS_SIMILARITY","IMPLEMENTED","Similarity criterion authority now includes a source-backed SSS evidence mode; AA/SAS/SSS remain parameterized criterion evidence.",["GEO-TMP-GAP-W10-CP005-SSS-SIMILARITY-V1","GEO-TMP-CP005-AA-CORRESPONDENCE-V1"]),
  E("GEO-CP-005","BPT_CONVERSE","DEFERRED_SOURCE_EVIDENCE","The theorem exists in shared authority, but no clean exact SSC PYQ was found in the closure sweep that makes converse parallelism the learner decision.",undefined,"Reopen on a direct target-exam PYQ requiring proportional side division to infer a parallel line."),
  E("GEO-CP-005","PERIMETER_RATIO_SIMILARITY_SCALE","IMPLEMENTED","Approved Wave 4 covers perimeter-to-side and side-to-perimeter scale directions.",["GEO-TMP-GAP-W4-CP005-PERIMETER-TO-SIDE-V1","GEO-TMP-GAP-W4-CP005-SIDE-TO-PERIMETER-V1"]),
  E("GEO-CP-005","AREA_RATIO_SIMILARITY_SCALE_OWNERSHIP_REVIEW","IMPLEMENTED","Source evidence confirms Geometry owns the similar-triangle area-to-linear scale theorem when that theorem is the learner decision.",["GEO-TMP-GAP-W10-CP005-AREA-RATIO-TO-SIDE-RATIO-V1"]),
  E("GEO-CP-005","NESTED_SIMILARITY_CHAIN","MERGED_EXISTING_AUTHORITY","Nested similarity is synthesis/topology composition, already represented by multi-theorem similarity synthesis rather than a standalone base QL.",["GEO-TMP-GAP-W2-CP014-COMMON-TANGENT-SIMILARITY-V1"]),

  E("GEO-CP-006","CENTRE_IDENTIFICATION","IMPLEMENTED","Circumcentre, incentre and right-triangle orthocentre identification paths are executable.",["GEO-TMP-GAP-CP006-CIRCUMCENTRE-IDENTIFY-V1","GEO-TMP-GAP-W3-CP006-INCENTRE-IDENTIFY-V1","GEO-TMP-GAP-W3-CP006-RIGHT-TRIANGLE-ORTHOCENTRE-V1"]),
  E("GEO-CP-006","CIRCUMCENTRE_OR_INCENTRE_ANGLE_PROPERTY","IMPLEMENTED","Source-observed direct and inverse incentre angle-property directions are executable under the centre-angle authority.",["GEO-TMP-GAP-W3-CP006-INCENTRE-ANGLE-DIRECT-V1","GEO-TMP-GAP-W3-CP006-INCENTRE-ANGLE-INVERSE-V1"]),
  E("GEO-CP-006","PERPENDICULAR_BISECTOR_EQUAL_DISTANCE_AND_CONVERSE","IMPLEMENTED","Direct equal-distance and converse placement paths are executable.",["GEO-TMP-GAP-W6-CP006-PERP-BISECTOR-EQUIDISTANT-ANGLE-V1","GEO-TMP-GAP-W6-CP006-PERP-BISECTOR-CONVERSE-RHOMBUS-V1"]),
  E("GEO-CP-006","CENTROID_INVERSE","IMPLEMENTED","Inverse median recovery from a known centroid section is executable.",["GEO-TMP-GAP-W6-CP006-CENTROID-INVERSE-MEDIAN-V1"]),
  E("GEO-CP-006","MIDPOINT_CONVERSE","IMPLEMENTED","Midpoint + parallel-line converse segment recovery is executable.",["GEO-TMP-GAP-W6-CP006-MIDPOINT-CONVERSE-SEGMENT-V1"]),

  E("GEO-CP-007","RIGHT_TRIANGLE_CIRCUMCENTRE_MIDPOINT_RELATION","IMPLEMENTED","Hypotenuse-midpoint circumcentre recognition is source-backed and executable.",["GEO-TMP-GAP-W11-CP007-RIGHT-CIRCUMCENTRE-MIDPOINT-V1"]),
  E("GEO-CP-007","RIGHT_TRIANGLE_PROPERTY_REVERSE_OR_CLAIM","MERGED_EXISTING_AUTHORITY","Reverse/claim wording is already covered by Pythagorean-converse and right-triangle classification authority.",["GEO-TMP-CP007-PYTHAGOREAN-CONVERSE-V1"]),

  E("GEO-CP-008","RECTANGLE_PROPERTIES","MERGED_EXISTING_AUTHORITY","Rectangle properties are parameter values of the shared quadrilateral property-recognition authority; no distinct learner decision was established.",["GEO-TMP-GAP-W11-CP008-PARALLELOGRAM-PROPERTY-RECOGNITION-V1"]),
  E("GEO-CP-008","SQUARE_STRONGER_SUBTYPE","IMPLEMENTED","Combined rectangle/rhombus diagonal inheritance for squares is executable.",["GEO-TMP-GAP-W11-CP008-SQUARE-STRONGER-SUBTYPE-V1"]),
  E("GEO-CP-008","KITE_TRAPEZIUM_PROPERTY_RECOGNITION","DEFERRED_SOURCE_EVIDENCE","The final SSC sweep did not find clean exact target-exam evidence justifying a permanent kite/trapezium recognition path at this standard.",undefined,"Reopen on direct SSC/Punjab recruitment PYQ evidence."),
  E("GEO-CP-008","CONVERSE_QUADRILATERAL_CLASSIFICATION","IMPLEMENTED","Property-to-class recognition is represented by the source-backed parallelogram property/classification candidate.",["GEO-TMP-GAP-W11-CP008-PARALLELOGRAM-PROPERTY-RECOGNITION-V1"]),
  E("GEO-CP-008","INSUFFICIENT_PROPERTY_SETS","MERGED_EXISTING_AUTHORITY","Insufficient property combinations belong to misconception/negative-evidence variants of the same classification authority, not a separate theorem QL.",["GEO-TMP-GAP-W11-CP008-PARALLELOGRAM-PROPERTY-RECOGNITION-V1"]),

  E("GEO-CP-009","INTERIOR_SUM_AND_INVERSE","IMPLEMENTED","Interior-angle-sum inversion to side count is executable.",["GEO-TMP-GAP-W8-CP009-INTERIOR-SUM-TO-SIDES-V1"]),
  E("GEO-CP-009","GENERAL_EXTERIOR_SUM_OR_MISSING_ANGLE","IMPLEMENTED","Convex polygon exterior-sum invariant is executable.",["GEO-TMP-GAP-W8-CP009-EXTERIOR-SUM-INVARIANT-V1"]),
  E("GEO-CP-009","MIXED_POLYGON_ANGLE_CHAIN_OR_CLAIM","IMPLEMENTED","Interior sum to side count to regular interior/exterior difference chain is executable.",["GEO-TMP-GAP-W8-CP009-INTERIOR-SUM-ANGLE-DIFFERENCE-V1"]),

  E("GEO-CP-010","EQUAL_CHORDS_EQUAL_CENTRAL_ANGLES_OR_ARCS_AND_CONVERSE","IMPLEMENTED","Source-observed equal-chord to equal-central-angle direction is executable; arc/converse wording parameterizes the same circle-equivalence authority absent evidence for a distinct split.",["GEO-TMP-GAP-W7-CP010-EQUAL-CHORD-CENTRAL-ANGLE-V1"]),
  E("GEO-CP-010","CHORD_DISTANCE_RELATION_BOTH_DIRECTIONS","IMPLEMENTED","Baseline distance-to-chord and Wave-7 chord-to-distance directions jointly cover the equivalence.",["GEO-TMP-CP010-EQUAL-CENTRE-DISTANCE-CHORD-V1","GEO-TMP-GAP-W7-CP010-EQUAL-CHORD-CENTRE-DISTANCE-V1"]),
  E("GEO-CP-010","CENTRE_PERP_CONFIGURATION_INVERSE","IMPLEMENTED","Centre-through-chord-midpoint to perpendicular direction is executable.",["GEO-TMP-GAP-W7-CP010-CENTRE-BISECTOR-PERPENDICULAR-V1"]),

  E("GEO-CP-011","ANGLE_IN_SEMICIRCLE","IMPLEMENTED","Direct angle-in-a-semicircle recognition is approved in Wave 1.",["GEO-TMP-GAP-CP011-SEMICIRCLE-ANGLE-V1"]),
  E("GEO-CP-011","SAME_SEGMENT_ANGLE","IMPLEMENTED","Same-segment angle transfer is executable.",["GEO-TMP-GAP-W7-CP011-SAME-SEGMENT-ANGLE-V1"]),
  E("GEO-CP-011","CYCLIC_EXTERIOR_ANGLE","IMPLEMENTED","Cyclic exterior-angle chain is executable.",["GEO-TMP-GAP-W7-CP011-CYCLIC-EXTERIOR-CENTRAL-V1"]),
  E("GEO-CP-011","CYCLIC_CONVERSE","DEFERRED_SOURCE_EVIDENCE","Multiple source sweeps did not produce clean SSC evidence for the converse at the required standard.",undefined,"Reopen on direct target-exam evidence requiring opposite supplementary/exterior-angle evidence to infer cyclicity."),
  E("GEO-CP-011","SEMICIRCLE_PLUS_CYCLIC_CHAIN","IMPLEMENTED","Semicircle + same-segment multi-step chain is executable.",["GEO-TMP-GAP-W7-CP011-SEMICIRCLE-SAME-SEGMENT-CHAIN-V1"]),

  E("GEO-CP-012","ANGLE_BETWEEN_TANGENTS","IMPLEMENTED","Angle between two tangents is approved in Wave 1.",["GEO-TMP-GAP-CP012-ANGLE-BETWEEN-TANGENTS-V1"]),
  E("GEO-CP-012","TANGENT_CHORD_ALTERNATE_SEGMENT","IMPLEMENTED","Tangent-chord alternate-segment angle is approved in Wave 1.",["GEO-TMP-GAP-CP012-TANGENT-CHORD-V1"]),
  E("GEO-CP-012","COMMON_TANGENT_TWO_CIRCLES","IMPLEMENTED","Direct common-tangent measurement is approved in Wave 2.",["GEO-TMP-GAP-W2-CP012-DIRECT-COMMON-TANGENT-V1"]),
  E("GEO-CP-012","INCIRCLE_CONTACT_SEGMENT_REPRESENTATION","MERGED_EXISTING_AUTHORITY","Two contact segments from the same triangle vertex are the equal-tangents-from-an-external-point decision with incircle-specific object names.",["GEO-TMP-CP012-EQUAL-TANGENTS-V1"]),

  E("GEO-CP-013","REVERSE_UNKNOWN_POSITION_POWER_TOPOLOGIES","IMPLEMENTED","Unknown external segment appearing in both external and whole secant is executable with exact positive quadratic root.",["GEO-TMP-GAP-W12-CP013-REVERSE-UNKNOWN-EXTERNAL-SECANT-V1"]),
  E("GEO-CP-013","POWER_TOPOLOGY_CLAIM_OR_RECOGNITION","MERGED_EXISTING_AUTHORITY","Topology recognition is a selector over the existing intersecting-chord, secant-secant and tangent-secant power authorities.",["GEO-TMP-CP013-INTERSECTING-CHORDS-V1","GEO-TMP-CP013-SECANT-SECANT-V1","GEO-TMP-CP013-TANGENT-SECANT-V1"]),

  E("GEO-CP-014","CENTRAL_OR_INSCRIBED_PLUS_TANGENT_SYNTHESIS","IMPLEMENTED","Tangent to central to inscribed-angle synthesis is approved in Wave 2.",["GEO-TMP-GAP-W2-CP014-TANGENT-CENTRAL-INSCRIBED-V1"]),
  E("GEO-CP-014","COMMON_TANGENT_PLUS_SIMILARITY_SYNTHESIS","IMPLEMENTED","Common-tangent plus similarity synthesis is approved in Wave 2.",["GEO-TMP-GAP-W2-CP014-COMMON-TANGENT-SIMILARITY-V1"]),
  E("GEO-CP-014","CONGRUENCE_PLUS_PARALLEL_SYNTHESIS","IMPLEMENTED","Two distinct source-backed congruence + parallel theorem graphs are approved in Wave 5.",["GEO-TMP-GAP-W5-CP014-PARALLELOGRAM-EXTENSION-MIDPOINT-V1","GEO-TMP-GAP-W5-CP014-EQUAL-PARALLEL-DIAGONAL-CPCT-V1"]),
  E("GEO-CP-014","MULTI_THEOREM_STATEMENT_COMPARISON_OR_DATA_SUFFICIENCY","OWNED_OTHER_CHAPTER","Statement comparison/data sufficiency is a question-format decision owned by Data Sufficiency/statement evaluation. Geometry supplies theorem operands but must not allocate a duplicate Geometry QL."),
]);

export const GEO_GAP_CLOSURE_COUNTS_V1 = Object.freeze({
  total: GEO_GAP_CLOSURE_LEDGER_V1.length,
  implemented: GEO_GAP_CLOSURE_LEDGER_V1.filter((entry) => entry.state === "IMPLEMENTED").length,
  merged: GEO_GAP_CLOSURE_LEDGER_V1.filter((entry) => entry.state === "MERGED_EXISTING_AUTHORITY").length,
  ownedOtherChapter: GEO_GAP_CLOSURE_LEDGER_V1.filter((entry) => entry.state === "OWNED_OTHER_CHAPTER").length,
  sourceDeferred: GEO_GAP_CLOSURE_LEDGER_V1.filter((entry) => entry.state === "DEFERRED_SOURCE_EVIDENCE").length,
});
