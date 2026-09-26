import assert from 'node:assert/strict';
import {
  MIS_CP001_QUESTION_STUDIO_PACKAGE,
  generateMis001QuestionStudioBatch,
  isMis001QuestionStudioRequest,
} from './question-studio-integration';

async function main() {
  assert.equal(MIS_CP001_QUESTION_STUDIO_PACKAGE.packageId, 'MIS-001');
  assert.deepEqual(MIS_CP001_QUESTION_STUDIO_PACKAGE.cpIds, ['MIS-CP-001']);
  assert.deepEqual(MIS_CP001_QUESTION_STUDIO_PACKAGE.supportedLanguages, ['en']);
  assert.equal(MIS_CP001_QUESTION_STUDIO_PACKAGE.metadata?.permanentQlAllocation, false);
  assert.equal(MIS_CP001_QUESTION_STUDIO_PACKAGE.metadata?.sourceSaturationComplete, false);

  assert.equal(isMis001QuestionStudioRequest({ packageId: 'MIS-001' }), true);
  assert.equal(isMis001QuestionStudioRequest({ subtopic: 'Missing Number' }), true);

  const first = await generateMis001QuestionStudioBatch({
    packageId: 'MIS-001',
    language: 'en',
    count: 8,
    seed: 'MIS-QS-INTEGRATION-V1',
  });
  const replay = await generateMis001QuestionStudioBatch({
    packageId: 'MIS-001',
    language: 'en',
    count: 8,
    seed: 'MIS-QS-INTEGRATION-V1',
  });
  assert.deepEqual(first, replay);
  assert.equal(first.questions.length, 8);

  const candidateIds = new Set<string>();
  for (const question of first.questions as Record<string, any>[]) {
    candidateIds.add(String(question.candidateId));
    assert.equal(question.packageId, 'MIS-001');
    assert.equal(question.checkpointId, 'MIS-CP-001');
    assert.equal(question.provisionalQl, true);
    assert.equal(question.qlId, null);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.productionReleased, false);
    assert.equal(question.questionStudioDiscoverable, true);
    assert.equal(question.questionStudioGenerationEnabled, true);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.validation.exactlyOneIntendedRule, true);
    assert.equal(question.validation.exactlyOneCorrect, true);
    assert.equal(question.validation.fourUniqueOptions, true);
    assert.equal(question.missingPosition, 'RESULT_MISSING');
  }
  assert.equal(candidateIds.size, 8);

  const easy = await generateMis001QuestionStudioBatch({
    packageId: 'MIS-001',
    language: 'en',
    difficulty: 'Easy',
    count: 12,
    seed: 'MIS-QS-EASY-V1',
  });
  assert.ok((easy.questions as Record<string, any>[]).every((question) => question.difficulty === 'Easy'));

  const medium = await generateMis001QuestionStudioBatch({
    packageId: 'MIS-001',
    language: 'en',
    difficulty: 'Medium',
    count: 12,
    seed: 'MIS-QS-MEDIUM-V1',
  });
  assert.ok((medium.questions as Record<string, any>[]).every((question) => question.difficulty === 'Medium'));

  await assert.rejects(
    () => generateMis001QuestionStudioBatch({ packageId: 'MIS-001', language: 'hi', count: 1 }),
    /English editorial review/,
  );
  await assert.rejects(
    () => generateMis001QuestionStudioBatch({ packageId: 'MIS-001', language: 'en', difficulty: 'Hard', count: 1 }),
    /Hard begins in later checkpoints/,
  );

  console.log('MIS-CP-001 Question Studio integration audit passed.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
