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
import { CLOCK_CHECKPOINTS } from './runtime/catalog';

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
      const explanation = String(question.explanation ?? '');
      const visible = [
        stem,
        ...(question.options as string[]),
        explanation,
      ].join('\n');
      assert.equal(/Solve this clock question about|[A-Z]{3,}_[A-Z_]+/.test(stem), false);
      assert.doesNotMatch(
        visible,
        /\\b(?:associated|best describes|canonical|prototype|authority|fingerprint|source audit|review metadata|undefined|NaN)\\b/iu,
      );
      if (language === 'hi') {
        assert.match(stem, /[\u0900-\u097F]/u);
        assert.doesNotMatch(visible, /[\u0A00-\u0A7F]/u);
        assert.doesNotMatch(explanation, /दिए गए मानों को ध्यान से पढ़ें|उत्तर को स्वतंत्र गणना से भी मिलाया गया है/u);
        assert.doesNotMatch(visible.replace(/\\b(?:AM|PM)\\b/gu, ''), /[A-Za-z]{2,}/u);
      }
      if (language === 'pa') {
        assert.match(stem, /[\u0A00-\u0A7F]/u);
        assert.doesNotMatch(visible, /[\u0900-\u097F]/u);
        assert.doesNotMatch(explanation, /ਦਿੱਤੇ ਹੋਏ ਮਾਨ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ|ਉੱਤਰ ਨੂੰ ਵੱਖਰੀ ਗਣਨਾ ਨਾਲ ਵੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ/u);
        assert.doesNotMatch(visible.replace(/\\b(?:AM|PM)\\b/gu, ''), /[A-Za-z]{2,}/u);
      }
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
  assert.equal(pkg?.cpIds.length, 14);
  assert.deepEqual(pkg?.cpIds, CLOCK_CHECKPOINTS.map((checkpoint) => checkpoint.code));
  assert.deepEqual(pkg?.supportedLanguages, ['en', 'hi', 'pa']);
  assert.equal((pkg?.metadata as any)?.difficultyCalibrationStatus, 'GENERATED_INSTANCE_AUDITED_V1');

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


test('CLK-001 routes real checkpoint IDs and keeps CP014 explicitly non-authoring', async () => {
  const cp1 = await generateClk001QuestionStudioBatch({
    packageId: 'CLK-001',
    canonicalProblemId: 'CLK-CP-001',
    language: 'en',
    count: 4,
    seed: 'clk-wave01-cp001',
  });
  assert.equal(cp1.questions.length, 4);
  assert.ok(cp1.questions.every((question) => question.checkpointId === 'CLK-CP-001'));
  assert.ok(cp1.questions.every((question) => String(question.qlId).startsWith('CLK-QL-')));

  await assert.rejects(
    () => generateClk001QuestionStudioBatch({
      packageId: 'CLK-001',
      canonicalProblemId: 'CLK-CP-014',
      language: 'en',
      count: 1,
      seed: 'clk-wave01-cp014',
    }),
    /owns no permanent learner QL/u,
  );
});

test('CLK-001 uses generated-item difficulty and satisfies requested bands without relabelling', async () => {
  for (const difficulty of ['Easy', 'Medium', 'Hard'] as const) {
    const result = await generateClk001QuestionStudioBatch({
      packageId: 'CLK-001',
      language: 'en',
      difficulty,
      count: 3,
      seed: 'clk-wave01-difficulty-' + difficulty,
    });
    assert.equal(result.questions.length, 3);
    for (const question of result.questions) {
      assert.equal(question.difficulty, difficulty);
      assert.equal(question.difficultyLabel, difficulty);
      assert.equal(question.difficultyCalibrationStatus, 'GENERATED_INSTANCE_AUDITED_V1');
      assert.equal((question.validation as any).difficultyDerivedFromGeneratedItem, true);
      assert.equal((question.validation as any).requestedDifficultySatisfied, true);
      assert.equal(typeof question.difficultyScore, 'number');
      assert.ok(Array.isArray(question.difficultyFactors));
    }
  }
});

test('CLK-001 item-difficulty generation remains deterministic', async () => {
  const request = {
    packageId: 'CLK-001',
    language: 'pa' as const,
    difficulty: 'Medium',
    count: 3,
    seed: 'clk-wave01-deterministic-medium',
  };
  const left = await generateClk001QuestionStudioBatch(request);
  const right = await generateClk001QuestionStudioBatch(request);
  assert.deepEqual(right, left);
});


test('CLK-001 banking profile delivers five options without moving the canonical answer', async () => {
  for (const language of ['en', 'hi', 'pa'] as const) {
    const result = await generateClk001QuestionStudioBatch({
      packageId: 'CLK-001',
      canonicalProblemId: 'CLK-QL-003',
      language,
      exam: 'IBPS PO Prelims',
      count: 1,
      seed: 'clk-wave02-banking-' + language,
    });
    const question = result.questions[0]!;
    assert.equal((question.options as string[]).length, 5);
    assert.ok(Number(question.correctIndex) >= 0 && Number(question.correctIndex) < 4);
    assert.equal(question.optionCountProfileApplied, true);
    assert.equal(question.examProfile, 'BANKING');
    assert.equal(question.examProfileContentWeightingApplied, false);
    assert.equal((question.bankingFiveOptionDelivery as any)?.correctAnswerMoved, false);
    assert.equal((question.bankingFiveOptionDelivery as any)?.canonicalOptionsMutated, false);
    const expectedNone = language === 'hi'
      ? 'इनमें से कोई नहीं'
      : language === 'pa'
        ? 'ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ'
        : 'None of these';
    assert.equal((question.options as string[])[4], expectedNone);
  }
});

test('CLK-001 SSC and Punjab delivery keep the canonical four-option surface', async () => {
  for (const exam of ['SSC CGL Tier 1', 'PSSSB Clerk']) {
    const result = await generateClk001QuestionStudioBatch({
      packageId: 'CLK-001',
      canonicalProblemId: 'CLK-QL-003',
      language: 'en',
      exam,
      count: 1,
      seed: 'clk-wave02-profile-' + exam,
    });
    const question = result.questions[0]!;
    assert.equal((question.options as string[]).length, 4);
    assert.equal(question.optionCountProfileApplied, false);
    assert.equal(question.bankingFiveOptionDelivery, null);
  }
});
