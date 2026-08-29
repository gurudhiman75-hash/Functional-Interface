import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { STA_ENGLISH_CORPUS_BY_QL } from "./english-corpus/index.ts";
import { STA_QL003_HI_PA_FREEZE_V2_MANIFEST } from "./localization-ql003-freeze-manifest.ts";
import { STA_QL004_HINDI_REVIEW_COPY, STA_QL004_PUNJABI_REVIEW_COPY } from "./localization-ql004-copy.ts";
import { editorializeStaQl004LocalizedText } from "./localization-ql004-editorial-v2.ts";
import {
  examRealizeStaQl004Statement,
  generateStaQl004LocalizedQuestionV3,
  STA_QL004_EXAM_REALNESS_EDITORIAL_VERSION,
  type StaQl004LocalizedQuestionV3,
} from "./localization-ql004-editorial-v3.ts";
import { STA_QL004_HI_PA_FREEZE_V3_MANIFEST } from "./localization-ql004-freeze-manifest.ts";
import { STA_QL004_HI_PA_REVIEW_LOCK_V3_MANIFEST } from "./localization-ql004-review-lock-manifest.ts";
import type { StaLocalizedLocale, StaLocalizationBundle } from "./localization-types.ts";

const MAX_SEARCH = 100_000;

function gitBlobSha(relativePath: string): string {
  const bytes = readFileSync(new URL(relativePath, import.meta.url));
  const header = Buffer.from(`blob ${bytes.length}\0`, "utf8");
  return createHash("sha1").update(header).update(bytes).digest("hex");
}

for (const [relativePath, expectedSha] of Object.entries(STA_QL004_HI_PA_FREEZE_V3_MANIFEST.sourceBlobLocks)) {
  assert.equal(gitBlobSha(relativePath), expectedSha, `${relativePath}: frozen QL004 V3 learner source changed`);
}

function bundleFor(locale: StaLocalizedLocale): StaLocalizationBundle {
  return locale === "hi-IN" ? STA_QL004_HINDI_REVIEW_COPY : STA_QL004_PUNJABI_REVIEW_COPY;
}

function collect(locale: StaLocalizedLocale): StaQl004LocalizedQuestionV3[] {
  const expectedIds = STA_ENGLISH_CORPUS_BY_QL["STA-QL-004"].map((scenario) => scenario.scenarioId);
  const baseByScenario = new Map<string, StaQl004LocalizedQuestionV3>();
  for (let index = 0; index < MAX_SEARCH && baseByScenario.size < expectedIds.length; index += 1) {
    const question = generateStaQl004LocalizedQuestionV3(`sta-ql004-exam-realness-review-v3:${locale}:${index}`, locale);
    if (!baseByScenario.has(question.scenarioId)) baseByScenario.set(question.scenarioId, question);
  }

  const bundle = bundleFor(locale);
  return expectedIds.flatMap((scenarioId) => {
    const base = baseByScenario.get(scenarioId);
    assert.ok(base, `${locale}:${scenarioId}: canonical approved review seed unavailable`);
    const copy = bundle[scenarioId];
    assert.ok(copy, `${locale}:${scenarioId}: QL004 localization copy unavailable`);
    assert.ok(copy.statementVariants.length >= 2, `${locale}:${scenarioId}: two approved stem variants required`);
    return copy.statementVariants.slice(0, 2).map((statement) => {
      const v2 = editorializeStaQl004LocalizedText(locale, statement);
      return {
        ...base,
        statement: examRealizeStaQl004Statement(locale, v2),
      };
    });
  });
}

const hindi = collect("hi-IN");
const punjabi = collect("pa-IN");

assert.equal(STA_QL003_HI_PA_FREEZE_V2_MANIFEST.lifecycle.ql003HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL004_EXAM_REALNESS_EDITORIAL_VERSION, STA_QL004_HI_PA_FREEZE_V3_MANIFEST.editorialVersion);
assert.equal(STA_QL004_HI_PA_REVIEW_LOCK_V3_MANIFEST.reviewLockId, "STA-001-QL004-HI-PA-v3-review-locked");
assert.equal(STA_QL004_HI_PA_REVIEW_LOCK_V3_MANIFEST.canonicalLearnerContentDigest, STA_QL004_HI_PA_FREEZE_V3_MANIFEST.canonicalLearnerContentDigest);
assert.equal(STA_QL004_HI_PA_REVIEW_LOCK_V3_MANIFEST.sourceReviewArtifactId, STA_QL004_HI_PA_FREEZE_V3_MANIFEST.sourceReviewArtifactId);
assert.equal(STA_QL004_HI_PA_REVIEW_LOCK_V3_MANIFEST.sourceReviewArtifactDigest, STA_QL004_HI_PA_FREEZE_V3_MANIFEST.sourceReviewArtifactDigest);
assert.deepEqual(STA_QL004_HI_PA_REVIEW_LOCK_V3_MANIFEST.sourceBlobLocks, STA_QL004_HI_PA_FREEZE_V3_MANIFEST.sourceBlobLocks);
assert.equal(hindi.length, STA_QL004_HI_PA_FREEZE_V3_MANIFEST.canonicalQuestionsPerLocale);
assert.equal(punjabi.length, STA_QL004_HI_PA_FREEZE_V3_MANIFEST.canonicalQuestionsPerLocale);
assert.equal(new Set(hindi.map((question) => question.scenarioId)).size, STA_QL004_HI_PA_FREEZE_V3_MANIFEST.authorityCountPerLocale);
assert.equal(new Set(punjabi.map((question) => question.scenarioId)).size, STA_QL004_HI_PA_FREEZE_V3_MANIFEST.authorityCountPerLocale);
assert.equal(new Set(hindi.map((question) => question.statement)).size, STA_QL004_HI_PA_FREEZE_V3_MANIFEST.canonicalQuestionsPerLocale);
assert.equal(new Set(punjabi.map((question) => question.statement)).size, STA_QL004_HI_PA_FREEZE_V3_MANIFEST.canonicalQuestionsPerLocale);
assert.equal(hindi.length + punjabi.length, STA_QL004_HI_PA_FREEZE_V3_MANIFEST.canonicalCombinedQuestionCount);

