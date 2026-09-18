import assert from "node:assert/strict";
import { PGK_001_CP008_QL_NAMES, PGK_001_CP008_REVIEW_BATCH_V1, auditPgk001Cp008ReviewBatchV1 } from "./pgk-001-cp008-review-batch-v1";
import { PGK_001_CP008_CORE_FACTS, PGK_001_CP008_SEASON_FACTS } from "./pgk-001-cp008-facts";

const audit = auditPgk001Cp008ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.equal(PGK_001_CP008_REVIEW_BATCH_V1.length, 42);
assert.equal(Object.keys(PGK_001_CP008_QL_NAMES).length, 7);

for (const qlId of Object.keys(PGK_001_CP008_QL_NAMES)) {
  assert.equal(PGK_001_CP008_REVIEW_BATCH_V1.filter((q) => q.qlId === qlId).length, 6, `${qlId} must expose six questions`);
}

const seasonMap = Object.fromEntries(PGK_001_CP008_SEASON_FACTS.map((row) => [row.crop, row.season]));
assert.equal(seasonMap["Wheat"], "Rabi");
assert.equal(seasonMap["Rice/Paddy"], "Kharif");
assert.equal(seasonMap["Cotton"], "Kharif");
assert.equal(seasonMap["Maize"], "Kharif");
assert.equal(PGK_001_CP008_CORE_FACTS.dominantRotation, "Rice-Wheat");
assert.deepEqual(PGK_001_CP008_CORE_FACTS.cottonCoreDistricts, ["Bathinda", "Mansa", "Fazilka", "Sri Muktsar Sahib"]);
assert.equal(PGK_001_CP008_CORE_FACTS.pauLocation, "Ludhiana");
assert.equal(PGK_001_CP008_CORE_FACTS.aboharMajorFruit, "Kinnow");

const learnerText = PGK_001_CP008_REVIEW_BATCH_V1.map((q) => `${q.stem}\n${q.explanation}`).join("\n").toLowerCase();
for (const banned of [
  "associated with", "linked with", "known for", "closely related to",
  "according to", "official report", "website", "the correct answer is",
  "the correct option", "the other options", "this question tests", "generator",
]) {
  assert.equal(learnerText.includes(banned), false, `learner text contains banned phrase: ${banned}`);
}

for (const question of PGK_001_CP008_REVIEW_BATCH_V1) {
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
  assert.ok(question.explanation.split(/(?<=[.!?])\s+/).length <= 3, `${question.questionId} explanation is too long`);
}

// CP008 is static GK: no year-specific production/acreage/procurement statistics in learner text.
assert.equal(/\b20\d{2}[-–/]\d{2,4}\b/.test(learnerText), false, "year-specific agricultural statistics leaked into learner text");
assert.equal(/\b\d+(?:\.\d+)?\s*%/.test(learnerText), false, "percentage statistics leaked into learner text");
