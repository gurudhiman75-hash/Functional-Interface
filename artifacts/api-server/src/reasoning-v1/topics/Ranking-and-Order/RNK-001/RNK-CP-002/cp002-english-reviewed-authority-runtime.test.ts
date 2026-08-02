import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  generateRnkCp002AuthorityQuestion,
  RNK_CP002_AUTHORITY_IDS,
} from './cp002-authority-runtime';
import {
  generateEnglishReviewedRnkCp002AuthorityQuestion,
} from './cp002-english-reviewed-authority-runtime';

const SEEDS_PER_AUTHORITY = 320;
const reviewQuestions: unknown[] = [];
let deterministicChecks = 0;
let structuralPreservationChecks = 0;
let learnerHygieneChecks = 0;
let contextualAnswerChecks = 0;

for (const authorityId of RNK_CP002_AUTHORITY_IDS) {
  const requestedEndPhrases = new Set<string>();
  const contextualAnswers = new Set<string>();

  for (let seed = 0; seed < SEEDS_PER_AUTHORITY; seed += 1) {
    const raw = generateRnkCp002AuthorityQuestion(authorityId, seed);
    const reviewed = generateEnglishReviewedRnkCp002AuthorityQuestion(authorityId, seed);
    assert.deepEqual(
      generateEnglishReviewedRnkCp002AuthorityQuestion(authorityId, seed),
      reviewed,
    );
    deterministicChecks += 1;

    assert.deepEqual(reviewed.displayedEvidence, raw.displayedEvidence);
    assert.deepEqual(reviewed.normalizedState, raw.normalizedState);
    assert.equal(reviewed.correctIndex, raw.correctIndex);
    assert.equal(reviewed.difficulty, raw.difficulty);
    assert.equal(reviewed.mathematicalFingerprint, raw.mathematicalFingerprint);
    assert.deepEqual(reviewed.lifecycle, raw.lifecycle);
    assert.equal(reviewed.reviewMetadata.canonicalAnswer, raw.answer);
    assert.deepEqual(
      reviewed.reviewMetadata.canonicalOptionValues,
      raw.options.map((item) => item.value),
    );
    assert.equal(reviewed.reviewMetadata.canonicalAuthorityId, authorityId);
    assert.equal(reviewed.reviewMetadata.sourcePrototypeId, raw.sourcePrototypeId);
    assert.equal(reviewed.reviewMetadata.reviewLayer, 'CP002_ENGLISH_REVIEW_V1');
    structuralPreservationChecks += 1;

    assert.equal(reviewed.options.length, 4);
    assert.equal(new Set(reviewed.options.map((item) => String(item.value))).size, 4);
    assert.equal(
      String(reviewed.options[reviewed.correctIndex].value),
      String(reviewed.answer),
    );
    assert.equal(
      reviewed.options.filter((item) => String(item.value) === String(reviewed.answer)).length,
      1,
    );

    const learnerText = [
      reviewed.stem,
      String(reviewed.answer),
      ...reviewed.options.flatMap((item) => [String(item.label), item.explanation]),
      reviewed.explanation.keyRule,
      ...reviewed.explanation.stepByStepSolution,
      reviewed.explanation.examSpeedShortcut,
      ...reviewed.explanation.optionAnalysis,
      reviewed.explanation.conclusion,
    ].join(' ');

    assert.ok(!/\bstart end\b/i.test(learnerText), `${authorityId}:${seed}`);
    assert.ok(!/\bend end\b/i.test(learnerText), `${authorityId}:${seed}`);
    assert.ok(!/\b(?:top|bottom|front|back) end\b/i.test(learnerText), `${authorityId}:${seed}`);
    assert.ok(!/\b(?:the )?first person\b/i.test(learnerText), `${authorityId}:${seed}`);
    assert.ok(!/\b(?:the )?second person\b/i.test(learnerText), `${authorityId}:${seed}`);
    assert.ok(!/\bThere are one\b/i.test(learnerText), `${authorityId}:${seed}`);
    assert.ok(!/\b1 (?:people|candidates|positions)\b/i.test(learnerText), `${authorityId}:${seed}`);
    assert.ok(!/\b0 (?:people|candidates)\b/i.test(learnerText), `${authorityId}:${seed}`);
    assert.ok(!/\b(?:RNK-CP|RNK-QL|PROT-|AUTH-)\b/.test(learnerText));
    assert.ok(!/undefined|null|NaN/.test(learnerText));
    assert.ok(!/^Therefore, the required (?:answer|count)/.test(reviewed.explanation.conclusion));
    learnerHygieneChecks += 1;

    if (authorityId === 'RNK-CP002-AUTH-04-COMPARE-NORMALIZED-POSITIONS') {
      const match = reviewed.stem.match(
        /Who is nearer (the top|the bottom|the left end|the right end|the front|the back)\?$/,
      );
      assert.ok(match, `${authorityId}:${seed} lacks a contextual requested side`);
      requestedEndPhrases.add(match![1]);
      assert.equal(
        reviewed.explanation.conclusion,
        `${reviewed.answer} is nearer ${match![1]}.`,
      );
      contextualAnswerChecks += 1;
    }

    if (authorityId === 'RNK-CP002-AUTH-08-PROPOSED-TOTAL-ORDER-STATUS') {
      const startPhrase = reviewed.contextId === 'MERIT_LIST'
        ? 'the top'
        : reviewed.contextId === 'HORIZONTAL_ROW'
          ? 'the left end'
          : 'the front';
      const answerText = String(reviewed.answer);
      assert.ok(
        answerText === 'The proposed total is impossible' ||
        answerText === `${reviewed.firstName} is nearer ${startPhrase}` ||
        answerText === `${reviewed.secondName} is nearer ${startPhrase}`,
        `${authorityId}:${seed} has a non-contextual answer`,
      );
      contextualAnswers.add(answerText === 'The proposed total is impossible'
        ? answerText
        : answerText.startsWith(reviewed.firstName) ? 'FIRST_NAMED' : 'SECOND_NAMED');
      contextualAnswerChecks += 1;
    }

    if (seed < 6) {
      reviewQuestions.push({
        authorityId,
        sourcePrototypeId: reviewed.sourcePrototypeId,
        seed,
        contextId: reviewed.contextId,
        difficulty: reviewed.difficulty,
        answerSemantic: reviewed.answerSemantic,
        firstName: reviewed.firstName,
        secondName: reviewed.secondName,
        stem: reviewed.stem,
        options: reviewed.options.map((item, index) => ({
          index,
          label: item.label,
          value: item.value,
          isCorrect: index === reviewed.correctIndex,
          misconceptionId: item.misconceptionId,
          explanation: item.explanation,
        })),
        answer: reviewed.answer,
        explanation: reviewed.explanation,
        mathematicalFingerprint: reviewed.mathematicalFingerprint,
        reviewMetadata: reviewed.reviewMetadata,
      });
    }
  }

  if (authorityId === 'RNK-CP002-AUTH-04-COMPARE-NORMALIZED-POSITIONS') {
    assert.ok(requestedEndPhrases.size >= 5);
  }
  if (authorityId === 'RNK-CP002-AUTH-08-PROPOSED-TOTAL-ORDER-STATUS') {
    assert.deepEqual([...contextualAnswers].sort(), [
      'FIRST_NAMED',
      'SECOND_NAMED',
      'The proposed total is impossible',
    ].sort());
  }
}

assert.equal(reviewQuestions.length, 48);
const summary = {
  packageId: 'RNK-001',
  checkpointId: 'RNK-CP-002',
  authorityCount: RNK_CP002_AUTHORITY_IDS.length,
  seedsPerAuthority: SEEDS_PER_AUTHORITY,
  totalReviewedQuestions: RNK_CP002_AUTHORITY_IDS.length * SEEDS_PER_AUTHORITY,
  reviewPackCount: reviewQuestions.length,
  deterministicChecks,
  structuralPreservationChecks,
  learnerHygieneChecks,
  contextualAnswerChecks,
  conclusion: 'PASS_CP002_ENGLISH_REVIEWED_AUTHORITY_RUNTIME',
};

const outputDirectory = process.argv[2];
if (outputDirectory) {
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(join(outputDirectory, 'cp002-english-reviewed-authority-audit.json'), `${JSON.stringify(summary, null, 2)}\n`);
  writeFileSync(join(outputDirectory, 'cp002-english-reviewed-authority-review.json'), `${JSON.stringify(reviewQuestions, null, 2)}\n`);
}
console.log(JSON.stringify(summary, null, 2));
