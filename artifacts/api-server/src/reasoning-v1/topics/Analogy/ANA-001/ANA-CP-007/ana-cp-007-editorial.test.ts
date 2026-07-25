import assert from "node:assert/strict";
import { generateWordAnalogy } from "./generator";
import { ANA_CP007_QLS } from "./question-language.en";

const BANNED_STUDENT_PHRASES = [
  /rule parameter/i,
  /registered family/i,
  /apply context/i,
  /position vector/i,
  /solver/i,
  /ambiguity checker/i,
  /WORD_[A-Z_]+/,
  /ANA-CP-007/,
];

const REVIEW_SEEDS = [0, 3, 7, 11, 15, 19] as const;
const explanationSignatures = new Set<string>();

for (const ql of ANA_CP007_QLS) {
  for (const seed of REVIEW_SEEDS) {
    const question = generateWordAnalogy(ql.qlId, seed);
    const explanation = [
      question.explanation.ruleStatement,
      question.explanation.sourceDemonstration,
      question.explanation.targetApplication,
      question.explanation.conclusion,
      question.explanation.closestTrapRejection,
    ].join("\n");

    for (const banned of BANNED_STUDENT_PHRASES) {
      assert.equal(
        banned.test(explanation),
        false,
        `${ql.qlId} seed ${seed} contains banned student wording: ${banned}`,
      );
    }

    assert.ok(question.explanation.sourceDemonstration.includes(question.source.input));
    assert.ok(question.explanation.sourceDemonstration.includes(String(question.source.output)));
    assert.ok(question.explanation.targetApplication.includes(question.target.input));
    assert.ok(question.explanation.targetApplication.includes(String(question.target.output)));
    assert.ok(question.explanation.sourceDemonstration.length >= 80);
    assert.ok(question.explanation.targetApplication.length >= 80);
    assert.ok(question.explanation.closestTrapRejection.length >= 70);

    if (question.ruleId === "WORD_ALPHABET_POSITION_SUM") {
      assert.match(question.explanation.sourceDemonstration, /[A-Z]=\d+/);
      assert.ok(question.explanation.sourceDemonstration.includes(" + "));
    }
    if (question.ruleId === "WORD_EQUALITY_PATTERN") {
      assert.match(question.explanation.sourceDemonstration, /first appears|repeats number/);
    }
    if (question.ruleId === "WORD_VOWEL_CONSONANT_DIFFERENTIAL_SHIFT") {
      assert.match(question.explanation.sourceDemonstration, /vowel/);
      assert.match(question.explanation.sourceDemonstration, /consonant/);
      assert.match(question.explanation.sourceDemonstration, /moves/);
    }

    const signature = explanation
      .toLowerCase()
      .replace(/[A-Z]+/g, "WORD")
      .replace(/\d+/g, "#")
      .replace(/\s+/g, " ")
      .trim();
    explanationSignatures.add(`${ql.ruleId}:${signature}`);
  }
}

assert.ok(explanationSignatures.size >= 42, "CP-007 explanations have insufficient authored variation.");

console.log("ANA-CP-007 editorial audit passed.", {
  reviewedQuestions: ANA_CP007_QLS.length * REVIEW_SEEDS.length,
  explanationSignatures: explanationSignatures.size,
});
