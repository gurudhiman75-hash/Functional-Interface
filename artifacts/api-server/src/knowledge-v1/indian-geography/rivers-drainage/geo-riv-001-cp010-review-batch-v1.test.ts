import { strict as assert } from "node:assert";
import { GEO_RIV_001_CP010_AUTHORITY_V1, GEO_RIV_001_CP010_PROJECT_ROWS_V1 } from "./geo-riv-001-cp010-facts";
import { GEO_RIV_001_CP010_REVIEW_BATCH_V1, auditGeoRiv001Cp010ReviewBatchV1 } from "./geo-riv-001-cp010-review-batch-v1";
import { GEO_RIV_001_CP010_QL_IDS_V1 } from "./geo-riv-001-cp010-review-generator-v1";

const audit = auditGeoRiv001Cp010ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.reviewPayloadDiversityValid, true);
assert.equal(GEO_RIV_001_CP010_AUTHORITY_V1.projectCount, 12);
assert.equal(GEO_RIV_001_CP010_AUTHORITY_V1.mutableStatusExcluded, true);
assert.equal(GEO_RIV_001_CP010_AUTHORITY_V1.learnerFacingRiverPrefixRequired, true);
assert.equal(GEO_RIV_001_CP010_AUTHORITY_V1.reviewOnly, true);
assert.equal(audit.questionCount, 54);
assert.deepEqual(audit.difficultyCounts, { Easy: 24, Medium: 24, Hard: 6 });
assert.deepEqual(audit.answerPositions, { 0: 14, 1: 14, 2: 13, 3: 13 });

for (const qlId of GEO_RIV_001_CP010_QL_IDS_V1) assert.equal(audit.qlCounts[qlId], 6);

const knownProjects = new Set(GEO_RIV_001_CP010_PROJECT_ROWS_V1.map((row) => row.project));
const knownReservoirs = new Set(GEO_RIV_001_CP010_PROJECT_ROWS_V1.map((row) => row.reservoir));
assert.equal(knownProjects.size, 12);
assert.equal(knownReservoirs.size, 12);

for (const question of GEO_RIV_001_CP010_REVIEW_BATCH_V1) {
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.ok(question.sourceIds.length >= 1);
  assert.ok(question.sourceFactIds.length >= 1);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
  assert.doesNotMatch(question.explanation, /CP010|sourceFact|reviewed|exam trap|shortcut/i);

  for (const option of question.options) {
    const riverNames = ["Satluj", "Beas", "Bhagirathi", "Mahanadi", "Krishna", "Narmada", "Cauvery", "Rihand", "Tapi", "Chambal", "Tungabhadra"];
    if (riverNames.includes(option.replace(/^River\s+/, "")) && !option.startsWith("River ")) {
      assert.fail(`Bare river option in ${question.questionId}: ${option}`);
    }
  }
}

console.log(JSON.stringify(audit, null, 2));
