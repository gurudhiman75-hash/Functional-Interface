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
assert.ok(
  englishMarkdown.indexOf("Transformed groups (internal review only)") > englishMarkdown.indexOf("**Answer:**"),
  "Banking review pack exposes transformed groups before the answer section.",
);
assert.doesNotMatch(englishMarkdown, /\*\*Transformed groups \(internal review only\):\*\*[\s\S]*\n\n1\./);

console.log("WOR-001 editorial leakage audit passed.", {
  prototypes: WOR_CP005_PROTOTYPES.length,
  transformedCases,
  reviewQuestions: englishPack.length,
});
