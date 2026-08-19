export const GEO_GAP_REMEDIATION_WAVE2_SOURCE_EVIDENCE = Object.freeze([
  Object.freeze({
    id: "SRC-OLIVEBOARD-CGL-DIRECT-COMMON-TANGENT-PYQ-2024",
    exam: "SSC CGL Tier I",
    heldOn: "2024-09-10",
    support: "Two externally touching circles; direct common tangent length from the radii.",
    url: "https://www.oliveboard.in/question-answer/pyq-two-circles-of-radii-18-cm-and-12-cm-touch-each-other-externally-find",
  }),
  Object.freeze({
    id: "SRC-TESTBOOK-CGL-COMMON-TANGENT-SIMILARITY-PYQ-2018",
    exam: "SSC CGL Tier 2 Quant",
    heldOn: "2018-02-19",
    support: "Externally touching circles, common tangents and similar right triangles used to recover the smaller radius.",
    url: "https://testbook.com/question-answer/two-circles-touch-each-other-at-point-x-two-commo--5c07c1a463d4610d009992a8",
  }),
  Object.freeze({
    id: "SRC-TESTBOOK-CGL-TANGENT-INSCRIBED-SYNTHESIS-PYQ-2025",
    exam: "SSC CGL",
    heldOn: "2025-09-25",
    support: "Angle between tangents is converted to the central angle and then to the angle subtended by the chord at the circumference.",
    url: "https://testbook.com/question-answer/a-chord-ab-is-drawn-in-a-circle-with-center-o-the--690c75a770a9e13a06cae7aa",
  }),
] as const);

export type GapWave2SourceEvidenceId = typeof GEO_GAP_REMEDIATION_WAVE2_SOURCE_EVIDENCE[number]["id"];

export function getGapWave2SourceEvidence(id: GapWave2SourceEvidenceId) {
  const source = GEO_GAP_REMEDIATION_WAVE2_SOURCE_EVIDENCE.find((candidate) => candidate.id === id);
  if (!source) throw new Error(`Unknown Geometry Wave 2 source evidence: ${id}`);
  return source;
}
