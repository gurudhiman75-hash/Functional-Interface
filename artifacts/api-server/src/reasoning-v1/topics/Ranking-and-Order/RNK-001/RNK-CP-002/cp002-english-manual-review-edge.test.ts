import assert from 'node:assert/strict';
import {
  generateEnglishReviewedRnkCp002AuthorityQuestion,
} from './cp002-english-reviewed-authority-runtime';
import { RNK_CP002_AUTHORITY_IDS } from './cp002-authority-runtime';

const SEEDS_PER_AUTHORITY = 320;
let checks = 0;

for (const authorityId of RNK_CP002_AUTHORITY_IDS) {
  for (let seed = 0; seed < SEEDS_PER_AUTHORITY; seed += 1) {
    const question = generateEnglishReviewedRnkCp002AuthorityQuestion(authorityId, seed);
    const learnerText = [
      question.stem,
      String(question.answer),
      ...question.options.flatMap((item) => [String(item.label), item.explanation]),
      question.explanation.keyRule,
      ...question.explanation.stepByStepSolution,
      question.explanation.examSpeedShortcut,
      ...question.explanation.optionAnalysis,
      question.explanation.conclusion,
    ].join(' ');

    assert.ok(!/\bthe the\b/i.test(learnerText), `${authorityId}:${seed}`);
    assert.ok(
      !/\b(?:with no|there are no) (?:people|candidates) between them\b/i.test(learnerText),
      `${authorityId}:${seed}`,
    );
    assert.ok(!/\b(?:top|bottom|front|back) end\b/i.test(learnerText), `${authorityId}:${seed}`);
    assert.ok(!/\b(?:start|end) end\b/i.test(learnerText), `${authorityId}:${seed}`);
    assert.ok(!/\b(?:the )?(?:first|second) person\b/i.test(learnerText), `${authorityId}:${seed}`);
    checks += 1;
  }
}

assert.equal(checks, RNK_CP002_AUTHORITY_IDS.length * SEEDS_PER_AUTHORITY);
console.log(JSON.stringify({
  packageId: 'RNK-001',
  checkpointId: 'RNK-CP-002',
  checks,
  conclusion: 'PASS_CP002_FINAL_MANUAL_REVIEW_EDGE_WORDING',
}, null, 2));
