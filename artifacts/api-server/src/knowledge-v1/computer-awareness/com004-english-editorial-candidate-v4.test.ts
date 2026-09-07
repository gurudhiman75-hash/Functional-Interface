import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { COM004_ENGLISH_EDITORIAL_CANDIDATE_V4, COM004_ENGLISH_EDITORIAL_AUTHORITY_V4, auditCom004EnglishEditorialCandidateV4 } from './com004-english-editorial-candidate-v4';
import { COM004_ENGLISH_CHAPTER_V3, COM004_EDITORIAL_APPROVAL_V3 } from './com004-editorial-corpus-v3';
import { renderCom004FullEnglishReviewV4 } from './com004-full-review-md-v4';
import { knowledgeV1Com004QuestionStudioAdapterV1 } from '../../question-studio/engines/knowledge-v1-com004-adapter-v1';

const audit = auditCom004EnglishEditorialCandidateV4();
assert.equal(audit.valid, true, audit.issues.join('\n'));
assert.equal(audit.questionCount, 204);
assert.equal(audit.revisedQuestionCount, 170);
assert.equal(audit.retainedApprovedQuestionCount, 34);
const approved = new Set(COM004_EDITORIAL_APPROVAL_V3.revisedSourceQuestionIds);
for (const [i, question] of COM004_ENGLISH_EDITORIAL_CANDIDATE_V4.entries()) {
  assert.ok(Object.isFrozen(question));
  assert.ok(Object.isFrozen(question.options));
  const old = COM004_ENGLISH_CHAPTER_V3[i];
  assert.equal(question.questionId, old.questionId);
  assert.equal(question.canonicalAnswer, question.options[question.correctIndex]);
  assert.deepEqual(question.options, old.options);
  if (approved.has(question.questionId)) assert.deepEqual(question, old);
  else assert.notEqual(question.explanation, old.explanation, `Unrevised explanation: ${question.questionId}`);
}
// Reject answer or source changes hidden among otherwise legitimate editorial edits.
const changedAnswer = COM004_ENGLISH_EDITORIAL_CANDIDATE_V4.map((q, i) => i === 0 ? { ...q, canonicalAnswer: 'World Wide Web' } : q);
assert.equal(auditCom004EnglishEditorialCandidateV4(changedAnswer).valid, false);
const changedProvenance = COM004_ENGLISH_EDITORIAL_CANDIDATE_V4.map((q, i) => i === 0 ? { ...q, authorityProposalId: 'wrong' } : q);
assert.ok(auditCom004EnglishEditorialCandidateV4(changedProvenance).issues.some(issue => issue.startsWith('PROTECTED_FIELD')));
const changedApproved = COM004_ENGLISH_EDITORIAL_CANDIDATE_V4.map(q => approved.has(q.questionId) ? { ...q, stem: q.stem + ' Extra wording.' } : q);
assert.ok(auditCom004EnglishEditorialCandidateV4(changedApproved).issues.some(issue => issue.startsWith('APPROVED_COPY_CHANGED')));
const padding = COM004_ENGLISH_EDITORIAL_CANDIDATE_V4.map((q, i) => i === 0 ? { ...q, explanation: q.explanation + ' The other options are not Internet services.' } : q);
assert.ok(auditCom004EnglishEditorialCandidateV4(padding).issues.some(issue => issue.startsWith('EXPLANATION_COMMENTARY')));

const rendered = renderCom004FullEnglishReviewV4();
const reviewPath = ['artifacts/api-server/src/knowledge-v1/computer-awareness/', 'src/knowledge-v1/computer-awareness/'].map(p => p + COM004_ENGLISH_EDITORIAL_AUTHORITY_V4.reviewFile).find(existsSync);
assert.ok(reviewPath, 'Full chapter review file is required');
assert.equal(readFileSync(reviewPath, 'utf8'), rendered, 'Review must match the authored source exactly');
assert.equal((rendered.match(/^### Q\d+/gm) ?? []).length, 204);
assert.equal((rendered.match(/^\*\*Answer:\*\*/gm) ?? []).length, 204);
assert.equal((rendered.match(/^\*\*Explanation:\*\*/gm) ?? []).length, 204);
assert.equal((rendered.match(/^[A-D]\. /gm) ?? []).length, 816);
for (const value of Object.values(COM004_ENGLISH_EDITORIAL_AUTHORITY_V4.governance)) assert.equal(value, false);
// A review candidate must not silently replace the approved runtime corpus.
for (const ql of new Set(COM004_ENGLISH_CHAPTER_V3.map(q => q.qlId))) {
  const result = await knowledgeV1Com004QuestionStudioAdapterV1.generate({ packageId: 'COM-004', language: 'en', questionLanguageId: ql, count: 12, seed: 'v4-review-runtime-boundary' });
  for (const question of result.questions as any[]) {
    const old = COM004_ENGLISH_CHAPTER_V3.find(q => q.questionId === question.sourceQuestionId)!;
    assert.equal(question.stem, old.stem);
    assert.equal(question.explanation, old.explanation);
    assert.equal(question.sourceEnglishAuthorityId, 'COM-004-ENGLISH-FREEZE-V3');
  }
}
console.log('COM004 V4: all 170 remaining English explanations revised; 34 approved items preserved; 204-question review matches source; active runtime stays V3.');
