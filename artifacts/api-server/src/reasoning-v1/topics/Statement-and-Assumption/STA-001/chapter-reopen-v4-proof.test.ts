import assert from "node:assert/strict";
import { STA_001_CHAPTER_CLOSEOUT_V1 } from "./chapter-closeout-manifest.ts";
import { STA_001_CHAPTER_REOPEN_V4 } from "./chapter-reopen-v4-manifest.ts";
import { STA_V4_QL_IDS, STA_V4_SCENARIOS_BY_QL } from "./exam-realness-v4-runtime.ts";

assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.permanentQlCount, 4, "Historical V1 closeout evidence must remain unchanged");
assert.equal(STA_001_CHAPTER_REOPEN_V4.preservesHistoricalFreezeEvidence, true);
assert.equal(STA_001_CHAPTER_REOPEN_V4.supersedesForCurrentReview, "STA-001-CHAPTER-CLOSEOUT-v1");
assert.deepEqual(STA_001_CHAPTER_REOPEN_V4.v4ReviewQlIds, STA_V4_QL_IDS);
assert.deepEqual(STA_001_CHAPTER_REOPEN_V4.promotedSourceBackedResearchQlIds, ["STA-QL-005", "STA-QL-006"]);
assert.equal(STA_001_CHAPTER_REOPEN_V4.contentAuthority.semanticAuthorityCount, 108);
assert.equal(STA_001_CHAPTER_REOPEN_V4.contentAuthority.semanticAuthoritiesPerQl, 18);
for (const qlId of STA_V4_QL_IDS) assert.equal(STA_V4_SCENARIOS_BY_QL[qlId].length, 18);
assert.equal(STA_001_CHAPTER_REOPEN_V4.contentAuthority.localeIndependentSemanticDraw, true);
assert.equal(STA_001_CHAPTER_REOPEN_V4.contentAuthority.antiCueGateRequired, true);
assert.equal(STA_001_CHAPTER_REOPEN_V4.contentAuthority.crossLanguageSemanticIdentityRequired, true);
assert.equal(STA_001_CHAPTER_REOPEN_V4.lifecycle.v4MultilingualChapterFrozen, false);
assert.equal(STA_001_CHAPTER_REOPEN_V4.lifecycle.questionStudio, "REGISTERED_REVIEW_ONLY");
assert.equal(STA_001_CHAPTER_REOPEN_V4.lifecycle.questionBankWritable, false);
assert.equal(STA_001_CHAPTER_REOPEN_V4.lifecycle.testEligible, false);
assert.equal(STA_001_CHAPTER_REOPEN_V4.lifecycle.mockTestEligible, false);
assert.equal(STA_001_CHAPTER_REOPEN_V4.lifecycle.publiclyPublishable, false);
assert.equal(STA_001_CHAPTER_REOPEN_V4.lifecycle.automaticStudentPublication, false);
assert.equal(STA_001_CHAPTER_REOPEN_V4.lifecycle.manualV4ApprovalRequired, true);

console.log("PASS_STA_001_CHAPTER_REOPEN_EXAM_REALNESS_V4");
