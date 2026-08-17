import assert from "node:assert/strict";
import { WOR_CP005_PROTOTYPES } from "./WOR-CP-005/registry";
import { buildWorBankingReviewPack, renderWorBankingReviewMarkdown } from "./banking-review-pack";
import { WOR_001_QUESTION_STUDIO_ADAPTER } from "./question-studio-adapter";
import { generateWor001Question } from "./runtime";

let transformedCases = 0;

for (const prototype of WOR_CP005_PROTOTYPES) {
  const difficulty = prototype.supportedDifficulties?.[0] ?? "MEDIUM";
  for (let seed = 0; seed < 20; seed += 1) {
    const actualSeed = 41000 + seed;
    const internal = generateWor001Question(prototype.prototypeId, actualSeed, "en-IN", difficulty);
    const english = WOR_001_QUESTION_STUDIO_ADAPTER.generate(prototype.prototypeId, actualSeed, "en-IN", difficulty);
    const hindi = WOR_001_QUESTION_STUDIO_ADAPTER.generate(prototype.prototypeId, actualSeed, "hi-IN", difficulty);
    const punjabi = WOR_001_QUESTION_STUDIO_ADAPTER.generate(prototype.prototypeId, actualSeed, "pa-IN", difficulty);

    for (const student of [english, hindi, punjabi]) {
      assert.equal(student.structuredPrompt.transformedWords, undefined, `${prototype.prototypeId}/${student.locale} leaked transformed groups to Question Studio.`);
      assert.deepEqual(student.structuredPrompt.words, internal.structuredPrompt.words);
      assert.deepEqual(student.options, internal.options);
      assert.equal(student.answer, internal.answer);
      assert.deepEqual(student.metadata.bankingTrace, internal.metadata.bankingTrace);
    }

    assert.doesNotMatch(english.stem, /character \d+ from/i, `${prototype.prototypeId} retained mechanical character-position wording.`);
    assert.doesNotMatch(english.stem, /move 1 places/i, `${prototype.prototypeId} retained a singular/plural error.`);
    assert.doesNotMatch(english.explanation, /alphabet offset/i, `${prototype.prototypeId} exposed implementation-style offset language.`);
    assert.doesNotMatch(hindi.explanation, /वर्णमाला परिवर्तन\s*-?\d+/i, `${prototype.prototypeId} retained implementation-style Hindi offset language.`);
    assert.doesNotMatch(punjabi.explanation, /ਵਰਣਮਾਲਾ ਤਬਦੀਲੀ\s*-?\d+/i, `${prototype.prototypeId} retained implementation-style Punjabi offset language.`);
    assert.match(hindi.stem, /[\u0900-\u097F]/);
    assert.match(punjabi.stem, /[\u0A00-\u0A7F]/);

    if (internal.metadata.bankingTrace?.transformation !== "NONE") {
      transformedCases += 1;
      assert.equal(internal.structuredPrompt.transformedWords?.length, 5, `${prototype.prototypeId} lost the internal transformation trace.`);
    }
  }
}

assert.ok(transformedCases > 0, "Editorial audit did not exercise transformed Banking cases.");

for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
  const pack = buildWorBankingReviewPack(locale);
  const markdown = renderWorBankingReviewMarkdown(locale, pack);
  assert.match(markdown, /BANKING_FIVE_OPTION/);
  assert.ok(pack.every((question) => question.structuredPrompt.transformedWords === undefined));
  assert.equal(pack.length, locale === "en-IN" ? 33 : pack.length);
  if (locale === "en-IN") {
    assert.match(markdown, /Transformed groups \(internal review only\)/);
    assert.doesNotMatch(markdown, /character \d+ from|move 1 places|alphabet offset/i);
    assert.ok(
      markdown.indexOf("Transformed groups (internal review only)") > markdown.indexOf("**Answer:**"),
      "Banking review pack exposes transformed groups before the answer section.",
    );
  }
  if (locale === "hi-IN") assert.doesNotMatch(markdown, /वर्णमाला परिवर्तन\s*-?\d+/i);
  if (locale === "pa-IN") assert.doesNotMatch(markdown, /ਵਰਣਮਾਲਾ ਤਬਦੀਲੀ\s*-?\d+/i);
}

console.log("WOR-001 multilingual editorial quality audit passed.", {
  prototypes: WOR_CP005_PROTOTYPES.length,
  transformedCases,
  reviewQuestions: buildWorBankingReviewPack("en-IN").length,
});
