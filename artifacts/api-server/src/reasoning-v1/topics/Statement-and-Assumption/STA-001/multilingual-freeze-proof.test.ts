import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { STA_ENGLISH_FREEZE_V2_MANIFEST } from "./english-freeze-manifest.ts";
import {
  generateStaExamFormatQuestionV2,
  STA_EXAM_PROFILE_IDS_V2,
} from "./exam-format-extension-v2.ts";
import { STA_EXAM_FORMAT_PROVENANCE_V2 } from "./exam-format-provenance-v2.ts";
import { STA_QL001_HI_PA_FREEZE_V2_MANIFEST } from "./localization-ql001-freeze-manifest.ts";
import { STA_QL002_HI_PA_FREEZE_V2_MANIFEST } from "./localization-ql002-freeze-manifest.ts";
import { STA_QL003_HI_PA_FREEZE_V2_MANIFEST } from "./localization-ql003-freeze-manifest.ts";
import { STA_QL004_HI_PA_FREEZE_V3_MANIFEST } from "./localization-ql004-freeze-manifest.ts";
import { STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST } from "./multilingual-freeze-manifest.ts";
import {
  generateSta001MultilingualFrozenQuestion,
  STA_001_MULTILINGUAL_FROZEN_LOCALES,
  STA_001_MULTILINGUAL_FROZEN_PROFILE_IDS,
} from "./multilingual-frozen-runtime.ts";

function gitBlobSha(relativePath: string): string {
  const bytes = readFileSync(new URL(relativePath, import.meta.url));
  const header = Buffer.from(`blob ${bytes.length}\0`, "utf8");
  return createHash("sha1").update(header).update(bytes).digest("hex");
}

for (const [relativePath, expectedSha] of Object.entries(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.authorityBlobLocks)) {
  assert.equal(gitBlobSha(relativePath), expectedSha, `${relativePath}: frozen STA authority manifest changed`);
}
for (const [relativePath, expectedSha] of Object.entries(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.presentationBlobLocks)) {
  assert.equal(gitBlobSha(relativePath), expectedSha, `${relativePath}: frozen STA presentation authority changed`);
}

assert.equal(STA_ENGLISH_FREEZE_V2_MANIFEST.freezeId, STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.englishFreezeId);
assert.equal(STA_QL001_HI_PA_FREEZE_V2_MANIFEST.freezeId, STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.ql001HindiPunjabiFreezeId);
assert.equal(STA_QL002_HI_PA_FREEZE_V2_MANIFEST.freezeId, STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.ql002HindiPunjabiFreezeId);
assert.equal(STA_QL003_HI_PA_FREEZE_V2_MANIFEST.freezeId, STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.ql003HindiPunjabiFreezeId);
assert.equal(STA_QL004_HI_PA_FREEZE_V3_MANIFEST.freezeId, STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.ql004HindiPunjabiFreezeId);
assert.deepEqual(STA_001_MULTILINGUAL_FROZEN_PROFILE_IDS, STA_EXAM_PROFILE_IDS_V2);
assert.deepEqual(STA_001_MULTILINGUAL_FROZEN_PROFILE_IDS, STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.presentationProfiles);
assert.deepEqual(STA_001_MULTILINGUAL_FROZEN_LOCALES, STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.localeIds);

const expectedProvenance = {
  SSC_2X4: "DIRECT_PYQ_FORMAT",
  SSC_3X4: "DIRECT_PYQ_FORMAT",
  BANK_2X5: "LEGACY_OR_FAMILY_COMPATIBLE",
  BANK_3X5: "DIRECT_MEMORY_BASED_PYQ",
  BANK_4X5: "DIRECT_MEMORY_BASED_PYQ",
  BANK_3X5_NEGATIVE: "LEGACY_OR_FAMILY_COMPATIBLE",
  PUNJAB_2X4: "DIRECT_PYQ_FORMAT",
  PUNJAB_3X4: "CROSS_EXAM_SYNTHESIS",
  BANK_5X5: "DIRECT_MEMORY_BASED_PYQ",
} as const;
for (const profileId of STA_001_MULTILINGUAL_FROZEN_PROFILE_IDS) {
  const provenance = STA_EXAM_FORMAT_PROVENANCE_V2[profileId];
  assert.equal(provenance.evidenceClass, expectedProvenance[profileId]);
  assert.equal(provenance.freezeEligible, true);
  if (profileId === "PUNJAB_3X4") assert.equal(provenance.directPunjabPyqBacked, false);
  if (profileId.startsWith("BANK_")) assert.equal(provenance.officialVerbatim, false);
}

const qlReach = new Set<string>();
const profileReach = new Set<string>();
const localeReach = new Set<string>();
const answerPositions = new Set<number>();
let generatedCount = 0;
let parityCount = 0;
let bank5RemappedSeedCount = 0;

