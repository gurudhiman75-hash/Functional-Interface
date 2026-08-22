import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { STA_ENGLISH_FREEZE_V2_MANIFEST } from "./english-freeze-manifest.ts";
import { STA_EXAM_PROFILES, generateStaExamFormatQuestion, type StaExamLocale, type StaExamProfileId } from "./exam-format-extension.ts";
import { STA_BANK_FOURTH_ASSUMPTION_OVERLAYS } from "./exam-format-bank-fourth-assumption.ts";
import { STA_QL001_HI_PA_FREEZE_V2_MANIFEST } from "./localization-ql001-freeze-manifest.ts";
import { STA_QL002_HI_PA_FREEZE_V2_MANIFEST } from "./localization-ql002-freeze-manifest.ts";
import { STA_QL003_HI_PA_FREEZE_V2_MANIFEST } from "./localization-ql003-freeze-manifest.ts";
import { STA_QL004_HI_PA_REVIEW_LOCK_V3_MANIFEST } from "./localization-ql004-review-lock-manifest.ts";
import { STA_001_MULTILINGUAL_PRE_FREEZE_V1_MANIFEST } from "./multilingual-pre-freeze-manifest.ts";

function gitBlobSha(relativePath: string): string {
  const bytes = readFileSync(new URL(relativePath, import.meta.url));
  const header = Buffer.from(`blob ${bytes.length}\0`, "utf8");
  return createHash("sha1").update(header).update(bytes).digest("hex");
}

for (const [relativePath, expectedSha] of Object.entries(STA_001_MULTILINGUAL_PRE_FREEZE_V1_MANIFEST.examPresentationBlobLocks)) {
  assert.equal(gitBlobSha(relativePath), expectedSha, `${relativePath}: certified STA presentation runtime changed`);
}

assert.equal(STA_ENGLISH_FREEZE_V2_MANIFEST.freezeId, STA_001_MULTILINGUAL_PRE_FREEZE_V1_MANIFEST.englishFreezeId);
assert.equal(STA_QL001_HI_PA_FREEZE_V2_MANIFEST.freezeId, STA_001_MULTILINGUAL_PRE_FREEZE_V1_MANIFEST.ql001HindiPunjabiFreezeId);
assert.equal(STA_QL002_HI_PA_FREEZE_V2_MANIFEST.freezeId, STA_001_MULTILINGUAL_PRE_FREEZE_V1_MANIFEST.ql002HindiPunjabiFreezeId);
assert.equal(STA_QL003_HI_PA_FREEZE_V2_MANIFEST.freezeId, STA_001_MULTILINGUAL_PRE_FREEZE_V1_MANIFEST.ql003HindiPunjabiFreezeId);
assert.equal(STA_QL004_HI_PA_REVIEW_LOCK_V3_MANIFEST.reviewLockId, STA_001_MULTILINGUAL_PRE_FREEZE_V1_MANIFEST.ql004HindiPunjabiReviewLockId);
assert.equal(
  STA_QL004_HI_PA_REVIEW_LOCK_V3_MANIFEST.canonicalLearnerContentDigest,
  STA_001_MULTILINGUAL_PRE_FREEZE_V1_MANIFEST.ql004CanonicalLearnerContentDigest,
);

assert.equal(STA_QL001_HI_PA_FREEZE_V2_MANIFEST.lifecycle.ql001HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL002_HI_PA_FREEZE_V2_MANIFEST.lifecycle.ql002HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL003_HI_PA_FREEZE_V2_MANIFEST.lifecycle.ql003HindiPunjabiStatus, "FROZEN_V2");
assert.equal(STA_QL004_HI_PA_REVIEW_LOCK_V3_MANIFEST.lifecycle.ql004HindiPunjabiStatus, "REVIEW_LOCKED_V3");
assert.equal(STA_QL004_HI_PA_REVIEW_LOCK_V3_MANIFEST.review.technicalLearnerAuditPassed, true);
assert.equal(STA_QL004_HI_PA_REVIEW_LOCK_V3_MANIFEST.review.nativeProductApprovalRecorded, false);
assert.deepEqual(STA_001_MULTILINGUAL_PRE_FREEZE_V1_MANIFEST.approvalBlockers, ["QL004_NATIVE_PRODUCT_APPROVAL"]);

const profileIds = Object.keys(STA_EXAM_PROFILES) as StaExamProfileId[];
const candidateCounts = [...new Set(profileIds.map((profileId) => STA_EXAM_PROFILES[profileId].candidateCount))].sort();
const optionCounts = [...new Set(profileIds.map((profileId) => STA_EXAM_PROFILES[profileId].optionCount))].sort();
assert.deepEqual(candidateCounts, [2, 3, 4]);
assert.deepEqual(optionCounts, [4, 5]);
assert.ok(profileIds.includes("BANK_4X5"));
assert.ok(profileIds.includes("BANK_3X5_NEGATIVE"));
assert.equal(STA_BANK_FOURTH_ASSUMPTION_OVERLAYS.length, STA_001_MULTILINGUAL_PRE_FREEZE_V1_MANIFEST.certifiedPresentation.bankFourAssumptionOverlayCount);

