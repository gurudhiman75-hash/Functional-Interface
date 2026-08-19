export const GEO_GAP_REMEDIATION_WAVE4_SOURCE_EVIDENCE = Object.freeze([
  Object.freeze({
    id: "SRC-TESTBOOK-CHSL-PERIMETER-TO-SIDE-PYQ-2022",
    exam: "SSC CHSL Tier-I Exam 2022 Official Paper",
    heldOn: "16 Mar 2023 Shift 4",
    url: "https://testbook.com/question-answer/the-perimeter-of-two-similar-triangles-abc-and-pqr--642d8fde8ef7d954f28aa7a3",
    support: "Two similar triangles have perimeters 64 cm and 56 cm; with AB = 16 cm, the corresponding side PQ is recovered as 14 cm from the common linear scale.",
  }),
  Object.freeze({
    id: "SRC-TESTBOOK-CHSL-SIDE-TO-PERIMETER-PYQ-2024",
    exam: "SSC CHSL Exam 2024 Tier-I Official Paper",
    heldOn: "02 Jul 2024 Shift 2",
    url: "https://testbook.com/question-answer/if-abc-and-pqr-are-similar-ab-8-c--66a2a956948c0ab1f05bd9ea",
    support: "Given similar triangles, AB = 8 cm and PQ = 12 cm with the other sides of PQR known, the perimeter of ABC is recovered as 36 cm by the common corresponding-side scale.",
  }),
] as const);

export type GapWave4SourceEvidenceId = typeof GEO_GAP_REMEDIATION_WAVE4_SOURCE_EVIDENCE[number]["id"];
