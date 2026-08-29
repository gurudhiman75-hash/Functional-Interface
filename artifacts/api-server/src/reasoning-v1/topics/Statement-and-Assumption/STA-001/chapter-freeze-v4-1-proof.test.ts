import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { STA_001_CHAPTER_FREEZE_V4_1 } from "./chapter-freeze-v4-1-manifest.ts";
import {
  STA_001_QUESTION_STUDIO_RELEASE_FREEZE,
  STA_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewSta001QuestionStudioReview,
} from "./question-studio-review.ts";

function gitBlobSha1(content: string): string {
  const raw = Buffer.from(content, "utf8");
  return createHash("sha1")
    .update(Buffer.from(`blob ${raw.length}\0`, "utf8"))
    .update(raw)
    .digest("hex");
}

function assertBlobLocks(locks: Readonly<Record<string, string>>, label: string): void {
  for (const [relativePath, expectedSha] of Object.entries(locks)) {
    const content = readFileSync(new URL(relativePath, import.meta.url), "utf8");
    assert.equal(gitBlobSha1(content), expectedSha, `${label}: blob drift in ${relativePath}`);
  }
}

const freeze = STA_001_CHAPTER_FREEZE_V4_1;
const allQls = ["STA-QL-001", "STA-QL-002", "STA-QL-003", "STA-QL-004", "STA-QL-005", "STA-QL-006"] as const;

assert.equal(freeze.freezeId, "STA-001-V4-1-SIX-QL-FROZEN");
assert.equal(freeze.version, "V4.1");
assert.equal(freeze.permanentQlCount, 6);
assert.deepEqual(freeze.permanentQlIds, allQls);
assert.deepEqual(freeze.historicalPermanentQlIds, ["STA-QL-001", "STA-QL-002", "STA-QL-003", "STA-QL-004"]);
assert.deepEqual(freeze.addedByV4_1, ["STA-QL-005", "STA-QL-006"]);
assert.equal(freeze.historicalFourQlFreezePreserved, true);
assert.deepEqual(freeze.languages, ["en", "hi", "pa"]);
assert.equal(freeze.presentationProfileCount, 9);
assert.equal(freeze.scenarioAuthorityCount, 108);
assert.equal(freeze.scenarioContextsPerQl, 18);
assert.equal(freeze.candidateAuthoritiesPerScenario, 7);

assert.equal(freeze.certification.workflowName, "Validate STA-001 Exam Realness V4.1");
assert.equal(freeze.certification.runId, 33226707415);
assert.equal(freeze.certification.runNumber, 85);
assert.equal(freeze.certification.conclusion, "success");
assert.equal(freeze.certification.artifactId, 9707113407);
assert.equal(freeze.certification.artifactDigest, "sha256:71700146a15ffd07783d75694319a344953d01798f17f8ff3692d69794719371");
assert.equal(freeze.certification.reviewItemCount, 24);
assert.equal(freeze.certification.reviewLanguageSurfaceCount, 72);
assert.equal(freeze.certification.reviewJsonSha256, "3410388c5a7072a7b190417ee71f531b95ca492ad76b0740c8171fda7500a733");
assert.equal(freeze.certification.reviewMarkdownSha256, "64a4eb717d1ed47605a43f33cfa4345cb7507965891ddf4875c198ffa6c16ae4");
assert.equal(freeze.certification.byteIdenticalToFinalHumanAuditedPack, true);
assert.equal(freeze.certification.humanAuditStatus, "APPROVED_CLEAN");

assertBlobLocks(freeze.authorityBlobLocks, "STA-001 V4.1 frozen authority");
assertBlobLocks(freeze.frozenGovernanceBlobLocks, "STA-001 V4.1 frozen Question Studio governance");

assert.equal(STA_001_QUESTION_STUDIO_RELEASE_FREEZE, "STA-001-V4-1-FROZEN");
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount, 6);
assert.deepEqual(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlIds, allQls);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.multilingualChapterFrozen, true);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.reviewOnly, true);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication, false);

assert.equal(freeze.lifecycle.multilingualChapterFrozen, true);
assert.equal(freeze.lifecycle.questionStudioReviewOnly, true);
assert.equal(freeze.lifecycle.questionBankWritable, false);
assert.equal(freeze.lifecycle.testEligible, false);
assert.equal(freeze.lifecycle.mockTestEligible, false);
assert.equal(freeze.lifecycle.publiclyPublishable, false);
assert.equal(freeze.lifecycle.automaticStudentPublication, false);
assert.equal(freeze.lifecycle.separateReleaseApprovalRequired, true);

for (const qlId of allQls) {
  for (const language of ["en", "hi", "pa"] as const) {
    const review = previewSta001QuestionStudioReview({
      qlId,
      language,
      profileId: "BANK_5X5",
      count: 1,
      seed: `sta-v41-freeze-proof:${qlId}:${language}`,
    });
    const question = review.questions[0]!;
    assert.equal(question.qlId, qlId);
    assert.equal(question.permanentQlId, qlId);
    assert.equal(question.validation.multilingualFrozen, true);
    assert.equal(question.source.freezeId, "STA-001-V4-1-FROZEN");
    assert.equal(question.lifecycleStatus, "REVIEW_ONLY");
  }
}

console.log("PASS_STA_001_V4_1_SIX_QL_IMMUTABLE_FREEZE");
