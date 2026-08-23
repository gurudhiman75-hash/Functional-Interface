import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { STA_ENGLISH_CORPUS_BY_QL } from "./english-corpus/index.ts";
import { STA_QL002_HI_PA_FREEZE_V2_MANIFEST } from "./localization-ql002-freeze-manifest.ts";
import { STA_QL003_HINDI_REVIEW_COPY, STA_QL003_PUNJABI_REVIEW_COPY } from "./localization-ql003-copy.ts";
import {
  editorializeStaQl003LocalizedText,
  generateStaQl003LocalizedQuestionV2,
  STA_QL003_LOCALIZATION_EDITORIAL_VERSION,
  type StaQl003LocalizedQuestionV2,
} from "./localization-ql003-editorial-v2.ts";
import { STA_QL003_HI_PA_FREEZE_V2_MANIFEST } from "./localization-ql003-freeze-manifest.ts";
import type { StaLocalizedLocale, StaLocalizationBundle } from "./localization-types.ts";

const MAX_SEARCH = 100_000;

function gitBlobSha(relativePath: string): string {
  const bytes = readFileSync(new URL(relativePath, import.meta.url));
  const header = Buffer.from(`blob ${bytes.length}\0`, "utf8");
  return createHash("sha1").update(header).update(bytes).digest("hex");
}

for (const [relativePath, expectedSha] of Object.entries(STA_QL003_HI_PA_FREEZE_V2_MANIFEST.sourceBlobLocks)) {
  assert.equal(gitBlobSha(relativePath), expectedSha, `${relativePath}: frozen QL003 localization source changed`);
}

function bundleFor(locale: StaLocalizedLocale): StaLocalizationBundle {
  return locale === "hi-IN" ? STA_QL003_HINDI_REVIEW_COPY : STA_QL003_PUNJABI_REVIEW_COPY;
}

function collect(locale: StaLocalizedLocale): StaQl003LocalizedQuestionV2[] {
  const expectedIds = STA_ENGLISH_CORPUS_BY_QL["STA-QL-003"].map((scenario) => scenario.scenarioId);
  const baseByScenario = new Map<string, StaQl003LocalizedQuestionV2>();

  for (let index = 0; index < MAX_SEARCH && baseByScenario.size < expectedIds.length; index += 1) {
    const question = generateStaQl003LocalizedQuestionV2(`sta-ql003-native-review-v2:${locale}:${index}`, locale);
    if (!baseByScenario.has(question.scenarioId)) baseByScenario.set(question.scenarioId, question);
  }

  const bundle = bundleFor(locale);
  return expectedIds.flatMap((scenarioId) => {
    const base = baseByScenario.get(scenarioId);
    assert.ok(base, `${locale}:${scenarioId}: canonical frozen review seed unavailable`);
    const copy = bundle[scenarioId];
    assert.ok(copy, `${locale}:${scenarioId}: frozen localization copy unavailable`);
    assert.ok(copy.statementVariants.length >= 2, `${locale}:${scenarioId}: two frozen stem variants required`);
    return copy.statementVariants.slice(0, 2).map((statement) => ({
      ...base,
      statement: editorializeStaQl003LocalizedText(locale, statement),
    }));
  });
}

const hindi = collect("hi-IN");
const punjabi = collect("pa-IN");

assert.equal(STA_QL002_HI_PA_FREEZE_V2_MANIFEST.lifecycle.ql002HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL003_LOCALIZATION_EDITORIAL_VERSION, STA_QL003_HI_PA_FREEZE_V2_MANIFEST.editorialVersion);
assert.equal(hindi.length, STA_QL003_HI_PA_FREEZE_V2_MANIFEST.canonicalQuestionsPerLocale);
assert.equal(punjabi.length, STA_QL003_HI_PA_FREEZE_V2_MANIFEST.canonicalQuestionsPerLocale);
assert.equal(new Set(hindi.map((question) => question.scenarioId)).size, STA_QL003_HI_PA_FREEZE_V2_MANIFEST.authorityCountPerLocale);
assert.equal(new Set(punjabi.map((question) => question.scenarioId)).size, STA_QL003_HI_PA_FREEZE_V2_MANIFEST.authorityCountPerLocale);
assert.equal(new Set(hindi.map((question) => question.statement)).size, STA_QL003_HI_PA_FREEZE_V2_MANIFEST.canonicalQuestionsPerLocale);
assert.equal(new Set(punjabi.map((question) => question.statement)).size, STA_QL003_HI_PA_FREEZE_V2_MANIFEST.canonicalQuestionsPerLocale);
assert.equal(hindi.length + punjabi.length, STA_QL003_HI_PA_FREEZE_V2_MANIFEST.canonicalCombinedQuestionCount);

