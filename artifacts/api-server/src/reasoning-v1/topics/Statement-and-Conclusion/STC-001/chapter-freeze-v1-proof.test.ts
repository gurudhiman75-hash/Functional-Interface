import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { STC_001_CHAPTER_FREEZE_V1 } from "./chapter-freeze-v1-manifest.ts";
import {
  STC_001_QUESTION_STUDIO_RELEASE_FREEZE,
  STC_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  assertStc001QuestionStudioPersistenceAllowed,
  previewStc001QuestionStudioReview,
} from "./question-studio-review.ts";
import { STC_QL_IDS, type StcLocale } from "./types.ts";

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

const GOVERNANCE_BLOB_LOCKS = Object.freeze({
  "./question-studio-review.ts": "919df5303dbe248ff600ab3bb222354e7ae32d0e",
  "./question-studio-integration.test.ts": "1ee5e18b91d7b643b0497f0e2fe94d1befd70df0",
  "../../../question-studio-review-registry.ts": "4b7a89d960826f9e4ec27654b1687db2b74e5e26",
});

const freeze = STC_001_CHAPTER_FREEZE_V1;
const LOCALES: readonly StcLocale[] = ["en-IN", "hi-IN", "pa-IN"];

assert.equal(freeze.freezeId, "STC-001-V1-SIX-QL-FROZEN");
assert.equal(freeze.version, "V1");
assert.equal(freeze.certifiedContentHead, "89fec52d63282ca5e2427a10e44c636a8cfb554b");
assert.equal(freeze.certifiedContentSubtreeSha, "5e6dcf1ad4ac4d51d3db630ece3cd639c90e182d");
assert.equal(freeze.currentMainTransplantCommit, "626932f89b506aa867fcefc9038a9e67a24e228b");
assert.equal(freeze.byteIdenticalCertifiedContentTransplant, true);
assert.equal(freeze.permanentQlCount, 6);
assert.deepEqual(freeze.permanentQlIds, STC_QL_IDS);
assert.deepEqual(freeze.locales, LOCALES);
assert.equal(freeze.semanticAuthorityCount, 48);
assert.equal(freeze.semanticAuthoritiesPerQl, 8);
assert.equal(freeze.dedicatedFiveWayEitherAuthorityCount, 9);
assert.deepEqual(freeze.presentationProfiles, ["FOUR_WAY", "FIVE_WAY_EITHER"]);

assert.equal(freeze.certification.workflowName, "Validate STC-001 Six-QL Review Candidate");
assert.equal(freeze.certification.runId, 33246970564);
assert.equal(freeze.certification.runNumber, 37);
assert.equal(freeze.certification.conclusion, "success");
assert.equal(freeze.certification.artifactId, 9713150827);
assert.equal(freeze.certification.artifactDigest, "sha256:fbd66e025e90189feacd41459f41f3189c3766b7101790a5c5f34edbe195a5c8");
assert.equal(freeze.certification.fourWayReviewSurfaceCount, 144);
assert.equal(freeze.certification.fiveWayReviewSurfaceCount, 27);
assert.equal(freeze.certification.totalReviewSurfaceCount, 171);
assert.equal(freeze.certification.reviewJsonSha256, "97cb3ade4b3967c5c50900673ee037a3277497e884d3c126f8a9eb8f35e1d81e");
assert.equal(freeze.certification.reviewMarkdownSha256, "98bfb5185543ab186ad9899686b31e86bb63dc1a3798987b61309649b131f692");
assert.equal(freeze.certification.humanAuditStatus, "APPROVED_CLEAN");

assertBlobLocks(freeze.certifiedContentBlobLocks, "STC-001 V1 certified content");
assertBlobLocks(GOVERNANCE_BLOB_LOCKS, "STC-001 V1 frozen Question Studio governance");

assert.equal(STC_001_QUESTION_STUDIO_RELEASE_FREEZE, freeze.freezeId);
assert.equal(STC_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount, 6);
assert.deepEqual(STC_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlIds, STC_QL_IDS);
assert.equal(STC_001_QUESTION_STUDIO_REVIEW_PACKAGE.multilingualChapterFrozen, true);
assert.equal(STC_001_QUESTION_STUDIO_REVIEW_PACKAGE.reviewOnly, true);
assert.equal(STC_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(STC_001_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(STC_001_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(STC_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(STC_001_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication, false);

assert.equal(freeze.lifecycle.multilingualChapterFrozen, true);
assert.equal(freeze.lifecycle.questionStudioReviewOnly, true);
assert.equal(freeze.lifecycle.questionBankWritable, false);
assert.equal(freeze.lifecycle.testEligible, false);
assert.equal(freeze.lifecycle.mockTestEligible, false);
assert.equal(freeze.lifecycle.publiclyPublishable, false);
assert.equal(freeze.lifecycle.automaticStudentPublication, false);
assert.equal(freeze.lifecycle.separateReleaseApprovalRequired, true);

for (const [qlIndex, qlId] of STC_QL_IDS.entries()) {
  const seed = 811 + qlIndex * 313;
  const english = previewStc001QuestionStudioReview({ qlId, locale: "en-IN", seed });
  for (const locale of LOCALES) {
    const review = previewStc001QuestionStudioReview({ qlId, locale, seed });
    assert.equal(review.freezeId, freeze.freezeId);
    assert.equal(review.lifecycleStatus, "REVIEW_ONLY");
    assert.equal(review.multilingualFrozen, true);
    assert.equal(review.question.qlId, qlId);
    assert.equal(review.question.scenarioId, english.question.scenarioId);
    assert.equal(review.question.answerClass, english.question.answerClass);
    assert.equal(review.question.correctIndex, english.question.correctIndex);
    assert.equal(review.question.metadata.reviewOnly, true);
    assert.equal(review.question.metadata.questionBankWritable, false);
    assert.equal(review.question.metadata.testEligible, false);
    assert.equal(review.question.metadata.mockEligible, false);
    assert.equal(review.question.metadata.publicEligible, false);
  }
}

const bankingEither = previewStc001QuestionStudioReview({
  qlId: "STC-QL-002",
  locale: "en-IN",
  seed: 0,
  presentationProfile: "FIVE_WAY_EITHER",
});
assert.equal(bankingEither.question.answerClass, "EITHER");
assert.equal(bankingEither.question.correctIndex, 2);
assert.equal(bankingEither.question.options.length, 5);

assert.throws(
  () => assertStc001QuestionStudioPersistenceAllowed(),
  /review only.*delivery remains locked/i,
);

console.log("PASS_STC_001_V1_SIX_QL_IMMUTABLE_FREEZE");
