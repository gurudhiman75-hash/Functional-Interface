import assert from "node:assert/strict";
import {
  PGK_001_CP003_QL_NAMES,
  PGK_001_CP003_REVIEW_BATCH_V1,
  auditPgk001Cp003ReviewBatchV1,
} from "./pgk-001-cp003-review-batch-v1";
import {
  PGK_001_CP003_PHYSIOGRAPHY_FACTS_V1,
  PGK_001_CP003_REGION_PLACE_FACTS_V1,
  PGK_001_CP003_REGION_SCHEMES_V1,
  PGK_001_CP003_RELIEF_PROFILE_V1,
} from "./pgk-001-cp003-facts";

const audit = auditPgk001Cp003ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.equal(PGK_001_CP003_REVIEW_BATCH_V1.length, 42);
assert.equal(Object.keys(PGK_001_CP003_QL_NAMES).length, 7);

for (const qlId of Object.keys(PGK_001_CP003_QL_NAMES)) {
  const count = PGK_001_CP003_REVIEW_BATCH_V1.filter((question) => question.qlId === qlId).length;
  assert.equal(count, 6, `${qlId} must expose six review questions`);
}

const govtScheme = PGK_001_CP003_REGION_SCHEMES_V1.find((row) => row.id === "gov-punjab-three-region");
const pudaScheme = PGK_001_CP003_REGION_SCHEMES_V1.find((row) => row.id === "puda-four-natural-region");
assert.deepEqual(govtScheme?.regions, ["Majha", "Doaba", "Malwa"]);
assert.deepEqual(pudaScheme?.regions, ["Majha", "Doaba", "Malwa", "Puadh"]);

assert.equal(PGK_001_CP003_RELIEF_PROFILE_V1.averageElevationMetres, 300);
assert.equal(PGK_001_CP003_RELIEF_PROFILE_V1.southwestApproxMetres, 180);
assert.match(PGK_001_CP003_RELIEF_PROFILE_V1.northeastRelation, /500/);

const placeMap = Object.fromEntries(PGK_001_CP003_REGION_PLACE_FACTS_V1.map((row) => [row.place, row.region]));
assert.equal(placeMap["Tarn Taran"], "Majha");
assert.equal(placeMap["Jalandhar"], "Doaba");
assert.equal(placeMap["Nawanshahr"], "Doaba");
assert.equal(placeMap["Ludhiana"], "Malwa");
assert.equal(placeMap["Bathinda"], "Malwa");
assert.equal(placeMap["Sangrur"], "Malwa");

const physioById = Object.fromEntries(PGK_001_CP003_PHYSIOGRAPHY_FACTS_V1.map((row) => [row.id, row]));
assert.match(physioById["pathankot-three-tracts"]?.statement ?? "", /Sub-Mountainous, Kandi and Plain/);
assert.match(physioById["pau-kandi-shivalik"]?.statement ?? "", /Shivalik foothills/);
assert.match(physioById["upland-relative-height"]?.statement ?? "", /above the floodplain/);

const learnerText = PGK_001_CP003_REVIEW_BATCH_V1
  .map((question) => `${question.stem}\n${question.explanation}`)
  .join("\n")
  .toLowerCase();

for (const banned of [
  "the correct answer is",
  "the correct option",
  "the other options",
  "this question tests",
  "review batch",
  "generator",
  "which of the following is associated with",
  "with reference to punjab",
  "identify it",
]) {
  assert.equal(learnerText.includes(banned), false, `learner text contains banned phrase: ${banned}`);
}

for (const question of PGK_001_CP003_REVIEW_BATCH_V1) {
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
  assert.ok(question.explanation.split(/(?<=[.!?])\s+/).length <= 3, `${question.questionId} explanation is too long`);
}

const ambiguousRegionCount = PGK_001_CP003_REVIEW_BATCH_V1.filter((question) => {
  const stem = question.stem.toLowerCase();
  return /how many.*region/.test(stem) && !/government of punjab|puda|regional plan|profile/.test(stem);
});
assert.equal(ambiguousRegionCount.length, 0, "regional-count questions must name the classification source/scheme");
