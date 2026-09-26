import { strict as assert } from 'node:assert';
import { WGE_CORPUS, WGE_CP_TITLES, validateWorldGeographyCorpus } from '../../knowledge-v1/world-geography/corpus';
import { knowledgeV1Wge001QuestionStudioAdapterV1 as adapter, isWge001QuestionStudioRequestV1 as owns } from './knowledge-v1-wge001-adapter-v1';

async function run() {
  const cpIds = Object.keys(WGE_CP_TITLES);
  assert.equal(WGE_CORPUS.length, 201);
  assert.equal(adapter.listPackages().length, 9);
  assert.equal(new Set(adapter.listPackages().map(p => p.packageId)).size, 9);
  for (const p of adapter.listPackages()) {
    assert.equal(p.lifecycleStage, 'REVIEW_ONLY'); assert.equal(p.questionBankWritable, false);
    assert.equal(p.productionReleaseAuthorized, false); assert.deepEqual(p.supportedLanguages, ['en', 'hi', 'pa']);
  }
  let checked = 0;
  for (const cp of cpIds) {
    for (const difficulty of ['Mixed', 'Easy', 'Medium', 'Hard']) {
      const expected = WGE_CORPUS.filter(q => q.cpId === cp && (difficulty === 'Mixed' || q.difficulty === difficulty));
      const en = await adapter.generate({packageId: 'WGE-001', canonicalProblemId: cp, difficulty, count: expected.length, seed: 'audit'});
      for (const language of ['en', 'hi', 'pa'] as const) {
        const result = await adapter.generate({packageId: cp, language, difficulty, count: expected.length, seed: 'audit'});
        assert.deepEqual(result.questions.map(q => q.sourceQuestionId), en.questions.map(q => q.sourceQuestionId));
        assert.deepEqual(result.questions.map(q => q.correctIndex), en.questions.map(q => q.correctIndex));
        assert.equal(new Set(result.questions.map(q => q.sourceQuestionId)).size, expected.length);
        for (const q of result.questions) {
          const canonical = WGE_CORPUS.find(row => row.id === q.sourceQuestionId)!;
          assert.equal(q.cpId, cp); assert.equal(q.language, language);
          const options = q.options as string[];
          assert.equal(options.length, 4); assert.equal(new Set(options).size, 4);
          assert.equal(options[q.correctIndex as number], canonical.locales[language].options[canonical.correctIndex]);
          assert.equal(q.explanation, canonical.locales[language].explanation);
          assert.equal(q.authoringReviewApproved, true); assert.equal(q.questionBankWritable, false);
          assert.equal(q.testEligible, false); assert.equal(q.productionReleased, false);
          checked++;
        }
      }
    }
  }
  const req = {packageId: 'WGE-001', count: 50, seed: 'mixed-coverage'};
  const first = await adapter.generate(req);
  assert.deepEqual(first, await adapter.generate(req));
  assert.equal(new Set(first.questions.map(q => q.cpId)).size, 8);
  assert.notDeepEqual(first.questions.map(q => q.sourceQuestionId), (await adapter.generate({...req, seed: 'other'})).questions.map(q => q.sourceQuestionId));
  // Mutating a returned payload must not change the immutable owning library.
  (first.questions[0]!.options as string[])[0] = 'tampered';
  assert.ok(!(await adapter.generate(req)).questions.some(q => (q.options as string[]).includes('tampered')));
  for (const bad of [0, -1, 1.5, NaN, 51]) await assert.rejects(() => adapter.generate({count: bad}), /integer/);
  await assert.rejects(() => adapter.generate({language: 'fr' as never}), /language/);
  await assert.rejects(() => adapter.generate({difficulty: 'Impossible'}), /difficulty/);
  await assert.rejects(() => adapter.generate({runtimeMode: 'bank-only'}), /review-only/);
  await assert.rejects(() => adapter.generate({packageId: 'WGE-001-CP009'}), /Unknown/);
  await assert.rejects(() => adapter.generate({canonicalProblemId: 'WGE-001-CP999'}), /Unknown/);
  await assert.rejects(() => adapter.generate({packageId: 'WGE-001-CP001', canonicalProblemId: 'WGE-001-CP002'}), /Conflicting/);
  await assert.rejects(() => adapter.generate({patternId: 'WGE-001-CP001-Q001', questionLanguageId: 'WGE-001-CP001-Q002'}), /Conflicting/);
  await assert.rejects(() => adapter.generate({packageId: 'WGE-001-CP001', subtopic: 'Plate Tectonics'}), /Conflicting/);
  await assert.rejects(() => adapter.generate({subtopic: 'Unknown'}), /Unknown/);
  await assert.rejects(() => adapter.generate({canonicalProblemId: 'WGE-001-CP001-Q001', count: 2}), /without repeats/);
  for (const q of WGE_CORPUS) {
    const single = await adapter.generate({canonicalProblemId: q.id, count: 1});
    assert.equal(single.questions[0]!.sourceQuestionId, q.id);
  }
  // Independent numeric oracle for date/time questions, not option-position snapshots.
  const find = (objective: string) => WGE_CORPUS.find(q => q.objective === objective)!.locales.en.options[0];
  assert.equal(find('solar-east-calculation'), `${12 + 45 / 15}:00`);
  assert.equal(find('solar-west-calculation'), `${16 - (30 + 15) / 15}:00`);
  assert.equal(find('fractional-longitude'), `${7.5 * 4} minutes`);
  assert.equal(find('longitude-from-time'), `${(2 * 60 + 20) / 4}° E`);
  assert.equal(find('utc-date-rollover'), '04:15 on 11 June');
  assert.equal(find('utc-west-rollover'), '22:00 on 7 March');
  const clone = JSON.parse(JSON.stringify(WGE_CORPUS));
  clone[0].locales.hi.options[1] = clone[0].locales.hi.options[0];
  assert.throws(() => validateWorldGeographyCorpus(clone), /options/);
  assert.equal(owns({packageId: 'COM-001', topic: 'World Geography'}), false);
  assert.equal(owns({packageId: 'WGE-001-CP008'}), true);
  assert.equal(owns({topic: 'World Geography'}), true);
  console.log(`PASS: ${WGE_CORPUS.length} questions, ${checked} filtered localized outputs, 8 CPs, all selectors and invariants`);
}
void run();
