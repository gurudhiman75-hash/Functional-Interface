import assert from "node:assert/strict";

import {
  QUANT_V4_REAL_EXAM_PROFILES,
  generateQuantV4RealExamSection,
  summarizeQuantV4RealExamSections,
} from "./quant-v4-real-exam-simulation-p2";

for (const examId of ["IBPS_PO_PRELIMS", "IBPS_PO_MAINS"] as const) {
  const profile = QUANT_V4_REAL_EXAM_PROFILES.find((entry) => entry.id === examId);
  assert.ok(profile);

  const sections = [];
  for (let sectionIndex = 1; sectionIndex <= 8; sectionIndex += 1) {
    sections.push(await generateQuantV4RealExamSection({
      examId,
      sectionIndex,
      seed: `QUANT-V4-DI-STIMULUS-SPECIFICITY-P3:${examId}:${sectionIndex}`,
    }));
  }

  const summary = summarizeQuantV4RealExamSections(profile, sections);
  const diQuality = Object.entries(summary.packageQuality)
    .filter(([packageId]) => packageId.startsWith("DI-"));

  assert.ok(diQuality.length > 0, `${examId} did not exercise any DI package.`);

  for (const [packageId, quality] of diQuality) {
    assert.equal(
      quality.emptyExplanationCount,
      0,
      `${examId} ${packageId} has an unreadable/empty learner explanation.`,
    );
    assert.ok(
      quality.explanationSpecificityRate >= 0.9,
      `${examId} ${packageId} stimulus-aware explanation specificity is ${quality.explanationSpecificityRate}.`,
    );
  }
}

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_DI_STIMULUS_SPECIFICITY_P3",
  learnerEvidenceBoundary: "STEM_PLUS_VISIBLE_STIMULUS",
  stemDuplicationBoundary: "STEM_ONLY",
}));
