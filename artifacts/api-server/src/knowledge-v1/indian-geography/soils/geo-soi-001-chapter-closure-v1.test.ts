import assert from "node:assert/strict";
import { auditGeoSoi001ChapterClosureV1 } from "./geo-soi-001-chapter-closure-v1";

const audit = auditGeoSoi001ChapterClosureV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.owningQuestionCount, 648);
assert.equal(audit.permanentQlCount, 108);
assert.deepEqual(audit.difficultyCounts, { Easy: 216, Medium: 360, Hard: 72 });
assert.deepEqual(audit.answerPositions, [162, 162, 162, 162]);
assert.equal(audit.masteryQuestionCount, 108);
assert.deepEqual(audit.masteryDifficultyCounts, { Easy: 36, Medium: 60, Hard: 12 });
assert.deepEqual(audit.masteryAnswerPositions, [27, 27, 27, 27]);
assert.equal(audit.masteryStemCount, 108);
assert.equal(audit.masteryExplanationCount, 108);
assert.equal(audit.runtimePublicationAuthorized, false);
console.log(JSON.stringify(audit, null, 2));
