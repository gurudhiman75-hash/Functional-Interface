import { strict as assert } from "node:assert";
import cp011en from "../../knowledge-v1/world-history-cp011-en-v1.json";
import cp011hi from "../../knowledge-v1/world-history-cp011-hi-v1.json";
import cp011pa from "../../knowledge-v1/world-history-cp011-pa-v1.json";
import cp012en from "../../knowledge-v1/world-history-cp012-en-v1.json";
import cp012hi from "../../knowledge-v1/world-history-cp012-hi-v1.json";
import cp012pa from "../../knowledge-v1/world-history-cp012-pa-v1.json";
import cp013en from "../../knowledge-v1/world-history-cp013-en-v1.json";
import cp013hi from "../../knowledge-v1/world-history-cp013-hi-v1.json";
import cp013pa from "../../knowledge-v1/world-history-cp013-pa-v1.json";
import cp014en from "../../knowledge-v1/world-history-cp014-en-v1.json";
import cp014hi from "../../knowledge-v1/world-history-cp014-hi-v1.json";
import cp014pa from "../../knowledge-v1/world-history-cp014-pa-v1.json";

const checkpoints = [
  [cp011en, cp011hi, cp011pa],
  [cp012en, cp012hi, cp012pa],
  [cp013en, cp013hi, cp013pa],
  [cp014en, cp014hi, cp014pa],
] as const;

for (const [english, hindi, punjabi] of checkpoints) {
  assert.equal(english.length, 60);
  for (const [localized, language, suffix] of [
    [hindi, "hi", "-HI"],
    [punjabi, "pa", "-PA"],
  ] as const) {
    assert.equal(localized.length, english.length);
    assert.equal(new Set(localized.map((q) => q.questionId)).size, 60);
    assert.deepEqual(
      ["easy", "medium", "hard"].map((d) => localized.filter((q) => q.difficulty === d).length),
      [18, 30, 12],
    );
    assert.deepEqual(
      ["A", "B", "C", "D"].map((key) => localized.filter((q) => q.correctOption === key).length),
      [15, 15, 15, 15],
    );
    assert.equal(new Set(localized.map((q) => q.questionFamily)).size, 10);
    for (let i = 0; i < english.length; i++) {
      const en = english[i];
      const tr = localized[i];
      assert.equal(tr.questionId, `${en.questionId}${suffix}`);
      assert.equal(tr.englishQuestionId, en.questionId);
      assert.equal(tr.language, language);
      for (const field of [
        "checkpointId", "factId", "sourceIds", "correctOption",
        "difficulty", "reviewOnly", "runtimeRegistered",
      ]) assert.deepEqual(tr[field], en[field], `${language} ${en.questionId} ${field}`);
      assert.deepEqual(tr.options.map((o) => o.key), en.options.map((o) => o.key));
      assert.ok(tr.stem.trim() && tr.explanation.trim());
      assert.ok(tr.options.every((o) => o.text.trim()));
      assert.equal(tr.reviewOnly, true);
      assert.equal(tr.runtimeRegistered, false);
    }
  }
}
console.log("[WHI-011-014-LOC] PASS Hindi/Punjabi IDs, sources, answer slots, families, difficulty and review-only parity");
