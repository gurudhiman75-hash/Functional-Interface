import { strict as assert } from "node:assert";
import { buildBlr001ApprovedEnglishFreezeAudit } from "./blr-001-approved-english-freeze-audit";

const result = buildBlr001ApprovedEnglishFreezeAudit();

if (result.blockerFindings.length > 0) {
  console.error(JSON.stringify({ blockers: result.blockerFindings.slice(0, 100) }, null, 2));
}

assert.equal(result.chapterBaselineVerdict, "CHAPTER_ENGLISH_GAP_FREEZE_CANDIDATE");
assert.equal(result.permanentQlCount, 35);
assert.equal(result.approvedCorpusQuestionCount, 168);
assert.deepEqual(result.qlCounts, {
  "BLR-QL-031": 48,
  "BLR-QL-032": 32,
  "BLR-QL-033": 24,
  "BLR-QL-034": 32,
  "BLR-QL-035": 32,
});
assert.equal(result.exactStemCount, 168);
assert.equal(result.editorialFingerprintCount, 168);
assert(result.maximumShortcutRepeat <= 8);
assert(result.maximumTrapRepeat <= 8);
assert.equal(result.blockerCount, 0, result.blockerFindings.slice(0, 30).map((finding) => `${finding.code}: ${finding.itemId} — ${finding.detail}`).join("\n"));
assert.equal(result.verdict, "APPROVED_CORPUS_ENGLISH_FREEZE_REVIEW_CANDIDATE");
assert.equal(result.manualEnglishFreezeRequired, true);

console.log(JSON.stringify({
  auditVersion: result.auditVersion,
  chapterBaselineVerdict: result.chapterBaselineVerdict,
  permanentQlCount: result.permanentQlCount,
  approvedCorpusQuestionCount: result.approvedCorpusQuestionCount,
  qlCounts: result.qlCounts,
  difficultyCounts: result.difficultyCounts,
  recommendedUseCounts: result.recommendedUseCounts,
  exactStemCount: result.exactStemCount,
  editorialFingerprintCount: result.editorialFingerprintCount,
  normalizedTemplateClusterCount: result.normalizedTemplateClusterCount,
  maximumNormalizedTemplateRepeat: result.maximumNormalizedTemplateRepeat,
  maximumShortcutRepeat: result.maximumShortcutRepeat,
  maximumTrapRepeat: result.maximumTrapRepeat,
  maximumStemWords: result.maximumStemWords,
  averageStemWords: result.averageStemWords,
  maximumOptionWords: result.maximumOptionWords,
  averageOptionWords: result.averageOptionWords,
  maximumExplanationWords: result.maximumExplanationWords,
  averageExplanationWords: result.averageExplanationWords,
  blockerCount: result.blockerCount,
  warningCount: result.warningCount,
  verdict: result.verdict,
  manualEnglishFreezeRequired: result.manualEnglishFreezeRequired,
}, null, 2));
