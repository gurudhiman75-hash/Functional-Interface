export const GEO_GAP_REMEDIATION_WAVE9_SOURCE_EVIDENCE = Object.freeze([
  Object.freeze({
    id: "SRC-TESTBOOK-CGL-AROUND-POINT-EQUAL-ANGLES-PYQ-2022",
    exam: "SSC CGL Tier 2 Quant Previous Paper 1",
    heldOn: "29 Jan 2022",
    url: "https://testbook.com/question-answer/o-is-a-point-in-the-interior-ofabc-su--622cc381aa1bd694520f4f47",
    support: "The source gives three equal angles AOB, BOC and COA around the interior point O; the first exact geometric decision is that the full turn is 360 degrees, so each equal angle is 120 degrees.",
  }),
  Object.freeze({
    id: "SRC-TESTBOOK-CGL-ALTERNATE-INTERIOR-PYQ-2025",
    exam: "SSC CGL 2025",
    heldOn: "20 Sep 2025 Shift 1",
    url: "https://testbook.com/question-answer/when-a-transversal-intersects-two-parallel-lines--690b2c3b9b71212a5ba0a35c",
    support: "Two parallel lines are cut by a transversal and one alternate interior angle is 115 degrees; the opposite alternate interior angle is recovered as the same 115 degrees.",
  }),
  Object.freeze({
    id: "SRC-TESTBOOK-CGL-TRIANGLE-INEQUALITY-INTEGER-COUNT-PYQ-2024",
    exam: "SSC CGL 2024 Tier-I Official Paper",
    heldOn: "17 Sep 2024 Shift 3",
    url: "https://testbook.com/question-answer/in-a-triangle-the-lengths-of-sides-are-6-units-1--6715fce4120753ff46100e6d",
    support: "With two triangle sides 6 and 12, the source asks how many integer values the third side can take; strict triangle-inequality bounds give 6 < x < 18 and therefore 11 integer values.",
  }),
  Object.freeze({
    id: "SRC-TESTBOOK-CGL-TRIANGLE-INEQUALITY-CLAIM-PYQ-2023",
    exam: "SSC CGL 2023 Tier-I Official Paper",
    heldOn: "27 Jul 2023 Shift 3",
    url: "https://testbook.com/question-answer/select-the-correct-statement-about-the-properties--64cb61a1ef8b5ae40a6906d6",
    support: "The source asks for the correct triangle property and identifies that the sum of any two sides is always greater than the third side.",
  }),
] as const);

export type GapWave9SourceEvidenceId = typeof GEO_GAP_REMEDIATION_WAVE9_SOURCE_EVIDENCE[number]["id"];
