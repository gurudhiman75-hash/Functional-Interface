import assert from "node:assert/strict";
import {
  auditMenCp010PermanentEnglishReview,
  buildMenCp010PermanentEnglishReview,
} from "./review-v1";

const records = buildMenCp010PermanentEnglishReview();
const audit = auditMenCp010PermanentEnglishReview();

assert.equal(records.length, 104);
assert.equal(audit.reviewRecordCount, 104);
assert.equal(audit.permanentQlCount, 26);
assert.equal(audit.recordsPerQl, 4);
assert.deepEqual(audit.correctPositions, { A: 26, B: 26, C: 26, D: 26 });
assert.equal(audit.allVerified, true);
assert.equal(audit.allFourOptions, true);
assert.equal(audit.allUniqueOptions, true);
assert.equal(audit.allHaveTeaching, true);
assert.equal(audit.allReviewStatesDistinctWithinQl, true);
assert.equal(audit.allReviewSourcesCovered, true);
assert.equal(audit.noEngineeringShorthand, true);
assert.equal(audit.naturalPercentageDisplay, true);
assert.equal(audit.capacityUnitsPresent, true);
assert.equal(audit.individualizedTeaching, true);
assert.equal(audit.workedTeaching, true);
assert.equal(audit.englishImplementationFrozen, false);
assert.equal(audit.productLocked, true);

for (let index = 0; index < records.length; index += 4) {
  const slice = records.slice(index, index + 4);
  assert.equal(new Set(slice.map((q) => q.permanentQlId)).size, 1);
  assert.equal(new Set(slice.map((q) => q.stem)).size, 4);
  assert.deepEqual(slice.map((q) => q.correctIndex).sort(), [0, 1, 2, 3]);
}

console.log(JSON.stringify(audit, null, 2));
