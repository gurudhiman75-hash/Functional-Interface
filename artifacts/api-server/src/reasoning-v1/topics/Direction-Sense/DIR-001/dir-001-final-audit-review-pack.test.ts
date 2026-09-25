import assert from "node:assert/strict";

import { DIR_001_QLS, generateDirectionQuestion } from "./chapter-registry";
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
const machineStemPadding = /near the main gate|beside the central lawn|along a marked track|close to the entrance|near the boundary wall|patrol officer|marked point|direction that is not stated|\bA courier\b|starts by facing [^.]+ and then [^.]+, then /i;
const genericDistractorLabel = /(?:RANDOM|GENERIC|PLACEHOLDER|ARBITRARY|DUMMY)(?:_|$)/i;

for (const ql of DIR_001_QLS) {
  for (let seed = 0; seed < 40; seed += 1) {
    const question = generateDirectionQuestion(ql.qlId, seed) as Record<string, any>;
    assert.doesNotMatch(question.stem, machineStemPadding, `${ql.qlId} seed ${seed}: machine-like stem padding`);
    assert.equal(question.options.length, 4, `${ql.qlId} seed ${seed}: option count`);
    assert.equal(
      new Set(question.options.map((option: Record<string, any>) => JSON.stringify(option.value))).size,
      4,
      `${ql.qlId} seed ${seed}: duplicate option values`,
    );
    assert.equal(
      new Set(question.options.map((option: Record<string, any>) => String(option.label).toLowerCase())).size,
      4,
      `${ql.qlId} seed ${seed}: duplicate option labels`,
    );
    assert.equal(
      question.options.filter((option: Record<string, any>) => option.errorLabel === null).length,
      1,
      `${ql.qlId} seed ${seed}: exactly one option must be correct`,
    );
    question.options.forEach((option: Record<string, any>, index: number) => {
      if (index === question.correctIndex) {
        assert.equal(option.errorLabel, null, `${ql.qlId} seed ${seed}: correct option must have null error label`);
      } else {
        assert.equal(typeof option.errorLabel, "string", `${ql.qlId} seed ${seed}: distractor must have an error label`);
        assert.ok(option.errorLabel.length >= 4, `${ql.qlId} seed ${seed}: distractor error label too weak`);
        assert.doesNotMatch(option.errorLabel, genericDistractorLabel, `${ql.qlId} seed ${seed}: generic distractor label`);
      }
    });
  }
}

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
  chapterWideStemRealismGuard: true,
  misconceptionDistractorGuard: true,
}, null, 2));
