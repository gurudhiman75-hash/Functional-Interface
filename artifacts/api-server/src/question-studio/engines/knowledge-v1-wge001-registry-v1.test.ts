import { strict as assert } from 'node:assert';
import { generateQuestionStudioQuestions, listQuestionStudioPackages } from '../engine-registry';
async function run() {
  const packages = listQuestionStudioPackages().filter(p => p.packageId.startsWith('WGE-001'));
  assert.equal(packages.length, 44);
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
  const approvedNew = await generateQuestionStudioQuestions({packageId:'WGE-001-CP029', language:'pa', count:1});
  assert.equal(approvedNew.questions[0]!.authoringReviewApproved, true);
  assert.equal(approvedNew.questions[0]!.localizationStatus, 'USER_APPROVED');

  for (const packageId of ['WGE-001-CP032','WGE-001-CP033','WGE-001-CP034','WGE-001-CP035','WGE-001-CP036','WGE-001-CP037','WGE-001-CP038','WGE-001-CP039','WGE-001-CP040','WGE-001-CP041','WGE-001-CP042','WGE-001-CP043']) {
    const pkg = packages.find(p => p.packageId === packageId)!;
    assert.equal(pkg.metadata.authoringReviewApproved, false);
    assert.equal(pkg.metadata.localizationStatus, 'REVIEW_REQUIRED');
  }
  for (const packageId of ['WGE-001-CP032','WGE-001-CP033','WGE-001-CP034','WGE-001-CP035','WGE-001-CP036','WGE-001-CP037','WGE-001-CP038','WGE-001-CP039','WGE-001-CP040','WGE-001-CP043']) {
    const pkg = packages.find(p => p.packageId === packageId)!;
    assert.equal(pkg.metadata.variablePoolStatus, 'REVIEW_REQUIRED');
  }
  const revised041 = await generateQuestionStudioQuestions({canonicalProblemId:'WGE-001-CP041-Q001', language:'en', count:1});
  assert.equal(revised041.questions[0]!.authoringReviewApproved, false);
  assert.equal(revised041.questions[0]!.localizationStatus, 'REVIEW_REQUIRED');
  const revised042 = await generateQuestionStudioQuestions({canonicalProblemId:'WGE-001-CP042-Q002', language:'pa', count:1});
  assert.equal(revised042.questions[0]!.authoringReviewApproved, false);
  assert.equal(revised042.questions[0]!.localizationStatus, 'REVIEW_REQUIRED');
  await assert.rejects(() => generateQuestionStudioQuestions({engineId: 'knowledge-v1',packageId:'WGE-001-CP044'}), /Unknown WGE/);
  console.log('PASS: WGE standard registry discovery and generation, 44 packages × 3 languages');
}
void run();
