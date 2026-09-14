import assert from "node:assert/strict";
import {
  PGK_001_CP002_QL_NAMES,
  PGK_001_CP002_REVIEW_BATCH_V1,
  auditPgk001Cp002ReviewBatchV1,
} from "./pgk-001-cp002-review-batch-v1";
import {
  PGK_001_CP002_ADMIN_SNAPSHOT_V1,
  PGK_001_CP002_DISTRICTS_V1,
  PGK_001_CP002_DIVISIONS_V1,
  PGK_001_CP002_FORMATION_FACTS_V1,
} from "./pgk-001-cp002-facts";

const audit = auditPgk001Cp002ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.equal(PGK_001_CP002_REVIEW_BATCH_V1.length, 42);
assert.equal(Object.keys(PGK_001_CP002_QL_NAMES).length, 7);

for (const qlId of Object.keys(PGK_001_CP002_QL_NAMES)) {
  const count = PGK_001_CP002_REVIEW_BATCH_V1.filter((question) => question.qlId === qlId).length;
  assert.equal(count, 6, `${qlId} must expose six review questions`);
}

assert.equal(PGK_001_CP002_ADMIN_SNAPSHOT_V1.sourceYear, 2022);
assert.equal(PGK_001_CP002_ADMIN_SNAPSHOT_V1.districtCount, 23);
assert.equal(PGK_001_CP002_ADMIN_SNAPSHOT_V1.divisionCount, 5);
assert.equal(PGK_001_CP002_DISTRICTS_V1.length, 23);
assert.equal(PGK_001_CP002_DIVISIONS_V1.length, 5);

const districtNames = new Set(PGK_001_CP002_DISTRICTS_V1.map((row) => row.district));
assert.equal(districtNames.size, 23, "district roster must contain 23 unique district names");

const sas = PGK_001_CP002_DISTRICTS_V1.find((row) => row.id === "sas-nagar");
const sbs = PGK_001_CP002_DISTRICTS_V1.find((row) => row.id === "sbs-nagar");
assert.equal(sas?.headquarters, "Mohali");
assert.equal(sas?.division, "Rupnagar");
assert.equal(sbs?.headquarters, "Nawanshahr");
assert.equal(sbs?.division, "Rupnagar");

const formationById = Object.fromEntries(PGK_001_CP002_FORMATION_FACTS_V1.map((row) => [row.id, row]));
assert.equal(formationById["moga-1995"]?.parent, "Faridkot");
assert.equal(formationById["pathankot-2011"]?.parent, "Gurdaspur");
assert.equal(formationById["tarn-taran-2006"]?.parent, "Amritsar");
assert.equal(formationById["malerkotla-2021"]?.parent, "Sangrur");
assert.equal(formationById["malerkotla-2021"]?.ordinal, "23rd");

const allLearnerText = PGK_001_CP002_REVIEW_BATCH_V1
  .map((question) => `${question.stem} ${question.options.join(" ")} ${question.explanation}`)
  .join("\n");

for (const district of PGK_001_CP002_DISTRICTS_V1) {
  const visible = [district.district, district.headquarters, ...(district.aliases ?? [])].some((label) =>
    allLearnerText.toLowerCase().includes(label.toLowerCase()),
  );
  assert.equal(visible, true, `review batch should expose ${district.district} or one of its recognized labels`);
}

const snapshotCountQuestions = PGK_001_CP002_REVIEW_BATCH_V1.filter((question) =>
  question.factIds.includes("admin-snapshot-2022"),
);
assert.ok(snapshotCountQuestions.length >= 3);
for (const question of snapshotCountQuestions) {
  assert.ok(
    `${question.stem} ${question.explanation}`.includes("2022"),
    `${question.questionId} must keep the mutable count tied to 2022`,
  );
}

const bannedBoilerplate = ["which of the following is associated with", "with reference to punjab"];
for (const question of PGK_001_CP002_REVIEW_BATCH_V1) {
  const stem = question.stem.toLowerCase();
  for (const banned of bannedBoilerplate) {
    assert.equal(stem.includes(banned), false, `${question.questionId} contains banned boilerplate: ${banned}`);
  }
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
}
