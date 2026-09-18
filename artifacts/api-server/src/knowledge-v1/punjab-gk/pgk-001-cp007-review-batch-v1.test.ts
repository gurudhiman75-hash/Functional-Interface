import assert from "node:assert/strict";
import { PGK_001_CP007_QL_NAMES, PGK_001_CP007_REVIEW_BATCH_V1, auditPgk001Cp007ReviewBatchV1 } from "./pgk-001-cp007-review-batch-v1";
import { PGK_001_CP007_PROTECTED_AREAS, PGK_001_CP007_WETLAND_FACTS } from "./pgk-001-cp007-facts";

const audit = auditPgk001Cp007ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.equal(PGK_001_CP007_REVIEW_BATCH_V1.length, 42);
assert.equal(Object.keys(PGK_001_CP007_QL_NAMES).length, 7);
for (const qlId of Object.keys(PGK_001_CP007_QL_NAMES)) {
  assert.equal(PGK_001_CP007_REVIEW_BATCH_V1.filter((q) => q.qlId === qlId).length, 6, `${qlId} must expose six questions`);
}
const categoryMap = Object.fromEntries(PGK_001_CP007_PROTECTED_AREAS.map((x) => [x.name, x.category]));
assert.equal(categoryMap["Keshopur-Miani"], "Community Reserve");
assert.equal(categoryMap["Beas"], "Conservation Reserve");
assert.equal(categoryMap["Nangal"], "Wildlife Sanctuary");
const wetlandMap = Object.fromEntries(PGK_001_CP007_WETLAND_FACTS.map((x) => [x.name, x]));
assert.match(wetlandMap["Harike"]?.relation ?? "", /Beas-Sutlej/);
assert.equal(wetlandMap["Kanjli"]?.location, "Kapurthala");
assert.equal(wetlandMap["Ropar"]?.relation, "Sutlej");
const learnerText = PGK_001_CP007_REVIEW_BATCH_V1.map((q) => `${q.stem}\n${q.explanation}`).join("\n").toLowerCase();
for (const banned of ["government of punjab", "moef", "ramsar convention", "report", "website", "source", "the correct answer is", "the other options", "review batch", "generator", "identify it"]) {
  assert.equal(learnerText.includes(banned), false, `learner text contains banned phrase: ${banned}`);
}
for (const q of PGK_001_CP007_REVIEW_BATCH_V1) {
  assert.equal(q.reviewOnly, true);
  assert.equal(q.runtimeRegistered, false);
  assert.ok(q.explanation.split(/(?<=[.!?])\s+/).length <= 3, `${q.questionId} explanation is too long`);
}
