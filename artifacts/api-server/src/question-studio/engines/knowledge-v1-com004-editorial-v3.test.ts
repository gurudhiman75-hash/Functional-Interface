import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { COM004_EDITORIAL_APPROVAL_V3, COM004_ENGLISH_CHAPTER_V3, COM004_LOCALIZATION_CHAPTER_V3, auditCom004EditorialCorpusV3 } from '../../knowledge-v1/computer-awareness/com004-editorial-corpus-v3';
import { COM004_EDITORIAL_COPY_V3 } from '../../knowledge-v1/computer-awareness/com004-editorial-copy-v3';
import { COM004_ENGLISH_CHAPTER_V2 } from '../../knowledge-v1/computer-awareness/com004-english-chapter-v2';
import { COM004_LOCALIZATION_CHAPTER_V1 } from '../../knowledge-v1/computer-awareness/com004-localization-chapter-v1';
import { knowledgeV1Com004QuestionStudioAdapterV1 as adapter } from './knowledge-v1-com004-adapter-v1';

const reviewPath = ['artifacts/api-server/src/knowledge-v1/computer-awareness/', 'src/knowledge-v1/computer-awareness/'].map(p => p + COM004_EDITORIAL_APPROVAL_V3.reviewFile).find(existsSync);
assert.ok(reviewPath, 'Approved review fixture must exist');
const bytes = readFileSync(reviewPath);
assert.equal(createHash('sha256').update(bytes).digest('hex'), COM004_EDITORIAL_APPROVAL_V3.reviewFileSha256);
const review = bytes.toString('utf8');
for (const row of COM004_EDITORIAL_COPY_V3) {
  const block = review.split(/^## Q\d+\n/m).find(b => b.includes(`Reference: ${row.sourceQuestionId}*`));
  assert.ok(block);
  assert.equal(row.en.stem, block.split('**Question:** ')[1].split('\n\nA.')[0]);
  assert.equal(row.en.explanation, block.split('**Explanation:** ')[1].split('\n\n*Reference:')[0]);
}
assert.equal(auditCom004EditorialCorpusV3().valid, true);
assert.equal(COM004_EDITORIAL_APPROVAL_V3.scopeIncludesRemaining170Items, false);
const revisedIds = new Set(COM004_EDITORIAL_APPROVAL_V3.revisedSourceQuestionIds);
assert.equal(revisedIds.size, 34);
let generated = 0;
for (const language of ['en', 'hi', 'pa'] as const) {
  const corpus = language === 'en' ? COM004_ENGLISH_CHAPTER_V3 : COM004_LOCALIZATION_CHAPTER_V3[language];
  const before = language === 'en' ? COM004_ENGLISH_CHAPTER_V2 : COM004_LOCALIZATION_CHAPTER_V1[language];
  for (const [i, q] of corpus.entries()) {
    assert.ok(Object.isFrozen(q));
    assert.ok(Object.isFrozen(q.options));
    assert.deepEqual(q.options, before[i].options);
    assert.equal(q.correctIndex, before[i].correctIndex);
    assert.equal(q.canonicalAnswer, before[i].canonicalAnswer);
  }
  for (const ql of new Set(corpus.map(q => q.qlId))) {
    const result = await adapter.generate({ packageId: 'COM-004', language, questionLanguageId: ql, count: 12, seed: 'approved-v3-check' });
    const expected = corpus.filter(q => q.qlId === ql);
    assert.equal(result.questions.length, expected.length);
    for (const q of result.questions as any[]) {
      const sourceIndex = COM004_ENGLISH_CHAPTER_V3.findIndex(s => s.questionId === q.sourceQuestionId);
      const source = corpus[sourceIndex];
      assert.equal(q.stem, source.stem);
      assert.equal(q.explanation, source.explanation);
      assert.equal(q.text, source.stem);
      assert.equal(q.sourceEnglishAuthorityId, 'COM-004-ENGLISH-FREEZE-V3');
      assert.equal(q.questionStudioReview.localizationFreezeAuthorityId, 'COM-004-LOCALIZATION-FREEZE-V3');
      assert.equal(q.questionBankAcceptanceAuthority, 'COM-004-QUESTION-STUDIO-BANK-ONLY-ACTIVATION-V2');
      assert.equal(q.testEligible, false);
      assert.equal(q.mockTestEligible, false);
      if (revisedIds.has(q.sourceQuestionId)) {
        assert.equal(q.shortcut, undefined);
        assert.equal(q.trapWarning, undefined);
        assert.doesNotMatch(q.explanation, /Shortcut:|Trap warning:|computer-awareness question/i);
      } else {
        assert.equal(q.stem, before[sourceIndex].stem);
        assert.equal(q.explanation, before[sourceIndex].explanation);
      }
      generated++;
    }
  }
}
assert.equal(generated, 612);
console.log('COM004 V3: approved copy exact; 612 runtime records checked; answer/options unchanged; 34 revisions per language');
