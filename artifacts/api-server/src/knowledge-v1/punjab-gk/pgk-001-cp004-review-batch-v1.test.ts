import assert from "node:assert/strict";
import {
  PGK_001_CP004_QL_NAMES,
  PGK_001_CP004_REVIEW_BATCH_V1,
  auditPgk001Cp004ReviewBatchV1,
} from "./pgk-001-cp004-review-batch-v1";
import {
  PGK_001_CP004_DOABS,
  PGK_001_CP004_RELATIONS,
  PGK_001_CP004_RIVER_SETS,
} from "./pgk-001-cp004-facts";

const audit = auditPgk001Cp004ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.equal(PGK_001_CP004_REVIEW_BATCH_V1.length, 42);
assert.equal(Object.keys(PGK_001_CP004_QL_NAMES).length, 7);

for (const qlId of Object.keys(PGK_001_CP004_QL_NAMES)) {
  assert.equal(
    PGK_001_CP004_REVIEW_BATCH_V1.filter((question) => question.qlId === qlId).length,
    6,
    `${qlId} must expose six review questions`,
  );
}

assert.deepEqual(PGK_001_CP004_RIVER_SETS.historicalFive, ["Sutlej", "Beas", "Ravi", "Chenab", "Jhelum"]);
assert.deepEqual(PGK_001_CP004_RIVER_SETS.presentPunjabFromHistoricalFive, ["Sutlej", "Beas", "Ravi"]);
assert.deepEqual(PGK_001_CP004_RIVER_SETS.easternRivers, ["Sutlej", "Beas", "Ravi"]);
assert.equal(PGK_001_CP004_RELATIONS.beasJoinsSutlejAt, "Harike");
assert.equal(PGK_001_CP004_RELATIONS.ghaggarType, "Seasonal");
assert.equal(PGK_001_CP004_RELATIONS.doabMeaning, "Land between two rivers");

const doabMap = Object.fromEntries(PGK_001_CP004_DOABS.map((row) => [row.name, row.rivers]));
assert.deepEqual(doabMap["Bist Doab"], ["Sutlej", "Beas"]);
assert.deepEqual(doabMap["Bari Doab"], ["Beas", "Ravi"]);
assert.deepEqual(doabMap["Rachna Doab"], ["Ravi", "Chenab"]);
assert.deepEqual(doabMap["Chaj Doab"], ["Chenab", "Jhelum"]);
assert.deepEqual(doabMap["Sind Sagar Doab"], ["Jhelum", "Indus"]);

const learnerText = PGK_001_CP004_REVIEW_BATCH_V1
  .map((question) => `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`)
  .join("\n")
  .toLowerCase();

for (const banned of [
  "government of punjab",
  "puda",
  "bbmb",
  "pseb",
  "master plan",
  "source",
  "report",
  "puadh",
  "the correct answer is",
  "the correct option",
  "this question tests",
  "identify it",
]) {
  assert.equal(learnerText.includes(banned), false, `learner text contains banned term: ${banned}`);
}

for (const question of PGK_001_CP004_REVIEW_BATCH_V1) {
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
  assert.ok(question.explanation.split(/(?<=[.!?])\s+/).length <= 3, `${question.questionId} explanation is too long`);
}

const historicalCurrentDistinction = PGK_001_CP004_REVIEW_BATCH_V1.filter((question) =>
  question.factIds.includes("present-punjab-three-from-five"),
);
assert.ok(historicalCurrentDistinction.length >= 3);

const doabQuestions = PGK_001_CP004_REVIEW_BATCH_V1.filter((question) =>
  question.factIds.some((factId) => factId.endsWith("-doab")),
);
assert.ok(doabQuestions.length >= 12);
