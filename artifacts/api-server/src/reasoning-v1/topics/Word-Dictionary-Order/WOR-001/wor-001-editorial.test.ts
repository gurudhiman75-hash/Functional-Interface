import assert from "node:assert/strict";
import { WOR_CP005_PROTOTYPES } from "./WOR-CP-005/registry";
import { buildWorBankingReviewPack, renderWorBankingReviewMarkdown } from "./banking-review-pack";
import { WOR_001_QUESTION_STUDIO_ADAPTER } from "./question-studio-adapter";
import { generateWor001Question } from "./runtime";

let transformedCases = 0;

for (const prototype of WOR_CP005_PROTOTYPES) {
  const difficulty = prototype.supportedDifficulties?.[0] ?? "MEDIUM";
  for (let seed = 0; seed < 20; seed += 1) {
    const internal = generateWor001Question(prototype.prototypeId, 41000 + seed, "en-IN", difficulty);
    const student = WOR_001_QUESTION_STUDIO_ADAPTER.generate(prototype.prototypeId, 41000 + seed, "en-IN", difficulty);

    assert.equal(student.structuredPrompt.transformedWords, undefined, `${prototype.prototypeId} leaked transformed groups to Question Studio.`);
    assert.deepEqual(student.structuredPrompt.words, internal.structuredPrompt.words);
    assert.deepEqual(student.options, internal.options);
    assert.equal(student.answer, internal.answer);
    assert.deepEqual(student.metadata.bankingTrace, internal.metadata.bankingTrace);
    assert.doesNotMatch(student.stem, /character \d+ from/i, `${prototype.prototypeId} retained mechanical character-position wording.`);
    assert.doesNotMatch(student.stem, /move 1 places/i, `${prototype.prototypeId} retained a singular/plural error.`);
    assert.doesNotMatch(student.explanation, /alphabet offset/i, `${prototype.prototypeId} exposed implementation-style offset language.`);

    if (internal.metadata.bankingTrace?.transformation !== "NONE") {
      transformedCases += 1;
      assert.equal(internal.structuredPrompt.transformedWords?.length, 5, `${prototype.prototypeId} lost the internal transformation trace.`);
    }
  }
}

assert.ok(transformedCases > 0, "Editorial audit did not exercise transformed Banking cases.");

const englishPack = buildWorBankingReviewPack("en-IN");
const englishMarkdown = renderWorBankingReviewMarkdown("en-IN", englishPack);
assert.match(englishMarkdown, /BANKING_FIVE_OPTION/);
assert.match(englishMarkdown, /Transformed groups \(internal review only\)/);
assert.ok(englishPack.every((question) => question.structuredPrompt.transformedWords === undefined));
assert.doesNotMatch(englishMarkdown, /character \d+ from|move 1 places|alphabet offset/i);
assert.ok(
  englishMarkdown.indexOf("Transformed groups (internal review only)") > englishMarkdown.indexOf("**Answer:**"),
  "Banking review pack exposes transformed groups before the answer section.",
);

console.log("WOR-001 editorial quality audit passed.", {
  prototypes: WOR_CP005_PROTOTYPES.length,
  transformedCases,
  reviewQuestions: englishPack.length,
});
