import assert from "node:assert/strict";
import {
  PGK_001_CP005_QL_NAMES,
  PGK_001_CP005_REVIEW_BATCH_V1,
  auditPgk001Cp005ReviewBatchV1,
} from "./pgk-001-cp005-review-batch-v1";
import {
  PGK_001_CP005_CANAL_RELATIONS,
  PGK_001_CP005_DAMS,
  PGK_001_CP005_HEADWORKS,
  PGK_001_CP005_PROJECT_RELATIONS,
} from "./pgk-001-cp005-facts";

const audit = auditPgk001Cp005ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.equal(PGK_001_CP005_REVIEW_BATCH_V1.length, 42);
assert.equal(Object.keys(PGK_001_CP005_QL_NAMES).length, 7);

for (const qlId of Object.keys(PGK_001_CP005_QL_NAMES)) {
  assert.equal(
    PGK_001_CP005_REVIEW_BATCH_V1.filter((question) => question.qlId === qlId).length,
    6,
    `${qlId} must expose six review questions`,
  );
}

const damById = Object.fromEntries(PGK_001_CP005_DAMS.map((row) => [row.id, row]));
assert.equal(damById["bhakra-dam"]?.river, "Sutlej");
assert.equal(damById["bhakra-dam"]?.reservoir, "Gobind Sagar");
assert.equal(damById["pong-dam"]?.river, "Beas");
assert.equal(damById["pong-dam"]?.reservoir, "Maharana Pratap Sagar");
assert.ok(damById["ranjit-sagar-dam"]?.aliases?.includes("Thein Dam"));
assert.equal(damById["ranjit-sagar-dam"]?.installedCapacityMw, 600);
assert.equal(damById["shahpurkandi-dam"]?.river, "Ravi");
assert.equal(damById["shahpurkandi-dam"]?.installedCapacityMw, 206);

const headworksById = Object.fromEntries(PGK_001_CP005_HEADWORKS.map((row) => [row.id, row]));
assert.equal(headworksById["ropar-headworks"]?.river, "Sutlej");
assert.equal(headworksById["madhopur-headworks"]?.river, "Ravi");
assert.equal(headworksById["harike-headworks"]?.river, "Beas-Sutlej confluence");
assert.equal(headworksById["nangal-barrage"]?.kind, "Mass-concrete barrage");

const canalById = Object.fromEntries(PGK_001_CP005_CANAL_RELATIONS.map((row) => [row.id, row]));
assert.equal(canalById["sirhind-canal-ropar"]?.headworks, "Ropar Headworks");
assert.equal(canalById["ubdc-madhopur"]?.headworks, "Madhopur Headworks");
assert.equal(canalById["ferozepur-feeder-harike"]?.headworks, "Harike Headworks");

const relationById = Object.fromEntries(PGK_001_CP005_PROJECT_RELATIONS.map((row) => [row.id, row]));
assert.match(relationById["beas-sutlej-link"]?.relation ?? "", /Beas water.*Sutlej/i);
assert.match(relationById["shahpurkandi-ravi-sequence"]?.relation ?? "", /downstream of Ranjit Sagar.*upstream of Madhopur/i);

const learnerText = PGK_001_CP005_REVIEW_BATCH_V1
  .map((question) => `${question.stem}\n${question.explanation}`)
  .join("\n")
  .toLowerCase();

for (const banned of [
  "according to",
  "government of punjab",
  "bbmb",
  "pspcl",
  "puda",
  "department of water resources",
  "master plan",
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

for (const question of PGK_001_CP005_REVIEW_BATCH_V1) {
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
  assert.ok(question.explanation.split(/(?<=[.!?])\s+/).length <= 3, `${question.questionId} explanation is too long`);
}