for (const question of [...hindi, ...punjabi]) {
  assert.equal(question.qlId, "STA-QL-004");
  assert.equal(question.oracleParity, true);
  assert.equal(question.lifecycle.englishCorpusStatus, "FROZEN_V2");
  assert.equal(question.lifecycle.ql001HindiPunjabiStatus, "FROZEN_V2");
  assert.equal(question.lifecycle.ql002HindiPunjabiStatus, "FROZEN_V2");
  assert.equal(question.lifecycle.ql003HindiPunjabiStatus, "FROZEN_V2");
  assert.equal(question.lifecycle.ql004HindiPunjabiStatus, "REVIEW_CANDIDATE_V3");
  assert.equal(question.lifecycle.multilingualChapterFrozen, false);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
}

const stripLifecycle = ({ lifecycle: _lifecycle, ...learnerContent }: StaQl004LocalizedQuestionV3) => learnerContent;
const learnerProjection = {
  editorialVersion: STA_QL004_EXAM_REALNESS_EDITORIAL_VERSION,
  hindi: hindi.map(stripLifecycle),
  punjabi: punjabi.map(stripLifecycle),
};
const learnerDigest = `sha256:${createHash("sha256").update(JSON.stringify(learnerProjection, null, 2), "utf8").digest("hex")}`;
assert.equal(
  learnerDigest,
  STA_QL004_HI_PA_FREEZE_V3_MANIFEST.canonicalLearnerContentDigest,
  "QL004 Hindi/Punjabi learner content changed from the exact approved V3 artifact",
);

assert.equal(STA_QL004_HI_PA_FREEZE_V3_MANIFEST.approval.nativeProductApprovalRecorded, true);
assert.equal(STA_QL004_HI_PA_FREEZE_V3_MANIFEST.approval.exactCandidateApproved, true);
assert.equal(STA_QL004_HI_PA_FREEZE_V3_MANIFEST.approval.exactArtifactInspected, true);
assert.equal(STA_QL004_HI_PA_FREEZE_V3_MANIFEST.approval.technicalLearnerAuditPassed, true);
assert.match(STA_QL004_HI_PA_FREEZE_V3_MANIFEST.approvalAuthority, /^PRODUCT_OWNER_APPROVED_/);
assert.equal(STA_QL004_HI_PA_FREEZE_V3_MANIFEST.lifecycle.ql001HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL004_HI_PA_FREEZE_V3_MANIFEST.lifecycle.ql002HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL004_HI_PA_FREEZE_V3_MANIFEST.lifecycle.ql003HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL004_HI_PA_FREEZE_V3_MANIFEST.lifecycle.ql004HindiPunjabiStatus, "FROZEN_V3");
assert.equal(STA_QL004_HI_PA_FREEZE_V3_MANIFEST.lifecycle.multilingualChapterFrozen, false);
assert.equal(STA_QL004_HI_PA_FREEZE_V3_MANIFEST.lifecycle.questionStudioDiscoverable, false);
assert.equal(STA_QL004_HI_PA_FREEZE_V3_MANIFEST.lifecycle.questionBankWritable, false);
assert.equal(STA_QL004_HI_PA_FREEZE_V3_MANIFEST.lifecycle.testEligible, false);
assert.equal(STA_QL004_HI_PA_FREEZE_V3_MANIFEST.lifecycle.publiclyPublishable, false);

console.log("PASS_STA_QL004_HI_PA_FREEZE_V3");
console.log(`freeze ${STA_QL004_HI_PA_FREEZE_V3_MANIFEST.freezeId}`);
console.log(`approval ${STA_QL004_HI_PA_FREEZE_V3_MANIFEST.approvalAuthority}`);
console.log(`approved source head ${STA_QL004_HI_PA_FREEZE_V3_MANIFEST.approvedSourceHead}`);
console.log(`review artifact ${STA_QL004_HI_PA_FREEZE_V3_MANIFEST.sourceReviewArtifactId}`);
console.log(`canonical learner questions ${hindi.length + punjabi.length}`);
console.log(`learner content digest ${learnerDigest}`);
console.log("QL004 Hindi/Punjabi FROZEN_V3");
console.log("Multilingual chapter false");
console.log("Question Studio false");
console.log("Question Bank false");
console.log("test/publication false");
