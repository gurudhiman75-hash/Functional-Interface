import { strict as assert } from "node:assert";
import questions from "../../knowledge-v1/world-history-cp006-en-v1.json";
import authority from "../../../../review/world-history/WHI-001-CP006-CANONICAL-FACTS-Q001-020-V1.json";

const allowedSources = new Set(authority.sourceRegister.map((source) => source.sourceId));
const facts = new Map(authority.facts.map((fact) => [fact.factId, fact]));
const families = new Set([
  "Movement and objective",
  "Person and contribution",
  "State and political base",
  "Event and outcome",
  "Chronology and sequence",
  "Territory and completion",
  "Constitutional and political structure",
  "Movement comparison",
  "Diplomacy and popular action",
  "Cross-stage synthesis",
]);

assert.equal(questions.length, 20, "CP006 review batch 1 must contain Q001–Q020");
assert.equal(authority.facts.length, questions.length, "each review question must have one canonical fact record");
assert.deepEqual(
  ["easy", "medium", "hard"].map((difficulty) => questions.filter((question) => question.difficulty === difficulty).length),
  [6, 11, 3],
  "batch difficulty totals must match the review artifact",
);
assert.deepEqual(
  ["A", "B", "C", "D"].map((key) => questions.filter((question) => question.correctOption === key).length),
  [5, 5, 5, 5],
  "batch answer positions must remain balanced",
);
assert.equal(new Set(questions.map((question) => question.stem.trim().toLowerCase())).size, questions.length, "question stems must be unique");

for (const [index, question] of questions.entries()) {
  const id = `WHI-CP006-Q${String(index + 1).padStart(3, "0")}`;
  assert.equal(question.questionId, id);
  assert.equal(question.englishQuestionId, id);
  assert.equal(question.checkpointId, "WHI-001-CP006");
  assert.equal(question.factId, id.replace("-Q", "-F"));
  assert.equal(question.language, "en");
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
  assert.ok(families.has(question.questionFamily), `${id} has an unknown question family`);
  assert.equal(question.options.length, 4);
  assert.deepEqual(question.options.map((option) => option.key), ["A", "B", "C", "D"]);
  assert.equal(new Set(question.options.map((option) => option.text)).size, 4);
  assert.ok(question.options.some((option) => option.key === question.correctOption));
  assert.ok(question.sourceIds.length > 0 && question.sourceIds.every((sourceId) => allowedSources.has(sourceId)));
  const fact = facts.get(question.factId);
  assert.ok(fact, `${id} has no canonical fact`);
  assert.deepEqual(question.sourceIds, fact.sourceIds, `${id} question and fact provenance differ`);
  assert.ok(question.stem.length > 0 && question.explanation.length > 0);
  assert.ok(!question.explanation.includes("CP006-S"), `${id} learner explanation must not expose source tags`);
}

console.log("[WHI-006 batch 1] PASS 20 questions, canonical facts, QL families, provenance, answer key and unpublished state");
