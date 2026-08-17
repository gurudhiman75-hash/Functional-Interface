import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  assertIop001EnglishFreezeAuthority,
  IOP_001_ENGLISH_FREEZE_AUTHORITY,
} from "./english-freeze-authority.ts";
import { generateIopEnglishReviewCaselet } from "./english-review-generator.ts";
import { IOP_ENGLISH_SOURCE_MODES } from "./english-production.ts";
import { IOP_001_CHAPTER_LIFECYCLE } from "./lifecycle.ts";
import { IOP_001_PERMANENT_ALLOCATION, IOP_001_PERMANENT_QL_AUTHORITIES } from "./permanent-authorities.ts";

const APPROVED_LEARNER_CONTENT_SHA256 = "58a91a0dd0b5faeb0e601e8d5b587a0f7768a65c246530f5bb316b73b9232413";

assertIop001EnglishFreezeAuthority();
assert.equal(IOP_001_CHAPTER_LIFECYCLE.maturity, "ENGLISH_FROZEN");
assert.equal(IOP_001_CHAPTER_LIFECYCLE.englishHumanApproval, "APPROVED_2026_08_18");
assert.equal(IOP_001_CHAPTER_LIFECYCLE.englishFreeze, true);
assert.equal(IOP_001_PERMANENT_ALLOCATION.maturity, "ENGLISH_FROZEN");
assert.equal(IOP_001_PERMANENT_ALLOCATION.englishFreeze, true);
assert.equal(IOP_001_PERMANENT_QL_AUTHORITIES.length, 8);
for (const authority of IOP_001_PERMANENT_QL_AUTHORITIES) {
  assert.equal(authority.englishProductionStatus, "ENGLISH_FROZEN", `${authority.qlId} lost the English freeze`);
}

const approvedCaselets = [];
let questionCount = 0;
for (const mode of IOP_ENGLISH_SOURCE_MODES) {
  for (let example = 0; example < 2; example += 1) {
    const seed = `IOP-EN-REVIEW-${mode.sourceModeId}-${String(example).padStart(2, "0")}`;
    const caselet = generateIopEnglishReviewCaselet(seed, mode.qlId, mode.sourceModeId);
    assert.equal(caselet.lifecycle.maturity, "ENGLISH_FROZEN", `${mode.sourceModeId}/${example} is not frozen`);
    assert.equal(caselet.lifecycle.englishFreeze, true, `${mode.sourceModeId}/${example} lost freeze flag`);
    assert.equal(caselet.lifecycle.questionStudioDiscoverable, false);
    assert.equal(caselet.lifecycle.questionBankWritable, false);
    assert.equal(caselet.lifecycle.testEligible, false);
    assert.equal(caselet.lifecycle.publiclyPublishable, false);
    questionCount += caselet.children.length;
    const { lifecycle: _lifecycle, ...learnerContent } = caselet;
    approvedCaselets.push(learnerContent);
  }
}

assert.equal(approvedCaselets.length, IOP_001_ENGLISH_FREEZE_AUTHORITY.reviewCaseletCount);
assert.equal(questionCount, IOP_001_ENGLISH_FREEZE_AUTHORITY.reviewQuestionCount);
const learnerContentSha256 = createHash("sha256").update(JSON.stringify(approvedCaselets)).digest("hex");
assert.equal(
  learnerContentSha256,
  APPROVED_LEARNER_CONTENT_SHA256,
  "Approved IOP-001 learner content changed after human English freeze; a new review/approval is required",
);

assert.equal(IOP_001_ENGLISH_FREEZE_AUTHORITY.reviewedHtmlSha256, "a889a98086633330f0619eabd30a06067c79c52780599108591c8ed388657079");
assert.equal(IOP_001_ENGLISH_FREEZE_AUTHORITY.reviewedJsonSha256, "94b5c9b31fb497c972fccba79f948e37db22d6e945a5311f0f7036e52f7fc936");
assert.equal(IOP_001_ENGLISH_FREEZE_AUTHORITY.learnerContentChangeAllowedWithoutNewApproval, false);
assert.equal(IOP_001_ENGLISH_FREEZE_AUTHORITY.hindiPunjabiMayStart, true);

console.log("PASS_IOP_001_ENGLISH_FREEZE_AUTHORITY");
console.log(`approved head ${IOP_001_ENGLISH_FREEZE_AUTHORITY.reviewedHead}`);
console.log(`approved artifact ${IOP_001_ENGLISH_FREEZE_AUTHORITY.reviewedArtifactId}`);
console.log(`frozen QLs ${IOP_001_PERMANENT_QL_AUTHORITIES.length}`);
console.log(`frozen source modes ${IOP_ENGLISH_SOURCE_MODES.length}`);
console.log(`frozen review caselets ${approvedCaselets.length}`);
console.log(`frozen review questions ${questionCount}`);
console.log(`approved learner content sha256 ${learnerContentSha256}`);
console.log("Hindi/Punjabi may start true");
console.log("Question Studio false");
console.log("Question Bank false");
console.log("test eligible false");
console.log("publicly publishable false");
