export const GEO_GAP_REMEDIATION_WAVE8_SOURCE_EVIDENCE = Object.freeze([
  Object.freeze({
    id: "SRC-TESTBOOK-CGL-POLYGON-INTERIOR-SUM-INVERSE-PYQ-2019",
    exam: "SSC CGL Tier 2 Quant Previous Paper 5",
    heldOn: "12 Sep 2019",
    url: "https://testbook.com/question-answer/the-sum-of-the-interior-angles-of-a-regular-polygo--5e149db554bda20d10fe9292",
    support: "A regular polygon has interior-angle sum 1260 degrees. Recovering n = 9 from (n - 2) x 180 = 1260 is the first learner decision before the source continues to interior/exterior-angle comparison.",
  }),
  Object.freeze({
    id: "SRC-TESTBOOK-CGL-POLYGON-EXTERIOR-SUM-PYQ-2025",
    exam: "SSC CGL 2025",
    heldOn: "18 Sep 2025 Shift 3",
    url: "https://testbook.com/question-answer/what-is-the-total-sum-of-the-exterior-angles-of-an--690b2636ce29a1f2f630dee2",
    support: "The source directly asks for the total of one exterior angle at each vertex of a polygon and establishes the invariant total as 360 degrees, independent of the number of sides.",
  }),
  Object.freeze({
    id: "SRC-TESTBOOK-CGL-POLYGON-ANGLE-DIFFERENCE-PYQ-2020",
    exam: "SSC CGL Tier 2 Quant Previous Paper 3",
    heldOn: "18 Nov 2020",
    url: "https://testbook.com/question-answer/the-interior-angle-of-a-regular-polygon-exceeds-it--5fca34d639c0e9bf3664d0e9",
    support: "For a regular polygon whose interior angle exceeds its exterior angle by 90 degrees, the source combines I + E = 180 with I - E = 90 and E = 360/n to recover n = 8.",
  }),
  Object.freeze({
    id: "SRC-TESTBOOK-CHSL-POLYGON-ANGLE-RATIO-PYQ-2025",
    exam: "SSC CHSL 2025 Tier-1",
    heldOn: "27 Nov 2025 Shift 3",
    url: "https://testbook.com/question-answer/a-regular-polygon-has-an-interior-angle-that-is-5--69b3e4a3bf8177488a1918f3",
    support: "For a regular polygon whose interior angle is five times its exterior angle, the source combines I + E = 180 with I = 5E and E = 360/n to recover n = 12.",
  }),
] as const);

export type GapWave8SourceEvidenceId = typeof GEO_GAP_REMEDIATION_WAVE8_SOURCE_EVIDENCE[number]["id"];
