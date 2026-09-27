import assert from "node:assert/strict";

import {
  QUANT_V4_REAL_EXAM_PROFILES,
  generateQuantV4RealExamSection,
  summarizeQuantV4RealExamSections,
} from "./quant-v4-real-exam-simulation-p2";

const bankingIds = [
  "IBPS_PO_PRELIMS",
  "IBPS_PO_MAINS",
  "IBPS_CLERK",
  "SBI_PO",
  "IBPS_RRB_BANKING",
] as const;

const diagnostics: Record<string, unknown> = {};

for (const examId of bankingIds) {
  const profile = QUANT_V4_REAL_EXAM_PROFILES.find((entry) => entry.id === examId);
  assert.ok(profile);
  const sections = [];
  for (let sectionIndex = 1; sectionIndex <= 8; sectionIndex += 1) {
    sections.push(await generateQuantV4RealExamSection({
      examId,
      sectionIndex,
      seed: `QUANT-V4-BANKING-PACKAGE-QUALITY-P3:${examId}:${sectionIndex}`,
    }));
  }

  const summary = summarizeQuantV4RealExamSections(profile, sections);
  assert.equal(summary.optionMismatchCount, 0, `${examId} option-count profile drifted.`);
  assert.equal(summary.capabilityGapCount, 0, `${examId} must remain structurally fillable.`);
  assert.ok(Object.keys(summary.packageQuality).length > 0);

  diagnostics[examId] = {
    blockers: summary.blockers,
    packageQuality: summary.packageQuality,
  };
}

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_BANKING_PACKAGE_QUALITY_P3",
  diagnostics,
}));
