import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { generateRnkCp001ProvisionalAuthorityReviewQuestion } from './cp001-provisional-authority-runtime';
import { RNK_CP001_PROVISIONAL_AUTHORITY_IDS } from './cp001-provisional-consolidation';

const SEEDS_PER_AUTHORITY = 320;
const INTERNAL_TAG = /\s\[[A-Z0-9_]+\](?:\s|$)/;
const INTERNAL_ID = /\b(?:RNK-|CP001-|PROT-|AUTH-|NOT_STORED|INELIGIBLE)\b/i;
const INTERNAL_FIELD = /\b(?:misconceptionId|questionStudioDiscoverable|publiclyPublishable)\b/i;
const RAW_MULTIPLICATION = /\b\d+\s+x\s+\d+\b/;

let generatedQuestions = 0;
let optionDiagnosticLines = 0;
let structuredMisconceptionIds = 0;

for (const authorityId of RNK_CP001_PROVISIONAL_AUTHORITY_IDS) {
  for (let seed = 0; seed < SEEDS_PER_AUTHORITY; seed += 1) {
    const reviewQuestion = generateRnkCp001ProvisionalAuthorityReviewQuestion(authorityId, seed);
    const question = reviewQuestion.question;
    const learnerText = [
      question.stem,
      question.explanation.keyRule,
      ...question.explanation.stepByStepSolution,
      question.explanation.examSpeedShortcut,
      ...question.explanation.optionAnalysis,
      question.explanation.conclusion,
    ].join('\n');

    assert.ok(!INTERNAL_TAG.test(learnerText), `${authorityId} seed ${seed}: internal tag leaked`);
    assert.ok(!INTERNAL_ID.test(learnerText), `${authorityId} seed ${seed}: internal ID leaked`);
    assert.ok(!INTERNAL_FIELD.test(learnerText), `${authorityId} seed ${seed}: internal field leaked`);
    assert.ok(!RAW_MULTIPLICATION.test(learnerText), `${authorityId} seed ${seed}: raw x multiplication leaked`);
    assert.ok(!/\b0 people are\b/i.test(learnerText));
    assert.ok(!/\b1 people are\b/i.test(learnerText));
    assert.ok(!/\bno one are\b/i.test(learnerText));
    assert.ok(!/\bone person are\b/i.test(learnerText));

    assert.equal(question.explanation.optionAnalysis.length, 4);
    for (const line of question.explanation.optionAnalysis) {
      assert.ok(!/\[[A-Z0-9_]+\]/.test(line));
      optionDiagnosticLines += 1;
    }

    assert.equal(question.options.length, 4);
    for (const option of question.options) {
      assert.ok(option.misconceptionId.length > 0, 'Structured misconception metadata must be retained');
      structuredMisconceptionIds += 1;
    }

    generatedQuestions += 1;
  }
}

assert.equal(generatedQuestions, 2_880);
assert.equal(optionDiagnosticLines, 11_520);
assert.equal(structuredMisconceptionIds, 11_520);

const report = {
  packageId: 'RNK-001',
  checkpointId: 'RNK-CP-001',
  authorityCount: RNK_CP001_PROVISIONAL_AUTHORITY_IDS.length,
  permanentQlCount: 0,
  generatedQuestions,
  learnerTextLeakChecks: generatedQuestions,
  optionDiagnosticLeakChecks: optionDiagnosticLines,
  structuredMisconceptionMetadataChecks: structuredMisconceptionIds,
  internalTagLeaks: 0,
  internalIdLeaks: 0,
  grammarLeaks: 0,
  conclusion: 'PASS_REVIEW_CORPUS_HYGIENE',
};

const outputDirectory = process.argv[2];
if (outputDirectory) {
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(
    join(outputDirectory, 'rnk-cp001-review-corpus-hygiene.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  );
}

console.log(JSON.stringify(report, null, 2));
