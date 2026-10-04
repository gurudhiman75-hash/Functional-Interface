import assert from "node:assert/strict";

import { generateQuantV4RealExamSection } from "./quant-v4-real-exam-simulation-p2";

const failures: Array<Record<string, unknown>> = [];
let dsfCount = 0;

for (let sectionIndex = 1; sectionIndex <= 8; sectionIndex += 1) {
  const section = await generateQuantV4RealExamSection({
    examId: "IBPS_PO_PRELIMS",
    sectionIndex,
    seed: `QUANT-V4-DSF-SPECIFICITY-CONTEXT-P3:IBPS_PO_PRELIMS:${sectionIndex}`,
  });

  for (const question of section.questions) {
    if (question.packageId !== "DSF-001") continue;
    dsfCount += 1;
    if (question.questionSpecificExplanation) continue;
    failures.push({
      sectionIndex,
      ordinal: question.ordinal,
      text: question.text,
      explanation: question.explanation,
      difficulty: question.difficulty,
      options: question.options,
      semanticExplanationSignature: question.semanticExplanationSignature,
      explanationOptionalSectionIssues: question.explanationOptionalSectionIssues,
      stemWordCount: question.stemWordCount,
      explanationWordCount: question.explanationWordCount,
      numberTokenCount: question.numberTokenCount,
    });
  }
}

assert.equal(dsfCount, 16);
assert.ok(failures.length > 0, "DSF specificity diagnostic expected at least one current false record.");

console.log("QUANT_V4_DSF_SPECIFICITY_DIAGNOSTIC_P4", JSON.stringify({
  dsfCount,
  nonSpecificCount: failures.length,
  failures,
}));
