import { strict as assert } from "node:assert";
import english from "../../knowledge-v1/world-history-cp016-en-v1.json";
import hindi from "../../knowledge-v1/world-history-cp016-hi-v1.json";
import punjabi from "../../knowledge-v1/world-history-cp016-pa-v1.json";

const langs = [hindi, punjabi] as const;
assert.equal(english.length, 60);
for (const [index, localized] of langs.entries()) {
  const suffix = index === 0 ? "-HI" : "-PA";
  const language = index === 0 ? "hi" : "pa";
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
  for (let i = 0; i < english.length; i++) {
    const en = english[i];
    const tr = localized[i];
    assert.equal(tr.questionId, `${en.questionId}${suffix}`);
    assert.equal(tr.englishQuestionId, en.questionId);
    assert.equal(tr.language, language);
    for (const field of [
      "checkpointId", "factId", "originCheckpointId", "originQuestionId",
      "originFactId", "originSourceIds", "sourceIds", "correctOption",
      "difficulty", "reviewOnly", "runtimeRegistered",
    ]) assert.deepEqual(tr[field], en[field], `${language} ${en.questionId} ${field}`);
    assert.deepEqual(tr.options.map((o) => o.key), en.options.map((o) => o.key));
    assert.ok(tr.stem.trim() && tr.explanation.trim());
    assert.ok(tr.options.every((o) => o.text.trim()));
    assert.equal(tr.reviewOnly, true);
    assert.equal(tr.runtimeRegistered, false);
  }
  for (const family of new Set(localized.map((q) => q.questionFamily))) {
    assert.equal(localized.filter((q) => q.questionFamily === family).length, 6);
  }
  const byOrigin = new Map<string, number>();
  for (const q of localized) byOrigin.set(q.originCheckpointId, (byOrigin.get(q.originCheckpointId) ?? 0) + 1);
  assert.equal(byOrigin.size, 15);
  assert.ok([...byOrigin.values()].every((count) => count === 4));
}
console.log("[WHI-016-LOC] PASS Hindi/Punjabi ID, origin, source, key, family, difficulty and review-only parity");
