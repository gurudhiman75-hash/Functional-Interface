import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { generatePfcTpfPermanentEnglishCorpusV3 } from "../foundation/spatial/paper-folding-permanent-english-runtime-v3";
import { PFC_TPF_ENGLISH_FREEZE_AUTHORITY_V2 } from "../foundation/spatial/paper-folding-english-freeze-v2";
import { PFC_TPF_FINAL_COMBINED_PRODUCT_OWNER_APPROVAL_V1 } from "../foundation/spatial/paper-folding-final-combined-product-owner-approval-v1";
import { SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4 } from "../foundation/spatial/spatial-permanent-ql-allocation-v4";

const corpus = generatePfcTpfPermanentEnglishCorpusV3();
assert.equal(corpus.length, 84);
assert.equal(new Set(corpus.map((question) => question.permanentQuestionId)).size, 84);
assert.equal(new Set(corpus.map((question) => question.canonicalQuestionId)).size, 84);
assert.equal(corpus.every((question) => question.language === "en" && question.locale === "en-IN"), true);
assert.equal(corpus.filter((question) => question.provenance === "SOURCE_BACKED_CORE").length, 72);
assert.equal(corpus.filter((question) => question.provenance === "CONTROLLED_NOVEL").length, 12);

const qlCounts = Object.fromEntries(
  ["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038", "SPA-QL-039", "SPA-QL-040"].map((qlId) => [
    qlId,
    corpus.filter((question) => question.permanentQlId === qlId).length,
  ]),
);
assert.deepEqual(qlCounts, PFC_TPF_ENGLISH_FREEZE_AUTHORITY_V2.frozenCorpus.perQlCounts);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4.nextAvailablePermanentQlId, "SPA-QL-041");
assert.equal(PFC_TPF_FINAL_COMBINED_PRODUCT_OWNER_APPROVAL_V1.authorization.englishFreezeAllowedAfterRuntimeGate, true);
assert.equal(PFC_TPF_ENGLISH_FREEZE_AUTHORITY_V2.governance.englishFrozen, true);
assert.equal(PFC_TPF_ENGLISH_FREEZE_AUTHORITY_V2.governance.hindiPunjabiGenerationAllowed, true);
assert.equal(PFC_TPF_ENGLISH_FREEZE_AUTHORITY_V2.governance.questionStudioRegistrationAuthorized, false);
assert.equal(PFC_TPF_ENGLISH_FREEZE_AUTHORITY_V2.productionPolicy.canonicalArchetypesAreGenerationCeiling, false);

const evidence = {
  status: "PASS_PFC_TPF_ENGLISH_FREEZE_V2",
  authority: PFC_TPF_ENGLISH_FREEZE_AUTHORITY_V2,
  canonicalArchetypeCount: corpus.length,
  qlCounts,
  sourceBackedCoreCount: corpus.filter((question) => question.provenance === "SOURCE_BACKED_CORE").length,
  controlledNovelCount: corpus.filter((question) => question.provenance === "CONTROLLED_NOVEL").length,
  uniquePermanentQuestionIds: new Set(corpus.map((question) => question.permanentQuestionId)).size,
  uniqueCanonicalQuestionIds: new Set(corpus.map((question) => question.canonicalQuestionId)).size,
  localizationAllowed: true,
  questionStudioStillBlocked: true,
  nextGate: PFC_TPF_ENGLISH_FREEZE_AUTHORITY_V2.nextGate,
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-english-freeze-v2-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence));
