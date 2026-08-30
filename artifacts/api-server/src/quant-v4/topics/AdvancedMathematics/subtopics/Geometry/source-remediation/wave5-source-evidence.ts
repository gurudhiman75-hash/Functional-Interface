export const GEO_GAP_REMEDIATION_WAVE5_SOURCE_EVIDENCE = Object.freeze([
  Object.freeze({
    id: "SRC-TESTBOOK-CGL-PARALLELOGRAM-EXTENSION-CONGRUENCE-PYQ-2024",
    exam: "SSC CGL 2024 Tier-I Official Paper",
    heldOn: "18 Sep 2024 Shift 3",
    url: "https://testbook.com/question-answer/the-side-mn-of-a-parallelogram-mnop-is-produced-to--67160253dda2dd3be7b77afa/amp",
    support: "MNOP is a parallelogram, MN is produced to Q with MN = NQ, and PQ meets ON at R. Parallel-line angle transfer plus congruence gives OR = RN, so R divides ON in the ratio 1:1.",
  }),
  Object.freeze({
    id: "SRC-TESTBOOK-CGL-EQUAL-PARALLEL-OPPOSITE-SIDES-PYQ-2025",
    exam: "SSC CGL 2025 Official Paper",
    heldOn: "16 Sep 2025 Shift 3",
    url: "https://testbook.com/question-answer/in-a-quadrilateral-abcd-ab-is-parallel-to-cd-and--6909f91ca937eb1254c05326",
    support: "In quadrilateral ABCD, AB is parallel and equal to CD and AC is a diagonal. Alternate interior angles plus the common diagonal establish triangle congruence by SAS.",
  }),
] as const);

export type GapWave5SourceEvidenceId = typeof GEO_GAP_REMEDIATION_WAVE5_SOURCE_EVIDENCE[number]["id"];
