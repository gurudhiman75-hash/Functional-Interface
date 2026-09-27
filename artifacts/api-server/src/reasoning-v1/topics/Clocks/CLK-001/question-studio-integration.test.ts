import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  CLK_001_PERMANENT_CONTRACTS,
  CLK_001_PERMANENT_QL_IDS,
} from './permanent-contracts';
import {
  CLK_001_QUESTION_STUDIO_PACKAGE,
  generateClk001QuestionStudioBatch,
} from './question-studio-integration';
import { reasoningV1QuestionStudioAdapter } from '../../../../question-studio/engines/reasoning-v1-adapter';

test('CLK-001 freezes exactly 23 permanent semantic authorities', () => {
  assert.equal(CLK_001_PERMANENT_QL_IDS.length, 23);
  assert.equal(new Set(CLK_001_PERMANENT_QL_IDS).size, 23);
  assert.equal(new Set(CLK_001_PERMANENT_CONTRACTS.map((entry) => entry.cluster)).size, 23);
  assert.equal(CLK_001_QUESTION_STUDIO_PACKAGE.enabled, true);
});

test('CLK-001 generates all permanent QLs in English Hindi and Punjabi with parity', async () => {
  for (const contract of CLK_001_PERMANENT_CONTRACTS) {
    const byLanguage = [];
    for (const language of ['en', 'hi', 'pa'] as const) {
      const result = await generateClk001QuestionStudioBatch({
        packageId: 'CLK-001',
        canonicalProblemId: contract.qlId,
        language,
        count: 1,
        seed: 'clk-parity-' + contract.qlId,
      });
      assert.equal(result.questions.length, 1);
      const question = result.questions[0]!;
      assert.equal(question.qlId, contract.qlId);
      assert.equal((question.options as unknown[]).length, 4);
      assert.equal(new Set(question.options as string[]).size, 4);
      assert.equal(question.validation && (question.validation as any).solverAgreement, true);
      const stem = String(question.stem ?? '');
      assert.equal(/Solve this clock question about|[A-Z]{3,}_[A-Z_]+/.test(stem), false);
      if (language === 'hi') assert.match(stem, /[\u0900-\u097F]/u);
      if (language === 'pa') assert.match(stem, /[\u0A00-\u0A7F]/u);
      byLanguage.push(question);
    }
    assert.equal(byLanguage[0]!.correctIndex, byLanguage[1]!.correctIndex);
    assert.equal(byLanguage[0]!.correctIndex, byLanguage[2]!.correctIndex);
    assert.equal(
      (byLanguage[0]!.traceability as any).semanticFingerprint,
      (byLanguage[1]!.traceability as any).semanticFingerprint,
    );
    assert.equal(
      (byLanguage[0]!.traceability as any).semanticFingerprint,
      (byLanguage[2]!.traceability as any).semanticFingerprint,
    );
  }
});

test('CLK-001 mixed batch can expose all 23 permanent QLs', async () => {
  const result = await generateClk001QuestionStudioBatch({
    packageId: 'CLK-001',
    language: 'en',
    count: 23,
    seed: 'clk-all-qls',
    difficulty: 'Mixed',
  });
  assert.equal(new Set(result.questions.map((question) => question.qlId)).size, 23);
});


test('reasoning-v1 adapter exposes and routes CLK-001', async () => {
  const pkg = reasoningV1QuestionStudioAdapter
    .listPackages()
    .find((candidate) => candidate.packageId === 'CLK-001');
  assert.ok(pkg);
  assert.equal(pkg?.engineId, 'reasoning-v1');
  assert.equal(pkg?.cpIds.length, 23);
  assert.deepEqual(pkg?.supportedLanguages, ['en', 'hi', 'pa']);

  const generated = await reasoningV1QuestionStudioAdapter.generate({
    engineId: 'reasoning-v1',
    packageId: 'CLK-001',
    canonicalProblemId: 'CLK-QL-001',
    language: 'pa',
    count: 1,
    seed: 'clk-adapter-route',
  });
  assert.equal(generated.questions.length, 1);
  assert.equal(generated.questions[0]?.packageId, 'CLK-001');
  assert.equal(generated.questions[0]?.qlId, 'CLK-QL-001');
});
