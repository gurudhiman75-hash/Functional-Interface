import assert from 'node:assert/strict';
import { generateMis001QuestionStudioBatch, MIS_001_QUESTION_STUDIO_PACKAGE } from './question-studio-integration';

const APPROVED_FIRST_LINES = new Set([
  'Find the number that will replace the question mark (?).',
  'Find the missing value in the following figure.',
  'Find the missing value in the following figures.',
  'Find the missing number.',
  'Find the missing number in the following figures.',
]);

const ENGINE_ENUM = /\b[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+\b/;
const INTERNAL_ID = /\bMIS-(?:CAND|CP)-\d+\b/i;
const SOURCE_PROVENANCE = /\b(?:SSC|PSPCL|PSSSB|RRB|IBPS|SBI)\b|source[- ]backed|semantic authority|candidate id|checkpoint id/i;
const MECHANICAL_STEM = /\bstudy the (?:pattern|figure|figures)\b/i;

const result = await generateMis001QuestionStudioBatch({
  packageId: 'MIS-001',
  language: 'en',
  count: 112,
  seed: 'MIS-001-ENGLISH-EDITORIAL-FREEZE-V1',
});

assert.equal(result.questions.length, 112);
assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.sourceSaturationComplete, true);
assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.mergeSplitAuditComplete, true);
assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.englishEditorialFreezeComplete, true);

for (const raw of result.questions as Record<string, any>[]) {
  const stem = String(raw.stem ?? '');
  const explanation = String(raw.explanation ?? '');
  const firstLine = stem.split('\n').find((line) => line.trim().length > 0)?.trim() ?? '';
  const learnerText = stem + '\n' + explanation;

  assert.ok(APPROVED_FIRST_LINES.has(firstLine), `${raw.candidateId}: unapproved first-line stem: ${firstLine}`);
  assert.equal(MECHANICAL_STEM.test(stem), false, `${raw.candidateId}: mechanical stem wording leaked`);
  assert.equal(INTERNAL_ID.test(learnerText), false, `${raw.candidateId}: internal MIS id leaked into learner text`);
  assert.equal(ENGINE_ENUM.test(learnerText), false, `${raw.candidateId}: engine enum leaked into learner text`);
  assert.equal(SOURCE_PROVENANCE.test(learnerText), false, `${raw.candidateId}: source provenance leaked into learner text`);
  assert.ok(explanation.includes(String(raw.answer)), `${raw.candidateId}: explanation does not include answer`);
}

console.log('MIS-001 English editorial freeze audit passed.', {
  runtimePatterns: result.questions.length,
  approvedStemForms: APPROVED_FIRST_LINES.size,
});
