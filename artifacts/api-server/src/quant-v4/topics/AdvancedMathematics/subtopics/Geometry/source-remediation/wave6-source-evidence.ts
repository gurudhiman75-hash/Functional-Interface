export const GEO_GAP_REMEDIATION_WAVE6_SOURCE_EVIDENCE = Object.freeze([
  Object.freeze({
    id: "SRC-TESTBOOK-CGL-2025-T2-PERP-BISECTOR-ANGLE-2026",
    kind: "SSC_CGL_PYQ_SECONDARY_REPOSITORY",
    exam: "SSC CGL 2025 Tier-II",
    heldOn: "19 Jan 2026",
    url: "https://testbook.com/question-answer/in-a-triangle-delta-pqr-angle-r-62circ--697e4a66143025b2cfeba11c",
    support: "A point T on the perpendicular bisector of PQ gives TP = TQ, creating an isosceles triangle inside a larger angle-recovery problem.",
  }),
  Object.freeze({
    id: "SRC-TESTBOOK-CGL-RHOMBUS-PERP-BISECTOR-CONVERSE-2024",
    kind: "SSC_CGL_PYQ_SECONDARY_REPOSITORY",
    exam: "SSC CGL 2024 Tier-I",
    heldOn: "17 Sept 2024 Shift 2",
    url: "https://testbook.com/question-answer/in-a-rhombus-pqrs-o-is-any-interior-point-such-th--6715fc8cd416af4e77cf1a93",
    support: "OP = OR is used with the converse perpendicular-bisector theorem to place O on diagonal SQ and recover a straight angle.",
  }),
  Object.freeze({
    id: "SRC-TESTBOOK-CHSL-CENTROID-INVERSE-MEDIAN-2023",
    kind: "SSC_CHSL_PYQ_SECONDARY_REPOSITORY",
    exam: "SSC CHSL Tier-I 2022",
    heldOn: "21 Mar 2023 Shift 2",
    url: "https://testbook.com/question-answer/pm-is-the-median-of-pqr-o-is-the-centroid--642cf93e84c93577d6b47ea4",
    support: "Given the vertex-to-centroid part PO = 27 cm, the full median PM is recovered from the centroid 2:1 division.",
  }),
  Object.freeze({
    id: "SRC-TESTBOOK-CGL-CENTROID-INVERSE-BASE-SEGMENT-2023",
    kind: "SSC_CGL_PYQ_SECONDARY_REPOSITORY",
    exam: "SSC CGL 2023 Tier-I",
    heldOn: "24 Jul 2023 Shift 2",
    url: "https://testbook.com/question-answer/in-abc-d-is-the-mid-point-of-bc-and-g-is-t--64ce0fd84c4d602aff0dee63",
    support: "Given the centroid-to-midpoint part GD = 10 cm, the full median AD is recovered as three equal ratio parts.",
  }),
  Object.freeze({
    id: "SRC-TESTBOOK-CGL-MIDPOINT-CONVERSE-INTERMEDIATE-2018",
    kind: "SSC_CGL_PYQ_SECONDARY_REPOSITORY",
    exam: "SSC CGL Tier-II",
    heldOn: "09 Mar 2018",
    url: "https://testbook.com/question-answer/pqrs-is-a-parallelogram-and-its-area-is-300-cm2-s--5c2386ae78cbbc4e371c2269",
    support: "The official-paper solution uses a side midpoint plus a parallel line to infer a second midpoint by the converse midpoint theorem; Wave 6 isolates that geometric intermediate without importing the area target.",
  }),
] as const);

export type GapWave6SourceEvidence = typeof GEO_GAP_REMEDIATION_WAVE6_SOURCE_EVIDENCE[number];
export type GapWave6SourceEvidenceId = GapWave6SourceEvidence["id"];
