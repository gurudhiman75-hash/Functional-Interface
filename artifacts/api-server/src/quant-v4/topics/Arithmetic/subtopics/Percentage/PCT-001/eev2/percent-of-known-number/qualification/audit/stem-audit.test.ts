import { strict as assert } from "node:assert";
import { auditStemProvenance } from "./stem-audit";

const first = await auditStemProvenance();
const second = await auditStemProvenance();

assert.deepEqual(first, second, "The provenance audit must be deterministic.");
assert.equal(first.records.length, 193);
assert.equal(first.report.totalQuestionsAudited, 193);
assert.equal(first.report.approvedProvenanceCount, 0);
assert.equal(first.report.partialProvenanceCount, 0);
assert.equal(first.report.fallbackCount, 193);
assert.equal(first.report.unknownCount, 0);
assert.equal(first.report.provenanceReconstructionRate, 1);
assert.equal(first.report.questionLanguageAssetUsedForFinalWording, false);
assert.equal(first.report.stemFamiliesExpandedUsed, false);
assert.equal(first.report.approvedArchetypeUsedForWording, false);
assert.equal(first.report.csvExportBypassedNormalLanguagePipeline, true);
assert.equal(first.report.successTarget.completeReconstruction, true);
assert.equal(first.report.successTarget.zeroUnknown, true);
assert.equal(first.report.successTarget.humanAssetsDominate, false);
assert.equal(first.report.successTarget.fallbackRare, false);
assert.equal(first.report.successTarget.passed, false);
assert.equal(first.report.mostCommonStemIds.length, 5);
assert.ok(
  first.records.every(
    (record) =>
      record.provenanceStatus === "FALLBACK" &&
      record.fallbackUsage === "YES" &&
      record.approvedAssetUsedForWording === false &&
      record.normalLanguagePipelineUsed === false,
  ),
);

console.log(
  `STEM-AUDIT-001: ${first.report.totalQuestionsAudited} audited; ` +
    `${first.report.fallbackCount} fallback; ` +
    `${first.report.unknownCount} unknown.`,
);
