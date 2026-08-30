export const GEO_GAP_REMEDIATION_WAVE3_SOURCE_EVIDENCE = Object.freeze([
  Object.freeze({
    id: "SRC-TESTBOOK-CGL-INCENTRE-IDENTIFICATION-PYQ-2017",
    exam: "SSC CGL",
    heldOn: "2017-08-16",
    support: "The intersection point of the internal angle bisectors of a triangle is identified as the incentre.",
    url: "https://testbook.com/question-answer/the-point-of-intersection-of-all-the-angle-bisecto--5b1926c743332702c7a857aa",
  }),
  Object.freeze({
    id: "SRC-TESTBOOK-CPO-RIGHT-TRIANGLE-ORTHOCENTRE-PYQ-2025",
    exam: "SSC CPO",
    heldOn: "2025-12-12",
    support: "In a right-angled triangle the orthocentre is located at the right-angled vertex.",
    url: "https://testbook.com/question-answer/in-a-right-angled-triangle-where-is-the-orthocent--69878e14f4c1ba5952d04dfa",
  }),
  Object.freeze({
    id: "SRC-TESTBOOK-CGL-INCENTRE-ANGLE-DIRECT-PYQ-2021",
    exam: "SSC CGL 2021 Tier I",
    heldOn: "2022-04-20",
    support: "Given a vertex angle and the incentre, recover the opposite angle at the incentre using 90 degrees plus half the vertex angle.",
    url: "https://testbook.com/question-answer/in-abc-a-68-if-i-is-the-incentre-of--6274315d292c4dfc2e689502",
  }),
  Object.freeze({
    id: "SRC-TESTBOOK-CHSL-INCENTRE-ANGLE-INVERSE-PYQ-2018",
    exam: "SSC CHSL",
    heldOn: "2018-03-24",
    support: "Given the angle at the incentre, recover the opposite vertex angle by inverting the incentre-angle relation.",
    url: "https://testbook.com/question-answer/calculate-the-angle-bac-if-the-angle-bic-125deg--5c260d80fdb8bb04c3593be1",
  }),
] as const);

export type GapWave3SourceEvidenceId = typeof GEO_GAP_REMEDIATION_WAVE3_SOURCE_EVIDENCE[number]["id"];

export function getGapWave3SourceEvidence(id: GapWave3SourceEvidenceId) {
  const source = GEO_GAP_REMEDIATION_WAVE3_SOURCE_EVIDENCE.find((candidate) => candidate.id === id);
  if (!source) throw new Error(`Unknown Geometry Wave 3 source evidence: ${id}`);
  return source;
}
