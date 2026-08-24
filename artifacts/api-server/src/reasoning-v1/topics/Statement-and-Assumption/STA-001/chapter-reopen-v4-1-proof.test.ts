import assert from "node:assert/strict";
import { STA_001_CHAPTER_CLOSEOUT_V1 } from "./chapter-closeout-manifest.ts";
import { STA_001_CHAPTER_REOPEN_V4_1 } from "./chapter-reopen-v4-1-manifest.ts";
import { STA_V4_QL_IDS, STA_V4_SCENARIOS, STA_V4_SCENARIOS_BY_QL } from "./exam-realness-v4-1-runtime.ts";

assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.permanentQlCount, 4, "historical closeout must remain immutable evidence");
assert.equal(STA_001_CHAPTER_REOPEN_V4_1.preservesHistoricalFreezeEvidence, true);
assert.equal(STA_001_CHAPTER_REOPEN_V4_1.supersedesCurrentReviewCandidate, "STA-001-CHAPTER-REOPEN-EXAM-REALNESS-V4");
assert.deepEqual(STA_001_CHAPTER_REOPEN_V4_1.v41ReviewQlIds, STA_V4_QL_IDS);
assert.deepEqual(STA_001_CHAPTER_REOPEN_V4_1.sourceBackedCandidateQlIds, ["STA-QL-005", "STA-QL-006"]);
assert.equal(STA_001_CHAPTER_REOPEN_V4_1.contentAuthority.status, "V4_1_REVIEW_CANDIDATE");
assert.equal(STA_001_CHAPTER_REOPEN_V4_1.contentAuthority.semanticAuthorityCount, 108);
assert.equal(STA_V4_SCENARIOS.length, 108);
assert.equal(STA_001_CHAPTER_REOPEN_V4_1.contentAuthority.semanticAuthoritiesPerQl, 18);
assert.equal(STA_001_CHAPTER_REOPEN_V4_1.contentAuthority.distinctOperationalDomainsPerQl, 18);
for (const qlId of STA_V4_QL_IDS) {
  assert.equal(STA_V4_SCENARIOS_BY_QL[qlId].length, 18);
  assert.equal(new Set(STA_V4_SCENARIOS_BY_QL[qlId].map((item) => item.domain)).size, 18);
}
assert.equal(STA_001_CHAPTER_REOPEN_V4_1.contentAuthority.candidateAuthoritiesPerScenario, 7);
assert.equal(STA_001_CHAPTER_REOPEN_V4_1.contentAuthority.requiredDependenciesPerScenario, 3);
assert.equal(STA_001_CHAPTER_REOPEN_V4_1.contentAuthority.subtleDistractorsPerScenario, 4);
assert.equal(STA_001_CHAPTER_REOPEN_V4_1.contentAuthority.localeIndependentSemanticDraw, true);
assert.equal(STA_001_CHAPTER_REOPEN_V4_1.contentAuthority.antiLexicalCueGateRequired, true);
assert.equal(STA_001_CHAPTER_REOPEN_V4_1.contentAuthority.antiAnswerPositionGateRequired, true);
assert.equal(STA_001_CHAPTER_REOPEN_V4_1.contentAuthority.antiAnswerCardinalityGateRequired, true);
assert.equal(STA_001_CHAPTER_REOPEN_V4_1.contentAuthority.crossLanguageSemanticIdentityRequired, true);
assert.equal(STA_001_CHAPTER_REOPEN_V4_1.lifecycle.v41MultilingualChapterFrozen, false);
assert.equal(STA_001_CHAPTER_REOPEN_V4_1.lifecycle.questionStudio, "REGISTERED_REVIEW_ONLY");
assert.equal(STA_001_CHAPTER_REOPEN_V4_1.lifecycle.questionBankWritable, false);
assert.equal(STA_001_CHAPTER_REOPEN_V4_1.lifecycle.testEligible, false);
assert.equal(STA_001_CHAPTER_REOPEN_V4_1.lifecycle.mockTestEligible, false);
assert.equal(STA_001_CHAPTER_REOPEN_V4_1.lifecycle.publiclyPublishable, false);
assert.equal(STA_001_CHAPTER_REOPEN_V4_1.lifecycle.automaticStudentPublication, false);
assert.equal(STA_001_CHAPTER_REOPEN_V4_1.lifecycle.manualV41ApprovalRequired, true);

console.log("PASS_STA_001_CHAPTER_REOPEN_EXAM_REALNESS_V4_1");
