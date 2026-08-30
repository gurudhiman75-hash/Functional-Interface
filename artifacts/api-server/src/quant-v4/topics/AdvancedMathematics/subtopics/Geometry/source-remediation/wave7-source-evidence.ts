export const GEO_GAP_REMEDIATION_WAVE7_SOURCE_EVIDENCE = Object.freeze([
  Object.freeze({
    id: "SRC-TESTBOOK-SELECTION-POST-EQUAL-CHORD-CENTRAL-ANGLE-2025",
    kind: "SSC_SELECTION_POST_PYQ_SECONDARY_REPOSITORY",
    exam: "SSC Selection Post 2025 (Higher Secondary Level)",
    heldOn: "26 Jul 2025 Shift 2",
    url: "https://testbook.com/question-answer/a-circle-has-two-chords-ab-and-cd-which-are-of-e--68e058afe1f22f3920ea9728",
    support: "Equal chords AB and CD are used to conclude that the angles they subtend at the centre are equal.",
  }),
  Object.freeze({
    id: "SRC-TESTBOOK-CGL-EQUAL-CHORD-EQUAL-CENTRE-DISTANCE-2025",
    kind: "SSC_CGL_PYQ_SECONDARY_REPOSITORY",
    exam: "SSC CGL 2025",
    heldOn: "24 Sept 2025 Shift 3",
    url: "https://testbook.com/question-answer/in-a-circle-with-center-o-chords-ab-and-cd-are-eq--690c73141de1e8ce1991fed6",
    support: "Equal chords are used to transfer a known perpendicular distance from the centre to the other chord.",
  }),
  Object.freeze({
    id: "SRC-TESTBOOK-CGL-CHORD-MIDPOINT-CENTRE-PERPENDICULAR-2025",
    kind: "SSC_CGL_PYQ_SECONDARY_REPOSITORY",
    exam: "SSC CGL 2025",
    heldOn: "23 Sept 2025 Shift 3",
    url: "https://testbook.com/question-answer/a-line-from-the-center-of-a-circle-bisects-a-chord--690c6d017016e005adaaf0b6",
    support: "A line from the centre through the midpoint of a chord is used to infer a right angle with the chord.",
  }),
  Object.freeze({
    id: "SRC-TESTBOOK-CGL-SAME-SEGMENT-ANGLE-2025",
    kind: "SSC_CGL_PYQ_SECONDARY_REPOSITORY",
    exam: "SSC CGL 2025",
    heldOn: "25 Sept 2025 Shift 2",
    url: "https://testbook.com/question-answer/in-a-circle-points-p-q-r-and-s-lie-on-the-circ--690c77de7ec4a7bd509df818",
    support: "Two angles standing on the same chord in the same segment are equated directly.",
  }),
  Object.freeze({
    id: "SRC-TESTBOOK-CGL-CYCLIC-EXTERIOR-FROM-CENTRAL-2025",
    kind: "SSC_CGL_PYQ_SECONDARY_REPOSITORY",
    exam: "SSC CGL 2024 Tier-II",
    heldOn: "20 Jan 2025",
    url: "https://testbook.com/question-answer/in-a-circle-with-centre-o-an-arc-abc-subtends-an--679754316ef4f044174ffe37",
    support: "A central-angle measure is converted to an inscribed angle and then to the cyclic exterior angle at an extended side.",
  }),
  Object.freeze({
    id: "SRC-TESTBOOK-CGL-SEMICIRCLE-SAME-SEGMENT-CHAIN-2022",
    kind: "SSC_CGL_PYQ_SECONDARY_REPOSITORY",
    exam: "SSC CGL 2022 official-paper mirror",
    heldOn: "29 Jan 2022 Shift 2",
    url: "https://testbook.com/question-answer/ab-and-cd-are-two-chords-in-a-circle-with-centre-o--622bffa13bc278f30b96ccce",
    support: "A diameter/right-angle fact is combined with a same-segment angle and a linear/triangle angle chain to recover the target angle.",
  }),
] as const);

export type GapWave7SourceEvidence = typeof GEO_GAP_REMEDIATION_WAVE7_SOURCE_EVIDENCE[number];
export type GapWave7SourceEvidenceId = GapWave7SourceEvidence["id"];
