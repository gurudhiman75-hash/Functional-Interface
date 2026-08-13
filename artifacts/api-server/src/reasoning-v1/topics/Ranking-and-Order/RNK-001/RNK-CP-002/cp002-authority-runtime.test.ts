import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  generateRnkCp002AuthorityQuestion,
  listRnkCp002AuthorityVariants,
  RNK_CP002_AUTHORITY_IDS,
} from './cp002-authority-runtime';

const SEEDS_PER_AUTHORITY = 320;
const reviewQuestions: unknown[] = [];
const audits: unknown[] = [];
let deterministicChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let hygieneChecks = 0;

for (const authorityId of RNK_CP002_AUTHORITY_IDS) {
  const contexts = new Set<string>();
  const variants = new Set<string>();
  const difficulties = new Set<string>();
  const answerSemantics = new Set<string>();
  const correctPositions = [0, 0, 0, 0];
  const stems = new Set<string>();
  const fingerprints = new Set<string>();

  for (let seed = 0; seed < SEEDS_PER_AUTHORITY; seed += 1) {
    const question = generateRnkCp002AuthorityQuestion(authorityId, seed);
    assert.deepEqual(generateRnkCp002AuthorityQuestion(authorityId, seed), question);
    deterministicChecks += 1;

    assert.equal(question.authorityId, authorityId);
    assert.equal(question.authorityReviewStatus, 'ENGLISH_REVIEW_CANDIDATE');
    assert.equal(question.permanentQlId, null);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((item) => String(item.value))).size, 4);
    assert.equal(String(question.options[question.correctIndex].value), String(question.answer));
    assert.equal(question.options.filter((item) => String(item.value) === String(question.answer)).length, 1);
    correctPositions[question.correctIndex] += 1;
    optionChecks += 1;

    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.questionBankStatus, 'NOT_STORED');
    assert.equal(question.lifecycle.testEligibility, 'INELIGIBLE');
    assert.equal(question.lifecycle.publiclyPublishable, false);
    lifecycleChecks += 1;

    const learnerText = [
      question.stem,
      question.explanation.keyRule,
      ...question.explanation.stepByStepSolution,
      question.explanation.examSpeedShortcut,
      ...question.explanation.optionAnalysis,
      question.explanation.conclusion,
    ].join(' ');
    assert.ok(!/\b(?:RNK-CP|RNK-QL|PROT-|AUTH-|misconceptionId)\b/i.test(learnerText));
    assert.ok(!/\[(?:CORRECT|[A-Z_]{3,})\]/.test(learnerText));
    assert.ok(!/\bThere are one\b/i.test(learnerText));
    assert.ok(!/\b1 (?:people|candidates|positions)\b/i.test(learnerText));
    assert.ok(!/\b0 (?:people|candidates)\b/i.test(learnerText));
    assert.ok(!/undefined|null|NaN/.test(learnerText));
    hygieneChecks += 1;

    contexts.add(question.contextId);
    variants.add(question.sourcePrototypeId);
    difficulties.add(question.difficulty);
    answerSemantics.add(question.answerSemantic);
    stems.add(question.stem);
    fingerprints.add(question.mathematicalFingerprint);

    if (seed < 6) {
      reviewQuestions.push({
        authorityId,
        sourcePrototypeId: question.sourcePrototypeId,
        seed,
        contextId: question.contextId,
        difficulty: question.difficulty,
        answerSemantic: question.answerSemantic,
        stem: question.stem,
        options: question.options.map((item, index) => ({
          index,
          label: item.label,
          value: item.value,
          isCorrect: index === question.correctIndex,
          misconceptionId: item.misconceptionId,
          explanation: item.explanation,
        })),
        answer: question.answer,
        explanation: question.explanation,
        mathematicalFingerprint: question.mathematicalFingerprint,
      });
    }
  }

  assert.deepEqual([...contexts].sort(), ['HORIZONTAL_ROW', 'MERIT_LIST', 'QUEUE']);
  assert.deepEqual([...variants].sort(), [...listRnkCp002AuthorityVariants(authorityId)].sort());
  assert.ok(correctPositions.every((count) => count > 0));
  assert.ok(stems.size >= 180);
  assert.ok(fingerprints.size >= 80);

  audits.push({
    authorityId,
    generated: SEEDS_PER_AUTHORITY,
    variants: [...variants].sort(),
    contexts: [...contexts].sort(),
    difficulties: [...difficulties].sort(),
    answerSemantics: [...answerSemantics].sort(),
    correctPositions,
    uniqueStems: stems.size,
    uniqueFingerprints: fingerprints.size,
  });
}

assert.equal(reviewQuestions.length, 48);
const summary = {
  packageId: 'RNK-001',
  checkpointId: 'RNK-CP-002',
  authorityCount: RNK_CP002_AUTHORITY_IDS.length,
  seedsPerAuthority: SEEDS_PER_AUTHORITY,
  totalAuthorityQuestions: RNK_CP002_AUTHORITY_IDS.length * SEEDS_PER_AUTHORITY,
  reviewQuestionCount: reviewQuestions.length,
  deterministicChecks,
  optionChecks,
  lifecycleChecks,
  hygieneChecks,
  audits,
  permanentQlCount: 0,
  conclusion: 'PASS_CP002_AUTHORITY_ENGLISH_REVIEW_RUNTIME',
};

const outputDirectory = process.argv[2];
if (outputDirectory) {
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(join(outputDirectory, 'cp002-authority-runtime-audit.json'), `${JSON.stringify(summary, null, 2)}\n`);
  writeFileSync(join(outputDirectory, 'cp002-authority-review.json'), `${JSON.stringify(reviewQuestions, null, 2)}\n`);
}
console.log(JSON.stringify(summary, null, 2));
