import { strict as assert } from "node:assert";

process.env.DATABASE_URL ??= "postgresql://test:test@127.0.0.1:5432/test";

const {
  ENGLISH_VOCABULARY_LEARN_TOPICS,
  POLITY_LEARN_CP_MAP,
  loadApprovedEnglishVocabularyQuestions,
  loadFrozenPolityQuestions,
} = await import("./learn-practice");

assert.equal(Object.keys(POLITY_LEARN_CP_MAP).length, 67);
for (let index = 1; index <= 67; index += 1) {
  const topicId = `POL-LRN-${String(index).padStart(3, "0")}`;
  const cpIds = POLITY_LEARN_CP_MAP[topicId];
  assert.ok(cpIds?.length, `${topicId} must map to at least one approved Polity CP`);
  for (const cpId of cpIds) {
    assert.match(cpId, /^POL-CP-(00[1-9]|01\d|02[0-7])$/);
  }
}

for (const [topicId, language] of [
  ["POL-LRN-001", "en"],
  ["POL-LRN-056", "hi"],
  ["POL-LRN-064", "pa"],
] as const) {
  const questions = await loadFrozenPolityQuestions({
    topicId,
    language,
    limit: 20,
    fresh: false,
  });
  assert.ok(questions);
  assert.equal(questions.length, 20);
  assert.equal(new Set(questions.map((question) => question.id)).size, 20);
  for (const question of questions) {
    assert.equal(question.topicId, topicId);
    assert.equal(question.source, "POL-001_FROZEN_APPROVED");
    assert.equal(question.options.length, 4);
    assert.ok(question.correctOptionIndex >= 0 && question.correctOptionIndex < 4);
    assert.ok(question.text.trim().length > 0);
    assert.ok(question.explanation.trim().length > 0);
    assert.match(question.cpId, /^POL-CP-/);
    assert.match(question.qlId, /^POL-\d{3}-QL-\d{3}$/);
  }
}

console.log("POL-001 Learn practice mapping: 67 topics and multilingual frozen draws verified.");


assert.equal(Object.keys(ENGLISH_VOCABULARY_LEARN_TOPICS).length, 4);
for (const topicId of [
  "ENG-VOC-SYN",
  "ENG-VOC-ANT",
  "ENG-VOC-IDIOM",
  "ENG-VOC-OWS",
] as const) {
  const questions = await loadApprovedEnglishVocabularyQuestions({
    topicId,
    limit: 20,
    fresh: false,
  });
  assert.ok(questions);
  assert.equal(questions.length, 20);
  assert.equal(new Set(questions.map((question) => question.id)).size, 20);
  for (const question of questions) {
    assert.equal(question.topicId, topicId);
    assert.equal(question.options.length, 4);
    assert.ok(question.correctOptionIndex >= 0 && question.correctOptionIndex < 4);
    assert.ok(question.text.trim().length > 0);
    assert.ok(question.explanation.trim().length > 0);
    assert.match(question.cpId, /^ENG-00[456]-CP00[1-6]$/);
    assert.match(question.source, /HUMAN_APPROVED_LEARN_ONLY$/);
  }
}

console.log("English vocabulary Learn practice: four approved 20-question topic draws verified.");
