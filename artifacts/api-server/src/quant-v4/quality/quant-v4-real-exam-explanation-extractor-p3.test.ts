import assert from "node:assert/strict";

import {
  generateQuantV4RealExamSection,
} from "./quant-v4-real-exam-simulation-p2";

const profiles = [
  "IBPS_PO_PRELIMS",
  "IBPS_PO_MAINS",
  "IBPS_CLERK",
  "SBI_PO",
  "IBPS_RRB_BANKING",
] as const;

const expectedPackages = new Set(["BNS-001", "QCP-001", "SAP", "DSF-001"]);
const observed = new Map<string, number>();

for (const examId of profiles) {
  for (let sectionIndex = 1; sectionIndex <= 8; sectionIndex += 1) {
    const section = await generateQuantV4RealExamSection({
      examId,
      sectionIndex,
      seed: `QUANT-V4-EXPLANATION-EXTRACTOR-P3:${examId}:${sectionIndex}`,
    });

    for (const question of section.questions) {
      if (question.sourceKind !== "RUNTIME_GENERATED") continue;
      if (!expectedPackages.has(question.packageId)) continue;
      observed.set(question.packageId, (observed.get(question.packageId) ?? 0) + 1);
      assert.ok(
        question.explanation.trim().length > 0,
        `${examId} ${question.packageId} produced an explanation that the real-exam audit could not read.`,
      );
    }
  }
}

for (const packageId of expectedPackages) {
  assert.ok(
    (observed.get(packageId) ?? 0) > 0,
    `Representative Banking audit did not exercise ${packageId}.`,
  );
}

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_REAL_EXAM_EXPLANATION_EXTRACTOR_P3",
  observed: Object.fromEntries(observed),
}));
