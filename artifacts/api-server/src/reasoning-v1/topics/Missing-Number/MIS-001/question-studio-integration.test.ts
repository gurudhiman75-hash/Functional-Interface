import assert from 'node:assert/strict';
import { reasoningV1QuestionStudioAdapter } from '../../../../question-studio/engines/reasoning-v1-adapter';
import {
  MIS_001_QUESTION_STUDIO_PACKAGE,
  generateMis001QuestionStudioBatch,
  isMis001QuestionStudioRequest,
} from './question-studio-integration';

async function main() {
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.packageId, 'MIS-001');
  assert.deepEqual(MIS_001_QUESTION_STUDIO_PACKAGE.cpIds, ['MIS-CP-001', 'MIS-CP-002', 'MIS-CP-003']);
  assert.deepEqual(MIS_001_QUESTION_STUDIO_PACKAGE.supportedLanguages, ['en']);
  assert.deepEqual(MIS_001_QUESTION_STUDIO_PACKAGE.supportedDifficulties, ['Easy', 'Medium']);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.candidateCount, 25);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp003CandidateCount, 10);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.permanentQlAllocation, false);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.sourceSaturationComplete, false);

  const listed = reasoningV1QuestionStudioAdapter.listPackages()
    .find((entry) => entry.packageId === 'MIS-001');
  assert.ok(listed);
  assert.deepEqual(listed?.cpIds, ['MIS-CP-001', 'MIS-CP-002', 'MIS-CP-003']);

  assert.equal(isMis001QuestionStudioRequest({ packageId: 'MIS-001' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-002' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-003' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-024' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-014' }), true);
  assert.equal(isMis001QuestionStudioRequest({ subtopic: 'Missing Number' }), true);

  const first = await generateMis001QuestionStudioBatch({
    packageId: 'MIS-001',
    language: 'en',
    count: 25,
    seed: 'MIS-QS-CHAPTER-V1',
  });
  const replay = await generateMis001QuestionStudioBatch({
    packageId: 'MIS-001',
    language: 'en',
    count: 25,
    seed: 'MIS-QS-CHAPTER-V1',
  });
  assert.deepEqual(first, replay);
  assert.equal(first.questions.length, 25);

  const candidateIds = new Set<string>();
  const checkpointIds = new Set<string>();
  for (const question of first.questions as Record<string, any>[]) {
    candidateIds.add(String(question.candidateId));
    checkpointIds.add(String(question.checkpointId));
    assert.equal(question.packageId, 'MIS-001');
    assert.equal(question.provisionalQl, true);
    assert.equal(question.qlId, null);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.productionReleased, false);
    assert.equal(question.questionStudioDiscoverable, true);
    assert.equal(question.questionStudioGenerationEnabled, true);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.validation.sameRuleFitsAllExamples, true);
    assert.equal(question.validation.exactlyOneIntendedRule, true);
    assert.equal(question.validation.exactlyOneCorrect, true);
    assert.equal(question.validation.fourUniqueOptions, true);
    assert.equal(question.validation.solverAgreement, true);
    assert.equal(question.validation.everyDisplayedInputParticipates, true);
    assert.equal(question.missingPosition, 'RESULT_MISSING');
  }
  assert.equal(candidateIds.size, 25);
  assert.deepEqual([...checkpointIds].sort(), ['MIS-CP-001', 'MIS-CP-002', 'MIS-CP-003']);

  const cp002 = await generateMis001QuestionStudioBatch({
    packageId: 'MIS-001',
    patternId: 'MIS-CP-002',
    language: 'en',
    count: 14,
    seed: 'MIS-QS-CP002-V1',
  });
  assert.ok((cp002.questions as Record<string, any>[]).every((question) => question.checkpointId === 'MIS-CP-002'));
  assert.ok((cp002.questions as Record<string, any>[]).every((question) => question.operandCount === 3));
  assert.equal(new Set((cp002.questions as Record<string, any>[]).map((question) => question.candidateId)).size, 7);

  const cp003 = await generateMis001QuestionStudioBatch({
    packageId: 'MIS-001',
    patternId: 'MIS-CP-003',
    language: 'en',
    count: 20,
    seed: 'MIS-QS-CP003-V1',
  });
  assert.ok((cp003.questions as Record<string, any>[]).every((question) => question.checkpointId === 'MIS-CP-003'));
  assert.equal(new Set((cp003.questions as Record<string, any>[]).map((question) => question.candidateId)).size, 10);
  assert.ok((cp003.questions as Record<string, any>[]).some((question) => question.operandCount === 1));
  assert.ok((cp003.questions as Record<string, any>[]).some((question) => question.operandCount === 2));
  assert.ok((cp003.questions as Record<string, any>[]).every((question) =>
    String(question.explanation).includes('Now apply the same rule to the row with the question mark:'),
  ));

  const easy = await generateMis001QuestionStudioBatch({
    packageId: 'MIS-001',
    language: 'en',
    difficulty: 'Easy',
    count: 16,
    seed: 'MIS-QS-EASY-CP001-CP003',
  });
  assert.ok((easy.questions as Record<string, any>[]).every((question) => question.difficulty === 'Easy'));

  const medium = await generateMis001QuestionStudioBatch({
    packageId: 'MIS-001',
    language: 'en',
    difficulty: 'Medium',
    count: 16,
    seed: 'MIS-QS-MEDIUM-CP001-CP003',
  });
  assert.ok((medium.questions as Record<string, any>[]).every((question) => question.difficulty === 'Medium'));

  await assert.rejects(
    () => generateMis001QuestionStudioBatch({ packageId: 'MIS-001', language: 'hi', count: 1 }),
    /English editorial review/,
  );
  await assert.rejects(
    () => generateMis001QuestionStudioBatch({ packageId: 'MIS-001', language: 'en', difficulty: 'Hard', count: 1 }),
    /do not yet expose Hard/,
  );
  await assert.rejects(
    () => generateMis001QuestionStudioBatch({
      packageId: 'MIS-001',
      patternId: 'MIS-CAND-003',
      canonicalProblemId: 'MIS-CP-002',
      language: 'en',
      count: 1,
    }),
    /is not owned by MIS-CP-002/,
  );

  console.log('MIS-001 chapter Question Studio CP001-CP003 integration audit passed.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
