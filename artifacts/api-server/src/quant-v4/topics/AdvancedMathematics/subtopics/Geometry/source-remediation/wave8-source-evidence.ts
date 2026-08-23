export const GEO_GAP_REMEDIATION_WAVE8_SOURCE_EVIDENCE = Object.freeze([
  Object.freeze({
    id: "SRC-TESTBOOK-CGL-POLYGON-INTERIOR-SUM-INVERSE-PYQ-2019",
    exam: "SSC CGL Tier 2 Quant Previous Paper 5",
    heldOn: "12 Sep 2019",
    url: "https://testbook.com/question-answer/the-sum-of-the-interior-angles-of-a-regular-polygo--5e149db554bda20d10fe9292",
    support: "A regular polygon has interior-angle sum 1260 degrees. Recovering n = 9 from (n - 2) x 180 = 1260 is the first learner decision, and the same source then continues to the interior/exterior-angle difference requested by the mixed-chain Wave 8 prototype.",
  }),
  Object.freeze({
    id: "SRC-TESTBOOK-CGL-POLYGON-EXTERIOR-SUM-PYQ-2025",
    exam: "SSC CGL 2025",
    heldOn: "18 Sep 2025 Shift 3",
    url: "https://testbook.com/question-answer/what-is-the-total-sum-of-the-exterior-angles-of-an--690b2636ce29a1f2f630dee2",
    support: "The source directly asks for the total of one exterior angle at each vertex of a polygon and establishes the invariant total as 360 degrees, independent of the number of sides.",
  }),
] as const);

export type GapWave8SourceEvidenceId = typeof GEO_GAP_REMEDIATION_WAVE8_SOURCE_EVIDENCE[number]["id"];