const locales = ["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly StaExamLocale[];
let replayChecks = 0;
let generatedChecks = 0;
for (const profileId of profileIds) {
  for (const locale of locales) {
    const seed = `sta-multilingual-pre-freeze:${profileId}:${locale}`;
    const question = generateStaExamFormatQuestion(seed, locale, profileId);
    const replay = generateStaExamFormatQuestion(seed, locale, profileId);
    assert.deepEqual(replay, question, `${profileId}/${locale}: deterministic replay drift`);
    assert.equal(question.oracleParity, true);
    assert.equal(question.presentationProfile, profileId);
    assert.equal(question.locale, locale);
    assert.equal(question.candidateCount, STA_EXAM_PROFILES[profileId].candidateCount);
    assert.equal(question.optionCount, STA_EXAM_PROFILES[profileId].optionCount);
    assert.equal(question.lifecycle.multilingualChapterFrozen, false);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.testEligible, false);
    assert.equal(question.lifecycle.publiclyPublishable, false);
    if (profileId === "BANK_4X5") {
      assert.equal(question.candidates.length, 4);
      assert.ok(question.candidates.some((candidate) => candidate.label === "IV"));
      const overlay = question.candidates.find((candidate) => candidate.candidateId === "FMT-C4");
      assert.ok(overlay);
      assert.equal(overlay.oracle.classification, "NOT_IMPLICIT");
      assert.equal(overlay.oracle.evidenceCode, "NO_REQUIRED_DEPENDENCY");
    }
    replayChecks += 1;
    generatedChecks += 1;
  }
}

assert.equal(STA_001_MULTILINGUAL_PRE_FREEZE_V1_MANIFEST.lifecycle.semanticQls, "FROZEN");
assert.equal(STA_001_MULTILINGUAL_PRE_FREEZE_V1_MANIFEST.lifecycle.englishCorpus, "FROZEN_V2");
assert.equal(STA_001_MULTILINGUAL_PRE_FREEZE_V1_MANIFEST.lifecycle.ql001HindiPunjabi, "FROZEN_V2");
assert.equal(STA_001_MULTILINGUAL_PRE_FREEZE_V1_MANIFEST.lifecycle.ql002HindiPunjabi, "FROZEN_V2");
assert.equal(STA_001_MULTILINGUAL_PRE_FREEZE_V1_MANIFEST.lifecycle.ql003HindiPunjabi, "FROZEN_V2");
assert.equal(STA_001_MULTILINGUAL_PRE_FREEZE_V1_MANIFEST.lifecycle.ql004HindiPunjabi, "REVIEW_LOCKED_V3");
assert.equal(STA_001_MULTILINGUAL_PRE_FREEZE_V1_MANIFEST.lifecycle.examFormatStatus, "TECHNICALLY_CERTIFIED_V1");
assert.equal(STA_001_MULTILINGUAL_PRE_FREEZE_V1_MANIFEST.lifecycle.multilingualChapterFrozen, false);
assert.equal(STA_001_MULTILINGUAL_PRE_FREEZE_V1_MANIFEST.lifecycle.questionStudioDiscoverable, false);
assert.equal(STA_001_MULTILINGUAL_PRE_FREEZE_V1_MANIFEST.lifecycle.questionBankWritable, false);
assert.equal(STA_001_MULTILINGUAL_PRE_FREEZE_V1_MANIFEST.lifecycle.testEligible, false);
assert.equal(STA_001_MULTILINGUAL_PRE_FREEZE_V1_MANIFEST.lifecycle.publiclyPublishable, false);

console.log("PASS_STA_001_MULTILINGUAL_PRE_FREEZE_V1");
console.log(JSON.stringify({
  certificationId: STA_001_MULTILINGUAL_PRE_FREEZE_V1_MANIFEST.certificationId,
  generatedChecks,
  replayChecks,
  profileCount: profileIds.length,
  locales,
  candidateCounts,
  optionCounts,
  bankFourAssumptionOverlayCount: STA_BANK_FOURTH_ASSUMPTION_OVERLAYS.length,
  approvalBlockers: STA_001_MULTILINGUAL_PRE_FREEZE_V1_MANIFEST.approvalBlockers,
  multilingualChapterFrozen: false,
  questionStudioDiscoverable: false,
}, null, 2));
