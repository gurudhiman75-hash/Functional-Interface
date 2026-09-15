import assert from "node:assert/strict";
import {
  PGK_001_CP006_QL_NAMES,
  PGK_001_CP006_REVIEW_BATCH_V1,
  auditPgk001Cp006ReviewBatchV1,
} from "./pgk-001-cp006-review-batch-v1";
import {
  PGK_001_CP006_CLIMATE,
  PGK_001_CP006_CONSERVATION,
  PGK_001_CP006_RESOURCE_PROBLEMS,
  PGK_001_CP006_SOILS,
} from "./pgk-001-cp006-facts";

const audit = auditPgk001Cp006ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.equal(PGK_001_CP006_REVIEW_BATCH_V1.length, 42);
assert.equal(Object.keys(PGK_001_CP006_QL_NAMES).length, 7);

for (const qlId of Object.keys(PGK_001_CP006_QL_NAMES)) {
  assert.equal(
    PGK_001_CP006_REVIEW_BATCH_V1.filter((question) => question.qlId === qlId).length,
    6,
    `${qlId} must expose six questions`,
  );
}

assert.equal(PGK_001_CP006_CLIMATE.summer.start, "mid-April");
assert.equal(PGK_001_CP006_CLIMATE.monsoon.start, "early July");
assert.equal(PGK_001_CP006_CLIMATE.winterStart, "October");
assert.match(PGK_001_CP006_CLIMATE.rainfallGradient, /southwest/);

const soilById = Object.fromEntries(PGK_001_CP006_SOILS.map((row) => [row.id, row]));
assert.match(soilById["bangar-old-alluvium"]?.description ?? "", /Older alluvium/);
assert.match(soilById["khadar-new-alluvium"]?.description ?? "", /Newer alluvium/);
assert.ok(soilById["khadar-new-alluvium"]?.aliases?.includes("Bet"));
assert.match(soilById["southwest-brackish-water"]?.description ?? "", /brackish|saline/i);

const problemIds = new Set(PGK_001_CP006_RESOURCE_PROBLEMS.map((row) => row.id));
for (const id of ["soil-erosion", "salt-affected-soils", "waterlogging", "groundwater-overuse", "brackish-groundwater"]) {
  assert.ok(problemIds.has(id));
}

const conservationIds = new Set(PGK_001_CP006_CONSERVATION.map((row) => row.id));
for (const id of ["land-levelling", "field-drainage", "rainwater-harvesting", "watershed-treatment", "drip-irrigation", "contour-bunding"]) {
  assert.ok(conservationIds.has(id));
}

const learnerText = PGK_001_CP006_REVIEW_BATCH_V1
  .map((question) => `${question.stem}\n${question.explanation}`)
  .join("\n")
  .toLowerCase();

for (const banned of [
  "government of punjab",
  "pseb",
  "punjab agricultural university",
  "department of soil",
  "report",
  "website",
  "source",
  "the correct answer is",
  "the correct option",
  "the other options",
  "this question tests",
  "review batch",
  "generator",
  "identify it",
]) {
  assert.equal(learnerText.includes(banned), false, `learner text contains banned phrase: ${banned}`);
}

for (const question of PGK_001_CP006_REVIEW_BATCH_V1) {
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
  assert.ok(question.explanation.split(/(?<=[.!?])\s+/).length <= 3, `${question.questionId} explanation is too long`);
}
