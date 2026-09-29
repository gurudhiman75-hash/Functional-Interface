import { strict as assert } from "node:assert";
import questions from "../../knowledge-v1/world-history-cp006-en-v1.json";
import authority from "../../../../review/world-history/WHI-001-CP006-CANONICAL-FACTS-Q001-060-V1.json";

const allowedSources = new Set(authority.sourceRegister.map((source) => source.sourceId));
const facts = new Map(authority.facts.map((fact) => [fact.factId, fact]));
const families = new Set([
  "Movement and objective", "Person and contribution", "State and political base",
  "Event and outcome", "Chronology and sequence", "Territory and completion",
  "Constitutional and political structure", "Movement comparison",
  "Diplomacy and popular action", "Cross-stage synthesis",
]);

assert.equal(questions.length, 60);
assert.equal(authority.facts.length, questions.length);
assert.deepEqual(["easy", "medium", "hard"].map((d) => questions.filter((q) => q.difficulty === d).length), [18, 30, 12]);
assert.deepEqual(["A", "B", "C", "D"].map((k) => questions.filter((q) => q.correctOption === k).length), [15, 15, 15, 15]);
assert.deepEqual(new Set(questions.map((q) => q.questionFamily)), families);
for (const family of families) assert.equal(questions.filter((q) => q.questionFamily === family).length, 6);
assert.equal(new Set(questions.map((q) => q.stem.trim().toLowerCase())).size, 60);

for (const [index, question] of questions.entries()) {
  const id = `WHI-CP006-Q${String(index + 1).padStart(3, "0")}`;
  assert.equal(question.questionId, id);
  assert.equal(question.englishQuestionId, id);
  assert.equal(question.checkpointId, "WHI-001-CP006");
  assert.equal(question.factId, id.replace("-Q", "-F"));
  assert.equal(question.language, "en");
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
  assert.ok(families.has(question.questionFamily));
  assert.equal(question.options.length, 4);
  assert.deepEqual(question.options.map((o) => o.key), ["A", "B", "C", "D"]);
  assert.equal(new Set(question.options.map((o) => o.text)).size, 4);
  assert.ok(question.options.some((o) => o.key === question.correctOption));
  assert.ok(question.sourceIds.length > 0 && question.sourceIds.every((id) => allowedSources.has(id)));
  const fact = facts.get(question.factId);
  assert.ok(fact, `${id} has no canonical fact`);
  assert.deepEqual(question.sourceIds, fact.sourceIds, `${id} question/fact provenance differs`);
  assert.ok(question.stem.length > 0 && question.explanation.length > 0);
  assert.ok(!question.explanation.includes("CP006-S"));
}
console.log("[WHI-006] PASS 60 questions, 60 facts, 10 families, 18/30/12 difficulty, balanced answer keys, provenance and review-only state");
