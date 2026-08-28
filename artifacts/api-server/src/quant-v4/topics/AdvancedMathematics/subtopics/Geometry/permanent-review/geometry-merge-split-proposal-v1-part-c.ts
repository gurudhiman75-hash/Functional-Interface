import { defineGeometryMergeSplitFamilyV1 } from "./geometry-merge-split-proposal-v1-types";

export const GEO_MERGE_SPLIT_PROPOSAL_V1_PART_C = Object.freeze([
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP009_POLYGON_ANGLE_SIDE_TRANSFORMS",
    cpId: "GEO-CP-009",
    learnerDecision: "Polygon angle/side-count transforms",
    candidateIds: Object.freeze([
      "GEO-TMP-CP009-EXTERIOR-FROM-N-V1",
      "GEO-TMP-CP009-N-FROM-EXTERIOR-V1",
      "GEO-TMP-CP009-N-FROM-INTERIOR-V1",
      "GEO-TMP-GAP-W8-CP009-INTERIOR-SUM-TO-SIDES-V1",
      "GEO-TMP-GAP-W8-CP009-EXTERIOR-SUM-INVARIANT-V1",
      "GEO-TMP-GAP-W8-CP009-INTERIOR-SUM-ANGLE-DIFFERENCE-V1",
    ]),
    mergeRationale: "Merge regular interior/exterior transforms, general exterior-sum invariant and interior-sum inverse chains into one parameterized polygon-angle family.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP009_POLYGON_DIAGONALS",
    cpId: "GEO-CP-009",
    learnerDecision: "Polygon diagonal count",
    candidateIds: Object.freeze([
      "GEO-TMP-CP009-DIAGONAL-COUNT-V1",
    ]),
    mergeRationale: "Diagonal counting is an independent combinatorial learner decision.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP010_CENTRE_CHORD_PERP_BISECTION",
    cpId: "GEO-CP-010",
    learnerDecision: "Centre-to-chord perpendicular/bisection relation",
    candidateIds: Object.freeze([
      "GEO-TMP-CP010-CENTRE-PERP-CHORD-V1",
      "GEO-TMP-GAP-W7-CP010-CENTRE-BISECTOR-PERPENDICULAR-V1",
    ]),
    mergeRationale: "Direct and source-backed inverse forms are one reversible chord-centre family.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP010_EQUAL_CHORD_CENTRE_DISTANCE",
    cpId: "GEO-CP-010",
    learnerDecision: "Equal chord / equal centre-distance relation",
    candidateIds: Object.freeze([
      "GEO-TMP-CP010-EQUAL-CENTRE-DISTANCE-CHORD-V1",
      "GEO-TMP-GAP-W7-CP010-EQUAL-CHORD-CENTRE-DISTANCE-V1",
    ]),
    mergeRationale: "Direct and reverse distance-length transfer are one reversible equivalence family.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP010_EQUAL_CHORD_CENTRAL_ANGLE",
    cpId: "GEO-CP-010",
    learnerDecision: "Equal chord / equal central-angle relation",
    candidateIds: Object.freeze([
      "GEO-TMP-GAP-W7-CP010-EQUAL-CHORD-CENTRAL-ANGLE-V1",
    ]),
    mergeRationale: "Central-angle equivalence for equal chords remains a distinct chord property family.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP011_CENTRAL_INSCRIBED_SEMICIRCLE_SAME_SEGMENT",
    cpId: "GEO-CP-011",
    learnerDecision: "Inscribed-angle / arc relation",
    candidateIds: Object.freeze([
      "GEO-TMP-CP011-CENTRAL-FROM-INSCRIBED-V1",
      "GEO-TMP-GAP-CP011-SEMICIRCLE-ANGLE-V1",
      "GEO-TMP-GAP-W7-CP011-SAME-SEGMENT-ANGLE-V1",
    ]),
    mergeRationale: "Merge central-vs-inscribed, same-segment and diameter/semicircle cases into one arc-to-inscribed-angle family with topology parameters.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP011_CYCLIC_ANGLE_RELATIONS",
    cpId: "GEO-CP-011",
    learnerDecision: "Cyclic quadrilateral angle relation",
    candidateIds: Object.freeze([
      "GEO-TMP-CP011-CYCLIC-OPPOSITE-V1",
      "GEO-TMP-GAP-W7-CP011-CYCLIC-EXTERIOR-CENTRAL-V1",
    ]),
    mergeRationale: "Merge opposite-angle and source-backed exterior-angle consequences; cyclic converse remains source-deferred.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP011_CIRCLE_ANGLE_CHAIN",
    cpId: "GEO-CP-011",
    learnerDecision: "Circle-angle multi-step chain",
    candidateIds: Object.freeze([
      "GEO-TMP-GAP-W7-CP011-SEMICIRCLE-SAME-SEGMENT-CHAIN-V1",
    ]),
    mergeRationale: "Retain the same-segment/semicircle/exterior chain as a separate compound solve graph rather than flattening it into a primitive family.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP012_RADIUS_TANGENT_CENTRAL_RELATIONS",
    cpId: "GEO-CP-012",
    learnerDecision: "Radius/tangent and two-tangent central-angle relation",
    candidateIds: Object.freeze([
      "GEO-TMP-CP012-RADIUS-TANGENT-ANGLE-V1",
      "GEO-TMP-GAP-CP012-ANGLE-BETWEEN-TANGENTS-V1",
    ]),
    mergeRationale: "Merge radius-perpendicular-tangent and angle-between-tangents variants around the same centre/tangent geometry.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP012_EQUAL_TANGENTS_EXTERNAL_POINT",
    cpId: "GEO-CP-012",
    learnerDecision: "Equal tangents from an external point",
    candidateIds: Object.freeze([
      "GEO-TMP-CP012-EQUAL-TANGENTS-V1",
    ]),
    mergeRationale: "External-point tangent-length equality remains a distinct relation.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP012_TANGENT_CHORD_ALTERNATE_SEGMENT",
    cpId: "GEO-CP-012",
    learnerDecision: "Tangent-chord alternate-segment theorem",
    candidateIds: Object.freeze([
      "GEO-TMP-GAP-CP012-TANGENT-CHORD-V1",
    ]),
    mergeRationale: "Tangent-chord angle transfer is a distinct theorem family.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP012_COMMON_TANGENT_TWO_CIRCLES",
    cpId: "GEO-CP-012",
    learnerDecision: "Direct common tangent of two circles",
    candidateIds: Object.freeze([
      "GEO-TMP-GAP-W2-CP012-DIRECT-COMMON-TANGENT-V1",
    ]),
    mergeRationale: "Two-circle common-tangent metric geometry remains a distinct topology.",
  }),
]);
