import { strict as assert } from 'node:assert';
import { generateQuestionStudioQuestions, listQuestionStudioPackages } from '../engine-registry';
async function run() {
  const packages = listQuestionStudioPackages().filter(p => p.packageId.startsWith('WGE-001'));
  assert.equal(packages.length, 33);
  for (const pkg of packages) {
    for (const language of ['en','hi','pa'] as const) {
      const r = await generateQuestionStudioQuestions({packageId: pkg.packageId, language, count: 2, seed: 'route'});
      assert.equal(r.engineId, 'knowledge-v1');
      assert.ok(r.questions.every(q => q.language === language && q.packageId === pkg.packageId));
      if (pkg.cpIds.length === 1) assert.ok(r.questions.every(q => q.cpId === pkg.cpIds[0]));
    }
  }
  const topic = await generateQuestionStudioQuestions({engineId: 'knowledge-v1', topic: 'World Geography', count: 1});
  assert.equal(topic.questions[0]!.canonicalPackageId, 'WGE-001');
  const approved = await generateQuestionStudioQuestions({packageId:'WGE-001-CP019', language:'hi', count:1});
  assert.equal(approved.questions[0]!.authoringReviewApproved, true);
  assert.equal(approved.questions[0]!.localizationStatus, 'USER_APPROVED');
  const approvedNew = await generateQuestionStudioQuestions({packageId:'WGE-001-CP023', language:'pa', count:1});
  assert.equal(approvedNew.questions[0]!.authoringReviewApproved, true);
  assert.equal(approvedNew.questions[0]!.localizationStatus, 'USER_APPROVED');
  const pending = await generateQuestionStudioQuestions({packageId:'WGE-001-CP028', language:'hi', count:1});
  assert.equal(pending.questions[0]!.authoringReviewApproved, false);
  assert.equal(pending.questions[0]!.localizationStatus, 'REVIEW_REQUIRED');
  assert.equal(pending.questions[0]!.reviewOnly, true);
  for (const packageId of ['WGE-001-CP029','WGE-001-CP030','WGE-001-CP031','WGE-001-CP032']) {
    const pending = await generateQuestionStudioQuestions({packageId, language:'en', count:1});
    assert.equal(pending.questions[0]!.authoringReviewApproved, false);
    assert.equal(pending.questions[0]!.localizationStatus, 'REVIEW_REQUIRED');
  }
  await assert.rejects(() => generateQuestionStudioQuestions({engineId: 'knowledge-v1',packageId:'WGE-001-CP033'}), /Unknown WGE/);
  console.log('PASS: WGE standard registry discovery and generation, 33 packages × 3 languages');
}
void run();
