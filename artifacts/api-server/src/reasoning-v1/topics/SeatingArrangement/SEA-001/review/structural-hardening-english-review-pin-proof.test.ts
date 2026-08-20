import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";

import { SEA001_STRUCTURAL_HARDENING_ENGLISH_REVIEW_PIN as pin } from "./structural-hardening-english-review-pins.ts";

const outputDir = process.argv[2] ?? "/tmp/sea001-review";
const manifest = JSON.parse(await readFile(`${outputDir}/manifest.json`, "utf8")) as {
  candidateId: string;
  blueprintCoverage: Record<string, number>;
  caseletCount: number;
  childQuestionCount: number;
  candidateFingerprint: string;
  existingApprovedFingerprint: string;
  approvalStatus: string;
  replacesApprovedAuthority: boolean;
  productActivationAuthorized: boolean;
};

// The generated English artifact remains immutable historical evidence: it was
// pending when produced. The authority pin records the later explicit approval
// of that exact fingerprint and the subsequently approved multilingual freeze.
assert.equal(manifest.candidateId, pin.candidateId);
assert.equal(manifest.candidateFingerprint, pin.candidateFingerprint, "English review candidate drifted after approval");
assert.equal(manifest.caseletCount, pin.caseletCount);
assert.equal(manifest.childQuestionCount, pin.childQuestionCount);
assert.deepEqual(manifest.blueprintCoverage, pin.blueprintCoverage);
assert.equal(manifest.existingApprovedFingerprint, pin.previousApprovedEnglishFingerprint);
assert.equal(manifest.approvalStatus, "PENDING_HUMAN_REVIEW");
assert.equal(manifest.replacesApprovedAuthority, false);
assert.equal(manifest.productActivationAuthorized, false);

assert.equal(pin.approvalStatus, "APPROVED");
assert.equal(pin.replacesEnglishAuthority, true);
assert.equal(pin.multilingualReplacementStatus, "APPROVED_FROZEN");
assert.equal(pin.multilingualApprovalEvidence, "PR#926_COMMENT_5353895993");
assert.equal(pin.multilingualFreezeAuthority, "SEA001_STRUCTURAL_HARDENING_MULTILINGUAL_FREEZE_V1");
assert.equal(pin.questionStudioReviewOnlyAuthorized, true);
assert.equal(pin.productActivationAuthorized, false);
assert.notEqual(pin.candidateFingerprint, pin.previousApprovedEnglishFingerprint);

console.log("PASS_SEA001_STRUCTURAL_HARDENING_ENGLISH_APPROVAL_PIN");
console.log("candidate", pin.candidateId);
console.log("fingerprint", pin.candidateFingerprint);
console.log("authority approval", pin.approvalStatus);
console.log("multilingual replacement", pin.multilingualReplacementStatus);
console.log("Question Studio review-only authorized", pin.questionStudioReviewOnlyAuthorized);
