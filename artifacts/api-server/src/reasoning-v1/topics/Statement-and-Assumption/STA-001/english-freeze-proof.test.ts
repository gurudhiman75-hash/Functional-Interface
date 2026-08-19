import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { STA_ENGLISH_CORPUS_BY_QL, STA_ENGLISH_CORPUS_V2, getStaEnglishCorpusCoverage } from "./english-corpus/index.ts";
import { STA_ENGLISH_FREEZE_V2_MANIFEST } from "./english-freeze-manifest.ts";
import { generateStaQuestionFromPool } from "./generator.ts";

function gitBlobSha(relativePath: string): string {
  const bytes = readFileSync(new URL(relativePath, import.meta.url));
  const header = Buffer.from(`blob ${bytes.length}\0`, "utf8");
  return createHash("sha1").update(header).update(bytes).digest("hex");
}

for (const [relativePath, expectedSha] of Object.entries(STA_ENGLISH_FREEZE_V2_MANIFEST.sourceBlobLocks)) {
  assert.equal(gitBlobSha(relativePath), expectedSha, `${relativePath}: frozen English source blob changed`);
}

const coverage = getStaEnglishCorpusCoverage();
assert.equal(coverage.totalScenarios, STA_ENGLISH_FREEZE_V2_MANIFEST.authorityCount);
assert.deepEqual(coverage.byQl, STA_ENGLISH_FREEZE_V2_MANIFEST.authorityCountByQl);
assert.equal(coverage.familyCount, STA_ENGLISH_FREEZE_V2_MANIFEST.semanticFamilyCount);
assert.equal(coverage.domains.length, STA_ENGLISH_FREEZE_V2_MANIFEST.domainCount);
assert.equal(coverage.misconceptionClasses.length, STA_ENGLISH_FREEZE_V2_MANIFEST.misconceptionClassCount);
assert.equal(coverage.dependencyRelations.length, STA_ENGLISH_FREEZE_V2_MANIFEST.dependencyRelationCount);

const reviewRows = STA_ENGLISH_CORPUS_V2.flatMap((authority) =>
  Array.from({ length: 2 }, (_, index) => {
    const pool = {
      ...STA_ENGLISH_CORPUS_BY_QL,
      [authority.proposedQlId]: [authority],
    };
    const seed = `STA-EN-V2-REVIEW-${authority.scenarioId}-${String(index).padStart(2, "0")}`;
    const question = generateStaQuestionFromPool(seed, authority.proposedQlId, pool);
    const replay = generateStaQuestionFromPool(seed, authority.proposedQlId, pool);
    assert.deepEqual(question, replay, `${authority.scenarioId}/${seed}: frozen English replay mismatch`);
    assert.equal(question.lifecycle.englishCorpusStatus, "FROZEN_V2");
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.testEligible, false);
    assert.equal(question.lifecycle.publiclyPublishable, false);
    assert.equal(question.lifecycle.hindiPunjabiStatus, "NOT_STARTED");
    assert.equal(question.explanation.includes(question.statement), false, `${question.questionId}: frozen explanation repeats the stem`);
    return {
      ...question,
      corpusFamilyId: authority.corpusFamilyId,
      domain: authority.domain,
      semanticShape: authority.semanticShape,
      discourseAct: authority.discourseAct,
    };
  }),
);

assert.equal(reviewRows.length, 128, "Frozen English review surface must contain exactly 128 questions");
assert.equal(new Set(reviewRows.map((row) => row.statement)).size, 128, "Frozen English review stems must remain unique");
assert.equal(new Set(reviewRows.map((row) => row.scenarioId)).size, 64, "Every frozen authority must appear in the canonical review surface");

const learnerContentProjection = reviewRows.map(({ lifecycle: _lifecycle, ...learnerContent }) => learnerContent);
const learnerDigest = `sha256:${createHash("sha256").update(JSON.stringify(learnerContentProjection, null, 2), "utf8").digest("hex")}`;
assert.equal(
  learnerDigest,
  STA_ENGLISH_FREEZE_V2_MANIFEST.canonicalLearnerContentDigest,
  "Canonical frozen learner content changed from the exact reviewed artifact",
);

assert.equal(STA_ENGLISH_FREEZE_V2_MANIFEST.lifecycle.englishFrozen, true);
assert.equal(STA_ENGLISH_FREEZE_V2_MANIFEST.lifecycle.hindiPunjabiStatus, "NOT_STARTED");
assert.equal(STA_ENGLISH_FREEZE_V2_MANIFEST.lifecycle.questionStudioDiscoverable, false);
assert.equal(STA_ENGLISH_FREEZE_V2_MANIFEST.lifecycle.questionBankWritable, false);
assert.equal(STA_ENGLISH_FREEZE_V2_MANIFEST.lifecycle.testEligible, false);
assert.equal(STA_ENGLISH_FREEZE_V2_MANIFEST.lifecycle.publiclyPublishable, false);

console.log("PASS_STA_001_ENGLISH_FREEZE_V2");
console.log(`freeze ${STA_ENGLISH_FREEZE_V2_MANIFEST.freezeId}`);
console.log(`reviewed source head ${STA_ENGLISH_FREEZE_V2_MANIFEST.sourceReviewedHead}`);
console.log(`review source run ${STA_ENGLISH_FREEZE_V2_MANIFEST.sourceReviewWorkflowRunId}`);
console.log(`review artifact ${STA_ENGLISH_FREEZE_V2_MANIFEST.sourceReviewArtifactId}`);
console.log(`locked source blobs ${Object.keys(STA_ENGLISH_FREEZE_V2_MANIFEST.sourceBlobLocks).length}`);
console.log(`authorities ${coverage.totalScenarios}`);
console.log(`canonical learner questions ${reviewRows.length}`);
console.log(`learner content digest ${learnerDigest}`);
console.log("English corpus FROZEN_V2");
console.log("Hindi/Punjabi NOT_STARTED");
console.log("Question Studio false");
console.log("Question Bank false");
console.log("test/publication false");
