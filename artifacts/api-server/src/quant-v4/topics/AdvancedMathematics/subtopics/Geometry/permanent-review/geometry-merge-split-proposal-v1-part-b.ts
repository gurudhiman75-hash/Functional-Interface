import { defineGeometryMergeSplitFamilyV1 } from "./geometry-merge-split-proposal-v1-types";

export const GEO_MERGE_SPLIT_PROPOSAL_V1_PART_B = Object.freeze([
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP005_SIMILARITY_CRITERION_CORRESPONDENCE",
    cpId: "GEO-CP-005",
    learnerDecision: "Similarity criterion and correspondence",
    candidateIds: Object.freeze([
      "GEO-TMP-CP005-AA-CORRESPONDENCE-V1",
      "GEO-TMP-GAP-W10-CP005-SSS-SIMILARITY-V1",
    ]),
    mergeRationale: "Merge AA/SSS criterion recognition with correspondence recovery under one similarity-establishment family.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP005_SIMILARITY_SCALE_TRANSFER",
    cpId: "GEO-CP-005",
    learnerDecision: "Similarity scale transfer",
    candidateIds: Object.freeze([
      "GEO-TMP-CP005-MISSING-SIDE-V1",
      "GEO-TMP-GAP-W4-CP005-PERIMETER-TO-SIDE-V1",
      "GEO-TMP-GAP-W4-CP005-SIDE-TO-PERIMETER-V1",
      "GEO-TMP-GAP-W10-CP005-AREA-RATIO-TO-SIDE-RATIO-V1",
    ]),
    mergeRationale: "Merge missing side, perimeter scaling and area-to-side scaling as parameterized consequences of one similarity scale factor.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP005_BPT_DIRECT",
    cpId: "GEO-CP-005",
    learnerDecision: "Basic proportionality theorem direct",
    candidateIds: Object.freeze([
      "GEO-TMP-CP005-BPT-DIRECT-V1",
    ]),
    mergeRationale: "Direct BPT segment recovery stays separate; BPT converse remains source-deferred.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP006_CENTROID_DIRECT_INVERSE",
    cpId: "GEO-CP-006",
    learnerDecision: "Centroid 2:1 median relation",
    candidateIds: Object.freeze([
      "GEO-TMP-CP006-CENTROID-2TO1-V1",
      "GEO-TMP-GAP-W6-CP006-CENTROID-INVERSE-MEDIAN-V1",
    ]),
    mergeRationale: "Direct and inverse centroid length questions are one reversible relation family.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP006_ANGLE_BISECTOR_THEOREM",
    cpId: "GEO-CP-006",
    learnerDecision: "Angle-bisector theorem",
    candidateIds: Object.freeze([
      "GEO-TMP-CP006-ANGLE-BISECTOR-RATIO-V1",
    ]),
    mergeRationale: "Opposite-side proportional split is a distinct theorem family.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP006_MIDPOINT_THEOREM_DIRECT_CONVERSE",
    cpId: "GEO-CP-006",
    learnerDecision: "Midpoint theorem direct/converse",
    candidateIds: Object.freeze([
      "GEO-TMP-CP006-MIDPOINT-THEOREM-V1",
      "GEO-TMP-GAP-W6-CP006-MIDPOINT-CONVERSE-SEGMENT-V1",
    ]),
    mergeRationale: "Direct midpoint-join and source-backed converse consequence are one reversible midpoint family.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP006_TRIANGLE_CENTRE_IDENTIFICATION",
    cpId: "GEO-CP-006",
    learnerDecision: "Triangle-centre identification",
    candidateIds: Object.freeze([
      "GEO-TMP-GAP-CP006-CIRCUMCENTRE-IDENTIFY-V1",
      "GEO-TMP-GAP-W3-CP006-INCENTRE-IDENTIFY-V1",
      "GEO-TMP-GAP-W3-CP006-RIGHT-TRIANGLE-ORTHOCENTRE-V1",
    ]),
    mergeRationale: "Circumcentre, incentre and right-triangle orthocentre identification share one centre-from-defining-property decision.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP006_INCENTRE_ANGLE_DIRECT_INVERSE",
    cpId: "GEO-CP-006",
    learnerDecision: "Incentre angle relation",
    candidateIds: Object.freeze([
      "GEO-TMP-GAP-W3-CP006-INCENTRE-ANGLE-DIRECT-V1",
      "GEO-TMP-GAP-W3-CP006-INCENTRE-ANGLE-INVERSE-V1",
    ]),
    mergeRationale: "Direct and inverse centre-angle transforms are one reversible family.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP006_PERP_BISECTOR_DIRECT_CONVERSE",
    cpId: "GEO-CP-006",
    learnerDecision: "Perpendicular-bisector equidistance relation",
    candidateIds: Object.freeze([
      "GEO-TMP-GAP-W6-CP006-PERP-BISECTOR-EQUIDISTANT-ANGLE-V1",
      "GEO-TMP-GAP-W6-CP006-PERP-BISECTOR-CONVERSE-RHOMBUS-V1",
    ]),
    mergeRationale: "Direct and converse equidistance/perpendicular-bisector questions are one reversible locus family.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP007_PYTHAGOREAN_CONVERSE",
    cpId: "GEO-CP-007",
    learnerDecision: "Pythagorean converse classification",
    candidateIds: Object.freeze([
      "GEO-TMP-CP007-PYTHAGOREAN-CONVERSE-V1",
    ]),
    mergeRationale: "Side-length classification by the Pythagorean converse remains one primitive family.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP007_HYPOTENUSE_MIDPOINT_CIRCUMCENTRE",
    cpId: "GEO-CP-007",
    learnerDecision: "Right-triangle hypotenuse midpoint relation",
    candidateIds: Object.freeze([
      "GEO-TMP-CP007-HYPOTENUSE-MEDIAN-V1",
      "GEO-TMP-GAP-W11-CP007-RIGHT-CIRCUMCENTRE-MIDPOINT-V1",
    ]),
    mergeRationale: "Merge median-to-hypotenuse length and circumcentre-at-midpoint recognition as consequences of the same midpoint-of-hypotenuse geometry.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP008_QUADRILATERAL_ANGLE_SUM",
    cpId: "GEO-CP-008",
    learnerDecision: "Quadrilateral interior-angle sum",
    candidateIds: Object.freeze([
      "GEO-TMP-CP008-FOURTH-ANGLE-V1",
    ]),
    mergeRationale: "General fourth-angle recovery stays distinct from named-quadrilateral property recognition.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP008_NAMED_QUADRILATERAL_PROPERTIES",
    cpId: "GEO-CP-008",
    learnerDecision: "Named quadrilateral property recognition/application",
    candidateIds: Object.freeze([
      "GEO-TMP-CP008-PARALLELOGRAM-DIAGONAL-V1",
      "GEO-TMP-CP008-RHOMBUS-DIAGONAL-ANGLE-V1",
      "GEO-TMP-GAP-W11-CP008-PARALLELOGRAM-PROPERTY-RECOGNITION-V1",
      "GEO-TMP-GAP-W11-CP008-SQUARE-STRONGER-SUBTYPE-V1",
    ]),
    mergeRationale: "Merge parallelogram, rhombus and square property/application variants into one subtype-parameterized family; kite/trapezium remains source-deferred.",
  }),
]);