for (const locale of STA_001_MULTILINGUAL_FROZEN_LOCALES) {
  for (const profileId of STA_001_MULTILINGUAL_FROZEN_PROFILE_IDS) {
    for (let index = 0; index < 64; index += 1) {
      const requestedSeed = `sta-final-freeze:${locale}:${profileId}:${index}`;
      const frozen = generateSta001MultilingualFrozenQuestion(requestedSeed, locale, profileId);
      const source = generateStaExamFormatQuestionV2(frozen.seed, locale, profileId);
      if (profileId !== "BANK_5X5") {
        assert.equal(frozen.seed, requestedSeed, `${requestedSeed}: non-sparse profile seed changed`);
      } else if (frozen.seed !== requestedSeed) {
        bank5RemappedSeedCount += 1;
        assert.match(frozen.seed, /:BANK_5X5:eligible:\d+$/u, `${requestedSeed}: invalid BANK_5X5 resolved seed`);
      }
      const { lifecycle: _sourceLifecycle, ...sourceLearnerAuthority } = source;
      const { lifecycle: _frozenLifecycle, ...frozenLearnerAuthority } = frozen;
      assert.deepEqual(frozenLearnerAuthority, sourceLearnerAuthority, `${requestedSeed}: multilingual freeze changed learner/answer authority`);
      parityCount += 1;

      assert.equal(frozen.presentationProfile, profileId);
      assert.equal(frozen.locale, locale);
      assert.equal(frozen.oracleParity, true);
      assert.equal(frozen.options.length, frozen.optionCount);
      assert.equal(frozen.candidates.length, frozen.candidateCount);
      assert.equal(frozen.options.filter((option) => option.isCorrect).length, 1);
      assert.equal(frozen.options[frozen.answerIndex]?.isCorrect, true);
      assert.equal(frozen.lifecycle.semanticQls, "FROZEN");
      assert.equal(frozen.lifecycle.englishCorpus, "FROZEN_V2");
      assert.equal(frozen.lifecycle.ql001HindiPunjabi, "FROZEN_V2");
      assert.equal(frozen.lifecycle.ql002HindiPunjabi, "FROZEN_V2");
      assert.equal(frozen.lifecycle.ql003HindiPunjabi, "FROZEN_V2");
      assert.equal(frozen.lifecycle.ql004HindiPunjabi, "FROZEN_V3");
      assert.equal(frozen.lifecycle.examFormatStatus, "FROZEN_CERTIFIED_V2");
      assert.equal(frozen.lifecycle.multilingualChapterFrozen, true);
      assert.equal(frozen.lifecycle.questionStudioDiscoverable, false);
      assert.equal(frozen.lifecycle.questionBankWritable, false);
      assert.equal(frozen.lifecycle.testEligible, false);
      assert.equal(frozen.lifecycle.mockTestEligible, false);
      assert.equal(frozen.lifecycle.publiclyPublishable, false);
      assert.equal(frozen.lifecycle.automaticStudentPublication, false);

      if (locale === "hi-IN") {
        assert.match(`${frozen.instruction} ${frozen.statement}`, /[\u0900-\u097F]/u, `${requestedSeed}: Hindi native script missing`);
      }
      if (locale === "pa-IN") {
        assert.match(`${frozen.instruction} ${frozen.statement}`, /[\u0A00-\u0A7F]/u, `${requestedSeed}: Punjabi native script missing`);
      }

      qlReach.add(frozen.qlId);
      profileReach.add(frozen.presentationProfile);
      localeReach.add(frozen.locale);
      answerPositions.add(frozen.answerIndex);
      generatedCount += 1;
    }
  }
}

assert.deepEqual([...qlReach].sort(), [...STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.permanentQlIds].sort());
assert.deepEqual([...profileReach].sort(), [...STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.presentationProfiles].sort());
assert.deepEqual([...localeReach].sort(), [...STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.localeIds].sort());
assert.ok(answerPositions.size >= 4, "frozen multilingual corpus must reach at least four answer positions across supported profiles");
assert.equal(generatedCount, STA_001_MULTILINGUAL_FROZEN_LOCALES.length * STA_001_MULTILINGUAL_FROZEN_PROFILE_IDS.length * 64);
assert.equal(parityCount, generatedCount);

assert.equal(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.lifecycle.multilingualChapterFrozen, true);
assert.equal(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.lifecycle.sourceQuestionStudioDiscoverable, false);
assert.equal(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.lifecycle.questionBankWritable, false);
assert.equal(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.lifecycle.testEligible, false);
assert.equal(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.lifecycle.mockTestEligible, false);
assert.equal(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.lifecycle.publiclyPublishable, false);
assert.equal(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.lifecycle.automaticStudentPublication, false);
assert.equal(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.presentationProvenanceBoundary.officialVerbatimBankingClaim, false);
assert.equal(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.presentationProvenanceBoundary.directPunjab3x4Claim, false);

console.log("PASS_STA_001_MULTILINGUAL_FREEZE_V1");
console.log(`freeze ${STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.freezeId}`);
console.log(`approval ${STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.approvalAuthority}`);
console.log(`questions ${generatedCount}`);
console.log(`learner/answer parity ${parityCount}`);
console.log(`BANK_5X5 deterministic source-seed remaps ${bank5RemappedSeedCount}`);
console.log(`QL reach ${[...qlReach].sort().join(",")}`);
console.log(`profile reach ${profileReach.size}`);
console.log(`locale reach ${localeReach.size}`);
console.log(`answer positions ${[...answerPositions].sort().join(",")}`);
console.log("source Question Studio false");
console.log("Question Bank/test/mock/public false");
