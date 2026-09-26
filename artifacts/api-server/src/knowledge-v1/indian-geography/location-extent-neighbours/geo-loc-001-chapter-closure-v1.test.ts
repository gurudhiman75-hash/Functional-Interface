import assert from "node:assert/strict";
import {
  GEO_LOC_001_CLOSURE_OWNING_CORPUS_V1,
  GEO_LOC_001_CLOSURE_REBALANCE_TARGETS_V1,
  auditGeoLoc001ChapterClosureV1,
} from "./geo-loc-001-chapter-closure-v1";

const audit = auditGeoLoc001ChapterClosureV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.rawOwningQuestionCount, 648);
assert.equal(audit.closureOwningQuestionCount, 648);
assert.equal(audit.permanentQlCount, 108);
assert.deepEqual(audit.difficultyCounts, { Easy: 216, Medium: 360, Hard: 72 });
assert.deepEqual(audit.rawAnswerPositions, [168, 168, 156, 156]);
assert.deepEqual(audit.closureAnswerPositions, [162, 162, 162, 162]);
assert.equal(audit.reorderedQuestionCount, 12);
assert.equal(GEO_LOC_001_CLOSURE_REBALANCE_TARGETS_V1.size, 12);
assert.equal(GEO_LOC_001_CLOSURE_OWNING_CORPUS_V1.length, 648);
assert.equal(audit.masteryQuestionCount, 108);
assert.deepEqual(audit.masteryDifficultyCounts, { Easy: 36, Medium: 60, Hard: 12 });
assert.deepEqual(audit.masteryAnswerPositions, [27, 27, 27, 27]);
assert.equal(audit.masteryStemCount, 108);
assert.equal(audit.masteryExplanationCount, 108);
assert.equal(audit.runtimePublicationAuthorized, false);
console.log(JSON.stringify(audit, null, 2));
