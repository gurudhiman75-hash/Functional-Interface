import assert from 'node:assert/strict';
import { generateMis001QuestionStudioBatch } from './question-studio-integration';
import { permanentQlForMisCandidate } from './MIS-PERMANENT-QL-REGISTRY';
import { MIS_CP001_CANDIDATE_IDS } from './MIS-CP-001/generator';
import { MIS_CP002_CANDIDATE_IDS } from './MIS-CP-002/generator';
import { MIS_CP003_CANDIDATE_IDS } from './MIS-CP-003/generator';
import { MIS_CP004_CANDIDATE_IDS } from './MIS-CP-004/generator';

const candidates = [
  ...MIS_CP001_CANDIDATE_IDS,
  ...MIS_CP002_CANDIDATE_IDS,
  ...MIS_CP003_CANDIDATE_IDS,
  ...MIS_CP004_CANDIDATE_IDS,
];

const localizedQlIds = new Set<string>();
const forbiddenEnglish = /Find the|same rule|Row\s|number|Multiply|Add the|Subtract|Divide|next number|previous number|next two numbers|Therefore|Now apply/i;

for (const candidateId of candidates) {
  const seed = 'mis-l10n-wave1:' + candidateId;
  const en = await generateMis001QuestionStudioBatch({
    packageId: 'MIS-001',
    patternId: candidateId,
    language: 'en',
    count: 1,
    seed,
  });
  const english = en.questions[0] as any;

  for (const language of ['hi','pa'] as const) {
    const localizedBatch = await generateMis001QuestionStudioBatch({
      packageId: 'MIS-001',
      patternId: candidateId,
      language,
      count: 1,
      seed,
    });
    const localized = localizedBatch.questions[0] as any;

    assert.equal(localized.answer, english.answer, candidateId + ' answer drift in ' + language);
    assert.equal(localized.correctIndex, english.correctIndex, candidateId + ' correct-index drift in ' + language);
    assert.deepEqual(localized.options, english.options, candidateId + ' option drift in ' + language);
    assert.equal(localized.structuralFingerprint, english.structuralFingerprint, candidateId + ' structure drift in ' + language);
    assert.equal(localized.numericFingerprint, english.numericFingerprint, candidateId + ' numeric drift in ' + language);
    assert.equal(localized.qlId, permanentQlForMisCandidate(candidateId), candidateId + ' QL mapping drift');
    assert.ok(localized.explanation.includes(String(localized.canonicalAnswer)), candidateId + ' localized explanation omits answer');
    assert.ok(!forbiddenEnglish.test(localized.stem), candidateId + ' localized stem leaked English prose: ' + localized.stem);
    assert.ok(!forbiddenEnglish.test(localized.explanation), candidateId + ' localized explanation leaked English prose: ' + localized.explanation);
    assert.equal(localized.locale, language === 'hi' ? 'hi-IN' : 'pa-IN');
    assert.equal(localized.localizationParity, 'WAVE1_LOCALIZED_REVIEW');

    if (localized.qlId) localizedQlIds.add(localized.qlId);
  }
}

assert.equal(candidates.length, 34);
assert.equal(localizedQlIds.size, 31);

await assert.rejects(
  () => generateMis001QuestionStudioBatch({
    packageId:'MIS-001',
    canonicalProblemId:'MIS-CP-005',
    language:'pa',
    count:1,
    seed:'mis-wave1-boundary',
  }),
  /CP001-CP004/,
);

console.log('MIS-001 localization wave 1 audit passed: 34 runtime patterns / 31 permanent QLs in Hindi and Punjabi.');
