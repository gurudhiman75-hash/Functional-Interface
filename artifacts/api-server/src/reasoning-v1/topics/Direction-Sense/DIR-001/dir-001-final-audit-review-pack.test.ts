import assert from "node:assert/strict";

import { buildDir001FinalAuditReviewPack } from "./dir-001-final-audit-review-pack";

const { records, summary, markdown } = buildDir001FinalAuditReviewPack();

assert.equal(summary.qlCount, 44);
assert.equal(summary.markdownSamples, 132);
assert.deepEqual(summary.locales, ["en-IN", "hi-IN", "pa-IN"]);
assert.doesNotMatch(markdown, /\[object Object\]/);

const learnerText = (record: Record<string, any>) =>
  JSON.stringify({
    stem: record.stem,
    options: (record.options ?? []).map((option: Record<string, any>) =>
      option.label ?? option.text ?? option.value,
    ),
    explanation: record.explanation,
    questionDiagram: record.questionDiagram
      ? {
          title: record.questionDiagram.title,
          accessibleSummary: record.questionDiagram.accessibleSummary,
          ariaLabel: record.questionDiagram.ariaLabel,
        }
      : null,
  });

const cp008MachineId = /\b[P-W]\d{2,}\b/;

for (const record of records) {
  if (record.checkpointId === "DIR-CP-008") {
    assert.doesNotMatch(
      learnerText(record),
      cp008MachineId,
      `${record.qlId}: synthetic point identifier leaked into learner text`,
    );
  }
}

for (let ql = 1; ql <= 44; ql += 1) {
  const qlId = `DIR-QL-${String(ql).padStart(3, "0")}`;
  const group = records.filter((record) => record.qlId === qlId);
  assert.equal(group.length, 3, `${qlId}: expected English/Hindi/Punjabi samples`);
  const english = group.find((record) => !record.locale)!;
  const hindi = group.find((record) => record.locale === "hi-IN")!;
  const punjabi = group.find((record) => record.locale === "pa-IN")!;
  assert.equal(hindi.seed, english.seed);
  assert.equal(punjabi.seed, english.seed);
  assert.deepEqual(hindi.structuredPrompt, english.structuredPrompt, `${qlId}: Hindi semantic drift`);
  assert.deepEqual(punjabi.structuredPrompt, english.structuredPrompt, `${qlId}: Punjabi semantic drift`);
  assert.equal(hindi.correctIndex, english.correctIndex, `${qlId}: Hindi correct-index drift`);
  assert.equal(punjabi.correctIndex, english.correctIndex, `${qlId}: Punjabi correct-index drift`);
  assert.deepEqual(hindi.correctAnswer, english.correctAnswer, `${qlId}: Hindi answer drift`);
  assert.deepEqual(punjabi.correctAnswer, english.correctAnswer, `${qlId}: Punjabi answer drift`);
}

console.log(JSON.stringify({
  verdict: "DIR_001_FINAL_AUDIT_REVIEW_PACK_PROVED",
  samples: records.length,
  structuredExplanationRendering: true,
  cp008SyntheticPointIdsRejected: true,
  trilingualSemanticParity: true,
}, null, 2));