for (const question of [...hindi, ...punjabi]) {
  assert.equal(question.qlId, "STA-QL-003");
  assert.equal(question.oracleParity, true);
  assert.equal(question.lifecycle.englishCorpusStatus, "FROZEN_V2");
  assert.equal(question.lifecycle.ql001HindiPunjabiStatus, "FROZEN_V2");
  assert.equal(question.lifecycle.ql002HindiPunjabiStatus, "FROZEN_V2");
  assert.equal(question.lifecycle.ql003HindiPunjabiStatus, "REVIEW_CANDIDATE_V2");
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
}

const stripLifecycle = ({ lifecycle: _lifecycle, ...learnerContent }: StaQl003LocalizedQuestionV2) => learnerContent;
const learnerProjection = {
  editorialVersion: STA_QL003_LOCALIZATION_EDITORIAL_VERSION,
  hindi: hindi.map(stripLifecycle),
  punjabi: punjabi.map(stripLifecycle),
};
const learnerDigest = `sha256:${createHash("sha256").update(JSON.stringify(learnerProjection, null, 2), "utf8").digest("hex")}`;
assert.equal(
  learnerDigest,
  STA_QL003_HI_PA_FREEZE_V2_MANIFEST.canonicalLearnerContentDigest,
  "QL003 Hindi/Punjabi learner content changed from the exact approved V2 artifact",
);

assert.equal(STA_QL003_HI_PA_FREEZE_V2_MANIFEST.approval.nativeProductApprovalRecorded, true);
assert.equal(STA_QL003_HI_PA_FREEZE_V2_MANIFEST.approval.exactCandidateApproved, true);
assert.equal(STA_QL003_HI_PA_FREEZE_V2_MANIFEST.lifecycle.ql001HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL003_HI_PA_FREEZE_V2_MANIFEST.lifecycle.ql002HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL003_HI_PA_FREEZE_V2_MANIFEST.lifecycle.ql003HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL003_HI_PA_FREEZE_V2_MANIFEST.lifecycle.ql004HindiPunjabiStatus, "NOT_STARTED");
assert.equal(STA_QL003_HI_PA_FREEZE_V2_MANIFEST.lifecycle.multilingualChapterFrozen, false);
assert.equal(STA_QL003_HI_PA_FREEZE_V2_MANIFEST.lifecycle.questionStudioDiscoverable, false);
assert.equal(STA_QL003_HI_PA_FREEZE_V2_MANIFEST.lifecycle.questionBankWritable, false);
assert.equal(STA_QL003_HI_PA_FREEZE_V2_MANIFEST.lifecycle.testEligible, false);
assert.equal(STA_QL003_HI_PA_FREEZE_V2_MANIFEST.lifecycle.publiclyPublishable, false);

console.log("PASS_STA_QL003_HI_PA_FREEZE_V2");
console.log(`freeze ${STA_QL003_HI_PA_FREEZE_V2_MANIFEST.freezeId}`);
console.log(`approved source head ${STA_QL003_HI_PA_FREEZE_V2_MANIFEST.approvedSourceHead}`);
console.log(`review run ${STA_QL003_HI_PA_FREEZE_V2_MANIFEST.sourceReviewWorkflowRunId}`);
console.log(`review artifact ${STA_QL003_HI_PA_FREEZE_V2_MANIFEST.sourceReviewArtifactId}`);
console.log(`locked localization blobs ${Object.keys(STA_QL003_HI_PA_FREEZE_V2_MANIFEST.sourceBlobLocks).length}`);
console.log(`canonical learner questions ${hindi.length + punjabi.length}`);
console.log(`learner content digest ${learnerDigest}`);
console.log("QL001 Hindi/Punjabi FROZEN_V2");
console.log("QL002 Hindi/Punjabi FROZEN_V2");
console.log("QL003 Hindi/Punjabi FROZEN_V2");
console.log("QL004 Hindi/Punjabi NOT_STARTED");
console.log("Multilingual chapter false");
console.log("Question Studio false");
console.log("Question Bank false");
console.log("test/publication false");
