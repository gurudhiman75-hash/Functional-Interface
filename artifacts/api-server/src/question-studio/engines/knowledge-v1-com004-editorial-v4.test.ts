import assert from 'node:assert/strict';
import { COM004_ENGLISH_CHAPTER_V3 } from '../../knowledge-v1/computer-awareness/com004-editorial-corpus-v3';
import { COM004_ENGLISH_EDITORIAL_CANDIDATE_V4 } from '../../knowledge-v1/computer-awareness/com004-english-editorial-candidate-v4';
import { COM004_LOCALIZATION_CHAPTER_V3 } from '../../knowledge-v1/computer-awareness/com004-editorial-corpus-v3';
import { COM004_LOCALIZATION_CHAPTER_V4 } from '../../knowledge-v1/computer-awareness/com004-localization-editorial-candidate-v4';
import { COM004_LOCALIZATION_FREEZE_AUTHORITY_V4 } from '../../knowledge-v1/computer-awareness/com004-localization-freeze-v4';

assert.equal(COM004_ENGLISH_EDITORIAL_CANDIDATE_V4.length, 204);
assert.equal(COM004_LOCALIZATION_CHAPTER_V4.hi.length, 204);
assert.equal(COM004_LOCALIZATION_CHAPTER_V4.pa.length, 204);

const oldEnglish = new Map(COM004_ENGLISH_CHAPTER_V3.map(question => [question.questionId, question]));
for (const question of COM004_ENGLISH_EDITORIAL_CANDIDATE_V4) {
  const old = oldEnglish.get(question.questionId)!;
  assert.deepEqual(question.options, old.options);
  assert.equal(question.correctIndex, old.correctIndex);
  assert.equal(question.canonicalAnswer, old.canonicalAnswer);
  assert.equal(question.explanation.includes('Shortcut:'), false);
  assert.equal(question.explanation.includes('Trap warning:'), false);
  assert.equal(question.explanation.includes('exam level'), false);
}

for (const language of ['hi', 'pa'] as const) {
  const old = new Map(COM004_LOCALIZATION_CHAPTER_V3[language].map(question => [question.sourceQuestionId, question]));
  for (const question of COM004_LOCALIZATION_CHAPTER_V4[language]) {
    const historical = old.get(question.sourceQuestionId)!;
    assert.deepEqual(question.options, historical.options);
    assert.equal(question.correctIndex, historical.correctIndex);
    assert.equal(question.canonicalAnswer, historical.canonicalAnswer);
    assert.equal(question.sourceEnglishAuthorityId, 'COM-004-ENGLISH-FREEZE-V4');
    assert.doesNotMatch(`${question.stem} ${question.explanation}`, /Shortcut|Trap warning|अध्याय|chapter|ਅਧਿਆਇ|exam level/iu);
  }
}

const ids = new Set(COM004_ENGLISH_EDITORIAL_CANDIDATE_V4.map(question => question.questionId));
assert.equal(ids.size, 204);
assert.equal(new Set(COM004_LOCALIZATION_CHAPTER_V4.hi.map(question => question.sourceQuestionId)).size, 204);
assert.equal(new Set(COM004_LOCALIZATION_CHAPTER_V4.pa.map(question => question.sourceQuestionId)).size, 204);
assert.equal(COM004_LOCALIZATION_FREEZE_AUTHORITY_V4.governance.localizationFrozen, true);
assert.equal(COM004_LOCALIZATION_FREEZE_AUTHORITY_V4.governance.questionStudioRegistrationGateAuthorized, true);

console.log('COM004 V4 editorial: 204 English, Hindi, and Punjabi items checked; answer/options/provenance unchanged; padding rejected');
