import assert from "node:assert/strict";

import {
  QUANT_V4_REAL_EXAM_PROFILES,
  generateQuantV4RealExamSection,
  summarizeQuantV4RealExamSections,
} from "./quant-v4-real-exam-simulation-p2";

for (const examId of ["IBPS_PO_PRELIMS", "IBPS_PO_MAINS", "IBPS_RRB_BANKING"] as const) {
  const profile = QUANT_V4_REAL_EXAM_PROFILES.find((entry) => entry.id === examId);
  assert.ok(profile);

  const sections = [];
  for (let sectionIndex = 1; sectionIndex <= 8; sectionIndex += 1) {
    sections.push(await generateQuantV4RealExamSection({
      examId,
      sectionIndex,
      seed: `QUANT-V4-DSF-SPECIFICITY-CONTEXT-P3:${examId}:${sectionIndex}`,
    }));
  }

  const summary = summarizeQuantV4RealExamSections(profile, sections);
  const dsf = summary.packageQuality["DSF-001"];
  assert.ok(dsf, `${examId} did not exercise DSF-001.`);
  assert.equal(dsf.emptyExplanationCount, 0);
  assert.ok(
    dsf.explanationSpecificityRate >= 0.9,
    `${examId} DSF-001 specificity remained ${dsf.explanationSpecificityRate} after including learner-visible statements.`,
  );
}

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_DSF_SPECIFICITY_CONTEXT_P3",
  learnerEvidenceBoundary: "STEM_PLUS_QUESTION_PROMPT_PLUS_STATEMENTS",
}));
