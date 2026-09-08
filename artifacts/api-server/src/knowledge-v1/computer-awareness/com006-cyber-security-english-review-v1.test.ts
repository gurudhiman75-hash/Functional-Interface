import assert from "node:assert/strict";
import {
  COM006_CYBER_SECURITY_ENGLISH_REVIEW_AUTHORITY,
  COM006_CYBER_SECURITY_ENGLISH_REVIEW_CANDIDATE,
  auditCom006CyberSecurityEnglishReviewV1,
} from "./com006-cyber-security-english-review-v1";

const audit = auditCom006CyberSecurityEnglishReviewV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 32);
assert.equal(audit.qlCount, 8);
assert.equal(COM006_CYBER_SECURITY_ENGLISH_REVIEW_CANDIDATE.length, COM006_CYBER_SECURITY_ENGLISH_REVIEW_AUTHORITY.questionCount);

const sourceIds = new Set(COM006_CYBER_SECURITY_ENGLISH_REVIEW_AUTHORITY.sources.map((source) => source.id));
for (const question of COM006_CYBER_SECURITY_ENGLISH_REVIEW_CANDIDATE) {
  assert.equal(question.options.length, 4);
  for (const sourceId of question.source) assert.equal(sourceIds.has(sourceId), true, sourceId);
  assert.equal(/associat/i.test(question.stem + " " + question.explanation), false);
}
