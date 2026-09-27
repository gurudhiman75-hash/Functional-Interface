// V11 source-saturation gate: CP001-CP027 must validate together.
import assert from 'node:assert/strict';
import { reasoningV1QuestionStudioAdapter } from '../../../../question-studio/engines/reasoning-v1-adapter';
import {
  MIS_001_QUESTION_STUDIO_PACKAGE,
  generateMis001QuestionStudioBatch,
  isMis001QuestionStudioRequest,
} from './question-studio-integration';

async function main() {
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.packageId, 'MIS-001');
  assert.deepEqual(MIS_001_QUESTION_STUDIO_PACKAGE.cpIds, ['MIS-CP-001','MIS-CP-002','MIS-CP-003','MIS-CP-004','MIS-CP-005','MIS-CP-006','MIS-CP-007','MIS-CP-008','MIS-CP-009','MIS-CP-010','MIS-CP-011','MIS-CP-012','MIS-CP-013','MIS-CP-014','MIS-CP-015','MIS-CP-016','MIS-CP-017','MIS-CP-018','MIS-CP-019','MIS-CP-020','MIS-CP-021','MIS-CP-022','MIS-CP-023','MIS-CP-024','MIS-CP-025','MIS-CP-026','MIS-CP-027']);
  assert.deepEqual(MIS_001_QUESTION_STUDIO_PACKAGE.supportedLanguages, ['en']);
  assert.deepEqual(MIS_001_QUESTION_STUDIO_PACKAGE.supportedDifficulties, ['Easy', 'Medium', 'Hard']);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.candidateCount, 74);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.semanticAuthorityCount, 74);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.runtimePatternCount, 111);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.reusedSemanticVariantCount, 37);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp003CandidateCount, 10);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp004CandidateCount, 9);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp005CandidateCount, 8);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp006CandidateCount, 7);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp007CandidateCount, 7);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp008CandidateCount, 6);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp009CandidateCount, 6);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp010CandidateCount, 6);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp011CandidateCount, 4);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp012CandidateCount, 5);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp013CandidateCount, 2);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp014CandidateCount, 1);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp015CandidateCount, 3);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp016CandidateCount, 1);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp017CandidateCount, 1);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp018CandidateCount, 4);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp019CandidateCount, 5);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp020CandidateCount, 3);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp021CandidateCount, 2);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp022CandidateCount, 1);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp023CandidateCount, 1);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp024CandidateCount, 1);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp025CandidateCount, 1);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp026CandidateCount, 1);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.cp027CandidateCount, 1);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.permanentQlAllocation, false);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.sourceSaturationComplete, false);
  assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.metadata?.mergeSplitAuditComplete, true);

  const listed = reasoningV1QuestionStudioAdapter.listPackages()
    .find((entry) => entry.packageId === 'MIS-001');
  assert.ok(listed);
  assert.deepEqual(listed?.cpIds, ['MIS-CP-001','MIS-CP-002','MIS-CP-003','MIS-CP-004','MIS-CP-005','MIS-CP-006','MIS-CP-007','MIS-CP-008','MIS-CP-009','MIS-CP-010','MIS-CP-011','MIS-CP-012','MIS-CP-013','MIS-CP-014','MIS-CP-015','MIS-CP-016','MIS-CP-017','MIS-CP-018','MIS-CP-019','MIS-CP-020','MIS-CP-021','MIS-CP-022','MIS-CP-023','MIS-CP-024','MIS-CP-025','MIS-CP-026','MIS-CP-027']);

  assert.equal(isMis001QuestionStudioRequest({ packageId: 'MIS-001' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-002' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-003' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-024' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-004' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-034' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-005' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-043' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-056' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-008' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-068' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-074' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-011' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-083' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-013' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-085' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-014' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-086' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-015' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-089' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-016' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-090' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-017' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-091' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-018' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-095' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-019' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-100' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-020' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-103' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-021' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-105' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-022' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-106' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-023' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-107' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-024' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-108' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-025' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-109' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-026' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-110' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CP-027' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-111' }), true);
  assert.equal(isMis001QuestionStudioRequest({ patternId: 'MIS-CAND-014' }), true);
  assert.equal(isMis001QuestionStudioRequest({ subtopic: 'Missing Number' }), true);

  const first = await generateMis001QuestionStudioBatch({
    packageId: 'MIS-001',
    language: 'en',
    count: 111,
    seed: 'MIS-QS-CHAPTER-V1',
  });
  const replay = await generateMis001QuestionStudioBatch({
    packageId: 'MIS-001',
    language: 'en',
    count: 111,
    seed: 'MIS-QS-CHAPTER-V1',
  });
  assert.deepEqual(first, replay);
  assert.equal(first.questions.length, 111);

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
    assert.ok(['RESULT_MISSING','CENTRE_MISSING','FIRST_INPUT','SECOND_INPUT','THIRD_INPUT','RESULT','TOP_VERTEX','LEFT_VERTEX','RIGHT_VERTEX','CENTRE','CORNER_MISSING','RIGHT_PRODUCT','OPPOSITE_OUTPUT'].includes(question.missingPosition));
  }
  assert.equal(candidateIds.size, 111);
  assert.deepEqual([...checkpointIds].sort(), ['MIS-CP-001','MIS-CP-002','MIS-CP-003','MIS-CP-004','MIS-CP-005','MIS-CP-006','MIS-CP-007','MIS-CP-008','MIS-CP-009','MIS-CP-010','MIS-CP-011','MIS-CP-012','MIS-CP-013','MIS-CP-014','MIS-CP-015','MIS-CP-016','MIS-CP-017','MIS-CP-018','MIS-CP-019','MIS-CP-020','MIS-CP-021','MIS-CP-022','MIS-CP-023','MIS-CP-024','MIS-CP-025','MIS-CP-026','MIS-CP-027']);

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
  assert.ok((cp005.questions as Record<string,any>[]).every(q=>q.createsNewSemanticAuthority===false));

  const cp006 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-006', language:'en', count:14, seed:'MIS-QS-CP006-V1',
  });
  assert.equal(new Set((cp006.questions as Record<string,any>[]).map(q=>q.candidateId)).size,7);
  assert.ok((cp006.questions as Record<string,any>[]).every(q=>q.renderer==='SVG_CIRCLE' && q.figures?.length>=3));
  assert.equal((cp006.questions as Record<string,any>[]).filter(q=>q.createsNewSemanticAuthority===false).length,12);

  const cp007 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-007', language:'en', count:14, seed:'MIS-QS-CP007-V1',
  });
  assert.equal(new Set((cp007.questions as Record<string,any>[]).map(q=>q.candidateId)).size,7);
  assert.ok((cp007.questions as Record<string,any>[]).every(q=>q.renderer==='SVG_BOX' && q.figures?.length>=3));
  assert.ok((cp007.questions as Record<string,any>[]).some(q=>q.figures.some((f:any)=>f.shape==='SQUARE')));
  assert.ok((cp007.questions as Record<string,any>[]).some(q=>q.figures.some((f:any)=>f.shape==='RECTANGLE')));

  const cp008 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-008', language:'en', count:12, seed:'MIS-QS-CP008-V1',
  });
  assert.equal(new Set((cp008.questions as Record<string,any>[]).map(q=>q.candidateId)).size,6);
  assert.ok((cp008.questions as Record<string,any>[]).some(q=>q.forwardOrInverse==='INVERSE'));
  assert.ok((cp008.questions as Record<string,any>[]).some(q=>q.renderer==='SVG_TRIANGLE'));
  const cp008Rows = cp008.questions as Record<string,any>[];
  const cp008Authority = new Map(cp008Rows.map(q=>[q.candidateId,q.semanticAuthorityCandidateId]));
  assert.equal(cp008Authority.get('MIS-CAND-057'),'MIS-CAND-001');
  assert.equal(cp008Authority.get('MIS-CAND-058'),'MIS-CAND-003');
  assert.equal(cp008Authority.get('MIS-CAND-059'),'MIS-CAND-059');
  assert.equal(cp008Authority.get('MIS-CAND-060'),'MIS-CAND-017');
  assert.equal(cp008Authority.get('MIS-CAND-061'),'MIS-CAND-012');
  assert.equal(cp008Authority.get('MIS-CAND-062'),'MIS-CAND-011');
  assert.equal(cp008Rows.filter(q=>q.createsNewSemanticAuthority===false).length,10);

  const cp009 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-009', language:'en', count:12, seed:'MIS-QS-CP009-V1',
  });
  assert.equal(new Set((cp009.questions as Record<string,any>[]).map(q=>q.candidateId)).size,6);
  assert.ok((cp009.questions as Record<string,any>[]).every(q=>q.renderer==='SVG_BOX' && q.pairingAuthority));
  const cp009Rows = cp009.questions as Record<string,any>[];
  const cp009Authority = new Map(cp009Rows.map(q=>[q.candidateId,q.semanticAuthorityCandidateId]));
  assert.equal(cp009Authority.get('MIS-CAND-063'),'MIS-CAND-051');
  assert.equal(cp009Authority.get('MIS-CAND-064'),'MIS-CAND-064');
  assert.equal(cp009Authority.get('MIS-CAND-065'),'MIS-CAND-051');
  assert.equal(cp009Authority.get('MIS-CAND-066'),'MIS-CAND-051');
  assert.equal(cp009Authority.get('MIS-CAND-067'),'MIS-CAND-067');
  assert.equal(cp009Authority.get('MIS-CAND-068'),'MIS-CAND-054');
  assert.equal(cp009Rows.filter(q=>q.createsNewSemanticAuthority===false).length,8);

  const cp010 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-010', language:'en', count:12, seed:'MIS-QS-CP010-V1',
  });
  assert.equal(new Set((cp010.questions as Record<string,any>[]).map(q=>q.candidateId)).size,6);
  assert.ok((cp010.questions as Record<string,any>[]).every(q=>q.wholeNumberOrDigitMode==='DIGIT'));

  const cp011 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-011', language:'en', count:8, seed:'MIS-QS-CP011-V1',
  });
  assert.equal(new Set((cp011.questions as Record<string,any>[]).map(q=>q.candidateId)).size,4);
  assert.ok((cp011.questions as Record<string,any>[]).every(q=>q.createsNewSemanticAuthority===true));
  assert.ok((cp011.questions as Record<string,any>[]).every(q=>q.operationDepth===2));

  const cp012 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-012', language:'en', count:10, seed:'MIS-QS-CP012-V1',
  });
  const cp012Rows = cp012.questions as Record<string,any>[];
  assert.equal(new Set(cp012Rows.map(q=>q.candidateId)).size,5);
  assert.ok(cp012Rows.every(q=>q.difficulty==='Hard'));
  assert.ok(cp012Rows.every(q=>q.createsNewSemanticAuthority===false));
  assert.ok(cp012Rows.every(q=>q.firstGroupCompetingRuleCount>=2 && q.finalCompetingRuleCount===1));
  assert.ok(cp012Rows.some(q=>q.renderer==='SVG_BOX'));
  assert.ok(cp012Rows.some(q=>q.renderer==='TABLE_GROUP'));

  const cp013 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-013', language:'en', count:8, seed:'MIS-QS-CP013-V1',
  });
  const cp013Rows = cp013.questions as Record<string,any>[];
  assert.equal(new Set(cp013Rows.map(q=>q.candidateId)).size,2);
  assert.ok(cp013Rows.every(q=>q.sourceBacked===true));
  assert.ok(cp013Rows.every(q=>q.createsNewSemanticAuthority===true));
  assert.ok(cp013Rows.filter(q=>q.candidateId==='MIS-CAND-084').every(q=>q.structuralFingerprint.includes('|2|SOURCE_BACKED')));

  const cp014 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-014', language:'en', count:8, seed:'MIS-QS-CP014-V1',
  });
  const cp014Rows = cp014.questions as Record<string,any>[];
  assert.ok(cp014Rows.every(q=>q.candidateId==='MIS-CAND-086'));
  assert.ok(cp014Rows.every(q=>q.semanticAuthorityCandidateId==='MIS-CAND-050'));
  assert.ok(cp014Rows.every(q=>q.createsNewSemanticAuthority===false));
  assert.ok(cp014Rows.every(q=>q.missingPosition==='CORNER_MISSING' && q.forwardOrInverse==='INVERSE'));
  assert.ok(cp014Rows.every(q=>q.sourceBacked===true));
  assert.ok(cp014Rows.every(q=>q.figures?.every((f:any)=>!String(f.svg).includes('<circle'))));


  const cp015 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-015', language:'en', count:12, seed:'MIS-QS-CP015-V1',
  });
  const cp015Rows = cp015.questions as Record<string,any>[];
  assert.equal(new Set(cp015Rows.map(q=>q.candidateId)).size,3);
  assert.ok(cp015Rows.every(q=>q.sourceBacked===true));
  assert.ok(cp015Rows.every(q=>q.createsNewSemanticAuthority===true));
  assert.ok(cp015Rows.some(q=>q.candidateId==='MIS-CAND-087' && q.structuralFingerprint.includes('PAIR_PRODUCT_PLUS_FIRST')));
  assert.ok(cp015Rows.some(q=>q.candidateId==='MIS-CAND-088' && q.structuralFingerprint.includes('THREE_INPUT_PRODUCT_PLUS_ONE')));
  assert.ok(cp015Rows.some(q=>q.candidateId==='MIS-CAND-089' && q.structuralFingerprint.includes('THREE_INPUT_PRODUCT_MINUS_ONE')));
  assert.ok(cp015Rows.filter(q=>q.candidateId==='MIS-CAND-089').some(q=>q.forwardOrInverse==='INVERSE'));

  const cp016 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-016', language:'en', count:8, seed:'MIS-QS-CP016-V1',
  });
  const cp016Rows = cp016.questions as Record<string,any>[];
  assert.ok(cp016Rows.every(q=>q.candidateId==='MIS-CAND-090'));
  assert.ok(cp016Rows.every(q=>q.semanticAuthorityCandidateId==='MIS-CAND-090'));
  assert.ok(cp016Rows.every(q=>q.createsNewSemanticAuthority===true));
  assert.ok(cp016Rows.every(q=>q.sourceBacked===true && q.difficulty==='Hard'));
  assert.ok(cp016Rows.every(q=>q.structuralFingerprint.includes('PAIR_PRODUCT_DIFFERENCE_TIMES_CONSTANT') && q.structuralFingerprint.includes('K=2')));
  assert.ok(cp016Rows.every(q=>q.renderer==='SVG_BOX' && q.pairingAuthority==='ROWS'));

  const cp017 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-017', language:'en', count:8, seed:'MIS-QS-CP017-V1',
  });
  const cp017Rows = cp017.questions as Record<string,any>[];
  assert.ok(cp017Rows.every(q=>q.candidateId==='MIS-CAND-091'));
  assert.ok(cp017Rows.every(q=>q.semanticAuthorityCandidateId==='MIS-CAND-091'));
  assert.ok(cp017Rows.every(q=>q.createsNewSemanticAuthority===true));
  assert.ok(cp017Rows.every(q=>q.sourceBacked===true));
  assert.ok(cp017Rows.every(q=>q.wholeNumberOrDigitMode==='MIXED_WHOLE_AND_DIGIT'));
  assert.ok(cp017Rows.every(q=>q.validation.solverAgreement===true && q.validation.exactlyOneIntendedRule===true));

  const cp018 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-018', language:'en', count:12, seed:'MIS-QS-CP018-V1',
  });
  const cp018Rows = cp018.questions as Record<string,any>[];
  assert.equal(new Set(cp018Rows.map(q=>q.candidateId)).size,4);
  assert.ok(cp018Rows.every(q=>q.sourceBacked===true));
  assert.ok(cp018Rows.every(q=>q.createsNewSemanticAuthority===true));
  assert.ok(cp018Rows.every(q=>q.wholeNumberOrDigitMode==='WHOLE_NUMBER'));
  assert.ok(cp018Rows.filter(q=>q.candidateId==='MIS-CAND-093').every(q=>q.structuralFingerprint.includes('D=2')));
  assert.ok(cp018Rows.filter(q=>q.candidateId==='MIS-CAND-095').every(q=>q.sourceThin===true && q.structuralFingerprint.includes('W=4') && q.structuralFingerprint.includes('K=1')));

  const cp019 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-019', language:'en', count:15, seed:'MIS-QS-CP019-V1',
  });
  const cp019Rows = cp019.questions as Record<string,any>[];
  assert.equal(new Set(cp019Rows.map(q=>q.candidateId)).size,5);
  assert.ok(cp019Rows.every(q=>q.sourceBacked===true));
  assert.equal(cp019Rows.filter(q=>q.candidateId==='MIS-CAND-097' && q.semanticAuthorityCandidateId==='MIS-CAND-059' && q.createsNewSemanticAuthority===false).length,3);
  assert.ok(cp019Rows.filter(q=>q.candidateId!=='MIS-CAND-097').every(q=>q.createsNewSemanticAuthority===true));
  assert.ok(cp019Rows.filter(q=>q.candidateId==='MIS-CAND-100').every(q=>q.operandCount===4 && q.structuralFingerprint.includes('K=2')));

  const cp020 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-020', language:'en', count:9, seed:'MIS-QS-CP020-V1',
  });
  const cp020Rows = cp020.questions as Record<string,any>[];
  assert.equal(new Set(cp020Rows.map(q=>q.candidateId)).size,3);
  assert.ok(cp020Rows.every(q=>q.sourceBacked===true));
  assert.ok(cp020Rows.every(q=>q.createsNewSemanticAuthority===true));
  assert.ok(cp020Rows.every(q=>q.structuralFingerprint.includes('EXACT_ROOT')));
  assert.ok(cp020Rows.every(q=>q.wholeNumberOrDigitMode==='WHOLE_NUMBER'));

  const cp021 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-021', language:'en', count:8, seed:'MIS-QS-CP021-V1',
  });
  const cp021Rows = cp021.questions as Record<string,any>[];
  assert.equal(new Set(cp021Rows.map(q=>q.candidateId)).size,2);
  assert.ok(cp021Rows.every(q=>q.sourceBacked===true));
  assert.ok(cp021Rows.every(q=>q.createsNewSemanticAuthority===true));
  assert.ok(cp021Rows.some(q=>q.candidateId==='MIS-CAND-104' && q.structuralFingerprint.includes('CUBE_ROOT_OF_DIFFERENCE')));
  assert.ok(cp021Rows.some(q=>q.candidateId==='MIS-CAND-105' && q.structuralFingerprint.includes('PAIR_PRODUCT_PLUS_ONE_TIMES_THIRD')));

  const cp022 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-022', language:'en', count:8, seed:'MIS-QS-CP022-V1',
  });
  const cp022Rows = cp022.questions as Record<string,any>[];
  assert.ok(cp022Rows.every(q=>q.candidateId==='MIS-CAND-106'));
  assert.ok(cp022Rows.every(q=>q.sourceBacked===true));
  assert.ok(cp022Rows.every(q=>q.createsNewSemanticAuthority===true));
  assert.ok(cp022Rows.every(q=>q.structuralFingerprint.includes('PAIR_ARITHMETIC_MEAN')));
  assert.ok(cp022Rows.every(q=>q.validation.solverAgreement===true && q.validation.exactlyOneIntendedRule===true));

  const cp023 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-023', language:'en', count:8, seed:'MIS-QS-CP023-V1',
  });
  const cp023Rows = cp023.questions as Record<string,any>[];
  assert.ok(cp023Rows.every(q=>q.candidateId==='MIS-CAND-107'));
  assert.ok(cp023Rows.every(q=>q.sourceBacked===true));
  assert.ok(cp023Rows.every(q=>q.createsNewSemanticAuthority===true));
  assert.ok(cp023Rows.every(q=>q.structuralFingerprint.includes('ROOT_SUM_TIMES_THIRD_PLUS_TWO')));
  assert.ok(cp023Rows.every(q=>q.validation.solverAgreement===true && q.validation.exactlyOneIntendedRule===true));

  const cp024 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-024', language:'en', count:8, seed:'MIS-QS-CP024-V1',
  });
  const cp024Rows = cp024.questions as Record<string,any>[];
  assert.ok(cp024Rows.every(q=>q.candidateId==='MIS-CAND-108'));
  assert.ok(cp024Rows.every(q=>q.sourceBacked===true));
  assert.ok(cp024Rows.every(q=>q.createsNewSemanticAuthority===true));
  assert.ok(cp024Rows.every(q=>q.context.multiplier===3 && q.context.addend===1));
  assert.ok(cp024Rows.every(q=>q.structuralFingerprint.includes('REPEATED_AFFINE_TRANSFORM')));

  const cp025 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-025', language:'en', count:8, seed:'MIS-QS-CP025-V1',
  });
  const cp025Rows = cp025.questions as Record<string,any>[];
  assert.ok(cp025Rows.every(q=>q.candidateId==='MIS-CAND-109'));
  assert.ok(cp025Rows.every(q=>q.sourceBacked===true));
  assert.ok(cp025Rows.every(q=>q.createsNewSemanticAuthority===false));
  assert.ok(cp025Rows.every(q=>q.semanticAuthorityCandidateId==='MIS-CAND-003'));
  assert.ok(cp025Rows.every(q=>q.renderer==='SVG_LINKED_PRODUCT'));
  assert.ok(cp025Rows.every(q=>q.figures?.length===3));
  assert.ok(cp025Rows.every(q=>q.validation.solverAgreement===true && q.validation.exactlyOneIntendedRule===true));

  const cp026 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-026', language:'en', count:8, seed:'MIS-QS-CP026-V1',
  });
  const cp026Rows = cp026.questions as Record<string,any>[];
  assert.ok(cp026Rows.every(q=>q.candidateId==='MIS-CAND-110'));
  assert.ok(cp026Rows.every(q=>q.sourceBacked===true));
  assert.ok(cp026Rows.every(q=>q.createsNewSemanticAuthority===false));
  assert.ok(cp026Rows.every(q=>q.semanticAuthorityCandidateId==='MIS-CAND-016'));
  assert.ok(cp026Rows.every(q=>q.renderer==='SVG_OPPOSITE_SQUARE_WHEEL'));
  assert.ok(cp026Rows.every(q=>q.figures?.length===1));
  assert.ok(cp026Rows.every(q=>q.validation.solverAgreement===true && q.validation.exactlyOneIntendedRule===true));

  const cp027 = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', patternId:'MIS-CP-027', language:'en', count:8, seed:'MIS-QS-CP027-V1',
  });
  const cp027Rows = cp027.questions as Record<string,any>[];
  assert.ok(cp027Rows.every(q=>q.candidateId==='MIS-CAND-111'));
  assert.ok(cp027Rows.every(q=>q.sourceBacked===true));
  assert.ok(cp027Rows.every(q=>q.createsNewSemanticAuthority===true));
  assert.ok(cp027Rows.every(q=>q.structuralFingerprint.includes('SUM_OF_CUBES')));

  const hard = await generateMis001QuestionStudioBatch({
    packageId:'MIS-001', language:'en', difficulty:'Hard', count:18, seed:'MIS-QS-HARD-CP001-CP027',
  });
  assert.ok((hard.questions as Record<string,any>[]).every(q=>q.difficulty==='Hard'));

  const easy = await generateMis001QuestionStudioBatch({
    packageId: 'MIS-001',
    language: 'en',
    difficulty: 'Easy',
    count: 16,
    seed: 'MIS-QS-EASY-CP001-CP027',
  });
  assert.ok((easy.questions as Record<string, any>[]).every((question) => question.difficulty === 'Easy'));

  const medium = await generateMis001QuestionStudioBatch({
    packageId: 'MIS-001',
    language: 'en',
    difficulty: 'Medium',
    count: 16,
    seed: 'MIS-QS-MEDIUM-CP001-CP027',
  });
  assert.ok((medium.questions as Record<string, any>[]).every((question) => question.difficulty === 'Medium'));

  await assert.rejects(
    () => generateMis001QuestionStudioBatch({ packageId: 'MIS-001', language: 'hi', count: 1 }),
    /English editorial review/,
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

  console.log('MIS-001 chapter Question Studio CP001-CP027 integration audit passed.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
