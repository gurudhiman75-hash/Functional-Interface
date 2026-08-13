import assert from 'node:assert/strict';
import {
  generateRnkCp001EnglishReviewedAuthorityQuestion,
} from './cp001-english-review-remediated-runtime';
import { RNK_CP001_PROVISIONAL_AUTHORITY_IDS } from './cp001-provisional-consolidation';

const SEEDS_PER_AUTHORITY = 320;
let reviewedQuestions = 0;
let zeroAfterEdges = 0;
let oneAfterEdges = 0;

for (const authorityId of RNK_CP001_PROVISIONAL_AUTHORITY_IDS) {
  for (let seed = 0; seed < SEEDS_PER_AUTHORITY; seed += 1) {
    const reviewed = generateRnkCp001EnglishReviewedAuthorityQuestion(authorityId, seed);
    const question = reviewed.question;
    const learnerText = [
      question.stem,
      question.explanation.keyRule,
      ...question.explanation.stepByStepSolution,
      question.explanation.examSpeedShortcut,
      ...question.explanation.optionAnalysis,
      question.explanation.conclusion,
    ].join('\n');

    assert.ok(!/\bone (?:candidate|person) are\b/i.test(learnerText));
    assert.ok(!/\bWith no positions after\b/i.test(learnerText));
    assert.ok(!/\bAfter removing the one position after\b/i.test(learnerText));

    const evidence = question.displayedEvidence;
    if (evidence.kind === 'RANK_FROM_COUNT_AFTER_AND_TOTAL' && evidence.afterCount <= 1) {
      assert.ok(question.explanation.keyRule.includes(question.targetName));
      assert.ok(question.explanation.keyRule.includes(String(evidence.total)));
      assert.ok(question.explanation.keyRule.includes(String(question.answer)));
      assert.ok(
        /No (?:candidate|one) is |One (?:candidate|person) is /.test(
          question.explanation.keyRule,
        ),
      );
      if (evidence.afterCount === 0) zeroAfterEdges += 1;
      if (evidence.afterCount === 1) oneAfterEdges += 1;
    }

    reviewedQuestions += 1;
  }
}

assert.equal(reviewedQuestions, 2_880);
assert.ok(zeroAfterEdges > 0);
assert.ok(oneAfterEdges > 0);

console.log(
  JSON.stringify(
    {
      packageId: 'RNK-001',
      checkpointId: 'RNK-CP-001',
      reviewedQuestions,
      zeroAfterEdges,
      oneAfterEdges,
      writtenAgreementLeaks: 0,
      mechanicalZeroOneEdgePhrases: 0,
      conclusion: 'PASS_ENGLISH_MANUAL_REVIEW_EDGE_PHRASING',
    },
    null,
    2,
  ),
);
