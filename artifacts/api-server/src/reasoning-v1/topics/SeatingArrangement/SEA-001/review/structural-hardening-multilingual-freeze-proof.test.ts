import assert from "node:assert/strict";

import { SEA001_STRUCTURAL_HARDENING_ENGLISH_REVIEW_PIN } from "./structural-hardening-english-review-pins.ts";
import {
  SEA001_STRUCTURAL_HARDENING_MULTILINGUAL_FREEZE,
  sea001StructuralHardeningLocalizedFingerprint,
} from "./structural-hardening-multilingual-freeze.ts";

const freeze = SEA001_STRUCTURAL_HARDENING_MULTILINGUAL_FREEZE;

assert.equal(freeze.status, "APPROVED_FROZEN");
assert.equal(freeze.approvedAt, "2026-08-20");
assert.equal(freeze.approvalEvidence, "PR#926_COMMENT_5353895993");
assert.equal(freeze.sourceWorkflowRun, 32347854851);
assert.equal(freeze.sourceArtifactId, 9398731705);
assert.equal(freeze.sourceArtifactZipSha256, "93b3ba757e4557ed1245bbfec2a8d706de1ef52c89a0854d698cbb4b87841991");
assert.equal(freeze.sourceEnglishAuthority, SEA001_STRUCTURAL_HARDENING_ENGLISH_REVIEW_PIN.candidateFingerprint);
assert.equal(freeze.canonicalReviewCaselets, 100);
assert.equal(freeze.localizedReviewCaselets, 200);
assert.equal(freeze.localizedChildQuestions, 800);
assert.equal(freeze.parity.semantic, "200/200");
assert.equal(freeze.parity.approvedEnglishExplanation, "200/200");
assert.equal(freeze.parity.sharedBlock, "200/200");
assert.equal(freeze.parity.caseDecision, "200/200");
assert.equal(freeze.parity.optionRationale, "200/200");
assert.equal(freeze.machineRealness.status, "GREEN");
assert.deepEqual(freeze.machineRealness.blockers, []);
assert.ok(freeze.machineRealness.hindiLargestQuestionTemplateShare <= freeze.machineRealness.pinnedLimit);
assert.ok(freeze.machineRealness.punjabiLargestQuestionTemplateShare <= freeze.machineRealness.pinnedLimit);

const hindiFingerprint = sea001StructuralHardeningLocalizedFingerprint("hi-IN");
const punjabiFingerprint = sea001StructuralHardeningLocalizedFingerprint("pa-IN");
assert.equal(hindiFingerprint, freeze.learnerFingerprints["hi-IN"]);
assert.equal(punjabiFingerprint, freeze.learnerFingerprints["pa-IN"]);

assert.equal(freeze.questionStudioReviewOnlyAuthorized, true);
assert.equal(freeze.questionBankWritable, false);
assert.equal(freeze.mockTestEligible, false);
assert.equal(freeze.productionStagingApproved, false);
assert.equal(freeze.publiclyPublishable, false);

console.log("PASS_SEA001_STRUCTURAL_HARDENING_MULTILINGUAL_FREEZE");
console.log("authority", freeze.authority);
console.log("hindi learner fingerprint", hindiFingerprint);
console.log("punjabi learner fingerprint", punjabiFingerprint);
console.log("Question Studio review-only authorized", freeze.questionStudioReviewOnlyAuthorized);
console.log("Question Bank writable", freeze.questionBankWritable);
console.log("mock/public", freeze.mockTestEligible, freeze.publiclyPublishable);
