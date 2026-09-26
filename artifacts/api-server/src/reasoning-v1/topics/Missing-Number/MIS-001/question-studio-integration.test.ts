import assert from 'node:assert/strict';
import { reasoningV1QuestionStudioAdapter } from '../../../../question-studio/engines/reasoning-v1-adapter';
import {
  MIS_001_QUESTION_STUDIO_PACKAGE,
  generateMis001QuestionStudioBatch,
  isMis001QuestionStudioRequest,
} from './question-studio-integration';

async function main() {
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.packageId, 'MIS-001');
  assert.deepEqual(MIS_001_QUESTION_STUDIO_PACKAGE.cpIds, ['MIS-CP-001','MIS-CP-002','MIS-CP-003','MIS-CP-004','MIS-CP-005','MIS-CP-006','MIS-CP-007']);
  assert.deepEqual(MIS_001_QUESTION_STUDIO_PACKAGE.supportedLanguages, ['en']);
  assert.deepEqual(MIS_001_QUESTION_STUDIO_PACKAGE.supportedDifficulties, ['Easy', 'Medium']);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.candidateCount, 56);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp003CandidateCount, 10);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp004CandidateCount, 9);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp005CandidateCount, 8);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp006CandidateCount, 7);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp007CandidateCount, 7);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.permanentQlAllocation, false);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.sourceSaturationComplete, false);

  const listed = reasoningV1QuestionStudioAdapter.listPackages()
    .find((entry) => entry.packageId === 'MIS-001');
  assert.ok(listed);
  assert.deepEqual(listed?.cpIds, ['MIS-CP-001','MIS-CP-002','MIS-CP-003','MIS-CP-004','MIS-CP-005','MIS-CP-006','MIS-CP-007']);

  assert.equal(isMis001QuestionStudioRequest({ packageId: 'MIS-001' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-002' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-003' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-024' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-004' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-034' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-005' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-043' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-056' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-014' }), true);
  assert.equal(isMis001QuestionStudioRequest({ subtopic: 'Missing Number' }), true);

  const first = await generateMis001QuestionStudioBatch({
    packageId: 'MIS-001',
    language: 'en',
    count: 56,
    seed: 'MIS-QS-CHAPTER-V1',
  });
  const replay = await generateMis001QuestionStudioBatch({
    packageId: 'MIS-001',
    language: 'en',
    count: 56,
    seed: 'MIS-QS-CHAPTER-V1',
  });
  assert.deepEqual(first, replay);
  assert.equal(first.questions.length, 56);

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
    assert.ok(['RESULT_MISSING','CENTRE_MISSING'].includes(question.missingPosition));
  }
  assert.equal(candidateIds.size, 56);
  assert.deepEqual([...checkpointIds].sort(), ['MIS-CP-001','MIS-CP-002','MIS-CP-003','MIS-CP-004','MIS-CP-005','MIS-CP-006','MIS-CP-007']);

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

  const cp004 = await generateMis001QuestionStudioBatch({
    packageId: 'MIS-001',
    patternId: 'MIS-CP-004',
    language: 'en',
    count: 18,
    seed: 'MIS-QS-CP004-V1',
  });
  assert.ok((cp004.questions as Record<string, any>[]).every((question) => question.checkpointId === 'MIS-CP-004'));
  assert.equal(new Set((cp004.questions as Record<string, any>[]).map((question) => question.candidateId)).size, 9);
  assert.ok((cp004.questions as Record<string, any>[]).some((question) => question.operandCount === 1));
  assert.ok((cp004.questions as Record<string, any>[]).some((question) => question.operandCount === 2));
  assert.ok((cp004.questions as Record<string, any>[]).some((question) => question.sourceThin === true));
  assert.ok((cp004.questions as Record<string, any>[]).every((question) =>
    String(question.explanation).includes('Now apply the same rule to the row with the question mark:'),
  ));

  const cp005 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-005', language:'en', count:16, seed:'MIS-QS-CP005-V1',
  });
  assert.equal(new Set((cp005.questions as Record<string,any>[]).map(q=>q.candidateId)).size,8);
  assert.ok((cp005.questions as Record<string,any>[]).every(q=>q.renderer==='SVG_TRIANGLE' && q.figures?.length>=3 && q.semanticPositions?.includes('centre')));

  const cp006 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-006', language:'en', count:14, seed:'MIS-QS-CP006-V1',
  });
  assert.equal(new Set((cp006.questions as Record<string,any>[]).map(q=>q.candidateId)).size,7);
  assert.ok((cp006.questions as Record<string,any>[]).every(q=>q.renderer==='SVG_CIRCLE' && q.figures?.length>=3));

  const cp007 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-007', language:'en', count:14, seed:'MIS-QS-CP007-V1',
  });
  assert.equal(new Set((cp007.questions as Record<string,any>[]).map(q=>q.candidateId)).size,7);
  assert.ok((cp007.questions as Record<string,any>[]).every(q=>q.renderer==='SVG_BOX' && q.figures?.length>=3));
  assert.ok((cp007.questions as Record<string,any>[]).some(q=>q.figures.some((f:any)=>f.shape==='SQUARE')));
  assert.ok((cp007.questions as Record<string,any>[]).some(q=>q.figures.some((f:any)=>f.shape==='RECTANGLE')));

  const easy = await generateMis001QuestionStudioBatch({
    packageId: 'MIS-001',
    language: 'en',
    difficulty: 'Easy',
    count: 16,
    seed: 'MIS-QS-EASY-CP001-CP007',
  });
  assert.ok((easy.questions as Record<string, any>[]).every((question) => question.difficulty === 'Easy'));

  const medium = await generateMis001QuestionStudioBatch({
    packageId: 'MIS-001',
    language: 'en',
    difficulty: 'Medium',
    count: 16,
    seed: 'MIS-QS-MEDIUM-CP001-CP007',
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

  console.log('MIS-001 chapter Question Studio CP001-CP007 integration audit passed.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
