import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { generatePfcTpfFinalCombinedEnglishReviewV1_2 } from "../foundation/spatial/paper-folding-final-combined-english-review-v1-2";
import {
  generatePfcTpfPermanentEnglishCorpusV3,
  PFC_TPF_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V3,
} from "../foundation/spatial/paper-folding-permanent-english-runtime-v3";
import { SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4 } from "../foundation/spatial/spatial-permanent-ql-allocation-v4";

const reviewed = generatePfcTpfFinalCombinedEnglishReviewV1_2();
const corpus = generatePfcTpfPermanentEnglishCorpusV3();
assert.equal(reviewed.length, 84);
assert.equal(corpus.length, 84);
assert.equal(new Set(corpus.map((question) => question.permanentQuestionId)).size, 84);
assert.equal(new Set(corpus.map((question) => question.canonicalQuestionId)).size, 84);
assert.equal(new Set(corpus.map((question) => question.contentFingerprint)).size, 84);

const counts = Object.fromEntries(
  ["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038", "SPA-QL-039", "SPA-QL-040"].map((qlId) => [
    qlId,
    corpus.filter((question) => question.permanentQlId === qlId).length,
  ]),
);
assert.deepEqual(counts, {
  "SPA-QL-035": 16,
  "SPA-QL-036": 12,
  "SPA-QL-037": 17,
  "SPA-QL-038": 15,
  "SPA-QL-039": 16,
  "SPA-QL-040": 8,
});

for (let index = 0; index < corpus.length; index += 1) {
  const source = reviewed[index];
  const runtime = corpus[index];
  assert.equal(runtime.sourceReviewId, source.reviewId);
  assert.equal(runtime.reviewId, source.reviewId);
  assert.equal(runtime.proposalId, source.proposalId);
  assert.equal(runtime.chapterCode, source.chapterCode);
  assert.equal(runtime.provenance, source.provenance);
  assert.equal(runtime.representation, source.representation);
  assert.equal(runtime.stem, source.stem, `${source.reviewId} stem changed during runtime mapping.`);
  assert.equal(runtime.stimulusSvg, source.stimulusSvg, `${source.reviewId} stimulus changed during runtime mapping.`);
  assert.deepEqual(runtime.options, source.options, `${source.reviewId} options changed during runtime mapping.`);
  assert.equal(runtime.correctOptionId, source.correctOptionId, `${source.reviewId} answer changed during runtime mapping.`);
  assert.equal(runtime.explanation, source.explanation, `${source.reviewId} explanation changed during runtime mapping.`);
  assert.equal(runtime.language, "en");
  assert.equal(runtime.locale, "en-IN");
}

assert.ok(corpus.filter((question) => question.permanentQlId === "SPA-QL-040").every((question) => question.chapterCode === "TPF-001"));
assert.ok(corpus.filter((question) => question.permanentQlId !== "SPA-QL-040").every((question) => question.chapterCode === "PFC-001"));
assert.ok(corpus.filter((question) => question.provenance === "CONTROLLED_NOVEL").every((question) => ["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038"].includes(question.permanentQlId)));
assert.equal(PFC_TPF_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V3.fixedCorpusIsProductionCeiling, false);
assert.equal(PFC_TPF_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V3.questionStudioRegistered, false);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4.nextAvailablePermanentQlId, "SPA-QL-041");

const evidence = {
  status: "PASS_PFC_TPF_PERMANENT_ENGLISH_RUNTIME_V3",
  authority: PFC_TPF_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V3,
  allocationAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4.authorityId,
  canonicalArchetypeCount: corpus.length,
  qlCounts: counts,
  reviewedContentByteEquivalent: true,
  correctAnswersRetained: true,
  controlledNovelCount: corpus.filter((question) => question.provenance === "CONTROLLED_NOVEL").length,
  sourceBackedCoreCount: corpus.filter((question) => question.provenance === "SOURCE_BACKED_CORE").length,
  governance: {
    englishFrozen: false,
    localizationAllowed: false,
    questionStudioRegistered: false,
    fixedCorpusIsProductionCeiling: false,
    nextGate: "PFC_TPF_ENGLISH_FREEZE_V2",
  },
};
mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-permanent-english-runtime-v3-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence));
