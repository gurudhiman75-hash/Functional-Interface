import assert from "node:assert/strict";
import {
  GEO_CLI_001_OWNING_AUTHORITY_V2,
  auditGeoCli001OwningAuthorityV2,
} from "./geo-cli-001-owning-authority-v2";

const audit = auditGeoCli001OwningAuthorityV2();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 648);
assert.equal(audit.stemCount, 648);
assert.equal(audit.duplicateStemPatchCount, 6);
assert.deepEqual(audit.difficultyCounts, { Easy: 216, Medium: 360, Hard: 72 });
assert.deepEqual(audit.answerPositions, [162, 162, 162, 162]);

for (let cp = 1; cp <= 12; cp += 1) {
  const cpId = "CP" + String(cp).padStart(3, "0");
  assert.equal(audit.cpCounts[cpId], 54, cpId + " should own 54 questions");
}
for (let ql = 1; ql <= 108; ql += 1) {
  const qlId = "GEO-CLI-001-QL-" + String(ql).padStart(3, "0");
  assert.equal(audit.qlCounts[qlId], 6, qlId + " should own six questions");
}

for (const question of GEO_CLI_001_OWNING_AUTHORITY_V2) {
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.doesNotMatch(
    question.stem + "\n" + question.options.join("\n") + "\n" + question.explanation,
    /\bbroad(?:ly)?\b|\bmainly\b/i,
  );
}

console.log(JSON.stringify(audit, null, 2));
