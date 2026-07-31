import assert from "node:assert/strict";

import {
  BLR_CP003_V8_REVIEWED_EDITORIAL_VERSION,
  generateBlrCp003LearnerEvidenceV8ReviewedCandidates,
} from "./cp003-learner-evidence-v8-reviewed";

const records = generateBlrCp003LearnerEvidenceV8ReviewedCandidates();
const fingerprints = new Set<string>();
const topologies = new Set<string>();
const prototypes = new Set<string>();
let pairGrammarDefects = 0;

assert.equal(
  BLR_CP003_V8_REVIEWED_EDITORIAL_VERSION,
  "BLR_CP003_V8_REVIEWED_EDITORIAL_V1",
);
assert.equal(records.length, 130);

for (const record of records) {
  assert.ok(!fingerprints.has(record.metadata.semanticFingerprint));
  fingerprints.add(record.metadata.semanticFingerprint);
  topologies.add(record.topologyId);
  prototypes.add(record.prototypeId);

  const learnerText = [
    ...record.editorial.stepByStepSolution,
    ...record.editorial.solutionPhases.flatMap((phase) => phase.points),
    ...record.editorial.optionAnalysis.map((entry) => entry.explanation),
    record.editorial.conclusion,
  ].join(" ");
  if (/\b[A-Z][a-z]+ and [A-Z][a-z]+ is the only (?:pair|cousin pair)\b/.test(learnerText)) {
    pairGrammarDefects += 1;
  }
  assert.doesNotMatch(learnerText, /Don't fall for Option/i);
  assert.equal(record.metadata.humanReviewApproved, false);
  assert.equal(record.permanentQlId, null);
}

assert.equal(pairGrammarDefects, 0);
assert.equal(fingerprints.size, 130);
assert.equal(topologies.size, 2);
assert.equal(prototypes.size, 5);

console.log(
  JSON.stringify(
    {
      editorialVersion: BLR_CP003_V8_REVIEWED_EDITORIAL_VERSION,
      candidateRecords: records.length,
      pairGrammarDefects,
      uniqueTopologies: topologies.size,
      uniqueQuestionPrototypes: prototypes.size,
      structuralSaturationProven: false,
      humanReviewApproved: false,
      verdict:
        "BLR-CP-003 V8 REVIEWED PACK CLOSES PAIR-GRAMMAR DEFECTS AND EXPOSES LIMITED STRUCTURAL DIVERSITY; HUMAN REVIEW AND SATURATION AUDIT REMAIN REQUIRED",
    },
    null,
    2,
  ),
);
