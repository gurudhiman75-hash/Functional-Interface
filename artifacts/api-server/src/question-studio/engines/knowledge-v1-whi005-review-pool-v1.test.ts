import { strict as assert } from "node:assert";
import en from "../../knowledge-v1/world-history-cp005-en-v1.json";
import hi from "../../knowledge-v1/world-history-cp005-hi-v1.json";
import pa from "../../knowledge-v1/world-history-cp005-pa-v1.json";

const pools = { en, hi, pa } as const;
const expectedLanguages = ["en", "hi", "pa"] as const;
const validSources = new Set(Array.from({ length: 23 }, (_, index) => `CP005-S${String(index + 1).padStart(2, "0")}`));
const english = new Map(en.map((question) => [question.questionId, question]));

assert.equal(en.length, 20, "CP005 review draft must contain its current 20-question batch");
assert.equal(hi.length, en.length);
assert.equal(pa.length, en.length);
assert.deepEqual(
  ["easy", "medium", "hard"].map((difficulty) => en.filter((question) => question.difficulty === difficulty).length),
  [6, 10, 4],
  "the review batch difficulty mix must stay at 6/10/4",
);

for (const language of expectedLanguages) {
  const rows = pools[language];
  assert.equal(new Set(rows.map((question) => question.questionId)).size, 20);
  assert.deepEqual(
    ["A", "B", "C", "D"].map((key) => rows.filter((question) => question.correctOption === key).length),
    [5, 5, 5, 5],
    `${language} answer positions must be evenly distributed in this review batch`,
  );
  for (const [index, question] of rows.entries()) {
    const id = `WHI-CP005-Q${String(index + 1).padStart(3, "0")}`;
    assert.equal(question.englishQuestionId, id);
    assert.equal(question.checkpointId, "WHI-001-CP005");
    assert.equal(question.language, language);
    assert.equal(question.questionId, `${id}${language === "en" ? "" : `-${language.toUpperCase()}`}`);
    assert.equal(question.factId, id.replace("-Q", "-F"));
    assert.equal(question.reviewOnly, true);
    assert.equal(question.runtimeRegistered, false);
    assert.equal(question.options.length, 4);
    assert.deepEqual(question.options.map((option) => option.key), ["A", "B", "C", "D"]);
    assert.ok(question.options.some((option) => option.key === question.correctOption));
    assert.ok(question.sourceIds.length > 0);
    assert.ok(question.sourceIds.every((sourceId) => validSources.has(sourceId)), `${id} has an unknown source ID`);
    assert.ok(question.stem.trim().length > 0 && question.explanation.trim().length > 0);
    if (language !== "en") {
      const source = english.get(question.englishQuestionId);
      assert.ok(source, `${question.questionId} has no English counterpart`);
      assert.equal(question.correctOption, source.correctOption, `${question.questionId} answer position differs`);
      assert.equal(question.difficulty, source.difficulty, `${question.questionId} difficulty differs`);
    }
  }
}

console.log("[WHI-005] PASS 20-question trilingual review draft, answer/difficulty parity, sources and unpublished state");
